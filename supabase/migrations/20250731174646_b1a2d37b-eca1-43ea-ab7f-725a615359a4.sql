-- Create RLS policies using security definer functions

-- Teams policies
CREATE POLICY "Team members can view their team"
ON teams
FOR SELECT
USING (user_is_team_member(id));

CREATE POLICY "Team admins can update their team"
ON teams
FOR UPDATE
USING (user_is_team_admin(id));

CREATE POLICY "Authenticated users can create teams"
ON teams
FOR INSERT
WITH CHECK (auth.email() = admin_email);

-- Team invitations policies
CREATE POLICY "Team admins can manage invitations"
ON team_invitations
FOR ALL
USING (user_is_team_admin(team_id));

-- Update team_members RLS policies
DROP POLICY IF EXISTS "Users can view team members" ON team_members;
DROP POLICY IF EXISTS "Users can update their own profile" ON team_members;
DROP POLICY IF EXISTS "Admins can manage team members" ON team_members;

CREATE POLICY "Team members can view their team members"
ON team_members
FOR SELECT
USING (user_is_team_member(team_id));

CREATE POLICY "Users can update their own team member profile"
ON team_members
FOR UPDATE
USING (email = auth.email());

CREATE POLICY "Team admins can manage team members"
ON team_members
FOR ALL
USING (user_is_team_admin(team_id));

-- Projects policies
DROP POLICY IF EXISTS "Allow all operations for authenticated users" ON projects;

CREATE POLICY "Team members can view team projects"
ON projects
FOR SELECT
USING (user_is_team_member(team_id));

CREATE POLICY "Team members can create projects"
ON projects
FOR INSERT
WITH CHECK (user_is_team_member(team_id));

CREATE POLICY "Team members can update team projects"
ON projects
FOR UPDATE
USING (user_is_team_member(team_id));

CREATE POLICY "Team members can delete team projects"
ON projects
FOR DELETE
USING (user_is_team_member(team_id));

-- Tasks policies
DROP POLICY IF EXISTS "Users can view all tasks" ON tasks;
DROP POLICY IF EXISTS "Users can create tasks" ON tasks;
DROP POLICY IF EXISTS "Users can update tasks they created or are assigned to" ON tasks;
DROP POLICY IF EXISTS "Users can delete tasks they created" ON tasks;

CREATE POLICY "Team members can view team tasks"
ON tasks
FOR SELECT
USING (user_is_team_member(team_id));

CREATE POLICY "Team members can create tasks"
ON tasks
FOR INSERT
WITH CHECK (user_is_team_member(team_id) AND created_by = auth.email());

CREATE POLICY "Team members can update tasks"
ON tasks
FOR UPDATE
USING (user_is_team_member(team_id) AND (created_by = auth.email() OR assignee = auth.email()));

CREATE POLICY "Team members can delete tasks they created"
ON tasks
FOR DELETE
USING (user_is_team_member(team_id) AND created_by = auth.email());

-- Calendar events policies
DROP POLICY IF EXISTS "Allow all operations for authenticated users" ON calendar_events;

CREATE POLICY "Team members can manage team calendar events"
ON calendar_events
FOR ALL
USING (user_is_team_member(team_id));

-- Messages policies
DROP POLICY IF EXISTS "Allow all operations for authenticated users" ON messages;

CREATE POLICY "Team members can manage team messages"
ON messages
FOR ALL
USING (user_is_team_member(team_id));

-- Project notes policies
DROP POLICY IF EXISTS "Users can view all project notes" ON project_notes;
DROP POLICY IF EXISTS "Users can create project notes" ON project_notes;
DROP POLICY IF EXISTS "Users can update notes they created" ON project_notes;
DROP POLICY IF EXISTS "Users can delete notes they created" ON project_notes;

CREATE POLICY "Team members can view team project notes"
ON project_notes
FOR SELECT
USING (user_is_team_member(team_id));

CREATE POLICY "Team members can create project notes"
ON project_notes
FOR INSERT
WITH CHECK (user_is_team_member(team_id) AND created_by = auth.email());

CREATE POLICY "Team members can update notes they created"
ON project_notes
FOR UPDATE
USING (user_is_team_member(team_id) AND created_by = auth.email());

CREATE POLICY "Team members can delete notes they created"
ON project_notes
FOR DELETE
USING (user_is_team_member(team_id) AND created_by = auth.email());

