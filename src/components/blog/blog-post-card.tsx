import { getPillar, type BlogPost } from "@/lib/blog-posts";
import { getArticleContent } from "@/lib/blog-content";
import { hardShadowSm } from "@/components/landing/lp/shared";
import { cn } from "@/lib/utils";
import { Clock } from "lucide-react";
import Link from "next/link";

type Props = {
  post: BlogPost;
};

const pillarAccent: Record<string, string> = {
  "for-parents": "bg-lavender",
  comparison: "bg-butter",
  "exam-prep": "bg-sage-wash",
  "for-tutors": "bg-coral-wash",
  "trust-safety": "bg-sage-wash",
  "career-mentoring": "bg-lavender",
  "local-guides": "bg-butter",
};

export function BlogPostCard({ post }: Props) {
  const pillar = getPillar(post.pillar);
  const content = getArticleContent(post.slug);
  const date = new Date(content.publishedAt).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
  const accent = pillarAccent[post.pillar] ?? "bg-cream-band";

  return (
    <article className="group flex h-full flex-col">
      <Link
        href={`/blog/${post.slug}`}
        className={cn(
          "flex h-full min-h-[120px] flex-col rounded-2xl border-2 border-ink bg-white p-4 transition duration-200 active:scale-[0.99] sm:min-h-0 sm:p-5 lg:p-6 touch-manipulation",
          hardShadowSm,
          "hover:-translate-y-1",
        )}
      >
        <div className="flex items-center justify-between gap-2">
          <span
            className={cn(
              "rounded-full px-2.5 py-0.5 text-[11px] font-semibold text-ink",
              accent,
            )}
          >
            {pillar.shortLabel}
          </span>
          <time
            dateTime={content.publishedAt}
            className="text-[11px] text-muted"
          >
            {date}
          </time>
        </div>

        <h3 className="mt-3 flex-1 text-base font-bold leading-snug text-ink transition group-hover:text-coral sm:text-lg">
          {post.title}
        </h3>

        <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-muted">
          {post.description}
        </p>

        <div className="mt-4 flex items-center justify-between border-t-2 border-ink/10 pt-4 text-xs text-muted">
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {content.readTimeMinutes} min read
          </span>
          <span className="font-semibold text-coral sm:opacity-0 sm:transition sm:group-hover:opacity-100">
            Read →
          </span>
        </div>
      </Link>
    </article>
  );
}
