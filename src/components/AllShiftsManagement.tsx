import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Edit, Trash2, UserPlus, Calendar } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { TeamAuthService } from '@/services/teamAuth';

interface Shift {
  id: string;
  date: string;
  start_time: string;
  end_time: string;
  assigned_to: string | null;
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

interface TeamMember {
  id: string;
  email: string;
  full_name?: string;
  competence_level: string;
}

interface AllShiftsManagementProps {
  onRefresh?: () => void;
}

export const AllShiftsManagement = ({ onRefresh }: AllShiftsManagementProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [availableShifts, setAvailableShifts] = useState<AvailableShift[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [teamId, setTeamId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [editingShift, setEditingShift] = useState<Shift | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  useEffect(() => {
    fetchData();
  }, [user?.email]);

  const fetchData = async () => {
    if (!user?.email) return;

    try {
      const teamData = await TeamAuthService.getUserTeam(user.email);
      if (teamData?.team?.id) {
        setTeamId(teamData.team.id);
        
        // Fetch team members
        const members = await TeamAuthService.getTeamMembers(teamData.team.id);
        setTeamMembers(members.filter(m => m.status === 'active'));

        // Fetch shifts
        const { data: shiftsData, error: shiftsError } = await supabase
          .from('shifts')
          .select('*')
          .eq('team_id', teamData.team.id)
          .order('date', { ascending: true });

        if (!shiftsError && shiftsData) {
          setShifts(shiftsData);
        }

        // Fetch available shifts
        const { data: availableShiftsData, error: availableError } = await supabase
          .from('available_shifts')
          .select('*')
          .eq('team_id', teamData.team.id)
          .order('date', { ascending: true });

        if (!availableError && availableShiftsData) {
          setAvailableShifts(availableShiftsData);
        }
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const deleteShift = async (shiftId: string) => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('shifts')
        .delete()
        .eq('id', shiftId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Shift deleted successfully"
      });

      fetchData();
      onRefresh?.();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete shift",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteAvailableShift = async (shiftId: string) => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('available_shifts')
        .delete()
        .eq('id', shiftId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Available shift deleted successfully"
      });

      fetchData();
      onRefresh?.();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete available shift",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const updateShiftAssignment = async (shiftId: string, newAssignee: string) => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('shifts')
        .update({ assigned_to: newAssignee })
        .eq('id', shiftId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Shift assignment updated successfully"
      });

      fetchData();
      onRefresh?.();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update assignment",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getMemberName = (email: string) => {
    const member = teamMembers.find(m => m.email === email);
    return member?.full_name || email;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Regular Shifts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            All Scheduled Shifts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {shifts.length > 0 ? (
              shifts.map((shift) => (
                <div key={shift.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-medium">{shift.shift_type} Shift</h3>
                      <Badge className={getStatusColor(shift.status)}>
                        {shift.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">
                      <strong>{new Date(shift.date).toLocaleDateString()}</strong> • {shift.start_time} - {shift.end_time}
                    </p>
                    <p className="text-sm text-gray-500">
                      Assigned to: {shift.assigned_to ? getMemberName(shift.assigned_to) : 'Unassigned'}
                    </p>
                    {shift.notes && (
                      <p className="text-xs text-gray-400 mt-1">{shift.notes}</p>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {/* Reassign dropdown */}
                    <Select 
                      value={shift.assigned_to || ''} 
                      onValueChange={(value) => updateShiftAssignment(shift.id, value)}
                      disabled={loading}
                    >
                      <SelectTrigger className="w-40">
                        <SelectValue placeholder="Reassign" />
                      </SelectTrigger>
                      <SelectContent>
                        {teamMembers.map((member) => (
                          <SelectItem key={member.id} value={member.email}>
                            {member.full_name || member.email}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setEditingShift(shift);
                        setEditDialogOpen(true);
                      }}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => deleteShift(shift.id)}
                      disabled={loading}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p className="text-gray-500">No shifts found</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Available Shifts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserPlus className="w-5 h-5" />
            Available Shifts (Claimable)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {availableShifts.length > 0 ? (
              availableShifts.map((shift) => (
                <div key={shift.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-medium">{shift.shift_type} Shift</h3>
                      {shift.claimed_by && (
                        <Badge className="bg-green-100 text-green-800">
                          Claimed by {getMemberName(shift.claimed_by)}
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">
                      <strong>{new Date(shift.date).toLocaleDateString()}</strong> • {shift.start_time} - {shift.end_time}
                    </p>
                    <p className="text-sm text-gray-500">
                      Competence Required: {shift.competence_required}
                    </p>
                    {shift.description && (
                      <p className="text-xs text-gray-400 mt-1">{shift.description}</p>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => deleteAvailableShift(shift.id)}
                      disabled={loading}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <UserPlus className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p className="text-gray-500">No available shifts</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Edit Shift Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Shift</DialogTitle>
          </DialogHeader>
          {editingShift && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Date</Label>
                  <Input 
                    type="date" 
                    value={editingShift.date}
                    onChange={(e) => setEditingShift({...editingShift, date: e.target.value})}
                  />
                </div>
                <div>
                  <Label>Status</Label>
                  <Select 
                    value={editingShift.status} 
                    onValueChange={(value) => setEditingShift({...editingShift, status: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="scheduled">Scheduled</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button 
                  onClick={async () => {
                    setLoading(true);
                    try {
                      const { error } = await supabase
                        .from('shifts')
                        .update({
                          date: editingShift.date,
                          status: editingShift.status,
                          notes: editingShift.notes
                        })
                        .eq('id', editingShift.id);

                      if (error) throw error;

                      toast({
                        title: "Success",
                        description: "Shift updated successfully"
                      });

                      setEditDialogOpen(false);
                      fetchData();
                      onRefresh?.();
                    } catch (error: any) {
                      toast({
                        title: "Error",
                        description: error.message || "Failed to update shift",
                        variant: "destructive"
                      });
                    } finally {
                      setLoading(false);
                    }
                  }}
                  disabled={loading}
                >
                  Save Changes
                </Button>
                <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};