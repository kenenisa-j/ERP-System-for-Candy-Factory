'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import StaffTable from '@/components/modules/staff/StaffTable';
import AddStaffForm from '@/components/modules/staff/AddStaffForm';

export default function StaffPage() {
  const [staff, setStaff] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchStaff = async () => {
    setLoading(true);
    // Fetch profiles excluding your superadmin account
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .neq('role', 'superadmin');
    
    if (error) {
      console.error("Error fetching staff:", error);
    } else {
      setStaff(data || []);
    }
    setLoading(false);
  };

  useEffect(() => { 
    fetchStaff(); 
  }, []);

  return (
    // Mobile-first padding and centered container for desktop
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header Section */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h1 className="text-2xl font-bold text-gray-900">Staff Management</h1>
          <p className="text-gray-500">Manage your factory staff, roles, and security access.</p>
        </div>
        
        {/* Form to add new staff */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <AddStaffForm onSuccess={fetchStaff} />
        </div>

        {/* Staff listing table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {loading ? (
            <div className="flex justify-center p-10">
              <p className="text-gray-500 animate-pulse">Loading staff directory...</p>
            </div>
          ) : (
            <div className="w-full overflow-x-auto">
              <StaffTable staff={staff} onUpdate={fetchStaff} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}