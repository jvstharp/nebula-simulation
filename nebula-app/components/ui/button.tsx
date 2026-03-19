import * as React from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'ghost' | 'outline' | 'danger' | 'chaos';
  size?: 'sm' | 'md' | 'lg';
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'md', ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-lg font-medium transition-all duration-150 focus:outline-none disabled:opacity-40 disabled:cursor-not-allowed",
          {
            'default': "bg-[#147b58] text-white hover:bg-[#0f5e43] active:bg-[#0a4833] shadow-sm",
            'ghost': "bg-transparent text-white/70 hover:bg-white/8 hover:text-white",
            'outline': "bg-transparent border border-white/15 text-white/80 hover:border-white/30 hover:text-white",
            'danger': "bg-red-500/20 border border-red-500/40 text-red-400 hover:bg-red-500/30",
            'chaos': "bg-red-600 text-white hover:bg-red-700 shadow-[0_0_20px_rgba(239,68,68,0.4)]",
          }[variant],
          {
            'sm': "px-3 py-1.5 text-xs gap-1.5",
            'md': "px-4 py-2 text-sm gap-2",
            'lg': "px-6 py-3 text-base gap-2",
          }[size],
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";
