import { useState, useEffect } from "react";
import { 
  Plus, 
  Star, 
  ExternalLink, 
  Trash2,
  Search
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

interface AITool {
  id: number;
  name: string;
  link: string;
  note: string;
  category: string;
  addedBy: string;
  addedAt: string;
  tags: string[];
  rating: number;
  isFavorite: boolean;
}

const defaultCategories = {
  'Content Creation': [],
  'Code & Development': [],
  'Design & Media': [],
  'Business & Productivity': [],
  'Data & Analytics': [],
  'Communication': [],
  'Research & Learning': [],
  'Other Tools': []
};

const AITools = () => {
  const { toast } = useToast();
  const [aiTools, setAiTools] = useState<Record<string, AITool[]>>(() => {
    const saved = localStorage.getItem('aiTools');
    return saved ? JSON.parse(saved) : defaultCategories;
  });

  const [showAddModal, setShowAddModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [newTool, setNewTool] = useState({
    name: '',
    link: '',
    note: '',
    category: 'Content Creation',
    tags: '',
    rating: 0,
    isFavorite: false
  });

  // Save to localStorage whenever aiTools changes
  useEffect(() => {
    localStorage.setItem('aiTools', JSON.stringify(aiTools));
  }, [aiTools]);

  // Add new AI tool
  const addAiTool = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newTool.name.trim() || !newTool.link.trim()) {
      toast({
        title: "Error",
        description: "Name and link are required",
        variant: "destructive"
      });
      return;
    }

    const tool: AITool = {
      id: Date.now(),
      name: newTool.name,
      link: newTool.link,
      note: newTool.note,
      category: newTool.category,
      addedBy: localStorage.getItem('currentUser') || 'unknown',
      addedAt: new Date().toISOString(),
      tags: newTool.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
      rating: newTool.rating,
      isFavorite: newTool.isFavorite
    };

    setAiTools(prev => ({
      ...prev,
      [newTool.category]: [...prev[newTool.category], tool]
    }));

    // Reset form
    setNewTool({
      name: '',
      link: '',
      note: '',
      category: 'Content Creation',
      tags: '',
      rating: 0,
      isFavorite: false
    });
    setShowAddModal(false);

    toast({
      title: "Success",
      description: "AI tool added successfully!"
    });
  };

  // Delete AI tool
  const deleteTool = (category: string, toolId: number) => {
    setAiTools(prev => ({
      ...prev,
      [category]: prev[category].filter(tool => tool.id !== toolId)
    }));
    
    toast({
      title: "Tool deleted",
      description: "AI tool has been removed"
    });
  };

  // Toggle favorite
  const toggleFavorite = (category: string, toolId: number) => {
    setAiTools(prev => ({
      ...prev,
      [category]: prev[category].map(tool =>
        tool.id === toolId ? { ...tool, isFavorite: !tool.isFavorite } : tool
      )
    }));
  };

  // Filter tools based on search and favorites
  const filteredTools = Object.entries(aiTools).reduce((acc, [category, tools]) => {
    const filtered = tools.filter(tool => {
      const matchesSearch = tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           tool.note.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           tool.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesFavorites = !showFavoritesOnly || tool.isFavorite;
      return matchesSearch && matchesFavorites;
    });
    
    if (filtered.length > 0) {
      acc[category] = filtered;
    }
    return acc;
  }, {} as Record<string, AITool[]>);

  const totalTools = Object.values(aiTools).flat().length;
  const favoriteTools = Object.values(aiTools).flat().filter(tool => tool.isFavorite).length;

  return (
    <div className="p-6 min-h-screen bg-background">
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">AI Tools Overview</h1>
            <p className="text-muted-foreground">
              {totalTools} tools • {favoriteTools} favorites
            </p>
          </div>
          <Button onClick={() => setShowAddModal(true)} className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Add AI Tool
          </Button>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              type="text"
              placeholder="Search AI tools..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button
            variant={showFavoritesOnly ? "default" : "outline"}
            onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
            className="flex items-center gap-2"
          >
            <Star className="w-4 h-4" />
            Favorites Only
          </Button>
        </div>

        {/* AI Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Object.entries(filteredTools).map(([category, tools]) => (
            <Card key={category} className="h-fit">
              <CardHeader className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground rounded-t-lg">
                <CardTitle className="text-lg">{category}</CardTitle>
                <p className="text-sm opacity-90">{tools.length} tools</p>
              </CardHeader>
              
              <CardContent className="p-4 space-y-3 min-h-[200px]">
                {tools.length === 0 ? (
                  <p className="text-muted-foreground text-sm text-center py-8">
                    No tools added yet
                  </p>
                ) : (
                  tools.map(tool => (
                    <div key={tool.id} className="border rounded-lg p-3 hover:shadow-md transition-shadow bg-card">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-sm text-card-foreground">{tool.name}</h3>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleFavorite(category, tool.id)}
                            className={`p-1 h-auto ${tool.isFavorite ? 'text-yellow-500' : 'text-muted-foreground'}`}
                          >
                            <Star className="w-3 h-3" fill={tool.isFavorite ? 'currentColor' : 'none'} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteTool(category, tool.id)}
                            className="p-1 h-auto text-destructive hover:text-destructive"
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                      
                      <a
                        href={tool.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:text-primary/80 text-xs flex items-center gap-1 mb-2"
                      >
                        <ExternalLink className="w-3 h-3" />
                        Visit Tool
                      </a>
                      
                      {tool.note && (
                        <p className="text-muted-foreground text-xs mb-2">{tool.note}</p>
                      )}
                      
                      {tool.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-2">
                          {tool.tags.map(tag => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                      
                      <div className="flex justify-between items-center text-xs text-muted-foreground">
                        <span>Added by {tool.addedBy}</span>
                        {tool.rating > 0 && (
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-3 h-3 ${i < tool.rating ? 'text-yellow-400 fill-current' : 'text-muted-foreground'}`}
                              />
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty state for no filtered results */}
        {Object.keys(filteredTools).length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No tools match your current filters.</p>
            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm('');
                setShowFavoritesOnly(false);
              }}
              className="mt-4"
            >
              Clear Filters
            </Button>
          </div>
        )}
      </div>

      {/* Add Tool Modal */}
      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add New AI Tool</DialogTitle>
          </DialogHeader>
          <form onSubmit={addAiTool} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Tool Name *</label>
              <Input
                type="text"
                value={newTool.name}
                onChange={(e) => setNewTool({...newTool, name: e.target.value})}
                placeholder="e.g., ChatGPT, Midjourney"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Link *</label>
              <Input
                type="url"
                value={newTool.link}
                onChange={(e) => setNewTool({...newTool, link: e.target.value})}
                placeholder="https://..."
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Category</label>
              <Select
                value={newTool.category}
                onValueChange={(value) => setNewTool({...newTool, category: value})}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.keys(aiTools).map(category => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Note</label>
              <Textarea
                value={newTool.note}
                onChange={(e) => setNewTool({...newTool, note: e.target.value})}
                placeholder="Brief description or personal note"
                rows={3}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Tags (comma-separated)</label>
              <Input
                type="text"
                value={newTool.tags}
                onChange={(e) => setNewTool({...newTool, tags: e.target.value})}
                placeholder="writing, automation, free"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Rating (optional)</label>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map(rating => (
                  <Button
                    key={rating}
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setNewTool({...newTool, rating})}
                    className={`p-1 ${newTool.rating >= rating ? 'text-yellow-400' : 'text-muted-foreground'}`}
                  >
                    <Star className="w-5 h-5" fill={newTool.rating >= rating ? 'currentColor' : 'none'} />
                  </Button>
                ))}
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <input
                id="favorite"
                type="checkbox"
                checked={newTool.isFavorite}
                onChange={(e) => setNewTool({...newTool, isFavorite: e.target.checked})}
                className="rounded"
              />
              <label htmlFor="favorite" className="text-sm">Mark as favorite</label>
            </div>
            
            <div className="flex justify-end space-x-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowAddModal(false)}
              >
                Cancel
              </Button>
              <Button type="submit">
                Add Tool
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AITools;