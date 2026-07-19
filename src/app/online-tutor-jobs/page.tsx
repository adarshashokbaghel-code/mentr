import { KeywordLandingPage } from "@/components/seo/keyword-landing-page";
import { JsonLd } from "@/components/seo/json-ld";
import { ONLINE_TUTOR_JOBS_PAGE } from "@/lib/seo-landing-pages";
import { absoluteUrl, hubOpenGraph } from "@/lib/seo";
import type { Metadata } from "next";

const config = ONLINE_TUTOR_JOBS_PAGE;
const path = "/online-tutor-jobs";

export const metadata: Metadata = {
  title: config.title,
  description: config.metaDescription,
  keywords: config.keywords,
  alternates: { canonical: path },
  openGraph: hubOpenGraph(config.title, config.metaDescription, path),
};

const occupationJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: config.h1,
  description: config.metaDescription,
  url: absoluteUrl(path),
  about: {
    "@type": "Occupation",
    name: "Online Tutor",
    occupationalCategory: "Education",
    description:
      "List as an online tutor or mentor on Mentr — free profile, verified badge, parent connect requests, no lead fees.",
  },
};

export default function OnlineTutorJobsPage() {
  return (
    <>
      <JsonLd data={occupationJsonLd} />
      <KeywordLandingPage config={config} />
    </>
  );
}
