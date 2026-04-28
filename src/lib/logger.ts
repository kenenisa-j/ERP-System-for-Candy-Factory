import { supabase } from '@/lib/supabaseClient';

export const logActivity = async (action: string, module: string, record_name: string) => {
  try {
    // 1. Get the current authenticated user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // 2. Fetch their full name from the profiles table
    const { data: profile } = await supabase
      .from('profiles')
      .select('full_name')
      .eq('id', user.id)
      .single();

    // 3. Insert into the activity_log table
    await supabase.from('activity_log').insert({
      user_name: profile?.full_name || 'Admin',
      action,
      module,
      record_name,
      created_at: new Date().toISOString()
    });
  } catch (err) {
    console.error("Activity logging failed:", err);
  }
};