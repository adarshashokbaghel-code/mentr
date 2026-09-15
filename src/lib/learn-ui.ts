/**
 * Shared Learn UI tokens — Tailwind class strings only.
 * Prefer these over one-off hex values in Learn marketing + LMS surfaces.
 */
export const learnUi = {
  ink: "text-ink",
  muted: "text-[#5a6472]",
  soft: "text-[#8a929c]",
  accent: "text-[#ff6a1a]",
  sage: "text-[#0d9488]",
  surface: "bg-white",
  page: "bg-[#f6f4f0]",
  cream: "bg-[#faf8f4]",
  border: "border-[#e8e2d8]",
  ring: "ring-[#e8e2d8]",
  /** Card shell */
  card: "rounded-2xl border border-[#e8e2d8] bg-white",
  cardSm: "rounded-xl border border-[#e8e2d8] bg-white",
  /** Compact mobile type scale */
  h1: "text-[1.2rem] font-extrabold tracking-tight text-ink sm:text-[1.5rem]",
  h2: "text-[1.05rem] font-extrabold tracking-tight text-ink sm:text-[1.25rem]",
  body: "text-[13px] font-medium leading-relaxed text-[#5a6472] sm:text-[14px]",
  label: "text-[10px] font-bold uppercase tracking-wider text-[#8a929c] sm:text-[11px]",
  /** CTA primary — Tailwind-only (no custom CSS) */
  cta: "inline-flex h-11 w-full max-w-full items-center justify-center gap-2 rounded-2xl bg-[#ff6a1a] px-4 text-[14px] font-extrabold text-white transition hover:bg-[#e85f14] disabled:opacity-60 sm:h-12 sm:text-[15px]",
  ctaEnrolled:
    "inline-flex h-11 w-full max-w-full items-center justify-center gap-2 rounded-2xl bg-[#0d9488] px-4 text-[14px] font-extrabold text-white transition hover:bg-[#0f766e] disabled:opacity-60 sm:h-12 sm:text-[15px]",
  ctaGhost:
    "inline-flex h-11 w-full items-center justify-center rounded-2xl bg-white px-4 text-[14px] font-bold text-ink ring-1 ring-[#e8e2d8] transition hover:bg-[#faf8f4] sm:h-12",
  /** Spacing rhythm */
  sectionY: "py-8 sm:py-14 lg:py-20",
  stack: "space-y-3 sm:space-y-4",
} as const;
