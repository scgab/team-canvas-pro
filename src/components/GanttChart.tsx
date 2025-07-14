import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Calendar, Edit, Trash2, GripHorizontal } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface GanttProject {
  id: string;
  name: string;
  description: string;
  startDate: Date;
  endDate: Date;
  progress: number;
  priority: "low" | "medium" | "high" | "urgent";
  assignee: string;
  color: string;
  dependencies: string[];
}

export function GanttChart() {
  const { toast } = useToast();
  const [projects, setProjects] = useState<GanttProject[]>([
    {
      id: "1",
      name: "Project Planning Phase",
      description: "Initial project setup and requirements gathering",
      startDate: new Date(2024, 11, 1),
      endDate: new Date(2024, 11, 15),
      progress: 100,
      priority: "high",
      assignee: "Sarah Chen",
      color: "#3B82F6",
      dependencies: []
    },
    {
      id: "2", 
      name: "Design & Wireframes",
      description: "Create mockups and design system",
      startDate: new Date(2024, 11, 10),
      endDate: new Date(2024, 11, 28),
      progress: 75,
      priority: "high",
      assignee: "Alex Rivera",
      color: "#10B981",
      dependencies: ["1"]
    },
    {
      id: "3",
      name: "Frontend Development",
      description: "Implement UI components and pages",
      startDate: new Date(2024, 11, 20),
      endDate: new Date(2025, 0, 20),
      progress: 30,
      priority: "medium",
      assignee: "Mike Johnson",
      color: "#F59E0B",
      dependencies: ["2"]
    },
    {
      id: "4",
      name: "Backend Development",
      description: "API development and database setup",
      startDate: new Date(2024, 11, 25),
      endDate: new Date(2025, 0, 25),
      progress: 15,
      priority: "medium",
      assignee: "Emma Davis",
      color: "#EF4444",
      dependencies: ["1"]
    },
    {
      id: "5",
      name: "Testing & QA",
      description: "Comprehensive testing and bug fixes",
      startDate: new Date(2025, 0, 15),
      endDate: new Date(2025, 1, 5),
      progress: 0,
      priority: "high",
      assignee: "David Kim",
      color: "#8B5CF6",
      dependencies: ["3", "4"]
    }
  ]);

  const [viewRange, setViewRange] = useState({
    start: new Date(2024, 10, 1),
    end: new Date(2025, 2, 31)
  });

  const [dragState, setDragState] = useState<{
    isDragging: boolean;
    projectId: string | null;
    dragType: 'move' | 'resize-start' | 'resize-end' | null;
    startX: number;
  }>({
    isDragging: false,
    projectId: null,
    dragType: null,
    startX: 0
  });

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<GanttProject | null>(null);
  const [newProject, setNewProject] = useState<Partial<GanttProject>>({
    name: "",
    description: "",
    startDate: new Date(),
    endDate: new Date(),
    progress: 0,
    priority: "medium",
    assignee: "",
    color: "#3B82F6"
  });

  const ganttRef = useRef<HTMLDivElement>(null);

  // Calculate timeline dimensions
  const timelineStart = viewRange.start;
  const timelineEnd = viewRange.end;
  const totalDays = Math.ceil((timelineEnd.getTime() - timelineStart.getTime()) / (1000 * 60 * 60 * 24));
  const dayWidth = 40;
  const chartWidth = totalDays * dayWidth;

  // Generate timeline headers
  const generateTimelineHeaders = () => {
    const headers = [];
    const currentDate = new Date(timelineStart);
    
    while (currentDate <= timelineEnd) {
      headers.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    return headers;
  };

  const timelineHeaders = generateTimelineHeaders();

  // Calculate project bar position and width
  const getProjectBarStyle = (project: GanttProject) => {
    const startDiff = Math.max(0, (project.startDate.getTime() - timelineStart.getTime()) / (1000 * 60 * 60 * 24));
    const endDiff = Math.min(totalDays, (project.endDate.getTime() - timelineStart.getTime()) / (1000 * 60 * 60 * 24));
    const duration = endDiff - startDiff;
    
    return {
      left: `${startDiff * dayWidth}px`,
      width: `${Math.max(duration * dayWidth, dayWidth)}px`,
      backgroundColor: project.color
    };
  };

  // Handle mouse events for dragging
  const handleMouseDown = (e: React.MouseEvent, projectId: string, dragType: 'move' | 'resize-start' | 'resize-end') => {
    e.preventDefault();
    setDragState({
      isDragging: true,
      projectId,
      dragType,
      startX: e.clientX
    });
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!dragState.isDragging || !dragState.projectId) return;

    const deltaX = e.clientX - dragState.startX;
    const daysDelta = Math.round(deltaX / dayWidth);

    if (Math.abs(daysDelta) < 1) return;

    setProjects(prev => prev.map(project => {
      if (project.id !== dragState.projectId) return project;

      const newProject = { ...project };
      
      switch (dragState.dragType) {
        case 'move':
          const moveDays = daysDelta * (1000 * 60 * 60 * 24);
          newProject.startDate = new Date(project.startDate.getTime() + moveDays);
          newProject.endDate = new Date(project.endDate.getTime() + moveDays);
          break;
          
        case 'resize-start':
          const newStartDate = new Date(project.startDate.getTime() + daysDelta * (1000 * 60 * 60 * 24));
          if (newStartDate < project.endDate) {
            newProject.startDate = newStartDate;
          }
          break;
          
        case 'resize-end':
          const newEndDate = new Date(project.endDate.getTime() + daysDelta * (1000 * 60 * 60 * 24));
          if (newEndDate > project.startDate) {
            newProject.endDate = newEndDate;
          }
          break;
      }

      return newProject;
    }));

    setDragState(prev => ({ ...prev, startX: e.clientX }));
  };

  const handleMouseUp = () => {
    if (dragState.isDragging) {
      toast({
        title: "Project Updated",
        description: "Timeline has been adjusted successfully.",
      });
    }
    setDragState({
      isDragging: false,
      projectId: null,
      dragType: null,
      startX: 0
    });
  };

  // Add event listeners
  useEffect(() => {
    if (dragState.isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [dragState]);

  // Add new project
  const handleAddProject = () => {
    if (!newProject.name || !newProject.startDate || !newProject.endDate) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    const project: GanttProject = {
      id: Date.now().toString(),
      name: newProject.name,
      description: newProject.description || "",
      startDate: new Date(newProject.startDate),
      endDate: new Date(newProject.endDate),
      progress: newProject.progress || 0,
      priority: newProject.priority || "medium",
      assignee: newProject.assignee || "",
      color: newProject.color || "#3B82F6",
      dependencies: []
    };

    setProjects(prev => [...prev, project]);
    setNewProject({
      name: "",
      description: "",
      startDate: new Date(),
      endDate: new Date(),
      progress: 0,
      priority: "medium",
      assignee: "",
      color: "#3B82F6"
    });
    setIsAddDialogOpen(false);

    toast({
      title: "Project Added",
      description: `${project.name} has been added to the timeline.`,
    });
  };

  // Delete project
  const handleDeleteProject = (projectId: string) => {
    setProjects(prev => prev.filter(p => p.id !== projectId));
    toast({
      title: "Project Deleted",
      description: "Project has been removed from the timeline.",
    });
  };

  // Format date for display
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent": return "bg-priority-urgent text-white";
      case "high": return "bg-priority-high text-white";
      case "medium": return "bg-priority-medium text-white";
      case "low": return "bg-priority-low text-white";
      default: return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Project Timeline</h2>
          <p className="text-muted-foreground">Manage project schedules and dependencies</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-primary hover:bg-primary-dark">
              <Plus className="w-4 h-4 mr-2" />
              Add Project
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Project</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="project-name">Project Name *</Label>
                <Input
                  id="project-name"
                  value={newProject.name || ""}
                  onChange={(e) => setNewProject(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter project name"
                />
              </div>
              <div>
                <Label htmlFor="project-description">Description</Label>
                <Textarea
                  id="project-description"
                  value={newProject.description || ""}
                  onChange={(e) => setNewProject(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Project description"
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="start-date">Start Date *</Label>
                  <Input
                    id="start-date"
                    type="date"
                    value={newProject.startDate?.toISOString().split('T')[0] || ""}
                    onChange={(e) => setNewProject(prev => ({ ...prev, startDate: new Date(e.target.value) }))}
                  />
                </div>
                <div>
                  <Label htmlFor="end-date">End Date *</Label>
                  <Input
                    id="end-date"
                    type="date"
                    value={newProject.endDate?.toISOString().split('T')[0] || ""}
                    onChange={(e) => setNewProject(prev => ({ ...prev, endDate: new Date(e.target.value) }))}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="priority">Priority</Label>
                  <Select value={newProject.priority} onValueChange={(value: any) => setNewProject(prev => ({ ...prev, priority: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="assignee">Assignee</Label>
                  <Input
                    id="assignee"
                    value={newProject.assignee || ""}
                    onChange={(e) => setNewProject(prev => ({ ...prev, assignee: e.target.value }))}
                    placeholder="Assign to"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="color">Color</Label>
                <Input
                  id="color"
                  type="color"
                  value={newProject.color || "#3B82F6"}
                  onChange={(e) => setNewProject(prev => ({ ...prev, color: e.target.value }))}
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddProject}>
                  Add Project
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Gantt Chart */}
      <Card className="bg-gradient-card shadow-custom-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Timeline View
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto" ref={ganttRef}>
            <div style={{ width: `${chartWidth}px`, minWidth: '100%' }}>
              {/* Timeline Header */}
              <div className="flex bg-muted/20 border-b border-border">
                <div className="w-64 p-3 font-medium text-sm border-r border-border">
                  Project
                </div>
                <div className="flex">
                  {timelineHeaders.map((date, index) => (
                    <div
                      key={index}
                      className={`w-10 p-2 text-xs text-center border-r border-border ${
                        date.getDay() === 0 || date.getDay() === 6 ? 'bg-muted/40' : ''
                      }`}
                      style={{ width: `${dayWidth}px` }}
                    >
                      <div className="font-medium">{date.getDate()}</div>
                      <div className="text-muted-foreground">
                        {date.toLocaleDateString('en-US', { month: 'short' })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Project Rows */}
              {projects.map((project, index) => (
                <div key={project.id} className="flex border-b border-border hover:bg-muted/10">
                  {/* Project Info */}
                  <div className="w-64 p-3 border-r border-border">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm truncate">{project.name}</div>
                        <div className="text-xs text-muted-foreground truncate">{project.assignee}</div>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge className={`text-xs ${getPriorityColor(project.priority)}`}>
                            {project.priority}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {project.progress}%
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-6 h-6 p-0"
                          onClick={() => setEditingProject(project)}
                        >
                          <Edit className="w-3 h-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-6 h-6 p-0 text-destructive"
                          onClick={() => handleDeleteProject(project.id)}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Timeline */}
                  <div className="relative flex-1" style={{ height: '80px' }}>
                    {/* Grid lines */}
                    {timelineHeaders.map((date, colIndex) => (
                      <div
                        key={colIndex}
                        className={`absolute top-0 bottom-0 border-r border-border/30 ${
                          date.getDay() === 0 || date.getDay() === 6 ? 'bg-muted/20' : ''
                        }`}
                        style={{ left: `${colIndex * dayWidth}px`, width: '1px' }}
                      />
                    ))}

                    {/* Project Bar */}
                    <div
                      className="absolute top-4 h-8 rounded cursor-move flex items-center justify-between px-2 text-white text-xs font-medium shadow-sm hover:shadow-md transition-shadow"
                      style={getProjectBarStyle(project)}
                      onMouseDown={(e) => handleMouseDown(e, project.id, 'move')}
                    >
                      {/* Resize handle - start */}
                      <div
                        className="w-2 h-full bg-black/20 rounded-l cursor-w-resize"
                        onMouseDown={(e) => {
                          e.stopPropagation();
                          handleMouseDown(e, project.id, 'resize-start');
                        }}
                      />
                      
                      {/* Project name */}
                      <div className="flex-1 text-center truncate px-2">
                        {project.name}
                      </div>
                      
                      {/* Resize handle - end */}
                      <div
                        className="w-2 h-full bg-black/20 rounded-r cursor-e-resize"
                        onMouseDown={(e) => {
                          e.stopPropagation();
                          handleMouseDown(e, project.id, 'resize-end');
                        }}
                      />
                    </div>

                    {/* Progress Bar */}
                    <div
                      className="absolute top-4 h-8 bg-white/30 rounded"
                      style={{
                        ...getProjectBarStyle(project),
                        width: `${parseInt(getProjectBarStyle(project).width) * (project.progress / 100)}px`
                      }}
                    />

                    {/* Date Labels */}
                    <div className="absolute bottom-1 left-0 text-xs text-muted-foreground">
                      {formatDate(project.startDate)}
                    </div>
                    <div 
                      className="absolute bottom-1 text-xs text-muted-foreground"
                      style={{ 
                        left: `${parseInt(getProjectBarStyle(project).width) - 60}px`
                      }}
                    >
                      {formatDate(project.endDate)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Project Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 bg-gradient-card shadow-custom-card">
          <CardHeader>
            <CardTitle>Critical Path Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {projects
                .filter(p => p.dependencies.length > 0 || projects.some(dep => dep.dependencies.includes(p.id)))
                .map(project => (
                  <div key={project.id} className="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
                    <div>
                      <div className="font-medium">{project.name}</div>
                      <div className="text-sm text-muted-foreground">
                        Duration: {Math.ceil((project.endDate.getTime() - project.startDate.getTime()) / (1000 * 60 * 60 * 24))} days
                      </div>
                    </div>
                    <Badge variant="outline">
                      Critical
                    </Badge>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card shadow-custom-card">
          <CardHeader>
            <CardTitle>Timeline Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center p-4 bg-muted/20 rounded-lg">
              <div className="text-2xl font-bold text-foreground">{projects.length}</div>
              <div className="text-sm text-muted-foreground">Total Projects</div>
            </div>
            <div className="text-center p-4 bg-muted/20 rounded-lg">
              <div className="text-2xl font-bold text-success">
                {projects.filter(p => p.progress === 100).length}
              </div>
              <div className="text-sm text-muted-foreground">Completed</div>
            </div>
            <div className="text-center p-4 bg-muted/20 rounded-lg">
              <div className="text-2xl font-bold text-warning">
                {projects.filter(p => p.progress > 0 && p.progress < 100).length}
              </div>
              <div className="text-sm text-muted-foreground">In Progress</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}