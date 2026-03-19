import { trustColor, trustLabel } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface TrustMeterProps {
  score: number;
  name: string;
  compact?: boolean;
}

export function TrustMeter({ score, name, compact }: TrustMeterProps) {
  const color = trustColor(score);
  const pct = Math.round(score * 100);
  const label = trustLabel(score);

  if (compact) {
    return (
      <div className="flex items-center gap-1.5">
        <div className="h-1 w-12 bg-white/8 rounded-full overflow-hidden">
          <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, background: color }} />
        </div>
        <span className="text-xs" style={{ color }}>{pct}%</span>
      </div>
    );
  }

  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs">
        <span className="text-white/50">Trust</span>
        <span style={{ color }}>{label} · {pct}%</span>
      </div>
      <div className="h-1.5 bg-white/8 rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, background: color }} />
      </div>
    </div>
  );
}
