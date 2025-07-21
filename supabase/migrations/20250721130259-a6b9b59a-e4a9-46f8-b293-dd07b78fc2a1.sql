-- Temporarily disable RLS on tasks table to allow INSERT operations
-- This is needed because the app uses mock authentication instead of Supabase auth
ALTER TABLE public.tasks DISABLE ROW LEVEL SECURITY;

-- Drop existing RLS policy if it exists
DROP POLICY IF EXISTS "Allow all operations for authenticated users" ON public.tasks;

-- Create a more permissive policy that allows all operations
-- Since this app uses mock authentication, we'll allow all operations for now
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all operations for all users" 
ON public.tasks 
FOR ALL 
USING (true)
WITH CHECK (true);