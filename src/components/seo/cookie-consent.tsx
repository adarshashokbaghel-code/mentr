"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useEffect, useState } from "react";

const CONSENT_KEY = "mentr_cookie_consent";

export function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem(CONSENT_KEY)) {
        setVisible(true);
      }
    } catch {
      setVisible(true);
    }
  }, []);

  function accept() {
    try {
      localStorage.setItem(CONSENT_KEY, "accepted");
    } catch {
      // Ignore storage failures — banner can still dismiss for this session.
    }
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label="Cookie notice"
      className="fixed inset-x-0 bottom-0 z-[250] border-t border-hairline bg-white/95 p-4 shadow-[0_-8px_30px_rgba(28,26,23,0.08)] backdrop-blur-sm sm:p-5"
    >
      <div className="mx-auto flex max-w-[1400px] flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="max-w-3xl text-sm leading-relaxed text-muted">
          We use cookies for sign-in, Google Analytics, and Google AdSense ads
          on public pages. See our{" "}
          <Link
            href="/privacy"
            className="font-semibold text-ink underline-offset-2 hover:underline"
          >
            Privacy policy
          </Link>{" "}
          for details and opt-out links.
        </p>
        <div className="flex shrink-0 items-center gap-2">
          <Button size="sm" onClick={accept}>
            Got it
          </Button>
        </div>
      </div>
    </div>
  );
}
