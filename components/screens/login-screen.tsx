"use client";
import { useState } from "react";
import { useAppStore } from "@/lib/store";

export function LoginScreen() {
  const { setScreen, setUser } = useAppStore();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email || !password) { setError('Please fill in all fields.'); return; }
    if (mode === 'register' && !name) { setError('Please enter your name.'); return; }
    setLoading(true);

    try {
      const endpoint = mode === 'register' ? '/api/auth/register' : '/api/auth/login';
      const body = mode === 'register' ? { email, password, name } : { email, password };

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? 'Something went wrong. Please try again.');
        setLoading(false);
        return;
      }

      setUser({ name: data.user.name, email: data.user.email, credits: 10 });
      setScreen('onboarding');
    } catch {
      setError('Network error. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    height: 40,
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.10)',
    borderRadius: 8,
    padding: '0 12px',
    fontSize: 13.5,
    color: '#f0f0f3',
    outline: 'none',
    transition: 'border-color 150ms, background 150ms',
    fontFamily: 'inherit',
  };

  return (
    <div
      className="arc-bg"
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--bg-desktop)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Subtle concentric rings */}
      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
        {[320, 560, 800, 1040, 1280].map((s, i) => (
          <div key={i} style={{
            position: 'absolute',
            width: s, height: s,
            borderRadius: '50%',
            border: `1px solid rgba(255,255,255,${0.028 - i * 0.004})`,
          }} />
        ))}
        {/* Orange glow at bottom */}
        <div style={{ position: 'absolute', bottom: '-10%', left: '50%', transform: 'translateX(-50%)', width: 600, height: 300, borderRadius: '50%', background: 'radial-gradient(ellipse, rgba(20,123,88,0.07) 0%, transparent 70%)', pointerEvents: 'none' }} />
      </div>

      {/* Card */}
      <div style={{ position: 'relative', zIndex: 10, width: '100%', maxWidth: 360, margin: '0 16px' }}>
        {/* Wordmark */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            width: 44, height: 44, borderRadius: 12,
            background: 'rgba(20,123,88,0.12)',
            border: '1px solid rgba(20,123,88,0.25)',
            marginBottom: 16,
          }}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M10 2L3 7v6l7 5 7-5V7L10 2z" stroke="#147b58" strokeWidth="1.5" fill="rgba(20,123,88,0.15)" strokeLinejoin="round" />
              <circle cx="10" cy="10" r="2.5" fill="#147b58" />
            </svg>
          </div>
          <div style={{ fontSize: 22, fontWeight: 700, color: '#f0f0f3', letterSpacing: '-0.02em' }}>Nebula</div>
          <div style={{ fontSize: 13, color: 'rgba(240,240,243,0.40)', marginTop: 4 }}>Career Simulation Platform</div>
        </div>

        {/* Panel */}
        <div style={{
          background: '#111114',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 14,
          padding: 24,
          boxShadow: '0 24px 64px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.03)',
        }}>
          {/* Mode toggle */}
          <div style={{
            display: 'flex',
            background: 'rgba(255,255,255,0.04)',
            borderRadius: 8,
            padding: 3,
            marginBottom: 22,
          }}>
            {(['login', 'register'] as const).map(m => (
              <button
                key={m}
                onClick={() => setMode(m)}
                style={{
                  flex: 1,
                  padding: '6px 0',
                  fontSize: 13,
                  fontWeight: mode === m ? 600 : 400,
                  color: mode === m ? '#f0f0f3' : 'rgba(240,240,243,0.38)',
                  background: mode === m ? 'rgba(255,255,255,0.08)' : 'transparent',
                  border: 'none',
                  borderRadius: 6,
                  cursor: 'pointer',
                  transition: 'all 150ms',
                  fontFamily: 'inherit',
                }}
              >
                {m === 'login' ? 'Sign In' : 'Register'}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {mode === 'register' && (
              <input
                placeholder="Full name"
                value={name}
                onChange={e => setName(e.target.value)}
                style={inputStyle}
                onFocus={e => { e.target.style.borderColor = 'rgba(20,123,88,0.50)'; e.target.style.background = 'rgba(255,255,255,0.07)'; }}
                onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.10)'; e.target.style.background = 'rgba(255,255,255,0.05)'; }}
              />
            )}
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={e => setEmail(e.target.value)}
              style={inputStyle}
              onFocus={e => { e.target.style.borderColor = 'rgba(20,123,88,0.50)'; e.target.style.background = 'rgba(255,255,255,0.07)'; }}
              onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.10)'; e.target.style.background = 'rgba(255,255,255,0.05)'; }}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              style={inputStyle}
              onFocus={e => { e.target.style.borderColor = 'rgba(20,123,88,0.50)'; e.target.style.background = 'rgba(255,255,255,0.07)'; }}
              onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.10)'; e.target.style.background = 'rgba(255,255,255,0.05)'; }}
            />

            {error && (
              <div style={{ fontSize: 12, color: '#f87171', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.18)', borderRadius: 7, padding: '8px 12px' }}>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                height: 40,
                marginTop: 4,
                background: loading ? 'rgba(20,123,88,0.6)' : '#147b58',
                color: '#fff',
                fontSize: 13.5,
                fontWeight: 600,
                border: 'none',
                borderRadius: 8,
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'background 150ms',
                fontFamily: 'inherit',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
              }}
              onMouseEnter={e => { if (!loading) e.currentTarget.style.background = '#0f5e43'; }}
              onMouseLeave={e => { if (!loading) e.currentTarget.style.background = '#147b58'; }}
            >
              {loading ? (
                <>
                  <span style={{ width: 13, height: 13, border: '2px solid rgba(255,255,255,0.4)', borderTopColor: '#fff', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.8s linear infinite' }} />
                  Signing in...
                </>
              ) : (
                mode === 'login' ? 'Sign In' : 'Create Account'
              )}
            </button>
          </form>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '18px 0' }}>
            <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.07)' }} />
            <span style={{ fontSize: 11, color: 'rgba(240,240,243,0.22)' }}>or</span>
            <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.07)' }} />
          </div>

          <button
            onClick={() => setError('Google sign-in coming soon. Please use email and password.')}
            style={{
              width: '100%',
              height: 40,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.09)',
              borderRadius: 8,
              fontSize: 13, color: 'rgba(240,240,243,0.65)',
              cursor: 'pointer',
              fontFamily: 'inherit',
              transition: 'background 150ms, color 150ms',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = '#f0f0f3'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.color = 'rgba(240,240,243,0.65)'; }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </button>
        </div>

        <p style={{ textAlign: 'center', fontSize: 11, color: 'rgba(240,240,243,0.18)', marginTop: 20 }}>
          By continuing you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
}
