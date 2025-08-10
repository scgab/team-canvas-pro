import { useEffect } from "react";
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Users, FolderPlus, CalendarClock, BarChart3, Shield } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";

const setMetaTag = (name: string, content: string) => {
  let tag = document.querySelector(`meta[name="${name}"]`);
  if (!tag) {
    tag = document.createElement("meta");
    tag.setAttribute("name", name);
    document.head.appendChild(tag);
  }
  tag.setAttribute("content", content);
};

const setCanonical = (href: string) => {
  let link = document.querySelector("link[rel=canonical]");
  if (!link) {
    link = document.createElement("link");
    link.setAttribute("rel", "canonical");
    document.head.appendChild(link);
  }
  link.setAttribute("href", href);
};

const GettingStarted = () => {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Getting Started Guide | WHEEWLS";
    setMetaTag("description", "Learn how to get started with WHEEWLS: create a team, invite members, create projects, plan shifts, and track progress.");
    setCanonical(`${window.location.origin}/getting-started`);
  }, []);

  return (
    <Layout>
      <header className="mb-8 text-center space-y-3">
        <h1 className="text-4xl font-bold">Getting Started with WHEEWLS</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          A quick, step-by-step guide to set up your workspace, invite your team, and launch your first project.
        </p>
        <div className="flex items-center justify-center gap-2">
          <Badge variant="secondary">New user guide</Badge>
          <Badge variant="outline">~5 minutes</Badge>
        </div>
      </header>

      <main className="space-y-8">
        <section aria-labelledby="prerequisites">
          <Card>
            <CardHeader>
              <CardTitle id="prerequisites" className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Prerequisites
              </CardTitle>
              <CardDescription>Make sure you can sign in and access your workspace.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3 sm:grid-cols-2">
              <div className="text-sm text-muted-foreground">1. Create an account or sign in</div>
              <div className="text-sm text-muted-foreground">2. Verify your email if prompted</div>
            </CardContent>
          </Card>
        </section>

        <section aria-labelledby="create-team">
          <Card>
            <CardHeader>
              <CardTitle id="create-team" className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Step 1 · Create your team
              </CardTitle>
              <CardDescription>Set up your organization and add basic details.</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-between gap-4 flex-col sm:flex-row">
              <p className="text-sm text-muted-foreground max-w-2xl">
                Head to the Team page to create or view your team. This is where member roles and permissions are managed.
              </p>
              <Button onClick={() => navigate("/team")} aria-label="Go to Team page">
                Open Team
              </Button>
            </CardContent>
          </Card>
        </section>

        <section aria-labelledby="invite-members">
          <Card>
            <CardHeader>
              <CardTitle id="invite-members" className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5" />
                Step 2 · Invite team members
              </CardTitle>
              <CardDescription>Send invitations so your teammates can join.</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-between gap-4 flex-col sm:flex-row">
              <p className="text-sm text-muted-foreground max-w-2xl">
                From the Team page, use “Add Team Member” to invite by email. Invited users will receive an email to accept and sign in.
              </p>
              <Button variant="secondary" onClick={() => navigate("/team")} aria-label="Invite members on Team page">
                Invite Members
              </Button>
            </CardContent>
          </Card>
        </section>

        <section aria-labelledby="create-project">
          <Card>
            <CardHeader>
              <CardTitle id="create-project" className="flex items-center gap-2">
                <FolderPlus className="w-5 h-5" />
                Step 3 · Create your first project
              </CardTitle>
              <CardDescription>Organize tasks, documents, and timelines.</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-between gap-4 flex-col sm:flex-row">
              <p className="text-sm text-muted-foreground max-w-2xl">
                Use the Projects page to create a new project, add tasks, and assign owners. Switch to the board view for Kanban-style planning.
              </p>
              <div className="flex gap-2">
                <Button onClick={() => navigate("/projects")} aria-label="Open Projects">
                  Open Projects
                </Button>
                <Button variant="outline" onClick={() => navigate("/board")} aria-label="Open Board view">
                  Open Board
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>

        <section aria-labelledby="plan-shifts">
          <Card>
            <CardHeader>
              <CardTitle id="plan-shifts" className="flex items-center gap-2">
                <CalendarClock className="w-5 h-5" />
                Step 4 · Plan shifts and availability
              </CardTitle>
              <CardDescription>Coordinate schedules and ensure coverage.</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-between gap-4 flex-col sm:flex-row">
              <p className="text-sm text-muted-foreground max-w-2xl">
                In Shift Planning, create schedules, manage availability, and notify members. Use the calendar for a visual timeline.
              </p>
              <div className="flex gap-2">
                <Button onClick={() => navigate("/shift-planning")} aria-label="Open Shift Planning">
                  Open Shift Planning
                </Button>
                <Button variant="outline" onClick={() => navigate("/calendar")} aria-label="Open Calendar">
                  Open Calendar
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>

        <section aria-labelledby="track-progress">
          <Card>
            <CardHeader>
              <CardTitle id="track-progress" className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Step 5 · Track progress and report
              </CardTitle>
              <CardDescription>Monitor performance and share updates.</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-between gap-4 flex-col sm:flex-row">
              <p className="text-sm text-muted-foreground max-w-2xl">
                Visit Analytics to view dashboards and export reports. Share insights with stakeholders to keep everyone aligned.
              </p>
              <Button onClick={() => navigate("/analytics")} aria-label="Open Analytics">
                Open Analytics
              </Button>
            </CardContent>
          </Card>
        </section>

        <section aria-labelledby="next-steps">
          <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-0">
            <CardContent className="p-8 text-center">
              <h2 id="next-steps" className="text-2xl font-semibold mb-4">What’s next?</h2>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                Explore the Help Center for advanced topics, integrations, and best practices.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" onClick={() => navigate("/help-center")} aria-label="Go to Help Center">
                  Browse Help Center
                </Button>
                <Button asChild size="lg" variant="outline" aria-label="Contact support">
                  <Link to="/help-center#contact">Contact Support</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>
    </Layout>
  );
};

export default GettingStarted;
