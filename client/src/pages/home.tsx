import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { ArrowRight, Book, Brain, Bot } from 'lucide-react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import CommunityNewsletter from '@/components/home/CommunityNewsletter';
import ArticleShowcase from '@/components/home/ArticleShowcase';
import AboutSection from '@/components/home/AboutSection';

export default function Home() {
  return (
    <>
      <Helmet>
        <title>AI Hub | Artificial Intelligence Business Solutions</title>
        <meta name="description" content="Transform your business with cutting-edge AI solutions. Expert consulting, strategy, and implementation for generative AI and machine learning technologies." />
        <meta property="og:title" content="AI Hub | Artificial Intelligence Business Solutions" />
        <meta property="og:description" content="Transform your business with cutting-edge AI solutions. Expert consulting, strategy, and implementation for generative AI and machine learning technologies." />
        <meta property="og:type" content="website" />
      </Helmet>
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="relative"
      >
        {/* Hero section with video background */}
        <section className="relative py-8 md:py-12 overflow-hidden bg-black">
          <div className="absolute inset-0 z-0 overflow-hidden">
            <video 
              autoPlay 
              loop 
              muted
              playsInline
              className="w-full h-full object-cover opacity-60"
            >
              <source src="https://player.vimeo.com/external/3163534.sd.mp4" type="video/mp4" />
            </video>
            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-black/70"></div>
          </div>
          
          <div className="container mx-auto px-6 md:px-8 relative z-10">
            <div className="max-w-3xl mx-auto text-center mt-8 md:mt-12">
              <motion.h1 
                className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-white"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                Transforming AI Vision <span className="bg-gradient-to-r from-primary to-secondary text-transparent bg-clip-text">into Business Impact</span>
              </motion.h1>
              
              <motion.p 
                className="text-xl text-gray-300 mb-10 leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                I help organizations translate emerging AI technologies into actionable strategies and measurable results. From roadmap to rollout, I bridge the gap between innovation and real-world value—responsibly, efficiently, and with a focus on impact.
              </motion.p>
              
              <motion.div
                className="flex flex-col sm:flex-row gap-4 justify-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <Link href="/articles">
                  <Button className="px-6 py-6 bg-primary hover:bg-primary/90 text-black font-medium rounded-lg w-full sm:w-auto">
                    <Book className="mr-2 h-5 w-5" />
                    <span>Browse Articles</span>
                  </Button>
                </Link>
                <Link href="/playground">
                  <Button className="px-6 py-6 border border-white/10 bg-black/40 text-white rounded-lg w-full sm:w-auto">
                    <Bot className="mr-2 h-5 w-5" />
                    <span>AI Prompts</span>
                  </Button>
                </Link>
              </motion.div>
            </div>
          </div>
        </section>
        
        {/* Newsletter signup */}
        <CommunityNewsletter />
        
        {/* Key features section */}
        <section className="py-20 bg-black">
          <div className="container mx-auto px-6 md:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
                Explore AI <span className="text-primary">Resources</span>
              </h2>
              <p className="text-gray-400 max-w-2xl mx-auto">
                Our platform offers various resources to help you understand and utilize AI effectively.
              </p>
            </motion.div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {[
                {
                  title: "Articles",
                  description: "Curated articles, guides, and analysis on AI technologies and applications. Stay updated with the latest trends and best practices.",
                  icon: <Book className="h-16 w-16 text-blue-400" />,
                  link: "/articles"
                },
                {
                  title: "AI Prompt Library",
                  description: "A professional collection of optimized prompts for various AI tasks. Ready to use with ChatGPT or other models.",
                  icon: <Brain className="h-16 w-16 text-cyan-400" />,
                  link: "/playground"
                },
                {
                  title: "Build in Public",
                  description: "Follow the platform's development in real time: roadmap, updates, features, and full transparency on the AI Hub project.",
                  icon: <Bot className="h-16 w-16 text-blue-300" />,
                  link: "/build-in-public"
                }
              ].map((block, i) => (
                <motion.div
                  key={block.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.7, delay: i * 0.1 }}
                  className="relative bg-[#06091A] rounded-[60px] border border-white/10 shadow-lg flex flex-col justify-between items-center text-center min-h-[420px] p-10 group overflow-hidden"
                >
                  <div className="flex-1 flex items-center justify-center w-full mb-6">
                    {block.icon}
                  </div>
                  <div className="w-full">
                    <h3 className="mb-3 text-xl font-bold text-white text-left w-full">{block.title}</h3>
                    <p className="text-gray-300 text-left w-full mb-8 text-base leading-relaxed">{block.description}</p>
                    <Button asChild size="lg" className="rounded-full px-8 py-3 text-base font-semibold shadow bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-300 hover:opacity-90 group-hover:scale-105 transition-transform w-full">
                      <Link href={block.link} className="flex items-center gap-2 justify-center">
                        Explore <ArrowRight className="h-5 w-5" />
                      </Link>
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
        
        {/* About section */}
        <AboutSection />
        
        {/* Featured articles section */}
        <ArticleShowcase />
      </motion.div>
    </>
  );
}
