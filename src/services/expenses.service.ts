import { supabase } from '@/lib/supabaseClient';

export const expensesService = {
  // Fetch expenses with date range filtering, mapping profiles for both creator and updater
  async getAll(startDate?: string, endDate?: string) {
    let query = supabase
      .from('expenses')
      .select('id, description, amount, category, date, created_by, updated_by, receipt_url, created_at')
      .order('date', { ascending: false });

    if (startDate && endDate) {
      query = query.gte('date', startDate).lte('date', endDate);
    }
    
    const { data: expenses, error: expError } = await query;
    
    if (expError) throw expError;
    if (!expenses) return { expenses: [], totalAmount: 0 };

    const userIds = [...new Set([
      ...expenses.map(e => e.created_by),
      ...expenses.filter(e => e.updated_by).map(e => e.updated_by)
    ].filter(Boolean))];

    const { data: profiles, error: profError } = await supabase
      .from('profiles')
      .select('id, full_name')
      .in('id', userIds);

    if (profError) throw profError;

    const enrichedExpenses = expenses.map(expense => ({
      ...expense,
      created_by_profile: profiles?.find(p => p.id === expense.created_by) || null,
      updated_by_profile: profiles?.find(p => p.id === expense.updated_by) || null
    }));

    const totalAmount = expenses.reduce((sum, exp) => sum + (Number(exp.amount) || 0), 0);

    return { expenses: enrichedExpenses, totalAmount };
  },

  // Create new expense with detailed error reporting
  async create(expense: any) {
    const { data, error } = await supabase
      .from('expenses')
      .insert([expense])
      .select();
    
    if (error) {
      // Improved error logging to catch RLS or Constraint violations
      console.error("Supabase Error Details:", {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      });
      throw new Error(error.message || "Failed to create expense");
    }
    return data;
  },

  // Update existing expense with tracking
  async update(id: string, expense: any, userId?: string) {
    const updatePayload = userId ? { ...expense, updated_by: userId } : { ...expense };
    
    const { data, error } = await supabase
      .from('expenses')
      .update(updatePayload)
      .eq('id', id)
      .select();
    
    if (error) {
      console.error("Supabase Error Details:", {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      });
      throw new Error(error.message || "Failed to update expense");
    }
    return data;
  }
};