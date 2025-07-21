import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Plus, Edit } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useSharedData } from "@/contexts/SharedDataContext";
import { TaskFormDialog } from "@/components/TaskFormDialog";
import { DateEditDialog } from "@/components/DateEditDialog";
import { projectsService, tasksService } from "@/services/database";

interface GanttItem {
  id: string;
  name: string;
  description: string;
  startDate: Date;
  endDate: Date;
  progress: number;
  priority: "low" | "medium" | "high" | "urgent";
  assignee: string;
  color: string;
  type: "project" | "task";
  projectName?: string;
}

export function GanttChart() {
  const { toast } = useToast();
  const { projects, tasks, createTask, setProjects, setTasks } = useSharedData();
  const [taskDialogOpen, setTaskDialogOpen] = useState(false);
  const [dateEditDialogOpen, setDateEditDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<{
    id: string;
    name: string;
    startDate: Date;
    endDate: Date;
    type: "project" | "task";
  } | null>(null);

  // Set timeline to start from today with bidirectional scrolling
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Reset to start of day
  const [viewRange, setViewRange] = useState({
    start: new Date(today), // Start from today
    end: new Date(today.getFullYear(), today.getMonth() + 6, 0) // 6 months ahead
  });

  // Transform projects and tasks into Gantt data
  const ganttProjects: GanttItem[] = projects.map(project => ({
    id: project.id,
    name: project.title,
    description: project.description || '',
    startDate: project.start_date ? new Date(project.start_date) : new Date(),
    endDate: project.deadline ? new Date(project.deadline) : new Date(),
    progress: project.progress || 0,
    priority: project.priority as "low" | "medium" | "high" | "urgent",
    assignee: project.assignedMembers?.[0] || '',
    color: project.color || '#3B82F6',
    type: "project"
  }));

  const ganttTasks: GanttItem[] = tasks.map(task => ({
    id: task.id,
    name: task.title,
    description: task.description || '',
    startDate: task.start_date ? new Date(task.start_date) : new Date(),
    endDate: task.due_date ? new Date(task.due_date) : new Date(),
    progress: task.status === 'done' ? 100 : task.status === 'inProgress' ? 50 : 0,
    priority: task.priority as "low" | "medium" | "high" | "urgent",
    assignee: task.assignee || '',
    color: projects.find(p => p.id === task.project_id)?.color || '#6B7280',
    type: "task",
    projectName: projects.find(p => p.id === task.project_id)?.title || 'Unknown Project'
  }));

  // Group tasks under their projects
  const organizedItems: GanttItem[] = [];
  
  ganttProjects.forEach(project => {
    organizedItems.push(project);
    const projectTasks = ganttTasks.filter(task => 
      task.projectName === project.name
    );
    organizedItems.push(...projectTasks);
  });
  
  // Add orphaned tasks (tasks without matching projects)
  const orphanedTasks = ganttTasks.filter(task => 
    !ganttProjects.some(project => project.name === task.projectName)
  );
  organizedItems.push(...orphanedTasks);

  const allItems = organizedItems;

  const ganttRef = useRef<HTMLDivElement>(null);

  // Calculate timeline dimensions and headers
  const timelineStart = viewRange.start;
  const timelineEnd = viewRange.end;
  const weekWidth = 120; // Fixed width for each week column
  
  // Generate timeline headers starting from exact timeline start
  const generateTimelineHeaders = () => {
    const headers = [];
    const currentDate = new Date(timelineStart);
    currentDate.setHours(0, 0, 0, 0);
    
    // Start from the beginning of the week containing timelineStart
    const dayOfWeek = currentDate.getDay();
    const startOfWeek = new Date(currentDate);
    startOfWeek.setDate(currentDate.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
    
    let weekStart = new Date(startOfWeek);
    
    while (weekStart <= timelineEnd) {
      headers.push(new Date(weekStart));
      weekStart.setDate(weekStart.getDate() + 7);
    }
    
    return headers;
  };

  const timelineHeaders = generateTimelineHeaders();
  const totalWeeks = timelineHeaders.length;
  const timelineWidth = totalWeeks * weekWidth;

  // Calculate item bar position and width with precise alignment
  const getItemBarStyle = (item: GanttItem) => {
    if (timelineHeaders.length === 0) return { 
      gridColumn: '1', 
      backgroundColor: item.color, 
      width: '0px' 
    };
    
    // Ensure dates are at start of day
    const itemStart = new Date(item.startDate);
    itemStart.setHours(0, 0, 0, 0);
    
    const itemEnd = new Date(item.endDate);
    itemEnd.setHours(0, 0, 0, 0);
    
    // Find which week columns this item spans
    let startColumn = 1;
    let endColumn = 1;
    
    for (let i = 0; i < timelineHeaders.length; i++) {
      const weekStart = timelineHeaders[i];
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekEnd.getDate() + 6);
      weekEnd.setHours(23, 59, 59, 999);
      
      // Check if item starts in this week
      if (itemStart >= weekStart && itemStart <= weekEnd) {
        startColumn = i + 2; // +2 because grid starts at 1 and first column is project names
      }
      
      // Check if item ends in this week
      if (itemEnd >= weekStart && itemEnd <= weekEnd) {
        endColumn = i + 2;
      }
    }
    
    // If item starts before timeline, start at first column
    if (itemStart < timelineHeaders[0]) {
      startColumn = 2;
    }
    
    // If item ends after timeline, end at last column
    if (itemEnd > timelineHeaders[timelineHeaders.length - 1]) {
      endColumn = timelineHeaders.length + 1;
    }
    
    // Ensure we have at least one column width
    if (endColumn < startColumn) {
      endColumn = startColumn;
    }
    
    return {
      gridColumn: `${startColumn} / ${endColumn + 1}`,
      backgroundColor: item.color,
      width: '100%'
    };
  };

  // Format date for display
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-GB', { 
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent": return "bg-destructive text-white";
      case "high": return "bg-orange-500 text-white";
      case "medium": return "bg-warning text-white";
      case "low": return "bg-muted text-muted-foreground";
      default: return "bg-muted text-muted-foreground";
    }
  };

  // Timeline navigation functions
  const goToToday = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    setViewRange({
      start: new Date(today),
      end: new Date(today.getFullYear(), today.getMonth() + 6, 0)
    });
  };

  const scrollTimeline = (direction: 'left' | 'right') => {
    const weeksToMove = direction === 'left' ? -4 : 4; // Move by 4 weeks
    setViewRange(prev => {
      const newStart = new Date(prev.start);
      const newEnd = new Date(prev.end);
      newStart.setDate(newStart.getDate() + (weeksToMove * 7));
      newEnd.setDate(newEnd.getDate() + (weeksToMove * 7));
      return { start: newStart, end: newEnd };
    });
  };

  const handleCreateTask = async (taskData: any) => {
    try {
      console.log('Creating task from Gantt chart:', taskData);
      
      const taskPayload = {
        title: taskData.title,
        description: taskData.description || '',
        priority: taskData.priority,
        assignee: taskData.assignee || '',
        status: 'todo' as 'todo' | 'inProgress' | 'review' | 'done',
        project_id: projects[0]?.id || null, // Default to first project if available
        start_date: taskData.dueDate ? new Date(taskData.dueDate) : null,
        due_date: taskData.dueDate ? new Date(taskData.dueDate) : null,
        duration: 1
      };
      
      await createTask(taskPayload);
      setTaskDialogOpen(false);
      
      toast({
        title: "Task Created",
        description: `"${taskData.title}" has been added to the Gantt chart.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create task. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleEditDates = (item: GanttItem) => {
    setSelectedItem({
      id: item.id,
      name: item.name,
      startDate: item.startDate,
      endDate: item.endDate,
      type: item.type
    });
    setDateEditDialogOpen(true);
  };

  const handleSaveDates = async (id: string, startDate: Date, endDate: Date, type: "project" | "task") => {
    try {
      if (type === "project") {
        await projectsService.update(id, {
          start_date: startDate.toISOString().split('T')[0],
          deadline: endDate.toISOString().split('T')[0]
        });
        
        setProjects(prev => prev.map(p => 
          p.id === id ? { 
            ...p, 
            start_date: startDate, 
            deadline: endDate, 
            updated_at: new Date() 
          } : p
        ));
      } else {
        await tasksService.update(id, {
          start_date: startDate.toISOString().split('T')[0],
          due_date: endDate.toISOString().split('T')[0]
        });
        
        setTasks(prev => prev.map(t => 
          t.id === id ? { 
            ...t, 
            start_date: startDate,
            due_date: endDate,
            updated_at: new Date()
          } : t
        ));
      }
    } catch (error) {
      throw error;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Project Timeline</h2>
          <p className="text-muted-foreground">View all projects and tasks on timeline</p>
        </div>
        <Button 
          onClick={() => setTaskDialogOpen(true)}
          className="bg-gradient-primary hover:bg-primary-dark"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Task
        </Button>
      </div>

      {/* Gantt Chart */}
      <Card className="bg-gradient-card shadow-custom-card">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Timeline View
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={goToToday}>
                Today
              </Button>
              <div className="flex">
                <Button variant="outline" size="sm" onClick={() => scrollTimeline('left')}>
                  ←
                </Button>
                <Button variant="outline" size="sm" onClick={() => scrollTimeline('right')}>
                  →
                </Button>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto" ref={ganttRef}>
            {/* CSS Grid Container for perfect alignment */}
            <div 
              className="gantt-container"
              style={{ 
                display: 'grid',
                gridTemplateColumns: `250px repeat(${totalWeeks}, ${weekWidth}px)`,
                minWidth: `${250 + timelineWidth}px`
              }}
            >
              {/* Timeline Header Row */}
              <div className="gantt-header bg-muted/20 border-b border-border p-3 font-medium text-sm border-r border-border">
                Project / Task
              </div>
              {timelineHeaders.map((date, index) => {
                const weekEnd = new Date(date);
                weekEnd.setDate(weekEnd.getDate() + 6);
                return (
                  <div
                    key={index}
                    className="gantt-header-cell p-2 text-xs text-center border-r border-border bg-muted/10 border-b border-border"
                  >
                    <div className="font-medium">
                      Week {Math.ceil((date.getTime() - new Date(date.getFullYear(), 0, 1).getTime()) / (1000 * 60 * 60 * 24 * 7))}
                    </div>
                    <div className="text-muted-foreground">
                      {date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })} - {weekEnd.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                    </div>
                  </div>
                );
              })}

              {/* Project/Task Rows */}
              {allItems.map((item, index) => (
                <div 
                  key={`row-${item.id}`}
                  className="gantt-row contents"
                >
                  {/* Item Info Column */}
                  <div className={`gantt-info-cell p-3 border-r border-border border-b border-border hover:bg-muted/10 ${
                    item.type === "task" ? "bg-muted/5" : ""
                  }`}>
                    <div className="flex items-center justify-between h-full">
                      <div className="flex-1 min-w-0">
                        <div className={`font-medium text-sm truncate ${
                          item.type === "task" ? "ml-4" : ""
                        }`}>
                          {item.name}
                        </div>
                        <div className={`text-xs text-muted-foreground truncate ${
                          item.type === "task" ? "ml-4" : ""
                        }`}>
                          {item.assignee || 'Unassigned'}
                        </div>
                        {item.type === "task" && item.projectName && (
                          <div className="text-xs text-muted-foreground truncate ml-4">
                            Project: {item.projectName}
                          </div>
                        )}
                        <div className={`flex items-center gap-2 mt-1 ${
                          item.type === "task" ? "ml-4" : ""
                        }`}>
                          <Badge className={`text-xs ${getPriorityColor(item.priority)}`}>
                            {item.priority}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {item.progress}%
                          </span>
                          <Badge variant="outline" className="text-xs">
                            {item.type}
                          </Badge>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleEditDates(item)}
                        className="h-6 w-6 p-0"
                      >
                        <Edit className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>

                  {/* Timeline Bar spanning appropriate columns */}
                  <div
                    className="gantt-timeline-bar relative border-b border-border"
                    style={{
                      ...getItemBarStyle(item),
                      height: '80px',
                      display: 'flex',
                      alignItems: 'center'
                    }}
                  >
                    <div
                      className="h-6 rounded-lg flex items-center px-3 text-white text-xs font-medium shadow-sm mx-1"
                      style={{ backgroundColor: item.color, width: 'calc(100% - 8px)' }}
                      title={`${item.name}: ${formatDate(item.startDate)} - ${formatDate(item.endDate)}`}
                    >
                      <div className="flex items-center gap-2 truncate">
                        <span className="truncate">{item.name}</span>
                        <div className="ml-auto text-xs opacity-80">
                          {item.progress}%
                        </div>
                      </div>
                      
                      {/* Progress overlay */}
                      <div 
                        className="absolute top-0 left-0 h-full bg-black/20 rounded-lg"
                        style={{ width: `${item.progress}%` }}
                      />
                    </div>
                  </div>

                  {/* Empty cells for weeks where item doesn't span */}
                  {timelineHeaders.map((_, weekIndex) => {
                    const barStyle = getItemBarStyle(item);
                    const gridColumnRange = barStyle.gridColumn?.toString() || '';
                    const [start, end] = gridColumnRange.split(' / ').map(n => parseInt(n) || 0);
                    const currentColumn = weekIndex + 2; // +2 for grid column numbering
                    
                    // Only render empty cell if this week is not covered by the bar
                    if (currentColumn < start || currentColumn > end) {
                      return (
                        <div
                          key={`empty-${item.id}-${weekIndex}`}
                          className="gantt-empty-cell border-b border-border border-r border-border/30"
                          style={{ height: '80px' }}
                        />
                      );
                    }
                    return null;
                  })}
                </div>
              ))}

              {allItems.length === 0 && (
                <div className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <Calendar className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium text-muted-foreground mb-2">No Items to Display</h3>
                    <p className="text-sm text-muted-foreground">Create projects and tasks to see them on the timeline</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Timeline Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="bg-gradient-card shadow-custom-card">
          <CardHeader>
            <CardTitle>Timeline Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center p-4 bg-muted/20 rounded-lg">
              <div className="text-2xl font-bold text-foreground">{allItems.length}</div>
              <div className="text-sm text-muted-foreground">Total Items</div>
            </div>
            <div className="text-center p-4 bg-muted/20 rounded-lg">
              <div className="text-2xl font-bold text-success">
                {allItems.filter(p => p.progress === 100).length}
              </div>
              <div className="text-sm text-muted-foreground">Completed</div>
            </div>
            <div className="text-center p-4 bg-muted/20 rounded-lg">
              <div className="text-2xl font-bold text-warning">
                {allItems.filter(p => p.progress > 0 && p.progress < 100).length}
              </div>
              <div className="text-sm text-muted-foreground">In Progress</div>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2 bg-gradient-card shadow-custom-card">
          <CardHeader>
            <CardTitle>Project Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {ganttProjects.map(project => (
                <div key={project.id} className="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
                  <div>
                    <div className="font-medium">{project.name}</div>
                    <div className="text-sm text-muted-foreground">
                      Tasks: {ganttTasks.filter(t => t.projectName === project.name).length}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={`text-xs ${getPriorityColor(project.priority)}`}>
                      {project.priority}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {project.progress}%
                    </span>
                  </div>
                </div>
              ))}
              {ganttProjects.length === 0 && (
                <div className="text-center py-4 text-muted-foreground">
                  No projects created yet
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
      
      <TaskFormDialog
        open={taskDialogOpen}
        onOpenChange={setTaskDialogOpen}
        onSubmit={handleCreateTask}
        mode="create"
        defaultStatus="todo"
        task={null}
      />
      
      <DateEditDialog
        open={dateEditDialogOpen}
        onOpenChange={setDateEditDialogOpen}
        item={selectedItem}
        onSave={handleSaveDates}
      />
    </div>
  );
}