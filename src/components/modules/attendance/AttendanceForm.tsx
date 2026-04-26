'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { attendanceService } from '@/services/attendance.service';

export default function AttendanceForm({ onSuccess, initialData }: any) {
  const [workers, setWorkers] = useState<any[]>([]);
  const [formData, setFormData] = useState(initialData || { 
    worker_id: '', 
    status: '', 
    date: new Date().toISOString().split('T')[0] 
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // 1. Fetch workers for the dropdown - FIXED to fetch 'id' (the UUID)
  useEffect(() => {
    const fetchWorkers = async () => {
      // FIX: Select 'id' (the UUID) instead of 'worker_id' (the string code)
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
        await attendanceService.update(initialData.id, formData);
      } else {
        await attendanceService.create(formData, user.id);
      }
      onSuccess();
    } catch (err: any) {
      console.error("Submission Error:", err);
      // Handles the duplicate constraint violation
      if (err.code === '23505') {
        setError("This worker already has an attendance record for this date.");
      } else if (err.code === '22P02') {
        setError("Invalid data format. Please select a valid worker.");
      } else {
        setError("Failed to save attendance. Please check your network.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 space-y-4">
      <h2 className="text-xl font-bold border-b pb-2">Log Attendance</h2>
      {error && <p className="text-red-500 text-sm font-medium bg-red-50 p-2 rounded">{error}</p>}
      
      <div>
        <label className="block text-sm font-medium text-gray-700">Worker Name</label>
        <select 
          required 
          className="w-full p-2 border border-gray-300 rounded mt-1 focus:ring-2 focus:ring-blue-500 outline-none"
          value={formData.worker_id}
          onChange={(e) => setFormData({...formData, worker_id: e.target.value})}
        >
          <option value="">Select a worker</option>
          {workers.map(w => (
            // FIX: Use w.id (the UUID) as the value
            <option key={w.id} value={w.id}>
              {w.full_name} ({w.worker_id})
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Status</label>
        <select 
          required 
          className="w-full p-2 border border-gray-300 rounded mt-1 focus:ring-2 focus:ring-blue-500 outline-none"
          value={formData.status}
          onChange={(e) => setFormData({...formData, status: e.target.value})}
        >
          <option value="">Select status</option>
          <option value="Present">Present</option>
          <option value="Absent">Absent</option>
          <option value="Late">Late</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Date</label>
        <input 
          type="date" 
          required 
          className="w-full p-2 border border-gray-300 rounded mt-1 focus:ring-2 focus:ring-blue-500 outline-none"
          value={formData.date}
          onChange={(e) => setFormData({...formData, date: e.target.value})}
        />
      </div>

      <button 
        type="submit" 
        disabled={loading}
        className="w-full bg-blue-700 text-white p-2.5 rounded font-bold hover:bg-blue-800 transition disabled:bg-gray-400"
      >
        {loading ? 'Saving...' : 'Save Attendance'}
      </button>
    </form>
  );
}