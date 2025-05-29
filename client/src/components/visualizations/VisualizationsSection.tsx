import React from 'react';
import ImpactChart from './ImpactChart';

const VisualizationsSection: React.FC = () => (
  <section className="container mx-auto py-16">
    <h2 className="text-3xl font-bold text-[var(--color-primary)] mb-8 text-center">L'impatto dell'AI nei settori</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <ImpactChart />
      {/* Qui puoi aggiungere altre visualizzazioni */}
    </div>
  </section>
);

export default VisualizationsSection; 