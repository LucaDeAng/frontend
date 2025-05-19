import { useState } from 'react';
import { Link } from 'wouter';
import ThemeToggle from '@/components/ThemeToggle';
import { Brain, Menu, X } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-xl bg-background/80 border-b border-primary/10">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {/* Logo */}
          <Link href="/" className="flex items-center font-semibold text-xl">
            <motion.div 
              className="flex items-center justify-center mr-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="relative">
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary to-accent blur-sm opacity-70"></div>
                <div className="relative flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-r from-primary to-accent text-white">
                  <Brain className="h-5 w-5" />
                </div>
              </div>
              <div className="ml-2">
                <div className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Luca De Angelis</div>
                <div className="text-xs text-muted-foreground -mt-1">AI Consultant</div>
              </div>
            </motion.div>
          </Link>
        </div>
        
        <div className="hidden md:flex items-center space-x-6">
          <nav>
            <ul className="flex space-x-8">
              <li>
                <Link href="/" className="text-sm font-medium text-foreground hover:text-primary transition-colors py-2">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/articles" className="text-sm font-medium text-foreground hover:text-primary transition-colors py-2">
                  Articoli
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-sm font-medium text-foreground hover:text-primary transition-colors py-2">
                  Chi sono
                </Link>
              </li>
            </ul>
          </nav>
        </div>
        
        <div className="flex items-center space-x-4">
          <ThemeToggle />
          
          <button
            className="md:hidden focus:outline-none rounded-full p-1.5 hover:bg-primary/10 transition-colors"
            onClick={toggleMobileMenu}
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>
      
      {/* Mobile menu */}
      <motion.nav 
        className={`${mobileMenuOpen ? 'block' : 'hidden'} px-4 py-3 bg-background border-t border-primary/10`}
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: mobileMenuOpen ? 1 : 0, height: mobileMenuOpen ? 'auto' : 0 }}
        transition={{ duration: 0.2 }}
      >
        <ul className="space-y-4 py-2">
          <li>
            <Link 
              href="/" 
              className="block text-sm font-medium text-foreground hover:text-primary transition-colors py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
          </li>
          <li>
            <Link 
              href="/articles" 
              className="block text-sm font-medium text-foreground hover:text-primary transition-colors py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Articoli
            </Link>
          </li>
          <li>
            <Link 
              href="/about" 
              className="block text-sm font-medium text-foreground hover:text-primary transition-colors py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Chi sono
            </Link>
          </li>
        </ul>
      </motion.nav>
    </header>
  );
}
