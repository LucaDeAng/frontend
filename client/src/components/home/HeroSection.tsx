import { Link } from "wouter";
import Container from "@/components/layout/Container";
import { Button } from "@/components/ui/button";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-white dark:bg-gray-900 pt-16 pb-24 md:pt-24 md:pb-32">
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-primary-50/30 to-white/0 dark:from-primary-900/20 dark:to-gray-900/0"></div>
      
      <Container className="relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 dark:text-white mb-6">
              <span className="block">Esplora il futuro con</span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-accent-600">AI Hub</span>
            </h1>
            
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl">
              Il punto di riferimento italiano per l'intelligenza artificiale. Articoli, risorse e strumenti per comprendere e utilizzare le tecnologie AI più avanzate.
            </p>
            
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <Button
                asChild
                className="inline-flex justify-center items-center px-6 py-3 text-base font-medium shadow-sm"
              >
                <Link href="/articles">
                  Scopri gli articoli
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="inline-flex justify-center items-center px-6 py-3 text-base font-medium border border-gray-300 dark:border-gray-700 shadow-sm"
              >
                <Link href="/playground">
                  Prova il Playground
                </Link>
              </Button>
            </div>
          </div>
          
          <div className="relative">
            <img 
              src="https://images.unsplash.com/photo-1531746790731-6c087fecd65a?ixlib=rb-4.0.3&auto=format&fit=crop&w=900&h=700&q=80" 
              alt="Modern tech workspace with AI elements" 
              className="rounded-xl shadow-2xl w-full h-auto object-cover transform hover:scale-[1.02] transition-transform duration-300" 
            />
            <div className="absolute -bottom-5 -right-5 md:-bottom-8 md:-right-8 w-24 h-24 md:w-32 md:h-32 rounded-xl bg-accent-500 opacity-20 dark:opacity-30 blur-xl"></div>
            <div className="absolute -top-5 -left-5 md:-top-8 md:-left-8 w-24 h-24 md:w-32 md:h-32 rounded-xl bg-primary-500 opacity-20 dark:opacity-30 blur-xl"></div>
          </div>
        </div>
      </Container>
    </section>
  );
}
