'use client';

interface ProductionTableProps {
  data: any[];
  onEdit: (item: any) => void;
  canEdit: boolean;
}

export default function ProductionTable({ data, onEdit, canEdit }: ProductionTableProps) {
  return (
    <div className="bg-white shadow rounded-lg overflow-hidden w-full">
      <div className="overflow-x-auto">
        {/* Added table-fixed to maintain column integrity */}
        <table className="w-full text-left text-sm table-fixed border-collapse">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="w-[140px] p-4 truncate">Product</th>
              <th className="w-[80px] p-4 truncate">Qty</th>
              <th className="w-[100px] p-4 hidden md:table-cell truncate">Date</th>
              <th className="w-[120px] p-4 hidden lg:table-cell truncate">Created By</th>
              <th className="w-[120px] p-4 hidden lg:table-cell truncate">Updated By</th>
              <th className="w-[80px] p-4">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {data.length > 0 ? (
              data.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50">
                  <td className="p-4 font-medium truncate" title={p.product_name}>{p.product_name}</td>
                  <td className="p-4 font-bold truncate">{p.quantity}</td>
                  <td className="p-4 hidden md:table-cell truncate">
                    {new Date(p.date).toLocaleDateString()}
                  </td>
                  <td className="p-4 text-xs text-gray-500 hidden lg:table-cell truncate">
                    {p.created_by_profile?.full_name || 'Staff'}
                  </td>
                  <td className="p-4 text-xs text-gray-500 hidden lg:table-cell truncate">
                    {p.updated_by_profile?.full_name || '-'}
                  </td>
                  <td className="p-4">
                    {canEdit && (
                      <button 
                        onClick={() => onEdit(p)} 
                        className="text-purple-900 font-medium hover:underline text-xs"
                      >
                        Edit
                      </button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="p-6 text-center text-gray-500">
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