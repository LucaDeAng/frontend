import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { SearchIcon, Filter, X } from 'lucide-react';
import { ArticleMeta } from '@shared/types';
import { motion, AnimatePresence } from 'framer-motion';

interface ArticleSearchProps {
  articles: ArticleMeta[];
  onSearch: (filteredArticles: ArticleMeta[]) => void;
}

export default function ArticleSearch({ articles, onSearch }: ArticleSearchProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  
  // Extract unique categories from articles
  const categories = Array.from(new Set(articles.map(article => article.category)));
  
  // Filter articles based on search term and selected category
  useEffect(() => {
    const filteredArticles = articles.filter(article => {
      const matchesSearch = searchTerm === '' || 
        article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.summary.toLowerCase().includes(searchTerm.toLowerCase());
        
      const matchesCategory = selectedCategory === null || article.category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });
    
    onSearch(filteredArticles);
  }, [searchTerm, selectedCategory, articles, onSearch]);
  
  // Reset filters
  const resetFilters = () => {
    setSearchTerm('');
    setSelectedCategory(null);
  };
  
  return (
    <div className="mb-8">
      <div className="flex flex-col sm:flex-row gap-4 items-start">
        <div className="relative flex-1">
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
          <Input
            type="text"
            placeholder="Search articles by keyword..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 py-6 bg-black/30 border-white/10 focus:border-primary/30 rounded-lg"
          />
          {searchTerm && (
            <button 
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
              onClick={() => setSearchTerm('')}
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        
        <div className="flex gap-2 items-center self-start">
          <Button
            variant="outline"
            className={`py-6 border-white/10 ${showFilters ? 'bg-primary/10 text-primary' : 'bg-black/30 text-white'}`}
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="h-4 w-4 mr-2" />
            <span>Filters</span>
          </Button>
          
          {(searchTerm || selectedCategory) && (
            <Button
              variant="outline"
              className="py-6 border-white/10 bg-black/30 text-white"
              onClick={resetFilters}
            >
              <X className="h-4 w-4 mr-2" />
              <span>Reset</span>
            </Button>
          )}
        </div>
      </div>
      
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="mt-4 overflow-hidden"
          >
            <div className="bg-black/30 border border-white/10 rounded-lg p-4">
              <h3 className="text-sm font-medium text-white mb-3">Filter by Category</h3>
              <div className="flex flex-wrap gap-2">
                {categories.map(category => (
                  <button
                    key={category}
                    className={`px-3 py-1 rounded-full text-sm transition-colors ${
                      selectedCategory === category
                        ? 'bg-primary text-black'
                        : 'bg-black/50 text-gray-300 hover:bg-white/10'
                    }`}
                    onClick={() => setSelectedCategory(
                      selectedCategory === category ? null : category
                    )}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}