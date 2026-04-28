'use client';
import { useState, useMemo } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { salesService } from '@/services/sales.service';
import { useToast } from '@/components/ui/Toast';
import { useAuth } from '@/hooks/useAuth';
import { logActivity } from '@/lib/logger'; // Import the logger helper

export default function SalesForm({ onSuccess, initialData }: { onSuccess: () => void, initialData?: any }) {
  const { showToast } = useToast();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null); // Added error state

  // Form states as strings to allow clearing the input
  const [quantity, setQuantity] = useState<string | number>(initialData?.quantity || '');
  const [price, setPrice] = useState<string | number>(initialData?.price || '');

  // Auto-calculated read-only total
  const total = useMemo(() => Number(quantity) * Number(price), [quantity, price]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null); // Reset error on submit
    
    // Check if user is authenticated
    if (!user?.id) {
      setError("You must be logged in to save a sale.");
      return;
    }

    setLoading(true);

    // 1. Validation
    if (Number(quantity) <= 0) {
      setError("Quantity must be greater than 0");
      setLoading(false);
      return;
    }
    if (Number(price) <= 0) {
      setError("Price must be greater than 0");
      setLoading(false);
      return;
    }

    const formData = new FormData(e.currentTarget);
    const file = formData.get('receipt') as File;
    const customerName = formData.get('customer_name') as string;

    try {
      let receiptUrl = initialData?.receipt_url || null;

      // 2. Handle File Upload
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

      const saleData = {
        customer_name: customerName,
        quantity: Number(quantity),
        price: Number(price),
        total,
        date: formData.get('date') as string,
        receipt_url: receiptUrl
      };

      // 3. Save/Update logic
      if (initialData) {
        await salesService.update(initialData.id, saleData, user.id);
        showToast("Sale updated successfully", "success");
      } else {
        await salesService.create(saleData, user.id);
        showToast("Sale saved successfully", "success");
      }

      // Updated: Use the centralized logActivity helper
      await logActivity(
        initialData ? 'Updated' : 'Added',
        'Sales',
        `Order for ${customerName}`
      );
      
      onSuccess();
    } catch (error: any) {
      console.error("Submission error:", error);
      setError(error.message || "Failed to save sale");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 text-gray-800">
      <h2 className="text-xl font-bold mb-4 text-blue-900 border-b pb-2">
        {initialData ? "Edit Sale" : "Add New Sale"}
      </h2>

      {/* Error Message Display */}
      {error && (
        <div className="p-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded">
          {error}
        </div>
      )}
      
      <div>
        <label className="block text-sm font-medium mb-1 text-gray-700">Customer Name</label>
        <input name="customer_name" defaultValue={initialData?.customer_name} required className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-900 outline-none" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700">Quantity</label>
          <input name="quantity" type="number" placeholder="0" value={quantity} onChange={(e) => setQuantity(e.target.value)} required className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-900 outline-none" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700">Price</label>
          <input name="price" type="number" placeholder="0" value={price} onChange={(e) => setPrice(e.target.value)} required className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-900 outline-none" />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1 text-gray-700">Total (Read-Only)</label>
        <input type="number" value={total} readOnly className="w-full p-2 border border-gray-300 rounded bg-gray-100 font-bold" />
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
        {loading ? "Processing..." : (initialData ? "Update Sale" : "Save Sale")}
      </button>
    </form>
  );
}