import { ToolApp } from "@/components/tools/tool-app";
import { BgRemoverExplainer } from "@/components/tools/bg-remover-explainer";
import { ToolCard } from "@/components/tools/tool-card";
import { ToolFaqSearch } from "@/components/tools/tool-faq-search";
import { ToolIllustration } from "@/components/tools/tool-illustration";
import { ToolsSoftCta } from "@/components/tools/tools-soft-cta";
import type { ToolDef } from "@/lib/tools-catalog";
import { relatedTools, TOOLS } from "@/lib/tools-catalog";
import {
  getAllToolFaqs,
  getToolPageCopy,
} from "@/lib/tools-page-copy";
import {
  BookOpen,
  CheckCircle2,
  ChevronRight,
  Lightbulb,
  Lock,
  Search,
  Shield,
} from "lucide-react";
import Link from "next/link";

export function ToolPageBody({ tool }: { tool: ToolDef }) {
  const related = relatedTools(tool.slug, 4);
  const copy = getToolPageCopy(tool.slug);
  const faqs = getAllToolFaqs(tool);
  const moreTools = TOOLS.filter((t) => t.slug !== tool.slug).slice(0, 6);
  const isBgRemover = tool.slug === "background-remover";

  return (
    <div className="mx-auto w-full max-w-[1400px] px-3 py-6 sm:px-6 sm:py-10 lg:px-8">
      <nav
        aria-label="Breadcrumb"
        className="flex flex-wrap items-center gap-1 text-[12px] font-semibold text-muted"
      >
        <Link href="/tools" className="hover:text-coral">
          Tools
        </Link>
        <ChevronRight className="h-3.5 w-3.5 opacity-50" />
        <span className="text-ink">{tool.shortTitle}</span>
      </nav>

      {/* Compact hero band */}
      <header className="mt-4 overflow-hidden rounded-2xl border-2 border-ink bg-white shadow-[3px_3px_0_0_#1c2434] lg:grid lg:grid-cols-[1fr_280px]">
        <div className="flex flex-col justify-center p-5 sm:p-6">
          <p className="text-[11px] font-bold uppercase tracking-wider text-coral">
            Mentr Tools · free · no signup
          </p>
          <h1 className="mt-1 text-[1.65rem] font-extrabold tracking-tight text-ink sm:text-[2rem]">
            {tool.title}
          </h1>
          <p className="mt-2 max-w-2xl text-[15px] font-medium leading-relaxed text-muted">
            {tool.description}
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-sage-wash px-2.5 py-1 text-[11px] font-bold text-sage">
              <Lock className="h-3 w-3" strokeWidth={2.5} />
              Browser-only · private
            </span>
            <a
              href="#faq"
              className="inline-flex items-center gap-1.5 rounded-full bg-cream px-2.5 py-1 text-[11px] font-bold text-ink ring-1 ring-hairline hover:ring-ink"
            >
              <Search className="h-3 w-3" />
              Jump to FAQ
            </a>
            {isBgRemover ? (
              <a
                href="#quality"
                className="inline-flex items-center gap-1.5 rounded-full bg-cream px-2.5 py-1 text-[11px] font-bold text-ink ring-1 ring-hairline hover:ring-ink"
              >
                Quality &amp; how it works
              </a>
            ) : null}
            {isBgRemover ? (
              <Link
                href="/technical/bgremover"
                className="inline-flex items-center gap-1.5 rounded-full bg-cream px-2.5 py-1 text-[11px] font-bold text-ink ring-1 ring-hairline hover:ring-ink"
              >
                <BookOpen className="h-3 w-3" />
                Technical article
              </Link>
            ) : null}
            {tool.blogSlug ? (
              <Link
                href={`/blog/${tool.blogSlug}`}
                className="inline-flex items-center gap-1.5 rounded-full bg-cream px-2.5 py-1 text-[11px] font-bold text-ink ring-1 ring-hairline hover:ring-ink"
              >
                <BookOpen className="h-3 w-3" />
                Full guide
              </Link>
            ) : null}
          </div>
        </div>
        <ToolIllustration
          tool={tool}
          className="hidden min-h-[140px] lg:block lg:min-h-full"
        />
      </header>

      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_260px] xl:grid-cols-[minmax(0,1fr)_280px]">
        {/* Main column */}
        <div className="min-w-0 space-y-8">
          {/* Tool workspace */}
          <section
            id="tool"
            className="scroll-mt-24 rounded-2xl border-2 border-ink bg-white p-4 shadow-[4px_4px_0_0_#ff6a1a] sm:p-6"
          >
            <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
              <p className="text-[12px] font-bold uppercase tracking-wider text-muted">
                Use the tool
              </p>
              <p className="inline-flex items-center gap-1 text-[11px] font-bold text-sage">
                <Shield className="h-3 w-3" />
                Files stay on your device
              </p>
            </div>
            <ToolApp slug={tool.slug} />
          </section>

          {isBgRemover ? (
            <section className="rounded-2xl border border-hairline bg-white p-5 sm:p-8">
              <BgRemoverExplainer />
            </section>
          ) : null}

          <ToolsSoftCta slug={tool.slug} />

          {/* Thick SEO article */}
          <article className="space-y-10 rounded-2xl border border-hairline bg-white p-5 sm:p-8">
            <section>
              <h2 className="text-[1.25rem] font-extrabold text-ink">
                About {tool.title}
              </h2>
              <p className="mt-3 text-[15px] font-medium leading-relaxed text-muted">
                {tool.intro}
              </p>
              <p className="mt-3 text-[14px] font-medium leading-relaxed text-muted">
                {tool.privacyNote}
              </p>
            </section>

            {copy.sections.map((sec) => (
              <section key={sec.heading}>
                <h2 className="text-[1.15rem] font-extrabold text-ink">
                  {sec.heading}
                </h2>
                {sec.paragraphs.map((p) => (
                  <p
                    key={p.slice(0, 48)}
                    className="mt-3 text-[14px] font-medium leading-relaxed text-muted"
                  >
                    {p}
                  </p>
                ))}
              </section>
            ))}

            <section className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-hairline bg-cream/40 p-4 sm:p-5">
                <h2 className="flex items-center gap-2 text-[1.05rem] font-extrabold text-ink">
                  <CheckCircle2 className="h-5 w-5 text-sage" />
                  How to use {tool.shortTitle}
                </h2>
                <ol className="mt-3 list-decimal space-y-2 pl-5 text-[14px] font-medium leading-relaxed text-muted">
                  {tool.howTo.map((step) => (
                    <li key={step}>{step}</li>
                  ))}
                </ol>
              </div>
              <div className="rounded-xl border border-hairline bg-cream/40 p-4 sm:p-5">
                <h2 className="text-[1.05rem] font-extrabold text-ink">
                  Common use cases
                </h2>
                <ul className="mt-3 space-y-2 text-[14px] font-medium text-muted">
                  {tool.useCases.map((u) => (
                    <li key={u} className="flex gap-2">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-coral" />
                      {u}
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            {copy.tips.length ? (
              <section>
                <h2 className="flex items-center gap-2 text-[1.15rem] font-extrabold text-ink">
                  <Lightbulb className="h-5 w-5 text-coral" />
                  Practical tips
                </h2>
                <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                  {copy.tips.map((tip) => (
                    <li
                      key={tip}
                      className="rounded-xl border border-hairline bg-cream/30 px-3.5 py-2.5 text-[13px] font-medium text-muted"
                    >
                      {tip}
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}

            {tool.blogSlug ? (
              <section className="rounded-xl border-2 border-ink/10 bg-[#fff8f3] p-5">
                <h2 className="flex items-center gap-2 text-[1.05rem] font-extrabold text-ink">
                  <BookOpen className="h-5 w-5 text-coral" />
                  Longer guide
                </h2>
                <p className="mt-2 text-[14px] font-medium leading-relaxed text-muted">
                  Prefer a full walkthrough? Read the guide, then return here to
                  use the tool free.
                </p>
                <Link
                  href={`/blog/${tool.blogSlug}`}
                  className="mt-3 inline-flex rounded-xl bg-ink px-4 py-2.5 text-[13px] font-extrabold text-white transition hover:brightness-110"
                >
                  Read the {tool.shortTitle} guide →
                </Link>
              </section>
            ) : null}

            <ToolFaqSearch faqs={faqs} />

            <section>
              <h2 className="text-[1.15rem] font-extrabold text-ink">
                Related tools
              </h2>
              <p className="mt-1 text-[13px] font-medium text-muted">
                Stay on Mentr — open the next utility without leaving the site
              </p>
              <ul className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {related.map((t) => (
                  <li key={t.slug}>
                    <ToolCard tool={t} />
                  </li>
                ))}
              </ul>
            </section>
          </article>
        </div>

        {/* Sticky sidebar */}
        <aside className="hidden lg:block">
          <div className="sticky top-20 space-y-4">
            {isBgRemover ? (
              <div className="overflow-hidden rounded-2xl border-2 border-ink bg-white shadow-[3px_3px_0_0_#1c2434]">
                <p className="border-b border-hairline bg-cream/60 px-4 py-2.5 text-[11px] font-bold uppercase tracking-wider text-muted">
                  Why Mentr
                </p>
                <ul className="space-y-0 p-2 text-[13px] font-bold text-ink">
                  {[
                    { t: "100% free forever", d: "No credits, no paywall" },
                    { t: "No watermark", d: "Clean transparent PNG" },
                    { t: "No signup required", d: "Upload and download" },
                    { t: "Unlimited on-device", d: "Within your device limits" },
                    { t: "Private by design", d: "Image stays in your browser" },
                    { t: "High quality", d: "Soft edges + detail pass" },
                  ].map((f) => (
                    <li
                      key={f.t}
                      className="rounded-lg px-3 py-2.5 hover:bg-cream"
                    >
                      <p className="text-ink">{f.t}</p>
                      <p className="text-[11px] font-semibold text-muted">
                        {f.d}
                      </p>
                    </li>
                  ))}
                </ul>
                <div className="border-t border-hairline p-3">
                  <a
                    href="#tool"
                    className="inline-flex w-full items-center justify-center rounded-xl bg-coral px-3 py-2.5 text-[13px] font-extrabold text-white hover:brightness-95"
                  >
                    Use the tool
                  </a>
                  <Link
                    href="/technical/bgremover"
                    className="mt-2 inline-flex w-full items-center justify-center rounded-xl border border-hairline px-3 py-2 text-[12px] font-bold text-ink hover:bg-cream"
                  >
                    How it was built
                  </Link>
                </div>
              </div>
            ) : (
              <nav
                aria-label="On this page"
                className="overflow-hidden rounded-2xl border-2 border-ink bg-white shadow-[3px_3px_0_0_#1c2434]"
              >
                <p className="border-b border-hairline bg-cream/60 px-4 py-2.5 text-[11px] font-bold uppercase tracking-wider text-muted">
                  On this page
                </p>
                <ul className="p-2 text-[13px] font-bold">
                  {[
                    { href: "#tool", label: "Use the tool" },
                    { href: "#faq", label: "Search FAQ" },
                    ...(tool.blogSlug
                      ? [
                          {
                            href: `/blog/${tool.blogSlug}`,
                            label: "Full guide",
                          },
                        ]
                      : []),
                    { href: "/tools", label: "All tools" },
                  ].map((item) => (
                    <li key={item.href}>
                      <a
                        href={item.href}
                        className="block rounded-lg px-3 py-2 text-ink transition hover:bg-cream hover:text-coral"
                      >
                        {item.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            )}

            <div className="rounded-2xl border border-hairline bg-white p-4">
              <p className="text-[11px] font-bold uppercase tracking-wider text-muted">
                More tools
              </p>
              <ul className="mt-2 space-y-0.5">
                {moreTools.map((t) => (
                  <li key={t.slug}>
                    <Link
                      href={`/tools/${t.slug}`}
                      className="block rounded-lg px-2 py-1.5 text-[13px] font-bold text-ink hover:bg-cream hover:text-coral"
                    >
                      {t.shortTitle}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl border border-sage/30 bg-sage-wash/40 p-4">
              <p className="inline-flex items-center gap-1.5 text-[12px] font-extrabold text-sage">
                <Shield className="h-3.5 w-3.5" />
                Privacy
              </p>
              <p className="mt-1.5 text-[12px] font-medium leading-relaxed text-muted">
                {tool.privacyNote}
              </p>
            </div>

            <div className="rounded-2xl border-2 border-ink bg-ink p-4 text-white shadow-[3px_3px_0_0_#ff6a1a]">
              <p className="text-[11px] font-bold uppercase tracking-wider text-white/60">
                Keep going on Mentr
              </p>
              <p className="mt-1 text-[14px] font-extrabold leading-snug">
                Tool done — find a tutor
              </p>
              <Link
                href="/search"
                className="mt-3 inline-flex w-full items-center justify-center rounded-xl bg-coral px-3 py-2.5 text-[13px] font-extrabold text-white hover:brightness-110"
              >
                Find a tutor
              </Link>
              <Link
                href="/learn/start"
                className="mt-2 inline-flex w-full items-center justify-center rounded-xl border border-white/20 px-3 py-2 text-[12px] font-bold text-white/90 hover:bg-white/10"
              >
                Free Learn Class 3–5
              </Link>
              <Link
                href="/faculty/signup"
                className="mt-2 inline-flex w-full items-center justify-center rounded-xl border border-white/20 px-3 py-2 text-[12px] font-bold text-white/90 hover:bg-white/10"
              >
                Create tutor profile
              </Link>
            </div>
          </div>
        </aside>
      </div>

      {/* Mobile more tools + CTA strip */}
      <section className="mt-10 border-t border-hairline pt-8 lg:hidden">
        <h2 className="text-[1.1rem] font-extrabold text-ink">
          Continue on Mentr
        </h2>
        <ul className="mt-3 grid gap-2 text-[13px] font-semibold sm:grid-cols-2">
          <li>
            <Link
              href="/search"
              className="block rounded-xl border border-hairline bg-white px-4 py-3"
            >
              Find a verified tutor
            </Link>
          </li>
          <li>
            <Link
              href="/learn/start"
              className="block rounded-xl border border-hairline bg-white px-4 py-3"
            >
              Free Learn for Class 3–5
            </Link>
          </li>
          <li>
            <Link
              href="/faculty/signup"
              className="block rounded-xl border border-hairline bg-white px-4 py-3"
            >
              Create tutor profile
            </Link>
          </li>
          <li>
            <Link
              href="/parent/signup"
              className="block rounded-xl border border-hairline bg-white px-4 py-3"
            >
              Parent signup
            </Link>
          </li>
        </ul>
      </section>
    </div>
  );
}
