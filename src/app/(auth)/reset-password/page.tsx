'use client';
import { useState } from 'react';
import { finalizePasswordChange } from '@/app/actions/auth.actions';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { Lock, ShieldCheck } from 'lucide-react'; // Make sure to install lucide-react if not present

export default function ChangePasswordPage() {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    
    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    setLoading(true);

    try {
      const result = await finalizePasswordChange(newPassword);
      if (result.error) throw new Error(result.error);
      window.location.href = '/sales'; 
    } catch (err: any) {
      setError(err.message || "Failed to update password.");
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Decorative side panel for desktop */}
      <div className="hidden lg:flex w-1/2 bg-blue-900 items-center justify-center p-12">
        <div className="text-white space-y-6 max-w-md">
          <ShieldCheck size={64} className="text-blue-400" />
          <h1 className="text-4xl font-bold">Candy ERP Security</h1>
          <p className="text-blue-200 text-lg">
            For your security, we require a password update after an admin reset or on your first login. Keep your workspace safe.
          </p>
        </div>
      </div>

      {/* Main form section */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4">
        <div className="w-full max-w-sm bg-white p-8 md:p-10 rounded-3xl shadow-xl border border-gray-100">
          <form onSubmit={handleReset} className="space-y-6">
            <div className="flex flex-col items-center text-center space-y-2">
              <div className="bg-blue-50 p-3 rounded-full mb-2">
                <Lock className="text-blue-700" size={24} />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Set New Password</h2>
              <p className="text-sm text-gray-500">Create a secure password for your account.</p>
            </div>
            
            {error && (
              <div className="p-3 rounded-xl bg-red-50 text-red-700 text-xs font-medium border border-red-100 text-center">
                {error}
              </div>
            )}
            
            <div className="space-y-4">
              <Input 
                type="password" 
                placeholder="New Password" 
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)} 
                required 
                className="h-12 bg-gray-50 border-gray-200 focus:bg-white transition-colors"
              />
              <Input 
                type="password" 
                placeholder="Confirm New Password" 
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)} 
                required 
                className="h-12 bg-gray-50 border-gray-200 focus:bg-white transition-colors"
              />
            </div>

            <Button 
              type="submit" 
              disabled={loading} 
              className="w-full h-12 font-semibold bg-blue-600 hover:bg-blue-700 rounded-xl shadow-lg shadow-blue-200 transition-all"
            >
              {loading ? 'Updating...' : 'Update & Continue'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}