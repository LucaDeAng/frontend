import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { ArrowRight, CheckCircle, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function CommunityNewsletter() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      toast({
        title: "Errore",
        description: "Inserisci un indirizzo email valido.",
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
      
      if (res.status === 409) {
        // Email già iscritta
        toast({
          title: "Email già iscritta",
          description: "Questa email è già iscritta alla nostra newsletter!",
          variant: "default"
        });
        setEmail('');
        return;
      }
      
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || 'Subscription error');
      }
      
      setIsSuccess(true);
      toast({
        title: "Iscrizione completata!",
        description: "Grazie per esserti iscritto alla nostra newsletter!",
        variant: "default"
      });
      setEmail('');
      setTimeout(() => {
        setIsSuccess(false);
      }, 5000);
    } catch (error) {
      console.error('Newsletter subscription error:', error);
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
    <section className="py-16 bg-black">
      <div className="container mx-auto px-6 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mx-auto rounded-xl overflow-hidden border border-white/10 bg-gradient-to-br from-black to-primary/5"
        >
          <div className="p-8 sm:p-10">
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-bold mb-4 text-white">
                Get <span className="text-primary">AI Updates</span> in Your Inbox
              </h2>
              
              <p className="text-gray-400 max-w-lg mx-auto">
                Subscribe to receive the latest news, articles, and resources on AI technologies, tools, and best practices.
              </p>
            </div>
            
            <form onSubmit={handleSubmit} className="max-w-md mx-auto">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Input
                    type="email"
                    placeholder="Your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="py-6 bg-black/40 border border-white/10 text-white rounded-lg focus:border-primary/30"
                    disabled={isSubmitting || isSuccess}
                  />
                </div>
                
                <Button
                  type="submit"
                  className="py-6 px-6 bg-primary hover:bg-primary/90 text-black font-medium rounded-lg"
                  disabled={isSubmitting || isSuccess}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      <span>Subscribing...</span>
                    </>
                  ) : isSuccess ? (
                    <>
                      <CheckCircle className="mr-2 h-4 w-4" />
                      <span>Subscribed!</span>
                    </>
                  ) : (
                    <>
                      <span>Subscribe</span>
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </div>
              
              <p className="text-xs text-gray-500 text-center mt-4">
                We respect your privacy. Unsubscribe at any time.
              </p>
            </form>
          </div>
        </motion.div>
      </div>
    </section>
  );
}