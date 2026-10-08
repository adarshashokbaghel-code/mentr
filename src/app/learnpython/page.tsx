import { Footer } from "@/components/landing/footer";
import { Navbar } from "@/components/landing/navbar";
import { LearnPythonLanding } from "@/components/learn-python/learn-python-landing";
import { PageMarketing } from "@/components/marketing/page-marketing";
import { JsonLd, breadcrumbJsonLd, faqJsonLd } from "@/components/seo/json-ld";
import {
  LEARN_PYTHON_FAQS,
  LEARN_PYTHON_KEYWORDS,
  LEARN_PYTHON_PATH,
  learnPythonCourseJsonLd,
} from "@/lib/learn-python";
import { hubOpenGraph } from "@/lib/seo";
import type { Metadata } from "next";

const TITLE = "Learn Python Online with Certificate — Hands-on Course for Beginners";
const DESCRIPTION =
  "Learn Python by writing real code: 10 hands-on lessons, 500+ auto-checked exercises, an in-browser Python compiler and a verifiable certificate for LinkedIn. Built for college students and first-time coders.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: LEARN_PYTHON_KEYWORDS,
  alternates: { canonical: LEARN_PYTHON_PATH },
  openGraph: hubOpenGraph(TITLE, DESCRIPTION, LEARN_PYTHON_PATH),
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
  },
};

export default function LearnPythonPage() {
  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Mentr Learn", path: "/learn" },
            { name: "Learn Python", path: LEARN_PYTHON_PATH },
          ]),
          learnPythonCourseJsonLd(DESCRIPTION),
          faqJsonLd(LEARN_PYTHON_FAQS),
        ]}
      />
      <PageMarketing slug="learnpython" path={LEARN_PYTHON_PATH} />
      <Navbar />
      <main className="min-h-screen bg-cream">
        <LearnPythonLanding />
      </main>
      <Footer />
    </>
  );
}
