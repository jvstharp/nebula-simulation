"use client";
import { useState } from "react";
import { useAppStore } from "@/lib/store";
import { WindowChrome } from "@/components/layout/window-chrome";
import { Sidebar } from "@/components/layout/sidebar";
import { CHARACTERS } from "@/lib/data";
import { Avatar } from "@/components/ui/avatar";
import { SectionHeader, cardStyle } from "@/components/layout/discovery-ui";

/* ══════════════════════════════════════════════════════════════════════════════
   LIGHTNING BOLT  — fixed, bottom-left, always shown in windowed screens
   ══════════════════════════════════════════════════════════════════════════════ */
function LightningBadge() {
  return (
    <div style={{
      position: 'fixed', left: 24, bottom: 24, zIndex: 50,
      width: 44, height: 44, borderRadius: 12,
      background: '#1c1400',
      border: '1px solid rgba(245,158,11,0.3)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
      cursor: 'pointer',
    }}>
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path d="M13 2L4.5 13.5H12L11 22L19.5 10.5H12L13 2Z"
          fill="#f59e0b" strokeLinejoin="round" />
      </svg>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════════
   ASSISTANT PANEL  (Image 1)
   ══════════════════════════════════════════════════════════════════════════════ */
function EditIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
      <path d="M9 2l2 2-7 7H2V9L9 2z" stroke="currentColor" strokeWidth="1.1"
        strokeLinejoin="round" fill="none" />
    </svg>
  );
}
function ChevronDownIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
      <path d="M2 4l3.5 3.5L9 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

function AssistantPanel() {
  const [inputVal, setInputVal] = useState('');

  return (
    <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
      {/* ── Chat list sidebar ─────────────────────────────────────────── */}
      <div style={{
        width: 220, flexShrink: 0,
        borderRight: '1px solid rgba(255,255,255,0.05)',
        display: 'flex', flexDirection: 'column',
        background: 'var(--bg-window)',
      }}>
        {/* New Chat button */}
        <button style={{
          display: 'flex', alignItems: 'center', gap: 10,
          padding: '14px 16px',
          color: 'rgba(255,255,255,0.75)',
          background: 'transparent',
          borderTop: 'none', borderLeft: 'none', borderRight: 'none',
          cursor: 'pointer', fontSize: 13, fontFamily: 'var(--font-sans)',
          borderBottom: '1px solid rgba(255,255,255,0.05)',
          transition: 'color 120ms',
          textAlign: 'left',
        }}
          onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
          onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.75)')}
        >
          <EditIcon />
          <span style={{ fontWeight: 500 }}>New Chat</span>
        </button>

        {/* Your Chats section */}
        <div style={{ padding: '10px 16px 6px' }}>
          <button style={{
            display: 'flex', alignItems: 'center', gap: 10,
            color: 'rgba(255,255,255,0.4)', background: 'transparent', border: 'none',
            cursor: 'pointer', fontSize: 12, fontFamily: 'var(--font-sans)', padding: 0,
          }}>
            <span style={{ fontWeight: 500 }}>Your Chats</span>
            <ChevronDownIcon />
          </button>
        </div>

        {/* Chat items */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '10px 8px', display: 'flex', flexDirection: 'column', gap: 10 }}>
          {[
            'Competitive landscape brief',
            'Q3 roadmap conflict analysis',
            'Engineering capacity trade-offs',
          ].map((chat, i) => (
            <button key={i} style={{
              display: 'block', width: '100%', textAlign: 'left',
              padding: '8px 10px', borderRadius: 8,
              background: i === 0 ? 'rgba(255,255,255,0.055)' : 'transparent',
              border: 'none', cursor: 'pointer',
              color: i === 0 ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.3)',
              fontSize: 12, fontFamily: 'var(--font-sans)',
              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
              transition: 'background 120ms, color 120ms',
            }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.07)'; e.currentTarget.style.color = 'rgba(255,255,255,0.7)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = i === 0 ? 'rgba(255,255,255,0.055)' : 'transparent'; e.currentTarget.style.color = i === 0 ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.3)'; }}
            >
              {chat}
            </button>
          ))}
        </div>
      </div>

      {/* ── Main chat area ────────────────────────────────────────────── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Title */}
        <div style={{ padding: '16px 24px 2px' }}>
          <SectionHeader title="Nebula Assistant" />
        </div>

        {/* Chat messages — fills space, user message pinned at bottom */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '16px 24px' }}>
          {/* User message bubble */}
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <div style={{
              maxWidth: 340,
              background: 'rgba(255,255,255,0.085)',
              borderRadius: '16px 16px 4px 16px',
              padding: '12px 16px',
              fontSize: 13,
              lineHeight: 1.55,
              color: 'rgba(255,255,255,0.85)',
            }}>
              Hey, I need a quick breakdown of the competitive landscape for the mid-market segment.
              Can you summarize the top three players, their pricing models, and any recent shifts in
              their strategy? Keep it concise, I'm heading into a stakeholder meeting in 20 minutes.
            </div>
          </div>
        </div>

        {/* ── Gradient-border input ─────────────────────────────────── */}
        <div style={{ padding: '0 20px 20px' }}>
          <div style={{ position: 'relative', borderRadius: 28 }}>
            {/* Gradient ring */}
            <div style={{
              position: 'absolute', inset: -1.5,
              borderRadius: 28,
              background: 'linear-gradient(135deg, #147b58 0%, #7c3aed 50%, #3b82f6 100%)',
              zIndex: 0,
              opacity: 0.9,
            }} />
            {/* Input */}
            <div style={{
              position: 'relative', zIndex: 1,
              display: 'flex', alignItems: 'center', gap: 10,
              background: 'var(--bg-window)',
              borderRadius: 27,
              padding: '11px 18px',
            }}>
              <span style={{ color: 'rgba(255,255,255,0.35)', fontSize: 18, lineHeight: 1 }}>+</span>
              <input
                value={inputVal}
                onChange={e => setInputVal(e.target.value)}
                placeholder="Ask anything"
                style={{
                  flex: 1, background: 'transparent', border: 'none', outline: 'none',
                  fontSize: 13, color: 'rgba(255,255,255,0.8)',
                  fontFamily: 'var(--font-sans)',
                }}
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore placeholder style
                className="placeholder-white/25"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════════
   DRIVE PANEL  (Image 4)
   ══════════════════════════════════════════════════════════════════════════════ */
