'use client';

import SummaryCard from './SummaryCard';

interface DashboardCardsProps {
  data: {
    totalSales: number;
    totalExpenses: number;
    netProfit: number;
    totalProduction: number;
    trends: {
      sales: string;
      expenses: string;
    };
  };
}

export default function DashboardCards({ data }: DashboardCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6">
      {/* Revenue Card */}
      <SummaryCard 
        title="Total Revenue" 
        value={data.totalSales.toLocaleString()} 
        unit="Birr" 
        colorClass="bg-emerald-600" 
        trend={data.trends.sales} 
      />

      {/* Spending Card */}
      <SummaryCard 
        title="Monthly Spending" 
        value={data.totalExpenses.toLocaleString()} 
        unit="Birr" 
        colorClass="bg-rose-600" 
        trend={data.trends.expenses} 
      />

      {/* Net Profit Card */}
      <SummaryCard 
        title="Net Profit" 
        value={data.netProfit.toLocaleString()} 
        unit="Birr" 
        colorClass="bg-indigo-600" 
      />

      {/* Production Card */}
      <SummaryCard 
        title="Units Built" 
        value={data.totalProduction.toLocaleString()} 
        unit="Units" 
        colorClass="bg-violet-600" 
      />
    </div>
  );
}