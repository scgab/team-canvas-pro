-- Step 1: Create Teams table - Each signup creates a team
CREATE TABLE teams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_name VARCHAR NOT NULL,
  team_id VARCHAR UNIQUE NOT NULL, -- User-friendly unique ID (e.g., "TEAM-2024-001")
  admin_email VARCHAR NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  subscription_plan VARCHAR DEFAULT 'starter',
  team_logo_url VARCHAR,
  team_settings JSONB DEFAULT '{}'
);

-- Enable RLS on teams
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;

-- Create policies for teams
CREATE POLICY "Team members can view their team"
ON teams
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM team_members 
    WHERE team_members.team_id = teams.id 
    AND team_members.email = auth.email()
    AND team_members.status = 'active'
  )
);

CREATE POLICY "Team admins can update their team"
ON teams
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM team_members 
    WHERE team_members.team_id = teams.id 
    AND team_members.email = auth.email()
    AND team_members.role = 'admin'
    AND team_members.status = 'active'
  )
);

-- Team invitations table
CREATE TABLE team_invitations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
  email VARCHAR NOT NULL,
  invited_by VARCHAR NOT NULL,
  invitation_token VARCHAR UNIQUE NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  accepted_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on team_invitations
ALTER TABLE team_invitations ENABLE ROW LEVEL SECURITY;

-- Create policies for team_invitations
CREATE POLICY "Team admins can manage invitations"
ON team_invitations
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM team_members 
    WHERE team_members.team_id = team_invitations.team_id 
    AND team_members.email = auth.email()
    AND team_members.role = 'admin'
    AND team_members.status = 'active'
  )
);

-- Update existing team_members table to reference teams
ALTER TABLE team_members DROP CONSTRAINT IF EXISTS team_members_team_id_fkey;
ALTER TABLE team_members ADD COLUMN IF NOT EXISTS team_id UUID REFERENCES teams(id) ON DELETE CASCADE;
ALTER TABLE team_members ADD COLUMN IF NOT EXISTS invited_by VARCHAR;
ALTER TABLE team_members ADD COLUMN IF NOT EXISTS invited_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
ALTER TABLE team_members ADD COLUMN IF NOT EXISTS joined_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE team_members ADD COLUMN IF NOT EXISTS status VARCHAR DEFAULT 'active';
ALTER TABLE team_members ADD COLUMN IF NOT EXISTS full_name VARCHAR;

-- Drop existing constraint and recreate with team_id
ALTER TABLE team_members DROP CONSTRAINT IF EXISTS team_members_email_key;
ALTER TABLE team_members ADD CONSTRAINT unique_team_email UNIQUE(team_id, email);

-- Update team_members RLS policies
DROP POLICY IF EXISTS "Users can view team members" ON team_members;
DROP POLICY IF EXISTS "Users can update their own profile" ON team_members;
DROP POLICY IF EXISTS "Admins can manage team members" ON team_members;

CREATE POLICY "Team members can view their team members"
ON team_members
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM team_members tm 
    WHERE tm.team_id = team_members.team_id 
    AND tm.email = auth.email()
    AND tm.status = 'active'
  )
);

CREATE POLICY "Users can update their own team member profile"
ON team_members
FOR UPDATE
USING (email = auth.email());

CREATE POLICY "Team admins can manage team members"
ON team_members
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM team_members tm 
    WHERE tm.team_id = team_members.team_id 
    AND tm.email = auth.email()
    AND tm.role = 'admin'
    AND tm.status = 'active'
  )
);

-- Add team_id to all existing tables for data isolation
-- Projects table
ALTER TABLE projects ADD COLUMN IF NOT EXISTS team_id UUID REFERENCES teams(id) ON DELETE CASCADE;
CREATE INDEX IF NOT EXISTS idx_projects_team_id ON projects(team_id);

-- Tasks table  
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS team_id UUID REFERENCES teams(id) ON DELETE CASCADE;
CREATE INDEX IF NOT EXISTS idx_tasks_team_id ON tasks(team_id);

-- Calendar events table
ALTER TABLE calendar_events ADD COLUMN IF NOT EXISTS team_id UUID REFERENCES teams(id) ON DELETE CASCADE;
CREATE INDEX IF NOT EXISTS idx_calendar_events_team_id ON calendar_events(team_id);

-- Messages table
ALTER TABLE messages ADD COLUMN IF NOT EXISTS team_id UUID REFERENCES teams(id) ON DELETE CASCADE;
CREATE INDEX IF NOT EXISTS idx_messages_team_id ON messages(team_id);

-- Shifts table
ALTER TABLE shifts ADD COLUMN IF NOT EXISTS team_id UUID REFERENCES teams(id) ON DELETE CASCADE;
CREATE INDEX IF NOT EXISTS idx_shifts_team_id ON shifts(team_id);

-- Available shifts table
ALTER TABLE available_shifts ADD COLUMN IF NOT EXISTS team_id UUID REFERENCES teams(id) ON DELETE CASCADE;
CREATE INDEX IF NOT EXISTS idx_available_shifts_team_id ON available_shifts(team_id);

-- Availability table
ALTER TABLE availability ADD COLUMN IF NOT EXISTS team_id UUID REFERENCES teams(id) ON DELETE CASCADE;
CREATE INDEX IF NOT EXISTS idx_availability_team_id ON availability(team_id);

