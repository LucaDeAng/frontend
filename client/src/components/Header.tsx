import { useState } from 'react';
import { Link } from 'wouter';
import ThemeToggle from '@/components/ThemeToggle';
import { PlusCircle } from 'lucide-react';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-sm bg-white/70 dark:bg-gray-900/70 border-b border-gray-200 dark:border-gray-800">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {/* Logo */}
          <Link href="/" className="flex items-center font-bold text-xl text-primary-600 dark:text-primary-400">
            <span className="flex items-center justify-center w-8 h-8 rounded-md bg-primary-500 text-white mr-2">
              <PlusCircle className="h-5 w-5" />
            </span>
            AI Hub
          </Link>
        </div>
        
        <div className="hidden md:flex items-center space-x-6">
          <nav>
            <ul className="flex space-x-6">
              <li><Link href="/" className="text-sm font-medium text-gray-700 hover:text-primary-600 dark:text-gray-200 dark:hover:text-primary-400">Home</Link></li>
              <li><Link href="/articles" className="text-sm font-medium text-gray-700 hover:text-primary-600 dark:text-gray-200 dark:hover:text-primary-400">Articoli</Link></li>
              <li><Link href="/playground" className="text-sm font-medium text-gray-700 hover:text-primary-600 dark:text-gray-200 dark:hover:text-primary-400">AI Playground</Link></li>
              <li><Link href="/about" className="text-sm font-medium text-gray-700 hover:text-primary-600 dark:text-gray-200 dark:hover:text-primary-400">Chi siamo</Link></li>
            </ul>
          </nav>
        </div>
        
        <div className="flex items-center space-x-4">
          <ThemeToggle />
          
          <button
            className="md:hidden focus:outline-none"
            onClick={toggleMobileMenu}
            aria-label="Toggle mobile menu"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
      
      {/* Mobile menu */}
      <nav className={`${mobileMenuOpen ? 'block' : 'hidden'} px-4 py-3 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800`}>
        <ul className="space-y-3">
          <li><Link href="/" className="block text-sm font-medium text-gray-700 hover:text-primary-600 dark:text-gray-200 dark:hover:text-primary-400">Home</Link></li>
          <li><Link href="/articles" className="block text-sm font-medium text-gray-700 hover:text-primary-600 dark:text-gray-200 dark:hover:text-primary-400">Articoli</Link></li>
          <li><Link href="/playground" className="block text-sm font-medium text-gray-700 hover:text-primary-600 dark:text-gray-200 dark:hover:text-primary-400">AI Playground</Link></li>
          <li><Link href="/about" className="block text-sm font-medium text-gray-700 hover:text-primary-600 dark:text-gray-200 dark:hover:text-primary-400">Chi siamo</Link></li>
        </ul>
      </nav>
    </header>
  );
}
