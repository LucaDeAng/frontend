import { motion } from 'framer-motion';
import { Brain, Code, Lightbulb, Users, Award, Target } from 'lucide-react';

export default function AboutSection() {
  return (
    <section className="py-20 bg-gradient-to-b from-black to-gray-900">
      <div className="container mx-auto px-6 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          {/* Header */}
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center px-4 py-2 rounded-full border border-primary/30 mb-6 bg-primary/5"
            >
              <span className="text-sm font-medium text-primary">About the Creator</span>
            </motion.div>
            
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
              Bridging AI Innovation with <span className="text-primary">Real-World Solutions</span>
            </h2>
            
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Passionate about transforming complex AI concepts into accessible, practical solutions that drive meaningful change across industries.
            </p>
          </div>

          {/* Main Content */}
          <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
            {/* Left Column - Photo and Bio */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="relative">
                <div className="w-64 h-64 mx-auto lg:mx-0 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 border border-white/10 flex items-center justify-center mb-6">
                  <div className="w-32 h-32 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
                    <Brain className="h-16 w-16 text-white" />
                  </div>
                </div>
                
                <div className="text-center lg:text-left">
                  <h3 className="text-2xl font-bold text-white mb-4">AI Researcher & Innovation Strategist</h3>
                  <p className="text-gray-300 leading-relaxed">
                    With a deep passion for artificial intelligence and its transformative potential, I specialize in making cutting-edge AI technologies accessible and applicable to real-world challenges. My approach combines technical expertise with strategic thinking to help organizations harness the power of AI responsibly and effectively.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Right Column - Expertise Areas */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="space-y-6"
            >
              {[
                {
                  icon: <Code className="h-6 w-6" />,
                  title: "AI Implementation",
                  description: "Translating AI research into practical business solutions with measurable impact."
                },
                {
                  icon: <Lightbulb className="h-6 w-6" />,
                  title: "Innovation Strategy",
                  description: "Helping organizations identify and capitalize on AI-driven opportunities for growth."
                },
                {
                  icon: <Users className="h-6 w-6" />,
                  title: "Team Development",
                  description: "Building AI-literate teams and fostering cultures of innovation and continuous learning."
                }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.6 + index * 0.1 }}
                  className="flex items-start space-x-4 p-4 rounded-xl bg-black/30 border border-white/10 hover:border-primary/30 transition-colors"
                >
                  <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
                    {item.icon}
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-2">{item.title}</h4>
                    <p className="text-gray-400 text-sm">{item.description}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Achievement Highlights */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="grid md:grid-cols-3 gap-8"
          >
            {[
              {
                icon: <Award className="h-8 w-8" />,
                metric: "50+",
                label: "AI Projects Delivered",
                description: "Successfully implemented across various industries"
              },
              {
                icon: <Target className="h-8 w-8" />,
                metric: "95%",
                label: "Client Success Rate",
                description: "Achieving measurable business outcomes"
              },
              {
                icon: <Users className="h-8 w-8" />,
                metric: "200+",
                label: "Professionals Trained",
                description: "In AI concepts and implementation strategies"
              }
            ].map((stat, index) => (
              <div
                key={index}
                className="text-center p-6 rounded-xl bg-black/20 border border-white/10 hover:border-primary/30 transition-colors"
              >
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary mx-auto mb-4">
                  {stat.icon}
                </div>
                <div className="text-3xl font-bold text-primary mb-2">{stat.metric}</div>
                <div className="text-lg font-semibold text-white mb-2">{stat.label}</div>
                <div className="text-sm text-gray-400">{stat.description}</div>
              </div>
            ))}
          </motion.div>

          {/* Mission Statement */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 1 }}
            className="mt-16 text-center"
          >
            <div className="bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20 rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-white mb-4">My Mission</h3>
              <p className="text-gray-300 text-lg leading-relaxed max-w-3xl mx-auto">
                To democratize AI knowledge and empower individuals and organizations to harness artificial intelligence 
                as a force for positive change, innovation, and sustainable growth in our rapidly evolving digital landscape.
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}