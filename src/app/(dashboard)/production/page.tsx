'use client';
import { useEffect, useState } from 'react';
import { productionService } from '@/services/production.service';
import ProductionForm from '@/components/modules/production/ProductionForm';
import ProductionTable from '@/components/modules/production/ProductionTable';
import Modal from '@/components/ui/Modal';
import { useAuth } from '@/hooks/useAuth';
import Loading from '@/components/shared/Loading';
import { useTableFilters } from '@/hooks/useTableFilters';
import DateFilters from '../../../components/shared/DateFilter';
import ModuleSummaryHeader from '@/components/shared/ModuleSummaryHeader';

export default function ProductionPage() {
  // 1. ALL HOOKS CALLED UNCONDITIONALLY
  const [production, setProduction] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  const { user, loading: authLoading } = useAuth();
  const { range, setRange, startDate, endDate } = useTableFilters();

  // 2. LOGIC
  const isAdmin = user?.role === 'superadmin' || user?.role === 'owner';
  const isAccountDisabled = user && user.is_active === false && !isAdmin;
  const totalUnits = production.reduce((sum, item) => sum + (Number(item.quantity) || 0), 0);

  const fetchData = async () => {
    // Security check: do not fetch if user is disabled
    if (!user || (user.is_active === false && !isAdmin)) return;

    try {
      setLoading(true);
      let finalStart = startDate;
      let finalEnd = endDate;

      if (!isAdmin) {
        const today = new Date().toISOString().split('T')[0];
        finalStart = today;
        finalEnd = today;
      }

      const data = await productionService.getAll(finalStart, finalEnd, user?.id, isAdmin);
      setProduction(data || []);
    } catch (err) {
      console.error("Error fetching production:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading && user && !isAccountDisabled) fetchData();
    else if (!authLoading) setLoading(false);
  }, [range, isAdmin, user, authLoading, isAccountDisabled]);

  const canEdit = () => user?.role === 'superadmin';

  const handleEdit = (item: any) => {
    if (isAccountDisabled) {
      alert("Your account is disabled.");
      return;
    }
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    if (isAccountDisabled) {
      alert("Your account is disabled.");
      return;
    }
    setEditingItem(null);
    setIsModalOpen(true);
  };

  // 3. RENDER LOGIC
  if (authLoading || (loading && production.length === 0 && !isAccountDisabled)) return <Loading />;

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

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        
        <ModuleSummaryHeader 
          title="Production Records" 
          isAdmin={isAdmin}
          stats={[
            { label: "Total Units", value: totalUnits.toLocaleString() },
            { label: "Batches", value: production.length }
          ]}
          filterComponent={isAdmin ? <DateFilters range={range} onChange={setRange} /> : null}
        />

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-4 md:p-6 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h3 className="font-bold text-gray-700">Production History</h3>
            <button 
              onClick={handleAdd}
              className="w-full sm:w-auto bg-purple-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-purple-600 transition shadow-md hover:shadow-lg"
            >
              + Log Production
            </button>
          </div>

          <div className="overflow-x-auto w-full">
            <ProductionTable 
              data={production} 
              onEdit={handleEdit} 
              canEdit={canEdit()} 
            />
          </div>
        </div>

        {isModalOpen && (
          <Modal onClose={() => setIsModalOpen(false)}>
            <ProductionForm 
              initialData={editingItem} 
              onSuccess={() => { setIsModalOpen(false); fetchData(); }} 
            />
          </Modal>
        )}
      </div>
    </div>
  );
}