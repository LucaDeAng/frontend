import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Brain, Sparkles, Terminal, Code, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';

export default function FuturisticHero() {
  const [typedText, setTypedText] = useState('');
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const textOptions = [
    'AI Generativa',
    'Machine Learning',
    'Prompt Engineering',
    'Consulenza AI',
    'Automazione'
  ];
  const typingSpeed = 80; // ms per character
  const deletingSpeed = 40; // ms per character
  const pauseTime = 1500; // ms pause before deleting
  const typingRef = useRef<NodeJS.Timeout | null>(null);

  // Terminal typing effect
  useEffect(() => {
    const startTypingEffect = () => {
      const currentFullText = textOptions[currentTextIndex];
      
      if (typedText === currentFullText) {
        // Pause before deleting
        typingRef.current = setTimeout(() => {
          deleteText();
        }, pauseTime);
      } else if (typedText === '') {
        // Start typing the next text
        typingRef.current = setTimeout(() => {
          setTypedText(currentFullText.charAt(0));
        }, typingSpeed);
      } else if (typedText.length < currentFullText.length) {
        // Continue typing
        typingRef.current = setTimeout(() => {
          setTypedText(typedText + currentFullText.charAt(typedText.length));
        }, typingSpeed);
      }
    };
    
    const deleteText = () => {
      if (typedText.length > 0) {
        // Delete one character
        typingRef.current = setTimeout(() => {
          setTypedText(typedText.substring(0, typedText.length - 1));
        }, deletingSpeed);
      } else {
        // Move to next text
        setCurrentTextIndex((currentTextIndex + 1) % textOptions.length);
      }
    };
    
    startTypingEffect();
    
    return () => {
      if (typingRef.current) clearTimeout(typingRef.current);
    };
  }, [typedText, currentTextIndex, textOptions]);

  // Animation variants
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
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { 
        type: "spring",
        damping: 15
      }
    }
  };

  // Scroll handler
  const handleScroll = () => {
    window.scrollTo({
      top: window.innerHeight,
      behavior: 'smooth'
    });
  };

  return (
    <section className="min-h-screen relative flex flex-col justify-center overflow-hidden">
      {/* Grid pattern background */}
      <div className="absolute inset-0 grid-pattern opacity-30"></div>
      
      {/* Animated background gradient */}
      <motion.div 
        className="absolute top-20 -left-32 w-96 h-96 rounded-full bg-primary/20 filter blur-[100px]"
        animate={{ 
          x: [0, 50, 0], 
          y: [0, 30, 0], 
          scale: [1, 1.2, 1],
          opacity: [0.2, 0.3, 0.2] 
        }}
        transition={{ 
          duration: 15, 
          repeat: Infinity,
          repeatType: "mirror" 
        }}
      />
      
      <motion.div 
        className="absolute bottom-20 -right-32 w-96 h-96 rounded-full bg-secondary/20 filter blur-[100px]"
        animate={{ 
          x: [0, -50, 0], 
          y: [0, -30, 0], 
          scale: [1, 1.2, 1],
          opacity: [0.2, 0.3, 0.2] 
        }}
        transition={{ 
          duration: 18, 
          repeat: Infinity,
          repeatType: "mirror",
          delay: 2 
        }}
      />
      
      <motion.div 
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-accent/20 filter blur-[120px]"
        animate={{ 
          scale: [1, 1.3, 1],
          opacity: [0.1, 0.2, 0.1] 
        }}
        transition={{ 
          duration: 20, 
          repeat: Infinity,
          repeatType: "mirror",
          delay: 1 
        }}
      />
      
      <div className="container px-6 md:px-12 mx-auto relative z-10 pt-24">
        <motion.div
          className="flex flex-col items-center text-center mb-16"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Pre-title */}
          <motion.div 
            variants={itemVariants}
            className="inline-flex items-center px-3 py-1 mb-8 rounded-full glass border border-primary/30"
          >
            <Sparkles className="w-4 h-4 mr-2 text-primary" />
            <span className="text-xs font-mono text-primary-glow tracking-wider">INTELLIGENZA ARTIFICIALE GENERATIVA</span>
          </motion.div>
          
          {/* Main title */}
          <motion.h1 
            variants={itemVariants}
            className="mb-4 max-w-4xl glitch"
            data-text="Visioni del futuro attraverso l'intelligenza artificiale"
          >
            <span className="text-gradient font-mono tracking-tighter">Visioni del futuro attraverso l'intelligenza artificiale</span>
          </motion.h1>
          
          {/* Terminal-like subtitle */}
          <motion.div 
            variants={itemVariants}
            className="flex items-center justify-center mb-10 gap-3"
          >
            <span className="text-2xl md:text-3xl font-mono text-white">Specializzato in</span>
            <div className="terminal inline-block min-w-[280px] py-2 px-4 h-12 flex items-center">
              <Terminal className="h-4 w-4 mr-2 text-primary" />
              <span className="text-2xl md:text-3xl text-primary-glow font-mono">{typedText}</span>
              <span className="terminal-cursor"></span>
            </div>
          </motion.div>
          
          {/* Description */}
          <motion.p 
            variants={itemVariants}
            className="text-lg md:text-xl mb-10 max-w-2xl text-gray-300 font-mono"
          >
            Trasformo le idee in prodotti attraverso l'applicazione di tecnologie AI all'avanguardia. 
            Consulenza, implementazione e soluzioni personalizzate per il futuro della tua azienda.
          </motion.p>
          
          {/* CTA buttons */}
          <motion.div 
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-5 justify-center"
          >
            <Button
              asChild
              size="lg"
              className="group px-6 py-6 rounded-full bg-gradient-to-r from-primary to-primary hover:from-primary hover:to-secondary transition-all duration-500 text-black font-mono font-bold shadow-lg hover:shadow-primary/25"
            >
              <Link href="/about">
                <Brain className="mr-2 h-5 w-5 group-hover:animate-pulse" />
                Scopri di più
              </Link>
            </Button>
            
            <Button
              asChild
              variant="outline"
              size="lg"
              className="px-6 py-6 rounded-full bg-transparent border border-primary/30 hover:bg-primary/10 text-white font-mono shadow-lg backdrop-blur-sm"
            >
              <Link href="/articles">
                <Code className="mr-2 h-5 w-5" />
                Leggi gli articoli
              </Link>
            </Button>
          </motion.div>
        </motion.div>
        
        {/* Scroll indicator */}
        <motion.div 
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex flex-col items-center"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 0.5 }}
        >
          <motion.div
            onClick={handleScroll}
            className="p-2 rounded-full glass border border-primary/30 cursor-pointer"
            whileHover={{ y: 5, scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            animate={{ y: [0, 8, 0] }}
            transition={{ 
              y: { duration: 1.5, repeat: Infinity },
              scale: { duration: 0.2 }
            }}
          >
            <ChevronDown className="h-5 w-5 text-primary" />
          </motion.div>
          <span className="mt-2 text-xs font-mono text-gray-500">Scorri</span>
        </motion.div>
      </div>
      
      {/* Abstract decorative element */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black to-transparent z-2"></div>
    </section>
  );
}