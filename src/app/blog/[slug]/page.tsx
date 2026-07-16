import {
  ArticleBreadcrumb,
  ArticleCta,
  ArticleFaqSection,
  ArticleProse,
} from "@/components/blog/article-prose";
import { BlogPostCard } from "@/components/blog/blog-post-card";
import { BlogShell } from "@/components/blog/blog-shell";
import { hardShadowSm } from "@/components/landing/lp/shared";
import { Footer } from "@/components/landing/footer";
import { Navbar } from "@/components/landing/navbar";
import { cn } from "@/lib/utils";
import { getArticleContent } from "@/lib/blog-content";
import {
  BLOG_POSTS,
  getBlogPost,
  getPillar,
  postsByPillar,
} from "@/lib/blog-posts";
import { absoluteUrl, SITE_BRAND } from "@/lib/seo";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return BLOG_POSTS.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) return {};

  const content = getArticleContent(slug);
  const title =
    post.title.length > 52 ? `${post.title.slice(0, 49)}…` : post.title;

  return {
    title: `${title} — Mentr Blog`,
    description: post.description.slice(0, 155),
    keywords: [post.keyword, "Mentr", "home tutor", "tutor guide"],
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      title: post.title,
      description: post.description,
      url: absoluteUrl(`/blog/${post.slug}`),
      type: "article",
      publishedTime: content.publishedAt,
      modifiedTime: content.updatedAt,
      authors: [content.author],
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) notFound();

  const content = getArticleContent(slug);
  const pillar = getPillar(post.pillar);
  const related = postsByPillar(post.pillar)
    .filter((p) => p.slug !== post.slug)
    .slice(0, 3);

  const date = new Date(content.publishedAt).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    url: absoluteUrl(`/blog/${post.slug}`),
    datePublished: content.publishedAt,
    dateModified: content.updatedAt,
    author: {
      "@type": "Organization",
      name: content.author,
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

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: content.faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([articleJsonLd, faqJsonLd]),
        }}
      />
      <Navbar />

      <main className="min-h-screen bg-cream">
        <BlogShell hideSidebar variant="article">
          <ArticleBreadcrumb
            items={[
              { label: "Blog", href: "/blog" },
              { label: pillar.shortLabel, href: `/blog/category/${pillar.id}` },
              { label: post.title },
            ]}
          />

          <header className="border-b-2 border-ink/10 pb-6 sm:pb-8">
            <Link
              href={`/blog/category/${pillar.id}`}
              className="inline-flex min-h-11 items-center text-sm font-semibold text-coral touch-manipulation hover:underline active:opacity-80"
            >
              {pillar.label}
            </Link>
            <h1 className="mt-2 text-2xl font-bold leading-tight tracking-tight text-ink sm:mt-3 sm:text-3xl lg:text-4xl">
              {post.title}
            </h1>
            <p className="mt-3 text-base leading-relaxed text-muted sm:mt-4 sm:text-lg">
              {post.description}
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted sm:mt-5 sm:text-sm">
              <span>{content.author}</span>
              <span aria-hidden>·</span>
              <time dateTime={content.publishedAt}>{date}</time>
              <span aria-hidden>·</span>
              <span>{content.readTimeMinutes} min read</span>
            </div>
          </header>

          <div className="py-6 sm:py-8">
            <ArticleCta
              label={post.cta}
              href={post.ctaHref}
              text={
                post.pillar === "for-tutors"
                  ? "Ready to grow your tutoring practice? List your profile on Mentr for free — no lead fees, no commission."
                  : "Looking for a verified tutor? Search on Mentr and connect directly on WhatsApp once they accept — completely free."
              }
            />

            <ArticleProse intro={content.intro} sections={content.sections} />

            {content.relatedLinks.length > 0 && (
              <aside
                className={cn(
                  "my-8 rounded-2xl border-2 border-ink bg-white p-4 sm:my-10 sm:p-5",
                  hardShadowSm,
                )}
              >
                <p className="text-sm font-semibold text-ink">Related links</p>
                <ul className="mt-3 space-y-2">
                  {content.relatedLinks.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="inline-flex min-h-11 items-center text-sm font-semibold text-coral touch-manipulation hover:underline active:opacity-80"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </aside>
            )}

            <ArticleCta
              label={post.cta}
              href={post.ctaHref}
              text="Take the next step — everything on Mentr is free for parents and faculty."
            />

            <ArticleFaqSection faqs={content.faqs} />
          </div>
        </BlogShell>

        {related.length > 0 && (
          <section className="w-full border-t-2 border-ink/10 bg-white">
            <div className="mx-auto max-w-[1400px] px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
              <h2 className="text-lg font-bold text-ink sm:text-xl">
                More in {pillar.shortLabel}
              </h2>
              <div className="mt-5 grid grid-cols-1 gap-4 sm:mt-6 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
                {related.map((rel) => (
                  <BlogPostCard key={rel.slug} post={rel} />
                ))}
              </div>
            </div>
          </section>
        )}
      </main>

      <Footer />
    </>
  );
}
