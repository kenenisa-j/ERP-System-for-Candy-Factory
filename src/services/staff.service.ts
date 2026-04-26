import { supabase } from '@/lib/supabaseClient';

export const staffService = {
  /**
   * Creates a new staff user in Auth and their profile.
   */
  async create(staffData: { email: string; password: string; full_name: string }) {
    // 1. Create User in Auth
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: staffData.email,
      password: staffData.password,
      email_confirm: true,
    });

    if (authError) throw authError;

    // 2. Create Profile in 'profiles' table
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: authData.user!.id,
        full_name: staffData.full_name,
        role: 'staff',
        must_change_password: true, // TRIGGER: Forces redirect on first login
        is_active: true,
      })
      .select()
      .single();

    if (profileError) throw profileError;
    return profile;
  },

  /**
   * Disables or enables a staff member's account.
   */
  async toggleStatus(id: string, is_active: boolean) {
    const { data, error } = await supabase
      .from('profiles')
      .update({ is_active })
      .eq('id', id);

    if (error) throw error;
    return data;
  },

  /**
   * Forces a staff member to change their password on next login.
   */
  async resetPassword(id: string) {
    const { data, error } = await supabase
      .from('profiles')
      .update({ must_change_password: true })
      .eq('id', id);

    if (error) throw error;
    return data;
  }
};