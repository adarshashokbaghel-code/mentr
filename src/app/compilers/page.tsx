import { Footer } from "@/components/landing/footer";
import { Navbar } from "@/components/landing/navbar";
import { JsonLd, breadcrumbJsonLd } from "@/components/seo/json-ld";
import { COMPILERS, COMPILERS_HUB_INDEXABLE, COMPILERS_HUB_PATH } from "@/lib/compilers";
import { absoluteUrl, hubOpenGraph } from "@/lib/seo";
import { ArrowRight, Terminal } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

const TITLE = "Free Online Compilers That Run in Your Browser | Mentr";
const DESCRIPTION =
  "Free online compilers by Mentr. Write and run code in your browser on phone or desktop. No sign-up, nothing to install, and your code stays on your device.";

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: COMPILERS_HUB_PATH },
  openGraph: hubOpenGraph(TITLE, DESCRIPTION, COMPILERS_HUB_PATH),
  robots: { index: COMPILERS_HUB_INDEXABLE, follow: true },
};

export default function CompilersHubPage() {
  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Online compilers", path: COMPILERS_HUB_PATH },
          ]),
          {
            "@context": "https://schema.org",
            "@type": "ItemList",
            name: "Mentr online compilers",
            itemListElement: COMPILERS.map((c, i) => ({
              "@type": "ListItem",
              position: i + 1,
              name: c.name,
              url: absoluteUrl(c.path),
            })),
          },
        ]}
      />
      <Navbar />
      <main className="min-h-screen bg-cream text-ink">
        <div className="mx-auto w-full max-w-[920px] px-4 pb-24 pt-12 sm:px-6">
          <p className="font-mono text-[12px] uppercase tracking-[0.16em] text-coral">Free tools</p>
          <h1 className="mt-2 text-[34px] font-extrabold leading-[1.1] tracking-tight sm:text-[44px]">Online compilers that run in your browser</h1>
          <p className="mt-4 max-w-[680px] text-[17px] leading-relaxed text-muted">
            Each compiler downloads its language once and then runs your code on your own device. No server, no sign-up, and it works on a
            phone as well as a laptop.
          </p>
          <ul className="mt-10 grid gap-4 sm:grid-cols-2">
            {COMPILERS.map((c) => (
              <li key={c.id} className="flex flex-col border border-hairline bg-white px-6 py-6">
                <span className="flex h-10 w-10 items-center justify-center bg-[#2f9e6e] text-white">
                  <Terminal className="h-5 w-5" />
                </span>
                <h2 className="mt-4 text-[20px] font-extrabold">{c.name}</h2>
                <p className="mt-1 text-[14.5px] leading-relaxed text-muted">
                  {c.language} {c.runtime.version} · {c.seo.description}
                </p>
                <div className="mt-5 flex flex-wrap gap-3 pt-1">
                  <Link href={c.path} className="inline-flex items-center gap-2 bg-ink px-4 py-2.5 text-[14px] font-bold text-white transition hover:bg-black">
                    Open compiler <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link href={c.howItWorksPath} className="inline-flex items-center border border-ink px-4 py-2.5 text-[14px] font-bold">
                    How it works
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </main>
      <Footer />
    </>
  );
}
