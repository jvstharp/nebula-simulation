"use client";
import { useState } from "react";
import { useAppStore } from "@/lib/store";
import { AppWindow } from "@/components/layout/app-window";

/* ── Design tokens (new system) ─────────────────────────────────────────────── */
const T = {
  surface:    '#212121',
  surface2:   '#2e2c2e',
  text:       '#efefef',
  muted:      '#afa39f',
  border:     'rgba(255,255,255,0.04)',
  primary:    '#147b58',
  yellow:     '#deaf49',
  success:    '#28c840',
  shadow1:    '0 1px 2px rgba(0,0,0,0.6)',
} as const;

/** New card style — replaces legacy cardStyle */
const card = {
  background:   T.surface,
  border:       `1px solid ${T.border}`,
  borderRadius: 12,
  boxShadow:    T.shadow1,
} as const;

/** Section header with optional right action */
function SectionHdr({ title, action, onAction }: { title: string; action?: string; onAction?: () => void }) {
  return (
    <div style={{
      fontSize: 11, fontWeight: 600, color: T.muted,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      marginBottom: 16, textTransform: 'uppercase', letterSpacing: '0.07em',
    }}>
      <span>{title}</span>
      {action && onAction && (
        <button onClick={onAction} style={{
          fontSize: 11, color: T.primary, background: 'none', border: 'none',
          cursor: 'pointer', fontWeight: 600, textTransform: 'none', letterSpacing: 0,
          fontFamily: 'inherit',
        }}>
          {action}
        </button>
      )}
    </div>
  );
}

/* ── Data ───────────────────────────────────────────────────────────────────── */
const BADGES = [
  { id: 1, label: 'Strategic Thinker', icon: '🧠', color: '#bb76d6', earned: true,  desc: 'Demonstrated multi-step strategic reasoning in 2+ sessions' },
  { id: 2, label: 'Fast Executor',     icon: '⚡', color: '#deaf49', earned: true,  desc: 'Resolved Tier 3 chaos event within 10 minutes' },
  { id: 3, label: 'Stakeholder Master',icon: '🤝', color: '#02ba67', earned: true,  desc: 'Maintained avg trust score above 0.75 throughout session' },
  { id: 4, label: 'Clear Communicator',icon: '💬', color: '#49a5de', earned: true,  desc: 'Communication score above 80 in two consecutive sessions' },
  { id: 5, label: 'Crisis Manager',    icon: '🔥', color: '#d44848', earned: true,  desc: 'Successfully navigated all three chaos tiers' },
  { id: 6, label: 'Team Builder',      icon: '👥', color: '#db966b', earned: false, desc: 'Engage all 5 characters with positive outcomes' },
  { id: 7, label: 'Data Driven',       icon: '📊', color: '#49a5de', earned: false, desc: 'Reference metrics in 80% of decisions' },
  { id: 8, label: 'Consensus Builder', icon: '🎯', color: '#bb76d6', earned: false, desc: 'Achieve full stakeholder alignment in a single session' },
];

const CERTIFICATES = [
  { id: 1, title: 'Roadmap Mastery',           session: 'Session 1', date: 'Jan 14, 2026', score: 84, color: '#bb76d6', verificationId: 'NEB-2026-0114-MC01' },
  { id: 2, title: 'Stakeholder Alignment Pro', session: 'Session 2', date: 'Feb 22, 2026', score: 91, color: '#02ba67', verificationId: 'NEB-2026-0222-MC02' },
];

const SESSIONS = [
  { id: 1, scenario: 'The Roadmap Reckoning', date: 'Jan 14, 2026', score: 84, duration: '47 min', status: 'completed' },
  { id: 2, scenario: 'The Roadmap Reckoning', date: 'Feb 22, 2026', score: 91, duration: '52 min', status: 'completed' },
  { id: 3, scenario: 'The Roadmap Reckoning', date: 'Mar 14, 2026', score: null, duration: '—',    status: 'active'    },
];

