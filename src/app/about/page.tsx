import { Footer } from "@/components/landing/footer";
import { Navbar } from "@/components/landing/navbar";
import {
  Globe,
  HeartHandshake,
  IndianRupee,
  Mail,
  ShieldCheck,
  Users,
} from "lucide-react";
import { PaprlyWordmark } from "@/components/ui/paprly-wordmark";
import {
  PARENT_COMPANY_NAME,
  PARENT_COMPANY_URL,
  SITE_BRAND,
} from "@/lib/seo";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About Mentr by Paprly — The Free Tutor-Parent Connector Worldwide",
  description:
    "Mentr by Paprly connects parents and verified tutors globally — in-person nearby or online across time zones. A free, open-source product from Paprly. No commission, no middlemen, ever.",
  alternates: { canonical: "/about" },
};

const values = [
  {
    icon: IndianRupee,
    title: "Free means free",
    body: "No coins, no lead packs, no commission on fees. Tutors keep 100% of what they earn, and parents never pay to see a profile or send a request.",
  },
  {
    icon: ShieldCheck,
    title: "Privacy before contact",
    body: "Phone numbers stay hidden until both sides agree. A tutor's WhatsApp unlocks only after they accept a parent's request — spam can't reach either side.",
  },
  {
    icon: Globe,
    title: "Built for the world",
    body: "Connect in-person when you're nearby or online from any country. Availability converts to each person's time zone automatically.",
  },
  {
    icon: HeartHandshake,
    title: "You two arrange the rest",
    body: "Timing, fees, and location are between the parent and the tutor. Mentr connects you and then gets out of the way.",
  },
];

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        <section className="border-b border-hairline bg-white">
          <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-16">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-coral">
              About {SITE_BRAND}
            </p>
            <h1 className="mt-3 text-3xl font-bold tracking-tight text-ink sm:text-4xl">
              Parents find teachers. Faculty get found. Free.
            </h1>
            <p className="mt-5 text-base leading-relaxed text-muted">
              Finding a good tutor usually means paying a platform — parents
              pay to unlock contacts, tutors pay for leads that never reply.
              Mentr by Paprly removes that toll booth. We verify tutors, let
              parents search locally or online worldwide, and connect the two
              sides directly on WhatsApp. Our platform fee is ₹0, forever.
            </p>
            <p className="mt-4 text-base leading-relaxed text-muted">
              Mentr is built by{" "}
              <a
                href={PARENT_COMPANY_URL}
                className="font-semibold text-coral hover:underline"
                rel="noopener noreferrer"
                target="_blank"
              >
                <PaprlyWordmark className="align-middle" />
              </a>
              , the team behind simple, free business tools for founders and
              growing teams. Post a requirement and tutors pitch you, or search
              the directory and send a connect request yourself. Either way,
              numbers stay private until you accept — then you arrange
              everything directly.
            </p>
          </div>
        </section>

        <section className="border-b border-hairline bg-cream py-10 sm:py-16">
          <div className="mx-auto max-w-3xl px-4 sm:px-6">
            <h2 className="text-2xl font-bold text-ink">What Mentr does</h2>
            <p className="mt-4 text-base leading-relaxed text-muted">
              Mentr is a tutor–parent connector, not a tuition agency. We do not
              employ tutors, set session fees, or take a cut from classes. Parents
              and students use Mentr to discover verified tutors by subject and
              area, send connect requests, or post learning requirements on a
              board where tutors pitch interest. Faculty use Mentr to list
              profiles, manage availability, and respond to requests — all
              without buying lead credits.
            </p>
            <ul className="mt-6 space-y-3 text-sm leading-relaxed text-muted">
              <li className="flex gap-2">
                <span className="font-bold text-coral">→</span>
                Search tutors in Bengaluru or online from India, UAE, and worldwide
              </li>
              <li className="flex gap-2">
                <span className="font-bold text-coral">→</span>
                Read long-form guides on hiring tutors, exam prep, and platform comparisons
              </li>
              <li className="flex gap-2">
                <span className="font-bold text-coral">→</span>
                Connect on WhatsApp only after both sides accept — privacy by default
              </li>
            </ul>
          </div>
        </section>

        <section className="border-b border-hairline bg-white py-10 sm:py-16">
          <div className="mx-auto max-w-3xl px-4 sm:px-6">
            <h2 className="text-2xl font-bold text-ink">Who we are</h2>
            <p className="mt-4 text-base leading-relaxed text-muted">
              {SITE_BRAND} is a product of {PARENT_COMPANY_NAME} (
              <a
                href={PARENT_COMPANY_URL}
                className="font-semibold text-coral hover:underline"
                rel="noopener noreferrer"
                target="_blank"
              >
                paprly.in
              </a>
              ). We are a small distributed team building free tools for
              education and business. Mentr&apos;s codebase is open source under
              the MIT license — anyone can audit how the platform works on our{" "}
              <Link href="/open-source" className="font-semibold text-coral hover:underline">
                open source page
              </Link>
              .
            </p>
            <div className="mt-8 flex items-start gap-4 rounded-xl border border-hairline bg-cream p-5">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-sage-wash text-sage">
                <Users className="h-5 w-5" />
              </span>
              <div>
                <p className="font-semibold text-ink">Contact the team</p>
                <p className="mt-1 text-sm leading-relaxed text-muted">
                  General questions, press, and partnerships:{" "}
                  <a
                    href="mailto:hello@mentr.in"
                    className="inline-flex items-center gap-1 font-semibold text-coral hover:underline"
                  >
                    <Mail className="h-3.5 w-3.5" />
                    hello@mentr.in
                  </a>
                  . Safety reports:{" "}
                  <a
                    href="mailto:safety@mentr.in"
                    className="font-semibold text-coral hover:underline"
                  >
                    safety@mentr.in
                  </a>
                  . We reply within one working day.
                </p>
                <Link
                  href="/contact"
                  className="mt-3 inline-block text-sm font-semibold text-coral hover:underline"
                >
                  All contact options →
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-cream py-10 sm:py-16">
          <div className="mx-auto max-w-3xl px-4 sm:px-6">
            <h2 className="text-2xl font-bold text-ink">What we believe</h2>
            <div className="mt-8 grid gap-6 sm:grid-cols-2">
              {values.map((v) => (
                <div
                  key={v.title}
                  className="rounded-xl border border-hairline bg-white p-5"
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-sage-wash text-sage">
                    <v.icon className="h-5 w-5" />
                  </span>
                  <h3 className="mt-4 font-semibold text-ink">{v.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">
                    {v.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="border-t border-hairline bg-white py-10 sm:py-16">
          <div className="mx-auto max-w-3xl px-4 sm:px-6">
            <h2 className="text-2xl font-bold text-ink">Guides &amp; transparency</h2>
            <p className="mt-4 text-base leading-relaxed text-muted">
              We publish dozens of free guides for parents, students, and tutors
              — fee benchmarks, exam timelines, safety checklists, and honest
              platform comparisons. Read our{" "}
              <Link
                href="/editorial-policy"
                className="font-semibold text-coral hover:underline"
              >
                editorial policy
              </Link>{" "}
              to see how we research, update, and correct content. Public pages
              may show Google AdSense ads; logged-in dashboards do not.
            </p>
          </div>
        </section>

        <section className="border-t border-hairline bg-cream py-12">
          <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
            <p className="text-muted">
              Ready to try it?{" "}
              <Link href="/search" className="font-semibold text-coral hover:underline">
                Search tutors
              </Link>{" "}
              or{" "}
              <Link href="/for-faculty" className="font-semibold text-coral hover:underline">
                list as faculty
              </Link>
              . Browse{" "}
              <Link href="/blog" className="font-semibold text-coral hover:underline">
                all guides
              </Link>
              .
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
