import { ToolIllustration } from "@/components/tools/tool-illustration";
import type { ToolDef } from "@/lib/tools-catalog";
import { cn } from "@/lib/utils";
import { ArrowRight, Shield } from "lucide-react";
import Link from "next/link";

const CATEGORY_LABEL: Record<string, string> = {
  teachers: "Teacher",
  students: "Student",
  pdf: "PDF",
};

export function ToolCard({
  tool,
  featured,
  priority,
}: {
  tool: ToolDef;
  featured?: boolean;
  /** Eager-load theme image for above-the-fold cards (same URL = one cache hit). */
  priority?: boolean;
}) {
  const category = tool.audience[0]
    ? CATEGORY_LABEL[tool.audience[0]]
    : null;

  return (
    <Link
      href={`/tools/${tool.slug}`}
      className={cn(
        "group flex h-full flex-col overflow-hidden rounded-2xl border-2 border-ink/15 bg-white transition duration-200",
        "hover:-translate-y-1 hover:border-ink hover:shadow-[4px_4px_0_0_#1c2434]",
        featured && "sm:col-span-1",
      )}
    >
      <ToolIllustration
        tool={tool}
        className="aspect-[16/10] w-full"
        priority={priority}
      />
      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-[15px] font-extrabold tracking-tight text-ink sm:text-[16px]">
            {tool.title}
          </h3>
          {tool.popular ? (
            <span className="shrink-0 rounded-md bg-coral-wash px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-coral">
              Popular
            </span>
          ) : null}
        </div>
        {category ? (
          <p className="mt-1 text-[11px] font-bold uppercase tracking-wide text-muted">
            {category}
          </p>
        ) : null}
        <p className="mt-1.5 line-clamp-2 text-[13px] font-medium leading-snug text-muted">
          {tool.description}
        </p>
        <div className="mt-auto flex items-center justify-between pt-4">
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-sage">
            <Shield className="h-3 w-3" strokeWidth={2.5} />
            Private
          </span>
          <span className="inline-flex items-center gap-1 text-[12px] font-extrabold text-coral transition group-hover:gap-1.5">
            Open
            <ArrowRight className="h-3.5 w-3.5" strokeWidth={2.5} />
          </span>
        </div>
      </div>
    </Link>
  );
}
