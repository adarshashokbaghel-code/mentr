"use client";

import { BlogComparisonCard } from "@/components/blog/blog-comparison-card";
import { BlogPostCard } from "@/components/blog/blog-post-card";
import {
  BlogSearchToolbar,
  type BlogSort,
} from "@/components/blog/blog-search-toolbar";
import type { BlogPost, BlogPillarId, FunnelStage } from "@/lib/blog-posts";
import {
  filterPostsByFunnel,
  filterPostsByQuery,
  sortPostsByDate,
} from "@/lib/blog-utils";
import { useMemo, useState } from "react";

type Props = {
  posts: BlogPost[];
  pillar: BlogPillarId | "all";
};

export function BlogFeed({ posts, pillar }: Props) {
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<BlogSort>("newest");
  const [funnel, setFunnel] = useState<FunnelStage | "all">("all");

  const filtered = useMemo(() => {
    let result = filterPostsByQuery(posts, query);
    result = filterPostsByFunnel(result, funnel);
    return sortPostsByDate(result, sort);
  }, [posts, query, funnel, sort]);

  return (
    <>
      <BlogSearchToolbar
        query={query}
        onQueryChange={setQuery}
        sort={sort}
        onSortChange={setSort}
        funnel={funnel}
        onFunnelChange={setFunnel}
        resultCount={filtered.length}
        totalCount={posts.length}
      />

      {filtered.length > 0 ? (
        pillar === "comparison" ? (
          <div className="flex flex-col gap-4">
            {filtered.map((post) => (
              <BlogComparisonCard key={post.slug} post={post} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
            {filtered.map((post) => (
              <BlogPostCard key={post.slug} post={post} />
            ))}
          </div>
        )
      ) : (
        <div className="rounded-2xl border-2 border-dashed border-ink/20 bg-white px-6 py-12 text-center">
          <p className="text-base font-semibold text-ink">No guides match</p>
          <p className="mt-2 text-sm text-muted">
            Try a different search term or clear your filters.
          </p>
        </div>
      )}
    </>
  );
}
