import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Plus, 
  MoreHorizontal, 
  Users, 
  Calendar, 
  FolderOpen,
  User,
  Search
} from "lucide-react";
import { Input } from "@/components/ui/input";

const Projects = () => {
  const projects = [
    {
      id: 1,
      name: "Mobile App Redesign",
      description: "Complete overhaul of our mobile application with new design system and improved user experience.",
      progress: 75,
      status: "In Progress",
      priority: "high",
      teamSize: 5,
      dueDate: "Dec 15, 2024",
      color: "bg-blue-500"
    },
    {
      id: 2,
      name: "Website Migration",
      description: "Migration of legacy website to modern tech stack with improved performance and SEO.",
      progress: 45,
      status: "Planning",
      priority: "medium",
      teamSize: 3,
      dueDate: "Jan 20, 2025",
      color: "bg-green-500"
    },
    {
      id: 3,
      name: "Brand Guidelines",
      description: "Development of comprehensive brand guidelines and design system documentation.",
      progress: 90,
      status: "Review",
      priority: "low",
      teamSize: 2,
      dueDate: "Nov 30, 2024",
      color: "bg-purple-500"
    },
    {
      id: 4,
      name: "API Documentation",
      description: "Complete API documentation with examples and interactive playground.",
      progress: 20,
      status: "To Do",
      priority: "medium",
      teamSize: 1,
      dueDate: "Feb 15, 2025",
      color: "bg-orange-500"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "In Progress": return "bg-warning text-warning-foreground";
      case "Planning": return "bg-muted text-muted-foreground";
      case "Review": return "bg-primary text-primary-foreground";
      case "To Do": return "bg-secondary text-secondary-foreground";
      case "Completed": return "bg-success text-success-foreground";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "bg-priority-high";
      case "medium": return "bg-priority-medium";
      case "low": return "bg-priority-low";
      default: return "bg-muted";
    }
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
          <Button className="bg-gradient-primary hover:bg-primary-dark">
            <Plus className="w-4 h-4 mr-2" />
            New Project
          </Button>
        </div>

        {/* Search and Filters */}
        <div className="flex gap-4 items-center">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input 
              placeholder="Search projects..."
              className="pl-10"
            />
          </div>
          <Button variant="outline">
            Filter
          </Button>
          <Button variant="outline">
            Sort by Due Date
          </Button>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <Card key={project.id} className="bg-gradient-card shadow-custom-card hover:shadow-custom-md transition-all duration-200 cursor-pointer group">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${project.color}`} />
                    <div className="flex items-center gap-1">
                      <span className={`w-2 h-2 rounded-full ${getPriorityColor(project.priority)}`} />
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" className="w-6 h-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity">
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </div>
                <CardTitle className="text-lg group-hover:text-primary transition-colors">
                  {project.name}
                </CardTitle>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {project.description}
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

                {/* Status */}
                <div className="flex items-center justify-between">
                  <Badge className={getStatusColor(project.status)}>
                    {project.status}
                  </Badge>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      {project.teamSize}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {project.dueDate.split(',')[0]}
                    </div>
                  </div>
                </div>

                {/* Team Avatars */}
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2">
                    {[1, 2, 3].slice(0, project.teamSize).map((_, index) => (
                      <Avatar key={index} className="w-7 h-7 border-2 border-background">
                        <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                          <User className="w-3 h-3" />
                        </AvatarFallback>
                      </Avatar>
                    ))}
                    {project.teamSize > 3 && (
                      <div className="w-7 h-7 bg-muted rounded-full border-2 border-background flex items-center justify-center">
                        <span className="text-xs text-muted-foreground">+{project.teamSize - 3}</span>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State for New Projects */}
        <Card className="border-2 border-dashed border-border hover:border-primary transition-colors cursor-pointer">
          <CardContent className="p-8 text-center">
            <FolderOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">Create New Project</h3>
            <p className="text-muted-foreground mb-4">Start a new project to organize your tasks and collaborate with your team.</p>
            <Button className="bg-gradient-primary hover:bg-primary-dark">
              <Plus className="w-4 h-4 mr-2" />
              Create Project
            </Button>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Projects;