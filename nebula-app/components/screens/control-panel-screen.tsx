"use client";
import { useState } from "react";
import { useAppStore } from "@/lib/store";
import { cardStyle } from "@/components/layout/discovery-ui";

/* ── Helpers ────────────────────────────────────────────────────────────────── */
function CPToggle({ on, onToggle, color = '#22c55e' }: { on: boolean; onToggle: () => void; color?: string }) {
  return (
    <button
      onClick={onToggle}
      style={{
        width: 42, height: 24, borderRadius: 12, position: 'relative',
        background: on ? color : 'rgba(255,255,255,0.1)',
        border: `1px solid ${on ? color : 'rgba(255,255,255,0.15)'}`,
        cursor: 'pointer', transition: 'background 200ms, border-color 200ms',
        flexShrink: 0,
      }}
    >
      <div style={{
        position: 'absolute', top: 3, left: on ? 21 : 3,
        width: 16, height: 16, borderRadius: '50%',
        background: on ? '#fff' : 'rgba(255,255,255,0.4)',
        transition: 'left 200ms',
        boxShadow: on ? '0 1px 4px rgba(0,0,0,0.3)' : 'none',
      }} />
    </button>
  );
}

function CPSlider({ value, onChange, color = '#60a5fa', min = 0, max = 100 }: {
  value: number; onChange: (v: number) => void; color?: string; min?: number; max?: number;
}) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div style={{ position: 'relative', height: 20, display: 'flex', alignItems: 'center' }}>
      <div style={{
        flex: 1, height: 4, background: 'rgba(255,255,255,0.08)',
        borderRadius: 2, position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', left: 0, top: 0, height: '100%',
          width: `${pct}%`, background: color, borderRadius: 2,
        }} />
      </div>
      <input
        type="range" min={min} max={max} value={value}
        onChange={e => onChange(Number(e.target.value))}
        style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer', width: '100%', margin: 0 }}
      />
      <div style={{
        position: 'absolute', left: `calc(${pct}% - 8px)`,
        width: 16, height: 16, borderRadius: '50%',
        background: color, border: '2px solid rgba(0,0,0,0.4)',
        boxShadow: `0 0 8px ${color}66`, pointerEvents: 'none',
      }} />
    </div>
  );
}

function CPSection({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div style={{
      background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.06)',
      borderRadius: 10, overflow: 'hidden',
    }}>
      <div style={{
        padding: '10px 14px', borderBottom: '1px solid rgba(255,255,255,0.055)',
        display: 'flex', alignItems: 'center', gap: 8,
        background: 'rgba(255,255,255,0.02)',
      }}>
        <span style={{ color: 'rgba(255,255,255,0.4)', display: 'flex' }}>{icon}</span>
        <span style={{ fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.9)' }}>{title}</span>
      </div>
      <div style={{ padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        {children}
      </div>
    </div>
  );
}

function CPRow({ label, sublabel, right }: { label: string; sublabel?: string; right: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
      <div>
        <div style={{ fontSize: 12.5, color: 'rgba(255,255,255,0.75)', fontWeight: 500 }}>{label}</div>
        {sublabel && <div style={{ fontSize: 10.5, color: 'rgba(255,255,255,0.35)', marginTop: 1 }}>{sublabel}</div>}
      </div>
      {right}
    </div>
  );
}

/* ── Icons ──────────────────────────────────────────────────────────────────── */
function MicIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
      <rect x="5" y="1" width="6" height="9" rx="3" stroke="currentColor" strokeWidth="1.2" />
      <path d="M2.5 8a5.5 5.5 0 0011 0" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M8 13.5v2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}
function HeadphoneIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
      <path d="M2 9V7.5a6 6 0 0112 0V9" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      <rect x="1" y="9" width="3.5" height="5" rx="1.75" stroke="currentColor" strokeWidth="1.2" />
      <rect x="11.5" y="9" width="3.5" height="5" rx="1.75" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}
function EyeIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
      <path d="M1 8s2.5-5 7-5 7 5 7 5-2.5 5-7 5-7-5-7-5z" stroke="currentColor" strokeWidth="1.2" fill="none" />
      <circle cx="8" cy="8" r="2.5" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}
function ClockIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.2" />
      <path d="M8 5v3.5l2.5 2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function NetworkIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.2" fill="none" />
      <ellipse cx="8" cy="8" rx="2.5" ry="6.5" stroke="currentColor" strokeWidth="1.2" fill="none" />
      <path d="M1.5 8h13M1.5 5.5h13M1.5 10.5h13" stroke="currentColor" strokeWidth="0.9" />
    </svg>
  );
}

/* ── Tab content ────────────────────────────────────────────────────────────── */
function AudioTab() {
  const [micOn, setMicOn] = useState(true);
  const [micVolume, setMicVolume] = useState(80);
  const [noiseCancel, setNoiseCancel] = useState(true);
  const [selectedInput, setSelectedInput] = useState('MacBook Pro Microphone');
  const [headphoneVolume, setHeadphoneVolume] = useState(65);
  const [notifPing, setNotifPing] = useState(true);
  const [ambientSound, setAmbientSound] = useState(true);
  const [ambientVolume, setAmbientVolume] = useState(40);
  const [selectedOutput, setSelectedOutput] = useState('AirPods Pro');

  const selectStyle: React.CSSProperties = {
    background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)',
    borderRadius: 7, padding: '4px 8px', fontSize: 11.5, color: 'rgba(255,255,255,0.65)',
    cursor: 'pointer', outline: 'none',
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <CPSection title="Microphone" icon={<MicIcon />}>
        <CPRow label="Microphone" sublabel="Voice input for meetings" right={<CPToggle on={micOn} onToggle={() => setMicOn(v => !v)} color="#22c55e" />} />
        <CPRow label="Input device" right={
          <select value={selectedInput} onChange={e => setSelectedInput(e.target.value)} style={selectStyle}>
            <option>MacBook Pro Microphone</option>
            <option>AirPods Pro</option>
            <option>External USB Mic</option>
          </select>
        } />
        <div>
          <div style={{ fontSize: 11.5, color: 'rgba(255,255,255,0.45)', marginBottom: 6 }}>
            Input volume — <span style={{ color: '#60a5fa', fontWeight: 700 }}>{micVolume}%</span>
          </div>
          <CPSlider value={micVolume} onChange={setMicVolume} color="#60a5fa" />
        </div>
        <CPRow label="Noise cancellation" sublabel="Reduces background noise" right={<CPToggle on={noiseCancel} onToggle={() => setNoiseCancel(v => !v)} color="#60a5fa" />} />
      </CPSection>

      <CPSection title="Audio Output" icon={<HeadphoneIcon />}>
        <CPRow label="Output device" right={
          <select value={selectedOutput} onChange={e => setSelectedOutput(e.target.value)} style={selectStyle}>
            <option>AirPods Pro</option>
            <option>MacBook Pro Speakers</option>
            <option>External Monitor</option>
          </select>
        } />
        <div>
          <div style={{ fontSize: 11.5, color: 'rgba(255,255,255,0.45)', marginBottom: 6 }}>
            Output volume — <span style={{ color: '#a78bfa', fontWeight: 700 }}>{headphoneVolume}%</span>
          </div>
          <CPSlider value={headphoneVolume} onChange={setHeadphoneVolume} color="#a78bfa" />
        </div>
        <CPRow label="Notification pings" sublabel="Sound on new messages" right={<CPToggle on={notifPing} onToggle={() => setNotifPing(v => !v)} color="#a78bfa" />} />
        <CPRow label="Ambient soundscape" sublabel="Office atmosphere during sessions" right={<CPToggle on={ambientSound} onToggle={() => setAmbientSound(v => !v)} color="#a78bfa" />} />
        {ambientSound && (
          <div>
            <div style={{ fontSize: 11.5, color: 'rgba(255,255,255,0.45)', marginBottom: 6 }}>
              Ambient volume — <span style={{ color: '#a78bfa', fontWeight: 700 }}>{ambientVolume}%</span>
            </div>
            <CPSlider value={ambientVolume} onChange={setAmbientVolume} color="#a78bfa" />
          </div>
        )}
      </CPSection>
    </div>
  );
}

