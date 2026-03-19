"use client";
import { useState } from "react";
import { useAppStore } from "@/lib/store";
import { Avatar } from "@/components/ui/avatar";
import { CHARACTERS } from "@/lib/data";

const T = {
  bg:       '#121212',
  surface:  '#212121',
  surface2: '#2e2c2e',
  text:     '#efefef',
  muted:    '#afa39f',
  border:   'rgba(255,255,255,0.04)',
  border2:  'rgba(255,255,255,0.08)',
  primary:  '#147b58',
  shadow1:  '0 1px 2px rgba(0,0,0,0.6)',
  shadow2:  '0 6px 18px rgba(0,0,0,0.7)',
} as const;

/* ── Extended profile data for the onboarding "Meet the team" step ─────────── */
const CHAR_PROFILES: Record<string, {
  about: string;
  relationship: string;
  focus: string;
  approach: string;
  tags: string[];
}> = {
  sarah: {
    about:
      'Sarah has been at Nexus since Series A and holds more institutional knowledge than anyone else in the building. She was bypassed by Elena this week and is carefully deciding whether to trust you.',
    relationship:
      'Technically a peer, but she owns the product process you\'ll need sign-off from. She knows every stakeholder and every political landmine — treat her as a partner and she becomes your strongest ally.',
    focus:
      'Ensuring Product has sign-off before anything reaches the board. She cannot be surprised on Monday — this is a professional credibility issue, not just process preference.',
    approach:
      'Bring her in early. Never let her hear something through Elena first. Ask for her read before you form your own position.',
    tags: ['Ally potential', 'Process gate', 'Institutional memory'],
  },
  marcus: {
    about:
      'Marcus lost his best engineer three weeks ago and is holding the team together through sheer will. He quotes "six weeks" because of a security review process — not his own estimate — a distinction he hasn\'t volunteered yet.',
    relationship:
      'You need Engineering\'s commitment to make any plan credible. Marcus will give you an honest answer if you ask the right question — but he won\'t volunteer information he wasn\'t asked for.',
    focus:
      'Protecting his team from scope creep. Engineering is at 94% capacity — one more unplanned item tips into quality failures. He needs to be in the room before any commitment is made.',
    approach:
      'Ask open questions. Don\'t pressure him on timeline — explore constraints instead. Ask him specifically whether he\'s looked at third-party alternatives.',
    tags: ['Critical dependency', 'Capacity constrained', 'Key information holder'],
  },
  priya: {
    about:
      'Priya has been burned twice by sharing research that got deprioritised without explanation, so she no longer volunteers findings proactively. The data she\'s sitting on is the most strategically relevant information in this scenario.',
    relationship:
      'She leads Design and has a scoped, lightweight fix for the NPS drop ready to go. She will share everything if asked directly and treated as a decision-making peer rather than a supporting function.',
    focus:
      'Preventing the onboarding improvement from being cut for the fourth consecutive quarter. She wants to surface the connection between UX debt and commercial churn before the board meeting locks in scope.',
    approach:
      'Ask her directly what the data shows. Don\'t position her as a resource — position her as a co-author of the solution. She responds to being included, not consulted.',
    tags: ['Research holder', 'Under-utilised', 'High-trust potential'],
  },
  tom: {
    about:
      'Tom is high-energy and genuinely worried about the Acme deal. He\'s characterising the situation as worse than it is — partly anxiety, partly hoping urgency forces a faster decision. The actual email chain is more carefully scoped than his verbal framing suggests.',
    relationship:
      'He brings external commercial pressure that is real, even if slightly overstated. He also has intelligence about a second enterprise prospect with identical SSO requirements that he hasn\'t shared yet.',
    focus:
      'Protecting the Acme deal and giving his team a credible story before the next procurement call. A concrete date or a private beta offer both work — he can\'t go back with ambiguity.',
    approach:
      'Ask him to forward the actual Acme email chain. Don\'t just accept his verbal summary. Be specific about what you need from him and he\'ll deliver it.',
    tags: ['Commercial pressure', 'Hidden intelligence', 'Needs a concrete ask'],
  },
  elena: {
    about:
      'Elena is board-aware and fast-moving. She operates on the assumption that context flows correctly through the organisation without checking. She has a critical piece of information she hasn\'t shared — not because she\'s hiding it, but because she genuinely believes everyone already knows.',
    relationship:
      'She\'s your CEO and the person who promoted you. She bypassed Sarah out of urgency, not politics, and will correct for it if it\'s raised explicitly. She wants one credible, unified plan by Monday.',
    focus:
      'Walking into the board meeting with a single Q3 narrative. The Series C lead investor will be in the room and has been asking about SSO progress since the term sheet was signed.',
    approach:
      'Never bring her options without a recommendation. Frame trade-offs with a clear point of view. Raise the Sarah situation directly — she\'ll appreciate it.',
    tags: ['Decision authority', 'Information gap', 'Needs a recommendation'],
  },
};

