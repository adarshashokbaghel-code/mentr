import { getPillar, type BlogPost } from "@/lib/blog-posts";
import { getArticleContent } from "@/lib/blog-content";
import { formatBlogDate } from "@/lib/blog-utils";
import { hardShadow, hardShadowSm } from "@/components/landing/lp/shared";
import { cn } from "@/lib/utils";
import { ArrowRight, BookOpen, Clock, Sparkles } from "lucide-react";
import Link from "next/link";

const pillarPanel: Record<string, string> = {
  "for-parents": "from-lavender-deep to-lavender",
  comparison: "from-butter-deep to-butter",
  "exam-prep": "from-sage/30 to-sage-wash",
  "for-tutors": "from-coral/25 to-coral-wash",
  "trust-safety": "from-sage/30 to-sage-wash",
  "career-mentoring": "from-lavender-deep to-lavender",
  "local-guides": "from-butter-deep to-butter",
  "for-students": "from-sky to-lavender",
};

export function BlogFeaturedCard({ post }: { post: BlogPost }) {
  const pillar = getPillar(post.pillar);
  const content = getArticleContent(post.slug);
  const date = formatBlogDate(content.publishedAt, "long");
  const panel = pillarPanel[post.pillar] ?? "from-cream-band to-cream";

  return (
    <article
      className={cn(
        "group relative overflow-hidden rounded-2xl border-2 border-ink bg-ink text-white transition duration-200 hover:-translate-y-0.5",
        hardShadow,
      )}
    >
      {/* subtle grid */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-coral/20 blur-3xl"
      />

      <div className="relative flex flex-col lg:flex-row">
        {/* Main content */}
        <Link
          href={`/blog/${post.slug}`}
          className="flex min-w-0 flex-1 flex-col justify-center px-5 py-7 active:bg-white/5 sm:px-8 sm:py-10 lg:px-10 lg:py-12 touch-manipulation"
        >
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border-2 border-ink bg-coral px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white shadow-[2px_2px_0_0_#1c1a17]">
              <Sparkles className="h-3 w-3" />
              Featured
            </span>
            <span className="rounded-full border-2 border-white/30 bg-white/10 px-3 py-1 text-[11px] font-semibold text-white/90">
              {pillar.shortLabel}
            </span>
            <span className="flex items-center gap-1 text-[11px] font-medium text-white/55">
              <Clock className="h-3 w-3" />
              {content.readTimeMinutes} min read
            </span>
          </div>

          <h2 className="mt-4 text-xl font-bold leading-[1.2] tracking-tight text-white transition group-hover:text-butter sm:mt-5 sm:text-2xl lg:text-[2.25rem]">
            {post.title}
          </h2>

          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/70 sm:mt-4 sm:text-base lg:text-lg">
            {post.description}
          </p>

          <span
            className={cn(
              "mt-6 inline-flex w-full min-h-11 items-center justify-center gap-2 rounded-xl border-2 border-ink bg-coral px-5 py-3 text-sm font-bold text-white transition active:scale-[0.98] sm:mt-7 sm:w-fit group-hover:translate-y-[-1px] group-hover:bg-coral-dark touch-manipulation",
              hardShadowSm,
            )}
          >
            Read article
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </span>
        </Link>

        {/* Right meta panel */}
        <div
          className={cn(
            "relative flex shrink-0 flex-col items-stretch gap-0 border-t-2 border-ink/20 sm:flex-row lg:w-[260px] lg:flex-col lg:border-l-2 lg:border-t-0",
            "bg-gradient-to-br",
            panel,
          )}
        >
          <div className="flex flex-1 flex-col justify-center border-b-2 border-ink/10 px-5 py-5 sm:border-b-0 sm:border-r-2 lg:border-b-2 lg:border-r-0 lg:px-6 lg:py-6">
            <BookOpen className="h-5 w-5 text-ink/50" />
            <p className="mt-3 text-[10px] font-bold uppercase tracking-wider text-ink/50">
              Published
            </p>
            <p className="mt-1 text-sm font-bold text-ink">{date}</p>
          </div>

          <div className="flex flex-1 flex-col justify-center px-5 py-5 lg:px-6 lg:py-6">
            <p className="text-[10px] font-bold uppercase tracking-wider text-ink/50">
              Category
            </p>
            <p className="mt-1 text-sm font-bold text-ink">{pillar.label}</p>
            <p className="mt-2 hidden text-xs leading-relaxed text-ink/60 sm:block">
              {pillar.description}
            </p>
          </div>
        </div>
      </div>
    </article>
  );
}
