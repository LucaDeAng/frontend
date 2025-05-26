import { motion, HTMLMotionProps } from 'framer-motion';
import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface EnhancedCardProps extends HTMLMotionProps<"div"> {
  variant?: 'default' | 'glass' | 'elevated' | 'interactive';
  depth?: 'sm' | 'md' | 'lg';
  hover?: boolean;
  children: React.ReactNode;
}

const EnhancedCard = forwardRef<HTMLDivElement, EnhancedCardProps>(
  ({ 
    className, 
    variant = 'default', 
    depth = 'md', 
    hover = true, 
    children, 
    ...props 
  }, ref) => {
    const baseClasses = "rounded-xl border transition-all duration-300";
    
    const variants = {
      default: "bg-zinc-900/80 border-primary/20",
      glass: "bg-black/20 backdrop-blur-xl border-white/10 shadow-2xl",
      elevated: "bg-zinc-900 border-primary/30 shadow-xl",
      interactive: "bg-zinc-900/90 border-primary/20 cursor-pointer"
    };

    const depths = {
      sm: "shadow-lg",
      md: "shadow-xl shadow-black/20",
      lg: "shadow-2xl shadow-black/30"
    };

    const hoverEffects = hover ? {
      whileHover: { 
        y: -4, 
        scale: 1.02,
        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)"
      },
      whileTap: { scale: 0.98 }
    } : {};

    return (
      <motion.div
        ref={ref}
        className={cn(
          baseClasses,
          variants[variant],
          depths[depth],
          className
        )}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        {...hoverEffects}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);

EnhancedCard.displayName = "EnhancedCard";

const EnhancedCardHeader = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-2 p-6 pb-3", className)}
    {...props}
  />
));
EnhancedCardHeader.displayName = "EnhancedCardHeader";

const EnhancedCardTitle = forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-2xl font-bold leading-tight tracking-tight text-white",
      className
    )}
    {...props}
  />
));
EnhancedCardTitle.displayName = "EnhancedCardTitle";

const EnhancedCardDescription = forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-base text-gray-300 leading-relaxed", className)}
    {...props}
  />
));
EnhancedCardDescription.displayName = "EnhancedCardDescription";

const EnhancedCardContent = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div 
    ref={ref} 
    className={cn("p-6 pt-3", className)} 
    {...props} 
  />
));
EnhancedCardContent.displayName = "EnhancedCardContent";

const EnhancedCardFooter = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-3", className)}
    {...props}
  />
));
EnhancedCardFooter.displayName = "EnhancedCardFooter";

export {
  EnhancedCard,
  EnhancedCardHeader,
  EnhancedCardTitle,
  EnhancedCardDescription,
  EnhancedCardContent,
  EnhancedCardFooter,
};