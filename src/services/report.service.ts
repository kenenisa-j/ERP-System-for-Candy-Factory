// src/services/report.service.ts
import { supabase } from '@/lib/supabaseClient';
import { MonthlyReportData } from '@/types/report.types';
import { calculateNetProfit, sumByField } from '@/utils/reportCalculations';

export const reportService = {
  async getMonthlyReport(month: number, year: number): Promise<MonthlyReportData> {
    // 1. Calculate precise date range
    const startOfMonth = `${year}-${String(month + 1).padStart(2, '0')}-01`;
    
    // Calculate the 1st of the next month to ensure proper 'less than' filtering
    const nextMonth = month + 1 >= 12 ? 0 : month + 1;
    const nextYear = month + 1 >= 12 ? year + 1 : year;
    const firstOfNextMonth = `${nextYear}-${String(nextMonth + 1).padStart(2, '0')}-01`;

    // 2. Fetch data (Corrected to use 'date' column for all)
    // Note: 'payroll' uses 'month' column, which is stored as YYYY-MM-DD (1st of month)
    const [sales, expenses, production, payroll, attendance] = await Promise.all([
      supabase.from('sales').select('*').gte('date', startOfMonth).lt('date', firstOfNextMonth),
      supabase.from('expenses').select('*').gte('date', startOfMonth).lt('date', firstOfNextMonth),
      supabase.from('production').select('*').gte('date', startOfMonth).lt('date', firstOfNextMonth),
      supabase.from('payroll').select('*, workers:worker_id(full_name)').eq('month', startOfMonth),
      supabase.from('attendance').select('*, workers:worker_id(full_name)').gte('date', startOfMonth).lt('date', firstOfNextMonth)
    ]);

    const salesData = sales.data || [];
    const expensesData = expenses.data || [];
    const productionData = production.data || [];
    const payrollData = payroll.data || [];
    const attendanceData = attendance.data || [];

    // 3. Process Calculations
    const totalSales = sumByField(salesData, 'total');
    const totalExpenses = sumByField(expensesData, 'amount');
    
    // Payroll: Only sum 'paid' entries for the report
    const totalPayroll = payrollData
      .filter((p: any) => p.status === 'paid')
      .reduce((sum, r) => sum + (Number(r.net_pay || 0)), 0);
    
    const totalProductionUnits = sumByField(productionData, 'quantity');

    // 4. Return unified object
    return {
      summary: {
        totalSales,
        totalExpenses,
        totalPayroll,
        totalProductionUnits,
        totalProductionRecords: productionData.length,
        netProfit: calculateNetProfit(totalSales, totalExpenses, totalPayroll)
      },
      sales: salesData.map((s: any) => ({
        customer_name: s.customer_name || 'N/A',
        quantity: s.quantity,
        total: s.total,
        date: s.date
      })),
      expenses: expensesData.map((e: any) => ({
        note: e.description || e.category,
        category: e.category,
        amount: e.amount,
        date: e.date,
        created_by: e.created_by
      })),
      production: productionData.map((p: any) => ({
        product_name: p.product_name,
        quantity: p.quantity,
        date: p.date
      })),
      payroll: payrollData.map((p: any) => ({
        // Use joined worker name if available
        worker_name: p.workers?.full_name || 'Unknown Worker',
        net_pay: p.net_pay,
        status: p.status,
        paid_at: p.paid_at
      })),
      attendance: attendanceData.map((a: any) => ({
        worker_name: a.workers?.full_name || 'Unknown Worker',
        present: a.status === 'Present' ? 1 : 0,
        absent: a.status === 'Absent' ? 1 : 0,
        late: a.status === 'Late' ? 1 : 0
      }))
    };
  }
};