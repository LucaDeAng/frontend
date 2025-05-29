import { useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import VotablePrompt from '@/components/playground/VotablePrompt';

export default function Playground() {
  return (
    <>
      <Helmet>
        <title>AI Prompts | AI Hub</title>
        <meta name="description" content="Discover our library of best AI prompts. Copy directly to GPT." />
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
                Discover our collection of best AI prompts for various use cases. Copy directly to GPT.
              </p>
            </div>
            <div className="w-full">
              <VotablePrompt />
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}