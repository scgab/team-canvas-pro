import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Plus, 
  MoreHorizontal, 
  Calendar, 
  MessageSquare, 
  Paperclip,
  User
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Task {
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
}

interface Column {
  id: string;
  title: string;
  tasks: Task[];
  color: string;
}

export function KanbanBoard() {
  const [columns, setColumns] = useState<Column[]>([
    {
      id: "todo",
      title: "To Do",
      color: "border-muted",
      tasks: [
        {
          id: "1",
          title: "Design user authentication flow",
          description: "Create wireframes and mockups for login/register",
          priority: "high",
          assignee: "Sarah Chen",
          assigneeAvatar: "",
          dueDate: "Dec 15",
          comments: 3,
          attachments: 2,
          tags: ["Design", "UX"]
        },
        {
          id: "2",
          title: "Database schema design",
          priority: "medium",
          assignee: "Mike Johnson",
          dueDate: "Dec 18",
          comments: 1,
          attachments: 0,
          tags: ["Backend", "Database"]
        }
      ]
    },
    {
      id: "inprogress",
      title: "In Progress",
      color: "border-warning",
      tasks: [
        {
          id: "3",
          title: "Implement responsive navigation",
          description: "Build mobile-first navigation component",
          priority: "medium",
          assignee: "Alex Rivera",
          dueDate: "Dec 12",
          comments: 5,
          attachments: 1,
          tags: ["Frontend", "Mobile"]
        }
      ]
    },
    {
      id: "review",
      title: "Review",
      color: "border-primary",
      tasks: [
        {
          id: "4",
          title: "API endpoint documentation",
          priority: "low",
          assignee: "Emma Davis",
          dueDate: "Dec 10",
          comments: 2,
          attachments: 3,
          tags: ["Documentation", "API"]
        }
      ]
    },
    {
      id: "done",
      title: "Done",
      color: "border-success",
      tasks: [
        {
          id: "5",
          title: "Project setup and configuration",
          priority: "high",
          assignee: "David Kim",
          comments: 0,
          attachments: 1,
          tags: ["Setup", "DevOps"]
        }
      ]
    }
  ]);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent": return "bg-priority-urgent text-white";
      case "high": return "bg-priority-high text-white";
      case "medium": return "bg-priority-medium text-white";
      case "low": return "bg-priority-low text-white";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const TaskCard = ({ task }: { task: Task }) => (
    <Card className="mb-3 bg-card hover:shadow-custom-md transition-shadow cursor-pointer group">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h4 className="font-medium text-sm text-foreground group-hover:text-primary transition-colors">
            {task.title}
          </h4>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="w-6 h-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Edit Task</DropdownMenuItem>
              <DropdownMenuItem>Duplicate</DropdownMenuItem>
              <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
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

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Project Board</h1>
          <p className="text-muted-foreground mt-1">Mobile App Redesign • 5 members</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">
            Filter & Sort
          </Button>
          <Button className="bg-gradient-primary hover:bg-primary-dark">
            <Plus className="w-4 h-4 mr-2" />
            Add Task
          </Button>
        </div>
      </div>

      {/* Kanban Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 h-fit">
        {columns.map((column) => (
          <div key={column.id} className="flex flex-col">
            <div className={`border-t-4 ${column.color} bg-muted/10 rounded-t-lg p-4`}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-foreground flex items-center gap-2">
                  {column.title}
                  <Badge variant="secondary" className="text-xs">
                    {column.tasks.length}
                  </Badge>
                </h3>
                <Button variant="ghost" size="sm" className="w-6 h-6 p-0">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="bg-muted/5 border border-t-0 border-border rounded-b-lg p-4 min-h-[600px]">
              {column.tasks.map((task) => (
                <TaskCard key={task.id} task={task} />
              ))}

              {/* Add task placeholder */}
              <Button 
                variant="ghost" 
                className="w-full h-12 border-2 border-dashed border-border hover:border-primary hover:bg-primary/5 text-muted-foreground hover:text-primary transition-colors"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add a task
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}