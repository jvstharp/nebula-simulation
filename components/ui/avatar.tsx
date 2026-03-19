import { cn, getInitials } from "@/lib/utils";

interface AvatarProps {
  name: string;
  color?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  src?: string;
}

export function Avatar({ name, color = '#555', size = 'md', className, src }: AvatarProps) {
  const sizes = { sm: 'w-7 h-7 text-xs', md: 'w-9 h-9 text-sm', lg: 'w-12 h-12 text-base' };
  return (
    <div
      className={cn("rounded-full flex items-center justify-center font-semibold shrink-0 select-none", sizes[size], className)}
      style={{ background: src ? undefined : `${color}33`, color, border: `1px solid ${color}44` }}
    >
      {src ? <img src={src} alt={name} className="w-full h-full rounded-full object-cover" /> : getInitials(name)}
    </div>
  );
}
