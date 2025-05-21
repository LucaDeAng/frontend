import { motion } from 'framer-motion';
import { 
  BrainCircuit, 
  PieChart, 
  MessageSquareText, 
  Image as ImageIcon, 
  Database, 
  LineChart 
} from 'lucide-react';

interface FeatureProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay: number;
}

const Feature = ({ icon, title, description, delay }: FeatureProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: delay * 0.1 }}
      className="flex flex-col p-6 rounded-xl bg-white/5 border border-white/10 hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5"
    >
      <div className="p-3 mb-4 rounded-lg bg-primary/10 w-fit">
        {icon}
      </div>
      
      <h3 className="text-xl font-semibold mb-3 text-white">
        {title}
      </h3>
      
      <p className="text-gray-400 text-base">
        {description}
      </p>
    </motion.div>
  );
};

export default function BusinessFeatures() {
  const features = [
    {
      icon: <BrainCircuit className="h-6 w-6 text-primary" />,
      title: "Consulenza Strategica",
      description: "Definizione di strategie per implementare efficacemente soluzioni di AI generativa in contesti aziendali specifici.",
      delay: 1
    },
    {
      icon: <PieChart className="h-6 w-6 text-primary" />,
      title: "Analisi dei Dati",
      description: "Identificazione di opportunità di ottimizzazione dei processi attraverso l'analisi dei dati aziendali esistenti.",
      delay: 2
    },
    {
      icon: <MessageSquareText className="h-6 w-6 text-primary" />,
      title: "Chatbot Intelligenti",
      description: "Sviluppo di assistenti virtuali avanzati per customer service, HR e supporto interno basati su modelli LLM.",
      delay: 3
    },
    {
      icon: <ImageIcon className="h-6 w-6 text-primary" />,
      title: "Generazione Contenuti",
      description: "Creazione automatizzata di contenuti marketing, documentazione tecnica e materiali formativi personalizzati.",
      delay: 4
    },
    {
      icon: <Database className="h-6 w-6 text-primary" />,
      title: "Knowledge Management",
      description: "Sistemi intelligenti per organizzare, cercare e utilizzare la conoscenza aziendale in modo efficiente.",
      delay: 5
    },
    {
      icon: <LineChart className="h-6 w-6 text-primary" />,
      title: "Previsione Business",
      description: "Strumenti predittivi avanzati per anticipare tendenze di mercato e ottimizzare decisioni strategiche.",
      delay: 6
    }
  ];

  return (
    <section className="py-24 bg-black">
      <div className="container mx-auto px-6 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <div className="inline-flex items-center px-3 py-1 rounded-full border border-primary/30 mb-6 bg-primary/5">
            <span className="text-xs font-medium text-primary">Servizi Professionali</span>
          </div>
          
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
            Soluzioni di intelligenza artificiale <span className="text-primary">per il tuo business</span>
          </h2>
          
          <p className="text-gray-400 text-lg">
            Utilizzo le più avanzate tecnologie di AI generativa per creare soluzioni pratiche che risolvono problemi concreti e generano valore misurabile.
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {features.map((feature, index) => (
            <Feature
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              delay={feature.delay}
            />
          ))}
        </div>
      </div>
    </section>
  );
}