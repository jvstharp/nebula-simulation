"use client";
import { useEffect, useRef, useState } from "react";

const SKILLS = [
  { name: 'Strategic Thinking', score: 83, desc: 'Finding hidden constraints, plan quality, OKR completion', color: '#147b58' },
  { name: 'Stakeholder Management', score: 78, desc: 'Trust built, breadth of contact, recovery from low-trust moments', color: '#0891b2' },
  { name: 'Prioritisation', score: 81, desc: 'Correct card sequencing, SSO delivery, PM ownership', color: '#7c3aed' },
  { name: 'Communication', score: 74, desc: 'Message volume, channel choice, responsiveness speed', color: '#db2777' },
  { name: 'Conflict Resolution', score: 68, desc: 'Trust recovery, avoiding escalation, chaos handling', color: '#d97706' },
  { name: 'Execution Speed', score: 71, desc: 'Session completion time, early constraint discovery', color: '#059669' },
];

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

export function SkillBars() {
  const { ref, inView } = useInView(0.15);

  return (
    <section style={{ background: '#111114', padding: '100px 24px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
      <div style={{ maxWidth: 1080, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'center' }} className="skills-grid">
        {/* Left: copy */}
        <div>
          <div style={{
            fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase',
            color: '#147b58', marginBottom: 16,
          }}>
            Scoring
          </div>
          <h2 style={{
            fontSize: 'clamp(26px, 3.5vw, 42px)', fontWeight: 700, color: '#f0f0f3',
            margin: '0 0 20px', letterSpacing: '-0.025em', lineHeight: 1.15,
          }}>
            Six skills.<br />No hiding.
          </h2>
          <p style={{ fontSize: 15, color: 'rgba(240,240,243,0.55)', lineHeight: 1.7, margin: '0 0 28px' }}>
            Every email, every chat, every decision is scored in real time. You see exactly where you excelled and where you lost ground.
          </p>
          <p style={{ fontSize: 15, color: 'rgba(240,240,243,0.55)', lineHeight: 1.7, margin: 0 }}>
            Your composite score is benchmarked against 4,000+ professionals who've run the same scenario.
          </p>

          {/* Benchmark callout */}
          <div style={{
            marginTop: 32, display: 'inline-flex', gap: 20,
            background: 'rgba(20,123,88,0.08)', border: '1px solid rgba(20,123,88,0.2)',
            borderRadius: 12, padding: '16px 20px',
          }}>
            {[
              { value: '4K+', label: 'Simulations run' },
              { value: '89%', label: 'Completion rate' },
              { value: 'Top 15%', label: 'Average outcome' },
            ].map(({ value, label }) => (
              <div key={label} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 20, fontWeight: 800, color: '#34d399', letterSpacing: '-0.03em' }}>{value}</div>
                <div style={{ fontSize: 11, color: 'rgba(240,240,243,0.4)', fontWeight: 500, marginTop: 2 }}>{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: skill bars */}
        <div ref={ref} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          {SKILLS.map((skill, i) => (
            <div key={skill.name}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 7 }}>
                <div>
                  <span style={{ fontSize: 13, fontWeight: 600, color: '#f0f0f3' }}>{skill.name}</span>
                  <span style={{ fontSize: 11, color: 'rgba(240,240,243,0.35)', marginLeft: 8 }}>{skill.desc}</span>
                </div>
                <span style={{ fontSize: 13, fontWeight: 700, color: skill.color, flexShrink: 0, marginLeft: 8 }}>
                  {inView ? skill.score : 0}
                </span>
              </div>
              <div style={{ height: 4, background: 'rgba(255,255,255,0.07)', borderRadius: 4, overflow: 'hidden' }}>
                <div style={{
                  height: '100%', borderRadius: 4,
                  background: `linear-gradient(90deg, ${skill.color}cc, ${skill.color})`,
                  width: inView ? `${skill.score}%` : '0%',
                  transition: `width 0.9s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${i * 0.08}s`,
                }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .skills-grid { grid-template-columns: 1fr !important; gap: 48px !important; }
        }
      `}</style>
    </section>
  );
}
