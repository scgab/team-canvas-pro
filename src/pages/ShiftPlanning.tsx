import { useState, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Clock, 
  Plus, 
  Users, 
  Calendar as CalendarIcon, 
  BarChart3,
  UserCog,
  ClipboardList,
  CheckCircle,
  AlertCircle,
  RotateCcw,
  Bell
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { AvailabilityDialog } from "@/components/AvailabilityDialog";
import { ShiftReports } from "@/components/ShiftReports";
import { BulkShiftDialog } from "@/components/BulkShiftDialog";

interface TeamMember {
  id: string;
  email: string;
  name: string;
  role: string;
  competence_level: string;
  hourly_rate: number;
}

interface Shift {
  id: string;
  assigned_to: string | null;
  date: string;
  start_time: string;
  end_time: string;
  shift_type: string;
  status: string;
  notes: string | null;
  created_by: string;
}

interface AvailableShift {
  id: string;
  date: string;
  start_time: string;
  end_time: string;
  shift_type: string;
  competence_required: string;
  description: string | null;
  claimed_by: string | null;
  created_by: string;
}

const ShiftPlanning = () => {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [userRole, setUserRole] = useState<string>('member');
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [availableShifts, setAvailableShifts] = useState<AvailableShift[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [viewMode, setViewMode] = useState<'month' | 'week'>('month');
  const [availabilityDialogOpen, setAvailabilityDialogOpen] = useState(false);
  const [bulkShiftDialogOpen, setBulkShiftDialogOpen] = useState(false);
  
  // Form states
  const [newShift, setNewShift] = useState({
    assigned_to: '',
    date: '',
    start_time: '',
    end_time: '',
    shift_type: 'regular',
    notes: ''
  });
  
  const [newAvailableShift, setNewAvailableShift] = useState({
    date: '',
    start_time: '',
    end_time: '',
    shift_type: 'regular',
    competence_required: 'beginner',
    description: ''
  });

  useEffect(() => {
    checkUserRole();
    fetchTeamMembers();
    fetchShifts();
    fetchAvailableShifts();
    setupRealTimeUpdates();
  }, []);

  const setupRealTimeUpdates = () => {
    // Listen for shifts changes
    const shiftsChannel = supabase
      .channel('shifts-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'shifts' },
        () => fetchShifts()
      )
      .subscribe();

    // Listen for available shifts changes
    const availableShiftsChannel = supabase
      .channel('available-shifts-changes')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'available_shifts' },
        () => fetchAvailableShifts()
      )
      .subscribe();

    // Listen for team member changes
    const teamChannel = supabase
      .channel('team-changes')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'team_members' },
        () => fetchTeamMembers()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(shiftsChannel);
      supabase.removeChannel(availableShiftsChannel);
      supabase.removeChannel(teamChannel);
    };
  };

  const checkUserRole = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      setCurrentUser(user);
      const { data: member } = await supabase
        .from('team_members')
        .select('role')
        .eq('email', user.email)
        .single();
      
      if (member) {
        setUserRole(member.role);
      } else {
        // Auto-create team member if doesn't exist
        await supabase
          .from('team_members')
          .insert({
            email: user.email || '',
            name: user.user_metadata?.full_name || user.email || 'Unknown',
            role: 'member'
          });
        setUserRole('member');
      }
    }
  };

  const fetchTeamMembers = async () => {
    const { data, error } = await supabase
      .from('team_members')
      .select('*')
      .order('name');
    
    if (error) {
      console.error('Error fetching team members:', error);
      return;
    }
    
    setTeamMembers(data || []);
  };

  const fetchShifts = async () => {
    const { data, error } = await supabase
      .from('shifts')
      .select('*')
      .order('date', { ascending: true });
    
    if (error) {
      console.error('Error fetching shifts:', error);
      return;
    }
    
    setShifts(data || []);
  };

  const fetchAvailableShifts = async () => {
    const { data, error } = await supabase
      .from('available_shifts')
      .select('*')
      .order('date', { ascending: true });
    
    if (error) {
      console.error('Error fetching available shifts:', error);
      return;
    }
    
    setAvailableShifts(data || []);
  };

  const createShift = async () => {
    try {
      const { error } = await supabase
        .from('shifts')
        .insert({
          ...newShift,
          created_by: currentUser?.email || ''
        });

      if (error) throw error;

      toast.success('Shift created successfully');
      setNewShift({
        assigned_to: '',
        date: '',
        start_time: '',
        end_time: '',
        shift_type: 'regular',
        notes: ''
      });
      fetchShifts();
    } catch (error: any) {
      toast.error('Failed to create shift: ' + error.message);
    }
  };

  const createAvailableShift = async () => {
    try {
      const { error } = await supabase
        .from('available_shifts')
        .insert({
          ...newAvailableShift,
          created_by: currentUser?.email || ''
        });

      if (error) throw error;

      toast.success('Available shift posted successfully');
      setNewAvailableShift({
        date: '',
        start_time: '',
        end_time: '',
        shift_type: 'regular',
        competence_required: 'beginner',
        description: ''
      });
      fetchAvailableShifts();
    } catch (error: any) {
      toast.error('Failed to post available shift: ' + error.message);
    }
  };

  const claimShift = async (shiftId: string) => {
    try {
      const { error } = await supabase
        .from('available_shifts')
        .update({ claimed_by: currentUser?.email })
        .eq('id', shiftId);

      if (error) throw error;

      toast.success('Shift claimed successfully');
      fetchAvailableShifts();
    } catch (error: any) {
      toast.error('Failed to claim shift: ' + error.message);
    }
  };

  const getShiftsForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return shifts.filter(shift => shift.date === dateStr);
  };

  const getMyShifts = () => {
    return shifts.filter(shift => shift.assigned_to === currentUser?.email);
  };

  const getUnclaimedAvailableShifts = () => {
    return availableShifts.filter(shift => !shift.claimed_by);
  };

  const AdminView = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Shift Planning</h1>
          <Badge variant="secondary" className="mt-2">Admin</Badge>
        </div>
        <div className="flex gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button><Plus className="w-4 h-4 mr-2" />Create Shift</Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Create New Shift</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="assigned_to">Assign To</Label>
                  <Select value={newShift.assigned_to} onValueChange={(value) => setNewShift({...newShift, assigned_to: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select team member" />
                    </SelectTrigger>
                    <SelectContent>
                      {teamMembers.map(member => (
                        <SelectItem key={member.id} value={member.email}>
                          {member.name} ({member.competence_level})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="date">Date</Label>
                  <Input 
                    type="date" 
                    value={newShift.date}
                    onChange={(e) => setNewShift({...newShift, date: e.target.value})}
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label htmlFor="start_time">Start Time</Label>
                    <Input 
                      type="time" 
                      value={newShift.start_time}
                      onChange={(e) => setNewShift({...newShift, start_time: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="end_time">End Time</Label>
                    <Input 
                      type="time" 
                      value={newShift.end_time}
                      onChange={(e) => setNewShift({...newShift, end_time: e.target.value})}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="shift_type">Type</Label>
                  <Select value={newShift.shift_type} onValueChange={(value) => setNewShift({...newShift, shift_type: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="regular">Regular</SelectItem>
                      <SelectItem value="overtime">Overtime</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea 
                    value={newShift.notes}
                    onChange={(e) => setNewShift({...newShift, notes: e.target.value})}
                  />
                </div>
                <Button onClick={createShift} className="w-full">Create Shift</Button>
              </div>
            </DialogContent>
          </Dialog>
          
          <Button 
            variant="outline" 
            onClick={() => setBulkShiftDialogOpen(true)}
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Bulk Create
          </Button>
          
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline"><ClipboardList className="w-4 h-4 mr-2" />Post Available Shift</Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Post Available Shift</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="date">Date</Label>
                  <Input 
                    type="date" 
                    value={newAvailableShift.date}
                    onChange={(e) => setNewAvailableShift({...newAvailableShift, date: e.target.value})}
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label htmlFor="start_time">Start Time</Label>
                    <Input 
                      type="time" 
                      value={newAvailableShift.start_time}
                      onChange={(e) => setNewAvailableShift({...newAvailableShift, start_time: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="end_time">End Time</Label>
                    <Input 
                      type="time" 
                      value={newAvailableShift.end_time}
                      onChange={(e) => setNewAvailableShift({...newAvailableShift, end_time: e.target.value})}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="competence_required">Competence Required</Label>
                  <Select value={newAvailableShift.competence_required} onValueChange={(value) => setNewAvailableShift({...newAvailableShift, competence_required: value})}>
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
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea 
                    value={newAvailableShift.description}
                    onChange={(e) => setNewAvailableShift({...newAvailableShift, description: e.target.value})}
                  />
                </div>
                <Button onClick={createAvailableShift} className="w-full">Post Shift</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Tabs defaultValue="schedule" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="schedule">Schedule Shifts</TabsTrigger>
          <TabsTrigger value="available">Available Shifts</TabsTrigger>
          <TabsTrigger value="team">Team Management</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>
        
        <TabsContent value="schedule" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle>Calendar</CardTitle>
              </CardHeader>
              <CardContent>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => date && setSelectedDate(date)}
                  className="rounded-md border"
                />
              </CardContent>
            </Card>
            
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Shifts for {selectedDate.toDateString()}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {getShiftsForDate(selectedDate).map(shift => (
                    <div key={shift.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <Clock className="w-4 h-4" />
                        <div>
                          <p className="font-medium">{shift.start_time} - {shift.end_time}</p>
                          <p className="text-sm text-muted-foreground">
                            {teamMembers.find(m => m.email === shift.assigned_to)?.name || shift.assigned_to}
                          </p>
                        </div>
                      </div>
                      <Badge variant={shift.shift_type === 'overtime' ? 'destructive' : 'default'}>
                        {shift.shift_type}
                      </Badge>
                    </div>
                  ))}
                  {getShiftsForDate(selectedDate).length === 0 && (
                    <p className="text-muted-foreground text-center py-8">No shifts scheduled for this date</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="available" className="space-y-4">
          <div className="grid gap-4">
            {availableShifts.map(shift => (
              <Card key={shift.id}>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{new Date(shift.date).toDateString()}</p>
                      <p className="text-sm text-muted-foreground">
                        {shift.start_time} - {shift.end_time} • {shift.competence_required} level required
                      </p>
                      {shift.description && (
                        <p className="text-sm mt-1">{shift.description}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {shift.claimed_by ? (
                        <Badge variant="secondary">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Claimed by {teamMembers.find(m => m.email === shift.claimed_by)?.name || shift.claimed_by}
                        </Badge>
                      ) : (
                        <Badge variant="outline">
                          <AlertCircle className="w-3 h-3 mr-1" />
                          Available
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="team" className="space-y-4">
          <div className="grid gap-4">
            {teamMembers.map(member => (
              <Card key={member.id}>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback>
                        {member.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="font-medium">{member.name}</p>
                      <p className="text-sm text-muted-foreground">{member.email}</p>
                    </div>
                    <div className="text-right">
                      <Badge variant={member.role === 'admin' ? 'default' : 'secondary'}>
                        {member.role}
                      </Badge>
                      <p className="text-sm text-muted-foreground mt-1">
                        {member.competence_level} • ${member.hourly_rate}/hr
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="reports" className="space-y-4">
          <ShiftReports teamMembers={teamMembers} shifts={shifts} />
        </TabsContent>
      </Tabs>
      
      <BulkShiftDialog
        open={bulkShiftDialogOpen}
        onOpenChange={setBulkShiftDialogOpen}
        teamMembers={teamMembers}
        onShiftsCreated={fetchShifts}
        userEmail={currentUser?.email || ''}
      />
    </div>
  );

  const MemberView = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">My Shift Schedule</h1>
          <Badge variant="outline" className="mt-2">Team Member</Badge>
        </div>
      </div>

      <Tabs defaultValue="my-shifts" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="my-shifts">My Shifts</TabsTrigger>
          <TabsTrigger value="available">Available Shifts</TabsTrigger>
          <TabsTrigger value="availability">My Availability</TabsTrigger>
          <TabsTrigger value="reports">My Reports</TabsTrigger>
        </TabsList>
        
        <TabsContent value="my-shifts" className="space-y-4">
          <div className="grid gap-4">
            {getMyShifts().map(shift => (
              <Card key={shift.id}>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Clock className="w-4 h-4" />
                      <div>
                        <p className="font-medium">{new Date(shift.date).toDateString()}</p>
                        <p className="text-sm text-muted-foreground">
                          {shift.start_time} - {shift.end_time}
                        </p>
                        {shift.notes && (
                          <p className="text-sm mt-1">{shift.notes}</p>
                        )}
                      </div>
                    </div>
                    <Badge variant={shift.status === 'completed' ? 'default' : 'secondary'}>
                      {shift.status}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
            {getMyShifts().length === 0 && (
              <Card>
                <CardContent className="pt-6">
                  <p className="text-muted-foreground text-center">No shifts assigned to you</p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="available" className="space-y-4">
          <div className="grid gap-4">
            {getUnclaimedAvailableShifts().map(shift => (
              <Card key={shift.id}>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{new Date(shift.date).toDateString()}</p>
                      <p className="text-sm text-muted-foreground">
                        {shift.start_time} - {shift.end_time} • {shift.competence_required} level required
                      </p>
                      {shift.description && (
                        <p className="text-sm mt-1">{shift.description}</p>
                      )}
                    </div>
                    <Button onClick={() => claimShift(shift.id)} size="sm">
                      Claim Shift
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
            {getUnclaimedAvailableShifts().length === 0 && (
              <Card>
                <CardContent className="pt-6">
                  <p className="text-muted-foreground text-center">No available shifts to claim</p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="availability" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Mark Your Availability</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => date && setSelectedDate(date)}
                  className="rounded-md border"
                />
                <Button 
                  onClick={() => setAvailabilityDialogOpen(true)}
                  className="w-full"
                >
                  <CalendarIcon className="w-4 h-4 mr-2" />
                  Set Availability for {selectedDate.toDateString()}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="reports" className="space-y-4">
          <ShiftReports 
            teamMembers={teamMembers.filter(m => m.email === currentUser?.email)} 
            shifts={getMyShifts()} 
          />
        </TabsContent>
      </Tabs>
      
      <AvailabilityDialog
        open={availabilityDialogOpen}
        onOpenChange={setAvailabilityDialogOpen}
        selectedDate={selectedDate}
        userEmail={currentUser?.email || ''}
      />
    </div>
  );

  return (
    <Layout>
      {userRole === 'admin' ? <AdminView /> : <MemberView />}
    </Layout>
  );
};

export default ShiftPlanning;