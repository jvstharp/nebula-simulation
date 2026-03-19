"use client";
import { useEffect, useState } from "react";
import { useAppStore } from "@/lib/store";
import { formatTime } from "@/lib/utils";

export function TimerBar() {
  const { session } = useAppStore();
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    if (!session || session.status !== 'active') return;
    const interval = setInterval(() => setElapsed(e => e + 1), 1000);
    return () => clearInterval(interval);
  }, [session?.status]);

  if (!session) return null;

  const targetSeconds = 45 * 60; // 45 min target
  const pct = Math.min(100, (elapsed / targetSeconds) * 100);
  const isLate = elapsed > targetSeconds;

  return (
    <div className="flex items-center gap-3 px-4 py-2 border-b border-white/5 bg-[#121212]">
      {/* OKR progress */}
      <div className="flex items-center gap-2 flex-1">
        <span className="text-xs text-white/30 shrink-0">OKR Progress</span>
        <div className="flex-1 h-1.5 bg-white/6 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${Math.round(session.okrs.reduce((s, o) => s + o.progress, 0) / session.okrs.length)}%`,
              background: '#7c3aed',
            }}
          />
        </div>
        <span className="text-xs text-white/40 shrink-0">
          {Math.round(session.okrs.reduce((s, o) => s + o.progress, 0) / session.okrs.length)}%
        </span>
      </div>

      {/* Divider */}
      <div className="w-px h-4 bg-white/8" />

      {/* Timer */}
      <div className={`flex items-center gap-1.5 text-xs font-mono ${isLate ? 'text-red-400' : 'text-white/50'}`}>
        <span className="w-1.5 h-1.5 rounded-full bg-current opacity-60 animate-pulse" />
        {formatTime(elapsed)}
      </div>

      {/* Chaos indicator */}
      {session.chaosMode === 'chaos' && (
        <div className="flex items-center gap-1.5 text-xs text-red-400">
          <span className="animate-pulse">⚡</span>
          Chaos Active
        </div>
      )}

      {/* Session number */}
      <div className="text-xs text-white/25">Session {session.sessionNumber}/3</div>

      {/* Credits */}
      <div className="text-xs text-amber-400">⚡ {session.credits}</div>
    </div>
  );
}
