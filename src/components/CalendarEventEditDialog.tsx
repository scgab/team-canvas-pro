import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { calendarService } from "@/services/database";
import { Trash2 } from "lucide-react";

interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  date: Date;
  time?: string;
  type: "meeting" | "deadline" | "milestone" | "reminder";
  location?: string;
  assigned_members?: string[];
  attendees?: string[];
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
    time: string;
    type: "meeting" | "deadline" | "milestone" | "reminder";
    location: string;
    assigned_members: string[];
  }>({
    title: '',
    description: '',
    date: '',
    time: '',
    type: 'meeting',
    location: '',
    assigned_members: []
  });

  useEffect(() => {
    if (event) {
      setFormData({
        title: event.title || '',
        description: event.description || '',
        date: event.date.toISOString().split('T')[0],
        time: event.time || '',
        type: event.type || 'meeting',
        location: event.location || '',
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
      await calendarService.update(event.id, {
        title: formData.title,
        description: formData.description,
        date: formData.date,
        time: formData.time || null,
        type: formData.type,
        location: formData.location,
        assigned_members: formData.assigned_members,
        attendees: formData.assigned_members // Keep attendees in sync with assigned members
      });

      toast({
        title: "Event Updated",
        description: `"${formData.title}" has been updated.`,
      });

      await onSubmit(formData);
      onClose();
    } catch (error) {
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
        await calendarService.delete(event.id);
        
        toast({
          title: "Event Deleted",
          description: "The event has been removed from the calendar.",
        });

        await onDelete();
        onClose();
      } catch (error) {
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
              <Label htmlFor="event-time">Time</Label>
              <Input
                id="event-time"
                type="time"
                value={formData.time}
                onChange={(e) => setFormData(prev => ({ ...prev, time: e.target.value }))}
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
                <SelectItem value="deadline">Deadline</SelectItem>
                <SelectItem value="milestone">Milestone</SelectItem>
                <SelectItem value="reminder">Reminder</SelectItem>
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