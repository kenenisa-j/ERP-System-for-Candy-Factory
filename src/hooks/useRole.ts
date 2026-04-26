// src/hooks/useRole.ts
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';

export const useRole = () => {
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRole = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase.from('profiles')
          .select('role')
          .eq('id', user.id)
          .single();
        setRole(data?.role || null);
      }
      setLoading(false);
    };
    fetchRole();
  }, []);

  return { role, loading };
};