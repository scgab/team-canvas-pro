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

-- Update existing team_members table to reference teams
ALTER TABLE team_members ADD COLUMN team_id UUID REFERENCES teams(id) ON DELETE CASCADE;
ALTER TABLE team_members ADD COLUMN invited_by VARCHAR;
ALTER TABLE team_members ADD COLUMN invited_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
ALTER TABLE team_members ADD COLUMN joined_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE team_members ADD COLUMN status VARCHAR DEFAULT 'active';
ALTER TABLE team_members ADD COLUMN full_name VARCHAR;

-- Drop existing constraint and recreate with team_id
ALTER TABLE team_members DROP CONSTRAINT IF EXISTS team_members_email_key;
ALTER TABLE team_members ADD CONSTRAINT unique_team_email UNIQUE(team_id, email);

-- Add team_id to all existing tables for data isolation
ALTER TABLE projects ADD COLUMN team_id UUID REFERENCES teams(id) ON DELETE CASCADE;
ALTER TABLE tasks ADD COLUMN team_id UUID REFERENCES teams(id) ON DELETE CASCADE;
ALTER TABLE calendar_events ADD COLUMN team_id UUID REFERENCES teams(id) ON DELETE CASCADE;
ALTER TABLE messages ADD COLUMN team_id UUID REFERENCES teams(id) ON DELETE CASCADE;
ALTER TABLE shifts ADD COLUMN team_id UUID REFERENCES teams(id) ON DELETE CASCADE;
ALTER TABLE available_shifts ADD COLUMN team_id UUID REFERENCES teams(id) ON DELETE CASCADE;
ALTER TABLE availability ADD COLUMN team_id UUID REFERENCES teams(id) ON DELETE CASCADE;
ALTER TABLE user_profiles ADD COLUMN team_id UUID REFERENCES teams(id) ON DELETE CASCADE;
ALTER TABLE ai_tools ADD COLUMN team_id UUID REFERENCES teams(id) ON DELETE CASCADE;
ALTER TABLE ai_tool_categories ADD COLUMN team_id UUID REFERENCES teams(id) ON DELETE CASCADE;
ALTER TABLE project_notes ADD COLUMN team_id UUID REFERENCES teams(id) ON DELETE CASCADE;

-- Create indexes for better performance
CREATE INDEX idx_projects_team_id ON projects(team_id);
CREATE INDEX idx_tasks_team_id ON tasks(team_id);
CREATE INDEX idx_calendar_events_team_id ON calendar_events(team_id);
CREATE INDEX idx_messages_team_id ON messages(team_id);
CREATE INDEX idx_shifts_team_id ON shifts(team_id);
CREATE INDEX idx_available_shifts_team_id ON available_shifts(team_id);
CREATE INDEX idx_availability_team_id ON availability(team_id);
CREATE INDEX idx_user_profiles_team_id ON user_profiles(team_id);
CREATE INDEX idx_ai_tools_team_id ON ai_tools(team_id);
CREATE INDEX idx_ai_tool_categories_team_id ON ai_tool_categories(team_id);
CREATE INDEX idx_project_notes_team_id ON project_notes(team_id);

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

-- Security definer function to check team membership
CREATE OR REPLACE FUNCTION user_is_team_member(check_team_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM team_members 
    WHERE team_id = check_team_id 
    AND email = auth.email()
    AND status = 'active'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Security definer function to check team admin status
CREATE OR REPLACE FUNCTION user_is_team_admin(check_team_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM team_members 
    WHERE team_id = check_team_id 
    AND email = auth.email()
    AND role = 'admin'
    AND status = 'active'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Update timestamp triggers for teams table
CREATE TRIGGER update_teams_updated_at
  BEFORE UPDATE ON teams
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();