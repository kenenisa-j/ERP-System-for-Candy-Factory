interface StatItem {
  label: string;
  value: string | number;
}

interface ModuleSummaryHeaderProps {
  title: string;
  stats: StatItem[];
  filterComponent?: React.ReactNode;
  isAdmin?: boolean; // New prop to control visibility
}

export default function ModuleSummaryHeader({ 
  title, 
  stats, 
  filterComponent, 
  isAdmin = true 
}: ModuleSummaryHeaderProps) {
  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 mb-6 flex flex-col md:flex-row md:items-center justify-between gap-6 transition-colors">
      {/* Title Section - Always Visible */}
      <div className="flex flex-col md:flex-row md:items-center gap-4">
        <h2 className="text-2xl font-extrabold text-gray-900 dark:text-slate-100 tracking-tight">{title}</h2>
        
        {/* Filter - Visible only to Admins */}
        {isAdmin && <div className="flex-shrink-0">{filterComponent}</div>}
      </div>

      {/* Metrics Section - Visible only to Admins */}
      {isAdmin && (
        <div className="flex items-center gap-8 bg-gray-50 dark:bg-slate-800/90 px-6 py-3 rounded-xl border border-gray-100 dark:border-slate-700/80">
          {stats.map((s, i) => (
            <div key={i} className="flex flex-col">
              <span className="text-[10px] font-bold text-gray-400 dark:text-slate-400 uppercase tracking-wider">{s.label}</span>
              <span className="text-lg font-bold text-gray-900 dark:text-slate-100">{s.value}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}