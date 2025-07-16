import { useState } from "react";
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
import { useToast } from "@/hooks/use-toast";
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
  User
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
}

interface PublicHoliday {
  date: Date;
  name: string;
  country: string;
}

const Calendar = () => {
  const { toast } = useToast();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [isAddEventOpen, setIsAddEventOpen] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: "",
    description: "",
    date: new Date(),
    time: "",
    duration: "",
    type: "meeting" as const,
    attendees: "",
    location: ""
  });

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
    setCurrentDate(new Date());
  };

  // Add new event
  const handleAddEvent = () => {
    if (!newEvent.title.trim()) {
      toast({
        title: "Error",
        description: "Please enter an event title.",
        variant: "destructive"
      });
      return;
    }

    const colors = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6", "#EC4899"];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];

    const event: CalendarEvent = {
      id: Date.now().toString(),
      title: newEvent.title,
      description: newEvent.description,
      date: newEvent.date,
      time: newEvent.time || "All day",
      duration: newEvent.duration || "1 hour",
      type: newEvent.type,
      attendees: newEvent.attendees ? newEvent.attendees.split(",").map(a => a.trim()) : [],
      location: newEvent.location,
      color: randomColor
    };

    setEvents(prev => [...prev, event]);
    setNewEvent({
      title: "",
      description: "",
      date: new Date(),
      time: "",
      duration: "",
      type: "meeting",
      attendees: "",
      location: ""
    });
    setIsAddEventOpen(false);

    toast({
      title: "Event Created",
      description: `${event.title} has been added to your calendar.`,
    });
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

  // Get events for a specific date
  const getEventsForDate = (date: Date) => {
    return events.filter(event => 
      event.date.toDateString() === date.toDateString()
    );
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
          <Dialog open={isAddEventOpen} onOpenChange={setIsAddEventOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-primary hover:bg-primary-dark">
                <Plus className="w-4 h-4 mr-2" />
                Add Event
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
                        onSelect={(date) => date && setNewEvent(prev => ({ ...prev, date }))}
                        initialFocus
                        className={cn("p-3 pointer-events-auto")}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="event-time">Time</Label>
                    <Input
                      id="event-time"
                      type="time"
                      value={newEvent.time}
                      onChange={(e) => setNewEvent(prev => ({ ...prev, time: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="event-duration">Duration</Label>
                    <Input
                      id="event-duration"
                      value={newEvent.duration}
                      onChange={(e) => setNewEvent(prev => ({ ...prev, duration: e.target.value }))}
                      placeholder="e.g., 1 hour"
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
                        <SelectItem value="deadline">Deadline</SelectItem>
                        <SelectItem value="milestone">Milestone</SelectItem>
                        <SelectItem value="reminder">Reminder</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="event-location">Location</Label>
                    <Input
                      id="event-location"
                      value={newEvent.location}
                      onChange={(e) => setNewEvent(prev => ({ ...prev, location: e.target.value }))}
                      placeholder="Location"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="event-attendees">Attendees</Label>
                  <Input
                    id="event-attendees"
                    value={newEvent.attendees}
                    onChange={(e) => setNewEvent(prev => ({ ...prev, attendees: e.target.value }))}
                    placeholder="Comma separated names"
                  />
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
                      onClick={() => setSelectedDate(day)}
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
                            className="text-xs p-1 rounded text-white truncate"
                            style={{ backgroundColor: event.color }}
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
              {(selectedDate ? getEventsForDate(selectedDate) : events.slice(0, 5)).map(event => (
                <div key={event.id} className="p-3 bg-muted/20 rounded-lg space-y-2">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{event.title}</h4>
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
                      {event.time} ({event.duration})
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
              {!selectedDate && events.length === 0 && (
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