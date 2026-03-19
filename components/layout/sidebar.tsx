"use client";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/lib/store";
import type { AppTab } from "@/lib/types";

/* ── SVG Utility Icons ──────────────────────────────────────────────────────── */
function MicIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
      <rect x="5" y="1" width="5" height="8" rx="2.5" stroke="currentColor" strokeWidth="1.1" />
      <path d="M2.5 7.5a5 5 0 0010 0" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
      <path d="M7.5 12.5v2" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
    </svg>
  );
}

function HeadphoneIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
      <path d="M2.5 8v-1a5 5 0 0110 0v1" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
      <rect x="1.5" y="8" width="3" height="4.5" rx="1.5" stroke="currentColor" strokeWidth="1.1" />
      <rect x="10" y="8" width="3" height="4.5" rx="1.5" stroke="currentColor" strokeWidth="1.1" />
    </svg>
  );
}

function SettingsIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
      <circle cx="7.5" cy="7.5" r="2" stroke="currentColor" strokeWidth="1.1" />
      <path
        d="M7.5 1.5v1M7.5 12.5v1M1.5 7.5h1M12.5 7.5h1M3.4 3.4l.7.7M10.9 10.9l.7.7M10.9 3.4l-.7.7M4.1 10.9l-.7.7"
        stroke="currentColor" strokeWidth="1.1" strokeLinecap="round"
      />
    </svg>
  );
}

/* ── Nav items ──────────────────────────────────────────────────────────────── */
const TABS: { id: AppTab; label: string }[] = [
  { id: 'browser',   label: 'Browser' },
  { id: 'meetings',  label: 'Meetings' },
  { id: 'drive',     label: 'Drive' },
  { id: 'assistant', label: 'Assistant' },
  { id: 'project',   label: 'Project Overview' },
];

interface SidebarProps {
  className?: string;
  items?: { id: string; label: string }[];
  activeId?: string;
  onSelect?: (id: string) => void;
}

export function Sidebar({ className, items, activeId, onSelect }: SidebarProps) {
  const { activeApp, setActiveApp } = useAppStore();

  const navItems = items ?? TABS;
  const currentId = activeId ?? activeApp;
  const handleSelect = onSelect ?? ((id: string) => setActiveApp(id as AppTab));

  return (
    <div
      className={cn(className)}
      style={{
        width: 'var(--sidebar-width)',
        flexShrink: 0,
        background: 'var(--bg-titlebar)',
        borderRight: '1px solid var(--border-subtle)',
        display: 'flex',
        flexDirection: 'column',
        paddingTop: 14,
      }}
    >
      {/* Nav items */}
      <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 10 }}>
        {navItems.map(item => (
          <button
            key={item.id}
            onClick={() => handleSelect(item.id)}
            style={{
              display: 'block',
              padding: '8px 20px',
              fontSize: 13.5,
              lineHeight: 1.4,
              color: currentId === item.id ? 'var(--text-primary)' : 'var(--text-secondary)',
              fontWeight: currentId === item.id ? 600 : 400,
              cursor: 'pointer',
              background: 'transparent',
              border: 'none',
              textAlign: 'left',
              fontFamily: 'var(--font-sans)',
              transition: 'color 120ms',
              width: '100%',
            }}
          >
            {item.label}
          </button>
        ))}
      </nav>

      {/* Bottom utility icons — mic · headphones · settings */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        padding: '12px 20px 14px',
        borderTop: '1px solid var(--border-subtle)',
      }}>
        {[
          { icon: <MicIcon />,       label: 'Microphone' },
          { icon: <HeadphoneIcon />, label: 'Headphones' },
          { icon: <SettingsIcon />,  label: 'Settings' },
        ].map(({ icon, label }) => (
          <button
            key={label}
            title={label}
            style={{
              color: 'rgba(255,255,255,0.28)',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 5,
              borderRadius: 6,
              transition: 'color 150ms',
            }}
            onMouseEnter={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.55)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.28)')}
          >
            {icon}
          </button>
        ))}
      </div>
    </div>
  );
}
