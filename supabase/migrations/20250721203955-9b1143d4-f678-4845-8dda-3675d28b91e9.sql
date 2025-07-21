-- Add start_date column to projects table for proper date range tracking
ALTER TABLE public.projects 
ADD COLUMN start_date date;

-- Update existing projects to have a start_date (set to 7 days before deadline if deadline exists, otherwise today)
UPDATE public.projects 
SET start_date = CASE 
  WHEN deadline IS NOT NULL THEN deadline - INTERVAL '7 days'
  ELSE CURRENT_DATE
END
WHERE start_date IS NULL;