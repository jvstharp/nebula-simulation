"use client";
import { useState, useRef, useEffect } from "react";
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

const CHAR_PROFILES: Record<string, { about: string; relationship: string; focus: string; approach: string; tags: string[] }> = {
  sarah: {
    about: 'Sarah has been at Nexus since Series A and holds more institutional knowledge than anyone else in the building. She was bypassed by Elena this week and is carefully deciding whether to trust you.',
    relationship: "Technically a peer, but she owns the product process you'll need sign-off from. She knows every stakeholder and every political landmine — treat her as a partner and she becomes your strongest ally.",
    focus: "Ensuring Product has sign-off before anything reaches the board. She cannot be surprised on Monday — this is a professional credibility issue, not just process preference.",
    approach: "Bring her in early. Never let her hear something through Elena first. Ask for her read before you form your own position.",
    tags: ['Ally potential', 'Process gate', 'Institutional memory'],
  },
  marcus: {
    about: "Marcus lost his best engineer three weeks ago and is holding the team together through sheer will. He quotes \"six weeks\" because of a security review process — not his own estimate — a distinction he hasn't volunteered yet.",
    relationship: "You need Engineering's commitment to make any plan credible. Marcus will give you an honest answer if you ask the right question — but he won't volunteer information he wasn't asked for.",
    focus: "Protecting his team from scope creep. Engineering is at 94% capacity — one more unplanned item tips into quality failures. He needs to be in the room before any commitment is made.",
    approach: "Ask open questions. Don't pressure him on timeline — explore constraints instead. Ask him specifically whether he's looked at third-party alternatives.",
    tags: ['Critical dependency', 'Capacity constrained', 'Key information holder'],
  },
  priya: {
    about: "Priya has been burned twice by sharing research that got deprioritised without explanation, so she no longer volunteers findings proactively. The data she's sitting on is the most strategically relevant information in this scenario.",
    relationship: "She leads Design and has a scoped, lightweight fix for the NPS drop ready to go. She will share everything if asked directly and treated as a decision-making peer rather than a supporting function.",
    focus: "Preventing the onboarding improvement from being cut for the fourth consecutive quarter. She wants to surface the connection between UX debt and commercial churn before the board meeting locks in scope.",
    approach: "Ask her directly what the data shows. Don't position her as a resource — position her as a co-author of the solution. She responds to being included, not consulted.",
    tags: ['Research holder', 'Under-utilised', 'High-trust potential'],
  },
  tom: {
    about: "Tom is high-energy and genuinely worried about the Acme deal. He's characterising the situation as worse than it is — partly anxiety, partly hoping urgency forces a faster decision. The actual email chain is more carefully scoped than his verbal framing suggests.",
    relationship: "He brings external commercial pressure that is real, even if slightly overstated. He also has intelligence about a second enterprise prospect with identical SSO requirements that he hasn't shared yet.",
    focus: "Protecting the Acme deal and giving his team a credible story before the next procurement call. A concrete date or a private beta offer both work — he can't go back with ambiguity.",
    approach: "Ask him to forward the actual Acme email chain. Don't just accept his verbal summary. Be specific about what you need from him and he'll deliver it.",
    tags: ['Commercial pressure', 'Hidden intelligence', 'Needs a concrete ask'],
  },
  elena: {
    about: "Elena is board-aware and fast-moving. She operates on the assumption that context flows correctly through the organisation without checking. She has a critical piece of information she hasn't shared — not because she's hiding it, but because she genuinely believes everyone already knows.",
    relationship: "She's your CEO and the person who promoted you. She bypassed Sarah out of urgency, not politics, and will correct for it if it's raised explicitly. She wants one credible, unified plan by Monday.",
    focus: "Walking into the board meeting with a single Q3 narrative. The Series C lead investor will be in the room and has been asking about SSO progress since the term sheet was signed.",
    approach: "Never bring her options without a recommendation. Frame trade-offs with a clear point of view. Raise the Sarah situation directly — she'll appreciate it.",
    tags: ['Decision authority', 'Information gap', 'Needs a recommendation'],
  },
};

