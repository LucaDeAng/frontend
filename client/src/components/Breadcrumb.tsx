import { Link, useLocation } from 'wouter';
import { ChevronRight, Home } from 'lucide-react';
import { motion } from 'framer-motion';

interface BreadcrumbItem {
  title: string;
  path: string;
}

export default function Breadcrumb() {
  const [location] = useLocation();
  
  const getBreadcrumbs = (): BreadcrumbItem[] => {
    const pathSegments = location.split('/').filter(Boolean);
    const breadcrumbs: BreadcrumbItem[] = [
      { title: 'Home', path: '/' }
    ];

    if (pathSegments.length === 0) return breadcrumbs;

    // Build breadcrumbs based on current path
    let currentPath = '';
    
    pathSegments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      
      let title = segment.charAt(0).toUpperCase() + segment.slice(1);
      
      // Custom titles for specific routes
      if (segment === 'playground') title = 'Prompts';
      if (segment === 'build-in-public') title = 'Build in Public';
      if (segment === 'about') title = 'About Me';
      if (segment.startsWith('article') && index > 0) {
        // For article pages, get title from URL params or use generic
        title = 'Article';
      }
      
      breadcrumbs.push({
        title,
        path: currentPath
      });
    });

    return breadcrumbs;
  };

  const breadcrumbs = getBreadcrumbs();

  // Don't show breadcrumbs on home page
  if (location === '/') return null;

  return (
    <div className="bg-black/30 border-b border-primary/10">
      <div className="container mx-auto px-6 md:px-12 py-4">
        <nav aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2 text-sm">
            {breadcrumbs.map((item, index) => {
              const isLast = index === breadcrumbs.length - 1;
              
              return (
                <motion.li 
                  key={item.path}
                  className="flex items-center"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  {index === 0 ? (
                    <Home className="h-4 w-4 text-gray-400" />
                  ) : null}
                  
                  {isLast ? (
                    <span className="text-primary font-medium ml-1">
                      {item.title}
                    </span>
                  ) : (
                    <Link href={item.path}>
                      <span className="text-gray-400 hover:text-white transition-colors duration-200 ml-1">
                        {item.title}
                      </span>
                    </Link>
                  )}
                  
                  {!isLast && (
                    <ChevronRight className="h-3 w-3 text-gray-500 mx-2" />
                  )}
                </motion.li>
              );
            })}
          </ol>
        </nav>
      </div>
    </div>
  );
}