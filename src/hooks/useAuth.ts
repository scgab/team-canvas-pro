import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signInWithCredentials = async (email: string, password: string) => {
    try {
      setLoading(true);
      
      console.log('🔐 Attempting login with:', email);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      console.log('🔐 Supabase auth response:', { data, error });
      
      if (error) {
        console.error('🔐 Login failed:', error.message);
        return { 
          error: { 
            message: error.message 
          } 
        };
      }
      
      console.log('🔐 Login successful:', data.user?.email);
      return { error: null };
      
    } catch (error) {
      console.error('🔐 Authentication error:', error);
      return { 
        error: { 
          message: 'Authentication failed. Please try again.' 
        } 
      };
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, fullName?: string) => {
    try {
      setLoading(true);
      
      const redirectUrl = `${window.location.origin}/`;
      
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            full_name: fullName
          }
        }
      });
      
      if (error) {
        return { 
          error: { 
            message: error.message 
          } 
        };
      }
      
      return { error: null };
      
    } catch (error) {
      console.error('Sign up error:', error);
      return { 
        error: { 
          message: 'Sign up failed. Please try again.' 
        } 
      };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        return { 
          error: { 
            message: error.message 
          } 
        };
      }
      
      return { error: null };
      
    } catch (error) {
      console.error('Sign out error:', error);
      return { 
        error: { 
          message: 'Failed to sign out. Please try again.' 
        } 
      };
    }
  };

  return {
    user,
    session,
    loading,
    signInWithCredentials,
    signUp,
    signOut
  };
};