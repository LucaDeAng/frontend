import { useRoute } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import Container from '@/components/layout/Container';
import ArticleCard from '@/components/articles/ArticleCard';
import { ArticleMeta } from '@shared/types';
import { Helmet } from 'react-helmet';

export default function TagPage() {
  const [, params] = useRoute<{ tag: string }>("/tag/:tag");
  const tag = params?.tag || '';

  const { data: articles, isLoading, error } = useQuery<ArticleMeta[]>({
    queryKey: ['/api/articles'],
  });

  const filtered = articles?.filter(a => a.tags?.includes(tag)) || [];

  const previewImage = articles && filtered.length > 0 ? filtered[0].image : 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500&q=80';

  return (
    <div className="py-20 bg-black min-h-screen">
      <Helmet>
        <title>Articoli con tag #{tag} | AI Hub</title>
        <meta name="description" content={`Tutti gli articoli con il tag ${tag}.`} />
        <link rel="canonical" href={window.location.href} />
        {/* OpenGraph/LinkedIn */}
        <meta property="og:title" content={`Articoli con tag #${tag} | AI Hub`} />
        <meta property="og:description" content={`Tutti gli articoli con il tag ${tag}.`} />
        <meta property="og:type" content="website" />
        <meta property="og:image" content={previewImage} />
        <meta property="og:url" content={window.location.href} />
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`Articoli con tag #${tag} | AI Hub`} />
        <meta name="twitter:description" content={`Tutti gli articoli con il tag ${tag}.`} />
        <meta name="twitter:image" content={previewImage} />
      </Helmet>
      <Container>
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-8">
          Articoli con tag <span className="text-primary">#{tag}</span>
        </h1>
        {isLoading ? (
          <div className="text-gray-400">Caricamento...</div>
        ) : error ? (
          <div className="text-red-500">Errore nel caricamento degli articoli.</div>
        ) : filtered.length === 0 ? (
          <div className="text-gray-400">Nessun articolo trovato con questo tag.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map(article => (
              <ArticleCard key={article.slug} article={article} />
            ))}
          </div>
        )}
      </Container>
    </div>
  );
} 