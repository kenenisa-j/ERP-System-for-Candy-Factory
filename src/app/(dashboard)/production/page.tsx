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
  const [production, setProduction] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  
  const { range, setRange, startDate, endDate } = useTableFilters();

  // Define admin status
  const isAdmin = user?.role === 'superadmin' || user?.role === 'owner';

  // Calculate total units produced dynamically
  const totalUnits = production.reduce((sum, item) => sum + (Number(item.quantity) || 0), 0);

  useEffect(() => {
    fetchData();
  }, [range, isAdmin]);

  const fetchData = async () => {
    try {
      setLoading(true);

      // Force dates to Today for non-admin staff
      let finalStart = startDate;
      let finalEnd = endDate;

      if (!isAdmin) {
        const today = new Date().toISOString().split('T')[0];
        finalStart = today;
        finalEnd = today;
      }

      // Pass user ID and admin status to the service to enforce filtering
      const data = await productionService.getAll(finalStart, finalEnd, user?.id, isAdmin);
      setProduction(data || []);
    } catch (err) {
      console.error("Error fetching production:", err);
    } finally {
      setLoading(false);
    }
  };

  const canEdit = () => user?.role === 'superadmin';

  const handleEdit = (item: any) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setEditingItem(null);
    setIsModalOpen(true);
  };

  if (loading) return <Loading />;

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* Modern Header Section */}
      <ModuleSummaryHeader 
        title="Production Records" 
        isAdmin={isAdmin}
        stats={[
          { label: "Total Units", value: totalUnits.toLocaleString() },
          { label: "Batches", value: production.length }
        ]}
        // Only show filter if user is Admin
        filterComponent={isAdmin ? <DateFilters range={range} onChange={setRange} /> : null}
      />

      {/* Main Table Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <h3 className="font-bold text-gray-700">Production History</h3>
          <button 
            onClick={handleAdd}
            className="bg-purple-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-purple-600 transition shadow-md hover:shadow-lg"
          >
            + Log Production
          </button>
        </div>

        <div className="overflow-x-auto">
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
  );
}