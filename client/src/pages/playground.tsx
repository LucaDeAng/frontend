import { useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AiPlayground from '@/components/playground/AiPlayground';
import PromptLibrary from '@/components/playground/PromptLibrary';

export default function Playground() {
  const [activeTab, setActiveTab] = useState('prompts');
  
  return (
    <>
      <Helmet>
        <title>AI Prompts | AI Hub</title>
        <meta name="description" content="Discover our library of best AI prompts. Copy directly to GPT or experiment with the AI playground." />
      </Helmet>
      
      <section className="py-20 md:py-28 bg-black">
        <div className="container mx-auto px-6 md:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-4xl mx-auto"
          >
            <div className="text-center mb-12">
              <div className="inline-flex items-center px-3 py-1 rounded-full border border-primary/30 mb-6 bg-primary/5">
                <span className="text-xs font-medium text-primary">AI Resources</span>
              </div>
              
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-white">
                <span className="bg-gradient-to-r from-primary to-secondary text-transparent bg-clip-text">
                  AI Prompts Library
                </span>
              </h1>
              
              <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                Discover our collection of best AI prompts for various use cases. Copy directly to GPT or experiment with the AI playground.
              </p>
            </div>
            
            <Tabs defaultValue="prompts" className="w-full" onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-2 mb-10 bg-black/20 border border-white/10 p-1">
                <TabsTrigger
                  value="prompts"
                  className={`text-sm py-2.5 data-[state=active]:bg-primary data-[state=active]:text-black data-[state=active]:shadow-none data-[state=inactive]:bg-transparent data-[state=inactive]:text-white`}
                >
                  Prompt Library
                </TabsTrigger>
                <TabsTrigger
                  value="playground"
                  className={`text-sm py-2.5 data-[state=active]:bg-primary data-[state=active]:text-black data-[state=active]:shadow-none data-[state=inactive]:bg-transparent data-[state=inactive]:text-white`}
                >
                  AI Playground
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="prompts" className="mt-0">
                <PromptLibrary />
              </TabsContent>
              
              <TabsContent value="playground" className="mt-0">
                <AiPlayground />
              </TabsContent>
            </Tabs>
          </motion.div>
        </div>
      </section>
    </>
  );
}