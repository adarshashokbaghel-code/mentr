import { Footer } from "@/components/landing/footer";
import { Navbar } from "@/components/landing/navbar";
import { JsonLd, breadcrumbJsonLd } from "@/components/seo/json-ld";
import { ToolPageBody } from "@/components/tools/tool-page-body";
import { getToolBySlug, TOOLS, toolOgImagePath } from "@/lib/tools-catalog";
import { getAllToolFaqs } from "@/lib/tools-page-copy";
import {
  absoluteUrl,
  PARENT_ORG_JSON_LD,
  SITE_BRAND,
  SITE_NAME,
  SITE_URL,
} from "@/lib/seo";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return TOOLS.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const tool = getToolBySlug(slug);
  if (!tool) return { title: "Tool not found" };

  const path = `/tools/${tool.slug}`;
  const url = absoluteUrl(path);
  // Absolute title avoids double suffix from root layout template
  const title = tool.metaTitle.replace(/\s*\|\s*Mentr Tools\s*$/i, "");
  const absoluteTitle = `${title} | ${SITE_NAME}`;
  const ogImage = absoluteUrl(toolOgImagePath(tool.slug));

  return {
    title: { absolute: absoluteTitle },
    description: tool.metaDescription,
    keywords: [
      ...tool.keywords,
      "Mentr Tools",
      "free online tool",
      "no signup",
      "browser PDF tool",
      "India education tools",
      SITE_NAME,
    ],
    authors: [{ name: SITE_BRAND, url: SITE_URL }],
    creator: SITE_BRAND,
    publisher: SITE_BRAND,
    category: "education",
    alternates: { canonical: path },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    openGraph: {
      title: absoluteTitle,
      description: tool.metaDescription,
      url,
      type: "website",
      siteName: SITE_BRAND,
      locale: "en_IN",
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: tool.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: absoluteTitle,
      description: tool.metaDescription,
      images: [ogImage],
    },
  };
}

export default async function ToolSlugPage({ params }: Props) {
  const { slug } = await params;
  const tool = getToolBySlug(slug);
  if (!tool) notFound();

  const faqs = getAllToolFaqs(tool);
  const path = `/tools/${tool.slug}`;
  const url = absoluteUrl(path);

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };

  const howToJsonLd = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: `How to use ${tool.title} on Mentr`,
    description: tool.metaDescription,
    totalTime: "PT2M",
    step: tool.howTo.map((text, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      name: `Step ${i + 1}`,
      text,
    })),
  };

  const appJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: tool.title,
    alternateName: tool.shortTitle,
    description: tool.metaDescription,
    url,
    applicationCategory: "UtilitiesApplication",
    applicationSubCategory: "EducationApplication",
    operatingSystem: "Any",
    browserRequirements: "Requires JavaScript",
    isAccessibleForFree: true,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "INR",
    },
    featureList: [
      ...tool.useCases.slice(0, 4),
      "Runs in browser",
      "No signup required",
      "Private — no file upload to Mentr servers",
    ],
    keywords: tool.keywords.join(", "),
    provider: {
      "@type": "Organization",
      name: SITE_BRAND,
      url: absoluteUrl("/"),
      parentOrganization: PARENT_ORG_JSON_LD,
    },
    isPartOf: {
      "@type": "WebSite",
      name: SITE_BRAND,
      url: absoluteUrl("/"),
    },
  };

  const webPageJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: tool.metaTitle,
    description: tool.metaDescription,
    url,
    isPartOf: {
      "@type": "WebSite",
      name: SITE_BRAND,
      url: absoluteUrl("/"),
    },
    about: {
      "@type": "Thing",
      name: tool.title,
    },
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: ["h1", "article"],
    },
    mainEntity: {
      "@type": "WebApplication",
      name: tool.title,
      url,
    },
  };

  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Tools", path: "/tools" },
            { name: tool.shortTitle, path },
          ]),
          webPageJsonLd,
          appJsonLd,
          howToJsonLd,
          faqJsonLd,
        ]}
      />
      <Navbar />
      <main id="main-content" className="min-h-screen bg-[#f3f0ea]">
        <ToolPageBody tool={tool} />
      </main>
      <Footer />
    </>
  );
}
