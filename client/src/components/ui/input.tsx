import * as React from "react"

import { cn } from "@/lib/utils"

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        'w-full rounded-lg border border-[var(--color-primary)] bg-[var(--color-surface)] text-[var(--color-text)] placeholder-[var(--color-text-secondary)] px-4 py-2 text-base focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary-dark)] transition-colors duration-200',
        className
      )}
      {...props}
    />
  )
)
Input.displayName = "Input"
