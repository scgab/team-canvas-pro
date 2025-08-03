import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { TeamAuthService, TeamMember } from '@/services/teamAuth';

export const useTeamMember = () => {
  const { user } = useAuth();
  const [teamMember, setTeamMember] = useState<TeamMember | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeamMember = async () => {
      if (!user?.email) {
        setTeamMember(null);
        setLoading(false);
        return;
      }

      try {
        const teamData = await TeamAuthService.getUserTeam(user.email);
        setTeamMember(teamData?.member || null);
      } catch (error) {
        console.error('Error fetching team member:', error);
        setTeamMember(null);
      } finally {
        setLoading(false);
      }
    };

    fetchTeamMember();
  }, [user?.email]);

  const isAdmin = teamMember?.role === 'admin';

  return {
    teamMember,
    isAdmin,
    loading
  };
};