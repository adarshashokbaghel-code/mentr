"use client";

import { Button } from "@/components/ui/button";
import { isAdSenseBlockedPath } from "@/lib/adsense-paths";
import { ADSENSE_ENABLED, GA_MEASUREMENT_ID } from "@/lib/site-scripts";
import { X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

const CONSENT_KEY = "mentr_cookie_consent";

export function CookieConsent() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);

  // No analytics/ads on Learn or private paths — skip the banner there.
  const skip = isAdSenseBlockedPath(pathname);

  useEffect(() => {
    if (skip) {
      setVisible(false);
      return;
    }
    try {
      if (!localStorage.getItem(CONSENT_KEY)) {
        setVisible(true);
      }
    } catch {
      setVisible(true);
    }
  }, [skip]);

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
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") dismiss("dismissed");
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [visible, dismiss]);

  if (skip || !visible) return null;

  const thirdParty = ADSENSE_ENABLED || Boolean(GA_MEASUREMENT_ID);

  return (
    <div
      role="region"
      aria-label="Cookie notice"
      className="pointer-events-none fixed inset-x-0 bottom-0 z-[250] px-3 pb-[calc(0.75rem+env(safe-area-inset-bottom,0px))] sm:px-5 sm:pb-5"
      data-cookie-consent=""
    >
      <div className="pointer-events-auto mx-auto flex w-full max-w-[1100px] items-center gap-3 rounded-xl border border-hairline bg-white py-2.5 pl-3.5 pr-2 shadow-[0_6px_24px_rgba(28,26,23,0.14)] sm:gap-4 sm:py-3 sm:pl-5 sm:pr-3">
        <p className="min-w-0 flex-1 text-xs leading-snug text-muted sm:text-sm sm:leading-relaxed">
          <span className="sm:hidden">
            We use cookies to keep you signed in
            {thirdParty ? " and for analytics or ads on public pages" : ""}.{" "}
            <Link
              href="/cookie-policy"
              className="font-semibold text-ink underline underline-offset-2"
            >
              Learn more
            </Link>
          </span>
          <span className="hidden sm:inline">
            We use cookies for sign-in and site functionality
            {thirdParty
              ? ", and on public parent/tutor pages Google Analytics and/or AdSense"
              : ""}
            . We do not run third-party ads on Mentr Learn. See our{" "}
            <Link
              href="/privacy"
              className="font-semibold text-ink underline-offset-2 hover:underline"
            >
              Privacy policy
            </Link>{" "}
            and{" "}
            <Link
              href="/cookie-policy"
              className="font-semibold text-ink underline-offset-2 hover:underline"
            >
              Cookie policy
            </Link>
            .
          </span>
        </p>
        <div className="flex shrink-0 items-center gap-1 sm:gap-2">
          <Button
            size="sm"
            className="h-8 px-3.5 text-xs sm:h-9 sm:text-sm"
            onClick={() => dismiss("accepted")}
          >
            Got it
          </Button>
          <button
            type="button"
            aria-label="Dismiss cookie notice"
            onClick={() => dismiss("dismissed")}
            className="flex h-8 w-8 items-center justify-center rounded-full text-muted transition hover:bg-cream hover:text-ink sm:h-9 sm:w-9"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
