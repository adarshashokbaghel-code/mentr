import { testimonialInitial, testimonialName } from "@/lib/demo-users";
import { cn } from "@/lib/utils";
import { ArrowRight, LucideIcon } from "lucide-react";
import Link from "next/link";

export const hardShadow = "shadow-[4px_4px_0_0_#1c1a17]";
export const hardShadowSm = "shadow-[3px_3px_0_0_#1c1a17]";
export const hardShadowLg = "shadow-[6px_6px_0_0_#1c1a17]";

/* ── Decorative backgrounds ─────────────────────────────────────── */

export function LpGridBg({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-0 opacity-[0.35]",
        className,
      )}
      style={{
        backgroundImage:
          "linear-gradient(var(--hairline) 1px, transparent 1px), linear-gradient(90deg, var(--hairline) 1px, transparent 1px)",
        backgroundSize: "48px 48px",
      }}
    />
  );
}

export function LpBlob({
  color,
  size = 280,
  className,
}: {
  color: string;
  size?: number;
  className?: string;
}) {
  return (
    <div
      aria-hidden
      className={cn("pointer-events-none absolute rounded-full blur-3xl", className)}
      style={{ width: size, height: size, background: color }}
    />
  );
}

export function LpLiveDot({ label = "Live" }: { label?: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-hairline bg-white/90 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-sage backdrop-blur-sm">
      <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sage opacity-60" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-sage" />
      </span>
      {label}
    </span>
  );
}

/* ── Typography blocks ──────────────────────────────────────────── */

export function SectionHeader({
  eyebrow,
  title,
  accent,
  description,
  align = "center",
  number,
}: {
  eyebrow: string;
  title: string;
  accent?: string;
  description?: string;
  align?: "center" | "left";
  number?: string;
}) {
  return (
    <div
      className={cn(
        "relative max-w-2xl",
        align === "center" && "mx-auto text-center",
        align === "left" && "mx-auto text-center md:mx-0 md:text-left",
      )}
    >
      {number && (
        <div
          className={cn(
            "relative mb-4 inline-flex items-center gap-2.5 rounded-xl border-2 border-ink bg-white px-3.5 py-2",
            hardShadowSm,
            align === "center" && "mx-auto",
            align === "left" && "mx-auto md:mx-0",
          )}
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-lg border-2 border-ink bg-coral text-sm font-bold text-white">
            {number}
          </span>
          <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-muted">
            Step {number}
          </span>
        </div>
      )}
      <p
        className={cn(
          "relative inline-flex w-full items-center justify-center gap-2.5 text-[11px] font-bold uppercase tracking-[0.14em] text-muted md:w-auto md:justify-start",
          align === "left" && "md:justify-start",
        )}
      >
        <span className="h-px w-5 bg-muted/50" aria-hidden />
        {eyebrow}
        <span className="h-px w-5 bg-muted/50" aria-hidden />
      </p>
      <h2 className="relative mt-4 text-2xl font-bold tracking-tight text-ink sm:text-3xl lg:text-[42px] lg:leading-[1.12]">
        {title}
        {accent && (
          <>
            {" "}
            <span className="text-coral">{accent}</span>
          </>
        )}
      </h2>
      {description && (
        <p
          className={cn(
            "relative mt-4 max-w-xl text-base leading-relaxed text-muted sm:text-lg",
            align === "center" && "mx-auto",
            align === "left" && "mx-auto md:mx-0",
          )}
        >
          {description}
        </p>
      )}
    </div>
  );
}

export function LpBadge({
  children,
  className,
  variant = "default",
}: {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "dark" | "coral";
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-sm font-medium shadow-sm",
        variant === "default" && "border-hairline bg-white text-ink",
        variant === "dark" && "border-white/20 bg-white/10 text-white",
        variant === "coral" && "border-coral/30 bg-coral-wash text-coral",
        className,
      )}
    >
      {children}
    </span>
  );
}

export function LpPill({
  children,
  tint,
}: {
  children: React.ReactNode;
  tint: "sage" | "butter" | "coral" | "lavender" | "white";
}) {
  const tints = {
    sage: "bg-sage-wash text-sage border-sage/20",
    butter: "bg-butter text-ink border-ink/10",
    coral: "bg-coral-wash text-coral border-coral/20",
    lavender: "bg-lavender text-ink border-ink/10",
    white: "bg-white text-ink border-hairline",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold",
        tints[tint],
      )}
    >
      {children}
    </span>
  );
}

