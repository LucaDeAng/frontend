import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CheckCircle, ClipboardCopy, Filter, Search, X } from 'lucide-react';
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
  
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(promptText);
      setCopied(true);
      
      toast({
        title: "Copied to clipboard",
        description: "The prompt has been copied and is ready to paste into ChatGPT",
      });
      
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Please try again or copy manually",
        variant: "destructive"
      });
    }
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="bg-black/30 border border-white/10 rounded-xl p-6 hover:border-primary/30 transition-all duration-300"
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
          <p className="text-gray-400 text-sm">{description}</p>
        </div>
        
        <div className="flex gap-1.5 flex-wrap">
          <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full">
            {category}
          </span>
          <span className="text-xs px-2 py-1 bg-black/50 text-gray-300 rounded-full">
            {model}
          </span>
        </div>
      </div>
      
      <div className="relative mt-4 bg-black/50 border border-white/10 rounded-lg p-4 mb-4">
        <p className="text-gray-300 text-sm whitespace-pre-wrap">{promptText}</p>
      </div>
      
      <Button
        variant="outline"
        size="sm"
        onClick={copyToClipboard}
        className="flex items-center gap-2 bg-black/20 hover:bg-primary/20 hover:text-primary border-white/10"
      >
        {copied ? (
          <>
            <CheckCircle className="h-4 w-4" />
            <span>Copied!</span>
          </>
        ) : (
          <>
            <ClipboardCopy className="h-4 w-4" />
            <span>Copy to GPT</span>
          </>
        )}
      </Button>
    </motion.div>
  );
};

