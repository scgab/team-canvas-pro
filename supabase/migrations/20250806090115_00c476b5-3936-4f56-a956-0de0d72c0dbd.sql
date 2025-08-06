-- Fix calendar_events table to require team_id and improve data persistence
-- Add team_id as NOT NULL and add auto-save functionality

-- First, set team_id to NOT NULL (after ensuring all records have team_id)
UPDATE calendar_events 
SET team_id = (
  SELECT tm.team_id 
  FROM team_members tm 
  WHERE tm.email = calendar_events.created_by 
  LIMIT 1
) 
WHERE team_id IS NULL;

-- Add team_id constraint
ALTER TABLE calendar_events 
ALTER COLUMN team_id SET NOT NULL;

-- Add updated_at trigger for calendar_events if not exists
CREATE OR REPLACE TRIGGER update_calendar_events_updated_at
  BEFORE UPDATE ON calendar_events
  FOR EACH ROW
  EXECUTE FUNCTION update_calendar_events_updated_at();

-- Add index for better performance on team-based queries
CREATE INDEX IF NOT EXISTS idx_calendar_events_team_id_type ON calendar_events(team_id, type);
CREATE INDEX IF NOT EXISTS idx_calendar_events_team_id_status ON calendar_events(team_id, meeting_status);

-- Enable realtime for calendar_events
ALTER TABLE calendar_events REPLICA IDENTITY FULL;
DROP PUBLICATION IF EXISTS supabase_realtime;
CREATE PUBLICATION supabase_realtime FOR TABLE calendar_events;