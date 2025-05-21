import { Link } from 'wouter';
import { Brain, Linkedin, Twitter, Github, Mail, FileText, BookOpen, User } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Footer() {
  return (
    <footer className="bg-background/80 backdrop-blur-sm pt-12 pb-6 border-t border-primary/10">
      <div className="container mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
          <div>
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
                  <div className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">GenAI Hub</div>
                  <div className="text-xs text-muted-foreground -mt-1">MASTERING AI TOGETHER</div>
                </div>
              </Link>
            </motion.div>
            
            <p className="text-muted-foreground mb-6 max-w-md">
              Explore cutting-edge resources, tutorials, and insights on generative AI technologies. Learn how to leverage AI models effectively in your projects and workflows.
            </p>
            
            <div className="flex space-x-4">
              <motion.a 
                href="https://linkedin.com/" 
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-background border border-border hover:bg-primary/5 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Linkedin className="h-5 w-5 text-foreground" />
              </motion.a>
              <motion.a 
                href="https://github.com/" 
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-background border border-border hover:bg-primary/5 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Github className="h-5 w-5 text-foreground" />
              </motion.a>
              <motion.a 
                href="https://twitter.com/" 
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-background border border-border hover:bg-primary/5 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Twitter className="h-5 w-5 text-foreground" />
              </motion.a>
              <motion.a 
                href="mailto:contact@genai-hub.com"
                className="p-2 rounded-full bg-background border border-border hover:bg-primary/5 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Mail className="h-5 w-5 text-foreground" />
              </motion.a>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold mb-6">Navigation</h3>
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
                    Articles
                  </Link>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-6">Contact</h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <Mail className="h-5 w-5 text-primary mr-3 mt-0.5" />
                  <a href="mailto:contact@genai-hub.com" className="text-muted-foreground hover:text-primary transition-colors">contact@genai-hub.com</a>
                </div>
                <div className="mt-6">
                  <a href="mailto:contact@genai-hub.com" className="inline-flex justify-center items-center px-4 py-2 rounded-full bg-gradient-to-r from-primary to-accent text-white text-sm font-medium hover:opacity-90 transition-opacity shadow-md">
                    <Mail className="h-4 w-4 mr-2" />
                    Contact Us
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="border-t border-primary/10 pt-6">
          <p className="text-sm text-muted-foreground text-center">
            &copy; {new Date().getFullYear()} GenAI Hub • All rights reserved
          </p>
        </div>
      </div>
    </footer>
  );
}
