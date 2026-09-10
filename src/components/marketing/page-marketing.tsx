"use client";

import {
  captureUrlAttribution,
  persistAttribution,
  trackMarketingEvent,
} from "@/lib/marketing-client";
import type { MarketingKind } from "@/lib/marketing-utm";
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
    captureUrlAttribution();
    persistAttribution({ slug, kind, path });

    const timer = window.setTimeout(() => {
      void trackMarketingEvent({ type: "view", slug, kind, path });
    }, 400);

    return () => window.clearTimeout(timer);
  }, [slug, kind, path]);

  return null;
}

/** Persist inbound UTM on every route so signup still attributes after navigation. */
export function AttributionCapture() {
  useEffect(() => {
    captureUrlAttribution();
  }, []);

  return null;
}
