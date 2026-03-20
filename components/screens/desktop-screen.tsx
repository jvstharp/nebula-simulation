"use client";
import { useState } from "react";
import { useAppStore } from "@/lib/store";

/* ── Dock Icon SVGs (white-on-color — renders on 3D gradient backgrounds) ─── */

function BrowserDockIcon({ size = 26 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      style={{ filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.4))', flexShrink: 0 }}>
      <rect x="2" y="4" width="20" height="16" rx="3" stroke="rgba(255,255,255,0.92)" strokeWidth="1.4" fill="none" />
      <rect x="2" y="4" width="20" height="5" rx="3" fill="rgba(255,255,255,0.22)" />
      <circle cx="5.5" cy="6.5" r="1" fill="rgba(255,255,255,0.8)" />
      <circle cx="8.5" cy="6.5" r="1" fill="rgba(255,255,255,0.55)" />
      <rect x="10.5" y="5.5" width="9" height="2" rx="1" fill="rgba(255,255,255,0.32)" />
      <rect x="4" y="13" width="6" height="1.2" rx="0.6" fill="rgba(255,255,255,0.55)" />
      <rect x="4" y="16" width="4" height="1.2" rx="0.6" fill="rgba(255,255,255,0.32)" />
      <rect x="12" y="13" width="8" height="4.2" rx="1" fill="rgba(255,255,255,0.12)" stroke="rgba(255,255,255,0.32)" strokeWidth="0.6" />
    </svg>
  );
}

function VaultDockIcon({ size = 26 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      style={{ filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.4))', flexShrink: 0 }}>
      <ellipse cx="12" cy="6" rx="8" ry="2.5" fill="rgba(255,255,255,0.2)" stroke="rgba(255,255,255,0.9)" strokeWidth="1.3" />
      <path d="M4 6v12" stroke="rgba(255,255,255,0.9)" strokeWidth="1.3" />
      <path d="M20 6v12" stroke="rgba(255,255,255,0.9)" strokeWidth="1.3" />
      <ellipse cx="12" cy="18" rx="8" ry="2.5" fill="rgba(255,255,255,0.1)" stroke="rgba(255,255,255,0.9)" strokeWidth="1.3" />
      <ellipse cx="12" cy="12" rx="8" ry="2.5" stroke="rgba(255,255,255,0.38)" strokeWidth="0.8" strokeDasharray="2 2" />
      <rect x="9.5" y="10" width="5" height="4" rx="1.5" fill="rgba(255,255,255,0.22)" stroke="rgba(255,255,255,0.88)" strokeWidth="1" />
      <circle cx="12" cy="12" r="1" fill="rgba(255,255,255,0.95)" />
    </svg>
  );
}

function DiscoveryDockIcon({ size = 26 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      style={{ filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.4))', flexShrink: 0 }}>
      <circle cx="12" cy="12" r="9" stroke="rgba(255,255,255,0.88)" strokeWidth="1.3" fill="none" />
      <circle cx="12" cy="12" r="1.8" fill="rgba(255,255,255,0.95)" />
      <path d="M12 3.5L13.5 10H10.5L12 3.5Z" fill="rgba(255,255,255,0.95)" />
      <path d="M12 20.5L10.5 14H13.5L12 20.5Z" fill="rgba(255,255,255,0.38)" />
      <path d="M20.5 12L14 10.5V13.5L20.5 12Z" fill="rgba(255,255,255,0.38)" />
      <path d="M3.5 12L10 13.5V10.5L3.5 12Z" fill="rgba(255,255,255,0.38)" />
      <circle cx="12" cy="4.5" r="0.8" fill="rgba(255,255,255,0.88)" />
    </svg>
  );
}

