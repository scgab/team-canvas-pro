-- Add sample shifts for testing the weekly calendar
DO $$
DECLARE
    team_uuid uuid;
    current_week_start date;
    sample_shifts record;
BEGIN
    SELECT id INTO team_uuid FROM teams WHERE team_id = 'TEAM-2025-000001';
    
    -- Get start of current week (Monday)
    current_week_start := date_trunc('week', current_date) + interval '1 day';
    
    -- Insert sample shifts for current week only if they don't exist
    FOR sample_shifts IN 
        SELECT 
            unnest(ARRAY['hna@scandac.com', 'myh@scandac.com']) as email,
            unnest(ARRAY[0, 2, 4]) as day_offset,
            unnest(ARRAY['09:00', '13:00', '08:00']) as start_time,
            unnest(ARRAY['17:00', '21:00', '16:00']) as end_time,
            unnest(ARRAY['Morning Shift', 'Afternoon Shift', 'Early Shift']) as shift_type,
            unnest(ARRAY['Regular office hours', 'Late shift coverage', 'Early morning coverage']) as notes
    LOOP
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
        ) VALUES (
            sample_shifts.email,
            current_week_start + sample_shifts.day_offset,
            sample_shifts.start_time,
            sample_shifts.end_time,
            sample_shifts.shift_type,
            'scheduled',
            sample_shifts.notes,
            'admin@scandac.com',
            team_uuid
        )
        ON CONFLICT DO NOTHING;
    END LOOP;
    
    -- Add some next week shifts too
    FOR sample_shifts IN 
        SELECT 
            unnest(ARRAY['hna@scandac.com', 'myh@scandac.com']) as email,
            unnest(ARRAY[7, 9, 11]) as day_offset,
            unnest(ARRAY['10:00', '14:00', '09:00']) as start_time,
            unnest(ARRAY['18:00', '22:00', '17:00']) as end_time,
            unnest(ARRAY['Day Shift', 'Evening Shift', 'Regular Shift']) as shift_type,
            unnest(ARRAY['Standard day shift', 'Evening coverage', 'Regular hours']) as notes
    LOOP
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
        ) VALUES (
            sample_shifts.email,
            current_week_start + sample_shifts.day_offset,
            sample_shifts.start_time,
            sample_shifts.end_time,
            sample_shifts.shift_type,
            'scheduled',
            sample_shifts.notes,
            'admin@scandac.com',
            team_uuid
        )
        ON CONFLICT DO NOTHING;
    END LOOP;
END $$;