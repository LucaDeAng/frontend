import * as React from 'react';
import { motion } from 'framer-motion';

export interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showFullName?: boolean;
  className?: string;
}

const sizeConfig = {
  sm: 'text-lg',
  md: 'text-2xl',
  lg: 'text-4xl',
};

export const Logo: React.FC<LogoProps> = ({ size = 'md', showFullName = true, className }) => {
  return (
    <motion.div
      className={`flex items-center font-mono font-bold gap-2 select-none ${sizeConfig[size]} ${className || ''}`}
      initial={{ filter: 'drop-shadow(0 0 0px #2563eb)' }}
      whileHover={{ filter: 'drop-shadow(0 0 12px #2563eb)' }}
      transition={{ duration: 0.3 }}
    >
      {/* Icona terminale/code */}
      <motion.span
        className="inline-block text-[var(--color-primary)] bg-[var(--color-surface)] rounded-md px-2 py-1 shadow"
        whileHover={{ scale: 1.08 }}
        transition={{ duration: 0.2 }}
      >
        {'>'}_
      </motion.span>
      {showFullName && (
        <span className="tracking-wider text-[var(--color-text)]">
          <span className="font-bold">Luca</span> De<span className="-ml-2">Angelis</span>
        </span>
      )}
    </motion.div>
  );
}; 