-- User profiles table
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS team_id UUID REFERENCES teams(id) ON DELETE CASCADE;
CREATE INDEX IF NOT EXISTS idx_user_profiles_team_id ON user_profiles(team_id);

-- AI tools table
ALTER TABLE ai_tools ADD COLUMN IF NOT EXISTS team_id UUID REFERENCES teams(id) ON DELETE CASCADE;
CREATE INDEX IF NOT EXISTS idx_ai_tools_team_id ON ai_tools(team_id);

-- AI tool categories table
ALTER TABLE ai_tool_categories ADD COLUMN IF NOT EXISTS team_id UUID REFERENCES teams(id) ON DELETE CASCADE;
CREATE INDEX IF NOT EXISTS idx_ai_tool_categories_team_id ON ai_tool_categories(team_id);

-- Project notes table
ALTER TABLE project_notes ADD COLUMN IF NOT EXISTS team_id UUID REFERENCES teams(id) ON DELETE CASCADE;
CREATE INDEX IF NOT EXISTS idx_project_notes_team_id ON project_notes(team_id);

-- Update RLS policies for all tables to be team-scoped
-- Projects policies
DROP POLICY IF EXISTS "Allow all operations for authenticated users" ON projects;

CREATE POLICY "Team members can view team projects"
ON projects
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM team_members 
    WHERE team_members.team_id = projects.team_id 
    AND team_members.email = auth.email()
    AND team_members.status = 'active'
  )
);

CREATE POLICY "Team members can create projects"
ON projects
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM team_members 
    WHERE team_members.team_id = projects.team_id 
    AND team_members.email = auth.email()
    AND team_members.status = 'active'
  )
);

CREATE POLICY "Team members can update team projects"
ON projects
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM team_members 
    WHERE team_members.team_id = projects.team_id 
    AND team_members.email = auth.email()
    AND team_members.status = 'active'
  )
);

CREATE POLICY "Team members can delete team projects"
ON projects
FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM team_members 
    WHERE team_members.team_id = projects.team_id 
    AND team_members.email = auth.email()
    AND team_members.status = 'active'
  )
);

-- Tasks policies
DROP POLICY IF EXISTS "Users can view all tasks" ON tasks;
DROP POLICY IF EXISTS "Users can create tasks" ON tasks;
DROP POLICY IF EXISTS "Users can update tasks they created or are assigned to" ON tasks;
DROP POLICY IF EXISTS "Users can delete tasks they created" ON tasks;

CREATE POLICY "Team members can view team tasks"
ON tasks
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM team_members 
    WHERE team_members.team_id = tasks.team_id 
    AND team_members.email = auth.email()
    AND team_members.status = 'active'
  )
);

CREATE POLICY "Team members can create tasks"
ON tasks
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM team_members 
    WHERE team_members.team_id = tasks.team_id 
    AND team_members.email = auth.email()
    AND team_members.status = 'active'
  ) AND created_by = auth.email()
);

CREATE POLICY "Team members can update tasks"
ON tasks
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM team_members 
    WHERE team_members.team_id = tasks.team_id 
    AND team_members.email = auth.email()
    AND team_members.status = 'active'
  ) AND (created_by = auth.email() OR assignee = auth.email())
);

CREATE POLICY "Team members can delete tasks they created"
ON tasks
FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM team_members 
    WHERE team_members.team_id = tasks.team_id 
    AND team_members.email = auth.email()
    AND team_members.status = 'active'
  ) AND created_by = auth.email()
);

-- Calendar events policies
DROP POLICY IF EXISTS "Allow all operations for authenticated users" ON calendar_events;

CREATE POLICY "Team members can manage team calendar events"
ON calendar_events
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM team_members 
    WHERE team_members.team_id = calendar_events.team_id 
    AND team_members.email = auth.email()
    AND team_members.status = 'active'
  )
);

-- Messages policies
DROP POLICY IF EXISTS "Allow all operations for authenticated users" ON messages;

CREATE POLICY "Team members can manage team messages"
ON messages
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM team_members 
    WHERE team_members.team_id = messages.team_id 
    AND team_members.email = auth.email()
    AND team_members.status = 'active'
  )
);

-- Update timestamp triggers for teams table
CREATE TRIGGER update_teams_updated_at
  BEFORE UPDATE ON teams
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Function to generate unique team ID
CREATE OR REPLACE FUNCTION generate_team_id()
RETURNS TEXT AS $$
DECLARE
  team_id_prefix TEXT;
  team_id_suffix TEXT;
  unique_team_id TEXT;
  counter INTEGER := 0;
BEGIN
  team_id_prefix := 'TEAM-' || EXTRACT(YEAR FROM NOW()) || '-';
  
  LOOP
    team_id_suffix := LPAD((FLOOR(RANDOM() * 999999) + 1)::TEXT, 6, '0');
    unique_team_id := team_id_prefix || team_id_suffix;
    
    -- Check if this ID already exists
    IF NOT EXISTS (SELECT 1 FROM teams WHERE team_id = unique_team_id) THEN
      RETURN unique_team_id;
    END IF;
    
    counter := counter + 1;
    -- Prevent infinite loop
    IF counter > 1000 THEN
      RAISE EXCEPTION 'Could not generate unique team ID after 1000 attempts';
    END IF;
  END LOOP;
END;
$$ LANGUAGE plpgsql;