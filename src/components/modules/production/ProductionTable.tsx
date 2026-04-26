'use client';

interface ProductionTableProps {
  data: any[];
  onEdit: (item: any) => void;
  canEdit: boolean;
}

export default function ProductionTable({ data, onEdit, canEdit }: ProductionTableProps) {
  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <table className="w-full text-left text-sm">
        <thead className="bg-gray-100 border-b">
          <tr>
            <th className="p-4">Product Name</th>
            <th className="p-4">Quantity</th>
            <th className="p-4">Date</th>
            <th className="p-4">Created By</th>
            <th className="p-4">Updated By</th>
            <th className="p-4">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {data.length > 0 ? (
            data.map((p) => (
              <tr key={p.id} className="hover:bg-gray-50">
                <td className="p-4 font-medium">{p.product_name}</td>
                <td className="p-4 font-bold">{p.quantity}</td>
                <td className="p-4">{new Date(p.date).toLocaleDateString()}</td>
                <td className="p-4 text-xs text-gray-500">
                  {p.created_by_profile?.full_name || 'Staff'}
                </td>
                <td className="p-4 text-xs text-gray-500">
                  {p.updated_by_profile?.full_name || '-'}
                </td>
                <td className="p-4">
                  {canEdit && (
                    <button 
                      onClick={() => onEdit(p)} 
                      className="text-purple-900 font-medium hover:underline"
                    >
                      Edit
                    </button>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={6} className="p-4 text-center text-gray-500">
                No records found for this period.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}