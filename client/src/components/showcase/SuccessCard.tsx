import React from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import PatternBG from '@/components/ui/PatternBG';

interface SuccessCardProps {
  title: string;
  client: string;
  result: string;
  highlight?: string;
  logoUrl?: string;
}

const SuccessCard: React.FC<SuccessCardProps> = ({ title, client, result, highlight, logoUrl }) => (
  <Card className="relative overflow-hidden group hover:shadow-2xl transition-shadow duration-300">
    {/* Pattern decorativo */}
    <PatternBG className="absolute inset-0 w-full h-full opacity-10 pointer-events-none z-0" />
    <CardHeader className="relative z-10 flex flex-row items-center gap-4 pb-2">
      {logoUrl && <img src={logoUrl} alt={client} className="w-12 h-12 rounded-full border-2 border-[var(--color-primary)] bg-white object-contain" />}
      <div>
        <h3 className="text-lg font-bold text-[var(--color-primary)]">{client}</h3>
        <div className="text-base text-[var(--color-text)]">{title}</div>
      </div>
      {highlight && <Badge variant="highlight" className="ml-auto">{highlight}</Badge>}
    </CardHeader>
    <CardContent className="relative z-10">
      <div className="text-[var(--color-text-secondary)] text-sm mb-2">Risultato:</div>
      <div className="text-[var(--color-text)] font-semibold text-lg">{result}</div>
    </CardContent>
  </Card>
);

export default SuccessCard; 