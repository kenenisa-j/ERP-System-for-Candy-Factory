// src/services/report.service.ts
import { supabase } from '@/lib/supabaseClient';
import { 
  MonthlyReportData, 
  ProductionRecord, 
  AttendanceRecord 
} from '@/types/report.types';
import { 
  calculateNetProfit, 
  sumByField, 
  aggregateAttendance, 
  aggregateProduction 
} from '@/utils/reportCalculations';

export const reportService = {
  async getMonthlyReport(month: number, year: number): Promise<MonthlyReportData> {
    // 1. Calculate precise date range
    const startOfMonth = `${year}-${String(month + 1).padStart(2, '0')}-01`;
    
    const nextMonth = month + 1 >= 12 ? 0 : month + 1;
    const nextYear = month + 1 >= 12 ? year + 1 : year;
    const firstOfNextMonth = `${nextYear}-${String(nextMonth + 1).padStart(2, '0')}-01`;

    // 2. Fetch data
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
    
    const totalPayroll = payrollData
      .filter((p: any) => p.status === 'paid')
      .reduce((sum, r) => sum + (Number(r.net_pay || 0)), 0);
    
    const totalProductionUnits = sumByField(productionData, 'quantity');

    // Aggregate Data and explicitly cast to the expected Types
    const aggregatedProduction = aggregateProduction(productionData) as ProductionRecord[];
    const aggregatedAttendance = aggregateAttendance(attendanceData) as AttendanceRecord[];

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
      // Now correctly typed as ProductionRecord[]
      production: aggregatedProduction,
      payroll: payrollData.map((p: any) => ({
        worker_name: p.workers?.full_name || 'Unknown Worker',
        net_pay: p.net_pay,
        status: p.status,
        paid_at: p.paid_at
      })),
      // Now correctly typed as AttendanceRecord[]
      attendance: aggregatedAttendance
    };
  }
};