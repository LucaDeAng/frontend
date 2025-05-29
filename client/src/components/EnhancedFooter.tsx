import { Link } from 'wouter';
import { motion } from 'framer-motion';
import { 
  Mail, Github, Twitter, Linkedin, ArrowUp, 
  BookOpen, Bot, Brain, User, Hammer, Home,
  Send, ExternalLink
} from 'lucide-react';
import { useState } from 'react';

export default function EnhancedFooter() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes('@')) return;
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) throw new Error('Errore iscrizione');
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 3000);
    } catch (err) {
      alert('Errore durante l\'iscrizione. Riprova.');
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const siteMap = {
    'Navigation': [
      { title: 'Home', path: '/', icon: <Home className="h-4 w-4" /> },
      { title: 'Articles', path: '/articles', icon: <BookOpen className="h-4 w-4" /> },
      { title: 'Prompts', path: '/playground', icon: <Bot className="h-4 w-4" /> },
      { title: 'About Me', path: '/about', icon: <User className="h-4 w-4" /> },
      { title: 'Build in Public', path: '/build-in-public', icon: <Hammer className="h-4 w-4" /> }
    ],
    'Categories': [
      { title: 'AI Research', path: '/articles?category=research', icon: <Brain className="h-4 w-4" /> },
      { title: 'Machine Learning', path: '/articles?category=ml', icon: <Bot className="h-4 w-4" /> },
      { title: 'Technology', path: '/articles?category=tech', icon: <BookOpen className="h-4 w-4" /> },
      { title: 'Tutorials', path: '/articles?category=tutorials', icon: <BookOpen className="h-4 w-4" /> }
    ],
    'Quick Links': [
      { title: 'Latest Articles', path: '/articles?sort=latest', icon: <BookOpen className="h-4 w-4" /> },
      { title: 'Popular Prompts', path: '/playground?sort=popular', icon: <Bot className="h-4 w-4" /> },
      { title: 'Contact', path: 'mailto:lucadeang@hotmail.it', external: true, icon: <Mail className="h-4 w-4" /> },
      { title: 'Newsletter', path: '#newsletter', icon: <Send className="h-4 w-4" /> }
    ]
  };

  const socialLinks = [
    { 
      name: 'GitHub', 
      icon: <Github className="h-5 w-5" />, 
      url: 'https://github.com',
      hoverColor: 'hover:text-gray-300'
    },
    { 
      name: 'Twitter', 
      icon: <Twitter className="h-5 w-5" />, 
      url: 'https://twitter.com',
      hoverColor: 'hover:text-blue-400'
    },
    { 
      name: 'LinkedIn', 
      icon: <Linkedin className="h-5 w-5" />, 
      url: 'https://linkedin.com',
      hoverColor: 'hover:text-blue-500'
    }
  ];

  return (
    <footer className="bg-black border-t border-primary/20">
      {/* Main Footer Content */}
      <div className="container mx-auto px-6 md:px-12 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h3 className="text-2xl font-bold text-white mb-4 font-mono">
                Luca De Angelis
              </h3>
              <p className="text-gray-400 mb-6 leading-relaxed">
                Democratizing AI knowledge through educational content, 
                cutting-edge research insights, and practical tools for 
                the AI community.
              </p>
              
              {/* Social Links with Animation */}
              <div className="flex space-x-4">
                {socialLinks.map((social, index) => (
                  <motion.a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`p-3 bg-black/50 border border-primary/20 rounded-lg text-gray-400 ${social.hoverColor} transition-all duration-300`}
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 + 0.3 }}
                  >
                    {social.icon}
                  </motion.a>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Site Map Sections */}
          {Object.entries(siteMap).map(([section, links], sectionIndex) => (
            <motion.div
              key={section}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: sectionIndex * 0.1 }}
            >
              <h4 className="text-lg font-bold text-white mb-6 font-mono">
                {section}
              </h4>
              <ul className="space-y-3">
                {links.map((link, linkIndex) => (
                  <motion.li
                    key={link.path}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: linkIndex * 0.05 + sectionIndex * 0.1 }}
                  >
                    {('external' in link && link.external) ? (
                      <a
                        href={link.path}
                        className="flex items-center text-gray-400 hover:text-primary transition-colors duration-200 group"
                      >
                        {link.icon && <span className="mr-2">{link.icon}</span>}
                        <span>{link.title}</span>
                        <ExternalLink className="h-3 w-3 ml-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </a>
                    ) : (
                      <Link href={link.path}>
                        <div className="flex items-center text-gray-400 hover:text-primary transition-colors duration-200">
                          {link.icon && <span className="mr-2">{link.icon}</span>}
                          <span>{link.title}</span>
                        </div>
                      </Link>
                    )}
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Enhanced Newsletter Section */}
        <motion.div
          id="newsletter"
          className="mt-16 pt-12 border-t border-primary/20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="max-w-2xl mx-auto text-center">
            <div className="mb-8">
              <h3 className="text-3xl font-bold text-white mb-4">
                Stay Updated with AI Insights
              </h3>
              <p className="text-gray-400 text-lg">
                Get the latest AI research, tutorials, and industry insights 
                delivered directly to your inbox. No spam, just valuable content.
              </p>
            </div>

            <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <div className="flex-1">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="w-full px-6 py-4 bg-black/50 border border-primary/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-primary transition-colors"
                  required
                />
              </div>
              <motion.button
                type="submit"
                className="px-8 py-4 bg-gradient-to-r from-primary to-secondary text-white font-medium rounded-lg hover:shadow-lg hover:shadow-primary/25 transition-all duration-300 flex items-center justify-center space-x-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Send className="h-4 w-4" />
                <span>Subscribe</span>
              </motion.button>
            </form>

            {subscribed && (
              <motion.div
                className="mt-4 p-4 bg-blue-500/20 border border-blue-500/30 rounded-lg text-blue-400"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
              >
                🎉 Thank you for subscribing! Check your email for confirmation.
              </motion.div>
            )}

            <p className="text-gray-500 text-sm mt-4">
              Join 1,000+ AI enthusiasts who get weekly insights. Unsubscribe anytime.
            </p>
          </div>
        </motion.div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-primary/20 bg-black/50">
        <div className="container mx-auto px-6 md:px-12 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between">
            <motion.p 
              className="text-gray-400 text-sm font-mono"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              © 2025 Luca De Angelis. Built with passion for AI education.
            </motion.p>
            
            <div className="flex items-center space-x-6 mt-4 sm:mt-0">
              <Link href="/privacy">
                <span className="text-gray-400 hover:text-primary text-sm transition-colors">
                  Privacy Policy
                </span>
              </Link>
              <Link href="/terms">
                <span className="text-gray-400 hover:text-primary text-sm transition-colors">
                  Terms of Service
                </span>
              </Link>
              
              {/* Back to Top Button */}
              <motion.button
                onClick={scrollToTop}
                className="p-2 bg-primary/20 border border-primary/30 rounded-lg text-primary hover:bg-primary/30 transition-colors"
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <ArrowUp className="h-4 w-4" />
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}