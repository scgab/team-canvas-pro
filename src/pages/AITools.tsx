import { useState, useEffect } from "react";
import { 
  Plus, 
  Star, 
  ExternalLink, 
  Trash2,
  Search,
  Edit2,
  GripVertical
} from "lucide-react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { aiToolsService } from "@/services/database";

interface AITool {
  id: string | number;
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
  const [aiTools, setAiTools] = useState<Record<string, AITool[]>>(defaultCategories);
  const [loading, setLoading] = useState(true);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
  const [showEditCategoryModal, setShowEditCategoryModal] = useState(false);
  const [showEditToolModal, setShowEditToolModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [draggedTool, setDraggedTool] = useState<{tool: AITool, sourceCategory: string} | null>(null);
  const [dragOverCategory, setDragOverCategory] = useState<string | null>(null);
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [editingTool, setEditingTool] = useState<AITool | null>(null);
  const [editingToolCategory, setEditingToolCategory] = useState<string | null>(null);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newTool, setNewTool] = useState({
    name: '',
    link: '',
    note: '',
    category: 'Content Creation',
    tags: '',
    rating: 0,
    isFavorite: false
  });

  // Load data from Supabase
  useEffect(() => {
    const loadAiTools = async () => {
      try {
        setLoading(true);
        const data = await aiToolsService.getAll();
        
        // Group tools by category
        const grouped = data.reduce((acc: any, tool: any) => {
          if (!acc[tool.category]) {
            acc[tool.category] = [];
          }
          acc[tool.category].push({
            id: tool.id,
            name: tool.name,
            link: tool.link,
            note: tool.note,
            category: tool.category,
            tags: tool.tags || [],
            rating: tool.rating,
            isFavorite: tool.is_favorite,
            addedBy: tool.added_by,
            addedAt: tool.created_at
          });
          return acc;
        }, {
          'Content Creation': [],
          'Code & Development': [],
          'Design & Media': [],
          'Business & Productivity': [],
          'Data & Analytics': [],
          'Communication': [],
          'Research & Learning': [],
          'Other Tools': []
        });

        setAiTools(grouped);
      } catch (error) {
        console.error('Error loading AI tools:', error);
      } finally {
        setLoading(false);
      }
    };

    loadAiTools();
  }, []);

