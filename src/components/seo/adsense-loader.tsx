"use client";

import { ADSENSE_CLIENT_ID } from "@/components/seo/google-verification";
import { isAdSenseBlockedPath } from "@/lib/adsense-paths";
import Script from "next/script";
import { usePathname } from "next/navigation";

/**
 * Path-aware AdSense script for adult/parent public pages only.
 * Never loads on /learn (child-directed) or private account surfaces.
 * Site ownership still uses the google-adsense-account meta tag in <head>.
 */
export function AdSenseLoader() {
  const pathname = usePathname();
  if (isAdSenseBlockedPath(pathname)) return null;

  return (
    <Script
      id="mentr-adsense"
      async
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT_ID}`}
      crossOrigin="anonymous"
      strategy="afterInteractive"
    />
  );
}
