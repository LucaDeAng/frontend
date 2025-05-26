import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { motion } from 'framer-motion';
import { Home, BookOpen, Bot, Menu as MenuIcon, X, User, Hammer } from 'lucide-react';

export default function Menu() {
  const [location] = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menuItems = [
    { name: 'Home', path: '/', icon: <Home className="h-4 w-4" /> },
    { name: 'Articles', path: '/articles', icon: <BookOpen className="h-4 w-4" /> },
    { name: 'Prompts', path: '/playground', icon: <Bot className="h-4 w-4" /> },
    { name: 'About Me', path: '/about', icon: <User className="h-4 w-4" /> },
    { name: 'Build in Public', path: '/build-in-public', icon: <Hammer className="h-4 w-4" /> }
  ];

  return (
    <>
      {/* Mobile menu button */}
      <div className="md:hidden">
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="text-white hover:text-primary-100 transition-colors"
        >
          {isMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <MenuIcon className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* Desktop menu */}
      <div className="hidden md:flex items-center space-x-1">
        {menuItems.map((item) => (
          <Link href={item.path} key={item.name}>
            <a className={`relative px-4 py-2 rounded-lg ${
              location === item.path 
                ? 'text-primary' 
                : 'text-white hover:text-primary/80'
              }`}
            >
              <div className="flex items-center space-x-2">
                {item.icon}
                <span>{item.name}</span>
              </div>
              {location === item.path && (
                <motion.div
                  layoutId="menu-underline"
                  className="absolute bottom-0 left-0 right-0 h-[2px] bg-primary"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2 }}
                />
              )}
            </a>
          </Link>
        ))}
      </div>

      {/* Mobile menu dropdown */}
      {isMenuOpen && (
        <motion.div 
          className="absolute top-16 left-0 right-0 bg-black/95 border-b border-white/10 md:hidden z-50"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          <div className="container mx-auto px-6 py-4">
            <div className="flex flex-col space-y-3">
              {menuItems.map((item) => (
                <Link 
                  href={item.path} 
                  key={item.name}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <a className={`flex items-center space-x-3 px-2 py-2 rounded-lg ${
                    location === item.path 
                      ? 'text-primary bg-primary/10' 
                      : 'text-gray-300 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {item.icon}
                    <span>{item.name}</span>
                  </a>
                </Link>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </>
  );
}