  // Add new AI tool
  const addAiTool = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newTool.name.trim() || !newTool.link.trim()) {
      toast({
        title: "Error",
        description: "Name and link are required",
        variant: "destructive"
      });
      return;
    }

    try {
      const currentUser = (window as any).currentUserEmail || 'unknown';
      const newToolData = await aiToolsService.create({
        name: newTool.name,
        link: newTool.link,
        note: newTool.note,
        category: newTool.category,
        tags: newTool.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        rating: newTool.rating,
        is_favorite: newTool.isFavorite,
        added_by: currentUser
      });

      const tool: AITool = {
        id: newToolData.id,
        name: newToolData.name,
        link: newToolData.link,
        note: newToolData.note,
        category: newToolData.category,
        addedBy: newToolData.added_by,
        addedAt: newToolData.created_at,
        tags: newToolData.tags || [],
        rating: newToolData.rating,
        isFavorite: newToolData.is_favorite
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
    } catch (error) {
      console.error('Error adding AI tool:', error);
      toast({
        title: "Error",
        description: "Failed to add AI tool",
        variant: "destructive"
      });
    }
  };

  // Delete AI tool
  const deleteTool = async (category: string, toolId: string | number) => {
    try {
      await aiToolsService.delete(toolId.toString());
      setAiTools(prev => ({
        ...prev,
        [category]: prev[category].filter(tool => tool.id !== toolId)
      }));
      
      toast({
        title: "Tool deleted",
        description: "AI tool has been removed"
      });
    } catch (error) {
      console.error('Error deleting AI tool:', error);
      toast({
        title: "Error",
        description: "Failed to delete AI tool",
        variant: "destructive"
      });
    }
  };

  // Toggle favorite
  const toggleFavorite = async (category: string, toolId: string | number) => {
    try {
      const tool = aiTools[category].find(t => t.id == toolId);
      if (tool) {
        await aiToolsService.update(toolId.toString(), { is_favorite: !tool.isFavorite });
        setAiTools(prev => ({
          ...prev,
          [category]: prev[category].map(tool =>
            tool.id == toolId ? { ...tool, isFavorite: !tool.isFavorite } : tool
          )
        }));
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      toast({
        title: "Error",
        description: "Failed to update favorite status",
        variant: "destructive"
      });
    }
  };

  // Drag and drop handlers
  const handleDragStart = (e: React.DragEvent, tool: AITool, sourceCategory: string) => {
    setDraggedTool({ tool, sourceCategory });
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, targetCategory: string) => {
    e.preventDefault();
    setDragOverCategory(targetCategory);
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDragLeave = () => {
    setDragOverCategory(null);
  };

  const handleDrop = (e: React.DragEvent, targetCategory: string) => {
    e.preventDefault();
    setDragOverCategory(null);
    
    if (!draggedTool || draggedTool.sourceCategory === targetCategory) {
      setDraggedTool(null);
      return;
    }
    
    // Move tool from source category to target category
    setAiTools(prev => {
      const newTools = { ...prev };
      
      // Remove from source category
      newTools[draggedTool.sourceCategory] = newTools[draggedTool.sourceCategory].filter(
        tool => tool.id !== draggedTool.tool.id
      );
      
      // Add to target category with updated category
      const updatedTool = { ...draggedTool.tool, category: targetCategory };
      newTools[targetCategory] = [...newTools[targetCategory], updatedTool];
      
      return newTools;
    });
    
    setDraggedTool(null);
    toast({
      title: "Tool moved",
      description: `Moved "${draggedTool.tool.name}" to ${targetCategory}`
    });
  };

  // Category management functions
  const addCategory = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newCategoryName.trim()) {
      toast({
        title: "Error",
        description: "Category name is required",
        variant: "destructive"
      });
      return;
    }
    
    if (aiTools[newCategoryName]) {
      toast({
        title: "Error",
        description: "Category already exists",
        variant: "destructive"
      });
      return;
    }
    
    setAiTools(prev => ({
      ...prev,
      [newCategoryName]: []
    }));
    
    setNewCategoryName('');
    setShowAddCategoryModal(false);
    toast({
      title: "Success",
      description: "Category added successfully!"
    });
  };

  const editCategory = (oldCategoryName: string) => {
    setEditingCategory(oldCategoryName);
    setNewCategoryName(oldCategoryName);
    setShowEditCategoryModal(true);
  };

  const updateCategoryName = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newCategoryName.trim()) {
      toast({
        title: "Error",
        description: "Category name is required",
        variant: "destructive"
      });
      return;
    }
    
    if (newCategoryName === editingCategory) {
      setShowEditCategoryModal(false);
      return;
    }
    
    if (aiTools[newCategoryName]) {
      toast({
        title: "Error",
        description: "Category already exists",
        variant: "destructive"
      });
      return;
    }
    
    setAiTools(prev => {
      const newTools = { ...prev };
      
      // Create new category with tools from old category
      newTools[newCategoryName] = newTools[editingCategory!].map(tool => ({
        ...tool,
        category: newCategoryName
      }));
      
      // Delete old category
      delete newTools[editingCategory!];
      
      return newTools;
    });
    
    setEditingCategory(null);
    setNewCategoryName('');
    setShowEditCategoryModal(false);
    toast({
      title: "Success",
      description: "Category updated successfully!"
    });
  };

  const deleteCategory = (categoryName: string) => {
    if (aiTools[categoryName].length > 0) {
      if (!confirm(`Are you sure you want to delete "${categoryName}"? This will also delete all tools in this category.`)) {
        return;
      }
    }
    
    setAiTools(prev => {
      const newTools = { ...prev };
      delete newTools[categoryName];
      return newTools;
    });
    
    toast({
      title: "Category deleted",
      description: `"${categoryName}" has been removed`
    });
  };

  // Tool editing functions
  const editTool = (tool: AITool, category: string) => {
    setEditingTool({ ...tool });
    setEditingToolCategory(category);
    setShowEditToolModal(true);
  };

  const updateTool = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editingTool?.name.trim() || !editingTool?.link.trim()) {
      toast({
        title: "Error",
        description: "Name and link are required",
        variant: "destructive"
      });
      return;
    }
    
    setAiTools(prev => ({
      ...prev,
      [editingToolCategory!]: prev[editingToolCategory!].map(tool =>
        tool.id === editingTool!.id ? editingTool! : tool
      )
    }));
    
    setShowEditToolModal(false);
    setEditingTool(null);
    setEditingToolCategory(null);
    toast({
      title: "Success",
      description: "Tool updated successfully!"
    });
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
    <Layout>
      <div className="p-6">
        <div className="flex flex-col gap-6">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground">AI Tools Overview</h1>
              <p className="text-muted-foreground">
                {totalTools} tools • {favoriteTools} favorites
              </p>
            </div>
            <div className="flex gap-3">
              <Button 
                onClick={() => setShowAddCategoryModal(true)}
                variant="outline"
                className="flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Category
              </Button>
              <Button onClick={() => setShowAddModal(true)} className="flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Add AI Tool
              </Button>
            </div>
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

          {/* Loading State */}
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-lg text-muted-foreground">Loading AI tools...</div>
            </div>
          ) : (
            <>
              {/* AI Tools Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {Object.entries(filteredTools).map(([category, tools]) => (
                  <div 
                    key={category} 
                    className={`transition-all ${
                      dragOverCategory === category ? 'ring-2 ring-primary ring-offset-2' : ''
                    }`}
                    onDragOver={(e) => handleDragOver(e, category)}
                    onDragLeave={handleDragLeave}
                    onDrop={(e) => handleDrop(e, category)}
                  >
                    <Card className="h-fit">
                      <CardHeader className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground rounded-t-lg">
                        <div className="flex justify-between items-center">
                          <div>
                            <CardTitle className="text-lg">{category}</CardTitle>
                            <p className="text-sm opacity-90">{tools.length} tools</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => editCategory(category)}
                              className="text-primary-foreground hover:bg-primary-foreground/20 p-1"
                              title="Edit category name"
                            >
                              <Edit2 className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteCategory(category)}
                              className="text-primary-foreground hover:bg-destructive p-1"
                              title="Delete category"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      
                      <CardContent className="p-4 space-y-3 min-h-[200px]">
                        {tools.length === 0 ? (
                          <div className="text-muted-foreground text-sm text-center py-8 border-2 border-dashed border-muted rounded-lg">
                            <p>No tools in this category</p>
                            <p className="text-xs mt-1">Drag tools here or add new ones</p>
                          </div>
                        ) : (
                          tools.map(tool => (
                            <div 
                              key={tool.id} 
                              draggable
                              onDragStart={(e) => handleDragStart(e, tool, category)}
                              className="border rounded-lg p-3 hover:shadow-md transition-shadow bg-card cursor-move hover:bg-muted/50"
                            >
                              <div className="flex justify-between items-start mb-2">
                                <h3 className="font-semibold text-sm text-card-foreground flex items-center gap-2">
                                  <GripVertical className="w-3 h-3 text-muted-foreground" />
                                  {tool.name}
                                </h3>
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
                                    onClick={() => editTool(tool, category)}
                                    className="p-1 h-auto text-primary hover:text-primary"
                                  >
                                    <Edit2 className="w-3 h-3" />
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
                                onClick={(e) => e.stopPropagation()}
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
                  </div>
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
            </>
          )}
        </div>
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

      {/* Add Category Modal */}
      <Dialog open={showAddCategoryModal} onOpenChange={setShowAddCategoryModal}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Add New Category</DialogTitle>
          </DialogHeader>
          <form onSubmit={addCategory} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Category Name</label>
              <Input
                type="text"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                placeholder="e.g., Video Editing, Marketing Tools"
                required
              />
            </div>
            <div className="flex justify-end space-x-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowAddCategoryModal(false)}
              >
                Cancel
              </Button>
              <Button type="submit">
                Add Category
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Category Modal */}
      <Dialog open={showEditCategoryModal} onOpenChange={setShowEditCategoryModal}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Edit Category Name</DialogTitle>
          </DialogHeader>
          <form onSubmit={updateCategoryName} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Category Name</label>
              <Input
                type="text"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                required
              />
            </div>
            <div className="flex justify-end space-x-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowEditCategoryModal(false)}
              >
                Cancel
              </Button>
              <Button type="submit">
                Update Category
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Tool Modal */}
      <Dialog open={showEditToolModal} onOpenChange={setShowEditToolModal}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit AI Tool</DialogTitle>
          </DialogHeader>
          <form onSubmit={updateTool} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Tool Name *</label>
              <Input
                type="text"
                value={editingTool?.name || ''}
                onChange={(e) => setEditingTool(prev => prev ? {...prev, name: e.target.value} : null)}
                placeholder="e.g., ChatGPT, Midjourney"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Link *</label>
              <Input
                type="url"
                value={editingTool?.link || ''}
                onChange={(e) => setEditingTool(prev => prev ? {...prev, link: e.target.value} : null)}
                placeholder="https://..."
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Note</label>
              <Textarea
                value={editingTool?.note || ''}
                onChange={(e) => setEditingTool(prev => prev ? {...prev, note: e.target.value} : null)}
                placeholder="Brief description or personal note"
                rows={3}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Tags (comma-separated)</label>
              <Input
                type="text"
                value={editingTool?.tags.join(', ') || ''}
                onChange={(e) => setEditingTool(prev => prev ? {...prev, tags: e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag)} : null)}
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
                    onClick={() => setEditingTool(prev => prev ? {...prev, rating} : null)}
                    className={`p-1 ${(editingTool?.rating || 0) >= rating ? 'text-yellow-400' : 'text-muted-foreground'}`}
                  >
                    <Star className="w-5 h-5" fill={(editingTool?.rating || 0) >= rating ? 'currentColor' : 'none'} />
                  </Button>
                ))}
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <input
                id="edit-favorite"
                type="checkbox"
                checked={editingTool?.isFavorite || false}
                onChange={(e) => setEditingTool(prev => prev ? {...prev, isFavorite: e.target.checked} : null)}
                className="rounded"
              />
              <label htmlFor="edit-favorite" className="text-sm">Mark as favorite</label>
            </div>
            
            <div className="flex justify-end space-x-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowEditToolModal(false)}
              >
                Cancel
              </Button>
              <Button type="submit">
                Update Tool
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default AITools;