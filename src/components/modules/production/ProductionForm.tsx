'use client';
import { useState } from 'react';
import { productionService } from '@/services/production.service';
import { useAuth } from '@/hooks/useAuth';
import { logActivity } from '@/lib/logger'; // Import the logger helper

export default function ProductionForm({ onSuccess, initialData }: { onSuccess: () => void, initialData?: any }) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null); 
    
    if (!user?.id) return;

    const formData = new FormData(e.currentTarget);
    const quantity = Number(formData.get('quantity'));
    const productName = formData.get('product_name') as string;
    
    if (quantity <= 0) {
      setError("Quantity must be greater than 0");
      return;
    }

    setLoading(true);

    const payload = {
      product_name: productName,
      quantity,
      date: formData.get('date'),
    };

    try {
      if (initialData?.id) {
        await productionService.update(initialData.id, payload, user.id);
      } else {
        await productionService.create(payload, user.id);
      }

      // Updated: Use the centralized logActivity helper
      await logActivity(
        initialData?.id ? 'Updated' : 'Logged',
        'Production',
        productName
      );

      onSuccess();
    } catch (err: any) {
      console.error("Submission error:", err);
      setError(err.message || "Failed to save data. Please check your permissions.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-6 bg-white">
      <h2 className="text-xl font-bold text-blue-900 border-b pb-2">
        {initialData ? "Edit Production" : "Log Production"}
      </h2>

      {error && (
        <div className="w-full p-3 text-sm text-red-700 bg-red-100 rounded border border-red-200 animate-in fade-in">
          {error}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700">Product Name</label>
        <input name="product_name" defaultValue={initialData?.product_name || "Candy"} required className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-900 outline-none" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Quantity</label>
        <input name="quantity" type="number" defaultValue={initialData?.quantity} required className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-900 outline-none" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Date</label>
        <input name="date" type="date" defaultValue={initialData?.date || new Date().toISOString().split('T')[0]} required className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-900 outline-none" />
      </div>
      
      <button 
        type="submit" 
        disabled={loading} 
        className="w-full bg-blue-900 hover:bg-blue-800 text-white p-3 rounded font-bold transition shadow-md disabled:opacity-50"
      >
        {loading ? "Processing..." : "Save Production"}
      </button>
    </form>
  );
}