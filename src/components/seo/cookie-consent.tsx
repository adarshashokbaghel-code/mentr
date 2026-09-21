"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

const CONSENT_KEY = "mentr_cookie_consent";

export function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const acceptRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    try {
      if (!localStorage.getItem(CONSENT_KEY)) {
        setVisible(true);
      }
    } catch {
      setVisible(true);
    }
  }, []);

  const dismiss = useCallback((value: "accepted" | "dismissed") => {
    try {
      localStorage.setItem(CONSENT_KEY, value);
    } catch {
      // Ignore storage failures — banner can still dismiss for this session.
    }
    setVisible(false);
    if (value === "accepted") {
      window.dispatchEvent(new Event("mentr-cookie-accepted"));
    }
  }, []);

  useEffect(() => {
    if (!visible) return;
    const previousFocus = document.activeElement;
    acceptRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") dismiss("dismissed");
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      // Only restore if focus was lost with the banner, not moved elsewhere.
      if (
        previousFocus instanceof HTMLElement &&
        previousFocus.isConnected &&
        (!document.activeElement || document.activeElement === document.body)
      ) {
        previousFocus.focus();
      }
    };
  }, [visible, dismiss]);

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label="Cookie notice"
      aria-describedby="cookie-notice-description"
      className="fixed inset-x-0 bottom-0 z-[250] box-border w-full max-w-[100vw] overflow-x-hidden border-t border-hairline bg-white/95 px-4 py-3 shadow-[0_-8px_30px_rgba(28,26,23,0.08)] backdrop-blur-sm short:py-2.5 sm:p-5"
      data-cookie-consent=""
    >
      <div className="mx-auto flex w-full min-w-0 max-w-[1400px] flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
        <p
          id="cookie-notice-description"
          className="min-w-0 max-w-3xl text-sm leading-relaxed text-muted"
        >
          We use cookies for sign-in, Google Analytics, and Google AdSense ads on
          public pages (home, blog, guides). Ads help keep Mentr free. See our{" "}
          <Link
            href="/privacy"
            className="font-semibold text-ink underline-offset-2 hover:underline"
          >
            Privacy policy
          </Link>{" "}
          for details, opt-out links, and how Google uses data for advertising.
        </p>
        <div className="flex shrink-0 flex-wrap items-center gap-2">
          <Button
            size="sm"
            variant="secondary"
            onClick={() => dismiss("dismissed")}
          >
            Dismiss
          </Button>
          <Button ref={acceptRef} size="sm" onClick={() => dismiss("accepted")}>
            Got it
          </Button>
        </div>
      </div>
    </div>
  );
}
