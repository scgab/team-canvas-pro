import { useState, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { useSharedData } from "@/contexts/SharedDataContext";
import { CalendarEventEditDialog } from "@/components/CalendarEventEditDialog";
import { EventNotificationButton } from "@/components/EventNotificationButton";
import { usePersistedState } from "@/hooks/useDataPersistence";
import { WorkflowTriggerService } from "@/services/workflowTrigger";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Clock,
  Users,
  MapPin,
  User,
  Target,
  Briefcase
} from "lucide-react";

interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  date: Date;
  time: string;
  duration: string;
  type: "meeting" | "deadline" | "milestone" | "reminder";
  attendees?: string[];
  location?: string;
  color: string;
  isProjectDeadline?: boolean;
  projectId?: string;
}

interface PublicHoliday {
  date: Date;
  name: string;
  country: string;
}

const Calendar = () => {
  const { toast } = useToast();
  const { projects, events: teamEvents, updateCalendarEvent, deleteCalendarEvent } = useSharedData();
  const { user } = useAuth();
  const [events, setEvents] = usePersistedState<any[]>('calendar-events', []);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isAddEventOpen, setIsAddEventOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<any>(null);
  const [createMeeting, setCreateMeeting] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: "",
    description: "",
    date: new Date(),
    start_time: "",
    end_time: "",
    type: "meeting" as const,
    priority: "medium" as const,
    attendees: [] as string[],
    location: ""
  });

  const teamMembers = [
    { email: 'hna@scandac.com', name: 'HNA User' },
    { email: 'myh@scandac.com', name: 'MYH User' }
  ];

  useEffect(() => {
    // Only load defaults if no events exist in localStorage
    if (events.length === 0) {
      loadDefaultEvents();
    }
  }, []);

  const loadDefaultEvents = () => {
    const defaultEvents = [
      {
        id: 1,
        title: 'Team Standup',
        description: 'Daily team synchronization meeting',
        date: new Date().toISOString().split('T')[0],
        start_time: '09:00',
        end_time: '09:30',
        type: 'meeting',
        priority: 'high',
        attendees: ['hna@scandac.com', 'myh@scandac.com'],
        created_by: 'hna@scandac.com'
      },
      {
        id: 2,
        title: 'Project Review',
        description: 'Review current project progress',
        date: new Date(Date.now() + 86400000).toISOString().split('T')[0], // Tomorrow
        start_time: '14:00',
        end_time: '15:00',
        type: 'meeting',
        priority: 'medium',
        attendees: ['hna@scandac.com', 'myh@scandac.com'],
        created_by: 'myh@scandac.com'
      }
    ];
    
    setEvents(defaultEvents);
  };

  // Public holidays for Denmark, Sweden, UK, and USA (2024-2025)
  const publicHolidays: PublicHoliday[] = [
    // Denmark
    { date: new Date(2024, 11, 24), name: "Christmas Eve", country: "DK" },
    { date: new Date(2024, 11, 25), name: "Christmas Day", country: "DK" },
    { date: new Date(2024, 11, 26), name: "Second Day of Christmas", country: "DK" },
    { date: new Date(2024, 11, 31), name: "New Year's Eve", country: "DK" },
    { date: new Date(2025, 0, 1), name: "New Year's Day", country: "DK" },
    
    // Sweden
    { date: new Date(2024, 11, 24), name: "Christmas Eve", country: "SE" },
    { date: new Date(2024, 11, 25), name: "Christmas Day", country: "SE" },
    { date: new Date(2024, 11, 26), name: "Boxing Day", country: "SE" },
    { date: new Date(2025, 0, 1), name: "New Year's Day", country: "SE" },
    { date: new Date(2025, 0, 6), name: "Epiphany", country: "SE" },
    
    // UK
    { date: new Date(2024, 11, 25), name: "Christmas Day", country: "UK" },
    { date: new Date(2024, 11, 26), name: "Boxing Day", country: "UK" },
    { date: new Date(2025, 0, 1), name: "New Year's Day", country: "UK" },
    
    // USA
    { date: new Date(2024, 11, 25), name: "Christmas Day", country: "US" },
    { date: new Date(2025, 0, 1), name: "New Year's Day", country: "US" },
    { date: new Date(2025, 0, 20), name: "Martin Luther King Jr. Day", country: "US" },
    { date: new Date(2025, 1, 17), name: "Presidents' Day", country: "US" }
  ];

  // Calendar navigation
  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const goToToday = () => {
    const today = new Date();
    setCurrentDate(today);
    setSelectedDate(today);
  };

  // Add new event
  const handleAddEvent = async () => {
    // Validation
    if (!newEvent.title.trim()) {
      toast({
        title: "Error",
        description: "Please enter an event title.",
        variant: "destructive"
      });
      return;
    }

    if (!newEvent.start_time) {
      toast({
        title: "Error",
        description: "Please select a start time.",
        variant: "destructive"
      });
      return;
    }

    if (!newEvent.end_time) {
      toast({
        title: "Error",
        description: "Please select an end time.",
        variant: "destructive"
      });
      return;
    }

    // Validate time order
    if (newEvent.start_time >= newEvent.end_time) {
      toast({
        title: "Error",
        description: "End time must be after start time.",
        variant: "destructive"
      });
      return;
    }

    try {
      // Format date properly to avoid timezone issues
      const eventDate = newEvent.date instanceof Date 
        ? `${newEvent.date.getFullYear()}-${String(newEvent.date.getMonth() + 1).padStart(2, '0')}-${String(newEvent.date.getDate()).padStart(2, '0')}`
        : newEvent.date;
      
      // Create new event object
      const eventToAdd = {
        id: Date.now(),
        title: newEvent.title.trim(),
        description: newEvent.description.trim(),
        date: eventDate,
        start_time: newEvent.start_time,
        end_time: newEvent.end_time,
        type: newEvent.type,
        priority: newEvent.priority,
        attendees: newEvent.attendees,
        created_by: localStorage.getItem('currentUser') || 'user',
        created_at: new Date().toISOString()
      };

      // Add to events list (persisted via usePersistedState)
      setEvents(prev => [...prev, eventToAdd]);

      // If meeting checkbox is checked, also create in meetings database
      if (createMeeting && user) {
        try {
          // First check if user is part of any team
          const { data: teamMember, error: teamError } = await supabase
            .from('team_members')
            .select('team_id')
            .eq('email', user.email)
            .limit(1)
            .maybeSingle();

          if (teamError) {
            console.error('Error checking team membership:', teamError);
            throw new Error('Unable to verify team membership');
          }

          if (!teamMember) {
            toast({
              title: "Note",
              description: "Event created in calendar only. Join a team to sync meetings.",
              variant: "default"
            });
          } else {
            const meetingData = {
              title: newEvent.title.trim(),
              description: newEvent.description?.trim() || '',
              date: eventDate,
              time: newEvent.start_time,
              end_time: newEvent.end_time,
              type: 'meeting',
              location: newEvent.location || '',
              attendees: newEvent.attendees || [],
              assigned_members: newEvent.attendees || [],
              agenda: [],
              meeting_status: 'planned',
              created_by: user.id,
              team_id: teamMember.team_id
            };

            const { error } = await supabase
              .from('calendar_events')
              .insert([meetingData]);

            if (error) {
              console.error('Error creating meeting:', error);
              toast({
                title: "Partial Success",
                description: "Event created but failed to sync to meetings.",
                variant: "destructive"
              });
            } else {
              // Trigger N8N webhook via Supabase Edge Function (server-side)
              try {
                const { data: webhookResult, error: webhookError } = await supabase.functions.invoke('forward-n8n-meeting', {
                  body: {
                    title: meetingData.title,
                    date: meetingData.date,
                    time: meetingData.time,
                    attendees: meetingData.attendees,
                    createdBy: meetingData.created_by,
                    source: 'calendar',
                    timestamp: new Date().toISOString()
                  }
                });
                if (webhookError) {
                  console.error('Failed to trigger N8N webhook via edge function:', webhookError);
                } else {
                  console.log('N8N webhook triggered for calendar meeting via edge function:', webhookResult);
                }
              } catch (webhookError) {
                console.error('Failed to trigger N8N webhook:', webhookError);
              }
              
              toast({
                title: "Success",
                description: "Event created and sent to N8N webhook!",
              });
            }
          }
        } catch (error) {
          console.error('Error creating team meeting:', error);
          toast({
            title: "Partial Success",
            description: "Event created in calendar but failed to sync to meetings.",
            variant: "destructive"
          });
        }
      } else {
        toast({
          title: "Event Created",
          description: `${newEvent.title} has been added to your calendar.`,
        });
      }
      
      // Reset form
      setNewEvent({
        title: "",
        description: "",
        date: new Date(),
        start_time: "",
        end_time: "",
        type: "meeting",
        priority: "medium",
        attendees: [],
        location: ""
      });
      setCreateMeeting(false);
      
      // Close modal
      setIsAddEventOpen(false);
      
    } catch (error) {
      console.error('Error creating event:', error);
      toast({
        title: "Error",
        description: "Failed to create event. Please try again.",
        variant: "destructive"
      });
    }
  };

  // Get calendar grid with Monday start
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    
    // Adjust to start from Monday (0 = Monday, 6 = Sunday)
    let startingDayOfWeek = firstDay.getDay() - 1;
    if (startingDayOfWeek < 0) startingDayOfWeek = 6; // Handle Sunday

    const days = [];
    
    // Add empty cells for days before month starts
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };

  const days = getDaysInMonth(currentDate);
  const monthYear = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  // Get events for a specific date (including project deadlines and team meetings)
  const getEventsForDate = (date: Date) => {
    // Use local date string to avoid timezone issues
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const dateStr = `${year}-${month}-${day}`;
    
    // Local (persisted) events
    const userEvents = events.filter(event => event.date === dateStr).map(event => ({
      ...event,
      date: new Date(event.date + 'T00:00:00'), // Add time to avoid timezone offset
      color: "#3B82F6"
    }));

    // Team (Supabase) calendar events, including meetings
    const teamDayEvents = (teamEvents || [])
      .filter(e => e.date === dateStr)
      .map(e => ({
        id: e.id,
        title: e.title,
        description: e.description,
        date: new Date(e.date + 'T00:00:00'),
        time: (e as any).time || (e as any).start_time || '',
        duration: (e as any).end_time && ((e as any).time || (e as any).start_time)
          ? `${(e as any).time || (e as any).start_time}-${(e as any).end_time}`
          : '',
        type: e.type || 'meeting',
        attendees: e.attendees || [],
        location: e.location || '',
        color: "#3B82F6",
        isSupabaseEvent: true
      }));

    // Add project deadlines as events
    const projectDeadlines = projects
      .filter(project => project.deadline && new Date(project.deadline).toDateString() === date.toDateString())
      .map(project => ({
        id: `project-${project.id}`,
        title: `${project.title} Deadline`,
        description: `Project deadline: ${project.title}`,
        date: new Date(project.deadline),
        time: "All day",
        duration: "All day",
        type: "deadline" as const,
        attendees: [],
        location: "",
        color: project.color || "#EF4444",
        isProjectDeadline: true,
        projectId: project.id
      }));

    return [...teamDayEvents, ...userEvents, ...projectDeadlines];
  };

  // Get holidays for a specific date
  const getHolidaysForDate = (date: Date) => {
    return publicHolidays.filter(holiday => 
      holiday.date.toDateString() === date.toDateString()
    );
  };

  // Check if date is today
  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  // Get upcoming events (next 30 days)
  const getUpcomingEvents = () => {
    const today = new Date();
    const in30Days = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);
    
    const upcomingUserEvents = events.filter(event => {
      const eventDate = new Date(event.date);
      return eventDate >= today && eventDate <= in30Days;
    });

    const upcomingTeamEvents = (teamEvents || [])
      .filter(e => {
        const d = new Date(e.date);
        return d >= today && d <= in30Days;
      })
      .map(e => ({
        id: e.id,
        title: e.title,
        description: e.description,
        date: new Date(e.date),
        time: (e as any).time || (e as any).start_time || '',
        duration: (e as any).end_time && ((e as any).time || (e as any).start_time)
          ? `${(e as any).time || (e as any).start_time}-${(e as any).end_time}`
          : '',
        type: e.type || 'meeting',
        attendees: e.attendees || [],
        location: e.location || '',
        color: "#3B82F6",
        isSupabaseEvent: true
      }));

    const upcomingProjectDeadlines = projects
      .filter(project => project.deadline && new Date(project.deadline) >= today && new Date(project.deadline) <= in30Days)
      .map(project => ({
        id: `project-${project.id}`,
        title: `${project.title} Deadline`,
        description: `Project deadline: ${project.title}`,
        date: new Date(project.deadline),
        time: "All day",
        duration: "All day",
        type: "deadline" as const,
        attendees: [],
        location: "",
        color: project.color || "#EF4444",
        isProjectDeadline: true,
        projectId: project.id
      }));

    return [...upcomingTeamEvents, ...upcomingUserEvents, ...upcomingProjectDeadlines]
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  };

  const openCreateEventModal = () => {
    const today = new Date();
    setNewEvent({
      title: "",
      description: "",
      date: today,
      start_time: "09:00",
      end_time: "10:00",
      type: "meeting",
      priority: "medium",
      attendees: [],
      location: ""
    });
    setIsAddEventOpen(true);
  };

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case "meeting": return "bg-primary";
      case "deadline": return "bg-destructive";
      case "milestone": return "bg-warning";
      case "reminder": return "bg-muted";
      default: return "bg-primary";
    }
  };

  const getEventTypeLabel = (type: string) => {
    switch (type) {
      case "meeting": return "Meeting";
      case "deadline": return "Deadline";
      case "milestone": return "Milestone";
      case "reminder": return "Reminder";
      default: return "Event";
    }
  };

  return (
    <Layout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Calendar</h1>
            <p className="text-muted-foreground mt-1">Manage your schedule and project milestones</p>
          </div>
          <div className="flex gap-2">
            <Dialog open={isAddEventOpen} onOpenChange={setIsAddEventOpen}>
              <DialogTrigger asChild>
                <Button onClick={openCreateEventModal} className="bg-gradient-primary hover:bg-primary-dark">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Event
                </Button>
              </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Create New Event</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="event-title">Event Title *</Label>
                  <Input
                    id="event-title"
                    value={newEvent.title}
                    onChange={(e) => setNewEvent(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Enter event title"
                  />
                </div>
                <div>
                  <Label htmlFor="event-description">Description</Label>
                  <Textarea
                    id="event-description"
                    value={newEvent.description}
                    onChange={(e) => setNewEvent(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Event description"
                    rows={3}
                  />
                </div>
                <div>
                  <Label>Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn("w-full justify-start text-left font-normal", !newEvent.date && "text-muted-foreground")}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {newEvent.date ? format(newEvent.date, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <CalendarComponent
                        mode="single"
                        selected={newEvent.date}
                        onSelect={(date) => {
                          if (date) {
                            setNewEvent(prev => ({ ...prev, date }));
                          }
                        }}
                        initialFocus
                        className={cn("p-3 pointer-events-auto")}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="event-start-time">Start Time *</Label>
                    <Input
                      id="event-start-time"
                      type="time"
                      value={newEvent.start_time}
                      onChange={(e) => setNewEvent(prev => ({ ...prev, start_time: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="event-end-time">End Time *</Label>
                    <Input
                      id="event-end-time"
                      type="time"
                      value={newEvent.end_time}
                      onChange={(e) => setNewEvent(prev => ({ ...prev, end_time: e.target.value }))}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="event-type">Type</Label>
                    <Select value={newEvent.type} onValueChange={(value: any) => setNewEvent(prev => ({ ...prev, type: value }))}>
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
                    <Label htmlFor="event-priority">Priority</Label>
                    <Select value={newEvent.priority} onValueChange={(value: any) => setNewEvent(prev => ({ ...prev, priority: value }))}>
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
                <div>
                  <Label htmlFor="event-location">Location</Label>
                  <Input
                    id="event-location"
                    value={newEvent.location}
                    onChange={(e) => setNewEvent(prev => ({ ...prev, location: e.target.value }))}
                    placeholder="Meeting location (optional)"
                  />
                </div>
                
                {/* Meeting Sync Checkbox */}
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="create-meeting" 
                    checked={createMeeting}
                    onCheckedChange={(checked) => setCreateMeeting(checked as boolean)}
                  />
                  <Label htmlFor="create-meeting" className="text-sm">
                    Also create as meeting (sync to Meetings page)
                  </Label>
                </div>
                
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsAddEventOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddEvent}>
                    Create Event
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          </div>
        </div>

        {/* Calendar Event Edit Dialog */}
        <CalendarEventEditDialog
          open={!!editingEvent}
          onOpenChange={(open) => !open && setEditingEvent(null)}
          onClose={() => setEditingEvent(null)}
          event={editingEvent}
          onSubmit={async (eventData) => {
            try {
              const previousStatus = editingEvent?.meeting_status;
              const newStatus = eventData.meeting_status;
              
              if (editingEvent?.isSupabaseEvent) {
                await updateCalendarEvent(editingEvent.id, eventData);
                
                // Check if meeting was just completed and trigger workflow
                const previousStatus = editingEvent?.meeting_status;
                const newStatus = eventData.meeting_status;
                if (editingEvent.type === 'meeting' && previousStatus !== 'completed' && newStatus === 'completed') {
                  try {
                    let teamId: string | null = null;

                    // Try to get team_id from membership
                    if (user?.email) {
                      const { data: teamMember } = await supabase
                        .from('team_members')
                        .select('team_id')
                        .eq('email', user.email)
                        .limit(1)
                        .maybeSingle();
                      teamId = teamMember?.team_id || null;
                    }

                    // Fallback: fetch event to get team_id
                    if (!teamId) {
                      const { data: eventRow } = await supabase
                        .from('calendar_events')
                        .select('team_id')
                        .eq('id', editingEvent.id)
                        .maybeSingle();
                      teamId = (eventRow as any)?.team_id || null;
                    }

                    if (teamId) {
                      console.log('Meeting completed, triggering workflow...');
                      await WorkflowTriggerService.triggerMeetingCompleted(
                        { ...editingEvent, ...eventData },
                        teamId
                      );
                      toast({
                        title: "Workflow Triggered",
                        description: "Meeting completion workflow has been started.",
                      });
                    } else {
                      console.warn('Could not determine team_id for workflow trigger');
                    }
                  } catch (workflowError) {
                    console.error('Error triggering workflow:', workflowError);
                  }
                }
              } else {
                setEvents(prev => prev.map(event => 
                  event.id === editingEvent.id 
                    ? { ...event, ...eventData }
                    : event
                ));
              }
              setEditingEvent(null);
              toast({
                title: "Event Updated",
                description: "Event has been updated successfully.",
              });
            } catch (error) {
              toast({
                title: "Error",
                description: "Failed to update event.",
                variant: "destructive"
              });
            }
          }}
          onDelete={async () => {
            try {
              if (editingEvent?.isSupabaseEvent) {
                await deleteCalendarEvent(editingEvent.id);
              } else {
                // Remove event from local state
                setEvents(prev => prev.filter(event => event.id !== editingEvent.id));
              }
              setEditingEvent(null);
              toast({
                title: "Event Deleted",
                description: "Event has been deleted successfully.",
              });
            } catch (error) {
              toast({
                title: "Error",
                description: "Failed to delete event.",
                variant: "destructive"
              });
            }
          }}
          teamMembers={teamMembers}
        />

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Calendar */}
          <Card className="lg:col-span-3 bg-gradient-card shadow-custom-card">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <CalendarIcon className="w-5 h-5" />
                  {monthYear}
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={goToToday}>
                    Today
                  </Button>
                  <div className="flex">
                    <Button variant="outline" size="sm" onClick={goToPreviousMonth}>
                      <ChevronLeft className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={goToNextMonth}>
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-1 mb-4">
                {/* Day headers - Monday start */}
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                  <div key={day} className="p-2 text-center text-sm font-medium text-muted-foreground">
                    {day}
                  </div>
                ))}
                
                {/* Calendar days */}
                {days.map((day, index) => {
                  if (!day) {
                    return <div key={index} className="p-2 h-24" />;
                  }
                  
                  const dayEvents = getEventsForDate(day);
                  const dayHolidays = getHolidaysForDate(day);
                  const isSelected = selectedDate?.toDateString() === day.toDateString();
                  const hasHoliday = dayHolidays.length > 0;
                  
                  return (
                    <div
                      key={index}
                      className={`relative p-2 h-24 border border-border rounded-lg cursor-pointer transition-colors hover:bg-muted/50 ${
                        isToday(day) ? 'bg-primary/10 border-primary' : ''
                      } ${isSelected ? 'bg-accent/20 border-accent' : ''} ${
                        hasHoliday ? 'bg-destructive/5 border-destructive/20' : ''
                      }`}
                      onClick={() => {
                        setSelectedDate(day);
                        // Open create event dialog with selected date
                        setNewEvent(prev => ({ ...prev, date: day }));
                        setIsAddEventOpen(true);
                      }}
                    >
                      <div className={`text-sm font-medium mb-1 ${isToday(day) ? 'text-primary' : hasHoliday ? 'text-destructive' : 'text-foreground'}`}>
                        {day.getDate()}
                        {/* Holiday marker dots */}
                        {hasHoliday && (
                          <div className="absolute top-1 right-1 flex gap-1">
                            {dayHolidays.slice(0, 3).map((_, i) => (
                              <div key={i} className="w-2 h-2 bg-destructive rounded-full" />
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="space-y-1">
                        {/* Show holidays first */}
                        {dayHolidays.slice(0, 1).map(holiday => (
                          <div
                            key={holiday.name}
                            className="text-xs p-1 rounded text-white bg-destructive truncate"
                            title={`${holiday.name} (${holiday.country})`}
                          >
                            🎉 {holiday.name}
                          </div>
                        ))}
                        {/* Show events */}
                        {dayEvents.slice(0, hasHoliday ? 1 : 2).map(event => (
                          <div
                            key={event.id}
                            className="text-xs p-1 rounded text-white truncate cursor-pointer hover:opacity-80"
                            style={{ backgroundColor: (event as any).color || '#3B82F6' }}
                            onClick={(e) => {
                              e.stopPropagation();
                              console.log('Editing event:', event);
                              setEditingEvent(event);
                            }}
                          >
                            {event.title}
                          </div>
                        ))}
                        {(dayEvents.length + dayHolidays.length) > 2 && (
                          <div className="text-xs text-muted-foreground">
                            +{(dayEvents.length + dayHolidays.length) - 2} more
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Events Sidebar */}
          <Card className="bg-gradient-card shadow-custom-card">
            <CardHeader>
              <CardTitle>
                {selectedDate ? `Events for ${selectedDate.toLocaleDateString()}` : 'Upcoming Events'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Show holidays for selected date */}
              {selectedDate && getHolidaysForDate(selectedDate).map(holiday => (
                <div key={holiday.name} className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">🎉</span>
                    <div>
                      <h4 className="font-medium text-sm text-destructive">{holiday.name}</h4>
                      <p className="text-xs text-muted-foreground">Public Holiday ({holiday.country})</p>
                    </div>
                  </div>
                </div>
              ))}

              {/* Show events */}
              {(selectedDate ? getEventsForDate(selectedDate) : getUpcomingEvents().slice(0, 5)).map(event => (
                <div key={event.id} className="p-3 bg-muted/20 rounded-lg space-y-2">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium text-sm">{event.title}</h4>
                        {(event as any).isProjectDeadline && (
                          <Briefcase className="w-3 h-3 text-muted-foreground" />
                        )}
                      </div>
                      {event.description && (
                        <p className="text-xs text-muted-foreground mt-1">{event.description}</p>
                      )}
                    </div>
                    <Badge className={`text-xs ${getEventTypeColor(event.type)} text-white`}>
                      {getEventTypeLabel(event.type)}
                    </Badge>
                  </div>
                  
                  <div className="space-y-1 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {event.time} {(event as any).duration ? `(${(event as any).duration})` : ''}
                    </div>
                    
                    {event.location && (
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {event.location}
                      </div>
                    )}
                    
                    {event.attendees && event.attendees.length > 0 && (
                      <div className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        <span>{event.attendees.join(", ")}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              
              {selectedDate && getEventsForDate(selectedDate).length === 0 && getHolidaysForDate(selectedDate).length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <CalendarIcon className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No events scheduled for this date</p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="mt-2"
                    onClick={() => {
                      setNewEvent(prev => ({ ...prev, date: selectedDate }));
                      setIsAddEventOpen(true);
                    }}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Event
                  </Button>
                </div>
              )}

              {/* Show empty state for no user events */}
              {!selectedDate && getUpcomingEvents().length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <CalendarIcon className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No events created yet</p>
                  <p className="text-xs">Start by creating your first event</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Holiday Legend */}
        <Card className="bg-gradient-card shadow-custom-card">
          <CardHeader>
            <CardTitle className="text-lg">Public Holidays</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-destructive rounded"></div>
                <span>🇩🇰 Denmark (DK)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-destructive rounded"></div>
                <span>🇸🇪 Sweden (SE)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-destructive rounded"></div>
                <span>🇬🇧 United Kingdom (UK)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-destructive rounded"></div>
                <span>🇺🇸 United States (US)</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-gradient-card shadow-custom-card">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-primary">{events.filter(e => e.type === 'meeting').length}</div>
              <div className="text-sm text-muted-foreground">Meetings</div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-card shadow-custom-card">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-destructive">{events.filter(e => e.type === 'deadline').length}</div>
              <div className="text-sm text-muted-foreground">Deadlines</div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-card shadow-custom-card">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-warning">{events.filter(e => e.type === 'milestone').length}</div>
              <div className="text-sm text-muted-foreground">Milestones</div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-card shadow-custom-card">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-success">{events.length}</div>
              <div className="text-sm text-muted-foreground">Total Events</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Calendar;