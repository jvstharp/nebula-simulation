"use client";
import { useState } from "react";
import { useAppStore } from "@/lib/store";
import type { OKR } from "@/lib/types";

const STATUS_CONFIG: Record<OKR['status'], { label: string; color: string }> = {
  pending:     { label: 'Pending',     color: '#6b7280' },
  in_progress: { label: 'In Progress', color: '#f59e0b' },
  complete:    { label: 'Complete',    color: '#22c55e' },
  missed:      { label: 'Missed',      color: '#ef4444' },
};

function OKRCard({ okr }: { okr: OKR }) {
  const { updateOKR } = useAppStore();
  const [dragging, setDragging] = useState(false);
  const cfg = STATUS_CONFIG[okr.status];
  const isDone = okr.status === 'complete';

  const handleSlider = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateOKR(okr.id, Number(e.target.value));
  };

  return (
    <div style={{
      background: '#18181c',
      border: `1px solid ${isDone ? 'rgba(34,197,94,0.2)' : 'rgba(255,255,255,0.07)'}`,
      borderRadius: 10, padding: '12px 14px',
      transition: 'border-color 300ms',
    }}>
      {/* Title + status badge */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10, marginBottom: 12 }}>
        <p style={{
          fontSize: 12.5,
          color: isDone ? 'rgba(175,163,159,0.4)' : '#efefef',
          lineHeight: 1.5, flex: 1, margin: 0,
          textDecoration: isDone ? 'line-through' : 'none',
        }}>
          {okr.title}
        </p>
        <span style={{
          fontSize: 9.5, fontWeight: 700, flexShrink: 0,
          color: cfg.color, background: `${cfg.color}18`,
          border: `1px solid ${cfg.color}33`,
          borderRadius: 5, padding: '2px 7px',
        }}>
          {cfg.label}
        </span>
      </div>

      {/* Progress bar + slider */}
      <div style={{ marginBottom: isDone ? 0 : 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
          <div style={{ flex: 1, height: 5, background: 'rgba(255,255,255,0.06)', borderRadius: 3, overflow: 'hidden' }}>
            <div style={{
              width: `${okr.progress}%`, height: '100%',
              background: cfg.color, borderRadius: 3,
              transition: dragging ? 'none' : 'width 400ms ease',
            }} />
          </div>
          <span style={{ fontSize: 11, fontWeight: 700, color: cfg.color, flexShrink: 0, minWidth: 30, textAlign: 'right' }}>
            {okr.progress}%
          </span>
        </div>

        {/* Slider (hidden when complete or missed) */}
        {okr.status !== 'complete' && okr.status !== 'missed' && (
          <div style={{ position: 'relative', height: 16, display: 'flex', alignItems: 'center' }}>
            <input
              type="range" min={0} max={100} step={5}
              value={okr.progress}
              onMouseDown={() => setDragging(true)}
              onMouseUp={() => setDragging(false)}
              onTouchStart={() => setDragging(true)}
              onTouchEnd={() => setDragging(false)}
              onChange={handleSlider}
              style={{
                width: '100%', margin: 0, cursor: 'pointer', appearance: 'none',
                background: 'transparent', outline: 'none',
              }}
            />
          </div>
        )}
      </div>

      {/* Quick-action buttons */}
      {okr.status !== 'complete' && okr.status !== 'missed' && (
        <div style={{ display: 'flex', gap: 6, marginTop: 4 }}>
          {okr.status !== 'in_progress' && (
            <button
              onClick={() => updateOKR(okr.id, Math.max(okr.progress, 10))}
              style={{
                fontSize: 10, padding: '3px 9px', borderRadius: 5, cursor: 'pointer', fontWeight: 600,
                background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.25)',
                color: '#fbbf24',
              }}
            >
              Start
            </button>
          )}
          <button
            onClick={() => updateOKR(okr.id, 100)}
            style={{
              fontSize: 10, padding: '3px 9px', borderRadius: 5, cursor: 'pointer', fontWeight: 600,
              background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.25)',
              color: '#4ade80',
            }}
          >
            Mark Complete ✓
          </button>
        </div>
      )}

      {isDone && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 2 }}>
          <div style={{ width: 14, height: 14, borderRadius: '50%', background: 'rgba(34,197,94,0.15)', border: '1px solid rgba(34,197,94,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 8, color: '#4ade80' }}>✓</div>
          <span style={{ fontSize: 10.5, color: 'rgba(34,197,94,0.7)' }}>Completed</span>
          <button
            onClick={() => updateOKR(okr.id, 70)}
            style={{
              marginLeft: 'auto', fontSize: 9.5, padding: '2px 7px', borderRadius: 4, cursor: 'pointer',
              background: 'transparent', border: '1px solid rgba(255,255,255,0.08)',
              color: 'rgba(175,163,159,0.35)',
            }}
          >
            Undo
          </button>
        </div>
      )}
    </div>
  );
}

