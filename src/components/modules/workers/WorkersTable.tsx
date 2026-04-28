'use client';
import { workersService } from '@/services/workers.service';

export default function WorkersTable({ 
  workers, 
  onEdit, 
  onDeleted 
}: { 
  workers: any[], 
  onEdit: (w: any) => void,
  onDeleted: () => void 
}) {

  const handleDelete = async (id: string) => {
    if (window.confirm("Remove this worker from the active list?")) {
      try {
        await workersService.softDeleteWorker(id);
        onDeleted(); // Refreshes the list in the parent
      } catch (err) {
        alert("Failed to deactivate worker.");
      }
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden w-full">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm border-collapse">
          <thead className="bg-gray-50 text-gray-700 uppercase text-[10px] md:text-xs">
            <tr>
              <th className="p-4 hidden md:table-cell w-[15%]">ID</th>
              <th className="p-4 w-[30%] md:w-[25%]">Name</th>
              <th className="p-4 hidden md:table-cell w-[20%]">Position</th>
              <th className="p-4 w-[25%] md:w-[20%]">Salary</th>
              <th className="p-4 w-[15%]">Status</th>
              <th className="p-4 w-[10%]">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {workers.map((w) => (
              <tr key={w.id} className="hover:bg-gray-50 transition-colors">
                <td className="p-4 hidden md:table-cell font-mono text-gray-600 text-xs">
                  {w.worker_id}
                </td>
                <td className="p-4 font-medium text-xs md:text-sm truncate">
                  {w.full_name}
                </td>
                <td className="p-4 hidden md:table-cell text-gray-600 text-xs md:text-sm">
                  {w.position}
                </td>
                <td className="p-4 text-gray-600 text-xs md:text-sm whitespace-nowrap">
                  {Number(w.base_salary || 0).toLocaleString()} Birr
                </td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded-full text-[9px] md:text-[10px] font-bold uppercase ${
                    w.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {w.status}
                  </span>
                </td>
                <td className="p-4 flex gap-3">
                  <button 
                    onClick={() => onEdit(w)} 
                    className="text-blue-600 hover:underline font-semibold text-[11px] md:text-xs"
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => handleDelete(w.id)} 
                    className="text-red-600 hover:underline font-semibold text-[11px] md:text-xs"
                  >
                    Delete
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