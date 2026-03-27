"use client";
import { cn } from "@/lib/utils";

/* ── SVG Icons ──────────────────────────────────────────────────────────────── */
function DocIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ flexShrink: 0 }}>
      <path d="M3 1.5h5.5L11 4v8.5a.5.5 0 01-.5.5h-7a.5.5 0 01-.5-.5v-11A.5.5 0 013 1.5z"
        stroke="currentColor" strokeWidth="1" fill="none" />
      <path d="M8.5 1.5V4H11" stroke="currentColor" strokeWidth="1" fill="none" />
    </svg>
  );
}

function GlobeIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ flexShrink: 0 }}>
      <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1" />
      <ellipse cx="7" cy="7" rx="2.2" ry="5.5" stroke="currentColor" strokeWidth="1" />
      <path d="M1.5 7h11M1.5 4.5h11M1.5 9.5h11" stroke="currentColor" strokeWidth="0.8" />
    </svg>
  );
}

/* ── Traffic light button ────────────────────────────────────────────────────── */
function TrafficBtn({
  color,
  hoverIcon,
  onClick,
  title,
}: {
  color: string;
  hoverIcon: React.ReactNode;
  onClick?: () => void;
  title?: string;
}) {
  return (
    <button
      onClick={onClick}
      title={title}
      style={{
        width: 12, height: 12, borderRadius: '50%', background: color,
        border: 'none', cursor: onClick ? 'pointer' : 'default',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        position: 'relative', flexShrink: 0,
        transition: 'filter 150ms',
      }}
      onMouseEnter={e => {
        const icon = e.currentTarget.querySelector('.tl-icon') as HTMLElement | null;
        if (icon) icon.style.opacity = '1';
      }}
      onMouseLeave={e => {
        const icon = e.currentTarget.querySelector('.tl-icon') as HTMLElement | null;
        if (icon) icon.style.opacity = '0';
      }}
    >
      <span className="tl-icon" style={{
        position: 'absolute', opacity: 0, transition: 'opacity 120ms',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        pointerEvents: 'none',
      }}>
        {hoverIcon}
      </span>
    </button>
  );
}

/* ── User Avatar ─────────────────────────────────────────────────────────────── */
function UserAvatar() {
  return (
    <div style={{
      width: 28, height: 28, borderRadius: '50%',
      overflow: 'hidden', flexShrink: 0,
      border: '1.5px solid rgba(255,255,255,0.18)',
      background: 'linear-gradient(145deg, #c97b50 0%, #a0522d 40%, #7b3a1e 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <ellipse cx="10" cy="8"  rx="4"   ry="4.5" fill="rgba(255,255,255,0.85)" />
        <ellipse cx="10" cy="18" rx="6.5" ry="5"   fill="rgba(255,255,255,0.85)" />
        <ellipse cx="10" cy="5.5"  rx="4.5" ry="3"   fill="#2a1a0e" />
        <ellipse cx="5.5" cy="8.5"  rx="1.2" ry="3.5" fill="#2a1a0e" />
        <ellipse cx="14.5" cy="8.5" rx="1.2" ry="3.5" fill="#2a1a0e" />
      </svg>
    </div>
  );
}

/* ── WindowChrome ────────────────────────────────────────────────────────────── */
export interface WindowChromeProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  /** Legacy prop — accepted but unused (kept for backwards compat) */
  title?: string;
  iconType?: 'document' | 'globe';
  searchPlaceholder?: string;
  urlValue?: string;
  onClose?: () => void;
  onMinimize?: () => void;
  onMaximize?: () => void;
}

export function WindowChrome({
  children,
  className,
  style,
  title,
  iconType = 'document',
  searchPlaceholder,
  urlValue,
  onClose,
  onMinimize,
  onMaximize,
}: WindowChromeProps) {
  const placeholder = searchPlaceholder ?? title ?? 'Search';

  return (
    <div className={cn("window flex flex-col overflow-hidden", className)} style={style}>
      {/* ── Titlebar ─────────────────────────────────────────────────── */}
      <div style={{
        background: 'var(--bg-titlebar)',
        borderBottom: '1px solid var(--border-subtle)',
        height: 'var(--titlebar-h)',
        display: 'flex', alignItems: 'center',
        padding: '0 14px', gap: '10px', flexShrink: 0,
      }}>
        {/* Traffic lights */}
        <div
          className="traffic-lights-group"
          style={{ display: 'flex', gap: 7, alignItems: 'center', flexShrink: 0 }}
          onMouseEnter={e => {
            e.currentTarget.querySelectorAll('.tl-icon').forEach(el => {
              (el as HTMLElement).style.opacity = '1';
            });
          }}
          onMouseLeave={e => {
            e.currentTarget.querySelectorAll('.tl-icon').forEach(el => {
              (el as HTMLElement).style.opacity = '0';
            });
          }}
        >
          <TrafficBtn
            color="#ff5f57"
            title="Close"
            onClick={onClose}
            hoverIcon={
              <svg width="7" height="7" viewBox="0 0 7 7" fill="none">
                <path d="M1 1l5 5M6 1L1 6" stroke="#7a0000" strokeWidth="1.4" strokeLinecap="round" />
              </svg>
            }
          />
          <TrafficBtn
            color="#febc2e"
            title="Minimise"
            onClick={onMinimize}
            hoverIcon={
              <svg width="7" height="2" viewBox="0 0 7 2" fill="none">
                <path d="M0.5 1h6" stroke="#7a5200" strokeWidth="1.4" strokeLinecap="round" />
              </svg>
            }
          />
          <TrafficBtn
            color="#28c840"
            title="Maximise"
            onClick={onMaximize}
            hoverIcon={
              <svg width="7" height="7" viewBox="0 0 7 7" fill="none">
                <path d="M1 6V1h5M1 6l5-5" stroke="#005000" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            }
          />
        </div>

        {/* Search / URL bar */}
        <div style={{
          flex: 1, display: 'flex', alignItems: 'center', gap: 10,
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.055)',
          borderRadius: 8, height: 28, padding: '0 10px',
        }}>
          <span style={{ color: 'rgba(255,255,255,0.32)', display: 'flex', alignItems: 'center' }}>
            {iconType === 'globe' ? <GlobeIcon /> : <DocIcon />}
          </span>
          {urlValue ? (
            <span style={{
              flex: 1, fontSize: 12, color: 'rgba(255,255,255,0.42)',
              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            }}>
              {urlValue}
            </span>
          ) : (
            <span style={{ flex: 1, fontSize: 12, color: 'rgba(255,255,255,0.22)' }}>
              {placeholder}
            </span>
          )}
        </div>

        {/* User avatar */}
        <UserAvatar />
      </div>

      {children}
    </div>
  );
}
