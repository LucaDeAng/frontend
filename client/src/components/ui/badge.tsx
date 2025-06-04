import * as React from "react"
import { cn } from "@/lib/utils"
import { baseBadge } from "./base-styles"

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'primary' | 'accent' | 'highlight' | 'outline';
}

const variants = {
  primary: `${baseBadge} bg-[var(--color-primary)] text-white`,
  accent: `${baseBadge} bg-[var(--color-accent)] text-white`,
  highlight: `${baseBadge} bg-[var(--color-highlight)] text-black`,
  outline: `${baseBadge} border border-[var(--color-primary)] text-[var(--color-primary)] bg-transparent`,
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
