import { supabase } from '@/integrations/supabase/client';

export interface TeamData {
  id: string;
  team_name: string;
  team_id: string;
  admin_email: string;
  subscription_plan: string;
  team_logo_url?: string;
  team_settings: any;
  created_at: string;
  updated_at: string;
}

export interface TeamMember {
  id: string;
  team_id: string;
  email: string;
  name?: string;
  full_name?: string;
  role: 'admin' | 'member';
  status: 'pending' | 'active' | 'inactive';
  invited_by: string;
  invited_at: string;
  joined_at?: string;
  competence_level: string;
  department?: string;
}

export interface TeamWithMember {
  team: TeamData;
  member: TeamMember;
}

export class TeamAuthService {
  // Create team during signup
  static async createTeamAndAdmin(signupData: {
    email: string;
    password: string;
    fullName: string;
    teamName: string;
  }): Promise<TeamWithMember> {
    try {
      // First create the user account
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: signupData.email,
        password: signupData.password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: {
            full_name: signupData.fullName
          }
        }
      });

      if (authError) throw authError;

      // Generate unique team ID
      const { data: teamIdData, error: teamIdError } = await supabase
        .rpc('generate_team_id');
      
      if (teamIdError) throw teamIdError;
      const uniqueTeamId = teamIdData;

      // Create team
      const { data: teamData, error: teamError } = await supabase
        .from('teams')
        .insert([{
          team_name: signupData.teamName,
          team_id: uniqueTeamId,
          admin_email: signupData.email,
          subscription_plan: 'starter'
        }])
        .select()
        .single();

      if (teamError) throw teamError;

      // Create admin as team member
      const { data: memberData, error: memberError } = await supabase
        .from('team_members')
        .insert([{
          team_id: teamData.id,
          email: signupData.email,
          name: signupData.fullName,
          full_name: signupData.fullName,
          role: 'admin',
          status: 'active',
          invited_by: signupData.email,
          joined_at: new Date().toISOString(),
          competence_level: 'advanced'
        }])
        .select()
        .single();

      if (memberError) throw memberError;

      // Create user profile
      await supabase
        .from('user_profiles')
        .insert([{
          email: signupData.email,
          full_name: signupData.fullName,
          team_id: teamData.id
        }]);

      return {
        team: teamData,
        member: memberData as TeamMember
      };
    } catch (error) {
      console.error('Team creation error:', error);
      throw error;
    }
  }

  // Get user's team information
  static async getUserTeam(userEmail: string): Promise<TeamWithMember | null> {
    try {
      const { data, error } = await supabase
        .from('team_members')
        .select(`
          *,
          teams (*)
        `)
        .eq('email', userEmail)
        .eq('status', 'active')
        .single();

      if (error) throw error;
      
      return {
        team: data.teams as TeamData,
        member: data as TeamMember
      };
    } catch (error) {
      console.error('Get user team error:', error);
      return null;
    }
  }

  // Get current user's team ID
  static async getCurrentTeamId(): Promise<string | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user?.email) return null;

      const teamData = await this.getUserTeam(user.email);
      return teamData?.team?.id || null;
    } catch (error) {
      console.error('Error getting current team ID:', error);
      return null;
    }
  }

  // Invite team member
  static async inviteTeamMember(
    email: string,
    teamId: string,
    invitedBy: string,
    role: 'admin' | 'member' = 'member'
  ): Promise<void> {
    try {
      // Generate invitation token
      const invitationToken = Math.random().toString(36).substr(2, 32);
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7); // 7 days expiry

      // Create invitation
      const { error: invitationError } = await supabase
        .from('team_invitations')
        .insert([{
          team_id: teamId,
          email: email,
          invited_by: invitedBy,
          invitation_token: invitationToken,
          expires_at: expiresAt.toISOString()
        }]);

      if (invitationError) throw invitationError;

      // Add to team members as pending with selected role
      const { error: memberError } = await supabase
        .from('team_members')
        .insert([{
          team_id: teamId,
          email: email,
          name: email, // Use email as name for now
          role: role,
          status: 'pending',
          invited_by: invitedBy,
          competence_level: 'beginner'
        }]);

      if (memberError) throw memberError;

      // Fetch team name for the email
      const { data: team, error: teamFetchError } = await supabase
        .from('teams')
        .select('team_name')
        .eq('id', teamId)
        .single();
      if (teamFetchError) console.warn('Could not fetch team name:', teamFetchError);

      // Compose accept URL to pass to edge function (absolute URL is required in emails)
      const acceptUrl = `${window.location.origin}/auth?invite_token=${encodeURIComponent(invitationToken)}&email=${encodeURIComponent(email)}`;

      // Send invitation email
      try {
        await supabase.functions.invoke('send-team-invite', {
          body: {
            email,
            teamName: team?.team_name || 'Your Team',
            inviterName: invitedBy,
            invitationToken,
            acceptUrl,
          }
        });
        console.log(`Invitation email sent to ${email}`);
      } catch (emailError) {
        console.error('Failed to send invitation email:', emailError);
        // Don't throw here - member is already added, email failure shouldn't rollback
      }
      
      console.log(`Invitation sent to ${email} with token ${invitationToken}`);
    } catch (error) {
      console.error('Error inviting team member:', error);
      throw error;
    }
  }

  // Accept team invitation
  static async acceptInvitation(invitationToken: string, userEmail: string): Promise<void> {
    try {
      // Find and validate invitation
      const { data: invitation, error: invitationError } = await supabase
        .from('team_invitations')
        .select('*')
        .eq('invitation_token', invitationToken)
        .eq('email', userEmail)
        .gt('expires_at', new Date().toISOString())
        .is('accepted_at', null)
        .single();

      if (invitationError) throw invitationError;
      if (!invitation) throw new Error('Invalid or expired invitation');

      // Update team member status
      const { error: memberError } = await supabase
        .from('team_members')
        .update({
          status: 'active',
          joined_at: new Date().toISOString()
        })
        .eq('team_id', invitation.team_id)
        .eq('email', userEmail);

      if (memberError) throw memberError;

      // Mark invitation as accepted
      const { error: acceptError } = await supabase
        .from('team_invitations')
        .update({
          accepted_at: new Date().toISOString()
        })
        .eq('id', invitation.id);

      if (acceptError) throw acceptError;
    } catch (error) {
      console.error('Error accepting invitation:', error);
      throw error;
    }
  }

  // Get team members (names synced with user_profiles)
  static async getTeamMembers(teamId: string): Promise<TeamMember[]> {
    try {
      // Fetch members
      const { data: members, error: membersError } = await supabase
        .from('team_members')
        .select('*')
        .eq('team_id', teamId)
        .order('joined_at', { ascending: false });

      if (membersError) throw membersError;

      const teamMembers = (members || []) as TeamMember[];
      if (teamMembers.length === 0) return [];

      // Fetch profiles for this team to sync names
      const { data: profiles, error: profilesError } = await supabase
        .from('user_profiles')
        .select('email, full_name')
        .eq('team_id', teamId);

      if (profilesError) {
        console.warn('Could not fetch user profiles for name sync:', profilesError);
        return teamMembers;
      }

      const nameByEmail = new Map<string, string>();
      (profiles || []).forEach((p: any) => {
        if (p.email && p.full_name) nameByEmail.set(p.email, p.full_name);
      });

      // Merge names from profiles, prefer profile full_name
      return teamMembers.map((m) => ({
        ...m,
        full_name: nameByEmail.get(m.email) || m.full_name || m.name,
        name: nameByEmail.get(m.email) || m.full_name || m.name,
      }));
    } catch (error) {
      console.error('Error getting team members:', error);
      return [];
    }
  }

  // Update team member role
  static async updateTeamMemberRole(memberId: string, role: 'admin' | 'member'): Promise<void> {
    try {
      const { error } = await supabase
        .from('team_members')
        .update({ role })
        .eq('id', memberId);

      if (error) throw error;
    } catch (error) {
      console.error('Error updating team member role:', error);
      throw error;
    }
  }

  // Remove team member
  static async removeTeamMember(memberId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('team_members')
        .delete()
        .eq('id', memberId);

      if (error) throw error;
    } catch (error) {
      console.error('Error removing team member:', error);
      throw error;
    }
  }
}