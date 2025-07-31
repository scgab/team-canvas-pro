-- Add sample shifts for testing the weekly calendar (fixed)
DO $$
DECLARE
    team_uuid uuid;
    current_week_start date;
BEGIN
    SELECT id INTO team_uuid FROM teams WHERE team_id = 'TEAM-2025-000001';
    
    -- Get start of current week (Monday)
    current_week_start := date_trunc('week', current_date) + interval '1 day';
    
    -- Insert sample shifts for current week
    INSERT INTO shifts (
        assigned_to, 
        date, 
        start_time, 
        end_time, 
        shift_type, 
        status, 
        notes, 
        created_by,
        team_id
    ) VALUES 
        ('hna@scandac.com', current_week_start + 0, '09:00'::time, '17:00'::time, 'Morning Shift', 'scheduled', 'Regular office hours', 'admin@scandac.com', team_uuid),
        ('myh@scandac.com', current_week_start + 2, '13:00'::time, '21:00'::time, 'Afternoon Shift', 'scheduled', 'Late shift coverage', 'admin@scandac.com', team_uuid),
        ('hna@scandac.com', current_week_start + 4, '08:00'::time, '16:00'::time, 'Early Shift', 'scheduled', 'Early morning coverage', 'admin@scandac.com', team_uuid),
        ('myh@scandac.com', current_week_start + 7, '10:00'::time, '18:00'::time, 'Day Shift', 'scheduled', 'Standard day shift', 'admin@scandac.com', team_uuid),
        ('hna@scandac.com', current_week_start + 9, '14:00'::time, '22:00'::time, 'Evening Shift', 'scheduled', 'Evening coverage', 'admin@scandac.com', team_uuid),
        ('myh@scandac.com', current_week_start + 11, '09:00'::time, '17:00'::time, 'Regular Shift', 'scheduled', 'Regular hours', 'admin@scandac.com', team_uuid)
    ON CONFLICT DO NOTHING;
END $$;