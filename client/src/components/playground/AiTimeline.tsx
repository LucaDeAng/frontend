import React from 'react';
import { getAiTimeline } from '@/services/timelineService';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';

interface TimelineEvent {
  id: number;
  date: string;
  title: string;
  description: string;
}

const mockFetchTimeline = async (): Promise<TimelineEvent[]> => {
  // Simulazione fetch timeline
  return [
    {
      id: 1,
      date: '2024-06-01',
      title: 'Lancio di GPT-4o',
      description: 'OpenAI rilascia GPT-4o, nuovo modello multimodale.'
    },
    {
      id: 2,
      date: '2024-05-15',
      title: 'Google presenta Gemini',
      description: 'Annunciato il nuovo modello AI Gemini da Google.'
    }
  ];
};

const AiTimeline: React.FC = () => {
  const [events, setEvents] = React.useState<TimelineEvent[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    getAiTimeline(mockFetchTimeline).then(data => {
      setEvents(data);
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="mb-8 text-gray-400">Caricamento timeline...</div>;

  return (
    <div className="mb-8 p-4 bg-black/40 border border-blue-400/30 rounded-xl">
      <h2 className="text-xl font-bold text-blue-400 mb-4">AI Timeline</h2>
      <ul className="space-y-6">
        {events.map((ev, i) => (
          <motion.li
            key={ev.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1, duration: 0.5 }}
            className="relative pl-12"
          >
            <span className="absolute left-0 top-0">
              <Badge variant="accent">{ev.date}</Badge>
            </span>
            <div className="font-semibold text-[var(--color-primary)] text-lg mb-1">{ev.title}</div>
            <div className="text-[var(--color-text-secondary)] text-sm">{ev.description}</div>
            {i < events.length - 1 && (
              <span className="absolute left-4 top-8 w-1 h-8 bg-gradient-to-b from-blue-400/60 to-transparent rounded-full"></span>
            )}
          </motion.li>
        ))}
      </ul>
    </div>
  );
};

export default AiTimeline; 