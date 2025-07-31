-- Fix AI tools and categories to belong to the Scandac Team
DO $$
DECLARE
    team_uuid uuid;
BEGIN
    SELECT id INTO team_uuid FROM teams WHERE team_id = 'TEAM-2025-000001';
    
    -- Update all existing AI tool categories to belong to Scandac Team
    UPDATE ai_tool_categories 
    SET team_id = team_uuid, 
        created_by = 'hna@scandac.com'
    WHERE team_id IS NULL;
    
    -- Update all existing AI tools to belong to Scandac Team
    UPDATE ai_tools 
    SET team_id = team_uuid,
        added_by = CASE 
            WHEN added_by = 'unknown' THEN 'hna@scandac.com'
            ELSE added_by
        END
    WHERE team_id IS NULL;
    
    -- Now add the original 5 tools we wanted (these will have higher priority)
    INSERT INTO ai_tools (name, link, note, category, tags, rating, is_favorite, added_by, team_id) VALUES
        ('ChatGPT', 'https://chat.openai.com', 'AI-powered conversational assistant for various tasks', 'Content Creation', ARRAY['writing', 'conversation', 'automation'], 5, true, 'hna@scandac.com', team_uuid),
        ('GitHub Copilot', 'https://github.com/features/copilot', 'AI pair programmer that helps with code completion', 'Code & Development', ARRAY['coding', 'programming', 'development'], 5, true, 'myh@scandac.com', team_uuid),
        ('Midjourney', 'https://midjourney.com', 'AI image generation for creative projects', 'Design & Media', ARRAY['images', 'art', 'creative'], 4, false, 'hna@scandac.com', team_uuid),
        ('Notion AI', 'https://notion.so', 'AI-powered workspace for notes and project management', 'Business & Productivity', ARRAY['productivity', 'organization', 'notes'], 4, true, 'myh@scandac.com', team_uuid),
        ('Tableau', 'https://tableau.com', 'Data visualization and analytics platform', 'Data & Analytics', ARRAY['data', 'visualization', 'analytics'], 4, false, 'hna@scandac.com', team_uuid);
END $$;