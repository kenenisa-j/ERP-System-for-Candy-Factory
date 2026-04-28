'use client';
import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { User, Session } from '@supabase/supabase-js';

export interface UserProfile extends User {
  role?: string;
  full_name?: string;
  must_change_password?: boolean;
  is_active?: boolean;
}

export const useAuth = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  
  const isMounted = useRef(true);
  const isProcessing = useRef(false);

  useEffect(() => {
    isMounted.current = true;

    const fetchProfile = async (userId: string) => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('role, full_name, must_change_password, is_active')
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
      if (isProcessing.current) return;
      isProcessing.current = true;

      try {
        if (session?.user) {
          const profile = await fetchProfile(session.user.id);
          
          // CRITICAL: Ensure we merge session.user with the DB profile correctly
          // This makes 'is_active' available as user.is_active
          const fullUser: UserProfile = {
            ...session.user,
            ...(profile || {}),
          };

          if (isMounted.current) {
            setUser(fullUser);
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