const SCENES = [
  {
    type: 'intro' as const,
    title: "Welcome to Nexus Technologies",
    body: "You've just been promoted to Product Manager at Nexus Technologies — a 300-person B2B SaaS company that's closed a $20M Series C. The pressure is on to deliver a major platform refresh in Q3.",
    cta: "Read the brief →",
  },
  {
    type: 'context' as const,
    title: "The Situation",
    body: "You've inherited a contested roadmap. Engineering says the timeline is unrealistic. Sales has promised a flagship client three features not on the current plan. Design is warning about UX shortcuts. The CEO wants a unified strategy by end of sprint.\n\nThis is your first week.",
    cta: "Meet the team →",
  },
  {
    type: 'team' as const,
    title: "Your Colleagues",
    body: "",
    cta: "Learn the interface →",
  },
  {
    type: 'tutorial' as const,
    title: "How it works",
    body: "The simulation runs across 3 sessions. Each session has OKRs you need to advance, AI colleagues who respond to your choices, and chaos events that force real-time decisions.\n\nYour decisions persist. How you treat Marcus in Session 1 shapes how much he helps you in Session 3.",
    cta: "Begin assessment →",
  },
];

/* ── Chevron icon ───────────────────────────────────────────────────────────── */
function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      width="14" height="14" viewBox="0 0 14 14" fill="none"
      style={{ transition: 'transform 0.25s ease', transform: open ? 'rotate(180deg)' : 'rotate(0deg)', flexShrink: 0 }}
    >
      <path d="M3 5l4 4 4-4" stroke="rgba(175,163,159,0.5)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ── Section label used inside expanded profile ─────────────────────────────── */
function ProfileLabel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      fontSize: 9.5, fontWeight: 700, letterSpacing: '0.08em',
      textTransform: 'uppercase', color: 'rgba(175,163,159,0.5)',
      marginBottom: 5,
    }}>
      {children}
    </div>
  );
}

/* ── Expanded profile panel ─────────────────────────────────────────────────── */
function CharProfile({ char }: { char: typeof CHARACTERS[number] }) {
  const p = CHAR_PROFILES[char.id];
  if (!p) return null;

  const trustPct = Math.round(char.trust * 100);
  const trustColor = char.trust >= 0.7 ? '#22c55e' : char.trust >= 0.5 ? '#f59e0b' : '#ef4444';
  const emotionLabels: Record<string, string> = {
    neutral: 'Neutral',
    cooperative: 'Cooperative',
    frustrated: 'Frustrated',
    disengaged: 'Disengaged',
    alarmed: 'Alarmed',
  };
  const emotionColors: Record<string, string> = {
    neutral: 'rgba(255,255,255,0.35)',
    cooperative: '#22c55e',
    frustrated: '#ef4444',
    disengaged: '#6b7280',
    alarmed: '#f59e0b',
  };
  const emoColor = emotionColors[char.emotion] ?? 'rgba(255,255,255,0.35)';

  return (
    <div style={{
      borderTop: `1px solid rgba(255,255,255,0.06)`,
      paddingTop: 16,
      display: 'flex',
      flexDirection: 'column',
      gap: 16,
      animation: 'fadeSlideIn 0.22s ease',
    }}>

      {/* Status strip */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
        {/* Online status */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <div style={{
            width: 7, height: 7, borderRadius: '50%',
            background: char.online ? '#22c55e' : '#6b7280',
            boxShadow: char.online ? '0 0 6px rgba(34,197,94,0.6)' : 'none',
          }} />
          <span style={{ fontSize: 11, color: T.muted }}>{char.online ? 'Online' : 'Offline'}</span>
        </div>

        {/* Emotion */}
        <div style={{
          fontSize: 10.5, fontWeight: 600, color: emoColor,
          background: `${emoColor}18`, border: `1px solid ${emoColor}30`,
          borderRadius: 5, padding: '2px 8px',
        }}>
          {emotionLabels[char.emotion] ?? char.emotion}
        </div>

        {/* Trust bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginLeft: 'auto' }}>
          <span style={{ fontSize: 10.5, color: T.muted, whiteSpace: 'nowrap' }}>Initial trust</span>
          <div style={{ width: 64, height: 4, background: 'rgba(255,255,255,0.07)', borderRadius: 2, overflow: 'hidden' }}>
            <div style={{ width: `${trustPct}%`, height: '100%', background: trustColor, borderRadius: 2 }} />
          </div>
          <span style={{ fontSize: 10.5, fontWeight: 700, color: trustColor, minWidth: 28 }}>{trustPct}%</span>
        </div>
      </div>

      {/* Tags */}
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        {p.tags.map(tag => (
          <span key={tag} style={{
            fontSize: 10.5, fontWeight: 600, padding: '3px 9px', borderRadius: 5,
            background: `${char.color}14`, color: char.color,
            border: `1px solid ${char.color}28`,
          }}>
            {tag}
          </span>
        ))}
      </div>

      {/* Two-column grid for the four sections */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>

        <div style={{
          background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)',
          borderRadius: 9, padding: '11px 13px',
        }}>
          <ProfileLabel>About</ProfileLabel>
          <p style={{ fontSize: 12.5, color: T.muted, lineHeight: 1.65, margin: 0 }}>{p.about}</p>
        </div>

        <div style={{
          background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)',
          borderRadius: 9, padding: '11px 13px',
        }}>
          <ProfileLabel>Working relationship</ProfileLabel>
          <p style={{ fontSize: 12.5, color: T.muted, lineHeight: 1.65, margin: 0 }}>{p.relationship}</p>
        </div>

        <div style={{
          background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)',
          borderRadius: 9, padding: '11px 13px',
        }}>
          <ProfileLabel>What they're focused on</ProfileLabel>
          <p style={{ fontSize: 12.5, color: T.muted, lineHeight: 1.65, margin: 0 }}>{p.focus}</p>
        </div>

        <div style={{
          background: `${char.color}0a`, border: `1px solid ${char.color}22`,
          borderRadius: 9, padding: '11px 13px',
        }}>
          <ProfileLabel>How to approach them</ProfileLabel>
          <p style={{ fontSize: 12.5, color: T.text, lineHeight: 1.65, margin: 0 }}>{p.approach}</p>
        </div>

      </div>
    </div>
  );
}

