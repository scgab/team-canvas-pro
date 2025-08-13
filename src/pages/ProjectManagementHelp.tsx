import { useState } from "react";
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { 
  ArrowLeft,
  BookOpen,
  CheckCircle,
  Clock,
  FileText,
  FolderOpen,
  BarChart3,
  Users,
  Calendar,
  Settings,
  Target,
  TrendingUp,
  MessageSquare,
  Share2,
  Play,
  Download
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const ProjectManagementHelp = () => {
  const navigate = useNavigate();

  const quickGuides = [
    {
      title: "Creating Your First Project",
      description: "Step-by-step guide to set up a new project",
      icon: FolderOpen,
      duration: "5 min read",
      steps: [
        "Click the 'New Project' button on your dashboard",
        "Fill in the project name and description",
        "Set project deadlines and milestones",
        "Assign team members and roles",
        "Choose project template or start from scratch"
      ]
    },
    {
      title: "Task Management Basics",
      description: "Learn how to create and organize tasks effectively",
      icon: CheckCircle,
      duration: "3 min read",
      steps: [
        "Create tasks within your project",
        "Set task priorities and due dates",
        "Assign tasks to team members",
        "Add task descriptions and attachments",
        "Track task progress and completion"
      ]
    },
    {
      title: "Using the Kanban Board",
      description: "Master visual project management",
      icon: BarChart3,
      duration: "4 min read",
      steps: [
        "Understand the board columns (To Do, In Progress, Done)",
        "Drag and drop tasks between columns",
        "Create custom board columns",
        "Filter tasks by assignee or priority",
        "Use board views for different perspectives"
      ]
    },
    {
      title: "Project Collaboration",
      description: "Work effectively with your team",
      icon: Users,
      duration: "6 min read",
      steps: [
        "Invite team members to projects",
        "Set permissions and access levels",
        "Use comments and mentions",
        "Share files and documents",
        "Track team activity and contributions"
      ]
    }
  ];

  const features = [
    {
      category: "Project Planning",
      icon: Target,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
      items: [
        "Project templates and customization",
        "Milestone tracking and deadlines",
        "Resource allocation and budgeting",
        "Risk assessment and management",
        "Project roadmap visualization"
      ]
    },
    {
      category: "Task Management",
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-100",
      items: [
        "Task creation and assignment",
        "Priority levels and categorization",
        "Due date tracking and reminders",
        "Subtask breakdown and dependencies",
        "Task templates and automation"
      ]
    },
    {
      category: "Team Collaboration",
      icon: MessageSquare,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
      items: [
        "Real-time team messaging",
        "File sharing and version control",
        "Comment threads and discussions",
        "Team member mentions and notifications",
        "Collaborative editing and reviews"
      ]
    },
    {
      category: "Progress Tracking",
      icon: TrendingUp,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
      items: [
        "Visual progress indicators",
        "Time tracking and logging",
        "Burndown charts and analytics",
        "Performance metrics and KPIs",
        "Automated progress reports"
      ]
    }
  ];

  const bestPractices = [
    {
      title: "Project Setup",
      tips: [
        "Define clear project objectives and scope before starting",
        "Break large projects into manageable phases",
        "Set realistic timelines with buffer time",
        "Establish communication protocols early",
        "Document project requirements and constraints"
      ]
    },
    {
      title: "Task Organization",
      tips: [
        "Use consistent naming conventions for tasks",
        "Set appropriate priority levels for each task",
        "Include detailed descriptions and acceptance criteria",
        "Assign tasks based on team member strengths",
        "Regular task review and adjustment sessions"
      ]
    },
    {
      title: "Team Management",
      tips: [
        "Hold regular standup meetings",
        "Encourage open communication and feedback",
        "Recognize team achievements and milestones",
        "Provide clear role definitions and responsibilities",
        "Support team member professional development"
      ]
    },
    {
      title: "Quality Assurance",
      tips: [
        "Implement code/work review processes",
        "Set quality standards and checkpoints",
        "Regular testing and validation procedures",
        "Document lessons learned for future projects",
        "Maintain project documentation throughout lifecycle"
      ]
    }
  ];

  const troubleshooting = [
    {
      problem: "Team members can't see project updates",
      solution: "Check project permissions and ensure team members are properly assigned to the project. Verify notification settings are enabled.",
      category: "Access Issues"
    },
    {
      problem: "Tasks are not showing correct progress",
      solution: "Ensure tasks are properly marked as complete and check if there are any pending subtasks that need attention.",
      category: "Progress Tracking"
    },
    {
      problem: "Project deadlines keep getting missed",
      solution: "Review task estimates, identify bottlenecks, and consider redistributing workload. Set up automated deadline reminders.",
      category: "Timeline Management"
    },
    {
      problem: "Too many notifications overwhelming team",
      solution: "Customize notification settings for different types of updates. Use digest emails instead of real-time notifications.",
      category: "Communication"
    }
  ];

  return (
    <Layout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <Button 
              variant="ghost" 
              onClick={() => navigate('/help-center')}
              className="mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Help Center
            </Button>
            <h1 className="text-3xl font-bold">Project Management Help</h1>
            <p className="text-muted-foreground mt-2">
              Master project organization, task management, and team collaboration
            </p>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => navigate('/projects')}>
              <FolderOpen className="w-4 h-4 mr-2" />
              Go to Projects
            </Button>
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Download Guide
            </Button>
          </div>
        </div>

        <Tabs defaultValue="getting-started" className="space-y-6">
          <TabsList className="grid grid-cols-5 w-full">
            <TabsTrigger value="getting-started">Getting Started</TabsTrigger>
            <TabsTrigger value="features">Features</TabsTrigger>
            <TabsTrigger value="best-practices">Best Practices</TabsTrigger>
            <TabsTrigger value="troubleshooting">Troubleshooting</TabsTrigger>
            <TabsTrigger value="advanced">Advanced</TabsTrigger>
          </TabsList>

          <TabsContent value="getting-started" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  Quick Start Guides
                </CardTitle>
                <CardDescription>
                  Step-by-step guides to get you started with project management
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {quickGuides.map((guide, index) => (
                    <Card key={index} className="hover:shadow-md transition-shadow">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                              <guide.icon className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                              <h3 className="font-semibold">{guide.title}</h3>
                              <p className="text-sm text-muted-foreground">{guide.description}</p>
                            </div>
                          </div>
                          <Badge variant="secondary">{guide.duration}</Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <ol className="space-y-2">
                          {guide.steps.map((step, stepIndex) => (
                            <li key={stepIndex} className="flex items-start gap-2 text-sm">
                              <span className="w-5 h-5 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center mt-0.5 flex-shrink-0">
                                {stepIndex + 1}
                              </span>
                              {step}
                            </li>
                          ))}
                        </ol>
                        <div className="mt-4 flex gap-2">
                          <Button size="sm" variant="outline">
                            <Play className="w-3 h-3 mr-1" />
                            Watch Tutorial
                          </Button>
                          <Button size="sm" variant="ghost">
                            Try Now
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="features" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {features.map((feature, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <div className={`w-8 h-8 ${feature.bgColor} rounded-lg flex items-center justify-center`}>
                        <feature.icon className={`w-4 h-4 ${feature.color}`} />
                      </div>
                      {feature.category}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {feature.items.map((item, itemIndex) => (
                        <li key={itemIndex} className="flex items-center gap-2 text-sm">
                          <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="best-practices" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Project Management Best Practices</CardTitle>
                <CardDescription>
                  Proven strategies to improve your project success rate
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  {bestPractices.map((practice, index) => (
                    <AccordionItem key={index} value={`practice-${index}`}>
                      <AccordionTrigger className="text-left">
                        {practice.title}
                      </AccordionTrigger>
                      <AccordionContent>
                        <ul className="space-y-2">
                          {practice.tips.map((tip, tipIndex) => (
                            <li key={tipIndex} className="flex items-start gap-2">
                              <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                              <span className="text-sm">{tip}</span>
                            </li>
                          ))}
                        </ul>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="troubleshooting" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Common Issues & Solutions</CardTitle>
                <CardDescription>
                  Quick fixes for frequent project management challenges
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {troubleshooting.map((item, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-medium text-sm">{item.problem}</h4>
                        <Badge variant="outline" className="text-xs">
                          {item.category}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        <strong>Solution:</strong> {item.solution}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="advanced" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Advanced Workflows</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <h4 className="font-medium">Automated Project Templates</h4>
                    <p className="text-sm text-muted-foreground">
                      Create reusable project templates with predefined tasks, timelines, and team assignments.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium">Custom Workflows</h4>
                    <p className="text-sm text-muted-foreground">
                      Design custom approval processes and task dependencies for complex projects.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium">Integration Management</h4>
                    <p className="text-sm text-muted-foreground">
                      Connect with external tools like Slack, Google Drive, and development platforms.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Performance Optimization</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <h4 className="font-medium">Project Analytics</h4>
                    <p className="text-sm text-muted-foreground">
                      Use data insights to identify bottlenecks and improve project delivery times.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium">Resource Management</h4>
                    <p className="text-sm text-muted-foreground">
                      Optimize team allocation and workload distribution across multiple projects.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium">Scaling Best Practices</h4>
                    <p className="text-sm text-muted-foreground">
                      Strategies for managing large teams and complex project portfolios.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default ProjectManagementHelp;