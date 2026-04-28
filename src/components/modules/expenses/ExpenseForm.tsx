'use client';
import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { expensesService } from '@/services/expenses.service';
import { useToast } from '@/components/ui/Toast';
import { useAuth } from '@/hooks/useAuth';
import { logActivity } from '@/lib/logger'; 

export default function ExpenseForm({ onSuccess, initialData }: { onSuccess: () => void, initialData?: any }) {
  const { showToast } = useToast();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    
    // Safety check: Ensure user is logged in before allowing submission
    if (!user) {
      setError("You must be logged in to log an expense.");
      return;
    }

    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const amount = parseFloat(formData.get('amount') as string);
    const category = formData.get('category') as string;
    const file = formData.get('receipt') as File;
    const description = formData.get('description') as string;
    const date = formData.get('date') as string;

    if (amount <= 0 || isNaN(amount)) {
      setError("Amount must be greater than 0");
      setLoading(false);
      return;
    }

    try {
      let receiptUrl = initialData?.receipt_url || null; 

      // Handle file upload if a new file is provided
      if (file && file.size > 0) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}_${Math.random()}.${fileExt}`;
        
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('receipts')
          .upload(fileName, file);

        if (uploadError) throw new Error("Failed to upload receipt file: " + uploadError.message);

        const { data: urlData } = supabase.storage
          .from('receipts')
          .getPublicUrl(uploadData.path);
        
        receiptUrl = urlData.publicUrl;
      }

      // Explicitly set created_by to user.id. 
      // Do not fallback to initialData?.created_by for new records.
      const expenseData = {
        description,
        amount,
        category,
        date,
        created_by: user.id, 
        receipt_url: receiptUrl 
      };

      if (initialData) {
        await expensesService.update(initialData.id, expenseData, user.id);
        showToast("Expense updated successfully", "success");
      } else {
        await expensesService.create(expenseData);
        showToast("Expense saved successfully", "success");
      }

      await logActivity(
        initialData ? 'Updated' : 'Added',
        'Expenses',
        description
      );

      onSuccess();
    } catch (error: any) {
      console.error("Submission error:", error);
      setError(error.message || "Failed to save expense");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 text-gray-800">
      <h2 className="text-xl font-bold mb-4 text-blue-900 border-b pb-2">
        {initialData ? "Edit Expense" : "Log New Expense"}
      </h2>

      {error && (
        <div className="p-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded">
          {error}
        </div>
      )}
      
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
          <input name="amount" type="number" placeholder="0" defaultValue={initialData?.amount} step="0.01" required className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-900 outline-none" />
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