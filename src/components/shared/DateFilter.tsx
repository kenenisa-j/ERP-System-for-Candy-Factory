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
    <div className="flex bg-gray-100 p-1 rounded-lg w-fit mb-4">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={`px-4 py-1.5 text-sm font-medium rounded-md transition ${
            range === tab.id ? 'bg-white shadow text-purple-700' : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}