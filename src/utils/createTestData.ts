// Test data creation utility
import { Project } from '@/hooks/useProjects';

export const createTestProject = (): Project => {
  const now = new Date();
  const futureDate = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 days from now

  return {
    id: Date.now().toString(),
    title: "Sample Project",
    description: "This is a test project to verify the application works",
    priority: 'medium',
    status: 'planning',
    deadline: futureDate,
    created_at: now,
    updated_at: now,
    user_id: '1', // HNA user
    progress: 0,
    color: "#3B82F6",
    team_size: 1,
    shared_with: []
  };
};

export const initializeTestProjects = () => {
  try {
    const existingProjects = localStorage.getItem('projects');
    if (!existingProjects) {
      const testProject = createTestProject();
      localStorage.setItem('projects', JSON.stringify([testProject]));
      console.log('Test project created:', testProject);
    }
  } catch (error) {
    console.error('Error initializing test projects:', error);
  }
};