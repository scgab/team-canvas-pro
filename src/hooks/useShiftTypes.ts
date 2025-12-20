import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { TeamAuthService } from '@/services/teamAuth';

// Default shift types that are always available
const DEFAULT_SHIFT_TYPES = [
  { value: 'regular', label: 'Regular' },
  { value: 'morning', label: 'Morning' },
  { value: 'evening', label: 'Evening' },
  { value: 'night', label: 'Night' },
  { value: 'overtime', label: 'Overtime' },
];

export interface ShiftType {
  value: string;
  label: string;
  isCustom?: boolean;
}

export const useShiftTypes = () => {
  const { user } = useAuth();
  const [shiftTypes, setShiftTypes] = useState<ShiftType[]>(DEFAULT_SHIFT_TYPES);
  const [customShiftTypes, setCustomShiftTypes] = useState<ShiftType[]>([]);
  const [teamId, setTeamId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Fetch team and custom shift types
  useEffect(() => {
    const fetchTeamData = async () => {
      if (!user?.email) return;

      try {
        const teamData = await TeamAuthService.getUserTeam(user.email);
        if (teamData?.team?.id) {
          setTeamId(teamData.team.id);

          // Fetch team settings for custom shift types
          const { data: team, error } = await supabase
            .from('teams')
            .select('team_settings')
            .eq('id', teamData.team.id)
            .single();

          if (!error && team?.team_settings) {
            const settings = team.team_settings as { customShiftTypes?: ShiftType[] };
            if (settings.customShiftTypes && Array.isArray(settings.customShiftTypes)) {
              const custom = settings.customShiftTypes.map(t => ({ ...t, isCustom: true }));
              setCustomShiftTypes(custom);
              setShiftTypes([...DEFAULT_SHIFT_TYPES, ...custom]);
            }
          }
        }
      } catch (error) {
        console.error('Error fetching shift types:', error);
      }
    };

    fetchTeamData();
  }, [user?.email]);

  // Add a new custom shift type
  const addShiftType = useCallback(async (label: string): Promise<boolean> => {
    if (!teamId || !label.trim()) return false;

    const value = label.toLowerCase().replace(/\s+/g, '_');
    
    // Check if already exists
    if (shiftTypes.some(t => t.value === value)) {
      return false;
    }

    setLoading(true);
    try {
      // Get current settings
      const { data: team, error: fetchError } = await supabase
        .from('teams')
        .select('team_settings')
        .eq('id', teamId)
        .single();

      if (fetchError) throw fetchError;

      const currentSettings = (team?.team_settings || {}) as Record<string, unknown>;
      const currentCustomTypes = (currentSettings.customShiftTypes || []) as ShiftType[];
      
      const newType = { value, label: label.trim(), isCustom: true };
      const updatedCustomTypes = [...currentCustomTypes, newType];

      // Update team settings - cast to any to satisfy Json type
      const updatedSettings = {
        ...currentSettings,
        customShiftTypes: updatedCustomTypes
      };

      const { error: updateError } = await supabase
        .from('teams')
        .update({
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          team_settings: updatedSettings as any
        })
        .eq('id', teamId);

      if (updateError) throw updateError;

      setCustomShiftTypes(updatedCustomTypes);
      setShiftTypes([...DEFAULT_SHIFT_TYPES, ...updatedCustomTypes]);
      return true;
    } catch (error) {
      console.error('Error adding shift type:', error);
      return false;
    } finally {
      setLoading(false);
    }
  }, [teamId, shiftTypes]);

  // Remove a custom shift type
  const removeShiftType = useCallback(async (value: string): Promise<boolean> => {
    if (!teamId) return false;

    // Can't remove default types
    if (DEFAULT_SHIFT_TYPES.some(t => t.value === value)) {
      return false;
    }

    setLoading(true);
    try {
      // Get current settings
      const { data: team, error: fetchError } = await supabase
        .from('teams')
        .select('team_settings')
        .eq('id', teamId)
        .single();

      if (fetchError) throw fetchError;

      const currentSettings = (team?.team_settings || {}) as Record<string, unknown>;
      const currentCustomTypes = (currentSettings.customShiftTypes || []) as ShiftType[];
      
      const updatedCustomTypes = currentCustomTypes.filter(t => t.value !== value);

      // Update team settings - cast to any to satisfy Json type
      const updatedSettings = {
        ...currentSettings,
        customShiftTypes: updatedCustomTypes
      };

      const { error: updateError } = await supabase
        .from('teams')
        .update({
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          team_settings: updatedSettings as any
        })
        .eq('id', teamId);

      if (updateError) throw updateError;

      setCustomShiftTypes(updatedCustomTypes);
      setShiftTypes([...DEFAULT_SHIFT_TYPES, ...updatedCustomTypes]);
      return true;
    } catch (error) {
      console.error('Error removing shift type:', error);
      return false;
    } finally {
      setLoading(false);
    }
  }, [teamId]);

  return {
    shiftTypes,
    customShiftTypes,
    defaultShiftTypes: DEFAULT_SHIFT_TYPES,
    addShiftType,
    removeShiftType,
    loading,
    teamId
  };
};
