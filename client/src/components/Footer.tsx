import { Link } from 'wouter';
import { Brain, Linkedin, Twitter, Github, Mail, FileText, BookOpen, User } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Footer() {
  return (
    <footer className="bg-background/80 backdrop-blur-sm pt-16 pb-8 border-t border-primary/10">
      <div className="container mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 mb-16">
          <div className="md:col-span-5 lg:col-span-4">
            <motion.div 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Link href="/" className="flex items-center mb-6">
                <div className="relative">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary to-accent blur-sm opacity-70"></div>
                  <div className="relative flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-r from-primary to-accent text-white">
                    <Brain className="h-5 w-5" />
                  </div>
                </div>
                <div className="ml-3">
                  <div className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Luca De Angelis</div>
                  <div className="text-xs text-muted-foreground -mt-1">AI Consultant</div>
                </div>
              </Link>
            </motion.div>
            
            <p className="text-muted-foreground mb-6 max-w-md">
              Consulente specializzato in Generative AI per aziende e professionisti. Aiuto a implementare soluzioni di intelligenza artificiale nei processi di business.
            </p>
            
            <div className="flex space-x-4">
              <motion.a 
                href="https://linkedin.com/in/lucadeangelis" 
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-background border border-border hover:bg-primary/5 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Linkedin className="h-5 w-5 text-foreground" />
              </motion.a>
              <motion.a 
                href="https://github.com/lucadeangelis" 
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-background border border-border hover:bg-primary/5 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Github className="h-5 w-5 text-foreground" />
              </motion.a>
              <motion.a 
                href="https://twitter.com/lucadeangelis" 
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-background border border-border hover:bg-primary/5 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Twitter className="h-5 w-5 text-foreground" />
              </motion.a>
              <motion.a 
                href="mailto:luca@deangelis.ai"
                className="p-2 rounded-full bg-background border border-border hover:bg-primary/5 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Mail className="h-5 w-5 text-foreground" />
              </motion.a>
            </div>
          </div>
          
          <div className="md:col-span-2 lg:col-span-2">
            <h3 className="font-semibold mb-6">Naviga</h3>
            <ul className="space-y-4">
              <li>
                <Link href="/" className="flex items-center text-muted-foreground hover:text-primary transition-colors">
                  <div className="w-5 h-5 mr-2 flex items-center justify-center">
                    <Brain className="h-4 w-4" />
                  </div>
                  Home
                </Link>
              </li>
              <li>
                <Link href="/articles" className="flex items-center text-muted-foreground hover:text-primary transition-colors">
                  <div className="w-5 h-5 mr-2 flex items-center justify-center">
                    <BookOpen className="h-4 w-4" />
                  </div>
                  Articoli
                </Link>
              </li>
              <li>
                <Link href="/about" className="flex items-center text-muted-foreground hover:text-primary transition-colors">
                  <div className="w-5 h-5 mr-2 flex items-center justify-center">
                    <User className="h-4 w-4" />
                  </div>
                  Chi sono
                </Link>
              </li>
            </ul>
          </div>
          
          <div className="md:col-span-3">
            <h3 className="font-semibold mb-6">Servizi</h3>
            <ul className="space-y-3">
              <li className="text-muted-foreground">Consulenza strategica AI</li>
              <li className="text-muted-foreground">Implementazione LLM</li>
              <li className="text-muted-foreground">Formazione e workshop</li>
              <li className="text-muted-foreground">Prompt engineering</li>
              <li className="text-muted-foreground">Automazione processi</li>
            </ul>
          </div>
          
          <div className="md:col-span-2 lg:col-span-3">
            <h3 className="font-semibold mb-6">Contatti</h3>
            <div className="space-y-4">
              <div className="flex items-start">
                <Mail className="h-5 w-5 text-primary mr-3 mt-0.5" />
                <a href="mailto:luca@deangelis.ai" className="text-muted-foreground hover:text-primary transition-colors">luca@deangelis.ai</a>
              </div>
              <div className="mt-6">
                <a href="mailto:luca@deangelis.ai" className="inline-flex justify-center items-center px-4 py-2 rounded-full bg-gradient-to-r from-primary to-accent text-white text-sm font-medium hover:opacity-90 transition-opacity shadow-md">
                  <Mail className="h-4 w-4 mr-2" />
                  Contattami
                </a>
              </div>
            </div>
          </div>
        </div>
        
        <div className="border-t border-primary/10 pt-8">
          <p className="text-sm text-muted-foreground text-center">
            &copy; {new Date().getFullYear()} Luca De Angelis • AI Consultant • Tutti i diritti riservati
          </p>
        </div>
      </div>
    </footer>
  );
}
