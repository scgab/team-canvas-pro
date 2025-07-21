-- Create ai_tool_categories table for shared category management
CREATE TABLE IF NOT EXISTS public.ai_tool_categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  created_by TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.ai_tool_categories ENABLE ROW LEVEL SECURITY;

-- Create policy for full access to all authenticated users
CREATE POLICY "Allow all operations for authenticated users" 
ON public.ai_tool_categories 
FOR ALL 
USING (true)
WITH CHECK (true);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_ai_tool_categories_updated_at
BEFORE UPDATE ON public.ai_tool_categories
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default categories
INSERT INTO public.ai_tool_categories (name, created_by) VALUES
  ('Content Creation', 'system'),
  ('Code & Development', 'system'),
  ('Design & Media', 'system'),
  ('Business & Productivity', 'system'),
  ('Data & Analytics', 'system'),
  ('Communication', 'system'),
  ('Research & Learning', 'system'),
  ('Other Tools', 'system')
ON CONFLICT (name) DO NOTHING;