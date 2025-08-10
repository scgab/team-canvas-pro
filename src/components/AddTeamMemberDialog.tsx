import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { TeamAuthService } from "@/services/teamAuth";
import { useAuth } from "@/hooks/useAuth";

interface AddTeamMemberDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onMemberAdded: () => void;
}

export function AddTeamMemberDialog({ open, onOpenChange, onMemberAdded }: AddTeamMemberDialogProps) {
  const { toast } = useToast();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    role: "member"
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.email.trim()) {
      toast({
        title: "Error",
        description: "Email is required.",
        variant: "destructive"
      });
      return;
    }

    if (!user?.email) {
      toast({
        title: "Error",
        description: "You must be logged in to invite team members.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      // Get current user's team
      const teamData = await TeamAuthService.getUserTeam(user.email);
      if (!teamData) {
        throw new Error("No team found for current user");
      }

      // Check if current user is admin
      const teamMembers = await TeamAuthService.getTeamMembers(teamData.team.id);
      const userMember = teamMembers.find(m => m.email === user.email);
      
      if (userMember?.role !== 'admin') {
        throw new Error("Only team admins can invite new members");
      }

      // Send invitation with selected role
      await TeamAuthService.inviteTeamMember(
        formData.email.trim(), 
        teamData.team.id, 
        user.email,
        formData.role as 'admin' | 'member'
      );

      toast({
        title: "Invitation Sent!",
        description: `Invitation email sent to ${formData.email}`
      });

      // Reset form
      setFormData({
        email: "",
        role: "member"
      });

      onMemberAdded();
      onOpenChange(false);

    } catch (error: any) {
      console.error('Error inviting team member:', error);
      toast({
        title: "Invitation Failed",
        description: error.message || "Failed to send invitation",
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
          <DialogTitle>Invite Team Member</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="email">Email Address *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="Enter email address to invite"
              required
              disabled={loading}
            />
          </div>

          <div>
            <Label htmlFor="role">Initial Role</Label>
            <Select 
              value={formData.role} 
              onValueChange={(value) => setFormData({ ...formData, role: value })}
              disabled={loading}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="member">Member</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="bg-muted/50 p-3 rounded-md">
            <p className="text-sm text-muted-foreground">
              An invitation email will be sent to this address. The person can join your team by clicking the link in the email.
            </p>
          </div>

          <div className="flex justify-end gap-2">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Sending Invitation...' : 'Send Invitation'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}