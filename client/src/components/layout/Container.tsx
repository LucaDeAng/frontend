import { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export default function Container({ children, className, ...props }: ContainerProps) {
  return (
    <div className={cn("container mx-auto px-6 md:px-8 lg:px-12", className)} {...props}>
      {children}
    </div>
  );
}
