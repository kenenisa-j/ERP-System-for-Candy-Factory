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
      window.location.reload(); 
    } catch (err) {
      console.error("Failed to mark as paid:", err);
      alert("Could not update status.");
    }
  };

  return (
    <div className="bg-white border rounded-2xl overflow-hidden shadow-sm w-full">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm table-fixed border-collapse">
          <thead className="bg-gray-50 text-gray-600 uppercase border-b text-[10px] md:text-xs">
            <tr>
              <th className="w-[100px] md:w-[150px] p-4 truncate">Worker</th>
              <th className="w-[90px] p-4 hidden md:table-cell truncate">Base</th>
              <th className="w-[70px] p-4 hidden lg:table-cell truncate">OT</th>
              <th className="w-[80px] p-4 hidden lg:table-cell truncate">Bonus</th>
              <th className="w-[70px] p-4 hidden lg:table-cell truncate">Ded.</th>
              <th className="w-[90px] md:w-[100px] p-4 font-bold text-gray-900 truncate">Net Pay</th>
              <th className="w-[70px] md:w-[90px] p-4 truncate">Status</th>
              <th className="w-[120px] md:w-[140px] p-4 truncate">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y text-xs md:text-sm">
            {payroll.map((p) => (
              <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                <td className="p-4 font-medium text-gray-900 truncate" title={p.workers?.full_name}>
                  {p.workers?.full_name || 'N/A'}
                </td>
                <td className="p-4 text-gray-600 hidden md:table-cell truncate">
                  {Number(p.base_salary || 0).toLocaleString()} Birr
                </td>
                <td className="p-4 text-gray-600 hidden lg:table-cell truncate">
                  {p.overtime_hours || 0}
                </td>
                <td className="p-4 text-gray-600 hidden lg:table-cell truncate">
                   {Number(p.bonus || 0).toLocaleString()} Birr
                </td>
                <td className="p-4 text-gray-600 hidden lg:table-cell truncate">
                   {Number(p.deductions || 0).toLocaleString()} Birr
                </td>
                <td className="p-4 font-bold text-green-700 truncate">
                  {Number(p.net_pay || 0).toLocaleString()} Birr
                </td>
                <td className="p-4 truncate">
                  <span className={`px-2 py-1 rounded-full text-[9px] md:text-[10px] font-bold uppercase ${
                    p.status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {p.status}
                  </span>
                </td>
                <td className="p-4 flex gap-2 items-center">
                  {p.status === 'pending' ? (
                    <>
                      <button 
                        onClick={() => onEdit(p)}
                        className="text-blue-600 hover:text-blue-800 font-semibold text-[10px] md:text-xs"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => handleMarkPaid(p.id)}
                        className="text-green-600 hover:text-green-800 font-semibold text-[10px] md:text-xs"
                      >
                        Paid
                      </button>
                    </>
                  ) : (
                    <span className="text-gray-400 text-[10px] italic">Locked</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}