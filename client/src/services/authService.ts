import { User } from '@/types/user';

// Simuliamo un database locale con localStorage
const AUTH_STORAGE_KEY = 'auth_data';
const USER_STORAGE_KEY = 'user_data';

export const authService = {
  // Registra un nuovo utente
  register: async (email: string, password: string, username: string): Promise<User> => {
    // TODO: Implementare la chiamata API reale
    const user: User = {
      id: Date.now().toString(),
      email,
      username,
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
      preferences: {
        theme: 'dark',
        language: 'it',
        notifications: true
      }
    };

    // Salva i dati dell'utente
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({ email, token: 'dummy-token' }));

    return user;
  },

  // Effettua il login
  login: async (email: string, password: string): Promise<User> => {
    // TODO: Implementare la chiamata API reale
    const user: User = {
      id: '1',
      email,
      username: 'Utente Test',
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
      preferences: {
        theme: 'dark',
        language: 'it',
        notifications: true
      }
    };

    // Salva i dati dell'utente
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({ email, token: 'dummy-token' }));

    return user;
  },

  // Effettua il logout
  logout: (): void => {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    localStorage.removeItem(USER_STORAGE_KEY);
  },

  // Verifica se l'utente è autenticato
  isAuthenticated: (): boolean => {
    return !!localStorage.getItem(AUTH_STORAGE_KEY);
  },

  // Ottieni l'utente corrente
  getCurrentUser: (): User | null => {
    const userData = localStorage.getItem(USER_STORAGE_KEY);
    if (!userData) return null;
    return JSON.parse(userData);
  },

  // Aggiorna i dati dell'utente
  updateUser: (updates: Partial<User>): User => {
    const currentUser = authService.getCurrentUser();
    if (!currentUser) throw new Error('Utente non autenticato');

    const updatedUser = { ...currentUser, ...updates };
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(updatedUser));
    return updatedUser;
  },

  // Aggiorna le preferenze dell'utente
  updatePreferences: (preferences: User['preferences']): User => {
    const currentUser = authService.getCurrentUser();
    if (!currentUser) throw new Error('Utente non autenticato');

    const updatedUser = {
      ...currentUser,
      preferences: { ...currentUser.preferences, ...preferences }
    };
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(updatedUser));
    return updatedUser;
  }
}; 