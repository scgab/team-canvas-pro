import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useSharedData } from "@/contexts/SharedDataContext";

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
  const { projects, tasks } = useSharedData();

  // Set timeline to start from today with bidirectional scrolling
  const today = new Date();
  const [viewRange, setViewRange] = useState({
    start: new Date(today.getFullYear(), today.getMonth() - 3, 1), // 3 months back
    end: new Date(today.getFullYear(), today.getMonth() + 12, 0) // 12 months ahead
  });

  // Transform projects and tasks into Gantt data
  const ganttProjects: GanttItem[] = projects.map(project => ({
    id: project.id,
    name: project.title,
    description: project.description || '',
    startDate: project.deadline ? new Date(project.deadline) : new Date(),
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

  // Combine projects and tasks for display
  const allItems = [...ganttProjects, ...ganttTasks];

  const ganttRef = useRef<HTMLDivElement>(null);

  // Calculate timeline dimensions
  const timelineStart = viewRange.start;
  const timelineEnd = viewRange.end;
  const totalDays = Math.ceil((timelineEnd.getTime() - timelineStart.getTime()) / (1000 * 60 * 60 * 24));
  const dayWidth = 30;
  const chartWidth = Math.min(totalDays * dayWidth, window.innerWidth - 400);

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

  // Calculate item bar position and width
  const getItemBarStyle = (item: GanttItem) => {
    const startDiff = Math.max(0, (item.startDate.getTime() - timelineStart.getTime()) / (1000 * 60 * 60 * 24));
    const endDiff = Math.min(totalDays, (item.endDate.getTime() - timelineStart.getTime()) / (1000 * 60 * 60 * 24));
    const duration = Math.max(1, endDiff - startDiff); // Minimum 1 day
    
    return {
      left: `${startDiff * dayWidth}px`,
      width: `${duration * dayWidth}px`,
      backgroundColor: item.color
    };
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
    setViewRange({
      start: new Date(today.getFullYear(), today.getMonth() - 3, 1),
      end: new Date(today.getFullYear(), today.getMonth() + 12, 0)
    });
  };

  const scrollTimeline = (direction: 'left' | 'right') => {
    const monthsToMove = direction === 'left' ? -1 : 1;
    setViewRange(prev => ({
      start: new Date(prev.start.getFullYear(), prev.start.getMonth() + monthsToMove, 1),
      end: new Date(prev.end.getFullYear(), prev.end.getMonth() + monthsToMove, 0)
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Project Timeline</h2>
          <p className="text-muted-foreground">View all projects and tasks on timeline</p>
        </div>
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
            <div style={{ width: `${chartWidth}px`, minWidth: '100%' }}>
              {/* Timeline Header */}
              <div className="flex bg-muted/20 border-b border-border">
                <div className="w-64 p-3 font-medium text-sm border-r border-border">
                  Item
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

              {/* Item Rows */}
              {allItems.map((item, index) => (
                <div key={item.id} className="flex border-b border-border hover:bg-muted/10">
                  {/* Item Info */}
                  <div className="w-64 p-3 border-r border-border">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm truncate">{item.name}</div>
                        <div className="text-xs text-muted-foreground truncate">
                          {item.assignee || 'Unassigned'}
                        </div>
                        {item.type === "task" && item.projectName && (
                          <div className="text-xs text-muted-foreground truncate">
                            Project: {item.projectName}
                          </div>
                        )}
                        <div className="flex items-center gap-2 mt-1">
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

                    {/* Item Bar */}
                    <div
                      className="absolute top-1/2 -translate-y-1/2 h-6 rounded-lg transition-all flex items-center px-3 text-white text-xs font-medium shadow-sm"
                      style={getItemBarStyle(item)}
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
                        className="absolute top-0 left-0 h-full bg-black/20 rounded-lg transition-all"
                        style={{ width: `${item.progress}%` }}
                      />
                    </div>
                  </div>
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
    </div>
  );
}