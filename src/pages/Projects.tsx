import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ProjectCreateDialog } from "@/components/ProjectCreateDialog";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { useSharedData } from "@/contexts/SharedDataContext";
import { useAuth } from "@/hooks/useAuth";
import { getUsers } from "@/utils/userDatabase";
import { useToast } from "@/hooks/use-toast";
import { 
  Plus, 
  MoreHorizontal, 
  Users, 
  Calendar, 
  FolderOpen,
  User,
  Search,
  Filter,
  Eye,
  Edit,
  Copy,
  Trash2
} from "lucide-react";

const Projects = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { projects, createProject, setProjects } = useSharedData();
  const { user } = useAuth();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  
  // Get current user ID from user database
  const users = getUsers();
  const currentUser = users.find(u => u.email === user?.email);
  
  // Store current user email globally for project creation
  if (user?.email && typeof window !== 'undefined') {
    (window as any).currentUserEmail = user.email;
  }
  
  // DEBUGGING: Log project state
  console.log('=== PROJECTS DEBUGGING ===');
  console.log('Current user:', currentUser);
  console.log('Projects from SharedDataContext:', projects);
  console.log('Projects length:', projects.length);
  console.log('LocalStorage sharedProjects:', localStorage.getItem('sharedProjects'));
  
  // Show ALL projects to all team members - remove filtering
  const userProjects = projects;
  
  console.log('Projects displayed to user:', userProjects);
  console.log('=== END DEBUGGING ===');

  const handleProjectCreated = () => {
    console.log("Project created successfully");
    toast({
      title: "Success!",
      description: "Project created successfully.",
    });
  };

  const handleViewProject = (projectId: string) => {
    navigate(`/projects/${projectId}`);
  };

  const handleEditProject = (projectId: string) => {
    // TODO: Implement edit functionality
    toast({
      title: "Coming Soon",
      description: "Edit functionality will be implemented soon.",
    });
  };

  const handleDuplicateProject = async (projectId: string) => {
    const originalProject = projects.find(p => p.id === projectId);
    if (!originalProject) return;

    const duplicateData = {
      title: `${originalProject.title} (Copy)`,
      description: originalProject.description,
      priority: originalProject.priority,
      deadline: new Date(originalProject.deadline.getTime() + 7 * 24 * 60 * 60 * 1000), // Add 7 days
      status: 'planning' as const,
      assignedMembers: originalProject.assignedMembers || []
    };

    await createProject(duplicateData);
    toast({
      title: "Project Duplicated",
      description: "A copy of the project has been created.",
    });
  };

  const handleDeleteProject = async () => {
    if (!projectToDelete) return;
    
    setProjects(prev => prev.filter(p => p.id !== projectToDelete));
    setProjectToDelete(null);
    setIsDeleteDialogOpen(false);
    
    toast({
      title: "Project Deleted",
      description: "The project has been permanently deleted.",
    });
  };

  const openDeleteDialog = (projectId: string) => {
    setProjectToDelete(projectId);
    setIsDeleteDialogOpen(true);
  };

  // Filter projects based on search and filters
  const filteredProjects = userProjects.filter(project => {
    try {
      const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           (project.description && project.description.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesStatus = statusFilter === "all" || project.status === statusFilter;
      const matchesPriority = priorityFilter === "all" || project.priority === priorityFilter;
      
      return matchesSearch && matchesStatus && matchesPriority;
    } catch (error) {
      console.error('Error filtering project:', project, error);
      return false;
    }
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "in-progress": return "bg-warning text-warning-foreground";
      case "planning": return "bg-muted text-muted-foreground";
      case "review": return "bg-primary text-primary-foreground";
      case "completed": return "bg-success text-success-foreground";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent": return "bg-red-500";
      case "high": return "bg-orange-500";
      case "medium": return "bg-yellow-500";
      case "low": return "bg-green-500";
      default: return "bg-gray-500";
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <Layout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Projects</h1>
            <p className="text-muted-foreground mt-1">Manage and track all your projects in one place.</p>
          </div>
          <Button 
            className="bg-gradient-primary hover:bg-primary-dark"
            onClick={() => setIsAddDialogOpen(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            New Project
          </Button>
        </div>

        {/* Search and Filters */}
        <div className="flex gap-4 items-center flex-wrap">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input 
              placeholder="Search projects..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40">
              <Filter className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Status</span>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="planning">Planning</SelectItem>
              <SelectItem value="in-progress">In Progress</SelectItem>
              <SelectItem value="review">Review</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
          <Select value={priorityFilter} onValueChange={setPriorityFilter}>
            <SelectTrigger className="w-40">
              <span className="hidden sm:inline">Priority</span>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priority</SelectItem>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="urgent">Urgent</SelectItem>
            </SelectContent>
          </Select>
        </div>


        {/* Projects Grid */}
        <div className="space-y-4">
          {filteredProjects.length === 0 ? (
            <Card className="border-2 border-dashed border-border hover:border-primary transition-colors">
              <CardContent className="p-8 text-center">
                <FolderOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">
                  {projects.length === 0 ? "No projects yet" : "No projects match your filters"}
                </h3>
                <p className="text-muted-foreground mb-4">
                  {projects.length === 0 
                    ? "Start by creating your first project to organize your tasks and collaborate with your team."
                    : "Try adjusting your search or filter criteria."
                  }
                </p>
                {projects.length === 0 && (
                  <Button 
                    className="bg-gradient-primary hover:bg-primary-dark"
                    onClick={() => setIsAddDialogOpen(true)}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Create Project
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <Card 
                key={project.id} 
                className="bg-gradient-card shadow-custom-card hover:shadow-custom-md transition-all duration-200 cursor-pointer group"
                onClick={() => handleViewProject(project.id)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: project.color }} />
                      <div className="flex items-center gap-1">
                        <span className={`w-2 h-2 rounded-full ${getPriorityColor(project.priority)}`} />
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                        <Button variant="ghost" size="sm" className="w-6 h-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleViewProject(project.id); }}>
                          <Eye className="w-4 h-4 mr-2" />
                          View Project
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleEditProject(project.id); }}>
                          <Edit className="w-4 h-4 mr-2" />
                          Edit Project
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleDuplicateProject(project.id); }}>
                          <Copy className="w-4 h-4 mr-2" />
                          Duplicate Project
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={(e) => { e.stopPropagation(); openDeleteDialog(project.id); }}
                          className="text-destructive focus:text-destructive"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete Project
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <CardTitle className="text-lg group-hover:text-primary transition-colors">
                    {project.title}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {project.description || "No description provided"}
                  </p>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  {/* Progress */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-medium">{project.progress}%</span>
                    </div>
                    <Progress value={project.progress} className="h-2" />
                  </div>

                  {/* Status and Deadline */}
                  <div className="flex items-center justify-between">
                    <Badge className={getStatusColor(project.status)}>
                      {project.status.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </Badge>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {project.team_size}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {formatDate(project.deadline)}
                      </div>
                    </div>
                  </div>

                  {/* Team Avatars */}
                  <div className="flex items-center gap-2">
                    <div className="flex -space-x-2">
                      {[1, 2, 3].slice(0, project.team_size).map((_, index) => (
                        <Avatar key={index} className="w-7 h-7 border-2 border-background">
                          <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                            <User className="w-3 h-3" />
                          </AvatarFallback>
                        </Avatar>
                      ))}
                      {project.team_size > 3 && (
                        <div className="w-7 h-7 bg-muted rounded-full border-2 border-background flex items-center justify-center">
                          <span className="text-xs text-muted-foreground">+{project.team_size - 3}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          )}
        </div>
      </div>

      {/* Project Create Dialog */}
      <ProjectCreateDialog 
        open={isAddDialogOpen} 
        onOpenChange={setIsAddDialogOpen}
        onProjectCreated={handleProjectCreated}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        title="Delete Project"
        description="Are you sure you want to delete this project? This action cannot be undone."
        onConfirm={handleDeleteProject}
        confirmText="Delete"
        cancelText="Cancel"
        variant="destructive"
      />
    </Layout>
  );
};

export default Projects;