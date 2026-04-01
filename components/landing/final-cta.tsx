"use client";
import Link from "next/link";

export function FinalCTA() {
  return (
    <>
      {/* CTA section */}
      <section style={{
        background: '#0c0c0e', padding: '100px 24px 80px',
        borderTop: '1px solid rgba(255,255,255,0.05)',
      }}>
        <div style={{
          maxWidth: 600, margin: '0 auto', textAlign: 'center',
        }}>
          <div style={{
            fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase',
            color: '#147b58', marginBottom: 20,
          }}>
            Get Started
          </div>
          <h2 style={{
            fontSize: 'clamp(30px, 5vw, 52px)', fontWeight: 800, color: '#f0f0f3',
            margin: '0 0 20px', letterSpacing: '-0.03em', lineHeight: 1.1,
          }}>
            Your next PM interview<br />starts here.
          </h2>
          <p style={{
            fontSize: 15, color: 'rgba(240,240,243,0.5)', lineHeight: 1.65,
            margin: '0 0 40px',
          }}>
            One free simulation. No credit card. Real feedback in under 90 minutes.
          </p>

          <Link
            href="/app"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 10,
              background: '#147b58', color: '#fff',
              fontSize: 15, fontWeight: 700, textDecoration: 'none',
              padding: '15px 36px', borderRadius: 12,
              boxShadow: '0 0 48px rgba(20,123,88,0.35), 0 4px 24px rgba(0,0,0,0.4)',
              transition: 'background 0.15s, transform 0.1s, box-shadow 0.15s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = '#0f6347';
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 0 60px rgba(20,123,88,0.5), 0 8px 32px rgba(0,0,0,0.4)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = '#147b58';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 0 48px rgba(20,123,88,0.35), 0 4px 24px rgba(0,0,0,0.4)';
            }}
          >
            Start Free Demo
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M3 8h10M9 5l3 3-3 3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>

          <p style={{ fontSize: 12, color: 'rgba(240,240,243,0.28)', marginTop: 16 }}>
            Free · No credit card · Results in &lt;90 min
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        background: '#0c0c0e', borderTop: '1px solid rgba(255,255,255,0.06)',
        padding: '28px 40px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        flexWrap: 'wrap', gap: 16,
      }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <svg width="20" height="20" viewBox="0 0 32 32" fill="none">
            <polygon points="16,2 30,9 30,23 16,30 2,23 2,9" fill="none" stroke="#147b58" strokeWidth="2" />
            <circle cx="16" cy="16" r="3.5" fill="#147b58" />
          </svg>
          <span style={{ fontWeight: 700, fontSize: 14, color: 'rgba(240,240,243,0.6)', letterSpacing: '-0.01em' }}>
            Nebula
          </span>
        </div>

        {/* Nav links */}
        <div style={{ display: 'flex', gap: 24 }}>
          {['Terms', 'Privacy', 'Contact'].map(link => (
            <span key={link} style={{ fontSize: 12, color: 'rgba(240,240,243,0.28)', cursor: 'default' }}>
              {link}
            </span>
          ))}
        </div>

        {/* Copyright */}
        <div style={{ fontSize: 12, color: 'rgba(240,240,243,0.22)' }}>
          © 2025 Nebula Simulation
        </div>
      </footer>
    </>
  );
}
