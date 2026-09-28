"use client";

import { isAdSenseBlockedPath } from "@/lib/adsense-paths";
import { usePathname } from "next/navigation";

const MONETAG_ZONE = "288113";

/**
 * Monetag Multitag — same page allowlist as AdSense (never on /learn,
 * account, checkout or admin surfaces). /sw.js in public/ must stay for
 * the push-notification format.
 *
 * Plain async <script> (not next/script) so React server-renders it into
 * <head>; Monetag's installation checker reads the raw HTML.
 */
export function MonetagLoader() {
  const pathname = usePathname();
  if (process.env.NODE_ENV !== "production") return null;
  if (isAdSenseBlockedPath(pathname)) return null;

  return (
    <script
      async
      src="https://quge5.com/88/tag.min.js"
      data-zone={MONETAG_ZONE}
      data-cfasync="false"
    />
  );
}
