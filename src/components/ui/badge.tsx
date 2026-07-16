import { cn } from "@/lib/utils";
import { HTMLAttributes } from "react";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: "coral" | "sage" | "muted" | "cream";
}

const variants = {
  coral: "bg-coral-wash text-coral",
  sage: "bg-sage-wash text-sage",
  muted: "bg-cream-band text-muted",
  cream: "bg-cream text-ink border border-hairline",
};

export function Badge({
  className,
  variant = "cream",
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md px-3 py-1 text-[13px] font-medium",
        variants[variant],
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}
