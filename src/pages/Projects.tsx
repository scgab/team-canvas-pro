import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Calendar, Users, ArrowRight, MoreVertical, Trash2 } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useProjects } from "@/contexts/ProjectsContext";
import { useAuth } from "@/hooks/useAuth";

const Projects = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { projects, loading, createProject, deleteProject } = useProjects();
  const { user } = useAuth();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium' as 'low' | 'medium' | 'high',
    deadline: '',
    status: 'active' as 'active' | 'completed' | 'paused',
    createdBy: '',
    assignedMembers: [] as string[]
  });
  
  // Set current user email
  const currentUser = {
    email: user?.email || 'hna@scandac.com'
  };
  
  console.log('ProjectsPage render - projects:', projects);
  console.log('Projects length:', projects.length);
  console.log('LocalStorage app_projects:', localStorage.getItem('app_projects'));

  // Add test project for debugging
  const addTestProject = () => {
    const testProject = {
      title: 'Test Project',
      description: 'This is a test project to verify the system works',
      priority: 'high' as 'high',
      deadline: '2025-08-01',
      status: 'active' as 'active',
      createdBy: currentUser.email,
      assignedMembers: []
    };
    
    createProject(testProject);
    console.log('Test project created');
  };

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Creating project with form data:', formData);
    
    if (!formData.title.trim()) {
      toast({
        title: "Error",
        description: "Project title is required",
        variant: "destructive"
      });
      return;
    }
    
    const projectData = {
      ...formData,
      createdBy: currentUser.email
    };
    
    const newProject = createProject(projectData);
    console.log('Project created:', newProject);
    
    // Reset form and close modal
    setFormData({ 
      title: '', 
      description: '', 
      priority: 'medium', 
      deadline: '',
      status: 'active',
      createdBy: '',
      assignedMembers: []
    });
    setShowCreateModal(false);
    
    toast({
      title: "Project created",
      description: "Your project has been created successfully.",
    });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'destructive';
      case 'medium':
        return 'default';
      case 'low':
        return 'secondary';
      default:
        return 'default';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading projects...</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Projects ({projects.length})</h1>
          <p className="text-muted-foreground">Manage and track your team's projects</p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={addTestProject}
            variant="outline"
            className="bg-red-50 text-red-600 border-red-200"
          >
            Add Test Project (Debug)
          </Button>
          <Button
            onClick={() => setShowCreateModal(true)}
            className="gap-2"
          >
            <Plus className="h-4 w-4" />
            Create New Project
          </Button>
        </div>
      </div>

      {projects.length === 0 ? (
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold mb-2">No projects yet</h2>
          <p className="text-gray-600 mb-4">Create your first project to get started</p>
          <Button
            onClick={() => setShowCreateModal(true)}
            className="gap-2"
          >
            <Plus className="h-4 w-4" />
            Create Project
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map(project => (
            <Card key={project.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="text-lg">{project.title}</CardTitle>
                <div className="flex gap-2">
                  <Badge variant={getPriorityColor(project.priority)}>
                    {project.priority}
                  </Badge>
                  <Badge variant="outline">
                    {project.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="mb-3">{project.description}</CardDescription>
                <div className="space-y-1 text-sm">
                  <p><span className="font-medium">Deadline:</span> {project.deadline || 'No deadline'}</p>
                  <p><span className="font-medium">Created by:</span> {project.createdBy}</p>
                </div>
                <div className="flex justify-between items-center mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate(`/projects/${project.id}`)}
                  >
                    View Details
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem 
                        onClick={() => deleteProject(project.id)}
                        className="text-destructive"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Create Project Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Create New Project</h2>
            <form onSubmit={handleCreateProject}>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Priority</label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData({...formData, priority: e.target.value as 'low' | 'medium' | 'high'})}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">Deadline</label>
                <input
                  type="date"
                  value={formData.deadline}
                  onChange={(e) => setFormData({...formData, deadline: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex justify-end space-x-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowCreateModal(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  Create Project
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Projects;