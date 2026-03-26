"use client";
import { useState, useEffect, useRef } from "react";
import { useAppStore } from "@/lib/store";

/* ── Design tokens ─────────────────────────────────────────────────────────── */
const T = {
  bg:      '#0a0c0b',
  primary: '#147b58',
  text:    '#efefef',
  muted:   'rgba(175,163,159,0.75)',
  dim:     'rgba(175,163,159,0.4)',
} as const;

const OFFICE_IMG = 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1600&q=80';

/* ── Assessment questions & responses ────────────────────────────────────────── */
const QUESTIONS = [
  "Let's start. You've just joined as PM and discover three conflicting roadmaps. What's your first move?",
  "Engineering tells you the top feature request will take 6 weeks minimum. How do you respond?",
  "Sales may have already set expectations with a $2M enterprise client — but you weren't in the room. What do you do?",
  "Your CEO wants 'one clear recommendation' but the trade-offs are real. How do you handle it?",
  "A senior leader goes around your manager to give you direction. Your manager notices. Walk me through how you handle it.",
];

const ACKNOWLEDGMENTS = [
  "Good instinct. Starting with alignment and gathering context is almost always the right move.",
  "Exactly — digging into the 'why' behind constraints is what separates great PMs from good ones.",
  "Smart approach. Verifying before assuming saves you from massive downstream problems.",
  "That tension is real and there's rarely a clean answer. Navigating it well is a genuine skill.",
];

const FINAL_MSG =
  "Impressive. I have a good read on where you stand. Your simulation is calibrated — time to step into Nexus Technologies.";

function getAssessmentResponse(answeredTurn: number): string {
  if (answeredTurn >= QUESTIONS.length - 1) return FINAL_MSG;
  return `${ACKNOWLEDGMENTS[answeredTurn]}\n\n${QUESTIONS[answeredTurn + 1]}`;
}

/* ── Internal types ─────────────────────────────────────────────────────────── */
interface Msg { id: string; role: 'assistant' | 'user'; content: string; }
let _uid = 0;
const mkId = () => String(++_uid);

/* ── Sub-components ─────────────────────────────────────────────────────────── */
function TypingDots() {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
      <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'linear-gradient(135deg, #147b58, #0a2e1f)', border: '1px solid rgba(20,123,88,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 800, color: '#fff', flexShrink: 0, marginTop: 2 }}>N</div>
      <div style={{ display: 'inline-flex', gap: 5, padding: '14px 18px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '4px 18px 18px 18px', backdropFilter: 'blur(8px)' }}>
        {[0, 1, 2].map(i => (
          <div key={i} style={{ width: 7, height: 7, borderRadius: '50%', background: T.muted, animation: `novaBounce 1.2s ease-in-out ${i * 200}ms infinite` }} />
        ))}
      </div>
    </div>
  );
}

function AIBubble({ content, showAvatar }: { content: string; showAvatar: boolean }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, animation: 'novaFadeUp 0.35s ease' }}>
      {showAvatar ? (
        <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'linear-gradient(135deg, #147b58, #0a2e1f)', border: '1px solid rgba(20,123,88,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 800, color: '#fff', flexShrink: 0, marginTop: 2 }}>N</div>
      ) : (
        <div style={{ width: 28, flexShrink: 0 }} />
      )}
      <div style={{ maxWidth: 480, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '4px 18px 18px 18px', padding: '12px 16px', fontSize: 14.5, color: T.text, lineHeight: 1.7, backdropFilter: 'blur(8px)', whiteSpace: 'pre-line' }}>
        {content}
      </div>
    </div>
  );
}

function UserBubble({ content }: { content: string }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'flex-end', animation: 'novaFadeUp 0.25s ease' }}>
      <div style={{ maxWidth: 360, padding: '10px 16px', borderRadius: '18px 18px 4px 18px', background: 'rgba(20,123,88,0.18)', border: '1px solid rgba(20,123,88,0.3)', fontSize: 14, color: T.text, fontWeight: 500, lineHeight: 1.6 }}>
        {content}
      </div>
    </div>
  );
}

function MicIcon({ active }: { active: boolean }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={active ? '#ef4444' : T.muted} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="9" y="2" width="6" height="12" rx="3" />
      <path d="M5 10a7 7 0 0 0 14 0" />
      <line x1="12" y1="19" x2="12" y2="22" />
      <line x1="9" y1="22" x2="15" y2="22" />
    </svg>
  );
}

