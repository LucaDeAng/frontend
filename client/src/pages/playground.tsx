import { useState } from 'react';
import Container from '@/components/layout/Container';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { apiRequest } from '@/lib/queryClient';
import { RefreshCw, Copy, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Helmet } from 'react-helmet';

export default function Playground() {
  const [prompt, setPrompt] = useState("");
  const [result, setResult] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [model, setModel] = useState("gpt-3.5");
  const [temperature, setTemperature] = useState([0.7]);
  const [maxTokens, setMaxTokens] = useState([256]);
  const [generationTime, setGenerationTime] = useState<string | null>(null);
  const { toast } = useToast();

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast({
        title: "Errore",
        description: "Inserisci un prompt per generare il contenuto.",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    const startTime = Date.now();

    try {
      // Simulate API call to generate content
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // For a demo, we'll just return a sample response
      const sampleResponse = "L'intelligenza artificiale sta rapidamente trasformando il panorama lavorativo globale. Da un lato, automatizza compiti ripetitivi e standardizzati, liberando tempo per attività creative e strategiche. Dall'altro, crea nuove professioni legate alla gestione, sviluppo e supervisione di sistemi AI. Nel prossimo decennio, assisteremo a una profonda riconfigurazione del mercato del lavoro, con competenze come il pensiero critico, la creatività e l'intelligenza emotiva che diventeranno ancora più preziose. La sfida sarà garantire che questa transizione avvenga in modo inclusivo, offrendo opportunità di riqualificazione e formazione continua per tutti i lavoratori.";
      
      setResult(sampleResponse);
      
      const endTime = Date.now();
      setGenerationTime(`${((endTime - startTime) / 1000).toFixed(1)}s`);
      
      toast({
        title: "Generazione Completata",
        description: "Il contenuto è stato generato con successo!",
      });
    } catch (error) {
      toast({
        title: "Errore",
        description: "Si è verificato un errore durante la generazione del contenuto.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(result);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
    
    toast({
      title: "Copiato",
      description: "Il testo è stato copiato negli appunti.",
    });
  };

  return (
    <>
      <Helmet>
        <title>AI Playground | AI Hub</title>
        <meta name="description" content="Sperimenta con l'intelligenza artificiale in tempo reale. Genera testi, traduzioni e altro ancora con il nostro AI Playground." />
        <meta property="og:title" content="AI Playground | AI Hub" />
        <meta property="og:description" content="Sperimenta con l'intelligenza artificiale in tempo reale. Genera testi, traduzioni e altro ancora con il nostro AI Playground." />
        <meta property="og:type" content="website" />
      </Helmet>
      <section className="py-12 bg-white dark:bg-gray-900">
        <Container>
          <div className="max-w-5xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">AI Playground</h1>
              <p className="text-gray-600 dark:text-gray-300">
                Sperimenta con modelli di intelligenza artificiale direttamente nel browser. Inserisci un prompt e lascia che l'AI generi contenuti per te.
              </p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <Card className="mb-6">
                  <CardHeader>
                    <CardTitle>Input</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Textarea
                      placeholder="Inserisci il tuo prompt qui..."
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      className="min-h-[200px] text-base"
                    />
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Output</CardTitle>
                    {generationTime && (
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        Generato in {generationTime}
                      </span>
                    )}
                  </CardHeader>
                  <CardContent>
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-md border border-gray-200 dark:border-gray-700 p-4 min-h-[200px] mb-4">
                      {isGenerating ? (
                        <div className="flex justify-center items-center h-full">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                        </div>
                      ) : (
                        <div className="text-gray-800 dark:text-gray-200 whitespace-pre-wrap">
                          {result}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="outline"
                        onClick={handleCopy}
                        disabled={!result || isGenerating}
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
                  </CardContent>
                </Card>
              </div>
              
              <div>
                <Card>
                  <CardHeader>
                    <CardTitle>Impostazioni</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Tabs defaultValue="model">
                      <TabsList className="grid grid-cols-2 mb-4">
                        <TabsTrigger value="model">Modello</TabsTrigger>
                        <TabsTrigger value="params">Parametri</TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="model">
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                              Modello
                            </label>
                            <Select value={model} onValueChange={setModel}>
                              <SelectTrigger>
                                <SelectValue placeholder="Seleziona un modello" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="gpt-3.5">GPT-3.5</SelectItem>
                                <SelectItem value="gpt-4">GPT-4</SelectItem>
                                <SelectItem value="llama-2">Llama 2</SelectItem>
                                <SelectItem value="claude-2">Claude 2</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                            Ogni modello ha capacità diverse. GPT-4 è più avanzato ma potrebbe essere più lento.
                          </p>
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="params">
                        <div className="space-y-4">
                          <div>
                            <div className="flex justify-between mb-1">
                              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                Temperatura: {temperature[0]}
                              </label>
                            </div>
                            <Slider
                              value={temperature}
                              min={0}
                              max={1}
                              step={0.1}
                              onValueChange={setTemperature}
                            />
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                              Valori più bassi producono risposte più prevedibili, valori più alti più creative.
                            </p>
                          </div>
                          
                          <div>
                            <div className="flex justify-between mb-1">
                              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                Lunghezza massima: {maxTokens[0]}
                              </label>
                            </div>
                            <Slider
                              value={maxTokens}
                              min={64}
                              max={1024}
                              step={64}
                              onValueChange={setMaxTokens}
                            />
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                              Imposta la lunghezza massima della risposta generata.
                            </p>
                          </div>
                        </div>
                      </TabsContent>
                    </Tabs>
                    
                    <Button
                      className="w-full mt-6"
                      onClick={handleGenerate}
                      disabled={isGenerating || !prompt.trim()}
                    >
                      {isGenerating ? (
                        <>
                          <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                          Generazione...
                        </>
                      ) : (
                        'Genera'
                      )}
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
