import React from 'react';
import PatternBG from '@/components/ui/PatternBG';

export default function Footer() {
  return (
    <footer className="relative bg-[var(--color-surface)] text-[var(--color-text-secondary)] py-10 mt-16 overflow-hidden">
      {/* Pattern decorativo blu */}
      <div className="absolute inset-0 w-full h-full opacity-30 pointer-events-none z-0">
        <PatternBG />
      </div>
      <div className="relative z-10 container mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 font-mono text-lg">
          <span className="font-bold text-[var(--color-primary)]">{'>'}_</span>
          <span>AI Hub</span>
        </div>
        <div className="text-sm">&copy; {new Date().getFullYear()} AI Hub. Tutti i diritti riservati.</div>
      </div>
    </footer>
  );
} 