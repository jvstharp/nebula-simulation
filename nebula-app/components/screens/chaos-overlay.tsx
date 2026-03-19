"use client";
import { useAppStore } from "@/lib/store";

export function ChaosOverlay() {
  const { chaosOverlay, acknowledgeChaos } = useAppStore();
  if (!chaosOverlay) return null;

  const severityColor = {
    critical: '#ef4444',
    high:     '#147b58',
    medium:   '#f59e0b',
    low:      '#6b7280',
  }[chaosOverlay.severity] ?? '#ef4444';

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 3000,
      background: 'rgba(0,0,0,0.82)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      backdropFilter: 'blur(6px)',
    }}>
      {/* Ambient glow */}
      <div style={{
        position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)',
        width: 700, height: 320,
        background: `radial-gradient(ellipse at center top, ${severityColor}14, transparent 65%)`,
        pointerEvents: 'none',
      }} />

      {/* Card */}
      <div style={{
        position: 'relative',
        width: 480, maxWidth: '92vw',
        background: 'linear-gradient(180deg, rgba(18,5,7,0.98) 0%, rgba(10,3,4,0.98) 100%)',
        border: `1px solid ${severityColor}55`,
        borderRadius: 20,
        boxShadow: `0 0 90px ${severityColor}1a, 0 32px 64px rgba(0,0,0,0.75), inset 0 1px 0 rgba(255,255,255,0.05)`,
        overflow: 'hidden',
      }}>
        {/* Top accent bar */}
        <div style={{ height: 3, background: `linear-gradient(90deg, transparent 0%, ${severityColor} 50%, transparent 100%)` }} />

        <div style={{ padding: '28px 32px' }}>
          {/* Badge row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 7,
              background: `${severityColor}18`, border: `1px solid ${severityColor}44`,
              borderRadius: 8, padding: '4px 12px',
            }}>
              <div style={{
                width: 7, height: 7, borderRadius: '50%', background: severityColor,
                boxShadow: `0 0 10px ${severityColor}`,
              }} />
              <span style={{
                fontSize: 10.5, fontWeight: 700, color: severityColor,
                textTransform: 'uppercase', letterSpacing: '0.1em',
              }}>
                {chaosOverlay.severity} alert · tier {chaosOverlay.tier}
              </span>
            </div>
          </div>

          {/* Title */}
          <h2 style={{
            fontSize: 22, fontWeight: 800, color: '#fff',
            marginBottom: 14, lineHeight: 1.25,
          }}>
            {chaosOverlay.title}
          </h2>

          {/* Description */}
          <p style={{
            fontSize: 14, color: 'rgba(255,255,255,0.72)',
            lineHeight: 1.7, marginBottom: 22,
          }}>
            {chaosOverlay.description}
          </p>

          {/* Impact card */}
          <div style={{
            background: `${severityColor}0a`, border: `1px solid ${severityColor}20`,
            borderRadius: 10, padding: '12px 16px', marginBottom: 28,
          }}>
            <div style={{
              fontSize: 10, fontWeight: 700, color: severityColor,
              textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 6,
            }}>
              Immediate Impact
            </div>
            <div style={{ fontSize: 12.5, color: 'rgba(255,255,255,0.6)', lineHeight: 1.65 }}>
              All team members have shifted to an alarmed state. This event is logged to your session record and will be reflected in your performance assessment.
            </div>
          </div>

          {/* Action row */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 14 }}>
            <div style={{ fontSize: 11.5, color: 'rgba(255,255,255,0.28)', lineHeight: 1.5 }}>
              Acknowledging starts a<br />45-second resolution wind-down
            </div>
            <button
              onClick={acknowledgeChaos}
              style={{
                padding: '11px 24px', flexShrink: 0,
                background: `linear-gradient(135deg, ${severityColor}cc, ${severityColor}88)`,
                border: `1px solid ${severityColor}`,
                borderRadius: 10, fontSize: 13.5, fontWeight: 700, color: '#fff',
                cursor: 'pointer',
                boxShadow: `0 4px 24px ${severityColor}44`,
              }}
            >
              Acknowledge
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
