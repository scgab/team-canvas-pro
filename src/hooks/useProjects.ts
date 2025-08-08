import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { projectsService } from '@/services/database';
import { useAuth } from '@/hooks/useAuth';

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

export const useProjects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user, loading: authLoading } = useAuth();

  // Load projects from Supabase once auth is ready
  useEffect(() => {
    if (authLoading) return;
    if (user) {
      loadProjects();
    }
  }, [authLoading, user]);

  const loadProjects = async () => {
    try {
      setLoading(true);
      const { TeamDataService } = await import('@/services/teamData');
      const data = await TeamDataService.getTeamProjects();
      const parsedProjects = data.map((p: any) => ({
        ...p,
        priority: p.priority as 'low' | 'medium' | 'high' | 'urgent',
        status: p.status as 'planning' | 'in-progress' | 'review' | 'completed',
        deadline: new Date(p.deadline),
        created_at: new Date(p.created_at),
        updated_at: new Date(p.updated_at),
        assigned_members: p.assigned_members || [],
        shared_with: p.shared_with || []
      }));
      setProjects(parsedProjects);
    } catch (error) {
      console.error('Error loading projects:', error);
      setError('Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  const createProject = async (projectData: Omit<Project, 'id' | 'created_at' | 'updated_at' | 'progress' | 'color' | 'team_size' | 'created_by' | 'status' | 'assigned_members' | 'shared_with'> & { team_members?: string[] }) => {
    try {
      const colors = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6", "#EC4899"];
      const randomColor = colors[Math.floor(Math.random() * colors.length)];

      const projectPayload = {
        title: projectData.title,
        description: projectData.description,
        priority: projectData.priority,
        deadline: projectData.deadline.toISOString().split('T')[0],
        progress: 0,
        color: randomColor,
        team_size: (projectData.team_members?.length || 0) + 1,
        status: 'planning',
        assigned_members: projectData.team_members || [],
        shared_with: projectData.team_members || []
      };

      const { TeamDataService } = await import('@/services/teamData');
      const newProject = await TeamDataService.createProject(projectPayload);
      
      const formattedProject: Project = {
        ...newProject,
        priority: newProject.priority as 'low' | 'medium' | 'high' | 'urgent',
        status: newProject.status as 'planning' | 'in-progress' | 'review' | 'completed',
        deadline: new Date(newProject.deadline),
        created_at: new Date(newProject.created_at),
        updated_at: new Date(newProject.updated_at),
        assigned_members: newProject.assigned_members || [],
        shared_with: newProject.shared_with || []
      };

      setProjects(prev => [...prev, formattedProject]);
      return formattedProject;
    } catch (error) {
      console.error('Error creating project:', error);
      throw error;
    }
  };

  const updateProject = async (id: string, updates: Partial<Project>) => {
    try {
      const { TeamDataService } = await import('@/services/teamData');
      await TeamDataService.updateProject(id, updates);
      setProjects(prev => 
        prev.map(project => 
          project.id === id 
            ? { ...project, ...updates, updated_at: new Date() }
            : project
        )
      );
    } catch (error) {
      console.error('Error updating project:', error);
      throw error;
    }
  };

  const deleteProject = async (id: string) => {
    try {
      const { TeamDataService } = await import('@/services/teamData');
      await TeamDataService.deleteProject(id);
      setProjects(prev => prev.filter(project => project.id !== id));
    } catch (error) {
      console.error('Error deleting project:', error);
      throw error;
    }
  };

  const getProjectById = (id: string) => {
    return projects.find(project => project.id === id);
  };

  const getProjectsByStatus = (status: Project['status']) => {
    return projects.filter(project => project.status === status);
  };

  const shareProject = async (projectId: string, userIds: string[]) => {
    setProjects(prev => 
      prev.map(project => 
        project.id === projectId 
          ? { ...project, shared_with: [...new Set([...project.shared_with, ...userIds])], updated_at: new Date() }
          : project
      )
    );
  };

  const getProjectsForUser = (userId: string) => {
    try {
      return projects.filter(project => {
        // User owns the project or is in shared_with array
        const isOwner = project.created_by === userId;
        const isShared = project.shared_with && project.shared_with.includes(userId);
        return isOwner || isShared;
      });
    } catch (error) {
      console.error('Error filtering projects for user:', error);
      return [];
    }
  };

  const getProjectStats = () => {
    return {
      total: projects.length,
      active: projects.filter(p => p.status === 'in-progress').length,
      completed: projects.filter(p => p.status === 'completed').length,
      overdue: projects.filter(p => 
        p.status !== 'completed' && 
        new Date(p.deadline) < new Date()
      ).length
    };
  };

  return {
    projects,
    loading,
    error,
    createProject,
    updateProject,
    deleteProject,
    getProjectById,
    getProjectsByStatus,
    getProjectStats,
    shareProject,
    getProjectsForUser
  };
};