import { cn } from "@/lib/utils";
import { type HTMLAttributes } from "react";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: "blue" | "gold" | "green" | "gray" | "red" | "outline";
  size?: "sm" | "md";
}

export default function Badge({
  children,
  className,
  variant = "blue",
  size = "md",
  ...props
}: BadgeProps) {
  const variants = {
    blue:    "bg-[var(--navy-50)] text-[var(--navy)] border border-[var(--navy-100)]",
    gold:    "bg-[#FFFBEB] text-[#92600A] border border-[#FDE68A]",
    green:   "bg-[var(--navy-50)] text-[var(--navy)] border border-[var(--navy-100)]",
    gray:    "bg-[var(--rule)] text-[var(--ink-muted)] border border-[var(--rule)]",
    red:     "bg-red-50 text-red-700 border border-red-100",
    outline: "bg-transparent text-[var(--navy)] border border-[var(--navy)]/30",
  };

  const sizes = {
    sm: "text-xs px-2.5 py-0.5 rounded-md",
    md: "text-xs px-3 py-1 rounded-full",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 font-semibold whitespace-nowrap",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}