export function OKRPanel() {
  const { session, completeSession, setScreen } = useAppStore();
  if (!session) return null;

  const okrs = session.okrs;
  const complete = okrs.filter(o => o.status === 'complete').length;
  const overallProgress = Math.round(okrs.reduce((s, o) => s + o.progress, 0) / okrs.length);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflowY: 'auto' }}>
      {/* Overall progress */}
      <div style={{ padding: '14px 16px', borderBottom: '1px solid rgba(255,255,255,0.05)', flexShrink: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <span style={{ fontSize: 11, color: 'rgba(175,163,159,0.5)' }}>Session Progress</span>
          <span style={{ fontSize: 11, fontWeight: 600, color: '#afa39f' }}>{complete} / {okrs.length} complete</span>
        </div>
        <div style={{ height: 6, background: 'rgba(255,255,255,0.06)', borderRadius: 3, overflow: 'hidden' }}>
          <div style={{
            width: `${overallProgress}%`, height: '100%',
            background: overallProgress >= 100 ? '#22c55e' : '#147b58',
            borderRadius: 3, transition: 'width 500ms ease',
          }} />
        </div>
        <div style={{ fontSize: 10, color: 'rgba(175,163,159,0.35)', marginTop: 5 }}>
          Drag sliders or use buttons to track your progress
        </div>
      </div>

      {/* OKR list */}
      <div style={{ flex: 1, padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: 'rgba(175,163,159,0.5)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 2 }}>
          Session Objectives
        </div>
        {okrs.map(okr => <OKRCard key={okr.id} okr={okr} />)}
      </div>

      {/* Session info + complete button */}
      <div style={{ padding: '12px 16px', borderTop: '1px solid rgba(255,255,255,0.05)', flexShrink: 0 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 12 }}>
          {[
            { label: 'Session', value: `${session.sessionNumber} of 3` },
            { label: 'Credits',  value: `⚡ ${session.credits}`, accent: '#DCC377' },
            { label: 'Score',    value: session.compositeScore > 0 ? String(session.compositeScore) : '—' },
            { label: 'Status',   value: session.status === 'paused' ? '⏸ Paused' : session.status === 'completed' ? '✓ Done' : '● Active', accent: session.status === 'paused' ? '#f59e0b' : session.status === 'completed' ? '#22c55e' : '#34d399' },
          ].map(item => (
            <div key={item.label} style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 8, padding: '8px 10px', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div style={{ fontSize: 9.5, color: 'rgba(175,163,159,0.45)', marginBottom: 3 }}>{item.label}</div>
              <div style={{ fontSize: 12.5, fontWeight: 600, color: (item as any).accent ?? '#efefef' }}>{item.value}</div>
            </div>
          ))}
        </div>

        {session.status === 'active' && (
          <button
            onClick={() => { completeSession(); setScreen('replay'); }}
            style={{
              width: '100%', padding: '9px', borderRadius: 10, cursor: 'pointer',
              background: 'rgba(20,123,88,0.15)',
              border: '1px solid rgba(20,123,88,0.35)', fontSize: 12.5, fontWeight: 700,
              color: '#34d399',
            }}
          >
            End Session → View Results
          </button>
        )}

        {session.status === 'completed' && (
          <button
            onClick={() => setScreen('replay')}
            style={{
              width: '100%', padding: '9px', borderRadius: 10, cursor: 'pointer',
              background: 'rgba(34,197,94,0.12)', border: '1px solid rgba(34,197,94,0.3)',
              fontSize: 12.5, fontWeight: 700, color: '#4ade80',
            }}
          >
            View Session Results →
          </button>
        )}
      </div>
    </div>
  );
}
