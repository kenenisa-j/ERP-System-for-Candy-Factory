'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import { Lock, Mail, Eye, EyeOff, ShieldCheck, Sparkles, ArrowRight, Loader2 } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // 1. Attempt login
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    // 2. Fetch profile to check role AND must_change_password flag
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role, must_change_password')
      .eq('id', authData.user!.id)
      .single();

    if (profileError) {
      setError('Could not load user profile');
      await supabase.auth.signOut();
      setLoading(false);
      return;
    }

    // 3. Authorization & Forced Password Reset Logic
    if (profile.must_change_password) {
      router.push('/reset-password');
      return;
    }

    if (profile.role === 'owner' || profile.role === 'superadmin') {
      router.push('/dashboard');
    } else if (profile.role === 'staff') {
      router.push('/sales');
    } else {
      setError('Unauthorized role access');
      await supabase.auth.signOut();
      setLoading(false);
    }
  };

  const fillQuickAccount = (quickEmail: string) => {
    setEmail(quickEmail);
    setPassword('CandyTest@2026!');
    setError(null);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-slate-900 via-indigo-950 to-purple-950 relative overflow-hidden p-4 sm:p-6">
      {/* Background Decorative Glow Elements */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-purple-600/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-blue-600/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main Glassmorphic Container */}
      <div className="w-full max-w-md bg-white/95 backdrop-blur-2xl p-8 sm:p-10 rounded-3xl shadow-2xl border border-white/40 relative z-10 space-y-6">
        
        {/* Brand Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/30 mb-1">
            <Sparkles className="w-8 h-8 animate-pulse" />
          </div>
          <div>
            <h1 className="text-3xl font-black tracking-tight text-gray-900">
              Candy <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">ERP</span>
            </h1>
            <p className="text-sm font-medium text-gray-500 mt-1">
              Enterprise Factory Management System
            </p>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-4 text-xs font-semibold text-red-700 bg-red-50/90 border border-red-200/80 rounded-2xl flex items-center gap-3 animate-shake shadow-sm">
            <div className="w-2 h-2 rounded-full bg-red-600 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          {/* Email Input */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="email"
                placeholder="name@candyerp.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-3 bg-gray-50/80 border border-gray-200 rounded-xl text-sm font-medium text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-600 focus:bg-white transition-all"
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-10 pr-11 py-3 bg-gray-50/80 border border-gray-200 rounded-xl text-sm font-medium text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-600 focus:bg-white transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600 transition"
                aria-label="Toggle password visibility"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3.5 px-4 bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-700 hover:from-indigo-700 hover:to-purple-800 text-white font-bold text-sm rounded-xl shadow-lg shadow-indigo-600/30 hover:shadow-indigo-600/50 active:scale-[0.99] disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2 group"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Authenticating...</span>
              </>
            ) : (
              <>
                <span>Sign In to Dashboard</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>

        {/* Quick Test Accounts Selector */}
        <div className="pt-4 border-t border-gray-100">
          <p className="text-center text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2.5">
            Quick Fill Demo Accounts
          </p>
          <div className="grid grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={() => fillQuickAccount('owner.test@candyerp.test')}
              className="px-3 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold rounded-xl border border-indigo-200/60 transition text-center truncate flex items-center justify-center gap-1.5"
            >
              <span>⚡ Admin Account</span>
            </button>
            <button
              type="button"
              onClick={() => fillQuickAccount('staff.test@candyerp.test')}
              className="px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-semibold rounded-xl border border-blue-200/60 transition text-center truncate flex items-center justify-center gap-1.5"
            >
              <span>👥 Staff Account</span>
            </button>
          </div>
        </div>

        {/* Security Footer Badge */}
        <div className="flex items-center justify-center gap-1.5 text-[11px] font-medium text-gray-400 pt-1">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Protected by 256-Bit RLS & Supabase Auth</span>
        </div>

      </div>
    </div>
  );
}