export type MarketingKind = "blog" | "page" | "social";

const SLUG_RE = /^[a-z0-9][a-z0-9-]{0,118}$/;
const BLOG_PATH = /\/blog\/([a-z0-9][a-z0-9-]{0,118})/i;
const SOCIAL_SOURCES = new Set(["instagram", "linkedin", "insta", "ig", "li"]);
const CHANNEL_SLUGS = new Set(["instagram", "linkedin"]);

export function sanitizeMarketingSlug(value: unknown): string | undefined {
  if (typeof value !== "string") return undefined;
  const slug = value.trim().toLowerCase();
  return SLUG_RE.test(slug) ? slug : undefined;
}

export function sanitizeMarketingKind(
  value: unknown,
): MarketingKind | undefined {
  return value === "blog" || value === "page" || value === "social"
    ? value
    : undefined;
}

export function normalizeSocialSource(
  source?: string | null,
): "instagram" | "linkedin" | undefined {
  const s = source?.toLowerCase();
  if (!s) return undefined;
  if (s === "instagram" || s === "insta" || s === "ig") return "instagram";
  if (s === "linkedin" || s === "li") return "linkedin";
  return undefined;
}

/**
 * Social attribution:
 * - Generic bio/page links → slug = channel (instagram | linkedin)
 * - Per-post stored links → slug = utm_campaign (unique post id)
 */
export function parseAcquisitionFromUrl(raw?: string | null): {
  slug?: string;
  kind?: MarketingKind | "referral";
  channel?: "instagram" | "linkedin";
} {
  if (!raw) return {};
  try {
    const url = new URL(raw);
    const campaign = sanitizeMarketingSlug(url.searchParams.get("utm_campaign"));
    const source = url.searchParams.get("utm_source")?.toLowerCase();
    const medium = url.searchParams.get("utm_medium")?.toLowerCase();
    const ref = url.searchParams.get("ref");
    const blogMatch = url.pathname.match(
      /^\/blog\/([a-z0-9][a-z0-9-]{0,118})/i,
    );
    const blogSlug = blogMatch
      ? sanitizeMarketingSlug(blogMatch[1])
      : undefined;

    const social = normalizeSocialSource(source);
    if (
      social ||
      medium === "social" ||
      (source != null && SOCIAL_SOURCES.has(source))
    ) {
      const channel =
        social || normalizeSocialSource(campaign) || "instagram";
      // Prefer specific post campaign when it isn't just the channel name
      const slug =
        campaign && !CHANNEL_SLUGS.has(campaign) ? campaign : channel;
      return { slug, kind: "social", channel };
    }

    if (blogSlug) return { slug: blogSlug, kind: "blog" };
    if (campaign) {
      if (CHANNEL_SLUGS.has(campaign)) {
        return {
          slug: campaign,
          kind: "social",
          channel: campaign as "instagram" | "linkedin",
        };
      }
      const kind: MarketingKind | "referral" =
        source === "blog" || source === "article"
          ? "blog"
          : source === "referral"
            ? "referral"
            : "page";
      return { slug: campaign, kind };
    }
    if (ref) return { kind: "referral" };
    return {};
  } catch {
    const blogMatch = raw.match(BLOG_PATH);
    const blogSlug = blogMatch
      ? sanitizeMarketingSlug(blogMatch[1])
      : undefined;
    return blogSlug ? { slug: blogSlug, kind: "blog" } : {};
  }
}
