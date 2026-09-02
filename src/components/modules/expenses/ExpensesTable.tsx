'use client';

interface ExpensesTableProps {
  expenses: any[];
  onEdit: (expense: any) => void;
  canEdit: (expense: any) => boolean;
}

export default function ExpensesTable({ expenses, onEdit, canEdit }: ExpensesTableProps) {
  return (
    <div className="bg-white dark:bg-slate-900 shadow-sm rounded-2xl overflow-hidden w-full border border-gray-100 dark:border-slate-800">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm table-fixed border-collapse">
          <thead className="bg-gray-50 dark:bg-slate-800/90 border-b border-gray-200 dark:border-slate-700 text-gray-700 dark:text-slate-300 font-bold uppercase text-[11px] tracking-wider">
            <tr>
              <th className="w-[120px] p-4 truncate">Description</th>
              <th className="w-[90px] p-4 truncate">Amount</th>
              <th className="w-[100px] p-4 hidden sm:table-cell truncate">Category</th>
              <th className="w-[90px] p-4 hidden md:table-cell truncate">Date</th>
              <th className="w-[100px] p-4 hidden lg:table-cell truncate">Created By</th>
              <th className="w-[120px] p-4 truncate">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-slate-800 text-gray-900 dark:text-slate-200">
            {expenses.length > 0 ? expenses.map((exp) => (
              <tr key={exp.id} className="hover:bg-gray-50/80 dark:hover:bg-slate-800/60 transition-colors">
                <td className="p-4 font-semibold text-gray-900 dark:text-slate-100 truncate" title={exp.description}>{exp.description}</td>
                <td className="p-4 font-extrabold text-rose-600 dark:text-rose-400 truncate">{exp.amount} Birr</td>
                <td className="p-4 hidden sm:table-cell truncate text-xs text-gray-600 dark:text-slate-400">{exp.category}</td>
                <td className="p-4 hidden md:table-cell truncate text-xs text-gray-600 dark:text-slate-400">{new Date(exp.date).toLocaleDateString()}</td>
                <td className="p-4 text-xs text-gray-500 dark:text-slate-400 hidden lg:table-cell truncate">
                  {exp.created_by_profile?.full_name || 'Staff'}
                </td>
                <td className="p-4 flex flex-col sm:flex-row gap-2">
                  {canEdit(exp) && (
                    <button 
                      onClick={() => onEdit(exp)} 
                      className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline text-xs"
                    >
                      Edit
                    </button>
                  )}
                  {exp.receipt_url ? (
                    <a 
                      href={exp.receipt_url} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-emerald-600 dark:text-emerald-400 font-bold hover:underline text-xs"
                    >
                      View
                    </a>
                  ) : (
                    <span className="text-gray-400 dark:text-slate-500 text-[10px] italic">No Receipt</span>
                  )}
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan={6} className="p-8 text-center text-gray-500 dark:text-slate-400 font-medium">
                  No expenses logged for this period.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}