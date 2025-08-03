import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TeamMessaging } from "@/components/TeamMessaging";
import { AnnouncementModal } from "@/components/AnnouncementModal";
import { AddTeamMemberDialog } from "@/components/AddTeamMemberDialog";
import { FileSharing } from "@/components/FileSharing";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useUserColors } from "@/components/UserColorContext";
import { useToast } from "@/hooks/use-toast";
import { TeamAuthService } from "@/services/teamAuth";
import { useTeamMember } from "@/hooks/useTeamMember";
import { 
  Users, 
  MessageSquare, 
  Calendar, 
  UserPlus, 
  FileText,
  Mail,
  Phone,
  MapPin,
  Award,
  FolderOpen,
  Megaphone,
  MoreVertical,
  UserMinus,
  Shield
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  full_name?: string;
  competence_level?: string;
}

const Team = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const { isAdmin } = useTeamMember();
  const { getColorByEmail } = useUserColors();
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState("messaging");
  const [announcementModalOpen, setAnnouncementModalOpen] = useState(false);
  const [addMemberDialogOpen, setAddMemberDialogOpen] = useState(false);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  
  const currentUser = user?.user_metadata?.full_name || user?.email || 'Current User';

  useEffect(() => {
    fetchTeamMembers();
  }, []);

  const fetchTeamMembers = async () => {
    if (!user?.email) {
      setLoading(false);
      return;
    }

    try {
      // Get user's team first
      const teamData = await TeamAuthService.getUserTeam(user.email);
      if (!teamData) {
        setTeamMembers([]);
        setLoading(false);
        return;
      }

      // Get team members using the team service
      const members = await TeamAuthService.getTeamMembers(teamData.team.id);
      
      // Transform the data to match our interface
      const transformedMembers: TeamMember[] = members
        .filter(member => member.status === 'active')
        .map(member => ({
          id: member.id,
          name: member.full_name || member.email,
          email: member.email,
          role: member.role === 'admin' ? 'Admin' : 'Member',
          full_name: member.full_name,
          competence_level: member.competence_level
        }));

      setTeamMembers(transformedMembers);
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Failed to load team members",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Refresh team members when user changes
  useEffect(() => {
    fetchTeamMembers();
  }, [user]);

  // Check if messaging tab should be active from URL params
  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab === 'messaging') {
      setActiveTab('messaging');
    }
  }, [searchParams]);

  const handleScheduleMeeting = () => {
    toast({
      title: "Team Meeting Scheduled",
      description: "A team meeting has been scheduled for all members."
    });
  };

  const handleAddMember = () => {
    setAddMemberDialogOpen(true);
  };

  const handleMemberAdded = () => {
    // Refresh the team members list
    fetchTeamMembers();
    toast({
      title: "Team Member Invited",
      description: "The invitation has been sent successfully."
    });
  };

  const handleRemoveMember = async (memberId: string, memberEmail: string) => {
    if (!isAdmin) {
      toast({
        title: "Access Denied",
        description: "Only team admins can remove members.",
        variant: "destructive"
      });
      return;
    }

    if (memberEmail === user?.email) {
      toast({
        title: "Cannot Remove Self",
        description: "You cannot remove yourself from the team.",
        variant: "destructive"
      });
      return;
    }

    const confirmed = window.confirm(`Are you sure you want to remove ${memberEmail} from the team?`);
    if (!confirmed) return;

    try {
      await TeamAuthService.removeTeamMember(memberId);
      
      // Refresh the team members list
      fetchTeamMembers();
      
      toast({
        title: "Member Removed",
        description: `${memberEmail} has been removed from the team.`
      });
    } catch (error: any) {
      console.error('Error removing member:', error);
      toast({
        title: "Removal Failed",
        description: error.message || "Failed to remove team member.",
        variant: "destructive"
      });
    }
  };

  const handleGenerateReport = () => {
    toast({
      title: "Team Report Generated",
      description: "Team performance report has been generated successfully."
    });
  };

  const handleAnnouncementSent = () => {
    toast({
      title: "Announcement Sent",
      description: "Your announcement has been sent to all team members."
    });
  };

  return (
    <Layout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Team</h1>
            <p className="text-muted-foreground mt-1">Manage your team members and collaboration</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setAnnouncementModalOpen(true)}>
              <Megaphone className="w-4 h-4 mr-2" />
              Send Announcement
            </Button>
            <Button variant="outline" onClick={handleScheduleMeeting}>
              <Calendar className="w-4 h-4 mr-2" />
              Schedule Meeting
            </Button>
            {isAdmin && (
              <Button onClick={handleAddMember}>
                <UserPlus className="w-4 h-4 mr-2" />
                Add Member
              </Button>
            )}
            <Button variant="outline" onClick={handleGenerateReport}>
              <FileText className="w-4 h-4 mr-2" />
              Generate Report
            </Button>
          </div>
        </div>

        {/* Team Overview */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2].map((i) => (
              <Card key={i} className="bg-gradient-card shadow-custom-card">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gray-200 rounded-full animate-pulse"></div>
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-200 rounded animate-pulse w-24"></div>
                      <div className="h-3 bg-gray-200 rounded animate-pulse w-16"></div>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {teamMembers.map((member) => {
              const memberColor = getColorByEmail(member.email);
              
              return (
                <Card key={member.id} className="bg-gradient-card shadow-custom-card">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar className="w-12 h-12">
                          <AvatarFallback 
                            className="text-white"
                            style={{ backgroundColor: memberColor.primary }}
                          >
                            {member.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium text-foreground">{member.name}</h3>
                            {member.role === 'Admin' && (
                              <Shield className="w-4 h-4 text-yellow-500" />
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">{member.role}</p>
                          <Badge className="bg-success text-success-foreground text-xs mt-1">
                            Active
                          </Badge>
                        </div>
                      </div>
                      
                      {/* Admin Controls */}
                      {isAdmin && member.email !== user?.email && (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => handleRemoveMember(member.id, member.email)}
                              className="text-destructive"
                            >
                              <UserMinus className="w-4 h-4 mr-2" />
                              Remove from Team
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Mail className="w-4 h-4" />
                        <span className="truncate">{member.email}</span>
                      </div>
                      {member.competence_level && (
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Award className="w-4 h-4" />
                          <span className="truncate">{member.competence_level}</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="messaging">
              <MessageSquare className="w-4 h-4 mr-2" />
              Messaging
            </TabsTrigger>
            <TabsTrigger value="files">
              <FolderOpen className="w-4 h-4 mr-2" />
              Files
            </TabsTrigger>
            <TabsTrigger value="announcements">
              <Megaphone className="w-4 h-4 mr-2" />
              Announcements
            </TabsTrigger>
          </TabsList>

          <TabsContent value="messaging">
            <TeamMessaging 
              currentUser={currentUser}
              teamMembers={teamMembers}
            />
          </TabsContent>

          <TabsContent value="files">
            <FileSharing />
          </TabsContent>

          <TabsContent value="announcements">
            <Card className="bg-gradient-card shadow-custom-card">
              <CardContent className="p-12 text-center">
                <Megaphone className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-medium text-foreground mb-2">No announcements yet</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Send your first team announcement to get started
                </p>
                <Button onClick={() => setAnnouncementModalOpen(true)}>
                  <Megaphone className="w-4 h-4 mr-2" />
                  Send Announcement
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Modals */}
        <AnnouncementModal
          open={announcementModalOpen}
          onOpenChange={setAnnouncementModalOpen}
          onAnnouncementSent={handleAnnouncementSent}
        />

        <AddTeamMemberDialog
          open={addMemberDialogOpen}
          onOpenChange={setAddMemberDialogOpen}
          onMemberAdded={handleMemberAdded}
        />
      </div>
    </Layout>
  );
};

export default Team;