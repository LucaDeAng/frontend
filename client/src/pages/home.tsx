import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';

// Educational-oriented UI components
import EducationalHero from '@/components/home/EducationalHero';
import TopicsSection from '@/components/home/TopicsSection';
import ArticleShowcase from '@/components/home/ArticleShowcase';
import PromptLibrary from '@/components/home/PromptLibrary';
import CommunityNewsletter from '@/components/home/CommunityNewsletter';

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
        
        {/* Educational hero section with video background */}
        <EducationalHero />
        
        {/* AI topics exploration section */}
        <TopicsSection />
        
        {/* Featured articles section */}
        <ArticleShowcase />
        
        {/* Prompt library with copyable templates */}
        <PromptLibrary />
        
        {/* Community newsletter signup */}
        <CommunityNewsletter />
      </motion.div>
    </>
  );
}