function DocSVG() {
  return (
    <svg width="38" height="46" viewBox="0 0 38 46" fill="none">
      <path d="M4 2h22l8 8v34a2 2 0 01-2 2H4a2 2 0 01-2-2V4a2 2 0 012-2z"
        fill="#3b6fd4" stroke="#5b8de8" strokeWidth="0.8" />
      <path d="M26 2v8h8" fill="none" stroke="#5b8de8" strokeWidth="0.8" />
      <rect x="8" y="18" width="22" height="1.5" rx="0.75" fill="rgba(255,255,255,0.35)" />
      <rect x="8" y="22" width="18" height="1.5" rx="0.75" fill="rgba(255,255,255,0.25)" />
      <rect x="8" y="26" width="20" height="1.5" rx="0.75" fill="rgba(255,255,255,0.2)" />
    </svg>
  );
}

function FolderSVG() {
  return (
    <svg width="46" height="38" viewBox="0 0 46 38" fill="none">
      <path d="M2 8a2 2 0 012-2h14l3 4h21a2 2 0 012 2v22a2 2 0 01-2 2H4a2 2 0 01-2-2V8z"
        fill="#c8922a" stroke="#daa63a" strokeWidth="0.8" />
      <path d="M2 13h42" stroke="rgba(0,0,0,0.15)" strokeWidth="1" />
    </svg>
  );
}

/* pattern: true=doc, false=folder */
const FILE_GRID: boolean[] = [
  true,  true,  true,  true,  false, false, true,  true,  false,
  false, true,  false, true,  true,  true,  false, true,  false,
];

