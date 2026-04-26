'use client';
import { useState } from 'react';
import { staffService } from '@/services/staff.service';
import EditStaffModal from './EditStaffModal';

// Define the shape of your staff member for better type safety
interface StaffMember {
  id: string;
  full_name: string;
  role: string;
  is_active: boolean;
  email?: string;
}

export default function StaffTable({ staff, onUpdate }: { staff: StaffMember[]; onUpdate: () => void }) {
  const [editingStaff, setEditingStaff] = useState<StaffMember | null>(null);

  return (
    <div className="overflow-x-auto bg-white rounded-xl shadow-sm border border-gray-200">
      <table className="w-full text-left">
        <thead className="bg-gray-50 border-b">
          <tr>
            <th className="p-4 font-semibold text-gray-700">Name</th>
            <th className="p-4 font-semibold text-gray-700">Role</th>
            <th className="p-4 font-semibold text-gray-700">Status</th>
            <th className="p-4 font-semibold text-gray-700">Actions</th>
          </tr>
        </thead>
        <tbody>
          {staff.map((member) => (
            <tr key={member.id} className="border-b hover:bg-gray-50">
              <td className="p-4">{member.full_name}</td>
              <td className="p-4 capitalize">{member.role}</td>
              <td className="p-4">
                <span className={`px-2 py-1 rounded text-xs font-bold ${member.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {member.is_active ? 'Active' : 'Disabled'}
                </span>
              </td>
              <td className="p-4">
                <button 
                  onClick={() => setEditingStaff(member)}
                  className="text-blue-600 font-medium hover:underline"
                >
                  Manage
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* The Modal pops up when a staff member is selected */}
      {editingStaff && (
        <EditStaffModal 
          staff={editingStaff} 
          onClose={() => setEditingStaff(null)} 
          onUpdate={onUpdate} 
        />
      )}
    </div>
  );
}