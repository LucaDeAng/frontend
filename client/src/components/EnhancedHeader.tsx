import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'wouter';
import { 
  Brain, Menu, X, ChevronRight, Code, FileText, BookOpen, 
  Sparkles, Lightbulb, Bot, Search, ChevronDown, Home, User, Hammer 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Logo from './Logo';

export default function EnhancedHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [articlesDropdownOpen, setArticlesDropdownOpen] = useState(false);
  const [location] = useLocation();
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      setScrolled(offset > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (searchOpen && searchRef.current) {
      searchRef.current.focus();
    }
  }, [searchOpen]);

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
      icon: <BookOpen className="h-4 w-4" />, 
      hasDropdown: true,
      dropdown: articleCategories
    },
    { 
      title: 'Prompts', 
      path: '/playground', 
      icon: <Bot className="h-4 w-4" /> 
    },
    { 
      title: 'About Me', 
      path: '/about', 
      icon: <User className="h-4 w-4" /> 
    },
    { 
      title: 'Build in Public', 
      path: '/build-in-public', 
      icon: <Hammer className="h-4 w-4" /> 
    }
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Navigate to articles with search query
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
      <div className="container mx-auto px-6 md:px-12">
        <div className="flex items-center justify-between">
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

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigationItems.map((item) => {
              const isActive = location === item.path || (item.hasDropdown && location.startsWith('/articles'));
              
              return (
                <div 
                  key={item.path} 
                  className="relative"
                  onMouseEnter={() => item.hasDropdown && setArticlesDropdownOpen(true)}
                  onMouseLeave={() => item.hasDropdown && setArticlesDropdownOpen(false)}
                >
                  <Link href={item.path}>
                    <motion.div
                      className={`group relative px-4 py-2 font-mono text-sm ${
                        isActive 
                          ? 'text-primary' 
                          : 'text-gray-300 hover:text-white'
                      } transition-colors duration-300 flex items-center space-x-2 cursor-pointer`}
                      whileHover={{ y: -1 }}
                      whileTap={{ y: 0 }}
                    >
                      <span className={`${isActive ? 'text-primary' : ''}`}>
                        {item.icon}
                      </span>
                      <span>{item.title}</span>
                      {item.hasDropdown && (
                        <ChevronDown className={`h-3 w-3 transition-transform duration-200 ${
                          articlesDropdownOpen ? 'rotate-180' : ''
                        }`} />
                      )}
                      
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

                  {/* Dropdown Menu */}
                  <AnimatePresence>
                    {item.hasDropdown && articlesDropdownOpen && (
                      <motion.div
                        className="absolute top-full left-0 mt-2 w-64 bg-black/95 backdrop-blur-xl border border-primary/20 rounded-xl shadow-2xl overflow-hidden"
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                      >
                        {item.dropdown?.map((dropdownItem, index) => (
                          <Link key={dropdownItem.path} href={dropdownItem.path}>
                            <motion.div
                              className="flex items-center space-x-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-primary/10 transition-colors duration-200"
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.05 }}
                            >
                              {dropdownItem.icon}
                              <span className="font-mono text-sm">{dropdownItem.title}</span>
                            </motion.div>
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </nav>

          {/* Search and Mobile Menu */}
          <div className="flex items-center space-x-4">
            {/* Search Bar */}
            <div className="relative">
              <AnimatePresence>
                {searchOpen ? (
                  <motion.form
                    onSubmit={handleSearch}
                    className="flex items-center"
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: 'auto', opacity: 1 }}
                    exit={{ width: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <input
                      ref={searchRef}
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search articles..."
                      className="w-64 px-4 py-2 bg-black/50 border border-primary/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-primary transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setSearchOpen(false)}
                      className="ml-2 p-2 text-gray-400 hover:text-white transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </motion.form>
                ) : (
                  <motion.button
                    onClick={() => setSearchOpen(true)}
                    className="p-2 text-gray-400 hover:text-white transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Search className="h-5 w-5" />
                  </motion.button>
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
            <div className="flex flex-col h-full pt-20 px-6">
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
                        href={item.path} 
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

                      {/* Mobile Dropdown Items */}
                      {item.hasDropdown && (
                        <div className="mt-2 ml-6 space-y-2">
                          {item.dropdown?.map((dropdownItem) => (
                            <Link 
                              key={dropdownItem.path} 
                              href={dropdownItem.path}
                              onClick={() => setMobileMenuOpen(false)}
                            >
                              <div className="flex items-center space-x-3 p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors">
                                {dropdownItem.icon}
                                <span className="font-mono text-sm">{dropdownItem.title}</span>
                              </div>
                            </Link>
                          ))}
                        </div>
                      )}
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