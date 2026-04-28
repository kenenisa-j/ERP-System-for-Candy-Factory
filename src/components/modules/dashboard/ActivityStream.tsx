'use client';

// Helper to determine icon color and type based on module
const getModuleStyle = (module: string) => {
  const m = module.toLowerCase();
  if (m.includes('expense') || m.includes('payroll')) return { color: 'text-red-500', icon: '💰' };
  if (m.includes('sale')) return { color: 'text-green-500', icon: '🛒' };
  if (m.includes('production')) return { color: 'text-purple-500', icon: '⚙️' };
  if (m.includes('attendance')) return { color: 'text-blue-500', icon: '✅' };
  return { color: 'text-gray-400', icon: '📝' };
};

export default function ActivityStream({ logs = [] }: { logs: any[] }) {
  const safeLogs = Array.isArray(logs) ? logs : [];

  return (
    <div className="bg-white p-4 md:p-6 rounded-2xl shadow-sm border border-gray-100">
      <div className="flex justify-between items-center mb-6">
        <h2 className="font-bold text-gray-800">Recent Activity</h2>
        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Live Feed</span>
      </div>
      
      {/* Mobile/Tablet List View - Unchanged */}
      <div className="flex flex-col gap-3 md:hidden">
        {safeLogs.length > 0 ? safeLogs.map((log) => {
          const style = getModuleStyle(log.module || '');
          return (
            <div key={log.id} className="p-3 border border-gray-50 rounded-xl bg-gray-50/50">
              <div className="flex justify-between items-center mb-1">
                <span className="font-bold text-gray-700 text-sm">{log.user_name}</span>
                <span className="text-[10px] text-gray-400">{new Date(log.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
              <p className="text-sm text-gray-600">{log.action} <span className="font-medium text-gray-800">{log.record_name}</span></p>
              <div className={`mt-2 text-xs font-semibold ${style.color}`}>
                {style.icon} {log.module}
              </div>
            </div>
          )
        }) : <p className="text-gray-400 text-sm italic text-center py-4">No logs found.</p>}
      </div>

      {/* Desktop Table View - Adjusted Spacing */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="text-gray-400 uppercase text-[10px] border-b border-gray-50">
            <tr>
              <th className="pb-3 font-semibold w-[20%]">User</th>
              <th className="pb-3 font-semibold w-[15%]">Action</th>
              <th className="pb-3 font-semibold w-[25%] pr-4">Module</th> 
              <th className="pb-3 font-semibold w-[25%]">Record</th>
              <th className="pb-3 font-semibold w-[15%]">Time</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {safeLogs.length > 0 ? safeLogs.map((log) => {
              const style = getModuleStyle(log.module || '');
              const timeString = new Date(log.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
              return (
                <tr key={log.id} className="hover:bg-gray-50 transition">
                  <td className="py-4 font-medium text-gray-700">{log.user_name}</td>
                  <td className="py-4 text-gray-600">{log.action}</td>
                  <td className={`py-4 font-bold ${style.color} pr-4`}> 
                    <span className="mr-1">{style.icon}</span>{log.module}
                  </td>
                  <td className="py-4 text-gray-600 truncate max-w-[150px]">{log.record_name}</td>
                  <td className="py-4 text-gray-400 text-xs">{timeString}</td>
                </tr>
              );
            }) : (
              <tr><td colSpan={5} className="py-6 text-gray-400 text-center italic">No activity yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}