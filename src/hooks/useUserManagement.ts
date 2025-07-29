import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
// Removed dependency on old userDatabase

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

  // Register new user or update existing (adapted for our auth system)
  const registerUser = (user: any) => {
    const now = new Date().toISOString();
    const existingUserIndex = registeredUsers.findIndex(u => u.id === user.id);
    
    if (existingUserIndex >= 0) {
      // Update existing user's last login
      const updatedUsers = [...registeredUsers];
      updatedUsers[existingUserIndex] = {
        ...updatedUsers[existingUserIndex],
        last_login: now,
        // Update profile info in case it changed
        full_name: user.name || user.user_metadata?.full_name || updatedUsers[existingUserIndex].full_name,
        avatar_url: user.avatar_url || user.user_metadata?.avatar_url || updatedUsers[existingUserIndex].avatar_url
      };
      saveUsers(updatedUsers);
    } else {
      // Register new user
      const newUser: RegisteredUser = {
        id: user.id,
        email: user.email || '',
        full_name: user.name || user.user_metadata?.full_name || null,
        avatar_url: user.avatar_url || user.user_metadata?.avatar_url || null,
        registered_at: now,
        last_login: now
      };
      
      const updatedUsers = [...registeredUsers, newUser];
      saveUsers(updatedUsers);
      
      // Show welcome toast for new users (first time only)
      toast({
        title: "🎉 Welcome to the Team!",
        description: `Welcome back ${newUser.full_name || newUser.email}! Let's manage our way to +$100M together!`,
        duration: 5000
      });
      
      // Log successful login
      console.log('=== User Login Successful ===');
      console.log('User ID:', newUser.id);
      console.log('Email:', newUser.email);
      console.log('Name:', newUser.full_name);
      console.log('Login time:', newUser.last_login);
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