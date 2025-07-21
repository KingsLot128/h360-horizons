import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/SupabaseAuthContext';

export function useUserProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      setError(null);
      
      if (!user) {
        setProfile(null);
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('user_profiles')
          .select('display_name, total_points, level, rank, role, is_admin')
          .eq('user_id', user.id)
          .single();

        if (error) {
            if (error.code === 'PGRST116') {
                setProfile(null);
            } else {
                throw error;
            }
        } else if (data) {
          setProfile({ ...data, email: user.email });
        }
      } catch (err) {
        console.error('Error fetching user profile:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (supabase) {
      fetchProfile();
    } else {
      setLoading(false);
      setError("Supabase client not initialized.");
    }
  }, [user]);

  return { profile, loading, error };
}