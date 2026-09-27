"use client";

import { isAnalyticsBlockedPath } from "@/lib/adsense-paths";
import { GA_MEASUREMENT_ID } from "@/lib/seo";
import Script from "next/script";
import { usePathname } from "next/navigation";

/**
 * Google Analytics on public, account, and checkout pages.
 * Skips /learn (child-directed) and admin surfaces.
 * Add ?ga_debug=1 to any URL once to stream events to GA4 DebugView.
 */
export function GoogleAnalytics() {
  const pathname = usePathname();

  if (process.env.NODE_ENV !== "production" || !GA_MEASUREMENT_ID) {
    return null;
  }
  if (isAnalyticsBlockedPath(pathname)) return null;

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
          window.gtag = gtag;
          var gaDebug = false;
          try {
            var qs = new URLSearchParams(window.location.search);
            if (qs.get('ga_debug') === '1') localStorage.setItem('mentr_ga_debug', '1');
            if (qs.get('ga_debug') === '0') localStorage.removeItem('mentr_ga_debug');
            gaDebug = localStorage.getItem('mentr_ga_debug') === '1';
          } catch (e) {}
          gtag('js', new Date());
          gtag('config', '${GA_MEASUREMENT_ID}', gaDebug ? { debug_mode: true } : {});
        `}
      </Script>
    </>
  );
}
