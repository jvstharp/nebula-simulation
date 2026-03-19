"use client";
import type { CSSProperties } from 'react';

/* ── Shared Discovery-style UI primitives ───────────────────────────────────
   These are the canonical design tokens & components for the Nebula platform.
   Import from here to keep every screen visually consistent.
   ─────────────────────────────────────────────────────────────────────────── */

/** Small right-pointing chevron used inside SectionHeader */
export function ChevronRight() {
  return (
    <svg width="11" height="11" viewBox="0 0 11 11" fill="none" style={{ flexShrink: 0 }}>
      <path d="M3.5 2l4 3.5-4 3.5" stroke="currentColor" strokeWidth="1.3"
        strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** Standard section header: bold title + muted chevron */
export function SectionHeader({ title }: { title: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
      <span style={{ fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.9)' }}>
        {title}
      </span>
      <span style={{ color: 'rgba(255,255,255,0.35)', display: 'flex', alignItems: 'center' }}>
        <ChevronRight />
      </span>
    </div>
  );
}

/** Thumbnail / image placeholder */
export function Thumb({
  aspectRatio = '16/9',
  radius = 8,
}: {
  aspectRatio?: string;
  radius?: number;
}) {
  return (
    <div style={{
      width: '100%',
      aspectRatio,
      background: 'rgba(255,255,255,0.045)',
      borderRadius: radius,
      border: '1px solid rgba(255,255,255,0.06)',
      flexShrink: 0,
    }} />
  );
}

/* ── Card style constants ───────────────────────────────────────────────────── */

/** Spread onto any card container */
export const cardStyle: CSSProperties = {
  background: '#18181c',
  border: '1px solid rgba(255,255,255,0.07)',
  borderRadius: 10,
  transition: 'background 150ms, border-color 150ms',
};

/** Mouse-enter handler for card hover */
export function cardHoverIn(el: HTMLElement) {
  el.style.background = '#1f1f24';
  el.style.borderColor = 'rgba(255,255,255,0.13)';
}

/** Mouse-leave handler for card hover */
export function cardHoverOut(el: HTMLElement) {
  el.style.background = '#18181c';
  el.style.borderColor = 'rgba(255,255,255,0.07)';
}

/** Horizontal rule / divider */
export const dividerStyle: CSSProperties = {
  height: 1,
  background: 'rgba(255,255,255,0.055)',
};
