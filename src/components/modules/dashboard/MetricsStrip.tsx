'use client';

interface MetricsStripProps {
  data: { 
    attendanceToday: number; 
    pendingPayroll: number; 
    activeExpenses: number; 
    salesOrders: number 
  };
}

export default function MetricsStrip({ data }: MetricsStripProps) {
  const items = [
    { 
      label: 'Attendance', 
      value: data.attendanceToday, 
      unit: 'Present',
      isUrgent: false // Can be expanded to check against total employees
    },
    { 
      label: 'Payroll', 
      value: data.pendingPayroll, 
      unit: 'Pending',
      isUrgent: data.pendingPayroll > 0 // Highlight if action is needed
    },
    { 
      label: 'Expenses', 
      value: data.activeExpenses, 
      unit: 'Records',
      isUrgent: false 
    },
    { 
      label: 'Sales', 
      value: data.salesOrders, 
      unit: 'Orders',
      isUrgent: false 
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 my-6">
      {items.map((item) => (
        <div 
          key={item.label} 
          className={`bg-white p-4 rounded-xl shadow-sm border transition-all duration-300 ${
            item.isUrgent 
              ? 'border-red-200 ring-1 ring-red-100 bg-red-50/30' 
              : 'border-gray-100'
          }`}
        >
          <p className={`text-xs font-bold uppercase mb-1 ${
            item.isUrgent ? 'text-red-600' : 'text-gray-500'
          }`}>
            {item.label}
          </p>
          <p className="text-xl font-bold text-gray-800">
            {item.value} 
            <span className={`text-sm font-normal ml-1 ${
              item.isUrgent ? 'text-red-400' : 'text-gray-400'
            }`}>
              {item.unit}
            </span>
          </p>
          {item.isUrgent && (
            <p className="text-[10px] text-red-500 font-medium mt-1 animate-pulse">
              ACTION REQUIRED
            </p>
          )}
        </div>
      ))}
    </div>
  );
}