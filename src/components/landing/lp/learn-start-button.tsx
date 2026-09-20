"use client";

import { TrackedLink } from "@/components/marketing/tracked-link";
import { trackMarketingEvent } from "@/lib/marketing-client";
import { LEARN_APP_HREF, LEARN_SIGNUP_HREF } from "@/lib/learn-curriculum";
import { cn } from "@/lib/utils";
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

  function trackClick(targetHref: string) {
    const path =
      typeof window !== "undefined" ? window.location.pathname : "/learn";
    void trackMarketingEvent({
      type: "redirect",
      slug: "learn",
      kind: "page",
      path,
      href: targetHref,
    });
  }

  if (asButton) {
    return (
      <button
        type="button"
        onClick={() => {
          trackClick(href);
          onClick?.();
        }}
        className={cn(ctaClass, className)}
      >
        {inner}
      </button>
    );
  }

  // Learning app is auth-gated — hard navigate avoids soft-router bounce loops.
  if (href === LEARN_APP_HREF || href.startsWith(`${LEARN_APP_HREF}?`)) {
    return (
      <a
        href={href}
        className={cn(ctaClass, className)}
        onClick={(e) => {
          e.preventDefault();
          trackClick(href);
          onClick?.();
          window.location.assign(href);
        }}
      >
        {inner}
      </a>
    );
  }

  return (
    <TrackedLink
      href={href}
      slug="learn"
      kind="page"
      content="cta"
      className={cn(ctaClass, className)}
      onClick={onClick}
    >
      {inner}
    </TrackedLink>
  );
}
