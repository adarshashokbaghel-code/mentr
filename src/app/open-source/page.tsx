import { OpenSourceLanding } from "@/components/landing/lp/open-source-page";
import { Footer } from "@/components/landing/footer";
import { Navbar } from "@/components/landing/navbar";
import { PageMarketing } from "@/components/marketing/page-marketing";
import { JsonLd, breadcrumbJsonLd } from "@/components/seo/json-ld";
import { fetchGithubRepoStats } from "@/lib/github-repo";
import {
  absoluteUrl,
  CREATOR_GITHUB_URL,
  CREATOR_LINKEDIN_URL,
  CREATOR_NAME,
  CREATOR_ROLE,
  GITHUB_REPO_URL,
  PARENT_COMPANY_NAME,
  PARENT_COMPANY_URL,
  SITE_BRAND,
  SITE_URL,
} from "@/lib/seo";
import type { Metadata } from "next";

const PAGE_TITLE =
  "Mentr Open Source — Contribute on GitHub | MIT EdTech by Adarsh Singh";
const PAGE_DESCRIPTION =
  "Contribute to Mentr, the MIT-licensed open source tutor-parent platform. Fork on GitHub, fix bugs, ship PRs. Created by Adarsh Singh (LinkedIn) at Paprly — ₹0 fees, zero commission, built for developers who want real edtech impact.";

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  keywords: [
    "contribute to open source edtech",
    "open source tutoring platform github",
    "Mentr open source",
    "contribute to Mentr",
    "MIT licensed tutor platform",
    "open source project for developers India",
    "good first issue edtech",
    "creator of Mentr",
    "Adarsh Singh Mentr",
    "Adarsh Singh Paprly LinkedIn",
    "who created Mentr",
    "free open source education platform",
    "Paprly Mentr github",
  ],
  alternates: { canonical: "/open-source" },
  openGraph: {
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    url: absoluteUrl("/open-source"),
    type: "website",
    siteName: SITE_BRAND,
  },
  twitter: {
    card: "summary_large_image",
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
  },
};

const OPEN_SOURCE_FAQS = [
  {
    question: "Is Mentr open source?",
    answer:
      "Yes. Mentr by Paprly is MIT licensed and published at github.com/adarshashokbaghel-code/mentr. Anyone can fork, audit, or contribute.",
  },
  {
    question: "How do I contribute to Mentr as a developer?",
    answer:
      "Fork the GitHub repo, set up locally with npm install and .env.example, pick a good first issue or focused fix, run npm run lint and npm run build, then open a pull request. See mentr.in/open-source and CONTRIBUTING.md.",
  },
  {
    question: "Who created Mentr?",
    answer:
      "Adarsh Singh created Mentr by Paprly. He is a software engineer and ex-Founding Engineer at Paprly. Find him on LinkedIn at linkedin.com/in/adarshsingh05.",
  },
  {
    question: "Where can I find Adarsh Singh, the creator of Mentr?",
    answer:
      "Adarsh Singh's LinkedIn is https://www.linkedin.com/in/adarshsingh05. The open source page at mentr.in/open-source also lists the creator, GitHub activity, and how to contribute.",
  },
];

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: CREATOR_NAME,
  url: CREATOR_LINKEDIN_URL,
  image: absoluteUrl("/team/adarsh-singh.png"),
  jobTitle: CREATOR_ROLE,
  description:
    "Creator of Mentr by Paprly — free open-source tutor-parent connector. Software engineer based in Bengaluru. Builds tools that should stay free.",
  sameAs: [CREATOR_LINKEDIN_URL, CREATOR_GITHUB_URL, GITHUB_REPO_URL],
  worksFor: {
    "@type": "Organization",
    name: PARENT_COMPANY_NAME,
    url: PARENT_COMPANY_URL,
  },
  knowsAbout: [
    "Open source",
    "Edtech",
    "Tutoring platforms",
    "Next.js",
    "TypeScript",
  ],
};

const softwareSourceJsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareSourceCode",
  name: "Mentr",
  description:
    "Open source MIT-licensed platform connecting parents with verified tutors — zero commission. Accepting contributions from developers worldwide.",
  codeRepository: GITHUB_REPO_URL,
  url: absoluteUrl("/open-source"),
  programmingLanguage: ["TypeScript", "JavaScript"],
  runtimePlatform: "Node.js",
  license: "https://spdx.org/licenses/MIT.html",
  isAccessibleForFree: true,
  author: {
    "@type": "Person",
    name: CREATOR_NAME,
    url: CREATOR_LINKEDIN_URL,
    sameAs: [CREATOR_LINKEDIN_URL, CREATOR_GITHUB_URL],
  },
  creator: {
    "@type": "Person",
    name: CREATOR_NAME,
    url: CREATOR_LINKEDIN_URL,
  },
  publisher: {
    "@type": "Organization",
    name: PARENT_COMPANY_NAME,
    url: PARENT_COMPANY_URL,
  },
};

const softwareAppJsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: SITE_BRAND,
  applicationCategory: "EducationalApplication",
  operatingSystem: "Web",
  url: SITE_URL,
  downloadUrl: GITHUB_REPO_URL,
  isAccessibleForFree: true,
  license: "https://spdx.org/licenses/MIT.html",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "INR",
  },
  creator: {
    "@type": "Person",
    name: CREATOR_NAME,
    url: CREATOR_LINKEDIN_URL,
  },
  description:
    "Free open source tutor-parent connector. Search locally or online, connect on WhatsApp, zero platform fees. Contribute on GitHub.",
};

const webPageJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  url: absoluteUrl("/open-source"),
  isPartOf: { "@type": "WebSite", name: SITE_BRAND, url: SITE_URL },
  about: softwareSourceJsonLd,
  mainEntity: personJsonLd,
  speakable: {
    "@type": "SpeakableSpecification",
    cssSelector: ["h1", "h2"],
  },
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: OPEN_SOURCE_FAQS.map((f) => ({
    "@type": "Question",
    name: f.question,
    acceptedAnswer: { "@type": "Answer", text: f.answer },
  })),
};

export default async function OpenSourcePage() {
  const githubStats = await fetchGithubRepoStats();

  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Open source", path: "/open-source" },
          ]),
          webPageJsonLd,
          softwareSourceJsonLd,
          softwareAppJsonLd,
          personJsonLd,
          faqJsonLd,
        ]}
      />
      <PageMarketing slug="open-source" path="/open-source" />
      <Navbar />
      <OpenSourceLanding githubStats={githubStats} />
      <Footer />
    </>
  );
}
