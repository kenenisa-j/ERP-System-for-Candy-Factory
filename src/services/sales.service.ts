import { supabase } from '@/lib/supabaseClient';

export const salesService = {
  async getAll(startDate?: string, endDate?: string) {
    // 1. Fetch sales with date filtering
    // Order by 'date' as per your business logic
    let query = supabase
      .from('sales')
      .select('*')
      .order('date', { ascending: false });

    // Apply date range filters
    if (startDate && endDate) {
      query = query.gte('date', startDate).lte('date', endDate);
    }
    
    const { data: sales, error: salesError } = await query;
    
    if (salesError) throw salesError;
    if (!sales || sales.length === 0) return [];

    // 2. Extract unique user profiles
    const userIds = [...new Set([
      ...sales.map(s => s.created_by),
      ...sales.map(s => s.updated_by)
    ].filter(Boolean))];

    const { data: profiles, error: profError } = await supabase
      .from('profiles')
      .select('id, full_name')
      .in('id', userIds);

    if (profError) throw profError;

    // 3. Manually map profiles to sales
    return sales.map(sale => ({
      ...sale,
      created_by_profile: profiles?.find(p => p.id === sale.created_by) || null,
      updated_by_profile: profiles?.find(p => p.id === sale.updated_by) || null
    }));
  },

  async create(sale: any, userId: string) {
    const { data, error } = await supabase
      .from('sales')
      .insert([{ ...sale, created_by: userId }])
      .select();
    if (error) throw error;
    return data;
  },

  async update(id: string, sale: any, userId: string) {
    const { data, error } = await supabase
      .from('sales')
      .update({ ...sale, updated_by: userId })
      .eq('id', id)
      .select();
    if (error) throw error;
    return data;
  }
};