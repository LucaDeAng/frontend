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
              <span className="text-gradient">Turning AI Vision</span> <span className="text-gradient">into Business Impact</span>
            </h2>
            
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              I partner with organizations to turn emerging technology—especially artificial intelligence—into measurable growth. My approach blends technical expertise with strategic thinking, translating complex AI concepts into actionable roadmaps that drive real-world value.
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
                  <h3 className="text-2xl font-bold text-gradient mb-4">AI Consultant & Digital Strategist</h3>
                  <p className="text-gray-300 leading-relaxed">
                    With a proven track record in digital transformation, AI-driven product launches, and change management, I help businesses make advanced technology practical, profitable, and responsible. Whether you're exploring your first AI pilot or orchestrating a company-wide digital overhaul, I turn vision into impact—responsibly, efficiently, and with lasting results.
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
                  title: "Digital Strategy & Roadmaps",
                  description: "Aligning technology initiatives with business objectives and delivering actionable plans for AI adoption."
                },
                {
                  icon: <Lightbulb className="h-6 w-6" />,
                  title: "Business & AI Bridging",
                  description: "Demystifying machine learning, data, and automation so leaders can make confident, ROI-focused decisions."
                },
                {
                  icon: <Users className="h-6 w-6" />,
                  title: "Team Enablement & Culture",
                  description: "Workshops, coaching, and playbooks to embed a digital-first, data-driven culture across the organisation."
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
                    <h4 className="text-lg font-semibold text-gradient mb-2">{item.title}</h4>
                    <p className="text-gray-400 text-sm">{item.description}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Contact & Mission Statement */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 1 }}
            className="mt-16 space-y-8"
          >
            {/* Contact Information */}
            <div className="text-center">
              <div className="bg-black/30 border border-primary/20 rounded-xl p-6 max-w-md mx-auto">
                <h3 className="text-lg font-bold text-white mb-3">Get In Touch</h3>
                <a 
                  href="mailto:lucadeang@hotmail.it"
                  className="text-primary hover:text-primary/80 transition-colors font-mono text-sm"
                >
                  lucadeang@hotmail.it
                </a>
              </div>
            </div>

            {/* Mission Statement */}
            <div className="text-center">
              <div className="bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20 rounded-2xl p-8">
                <h3 className="text-2xl font-bold text-white mb-4">My Mission</h3>
                <p className="text-gray-300 text-lg leading-relaxed max-w-3xl mx-auto">
                  To make advanced AI accessible, actionable, and responsible for every business—bridging the gap between innovation and impact, and empowering people to thrive in the age of artificial intelligence.
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}