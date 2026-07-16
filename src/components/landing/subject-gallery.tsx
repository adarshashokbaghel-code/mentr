import Link from "next/link";
import { SUBJECTS } from "@/lib/teachers";
import {
  BookOpen,
  Briefcase,
  Code2,
  FlaskConical,
  Languages,
  Music,
} from "lucide-react";

const icons = [BookOpen, FlaskConical, Code2, Languages, Briefcase, Music];

const featured = SUBJECTS.slice(0, 6).map((name, i) => ({
  name,
  Icon: icons[i % icons.length],
  tint: [
    "bg-lavender",
    "bg-butter",
    "bg-sage-wash",
    "bg-coral-wash",
    "bg-sky",
    "bg-cream-band",
  ][i],
}));

export function SubjectGallery() {
  return (
    <section className="border-b border-hairline bg-white py-16 sm:py-24">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold text-coral">
              30+ subjects · zero upcharges
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl lg:text-[40px]">
              Subjects parents search.{" "}
              <span className="text-coral">Faculty list for free.</span>
            </h2>
          </div>
          <p className="max-w-md text-base text-muted lg:text-right">
            Maths, physics, coding, exam prep — search tutors directly or post
            your requirement and get pitches. Free either way.
          </p>
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map(({ name, Icon, tint }) => (
            <Link
              key={name}
              href={`/search?subject=${encodeURIComponent(name)}`}
              className={`group rounded-lg border border-hairline p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(28,26,23,0.1)] ${tint}`}
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-md bg-white shadow-sm">
                <Icon className="h-5 w-5 text-coral" />
              </span>
              <h3 className="mt-4 text-lg font-semibold text-ink group-hover:text-coral">
                {name}
              </h3>
              <p className="mt-1 text-sm text-muted">
                Search tutors · post requirement · WhatsApp
              </p>
            </Link>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/search"
            className="text-sm font-semibold text-coral hover:underline"
          >
            See all subjects →
          </Link>
        </div>
      </div>
    </section>
  );
}
