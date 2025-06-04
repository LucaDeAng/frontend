export interface UserPreferences {
  theme: 'light' | 'dark' | 'neon';
  language: string;
  notifications: boolean;
}

export interface User {
  id: string;
  email: string;
  username: string;
  createdAt: string;
  lastLogin: string;
  preferences: UserPreferences;
  avatar?: string;
  bio?: string;
  role?: 'user' | 'admin' | 'moderator';
  stats?: {
    promptsCreated: number;
    promptsShared: number;
    totalVotes: number;
    totalComments: number;
  };
} 