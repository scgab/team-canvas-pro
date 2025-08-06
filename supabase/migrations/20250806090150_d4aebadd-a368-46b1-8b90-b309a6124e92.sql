-- Fix calendar_events to handle team isolation properly
-- First check which records have null team_id and handle them

-- Get current user's team info and set team_id for any null records
-- For demo purposes, we'll set a default team_id for orphaned records
DO $$ 
DECLARE
    default_team_id uuid;
BEGIN
    -- Get the first available team_id as default
    SELECT id INTO default_team_id FROM teams LIMIT 1;
    
    -- Update null team_id records with the default team
    UPDATE calendar_events 
    SET team_id = default_team_id
    WHERE team_id IS NULL;
    
    -- Now we can safely add the NOT NULL constraint
    ALTER TABLE calendar_events 
    ALTER COLUMN team_id SET NOT NULL;
END $$;

-- Add index for better performance on team-based queries
CREATE INDEX IF NOT EXISTS idx_calendar_events_team_id_type ON calendar_events(team_id, type);
CREATE INDEX IF NOT EXISTS idx_calendar_events_team_id_status ON calendar_events(team_id, meeting_status);

-- Enable realtime for calendar_events
ALTER TABLE calendar_events REPLICA IDENTITY FULL;

-- Add the table to realtime publication
DO $$
BEGIN
    -- Check if the publication exists, if not create it
    IF NOT EXISTS (SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime') THEN
        CREATE PUBLICATION supabase_realtime FOR TABLE calendar_events;
    ELSE
        -- Add table to existing publication if not already included
        ALTER PUBLICATION supabase_realtime ADD TABLE calendar_events;
    END IF;
EXCEPTION
    WHEN duplicate_object THEN
        -- Table is already in the publication, ignore
        NULL;
END $$;