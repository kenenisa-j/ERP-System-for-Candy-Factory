import { supabase } from '@/lib/supabaseClient';

export const dashboardService = {
  async getDashboardData(month: number, year: number) {
    const now = new Date();
    const isCurrentMonth = month === now.getMonth() && year === now.getFullYear();
    const todayStr = now.toISOString().split('T')[0];

    const currentStart = new Date(year, month, 1).toISOString();
    const currentEnd = new Date(year, month + 1, 0, 23, 59, 59).toISOString();
    
    const prevMonth = month === 0 ? 11 : month - 1;
    const prevYear = month === 0 ? year - 1 : year;
    const prevStart = new Date(prevYear, prevMonth, 1).toISOString();
    const prevEnd = new Date(prevYear, prevMonth + 1, 0, 23, 59, 59).toISOString();

    const [
      currSales, prevSales,
      currExp, prevExp,
      currPayroll,
      currProd,
      attendance,
      pendingPayroll,
      // FETCHING FROM NEW activity_log TABLE
      activityLogs,
      recentSales, 
      recentExpenses
    ] = await Promise.all([
      supabase.from('sales').select('total').gte('date', currentStart).lte('date', currentEnd),
      supabase.from('sales').select('total').gte('date', prevStart).lte('date', prevEnd),
      supabase.from('expenses').select('amount').gte('date', currentStart).lte('date', currentEnd),
      supabase.from('expenses').select('amount').gte('date', prevStart).lte('date', prevEnd),
      supabase.from('payroll').select('net_pay').eq('month', `${year}-${String(month + 1).padStart(2, '0')}-01`).eq('status', 'paid'),
      supabase.from('production').select('quantity').gte('date', currentStart).lte('date', currentEnd),
      
      isCurrentMonth 
        ? supabase.from('attendance').select('id').eq('date', todayStr)
        : Promise.resolve({ data: [], error: null }),
        
      supabase.from('payroll').select('id').eq('month', `${year}-${String(month + 1).padStart(2, '0')}-01`).eq('status', 'pending'),
      
      // RECENT ACTIVITY: Fetching from the new activity_log table
      supabase.from('activity_log').select('*').order('created_at', { ascending: false }).limit(10),
      
      // RECENT RECORDS
      supabase.from('sales').select('customer_name, total, date').gte('date', currentStart).lte('date', currentEnd).order('date', { ascending: false }).limit(5),
      supabase.from('expenses').select('description, amount, date').gte('date', currentStart).lte('date', currentEnd).order('date', { ascending: false }).limit(5)
    ]);

    const calcTrend = (curr: number, prev: number) => {
      if (prev === 0) return curr > 0 ? "+100%" : "0%";
      const diff = ((curr - prev) / prev) * 100;
      return `${diff >= 0 ? '+' : ''}${diff.toFixed(1)}%`;
    };

    const cSales = currSales.data?.reduce((s, r) => s + Number(r.total), 0) || 0;
    const pSales = prevSales.data?.reduce((s, r) => s + Number(r.total), 0) || 0;
    const cExp = currExp.data?.reduce((s, r) => s + Number(r.amount), 0) || 0;
    const pExp = prevExp.data?.reduce((s, r) => s + Number(r.amount), 0) || 0;
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
          expenses: calcTrend(cExp + cPayroll, pExp)
        }
      },
      operational: {
        attendanceToday: attendance.data?.length || 0,
        pendingPayroll: pendingPayroll.data?.length || 0,
        activeExpenses: currExp.data?.length || 0,
        salesOrders: currSales.data?.length || 0
      },
      recentActivity: activityLogs.data || [],
      recentRecords: {
        sales: recentSales.data || [],
        expenses: recentExpenses.data || []
      }
    };
  }
};