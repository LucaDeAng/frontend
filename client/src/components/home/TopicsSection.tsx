import { motion } from 'framer-motion';
import { 
  BrainCircuit, 
  ImageIcon, 
  MessageSquare, 
  FileText, 
  Code, 
  Lightbulb 
} from 'lucide-react';

interface TopicCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay: number;
}

const TopicCard = ({ icon, title, description, delay }: TopicCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: delay * 0.1 }}
      className="flex flex-col p-6 rounded-xl bg-white/5 border border-white/10 hover:border-primary/30 transition-all duration-300 group"
    >
      <div className="p-3 mb-4 rounded-lg bg-primary/10 w-fit group-hover:bg-primary/20 transition-colors duration-300">
        {icon}
      </div>
      
      <h3 className="text-xl font-semibold mb-3 text-white group-hover:text-primary transition-colors duration-300">
        {title}
      </h3>
      
      <p className="text-gray-400 text-base">
        {description}
      </p>
    </motion.div>
  );
};

export default function TopicsSection() {
  const topics = [
    {
      icon: <BrainCircuit className="h-6 w-6 text-primary" />,
      title: "Large Language Models",
      description: "Dive into how GPT-4, Claude, and other LLMs work, their capabilities, limitations, and practical applications.",
      delay: 1
    },
    {
      icon: <ImageIcon className="h-6 w-6 text-primary" />,
      title: "Image Generation",
      description: "Explore techniques for creating stunning visuals with Midjourney, DALL-E, and Stable Diffusion models.",
      delay: 2
    },
    {
      icon: <MessageSquare className="h-6 w-6 text-primary" />,
      title: "Conversational AI",
      description: "Learn how to build effective chatbots and virtual assistants for customer service, education and more.",
      delay: 3
    },
    {
      icon: <FileText className="h-6 w-6 text-primary" />,
      title: "Content Creation",
      description: "Discover workflows and best practices for generating high-quality articles, marketing copy, and creative writing.",
      delay: 4
    },
    {
      icon: <Code className="h-6 w-6 text-primary" />,
      title: "AI-Assisted Coding",
      description: "Supercharge your development process with AI pair programming tools like GitHub Copilot and CodeWhisperer.",
      delay: 5
    },
    {
      icon: <Lightbulb className="h-6 w-6 text-primary" />,
      title: "Prompt Engineering",
      description: "Master the art of crafting effective prompts that yield consistent, high-quality outputs across AI models.",
      delay: 6
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
            <span className="text-xs font-medium text-primary">Explore AI Topics</span>
          </div>
          
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
            Learn About <span className="text-primary">Generative AI</span> Technologies
          </h2>
          
          <p className="text-gray-400 text-lg">
            Comprehensive resources and expert guides on the most popular generative AI models, techniques, and applications.
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {topics.map((topic, index) => (
            <TopicCard
              key={index}
              icon={topic.icon}
              title={topic.title}
              description={topic.description}
              delay={topic.delay}
            />
          ))}
        </div>
      </div>
    </section>
  );
}