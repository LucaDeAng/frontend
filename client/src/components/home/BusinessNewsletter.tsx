import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { ArrowRight, CheckCircle, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function BusinessNewsletter() {
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
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) throw new Error('Errore iscrizione');
      setIsSuccess(true);
      toast({
        title: "Iscrizione completata",
        description: "Grazie per esserti iscritto alla newsletter!",
        variant: "default"
      });
      setEmail('');
      setTimeout(() => {
        setIsSuccess(false);
      }, 5000);
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
    <section className="py-20 bg-black">
      <div className="container mx-auto px-6 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto rounded-2xl overflow-hidden border border-white/10 bg-gradient-to-br from-black via-black to-primary/10"
        >
          <div className="p-8 sm:p-12 md:p-16">
            <div className="flex flex-col md:flex-row gap-12 items-center">
              <div className="md:w-1/2">
                <div className="space-y-6">
                  <h2 className="text-3xl md:text-4xl font-bold text-white">
                    Resta aggiornato sulle novità della <span className="text-primary">Generative AI</span>
                  </h2>
                  
                  <p className="text-gray-400">
                    Iscriviti alla newsletter per ricevere aggiornamenti, risorse e approfondimenti sull'AI generativa e le sue applicazioni nel business.
                  </p>
                  
                  <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                    <div className="space-y-2">
                      <Input
                        type="email"
                        placeholder="La tua email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="py-6 bg-white/5 border-white/10 focus:border-primary/30 rounded-lg"
                        disabled={isSubmitting || isSuccess}
                      />
                    </div>
                    
                    <Button
                      type="submit"
                      className="w-full md:w-auto py-6 px-8 rounded-lg bg-primary hover:bg-primary/90 text-black font-medium"
                      disabled={isSubmitting || isSuccess}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          <span>Iscrizione in corso...</span>
                        </>
                      ) : isSuccess ? (
                        <>
                          <CheckCircle className="mr-2 h-4 w-4" />
                          <span>Iscrizione completata</span>
                        </>
                      ) : (
                        <>
                          <span>Iscriviti</span>
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </Button>
                  </form>
                  
                  <p className="text-xs text-gray-500">
                    Iscrivendoti accetti i nostri <a href="#" className="text-primary hover:underline">Termini di servizio</a> e <a href="#" className="text-primary hover:underline">Privacy Policy</a>.
                  </p>
                </div>
              </div>
              
              <div className="md:w-1/2">
                <div className="p-6 rounded-xl bg-white/5 border border-white/10">
                  <h3 className="text-lg font-semibold mb-4 text-white">Cosa riceverai:</h3>
                  
                  <ul className="space-y-3">
                    {[
                      "Aggiornamenti mensili sulle ultime tecnologie Gen AI",
                      "Casi studio e best practice di implementazione",
                      "Guide pratiche e consigli per ottimizzare i processi aziendali",
                      "Inviti esclusivi a webinar e eventi sull'AI",
                      "Accesso anticipato a nuovi contenuti e risorse"
                    ].map((item, i) => (
                      <li key={i} className="flex items-start">
                        <div className="mr-2 mt-1 h-4 w-4 shrink-0 rounded-full bg-primary/20">
                          <div className="h-1.5 w-1.5 translate-x-[5px] translate-y-[5px] rounded-full bg-primary" />
                        </div>
                        <span className="text-gray-300 text-sm">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}