const SKILL_SCORES = [
  { label: 'Communication',       score: 84, color: '#49a5de' },
  { label: 'Strategic Thinking',  score: 79, color: '#bb76d6' },
  { label: 'Stakeholder Mgmt',    score: 88, color: '#02ba67' },
  { label: 'Execution Speed',     score: 65, color: '#deaf49' },
  { label: 'Conflict Resolution', score: 72, color: '#db966b' },
  { label: 'Prioritisation',      score: 77, color: '#d44848' },
];

const EXPERIENCE = [
  {
    role: 'Senior Product Manager',
    company: 'Nexus Technologies',
    period: 'Jan 2025 – Present',
    duration: '3 mos',
    location: 'San Francisco, CA · On-site',
    description: 'Leading Q3 platform refresh for a 300-person B2B SaaS company post-Series C. Managing cross-functional roadmap across Engineering, Design, and Sales against competing stakeholder priorities.',
    logo: '🏢',
    current: true,
  },
  {
    role: 'Product Manager',
    company: 'Clearpath Analytics',
    period: 'Mar 2022 – Dec 2024',
    duration: '2 yrs 9 mos',
    location: 'San Francisco, CA · Hybrid',
    description: 'Owned the core data pipeline product. Launched 4 major feature sets, grew ARR contribution by 38%, and reduced churn by restructuring the onboarding experience with design.',
    logo: '📊',
    current: false,
  },
  {
    role: 'Associate Product Manager',
    company: 'Vantage Labs',
    period: 'Jul 2019 – Feb 2022',
    duration: '2 yrs 7 mos',
    location: 'New York, NY · Remote',
    description: 'Joined APM programme. Built first mobile app for logistics tracking used by 15k monthly active users. Managed sprint cycles, user research, and stakeholder communication.',
    logo: '🔬',
    current: false,
  },
];

const EDUCATION = [
  {
    institution: 'University of California, Berkeley',
    degree: 'BSc Business Administration · Product & Technology',
    period: '2015 – 2019',
    logo: '🎓',
  },
  {
    institution: 'General Assembly',
    degree: 'Certificate · Product Management Immersive',
    period: '2019',
    logo: '📚',
  },
];

const NEBULA_STATS = [
  { label: 'Immersion Score',      value: '87',   suffix: '/ 100', color: T.primary,  icon: '⚡', desc: 'Overall platform performance' },
  { label: 'Avg Session Score',    value: '87.5', suffix: 'pts',   color: '#49a5de',  icon: '📈', desc: 'Across 2 completed sessions' },
  { label: 'Chaos Response',       value: 'A−',   suffix: '',      color: '#deaf49',  icon: '🔥', desc: 'How fast you handle crises' },
  { label: 'Stakeholder Trust',    value: '0.81', suffix: 'avg',   color: '#02ba67',  icon: '🤝', desc: 'Average colleague trust score' },
];

const NAV_ITEMS = ['Overview', 'Badges', 'Certificates', 'Records'];

