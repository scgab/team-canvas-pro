import React, { createContext, useContext, useState, useEffect } from 'react';

interface Project {
  id: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  deadline: string;
  status: 'active' | 'completed' | 'paused';
  createdBy: string;
  createdAt: string;
  assignedMembers: string[];
  updatedAt?: string;
}

interface ProjectsContextType {
  projects: Project[];
  loading: boolean;
  createProject: (projectData: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => Project;
  updateProject: (projectId: string, updates: Partial<Project>) => void;
  deleteProject: (projectId: string) => void;
}

const ProjectsContext = createContext<ProjectsContextType | undefined>(undefined);

export const ProjectsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  // Load projects on initialization
  useEffect(() => {
    console.log('ProjectsProvider: Initializing...');
    const loadProjects = () => {
      try {
        const saved = localStorage.getItem('app_projects');
        if (saved) {
          const parsed = JSON.parse(saved);
          console.log('Loaded projects:', parsed);
          setProjects(parsed);
        } else {
          console.log('No saved projects, starting fresh');
          setProjects([]);
        }
      } catch (error) {
        console.error('Error loading projects:', error);
        setProjects([]);
      }
      setLoading(false);
    };
    
    loadProjects();
  }, []);

  // Save projects whenever they change
  useEffect(() => {
    if (!loading) {
      console.log('Saving projects:', projects);
      localStorage.setItem('app_projects', JSON.stringify(projects));
    }
  }, [projects, loading]);

  // Create new project
  const createProject = (projectData: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>): Project => {
    console.log('Creating project:', projectData);
    
    const newProject: Project = {
      ...projectData,
      id: `project_${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    
    console.log('New project object:', newProject);
    
    setProjects(prev => {
      const updated = [...prev, newProject];
      console.log('Updated projects array:', updated);
      return updated;
    });
    
    return newProject;
  };

  // Update project
  const updateProject = (projectId: string, updates: Partial<Project>) => {
    setProjects(prev => 
      prev.map(project => 
        project.id === projectId 
          ? { ...project, ...updates, updatedAt: new Date().toISOString() }
          : project
      )
    );
  };

  // Delete project
  const deleteProject = (projectId: string) => {
    setProjects(prev => prev.filter(project => project.id !== projectId));
  };

  return (
    <ProjectsContext.Provider value={{
      projects,
      loading,
      createProject,
      updateProject,
      deleteProject
    }}>
      {children}
    </ProjectsContext.Provider>
  );
};

// Hook to use projects
export const useProjects = () => {
  const context = useContext(ProjectsContext);
  if (!context) {
    throw new Error('useProjects must be used within ProjectsProvider');
  }
  return context;
};