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
import { absoluteUrl } from "@/lib/seo";
import {
  areaHubSlug,
  comboSlug,
  slugify,
  subjectHubSlug,
} from "@/lib/seo-hubs";
import { LOCALITIES, SUBJECTS, type Teacher } from "@/lib/teachers";
import { MapPin, Star } from "lucide-react";
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

function SeoTeacherRow({ teacher }: { teacher: Teacher }) {
  const available = teacher.openSlots > 0;

  return (
    <li className="flex gap-4 rounded-xl border border-hairline bg-white p-4 shadow-[0_1px_3px_rgba(28,26,23,0.05)] transition hover:border-ink/20">
      <MentorPhoto
        name={teacher.name}
        initials={teacher.initials}
        kind={teacher.kind}
        imageUrl={teacher.imageUrl}
        size="md"
        rounded="lg"
      />
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <Link
            href={`/teachers/${teacher.id}`}
            className="text-base font-bold text-ink hover:text-coral"
          >
            {teacher.name}
          </Link>
          {teacher.verified && (
            <span className="rounded-md bg-sage-wash px-1.5 py-0.5 text-[10px] font-bold text-sage">
              Verified
            </span>
          )}
        </div>
        <p className="text-sm font-medium text-coral">{teacher.subjectLine}</p>
        <p className="mt-0.5 flex items-center gap-1 text-xs text-muted">
          <MapPin className="h-3 w-3" />
          {teacher.area} · {teacher.experienceYears} yrs
          {teacher.reviewCount > 0 && (
            <>
              {" "}
              ·{" "}
              <Star className="inline h-3 w-3 fill-coral text-coral" />
              {teacher.rating.toFixed(1)}
            </>
          )}
        </p>
        <p className="mt-1.5 line-clamp-2 text-sm text-muted">{teacher.bio}</p>
      </div>
      <div className="hidden shrink-0 flex-col items-end gap-2 sm:flex">
        <span
          className={
            available
              ? "text-xs font-semibold text-sage"
              : "text-xs font-semibold text-muted"
          }
        >
          {available ? `${teacher.openSlots} open slots` : "Fully booked"}
        </span>
        <Link href={`/teachers/${teacher.id}`}>
          <Button size="sm" variant={available ? "primary" : "secondary"}>
            View profile
          </Button>
        </Link>
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
  emptyMessage,
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
  emptyMessage?: string;
}) {
  const schemaBreadcrumbs = breadcrumbs.map((b, i) => ({
    name: b.label,
    path:
      b.href ??
      (i === breadcrumbs.length - 1 ? schemaPath : "/"),
  }));

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
          <p className="mt-3 max-w-2xl text-base leading-relaxed text-muted">
            {intro}
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link href={ctaHref}>
              <Button>{ctaLabel}</Button>
            </Link>
            {promoHref && (
              <Link href={promoHref}>
                <Button variant="secondary">{promoLabel}</Button>
              </Link>
            )}
          </div>

          <section className="mt-8 max-w-2xl space-y-3 text-[15px] leading-relaxed text-muted">
            <h2 className="text-base font-bold text-ink">
              How hiring works on Mentr
            </h2>
            <p>
              Browse verified profiles for free, compare subjects and availability,
              then send a connect request. WhatsApp unlocks only after the tutor
              accepts — so numbers stay private until both sides agree. Session
              fees are arranged directly; Mentr never takes a commission.
            </p>
            <p>
              Prefer tutors to come to you?{" "}
              <Link
                href="/parent/signup"
                className="font-semibold text-coral underline-offset-2 hover:underline"
              >
                Post a requirement
              </Link>{" "}
              with subject, class, and budget. You stay anonymous on the board
              until you accept a pitch. Read our{" "}
              <Link
                href="/blog"
                className="font-semibold text-coral underline-offset-2 hover:underline"
              >
                parent & tutor guides
              </Link>{" "}
              for fees, safety checklists, and trial tips.
            </p>
          </section>

          {requirementHref && (
            <aside className="mt-6 rounded-xl border border-coral/25 bg-coral/5 p-5 sm:p-6">
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

          {teachers.length === 0 ? (
            <p className="mt-10 rounded-xl border border-dashed border-hairline bg-white px-5 py-10 text-center text-sm text-muted">
              {emptyMessage ?? (
                <>
                  No tutors listed here yet —{" "}
                  <Link href="/search" className="font-semibold text-coral">
                    browse all tutors
                  </Link>
                  .
                </>
              )}
            </p>
          ) : (
            <ul className="mt-8 space-y-3">
              {teachers.map((t) => (
                <SeoTeacherRow key={t.id} teacher={t} />
              ))}
            </ul>
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
