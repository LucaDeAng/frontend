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
import Lenis from "@studio-freight/lenis";

function App() {
  // Initialize smooth scrolling with Lenis
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smooth: true,
      smoothTouch: false,
      touchMultiplier: 2,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-black text-white">
      {/* Custom cursor */}
      <CustomCursor />
      
      {/* Enhanced progress indicators */}
      <ScrollProgress />
      <ReadingProgress />
      
      {/* Particle background */}
      <ParticleBackground />
      
      <EnhancedHeader />
      <Breadcrumb />
      <main className="flex-grow relative z-10">
        <AnimatePresence mode="wait">
          <Switch>
            <Route path="/" component={Home} />
            <Route path="/articles" component={Articles} />
            <Route path="/article/:slug" component={Article} />
            <Route path="/playground" component={Playground} />
            <Route path="/about" component={AboutMe} />
            <Route path="/build-in-public" component={BuildInPublic} />
            <Route path="/admin" component={Admin} />
            <Route component={NotFound} />
          </Switch>
        </AnimatePresence>
      </main>
      <EnhancedFooter />
    </div>
  );
}

export default App;
