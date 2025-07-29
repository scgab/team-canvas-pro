-- PHASE 1: CRITICAL DATABASE SECURITY FIXES

-- 1. Re-enable RLS on availability table and create proper policies
ALTER TABLE availability ENABLE ROW LEVEL SECURITY;

-- Drop the overly permissive policy
DROP POLICY IF EXISTS "Allow all availability operations" ON availability;

-- Create proper user-based policies for availability
CREATE POLICY "Users can view their own availability" 
ON availability 
FOR SELECT 
USING (team_member_email = auth.email());

CREATE POLICY "Users can insert their own availability" 
ON availability 
FOR INSERT 
WITH CHECK (team_member_email = auth.email());

CREATE POLICY "Users can update their own availability" 
ON availability 
FOR UPDATE 
USING (team_member_email = auth.email());

CREATE POLICY "Users can delete their own availability" 
ON availability 
FOR DELETE 
USING (team_member_email = auth.email());

-- 2. Fix team_members policies to be more restrictive
DROP POLICY IF EXISTS "Allow all team member operations" ON team_members;

-- Create proper role-based policies for team_members
CREATE POLICY "Users can view team members" 
ON team_members 
FOR SELECT 
USING (true);

CREATE POLICY "Users can update their own profile" 
ON team_members 
FOR UPDATE 
USING (email = auth.email());

CREATE POLICY "Admins can manage team members" 
ON team_members 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM team_members tm 
  WHERE tm.email = auth.email() 
  AND tm.role = 'admin'
));

-- 3. Fix overly permissive policies on other tables
DROP POLICY IF EXISTS "Allow all operations for all users" ON tasks;
DROP POLICY IF EXISTS "Allow all operations for all users" ON project_notes;

-- Create proper policies for tasks
CREATE POLICY "Users can view all tasks" 
ON tasks 
FOR SELECT 
USING (true);

CREATE POLICY "Users can create tasks" 
ON tasks 
FOR INSERT 
WITH CHECK (created_by = auth.email());

CREATE POLICY "Users can update tasks they created or are assigned to" 
ON tasks 
FOR UPDATE 
USING (created_by = auth.email() OR assignee = auth.email());

CREATE POLICY "Users can delete tasks they created" 
ON tasks 
FOR DELETE 
USING (created_by = auth.email());

-- Create proper policies for project_notes
CREATE POLICY "Users can view all project notes" 
ON project_notes 
FOR SELECT 
USING (true);

CREATE POLICY "Users can create project notes" 
ON project_notes 
FOR INSERT 
WITH CHECK (created_by = auth.email());

CREATE POLICY "Users can update notes they created" 
ON project_notes 
FOR UPDATE 
USING (created_by = auth.email());

CREATE POLICY "Users can delete notes they created" 
ON project_notes 
FOR DELETE 
USING (created_by = auth.email());

-- 4. Add proper search_path to existing functions for security
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.update_meetings_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.update_calendar_events_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.update_shifts_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$function$;