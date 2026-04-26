import { PayrollRecord } from '@/services/payroll.service';

export default function PayrollSummary({ payroll }: { payroll: PayrollRecord[] }) {
  // Calculate aggregate values
  const totalCost = payroll.reduce((acc, p) => acc + (Number(p.net_pay) || 0), 0);
  const totalOvertime = payroll.reduce((acc, p) => acc + (Number(p.overtime_amount) || 0), 0);
  
  const paidCount = payroll.filter(p => p.status === 'paid').length;
  const pendingCount = payroll.filter(p => p.status === 'pending').length;

  const cards = [
    { label: 'Total Payroll Cost', value: `$${totalCost.toLocaleString()}`, color: 'text-gray-900' },
    { label: 'Overtime Cost', value: `$${totalOvertime.toLocaleString()}`, color: 'text-blue-600' },
    { label: 'Paid Payments', value: paidCount, color: 'text-green-600' },
    { label: 'Pending Payments', value: pendingCount, color: 'text-yellow-600' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      {cards.map((card, idx) => (
        <div key={idx} className="bg-white p-5 border rounded-lg shadow-sm">
          <p className="text-xs font-semibold uppercase text-gray-500 mb-1">{card.label}</p>
          <p className={`text-2xl font-bold ${card.color}`}>{card.value}</p>
        </div>
      ))}
    </div>
  );
}