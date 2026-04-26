// src/components/modules/dashboard/MonthSelector.tsx
interface Props {
  month: number;
  year: number;
  onChange: (month: number, year: number) => void;
}

export default function MonthSelector({ month, year, onChange }: Props) {
  // Advanced Logic: 
  // Start from 2025 (your project restart date) 
  // and go up to 2040 (past your 2035 vision goal)
  const startYear = 2025;
  const endYear = 2040;
  
  const years = Array.from(
    { length: endYear - startYear + 1 }, 
    (_, i) => startYear + i
  );
  
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June', 
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  return (
    <div className="flex gap-3 items-center">
      <select 
        value={month} 
        onChange={(e) => onChange(Number(e.target.value), year)} 
        className="p-2.5 border border-gray-300 rounded-xl bg-white shadow-sm focus:ring-2 focus:ring-blue-600 outline-none transition-all cursor-pointer"
      >
        {months.map((m, i) => (
          <option key={m} value={i}>{m}</option>
        ))}
      </select>

      <select 
        value={year} 
        onChange={(e) => onChange(month, Number(e.target.value))} 
        className="p-2.5 border border-gray-300 rounded-xl bg-white shadow-sm focus:ring-2 focus:ring-blue-600 outline-none transition-all cursor-pointer"
      >
        {years.map(y => (
          <option key={y} value={y}>{y}</option>
        ))}
      </select>
    </div>
  );
}