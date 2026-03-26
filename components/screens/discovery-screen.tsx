"use client";
import { useState, useMemo } from "react";
import { AppWindow } from "@/components/layout/app-window";
import { Sidebar } from "@/components/layout/sidebar";
import { cardStyle, cardHoverIn, cardHoverOut } from "@/components/layout/discovery-ui";

// ── Design tokens ──────────────────────────────────────────────────────────
const G = '#147b58';
const G_BG  = (a: number) => `rgba(20,123,88,${a})`;
type AnyItem = { id: string; [key: string]: unknown };
const LEVEL_COLOR: Record<string, string> = {
  Beginner:     '#02ba67',
  Intermediate: '#deaf49',
  Advanced:     '#d44848',
};

// ── Nav ────────────────────────────────────────────────────────────────────
const DISCOVERY_NAV = [
  { id: 'home',       label: 'Home' },
  { id: 'coaches',    label: 'Coaches' },
  { id: 'credits',    label: 'Credits' },
  { id: 'workplaces', label: 'Workplaces' },
  { id: 'skills',     label: 'Skills Packs' },
];

// ── Data ───────────────────────────────────────────────────────────────────
const COACHES = [
  { id: 'c1', name: 'Priya Kapoor',    role: 'Senior PM Coach',       company: 'Ex-Google',    rate: '$180/hr', rating: 4.9, reviews: 142, available: true,  color: '#22d3ee', specialty: 'Product Strategy',   tags: ['Roadmapping', 'OKRs', 'B2B SaaS'],        bio: 'Former GPM at Google Search. Specialises in helping PMs build strategic clarity in ambiguous environments. Has coached 200+ product professionals across FAANG and high-growth startups.',   avatar: 'https://randomuser.me/api/portraits/women/67.jpg' },
  { id: 'c2', name: 'Marcus Webb',     role: 'Leadership Coach',      company: 'Ex-McKinsey',  rate: '$220/hr', rating: 4.8, reviews:  89, available: true,  color: '#a78bfa', specialty: 'Executive Leadership', tags: ['Stakeholder Mgmt', 'C-Suite', 'Influence'], bio: 'Former engagement manager at McKinsey. Specialises in helping senior ICs transition to management and build executive presence. Known for practical, no-nonsense frameworks.',                   avatar: 'https://randomuser.me/api/portraits/men/45.jpg' },
  { id: 'c3', name: 'Aisha Okonkwo',  role: 'Product Coach',         company: 'Ex-Stripe',    rate: '$160/hr', rating: 4.9, reviews: 203, available: false, color: '#34d399', specialty: 'Fintech PM',           tags: ['Discovery', 'User Research', 'Metrics'],   bio: 'Led product for Stripe\'s developer tooling from 0→1. Deep expertise in fintech compliance, API-first products, and building rigorous discovery practices. Currently on sabbatical — limited spots.', avatar: 'https://randomuser.me/api/portraits/women/25.jpg' },
  { id: 'c4', name: 'Ben Nakamura',   role: 'Agile Coach',           company: 'Ex-Spotify',   rate: '$150/hr', rating: 4.7, reviews:  67, available: true,  color: '#60a5fa', specialty: 'Delivery & Agile',    tags: ['Scrum', 'Sprint Planning', 'Team Health'], bio: 'Scaled agile practices across Spotify\'s growth tribe. Helps teams cut planning waste, build healthy rituals, and ship faster without burning out.',                                             avatar: 'https://randomuser.me/api/portraits/men/18.jpg' },
  { id: 'c5', name: 'Sofia Reyes',    role: 'UX Strategy Coach',     company: 'Ex-Figma',     rate: '$140/hr', rating: 4.8, reviews: 115, available: true,  color: '#fbbf24', specialty: 'UX Leadership',       tags: ['Design Systems', 'Research', 'Vision'],    bio: 'Built Figma\'s first design systems team. Helps PMs and designers work together effectively and translate user research into product direction.',                                              avatar: 'https://randomuser.me/api/portraits/women/38.jpg' },
  { id: 'c6', name: 'James Obi',      role: 'Data PM Coach',         company: 'Ex-Airbnb',    rate: '$170/hr', rating: 4.6, reviews:  54, available: false, color: '#fb923c', specialty: 'Data & Growth',       tags: ['A/B Testing', 'SQL', 'Growth Loops'],      bio: 'Growth PM at Airbnb for 4 years, focusing on supply-side conversion. Teaches data-literate PM thinking: from metric trees to experiment design to instrumentation.',                          avatar: 'https://randomuser.me/api/portraits/men/62.jpg' },
];

