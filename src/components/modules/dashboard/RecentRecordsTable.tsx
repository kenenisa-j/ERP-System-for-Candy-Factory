export default function RecentRecordsTable({ title, records, type }: { title: string, records: any[], type: 'sale' | 'expense' }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <h2 className="font-bold text-gray-800 mb-4">{title}</h2>
      <table className="w-full text-sm">
        <tbody className="divide-y">
          {records.map((r, i) => (
            <tr key={i}>
              <td className="py-2 text-gray-600">{type === 'sale' ? r.customer_name : r.description}</td>
              <td className="py-2 text-right font-medium">{type === 'sale' ? r.total : r.amount} Birr</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}