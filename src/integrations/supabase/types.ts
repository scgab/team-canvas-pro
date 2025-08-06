export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      ai_tool_categories: {
        Row: {
          created_at: string
          created_by: string
          id: string
          name: string
          team_id: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by: string
          id?: string
          name: string
          team_id?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string
          id?: string
          name?: string
          team_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "ai_tool_categories_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_tools: {
        Row: {
          added_by: string
          category: string
          created_at: string | null
          id: string
          is_favorite: boolean | null
          link: string
          name: string
          note: string | null
          rating: number | null
          tags: string[] | null
          team_id: string | null
        }
        Insert: {
          added_by: string
          category: string
          created_at?: string | null
          id?: string
          is_favorite?: boolean | null
          link: string
          name: string
          note?: string | null
          rating?: number | null
          tags?: string[] | null
          team_id?: string | null
        }
        Update: {
          added_by?: string
          category?: string
          created_at?: string | null
          id?: string
          is_favorite?: boolean | null
          link?: string
          name?: string
          note?: string | null
          rating?: number | null
          tags?: string[] | null
          team_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ai_tools_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      availability: {
        Row: {
          created_at: string | null
          date: string
          id: string
          is_available: boolean | null
          notes: string | null
          preferred_end_time: string | null
          preferred_start_time: string | null
          team_id: string | null
          team_member_email: string
        }
        Insert: {
          created_at?: string | null
          date: string
          id?: string
          is_available?: boolean | null
          notes?: string | null
          preferred_end_time?: string | null
          preferred_start_time?: string | null
          team_id?: string | null
          team_member_email: string
        }
        Update: {
          created_at?: string | null
          date?: string
          id?: string
          is_available?: boolean | null
          notes?: string | null
          preferred_end_time?: string | null
          preferred_start_time?: string | null
          team_id?: string | null
          team_member_email?: string
        }
        Relationships: [
          {
            foreignKeyName: "availability_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      available_shifts: {
        Row: {
          claimed_by: string | null
          competence_required: string | null
          created_at: string | null
          created_by: string
          date: string
          description: string | null
          end_time: string
          id: string
          shift_type: string | null
          start_time: string
          team_id: string | null
        }
        Insert: {
          claimed_by?: string | null
          competence_required?: string | null
          created_at?: string | null
          created_by: string
          date: string
          description?: string | null
          end_time: string
          id?: string
          shift_type?: string | null
          start_time: string
          team_id?: string | null
        }
        Update: {
          claimed_by?: string | null
          competence_required?: string | null
          created_at?: string | null
          created_by?: string
          date?: string
          description?: string | null
          end_time?: string
          id?: string
          shift_type?: string | null
          start_time?: string
          team_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "available_shifts_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      calendar_events: {
        Row: {
          action_items: string[] | null
          agenda: string[] | null
          agreements: string[] | null
          assigned_members: string[] | null
          attendees: string[] | null
          brainstorm_items: string[] | null
          created_at: string | null
          created_by: string
          date: string
          description: string | null
          end_time: string | null
          id: string
          location: string | null
          meeting_notes: string | null
          meeting_status: string | null
          meeting_summary: string | null
          team_id: string
          time: string | null
          title: string
          type: string | null
          updated_at: string | null
        }
        Insert: {
          action_items?: string[] | null
          agenda?: string[] | null
          agreements?: string[] | null
          assigned_members?: string[] | null
          attendees?: string[] | null
          brainstorm_items?: string[] | null
          created_at?: string | null
          created_by: string
          date: string
          description?: string | null
          end_time?: string | null
          id?: string
          location?: string | null
          meeting_notes?: string | null
          meeting_status?: string | null
          meeting_summary?: string | null
          team_id: string
          time?: string | null
          title: string
          type?: string | null
          updated_at?: string | null
        }
        Update: {
          action_items?: string[] | null
          agenda?: string[] | null
          agreements?: string[] | null
          assigned_members?: string[] | null
          attendees?: string[] | null
          brainstorm_items?: string[] | null
          created_at?: string | null
          created_by?: string
          date?: string
          description?: string | null
          end_time?: string | null
          id?: string
          location?: string | null
          meeting_notes?: string | null
          meeting_status?: string | null
          meeting_summary?: string | null
          team_id?: string
          time?: string | null
          title?: string
          type?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "calendar_events_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          content: string
          created_at: string | null
          id: string
          read: boolean | null
          receiver_id: string
          sender_id: string
          team_id: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          read?: boolean | null
          receiver_id: string
          sender_id: string
          team_id?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          read?: boolean | null
          receiver_id?: string
          sender_id?: string
          team_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "messages_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      project_notes: {
        Row: {
          content: string
          created_at: string | null
          created_by: string
          id: string
          project_id: string
          team_id: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          created_by: string
          id?: string
          project_id: string
          team_id?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          created_by?: string
          id?: string
          project_id?: string
          team_id?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "project_notes_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          assigned_members: string[] | null
          color: string | null
          created_at: string | null
          created_by: string
          deadline: string | null
          description: string | null
          id: string
          priority: string | null
          progress: number | null
          shared_with: string[] | null
          start_date: string | null
          status: string | null
          team_id: string | null
          team_size: number | null
          title: string
          updated_at: string | null
        }
        Insert: {
          assigned_members?: string[] | null
          color?: string | null
          created_at?: string | null
          created_by: string
          deadline?: string | null
          description?: string | null
          id?: string
          priority?: string | null
          progress?: number | null
          shared_with?: string[] | null
          start_date?: string | null
          status?: string | null
          team_id?: string | null
          team_size?: number | null
          title: string
          updated_at?: string | null
        }
        Update: {
          assigned_members?: string[] | null
          color?: string | null
          created_at?: string | null
          created_by?: string
          deadline?: string | null
          description?: string | null
          id?: string
          priority?: string | null
          progress?: number | null
          shared_with?: string[] | null
          start_date?: string | null
          status?: string | null
          team_id?: string | null
          team_size?: number | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "projects_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      shifts: {
        Row: {
          assigned_to: string | null
          created_at: string | null
          created_by: string
          date: string
          end_time: string
          id: string
          notes: string | null
          shift_type: string | null
          start_time: string
          status: string | null
          team_id: string | null
          updated_at: string | null
        }
        Insert: {
          assigned_to?: string | null
          created_at?: string | null
          created_by: string
          date: string
          end_time: string
          id?: string
          notes?: string | null
          shift_type?: string | null
          start_time: string
          status?: string | null
          team_id?: string | null
          updated_at?: string | null
        }
        Update: {
          assigned_to?: string | null
          created_at?: string | null
          created_by?: string
          date?: string
          end_time?: string
          id?: string
          notes?: string | null
          shift_type?: string | null
          start_time?: string
          status?: string | null
          team_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "shifts_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      subscribers: {
        Row: {
          created_at: string
          email: string
          id: string
          stripe_customer_id: string | null
          subscribed: boolean
          subscription_end: string | null
          subscription_tier: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          stripe_customer_id?: string | null
          subscribed?: boolean
          subscription_end?: string | null
          subscription_tier?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          stripe_customer_id?: string | null
          subscribed?: boolean
          subscription_end?: string | null
          subscription_tier?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      tasks: {
        Row: {
          assignee: string | null
          created_at: string | null
          created_by: string
          description: string | null
          due_date: string | null
          duration: number | null
          id: string
          priority: string | null
          project_id: string | null
          start_date: string | null
          status: string | null
          team_id: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          assignee?: string | null
          created_at?: string | null
          created_by: string
          description?: string | null
          due_date?: string | null
          duration?: number | null
          id?: string
          priority?: string | null
          project_id?: string | null
          start_date?: string | null
          status?: string | null
          team_id?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          assignee?: string | null
          created_at?: string | null
          created_by?: string
          description?: string | null
          due_date?: string | null
          duration?: number | null
          id?: string
          priority?: string | null
          project_id?: string | null
          start_date?: string | null
          status?: string | null
          team_id?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tasks_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      team_invitations: {
        Row: {
          accepted_at: string | null
          created_at: string | null
          email: string
          expires_at: string
          id: string
          invitation_token: string
          invited_by: string
          team_id: string | null
        }
        Insert: {
          accepted_at?: string | null
          created_at?: string | null
          email: string
          expires_at: string
          id?: string
          invitation_token: string
          invited_by: string
          team_id?: string | null
        }
        Update: {
          accepted_at?: string | null
          created_at?: string | null
          email?: string
          expires_at?: string
          id?: string
          invitation_token?: string
          invited_by?: string
          team_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "team_invitations_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      team_members: {
        Row: {
          competence_level: string | null
          created_at: string | null
          email: string
          full_name: string | null
          hourly_rate: number | null
          id: string
          invited_at: string | null
          invited_by: string | null
          joined_at: string | null
          name: string
          role: string | null
          status: string | null
          team_id: string | null
        }
        Insert: {
          competence_level?: string | null
          created_at?: string | null
          email: string
          full_name?: string | null
          hourly_rate?: number | null
          id?: string
          invited_at?: string | null
          invited_by?: string | null
          joined_at?: string | null
          name: string
          role?: string | null
          status?: string | null
          team_id?: string | null
        }
        Update: {
          competence_level?: string | null
          created_at?: string | null
          email?: string
          full_name?: string | null
          hourly_rate?: number | null
          id?: string
          invited_at?: string | null
          invited_by?: string | null
          joined_at?: string | null
          name?: string
          role?: string | null
          status?: string | null
          team_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "team_members_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      teams: {
        Row: {
          admin_email: string
          created_at: string | null
          id: string
          subscription_plan: string | null
          team_id: string
          team_logo_url: string | null
          team_name: string
          team_settings: Json | null
          updated_at: string | null
        }
        Insert: {
          admin_email: string
          created_at?: string | null
          id?: string
          subscription_plan?: string | null
          team_id: string
          team_logo_url?: string | null
          team_name: string
          team_settings?: Json | null
          updated_at?: string | null
        }
        Update: {
          admin_email?: string
          created_at?: string | null
          id?: string
          subscription_plan?: string | null
          team_id?: string
          team_logo_url?: string | null
          team_name?: string
          team_settings?: Json | null
          updated_at?: string | null
        }
        Relationships: []
      }
      user_profiles: {
        Row: {
          address_line_1: string | null
          address_line_2: string | null
          age: number | null
          bank_account_number: string | null
          bank_name: string | null
          city: string | null
          competence_level: string | null
          country: string | null
          cpr_number: string | null
          created_at: string | null
          date_of_birth: string | null
          department: string | null
          email: string
          emergency_contact_name: string | null
          emergency_contact_phone: string | null
          employee_id: string | null
          first_name: string | null
          full_name: string
          hire_date: string | null
          id: string
          job_title: string | null
          last_name: string | null
          phone_number: string | null
          postal_code: string | null
          profile_picture_url: string | null
          tax_id: string | null
          team_id: string | null
          updated_at: string | null
        }
        Insert: {
          address_line_1?: string | null
          address_line_2?: string | null
          age?: number | null
          bank_account_number?: string | null
          bank_name?: string | null
          city?: string | null
          competence_level?: string | null
          country?: string | null
          cpr_number?: string | null
          created_at?: string | null
          date_of_birth?: string | null
          department?: string | null
          email: string
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          employee_id?: string | null
          first_name?: string | null
          full_name: string
          hire_date?: string | null
          id?: string
          job_title?: string | null
          last_name?: string | null
          phone_number?: string | null
          postal_code?: string | null
          profile_picture_url?: string | null
          tax_id?: string | null
          team_id?: string | null
          updated_at?: string | null
        }
        Update: {
          address_line_1?: string | null
          address_line_2?: string | null
          age?: number | null
          bank_account_number?: string | null
          bank_name?: string | null
          city?: string | null
          competence_level?: string | null
          country?: string | null
          cpr_number?: string | null
          created_at?: string | null
          date_of_birth?: string | null
          department?: string | null
          email?: string
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          employee_id?: string | null
          first_name?: string | null
          full_name?: string
          hire_date?: string | null
          id?: string
          job_title?: string | null
          last_name?: string | null
          phone_number?: string | null
          postal_code?: string | null
          profile_picture_url?: string | null
          tax_id?: string | null
          team_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_profiles_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      generate_team_id: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      user_is_team_admin: {
        Args: { check_team_id: string }
        Returns: boolean
      }
      user_is_team_member: {
        Args: { check_team_id: string }
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
