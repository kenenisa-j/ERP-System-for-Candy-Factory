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

  // 1. Auth Guard
  useEffect(() => {
    if (!authLoading && user && user.role !== 'superadmin' && user.role !== 'owner') {
      router.push('/');
    }
  }, [user, authLoading, router]);

  // 2. Data Fetcher
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

  // 3. Loading & Auth States
  if (authLoading || loading) {
    return <div className="p-10 text-center text-gray-500 animate-pulse">Loading Operations Center...</div>;
  }
  if (!user || !data) return null;

  return (
    <div className="p-4 md:p-6 bg-gray-50 min-h-screen space-y-6">
      
      {/* HEADER SECTION: Executive Controls */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 tracking-tight">Intelligence Center</h1>
          <p className="text-sm text-gray-500">
            {new Date(year, month).toLocaleString('default', { month: 'long', year: 'numeric' })} Overview
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <MonthSelector month={month} year={year} onChange={(m, y) => { setMonth(m); setYear(y); }} />
          <ExportReportButton month={month} year={year} />
        </div>
      </header>

      {/* KPI CARDS: Business Health */}
      <DashboardCards data={{ ...data.summary, trends: data.summary.trends }} />

      {/* OPERATIONAL ALERTS: Metrics Strip */}
      <MetricsStrip data={data.operational} />

      {/* DETAILED FEED: Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <RecentRecordsTable 
            title="Latest Sales" 
            records={data.recentRecords.sales || []} 
            type="sale" 
          />
          <RecentRecordsTable 
            title="Latest Expenses" 
            records={data.recentRecords.expenses || []} 
            type="expense" 
          />
        </div>
        
        {/* ACTIVITY FEED: Accountability */}
        <ActivityStream logs={data.recentActivity || []} />
      </div>
      
    </div>
  );
}