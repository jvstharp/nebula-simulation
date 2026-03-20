import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'purple' | 'orange';
  className?: string;
}

const VARIANT_STYLES: Record<NonNullable<BadgeProps['variant']>, React.CSSProperties> = {
  default: { background: 'rgba(255,255,255,0.10)', color: 'rgba(255,255,255,0.60)' },
  success: { background: '#02ba67', color: '#000000' },
  warning: { background: '#deaf49', color: '#000000' },
  danger:  { background: '#d44848', color: '#000000' },
  info:    { background: '#49a5de', color: '#000000' },
  purple:  { background: '#bb76d6', color: '#000000' },
  orange:  { background: '#db966b', color: '#000000' },
};

export function Badge({ children, variant = 'default', className }: BadgeProps) {
  return (
    <span
      className={cn("inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium", className)}
      style={VARIANT_STYLES[variant]}
    >
      {children}
    </span>
  );
}
