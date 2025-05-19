import { Link } from 'wouter';
import { format } from 'date-fns';
import { it } from 'date-fns/locale';
import { ArticleMeta } from '@shared/types';
import { ChevronRight } from 'lucide-react';

interface ArticleCardProps {
  article: ArticleMeta;
}

export default function ArticleCard({ article }: ArticleCardProps) {
  const { title, date, summary, category, slug, image } = article;
  const formattedDate = format(new Date(date), 'd MMMM yyyy', { locale: it });
  
  const getDefaultImage = (category: string) => {
    switch (category.toLowerCase()) {
      case 'intelligenza artificiale':
        return 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500&q=80';
      case 'machine learning':
        return 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500&q=80';
      case 'etica dell\'ai':
        return 'https://pixabay.com/get/gd3114ebba8ef5edec5cb08c488a1172404c815df9112e2af9505684121515fb8893441afdfea72c424b21b397ba7956df25be708b255f35070fc44f18243e0d2_1280.jpg';
      default:
        return 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500&q=80';
    }
  };

  const imageUrl = image || getDefaultImage(category);

  return (
    <article className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow border border-gray-200 dark:border-gray-700 flex flex-col h-full">
      <img 
        src={imageUrl} 
        alt={`${title} - illustrazione`} 
        className="w-full h-52 object-cover"
      />
      
      <div className="p-6 flex-1 flex flex-col">
        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-3">
          <span>{formattedDate}</span>
          <span className="mx-2">•</span>
          <span>{category}</span>
        </div>
        
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          <Link href={`/article/${slug}`} className="hover:text-primary-600 dark:hover:text-primary-400">
            {title}
          </Link>
        </h3>
        
        <p className="text-gray-600 dark:text-gray-300 mb-4 flex-1">
          {summary}
        </p>
        
        <Link 
          href={`/article/${slug}`} 
          className="text-primary-600 dark:text-primary-400 font-medium flex items-center hover:underline mt-auto"
        >
          Leggi l'articolo
          <ChevronRight className="h-4 w-4 ml-1" />
        </Link>
      </div>
    </article>
  );
}
