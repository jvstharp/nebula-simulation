'use client';

import { useEffect, useRef, useState } from 'react';

function useFadeIn(delay = 0) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setTimeout(() => setVisible(true), delay); obs.disconnect(); } },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [delay]);
  return { ref, style: { opacity: visible ? 1 : 0, transform: visible ? 'none' : 'translateY(24px)', transition: 'opacity 0.6s ease, transform 0.6s ease' } };
}

const CHARACTERS = [
  { name: 'Sarah Chen', role: 'VP of Product', color: '#7c3aed', init: 'S', hook: 'Has institutional knowledge she hasn\'t offered yet.' },
  { name: 'Marcus Webb', role: 'Engineering Lead', color: '#0891b2', init: 'M', hook: 'Quoted 6 weeks — but there\'s another path he hasn\'t mentioned.' },
  { name: 'Priya Sharma', role: 'Head of Design', color: '#db2777', init: 'P', hook: 'Has data that changes everything. Won\'t volunteer it.' },
  { name: 'Tom Rivera', role: 'Sales Director', color: '#d97706', init: 'T', hook: 'The deal is real. The timeline might not be.' },
  { name: 'Elena Park', role: 'CEO', color: '#059669', init: 'E', hook: 'Moving fast. Assumes you know what she knows.' },
];

const SKILLS = [
  { name: 'Communication', color: '#49a5de', desc: 'How clearly you articulate decisions and updates', score: 82 },
  { name: 'Strategic Thinking', color: '#bb76d6', desc: 'Ability to spot patterns and prioritise long-term', score: 88 },
  { name: 'Stakeholder Management', color: '#02ba67', desc: 'Building trust under pressure', score: 75 },
  { name: 'Execution Speed', color: '#deaf49', desc: 'How quickly you move from diagnosis to decision', score: 91 },
  { name: 'Conflict Resolution', color: '#db966b', desc: 'De-escalating tension between teams', score: 79 },
  { name: 'Prioritisation', color: '#d44848', desc: 'Ruthless focus on what matters most', score: 85 },
];

const TESTIMONIALS = [
  { quote: "I've done 12 PM interview loops. Nothing prepared me for the pressure like this simulation did.", name: 'Jordan K.', role: 'Senior PM @ Series B startup', stars: 5 },
  { quote: "The hidden constraint mechanic is genius. I discovered Marcus had a WorkOS option on my third run. Changed everything.", name: 'Alex T.', role: 'Product Lead', stars: 5 },
  { quote: "My onsite used the exact same stakeholder dynamics. I knew how to handle Elena because I'd met her in Nebula.", name: 'Priya M.', role: 'PM @ enterprise SaaS', stars: 5 },
];

