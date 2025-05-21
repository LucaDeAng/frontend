import { Link } from 'wouter';
import { format } from 'date-fns';
import { ArticleMeta } from '@shared/types';
import { ArrowRight, Calendar, Tag } from 'lucide-react';
import { motion } from 'framer-motion';

interface ArticleCardProps {
  article: ArticleMeta;
}

export default function ArticleCard({ article }: ArticleCardProps) {
  const { title, date, summary, category, slug, image } = article;
  const formattedDate = format(new Date(date), 'MMMM d, yyyy');
  
  const getDefaultImage = (category: string) => {
    switch (category.toLowerCase()) {
      case 'artificial intelligence':
      case 'ai':
        return 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500&q=80';
      case 'machine learning':
      case 'ml':
        return 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500&q=80';
      case 'ai ethics':
      case 'ethics':
        return 'https://images.unsplash.com/photo-1633613286848-e6f43bbafb8d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500&q=80';
      case 'generative ai':
      case 'genai':
        return 'https://images.unsplash.com/photo-1684391963056-cae1a2ece91e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500&q=80';
      default:
        return 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500&q=80';
    }
  };

  const imageUrl = image || getDefaultImage(category);

  return (
    <article className="bg-black/30 border border-white/10 rounded-xl overflow-hidden hover:border-primary/30 transition-all duration-300 flex flex-col h-full group">
      <div className="relative overflow-hidden h-48">
        <img 
          src={imageUrl} 
          alt={`${title} - illustration`} 
          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-80"></div>
        
        <div className="absolute bottom-0 left-0 p-4 w-full">
          <div className="flex flex-wrap gap-2 items-center text-xs text-gray-300">
            <div className="flex items-center bg-black/50 px-2 py-1 rounded-full">
              <Calendar className="h-3 w-3 mr-1.5 text-primary" />
              <span>{formattedDate}</span>
            </div>
            
            <div className="flex items-center bg-black/50 px-2 py-1 rounded-full">
              <Tag className="h-3 w-3 mr-1.5 text-primary" />
              <span>{category}</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="p-6 flex-1 flex flex-col">
        <h3 className="text-xl font-bold text-white mb-3 group-hover:text-primary transition-colors">
          <Link href={`/article/${slug}`}>
            {title}
          </Link>
        </h3>
        
        <p className="text-gray-400 mb-4 flex-1 text-sm">
          {summary}
        </p>
        
        <Link 
          href={`/article/${slug}`} 
          className="text-primary font-medium flex items-center group-hover:text-primary/80 transition-colors mt-auto"
        >
          <span>Read article</span>
          <ArrowRight className="h-4 w-4 ml-2 transition-transform duration-300 group-hover:translate-x-1" />
        </Link>
      </div>
    </article>
  );
}
