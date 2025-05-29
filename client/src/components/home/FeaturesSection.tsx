import { Brain, Code, FileText, Lightbulb, Sparkles, Users, Zap } from "lucide-react";
import Container from "@/components/layout/Container";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay: number;
  gradient: string;
}

function FeatureCard({ icon, title, description, delay, gradient }: FeatureCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      className="relative group"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-background to-background rounded-2xl transition-all duration-300 group-hover:from-primary/5 group-hover:to-accent/5"></div>
      
      <div className="relative bg-background/70 backdrop-blur-sm rounded-2xl shadow-md border border-border/50 p-8 h-full transition-all duration-300 group-hover:shadow-xl group-hover:border-primary/20">
        <div className={cn(
          "w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-transform duration-300 group-hover:scale-110",
          "bg-gradient-to-br shadow-md", 
          gradient
        )}>
          <div className="text-white">{icon}</div>
        </div>
        
        <h3 className="text-xl font-semibold text-foreground mb-3">{title}</h3>
        <p>
          {description}
        </p>
      </div>
    </motion.div>
  );
}

export default function FeaturesSection() {
  const features = [
    {
      icon: <FileText className="h-6 w-6" />,
      title: "Articoli Specializzati",
      description: "Contenuti curati da esperti del settore per mantenerti aggiornato sulle ultime novità nel campo dell'AI.",
      gradient: "from-blue-600 to-indigo-600",
      delay: 0.1
    },
    {
      icon: <Code className="h-6 w-6" />,
      title: "AI Playground",
      description: "Sperimenta con modelli di intelligenza artificiale direttamente nel browser, senza bisogno di installazioni.",
      gradient: "from-blue-500 to-blue-600",
      delay: 0.2
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "Comunità Attiva",
      description: "Condividi le tue esperienze, fai domande e collabora con altri appassionati di intelligenza artificiale.",
      gradient: "from-purple-600 to-violet-700",
      delay: 0.3
    },
    {
      icon: <Brain className="h-6 w-6" />,
      title: "Modelli All'avanguardia",
      description: "Accedi ai modelli di AI più recenti come GPT-4, Claude, Llama e altri per i tuoi progetti e sperimentazioni.",
      gradient: "from-amber-500 to-orange-600",
      delay: 0.4
    },
    {
      icon: <Sparkles className="h-6 w-6" />,
      title: "Prompt Library",
      description: "Collezione di prompt ottimizzati per diversi casi d'uso, pronti per essere utilizzati nei tuoi progetti.",
      gradient: "from-pink-500 to-rose-600",
      delay: 0.5
    },
    {
      icon: <Zap className="h-6 w-6" />,
      title: "Tutorial Pratici",
      description: "Guide passo-passo per implementare soluzioni AI nei tuoi progetti, con esempi di codice e best practices.",
      gradient: "from-cyan-500 to-blue-600",
      delay: 0.6
    }
  ];

  return (
    <section className="py-24">
      <Container className="px-6 md:px-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-secondary text-secondary-foreground text-sm font-medium mb-6">
            <Lightbulb className="h-4 w-4 mr-2" />
            Use Cases
          </div>
          <h2 className="mb-6">Cosa puoi fare con AI Hub?</h2>
          <p className="max-w-2xl mx-auto">
            Esplora una vasta gamma di funzionalità e risorse per sfruttare al massimo il potenziale dell'intelligenza artificiale nei tuoi progetti.
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FeatureCard key={index} {...feature} />
          ))}
        </div>
      </Container>
    </section>
  );
}
