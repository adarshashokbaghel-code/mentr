import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes, forwardRef } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost" | "whatsapp";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-coral text-white hover:bg-coral-dark active:scale-[0.98] shadow-sm",
  secondary:
    "bg-cream text-ink border border-hairline hover:bg-cream-band active:scale-[0.98]",
  ghost: "bg-transparent text-coral hover:bg-coral-wash active:scale-[0.98]",
  whatsapp:
    "bg-coral text-white hover:bg-coral-dark active:scale-[0.98] shadow-sm text-base",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "h-9 px-4 text-sm rounded-md",
  md: "h-11 px-5 text-base rounded-lg",
  lg: "h-12 px-6 text-base rounded-lg",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center gap-2 font-semibold transition-all duration-150 ease-out",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral focus-visible:ring-offset-2",
          "disabled:pointer-events-none disabled:opacity-50",
          variantStyles[variant],
          sizeStyles[size],
          className,
        )}
        {...props}
      >
        {children}
      </button>
    );
  },
);

Button.displayName = "Button";
