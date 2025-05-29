import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';

interface User {
  id: string;
  role: string;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [, setLocation] = useLocation();

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      try {
        // Decodifica il token JWT
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUser(payload);
      } catch (error) {
        localStorage.removeItem('adminToken');
      }
    }
    setLoading(false);
  }, []);

  const login = async (username: string, password: string) => {
    try {
      console.log('Tentativo di login con:', { username, password });
      
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        console.log('Login fallito:', response.status);
        throw new Error('Credenziali non valide');
      }

      const { token } = await response.json();
      console.log('Login riuscito, token ricevuto');
      localStorage.setItem('adminToken', token);
      
      // Decodifica il token e imposta l'utente
      const payload = JSON.parse(atob(token.split('.')[1]));
      setUser(payload);
      
      return true;
    } catch (error) {
      console.error('Errore durante il login:', error);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('adminToken');
    setUser(null);
    setLocation('/admin/login');
  };

  const isAdmin = user?.role === 'admin';

  return {
    user,
    loading,
    login,
    logout,
    isAdmin
  };
} 