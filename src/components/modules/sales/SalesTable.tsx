'use client';

interface SalesTableProps {
  sales: any[];
  onEdit: (sale: any) => void;
  canEdit: (sale: any) => boolean;
}

export default function SalesTable({ sales, onEdit, canEdit }: SalesTableProps) {
  return (
    <div className="bg-white shadow rounded-lg overflow-hidden w-full">
      <div className="overflow-x-auto">
        {/* Added 'table-fixed' to force columns to respect defined widths */}
        <table className="w-full text-left text-sm table-fixed border-collapse">
          <thead className="bg-gray-100 border-b">
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
          <tbody className="divide-y divide-gray-200">
            {sales.length > 0 ? (
              sales.map((s) => (
                <tr key={s.id} className="hover:bg-gray-50">
                  <td className="p-3 md:p-4 font-medium truncate" title={s.customer_name}>
                    {s.customer_name}
                  </td>
                  <td className="p-3 md:p-4 truncate">{s.quantity}</td>
                  <td className="p-3 md:p-4 hidden sm:table-cell truncate">{s.price}</td>
                  <td className="p-3 md:p-4 font-bold truncate">{s.total} Birr</td>
                  <td className="hidden md:table-cell p-4 truncate text-xs">
                    {new Date(s.date).toLocaleDateString()}
                  </td>
                  <td className="hidden lg:table-cell p-4 text-xs text-gray-500 truncate">
                    {s.created_by_profile?.full_name || 'Staff'}
                  </td>
                  <td className="hidden lg:table-cell p-4 text-xs text-gray-500 truncate">
                    {s.updated_by_profile?.full_name || '-'}
                  </td>
                  <td className="p-3 md:p-4">
                    <div className="flex items-center gap-2">
                      {canEdit(s) && (
                        <button 
                          onClick={() => onEdit(s)} 
                          className="text-blue-700 font-bold hover:underline text-xs"
                        >
                          Edit
                        </button>
                      )}
                      {s.receipt_url ? (
                        <a 
                          href={s.receipt_url} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="text-green-700 font-bold hover:underline text-xs"
                        >
                          View
                        </a>
                      ) : (
                        <span className="text-gray-300 text-[10px]">No Receipt</span>
                      )}
                    </div>
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
    </div>
  );
}