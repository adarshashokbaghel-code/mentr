import { TeacherConnectPanel } from "@/components/connect/teacher-connect-panel";
import { ProfileViewBeacon } from "@/components/teachers/profile-view-beacon";
import { AvailabilitySchedule } from "@/components/teachers/availability-schedule";
import { Footer } from "@/components/landing/footer";
import { Navbar } from "@/components/landing/navbar";
import { SeoBreadcrumbs } from "@/components/seo/hub-page";
import { breadcrumbJsonLd, JsonLd } from "@/components/seo/json-ld";
import { Badge } from "@/components/ui/badge";
import { getTeacher, TEACHERS, type Teacher } from "@/lib/teachers";
import { fetchLiveTeacher } from "@/lib/live-teacher-server";
import {
  BadgeCheck,
  MapPin,
  Briefcase,
  Star,
  Award,
  Trophy,
  GraduationCap,
  Globe,
  IndianRupee,
  Languages,
  MonitorSmartphone,
  PlayCircle,
  ShieldCheck,
} from "lucide-react";
import { absoluteUrl } from "@/lib/seo";
import { areaHubSlug, subjectHubSlug } from "@/lib/seo-hubs";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cache } from "react";

export const dynamic = "force-dynamic";

export function generateStaticParams() {
  return TEACHERS.map((t) => ({ id: t.id }));
}

export const dynamicParams = true;

