import { getArticleContent } from "./blog-content";
import type { BlogPost, FunnelStage } from "./blog-posts";
import { BLOG_POSTS } from "./blog-posts";

/** Parse YYYY-MM-DD as local calendar date (avoids UTC timezone shift). */
export function parseBlogDate(iso: string): Date {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d);
}

export function formatBlogDate(
  iso: string,
  style: "short" | "long" = "short",
): string {
  return parseBlogDate(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: style === "long" ? "long" : "short",
    year: "numeric",
  });
}

export function sortPostsByDate(
  posts: BlogPost[],
  order: "newest" | "oldest" = "newest",
): BlogPost[] {
  return [...posts].sort((a, b) => {
    const da = parseBlogDate(getArticleContent(a.slug).publishedAt).getTime();
    const db = parseBlogDate(getArticleContent(b.slug).publishedAt).getTime();
    return order === "newest" ? db - da : da - db;
  });
}

export function getNewestFeaturedPost(): BlogPost | undefined {
  const featured = BLOG_POSTS.filter((p) => p.featured);
  if (featured.length === 0) return undefined;
  return sortPostsByDate(featured, "newest")[0];
}

export function filterPostsByQuery(
  posts: BlogPost[],
  query: string,
): BlogPost[] {
  const q = query.trim().toLowerCase();
  if (!q) return posts;
  return posts.filter((p) => {
    const hay =
      `${p.title} ${p.description} ${p.keyword} ${p.pillar}`.toLowerCase();
    return hay.includes(q);
  });
}

export function filterPostsByFunnel(
  posts: BlogPost[],
  funnel: FunnelStage | "all",
): BlogPost[] {
  if (funnel === "all") return posts;
  return posts.filter((p) => p.funnel === funnel);
}