export default function PromptLibrary() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeModel, setActiveModel] = useState('all');
  
  // Sample prompts data
  const prompts = [
    {
      id: 1,
      title: "Professional Email Writer",
      description: "Create professional-sounding emails with a formal tone",
      promptText: "Write a professional email to [recipient] about [topic]. The email should be formal but friendly, clear and concise, and include a specific request or call to action. Sign the email as [your name].",
      category: "Business",
      model: "GPT-4o"
    },
    {
      id: 2,
      title: "Creative Story Generator",
      description: "Generate creative short stories with detailed characters",
      promptText: "Write a short story set in [setting] with a main character who is [character description]. The story should include a surprising twist and end with [type of ending].",
      category: "Creative",
      model: "GPT-4o"
    },
    {
      id: 3,
      title: "Academic Paper Summarizer",
      description: "Summarize academic papers clearly and concisely",
      promptText: "Summarize the following academic paper in about 250 words. Focus on the main research question, methodology, key findings, and implications. Use clear, straightforward language:\n\n[paste paper abstract or text here]",
      category: "Academic",
      model: "GPT-4o"
    },
    {
      id: 4,
      title: "Code Explainer",
      description: "Explain complex code in simple terms",
      promptText: "Explain the following code as if you're teaching a beginner programmer. Break down the logic step by step, explain any important concepts, and suggest how it might be improved:\n\n```\n[paste code here]\n```",
      category: "Programming",
      model: "GPT-4o"
    },
    {
      id: 5,
      title: "Meeting Summary Generator",
      description: "Create concise summaries of business meetings",
      promptText: "Create a summary of the following meeting notes. Organize by main topics discussed, decisions made, action items (with person responsible and deadline), and any open questions. Format it in a clear, scannable structure:\n\n[paste meeting notes here]",
      category: "Business",
      model: "GPT-4o"
    },
    {
      id: 6,
      title: "Product Description Writer",
      description: "Write compelling product descriptions for e-commerce",
      promptText: "Write a compelling product description for [product name], which is a [product category]. Key features include: [list features]. The target audience is [target audience]. The tone should be [desired tone, e.g., professional, enthusiastic, luxurious]. Include a catchy headline and bullet points for features.",
      category: "Marketing",
      model: "GPT-3.5"
    },
    {
      id: 7,
      title: "Learning Concept Explainer",
      description: "Explain complex concepts in simple terms for students",
      promptText: "Explain [complex concept] to me as if I'm a [education level] student. Break it down into simple parts, use everyday analogies, and provide examples that would make sense to someone my age. At the end, include 3 quick questions I could answer to test my understanding.",
      category: "Education",
      model: "GPT-4o"
    },
    {
      id: 8,
      title: "Blog Post Outline Creator",
      description: "Create detailed outlines for blog posts",
      promptText: "Create a detailed outline for a blog post titled \"[blog post title]\" targeting [target audience]. The post should focus on [main focus/topic] and include [specific elements to include]. Structure the outline with an introduction, at least 4-5 main sections with subsections, and a conclusion. For each section, provide a brief description of what to cover.",
      category: "Content",
      model: "GPT-3.5"
    }
  ];
  
  // Extract unique categories and models
  const uniqueCategories = [...new Set(prompts.map(prompt => prompt.category))];
  const uniqueModels = [...new Set(prompts.map(prompt => prompt.model))];
  const categories = ['all', ...uniqueCategories];
  const models = ['all', ...uniqueModels];
  
  // Filter prompts based on search, category, and model
  const filteredPrompts = prompts.filter(prompt => {
    const matchesSearch = 
      searchTerm === '' || 
      prompt.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prompt.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prompt.promptText.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesCategory = activeCategory === 'all' || prompt.category === activeCategory;
    const matchesModel = activeModel === 'all' || prompt.model === activeModel;
    
    return matchesSearch && matchesCategory && matchesModel;
  });
  
  // Clear filters
  const clearFilters = () => {
    setSearchTerm('');
    setActiveCategory('all');
    setActiveModel('all');
  };
  
  return (
    <div className="mt-10">
      <div className="mb-8">
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
          <Input
            type="text"
            placeholder="Search for prompts by keyword or phrase..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 py-6 bg-black/30 border-white/10 focus:border-primary/30 rounded-lg"
          />
          {searchTerm && (
            <button 
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
              onClick={() => setSearchTerm('')}
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        
        <div className="flex flex-wrap gap-3 justify-between items-center">
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-white">Filter by Category</h3>
            <div className="flex flex-wrap gap-2">
              {categories.map(category => (
                <button
                  key={category}
                  className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                    activeCategory === category
                      ? 'bg-primary text-black font-medium'
                      : 'bg-black/50 text-gray-300 hover:bg-white/10'
                  }`}
                  onClick={() => setActiveCategory(category)}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
          
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-white">Filter by Model</h3>
            <div className="flex flex-wrap gap-2">
              {models.map(model => (
                <button
                  key={model}
                  className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                    activeModel === model
                      ? 'bg-primary text-black font-medium'
                      : 'bg-black/50 text-gray-300 hover:bg-white/10'
                  }`}
                  onClick={() => setActiveModel(model)}
                >
                  {model}
                </button>
              ))}
            </div>
          </div>
          
          {(searchTerm || activeCategory !== 'all' || activeModel !== 'all') && (
            <Button
              variant="outline"
              size="sm"
              onClick={clearFilters}
              className="px-3 py-1.5 h-auto bg-black/30 border-white/10 hover:bg-white/10 text-white"
            >
              <X className="h-4 w-4 mr-2" />
              Clear filters
            </Button>
          )}
        </div>
      </div>
      
      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">
          {filteredPrompts.length > 0 ? (
            <>{filteredPrompts.length} {filteredPrompts.length === 1 ? 'Prompt' : 'Prompts'} Found</>
          ) : (
            'No Prompts Found'
          )}
        </h2>
      </div>
      
      <div className="grid grid-cols-1 gap-6">
        {filteredPrompts.length > 0 ? (
          filteredPrompts.map((prompt, index) => (
            <PromptCard
              key={prompt.id}
              title={prompt.title}
              description={prompt.description}
              promptText={prompt.promptText}
              category={prompt.category}
              model={prompt.model}
              index={index}
            />
          ))
        ) : (
          <div className="text-center py-16 bg-black/30 border border-white/10 rounded-xl">
            <p className="text-gray-400">No prompts found matching your criteria.</p>
            <p className="text-gray-500 text-sm mt-2">Try adjusting your search or filters.</p>
          </div>
        )}
      </div>
    </div>
  );
}