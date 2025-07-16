import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { useSharedData } from "@/contexts/SharedDataContext";
import { getUsers } from "@/utils/userDatabase";
import { useUserColors } from "@/components/UserColorContext";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Calendar as CalendarIcon, Users } from "lucide-react";

interface ProjectCreateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onProjectCreated?: () => void;
}

export function ProjectCreateDialog({ open, onOpenChange, onProjectCreated }: ProjectCreateDialogProps) {
  const { toast } = useToast();
  const { createProject } = useSharedData();
  const { getColorByEmail } = useUserColors();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTeamMembers, setSelectedTeamMembers] = useState<string[]>([]);
  const [newProject, setNewProject] = useState({
    title: "",
    description: "",
    priority: "medium" as const,
    deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // Default to 30 days from now
  });

  const teamMembers = getUsers();

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
      console.log('Creating project with data:', newProject);
      
      createProject({
        title: newProject.title,
        description: newProject.description,
        priority: newProject.priority,
        status: 'planning',
        deadline: newProject.deadline,
        assignedMembers: selectedTeamMembers
      });

      console.log('Project created successfully');

      toast({
        title: "Success!",
        description: `${newProject.title} has been created successfully.`,
      });

      // Reset form
      setSelectedTeamMembers([]);
      setNewProject({
        title: "",
        description: "",
        priority: "medium",
        deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      });

      onProjectCreated?.();
      onOpenChange(false);
    } catch (error) {
      console.error('Error creating project:', error);
      toast({
        title: "Error",
        description: "Failed to create project. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleTeamMember = (memberId: string) => {
    setSelectedTeamMembers(prev => 
      prev.includes(memberId) 
        ? prev.filter(id => id !== memberId)
        : [...prev, memberId]
    );
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
          
          {/* Team Members Assignment */}
          <div>
            <Label className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Assign Team Members
            </Label>
            <div className="mt-2 space-y-2 max-h-32 overflow-y-auto border rounded-md p-2">
              {teamMembers.map(member => {
                const isSelected = selectedTeamMembers.includes(member.id);
                const memberColor = getColorByEmail(member.email);
                
                return (
                  <div
                    key={member.id}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 cursor-pointer"
                    onClick={() => toggleTeamMember(member.id)}
                  >
                    <Checkbox 
                      checked={isSelected}
                      onChange={() => toggleTeamMember(member.id)}
                      disabled={isLoading}
                    />
                    <Avatar className="w-6 h-6">
                      <AvatarFallback 
                        className="text-white text-xs"
                        style={{ backgroundColor: memberColor.primary }}
                      >
                        {member.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="font-medium text-sm">{member.name}</div>
                      <div className="text-xs text-muted-foreground">{member.email}</div>
                    </div>
                  </div>
                );
              })}
            </div>
            {selectedTeamMembers.length > 0 && (
              <p className="text-xs text-muted-foreground mt-1">
                {selectedTeamMembers.length} member(s) selected
              </p>
            )}
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