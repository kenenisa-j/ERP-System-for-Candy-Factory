'use client';
import { useEffect, useState } from 'react';
import { payrollService, PayrollRecord } from '@/services/payroll.service';
import PayrollTable from '@/components/modules/payroll/PayrollTable';
import PayrollSummary from '@/components/modules/payroll/PayrollSummary';
import EditPayrollModal from '@/components/modules/payroll/MarkPaidModal'; // Ensure this matches your component name
import ConfirmModal from '@/components/shared/ConfirmModal';

export default function PayrollPage() {
  const [payroll, setPayroll] = useState<PayrollRecord[]>([]);
  const [month, setMonth] = useState('2026-04');
  const [editingRecord, setEditingRecord] = useState<PayrollRecord | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

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
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Payroll Management</h1>
        <div className="flex gap-2">
          <input 
            type="month" 
            value={month} 
            onChange={(e) => setMonth(e.target.value)} 
            className="border p-2 rounded" 
          />
          <button 
            onClick={() => setShowConfirm(true)}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
          >
            Generate Payroll
          </button>
        </div>
      </div>

      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <>
          <PayrollSummary payroll={payroll} />
          <PayrollTable payroll={payroll} onEdit={setEditingRecord} />
        </>
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
  );
}