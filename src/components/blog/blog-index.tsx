import { BlogComparisonCard } from "@/components/blog/blog-comparison-card";
import { BlogComparisonGlance } from "@/components/blog/blog-comparison-glance";
import { BlogFeaturedCard } from "@/components/blog/blog-featured-card";
import { BlogFilterBar } from "@/components/blog/blog-filter-bar";
import { BlogHeader } from "@/components/blog/blog-header";
import { BlogPostCard } from "@/components/blog/blog-post-card";
import { BlogShell } from "@/components/blog/blog-shell";
import { BLOG_PILLARS } from "@/lib/blog-posts";
import { postsByPillar, type BlogPillarId } from "@/lib/blog-posts";
import Link from "next/link";

type Props = {
  pillar?: BlogPillarId | "all";
};

export function BlogIndex({ pillar = "all" }: Props) {
  const posts = postsByPillar(pillar);
  const featured = pillar === "all" ? posts.find((p) => p.featured) : undefined;
  const listPosts =
    pillar === "all" && featured
      ? posts.filter((p) => p.slug !== featured.slug)
      : posts;

  return (
    <div className="w-full">
      <BlogHeader pillar={pillar} />
      <BlogFilterBar activePillar={pillar} />

      <BlogShell activePillar={pillar === "all" ? undefined : pillar}>
        {pillar === "comparison" && (
          <div className="mb-8 sm:mb-10">
            <BlogComparisonGlance />
          </div>
        )}

        {featured && (
          <div className="mb-8 sm:mb-10">
            <BlogFeaturedCard post={featured} />
          </div>
        )}

        {listPosts.length > 0 && (
          <>
            {(featured || pillar === "comparison") && (
              <p className="mb-4 text-xs font-bold uppercase tracking-wider text-muted sm:mb-5">
                {pillar === "comparison" ? "All comparisons" : featured ? "More guides" : "Articles"}
              </p>
            )}
            {pillar === "comparison" ? (
              <div className="flex flex-col gap-4">
                {listPosts.map((post) => (
                  <BlogComparisonCard key={post.slug} post={post} />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
                {listPosts.map((post) => (
                  <BlogPostCard key={post.slug} post={post} />
                ))}
              </div>
            )}
          </>
        )}

        {listPosts.length === 0 && !featured && (
          <p className="py-12 text-center text-muted sm:py-16">
            No guides here yet.
          </p>
        )}

        {/* Mobile category links — sidebar is desktop-only */}
        <nav
          aria-label="Browse by topic"
          className="mt-10 border-t-2 border-ink/10 pt-8 xl:hidden"
        >
          <p className="text-xs font-bold uppercase tracking-wider text-muted">
            Browse by topic
          </p>
          <ul className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
            {BLOG_PILLARS.map((p) => (
              <li key={p.id}>
                <Link
                  href={`/blog/category/${p.id}`}
                  className="flex min-h-11 items-center justify-center rounded-xl border-2 border-ink/15 bg-white px-3 py-2.5 text-center text-sm font-semibold text-ink touch-manipulation active:scale-[0.98] hover:border-ink/40"
                >
                  {p.shortLabel}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </BlogShell>
    </div>
  );
}
