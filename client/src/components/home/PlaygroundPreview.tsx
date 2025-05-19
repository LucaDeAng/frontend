import { useState } from 'react';
import { Link } from 'wouter';
import Container from '@/components/layout/Container';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { motion } from 'framer-motion';
import { BrainCircuit, Copy, ChevronRight, Check, Sparkles, RefreshCw } from 'lucide-react';

export default function PlaygroundPreview() {
  const [prompt, setPrompt] = useState("Scrivi un'introduzione breve sul ruolo dell'intelligenza artificiale nel futuro del lavoro.");
  const [result, setResult] = useState("L'intelligenza artificiale sta rapidamente trasformando il panorama lavorativo globale. Da un lato, automatizza compiti ripetitivi e standardizzati, liberando tempo per attività creative e strategiche. Dall'altro, crea nuove professioni legate alla gestione, sviluppo e supervisione di sistemi AI. Nel prossimo decennio, assisteremo a una profonda riconfigurazione del mercato del lavoro, con competenze come il pensiero critico, la creatività e l'intelligenza emotiva che diventeranno ancora più preziose. La sfida sarà garantire che questa transizione avvenga in modo inclusivo, offrendo opportunità di riqualificazione e formazione continua per tutti i lavoratori.");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [generationTime, setGenerationTime] = useState("2.3s");

  const handleRegenerate = () => {
    setIsGenerating(true);
    // Simulate API call
    setTimeout(() => {
      setIsGenerating(false);
      // Update with new generation time
      setGenerationTime((Math.random() * 2 + 1.5).toFixed(1) + "s");
    }, 1500);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(result);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <section className="relative py-24 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-t from-background via-secondary/10 to-background"></div>
        <motion.div 
          className="absolute top-1/4 right-0 w-96 h-96 rounded-full bg-primary/10 dark:bg-primary/5 blur-3xl opacity-70"
          animate={{ 
            x: [50, 0, 50], 
            y: [0, 50, 0], 
            scale: [1, 1.05, 1] 
          }}
          transition={{ 
            duration: 15, 
            repeat: Infinity,
            repeatType: "reverse" 
          }}
        />
        <motion.div 
          className="absolute bottom-1/4 left-0 w-80 h-80 rounded-full bg-accent/10 dark:bg-accent/5 blur-3xl opacity-70"
          animate={{ 
            x: [0, 50, 0], 
            y: [50, 0, 50], 
            scale: [1, 1.05, 1] 
          }}
          transition={{ 
            duration: 20, 
            repeat: Infinity,
            repeatType: "reverse" 
          }}
        />
      </div>
      
      <Container className="relative z-10 px-6 md:px-12">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
        >
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-accent/10 dark:bg-accent/20 text-accent-foreground text-sm font-medium mb-6">
            <BrainCircuit className="h-4 w-4 mr-2" />
            Prompt Library
          </div>
          <h2 className="mb-6">Prova il nostro AI Playground</h2>
          <p className="max-w-2xl mx-auto">
            Sperimenta con la potenza dell'intelligenza artificiale direttamente nel tuo browser. 
            Genera testi, immagini e molto altro ancora.
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7 }}
          >
            <motion.ul 
              className="mb-8 space-y-4"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
            >
              {[
                "Accesso a modelli AI all'avanguardia",
                "Generazione di testi, traduzioni e riassunti",
                "Personalizzazione dei parametri di generazione",
                "Nessuna installazione richiesta"
              ].map((feature, index) => (
                <motion.li key={index} className="flex items-start" variants={itemVariants}>
                  <div className="rounded-full bg-gradient-to-r from-primary to-accent p-1.5 text-white mr-3 flex-shrink-0 mt-0.5 shadow-sm">
                    <Check className="h-3.5 w-3.5" />
                  </div>
                  <span className="text-foreground">{feature}</span>
                </motion.li>
              ))}
            </motion.ul>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <Button
                asChild
                size="lg"
                className="group rounded-full px-6 text-base font-medium shadow-lg transition-all duration-300 hover:shadow-accent/25 bg-gradient-to-r from-accent to-primary hover:opacity-90"
              >
                <Link href="/playground">
                  Vai al Playground
                  <ChevronRight className="h-5 w-5 ml-2 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </Button>
            </motion.div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-accent/5 rounded-2xl blur-xl opacity-80 dark:opacity-30 scale-105"></div>
            <div className="bg-background/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-primary/10 relative">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-primary mr-2"></div>
                  <div className="w-3 h-3 rounded-full bg-accent mr-2"></div>
                  <div className="w-3 h-3 rounded-full bg-secondary mr-4"></div>
                  <h3 className="text-lg font-semibold text-foreground">AI Playground Demo</h3>
                </div>
                <motion.div 
                  animate={{ rotate: isGenerating ? 360 : 0 }}
                  transition={{ duration: 2, repeat: isGenerating ? Infinity : 0, ease: "linear" }}
                >
                  <Sparkles className="h-5 w-5 text-primary" />
                </motion.div>
              </div>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-foreground mb-2">Prompt</label>
                <Textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="p-4 bg-background/50 text-foreground text-sm font-mono h-28 resize-none border-primary/20 rounded-xl focus:ring-primary/20 focus:border-primary/30 transition-all duration-300"
                />
              </div>
              
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-foreground">Risultato</label>
                  <span className="text-xs text-muted-foreground">Generato in {generationTime}</span>
                </div>
                <div className="p-4 bg-background/50 rounded-xl border border-primary/20 text-foreground text-sm h-48 overflow-y-auto">
                  {isGenerating ? (
                    <div className="flex flex-col justify-center items-center h-full">
                      <div className="animate-spin rounded-full h-10 w-10 border-2 border-primary border-t-transparent mb-4"></div>
                      <p className="text-muted-foreground">Generazione in corso...</p>
                    </div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5 }}
                    >
                      {result}
                    </motion.div>
                  )}
                </div>
              </div>
              
              <div className="flex justify-between">
                <Button 
                  variant="outline" 
                  onClick={handleRegenerate}
                  disabled={isGenerating}
                  className="rounded-full px-4 py-2 border-primary/20 hover:bg-primary/5 transition-all duration-300"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Rigenera
                </Button>
                
                <Button 
                  variant={isCopied ? "default" : "outline"}
                  onClick={handleCopy}
                  className={`rounded-full px-4 py-2 transition-all duration-300 ${
                    isCopied 
                      ? "bg-primary text-primary-foreground" 
                      : "border-primary/20 hover:bg-primary/5"
                  }`}
                >
                  {isCopied ? (
                    <>
                      <Check className="h-4 w-4 mr-2" />
                      Copiato
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4 mr-2" />
                      Copia
                    </>
                  )}
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
