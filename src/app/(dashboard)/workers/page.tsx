'use client';
import { useEffect, useState } from 'react';
import { workersService } from '@/services/workers.service';
import WorkersTable from '@/components/modules/workers/WorkersTable';
import Modal from '@/components/ui/Modal';
import AddWorkerForm from '@/components/modules/workers/AddWorkerForm';

export default function WorkersPage() {
  const [workers, setWorkers] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingWorker, setEditingWorker] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWorkers();
  }, []);

  const fetchWorkers = async () => {
    try {
      setLoading(true);
      const data = await workersService.getAll();
      setWorkers(data || []);
    } catch (err) {
      console.error("Error fetching workers:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    // Mobile-first padding and centered container for desktop
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        
        {/* Responsive Header: Stacks on mobile, row on larger screens */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <h2 className="text-2xl font-bold text-gray-800">Factory Workers</h2>
          <button 
            onClick={() => { setEditingWorker(null); setIsModalOpen(true); }}
            className="w-full sm:w-auto bg-blue-700 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-blue-600 transition shadow-md w-full sm:w-auto text-center"
          >
            + Add Worker
          </button>
        </div>

        {/* Workers Table Container */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {loading ? (
            <div className="p-10 text-center text-gray-500">Loading workers...</div>
          ) : (
            <div className="overflow-x-auto w-full">
              <WorkersTable 
                workers={workers} 
                onEdit={(w) => { setEditingWorker(w); setIsModalOpen(true); }} 
              />
            </div>
          )}
        </div>

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