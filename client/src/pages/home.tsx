import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';

// Business-oriented UI components
import BusinessHero from '@/components/home/BusinessHero';
import BusinessFeatures from '@/components/home/BusinessFeatures';
import BusinessArticles from '@/components/home/BusinessArticles';
import BusinessNewsletter from '@/components/home/BusinessNewsletter';

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
        
        {/* Professional hero section with video */}
        <BusinessHero />
        
        {/* Professional services/features grid */}
        <BusinessFeatures />
        
        {/* Articles in professional business style */}
        <BusinessArticles />
        
        {/* Newsletter with professional design */}
        <BusinessNewsletter />
      </motion.div>
    </>
  );
}
