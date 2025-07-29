import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { CalendarDays, Clock } from "lucide-react";

interface AvailabilityDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedDate: Date;
  userEmail: string;
}

interface Availability {
  id: string;
  team_member_email: string;
  date: string;
  is_available: boolean;
  preferred_start_time: string | null;
  preferred_end_time: string | null;
  notes: string | null;
}

export const AvailabilityDialog = ({ open, onOpenChange, selectedDate, userEmail }: AvailabilityDialogProps) => {
  const [availability, setAvailability] = useState<Availability | null>(null);
  const [isAvailable, setIsAvailable] = useState(true);
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('17:00');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open && selectedDate) {
      fetchAvailability();
    }
  }, [open, selectedDate, userEmail]);

  const fetchAvailability = async () => {
    const dateStr = selectedDate.toISOString().split('T')[0];
    
    const { data, error } = await supabase
      .from('availability')
      .select('*')
      .eq('team_member_email', userEmail)
      .eq('date', dateStr)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching availability:', error);
      return;
    }

    if (data) {
      setAvailability(data);
      setIsAvailable(data.is_available);
      setStartTime(data.preferred_start_time || '09:00');
      setEndTime(data.preferred_end_time || '17:00');
      setNotes(data.notes || '');
    } else {
      // Reset to defaults for new availability
      setAvailability(null);
      setIsAvailable(true);
      setStartTime('09:00');
      setEndTime('17:00');
      setNotes('');
    }
  };

  const saveAvailability = async () => {
    setLoading(true);
    const dateStr = selectedDate.toISOString().split('T')[0];

    try {
      const availabilityData = {
        team_member_email: userEmail,
        date: dateStr,
        is_available: isAvailable,
        preferred_start_time: isAvailable ? startTime : null,
        preferred_end_time: isAvailable ? endTime : null,
        notes: notes.trim() || null
      };

      if (availability) {
        // Update existing
        const { error } = await supabase
          .from('availability')
          .update(availabilityData)
          .eq('id', availability.id);

        if (error) throw error;
      } else {
        // Create new
        const { error } = await supabase
          .from('availability')
          .insert(availabilityData);

        if (error) throw error;
      }

      toast.success('Availability updated successfully');
      onOpenChange(false);
    } catch (error: any) {
      toast.error('Failed to update availability: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CalendarDays className="w-4 h-4" />
            Availability for {selectedDate.toDateString()}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="available">Available for work</Label>
            <Switch
              id="available"
              checked={isAvailable}
              onCheckedChange={setIsAvailable}
            />
          </div>

          {isAvailable && (
            <>
              <div>
                <Label className="text-sm font-medium mb-2 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  Preferred Time Range
                </Label>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label htmlFor="start-time" className="text-xs text-muted-foreground">Start Time</Label>
                    <Input
                      id="start-time"
                      type="time"
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="end-time" className="text-xs text-muted-foreground">End Time</Label>
                    <Input
                      id="end-time"
                      type="time"
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </>
          )}

          <div>
            <Label htmlFor="notes">Notes (optional)</Label>
            <Textarea
              id="notes"
              placeholder={isAvailable ? "Any specific preferences or constraints..." : "Reason for unavailability..."}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button 
              onClick={saveAvailability} 
              disabled={loading}
              className="flex-1"
            >
              {loading ? 'Saving...' : 'Save Availability'}
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