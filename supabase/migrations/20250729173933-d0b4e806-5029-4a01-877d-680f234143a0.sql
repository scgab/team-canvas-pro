-- Create meetings table with all required fields
CREATE TABLE public.meetings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME,
  status TEXT DEFAULT 'planned' CHECK (status IN ('planned', 'ongoing', 'completed')),
  attendees TEXT[] DEFAULT '{}',
  agenda TEXT[],
  notes TEXT,
  brainstorm_items TEXT[],
  agreements TEXT[],
  action_items TEXT[],
  created_by TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.meetings ENABLE ROW LEVEL SECURITY;

-- Create policies for meeting access
CREATE POLICY "Users can view meetings they're invited to or created" 
ON public.meetings 
FOR SELECT 
USING (
  created_by = auth.uid()::text OR 
  auth.uid()::text = ANY(attendees)
);

CREATE POLICY "Users can create meetings" 
ON public.meetings 
FOR INSERT 
WITH CHECK (created_by = auth.uid()::text);

CREATE POLICY "Meeting creators and attendees can update meetings" 
ON public.meetings 
FOR UPDATE 
USING (
  created_by = auth.uid()::text OR 
  auth.uid()::text = ANY(attendees)
);

CREATE POLICY "Meeting creators can delete meetings" 
ON public.meetings 
FOR DELETE 
USING (created_by = auth.uid()::text);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_meetings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_meetings_updated_at
BEFORE UPDATE ON public.meetings
FOR EACH ROW
EXECUTE FUNCTION public.update_meetings_updated_at();

-- Enable realtime for meetings table
ALTER TABLE public.meetings REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.meetings;