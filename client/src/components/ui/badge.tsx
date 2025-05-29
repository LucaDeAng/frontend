import * as React from "react"
import { cn } from "@/lib/utils"

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'primary' | 'accent' | 'highlight' | 'outline';
}

const variants = {
  primary: 'bg-[var(--color-primary)] text-white px-3 py-1 rounded-full text-xs font-semibold',
  accent: 'bg-[var(--color-accent)] text-white px-3 py-1 rounded-full text-xs font-semibold',
  highlight: 'bg-[var(--color-highlight)] text-black px-3 py-1 rounded-full text-xs font-semibold',
  outline: 'border border-[var(--color-primary)] text-[var(--color-primary)] px-3 py-1 rounded-full text-xs font-semibold bg-transparent',
};

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = 'primary', ...props }, ref) => (
    <span
      ref={ref}
      className={cn(variants[variant], className)}
      {...props}
    />
  )
);
Badge.displayName = 'Badge';
