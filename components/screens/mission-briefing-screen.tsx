"use client";
import { useState, useEffect, useRef } from "react";
import { useAppStore } from "@/lib/store";
import { CHARACTERS } from "@/lib/data";
import { Character } from "@/lib/types";
import { Avatar } from "@/components/ui/avatar";

/* ── Design tokens ─────────────────────────────────────────────────────────── */
const bg      = '#0a0c0b';
const primary = '#147b58';
const text     = '#efefef';
const muted    = 'rgba(175,163,159,0.75)';

/* ── Animated section wrapper ───────────────────────────────────────────────── */
function Section({ visible, delay = 0, children }: {
  visible: boolean;
  delay?: number;
  children: React.ReactNode;
}) {
  return (
    <div style={{
      opacity: visible ? 1 : 0,
      transform: visible ? 'translateY(0)' : 'translateY(18px)',
      transition: `opacity 0.75s ease ${delay}ms, transform 0.75s ease ${delay}ms`,
    }}>
      {children}
    </div>
  );
}

/* ── Stat badge ─────────────────────────────────────────────────────────────── */
function Badge({ label, color = 'rgba(255,255,255,0.06)', textColor = muted, borderColor = 'rgba(255,255,255,0.1)' }: {
  label: string;
  color?: string;
  textColor?: string;
  borderColor?: string;
}) {
  return (
    <div style={{
      padding: '4px 11px', borderRadius: 8,
      background: color, border: `1px solid ${borderColor}`,
      fontSize: 12, fontWeight: 500, color: textColor,
      whiteSpace: 'nowrap',
    }}>
      {label}
    </div>
  );
}

/* ── Emotion label ──────────────────────────────────────────────────────────── */
function emotionLabel(e: Character['emotion']): string {
  const map: Record<Character['emotion'], string> = {
    neutral: 'Neutral', frustrated: 'Frustrated',
    cooperative: 'Cooperative', disengaged: 'Disengaged', alarmed: 'Alarmed',
  };
  return map[e] ?? e;
}

/* ── Profile modal ──────────────────────────────────────────────────────────── */
function ProfileModal({ char, onClose }: { char: Character; onClose: () => void }) {
  const trustPct = Math.round(char.trust * 100);
  const trustColor = char.trust >= 0.65 ? '#22c55e' : char.trust >= 0.5 ? '#eab308' : '#ef4444';

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 200,
        background: 'rgba(0,0,0,0.72)', backdropFilter: 'blur(10px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 24,
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: 'rgba(13,18,15,0.97)',
          border: `1px solid ${char.color}30`,
          borderRadius: 20, padding: 32,
          maxWidth: 440, width: '100%',
          boxShadow: `0 24px 80px rgba(0,0,0,0.7), 0 0 40px ${char.color}12`,
          position: 'relative',
          animation: 'modalIn 0.25s ease',
        }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute', top: 16, right: 16,
            background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 8, width: 32, height: 32,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', color: muted, fontSize: 16, fontFamily: 'inherit',
          }}
        >
          ×
        </button>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
          <Avatar src={char.avatar} name={char.name} color={char.color} size="lg" />
          <div>
            <div style={{ fontSize: 17, fontWeight: 700, color: text, marginBottom: 3 }}>{char.name}</div>
            <div style={{ fontSize: 12.5, color: muted }}>{char.title}</div>
          </div>
        </div>

        {/* Trust bar */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
            <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(175,163,159,0.45)' }}>
              Trust level
            </span>
            <span style={{ fontSize: 12, fontWeight: 700, color: trustColor }}>{trustPct}%</span>
          </div>
          <div style={{ height: 4, borderRadius: 4, background: 'rgba(255,255,255,0.08)' }}>
            <div style={{ height: '100%', borderRadius: 4, background: trustColor, width: `${trustPct}%`, transition: 'width 0.6s ease' }} />
          </div>
        </div>

        {/* Emotion badge */}
        <div style={{ marginBottom: 20 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            background: `${char.color}12`, border: `1px solid ${char.color}30`,
            borderRadius: 8, padding: '5px 12px',
          }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: char.color }} />
            <span style={{ fontSize: 12, color: char.color, fontWeight: 600 }}>{emotionLabel(char.emotion)}</span>
          </div>
        </div>

        {/* Personality */}
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(175,163,159,0.4)', marginBottom: 8 }}>
            Personality
          </div>
          <p style={{ fontSize: 13.5, color: muted, lineHeight: 1.75, margin: 0 }}>
            {char.personality}
          </p>
        </div>

        {/* Visible agenda */}
        <div>
          <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(175,163,159,0.4)', marginBottom: 8 }}>
            Visible agenda
          </div>
          <p style={{ fontSize: 13.5, color: muted, lineHeight: 1.75, margin: 0 }}>
            {char.visibleAgenda}
          </p>
        </div>
      </div>
    </div>
  );
}