function DisplayTab() {
  const { accessibilityPrefs, setAccessibilityPrefs } = useAppStore();
  const [chaosEffects, setChaosEffects] = useState(true);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <CPSection title="Display & Effects" icon={<EyeIcon />}>
        <CPRow
          label="Chaos visual effects"
          sublabel="Screen distortion during high-chaos events"
          right={<CPToggle on={chaosEffects} onToggle={() => setChaosEffects(v => !v)} color="#f87171" />}
        />
        <CPRow
          label="Reduce visual effects"
          sublabel="Disables animations (accessibility)"
          right={
            <CPToggle
              on={accessibilityPrefs.reduceVisualEffects}
              onToggle={() => setAccessibilityPrefs({ reduceVisualEffects: !accessibilityPrefs.reduceVisualEffects })}
              color="#fb923c"
            />
          }
        />
        <CPRow
          label="Mute all sounds"
          sublabel="Silences all audio output"
          right={
            <CPToggle
              on={accessibilityPrefs.muteSounds}
              onToggle={() => setAccessibilityPrefs({ muteSounds: !accessibilityPrefs.muteSounds })}
              color="#fb923c"
            />
          }
        />
      </CPSection>
    </div>
  );
}

function SessionTab() {
  const { session } = useAppStore();
  const [difficulty, setDifficulty] = useState<'standard' | 'hard'>('standard');
  const [autoSave, setAutoSave] = useState(true);

  const elapsedStr = session
    ? `${Math.floor(session.elapsedSeconds / 60)}m ${session.elapsedSeconds % 60}s`
    : '47m 12s';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <CPSection title="Session Status" icon={<ClockIcon />}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
          {[
            { label: 'Scenario', value: 'Roadmap Reckoning', color: '#fbbf24' },
            { label: 'Session', value: 'Session 3 of 3', color: '#60a5fa' },
            { label: 'Elapsed', value: elapsedStr, color: '#34d399' },
          ].map(item => (
            <div key={item.label} style={{ padding: '8px 10px', ...cardStyle }}>
              <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.35)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 4 }}>
                {item.label}
              </div>
              <div style={{ fontSize: 12, fontWeight: 700, color: item.color }}>{item.value}</div>
            </div>
          ))}
        </div>
        <CPRow
          label="Difficulty"
          sublabel="Affects chaos frequency and reactivity"
          right={
            <div style={{ display: 'flex', gap: 6 }}>
              {(['standard', 'hard'] as const).map(d => (
                <button key={d} onClick={() => setDifficulty(d)} style={{
                  padding: '4px 10px', borderRadius: 7, fontSize: 11, fontWeight: 600,
                  background: difficulty === d ? 'rgba(251,191,36,0.15)' : 'rgba(255,255,255,0.05)',
                  border: difficulty === d ? '1px solid rgba(251,191,36,0.35)' : '1px solid rgba(255,255,255,0.1)',
                  color: difficulty === d ? '#fbbf24' : 'rgba(255,255,255,0.4)',
                  cursor: 'pointer', textTransform: 'capitalize',
                }}>
                  {d}
                </button>
              ))}
            </div>
          }
        />
        <CPRow label="Auto-save progress" sublabel="Saves every 60 seconds" right={<CPToggle on={autoSave} onToggle={() => setAutoSave(v => !v)} color="#34d399" />} />
      </CPSection>

      <CPSection title="Connection" icon={<NetworkIcon />}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
          {[
            { label: 'Latency', value: '14 ms' },
            { label: 'Signal', value: 'Excellent' },
            { label: 'Server', value: 'EU-West-1' },
          ].map(item => (
            <div key={item.label} style={{ padding: '8px 10px', ...cardStyle, display: 'flex', flexDirection: 'column', gap: 4 }}>
              <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.35)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em' }}>
                {item.label}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#22c55e', flexShrink: 0 }} />
                <span style={{ fontSize: 11.5, fontWeight: 700, color: '#22c55e' }}>{item.value}</span>
              </div>
            </div>
          ))}
        </div>
      </CPSection>
    </div>
  );
}

