import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { 
  ClipboardCopy, 
  CheckCircle, 
  ThumbsUp, 
  MessageSquare,
  Plus,
  Star,
  User,
  Send
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

// Types
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
  text: string;
  category: string;
  model: string;
  votes: number;
  comments: Comment[];
  createdAt: string;
}

// Main component
export default function VotablePrompt() {
  // State for all prompts
  const [prompts, setPrompts] = useState<Prompt[]>([
    {
      id: 1,
      title: "Email Marketing Campaign Generator",
      description: "Create professional email marketing campaigns",
      text: "Generate a compelling email marketing campaign for [product/service] targeting [audience]. Include a catchy subject line, engaging opening paragraph, 3-4 key benefits with brief descriptions, a clear call-to-action, and a professional sign-off. The tone should be [tone: professional/friendly/urgent] and the goal is to [goal: increase sales/drive traffic/boost engagement].",
      category: "Marketing",
      model: "GPT-4o",
      votes: 42,
      createdAt: "2025-04-15",
      comments: [
        {
          id: 1,
          userName: "MarketingPro",
          text: "Used this for our product launch and saw a 25% increase in open rates!",
          date: "May 1, 2025"
        },
        {
          id: 2,
          userName: "EmailGuru",
          text: "Great structure, I'd add a PS line at the end for even better conversions.",
          date: "May 8, 2025"
        }
      ]
    },
    {
      id: 2,
      title: "Technical Documentation Writer",
      description: "Create clear technical documentation for software features",
      text: "Create comprehensive technical documentation for [feature name] in [product/software]. Include:\n\n1. A high-level overview of the feature (1-2 paragraphs)\n2. Detailed explanation of how to configure and use the feature\n3. Examples of common use cases with code snippets or screenshots\n4. Troubleshooting section addressing 3-5 common issues\n5. Any limitations or known issues\n\nUse a clear, concise style appropriate for [audience: developers/end users/administrators].",
      category: "Technical",
      model: "GPT-4o",
      votes: 35,
      createdAt: "2025-04-20",
      comments: [
        {
          id: 3,
          userName: "DevLead",
          text: "This saved our team hours of documentation work!",
          date: "May 2, 2025"
        }
      ]
    },
    {
      id: 3,
      title: "Social Media Content Calendar",
      description: "Create a month of engaging social media content",
      text: "Create a 30-day social media content calendar for [business type] focusing on [primary goal: brand awareness/engagement/conversions]. For each day, include:\n\n1. Content theme or topic\n2. Post copy (under 280 characters for Twitter compatibility)\n3. Hashtag suggestions (3-5 relevant tags)\n4. Content type (image, video, poll, carousel, etc.)\n5. Best time to post\n\nEnsure content aligns with [brand voice: professional/casual/funny] and incorporates industry trends like [trend 1] and [trend 2].",
      category: "Social Media",
      model: "GPT-4o",
      votes: 51,
      createdAt: "2025-04-05",
      comments: [
        {
          id: 4,
          userName: "SocialMediaManager",
          text: "The variety of content this generates is amazing!",
          date: "April 20, 2025"
        },
        {
          id: 5,
          userName: "DigitalMarketer",
          text: "Love how it includes hashtag suggestions - very thorough.",
          date: "April 28, 2025"
        },
        {
          id: 6,
          userName: "ContentCreator",
          text: "Used this for a client and they were very impressed with the results.",
          date: "May 10, 2025"
        }
      ]
    },
    {
      id: 4,
      title: "Product Description Optimizer",
      description: "Create SEO-friendly e-commerce product descriptions",
      text: "Write a compelling product description for [product name], which is a [product category/type]. The description should:\n\n1. Start with an attention-grabbing headline\n2. Include 3-4 paragraphs highlighting key features and benefits\n3. Incorporate relevant keywords: [keyword 1], [keyword 2], [keyword 3]\n4. Use bullet points to list technical specifications\n5. End with a persuasive call-to-action\n\nTarget audience is [audience demographic] and the tone should be [desired tone]. Focus on how the product solves the problem of [common pain point].",
      category: "E-commerce",
      model: "GPT-4o",
      votes: 38,
      createdAt: "2025-04-18",
      comments: []
    },
    {
      id: 5,
      title: "Data Analysis Report Generator",
      description: "Create comprehensive reports from data analysis",
      text: "Create a detailed data analysis report based on the following information:\n\n[Insert data points, metrics, or observations here]\n\nThe report should include:\n1. An executive summary highlighting key findings (max 150 words)\n2. Methodology section explaining how data was collected and analyzed\n3. Detailed analysis with relevant charts and graphs described in text format\n4. Identification of 3-5 significant trends or patterns\n5. Actionable recommendations based on the findings\n6. Limitations of the current analysis and suggestions for future research\n\nThe target audience is [audience: executives/technical team/general audience] and should maintain a [tone: formal/balanced/simplified] approach to explaining statistical concepts.",
      category: "Data Science",
      model: "GPT-4o",
      votes: 45,
      createdAt: "2025-04-10",
      comments: [
        {
          id: 7,
          userName: "DataScientist",
          text: "The structure this provides is perfect for client presentations.",
          date: "April 25, 2025"
        },
        {
          id: 8,
          userName: "AnalyticsManager",
          text: "I appreciate how it includes limitations section - very professional.",
          date: "May 5, 2025"
        }
      ]
    }
  ]);

  // State for categories, filtering and sorting
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('popular'); // 'popular', 'newest', 'most-commented'
  const [newPromptOpen, setNewPromptOpen] = useState(false);
  const [newPrompt, setNewPrompt] = useState({
    title: '',
    description: '',
    text: '',
    category: '',
    model: 'GPT-4o'
  });

  // Extract unique categories
  const categories = ['All', ...Array.from(new Set(prompts.map(prompt => prompt.category)))];

  // Filter and sort prompts
  const filteredPrompts = prompts.filter(prompt => {
    const matchesSearch = 
      searchTerm === '' ||
      prompt.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prompt.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prompt.text.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === 'All' || prompt.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const sortedPrompts = [...filteredPrompts].sort((a, b) => {
    if (sortBy === 'popular') {
      return b.votes - a.votes;
    } else if (sortBy === 'newest') {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    } else if (sortBy === 'most-commented') {
      return b.comments.length - a.comments.length;
    }
    return 0;
  });

  // Prompt card component
  function PromptCard({ prompt }: { prompt: Prompt }) {
    const [copied, setCopied] = useState(false);
    const [showComments, setShowComments] = useState(false);
    const [commentText, setCommentText] = useState('');
    const { toast } = useToast();
    
    // Copy to clipboard
    const copyToClipboard = async () => {
      try {
        await navigator.clipboard.writeText(prompt.text);
        setCopied(true);
        toast({
          title: "Copied to clipboard",
          description: "Prompt has been copied and is ready to paste into GPT",
        });
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        toast({
          title: "Failed to copy",
          description: "Please try again or copy manually",
          variant: "destructive"
        });
      }
    };
    
    // Add vote
    const addVote = () => {
      setPrompts(prompts.map(p => 
        p.id === prompt.id ? { ...p, votes: p.votes + 1 } : p
      ));
      toast({
        title: "Vote added",
        description: "Thank you for voting on this prompt"
      });
    };
    
    // Add comment
    const addComment = () => {
      if (!commentText.trim()) return;
      
      const newComment = {
        id: Date.now(),
        userName: "User",
        text: commentText,
        date: format(new Date(), "MMMM d, yyyy")
      };
      
      setPrompts(prompts.map(p => 
        p.id === prompt.id 
          ? { ...p, comments: [...p.comments, newComment] } 
          : p
      ));
      
      setCommentText("");
      toast({
        title: "Comment added",
        description: "Your comment has been added to this prompt"
      });
    };
    
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-black/20 border border-white/10 rounded-xl p-6 mb-6 hover:border-primary/20 transition-all"
      >
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-bold text-white mb-2">{prompt.title}</h3>
            <p className="text-gray-400 text-sm">{prompt.description}</p>
          </div>
          
          <div className="flex gap-2">
            <span className="px-2 py-1 text-xs rounded-full bg-primary/10 text-primary">
              {prompt.category}
            </span>
            <span className="px-2 py-1 text-xs rounded-full bg-black/40 text-gray-300">
              {prompt.model}
            </span>
          </div>
        </div>
        
        <div className="bg-black/40 border border-white/10 rounded-lg p-4 mb-4">
          <p className="text-gray-300 text-sm whitespace-pre-wrap">{prompt.text}</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={copyToClipboard}
            className="bg-black/30 hover:bg-primary/10 hover:text-primary border-white/10"
          >
            {copied ? (
              <><CheckCircle className="h-4 w-4 mr-2" /> Copied!</>
            ) : (
              <><ClipboardCopy className="h-4 w-4 mr-2" /> Copy to GPT</>
            )}
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={addVote}
            className="flex items-center gap-2 text-gray-400 hover:text-green-500 hover:bg-green-500/10"
          >
            <ThumbsUp className="h-4 w-4" />
            <span>{prompt.votes}</span>
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowComments(!showComments)}
            className="flex items-center gap-2 text-gray-400 hover:text-primary hover:bg-primary/10"
          >
            <MessageSquare className="h-4 w-4" />
            <span>{prompt.comments.length}</span>
          </Button>
        </div>
        
        {showComments && (
          <div className="mt-6 pt-4 border-t border-white/10">
            <h4 className="text-sm font-semibold text-white mb-3">Comments</h4>
            
            {prompt.comments.length > 0 ? (
              <div className="space-y-3 mb-4">
                {prompt.comments.map(comment => (
                  <div key={comment.id} className="bg-black/30 rounded p-3">
                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                      <div className="flex items-center">
                        <User className="h-3 w-3 mr-1" />
                        <span>{comment.userName}</span>
                      </div>
                      <span>{comment.date}</span>
                    </div>
                    <p className="text-gray-300 text-sm">{comment.text}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm mb-4">No comments yet. Be the first to comment!</p>
            )}
            
            <div className="flex items-stretch gap-2">
              <Textarea
                placeholder="Add a comment..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                className="bg-black/30 border-white/10 text-white resize-none"
              />
              <Button
                onClick={addComment}
                disabled={!commentText.trim()}
                className="bg-primary hover:bg-primary/90 text-black self-stretch px-3"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </motion.div>
    );
  }

  // New prompt form component
  function NewPromptForm() {
    const { toast } = useToast();
    
    const handleSubmit = () => {
      if (!newPrompt.title || !newPrompt.text || !newPrompt.category) {
        toast({
          title: "Missing fields",
          description: "Please fill in all required fields",
          variant: "destructive"
        });
        return;
      }
      
      const newPromptWithId: Prompt = {
        ...newPrompt,
        id: Date.now(),
        votes: 0,
        comments: [],
        createdAt: format(new Date(), "yyyy-MM-dd")
      };
      
      setPrompts([newPromptWithId, ...prompts]);
      setNewPrompt({
        title: '',
        description: '',
        text: '',
        category: '',
        model: 'GPT-4o'
      });
      setNewPromptOpen(false);
      
      toast({
        title: "Prompt created",
        description: "Your prompt has been added to the library"
      });
    };
    
    return (
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: 'auto' }}
        exit={{ opacity: 0, height: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-black/30 border border-white/10 rounded-xl p-6 mb-8 overflow-hidden"
      >
        <h3 className="text-xl font-bold text-white mb-4">Create New Prompt</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Title <span className="text-red-500">*</span>
            </label>
            <Input
              placeholder="Enter a title for your prompt"
              value={newPrompt.title}
              onChange={(e) => setNewPrompt({...newPrompt, title: e.target.value})}
              className="bg-black/40 border-white/10 text-white"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Description <span className="text-red-500">*</span>
            </label>
            <Input
              placeholder="Brief description of what this prompt does"
              value={newPrompt.description}
              onChange={(e) => setNewPrompt({...newPrompt, description: e.target.value})}
              className="bg-black/40 border-white/10 text-white"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Prompt Text <span className="text-red-500">*</span>
            </label>
            <Textarea
              placeholder="Enter the full prompt text here..."
              value={newPrompt.text}
              onChange={(e) => setNewPrompt({...newPrompt, text: e.target.value})}
              className="bg-black/40 border-white/10 text-white min-h-[150px]"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Category <span className="text-red-500">*</span>
              </label>
              <Input
                placeholder="E.g., Marketing, Technical, Creative"
                value={newPrompt.category}
                onChange={(e) => setNewPrompt({...newPrompt, category: e.target.value})}
                className="bg-black/40 border-white/10 text-white"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Model
              </label>
              <Input
                placeholder="E.g., GPT-4o, GPT-3.5"
                value={newPrompt.model}
                onChange={(e) => setNewPrompt({...newPrompt, model: e.target.value})}
                className="bg-black/40 border-white/10 text-white"
              />
            </div>
          </div>
          
          <div className="flex justify-end gap-3 pt-2">
            <Button
              variant="outline"
              onClick={() => setNewPromptOpen(false)}
              className="border-white/10 text-white hover:bg-white/5"
            >
              Cancel
            </Button>
            
            <Button
              onClick={handleSubmit}
              className="bg-primary hover:bg-primary/90 text-black"
            >
              Submit
            </Button>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="mt-4">
      {/* Header with control bar */}
      <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
        <div className="flex gap-2 items-center">
          <Input
            type="text"
            placeholder="Search prompts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full md:w-80 bg-black/30 border-white/10 text-white"
          />
        </div>
        
        <Button
          onClick={() => setNewPromptOpen(!newPromptOpen)}
          className="bg-primary hover:bg-primary/90 text-black"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Prompt
        </Button>
      </div>
      
      {/* New prompt form */}
      {newPromptOpen && <NewPromptForm />}
      
      {/* Filters and sorting */}
      <div className="flex flex-wrap gap-4 justify-between items-center mb-6">
        <div>
          <h3 className="text-sm font-medium text-white mb-2">Categories</h3>
          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className={selectedCategory === category 
                  ? "bg-primary text-black hover:bg-primary/90" 
                  : "bg-black/20 border-white/10 text-white hover:bg-white/10"
                }
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
        
        <div>
          <h3 className="text-sm font-medium text-white mb-2">Sort by</h3>
          <div className="flex flex-wrap gap-2">
            <Button
              variant={sortBy === "popular" ? "default" : "outline"}
              size="sm"
              onClick={() => setSortBy("popular")}
              className={sortBy === "popular" 
                ? "bg-primary text-black hover:bg-primary/90" 
                : "bg-black/20 border-white/10 text-white hover:bg-white/10"
              }
            >
              <Star className="h-4 w-4 mr-2" />
              Most Voted
            </Button>
            
            <Button
              variant={sortBy === "newest" ? "default" : "outline"}
              size="sm"
              onClick={() => setSortBy("newest")}
              className={sortBy === "newest" 
                ? "bg-primary text-black hover:bg-primary/90" 
                : "bg-black/20 border-white/10 text-white hover:bg-white/10"
              }
            >
              <Plus className="h-4 w-4 mr-2" />
              Newest
            </Button>
            
            <Button
              variant={sortBy === "most-commented" ? "default" : "outline"}
              size="sm"
              onClick={() => setSortBy("most-commented")}
              className={sortBy === "most-commented" 
                ? "bg-primary text-black hover:bg-primary/90" 
                : "bg-black/20 border-white/10 text-white hover:bg-white/10"
              }
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              Most Comments
            </Button>
          </div>
        </div>
      </div>
      
      {/* Results count */}
      <div className="mb-6">
        <p className="text-gray-400">
          {sortedPrompts.length} prompt{sortedPrompts.length !== 1 ? 's' : ''} found
        </p>
      </div>
      
      {/* Prompt list */}
      <div>
        {sortedPrompts.length > 0 ? (
          sortedPrompts.map(prompt => (
            <PromptCard key={prompt.id} prompt={prompt} />
          ))
        ) : (
          <div className="bg-black/20 border border-white/10 rounded-xl p-8 text-center">
            <p className="text-gray-400 mb-2">No prompts found</p>
            <p className="text-gray-500 text-sm">Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </div>
  );
}