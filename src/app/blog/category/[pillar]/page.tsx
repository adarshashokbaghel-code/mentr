import { Footer } from "@/components/landing/footer";
import { Navbar } from "@/components/landing/navbar";
import { BlogIndex } from "@/components/blog/blog-index";
import { BLOG_PILLARS, postsByPillar, type BlogPillarId } from "@/lib/blog-posts";
import { absoluteUrl, SITE_BRAND } from "@/lib/seo";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

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
    description: `${pillar.description} Browse ${count} guides on Mentr.`,
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
      <main className="min-h-screen bg-cream">
        <BlogIndex pillar={pillar.id} />
      </main>
      <Footer />
    </>
  );
}
