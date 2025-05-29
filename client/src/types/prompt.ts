export interface Comment {
  id: number;
  userName: string;
  text: string;
  date: string;
}

export interface Prompt {
  id: number;
  title: string;
  description: string;
  promptText: string;
  category: string;
  model: string;
  votes: number;
  comments: Comment[];
  dateAdded: string;
  outputExample?: string;
  copyCount?: number;
  userId?: string; // ID dell'utente che ha creato il prompt
  isPublic?: boolean; // Se il prompt è pubblico o privato
  tags?: string[]; // Tag aggiuntivi per la categorizzazione
  lastModified?: string; // Data dell'ultima modifica
  usageCount?: number; // Numero di volte che il prompt è stato utilizzato
  rating?: number; // Valutazione media del prompt
} 