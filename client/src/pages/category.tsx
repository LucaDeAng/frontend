import { useRoute } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import Container from '@/components/layout/Container';
import ArticleCard from '@/components/articles/ArticleCard';
import { ArticleMeta } from '@shared/types';
import { Helmet } from 'react-helmet';

// Mappa categorie -> descrizione e immagine
const CATEGORY_INFO: Record<string, { desc: string; image: string }> = {
  'AI Techniques': {
    desc: "Tecniche avanzate di intelligenza artificiale, modelli e algoritmi all'avanguardia.",
    image: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500&q=80',
  },
  'Business': {
    desc: "Applicazioni dell'AI nel mondo del business, strategie e casi di successo.",
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500&q=80',
  },
  'Technology': {
    desc: "Novità, trend e approfondimenti sulle tecnologie emergenti.",
    image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500&q=80',
  },
  'Future of Work': {
    desc: "Come l'AI sta trasformando il mondo del lavoro e le professioni del futuro.",
    image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500&q=80',
  },
  'Marketing': {
    desc: "AI e marketing: personalizzazione, automazione e nuove strategie digitali.",
    image: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500&q=80',
  },
  'Research': {
    desc: "Ricerche, studi e scoperte nel campo dell'intelligenza artificiale.",
    image: 'https://images.unsplash.com/photo-1503676382389-4809596d5290?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500&q=80',
  },
  'AI Innovations': {
    desc: "Innovazioni e breakthrough nel mondo dell'AI.",
    image: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500&q=80',
  },
};

export default function CategoryPage() {
  const [, params] = useRoute<{ category: string }>("/category/:category");
  const category = params?.category || '';
  const info = CATEGORY_INFO[category] || {
    desc: 'Articoli di questa categoria.',
    image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500&q=80',
  };

  const { data: articles, isLoading, error } = useQuery<ArticleMeta[]>({
    queryKey: ['/api/articles'],
  });

  const filtered = articles?.filter(a => a.category === category) || [];

  const previewImage = info.image;

  return (
    <div className="py-20 bg-black min-h-screen">
      <Helmet>
        <title>Categoria: {category} | AI Hub</title>
        <meta name="description" content={info.desc} />
        <link rel="canonical" href={window.location.href} />
        {/* OpenGraph/LinkedIn */}
        <meta property="og:title" content={`Categoria: ${category} | AI Hub`} />
        <meta property="og:description" content={info.desc} />
        <meta property="og:type" content="website" />
        <meta property="og:image" content={previewImage} />
        <meta property="og:url" content={window.location.href} />
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`Categoria: ${category} | AI Hub`} />
        <meta name="twitter:description" content={info.desc} />
        <meta name="twitter:image" content={previewImage} />
      </Helmet>
      <Container>
        <div className="mb-10 flex flex-col md:flex-row items-center gap-8">
          <img src={info.image} alt={category} className="w-full md:w-80 rounded-lg shadow-lg object-cover max-h-56" />
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">{category}</h1>
            <p className="text-gray-300 text-lg">{info.desc}</p>
          </div>
        </div>
        {isLoading ? (
          <div className="text-gray-400">Caricamento...</div>
        ) : error ? (
          <div className="text-red-500">Errore nel caricamento degli articoli.</div>
        ) : filtered.length === 0 ? (
          <div className="text-gray-400">Nessun articolo trovato in questa categoria.</div>
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