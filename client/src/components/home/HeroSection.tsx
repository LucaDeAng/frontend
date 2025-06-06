import { Link } from "wouter";
import Container from "@/components/layout/Container";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Brain, Zap } from "lucide-react";
import AnimatedBackground from "@/components/ui/animated-background";
import ScrollReveal from "@/components/ui/scroll-reveal";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden min-h-screen flex items-center section-spacing">
      {/* Enhanced animated background */}
      <AnimatedBackground />
      
      {/* Glassmorphism overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/70 z-10"></div>
      
      <Container className="relative z-10 px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="flex items-center mb-6 space-x-3"
            >
              <div className="py-1 px-3 rounded-full bg-primary/10 dark:bg-primary/20 border border-primary/20 text-primary-foreground/80 flex items-center text-sm font-medium">
                <Sparkles className="h-3.5 w-3.5 mr-2" />
                Generative AI Consultant
              </div>
            </motion.div>
            
            <motion.h1 
              className="mb-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.7 }}
            >
              <span className="block text-foreground">Trasforma il tuo business con la</span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Generative AI</span>
            </motion.h1>
            
            <motion.p 
              className="mb-8 max-w-2xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.7 }}
            >
              Aiuto aziende e professionisti a implementare soluzioni di intelligenza artificiale generativa per aumentare produttività, creatività e innovazione nei processi di business.
            </motion.p>
            
            <motion.div 
              className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.7 }}
            >
              <Button
                asChild
                size="lg"
                className="group rounded-full px-6 text-base font-medium shadow-lg hover:shadow-primary/25 transition-all duration-300"
              >
                <Link href="/about">
                  Chi sono
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="rounded-full bg-background/80 backdrop-blur-sm px-6 text-base font-medium border-primary/20 shadow-sm hover:bg-secondary/50 transition-all duration-300"
              >
                <Link href="/articles">
                  Leggi gli articoli
                </Link>
              </Button>
            </motion.div>
          </motion.div>
          
          <motion.div 
            className="relative"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 0.7 }}
          >
            <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-background/30 backdrop-blur-sm border border-primary/10 p-2">
              <img 
                src="https://images.unsplash.com/photo-1531746790731-6c087fecd65a?ixlib=rb-4.0.3&auto=format&fit=crop&w=900&h=700&q=80" 
                alt="Modern tech workspace with AI elements" 
                className="rounded-xl w-full h-auto object-cover" 
                loading="lazy"
              />
              
              {/* Glassmorphism effects */}
              <motion.div 
                className="absolute inset-0 rounded-2xl opacity-0 hover:opacity-100 transition-opacity duration-500 bg-gradient-to-t from-black/60 to-transparent"
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
              ></motion.div>
            </div>
            
            {/* Decorative elements */}
            <motion.div 
              className="absolute -bottom-5 -right-5 md:-bottom-8 md:-right-8 w-32 h-32 md:w-40 md:h-40 rounded-full bg-accent opacity-20 dark:opacity-30 blur-3xl"
              animate={{ 
                scale: [1, 1.1, 1], 
                opacity: [0.2, 0.3, 0.2] 
              }}
              transition={{ 
                duration: 8, 
                repeat: Infinity,
                repeatType: "reverse" 
              }}
            ></motion.div>
            <motion.div 
              className="absolute -top-5 -left-5 md:-top-8 md:-left-8 w-32 h-32 md:w-40 md:h-40 rounded-full bg-primary opacity-20 dark:opacity-30 blur-3xl"
              animate={{ 
                scale: [1, 1.15, 1], 
                opacity: [0.2, 0.25, 0.2] 
              }}
              transition={{ 
                duration: 10, 
                repeat: Infinity,
                repeatType: "reverse" 
              }}
            ></motion.div>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
