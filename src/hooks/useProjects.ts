import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import { TeamDataService } from '@/services/teamData';

export interface Project {
  id: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'planning' | 'in-progress' | 'review' | 'completed';
  deadline: Date;
  created_at: Date;
  updated_at: Date;
  created_by: string;
  progress: number;
  color: string;
  team_size: number;
  assigned_members: string[];
  shared_with: string[];
}

const PROJECTS_KEY = ['projects'] as const;

const parseProject = (p: any): Project => ({
  ...p,
  priority: p.priority as Project['priority'],
  status: p.status as Project['status'],
  deadline: new Date(p.deadline),
  created_at: new Date(p.created_at),
  updated_at: new Date(p.updated_at),
  assigned_members: p.assigned_members || [],
  shared_with: p.shared_with || [],
});

export const useProjects = () => {
  const { user, loading: authLoading } = useAuth();
  const qc = useQueryClient();

  const {
    data: projects = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: PROJECTS_KEY,
    enabled: !authLoading && !!user,
    queryFn: async () => {
      const data = await TeamDataService.getTeamProjects();
      return data.map(parseProject);
    },
  });

  const createMutation = useMutation({
    mutationFn: async (
      projectData: Omit<
        Project,
        | 'id'
        | 'created_at'
        | 'updated_at'
        | 'progress'
        | 'color'
        | 'team_size'
        | 'created_by'
        | 'status'
        | 'assigned_members'
        | 'shared_with'
      > & { team_members?: string[] }
    ) => {
      const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];
      const randomColor = colors[Math.floor(Math.random() * colors.length)];
      const payload = {
        title: projectData.title,
        description: projectData.description,
        priority: projectData.priority,
        deadline: projectData.deadline.toISOString().split('T')[0],
        progress: 0,
        color: randomColor,
        team_size: (projectData.team_members?.length || 0) + 1,
        status: 'planning',
        assigned_members: projectData.team_members || [],
        shared_with: projectData.team_members || [],
      };
      const created = await TeamDataService.createProject(payload);
      return parseProject(created);
    },
    onSuccess: (newProject) => {
      qc.setQueryData<Project[]>(PROJECTS_KEY, (prev = []) => [...prev, newProject]);
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Project> }) => {
      await TeamDataService.updateProject(id, updates);
      return { id, updates };
    },
    onSuccess: ({ id, updates }) => {
      qc.setQueryData<Project[]>(PROJECTS_KEY, (prev = []) =>
        prev.map((p) => (p.id === id ? { ...p, ...updates, updated_at: new Date() } : p))
      );
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await TeamDataService.deleteProject(id);
      return id;
    },
    onSuccess: (id) => {
      qc.setQueryData<Project[]>(PROJECTS_KEY, (prev = []) => prev.filter((p) => p.id !== id));
    },
  });

  const getProjectById = (id: string) => projects.find((p) => p.id === id);
  const getProjectsByStatus = (status: Project['status']) =>
    projects.filter((p) => p.status === status);

  const shareProject = async (projectId: string, userIds: string[]) => {
    qc.setQueryData<Project[]>(PROJECTS_KEY, (prev = []) =>
      prev.map((p) =>
        p.id === projectId
          ? {
              ...p,
              shared_with: [...new Set([...(p.shared_with || []), ...userIds])],
              updated_at: new Date(),
            }
          : p
      )
    );
  };

  const getProjectsForUser = (userId: string) =>
    projects.filter(
      (p) => p.created_by === userId || (p.shared_with && p.shared_with.includes(userId))
    );

  const getProjectStats = () => ({
    total: projects.length,
    active: projects.filter((p) => p.status === 'in-progress').length,
    completed: projects.filter((p) => p.status === 'completed').length,
    overdue: projects.filter(
      (p) => p.status !== 'completed' && new Date(p.deadline) < new Date()
    ).length,
  });

  return {
    projects,
    loading: isLoading,
    error: error ? 'Failed to load projects' : null,
    createProject: (data: Parameters<typeof createMutation.mutateAsync>[0]) =>
      createMutation.mutateAsync(data),
    updateProject: (id: string, updates: Partial<Project>) =>
      updateMutation.mutateAsync({ id, updates }),
    deleteProject: (id: string) => deleteMutation.mutateAsync(id),
    getProjectById,
    getProjectsByStatus,
    getProjectStats,
    shareProject,
    getProjectsForUser,
  };
};
