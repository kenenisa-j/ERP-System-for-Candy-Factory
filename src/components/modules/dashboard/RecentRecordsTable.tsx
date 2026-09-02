'use client';

export default function RecentRecordsTable({ title, records, type }: { title: string, records: any[], type: 'sale' | 'expense' }) {
  // Defensive check: ensure records is an array
  const safeRecords = Array.isArray(records) ? records : [];

  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-slate-800">
      <h2 className="font-bold text-gray-800 dark:text-slate-100 mb-4">{title}</h2>
      
      {safeRecords.length > 0 ? (
        <table className="w-full text-sm">
          <tbody className="divide-y divide-gray-100 dark:divide-slate-800">
            {safeRecords.map((r, i) => (
              <tr key={r.id || i}>
                <td className="py-3 text-gray-600 dark:text-slate-300 truncate max-w-[150px]">
                  {type === 'sale' ? (r.customer_name || 'Unnamed Customer') : (r.description || 'No description')}
                </td>
                <td className="py-3 text-right font-bold text-gray-900 dark:text-slate-100">
                  {Number(type === 'sale' ? r.total : r.amount || 0).toLocaleString()} Birr
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-gray-400 dark:text-slate-500 text-sm italic">No recent {type} records found.</p>
      )}
    </div>
  );
}