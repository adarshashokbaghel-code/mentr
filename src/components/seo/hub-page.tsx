import { Footer } from "@/components/landing/footer";
import { Navbar } from "@/components/landing/navbar";
import { Button } from "@/components/ui/button";
import {
  breadcrumbJsonLd,
  collectionJsonLd,
  faqJsonLd,
  JsonLd,
} from "@/components/seo/json-ld";
import type { HubFaq } from "@/lib/seo-programmatic";
import {
  formatHourlyRate,
  modeLabels,
} from "@/lib/seo-live-teachers";
import {
  areaHubSlug,
  comboSlug,
  slugify,
  subjectHubSlug,
} from "@/lib/seo-hubs";
import { LOCALITIES, SUBJECTS, type Teacher } from "@/lib/teachers";
import {
  BadgeCheck,
  Globe2,
  Home,
  MapPin,
  MessageCircle,
  Zap,
} from "lucide-react";
import { MentorPhoto } from "@/components/ui/mentor-photo";
import Link from "next/link";

export function SeoBreadcrumbs({
  items,
}: {
  items: { label: string; href?: string }[];
}) {
  return (
    <nav
      aria-label="Breadcrumb"
      className="mb-4 text-xs font-medium text-muted"
    >
      <ol className="flex flex-wrap items-center gap-1.5">
        {items.map((item, i) => (
          <li key={item.label} className="inline-flex items-center gap-1.5">
            {i > 0 && <span aria-hidden>/</span>}
            {item.href ? (
              <Link href={item.href} className="hover:text-coral">
                {item.label}
              </Link>
            ) : (
              <span className="text-ink">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

function SeoListingCard({ teacher }: { teacher: Teacher }) {
  const rate = formatHourlyRate(teacher.hourlyRate);
  const modes = modeLabels(teacher);
  const languages = (teacher.languages || []).slice(0, 4);
  const subjects = teacher.subjects.slice(0, 4);
  const headline =
    teacher.qualification?.trim() ||
    teacher.designation ||
    teacher.subjectLine;
  const profileHref = `/teachers/${teacher.id}`;
  const connectHref = `/parent/signup?next=${encodeURIComponent(profileHref)}`;

  return (
    <li className="overflow-hidden rounded-2xl border border-hairline bg-white shadow-[0_1px_3px_rgba(28,26,23,0.04)] transition hover:border-ink/15 hover:shadow-[0_8px_24px_rgba(28,26,23,0.06)]">
      <div className="flex flex-col gap-4 p-4 sm:flex-row sm:gap-5 sm:p-5">
        <Link href={profileHref} className="shrink-0 self-start">
          <MentorPhoto
            name={teacher.name}
            initials={teacher.initials}
            kind={teacher.kind}
            imageUrl={teacher.imageUrl}
            size="lg"
            rounded="xl"
          />
        </Link>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <Link
              href={profileHref}
              className="text-lg font-bold tracking-tight text-ink hover:text-coral"
            >
              {teacher.name}
            </Link>
            {teacher.verified && (
              <span className="inline-flex items-center gap-1 rounded-md bg-sage-wash px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-sage">
                <BadgeCheck className="h-3 w-3" />
                Verified
              </span>
            )}
            <span className="rounded-md bg-cream-band px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-muted">
              {teacher.kind === "mentor" ? "Mentor" : "Tutor"}
            </span>
          </div>

          <div className="mt-2 flex flex-wrap gap-1.5">
            {modes.map((m) => (
              <span
                key={m}
                className="inline-flex items-center gap-1 rounded-full border border-hairline bg-cream/80 px-2.5 py-0.5 text-[11px] font-semibold text-ink"
              >
                {m === "Online" ? (
                  <Globe2 className="h-3 w-3 text-coral" />
                ) : (
                  <Home className="h-3 w-3 text-coral" />
                )}
                {m} tutor
              </span>
            ))}
          </div>

          <p className="mt-2.5 text-sm font-semibold text-ink">{headline}</p>

          {subjects.length > 0 && (
            <p className="mt-1.5 text-sm text-muted">
              <span className="font-semibold text-ink">Teaches: </span>
              {subjects.join(" · ")}
            </p>
          )}

          <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted">
            <span className="inline-flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              {teacher.area || teacher.locality || "India"}
            </span>
            {teacher.experienceYears > 0 && (
              <span>{teacher.experienceYears} yrs experience</span>
            )}
            {languages.length > 0 && (
              <span>Speaks: {languages.join(", ")}</span>
            )}
          </p>

          {teacher.bio?.trim() && (
            <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted">
              {teacher.bio}
            </p>
          )}

          <div className="mt-3 flex flex-wrap gap-2 sm:hidden">
            {rate && (
              <span className="text-base font-bold text-ink">{rate}</span>
            )}
            <Link href={profileHref} className="flex-1">
              <Button size="sm" variant="secondary" className="w-full">
                View profile
              </Button>
            </Link>
            <Link href={connectHref} className="flex-1">
              <Button size="sm" className="w-full">
                Connect free
              </Button>
            </Link>
          </div>
        </div>

        <div className="hidden w-[148px] shrink-0 flex-col items-end justify-between gap-3 sm:flex">
          <div className="text-right">
            {rate ? (
              <>
                <p className="text-xl font-bold tracking-tight text-ink">
                  {rate}
                </p>
                <p className="text-[11px] font-medium text-muted">
                  indicative fee
                </p>
              </>
            ) : (
              <p className="text-sm font-semibold text-muted">Ask for fee</p>
            )}
            {teacher.openSlots > 0 ? (
              <p className="mt-2 text-xs font-semibold text-sage">
                {teacher.openSlots} open slots
              </p>
            ) : (
              <p className="mt-2 text-xs font-semibold text-muted">
                Message for slots
              </p>
            )}
          </div>
          <div className="flex w-full flex-col gap-2">
            <Link href={profileHref}>
              <Button size="sm" variant="secondary" className="w-full">
                View profile
              </Button>
            </Link>
            <Link href={connectHref}>
              <Button size="sm" className="w-full gap-1.5">
                <MessageCircle className="h-3.5 w-3.5" />
                Connect free
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </li>
  );
}

export function SeoHubPage({
  eyebrow,
  title,
  intro,
  teachers,
  breadcrumbs,
  schemaPath,
  relatedLinks,
  ctaHref = "/search",
  ctaLabel = "Search all tutors",
  promoHref,
  promoLabel = "Find verified online tutors",
  faqs,
  requirementHref,
  requirementLabel = "Post your requirement",
  requirementBlurb,
  instantHref,
  instantLabel = "Try Instant Connect",
  instantBlurb,
  emptyMessage,
  mapHref,
}: {
  eyebrow: string;
  title: string;
  intro: string;
  teachers: Teacher[];
  breadcrumbs: { label: string; href?: string }[];
  schemaPath: string;
  relatedLinks?: { label: string; href: string }[];
  ctaHref?: string;
  ctaLabel?: string;
  promoHref?: string;
  promoLabel?: string;
  faqs?: HubFaq[];
  requirementHref?: string;
  requirementLabel?: string;
  requirementBlurb?: string;
  instantHref?: string;
  instantLabel?: string;
  instantBlurb?: string;
  emptyMessage?: string;
  mapHref?: string;
}) {
  const schemaBreadcrumbs = breadcrumbs.map((b, i) => ({
    name: b.label,
    path: b.href ?? (i === breadcrumbs.length - 1 ? schemaPath : "/"),
  }));

  const countLabel =
    teachers.length > 0
      ? `${teachers.length} verified tutor${teachers.length === 1 ? "" : "s"} — home & online`
      : null;

  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd(schemaBreadcrumbs),
          collectionJsonLd({
            name: title,
            description: intro,
            path: schemaPath,
            teachers,
          }),
          ...(faqs && faqs.length > 0 ? [faqJsonLd(faqs)] : []),
        ]}
      />
      <Navbar />
      <main className="min-h-screen pb-16">
        <div className="mx-auto max-w-[1100px] px-4 py-10 sm:px-6 lg:px-8">
          <SeoBreadcrumbs items={breadcrumbs} />
          <p className="text-sm font-semibold text-coral">{eyebrow}</p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight sm:text-4xl">
            {title}
          </h1>
          {countLabel && (
            <p className="mt-2 text-sm font-semibold text-ink">{countLabel}</p>
          )}
          <p className="mt-3 max-w-2xl text-base leading-relaxed text-muted">
            {intro}
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            {instantHref && (
              <Link href={instantHref}>
                <Button className="gap-1.5">
                  <Zap className="h-4 w-4" />
                  {instantLabel}
                </Button>
              </Link>
            )}
            <Link href={ctaHref}>
              <Button variant={instantHref ? "secondary" : "primary"}>
                {ctaLabel}
              </Button>
            </Link>
            {mapHref && (
              <Link href={mapHref}>
                <Button variant="secondary">View on map</Button>
              </Link>
            )}
            {promoHref && (
              <Link href={promoHref}>
                <Button variant="secondary">{promoLabel}</Button>
              </Link>
            )}
          </div>

          {(instantHref || requirementHref) && (
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {instantHref && (
                <aside className="rounded-xl border border-coral/30 bg-coral/5 p-5">
                  <p className="flex items-center gap-1.5 text-sm font-bold text-ink">
                    <Zap className="h-4 w-4 text-coral" />
                    {instantLabel}
                  </p>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted">
                    {instantBlurb ??
                      "Need a tutor fast? Match with verified mentors in minutes — free to try."}
                  </p>
                  <Link href={instantHref} className="mt-3 inline-block">
                    <Button size="sm">{instantLabel}</Button>
                  </Link>
                </aside>
              )}
              {requirementHref && (
                <aside className="rounded-xl border border-hairline bg-cream/70 p-5">
                  <p className="text-sm font-bold text-ink">
                    {requirementLabel}
                  </p>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted">
                    {requirementBlurb ??
                      "Can't find exactly what you need? Post your requirement and let verified tutors come to you — free on Mentr."}
                  </p>
                  <Link href={requirementHref} className="mt-3 inline-block">
                    <Button variant="secondary" size="sm">
                      {requirementLabel}
                    </Button>
                  </Link>
                </aside>
              )}
            </div>
          )}

          <section className="mt-8 max-w-2xl space-y-3 text-[15px] leading-relaxed text-muted">
            <h2 className="text-base font-bold text-ink">
              How hiring works on Mentr
            </h2>
            <p>
              Browse verified profiles for free, compare subjects, fees, and
              availability, then send a connect request. WhatsApp unlocks only
              after the tutor accepts — numbers stay private until both sides
              agree. Session fees are arranged directly; Mentr never takes a
              commission.
            </p>
          </section>

          {teachers.length === 0 ? (
            <p className="mt-10 rounded-xl border border-dashed border-hairline bg-white px-5 py-10 text-center text-sm text-muted">
              {emptyMessage ?? (
                <>
                  No tutors listed here yet —{" "}
                  <Link href="/search" className="font-semibold text-coral">
                    browse all tutors
                  </Link>
                  {instantHref && (
                    <>
                      {" "}
                      or{" "}
                      <Link
                        href={instantHref}
                        className="font-semibold text-coral"
                      >
                        try Instant Connect
                      </Link>
                    </>
                  )}
                  .
                </>
              )}
            </p>
          ) : (
            <>
              <h2 className="mt-10 text-lg font-bold text-ink">
                Tutors & mentors
              </h2>
              <ul className="mt-4 space-y-4">
                {teachers.map((t) => (
                  <SeoListingCard key={t.id} teacher={t} />
                ))}
              </ul>
            </>
          )}

          {relatedLinks && relatedLinks.length > 0 && (
            <section className="mt-10 rounded-xl border border-hairline bg-cream/60 p-5">
              <h2 className="text-sm font-bold uppercase tracking-wide text-muted">
                Related pages
              </h2>
              <ul className="mt-3 flex flex-wrap gap-2">
                {relatedLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="inline-flex rounded-full border border-hairline bg-white px-3 py-1.5 text-sm font-semibold text-ink transition hover:border-coral/40 hover:text-coral"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {faqs && faqs.length > 0 && (
            <section className="mt-10 border-t border-hairline pt-8">
              <h2 className="text-lg font-bold text-ink">Common questions</h2>
              <dl className="mt-5 space-y-5">
                {faqs.map((faq) => (
                  <div key={faq.question}>
                    <dt className="text-[15px] font-semibold text-ink">
                      {faq.question}
                    </dt>
                    <dd className="mt-2 text-sm leading-relaxed text-muted">
                      {faq.answer}
                    </dd>
                  </div>
                ))}
              </dl>
            </section>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}

/** Default related links for subject hubs */
export function subjectRelatedLinks(subject: string, teachers: Teacher[]) {
  const areas = [
    ...new Set(teachers.map((t) => t.locality).filter(Boolean)),
  ].slice(0, 6);
  return [
    ...areas.map((a) => ({
      label: `${subject} in ${a}`,
      href: `/${slugify(a)}/${comboSlug(subject)}`,
    })),
    ...LOCALITIES.slice(0, 4).map((a) => ({
      label: `All tutors in ${a}`,
      href: `/areas/${areaHubSlug(a)}`,
    })),
  ];
}

/** Default related links for area hubs */
export function areaRelatedLinks(area: string, teachers: Teacher[]) {
  const subjects = [
    ...new Set(teachers.flatMap((t) => t.subjects)),
  ].slice(0, 6);
  return [
    ...subjects.map((s) => ({
      label: `${s} in ${area}`,
      href: `/${slugify(area)}/${comboSlug(s)}`,
    })),
    ...SUBJECTS.slice(0, 4).map((s) => ({
      label: `${s} tutors in Bengaluru`,
      href: `/subjects/${subjectHubSlug(s)}`,
    })),
  ];
}
