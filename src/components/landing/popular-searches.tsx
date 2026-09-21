import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LAUNCH_HUB_CITY } from "@/lib/seo";
import { slugify } from "@/lib/seo-hubs";
import { cn } from "@/lib/utils";
import {
  ArrowUpRight,
  BookOpen,
  GraduationCap,
  MapPin,
  Search,
  Zap,
} from "lucide-react";

type SearchLink = {
  label: string;
  href: string;
  hint: string;
  icon: typeof BookOpen;
  tint: string;
};

const POPULAR: SearchLink[] = [
  {
    label: "Maths tutors in Bengaluru",
    href: "/tutors/bengaluru/mathematics-tutors",
    hint: "Class 6–12 · boards",
    icon: BookOpen,
    tint: "bg-lavender",
  },
  {
    label: "Physics tutors in Bengaluru",
    href: "/tutors/bengaluru/physics-tutors",
    hint: "School · JEE foundation",
    icon: BookOpen,
    tint: "bg-butter",
  },
  {
    label: "History tutors in Bengaluru",
    href: "/tutors/bengaluru/history-tutors",
    hint: "Social science · boards",
    icon: BookOpen,
    tint: "bg-coral-wash",
  },
  {
    label: "English tutors in Bengaluru",
    href: "/tutors/bengaluru/english-tutors",
    hint: "Spoken · school English",
    icon: BookOpen,
    tint: "bg-sage-wash",
  },
  {
    label: "Coding tutors in Bengaluru",
    href: "/tutors/bengaluru/coding-tutors",
    hint: "Python · beginners",
    icon: GraduationCap,
    tint: "bg-sky",
  },
  {
    label: "Biology tutors in Bengaluru",
    href: "/tutors/bengaluru/biology-tutors",
    hint: "School · NEET foundation",
    icon: BookOpen,
    tint: "bg-lavender",
  },
  {
    label: "Chemistry tutors in Bengaluru",
    href: "/tutors/bengaluru/chemistry-tutors",
    hint: "Class 10–12",
    icon: BookOpen,
    tint: "bg-butter",
  },
  {
    label: "All tutors in Bengaluru",
    href: "/tutors/bengaluru",
    hint: "Home & online",
    icon: MapPin,
    tint: "bg-cream-band",
  },
  {
    label: "CBSE tutors",
    href: "/boards/cbse-tutors",
    hint: "Board-aligned",
    icon: GraduationCap,
    tint: "bg-sage-wash",
  },
  {
    label: "Class 10 Maths tutors",
    href: "/class/10/mathematics-tutors",
    hint: "Board year focus",
    icon: BookOpen,
    tint: "bg-coral-wash",
  },
];

const QUICK = [
  { label: "Near me", href: "/find-tutors-near-me" },
  { label: "Online tutors", href: "/find-online-tutors" },
  { label: "Post requirement", href: "/parent/signup?next=/parent/dashboard" },
  {
    label: "Instant Connect",
    href: "/parent/signup?next=/parent/dashboard%23instant-connect",
  },
];

export function PopularSearches({
  className,
}: {
  className?: string;
}) {
  return (
    <section
      id="popular-searches"
      className={cn(
        "border-b border-hairline bg-cream py-8 short:py-5 shorter:py-4 sm:py-12 short:sm:py-7",
        className,
      )}
    >
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-xl">
            <p className="text-xs font-semibold text-coral">
              Popular parent searches
            </p>
            <h2 className="mt-1.5 text-xl font-bold tracking-tight text-ink sm:text-2xl">
              Find tutors by what you{" "}
              <span className="text-coral">actually need</span>
            </h2>
            <p className="mt-1.5 text-sm leading-relaxed text-muted">
              Jump to {LAUNCH_HUB_CITY} subject pages parents search for — or
              Instant Connect if you need a match today.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link href="/search">
              <Button
                size="sm"
                variant="secondary"
                className="h-9 gap-1 rounded-lg text-xs"
              >
                <Search className="h-3.5 w-3.5" />
                Open search
              </Button>
            </Link>
            <Link href="/parent/signup?next=/parent/dashboard%23instant-connect">
              <Button size="sm" className="h-9 gap-1 rounded-lg text-xs">
                <Zap className="h-3.5 w-3.5" />
                Instant Connect
              </Button>
            </Link>
          </div>
        </div>

        <ul className="mt-5 grid gap-2 sm:mt-6 sm:grid-cols-2 lg:grid-cols-5">
          {POPULAR.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={cn(
                  "group flex h-full flex-col rounded-xl border border-hairline p-3 transition",
                  "hover:border-ink/20 hover:shadow-sm",
                  item.tint,
                )}
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-md bg-white/90 text-coral shadow-sm">
                  <item.icon className="h-3.5 w-3.5" />
                </span>
                <span className="mt-2 flex items-start justify-between gap-1.5">
                  <span className="text-[13px] font-semibold leading-snug text-ink group-hover:text-coral">
                    {item.label}
                  </span>
                  <ArrowUpRight className="mt-0.5 h-3 w-3 shrink-0 text-muted group-hover:text-coral" />
                </span>
                <span className="mt-0.5 text-[11px] text-muted">{item.hint}</span>
              </Link>
            </li>
          ))}
        </ul>

        <div className="mt-6 flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wide text-muted">
            Quick links
          </span>
          {QUICK.map((q) => (
            <Link
              key={q.href}
              href={q.href}
              className="inline-flex rounded-full border border-hairline bg-white px-3 py-1.5 text-xs font-semibold text-ink transition hover:border-coral/40 hover:text-coral"
            >
              {q.label}
            </Link>
          ))}
          {(["Accountancy", "Economics", "Geography"] as const).map((s) => (
            <Link
              key={s}
              href={`/tutors/bengaluru/${slugify(s)}-tutors`}
              className="inline-flex rounded-full border border-hairline bg-white px-3 py-1.5 text-xs font-semibold text-ink transition hover:border-coral/40 hover:text-coral"
            >
              {s}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
