'use client';
import { useState } from 'react';
import { staffService } from '@/services/staff.service';
import Button from '@/components/ui/Button';

export default function EditStaffModal({ staff, onClose, onUpdate }: { staff: any; onClose: () => void; onUpdate: () => void }) {
  const [loading, setLoading] = useState(false);

  const handleAction = async (action: 'toggle' | 'reset') => {
    setLoading(true);
    try {
      if (action === 'toggle') {
        await staffService.toggleStatus(staff.id, !staff.is_active);
      } else {
        await staffService.resetPassword(staff.id);
      }
      onUpdate();
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-sm space-y-4">
        <h2 className="text-xl font-bold">Manage {staff.full_name}</h2>
        <p className="text-sm text-gray-600">Email: {staff.email}</p>
        
        <div className="flex flex-col gap-2 pt-4">
          <Button onClick={() => handleAction('toggle')} className={staff.is_active ? "bg-red-600" : "bg-green-600"}>
            {staff.is_active ? 'Disable Account' : 'Enable Account'}
          </Button>
          
          <Button onClick={() => handleAction('reset')} className="bg-orange-600">
            Reset Password
          </Button>
          
          <Button onClick={onClose} className="bg-gray-200 text-gray-800">
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}