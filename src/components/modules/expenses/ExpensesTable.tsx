'use client';

interface ExpensesTableProps {
  expenses: any[];
  onEdit: (expense: any) => void;
  canEdit: (expense: any) => boolean;
}

export default function ExpensesTable({ expenses, onEdit, canEdit }: ExpensesTableProps) {
  return (
    <div className="bg-white shadow rounded-lg overflow-hidden w-full">
      <div className="overflow-x-auto">
        {/* table-fixed forces column widths to be respected */}
        <table className="w-full text-left text-sm table-fixed border-collapse">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="w-[120px] p-4 font-semibold text-gray-700 truncate">Description</th>
              <th className="w-[90px] p-4 font-semibold text-gray-700 truncate">Amount</th>
              <th className="w-[100px] p-4 font-semibold text-gray-700 hidden sm:table-cell truncate">Category</th>
              <th className="w-[90px] p-4 font-semibold text-gray-700 hidden md:table-cell truncate">Date</th>
              <th className="w-[100px] p-4 font-semibold text-gray-700 hidden lg:table-cell truncate">Created By</th>
              <th className="w-[120px] p-4 font-semibold text-gray-700 truncate">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {expenses.length > 0 ? expenses.map((exp) => (
              <tr key={exp.id} className="hover:bg-gray-50">
                <td className="p-4 truncate" title={exp.description}>{exp.description}</td>
                <td className="p-4 font-bold truncate">{exp.amount} Birr</td>
                <td className="p-4 hidden sm:table-cell truncate">{exp.category}</td>
                <td className="p-4 hidden md:table-cell truncate">{new Date(exp.date).toLocaleDateString()}</td>
                <td className="p-4 text-xs text-gray-500 hidden lg:table-cell truncate">
                  {exp.created_by_profile?.full_name || 'Staff'}
                </td>
                <td className="p-4 flex flex-col sm:flex-row gap-2">
                  {canEdit(exp) && (
                    <button 
                      onClick={() => onEdit(exp)} 
                      className="text-blue-700 font-bold hover:underline text-xs"
                    >
                      Edit
                    </button>
                  )}
                  {exp.receipt_url ? (
                    <a 
                      href={exp.receipt_url} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-green-700 font-bold hover:underline text-xs"
                    >
                      View
                    </a>
                  ) : (
                    <span className="text-gray-300 text-[10px] italic">No Receipt</span>
                  )}
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan={6} className="p-8 text-center text-gray-500">
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