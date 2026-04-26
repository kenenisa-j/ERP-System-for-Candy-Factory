import { supabase } from '@/lib/supabaseClient';

export interface PayrollRecord {
  id: string;
  worker_id: string;
  month: string;
  base_salary: number;
  overtime_hours: number;
  overtime_rate: number;
  overtime_amount: number;
  bonus: number;
  deductions: number;
  net_pay: number;
  status: 'pending' | 'paid';
  paid_at?: string;
  workers?: {
    full_name: string;
  };
}

export const payrollService = {
  // Fetch payroll with the worker name joined
  async getPayrollByMonth(month: string): Promise<PayrollRecord[]> {
    const { data, error } = await supabase
      .from('payroll')
      .select(`
        *,
        workers!payroll_worker_id_fkey (
          full_name
        )
      `)
      .eq('month', `${month}-01`); 

    if (error) {
      console.error("Supabase Payroll Fetch Error:", error);
      throw new Error(error.message);
    }
    
    return (data as unknown as PayrollRecord[]) || [];
  },

  // Update payroll (OT, Bonus, Deductions)
  async updatePayroll(id: string, updates: Partial<PayrollRecord>) {
    const { data, error } = await supabase
      .from('payroll')
      .update(updates)
      .eq('id', id)
      .select();

    if (error) {
      console.error("Supabase Update Error:", error);
      throw new Error(error.message);
    }
    return data;
  },

  // Finalize payment
  async markAsPaid(id: string) {
    const { error } = await supabase
      .from('payroll')
      .update({ 
        status: 'paid', 
        paid_at: new Date().toISOString() 
      })
      .eq('id', id);

    if (error) throw new Error(error.message);
  },

  // Generate monthly payroll for all workers (Fixed to skip existing records)
  async generateMonthlyPayroll(month: string) {
    const formattedMonth = `${month}-01`;

    // 1. Get all workers
    const { data: workers, error: workerError } = await supabase
      .from('workers')
      .select('id, base_salary');
    if (workerError) throw new Error(workerError.message);

    // 2. Get existing payroll records for this month to identify who already has a record
    const { data: existingPayroll, error: payrollError } = await supabase
      .from('payroll')
      .select('worker_id')
      .eq('month', formattedMonth);
    if (payrollError) throw new Error(payrollError.message);

    const existingWorkerIds = new Set(existingPayroll?.map(p => p.worker_id) || []);

    // 3. Only create entries for workers who do NOT have a payroll record yet
    const newEntries = workers
      .filter(w => !existingWorkerIds.has(w.id))
      .map(w => ({
        worker_id: w.id,
        month: formattedMonth,
        base_salary: w.base_salary,
        overtime_hours: 0,
        overtime_rate: 0,
        bonus: 0,
        deductions: 0,
        net_pay: w.base_salary,
        status: 'pending' as const
      }));

    if (newEntries.length === 0) return; // Nothing to generate

    // 4. Insert only new records
    const { error: insertError } = await supabase
      .from('payroll')
      .insert(newEntries);

    if (insertError) {
      console.error("Insert failed:", insertError);
      throw new Error(insertError.message);
    }
  }
};