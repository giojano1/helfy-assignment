import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { Spinner } from "./Spinner";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

const variantStyles: Record<string, string> = {
  primary: "bg-brand-primary hover:bg-brand-primary/90 text-white",
  secondary:
    "bg-white/10 hover:bg-white/20 text-text-primary border border-white/20",
  ghost: "bg-transparent hover:bg-white/10 text-text-primary",
  danger: "bg-brand-accent hover:bg-brand-accent/90 text-white",
};

const sizeStyles: Record<string, string> = {
  sm: "px-3 py-1.5 text-sm gap-1.5",
  md: "px-4 py-2 text-sm gap-2",
  lg: "px-6 py-3 text-base gap-2",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      isLoading,
      leftIcon,
      rightIcon,
      children,
      className = "",
      disabled,
      ...rest
    },
    ref,
  ) => (
    <button
      ref={ref}
      disabled={isLoading ?? disabled}
      className={`inline-flex items-center justify-center rounded-lg font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary disabled:cursor-not-allowed disabled:opacity-60 ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      {...rest}
    >
      {isLoading ? <Spinner size="sm" /> : leftIcon}
      {children}
      {!isLoading && rightIcon}
    </button>
  ),
);

Button.displayName = "Button";
