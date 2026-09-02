interface DateFiltersProps {
  range: string;
  onChange: (range: any) => void;
}

export default function DateFilters({ range, onChange }: DateFiltersProps) {
  const tabs = [
    { id: 'today', label: 'Today' },
    { id: 'week', label: 'Week' },
    { id: 'month', label: 'Month' },
  ];

  return (
    <div className="flex bg-gray-100 dark:bg-slate-800 p-1 rounded-xl w-fit border border-transparent dark:border-slate-700/60">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={`px-4 py-1.5 text-sm font-semibold rounded-lg transition ${
            range === tab.id 
              ? 'bg-white dark:bg-slate-700 shadow-sm text-purple-700 dark:text-purple-300 font-bold' 
              : 'text-gray-600 dark:text-slate-300 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}