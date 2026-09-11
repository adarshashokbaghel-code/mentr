import { FeedbackPage } from "@/components/contact/feedback-page";
import { LAUNCH_HUB_CITY, SITE_BRAND, absoluteUrl } from "@/lib/seo";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact us & request a feature — Mentr by Paprly",
  description: `Contact ${SITE_BRAND}, request a product feature, and leave a 5-star review. Parents and tutors in ${LAUNCH_HUB_CITY}, India, the UAE, and worldwide — we reply within one working day.`,
  keywords: [
    "contact Mentr",
    "Mentr feature request",
    "tutor platform feedback",
    `contact tutor finder ${LAUNCH_HUB_CITY}`,
    "Mentr by Paprly support",
  ],
  alternates: { canonical: "/contact" },
  openGraph: {
    title: "Contact us & request a feature — Mentr by Paprly",
    description:
      "Feedback, feature ideas, and a public-ready review. Free tutor-parent connector from Paprly.",
    url: absoluteUrl("/contact"),
    type: "website",
  },
};

export default function ContactPage() {
  return <FeedbackPage path="/contact" />;
}
