import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Container from '@/components/layout/Container';
import { Helmet } from 'react-helmet';

// Estraggo le categorie da CATEGORY_INFO
const CATEGORY_INFO: Record<string, { desc: string; image: string }> = {
  'AI Techniques': {
    desc: "Tecniche avanzate di intelligenza artificiale, modelli e algoritmi all'avanguardia.",
    image: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500&q=80',
  },
  'Business': {
    desc: "Applicazioni dell'AI nel mondo del business, strategie e casi di successo.",
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500&q=80',
  },
  'Technology': {
    desc: "Novità, trend e approfondimenti sulle tecnologie emergenti.",
    image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500&q=80',
  },
  'Future of Work': {
    desc: "Come l'AI sta trasformando il mondo del lavoro e le professioni del futuro.",
    image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500&q=80',
  },
  'Marketing': {
    desc: "AI e marketing: personalizzazione, automazione e nuove strategie digitali.",
    image: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500&q=80',
  },
  'Research': {
    desc: "Ricerche, studi e scoperte nel campo dell'intelligenza artificiale.",
    image: 'https://images.unsplash.com/photo-1503676382389-4809596d5290?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500&q=80',
  },
  'AI Innovations': {
    desc: "Innovazioni e breakthrough nel mondo dell'AI.",
    image: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500&q=80',
  },
};
const CATEGORIES = Object.keys(CATEGORY_INFO);

export default function PreferencesPage() {
  const queryClient = useQueryClient();
  const { data: prefs } = useQuery({
    queryKey: ['user-preferences'],
    queryFn: async () => {
      const res = await fetch('/api/user/preferences');
      return res.json();
    },
  });

  const [theme, setTheme] = useState('light');
  const [emailNotifications, setEmailNotifications] = useState(false);
  const [categories, setCategories] = useState<string[]>([]);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  // Aggiorna lo stato locale quando arrivano i dati
  React.useEffect(() => {
    if (prefs) {
      setTheme(prefs.theme || 'light');
      setEmailNotifications(!!prefs.emailNotifications);
      setCategories(Array.isArray(prefs.categories) ? prefs.categories : []);
    }
  }, [prefs]);

  const mutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await fetch('/api/user/preferences', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Errore nel salvataggio delle preferenze');
      return res.json();
    },
    onSuccess: () => {
      setSuccess('Preferenze salvate con successo!');
      setError('');
      queryClient.invalidateQueries({ queryKey: ['user-preferences'] });
    },
    onError: () => {
      setError('Errore nel salvataggio delle preferenze');
      setSuccess('');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate({ theme, emailNotifications, categories });
  };

  return (
    <div className="py-20 bg-black min-h-screen">
      <Helmet>
        <title>Preferenze utente | AI Hub</title>
      </Helmet>
      <Container>
        <h1 className="text-3xl font-bold text-white mb-8">Preferenze utente</h1>
        <form className="space-y-8 max-w-xl" onSubmit={handleSubmit}>
          {/* Tema */}
          <div>
            <label className="block text-white font-semibold mb-2">Tema</label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2">
                <input type="radio" name="theme" value="light" checked={theme === 'light'} onChange={() => setTheme('light')} />
                <span>Chiaro</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="radio" name="theme" value="dark" checked={theme === 'dark'} onChange={() => setTheme('dark')} />
                <span>Scuro</span>
              </label>
            </div>
          </div>
          {/* Notifiche email */}
          <div>
            <label className="block text-white font-semibold mb-2">Notifiche email</label>
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={emailNotifications} onChange={e => setEmailNotifications(e.target.checked)} />
              <span>Ricevi notifiche sulle novità</span>
            </label>
          </div>
          {/* Categorie preferite */}
          <div>
            <label className="block text-white font-semibold mb-2">Categorie preferite</label>
            <select
              multiple
              title="Seleziona le tue categorie preferite"
              className="w-full rounded bg-black/30 text-white p-2"
              value={categories}
              onChange={e => {
                const selected = Array.from(e.target.selectedOptions).map(opt => opt.value);
                setCategories(selected);
              }}
            >
              {CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            <div className="text-gray-400 text-sm mt-2">
              Tieni premuto Ctrl (Windows) o Cmd (Mac) per selezionare più categorie.
            </div>
          </div>
          {/* Messaggi */}
          {success && <div className="text-blue-400 text-sm">{success}</div>}
          {error && <div className="text-red-400 text-sm">{error}</div>}
          <button
            type="submit"
            className="bg-primary text-white px-6 py-2 rounded font-semibold hover:bg-primary-dark"
            disabled={mutation.isPending}
          >
            {mutation.isPending ? 'Salvataggio...' : 'Salva preferenze'}
          </button>
        </form>
      </Container>
    </div>
  );
} 