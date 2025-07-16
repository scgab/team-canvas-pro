import { useAuth } from "@/hooks/useAuth";
import { useProjects } from "@/hooks/useProjects";
import Landing from "./Landing";
import { Dashboard } from "@/components/Dashboard";

const Index = () => {
  const { user } = useAuth();
  const { projects } = useProjects();

  // Show landing page if user has no projects, otherwise show dashboard
  return projects.length === 0 ? <Landing /> : <Dashboard />;
};

export default Index;
