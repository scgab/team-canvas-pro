import { useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { useToast } from '@/hooks/use-toast';

interface RegisteredUser {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  registered_at: string;
  last_login: string;
}

export const useUserManagement = () => {
  const [registeredUsers, setRegisteredUsers] = useState<RegisteredUser[]>([]);
  const { toast } = useToast();

  // Load registered users from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('registeredUsers');
    if (stored) {
      try {
        setRegisteredUsers(JSON.parse(stored));
      } catch (error) {
        console.error('Error loading registered users:', error);
      }
    }
  }, []);

  // Save registered users to localStorage
  const saveUsers = (users: RegisteredUser[]) => {
    localStorage.setItem('registeredUsers', JSON.stringify(users));
    setRegisteredUsers(users);
  };

  // Register new user or update existing
  const registerUser = (user: User) => {
    const now = new Date().toISOString();
    const existingUserIndex = registeredUsers.findIndex(u => u.id === user.id);
    
    if (existingUserIndex >= 0) {
      // Update existing user's last login
      const updatedUsers = [...registeredUsers];
      updatedUsers[existingUserIndex] = {
        ...updatedUsers[existingUserIndex],
        last_login: now,
        // Update profile info in case it changed
        full_name: user.user_metadata?.full_name || user.user_metadata?.name || updatedUsers[existingUserIndex].full_name,
        avatar_url: user.user_metadata?.avatar_url || updatedUsers[existingUserIndex].avatar_url
      };
      saveUsers(updatedUsers);
    } else {
      // Register new user
      const newUser: RegisteredUser = {
        id: user.id,
        email: user.email || '',
        full_name: user.user_metadata?.full_name || user.user_metadata?.name || null,
        avatar_url: user.user_metadata?.avatar_url || null,
        registered_at: now,
        last_login: now
      };
      
      const updatedUsers = [...registeredUsers, newUser];
      saveUsers(updatedUsers);
      
      // Show welcome toast for new users
      toast({
        title: "Welcome!",
        description: `Welcome to the team, ${newUser.full_name || newUser.email}!`,
        duration: 5000
      });
    }
  };

  // Get user registration info
  const getUserInfo = (userId: string): RegisteredUser | null => {
    return registeredUsers.find(u => u.id === userId) || null;
  };

  // Check if user is returning user
  const isReturningUser = (userId: string): boolean => {
    const userInfo = getUserInfo(userId);
    if (!userInfo) return false;
    
    const registeredDate = new Date(userInfo.registered_at);
    const lastLoginDate = new Date(userInfo.last_login);
    
    // Consider returning if last login was more than 1 hour after registration
    return lastLoginDate.getTime() - registeredDate.getTime() > 60 * 60 * 1000;
  };

  return {
    registeredUsers,
    registerUser,
    getUserInfo,
    isReturningUser
  };
};