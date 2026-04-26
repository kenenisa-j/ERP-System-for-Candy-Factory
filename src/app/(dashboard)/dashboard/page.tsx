'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { dashboardService } from '@/services/dashboard.service';
import DashboardCards from '@/components/modules/dashboard/DashboardCards';
import MetricsStrip from '@/components/modules/dashboard/MetricsStrip';
import ActivityStream from '@/components/modules/dashboard/ActivityStream';
import RecentRecordsTable from '@/components/modules/dashboard/RecentRecordsTable';
import MonthSelector from '@/components/modules/dashboard/MonthSelector';
import ExportReportButton from '@/components/modules/dashboard/ExportReportButton';

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [month, setMonth] = useState(new Date().getMonth());
  const [year, setYear] = useState(new Date().getFullYear());

  useEffect(() => {
    if (!authLoading && user && user.role !== 'superadmin' && user.role !== 'owner') {
      router.push('/');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user && (user.role === 'superadmin' || user.role === 'owner')) {
      fetchDashboardData();
    }
  }, [month, year, user]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const result = await dashboardService.getDashboardData(month, year);
      setData(result);
    } catch (error) {
      console.error("Dashboard fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        <div className="animate-pulse">Loading Intelligence Center...</div>
      </div>
    );
  }
  if (!user || !data) return null;

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* HEADER SECTION: Responsive Layout */}
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 md:p-6 rounded-2xl shadow-sm border border-gray-100">
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-gray-800 tracking-tight">Intelligence Center</h1>
            <p className="text-xs md:text-sm text-gray-500">
              {new Date(year, month).toLocaleString('default', { month: 'long', year: 'numeric' })} Overview
            </p>
          </div>
          <div className="flex flex-row items-center gap-3 w-full sm:w-auto">
            <div className="flex-1 sm:flex-none">
              <MonthSelector month={month} year={year} onChange={(m, y) => { setMonth(m); setYear(y); }} />
            </div>
            <ExportReportButton month={month} year={year} />
          </div>
        </header>

        {/* KPI CARDS: Responsive Grid */}
        <DashboardCards data={{ ...data.summary, trends: data.summary.trends }} />

        {/* OPERATIONAL ALERTS */}
        <MetricsStrip data={data.operational} />

        {/* DETAILED FEED: Responsive Two-Column Layout */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <div className="space-y-6">
            <div className="bg-white p-4 md:p-6 rounded-2xl shadow-sm border border-gray-100">
              <RecentRecordsTable 
                title="Latest Sales" 
                records={data.recentRecords.sales || []} 
                type="sale" 
              />
            </div>
            <div className="bg-white p-4 md:p-6 rounded-2xl shadow-sm border border-gray-100">
              <RecentRecordsTable 
                title="Latest Expenses" 
                records={data.recentRecords.expenses || []} 
                type="expense" 
              />
            </div>
          </div>
          
          {/* ACTIVITY FEED */}
          <div className="bg-white p-4 md:p-6 rounded-2xl shadow-sm border border-gray-100">
            <ActivityStream logs={data.recentActivity || []} />
          </div>
        </div>
        
      </div>
    </div>
  );
}