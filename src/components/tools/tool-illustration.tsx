import type { ToolDef } from "@/lib/tools-catalog";
import { cn } from "@/lib/utils";
import Image from "next/image";

/** Per-tool WebP covers (~5–14KB each) — match tool name / purpose. */
const TOOL_COVER: Record<string, string> = {
  "cgpa-calculator": "/images/tools/cgpa-calculator.webp",
  "study-timetable": "/images/tools/study-timetable.webp",
  "pdf-merge": "/images/tools/pdf-merge.webp",
  "pdf-compress": "/images/tools/pdf-compress.webp",
  "background-remover": "/images/tools/background-remover.webp",
  "images-to-pdf": "/images/tools/images-to-pdf.webp",
  "pdf-organize": "/images/tools/pdf-organize.webp",
  "pdf-extract-text": "/images/tools/pdf-extract-text.webp",
  "pdf-split": "/images/tools/pdf-split.webp",
  "name-tags": "/images/tools/name-tags.webp",
  "word-counter": "/images/tools/word-counter.webp",
};

const FALLBACK_COVER = "/images/tools/pdf-merge.webp";

export function toolCoverSrc(slug: string): string {
  return TOOL_COVER[slug] || FALLBACK_COVER;
}

/**
 * Tool-specific cover image (unique per slug). Lazy by default; small WebPs.
 */
export function ToolIllustration({
  tool,
  className,
  priority = false,
}: {
  tool: ToolDef;
  className?: string;
  priority?: boolean;
}) {
  const src = toolCoverSrc(tool.slug);

  return (
    <div
      className={cn("relative overflow-hidden bg-cream-band", className)}
      aria-hidden
    >
      <Image
        src={src}
        alt=""
        fill
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 320px"
        className="object-cover object-center"
        priority={priority}
        loading={priority ? undefined : "lazy"}
        quality={72}
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/20 via-transparent to-transparent" />
    </div>
  );
}
