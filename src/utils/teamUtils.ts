import { supabase } from "@/integrations/supabase/client";

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar_url?: string;
}

// Default team members for demo purposes
const defaultTeamMembers: TeamMember[] = [
  {
    id: "1",
    name: "Alex Johnson",
    email: "alex@company.com",
    role: "Project Manager"
  },
  {
    id: "2", 
    name: "Sarah Chen",
    email: "sarah@company.com",
    role: "Developer"
  },
  {
    id: "3",
    name: "Mike Wilson", 
    email: "mike@company.com",
    role: "Designer"
  },
  {
    id: "4",
    name: "Emma Davis",
    email: "emma@company.com", 
    role: "QA Engineer"
  }
];

export const getUsers = (): TeamMember[] => {
  // For now, return demo users. In a real app, this would fetch from Supabase
  return defaultTeamMembers;
};

export const getUserById = (id: string): TeamMember | undefined => {
  return getUsers().find(user => user.id === id);
};

export const getUserByEmail = (email: string): TeamMember | undefined => {
  return getUsers().find(user => user.email === email);
};