import { useState, useEffect } from 'react';
import { useRoute } from 'wouter';
import { useQuery, useMutation, useQueryClient, UseQueryOptions } from '@tanstack/react-query';
import { Article } from '@shared/types';
import Container from '@/components/layout/Container';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

export default function ArticleEditor() {
  const [, params] = useRoute<{ slug: string }>('/admin/articles/:slug');
  const slug = params?.slug || '';
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    title: '',
    summary: '',
    category: '',
    author: '',
    content: '',
    image: ''
  });

  // Fetch article data
  const { data: article, isLoading } = useQuery<Article>({
    queryKey: [`/api/articles/${slug}`],
    enabled: !!slug,
    queryFn: async () => {
      const res = await fetch(`/api/articles/${slug}`);
      if (!res.ok) throw new Error('Failed to fetch article');
      return res.json();
    },
    onSuccess: (data: Article) => {
      if (data) {
        setFormData({
          title: data.meta.title,
          summary: data.meta.summary,
          category: data.meta.category,
          author: data.meta.author,
          content: data.content,
          image: data.meta.image || ''
        });
      }
    }
  } as UseQueryOptions<Article>);

  // Update article mutation
  const updateArticle = useMutation({
    mutationFn: async (data: typeof formData) => {
      const response = await fetch(`/api/admin/articles/${slug}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          date: article?.meta.date || new Date().toISOString().split('T')[0]
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update article');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/articles/${slug}`] });
      toast.success('Articolo aggiornato con successo');
    },
    onError: () => {
      toast.error('Errore durante l\'aggiornamento dell\'articolo');
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateArticle.mutate(formData);
  };

  if (isLoading) {
    return (
      <div className="py-20 bg-black">
        <Container>
          <div className="max-w-4xl mx-auto">
            <div className="h-8 bg-white/10 rounded-md w-1/3 mb-4 animate-pulse"></div>
            <div className="h-16 bg-white/10 rounded-md w-2/3 mb-8 animate-pulse"></div>
            <div className="space-y-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="h-4 bg-white/10 rounded-md animate-pulse"></div>
              ))}
            </div>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="py-20 bg-black">
      <Container>
        <Card className="max-w-4xl mx-auto bg-zinc-900 border-primary/20">
          <CardContent className="p-6">
            <h1 className="text-3xl font-bold text-white mb-8">
              {slug ? 'Modifica Articolo' : 'Nuovo Articolo'}
            </h1>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Titolo</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="bg-black/50 border-primary/30"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="summary">Riassunto</Label>
                <Textarea
                  id="summary"
                  value={formData.summary}
                  onChange={(e) => setFormData(prev => ({ ...prev, summary: e.target.value }))}
                  className="bg-black/50 border-primary/30"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Categoria</Label>
                <Input
                  id="category"
                  value={formData.category}
                  onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                  className="bg-black/50 border-primary/30"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="author">Autore</Label>
                <Input
                  id="author"
                  value={formData.author}
                  onChange={(e) => setFormData(prev => ({ ...prev, author: e.target.value }))}
                  className="bg-black/50 border-primary/30"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">Contenuto (Markdown)</Label>
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                  className="bg-black/50 border-primary/30 min-h-[400px] font-mono"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="image">Immagine di anteprima (URL)</Label>
                <Input
                  id="image"
                  value={formData.image}
                  onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.value }))}
                  className="bg-black/50 border-primary/30"
                  placeholder="https://..."
                />
                {formData.image && (
                  <img src={formData.image} alt="Anteprima" className="mt-2 max-h-32 rounded border border-white/10" loading="lazy" />
                )}
              </div>

              <div className="flex justify-end space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => window.history.back()}
                  className="border-primary/30 text-primary hover:bg-primary/10"
                >
                  Annulla
                </Button>
                <Button
                  type="submit"
                  disabled={updateArticle.isPending}
                  className="bg-primary hover:bg-primary/90"
                >
                  {updateArticle.isPending ? 'Salvataggio...' : 'Salva Modifiche'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </Container>
    </div>
  );
} 