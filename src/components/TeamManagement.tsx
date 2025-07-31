import { useState, useEffect } from 'react';
import { TeamAuthService, TeamData, TeamMember } from '@/services/teamAuth';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  Mail, 
  Crown, 
  UserPlus, 
  Settings, 
  Copy,
  MoreVertical,
  Shield,
  UserMinus
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export const TeamManagement = () => {
  const [team, setTeam] = useState<TeamData | null>(null);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [inviteEmail, setInviteEmail] = useState('');
  const [loading, setLoading] = useState(true);
  const [inviteLoading, setInviteLoading] = useState(false);
  
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user?.email) {
      loadTeamData();
    }
  }, [user]);

  const loadTeamData = async () => {
    try {
      setLoading(true);
      
      if (!user?.email) return;

      // Get user's team
      const teamData = await TeamAuthService.getUserTeam(user.email);
      if (teamData) {
        setTeam(teamData.team);

        // Get team members
        const members = await TeamAuthService.getTeamMembers(teamData.team.id);
        setTeamMembers(members);
      }
    } catch (error) {
      console.error('Error loading team data:', error);
      toast({
        title: "Error",
        description: "Failed to load team data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const inviteTeamMember = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inviteEmail.trim() || !team || !user?.email) return;

    try {
      setInviteLoading(true);
      
      await TeamAuthService.inviteTeamMember(inviteEmail.trim(), team.id, user.email);
      
      setInviteEmail('');
      await loadTeamData(); // Refresh members list
      
      toast({
        title: "Invitation sent!",
        description: `Invitation sent to ${inviteEmail}`,
      });
    } catch (error: any) {
      console.error('Error inviting member:', error);
      toast({
        title: "Invitation failed",
        description: error.message || "Failed to send invitation",
        variant: "destructive"
      });
    } finally {
      setInviteLoading(false);
    }
  };

  const copyTeamId = () => {
    if (team?.team_id) {
      navigator.clipboard.writeText(team.team_id);
      toast({
        title: "Copied!",
        description: "Team ID copied to clipboard",
      });
    }
  };

  const updateMemberRole = async (memberId: string, newRole: 'admin' | 'member') => {
    try {
      await TeamAuthService.updateTeamMemberRole(memberId, newRole);
      await loadTeamData(); // Refresh data
      
      toast({
        title: "Role updated",
        description: `Member role updated to ${newRole}`,
      });
    } catch (error: any) {
      console.error('Error updating member role:', error);
      toast({
        title: "Update failed",
        description: error.message || "Failed to update member role",
        variant: "destructive"
      });
    }
  };

  const removeMember = async (memberId: string, memberEmail: string) => {
    if (!confirm(`Are you sure you want to remove ${memberEmail} from the team?`)) {
      return;
    }

    try {
      await TeamAuthService.removeTeamMember(memberId);
      await loadTeamData(); // Refresh data
      
      toast({
        title: "Member removed",
        description: `${memberEmail} has been removed from the team`,
      });
    } catch (error: any) {
      console.error('Error removing member:', error);
      toast({
        title: "Removal failed",
        description: error.message || "Failed to remove member",
        variant: "destructive"
      });
    }
  };

  const currentUserMember = teamMembers.find(member => member.email === user?.email);
  const isAdmin = currentUserMember?.role === 'admin';

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading team data...</p>
        </div>
      </div>
    );
  }

  if (!team) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="p-6 text-center">
            <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Team Found</h3>
            <p className="text-muted-foreground">You don't seem to be part of any team yet.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Team Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Team Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">
                Team Name
              </label>
              <p className="text-lg font-semibold">{team.team_name}</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">
                Team ID
              </label>
              <div className="flex items-center gap-2">
                <code className="bg-muted px-2 py-1 rounded text-sm font-mono">
                  {team.team_id}
                </code>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={copyTeamId}
                  className="h-8 w-8 p-0"
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">
                Admin
              </label>
              <p className="text-lg">{team.admin_email}</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">
                Members
              </label>
              <p className="text-lg font-semibold">{teamMembers.length}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Team Members */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Team Members
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Invite Form - Only for admins */}
          {isAdmin && (
            <form onSubmit={inviteTeamMember} className="mb-6">
              <div className="flex gap-4">
                <Input
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="Enter email address to invite"
                  disabled={inviteLoading}
                  className="flex-1"
                />
                <Button
                  type="submit"
                  disabled={inviteLoading || !inviteEmail.trim()}
                  className="flex items-center gap-2"
                >
                  <UserPlus className="w-4 h-4" />
                  {inviteLoading ? 'Sending...' : 'Send Invite'}
                </Button>
              </div>
            </form>
          )}

          {/* Members List */}
          <div className="space-y-3">
            {teamMembers.map((member) => (
              <div
                key={member.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="text-sm font-semibold text-primary">
                      {(member.full_name || member.email).charAt(0).toUpperCase()}
                    </span>
                  </div>
                  
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">
                        {member.full_name || member.email}
                      </h3>
                      {member.role === 'admin' && (
                        <Crown className="w-4 h-4 text-yellow-500" />
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{member.email}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant={member.role === 'admin' ? 'default' : 'secondary'}>
                        {member.role}
                      </Badge>
                      <Badge 
                        variant={
                          member.status === 'active' ? 'default' : 
                          member.status === 'pending' ? 'outline' : 
                          'destructive'
                        }
                      >
                        {member.status}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Admin Actions */}
                {isAdmin && member.email !== user?.email && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => updateMemberRole(
                          member.id,
                          member.role === 'admin' ? 'member' : 'admin'
                        )}
                      >
                        <Crown className="w-4 h-4 mr-2" />
                        {member.role === 'admin' ? 'Remove Admin' : 'Make Admin'}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => removeMember(member.id, member.email)}
                        className="text-destructive"
                      >
                        <UserMinus className="w-4 h-4 mr-2" />
                        Remove from Team
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};