import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Calendar, Clock, Copy, RotateCcw } from "lucide-react";

interface BulkShiftDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  teamMembers: Array<{ id: string; email: string; name: string; }>;
  onShiftsCreated: () => void;
  userEmail: string;
}

export const BulkShiftDialog = ({ open, onOpenChange, teamMembers, onShiftsCreated, userEmail }: BulkShiftDialogProps) => {
  const [mode, setMode] = useState<'recurring' | 'copy'>('recurring');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('17:00');
  const [shiftType, setShiftType] = useState('regular');
  const [selectedDays, setSelectedDays] = useState<number[]>([1, 2, 3, 4, 5]); // Mon-Fri by default
  const [loading, setLoading] = useState(false);

  const daysOfWeek = [
    { value: 1, label: 'Monday' },
    { value: 2, label: 'Tuesday' },
    { value: 3, label: 'Wednesday' },
    { value: 4, label: 'Thursday' },
    { value: 5, label: 'Friday' },
    { value: 6, label: 'Saturday' },
    { value: 0, label: 'Sunday' }
  ];

  const toggleDay = (day: number) => {
    setSelectedDays(prev => 
      prev.includes(day) 
        ? prev.filter(d => d !== day)
        : [...prev, day]
    );
  };

  const generateShifts = async () => {
    if (!startDate || !endDate || !assignedTo) {
      toast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);

    try {
      const shifts = [];
      const start = new Date(startDate);
      const end = new Date(endDate);

      for (let date = new Date(start); date <= end; date.setDate(date.getDate() + 1)) {
        const dayOfWeek = date.getDay();
        
        if (selectedDays.includes(dayOfWeek)) {
          shifts.push({
            assigned_to: assignedTo,
            date: date.toISOString().split('T')[0],
            start_time: startTime,
            end_time: endTime,
            shift_type: shiftType,
            status: 'scheduled',
            created_by: userEmail,
            notes: `Bulk created ${mode} shift`
          });
        }
      }

      if (shifts.length === 0) {
        toast.error('No shifts would be created with the selected criteria');
        return;
      }

      const { error } = await supabase
        .from('shifts')
        .insert(shifts);

      if (error) throw error;

      toast.success(`Successfully created ${shifts.length} shifts`);
      onShiftsCreated();
      onOpenChange(false);
      resetForm();
    } catch (error: any) {
      toast.error('Failed to create shifts: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setStartDate('');
    setEndDate('');
    setAssignedTo('');
    setStartTime('09:00');
    setEndTime('17:00');
    setShiftType('regular');
    setSelectedDays([1, 2, 3, 4, 5]);
  };

  const getShiftPreview = () => {
    if (!startDate || !endDate || selectedDays.length === 0) return 0;
    
    const start = new Date(startDate);
    const end = new Date(endDate);
    let count = 0;

    for (let date = new Date(start); date <= end; date.setDate(date.getDate() + 1)) {
      const dayOfWeek = date.getDay();
      if (selectedDays.includes(dayOfWeek)) {
        count++;
      }
    }

    return count;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <RotateCcw className="w-4 h-4" />
            Bulk Shift Creation
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label>Creation Mode</Label>
            <Select value={mode} onValueChange={(value: 'recurring' | 'copy') => setMode(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recurring">Recurring Shifts</SelectItem>
                <SelectItem value="copy">Copy Existing Pattern</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label htmlFor="start-date">Start Date</Label>
              <Input
                id="start-date"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="end-date">End Date</Label>
              <Input
                id="end-date"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="assigned-to">Assign To</Label>
            <Select value={assignedTo} onValueChange={setAssignedTo}>
              <SelectTrigger>
                <SelectValue placeholder="Select team member" />
              </SelectTrigger>
              <SelectContent>
                {teamMembers.map(member => (
                  <SelectItem key={member.id} value={member.email}>
                    {member.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label htmlFor="start-time">Start Time</Label>
              <Input
                id="start-time"
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="end-time">End Time</Label>
              <Input
                id="end-time"
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="shift-type">Shift Type</Label>
            <Select value={shiftType} onValueChange={setShiftType}>
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
            <Label className="text-sm font-medium mb-3 block">Days of Week</Label>
            <div className="grid grid-cols-4 gap-2">
              {daysOfWeek.map(day => (
                <div key={day.value} className="flex items-center space-x-2">
                  <Checkbox
                    id={`day-${day.value}`}
                    checked={selectedDays.includes(day.value)}
                    onCheckedChange={() => toggleDay(day.value)}
                  />
                  <Label htmlFor={`day-${day.value}`} className="text-xs">
                    {day.label.slice(0, 3)}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {startDate && endDate && (
            <div className="bg-muted p-3 rounded-lg">
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="w-4 h-4" />
                <span className="font-medium">Preview:</span>
                <Badge variant="secondary">
                  {getShiftPreview()} shifts will be created
                </Badge>
              </div>
            </div>
          )}

          <div className="flex gap-2 pt-4">
            <Button 
              onClick={generateShifts} 
              disabled={loading || !startDate || !endDate || !assignedTo}
              className="flex-1"
            >
              {loading ? 'Creating...' : `Create ${getShiftPreview()} Shifts`}
            </Button>
            <Button 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};