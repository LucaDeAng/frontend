import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';
import { motion } from 'framer-motion';
import { ArticleMeta } from '@shared/types';
import { Calendar, ArrowRight, Tag } from 'lucide-react';
import { format } from 'date-fns';
import { it } from 'date-fns/locale';

export default function BusinessArticles() {
  // Fetch articles
  const { data: articles, isLoading, error } = useQuery<ArticleMeta[]>({
    queryKey: ['/api/articles'],
  });

  if (isLoading) {
    return (
      <section className="py-20 bg-black/95">
        <div className="container mx-auto px-6 md:px-8">
          <div className="text-center mb-16">
            <div className="h-6 w-32 bg-gray-800 rounded-full mx-auto mb-6 animate-pulse"></div>
            <div className="h-12 w-3/4 max-w-xl bg-gray-800 rounded-lg mx-auto mb-6 animate-pulse"></div>
            <div className="h-4 w-2/4 max-w-md bg-gray-800 rounded mx-auto animate-pulse"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="rounded-xl bg-white/5 border border-white/10 p-6 h-96 animate-pulse">
                <div className="h-4 w-24 bg-gray-800 rounded mb-4"></div>
                <div className="h-8 w-5/6 bg-gray-800 rounded mb-3"></div>
                <div className="h-24 w-full bg-gray-800 rounded mb-6"></div>
                <div className="h-4 w-32 bg-gray-800 rounded mt-auto"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error || !articles || articles.length === 0) {
    return (
      <section className="py-20 bg-black/95">
        <div className="container mx-auto px-6 md:px-8">
          <div className="max-w-lg mx-auto text-center bg-white/5 border border-white/10 rounded-xl p-8">
            <h2 className="text-xl font-bold mb-4 text-white">Contenuti in arrivo</h2>
            <p className="text-gray-400">
              Gli articoli sono in fase di preparazione. Torna presto per leggere i nostri contenuti su AI e innovazione.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-black/95">
      <div className="container mx-auto px-6 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <div className="inline-flex items-center px-3 py-1 rounded-full border border-primary/30 mb-6 bg-primary/5">
            <span className="text-xs font-medium text-primary">Insights & Know-how</span>
          </div>
          
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
            Articoli e approfondimenti sulla <span className="text-primary">Generative AI</span>
          </h2>
          
          <p className="text-gray-400 text-lg">
            Analisi, casi studio e guide pratiche per implementare la Gen AI nelle organizzazioni e ottenere risultati concreti.
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.slice(0, 3).map((article, index) => {
            const formattedDate = format(new Date(article.date), 'd MMMM yyyy', { locale: it });
            
            return (
              <motion.div
                key={article.slug}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="rounded-xl bg-white/5 border border-white/10 p-6 flex flex-col h-full hover:shadow-lg hover:shadow-primary/5 hover:border-primary/30 transition-all duration-300"
              >
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center text-gray-400 text-sm">
                    <Calendar className="h-3.5 w-3.5 mr-1.5" />
                    <span>{formattedDate}</span>
                  </div>
                  
                  <div className="px-2 py-0.5 rounded-full bg-primary/10 text-xs">
                    <div className="flex items-center text-primary">
                      <Tag className="h-3 w-3 mr-1" />
                      <span>{article.category}</span>
                    </div>
                  </div>
                </div>
                
                <h3 className="text-xl font-bold mb-3 text-white">
                  {article.title}
                </h3>
                
                <p className="text-gray-400 text-base mb-6 flex-grow">
                  {article.summary}
                </p>
                
                <Link
                  href={`/article/${article.slug}`}
                  className="text-primary hover:text-primary/80 flex items-center mt-auto group"
                >
                  <span className="font-medium">Leggi l'articolo</span>
                  <ArrowRight className="h-4 w-4 ml-2 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </motion.div>
            );
          })}
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex justify-center mt-12"
        >
          <Link href="/articles">
            <div className="px-6 py-3 rounded-full border border-white/20 hover:border-primary/50 hover:bg-primary/5 transition-all duration-300 flex items-center group">
              <span className="text-white">Esplora tutti gli articoli</span>
              <ArrowRight className="h-4 w-4 ml-2 text-white transition-transform duration-300 group-hover:translate-x-1" />
            </div>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}