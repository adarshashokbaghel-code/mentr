"use client";

import { isAdSenseBlockedPath } from "@/lib/adsense-paths";
import { GA_MEASUREMENT_ID } from "@/lib/seo";
import Script from "next/script";
import { usePathname } from "next/navigation";

/**
 * Google Analytics on adult/parent public pages only.
 * Skips /learn (child-directed) and private account surfaces — same paths as AdSense.
 */
export function GoogleAnalytics() {
  const pathname = usePathname();

  if (process.env.NODE_ENV !== "production" || !GA_MEASUREMENT_ID) {
    return null;
  }
  if (isAdSenseBlockedPath(pathname)) return null;

  return (
    <>
      <Script
        async
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_MEASUREMENT_ID}');
        `}
      </Script>
    </>
  );
}
