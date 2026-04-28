'use client';
import { useEffect, useState, useCallback } from 'react';
import { attendanceService } from '@/services/attendance.service';
import AttendanceForm from '@/components/modules/attendance/AttendanceForm';
import AttendanceTable from '@/components/modules/attendance/AttendanceTable';
import Modal from '@/components/ui/Modal';
import { useAuth } from '@/hooks/useAuth';
import Loading from '@/components/shared/Loading';
import { useTableFilters } from '@/hooks/useTableFilters';
import DateFilters from '@/components/shared/DateFilter';
import ModuleSummaryHeader from '@/components/shared/ModuleSummaryHeader';

export default function AttendancePage() {
  // 1. ALL HOOKS CALLED UNCONDITIONALLY
  const [attendance, setAttendance] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  
  const { user, loading: authLoading } = useAuth(); // Assume you have authLoading
  const { range, setRange, startDate, endDate } = useTableFilters();

  // 2. LOGIC
  const isAdmin = user?.role === 'superadmin' || user?.role === 'owner';
  const isAccountDisabled = user && user.is_active === false && !isAdmin;

  const getCountByStatus = (status: string) => 
    attendance.filter(a => a.status?.toLowerCase() === status.toLowerCase()).length;

  const fetchData = useCallback(async () => {
    if (!user || (user.is_active === false && !isAdmin)) return;

    try {
      setLoading(true);
      setFetchError(null);

      let finalStart = startDate;
      let finalEnd = endDate;

      if (!isAdmin) {
        const today = new Date().toISOString().split('T')[0];
        finalStart = today;
        finalEnd = today;
      }

      const data = await attendanceService.getAll(
        finalStart, 
        finalEnd, 
        user?.id, 
        isAdmin
      );
      
      setAttendance(data || []);
    } catch (err: any) {
      console.error("Attendance fetch error:", err);
      setFetchError(err.message || "Failed to load attendance records");
    } finally {
      setLoading(false);
    }
  }, [startDate, endDate, isAdmin, user]);

  useEffect(() => {
    if (!authLoading && user) fetchData();
  }, [fetchData, authLoading, user]);

  // 3. RENDER LOGIC (No early return with JSX that breaks hook order)
  if (authLoading || (loading && attendance.length === 0 && !isAccountDisabled)) return <Loading />;

  // Render "Account Disabled" view if needed
  if (isAccountDisabled) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-red-100 text-center max-w-md w-full">
          <div className="text-4xl mb-4">🚫</div>
          <h2 className="text-xl font-bold text-gray-900">Account Disabled</h2>
          <p className="text-gray-500 mt-2">Your account is currently disabled. Please contact your administrator to regain access.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <ModuleSummaryHeader 
          title="Attendance Records" 
          isAdmin={isAdmin}
          stats={[
            { label: "Present", value: getCountByStatus('Present') },
            { label: "Absent", value: getCountByStatus('Absent') },
            { label: "Late", value: getCountByStatus('Late') }
          ]}
          filterComponent={isAdmin ? <DateFilters range={range} onChange={setRange} /> : null}
        />

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-4 md:p-6 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h3 className="font-bold text-gray-700">Daily Logs</h3>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="w-full sm:w-auto bg-blue-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-blue-600 transition shadow-md hover:shadow-lg"
            >
              + Log Attendance
            </button>
          </div>

          {fetchError && (
            <div className="bg-red-50 text-red-600 p-4 m-4 rounded-lg border border-red-200 text-sm">
              Error: {fetchError}.
            </div>
          )}

          <div className="overflow-x-auto w-full">
            {attendance.length > 0 ? (
              <AttendanceTable attendance={attendance} />
            ) : (
              <div className="p-10 text-center text-gray-500">
                No attendance records for this period.
              </div>
            )}
          </div>
        </div>

        {isModalOpen && (
          <Modal onClose={() => setIsModalOpen(false)}>
            <AttendanceForm 
              onSuccess={() => { setIsModalOpen(false); fetchData(); }} 
            />
          </Modal>
        )}
      </div>
    </div>
  ); 
}