const WORKPLACES = [
  { id: 'w1', company: 'Dynamic AI',        industry: 'Technology',   type: 'Series B Startup', difficulty: 'Medium', rate: '$250/hr', roles: ['Senior PM', 'Head of Product'],       desc: 'A fast-growing AI tooling company building automation for enterprise workflows. Fast-paced, ambiguous, and technically demanding.', color: '#22d3ee', image: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&q=80&fit=crop&auto=format' },
  { id: 'w2', company: 'Founder Ventures',  industry: 'Consulting',   type: 'Boutique Firm',    difficulty: 'Hard',   rate: '$390/hr', roles: ['Strategy Consultant', 'Innovation Lead'], desc: 'A strategy consulting firm that works with Fortune 500 clients on transformation and growth. High stakes, client-facing, politically complex.', color: '#a78bfa', image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80&fit=crop&auto=format' },
  { id: 'w3', company: 'Alta Foods',        industry: 'FMCG',         type: 'Enterprise',       difficulty: 'Easy',   rate: '$150/hr', roles: ['Category PM', 'Brand Manager'],       desc: 'A consumer goods company launching products in competitive retail markets. Great for practising stakeholder alignment and long-horizon planning.', color: '#34d399', image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&q=80&fit=crop&auto=format' },
  { id: 'w4', company: 'NovaTech Systems',  industry: 'B2B SaaS',     type: 'Scale-up',         difficulty: 'Hard',   rate: '$280/hr', roles: ['Platform PM', 'VP Product'],          desc: 'A 300-person SaaS company selling to enterprise IT teams. Complex procurement cycles, multiple personas, and a sprawling legacy platform.', color: '#60a5fa', image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&q=80&fit=crop&auto=format' },
];

const SKILLS = [
  { id: 's1', name: 'Leadership & Influence',          level: 'Intermediate', price: '$40', modules: 5, moduleMinutes: 12, topics: ['Stakeholder Mapping', 'Influence without Authority', 'Building Coalitions', 'Navigating Conflict', 'Trust at Scale'],                           popular: true  },
  { id: 's2', name: 'Communication & Negotiation',     level: 'Beginner',     price: '$35', modules: 4, moduleMinutes: 10, topics: ['Executive Communication', 'Persuasive Writing', 'Negotiation Tactics', 'Active Listening'],                                                       popular: false },
  { id: 's3', name: 'Product Discovery & Research',    level: 'Advanced',     price: '$60', modules: 6, moduleMinutes: 14, topics: ['User Interview Techniques', 'Jobs to Be Done', 'Opportunity Sizing', 'Validation Frameworks', 'Synthesis & Insight', 'Communicating Findings'], popular: true  },
  { id: 's4', name: 'Roadmapping Under Constraints',   level: 'Intermediate', price: '$50', modules: 5, moduleMinutes: 11, topics: ['Prioritization Frameworks', 'Capacity & Trade-offs', 'Dependency Planning', 'Stakeholder Alignment', 'Roadmap Communication'],                  popular: false },
  { id: 's5', name: 'Data-Driven Product Management',  level: 'Advanced',     price: '$65', modules: 7, moduleMinutes: 13, topics: ['Metric Trees', 'Defining North Star', 'A/B Testing Basics', 'Funnel Analysis', 'Guardrail Metrics', 'Experiment Readout', 'Data Storytelling'], popular: true  },
  { id: 's6', name: 'Enterprise PM Fundamentals',      level: 'Beginner',     price: '$30', modules: 3, moduleMinutes: 10, topics: ['B2B Dynamics', 'Complex Stakeholders', 'Product Governance'],                                                                                    popular: false },
];

const CREDIT_PACKS = [
  { id: 'cp1', name: 'Starter',      credits: 5,  price: '$299', perSession: '$59.80',  highlight: false, perks: ['5 coaching sessions', 'Any coach', 'Email follow-up', '30-day expiry'] },
  { id: 'cp2', name: 'Professional', credits: 10, price: '$499', perSession: '$49.90',  highlight: true,  perks: ['10 coaching sessions', 'Priority booking', 'Session recordings', '90-day expiry'] },
  { id: 'cp3', name: 'Team',         credits: 25, price: '$999', perSession: '$39.96',  highlight: false, perks: ['25 coaching sessions', 'Team dashboard', 'Dedicated manager', '180-day expiry'] },
];

// ── Small shared components ────────────────────────────────────────────────
function Stars({ rating }: { rating: number }) {
  return (
    <span style={{ fontSize: 11, color: '#fbbf24', letterSpacing: 1 }}>
      {'★'.repeat(Math.floor(rating))}
      {rating % 1 >= 0.5 ? '½' : ''}
    </span>
  );
}

function Tag({ label }: { label: string }) {
  return (
    <span style={{
      fontSize: 10, fontWeight: 600, padding: '2px 8px', borderRadius: 4,
      background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.45)',
      border: '1px solid rgba(255,255,255,0.08)',
    }}>{label}</span>
  );
}

function DifficultyBadge({ level }: { level: string }) {
  const c = level === 'Easy' ? '#02ba67' : level === 'Medium' ? '#deaf49' : '#d44848';
  return (
    <span style={{
      fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 4,
      background: c, color: '#000000',
    }}>{level}</span>
  );
}

function LevelBadge({ level }: { level: string }) {
  const c = LEVEL_COLOR[level] ?? '#6b7280';
  return (
    <span style={{
      fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 4,
      background: c, color: '#000000',
    }}>{level}</span>
  );
}

function ActionBtn({
  label, onClick, variant = 'primary', small = false, disabled = false,
}: { label: string; onClick?: () => void; variant?: 'primary' | 'ghost' | 'success'; small?: boolean; disabled?: boolean }) {
  const bg: Record<string, string> = {
    primary: G,
    ghost:   'rgba(255,255,255,0.05)',
    success: 'rgba(34,197,94,0.12)',
  };
  const color: Record<string, string> = {
    primary: '#fff',
    ghost:   'rgba(255,255,255,0.6)',
    success: '#22c55e',
  };
  const border: Record<string, string> = {
    primary: 'transparent',
    ghost:   'rgba(255,255,255,0.10)',
    success: 'rgba(34,197,94,0.35)',
  };
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        padding: small ? '5px 14px' : '8px 18px',
        borderRadius: 8,
        fontSize: small ? 11.5 : 13,
        fontWeight: 600,
        cursor: disabled ? 'not-allowed' : 'pointer',
        background: bg[variant],
        color: color[variant],
        border: `1px solid ${border[variant]}`,
        opacity: disabled ? 0.5 : 1,
        transition: 'background 150ms, opacity 150ms',
        fontFamily: 'inherit',
      }}
    >{label}</button>
  );
}

