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

  useEffect(() => {
    checkAuthAndLoadProfile();
    setupRealtimeSubscription();
  }, []);

  const checkAuthAndLoadProfile = async () => {
    try {
      setLoading(true);
      
      // Get current authenticated user
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError || !user) {
        console.error('Authentication error:', authError);
        setLoading(false);
        return;
      }

      console.log('🔍 Loading profile for authenticated user:', user.email);
      
      // Try to load existing profile
      const { data: profileData, error: profileError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('email', user.email)
        .single();

      if (profileData) {
        console.log('✅ Profile loaded successfully:', profileData);
        setUserProfile(profileData);
        localStorage.setItem('userProfile', JSON.stringify(profileData));
      } else if (profileError?.code === 'PGRST116') {
        // No profile found, create one
        console.log('📝 No profile found, creating default profile');
        await createDefaultProfile(user);
      } else {
        console.error('Profile loading error:', profileError);
        await createDefaultProfile(user);
      }
    } catch (error) {
      console.error('Error in checkAuthAndLoadProfile:', error);
      setLoading(false);
    }
  };

  const createDefaultProfile = async (user: any) => {
    try {
      console.log('Creating default profile for:', user.email);
      
      const defaultProfile = {
        email: user.email,
        full_name: user.user_metadata?.full_name || user.email.split('@')[0].replace(/[._]/g, ' '),
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
        console.log('✅ Default profile created:', data);
        setUserProfile(data);
        localStorage.setItem('userProfile', JSON.stringify(data));
      } else {
        console.error('Error creating default profile:', error);
        // Set fallback profile for display
        setUserProfile({
          id: 'temp',
          email: user.email,
          full_name: user.user_metadata?.full_name || user.email.split('@')[0].replace(/[._]/g, ' '),
          competence_level: 'Beginner',
          department: 'General'
        });
      }
    } catch (error) {
      console.error('Error creating default profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const setupRealtimeSubscription = () => {
    const subscription = supabase
      .channel('profile_changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'user_profiles'
        },
        (payload) => {
          console.log('Profile updated via realtime:', payload);
          if (payload.new && (payload.new as any).email === userProfile?.email) {
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
    checkAuthAndLoadProfile();
  };

  return { userProfile, loading, refreshProfile };
};