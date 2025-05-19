import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';
import Container from '@/components/layout/Container';
import ArticleCard from '@/components/articles/ArticleCard';
import { ArticleMeta } from '@shared/types';
import { ChevronRight } from 'lucide-react';

export default function LatestArticlesSection() {
  const { data: articles, isLoading, error } = useQuery<ArticleMeta[]>({
    queryKey: ['/api/articles'],
  });

  return (
    <section className="py-16 bg-white dark:bg-gray-900">
      <Container>
        <div className="flex justify-between items-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Ultimi Articoli</h2>
          <Link href="/articles" className="text-primary-600 dark:text-primary-400 hover:underline text-sm font-medium flex items-center">
            Tutti gli articoli
            <ChevronRight className="h-4 w-4 ml-1" />
          </Link>
        </div>
        
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-96 bg-gray-100 dark:bg-gray-800 animate-pulse rounded-xl"></div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center p-8 bg-red-50 dark:bg-red-900/20 rounded-lg">
            <p className="text-red-600 dark:text-red-400">Si è verificato un errore nel caricamento degli articoli.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles && articles.slice(0, 3).map((article) => (
              <ArticleCard key={article.slug} article={article} />
            ))}
          </div>
        )}
      </Container>
    </section>
  );
}
