import React, { useState, useEffect, Suspense, lazy } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  CheckCircle, 
  ClipboardCopy, 
  Filter, 
  Search, 
  X, 
  ThumbsUp, 
  MessageSquare, 
  Plus,
  Star,
  Flame,
  SortDesc,
  User
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import UserPromptDashboard from './UserPromptDashboard';
import userPromptService from '@/services/userPromptService';
import { useAuth } from '@/contexts/AuthContext';
import { AuthDialog } from '@/components/auth/AuthDialog';

// Types for our prompt system
interface Comment {
  id: number;
  userName: string;
  text: string;
  date: string;
}

interface Prompt {
  id: number;
  title: string;
  description: string;
  promptText: string;
  category: string;
  model: string;
  votes: number;
  comments: Comment[];
  dateAdded: string;
  outputExample?: string;
  copyCount?: number;
}

// Prompt card component
function PromptCard({ prompt, onVote, onComment }: { 
  prompt: Prompt, 
  onVote: (id: number) => void,
  onComment: (id: number, text: string) => void
}) {
  const [copied, setCopied] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [localCopyCount, setLocalCopyCount] = useState(prompt.copyCount || 0);
  const [isFavorite, setIsFavorite] = useState(false);
  const { toast } = useToast();
  const { isAuthenticated } = useAuth();
  
  // Controlla se il prompt è nei preferiti
  useEffect(() => {
    if (isAuthenticated) {
      const userData = userPromptService.getUserData();
      setIsFavorite(userData.favorites.some(p => p.id === prompt.id));
    }
  }, [prompt.id, isAuthenticated]);
  
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(prompt.promptText);
      setCopied(true);
      setLocalCopyCount(c => c + 1);
      
      if (isAuthenticated) {
        // Aggiungi alla cronologia
        userPromptService.addToHistory(prompt);
      }
      
      toast({
        title: "Copiato negli appunti",
        description: "Il prompt è stato copiato ed è pronto per essere incollato in GPT",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast({
        title: "Errore nella copia",
        description: "Si è verificato un errore durante la copia. Prova di nuovo o copia manualmente",
        variant: "destructive"
      });
    }
  };
  
  const handleAddComment = () => {
    if (!isAuthenticated) {
      toast({
        title: "Accesso richiesto",
        description: "Devi accedere per aggiungere un commento",
        variant: "destructive"
      });
      return;
    }

    if (newComment.trim()) {
      onComment(prompt.id, newComment);
      setNewComment('');
      toast({
        title: "Commento aggiunto",
        description: "Il tuo commento è stato aggiunto al prompt",
      });
    }
  };

  const toggleFavorite = () => {
    if (!isAuthenticated) {
      toast({
        title: "Accesso richiesto",
        description: "Devi accedere per aggiungere ai preferiti",
        variant: "destructive"
      });
      return;
    }

    if (isFavorite) {
      userPromptService.removeFromFavorites(prompt.id);
      toast({
        title: "Rimosso dai preferiti",
        description: "Il prompt è stato rimosso dai tuoi preferiti"
      });
    } else {
      userPromptService.addToFavorites(prompt);
      toast({
        title: "Aggiunto ai preferiti",
        description: "Il prompt è stato aggiunto ai tuoi preferiti"
      });
    }
    setIsFavorite(!isFavorite);
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-black/30 border border-white/10 rounded-xl p-6 hover:border-primary/30 transition-all duration-300"
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-bold text-white mb-2">{prompt.title}</h3>
          <p className="text-gray-400 text-sm">{prompt.description}</p>
        </div>
        
        <div className="flex gap-1.5 flex-wrap">
          <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full">
            {prompt.category}
          </span>
          <span className="text-xs px-2 py-1 bg-black/50 text-gray-300 rounded-full">
            {prompt.model}
          </span>
        </div>
      </div>
      
      <div className="relative mt-4 bg-black/50 border border-white/10 rounded-lg p-4 mb-4">
        <p className="text-gray-300 text-sm whitespace-pre-wrap">{prompt.promptText}</p>
        {prompt.outputExample && (
          <div className="mt-4 p-3 bg-black/30 border-l-4 border-primary rounded">
            <div className="text-xs text-primary font-bold mb-1">Output di esempio</div>
            <pre className="text-gray-200 text-xs whitespace-pre-wrap">{prompt.outputExample}</pre>
          </div>
        )}
      </div>
      
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <Button
          variant="outline"
          size="sm"
          onClick={copyToClipboard}
          className="flex items-center gap-2 bg-black/20 hover:bg-primary/20 hover:text-primary border-white/10"
        >
          {copied ? (
            <>
              <CheckCircle className="h-4 w-4" />
              <span>Copiato!</span>
            </>
          ) : (
            <>
              <ClipboardCopy className="h-4 w-4" />
              <span>Copia in GPT</span>
              <span className="ml-2 px-2 py-0.5 bg-primary/20 text-primary text-xs rounded-full">{localCopyCount}</span>
            </>
          )}
        </Button>
        
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => onVote(prompt.id)}
            className="flex items-center gap-1 text-gray-400 hover:text-blue-500 hover:bg-blue-500/10 p-2 h-8"
          >
            <ThumbsUp className="h-4 w-4" />
            <span className="text-xs font-medium">{prompt.votes}</span>
          </Button>
          
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => setShowComments(!showComments)}
            className="flex items-center gap-1 text-gray-400 hover:text-primary hover:bg-primary/10 p-2 h-8"
          >
            <MessageSquare className="h-4 w-4" />
            <span className="text-xs font-medium">{prompt.comments.length}</span>
          </Button>

          <Button 
            variant="ghost" 
            size="sm"
            onClick={toggleFavorite}
            className={`flex items-center gap-1 p-2 h-8 ${
              isFavorite 
                ? 'text-yellow-500 hover:text-yellow-400 hover:bg-yellow-500/10' 
                : 'text-gray-400 hover:text-yellow-500 hover:bg-yellow-500/10'
            }`}
          >
            <Star className={`h-4 w-4 ${isFavorite ? 'fill-current' : ''}`} />
          </Button>
        </div>
      </div>
      
      {showComments && (
        <div className="mt-4 border-t border-white/10 pt-4">
          <h4 className="text-sm font-medium text-white mb-3">Commenti</h4>
          
          {prompt.comments.length > 0 ? (
            <div className="space-y-3 mb-4">
              {prompt.comments.map((comment) => (
                <div key={comment.id} className="bg-black/40 rounded-lg p-3 text-sm">
                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span>{comment.userName}</span>
                    <span>{comment.date}</span>
                  </div>
                  <p className="text-gray-300">{comment.text}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm mb-4">Nessun commento ancora. Sii il primo a commentare!</p>
          )}
          
          <div className="flex gap-2">
            <Textarea
              placeholder="Aggiungi un commento..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="bg-black/40 border-white/10 text-white text-sm resize-none"
            />
            <Button 
              size="sm" 
              onClick={handleAddComment}
              className="bg-primary hover:bg-primary/90 text-black"
              disabled={!newComment.trim()}
            >
              Aggiungi
            </Button>
          </div>
        </div>
      )}
    </motion.div>
  );
}

// Add prompt dialog
function AddPromptDialog({ onAddPrompt }: { onAddPrompt: (prompt: Omit<Prompt, 'id' | 'votes' | 'comments' | 'dateAdded'>) => void }) {
  const [open, setOpen] = useState(false);
  const [newPrompt, setNewPrompt] = useState({
    title: '',
    description: '',
    promptText: '',
    category: '',
    model: 'GPT-4o',
    outputExample: '',
  });
  const { toast } = useToast();

  const handleSubmit = () => {
    if (!newPrompt.title || !newPrompt.promptText || !newPrompt.category) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }
    onAddPrompt({ ...newPrompt, copyCount: 0 });
    setNewPrompt({
      title: '',
      description: '',
      promptText: '',
      category: '',
      model: 'GPT-4o',
      outputExample: '',
    });
    setOpen(false);
    toast({
      title: "Prompt added",
      description: "Your prompt has been added to the library"
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-primary hover:bg-primary/90 text-black">
          <Plus className="h-4 w-4 mr-2" />
          Add Prompt
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-black/95 border border-white/10 text-white sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Add New Prompt</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-5 py-4">
          <div className="grid gap-2">
            <label htmlFor="title" className="text-sm font-medium">
              Title <span className="text-red-500">*</span>
            </label>
            <Input
              id="title"
              value={newPrompt.title}
              onChange={(e) => setNewPrompt({...newPrompt, title: e.target.value})}
              placeholder="E.g., 'Email Marketing Campaign Generator'"
              className="bg-black/40 border-white/10"
            />
          </div>
          
          <div className="grid gap-2">
            <label htmlFor="description" className="text-sm font-medium">
              Description <span className="text-red-500">*</span>
            </label>
            <Input
              id="description"
              value={newPrompt.description}
              onChange={(e) => setNewPrompt({...newPrompt, description: e.target.value})}
              placeholder="A short description of what this prompt does"
              className="bg-black/40 border-white/10"
            />
          </div>
          
          <div className="grid gap-2">
            <label htmlFor="promptText" className="text-sm font-medium">
              Prompt Text <span className="text-red-500">*</span>
            </label>
            <Textarea
              id="promptText"
              value={newPrompt.promptText}
              onChange={(e) => setNewPrompt({...newPrompt, promptText: e.target.value})}
              placeholder="Enter the full prompt text here..."
              className="bg-black/40 border-white/10 min-h-[150px]"
            />
          </div>
          
          <div className="grid gap-2">
            <label htmlFor="outputExample" className="text-sm font-medium">
              Output di esempio
            </label>
            <Textarea
              id="outputExample"
              value={newPrompt.outputExample}
              onChange={(e) => setNewPrompt({...newPrompt, outputExample: e.target.value})}
              placeholder="Esempio di output generato dal prompt..."
              className="bg-black/40 border-white/10 min-h-[60px]"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <label htmlFor="category" className="text-sm font-medium">
                Category <span className="text-red-500">*</span>
              </label>
              <Select 
                value={newPrompt.category} 
                onValueChange={(value) => setNewPrompt({...newPrompt, category: value})}
              >
                <SelectTrigger className="bg-black/40 border-white/10">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent className="bg-black/95 border-white/10 text-white">
                  <SelectItem value="Business">Business</SelectItem>
                  <SelectItem value="Creative">Creative</SelectItem>
                  <SelectItem value="Academic">Academic</SelectItem>
                  <SelectItem value="Programming">Programming</SelectItem>
                  <SelectItem value="Marketing">Marketing</SelectItem>
                  <SelectItem value="Education">Education</SelectItem>
                  <SelectItem value="Content">Content</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
              <label htmlFor="model" className="text-sm font-medium">
                Model <span className="text-red-500">*</span>
              </label>
              <Select 
                value={newPrompt.model} 
                onValueChange={(value) => setNewPrompt({...newPrompt, model: value})}
              >
                <SelectTrigger className="bg-black/40 border-white/10">
                  <SelectValue placeholder="Select model" />
                </SelectTrigger>
                <SelectContent className="bg-black/95 border-white/10 text-white">
                  <SelectItem value="GPT-4o">GPT-4o</SelectItem>
                  <SelectItem value="GPT-3.5">GPT-3.5</SelectItem>
                  <SelectItem value="Claude 3">Claude 3</SelectItem>
                  <SelectItem value="Gemini">Gemini</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <Button 
            onClick={handleSubmit} 
            className="bg-primary hover:bg-primary/90 text-black w-full mt-2"
          >
            Submit Prompt
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Main component
const TrendingNow = lazy(() => import('./TrendingNow'));
const AiQuiz = lazy(() => import('./AiQuiz'));
const AiTimeline = lazy(() => import('./AiTimeline'));
const PodcastPlayer = lazy(() => import('./PodcastPlayer'));
const VideoTutorial = lazy(() => import('./VideoTutorial'));

export default function EnhancedPromptLibrary() {
  const { isAuthenticated, user } = useAuth();
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedModel, setSelectedModel] = useState<string>('');
  const [sortBy, setSortBy] = useState<'votes' | 'date'>('votes');
  const { toast } = useToast();
  
  // Sample prompts data with votes and comments
  const [prompts, setPrompts] = useState<Prompt[]>([
    {
      id: 1,
      title: "Professional Email Writer",
      description: "Create professional-sounding emails with a formal tone",
      promptText: "Write a professional email to [recipient] about [topic]. The email should be formal but friendly, clear and concise, and include a specific request or call to action. Sign the email as [your name].",
      category: "Business",
      model: "GPT-4o",
      votes: 24,
      dateAdded: "2025-04-10",
      comments: [
        {
          id: 1,
          userName: "EmailPro",
          text: "Used this for client communications and it saved me so much time!",
          date: "May 5, 2025"
        }
      ]
    },
    {
      id: 2,
      title: "Creative Story Generator",
      description: "Generate creative short stories with detailed characters",
      promptText: "Write a short story set in [setting] with a main character who is [character description]. The story should include a surprising twist and end with [type of ending].",
      category: "Creative",
      model: "GPT-4o",
      votes: 18,
      dateAdded: "2025-04-15",
      comments: []
    },
    {
      id: 3,
      title: "Academic Paper Summarizer",
      description: "Summarize academic papers clearly and concisely",
      promptText: "Summarize the following academic paper in about 250 words. Focus on the main research question, methodology, key findings, and implications. Use clear, straightforward language:\n\n[paste paper abstract or text here]",
      category: "Academic",
      model: "GPT-4o",
      votes: 42,
      dateAdded: "2025-04-05",
      comments: [
        {
          id: 2,
          userName: "ResearcherPhD",
          text: "This is extremely helpful for literature reviews!",
          date: "April 28, 2025"
        },
        {
          id: 3,
          userName: "StudentUser",
          text: "Helped me understand complex papers much faster.",
          date: "May 10, 2025"
        }
      ]
    },
    {
      id: 4,
      title: "Code Explainer",
      description: "Explain complex code in simple terms",
      promptText: "Explain the following code as if you're teaching a beginner programmer. Break down the logic step by step, explain any important concepts, and suggest how it might be improved:\n\n```\n[paste code here]\n```",
      category: "Programming",
      model: "GPT-4o",
      votes: 32,
      dateAdded: "2025-04-20",
      comments: []
    },
    {
      id: 5,
      title: "Meeting Summary Generator",
      description: "Create concise summaries of business meetings",
      promptText: "Create a summary of the following meeting notes. Organize by main topics discussed, decisions made, action items (with person responsible and deadline), and any open questions. Format it in a clear, scannable structure:\n\n[paste meeting notes here]",
      category: "Business",
      model: "GPT-4o",
      votes: 29,
      dateAdded: "2025-04-25",
      comments: []
    },
    {
      id: 6,
      title: "Product Description Writer",
      description: "Write compelling product descriptions for e-commerce",
      promptText: "Write a compelling product description for [product name], which is a [product category]. Key features include: [list features]. The target audience is [target audience]. The tone should be [desired tone, e.g., professional, enthusiastic, luxurious]. Include a catchy headline and bullet points for features.",
      category: "Marketing",
      model: "GPT-3.5",
      votes: 15,
      dateAdded: "2025-05-01",
      comments: []
    },
    {
      id: 7,
      title: "Learning Concept Explainer",
      description: "Explain complex concepts in simple terms for students",
      promptText: "Explain [complex concept] to me as if I'm a [education level] student. Break it down into simple parts, use everyday analogies, and provide examples that would make sense to someone my age. At the end, include 3 quick questions I could answer to test my understanding.",
      category: "Education",
      model: "GPT-4o",
      votes: 37,
      dateAdded: "2025-05-05",
      comments: []
    },
    {
      id: 8,
      title: "Blog Post Outline Creator",
      description: "Create detailed outlines for blog posts",
      promptText: "Create a detailed outline for a blog post titled \"[blog post title]\" targeting [target audience]. The post should focus on [main focus/topic] and include [specific elements to include]. Structure the outline with an introduction, at least 4-5 main sections with subsections, and a conclusion. For each section, provide a brief description of what to cover.",
      category: "Content",
      model: "GPT-3.5",
      votes: 21,
      dateAdded: "2025-05-10",
      comments: []
    }
  ]);
  
  // Extract unique categories and models
  const uniqueCategories = Array.from(new Set(prompts.map(prompt => prompt.category)));
  const uniqueModels = Array.from(new Set(prompts.map(prompt => prompt.model)));
  const categories = ['all', ...uniqueCategories];
  const models = ['all', ...uniqueModels];
  
  // Handle voting
  const handleVote = (id: number) => {
    if (!isAuthenticated) {
      setShowAuthDialog(true);
      return;
    }
    setPrompts(prompts.map(prompt => 
      prompt.id === id ? { ...prompt, votes: prompt.votes + 1 } : prompt
    ));
  };
  
  // Handle adding comments
  const handleAddComment = (id: number, text: string) => {
    if (!isAuthenticated) {
      setShowAuthDialog(true);
      return;
    }
    const newComment = {
      id: Date.now(),
      userName: user?.username || 'Utente',
      text,
      date: format(new Date(), 'dd/MM/yyyy HH:mm')
    };
    setPrompts(prompts.map(prompt => 
      prompt.id === id ? { ...prompt, comments: [...prompt.comments, newComment] } : prompt
    ));
  };
  
  // Handle adding new prompts
  const handleAddPrompt = (newPromptData: Omit<Prompt, 'id' | 'votes' | 'comments' | 'dateAdded'>) => {
    if (!isAuthenticated) {
      setShowAuthDialog(true);
      return;
    }
    const newPrompt: Prompt = {
      ...newPromptData,
      id: Date.now(),
      votes: 0,
      comments: [],
      dateAdded: format(new Date(), 'dd/MM/yyyy HH:mm')
    };
    setPrompts([newPrompt, ...prompts]);
  };
  
  // Filter and sort prompts
  const filteredPrompts = prompts.filter(prompt => {
    const matchesSearch = searchQuery === '' || 
      prompt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prompt.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prompt.promptText.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesCategory = selectedCategory === 'all' || prompt.category === selectedCategory;
    const matchesModel = selectedModel === 'all' || prompt.model === selectedModel;
    
    return matchesSearch && matchesCategory && matchesModel;
  });
  
  // Sort prompts based on selected criteria
  const sortedPrompts = [...filteredPrompts].sort((a, b) => {
    if (sortBy === 'votes') {
      return b.votes - a.votes;
    } else if (sortBy === 'date') {
      return new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime();
    }
    return 0;
  });
  
  // Clear filters
  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedModel('all');
    setSortBy('votes');
  };
  
  // Aggiorno copyCount globale quando si copia
  const handleCopy = (id: number) => {
    setPrompts(
      prompts.map(prompt => 
        prompt.id === id ? { ...prompt, copyCount: (prompt.copyCount || 0) + 1 } : prompt
      )
    );
  };
  
  return (
    <div className="container mx-auto p-4">
      {/* Trending Now con lazy loading */}
      <Suspense fallback={<div className="mb-8 text-gray-400">Caricamento trending...</div>}>
        <TrendingNow prompts={prompts} />
      </Suspense>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Prompt Library</h1>
        <div className="flex gap-2">
          {isAuthenticated ? (
            <>
              <Button onClick={() => setShowDashboard(!showDashboard)}>
                {showDashboard ? 'Torna alla Libreria' : 'Il Tuo Dashboard'}
              </Button>
              <Button onClick={() => setShowAuthDialog(true)}>Aggiungi Prompt</Button>
            </>
          ) : (
            <Button onClick={() => setShowAuthDialog(true)}>Accedi per Contribuire</Button>
          )}
        </div>
      </div>
      
      {showDashboard ? (
        <UserPromptDashboard />
      ) : (
        <>
          <div className="mb-8">
            <div className="relative mb-6">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
              <Input
                type="text"
                placeholder="Search for prompts by keyword or phrase..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 py-6 bg-black/30 border-white/10 focus:border-primary/30 rounded-lg"
              />
              {searchQuery && (
                <button 
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                  onClick={() => setSearchQuery('')}
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            
            <div className="flex flex-wrap gap-4 justify-between items-start">
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-white mb-2">Category</h3>
                  <div className="flex flex-wrap gap-2">
                    {categories.map(category => (
                      <button
                        key={category}
                        className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                          selectedCategory === category
                            ? 'bg-primary text-black font-medium'
                            : 'bg-black/50 text-gray-300 hover:bg-white/10'
                        }`}
                        onClick={() => setSelectedCategory(category)}
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-white mb-2">Model</h3>
                  <div className="flex flex-wrap gap-2">
                    {models.map(model => (
                      <button
                        key={model}
                        className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                          selectedModel === model
                            ? 'bg-primary text-black font-medium'
                            : 'bg-black/50 text-gray-300 hover:bg-white/10'
                        }`}
                        onClick={() => setSelectedModel(model)}
                      >
                        {model}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-white mb-2">Sort By</h3>
                  <div className="flex flex-wrap gap-2">
                    <button
                      className={`flex items-center px-3 py-1.5 rounded-full text-sm transition-colors ${
                        sortBy === 'votes'
                          ? 'bg-primary text-black font-medium'
                          : 'bg-black/50 text-gray-300 hover:bg-white/10'
                      }`}
                      onClick={() => setSortBy('votes')}
                    >
                      <Flame className="h-3.5 w-3.5 mr-1.5" />
                      <span>Most Voted</span>
                    </button>
                    
                    <button
                      className={`flex items-center px-3 py-1.5 rounded-full text-sm transition-colors ${
                        sortBy === 'date'
                          ? 'bg-primary text-black font-medium'
                          : 'bg-black/50 text-gray-300 hover:bg-white/10'
                      }`}
                      onClick={() => setSortBy('date')}
                    >
                      <SortDesc className="h-3.5 w-3.5 mr-1.5" />
                      <span>Newest</span>
                    </button>
                  </div>
                </div>
                
                {(searchQuery || selectedCategory !== 'all' || selectedModel !== 'all' || sortBy !== 'votes') && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={clearFilters}
                    className="px-3 py-1.5 h-auto bg-black/30 border-white/10 hover:bg-white/10 text-white"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Clear filters
                  </Button>
                )}
              </div>
            </div>
          </div>
          
          <div className="mb-4 flex justify-between items-center">
            <h2 className="text-xl font-bold text-white">
              {sortedPrompts.length > 0 ? (
                <>{sortedPrompts.length} {sortedPrompts.length === 1 ? 'Prompt' : 'Prompts'} Found</>
              ) : (
                'No Prompts Found'
              )}
            </h2>
          </div>
          
          <div className="grid grid-cols-1 gap-6">
            {sortedPrompts.length > 0 ? (
              sortedPrompts.map((prompt) => (
                <PromptCard
                  key={prompt.id}
                  prompt={prompt}
                  onVote={handleVote}
                  onComment={handleAddComment}
                />
              ))
            ) : (
              <div className="text-center py-16 bg-black/30 border border-white/10 rounded-xl">
                <p className="text-gray-400">No prompts found matching your criteria.</p>
                <p className="text-gray-500 text-sm mt-2">Try adjusting your search or filters.</p>
              </div>
            )}
          </div>
        </>
      )}

      {/* Sezione funzionalità extra */}
      <div className="mt-12 border-t border-white/10 pt-8">
        <h2 className="text-2xl font-bold text-primary mb-6">Esplora e Impara con l'AI</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Suspense fallback={<div className="mb-8 text-gray-400">Caricamento quiz...</div>}>
            <AiQuiz />
          </Suspense>
          <Suspense fallback={<div className="mb-8 text-gray-400">Caricamento timeline...</div>}>
            <AiTimeline />
          </Suspense>
          <Suspense fallback={<div className="mb-8 text-gray-400">Caricamento podcast...</div>}>
            <PodcastPlayer />
          </Suspense>
          <Suspense fallback={<div className="mb-8 text-gray-400">Caricamento video tutorial...</div>}>
            <VideoTutorial />
          </Suspense>
        </div>
      </div>

      <AuthDialog 
        open={showAuthDialog} 
        onOpenChange={setShowAuthDialog}
      />
    </div>
  );
}