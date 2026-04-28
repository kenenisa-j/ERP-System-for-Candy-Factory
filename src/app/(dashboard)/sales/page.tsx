'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
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
  const router = useRouter();
  
  // 1. ALL HOOKS CALLED UNCONDITIONALLY
  const [sales, setSales] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSale, setEditingSale] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  const { user, loading: authLoading } = useAuth();
  const { range, setRange, startDate, endDate } = useTableFilters();

  // 2. LOGIC
  const isAdmin = user?.role === 'superadmin' || user?.role === 'owner';
  const isAccountDisabled = user && user.is_active === false && !isAdmin;

  const fetchSales = async () => {
    if (!user || isAccountDisabled) return;
    
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

  useEffect(() => {
    if (!authLoading && user) {
      // Redirect unauthorized roles
      if (user.role !== 'owner' && user.role !== 'superadmin' && user.role !== 'staff') {
        router.push('/unauthorized');
        return;
      }
      fetchSales();
    } else if (!authLoading) {
      setLoading(false);
    }
  }, [range, isAdmin, user, authLoading, router]);

  const canEdit = (sale: any) => {
    if (!user) return false;
    return user.role === 'superadmin' || sale.created_by === user.id;
  };

  const handleEdit = (sale: any) => {
    if (isAccountDisabled) return alert("Account disabled.");
    setEditingSale(sale);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    if (isAccountDisabled) return alert("Account disabled.");
    setEditingSale(null);
    setIsModalOpen(true);
  };

  // 3. RENDER LOGIC
  if (authLoading || (loading && sales.length === 0 && !isAccountDisabled)) return <Loading />;

  if (isAccountDisabled) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-red-100 text-center max-w-md w-full">
          <div className="text-4xl mb-4">🚫</div>
          <h2 className="text-xl font-bold text-gray-900">Account Disabled</h2>
          <p className="text-gray-500 mt-2">Your account is currently disabled. Please contact your administrator to regain access.</p>
        </div>
      </div>
    );
  }

  const totalSalesAmount = sales.reduce((sum, sale) => sum + (Number(sale.total) || 0), 0);

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        
        <ModuleSummaryHeader 
          title="Sales Records" 
          isAdmin={isAdmin}
          stats={[
            { label: "Total Sales", value: `${totalSalesAmount.toLocaleString()} Birr` },
            { label: "Orders", value: sales.length }
          ]}
          filterComponent={isAdmin ? <DateFilters range={range} onChange={setRange} /> : null}
        />

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