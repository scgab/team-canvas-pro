-- Create the existing users in Supabase Auth and link them to profiles
-- Since we can't directly insert into auth.users, we'll create a function to handle user creation

-- First, let's create the profiles table if it doesn't exist with the exact structure needed
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  full_name text,
  avatar_url text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles
CREATE POLICY "Users can view all profiles" 
ON public.profiles 
FOR SELECT 
USING (true);

CREATE POLICY "Users can update their own profile" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "System can insert profiles" 
ON public.profiles 
FOR INSERT 
WITH CHECK (true);

-- Create or replace the handle_new_user function to work with our existing data
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
  );
  RETURN NEW;
END;
$function$;

-- Create the trigger if it doesn't exist
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create a function to migrate existing users (this will be called from the app)
CREATE OR REPLACE FUNCTION public.setup_demo_users()
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
DECLARE
  hna_user_id uuid;
  myh_user_id uuid;
BEGIN
  -- Note: We can't directly insert into auth.users from SQL
  -- This function will be used to check if users exist
  
  -- Check if users already exist in profiles
  SELECT user_id INTO hna_user_id FROM profiles WHERE email = 'hna@scandac.com';
  SELECT user_id INTO myh_user_id FROM profiles WHERE email = 'myh@scandac.com';
  
  IF hna_user_id IS NULL OR myh_user_id IS NULL THEN
    RETURN 'Users need to be created via Auth API';
  ELSE
    RETURN 'Users already exist';
  END IF;
END;
$function$;