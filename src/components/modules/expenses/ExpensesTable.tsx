'use client';

interface ExpensesTableProps {
  expenses: any[];
  onEdit: (expense: any) => void;
  canEdit: (expense: any) => boolean;
}

export default function ExpensesTable({ expenses, onEdit, canEdit }: ExpensesTableProps) {
  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <table className="w-full text-left text-sm">
        <thead className="bg-gray-100 border-b">
          <tr>
            <th className="p-4 font-semibold text-gray-700">Description</th>
            <th className="p-4 font-semibold text-gray-700">Amount (Birr)</th>
            <th className="p-4 font-semibold text-gray-700">Category</th>
            <th className="p-4 font-semibold text-gray-700">Date</th>
            <th className="p-4 font-semibold text-gray-700">Created By</th>
            <th className="p-4 font-semibold text-gray-700">Updated By</th>
            <th className="p-4 font-semibold text-gray-700">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {expenses.length > 0 ? expenses.map((exp) => (
            <tr key={exp.id} className="hover:bg-gray-50">
              <td className="p-4">{exp.description}</td>
              <td className="p-4">{exp.amount} Birr</td>
              <td className="p-4">{exp.category}</td>
              <td className="p-4">{new Date(exp.date).toLocaleDateString()}</td>
              <td className="p-4 text-xs text-gray-500">{exp.created_by_profile?.full_name || 'Unknown'}</td>
              <td className="p-4 text-xs text-gray-500 italic">{exp.updated_by_profile?.full_name || '-'}</td>
              <td className="p-4 space-x-3">
                {canEdit(exp) && (
                  <button 
                    onClick={() => onEdit(exp)} 
                    className="text-blue-900 font-medium hover:underline"
                  >
                    Edit
                  </button>
                )}
                {exp.receipt_url ? (
                  <a href={exp.receipt_url} target="_blank" rel="noopener noreferrer" className="text-green-700 font-medium hover:underline">View Receipt</a>
                ) : (
                  <span className="text-gray-400 text-xs italic">No Receipt</span>
                )}
              </td>
            </tr>
          )) : (
            <tr><td colSpan={7} className="p-8 text-center text-gray-500">No expenses logged for this period.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}