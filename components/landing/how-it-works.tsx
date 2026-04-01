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

const STEPS = [
  {
    number: '01',
    title: 'Join the Company',
    description: 'Answer 6 questions. Nova, our AI guide, builds your role, sets your difficulty level, and drops you into Nexus Technologies on Day 1.',
    Mockup: OnboardingMockup,
  },
  {
    number: '02',
    title: 'Navigate Real Politics',
    description: 'Email and chat with 5 AI characters. Each has a hidden agenda. Build trust to unlock the information that changes everything.',
    Mockup: ChatMockup,
  },
  {
    number: '03',
    title: 'Earn Your Profile',
    description: "Leave with an AI-verified portfolio case study. Six skill scores. One benchmark. It's yours to share.",
    Mockup: ScoreMockup,
  },
];

export function HowItWorks() {
  const { ref, inView } = useInView(0.1);

  return (
    <section id="how-it-works" style={{ background: '#0c0c0e', padding: '100px 24px' }}>
      <div style={{ maxWidth: 1080, margin: '0 auto' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 72 }}>
          <div style={{
            display: 'inline-block', fontSize: 11, fontWeight: 700, letterSpacing: '0.1em',
            textTransform: 'uppercase', color: '#147b58', marginBottom: 14,
          }}>
            How It Works
          </div>
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 700, color: '#f0f0f3', margin: 0, letterSpacing: '-0.025em', lineHeight: 1.15 }}>
            Three steps from signup<br />to career evidence.
          </h2>
        </div>

        {/* Steps */}
        <div ref={ref} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 32 }}>
          {STEPS.map((step, i) => (
            <div
              key={step.number}
              style={{
                opacity: inView ? 1 : 0,
                transform: inView ? 'translateY(0)' : 'translateY(24px)',
                transition: `opacity 0.6s ease ${i * 0.12}s, transform 0.6s ease ${i * 0.12}s`,
              }}
            >
              <step.Mockup />
              <div style={{ marginTop: 24 }}>
                <div style={{
                  fontSize: 11, fontWeight: 700, color: '#147b58', letterSpacing: '0.1em',
                  textTransform: 'uppercase', marginBottom: 8,
                }}>
                  {step.number}
                </div>
                <h3 style={{ fontSize: 20, fontWeight: 700, color: '#f0f0f3', margin: '0 0 10px', letterSpacing: '-0.02em' }}>
                  {step.title}
                </h3>
                <p style={{ fontSize: 14, color: 'rgba(240,240,243,0.55)', lineHeight: 1.65, margin: 0 }}>
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Mockup 1: Onboarding chat ─────────────────────────────────────── */
function OnboardingMockup() {
  return (
    <div style={{
      background: '#111114', border: '1px solid rgba(255,255,255,0.07)',
      borderRadius: 14, overflow: 'hidden', aspectRatio: '4/3',
      display: 'flex', flexDirection: 'column',
    }}>
      {/* Window chrome */}
      <div style={{
        height: 36, background: '#0f0f12', borderBottom: '1px solid rgba(255,255,255,0.06)',
        display: 'flex', alignItems: 'center', padding: '0 14px', gap: 7, flexShrink: 0,
      }}>
        {['#ef4444', '#f59e0b', '#22c55e'].map(c => (
          <div key={c} style={{ width: 9, height: 9, borderRadius: '50%', background: c, opacity: 0.7 }} />
        ))}
        <span style={{ fontSize: 11, color: 'rgba(240,240,243,0.3)', marginLeft: 8, fontWeight: 500 }}>
          Nebula — Onboarding
        </span>
      </div>
      {/* Chat content */}
      <div style={{ flex: 1, padding: 18, display: 'flex', flexDirection: 'column', gap: 12, justifyContent: 'center' }}>
        {/* Nova message */}
        <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
          <div style={{
            width: 28, height: 28, borderRadius: '50%', background: 'linear-gradient(135deg, #147b58, #0891b2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 12,
          }}>✦</div>
          <div>
            <div style={{ fontSize: 10, color: '#147b58', fontWeight: 700, marginBottom: 4 }}>Nova · AI Guide</div>
            <div style={{
              fontSize: 12, color: 'rgba(240,240,243,0.75)', background: 'rgba(255,255,255,0.05)',
              borderRadius: 10, padding: '8px 12px', lineHeight: 1.5, maxWidth: 200,
            }}>
              Welcome. What's your current role?
            </div>
          </div>
        </div>
        {/* User response */}
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <div style={{
            fontSize: 12, color: 'rgba(240,240,243,0.85)', background: 'rgba(20,123,88,0.25)',
            border: '1px solid rgba(20,123,88,0.3)', borderRadius: 10, padding: '8px 12px',
            lineHeight: 1.5, maxWidth: 160,
          }}>
            Product Manager, 3 years exp
          </div>
        </div>
        {/* Nova follow-up */}
        <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
          <div style={{
            width: 28, height: 28, borderRadius: '50%', background: 'linear-gradient(135deg, #147b58, #0891b2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 12,
          }}>✦</div>
          <div style={{
            fontSize: 12, color: 'rgba(240,240,243,0.75)', background: 'rgba(255,255,255,0.05)',
            borderRadius: 10, padding: '8px 12px', lineHeight: 1.5, maxWidth: 200,
          }}>
            Setting difficulty: <span style={{ color: '#f59e0b', fontWeight: 600 }}>Standard</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Mockup 2: Chat with character ──────────────────────────────────── */
function ChatMockup() {
  return (
    <div style={{
      background: '#111114', border: '1px solid rgba(255,255,255,0.07)',
      borderRadius: 14, overflow: 'hidden', aspectRatio: '4/3',
      display: 'flex', flexDirection: 'column',
    }}>
      {/* Window chrome */}
      <div style={{
        height: 36, background: '#0f0f12', borderBottom: '1px solid rgba(255,255,255,0.06)',
        display: 'flex', alignItems: 'center', padding: '0 14px', gap: 7, flexShrink: 0,
      }}>
        {['#ef4444', '#f59e0b', '#22c55e'].map(c => (
          <div key={c} style={{ width: 9, height: 9, borderRadius: '50%', background: c, opacity: 0.7 }} />
        ))}
        <span style={{ fontSize: 11, color: 'rgba(240,240,243,0.3)', marginLeft: 8, fontWeight: 500 }}>
          Inbox — Marcus Webb
        </span>
      </div>
      <div style={{ flex: 1, padding: 18, display: 'flex', flexDirection: 'column', gap: 10, justifyContent: 'center' }}>
        {/* Character header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
          <img
            src="https://randomuser.me/api/portraits/men/32.jpg"
            alt="Marcus"
            style={{ width: 28, height: 28, borderRadius: '50%', border: '2px solid #0891b2' }}
          />
          <div>
            <div style={{ fontSize: 12, fontWeight: 600, color: '#f0f0f3' }}>Marcus Webb</div>
            <div style={{ fontSize: 10, color: 'rgba(240,240,243,0.4)' }}>Engineering Lead</div>
          </div>
          {/* Trust bar */}
          <div style={{ marginLeft: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 3 }}>
            <span style={{ fontSize: 9, color: 'rgba(240,240,243,0.4)', fontWeight: 600 }}>TRUST</span>
            <div style={{ width: 56, height: 4, background: 'rgba(255,255,255,0.1)', borderRadius: 4 }}>
              <div style={{ width: '51%', height: '100%', background: '#f59e0b', borderRadius: 4 }} />
            </div>
            <span style={{ fontSize: 9, color: '#f59e0b', fontWeight: 700 }}>51%</span>
          </div>
        </div>
        {/* Message */}
        <div style={{
          fontSize: 11.5, color: 'rgba(240,240,243,0.7)', lineHeight: 1.55,
          background: 'rgba(255,255,255,0.04)', borderRadius: 10, padding: '10px 12px',
          borderLeft: '2px solid #0891b2',
        }}>
          The SSO estimate is six weeks. That's the security review timeline, not my estimate. Nobody asked about alternatives.
        </div>
        {/* User reply box */}
        <div style={{
          fontSize: 11, color: 'rgba(240,240,243,0.3)', lineHeight: 1.5,
          background: 'rgba(255,255,255,0.04)', borderRadius: 8, padding: '8px 12px',
          border: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <span>Are there any third-party options?</span>
          <div style={{ width: 22, height: 22, borderRadius: 6, background: '#147b58', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
              <path d="M2 5h6M6 3l2 2-2 2" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Mockup 3: Score card ───────────────────────────────────────────── */
function ScoreMockup() {
  const SKILLS = [
    { name: 'Strategic Thinking', score: 83, color: '#147b58' },
    { name: 'Stakeholder Mgmt', score: 78, color: '#0891b2' },
    { name: 'Prioritisation', score: 81, color: '#7c3aed' },
  ];

  return (
    <div style={{
      background: '#111114', border: '1px solid rgba(255,255,255,0.07)',
      borderRadius: 14, overflow: 'hidden', aspectRatio: '4/3',
      display: 'flex', flexDirection: 'column',
    }}>
      {/* Window chrome */}
      <div style={{
        height: 36, background: '#0f0f12', borderBottom: '1px solid rgba(255,255,255,0.06)',
        display: 'flex', alignItems: 'center', padding: '0 14px', gap: 7, flexShrink: 0,
      }}>
        {['#ef4444', '#f59e0b', '#22c55e'].map(c => (
          <div key={c} style={{ width: 9, height: 9, borderRadius: '50%', background: c, opacity: 0.7 }} />
        ))}
        <span style={{ fontSize: 11, color: 'rgba(240,240,243,0.3)', marginLeft: 8, fontWeight: 500 }}>
          Portfolio · Case Study
        </span>
      </div>
      <div style={{ flex: 1, padding: 18, display: 'flex', flexDirection: 'column', gap: 10, justifyContent: 'center' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
          <div style={{
            fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase',
            color: '#147b58', background: 'rgba(20,123,88,0.15)', border: '1px solid rgba(20,123,88,0.3)',
            borderRadius: 100, padding: '2px 8px',
          }}>
            AI-Verified
          </div>
          <span style={{ fontSize: 10, color: 'rgba(240,240,243,0.3)', fontFamily: 'monospace' }}>
            #VER-7f2a94...
          </span>
        </div>
        {/* Composite score */}
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 4 }}>
          <span style={{ fontSize: 36, fontWeight: 800, color: '#f0f0f3', lineHeight: 1, letterSpacing: '-0.04em' }}>81</span>
          <span style={{ fontSize: 12, color: 'rgba(240,240,243,0.4)', fontWeight: 500 }}>/100</span>
          <span style={{
            fontSize: 11, fontWeight: 700, color: '#22c55e',
            background: 'rgba(34,197,94,0.12)', border: '1px solid rgba(34,197,94,0.25)',
            borderRadius: 100, padding: '2px 8px', marginLeft: 4,
          }}>Top 15%</span>
        </div>
        {/* Skill bars */}
        {SKILLS.map(s => (
          <div key={s.name} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 11, color: 'rgba(240,240,243,0.55)', fontWeight: 500 }}>{s.name}</span>
              <span style={{ fontSize: 11, fontWeight: 700, color: s.color }}>{s.score}</span>
            </div>
            <div style={{ height: 3, background: 'rgba(255,255,255,0.08)', borderRadius: 2 }}>
              <div style={{ width: `${s.score}%`, height: '100%', background: s.color, borderRadius: 2 }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
