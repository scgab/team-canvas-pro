-- Add missing fields to tasks table for start/due dates and duration
ALTER TABLE public.tasks 
ADD COLUMN IF NOT EXISTS start_date date,
ADD COLUMN IF NOT EXISTS due_date date,
ADD COLUMN IF NOT EXISTS duration integer DEFAULT 1;

-- Add missing fields to calendar_events table for team assignment and location
ALTER TABLE public.calendar_events
ADD COLUMN IF NOT EXISTS location text,
ADD COLUMN IF NOT EXISTS assigned_members text[] DEFAULT '{}';

-- Enable real-time for all tables
ALTER TABLE public.tasks REPLICA IDENTITY FULL;
ALTER TABLE public.projects REPLICA IDENTITY FULL;
ALTER TABLE public.calendar_events REPLICA IDENTITY FULL;
ALTER TABLE public.messages REPLICA IDENTITY FULL;

-- Add tables to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.tasks;
ALTER PUBLICATION supabase_realtime ADD TABLE public.projects;
ALTER PUBLICATION supabase_realtime ADD TABLE public.calendar_events;
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;