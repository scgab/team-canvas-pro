-- Enable real-time for ai_tool_categories table
ALTER TABLE public.ai_tool_categories REPLICA IDENTITY FULL;

-- Add ai_tool_categories table to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.ai_tool_categories;

-- Also add ai_tools table to realtime if not already there
ALTER TABLE public.ai_tools REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.ai_tools;