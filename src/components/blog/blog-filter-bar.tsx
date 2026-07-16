import { BLOG_PILLARS, BLOG_POSTS, postsByPillar } from "@/lib/blog-posts";
import type { BlogPillarId } from "@/lib/blog-posts";
import { cn } from "@/lib/utils";
import Link from "next/link";

const FILTER_ITEMS: { id: BlogPillarId | "all"; label: string }[] = [
  { id: "all", label: "All" },
  ...BLOG_PILLARS.map((p) => ({ id: p.id, label: p.shortLabel })),
];

type Props = {
  activePillar?: BlogPillarId | "all";
};

export function BlogFilterBar({ activePillar = "all" }: Props) {
  return (
    <div className="w-full border-b border-hairline bg-white">
      <div className="mx-auto max-w-[1400px]">
        {/* Horizontally scrollable on mobile — touch-friendly tap targets */}
        <div className="-mb-px overflow-x-auto overscroll-x-contain px-4 py-3 sm:px-6 lg:px-8 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div className="flex min-w-max gap-2">
            {FILTER_ITEMS.map(({ id, label }) => {
              const count =
                id === "all" ? BLOG_POSTS.length : postsByPillar(id).length;
              const isActive = activePillar === id;
              const href =
                id === "all" ? "/blog" : `/blog/category/${id}`;

              return (
                <Link
                  key={id}
                  href={href}
                  className={cn(
                    "inline-flex min-h-11 shrink-0 items-center rounded-xl px-4 py-2.5 text-sm font-semibold touch-manipulation transition active:scale-[0.98]",
                    isActive
                      ? "border-2 border-ink bg-ink text-white shadow-[2px_2px_0_0_#1c1a17]"
                      : "border-2 border-ink/15 bg-cream text-ink hover:border-ink/40 hover:bg-cream-band",
                  )}
                >
                  {label}
                  <span className={cn("ml-1.5", isActive ? "text-white/70" : "text-muted")}>
                    {count}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
