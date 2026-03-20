"use client";
import { useRef, useState, useEffect } from "react";
import { useAppStore } from "@/lib/store";
import type { Screen } from "@/lib/types";

const MIN_W = 480;
const MIN_H = 320;

/* ── Traffic light button ────────────────────────────────────────────────────── */
function TrafficBtn({
  color, title, onClick, hoverIcon,
}: {
  color: string; title: string; onClick?: () => void; hoverIcon: React.ReactNode;
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onClick={onClick}
      title={title}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width: 12, height: 12, borderRadius: '50%', background: color,
        border: 'none', cursor: 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0, transition: 'filter 150ms',
        filter: hovered ? 'brightness(0.85)' : 'none',
      }}
    >
      <span style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        opacity: hovered ? 1 : 0, transition: 'opacity 120ms', pointerEvents: 'none',
      }}>
        {hoverIcon}
      </span>
    </button>
  );
}

const CLOSE_SVG = (
  <svg width="7" height="7" viewBox="0 0 7 7" fill="none">
    <path d="M1 1l5 5M6 1L1 6" stroke="rgba(0,0,0,0.5)" strokeWidth="1.4" strokeLinecap="round" />
  </svg>
);
const MIN_SVG = (
  <svg width="7" height="2" viewBox="0 0 7 2" fill="none">
    <path d="M0.5 1h6" stroke="rgba(0,0,0,0.5)" strokeWidth="1.4" strokeLinecap="round" />
  </svg>
);
const MAX_SVG = (
  <svg width="7" height="7" viewBox="0 0 7 7" fill="none">
    <path d="M1 6V1h5M1 6l5-5" stroke="rgba(0,0,0,0.5)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const RESTORE_SVG = (
  <svg width="7" height="7" viewBox="0 0 7 7" fill="none">
    <rect x="1" y="2.5" width="3.5" height="3.5" rx="0.5" stroke="rgba(0,0,0,0.5)" strokeWidth="1.1" />
    <path d="M2.5 2.5V1.5a.5.5 0 01.5-.5h3a.5.5 0 01.5.5v3a.5.5 0 01-.5.5H5.5" stroke="rgba(0,0,0,0.5)" strokeWidth="1.1" />
  </svg>
);

/* ── AppWindow props ─────────────────────────────────────────────────────────── */
export interface AppWindowProps {
  screenKey: Screen;
  url: string;
  urlAccent?: string;
  label: string;
  accentColor: string;
  maxWidth?: number;
  defaultHeight?: number;
  children: React.ReactNode;
}

/* ── Resize handle directions ────────────────────────────────────────────────── */
const HANDLES = ['n', 's', 'e', 'w', 'ne', 'nw', 'se', 'sw'] as const;

function handleStyle(dir: string): React.CSSProperties {
  const n = dir.includes('n'), s = dir.includes('s');
  const e = dir.includes('e'), w = dir.includes('w');
  const corner = (n || s) && (e || w);
  const sz = corner ? 14 : 6;
  const cursor = corner
    ? (dir === 'nw' || dir === 'se' ? 'nwse-resize' : 'nesw-resize')
    : (e || w ? 'ew-resize' : 'ns-resize');
  return {
    position: 'absolute', zIndex: 20, cursor,
    ...(n    ? { top: 0 }                    : {}),
    ...(s    ? { bottom: 0 }                 : {}),
    ...(e    ? { right: 0 }                  : {}),
    ...(w    ? { left: 0 }                   : {}),
    ...(!n && !s ? { top: sz, bottom: sz }   : {}),
    ...(!e && !w ? { left: sz, right: sz }   : {}),
    width:  corner || e || w ? sz : undefined,
    height: corner || n || s ? sz : undefined,
  };
}