function ProfileDockIcon({ size = 26 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      style={{ filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.4))', flexShrink: 0 }}>
      <circle cx="12" cy="8.5" r="4" stroke="rgba(255,255,255,0.92)" strokeWidth="1.3" fill="rgba(255,255,255,0.18)" />
      <path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8" stroke="rgba(255,255,255,0.92)" strokeWidth="1.3" strokeLinecap="round" fill="none" />
      <circle cx="17.5" cy="6.5" r="3" fill="rgba(0,0,0,0.3)" stroke="rgba(255,255,255,0.85)" strokeWidth="1" />
      <path d="M16.5 6.5l.8.8 1.6-1.6" stroke="rgba(255,255,255,0.95)" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ControlPanelDockIcon({ size = 26 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      style={{ filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.4))', flexShrink: 0 }}>
      <line x1="3" y1="7"  x2="21" y2="7"  stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="8"  cy="7"  r="2.5" fill="rgba(255,255,255,0.92)" />
      <line x1="3" y1="12" x2="21" y2="12" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="14" cy="12" r="2.5" fill="rgba(255,255,255,0.92)" />
      <line x1="3" y1="17" x2="21" y2="17" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="9"  cy="17" r="2.5" fill="rgba(255,255,255,0.92)" />
    </svg>
  );
}

function BellIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M7 1.5a4 4 0 014 4v2l1 2H2l1-2v-2a4 4 0 014-4z"
        stroke="rgba(255,255,255,0.7)" strokeWidth="1.1" fill="none" />
      <path d="M5.5 11a1.5 1.5 0 003 0" stroke="rgba(255,255,255,0.7)" strokeWidth="1.1" fill="none" />
    </svg>
  );
}

/* ── Dock items config ─────────────────────────────────────────────────────── */
const DOCK_ITEMS = [
  { id: 'browser',      label: 'Workspace',    base: '#147b58', lighter: '#22c48a', darker: '#0a4a37', icon: <BrowserDockIcon />,     screen: 'browser'      as const },
  { id: 'vault',        label: 'Vault',         base: '#0891b2', lighter: '#0fb8e2', darker: '#065f77', icon: <VaultDockIcon />,        screen: 'vault'        as const },
  { id: 'discovery',    label: 'Discovery',     base: '#65a30d', lighter: '#84cc16', darker: '#3d6006', icon: <DiscoveryDockIcon />,    screen: 'discovery'    as const },
  { id: 'profile',      label: 'Profile',       base: '#7c3aed', lighter: '#a855f7', darker: '#4c1d95', icon: <ProfileDockIcon />,      screen: 'profile'      as const },
  { id: 'controlpanel', label: 'Control Panel', base: '#d97706', lighter: '#f59e0b', darker: '#92400e', icon: <ControlPanelDockIcon />, screen: 'controlpanel' as const },
];

