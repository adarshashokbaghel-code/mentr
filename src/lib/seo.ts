/**
 * Central SEO configuration.
 *
 * Set NEXT_PUBLIC_SITE_URL in .env to the real production domain —
 * it feeds metadataBase, canonicals, the sitemap and robots.txt.
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://www.mentr.in"
).replace(/\/$/, "");

export const SITE_NAME = "Mentr";

/** Full consumer-facing brand — use in titles, metadata, and lockups. */
export const SITE_BRAND = "Mentr by Paprly";

export const PARENT_COMPANY_NAME = "Paprly";
export const PARENT_COMPANY_URL = "https://www.paprly.in";

/** Primary launch hub — local SEO pages still target this city. */
export const LAUNCH_HUB_CITY = "Bengaluru";

export const SITE_TAGLINE =
  "Find tutors & mentors near you or online — 100% free";

export const SITE_DESCRIPTION =
  "Mentr by Paprly is the free platform to find verified tutors — search locally, post your requirement, or connect online from any country. WhatsApp unlocks after they accept. No fees, no commission, ever.";

/** One sentence for landing subcopy. */
export const GLOBAL_REACH_LINE =
  "Mentr by Paprly is built for the world — parents and tutors connect in-person nearby or online across time zones, from any country.";

export const SITE_KEYWORDS = [
  "Mentr by Paprly",
  "Paprly Mentr",
  "Paprly tutors",
  "best free platform to find mentors",
  "best free platform to find tutors",
  "100% free tutoring platform",
  "free tutor finder",
  "online tutors worldwide",
  "global mentor platform",
  `tutors in ${LAUNCH_HUB_CITY}`,
  "home tutors Bangalore",
  "online tutors India",
  "private tuition",
  "maths tutor near me",
  "physics tutor online",
  "free mentor finder",
  "UrbanPro free alternative",
  "tuition teacher",
  "mentor for students free",
  "Paprly",
];

/** JSON-LD snippet for schema.org parentOrganization. */
export const PARENT_ORG_JSON_LD = {
  "@type": "Organization" as const,
  name: PARENT_COMPANY_NAME,
  url: PARENT_COMPANY_URL,
};

export function absoluteUrl(path = "/"): string {
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

/** Paste the content value from Google Search Console → HTML tag method. */
export const GOOGLE_SITE_VERIFICATION =
  process.env.GOOGLE_SITE_VERIFICATION || process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION;

/** Google Analytics measurement ID (gtag.js), e.g. G-ME7KM87RG4 */
export const GA_MEASUREMENT_ID =
  process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || "G-ME7KM87RG4";
