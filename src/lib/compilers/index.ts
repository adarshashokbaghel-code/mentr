import { breadcrumbJsonLd, faqJsonLd } from "@/components/seo/json-ld";
import { absoluteUrl, hubOpenGraph, PARENT_ORG_JSON_LD, SITE_BRAND } from "@/lib/seo";
import type { Metadata, MetadataRoute } from "next";
import { COMPILERS_HUB_PATH, type CompilerId } from "./paths";
import { PYTHON_COMPILER } from "./python";
import type { CompilerDef } from "./types";

export { COMPILER_PATHS, COMPILERS_HUB_PATH, type CompilerId } from "./paths";
export type { CompilerDef } from "./types";

export const COMPILERS: CompilerDef[] = [PYTHON_COMPILER];

/** The hub only earns a place in search once it lists more than one compiler. */
export const COMPILERS_HUB_INDEXABLE = COMPILERS.length > 1;

export function getCompiler(id: CompilerId): CompilerDef {
  const def = COMPILERS.find((c) => c.id === id);
  if (!def) throw new Error(`Unknown compiler: ${id}`);
  return def;
}

/** The compiler a link points at (its page or its how-it-works article), if any. */
export function compilerForHref(href: string): CompilerDef | undefined {
  const path = href.split(/[?#]/)[0];
  return COMPILERS.find((c) => path === c.path || path.startsWith(`${c.path}/`));
}

const PUBLISHER = {
  "@type": "Organization",
  name: SITE_BRAND,
  url: absoluteUrl("/"),
  parentOrganization: PARENT_ORG_JSON_LD,
};

export function compilerKeywords(def: CompilerDef): string[] {
  return [def.seo.primaryKeyword, ...def.seo.secondaryKeywords, ...def.seo.longTailKeywords];
}

export function compilerMetadata(def: CompilerDef): Metadata {
  const { title, description } = def.seo;
  return {
    title: { absolute: title },
    description,
    keywords: compilerKeywords(def),
    alternates: { canonical: def.path },
    openGraph: hubOpenGraph(title, description, def.path),
    twitter: { card: "summary_large_image", title, description },
    robots: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  };
}

export function howItWorksMetadata(def: CompilerDef): Metadata {
  const { howItWorksTitle: title, howItWorksDescription: description } = def.seo;
  return {
    title: { absolute: `${title} | ${SITE_BRAND}` },
    description,
    keywords: def.seo.howItWorksKeywords,
    alternates: { canonical: def.howItWorksPath },
    openGraph: {
      ...hubOpenGraph(title, description, def.howItWorksPath),
      type: "article",
      publishedTime: def.seo.howItWorksPublished,
      modifiedTime: def.seo.howItWorksUpdated,
    },
    twitter: { card: "summary_large_image", title, description },
    robots: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  };
}

function breadcrumbs(def: CompilerDef, extra?: { name: string; path: string }) {
  return breadcrumbJsonLd([
    { name: "Home", path: "/" },
    ...(COMPILERS_HUB_INDEXABLE ? [{ name: "Online compilers", path: COMPILERS_HUB_PATH }] : []),
    { name: def.name, path: def.path },
    ...(extra ? [extra] : []),
  ]);
}

export function compilerJsonLd(def: CompilerDef): object[] {
  const url = absoluteUrl(def.path);
  return [
    breadcrumbs(def),
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "@id": `${url}#app`,
      name: `${def.name} by ${SITE_BRAND}`,
      alternateName: [`Mentr ${def.language} compiler`, `${def.language} compiler online`],
      url,
      description: def.seo.description,
      applicationCategory: "DeveloperApplication",
      applicationSubCategory: `${def.language} compiler`,
      operatingSystem: "Any (runs in a web browser)",
      browserRequirements: "Requires JavaScript and WebAssembly",
      softwareVersion: def.runtime.version,
      inLanguage: "en",
      isAccessibleForFree: true,
      offers: { "@type": "Offer", price: "0", priceCurrency: "INR" },
      featureList: def.landing.features.map((f) => f.title),
      publisher: PUBLISHER,
      subjectOf: { "@type": "TechArticle", url: absoluteUrl(def.howItWorksPath), name: def.seo.howItWorksTitle },
    },
    {
      "@context": "https://schema.org",
      "@type": "HowTo",
      name: `How to run ${def.language} code online`,
      tool: { "@type": "HowToTool", name: def.name },
      step: def.landing.howTo.map((s, i) => ({
        "@type": "HowToStep",
        position: i + 1,
        name: s.name,
        text: s.text,
        url: `${url}#how-to`,
      })),
    },
    faqJsonLd(def.faqs),
  ];
}

export function howItWorksJsonLd(def: CompilerDef): object[] {
  const url = absoluteUrl(def.howItWorksPath);
  return [
    breadcrumbs(def, { name: "How it works", path: def.howItWorksPath }),
    {
      "@context": "https://schema.org",
      "@type": "TechArticle",
      headline: def.seo.howItWorksTitle,
      description: def.seo.howItWorksDescription,
      url,
      mainEntityOfPage: url,
      datePublished: def.seo.howItWorksPublished,
      dateModified: def.seo.howItWorksUpdated,
      author: { "@type": "Organization", name: "Mentr Engineering", url: absoluteUrl("/") },
      publisher: PUBLISHER,
      keywords: def.seo.howItWorksKeywords.join(", "),
      proficiencyLevel: "Beginner",
      about: { "@id": `${absoluteUrl(def.path)}#app` },
      image: absoluteUrl(`${def.howItWorksPath}/opengraph-image`),
    },
  ];
}

export function compilerSitemapEntries(lastModified: Date): MetadataRoute.Sitemap {
  return [
    ...(COMPILERS_HUB_INDEXABLE
      ? [{ url: absoluteUrl(COMPILERS_HUB_PATH), lastModified, changeFrequency: "weekly" as const, priority: 0.85 }]
      : []),
    ...COMPILERS.flatMap((c) => [
      { url: absoluteUrl(c.path), lastModified, changeFrequency: "weekly" as const, priority: 0.95 },
      { url: absoluteUrl(c.howItWorksPath), lastModified, changeFrequency: "monthly" as const, priority: 0.7 },
    ]),
  ];
}
