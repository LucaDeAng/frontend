import { useState } from 'react';
import { Link } from 'wouter';
import Container from '@/components/layout/Container';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { RefreshCw, Copy, ChevronRight, Check } from 'lucide-react';

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

  return (
    <section className="py-16 bg-gray-50 dark:bg-gray-800 relative overflow-hidden">
      <div className="absolute inset-0 z-0 bg-gradient-to-br from-accent-50/30 to-white/0 dark:from-accent-900/20 dark:to-gray-800/0"></div>
      
      <Container className="relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Prova il nostro AI Playground</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-6">
              Sperimenta con la potenza dell'intelligenza artificiale direttamente nel tuo browser. Genera testi, immagini e molto altro ancora.
            </p>
            
            <ul className="mb-8 space-y-3">
              {[
                "Accesso a modelli AI all'avanguardia",
                "Generazione di testi, traduzioni e riassunti",
                "Personalizzazione dei parametri di generazione",
                "Nessuna installazione richiesta"
              ].map((feature, index) => (
                <li key={index} className="flex items-start">
                  <div className="rounded-full bg-accent-500 p-1 text-white mr-2 flex-shrink-0 mt-0.5">
                    <Check className="h-4 w-4" />
                  </div>
                  <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                </li>
              ))}
            </ul>
            
            <Button
              asChild
              className="inline-flex justify-center items-center px-6 py-3 bg-accent-600 hover:bg-accent-700 text-white"
            >
              <Link href="/playground">
                Vai al Playground
                <ChevronRight className="h-5 w-5 ml-2" />
              </Link>
            </Button>
          </div>
          
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-xl p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Playground Demo</h3>
              <div className="flex space-x-1">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Prompt</label>
              <Textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="p-3 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-200 text-sm font-mono h-24"
              />
            </div>
            
            <div className="mb-4">
              <div className="flex justify-between items-center mb-1">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Risultato</label>
                <span className="text-xs text-gray-500 dark:text-gray-400">Generato in {generationTime}</span>
              </div>
              <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-md border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200 text-sm h-40 overflow-y-auto">
                {isGenerating ? (
                  <div className="flex justify-center items-center h-full">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                  </div>
                ) : (
                  result
                )}
              </div>
            </div>
            
            <div className="flex justify-between">
              <Button 
                variant="outline" 
                onClick={handleRegenerate}
                disabled={isGenerating}
                className="inline-flex justify-center items-center px-4 py-2"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Rigenera
              </Button>
              
              <Button 
                variant="outline" 
                onClick={handleCopy}
                className="inline-flex justify-center items-center px-4 py-2"
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
        </div>
      </Container>
    </section>
  );
}
