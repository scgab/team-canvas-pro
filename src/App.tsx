import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Board from "./pages/Board";
import Projects from "./pages/Projects";
import ProjectDetail from "./pages/ProjectDetail";
import { ProjectTaskBoard } from "./components/ProjectTaskBoard";
import Calendar from "./pages/Calendar";
import Team from "./pages/Team";
import Analytics from "./pages/Analytics";
import AITools from "./pages/AITools";
import Meetings from "./pages/Meetings";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import Settings from "./pages/Settings";
import Profile from "./pages/Profile";
import ShiftPlanning from "./pages/ShiftPlanning";
import Subscription from "./pages/Subscription";
import SubscriptionSuccess from "./pages/SubscriptionSuccess";
import HelpCenter from "./pages/HelpCenter";
import ProjectManagementHelp from "./pages/ProjectManagementHelp";
import GettingStarted from "./pages/GettingStarted";
import { AuthGuard } from "./components/AuthGuard";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/auth" element={<Auth />} />
          <Route path="/" element={<AuthGuard><Index /></AuthGuard>} />
          <Route path="/projects" element={<AuthGuard><Projects /></AuthGuard>} />
          <Route path="/projects/:projectId" element={<AuthGuard><ProjectDetail /></AuthGuard>} />
          <Route path="/projects/:projectId/tasks" element={<AuthGuard><ProjectTaskBoard /></AuthGuard>} />
          <Route path="/board" element={<AuthGuard><Board /></AuthGuard>} />
          <Route path="/calendar" element={<AuthGuard><Calendar /></AuthGuard>} />
          <Route path="/shift-planning" element={<AuthGuard><ShiftPlanning /></AuthGuard>} />
          <Route path="/meetings" element={<AuthGuard><Meetings /></AuthGuard>} />
          <Route path="/team" element={<AuthGuard><Team /></AuthGuard>} />
          <Route path="/analytics" element={<AuthGuard><Analytics /></AuthGuard>} />
          <Route path="/ai-tools" element={<AuthGuard><AITools /></AuthGuard>} />
          <Route path="/settings" element={<AuthGuard><Settings /></AuthGuard>} />
          <Route path="/profile" element={<AuthGuard><Profile /></AuthGuard>} />
          <Route path="/help-center" element={<AuthGuard><HelpCenter /></AuthGuard>} />
          <Route path="/help/project-management" element={<AuthGuard><ProjectManagementHelp /></AuthGuard>} />
          <Route path="/getting-started" element={<AuthGuard><GettingStarted /></AuthGuard>} />
          <Route path="/subscription" element={<AuthGuard><Subscription /></AuthGuard>} />
          <Route path="/subscription-success" element={<AuthGuard><SubscriptionSuccess /></AuthGuard>} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