// step 0 = AI chat; step 1 = team; step 2 = tutorial
const SCENES = [
  { type: 'team' as const, title: 'Your Colleagues', body: '', cta: 'Learn the interface →' },
  {
    type: 'tutorial' as const,
    title: 'How it works',
    body: "The simulation runs across 3 sessions. Each session has OKRs you need to advance, AI colleagues who respond to your choices, and chaos events that force real-time decisions.\n\nYour decisions persist. How you treat Marcus in Session 1 shapes how much he helps you in Session 3.",
    cta: 'Begin assessment →',
  },
];

interface ChatMsg { role: 'alex' | 'user'; text: string; id: string }

function Chevron({ open }: { open: boolean }) {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none"
      style={{ transition: 'transform 0.25s ease', transform: open ? 'rotate(180deg)' : 'rotate(0deg)', flexShrink: 0 }}>
      <path d="M3 5l4 4 4-4" stroke="rgba(175,163,159,0.5)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ProfileLabel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ fontSize: 9.5, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(175,163,159,0.5)', marginBottom: 5 }}>
      {children}
    </div>
  );
}

function CharProfile({ char }: { char: typeof CHARACTERS[number] }) {
  const p = CHAR_PROFILES[char.id];
  if (!p) return null;
  const trustPct = Math.round(char.trust * 100);
  const trustColor = char.trust >= 0.7 ? '#22c55e' : char.trust >= 0.5 ? '#f59e0b' : '#ef4444';
  const emotionColors: Record<string, string> = { neutral: 'rgba(255,255,255,0.35)', cooperative: '#22c55e', frustrated: '#ef4444', disengaged: '#6b7280', alarmed: '#f59e0b' };
  const emoColor = emotionColors[char.emotion] ?? 'rgba(255,255,255,0.35)';
  const emotionLabels: Record<string, string> = { neutral: 'Neutral', cooperative: 'Cooperative', frustrated: 'Frustrated', disengaged: 'Disengaged', alarmed: 'Alarmed' };

  return (
    <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 16, display: 'flex', flexDirection: 'column', gap: 16, animation: 'fadeSlideIn 0.22s ease' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <div style={{ width: 7, height: 7, borderRadius: '50%', background: char.online ? '#22c55e' : '#6b7280', boxShadow: char.online ? '0 0 6px rgba(34,197,94,0.6)' : 'none' }} />
          <span style={{ fontSize: 11, color: T.muted }}>{char.online ? 'Online' : 'Offline'}</span>
        </div>
        <div style={{ fontSize: 10.5, fontWeight: 600, color: emoColor, background: `${emoColor}18`, border: `1px solid ${emoColor}30`, borderRadius: 5, padding: '2px 8px' }}>
          {emotionLabels[char.emotion] ?? char.emotion}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginLeft: 'auto' }}>
          <span style={{ fontSize: 10.5, color: T.muted, whiteSpace: 'nowrap' }}>Initial trust</span>
          <div style={{ width: 64, height: 4, background: 'rgba(255,255,255,0.07)', borderRadius: 2, overflow: 'hidden' }}>
            <div style={{ width: `${trustPct}%`, height: '100%', background: trustColor, borderRadius: 2 }} />
          </div>
          <span style={{ fontSize: 10.5, fontWeight: 700, color: trustColor, minWidth: 28 }}>{trustPct}%</span>
        </div>
      </div>
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        {p.tags.map(tag => (
          <span key={tag} style={{ fontSize: 10.5, fontWeight: 600, padding: '3px 9px', borderRadius: 5, background: `${char.color}14`, color: char.color, border: `1px solid ${char.color}28` }}>{tag}</span>
        ))}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 9, padding: '11px 13px' }}>
          <ProfileLabel>About</ProfileLabel>
          <p style={{ fontSize: 12.5, color: T.muted, lineHeight: 1.65, margin: 0 }}>{p.about}</p>
        </div>
        <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 9, padding: '11px 13px' }}>
          <ProfileLabel>Working relationship</ProfileLabel>
          <p style={{ fontSize: 12.5, color: T.muted, lineHeight: 1.65, margin: 0 }}>{p.relationship}</p>
        </div>
        <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 9, padding: '11px 13px' }}>
          <ProfileLabel>What they're focused on</ProfileLabel>
          <p style={{ fontSize: 12.5, color: T.muted, lineHeight: 1.65, margin: 0 }}>{p.focus}</p>
        </div>
        <div style={{ background: `${char.color}0a`, border: `1px solid ${char.color}22`, borderRadius: 9, padding: '11px 13px' }}>
          <ProfileLabel>How to approach them</ProfileLabel>
          <p style={{ fontSize: 12.5, color: T.text, lineHeight: 1.65, margin: 0 }}>{p.approach}</p>
        </div>
      </div>
    </div>
  );
}

