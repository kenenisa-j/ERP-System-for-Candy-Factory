'use client';
import { useState } from 'react';
import { createStaffAction } from '@/app/actions/staff';
import { logActivity } from '@/lib/logger'; // Import the logger helper
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

export default function AddStaffForm({ onSuccess }: { onSuccess: () => void }) {
  const [formData, setFormData] = useState({ email: '', password: '', full_name: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Call the server action and capture the result
    const result = await createStaffAction(formData);

    if (result.error) {
      setError(result.error);
    } else {
      // Updated: Use the centralized logActivity helper
      await logActivity(
        'Added',
        'Staff',
        formData.full_name
      );

      onSuccess();
      setFormData({ email: '', password: '', full_name: '' });
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 space-y-4 mb-6">
      <h2 className="text-lg font-bold">Add New Staff Member</h2>
      {error && <p className="text-red-500 text-sm bg-red-50 p-2 rounded">{error}</p>}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input 
          placeholder="Full Name" 
          value={formData.full_name} 
          onChange={e => setFormData({...formData, full_name: e.target.value})}
          required 
        />
        <Input 
          type="email" 
          placeholder="Email Address" 
          value={formData.email} 
          onChange={e => setFormData({...formData, email: e.target.value})}
          required 
        />
        <Input 
          type="password" 
          placeholder="Temporary Password" 
          value={formData.password} 
          onChange={e => setFormData({...formData, password: e.target.value})}
          required 
        />
      </div>

      <Button type="submit" disabled={loading}>
        {loading ? 'Creating...' : 'Create Staff Member'}
      </Button>
    </form>
  );
}