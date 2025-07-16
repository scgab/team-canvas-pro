import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface Project {
  id: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'planning' | 'in-progress' | 'review' | 'completed';
  deadline: Date;
  created_at: Date;
  updated_at: Date;
  user_id?: string;
  progress: number;
  color: string;
  team_size: number;
  shared_with: string[]; // Array of user IDs who have access to this project
}

export const useProjects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load projects from localStorage on mount
  useEffect(() => {
    try {
      const savedProjects = localStorage.getItem('projects');
      if (savedProjects) {
        try {
          const parsedProjects = JSON.parse(savedProjects).map((p: any) => ({
            ...p,
            deadline: new Date(p.deadline),
            created_at: new Date(p.created_at),
            updated_at: new Date(p.updated_at),
            shared_with: p.shared_with || [] // Ensure shared_with exists
          }));
          setProjects(parsedProjects);
          console.log('Loaded projects from localStorage:', parsedProjects);
        } catch (parseError) {
          console.error('Error parsing saved projects:', parseError);
          // Clear corrupted data
          localStorage.removeItem('projects');
        }
      }
    } catch (error) {
      console.error('Error loading projects:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Save projects to localStorage whenever projects change
  useEffect(() => {
    if (!loading && projects.length >= 0) {
      try {
        localStorage.setItem('projects', JSON.stringify(projects));
        console.log('Saved projects to localStorage:', projects.length, 'projects');
      } catch (error) {
        console.error('Error saving projects to localStorage:', error);
      }
    }
  }, [projects, loading]);

  const createProject = async (projectData: Omit<Project, 'id' | 'created_at' | 'updated_at' | 'progress' | 'color' | 'team_size' | 'user_id' | 'status' | 'shared_with'> & { team_members?: string[] }) => {
    try {
      const colors = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6", "#EC4899"];
      const randomColor = colors[Math.floor(Math.random() * colors.length)];

      // Get current user from global window or fallback
      const currentUserEmail = (window as any).currentUserEmail;
      let currentUserId = '1'; // Default fallback
      
      if (currentUserEmail) {
        // Find user ID based on email
        if (currentUserEmail === 'hna@scandac.com') {
          currentUserId = '1';
        } else if (currentUserEmail === 'myh@scandac.com') {
          currentUserId = '2';
        }
      }

      const newProject: Project = {
        ...projectData,
        id: Date.now().toString(),
        created_at: new Date(),
        updated_at: new Date(),
        progress: 0,
        color: randomColor,
        team_size: (projectData.team_members?.length || 0) + 1, // Include creator
        status: 'planning',
        user_id: currentUserId,
        shared_with: projectData.team_members || []
      };

      console.log('Creating project:', newProject);
      setProjects(prev => {
        const updated = [...prev, newProject];
        console.log('Updated projects:', updated);
        return updated;
      });

      return newProject;
    } catch (error) {
      console.error('Error creating project:', error);
      throw error;
    }
  };

  const updateProject = async (id: string, updates: Partial<Project>) => {
    setProjects(prev => 
      prev.map(project => 
        project.id === id 
          ? { ...project, ...updates, updated_at: new Date() }
          : project
      )
    );
  };

  const deleteProject = async (id: string) => {
    setProjects(prev => prev.filter(project => project.id !== id));
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
        const isOwner = project.user_id === userId;
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