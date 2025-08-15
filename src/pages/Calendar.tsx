import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, MapPin, Users, Plus, Send } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useSharedData } from '@/contexts/SharedDataContext';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

interface Meeting {
  title: string;
  description: string;
  date: string;
  time: string;
  end_time: string;
  type: string;
  location: string;
  attendees: string[];
}

const CalendarPage = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newMeeting, setNewMeeting] = useState<Meeting>({
    title: '',
    description: '',
    date: '',
    time: '',
    end_time: '',
    type: 'meeting',
    location: '',
    attendees: []
  });
  const [clientTimeZone, setClientTimeZone] = useState('');
  const { user } = useAuth();
  const { events, createCalendarEvent } = useSharedData();

  useEffect(() => {
    setClientTimeZone(Intl.DateTimeFormat().resolvedOptions().timeZone);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewMeeting(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (value: string, name: string) => {
    setNewMeeting(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAttendeesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNewMeeting(prev => ({
      ...prev,
      attendees: value.split(',').map(email => email.trim())
    }));
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(':');
    const date = new Date();
    date.setHours(parseInt(hours, 10));
    date.setMinutes(parseInt(minutes, 10));
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    });
  };

  const handleCreateMeeting = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('📅 Form submitted - handleCreateMeeting called');
    
    if (!user) {
      console.log('❌ No user found');
      toast.error('You must be logged in to create meetings');
      return;
    }

    console.log('👤 User found:', user.email);
    console.log('📝 Meeting form data:', newMeeting);

    try {
      const meetingData = {
        title: newMeeting.title,
        description: newMeeting.description,
        date: newMeeting.date,
        time: newMeeting.time,
        end_time: newMeeting.end_time,
        type: newMeeting.type,
        location: newMeeting.location,
        attendees: newMeeting.attendees,
        assigned_members: newMeeting.attendees,
        created_by: user.email || 'unknown'
      };

      console.log('🚀 About to call createCalendarEvent with:', meetingData);

      // Create the meeting/event
      const result = await createCalendarEvent(meetingData);
      console.log('✅ Meeting created successfully:', result);

      // The webhook is now triggered automatically in createCalendarEvent
      // No need for separate webhook call here

      setNewMeeting({
        title: '',
        description: '',
        date: '',
        time: '',
        end_time: '',
        type: 'meeting',
        location: '',
        attendees: []
      });
      setIsDialogOpen(false);
      toast.success('Meeting created successfully');
    } catch (error) {
      console.error('💥 Error creating meeting:', error);
      toast.error('Failed to create meeting');
    }
  };

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-2xl font-bold">Calendar</CardTitle>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Plus className="mr-2 h-4 w-4" />
                Add Event
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add New Event</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleCreateMeeting} className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="title" className="text-right">
                    Title
                  </Label>
                  <Input id="title" name="title" value={newMeeting.title} onChange={handleInputChange} className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="description" className="text-right">
                    Description
                  </Label>
                  <Textarea id="description" name="description" value={newMeeting.description} onChange={handleInputChange} className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="date" className="text-right">
                    Date
                  </Label>
                  <Input type="date" id="date" name="date" value={newMeeting.date} onChange={handleInputChange} className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="time" className="text-right">
                    Time
                  </Label>
                  <Input type="time" id="time" name="time" value={newMeeting.time} onChange={handleInputChange} className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="end_time" className="text-right">
                    End Time
                  </Label>
                  <Input type="time" id="end_time" name="end_time" value={newMeeting.end_time} onChange={handleInputChange} className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="type" className="text-right">
                    Type
                  </Label>
                  <Select onValueChange={(value) => handleSelectChange(value, 'type')}>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select a type" defaultValue="meeting" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="meeting">Meeting</SelectItem>
                      <SelectItem value="appointment">Appointment</SelectItem>
                      <SelectItem value="reminder">Reminder</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="location" className="text-right">
                    Location
                  </Label>
                  <Input id="location" name="location" value={newMeeting.location} onChange={handleInputChange} className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="attendees" className="text-right">
                    Attendees
                  </Label>
                  <Input id="attendees" name="attendees" placeholder="email1, email2, email3" value={newMeeting.attendees.join(', ')} onChange={handleAttendeesChange} className="col-span-3" />
                </div>
                <Button type="submit">Create Event</Button>
              </form>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {events.map(event => (
              <Card key={event.id}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-xl font-bold">{event.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-2">
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4" />
                      <span>{formatDate(event.date)}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4" />
                      <span>{formatTime(event.time)}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4" />
                      <span>{event.location}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Users className="h-4 w-4" />
                      <span>{event.attendees?.length || 0} Attendees</span>
                    </div>
                    <div>
                      <Badge>{event.type}</Badge>
                    </div>
                    <p>{event.description}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CalendarPage;
