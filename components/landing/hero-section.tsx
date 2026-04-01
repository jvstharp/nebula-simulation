"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

export function HeroSection() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 80);
    return () => clearTimeout(t);
  }, []);

  return (
    <section style={{ position: 'relative', height: '100vh', minHeight: 600, overflow: 'hidden', background: '#0c0c0e' }}>
      {/* Cinematic background image */}
      <Image
        src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=1920&q=85"
        alt="Modern tech office"
        fill
        priority
        style={{ objectFit: 'cover', objectPosition: 'center 40%' }}
        sizes="100vw"
      />

      {/* Vignette — corner darkening */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 1,
        background: 'radial-gradient(ellipse at center, transparent 25%, rgba(12,12,14,0.55) 65%, rgba(12,12,14,0.94) 100%)',
      }} />

      {/* Bottom fade — merges into page bg */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: '45%', zIndex: 2,
        background: 'linear-gradient(to top, #0c0c0e 0%, rgba(12,12,14,0.5) 60%, transparent 100%)',
      }} />

      {/* Top fade — softens top edge */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: '20%', zIndex: 2,
        background: 'linear-gradient(to bottom, rgba(12,12,14,0.5) 0%, transparent 100%)',
      }} />

      {/* Hero content */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 10,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: '80px 24px 120px',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(16px)',
        transition: 'opacity 0.7s ease, transform 0.7s ease',
      }}>
        {/* Badge */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          background: 'rgba(20,123,88,0.18)', border: '1px solid rgba(20,123,88,0.4)',
          borderRadius: 100, padding: '5px 14px', marginBottom: 28,
        }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#147b58', boxShadow: '0 0 6px #147b58' }} />
          <span style={{ fontSize: 11, fontWeight: 600, color: '#4ade80', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            AI-Powered &nbsp;·&nbsp; PM Career Training
          </span>
        </div>

        {/* Headline */}
        <h1 style={{
          fontSize: 'clamp(40px, 7vw, 76px)',
          fontWeight: 800, lineHeight: 1.05, letterSpacing: '-0.03em',
          color: '#f0f0f3', textAlign: 'center', maxWidth: 820, margin: '0 0 22px',
          textShadow: '0 2px 40px rgba(0,0,0,0.5)',
        }}>
          The Simulation That<br />
          <span style={{ color: '#34d399' }}>Prepares You</span> for<br />
          the Real Thing.
        </h1>

        {/* Subheadline */}
        <p style={{
          fontSize: 'clamp(15px, 2vw, 18px)',
          color: 'rgba(240,240,243,0.72)', lineHeight: 1.65,
          textAlign: 'center', maxWidth: 540, margin: '0 0 40px',
          textShadow: '0 1px 12px rgba(0,0,0,0.6)',
        }}>
          Step into a real company. Navigate real workplace politics.<br />
          Build the PM skills no textbook can teach.
        </p>

        {/* CTAs */}
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
          <Link
            href="/app"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: '#147b58', color: '#fff',
              fontSize: 14, fontWeight: 700, textDecoration: 'none',
              padding: '13px 28px', borderRadius: 10,
              boxShadow: '0 0 32px rgba(20,123,88,0.4)',
              transition: 'background 0.15s, transform 0.1s, box-shadow 0.15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = '#0f6347'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = '#147b58'; e.currentTarget.style.transform = 'translateY(0)'; }}
          >
            Try for Free
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M3 7h8M8 4l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
          <a
            href="#how-it-works"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: 'rgba(255,255,255,0.08)', color: 'rgba(240,240,243,0.85)',
              fontSize: 14, fontWeight: 600, textDecoration: 'none',
              padding: '13px 24px', borderRadius: 10,
              border: '1px solid rgba(255,255,255,0.14)',
              backdropFilter: 'blur(8px)',
              transition: 'background 0.15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.13)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; }}
          >
            How It Works
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M7 3v8M4 8l3 3 3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        </div>
      </div>

      {/* Featured Workplace Card — Netflix-style bottom-left */}
      <FeaturedCard visible={visible} />

      {/* Scroll indicator */}
      <div style={{
        position: 'absolute', bottom: 28, left: '50%', transform: 'translateX(-50%)',
        zIndex: 10, opacity: visible ? 0.5 : 0, transition: 'opacity 1s ease 1s',
        animation: visible ? 'heroBounce 2s ease-in-out infinite 1.5s' : 'none',
      }}>
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M5 8l5 5 5-5" stroke="#f0f0f3" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>

      <style>{`
        @keyframes heroBounce {
          0%, 100% { transform: translateX(-50%) translateY(0); }
          50% { transform: translateX(-50%) translateY(5px); }
        }
        @media (max-width: 640px) {
          .featured-card { display: none !important; }
        }
      `}</style>
    </section>
  );
}

