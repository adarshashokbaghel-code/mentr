import { Footer } from "@/components/landing/footer";
import { Navbar } from "@/components/landing/navbar";
import { PageMarketing } from "@/components/marketing/page-marketing";
import { JsonLd, breadcrumbJsonLd } from "@/components/seo/json-ld";
import { absoluteUrl, SITE_BRAND } from "@/lib/seo";
import { GraduationCap, Users } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Mentr Login — Parent or Tutor | Free Account Access",
  description:
    "Mentr login: choose Parent or Tutor. OTP email sign-in for families and faculty. Also enroll free in Mentr Learn (Class 3–5).",
  keywords: [
    "mentr login",
    "mentr app login",
    "mentr parent login",
    "mentr tutor login",
    "mentr faculty login",
  ],
  alternates: { canonical: "/login" },
  openGraph: {
    title: "Mentr Login — Parent or Tutor",
    description:
      "Sign in as a parent or tutor. Free accounts — no lead fees.",
    url: absoluteUrl("/login"),
    type: "website",
  },
};

export default function LoginChooserPage() {
  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Login", path: "/login" },
          ]),
          {
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: "Mentr Login",
            description:
              "Choose parent or tutor login for Mentr by Paprly.",
            url: absoluteUrl("/login"),
            isPartOf: {
              "@type": "WebSite",
              name: SITE_BRAND,
              url: absoluteUrl("/"),
            },
          },
        ]}
      />
      <PageMarketing slug="login" path="/login" />
      <Navbar />
      <main className="min-h-[70vh] bg-cream px-4 py-12 sm:px-6 sm:py-16">
        <div className="mx-auto max-w-lg text-center">
          <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-coral">
            Mentr login
          </p>
          <h1 className="mt-2 text-[1.75rem] font-extrabold tracking-tight text-ink sm:text-[2rem]">
            Who are you signing in as?
          </h1>
          <p className="mt-2 text-[14px] font-medium text-muted sm:text-[15px]">
            Parents and tutors use different accounts. Pick one — OTP via email.
          </p>

          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            <Link
              href="/parent"
              className="flex flex-col items-center gap-2 rounded-2xl border-2 border-ink bg-white px-5 py-6 text-center shadow-[3px_3px_0_0_#1c1a17] transition hover:-translate-y-0.5"
            >
              <Users className="h-8 w-8 text-coral" strokeWidth={2.2} />
              <span className="text-[16px] font-extrabold text-ink">Parent</span>
              <span className="text-[12px] font-medium text-muted">
                Find tutors · Learn enroll
              </span>
            </Link>
            <Link
              href="/faculty"
              className="flex flex-col items-center gap-2 rounded-2xl border-2 border-ink bg-white px-5 py-6 text-center shadow-[3px_3px_0_0_#1c1a17] transition hover:-translate-y-0.5"
            >
              <GraduationCap className="h-8 w-8 text-sage" strokeWidth={2.2} />
              <span className="text-[16px] font-extrabold text-ink">
                Tutor / Mentor
              </span>
              <span className="text-[12px] font-medium text-muted">
                List free · Keep 100%
              </span>
            </Link>
          </div>

          <p className="mt-6 text-[13px] text-muted">
            New here?{" "}
            <Link href="/parent/signup" className="font-bold text-coral hover:underline">
              Parent signup
            </Link>
            {" · "}
            <Link href="/faculty/signup" className="font-bold text-coral hover:underline">
              Tutor signup
            </Link>
            {" · "}
            <Link href="/learn/start" className="font-bold text-coral hover:underline">
              Mentr Learn
            </Link>
          </p>
          <p className="mt-3 text-[12px] text-muted">
            Full guide:{" "}
            <Link
              href="/blog/how-to-login-mentr"
              className="font-semibold text-ink underline-offset-2 hover:underline"
            >
              How to log in to Mentr
            </Link>
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
