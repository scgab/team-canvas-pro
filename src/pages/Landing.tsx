import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useProjects } from "@/hooks/useProjects";
import { ProjectCreateDialog } from "@/components/ProjectCreateDialog";
import { useState } from "react";
import heroImage from "@/assets/hero-dashboard.jpg";
import {
  ArrowRight,
  BarChart3,
  Calendar,
  CheckCircle,
  Clock,
  FolderOpen,
  Plus,
  Sparkles,
  TrendingUp,
  Users,
  Zap
} from "lucide-react";

export default function Landing() {
  const { projects, getProjectStats } = useProjects();
  const [isProjectDialogOpen, setIsProjectDialogOpen] = useState(false);
  const stats = getProjectStats();

  const handleProjectCreated = () => {
    console.log("Project created from landing page");
  };

  const features = [
    {
      icon: FolderOpen,
      title: "Project Management",
      description: "Organize and track projects with powerful tools and intuitive interfaces",
      color: "text-primary",
      bgColor: "bg-primary/10"
    },
    {
      icon: Calendar,
      title: "Smart Calendar",
      description: "Schedule meetings, track deadlines, and view project timelines in one place",
      color: "text-success",
      bgColor: "bg-success/10"
    },
    {
      icon: BarChart3,
      title: "Gantt Charts",
      description: "Visualize project progress with interactive Gantt charts and timeline views",
      color: "text-warning",
      bgColor: "bg-warning/10"
    },
    {
      icon: Users,
      title: "Team Collaboration",
      description: "Work together seamlessly with team messaging and file sharing",
      color: "text-info",
      bgColor: "bg-info/10"
    },
    {
      icon: TrendingUp,
      title: "Analytics & Reports",
      description: "Get insights into team performance and project success metrics",
      color: "text-purple-500",
      bgColor: "bg-purple-500/10"
    },
    {
      icon: Zap,
      title: "Quick Actions",
      description: "Streamline your workflow with customizable quick actions and shortcuts",
      color: "text-orange-500",
      bgColor: "bg-orange-500/10"
    }
  ];

  return (
    <Layout>
      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="relative py-20 px-6 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/5" />
          <div className="absolute inset-0 bg-grid-pattern opacity-5" />
          
          <div className="relative max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-8">
                <div className="space-y-4">
                  <Badge className="bg-gradient-primary text-white px-4 py-2">
                    <Sparkles className="w-4 h-4 mr-2" />
                    Welcome to ProManage
                  </Badge>
                  <h1 className="text-4xl lg:text-6xl font-bold text-foreground leading-tight">
                    Manage Projects
                    <span className="bg-gradient-primary bg-clip-text text-transparent block">
                      Like a Pro
                    </span>
                  </h1>
                  <p className="text-xl text-muted-foreground leading-relaxed">
                    Streamline your workflow, collaborate with your team, and deliver projects on time 
                    with our comprehensive project management platform.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Button 
                    size="lg" 
                    className="bg-gradient-primary hover:bg-primary-dark text-lg px-8 py-6"
                    onClick={() => setIsProjectDialogOpen(true)}
                  >
                    <Plus className="w-5 h-5 mr-2" />
                    Start Your First Project
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className="text-lg px-8 py-6 hover:bg-muted/50"
                  >
                    <BarChart3 className="w-5 h-5 mr-2" />
                    View Demo
                  </Button>
                </div>

                {/* Quick Stats */}
                {projects.length > 0 && (
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 pt-8">
                    <div className="text-center p-4 rounded-lg bg-card/50 border">
                      <div className="text-2xl font-bold text-primary">{stats.total}</div>
                      <div className="text-sm text-muted-foreground">Projects</div>
                    </div>
                    <div className="text-center p-4 rounded-lg bg-card/50 border">
                      <div className="text-2xl font-bold text-success">{stats.completed}</div>
                      <div className="text-sm text-muted-foreground">Completed</div>
                    </div>
                    <div className="text-center p-4 rounded-lg bg-card/50 border">
                      <div className="text-2xl font-bold text-warning">{stats.active}</div>
                      <div className="text-sm text-muted-foreground">Active</div>
                    </div>
                    <div className="text-center p-4 rounded-lg bg-card/50 border">
                      <div className="text-2xl font-bold text-destructive">{stats.overdue}</div>
                      <div className="text-sm text-muted-foreground">Overdue</div>
                    </div>
                  </div>
                )}
              </div>

              <div className="relative">
                <div className="absolute inset-0 bg-gradient-primary rounded-3xl opacity-20 blur-3xl transform rotate-6" />
                <img 
                  src={heroImage} 
                  alt="Project Management Dashboard" 
                  className="relative rounded-2xl shadow-2xl w-full h-auto transform -rotate-2 hover:rotate-0 transition-transform duration-500"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 px-6 bg-muted/20">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
                Everything You Need to Succeed
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Powerful features designed to help teams collaborate effectively and deliver outstanding results.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <Card key={index} className="bg-gradient-card shadow-custom-card hover:shadow-custom-md transition-all duration-300 group border-0">
                  <CardHeader className="pb-4">
                    <div className={`w-12 h-12 rounded-xl ${feature.bgColor} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                      <feature.icon className={`w-6 h-6 ${feature.color}`} />
                    </div>
                    <CardTitle className="text-xl group-hover:text-primary transition-colors">
                      {feature.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <div className="bg-gradient-card rounded-3xl p-12 shadow-custom-card border">
              <div className="space-y-6">
                <h2 className="text-3xl lg:text-4xl font-bold text-foreground">
                  Ready to Transform Your Project Management?
                </h2>
                <p className="text-xl text-muted-foreground">
                  Join thousands of teams already using ProManage to deliver exceptional results.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button 
                    size="lg" 
                    className="bg-gradient-primary hover:bg-primary-dark text-lg px-8 py-6"
                    onClick={() => setIsProjectDialogOpen(true)}
                  >
                    <Plus className="w-5 h-5 mr-2" />
                    Create Your First Project
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Project Create Dialog */}
        <ProjectCreateDialog 
          open={isProjectDialogOpen} 
          onOpenChange={setIsProjectDialogOpen}
          onProjectCreated={handleProjectCreated}
        />
      </div>
    </Layout>
  );
}