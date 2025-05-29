import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'wouter';
import Container from '@/components/layout/Container';
import { Helmet } from 'react-helmet';
import { BookmarkIcon } from '@heroicons/react/24/outline';

interface Bookmark {
  slug: string;
  title: string;
  summary: string;
  image: string;
  date: string;
}

export default function BookmarksPage() {
  const queryClient = useQueryClient();
  const { data: bookmarks, isLoading } = useQuery<Bookmark[]>({
    queryKey: ['/api/bookmarks'],
  });

  const removeBookmark = useMutation({
    mutationFn: async (slug: string) => {
      const res = await fetch(`/api/bookmarks/${slug}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Errore nella rimozione del bookmark');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/bookmarks'] });
    },
  });

  return (
    <div className="py-20 bg-black min-h-screen">
      <Helmet>
        <title>I miei bookmark | AI Hub</title>
        <meta name="description" content="I tuoi articoli salvati su AI Hub" />
      </Helmet>
      <Container>
        <div className="flex items-center gap-2 mb-8">
          <BookmarkIcon className="w-6 h-6 text-primary" />
          <h1 className="text-3xl font-bold text-white">I miei bookmark</h1>
        </div>

        {isLoading ? (
          <div className="text-gray-400">Caricamento...</div>
        ) : !bookmarks || bookmarks.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400 mb-4">Non hai ancora salvato nessun articolo</p>
            <Link href="/articles">
              <a className="text-primary hover:underline">Esplora gli articoli</a>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {bookmarks.map(bookmark => (
              <div key={bookmark.slug} className="bg-white/5 rounded-lg overflow-hidden">
                <img
                  src={bookmark.image}
                  alt={bookmark.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h2 className="text-xl font-semibold text-white mb-2">
                    <Link href={`/article/${bookmark.slug}`}>
                      <a className="hover:text-primary transition-colors">{bookmark.title}</a>
                    </Link>
                  </h2>
                  <p className="text-gray-400 mb-4 line-clamp-2">{bookmark.summary}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">
                      {new Date(bookmark.date).toLocaleDateString()}
                    </span>
                    <button
                      onClick={() => removeBookmark.mutate(bookmark.slug)}
                      className="text-red-400 hover:text-red-300 transition-colors"
                      title="Rimuovi dai bookmark"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Container>
    </div>
  );
} 