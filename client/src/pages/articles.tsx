import { useQuery } from '@tanstack/react-query';
import Container from '@/components/layout/Container';
import ArticleCard from '@/components/articles/ArticleCard';
import { ArticleMeta } from '@shared/types';
import { Helmet } from 'react-helmet';

export default function Articles() {
  const { data: articles, isLoading, error } = useQuery<ArticleMeta[]>({
    queryKey: ['/api/articles'],
  });

  return (
    <>
      <Helmet>
        <title>Articoli | AI Hub</title>
        <meta name="description" content="Esplora la nostra collezione di articoli sull'intelligenza artificiale, il machine learning e altre tecnologie emergenti." />
        <meta property="og:title" content="Articoli | AI Hub" />
        <meta property="og:description" content="Esplora la nostra collezione di articoli sull'intelligenza artificiale, il machine learning e altre tecnologie emergenti." />
        <meta property="og:type" content="website" />
      </Helmet>
      <section className="py-16 bg-white dark:bg-gray-900">
        <Container>
          <div className="mb-12">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Articoli</h1>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Esplora la nostra collezione di articoli sull'intelligenza artificiale, il machine learning e altre tecnologie emergenti.
            </p>
          </div>
          
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-96 bg-gray-100 dark:bg-gray-800 animate-pulse rounded-xl"></div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center p-8 bg-red-50 dark:bg-red-900/20 rounded-lg">
              <p className="text-red-600 dark:text-red-400">Si è verificato un errore nel caricamento degli articoli.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {articles && articles.map((article) => (
                <ArticleCard key={article.slug} article={article} />
              ))}
            </div>
          )}
        </Container>
      </section>
    </>
  );
}
