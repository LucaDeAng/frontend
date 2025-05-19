import { Layers, Lightbulb, Users } from "lucide-react";
import Container from "@/components/layout/Container";

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  iconBgClass: string;
  iconTextClass: string;
}

function FeatureCard({ icon, title, description, iconBgClass, iconTextClass }: FeatureCardProps) {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-md hover:shadow-lg transition-shadow p-6 border border-gray-200 dark:border-gray-700">
      <div className={`w-12 h-12 rounded-lg ${iconBgClass} flex items-center justify-center mb-4`}>
        <div className={iconTextClass}>{icon}</div>
      </div>
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{title}</h3>
      <p className="text-gray-600 dark:text-gray-300">
        {description}
      </p>
    </div>
  );
}

export default function FeaturesSection() {
  const features = [
    {
      icon: <Layers className="h-6 w-6" />,
      title: "Articoli Specializzati",
      description: "Contenuti curati da esperti del settore per mantenerti aggiornato sulle ultime novità nel campo dell'AI.",
      iconBgClass: "bg-primary-100 dark:bg-primary-900/40",
      iconTextClass: "text-primary-600 dark:text-primary-400"
    },
    {
      icon: <Lightbulb className="h-6 w-6" />,
      title: "AI Playground",
      description: "Sperimenta con modelli di intelligenza artificiale direttamente nel browser, senza bisogno di installazioni.",
      iconBgClass: "bg-accent-100 dark:bg-accent-900/40",
      iconTextClass: "text-accent-600 dark:text-accent-400"
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "Comunità Attiva",
      description: "Condividi le tue esperienze, fai domande e collabora con altri appassionati di intelligenza artificiale.",
      iconBgClass: "bg-primary-100 dark:bg-primary-900/40",
      iconTextClass: "text-primary-600 dark:text-primary-400"
    }
  ];

  return (
    <section className="py-16 bg-gray-50 dark:bg-gray-800">
      <Container>
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Cosa offre AI Hub?</h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Tutto ciò di cui hai bisogno per iniziare con l'intelligenza artificiale in un unico posto.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FeatureCard key={index} {...feature} />
          ))}
        </div>
      </Container>
    </section>
  );
}
