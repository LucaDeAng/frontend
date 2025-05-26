import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, Clock, TrendingUp, X, Tag } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { cn } from '@/lib/utils';

interface SearchResult {
  id: number;
  type: 'article' | 'prompt';
  title: string;
  summary: string;
  category: string;
  tags: string[];
  url: string;
  highlight?: string;
}

interface SearchSuggestion {
  query: string;
  count: number;
  type: 'popular' | 'recent';
}

interface AdvancedSearchProps {
  isOpen: boolean;
  onClose: () => void;
  onSearch: (query: string, filters?: SearchFilters) => void;
}

interface SearchFilters {
  contentType: 'all' | 'articles' | 'prompts';
  category?: string;
  tags?: string[];
  dateRange?: '7d' | '30d' | '90d' | 'all';
}

export default function AdvancedSearch({ isOpen, onClose, onSearch }: AdvancedSearchProps) {
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState<SearchFilters>({ contentType: 'all' });
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  // Fetch search suggestions
  const { data: suggestions = [] } = useQuery({
    queryKey: ['/api/search/suggestions'],
    enabled: showSuggestions && query.length > 1,
  });

  // Fetch search results
  const { data: results = [], isLoading } = useQuery({
    queryKey: ['/api/search', query, filters],
    enabled: query.length > 2,
  });

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    // Load recent searches from localStorage
    const saved = localStorage.getItem('recentSearches');
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

  const handleSearch = (searchQuery: string = query) => {
    if (searchQuery.trim()) {
      // Save to recent searches
      const updated = [searchQuery, ...recentSearches.filter(s => s !== searchQuery)].slice(0, 5);
      setRecentSearches(updated);
      localStorage.setItem('recentSearches', JSON.stringify(updated));
      
      onSearch(searchQuery, filters);
      setShowSuggestions(false);
    }
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem('recentSearches');
  };

  const categories = ['AI Research', 'Machine Learning', 'Technology', 'Tutorials'];
  const popularTags = ['AI', 'Claude', 'GPT', 'Neural Networks', 'Ethics', 'Future Tech'];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="container-enhanced mx-auto pt-20 px-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="max-w-4xl mx-auto">
              {/* Search Header */}
              <div className="glass-card mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold text-white">Advanced Search</h2>
                  <button
                    onClick={onClose}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                  >
                    <X className="h-5 w-5 text-gray-400" />
                  </button>
                </div>

                {/* Main Search Input */}
                <div className="relative mb-6">
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      ref={inputRef}
                      type="text"
                      value={query}
                      onChange={(e) => {
                        setQuery(e.target.value);
                        setShowSuggestions(e.target.value.length > 0);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleSearch();
                        }
                        if (e.key === 'Escape') {
                          onClose();
                        }
                      }}
                      placeholder="Search articles, prompts, and resources..."
                      className="w-full pl-12 pr-4 py-4 bg-black/50 border border-primary/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-primary text-lg"
                    />
                  </div>

                  {/* Search Suggestions Dropdown */}
                  <AnimatePresence>
                    {showSuggestions && (query.length > 0 || recentSearches.length > 0) && (
                      <motion.div
                        className="absolute top-full left-0 right-0 mt-2 bg-black/95 border border-primary/20 rounded-xl shadow-2xl overflow-hidden z-10"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                      >
                        {/* Recent Searches */}
                        {recentSearches.length > 0 && query.length === 0 && (
                          <div className="p-4 border-b border-gray-700">
                            <div className="flex items-center justify-between mb-3">
                              <h4 className="text-sm font-medium text-gray-300 flex items-center">
                                <Clock className="h-4 w-4 mr-2" />
                                Recent Searches
                              </h4>
                              <button
                                onClick={clearRecentSearches}
                                className="text-xs text-gray-500 hover:text-gray-300"
                              >
                                Clear
                              </button>
                            </div>
                            {recentSearches.map((search, index) => (
                              <button
                                key={index}
                                onClick={() => handleSearch(search)}
                                className="block w-full text-left px-3 py-2 text-gray-300 hover:bg-white/5 rounded-lg transition-colors"
                              >
                                {search}
                              </button>
                            ))}
                          </div>
                        )}

                        {/* Popular Suggestions */}
                        {suggestions.length > 0 && query.length > 1 && (
                          <div className="p-4">
                            <h4 className="text-sm font-medium text-gray-300 mb-3 flex items-center">
                              <TrendingUp className="h-4 w-4 mr-2" />
                              Popular Searches
                            </h4>
                            {suggestions.slice(0, 5).map((suggestion: SearchSuggestion, index: number) => (
                              <button
                                key={index}
                                onClick={() => handleSearch(suggestion.query)}
                                className="block w-full text-left px-3 py-2 text-gray-300 hover:bg-white/5 rounded-lg transition-colors"
                              >
                                <span>{suggestion.query}</span>
                                <span className="text-xs text-gray-500 ml-2">
                                  ({suggestion.count} results)
                                </span>
                              </button>
                            ))}
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Advanced Filters */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Content Type Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Content Type
                    </label>
                    <select
                      value={filters.contentType}
                      onChange={(e) => setFilters(prev => ({ 
                        ...prev, 
                        contentType: e.target.value as SearchFilters['contentType'] 
                      }))}
                      className="w-full px-3 py-2 bg-black/50 border border-primary/20 rounded-lg text-white focus:outline-none focus:border-primary"
                    >
                      <option value="all">All Content</option>
                      <option value="articles">Articles</option>
                      <option value="prompts">Prompts</option>
                    </select>
                  </div>

                  {/* Category Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Category
                    </label>
                    <select
                      value={filters.category || ''}
                      onChange={(e) => setFilters(prev => ({ 
                        ...prev, 
                        category: e.target.value || undefined 
                      }))}
                      className="w-full px-3 py-2 bg-black/50 border border-primary/20 rounded-lg text-white focus:outline-none focus:border-primary"
                    >
                      <option value="">All Categories</option>
                      {categories.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>

                  {/* Date Range Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Date Range
                    </label>
                    <select
                      value={filters.dateRange || 'all'}
                      onChange={(e) => setFilters(prev => ({ 
                        ...prev, 
                        dateRange: e.target.value as SearchFilters['dateRange'] 
                      }))}
                      className="w-full px-3 py-2 bg-black/50 border border-primary/20 rounded-lg text-white focus:outline-none focus:border-primary"
                    >
                      <option value="all">All Time</option>
                      <option value="7d">Past Week</option>
                      <option value="30d">Past Month</option>
                      <option value="90d">Past 3 Months</option>
                    </select>
                  </div>
                </div>

                {/* Popular Tags */}
                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-300 mb-3">
                    Popular Tags
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {popularTags.map(tag => (
                      <button
                        key={tag}
                        onClick={() => handleSearch(tag)}
                        className="px-3 py-1 bg-primary/20 border border-primary/30 text-primary rounded-full text-sm hover:bg-primary/30 transition-colors"
                      >
                        #{tag}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Search Results */}
              {query.length > 2 && (
                <motion.div
                  className="glass-card"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-white">
                      Search Results {results.length > 0 && `(${results.length})`}
                    </h3>
                    {isLoading && (
                      <div className="w-5 h-5 border-2 border-primary border-r-transparent rounded-full animate-spin" />
                    )}
                  </div>

                  {results.length > 0 ? (
                    <div className="space-y-4">
                      {results.map((result: SearchResult) => (
                        <motion.div
                          key={result.id}
                          className="p-4 bg-black/30 border border-primary/10 rounded-lg hover:border-primary/30 transition-colors"
                          whileHover={{ y: -2 }}
                        >
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="text-white font-medium hover:text-primary transition-colors">
                              <a href={result.url}>
                                {result.highlight ? (
                                  <span dangerouslySetInnerHTML={{ __html: result.highlight }} />
                                ) : (
                                  result.title
                                )}
                              </a>
                            </h4>
                            <span className="text-xs text-gray-400 bg-black/50 px-2 py-1 rounded">
                              {result.type}
                            </span>
                          </div>
                          <p className="text-gray-300 text-sm mb-3 line-clamp-2">
                            {result.summary}
                          </p>
                          <div className="flex items-center space-x-4 text-xs text-gray-400">
                            <span className="flex items-center">
                              <Filter className="h-3 w-3 mr-1" />
                              {result.category}
                            </span>
                            {result.tags.length > 0 && (
                              <div className="flex items-center space-x-1">
                                <Tag className="h-3 w-3" />
                                {result.tags.slice(0, 3).map(tag => (
                                  <span key={tag} className="text-primary">#{tag}</span>
                                ))}
                              </div>
                            )}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  ) : query.length > 2 && !isLoading ? (
                    <div className="text-center py-8 text-gray-400">
                      <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No results found for "{query}"</p>
                      <p className="text-sm mt-2">Try adjusting your search terms or filters</p>
                    </div>
                  ) : null}
                </motion.div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}