function DrivePanel() {
  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: '22px 28px 32px' }}>
      <SectionHeader title="Files" />

      {/* File grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(9, 1fr)',
        gap: '10px',
      }}>
        {FILE_GRID.map((isDoc, i) => (
          <button
            key={i}
            style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center',
              gap: 10, padding: '12px 10px', borderRadius: 8,
              background: 'transparent', border: 'none', cursor: 'pointer',
              transition: 'background 150ms',
            }}
            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.04)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
          >
            {isDoc ? <DocSVG /> : <FolderSVG />}
            <span style={{
              fontSize: 10.5,
              color: 'rgba(255,255,255,0.45)',
              textAlign: 'center',
              maxWidth: 68,
              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            }}>
              New File
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════════
   MEETINGS PANEL  (Image 5)
   ══════════════════════════════════════════════════════════════════════════════ */
function MicBtn({ muted = false }: { muted?: boolean }) {
  return (
    <button style={{
      width: 48, height: 48, borderRadius: '50%',
      background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.15)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      cursor: 'pointer',
    }}>
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <rect x="7" y="1" width="6" height="10" rx="3" stroke="white" strokeWidth="1.4" fill="none" />
        <path d="M3.5 9.5a6.5 6.5 0 0013 0" stroke="white" strokeWidth="1.4" strokeLinecap="round" fill="none" />
        <path d="M10 16v3" stroke="white" strokeWidth="1.4" strokeLinecap="round" />
        {muted && <line x1="2" y1="2" x2="18" y2="18" stroke="white" strokeWidth="1.5" strokeLinecap="round" />}
      </svg>
    </button>
  );
}
function CameraBtn() {
  return (
    <button style={{
      width: 48, height: 48, borderRadius: '50%',
      background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.15)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      cursor: 'pointer',
    }}>
      <svg width="22" height="18" viewBox="0 0 22 18" fill="none">
        <rect x="1" y="3" width="14" height="12" rx="2" stroke="white" strokeWidth="1.4" fill="none" />
        <path d="M15 7l5-3v10l-5-3V7z" stroke="white" strokeWidth="1.4" strokeLinejoin="round" fill="none" />
      </svg>
    </button>
  );
}
function ShareBtn() {
  return (
    <button style={{
      width: 48, height: 48, borderRadius: '50%',
      background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.15)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      cursor: 'pointer',
    }}>
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <rect x="2" y="6" width="16" height="12" rx="2" stroke="white" strokeWidth="1.4" fill="none" />
        <path d="M10 2v10M7 5l3-3 3 3" stroke="white" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  );
}
function HangUpBtn({ onClick }: { onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        width: 48, height: 48, borderRadius: '50%',
        background: '#ef4444', border: 'none',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        cursor: 'pointer',
      }}>
      <svg width="24" height="12" viewBox="0 0 24 12" fill="none">
        <path d="M1 8c2-4 5-6 11-6s9 2 11 6l-3 2c-1-2-4-3-8-3s-7 1-8 3L1 8z"
          fill="white" />
      </svg>
    </button>
  );
}

