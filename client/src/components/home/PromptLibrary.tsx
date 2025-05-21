import { useState } from 'react';
import { motion } from 'framer-motion';
import { Copy, Check, BookOpen } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface PromptCardProps {
  title: string;
  description: string;
  promptText: string;
  category: string;
  model: string;
  index: number;
}

const PromptCard = ({ title, description, promptText, category, model, index }: PromptCardProps) => {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();
  
  const handleCopy = () => {
    navigator.clipboard.writeText(promptText);
    setCopied(true);
    
    toast({
      title: "Prompt copied",
      description: "The prompt has been copied to your clipboard",
      variant: "default"
    });
    
    setTimeout(() => setCopied(false), 2000);
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="rounded-xl bg-white/5 border border-white/10 overflow-hidden flex flex-col"
    >
      <div className="p-6 flex-grow">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-bold text-white">{title}</h3>
          <div className="px-2 py-1 rounded-full bg-primary/10 text-xs text-primary">
            {category}
          </div>
        </div>
        
        <p className="text-gray-400 text-sm mb-4">
          {description}
        </p>
        
        <div className="flex items-center mb-4 text-xs text-gray-500">
          <span className="mr-2">Recommended for:</span>
          <span className="px-2 py-0.5 rounded-full bg-black/30 border border-white/10">{model}</span>
        </div>
      </div>
      
      <div className="p-4 bg-black/30 border-t border-white/10 relative">
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center">
            <BookOpen className="h-3.5 w-3.5 mr-1.5 text-primary" />
            <span className="text-xs text-gray-400">Prompt Template</span>
          </div>
          
          <button
            onClick={handleCopy}
            className="text-gray-400 hover:text-primary transition-colors p-1 rounded-md hover:bg-primary/10"
          >
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          </button>
        </div>
        
        <div className="font-mono text-xs bg-black/50 rounded-md p-3 max-h-32 overflow-y-auto text-gray-300">
          {promptText}
        </div>
      </div>
    </motion.div>
  );
};

export default function PromptLibrary() {
  const prompts = [
    {
      title: "Creative Story Opener",
      description: "Generate compelling opening paragraphs for short stories based on a simple premise.",
      promptText: "Write the opening paragraph of a short story based on this premise: [PREMISE]. Set the scene with sensory details, introduce a main character with a unique voice, and hint at an underlying conflict. The tone should be [TONE].",
      category: "Creative Writing",
      model: "GPT-4 / Claude"
    },
    {
      title: "Detailed Image Generator",
      description: "Creates highly detailed image generation prompts for AI art models.",
      promptText: "Create a [SUBJECT] in [STYLE] style. The image should feature [DETAILS] with [LIGHTING] and a [ATMOSPHERE] mood. Include fine details like [SPECIFIC ELEMENTS] and use a color palette of [COLORS].",
      category: "Image Generation",
      model: "Midjourney / DALL-E"
    },
    {
      title: "Code Refactoring Assistant",
      description: "Improve existing code by making it more efficient, readable, and maintainable.",
      promptText: "Refactor the following [LANGUAGE] code to improve its readability, efficiency, and adherence to best practices. Explain the changes you make and why they improve the code.\n\n```\n[CODE]\n```",
      category: "Programming",
      model: "GPT-4 / Claude"
    },
    {
      title: "Comprehensive Research Analysis",
      description: "Deep analysis of a topic with balanced perspectives and evidence-based insights.",
      promptText: "Provide a comprehensive analysis of [TOPIC] covering:\n1. Historical context and development\n2. Current state and key challenges\n3. Different perspectives (include at least 3 contrasting viewpoints)\n4. Evidence-based assessment of benefits and limitations\n5. Future implications and research directions\n\nInclude specific examples, data points when possible, and maintain a balanced academic tone.",
      category: "Research",
      model: "GPT-4 / Claude"
    },
    {
      title: "Engaging Social Media Content",
      description: "Generate platform-specific social media content that drives engagement.",
      promptText: "Create 5 engaging social media posts for [PLATFORM] about [TOPIC/PRODUCT]. Each post should:\n- Be optimized for the platform's format and audience\n- Include appropriate hashtags and call-to-action\n- Have a unique angle or hook\n- Align with a [BRAND VOICE] tone\n- Incorporate trending elements when relevant",
      category: "Marketing",
      model: "GPT-3.5 / Claude"
    },
    {
      title: "Data Analysis Framework",
      description: "Structure for analyzing datasets and extracting meaningful insights.",
      promptText: "I have a dataset about [DATASET DESCRIPTION]. Help me analyze it by:\n1. Suggesting the key variables to examine\n2. Outlining potential correlations to investigate\n3. Recommending statistical methods appropriate for this data\n4. Suggesting data visualization approaches\n5. Identifying potential insights that would be valuable for [BUSINESS/RESEARCH GOAL]\n\nProvide a structured framework that I can follow for my analysis.",
      category: "Data Science",
      model: "GPT-4"
    }
  ];

  return (
    <section className="py-24 bg-black">
      <div className="container mx-auto px-6 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <div className="inline-flex items-center px-3 py-1 rounded-full border border-primary/30 mb-6 bg-primary/5">
            <span className="text-xs font-medium text-primary">Prompt Engineering</span>
          </div>
          
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
            Optimized <span className="text-primary">Prompt Library</span>
          </h2>
          
          <p className="text-gray-400 text-lg">
            A curated collection of effective prompts that you can copy, customize, and use right away with popular AI models.
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {prompts.map((prompt, index) => (
            <PromptCard
              key={index}
              title={prompt.title}
              description={prompt.description}
              promptText={prompt.promptText}
              category={prompt.category}
              model={prompt.model}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
}