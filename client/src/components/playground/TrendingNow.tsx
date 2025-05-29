import React, { useEffect, useState } from 'react';
import { getTrendingPrompts } from '@/services/trendingService';

interface TrendingNowProps {
  prompts?: Array<{
    id: number;
    title: string;
    votes: number;
    category: string;
  }>;
  fetchPrompts?: () => Promise<any[]>;
}

const TrendingNow: React.FC<TrendingNowProps> = ({ prompts, fetchPrompts }) => {
  const [trending, setTrending] = useState(prompts || []);
  const [loading, setLoading] = useState(!prompts);

  useEffect(() => {
    if (!prompts && fetchPrompts) {
      setLoading(true);
      getTrendingPrompts(fetchPrompts).then(data => {
        setTrending(data.sort((a, b) => b.votes - a.votes).slice(0, 5));
        setLoading(false);
      });
    }
  }, [prompts, fetchPrompts]);

  if (loading) return <div className="mb-8 text-gray-400">Caricamento trending...</div>;

  return (
    <div className="mb-8 p-4 bg-black/40 border border-primary/30 rounded-xl">
      <h2 className="text-xl font-bold text-primary mb-4">Trending Now</h2>
      <ul className="space-y-2">
        {trending.map((prompt) => (
          <li key={prompt.id} className="flex justify-between items-center">
            <span className="font-medium text-white">{prompt.title}</span>
            <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full ml-2">
              {prompt.votes} voti
            </span>
            <span className="ml-2 text-xs text-gray-400">{prompt.category}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TrendingNow; 