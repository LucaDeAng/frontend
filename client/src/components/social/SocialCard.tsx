import React from 'react';
import PatternBG from '@/components/ui/PatternBG';
import { Logo } from '@/components/ui/logo';

interface SocialCardProps {
  title: string;
  description?: string;
}

const SocialCard: React.FC<SocialCardProps> = ({ title, description }) => (
  <div className="relative w-[1200px] h-[630px] bg-[var(--color-bg)] flex flex-col justify-between p-16 overflow-hidden rounded-2xl shadow-2xl">
    {/* Pattern decorativo */}
    <PatternBG className="absolute inset-0 w-full h-full opacity-40 pointer-events-none z-0" />
    <div className="relative z-10 flex flex-col h-full justify-between">
      <Logo size="lg" className="mb-8" />
      <div>
        <h1 className="text-5xl font-extrabold text-[var(--color-primary)] mb-4 leading-tight drop-shadow-lg">{title}</h1>
        {description && <p className="text-2xl text-[var(--color-text-secondary)] max-w-3xl">{description}</p>}
      </div>
      <div className="mt-auto text-lg text-[var(--color-text-secondary)]">ai-hub.dev</div>
    </div>
  </div>
);

export default SocialCard; 