"use client";
import { useEffect, useRef } from "react";
import { useAppStore } from "@/lib/store";
import { Button } from "@/components/ui/button";

/**
 * ChaosDistortion — v4.0
 *
 * Renders two things:
 * 1. CSS tier class on #desktop-root (handled by SimulationScreen via useChaosClass hook)
 * 2. Notification panel that slides in (replaces old full-screen modal overlay).
 *    The panel is non-blocking: users can still interact with all other UI.
 */

export function useChaosClass(): string {
  const session = useAppStore(s => s.session);
  const reduceVisualEffects = useAppStore(s => s.accessibilityPrefs.reduceVisualEffects);
  if (reduceVisualEffects || !session) return '';
  if (session.chaosResolving) return 'chaos-resolving';
  if (session.chaosTier === 3) return 'chaos-tier-3';
  if (session.chaosTier === 2) return 'chaos-tier-2 chaos-shudder';
  if (session.chaosTier === 1) return 'chaos-tier-1';
  return '';
}

export function ChaosDistortion() {
  const { chaosOverlay, acknowledgeChaos, accessibilityPrefs, session } = useAppStore();
  const shudderFiredRef = useRef(false);

  // Remove shudder class after it fires once (Tier 2)
  useEffect(() => {
    if (session?.chaosTier === 2 && !shudderFiredRef.current) {
      shudderFiredRef.current = true;
      const el = document.getElementById('desktop-root');
      if (!el) return;
      const onEnd = () => {
        el.classList.remove('chaos-shudder');
        el.removeEventListener('animationend', onEnd);
      };
      el.addEventListener('animationend', onEnd);
    }
    if (!session?.chaosTier) shudderFiredRef.current = false;
  }, [session?.chaosTier]);

  if (!chaosOverlay) return null;

  const tierConfig = {
    1: { label: 'Notice', color: '#f59e0b', bg: 'rgba(245,158,11,0.08)' },
    2: { label: 'Alert', color: '#147b58', bg: 'rgba(20,123,88,0.08)' },
    3: { label: 'CRITICAL', color: '#dc2626', bg: 'rgba(220,38,38,0.08)' },
  }[chaosOverlay.tier] ?? { label: 'Alert', color: '#ef4444', bg: 'rgba(239,68,68,0.08)' };

  return (
    <>
      {/* Tier 3 only: dim backdrop (non-blocking — pointer events only on panel) */}
      {chaosOverlay.tier === 3 && !accessibilityPrefs.reduceVisualEffects && (
        <div className="fixed inset-0 z-40 pointer-events-none"
          style={{ background: 'rgba(0,0,0,0.35)', backdropFilter: 'blur(1px)' }} />
      )}

      {/* Notification panel — slides in from top-right, stays non-blocking */}
      <div
        className="fixed top-14 right-4 z-50 w-96 rounded-2xl overflow-hidden animate-fade-in"
        style={{
          border: `1px solid ${tierConfig.color}33`,
          background: '#0f0f0f',
          boxShadow: `0 0 32px ${tierConfig.color}25, 0 0 0 1px ${tierConfig.color}22`,
        }}
      >
        {/* Tier header bar */}
        <div
          className="flex items-center gap-2.5 px-4 py-2.5"
          style={{ background: tierConfig.bg, borderBottom: `1px solid ${tierConfig.color}20` }}
        >
          <span
            className="animate-pulse-ring inline-block w-2 h-2 rounded-full shrink-0"
            style={{ background: tierConfig.color }}
          />
          <span className="text-xs font-bold tracking-widest uppercase" style={{ color: tierConfig.color }}>
            Tier {chaosOverlay.tier} — {tierConfig.label}
          </span>
        </div>

        <div className="p-4">
          <h2 className="text-base font-semibold text-white mb-2">{chaosOverlay.title}</h2>
          <p className="text-sm text-white/55 leading-relaxed mb-4">{chaosOverlay.description}</p>

          <div
            className="rounded-xl p-3 mb-4 text-xs text-white/50 leading-relaxed"
            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
          >
            This event has affected team dynamics and your OKR progress. Address it with the relevant team members before the session ends.
          </div>

          <Button
            variant="chaos"
            className="w-full"
            onClick={acknowledgeChaos}
          >
            Acknowledge & Respond
          </Button>
        </div>
      </div>
    </>
  );
}
