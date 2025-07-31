-- Create comprehensive user profiles table
CREATE TABLE public.user_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR NOT NULL UNIQUE,
  full_name VARCHAR NOT NULL,
  first_name VARCHAR,
  last_name VARCHAR,
  date_of_birth DATE,
  age INTEGER,
  address_line_1 VARCHAR,
  address_line_2 VARCHAR,
  city VARCHAR,
  postal_code VARCHAR,
  country VARCHAR DEFAULT 'Denmark',
  cpr_number VARCHAR,
  phone_number VARCHAR,
  emergency_contact_name VARCHAR,
  emergency_contact_phone VARCHAR,
  bank_account_number VARCHAR,
  bank_name VARCHAR,
  tax_id VARCHAR,
  profile_picture_url VARCHAR,
  hire_date DATE,
  department VARCHAR,
  job_title VARCHAR,
  employee_id VARCHAR,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for user access
CREATE POLICY "Users can view their own profile" 
ON public.user_profiles 
FOR SELECT 
USING (auth.email() = email);

CREATE POLICY "Users can create their own profile" 
ON public.user_profiles 
FOR INSERT 
WITH CHECK (auth.email() = email);

CREATE POLICY "Users can update their own profile" 
ON public.user_profiles 
FOR UPDATE 
USING (auth.email() = email);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_user_profiles_updated_at()
RETURNS TRIGGER AS $$
BEGIN
NEW.updated_at = now();
RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_user_profiles_updated_at
BEFORE UPDATE ON public.user_profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_user_profiles_updated_at();