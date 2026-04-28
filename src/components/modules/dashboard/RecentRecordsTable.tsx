'use client';

export default function RecentRecordsTable({ title, records, type }: { title: string, records: any[], type: 'sale' | 'expense' }) {
  // Defensive check: ensure records is an array
  const safeRecords = Array.isArray(records) ? records : [];

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <h2 className="font-bold text-gray-800 mb-4">{title}</h2>
      
      {safeRecords.length > 0 ? (
        <table className="w-full text-sm">
          <tbody className="divide-y divide-gray-50">
            {safeRecords.map((r, i) => (
              <tr key={r.id || i}>
                <td className="py-3 text-gray-600 truncate max-w-[150px]">
                  {type === 'sale' ? (r.customer_name || 'Unnamed Customer') : (r.description || 'No description')}
                </td>
                <td className="py-3 text-right font-medium text-gray-800">
                  {Number(type === 'sale' ? r.total : r.amount || 0).toLocaleString()} Birr
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-gray-400 text-sm italic">No recent {type} records found.</p>
      )}
    </div>
  );
}