/* ── Main component ─────────────────────────────────────────────────────────── */
export function MissionBriefingScreen() {
  const { setScreen, user } = useAppStore();
  const displayName = user?.name ?? 'there';

  const [vis, setVis] = useState({ s1: false, s2: false, team: false, cta: false });
  const [selectedChar, setSelectedChar] = useState<Character | null>(null);

  useEffect(() => {
    const t1 = setTimeout(() => setVis(v => ({ ...v, s1: true })),    500);
    const t2 = setTimeout(() => setVis(v => ({ ...v, s2: true })),   1300);
    const t3 = setTimeout(() => setVis(v => ({ ...v, team: true })), 2300);
    const t4 = setTimeout(() => setVis(v => ({ ...v, cta: true })),  3000);
    return () => [t1, t2, t3, t4].forEach(clearTimeout);
  }, []);

  /* parallax */
  const containerRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  function handleMouseMove(e: React.MouseEvent) {
    if (!containerRef.current) return;
    const r = containerRef.current.getBoundingClientRect();
    setTilt({
      x: ((e.clientX - r.left) / r.width  - 0.5) * 10,
      y: ((e.clientY - r.top)  / r.height - 0.5) * 10,
    });
  }

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      style={{ position: 'fixed', inset: 0, background: bg, display: 'flex', fontFamily: 'inherit', zIndex: 100, overflow: 'hidden' }}
    >
      {/* ── LEFT PANEL ─────────────────────────────────────────────────────── */}
      <div style={{ position: 'relative', width: '42%', flexShrink: 0, overflow: 'hidden' }}>

        {/* Office photo with parallax */}
        <div style={{ position: 'absolute', inset: -16, overflow: 'hidden' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&q=80"
            alt="Nexus Technologies office"
            style={{
              width: '100%', height: '100%', objectFit: 'cover',
              transform: `translate(${tilt.x}px, ${tilt.y}px) scale(1.05)`,
              transition: 'transform 0.15s ease-out',
            }}
          />
        </div>

        {/* Overlays */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.15) 50%, rgba(0,0,0,0.55) 100%)' }} />
        <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(to right, transparent 60%, ${bg} 100%)` }} />

        {/* Company card */}
        <div style={{
          position: 'absolute', bottom: 28, left: 24, right: 24, zIndex: 2,
          background: 'rgba(0,0,0,0.68)', backdropFilter: 'blur(28px)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: 16, padding: '18px 20px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 14 }}>
            <div style={{
              width: 44, height: 44, borderRadius: 12, flexShrink: 0,
              background: 'rgba(20,123,88,0.2)', border: '1px solid rgba(20,123,88,0.4)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 13, fontWeight: 800, color: primary, letterSpacing: '-0.5px',
            }}>
              NT
            </div>
            <div>
              <div style={{ fontSize: 15, fontWeight: 700, color: text }}>Nexus Technologies</div>
              <div style={{ fontSize: 12, color: muted }}>B2B SaaS Platform</div>
            </div>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            <Badge label="$20M Series C" />
            <Badge label="300 employees" />
            <Badge label="B2B SaaS" />
            <Badge
              label="INTERMEDIATE"
              color="rgba(20,123,88,0.12)"
              textColor={primary}
              borderColor="rgba(20,123,88,0.3)"
            />
          </div>
        </div>
      </div>

      {/* ── RIGHT PANEL ────────────────────────────────────────────────────── */}
      <div style={{ flex: 1, overflowY: 'auto' }}>
        <div style={{
          minHeight: '100%', boxSizing: 'border-box',
          padding: '52px 52px 52px 40px',
          display: 'flex', flexDirection: 'column', justifyContent: 'center',
          gap: 36,
        }}>

          {/* Top label */}
          <div style={{ opacity: vis.s1 ? 1 : 0, transition: 'opacity 0.6s ease 200ms' }}>
            <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '0.12em', color: primary, textTransform: 'uppercase' }}>
              Day 1 at Nexus Technologies
            </div>
          </div>

          {/* Section 1 — Welcome */}
          <Section visible={vis.s1}>
            <h1 style={{
              fontSize: 34, fontWeight: 700, color: text,
              lineHeight: 1.2, letterSpacing: '-0.025em',
              marginBottom: 14,
            }}>
              Welcome to the team,<br />{displayName}! 🎉
            </h1>
            <p style={{ fontSize: 16, color: muted, lineHeight: 1.75, maxWidth: 480 }}>
              You&apos;ve just joined as PM at one of the most exciting Series C companies in B2B SaaS.
              The team&apos;s thrilled to have you — they just didn&apos;t expect things to get this complicated so fast.
            </p>
          </Section>

          {/* Section 2 — The situation */}
          <Section visible={vis.s2}>
            <div style={{ borderLeft: '2px solid rgba(20,123,88,0.45)', paddingLeft: 20 }}>
              <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '0.1em', color: 'rgba(175,163,159,0.45)', textTransform: 'uppercase', marginBottom: 12 }}>
                Heads up
              </div>
              <p style={{ fontSize: 15, color: muted, lineHeight: 1.8, maxWidth: 500, marginBottom: 10 }}>
                Three conflicting roadmaps are in circulation. A $2M enterprise deal is on the line.
                The board meets Monday morning, and somewhere in the Series C term sheet is a constraint
                nobody&apos;s told the team about yet.
              </p>
              <p style={{ fontSize: 15, color: muted, lineHeight: 1.8, maxWidth: 500, marginBottom: 18 }}>
                Your job: figure out what&apos;s really going on, get everyone aligned, and walk into that
                board room with a plan the CEO can actually defend.
              </p>
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                background: 'rgba(20,123,88,0.08)', border: '1px solid rgba(20,123,88,0.22)',
                borderRadius: 8, padding: '8px 14px',
              }}>
                <div style={{
                  width: 7, height: 7, borderRadius: '50%',
                  background: primary, boxShadow: `0 0 8px ${primary}`,
                  animation: 'pulseGlow 2s ease-in-out infinite',
                }} />
                <span style={{ fontSize: 13, color: primary, fontWeight: 600 }}>
                  72 hours remaining. The clock started now.
                </span>
              </div>
            </div>
          </Section>

          {/* Section 3 — Your team */}
          <Section visible={vis.team}>
            <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '0.1em', color: 'rgba(175,163,159,0.45)', textTransform: 'uppercase', marginBottom: 14 }}>
              Your team — click to learn more
            </div>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              {CHARACTERS.map((char, i) => (
                <div
                  key={char.id}
                  onClick={() => setSelectedChar(char)}
                  style={{
                    background: `${char.color}0d`,
                    border: `1px solid ${char.color}28`,
                    borderRadius: 12,
                    padding: '10px 14px',
                    display: 'flex', alignItems: 'center', gap: 10,
                    cursor: 'pointer',
                    opacity: vis.team ? 1 : 0,
                    transform: vis.team ? 'translateY(0)' : 'translateY(8px)',
                    transition: `opacity 0.45s ease ${i * 90}ms, transform 0.45s ease ${i * 90}ms, border-color 0.15s, background 0.15s`,
                  }}
                  onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = `${char.color}55`; (e.currentTarget as HTMLDivElement).style.background = `${char.color}18`; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = `${char.color}28`; (e.currentTarget as HTMLDivElement).style.background = `${char.color}0d`; }}
                >
                  <Avatar src={char.avatar} name={char.name} color={char.color} size="sm" />
                  <div>
                    <div style={{ fontSize: 12.5, fontWeight: 600, color: text, lineHeight: 1.3 }}>{char.name}</div>
                    <div style={{ fontSize: 11, color: muted }}>{char.title}</div>
                  </div>
                </div>
              ))}
            </div>
          </Section>

          {/* CTA */}
          <Section visible={vis.cta}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'flex-start' }}>
              <button
                onClick={() => setScreen('assessment')}
                style={{
                  padding: '14px 32px', borderRadius: 12,
                  background: primary, border: 'none',
                  color: '#fff', fontSize: 15, fontWeight: 600,
                  cursor: 'pointer', fontFamily: 'inherit',
                  transition: 'opacity 0.15s, transform 0.15s',
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.opacity = '0.88'; (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1.02)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.opacity = '1'; (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)'; }}
              >
                Accept the challenge →
              </button>
              <button
                onClick={() => setScreen('assessment')}
                style={{ background: 'none', border: 'none', color: muted, fontSize: 13, cursor: 'pointer', fontFamily: 'inherit', padding: 0 }}
              >
                Skip briefing
              </button>
            </div>
          </Section>

        </div>
      </div>

      {/* ── Profile modal ───────────────────────────────────────────────────── */}
      {selectedChar && (
        <ProfileModal char={selectedChar} onClose={() => setSelectedChar(null)} />
      )}

      <style>{`
        @keyframes pulseGlow {
          0%, 100% { opacity: 1; box-shadow: 0 0 8px ${primary}; }
          50%       { opacity: 0.6; box-shadow: 0 0 16px ${primary}; }
        }
        @keyframes modalIn {
          from { opacity: 0; transform: translateY(12px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  );
}
