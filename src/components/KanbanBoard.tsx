import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { TaskFormDialog } from "./TaskFormDialog";
import { ConfirmDialog } from "./ConfirmDialog";
import { useSharedData } from "@/contexts/SharedDataContext";
import { supabase } from "@/integrations/supabase/client";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  closestCenter,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { 
  Plus, 
  MoreHorizontal, 
  Calendar, 
  MessageSquare, 
  Paperclip,
  User,
  Edit,
  Copy,
  Trash2
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface KanbanTask {
  id: string;
  title: string;
  description?: string;
  priority: "low" | "medium" | "high" | "urgent";
  assignee?: string;
  assigneeAvatar?: string;
  dueDate?: string;
  comments: number;
  attachments: number;
  tags: string[];
  status: string;
}

interface Column {
  id: string;
  title: string;
  tasks: KanbanTask[];
  color: string;
}

export function KanbanBoard({ projectId, onTaskStatusUpdate }: { projectId?: string; onTaskStatusUpdate?: (taskId: string, newStatus: string) => Promise<void> }) {
  const { toast } = useToast();
  const { tasks, setTasks, createTask } = useSharedData();
  
  // Convert shared tasks to kanban columns
  const [columns, setColumns] = useState<Column[]>([
    {
      id: "todo",
      title: "To Do",
      color: "border-muted",
      tasks: []
    },
    {
      id: "inProgress",
      title: "In Progress",
      color: "border-warning",
      tasks: []
    },
    {
      id: "review",
      title: "Review",
      color: "border-primary",
      tasks: []
    },
    {
      id: "done",
      title: "Done",
      color: "border-success",
      tasks: []
    }
  ]);

  // Update columns when tasks change
  useEffect(() => {
    const convertTaskToKanbanTask = (task: any): KanbanTask => ({
      id: task.id,
      title: task.title,
      description: task.description,
      priority: task.priority,
      assignee: task.assignee,
      status: task.status,
      tags: [],
      comments: 0,
      attachments: 0,
    });

    const filteredTasks = projectId 
      ? tasks.filter(task => task.project_id === projectId)
      : tasks;

    setColumns(prevColumns => 
      prevColumns.map(column => ({
        ...column,
        tasks: filteredTasks
          .filter(task => task.status === column.id)
          .map(convertTaskToKanbanTask)
      }))
    );
  }, [tasks, projectId]);

  const [activeTask, setActiveTask] = useState<KanbanTask | null>(null);
  const [taskDialogOpen, setTaskDialogOpen] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<KanbanTask | null>(null);
  const [deletingTask, setDeletingTask] = useState<KanbanTask | null>(null);
  const [dialogMode, setDialogMode] = useState<'create' | 'edit'>('create');
  const [selectedColumn, setSelectedColumn] = useState<string>('todo');

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 200,
        tolerance: 5,
      },
    })
  );

  const getAllTasks = () => {
    return columns.flatMap(column => column.tasks);
  };

  const getTaskById = (id: string) => {
    return getAllTasks().find(task => task.id === id);
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

  const handleDragStart = (event: DragStartEvent) => {
    const task = getTaskById(event.active.id as string);
    setActiveTask(task || null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over) {
      setActiveTask(null);
      return;
    }

    const activeTaskId = active.id as string;
    const overColumnId = over.id as string;

    // Find the task and its current column
    const task = getTaskById(activeTaskId);
    if (!task) {
      setActiveTask(null);
      return;
    }

    const sourceColumn = columns.find(col => col.tasks.some(t => t.id === activeTaskId));
    const targetColumn = columns.find(col => col.id === overColumnId);

    if (!sourceColumn || !targetColumn) {
      setActiveTask(null);
      return;
    }

    // If dropped in the same column, do nothing
    if (sourceColumn.id === targetColumn.id) {
      setActiveTask(null);
      return;
    }

    // Update task status in Supabase
    const updateTaskStatus = async () => {
      try {
        const dbStatus = targetColumn.id === 'inProgress' ? 'in_progress' : targetColumn.id;
        const { error } = await supabase
          .from('tasks')
          .update({ status: dbStatus })
          .eq('id', activeTaskId);

        if (error) {
          console.error('Error updating task status:', error);
          throw error;
        }

        toast({
          title: "Task Moved",
          description: `"${task.title}" moved to ${targetColumn.title}`,
        });
      } catch (error) {
        console.error('Error updating task status:', error);
        toast({
          title: "Error",
          description: "Failed to update task status. Please try again.",
          variant: "destructive"
        });
      }
    };

    updateTaskStatus();

    setActiveTask(null);
  };

  const handleCreateTask = async (taskData: Omit<KanbanTask, 'id' | 'comments' | 'attachments'>) => {
    try {
      console.log('Creating task with data:', taskData);
      
      // Use SharedDataContext's createTask function for Supabase integration
      await createTask({
        title: taskData.title,
        description: taskData.description || '',
        priority: taskData.priority,
        assignee: taskData.assignee || '',
        status: taskData.status as 'todo' | 'inProgress' | 'review' | 'done',
        project_id: projectId,
        start_date: null,
        due_date: null,
        duration: 1,
      });

      console.log('Task created successfully via Supabase');

      toast({
        title: "Task Created",
        description: `"${taskData.title}" has been added to the project.`,
      });
    } catch (error) {
      console.error('Error creating task:', error);
      toast({
        title: "Error",
        description: "Failed to create task. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleEditTask = async (taskData: Omit<KanbanTask, 'id' | 'comments' | 'attachments'>) => {
    if (!editingTask) return;

    try {
      // Convert status to database format
      const dbStatus = taskData.status === 'inProgress' ? 'in_progress' : taskData.status;
      
      // Update task in Supabase
      const { error } = await supabase
        .from('tasks')
        .update({
          title: taskData.title,
          description: taskData.description || '',
          priority: taskData.priority,
          assignee: taskData.assignee || '',
          status: dbStatus
        })
        .eq('id', editingTask.id);

      if (error) {
        console.error('Error updating task:', error);
        throw error;
      }

      toast({
        title: "Task Updated",
        description: `"${taskData.title}" has been updated`,
      });

      setEditingTask(null);
    } catch (error) {
      console.error('Error updating task:', error);
      toast({
        title: "Error",
        description: "Failed to update task. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleDuplicateTask = async (task: KanbanTask) => {
    try {
      // Use SharedDataContext's createTask function for Supabase integration
      await createTask({
        title: `${task.title} (Copy)`,
        description: task.description || '',
        priority: task.priority,
        assignee: task.assignee || '',
        status: task.status as 'todo' | 'inProgress' | 'review' | 'done',
        project_id: projectId,
        start_date: null,
        due_date: null,
        duration: 1,
      });

      toast({
        title: "Task Duplicated",
        description: `"${task.title} (Copy)" has been created`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to duplicate task. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleDeleteTask = async () => {
    if (!deletingTask) return;

    try {
      // Delete task from Supabase
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', deletingTask.id);

      if (error) {
        console.error('Error deleting task:', error);
        throw error;
      }

      toast({
        title: "Task Deleted",
        description: `"${deletingTask.title}" has been deleted`,
      });

      setDeletingTask(null);
      setConfirmDialogOpen(false);
    } catch (error) {
      console.error('Error deleting task:', error);
      toast({
        title: "Error",
        description: "Failed to delete task. Please try again.",
        variant: "destructive"
      });
    }
  };

  const openEditDialog = (task: KanbanTask) => {
    setEditingTask(task);
    setDialogMode('edit');
    setTaskDialogOpen(true);
  };

  const openDeleteDialog = (task: KanbanTask) => {
    setDeletingTask(task);
    setConfirmDialogOpen(true);
  };

  const openCreateDialog = (columnId: string) => {
    setSelectedColumn(columnId);
    setDialogMode('create');
    setEditingTask(null);
    setTaskDialogOpen(true);
  };

  const SortableTask = ({ task }: { task: KanbanTask }) => {
    const {
      attributes,
      listeners,
      setNodeRef,
      transform,
      transition,
      isDragging,
    } = useSortable({ id: task.id });

    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
      opacity: isDragging ? 0.5 : 1,
    };

    return (
      <Card 
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        className="mb-3 bg-card hover:shadow-custom-md transition-all duration-200 cursor-grab active:cursor-grabbing group animate-fade-in"
      >
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-2">
            <h4 className="font-medium text-sm text-foreground group-hover:text-primary transition-colors">
              {task.title}
            </h4>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="w-6 h-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => e.stopPropagation()}
                >
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => openEditDialog(task)}>
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Task
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleDuplicateTask(task)}>
                  <Copy className="w-4 h-4 mr-2" />
                  Duplicate
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className="text-destructive"
                  onClick={() => openDeleteDialog(task)}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {task.description && (
            <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
              {task.description}
            </p>
          )}

          {/* Tags */}
          <div className="flex flex-wrap gap-1 mb-3">
            {task.tags.map((tag, index) => (
              <Badge key={index} variant="secondary" className="text-xs px-2 py-0.5">
                {tag}
              </Badge>
            ))}
          </div>

          {/* Priority */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className={`text-xs px-2 py-1 rounded-full font-medium ${getPriorityColor(task.priority)}`}>
                {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
              </span>
            </div>

            <div className="flex items-center gap-2">
              {task.comments > 0 && (
                <div className="flex items-center gap-1 text-muted-foreground">
                  <MessageSquare className="w-3 h-3" />
                  <span className="text-xs">{task.comments}</span>
                </div>
              )}
              {task.attachments > 0 && (
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Paperclip className="w-3 h-3" />
                  <span className="text-xs">{task.attachments}</span>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
            <div className="flex items-center gap-1">
              <Avatar className="w-6 h-6">
                <AvatarImage src={task.assigneeAvatar} />
                <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                  {task.assignee ? task.assignee.split(' ').map(n => n[0]).join('') : <User className="w-3 h-3" />}
                </AvatarFallback>
              </Avatar>
              {task.assignee && (
                <span className="text-xs text-muted-foreground">{task.assignee.split(' ')[0]}</span>
              )}
            </div>

            {task.dueDate && (
              <div className="flex items-center gap-1 text-muted-foreground">
                <Calendar className="w-3 h-3" />
                <span className="text-xs">{task.dueDate}</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  const DroppableColumn = ({ column }: { column: Column }) => {
    const {
      setNodeRef,
      isOver,
    } = useSortable({ id: column.id });

    return (
      <div ref={setNodeRef} className="flex flex-col">
        <div className={`border-t-4 ${column.color} bg-muted/10 rounded-t-lg p-4`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-foreground flex items-center gap-2">
              {column.title}
              <Badge variant="secondary" className="text-xs">
                {column.tasks.length}
              </Badge>
            </h3>
            <Button 
              variant="ghost" 
              size="sm" 
              className="w-6 h-6 p-0 hover-scale"
              onClick={() => openCreateDialog(column.id)}
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div 
          className={`bg-muted/5 border border-t-0 border-border rounded-b-lg p-4 min-h-[600px] transition-colors ${
            isOver ? 'bg-primary/5 border-primary' : ''
          }`}
        >
          <SortableContext items={column.tasks.map(task => task.id)} strategy={verticalListSortingStrategy}>
            {column.tasks.map((task) => (
              <SortableTask key={task.id} task={task} />
            ))}
          </SortableContext>

          {/* Add task placeholder */}
          <Button 
            variant="ghost" 
            className="w-full h-12 border-2 border-dashed border-border hover:border-primary hover:bg-primary/5 text-muted-foreground hover:text-primary transition-all duration-200 animate-fade-in"
            onClick={() => openCreateDialog(column.id)}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add a task
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Project Board</h1>
          <p className="text-muted-foreground mt-1">Manage your tasks with drag & drop</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">
            Filter & Sort
          </Button>
          <Button 
            className="bg-gradient-primary hover:bg-primary-dark hover-scale"
            onClick={() => openCreateDialog('todo')}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Task
          </Button>
        </div>
      </div>

      {/* Kanban Board */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 h-fit">
          <SortableContext items={columns.map(col => col.id)} strategy={verticalListSortingStrategy}>
            {columns.map((column) => (
              <DroppableColumn key={column.id} column={column} />
            ))}
          </SortableContext>
        </div>

        <DragOverlay>
          {activeTask ? (
            <Card className="bg-card shadow-custom-lg opacity-90 rotate-3 scale-105">
              <CardContent className="p-4">
                <h4 className="font-medium text-sm text-foreground">
                  {activeTask.title}
                </h4>
                <div className="flex items-center gap-2 mt-2">
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${getPriorityColor(activeTask.priority)}`}>
                    {activeTask.priority.charAt(0).toUpperCase() + activeTask.priority.slice(1)}
                  </span>
                </div>
              </CardContent>
            </Card>
          ) : null}
        </DragOverlay>
      </DndContext>

      {/* Task Form Dialog */}
      <TaskFormDialog
        open={taskDialogOpen}
        onOpenChange={setTaskDialogOpen}
        task={editingTask}
        onSubmit={dialogMode === 'create' ? handleCreateTask : handleEditTask}
        mode={dialogMode}
        defaultStatus={selectedColumn}
      />

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        open={confirmDialogOpen}
        onOpenChange={setConfirmDialogOpen}
        title="Delete Task"
        description={`Are you sure you want to delete "${deletingTask?.title}"? This action cannot be undone.`}
        confirmText="Delete"
        onConfirm={handleDeleteTask}
        variant="destructive"
      />
    </div>
  );
}