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
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Factory Workers</h2>
        <button 
          onClick={() => { setEditingWorker(null); setIsModalOpen(true); }}
          className="bg-blue-700 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-blue-600 transition"
        >
          + Add Worker
        </button>
      </div>

      {loading ? <p>Loading workers...</p> : (
        <WorkersTable workers={workers} onEdit={(w) => { setEditingWorker(w); setIsModalOpen(true); }} />
      )}

      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <AddWorkerForm 
            initialData={editingWorker}
            onSuccess={() => { setIsModalOpen(false); fetchWorkers(); }} 
          />
        </Modal>
      )}
    </div>
  );
}