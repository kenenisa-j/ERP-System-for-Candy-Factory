'use client';
import { useState } from 'react';
import { payrollService, PayrollRecord } from '@/services/payroll.service';

export default function EditPayrollModal({ 
  record, 
  onClose, 
  onSave 
}: { 
  record: PayrollRecord, 
  onClose: () => void, 
  onSave: () => void 
}) {
  const [formData, setFormData] = useState({
    overtime_hours: record.overtime_hours || 0,
    overtime_rate: record.overtime_rate || 0,
    bonus: record.bonus || 0,
    deductions: record.deductions || 0,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async () => {
    const newErrors: Record<string, string> = {};
    if (formData.overtime_hours < 0) newErrors.overtime_hours = "Hours cannot be negative";
    if (formData.bonus < 0) newErrors.bonus = "Bonus cannot be negative";
    if (formData.deductions < 0) newErrors.deductions = "Deductions cannot be negative";
    if (formData.overtime_rate < 0) newErrors.overtime_rate = "Rate cannot be negative";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    try {
      await payrollService.updatePayroll(record.id, formData);
      onSave(); 
      onClose();
    } catch (err) {
      console.error("Update failed:", err);
    }
  };

  const handleInputChange = (field: string, value: number) => {
    setFormData({ ...formData, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl">
        <h2 className="text-lg font-bold mb-4">Edit Payroll: {record.workers?.full_name}</h2>
        
        <div className="space-y-4">
          {['overtime_hours', 'overtime_rate', 'bonus', 'deductions'].map((field) => (
            <div key={field}>
              <label className="block text-xs uppercase text-gray-500 font-semibold mb-1">
                {field.replace('_', ' ')}
              </label>
              <input 
                type="text"
                inputMode="decimal"
                className={`w-full border p-2 rounded outline-none transition-colors ${
                  errors[field] ? 'border-red-500 focus:ring-1 ring-red-500' : 'border-gray-300 focus:border-blue-500'
                }`} 
                value={formData[field as keyof typeof formData]} 
                onChange={(e) => {
                  // Only allow digits and one decimal point
                  const val = e.target.value.replace(/[^0-9.]/g, '');
                  handleInputChange(field, val === '' ? 0 : Number(val));
                }} 
              />
              {errors[field] && <p className="text-red-500 text-xs mt-1">{errors[field]}</p>}
            </div>
          ))}
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded">Cancel</button>
          <button 
            onClick={handleSubmit} 
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            Save & Recalculate
          </button>
        </div>
      </div>
    </div>
  );
}