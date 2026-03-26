'use client';
import { useEffect, useState } from 'react';
import { useAppStore } from '@/lib/store';

const BOARD_MEMBERS = [
  { name: 'James Whitfield', firm: 'Sequoia Capital', role: 'Lead Investor', color: '#7c3aed' },
  { name: 'Rachel Osei', firm: 'Board Member', role: 'Independent Director', color: '#0891b2' },
  { name: 'David Kwon', firm: 'Atlas Ventures', role: 'Investor Director', color: '#059669' },
];

export function BoardMeetingScreen() {
  const { setScreen, session, characters } = useAppStore();
  const [phase, setPhase] = useState(0);
  // 0=dark intro, 1=title, 2=elena speaks, 3=summary, 4=board reacts, 5=outcome

  const avgTrust = characters.length
    ? characters.reduce((a, c) => a + c.trust, 0) / characters.length
    : 0.6;

  const okrComplete = session?.okrs
    ? session.okrs.filter(o => o.status === 'complete').length / session.okrs.length
    : 0.5;

  const secretsUnlocked = session?.unlockedSecrets?.length ?? 0;

  // Composite score 0-100
  const compositeScore = Math.round(
    (avgTrust * 50) + (okrComplete * 30) + (Math.min(secretsUnlocked, 5) / 5 * 20)
  );

  // Board member approval scores (0-100)
  const boardScores = [
    Math.round(compositeScore + (Math.random() * 10 - 5)),   // Whitfield — SSO/investor focus
    Math.round(compositeScore * 0.9 + okrComplete * 15),     // Rachel — OKR/execution focus
    Math.round(compositeScore * 0.85 + avgTrust * 20),       // David — stakeholder alignment focus
  ].map(s => Math.max(10, Math.min(100, s)));

  const [displayScores, setDisplayScores] = useState([0, 0, 0]);
  const [outcomeVisible, setOutcomeVisible] = useState(false);

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    timers.push(setTimeout(() => setPhase(1), 1200));
    timers.push(setTimeout(() => setPhase(2), 3500));
    timers.push(setTimeout(() => setPhase(3), 6500));
    timers.push(setTimeout(() => setPhase(4), 9500));

    // Animate scores
    timers.push(setTimeout(() => {
      let frame = 0;
      const total = 60;
      const interval = setInterval(() => {
        frame++;
        const t = frame / total;
        const ease = 1 - Math.pow(1 - t, 3);
        setDisplayScores(boardScores.map(s => Math.round(s * ease)));
        if (frame >= total) {
          clearInterval(interval);
          setDisplayScores(boardScores);
        }
      }, 18);
      return () => clearInterval(interval);
    }, 10500));

    timers.push(setTimeout(() => {
      setPhase(5);
      setOutcomeVisible(true);
    }, 13000));

    return () => timers.forEach(clearTimeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function getOutcome() {
    if (compositeScore >= 72) return {
      icon: '✓',
      color: '#22c55e',
      title: 'Series C Secured',
      body: `The board approved the Q3 roadmap and confirmed confidence in the executive team's direction. James Whitfield noted the quality of the options brief. The $3M investor milestone is on track.`,
    };
    if (compositeScore >= 52) return {
      icon: '⚑',
      color: '#f59e0b',
      title: 'Roadmap Approved with Conditions',
      body: `The board approved the plan with conditions — a formal check-in before October 1st to confirm SSO delivery status. They flagged stakeholder alignment as a risk area to monitor.`,
    };
    return {
      icon: '✕',
      color: '#ef4444',
      title: 'Board Requested Revision',
      body: `The board asked for a revised roadmap addressing unresolved stakeholder concerns. The SSO milestone remains non-negotiable. A follow-up meeting was scheduled for next week.`,
    };
  }

  const outcome = getOutcome();

  return (
    <div style={{
      position: 'fixed', inset: 0, background: '#05050a', display: 'flex',
      flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      fontFamily: 'system-ui, sans-serif', zIndex: 100, overflow: 'hidden',
    }}>
      {/* Subtle grid background */}
      <div style={{
        position: 'absolute', inset: 0, opacity: 0.04,
        backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
        backgroundSize: '40px 40px',
      }} />

      <div style={{ position: 'relative', width: '100%', maxWidth: 620, padding: '0 24px', textAlign: 'center' }}>

        {/* Phase 1: Title */}
        {phase >= 1 && (
          <div style={{ marginBottom: 32, animation: 'fadeIn 0.8s ease forwards' }}>
            <div style={{ fontSize: 10, letterSpacing: 4, color: 'rgba(255,255,255,0.3)', marginBottom: 8 }}>
              MONDAY · 9:00 AM
            </div>
            <div style={{ fontSize: 22, fontWeight: 700, color: '#fff', letterSpacing: -0.5 }}>
              Board Meeting
            </div>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', marginTop: 4 }}>
              Nexus Technologies · Series C Review
            </div>
          </div>
        )}

        {/* Phase 2: Elena speaks */}
        {phase >= 2 && (
          <div style={{
            background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 12, padding: '16px 20px', marginBottom: 24, textAlign: 'left',
            animation: 'fadeSlideIn 0.5s ease forwards',
          }}>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 10 }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://randomuser.me/api/portraits/women/65.jpg"
                alt="Elena Park"
                style={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover', border: '1.5px solid #05966955' }}
              />
              <div>
                <div style={{ fontSize: 12, fontWeight: 600, color: '#059669' }}>Elena Park</div>
                <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)' }}>CEO, Nexus Technologies</div>
              </div>
            </div>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.8)', lineHeight: 1.6 }}>
              "Thank you all for being here. I'd like to present our Q3 roadmap recommendation and walk through the reasoning behind our path forward."
            </div>
          </div>
        )}

        {/* Phase 3: Key decisions summary */}
        {phase >= 3 && (
          <div style={{
            background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: 10, padding: '14px 18px', marginBottom: 24, textAlign: 'left',
            animation: 'fadeSlideIn 0.5s ease forwards',
          }}>
            <div style={{ fontSize: 10, letterSpacing: 2, color: 'rgba(255,255,255,0.3)', marginBottom: 10 }}>
              YOUR RECOMMENDATION SUMMARY
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {[
                'SSO via WorkOS — two-week integration, October 1st milestone secured',
                `Stakeholder alignment: ${Math.round(avgTrust * 100)}% avg team trust`,
                `${session?.unlockedSecrets?.length ?? 0} of 5 hidden constraints surfaced`,
              ].map((line, i) => (
                <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'flex-start', fontSize: 12, color: 'rgba(255,255,255,0.65)' }}>
                  <span style={{ color: '#22c55e', flexShrink: 0, marginTop: 1 }}>›</span>
                  {line}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Phase 4: Board reactions */}
        {phase >= 4 && (
          <div style={{
            display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24,
            animation: 'fadeSlideIn 0.5s ease forwards',
          }}>
            <div style={{ fontSize: 10, letterSpacing: 2, color: 'rgba(255,255,255,0.3)', marginBottom: 2 }}>
              BOARD CONFIDENCE
            </div>
            {BOARD_MEMBERS.map((member, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 120, textAlign: 'right' }}>
                  <div style={{ fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.8)' }}>{member.name}</div>
                  <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)' }}>{member.firm}</div>
                </div>
                <div style={{
                  flex: 1, height: 6, background: 'rgba(255,255,255,0.08)',
                  borderRadius: 3, overflow: 'hidden',
                }}>
                  <div style={{
                    height: '100%', borderRadius: 3,
                    background: displayScores[i] >= 70 ? '#22c55e' : displayScores[i] >= 50 ? '#f59e0b' : '#ef4444',
                    width: `${displayScores[i]}%`,
                    transition: 'width 0.05s linear',
                  }} />
                </div>
                <div style={{ width: 36, fontSize: 13, fontWeight: 700, color: 'rgba(255,255,255,0.9)', textAlign: 'right' }}>
                  {displayScores[i]}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Phase 5: Outcome */}
        {phase >= 5 && outcomeVisible && (
          <div style={{
            border: `1px solid ${outcome.color}44`,
            background: `${outcome.color}0d`,
            borderRadius: 12, padding: '18px 22px', marginBottom: 28,
            animation: 'fadeSlideIn 0.6s ease forwards',
            textAlign: 'left',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
              <div style={{
                width: 28, height: 28, borderRadius: '50%',
                background: `${outcome.color}22`, display: 'flex', alignItems: 'center',
                justifyContent: 'center', fontSize: 14, color: outcome.color, fontWeight: 700,
              }}>
                {outcome.icon}
              </div>
              <div style={{ fontSize: 15, fontWeight: 700, color: outcome.color }}>{outcome.title}</div>
            </div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.65)', lineHeight: 1.65 }}>
              {outcome.body}
            </div>
          </div>
        )}

        {/* CTA */}
        {phase >= 5 && (
          <button
            onClick={() => setScreen('replay')}
            style={{
              padding: '12px 28px', background: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.18)', borderRadius: 8,
              color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer',
              letterSpacing: 0.3, animation: 'fadeIn 0.5s ease 0.3s both',
            }}
          >
            View Your Performance Report →
          </button>
        )}
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
