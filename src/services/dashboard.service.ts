import { supabase } from '@/lib/supabaseClient';

export const dashboardService = {
  async getDashboardData(month: number, year: number) {
    // 1. Define Date Ranges
    const currentStart = new Date(year, month, 1).toISOString();
    const currentEnd = new Date(year, month + 1, 0).toISOString();
    
    // Calculate Previous Month dates for Trend calculation
    const prevMonth = month === 0 ? 11 : month - 1;
    const prevYear = month === 0 ? year - 1 : year;
    const prevStart = new Date(prevYear, prevMonth, 1).toISOString();
    const prevEnd = new Date(prevYear, prevMonth + 1, 0).toISOString();

    // 2. Fetch everything in parallel
    const [
      currSales, prevSales,
      currExp, prevExp,
      currPayroll, // Added
      currProd,
      attendance,
      pendingPayroll, // Added
      recentLogs,
      recentSales,
      recentExpenses
    ] = await Promise.all([
      supabase.from('sales').select('total').gte('date', currentStart).lte('date', currentEnd),
      supabase.from('sales').select('total').gte('date', prevStart).lte('date', prevEnd),
      supabase.from('expenses').select('amount').gte('date', currentStart).lte('date', currentEnd),
      supabase.from('expenses').select('amount').gte('date', prevStart).lte('date', prevEnd),
      // Fetch paid payroll for the current month to calculate true expenses
      supabase.from('payroll').select('net_pay').eq('month', `${year}-${String(month + 1).padStart(2, '0')}-01`).eq('status', 'paid'),
      supabase.from('production').select('quantity').gte('date', currentStart).lte('date', currentEnd),
      supabase.from('attendance').select('id').eq('date', new Date().toISOString().split('T')[0]),
      supabase.from('payroll').select('id').eq('month', `${year}-${String(month + 1).padStart(2, '0')}-01`).eq('status', 'pending'),
      supabase.from('audit_logs').select('*').order('created_at', { ascending: false }).limit(10),
      supabase.from('sales').select('customer_name, total').order('created_at', { ascending: false }).limit(5),
      supabase.from('expenses').select('description, amount').order('created_at', { ascending: false }).limit(5)
    ]);

    // 3. Helper: Calculate Trends
    const calcTrend = (curr: number, prev: number) => {
      if (prev === 0) return curr > 0 ? "+100%" : "0%";
      const diff = ((curr - prev) / prev) * 100;
      return `${diff >= 0 ? '+' : ''}${diff.toFixed(1)}%`;
    };

    // 4. Aggregates
    const cSales = currSales.data?.reduce((s, r) => s + Number(r.total), 0) || 0;
    const pSales = prevSales.data?.reduce((s, r) => s + Number(r.total), 0) || 0;
    
    const cExp = currExp.data?.reduce((s, r) => s + Number(r.amount), 0) || 0;
    const pExp = prevExp.data?.reduce((s, r) => s + Number(r.amount), 0) || 0;
    
    // Add Paid Payroll to total expenses
    const cPayroll = currPayroll.data?.reduce((s, r) => s + Number(r.net_pay), 0) || 0;
    const totalExpenses = cExp + cPayroll;

    const totalProd = currProd.data?.reduce((s, r) => s + r.quantity, 0) || 0;

    return {
      summary: {
        totalSales: cSales,
        totalExpenses: totalExpenses,
        netProfit: cSales - totalExpenses,
        totalProduction: totalProd,
        trends: {
          sales: calcTrend(cSales, pSales),
          expenses: calcTrend(cExp + cPayroll, pExp) // Simplified trend for demo
        }
      },
      operational: {
        attendanceToday: attendance.data?.length || 0,
        pendingPayroll: pendingPayroll.data?.length || 0,
        activeExpenses: currExp.data?.length || 0,
        salesOrders: currSales.data?.length || 0
      },
      recentActivity: recentLogs.data || [],
      recentRecords: {
        sales: recentSales.data || [],
        expenses: recentExpenses.data || []
      }
    };
  }
};