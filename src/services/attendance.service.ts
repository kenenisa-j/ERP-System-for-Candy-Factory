import { supabase } from '@/lib/supabaseClient';

export const attendanceService = {
  /**
   * Fetches attendance records with explicitly linked foreign keys.
   */
  async getAll(startDate?: string, endDate?: string, userId?: string, isAdmin?: boolean) {
    // We use the !inner join syntax to discard records at the DATABASE level.
    // By adding .eq('workers.is_active', true), we ensure that only records 
    // linked to active workers are retrieved.
    let query = supabase
      .from('attendance')
      .select(`
        id,
        status,
        date,
        recorded_by,
        worker_id,
        workers:fk_attendance_worker!inner(full_name, is_active),
        profiles:fk_attendance_recorded_by(full_name)
      `)
      .eq('workers.is_active', true) 
      .order('date', { ascending: false });

    if (!isAdmin && userId) {
      query = query.eq('recorded_by', userId);
    }

    if (startDate && endDate) {
      query = query.gte('date', startDate).lte('date', endDate);
    }
    
    const { data, error } = await query;
    
    if (error) throw error;

    // Since !inner + .eq filters out inactive records, 
    // we can now safely map the data without needing complex filters.
    return (data || []).map(record => ({
      ...record,
      worker_name: record.workers ? (record.workers as any).full_name : 'Unknown Worker',
      recorded_by_name: record.profiles ? (record.profiles as any).full_name : 'System'
    }));
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
      
    if (error) throw error;
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
      
    if (error) throw error;
    return result;
  }
};