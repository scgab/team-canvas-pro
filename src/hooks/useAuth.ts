import { useState, useEffect } from 'react';
import { authenticateUser, getUserById, User } from '@/utils/userDatabase';

interface AuthUser extends User {
  user_metadata?: {
    full_name?: string;
    name?: string;
    avatar_url?: string;
  };
}

interface AuthSession {
  user: AuthUser;
  access_token: string;
  expires_at: number;
}

export const useAuth = () => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [session, setSession] = useState<AuthSession | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session on app load
    checkExistingSession();
  }, []);

  const checkExistingSession = () => {
    try {
      const storedSession = localStorage.getItem('auth_session');
      if (storedSession) {
        const parsedSession = JSON.parse(storedSession);
        
        // Check if session is still valid
        if (parsedSession.expires_at > Date.now()) {
          const userData = getUserById(parsedSession.user.id);
          if (userData) {
            const authUser: AuthUser = {
              ...userData,
              user_metadata: {
                full_name: userData.name,
                name: userData.name,
                avatar_url: userData.avatar_url
              }
            };
            
            setUser(authUser);
            setSession(parsedSession);
          } else {
            // User not found, clear invalid session
            localStorage.removeItem('auth_session');
          }
        } else {
          // Session expired, clear it
          localStorage.removeItem('auth_session');
        }
      }
    } catch (error) {
      console.error('Error checking existing session:', error);
      localStorage.removeItem('auth_session');
    } finally {
      setLoading(false);
    }
  };

  const createSession = (userData: User) => {
    const authUser: AuthUser = {
      ...userData,
      user_metadata: {
        full_name: userData.name,
        name: userData.name,
        avatar_url: userData.avatar_url
      }
    };

    const session: AuthSession = {
      user: authUser,
      access_token: `auth_token_${userData.id}_${Date.now()}`,
      expires_at: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
    };

    // Store session in localStorage
    localStorage.setItem('auth_session', JSON.stringify(session));
    
    setUser(authUser);
    setSession(session);
    
    return session;
  };

  const signInWithCredentials = async (emailOrUsername: string, password: string) => {
    try {
      setLoading(true);
      
      // Authenticate user
      const userData = authenticateUser(emailOrUsername, password);
      
      if (!userData) {
        return { 
          error: { 
            message: 'Invalid credentials. Please check your email/username and password.' 
          } 
        };
      }

      // Create session
      createSession(userData);
      
      console.log('User authenticated successfully:', userData.email);
      
      return { error: null };
      
    } catch (error) {
      console.error('Authentication error:', error);
      return { 
        error: { 
          message: 'Authentication failed. Please try again.' 
        } 
      };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      // Clear stored session
      localStorage.removeItem('auth_session');
      
      // Clear state
      setUser(null);
      setSession(null);
      
      console.log('User signed out successfully');
      
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
    signOut
  };
};