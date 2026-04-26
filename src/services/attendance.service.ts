import { supabase } from '@/lib/supabaseClient';

export const attendanceService = {
  /**
   * Fetches attendance records within a date range.
   */
  async getAll(startDate?: string, endDate?: string) {
    // Explicitly using the relationship names to resolve the ambiguity error (PGRST201)
    let query = supabase
      .from('attendance')
      .select(`
        id,
        status,
        date,
        recorded_by,
        worker_id,
        workers!fk_attendance_worker(full_name),
        profiles!fk_attendance_recorded_by(full_name)
      `)
      .order('date', { ascending: false });

    // Apply date range filters to the 'date' column
    if (startDate && endDate) {
      query = query.gte('date', startDate).lte('date', endDate);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error("Attendance Service (getAll) Error:", error);
      throw error;
    }
    return data || [];
  },

  /**
   * Creates a new attendance record.
   */
  async create(data: { worker_id: string; date: string; status: string }, userId: string) {
    const { data: result, error } = await supabase
      .from('attendance')
      .insert([{ 
        worker_id: data.worker_id,
        date: data.date,
        status: data.status,
        recorded_by: userId 
      }])
      .select();
      
    if (error) {
      console.error("Attendance Service (create) Error:", error);
      throw error;
    }
    return result;
  },

  /**
   * Updates an existing attendance record.
   */
  async update(id: string, data: any) {
    const { data: result, error } = await supabase
      .from('attendance')
      .update(data)
      .eq('id', id)
      .select();
      
    if (error) {
      console.error("Attendance Service (update) Error:", error);
      throw error;
    }
    return result;
  }
};