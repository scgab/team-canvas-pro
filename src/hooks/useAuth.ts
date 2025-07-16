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

  // Google Signup with 403 error handling
  const signUpWithGoogle = async () => {
    const baseUrl = window.location.origin;
    const redirectUrl = `${baseUrl}/`;
    
    console.log('=== Google Signup Debug Info ===');
    console.log('Base URL:', baseUrl);
    console.log('Redirect URL:', redirectUrl);
    
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl,
          queryParams: {
            access_type: 'offline',
            prompt: 'select_account', // Force account selection
            hd: undefined // Allow any domain
          }
        }
      });
      
      if (error) {
        console.error('=== Google OAuth Error ===');
        console.error('Error message:', error.message);
        console.error('Full error:', error);
        
        // Handle specific Google errors
        if (error.message.includes('403') || error.message.includes('access_denied')) {
          throw new Error('GOOGLE_CONSENT_SCREEN_ERROR');
        } else if (error.message.includes('redirect_uri_mismatch')) {
          throw new Error('REDIRECT_URI_MISMATCH');
        } else if (error.message.includes('unauthorized_client')) {
          throw new Error('UNAUTHORIZED_CLIENT');
        } else {
          throw error;
        }
      }
      
      return { error: null };
      
    } catch (error: any) {
      console.error('OAuth signup error:', error);
      return { error };
    }
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