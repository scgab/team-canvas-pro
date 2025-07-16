import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Project {
  id: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'planning' | 'in-progress' | 'review' | 'completed';
  deadline: Date;
  created_at: Date;
  updated_at: Date;
  createdBy: string;
  progress: number;
  color: string;
  team_size: number;
  assignedMembers: string[];
}

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assignee: string;
  status: 'todo' | 'inProgress' | 'review' | 'done';
  createdBy: string;
  createdAt: string;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: string;
  read: boolean;
}

export interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  description: string;
  type: string;
  createdBy: string;
  createdAt: string;
}

interface SharedDataContextType {
  projects: Project[];
  setProjects: React.Dispatch<React.SetStateAction<Project[]>>;
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  events: CalendarEvent[];
  setEvents: React.Dispatch<React.SetStateAction<CalendarEvent[]>>;
  createProject: (projectData: Omit<Project, 'id' | 'created_at' | 'updated_at' | 'progress' | 'color' | 'team_size' | 'createdBy'>) => void;
  createTask: (taskData: Omit<Task, 'id' | 'createdBy' | 'createdAt'>) => void;
  sendMessage: (senderId: string, receiverId: string, content: string) => void;
  createEvent: (eventData: Omit<CalendarEvent, 'id' | 'createdBy' | 'createdAt'>) => void;
}

const SharedDataContext = createContext<SharedDataContextType | undefined>(undefined);

export const SharedDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // SHARED projects - visible to all users
  const [projects, setProjects] = useState<Project[]>(() => {
    const saved = localStorage.getItem('sharedProjects');
    if (saved) {
      try {
        return JSON.parse(saved).map((p: any) => ({
          ...p,
          deadline: new Date(p.deadline),
          created_at: new Date(p.created_at),
          updated_at: new Date(p.updated_at),
        }));
      } catch (error) {
        console.error('Error parsing shared projects:', error);
        return [];
      }
    }
    return [];
  });

  // SHARED tasks - visible to all users
  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('sharedTasks');
    return saved ? JSON.parse(saved) : [];
  });

  // SHARED messages - visible to all users
  const [messages, setMessages] = useState<Message[]>(() => {
    const saved = localStorage.getItem('sharedMessages');
    return saved ? JSON.parse(saved) : [];
  });

  // SHARED events - visible to all users
  const [events, setEvents] = useState<CalendarEvent[]>(() => {
    const saved = localStorage.getItem('sharedEvents');
    return saved ? JSON.parse(saved) : [];
  });

  // Save all data to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('sharedProjects', JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    localStorage.setItem('sharedTasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('sharedMessages', JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    localStorage.setItem('sharedEvents', JSON.stringify(events));
  }, [events]);

  const createProject = (projectData: Omit<Project, 'id' | 'created_at' | 'updated_at' | 'progress' | 'color' | 'team_size' | 'createdBy'>) => {
    const colors = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6", "#EC4899"];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    
    // Get current user from global window or fallback
    const currentUserEmail = (window as any).currentUserEmail || 'hna@scandac.com';

    const newProject: Project = {
      ...projectData,
      id: Date.now().toString(),
      created_at: new Date(),
      updated_at: new Date(),
      progress: 0,
      color: randomColor,
      team_size: (projectData.assignedMembers?.length || 0) + 1,
      createdBy: currentUserEmail,
    };

    setProjects(prev => [...prev, newProject]);
  };

  const createTask = (taskData: Omit<Task, 'id' | 'createdBy' | 'createdAt'>) => {
    // Get current user from global window or fallback
    const currentUserEmail = (window as any).currentUserEmail || 'hna@scandac.com';

    const newTask: Task = {
      ...taskData,
      id: Date.now().toString(),
      createdBy: currentUserEmail,
      createdAt: new Date().toISOString(),
    };

    setTasks(prev => [...prev, newTask]);
  };

  const sendMessage = (senderId: string, receiverId: string, content: string) => {
    const newMessage: Message = {
      id: Date.now().toString() + Math.random(),
      senderId,
      receiverId,
      content,
      timestamp: new Date().toISOString(),
      read: false,
    };

    setMessages(prev => [...prev, newMessage]);
  };

  const createEvent = (eventData: Omit<CalendarEvent, 'id' | 'createdBy' | 'createdAt'>) => {
    // Get current user from global window or fallback
    const currentUserEmail = (window as any).currentUserEmail || 'hna@scandac.com';

    const newEvent: CalendarEvent = {
      ...eventData,
      id: Date.now().toString(),
      createdBy: currentUserEmail,
      createdAt: new Date().toISOString(),
    };

    setEvents(prev => [...prev, newEvent]);
  };

  return (
    <SharedDataContext.Provider value={{
      projects,
      setProjects,
      tasks,
      setTasks,
      messages,
      setMessages,
      events,
      setEvents,
      createProject,
      createTask,
      sendMessage,
      createEvent,
    }}>
      {children}
    </SharedDataContext.Provider>
  );
};

export const useSharedData = () => {
  const context = useContext(SharedDataContext);
  if (!context) {
    throw new Error('useSharedData must be used within SharedDataProvider');
  }
  return context;
};