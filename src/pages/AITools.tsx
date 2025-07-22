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
import { aiToolsService, aiToolCategoriesService } from "@/services/database";
import { supabase } from "@/integrations/supabase/client";

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

interface Category {
  id: string;
  name: string;
  created_by: string;
  created_at: string;
  updated_at: string;
}

const AITools = () => {
  const { toast } = useToast();
  const [aiTools, setAiTools] = useState<Record<string, AITool[]>>({});
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
  const [showEditCategoryModal, setShowEditCategoryModal] = useState(false);
  const [showEditToolModal, setShowEditToolModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [draggedTool, setDraggedTool] = useState<{tool: AITool, sourceCategory: string} | null>(null);
  const [dragOverCategory, setDragOverCategory] = useState<string | null>(null);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [editingTool, setEditingTool] = useState<AITool | null>(null);
  const [editingToolCategory, setEditingToolCategory] = useState<string | null>(null);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [selectedCategoryForAdd, setSelectedCategoryForAdd] = useState<string>('');
  const [newTool, setNewTool] = useState({
    name: '',
    link: '',
    note: '',
    category: '',
    tags: '',
    rating: 0,
    isFavorite: false
  });

  // Load data from Supabase
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        
         // Load categories and tools in parallel with direct Supabase calls to bypass cache
        const [categoriesData, toolsData] = await Promise.all([
          supabase.from('ai_tool_categories').select('*').order('name', { ascending: true }),
          supabase.from('ai_tools').select('*').order('created_at', { ascending: false })
        ]);
        
        if (categoriesData.error) throw categoriesData.error;
        if (toolsData.error) throw toolsData.error;
        
        const categories = categoriesData.data || [];
        const tools = toolsData.data || [];
        
         // ===== DEBUG OUTPUT =====
        console.log('=== AI TOOLS DEBUG ===');
        console.log('Categories from Supabase:', categories);
        console.log('Categories count:', categories.length);
        console.log('Tools from Supabase:', tools);
        console.log('Tools count:', tools.length);
        
        console.log('Setting categories state:', categories);
        setCategories(categories);
        
        // Group tools by category
        const grouped = tools.reduce((acc: any, tool: any) => {
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
        }, {});

        // Ensure all categories exist in grouped data
        categories.forEach(category => {
          if (!grouped[category.name]) {
            grouped[category.name] = [];
          }
        });

        setAiTools(grouped);
      } catch (error) {
        console.error('AITools: Error loading data:', error);
        toast({
          title: "Error",
          description: "Failed to load AI tools data",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Debug state changes
  useEffect(() => {
    console.log('=== RENDERING DEBUG ===');
    console.log('Categories state:', categories);
    console.log('Categories length:', categories.length);
    console.log('AiTools state:', aiTools);
    console.log('Search term:', searchTerm);
    console.log('Show favorites:', showFavoritesOnly);
  }, [categories, aiTools, searchTerm, showFavoritesOnly]);

  // Set up real-time subscriptions
  useEffect(() => {
    const toolsChannel = supabase
      .channel('ai_tools_changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'ai_tools' },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            const newTool = payload.new as any;
            const tool: AITool = {
              id: newTool.id,
              name: newTool.name,
              link: newTool.link,
              note: newTool.note,
              category: newTool.category,
              addedBy: newTool.added_by,
              addedAt: newTool.created_at,
              tags: newTool.tags || [],
              rating: newTool.rating,
              isFavorite: newTool.is_favorite
            };
            
            setAiTools(prev => ({
              ...prev,
              [newTool.category]: [...(prev[newTool.category] || []), tool]
            }));
          } else if (payload.eventType === 'UPDATE') {
            const updatedTool = payload.new as any;
            setAiTools(prev => {
              const newTools = { ...prev };
              Object.keys(newTools).forEach(category => {
                newTools[category] = newTools[category].map(tool =>
                  tool.id === updatedTool.id ? {
                    ...tool,
                    name: updatedTool.name,
                    link: updatedTool.link,
                    note: updatedTool.note,
                    category: updatedTool.category,
                    tags: updatedTool.tags || [],
                    rating: updatedTool.rating,
                    isFavorite: updatedTool.is_favorite
                  } : tool
                ).filter(tool => tool.category === category);
              });
              
              // Move tool to new category if changed
              if (updatedTool.category) {
                const tool = Object.values(newTools).flat().find(t => t.id === updatedTool.id);
                if (tool && tool.category !== updatedTool.category) {
                  // Remove from old category
                  Object.keys(newTools).forEach(category => {
                    newTools[category] = newTools[category].filter(t => t.id !== updatedTool.id);
                  });
                  
                  // Add to new category
                  if (!newTools[updatedTool.category]) {
                    newTools[updatedTool.category] = [];
                  }
                  newTools[updatedTool.category].push({
                    ...tool,
                    category: updatedTool.category
                  });
                }
              }
              
              return newTools;
            });
          } else if (payload.eventType === 'DELETE') {
            const deletedTool = payload.old as any;
            setAiTools(prev => {
              const newTools = { ...prev };
              Object.keys(newTools).forEach(category => {
                newTools[category] = newTools[category].filter(tool => tool.id !== deletedTool.id);
              });
              return newTools;
            });
          }
        }
      )
      .subscribe();

    const categoriesChannel = supabase
      .channel('ai_tool_categories_changes')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'ai_tool_categories' },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            const newCategory = payload.new as Category;
            setCategories(prev => [...prev, newCategory]);
            setAiTools(prev => ({ ...prev, [newCategory.name]: [] }));
          } else if (payload.eventType === 'UPDATE') {
            const updatedCategory = payload.new as Category;
            const oldCategory = payload.old as Category;
            
            setCategories(prev => prev.map(cat => 
              cat.id === updatedCategory.id ? updatedCategory : cat
            ));
            
            // Update category name in tools if changed
            if (oldCategory.name !== updatedCategory.name) {
              setAiTools(prev => {
                const newTools = { ...prev };
                
                // Move tools to new category name
                if (newTools[oldCategory.name]) {
                  newTools[updatedCategory.name] = newTools[oldCategory.name].map(tool => ({
                    ...tool,
                    category: updatedCategory.name
                  }));
                  delete newTools[oldCategory.name];
                }
                
                return newTools;
              });
            }
          } else if (payload.eventType === 'DELETE') {
            const deletedCategory = payload.old as Category;
            setCategories(prev => prev.filter(cat => cat.id !== deletedCategory.id));
            setAiTools(prev => {
              const newTools = { ...prev };
              delete newTools[deletedCategory.name];
              return newTools;
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(toolsChannel);
      supabase.removeChannel(categoriesChannel);
    };
  }, []);

  // Add new AI tool
  const addAiTool = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const effectiveCategory = selectedCategoryForAdd || newTool.category;
    
    if (!newTool.name.trim() || !newTool.link.trim()) {
      toast({
        title: "Error",
        description: "Name and link are required",
        variant: "destructive"
      });
      return;
    }

    if (!effectiveCategory) {
      toast({
        title: "Error",
        description: "Please select a category",
        variant: "destructive"
      });
      return;
    }

    try {
      const currentUser = (window as any).currentUserEmail || 'unknown';
      await aiToolsService.create({
        name: newTool.name,
        link: newTool.link,
        note: newTool.note,
        category: effectiveCategory,
        tags: newTool.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        rating: newTool.rating,
        is_favorite: newTool.isFavorite,
        added_by: currentUser
      });

      // Reset form
      setNewTool({
        name: '',
        link: '',
        note: '',
        category: '',
        tags: '',
        rating: 0,
        isFavorite: false
      });
      setSelectedCategoryForAdd('');
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

  // Open add tool modal for specific category
  const openAddToolModal = (categoryName?: string) => {
    if (categoryName) {
      setSelectedCategoryForAdd(categoryName);
      setNewTool(prev => ({ ...prev, category: categoryName }));
    } else {
      setSelectedCategoryForAdd('');
      setNewTool(prev => ({ ...prev, category: categories.length > 0 ? categories[0].name : '' }));
    }
    setShowAddModal(true);
  };

  // Delete AI tool
  const deleteTool = async (category: string, toolId: string | number) => {
    try {
      await aiToolsService.delete(toolId.toString());
      
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

  const handleDrop = async (e: React.DragEvent, targetCategory: string) => {
    e.preventDefault();
    setDragOverCategory(null);
    
    if (!draggedTool || draggedTool.sourceCategory === targetCategory) {
      setDraggedTool(null);
      return;
    }
    
    try {
      // Update tool category in database
      await aiToolsService.update(draggedTool.tool.id.toString(), { category: targetCategory });
      
      setDraggedTool(null);
      toast({
        title: "Tool moved",
        description: `Moved "${draggedTool.tool.name}" to ${targetCategory}`
      });
    } catch (error) {
      console.error('Error moving tool:', error);
      toast({
        title: "Error",
        description: "Failed to move tool",
        variant: "destructive"
      });
    }
  };

  // Category management functions
  const addCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newCategoryName.trim()) {
      toast({
        title: "Error",
        description: "Category name is required",
        variant: "destructive"
      });
      return;
    }
    
    if (categories.some(cat => cat.name === newCategoryName)) {
      toast({
        title: "Error",
        description: "Category already exists",
        variant: "destructive"
      });
      return;
    }
    
    try {
      const currentUser = (window as any).currentUserEmail || 'unknown';
      await aiToolCategoriesService.create({
        name: newCategoryName,
        created_by: currentUser
      });
      
      setNewCategoryName('');
      setShowAddCategoryModal(false);
      toast({
        title: "Success",
        description: "Category added successfully!"
      });
    } catch (error) {
      console.error('Error adding category:', error);
      toast({
        title: "Error",
        description: "Failed to add category",
        variant: "destructive"
      });
    }
  };

  const editCategory = (category: Category) => {
    setEditingCategory(category);
    setNewCategoryName(category.name);
    setShowEditCategoryModal(true);
  };

  const updateCategoryName = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newCategoryName.trim() || !editingCategory) {
      toast({
        title: "Error",
        description: "Category name is required",
        variant: "destructive"
      });
      return;
    }
    
    if (newCategoryName === editingCategory.name) {
      setShowEditCategoryModal(false);
      return;
    }
    
    if (categories.some(cat => cat.name === newCategoryName && cat.id !== editingCategory.id)) {
      toast({
        title: "Error",
        description: "Category already exists",
        variant: "destructive"
      });
      return;
    }
    
    try {
      await aiToolCategoriesService.update(editingCategory.id, { name: newCategoryName });
      
      // Update tools to use new category name
      const toolsToUpdate = aiTools[editingCategory.name] || [];
      for (const tool of toolsToUpdate) {
        await aiToolsService.update(tool.id.toString(), { category: newCategoryName });
      }
      
      setEditingCategory(null);
      setNewCategoryName('');
      setShowEditCategoryModal(false);
      toast({
        title: "Success",
        description: "Category updated successfully!"
      });
    } catch (error) {
      console.error('Error updating category:', error);
      toast({
        title: "Error",
        description: "Failed to update category",
        variant: "destructive"
      });
    }
  };

  const deleteCategory = async (category: Category) => {
    const toolsInCategory = aiTools[category.name] || [];
    
    if (toolsInCategory.length > 0) {
      if (!confirm(`Are you sure you want to delete "${category.name}"? This will also delete all tools in this category.`)) {
        return;
      }
      
      // Delete all tools in category first
      try {
        for (const tool of toolsInCategory) {
          await aiToolsService.delete(tool.id.toString());
        }
      } catch (error) {
        console.error('Error deleting tools:', error);
        toast({
          title: "Error",
          description: "Failed to delete tools in category",
          variant: "destructive"
        });
        return;
      }
    }
    
    try {
      await aiToolCategoriesService.delete(category.id);
      
      toast({
        title: "Category deleted",
        description: `"${category.name}" has been removed`
      });
    } catch (error) {
      console.error('Error deleting category:', error);
      toast({
        title: "Error",
        description: "Failed to delete category",
        variant: "destructive"
      });
    }
  };

  // Tool editing functions
  const editTool = (tool: AITool, category: string) => {
    setEditingTool({ ...tool });
    setEditingToolCategory(category);
    setShowEditToolModal(true);
  };

  const updateTool = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editingTool?.name.trim() || !editingTool?.link.trim()) {
      toast({
        title: "Error",
        description: "Name and link are required",
        variant: "destructive"
      });
      return;
    }
    
    try {
      await aiToolsService.update(editingTool.id.toString(), {
        name: editingTool.name,
        link: editingTool.link,
        note: editingTool.note,
        category: editingTool.category,
        tags: editingTool.tags,
        rating: editingTool.rating,
        is_favorite: editingTool.isFavorite
      });
      
      setShowEditToolModal(false);
      setEditingTool(null);
      setEditingToolCategory(null);
      toast({
        title: "Success",
        description: "Tool updated successfully!"
      });
    } catch (error) {
      console.error('Error updating tool:', error);
      toast({
        title: "Error",
        description: "Failed to update tool",
        variant: "destructive"
      });
    }
  };

  // Filter tools based on search and favorites
  const filteredTools = categories.reduce((acc, category) => {
    const tools = aiTools[category.name] || [];
    const filtered = tools.filter(tool => {
      const matchesSearch = tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           tool.note.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           tool.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesFavorites = !showFavoritesOnly || tool.isFavorite;
      return matchesSearch && matchesFavorites;
    });
    
    // Always show categories, even if they have no tools (or no filtered tools)
    // But if we're searching or filtering favorites, only show categories with matching tools
    if (!searchTerm && !showFavoritesOnly) {
      acc[category.name] = filtered;
    } else if (filtered.length > 0) {
      acc[category.name] = filtered;
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
              <Button onClick={() => openAddToolModal()} className="flex items-center gap-2">
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
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">Loading AI tools...</p>
              </div>
            </div>
          ) : (
            /* Tools Grid - FORCE SHOW ALL CATEGORIES */
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {/* First show categories from database */}
              {categories.map((category) => {
                const tools = aiTools[category.name] || [];
                const filteredTools = tools.filter(tool => {
                  const matchesSearch = tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                       tool.note.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                       tool.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
                  const matchesFavorites = !showFavoritesOnly || tool.isFavorite;
                  return matchesSearch && matchesFavorites;
                });
                
                // Always show categories when no filters are active, or when they have matching tools
                const noFiltersActive = !searchTerm && !showFavoritesOnly;
                const hasMatchingTools = filteredTools.length > 0;
                
                // Show category if: no filters active OR it has matching tools
                if (!noFiltersActive && !hasMatchingTools) return null;
                
                return (
                  <Card
                    key={category.id}
                    className={`${dragOverCategory === category.name ? 'ring-2 ring-primary' : ''}`}
                    onDragOver={(e) => handleDragOver(e, category.name)}
                    onDragLeave={handleDragLeave}
                    onDrop={(e) => handleDrop(e, category.name)}
                  >
                     <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                       <CardTitle className="text-lg font-semibold">{category.name}</CardTitle>
                       <div className="flex items-center gap-1">
                         <Button
                           variant="ghost"
                           size="sm"
                           onClick={() => openAddToolModal(category.name)}
                           className="h-8 w-8 p-0"
                           title="Add tool to this category"
                         >
                           <Plus className="h-4 w-4" />
                         </Button>
                         <Button
                           variant="ghost"
                           size="sm"
                           onClick={() => editCategory(category)}
                           className="h-8 w-8 p-0"
                         >
                           <Edit2 className="h-4 w-4" />
                         </Button>
                         <Button
                           variant="ghost"
                           size="sm"
                           onClick={() => deleteCategory(category)}
                           className="h-8 w-8 p-0 hover:bg-destructive hover:text-destructive-foreground"
                         >
                           <Trash2 className="h-4 w-4" />
                         </Button>
                       </div>
                     </CardHeader>
                    <CardContent className="space-y-3">
                      {filteredTools.map((tool) => (
                        <div
                          key={tool.id}
                          draggable
                          onDragStart={(e) => handleDragStart(e, tool, category.name)}
                          className="group p-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors cursor-move"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <GripVertical className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                                <h4 className="font-medium text-sm truncate">{tool.name}</h4>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => toggleFavorite(category.name, tool.id)}
                                  className="h-6 w-6 p-0"
                                >
                                  <Star className={`h-3 w-3 ${tool.isFavorite ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground'}`} />
                                </Button>
                              </div>
                              {tool.note && (
                                <p className="text-xs text-muted-foreground mb-2 line-clamp-2">{tool.note}</p>
                              )}
                              {tool.tags.length > 0 && (
                                <div className="flex flex-wrap gap-1 mb-2">
                                  {tool.tags.slice(0, 2).map((tag, index) => (
                                    <Badge key={index} variant="secondary" className="text-xs px-1 py-0">
                                      {tag}
                                    </Badge>
                                  ))}
                                  {tool.tags.length > 2 && (
                                    <Badge variant="secondary" className="text-xs px-1 py-0">
                                      +{tool.tags.length - 2}
                                    </Badge>
                                  )}
                                </div>
                              )}
                              <div className="flex items-center gap-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  asChild
                                  className="h-6 px-2 text-xs"
                                >
                                  <a href={tool.link} target="_blank" rel="noopener noreferrer">
                                    <ExternalLink className="h-3 w-3 mr-1" />
                                    Visit
                                  </a>
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => editTool(tool, category.name)}
                                  className="h-6 px-2 text-xs"
                                >
                                  <Edit2 className="h-3 w-3 mr-1" />
                                  Edit
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => deleteTool(category.name, tool.id)}
                                  className="h-6 px-2 text-xs hover:bg-destructive hover:text-destructive-foreground"
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                       {filteredTools.length === 0 && (
                         <div className="text-center py-4">
                           <p className="text-muted-foreground text-sm mb-3">
                             No tools in this category
                           </p>
                           <Button
                             variant="outline"
                             size="sm"
                             onClick={() => openAddToolModal(category.name)}
                             className="flex items-center gap-2"
                           >
                             <Plus className="h-4 w-4" />
                             Add First Tool
                           </Button>
                         </div>
                       )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Add AI Tool Modal */}
      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {selectedCategoryForAdd ? `Add New AI Tool to ${selectedCategoryForAdd}` : 'Add New AI Tool'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={addAiTool} className="space-y-4">
            <div>
              <label className="text-sm font-medium">Name *</label>
              <Input
                value={newTool.name}
                onChange={(e) => setNewTool({ ...newTool, name: e.target.value })}
                placeholder="Tool name"
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium">Link *</label>
              <Input
                value={newTool.link}
                onChange={(e) => setNewTool({ ...newTool, link: e.target.value })}
                placeholder="https://..."
                type="url"
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium">Category *</label>
              <Select 
                value={selectedCategoryForAdd || newTool.category} 
                onValueChange={(value) => {
                  setSelectedCategoryForAdd(value);
                  setNewTool({ ...newTool, category: value });
                }}
                disabled={!!selectedCategoryForAdd}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.name}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium">Description</label>
              <Textarea
                value={newTool.note}
                onChange={(e) => setNewTool({ ...newTool, note: e.target.value })}
                placeholder="Brief description..."
                rows={3}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Tags</label>
              <Input
                value={newTool.tags}
                onChange={(e) => setNewTool({ ...newTool, tags: e.target.value })}
                placeholder="tag1, tag2, tag3"
              />
            </div>
            <div className="flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={() => setShowAddModal(false)}>
                Cancel
              </Button>
              <Button type="submit">Add Tool</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Add Category Modal */}
      <Dialog open={showAddCategoryModal} onOpenChange={setShowAddCategoryModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Category</DialogTitle>
          </DialogHeader>
          <form onSubmit={addCategory} className="space-y-4">
            <div>
              <label className="text-sm font-medium">Category Name *</label>
              <Input
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                placeholder="Category name"
                required
              />
            </div>
            <div className="flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={() => setShowAddCategoryModal(false)}>
                Cancel
              </Button>
              <Button type="submit">Add Category</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Category Modal */}
      <Dialog open={showEditCategoryModal} onOpenChange={setShowEditCategoryModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Category</DialogTitle>
          </DialogHeader>
          <form onSubmit={updateCategoryName} className="space-y-4">
            <div>
              <label className="text-sm font-medium">Category Name *</label>
              <Input
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                placeholder="Category name"
                required
              />
            </div>
            <div className="flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={() => setShowEditCategoryModal(false)}>
                Cancel
              </Button>
              <Button type="submit">Update Category</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Tool Modal */}
      <Dialog open={showEditToolModal} onOpenChange={setShowEditToolModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Tool</DialogTitle>
          </DialogHeader>
          <form onSubmit={updateTool} className="space-y-4">
            <div>
              <label className="text-sm font-medium">Name *</label>
              <Input
                value={editingTool?.name || ''}
                onChange={(e) => setEditingTool(prev => prev ? { ...prev, name: e.target.value } : null)}
                placeholder="Tool name"
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium">Link *</label>
              <Input
                value={editingTool?.link || ''}
                onChange={(e) => setEditingTool(prev => prev ? { ...prev, link: e.target.value } : null)}
                placeholder="https://..."
                type="url"
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium">Category *</label>
              <Select 
                value={editingTool?.category || ''} 
                onValueChange={(value) => setEditingTool(prev => prev ? { ...prev, category: value } : null)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.name}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium">Description</label>
              <Textarea
                value={editingTool?.note || ''}
                onChange={(e) => setEditingTool(prev => prev ? { ...prev, note: e.target.value } : null)}
                placeholder="Brief description..."
                rows={3}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Tags</label>
              <Input
                value={editingTool?.tags.join(', ') || ''}
                onChange={(e) => setEditingTool(prev => prev ? { 
                  ...prev, 
                  tags: e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag)
                } : null)}
                placeholder="tag1, tag2, tag3"
              />
            </div>
            <div className="flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={() => setShowEditToolModal(false)}>
                Cancel
              </Button>
              <Button type="submit">Update Tool</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default AITools;