/* ── AppWindow ───────────────────────────────────────────────────────────────── */
export function AppWindow({
  screenKey, url, urlAccent = 'rgba(255,255,255,0.3)',
  label, accentColor, maxWidth = 1280, defaultHeight, children,
}: AppWindowProps) {
  const { setScreen, minimizeWindow } = useAppStore();
  const [maximized, setMaximized] = useState(false);
  const [isMinimizing, setIsMinimizing] = useState(false);
  const [justRestored, setJustRestored] = useState(true);
  type Pos = { x: number; y: number; w: number; h: number };
  const [pos, setPos] = useState<Pos | null>(null);
  const posRef = useRef<Pos | null>(null);
  posRef.current = pos;

  /* Clear restore animation after it plays */
  useEffect(() => {
    const t = setTimeout(() => setJustRestored(false), 320);
    return () => clearTimeout(t);
  }, []);

  /* Set initial centered position on mount (client-only) */
  useEffect(() => {
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const w = Math.min(maxWidth, vw - 48);
    const h = defaultHeight
      ? Math.min(defaultHeight, vh - 48)
      : Math.min(Math.max(600, vh - 80), vh - 48);
    setPos({
      x: Math.max(0, Math.round((vw - w) / 2)),
      y: Math.max(0, Math.round((vh - h) / 2)),
      w, h,
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleClose    = () => setScreen('desktop');
  const handleMinimize = () => {
    setIsMinimizing(true);
    setTimeout(() => minimizeWindow({ screen: screenKey, label, accentColor }), 280);
  };
  const handleMaximize = () => setMaximized(v => !v);

  /* ── Drag ── */
  const onTitlebarDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('button')) return;
    if (maximized) return;
    const p = posRef.current;
    if (!p) return;
    const sx = e.clientX, sy = e.clientY, px = p.x, py = p.y;
    const move = (ev: MouseEvent) => {
      setPos(prev => prev
        ? { ...prev, x: Math.max(0, px + ev.clientX - sx), y: Math.max(0, py + ev.clientY - sy) }
        : prev);
    };
    const up = () => {
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mouseup', up);
    };
    window.addEventListener('mousemove', move);
    window.addEventListener('mouseup', up);
    e.preventDefault();
  };

  /* ── Resize ── */
  const onResizeDown = (dir: string) => (e: React.MouseEvent) => {
    e.stopPropagation();
    if (maximized) return;
    const p = posRef.current;
    if (!p) return;
    const sx = e.clientX, sy = e.clientY;
    const { x: ox, y: oy, w: ow, h: oh } = p;
    const move = (ev: MouseEvent) => {
      const dx = ev.clientX - sx, dy = ev.clientY - sy;
      setPos(() => {
        let x = ox, y = oy, w = ow, h = oh;
        if (dir.includes('e')) w = Math.max(MIN_W, ow + dx);
        if (dir.includes('s')) h = Math.max(MIN_H, oh + dy);
        if (dir.includes('w')) { const nw = Math.max(MIN_W, ow - dx); x = ox + ow - nw; w = nw; }
        if (dir.includes('n')) { const nh = Math.max(MIN_H, oh - dy); y = oy + oh - nh; h = nh; }
        return { x, y, w, h };
      });
    };
    const up = () => {
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mouseup', up);
    };
    window.addEventListener('mousemove', move);
    window.addEventListener('mouseup', up);
    e.preventDefault();
  };

  /* ── Window style ── */
  const windowStyle: React.CSSProperties = maximized
    ? {
        position: 'fixed', inset: 0, zIndex: 100,
        background: 'var(--bg-window)',
        display: 'flex', flexDirection: 'column', overflow: 'hidden',
      }
    : pos
    ? {
        position: 'fixed',
        left: pos.x, top: pos.y, width: pos.w, height: pos.h,
        zIndex: 100,
        background: 'var(--bg-window)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 14,
        boxShadow: '0 24px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.04)',
        display: 'flex', flexDirection: 'column', overflow: 'hidden',
        userSelect: 'none',
      }
    : {
        /* Pre-hydration fallback — centered via transform */
        position: 'fixed',
        left: '50%', top: '50%', transform: 'translate(-50%,-50%)',
        width: Math.min(maxWidth, 1200), height: '85vh',
        zIndex: 100,
        background: 'var(--bg-window)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 14,
        boxShadow: '0 24px 80px rgba(0,0,0,0.7)',
        display: 'flex', flexDirection: 'column', overflow: 'hidden',
      };

  const animClass = isMinimizing ? 'window-minimizing' : justRestored ? 'window-restoring' : '';

  return (
    <div style={windowStyle} className={animClass || undefined}>
      {/* Resize handles */}
      {!maximized && pos && HANDLES.map(dir => (
        <div key={dir} style={handleStyle(dir)} onMouseDown={onResizeDown(dir)} />
      ))}

      {/* Titlebar */}
      <div
        onMouseDown={onTitlebarDown}
        style={{
          background: 'var(--bg-titlebar)',
          borderBottom: '1px solid var(--border-subtle)',
          height: 44, flexShrink: 0,
          display: 'flex', alignItems: 'center', padding: '0 14px', gap: 10,
          cursor: maximized ? 'default' : 'grab',
        }}
      >
        {/* Traffic lights */}
        <div
          style={{ display: 'flex', gap: 7, alignItems: 'center' }}
          onMouseEnter={e => e.currentTarget.querySelectorAll('span').forEach(s => (s.style.opacity = '1'))}
          onMouseLeave={e => e.currentTarget.querySelectorAll('span').forEach(s => (s.style.opacity = '0'))}
        >
          <TrafficBtn color="#ff5f57" title="Close"    onClick={handleClose}    hoverIcon={CLOSE_SVG} />
          <TrafficBtn color="#febc2e" title="Minimise" onClick={handleMinimize} hoverIcon={MIN_SVG} />
          <TrafficBtn color="#28c840" title={maximized ? 'Restore' : 'Maximise'} onClick={handleMaximize} hoverIcon={maximized ? RESTORE_SVG : MAX_SVG} />
        </div>

        {/* URL bar */}
        <div style={{
          flex: 1, display: 'flex', alignItems: 'center', gap: 8,
          background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.055)',
          borderRadius: 8, height: 28, padding: '0 10px',
        }}>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ flexShrink: 0 }}>
            <circle cx="6" cy="6" r="4.5" stroke={urlAccent} strokeWidth="1" />
            <ellipse cx="6" cy="6" rx="1.8" ry="4.5" stroke={urlAccent} strokeWidth="0.8" />
            <path d="M1.5 6h9" stroke={urlAccent} strokeWidth="0.7" />
          </svg>
          <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {url}
          </span>
        </div>

        {/* Avatar — click to open Profile */}
        <div
          onClick={() => setScreen('profile')}
          title="Open Profile"
          style={{
            width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
            background: 'linear-gradient(145deg, #c97b50, #7b3a1e)',
            border: '1.5px solid rgba(255,255,255,0.18)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer',
            transition: 'border-color 150ms, box-shadow 150ms',
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(20,123,88,0.7)';
            (e.currentTarget as HTMLDivElement).style.boxShadow = '0 0 0 2px rgba(20,123,88,0.25)';
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(255,255,255,0.18)';
            (e.currentTarget as HTMLDivElement).style.boxShadow = 'none';
          }}
        >
          <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
            <ellipse cx="10" cy="8"    rx="4"   ry="4.5" fill="rgba(255,255,255,0.85)" />
            <ellipse cx="10" cy="18"   rx="6.5" ry="5"   fill="rgba(255,255,255,0.85)" />
            <ellipse cx="10" cy="5.5"  rx="4.5" ry="3"   fill="#2a1a0e" />
            <ellipse cx="5.5"  cy="8.5" rx="1.2" ry="3.5" fill="#2a1a0e" />
            <ellipse cx="14.5" cy="8.5" rx="1.2" ry="3.5" fill="#2a1a0e" />
          </svg>
        </div>
      </div>

      {/* Content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', userSelect: 'text' }}>
        {children}
      </div>
    </div>
  );
}