// ── Detail panel ───────────────────────────────────────────────────────────
function DetailPanel({ item, type, onClose, onAction, actionState }: {
  item: AnyItem | null;
  type: string;
  onClose: () => void;
  onAction: (id: string) => void;
  actionState: Record<string, 'idle' | 'loading' | 'done'>;
}) {
  if (!item) return null;
  const state = actionState[item.id] ?? 'idle';

  return (
    <div style={{
      width: 320, flexShrink: 0,
      borderLeft: '1px solid rgba(255,255,255,0.07)',
      background: '#111114',
      display: 'flex', flexDirection: 'column',
      overflowY: 'auto',
      animation: 'slideInRight 200ms ease',
    }}>
      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '14px 18px',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        flexShrink: 0,
      }}>
        <span style={{ fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
          {type === 'coach' ? 'Coach Profile' : type === 'workplace' ? 'Workplace' : 'Skills Pack'}
        </span>
        <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.35)', fontSize: 16, lineHeight: 1, padding: '2px 4px' }}>✕</button>
      </div>

      <div style={{ padding: '20px 18px', display: 'flex', flexDirection: 'column', gap: 20 }}>

        {/* Coach detail */}
        {type === 'coach' && (() => {
          const c = item as typeof COACHES[0];
          return (
            <>
              {/* Avatar + name */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{
                  width: 52, height: 52, borderRadius: '50%', flexShrink: 0,
                  background: `${c.color}22`, border: `2px solid ${c.color}60`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 18, fontWeight: 700, color: c.color,
                }}>{c.name.split(' ').map(n => n[0]).join('')}</div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: '#f0f0f3' }}>{c.name}</div>
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)', marginTop: 2 }}>{c.role} · {c.company}</div>
                </div>
              </div>

              {/* Availability */}
              <div style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '10px 14px', borderRadius: 8,
                background: c.available ? G_BG(0.08) : 'rgba(255,255,255,0.04)',
                border: `1px solid ${c.available ? G_BG(0.25) : 'rgba(255,255,255,0.08)'}`,
              }}>
                <span style={{ width: 7, height: 7, borderRadius: '50%', background: c.available ? G : '#6b7280', flexShrink: 0 }} />
                <span style={{ fontSize: 12, color: c.available ? '#6ee7b7' : 'rgba(255,255,255,0.4)', fontWeight: 500 }}>
                  {c.available ? 'Available for new clients' : 'Currently fully booked'}
                </span>
              </div>

              {/* Stats row */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
                {[
                  { label: 'Rate', value: c.rate },
                  { label: 'Rating', value: `${c.rating}/5` },
                  { label: 'Reviews', value: `${c.reviews}` },
                ].map(s => (
                  <div key={s.label} style={{ padding: '10px 10px', borderRadius: 7, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', textAlign: 'center' }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#f0f0f3' }}>{s.value}</div>
                    <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)', marginTop: 2 }}>{s.label}</div>
                  </div>
                ))}
              </div>

              {/* Specialty */}
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 8 }}>Specialty</div>
                <div style={{ fontSize: 13, color: '#f0f0f3', fontWeight: 500 }}>{c.specialty}</div>
              </div>

              {/* Tags */}
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 8 }}>Focus Areas</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {c.tags.map(t => <Tag key={t} label={t} />)}
                </div>
              </div>

              {/* Bio */}
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 8 }}>About</div>
                <p style={{ fontSize: 12.5, color: 'rgba(255,255,255,0.55)', lineHeight: 1.65, margin: 0 }}>{c.bio}</p>
              </div>

              {/* Action */}
              <div style={{ display: 'flex', gap: 8 }}>
                {state === 'done' ? (
                  <ActionBtn label="✓ Session Booked" variant="success" />
                ) : (
                  <ActionBtn
                    label={state === 'loading' ? 'Booking…' : 'Book a Session'}
                    onClick={() => onAction(c.id)}
                    disabled={!c.available || state === 'loading'}
                  />
                )}
                <ActionBtn label="Message" variant="ghost" small />
              </div>
            </>
          );
        })()}

        {/* Workplace detail */}
        {type === 'workplace' && (() => {
          const w = item as typeof WORKPLACES[0];
          return (
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{
                  width: 48, height: 48, borderRadius: 12, flexShrink: 0,
                  background: `${w.color}22`, border: `1px solid ${w.color}40`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 18, fontWeight: 800, color: w.color,
                }}>{w.company[0]}</div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: '#f0f0f3' }}>{w.company}</div>
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)', marginTop: 2 }}>{w.industry} · {w.type}</div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                <div style={{ padding: '10px', borderRadius: 7, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
                  <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 5 }}>Sim Rate</div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#f0f0f3' }}>{w.rate}</div>
                </div>
                <div style={{ padding: '10px', borderRadius: 7, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
                  <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 5 }}>Difficulty</div>
                  <DifficultyBadge level={w.difficulty} />
                </div>
              </div>

              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 8 }}>About</div>
                <p style={{ fontSize: 12.5, color: 'rgba(255,255,255,0.55)', lineHeight: 1.65, margin: 0 }}>{w.desc}</p>
              </div>

              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 8 }}>Available Roles</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {w.roles.map(r => (
                    <div key={r} style={{
                      display: 'flex', alignItems: 'center', gap: 8,
                      padding: '8px 12px', borderRadius: 7,
                      background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)',
                    }}>
                      <span style={{ width: 6, height: 6, borderRadius: '50%', background: w.color, flexShrink: 0 }} />
                      <span style={{ fontSize: 12.5, color: 'rgba(255,255,255,0.7)', fontWeight: 500 }}>{r}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', gap: 8 }}>
                {state === 'done' ? (
                  <ActionBtn label="✓ Unlocked" variant="success" />
                ) : (
                  <ActionBtn
                    label={state === 'loading' ? 'Unlocking…' : 'Unlock Workplace'}
                    onClick={() => onAction(w.id)}
                    disabled={state === 'loading'}
                  />
                )}
              </div>
            </>
          );
        })()}

        {/* Skills detail */}
        {type === 'skill' && (() => {
          const s = item as typeof SKILLS[0];
          return (
            <>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                  <LevelBadge level={s.level} />
                  <span style={{ fontSize: 9.5, fontWeight: 700, padding: '2px 7px', borderRadius: 4, background: '#bb76d6', color: '#000000', letterSpacing: '0.04em' }}>MINI SESSION</span>
                  {s.popular && (
                    <span style={{ fontSize: 10, fontWeight: 700, color: '#000000', background: '#02ba67', padding: '2px 8px', borderRadius: 4 }}>Popular</span>
                  )}
                </div>
                <div style={{ fontSize: 16, fontWeight: 700, color: '#f0f0f3', lineHeight: 1.35 }}>{s.name}</div>
              </div>

              {/* Mini-session info banner */}
              <div style={{ padding: '10px 12px', borderRadius: 8, background: 'rgba(167,139,250,0.07)', border: '1px solid rgba(167,139,250,0.18)' }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: '#a78bfa', marginBottom: 3 }}>Mini Sessions · {s.moduleMinutes} min per module</div>
                <div style={{ fontSize: 11.5, color: 'rgba(255,255,255,0.45)', lineHeight: 1.5 }}>
                  Each module is a focused {s.moduleMinutes}-minute simulation. Complete all {s.modules} modules to master this skill (~{s.modules * s.moduleMinutes} min total).
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
                {[
                  { label: 'Price', value: s.price },
                  { label: 'Modules', value: `${s.modules}` },
                  { label: 'Per Module', value: `${s.moduleMinutes} min` },
                ].map(stat => (
                  <div key={stat.label} style={{ padding: '10px', borderRadius: 7, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', textAlign: 'center' }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#f0f0f3' }}>{stat.value}</div>
                    <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)', marginTop: 2 }}>{stat.label}</div>
                  </div>
                ))}
              </div>

              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 8 }}>Topics Covered</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                  {s.topics.map((t, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12.5, color: 'rgba(255,255,255,0.65)' }}>
                      <span style={{ width: 4, height: 4, borderRadius: '50%', background: G, flexShrink: 0 }} />
                      {t}
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', gap: 8 }}>
                {state === 'done' ? (
                  <ActionBtn label="✓ Enrolled" variant="success" />
                ) : (
                  <ActionBtn
                    label={state === 'loading' ? 'Enrolling…' : `Enroll · ${s.price}`}
                    onClick={() => onAction(s.id)}
                    disabled={state === 'loading'}
                  />
                )}
              </div>
            </>
          );
        })()}
      </div>
    </div>
  );
}

