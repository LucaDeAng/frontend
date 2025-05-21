import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { ArrowRight, Book, Brain, Bot, Sparkles } from 'lucide-react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import CommunityNewsletter from '@/components/home/CommunityNewsletter';

export default function Home() {
  return (
    <>
      <Helmet>
        <title>AI Hub | Artificial Intelligence Resources</title>
        <meta name="description" content="Explore our educational resources on AI, including articles, prompts, and tools to help you leverage artificial intelligence effectively." />
        <meta property="og:title" content="AI Hub | Artificial Intelligence Resources" />
        <meta property="og:description" content="Explore our educational resources on AI, including articles, prompts, and tools to help you leverage artificial intelligence effectively." />
        <meta property="og:type" content="website" />
      </Helmet>
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="relative"
      >
        {/* Hero section with video background */}
        <section className="relative py-28 md:py-36 overflow-hidden bg-black">
          <div className="absolute inset-0 z-0 overflow-hidden">
            <video 
              autoPlay 
              loop 
              muted
              className="w-full h-full object-cover opacity-30"
            >
              <source src="https://d2vr5vtixzw9nj.cloudfront.net/hero-bg-dark.mp4" type="video/mp4" />
            </video>
            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/90 to-black/80"></div>
          </div>
          
          <div className="container mx-auto px-6 md:px-8 relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <motion.h1 
                className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-white"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                Your <span className="bg-gradient-to-r from-primary to-secondary text-transparent bg-clip-text">AI Resource</span> Hub
              </motion.h1>
              
              <motion.p 
                className="text-xl text-gray-300 mb-10 leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                Explore our educational content, best practices, and tools to help you leverage artificial intelligence effectively.
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
                  <Button variant="outline" className="px-6 py-6 border-white/10 bg-black/40 text-white rounded-lg w-full sm:w-auto">
                    <Bot className="mr-2 h-5 w-5" />
                    <span>AI Prompts</span>
                  </Button>
                </Link>
              </motion.div>
            </div>
          </div>
        </section>
        
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
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  title: "Educational Articles",
                  description: "In-depth articles about AI technologies, applications, and best practices to keep you informed.",
                  icon: <Book className="h-10 w-10 text-primary" />,
                  link: "/articles",
                  delay: 0.1
                },
                {
                  title: "AI Prompt Library",
                  description: "Collection of effective prompts for various AI tasks that you can copy directly to GPT.",
                  icon: <Brain className="h-10 w-10 text-primary" />,
                  link: "/playground",
                  delay: 0.2
                },
                {
                  title: "AI Playground",
                  description: "Interactive environment to test and experiment with AI models and see the results in real-time.",
                  icon: <Sparkles className="h-10 w-10 text-primary" />,
                  link: "/playground",
                  delay: 0.3
                }
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: feature.delay }}
                  className="bg-black/30 border border-white/10 rounded-xl p-6 hover:border-primary/30 transition-all duration-300 flex flex-col"
                >
                  <div className="rounded-full bg-primary/10 w-16 h-16 flex items-center justify-center mb-5">
                    {feature.icon}
                  </div>
                  
                  <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                  
                  <p className="text-gray-400 mb-6 flex-1">{feature.description}</p>
                  
                  <Link href={feature.link} className="text-primary flex items-center font-medium hover:text-primary/80 transition-colors mt-auto">
                    <span>Explore</span>
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
        
        {/* Newsletter signup */}
        <CommunityNewsletter />
      </motion.div>
    </>
  );
}
