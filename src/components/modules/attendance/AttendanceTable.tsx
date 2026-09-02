'use client';

interface AttendanceTableProps {
  attendance: any[];
}

export default function AttendanceTable({ attendance }: AttendanceTableProps) {
  // We filter out records here as a final safety measure before rendering
  const visibleAttendance = attendance.filter(a => a.worker_name && a.worker_name.trim() !== '');

  return (
    <div className="bg-white dark:bg-slate-900 shadow-sm rounded-2xl overflow-hidden w-full border border-gray-100 dark:border-slate-800">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm table-fixed border-collapse">
          <thead className="bg-gray-50 dark:bg-slate-800/90 border-b border-gray-200 dark:border-slate-700 text-gray-700 dark:text-slate-300 font-bold uppercase text-[11px] tracking-wider">
            <tr>
              <th className="w-[120px] p-4 truncate">Worker</th>
              <th className="w-[90px] p-4 truncate">Status</th>
              <th className="w-[100px] p-4 truncate">Date</th>
              <th className="w-[120px] p-4 hidden md:table-cell truncate">Recorded By</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-slate-800 text-gray-900 dark:text-slate-200">
            {visibleAttendance.length > 0 ? visibleAttendance.map((a) => (
              <tr key={a.id} className="hover:bg-gray-50/80 dark:hover:bg-slate-800/60 transition-colors">
                <td className="p-4 font-semibold text-gray-900 dark:text-slate-100 truncate" title={a.worker_name}>
                  {a.worker_name}
                </td>
                
                <td className="p-4">
                  <span className={`px-2.5 py-1 rounded-lg text-[10px] md:text-xs font-bold whitespace-nowrap ${
                    a.status?.toLowerCase() === 'present' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800' : 
                    a.status?.toLowerCase() === 'late' ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300 border border-amber-200 dark:border-amber-800' : 
                    'bg-rose-100 text-rose-800 dark:bg-rose-950/80 dark:text-rose-300 border border-rose-200 dark:border-rose-800'
                  }`}>
                    {a.status}
                  </span>
                </td>
                
                <td className="p-4 truncate text-xs text-gray-600 dark:text-slate-400">
                  {new Date(a.date).toLocaleDateString()}
                </td>
                
                <td className="p-4 text-xs text-gray-500 dark:text-slate-400 hidden md:table-cell truncate" title={a.recorded_by_name}>
                  {a.recorded_by_name}
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan={4} className="p-8 text-center text-gray-500 dark:text-slate-400 font-medium">
                  No active attendance records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}