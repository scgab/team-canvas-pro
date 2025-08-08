import React, { useEffect, useMemo, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

export interface ShiftEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  teamId?: string | null;
  date: Date;
  member: { id: string; name: string; full_name?: string; email: string };
  shift?: {
    id: string;
    start_time: string;
    end_time: string;
    shift_type: string;
    status: string;
    notes?: string;
  } | null;
  onSuccess?: () => void;
}

export const ShiftEditDialog: React.FC<ShiftEditDialogProps> = ({
  open,
  onOpenChange,
  teamId,
  date,
  member,
  shift,
  onSuccess,
}) => {
  const { toast } = useToast();
  const { user } = useAuth();

  const initialStart = shift?.start_time || "09:00";
  const initialEnd = shift?.end_time || "17:00";

  const [startTime, setStartTime] = useState(initialStart);
  const [endTime, setEndTime] = useState(initialEnd);
  const [shiftType, setShiftType] = useState(shift?.shift_type || "regular");
  const [status, setStatus] = useState(shift?.status || "scheduled");
  const [notes, setNotes] = useState(shift?.notes || "");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setStartTime(shift?.start_time || "09:00");
    setEndTime(shift?.end_time || "17:00");
    setShiftType(shift?.shift_type || "regular");
    setStatus(shift?.status || "scheduled");
    setNotes(shift?.notes || "");
  }, [shift, open]);

  const dateString = useMemo(() => date.toISOString().split("T")[0], [date]);

  const handleSave = async () => {
    if (!teamId) {
      toast({ title: "Missing team", description: "Team not identified.", variant: "destructive" });
      return;
    }
    if (!user?.email) {
      toast({ title: "Not signed in", description: "Please sign in and try again.", variant: "destructive" });
      return;
    }

    try {
      setSaving(true);
      if (shift?.id) {
        const { error } = await supabase
          .from("shifts")
          .update({
            start_time: startTime,
            end_time: endTime,
            shift_type: shiftType,
            status,
            notes: notes || null,
          })
          .eq("id", shift.id);
        if (error) throw error;
        toast({ title: "Shift updated", description: `${member.full_name || member.name} • ${dateString}` });
      } else {
        const { error } = await supabase.from("shifts").insert([
          {
            team_id: teamId,
            date: dateString,
            start_time: startTime,
            end_time: endTime,
            assigned_to: member.email,
            shift_type: shiftType,
            status,
            notes: notes || null,
            created_by: user.email,
          },
        ]);
        if (error) throw error;
        toast({ title: "Shift created", description: `${member.full_name || member.name} • ${dateString}` });
      }
      onOpenChange(false);
      onSuccess?.();
    } catch (err: any) {
      console.error(err);
      toast({
        title: "Action failed",
        description: err?.message || "You might not have permission to manage shifts.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{shift?.id ? "Edit Shift" : "Add Shift"}</DialogTitle>
          <DialogDescription>
            {member.full_name || member.name} • {new Date(dateString).toLocaleDateString()}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-2">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="start">Start time</Label>
              <Input id="start" type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="end">End time</Label>
              <Input id="end" type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Shift type</Label>
              <Select value={shiftType} onValueChange={setShiftType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="regular">Regular</SelectItem>
                  <SelectItem value="morning">Morning</SelectItem>
                  <SelectItem value="evening">Evening</SelectItem>
                  <SelectItem value="night">Night</SelectItem>
                  <SelectItem value="overtime">Overtime</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Status</Label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="scheduled">Scheduled</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="notes">Notes</Label>
            <Textarea id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} />
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={saving}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? "Saving..." : shift?.id ? "Save changes" : "Create shift"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
