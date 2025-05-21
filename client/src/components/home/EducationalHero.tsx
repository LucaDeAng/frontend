import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';

export default function EducationalHero() {
  return (
    <section className="relative w-full h-screen overflow-hidden flex items-center">
      {/* Full-screen background video */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-black/70 z-10"></div>
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="https://assets.mixkit.co/videos/preview/mixkit-artificial-intelligence-brain-activity-display-91-large.mp4" type="video/mp4" />
        </video>
      </div>
      
      {/* Gradient overlay */}
      <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-black to-transparent z-10"></div>

      <div className="container mx-auto px-6 md:px-8 relative z-20">
        <div className="max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            {/* Badge */}
            <div className="inline-flex items-center mb-6 py-1 px-3 rounded-full bg-primary/20 border border-primary/30">
              <span className="text-xs font-medium text-primary">AI Learning Community</span>
            </div>
            
            {/* Main headline */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight text-white">
              Mastering <span className="bg-gradient-to-r from-primary to-secondary text-transparent bg-clip-text">Generative AI</span> Together
            </h1>
            
            {/* Subheadline */}
            <p className="text-xl text-gray-300 mb-8 max-w-2xl">
              Explore cutting-edge articles, expert insights, and optimized prompts to unlock the full potential of AI in your work and projects.
            </p>
            
            {/* CTA buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                className="bg-primary hover:bg-primary/90 text-black font-medium rounded-md"
                asChild
              >
                <Link href="/articles">
                  <span>Explore Articles</span>
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              
              <Button
                size="lg"
                variant="outline"
                className="border-white/20 hover:border-white/40 hover:bg-white/5 rounded-md"
                asChild
              >
                <Link href="/about">Learn More</Link>
              </Button>
            </div>
            
            {/* Key topics */}
            <div className="mt-12 flex flex-wrap gap-3">
              {['ChatGPT', 'Midjourney', 'Stable Diffusion', 'GPT-4', 'LLM Fine-tuning', 'Prompt Engineering'].map((topic) => (
                <div 
                  key={topic}
                  className="px-3 py-1 rounded-full bg-white/10 hover:bg-primary/20 border border-white/10 hover:border-primary/30 text-sm text-white transition-all duration-300"
                >
                  {topic}
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* Scroll indicator */}
      <motion.div 
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ 
          duration: 1,
          delay: 1,
        }}
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ 
            duration: 1.5,
            repeat: Infinity,
            repeatType: "loop" 
          }}
          className="flex flex-col items-center"
        >
          <div className="w-5 h-10 rounded-full border-2 border-white/30 mb-2 flex justify-center">
            <motion.div 
              animate={{ 
                y: [0, 12, 0],
                opacity: [0.5, 1, 0.5] 
              }}
              transition={{ 
                duration: 1.5,
                repeat: Infinity,
                repeatType: "loop" 
              }}
              className="w-1 h-1 rounded-full bg-white mt-2"
            />
          </div>
          <span className="text-white/50 text-xs">Scroll</span>
        </motion.div>
      </motion.div>
    </section>
  );
}