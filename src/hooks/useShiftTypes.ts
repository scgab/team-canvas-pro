import { useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { TeamAuthService } from '@/services/teamAuth';

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

interface ShiftTypesData {
  teamId: string | null;
  customShiftTypes: ShiftType[];
}

const queryKey = (email?: string | null) => ['shift-types', email ?? 'anon'] as const;

export const useShiftTypes = () => {
  const { user } = useAuth();
  const qc = useQueryClient();

  const { data, isLoading } = useQuery<ShiftTypesData>({
    queryKey: queryKey(user?.email),
    enabled: !!user?.email,
    queryFn: async () => {
      const teamData = await TeamAuthService.getUserTeam(user!.email!);
      const teamId = teamData?.team?.id ?? null;
      if (!teamId) return { teamId: null, customShiftTypes: [] };

      const { data: team, error } = await supabase
        .from('teams')
        .select('team_settings')
        .eq('id', teamId)
        .single();

      if (error) return { teamId, customShiftTypes: [] };

      const settings = (team?.team_settings || {}) as { customShiftTypes?: ShiftType[] };
      const custom = Array.isArray(settings.customShiftTypes)
        ? settings.customShiftTypes.map((t) => ({ ...t, isCustom: true }))
        : [];
      return { teamId, customShiftTypes: custom };
    },
  });

  const teamId = data?.teamId ?? null;
  const customShiftTypes = data?.customShiftTypes ?? [];
  const shiftTypes: ShiftType[] = [...DEFAULT_SHIFT_TYPES, ...customShiftTypes];

  const writeCustomTypes = async (next: ShiftType[]) => {
    if (!teamId) throw new Error('No team');
    const { data: team, error: fetchError } = await supabase
      .from('teams')
      .select('team_settings')
      .eq('id', teamId)
      .single();
    if (fetchError) throw fetchError;

    const currentSettings = (team?.team_settings || {}) as Record<string, unknown>;
    const updatedSettings = { ...currentSettings, customShiftTypes: next };

    const { error: updateError } = await supabase
      .from('teams')
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .update({ team_settings: updatedSettings as any })
      .eq('id', teamId);
    if (updateError) throw updateError;
  };

  const addMutation = useMutation({
    mutationFn: async (label: string) => {
      const trimmed = label.trim();
      if (!trimmed) throw new Error('Empty label');
      const value = trimmed.toLowerCase().replace(/\s+/g, '_');
      if (shiftTypes.some((t) => t.value === value)) throw new Error('Duplicate');
      const next = [...customShiftTypes, { value, label: trimmed, isCustom: true }];
      await writeCustomTypes(next);
      return next;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKey(user?.email) }),
  });

  const removeMutation = useMutation({
    mutationFn: async (value: string) => {
      if (DEFAULT_SHIFT_TYPES.some((t) => t.value === value)) throw new Error('Cannot remove default');
      const next = customShiftTypes.filter((t) => t.value !== value);
      await writeCustomTypes(next);
      return next;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKey(user?.email) }),
  });

  const addShiftType = useCallback(
    async (label: string): Promise<boolean> => {
      try {
        await addMutation.mutateAsync(label);
        return true;
      } catch {
        return false;
      }
    },
    [addMutation]
  );

  const removeShiftType = useCallback(
    async (value: string): Promise<boolean> => {
      try {
        await removeMutation.mutateAsync(value);
        return true;
      } catch {
        return false;
      }
    },
    [removeMutation]
  );

  return {
    shiftTypes,
    customShiftTypes,
    defaultShiftTypes: DEFAULT_SHIFT_TYPES,
    addShiftType,
    removeShiftType,
    loading: isLoading || addMutation.isPending || removeMutation.isPending,
    teamId,
  };
};
