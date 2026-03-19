import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
  className?: string;
}

export function Badge({ children, variant = 'default', className }: BadgeProps) {
  return (
    <span className={cn(
      "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium",
      {
        default: "bg-white/10 text-white/60",
        success: "bg-green-500/15 text-green-400 border border-green-500/25",
        warning: "bg-amber-500/15 text-amber-400 border border-amber-500/25",
        danger: "bg-red-500/15 text-red-400 border border-red-500/25",
        info: "bg-blue-500/15 text-blue-400 border border-blue-500/25",
      }[variant],
      className
    )}>
      {children}
    </span>
  );
}
