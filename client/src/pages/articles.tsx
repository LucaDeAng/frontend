import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Container from '@/components/layout/Container';
import ArticleCard from '@/components/articles/ArticleCard';
import ArticleSearch from '@/components/articles/ArticleSearch';
import { ArticleMeta } from '@shared/types';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';

export default function Articles() {
  const { data: articles, isLoading, error } = useQuery<ArticleMeta[]>({
    queryKey: ['/api/articles'],
  });
  
  const [filteredArticles, setFilteredArticles] = useState<ArticleMeta[]>([]);

  return (
    <>
      <Helmet>
        <title>Articles | AI Hub</title>
        <meta name="description" content="Explore our collection of articles on artificial intelligence, machine learning, and emerging technologies." />
        <meta property="og:title" content="Articles | AI Hub" />
        <meta property="og:description" content="Explore our collection of articles on artificial intelligence, machine learning, and emerging technologies." />
        <meta property="og:type" content="website" />
      </Helmet>
      <section className="py-16 bg-black">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-white mb-4">Articles</h1>
              <p className="text-xl text-gray-400">
                Explore our collection of articles on artificial intelligence, machine learning, and emerging technologies.
              </p>
            </div>
            
            {!isLoading && !error && articles && (
              <div className="mb-12">
                <ArticleSearch 
                  articles={articles}
                  onSearch={setFilteredArticles}
                />
                <div className="mt-4 text-gray-400">
                  {filteredArticles.length} {filteredArticles.length === 1 ? 'article' : 'articles'} found
                </div>
              </div>
            )}
            
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="h-96 bg-black/30 border border-white/10 animate-pulse rounded-xl"></div>
                ))}
              </div>
            ) : error ? (
              <div className="text-center p-8 bg-black/30 border border-red-500/30 rounded-xl">
                <p className="text-red-400">Error loading articles. Please try again later.</p>
              </div>
            ) : filteredArticles.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredArticles.map((article, index) => (
                  <motion.div
                    key={article.slug}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <ArticleCard article={article} />
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-black/30 border border-white/10 rounded-xl">
                <p className="text-gray-400">No articles found matching your search criteria.</p>
                <p className="text-gray-500 text-sm mt-2">Try adjusting your search or filters.</p>
              </div>
            )}
          </motion.div>
        </Container>
      </section>
    </>
  );
}
