import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

type TableName = string;

/**
 * Subscribe to Postgres changes on a Supabase table and invalidate the
 * matching React Query cache key whenever a row mutates.
 *
 * Example:
 *   useRealtimeInvalidate('projects', ['projects']);
 */
export function useRealtimeInvalidate(
  table: TableName,
  queryKey: readonly unknown[],
  enabled: boolean = true
) {
  const qc = useQueryClient();

  useEffect(() => {
    if (!enabled) return;
    const channel = supabase
      .channel(`rt:${table}:${queryKey.join('-')}`)
      .on(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        'postgres_changes' as any,
        { event: '*', schema: 'public', table },
        () => {
          qc.invalidateQueries({ queryKey });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [table, enabled, qc, JSON.stringify(queryKey)]);
}
