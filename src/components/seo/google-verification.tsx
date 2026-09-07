/**
 * Hardcoded Google verification tags — no env vars required on production.
 *
 * AdSense "Meta tag" method → google-adsense-account (publisher client ID)
 * Search Console "HTML tag" method → google-site-verification (paste token below when available)
 */

/** AdSense publisher client ID — site connection + ads loader */
export const ADSENSE_CLIENT_ID = "ca-pub-4918938808225819";

/** ads.txt publisher ID (same account, pub- prefix) */
export const ADSENSE_PUBLISHER_ID = "pub-4918938808225819";

/**
 * Search Console ownership token (content value only, not the full meta tag).
 * Get from: Search Console → Settings → Ownership verification → HTML tag
 * Leave empty until you add mentr.in in GSC; AdSense does not require this tag.
 */
export const GOOGLE_SITE_VERIFICATION = "";

export function GoogleVerificationTags() {
  return (
    <>
      <meta name="google-adsense-account" content={ADSENSE_CLIENT_ID} />
      {GOOGLE_SITE_VERIFICATION ? (
        <meta name="google-site-verification" content={GOOGLE_SITE_VERIFICATION} />
      ) : null}
    </>
  );
}
