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
        title: "Error",
        description: "Please enter a valid email address.",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setIsSuccess(true);
      
      toast({
        title: "Subscription successful",
        description: "Thank you for subscribing to our newsletter!",
        variant: "default"
      });
      
      setEmail('');
      
      // Reset success state after a while
      setTimeout(() => {
        setIsSuccess(false);
      }, 5000);
      
    } catch (error) {
      toast({
        title: "Error",
        description: "There was an error processing your subscription. Please try again later.",
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
          <div className="p-8 sm:p-12">
            <div className="flex flex-col md:flex-row gap-12 items-center">
              <div className="md:w-1/2">
                <div className="space-y-6">
                  <h2 className="text-3xl md:text-4xl font-bold text-white">
                    Join Our <span className="text-primary">AI Community</span>
                  </h2>
                  
                  <p className="text-gray-400">
                    Subscribe to receive the latest updates, resources, and insights on generative AI developments and applications.
                  </p>
                  
                  <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                    <div className="space-y-2">
                      <Input
                        type="email"
                        placeholder="Your email"
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
                  </form>
                  
                  <p className="text-xs text-gray-500">
                    By subscribing, you agree to our <a href="#" className="text-primary hover:underline">Terms of Service</a> and <a href="#" className="text-primary hover:underline">Privacy Policy</a>.
                  </p>
                </div>
              </div>
              
              <div className="md:w-1/2">
                <div className="p-6 rounded-xl bg-white/5 border border-white/10">
                  <h3 className="text-lg font-semibold mb-4 text-white">What you'll receive:</h3>
                  
                  <ul className="space-y-3">
                    {[
                      "Monthly updates on the latest generative AI technologies",
                      "Curated collection of best prompts for various models",
                      "Guides and tutorials on effective AI implementation",
                      "Exclusive invitations to webinars and AI events",
                      "Early access to new content and resources"
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