import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { Trash2 } from "lucide-react";

interface CalendarEvent {
  id: string | number;
  title: string;
  description?: string;
  date: Date | string | { value?: { iso?: string; value?: number } };
  start_time?: string;
  end_time?: string;
  time?: string;
  type: "meeting" | "deadline" | "milestone" | "reminder";
  location?: string;
  assigned_members?: string[];
  attendees?: string[];
  priority?: string;
}

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onClose: () => void;
  event: CalendarEvent | null;
  onSubmit: (eventData: any) => Promise<void>;
  onDelete: () => Promise<void>;
  teamMembers: { email: string; name: string; }[];
}

const teamMembers = [
  { email: 'hna@scandac.com', name: 'HNA User' },
  { email: 'myh@scandac.com', name: 'MYH User' }
];

export function CalendarEventEditDialog({ open, onOpenChange, onClose, event, onSubmit, onDelete, teamMembers }: Props) {
  const { toast } = useToast();
  const [formData, setFormData] = useState<{
    title: string;
    description: string;
    date: string;
    start_time: string;
    end_time: string;
    type: "meeting" | "deadline" | "milestone" | "reminder";
    location: string;
    priority: string;
    assigned_members: string[];
  }>({
    title: '',
    description: '',
    date: '',
    start_time: '',
    end_time: '',
    type: 'meeting',
    location: '',
    priority: 'medium',
    assigned_members: []
  });

  useEffect(() => {
    if (event) {
      console.log('Editing event:', event);
      
      // Handle both Date objects and string dates
      let dateStr = '';
      if (event.date instanceof Date) {
        dateStr = event.date.toISOString().split('T')[0];
      } else if (typeof event.date === 'string') {
        dateStr = event.date;
      } else if (event.date && typeof event.date === 'object' && 'value' in event.date && event.date.value) {
        // Handle complex date objects
        const dateValue = event.date.value;
        if (dateValue.iso) {
          dateStr = new Date(dateValue.iso).toISOString().split('T')[0];
        } else if (dateValue.value) {
          dateStr = new Date(dateValue.value).toISOString().split('T')[0];
        }
      }
      
      setFormData({
        title: event.title || '',
        description: event.description || '',
        date: dateStr,
        start_time: event.start_time || event.time || '',
        end_time: event.end_time || '',
        type: event.type || 'meeting',
        location: event.location || '',
        priority: event.priority || 'medium',
        assigned_members: event.assigned_members || []
      });
    }
  }, [event]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      toast({
        title: "Error",
        description: "Please enter an event title.",
        variant: "destructive"
      });
      return;
    }

    if (!event) return;

    try {
      // Pass the form data directly to the parent's onSubmit function
      // The parent (Calendar component) will handle the local state update
      await onSubmit({
        title: formData.title,
        description: formData.description,
        date: formData.date,
        start_time: formData.start_time,
        end_time: formData.end_time,
        type: formData.type,
        location: formData.location,
        priority: formData.priority,
        assigned_members: formData.assigned_members,
        attendees: formData.assigned_members // Keep attendees in sync with assigned members
      });

      onClose();
    } catch (error) {
      console.error('Error in handleSubmit:', error);
      toast({
        title: "Error",
        description: "Failed to update event. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleDelete = async () => {
    if (!event) return;

    if (confirm('Are you sure you want to delete this event?')) {
      try {
        // Call the parent's onDelete function which handles local state update
        await onDelete();
        onClose();
      } catch (error) {
        console.error('Error in handleDelete:', error);
        toast({
          title: "Error",
          description: "Failed to delete event. Please try again.",
          variant: "destructive"
        });
      }
    }
  };

  const handleMemberToggle = (memberEmail: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      assigned_members: checked
        ? [...prev.assigned_members, memberEmail]
        : prev.assigned_members.filter(email => email !== memberEmail)
    }));
  };

  if (!event) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>Edit Event</DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDelete}
              className="text-destructive hover:text-destructive"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="event-title">Event Title *</Label>
            <Input
              id="event-title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Enter event title"
              required
            />
          </div>

          <div>
            <Label htmlFor="event-description">Description</Label>
            <Textarea
              id="event-description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Event description"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="event-date">Date *</Label>
              <Input
                id="event-date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                required
              />
            </div>
            <div>
              <Label htmlFor="event-priority">Priority</Label>
              <Select value={formData.priority} onValueChange={(value: any) => setFormData(prev => ({ ...prev, priority: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="event-start-time">Start Time</Label>
              <Input
                id="event-start-time"
                type="time"
                value={formData.start_time}
                onChange={(e) => setFormData(prev => ({ ...prev, start_time: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="event-end-time">End Time</Label>
              <Input
                id="event-end-time"
                type="time"
                value={formData.end_time}
                onChange={(e) => setFormData(prev => ({ ...prev, end_time: e.target.value }))}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="event-location">Location</Label>
            <Input
              id="event-location"
              value={formData.location}
              onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
              placeholder="Meeting room, Zoom link, etc."
            />
          </div>

          <div>
            <Label htmlFor="event-type">Event Type</Label>
            <Select value={formData.type} onValueChange={(value: any) => setFormData(prev => ({ ...prev, type: value }))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="meeting">Meeting</SelectItem>
                <SelectItem value="appointment">Appointment</SelectItem>
                <SelectItem value="deadline">Deadline</SelectItem>
                <SelectItem value="reminder">Reminder</SelectItem>
                <SelectItem value="event">Event</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Assign to Team Members</Label>
            <div className="space-y-2 mt-2">
              {teamMembers.map(member => (
                <div key={member.email} className="flex items-center space-x-2">
                  <Checkbox
                    id={member.email}
                    checked={formData.assigned_members.includes(member.email)}
                    onCheckedChange={(checked) => handleMemberToggle(member.email, !!checked)}
                  />
                  <Label htmlFor={member.email} className="text-sm font-normal">
                    {member.name} ({member.email})
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">
              Update Event
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}