/* ── Section divider (angled band — no curves) ──────────────────── */

export function LpSectionDivider({
  className,
  bandClass = "bg-butter",
}: {
  /** Background of the section below the divider */
  className?: string;
  /** Slanted band color coming from the section above */
  bandClass?: string;
}) {
  return (
    <div
      aria-hidden
      className={cn("relative h-8 overflow-hidden sm:h-10", className)}
    >
      <div
        className={cn(
          "absolute inset-x-0 top-0 h-[150%] border-b-[3px] border-ink",
          bandClass,
        )}
        style={{ clipPath: "polygon(0 0, 100% 0, 100% 48%, 0 100%)" }}
      />
    </div>
  );
}

/* ── Stats ──────────────────────────────────────────────────────── */

export function LpStatsBand({
  stats,
}: {
  stats: {
    value: string;
    label: string;
    tint: string;
    icon?: LucideIcon;
    sub?: string;
  }[];
}) {
  return (
    <section className="relative border-y border-hairline bg-white">
      <div className="mx-auto grid max-w-[1400px] grid-cols-2 md:grid-cols-4">
        {stats.map((stat, i) => (
          <div
            key={stat.label}
            className={cn(
              "group relative overflow-hidden border-b border-r border-hairline px-4 py-6 text-center transition-colors last:border-r-0 sm:px-6 sm:py-10 md:border-b-0 lg:px-8",
              stat.tint,
            )}
          >
            <span
              aria-hidden
              className="pointer-events-none absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-md border-2 border-ink/15 bg-white/80 text-xs font-bold text-ink/50"
            >
              {String(i + 1).padStart(2, "0")}
            </span>
            {stat.icon && (
              <stat.icon className="mx-auto mb-3 h-5 w-5 text-ink/40" />
            )}
            <p className="relative text-2xl font-bold tracking-tight text-ink sm:text-3xl lg:text-[40px]">
              {stat.value}
            </p>
            <p className="relative mt-2 text-sm font-semibold text-ink/80">
              {stat.label}
            </p>
            {stat.sub && (
              <p className="relative mt-1 text-xs text-muted">{stat.sub}</p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

/* ── Steps ──────────────────────────────────────────────────────── */

export function LpStepTimeline({
  steps,
  activeIndex,
  onSelect,
  accent = "coral",
}: {
  steps: { title: string; desc: string; icon?: LucideIcon }[];
  activeIndex?: number;
  onSelect?: (i: number) => void;
  accent?: "coral" | "sage";
}) {
  const accentBg = accent === "coral" ? "bg-coral" : "bg-sage";
  const accentText = accent === "coral" ? "text-coral" : "text-sage";
  const accentWash = accent === "coral" ? "bg-coral-wash" : "bg-sage-wash";

  return (
    <ol className="space-y-2">
      {steps.map((step, i) => {
        const isActive = activeIndex === i;
        const Icon = step.icon;
        return (
          <li key={step.title}>
            <button
              type="button"
              onClick={() => onSelect?.(i)}
              className={cn(
                "flex w-full items-start gap-4 rounded-xl border-2 p-4 text-left transition-all duration-200",
                isActive
                  ? cn("border-ink bg-white", hardShadowSm)
                  : "border-ink/15 bg-white/70 hover:border-ink/30 hover:bg-white",
                !onSelect && "cursor-default",
              )}
            >
              <span
                className={cn(
                  "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border-2 border-ink text-base font-bold",
                  isActive
                    ? cn(accentBg, "text-white", hardShadowSm)
                    : "bg-white text-ink",
                )}
              >
                {i + 1}
              </span>
              <div className="min-w-0 pt-0.5">
                <p className="flex items-center gap-2">
                  {Icon && (
                    <Icon
                      className={cn(
                        "h-4 w-4 shrink-0",
                        isActive ? accentText : "text-muted",
                      )}
                    />
                  )}
                  <span className={cn("text-sm font-bold", isActive ? "text-ink" : "text-ink/80")}>
                    {step.title}
                  </span>
                </p>
                <p className="mt-1 text-[13px] leading-snug text-muted">{step.desc}</p>
                {isActive && (
                  <span
                    className={cn(
                      "mt-2 inline-flex rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide",
                      accentWash,
                      accentText,
                    )}
                  >
                    Step {i + 1} of {steps.length}
                  </span>
                )}
              </div>
            </button>
          </li>
        );
      })}
    </ol>
  );
}

/* ── Comparison delta row ───────────────────────────────────────── */

export function LpDeltaRow({
  label,
  other,
  champs,
  highlight = false,
}: {
  label: string;
  other: string;
  champs: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={cn(
        "group px-4 py-5 transition-colors sm:px-7 sm:py-6 lg:px-9 lg:py-7",
        highlight && "bg-coral-wash/40",
      )}
    >
      <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-muted">
        {label}
      </p>
      <div className="mt-3 flex flex-wrap items-center gap-3">
        <span className="inline-flex items-center gap-2 rounded-lg border border-hairline bg-cream px-3 py-1.5 text-base text-muted line-through decoration-muted/60 sm:text-lg">
          {other}
        </span>
        <ArrowRight className="h-4 w-4 text-coral opacity-0 transition-opacity group-hover:opacity-100" />
        <span
          className={cn(
            "rounded-lg border-2 border-ink px-4 py-1.5 text-xl font-bold text-ink sm:text-2xl",
            hardShadowSm,
            highlight ? "bg-butter" : "bg-white",
          )}
        >
          {champs}
        </span>
      </div>
    </div>
  );
}

/* ── Testimonial card ───────────────────────────────────────────── */

export function LpTestimonialCard({
  quote,
  name,
  role,
  tint,
}: {
  quote: string;
  name?: string;
  role: string;
  tint: string;
}) {
  return (
    <article
      className={cn(
        "relative flex h-full flex-col overflow-hidden rounded-2xl border-2 border-ink p-6 sm:p-7",
        tint,
        hardShadowSm,
      )}
    >
      <span
        aria-hidden
        className="absolute -right-2 -top-4 text-[80px] font-serif leading-none text-ink/[0.06]"
      >
        &ldquo;
      </span>
      <div className="relative mb-5 flex gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <svg key={i} className="h-4 w-4 fill-coral text-coral" viewBox="0 0 20 20">
            <path d="M10 1l2.4 7.4H20l-6 4.6 2.3 7-6.3-4.6L3.7 20l2.3-7L0 8.4h7.6z" />
          </svg>
        ))}
      </div>
      <p className="relative flex-1 text-base leading-relaxed text-ink">{quote}</p>
      <div className="relative mt-8 flex items-center gap-4 border-t-2 border-ink/10 pt-6">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl border-2 border-ink bg-white text-sm font-bold text-ink">
          {testimonialInitial(name)}
        </div>
        <div>
          {testimonialName(name) ? (
            <p className="font-bold text-ink">{testimonialName(name)}</p>
          ) : null}
          <p className="text-sm text-muted">{role}</p>
        </div>
      </div>
    </article>
  );
}

/* ── FAQ link row ───────────────────────────────────────────────── */

export function LpFaqLink({
  question,
  index,
  category,
}: {
  question: string;
  index: number;
  category?: string;
}) {
  return (
    <Link
      href="/faq"
      className={cn(
        "group flex items-center gap-4 rounded-xl border-2 border-ink/10 bg-white p-5 transition-all duration-200 hover:border-ink hover:bg-cream",
        hardShadowSm,
        "hover:translate-y-[-2px]",
      )}
    >
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border-2 border-ink bg-butter text-sm font-bold text-ink">
        {String(index).padStart(2, "0")}
      </span>
      <div className="min-w-0 flex-1">
        {category && (
          <span className="text-[10px] font-bold uppercase tracking-wide text-coral">
            {category}
          </span>
        )}
        <p className="font-bold text-ink group-hover:text-coral">{question}</p>
      </div>
      <ArrowRight className="h-5 w-5 shrink-0 text-muted transition-transform group-hover:translate-x-1 group-hover:text-coral" />
    </Link>
  );
}

/* ── Mock wrapper with floating chips ───────────────────────────── */

export function LpMockStage({
  children,
  chips,
  className,
}: {
  children: React.ReactNode;
  chips?: { label: string; className: string; style: React.CSSProperties }[];
  className?: string;
}) {
  return (
    <div className={cn("relative min-w-0 w-full max-w-full", className)}>
      {chips?.map((chip) => (
        <div
          key={chip.label}
          className={cn(
            "absolute z-10 hidden rounded-lg border-2 border-ink bg-white px-3 py-2 text-xs font-bold shadow-[3px_3px_0_0_#1c1a17] sm:block",
            chip.className,
          )}
          style={chip.style}
        >
          {chip.label}
        </div>
      ))}
      <div className={cn("relative min-w-0 w-full max-w-full overflow-hidden", hardShadowLg)}>
        {children}
      </div>
    </div>
  );
}

/* ── Final CTA ──────────────────────────────────────────────────── */

export function LpFinalCta({
  eyebrow,
  title,
  description,
  primaryLabel,
  primaryHref,
  secondaryLabel,
  secondaryHref,
  dark = false,
  perks,
}: {
  eyebrow: string;
  title: string;
  description: string;
  primaryLabel: string;
  primaryHref: string;
  secondaryLabel?: string;
  secondaryHref?: string;
  dark?: boolean;
  perks?: string[];
}) {
  return (
    <section
      className={cn(
        "relative overflow-hidden py-12 sm:py-20 lg:py-28",
        dark ? "bg-ink text-white" : "border-t border-hairline bg-cream-band",
      )}
    >
      {dark && (
        <>
          <LpBlob color="rgba(255,154,77,0.12)" size={320} className="-left-20 top-0" />
          <LpBlob color="rgba(47,158,110,0.1)" size={260} className="-right-16 bottom-0" />
        </>
      )}
      <div className="relative mx-auto max-w-[1000px] px-4 sm:px-6 lg:px-8">
        <div
          className={cn(
            "rounded-2xl border-2 p-5 text-center sm:p-8 lg:p-14",
            dark
              ? cn("border-white/20 bg-white/[0.04]", hardShadow)
              : cn("border-ink bg-white", hardShadowLg),
          )}
        >
          <LpBadge variant={dark ? "dark" : "coral"} className="mx-auto">
            {eyebrow}
          </LpBadge>
          <h2 className="mt-6 text-2xl font-bold tracking-tight sm:text-3xl lg:text-[44px] lg:leading-[1.1]">
            {title}
          </h2>
          <p
            className={cn(
              "mx-auto mt-5 max-w-lg text-base leading-relaxed sm:text-lg",
              dark ? "text-white/75" : "text-muted",
            )}
          >
            {description}
          </p>

          {perks && perks.length > 0 && (
            <div className="mx-auto mt-6 flex max-w-md flex-wrap justify-center gap-2">
              {perks.map((p) => (
                <span
                  key={p}
                  className={cn(
                    "rounded-full px-3 py-1 text-xs font-bold",
                    dark ? "bg-white/10 text-butter" : "bg-cream text-ink",
                  )}
                >
                  {p}
                </span>
              ))}
            </div>
          )}

          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link
              href={primaryHref}
              className={cn(
                "inline-flex h-13 items-center gap-2 rounded-xl border-2 border-ink px-8 text-sm font-bold transition hover:translate-y-[-1px]",
                dark
                  ? cn("bg-butter text-ink hover:bg-butter-deep", hardShadowSm)
                  : cn("bg-coral text-white hover:bg-coral-dark", hardShadowSm),
              )}
            >
              {primaryLabel}
              <ArrowRight className="h-4 w-4" />
            </Link>
            {secondaryLabel && secondaryHref && (
              <Link
                href={secondaryHref}
                className={cn(
                  "inline-flex h-13 items-center rounded-xl border-2 border-ink px-8 text-sm font-bold transition hover:translate-y-[-1px]",
                  dark
                    ? "bg-white/10 text-white hover:bg-white/15"
                    : "bg-cream text-ink hover:bg-cream-band",
                  hardShadowSm,
                )}
              >
                {secondaryLabel}
              </Link>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── Switch tab button ──────────────────────────────────────────── */

export function LpSwitchTab({
  letter,
  label,
  blurb,
  letterBg,
  isActive,
  onClick,
}: {
  letter: string;
  label: string;
  blurb: string;
  letterBg: string;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "relative flex w-full items-center gap-3.5 rounded-xl border-2 bg-white px-4 py-4 text-left transition-all duration-200",
        isActive
          ? cn("border-ink -translate-y-0.5", hardShadowSm)
          : "border-ink/15 hover:border-ink/35 hover:bg-cream/50",
      )}
    >
      {isActive && (
        <span className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-coral-wash px-2 py-0.5 text-[9px] font-bold uppercase text-coral">
          Active
        </span>
      )}
      <span
        className={cn(
          "flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border-2 border-ink text-base font-bold text-white",
          letterBg,
        )}
      >
        {letter}
      </span>
      <span className="min-w-0 pr-6">
        <span className="block text-sm font-bold text-ink">{label}</span>
        <span className="mt-0.5 block text-xs leading-snug text-muted">{blurb}</span>
      </span>
    </button>
  );
}
