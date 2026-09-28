'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import { Lock, Mail, Eye, EyeOff, ArrowRight, Loader2, ShieldCheck } from 'lucide-react';

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
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif" }}>

      {/* ── LEFT PANEL: matches sidebar bg-gray-900 ── */}
      <div style={{
        display: 'none',
        width: '420px',
        flexShrink: 0,
        flexDirection: 'column',
        justifyContent: 'space-between',
        backgroundColor: '#111827', // gray-900
        padding: '48px 40px',
        position: 'relative',
        overflow: 'hidden',
      }}
        className="lg-panel"
      >
        {/* Subtle glow blobs */}
        <div style={{
          position: 'absolute', top: '-100px', right: '-100px',
          width: '350px', height: '350px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(96,165,250,0.08) 0%, transparent 70%)',
          pointerEvents: 'none'
        }} />
        <div style={{
          position: 'absolute', bottom: '-80px', left: '-80px',
          width: '280px', height: '280px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(59,130,246,0.07) 0%, transparent 70%)',
          pointerEvents: 'none'
        }} />

        {/* Centered brand mark only */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1, gap: '20px' }}>
          <div style={{
            width: '80px', height: '80px', borderRadius: '22px',
            background: 'linear-gradient(135deg, #2563eb, #60a5fa)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 40px rgba(59,130,246,0.3), 0 0 80px rgba(59,130,246,0.12)'
          }}>
            <span style={{ fontSize: '36px' }}>🍬</span>
          </div>
          <div style={{ textAlign: 'center' }}>
            <h2 style={{ color: '#60a5fa', fontSize: '28px', fontWeight: 900, letterSpacing: '-0.5px', margin: 0 }}>
              Candy ERP
            </h2>
            <p style={{ color: '#374151', fontSize: '13px', marginTop: '6px', fontWeight: 500 }}>
              Enterprise Factory Management
            </p>
          </div>
        </div>
      </div>

      {/* ── RIGHT PANEL: Clean white form ── */}
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f9fafb',
        padding: '32px 24px',
      }}>
        <div style={{ width: '100%', maxWidth: '400px' }}>

          {/* Mobile brand */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '36px' }}>
            <div style={{
              width: '36px', height: '36px', borderRadius: '9px',
              background: 'linear-gradient(135deg, #3b82f6, #60a5fa)',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <span style={{ fontSize: '16px' }}>🍬</span>
            </div>
            <span style={{ fontSize: '18px', fontWeight: 800, color: '#111827' }}>Candy ERP</span>
          </div>

          {/* Heading */}
          <div style={{ marginBottom: '28px' }}>
            <h1 style={{
              fontSize: '26px', fontWeight: 800, color: '#111827',
              letterSpacing: '-0.5px', margin: 0, marginBottom: '6px'
            }}>
              Sign in to your account
            </h1>
            <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>
              Welcome back — enter your credentials below
            </p>
          </div>

          {/* Error banner */}
          {error && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: '10px',
              padding: '12px 16px', borderRadius: '10px',
              background: '#fef2f2', border: '1px solid #fecaca',
              marginBottom: '20px'
            }}>
              <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#ef4444', flexShrink: 0 }} />
              <p style={{ fontSize: '13px', color: '#b91c1c', fontWeight: 500, margin: 0 }}>{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>

            {/* Email */}
            <div>
              <label style={{
                display: 'block', fontSize: '12px', fontWeight: 700,
                color: '#374151', marginBottom: '7px',
                letterSpacing: '0.6px', textTransform: 'uppercase'
              }}>
                Email Address
              </label>
              <div style={{ position: 'relative' }}>
                <span style={{
                  position: 'absolute', left: '14px', top: '50%',
                  transform: 'translateY(-50%)', color: '#9ca3af', pointerEvents: 'none',
                  display: 'flex'
                }}>
                  <Mail size={15} />
                </span>
                <input
                  id="login-email"
                  type="email"
                  placeholder="name@candyerp.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  style={{
                    width: '100%', boxSizing: 'border-box',
                    paddingLeft: '40px', paddingRight: '16px',
                    paddingTop: '12px', paddingBottom: '12px',
                    fontSize: '14px', color: '#111827',
                    background: '#fff', border: '1.5px solid #e5e7eb',
                    borderRadius: '10px', outline: 'none',
                    transition: 'border-color 0.18s, box-shadow 0.18s'
                  }}
                  onFocus={e => {
                    e.target.style.borderColor = '#3b82f6';
                    e.target.style.boxShadow = '0 0 0 3px rgba(59,130,246,0.12)';
                  }}
                  onBlur={e => {
                    e.target.style.borderColor = '#e5e7eb';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label style={{
                display: 'block', fontSize: '12px', fontWeight: 700,
                color: '#374151', marginBottom: '7px',
                letterSpacing: '0.6px', textTransform: 'uppercase'
              }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <span style={{
                  position: 'absolute', left: '14px', top: '50%',
                  transform: 'translateY(-50%)', color: '#9ca3af', pointerEvents: 'none',
                  display: 'flex'
                }}>
                  <Lock size={15} />
                </span>
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  style={{
                    width: '100%', boxSizing: 'border-box',
                    paddingLeft: '40px', paddingRight: '46px',
                    paddingTop: '12px', paddingBottom: '12px',
                    fontSize: '14px', color: '#111827',
                    background: '#fff', border: '1.5px solid #e5e7eb',
                    borderRadius: '10px', outline: 'none',
                    transition: 'border-color 0.18s, box-shadow 0.18s'
                  }}
                  onFocus={e => {
                    e.target.style.borderColor = '#3b82f6';
                    e.target.style.boxShadow = '0 0 0 3px rgba(59,130,246,0.12)';
                  }}
                  onBlur={e => {
                    e.target.style.borderColor = '#e5e7eb';
                    e.target.style.boxShadow = 'none';
                  }}
                />
                <button
                  type="button"
                  id="toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute', right: '12px', top: '50%',
                    transform: 'translateY(-50%)', background: 'none',
                    border: 'none', cursor: 'pointer', color: '#9ca3af',
                    padding: '4px', display: 'flex', alignItems: 'center'
                  }}
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {/* Submit button — blue to match sidebar accent */}
            <button
              id="login-submit"
              type="submit"
              disabled={loading}
              style={{
                width: '100%', marginTop: '4px',
                padding: '13px 24px',
                background: loading
                  ? '#93c5fd'
                  : 'linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)',
                color: '#fff', fontWeight: 700, fontSize: '14px',
                borderRadius: '10px', border: 'none',
                cursor: loading ? 'not-allowed' : 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                boxShadow: loading ? 'none' : '0 4px 16px rgba(37,99,235,0.35)',
                transition: 'all 0.2s', letterSpacing: '0.2px'
              }}
              onMouseEnter={e => {
                if (!loading) {
                  (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 6px 22px rgba(37,99,235,0.5)';
                  (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-1px)';
                }
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 4px 16px rgba(37,99,235,0.35)';
                (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)';
              }}
            >
              {loading ? (
                <>
                  <Loader2 size={15} className="animate-spin" />
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <span>Sign In to Dashboard</span>
                  <ArrowRight size={15} />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '24px 0' }}>
            <div style={{ flex: 1, height: '1px', background: '#e5e7eb' }} />
            <span style={{
              fontSize: '10px', color: '#9ca3af', fontWeight: 700,
              letterSpacing: '1.2px', textTransform: 'uppercase'
            }}>Demo Accounts</span>
            <div style={{ flex: 1, height: '1px', background: '#e5e7eb' }} />
          </div>

          {/* Quick fill buttons */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <button
              id="quick-admin"
              type="button"
              onClick={() => fillQuickAccount('owner.test@candyerp.test')}
              style={{
                padding: '10px 14px', background: '#fff',
                border: '1.5px solid #bfdbfe', borderRadius: '10px',
                fontSize: '12px', fontWeight: 600, color: '#1d4ed8',
                cursor: 'pointer', transition: 'all 0.18s',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px'
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLButtonElement).style.background = '#eff6ff';
                (e.currentTarget as HTMLButtonElement).style.borderColor = '#93c5fd';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLButtonElement).style.background = '#fff';
                (e.currentTarget as HTMLButtonElement).style.borderColor = '#bfdbfe';
              }}
            >
              ⚡ Admin Account
            </button>
            <button
              id="quick-staff"
              type="button"
              onClick={() => fillQuickAccount('staff.test@candyerp.test')}
              style={{
                padding: '10px 14px', background: '#fff',
                border: '1.5px solid #bfdbfe', borderRadius: '10px',
                fontSize: '12px', fontWeight: 600, color: '#1d4ed8',
                cursor: 'pointer', transition: 'all 0.18s',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px'
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLButtonElement).style.background = '#eff6ff';
                (e.currentTarget as HTMLButtonElement).style.borderColor = '#93c5fd';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLButtonElement).style.background = '#fff';
                (e.currentTarget as HTMLButtonElement).style.borderColor = '#bfdbfe';
              }}
            >
              👥 Staff Account
            </button>
          </div>

          {/* Security note */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            gap: '6px', marginTop: '24px'
          }}>
            <ShieldCheck size={13} color="#10b981" />
            <span style={{ fontSize: '11px', color: '#9ca3af' }}>
              Protected by 256-Bit RLS &amp; Supabase Auth
            </span>
          </div>

        </div>
      </div>

      {/* Responsive CSS for left panel */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        @media (min-width: 1024px) {
          .lg-panel { display: flex !important; }
        }
      `}</style>
    </div>
  );
}