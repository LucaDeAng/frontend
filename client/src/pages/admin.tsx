import { useState } from 'react';
import { Helmet } from 'react-helmet';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Layout, FileText, Plus, Edit, Trash2, Save, X, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArticleMeta } from '@shared/types';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

export default function AdminDashboard() {
  const { toast } = useToast();
  const [selectedTab, setSelectedTab] = useState<'articles' | 'create'>('articles');
  const [editingArticle, setEditingArticle] = useState<ArticleMeta | null>(null);
  
  // Form state for creating/editing articles
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    summary: '',
    category: '',
    content: '',
    author: 'Admin'
  });
  
  // Fetch articles
  const { data: articles, isLoading, error, refetch } = useQuery<ArticleMeta[]>({
    queryKey: ['/api/articles'],
  });
  
  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Auto-generate slug from title if slug field is empty
    if (name === 'title' && !formData.slug) {
      const slug = value.toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-');
      setFormData(prev => ({ ...prev, slug }));
    }
  };
  
  // Handle category select
  const handleCategoryChange = (value: string) => {
    setFormData(prev => ({ ...prev, category: value }));
  };
  
  // Reset form data
  const resetForm = () => {
    setFormData({
      title: '',
      slug: '',
      summary: '',
      category: '',
      content: '',
      author: 'Admin'
    });
    setEditingArticle(null);
  };
  
  // Handle form submission for new article
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.title || !formData.slug || !formData.summary || !formData.category || !formData.content) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }
    
    // Create article object
    const articleData = {
      ...formData,
      date: new Date().toISOString().split('T')[0]
    };
    
    try {
      // For demo purposes, we'll simulate the API call
      toast({
        title: "Processing",
        description: "Creating new article...",
      });
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Show success message
      toast({
        title: "Success!",
        description: editingArticle 
          ? "Article updated successfully" 
          : "New article created successfully",
        variant: "default"
      });
      
      // Reset form and refresh articles list
      resetForm();
      refetch();
      
      // Switch back to articles tab if creating new article
      if (!editingArticle) {
        setSelectedTab('articles');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "There was a problem creating the article. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  // Handle edit article
  const handleEditArticle = (article: ArticleMeta) => {
    setEditingArticle(article);
    setFormData({
      title: article.title,
      slug: article.slug,
      summary: article.summary,
      category: article.category,
      content: '# ' + article.title + '\n\nArticle content goes here...',
      author: article.author
    });
    setSelectedTab('create');
  };
  
  // Handle delete article
  const handleDeleteArticle = async (slug: string) => {
    if (!confirm("Are you sure you want to delete this article? This action cannot be undone.")) {
      return;
    }
    
    try {
      // For demo purposes, we'll simulate the API call
      toast({
        title: "Processing",
        description: "Deleting article...",
      });
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Show success message
      toast({
        title: "Success!",
        description: "Article deleted successfully",
        variant: "default"
      });
      
      // Refresh articles list
      refetch();
    } catch (error) {
      toast({
        title: "Error",
        description: "There was a problem deleting the article. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  return (
    <>
      <Helmet>
        <title>Admin Dashboard | GenAI Hub</title>
      </Helmet>
      
      <div className="min-h-screen bg-black py-20">
        <div className="container mx-auto px-6 md:px-8">
          {/* Dashboard Header */}
          <div className="mb-10">
            <h1 className="text-3xl md:text-4xl font-bold mb-4 text-white">
              Admin Dashboard
            </h1>
            <p className="text-gray-400">
              Manage your website content, create and edit articles
            </p>
          </div>
          
          {/* Dashboard Tabs */}
          <div className="flex border-b border-white/10 mb-8">
            <button 
              className={`py-3 px-5 font-medium ${
                selectedTab === 'articles' 
                  ? 'text-primary border-b-2 border-primary' 
                  : 'text-gray-400 hover:text-white'
              }`}
              onClick={() => setSelectedTab('articles')}
            >
              <div className="flex items-center space-x-2">
                <Layout className="w-4 h-4" />
                <span>Article Management</span>
              </div>
            </button>
            
            <button 
              className={`py-3 px-5 font-medium ${
                selectedTab === 'create' 
                  ? 'text-primary border-b-2 border-primary' 
                  : 'text-gray-400 hover:text-white'
              }`}
              onClick={() => {
                setSelectedTab('create');
                if (!editingArticle) resetForm();
              }}
            >
              <div className="flex items-center space-x-2">
                <Plus className="w-4 h-4" />
                <span>{editingArticle ? 'Edit Article' : 'Create New Article'}</span>
              </div>
            </button>
          </div>
          
          {/* Dashboard Content */}
          <div className="bg-black/30 border border-white/10 rounded-lg">
            {/* Articles Management Tab */}
            {selectedTab === 'articles' && (
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-white">Articles</h2>
                  <Button 
                    className="bg-primary hover:bg-primary/90 text-black"
                    onClick={() => {
                      resetForm();
                      setSelectedTab('create');
                    }}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Create New Article
                  </Button>
                </div>
                
                {isLoading ? (
                  <div className="flex items-center justify-center py-10">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                  </div>
                ) : error ? (
                  <div className="text-center py-10 text-red-500">
                    There was an error loading articles. Please try again.
                  </div>
                ) : articles && articles.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-black/40 border-b border-white/10">
                        <tr>
                          <th className="py-3 px-4 text-left text-sm text-gray-400 font-medium">Title</th>
                          <th className="py-3 px-4 text-left text-sm text-gray-400 font-medium">Category</th>
                          <th className="py-3 px-4 text-left text-sm text-gray-400 font-medium">Date</th>
                          <th className="py-3 px-4 text-left text-sm text-gray-400 font-medium">Author</th>
                          <th className="py-3 px-4 text-right text-sm text-gray-400 font-medium">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {articles.map((article) => {
                          const formattedDate = format(new Date(article.date), 'MMM d, yyyy');
                          
                          return (
                            <tr key={article.slug} className="border-b border-white/5 hover:bg-white/5">
                              <td className="py-4 px-4 text-white">
                                <div className="font-medium">{article.title}</div>
                                <div className="text-xs text-gray-500">{article.slug}</div>
                              </td>
                              <td className="py-4 px-4">
                                <span className="px-2 py-1 rounded-full bg-primary/10 text-primary text-xs">
                                  {article.category}
                                </span>
                              </td>
                              <td className="py-4 px-4 text-gray-400">{formattedDate}</td>
                              <td className="py-4 px-4 text-gray-400">{article.author}</td>
                              <td className="py-4 px-4 text-right">
                                <div className="flex items-center justify-end space-x-2">
                                  <Button 
                                    size="sm" 
                                    variant="outline" 
                                    className="h-8 border-primary/30 text-primary hover:bg-primary/20"
                                    onClick={() => handleEditArticle(article)}
                                  >
                                    <Edit className="h-3.5 w-3.5" />
                                  </Button>
                                  <Button 
                                    size="sm" 
                                    variant="outline" 
                                    className="h-8 border-destructive/30 text-destructive hover:bg-destructive/20"
                                    onClick={() => handleDeleteArticle(article.slug)}
                                  >
                                    <Trash2 className="h-3.5 w-3.5" />
                                  </Button>
                                  <Button 
                                    size="sm" 
                                    variant="outline" 
                                    className="h-8 border-white/30 hover:bg-white/10"
                                    asChild
                                  >
                                    <a href={`/article/${article.slug}`} target="_blank" rel="noopener noreferrer">
                                      <Eye className="h-3.5 w-3.5" />
                                    </a>
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-10 text-gray-400">
                    No articles found. Create your first article to get started.
                  </div>
                )}
              </div>
            )}
            
            {/* Create/Edit Article Tab */}
            {selectedTab === 'create' && (
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-white">
                    {editingArticle ? 'Edit Article' : 'Create New Article'}
                  </h2>
                  {editingArticle && (
                    <Button 
                      variant="outline" 
                      className="border-white/30 hover:bg-white/10"
                      onClick={resetForm}
                    >
                      <X className="w-4 h-4 mr-2" />
                      Cancel Editing
                    </Button>
                  )}
                </div>
                
                <form onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1">
                        Title*
                      </label>
                      <Input
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        className="bg-black/20 border-white/10 focus:border-primary/30"
                        placeholder="Article title"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1">
                        Slug* (URL-friendly identifier)
                      </label>
                      <Input
                        name="slug"
                        value={formData.slug}
                        onChange={handleInputChange}
                        className="bg-black/20 border-white/10 focus:border-primary/30"
                        placeholder="article-url-slug"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1">
                        Category*
                      </label>
                      <Select
                        value={formData.category}
                        onValueChange={handleCategoryChange}
                      >
                        <SelectTrigger className="bg-black/20 border-white/10 focus:border-primary/30">
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="AI Techniques">AI Techniques</SelectItem>
                          <SelectItem value="Business">Business</SelectItem>
                          <SelectItem value="Technology">Technology</SelectItem>
                          <SelectItem value="Future of Work">Future of Work</SelectItem>
                          <SelectItem value="Marketing">Marketing</SelectItem>
                          <SelectItem value="Research">Research</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1">
                        Author*
                      </label>
                      <Input
                        name="author"
                        value={formData.author}
                        onChange={handleInputChange}
                        className="bg-black/20 border-white/10 focus:border-primary/30"
                        placeholder="Author name"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-400 mb-1">
                      Summary* (Brief description)
                    </label>
                    <Textarea
                      name="summary"
                      value={formData.summary}
                      onChange={handleInputChange}
                      className="bg-black/20 border-white/10 focus:border-primary/30 min-h-[80px]"
                      placeholder="A brief summary of the article (1-2 sentences)"
                      required
                    />
                  </div>
                  
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-400 mb-1">
                      Content* (Markdown format)
                    </label>
                    <div className="border border-white/10 rounded-md bg-black/30 p-3 mb-1">
                      <div className="flex items-center text-xs text-gray-500 mb-2">
                        <FileText className="w-3 h-3 mr-1" />
                        <span>Markdown supported</span>
                      </div>
                      <Textarea
                        name="content"
                        value={formData.content}
                        onChange={handleInputChange}
                        className="bg-black/20 border-white/10 focus:border-primary/30 min-h-[300px] font-mono text-sm"
                        placeholder="# Article Title

Write your article content here in Markdown format.

## Section Heading

Your content goes here...

### Subsection

More content here...
"
                        required
                      />
                    </div>
                    <p className="text-xs text-gray-500">
                      Use Markdown syntax for formatting - # for headings, ** for bold, * for italic, etc.
                    </p>
                  </div>
                  
                  <div className="flex justify-end">
                    <Button
                      type="submit"
                      className="bg-primary hover:bg-primary/90 text-black px-6"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      {editingArticle ? 'Update Article' : 'Create Article'}
                    </Button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}