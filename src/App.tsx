import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthGuard } from "./components/AuthGuard";
import { useAuth } from "./hooks/useAuth";

// Eager: auth + chatbot are needed immediately / on most pages
import Auth from "./pages/Auth";
import ChatBot from "./components/ChatBot";

// Lazy: every other route is code-split so the initial bundle stays small
const Index = lazy(() => import("./pages/Index"));
const Board = lazy(() => import("./pages/Board"));
const Projects = lazy(() => import("./pages/Projects"));
const ProjectDetail = lazy(() => import("./pages/ProjectDetail"));
const ProjectTaskBoard = lazy(() =>
  import("./components/ProjectTaskBoard").then((m) => ({ default: m.ProjectTaskBoard }))
);
const Calendar = lazy(() => import("./pages/Calendar"));
const TestSiteCalendar = lazy(() => import("./pages/TestSiteCalendar"));
const Team = lazy(() => import("./pages/Team"));
const Analytics = lazy(() => import("./pages/Analytics"));
const AITools = lazy(() => import("./pages/AITools"));
const WorkflowAutomations = lazy(() => import("./pages/WorkflowAutomations"));
const Meetings = lazy(() => import("./pages/Meetings"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Settings = lazy(() => import("./pages/Settings"));
const Profile = lazy(() => import("./pages/Profile"));
const ShiftPlanning = lazy(() => import("./pages/ShiftPlanning"));
const Subscription = lazy(() => import("./pages/Subscription"));
const SubscriptionSuccess = lazy(() => import("./pages/SubscriptionSuccess"));
const HelpCenter = lazy(() => import("./pages/HelpCenter"));
const ProjectManagementHelp = lazy(() => import("./pages/ProjectManagementHelp"));
const GettingStarted = lazy(() => import("./pages/GettingStarted"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

const RouteFallback = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
  </div>
);

const App = () => {
  const { user } = useAuth();

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Suspense fallback={<RouteFallback />}>
            <Routes>
              <Route path="/auth" element={<Auth />} />
              <Route path="/" element={<AuthGuard><Index /></AuthGuard>} />
              <Route path="/projects" element={<AuthGuard><Projects /></AuthGuard>} />
              <Route path="/projects/:projectId" element={<AuthGuard><ProjectDetail /></AuthGuard>} />
              <Route path="/projects/:projectId/tasks" element={<AuthGuard><ProjectTaskBoard /></AuthGuard>} />
              <Route path="/board" element={<AuthGuard><Board /></AuthGuard>} />
              <Route path="/calendar" element={<AuthGuard><Calendar /></AuthGuard>} />
              <Route path="/test-site-calendar" element={<AuthGuard><TestSiteCalendar /></AuthGuard>} />
              <Route path="/shift-planning" element={<AuthGuard><ShiftPlanning /></AuthGuard>} />
              <Route path="/meetings" element={<AuthGuard><Meetings /></AuthGuard>} />
              <Route path="/team" element={<AuthGuard><Team /></AuthGuard>} />
              <Route path="/analytics" element={<AuthGuard><Analytics /></AuthGuard>} />
              <Route path="/ai-tools" element={<AuthGuard><AITools /></AuthGuard>} />
              <Route path="/workflow-automations" element={<AuthGuard><WorkflowAutomations /></AuthGuard>} />
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
          </Suspense>
          {user && <ChatBot />}
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
