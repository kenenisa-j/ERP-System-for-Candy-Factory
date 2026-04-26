'use client';
import { payrollService, PayrollRecord } from '@/services/payroll.service';

export default function PayrollTable({ 
  payroll, 
  onEdit 
}: { 
  payroll: PayrollRecord[], 
  onEdit: (record: PayrollRecord) => void 
}) {
  
  const handleMarkPaid = async (id: string) => {
    try {
      await payrollService.markAsPaid(id);
      // Force a reload or update the state in your parent page
      window.location.reload(); 
    } catch (err) {
      console.error("Failed to mark as paid:", err);
      alert("Could not update status.");
    }
  };

  return (
    <div className="bg-white border rounded-lg overflow-hidden shadow-sm">
      <table className="w-full text-left text-sm">
        <thead className="bg-gray-50 text-gray-600 uppercase border-b">
          <tr>
            <th className="p-4">Worker</th>
            <th className="p-4">Base</th>
            <th className="p-4">OT Hours</th>
            <th className="p-4">Bonus</th>
            <th className="p-4">Ded.</th>
            <th className="p-4 font-bold text-gray-900">Net Pay</th>
            <th className="p-4">Status</th>
            <th className="p-4">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {payroll.map((p) => (
            <tr key={p.id} className="hover:bg-gray-50 transition-colors">
              <td className="p-4 font-medium text-gray-900">{p.workers?.full_name || 'N/A'}</td>
              <td className="p-4 text-gray-600">${Number(p.base_salary || 0).toLocaleString()}</td>
              <td className="p-4 text-gray-600">{p.overtime_hours || 0} hrs</td>
              <td className="p-4 text-gray-600">${Number(p.bonus || 0).toLocaleString()}</td>
              <td className="p-4 text-gray-600">${Number(p.deductions || 0).toLocaleString()}</td>
              <td className="p-4 font-bold text-green-700">${Number(p.net_pay || 0).toLocaleString()}</td>
              <td className="p-4">
                <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
                  p.status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                }`}>
                  {p.status}
                </span>
              </td>
              <td className="p-4 flex gap-3 items-center">
                {p.status === 'pending' ? (
                  <>
                    <button 
                      onClick={() => onEdit(p)}
                      className="text-blue-600 hover:text-blue-800 font-semibold"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleMarkPaid(p.id)}
                      className="text-green-600 hover:text-green-800 font-semibold"
                    >
                      Mark Paid
                    </button>
                  </>
                ) : (
                  <span className="text-gray-400 text-xs italic">Locked</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}