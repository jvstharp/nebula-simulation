"use client";
import { useAppStore } from "@/lib/store";

/* ── Dock Icon SVGs ─────────────────────────────────────────────────────────── */

/** Browser — stylised window frame with an address bar line */
function BrowserDockIcon({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <rect x="2" y="4" width="20" height="16" rx="3" stroke="#147b58" strokeWidth="1.4" fill="none" />
      <rect x="2" y="4" width="20" height="5" rx="3" fill="rgba(20,123,88,0.15)" />
      <circle cx="5.5" cy="6.5" r="1" fill="#147b58" opacity="0.7" />
      <circle cx="8.5" cy="6.5" r="1" fill="#147b58" opacity="0.5" />
      <rect x="10.5" y="5.5" width="9" height="2" rx="1" fill="rgba(20,123,88,0.3)" />
      <rect x="4" y="13" width="6" height="1.2" rx="0.6" fill="rgba(20,123,88,0.4)" />
      <rect x="4" y="16" width="4" height="1.2" rx="0.6" fill="rgba(20,123,88,0.25)" />
      <rect x="12" y="13" width="8" height="4.2" rx="1" fill="rgba(20,123,88,0.12)" stroke="rgba(20,123,88,0.25)" strokeWidth="0.6" />
    </svg>
  );
}

/** Vault — cylinder database with lock overlay */
function VaultDockIcon({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <ellipse cx="12" cy="6" rx="8" ry="2.5" fill="rgba(45,212,191,0.18)" stroke="#2dd4bf" strokeWidth="1.3" />
      <path d="M4 6v12" stroke="#2dd4bf" strokeWidth="1.3" />
      <path d="M20 6v12" stroke="#2dd4bf" strokeWidth="1.3" />
      <ellipse cx="12" cy="18" rx="8" ry="2.5" fill="rgba(45,212,191,0.10)" stroke="#2dd4bf" strokeWidth="1.3" />
      <ellipse cx="12" cy="12" rx="8" ry="2.5" stroke="rgba(45,212,191,0.35)" strokeWidth="0.8" strokeDasharray="2 2" />
      <rect x="9.5" y="10" width="5" height="4" rx="1.5" fill="rgba(45,212,191,0.2)" stroke="#2dd4bf" strokeWidth="1" />
      <circle cx="12" cy="12" r="1" fill="#2dd4bf" />
    </svg>
  );
}

/** Discovery — compass rose with cardinal points */
function DiscoveryDockIcon({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9" stroke="#4ade80" strokeWidth="1.3" fill="none" />
      <circle cx="12" cy="12" r="1.8" fill="#4ade80" />
      {/* N arrow (filled) */}
      <path d="M12 3.5L13.5 10H10.5L12 3.5Z" fill="#4ade80" />
      {/* S arrow (outline) */}
      <path d="M12 20.5L10.5 14H13.5L12 20.5Z" fill="rgba(74,222,128,0.35)" />
      {/* E arrow */}
      <path d="M20.5 12L14 10.5V13.5L20.5 12Z" fill="rgba(74,222,128,0.35)" />
      {/* W arrow */}
      <path d="M3.5 12L10 13.5V10.5L3.5 12Z" fill="rgba(74,222,128,0.35)" />
      <circle cx="12" cy="4.5" r="0.8" fill="#4ade80" />
    </svg>
  );
}

/** Profile — person silhouette with badge ring */
function ProfileDockIcon({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="8.5" r="4" stroke="#a78bfa" strokeWidth="1.3" fill="rgba(167,139,250,0.15)" />
      <path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8" stroke="#a78bfa" strokeWidth="1.3" strokeLinecap="round" fill="none" />
      <circle cx="17.5" cy="6.5" r="3" fill="#1e1a2e" stroke="#a78bfa" strokeWidth="1" />
      <path d="M16.5 6.5l.8.8 1.6-1.6" stroke="#a78bfa" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** Control Panel — three horizontal sliders */
function ControlPanelDockIcon({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {/* Slider track 1 */}
      <line x1="3" y1="7" x2="21" y2="7" stroke="rgba(251,191,36,0.3)" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="8" cy="7" r="2.5" fill="#fbbf24" />
      {/* Slider track 2 */}
      <line x1="3" y1="12" x2="21" y2="12" stroke="rgba(251,191,36,0.3)" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="14" cy="12" r="2.5" fill="#fbbf24" />
      {/* Slider track 3 */}
      <line x1="3" y1="17" x2="21" y2="17" stroke="rgba(251,191,36,0.3)" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="9" cy="17" r="2.5" fill="#fbbf24" />
    </svg>
  );
}

/** Bell for time pill */
function BellIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M7 1.5a4 4 0 014 4v2l1 2H2l1-2v-2a4 4 0 014-4z"
        stroke="rgba(255,255,255,0.7)" strokeWidth="1.1" fill="none" />
      <path d="M5.5 11a1.5 1.5 0 003 0" stroke="rgba(255,255,255,0.7)" strokeWidth="1.1" fill="none" />
    </svg>
  );
}

