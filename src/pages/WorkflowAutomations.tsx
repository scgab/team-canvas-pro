import React, { useState, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Plus, 
  Play, 
  Pause, 
  Edit, 
  Trash2, 
  Zap, 
  Calendar, 
  Mail, 
  FileText, 
  Users, 
  Bell,
  Clock,
  CheckCircle,
  AlertCircle,
  Settings,
  Bot,
  Workflow,
  ArrowRight,
  Copy
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { ConfirmDialog } from "@/components/ConfirmDialog";
interface WorkflowAction {
  id: string;
  type: 'email' | 'notification' | 'summary' | 'task_create' | 'webhook';
  name: string;
  config: any;
}

interface WorkflowTrigger {
  id: string;
  type: 'meeting_created' | 'meeting_completed' | 'task_completed' | 'project_updated' | 'time_scheduled';
  name: string;
  config: any;
}

interface Workflow {
  id: string;
  name: string;
  description: string;
  trigger: WorkflowTrigger;
  actions: WorkflowAction[];
  isActive: boolean;
  lastRun?: string;
  runs: number;
  createdAt: string;
}

interface AIAgent {
  id: string;
  name: string;
  description: string;
  role: string;
  instructions: string;
  triggers: string[];
  isActive: boolean;
  model: string;
  lastInteraction?: string;
  totalInteractions: number;
  createdAt: string;
}

const WorkflowAutomations = () => {
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [aiAgents, setAIAgents] = useState<AIAgent[]>([]);
  const [isCreateWorkflowOpen, setIsCreateWorkflowOpen] = useState(false);
  const [isCreateAgentOpen, setIsCreateAgentOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("workflows");
  const { toast } = useToast();

  // Edit/Delete/Test state
  const [editWorkflow, setEditWorkflow] = useState<Workflow | null>(null);
  const [deleteWorkflowRef, setDeleteWorkflowRef] = useState<Workflow | null>(null);
  const [editAgent, setEditAgent] = useState<AIAgent | null>(null);
  const [deleteAgentRef, setDeleteAgentRef] = useState<AIAgent | null>(null);
  const [testAgentRef, setTestAgentRef] = useState<AIAgent | null>(null);
  const [testPrompt, setTestPrompt] = useState("");
  const [testResult, setTestResult] = useState<string | null>(null);
  const [testing, setTesting] = useState(false);

  // Sample data
  useEffect(() => {
    const sampleWorkflows: Workflow[] = [
      {
        id: "1",
        name: "Meeting Summary & Email",
        description: "Automatically generate AI summaries when meetings are completed and email them to attendees",
        trigger: {
          id: "t1",
          type: "meeting_completed",
          name: "When meeting is completed",
          config: { eventType: "all" }
        },
        actions: [
          {
            id: "a1",
            type: "summary",
            name: "Generate AI Summary",
            config: { model: "gemini-2.0-flash-exp", includeKeyPoints: true, includeActionItems: true }
          },
          {
            id: "a2", 
            type: "email",
            name: "Send Email to Attendees",
            config: { template: "meeting_summary", recipients: "attendees" }
          }
        ],
        isActive: true,
        lastRun: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
        runs: 23,
        createdAt: "2024-01-10T09:00:00Z"
      },
      {
        id: "2",
        name: "Project Completion Notification",
        description: "Notify team members when project tasks are completed",
        trigger: {
          id: "t2",
          type: "task_completed",
          name: "When task is completed",
          config: { priority: "high" }
        },
        actions: [
          {
            id: "a3",
            type: "notification",
            name: "Send Team Notification",
            config: { channels: ["slack", "email"], urgency: "normal" }
          }
        ],
        isActive: true,
        lastRun: "2024-01-14T14:20:00Z",
        runs: 45,
        createdAt: "2024-01-08T11:00:00Z"
      }
    ];

    const sampleAgents: AIAgent[] = [
      {
        id: "1",
        name: "Project Assistant",
        description: "Helps manage project tasks and deadlines",
        role: "Project Management Assistant",
        instructions: "You are a helpful project management assistant. Help users organize tasks, set priorities, and manage deadlines. Always be proactive in suggesting improvements.",
        triggers: ["project_created", "task_overdue"],
        isActive: true,
        model: "gpt-4",
        lastInteraction: "2024-01-15T16:45:00Z",
        totalInteractions: 127,
        createdAt: "2024-01-05T10:00:00Z"
      },
      {
        id: "2", 
        name: "Meeting Coordinator",
        description: "Automates meeting scheduling and follow-ups",
        role: "Meeting Coordinator",
        instructions: "You specialize in meeting coordination. Help schedule meetings, send reminders, take notes, and create action items from meeting discussions.",
        triggers: ["meeting_scheduled", "meeting_ended"],
        isActive: true,
        model: "gpt-4",
        lastInteraction: "2024-01-15T11:20:00Z",
        totalInteractions: 89,
        createdAt: "2024-01-07T13:30:00Z"
      }
    ];

    setWorkflows(sampleWorkflows);
    setAIAgents(sampleAgents);
  }, []);

  const toggleWorkflow = (id: string) => {
    setWorkflows(prev => prev.map(w => 
      w.id === id ? { ...w, isActive: !w.isActive } : w
    ));
    toast({
      title: "Workflow Updated",
      description: "Workflow status has been changed successfully.",
    });
  };

  const toggleAgent = (id: string) => {
    setAIAgents(prev => prev.map(a => 
      a.id === id ? { ...a, isActive: !a.isActive } : a
    ));
    toast({
      title: "AI Agent Updated", 
      description: "AI Agent status has been changed successfully.",
    });
  };

  const duplicateWorkflow = (workflow: Workflow) => {
    const newWorkflow = {
      ...workflow,
      id: Date.now().toString(),
      name: `${workflow.name} (Copy)`,
      isActive: false,
      runs: 0,
      lastRun: undefined,
      createdAt: new Date().toISOString()
    };
    setWorkflows(prev => [...prev, newWorkflow]);
    toast({
      title: "Workflow Duplicated",
      description: "Workflow has been successfully duplicated.",
    });
  };

  const createWorkflow = (formData: any) => {
    const newWorkflow: Workflow = {
      id: Date.now().toString(),
      name: formData.name,
      description: formData.description,
      trigger: {
        id: "t" + Date.now(),
        type: formData.triggerType,
        name: formData.triggerName,
        config: {}
      },
      actions: [],
      isActive: false,
      runs: 0,
      createdAt: new Date().toISOString()
    };
    setWorkflows(prev => [...prev, newWorkflow]);
    setIsCreateWorkflowOpen(false);
    toast({
      title: "Workflow Created",
      description: "Your new workflow has been created successfully.",
    });
  };

  const createAgent = (formData: any) => {
    const newAgent: AIAgent = {
      id: Date.now().toString(),
      name: formData.name,
      description: formData.description,
      role: formData.role,
      instructions: formData.instructions,
      triggers: formData.triggers || [],
      isActive: false,
      model: formData.model || "gpt-4",
      totalInteractions: 0,
      createdAt: new Date().toISOString()
    };
    setAIAgents(prev => [...prev, newAgent]);
    setIsCreateAgentOpen(false);
    toast({
      title: "AI Agent Created",
      description: "Your new AI agent has been created successfully.",
    });
  };

  // Save edited workflow
  const saveEditedWorkflow = (formData: any) => {
    if (!editWorkflow) return;
    setWorkflows(prev => prev.map(w =>
      w.id === editWorkflow.id
        ? {
            ...w,
            name: formData.name,
            description: formData.description,
            trigger: {
              ...w.trigger,
              type: formData.triggerType || w.trigger.type,
              name: formData.triggerName || w.trigger.name,
            },
          }
        : w
    ));
    setEditWorkflow(null);
    toast({ title: "Workflow Updated", description: "Changes saved successfully." });
  };

  // Delete workflow
  const confirmDeleteWorkflow = () => {
    if (!deleteWorkflowRef) return;
    setWorkflows(prev => prev.filter(w => w.id !== deleteWorkflowRef.id));
    setDeleteWorkflowRef(null);
    toast({ title: "Workflow Deleted", description: "Workflow removed successfully." });
  };

  // Save edited agent
  const saveEditedAgent = (formData: any) => {
    if (!editAgent) return;
    setAIAgents(prev => prev.map(a =>
      a.id === editAgent.id
        ? {
            ...a,
            name: formData.name,
            description: formData.description,
            role: formData.role,
            instructions: formData.instructions,
            model: formData.model,
          }
        : a
    ));
    setEditAgent(null);
    toast({ title: "Agent Updated", description: "Agent settings saved." });
  };

  // Delete agent
  const confirmDeleteAgent = () => {
    if (!deleteAgentRef) return;
    setAIAgents(prev => prev.filter(a => a.id !== deleteAgentRef.id));
    setDeleteAgentRef(null);
    toast({ title: "Agent Deleted", description: "AI Agent removed successfully." });
  };

  // Test agent (simulated)
  const runTestAgent = async () => {
    if (!testAgentRef) return;
    setTesting(true);
    setTestResult(null);
    await new Promise(r => setTimeout(r, 600));
    const snippet = testPrompt.trim() || "No prompt provided";
    const result = `Agent "${testAgentRef.name}" response:\n\nSummary:\n- ${snippet.slice(0, 140)}${snippet.length > 140 ? '...' : ''}\n\nNext steps:\n- Notify team about outcomes\n- Create action items\n- Schedule follow-up`;
    setTestResult(result);
    setTesting(false);
  };

  return (
    <Layout>
      <div className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Workflow Automations & AI Agents
          </h1>
          <p className="text-muted-foreground text-lg">
            Automate your workflows and create intelligent agents to boost productivity
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="workflows" className="flex items-center gap-2">
              <Workflow className="w-4 h-4" />
              Workflows
            </TabsTrigger>
            <TabsTrigger value="agents" className="flex items-center gap-2">
              <Bot className="w-4 h-4" />
              AI Agents
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="workflows" className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-semibold text-foreground">Workflows</h2>
                <p className="text-muted-foreground">Automate repetitive tasks with custom workflows</p>
              </div>
              <Dialog open={isCreateWorkflowOpen} onOpenChange={setIsCreateWorkflowOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-primary hover:bg-primary-dark text-primary-foreground">
                    <Plus className="w-4 h-4 mr-2" />
                    Create Workflow
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Create New Workflow</DialogTitle>
                  </DialogHeader>
                  <CreateWorkflowForm onCreate={createWorkflow} />
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {workflows.map((workflow) => (
                <Card key={workflow.id} className="bg-card border border-border shadow-custom-card">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                    <div className="space-y-1">
                      <CardTitle className="text-lg font-semibold text-card-foreground">
                        {workflow.name}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground">
                        {workflow.description}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={workflow.isActive}
                        onCheckedChange={() => toggleWorkflow(workflow.id)}
                      />
                      <Badge variant={workflow.isActive ? "default" : "secondary"}>
                        {workflow.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <Zap className="w-4 h-4" />
                        <span>Trigger: {workflow.trigger.name}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <ArrowRight className="w-4 h-4" />
                        <span>{workflow.actions.length} actions configured</span>
                      </div>
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span>Runs: {workflow.runs}</span>
                        {workflow.lastRun && (
                          <span>
                            Last run: {new Date(workflow.lastRun).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                        <div className="flex space-x-2 pt-2">
                          <Button variant="outline" size="sm" onClick={() => setEditWorkflow(workflow)}>
                            <Edit className="w-4 h-4 mr-1" />
                            Edit
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => duplicateWorkflow(workflow)}
                          >
                            <Copy className="w-4 h-4 mr-1" />
                            Duplicate
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => setDeleteWorkflowRef(workflow)}>
                            <Trash2 className="w-4 h-4 mr-1" />
                            Delete
                          </Button>
                        </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="agents" className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-semibold text-foreground">AI Agents</h2>
                <p className="text-muted-foreground">Create intelligent agents to assist your team</p>
              </div>
              <Dialog open={isCreateAgentOpen} onOpenChange={setIsCreateAgentOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-primary hover:bg-primary-dark text-primary-foreground">
                    <Plus className="w-4 h-4 mr-2" />
                    Create AI Agent
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Create New AI Agent</DialogTitle>
                  </DialogHeader>
                  <CreateAgentForm onCreate={createAgent} />
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {aiAgents.map((agent) => (
                <Card key={agent.id} className="bg-card border border-border shadow-custom-card">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                    <div className="space-y-1">
                      <CardTitle className="text-lg font-semibold text-card-foreground flex items-center gap-2">
                        <Bot className="w-5 h-5" />
                        {agent.name}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground">
                        {agent.description}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={agent.isActive}
                        onCheckedChange={() => toggleAgent(agent.id)}
                      />
                      <Badge variant={agent.isActive ? "default" : "secondary"}>
                        {agent.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <Settings className="w-4 h-4" />
                        <span>Role: {agent.role}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <Zap className="w-4 h-4" />
                        <span>Model: {agent.model}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span>Interactions: {agent.totalInteractions}</span>
                        {agent.lastInteraction && (
                          <span>
                            Last active: {new Date(agent.lastInteraction).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                      <div className="flex space-x-2 pt-2">
                        <Button variant="outline" size="sm" onClick={() => setEditAgent(agent)}>
                          <Edit className="w-4 h-4 mr-1" />
                          Configure
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => { setTestAgentRef(agent); setTestPrompt(""); setTestResult(null); }}>
                          <Play className="w-4 h-4 mr-1" />
                          Test Agent
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => setDeleteAgentRef(agent)}>
                          <Trash2 className="w-4 h-4 mr-1" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div>
              <h2 className="text-2xl font-semibold text-foreground mb-4">Analytics & Performance</h2>
              <div className="grid gap-6 md:grid-cols-3">
                <Card className="bg-card border border-border">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-card-foreground">
                      Total Workflows
                    </CardTitle>
                    <Workflow className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-card-foreground">{workflows.length}</div>
                    <p className="text-xs text-muted-foreground">
                      {workflows.filter(w => w.isActive).length} active
                    </p>
                  </CardContent>
                </Card>
                <Card className="bg-card border border-border">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-card-foreground">
                      Total AI Agents
                    </CardTitle>
                    <Bot className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-card-foreground">{aiAgents.length}</div>
                    <p className="text-xs text-muted-foreground">
                      {aiAgents.filter(a => a.isActive).length} active
                    </p>
                  </CardContent>
                </Card>
                <Card className="bg-card border border-border">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-card-foreground">
                      Total Executions
                    </CardTitle>
                    <CheckCircle className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-card-foreground">
                      {workflows.reduce((sum, w) => sum + w.runs, 0)}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      This month
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
          {/* Edit / Delete / Test Modals */}
          {editWorkflow && (
            <Dialog open={!!editWorkflow} onOpenChange={(o) => { if (!o) setEditWorkflow(null); }}>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Edit Workflow</DialogTitle>
                </DialogHeader>
                <WorkflowEditForm initial={editWorkflow} onSave={saveEditedWorkflow} />
              </DialogContent>
            </Dialog>
          )}

          <ConfirmDialog
            open={!!deleteWorkflowRef}
            onOpenChange={(o) => { if (!o) setDeleteWorkflowRef(null); }}
            title="Delete workflow?"
            description={`This will permanently delete "${deleteWorkflowRef?.name}".`}
            confirmText="Delete"
            variant="destructive"
            onConfirm={confirmDeleteWorkflow}
          />

          {editAgent && (
            <Dialog open={!!editAgent} onOpenChange={(o) => { if (!o) setEditAgent(null); }}>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Configure AI Agent</DialogTitle>
                </DialogHeader>
                <AgentEditForm initial={editAgent} onSave={saveEditedAgent} />
              </DialogContent>
            </Dialog>
          )}

          {testAgentRef && (
            <Dialog open={!!testAgentRef} onOpenChange={(o) => { if (!o) { setTestAgentRef(null); setTestResult(null); setTesting(false); } }}>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Test {testAgentRef?.name}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="testPrompt">Prompt</Label>
                    <Textarea
                      id="testPrompt"
                      value={testPrompt}
                      onChange={(e) => setTestPrompt(e.target.value)}
                      placeholder="Describe what you want the agent to do..."
                      rows={4}
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Button className="bg-primary text-primary-foreground" disabled={testing} onClick={runTestAgent}>
                      {testing ? 'Testing...' : 'Run Test'}
                    </Button>
                  </div>
                  {testResult && (
                    <Card className="bg-card border border-border">
                      <CardHeader>
                        <CardTitle className="text-sm">Result</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <pre className="whitespace-pre-wrap text-sm text-muted-foreground">{testResult}</pre>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </DialogContent>
            </Dialog>
          )}

          <ConfirmDialog
            open={!!deleteAgentRef}
            onOpenChange={(o) => { if (!o) setDeleteAgentRef(null); }}
            title="Delete AI agent?"
            description={`This will permanently delete "${deleteAgentRef?.name}".`}
            confirmText="Delete"
            variant="destructive"
            onConfirm={confirmDeleteAgent}
          />
        </Tabs>
      </div>
    </Layout>
  );
};

const CreateWorkflowForm = ({ onCreate }: { onCreate: (data: any) => void }) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    triggerType: "",
    triggerName: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.description && formData.triggerType) {
      onCreate(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Workflow Name</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="Enter workflow name"
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Describe what this workflow does"
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="trigger">Trigger Event</Label>
        <Select 
          value={formData.triggerType} 
          onValueChange={(value) => setFormData({ 
            ...formData, 
            triggerType: value,
            triggerName: value === "meeting_created" ? "When meeting is created" :
                          value === "meeting_completed" ? "When meeting is completed" :
                          value === "task_completed" ? "When task is completed" :
                          value === "project_updated" ? "When project is updated" : 
                          "When scheduled time occurs"
          })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a trigger event" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="meeting_created">Meeting Created</SelectItem>
            <SelectItem value="meeting_completed">Meeting Completed</SelectItem>
            <SelectItem value="task_completed">Task Completed</SelectItem>
            <SelectItem value="project_updated">Project Updated</SelectItem>
            <SelectItem value="time_scheduled">Scheduled Time</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Button type="submit" className="w-full bg-primary hover:bg-primary-dark text-primary-foreground">
        Create Workflow
      </Button>
    </form>
  );
};

const CreateAgentForm = ({ onCreate }: { onCreate: (data: any) => void }) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    role: "",
    instructions: "",
    model: "gpt-4"
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.description && formData.role && formData.instructions) {
      onCreate(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="agentName">Agent Name</Label>
        <Input
          id="agentName"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="Enter agent name"
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="agentDescription">Description</Label>
        <Textarea
          id="agentDescription"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Describe what this agent does"
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="role">Agent Role</Label>
        <Input
          id="role"
          value={formData.role}
          onChange={(e) => setFormData({ ...formData, role: e.target.value })}
          placeholder="e.g., Project Assistant, Meeting Coordinator"
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="instructions">Instructions</Label>
        <Textarea
          id="instructions"
          value={formData.instructions}
          onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
          placeholder="Provide detailed instructions for the AI agent"
          rows={4}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="model">AI Model</Label>
        <Select value={formData.model} onValueChange={(value) => setFormData({ ...formData, model: value })}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="gpt-4">GPT-4</SelectItem>
            <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
            <SelectItem value="claude-3">Claude 3</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Button type="submit" className="w-full bg-primary hover:bg-primary-dark text-primary-foreground">
        Create AI Agent
      </Button>
    </form>
  );
};

const WorkflowEditForm = ({ initial, onSave }: { initial: Workflow; onSave: (data: any) => void }) => {
  const [formData, setFormData] = useState({
    name: initial.name,
    description: initial.description,
    triggerType: initial.trigger.type,
    triggerName: initial.trigger.name,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name-edit">Workflow Name</Label>
        <Input id="name-edit" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="description-edit">Description</Label>
        <Textarea id="description-edit" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
      </div>
      <div className="space-y-2">
        <Label>Trigger Event</Label>
        <Select 
          value={formData.triggerType}
          onValueChange={(value) => setFormData({
            ...formData,
            triggerType: value as WorkflowTrigger['type'],
            triggerName: value === 'meeting_created' ? 'When meeting is created' :
                          value === 'meeting_completed' ? 'When meeting is completed' :
                          value === 'task_completed' ? 'When task is completed' :
                          value === 'project_updated' ? 'When project is updated' :
                          'When scheduled time occurs',
          })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="meeting_created">Meeting Created</SelectItem>
            <SelectItem value="meeting_completed">Meeting Completed</SelectItem>
            <SelectItem value="task_completed">Task Completed</SelectItem>
            <SelectItem value="project_updated">Project Updated</SelectItem>
            <SelectItem value="time_scheduled">Scheduled Time</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Button type="submit" className="w-full bg-primary hover:bg-primary-dark text-primary-foreground">Save Changes</Button>
    </form>
  );
};

const AgentEditForm = ({ initial, onSave }: { initial: AIAgent; onSave: (data: any) => void }) => {
  const [formData, setFormData] = useState({
    name: initial.name,
    description: initial.description,
    role: initial.role,
    instructions: initial.instructions,
    model: initial.model,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="agentName-edit">Agent Name</Label>
        <Input id="agentName-edit" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="agentDescription-edit">Description</Label>
        <Textarea id="agentDescription-edit" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="role-edit">Agent Role</Label>
        <Input id="role-edit" value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value })} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="instructions-edit">Instructions</Label>
        <Textarea id="instructions-edit" rows={4} value={formData.instructions} onChange={(e) => setFormData({ ...formData, instructions: e.target.value })} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="model-edit">AI Model</Label>
        <Select value={formData.model} onValueChange={(value) => setFormData({ ...formData, model: value })}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="gpt-4">GPT-4</SelectItem>
            <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
            <SelectItem value="claude-3">Claude 3</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Button type="submit" className="w-full bg-primary hover:bg-primary-dark text-primary-foreground">Save Changes</Button>
    </form>
  );
};

export default WorkflowAutomations;