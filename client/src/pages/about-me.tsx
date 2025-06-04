import { motion } from 'framer-motion';
import Container from '@/components/layout/Container';
import { Mail, Code, Brain, Lightbulb } from 'lucide-react';
import Typography from '@/components/ui/Typography';

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
              <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center overflow-hidden shadow-lg">
                <img 
                  src="/avatar-luca-cartoon.png" 
                  alt="Luca De Angelis cartoon avatar" 
                  className="w-full h-full object-cover rounded-full" 
                />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Luca De Angelis</h2>
              <p className="text-primary font-mono">Business & Digital Consultant</p>
            </div>

            <Typography>
              <p className="text-gray-300 leading-relaxed text-lg">
                Welcome to my Digital Strategy Hub! I'm Luca De Angelis, a business and digital consultant who partners with organisations to turn emerging technology—especially artificial intelligence—into measurable growth. Drawing on years of experience at the intersection of strategy, operations, and tech innovation, I translate complex concepts into actionable roadmaps that executives and teams can rally behind.
              </p>
              <p className="text-gray-300 leading-relaxed">
                With a proven track record in digital transformation programmes, AI-driven product launches, and change management, my mission is to make advanced technology practical, profitable, and responsible for businesses of any size.
              </p>

              <h3 className="text-white text-xl font-bold mt-8 mb-4 flex items-center">
                <Code className="w-5 h-5 mr-2 text-primary" />
                How I Help
              </h3>
              <ul className="text-gray-300 space-y-2">
                <li>• Shape digital strategy – From market analysis to execution plans, I align technology initiatives with clear business objectives.</li>
                <li>• Bridge business & AI – I demystify machine-learning, data, and automation so leaders can make confident, ROI-focused decisions.</li>
                <li>• Design & deliver solutions – I oversee end-to-end rollout of AI and digital products, ensuring they scale and integrate smoothly with existing processes.</li>
                <li>• Upskill teams – Workshops, coaching, and playbooks that embed a digital-first, data-driven culture across the organisation.</li>
                <li>• Champion responsible innovation – Governance frameworks that balance speed, ethics, and compliance, safeguarding long-term value.</li>
              </ul>

              <p className="text-gray-300 leading-relaxed mt-8">
                Whether you're exploring your first AI pilot or orchestrating a company-wide digital overhaul, I'm here to turn vision into impact—responsibly, efficiently, and with lasting results.
              </p>

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
            </Typography>
          </motion.div>
        </motion.article>
      </Container>
    </div>
  );
}