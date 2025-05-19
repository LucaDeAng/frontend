import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { it } from 'date-fns/locale';
import { Article } from '@shared/types';
import { markdownToHtml } from '@/lib/markdown';
import Container from '@/components/layout/Container';
import { Card, CardContent } from '@/components/ui/card';

interface ArticleContentProps {
  article: Article;
}

export default function ArticleContent({ article }: ArticleContentProps) {
  const [htmlContent, setHtmlContent] = useState('');
  const { meta, content } = article;
  const { title, date, author, category } = meta;
  
  useEffect(() => {
    const processContent = async () => {
      const html = await markdownToHtml(content);
      setHtmlContent(html);
    };
    
    processContent();
  }, [content]);
  
  const formattedDate = format(new Date(date), 'd MMMM yyyy', { locale: it });
  
  return (
    <Container className="py-12">
      <article className="max-w-4xl mx-auto">
        <header className="mb-10">
          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-3">
            <span>{formattedDate}</span>
            <span className="mx-2">•</span>
            <span>{category}</span>
            {author && (
              <>
                <span className="mx-2">•</span>
                <span>di {author}</span>
              </>
            )}
          </div>
          
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            {title}
          </h1>
        </header>
        
        <Card>
          <CardContent className="pt-6 prose dark:prose-invert max-w-none prose-lg">
            <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
          </CardContent>
        </Card>
      </article>
    </Container>
  );
}
