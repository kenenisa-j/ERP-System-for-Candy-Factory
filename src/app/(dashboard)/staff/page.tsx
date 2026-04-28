'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/hooks/useAuth';
import StaffTable from '@/components/modules/staff/StaffTable';
import AddStaffForm from '@/components/modules/staff/AddStaffForm';

export default function StaffPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [staff, setStaff] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Security Gatekeeper: Ensure only owners/superadmins access this page
  useEffect(() => {
    if (user && user.role !== 'owner' && user.role !== 'superadmin') {
      router.push('/unauthorized');
    }
  }, [user, router]);

  const fetchStaff = async () => {
    // Only show loading spinner on initial load, 
    // otherwise let the UI stay interactive during updates
    const isInitialLoad = staff.length === 0;
    if (isInitialLoad) setLoading(true);

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .neq('role', 'superadmin')
      .order('full_name', { ascending: true });
    
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
          {loading && staff.length === 0 ? (
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