function ParticipantTile({
  name, label, isYou = false, photo,
}: {
  name: string; label: string; isYou?: boolean; photo?: string;
}) {
  return (
    <div style={{
      flex: 1, position: 'relative', borderRadius: 10, overflow: 'hidden',
      background: isYou ? 'rgba(255,255,255,0.025)' : '#1a1a1a',
      border: '1px solid rgba(255,255,255,0.06)',
      minHeight: 240,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      {/* Photo placeholder (gradient) */}
      {!isYou && (
        <div style={{
          position: 'absolute', inset: 0,
          background: photo === 'marshall'
            ? 'linear-gradient(180deg, #2a2218 0%, #1a140d 100%)'
            : 'linear-gradient(180deg, #1e2428 0%, #14191d 100%)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          {/* Silhouette */}
          <div style={{
            width: '60%', display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
          }}>
            <div style={{
              width: 80, height: 80, borderRadius: '50%',
              background: photo === 'marshall'
                ? 'linear-gradient(145deg, #5c3a1e 0%, #3d2510 100%)'
                : 'linear-gradient(145deg, #b09080 0%, #8a6a58 100%)',
              marginBottom: 8,
            }} />
            <div style={{
              width: 140, height: 100,
              background: photo === 'marshall'
                ? 'linear-gradient(145deg, #4a3020 0%, #2d1a0e 100%)'
                : 'linear-gradient(145deg, #9a8070 0%, #6a5040 100%)',
              borderRadius: '60px 60px 0 0',
            }} />
          </div>
        </div>
      )}

      {isYou && (
        <span style={{ fontSize: 16, color: 'rgba(255,255,255,0.3)', fontWeight: 500 }}>You</span>
      )}

      {/* Name label */}
      <div style={{
        position: 'absolute', bottom: 12, left: 14,
        fontSize: 12, fontWeight: 500, color: 'rgba(255,255,255,0.85)',
      }}>
        {label}
      </div>
    </div>
  );
}

function MeetingsPanel() {
  const { setScreen } = useAppStore();
  const [transcriptOpen, setTranscriptOpen] = useState(true);

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {/* Heading */}
      <div style={{ padding: '18px 24px 4px' }}>
        <SectionHeader title="Weekly standup" />
      </div>

      {/* Video panels */}
      <div style={{ padding: '0 24px', display: 'flex', gap: 10, flex: 1 }}>
        <ParticipantTile name="marshall" label="Marshall Combs" photo="marshall" />
        <ParticipantTile name="tristan" label="Tristan Wright" photo="tristan" />
        <ParticipantTile name="you" label="Your Name" isYou />
      </div>

      {/* Call controls */}
      <div style={{
        display: 'flex', justifyContent: 'center', alignItems: 'center',
        gap: 12, padding: '16px 0 12px',
      }}>
        <MicBtn />
        <CameraBtn />
        <ShareBtn />
        <HangUpBtn onClick={() => setScreen('dashboard')} />
      </div>

      {/* Transcript */}
      <div style={{
        borderTop: '1px solid rgba(255,255,255,0.06)',
        padding: '14px 24px 16px',
        overflow: 'hidden',
        flex: transcriptOpen ? '0 0 auto' : undefined,
        maxHeight: transcriptOpen ? 140 : 44,
        transition: 'max-height 250ms ease',
      }}>
        <button
          onClick={() => setTranscriptOpen(o => !o)}
          style={{
            display: 'flex', alignItems: 'center', gap: 10,
            background: 'transparent', border: 'none', cursor: 'pointer',
            color: 'rgba(255,255,255,0.65)', fontSize: 12.5, fontWeight: 500,
            fontFamily: 'var(--font-sans)', padding: 0, marginBottom: 10,
          }}
        >
          <span>Transcript (generated automatically)</span>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none"
            style={{ transform: transcriptOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 200ms' }}>
            <path d="M2 4.5l4 4 4-4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
          </svg>
        </button>

        {transcriptOpen && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              { ts: '00:00:03', speaker: 'You (Host)', text: "Okay, good afternoon everyone. Let's get started. Can you all hear me clearly?" },
              { ts: '00:00:06', speaker: 'Marshall', text: 'Yes, loud and clear.' },
            ].map((line, i) => (
              <p key={i} style={{ margin: 0, fontSize: 12, color: 'rgba(255,255,255,0.55)', lineHeight: 1.5 }}>
                <span style={{ color: 'rgba(255,255,255,0.28)', fontVariantNumeric: 'tabular-nums' }}>
                  [{line.ts}]
                </span>{' '}
                <span style={{ color: 'rgba(255,255,255,0.45)', fontWeight: 500 }}>{line.speaker}:</span>{' '}
                {line.text}
                {i === 1 && <span style={{ display: 'inline-block', width: 1, height: 12, background: 'rgba(255,255,255,0.6)', marginLeft: 1, verticalAlign: 'text-bottom' }} />}
              </p>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════════
   PROJECT OVERVIEW PANEL
   ══════════════════════════════════════════════════════════════════════════════ */
function ProjectOverviewPanel() {
  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: '22px 28px 32px' }}>
      <SectionHeader title="Project Overview" />
      <div style={{
        ...cardStyle, padding: 16, marginBottom: 16,
      }}>
        <p style={{ fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>Your Mission</p>
        <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.55)', lineHeight: 1.55, margin: 0 }}>
          Lead a cross-functional task force to assess a high-impact strategic initiative, synthesise
          conflicting departmental priorities, and deliver a data-backed business case that can survive
          executive approval under tight time and budget constraints.
        </p>
      </div>
      <div style={{ marginBottom: 20 }}>
        <SectionHeader title="Team" />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {CHARACTERS.map(c => (
            <div key={c.id} style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '8px 12px', ...cardStyle,
            }}>
              <Avatar src={c.avatar} name={c.name} color={c.color} size="sm" />
              <span style={{ fontSize: 12.5, color: 'rgba(255,255,255,0.65)', flex: 1 }}>{c.name}</span>
              <span style={{ fontSize: 11.5, color: 'rgba(255,255,255,0.28)' }}>{c.title}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════════
   BROWSER PANEL  (placeholder)
   ══════════════════════════════════════════════════════════════════════════════ */
function BrowserPanel() {
  const { startSession, setScreen } = useAppStore();
  const handleStart = () => { startSession(); setScreen('browser'); };
  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: '30px 36px' }}>
      <div style={{ maxWidth: 600 }}>
        <p style={{ fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.28)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 6 }}>
          Session 1 of 3 · Product Manager · Nexus Technologies
        </p>
        <h1 style={{ fontSize: 22, fontWeight: 600, color: '#fff', marginBottom: 12 }}>
          The Roadmap Reckoning
        </h1>
        <p style={{ fontSize: 13.5, color: 'rgba(255,255,255,0.55)', lineHeight: 1.65, marginBottom: 28 }}>
          You've inherited a contested product roadmap. Engineering says the timeline is unrealistic.
          Sales has made promises to a $2M client that aren't in scope. The CEO wants a unified
          strategy by Friday.
        </p>
        <button
          onClick={handleStart}
          style={{
            padding: '11px 28px', borderRadius: 10,
            background: '#fff', color: '#000',
            fontSize: 13.5, fontWeight: 600, fontFamily: 'var(--font-sans)',
            border: 'none', cursor: 'pointer',
          }}
        >
          Start Session 1 →
        </button>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════════
   DASHBOARD SCREEN — wires everything together
   ══════════════════════════════════════════════════════════════════════════════ */
const TAB_META: Record<string, { iconType: 'document' | 'globe'; search?: string; url?: string }> = {
  browser:   { iconType: 'document', search: 'Search' },
  meetings:  { iconType: 'globe',    url: 'weekly-standup.copanyname.io/uvw-xyz-abc' },
  drive:     { iconType: 'document', search: 'Search Drive' },
  assistant: { iconType: 'document', search: 'Search' },
  project:   { iconType: 'document', search: 'Search' },
};

export function DashboardScreen() {
  const { activeApp, setScreen, minimizeWindow } = useAppStore();
  const [maximized, setMaximized] = useState(false);
  const meta = TAB_META[activeApp] ?? TAB_META.browser;

  return (
    <div
      className="arc-bg"
      style={{
        minHeight: '100vh', background: 'var(--bg-desktop)',
        display: 'flex', flexDirection: 'column',
        padding: 12, position: 'relative', overflow: 'hidden',
      }}
    >
      <div style={{ position: 'relative', zIndex: 10, height: 'calc(100vh - 24px)' }}>
        <WindowChrome
          className="h-full"
          iconType={meta.iconType}
          searchPlaceholder={meta.search}
          urlValue={meta.url}
          onClose={() => setScreen('desktop')}
          onMinimize={() => minimizeWindow({ screen: 'dashboard', label: 'Dashboard', accentColor: '#f59e0b' })}
          onMaximize={() => setMaximized(v => !v)}
          style={{ height: '100%', display: 'flex', flexDirection: 'column' } as React.CSSProperties}
        >
          {/* Body: sidebar + content */}
          <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
            <Sidebar />
            <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
              {activeApp === 'meetings'  && <MeetingsPanel />}
              {activeApp === 'drive'     && <DrivePanel />}
              {activeApp === 'assistant' && <AssistantPanel />}
              {activeApp === 'project'   && <ProjectOverviewPanel />}
              {(activeApp === 'browser' || !activeApp) && <BrowserPanel />}
            </div>
          </div>
        </WindowChrome>
      </div>

      {/* Lightning bolt badge — always visible, bottom-left */}
      <LightningBadge />
    </div>
  );
}
