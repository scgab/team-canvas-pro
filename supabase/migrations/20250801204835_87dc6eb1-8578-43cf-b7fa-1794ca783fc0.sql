-- Fix RLS policies for ai_tool_categories table

-- First check if the table exists and enable RLS
ALTER TABLE public.ai_tool_categories ENABLE ROW LEVEL SECURITY;

-- Create policies for ai_tool_categories
CREATE POLICY "Users can view ai_tool_categories for their team" 
ON public.ai_tool_categories 
FOR SELECT 
USING (
  team_id IN (
    SELECT team_id 
    FROM public.profiles 
    WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Users can create ai_tool_categories for their team" 
ON public.ai_tool_categories 
FOR INSERT 
WITH CHECK (
  team_id IN (
    SELECT team_id 
    FROM public.profiles 
    WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Users can update ai_tool_categories for their team" 
ON public.ai_tool_categories 
FOR UPDATE 
USING (
  team_id IN (
    SELECT team_id 
    FROM public.profiles 
    WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Users can delete ai_tool_categories for their team" 
ON public.ai_tool_categories 
FOR DELETE 
USING (
  team_id IN (
    SELECT team_id 
    FROM public.profiles 
    WHERE user_id = auth.uid()
  )
);

-- Also fix ai_tools table policies
ALTER TABLE public.ai_tools ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view ai_tools for their team" 
ON public.ai_tools 
FOR SELECT 
USING (
  team_id IN (
    SELECT team_id 
    FROM public.profiles 
    WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Users can create ai_tools for their team" 
ON public.ai_tools 
FOR INSERT 
WITH CHECK (
  team_id IN (
    SELECT team_id 
    FROM public.profiles 
    WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Users can update ai_tools for their team" 
ON public.ai_tools 
FOR UPDATE 
USING (
  team_id IN (
    SELECT team_id 
    FROM public.profiles 
    WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Users can delete ai_tools for their team" 
ON public.ai_tools 
FOR DELETE 
USING (
  team_id IN (
    SELECT team_id 
    FROM public.profiles 
    WHERE user_id = auth.uid()
  )
);