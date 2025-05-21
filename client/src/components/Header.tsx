import { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { Brain, Menu, X, ChevronRight, Code, FileText, BookOpen, Sparkles, Lightbulb, Bot } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [location] = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      setScrolled(offset > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  // Glitch animation variants
  const glitchVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: {
        type: "spring",
        stiffness: 260,
        damping: 20
      } 
    },
    exit: { 
      opacity: 0,
      x: 20,
      transition: { duration: 0.2 } 
    }
  };

  // Menu links with animation
  const links = [
    { title: 'Home', path: '/', icon: <Sparkles className="h-4 w-4" /> },
    { title: 'Articles', path: '/articles', icon: <BookOpen className="h-4 w-4" /> },
    { title: 'Playground', path: '/playground', icon: <Bot className="h-4 w-4" /> }
  ];

  const navVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: -20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'py-2 glass backdrop-blur-xl border-b border-primary/20' 
          : 'py-3 bg-black/80 backdrop-blur-sm'
      }`}
    >
      <div className="container mx-auto px-6 md:px-12">
        <div className="flex items-center justify-between">
          {/* Enhanced Logo */}
          <Link href="/">
            <motion.div 
              className="flex items-center hover:scale-105 transition-all duration-300"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="relative flex items-center mr-4">
                {/* Logo glow effect with pulsing animation */}
                <motion.div 
                  className="absolute inset-0 rounded-full bg-primary blur-xl opacity-30 scale-150"
                  animate={{ 
                    scale: [1.5, 1.7, 1.5],
                    opacity: [0.3, 0.5, 0.3]
                  }}
                  transition={{ 
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut" 
                  }}
                />
                
                {/* Multi-layered logo for depth */}
                <div className="relative">
                  <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-primary/40 to-secondary/40 blur-sm"></div>
                  <div className="absolute -inset-0.5 rounded-full bg-gradient-to-r from-primary/60 to-secondary/60 blur-[2px]"></div>
                  
                  <div className="relative flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-primary via-secondary to-accent border border-white/20 shadow-lg">
                    {/* Orbit effect */}
                    <motion.div 
                      className="absolute w-full h-full rounded-full border-2 border-transparent"
                      style={{
                        borderLeftColor: 'rgba(var(--primary), 0.4)',
                        borderTopColor: 'rgba(var(--secondary), 0.4)'
                      }}
                      animate={{
                        rotate: [0, 360]
                      }}
                      transition={{
                        duration: 10,
                        repeat: Infinity,
                        ease: "linear"
                      }}
                    />
                    
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ 
                        type: "spring",
                        stiffness: 260,
                        damping: 20,
                        delay: 0.3
                      }}
                    >
                      <Brain className="h-6 w-6 text-white drop-shadow-glow" />
                    </motion.div>
                  </div>
                </div>
              </div>
              
              <div>
                <motion.div 
                  className="font-mono font-bold tracking-tight text-xl relative group"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <div className="relative">
                    <span className="text-white font-bold text-xl">AI Hub</span>
                    
                    <motion.span
                      className="absolute bottom-0 left-0 w-full h-0.5 bg-primary"
                      initial={{ scaleX: 0, originX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                    />
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </Link>
          
          {/* Desktop Navigation */}
          <motion.nav
            className="hidden md:block"
            variants={navVariants}
            initial="hidden"
            animate="visible"
          >
            <ul className="flex items-center space-x-8">
              {links.map((link) => {
                const isActive = location === link.path;
                return (
                  <motion.li key={link.path} variants={itemVariants}>
                    <Link href={link.path}>
                      <motion.div
                        className={`group relative px-4 py-2 font-mono text-sm ${
                          isActive 
                            ? 'text-primary-glow' 
                            : 'text-gray-400 hover:text-white'
                        } transition-colors duration-300 flex items-center space-x-2 hoverable`}
                        whileHover={{ y: -2 }}
                        whileTap={{ y: 0 }}
                      >
                        <span className={`${isActive ? 'text-primary-glow' : ''}`}>
                          {link.icon}
                        </span>
                        <span>{link.title}</span>
                        
                        {/* Underline animation */}
                        <motion.span
                          className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary to-transparent"
                          initial={{ scaleX: isActive ? 1 : 0 }}
                          animate={{ scaleX: isActive ? 1 : 0 }}
                          whileHover={{ scaleX: 1 }}
                          transition={{ duration: 0.3 }}
                        />
                      </motion.div>
                    </Link>
                  </motion.li>
                );
              })}
            </ul>
          </motion.nav>
          
          {/* Mobile Menu Button */}
          <motion.button
            className="flex md:hidden p-2 rounded-full glass border border-primary/20"
            onClick={toggleMobileMenu}
            whileTap={{ scale: 0.9 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <motion.div
              initial={{ rotate: 0 }}
              animate={{ rotate: mobileMenuOpen ? 90 : 0 }}
              transition={{ duration: 0.3 }}
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5 text-primary" />
              ) : (
                <Menu className="h-5 w-5 text-primary" />
              )}
            </motion.div>
          </motion.button>
        </div>
      </div>
      
      {/* Mobile Navigation Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            className="fixed inset-0 z-40 glass"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="w-full h-full flex flex-col items-center justify-center"
              variants={glitchVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <ul className="space-y-6 text-center">
                {links.map((link, index) => (
                  <motion.li 
                    key={link.path}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 + 0.2 }}
                    className={location === link.path ? 'text-primary-glow' : ''}
                  >
                    <Link 
                      href={link.path} 
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <div className="flex items-center justify-center space-x-3 text-xl font-mono hover:text-primary-glow transition-colors duration-300">
                        <div className="p-2 rounded-full bg-black/30 border border-primary/20">
                          {link.icon}
                        </div>
                        <span>{link.title}</span>
                        <ChevronRight className="h-4 w-4 opacity-50" />
                      </div>
                    </Link>
                  </motion.li>
                ))}
              </ul>
              
              <motion.div 
                className="mt-12 font-mono text-sm text-gray-500 border-t border-primary/10 pt-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                ESC per chiudere
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
