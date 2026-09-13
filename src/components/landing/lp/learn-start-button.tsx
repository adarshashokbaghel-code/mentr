import { LEARN_SIGNUP_HREF } from "@/lib/learn-curriculum";
import { cn } from "@/lib/utils";
import Link from "next/link";
import type { ReactNode } from "react";

function ArrowIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M14.43 5.93 20.5 12l-6.07 6.07"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M3.5 12h16.83"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function LearnStartButton({
  href = LEARN_SIGNUP_HREF,
  children = "Get started for free",
  className,
  onClick,
  asButton = false,
  variant = "default",
}: {
  href?: string;
  children?: ReactNode;
  className?: string;
  onClick?: () => void;
  /** Use a button instead of a link (e.g. open enroll modal) */
  asButton?: boolean;
  /** Green enrolled / explore CTA */
  variant?: "default" | "enrolled";
}) {
  const ctaClass =
    variant === "enrolled" ? "learn-hk-cta learn-hk-cta--enrolled" : "learn-hk-cta";

  const inner = (
    <>
      <span className="learn-hk-cta-label">{children}</span>
      <span className="learn-hk-cta-arrow">
        <ArrowIcon />
      </span>
    </>
  );

  if (asButton) {
    return (
      <button
        type="button"
        onClick={onClick}
        className={cn(ctaClass, className)}
      >
        {inner}
      </button>
    );
  }

  return (
    <Link href={href} onClick={onClick} className={cn(ctaClass, className)}>
      {inner}
    </Link>
  );
}