/* ── Profile Screen ─────────────────────────────────────────────────────────── */
export function ProfileScreen() {
  const { user, setScreen } = useAppStore();
  const [activeNav, setActiveNav] = useState('Overview');

  const displayName  = user?.name  ?? 'Maya Chen';

  return (
    <AppWindow
      screenKey="profile"
      url={`profile.nebula.io / ${displayName.replace(' ', '-').toLowerCase()}`}
      urlAccent="rgba(20,123,88,0.55)"
      label="Profile"
      accentColor="#147b58"
      maxWidth={1100}
    >
      {/* Body */}
      <>

        {/* ── Main content ── */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px 28px 36px', background: '#161616' }}>

          {/* ── Action strip ── */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 6, marginBottom: 16 }}>
            <button
              onClick={() => setScreen('desktop')}
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '6px 12px', borderRadius: 8, border: 'none',
                background: 'rgba(255,255,255,0.04)', color: 'rgba(175,163,159,0.7)',
                fontSize: 12, cursor: 'pointer', fontFamily: 'inherit',
                transition: 'color 120ms, background 120ms',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.07)'; e.currentTarget.style.color = '#efefef'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.color = 'rgba(175,163,159,0.7)'; }}
            >
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none" style={{ flexShrink: 0 }}>
                <rect x="1" y="1" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.1" />
                <rect x="7" y="1" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.1" />
                <rect x="1" y="7" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.1" />
                <rect x="7" y="7" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.1" />
              </svg>
              Desktop
            </button>
            <button
              onClick={() => setScreen('login')}
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '6px 12px', borderRadius: 8, border: 'none',
                background: 'rgba(212,72,72,0.06)', color: 'rgba(212,72,72,0.7)',
                fontSize: 12, cursor: 'pointer', fontFamily: 'inherit',
                transition: 'color 120ms, background 120ms',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(212,72,72,0.10)'; e.currentTarget.style.color = '#d44848'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(212,72,72,0.06)'; e.currentTarget.style.color = 'rgba(212,72,72,0.7)'; }}
            >
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none" style={{ flexShrink: 0 }}>
                <path d="M8.5 6.5H1.5M5 4l-3 2.5L5 9" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M5 1.5h5a1 1 0 011 1v8a1 1 0 01-1 1H5" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
              </svg>
              Log out
            </button>
          </div>

          {/* ── Profile Header: Two-card hero ─────────────────────────── */}
          <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: 14, marginBottom: 16 }}>

            {/* ── Left: Identity card ── */}
            <div style={{
              background: '#18181c',
              border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: 12,
              boxShadow: '0 1px 3px rgba(0,0,0,0.5)',
              padding: '32px 20px 28px',
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              textAlign: 'center', gap: 0,
            }}>
              {/* Avatar */}
              <div style={{
                width: 120, height: 120, borderRadius: '50%',
                background: 'linear-gradient(145deg, #c97b50, #7b3a1e)',
                border: '3px solid rgba(20,123,88,0.35)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 0 28px rgba(20,123,88,0.20)',
                marginBottom: 18, flexShrink: 0,
              }}>
                <svg width="76" height="76" viewBox="0 0 46 46" fill="none">
                  <ellipse cx="23" cy="18" rx="9"  ry="10" fill="rgba(255,255,255,0.85)" />
                  <ellipse cx="23" cy="40" rx="15" ry="11" fill="rgba(255,255,255,0.85)" />
                  <ellipse cx="23" cy="12" rx="10" ry="7"  fill="#2a1a0e" />
                  <ellipse cx="12" cy="19" rx="2.8" ry="8" fill="#2a1a0e" />
                  <ellipse cx="34" cy="19" rx="2.8" ry="8" fill="#2a1a0e" />
                </svg>
              </div>
              {/* Name */}
              <div style={{ fontSize: 20, fontWeight: 800, color: '#f0f0f3', marginBottom: 8, letterSpacing: '-0.02em' }}>
                {displayName}
              </div>
              {/* Premium badge */}
              <span style={{
                fontSize: 11.5, fontWeight: 600, color: '#000000',
                background: '#02ba67',
                borderRadius: 99, padding: '4px 14px',
              }}>
                Premium User
              </span>
              {/* Credits */}
              <div style={{ marginTop: 16, paddingTop: 14, borderTop: '1px solid rgba(255,255,255,0.06)', width: '100%', textAlign: 'center' }}>
                <div style={{ fontSize: 10, color: 'rgba(175,163,159,0.5)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>Credits</div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5 }}>
                  <span style={{ fontSize: 20, fontWeight: 800, color: '#deaf49' }}>{user?.credits ?? 2450}</span>
                  <span style={{ fontSize: 11, color: 'rgba(175,163,159,0.45)' }}>NEB</span>
                </div>
              </div>
            </div>

            {/* ── Right: Bio & details card ── */}
            <div style={{
              background: '#18181c',
              border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: 12,
              boxShadow: '0 1px 3px rgba(0,0,0,0.5)',
              padding: '22px 26px 20px',
            }}>
              {/* Card header */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                <span style={{ fontSize: 14, fontWeight: 700, color: '#f0f0f3', letterSpacing: '-0.01em' }}>
                  Bio &amp; other details
                </span>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: T.success, flexShrink: 0 }} />
              </div>

              {/* Fields grid — 2 columns × 3 rows */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px 24px', marginBottom: 16 }}>

                {/* Row 1 */}
                <div>
                  <div style={{ fontSize: 10.5, color: 'rgba(240,240,243,0.38)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 4, fontWeight: 600 }}>My Role</div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#f0f0f3' }}>Senior Product Manager</div>
                </div>
                <div>
                  <div style={{ fontSize: 10.5, color: 'rgba(240,240,243,0.38)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 4, fontWeight: 600 }}>My Experience Level</div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#f0f0f3' }}>Senior · 6+ years</div>
                </div>

                {/* Row 2 */}
                <div>
                  <div style={{ fontSize: 10.5, color: 'rgba(240,240,243,0.38)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 4, fontWeight: 600 }}>My Company</div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#f0f0f3' }}>Nexus Technologies</div>
                </div>
                <div>
                  <div style={{ fontSize: 10.5, color: 'rgba(240,240,243,0.38)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 4, fontWeight: 600 }}>My Industry</div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#f0f0f3' }}>B2B SaaS</div>
                </div>

                {/* Row 3 */}
                <div>
                  <div style={{ fontSize: 10.5, color: 'rgba(240,240,243,0.38)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 4, fontWeight: 600 }}>My City or Region</div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#f0f0f3' }}>San Francisco, CA</div>
                </div>
                <div>
                  <div style={{ fontSize: 10.5, color: 'rgba(240,240,243,0.38)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 4, fontWeight: 600 }}>Availability</div>
                  <span style={{
                    display: 'inline-flex', alignItems: 'center', gap: 5,
                    fontSize: 11, fontWeight: 600, color: '#000000',
                    background: '#02ba67',
                    borderRadius: 99, padding: '3px 10px',
                  }}>
                    <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#000000', flexShrink: 0, display: 'inline-block' }} />
                    Available for Simulation
                  </span>
                </div>

              </div>

              {/* Divider */}
              <div style={{ height: 1, background: 'rgba(255,255,255,0.06)', marginBottom: 14 }} />

              {/* Badges row */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                <span style={{ fontSize: 10.5, color: 'rgba(240,240,243,0.38)', textTransform: 'uppercase', letterSpacing: '0.07em', fontWeight: 600, width: 52, flexShrink: 0 }}>Badges</span>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {BADGES.filter(b => b.earned).slice(0, 3).map(b => (
                    <span key={b.id} style={{
                      fontSize: 10.5, fontWeight: 600, color: '#000000',
                      background: b.color,
                      borderRadius: 99, padding: '3px 9px',
                    }}>
                      {b.icon} {b.label}
                    </span>
                  ))}
                </div>
              </div>

              {/* Tags row */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 10.5, color: 'rgba(240,240,243,0.38)', textTransform: 'uppercase', letterSpacing: '0.07em', fontWeight: 600, width: 52, flexShrink: 0 }}>Tags</span>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {['#ProductStrategy', '#Roadmapping', '#Agile', '#B2BSaaS', '#Stakeholders'].map(tag => (
                    <span key={tag} style={{
                      fontSize: 10.5, fontWeight: 500, color: 'rgba(240,240,243,0.50)',
                      background: 'rgba(255,255,255,0.04)',
                      border: '1px solid rgba(255,255,255,0.07)',
                      borderRadius: 99, padding: '3px 9px',
                    }}>{tag}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
          {/* ── End Profile Header ── */}

          {/* ── Tab bar ── */}
          <div className="tab-bar" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', marginBottom: 28 }}>
            {NAV_ITEMS.map(item => (
              <button
                key={item}
                className={`tab-item${activeNav === item ? ' active' : ''}`}
                onClick={() => setActiveNav(item)}
              >
                {item}
              </button>
            ))}
          </div>

          {/* OVERVIEW */}
          {activeNav === 'Overview' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>

              {/* ── About ── */}
              <div>
                <SectionHdr title="About" />
                <p style={{ fontSize: 14, color: T.muted, lineHeight: 1.75, maxWidth: 640, margin: 0 }}>
                  A results-driven product leader with 6+ years building B2B SaaS products at scale.
                  Specialises in aligning cross-functional teams, navigating high-stakes stakeholder dynamics,
                  and delivering complex roadmaps under pressure. Known for turning ambiguity into structured decisions.
                  Currently in active simulation at Nexus Technologies, managing a contested Q3 platform roadmap post-Series C.
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 14 }}>
                  {['Product Strategy', 'Roadmapping', 'Stakeholder Management', 'Agile', 'B2B SaaS', 'Cross-functional Leadership'].map(tag => (
                    <span key={tag} style={{
                      fontSize: 11, color: T.muted, background: T.surface,
                      border: `1px solid ${T.border}`, borderRadius: 99,
                      padding: '4px 10px', fontWeight: 500,
                    }}>{tag}</span>
                  ))}
                </div>
              </div>

              {/* ── Nebula Immersion Performance ── */}
              <div>
                <SectionHdr title="Nebula Immersion Performance" />
                <div style={{
                  ...card,
                  padding: '20px 24px',
                  background: 'linear-gradient(135deg, rgba(20,123,88,0.08) 0%, rgba(33,33,33,1) 60%)',
                  border: `1px solid rgba(20,123,88,0.18)`,
                  marginBottom: 14,
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                    <div style={{
                      width: 32, height: 32, borderRadius: 8,
                      background: 'rgba(20,123,88,0.15)', border: '1px solid rgba(20,123,88,0.3)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16,
                    }}>⚡</div>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: T.text }}>Job Immersion Platform · Active Participant</div>
                      <div style={{ fontSize: 11, color: T.muted }}>Scenario: The Roadmap Reckoning · Session 3 in progress</div>
                    </div>
                    <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
                      <div style={{ fontSize: 28, fontWeight: 800, color: T.primary, lineHeight: 1 }}>87</div>
                      <div style={{ fontSize: 10, color: T.muted }}>Immersion Score</div>
                    </div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
                    {NEBULA_STATS.map(s => (
                      <div key={s.label} style={{
                        padding: '12px 14px', borderRadius: 10,
                        background: 'rgba(255,255,255,0.03)', border: `1px solid ${T.border}`,
                      }}>
                        <div style={{ fontSize: 18, marginBottom: 6 }}>{s.icon}</div>
                        <div style={{ fontSize: 18, fontWeight: 800, color: s.color, lineHeight: 1 }}>
                          {s.value}<span style={{ fontSize: 11, fontWeight: 400, color: 'rgba(175,163,159,0.5)', marginLeft: 3 }}>{s.suffix}</span>
                        </div>
                        <div style={{ fontSize: 10, color: T.muted, marginTop: 4 }}>{s.label}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Skill score bars */}
                <div style={{ ...card, padding: '18px 22px' }}>
                  <div style={{ fontSize: 11, fontWeight: 600, color: T.muted, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 16 }}>Skill Scores</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {SKILL_SCORES.map(skill => (
                      <div key={skill.label} style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                        <span style={{ fontSize: 12.5, color: T.muted, width: 155, flexShrink: 0 }}>{skill.label}</span>
                        <div style={{ flex: 1, height: 5, background: 'rgba(255,255,255,0.06)', borderRadius: 3, overflow: 'hidden' }}>
                          <div style={{
                            width: `${skill.score}%`, height: '100%',
                            background: `linear-gradient(90deg, ${skill.color}70, ${skill.color})`,
                            borderRadius: 3,
                          }} />
                        </div>
                        <span style={{ fontSize: 12, fontWeight: 700, color: skill.color, width: 30, textAlign: 'right' }}>{skill.score}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* ── Experience ── */}
              <div>
                <SectionHdr title="Experience" />
                <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {EXPERIENCE.map((exp, i) => (
                    <div key={i} style={{ display: 'flex', gap: 16, paddingBottom: 24, position: 'relative' }}>
                      {/* Timeline line */}
                      {i < EXPERIENCE.length - 1 && (
                        <div style={{
                          position: 'absolute', left: 19, top: 44, bottom: 0,
                          width: 1, background: T.border,
                        }} />
                      )}
                      {/* Logo */}
                      <div style={{
                        width: 40, height: 40, borderRadius: 10, flexShrink: 0,
                        background: T.surface, border: `1px solid ${T.border}`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 18, boxShadow: T.shadow1,
                      }}>
                        {exp.logo}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
                          <div>
                            <div style={{ fontSize: 14, fontWeight: 700, color: T.text, marginBottom: 1 }}>
                              {exp.role}
                              {exp.current && (
                                <span style={{
                                  marginLeft: 8, fontSize: 9, fontWeight: 700,
                                  color: '#000000', background: '#02ba67',
                                  borderRadius: 4,
                                  padding: '1px 6px', verticalAlign: 'middle', textTransform: 'uppercase', letterSpacing: '0.05em',
                                }}>Current</span>
                              )}
                            </div>
                            <div style={{ fontSize: 13, color: T.muted, marginBottom: 2 }}>{exp.company}</div>
                            <div style={{ fontSize: 11, color: 'rgba(175,163,159,0.5)', marginBottom: 10 }}>
                              {exp.period} · {exp.duration} · {exp.location}
                            </div>
                          </div>
                        </div>
                        <p style={{ fontSize: 13, color: T.muted, lineHeight: 1.65, margin: 0 }}>{exp.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* ── Education ── */}
              <div>
                <SectionHdr title="Education" />
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  {EDUCATION.map((edu, i) => (
                    <div key={i} style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                      <div style={{
                        width: 40, height: 40, borderRadius: 10, flexShrink: 0,
                        background: T.surface, border: `1px solid ${T.border}`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 18, boxShadow: T.shadow1,
                      }}>
                        {edu.logo}
                      </div>
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 700, color: T.text, marginBottom: 1 }}>{edu.institution}</div>
                        <div style={{ fontSize: 13, color: T.muted, marginBottom: 1 }}>{edu.degree}</div>
                        <div style={{ fontSize: 11, color: 'rgba(175,163,159,0.5)' }}>{edu.period}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* ── Badges preview ── */}
              <div>
                <SectionHdr title="Badges" action="See all 5 badges →" onAction={() => setActiveNav('Badges')} />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  {BADGES.filter(b => b.earned).slice(0, 2).map(badge => (
                    <div key={badge.id} style={{ ...card, padding: '16px 18px', display: 'flex', alignItems: 'center', gap: 14 }}>
                      <div style={{
                        width: 44, height: 44, borderRadius: 12, flexShrink: 0,
                        background: badge.color,
                        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22,
                      }}>
                        {badge.icon}
                      </div>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 700, color: T.text, marginBottom: 2 }}>{badge.label}</div>
                        <span style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', background: badge.color, color: '#000000', borderRadius: 4, padding: '1px 6px' }}>Earned</span>
                        <div style={{ fontSize: 11, color: T.muted, marginTop: 4, lineHeight: 1.45 }}>{badge.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => setActiveNav('Badges')}
                  style={{
                    marginTop: 10, width: '100%', padding: '10px',
                    background: 'transparent', border: `1px solid ${T.border}`,
                    borderRadius: 10, fontSize: 12, color: T.muted,
                    cursor: 'pointer', fontFamily: 'inherit',
                    transition: 'color 0.15s, border-color 0.15s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.color = T.text; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; }}
                  onMouseLeave={e => { e.currentTarget.style.color = T.muted; e.currentTarget.style.borderColor = T.border; }}
                >
                  View all 8 badges →
                </button>
              </div>

              {/* ── Certificates preview ── */}
              <div>
                <SectionHdr title="Certificates" action="See all →" onAction={() => setActiveNav('Certificates')} />
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {CERTIFICATES.map(cert => (
                    <div key={cert.id} style={{ ...card, padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 14 }}>
                      <div style={{
                        width: 40, height: 40, borderRadius: 10, flexShrink: 0,
                        background: cert.color,
                        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20,
                      }}>
                        🎓
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 13, fontWeight: 700, color: T.text, marginBottom: 2 }}>{cert.title}</div>
                        <div style={{ fontSize: 11, color: T.muted }}>
                          Nebula · {cert.session} · {cert.date}
                        </div>
                      </div>
                      <div style={{
                        padding: '3px 10px', borderRadius: 20, fontSize: 11, flexShrink: 0,
                        background: cert.color, color: '#000000', fontWeight: 700,
                      }}>
                        {cert.score}/100
                      </div>
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => setActiveNav('Certificates')}
                  style={{
                    marginTop: 10, width: '100%', padding: '10px',
                    background: 'transparent', border: `1px solid ${T.border}`,
                    borderRadius: 10, fontSize: 12, color: T.muted,
                    cursor: 'pointer', fontFamily: 'inherit',
                    transition: 'color 0.15s, border-color 0.15s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.color = T.text; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; }}
                  onMouseLeave={e => { e.currentTarget.style.color = T.muted; e.currentTarget.style.borderColor = T.border; }}
                >
                  View all certificates →
                </button>
              </div>

              {/* ── Quick stats strip ── */}
              <div>
                <SectionHdr title="Activity" />
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
                  {[
                    { label: 'Credits',       value: user?.credits ?? 2450, color: T.yellow,  suffix: 'NEB'   },
                    { label: 'Badges Earned', value: 5,                     color: '#bb76d6', suffix: '/ 8'   },
                    { label: 'Sessions',      value: 3,                     color: '#49a5de', suffix: 'total' },
                    { label: 'Certificates',  value: 2,                     color: '#02ba67', suffix: 'issued'},
                  ].map(stat => (
                    <div key={stat.label} style={{ ...card, padding: '14px 16px' }}>
                      <div style={{ fontSize: 10, color: T.muted, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>
                        {stat.label}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
                        <span style={{ fontSize: 24, fontWeight: 800, color: stat.color }}>{stat.value}</span>
                        <span style={{ fontSize: 11, color: 'rgba(175,163,159,0.45)' }}>{stat.suffix}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* BADGES */}
          {activeNav === 'Badges' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div>
                <SectionHdr title="Badges" />
                <p style={{ fontSize: 13, color: T.muted, margin: 0 }}>5 of 8 badges earned across your sessions</p>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 12 }}>
                {BADGES.map(badge => (
                  <div key={badge.id} style={{
                    ...card, padding: '16px',
                    opacity: badge.earned ? 1 : 0.4,
                    display: 'flex', flexDirection: 'column', gap: 10,
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{
                        width: 40, height: 40, borderRadius: 12,
                        background:  badge.earned ? badge.color : T.border,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 20,
                      }}>
                        {badge.earned ? badge.icon : '🔒'}
                      </div>
                      <div>
                        <div style={{ fontSize: 12.5, fontWeight: 700, color: badge.earned ? T.text : T.muted }}>
                          {badge.label}
                        </div>
                        {badge.earned && (
                          <span style={{ fontSize: 10, fontWeight: 600, background: badge.color, color: '#000000', borderRadius: 4, padding: '1px 6px' }}>Earned</span>
                        )}
                      </div>
                    </div>
                    <p style={{ fontSize: 11, color: T.muted, lineHeight: 1.5, margin: 0 }}>{badge.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* CERTIFICATES */}
          {activeNav === 'Certificates' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div>
                <SectionHdr title="Certificates" />
                <p style={{ fontSize: 13, color: T.muted, margin: 0 }}>Blockchain-verified certificates issued upon session completion</p>
              </div>
              {CERTIFICATES.map(cert => (
                <div key={cert.id} style={{ ...card, padding: '20px 24px', display: 'flex', alignItems: 'center', gap: 20 }}>
                  <div style={{
                    width: 56, height: 56, borderRadius: 14,
                    background: cert.color,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 26, flexShrink: 0,
                  }}>
                    🎓
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 15, fontWeight: 700, color: T.text, marginBottom: 4 }}>{cert.title}</div>
                    <div style={{ fontSize: 12, color: T.muted, marginBottom: 10 }}>
                      {cert.session} · Issued {cert.date}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{
                        padding: '3px 10px', borderRadius: 20, fontSize: 11,
                        background: cert.color, color: '#000000', fontWeight: 700,
                      }}>
                        Score: {cert.score}/100
                      </div>
                      <span style={{ fontSize: 11, color: 'rgba(175,163,159,0.4)', fontFamily: 'monospace' }}>
                        {cert.verificationId}
                      </span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button style={{ ...card, padding: '7px 16px', borderRadius: 8, fontSize: 12, fontWeight: 600, color: '#000000', background: cert.color, cursor: 'pointer', border: 'none', fontFamily: 'inherit' }}>
                      View
                    </button>
                    <button style={{ ...card, padding: '7px 16px', borderRadius: 8, fontSize: 12, fontWeight: 500, color: T.muted, cursor: 'pointer', fontFamily: 'inherit' }}>
                      Share
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* RECORDS */}
          {activeNav === 'Records' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div>
                <SectionHdr title="Session Records" />
                <p style={{ fontSize: 13, color: T.muted, margin: 0 }}>Complete history of your simulation runs</p>
              </div>
              {SESSIONS.map(session => (
                <div key={session.id} style={{ ...card, padding: '18px 22px', display: 'flex', alignItems: 'center', gap: 20 }}>
                  <div style={{
                    width: 44, height: 44, borderRadius: 12, flexShrink: 0,
                    background: session.status === 'active' ? '#02ba67' : '#49a5de',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 11, fontWeight: 800,
                    color: '#000000',
                  }}>
                    S{session.id}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: T.text, marginBottom: 4 }}>{session.scenario}</div>
                    <div style={{ fontSize: 11.5, color: T.muted }}>
                      {session.date} · {session.duration}
                    </div>
                  </div>
                  {session.score !== null ? (
                    <div style={{ textAlign: 'right', minWidth: 44 }}>
                      <div style={{ fontSize: 24, fontWeight: 800, color: session.score >= 85 ? '#02ba67' : '#49a5de', lineHeight: 1 }}>
                        {session.score}
                      </div>
                      <div style={{ fontSize: 10, color: 'rgba(175,163,159,0.45)', marginTop: 2 }}>/100</div>
                    </div>
                  ) : (
                    <div style={{
                      padding: '4px 12px', borderRadius: 20,
                      background: '#02ba67',
                      fontSize: 11, color: '#000000', fontWeight: 700,
                    }}>
                      In Progress
                    </div>
                  )}
                  <button style={{ ...card, padding: '7px 14px', borderRadius: 8, fontSize: 12, fontWeight: 500, color: T.muted, cursor: 'pointer', fontFamily: 'inherit' }}>
                    {session.status === 'completed' ? 'View Report' : 'Continue'}
                  </button>
                </div>
              ))}
            </div>
          )}

        </div>
      </>
    </AppWindow>
  );
}
