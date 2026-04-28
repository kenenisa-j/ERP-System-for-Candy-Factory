'use client';
import { useState } from 'react';
import { workersService } from '@/services/workers.service';
import { logActivity } from '@/lib/logger'; // Import the logger helper

export default function AddWorkerForm({ initialData, onSuccess }: any) {
  const [formData, setFormData] = useState(initialData || { 
    full_name: '', 
    position: '', 
    base_salary: '' 
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (initialData) {
        await workersService.update(initialData.id, formData);
      } else {
        await workersService.create(formData);
      }

      // Updated: Use the centralized logActivity helper
      await logActivity(
        initialData ? 'Updated' : 'Added',
        'Workers',
        formData.full_name
      );

      onSuccess();
    } catch (error) {
      console.error("Failed to save worker:", error);
      alert("Error saving worker. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 p-2">
      <h3 className="font-bold text-xl text-gray-800 border-b pb-3">
        {initialData ? 'Edit Worker Details' : 'Add New Worker'}
      </h3>

      {/* Full Name Field */}
      <div className="space-y-1">
        <label className="text-sm font-semibold text-gray-600">Full Name</label>
        <input 
          placeholder="Enter worker's full name" 
          className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition" 
          value={formData.full_name} 
          onChange={e => setFormData({...formData, full_name: e.target.value})} 
          required 
        />
      </div>

      {/* Position Field */}
      <div className="space-y-1">
        <label className="text-sm font-semibold text-gray-600">Job Position</label>
        <input 
          placeholder="e.g., Machine Operator, Packer" 
          className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition" 
          value={formData.position} 
          onChange={e => setFormData({...formData, position: e.target.value})} 
          required 
        />
      </div>

      {/* Salary Field */}
      <div className="space-y-1">
        <label className="text-sm font-semibold text-gray-600">Monthly Salary (Birr)</label>
        <input 
          type="number" 
          placeholder="0"
          className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition" 
          value={formData.base_salary} 
          onChange={e => setFormData({...formData, base_salary: Number(e.target.value)})} 
          required 
        />
      </div>

      <button 
        type="submit" 
        disabled={loading}
        className="w-full bg-blue-700 text-white p-3 rounded-lg font-bold hover:bg-blue-800 transition shadow-md disabled:bg-gray-400"
      >
        {loading ? 'Saving...' : 'Save Worker'}
      </button>
    </form>
  );
}