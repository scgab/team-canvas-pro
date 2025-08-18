-- Create table for storing user Google OAuth tokens
CREATE TABLE public.user_google_tokens (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  access_token TEXT NOT NULL,
  refresh_token TEXT NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT user_google_tokens_user_id_unique UNIQUE (user_id)
);

-- Enable Row Level Security
ALTER TABLE public.user_google_tokens ENABLE ROW LEVEL SECURITY;

-- Create policies for user access
CREATE POLICY "Users can view their own Google tokens" 
ON public.user_google_tokens 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own Google tokens" 
ON public.user_google_tokens 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own Google tokens" 
ON public.user_google_tokens 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own Google tokens" 
ON public.user_google_tokens 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_user_google_tokens_updated_at
BEFORE UPDATE ON public.user_google_tokens
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();