// ── Views ──────────────────────────────────────────────────────────────────

function HomeView({ onNav, onSelect }: { onNav: (id: string) => void; onSelect: (item: AnyItem, type: string) => void }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
      {/* Hero */}
      <div style={{
        borderRadius: 12, overflow: 'hidden',
        background: 'linear-gradient(135deg, rgba(20,123,88,0.18) 0%, rgba(20,123,88,0.06) 60%, transparent 100%)',
        border: `1px solid ${G_BG(0.22)}`,
        padding: '24px 28px',
        position: 'relative',
      }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: G, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>
          Discovery
        </div>
        <div style={{ fontSize: 20, fontWeight: 700, color: '#f0f0f3', lineHeight: 1.3, marginBottom: 6 }}>
          Level up your career
        </div>
        <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', margin: '0 0 18px', maxWidth: 420, lineHeight: 1.6 }}>
          Book coaching sessions, unlock simulation workplaces, and enrol in skills packs — all in one place.
        </p>
        <ActionBtn label="Browse Coaches →" onClick={() => onNav('coaches')} />
      </div>

      {/* Top Coaches */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.9)' }}>Top Coaches</span>
          <button onClick={() => onNav('coaches')} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 12, color: G, fontFamily: 'inherit', fontWeight: 500 }}>See all →</button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
          {COACHES.slice(0, 3).map(c => (
            <div key={c.id} style={{ ...cardStyle, padding: '14px', cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: 10 }}
              onClick={() => onSelect(c, 'coach')}
              onMouseEnter={e => cardHoverIn(e.currentTarget)}
              onMouseLeave={e => cardHoverOut(e.currentTarget)}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={(c as any).avatar} alt={c.name} style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover', flexShrink: 0, border: `1.5px solid ${c.color}55` }} />
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 12.5, fontWeight: 600, color: '#f0f0f3', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.name}</div>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>{c.company}</div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Stars rating={c.rating} />
                <span style={{ fontSize: 11.5, color: 'rgba(255,255,255,0.55)', fontWeight: 500 }}>{c.rate}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: c.available ? G : '#6b7280' }} />
                <span style={{ fontSize: 10.5, color: c.available ? '#6ee7b7' : 'rgba(255,255,255,0.35)' }}>{c.available ? 'Available' : 'Fully booked'}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Featured Workplace */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.9)' }}>Featured Workplaces</span>
          <button onClick={() => onNav('workplaces')} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 12, color: G, fontFamily: 'inherit', fontWeight: 500 }}>See all →</button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
          {WORKPLACES.slice(0, 3).map(w => (
            <WorkplaceCard key={w.id} w={w} onSelect={onSelect} compact />
          ))}
        </div>
      </div>

      {/* Popular Skills */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.9)' }}>Popular Skills Packs</span>
          <button onClick={() => onNav('skills')} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 12, color: G, fontFamily: 'inherit', fontWeight: 500 }}>See all →</button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {SKILLS.filter(s => s.popular).map(s => (
            <div key={s.id} style={{ ...cardStyle, padding: '12px 14px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 14 }}
              onClick={() => onSelect(s, 'skill')}
              onMouseEnter={e => cardHoverIn(e.currentTarget)}
              onMouseLeave={e => cardHoverOut(e.currentTarget)}
            >
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 12.5, fontWeight: 500, color: '#f0f0f3', marginBottom: 3 }}>{s.name}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <LevelBadge level={s.level} />
                  <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)' }}>{s.modules} modules · {s.moduleMinutes} min each</span>
                </div>
              </div>
              <span style={{ fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.7)', flexShrink: 0 }}>{s.price}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function CoachesView({ search, onSelect }: { search: string; onSelect: (item: AnyItem, type: string) => void }) {
  const filtered = useMemo(() => COACHES.filter(c =>
    !search || c.name.toLowerCase().includes(search.toLowerCase()) || c.specialty.toLowerCase().includes(search.toLowerCase()) || c.tags.some(t => t.toLowerCase().includes(search.toLowerCase()))
  ), [search]);

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
        {filtered.map(c => (
          <div key={c.id}
            style={{ ...cardStyle, padding: '16px', cursor: 'pointer' }}
            onClick={() => onSelect(c, 'coach')}
            onMouseEnter={e => cardHoverIn(e.currentTarget)}
            onMouseLeave={e => cardHoverOut(e.currentTarget)}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 12 }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={(c as any).avatar} alt={c.name} style={{ width: 44, height: 44, borderRadius: '50%', objectFit: 'cover', flexShrink: 0, border: `2px solid ${c.color}55` }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#f0f0f3' }}>{c.name}</div>
                <div style={{ fontSize: 11.5, color: 'rgba(255,255,255,0.45)', marginTop: 1 }}>{c.role}</div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)' }}>{c.company}</div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <Stars rating={c.rating} />
                <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)' }}>({c.reviews})</span>
              </div>
              <span style={{ fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.65)' }}>{c.rate}</span>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginBottom: 12 }}>
              {c.tags.map(t => <Tag key={t} label={t} />)}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: c.available ? G : '#6b7280' }} />
              <span style={{ fontSize: 11, color: c.available ? '#6ee7b7' : 'rgba(255,255,255,0.35)', fontWeight: 500 }}>
                {c.available ? 'Available' : 'Fully booked'}
              </span>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div style={{ gridColumn: '1/-1', padding: '32px', textAlign: 'center', color: 'rgba(255,255,255,0.3)', fontSize: 13 }}>
            No coaches match "{search}"
          </div>
        )}
      </div>
    </div>
  );
}

