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

const TITLE = "Learn Python Free: Beginner Course + Free Online Compiler";
const DESCRIPTION =
  "Learn Python free: 10 interactive lessons, 500+ practice questions and a free online Python compiler. No 60-hour videos. From print() to your own quiz game. ₹0, no card.";

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
