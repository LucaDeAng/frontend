import { motion } from 'framer-motion';
import Container from '@/components/layout/Container';
import { Rocket, GitBranch, Users, Zap, Calendar, Target } from 'lucide-react';

export default function BuildInPublic() {
  const updates = [
    {
      date: "May 2025",
      title: "AI Hub Launch",
      description: "Launched the AI Hub with modern React frontend, enhanced prompt library with voting and commenting features, and professional branding.",
      status: "completed",
      icon: <Rocket className="w-5 h-5" />
    },
    {
      date: "Coming Soon",
      title: "AI Article Generator",
      description: "Building an AI-powered article generation tool that helps create educational content about emerging AI technologies.",
      status: "in-progress",
      icon: <GitBranch className="w-5 h-5" />
    },
    {
      date: "Planned",
      title: "Community Features",
      description: "Adding user profiles, article bookmarking, and discussion threads to build an engaged AI learning community.",
      status: "planned",
      icon: <Users className="w-5 h-5" />
    }
  ];

  const currentProjects = [
    {
      name: "Interactive AI Playground",
      description: "Expanding the prompt library with live AI model testing capabilities",
      progress: 75,
      tech: "React, OpenAI API, TypeScript"
    },
    {
      name: "Educational Content Pipeline",
      description: "Automated system for creating and publishing AI educational materials",
      progress: 30,
      tech: "Node.js, Markdown, AI Content Generation"
    },
    {
      name: "Performance Optimization",
      description: "Improving site speed and user experience across all devices",
      progress: 90,
      tech: "Vite, Lighthouse, Web Vitals"
    }
  ];

  return (
    <div className="py-20 bg-black min-h-screen">
      <Container>
        <motion.article 
          className="max-w-4xl mx-auto p-8 bg-zinc-900 text-white rounded-lg shadow-lg"
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
            Build in Public
          </motion.h1>
          
          <motion.div 
            className="space-y-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            {/* Introduction */}
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
                <Zap className="w-10 h-10 text-white" />
              </div>
              <p className="text-gray-300 leading-relaxed text-lg max-w-2xl mx-auto">
                Welcome to my build-in-public journey! Here I share live updates, experiments, and lessons learned 
                as I develop this AI Hub. Transparency and community feedback drive continuous improvement.
              </p>
            </div>

            {/* Development Timeline */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                <Calendar className="w-6 h-6 mr-3 text-primary" />
                Development Timeline
              </h2>
              
              <div className="space-y-6">
                {updates.map((update, index) => (
                  <motion.div
                    key={index}
                    className={`p-6 rounded-xl border ${
                      update.status === 'completed' ? 'bg-green-900/20 border-green-500/30' :
                      update.status === 'in-progress' ? 'bg-blue-900/20 border-blue-500/30' :
                      'bg-gray-900/20 border-gray-500/30'
                    }`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <div className="flex items-start space-x-4">
                      <div className={`p-2 rounded-lg ${
                        update.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                        update.status === 'in-progress' ? 'bg-blue-500/20 text-blue-400' :
                        'bg-gray-500/20 text-gray-400'
                      }`}>
                        {update.icon}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-lg font-bold text-white">{update.title}</h3>
                          <span className="text-sm text-gray-400">{update.date}</span>
                        </div>
                        <p className="text-gray-300">{update.description}</p>
                        <div className="mt-2">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            update.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                            update.status === 'in-progress' ? 'bg-blue-500/20 text-blue-400' :
                            'bg-gray-500/20 text-gray-400'
                          }`}>
                            {update.status.replace('-', ' ')}
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </section>

            {/* Current Projects */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                <Target className="w-6 h-6 mr-3 text-primary" />
                Current Projects
              </h2>
              
              <div className="grid gap-6">
                {currentProjects.map((project, index) => (
                  <motion.div
                    key={index}
                    className="p-6 bg-black/30 border border-primary/20 rounded-xl"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-bold text-white mb-2">{project.name}</h3>
                        <p className="text-gray-300 mb-3">{project.description}</p>
                        <p className="text-sm text-gray-400 font-mono">{project.tech}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-primary">{project.progress}%</div>
                        <div className="text-sm text-gray-400">complete</div>
                      </div>
                    </div>
                    
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <motion.div 
                        className="bg-gradient-to-r from-primary to-secondary h-2 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${project.progress}%` }}
                        transition={{ duration: 1, delay: 0.5 + index * 0.2 }}
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            </section>

            {/* Lessons Learned */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-6">Key Lessons Learned</h2>
              
              <div className="prose prose-invert max-w-none">
                <div className="bg-black/30 border border-primary/20 rounded-xl p-6 space-y-4">
                  <div>
                    <h3 className="text-white font-bold">User-Centered Design</h3>
                    <p className="text-gray-300">
                      Building features based on actual user needs rather than assumptions leads to better engagement 
                      and more valuable products.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-white font-bold">Iterative Development</h3>
                    <p className="text-gray-300">
                      Small, frequent updates with user feedback loops are more effective than large, infrequent releases.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-white font-bold">Performance Matters</h3>
                    <p className="text-gray-300">
                      Optimizing for speed and accessibility from the start saves significant refactoring time later.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Call to Action */}
            <div className="text-center p-6 bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20 rounded-2xl">
              <h3 className="text-xl font-bold text-white mb-3">Join the Journey</h3>
              <p className="text-gray-300 mb-4">
                Follow along as I continue building and improving this AI Hub. Your feedback and suggestions 
                help shape the future of this platform.
              </p>
              <a 
                href="mailto:lucadeang@hotmail.it"
                className="inline-flex items-center px-6 py-3 bg-primary hover:bg-primary/80 text-white font-medium rounded-lg transition-colors"
              >
                Share Your Ideas
              </a>
            </div>
          </motion.div>
        </motion.article>
      </Container>
    </div>
  );
}