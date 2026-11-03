"use client";

import {
  captureLandingTouch,
  captureUrlAttribution,
  persistAttribution,
  trackMarketingEvent,
} from "@/lib/marketing-client";
import {
  parseAcquisitionFromUrl,
  type MarketingKind,
} from "@/lib/marketing-utm";
import { useEffect } from "react";

/**
 * Drop on any public page. New blogs inherit this from /blog/[slug].
 * New landing pages: <PageMarketing slug="my-page" path="/my-page" />
 */
export function PageMarketing({
  slug,
  path,
  kind = "page",
}: {
  slug: string;
  path: string;
  kind?: MarketingKind;
}) {
  useEffect(() => {
    const captured = captureUrlAttribution();
    // A Google click must survive this page's own slug, through signup.
    if (captured?.kind !== "ads") {
      persistAttribution({ slug, kind, path });
    }

    const timer = window.setTimeout(() => {
      const current = parseAcquisitionFromUrl(window.location.href);
      const fromAd = current.kind === "ads" && current.slug;
      void trackMarketingEvent({
        type: "view",
        slug: fromAd ? current.slug! : slug,
        kind: fromAd ? "ads" : kind,
        path,
      });
    }, 400);

    return () => window.clearTimeout(timer);
  }, [slug, kind, path]);

  return null;
}

/** Persist inbound UTM on every route so signup still attributes after navigation. */
export function AttributionCapture() {
  useEffect(() => {
    captureLandingTouch();
    captureUrlAttribution();
  }, []);

  return null;
}
