import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { it } from 'date-fns/locale';
import { Article } from '@shared/types';
import { markdownToHtml } from '@/lib/markdown';
import Container from '@/components/layout/Container';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LazyImage } from '@/components/ui/lazy-image';
import { Link } from 'wouter';
import { Edit } from 'lucide-react';
import Typography from '@/components/ui/Typography';

interface ArticleContentProps {
  article: Article;
  isAdmin?: boolean;
}

export default function ArticleContent({ article, isAdmin = false }: ArticleContentProps) {
  const [htmlContent, setHtmlContent] = useState('');
  const { meta, content } = article;
  const { title, date, author, category, tags } = meta;
  
  useEffect(() => {
    const processContent = async () => {
      const contentWithoutTitle = content.replace(/^# .+\n?/, '');
      const html = await markdownToHtml(contentWithoutTitle);
      setHtmlContent(html);
    };
    
    processContent();
  }, [content]);
  
  const formattedDate = format(new Date(date), 'd MMMM yyyy', { locale: it });
  
  return (
    <div className="py-20 bg-black">
      <Container>
        <article className="max-w-3xl mx-auto p-6 bg-zinc-900 text-white rounded-lg shadow-lg">
          <header className="mb-10">
            {/* Cover image */}
            {meta.image && (
              <div className="mb-6 rounded-xl overflow-hidden" style={{ maxHeight: '320px' }}>
                <LazyImage
                  src={meta.image}
                  alt={meta.title + ' - illustration'}
                  className="w-full h-64 object-cover rounded-xl border border-primary/20"
                />
              </div>
            )}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center text-sm text-gray-300">
                <span>{formattedDate}</span>
                <span className="mx-2">•</span>
                <span>{category}</span>
                {author && (
                  <>
                    <span className="mx-2">•</span>
                    <span>by {author}</span>
                  </>
                )}
              </div>
              
              {isAdmin && (
                <Link href={`/admin/articles/${article.slug}`}>
                  <Button
                    className="border-primary/30 text-primary hover:bg-primary/10 h-9 px-3"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Modifica
                  </Button>
                </Link>
              )}
            </div>
            
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 break-words">
              {title}
            </h1>
          </header>
        
          <Typography>
            <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
          </Typography>
        </article>
      </Container>
    </div>
  );
}

