import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { CalendarIcon, Clock, MapPin, Users } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const EventWebhookTest = () => {
  const [loading, setLoading] = useState(false);
  const [eventData, setEventData] = useState({
    title: "Test Event",
    date: new Date().toISOString().split('T')[0],
    time: "14:00",
    endTime: "15:00",
    location: "Conference Room A",
    attendees: "john@example.com, jane@example.com",
    agenda: "Discuss project updates\nReview timeline\nQ&A session"
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      meetingId: `test-${Date.now()}`,
      title: eventData.title,
      date: eventData.date,
      time: eventData.time,
      end_time: eventData.endTime,
      location: eventData.location,
      attendees: eventData.attendees.split(',').map(email => email.trim()).filter(Boolean),
      agenda: eventData.agenda.split('\n').filter(line => line.trim()),
      source: 'webhook-test',
      timestamp: new Date().toISOString(),
      createdBy: 'test-user'
    };

    try {
      console.log('Sending payload to edge function:', payload);
      
      const { data, error } = await supabase.functions.invoke('forward-n8n-meeting', {
        body: payload
      });

      if (error) {
        console.error('Edge function error:', error);
        toast.error(`Failed to send event: ${error.message}`);
        return;
      }

      console.log('Edge function response:', data);

      if (data?.ok) {
        toast.success("Event sent to N8N webhook successfully!");
        console.log('N8N webhook response:', data.responseText);
      } else {
        toast.error(`N8N webhook responded with status: ${data?.status || 'unknown'}`);
        console.log('N8N error response:', data);
      }
    } catch (error) {
      console.error('Webhook error:', error);
      toast.error("Failed to send event to webhook");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CalendarIcon className="h-5 w-5" />
          N8N Webhook Event Test
        </CardTitle>
        <CardDescription>
          Test creating events and sending them to your n8n webhook
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Event Title</Label>
            <Input
              id="title"
              value={eventData.title}
              onChange={(e) => setEventData(prev => ({ ...prev, title: e.target.value }))}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={eventData.date}
                onChange={(e) => setEventData(prev => ({ ...prev, date: e.target.value }))}
                required
              />
            </div>
            <div>
              <Label htmlFor="time" className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                Start Time
              </Label>
              <Input
                id="time"
                type="time"
                value={eventData.time}
                onChange={(e) => setEventData(prev => ({ ...prev, time: e.target.value }))}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="endTime">End Time</Label>
            <Input
              id="endTime"
              type="time"
              value={eventData.endTime}
              onChange={(e) => setEventData(prev => ({ ...prev, endTime: e.target.value }))}
            />
          </div>

          <div>
            <Label htmlFor="location" className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              Location
            </Label>
            <Input
              id="location"
              value={eventData.location}
              onChange={(e) => setEventData(prev => ({ ...prev, location: e.target.value }))}
            />
          </div>

          <div>
            <Label htmlFor="attendees" className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              Attendees (comma-separated emails)
            </Label>
            <Input
              id="attendees"
              value={eventData.attendees}
              onChange={(e) => setEventData(prev => ({ ...prev, attendees: e.target.value }))}
              placeholder="john@example.com, jane@example.com"
            />
          </div>

          <div>
            <Label htmlFor="agenda">Agenda (one item per line)</Label>
            <Textarea
              id="agenda"
              value={eventData.agenda}
              onChange={(e) => setEventData(prev => ({ ...prev, agenda: e.target.value }))}
              placeholder="Agenda item 1&#10;Agenda item 2&#10;Agenda item 3"
              rows={4}
            />
          </div>

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Sending..." : "Send Test Event to N8N Webhook"}
          </Button>
        </form>

        <div className="mt-6 p-4 bg-muted rounded-lg">
          <h4 className="font-medium mb-2">Webhook URL:</h4>
          <code className="text-sm text-muted-foreground break-all">
            https://wheewls.app.n8n.cloud/webhook-test/webhook-test/a8ad0817-3fd7-4465-a7f4-4cccc7d0a40c
          </code>
        </div>
      </CardContent>
    </Card>
  );
};

export default EventWebhookTest;