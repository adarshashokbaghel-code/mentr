import Script from "next/script";
import { ADSENSE_CLIENT_ID } from "@/lib/seo";

/** Google AdSense site verification — production only, injected in <head>. */
export function GoogleAdSense() {
  if (process.env.NODE_ENV !== "production" || !ADSENSE_CLIENT_ID) {
    return null;
  }

  return (
    <Script
      id="google-adsense"
      async
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT_ID}`}
      crossOrigin="anonymous"
      strategy="beforeInteractive"
    />
  );
}
