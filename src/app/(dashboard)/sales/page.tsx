'use client';
import { useEffect, useState } from 'react';
import { salesService } from '@/services/sales.service';
import SalesForm from '@/components/modules/sales/SalesForm';
import SalesTable from '@/components/modules/sales/SalesTable';
import Modal from '@/components/ui/Modal';
import { useAuth } from '@/hooks/useAuth';
import Loading from '@/components/shared/Loading';
import { useTableFilters } from '@/hooks/useTableFilters';
import DateFilters from '../../../components/shared/DateFilter';
import ModuleSummaryHeader from '@/components/shared/ModuleSummaryHeader';

export default function SalesPage() {
  const [sales, setSales] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSale, setEditingSale] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  
  const { range, setRange, startDate, endDate } = useTableFilters();

  const isAdmin = user?.role === 'superadmin' || user?.role === 'owner';
  const totalSalesAmount = sales.reduce((sum, sale) => sum + (Number(sale.total) || 0), 0);

  useEffect(() => {
    fetchSales();
  }, [range, isAdmin]);

  const fetchSales = async () => {
    try {
      setLoading(true);
      let finalStart = startDate;
      let finalEnd = endDate;

      if (!isAdmin) {
        const today = new Date().toISOString().split('T')[0];
        finalStart = today;
        finalEnd = today;
      }

      const data = await salesService.getAll(finalStart, finalEnd);
      setSales(data || []);
    } catch (err) {
      console.error("Error fetching sales:", err);
    } finally {
      setLoading(false);
    }
  };

  const canEdit = (sale: any) => {
    if (!user) return false;
    return user.role === 'superadmin' || sale.created_by === user.id;
  };

  const handleEdit = (sale: any) => {
    setEditingSale(sale);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setEditingSale(null);
    setIsModalOpen(true);
  };

  if (loading) return <Loading />;

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        
        {/* Modern Header Section */}
        <ModuleSummaryHeader 
          title="Sales Records" 
          isAdmin={isAdmin}
          stats={[
            { label: "Total Sales", value: `${totalSalesAmount.toLocaleString()} Birr` },
            { label: "Orders", value: sales.length }
          ]}
          filterComponent={isAdmin ? <DateFilters range={range} onChange={setRange} /> : null}
        />

        {/* Main Table Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-4 md:p-6 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h3 className="font-bold text-gray-700">Recent Sales</h3>
            <button 
              onClick={handleAdd}
              className="w-full sm:w-auto bg-blue-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-blue-700 transition shadow-md hover:shadow-lg"
            >
              + Add Sale
            </button>
          </div>

          <div className="overflow-x-auto w-full">
            <SalesTable 
              sales={sales} 
              onEdit={handleEdit} 
              canEdit={canEdit} 
            />
          </div>
        </div>

        {isModalOpen && (
          <Modal onClose={() => setIsModalOpen(false)}>
            <SalesForm 
              initialData={editingSale} 
              onSuccess={() => { setIsModalOpen(false); fetchSales(); }} 
            />
          </Modal>
        )}
      </div>
    </div>
  );
}