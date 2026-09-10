export type MarketingKind = "blog" | "page";

const SLUG_RE = /^[a-z0-9][a-z0-9-]{0,118}$/;
const BLOG_PATH = /\/blog\/([a-z0-9][a-z0-9-]{0,118})/i;

export function sanitizeMarketingSlug(value: unknown): string | undefined {
  if (typeof value !== "string") return undefined;
  const slug = value.trim().toLowerCase();
  return SLUG_RE.test(slug) ? slug : undefined;
}

export function sanitizeMarketingKind(value: unknown): MarketingKind | undefined {
  return value === "blog" || value === "page" ? value : undefined;
}

export function parseAcquisitionFromUrl(raw?: string | null): {
  slug?: string;
  kind?: MarketingKind | "referral";
} {
  if (!raw) return {};
  try {
    const url = new URL(raw);
    const campaign = sanitizeMarketingSlug(url.searchParams.get("utm_campaign"));
    const source = url.searchParams.get("utm_source")?.toLowerCase();
    const ref = url.searchParams.get("ref");
    const blogMatch = url.pathname.match(/^\/blog\/([a-z0-9][a-z0-9-]{0,118})/i);
    const blogSlug = blogMatch ? sanitizeMarketingSlug(blogMatch[1]) : undefined;

    if (blogSlug) return { slug: blogSlug, kind: "blog" };
    if (campaign) {
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
    const blogSlug = blogMatch ? sanitizeMarketingSlug(blogMatch[1]) : undefined;
    return blogSlug ? { slug: blogSlug, kind: "blog" } : {};
  }
}
