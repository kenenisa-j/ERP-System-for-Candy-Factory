'use client';
import { useState } from 'react';
import { staffService } from '@/services/staff.service';
import { adminResetPasswordAction } from '@/app/actions/staff.actions';
import Button from '@/components/ui/Button';

export default function EditStaffModal({ staff, onClose, onUpdate }: { staff: any; onClose: () => void; onUpdate: () => void }) {
  const [loading, setLoading] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  // 1. ADD THIS STATE TO HOLD THE PAGE MESSAGE
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const handleAction = async (action: 'toggle' | 'reset') => {
    setLoading(true);
    setMessage(null); // Clear old messages
    
    try {
      if (action === 'toggle') {
        await staffService.toggleStatus(staff.id, !staff.is_active);
        setMessage({ text: "Status updated successfully.", type: 'success' });
        // Optional: onUpdate();
      } else {
        if (!newPassword) {
           setMessage({ text: "Please enter a new password.", type: 'error' });
           setLoading(false);
           return;
        }
        
        const result = await adminResetPasswordAction(staff.id, newPassword);
        if (result?.error) throw new Error(result.error);
        
        setMessage({ text: "Password reset successfully.", type: 'success' });
        setNewPassword('');
      }
      
      // Keep modal open briefly to show the success message
      if (action === 'toggle') onUpdate();
    } catch (err) {
      setMessage({ 
        text: err instanceof Error ? err.message : "An unexpected error occurred.", 
        type: 'error' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-sm space-y-4">
        <h2 className="text-xl font-bold">Manage {staff.full_name}</h2>
        
        {/* 2. THIS IS WHERE THE MESSAGE APPEARS ON THE PAGE */}
        {message && (
          <div className={`p-3 rounded text-sm ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {message.text}
          </div>
        )}

        <input 
          type="password"
          placeholder="Enter new password"
          className="w-full p-2 border rounded"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        
        <div className="flex flex-col gap-2 pt-4">
          <Button onClick={() => handleAction('toggle')} disabled={loading} className={staff.is_active ? "bg-red-600" : "bg-green-600"}>
            {loading ? "Processing..." : (staff.is_active ? 'Disable Account' : 'Enable Account')}
          </Button>
          
          <Button onClick={() => handleAction('reset')} disabled={loading} className="bg-orange-600">
            {loading ? "Processing..." : "Reset Password"}
          </Button>
          
          <Button onClick={onClose} disabled={loading} className="bg-gray-200 text-gray-800">
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}