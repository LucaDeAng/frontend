import { useQuery } from '@tanstack/react-query';
import { useRoute } from 'wouter';
import { Article } from '@shared/types';
import ArticleContent from '@/components/articles/ArticleContent';
import { Helmet } from 'react-helmet';
import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ShareIcon, BookmarkIcon, StarIcon } from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import { Link } from 'wouter';
import Container from '@/components/layout/Container';

export default function ArticlePage() {
  const [, params] = useRoute<{ slug: string }>('/article/:slug');
  const slug = params?.slug || '';

  const { data: article, isLoading, error } = useQuery<Article>({
    queryKey: [`/api/articles/${slug}`],
    enabled: !!slug,
    retry: 1,
    staleTime: 5 * 60 * 1000,
  });

  // TODO: Implementare la logica per verificare se l'utente è admin
  const isAdmin = false;

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
      <div className="py-20 bg-black min-h-screen">
        <Container>
          <div className="max-w-2xl mx-auto text-center">
            <div className="mb-8">
              <svg className="w-16 h-16 text-red-500 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-white mb-4">Articolo non trovato</h1>
            <p className="text-gray-400 mb-8">
              {error ? 'Si è verificato un errore nel caricamento dell\'articolo.' : 'L\'articolo che stai cercando non esiste o non è disponibile al momento.'}
            </p>
            <div className="space-y-4">
              <Link href="/articles">
                <a className="inline-block bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-dark transition-colors">
                  Esplora gli articoli
                </a>
              </Link>
              <div>
                <button
                  onClick={() => window.history.back()}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  ← Torna indietro
                </button>
              </div>
            </div>
          </div>
        </Container>
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
        <meta property="og:image" content={article.meta.image} />
        <meta property="og:url" content={window.location.href} />
        <meta property="article:published_time" content={article.meta.date} />
        <meta property="article:author" content={article.meta.author} />
        <meta property="article:section" content={article.meta.category} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${article.meta.title} | AI Hub`} />
        <meta name="twitter:description" content={article.meta.summary} />
        <meta name="twitter:image" content={article.meta.image} />
        <script type="application/ld+json">{`
          {
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": "${article.meta.title}",
            "description": "${article.meta.summary}",
            "image": "${article.meta.image}",
            "author": {
              "@type": "Person",
              "name": "${article.meta.author}"
            },
            "datePublished": "${article.meta.date}",
            "publisher": {
              "@type": "Organization",
              "name": "AI Hub"
            },
            "mainEntityOfPage": {
              "@type": "WebPage",
              "@id": "${window.location.href}"
            }
          }
        `}</script>
      </Helmet>
      <ArticleContent article={article} isAdmin={isAdmin} />
      {/* Rating e condivisione */}
      <div className="max-w-2xl mx-auto mt-8 space-y-4">
        <RatingSection slug={slug} />
        <div className="flex items-center gap-4">
          <span className="text-white flex items-center gap-2">
            <ShareIcon className="w-5 h-5" />
            Condividi:
          </span>
          <a
            href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-white hover:text-primary transition-colors"
            title="Condividi su LinkedIn"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
            </svg>
          </a>
          <a
            href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(article.meta.title)}&url=${encodeURIComponent(window.location.href)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-white hover:text-primary transition-colors"
            title="Condividi su Twitter"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
            </svg>
          </a>
          <a
            href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-white hover:text-primary transition-colors"
            title="Condividi su Facebook"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
          </a>
          <div className="ml-auto">
            <BookmarkButton article={article} />
          </div>
        </div>
      </div>
      <CommentsSection slug={slug} />
    </>
  );
}

// --- COMPONENTE RATING ---
function RatingSection({ slug }: { slug: string }) {
  const queryClient = useQueryClient();
  const { data: ratingData } = useQuery({
    queryKey: ['rating', slug],
    queryFn: async () => {
      const res = await fetch(`/api/articles/${slug}/rating`);
      return res.json();
    },
  });

  const [hoveredRating, setHoveredRating] = useState(0);
  const [userRating, setUserRating] = useState(0);
  
  // Simulo un userId per ora (in futuro sarà gestito con autenticazione)
  const userId = 'user-' + Math.random().toString(36).substr(2, 9);
  
  const updateRating = useMutation({
    mutationFn: async (rating: number) => {
      const res = await fetch(`/api/articles/${slug}/rating`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rating, userId }),
      });
      if (!res.ok) throw new Error('Errore nel salvataggio del rating');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rating', slug] });
    },
  });

  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((rating) => (
          <button
            key={rating}
            className="text-2xl text-gray-400 hover:text-yellow-400 transition-colors"
            onMouseEnter={() => setHoveredRating(rating)}
            onMouseLeave={() => setHoveredRating(0)}
            onClick={() => {
              setUserRating(rating);
              updateRating.mutate(rating);
            }}
          >
            {rating <= (hoveredRating || userRating || ratingData?.average || 0) ? (
              <StarIconSolid className="w-6 h-6 text-yellow-400" />
            ) : (
              <StarIcon className="w-6 h-6" />
            )}
          </button>
        ))}
      </div>
      {ratingData?.count > 0 && (
        <span className="text-gray-400">
          {ratingData.average.toFixed(1)} ({ratingData.count} voti)
        </span>
      )}
    </div>
  );
}

// --- COMPONENTE BOOKMARK ---
function BookmarkButton({ article }: { article: Article }) {
  const queryClient = useQueryClient();
  const { data: bookmarks } = useQuery({
    queryKey: ['/api/bookmarks'],
  });
  
  const isBookmarked = Array.isArray(bookmarks) && bookmarks.some((b) => b.slug === article.meta.slug);
  
  const toggleBookmark = useMutation({
    mutationFn: async () => {
      if (isBookmarked) {
        const res = await fetch(`/api/bookmarks/${article.meta.slug}`, {
          method: 'DELETE',
        });
        if (!res.ok) throw new Error('Errore nella rimozione del bookmark');
        return res.json();
      } else {
        const res = await fetch('/api/bookmarks', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            slug: article.meta.slug,
            title: article.meta.title,
            summary: article.meta.summary,
            image: article.meta.image,
          }),
        });
        if (!res.ok) throw new Error('Errore nel salvataggio del bookmark');
        return res.json();
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/bookmarks'] });
    },
  });

  return (
    <button
      onClick={() => toggleBookmark.mutate()}
      className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors ${
        isBookmarked
          ? 'bg-primary text-white hover:bg-primary-dark'
          : 'bg-white/10 text-white hover:bg-white/20'
      }`}
      title={isBookmarked ? 'Rimuovi dai bookmark' : 'Salva nei bookmark'}
    >
      <BookmarkIcon className="w-5 h-5" />
      <span>{isBookmarked ? 'Salvato' : 'Salva'}</span>
    </button>
  );
}