-- AI tools policies
DROP POLICY IF EXISTS "Allow public read access to tools" ON ai_tools;
DROP POLICY IF EXISTS "Allow public write access to tools" ON ai_tools;
DROP POLICY IF EXISTS "Allow public update access to tools" ON ai_tools;
DROP POLICY IF EXISTS "Allow public delete access to tools" ON ai_tools;

CREATE POLICY "Team members can view team AI tools"
ON ai_tools
FOR SELECT
USING (user_is_team_member(team_id));

CREATE POLICY "Team members can create AI tools"
ON ai_tools
FOR INSERT
WITH CHECK (user_is_team_member(team_id));

CREATE POLICY "Team members can update team AI tools"
ON ai_tools
FOR UPDATE
USING (user_is_team_member(team_id));

CREATE POLICY "Team members can delete team AI tools"
ON ai_tools
FOR DELETE
USING (user_is_team_member(team_id));

-- AI tool categories policies
DROP POLICY IF EXISTS "Allow public read access to categories" ON ai_tool_categories;
DROP POLICY IF EXISTS "Allow public write access to categories" ON ai_tool_categories;
DROP POLICY IF EXISTS "Allow public update access to categories" ON ai_tool_categories;
DROP POLICY IF EXISTS "Allow public delete access to categories" ON ai_tool_categories;

CREATE POLICY "Team members can view team AI tool categories"
ON ai_tool_categories
FOR SELECT
USING (user_is_team_member(team_id));

CREATE POLICY "Team members can create AI tool categories"
ON ai_tool_categories
FOR INSERT
WITH CHECK (user_is_team_member(team_id));

CREATE POLICY "Team members can update team AI tool categories"
ON ai_tool_categories
FOR UPDATE
USING (user_is_team_member(team_id));

CREATE POLICY "Team members can delete team AI tool categories"
ON ai_tool_categories
FOR DELETE
USING (user_is_team_member(team_id));

-- User profiles policies
DROP POLICY IF EXISTS "Users can view their own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can create their own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON user_profiles;

CREATE POLICY "Team members can view team profiles"
ON user_profiles
FOR SELECT
USING (user_is_team_member(team_id));

CREATE POLICY "Users can create their own profile"
ON user_profiles
FOR INSERT
WITH CHECK (email = auth.email());

CREATE POLICY "Users can update their own profile"
ON user_profiles
FOR UPDATE
USING (email = auth.email());

-- Availability policies
DROP POLICY IF EXISTS "Users can view their own availability" ON availability;
DROP POLICY IF EXISTS "Users can insert their own availability" ON availability;
DROP POLICY IF EXISTS "Users can update their own availability" ON availability;
DROP POLICY IF EXISTS "Users can delete their own availability" ON availability;

CREATE POLICY "Team members can view team availability"
ON availability
FOR SELECT
USING (user_is_team_member(team_id));

CREATE POLICY "Users can manage their own availability"
ON availability
FOR ALL
USING (team_member_email = auth.email());

-- Shifts policies
DROP POLICY IF EXISTS "Users can view shifts" ON shifts;
DROP POLICY IF EXISTS "Admins can manage all shifts" ON shifts;
DROP POLICY IF EXISTS "Members can view their own shifts" ON shifts;

CREATE POLICY "Team members can view team shifts"
ON shifts
FOR SELECT
USING (user_is_team_member(team_id));

CREATE POLICY "Team admins can manage shifts"
ON shifts
FOR ALL
USING (user_is_team_admin(team_id));

CREATE POLICY "Users can view their own shifts"
ON shifts
FOR SELECT
USING (assigned_to = auth.email());

-- Available shifts policies
DROP POLICY IF EXISTS "Users can view available shifts" ON available_shifts;
DROP POLICY IF EXISTS "Admins can manage available shifts" ON available_shifts;
DROP POLICY IF EXISTS "Members can claim available shifts" ON available_shifts;

CREATE POLICY "Team members can view team available shifts"
ON available_shifts
FOR SELECT
USING (user_is_team_member(team_id));

CREATE POLICY "Team admins can manage available shifts"
ON available_shifts
FOR ALL
USING (user_is_team_admin(team_id));

CREATE POLICY "Team members can claim available shifts"
ON available_shifts
FOR UPDATE
USING (user_is_team_member(team_id) AND (claimed_by IS NULL OR claimed_by = auth.email()));