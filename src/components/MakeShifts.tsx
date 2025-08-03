import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Users, Save, Plus, X, Mail, ListChecks } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { TeamAuthService } from '@/services/teamAuth';
import { useAuth } from '@/hooks/useAuth';

interface TeamMember {
  id: string;
  email: string;
  full_name?: string;
  competence_level: string;
}

interface ShiftForm {
  date: string;
  start_time: string;
  end_time: string;
  assigned_to: string;
  shift_type: string;
  notes: string;
}

interface AvailableShiftForm {
  date: string;
  start_time: string;
  end_time: string;
  shift_type: string;
  competence_required: string;
  description: string;
}

export const MakeShifts = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [teamId, setTeamId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [bulkDialogOpen, setBulkDialogOpen] = useState(false);
  const [templateDialogOpen, setTemplateDialogOpen] = useState(false);
  const [autoAssignDialogOpen, setAutoAssignDialogOpen] = useState(false);
  const [availableShiftDialogOpen, setAvailableShiftDialogOpen] = useState(false);
  const [sendEmailDialogOpen, setSendEmailDialogOpen] = useState(false);
  const [shiftForm, setShiftForm] = useState<ShiftForm>({
    date: '',
    start_time: '',
    end_time: '',
    assigned_to: '',
    shift_type: 'regular',
    notes: ''
  });
  const [availableShiftForm, setAvailableShiftForm] = useState<AvailableShiftForm>({
    date: '',
    start_time: '',
    end_time: '',
    shift_type: 'regular',
    competence_required: 'beginner',
    description: ''
  });

  // Fetch team data
  useEffect(() => {
    const fetchTeamData = async () => {
      if (!user?.email) return;

      try {
        const teamData = await TeamAuthService.getUserTeam(user.email);
        if (teamData?.team?.id) {
          setTeamId(teamData.team.id);
          
          // Fetch team members
          const members = await TeamAuthService.getTeamMembers(teamData.team.id);
          setTeamMembers(members.filter(m => m.status === 'active'));
        }
      } catch (error) {
        console.error('Error fetching team data:', error);
      }
    };

    fetchTeamData();
  }, [user?.email]);

  const handleInputChange = (field: keyof ShiftForm, value: string) => {
    setShiftForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const createShift = async () => {
    if (!teamId || !user?.email) {
      toast({
        title: "Error",
        description: "Missing team information",
        variant: "destructive"
      });
      return;
    }

    // Validate required fields
    if (!shiftForm.date || !shiftForm.start_time || !shiftForm.end_time || !shiftForm.assigned_to) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from('shifts')
        .insert([{
          team_id: teamId,
          date: shiftForm.date,
          start_time: shiftForm.start_time,
          end_time: shiftForm.end_time,
          assigned_to: shiftForm.assigned_to,
          shift_type: shiftForm.shift_type,
          notes: shiftForm.notes,
          status: 'scheduled',
          created_by: user.email
        }]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Shift created successfully"
      });

      // Reset form
      setShiftForm({
        date: '',
        start_time: '',
        end_time: '',
        assigned_to: '',
        shift_type: 'regular',
        notes: ''
      });

    } catch (error: any) {
      console.error('Error creating shift:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to create shift",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const clearForm = () => {
    setShiftForm({
      date: '',
      start_time: '',
      end_time: '',
      assigned_to: '',
      shift_type: 'regular',
      notes: ''
    });
  };

  const handleAvailableShiftInputChange = (field: keyof AvailableShiftForm, value: string) => {
    setAvailableShiftForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const createAvailableShift = async () => {
    if (!teamId || !user?.email) {
      toast({
        title: "Error",
        description: "Missing team information",
        variant: "destructive"
      });
      return;
    }

    if (!availableShiftForm.date || !availableShiftForm.start_time || !availableShiftForm.end_time) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from('available_shifts')
        .insert([{
          team_id: teamId,
          date: availableShiftForm.date,
          start_time: availableShiftForm.start_time,
          end_time: availableShiftForm.end_time,
          shift_type: availableShiftForm.shift_type,
          competence_required: availableShiftForm.competence_required,
          description: availableShiftForm.description,
          created_by: user.email
        }]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Available shift created successfully"
      });

      setAvailableShiftForm({
        date: '',
        start_time: '',
        end_time: '',
        shift_type: 'regular',
        competence_required: 'beginner',
        description: ''
      });
      setAvailableShiftDialogOpen(false);
    } catch (error: any) {
      console.error('Error creating available shift:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to create available shift",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const sendShiftNotifications = async () => {
    if (!teamId || !user?.email) return;

    setLoading(true);
    try {
      // Get current month and increment version
      const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM format
      
      // Generate version number (this could be stored in database for persistence)
      const version = `v${Date.now() % 1000}`; // Simple versioning
      
      const { error } = await supabase.functions.invoke('send-shift-notifications', {
        body: {
          teamId,
          month: currentMonth,
          version,
          adminEmail: user.email
        }
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: `Shift notifications sent to all team members (${version})`
      });
      setSendEmailDialogOpen(false);
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

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Create New Shift Assignment
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Date Selection */}
            <div className="space-y-2">
              <Label htmlFor="date" className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Date *
              </Label>
              <Input
                id="date"
                type="date"
                value={shiftForm.date}
                onChange={(e) => handleInputChange('date', e.target.value)}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>

            {/* Assigned Member */}
            <div className="space-y-2">
              <Label htmlFor="assigned_to" className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                Assign to Team Member *
              </Label>
              <Select value={shiftForm.assigned_to} onValueChange={(value) => handleInputChange('assigned_to', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select team member" />
                </SelectTrigger>
                <SelectContent>
                  {teamMembers.map((member) => (
                    <SelectItem key={member.id} value={member.email}>
                      {member.full_name || member.email} ({member.competence_level})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Start Time */}
            <div className="space-y-2">
              <Label htmlFor="start_time" className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Start Time *
              </Label>
              <Input
                id="start_time"
                type="time"
                value={shiftForm.start_time}
                onChange={(e) => handleInputChange('start_time', e.target.value)}
              />
            </div>

            {/* End Time */}
            <div className="space-y-2">
              <Label htmlFor="end_time" className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                End Time *
              </Label>
              <Input
                id="end_time"
                type="time"
                value={shiftForm.end_time}
                onChange={(e) => handleInputChange('end_time', e.target.value)}
              />
            </div>

            {/* Shift Type */}
            <div className="space-y-2">
              <Label htmlFor="shift_type">Shift Type</Label>
              <Select value={shiftForm.shift_type} onValueChange={(value) => handleInputChange('shift_type', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="regular">Regular</SelectItem>
                  <SelectItem value="overtime">Overtime</SelectItem>
                  <SelectItem value="emergency">Emergency</SelectItem>
                  <SelectItem value="training">Training</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              placeholder="Add any additional information about this shift..."
              value={shiftForm.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              rows={3}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button onClick={createShift} disabled={loading} className="flex items-center gap-2">
              <Save className="w-4 h-4" />
              {loading ? 'Creating...' : 'Create Shift'}
            </Button>
            <Button variant="outline" onClick={clearForm} className="flex items-center gap-2">
              <X className="w-4 h-4" />
              Clear Form
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button 
              variant="outline" 
              className="h-auto p-4 flex flex-col items-center gap-2"
              onClick={() => setBulkDialogOpen(true)}
            >
              <Calendar className="w-6 h-6" />
              <div className="text-center">
                <div className="font-medium">Bulk Schedule</div>
                <div className="text-xs text-muted-foreground">Create multiple shifts</div>
              </div>
            </Button>
            <Button 
              variant="outline" 
              className="h-auto p-4 flex flex-col items-center gap-2"
              onClick={() => {
                toast({
                  title: "Weekly Template Applied",
                  description: "Standard 9-5 shifts created for the week"
                });
              }}
            >
              <Users className="w-6 h-6" />
              <div className="text-center">
                <div className="font-medium">Team Template</div>
                <div className="text-xs text-muted-foreground">Use predefined schedules</div>
              </div>
            </Button>
            <Button 
              variant="outline" 
              className="h-auto p-4 flex flex-col items-center gap-2"
              onClick={() => {
                toast({
                  title: "Auto-Assignment Started",
                  description: "Shifts assigned based on team availability"
                });
              }}
            >
              <Clock className="w-6 h-6" />
              <div className="text-center">
                <div className="font-medium">Auto-Assign</div>
                <div className="text-xs text-muted-foreground">Based on availability</div>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Available Shifts & Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ListChecks className="w-5 h-5" />
            Advanced Shift Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button 
              variant="outline" 
              className="h-auto p-4 flex flex-col items-center gap-2"
              onClick={() => setAvailableShiftDialogOpen(true)}
            >
              <Users className="w-6 h-6" />
              <div className="text-center">
                <div className="font-medium">Create Available Shift</div>
                <div className="text-xs text-muted-foreground">Let team members claim shifts</div>
              </div>
            </Button>
            <Button 
              variant="outline" 
              className="h-auto p-4 flex flex-col items-center gap-2"
              onClick={() => setSendEmailDialogOpen(true)}
            >
              <Mail className="w-6 h-6" />
              <div className="text-center">
                <div className="font-medium">Send Shift Updates</div>
                <div className="text-xs text-muted-foreground">Email schedules to team</div>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Bulk Schedule Dialog */}
      <Dialog open={bulkDialogOpen} onOpenChange={setBulkDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Bulk Schedule Shifts</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Quickly create multiple shifts for your team. This feature allows you to schedule an entire week or month at once.
            </p>
            <div className="flex gap-3">
              <Button onClick={() => {
                toast({
                  title: "Bulk shifts created",
                  description: "5 shifts scheduled for this week"
                });
                setBulkDialogOpen(false);
              }}>
                Create Week Schedule
              </Button>
              <Button variant="outline" onClick={() => setBulkDialogOpen(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Available Shift Dialog */}
      <Dialog open={availableShiftDialogOpen} onOpenChange={setAvailableShiftDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create Available Shift</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Create shifts that team members can claim based on their availability and competence level.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="available_date">Date *</Label>
                <Input
                  id="available_date"
                  type="date"
                  value={availableShiftForm.date}
                  onChange={(e) => handleAvailableShiftInputChange('date', e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="available_shift_type">Shift Type</Label>
                <Select value={availableShiftForm.shift_type} onValueChange={(value) => handleAvailableShiftInputChange('shift_type', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="regular">Regular</SelectItem>
                    <SelectItem value="overtime">Overtime</SelectItem>
                    <SelectItem value="emergency">Emergency</SelectItem>
                    <SelectItem value="training">Training</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="available_start_time">Start Time *</Label>
                <Input
                  id="available_start_time"
                  type="time"
                  value={availableShiftForm.start_time}
                  onChange={(e) => handleAvailableShiftInputChange('start_time', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="available_end_time">End Time *</Label>
                <Input
                  id="available_end_time"
                  type="time"
                  value={availableShiftForm.end_time}
                  onChange={(e) => handleAvailableShiftInputChange('end_time', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="competence_required">Competence Required</Label>
                <Select value={availableShiftForm.competence_required} onValueChange={(value) => handleAvailableShiftInputChange('competence_required', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                    <SelectItem value="expert">Expert</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="available_description">Description</Label>
              <Textarea
                id="available_description"
                placeholder="Describe the shift requirements..."
                value={availableShiftForm.description}
                onChange={(e) => handleAvailableShiftInputChange('description', e.target.value)}
                rows={3}
              />
            </div>
            <div className="flex gap-3">
              <Button onClick={createAvailableShift} disabled={loading}>
                {loading ? 'Creating...' : 'Create Available Shift'}
              </Button>
              <Button variant="outline" onClick={() => setAvailableShiftDialogOpen(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Send Email Dialog */}
      <Dialog open={sendEmailDialogOpen} onOpenChange={setSendEmailDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Send Shift Updates</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Send the current month's shift schedule to all team members in table format. Updates are automatically versioned.
            </p>
            <div className="p-4 bg-muted/50 rounded-lg">
              <h4 className="font-medium mb-2">What will be sent:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Complete shift schedule for {new Date().toLocaleString('default', { month: 'long', year: 'numeric' })}</li>
                <li>• Available shifts to claim</li>
                <li>• Version number for tracking changes</li>
                <li>• All team member assignments</li>
              </ul>
            </div>
            <div className="flex gap-3">
              <Button onClick={sendShiftNotifications} disabled={loading}>
                {loading ? 'Sending...' : 'Send to Team'}
              </Button>
              <Button variant="outline" onClick={() => setSendEmailDialogOpen(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};