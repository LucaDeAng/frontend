import { useState } from 'react';
import Container from '@/components/layout/Container';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';
import { Check, Mail, ArrowRight } from 'lucide-react';

export default function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { toast } = useToast();

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
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Iscrizione Completata",
        description: "Grazie per esserti iscritto alla nostra newsletter!",
        variant: "default"
      });
      
      setIsSuccess(true);
      setTimeout(() => setIsSuccess(false), 5000);
      setEmail('');
    } catch (error) {
      toast({
        title: "Errore",
        description: "Si è verificato un errore durante l'iscrizione. Riprova più tardi.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-t from-background to-secondary/10"></div>
        <motion.div 
          className="absolute inset-0 opacity-30 mix-blend-soft-light" 
          style={{
            backgroundImage: "url('https://grainy-gradients.vercel.app/noise.svg')",
            backgroundSize: "200px",
          }}
        />
        <motion.div 
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-primary/20 dark:bg-primary/10 blur-3xl"
          animate={{ 
            scale: [1, 1.1, 1],
          }}
          transition={{ 
            duration: 15, 
            repeat: Infinity,
            repeatType: "reverse" 
          }}
        />
      </div>
      
      <Container className="relative z-10 px-6 md:px-12">
        <motion.div 
          className="max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
        >
          <div className="bg-background/60 backdrop-blur-md rounded-3xl p-10 border border-primary/10 shadow-xl">
            <div className="text-center">
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6"
              >
                <Mail className="h-8 w-8 text-primary" />
              </motion.div>
              
              <motion.h2 
                className="mb-4"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                Resta aggiornato
              </motion.h2>
              
              <motion.p 
                className="mb-8 max-w-xl mx-auto"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                Iscriviti alla nostra newsletter per ricevere aggiornamenti, nuovi articoli e risorse esclusive sull'intelligenza artificiale.
              </motion.p>
              
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                {isSuccess ? (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex items-center justify-center space-x-2 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 py-4 px-6 rounded-xl border border-green-200 dark:border-green-800"
                  >
                    <Check className="h-5 w-5" />
                    <span>Grazie per l'iscrizione! A presto.</span>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                    <div className="relative flex-1">
                      <Input
                        type="email"
                        placeholder="La tua email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="px-5 py-6 rounded-xl bg-background border-primary/20 focus:border-primary focus:ring-primary/20 transition-all duration-300 pr-10"
                        required
                      />
                      <Mail className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    </div>
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="rounded-xl px-6 py-6 font-medium bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-all duration-300 text-white group"
                    >
                      {isSubmitting ? (
                        <span className="flex items-center">
                          <motion.div 
                            className="h-4 w-4 border-2 border-t-transparent border-primary-foreground rounded-full mr-2" 
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          />
                          Iscrizione...
                        </span>
                      ) : (
                        <span className="flex items-center">
                          Iscriviti
                          <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                        </span>
                      )}
                    </Button>
                  </form>
                )}
              </motion.div>
              
              <motion.p 
                className="text-sm text-muted-foreground mt-6"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                Non condivideremo mai il tuo indirizzo email. Puoi annullare l'iscrizione in qualsiasi momento.
              </motion.p>
            </div>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
