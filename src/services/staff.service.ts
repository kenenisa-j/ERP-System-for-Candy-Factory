import { supabase } from '@/lib/supabaseClient';

export const staffService = {
  async toggleStatus(id: string, is_active: boolean) {
    const { data, error } = await supabase
      .from('profiles')
      .update({ is_active })
      .eq('id', id)
      .select();
    if (error) throw error;
    return data;
  },

  async resetPasswordFlag(id: string) {
    const { data, error } = await supabase
      .from('profiles')
      .update({ must_change_password: true })
      .eq('id', id)
      .select();
    if (error) throw error;
    return data;
  }
};