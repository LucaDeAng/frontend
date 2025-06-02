import { useEffect } from "react";
import { Route, Switch } from "wouter";
import { AnimatePresence } from "framer-motion";
import EnhancedHeader from "@/components/EnhancedHeader";
import EnhancedFooter from "@/components/EnhancedFooter";
import Breadcrumb from "@/components/Breadcrumb";
import Home from "@/pages/home";
import Articles from "@/pages/articles";
import Article from "@/pages/article";
import Playground from "@/pages/playground";
import Admin from "@/pages/admin";
import AboutMe from "@/pages/about-me";
import BuildInPublic from "@/pages/build-in-public";
import NotFound from "@/pages/not-found";
import CustomCursor from "@/components/ui/cursor";
import ScrollProgress from "@/components/ui/scroll-progress";
import ReadingProgress from "@/components/ui/reading-progress";
import ParticleBackground from "@/components/ui/particle-background";
import FluidCursor from "@/components/ui/fluid-cursor";
import AdminLogin from "@/pages/AdminLogin";
import ProtectedRoute from "@/components/ProtectedRoute";
import TagPage from "@/pages/tag";
import CategoryPage from "@/pages/category";
import PreferencesPage from '@/pages/preferences';
import Newsletter from '@/pages/admin/Newsletter';

function App() {
  // Native smooth scroll with custom optimizations
  useEffect(() => {
    // Disabilita scroll a step e implementa scroll fluido nativo
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      
      const delta = e.deltaY;
      const scrollSpeed = 0.8; // Velocità ridotta per maggiore controllo
      
      // Calcola nuova posizione scroll
      const currentScroll = window.pageYOffset;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const newScroll = currentScroll + (delta * scrollSpeed);
      
      // Limiti per evitare scroll fuori pagina
      const clampedScroll = Math.max(0, Math.min(maxScroll, newScroll));
      
      window.scrollTo({
        top: clampedScroll,
        behavior: 'auto' // Scroll immediato senza smooth nativo
      });
    };

    // Ottimizzazioni per scroll fluido
    document.documentElement.style.scrollBehavior = 'auto';
    document.body.style.scrollBehavior = 'auto';
    
    // Event listener per wheel personalizzato
    window.addEventListener('wheel', handleWheel, { passive: false });

    // Recupera preferenza tema e applica classe
    fetch('/api/user/preferences')
      .then(res => res.json())
      .then(prefs => {
        if (prefs.theme === 'dark') {
          document.body.classList.add('dark');
          document.body.classList.remove('light');
        } else {
          document.body.classList.add('light');
          document.body.classList.remove('dark');
        }
      });

    return () => {
      window.removeEventListener('wheel', handleWheel);
      document.documentElement.style.scrollBehavior = '';
      document.body.style.scrollBehavior = '';
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-black text-white">
      {/* Custom cursors */}
      <CustomCursor />
      <FluidCursor 
        SIM_RESOLUTION={128}
        DYE_RESOLUTION={1024}
        DENSITY_DISSIPATION={2.5}
        VELOCITY_DISSIPATION={1.5}
        PRESSURE={0.8}
        CURL={2}
        SPLAT_RADIUS={0.3}
        SPLAT_FORCE={4000}
        SHADING={true}
        COLOR_UPDATE_SPEED={5}
      />
      
      {/* Enhanced progress indicators */}
      <ScrollProgress />
      <ReadingProgress />
      
      {/* Particle background */}
      <ParticleBackground />
      
      <EnhancedHeader />
      <Breadcrumb />
      <main className="flex-grow relative z-10">
        <AnimatePresence mode="sync" initial={false}>
          <Switch>
            <Route path="/" component={Home} />
            <Route path="/articles" component={Articles} />
            <Route path="/article/:slug" component={Article} />
            <Route path="/playground" component={Playground} />
            <Route path="/about" component={AboutMe} />
            <Route path="/build-in-public" component={BuildInPublic} />
            <Route path="/admin/login" component={AdminLogin} />
            <Route path="/admin">
              <ProtectedRoute>
                <Admin />
              </ProtectedRoute>
            </Route>
            <Route path="/admin/newsletter">
              <ProtectedRoute>
                <Newsletter />
              </ProtectedRoute>
            </Route>
            <Route path="/tag/:tag" component={TagPage} />
            <Route path="/category/:category" component={CategoryPage} />
            <Route path="/preferences" component={PreferencesPage} />
            <Route component={NotFound} />
          </Switch>
        </AnimatePresence>
      </main>
      <EnhancedFooter />
    </div>
  );
}

export default App;
