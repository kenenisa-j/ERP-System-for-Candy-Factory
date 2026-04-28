import { supabase } from '@/lib/supabaseClient';

export const workersService = {
  async getAll() {
    const { data, error } = await supabase
      .from('workers')
      .select('*')
      .eq('is_active', true) // Only fetch active
      .order('full_name', { ascending: true });
    
    if (error) {
      console.error("Workers Service (getAll) Error:", error);
      throw error;
    }
    return data || [];
  },

  async create(worker: { full_name: string; position: string; base_salary: number }) {
    try {
      // Get count of ACTIVE workers to ensure unique IDs
      const count = await this.getWorkerCount();
      const workerId = `WRK-${new Date().getFullYear()}-${String(count + 1).padStart(3, '0')}`;

      const { data, error } = await supabase
        .from('workers')
        .insert([{ 
          full_name: worker.full_name,
          position: worker.position,
          base_salary: worker.base_salary,
          worker_id: workerId,
          status: 'active',
          is_active: true
        }])
        .select();

      if (error) {
        console.error("Supabase Insert Error:", error);
        throw error;
      }
      return data;
    } catch (err) {
      console.error("Workers Service (create) Failed:", err);
      throw err;
    }
  },

  async update(id: string, updates: any) {
    const { data, error } = await supabase
      .from('workers')
      .update(updates)
      .eq('id', id)
      .select();

    if (error) {
      console.error("Workers Service (update) Error:", error);
      throw error;
    }
    return data;
  },

  async softDeleteWorker(id: string) {
    const { error } = await supabase
      .from('workers')
      .update({ is_active: false, status: 'inactive' })
      .eq('id', id);
    
    if (error) {
      console.error("Workers Service (softDelete) Error:", error);
      throw error;
    }
    return true;
  },

  async getWorkerCount() {
    // Count only active workers to keep IDs clean
    const { count, error } = await supabase
      .from('workers')
      .select('*', { count: 'exact', head: true })
      .eq('is_active', true);
    
    if (error) {
      console.warn("Workers Service (getWorkerCount) Warning:", error);
      return 0;
    }
    return count || 0;
  }
};