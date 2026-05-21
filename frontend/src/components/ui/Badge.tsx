import type { ReactNode } from "react";

interface BadgeProps {
  color?: "green" | "red" | "yellow" | "blue" | "gray";
  children: ReactNode;
  className?: string;
}

const colorStyles: Record<string, string> = {
  green: "bg-green-500/20 text-green-400",
  red: "bg-red-500/20 text-red-400",
  yellow: "bg-yellow-500/20 text-yellow-400",
  blue: "bg-blue-500/20 text-blue-400",
  gray: "bg-white/10 text-text-muted",
};

export function Badge({ color = "gray", children, className = "" }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${colorStyles[color]} ${className}`}
    >
      {children}
    </span>
  );
}
