import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'wouter';
import { 
  Brain, Menu, X, ChevronRight, Code, FileText, BookOpen, 
  Sparkles, Lightbulb, Bot, Search, ChevronDown, Home, User, Hammer, ArrowUp, Settings 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Logo from './Logo';
import { useQuery } from '@tanstack/react-query';

export default function EnhancedHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [articlesDropdownOpen, setArticlesDropdownOpen] = useState(false);
  const [location] = useLocation();
  const searchRef = useRef<HTMLInputElement>(null);

  // Ricerca avanzata
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchType, setSearchType] = useState<'article'>('article');
  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    return JSON.parse(localStorage.getItem('recentSearches') || '[]');
  });

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const offset = window.scrollY;
          setScrolled(offset > 50);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (searchOpen && searchRef.current) {
      searchRef.current.focus();
    }
  }, [searchOpen]);

  useEffect(() => {
    if (searchQuery.length > 1) {
      setSearchLoading(true);
      fetch(`/api/search?q=${encodeURIComponent(searchQuery)}&type=${searchType}`)
        .then(res => res.json())
        .then(data => {
          setSearchResults(data);
          setSearchLoading(false);
        });
    } else {
      setSearchResults([]);
    }
  }, [searchQuery, searchType]);

  // Article categories for dropdown
  const articleCategories = [
    { title: 'All Articles', path: '/articles', icon: <BookOpen className="h-4 w-4" /> },
    { title: 'AI Research', path: '/articles?category=research', icon: <Brain className="h-4 w-4" /> },
    { title: 'Machine Learning', path: '/articles?category=ml', icon: <Bot className="h-4 w-4" /> },
    { title: 'Technology', path: '/articles?category=tech', icon: <Code className="h-4 w-4" /> },
    { title: 'Tutorials', path: '/articles?category=tutorials', icon: <Lightbulb className="h-4 w-4" /> }
  ];

  // Menu links with dropdowns
  const navigationItems = [
    { 
      title: 'Home', 
      path: '/', 
      icon: <Home className="h-4 w-4" /> 
    },
    { 
      title: 'Articles', 
      path: '/articles', 
      icon: <BookOpen className="h-4 w-4" /> 
    },
    { 
      title: 'Prompts', 
      path: '/playground', 
      icon: <Bot className="h-4 w-4" /> 
    },
    {
      title: 'About & Build',
      custom: true,
      render: () => (
        <div className="flex items-center gap-2">
          <Link href="/about">
            <span className="flex items-center gap-1 text-gray-300 hover:text-primary transition-colors font-mono text-sm">
              <User className="h-4 w-4" />
              About Me
            </span>
          </Link>
          <span className="text-gray-500">|</span>
          <Link href="/build-in-public">
            <span className="flex items-center gap-1 text-gray-300 hover:text-primary transition-colors font-mono text-sm">
              <Hammer className="h-4 w-4" />
              Build in Public
            </span>
          </Link>
        </div>
      )
    }
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Salva ricerca recente
      const updated = [searchQuery, ...recentSearches.filter(s => s !== searchQuery)].slice(0, 5);
      setRecentSearches(updated);
      localStorage.setItem('recentSearches', JSON.stringify(updated));
      // Vai alla pagina risultati
      window.location.href = `/articles?search=${encodeURIComponent(searchQuery)}`;
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled 
          ? 'py-3 glass backdrop-blur-xl border-b border-primary/30 shadow-2xl' 
          : 'py-4 bg-black/90 backdrop-blur-md'
      }`}
    >
      <div className="container mx-auto max-w-screen-xl px-4 sm:px-6 md:px-12">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/">
            <motion.div 
              className="flex items-center hover:scale-105 transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Logo 
                size="md" 
                variant="dark" 
                showFullName={true}
              />
            </motion.div>
          </Link>

          {/* Desktop Navigation centrata */}
          <nav className="hidden md:flex items-center space-x-8 flex-grow justify-center">
            {navigationItems.map((item) => {
              if (item.custom && item.render) {
                return (
                  <div key={item.title} className="relative px-4 py-2">
                    {item.render()}
                  </div>
                );
              }
              const isActive = location === item.path;
              return (
                <div key={item.path} className="relative">
                  <Link href={item.path || '#'}>
                    <motion.div
                      className={`group relative px-4 py-2 font-mono text-sm ${
                        isActive 
                          ? 'text-primary' 
                          : 'text-gray-300 hover:text-white'
                      } transition-colors duration-300 flex items-center space-x-2 cursor-pointer`}
                      whileHover={{ y: -1 }}
                      whileTap={{ y: 0 }}
                    >
                      <span className={`${isActive ? 'text-primary' : ''}`}>{item.icon}</span>
                      <span>{item.title}</span>
                      {/* Active indicator */}
                      <motion.span
                        className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-primary to-secondary"
                        initial={{ scaleX: isActive ? 1 : 0 }}
                        animate={{ scaleX: isActive ? 1 : 0 }}
                        whileHover={{ scaleX: 1 }}
                        transition={{ duration: 0.3 }}
                      />
                    </motion.div>
                  </Link>
                </div>
              );
            })}
          </nav>

          {/* Icona Preferenze e Search/Menu mobile a destra */}
          <div className="flex items-center gap-2 ml-auto">
            <Link href="/preferences">
              <span className="flex items-center text-xs text-gray-400 hover:text-primary transition-colors gap-1" title="Preferenze">
                <Settings className="w-4 h-4" />
              </span>
            </Link>
            {/* Search and Mobile Menu */}
            <div className="flex items-center space-x-4">
              {/* Search Bar */}
              <div className="relative">
                <AnimatePresence>
                  {searchOpen ? (
                    <motion.div
                      initial={{ width: 0, opacity: 0 }}
                      animate={{ width: "100%", opacity: 1 }}
                      exit={{ width: 0, opacity: 0 }}
                      className="absolute right-0 z-50 w-full"
                      style={{ maxWidth: "22.5rem" }}
                    >
                      <form onSubmit={handleSearch} className="flex items-center bg-zinc-900 border border-primary/30 rounded-lg px-3 py-2 shadow-lg w-full">
                        <Search className="h-4 w-4 text-primary mr-2" />
                        <input
                          ref={searchRef}
                          type="text"
                          value={searchQuery}
                          onChange={e => setSearchQuery(e.target.value)}
                          className="bg-transparent outline-none text-white flex-1"
                          placeholder="Cerca articoli, prompt, risorse..."
                          autoFocus
                        />
                        <button 
                          type="button" 
                          onClick={() => setSearchOpen(false)} 
                          className="ml-2 text-gray-400 hover:text-white"
                          aria-label="Chiudi ricerca"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </form>
                      {/* Filtri */}
                      <div className="flex space-x-2 mt-2 px-1">
                        <button onClick={() => setSearchType('article')} className={`px-2 py-1 rounded text-xs ${searchType==='article' ? 'bg-primary text-black' : 'bg-zinc-800 text-gray-300'}`}>Articoli</button>
                        {/* <button ...>Prompt</button> <button ...>Risorse</button> */}
                      </div>
                      {/* Risultati live */}
                        <div className="bg-zinc-900 border border-primary/20 rounded-lg mt-2 max-h-80 overflow-y-auto shadow-xl w-full">
                        {searchLoading && <div className="p-4 text-gray-400">Caricamento...</div>}
                        {!searchLoading && searchQuery && searchResults.length === 0 && (
                          <div className="p-4 text-gray-400">Nessun risultato</div>
                        )}
                        {!searchLoading && searchResults.map((r, i) => (
                          <Link href={`/article/${r.slug}`} key={r.slug} onClick={() => setSearchOpen(false)}>
                            <div className="p-3 border-b border-white/5 hover:bg-primary/10 cursor-pointer">
                              <div className="font-bold text-white" dangerouslySetInnerHTML={{__html: r.highlight.title || r.title}} />
                              <div className="text-xs text-gray-400 mt-1" dangerouslySetInnerHTML={{__html: r.highlight.summary || r.summary}} />
                            </div>
                          </Link>
                        ))}
                        {/* Suggerimenti e ricerche recenti */}
                        {!searchQuery && recentSearches.length > 0 && (
                          <div className="p-2">
                            <div className="text-xs text-gray-400 mb-1">Ricerche recenti:</div>
                            <div className="flex flex-wrap gap-2">
                              {recentSearches.map((s, i) => (
                                <button key={i} onClick={() => setSearchQuery(s)} className="px-2 py-1 bg-zinc-800 rounded text-xs text-gray-300 hover:bg-primary/20">{s}</button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ) : (
                    <button 
                      onClick={() => setSearchOpen(true)} 
                      className="text-gray-400 hover:text-white"
                      aria-label="Apri ricerca"
                    >
                      <Search className="h-5 w-5" />
                    </button>
                  )}
                </AnimatePresence>
              </div>

              {/* Mobile Menu Button */}
              <motion.button
                className="flex md:hidden p-2 rounded-lg bg-black/30 border border-primary/20"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                whileTap={{ scale: 0.9 }}
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
        </div>
      </div>

      {/* Enhanced Mobile Navigation */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            className="fixed inset-0 z-40 bg-black/95 backdrop-blur-xl md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex flex-col h-full pt-20 px-6 overflow-y-auto">
              {/* Mobile Search */}
              <form onSubmit={handleSearch} className="mb-8">
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search articles..."
                    className="w-full px-4 py-3 bg-black/50 border border-primary/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-primary"
                  />
                  <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                </div>
              </form>

              {/* Mobile Navigation Items */}
              <nav className="flex-1">
                <ul className="space-y-4">
                  {navigationItems.map((item, index) => (
                    <motion.li 
                      key={item.path}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 + 0.2 }}
                    >
                      <Link 
                        href={item.path || '#'} 
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <div className={`flex items-center space-x-4 p-4 rounded-lg border ${
                          location === item.path 
                            ? 'text-primary bg-primary/10 border-primary/30' 
                            : 'text-gray-300 hover:text-white hover:bg-white/5 border-gray-700'
                        } transition-all duration-300`}>
                          <div className="p-2 rounded-lg bg-black/30 border border-primary/20">
                            {item.icon}
                          </div>
                          <span className="font-mono text-lg">{item.title}</span>
                          <ChevronRight className="h-4 w-4 opacity-50 ml-auto" />
                        </div>
                      </Link>
                    </motion.li>
                  ))}
                </ul>
              </nav>

              {/* Mobile Footer */}
              <motion.div 
                className="border-t border-primary/20 pt-6 text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                <p className="text-gray-400 font-mono text-sm mb-2">Swipe or tap to navigate</p>
                <div className="flex justify-center space-x-4">
                  <div className="w-2 h-2 bg-primary/50 rounded-full"></div>
                  <div className="w-2 h-2 bg-primary/30 rounded-full"></div>
                  <div className="w-2 h-2 bg-primary/30 rounded-full"></div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}