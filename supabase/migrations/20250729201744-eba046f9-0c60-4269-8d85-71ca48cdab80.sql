-- Fix infinite recursion in team_members policies
DROP POLICY IF EXISTS "Admins can manage team members" ON team_members;
DROP POLICY IF EXISTS "Team members can view all team members" ON team_members;

-- Create simple policies without recursion
CREATE POLICY "Allow all team member operations" ON team_members
FOR ALL USING (true) WITH CHECK (true);