function CreditsView({ purchased, onPurchase }: { purchased: Set<string>; onPurchase: (id: string) => void }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Balance */}
      <div style={{
        padding: '16px 20px', borderRadius: 10,
        background: G_BG(0.08), border: `1px solid ${G_BG(0.22)}`,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, color: G, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 4 }}>Current Balance</div>
          <div style={{ fontSize: 24, fontWeight: 700, color: '#f0f0f3' }}>
            {[...purchased].reduce((sum, id) => {
              const pack = CREDIT_PACKS.find(p => p.id === id);
              return sum + (pack?.credits ?? 0);
            }, 0)} <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.45)', fontWeight: 400 }}>sessions</span>
          </div>
        </div>
        <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)' }}>
          {[...purchased].length} pack{[...purchased].length !== 1 ? 's' : ''} purchased
        </div>
      </div>

      {/* Packs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
        {CREDIT_PACKS.map(pack => (
          <div key={pack.id} style={{
            borderRadius: 10,
            border: `1px solid ${pack.highlight ? G_BG(0.35) : 'rgba(255,255,255,0.07)'}`,
            background: pack.highlight ? G_BG(0.06) : '#18181c',
            padding: '20px 18px',
            display: 'flex', flexDirection: 'column', gap: 14,
            position: 'relative', overflow: 'hidden',
          }}>
            {pack.highlight && (
              <div style={{
                position: 'absolute', top: 0, right: 0,
                background: G, color: '#fff',
                fontSize: 9.5, fontWeight: 700, padding: '3px 10px',
                borderBottomLeftRadius: 7,
                letterSpacing: '0.05em',
              }}>BEST VALUE</div>
            )}
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: pack.highlight ? G : 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>{pack.name}</div>
              <div style={{ fontSize: 28, fontWeight: 800, color: '#f0f0f3' }}>{pack.price}</div>
              <div style={{ fontSize: 11.5, color: 'rgba(255,255,255,0.35)', marginTop: 3 }}>{pack.perSession} per session</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {pack.perks.map(p => (
                <div key={p} style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 12, color: 'rgba(255,255,255,0.55)' }}>
                  <span style={{ color: G, fontSize: 11 }}>✓</span> {p}
                </div>
              ))}
            </div>
            {purchased.has(pack.id) ? (
              <ActionBtn label={`✓ ${pack.credits} sessions added`} variant="success" />
            ) : (
              <ActionBtn label={`Buy ${pack.name}`} onClick={() => onPurchase(pack.id)} variant={pack.highlight ? 'primary' : 'ghost'} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function WorkplaceCard({ w, onSelect, compact = false }: { w: typeof WORKPLACES[0]; onSelect: (item: AnyItem, type: string) => void; compact?: boolean }) {
  return (
    <div
      style={{
        ...cardStyle,
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        aspectRatio: '5/8',
        overflow: 'hidden',
        padding: 0,
        borderRadius: 14,
      }}
      onClick={() => onSelect(w, 'workplace')}
      onMouseEnter={e => cardHoverIn(e.currentTarget)}
      onMouseLeave={e => cardHoverOut(e.currentTarget)}
    >
      {/* Square image */}
      <div style={{ width: '100%', aspectRatio: '1/1', flexShrink: 0, position: 'relative', overflow: 'hidden' }}>
        <img
          src={w.image}
          alt={w.company}
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
        />
        {/* Gradient overlay for legibility on image edges */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: '40%',
          background: 'linear-gradient(to top, rgba(10,10,14,0.72) 0%, transparent 100%)',
          pointerEvents: 'none',
        }} />
        {/* Difficulty badge on image */}
        <div style={{ position: 'absolute', top: 10, left: 10 }}>
          <DifficultyBadge level={w.difficulty} />
        </div>
      </div>

      {/* Details */}
      <div style={{
        flex: 1, padding: compact ? '10px 12px' : '12px 14px',
        display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
        minHeight: 0,
      }}>
        <div>
          <div style={{ fontSize: compact ? 12 : 13, fontWeight: 700, color: '#f0f0f3', marginBottom: 2, lineHeight: 1.3 }}>{w.company}</div>
          <div style={{ fontSize: 10.5, color: 'rgba(255,255,255,0.4)', marginBottom: compact ? 0 : 6 }}>{w.industry} · {w.type}</div>
          {!compact && (
            <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.42)', lineHeight: 1.5, margin: 0, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' as const }}>{w.desc}</p>
          )}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 8, gap: 4 }}>
          <span style={{ fontSize: compact ? 11 : 11.5, fontWeight: 600, color: w.color }}>{w.rate}</span>
          <span style={{ fontSize: 10.5, color: 'rgba(255,255,255,0.3)' }}>{w.roles.length} roles</span>
        </div>
      </div>
    </div>
  );
}

