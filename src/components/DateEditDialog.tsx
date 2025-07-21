import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

interface DateEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: {
    id: string;
    name: string;
    startDate: Date;
    endDate: Date;
    type: "project" | "task";
  } | null;
  onSave: (id: string, startDate: Date, endDate: Date, type: "project" | "task") => Promise<void>;
}

export function DateEditDialog({ open, onOpenChange, item, onSave }: DateEditDialogProps) {
  const { toast } = useToast();
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(false);

  // Helper function to format date to dd/mm/yyyy for input[type="date"]
  const formatDateForInput = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    if (item) {
      // Default to today's date if no dates have been set
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const itemStart = new Date(item.startDate);
      const itemEnd = new Date(item.endDate);
      itemStart.setHours(0, 0, 0, 0);
      itemEnd.setHours(0, 0, 0, 0);
      
      // Check if dates are the same as creation date (indicating no custom dates set)
      const isDefaultDate = itemStart.getTime() === itemEnd.getTime() && (
        itemStart.getTime() === today.getTime() ||
        Math.abs(itemStart.getTime() - today.getTime()) < 24 * 60 * 60 * 1000
      );
      
      setStartDate(isDefaultDate ? formatDateForInput(today) : formatDateForInput(itemStart));
      setEndDate(isDefaultDate ? formatDateForInput(today) : formatDateForInput(itemEnd));
    }
  }, [item]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!item) return;

    if (!startDate || !endDate) {
      toast({
        title: "Error",
        description: "Both start and end dates are required.",
        variant: "destructive"
      });
      return;
    }

    if (new Date(startDate) > new Date(endDate)) {
      toast({
        title: "Error",
        description: "Start date cannot be after end date.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      await onSave(item.id, new Date(startDate), new Date(endDate), item.type);
      onOpenChange(false);
      toast({
        title: "Dates Updated",
        description: `${item.name} dates have been updated successfully.`
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update dates. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Dates - {item?.name}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="startDate">Start Date</Label>
            <Input
              id="startDate"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
            />
          </div>

          <div>
            <Label htmlFor="endDate">End Date</Label>
            <Input
              id="endDate"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              required
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}