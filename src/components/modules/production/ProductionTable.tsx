'use client';

interface ProductionTableProps {
  data: any[];
  onEdit: (item: any) => void;
  canEdit: boolean;
}

export default function ProductionTable({ data, onEdit, canEdit }: ProductionTableProps) {
  return (
    <div className="bg-white dark:bg-slate-900 shadow-sm rounded-2xl overflow-hidden w-full border border-gray-100 dark:border-slate-800">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm table-fixed border-collapse">
          <thead className="bg-gray-50 dark:bg-slate-800/90 border-b border-gray-200 dark:border-slate-700 text-gray-700 dark:text-slate-300 font-bold uppercase text-[11px] tracking-wider">
            <tr>
              <th className="w-[140px] p-4 truncate">Product</th>
              <th className="w-[80px] p-4 truncate">Qty</th>
              <th className="w-[100px] p-4 hidden md:table-cell truncate">Date</th>
              <th className="w-[120px] p-4 hidden lg:table-cell truncate">Created By</th>
              <th className="w-[120px] p-4 hidden lg:table-cell truncate">Updated By</th>
              <th className="w-[80px] p-4">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-slate-800 text-gray-900 dark:text-slate-200">
            {data.length > 0 ? (
              data.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50/80 dark:hover:bg-slate-800/60 transition-colors">
                  <td className="p-4 font-semibold text-gray-900 dark:text-slate-100 truncate" title={p.product_name}>{p.product_name}</td>
                  <td className="p-4 font-extrabold text-purple-700 dark:text-purple-400 truncate">{p.quantity}</td>
                  <td className="p-4 hidden md:table-cell truncate text-xs text-gray-600 dark:text-slate-400">
                    {new Date(p.date).toLocaleDateString()}
                  </td>
                  <td className="p-4 text-xs text-gray-500 dark:text-slate-400 hidden lg:table-cell truncate">
                    {p.created_by_profile?.full_name || 'Staff'}
                  </td>
                  <td className="p-4 text-xs text-gray-500 dark:text-slate-400 hidden lg:table-cell truncate">
                    {p.updated_by_profile?.full_name || '-'}
                  </td>
                  <td className="p-4">
                    {canEdit && (
                      <button 
                        onClick={() => onEdit(p)} 
                        className="text-purple-700 dark:text-purple-400 font-bold hover:underline text-xs"
                      >
                        Edit
                      </button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="p-6 text-center text-gray-500 dark:text-slate-400 font-medium">
                  No records found for this period.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}