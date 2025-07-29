-- Add meeting-specific columns to existing calendar_events table
ALTER TABLE public.calendar_events ADD COLUMN IF NOT EXISTS agenda TEXT[];
ALTER TABLE public.calendar_events ADD COLUMN IF NOT EXISTS meeting_notes TEXT;
ALTER TABLE public.calendar_events ADD COLUMN IF NOT EXISTS brainstorm_items TEXT[];
ALTER TABLE public.calendar_events ADD COLUMN IF NOT EXISTS agreements TEXT[];
ALTER TABLE public.calendar_events ADD COLUMN IF NOT EXISTS action_items TEXT[];
ALTER TABLE public.calendar_events ADD COLUMN IF NOT EXISTS meeting_status TEXT DEFAULT 'planned' CHECK (meeting_status IN ('planned', 'ongoing', 'completed'));
ALTER TABLE public.calendar_events ADD COLUMN IF NOT EXISTS meeting_summary TEXT;

-- Update the type column to use 'meeting' for meetings (if not already set)
-- This ensures meetings appear in both calendar and meetings page

-- Create trigger for automatic timestamp updates on calendar_events if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_trigger 
        WHERE tgname = 'update_calendar_events_updated_at'
    ) THEN
        CREATE TRIGGER update_calendar_events_updated_at
        BEFORE UPDATE ON public.calendar_events
        FOR EACH ROW
        EXECUTE FUNCTION public.update_updated_at_column();
    END IF;
END $$;

-- Drop the separate meetings table since we're consolidating into calendar_events
DROP TABLE IF EXISTS public.meetings;