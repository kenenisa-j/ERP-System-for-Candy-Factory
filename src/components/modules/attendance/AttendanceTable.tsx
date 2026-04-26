'use client';

interface AttendanceTableProps {
  attendance: any[];
}

export default function AttendanceTable({ attendance }: AttendanceTableProps) {
  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <table className="w-full text-left text-sm">
        <thead className="bg-gray-100 border-b">
          <tr>
            <th className="p-4">Worker</th>
            <th className="p-4">Status</th>
            <th className="p-4">Date</th>
            <th className="p-4">Recorded By</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {attendance.length > 0 ? attendance.map((a) => (
            <tr key={a.id} className="hover:bg-gray-50">
              <td className="p-4 font-medium">{a.workers?.full_name || 'N/A'}</td>
              <td className="p-4">
                <span className={`px-2 py-1 rounded text-xs font-semibold ${
                  a.status === 'Present' ? 'bg-green-100 text-green-700' : 
                  a.status === 'Late' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                }`}>
                  {a.status}
                </span>
              </td>
              <td className="p-4">{new Date(a.date).toLocaleDateString()}</td>
              {/* Added safe access for profile name */}
              <td className="p-4 text-xs text-gray-500">
                {a.profiles?.full_name || 'System'}
              </td>
            </tr>
          )) : (
            <tr>
              <td colSpan={4} className="p-8 text-center text-gray-500">
                No attendance records for this period.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}