function FeaturedCard({ visible }: { visible: boolean }) {
  const [cardVisible, setCardVisible] = useState(false);

  useEffect(() => {
    if (visible) {
      const t = setTimeout(() => setCardVisible(true), 900);
      return () => clearTimeout(t);
    }
  }, [visible]);

  return (
    <div
      className="featured-card"
      style={{
        position: 'absolute', bottom: 48, left: 40, zIndex: 10,
        maxWidth: 340, width: 'calc(100% - 80px)',
        background: 'rgba(12,12,14,0.88)',
        backdropFilter: 'blur(24px)',
        border: '1px solid rgba(255,255,255,0.10)',
        borderRadius: 16, padding: '20px 22px',
        opacity: cardVisible ? 1 : 0,
        transform: cardVisible ? 'translateY(0)' : 'translateY(12px)',
        transition: 'opacity 0.6s ease, transform 0.6s ease',
      }}
    >
      {/* Now playing label */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10,
      }}>
        <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 8px #22c55e', flexShrink: 0 }} />
        <span style={{ fontSize: 10, fontWeight: 700, color: '#22c55e', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
          Active Scenario
        </span>
      </div>

      {/* Company name */}
      <div style={{ fontSize: 20, fontWeight: 700, color: '#f0f0f3', marginBottom: 3, letterSpacing: '-0.02em' }}>
        Nexus Technologies
      </div>
      <div style={{ fontSize: 12, color: 'rgba(240,240,243,0.45)', marginBottom: 14, fontWeight: 500 }}>
        Series C &nbsp;·&nbsp; 300 employees &nbsp;·&nbsp; B2B SaaS
      </div>

      {/* Hook */}
      <p style={{
        fontSize: 13, lineHeight: 1.55, color: 'rgba(240,240,243,0.75)',
        margin: '0 0 16px', borderLeft: '2px solid rgba(20,123,88,0.6)', paddingLeft: 10,
        fontStyle: 'italic',
      }}>
        "Three roadmaps in conflict.<br />One board meeting Monday.<br />You have 10 days."
      </p>

      {/* Metadata pills */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 16 }}>
        {[
          { icon: '🎭', label: '5 AI Stakeholders' },
          { icon: '📊', label: '6 Scored Skills' },
          { icon: '⚡', label: 'Hidden Agendas' },
        ].map(({ icon, label }) => (
          <span key={label} style={{
            fontSize: 11, fontWeight: 500, color: 'rgba(240,240,243,0.65)',
            background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.10)',
            borderRadius: 100, padding: '3px 10px', display: 'inline-flex', alignItems: 'center', gap: 4,
          }}>
            {icon} {label}
          </span>
        ))}
      </div>

      {/* CTA */}
      <Link
        href="/app"
        style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          fontSize: 12, fontWeight: 700, color: '#34d399', textDecoration: 'none',
          transition: 'gap 0.15s',
        }}
        onMouseEnter={e => { e.currentTarget.style.gap = '10px'; }}
        onMouseLeave={e => { e.currentTarget.style.gap = '6px'; }}
      >
        Enter Simulation
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path d="M2 6h8M7 3l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </Link>
    </div>
  );
}
