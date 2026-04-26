'use client';
import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

export default function ChangePasswordPage() {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation: Ensure passwords match
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    
    // Validation: Check length
    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    setLoading(true);

    try {
      // 1. Update password in Auth
      const { error: updateError } = await supabase.auth.updateUser({ password: newPassword });
      if (updateError) throw updateError;

      // 2. Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not found.");

      // 3. Update profile flag
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ must_change_password: false })
        .eq('id', user.id);
      
      if (profileError) throw profileError;

      alert("Security updated successfully!");
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || "Failed to update password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <form onSubmit={handleReset} className="w-full max-w-sm bg-white p-8 rounded-2xl shadow-lg space-y-5">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold text-blue-900">Secure Your Account</h2>
          <p className="text-sm text-gray-500">Please set a new password to continue to your dashboard.</p>
        </div>
        
        {error && <p className="text-red-500 text-sm font-medium bg-red-50 p-2 rounded">{error}</p>}
        
        <div className="space-y-3">
          <Input 
            type="password" 
            placeholder="New Password" 
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)} 
            required 
          />
          <Input 
            type="password" 
            placeholder="Confirm New Password" 
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)} 
            required 
          />
        </div>

        <Button 
          type="submit" 
          disabled={loading} 
          className="w-full bg-blue-700 hover:bg-blue-800 transition"
        >
          {loading ? 'Updating...' : 'Update & Continue'}
        </Button>
      </form>
    </div>
  );
}