'use client';

interface AttendanceTableProps {
  attendance: any[];
}

export default function AttendanceTable({ attendance }: AttendanceTableProps) {
  // We filter out records here as a final safety measure before rendering
  const visibleAttendance = attendance.filter(a => a.worker_name && a.worker_name.trim() !== '');

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden w-full">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm table-fixed border-collapse">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="w-[120px] p-4 truncate">Worker</th>
              <th className="w-[90px] p-4 truncate">Status</th>
              <th className="w-[100px] p-4 truncate">Date</th>
              <th className="w-[120px] p-4 hidden md:table-cell truncate">Recorded By</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {visibleAttendance.length > 0 ? visibleAttendance.map((a) => (
              <tr key={a.id} className="hover:bg-gray-50">
                <td className="p-4 font-medium truncate" title={a.worker_name}>
                  {a.worker_name}
                </td>
                
                <td className="p-4">
                  <span className={`px-2 py-1 rounded text-[10px] md:text-xs font-semibold whitespace-nowrap ${
                    a.status === 'Present' ? 'bg-green-100 text-green-700' : 
                    a.status === 'Late' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {a.status}
                  </span>
                </td>
                
                <td className="p-4 truncate">
                  {new Date(a.date).toLocaleDateString()}
                </td>
                
                <td className="p-4 text-xs text-gray-500 hidden md:table-cell truncate" title={a.recorded_by_name}>
                  {a.recorded_by_name}
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan={4} className="p-8 text-center text-gray-500">
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