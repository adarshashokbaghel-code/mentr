import { Footer } from "@/components/landing/footer";
import { Navbar } from "@/components/landing/navbar";
import {
  Globe,
  HeartHandshake,
  IndianRupee,
  ShieldCheck,
} from "lucide-react";
import { PaprlyWordmark } from "@/components/ui/paprly-wordmark";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About Mentr by Paprly — The Free Tutor-Parent Connector Worldwide",
  description:
    "Mentr by Paprly connects parents and verified tutors globally — in-person nearby or online across time zones. A free product from Paprly. No commission, no middlemen, ever.",
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
          <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-20">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-coral">
              About Mentr by Paprly
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
              Mentr is built by <PaprlyWordmark className="align-middle" />,
              the team behind simple, free business tools for founders and
              growing teams. Post a requirement and tutors pitch you, or search
              the directory and send a connect request yourself. Either way,
              numbers stay private until you accept — then you arrange
              everything directly.
            </p>
          </div>
        </section>

        <section className="bg-cream py-16 sm:py-20">
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

        <section className="border-t border-hairline bg-white py-12">
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
              .
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
