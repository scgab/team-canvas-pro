import React, { createContext, useContext, useState, useEffect } from 'react';
import { projectsService, tasksService, messagesService, calendarService } from '@/services/database';
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
  project_id?: string;
  start_date?: Date | null;
  due_date?: Date | null;
  duration?: number;
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
  loading: boolean;
  createProject: (projectData: Omit<Project, 'id' | 'created_at' | 'updated_at' | 'progress' | 'color' | 'team_size' | 'createdBy'>) => Promise<void>;
  createTask: (taskData: Omit<Task, 'id' | 'createdBy' | 'createdAt'>) => Promise<Task>;
  sendMessage: (senderId: string, receiverId: string, content: string) => Promise<void>;
  createEvent: (eventData: Omit<CalendarEvent, 'id' | 'createdBy' | 'createdAt'>) => Promise<void>;
}

const SharedDataContext = createContext<SharedDataContextType | undefined>(undefined);

export const SharedDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);

  // Load data from Supabase on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        
        // Load all data in parallel
        const [projectsData, tasksData, messagesData, eventsData] = await Promise.all([
          projectsService.getAll(),
          tasksService.getAll(),
          messagesService.getAll(),
          calendarService.getAll()
        ]);

        // Transform data to match interface
        const transformedProjects: Project[] = projectsData.map((p: any) => ({
          id: p.id,
          title: p.title,
          description: p.description,
          priority: p.priority as 'low' | 'medium' | 'high' | 'urgent',
          status: p.status as 'planning' | 'in-progress' | 'review' | 'completed',
          deadline: new Date(p.deadline),
          created_at: new Date(p.created_at),
          updated_at: new Date(p.updated_at),
          createdBy: p.created_by,
          progress: p.progress,
          color: p.color,
          team_size: p.team_size,
          assignedMembers: p.assigned_members || []
        }));

        const transformedTasks: Task[] = tasksData.map((t: any) => ({
          id: t.id,
          title: t.title,
          description: t.description,
          priority: t.priority as 'low' | 'medium' | 'high' | 'urgent',
          assignee: t.assignee,
          status: t.status as 'todo' | 'inProgress' | 'review' | 'done',
          createdBy: t.created_by,
          createdAt: t.created_at
        }));

        const transformedMessages = messagesData.map((m: any) => ({
          id: m.id,
          senderId: m.sender_id,
          receiverId: m.receiver_id,
          content: m.content,
          timestamp: m.created_at,
          read: m.read
        }));

        const transformedEvents = eventsData.map((e: any) => ({
          id: e.id,
          title: e.title,
          date: e.date,
          time: e.time,
          description: e.description,
          type: e.type,
          createdBy: e.created_by,
          createdAt: e.created_at
        }));

        setProjects(transformedProjects);
        setTasks(transformedTasks);
        setMessages(transformedMessages);
        setEvents(transformedEvents);
      } catch (error) {
        console.error('Error loading data from Supabase:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const createProject = async (projectData: Omit<Project, 'id' | 'created_at' | 'updated_at' | 'progress' | 'color' | 'team_size' | 'createdBy'>) => {
    try {
      const colors = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6", "#EC4899"];
      const randomColor = colors[Math.floor(Math.random() * colors.length)];
      const currentUserEmail = (window as any).currentUserEmail || 'hna@scandac.com';

      const newProject = await projectsService.create({
        title: projectData.title,
        description: projectData.description,
        priority: projectData.priority,
        deadline: projectData.deadline,
        created_by: currentUserEmail,
        assigned_members: projectData.assignedMembers || [],
        color: randomColor,
        team_size: (projectData.assignedMembers?.length || 0) + 1
      });

      const transformedProject: Project = {
        id: newProject.id,
        title: newProject.title,
        description: newProject.description,
        priority: newProject.priority as 'low' | 'medium' | 'high' | 'urgent',
        status: newProject.status as 'planning' | 'in-progress' | 'review' | 'completed',
        deadline: new Date(newProject.deadline),
        created_at: new Date(newProject.created_at),
        updated_at: new Date(newProject.updated_at),
        createdBy: newProject.created_by,
        progress: newProject.progress,
        color: newProject.color,
        team_size: newProject.team_size,
        assignedMembers: newProject.assigned_members || []
      };

      setProjects(prev => [...prev, transformedProject]);
    } catch (error) {
      console.error('Error creating project:', error);
      throw error;
    }
  };

  const createTask = async (taskData: Omit<Task, 'id' | 'createdBy' | 'createdAt'>): Promise<Task> => {
    try {
      const currentUserEmail = (window as any).currentUserEmail || 'hna@scandac.com';

      const newTask = await tasksService.create({
        title: taskData.title,
        description: taskData.description,
        priority: taskData.priority,
        status: taskData.status,
        assignee: taskData.assignee,
        project_id: taskData.project_id,
        start_date: taskData.start_date?.toISOString().split('T')[0],
        due_date: taskData.due_date?.toISOString().split('T')[0],
        duration: taskData.duration,
        created_by: currentUserEmail
      });

      const transformedTask: Task = {
        id: newTask.id,
        title: newTask.title,
        description: newTask.description,
        priority: newTask.priority as 'low' | 'medium' | 'high' | 'urgent',
        assignee: newTask.assignee,
        status: newTask.status as 'todo' | 'inProgress' | 'review' | 'done',
        createdBy: newTask.created_by,
        createdAt: newTask.created_at,
        project_id: newTask.project_id,
        start_date: newTask.start_date ? new Date(newTask.start_date) : null,
        due_date: newTask.due_date ? new Date(newTask.due_date) : null,
        duration: newTask.duration
      };

      setTasks(prev => [...prev, transformedTask]);
      return transformedTask;
    } catch (error) {
      console.error('Error creating task:', error);
      throw error;
    }
  };

  const sendMessage = async (senderId: string, receiverId: string, content: string) => {
    try {
      const newMessage = await messagesService.send({
        sender_id: senderId,
        receiver_id: receiverId,
        content: content
      });

      const transformedMessage = {
        id: newMessage.id,
        senderId: newMessage.sender_id,
        receiverId: newMessage.receiver_id,
        content: newMessage.content,
        timestamp: newMessage.created_at,
        read: newMessage.read
      };

      setMessages(prev => [...prev, transformedMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  };

  const createEvent = async (eventData: Omit<CalendarEvent, 'id' | 'createdBy' | 'createdAt'>) => {
    try {
      const currentUserEmail = (window as any).currentUserEmail || 'hna@scandac.com';

      const newEvent = await calendarService.create({
        title: eventData.title,
        description: eventData.description,
        date: eventData.date,
        time: eventData.time,
        type: eventData.type,
        created_by: currentUserEmail
      });

      const transformedEvent = {
        id: newEvent.id,
        title: newEvent.title,
        date: newEvent.date,
        time: newEvent.time,
        description: newEvent.description,
        type: newEvent.type,
        createdBy: newEvent.created_by,
        createdAt: newEvent.created_at
      };

      setEvents(prev => [...prev, transformedEvent]);
    } catch (error) {
      console.error('Error creating event:', error);
      throw error;
    }
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
      loading,
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