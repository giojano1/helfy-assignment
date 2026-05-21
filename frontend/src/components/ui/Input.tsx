import { forwardRef, type InputHTMLAttributes, type ReactNode } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  leftAddon?: ReactNode;
  rightAddon?: ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, leftAddon, rightAddon, className = "", id, ...rest }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, "-");
    return (
      <div className="flex flex-col gap-1">
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium text-text-muted">
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {leftAddon && (
            <span className="absolute left-3 text-text-muted">{leftAddon}</span>
          )}
          <input
            ref={ref}
            id={inputId}
            className={`w-full rounded-lg border bg-white/5 px-4 py-2.5 text-text-primary placeholder-text-muted/60 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-primary ${leftAddon ? "pl-10" : ""} ${rightAddon ? "pr-10" : ""} ${error ? "border-brand-accent" : "border-white/10"} ${className}`}
            {...rest}
          />
          {rightAddon && (
            <span className="absolute right-3 text-text-muted">{rightAddon}</span>
          )}
        </div>
        {error && <p className="text-xs text-brand-accent">{error}</p>}
      </div>
    );
  },
);

Input.displayName = "Input";
