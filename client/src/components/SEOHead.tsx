import { Helmet } from 'react-helmet';

interface SEOHeadProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article';
  article?: {
    author?: string;
    publishedTime?: string;
    modifiedTime?: string;
    section?: string;
    tags?: string[];
  };
}

export function SEOHead({
  title = "AI Hub - Il Tuo Portale per l'Intelligenza Artificiale",
  description = "Esplora il futuro dell'AI con AI Hub: articoli, guide pratiche, insights e risorse per professionisti e appassionati di intelligenza artificiale.",
  image = "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=630&q=80",
  url = "https://aihub.dev",
  type = "website",
  article
}: SEOHeadProps) {
  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      
      {/* Open Graph Meta Tags */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={title} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content="AI Hub" />
      <meta property="og:locale" content="it_IT" />
      
      {/* Twitter Card Meta Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      <meta name="twitter:image:alt" content={title} />
      
      {/* Article-specific meta tags */}
      {type === 'article' && article && (
        <>
          {article.author && <meta property="article:author" content={article.author} />}
          {article.publishedTime && <meta property="article:published_time" content={article.publishedTime} />}
          {article.modifiedTime && <meta property="article:modified_time" content={article.modifiedTime} />}
          {article.section && <meta property="article:section" content={article.section} />}
          {article.tags && article.tags.map(tag => (
            <meta key={tag} property="article:tag" content={tag} />
          ))}
        </>
      )}
      
      {/* Canonical URL */}
      <link rel="canonical" href={url} />
    </Helmet>
  );
} 