/** Memoized so generateMetadata and the page share one DB lookup. */
const resolveTeacher = cache(async (id: string): Promise<Teacher | null> => {
  return getTeacher(id) ?? (await fetchLiveTeacher(id));
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const teacher = await resolveTeacher(id);
  if (!teacher) {
    return { title: "Teacher profile", robots: { index: false } };
  }
  const title = `${teacher.name} — ${teacher.subjectLine} Tutor in ${teacher.area}, Bengaluru`;
  const description = `${teacher.name} teaches ${teacher.subjectLine} in ${teacher.area}. View the verified profile and send a free connect request on WhatsApp.`;
  return {
    title,
    description,
    alternates: { canonical: `/teachers/${teacher.id}` },
    openGraph: {
      title,
      description,
      url: absoluteUrl(`/teachers/${teacher.id}`),
      type: "profile",
      ...(teacher.imageUrl ? { images: [teacher.imageUrl] } : {}),
    },
  };
}

export default async function TeacherProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const teacher = await resolveTeacher(id);
  if (!teacher) notFound();

  const available = teacher.openSlots > 0;

  const modeLabels: string[] = [];
  if ((teacher.modes ?? []).includes("online")) modeLabels.push("Online");
  if ((teacher.modes ?? []).includes("student_home"))
    modeLabels.push("At your home");
  if ((teacher.modes ?? []).includes("tutor_home"))
    modeLabels.push("At their place");

  const socialEntries = Object.entries(teacher.socials ?? {}).filter(
    ([, url]) => !!url,
  ) as [string, string][];
  const socialLabels: Record<string, string> = {
    linkedin: "LinkedIn",
    github: "GitHub",
    website: "Website",
    youtube: "YouTube",
    instagram: "Instagram",
  };

  const hasCredentials =
    !!teacher.qualification ||
    !!teacher.workplace ||
    (teacher.certifications?.length ?? 0) > 0 ||
    (teacher.achievements?.length ?? 0) > 0 ||
    !!teacher.introVideo ||
    socialEntries.length > 0;

  const facts = [
    {
      icon: Briefcase,
      label: "Experience",
      value: `${teacher.experienceYears} yrs`,
    },
    {
      icon: GraduationCap,
      label: "Teaches",
      value: teacher.levels || "—",
    },
    {
      icon: MonitorSmartphone,
      label: "Mode",
      value: modeLabels.length > 0 ? modeLabels.join(" · ") : "—",
    },
    {
      icon: Languages,
      label: "Languages",
      value:
        (teacher.languages?.length ?? 0) > 0
          ? teacher.languages!.join(", ")
          : "—",
    },
    ...(teacher.hourlyRate
      ? [
          {
            icon: IndianRupee,
            label: "Indicative rate",
            value: `₹${teacher.hourlyRate}/hr — final fee is between you two`,
          },
        ]
      : []),
  ];

  const primarySubject = teacher.subjects[0] ?? teacher.subjectLine;
  const subjectHubPath = `/subjects/${subjectHubSlug(primarySubject)}`;
  const areaHubPath = `/areas/${areaHubSlug(teacher.locality)}`;

  const profileSchema = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    mainEntity: {
      "@type": "Person",
      name: teacher.name,
      jobTitle: `${teacher.subjectLine} tutor`,
      description: teacher.bio,
      url: absoluteUrl(`/teachers/${teacher.id}`),
      ...(teacher.imageUrl ? { image: teacher.imageUrl } : {}),
      knowsAbout: teacher.subjects,
      knowsLanguage: teacher.languages ?? [],
      areaServed: teacher.area,
      ...(socialEntries.length > 0
        ? { sameAs: socialEntries.map(([, url]) => url) }
        : {}),
    },
  };

  const imageAlt = `${teacher.name}, ${teacher.subjectLine} tutor in ${teacher.area}, Bengaluru`;

  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: `${primarySubject} tutors`, href: subjectHubPath },
    { label: teacher.locality, href: areaHubPath },
    { label: teacher.name },
  ];

  return (
    <>
      <ProfileViewBeacon teacherId={teacher.id} />
      <JsonLd
        data={[
          breadcrumbJsonLd(
            breadcrumbs.map((b, i) => ({
              name: b.label,
              path:
                b.href ??
                (i === breadcrumbs.length - 1
                  ? `/teachers/${teacher.id}`
                  : "/"),
            })),
          ),
          profileSchema,
        ]}
      />
      <Navbar />
      <main className="min-h-screen pb-16">
        <div className="mx-auto max-w-[1400px] px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
          <SeoBreadcrumbs items={breadcrumbs} />
          <Link
            href="/search"
            className="mt-2 inline-block text-sm font-semibold text-coral hover:underline"
          >
            Search all tutors
          </Link>

          <header className="mt-5 flex flex-col gap-5 sm:flex-row sm:items-start">
            <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-2xl bg-cream-band sm:h-36 sm:w-36">
              {teacher.imageUrl ? (
                <Image
                  src={teacher.imageUrl}
                  alt={imageAlt}
                  fill
                  className="object-cover"
                  sizes="144px"
                  priority
                />
              ) : (
                <span className="flex h-full w-full items-center justify-center bg-gradient-to-br from-cream to-cream-band text-4xl font-bold text-ink/30">
                  {teacher.initials}
                </span>
              )}
            </div>
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl">
                  {teacher.name}
                </h1>
                {teacher.verified && (
                  <Badge variant="sage" className="gap-1">
                    <BadgeCheck className="h-3.5 w-3.5" />
                    Verified
                  </Badge>
                )}
                {teacher.reviewCount > 0 ? (
                  <span className="inline-flex items-center gap-1 rounded-md bg-butter/70 px-2 py-1 text-sm font-bold text-ink">
                    <Star className="h-3.5 w-3.5 fill-coral text-coral" />
                    {teacher.rating.toFixed(1)}
                    <span className="font-medium text-muted">
                      ({teacher.reviewCount})
                    </span>
                  </span>
                ) : (
                  <span className="rounded-md bg-coral px-2 py-1 text-sm font-bold text-white">
                    New on Mentr
                  </span>
                )}
              </div>
              <p className="mt-1 text-base font-medium text-coral sm:text-lg">
                {teacher.subjectLine}
              </p>
              <p className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted">
                <span className="inline-flex items-center gap-1">
                  <Briefcase className="h-3.5 w-3.5" />
                  {teacher.experienceYears} yrs · {teacher.designation}
                </span>
                <span className="inline-flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5" />
                  {teacher.area}
                </span>
              </p>
              {teacher.verified && (
                <p className="mt-2 inline-flex items-center gap-1.5 text-sm text-sage">
                  <ShieldCheck className="h-4 w-4" />
                  Phone and identity verified by Mentr
                </p>
              )}
              <div className="mt-3 flex flex-wrap gap-2">
                {teacher.subjects.map((s) => (
                  <span
                    key={s}
                    className="rounded-full border border-hairline bg-white px-3 py-1 text-sm font-medium"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </header>

          <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1fr)_400px] lg:gap-12">
            {/* ----------------------------- main column ----------------------------- */}
            <div className="min-w-0">
              <section>
                <h2 className="text-xl font-semibold">About</h2>
                <p className="mt-3 max-w-3xl text-base leading-relaxed text-muted">
                  {teacher.bio}
                </p>
              </section>

              {hasCredentials && (
                <section className="mt-10">
                  <h2 className="text-xl font-semibold">
                    Credentials &amp; achievements
                  </h2>
                  <div className="mt-4 space-y-4">
                    {(teacher.qualification || teacher.workplace) && (
                      <div className="flex items-start gap-3 rounded-xl border border-hairline bg-white p-4">
                        <GraduationCap className="mt-0.5 h-[18px] w-[18px] shrink-0 text-coral" />
                        <div>
                          {teacher.qualification && (
                            <p className="text-sm font-semibold text-ink">
                              {teacher.qualification}
                            </p>
                          )}
                          {teacher.workplace && (
                            <p className="mt-0.5 text-sm text-muted">
                              {teacher.workplace}
                            </p>
                          )}
                        </div>
                      </div>
                    )}

                    {(teacher.certifications?.length ?? 0) > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {teacher.certifications!.map((c) => (
                          <span
                            key={c}
                            className="inline-flex items-center gap-1.5 rounded-full bg-sage-wash px-3 py-1.5 text-sm font-medium text-sage"
                          >
                            <Award className="h-3.5 w-3.5" />
                            {c}
                          </span>
                        ))}
                      </div>
                    )}

                    {(teacher.achievements?.length ?? 0) > 0 && (
                      <ul className="space-y-2">
                        {teacher.achievements!.map((a) => (
                          <li
                            key={a}
                            className="flex items-start gap-2.5 text-sm text-ink"
                          >
                            <Trophy className="mt-0.5 h-4 w-4 shrink-0 text-coral" />
                            {a}
                          </li>
                        ))}
                      </ul>
                    )}

                    {(teacher.introVideo || socialEntries.length > 0) && (
                      <div className="flex flex-wrap gap-2">
                        {teacher.introVideo && (
                          <a
                            href={teacher.introVideo}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 rounded-full bg-coral px-3.5 py-1.5 text-sm font-semibold text-white transition hover:bg-coral-dark"
                          >
                            <PlayCircle className="h-4 w-4" />
                            Watch intro video
                          </a>
                        )}
                        {socialEntries.map(([key, url]) => (
                          <a
                            key={key}
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 rounded-full border border-hairline bg-white px-3.5 py-1.5 text-sm font-medium text-ink transition hover:border-ink/30"
                          >
                            <Globe className="h-3.5 w-3.5 text-muted" />
                            {socialLabels[key] ?? key}
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                </section>
              )}

              <AvailabilitySchedule
                slots={teacher.slots}
                availability={teacher.availability}
                timezone={teacher.timezone}
                timeFormat={teacher.timeFormat}
              />
            </div>

            {/* ------------------------------ sidebar ------------------------------- */}
            <aside className="lg:sticky lg:top-24 lg:self-start">
              <TeacherConnectPanel
                teacher={teacher}
                available={available}
                className="mt-0"
              />

              <section className="mt-5 rounded-2xl border border-hairline bg-white p-5">
                <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">
                  At a glance
                </h2>
                <dl className="mt-3 divide-y divide-hairline">
                  {facts.map(({ icon: Icon, label, value }) => (
                    <div key={label} className="flex items-start gap-3 py-3">
                      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-coral" />
                      <div className="min-w-0">
                        <dt className="text-[11px] font-semibold uppercase tracking-wide text-muted">
                          {label}
                        </dt>
                        <dd className="mt-0.5 text-sm font-semibold leading-snug text-ink">
                          {value}
                        </dd>
                      </div>
                    </div>
                  ))}
                </dl>
              </section>
            </aside>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
