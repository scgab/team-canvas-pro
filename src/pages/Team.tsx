import { useState } from "react";
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
import { getUsers } from "@/utils/userDatabase";
import { useUserColors } from "@/components/UserColorContext";
import { useToast } from "@/hooks/use-toast";
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
  Megaphone
} from "lucide-react";

const Team = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const { getColorByEmail } = useUserColors();
  const [activeTab, setActiveTab] = useState("overview");
  const [announcementModalOpen, setAnnouncementModalOpen] = useState(false);
  const [addMemberDialogOpen, setAddMemberDialogOpen] = useState(false);
  
  const currentUser = user?.user_metadata?.full_name || user?.email || 'Current User';
  const teamMembers = getUsers();

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
    toast({
      title: "Team Member Added",
      description: "The new team member has been added successfully."
    });
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
            <Button onClick={handleAddMember}>
              <UserPlus className="w-4 h-4 mr-2" />
              Add Member
            </Button>
            <Button variant="outline" onClick={handleGenerateReport}>
              <FileText className="w-4 h-4 mr-2" />
              Generate Report
            </Button>
          </div>
        </div>

        {/* Team Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {teamMembers.map((member) => {
            const memberColor = getColorByEmail(member.email);
            
            return (
              <Card key={member.id} className="bg-gradient-card shadow-custom-card">
                <CardHeader className="pb-3">
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
                      <h3 className="font-medium text-foreground">{member.name}</h3>
                      <p className="text-sm text-muted-foreground">{member.role}</p>
                      <Badge className="bg-success text-success-foreground text-xs mt-1">
                        Active
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Mail className="w-4 h-4" />
                      <span className="truncate">{member.email}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Tabs */}
        <Tabs defaultValue="messaging" className="space-y-6">
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