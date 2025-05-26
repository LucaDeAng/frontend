import { useQuery } from '@tanstack/react-query';
import { useRoute } from 'wouter';
import { Article } from '@shared/types';
import ArticleContent from '@/components/articles/ArticleContent';
import { Helmet } from 'react-helmet';

export default function ArticlePage() {
  const [, params] = useRoute<{ slug: string }>('/article/:slug');
  const slug = params?.slug || '';

  const { data: article, isLoading, error } = useQuery<Article>({
    queryKey: [`/api/articles/${slug}`],
    enabled: !!slug
  });

  if (isLoading) {
    return (
      <div className="py-20 bg-black">
        <div className="container mx-auto px-6 md:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="h-8 bg-white/10 rounded-md w-1/3 mb-4 animate-pulse"></div>
            <div className="h-16 bg-white/10 rounded-md w-2/3 mb-8 animate-pulse"></div>
            <div className="space-y-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="h-4 bg-white/10 rounded-md animate-pulse"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Articolo non trovato</h1>
          <p className="text-gray-600 dark:text-gray-300">
            L'articolo che stai cercando non esiste o non è disponibile al momento.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{article.meta.title} | AI Hub</title>
        <meta name="description" content={article.meta.summary} />
        <meta property="og:title" content={`${article.meta.title} | AI Hub`} />
        <meta property="og:description" content={article.meta.summary} />
        <meta property="og:type" content="article" />
        <meta property="article:published_time" content={article.meta.date} />
        <meta property="article:author" content={article.meta.author} />
        <meta property="article:section" content={article.meta.category} />
      </Helmet>
      <ArticleContent article={article} />
    </>
  );
}
