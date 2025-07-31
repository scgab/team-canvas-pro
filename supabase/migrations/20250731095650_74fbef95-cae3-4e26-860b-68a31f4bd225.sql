-- Add competence_level column to user_profiles table
ALTER TABLE public.user_profiles 
ADD COLUMN competence_level VARCHAR DEFAULT 'Beginner';

-- Update the updated_at trigger for user_profiles if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_trigger 
        WHERE tgname = 'update_user_profiles_updated_at_trigger'
    ) THEN
        CREATE TRIGGER update_user_profiles_updated_at_trigger
        BEFORE UPDATE ON public.user_profiles
        FOR EACH ROW
        EXECUTE FUNCTION public.update_user_profiles_updated_at();
    END IF;
END $$;