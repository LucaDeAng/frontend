import { useState, useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';
import { ArticleMeta } from '@shared/types';
import { FileText, ArrowRight, CalendarDays, Tag } from 'lucide-react';
import { format } from 'date-fns';
import { it } from 'date-fns/locale';

export default function FuturisticArticles() {
  const controls = useAnimation();
  const [hoveredArticle, setHoveredArticle] = useState<string | null>(null);
  
  // Fetch articles
  const { data: articles, isLoading, error } = useQuery<ArticleMeta[]>({
    queryKey: ['/api/articles'],
  });
  
  // Start animation when component mounts
  useEffect(() => {
    controls.start('visible');
  }, [controls]);
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    }
  };
  
  // Card hover effect with 3D transform
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>, slug: string) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = (y - centerY) / 20;
    const rotateY = (centerX - x) / 20;
    
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    setHoveredArticle(slug);
  };
  
  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    e.currentTarget.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
    setHoveredArticle(null);
  };
  
  return (
    <section className="py-20 md:py-32 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-black to-black/90"></div>
      <div className="absolute inset-0 grid-pattern opacity-10"></div>
      
      {/* Animated background elements */}
      <motion.div 
        className="absolute top-0 -left-32 w-96 h-96 rounded-full bg-accent/5 filter blur-[100px]"
        animate={{ 
          opacity: [0.05, 0.1, 0.05], 
          scale: [1, 1.1, 1],
          y: [0, 30, 0] 
        }}
        transition={{ 
          duration: 12, 
          repeat: Infinity,
          repeatType: "mirror" 
        }}
      />
      
      <motion.div 
        className="absolute bottom-0 right-0 w-full h-96 bg-gradient-to-t from-primary/10 to-transparent"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      />
      
      <div className="container relative z-10 px-6 md:px-12 mx-auto">
        <motion.div
          className="text-center max-w-3xl mx-auto mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.7 }}
        >
          <div className="inline-flex items-center px-3 py-1 rounded-full glass border border-primary/30 mb-6">
            <FileText className="w-4 h-4 mr-2 text-primary" />
            <span className="text-xs font-mono tracking-wider text-primary">CONTENUTI RECENTI</span>
          </div>
          
          <h2 className="text-gradient font-mono text-4xl sm:text-5xl md:text-6xl font-bold tracking-tighter mb-6">
            Articoli su Gen AI.
          </h2>
          
          <p className="text-lg text-gray-400 font-mono">
            Approfondimenti, tutorial e analisi sull'intelligenza artificiale generativa
            e le sue applicazioni in ambito business e creativo.
          </p>
        </motion.div>
        
        {isLoading ? (
          <div className="flex justify-center">
            <div className="terminal p-6 text-center">
              <div className="inline-block px-4 py-2 glass border border-primary/30 rounded-md">
                <span className="text-primary-glow font-mono">Caricamento articoli...</span>
                <div className="terminal-cursor inline-block"></div>
              </div>
            </div>
          </div>
        ) : error ? (
          <div className="terminal p-6 text-center glass border border-destructive/30 rounded-lg font-mono text-destructive">
            <span>Errore nel caricamento degli articoli.</span>
          </div>
        ) : (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            animate={controls}
          >
            {articles?.map((article, index) => {
              const formattedDate = format(new Date(article.date), 'd MMMM yyyy', { locale: it });
              const isHovered = hoveredArticle === article.slug;
              
              return (
                <motion.div
                  key={article.slug}
                  variants={itemVariants}
                  className="rotate-3d glass-card border border-white/5 group"
                  style={{ transformStyle: 'preserve-3d' }}
                  onMouseMove={(e) => handleMouseMove(e, article.slug)}
                  onMouseLeave={handleMouseLeave}
                  whileHover={{ 
                    borderColor: 'rgba(0, 255, 100, 0.3)',
                    boxShadow: '0 0 20px rgba(0, 255, 100, 0.2)',
                    transition: { duration: 0.2 }
                  }}
                >
                  {/* Card content with 3D effect */}
                  <div className="p-5 h-full flex flex-col">
                    {/* Article metadata */}
                    <div className="flex justify-between items-center mb-4">
                      <div className="flex items-center space-x-2 text-xs text-gray-400 font-mono">
                        <CalendarDays className="h-3 w-3" />
                        <span>{formattedDate}</span>
                      </div>
                      
                      <div className="px-2 py-1 rounded-full bg-black/30 text-xs font-mono text-primary border border-primary/20">
                        <div className="flex items-center">
                          <Tag className="h-3 w-3 mr-1" />
                          <span>{article.category}</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Title with animated gradient on hover */}
                    <h3 
                      className={`text-xl font-mono font-bold mb-3 transition-all duration-300 ${
                        isHovered ? 'text-gradient' : 'text-white'
                      }`}
                      style={{ transform: 'translateZ(20px)' }}
                    >
                      {article.title}
                    </h3>
                    
                    {/* Summary with subtle 3D effect */}
                    <p 
                      className="mb-6 text-gray-400 font-mono text-sm flex-1"
                      style={{ transform: 'translateZ(10px)' }}
                    >
                      {article.summary}
                    </p>
                    
                    {/* Call to action with animated arrow */}
                    <Link
                      href={`/article/${article.slug}`}
                      className="mt-auto self-start font-mono text-sm text-primary hover:text-primary-glow transition-colors group flex items-center"
                      style={{ transform: 'translateZ(30px)' }}
                    >
                      <span>Leggi l'articolo</span>
                      <motion.div
                        animate={{ 
                          x: isHovered ? 5 : 0 
                        }}
                        transition={{ duration: 0.3 }}
                      >
                        <ArrowRight className="h-4 w-4 ml-2 group-hover:text-primary-glow" />
                      </motion.div>
                    </Link>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}
        
        {/* More articles button */}
        <motion.div
          className="flex justify-center mt-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <Link href="/articles">
            <motion.div
              className="px-6 py-3 glass border border-primary/30 hover:border-primary/50 rounded-full font-mono text-sm flex items-center group"
              whileHover={{ y: -5 }}
              whileTap={{ y: 0 }}
            >
              <span>Esplora tutti gli articoli</span>
              <motion.div
                className="ml-2"
                initial={{ x: 0 }}
                whileHover={{ x: 5 }}
              >
                <ArrowRight className="h-4 w-4" />
              </motion.div>
            </motion.div>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}