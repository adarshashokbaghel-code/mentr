import { Footer } from "@/components/landing/footer";
import { Navbar } from "@/components/landing/navbar";
import { JsonLd, breadcrumbJsonLd } from "@/components/seo/json-ld";
import { ToolsHubClient } from "@/components/tools/tools-hub-client";
import { TOOLS, TOOLS_HUB } from "@/lib/tools-catalog";
import { absoluteUrl, SITE_BRAND } from "@/lib/seo";
import { Shield, Sparkles, Wrench, Zap } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: TOOLS_HUB.title,
  description: TOOLS_HUB.description,
  keywords: [...TOOLS_HUB.keywords],
  alternates: { canonical: TOOLS_HUB.path },
  openGraph: {
    title: "Free Education Tools for Parents & Tutors | Mentr",
    description: TOOLS_HUB.description,
    url: absoluteUrl(TOOLS_HUB.path),
    type: "website",
    locale: "en_IN",
    images: [
      {
        url: absoluteUrl("/images/tools/pdf-merge.webp"),
        alt: "Mentr Tools",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Education Tools | Mentr",
    description: TOOLS_HUB.description,
    images: [absoluteUrl("/images/tools/pdf-merge.webp")],
  },
};

export default function ToolsHubPage() {
  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Tools", path: "/tools" },
          ]),
          {
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: "Mentr Tools",
            description: TOOLS_HUB.description,
            url: absoluteUrl("/tools"),
            isPartOf: {
              "@type": "WebSite",
              name: SITE_BRAND,
              url: absoluteUrl("/"),
            },
            hasPart: TOOLS.map((t) => ({
              "@type": "WebApplication",
              name: t.title,
              url: absoluteUrl(`/tools/${t.slug}`),
              applicationCategory: "UtilitiesApplication",
              offers: { "@type": "Offer", price: "0", priceCurrency: "INR" },
            })),
          },
        ]}
      />
      <Navbar />
      <main id="main-content" className="min-h-screen bg-[#f3f0ea]">
        <section className="relative overflow-hidden border-b border-hairline">
          <div
            className="pointer-events-none absolute inset-0"
            aria-hidden
            style={{
              background:
                "radial-gradient(ellipse 70% 80% at 8% 0%, rgba(255,106,26,0.16), transparent 50%), radial-gradient(ellipse 50% 60% at 95% 20%, rgba(61,143,122,0.12), transparent 45%), linear-gradient(180deg, #faf7f2 0%, #f3f0ea 100%)",
            }}
          />
          <div className="relative mx-auto flex w-full max-w-[1400px] flex-col gap-4 px-3 py-8 sm:flex-row sm:items-end sm:justify-between sm:px-6 sm:py-10 lg:px-8">
            <div className="max-w-2xl">
              <p className="inline-flex items-center gap-2 text-[12px] font-bold uppercase tracking-wider text-coral">
                <Wrench className="h-3.5 w-3.5" />
                Mentr Tools
              </p>
            <h1 className="mt-2 text-[1.85rem] font-extrabold tracking-tight text-ink sm:text-[2.35rem] sm:leading-[1.12]">
              Free education tools for teachers, tutors, parents &amp; students
            </h1>
            
            </div>
            <ul className="flex flex-wrap gap-2 text-[11px] font-bold sm:justify-end">
              <li className="inline-flex items-center gap-1.5 rounded-full bg-white px-2.5 py-1.5 text-sage ring-1 ring-sage/25">
                <Shield className="h-3 w-3" />
                Private
              </li>
              <li className="inline-flex items-center gap-1.5 rounded-full bg-white px-2.5 py-1.5 text-ink ring-1 ring-hairline">
                <Zap className="h-3 w-3 text-coral" />
                ₹0 forever
              </li>
              <li className="inline-flex items-center gap-1.5 rounded-full bg-white px-2.5 py-1.5 text-ink ring-1 ring-hairline">
                <Sparkles className="h-3 w-3 text-coral" />
                {TOOLS.length} tools
              </li>
            </ul>
          </div>
        </section>

        <ToolsHubClient />
      </main>
      <Footer />
    </>
  );
}
