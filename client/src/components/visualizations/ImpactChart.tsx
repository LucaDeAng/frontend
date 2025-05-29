import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from 'chart.js';
import { Badge } from '@/components/ui/badge';

Chart.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const data = {
  labels: ['Sanità', 'Finanza', 'Retail', 'Industria', 'Educazione'],
  datasets: [
    {
      label: 'Impatto AI (%)',
      data: [85, 78, 65, 72, 60],
      backgroundColor: 'rgba(37, 99, 235, 0.7)',
      borderRadius: 8,
      borderWidth: 2,
      borderColor: 'rgba(99, 102, 241, 0.8)',
    },
  ],
};

const options = {
  responsive: true,
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      callbacks: {
        label: (ctx: any) => `Impatto: ${ctx.parsed.y}%`,
      },
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      max: 100,
      ticks: {
        color: '#2563eb',
        font: { weight: 'bold' },
      },
      grid: {
        color: 'rgba(37,99,235,0.1)',
      },
    },
    x: {
      ticks: {
        color: '#6366f1',
        font: { weight: 'bold' },
      },
      grid: {
        display: false,
      },
    },
  },
};

const ImpactChart: React.FC = () => (
  <div className="bg-[var(--color-surface)] rounded-2xl p-6 shadow-lg border border-[var(--color-primary)]">
    <div className="flex items-center gap-3 mb-4">
      <Badge variant="primary">Impatto AI nei settori</Badge>
      <span className="text-[var(--color-text-secondary)] text-sm">Fonte: AI Hub Research 2024</span>
    </div>
    <Bar data={data} options={options} height={280} />
  </div>
);

export default ImpactChart; 