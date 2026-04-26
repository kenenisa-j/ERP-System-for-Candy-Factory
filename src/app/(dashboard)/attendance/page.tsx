'use client';
import { useEffect, useState } from 'react';
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
  const [attendance, setAttendance] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const { user } = useAuth();
  
  const { range, setRange, startDate, endDate } = useTableFilters();

  const isAdmin = user?.role === 'superadmin' || user?.role === 'owner';

  const getCountByStatus = (status: string) => 
    attendance.filter(a => a.status?.toLowerCase() === status.toLowerCase()).length;

  useEffect(() => {
    fetchData();
  }, [range, isAdmin]);

  const fetchData = async () => {
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

      const data = await attendanceService.getAll(finalStart, finalEnd);
      setAttendance(data || []);
    } catch (err: any) {
      console.error("Detailed error fetching attendance:", err);
      setFetchError(err.message || "Failed to load attendance records");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading />;

  return (
    // Mobile-first padding and centered container for desktop
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
          {/* Header section with responsive stacking */}
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
            <AttendanceTable attendance={attendance} />
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