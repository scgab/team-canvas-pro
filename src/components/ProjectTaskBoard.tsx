import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { KanbanBoard } from "@/components/KanbanBoard";
import { TaskFormDialog } from "@/components/TaskFormDialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { useSharedData, Task } from "@/contexts/SharedDataContext";
import { tasksService } from "@/services/database";
import { 
  ArrowLeft, 
  Calendar, 
  Users, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Plus,
  BarChart3
} from "lucide-react";

interface TaskFormData {
  title: string;
  description?: string;
  priority: "low" | "medium" | "high" | "urgent";
  assignee?: string;
  status: "todo" | "inProgress" | "review" | "done";
  project_id?: string;
  start_date?: Date | null;
  due_date?: Date | null;
  duration?: number;
}

export function ProjectTaskBoard() {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { projects, tasks, loading, createTask } = useSharedData();
  
  const [project, setProject] = useState<any>(null);
  const [projectTasks, setProjectTasks] = useState<Task[]>([]);
  const [taskDialogOpen, setTaskDialogOpen] = useState(false);

  // Get project data
  useEffect(() => {
    if (projects.length > 0 && projectId) {
      const foundProject = projects.find(p => p.id === projectId);
      setProject(foundProject);
    }
  }, [projects, projectId]);

  // Filter tasks for this project
  useEffect(() => {
    if (tasks.length > 0 && projectId) {
      const filteredTasks = tasks.filter(task => task.project_id === projectId);
      setProjectTasks(filteredTasks);
    }
  }, [tasks, projectId]);

  const handleCreateTask = async (taskData: any) => {
    try {
      console.log('Creating task with data:', taskData);
      
      // Transform the data to match backend expectations
      const taskPayload = {
        title: taskData.title,
        description: taskData.description || '',
        priority: taskData.priority,
        assignee: taskData.assignee || '',
        status: 'todo' as 'todo' | 'inProgress' | 'review' | 'done', // Always start with todo
        project_id: projectId,
        start_date: taskData.dueDate ? new Date(taskData.dueDate) : null,
        due_date: taskData.dueDate ? new Date(taskData.dueDate) : null,
        duration: 1
      };
      
      console.log('Task payload:', taskPayload);
      
      await createTask(taskPayload);
      
      setTaskDialogOpen(false);
      
      toast({
        title: "Task Created",
        description: `"${taskData.title}" has been added to the project.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create task. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleTaskStatusUpdate = async (taskId: string, newStatus: string) => {
    try {
      await tasksService.update(taskId, { status: newStatus });
      toast({
        title: "Task Updated",
        description: "Task status has been updated.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update task status.",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-muted rounded w-1/3"></div>
            <div className="h-4 bg-muted rounded w-1/2"></div>
            <div className="grid grid-cols-4 gap-4 mt-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-96 bg-muted rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!project) {
    return (
      <Layout>
        <div className="p-6">
          <Button variant="ghost" onClick={() => navigate('/projects')} className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Projects
          </Button>
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold text-muted-foreground">Project not found</h2>
          </div>
        </div>
      </Layout>
    );
  }

  const todoTasks = projectTasks.filter(task => task.status === 'todo');
  const inProgressTasks = projectTasks.filter(task => task.status === 'inProgress');
  const reviewTasks = projectTasks.filter(task => task.status === 'review');
  const doneTasks = projectTasks.filter(task => task.status === 'done');
  
  const completionPercentage = projectTasks.length > 0 
    ? Math.round((doneTasks.length / projectTasks.length) * 100) 
    : 0;

  const overdueTasks = projectTasks.filter(task => 
    task.due_date && 
    new Date(task.due_date) < new Date() && 
    task.status !== 'done'
  );

  return (
    <Layout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => navigate('/projects')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Projects
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-foreground">{project.title}</h1>
              <p className="text-muted-foreground mt-1">{project.description}</p>
            </div>
          </div>
          <Button onClick={() => setTaskDialogOpen(true)} className="bg-gradient-primary">
            <Plus className="w-4 h-4 mr-2" />
            Create Task
          </Button>
        </div>

        {/* Project Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <BarChart3 className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Tasks</p>
                  <p className="text-2xl font-bold">{projectTasks.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-warning/10 rounded-lg">
                  <Clock className="w-5 h-5 text-warning" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">In Progress</p>
                  <p className="text-2xl font-bold text-warning">{inProgressTasks.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-success/10 rounded-lg">
                  <CheckCircle2 className="w-5 h-5 text-success" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Completed</p>
                  <p className="text-2xl font-bold text-success">{doneTasks.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-destructive/10 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-destructive" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Overdue</p>
                  <p className="text-2xl font-bold text-destructive">{overdueTasks.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Progress Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Project Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Overall Completion</span>
                <span className="text-sm text-muted-foreground">{completionPercentage}%</span>
              </div>
              <Progress value={completionPercentage} className="h-2" />
              
              <div className="grid grid-cols-4 gap-4 mt-4">
                <div className="text-center">
                  <div className="text-lg font-semibold text-muted-foreground">{todoTasks.length}</div>
                  <div className="text-xs text-muted-foreground">To Do</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold text-warning">{inProgressTasks.length}</div>
                  <div className="text-xs text-muted-foreground">In Progress</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold text-primary">{reviewTasks.length}</div>
                  <div className="text-xs text-muted-foreground">Review</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold text-success">{doneTasks.length}</div>
                  <div className="text-xs text-muted-foreground">Done</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Kanban Board */}
        <Card>
          <CardHeader>
            <CardTitle>Task Board</CardTitle>
          </CardHeader>
          <CardContent>
            <KanbanBoard 
              projectId={projectId}
              onTaskStatusUpdate={handleTaskStatusUpdate}
            />
          </CardContent>
        </Card>

        {/* Task Creation Dialog */}
            <TaskFormDialog
              open={taskDialogOpen}
              onOpenChange={setTaskDialogOpen}
              onSubmit={handleCreateTask}
              mode="create"
              defaultStatus="todo"
              task={null}
            />
      </div>
    </Layout>
  );
}