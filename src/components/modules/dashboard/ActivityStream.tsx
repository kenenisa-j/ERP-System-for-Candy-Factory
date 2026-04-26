'use client';

// Helper to determine icon color and type based on action
const getActivityStyle = (action: string) => {
  const lowerAction = action.toLowerCase();
  if (lowerAction.includes('expense') || lowerAction.includes('payroll')) return { color: 'bg-red-500', icon: '💰' };
  if (lowerAction.includes('sale')) return { color: 'bg-green-500', icon: '🛒' };
  if (lowerAction.includes('production')) return { color: 'bg-purple-500', icon: '⚙️' };
  if (lowerAction.includes('attendance')) return { color: 'bg-blue-500', icon: '✅' };
  return { color: 'bg-gray-400', icon: '📝' };
};

export default function ActivityStream({ logs = [] }: { logs: any[] }) {
  // Defensive check: if logs is null/undefined, default to empty array
  const safeLogs = Array.isArray(logs) ? logs : [];

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <div className="flex justify-between items-center mb-6">
        <h2 className="font-bold text-gray-800">Recent Activity</h2>
        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Live Feed</span>
      </div>
      
      <div className="space-y-6">
        {safeLogs.length > 0 ? (
          safeLogs.map((log) => {
            const style = getActivityStyle(log.action_description || '');
            
            // Safe date formatting
            const dateObj = log.created_at ? new Date(log.created_at) : new Date();
            const dateString = isNaN(dateObj.getTime()) ? 'Invalid Date' : dateObj.toLocaleString('en-US', { 
              month: 'short', 
              day: 'numeric', 
              hour: 'numeric', 
              minute: 'numeric' 
            });

            return (
              <div key={log.id} className="flex gap-4 group">
                <div className={`mt-1 flex-shrink-0 w-8 h-8 rounded-full ${style.color} flex items-center justify-center text-xs text-white shadow-sm`}>
                  {style.icon}
                </div>
                <div>
                  <p className="text-sm text-gray-700 leading-tight group-hover:text-blue-700 transition-colors">
                    {log.action_description || 'Activity performed'}
                  </p>
                  <p className="text-gray-400 text-[10px] mt-1 font-medium uppercase">
                    {dateString}
                  </p>
                </div>
              </div>
            );
          })
        ) : (
          <p className="text-gray-400 text-sm italic">No recent activity logs found for this period.</p>
        )}
      </div>
    </div>
  );
}