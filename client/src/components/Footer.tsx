import { Link } from 'wouter';
import { PlusCircle, Facebook, Twitter, Instagram, Github } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-100 dark:bg-gray-800 pt-12 pb-8 border-t border-gray-200 dark:border-gray-700">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center font-bold text-xl text-primary-600 dark:text-primary-400 mb-4">
              <span className="flex items-center justify-center w-8 h-8 rounded-md bg-primary-500 text-white mr-2">
                <PlusCircle className="h-5 w-5" />
              </span>
              AI Hub
            </Link>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Il punto di riferimento italiano per l'intelligenza artificiale.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                <Github className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200 uppercase tracking-wider mb-4">Risorse</h3>
            <ul className="space-y-3">
              <li><Link href="/articles" className="text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400">Articoli</Link></li>
              <li><Link href="/playground" className="text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400">AI Playground</Link></li>
              <li><Link href="/tutorial" className="text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400">Tutorial</Link></li>
              <li><Link href="/resources" className="text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400">Risorse Utili</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200 uppercase tracking-wider mb-4">Comunità</h3>
            <ul className="space-y-3">
              <li><Link href="/about" className="text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400">Chi Siamo</Link></li>
              <li><Link href="/forum" className="text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400">Forum</Link></li>
              <li><Link href="/events" className="text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400">Eventi</Link></li>
              <li><Link href="/contribuisci" className="text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400">Contribuisci</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200 uppercase tracking-wider mb-4">Legale</h3>
            <ul className="space-y-3">
              <li><Link href="/privacy" className="text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400">Termini di Servizio</Link></li>
              <li><Link href="/cookies" className="text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400">Politica dei Cookies</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-200 dark:border-gray-700 pt-8">
          <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
            &copy; {new Date().getFullYear()} AI Hub. Tutti i diritti riservati.
          </p>
        </div>
      </div>
    </footer>
  );
}
