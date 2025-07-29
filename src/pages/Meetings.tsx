import React, { useState, useEffect } from 'react';
import { Layout } from '@/components/Layout';
import { useNavigate } from 'react-router-dom';
import { Video, Plus, Clock, Users, Calendar, Play, Square, CheckCircle, Edit3, Trash2, FileText, MessageSquare, Target, CheckSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { format, parseISO } from 'date-fns';

interface Meeting {
  id: string;
  title: string;
  description?: string;
  date: string;
  time?: string;
  start_time?: string; // For backward compatibility
  end_time?: string;
  type: string;
  location?: string;
  assigned_members: string[];
  attendees: string[];
  // Meeting-specific fields from calendar_events extension
  agenda?: string[];
  meeting_notes?: string;
  brainstorm_items?: string[];
  agreements?: string[];
  action_items?: string[];
  meeting_status: 'planned' | 'ongoing' | 'completed';
  meeting_summary?: string;
  created_by: string;
  created_at: string;
  updated_at?: string;
}

interface NewMeeting {
  title: string;
  description: string;
  date: string;
  time: string;
  end_time?: string;
  location?: string;
  attendees: string[];
  agenda: string[];
}

const Meetings: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null);
  const [editMeeting, setEditMeeting] = useState<NewMeeting | null>(null);
  const [activeTab, setActiveTab] = useState('planned');
  
  // Form state for new meeting
  const [newMeeting, setNewMeeting] = useState<NewMeeting>({
    title: '',
    description: '',
    date: '',
    time: '',
    end_time: '',
    location: '',
    attendees: [],
    agenda: ['']
  });

  // Real-time collaboration state
  const [liveNotes, setLiveNotes] = useState('');
  const [brainstormItems, setBrainstormItems] = useState<string[]>([]);
  const [agreements, setAgreements] = useState<string[]>([]);
  const [actionItems, setActionItems] = useState<string[]>([]);

  useEffect(() => {
    if (user) {
      fetchMeetings();
      setupRealtimeSubscription();
    }
  }, [user]);

  const fetchMeetings = async () => {
    try {
      const { data, error } = await supabase
        .from('calendar_events')
        .select('*')
        .eq('type', 'meeting')
        .order('date', { ascending: true });

      if (error) {
        console.error('Error fetching meetings:', error);
        toast.error('Failed to fetch meetings');
        return;
      }

      setMeetings((data || []) as Meeting[]);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to fetch meetings');
    } finally {
      setLoading(false);
    }
  };

  const setupRealtimeSubscription = () => {
    const channel = supabase
      .channel('calendar-events-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'calendar_events',
          filter: 'type=eq.meeting'
        },
        (payload) => {
          console.log('Calendar event update:', payload);
          fetchMeetings();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const createMeeting = async () => {
    if (!user || !newMeeting.title || !newMeeting.date || !newMeeting.time) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      console.log('Creating meeting with data:', newMeeting);
      
      const meetingData = {
        title: newMeeting.title.trim(),
        description: newMeeting.description?.trim() || '',
        date: newMeeting.date,
        time: newMeeting.time,
        end_time: newMeeting.end_time || null, // Include end_time
        type: 'meeting',
        location: newMeeting.location?.trim() || '',
        attendees: Array.isArray(newMeeting.attendees) ? newMeeting.attendees : [],
        assigned_members: Array.isArray(newMeeting.attendees) ? newMeeting.attendees : [],
        agenda: Array.isArray(newMeeting.agenda) ? newMeeting.agenda.filter(item => item.trim() !== '') : [],
        meeting_status: 'planned',
        created_by: user.id
      };

      console.log('Prepared meeting data:', meetingData);

      const { data, error } = await supabase
        .from('calendar_events')
        .insert([meetingData])
        .select()
        .single();

      if (error) {
        console.error('Create meeting error:', error);
        console.error('Error details:', error.details);
        console.error('Error hint:', error.hint);
        throw error;
      }

      console.log('Meeting created successfully:', data);
      toast.success('Meeting created successfully');
      setShowCreateDialog(false);
      setNewMeeting({
        title: '',
        description: '',
        date: '',
        time: '',
        end_time: '',
        location: '',
        attendees: [],
        agenda: ['']
      });
      fetchMeetings();
    } catch (error) {
      console.error('Error creating meeting:', error);
      toast.error('Failed to create meeting: ' + (error as any).message);
    }
  };

  const openEditDialog = (meeting: Meeting) => {
    setEditMeeting({
      title: meeting.title,
      description: meeting.description || '',
      date: meeting.date,
      time: meeting.time || '',
      end_time: meeting.end_time || '',
      location: meeting.location || '',
      attendees: meeting.attendees || [],
      agenda: meeting.agenda || ['']
    });
    setSelectedMeeting(meeting); // Keep the selected meeting for editing
    setShowEditDialog(true);
  };

  const updateMeeting = async () => {
    if (!editMeeting || !selectedMeeting || !user) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      console.log('Updating meeting ID:', selectedMeeting.id);
      console.log('Update data:', editMeeting);

      const updateData = {
        title: editMeeting.title.trim(),
        description: editMeeting.description?.trim() || '',
        date: editMeeting.date,
        time: editMeeting.time,
        end_time: editMeeting.end_time || null, // Include end_time
        location: editMeeting.location?.trim() || '',
        attendees: Array.isArray(editMeeting.attendees) ? editMeeting.attendees : [],
        assigned_members: Array.isArray(editMeeting.attendees) ? editMeeting.attendees : [],
        agenda: Array.isArray(editMeeting.agenda) ? editMeeting.agenda.filter(item => item.trim() !== '') : [],
        updated_at: new Date().toISOString()
      };

      console.log('Prepared update data:', updateData);

      const { data, error } = await supabase
        .from('calendar_events')
        .update(updateData)
        .eq('id', selectedMeeting.id)
        .select()
        .single();

      if (error) {
        console.error('Update meeting error:', error);
        console.error('Error details:', error.details);
        console.error('Error hint:', error.hint);
        throw error;
      }

      console.log('Meeting updated successfully:', data);
      toast.success('Meeting updated successfully');
      setShowEditDialog(false);
      setEditMeeting(null);
      setSelectedMeeting(null);
      fetchMeetings();
    } catch (error) {
      console.error('Error updating meeting:', error);
      toast.error('Failed to update meeting: ' + (error as any).message);
    }
  };

  const updateMeetingStatus = async (meetingId: string, status: 'planned' | 'ongoing' | 'completed') => {
    try {
      console.log('Updating meeting status:', meetingId, 'to', status);
      
      const { data, error } = await supabase
        .from('calendar_events')
        .update({ 
          meeting_status: status,
          updated_at: new Date().toISOString()
        })
        .eq('id', meetingId)
        .select()
        .single();

      if (error) {
        console.error('Update meeting status error:', error);
        console.error('Error details:', error.details);
        console.error('Error hint:', error.hint);
        throw error;
      }

      console.log('Meeting status updated successfully:', data);
      toast.success(`Meeting ${status}`);
      fetchMeetings();
    } catch (error) {
      console.error('Error updating meeting status:', error);
      toast.error('Failed to update meeting status: ' + (error as any).message);
    }
  };

  const updateMeetingData = async (meetingId: string, updates: Partial<Meeting>) => {
    try {
      const { error } = await supabase
        .from('calendar_events')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', meetingId);

      if (error) throw error;

      toast.success('Meeting updated');
      fetchMeetings();
    } catch (error) {
      console.error('Error updating meeting:', error);
      toast.error('Failed to update meeting');
    }
  };

  const deleteMeeting = async (meetingId: string) => {
    try {
      const { error } = await supabase
        .from('calendar_events')
        .delete()
        .eq('id', meetingId);

      if (error) throw error;

      toast.success('Meeting deleted');
      fetchMeetings();
    } catch (error) {
      console.error('Error deleting meeting:', error);
      toast.error('Failed to delete meeting');
    }
  };

  const addAgendaItem = () => {
    setNewMeeting(prev => ({
      ...prev,
      agenda: [...prev.agenda, '']
    }));
  };

  const updateAgendaItem = (index: number, value: string) => {
    setNewMeeting(prev => ({
      ...prev,
      agenda: prev.agenda.map((item, i) => i === index ? value : item)
    }));
  };

  const removeAgendaItem = (index: number) => {
    setNewMeeting(prev => ({
      ...prev,
      agenda: prev.agenda.filter((_, i) => i !== index)
    }));
  };

  const addBrainstormItem = (item: string) => {
    const newItems = [...brainstormItems, item];
    setBrainstormItems(newItems);
    if (selectedMeeting) {
      updateMeetingData(selectedMeeting.id, { brainstorm_items: newItems });
    }
  };

  const addAgreement = (agreement: string) => {
    const newAgreements = [...agreements, agreement];
    setAgreements(newAgreements);
    if (selectedMeeting) {
      updateMeetingData(selectedMeeting.id, { agreements: newAgreements });
    }
  };

  const addActionItem = (item: string) => {
    const newActionItems = [...actionItems, item];
    setActionItems(newActionItems);
    if (selectedMeeting) {
      updateMeetingData(selectedMeeting.id, { action_items: newActionItems });
    }
  };

  const updateNotes = (notes: string) => {
    setLiveNotes(notes);
    if (selectedMeeting) {
      updateMeetingData(selectedMeeting.id, { meeting_notes: notes });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'planned':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Planned</Badge>;
      case 'ongoing':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Ongoing</Badge>;
      case 'completed':
        return <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">Completed</Badge>;
      default:
        return null;
    }
  };

  const renderMeetingCard = (meeting: Meeting) => (
    <Card key={meeting.id} className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => setSelectedMeeting(meeting)}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg">{meeting.title}</CardTitle>
            <CardDescription className="mt-1">{meeting.description}</CardDescription>
          </div>
          {getStatusBadge(meeting.meeting_status)}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="w-4 h-4" />
            <span>{format(parseISO(meeting.date), 'PPP')}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="w-4 h-4" />
            <span>{meeting.time} {meeting.end_time && `- ${meeting.end_time}`}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Users className="w-4 h-4" />
            <span>{meeting.attendees.length} attendees</span>
          </div>
          {meeting.meeting_status === 'planned' && (
            <div className="flex gap-2 mt-3">
              <Button 
                variant="outline"
                size="sm" 
                onClick={(e) => {
                  e.stopPropagation();
                  openEditDialog(meeting);
                }}
                className="border-gray-300"
              >
                <Edit3 className="w-3 h-3 mr-1" />
                Edit
              </Button>
              <Button 
                size="sm" 
                onClick={(e) => {
                  e.stopPropagation();
                  updateMeetingStatus(meeting.id, 'ongoing');
                }}
                className="bg-green-600 hover:bg-green-700"
              >
                <Play className="w-3 h-3 mr-1" />
                Start
              </Button>
            </div>
          )}
          {meeting.meeting_status === 'ongoing' && (
            <div className="flex gap-2 mt-3">
              <Button 
                size="sm" 
                variant="destructive"
                onClick={(e) => {
                  e.stopPropagation();
                  updateMeetingStatus(meeting.id, 'completed');
                }}
              >
                <Square className="w-3 h-3 mr-1" />
                End Meeting
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );

  const filteredMeetings = meetings.filter(meeting => {
    const today = new Date().toISOString().split('T')[0];
    const meetingDate = meeting.date;
    
    switch (activeTab) {
      case 'planned':
        return meeting.meeting_status === 'planned' && meetingDate >= today;
      case 'ongoing':
        return meeting.meeting_status === 'ongoing';
      case 'completed':
        return meeting.meeting_status === 'completed' || meetingDate < today;
      default:
        return false;
    }
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading meetings...</p>
        </div>
      </div>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Meetings</h1>
          <p className="text-muted-foreground">Manage your team meetings and collaboration</p>
        </div>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-primary hover:bg-primary-dark">
              <Plus className="w-4 h-4 mr-2" />
              Schedule New Meeting
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Schedule New Meeting</DialogTitle>
              <DialogDescription>Create a new meeting with agenda and attendees</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">Meeting Title *</Label>
                  <Input
                    id="title"
                    value={newMeeting.title}
                    onChange={(e) => setNewMeeting(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Team standup, Project review..."
                />
              </div>
              <div>
                <Label htmlFor="location">Location / Meeting Link</Label>
                <Input
                  id="location"
                  value={newMeeting.location}
                  onChange={(e) => setNewMeeting(prev => ({ ...prev, location: e.target.value }))}
                  placeholder="Conference room, Zoom link, etc..."
                />
                </div>
                <div>
                  <Label htmlFor="date">Date *</Label>
                  <Input
                    id="date"
                    type="date"
                    value={newMeeting.date}
                    onChange={(e) => setNewMeeting(prev => ({ ...prev, date: e.target.value }))}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="time">Start Time *</Label>
                  <Input
                    id="time"
                    type="time"
                    value={newMeeting.time}
                    onChange={(e) => setNewMeeting(prev => ({ ...prev, time: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="end_time">End Time</Label>
                  <Input
                    id="end_time"
                    type="time"
                    value={newMeeting.end_time}
                    onChange={(e) => setNewMeeting(prev => ({ ...prev, end_time: e.target.value }))}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newMeeting.description}
                  onChange={(e) => setNewMeeting(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Meeting purpose and context..."
                />
              </div>
              <div>
                <Label>Agenda Items</Label>
                <div className="space-y-2">
                  {newMeeting.agenda.map((item, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        value={item}
                        onChange={(e) => updateAgendaItem(index, e.target.value)}
                        placeholder={`Agenda item ${index + 1}...`}
                      />
                      {newMeeting.agenda.length > 1 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeAgendaItem(index)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addAgendaItem}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Agenda Item
                  </Button>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                Cancel
              </Button>
              <Button 
                onClick={() => {
                  console.log('Create meeting button clicked');
                  createMeeting();
                }}
                disabled={!newMeeting.title || !newMeeting.date || !newMeeting.time}
              >
                Create Meeting
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Meeting Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="planned">Planned Meetings</TabsTrigger>
          <TabsTrigger value="ongoing">Ongoing Meetings</TabsTrigger>
          <TabsTrigger value="completed">Past Meetings</TabsTrigger>
        </TabsList>

        <TabsContent value="planned" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredMeetings.map(renderMeetingCard)}
          </div>
          {filteredMeetings.length === 0 && (
            <div className="text-center py-12">
              <Video className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No planned meetings</h3>
              <p className="text-muted-foreground mb-4">Schedule your first meeting to get started</p>
              <Button onClick={() => setShowCreateDialog(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Schedule Meeting
              </Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="ongoing" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredMeetings.map(renderMeetingCard)}
          </div>
          {filteredMeetings.length === 0 && (
            <div className="text-center py-12">
              <Play className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No ongoing meetings</h3>
              <p className="text-muted-foreground">Start a planned meeting to begin collaboration</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredMeetings.map(renderMeetingCard)}
          </div>
          {filteredMeetings.length === 0 && (
            <div className="text-center py-12">
              <CheckCircle className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No completed meetings</h3>
              <p className="text-muted-foreground">Completed meetings will appear here</p>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Meeting Detail Dialog */}
      <Dialog open={!!selectedMeeting} onOpenChange={() => setSelectedMeeting(null)}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          {selectedMeeting && (
            <>
              <DialogHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <DialogTitle className="text-2xl">{selectedMeeting.title}</DialogTitle>
                    <DialogDescription className="mt-2">
                      {format(parseISO(selectedMeeting.date), 'PPP')} at {selectedMeeting.time || selectedMeeting.start_time}
                      {selectedMeeting.end_time && ` - ${selectedMeeting.end_time}`}
                    </DialogDescription>
                  </div>
                  {getStatusBadge(selectedMeeting.meeting_status)}
                </div>
              </DialogHeader>

              <div className="space-y-6">
                {selectedMeeting.description && (
                  <div>
                    <h4 className="font-medium mb-2">Description</h4>
                    <p className="text-muted-foreground">{selectedMeeting.description}</p>
                  </div>
                )}

                {/* Agenda */}
                <div>
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Agenda
                  </h4>
                  <ul className="space-y-1">
                    {(selectedMeeting.agenda || []).map((item, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <CheckSquare className="w-4 h-4 text-muted-foreground" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Status-specific content */}
                {selectedMeeting.meeting_status === 'ongoing' && (
                  <>
                    <Separator />
                    <div className="space-y-4">
                      <h4 className="font-medium">Live Collaboration Tools</h4>
                      
                      {/* Live Notes */}
                      <div>
                        <Label htmlFor="live-notes" className="flex items-center gap-2 mb-2">
                          <MessageSquare className="w-4 h-4" />
                          Meeting Notes
                        </Label>
                        <Textarea
                          id="live-notes"
                          value={liveNotes}
                          onChange={(e) => updateNotes(e.target.value)}
                          placeholder="Take notes during the meeting..."
                          rows={4}
                        />
                      </div>

                      {/* Brainstorm Board */}
                      <div>
                        <Label className="flex items-center gap-2 mb-2">
                          <Target className="w-4 h-4" />
                          Brainstorm Ideas
                        </Label>
                        <div className="flex gap-2 mb-2">
                          <Input
                            placeholder="Add new idea..."
                            onKeyPress={(e) => {
                              if (e.key === 'Enter') {
                                const target = e.target as HTMLInputElement;
                                if (target.value.trim()) {
                                  addBrainstormItem(target.value.trim());
                                  target.value = '';
                                }
                              }
                            }}
                          />
                        </div>
                        <div className="space-y-2 max-h-24 overflow-y-auto">
                          {(selectedMeeting.brainstorm_items || []).map((item, index) => (
                            <div key={index} className="p-2 bg-yellow-50 border border-yellow-200 rounded">
                              {item}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Agreements */}
                      <div>
                        <Label className="flex items-center gap-2 mb-2">
                          <CheckCircle className="w-4 h-4" />
                          Agreements & Decisions
                        </Label>
                        <div className="flex gap-2 mb-2">
                          <Input
                            placeholder="Record agreement..."
                            onKeyPress={(e) => {
                              if (e.key === 'Enter') {
                                const target = e.target as HTMLInputElement;
                                if (target.value.trim()) {
                                  addAgreement(target.value.trim());
                                  target.value = '';
                                }
                              }
                            }}
                          />
                        </div>
                        <div className="space-y-2 max-h-24 overflow-y-auto">
                          {(selectedMeeting.agreements || []).map((agreement, index) => (
                            <div key={index} className="p-2 bg-green-50 border border-green-200 rounded">
                              {agreement}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Action Items */}
                      <div>
                        <Label className="flex items-center gap-2 mb-2">
                          <CheckSquare className="w-4 h-4" />
                          Action Items
                        </Label>
                        <div className="flex gap-2 mb-2">
                          <Input
                            placeholder="Add action item..."
                            onKeyPress={(e) => {
                              if (e.key === 'Enter') {
                                const target = e.target as HTMLInputElement;
                                if (target.value.trim()) {
                                  addActionItem(target.value.trim());
                                  target.value = '';
                                }
                              }
                            }}
                          />
                        </div>
                        <div className="space-y-2 max-h-24 overflow-y-auto">
                          {(selectedMeeting.action_items || []).map((item, index) => (
                            <div key={index} className="p-2 bg-blue-50 border border-blue-200 rounded">
                              {item}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {selectedMeeting.meeting_status === 'completed' && (
                  <>
                    <Separator />
                    <div className="space-y-4">
                      <h4 className="font-medium">Meeting Summary</h4>
                      
                      {selectedMeeting.meeting_notes && (
                        <div>
                          <Label className="flex items-center gap-2 mb-2">
                            <MessageSquare className="w-4 h-4" />
                            Meeting Notes
                          </Label>
                          <div className="p-3 bg-gray-50 rounded border">
                            {selectedMeeting.meeting_notes}
                          </div>
                        </div>
                      )}

                      {(selectedMeeting.agreements || []).length > 0 && (
                        <div>
                          <Label className="flex items-center gap-2 mb-2">
                            <CheckCircle className="w-4 h-4" />
                            Agreements & Decisions
                          </Label>
                          <div className="space-y-2">
                            {(selectedMeeting.agreements || []).map((agreement, index) => (
                              <div key={index} className="p-2 bg-green-50 border border-green-200 rounded">
                                {agreement}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {(selectedMeeting.action_items || []).length > 0 && (
                        <div>
                          <Label className="flex items-center gap-2 mb-2">
                            <CheckSquare className="w-4 h-4" />
                            Action Items
                          </Label>
                          <div className="space-y-2">
                            {(selectedMeeting.action_items || []).map((item, index) => (
                              <div key={index} className="p-2 bg-blue-50 border border-blue-200 rounded">
                                {item}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </>
                )}

                <Separator />
                
                {/* Meeting Actions */}
                <div className="flex gap-2 justify-end">
                  {selectedMeeting.meeting_status === 'planned' && (
                    <>
                      <Button
                        variant="outline"
                        onClick={() => openEditDialog(selectedMeeting)}
                      >
                        <Edit3 className="w-4 h-4 mr-2" />
                        Edit Meeting
                      </Button>
                      <Button
                        onClick={() => {
                          updateMeetingStatus(selectedMeeting.id, 'ongoing');
                          setSelectedMeeting(null);
                        }}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <Play className="w-4 h-4 mr-2" />
                        Start Meeting
                      </Button>
                    </>
                  )}
                  
                  {selectedMeeting.meeting_status === 'ongoing' && (
                    <Button
                      variant="destructive"
                      onClick={() => {
                        updateMeetingStatus(selectedMeeting.id, 'completed');
                        setSelectedMeeting(null);
                      }}
                    >
                      <Square className="w-4 h-4 mr-2" />
                      End Meeting
                    </Button>
                  )}
                  
                  {selectedMeeting.created_by === user?.id && (
                    <Button
                      variant="outline"
                      className="text-red-600 border-red-300 hover:bg-red-50"
                      onClick={() => {
                        deleteMeeting(selectedMeeting.id);
                        setSelectedMeeting(null);
                      }}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </Button>
                  )}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Meeting Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Meeting</DialogTitle>
            <DialogDescription>Update meeting details and agenda</DialogDescription>
          </DialogHeader>
          {editMeeting && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-title">Meeting Title *</Label>
                  <Input
                    id="edit-title"
                    value={editMeeting.title}
                    onChange={(e) => setEditMeeting(prev => prev ? { ...prev, title: e.target.value } : null)}
                    placeholder="Team standup, Project review..."
                  />
                </div>
                <div>
                  <Label htmlFor="edit-location">Location / Meeting Link</Label>
                  <Input
                    id="edit-location"
                    value={editMeeting.location}
                    onChange={(e) => setEditMeeting(prev => prev ? { ...prev, location: e.target.value } : null)}
                    placeholder="Conference room, Zoom link, etc..."
                  />
                </div>
                <div>
                  <Label htmlFor="edit-date">Date *</Label>
                  <Input
                    id="edit-date"
                    type="date"
                    value={editMeeting.date}
                    onChange={(e) => setEditMeeting(prev => prev ? { ...prev, date: e.target.value } : null)}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-time">Start Time *</Label>
                  <Input
                    id="edit-time"
                    type="time"
                    value={editMeeting.time}
                    onChange={(e) => setEditMeeting(prev => prev ? { ...prev, time: e.target.value } : null)}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-end-time">End Time</Label>
                  <Input
                    id="edit-end-time"
                    type="time"
                    value={editMeeting.end_time}
                    onChange={(e) => setEditMeeting(prev => prev ? { ...prev, end_time: e.target.value } : null)}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  value={editMeeting.description}
                  onChange={(e) => setEditMeeting(prev => prev ? { ...prev, description: e.target.value } : null)}
                  placeholder="Meeting purpose and context..."
                />
              </div>
              <div>
                <Label>Agenda Items</Label>
                <div className="space-y-2">
                  {editMeeting.agenda.map((item, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        value={item}
                        onChange={(e) => {
                          const newAgenda = [...editMeeting.agenda];
                          newAgenda[index] = e.target.value;
                          setEditMeeting(prev => prev ? { ...prev, agenda: newAgenda } : null);
                        }}
                        placeholder={`Agenda item ${index + 1}...`}
                      />
                      {editMeeting.agenda.length > 1 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const newAgenda = editMeeting.agenda.filter((_, i) => i !== index);
                            setEditMeeting(prev => prev ? { ...prev, agenda: newAgenda } : null);
                          }}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setEditMeeting(prev => prev ? { ...prev, agenda: [...prev.agenda, ''] } : null);
                    }}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Agenda Item
                  </Button>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>
              Cancel
            </Button>
            <Button 
              onClick={() => {
                console.log('Update meeting button clicked');
                updateMeeting();
              }}
              disabled={!editMeeting?.title || !editMeeting?.date || !editMeeting?.time}
            >
              Update Meeting
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      </div>
    </Layout>
  );
};

export default Meetings;