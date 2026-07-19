import Link from "next/link";
import { Button } from "@/components/ui/button";

const GUIDES = [
  {
    label: "Find online tutors",
    href: "/find-online-tutors",
    desc: "Verified tutors worldwide — free connect",
  },
  {
    label: "Verified online tutors",
    href: "/find-verified-online-tutors",
    desc: "ID-checked profiles, no lead fees",
  },
  {
    label: "Find mentors near me",
    href: "/find-mentors-near-me",
    desc: "Career & coding mentors, local or online",
  },
  {
    label: "Online tutor jobs",
    href: "/online-tutor-jobs",
    desc: "List free, keep 100% of your fees",
  },
];

export function SeoGuidesStrip() {
  return (
    <section className="border-y border-hairline bg-cream/40 py-12 sm:py-14">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-coral">
              Guides
            </p>
            <h2 className="mt-1 text-xl font-bold text-ink sm:text-2xl">
              Find tutors & mentors online
            </h2>
            <p className="mt-2 max-w-lg text-sm text-muted">
              Exact-match guides for parents and tutors — India, UAE, and
              worldwide. Free on Mentr.
            </p>
          </div>
          <Link href="/blog" className="shrink-0">
            <Button variant="secondary" size="sm">
              All blog guides
            </Button>
          </Link>
        </div>
        <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {GUIDES.map((g) => (
            <li key={g.href}>
              <Link
                href={g.href}
                className="flex h-full flex-col rounded-xl border border-hairline bg-white p-4 shadow-[0_1px_3px_rgba(28,26,23,0.05)] transition hover:border-coral/30 hover:shadow-[0_4px_14px_rgba(28,26,23,0.08)]"
              >
                <span className="text-sm font-bold text-ink">{g.label}</span>
                <span className="mt-1 text-xs leading-relaxed text-muted">
                  {g.desc}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
