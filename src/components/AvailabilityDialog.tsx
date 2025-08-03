import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Clock, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface AvailabilityDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedDate: Date | null;
  teamId: string | null;
  onSuccess?: () => void;
}

export const AvailabilityDialog = ({ 
  open, 
  onOpenChange, 
  selectedDate, 
  teamId,
  onSuccess 
}: AvailabilityDialogProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [isAvailable, setIsAvailable] = useState(true);
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('17:00');
  const [notes, setNotes] = useState('');

  const handleSave = async () => {
    if (!selectedDate || !teamId || !user?.email) return;

    setLoading(true);
    try {
      const dateStr = selectedDate.toISOString().split('T')[0];
      
      // Check if availability already exists for this date
      const { data: existing } = await supabase
        .from('availability')
        .select('id')
        .eq('team_id', teamId)
        .eq('team_member_email', user.email)
        .eq('date', dateStr)
        .single();

      if (existing) {
        // Update existing
        const { error } = await supabase
          .from('availability')
          .update({
            is_available: isAvailable,
            preferred_start_time: isAvailable ? startTime : null,
            preferred_end_time: isAvailable ? endTime : null,
            notes: notes
          })
          .eq('id', existing.id);

        if (error) throw error;
      } else {
        // Create new
        const { error } = await supabase
          .from('availability')
          .insert({
            team_id: teamId,
            team_member_email: user.email,
            date: dateStr,
            is_available: isAvailable,
            preferred_start_time: isAvailable ? startTime : null,
            preferred_end_time: isAvailable ? endTime : null,
            notes: notes
          });

        if (error) throw error;
      }

      toast({
        title: "Success",
        description: "Availability updated successfully"
      });

      onOpenChange(false);
      onSuccess?.();
      
      // Reset form
      setIsAvailable(true);
      setStartTime('09:00');
      setEndTime('17:00');
      setNotes('');
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update availability",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Set Availability for {selectedDate?.toLocaleDateString()}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="flex gap-4">
            <Button
              variant={isAvailable ? "default" : "outline"}
              onClick={() => setIsAvailable(true)}
              className="flex-1"
            >
              Available
            </Button>
            <Button
              variant={!isAvailable ? "destructive" : "outline"}
              onClick={() => setIsAvailable(false)}
              className="flex-1"
            >
              Not Available
            </Button>
          </div>

          {isAvailable && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="start-time">Preferred Start Time</Label>
                <Input
                  id="start-time"
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="end-time">Preferred End Time</Label>
                <Input
                  id="end-time"
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                />
              </div>
            </div>
          )}

          <div>
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              placeholder="Add any additional notes about your availability..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button onClick={handleSave} disabled={loading} className="flex items-center gap-2">
              <Save className="w-4 h-4" />
              {loading ? 'Saving...' : 'Save Availability'}
            </Button>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};