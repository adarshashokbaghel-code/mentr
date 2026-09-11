import { SITE_URL } from "@/lib/seo";

export type MarketingKind = "blog" | "page";

export type UtmParams = {
  source: string;
  medium: string;
  campaign: string;
  content?: string;
};

const SLUG_RE = /^[a-z0-9][a-z0-9-]{0,118}$/;

export function isMarketingSlug(value: string): boolean {
  return SLUG_RE.test(value);
}

export function sanitizeMarketingSlug(value: unknown): string | undefined {
  if (typeof value !== "string") return undefined;
  const slug = value.trim().toLowerCase();
  return isMarketingSlug(slug) ? slug : undefined;
}

export function defaultUtmFor(
  kind: MarketingKind,
  slug: string,
  content?: string,
): UtmParams {
  return {
    source: kind === "blog" ? "blog" : "page",
    medium: kind === "blog" ? "article" : "landing",
    campaign: slug,
    ...(content ? { content } : {}),
  };
}

/** Append UTM query params without dropping existing search/hash. */
export function withUtm(href: string, utm: UtmParams): string {
  const hashIndex = href.indexOf("#");
  const hash = hashIndex >= 0 ? href.slice(hashIndex) : "";
  const withoutHash = hashIndex >= 0 ? href.slice(0, hashIndex) : href;

  try {
    const url = new URL(withoutHash, SITE_URL);
    url.searchParams.set("utm_source", utm.source);
    url.searchParams.set("utm_medium", utm.medium);
    url.searchParams.set("utm_campaign", utm.campaign);
    if (utm.content) url.searchParams.set("utm_content", utm.content);
    const path = `${url.pathname}${url.search}`;
    return href.startsWith("http") ? `${url.toString()}${hash}` : `${path}${hash}`;
  } catch {
    return href;
  }
}

export function withBlogUtm(href: string, slug: string, content?: string): string {
  return withUtm(href, defaultUtmFor("blog", slug, content));
}

export function withPageUtm(href: string, slug: string, content?: string): string {
  return withUtm(href, defaultUtmFor("page", slug, content));
}

export function absoluteUtmUrl(path: string, utm: UtmParams): string {
  const relative = withUtm(path.startsWith("/") ? path : `/${path}`, utm);
  return relative.startsWith("http") ? relative : `${SITE_URL}${relative}`;
}

export function blogShareUrl(slug: string): string {
  return absoluteUtmUrl(`/blog/${slug}`, {
    source: "blog",
    medium: "share",
    campaign: slug,
    content: "admin",
  });
}

export function blogParentSignupUrl(slug: string): string {
  return absoluteUtmUrl("/parent/signup", defaultUtmFor("blog", slug, "signup"));
}

export function blogFacultySignupUrl(slug: string): string {
  return absoluteUtmUrl("/faculty/signup", defaultUtmFor("blog", slug, "signup"));
}

export function pageShareUrl(path: string, slug: string): string {
  return absoluteUtmUrl(path, {
    source: "page",
    medium: "share",
    campaign: slug,
    content: "admin",
  });
}

export type ParsedAcquisition = {
  slug?: string;
  kind?: MarketingKind | "referral";
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
};

/** Read UTM / blog path / ref from a stored signup URL. */
export function parseAcquisitionFromUrl(raw?: string | null): ParsedAcquisition {
  if (!raw) return {};
  try {
    const url = new URL(raw, SITE_URL);
    const utmSource = url.searchParams.get("utm_source")?.toLowerCase() || undefined;
    const utmMedium = url.searchParams.get("utm_medium")?.toLowerCase() || undefined;
    const utmCampaign = sanitizeMarketingSlug(url.searchParams.get("utm_campaign"));
    const ref = url.searchParams.get("ref");
    const blogMatch = url.pathname.match(/^\/blog\/([a-z0-9][a-z0-9-]{0,118})/i);
    const blogSlug = blogMatch
      ? sanitizeMarketingSlug(blogMatch[1])
      : undefined;

    if (blogSlug) {
      return {
        slug: blogSlug,
        kind: "blog",
        utmSource,
        utmMedium,
        utmCampaign: utmCampaign || blogSlug,
      };
    }

    if (utmCampaign) {
      const kind: MarketingKind | "referral" =
        utmSource === "blog" || utmSource === "article"
          ? "blog"
          : utmSource === "referral"
            ? "referral"
            : "page";
      return { slug: utmCampaign, kind, utmSource, utmMedium, utmCampaign };
    }

    if (ref) {
      return { kind: "referral", utmSource, utmMedium, utmCampaign };
    }

    return { utmSource, utmMedium, utmCampaign };
  } catch {
    const blogMatch = raw.match(/\/blog\/([a-z0-9][a-z0-9-]{0,118})/i);
    const blogSlug = blogMatch ? sanitizeMarketingSlug(blogMatch[1]) : undefined;
    return blogSlug ? { slug: blogSlug, kind: "blog" } : {};
  }
}

export const MARKETING_PAGES = [
  { slug: "blog-index", title: "Blog index", path: "/blog" },
  { slug: "parents", title: "Parents landing", path: "/parents" },
  { slug: "for-faculty", title: "Faculty landing", path: "/for-faculty" },
  { slug: "open-source", title: "Open source", path: "/open-source" },
  { slug: "contact", title: "Contact / request a feature", path: "/contact" },
  { slug: "request-feature", title: "Request a feature", path: "/request-feature" },
  { slug: "blog-category-for-parents", title: "Blog · For parents", path: "/blog/category/for-parents" },
  { slug: "blog-category-for-students", title: "Blog · For students", path: "/blog/category/for-students" },
  { slug: "blog-category-comparison", title: "Blog · Comparisons", path: "/blog/category/comparison" },
  { slug: "blog-category-exam-prep", title: "Blog · Exam prep", path: "/blog/category/exam-prep" },
  { slug: "blog-category-for-tutors", title: "Blog · For tutors", path: "/blog/category/for-tutors" },
  { slug: "blog-category-trust-safety", title: "Blog · Trust & safety", path: "/blog/category/trust-safety" },
  { slug: "blog-category-career-mentoring", title: "Blog · Career mentoring", path: "/blog/category/career-mentoring" },
  { slug: "blog-category-local-guides", title: "Blog · Local guides", path: "/blog/category/local-guides" },
] as const;
