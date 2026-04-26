'use client';
import { useState, useMemo } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { salesService } from '@/services/sales.service';
import { useToast } from '@/components/ui/Toast';
import { useAuth } from '@/hooks/useAuth';

export default function SalesForm({ onSuccess, initialData }: { onSuccess: () => void, initialData?: any }) {
  const { showToast } = useToast();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  // Form states for live calculation
  const [quantity, setQuantity] = useState(initialData?.quantity || 0);
  const [price, setPrice] = useState(initialData?.price || 0);

  // Auto-calculated read-only total
  const total = useMemo(() => quantity * price, [quantity, price]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Check if user is authenticated
    if (!user?.id) {
      showToast("You must be logged in to save a sale.", "error");
      return;
    }

    setLoading(true);

    // 1. Validation
    if (quantity <= 0) {
      showToast("Quantity must be greater than 0", "error");
      setLoading(false);
      return;
    }
    if (price <= 0) {
      showToast("Price must be greater than 0", "error");
      setLoading(false);
      return;
    }

    const formData = new FormData(e.currentTarget);
    const file = formData.get('receipt') as File;

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
        customer_name: formData.get('customer_name') as string,
        quantity,
        price,
        total,
        date: formData.get('date') as string,
        receipt_url: receiptUrl
      };

      // 3. Save/Update logic using the updated service signature
      if (initialData) {
        await salesService.update(initialData.id, saleData, user.id);
        showToast("Sale updated successfully", "success");
      } else {
        await salesService.create(saleData, user.id);
        showToast("Sale saved successfully", "success");
      }
      
      onSuccess();
    } catch (error: any) {
      console.error("Submission error:", error);
      showToast(error.message || "Failed to save sale", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 text-gray-800">
      <h2 className="text-xl font-bold mb-4 text-blue-900 border-b pb-2">
        {initialData ? "Edit Sale" : "Add New Sale"}
      </h2>
      
      <div>
        <label className="block text-sm font-medium mb-1 text-gray-700">Customer Name</label>
        <input name="customer_name" defaultValue={initialData?.customer_name} required className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-900 outline-none" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700">Quantity</label>
          <input name="quantity" type="number" value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} required className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-900 outline-none" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700">Price</label>
          <input name="price" type="number" value={price} onChange={(e) => setPrice(Number(e.target.value))} required className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-900 outline-none" />
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