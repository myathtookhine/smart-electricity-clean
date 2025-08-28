import React from 'react';
import { cn } from '../utils/cn';

const buttonVariants = {
  variant: {
    primary: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg",
    secondary: "bg-muted/20 text-foreground hover:bg-muted/30 border border-border",
    link: "text-primary hover:text-primary/80 underline-offset-4 hover:underline bg-transparent p-0 h-auto font-normal"
  },
  size: {
    default: "h-12 px-6 py-3",
    sm: "h-10 px-4 py-2",
    lg: "h-14 px-8 py-4",
    icon: "h-12 w-12"
  },
  width: {
    default: "w-auto",
    full: "w-full"
  }
};

const Button = React.forwardRef(({ 
  className, 
  variant = "primary", 
  size = "default", 
  width = "default",
  children,
  ...props 
}, ref) => {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-md text-sm font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-0 disabled:pointer-events-none disabled:opacity-50 transform hover:scale-105 disabled:scale-100",
        buttonVariants.variant[variant],
        buttonVariants.size[size],
        buttonVariants.width[width],
        variant === "link" && "hover:scale-100", // Remove scale effect for link variant
        className
      )}
      ref={ref}
      {...props}
    >
      {children}
    </button>
  );
});

Button.displayName = "Button";

export { Button };
