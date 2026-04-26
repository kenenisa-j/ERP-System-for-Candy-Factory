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
    <div className="p-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Staff Management</h1>
        <p className="text-gray-500">Manage your factory staff, roles, and security access.</p>
      </div>
      
      {/* Form to add new staff */}
      <AddStaffForm onSuccess={fetchStaff} />

      {/* Staff listing table */}
      {loading ? (
        <div className="flex justify-center p-10">
          <p className="text-gray-500">Loading staff directory...</p>
        </div>
      ) : (
        <StaffTable staff={staff} onUpdate={fetchStaff} />
      )}
    </div>
  );
}