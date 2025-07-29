-- Check and add missing columns to calendar_events table
ALTER TABLE calendar_events ADD COLUMN IF NOT EXISTS end_time TIME;

-- Verify the table structure to see all columns
SELECT column_name, data_type, is_nullable, column_default 
FROM information_schema.columns 
WHERE table_name = 'calendar_events' 
ORDER BY ordinal_position;