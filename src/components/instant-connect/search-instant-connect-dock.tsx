"use client";

import { InstantConnectDock } from "@/components/instant-connect/instant-connect-dock";
import { useShortlist } from "@/components/search/shortlist-context";

/** Hides the IC dock while the shortlist compare bar is visible. */
export function SearchInstantConnectDock() {
  const { ids } = useShortlist();
  if (ids.length > 0) return null;
  return <InstantConnectDock />;
}
