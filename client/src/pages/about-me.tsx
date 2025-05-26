import { motion } from 'framer-motion';
import Container from '@/components/layout/Container';
import { Mail, Code, Brain, Lightbulb } from 'lucide-react';

export default function AboutMe() {
  return (
    <div className="py-20 bg-black min-h-screen">
      <Container>
        <motion.article 
          className="max-w-3xl mx-auto p-8 bg-zinc-900 text-white rounded-lg shadow-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.h1 
            className="text-4xl md:text-5xl font-bold text-white mb-8 text-center"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            About Me
          </motion.h1>
          
          <motion.div 
            className="space-y-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="text-center mb-8">
              <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
                <Brain className="w-16 h-16 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Luca De Angelis</h2>
              <p className="text-primary font-mono">AI Researcher & Content Creator</p>
            </div>

            <div className="prose prose-invert max-w-none">
              <p className="text-gray-300 leading-relaxed text-lg">
                Welcome to my AI Hub! I'm Luca De Angelis, a passionate artificial intelligence researcher and educator 
                dedicated to making cutting-edge AI knowledge accessible to everyone.
              </p>

              <p className="text-gray-300 leading-relaxed">
                With a deep background in machine learning, natural language processing, and AI ethics, I bridge the gap 
                between complex research and practical applications. My mission is to democratize AI education and empower 
                individuals and organizations to harness artificial intelligence responsibly.
              </p>

              <h3 className="text-white text-xl font-bold mt-8 mb-4 flex items-center">
                <Code className="w-5 h-5 mr-2 text-primary" />
                What I Do
              </h3>

              <ul className="text-gray-300 space-y-2">
                <li>• Research and analyze the latest developments in AI and machine learning</li>
                <li>• Create educational content that makes complex AI concepts understandable</li>
                <li>• Develop practical AI tools and prompt libraries for real-world applications</li>
                <li>• Share insights on responsible AI development and deployment</li>
              </ul>

              <h3 className="text-white text-xl font-bold mt-8 mb-4 flex items-center">
                <Lightbulb className="w-5 h-5 mr-2 text-primary" />
                My Expertise
              </h3>

              <ul className="text-gray-300 space-y-2">
                <li>• Large Language Models (LLMs) and conversational AI</li>
                <li>• AI prompt engineering and optimization</li>
                <li>• Machine learning model development and deployment</li>
                <li>• AI ethics and responsible development practices</li>
                <li>• Educational technology and content creation</li>
              </ul>

              <div className="mt-8 p-6 bg-black/30 border border-primary/20 rounded-xl text-center">
                <h3 className="text-white text-lg font-bold mb-3 flex items-center justify-center">
                  <Mail className="w-5 h-5 mr-2 text-primary" />
                  Let's Connect
                </h3>
                <p className="text-gray-300 mb-4">
                  Have questions about AI? Want to collaborate on a project? I'd love to hear from you!
                </p>
                <a 
                  href="mailto:lucadeang@hotmail.it"
                  className="text-primary hover:text-primary/80 transition-colors font-mono text-lg"
                >
                  lucadeang@hotmail.it
                </a>
              </div>
            </div>
          </motion.div>
        </motion.article>
      </Container>
    </div>
  );
}