/* ── AI Onboarding Chat ──────────────────────────────────────────────────────── */
function OnboardingChat({ userName, onComplete, onSkip }: { userName: string; onComplete: () => void; onSkip: () => void }) {
  const firstMsg = `Hi ${userName}, I'm Alex — I help new PMs get oriented before they meet the team. Quick chat before I hand you over. I'll ask a few questions about how you work — no trick answers, just be direct. What kind of PM work have you been doing up to now?`;
  const [msgs, setMsgs] = useState<ChatMsg[]>([{ role: 'alex', text: firstMsg, id: 'init' }]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [chatDone, setChatDone] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [msgs, loading]);

  useEffect(() => {
    if (!chatDone) return;
    const t = setTimeout(() => onComplete(), 1500);
    return () => clearTimeout(t);
  }, [chatDone, onComplete]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || loading) return;
    const newMsg: ChatMsg = { role: 'user', text, id: Date.now().toString() };
    const updated = [...msgs, newMsg];
    setMsgs(updated);
    setInput('');
    setLoading(true);
    try {
      const apiMessages = updated.map(m => ({
        role: m.role === 'alex' ? 'assistant' as const : 'user' as const,
        content: m.text,
      }));
      const res = await fetch('/api/onboarding/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: apiMessages, userName }),
      });
      const data = await res.json();
      const reply = data.reply ?? "Alright, head on through — the team is expecting you.";
      setMsgs(prev => [...prev, { role: 'alex', text: reply, id: Date.now().toString() }]);
      if (data.complete) setChatDone(true);
    } catch {
      setMsgs(prev => [...prev, { role: 'alex', text: "Head through to meet the team — they're expecting you.", id: 'err' }]);
      setChatDone(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', width: '100%', maxWidth: 640, margin: '0 auto' }}>
      {/* Top label */}
      <div style={{ flexShrink: 0, padding: '10px 20px 12px', display: 'flex', justifyContent: 'center' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 14px', borderRadius: 99, background: T.surface, border: `1px solid ${T.border2}`, fontSize: 11, color: T.muted, letterSpacing: '0.06em', textTransform: 'uppercase' as const }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#22c55e', display: 'inline-block' }} />
          Onboarding — Alex, HR Coordinator
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} style={{ flex: 1, overflowY: 'auto', overscrollBehavior: 'contain', padding: '4px 20px 12px', display: 'flex', flexDirection: 'column', gap: 14 }}>
        {msgs.map(m => (
          <div key={m.id} style={{ display: 'flex', gap: 10, flexDirection: m.role === 'alex' ? 'row' : 'row-reverse' as any, alignItems: 'flex-end' }}>
            {m.role === 'alex' && (
              <div style={{ width: 28, height: 28, borderRadius: '50%', background: T.primary, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: '#fff', flexShrink: 0 }}>A</div>
            )}
            <div style={{
              maxWidth: '78%',
              background: m.role === 'alex' ? 'rgba(255,255,255,0.05)' : `${T.primary}22`,
              border: m.role === 'alex' ? '1px solid rgba(255,255,255,0.08)' : `1px solid ${T.primary}44`,
              borderRadius: m.role === 'alex' ? '12px 12px 12px 4px' : '12px 12px 4px 12px',
              padding: '10px 14px', fontSize: 13.5, color: T.text, lineHeight: 1.6,
            }}>{m.text}</div>
          </div>
        ))}
        {loading && (
          <div style={{ display: 'flex', gap: 10, alignItems: 'flex-end' }}>
            <div style={{ width: 28, height: 28, borderRadius: '50%', background: T.primary, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: '#fff', flexShrink: 0 }}>A</div>
            <div style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px 12px 12px 4px', padding: '12px 16px', display: 'flex', gap: 5 }}>
              {[0, 1, 2].map(i => <div key={i} style={{ width: 6, height: 6, borderRadius: '50%', background: T.muted, animation: `alexPulse 1.2s ${i * 0.2}s ease-in-out infinite` }} />)}
            </div>
          </div>
        )}
      </div>

      {/* Input bar — sticky to bottom, keyboard-safe */}
      <div style={{ flexShrink: 0, borderTop: `1px solid ${T.border2}`, background: T.bg, padding: '12px 16px', paddingBottom: 'calc(12px + env(safe-area-inset-bottom, 0px))' }}>
        {!chatDone ? (
          <div style={{ display: 'flex', gap: 10 }}>
            <textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
              placeholder="Type your answer... (Enter to send)"
              rows={2}
              style={{ flex: 1, background: T.surface, border: `1px solid ${T.border2}`, borderRadius: 10, padding: '10px 14px', fontSize: 13.5, color: T.text, resize: 'none' as const, fontFamily: 'inherit', outline: 'none', lineHeight: 1.5 }}
            />
            <button onClick={sendMessage} disabled={!input.trim() || loading}
              style={{ padding: '0 20px', borderRadius: 10, background: T.primary, border: 'none', color: '#fff', fontSize: 13.5, fontWeight: 600, cursor: !input.trim() || loading ? 'not-allowed' : 'pointer', opacity: !input.trim() || loading ? 0.4 : 1, fontFamily: 'inherit' }}>
              Send
            </button>
          </div>
        ) : (
          <p style={{ fontSize: 13, color: T.muted, textAlign: 'center', margin: '4px 0 0' }}>Heading to the team...</p>
        )}
        <div style={{ textAlign: 'center', marginTop: 10 }}>
          <button onClick={onSkip} style={{ fontSize: 12, color: 'rgba(175,163,159,0.35)', background: 'none', border: 'none', cursor: 'pointer' }}>Skip prologue</button>
        </div>
      </div>

      <style>{`@keyframes alexPulse { 0%,80%,100%{opacity:.3;transform:scale(.8)} 40%{opacity:1;transform:scale(1)} }`}</style>
    </div>
  );
}

