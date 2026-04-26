interface SummaryCardProps {
  title: string;
  value: number | string;
  unit?: string; // Defaults to 'Birr' if not provided
  colorClass: string;
  trend?: string; // Expected format: "+12.5%" or "-2.1%"
}

export default function SummaryCard({ 
  title, 
  value, 
  unit = 'Birr', 
  colorClass, 
  trend 
}: SummaryCardProps) {
  
  // Logic to determine arrow direction and color
  const isPositive = trend?.startsWith('+');

  return (
    <div className={`p-5 rounded-2xl shadow-lg text-white ${colorClass} flex flex-col justify-between`}>
      <div>
        <h3 className="text-xs font-medium opacity-80 uppercase tracking-wider">{title}</h3>
        <p className="text-2xl font-bold mt-1">
          {value} <span className="text-sm font-normal opacity-70">{unit}</span>
        </p>
      </div>

      {trend && (
        <div className={`text-xs mt-3 font-semibold px-2 py-0.5 rounded-full inline-block w-fit ${
          isPositive ? 'bg-white/20 text-white' : 'bg-black/20 text-white'
        }`}>
          {isPositive ? '↑' : '↓'} {trend} vs last month
        </div>
      )}
    </div>
  );
}