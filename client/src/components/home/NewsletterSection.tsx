import { useState } from 'react';
import Container from '@/components/layout/Container';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

export default function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
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
    <section className="py-16 bg-white dark:bg-gray-900">
      <Container>
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Resta aggiornato</h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
            Iscriviti alla nostra newsletter per ricevere aggiornamenti, nuovi articoli e risorse esclusive sull'intelligenza artificiale.
          </p>
          
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <Input
              type="email"
              placeholder="La tua email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 px-4 py-3"
              required
            />
            <Button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-3 font-medium"
            >
              {isSubmitting ? 'Iscrizione...' : 'Iscriviti'}
            </Button>
          </form>
          
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
            Non condivideremo mai il tuo indirizzo email. Puoi annullare l'iscrizione in qualsiasi momento.
          </p>
        </div>
      </Container>
    </section>
  );
}
