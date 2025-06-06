import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { motion, HTMLMotionProps } from "framer-motion";
import { forwardRef } from "react";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-black disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow-lg hover:shadow-xl hover:shadow-primary/25",
        destructive: "bg-red-500 text-white shadow-lg hover:shadow-xl hover:shadow-red-500/25",
        outline: "border border-primary/30 bg-transparent text-primary hover:bg-primary/10 hover:border-primary/50",
        secondary: "bg-secondary text-secondary-foreground shadow-lg hover:shadow-xl hover:shadow-secondary/25",
        ghost: "text-gray-300 hover:bg-white/5 hover:text-white",
        link: "text-primary underline-offset-4 hover:underline",
        glass: "bg-white/10 backdrop-blur-md border border-white/20 text-white shadow-xl hover:bg-white/20 hover:shadow-2xl"
      },
      size: {
        default: "h-11 px-6 py-2",
        sm: "h-9 rounded-md px-4",
        lg: "h-12 rounded-lg px-8",
        xl: "h-14 rounded-lg px-10 text-base",
        icon: "h-10 w-10"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);

export interface EnhancedButtonProps
  extends Omit<HTMLMotionProps<"button">, "color">,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
}

const EnhancedButton = forwardRef<HTMLButtonElement, EnhancedButtonProps>(
  ({ 
    className, 
    variant, 
    size, 
    asChild = false, 
    loading = false,
    icon,
    iconPosition = "left",
    children,
    disabled,
    ...props 
  }, ref) => {
    const Comp: any = asChild ? Slot : motion.button;

    const buttonContent = (
      <>
        {icon && iconPosition === "left" && (
          <span className="mr-2">{icon}</span>
        )}
        {loading ? (
          <motion.div
            className="h-4 w-4 border-2 border-current border-r-transparent rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
        ) : (
          children
        )}
        {icon && iconPosition === "right" && (
          <span className="ml-2">{icon}</span>
        )}
      </>
    );

    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled || loading}
        whileHover={{ scale: 1.05, y: -2 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        {...props}
      >
        {buttonContent}
      </Comp>
    );
  }
);

EnhancedButton.displayName = "EnhancedButton";

export { EnhancedButton, buttonVariants };