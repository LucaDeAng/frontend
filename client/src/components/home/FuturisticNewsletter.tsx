import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Mail, ArrowRight, Check, Terminal } from 'lucide-react';

export default function FuturisticNewsletter() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const { toast } = useToast();
  
  // Terminal typing state
  const [typingPhase, setTypingPhase] = useState(0);
  const [typedText, setTypedText] = useState('');
  const successMessages = [
    'console.log("Subscription successful!");',
    'Processing email...',
    'Adding to database...',
    'Subscription complete!'
  ];
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      toast({
        title: "Errore",
        description: "Per favore inserisci un indirizzo email valido.",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) throw new Error('Errore iscrizione');
      // Mostra typing effect e successo come prima
      let phase = 0;
      setTypingPhase(phase);
      const typeNextPhase = () => {
        const currentMessage = successMessages[phase];
        let charIndex = 0;
        const typeChar = () => {
          if (charIndex < currentMessage.length) {
            setTypedText(currentMessage.substring(0, charIndex + 1));
            charIndex++;
            setTimeout(typeChar, 30);
          } else {
            setTimeout(() => {
              phase++;
              if (phase < successMessages.length) {
                setTypingPhase(phase);
                typeNextPhase();
              } else {
                setIsSuccess(true);
                toast({
                  title: "Iscrizione completata",
                  description: "Grazie per esserti iscritto alla newsletter!",
                  variant: "default"
                });
                setEmail('');
              }
            }, 500);
          }
        };
        typeChar();
      };
      typeNextPhase();
    } catch (error) {
      toast({
        title: "Errore",
        description: "Si è verificato un errore durante l'iscrizione. Riprova più tardi.",
        variant: "destructive"
      });
    }
    setTimeout(() => {
      setIsSubmitting(false);
      if (isSuccess) {
        setTimeout(() => {
          setIsSuccess(false);
          setTypedText('');
        }, 5000);
      }
    }, 2000);
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    }
  };

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-black to-black/90"></div>
      <div className="absolute inset-0 grid-pattern opacity-5"></div>
      
      {/* Animated background gradient */}
      <motion.div 
        className="absolute -bottom-40 left-1/2 transform -translate-x-1/2 w-[800px] h-[800px] rounded-full bg-primary/5 filter blur-[100px]"
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.1, 0.2, 0.1] 
        }}
        transition={{ 
          duration: 10, 
          repeat: Infinity,
          repeatType: "mirror" 
        }}
      />
      
      <div className="container relative z-10 px-6 md:px-12 mx-auto">
        <div className="max-w-3xl mx-auto">
          <motion.div
            className="glass border border-primary/20 rounded-2xl overflow-hidden shadow-xl backdrop-blur-xl"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7 }}
          >
            <div className="p-8 md:p-12">
              <motion.div variants={itemVariants} className="text-center mb-10">
                <div className="inline-flex items-center justify-center mb-6">
                  <div className="relative">
                    <div className="absolute inset-0 rounded-full bg-primary blur-xl opacity-30 scale-150"></div>
                    <div className="relative flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-primary to-secondary border border-primary/30 shadow-lg">
                      <Mail className="h-8 w-8 text-black" />
                    </div>
                  </div>
                </div>
                
                <h2 className="text-gradient font-mono text-3xl md:text-4xl font-bold tracking-tighter mb-4">
                  Aggiornamenti sull'AI
                </h2>
                
                <p className="text-gray-400 font-mono">
                  Ricevi notifiche su nuovi articoli e sviluppi nel campo dell'AI generativa.
                  <br />Nessuno spam, solo contenuti di qualità.
                </p>
              </motion.div>
              
              {isSubmitting ? (
                <motion.div 
                  className="w-full p-4 rounded-xl terminal border border-primary/30 font-mono text-sm"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="terminal-header">
                    <div className="terminal-dot bg-destructive/70"></div>
                    <div className="terminal-dot bg-warning/70"></div>
                    <div className="terminal-dot bg-primary/70"></div>
                    <span className="text-xs ml-2 text-gray-400">subscription.js</span>
                  </div>
                  
                  <div className="mt-4">
                    <div className="terminal-prompt">
                      {typedText}
                      <span className="terminal-cursor"></span>
                    </div>
                  </div>
                </motion.div>
              ) : isSuccess ? (
                <motion.div 
                  className="flex items-center justify-center space-x-2 p-4 rounded-xl bg-black/30 border border-primary/30 text-primary"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <Check className="h-5 w-5 text-primary" />
                  <span className="font-mono">Iscrizione completata. Grazie!</span>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="relative">
                  <div className="flex flex-col md:flex-row gap-3">
                    <div className="relative flex-1">
                      <motion.div
                        className="absolute inset-0 rounded-xl"
                        animate={{
                          boxShadow: isFocused
                            ? '0 0 0 2px rgba(0, 255, 100, 0.3), 0 0 20px rgba(0, 255, 100, 0.2)'
                            : '0 0 0 1px rgba(255, 255, 255, 0.1), 0 1px 2px rgba(0, 0, 0, 0.2)'
                        }}
                        transition={{ duration: 0.2 }}
                      />
                      
                      <div className="relative">
                        <Terminal className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                        <Input
                          type="email"
                          placeholder="La tua email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          onFocus={() => setIsFocused(true)}
                          onBlur={() => setIsFocused(false)}
                          className="pl-10 py-6 border border-primary/20 bg-black/40 focus:ring-1 focus:ring-primary/20 font-mono text-foreground rounded-xl transition-all duration-300"
                          required
                        />
                      </div>
                    </div>
                    
                    <Button
                      type="submit"
                      className="rounded-xl font-mono bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-black py-6 flex items-center justify-center group"
                    >
                      <span>Iscriviti</span>
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </Button>
                  </div>
                </form>
              )}
              
              <div className="mt-6 text-center">
                <p className="text-xs text-gray-500 font-mono">
                  Iscrivendoti accetti i nostri <a href="#" className="text-primary hover:text-primary-glow transition-colors">Termini del servizio</a> e <a href="#" className="text-primary hover:text-primary-glow transition-colors">Privacy Policy</a>.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}