'use client';

interface SalesTableProps {
  sales: any[];
  onEdit: (sale: any) => void;
  canEdit: (sale: any) => boolean;
}

export default function SalesTable({ sales, onEdit, canEdit }: SalesTableProps) {
  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <table className="w-full text-left text-sm">
        <thead className="bg-gray-100 border-b">
          <tr>
            <th className="p-4">Customer</th>
            <th className="p-4">Qty</th>
            <th className="p-4">Price</th>
            <th className="p-4">Total</th>
            <th className="p-4">Date</th>
            <th className="p-4">Created By</th>
            <th className="p-4">Updated By</th>
            <th className="p-4">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {sales.length > 0 ? (
            sales.map((s) => (
              <tr key={s.id} className="hover:bg-gray-50">
                <td className="p-4 font-medium">{s.customer_name}</td>
                <td className="p-4">{s.quantity}</td>
                <td className="p-4">{s.price} Birr</td>
                <td className="p-4 font-bold">{s.total} Birr</td>
                <td className="p-4">{new Date(s.date).toLocaleDateString()}</td>
                <td className="p-4 text-xs text-gray-500">
                  {s.created_by_profile?.full_name || 'Staff'}
                </td>
                <td className="p-4 text-xs text-gray-500">
                  {s.updated_by_profile?.full_name || '-'}
                </td>
                <td className="p-4 flex gap-3">
                  {canEdit(s) && (
                    <button onClick={() => onEdit(s)} className="text-blue-900 font-medium hover:underline">
                      Edit
                    </button>
                  )}
                  {s.receipt_url ? (
                    <a href={s.receipt_url} target="_blank" rel="noopener noreferrer" className="text-green-700 font-medium hover:underline">
                      View
                    </a>
                  ) : (
                    <span className="text-gray-400 text-xs">No Receipt</span>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={8} className="p-4 text-center text-gray-500">No sales found for this period.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}