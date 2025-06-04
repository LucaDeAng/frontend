import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Filter, Calendar, TrendingUp, Star, Tag, 
  Brain, Bot, Code, Lightbulb, BookOpen
} from 'lucide-react';
import { ArticleMeta } from '@shared/types';

interface ArticlesSidebarProps {
  articles: ArticleMeta[];
  onFilterChange: (filters: FilterOptions) => void;
  currentFilters: FilterOptions;
}

export interface FilterOptions {
  category?: string;
  sortBy: 'date' | 'popularity' | 'relevance';
  dateRange?: 'week' | 'month' | 'year' | 'all';
  searchQuery?: string;
}

export default function ArticlesSidebar({ articles, onFilterChange, currentFilters }: ArticlesSidebarProps) {
  const [expandedSection, setExpandedSection] = useState<string>('categories');

  const categories = [
    { id: 'all', name: 'All Articles', icon: <BookOpen className="h-4 w-4" />, count: articles.length },
    { id: 'research', name: 'AI Research', icon: <Brain className="h-4 w-4" />, count: 8 },
    { id: 'ml', name: 'Machine Learning', icon: <Bot className="h-4 w-4" />, count: 12 },
    { id: 'tech', name: 'Technology', icon: <Code className="h-4 w-4" />, count: 6 },
    { id: 'tutorials', name: 'Tutorials', icon: <Lightbulb className="h-4 w-4" />, count: 4 }
  ];

  const sortOptions = [
    { id: 'date', name: 'Latest First', icon: <Calendar className="h-4 w-4" /> },
    { id: 'popularity', name: 'Most Popular', icon: <TrendingUp className="h-4 w-4" /> },
    { id: 'relevance', name: 'Most Relevant', icon: <Star className="h-4 w-4" /> }
  ];

  const dateRanges = [
    { id: 'all', name: 'All Time' },
    { id: 'week', name: 'Past Week' },
    { id: 'month', name: 'Past Month' },
    { id: 'year', name: 'Past Year' }
  ];

  const popularTags = [
    'AI', 'Machine Learning', 'Claude', 'GPT', 'Neural Networks', 
    'Deep Learning', 'NLP', 'Computer Vision', 'Ethics', 'Future Tech'
  ];

  const handleCategoryChange = (category: string) => {
    onFilterChange({
      ...currentFilters,
      category: category === 'all' ? undefined : category
    });
  };

  const handleSortChange = (sortBy: FilterOptions['sortBy']) => {
    onFilterChange({
      ...currentFilters,
      sortBy
    });
  };

  const handleDateRangeChange = (dateRange: FilterOptions['dateRange']) => {
    onFilterChange({
      ...currentFilters,
      dateRange
    });
  };

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? '' : section);
  };

  return (
    <div className="w-80 bg-zinc-900/50 border border-primary/20 rounded-xl p-6 h-fit sticky top-24">
      <div className="flex items-center space-x-2 mb-6">
        <Filter className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-bold text-white">Filters</h3>
      </div>

      <div className="space-y-6">
        {/* Categories */}
        <div>
          <button
            onClick={() => toggleSection('categories')}
            className="flex items-center justify-between w-full text-left mb-3"
            aria-expanded={expandedSection === 'categories'}
            aria-controls="sidebar-categories"
          >
            <h4 className="font-semibold text-white">Categories</h4>
            <motion.div
              animate={{ rotate: expandedSection === 'categories' ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <TrendingUp className="h-4 w-4 text-gray-400" />
            </motion.div>
          </button>
          
          <motion.div
            id="sidebar-categories"
            initial={false}
            animate={{
              height: expandedSection === 'categories' ? 'auto' : 0,
              opacity: expandedSection === 'categories' ? 1 : 0
            }}
            className="overflow-hidden"
          >
            <div className="space-y-2">
              {categories.map((category) => (
                <motion.button
                  key={category.id}
                  onClick={() => handleCategoryChange(category.id)}
                  className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors ${
                    (currentFilters.category === category.id || (category.id === 'all' && !currentFilters.category))
                      ? 'bg-primary/20 text-primary border border-primary/30'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.98 }}
                  aria-pressed={currentFilters.category === category.id || (category.id === 'all' && !currentFilters.category)}
                >
                  <div className="flex items-center space-x-3">
                    {category.icon}
                    <span className="font-mono text-sm">{category.name}</span>
                  </div>
                  <span className="text-xs bg-black/30 px-2 py-1 rounded-full">
                    {category.count}
                  </span>
                </motion.button>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Sort Options */}
        <div>
          <h4 className="font-semibold text-white mb-3">Sort By</h4>
          <div className="space-y-2">
            {sortOptions.map((option) => (
              <motion.button
                key={option.id}
                onClick={() => handleSortChange(option.id as FilterOptions['sortBy'])}
                className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                  currentFilters.sortBy === option.id
                    ? 'bg-primary/20 text-primary border border-primary/30'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.98 }}
                aria-pressed={currentFilters.sortBy === option.id}
              >
                {option.icon}
                <span className="font-mono text-sm">{option.name}</span>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Date Range */}
        <div>
          <h4 className="font-semibold text-white mb-3">Date Range</h4>
          <div className="space-y-2">
            {dateRanges.map((range) => (
              <motion.button
                key={range.id}
                onClick={() => handleDateRangeChange(range.id as FilterOptions['dateRange'])}
                className={`w-full text-left p-2 rounded-lg transition-colors ${
                  (currentFilters.dateRange === range.id || (range.id === 'all' && !currentFilters.dateRange))
                    ? 'bg-primary/20 text-primary'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.98 }}
                aria-pressed={currentFilters.dateRange === range.id || (range.id === 'all' && !currentFilters.dateRange)}
              >
                <span className="font-mono text-sm">{range.name}</span>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Popular Tags */}
        <div>
          <h4 className="font-semibold text-white mb-3 flex items-center space-x-2">
            <Tag className="h-4 w-4" />
            <span>Popular Tags</span>
          </h4>
          <div className="flex flex-wrap gap-2">
            {popularTags.map((tag, index) => (
              <motion.button
                key={tag}
                className="px-3 py-1 bg-black/30 border border-primary/20 rounded-full text-xs text-gray-400 hover:text-primary hover:border-primary/40 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
              >
                {tag}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Related Articles */}
        <div>
          <h4 className="font-semibold text-white mb-3">Related Articles</h4>
          <div className="space-y-3">
            {articles.slice(0, 3).map((article, index) => (
              <motion.div
                key={article.slug}
                className="p-3 bg-black/30 border border-primary/10 rounded-lg hover:border-primary/30 transition-colors"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <h5 className="font-medium text-white text-sm mb-1 line-clamp-2">
                  {article.title}
                </h5>
                <p className="text-xs text-gray-400 line-clamp-2 mb-2">
                  {article.summary}
                </p>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>{article.author}</span>
                  <span>{new Date(article.date).toLocaleDateString()}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}