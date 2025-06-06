import { motion } from 'framer-motion';
import Container from '@/components/layout/Container';
import { Rocket, GitBranch, Users, Zap, Calendar, Target, CheckCircle2, Clock, AlertCircle, Brain, Heart, Bolt, Trophy, ArrowRight, Play } from 'lucide-react';
import { Link } from 'wouter';

export default function BuildInPublic() {
  console.log('BuildInPublic: Componente caricato correttamente');
  
  const updates = [
    {
      date: "May 2025",
      title: "AI Hub Launch",
      description: "Launched the AI Hub with modern React frontend, enhanced prompt library with voting and commenting features, and professional branding.",
      status: "completed",
      icon: <Rocket className="w-5 h-5" />,
      outcome: "Proof-of-concept for 'AI-as-a-service' platform; 1 000+ beta sign-ups in first month"
    },
    {
      date: "Coming Soon",
      title: "Silver Age App",
      description: "Developing a comprehensive mobile application to support the needs of the elderly, featuring AI-powered health monitoring, social connection tools, and daily assistance features.",
      status: "in-progress",
      icon: <Heart className="w-5 h-5" />,
      outcome: "Expected to improve quality of life for elderly users and reduce healthcare costs by 30%"
    },
    {
      date: "Planned",
      title: "Community Features",
      description: "Adding user profiles, article bookmarking, and discussion threads to build an engaged AI learning community.",
      status: "planned",
      icon: <Users className="w-5 h-5" />,
      outcome: "Engagement metrics (DAU/MAU) target: 25% lift"
    }
  ];

  const currentProjects = [
    {
      name: "Interactive AI Playground",
      description: "Expanding the prompt library with live AI model testing capabilities",
      progress: 75,
      tech: "React, OpenAI API, TypeScript",
      goal: "Let prospects 'test-drive' models before signing an SOW"
    },
    {
      name: "Silver Age App Development",
      description: "Building a comprehensive mobile platform for elderly care and support",
      progress: 30,
      tech: "React Native, TensorFlow, Health APIs",
      goal: "Create an accessible and intuitive platform for elderly users"
    },
    {
      name: "Gen AI Consulting Services",
      description: "Developing frameworks and methodologies for enterprise AI implementation",
      progress: 45,
      tech: "Custom AI Solutions, Enterprise Architecture",
      goal: "Help businesses effectively integrate and leverage AI technologies"
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      case 'in-progress':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'planned':
        return <AlertCircle className="w-5 h-5 text-blue-500" />;
      default:
        return null;
    }
  };

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
            className="text-4xl md:text-5xl font-bold text-white mb-8 text-center bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Turning Digital Experiments into Business Value
          </motion.h1>
          
          <motion.div 
            className="space-y-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            {/* Introduction */}
            <div className="text-center">
              <motion.div 
                className="w-24 h-24 mx-auto mb-8 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Zap className="w-12 h-12 text-white" />
              </motion.div>
              <p className="text-gray-300 leading-relaxed text-lg max-w-2xl mx-auto">
                Welcome to the transparent side of my work. Here I post real-time updates, prototypes, and take-aways from building this AI Hub—so clients, peers, and curious onlookers can see exactly how strategy becomes shipped software (and sometimes learn from my mis-steps!).
              </p>
            </div>

            {/* Bolt Hackathon Section */}
            <motion.div
              className="relative bg-gradient-to-br from-purple-900/20 to-blue-900/20 p-8 rounded-2xl border border-purple-500/30"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <div className="absolute top-4 right-4">
                <div className="flex items-center gap-2 bg-purple-600/20 px-3 py-1 rounded-full border border-purple-400/30">
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                  <span className="text-purple-300 text-sm font-medium">LIVE</span>
                </div>
              </div>
              
              <div className="flex items-center gap-4 mb-6">
                <motion.div 
                  className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Bolt className="w-8 h-8 text-white" />
                </motion.div>
                <div>
                  <h2 className="text-3xl font-bold text-white mb-2 flex items-center gap-2">
                    Bolt Hackathon 2025
                    <Trophy className="w-6 h-6 text-yellow-500" />
                  </h2>
                  <p className="text-purple-300">30 giorni di sviluppo in pubblico</p>
                </div>
              </div>

              <p className="text-gray-300 mb-6 text-lg leading-relaxed">
                Sto partecipando al <a href="https://hackathon.dev/" target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:text-purple-300 underline">Bolt Hackathon</a> con l'obiettivo di costruire e migliorare AI Hub in 30 giorni. 
                Ogni giorno condivido progressi, sfide e apprendimenti in tempo reale.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-black/20 p-4 rounded-lg border border-purple-500/20">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="w-5 h-5 text-purple-400" />
                    <span className="text-purple-300 font-semibold">Durata</span>
                  </div>
                  <p className="text-white">30 giorni consecutivi</p>
                  <p className="text-gray-400 text-sm">Gennaio 2025</p>
                </div>
                
                <div className="bg-black/20 p-4 rounded-lg border border-blue-500/20">
                  <div className="flex items-center gap-2 mb-2">
                    <Target className="w-5 h-5 text-blue-400" />
                    <span className="text-blue-300 font-semibold">Obiettivo</span>
                  </div>
                  <p className="text-white">AI Hub v2.0</p>
                  <p className="text-gray-400 text-sm">Platform completa</p>
                </div>
                
                <div className="bg-black/20 p-4 rounded-lg border border-green-500/20">
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="w-5 h-5 text-green-400" />
                    <span className="text-green-300 font-semibold">Community</span>
                  </div>
                  <p className="text-white">Open Source</p>
                  <p className="text-gray-400 text-sm">Tutto pubblico</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-4">
                <Link href="/bolt-hackathon">
                  <motion.button
                    className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition-all duration-200"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Play className="w-4 h-4" />
                    Segui il Journey
                    <ArrowRight className="w-4 h-4" />
                  </motion.button>
                </Link>
                
                <a 
                  href="https://hackathon.dev/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-zinc-800 hover:bg-zinc-700 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition-all duration-200 border border-zinc-600"
                >
                  <Bolt className="w-4 h-4" />
                  Bolt Official
                </a>
              </div>
            </motion.div>

            {/* Development Timeline */}
            <div>
              <h2 className="text-2xl font-bold text-white mb-8 flex items-center">
                <Calendar className="w-6 h-6 mr-2 text-primary" />
                Development Timeline
              </h2>
              <div className="space-y-6">
                {updates.map((update, index) => (
                  <motion.div
                    key={index}
                    className="relative pl-8 border-l-2 border-primary/20"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-primary" />
                    <div className="bg-zinc-800/50 p-6 rounded-lg hover:bg-zinc-800/70 transition-colors">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          {update.icon}
                          <h3 className="text-xl font-semibold text-white">{update.title}</h3>
                        </div>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(update.status)}
                          <span className="text-sm text-gray-400">{update.date}</span>
                        </div>
                      </div>
                      <p className="text-gray-300 mb-4">{update.description}</p>
                      <div className="bg-black/30 p-3 rounded-md">
                        <p className="text-sm text-gray-400">
                          <span className="text-primary font-medium">Business Outcome:</span> {update.outcome}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Current Projects */}
            <div>
              <h2 className="text-2xl font-bold text-white mb-8 flex items-center">
                <Target className="w-6 h-6 mr-2 text-primary" />
                Current Projects
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {currentProjects.map((project, index) => (
                  <motion.div
                    key={index}
                    className="bg-zinc-800/50 rounded-lg p-6 hover:bg-zinc-800/70 transition-colors"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    whileHover={{ y: -5 }}
                  >
                    <h3 className="text-xl font-semibold text-white mb-3">{project.name}</h3>
                    <p className="text-gray-300 text-sm mb-4">{project.description}</p>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-400">Progress</span>
                          <span className="text-primary">{project.progress}%</span>
                        </div>
                        <div className="h-2 bg-zinc-700 rounded-full overflow-hidden">
                          <motion.div
                            className="h-full bg-gradient-to-r from-primary to-secondary"
                            initial={{ width: 0 }}
                            animate={{ width: `${project.progress}%` }}
                            transition={{ duration: 1, delay: index * 0.2 }}
                          />
                        </div>
                      </div>
                      <div className="text-sm">
                        <p className="text-gray-400 mb-1">Tech Stack</p>
                        <p className="text-gray-300">{project.tech}</p>
                      </div>
                      <div className="text-sm">
                        <p className="text-gray-400 mb-1">Goal</p>
                        <p className="text-gray-300">{project.goal}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Key Lessons */}
            <div>
              <h2 className="text-2xl font-bold text-white mb-8 flex items-center">
                <Zap className="w-6 h-6 mr-2 text-primary" />
                Key Lessons (So Far)
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  "Start with the KPI, not the feature – Every sprint begins by defining the business metric a release must move.",
                  "Ship → Measure → Iterate – Weekly drops paired with analytics reviews surface quick wins (and quick reversals).",
                  "Performance is product-market fit – Fast, accessible experiences convert better and keep support costs low.",
                  "Community = Continuous Discovery – Public road-mapping turns users into co-designers and reduces requirement risk."
                ].map((lesson, index) => (
                  <motion.div
                    key={index}
                    className="bg-zinc-800/50 p-6 rounded-lg hover:bg-zinc-800/70 transition-colors"
                    initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <p className="text-gray-300">{lesson}</p>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Closing */}
            <motion.div 
              className="text-center mt-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                Follow along as I keep testing, shipping, and refining—always in the open, always tied to measurable impact.
              </p>
            </motion.div>
          </motion.div>
        </motion.article>
      </Container>
    </div>
  );
}