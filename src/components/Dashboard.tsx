import { useState, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ProjectCreateDialog } from "@/components/ProjectCreateDialog";
import { TaskCreateModal, MeetingScheduleModal, TeamMemberModal, ReportModal } from "@/components/QuickActionModals";
import { useProjects } from "@/hooks/useProjects";
import { useAuth } from "@/hooks/useAuth";
import { useUserManagement } from "@/hooks/useUserManagement";
import { 
  BarChart3, 
  Calendar, 
  CheckCircle, 
  Clock, 
  FolderOpen, 
  Plus, 
  TrendingUp, 
  Users,
  FileText
} from "lucide-react";

export function Dashboard() {
  const { projects, loading, createProject, getProjectStats } = useProjects();
  const { user } = useAuth();
  const { isReturningUser, getUserInfo, registerUser } = useUserManagement();
  
  // Register user in management system when they access dashboard
  useEffect(() => {
    if (user) {
      registerUser(user);
    }
  }, [user, registerUser]);
  
  // Modal states
  const [isProjectDialogOpen, setIsProjectDialogOpen] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isMeetingModalOpen, setIsMeetingModalOpen] = useState(false);
  const [isTeamModalOpen, setIsTeamModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  const stats = getProjectStats();
  
  // Get user info for welcome message
  const userInfo = user ? getUserInfo(user.id) : null;
  const isReturning = user ? isReturningUser(user.id) : false;

  const handleProjectCreated = () => {
    console.log("Project created, dashboard will refresh automatically");
  };
  
  const projectStats = [
    { name: "Active Projects", value: stats.total, icon: FolderOpen, color: "text-primary" },
    { name: "Tasks Completed", value: stats.completed, icon: CheckCircle, color: "text-success" },
    { name: "Team Members", value: projects.reduce((sum, p) => sum + p.team_size, 0), icon: Users, color: "text-warning" },
    { name: "Overdue Projects", value: stats.overdue, icon: Clock, color: "text-destructive" },
  ];

  return (
    <Layout>
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold text-foreground">
            {isReturning ? 'Welcome back' : 'Welcome to the team'}, {user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'there'}!
          </h1>
          <p className="text-muted-foreground">
            {isReturning 
              ? "Ready to continue managing your way to +$100M?" 
              : "Let's manage our way to +$100M together! Start by creating your first project."
            }
          </p>
          {userInfo && (
            <p className="text-sm text-muted-foreground">
              {isReturning 
                ? `You've been with us since ${new Date(userInfo.registered_at).toLocaleDateString()}`
                : "You're now part of our project management team!"
              }
            </p>
          )}
        </div>
        <Button 
          className="bg-gradient-primary hover:bg-primary-dark"
          onClick={() => setIsProjectDialogOpen(true)}
        >
          <Plus className="w-4 h-4 mr-2" />
          New Project
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {projectStats.map((stat, index) => (
          <Card key={index} className="bg-gradient-card shadow-custom-card hover:shadow-custom-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{stat.name}</p>
                  <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-lg bg-muted/20 ${stat.color}`}>
                  <stat.icon className="w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Getting Started Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-gradient-card shadow-custom-card">
          <CardHeader>
            <CardTitle className="text-xl font-semibold">Get Started</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {projects.length === 0 ? (
              <div className="text-center py-8">
                <FolderOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-medium text-foreground mb-2">No projects yet</h3>
                <p className="text-muted-foreground mb-4">Create your first project to get started with ProManage</p>
                <Button 
                  className="bg-gradient-primary hover:bg-primary-dark"
                  onClick={() => setIsProjectDialogOpen(true)}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create Project
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                <h3 className="text-lg font-medium text-foreground mb-4">Recent Projects</h3>
                {projects.slice(0, 3).map((project) => (
                  <div key={project.id} className="flex items-center gap-3 p-3 rounded-lg bg-muted/20 hover:bg-muted/30 transition-colors">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: project.color }} />
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{project.title}</h4>
                      <p className="text-xs text-muted-foreground">Progress: {project.progress}%</p>
                    </div>
                    <Progress value={project.progress} className="w-16 h-2" />
                  </div>
                ))}
                {projects.length > 3 && (
                  <p className="text-sm text-muted-foreground text-center">+{projects.length - 3} more projects</p>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-gradient-card shadow-custom-card">
          <CardHeader>
            <CardTitle className="text-xl font-semibold">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button 
              variant="outline" 
              className="w-full justify-start hover:bg-muted/50 transition-colors" 
              size="lg"
              onClick={() => setIsTaskModalOpen(true)}
            >
              <CheckCircle className="w-5 h-5 mr-3" />
              Create Task
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start hover:bg-muted/50 transition-colors" 
              size="lg"
              onClick={() => setIsMeetingModalOpen(true)}
            >
              <Calendar className="w-5 h-5 mr-3" />
              Schedule Meeting
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start hover:bg-muted/50 transition-colors" 
              size="lg"
              onClick={() => setIsTeamModalOpen(true)}
            >
              <Users className="w-5 h-5 mr-3" />
              Add Team Member
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start hover:bg-muted/50 transition-colors" 
              size="lg"
              onClick={() => setIsReportModalOpen(true)}
            >
              <FileText className="w-5 h-5 mr-3" />
              Generate Report
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Feature Highlights */}
      <Card className="bg-gradient-card shadow-custom-card">
        <CardHeader>
          <CardTitle className="text-xl font-semibold flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            ProManage Features
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4">
              <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <FolderOpen className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-medium mb-2">Project Management</h3>
              <p className="text-sm text-muted-foreground">Organize projects with detailed tracking and progress monitoring</p>
            </div>
            <div className="text-center p-4">
              <div className="w-12 h-12 bg-success/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <Calendar className="w-6 h-6 text-success" />
              </div>
              <h3 className="font-medium mb-2">Calendar Integration</h3>
              <p className="text-sm text-muted-foreground">Schedule events, track deadlines, and view public holidays</p>
            </div>
            <div className="text-center p-4">
              <div className="w-12 h-12 bg-warning/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <BarChart3 className="w-6 h-6 text-warning" />
              </div>
              <h3 className="font-medium mb-2">Gantt Charts</h3>
              <p className="text-sm text-muted-foreground">Visualize project timelines with interactive Gantt charts</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Modals */}
      <ProjectCreateDialog 
        open={isProjectDialogOpen} 
        onOpenChange={setIsProjectDialogOpen}
        onProjectCreated={handleProjectCreated}
      />
      <TaskCreateModal 
        open={isTaskModalOpen} 
        onOpenChange={setIsTaskModalOpen}
      />
      <MeetingScheduleModal 
        open={isMeetingModalOpen} 
        onOpenChange={setIsMeetingModalOpen}
      />
      <TeamMemberModal 
        open={isTeamModalOpen} 
        onOpenChange={setIsTeamModalOpen}
      />
      <ReportModal 
        open={isReportModalOpen} 
        onOpenChange={setIsReportModalOpen}
      />
    </div>
    </Layout>
  );
}