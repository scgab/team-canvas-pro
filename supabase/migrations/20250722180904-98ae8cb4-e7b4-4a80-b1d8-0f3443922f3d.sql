-- Drop the existing restrictive policies and create public access policies for AI tools
DROP POLICY IF EXISTS "Allow all operations for authenticated users" ON public.ai_tool_categories;
DROP POLICY IF EXISTS "Allow all operations for authenticated users" ON public.ai_tools;

-- Create public access policies that work without authentication
CREATE POLICY "Allow public read access to categories" 
ON public.ai_tool_categories 
FOR SELECT 
USING (true);

CREATE POLICY "Allow public write access to categories" 
ON public.ai_tool_categories 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Allow public update access to categories" 
ON public.ai_tool_categories 
FOR UPDATE 
USING (true);

CREATE POLICY "Allow public delete access to categories" 
ON public.ai_tool_categories 
FOR DELETE 
USING (true);

-- Same for AI tools
CREATE POLICY "Allow public read access to tools" 
ON public.ai_tools 
FOR SELECT 
USING (true);

CREATE POLICY "Allow public write access to tools" 
ON public.ai_tools 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Allow public update access to tools" 
ON public.ai_tools 
FOR UPDATE 
USING (true);

CREATE POLICY "Allow public delete access to tools" 
ON public.ai_tools 
FOR DELETE 
USING (true);