'use client';

interface SalesTableProps {
  sales: any[];
  onEdit: (sale: any) => void;
  canEdit: (sale: any) => boolean;
}

export default function SalesTable({ sales, onEdit, canEdit }: SalesTableProps) {
  return (
    <div className="bg-white dark:bg-slate-900 shadow-sm rounded-2xl overflow-hidden w-full border border-gray-100 dark:border-slate-800">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm table-fixed border-collapse">
          <thead className="bg-gray-50 dark:bg-slate-800/90 border-b border-gray-200 dark:border-slate-700 text-gray-700 dark:text-slate-300 font-bold uppercase text-[11px] tracking-wider">
            <tr>
              <th className="w-[120px] p-3 md:p-4">Customer</th>
              <th className="w-[60px] p-3 md:p-4">Qty</th>
              <th className="w-[80px] p-3 md:p-4 hidden sm:table-cell">Price</th>
              <th className="w-[100px] p-3 md:p-4">Total</th>
              <th className="w-[100px] hidden md:table-cell p-4">Date</th>
              <th className="w-[100px] hidden lg:table-cell p-4">Created By</th>
              <th className="w-[100px] hidden lg:table-cell p-4">Updated By</th>
              <th className="w-[120px] p-3 md:p-4">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-slate-800 text-gray-900 dark:text-slate-200">
            {sales.length > 0 ? (
              sales.map((s) => (
                <tr key={s.id} className="hover:bg-gray-50/80 dark:hover:bg-slate-800/60 transition-colors">
                  <td className="p-3 md:p-4 font-semibold text-gray-900 dark:text-slate-100 truncate" title={s.customer_name}>
                    {s.customer_name}
                  </td>
                  <td className="p-3 md:p-4 truncate">{s.quantity}</td>
                  <td className="p-3 md:p-4 hidden sm:table-cell truncate">{s.price} Birr</td>
                  <td className="p-3 md:p-4 font-extrabold text-indigo-600 dark:text-indigo-400 truncate">{s.total} Birr</td>
                  <td className="hidden md:table-cell p-4 truncate text-xs text-gray-600 dark:text-slate-400">
                    {new Date(s.date).toLocaleDateString()}
                  </td>
                  <td className="hidden lg:table-cell p-4 text-xs text-gray-500 dark:text-slate-400 truncate">
                    {s.created_by_profile?.full_name || 'Staff'}
                  </td>
                  <td className="hidden lg:table-cell p-4 text-xs text-gray-500 dark:text-slate-400 truncate">
                    {s.updated_by_profile?.full_name || '-'}
                  </td>
                  <td className="p-3 md:p-4">
                    <div className="flex items-center gap-2">
                      {canEdit(s) && (
                        <button 
                          onClick={() => onEdit(s)} 
                          className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline text-xs"
                        >
                          Edit
                        </button>
                      )}
                      {s.receipt_url ? (
                        <a 
                          href={s.receipt_url} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="text-emerald-600 dark:text-emerald-400 font-bold hover:underline text-xs"
                        >
                          View
                        </a>
                      ) : (
                        <span className="text-gray-400 dark:text-slate-500 text-[10px]">No Receipt</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={8} className="p-6 text-center text-gray-500 dark:text-slate-400 font-medium">No sales found for this period.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}