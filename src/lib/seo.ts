/**
 * Central SEO configuration — canonical production URL is always mentr.in (no www).
 * Feeds metadataBase, canonicals, the sitemap and robots.txt.
 */
import type { Metadata } from "next";

/** Hardcoded apex domain — AdSense and SEO require mentr.in, not www. */
export const SITE_URL = "https://mentr.in";

export const SITE_NAME = "Mentr";

/** Full consumer-facing brand — use in titles, metadata, and lockups. */
export const SITE_BRAND = "Mentr by Paprly";

export const PARENT_COMPANY_NAME = "Paprly";
export const PARENT_COMPANY_URL = "https://www.paprly.in";

export const GITHUB_REPO_URL =
  "https://github.com/adarshashokbaghel-code/mentr";

export const LINKEDIN_URL =
  "https://www.linkedin.com/company/mentrbypaprly/";

/** Personal LinkedIn of Mentr / Paprly creator */
export const CREATOR_LINKEDIN_URL =
  "https://www.linkedin.com/in/adarshsingh05";

export const CREATOR_NAME = "Adarsh Singh";
export const CREATOR_ROLE =
  "Creator of Mentr by Paprly · Software Engineer · Ex-Founding Engineer @ Paprly";
export const CREATOR_GITHUB_URL =
  "https://github.com/adarshashokbaghel-code";

/** Primary launch hub — local SEO pages still target this city. */
export const LAUNCH_HUB_CITY = "Bengaluru";

export const SITE_TAGLINE =
  "Find tutors & mentors near you or online — 100% free";

export const SITE_DESCRIPTION =
  "Find verified tutors & mentors free on Mentr — 200+ profiles, Instant Connect, WhatsApp after they accept. Also Mentr Learn: free Class 3–5 coding (CS, AI & Math) at mentr.in/learn. No fees, no commission.";

/** One sentence for landing subcopy. */
export const GLOBAL_REACH_LINE =
  "Mentr by Paprly helps parents find verified tutors and mentors — search by subject, try Instant Connect, or post a requirement. Free for both sides.";

export const SITE_KEYWORDS = [
  "Mentr by Paprly",
  "Paprly Mentr",
  "Paprly tutors",
  "mentr login",
  "find a mentor online in india",
  "best free platform to find mentors",
  "best free platform to find tutors",
  "100% free tutoring platform",
  "free tutor finder",
  "history tutors bangalore",
  "maths tutors bengaluru",
  `tutors in ${LAUNCH_HUB_CITY}`,
  "home tutors Bangalore",
  "online tutors India",
  "private tuition",
  "maths tutor near me",
  "physics tutor online",
  "free mentor finder",
  "UrbanPro free alternative",
  "TeacherOn alternative",
  "tuition teacher",
  "mentor for students free",
  "find online tutors",
  "find tutors online",
  "find online tutors verified",
  "find mentors near me",
  "online tutor jobs",
  "Instant Connect tutor",
  "coding for kids Class 5 free",
  "Mentr Learn",
  "Learn by Mentr",
  "mentr.in learn",
  "mentr.in/learn",
  "free coding kids Mentr Learn",
  "Paprly",
  "Mentr open source",
  "open source tutoring platform",
  "free open source mentor finder",
  "MIT licensed tutor platform",
  "contribute to Mentr",
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

/** Shared Open Graph fields for programmatic hub pages. */
export function hubOpenGraph(
  title: string,
  description: string,
  path: string,
): Metadata["openGraph"] {
  return {
    title,
    description,
    url: absoluteUrl(path),
    type: "website",
    siteName: SITE_BRAND,
  };
}

/** @deprecated Import from @/components/seo/google-verification */
export {
  ADSENSE_CLIENT_ID,
  ADSENSE_PUBLISHER_ID,
  GOOGLE_SITE_VERIFICATION,
} from "@/components/seo/google-verification";

/** Google Analytics measurement ID (gtag.js), e.g. G-ME7KM87RG4 */
export const GA_MEASUREMENT_ID =
  process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || "G-ME7KM87RG4";
