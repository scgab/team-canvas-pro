import { useState } from "react";
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const events: CalendarEvent[] = [
    {
      id: "1",
      title: "Project Kickoff Meeting",
      description: "Initial meeting for mobile app redesign project",
      date: new Date(2024, 11, 15),
      time: "10:00 AM",
      duration: "2 hours",
      type: "meeting",
      attendees: ["Sarah Chen", "Mike Johnson", "Alex Rivera"],
      location: "Conference Room A",
      color: "#3B82F6"
    },
    {
      id: "2",
      title: "Design Review Deadline",
      date: new Date(2024, 11, 18),
      time: "5:00 PM",
      duration: "All day",
      type: "deadline",
      color: "#EF4444"
    },
    {
      id: "3",
      title: "Weekly Standup",
      date: new Date(2024, 11, 16),
      time: "9:00 AM",
      duration: "30 minutes",
      type: "meeting",
      attendees: ["Team Alpha"],
      location: "Video Call",
      color: "#10B981"
    },
    {
      id: "4",
      title: "Client Presentation",
      description: "Present final mockups to client",
      date: new Date(2024, 11, 20),
      time: "2:00 PM",
      duration: "1 hour",
      type: "milestone",
      attendees: ["Sarah Chen", "David Kim"],
      location: "Client Office",
      color: "#8B5CF6"
    },
    {
      id: "5",
      title: "Code Review Session",
      date: new Date(2024, 11, 17),
      time: "3:00 PM",
      duration: "1 hour",
      type: "meeting",
      attendees: ["Mike Johnson", "Emma Davis"],
      color: "#F59E0B"
    }
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

  // Get calendar grid
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

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
          <Button className="bg-gradient-primary hover:bg-primary-dark">
            <Plus className="w-4 h-4 mr-2" />
            Add Event
          </Button>
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
                {/* Day headers */}
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
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
                  const isSelected = selectedDate?.toDateString() === day.toDateString();
                  
                  return (
                    <div
                      key={index}
                      className={`p-2 h-24 border border-border rounded-lg cursor-pointer transition-colors hover:bg-muted/50 ${
                        isToday(day) ? 'bg-primary/10 border-primary' : ''
                      } ${isSelected ? 'bg-accent/20 border-accent' : ''}`}
                      onClick={() => setSelectedDate(day)}
                    >
                      <div className={`text-sm font-medium mb-1 ${isToday(day) ? 'text-primary' : 'text-foreground'}`}>
                        {day.getDate()}
                      </div>
                      <div className="space-y-1">
                        {dayEvents.slice(0, 2).map(event => (
                          <div
                            key={event.id}
                            className="text-xs p-1 rounded text-white truncate"
                            style={{ backgroundColor: event.color }}
                          >
                            {event.title}
                          </div>
                        ))}
                        {dayEvents.length > 2 && (
                          <div className="text-xs text-muted-foreground">
                            +{dayEvents.length - 2} more
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
                        <div className="flex items-center gap-1">
                          {event.attendees.slice(0, 3).map((attendee, idx) => (
                            <Avatar key={idx} className="w-4 h-4">
                              <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                                {attendee.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                          ))}
                          {event.attendees.length > 3 && (
                            <span className="text-xs">+{event.attendees.length - 3}</span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              
              {selectedDate && getEventsForDate(selectedDate).length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <CalendarIcon className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No events scheduled for this date</p>
                  <Button variant="outline" size="sm" className="mt-2">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Event
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-gradient-card shadow-custom-card">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-primary">{events.filter(e => e.type === 'meeting').length}</div>
              <div className="text-sm text-muted-foreground">Meetings This Month</div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-card shadow-custom-card">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-destructive">{events.filter(e => e.type === 'deadline').length}</div>
              <div className="text-sm text-muted-foreground">Upcoming Deadlines</div>
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