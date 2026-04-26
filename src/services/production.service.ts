import { supabase } from '@/lib/supabaseClient';

export const productionService = {
  /**
   * Fetches production records.
   * If isAdmin is false, it forces a filter on created_by.
   */
  async getAll(startDate?: string, endDate?: string, userId?: string, isAdmin?: boolean) {
    console.log("Fetching with filters:", { isAdmin, userId, startDate, endDate });

    let query = supabase
      .from('production')
      .select('*')
      .order('date', { ascending: false });

    // Enforce business logic: Staff ONLY see their own records
    if (isAdmin !== true && userId) {
      console.log("Applying staff filter for:", userId);
      query = query.eq('created_by', userId);
    }

    // Apply date filtering
    // We split the date string to ensure we only compare YYYY-MM-DD
    if (startDate && endDate) {
      const sanitizedStart = startDate.split(' ')[0];
      const sanitizedEnd = endDate.split(' ')[0];
      
      console.log("Applying DB Filter with dates:", { sanitizedStart, sanitizedEnd });
      query = query.gte('date', sanitizedStart).lte('date', sanitizedEnd);
    }

    const { data: production, error: prodError } = await query;
    
    if (prodError) throw prodError;
    if (!production || production.length === 0) return [];

    // Fetch related profile names
    const userIds = [...new Set([
      ...production.map(p => p.created_by),
      ...production.map(p => p.updated_by)
    ].filter(Boolean))];

    const { data: profiles, error: profError } = await supabase
      .from('profiles')
      .select('id, full_name')
      .in('id', userIds);

    if (profError) throw profError;

    return production.map(item => ({
      ...item,
      created_by_profile: profiles?.find(p => p.id === item.created_by) || null,
      updated_by_profile: profiles?.find(p => p.id === item.updated_by) || null
    }));
  },

  async create(data: any, userId: string) {
    const { data: result, error } = await supabase
      .from('production')
      .insert([{ ...data, created_by: userId }])
      .select();
      
    if (error) throw error;
    return result;
  },

  async update(id: string, data: any, userId: string) {
    const { data: result, error } = await supabase
      .from('production')
      .update({ ...data, updated_by: userId })
      .eq('id', id)
      .select();
      
    if (error) throw error;
    return result;
  }
};