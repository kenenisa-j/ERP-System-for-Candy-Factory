'use client';

export default function WorkersTable({ workers, onEdit }: { workers: any[], onEdit: (w: any) => void }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden w-full">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm border-collapse">
          <thead className="bg-gray-50 text-gray-700 uppercase text-[10px] md:text-xs">
            <tr>
              {/* Desktop only: ID column */}
              <th className="p-4 hidden md:table-cell w-[15%]">ID</th>
              
              {/* Always visible: Name */}
              <th className="p-4 w-[30%] md:w-[25%]">Name</th>
              
              {/* Desktop only: Position column */}
              <th className="p-4 hidden md:table-cell w-[20%]">Position</th>
              
              {/* Always visible: Salary */}
              <th className="p-4 w-[25%] md:w-[20%]">Salary</th>
              
              {/* Always visible: Status */}
              <th className="p-4 w-[15%]">Status</th>
              
              {/* Always visible: Actions */}
              <th className="p-4 w-[10%]">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {workers.map((w) => (
              <tr key={w.id} className="hover:bg-gray-50 transition-colors">
                {/* ID (Desktop) */}
                <td className="p-4 hidden md:table-cell font-mono text-gray-600 text-xs">
                  {w.worker_id}
                </td>
                
                {/* Name */}
                <td className="p-4 font-medium text-xs md:text-sm truncate">
                  {w.full_name}
                </td>
                
                {/* Position (Desktop) */}
                <td className="p-4 hidden md:table-cell text-gray-600 text-xs md:text-sm">
                  {w.position}
                </td>
                
                {/* Salary */}
                <td className="p-4 text-gray-600 text-xs md:text-sm whitespace-nowrap">
                  {Number(w.base_salary || 0).toLocaleString()}
                </td>
                
                {/* Status */}
                <td className="p-4">
                  <span className={`px-2 py-1 rounded-full text-[9px] md:text-[10px] font-bold uppercase ${
                    w.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {w.status}
                  </span>
                </td>
                
                {/* Actions */}
                <td className="p-4">
                  <button 
                    onClick={() => onEdit(w)} 
                    className="text-blue-600 hover:underline font-semibold text-[11px] md:text-xs"
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}