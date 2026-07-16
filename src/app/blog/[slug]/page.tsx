import { Footer } from "@/components/landing/footer";
import { Navbar } from "@/components/landing/navbar";
import {
  BLOG_PILLARS,
  BLOG_POSTS,
  FUNNEL_LABELS,
  getBlogPost,
  getPillar,
  postsByPillar,
} from "@/lib/blog-posts";
import { absoluteUrl, SITE_BRAND } from "@/lib/seo";
import { cn } from "@/lib/utils";
import { ArrowLeft, ArrowRight, Clock } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  hardShadowSm,
  LpBadge,
  LpBlob,
  LpFinalCta,
  LpGridBg,
  LpPill,
} from "@/components/landing/lp/shared";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return BLOG_POSTS.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) return {};

  const title =
    post.title.length > 52 ? `${post.title.slice(0, 49)}…` : post.title;

  return {
    title: `${title} — Mentr Blog`,
    description: post.description.slice(0, 155),
    keywords: [post.keyword, "Mentr by Paprly", "home tutor", "tutor guide"],
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      title: post.title,
      description: post.description,
      url: absoluteUrl(`/blog/${post.slug}`),
      type: "article",
    },
  };
}

const pillarTintBg: Record<string, string> = {
  lavender: "bg-lavender",
  butter: "bg-butter",
  sage: "bg-sage-wash",
  coral: "bg-coral-wash",
};

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) notFound();

  const pillar = getPillar(post.pillar);
  const related = postsByPillar(post.pillar)
    .filter((p) => p.slug !== post.slug)
    .slice(0, 3);
  const heroBg = pillarTintBg[pillar.tint] ?? "bg-cream";

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    url: absoluteUrl(`/blog/${post.slug}`),
    keywords: post.keyword,
    author: {
      "@type": "Organization",
      name: SITE_BRAND,
      url: absoluteUrl("/"),
    },
    publisher: {
      "@type": "Organization",
      name: SITE_BRAND,
      url: absoluteUrl("/"),
    },
    isPartOf: { "@type": "Blog", name: "Mentr Blog", url: absoluteUrl("/blog") },
    articleSection: pillar.label,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <Navbar />

      <main>
        <section className={cn("relative overflow-hidden border-b border-hairline", heroBg)}>
          <LpGridBg className="opacity-25" />
          <LpBlob color="rgba(255,154,77,0.1)" size={200} className="-right-12 top-8" />

          <div className="relative mx-auto max-w-[800px] px-4 py-10 sm:px-6 sm:py-16 lg:py-20 lg:px-8">
            <Link
              href={`/blog/category/${pillar.id}`}
              className="inline-flex items-center gap-2 text-sm font-semibold text-muted transition hover:text-coral"
            >
              <ArrowLeft className="h-4 w-4" />
              {pillar.label}
            </Link>

            <div className="mt-6 flex flex-wrap gap-2">
              <LpPill tint="white">{pillar.shortLabel}</LpPill>
              <LpPill tint="butter">{FUNNEL_LABELS[post.funnel]}</LpPill>
              {post.publishWeek && (
                <LpPill tint="sage">Week {post.publishWeek} launch</LpPill>
              )}
            </div>

            <h1 className="mt-6 text-3xl font-bold leading-tight tracking-tight text-ink sm:text-4xl lg:text-[44px] lg:leading-[1.12]">
              {post.title}
            </h1>

            <p className="mt-5 text-base leading-relaxed text-muted sm:text-lg">
              {post.description}
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                href={post.ctaHref}
                className={cn(
                  "inline-flex h-12 items-center gap-2 rounded-xl border-2 border-ink bg-coral px-6 text-sm font-bold text-white transition hover:translate-y-[-1px] hover:bg-coral-dark",
                  hardShadowSm,
                )}
              >
                {post.cta}
                <ArrowRight className="h-4 w-4" />
              </Link>
              <span className="text-sm text-muted">
                Target: <strong className="text-ink">{post.keyword}</strong>
              </span>
            </div>
          </div>
        </section>

        <article className="py-12 sm:py-16">
          <div className="mx-auto max-w-[720px] px-4 sm:px-6 lg:px-8">
            <div
              className={cn(
                "rounded-2xl border-2 border-ink bg-butter/40 p-6 text-center sm:p-8",
                hardShadowSm,
              )}
            >
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl border-2 border-ink bg-white">
                <Clock className="h-5 w-5 text-coral" />
              </div>
              <LpBadge className="mx-auto mt-4">Coming soon</LpBadge>
              <h2 className="mt-4 text-xl font-bold text-ink">
                Full article publishing shortly
              </h2>
              <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted">
                This guide is part of Mentr&apos;s 12-week content plan. The full
                article — with FAQs, internal links, and on-page SEO — will be
                live soon. In the meantime, use the CTA above to find tutors or
                list your profile.
              </p>
              <p className="mt-4 text-xs font-semibold text-muted">
                Reviewed by Mentr team · Mentr by Paprly
              </p>
            </div>

            <div className="mt-10 prose-spacing space-y-4 text-[15px] leading-relaxed text-ink/80">
              <p>
                <strong>Who this is for:</strong>{" "}
                {post.pillar === "for-tutors" || post.pillar === "comparison"
                  ? "Tutors and faculty looking to grow their practice on a free platform."
                  : post.pillar === "local-guides"
                    ? "Parents in Bengaluru searching for tutors in a specific neighbourhood."
                    : "Parents researching how to find, vet, and hire the right tutor for their child."}
              </p>
              <p>
                <strong>What you&apos;ll learn:</strong> {post.description}
              </p>
            </div>
          </div>
        </article>

        {related.length > 0 && (
          <section className="border-t border-hairline bg-cream-band py-12 sm:py-16">
            <div className="mx-auto max-w-[720px] px-4 sm:px-6 lg:px-8">
              <h2 className="text-lg font-bold text-ink">Related reading</h2>
              <p className="mt-1 text-sm text-muted">More from {pillar.label}</p>
              <div className="mt-6 space-y-3">
                {related.map((rel) => (
                  <Link
                    key={rel.slug}
                    href={`/blog/${rel.slug}`}
                    className={cn(
                      "group flex items-center gap-3 rounded-xl border-2 border-ink/10 bg-white p-4 transition hover:border-ink",
                      hardShadowSm,
                    )}
                  >
                    <ArrowRight className="h-4 w-4 shrink-0 text-coral" />
                    <span className="font-semibold text-ink group-hover:text-coral">
                      {rel.title}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        <LpFinalCta
          eyebrow={post.pillar === "for-tutors" ? "For faculty" : "For parents"}
          title={
            post.pillar === "for-tutors"
              ? "List free. Keep 100% of your fees."
              : "Find a verified tutor — free."
          }
          description="No coins, no lead packs, no commission. Search locally or online, connect on WhatsApp once they accept."
          primaryLabel={post.cta}
          primaryHref={post.ctaHref}
          secondaryLabel="Browse all guides"
          secondaryHref="/blog"
          perks={["Free forever", "Verified tutors", "Direct WhatsApp", "No commission"]}
        />
      </main>

      <Footer />
    </>
  );
}
