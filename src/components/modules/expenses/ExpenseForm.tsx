'use client';
import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { expensesService } from '@/services/expenses.service';
import { useToast } from '@/components/ui/Toast';
import { useAuth } from '@/hooks/useAuth';

export default function ExpenseForm({ onSuccess, initialData }: { onSuccess: () => void, initialData?: any }) {
  const { showToast } = useToast();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const amount = parseFloat(formData.get('amount') as string);
    const category = formData.get('category') as string;
    const file = formData.get('receipt') as File;

    if (amount <= 0) {
      showToast("Amount must be greater than 0", "error");
      setLoading(false);
      return;
    }

    try {
      let receiptUrl = initialData?.receipt_url || null; // Keep old URL if editing

      // 1. Handle File Upload if a new file is provided
      if (file && file.size > 0) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}_${Math.random()}.${fileExt}`;
        
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('receipts')
          .upload(fileName, file);

        if (uploadError) throw new Error("Failed to upload receipt file.");

        const { data: urlData } = supabase.storage
          .from('receipts')
          .getPublicUrl(uploadData.path);
        
        receiptUrl = urlData.publicUrl;
      }

      const expenseData = {
        description: formData.get('description') as string,
        amount,
        category,
        date: formData.get('date') as string,
        created_by: user?.id || initialData?.created_by,
        receipt_url: receiptUrl 
      };

      if (initialData) {
        // UPDATED: Now passing user?.id as the third argument to the service
        await expensesService.update(initialData.id, expenseData, user?.id);
        showToast("Expense updated successfully", "success");
      } else {
        await expensesService.create(expenseData);
        showToast("Expense saved successfully", "success");
      }
      onSuccess();
    } catch (error: any) {
      console.error("Submission error:", error);
      showToast(error.message || "Failed to save expense", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-2 text-gray-800">
      <h2 className="text-xl font-bold mb-4 text-blue-900 border-b pb-2">
        {initialData ? "Edit Expense" : "Log New Expense"}
      </h2>
      
      <div>
        <label className="block text-sm font-medium mb-1 text-gray-700">Expense Name / Item</label>
        <input name="description" defaultValue={initialData?.description} required className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-900 outline-none" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700">Classification</label>
          <select name="category" defaultValue={initialData?.category} required className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-900 outline-none">
            <option value="">Select...</option>
            <option value="Raw Materials">Raw Materials</option>
            <option value="Packaging">Packaging</option>
            <option value="Transport">Transport</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700">Amount (Birr)</label>
          <input name="amount" type="number" defaultValue={initialData?.amount} step="0.01" required className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-900 outline-none" />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1 text-gray-700">Billing Date</label>
        <input name="date" type="date" defaultValue={initialData?.date || new Date().toISOString().split('T')[0]} className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-900 outline-none" />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1 text-gray-700">Attach Receipt</label>
        <input name="receipt" type="file" accept=".pdf,.jpg,.jpeg,.png" className="w-full p-2 border border-gray-300 rounded" />
      </div>

      <button type="submit" disabled={loading} className="w-full bg-blue-900 hover:bg-blue-800 text-white p-3 rounded font-bold transition shadow-md">
        {loading ? "Processing..." : (initialData ? "Update Expense" : "Log Expense to System")}
      </button>
    </form>
  );
}