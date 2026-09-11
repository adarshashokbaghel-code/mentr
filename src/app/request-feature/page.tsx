import { FeedbackPage } from "@/components/contact/feedback-page";
import { LAUNCH_HUB_CITY, SITE_BRAND, absoluteUrl } from "@/lib/seo";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Request a feature & contact us — Mentr by Paprly",
  description: `Request a feature on ${SITE_BRAND}, send feedback, and rate us out of 5. Built with parents and tutors in ${LAUNCH_HUB_CITY}, India, and worldwide.`,
  keywords: [
    "request a feature Mentr",
    "tutor app feature request",
    "Mentr product feedback",
    `feature request ${LAUNCH_HUB_CITY}`,
    "contact Mentr by Paprly",
  ],
  alternates: { canonical: "/request-feature" },
  openGraph: {
    title: "Request a feature & contact us — Mentr by Paprly",
    description:
      "Tell us what to build next. Same form as Contact — feedback, feature title, and a 5-star review.",
    url: absoluteUrl("/request-feature"),
    type: "website",
  },
};

export default function RequestFeaturePage() {
  return <FeedbackPage path="/request-feature" />;
}
