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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { useSharedData } from "@/contexts/SharedDataContext";
import { useAuth } from "@/hooks/useAuth";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
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
  Briefcase,
  RefreshCw,
  LogIn
} from "lucide-react";

interface GoogleCalendarEvent {
  id: string;
  summary: string;
  description?: string;
  start: {
    dateTime?: string;
    date?: string;
  };
  end: {
    dateTime?: string;
    date?: string;
  };
  location?: string;
  attendees?: Array<{
    email: string;
    displayName?: string;
    responseStatus?: string;
  }>;
  status?: string;
}

const TestSiteCalendar = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [googleEvents, setGoogleEvents] = useState<GoogleCalendarEvent[]>([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [loading, setLoading] = useState(false);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  useEffect(() => {
    // Check if user has Google Calendar access token
    checkGoogleAuth();
  }, []);

  useEffect(() => {
    // Check for OAuth callback
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    
    if (code && !isAuthenticated) {
      handleOAuthCallback(code);
    }
  }, [isAuthenticated]);

  const checkGoogleAuth = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        // Try to fetch events to check if user is authenticated
        const response = await supabase.functions.invoke('google-api', {
          body: { action: 'getEvents' }
        });

        if (response.data && !response.data.error) {
          setIsAuthenticated(true);
          setGoogleEvents(response.data.events || []);
        } else {
          setIsAuthenticated(false);
        }
      }
    } catch (error) {
      console.error('Error checking Google auth:', error);
      setIsAuthenticated(false);
    }
  };

  const handleOAuthCallback = async (code: string) => {
    setLoading(true);
    try {
      const response = await supabase.functions.invoke('google-api', {
        body: { action: 'exchangeCode', code }
      });

      if (response.data && !response.data.error) {
        setIsAuthenticated(true);
        toast({
          title: "Success",
          description: "Google Calendar connected successfully!",
        });
        
        // Clear the URL parameters
        window.history.replaceState({}, document.title, window.location.pathname);
        
        // Load calendar events
        loadGoogleCalendarEvents();
      } else {
        toast({
          title: "Authentication Error",
          description: response.data?.error || "Failed to connect Google Calendar",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error handling OAuth callback:', error);
      toast({
        title: "Authentication Error",
        description: "Failed to complete Google Calendar authentication",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      // Create OAuth URL with a placeholder client ID - the real client ID validation will happen on the backend
      // In production, you would get the client ID from your environment or from the backend
      const clientId = "YOUR_GOOGLE_CLIENT_ID"; // This will be handled by the backend
      const redirectUri = `${window.location.origin}/test-site-calendar`;
      const scope = "https://www.googleapis.com/auth/calendar.readonly";
      
      // For now, we'll inform the user that they need to set up OAuth properly
      toast({
        title: "Setup Required",
        description: "To connect Google Calendar, you need to configure OAuth credentials in your Google Cloud Console and update the frontend with your client ID.",
        variant: "destructive",
      });

    } catch (error) {
      console.error('Error signing in with Google:', error);
      toast({
        title: "Authentication Error", 
        description: "Failed to initiate Google Calendar authentication",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const loadGoogleCalendarEvents = async () => {
    if (!isAuthenticated) return;
    
    setLoading(true);
    try {
      const response = await supabase.functions.invoke('google-api', {
        body: { action: 'getEvents' }
      });

      if (response.data && !response.data.error) {
        setGoogleEvents(response.data.events || []);
        toast({
          title: "Calendar Synchronized",
          description: `Loaded ${response.data.events?.length || 0} events from Google Calendar`,
        });
      } else {
        toast({
          title: "Error",
          description: response.data?.error || "Failed to load Google Calendar events",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error loading Google Calendar events:', error);
      toast({
        title: "Error",
        description: "Failed to load Google Calendar events",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const refreshCalendar = () => {
    if (isAuthenticated) {
      loadGoogleCalendarEvents();
    } else {
      toast({
        title: "Not Authenticated",
        description: "Please sign in with Google Calendar first",
        variant: "destructive",
      });
    }
  };

  const signOut = async () => {
    try {
      await supabase.functions.invoke('google-api', {
        body: { action: 'disconnect' }
      });

      setIsAuthenticated(false);
      setGoogleEvents([]);
      toast({
        title: "Signed Out",
        description: "Successfully signed out from Google Calendar",
      });
    } catch (error) {
      console.error('Error signing out:', error);
      toast({
        title: "Error",
        description: "Failed to sign out from Google Calendar",
        variant: "destructive",
      });
    }
  };

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const goToToday = () => {
    const today = new Date();
    setCurrentDate(today);
    setSelectedDate(today);
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();

    // Get the day of the week for the first day (0 = Sunday, 1 = Monday, etc.)
    // Adjust so Monday = 0, Tuesday = 1, etc.
    const firstDayOfWeek = (firstDay.getDay() + 6) % 7;

    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfWeek; i++) {
      days.push(null);
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }

    return days;
  };

  const getGoogleEventsForDate = (date: Date): GoogleCalendarEvent[] => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return googleEvents.filter(event => {
      const eventDate = event.start.dateTime 
        ? format(new Date(event.start.dateTime), 'yyyy-MM-dd')
        : event.start.date;
      return eventDate === dateStr;
    });
  };

  const isToday = (date: Date): boolean => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const formatEventTime = (event: GoogleCalendarEvent): string => {
    if (event.start.dateTime) {
      const startTime = format(new Date(event.start.dateTime), 'HH:mm');
      const endTime = event.end.dateTime ? format(new Date(event.end.dateTime), 'HH:mm') : '';
      return endTime ? `${startTime} - ${endTime}` : startTime;
    }
    return 'All day';
  };

  const getEventTypeColor = (status?: string): string => {
    switch (status) {
      case 'confirmed': return 'bg-green-500';
      case 'tentative': return 'bg-yellow-500';
      case 'cancelled': return 'bg-red-500';
      default: return 'bg-blue-500';
    }
  };

  return (
    <Layout>
      <div className="p-6 max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Test Site Calendar</h1>
            <p className="text-muted-foreground">Google Calendar Integration for Team</p>
          </div>
          
          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <>
                <Button 
                  onClick={refreshCalendar} 
                  disabled={loading}
                  variant="outline"
                  size="sm"
                >
                  <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                  Refresh
                </Button>
                <Button 
                  onClick={signOut} 
                  variant="outline"
                  size="sm"
                >
                  Sign Out
                </Button>
              </>
            ) : (
              <Button 
                onClick={handleGoogleSignIn} 
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <LogIn className="w-4 h-4 mr-2" />
                {loading ? 'Connecting...' : 'Connect Google Calendar'}
              </Button>
            )}
          </div>
        </div>

        {!isAuthenticated ? (
          <Card className="p-8 text-center">
            <div className="space-y-4">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto">
                <CalendarIcon className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold">Connect Your Google Calendar</h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                Sign in with your Google account to sync your team's calendar events and stay updated with all meetings and important dates.
              </p>
              <Button 
                onClick={handleGoogleSignIn} 
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700"
                size="lg"
              >
                <LogIn className="w-5 h-5 mr-2" />
                {loading ? 'Connecting...' : 'Connect Google Calendar'}
              </Button>
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Calendar */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <CalendarIcon className="w-5 h-5" />
                      {format(currentDate, 'MMMM yyyy')}
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" onClick={goToPreviousMonth}>
                        <ChevronLeft className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={goToToday}>
                        Today
                      </Button>
                      <Button variant="outline" size="sm" onClick={goToNextMonth}>
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-7 gap-1 mb-4">
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                      <div key={day} className="text-center text-sm font-medium text-muted-foreground p-2">
                        {day}
                      </div>
                    ))}
                  </div>
                  
                  <div className="grid grid-cols-7 gap-1">
                    {getDaysInMonth(currentDate).map((date, index) => {
                      if (!date) {
                        return <div key={index} className="h-24 p-1" />;
                      }
                      
                      const dayEvents = getGoogleEventsForDate(date);
                      const isSelected = selectedDate?.toDateString() === date.toDateString();
                      const isTodayDate = isToday(date);
                      
                      return (
                        <div
                          key={date.toDateString()}
                          className={cn(
                            "h-24 p-1 border rounded-lg cursor-pointer transition-all hover:bg-accent",
                            isSelected && "ring-2 ring-primary",
                            isTodayDate && "bg-blue-50 dark:bg-blue-950"
                          )}
                          onClick={() => setSelectedDate(date)}
                        >
                          <div className={cn(
                            "text-sm font-medium mb-1",
                            isTodayDate && "text-blue-600 dark:text-blue-400"
                          )}>
                            {date.getDate()}
                          </div>
                          <div className="space-y-1">
                            {dayEvents.slice(0, 2).map((event, eventIndex) => (
                              <div
                                key={eventIndex}
                                className={cn(
                                  "text-xs px-1 py-0.5 rounded text-white truncate",
                                  getEventTypeColor(event.status)
                                )}
                                title={event.summary}
                              >
                                {event.summary}
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
            </div>

            {/* Events Sidebar */}
            <div className="space-y-6">
              {/* Selected Date Events */}
              {selectedDate && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">
                      {format(selectedDate, 'MMM dd, yyyy')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {getGoogleEventsForDate(selectedDate).map((event) => (
                        <div key={event.id} className="p-3 border rounded-lg">
                          <div className="font-medium text-sm">{event.summary}</div>
                          <div className="text-xs text-muted-foreground mt-1">
                            {formatEventTime(event)}
                          </div>
                          {event.location && (
                            <div className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              {event.location}
                            </div>
                          )}
                          {event.attendees && event.attendees.length > 0 && (
                            <div className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                              <Users className="w-3 h-3" />
                              {event.attendees.length} attendee{event.attendees.length !== 1 ? 's' : ''}
                            </div>
                          )}
                        </div>
                      ))}
                      {getGoogleEventsForDate(selectedDate).length === 0 && (
                        <div className="text-center text-muted-foreground py-4">
                          No events for this day
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Calendar Stats */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Calendar Stats</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Total Events</span>
                      <Badge variant="secondary">{googleEvents.length}</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Confirmed</span>
                      <Badge className="bg-green-500 hover:bg-green-600">
                        {googleEvents.filter(e => e.status === 'confirmed').length}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Tentative</span>
                      <Badge className="bg-yellow-500 hover:bg-yellow-600">
                        {googleEvents.filter(e => e.status === 'tentative').length}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default TestSiteCalendar;