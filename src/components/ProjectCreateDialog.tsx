import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Calendar as CalendarIcon } from "lucide-react";

interface ProjectCreateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onProjectCreated?: () => void;
}

export function ProjectCreateDialog({ open, onOpenChange, onProjectCreated }: ProjectCreateDialogProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [newProject, setNewProject] = useState({
    title: "",
    description: "",
    priority: "medium" as const,
    deadline: new Date()
  });

  const handleCreateProject = async () => {
    if (!newProject.title.trim()) {
      toast({
        title: "Error",
        description: "Please enter a project title.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    try {
      // Simulate project creation
      await new Promise(resolve => setTimeout(resolve, 1000));

      toast({
        title: "Project Created",
        description: `${newProject.title} has been created successfully.`,
      });

      // Reset form
      setNewProject({
        title: "",
        description: "",
        priority: "medium",
        deadline: new Date()
      });

      onProjectCreated?.();
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create project. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Create New Project</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="project-title">Project Title *</Label>
            <Input
              id="project-title"
              value={newProject.title}
              onChange={(e) => setNewProject(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Enter project title"
              disabled={isLoading}
            />
          </div>
          <div>
            <Label htmlFor="project-description">Description</Label>
            <Textarea
              id="project-description"
              value={newProject.description}
              onChange={(e) => setNewProject(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Project description"
              rows={3}
              disabled={isLoading}
            />
          </div>
          <div>
            <Label>Deadline</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn("w-full justify-start text-left font-normal", !newProject.deadline && "text-muted-foreground")}
                  disabled={isLoading}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {newProject.deadline ? format(newProject.deadline, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <CalendarComponent
                  mode="single"
                  selected={newProject.deadline}
                  onSelect={(date) => date && setNewProject(prev => ({ ...prev, deadline: date }))}
                  initialFocus
                  className={cn("p-3 pointer-events-auto")}
                />
              </PopoverContent>
            </Popover>
          </div>
          <div>
            <Label htmlFor="priority">Priority</Label>
            <Select 
              value={newProject.priority} 
              onValueChange={(value: any) => setNewProject(prev => ({ ...prev, priority: value }))}
              disabled={isLoading}
            >
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
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
              Cancel
            </Button>
            <Button onClick={handleCreateProject} disabled={isLoading}>
              {isLoading ? "Creating..." : "Create Project"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}