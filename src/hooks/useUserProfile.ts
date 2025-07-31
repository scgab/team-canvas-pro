import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  first_name?: string;
  last_name?: string;
  date_of_birth?: string;
  age?: number;
  address_line_1?: string;
  address_line_2?: string;
  city?: string;
  postal_code?: string;
  country?: string;
  cpr_number?: string;
  phone_number?: string;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  bank_account_number?: string;
  bank_name?: string;
  tax_id?: string;
  profile_picture_url?: string;
  hire_date?: string;
  department?: string;
  job_title?: string;
  employee_id?: string;
  competence_level?: string;
  created_at?: string;
  updated_at?: string;
}

export const useUserProfile = () => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const currentUser = localStorage.getItem('currentUser');

  useEffect(() => {
    if (currentUser) {
      loadProfile();
      setupRealtimeSubscription();
    }
  }, [currentUser]);

  const loadProfile = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('email', currentUser)
        .single();

      if (data) {
        setUserProfile(data);
        localStorage.setItem('userProfile', JSON.stringify(data));
      } else {
        await createDefaultProfile();
      }
    } catch (error) {
      console.error('Error loading profile:', error);
      const cached = localStorage.getItem('userProfile');
      if (cached) {
        setUserProfile(JSON.parse(cached));
      } else {
        await createDefaultProfile();
      }
    } finally {
      setLoading(false);
    }
  };

  const createDefaultProfile = async () => {
    if (!currentUser) return;

    try {
      const defaultProfile = {
        email: currentUser,
        full_name: currentUser.split('@')[0].replace(/[._]/g, ' '),
        competence_level: 'Beginner',
        department: 'General',
        country: 'Denmark'
      };

      const { data, error } = await supabase
        .from('user_profiles')
        .insert([defaultProfile])
        .select()
        .single();

      if (data) {
        setUserProfile(data);
        localStorage.setItem('userProfile', JSON.stringify(data));
      }
    } catch (error) {
      console.error('Error creating default profile:', error);
      // Set fallback profile for display
      const fallbackProfile = {
        id: 'temp',
        email: currentUser,
        full_name: currentUser.split('@')[0].replace(/[._]/g, ' '),
        competence_level: 'Beginner',
        department: 'General'
      };
      setUserProfile(fallbackProfile);
    }
  };

  const setupRealtimeSubscription = () => {
    if (!currentUser) return;

    const subscription = supabase
      .channel('profile_changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'user_profiles',
          filter: `email=eq.${currentUser}`
        },
        (payload) => {
          console.log('Profile updated:', payload);
          if (payload.new) {
            setUserProfile(payload.new as UserProfile);
            localStorage.setItem('userProfile', JSON.stringify(payload.new));
          }
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  };

  const refreshProfile = () => {
    loadProfile();
  };

  return { userProfile, loading, refreshProfile };
};