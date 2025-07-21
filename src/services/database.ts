import { supabase } from '@/integrations/supabase/client';

// Projects service
export const projectsService = {
  // Get all projects
  async getAll() {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching projects:', error);
      return [];
    }
    return data || [];
  },

  // Create new project
  async create(projectData: any) {
    const { data, error } = await supabase
      .from('projects')
      .insert([{
        title: projectData.title,
        description: projectData.description,
        priority: projectData.priority || 'medium',
        deadline: projectData.deadline,
        status: projectData.status || 'active',
        created_by: projectData.createdBy || projectData.created_by,
        assigned_members: projectData.assignedMembers || projectData.assigned_members || [],
        progress: projectData.progress || 0,
        color: projectData.color || '#3B82F6',
        team_size: projectData.team_size || 1,
        shared_with: projectData.shared_with || []
      }])
      .select()
      .single();

    if (error) {
      console.error('Error creating project:', error);
      throw error;
    }
    return data;
  },

  // Update project
  async update(id: string, updates: any) {
    const { data, error } = await supabase
      .from('projects')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating project:', error);
      throw error;
    }
    return data;
  },

  // Delete project
  async delete(id: string) {
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting project:', error);
      throw error;
    }
  }
};

// Tasks service
export const tasksService = {
  // Get all tasks
  async getAll() {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching tasks:', error);
      return [];
    }
    return data || [];
  },

  // Create new task
  async create(taskData: any) {
    const { data, error } = await supabase
      .from('tasks')
      .insert([{
        title: taskData.title,
        description: taskData.description,
        priority: taskData.priority || 'medium',
        status: taskData.status || 'todo',
        assignee: taskData.assignee,
        project_id: taskData.projectId || taskData.project_id,
        start_date: taskData.start_date,
        due_date: taskData.due_date,
        duration: taskData.duration || 1,
        created_by: taskData.createdBy || taskData.created_by
      }])
      .select()
      .single();

    if (error) {
      console.error('Error creating task:', error);
      throw error;
    }
    return data;
  },

  // Update task
  async update(id: string, updates: any) {
    const { data, error } = await supabase
      .from('tasks')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating task:', error);
      throw error;
    }
    return data;
  },

  // Delete task
  async delete(id: string) {
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting task:', error);
      throw error;
    }
  }
};

// Messages service
export const messagesService = {
  // Get all messages
  async getAll() {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .order('created_at', { ascending: true });
    
    if (error) {
      console.error('Error fetching messages:', error);
      return [];
    }
    return data || [];
  },

  // Send message
  async send(messageData: any) {
    const { data, error } = await supabase
      .from('messages')
      .insert([{
        sender_id: messageData.senderId || messageData.sender_id,
        receiver_id: messageData.receiverId || messageData.receiver_id,
        content: messageData.content
      }])
      .select()
      .single();

    if (error) {
      console.error('Error sending message:', error);
      throw error;
    }
    return data;
  },

  // Mark message as read
  async markAsRead(id: string) {
    const { error } = await supabase
      .from('messages')
      .update({ read: true })
      .eq('id', id);

    if (error) {
      console.error('Error marking message as read:', error);
      throw error;
    }
  }
};

// AI Tools service
export const aiToolsService = {
  // Get all AI tools
  async getAll() {
    const { data, error } = await supabase
      .from('ai_tools')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching AI tools:', error);
      return [];
    }
    return data || [];
  },

  // Create new AI tool
  async create(toolData: any) {
    const { data, error } = await supabase
      .from('ai_tools')
      .insert([{
        name: toolData.name,
        link: toolData.link,
        note: toolData.note || '',
        category: toolData.category,
        tags: toolData.tags || [],
        rating: toolData.rating || 0,
        is_favorite: toolData.is_favorite || toolData.isFavorite || false,
        added_by: toolData.addedBy || toolData.added_by
      }])
      .select()
      .single();

    if (error) {
      console.error('Error creating AI tool:', error);
      throw error;
    }
    return data;
  },

  // Update AI tool
  async update(id: string, updates: any) {
    const { data, error } = await supabase
      .from('ai_tools')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating AI tool:', error);
      throw error;
    }
    return data;
  },

  // Delete AI tool
  async delete(id: string) {
    const { error } = await supabase
      .from('ai_tools')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting AI tool:', error);
      throw error;
    }
  }
};

// Calendar events service
export const calendarService = {
  // Get all events
  async getAll() {
    const { data, error } = await supabase
      .from('calendar_events')
      .select('*')
      .order('date', { ascending: true });
    
    if (error) {
      console.error('Error fetching calendar events:', error);
      return [];
    }
    return data || [];
  },

  // Create new event
  async create(eventData: any) {
    const { data, error } = await supabase
      .from('calendar_events')
      .insert([{
        title: eventData.title,
        description: eventData.description || '',
        date: eventData.date,
        time: eventData.time,
        type: eventData.type || 'event',
        attendees: eventData.attendees || [],
        created_by: eventData.createdBy || eventData.created_by
      }])
      .select()
      .single();

    if (error) {
      console.error('Error creating calendar event:', error);
      throw error;
    }
    return data;
  },

  // Update event
  async update(id: string, updates: any) {
    const { data, error } = await supabase
      .from('calendar_events')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating calendar event:', error);
      throw error;
    }
    return data;
  },

  // Delete event
  async delete(id: string) {
    const { error } = await supabase
      .from('calendar_events')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting calendar event:', error);
      throw error;
    }
  }
};

// AI Tool Categories service
export const aiToolCategoriesService = {
  // Get all categories
  async getAll() {
    const { data, error } = await supabase
      .from('ai_tool_categories')
      .select('*')
      .order('name', { ascending: true });
    
    if (error) {
      console.error('Error fetching AI tool categories:', error);
      return [];
    }
    return data || [];
  },

  // Create new category
  async create(categoryData: any) {
    const { data, error } = await supabase
      .from('ai_tool_categories')
      .insert([{
        name: categoryData.name,
        created_by: categoryData.created_by
      }])
      .select()
      .single();

    if (error) {
      console.error('Error creating AI tool category:', error);
      throw error;
    }
    return data;
  },

  // Update category
  async update(id: string, updates: any) {
    const { data, error } = await supabase
      .from('ai_tool_categories')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating AI tool category:', error);
      throw error;
    }
    return data;
  },

  // Delete category
  async delete(id: string) {
    const { error } = await supabase
      .from('ai_tool_categories')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting AI tool category:', error);
      throw error;
    }
  }
};