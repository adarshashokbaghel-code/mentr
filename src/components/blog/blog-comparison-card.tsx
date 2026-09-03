import { hardShadowSm } from "@/components/landing/lp/shared";
import { getArticleContent } from "@/lib/blog-content";
import type { BlogPost } from "@/lib/blog-posts";
import { formatBlogDate } from "@/lib/blog-utils";
import { cn } from "@/lib/utils";
import { ArrowRight, Clock } from "lucide-react";
import Link from "next/link";

export function BlogComparisonCard({ post }: { post: BlogPost }) {
  const content = getArticleContent(post.slug);
  const date = formatBlogDate(content.publishedAt);

  return (
    <article className="group">
      <Link
        href={`/blog/${post.slug}`}
        className={cn(
          "flex flex-col gap-3 rounded-2xl border-2 border-ink bg-white p-5 transition active:scale-[0.99] sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:p-6 touch-manipulation hover:-translate-y-0.5",
          hardShadowSm,
        )}
      >
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2 text-xs text-muted">
            <span className="rounded-full bg-butter px-2.5 py-0.5 font-semibold text-ink">
              Comparison
            </span>
            <time dateTime={content.publishedAt}>{date}</time>
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {content.readTimeMinutes} min
            </span>
          </div>
          <h3 className="mt-2 text-base font-bold leading-snug text-ink transition group-hover:text-coral sm:text-lg">
            {post.title}
          </h3>
          <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-muted sm:line-clamp-1">
            {post.description}
          </p>
        </div>
        <span className="inline-flex min-h-11 shrink-0 items-center gap-1.5 text-sm font-semibold text-coral sm:opacity-80 group-hover:opacity-100">
          Read
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </span>
      </Link>
    </article>
  );
}