function WorkplacesView({ search, onSelect }: { search: string; onSelect: (item: AnyItem, type: string) => void }) {
  const filtered = useMemo(() => WORKPLACES.filter(w =>
    !search || w.company.toLowerCase().includes(search.toLowerCase()) || w.industry.toLowerCase().includes(search.toLowerCase())
  ), [search]);

  return (
    <div>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: 14,
        maxWidth: 820,
      }}>
        {filtered.map(w => (
          <WorkplaceCard key={w.id} w={w} onSelect={onSelect} />
        ))}
      </div>
      {filtered.length === 0 && (
        <div style={{ padding: '32px', textAlign: 'center', color: 'rgba(255,255,255,0.3)', fontSize: 13 }}>
          No workplaces match &ldquo;{search}&rdquo;
        </div>
      )}
    </div>
  );
}

function SkillsView({ search, onSelect, enrolled }: { search: string; onSelect: (item: AnyItem, type: string) => void; enrolled: Set<string> }) {
  const filtered = useMemo(() => SKILLS.filter(s =>
    !search || s.name.toLowerCase().includes(search.toLowerCase()) || s.topics.some(t => t.toLowerCase().includes(search.toLowerCase()))
  ), [search]);

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
      {filtered.map(s => (
        <div key={s.id}
          style={{ ...cardStyle, padding: '16px', cursor: 'pointer', overflow: 'hidden', position: 'relative' }}
          onClick={() => onSelect(s, 'skill')}
          onMouseEnter={e => cardHoverIn(e.currentTarget)}
          onMouseLeave={e => cardHoverOut(e.currentTarget)}
        >
          {s.popular && (
            <div style={{
              position: 'absolute', top: 0, right: 0,
              background: G_BG(0.15), color: G,
              fontSize: 9.5, fontWeight: 700, padding: '3px 10px',
              borderBottomLeftRadius: 6, letterSpacing: '0.05em',
            }}>POPULAR</div>
          )}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
            <LevelBadge level={s.level} />
            <span style={{ fontSize: 9.5, fontWeight: 700, padding: '2px 7px', borderRadius: 4, background: '#bb76d6', color: '#000000', letterSpacing: '0.04em' }}>MINI SESSION</span>
          </div>
          <div style={{ fontSize: 13, fontWeight: 600, color: '#f0f0f3', lineHeight: 1.35, marginBottom: 8 }}>{s.name}</div>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', marginBottom: 12 }}>{s.modules} modules · {s.moduleMinutes} min each · ~{s.modules * s.moduleMinutes} min total</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 14 }}>
            {s.topics.slice(0, 2).map(t => <Tag key={t} label={t} />)}
            {s.topics.length > 2 && <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', alignSelf: 'center' }}>+{s.topics.length - 2} more</span>}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 14, fontWeight: 700, color: '#f0f0f3' }}>{s.price}</span>
            {enrolled.has(s.id) ? (
              <span style={{ fontSize: 11.5, color: '#22c55e', fontWeight: 600 }}>✓ Enrolled</span>
            ) : (
              <span style={{ fontSize: 11.5, color: G, fontWeight: 500 }}>Enroll →</span>
            )}
          </div>
        </div>
      ))}
      {filtered.length === 0 && (
        <div style={{ gridColumn: '1/-1', padding: '32px', textAlign: 'center', color: 'rgba(255,255,255,0.3)', fontSize: 13 }}>
          No skills packs match "{search}"
        </div>
      )}
    </div>
  );
}

