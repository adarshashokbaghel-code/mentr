import { Footer } from "@/components/landing/footer";
import { Navbar } from "@/components/landing/navbar";
import { Mail, MessageSquare, ShieldAlert } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact us",
  description:
    "Questions about finding a tutor, listing as faculty, or verification on Mentr? Reach the team — we reply within one working day.",
  alternates: { canonical: "/contact" },
};

const channels = [
  {
    icon: Mail,
    title: "General questions",
    body: "Anything about how Mentr works, accounts, or your profile.",
    action: "hello@mentr.in",
    href: "mailto:hello@mentr.in",
  },
  {
    icon: ShieldAlert,
    title: "Report a profile",
    body: "Spotted something off about a listing or a message? Tell us — verification is our core promise.",
    action: "safety@mentr.in",
    href: "mailto:safety@mentr.in",
  },
  {
    icon: MessageSquare,
    title: "Partnerships & press",
    body: "Schools, communities, or media — we'd love to talk.",
    action: "team@mentr.in",
    href: "mailto:team@mentr.in",
  },
];

export default function ContactPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        <section className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-16">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-coral">
            Contact
          </p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-ink sm:text-4xl">
            Talk to the Mentr team
          </h1>
          <p className="mt-4 text-base leading-relaxed text-muted">
            We&apos;re a small distributed team and we read everything. Expect
            a reply within one working day.
          </p>

          <div className="mt-10 space-y-4">
            {channels.map((c) => (
              <a
                key={c.title}
                href={c.href}
                className="flex items-start gap-4 rounded-xl border border-hairline bg-white p-5 transition hover:border-ink/25 hover:shadow-[0_4px_14px_rgba(28,26,23,0.07)]"
              >
                <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-coral-wash">
                  <c.icon className="h-5 w-5 text-coral-dark" />
                </span>
                <span>
                  <span className="block text-base font-bold text-ink">
                    {c.title}
                  </span>
                  <span className="mt-1 block text-sm leading-relaxed text-muted">
                    {c.body}
                  </span>
                  <span className="mt-2 inline-block text-sm font-bold text-coral">
                    {c.action}
                  </span>
                </span>
              </a>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
