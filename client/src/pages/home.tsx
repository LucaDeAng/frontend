import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';

// Futuristic UI components
import FuturisticHero from '@/components/home/FuturisticHero';
import ExperimentsSection from '@/components/home/ExperimentsSection';
import FuturisticArticles from '@/components/home/FuturisticArticles';
import FuturisticNewsletter from '@/components/home/FuturisticNewsletter';

export default function Home() {
  return (
    <>
      <Helmet>
        <title>Luca De Angelis // AI Researcher & Generative AI Expert</title>
        <meta name="description" content="Consulenza ed implementazione di soluzioni AI generativa per trasformare la tua azienda. Scopri i miei progetti e servizi sull'intelligenza artificiale." />
        <meta property="og:title" content="Luca De Angelis // AI Researcher & Generative AI Expert" />
        <meta property="og:description" content="Consulenza ed implementazione di soluzioni AI generativa per trasformare la tua azienda. Scopri i miei progetti e servizi sull'intelligenza artificiale." />
        <meta property="og:type" content="website" />
      </Helmet>
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="relative"
      >
        {/* Scroll progress indicator is in App.tsx */}
        
        {/* Fullscreen hero with animated terminal effect */}
        <FuturisticHero />
        
        {/* AI Experiments showcase with glassmorphism cards */}
        <ExperimentsSection />
        
        {/* Latest articles with 3D hover effects */}
        <FuturisticArticles />
        
        {/* Newsletter with futuristic form */}
        <FuturisticNewsletter />
      </motion.div>
    </>
  );
}
