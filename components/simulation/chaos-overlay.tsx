"use client";
import { useAppStore } from "@/lib/store";
import { Button } from "@/components/ui/button";

export function ChaosOverlay() {
  const { chaosOverlay, acknowledgeChaos, session } = useAppStore();
  if (!chaosOverlay) return null;

  const severityColor = {
    low: '#f59e0b',
    medium: '#147b58',
    high: '#ef4444',
    critical: '#dc2626',
  }[chaosOverlay.severity];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

      {/* Pulsing border */}
      <div className="absolute inset-0 pointer-events-none" style={{ boxShadow: `inset 0 0 0 3px ${severityColor}66, inset 0 0 60px ${severityColor}22` }} />

      {/* Panel */}
      <div className="relative z-10 w-full max-w-md mx-4 rounded-2xl overflow-hidden"
        style={{ border: `1px solid ${severityColor}44`, background: '#0f0f0f', boxShadow: `0 0 40px ${severityColor}30` }}>

        {/* Alert bar */}
        <div className="flex items-center gap-2 px-5 py-3" style={{ background: `${severityColor}15`, borderBottom: `1px solid ${severityColor}25` }}>
          <span className="animate-pulse-ring inline-block w-2 h-2 rounded-full mr-1" style={{ background: severityColor }} />
          <span className="text-xs font-bold tracking-widest uppercase" style={{ color: severityColor }}>
            {chaosOverlay.severity} Priority
          </span>
        </div>

        <div className="p-5">
          <h2 className="text-xl font-semibold text-white mb-3">{chaosOverlay.title}</h2>
          <p className="text-sm text-white/60 leading-relaxed mb-6">{chaosOverlay.description}</p>

          <div className="bg-white/4 rounded-xl p-3 mb-5 border border-white/8">
            <p className="text-xs text-white/40 uppercase tracking-wide mb-1">Required Action</p>
            <p className="text-sm text-white/80">This event has affected team dynamics and your OKR progress. You must address this with the relevant team members before the session ends.</p>
          </div>

          <div className="flex gap-3">
            <Button variant="chaos" className="flex-1" onClick={acknowledgeChaos}>
              Acknowledge & Respond
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
