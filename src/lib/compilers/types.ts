import type { CompilerId } from "./paths";

export type CompilerFaq = { question: string; answer: string };

export type CompilerTextSection = {
  id: string;
  kicker: string;
  heading: string;
  paragraphs: string[];
  bullets?: string[];
};

/**
 * One online compiler: everything SEO needs (metadata, JSON-LD, landing copy,
 * sitemap, nav) comes from this object. Add a new language by adding one of these.
 */
export type CompilerDef = {
  id: CompilerId;
  /** "Python" */
  language: string;
  path: string;
  howItWorksPath: string;
  /** Short UI name, e.g. "Online Python compiler". */
  name: string;
  /** Runtime facts shown on the page and in JSON-LD. */
  runtime: { version: string; engine: string; download: string };

  seo: {
    /** Absolute <title>, ≤ 60 chars, primary keyword first. */
    title: string;
    /** ≤ 160 chars. */
    description: string;
    /** The one query this page must win. */
    primaryKeyword: string;
    secondaryKeywords: string[];
    longTailKeywords: string[];
    howItWorksTitle: string;
    howItWorksDescription: string;
    howItWorksKeywords: string[];
    /** ISO date the how-it-works article was first published. */
    howItWorksPublished: string;
    howItWorksUpdated: string;
  };

  landing: {
    heading: string;
    intro: string[];
    facts: [value: string, label: string][];
    features: { title: string; text: string }[];
    howTo: { name: string; text: string }[];
    sections: CompilerTextSection[];
    examples: { title: string; code: string }[];
    limits: string[];
    learnCta?: { title: string; text: string; label: string; href: string };
  };

  faqs: CompilerFaq[];
  /** Blog posts written for this compiler's keyword cluster. */
  blogSlugs: string[];
};