/* ── Dock items config ──────────────────────────────────────────────────────── */
const DOCK_ITEMS = [
  {
    id: 'browser',
    label: 'Workspace',
    bg: 'rgba(20,123,88,0.08)',
    border: 'rgba(20,123,88,0.22)',
    glow: 'rgba(20,123,88,0.12)',
    icon: <BrowserDockIcon />,
    screen: 'browser' as const,
  },
  {
    id: 'vault',
    label: 'Vault',
    bg: 'rgba(45,212,191,0.07)',
    border: 'rgba(45,212,191,0.22)',
    glow: 'rgba(45,212,191,0.10)',
    icon: <VaultDockIcon />,
    screen: 'vault' as const,
  },
  {
    id: 'discovery',
    label: 'Discovery',
    bg: 'rgba(74,222,128,0.07)',
    border: 'rgba(74,222,128,0.22)',
    glow: 'rgba(74,222,128,0.10)',
    icon: <DiscoveryDockIcon />,
    screen: 'discovery' as const,
  },
  {
    id: 'profile',
    label: 'Profile',
    bg: 'rgba(167,139,250,0.07)',
    border: 'rgba(167,139,250,0.22)',
    glow: 'rgba(167,139,250,0.10)',
    icon: <ProfileDockIcon />,
    screen: 'profile' as const,
  },
  {
    id: 'controlpanel',
    label: 'Control Panel',
    bg: 'rgba(251,191,36,0.07)',
    border: 'rgba(251,191,36,0.22)',
    glow: 'rgba(251,191,36,0.10)',
    icon: <ControlPanelDockIcon />,
    screen: 'controlpanel' as const,
  },
] as const;

/* ── Desktop Screen ─────────────────────────────────────────────────────────── */
export function DesktopScreen() {
  const { setScreen, minimizedWindows, restoreWindow, setControlPanelOpen } = useAppStore();

  const now = new Date();
  const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
  const dateStr = now.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' });

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
      {/* ── Status bar ───────────────────────────────────────────────── */}
      <div style={{
        position: 'absolute', top: 18, left: 18,
        display: 'flex', alignItems: 'center', gap: 10, zIndex: 10,
      }}>
        <div style={{
          background: 'rgba(0,0,0,0.75)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 20,
          padding: '6px 14px',
          fontSize: 13,
          fontWeight: 600,
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

      {/* ── Minimised window shelf ───────────────────────────────────── */}
      {minimizedWindows.length > 0 && (
        <div style={{
          position: 'absolute',
          bottom: 118,
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex', alignItems: 'center', gap: 8,
          zIndex: 10,
        }}>
          {minimizedWindows.map(w => (
            <button
              key={w.screen}
              onClick={() => restoreWindow(w.screen)}
              title={`Restore ${w.label}`}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '6px 14px',
                background: 'rgba(14,14,16,0.90)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                border: `1px solid ${w.accentColor}44`,
                borderRadius: 20,
                boxShadow: `0 4px 20px rgba(0,0,0,0.5), 0 0 0 1px ${w.accentColor}22`,
                cursor: 'pointer',
                transition: 'transform 150ms, box-shadow 150ms',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = `0 8px 24px rgba(0,0,0,0.6), 0 0 0 1px ${w.accentColor}44`;
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = `0 4px 20px rgba(0,0,0,0.5), 0 0 0 1px ${w.accentColor}22`;
              }}
            >
              {/* Coloured dot */}
              <div style={{
                width: 8, height: 8, borderRadius: '50%',
                background: w.accentColor,
                boxShadow: `0 0 6px ${w.accentColor}`,
              }} />
              <span style={{ fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.75)' }}>
                {w.label}
              </span>
              {/* Mini restore arrows */}
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none" style={{ opacity: 0.5 }}>
                <path d="M2 8V3h5M2 8l6-6" stroke="rgba(255,255,255,0.7)" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          ))}
        </div>
      )}

      {/* ── Dock ────────────────────────────────────────────────────── */}
      <div style={{
        position: 'absolute',
        bottom: 32,
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        alignItems: 'flex-end',
        gap: 10,
        padding: '12px 16px',
        background: 'rgba(14,14,16,0.90)',
        backdropFilter: 'blur(32px)',
        WebkitBackdropFilter: 'blur(32px)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 24,
        boxShadow: '0 12px 48px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.05)',
        zIndex: 10,
      }}>
        {DOCK_ITEMS.map(item => (
          <div
            key={item.id}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}
          >
            <button
              onClick={() => item.id === 'controlpanel' ? setControlPanelOpen(true) : setScreen(item.screen)}
              title={item.label}
              style={{
                width: 56,
                height: 56,
                borderRadius: 16,
                background: item.bg,
                border: `1px solid ${item.border}`,
                boxShadow: `0 4px 20px ${item.glow}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'transform 160ms cubic-bezier(.34,1.56,.64,1), box-shadow 160ms',
                flexShrink: 0,
                position: 'relative',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-6px) scale(1.08)';
                e.currentTarget.style.boxShadow = `0 12px 32px ${item.glow}, 0 0 0 1px ${item.border}`;
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0) scale(1)';
                e.currentTarget.style.boxShadow = `0 4px 20px ${item.glow}`;
              }}
            >
              {item.icon}
            </button>
            <span style={{
              fontSize: 10,
              color: 'rgba(255,255,255,0.35)',
              letterSpacing: '0.02em',
              fontWeight: 500,
              textAlign: 'center',
              whiteSpace: 'nowrap',
            }}>
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
