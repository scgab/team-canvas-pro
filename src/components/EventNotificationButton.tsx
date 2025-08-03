import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, Clock, Calendar, MapPin, Users, Send } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface EventNotificationButtonProps {
  event: {
    id: string;
    title: string;
    description?: string;
    date: string;
    time?: string;
    end_time?: string;
    location?: string;
    attendees?: string[];
    assigned_members?: string[];
    agenda?: string[];
    type: 'meeting' | 'event';
  };
  variant?: 'button' | 'card';
}

export const EventNotificationButton = ({ event, variant = 'button' }: EventNotificationButtonProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [showDialog, setShowDialog] = useState(false);

  const attendees = event.attendees || event.assigned_members || [];

  const sendNotifications = async () => {
    if (!user || attendees.length === 0) {
      toast({
        title: "Error",
        description: "No attendees to notify or user not authenticated",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.functions.invoke('send-event-notifications', {
        body: {
          eventId: event.id,
          eventTitle: event.title,
          eventDescription: event.description,
          eventDate: event.date,
          eventTime: event.time,
          endTime: event.end_time,
          location: event.location,
          attendees: attendees,
          agenda: event.agenda,
          type: event.type,
          senderEmail: user.email,
          senderName: user.user_metadata?.full_name || user.email
        }
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: `Notifications sent to ${attendees.length} attendees`
      });
      setShowDialog(false);
    } catch (error: any) {
      console.error('Error sending notifications:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to send notifications",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    } catch {
      return dateStr;
    }
  };

  const formatTime = (time?: string, endTime?: string) => {
    if (!time) return "All day";
    if (endTime) return `${time} - ${endTime}`;
    return time;
  };

  if (variant === 'card') {
    return (
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <Mail className="w-4 h-4" />
            Send Reminder
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Mail className="w-5 h-5" />
              Send Event Reminder
            </DialogTitle>
          </DialogHeader>
          
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">{event.title}</CardTitle>
              {event.description && (
                <p className="text-sm text-muted-foreground">{event.description}</p>
              )}
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <span>{formatDate(event.date)}</span>
              </div>
              
              <div className="flex items-center gap-2 text-sm">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <span>{formatTime(event.time, event.end_time)}</span>
              </div>
              
              {event.location && (
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <span>{event.location}</span>
                </div>
              )}
              
              <div className="flex items-center gap-2 text-sm">
                <Users className="w-4 h-4 text-muted-foreground" />
                <span>{attendees.length} attendees</span>
              </div>

              {event.agenda && event.agenda.length > 0 && (
                <div className="mt-3">
                  <h4 className="font-medium text-sm mb-2">Agenda:</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    {event.agenda.map((item, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-xs mt-1">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              {attendees.length > 0 && (
                <div className="mt-3">
                  <h4 className="font-medium text-sm mb-2">Attendees:</h4>
                  <div className="flex flex-wrap gap-1">
                    {attendees.map((attendee, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {attendee}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
          
          <div className="flex gap-2 pt-4">
            <Button 
              onClick={sendNotifications} 
              disabled={loading || attendees.length === 0}
              className="flex-1"
            >
              <Send className="w-4 h-4 mr-2" />
              {loading ? 'Sending...' : 'Send Notifications'}
            </Button>
            <Button variant="outline" onClick={() => setShowDialog(false)}>
              Cancel
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Button 
      onClick={sendNotifications} 
      disabled={loading || attendees.length === 0}
      variant="outline"
      size="sm"
      className="flex items-center gap-2"
    >
      <Mail className="w-4 h-4" />
      {loading ? 'Sending...' : 'Send Reminder'}
    </Button>
  );
};