export default function LandingPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const hero = useFadeIn(0);
  const stats = useFadeIn(0);
  const problem = useFadeIn(0);
  const howItWorks = useFadeIn(0);
  const scenario = useFadeIn(0);
  const workspace = useFadeIn(0);
  const characters = useFadeIn(0);
  const skills = useFadeIn(0);
  const proof = useFadeIn(0);
  const testimonials = useFadeIn(0);
  const cta = useFadeIn(0);

  return (
    <div style={{ background: '#0c0c0e', color: '#f0f0f3', fontFamily: 'Inter, -apple-system, sans-serif', minHeight: '100vh', overflowX: 'hidden' }}>
      <style>{`
        html { scroll-behavior: smooth; }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        a { color: inherit; text-decoration: none; }
        ::selection { background: rgba(20,123,88,0.35); }

        .nav-link { font-size: 14px; color: rgba(240,240,243,0.65); transition: color 0.2s; cursor: pointer; }
        .nav-link:hover { color: #f0f0f3; }

        .btn-green {
          background: #147b58; color: #fff; border: none; border-radius: 8px;
          font-size: 14px; font-weight: 600; cursor: pointer;
          transition: background 0.2s, transform 0.15s;
          display: inline-flex; align-items: center; gap: 6px;
        }
        .btn-green:hover { background: #1a9e72; transform: translateY(-1px); }

        .btn-ghost {
          background: transparent; color: rgba(240,240,243,0.8);
          border: 1px solid rgba(255,255,255,0.18); border-radius: 8px;
          font-size: 14px; font-weight: 500; cursor: pointer;
          transition: border-color 0.2s, color 0.2s, transform 0.15s;
          display: inline-flex; align-items: center; gap: 6px;
        }
        .btn-ghost:hover { border-color: rgba(255,255,255,0.4); color: #fff; transform: translateY(-1px); }

        .char-card {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 14px; padding: 28px 22px;
          display: flex; flex-direction: column; align-items: center; gap: 14px;
          text-align: center; transition: transform 0.2s, border-color 0.2s, box-shadow 0.2s;
          min-width: 200px;
        }
        .char-card:hover { transform: translateY(-4px); }

        .skill-card {
          background: rgba(255,255,255,0.025);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 12px; padding: 22px 20px;
          transition: transform 0.2s, border-color 0.2s;
        }
        .skill-card:hover { transform: translateY(-2px); }

        .how-card {
          background: rgba(255,255,255,0.025);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 12px; padding: 28px 24px; flex: 1;
          position: relative;
        }

        .testi-card {
          background: rgba(255,255,255,0.025);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 12px; padding: 28px 24px; flex: 1;
        }

        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(6px); }
        }

        @media (max-width: 767px) {
          .desktop-nav-links { display: none !important; }
          .nav-right-desktop { display: none !important; }
          .hero-content { padding: 100px 24px 60px !important; }
          .stats-grid { grid-template-columns: 1fr 1fr !important; }
          .problem-cols { flex-direction: column !important; }
          .how-cards { flex-direction: column !important; }
          .how-connector { display: none !important; }
          .chars-grid { flex-wrap: nowrap !important; overflow-x: auto; scroll-snap-type: x mandatory; padding-bottom: 16px; }
          .char-card { scroll-snap-align: start; flex: 0 0 220px; }
          .skills-grid { grid-template-columns: 1fr 1fr !important; }
          .proof-cols { flex-direction: column !important; }
          .testi-cards { flex-direction: column !important; }
          .footer-inner { flex-direction: column !important; gap: 24px !important; text-align: center; }
          .scenario-content { padding: 60px 24px !important; }
          .workspace-mock { margin: 0 16px !important; }
          .hamburger { display: flex !important; }
          .mobile-menu { display: flex !important; }
        }
      `}</style>

      {/* NAVBAR */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        background: scrolled ? 'rgba(12,12,14,0.9)' : 'transparent',
        borderBottom: scrolled ? '1px solid rgba(255,255,255,0.07)' : '1px solid transparent',
        transition: 'background 0.3s, border-color 0.3s, backdrop-filter 0.3s',
        padding: '0 40px',
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <a href="/landing" style={{ fontWeight: 800, fontSize: 20, letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ color: '#147b58' }}>✦</span> Nebula
          </a>

          <div className="desktop-nav-links" style={{ display: 'flex', gap: 32 }}>
            <a href="#features" className="nav-link">Features</a>
            <a href="#how-it-works" className="nav-link">How It Works</a>
            <a href="#characters" className="nav-link">For Teams</a>
          </div>

          <div className="nav-right-desktop" style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <a href="/" className="btn-ghost" style={{ padding: '9px 18px' }}>Log In</a>
            <a href="/" className="btn-green" style={{ padding: '9px 18px' }}>Try Free Demo →</a>
          </div>

          <button
            className="hamburger"
            onClick={() => setMenuOpen(o => !o)}
            style={{ display: 'none', background: 'none', border: 'none', cursor: 'pointer', flexDirection: 'column', gap: 5, padding: 8 }}
          >
            {[0,1,2].map(i => (
              <span key={i} style={{ width: 22, height: 2, background: '#f0f0f3', borderRadius: 2, display: 'block' }} />
            ))}
          </button>
        </div>

        {menuOpen && (
          <div className="mobile-menu" style={{
            display: 'flex', flexDirection: 'column', gap: 16,
            background: 'rgba(12,12,14,0.98)', padding: '20px 24px 28px',
            borderTop: '1px solid rgba(255,255,255,0.07)',
          }}>
            <a href="#features" className="nav-link" onClick={() => setMenuOpen(false)}>Features</a>
            <a href="#how-it-works" className="nav-link" onClick={() => setMenuOpen(false)}>How It Works</a>
            <a href="#characters" className="nav-link" onClick={() => setMenuOpen(false)}>For Teams</a>
            <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
              <a href="/" className="btn-ghost" style={{ padding: '10px 18px', flex: 1, justifyContent: 'center' }}>Log In</a>
              <a href="/" className="btn-green" style={{ padding: '10px 18px', flex: 1, justifyContent: 'center' }}>Try Demo →</a>
            </div>
          </div>
        )}
      </nav>

      {/* HERO */}
      <section style={{ position: 'relative', minHeight: '100vh', display: 'flex', alignItems: 'center' }}>
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: `url(https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1920&q=80)`,
          backgroundSize: 'cover', backgroundPosition: 'center',
        }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.6) 55%, rgba(0,0,0,0.25) 100%)' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, #0c0c0e 0%, transparent 40%)' }} />

        <div ref={hero.ref} style={{ ...hero.style, position: 'relative', zIndex: 1, width: '100%' }}>
          <div className="hero-content" style={{ maxWidth: 1200, margin: '0 auto', padding: '120px 40px 80px' }}>
            <div style={{ maxWidth: 680 }}>
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                background: 'rgba(20,123,88,0.15)', border: '1px solid rgba(20,123,88,0.35)',
                borderRadius: 100, padding: '6px 14px', marginBottom: 28,
                fontSize: 12, fontWeight: 600, color: '#02ba67', letterSpacing: '0.04em',
              }}>
                AI-Powered Simulation ✦ Now in Beta
              </div>

              <h1 style={{
                fontSize: 'clamp(46px, 7vw, 80px)', fontWeight: 800,
                letterSpacing: '-0.035em', lineHeight: 1.05, marginBottom: 24,
                color: '#f0f0f3',
              }}>
                The PM Simulation<br />That Thinks Back.
              </h1>

              <p style={{ fontSize: 14, lineHeight: 1.7, color: 'rgba(240,240,243,0.7)', maxWidth: 520, marginBottom: 36 }}>
                Step into real product pressure. Navigate 5 AI colleagues with conflicting agendas. Build proof of your PM skills — not just a course certificate.
              </p>

              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                <a href="/" className="btn-green" style={{ padding: '14px 28px', fontSize: 15, borderRadius: 10 }}>
                  Try Free Demo →
                </a>
                <a href="#how-it-works" className="btn-ghost" style={{ padding: '14px 24px', fontSize: 15, borderRadius: 10 }}>
                  See How It Works ↓
                </a>
              </div>
            </div>
          </div>
        </div>

        <div style={{
          position: 'absolute', bottom: 32, left: '50%', transform: 'translateX(-50%)',
          animation: 'bounce 2s ease-in-out infinite', opacity: 0.4, zIndex: 1,
        }}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M10 4v12M4 10l6 6 6-6" stroke="#f0f0f3" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </section>

      {/* STATS STRIP */}
      <div ref={stats.ref} style={{ ...stats.style, background: 'rgba(255,255,255,0.025)', borderTop: '1px solid rgba(255,255,255,0.06)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 40px' }}>
          <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 0 }}>
            {[
              { num: '500+', label: 'Simulations Run' },
              { num: '6', label: 'Skill Dimensions' },
              { num: '72-Hour', label: 'Compressed Scenario' },
              { num: '5', label: 'AI Colleagues' },
            ].map((s, i) => (
              <div key={i} style={{
                padding: '32px 24px', textAlign: 'center',
                borderRight: i < 3 ? '1px solid rgba(255,255,255,0.06)' : 'none',
              }}>
                <div style={{ fontSize: 32, fontWeight: 800, color: '#f0f0f3', letterSpacing: '-0.02em' }}>{s.num}</div>
                <div style={{ fontSize: 11, fontWeight: 600, color: 'rgba(240,240,243,0.4)', textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: 6 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* THE PROBLEM */}
      <section id="features" style={{ padding: '100px 40px' }}>
        <div ref={problem.ref} style={{ ...problem.style, maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <h2 style={{ fontSize: 'clamp(32px, 4vw, 48px)', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: 16 }}>
              PM training is broken.
            </h2>
            <p style={{ fontSize: 14, color: 'rgba(240,240,243,0.55)', maxWidth: 480, margin: '0 auto' }}>
              Courses give you frameworks. Simulations give you instincts.
            </p>
          </div>

          <div className="problem-cols" style={{ display: 'flex', gap: 20 }}>
            <div style={{
              flex: 1, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: 14, padding: 32,
            }}>
              <div style={{ display: 'inline-block', background: 'rgba(220,60,60,0.1)', border: '1px solid rgba(220,60,60,0.2)', borderRadius: 6, padding: '4px 12px', fontSize: 12, fontWeight: 600, color: '#e06060', marginBottom: 24, letterSpacing: '0.04em' }}>
                THE OLD WAY
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {['Passive video courses', 'Generic frameworks with no pressure', 'No real stakeholder friction', 'Certificates that prove nothing'].map((item, i) => (
                  <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                    <span style={{ color: '#e06060', fontWeight: 700, marginTop: 1, flexShrink: 0 }}>✗</span>
                    <span style={{ fontSize: 14, color: 'rgba(240,240,243,0.5)', lineHeight: 1.5 }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{
              flex: 1, background: 'rgba(20,123,88,0.04)', border: '1px solid rgba(20,123,88,0.3)',
              borderRadius: 14, padding: 32,
            }}>
              <div style={{ display: 'inline-block', background: 'rgba(20,123,88,0.15)', border: '1px solid rgba(20,123,88,0.35)', borderRadius: 6, padding: '4px 12px', fontSize: 12, fontWeight: 600, color: '#02ba67', marginBottom: 24, letterSpacing: '0.04em' }}>
                THE NEBULA WAY
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {['Live AI colleagues who push back', '72-hour compressed crises with real trade-offs', '5 stakeholders with hidden agendas', 'Verified skill portfolio after every session'].map((item, i) => (
                  <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                    <span style={{ color: '#02ba67', fontWeight: 700, marginTop: 1, flexShrink: 0 }}>✓</span>
                    <span style={{ fontSize: 14, color: 'rgba(240,240,243,0.85)', lineHeight: 1.5 }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" style={{ padding: '100px 40px', background: 'rgba(255,255,255,0.015)' }}>
        <div ref={howItWorks.ref} style={{ ...howItWorks.style, maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <h2 style={{ fontSize: 'clamp(30px, 3.5vw, 44px)', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: 16 }}>
              From zero to scenario in 3 minutes.
            </h2>
          </div>

          <div className="how-cards" style={{ display: 'flex', gap: 0, alignItems: 'stretch' }}>
            {[
              {
                num: '01', title: 'Tell Us Your Background',
                desc: 'Our AI coordinator Alex asks two questions and matches you to 3 company scenarios tailored to your experience level.',
                icon: <svg width="28" height="28" fill="none" viewBox="0 0 28 28"><circle cx="10" cy="10" r="7" stroke="#147b58" strokeWidth="1.5"/><circle cx="20" cy="18" r="7" stroke="#147b58" strokeWidth="1.5"/><path d="M7 10h6M10 7v6" stroke="#147b58" strokeWidth="1.5" strokeLinecap="round"/></svg>,
              },
              {
                num: '02', title: 'Simulate Real PM Work',
                desc: 'Step into a 72-hour crisis. Use email, chat, kanban, and meetings. Every decision shifts trust levels and unlocks hidden information.',
                icon: <svg width="28" height="28" fill="none" viewBox="0 0 28 28"><rect x="3" y="5" width="22" height="16" rx="2" stroke="#147b58" strokeWidth="1.5"/><path d="M9 23h10M14 21v2" stroke="#147b58" strokeWidth="1.5" strokeLinecap="round"/><rect x="7" y="9" width="5" height="4" rx="1" stroke="#147b58" strokeWidth="1.2"/><rect x="16" y="9" width="5" height="4" rx="1" stroke="#147b58" strokeWidth="1.2"/></svg>,
              },
              {
                num: '03', title: 'Get Your Skill Report',
                desc: 'Receive a verified skill portfolio with 6 scored dimensions. Share proof of your PM capability — not just a certificate.',
                icon: <svg width="28" height="28" fill="none" viewBox="0 0 28 28"><path d="M6 20l5-7 4 4 4-8 5 5" stroke="#147b58" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><circle cx="22" cy="8" r="4" fill="rgba(20,123,88,0.2)" stroke="#147b58" strokeWidth="1.5"/><path d="M21 8h2M22 7v2" stroke="#147b58" strokeWidth="1.2" strokeLinecap="round"/></svg>,
              },
            ].map((step, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'stretch', flex: 1 }}>
                <div className="how-card" style={{ display: 'flex', flexDirection: 'column', gap: 16, width: '100%' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <span style={{ fontFamily: 'monospace', fontSize: 13, fontWeight: 700, color: '#147b58', letterSpacing: '0.06em' }}>{step.num}</span>
                    {step.icon}
                  </div>
                  <div>
                    <div style={{ fontSize: 16, fontWeight: 700, color: '#f0f0f3', marginBottom: 10, lineHeight: 1.3 }}>{step.title}</div>
                    <div style={{ fontSize: 14, color: 'rgba(240,240,243,0.55)', lineHeight: 1.65 }}>{step.desc}</div>
                  </div>
                </div>
                {i < 2 && (
                  <div className="how-connector" style={{ display: 'flex', alignItems: 'center', padding: '0 8px', flexShrink: 0 }}>
                    <div style={{ width: 40, height: 1, borderTop: '1px dashed rgba(255,255,255,0.15)' }} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* THE SCENARIO */}
      <section style={{ position: 'relative', overflow: 'hidden' }}>
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: `url(https://images.unsplash.com/photo-1497366216548-37526070297c?w=1920&q=80)`,
          backgroundSize: 'cover', backgroundPosition: 'center',
        }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(12,12,14,0.97) 40%, rgba(12,12,14,0.7) 75%, rgba(12,12,14,0.4) 100%)' }} />

        <div ref={scenario.ref} style={{ ...scenario.style, position: 'relative', zIndex: 1 }}>
          <div className="scenario-content" style={{ maxWidth: 1200, margin: '0 auto', padding: '100px 40px' }}>
            <div style={{ maxWidth: 600 }}>
              <div style={{
                display: 'inline-block', background: 'rgba(20,123,88,0.15)', border: '1px solid rgba(20,123,88,0.3)',
                borderRadius: 6, padding: '4px 12px', fontSize: 11, fontWeight: 700,
                color: '#02ba67', letterSpacing: '0.1em', marginBottom: 24, textTransform: 'uppercase',
              }}>
                Featured Scenario
              </div>

              <h2 style={{ fontSize: 'clamp(36px, 5vw, 56px)', fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.05, marginBottom: 16 }}>
                The Roadmap Reckoning
              </h2>

              <p style={{ fontSize: 13, color: 'rgba(240,240,243,0.45)', marginBottom: 20, letterSpacing: '0.02em' }}>
                72 hours · 5 stakeholders · $2M on the line · Board meets Monday
              </p>

              <p style={{ fontSize: 14, color: 'rgba(240,240,243,0.7)', lineHeight: 1.75, marginBottom: 36, maxWidth: 520 }}>
                Three conflicting roadmaps are in circulation. A $2M enterprise deal is on the line. The board meets Monday morning. Figure out what's really going on, get everyone aligned, and walk in with a plan the CEO can actually defend.
              </p>

              <div style={{ display: 'flex', gap: 12, marginBottom: 36, flexWrap: 'wrap' }}>
                {CHARACTERS.map((c) => (
                  <div key={c.name} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                    <div style={{
                      width: 44, height: 44, borderRadius: '50%',
                      background: c.color + '22', border: `2px solid ${c.color}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontWeight: 700, fontSize: 15, color: c.color,
                    }}>
                      {c.init}
                    </div>
                    <span style={{ fontSize: 10, color: 'rgba(240,240,243,0.45)', whiteSpace: 'nowrap' }}>{c.name.split(' ')[0]}</span>
                  </div>
                ))}
              </div>

              <a href="/" className="btn-green" style={{ padding: '14px 28px', fontSize: 15, borderRadius: 10 }}>
                Start This Scenario →
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* YOUR WORKSPACE */}
      <section id="workspace" style={{ padding: '100px 40px' }}>
        <div ref={workspace.ref} style={{ ...workspace.style, maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <h2 style={{ fontSize: 'clamp(30px, 3.5vw, 44px)', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: 16 }}>
              A full PM environment. Built for simulation.
            </h2>
            <p style={{ fontSize: 14, color: 'rgba(240,240,243,0.5)', maxWidth: 480, margin: '0 auto' }}>
              Everything you'd use in a real PM role — live, pressurised, and AI-powered.
            </p>
          </div>

          {/* App window mock */}
          <div className="workspace-mock" style={{
            background: '#161618', border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 14, overflow: 'hidden', boxShadow: '0 40px 80px rgba(0,0,0,0.6)',
          }}>
            {/* Title bar */}
            <div style={{ background: '#1e1e20', borderBottom: '1px solid rgba(255,255,255,0.07)', padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ display: 'flex', gap: 6 }}>
                {['#ff5f57','#febc2e','#28c840'].map((c, i) => (
                  <div key={i} style={{ width: 12, height: 12, borderRadius: '50%', background: c }} />
                ))}
              </div>
              <div style={{ flex: 1, background: 'rgba(255,255,255,0.05)', borderRadius: 6, padding: '4px 14px', marginLeft: 8, fontSize: 12, color: 'rgba(240,240,243,0.35)', textAlign: 'center' }}>
                nebula.sim / workspace
              </div>
            </div>

            {/* Tab bar */}
            <div style={{ background: '#191919', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', overflowX: 'auto' }}>
              {[
                { label: '📧 Mail', active: true },
                { label: '💬 Chat', active: false },
                { label: '📋 Projects', active: false },
                { label: '📅 Calendar', active: false },
                { label: '🎥 Meetings', active: false },
                { label: '✨ Nebula AI', active: false },
              ].map((tab, i) => (
                <div key={i} style={{
                  padding: '10px 18px', fontSize: 12, fontWeight: 500, whiteSpace: 'nowrap',
                  color: tab.active ? '#f0f0f3' : 'rgba(240,240,243,0.4)',
                  borderBottom: tab.active ? '2px solid #147b58' : '2px solid transparent',
                  background: tab.active ? 'rgba(255,255,255,0.03)' : 'transparent',
                  cursor: 'pointer',
                }}>
                  {tab.label}
                </div>
              ))}
            </div>

            {/* Content preview */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 0, minHeight: 220 }}>
              {/* Mail preview */}
              <div style={{ padding: 20, borderRight: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: 'rgba(240,240,243,0.35)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 14 }}>Inbox</div>
                {[
                  { from: 'Sarah Chen', subject: 'Roadmap alignment — urgent', time: '9:14am', dot: '#7c3aed' },
                  { from: 'Marcus Webb', subject: 'Re: Sprint capacity Q3', time: '8:42am', dot: '#0891b2' },
                  { from: 'Elena Park', subject: 'Board prep — need your slide', time: 'Yesterday', dot: '#059669' },
                ].map((m, i) => (
                  <div key={i} style={{ display: 'flex', gap: 10, padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.04)', alignItems: 'flex-start' }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: m.dot, marginTop: 4, flexShrink: 0 }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 12, fontWeight: 600, color: '#f0f0f3', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m.from}</div>
                      <div style={{ fontSize: 11, color: 'rgba(240,240,243,0.4)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m.subject}</div>
                    </div>
                    <div style={{ fontSize: 10, color: 'rgba(240,240,243,0.3)', flexShrink: 0 }}>{m.time}</div>
                  </div>
                ))}
              </div>

              {/* Kanban preview */}
              <div style={{ padding: 20, borderRight: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: 'rgba(240,240,243,0.35)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 14 }}>Projects Board</div>
                <div style={{ display: 'flex', gap: 8 }}>
                  {[
                    { col: 'To Do', color: 'rgba(240,240,243,0.15)', cards: ['API integration', 'Design review'] },
                    { col: 'In Progress', color: '#d97706', cards: ['Roadmap doc'] },
                    { col: 'Done', color: '#059669', cards: ['Q3 planning', 'Stakeholder map'] },
                  ].map((col, i) => (
                    <div key={i} style={{ flex: 1 }}>
                      <div style={{ fontSize: 10, fontWeight: 600, color: col.color, marginBottom: 8, letterSpacing: '0.04em', textTransform: 'uppercase' }}>{col.col}</div>
                      {col.cards.map((card, j) => (
                        <div key={j} style={{
                          background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)',
                          borderRadius: 5, padding: '7px 8px', fontSize: 10, color: 'rgba(240,240,243,0.7)',
                          marginBottom: 6, lineHeight: 1.3,
                        }}>
                          {card}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>

              {/* AI chat preview */}
              <div style={{ padding: 20 }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: 'rgba(240,240,243,0.35)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 14 }}>✨ Nebula AI</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 8, padding: '10px 12px', fontSize: 12, color: 'rgba(240,240,243,0.6)', lineHeight: 1.5 }}>
                    "How should I handle Marcus's push-back on the Q3 timeline?"
                  </div>
                  <div style={{ background: 'rgba(20,123,88,0.1)', border: '1px solid rgba(20,123,88,0.2)', borderRadius: 8, padding: '10px 12px', fontSize: 12, color: 'rgba(240,240,243,0.8)', lineHeight: 1.5 }}>
                    Marcus's trust is at 58 — ask about his capacity constraints before proposing a solution. He responds well to data over deadlines.
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Feature chips */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'center', marginTop: 40 }}>
            {['📧 Live Email Threads', '💬 Real-time Chat', '📋 Kanban Board', '📅 Meeting Scheduler', '🧠 AI Advisor', '📊 Skill Tracker'].map((chip, i) => (
              <div key={i} style={{
                background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.09)',
                borderRadius: 100, padding: '8px 16px', fontSize: 13, color: 'rgba(240,240,243,0.7)',
              }}>
                {chip}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MEET YOUR COLLEAGUES */}
      <section id="characters" style={{ padding: '100px 40px', background: 'rgba(255,255,255,0.015)' }}>
        <div ref={characters.ref} style={{ ...characters.style, maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 60 }}>
            <h2 style={{ fontSize: 'clamp(30px, 3.5vw, 44px)', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: 16 }}>
              Your colleagues. Each with an agenda.
            </h2>
            <p style={{ fontSize: 14, color: 'rgba(240,240,243,0.5)', maxWidth: 460, margin: '0 auto' }}>
              They're helpful — if you earn their trust. They're obstructive — if you don't.
            </p>
          </div>

          <div className="chars-grid" style={{ display: 'flex', gap: 16 }}>
            {CHARACTERS.map((c, i) => (
              <div key={i} className="char-card" style={{ '--hover-color': c.color } as React.CSSProperties}
                onMouseEnter={e => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.borderColor = c.color + '55';
                  el.style.boxShadow = `0 0 32px ${c.color}22`;
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.borderColor = 'rgba(255,255,255,0.08)';
                  el.style.boxShadow = 'none';
                }}
              >
                <div style={{
                  width: 72, height: 72, borderRadius: '50%',
                  background: c.color + '1a', border: `2px solid ${c.color}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 26, fontWeight: 800, color: c.color,
                }}>
                  {c.init}
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 14, color: '#f0f0f3', marginBottom: 4 }}>{c.name}</div>
                  <div style={{ fontSize: 12, color: 'rgba(240,240,243,0.45)' }}>{c.role}</div>
                </div>
                <div style={{ fontSize: 12, fontStyle: 'italic', color: 'rgba(240,240,243,0.45)', lineHeight: 1.55, textAlign: 'center' }}>
                  "{c.hook}"
                </div>
                <div style={{ width: '100%', background: 'rgba(255,255,255,0.05)', borderRadius: 4, height: 4, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: '0%', background: c.color, borderRadius: 4 }} />
                </div>
                <div style={{ fontSize: 11, color: 'rgba(240,240,243,0.3)', letterSpacing: '0.04em' }}>
                  🔒 Unlock in simulation →
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SKILLS */}
      <section style={{ padding: '100px 40px' }}>
        <div ref={skills.ref} style={{ ...skills.style, maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 60 }}>
            <h2 style={{ fontSize: 'clamp(30px, 3.5vw, 44px)', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: 16 }}>
              Six dimensions. One score.
            </h2>
            <p style={{ fontSize: 14, color: 'rgba(240,240,243,0.5)', maxWidth: 420, margin: '0 auto' }}>
              Every decision in the simulation is mapped to a skill dimension.
            </p>
          </div>

          <div className="skills-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
            {SKILLS.map((skill, i) => (
              <div key={i} className="skill-card" style={{ borderTop: `3px solid ${skill.color}` }}>
                <div style={{ fontWeight: 700, fontSize: 15, color: '#f0f0f3', marginBottom: 8 }}>{skill.name}</div>
                <div style={{ fontSize: 13, color: 'rgba(240,240,243,0.5)', lineHeight: 1.55, marginBottom: 16 }}>{skill.desc}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ flex: 1, background: 'rgba(255,255,255,0.07)', borderRadius: 4, height: 5, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${skill.score}%`, background: skill.color, borderRadius: 4 }} />
                  </div>
                  <span style={{ fontSize: 12, fontWeight: 700, color: skill.color, minWidth: 32 }}>{skill.score}</span>
                </div>
              </div>
            ))}
          </div>

          <p style={{ textAlign: 'center', fontSize: 13, color: 'rgba(240,240,243,0.35)', marginTop: 40, fontStyle: 'italic' }}>
            Your scores update in real time. Every message you send. Every meeting you join.
          </p>
        </div>
      </section>

      {/* PROOF / PORTFOLIO */}
      <section style={{ padding: '100px 40px', background: 'rgba(255,255,255,0.015)' }}>
        <div ref={proof.ref} style={{ ...proof.style, maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <h2 style={{ fontSize: 'clamp(30px, 3.5vw, 44px)', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: 16 }}>
              Walk away with proof.
            </h2>
          </div>

          <div className="proof-cols" style={{ display: 'flex', gap: 48, alignItems: 'center' }}>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 15, color: 'rgba(240,240,243,0.7)', lineHeight: 1.8, marginBottom: 24 }}>
                At the end of each session, Nebula generates a verified case study portfolio. Share it with recruiters, hiring managers, or your team.
              </p>
              <p style={{ fontSize: 15, color: 'rgba(240,240,243,0.7)', lineHeight: 1.8, marginBottom: 36 }}>
                It's proof you can handle real PM pressure — not just recall frameworks.
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                {[
                  { label: 'Strategic Thinker', earned: true },
                  { label: 'Stakeholder Master', earned: true },
                  { label: 'Execution Pro', earned: false },
                  { label: 'Conflict Resolver', earned: true },
                  { label: 'Speed Runner', earned: false },
                  { label: 'Prioritiser', earned: true },
                ].map((badge, i) => (
                  <div key={i} style={{
                    padding: '7px 14px', borderRadius: 100, fontSize: 12, fontWeight: 600,
                    background: badge.earned ? 'rgba(20,123,88,0.15)' : 'rgba(255,255,255,0.04)',
                    border: `1px solid ${badge.earned ? 'rgba(20,123,88,0.4)' : 'rgba(255,255,255,0.08)'}`,
                    color: badge.earned ? '#02ba67' : 'rgba(240,240,243,0.3)',
                  }}>
                    {badge.earned ? '✦ ' : ''}{badge.label}
                  </div>
                ))}
              </div>
            </div>

            {/* Mock portfolio card */}
            <div style={{
              flex: 1, background: '#161618', border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 16, padding: 32, boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 600, color: 'rgba(240,240,243,0.4)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>Scenario</div>
                  <div style={{ fontWeight: 700, fontSize: 16, color: '#f0f0f3' }}>The Roadmap Reckoning</div>
                </div>
                <div style={{
                  background: 'rgba(20,123,88,0.15)', border: '1px solid rgba(20,123,88,0.35)',
                  borderRadius: 8, padding: '6px 12px', fontSize: 12, fontWeight: 700, color: '#02ba67',
                }}>
                  Verified ✓
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 24 }}>
                <span style={{ fontSize: 48, fontWeight: 800, color: '#f0f0f3', letterSpacing: '-0.03em' }}>87</span>
                <span style={{ fontSize: 20, color: 'rgba(240,240,243,0.4)', fontWeight: 600 }}>/100</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
                {SKILLS.map((skill, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 110, fontSize: 12, color: 'rgba(240,240,243,0.5)', flexShrink: 0 }}>{skill.name}</div>
                    <div style={{ flex: 1, background: 'rgba(255,255,255,0.07)', borderRadius: 3, height: 4, overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${skill.score}%`, background: skill.color, borderRadius: 3 }} />
                    </div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: skill.color, minWidth: 24, textAlign: 'right' }}>{skill.score}</div>
                  </div>
                ))}
              </div>

              <div style={{ fontSize: 11, color: 'rgba(240,240,243,0.25)', fontFamily: 'monospace', letterSpacing: '0.04em' }}>
                ID: NEB-2025-AF4D2
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section style={{ padding: '100px 40px' }}>
        <div ref={testimonials.ref} style={{ ...testimonials.style, maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 60 }}>
            <h2 style={{ fontSize: 'clamp(28px, 3.5vw, 40px)', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: 16 }}>
              From PMs who've been through it.
            </h2>
          </div>

          <div className="testi-cards" style={{ display: 'flex', gap: 20 }}>
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className="testi-card">
                <div style={{ display: 'flex', gap: 2, marginBottom: 16 }}>
                  {Array.from({ length: t.stars }).map((_, j) => (
                    <span key={j} style={{ color: '#deaf49', fontSize: 14 }}>★</span>
                  ))}
                </div>
                <p style={{ fontSize: 14, color: 'rgba(240,240,243,0.75)', lineHeight: 1.7, marginBottom: 20, fontStyle: 'italic' }}>
                  "{t.quote}"
                </p>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 13, color: '#f0f0f3' }}>{t.name}</div>
                  <div style={{ fontSize: 12, color: 'rgba(240,240,243,0.4)', marginTop: 3 }}>{t.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section style={{ background: 'linear-gradient(180deg, #0c0c0e 0%, #091510 100%)', padding: '120px 40px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{
          position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
          width: 700, height: 700, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(20,123,88,0.08) 0%, transparent 65%)',
          pointerEvents: 'none',
        }} />
        <div ref={cta.ref} style={{ ...cta.style, position: 'relative', zIndex: 1 }}>
          <h2 style={{ fontSize: 'clamp(36px, 5vw, 56px)', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: 20 }}>
            Ready to prove your PM skills?
          </h2>
          <p style={{ fontSize: 14, color: 'rgba(240,240,243,0.55)', marginBottom: 40 }}>
            Your scenario is waiting. 3 minutes to start. 72 hours to master.
          </p>
          <a href="/" className="btn-green" style={{
            padding: '16px 48px', fontSize: 16, borderRadius: 12,
            display: 'inline-flex', boxShadow: '0 0 40px rgba(20,123,88,0.35)',
          }}>
            Try Free Demo →
          </a>
          <p style={{ marginTop: 20, fontSize: 13, color: 'rgba(240,240,243,0.3)' }}>
            No credit card. No commitment. Just the simulation.
          </p>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ borderTop: '1px solid rgba(255,255,255,0.07)', padding: '40px', background: '#0c0c0e' }}>
        <div className="footer-inner" style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 24 }}>
          <div>
            <div style={{ fontWeight: 800, fontSize: 16, marginBottom: 4 }}>
              <span style={{ color: '#147b58' }}>✦</span> Nebula
            </div>
            <div style={{ fontSize: 13, color: 'rgba(240,240,243,0.35)' }}>AI-powered career simulation.</div>
          </div>
          <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', justifyContent: 'center' }}>
            {['Features', 'How It Works', 'For Teams', 'Privacy', 'Terms'].map((link) => (
              <a key={link} href="#" style={{ fontSize: 13, color: 'rgba(240,240,243,0.4)', transition: 'color 0.2s' }}
                onMouseEnter={e => (e.currentTarget.style.color = '#f0f0f3')}
                onMouseLeave={e => (e.currentTarget.style.color = 'rgba(240,240,243,0.4)')}>
                {link}
              </a>
            ))}
          </div>
          <div style={{ fontSize: 13, color: 'rgba(240,240,243,0.3)' }}>
            © 2025 Nebula. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
