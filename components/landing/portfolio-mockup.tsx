"use client";
import { useEffect, useRef, useState } from "react";

function useInView(threshold = 0.2) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true); }, { threshold });
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, inView };
}

const SKILL_DELTAS = [
  { name: 'Strategic Thinking', score: 83, delta: '+17', color: '#147b58' },
  { name: 'Stakeholder Mgmt',  score: 78, delta: '+11', color: '#0891b2' },
  { name: 'Prioritisation',    score: 81, delta: '+9',  color: '#7c3aed' },
  { name: 'Communication',     score: 74, delta: '+6',  color: '#db2777' },
];

export function PortfolioMockup() {
  const { ref, inView } = useInView(0.15);

  return (
    <section style={{ background: '#0c0c0e', padding: '100px 24px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
      <div style={{ maxWidth: 1080, margin: '0 auto' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <div style={{
            fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase',
            color: '#147b58', marginBottom: 14,
          }}>
            What You Leave With
          </div>
          <h2 style={{
            fontSize: 'clamp(26px, 3.5vw, 42px)', fontWeight: 700, color: '#f0f0f3',
            margin: '0 0 16px', letterSpacing: '-0.025em', lineHeight: 1.15,
          }}>
            Your decisions, scored and verified.
          </h2>
          <p style={{ fontSize: 15, color: 'rgba(240,240,243,0.5)', maxWidth: 500, margin: '0 auto', lineHeight: 1.65 }}>
            Every session produces a shareable portfolio case study. Not a certificate — a record of how you actually think.
          </p>
        </div>

        {/* Portfolio card mockup */}
        <div
          ref={ref}
          style={{
            maxWidth: 680, margin: '0 auto',
            background: '#111114', border: '1px solid rgba(255,255,255,0.09)',
            borderRadius: 20, overflow: 'hidden',
            boxShadow: '0 32px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04)',
            opacity: inView ? 1 : 0,
            transform: inView ? 'translateY(0)' : 'translateY(24px)',
            transition: 'opacity 0.7s ease, transform 0.7s ease',
          }}
        >
          {/* Card header */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(20,123,88,0.2) 0%, rgba(8,145,178,0.1) 100%)',
            borderBottom: '1px solid rgba(255,255,255,0.07)',
            padding: '24px 28px',
            display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12,
          }}>
            <div>
              <div style={{
                fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase',
                color: '#34d399', marginBottom: 6,
              }}>
                ✦ AI-Verified Portfolio Case Study
              </div>
              <div style={{ fontSize: 18, fontWeight: 700, color: '#f0f0f3', letterSpacing: '-0.02em' }}>
                Roadmap Reckoning
              </div>
              <div style={{ fontSize: 12, color: 'rgba(240,240,243,0.45)', marginTop: 2 }}>
                Nexus Technologies · Q3 2025
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 36, fontWeight: 800, color: '#f0f0f3', lineHeight: 1, letterSpacing: '-0.04em' }}>81</div>
              <div style={{ fontSize: 11, color: 'rgba(240,240,243,0.4)', fontWeight: 500 }}>/100</div>
              <div style={{
                fontSize: 11, fontWeight: 700, color: '#22c55e', marginTop: 4,
                background: 'rgba(34,197,94,0.12)', border: '1px solid rgba(34,197,94,0.25)',
                borderRadius: 100, padding: '2px 10px', display: 'inline-block',
              }}>
                Top 15% of PMs
              </div>
            </div>
          </div>

          {/* Narrative excerpt */}
          <div style={{ padding: '22px 28px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            <p style={{
              fontSize: 13.5, color: 'rgba(240,240,243,0.72)', lineHeight: 1.7, margin: 0,
              fontStyle: 'italic',
            }}>
              "Maya navigated one of the most information-dense scenarios in the library with a level of investigative rigour that separates the{' '}
              <span style={{ color: '#34d399', fontStyle: 'normal', fontWeight: 600 }}>top 15% of PMs at this experience level</span>
              . The defining pattern was treating first-order information as a starting point rather than a conclusion — she built trust systematically to unlock the WorkOS alternative and the $3M clawback context before making any recommendation."
            </p>
          </div>

          {/* Skill deltas */}
          <div style={{ padding: '20px 28px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(240,240,243,0.35)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 14 }}>
              Skills vs. Baseline
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px 24px' }}>
              {SKILL_DELTAS.map(s => (
                <div key={s.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 12, color: 'rgba(240,240,243,0.6)' }}>{s.name}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: s.color }}>{s.score}</span>
                    <span style={{
                      fontSize: 10, fontWeight: 700, color: '#22c55e',
                      background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)',
                      borderRadius: 100, padding: '1px 6px',
                    }}>
                      {s.delta}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div style={{
            padding: '16px 28px', display: 'flex', justifyContent: 'space-between',
            alignItems: 'center', flexWrap: 'wrap', gap: 8,
          }}>
            <span style={{ fontSize: 11, color: 'rgba(240,240,243,0.25)', fontFamily: 'monospace' }}>
              Verification ID: #VER-7f2a94e1-3b8c...
            </span>
            <div style={{ display: 'flex', gap: 8 }}>
              <div style={{
                fontSize: 11, fontWeight: 600, color: 'rgba(240,240,243,0.6)',
                background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.10)',
                borderRadius: 8, padding: '5px 12px', cursor: 'default',
              }}>
                Share
              </div>
              <div style={{
                fontSize: 11, fontWeight: 600, color: '#f0f0f3',
                background: '#147b58', borderRadius: 8, padding: '5px 12px', cursor: 'default',
              }}>
                Add to LinkedIn
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