/* ── Main component ─────────────────────────────────────────────────────────── */
export function AssessmentScreen() {
  const { setScreen, setActiveBrowserTab, startSession } = useAppStore();

  const [messages,  setMessages]  = useState<Msg[]>([]);
  const [input,     setInput]     = useState('');
  const [isTyping,  setIsTyping]  = useState(false);
  const [turn,      setTurn]      = useState(0);   // which question user is currently answering (0-indexed)
  const [done,      setDone]      = useState(false);
  const [listening, setListening] = useState(false);

  const listRef        = useRef<HTMLDivElement>(null);
  const inputRef       = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<any>(null);

  const scrollDown = () =>
    setTimeout(() => listRef.current?.lastElementChild?.scrollIntoView({ behavior: 'smooth', block: 'end' }), 60);

  const appendMsg = (role: 'assistant' | 'user', content: string) => {
    setMessages(m => [...m, { id: mkId(), role, content }]);
    scrollDown();
  };

  function novaSpeak(content: string, delay = 1100): Promise<void> {
    setIsTyping(true);
    scrollDown();
    return new Promise(resolve =>
      setTimeout(() => {
        setIsTyping(false);
        appendMsg('assistant', content);
        setTimeout(() => inputRef.current?.focus(), 50);
        resolve();
      }, delay)
    );
  }

  /* On mount: Nova opens with Q1 */
  useEffect(() => {
    const t = setTimeout(() => novaSpeak(QUESTIONS[0]), 500);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function launchSimulation() {
    setScreen('office-intro');
  }

  async function handleSend() {
    const text = input.trim();
    if (!text || isTyping || done) return;
    setInput('');
    appendMsg('user', text);

    const answeredTurn = turn;
    const nextTurn     = turn + 1;
    setTurn(nextTurn);

    const response = getAssessmentResponse(answeredTurn);
    await novaSpeak(response, 1200);

    if (answeredTurn >= QUESTIONS.length - 1) {
      setDone(true);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') { e.preventDefault(); handleSend(); }
  }

  function toggleMic() {
    const SpeechRec = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRec) {
      alert('Speech recognition is not supported in this browser. Try Chrome.');
      return;
    }
    if (listening) { recognitionRef.current?.stop(); return; }
    const rec = new SpeechRec();
    rec.continuous      = false;
    rec.interimResults  = true;
    rec.onresult = (e: any) => {
      const transcript = Array.from(e.results as any[]).map((r: any) => r[0].transcript).join('');
      setInput(transcript);
    };
    rec.onend  = () => setListening(false);
    rec.onerror = () => setListening(false);
    rec.start();
    recognitionRef.current = rec;
    setListening(true);
  }

  const canSend    = input.trim().length > 0 && !isTyping && !done;
  const firstAIIdx = messages.findIndex(m => m.role === 'assistant');

  return (
    <div style={{ position: 'fixed', inset: 0, background: T.bg, fontFamily: 'inherit', zIndex: 100, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

      {/* Background image */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={OFFICE_IMG} alt="" aria-hidden style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.07, filter: 'blur(6px) saturate(0.4)', pointerEvents: 'none', userSelect: 'none', zIndex: 0 }} />

      {/* Header */}
      <div style={{ position: 'relative', zIndex: 2, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 28px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.09em', textTransform: 'uppercase', color: T.dim }}>Nebula AI Assessment</span>
        <button
          onClick={launchSimulation}
          style={{ background: 'none', border: 'none', color: T.dim, fontSize: 12.5, cursor: 'pointer', fontFamily: 'inherit', transition: 'color 0.15s' }}
          onMouseEnter={e => (e.currentTarget.style.color = T.muted)}
          onMouseLeave={e => (e.currentTarget.style.color = T.dim)}
        >Skip →</button>
      </div>

      {/* Message list — full width so scrollbar sits at screen right edge */}
      <div
        ref={listRef}
        style={{ position: 'relative', zIndex: 2, flex: 1, overflowY: 'auto', width: '100%' }}
      >
        {/* Inner wrapper keeps content centered at 700px */}
        <div style={{ maxWidth: 700, width: '100%', margin: '0 auto', padding: '28px 24px 16px', display: 'flex', flexDirection: 'column', gap: 16, boxSizing: 'border-box' }}>
          {messages.map((m, i) =>
            m.role === 'assistant'
              ? <AIBubble   key={m.id} content={m.content} showAvatar={i === firstAIIdx} />
              : <UserBubble key={m.id} content={m.content} />
          )}

          {isTyping && <TypingDots />}

          {done && (
            <div style={{ paddingLeft: 38, animation: 'novaFadeUp 0.4s ease' }}>
              <button
                onClick={launchSimulation}
                style={{ padding: '12px 24px', borderRadius: 10, background: T.primary, border: 'none', color: '#fff', fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', transition: 'opacity 0.15s' }}
                onMouseEnter={e => (e.currentTarget.style.opacity = '0.85')}
                onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
              >
                Enter the simulation →
              </button>
            </div>
          )}

          <div style={{ height: 4 }} />
        </div>
      </div>

      {/* Input bar */}
      {!done && (
        <div style={{ position: 'relative', zIndex: 2, flexShrink: 0, padding: '12px 24px 28px', maxWidth: 700, width: '100%', alignSelf: 'center', boxSizing: 'border-box' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 9999, padding: '10px 10px 10px 20px', transition: 'border-color 0.15s' }}>
            <input
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Your responses here"
              disabled={isTyping || done}
              style={{ flex: 1, background: 'none', border: 'none', outline: 'none', color: T.text, fontSize: 14, fontFamily: 'inherit' }}
            />
            {/* Mic button */}
            <button
              onClick={toggleMic}
              title={listening ? 'Stop listening' : 'Speak your answer'}
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px 6px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 6, animation: listening ? 'micPulse 1.2s ease-in-out infinite' : 'none', transition: 'opacity 0.15s' }}
            >
              <MicIcon active={listening} />
            </button>
            {/* Send button */}
            <button
              onClick={handleSend}
              disabled={!canSend}
              style={{ width: 36, height: 36, borderRadius: '50%', background: canSend ? T.primary : 'rgba(255,255,255,0.1)', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: canSend ? 'pointer' : 'default', transition: 'background 0.2s', flexShrink: 0 }}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="19" x2="12" y2="5" /><polyline points="5 12 12 5 19 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes novaBounce { 0%,80%,100%{transform:translateY(0);opacity:0.45} 40%{transform:translateY(-6px);opacity:1} }
        @keyframes novaFadeUp { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
        @keyframes micPulse   { 0%,100%{opacity:1} 50%{opacity:0.4} }
        input::placeholder { color: rgba(175,163,159,0.35); }
      `}</style>
    </div>
  );
}
