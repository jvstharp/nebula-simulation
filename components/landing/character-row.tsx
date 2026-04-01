"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";

const CHARACTERS = [
  {
    id: 'sarah',
    name: 'Sarah Chen',
    title: 'VP of Product',
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    color: '#7c3aed',
    trust: 72,
    hook: 'Holds institutional memory. Will become your strongest advocate — if you treat her as a partner.',
  },
  {
    id: 'marcus',
    name: 'Marcus Webb',
    title: 'Engineering Lead',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    color: '#0891b2',
    trust: 51,
    hook: 'Knows a 2-week SSO path exists. Hasn\'t mentioned it because nobody asked.',
  },
  {
    id: 'priya',
    name: 'Priya Sharma',
    title: 'Head of Design',
    avatar: 'https://randomuser.me/api/portraits/women/56.jpg',
    color: '#db2777',
    trust: 68,
    hook: 'Sitting on research that explains the entire NPS drop. Won\'t volunteer it unprompted.',
  },
  {
    id: 'tom',
    name: 'Tom Rivera',
    title: 'Sales Director',
    avatar: 'https://randomuser.me/api/portraits/men/52.jpg',
    color: '#d97706',
    trust: 44,
    hook: 'Framing the Acme deal as more locked-in than it is. Has a second $1.4M prospect he hasn\'t mentioned.',
  },
  {
    id: 'elena',
    name: 'Elena Park',
    title: 'CEO',
    avatar: 'https://randomuser.me/api/portraits/women/65.jpg',
    color: '#059669',
    trust: 60,
    hook: 'Has a $3M investor clawback clause tied to October 1st SSO. Assumes everyone already knows.',
  },
];

function useInView(threshold = 0.15) {
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

export function CharacterRow() {
  const { ref, inView } = useInView(0.1);

  return (
    <section style={{ background: '#0c0c0e', padding: '80px 24px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
      <div style={{ maxWidth: 1080, margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: 48 }}>
          <div style={{
            fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase',
            color: '#147b58', marginBottom: 14,
          }}>
            The Cast
          </div>
          <h2 style={{
            fontSize: 'clamp(24px, 3.5vw, 38px)', fontWeight: 700, color: '#f0f0f3',
            margin: '0 0 10px', letterSpacing: '-0.025em', lineHeight: 1.15,
          }}>
            Five stakeholders. Five agendas.
          </h2>
          <p style={{ fontSize: 14, color: 'rgba(240,240,243,0.45)', margin: 0, lineHeight: 1.6 }}>
            Each character has a public face and a private truth. Your job is to figure out which is which.
          </p>
        </div>

        {/* Cards — horizontal scroll on mobile */}
        <div
          ref={ref}
          style={{
            display: 'flex', gap: 16,
            overflowX: 'auto', paddingBottom: 8,
            scrollSnapType: 'x mandatory',
            msOverflowStyle: 'none', scrollbarWidth: 'none',
          }}
          className="hide-scrollbar"
        >
          {CHARACTERS.map((char, i) => (
            <CharacterCard key={char.id} char={char} index={i} inView={inView} />
          ))}
        </div>
      </div>

      <style>{`
        .hide-scrollbar::-webkit-scrollbar { display: none; }
      `}</style>
    </section>
  );
}

function CharacterCard({ char, index, inView }: {
  char: typeof CHARACTERS[number];
  index: number;
  inView: boolean;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        flexShrink: 0,
        width: 200,
        scrollSnapAlign: 'start',
        background: hovered ? '#18181c' : '#111114',
        border: `1px solid ${hovered ? 'rgba(255,255,255,0.13)' : 'rgba(255,255,255,0.07)'}`,
        borderRadius: 14, padding: '20px 18px',
        transition: 'background 0.2s, border-color 0.2s, transform 0.2s, opacity 0.5s',
        transform: hovered ? 'translateY(-3px)' : inView ? 'translateY(0)' : 'translateY(16px)',
        opacity: inView ? 1 : 0,
        transitionDelay: `${index * 0.08}s`,
        cursor: 'default',
      }}
    >
      {/* Color accent bar */}
      <div style={{
        height: 2, background: char.color, borderRadius: 2, marginBottom: 16,
        width: hovered ? '100%' : '40%',
        transition: 'width 0.3s ease',
      }} />

      {/* Avatar + online dot */}
      <div style={{ position: 'relative', width: 44, height: 44, marginBottom: 14 }}>
        <Image
          src={char.avatar}
          alt={char.name}
          width={44}
          height={44}
          style={{ borderRadius: '50%', border: `2px solid ${char.color}44` }}
        />
        <div style={{
          position: 'absolute', bottom: 0, right: 0,
          width: 10, height: 10, borderRadius: '50%',
          background: '#22c55e', border: '2px solid #111114',
        }} />
      </div>

      {/* Name + title */}
      <div style={{ fontSize: 14, fontWeight: 700, color: '#f0f0f3', marginBottom: 2, letterSpacing: '-0.01em' }}>
        {char.name}
      </div>
      <div style={{ fontSize: 11, color: char.color, fontWeight: 600, marginBottom: 12, opacity: 0.85 }}>
        {char.title}
      </div>

      {/* Trust bar */}
      <div style={{ marginBottom: 14 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 }}>
          <span style={{ fontSize: 9, fontWeight: 700, color: 'rgba(240,240,243,0.35)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            Starting Trust
          </span>
          <span style={{ fontSize: 11, fontWeight: 700, color: char.trust >= 65 ? '#22c55e' : char.trust >= 50 ? '#f59e0b' : '#ef4444' }}>
            {char.trust}%
          </span>
        </div>
        <div style={{ height: 3, background: 'rgba(255,255,255,0.08)', borderRadius: 2 }}>
          <div style={{
            width: `${char.trust}%`, height: '100%', borderRadius: 2,
            background: char.trust >= 65 ? '#22c55e' : char.trust >= 50 ? '#f59e0b' : '#ef4444',
          }} />
        </div>
      </div>

      {/* Hook text */}
      <p style={{
        fontSize: 11.5, color: 'rgba(240,240,243,0.50)', lineHeight: 1.55, margin: 0,
      }}>
        {char.hook}
      </p>
    </div>
  );
}
