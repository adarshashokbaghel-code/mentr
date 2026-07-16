import { Footer } from "@/components/landing/footer";
import { Navbar } from "@/components/landing/navbar";
import { Button } from "@/components/ui/button";
import { JsonLd, breadcrumbJsonLd } from "@/components/seo/json-ld";
import { LOCALITIES, SUBJECTS } from "@/lib/teachers";
import type { Metadata } from "next";
import Link from "next/link";
import { areaHubSlug, subjectHubSlug } from "@/lib/seo-hubs";

export const metadata: Metadata = {
  title: "Tutor Search Bengaluru — Filter by Subject & Area",
  description:
    "Browse verified Maths, Physics, English and Coding tutors across Bengaluru. Filter by subject, area and open slots. Free to search.",
  alternates: { canonical: "/search/bengaluru" },
};

export default function SearchBengaluruPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Search", path: "/search/bengaluru" },
          { name: "Bengaluru", path: "/search/bengaluru" },
        ])}
      />
      <Navbar />
      <main className="min-h-screen pb-16">
        <div className="mx-auto max-w-[900px] px-4 py-12 sm:px-6 lg:px-8">
          <p className="text-sm font-semibold text-coral">Search</p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight sm:text-4xl">
            Find tutors in Bengaluru
          </h1>
          <p className="mt-3 text-base leading-relaxed text-muted">
            Browse verified tutors by subject and area. See open weekly slots and
            send a free connect request — WhatsApp unlocks after the tutor
            accepts.
          </p>
          <Link href="/search" className="mt-6 inline-block">
            <Button>Open search tool</Button>
          </Link>
          <div className="mt-10 grid gap-8 sm:grid-cols-2">
            <section>
              <h2 className="text-sm font-bold uppercase tracking-wide text-muted">
                By subject
              </h2>
              <ul className="mt-3 space-y-1.5">
                {SUBJECTS.map((s) => (
                  <li key={s}>
                    <Link
                      href={`/subjects/${subjectHubSlug(s)}`}
                      className="text-sm font-semibold text-ink hover:text-coral"
                    >
                      {s} tutors
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
            <section>
              <h2 className="text-sm font-bold uppercase tracking-wide text-muted">
                By area
              </h2>
              <ul className="mt-3 space-y-1.5">
                {LOCALITIES.map((a) => (
                  <li key={a}>
                    <Link
                      href={`/areas/${areaHubSlug(a)}`}
                      className="text-sm font-semibold text-ink hover:text-coral"
                    >
                      Tutors in {a}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
