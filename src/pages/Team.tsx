import { useState } from "react";
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { TeamMessaging } from "@/components/TeamMessaging";
import { FileSharing } from "@/components/FileSharing";
import { 
  Plus, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar,
  Users,
  MoreHorizontal,
  User,
  Search,
  Crown,
  Star,
  Edit,
  Trash2,
  MessageSquare,
  FolderOpen
} from "lucide-react";

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  phone?: string;
  location?: string;
  joinDate: Date;
  avatar?: string;
  status: "active" | "inactive" | "busy";
  skills: string[];
  projects: number;
}

const Team = () => {
  const { toast } = useToast();
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([
    // Empty array - no generated data, user creates their own team
  ]);

  const [newMember, setNewMember] = useState({
    name: "",
    email: "",
    role: "",
    department: "",
    phone: "",
    location: "",
    skills: ""
  });

  const handleAddMember = () => {
    if (!newMember.name.trim() || !newMember.email.trim()) {
      toast({
        title: "Error",
        description: "Please enter name and email.",
        variant: "destructive"
      });
      return;
    }

    const member: TeamMember = {
      id: Date.now().toString(),
      name: newMember.name,
      email: newMember.email,
      role: newMember.role || "Team Member",
      department: newMember.department || "General",
      phone: newMember.phone,
      location: newMember.location,
      joinDate: new Date(),
      status: "active",
      skills: newMember.skills ? newMember.skills.split(",").map(s => s.trim()) : [],
      projects: 0
    };

    setTeamMembers(prev => [...prev, member]);
    setNewMember({
      name: "",
      email: "",
      role: "",
      department: "",
      phone: "",
      location: "",
      skills: ""
    });
    setIsAddMemberOpen(false);

    toast({
      title: "Team Member Added",
      description: `${member.name} has been added to the team.`,
    });
  };

  const handleDeleteMember = (memberId: string) => {
    setTeamMembers(prev => prev.filter(m => m.id !== memberId));
    toast({
      title: "Team Member Removed",
      description: "Team member has been removed from the team.",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-success";
      case "busy": return "bg-warning";
      case "inactive": return "bg-muted";
      default: return "bg-muted";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "active": return "Available";
      case "busy": return "Busy";
      case "inactive": return "Offline";
      default: return "Unknown";
    }
  };

  const getRoleIcon = (role: string) => {
    const lowerRole = role.toLowerCase();
    if (lowerRole.includes("manager") || lowerRole.includes("lead")) {
      return <Crown className="w-4 h-4 text-warning" />;
    }
    if (lowerRole.includes("senior")) {
      return <Star className="w-4 h-4 text-primary" />;
    }
    return <User className="w-4 h-4 text-muted-foreground" />;
  };

  return (
    <Layout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Team</h1>
            <p className="text-muted-foreground mt-1">Manage your team members and their roles</p>
          </div>
          <Dialog open={isAddMemberOpen} onOpenChange={setIsAddMemberOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-primary hover:bg-primary-dark">
                <Plus className="w-4 h-4 mr-2" />
                Add Member
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Add Team Member</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="member-name">Name *</Label>
                  <Input
                    id="member-name"
                    value={newMember.name}
                    onChange={(e) => setNewMember(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter full name"
                  />
                </div>
                <div>
                  <Label htmlFor="member-email">Email *</Label>
                  <Input
                    id="member-email"
                    type="email"
                    value={newMember.email}
                    onChange={(e) => setNewMember(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="Enter email address"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="member-role">Role</Label>
                    <Input
                      id="member-role"
                      value={newMember.role}
                      onChange={(e) => setNewMember(prev => ({ ...prev, role: e.target.value }))}
                      placeholder="e.g., Developer"
                    />
                  </div>
                  <div>
                    <Label htmlFor="member-department">Department</Label>
                    <Input
                      id="member-department"
                      value={newMember.department}
                      onChange={(e) => setNewMember(prev => ({ ...prev, department: e.target.value }))}
                      placeholder="e.g., Engineering"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="member-phone">Phone</Label>
                    <Input
                      id="member-phone"
                      value={newMember.phone}
                      onChange={(e) => setNewMember(prev => ({ ...prev, phone: e.target.value }))}
                      placeholder="Phone number"
                    />
                  </div>
                  <div>
                    <Label htmlFor="member-location">Location</Label>
                    <Input
                      id="member-location"
                      value={newMember.location}
                      onChange={(e) => setNewMember(prev => ({ ...prev, location: e.target.value }))}
                      placeholder="City, Country"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="member-skills">Skills</Label>
                  <Textarea
                    id="member-skills"
                    value={newMember.skills}
                    onChange={(e) => setNewMember(prev => ({ ...prev, skills: e.target.value }))}
                    placeholder="Comma separated skills (e.g., React, TypeScript, Design)"
                    rows={3}
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsAddMemberOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddMember}>
                    Add Member
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Tabs Navigation */}
        <Tabs defaultValue="members" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="members" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Team Members
            </TabsTrigger>
            <TabsTrigger value="messaging" className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              Messaging
            </TabsTrigger>
            <TabsTrigger value="files" className="flex items-center gap-2">
              <FolderOpen className="w-4 h-4" />
              Shared Files
            </TabsTrigger>
          </TabsList>

          <TabsContent value="members" className="space-y-6">
            {/* Search and Filters */}
            <div className="flex gap-4 items-center">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input 
                  placeholder="Search team members..."
                  className="pl-10"
                />
              </div>
              <Button variant="outline">
                Filter by Department
              </Button>
              <Button variant="outline">
                Filter by Role
              </Button>
            </div>

            {/* Team Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="bg-gradient-card shadow-custom-card">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-primary">{teamMembers.length}</div>
                  <div className="text-sm text-muted-foreground">Total Members</div>
                </CardContent>
              </Card>
              <Card className="bg-gradient-card shadow-custom-card">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-success">{teamMembers.filter(m => m.status === 'active').length}</div>
                  <div className="text-sm text-muted-foreground">Available</div>
                </CardContent>
              </Card>
              <Card className="bg-gradient-card shadow-custom-card">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-warning">{teamMembers.filter(m => m.status === 'busy').length}</div>
                  <div className="text-sm text-muted-foreground">Busy</div>
                </CardContent>
              </Card>
              <Card className="bg-gradient-card shadow-custom-card">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-foreground">{new Set(teamMembers.map(m => m.department)).size}</div>
                  <div className="text-sm text-muted-foreground">Departments</div>
                </CardContent>
              </Card>
            </div>

            {/* Team Members Grid */}
            {teamMembers.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {teamMembers.map((member) => (
                  <Card key={member.id} className="bg-gradient-card shadow-custom-card hover:shadow-custom-md transition-all duration-200 group">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <Avatar className="w-12 h-12">
                            <AvatarImage src={member.avatar} />
                            <AvatarFallback className="bg-primary text-primary-foreground">
                              {member.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-medium text-foreground">{member.name}</h3>
                              {getRoleIcon(member.role)}
                            </div>
                            <p className="text-sm text-muted-foreground">{member.role}</p>
                            <Badge className={`text-xs ${getStatusColor(member.status)} text-white`}>
                              {getStatusLabel(member.status)}
                            </Badge>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm" className="w-6 h-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="space-y-3">
                      {/* Contact Info */}
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Mail className="w-4 h-4" />
                          <span className="truncate">{member.email}</span>
                        </div>
                        {member.phone && (
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Phone className="w-4 h-4" />
                            <span>{member.phone}</span>
                          </div>
                        )}
                        {member.location && (
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <MapPin className="w-4 h-4" />
                            <span>{member.location}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Calendar className="w-4 h-4" />
                          <span>Joined {member.joinDate.toLocaleDateString()}</span>
                        </div>
                      </div>

                      {/* Department */}
                      <div>
                        <Badge variant="secondary" className="text-xs">
                          {member.department}
                        </Badge>
                      </div>

                      {/* Skills */}
                      {member.skills.length > 0 && (
                        <div>
                          <p className="text-xs text-muted-foreground mb-2">Skills:</p>
                          <div className="flex flex-wrap gap-1">
                            {member.skills.slice(0, 3).map((skill, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {skill}
                              </Badge>
                            ))}
                            {member.skills.length > 3 && (
                              <Badge variant="outline" className="text-xs">
                                +{member.skills.length - 3}
                              </Badge>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex gap-2 pt-2">
                        <Button variant="outline" size="sm" className="flex-1">
                          <Edit className="w-3 h-3 mr-1" />
                          Edit
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="text-destructive hover:text-destructive"
                          onClick={() => handleDeleteMember(member.id)}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              /* Empty State */
              <Card className="bg-gradient-card shadow-custom-card">
                <CardContent className="p-12 text-center">
                  <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg font-medium text-foreground mb-2">No team members yet</h3>
                  <p className="text-muted-foreground mb-6">Add your first team member to get started with team management</p>
                  <Button 
                    className="bg-gradient-primary hover:bg-primary-dark"
                    onClick={() => setIsAddMemberOpen(true)}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add First Member
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Team Overview */}
            {teamMembers.length > 0 && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="bg-gradient-card shadow-custom-card">
                  <CardHeader>
                    <CardTitle>Department Distribution</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {Array.from(new Set(teamMembers.map(m => m.department))).map(dept => {
                        const count = teamMembers.filter(m => m.department === dept).length;
                        const percentage = (count / teamMembers.length) * 100;
                        return (
                          <div key={dept} className="flex items-center justify-between">
                            <span className="text-sm font-medium">{dept}</span>
                            <div className="flex items-center gap-2">
                              <div className="w-20 h-2 bg-muted rounded-full overflow-hidden">
                                <div 
                                  className="h-full bg-primary rounded-full"
                                  style={{ width: `${percentage}%` }}
                                />
                              </div>
                              <span className="text-sm text-muted-foreground">{count}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-card shadow-custom-card">
                  <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button variant="outline" className="w-full justify-start" size="lg">
                      <Mail className="w-5 h-5 mr-3" />
                      Send Team Announcement
                    </Button>
                    <Button variant="outline" className="w-full justify-start" size="lg">
                      <Users className="w-5 h-5 mr-3" />
                      Schedule Team Meeting
                    </Button>
                    <Button variant="outline" className="w-full justify-start" size="lg">
                      <Calendar className="w-5 h-5 mr-3" />
                      Create Team Event
                    </Button>
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>

          <TabsContent value="messaging">
            <TeamMessaging 
              currentUser="Current User"
              teamMembers={teamMembers.map(member => ({
                id: member.id,
                name: member.name,
                email: member.email
              }))}
            />
          </TabsContent>

          <TabsContent value="files">
            <FileSharing />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Team;