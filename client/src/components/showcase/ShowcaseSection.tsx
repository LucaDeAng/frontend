import React from 'react';
import SuccessCard from './SuccessCard';

const showcaseData = [
  {
    title: 'Automazione email marketing con AI',
    client: 'Acme Corp',
    result: '+30% conversioni in 2 mesi',
    highlight: 'AI Marketing',
    logoUrl: '/logos/acme.png',
  },
  {
    title: 'Analisi predittiva vendite',
    client: 'Beta Srl',
    result: 'Previsioni accurate 92%',
    highlight: 'Predictive',
    logoUrl: '/logos/beta.png',
  },
  {
    title: 'Chatbot assistenza clienti',
    client: 'Gamma Spa',
    result: '-40% tempi risposta',
    highlight: 'Chatbot',
    logoUrl: '/logos/gamma.png',
  },
];

const ShowcaseSection: React.FC = () => (
  <section className="container mx-auto py-16">
    <h2 className="text-3xl font-bold text-[var(--color-primary)] mb-8 text-center">Casi di Successo</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {showcaseData.map((item, i) => (
        <SuccessCard key={i} {...item} />
      ))}
    </div>
  </section>
);

export default ShowcaseSection; 