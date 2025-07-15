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

interface TaskCreateModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TaskCreateModal({ open, onOpenChange }: TaskCreateModalProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    priority: "medium" as const,
    dueDate: new Date(),
    assignee: ""
  });

  const handleCreateTask = async () => {
    if (!newTask.title.trim()) {
      toast({
        title: "Error",
        description: "Please enter a task title.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast({
        title: "Task Created",
        description: `${newTask.title} has been created successfully.`,
      });
      setNewTask({ title: "", description: "", priority: "medium", dueDate: new Date(), assignee: "" });
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create task. Please try again.",
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
          <DialogTitle>Create New Task</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="task-title">Task Title *</Label>
            <Input
              id="task-title"
              value={newTask.title}
              onChange={(e) => setNewTask(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Enter task title"
              disabled={isLoading}
            />
          </div>
          <div>
            <Label htmlFor="task-description">Description</Label>
            <Textarea
              id="task-description"
              value={newTask.description}
              onChange={(e) => setNewTask(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Task description"
              rows={3}
              disabled={isLoading}
            />
          </div>
          <div>
            <Label>Due Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn("w-full justify-start text-left font-normal", !newTask.dueDate && "text-muted-foreground")}
                  disabled={isLoading}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {newTask.dueDate ? format(newTask.dueDate, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <CalendarComponent
                  mode="single"
                  selected={newTask.dueDate}
                  onSelect={(date) => date && setNewTask(prev => ({ ...prev, dueDate: date }))}
                  initialFocus
                  className={cn("p-3 pointer-events-auto")}
                />
              </PopoverContent>
            </Popover>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="priority">Priority</Label>
              <Select 
                value={newTask.priority} 
                onValueChange={(value: any) => setNewTask(prev => ({ ...prev, priority: value }))}
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
            <div>
              <Label htmlFor="assignee">Assignee</Label>
              <Input
                id="assignee"
                value={newTask.assignee}
                onChange={(e) => setNewTask(prev => ({ ...prev, assignee: e.target.value }))}
                placeholder="Assign to"
                disabled={isLoading}
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
              Cancel
            </Button>
            <Button onClick={handleCreateTask} disabled={isLoading}>
              {isLoading ? "Creating..." : "Create Task"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

interface MeetingScheduleModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function MeetingScheduleModal({ open, onOpenChange }: MeetingScheduleModalProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [newMeeting, setNewMeeting] = useState({
    title: "",
    description: "",
    date: new Date(),
    time: "",
    duration: "60",
    attendees: "",
    location: ""
  });

  const handleScheduleMeeting = async () => {
    if (!newMeeting.title.trim()) {
      toast({
        title: "Error",
        description: "Please enter a meeting title.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast({
        title: "Meeting Scheduled",
        description: `${newMeeting.title} has been scheduled successfully.`,
      });
      setNewMeeting({ title: "", description: "", date: new Date(), time: "", duration: "60", attendees: "", location: "" });
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to schedule meeting. Please try again.",
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
          <DialogTitle>Schedule Meeting</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="meeting-title">Meeting Title *</Label>
            <Input
              id="meeting-title"
              value={newMeeting.title}
              onChange={(e) => setNewMeeting(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Enter meeting title"
              disabled={isLoading}
            />
          </div>
          <div>
            <Label htmlFor="meeting-description">Description</Label>
            <Textarea
              id="meeting-description"
              value={newMeeting.description}
              onChange={(e) => setNewMeeting(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Meeting description"
              rows={3}
              disabled={isLoading}
            />
          </div>
          <div>
            <Label>Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn("w-full justify-start text-left font-normal", !newMeeting.date && "text-muted-foreground")}
                  disabled={isLoading}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {newMeeting.date ? format(newMeeting.date, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <CalendarComponent
                  mode="single"
                  selected={newMeeting.date}
                  onSelect={(date) => date && setNewMeeting(prev => ({ ...prev, date }))}
                  initialFocus
                  className={cn("p-3 pointer-events-auto")}
                />
              </PopoverContent>
            </Popover>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="time">Time</Label>
              <Input
                id="time"
                type="time"
                value={newMeeting.time}
                onChange={(e) => setNewMeeting(prev => ({ ...prev, time: e.target.value }))}
                disabled={isLoading}
              />
            </div>
            <div>
              <Label htmlFor="duration">Duration (minutes)</Label>
              <Input
                id="duration"
                value={newMeeting.duration}
                onChange={(e) => setNewMeeting(prev => ({ ...prev, duration: e.target.value }))}
                placeholder="60"
                disabled={isLoading}
              />
            </div>
          </div>
          <div>
            <Label htmlFor="attendees">Attendees</Label>
            <Input
              id="attendees"
              value={newMeeting.attendees}
              onChange={(e) => setNewMeeting(prev => ({ ...prev, attendees: e.target.value }))}
              placeholder="Comma separated emails"
              disabled={isLoading}
            />
          </div>
          <div>
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={newMeeting.location}
              onChange={(e) => setNewMeeting(prev => ({ ...prev, location: e.target.value }))}
              placeholder="Meeting location or URL"
              disabled={isLoading}
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
              Cancel
            </Button>
            <Button onClick={handleScheduleMeeting} disabled={isLoading}>
              {isLoading ? "Scheduling..." : "Schedule Meeting"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

interface TeamMemberModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TeamMemberModal({ open, onOpenChange }: TeamMemberModalProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [newMember, setNewMember] = useState({
    name: "",
    email: "",
    role: "member" as const,
    department: ""
  });

  const handleAddMember = async () => {
    if (!newMember.name.trim() || !newMember.email.trim()) {
      toast({
        title: "Error",
        description: "Please enter name and email.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast({
        title: "Team Member Added",
        description: `${newMember.name} has been added to the team.`,
      });
      setNewMember({ name: "", email: "", role: "member", department: "" });
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add team member. Please try again.",
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
          <DialogTitle>Add Team Member</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="member-name">Name *</Label>
            <Input
              id="member-name"
              value={newMember.name}
              onChange={(e) => setNewMember(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Enter member name"
              disabled={isLoading}
            />
          </div>
          <div>
            <Label htmlFor="member-email">Email *</Label>
            <Input
              id="member-email"
              type="email"
              value={newMember.email}
              onChange={(e) => setNewMember(prev => ({ ...prev, email: e.target.value }))}
              placeholder="Enter email address"
              disabled={isLoading}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="role">Role</Label>
              <Select 
                value={newMember.role} 
                onValueChange={(value: any) => setNewMember(prev => ({ ...prev, role: value }))}
                disabled={isLoading}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="member">Member</SelectItem>
                  <SelectItem value="lead">Team Lead</SelectItem>
                  <SelectItem value="manager">Manager</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="department">Department</Label>
              <Input
                id="department"
                value={newMember.department}
                onChange={(e) => setNewMember(prev => ({ ...prev, department: e.target.value }))}
                placeholder="e.g., Engineering"
                disabled={isLoading}
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
              Cancel
            </Button>
            <Button onClick={handleAddMember} disabled={isLoading}>
              {isLoading ? "Adding..." : "Add Member"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

interface ReportModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ReportModal({ open, onOpenChange }: ReportModalProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [reportType, setReportType] = useState("project-summary");

  const handleGenerateReport = async () => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast({
        title: "Report Generated",
        description: "Your report has been generated and will be available shortly.",
      });
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate report. Please try again.",
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
          <DialogTitle>Generate Report</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="report-type">Report Type</Label>
            <Select 
              value={reportType} 
              onValueChange={setReportType}
              disabled={isLoading}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="project-summary">Project Summary</SelectItem>
                <SelectItem value="task-completion">Task Completion</SelectItem>
                <SelectItem value="team-performance">Team Performance</SelectItem>
                <SelectItem value="timeline-analysis">Timeline Analysis</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="text-sm text-muted-foreground">
            This report will include data from the last 30 days and will be sent to your email.
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
              Cancel
            </Button>
            <Button onClick={handleGenerateReport} disabled={isLoading}>
              {isLoading ? "Generating..." : "Generate Report"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}