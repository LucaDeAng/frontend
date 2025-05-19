import HeroSection from '@/components/home/HeroSection';
import FeaturesSection from '@/components/home/FeaturesSection';
import LatestArticlesSection from '@/components/home/LatestArticlesSection';
import NewsletterSection from '@/components/home/NewsletterSection';
import { Helmet } from 'react-helmet';

export default function Home() {
  return (
    <>
      <Helmet>
        <title>Luca De Angelis - AI Consultant & Generative AI Expert</title>
        <meta name="description" content="Luca De Angelis, esperto di Generative AI e consulente per l'implementazione di soluzioni di intelligenza artificiale per aziende e professionisti." />
        <meta property="og:title" content="Luca De Angelis - AI Consultant & Generative AI Expert" />
        <meta property="og:description" content="Luca De Angelis, esperto di Generative AI e consulente per l'implementazione di soluzioni di intelligenza artificiale per aziende e professionisti." />
        <meta property="og:type" content="website" />
      </Helmet>
      <HeroSection />
      <FeaturesSection />
      <LatestArticlesSection />
      <NewsletterSection />
    </>
  );
}
