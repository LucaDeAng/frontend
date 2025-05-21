import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';

export default function BusinessHero() {
  return (
    <section className="relative overflow-hidden bg-black py-20 lg:py-32">
      {/* Subtle background elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-black to-black/90"></div>
      <div className="absolute inset-0 grid-pattern opacity-5"></div>
      
      {/* Gradient effect */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] rounded-full bg-primary/10 filter blur-[120px]"></div>
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] rounded-full bg-secondary/10 filter blur-[120px]"></div>
      
      <div className="container mx-auto px-6 md:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-16 items-center">
          {/* Hero content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="order-2 lg:order-1"
          >
            {/* Microcopy / Badge */}
            <div className="inline-flex items-center mb-6 py-1 px-3 rounded-full bg-primary/10 border border-primary/20">
              <span className="text-xs font-medium text-primary">Esperto di Intelligenza Artificiale</span>
            </div>
            
            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 leading-tight text-white">
              Soluzioni e strategie <br />
              <span className="bg-gradient-to-r from-primary to-secondary text-transparent bg-clip-text">
                con Generative AI
              </span>
            </h1>
            
            {/* Subheadline */}
            <p className="text-xl text-gray-300 mb-8 max-w-xl">
              Sfrutta il potenziale della Generative AI per trasformare il tuo business 
              e ottimizzare processi aziendali con soluzioni concrete.
            </p>
            
            {/* CTA buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                className="bg-primary hover:bg-primary/90 text-black font-medium rounded-md"
                asChild
              >
                <Link href="/articles">
                  <span>Esplora gli articoli</span>
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              
              <Button
                size="lg"
                variant="outline"
                className="border-white/20 hover:border-white/40 hover:bg-white/5 rounded-md"
                asChild
              >
                <Link href="/about">Scopri di più</Link>
              </Button>
            </div>
            
            {/* Trust indicators */}
            <div className="mt-12">
              <p className="text-sm text-gray-400 mb-4">Aziende che hanno implementato le mie soluzioni</p>
              <div className="flex flex-wrap items-center gap-8">
                {['Company 1', 'Company 2', 'Company 3', 'Company 4'].map((company, index) => (
                  <div 
                    key={index}
                    className="grayscale opacity-70 hover:opacity-100 hover:grayscale-0 transition-all duration-300"
                  >
                    <div className="h-6 w-24 bg-white/20 rounded animate-pulse"></div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
          
          {/* Hero image or video */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="order-1 lg:order-2 rounded-2xl overflow-hidden border border-white/10"
          >
            <div className="aspect-video bg-gradient-to-br from-black via-secondary/20 to-primary/20 relative">
              {/* Professional video overlay */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-primary/20 backdrop-blur-sm border border-primary/30 flex items-center justify-center cursor-pointer hover:bg-primary/30 transition-all duration-300 group">
                  <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center transform group-hover:scale-90 transition-transform duration-300">
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      width="24" 
                      height="24" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="2" 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      className="text-black"
                    >
                      <polygon points="5 3 19 12 5 21 5 3" />
                    </svg>
                  </div>
                </div>
              </div>
              
              {/* Video placeholder with gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
              
              {/* Professional video component would go here */}
              <video
                autoPlay
                muted
                loop
                playsInline
                className="w-full h-full object-cover"
              >
                <source src="https://cdn.example.com/videos/ai-demo.mp4" type="video/mp4" />
              </video>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}