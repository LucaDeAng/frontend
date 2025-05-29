import React from 'react';

interface PatternBGProps {
  className?: string;
  style?: React.CSSProperties;
}

const PatternBG: React.FC<PatternBGProps> = ({ className = '', style = {} }) => (
  <svg
    className={className}
    style={style}
    width="100%"
    height="100%"
    viewBox="0 0 400 200"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    preserveAspectRatio="none"
  >
    <defs>
      <linearGradient id="blueGradient" x1="0" y1="0" x2="400" y2="200" gradientUnits="userSpaceOnUse">
        <stop stopColor="#2563eb" stopOpacity="0.18" />
        <stop offset="1" stopColor="#06b6d4" stopOpacity="0.12" />
      </linearGradient>
    </defs>
    {/* Onde */}
    <path d="M0 120 Q 100 180 200 120 T 400 120" stroke="url(#blueGradient)" strokeWidth="8" fill="none" />
    <path d="M0 160 Q 100 100 200 160 T 400 160" stroke="url(#blueGradient)" strokeWidth="6" fill="none" />
    {/* Punti */}
    {Array.from({ length: 20 }).map((_, i) => (
      <circle key={i} cx={20 + i * 20} cy={180 + 10 * Math.sin(i)} r="2.5" fill="#2563eb" opacity="0.25" />
    ))}
    {/* Circuiti */}
    <rect x="60" y="40" width="8" height="40" rx="4" fill="#2563eb" opacity="0.12" />
    <rect x="320" y="60" width="8" height="40" rx="4" fill="#06b6d4" opacity="0.12" />
    <circle cx="64" cy="40" r="6" fill="#2563eb" opacity="0.18" />
    <circle cx="324" cy="60" r="6" fill="#06b6d4" opacity="0.18" />
  </svg>
);

export default PatternBG; 