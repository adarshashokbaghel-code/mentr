import {
  BLOG_PILLARS,
  BLOG_POSTS,
  featuredPosts,
  postsByPillar,
} from "@/lib/blog-posts";
import { hardShadowSm } from "@/components/landing/lp/shared";
import { cn } from "@/lib/utils";
import Link from "next/link";

type Props = {
  activePillar?: string;
  className?: string;
};

export function BlogSidebar({ activePillar, className }: Props) {
  const featured = featuredPosts();

  return (
    <aside className={cn("space-y-6", className)}>
      <div className={cn("rounded-2xl border-2 border-ink bg-white p-5", hardShadowSm)}>
        <h2 className="text-xs font-bold uppercase tracking-wider text-muted">
          Categories
        </h2>
        <ul className="mt-3 space-y-0.5">
          <li>
            <Link
              href="/blog"
              className={cn(
                "flex min-h-11 items-center rounded-lg px-3 py-2.5 text-sm transition touch-manipulation",
                !activePillar
                  ? "bg-coral-wash font-semibold text-coral"
                  : "text-ink hover:bg-cream hover:text-coral active:bg-cream-band",
              )}
            >
              All posts
              <span className="ml-1.5 text-muted">({BLOG_POSTS.length})</span>
            </Link>
          </li>
          {BLOG_PILLARS.map((pillar) => (
            <li key={pillar.id}>
              <Link
                href={`/blog/category/${pillar.id}`}
                className={cn(
                  "flex min-h-11 items-center rounded-lg px-3 py-2.5 text-sm transition touch-manipulation",
                  activePillar === pillar.id
                    ? "bg-coral-wash font-semibold text-coral"
                    : "text-ink hover:bg-cream hover:text-coral active:bg-cream-band",
                )}
              >
                {pillar.shortLabel}
                <span className="ml-1.5 text-muted">
                  ({postsByPillar(pillar.id).length})
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div className={cn("rounded-2xl border-2 border-ink bg-white p-5", hardShadowSm)}>
        <h2 className="text-xs font-bold uppercase tracking-wider text-muted">
          Popular guides
        </h2>
        <ul className="mt-3 space-y-3">
          {featured.map((post) => (
            <li key={post.slug}>
              <Link
                href={`/blog/${post.slug}`}
                className="group block text-sm leading-snug text-ink hover:text-coral"
              >
                <span className="font-medium group-hover:underline">
                  {post.title}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div className={cn("rounded-2xl border-2 border-ink bg-coral-wash p-5", hardShadowSm)}>
        <p className="text-sm font-semibold text-ink">Find a tutor free</p>
        <p className="mt-1.5 text-xs leading-relaxed text-muted">
          Search verified tutors in Bengaluru and online. No fees, no commission.
        </p>
        <Link
          href="/search"
          className="mt-3 inline-flex min-h-11 items-center text-sm font-semibold text-coral touch-manipulation hover:underline active:opacity-80"
        >
          Search tutors →
        </Link>
      </div>
    </aside>
  );
}
