import React, { createContext, useContext, useState, useEffect } from 'react';
import { projectsService, tasksService, messagesService, calendarService } from '@/services/database';
import { TeamDataService } from '@/services/teamData';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export interface Project {
  id: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'planning' | 'in-progress' | 'review' | 'completed';
  start_date?: Date | null;
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

export interface ProjectNote {
  id: string;
  title: string;
  content: string;
  project_id: string;
  created_by: string;
  created_at: string;
  updated_at: string;
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
  location?: string;
  assigned_members?: string[];
  attendees?: string[];
}

interface SharedDataContextType {
  projects: Project[];
  setProjects: React.Dispatch<React.SetStateAction<Project[]>>;
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  notes: ProjectNote[];
  setNotes: React.Dispatch<React.SetStateAction<ProjectNote[]>>;
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  events: CalendarEvent[];
  setEvents: React.Dispatch<React.SetStateAction<CalendarEvent[]>>;
  calendarEvents: CalendarEvent[];
  loading: boolean;
  createProject: (projectData: Omit<Project, 'id' | 'created_at' | 'updated_at' | 'progress' | 'color' | 'team_size' | 'createdBy'>) => Promise<void>;
  createTask: (taskData: Omit<Task, 'id' | 'createdBy' | 'createdAt'>) => Promise<Task>;
  createNote: (noteData: Omit<ProjectNote, 'id' | 'created_by' | 'created_at' | 'updated_at'>) => Promise<ProjectNote>;
  updateNote: (noteId: string, updates: Partial<ProjectNote>) => Promise<void>;
  deleteNote: (noteId: string) => Promise<void>;
  sendMessage: (senderId: string, receiverId: string, content: string) => Promise<void>;
  createEvent: (eventData: Omit<CalendarEvent, 'id' | 'createdBy' | 'createdAt'>) => Promise<void>;
  createCalendarEvent: (eventData: Omit<CalendarEvent, 'id' | 'createdBy' | 'createdAt'>) => Promise<void>;
  updateCalendarEvent: (id: string, eventData: Partial<CalendarEvent>) => Promise<void>;
  deleteCalendarEvent: (id: string) => Promise<void>;
}

const SharedDataContext = createContext<SharedDataContextType | undefined>(undefined);

export const SharedDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [notes, setNotes] = useState<ProjectNote[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, loading: authLoading } = useAuth();

  // Load data from Supabase on mount and set up real-time subscriptions
  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      setLoading(false);
      return;
    }

    let tasksChannel: any;
    let notesChannel: any;
    let calendarEventsChannel: any;

    const loadData = async () => {
      try {
        setLoading(true);
        // Load all data from Supabase in parallel using team-based services
        const [projectsData, tasksData, notesData, messagesData, eventsData] = await Promise.all([
          TeamDataService.getTeamProjects(),
          TeamDataService.getTeamTasks(),
          TeamDataService.getTeamProjectNotes(),
          TeamDataService.getTeamMessages(),
          TeamDataService.getTeamCalendarEvents()
        ]);

        // Transform projects data
        const transformedProjects: Project[] = projectsData.map((p: any) => ({
          id: p.id,
          title: p.title,
          description: p.description,
          priority: p.priority as 'low' | 'medium' | 'high' | 'urgent',
          status: p.status as 'planning' | 'in-progress' | 'review' | 'completed',
          start_date: p.start_date ? new Date(p.start_date) : null,
          deadline: new Date(p.deadline),
          created_at: new Date(p.created_at),
          updated_at: new Date(p.updated_at),
          createdBy: p.created_by,
          progress: p.progress,
          color: p.color,
          team_size: p.team_size,
          assignedMembers: p.assigned_members || []
        }));

        // Transform tasks data
        const transformedTasks: Task[] = tasksData.map((t: any) => ({
          id: t.id,
          title: t.title,
          description: t.description || '',
          priority: t.priority as 'low' | 'medium' | 'high' | 'urgent',
          status: t.status === 'todo' ? 'todo' : 
                  t.status === 'in_progress' ? 'inProgress' : 
                  t.status === 'review' ? 'review' : 'done',
          assignee: t.assignee || '',
          project_id: t.project_id,
          start_date: t.start_date ? new Date(t.start_date) : null,
          due_date: t.due_date ? new Date(t.due_date) : null,
          duration: t.duration || 1,
          createdBy: t.created_by,
          createdAt: t.created_at
        }));

        // Transform notes data
        const transformedNotes: ProjectNote[] = notesData.map((n: any) => ({
          id: n.id,
          title: n.title,
          content: n.content,
          project_id: n.project_id,
          created_by: n.created_by,
          created_at: n.created_at,
          updated_at: n.updated_at
        }));

        // Transform messages data
        const transformedMessages = messagesData.map((m: any) => ({
          id: m.id,
          senderId: m.sender_id,
          receiverId: m.receiver_id,
          content: m.content,
          timestamp: m.created_at,
          read: m.read
        }));

        // Transform events data
        const transformedEvents = eventsData.map((e: any) => ({
          id: e.id,
          title: e.title,
          date: e.date,
          time: e.time || '',
          description: e.description || '',
          type: e.type,
          createdBy: e.created_by,
          createdAt: e.created_at,
          location: e.location || '',
          assigned_members: e.assigned_members || [],
          attendees: e.attendees || []
        }));

        setProjects(transformedProjects);
        setTasks(transformedTasks);
        setNotes(transformedNotes);
        setMessages(transformedMessages);
        setEvents(transformedEvents);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();

    // Set up real-time subscriptions scoped to current team
    const setupRealtime = async () => {
      const teamId = await TeamDataService.getCurrentTeamId();
      if (!teamId) return;

      tasksChannel = supabase
        .channel('tasks-changes')
        .on('postgres_changes', 
          { event: '*', schema: 'public', table: 'tasks', filter: `team_id=eq.${teamId}` },
          (payload) => {
            console.log('Task change received:', payload);
            if (payload.eventType === 'INSERT') {
              const newTask: Task = {
                id: payload.new.id,
                title: payload.new.title,
                description: payload.new.description || '',
                priority: payload.new.priority,
                status: payload.new.status === 'todo' ? 'todo' : 
                        payload.new.status === 'in_progress' ? 'inProgress' : 
                        payload.new.status === 'review' ? 'review' : 'done',
                assignee: payload.new.assignee || '',
                project_id: payload.new.project_id,
                start_date: payload.new.start_date ? new Date(payload.new.start_date) : null,
                due_date: payload.new.due_date ? new Date(payload.new.due_date) : null,
                duration: payload.new.duration || 1,
                createdBy: payload.new.created_by,
                createdAt: payload.new.created_at
              };
              setTasks(prev => [newTask, ...prev]);
            } else if (payload.eventType === 'UPDATE') {
              setTasks(prev => prev.map(task => 
                task.id === payload.new.id ? {
                  ...task,
                  title: payload.new.title,
                  description: payload.new.description || '',
                  priority: payload.new.priority,
                  status: payload.new.status === 'todo' ? 'todo' : 
                          payload.new.status === 'in_progress' ? 'inProgress' : 
                          payload.new.status === 'review' ? 'review' : 'done',
                  assignee: payload.new.assignee || '',
                } : task
              ));
            } else if (payload.eventType === 'DELETE') {
              setTasks(prev => prev.filter(task => task.id !== payload.old.id));
            }
          }
        )
        .subscribe();

      notesChannel = supabase
        .channel('notes-changes')
        .on('postgres_changes', 
          { event: '*', schema: 'public', table: 'project_notes', filter: `team_id=eq.${teamId}` },
          (payload) => {
            console.log('Note change received:', payload);
            if (payload.eventType === 'INSERT') {
              const newNote: ProjectNote = {
                id: payload.new.id,
                title: payload.new.title,
                content: payload.new.content,
                project_id: payload.new.project_id,
                created_by: payload.new.created_by,
                created_at: payload.new.created_at,
                updated_at: payload.new.updated_at
              };
              setNotes(prev => [newNote, ...prev]);
            } else if (payload.eventType === 'UPDATE') {
              setNotes(prev => prev.map(note => 
                note.id === payload.new.id ? {
                  ...note,
                  title: payload.new.title,
                  content: payload.new.content,
                  updated_at: payload.new.updated_at
                } : note
              ));
            } else if (payload.eventType === 'DELETE') {
              setNotes(prev => prev.filter(note => note.id !== payload.old.id));
            }
          }
        )
        .subscribe();

      calendarEventsChannel = supabase
        .channel('calendar-events-changes')
        .on('postgres_changes',
          { event: '*', schema: 'public', table: 'calendar_events', filter: `team_id=eq.${teamId}` },
          (payload) => {
            console.log('Calendar event change received:', payload);
            if (payload.eventType === 'INSERT') {
              const newEvent = {
                id: payload.new.id,
                title: payload.new.title,
                date: payload.new.date,
                time: payload.new.time || '',
                description: payload.new.description || '',
                type: payload.new.type,
                createdBy: payload.new.created_by,
                createdAt: payload.new.created_at,
                location: payload.new.location || '',
                assigned_members: payload.new.assigned_members || [],
                attendees: payload.new.attendees || []
              };
              setEvents(prev => [newEvent, ...prev]);
            } else if (payload.eventType === 'UPDATE') {
              setEvents(prev => prev.map(ev => ev.id === payload.new.id ? {
                ...ev,
                title: payload.new.title,
                date: payload.new.date,
                time: payload.new.time || '',
                description: payload.new.description || '',
                type: payload.new.type,
                location: payload.new.location || '',
                assigned_members: payload.new.assigned_members || [],
                attendees: payload.new.attendees || []
              } : ev));
            } else if (payload.eventType === 'DELETE') {
              setEvents(prev => prev.filter(ev => ev.id !== payload.old.id));
            }
          }
        )
        .subscribe();
    };

    setupRealtime();

    // Cleanup subscriptions
    return () => {
      if (tasksChannel) supabase.removeChannel(tasksChannel);
      if (notesChannel) supabase.removeChannel(notesChannel);
      if (calendarEventsChannel) supabase.removeChannel(calendarEventsChannel);
    };
  }, [user, authLoading]);

  const createProject = async (projectData: Omit<Project, 'id' | 'created_at' | 'updated_at' | 'progress' | 'color' | 'team_size' | 'createdBy'>) => {
    try {
      const colors = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6", "#EC4899"];
      const randomColor = colors[Math.floor(Math.random() * colors.length)];
      const currentUserEmail = (window as any).currentUserEmail || 'hna@scandac.com';

      const newProject = await TeamDataService.createProject({
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
        start_date: newProject.start_date ? new Date(newProject.start_date) : null,
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
      
      // Convert status to database format
      const dbStatus = taskData.status === 'inProgress' ? 'in_progress' : taskData.status;
      
      const data = await TeamDataService.createTask({
        title: taskData.title,
        description: taskData.description,
        priority: taskData.priority,
        status: dbStatus,
        project_id: taskData.project_id,
        assignee: taskData.assignee,
        due_date: taskData.due_date?.toISOString().split('T')[0] || null,
        start_date: taskData.start_date?.toISOString().split('T')[0] || null,
        duration: taskData.duration || 1,
        created_by: currentUserEmail
      });

      const newTask: Task = {
        id: data.id,
        title: data.title,
        description: data.description || '',
        priority: data.priority as 'low' | 'medium' | 'high' | 'urgent',
        status: data.status === 'in_progress' ? 'inProgress' : data.status as 'todo' | 'inProgress' | 'review' | 'done',
        assignee: data.assignee || '',
        project_id: data.project_id,
        start_date: data.start_date ? new Date(data.start_date) : null,
        due_date: data.due_date ? new Date(data.due_date) : null,
        duration: data.duration || 1,
        createdBy: data.created_by,
        createdAt: data.created_at
      };

      console.log('Task created successfully:', newTask);
      return newTask;
    } catch (error) {
      console.error('Error creating task:', error);
      throw error;
    }
  };

  const createNote = async (noteData: Omit<ProjectNote, 'id' | 'created_by' | 'created_at' | 'updated_at'>) => {
    try {
      const currentUserEmail = (window as any).currentUserEmail || 'hna@scandac.com';
      
      const data = await TeamDataService.createProjectNote({
        title: noteData.title,
        content: noteData.content,
        project_id: noteData.project_id,
        created_by: currentUserEmail
      });

      const newNote: ProjectNote = {
        id: data.id,
        title: data.title,
        content: data.content,
        project_id: data.project_id,
        created_by: data.created_by,
        created_at: data.created_at,
        updated_at: data.updated_at
      };

      setNotes(prev => [newNote, ...prev]);
      console.log('Note created successfully:', newNote);
      return newNote;
    } catch (error) {
      console.error('Error creating note:', error);
      throw error;
    }
  };

  const updateNote = async (noteId: string, updates: Partial<ProjectNote>) => {
    try {
      const { error } = await supabase
        .from('project_notes')
        .update({
          title: updates.title,
          content: updates.content,
          updated_at: new Date().toISOString()
        })
        .eq('id', noteId);

      if (error) {
        console.error('Error updating note:', error);
        throw error;
      }
    } catch (error) {
      console.error('Error updating note:', error);
      throw error;
    }
  };

  const deleteNote = async (noteId: string) => {
    try {
      const { error } = await supabase
        .from('project_notes')
        .delete()
        .eq('id', noteId);

      if (error) {
        console.error('Error deleting note:', error);
        throw error;
      }
    } catch (error) {
      console.error('Error deleting note:', error);
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

      const newEvent = await TeamDataService.createCalendarEvent({
        title: eventData.title,
        description: eventData.description,
        date: eventData.date,
        time: eventData.time,
        type: eventData.type,
        location: eventData.location,
        assigned_members: eventData.assigned_members,
        attendees: eventData.attendees,
        created_by: currentUserEmail
      });

      const transformedEvent = {
        id: newEvent.id,
        title: newEvent.title,
        date: newEvent.date,
        time: newEvent.time || '',
        description: newEvent.description || '',
        type: newEvent.type,
        createdBy: newEvent.created_by,
        createdAt: newEvent.created_at,
        location: newEvent.location || '',
        assigned_members: newEvent.assigned_members || [],
        attendees: newEvent.attendees || []
      };

      setEvents(prev => [...prev, transformedEvent]);
    } catch (error) {
      console.error('Error creating event:', error);
      throw error;
    }
  };

  const createCalendarEvent = createEvent;
  
  const updateCalendarEvent = async (id: string, eventData: Partial<CalendarEvent>) => {
    try {
      await calendarService.update(id, eventData);
      setEvents(prev => prev.map(event => 
        event.id === id ? { ...event, ...eventData } : event
      ));
    } catch (error) {
      console.error('Error updating calendar event:', error);
      throw error;
    }
  };

  const deleteCalendarEvent = async (id: string) => {
    try {
      await calendarService.delete(id);
      setEvents(prev => prev.filter(event => event.id !== id));
    } catch (error) {
      console.error('Error deleting calendar event:', error);
      throw error;
    }
  };

  return (
    <SharedDataContext.Provider value={{
      projects,
      setProjects,
      tasks,
      setTasks,
      notes,
      setNotes,
      messages,
      setMessages,
      events,
      setEvents,
      calendarEvents: events,
      loading,
      createProject,
      createTask,
      createNote,
      updateNote,
      deleteNote,
      sendMessage,
      createEvent,
      createCalendarEvent,
      updateCalendarEvent,
      deleteCalendarEvent,
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