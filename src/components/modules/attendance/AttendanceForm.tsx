'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { attendanceService } from '@/services/attendance.service';
import { logActivity } from '@/lib/logger';

export default function AttendanceForm({ onSuccess, initialData }: any) {
  const [workers, setWorkers] = useState<any[]>([]);
  // Fix: Ensure we capture recorded_by if we are editing
  const [formData, setFormData] = useState(initialData || { 
    worker_id: '', 
    status: '', 
    date: new Date().toISOString().split('T')[0] 
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchWorkers = async () => {
      const { data } = await supabase.from('workers').select('id, full_name, worker_id');
      setWorkers(data || []);
    };
    fetchWorkers();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      if (initialData) {
        // Fix: Ensure recorded_by remains consistent during updates
        const updatePayload = { 
          ...formData, 
          recorded_by: initialData.recorded_by || user.id 
        };
        await attendanceService.update(initialData.id, updatePayload);
      } else {
        // Create new record
        await attendanceService.create(formData, user.id);
      }

      const selectedWorker = workers.find(w => w.id === formData.worker_id);
      await logActivity(
        initialData ? 'Updated' : 'Logged', 
        'Attendance', 
        selectedWorker ? selectedWorker.full_name : 'Worker'
      );

      onSuccess();
    } catch (err: any) {
      // Removed console.error to keep the console clean
      // More specific error handling for the UI
      if (err.code === '23505') {
        setError("This worker already has an attendance record for this date.");
      } else if (err.code === '42501') {
        setError("Permission denied: You do not have access to modify this record.");
      } else {
        setError("Failed to save. Please check your connection.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form 
      onSubmit={handleSubmit} 
      className="p-4 space-y-4 w-full md:w-[400px] mx-auto overflow-hidden bg-white"
    >
      <h2 className="text-xl font-bold border-b pb-2 text-gray-800">Log Attendance</h2>
      
      {error && (
        <p className="text-red-600 text-xs font-medium bg-red-50 p-3 border border-red-200 rounded-md">
          {error}
        </p>
      )}
      
      <div className="w-full">
        <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wider">Worker Name</label>
        <select 
          required 
          className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-600 outline-none text-sm bg-white"
          value={formData.worker_id}
          onChange={(e) => setFormData({...formData, worker_id: e.target.value})}
        >
          <option value="">Select a worker</option>
          {workers.map(w => (
            <option key={w.id} value={w.id}>
              {w.full_name} ({w.worker_id})
            </option>
          ))}
        </select>
      </div>

      <div className="w-full">
        <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wider">Status</label>
        <select 
          required 
          className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-600 outline-none text-sm bg-white"
          value={formData.status}
          onChange={(e) => setFormData({...formData, status: e.target.value})}
        >
          <option value="">Select status</option>
          <option value="Present">Present</option>
          <option value="Absent">Absent</option>
          <option value="Late">Late</option>
        </select>
      </div>

      <div className="w-full">
        <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wider">Date</label>
        <input 
          type="date" 
          required 
          className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-600 outline-none text-sm bg-white"
          value={formData.date}
          onChange={(e) => setFormData({...formData, date: e.target.value})}
        />
      </div>

      <button 
        type="submit" 
        disabled={loading}
        className="w-full bg-blue-700 text-white p-2.5 rounded-md font-bold hover:bg-blue-800 transition disabled:bg-gray-400 text-sm shadow-sm"
      >
        {loading ? 'Saving...' : 'Save Attendance'}
      </button>
    </form>
  );
}