"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

export function LandingNav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav
      style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        transition: 'background 0.3s, border-color 0.3s, backdrop-filter 0.3s',
        background: scrolled ? 'rgba(12,12,14,0.88)' : 'transparent',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(255,255,255,0.07)' : '1px solid transparent',
        padding: '0 32px',
        height: 64,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      {/* Logo */}
      <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
        <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
          <polygon points="16,2 30,9 30,23 16,30 2,23 2,9" fill="none" stroke="#147b58" strokeWidth="2" />
          <polygon points="16,8 24,12 24,20 16,24 8,20 8,12" fill="#147b58" opacity="0.25" />
          <circle cx="16" cy="16" r="3.5" fill="#147b58" />
        </svg>
        <span style={{ fontWeight: 700, fontSize: 17, color: '#f0f0f3', letterSpacing: '-0.02em' }}>
          Nebula
        </span>
      </Link>

      {/* Desktop nav */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }} className="landing-nav-links">
        <Link
          href="/app"
          style={{
            fontSize: 13, fontWeight: 500, color: 'rgba(240,240,243,0.65)',
            padding: '8px 16px', borderRadius: 8, textDecoration: 'none',
            transition: 'color 0.15s',
          }}
          onMouseEnter={e => (e.currentTarget.style.color = '#f0f0f3')}
          onMouseLeave={e => (e.currentTarget.style.color = 'rgba(240,240,243,0.65)')}
        >
          Sign In
        </Link>
        <Link
          href="/app"
          style={{
            fontSize: 13, fontWeight: 600, color: '#fff',
            padding: '8px 20px', borderRadius: 8, textDecoration: 'none',
            background: '#147b58',
            transition: 'background 0.15s, transform 0.1s',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = '#0f6347'; }}
          onMouseLeave={e => { e.currentTarget.style.background = '#147b58'; }}
        >
          Try for Free
        </Link>
      </div>

      {/* Mobile hamburger */}
      <button
        className="landing-nav-hamburger"
        onClick={() => setMenuOpen(!menuOpen)}
        style={{
          display: 'none',
          background: 'none', border: 'none', cursor: 'pointer',
          padding: 8, color: '#f0f0f3',
        }}
        aria-label="Menu"
      >
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
          {menuOpen ? (
            <>
              <line x1="4" y1="4" x2="18" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <line x1="18" y1="4" x2="4" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </>
          ) : (
            <>
              <line x1="3" y1="6" x2="19" y2="6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <line x1="3" y1="11" x2="19" y2="11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <line x1="3" y1="16" x2="19" y2="16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </>
          )}
        </svg>
      </button>

      {/* Mobile menu */}
      {menuOpen && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 99,
          background: 'rgba(12,12,14,0.97)',
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          gap: 24,
        }}>
          <Link href="/app" onClick={() => setMenuOpen(false)}
            style={{ fontSize: 28, fontWeight: 600, color: 'rgba(240,240,243,0.8)', textDecoration: 'none' }}>
            Sign In
          </Link>
          <Link href="/app" onClick={() => setMenuOpen(false)}
            style={{ fontSize: 28, fontWeight: 600, color: '#147b58', textDecoration: 'none' }}>
            Try for Free
          </Link>
        </div>
      )}

      <style>{`
        @media (max-width: 640px) {
          .landing-nav-links { display: none !important; }
          .landing-nav-hamburger { display: flex !important; }
        }
      `}</style>
    </nav>
  );
}
