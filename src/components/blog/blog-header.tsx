import { getBlogHeaderCopy } from "@/lib/blog-header-copy";
import type { BlogPillarId } from "@/lib/blog-posts";
import { cn } from "@/lib/utils";
import Link from "next/link";

type Props = {
  pillar?: BlogPillarId | "all";
};

const PILLAR_HEADER_BG: Partial<Record<BlogPillarId | "all", string>> = {
  comparison: "bg-butter/60",
  "exam-prep": "bg-sage-wash/50",
  "for-parents": "bg-lavender/50",
};

function HomeTitle() {
  return (
    <h1 className="text-2xl font-bold leading-tight tracking-tight sm:text-3xl lg:text-4xl">
      <span className="text-ink">Find tutors.</span>{" "}
      <span className="text-coral">Compare platforms.</span>{" "}
      <span className="text-sage">Prep for exams.</span>
    </h1>
  );
}

function ComparisonTitle() {
  return (
    <h1 className="text-2xl font-bold leading-tight tracking-tight sm:text-3xl lg:text-4xl">
      <span className="text-coral">Mentr vs UrbanPro</span>
      <span className="text-ink">, agencies & the rest</span>
    </h1>
  );
}

export function BlogHeader({ pillar = "all" }: Props) {
  const copy = getBlogHeaderCopy(pillar);
  const bg = PILLAR_HEADER_BG[pillar] ?? "bg-cream-band";

  return (
    <div className={cn("w-full border-b-2 border-ink", bg)}>
      <div className="mx-auto max-w-[1400px] px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        {pillar !== "all" && (
          <Link
            href="/blog"
            className="inline-flex min-h-11 items-center text-sm font-semibold text-coral touch-manipulation hover:underline"
          >
            ← All guides
          </Link>
        )}

        <div className={cn(pillar !== "all" ? "mt-4" : "mt-0")}>
          {pillar === "all" ? (
            <HomeTitle />
          ) : pillar === "comparison" ? (
            <ComparisonTitle />
          ) : (
            <h1 className="text-2xl font-bold leading-tight tracking-tight text-ink sm:text-3xl lg:text-4xl">
              {copy.title}
            </h1>
          )}
        </div>

        <p className="mt-3 max-w-3xl text-base leading-relaxed text-ink/80 sm:text-lg">
          {copy.subtitle}
        </p>

        {copy.hint && (
          <p className="mt-4 flex flex-wrap gap-x-2 gap-y-1 text-sm text-muted">
            {copy.hint.split(" · ").map((tag) => (
              <span
                key={tag}
                className="rounded-md bg-white/70 px-2 py-0.5 text-xs font-medium text-ink/70"
              >
                {tag}
              </span>
            ))}
          </p>
        )}
      </div>
    </div>
  );
}
