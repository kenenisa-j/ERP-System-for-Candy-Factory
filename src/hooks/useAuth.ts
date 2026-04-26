import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { User, Session } from '@supabase/supabase-js';

export interface UserProfile extends User {
  role?: string;
  full_name?: string;
  must_change_password?: boolean; // Added this field
  is_active?: boolean;           // Added this field
}

export const useAuth = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Use a ref to track component mount status
  const isMounted = useRef(true);
  // Use a ref to prevent overlapping auth change calls
  const isProcessing = useRef(false);

  useEffect(() => {
    isMounted.current = true;

    const fetchProfile = async (userId: string) => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('role, full_name, must_change_password, is_active') // Updated selection
          .eq('id', userId)
          .maybeSingle();

        if (error) throw error;
        return data;
      } catch (err) {
        console.error("Error fetching profile:", err);
        return null;
      }
    };

    const handleAuthChange = async (session: Session | null) => {
      // Prevent concurrent processing if already running
      if (isProcessing.current) return;
      isProcessing.current = true;

      try {
        if (session?.user) {
          const profile = await fetchProfile(session.user.id);
          if (isMounted.current) {
            setUser({ ...session.user, ...profile });
          }
        } else {
          if (isMounted.current) {
            setUser(null);
          }
        }
      } finally {
        if (isMounted.current) {
          setLoading(false);
        }
        isProcessing.current = false;
      }
    };

    // Initial session check
    supabase.auth.getSession().then(({ data: { session } }) => {
      handleAuthChange(session);
    });

    // Listener for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      handleAuthChange(session);
    });

    return () => {
      isMounted.current = false;
      subscription.unsubscribe();
    };
  }, []);

  return { user, loading };
};