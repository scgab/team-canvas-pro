-- Fix the migration by only creating what doesn't exist
-- Update the handle_new_user function to work with existing data
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
BEGIN
  INSERT INTO public.profiles (user_id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', 
             CASE 
               WHEN NEW.email = 'hna@scandac.com' THEN 'HNA User'
               WHEN NEW.email = 'myh@scandac.com' THEN 'MYH User'
               ELSE NEW.email
             END),
    NEW.raw_user_meta_data ->> 'avatar_url'
  )
  ON CONFLICT (email) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    avatar_url = EXCLUDED.avatar_url,
    updated_at = now();
  RETURN NEW;
END;
$function$;

-- Create the trigger if it doesn't exist
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();