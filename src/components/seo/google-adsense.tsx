import { ADSENSE_CLIENT_ID } from "@/lib/seo";

/** Google AdSense site verification — production only, literal <script> in <head>. */
export function GoogleAdSense() {
  if (process.env.NODE_ENV !== "production" || !ADSENSE_CLIENT_ID) {
    return null;
  }

  // Must be a plain script tag — Next.js <Script> injects via __next_s and AdSense
  // verification cannot detect it.
  return (
    <script
      async
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT_ID}`}
      crossOrigin="anonymous"
    />
  );
}
