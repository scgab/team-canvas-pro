import { supabase } from '@/integrations/supabase/client';
import { TeamAuthService } from './teamAuth';

export class TeamDataService {
  // Get current user's team ID
  static async getCurrentTeamId(): Promise<string | null> {
    return await TeamAuthService.getCurrentTeamId();
  }

  // Projects - team scoped
  static async getTeamProjects() {
    const teamId = await this.getCurrentTeamId();
    if (!teamId) return [];

    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('team_id', teamId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching team projects:', error);
      return [];
    }
    return data || [];
  }

  static async createProject(projectData: any) {
    const teamId = await this.getCurrentTeamId();
    if (!teamId) throw new Error('No team found');

    const { data, error } = await supabase
      .from('projects')
      .insert([{
        ...projectData,
        team_id: teamId
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async updateProject(projectId: string, updates: any) {
    const teamId = await this.getCurrentTeamId();
    if (!teamId) throw new Error('No team found');

    const { data, error } = await supabase
      .from('projects')
      .update(updates)
      .eq('id', projectId)
      .eq('team_id', teamId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async deleteProject(projectId: string) {
    const teamId = await this.getCurrentTeamId();
    if (!teamId) throw new Error('No team found');

    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', projectId)
      .eq('team_id', teamId);

    if (error) throw error;
  }

  // Tasks - team scoped
  static async getTeamTasks() {
    const teamId = await this.getCurrentTeamId();
    if (!teamId) return [];

    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('team_id', teamId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching team tasks:', error);
      return [];
    }
    return data || [];
  }

  static async createTask(taskData: any) {
    const teamId = await this.getCurrentTeamId();
    if (!teamId) throw new Error('No team found');

    const { data, error } = await supabase
      .from('tasks')
      .insert([{
        ...taskData,
        team_id: teamId
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async updateTask(taskId: string, updates: any) {
    const teamId = await this.getCurrentTeamId();
    if (!teamId) throw new Error('No team found');

    const { data, error } = await supabase
      .from('tasks')
      .update(updates)
      .eq('id', taskId)
      .eq('team_id', teamId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async deleteTask(taskId: string) {
    const teamId = await this.getCurrentTeamId();
    if (!teamId) throw new Error('No team found');

    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', taskId)
      .eq('team_id', teamId);

    if (error) throw error;
  }

  // Calendar Events - team scoped
  static async getTeamCalendarEvents() {
    const teamId = await this.getCurrentTeamId();
    if (!teamId) return [];

    const { data, error } = await supabase
      .from('calendar_events')
      .select('*')
      .eq('team_id', teamId)
      .order('date', { ascending: true });

    if (error) {
      console.error('Error fetching team calendar events:', error);
      return [];
    }
    return data || [];
  }

  static async createCalendarEvent(eventData: any) {
    const teamId = await this.getCurrentTeamId();
    if (!teamId) throw new Error('No team found');

    const { data, error } = await supabase
      .from('calendar_events')
      .insert([{
        ...eventData,
        team_id: teamId
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Messages - team scoped
  static async getTeamMessages() {
    const teamId = await this.getCurrentTeamId();
    if (!teamId) return [];

    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('team_id', teamId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching team messages:', error);
      return [];
    }
    return data || [];
  }

  static async createMessage(messageData: any) {
    const teamId = await this.getCurrentTeamId();
    if (!teamId) throw new Error('No team found');

    const { data, error } = await supabase
      .from('messages')
      .insert([{
        ...messageData,
        team_id: teamId
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Shifts - team scoped
  static async getTeamShifts() {
    const teamId = await this.getCurrentTeamId();
    if (!teamId) return [];

    const { data, error } = await supabase
      .from('shifts')
      .select('*')
      .eq('team_id', teamId)
      .order('date', { ascending: true });

    if (error) {
      console.error('Error fetching team shifts:', error);
      return [];
    }
    return data || [];
  }

  static async createShift(shiftData: any) {
    const teamId = await this.getCurrentTeamId();
    if (!teamId) throw new Error('No team found');

    const { data, error } = await supabase
      .from('shifts')
      .insert([{
        ...shiftData,
        team_id: teamId
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // User Profiles - team scoped
  static async getTeamUserProfiles() {
    const teamId = await this.getCurrentTeamId();
    if (!teamId) return [];

    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('team_id', teamId);

    if (error) {
      console.error('Error fetching team user profiles:', error);
      return [];
    }
    return data || [];
  }

  // AI Tools - team scoped
  static async getTeamAITools() {
    const teamId = await this.getCurrentTeamId();
    if (!teamId) return [];

    const { data, error } = await supabase
      .from('ai_tools')
      .select('*')
      .eq('team_id', teamId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching team AI tools:', error);
      return [];
    }
    return data || [];
  }

  static async createAITool(toolData: any) {
    const teamId = await this.getCurrentTeamId();
    if (!teamId) throw new Error('No team found');

    const { data, error } = await supabase
      .from('ai_tools')
      .insert([{
        ...toolData,
        team_id: teamId
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // AI Tool Categories - team scoped
  static async getTeamAIToolCategories() {
    const teamId = await this.getCurrentTeamId();
    if (!teamId) return [];

    const { data, error } = await supabase
      .from('ai_tool_categories')
      .select('*')
      .eq('team_id', teamId)
      .order('name', { ascending: true });

    if (error) {
      console.error('Error fetching team AI tool categories:', error);
      return [];
    }
    return data || [];
  }

  static async createAIToolCategory(categoryData: any) {
    const teamId = await this.getCurrentTeamId();
    if (!teamId) throw new Error('No team found');

    const { data, error } = await supabase
      .from('ai_tool_categories')
      .insert([{
        ...categoryData,
        team_id: teamId
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Project Notes - team scoped
  static async getTeamProjectNotes(projectId?: string) {
    const teamId = await this.getCurrentTeamId();
    if (!teamId) return [];

    let query = supabase
      .from('project_notes')
      .select('*')
      .eq('team_id', teamId);

    if (projectId) {
      query = query.eq('project_id', projectId);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching team project notes:', error);
      return [];
    }
    return data || [];
  }

  static async createProjectNote(noteData: any) {
    const teamId = await this.getCurrentTeamId();
    if (!teamId) throw new Error('No team found');

    const { data, error } = await supabase
      .from('project_notes')
      .insert([{
        ...noteData,
        team_id: teamId
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Availability - team scoped
  static async getTeamAvailability() {
    const teamId = await this.getCurrentTeamId();
    if (!teamId) return [];

    const { data, error } = await supabase
      .from('availability')
      .select('*')
      .eq('team_id', teamId)
      .order('date', { ascending: true });

    if (error) {
      console.error('Error fetching team availability:', error);
      return [];
    }
    return data || [];
  }

  static async createAvailability(availabilityData: any) {
    const teamId = await this.getCurrentTeamId();
    if (!teamId) throw new Error('No team found');

    const { data, error } = await supabase
      .from('availability')
      .insert([{
        ...availabilityData,
        team_id: teamId
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  }
}