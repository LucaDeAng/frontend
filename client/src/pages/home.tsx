import HeroSection from '@/components/home/HeroSection';
import FeaturesSection from '@/components/home/FeaturesSection';
import LatestArticlesSection from '@/components/home/LatestArticlesSection';
import PlaygroundPreview from '@/components/home/PlaygroundPreview';
import NewsletterSection from '@/components/home/NewsletterSection';
import { Helmet } from 'react-helmet';

export default function Home() {
  return (
    <>
      <Helmet>
        <title>AI Hub - La tua risorsa per l'intelligenza artificiale</title>
        <meta name="description" content="Il punto di riferimento italiano per l'intelligenza artificiale. Articoli, risorse e strumenti per comprendere e utilizzare le tecnologie AI più avanzate." />
        <meta property="og:title" content="AI Hub - La tua risorsa per l'intelligenza artificiale" />
        <meta property="og:description" content="Il punto di riferimento italiano per l'intelligenza artificiale. Articoli, risorse e strumenti per comprendere e utilizzare le tecnologie AI più avanzate." />
        <meta property="og:type" content="website" />
      </Helmet>
      <HeroSection />
      <FeaturesSection />
      <LatestArticlesSection />
      <PlaygroundPreview />
      <NewsletterSection />
    </>
  );
}
