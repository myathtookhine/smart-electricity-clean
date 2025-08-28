import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { cn } from '../utils/cn';

const PasswordInput = React.forwardRef(({ className, ...props }, ref) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative">
      <input
        type={showPassword ? "text" : "password"}
        className={cn(
          "flex h-12 w-full rounded-md border border-border bg-input-background px-3 py-4 pr-12 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-300",
          "text-foreground dark:text-white light:text-gray-900",
          className
        )}
        ref={ref}
        {...props}
      />
      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        className="absolute inset-y-0 right-0 pr-3 flex items-center hover:bg-transparent"
        tabIndex={-1}
      >
        {showPassword ? (
          <EyeOff className="h-5 w-5 text-muted-foreground hover:text-foreground transition-colors" />
        ) : (
          <Eye className="h-5 w-5 text-muted-foreground hover:text-foreground transition-colors" />
        )}
      </button>
    </div>
  );
});

PasswordInput.displayName = "PasswordInput";

export { PasswordInput };
