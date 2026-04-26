'use client';
import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // 1. Attempt login
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email, password
    });

    if (authError) { 
      alert(authError.message); 
      setLoading(false); 
      return; 
    }

    // 2. Fetch profile to check role
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', authData.user!.id)
      .single();

    if (profileError) { 
      alert("Could not load user profile"); 
      await supabase.auth.signOut();
      setLoading(false); 
      return; 
    }

    // 3. Authorization Logic
    if (profile.role === 'staff' || profile.role === 'superadmin') {
      // We don't need manual redirect logic for /change-password here
      // The Middleware will handle the redirect if must_change_password is true!
      router.push('/dashboard');
    } else {
      alert("Unauthorized role");
      await supabase.auth.signOut();
    }
    
    setLoading(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <form onSubmit={handleLogin} className="w-full max-w-sm bg-white p-8 rounded-2xl shadow-xl space-y-4">
        <h1 className="text-2xl font-bold text-center text-blue-900">Candy ERP Login</h1>
        <Input 
          type="email" 
          placeholder="Email address" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          required 
        />
        <Input 
          type="password" 
          placeholder="Password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          required 
        />
        <Button type="submit" disabled={loading} className="w-full">
          {loading ? 'Authenticating...' : 'Sign In'}
        </Button>
      </form>
    </div>
  );
}