// ── Main screen ────────────────────────────────────────────────────────────
export function DiscoveryScreen() {
  const [activeNav, setActiveNav] = useState('home');
  const [search, setSearch] = useState('');
  const [selectedItem, setSelectedItem] = useState<{ item: AnyItem; type: string } | null>(null);
  const [actionState, setActionState] = useState<Record<string, 'idle' | 'loading' | 'done'>>({});
  const [purchasedCredits, setPurchasedCredits] = useState<Set<string>>(new Set());

  function handleNav(id: string) {
    setActiveNav(id);
    setSearch('');
    setSelectedItem(null);
  }

  function handleSelect(item: AnyItem, type: string) {
    setSelectedItem({ item, type });
  }

  function handleAction(id: string) {
    setActionState(s => ({ ...s, [id]: 'loading' }));
    setTimeout(() => {
      setActionState(s => ({ ...s, [id]: 'done' }));
      if (CREDIT_PACKS.some(p => p.id === id)) {
        setPurchasedCredits(prev => new Set([...prev, id]));
      }
    }, 1200);
  }

  const VIEW_TITLE: Record<string, string> = {
    home: 'Discovery', coaches: 'Coaches', credits: 'Credits',
    workplaces: 'Workplaces', skills: 'Skills Packs',
  };

  return (
    <>
      <style>{`@keyframes slideInRight { from { opacity: 0; transform: translateX(16px); } to { opacity: 1; transform: translateX(0); } }`}</style>
      <AppWindow
        screenKey="discovery"
        url="discovery.nebula.io"
        urlAccent="rgba(74,222,128,0.5)"
        label="Discovery"
        accentColor="#4ade80"
        maxWidth={1140}
      >
        <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
          {/* Sidebar */}
          <Sidebar items={DISCOVERY_NAV} activeId={activeNav} onSelect={handleNav} />

          {/* Main content */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '22px 28px 32px' }}>
            {/* Section title + optional search */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 22 }}>
              <h1 style={{ fontSize: 14, fontWeight: 600, color: 'rgba(255,255,255,0.9)', margin: 0 }}>
                {VIEW_TITLE[activeNav]}
              </h1>
              {['coaches', 'workplaces', 'skills'].includes(activeNav) && (
                <input
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder={`Search ${VIEW_TITLE[activeNav].toLowerCase()}…`}
                  style={{
                    height: 28, width: 200, background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.09)', borderRadius: 7,
                    padding: '0 10px', fontSize: 12, color: '#f0f0f3',
                    outline: 'none', fontFamily: 'inherit',
                  }}
                  onFocus={e => { e.target.style.borderColor = 'rgba(20,123,88,0.45)'; }}
                  onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.09)'; }}
                />
              )}
            </div>

            {activeNav === 'home'       && <HomeView onNav={handleNav} onSelect={handleSelect} />}
            {activeNav === 'coaches'    && <CoachesView search={search} onSelect={handleSelect} />}
            {activeNav === 'credits'    && <CreditsView purchased={purchasedCredits} onPurchase={handleAction} />}
            {activeNav === 'workplaces' && <WorkplacesView search={search} onSelect={handleSelect} />}
            {activeNav === 'skills'     && <SkillsView search={search} onSelect={handleSelect} enrolled={new Set(Object.entries(actionState).filter(([_k, v]) => v === 'done').map(([k]) => k))} />}
          </div>

          {/* Detail panel */}
          {selectedItem && (
            <DetailPanel
              item={selectedItem.item}
              type={selectedItem.type}
              onClose={() => setSelectedItem(null)}
              onAction={handleAction}
              actionState={actionState}
            />
          )}
        </div>
      </AppWindow>
    </>
  );
}
