import { Footer } from "@/components/landing/footer";
import { Navbar } from "@/components/landing/navbar";
import {
  BLOG_PILLARS,
  postsByPillar,
  type BlogPillarId,
} from "@/lib/blog-posts";
import { absoluteUrl, SITE_BRAND } from "@/lib/seo";
import { cn } from "@/lib/utils";
import { ArrowLeft, ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  hardShadowSm,
  LpBadge,
  LpBlob,
  LpFinalCta,
  LpGridBg,
  SectionHeader,
} from "@/components/landing/lp/shared";

const pillarTintBg: Record<string, string> = {
  lavender: "bg-lavender",
  butter: "bg-butter",
  sage: "bg-sage-wash",
  coral: "bg-coral-wash",
};

type Props = { params: Promise<{ pillar: string }> };

export function generateStaticParams() {
  return BLOG_PILLARS.map((p) => ({ pillar: p.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { pillar: pillarId } = await params;
  const pillar = BLOG_PILLARS.find((p) => p.id === pillarId);
  if (!pillar) return {};

  const count = postsByPillar(pillar.id as BlogPillarId).length;
  return {
    title: `${pillar.label} — Mentr Blog`,
    description: `${pillar.description} Browse ${count} guides on Mentr by Paprly.`,
    alternates: { canonical: `/blog/category/${pillar.id}` },
    openGraph: {
      title: `${pillar.label} — Mentr Blog`,
      description: pillar.description,
      url: absoluteUrl(`/blog/category/${pillar.id}`),
      type: "website",
    },
  };
}

export default async function BlogCategoryPage({ params }: Props) {
  const { pillar: pillarId } = await params;
  const pillar = BLOG_PILLARS.find((p) => p.id === pillarId);
  if (!pillar) notFound();

  const posts = postsByPillar(pillar.id);
  const bg = pillarTintBg[pillar.tint] ?? "bg-cream";

  const collectionJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${pillar.label} — Mentr Blog`,
    description: pillar.description,
    url: absoluteUrl(`/blog/category/${pillar.id}`),
    isPartOf: { "@type": "Blog", name: "Mentr Blog", url: absoluteUrl("/blog") },
    publisher: { "@type": "Organization", name: SITE_BRAND },
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: posts.length,
      itemListElement: posts.map((post, i) => ({
        "@type": "ListItem",
        position: i + 1,
        url: absoluteUrl(`/blog/${post.slug}`),
        name: post.title,
      })),
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionJsonLd) }}
      />
      <Navbar />

      <main>
        <section className={cn("relative overflow-hidden border-b border-hairline", bg)}>
          <LpGridBg className="opacity-25" />
          <LpBlob color="rgba(255,154,77,0.1)" size={240} className="-right-16 top-0" />

          <div className="relative mx-auto max-w-[900px] px-4 py-10 sm:px-6 sm:py-16 lg:py-20 lg:px-8">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-sm font-semibold text-muted transition hover:text-coral"
            >
              <ArrowLeft className="h-4 w-4" />
              All guides
            </Link>

            <LpBadge className="mt-6">{pillar.shortLabel}</LpBadge>
            <h1 className="mt-5 text-3xl font-bold tracking-tight text-ink sm:text-4xl lg:text-5xl">
              {pillar.label}
            </h1>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-muted sm:text-lg">
              {pillar.description}
            </p>
            <p className="mt-4 text-sm font-semibold text-ink">
              {posts.length} {posts.length === 1 ? "article" : "articles"}
            </p>
          </div>
        </section>

        <section className="py-12 sm:py-20">
          <div className="mx-auto max-w-[900px] px-4 sm:px-6 lg:px-8">
            <div className="space-y-4">
              {posts.map((post, i) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className={cn(
                    "group flex items-start gap-4 rounded-2xl border-2 border-ink/10 bg-white p-5 transition-all duration-200 sm:p-6",
                    hardShadowSm,
                    "hover:border-ink hover:-translate-y-0.5",
                  )}
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border-2 border-ink bg-butter text-sm font-bold text-ink">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-ink group-hover:text-coral">{post.title}</p>
                    <p className="mt-1.5 text-sm leading-relaxed text-muted">{post.description}</p>
                    <p className="mt-2 text-xs font-medium text-muted">{post.keyword}</p>
                  </div>
                  <ArrowRight className="mt-1 h-5 w-5 shrink-0 text-muted transition-transform group-hover:translate-x-1 group-hover:text-coral" />
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="border-t border-hairline bg-cream-band py-12">
          <div className="mx-auto max-w-[900px] px-4 sm:px-6 lg:px-8">
            <SectionHeader
              eyebrow="Other topics"
              title="Explore more"
              accent="pillars."
              align="left"
            />
            <div className="mt-8 flex flex-wrap gap-2">
              {BLOG_PILLARS.filter((p) => p.id !== pillar.id).map((p) => (
                <Link
                  key={p.id}
                  href={`/blog/category/${p.id}`}
                  className="rounded-xl border-2 border-ink/15 bg-white px-4 py-2 text-sm font-bold text-ink transition hover:border-ink hover:bg-cream"
                >
                  {p.shortLabel}
                  <span className="ml-1.5 text-muted">
                    ({postsByPillar(p.id).length})
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <LpFinalCta
          eyebrow="Take the next step"
          title="Put these guides to work."
          description="Search verified tutors, post your requirement, or list your profile — everything on Mentr is free."
          primaryLabel="Find a teacher"
          primaryHref="/search"
          secondaryLabel="All guides"
          secondaryHref="/blog"
        />
      </main>

      <Footer />
    </>
  );
}
