import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Star,
  History,
  User,
  Settings,
  Bookmark,
  Clock,
  Trash2,
  Edit,
  Share2
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { userPromptService } from '@/services/userPromptService';
import { Prompt } from '@/types/prompt';
import { format } from 'date-fns';

export default function UserPromptDashboard() {
  const [activeTab, setActiveTab] = useState('favorites');
  const [favoritePrompts, setFavoritePrompts] = useState<Prompt[]>([]);
  const [promptHistory, setPromptHistory] = useState<{ prompt: Prompt; usedAt: string; }[]>([]);
  const [createdPrompts, setCreatedPrompts] = useState<Prompt[]>([]);
  const { toast } = useToast();

  // Carica i dati dell'utente
  useEffect(() => {
    const userData = userPromptService.getUserData();
    setFavoritePrompts(userData.favorites);
    setPromptHistory(userData.history);
    setCreatedPrompts(userData.created);
  }, []);

  // Gestisci la rimozione dai preferiti
  const handleRemoveFavorite = (promptId: number) => {
    userPromptService.removeFromFavorites(promptId);
    setFavoritePrompts(prev => prev.filter(p => p.id !== promptId));
    toast({
      title: "Rimosso dai preferiti",
      description: "Il prompt è stato rimosso dai tuoi preferiti"
    });
  };

  // Gestisci la rimozione dalla cronologia
  const handleClearHistory = () => {
    userPromptService.clearHistory();
    setPromptHistory([]);
    toast({
      title: "Cronologia pulita",
      description: "La tua cronologia è stata cancellata"
    });
  };

  // Gestisci la rimozione di un prompt creato
  const handleDeletePrompt = (promptId: number) => {
    userPromptService.removeCreatedPrompt(promptId);
    setCreatedPrompts(prev => prev.filter(p => p.id !== promptId));
    toast({
      title: "Prompt eliminato",
      description: "Il prompt è stato eliminato con successo"
    });
  };

  // Gestisci la condivisione di un prompt
  const handleSharePrompt = (prompt: Prompt) => {
    // TODO: Implementare la logica di condivisione
    toast({
      title: "Funzionalità in arrivo",
      description: "La condivisione dei prompt sarà disponibile presto"
    });
  };

  return (
    <div className="mt-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">Il Tuo Dashboard</h2>
        <div className="flex items-center gap-2">
          <Button className="bg-primary hover:bg-primary/90 text-black">
            <User className="h-4 w-4 mr-2" />
            Profilo
          </Button>
          <Button variant="outline" className="border-white/10">
            <Settings className="h-4 w-4 mr-2" />
            Impostazioni
          </Button>
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="favorites" className="flex items-center gap-2">
            <Star className="h-4 w-4" />
            Preferiti ({favoritePrompts.length})
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center gap-2">
            <History className="h-4 w-4" />
            Cronologia ({promptHistory.length})
          </TabsTrigger>
          <TabsTrigger value="created" className="flex items-center gap-2">
            <Bookmark className="h-4 w-4" />
            I Miei Prompt ({createdPrompts.length})
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="favorites">
          <div className="grid grid-cols-1 gap-6">
            {favoritePrompts.length > 0 ? (
              favoritePrompts.map((prompt) => (
                <motion.div
                  key={prompt.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-black/30 border border-white/10 rounded-xl p-6"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-bold text-white mb-2">{prompt.title}</h3>
                      <p className="text-gray-400 text-sm">{prompt.description}</p>
                    </div>
                    <div className="flex gap-1.5">
                      <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full">
                        {prompt.category}
                      </span>
                      <span className="text-xs px-2 py-1 bg-black/50 text-gray-300 rounded-full">
                        {prompt.model}
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 mt-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveFavorite(prompt.id)}
                      className="text-red-500 hover:text-red-400 hover:bg-red-500/10"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Rimuovi
                    </Button>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="text-center py-16 bg-black/30 border border-white/10 rounded-xl">
                <p className="text-gray-400">Non hai ancora aggiunto prompt ai preferiti.</p>
                <p className="text-gray-500 text-sm mt-2">Esplora la libreria e aggiungi i tuoi prompt preferiti!</p>
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="history">
          <div className="flex justify-end mb-4">
            <Button
              variant="outline"
              size="sm"
              onClick={handleClearHistory}
              className="text-red-500 hover:text-red-400 hover:bg-red-500/10"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Pulisci Cronologia
            </Button>
          </div>
          <div className="grid grid-cols-1 gap-6">
            {promptHistory.length > 0 ? (
              promptHistory.map(({ prompt, usedAt }) => (
                <motion.div
                  key={prompt.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-black/30 border border-white/10 rounded-xl p-6"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-bold text-white mb-2">{prompt.title}</h3>
                      <p className="text-gray-400 text-sm">{prompt.description}</p>
                      <p className="text-gray-500 text-xs mt-2 flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        Utilizzato il {format(new Date(usedAt), 'dd/MM/yyyy HH:mm')}
                      </p>
                    </div>
                    <div className="flex gap-1.5">
                      <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full">
                        {prompt.category}
                      </span>
                      <span className="text-xs px-2 py-1 bg-black/50 text-gray-300 rounded-full">
                        {prompt.model}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="text-center py-16 bg-black/30 border border-white/10 rounded-xl">
                <p className="text-gray-400">La tua cronologia è vuota.</p>
                <p className="text-gray-500 text-sm mt-2">I prompt che utilizzerai appariranno qui.</p>
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="created">
          <div className="grid grid-cols-1 gap-6">
            {createdPrompts.length > 0 ? (
              createdPrompts.map((prompt) => (
                <motion.div
                  key={prompt.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-black/30 border border-white/10 rounded-xl p-6"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-bold text-white mb-2">{prompt.title}</h3>
                      <p className="text-gray-400 text-sm">{prompt.description}</p>
                      <div className="flex items-center gap-4 mt-2">
                        <span className="text-gray-500 text-xs flex items-center gap-1">
                          <Star className="h-3 w-3" />
                          {prompt.votes} voti
                        </span>
                        <span className="text-gray-500 text-xs">
                          Creato il {format(new Date(prompt.dateAdded), 'dd/MM/yyyy')}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-1.5">
                      <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full">
                        {prompt.category}
                      </span>
                      <span className="text-xs px-2 py-1 bg-black/50 text-gray-300 rounded-full">
                        {prompt.model}
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 mt-4">
                    <Button
                      onClick={() => handleSharePrompt(prompt)}
                      className="text-primary hover:text-primary/90 hover:bg-primary/10"
                    >
                      <Share2 className="h-4 w-4 mr-2" />
                      Condividi
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-gray-400 hover:text-white hover:bg-white/10"
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Modifica
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeletePrompt(prompt.id)}
                      className="text-red-500 hover:text-red-400 hover:bg-red-500/10"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Elimina
                    </Button>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="text-center py-16 bg-black/30 border border-white/10 rounded-xl">
                <p className="text-gray-400">Non hai ancora creato nessun prompt.</p>
                <p className="text-gray-500 text-sm mt-2">Crea il tuo primo prompt per iniziare!</p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
} 