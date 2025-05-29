import { Prompt } from '@/types/prompt';

interface UserPromptData {
  favorites: Prompt[];
  history: {
    prompt: Prompt;
    usedAt: string;
  }[];
  created: Prompt[];
}

// Simuliamo un database locale con localStorage
const STORAGE_KEY = 'user_prompt_data';

export const userPromptService = {
  // Ottieni tutti i dati dell'utente
  getUserData: (): UserPromptData => {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      return {
        favorites: [],
        history: [],
        created: []
      };
    }
    return JSON.parse(data);
  },

  // Salva i dati dell'utente
  saveUserData: (data: UserPromptData): void => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  },

  // Aggiungi un prompt ai preferiti
  addToFavorites: (prompt: Prompt): void => {
    const data = userPromptService.getUserData();
    if (!data.favorites.some(p => p.id === prompt.id)) {
      data.favorites.push(prompt);
      userPromptService.saveUserData(data);
    }
  },

  // Rimuovi un prompt dai preferiti
  removeFromFavorites: (promptId: number): void => {
    const data = userPromptService.getUserData();
    data.favorites = data.favorites.filter(p => p.id !== promptId);
    userPromptService.saveUserData(data);
  },

  // Aggiungi un prompt alla cronologia
  addToHistory: (prompt: Prompt): void => {
    const data = userPromptService.getUserData();
    data.history.unshift({
      prompt,
      usedAt: new Date().toISOString()
    });
    // Mantieni solo le ultime 50 voci nella cronologia
    if (data.history.length > 50) {
      data.history = data.history.slice(0, 50);
    }
    userPromptService.saveUserData(data);
  },

  // Aggiungi un prompt creato
  addCreatedPrompt: (prompt: Prompt): void => {
    const data = userPromptService.getUserData();
    data.created.unshift(prompt);
    userPromptService.saveUserData(data);
  },

  // Rimuovi un prompt creato
  removeCreatedPrompt: (promptId: number): void => {
    const data = userPromptService.getUserData();
    data.created = data.created.filter(p => p.id !== promptId);
    userPromptService.saveUserData(data);
  },

  // Aggiorna un prompt creato
  updateCreatedPrompt: (promptId: number, updates: Partial<Prompt>): void => {
    const data = userPromptService.getUserData();
    data.created = data.created.map(p => 
      p.id === promptId ? { ...p, ...updates } : p
    );
    userPromptService.saveUserData(data);
  },

  // Pulisci la cronologia
  clearHistory: (): void => {
    const data = userPromptService.getUserData();
    data.history = [];
    userPromptService.saveUserData(data);
  }
}; 