'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation'; // Added
import { supabase } from '@/lib/supabaseClient'; // Added
import { payrollService, PayrollRecord } from '@/services/payroll.service';
import PayrollTable from '@/components/modules/payroll/PayrollTable';
import PayrollSummary from '@/components/modules/payroll/PayrollSummary';
import EditPayrollModal from '@/components/modules/payroll/MarkPaidModal';
import ConfirmModal from '@/components/shared/ConfirmModal';

export default function PayrollPage() {
  const router = useRouter(); // Added
  const [payroll, setPayroll] = useState<PayrollRecord[]>([]);
  const [month, setMonth] = useState('2026-04');
  const [editingRecord, setEditingRecord] = useState<PayrollRecord | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // NEW: Security Gatekeeper
  useEffect(() => {
    const checkAccess = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      if (profile?.role !== 'owner' && profile?.role !== 'superadmin') {
        router.push('/unauthorized');
      }
    };
    checkAccess();
  }, [router]);

  const load = async () => {
    setIsLoading(true);
    try {
      const data = await payrollService.getPayrollByMonth(month);
      setPayroll(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [month]);

  const handleGenerate = async () => {
    try {
      await payrollService.generateMonthlyPayroll(month);
      load();
    } catch (err) {
      console.error("Generation failed:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        
        {/* Header Section: Responsive Flex Container */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <h1 className="text-2xl font-bold text-gray-800">Payroll Management</h1>
          
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <input 
              type="month" 
              value={month} 
              onChange={(e) => setMonth(e.target.value)} 
              className="border p-2.5 rounded-xl bg-white w-full sm:w-auto focus:ring-2 focus:ring-blue-500 outline-none" 
            />
            <button 
              onClick={() => setShowConfirm(true)}
              className="bg-green-600 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-green-700 transition shadow-md w-full sm:w-auto"
            >
              Generate Payroll
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center p-10 text-gray-500">Loading records...</div>
        ) : (
          <div className="space-y-6">
            <PayrollSummary payroll={payroll} />
            <div className="bg-white p-2 md:p-4 rounded-2xl shadow-sm border border-gray-100">
              <PayrollTable payroll={payroll} onEdit={setEditingRecord} />
            </div>
          </div>
        )}

        {/* Edit Modal */}
        {editingRecord && (
          <EditPayrollModal 
            record={editingRecord} 
            onClose={() => setEditingRecord(null)} 
            onSave={() => { load(); setEditingRecord(null); }} 
          />
        )}

        {/* Confirmation Modal */}
        <ConfirmModal 
          isOpen={showConfirm}
          onClose={() => setShowConfirm(false)}
          onConfirm={handleGenerate}
          title="Generate Payroll"
          message="Are you sure you want to generate payroll for all active workers for this month?"
        />
      </div>
    </div>
  );
}