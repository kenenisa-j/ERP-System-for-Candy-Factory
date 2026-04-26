'use client';

export default function WorkersTable({ workers, onEdit }: { workers: any[], onEdit: (w: any) => void }) {
  return (
    <div className="bg-white rounded-lg shadow border border-gray-100">
      <table className="w-full text-sm text-left">
        <thead className="bg-gray-50 text-gray-700 uppercase text-xs">
          <tr>
            <th className="p-4">ID</th>
            <th className="p-4">Name</th>
            <th className="p-4">Position</th>
            <th className="p-4">Salary</th>
            <th className="p-4">Status</th>
            <th className="p-4">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {workers.map((w) => (
            <tr key={w.id}>
              <td className="p-4 font-mono text-gray-600">{w.worker_id}</td>
              <td className="p-4 font-medium">{w.full_name}</td>
              <td className="p-4">{w.position}</td>
              <td className="p-4">{w.base_salary} Birr</td>
              <td className="p-4">
                <span className={`px-2 py-1 rounded text-xs ${w.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {w.status}
                </span>
              </td>
              <td className="p-4">
                <button onClick={() => onEdit(w)} className="text-blue-600 hover:underline">Edit</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}