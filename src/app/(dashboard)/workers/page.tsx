'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/hooks/useAuth';
import { workersService } from '@/services/workers.service';
import WorkersTable from '@/components/modules/workers/WorkersTable';
import Modal from '@/components/ui/Modal';
import AddWorkerForm from '@/components/modules/workers/AddWorkerForm';

export default function WorkersPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [workers, setWorkers] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingWorker, setEditingWorker] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Security Gatekeeper
  useEffect(() => {
    if (user && user.role !== 'owner' && user.role !== 'superadmin') {
      router.push('/unauthorized');
    }
  }, [user, router]);

  useEffect(() => {
    fetchWorkers();
  }, []);

  const fetchWorkers = async () => {
    try {
      setLoading(true);
      // Fetches only active workers to maintain soft-delete logic
      const { data, error } = await supabase
        .from('workers')
        .select('*')
        .eq('is_active', true)
        .order('full_name', { ascending: true });
        
      if (error) throw error;
      setWorkers(data || []);
    } catch (err) {
      console.error("Error fetching workers:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <h2 className="text-2xl font-bold text-gray-800">Factory Workers</h2>
          <button 
            onClick={() => { setEditingWorker(null); setIsModalOpen(true); }}
            className="w-full sm:w-auto bg-blue-700 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-blue-600 transition shadow-md text-center"
          >
            + Add Worker
          </button>
        </div>

        {/* Content Table Container */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {loading ? (
            <div className="p-10 text-center text-gray-500">Loading workers...</div>
          ) : (
            <div className="overflow-x-auto w-full">
              <WorkersTable 
                workers={workers} 
                onEdit={(w) => { setEditingWorker(w); setIsModalOpen(true); }} 
                onDeleted={fetchWorkers}
              />
            </div>
          )}
        </div>

        {/* Modal for Add/Edit */}
        {isModalOpen && (
          <Modal onClose={() => setIsModalOpen(false)}>
            <AddWorkerForm 
              initialData={editingWorker}
              onSuccess={() => { setIsModalOpen(false); fetchWorkers(); }} 
            />
          </Modal>
        )}
      </div>
    </div>
  );
}