/* ── Main component ─────────────────────────────────────────────────────────── */
export function OnboardingScreen() {
  const { setScreen, setOnboardingStep, onboardingStep, user } = useAppStore();
  const [visible, setVisible] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const TOTAL_STEPS = 3; // 0=chat, 1=team, 2=tutorial

  const advance = () => {
    if (onboardingStep < TOTAL_STEPS - 1) {
      setVisible(false);
      setTimeout(() => { setOnboardingStep(onboardingStep + 1); setVisible(true); }, 200);
    } else {
      setScreen('assessment');
    }
  };

  const scene = onboardingStep > 0 ? SCENES[onboardingStep - 1] : null;
  const userName = user?.name?.split(' ')[0] ?? 'there';

  // Step 0: full-screen chat — keyboard floats on top (100dvh + sticky input)
  if (onboardingStep === 0) {
    return (
      <div style={{ background: T.bg, height: '100dvh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Progress dots */}
        <div style={{ flexShrink: 0, display: 'flex', justifyContent: 'center', gap: 6, paddingTop: 20, paddingBottom: 4 }}>
          {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
            <div key={i} style={{ height: 4, width: i === onboardingStep ? 24 : 8, borderRadius: 99, background: i === onboardingStep ? T.primary : i < onboardingStep ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.1)', transition: 'all 0.25s ease' }} />
          ))}
        </div>
        <OnboardingChat userName={userName} onComplete={advance} onSkip={() => setScreen('assessment')} />
      </div>
    );
  }

  return (
    <div style={{ background: T.bg, minHeight: '100vh', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: '30%', left: '50%', transform: 'translate(-50%,-50%)', width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle,rgba(20,123,88,0.06) 0%,transparent 70%)', pointerEvents: 'none' }} />
      <style>{`@keyframes fadeSlideIn{from{opacity:0;transform:translateY(-6px)}to{opacity:1;transform:translateY(0)}}`}</style>

      {/* Progress dots */}
      <div style={{ position: 'relative', zIndex: 10, display: 'flex', justifyContent: 'center', gap: 6, paddingTop: 40 }}>
        {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
          <div key={i} style={{ height: 4, width: i === onboardingStep ? 24 : 8, borderRadius: 99, background: i === onboardingStep ? T.primary : i < onboardingStep ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.1)', transition: 'all 0.25s ease' }} />
        ))}
      </div>

      {/* Content */}
      <div style={{ position: 'relative', zIndex: 10, flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: scene?.type === 'team' ? 'flex-start' : 'center', padding: scene?.type === 'team' ? '32px 24px 48px' : '48px 24px', opacity: visible ? 1 : 0, transition: 'opacity 0.2s ease' }}>

        {scene && (
          <div style={{ width: '100%', maxWidth: scene.type === 'team' ? 640 : 520 }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 28 }}>
              <div style={{ width: 56, height: 56, borderRadius: 16, background: T.surface, border: `1px solid ${T.border2}`, boxShadow: T.shadow1, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>
                {scene.type === 'team' ? '👥' : '⚡'}
              </div>
            </div>
            <h1 style={{ fontSize: 28, fontWeight: 600, color: T.text, textAlign: 'center', marginBottom: scene.type === 'team' ? 6 : 20, letterSpacing: '-0.02em', lineHeight: 1.25 }}>{scene.title}</h1>

            {scene.type === 'team' && (
              <p style={{ textAlign: 'center', fontSize: 14, color: T.muted, marginBottom: 28, lineHeight: 1.6 }}>
                Click any card to learn who they are and how to work with them.
              </p>
            )}

            {scene.type !== 'team' ? (
              <p style={{ color: T.muted, textAlign: 'center', lineHeight: 1.75, fontSize: 15, whiteSpace: 'pre-line', maxWidth: 460, margin: '0 auto 44px' }}>{scene.body}</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 32 }}>
                {CHARACTERS.map(char => {
                  const isOpen = expandedId === char.id;
                  return (
                    <div key={char.id} style={{ background: isOpen ? `${char.color}08` : T.surface, border: `1px solid ${isOpen ? char.color + '30' : T.border}`, borderRadius: 12, boxShadow: isOpen ? `0 4px 20px ${char.color}18` : T.shadow1, overflow: 'hidden', transition: 'all 0.2s ease' }}>
                      <button onClick={() => setExpandedId(prev => prev === char.id ? null : char.id)} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 14, padding: '14px 16px', background: 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left' as const }}>
                        <div style={{ position: 'relative', flexShrink: 0 }}>
                          <Avatar name={char.name} color={char.color} size="md" />
                          <div style={{ position: 'absolute', bottom: 0, right: 0, width: 9, height: 9, borderRadius: '50%', background: char.online ? '#22c55e' : '#6b7280', border: '1.5px solid #212121' }} />
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 14, fontWeight: 600, color: T.text, marginBottom: 2 }}>{char.name}</div>
                          <div style={{ fontSize: 12, color: T.muted }}>{char.title}</div>
                        </div>
                        {!isOpen && <div style={{ fontSize: 11, color: 'rgba(175,163,159,0.5)', maxWidth: 180, textAlign: 'right' as const, lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' as const, overflow: 'hidden', flexShrink: 0 }}>{char.personality}</div>}
                        <Chevron open={isOpen} />
                      </button>
                      {isOpen && <div style={{ padding: '0 16px 16px' }}><CharProfile char={char} /></div>}
                    </div>
                  );
                })}
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'center', gap: 10 }}>
              <button onClick={() => setOnboardingStep(onboardingStep - 1)} style={{ padding: '10px 22px', borderRadius: 10, border: `1px solid ${T.border2}`, background: 'transparent', color: T.muted, fontSize: 14, cursor: 'pointer', fontFamily: 'inherit' }}>← Back</button>
              <button onClick={advance} style={{ padding: '10px 28px', borderRadius: 10, background: T.primary, border: 'none', color: '#fff', fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>{scene.cta}</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
