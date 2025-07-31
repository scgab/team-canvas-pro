-- Create team for the original users and associate their existing data
INSERT INTO teams (team_name, admin_email, team_id) 
VALUES ('Scandac Team', 'hna@scandac.com', 'TEAM-2025-000001');

-- Get the team UUID
DO $$
DECLARE
    team_uuid uuid;
BEGIN
    SELECT id INTO team_uuid FROM teams WHERE team_id = 'TEAM-2025-000001';
    
    -- Create team members
    INSERT INTO team_members (team_id, email, name, full_name, role, status, joined_at)
    VALUES 
        (team_uuid, 'hna@scandac.com', 'HNA User', 'HNA User', 'admin', 'active', now()),
        (team_uuid, 'myh@scandac.com', 'MYH User', 'MYH User', 'admin', 'active', now());
    
    -- Update existing projects to belong to this team
    UPDATE projects 
    SET team_id = team_uuid 
    WHERE created_by IN ('hna@scandac.com', 'myh@scandac.com');
    
    -- Update existing tasks to belong to this team
    UPDATE tasks 
    SET team_id = team_uuid 
    WHERE created_by IN ('hna@scandac.com', 'myh@scandac.com');
    
    -- Update existing calendar events to belong to this team
    UPDATE calendar_events 
    SET team_id = team_uuid 
    WHERE created_by IN ('hna@scandac.com', 'myh@scandac.com');
    
    -- Update existing messages to belong to this team
    UPDATE messages 
    SET team_id = team_uuid 
    WHERE sender_id IN ('hna@scandac.com', 'myh@scandac.com') 
       OR receiver_id IN ('hna@scandac.com', 'myh@scandac.com');
    
    -- Update user profiles to belong to this team
    UPDATE user_profiles 
    SET team_id = team_uuid 
    WHERE email IN ('hna@scandac.com', 'myh@scandac.com');
END $$;