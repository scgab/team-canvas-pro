import { useAuth } from "@/hooks/useAuth";
import Landing from "./Landing";
import { Dashboard } from "@/components/Dashboard";

const Index = () => {
  const { user } = useAuth();

  // Show dashboard if user is authenticated, otherwise show landing page
  return user ? <Dashboard /> : <Landing />;
};

export default Index;
