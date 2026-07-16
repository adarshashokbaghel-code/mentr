import { Footer } from "@/components/landing/footer";
import { Navbar } from "@/components/landing/navbar";
import { BlogIndex } from "@/components/blog/blog-index";
import { BLOG_POSTS } from "@/lib/blog-posts";
import { absoluteUrl, SITE_BRAND } from "@/lib/seo";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mentr Blog — Tutor Guides, Comparisons & Local Listings",
  description:
    "Guides for parents and tutors: how to find a home tutor, compare platforms, JEE/NEET prep, safety checklists, and Bengaluru local tutor listings.",
  alternates: { canonical: "/blog" },
  openGraph: {
    title: "Mentr Blog — Guides for parents & tutors",
    description:
      "Find-a-tutor guides, platform comparisons, exam prep timelines, and local Bengaluru tutor listings.",
    url: absoluteUrl("/blog"),
    type: "website",
  },
};

const blogJsonLd = {
  "@context": "https://schema.org",
  "@type": "Blog",
  name: "Mentr Blog",
  description:
    "Guides for parents and tutors on finding tutors, comparing platforms, exam prep, and local listings.",
  url: absoluteUrl("/blog"),
  publisher: {
    "@type": "Organization",
    name: SITE_BRAND,
    url: absoluteUrl("/"),
  },
  blogPost: BLOG_POSTS.map((post) => ({
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    url: absoluteUrl(`/blog/${post.slug}`),
  })),
};

export default function BlogPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogJsonLd) }}
      />
      <Navbar />
      <main className="min-h-screen bg-cream">
        <BlogIndex />
      </main>
      <Footer />
    </>
  );
}
