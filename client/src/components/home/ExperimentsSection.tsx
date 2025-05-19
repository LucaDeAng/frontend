import { motion, useAnimation } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Brain, Sparkles, Atom, Zap, ArrowRight, Code, Cpu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';

// Types
interface Experiment {
  id: string;
  title: string;
  description: string;
  icon: JSX.Element;
  link: string;
  linkText: string;
  gradient: string;
  delay: number;
  techLabel: string;
}

export default function ExperimentsSection() {
  const [activeExperiment, setActiveExperiment] = useState<string | null>(null);
  const controls = useAnimation();
  
  // Start animation when component mounts
  useEffect(() => {
    controls.start('visible');
  }, [controls]);
  
  // Animation variants for staggered card appearance
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };
  
  const cardVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { 
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    }
  };
  
  // Experiment data
  const experiments: Experiment[] = [
    {
      id: 'text-generation',
      title: 'Text Generation',
      description: 'Tecniche avanzate di generazione testuale basate su Large Language Models con controllo fine del processo creativo attraverso prompt engineering.',
      icon: <Brain className="h-6 w-6" />,
      link: '/articles/generative-ai-business',
      linkText: 'Leggi articolo',
      gradient: 'from-emerald-500 to-lime-400',
      delay: 0.1,
      techLabel: 'GPT-4, Claude, Llama'
    },
    {
      id: 'creative-coding',
      title: 'Creative Coding',
      description: 'Esplorazione della creatività algoritmica con processi generativi guidati dai più recenti modelli di intelligenza artificiale per creazione di arte e design.',
      icon: <Sparkles className="h-6 w-6" />,
      link: '/articles/ai-creative-industries',
      linkText: 'Esplora progetti',
      gradient: 'from-fuchsia-600 to-pink-500',
      delay: 0.2,
      techLabel: 'Midjourney, SD-XL, DALL-E 3'
    },
    {
      id: 'data-analysis',
      title: 'Data Analysis',
      description: 'Analisi avanzata di grandi volumi di dati attraverso modelli predittivi e tecniche di visualizzazione interattiva alimentate da AI.',
      icon: <Atom className="h-6 w-6" />,
      link: '/articles/ai-future-work',
      linkText: 'Scopri metodologia',
      gradient: 'from-cyan-500 to-blue-400',
      delay: 0.3,
      techLabel: 'Python, TensorFlow, PyTorch'
    },
    {
      id: 'process-automation',
      title: 'Process Automation',
      description: 'Sistemi intelligenti di automazione di workflow aziendali con integrazione di agenti AI per ottimizzare processi complessi e ridurre errori.',
      icon: <Zap className="h-6 w-6" />,
      link: '/articles/generative-ai-business',
      linkText: 'Vedi casi studio',
      gradient: 'from-amber-500 to-orange-400',
      delay: 0.4,
      techLabel: 'LangChain, AutoGPT, Agents'
    },
    {
      id: 'code-generation',
      title: 'Code Generation',
      description: 'Sviluppo assistito da AI con generazione automatica di codice ottimizzato e sicuro, riducendo tempi e costi di implementazione.',
      icon: <Code className="h-6 w-6" />,
      link: '/articles/ai-future-work',
      linkText: 'Esplora soluzioni',
      gradient: 'from-violet-600 to-purple-500',
      delay: 0.5,
      techLabel: 'Copilot, Codeium, CodeWhisperer'
    },
    {
      id: 'ai-systems',
      title: 'AI Systems',
      description: 'Architetture avanzate per implementazione di sistemi AI scalabili e flessibili con monitoraggio delle performance e gestione etica.',
      icon: <Cpu className="h-6 w-6" />,
      link: '/articles/ai-creative-industries',
      linkText: 'Scopri framework',
      gradient: 'from-red-500 to-rose-400',
      delay: 0.6,
      techLabel: 'MLOps, Docker, Kubernetes'
    }
  ];

  return (
    <section className="py-20 md:py-32 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-black bg-opacity-90"></div>
      <div className="absolute inset-0 grid-pattern opacity-5"></div>
      
      <motion.div 
        className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-primary/10 filter blur-[100px]"
        animate={{ 
          opacity: [0.05, 0.1, 0.05], 
          scale: [1, 1.1, 1] 
        }}
        transition={{ 
          duration: 10, 
          repeat: Infinity,
          repeatType: "mirror" 
        }}
      />
      
      <div className="container relative z-10 px-6 md:px-12 mx-auto">
        <motion.div
          className="max-w-3xl mx-auto text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.7 }}
        >
          <div className="inline-flex items-center px-3 py-1 rounded-full glass border border-primary/30 mb-6">
            <Sparkles className="w-4 h-4 mr-2 text-primary" />
            <span className="text-xs font-mono tracking-wider text-primary">ESPERIMENTI AI</span>
          </div>
          
          <h2 className="text-gradient font-mono text-4xl sm:text-5xl md:text-6xl font-bold tracking-tighter mb-6">
            Laboratorio di AI.
          </h2>
          
          <p className="text-lg text-gray-400 font-mono">
            Esplora i miei esperimenti con le tecnologie AI più avanzate.
            Ogni progetto è un'esplorazione delle possibilità creative e pratiche dell'intelligenza artificiale.
          </p>
        </motion.div>
        
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate={controls}
        >
          {experiments.map((experiment) => (
            <motion.div
              key={experiment.id}
              variants={cardVariants}
              className="relative group"
              onMouseEnter={() => setActiveExperiment(experiment.id)}
              onMouseLeave={() => setActiveExperiment(null)}
              whileHover={{ 
                y: -10,
                transition: { duration: 0.3 }
              }}
            >
              {/* Card background with subtle animation */}
              <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500 rounded-xl bg-gradient-to-r ${experiment.gradient}`}></div>
              
              {/* Card container with glass effect */}
              <div className="glass-card border border-white/5 group-hover:border-primary/20 h-full p-6 flex flex-col">
                <div className="flex justify-between items-start mb-4">
                  {/* Icon with gradient background */}
                  <div className={`flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-br ${experiment.gradient} shadow-lg`}>
                    {experiment.icon}
                  </div>
                  
                  {/* Technology tag */}
                  <span className="text-xs font-mono py-1 px-2 rounded border border-white/10 text-gray-400 backdrop-blur-md">
                    {experiment.techLabel}
                  </span>
                </div>
                
                {/* Content */}
                <h3 className="text-xl font-mono font-bold mb-3 text-white group-hover:text-primary-glow transition-colors duration-300">
                  {experiment.title}
                </h3>
                
                <p className="mb-6 text-gray-400 font-mono text-sm flex-1">
                  {experiment.description}
                </p>
                
                {/* Link button */}
                <Button 
                  asChild
                  variant="outline" 
                  className="mt-auto w-full justify-between rounded-lg border-primary/20 hover:border-primary/50 bg-black/50 hover:bg-black/70 font-mono text-xs group"
                >
                  <Link href={experiment.link}>
                    <span>{experiment.linkText}</span>
                    <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </Link>
                </Button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}