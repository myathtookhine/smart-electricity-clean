import React from 'react';
import { cn } from '../utils/cn';

const Field = ({ label, hint, error, icon, children, className }) => {
  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <label className="text-foreground text-sm font-medium block">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            {React.cloneElement(icon, { 
              className: "h-5 w-5 text-muted-foreground" 
            })}
          </div>
        )}
        {React.cloneElement(children, {
          className: cn(
            children.props.className,
            icon && "pl-10"
          )
        })}
      </div>
      {hint && (
        <p className="text-muted-foreground text-xs">{hint}</p>
      )}
      {error && (
        <p className="text-red-400 text-xs">{error}</p>
      )}
    </div>
  );
};

Field.displayName = "Field";

export { Field };