// --- COMPONENTE COMMENTI ---
function CommentsSection({ slug }: { slug: string }) {
  const queryClient = useQueryClient();
  const { data: comments, isLoading } = useQuery({
    queryKey: ['comments', slug],
    queryFn: async () => {
      const res = await fetch(`/api/articles/${slug}/comments`);
      return res.json();
    },
  });
  const [author, setAuthor] = useState('');
  const [text, setText] = useState('');
  const [error, setError] = useState('');
  const mutation = useMutation({
    mutationFn: async (data: { author: string; text: string }) => {
      const res = await fetch(`/api/articles/${slug}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Errore nell\'invio del commento');
      return res.json();
    },
    onSuccess: () => {
      setAuthor('');
      setText('');
      setError('');
      queryClient.invalidateQueries({ queryKey: ['comments', slug] });
    },
    onError: () => setError('Errore nell\'invio del commento'),
  });

  return (
    <div className="max-w-2xl mx-auto mt-16 bg-white/5 rounded-lg p-6">
      <h2 className="text-xl font-bold text-white mb-4">Commenti</h2>
      {isLoading ? (
        <div className="text-gray-400">Caricamento commenti...</div>
      ) : comments && comments.length === 0 ? (
        <div className="text-gray-400">Nessun commento ancora. Sii il primo!</div>
      ) : (
        <ul className="space-y-4 mb-8">
          {comments.map((c: any) => (
            <li key={c.id} className="bg-black/40 rounded p-3">
              <div className="text-sm text-primary font-semibold">{c.author}</div>
              <div className="text-white mt-1">{c.text}</div>
              <div className="text-xs text-gray-400 mt-1">{new Date(c.date).toLocaleString()}</div>
            </li>
          ))}
        </ul>
      )}
      <form
        className="space-y-2"
        onSubmit={e => {
          e.preventDefault();
          if (!author.trim() || !text.trim()) {
            setError('Compila tutti i campi');
            return;
          }
          mutation.mutate({ author, text });
        }}
      >
        <input
          className="w-full rounded bg-black/30 text-white p-2"
          placeholder="Il tuo nome"
          value={author}
          onChange={e => setAuthor(e.target.value)}
        />
        <textarea
          className="w-full rounded bg-black/30 text-white p-2"
          placeholder="Scrivi un commento..."
          value={text}
          onChange={e => setText(e.target.value)}
          rows={3}
        />
        {error && <div className="text-red-400 text-sm">{error}</div>}
        <button
          type="submit"
          className="bg-primary text-white px-4 py-2 rounded font-semibold hover:bg-primary-dark"
          disabled={mutation.isLoading}
        >
          {mutation.isLoading ? 'Invio...' : 'Invia commento'}
        </button>
      </form>
    </div>
  );
}
