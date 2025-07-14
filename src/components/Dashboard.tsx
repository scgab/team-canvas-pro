import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  BarChart3, 
  Calendar, 
  CheckCircle, 
  Clock, 
  FolderOpen, 
  Plus, 
  TrendingUp, 
  Users,
  Kanban
} from "lucide-react";

export function Dashboard() {
  const [projects] = useState([]); // Empty - user creates projects
  const [tasks] = useState([]); // Empty - user creates tasks
  
  const projectStats = [
    { name: "Active Projects", value: projects.length, icon: FolderOpen, color: "text-primary" },
    { name: "Tasks Completed", value: 0, icon: CheckCircle, color: "text-success" },
    { name: "Team Members", value: 0, icon: Users, color: "text-warning" },
    { name: "Upcoming Deadlines", value: 0, icon: Clock, color: "text-destructive" },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Welcome to ProManage! Start by creating your first project.</p>
        </div>
        <Button className="bg-gradient-primary hover:bg-primary-dark">
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
            <div className="text-center py-8">
              <FolderOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-medium text-foreground mb-2">No projects yet</h3>
              <p className="text-muted-foreground mb-4">Create your first project to get started with ProManage</p>
              <Button className="bg-gradient-primary hover:bg-primary-dark">
                <Plus className="w-4 h-4 mr-2" />
                Create Project
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card shadow-custom-card">
          <CardHeader>
            <CardTitle className="text-xl font-semibold">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full justify-start" size="lg">
              <Kanban className="w-5 h-5 mr-3" />
              Create Kanban Board
            </Button>
            <Button variant="outline" className="w-full justify-start" size="lg">
              <Calendar className="w-5 h-5 mr-3" />
              Schedule Event
            </Button>
            <Button variant="outline" className="w-full justify-start" size="lg">
              <BarChart3 className="w-5 h-5 mr-3" />
              Plan Timeline
            </Button>
            <Button variant="outline" className="w-full justify-start" size="lg">
              <Users className="w-5 h-5 mr-3" />
              Invite Team
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
    </div>
  );
}