/* ── Main component ─────────────────────────────────────────────────────────── */
export function OnboardingScreen() {
  const { setScreen, setOnboardingStep, onboardingStep } = useAppStore();
  const [visible, setVisible] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const advance = () => {
    if (onboardingStep < SCENES.length - 1) {
      setVisible(false);
      setTimeout(() => { setOnboardingStep(onboardingStep + 1); setVisible(true); }, 200);
    } else {
      setScreen('assessment');
    }
  };

  const toggleExpand = (id: string) =>
    setExpandedId(prev => (prev === id ? null : id));

  const scene = SCENES[onboardingStep];

  return (
    <div style={{
      background: T.bg,
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Subtle ambient glow */}
      <div style={{
        position: 'absolute',
        top: '30%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 600,
        height: 600,
        borderRadius: '50%',
        background: `radial-gradient(circle, rgba(20,123,88,0.06) 0%, transparent 70%)`,
        pointerEvents: 'none',
      }} />

      {/* Fade-in keyframe */}
      <style>{`
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(-6px); }
          to   { opacity: 1; transform: translateY(0);    }
        }
      `}</style>

      {/* Progress dots */}
      <div style={{
        position: 'relative',
        zIndex: 10,
        display: 'flex',
        justifyContent: 'center',
        gap: 6,
        paddingTop: 40,
      }}>
        {SCENES.map((_, i) => (
          <div key={i} style={{
            height: 4,
            width: i === onboardingStep ? 24 : 8,
            borderRadius: 99,
            background: i === onboardingStep ? T.primary : i < onboardingStep ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.1)',
            transition: 'all 0.25s ease',
          }} />
        ))}
      </div>

      {/* Main content */}
      <div style={{
        position: 'relative',
        zIndex: 10,
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: scene.type === 'team' ? 'flex-start' : 'center',
        padding: scene.type === 'team' ? '32px 24px 48px' : '48px 24px',
        opacity: visible ? 1 : 0,
        transition: 'opacity 0.2s ease',
      }}>
        {/* Width is wider on team step to give expanded cards room */}
        <div style={{ width: '100%', maxWidth: scene.type === 'team' ? 640 : 520 }}>

          {/* Icon */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 28 }}>
            <div style={{
              width: 56,
              height: 56,
              borderRadius: 16,
              background: T.surface,
              border: `1px solid ${T.border2}`,
              boxShadow: T.shadow1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 24,
            }}>
              {scene.type === 'team' ? '👥' : '⚡'}
            </div>
          </div>

          {/* Title */}
          <h1 style={{
            fontSize: 28,
            fontWeight: 600,
            color: T.text,
            textAlign: 'center',
            marginBottom: scene.type === 'team' ? 6 : 20,
            letterSpacing: '-0.02em',
            lineHeight: 1.25,
          }}>
            {scene.title}
          </h1>

          {/* Team step subtitle */}
          {scene.type === 'team' && (
            <p style={{
              textAlign: 'center', fontSize: 14, color: T.muted,
              marginBottom: 28, lineHeight: 1.6,
            }}>
              Click any card to learn who they are and how to work with them.
            </p>
          )}

          {/* Body or Team list */}
          {scene.type !== 'team' ? (
            <p style={{
              color: T.muted,
              textAlign: 'center',
              lineHeight: 1.75,
              fontSize: 15,
              whiteSpace: 'pre-line',
              marginBottom: 44,
              maxWidth: 460,
              margin: '0 auto 44px',
            }}>
              {scene.body}
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 32 }}>
              {CHARACTERS.map(char => {
                const isOpen = expandedId === char.id;
                return (
                  <div
                    key={char.id}
                    style={{
                      background: isOpen ? `${char.color}08` : T.surface,
                      border: `1px solid ${isOpen ? char.color + '30' : T.border}`,
                      borderRadius: 12,
                      boxShadow: isOpen ? `0 4px 20px ${char.color}18` : T.shadow1,
                      overflow: 'hidden',
                      transition: 'border-color 0.2s ease, box-shadow 0.2s ease, background 0.2s ease',
                    }}
                  >
                    {/* Collapsed row — always visible, acts as toggle */}
                    <button
                      onClick={() => toggleExpand(char.id)}
                      style={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 14,
                        padding: '14px 16px',
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        textAlign: 'left',
                      }}
                    >
                      {/* Avatar with online dot */}
                      <div style={{ position: 'relative', flexShrink: 0 }}>
                        <Avatar name={char.name} color={char.color} size="md" />
                        <div style={{
                          position: 'absolute', bottom: 0, right: 0,
                          width: 9, height: 9, borderRadius: '50%',
                          background: char.online ? '#22c55e' : '#6b7280',
                          border: '1.5px solid #212121',
                        }} />
                      </div>

                      {/* Name + title */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{
                          fontSize: 14, fontWeight: 600,
                          color: isOpen ? T.text : T.text,
                          marginBottom: 2,
                        }}>
                          {char.name}
                        </div>
                        <div style={{ fontSize: 12, color: T.muted }}>{char.title}</div>
                      </div>

                      {/* Collapsed preview: personality snippet (hidden when open) */}
                      {!isOpen && (
                        <div style={{
                          fontSize: 11,
                          color: 'rgba(175,163,159,0.5)',
                          maxWidth: 180,
                          textAlign: 'right',
                          lineHeight: 1.5,
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                          flexShrink: 0,
                        }}>
                          {char.personality}
                        </div>
                      )}

                      {/* Expand/collapse chevron */}
                      <Chevron open={isOpen} />
                    </button>

                    {/* Expanded profile panel */}
                    {isOpen && (
                      <div style={{ padding: '0 16px 16px' }}>
                        <CharProfile char={char} />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* CTA buttons */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 10 }}>
            {onboardingStep > 0 && (
              <button
                onClick={() => setOnboardingStep(onboardingStep - 1)}
                style={{
                  padding: '10px 22px',
                  borderRadius: 10,
                  border: `1px solid ${T.border2}`,
                  background: 'transparent',
                  color: T.muted,
                  fontSize: 14,
                  cursor: 'pointer',
                  transition: 'color 0.15s',
                  fontFamily: 'inherit',
                }}
                onMouseEnter={e => (e.currentTarget.style.color = T.text)}
                onMouseLeave={e => (e.currentTarget.style.color = T.muted)}
              >
                ← Back
              </button>
            )}
            <button
              onClick={advance}
              style={{
                padding: '10px 28px',
                borderRadius: 10,
                background: T.primary,
                border: 'none',
                color: '#fff',
                fontSize: 14,
                fontWeight: 600,
                cursor: 'pointer',
                fontFamily: 'inherit',
                transition: 'background 0.15s',
              }}
              onMouseEnter={e => (e.currentTarget.style.background = '#0f5e43')}
              onMouseLeave={e => (e.currentTarget.style.background = T.primary)}
            >
              {scene.cta}
            </button>
          </div>

          {onboardingStep === 0 && (
            <p style={{ textAlign: 'center', marginTop: 20 }}>
              <button
                onClick={() => setScreen('assessment')}
                style={{
                  fontSize: 12,
                  color: 'rgba(175,163,159,0.4)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'color 0.15s',
                }}
                onMouseEnter={e => (e.currentTarget.style.color = T.muted)}
                onMouseLeave={e => (e.currentTarget.style.color = 'rgba(175,163,159,0.4)')}
              >
                Skip prologue
              </button>
            </p>
          )}

        </div>
      </div>
    </div>
  );
}
