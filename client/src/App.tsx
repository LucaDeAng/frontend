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
import Lenis from "@studio-freight/lenis";
import AdminLogin from "@/pages/AdminLogin";
import ProtectedRoute from "@/components/ProtectedRoute";
import TagPage from "@/pages/tag";
import CategoryPage from "@/pages/category";
import PreferencesPage from '@/pages/preferences';
import Newsletter from '@/pages/admin/Newsletter';

function App() {
  // Initialize smooth scrolling with Lenis
  useEffect(() => {
    const lenis = new Lenis({
      duration: 0.6, // Ancora più veloce
      easing: (t: number) => t, // Linear per massima performance
      wheelMultiplier: 2, // Più responsivo
    });

    let isScrolling = false;
    let scrollTimeout: NodeJS.Timeout;

    // Ottimizzazione per disabilitare animazioni durante scroll
    lenis.on('scroll', () => {
      if (!isScrolling) {
        document.body.classList.add('scrolling');
        isScrolling = true;
      }
      
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        document.body.classList.remove('scrolling');
        isScrolling = false;
      }, 150); // Riabilita animazioni dopo 150ms di inattività
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    // Usa scheduler con priorità alta per scroll fluido
    const startRAF = () => {
      if ('scheduler' in window && 'postTask' in window.scheduler) {
        // Usa scheduler API per priorità alta
        window.scheduler.postTask(() => {
          requestAnimationFrame(raf);
        }, { priority: 'user-blocking' });
      } else {
        requestAnimationFrame(raf);
      }
    };

    startRAF();

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
      clearTimeout(scrollTimeout);
      document.body.classList.remove('scrolling');
      lenis.destroy();
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
