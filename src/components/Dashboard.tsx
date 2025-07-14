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
  Users 
} from "lucide-react";

export function Dashboard() {
  const projectStats = [
    { name: "Active Projects", value: 12, icon: FolderOpen, color: "text-primary" },
    { name: "Tasks Completed", value: 147, icon: CheckCircle, color: "text-success" },
    { name: "Team Members", value: 8, icon: Users, color: "text-warning" },
    { name: "Upcoming Deadlines", value: 5, icon: Clock, color: "text-destructive" },
  ];

  const recentProjects = [
    { 
      name: "Mobile App Redesign", 
      progress: 75, 
      status: "In Progress", 
      team: 5, 
      dueDate: "Dec 15"
    },
    { 
      name: "Website Migration", 
      progress: 45, 
      status: "Planning", 
      team: 3, 
      dueDate: "Jan 20"
    },
    { 
      name: "Brand Guidelines", 
      progress: 90, 
      status: "Review", 
      team: 2, 
      dueDate: "Nov 30"
    },
  ];

  const recentTasks = [
    { title: "Design system updates", project: "Mobile App", priority: "high", assignee: "Sarah" },
    { title: "Database optimization", project: "Website Migration", priority: "medium", assignee: "Mike" },
    { title: "User testing sessions", project: "Mobile App", priority: "low", assignee: "Alex" },
    { title: "Content review", project: "Brand Guidelines", priority: "urgent", assignee: "Emma" },
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent": return "bg-priority-urgent";
      case "high": return "bg-priority-high";
      case "medium": return "bg-priority-medium";
      case "low": return "bg-priority-low";
      default: return "bg-muted";
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Welcome back! Here's what's happening with your projects.</p>
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Projects */}
        <Card className="lg:col-span-2 bg-gradient-card shadow-custom-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="text-xl font-semibold">Recent Projects</CardTitle>
            <Button variant="ghost" size="sm">
              View All
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentProjects.map((project, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-muted/20 rounded-lg">
                <div className="flex-1">
                  <h3 className="font-medium text-foreground">{project.name}</h3>
                  <div className="flex items-center gap-4 mt-2">
                    <div className="flex items-center gap-2">
                      <Progress value={project.progress} className="w-20 h-2" />
                      <span className="text-sm text-muted-foreground">{project.progress}%</span>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {project.status}
                    </Badge>
                  </div>
                </div>
                <div className="text-right text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    {project.team}
                  </div>
                  <div className="flex items-center gap-1 mt-1">
                    <Calendar className="w-4 h-4" />
                    {project.dueDate}
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recent Tasks */}
        <Card className="bg-gradient-card shadow-custom-card">
          <CardHeader>
            <CardTitle className="text-xl font-semibold">Recent Tasks</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentTasks.map((task, index) => (
              <div key={index} className="flex items-start gap-3 p-3 bg-muted/20 rounded-lg">
                <div className={`w-3 h-3 rounded-full ${getPriorityColor(task.priority)} mt-1.5`} />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm text-foreground truncate">{task.title}</p>
                  <p className="text-xs text-muted-foreground">{task.project}</p>
                  <p className="text-xs text-muted-foreground mt-1">Assigned to {task.assignee}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Activity Section */}
      <Card className="bg-gradient-card shadow-custom-card">
        <CardHeader>
          <CardTitle className="text-xl font-semibold flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Project Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-3 bg-muted/20 rounded-lg">
              <div className="w-8 h-8 bg-success/20 rounded-full flex items-center justify-center">
                <CheckCircle className="w-4 h-4 text-success" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">Task completed: "User interface mockups"</p>
                <p className="text-xs text-muted-foreground">Mobile App Redesign • 2 hours ago</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-3 bg-muted/20 rounded-lg">
              <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                <Users className="w-4 h-4 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">New team member added: Alex Johnson</p>
                <p className="text-xs text-muted-foreground">Website Migration • 4 hours ago</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-3 bg-muted/20 rounded-lg">
              <div className="w-8 h-8 bg-warning/20 rounded-full flex items-center justify-center">
                <Clock className="w-4 h-4 text-warning" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">Deadline reminder: Brand Guidelines review</p>
                <p className="text-xs text-muted-foreground">Due in 3 days</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}