/* ── Control Panel Popover ────────────────────────────────────────────────── */
type CPTab = 'audio' | 'display' | 'session';

export function ControlPanelPopover() {
  const { controlPanelOpen, setControlPanelOpen } = useAppStore();
  const [tab, setTab] = useState<CPTab>('audio');

  if (!controlPanelOpen) return null;

  const CP_TABS: { id: CPTab; label: string }[] = [
    { id: 'audio',   label: 'Audio' },
    { id: 'display', label: 'Display' },
    { id: 'session', label: 'Session' },
  ];

  return (
    <>
      {/* Backdrop — click outside to close */}
      <div
        onClick={() => setControlPanelOpen(false)}
        style={{ position: 'fixed', inset: 0, zIndex: 1999 }}
      />

      {/* Popover panel */}
      <div style={{
        position: 'fixed', top: 52, right: 16, zIndex: 2000,
        width: 360, maxHeight: '80vh',
        background: 'rgba(18,18,20,0.94)',
        backdropFilter: 'blur(24px) saturate(180%)',
        WebkitBackdropFilter: 'blur(24px) saturate(180%)',
        border: '1px solid rgba(255,255,255,0.10)',
        borderRadius: 18,
        boxShadow: '0 24px 64px rgba(0,0,0,0.65), inset 0 1px 0 rgba(255,255,255,0.06)',
        overflow: 'hidden',
        display: 'flex', flexDirection: 'column',
      }}>
        {/* Header */}
        <div style={{
          padding: '14px 16px 0',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          flexShrink: 0,
        }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: 'rgba(255,255,255,0.9)' }}>Control Panel</span>
          <button
            onClick={() => setControlPanelOpen(false)}
            style={{
              width: 22, height: 22, borderRadius: '50%',
              background: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.1)',
              color: 'rgba(255,255,255,0.5)', fontSize: 13, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              lineHeight: 1,
            }}
          >
            ×
          </button>
        </div>

        {/* Tab bar */}
        <div style={{
          display: 'flex', gap: 0, padding: '10px 16px 0',
          borderBottom: '1px solid rgba(255,255,255,0.06)', flexShrink: 0,
        }}>
          {CP_TABS.map(t => {
            const isActive = tab === t.id;
            return (
              <button key={t.id} onClick={() => setTab(t.id)} style={{
                padding: '8px 14px', fontSize: 12, fontWeight: isActive ? 600 : 400,
                color: isActive ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.4)',
                background: 'transparent', cursor: 'pointer',
                borderTop: 'none', borderLeft: 'none', borderRight: 'none',
                borderBottom: isActive ? '2px solid #fbbf24' : '2px solid transparent',
                fontFamily: 'var(--font-sans)', transition: 'color 150ms',
              }}
                onMouseEnter={e => { if (!isActive) e.currentTarget.style.color = 'rgba(255,255,255,0.7)'; }}
                onMouseLeave={e => { if (!isActive) e.currentTarget.style.color = 'rgba(255,255,255,0.4)'; }}
              >
                {t.label}
              </button>
            );
          })}
        </div>

        {/* Tab content */}
        <div style={{ overflowY: 'auto', padding: '14px 16px 18px', flex: 1 }}>
          {tab === 'audio'   && <AudioTab />}
          {tab === 'display' && <DisplayTab />}
          {tab === 'session' && <SessionTab />}
        </div>
      </div>
    </>
  );
}