/* ── Desktop Screen ────────────────────────────────────────────────────────── */
export function DesktopScreen() {
  const { setScreen, minimizedWindows, restoreWindow, setControlPanelOpen } = useAppStore();
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const now = new Date();
  const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
  const dateStr = now.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' });

  /** macOS-style neighbour magnification */
  const getIconTransform = (i: number): string => {
    if (hoveredIdx === null) return 'scale(1) translateY(0px)';
    const dist = Math.abs(i - hoveredIdx);
    if (dist === 0) return 'scale(1.26) translateY(-10px)';
    if (dist === 1) return 'scale(1.13) translateY(-5px)';
    if (dist === 2) return 'scale(1.05) translateY(-2px)';
    return 'scale(1) translateY(0px)';
  };

  return (
    <div
      className="arc-bg"
      style={{
        minHeight: '100vh',
        background: 'var(--bg-desktop)',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* ── Status bar ─────────────────────────────────────────────── */}
      <div style={{
        position: 'absolute', top: 18, left: 18,
        display: 'flex', alignItems: 'center', gap: 10, zIndex: 10,
      }}>
        <div style={{
          background: 'rgba(0,0,0,0.75)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 20, padding: '6px 14px',
          fontSize: 13, fontWeight: 600,
          color: 'rgba(255,255,255,0.85)',
          fontVariantNumeric: 'tabular-nums',
          letterSpacing: '0.02em',
          display: 'flex', alignItems: 'center', gap: 10,
        }}>
          <span>{timeStr}</span>
          <span style={{ fontSize: 11, fontWeight: 400, color: 'rgba(255,255,255,0.45)' }}>{dateStr}</span>
          <BellIcon />
        </div>
      </div>

      {/* ── Dock ───────────────────────────────────────────────────── */}
      <div style={{
        position: 'absolute',
        bottom: 28,
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        alignItems: 'flex-end',
        gap: 8,
        padding: '10px 14px',
        /* Glassmorphism */
        background: 'rgba(255,255,255,0.07)',
        backdropFilter: 'blur(40px) saturate(180%)',
        WebkitBackdropFilter: 'blur(40px) saturate(180%)',
        border: '1px solid rgba(255,255,255,0.15)',
        borderRadius: 24,
        boxShadow: '0 8px 48px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.16), inset 0 -1px 0 rgba(0,0,0,0.22)',
        zIndex: 10,
      }}>

        {/* ── Static app icons ─────────────────────────────────────── */}
        {DOCK_ITEMS.map((item, i) => (
          <div key={item.id} className="dock-item-wrap">
            <button
              onClick={() => item.id === 'controlpanel' ? setControlPanelOpen(true) : setScreen(item.screen)}
              onMouseEnter={() => setHoveredIdx(i)}
              onMouseLeave={() => setHoveredIdx(null)}
              style={{
                width: 56, height: 56,
                borderRadius: 16,
                /* 3D gradient — light source top-left */
                background: `linear-gradient(145deg, ${item.lighter} 0%, ${item.base} 52%, ${item.darker} 100%)`,
                border: 'none',
                /* Inset bevel + color glow + depth shadow */
                boxShadow: `inset 0 1px 0 rgba(255,255,255,0.38), inset 0 -1px 0 rgba(0,0,0,0.28), 0 4px 18px ${item.base}70, 0 1px 4px rgba(0,0,0,0.65)`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', flexShrink: 0,
                position: 'relative', overflow: 'hidden',
                /* Managed by React state for neighbour magnification */
                transform: getIconTransform(i),
                transition: 'transform 200ms cubic-bezier(.34,1.56,.64,1), box-shadow 200ms',
              }}
            >
              {/* Gloss highlight — top half only, curved bottom edge */}
              <div style={{
                position: 'absolute', top: 0, left: 0, right: 0, height: '50%',
                background: 'linear-gradient(180deg, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0.04) 100%)',
                borderRadius: '16px 16px 50% 50%',
                pointerEvents: 'none',
              }} />
              {item.icon}
            </button>
            <div className="dock-tooltip">{item.label}</div>
          </div>
        ))}

        {/* ── Separator + minimized windows (macOS-style) ──────────── */}
        {minimizedWindows.length > 0 && (
          <>
            <div style={{
              width: 1, height: 36, background: 'rgba(255,255,255,0.14)',
              margin: '0 2px', borderRadius: 1, flexShrink: 0, alignSelf: 'center',
            }} />

            {minimizedWindows.map((w, j) => {
              const idx = DOCK_ITEMS.length + j;
              return (
                <div key={w.screen} className="dock-item-wrap dock-restore-bounce">
                  <button
                    onClick={() => restoreWindow(w.screen)}
                    onMouseEnter={() => setHoveredIdx(idx)}
                    onMouseLeave={() => setHoveredIdx(null)}
                    style={{
                      width: 56, height: 56, borderRadius: 16,
                      background: `linear-gradient(145deg, ${w.accentColor}55 0%, ${w.accentColor}28 100%)`,
                      border: `1px solid ${w.accentColor}44`,
                      boxShadow: `inset 0 1px 0 rgba(255,255,255,0.22), 0 3px 14px ${w.accentColor}36`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      cursor: 'pointer', position: 'relative', overflow: 'hidden', flexShrink: 0,
                      transform: getIconTransform(idx),
                      transition: 'transform 200ms cubic-bezier(.34,1.56,.64,1)',
                    }}
                  >
                    {/* Gloss */}
                    <div style={{
                      position: 'absolute', top: 0, left: 0, right: 0, height: '50%',
                      background: 'linear-gradient(180deg, rgba(255,255,255,0.15) 0%, transparent 100%)',
                      borderRadius: '16px 16px 50% 50%', pointerEvents: 'none',
                    }} />
                    {/* App initial as icon */}
                    <span style={{
                      fontSize: 22, fontWeight: 800, color: 'rgba(255,255,255,0.92)',
                      filter: 'drop-shadow(0 1px 3px rgba(0,0,0,0.55))',
                      position: 'relative', zIndex: 1, lineHeight: 1,
                    }}>
                      {w.label[0]}
                    </span>
                    {/* Running-app dot */}
                    <div style={{
                      position: 'absolute', bottom: 5, left: '50%',
                      transform: 'translateX(-50%)',
                      width: 4, height: 4, borderRadius: '50%',
                      background: w.accentColor,
                      boxShadow: `0 0 6px ${w.accentColor}`,
                    }} />
                  </button>
                  <div className="dock-tooltip">{w.label}</div>
                </div>
              );
            })}
          </>
        )}
      </div>
    </div>
  );
}
