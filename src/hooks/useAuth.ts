import { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useUserManagement } from './useUserManagement';

// Future restriction: Add email allowlist when needed
// const ALLOWED_EMAILS = [
//   'HNA@SCANDAC.COM',
//   'MYH@SCANDAC.COM'
// ];

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const { registerUser } = useUserManagement();

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state change:', event, session?.user?.email);
        
        // Register/update user in local management system
        if (session?.user) {
          registerUser(session.user);
          await createUserProfile(session.user);
        }
        
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    // Get initial session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        registerUser(session.user);
        await createUserProfile(session.user);
      }
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Create or update user profile in our database
  const createUserProfile = async (user: User) => {
    try {
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (!existingProfile) {
        // Create new profile for first-time user
        const { error } = await supabase
          .from('profiles')
          .insert({
            user_id: user.id,
            email: user.email,
            full_name: user.user_metadata?.full_name || user.user_metadata?.name,
            avatar_url: user.user_metadata?.avatar_url
          });

        if (error) {
          console.error('Error creating user profile:', error);
        } else {
          console.log('User profile created successfully for:', user.email);
        }
      }
    } catch (error) {
      console.error('Error checking/creating user profile:', error);
    }
  };

  // Google Signup - Primary authentication method
  const signUpWithGoogle = async () => {
    // Try multiple redirect URI patterns for better compatibility
    const baseUrl = window.location.origin;
    const redirectUrls = [
      `${baseUrl}/auth/google/callback`,
      `${baseUrl}/auth/callback`, 
      `${baseUrl}/callback`,
      `${baseUrl}/`
    ];
    
    console.log('=== Google Signup Debug Info ===');
    console.log('Base URL:', baseUrl);
    console.log('Trying redirect URLs:', redirectUrls);
    console.log('User Agent:', navigator.userAgent);
    
    // Use the most common Supabase redirect pattern
    const redirectUrl = `${baseUrl}/`;
    
    console.log('Selected redirect URL:', redirectUrl);
    console.log('Starting Google OAuth signup flow...');
    
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: redirectUrl,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
          hd: undefined // Allow any domain
        }
      }
    });
    
    if (error) {
      console.error('=== Google OAuth Error ===');
      console.error('Error code:', error.message);
      console.error('Full error:', error);
      
      // Provide specific error guidance
      if (error.message.includes('redirect_uri_mismatch')) {
        console.error('REDIRECT URI MISMATCH - Configure these URLs in Google Console:');
        redirectUrls.forEach(url => console.error(`- ${url}`));
      }
    } else {
      console.log('OAuth request sent successfully');
    }
    
    return { error };
  };


  const signInWithEmail = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    return { error };
  };

  const signUpWithEmail = async (email: string, password: string) => {
    const redirectUrl = `${window.location.origin}/`;
    
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl
      }
    });
    return { error };
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    return { error };
  };

  return {
    user,
    session,
    loading,
    signUpWithGoogle,
    signInWithEmail,
    signUpWithEmail,
    signOut
  };
};