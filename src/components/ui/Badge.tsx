import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "react";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "status" | "level";
  value?: string;
}

export default function Badge({ className, variant = "default", value, children, ...props }: BadgeProps) {
  const statusClass = variant === "status" && value ? `status-${value}` : "";
  const levelClass = variant === "level" && value ? `level-${value}` : "";

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-lg text-xs font-medium",
        variant === "default" && "bg-brand-500/20 text-brand-300 border border-brand-500/30",
        statusClass,
        levelClass,
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
