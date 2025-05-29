import * as React from "react"

import { cn } from "@/lib/utils"

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => (
    <textarea
      ref={ref}
      className={cn(
        'w-full rounded-lg border border-[var(--color-primary)] bg-[var(--color-surface)] text-[var(--color-text)] placeholder-[var(--color-text-secondary)] px-4 py-2 text-base focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary-dark)] transition-colors duration-200 resize-none',
        className
      )}
      {...props}
    />
  )
)
Textarea.displayName = "Textarea"
