import { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { useToast } from '@/hooks/use-toast';
import { Copy, Bot, CheckCircle, Send, Sparkles, Settings, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { PlaygroundRequest, PlaygroundResponse } from '@shared/types';

export default function AiPlayground() {
  const { toast } = useToast();
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [copyToGptReady, setCopyToGptReady] = useState(false);
  
  // Settings
  const [settings, setSettings] = useState({
    model: 'gpt-4o',
    temperature: 0.7,
    maxTokens: 1000
  });
  
  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast({
        title: "Empty Prompt",
        description: "Please enter a prompt to generate content.",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    setResponse(null);
    setCopyToGptReady(false);
    
    try {
      // For now, simulate API call
      await new Promise(r => setTimeout(r, 1500));
      
      // Mock response
      const mockResponse = `Based on your prompt: "${prompt.substring(0, 30)}${prompt.length > 30 ? '...' : ''}"

This is a simulated AI response that demonstrates what the feature would look like with a real AI model.

When connected to OpenAI's GPT-4o, this playground will:
- Generate high-quality responses based on your prompts
- Allow you to experiment with different parameters
- Let you refine your prompts for better results
- Provide a "Copy to GPT" feature for use in other applications

The actual implementation would require an OpenAI API key to be configured.`;

      setResponse(mockResponse);
      setCopyToGptReady(true);
    } catch (error) {
      toast({
        title: "Generation Failed",
        description: "There was an error generating content. Please try again.",
        variant: "destructive"
      });
      console.error('Error generating content:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleCopy = () => {
    if (!response) return;
    
    navigator.clipboard.writeText(response);
    setCopied(true);
    
    toast({
      title: "Copied to clipboard",
      description: "The generated content has been copied to your clipboard.",
    });
    
    setTimeout(() => setCopied(false), 2000);
  };
  
  const handleCopyToGpt = () => {
    if (!prompt) return;
    
    // Construct the full URL with the prompt as a parameter
    const gptUrl = `https://chat.openai.com/?prompt=${encodeURIComponent(prompt)}`;
    
    // Open the URL in a new tab
    window.open(gptUrl, '_blank');
    
    toast({
      title: "Opening in ChatGPT",
      description: "Your prompt is being opened in ChatGPT.",
    });
  };
  
  const updateSettings = (key: keyof typeof settings, value: any) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };
  
  return (
    <div className="w-full bg-black/30 border border-white/10 rounded-lg p-6">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center">
            <Bot className="h-5 w-5 text-primary mr-2" />
            <h2 className="text-xl font-bold text-white">AI Playground</h2>
          </div>
          
          <Button 
            variant="outline" 
            size="sm"
            className="border-white/10 text-white hover:bg-white/5"
            onClick={() => setShowSettings(!showSettings)}
          >
            <Settings className="h-4 w-4 mr-2" />
            <span>Settings</span>
          </Button>
        </div>
        
        <AnimatePresence>
          {showSettings && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="bg-black/40 rounded-lg p-4 border border-white/10 mb-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <Label className="text-white mb-2 block">Model</Label>
                    <select 
                      className="w-full bg-black/40 border border-white/10 rounded-md py-2 px-3 text-white"
                      value={settings.model}
                      onChange={(e) => updateSettings('model', e.target.value)}
                    >
                      <option value="gpt-4o">GPT-4o (Latest & Most Capable)</option>
                      <option value="gpt-4">GPT-4</option>
                      <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
                    </select>
                  </div>
                  
                  <div>
                    <Label className="text-white mb-2 block">Temperature: {settings.temperature.toFixed(1)}</Label>
                    <Slider 
                      value={[settings.temperature]}
                      min={0}
                      max={2}
                      step={0.1}
                      onValueChange={(value) => updateSettings('temperature', value[0])}
                      className="py-2"
                    />
                    <div className="flex justify-between text-xs text-gray-400 mt-1">
                      <span>Precise</span>
                      <span>Balanced</span>
                      <span>Creative</span>
                    </div>
                  </div>
                  
                  <div>
                    <Label className="text-white mb-2 block">Max Tokens: {settings.maxTokens}</Label>
                    <Slider 
                      value={[settings.maxTokens]}
                      min={100}
                      max={4000}
                      step={100}
                      onValueChange={(value) => updateSettings('maxTokens', value[0])}
                      className="py-2"
                    />
                    <div className="flex justify-between text-xs text-gray-400 mt-1">
                      <span>Short</span>
                      <span>Medium</span>
                      <span>Long</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        <div className="mb-4">
          <Label htmlFor="prompt" className="text-white block mb-2">Your Prompt</Label>
          <div className="relative">
            <Textarea
              id="prompt"
              placeholder="Enter your prompt here... (e.g., 'Write a 5-step guide for prompt engineering beginners')"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="min-h-[120px] bg-black/40 border border-white/10 text-white font-mono text-sm"
            />
            
            <Button
              className="absolute bottom-2 right-2 bg-primary/80 hover:bg-primary text-black"
              size="sm"
              onClick={handleCopyToGpt}
              disabled={!prompt.trim()}
            >
              <Sparkles className="h-3.5 w-3.5 mr-1.5" />
              <span>Open in ChatGPT</span>
            </Button>
          </div>
        </div>
        
        <div className="flex justify-end">
          <Button
            onClick={handleGenerate}
            disabled={isLoading || !prompt.trim()}
            className="bg-primary hover:bg-primary/90 text-black"
          >
            {isLoading ? (
              <>
                <div className="spinner h-4 w-4 mr-2"></div>
                <span>Generating...</span>
              </>
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                <span>Generate</span>
              </>
            )}
          </Button>
        </div>
      </div>
      
      {response && (
        <div className="rounded-lg overflow-hidden">
          <div className="bg-gradient-to-r from-primary/20 to-secondary/20 border-b border-white/10 py-2 px-4 flex justify-between items-center">
            <div className="flex items-center">
              <Bot className="h-4 w-4 text-white mr-2" />
              <span className="text-sm font-medium text-white">AI Response</span>
            </div>
            
            <Button
              variant="outline"
              size="sm"
              className="h-8 border-white/10 text-white hover:bg-white/10"
              onClick={handleCopy}
            >
              {copied ? (
                <>
                  <CheckCircle className="h-3.5 w-3.5 mr-1.5 text-green-500" />
                  <span>Copied</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5 mr-1.5" />
                  <span>Copy</span>
                </>
              )}
            </Button>
          </div>
          
          <div className="bg-black/40 p-4 border border-white/10 border-t-0 rounded-b-lg">
            <div className="whitespace-pre-wrap font-mono text-sm text-white">
              {response.split('\n').map((line, i) => (
                <p key={i} className={i === 0 ? 'font-bold text-primary' : ''}>
                  {line}
                </p>
              ))}
            </div>
          </div>
        </div>
      )}
      
      <div className="mt-6 border-t border-white/10 pt-6">
        <div className="text-xs text-gray-500">
          <div className="flex items-center">
            <Sparkles className="h-3.5 w-3.5 mr-1.5 text-primary" />
            <span>This playground uses simulated responses by default. Connect an OpenAI API key for real responses.</span>
          </div>
        </div>
      </div>
    </div>
  );
}