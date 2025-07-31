-- Restore AI tools categories and tools for Scandac Team
DO $$
DECLARE
    team_uuid uuid;
BEGIN
    SELECT id INTO team_uuid FROM teams WHERE team_id = 'TEAM-2025-000001';
    
    -- Delete existing categories for this team first
    DELETE FROM ai_tool_categories WHERE team_id = team_uuid;
    
    -- Create AI tool categories
    INSERT INTO ai_tool_categories (name, created_by, team_id) VALUES
        ('Content Creation', 'hna@scandac.com', team_uuid),
        ('Code & Development', 'myh@scandac.com', team_uuid),
        ('Design & Media', 'hna@scandac.com', team_uuid),
        ('Business & Productivity', 'myh@scandac.com', team_uuid),
        ('Data & Analytics', 'hna@scandac.com', team_uuid);
    
    -- Clear existing AI tools for this team and restore originals
    DELETE FROM ai_tools WHERE team_id = team_uuid;
    
    INSERT INTO ai_tools (name, link, note, category, tags, rating, is_favorite, added_by, team_id) VALUES
        ('ChatGPT', 'https://chat.openai.com', 'AI-powered conversational assistant for various tasks', 'Content Creation', ARRAY['writing', 'conversation', 'automation'], 5, true, 'hna@scandac.com', team_uuid),
        ('GitHub Copilot', 'https://github.com/features/copilot', 'AI pair programmer that helps with code completion', 'Code & Development', ARRAY['coding', 'programming', 'development'], 5, true, 'myh@scandac.com', team_uuid),
        ('Midjourney', 'https://midjourney.com', 'AI image generation for creative projects', 'Design & Media', ARRAY['images', 'art', 'creative'], 4, false, 'hna@scandac.com', team_uuid),
        ('Notion AI', 'https://notion.so', 'AI-powered workspace for notes and project management', 'Business & Productivity', ARRAY['productivity', 'organization', 'notes'], 4, true, 'myh@scandac.com', team_uuid),
        ('Tableau', 'https://tableau.com', 'Data visualization and analytics platform', 'Data & Analytics', ARRAY['data', 'visualization', 'analytics'], 4, false, 'hna@scandac.com', team_uuid);
END $$;