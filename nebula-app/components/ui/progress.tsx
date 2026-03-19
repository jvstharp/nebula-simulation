import { cn } from "@/lib/utils";

interface ProgressProps {
  value: number;
  max?: number;
  color?: string;
  className?: string;
  showLabel?: boolean;
}

export function Progress({ value, max = 100, color = '#22c55e', className, showLabel }: ProgressProps) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));
  return (
    <div className={cn("relative", className)}>
      <div className="h-1.5 bg-white/8 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${pct}%`, background: color }}
        />
      </div>
      {showLabel && <span className="text-xs text-white/40 mt-0.5 block">{Math.round(pct)}%</span>}
    </div>
  );
}
