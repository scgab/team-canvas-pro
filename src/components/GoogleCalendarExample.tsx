import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

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
    responseStatus: string;
  }>;
}

export const GoogleCalendarExample = () => {
  const [eventId, setEventId] = useState('');
  const [loading, setLoading] = useState(false);
  const [eventData, setEventData] = useState<GoogleCalendarEvent | null>(null);
  const { toast } = useToast();

  const fetchGoogleEvent = async () => {
    if (!eventId.trim()) {
      toast({
        title: "Error",
        description: "Please enter an event ID",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    setEventData(null);

    try {
      // Get the current session to include the JWT token
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.access_token) {
        toast({
          title: "Authentication Error",
          description: "Please log in to access Google Calendar",
          variant: "destructive",
        });
        return;
      }

      // Call the Supabase Edge Function
      const { data, error } = await supabase.functions.invoke('google-api', {
        body: {
          action: 'getEvent',
          eventId: eventId.trim()
        },
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
        }
      });

      if (error) {
        console.error('Edge function error:', error);
        toast({
          title: "API Error",
          description: error.message || "Failed to fetch event from Google Calendar",
          variant: "destructive",
        });
        return;
      }

      if (data.success && data.event) {
        setEventData(data.event);
        toast({
          title: "Success",
          description: "Event fetched successfully from Google Calendar",
        });
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to fetch event",
          variant: "destructive",
        });
      }

    } catch (error) {
      console.error('Fetch error:', error);
      toast({
        title: "Network Error",
        description: "Failed to connect to the API",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const formatDateTime = (dateTime?: string, date?: string) => {
    if (dateTime) {
      return new Date(dateTime).toLocaleString();
    } else if (date) {
      return new Date(date).toLocaleDateString();
    }
    return 'Not specified';
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Google Calendar Event Fetcher</CardTitle>
          <CardDescription>
            Enter a Google Calendar event ID to fetch event details
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <Input
              placeholder="Enter Google Calendar Event ID"
              value={eventId}
              onChange={(e) => setEventId(e.target.value)}
              className="flex-1"
            />
            <Button 
              onClick={fetchGoogleEvent}
              disabled={loading}
            >
              {loading ? 'Fetching...' : 'Fetch Event'}
            </Button>
          </div>
          
          <div className="text-sm text-muted-foreground">
            <p>Example Event ID: abc123def456ghi789 (from Google Calendar URL)</p>
            <p>Note: You need to be authenticated and have Google Calendar access configured</p>
          </div>
        </CardContent>
      </Card>

      {eventData && (
        <Card>
          <CardHeader>
            <CardTitle>Event Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <strong>Title:</strong> {eventData.summary || 'No title'}
            </div>
            
            {eventData.description && (
              <div>
                <strong>Description:</strong> {eventData.description}
              </div>
            )}
            
            <div>
              <strong>Start:</strong> {formatDateTime(eventData.start.dateTime, eventData.start.date)}
            </div>
            
            <div>
              <strong>End:</strong> {formatDateTime(eventData.end.dateTime, eventData.end.date)}
            </div>
            
            {eventData.location && (
              <div>
                <strong>Location:</strong> {eventData.location}
              </div>
            )}
            
            {eventData.attendees && eventData.attendees.length > 0 && (
              <div>
                <strong>Attendees:</strong>
                <ul className="list-disc list-inside mt-2">
                  {eventData.attendees.map((attendee, index) => (
                    <li key={index}>
                      {attendee.displayName || attendee.email} ({attendee.responseStatus})
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            <div className="text-xs text-muted-foreground">
              <strong>Event ID:</strong> {eventData.id}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};