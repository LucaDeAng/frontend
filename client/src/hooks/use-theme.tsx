import { createContext, useContext, useEffect, useState } from 'react';

export type Theme = 'light' | 'dark' | 'neon';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // Initialize state based on localStorage or system preference
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme') as Theme | null;
      
      if (savedTheme) {
        return savedTheme;
      }
      
      const systemPreference = window.matchMedia('(prefers-color-scheme: dark)').matches 
        ? 'dark' 
        : 'light';
        
      return systemPreference;
    }
    
    return 'dark'; // Default theme
  });
  
  useEffect(() => {
    const root = window.document.documentElement;
    
    // Remove the previous theme class
    root.classList.remove('light', 'dark', 'neon');
    
    // Add the current theme class
    root.classList.add(theme);
    
    // Save to localStorage
    localStorage.setItem('theme', theme);
  }, [theme]);
  
  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  
  return context;
};
