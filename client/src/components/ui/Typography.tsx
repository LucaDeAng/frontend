import { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface TypographyProps extends HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export default function Typography({ children, className, ...props }: TypographyProps) {
  return (
    <div className={cn('prose-enhanced', className)} {...props}>
      {children}
    </div>
  );
}
