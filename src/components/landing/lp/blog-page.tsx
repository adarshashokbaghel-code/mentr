"use client";

import { Button } from "@/components/ui/button";
import {
  BLOG_PILLARS,
  BLOG_POSTS,
  FUNNEL_LABELS,
  INTENT_LABELS,
  postsByPillar,
  scheduledPosts,
  type BlogPillarId,
  type BlogPost,
} from "@/lib/blog-posts";
import { cn } from "@/lib/utils";
import {
  ArrowRight,
  BookOpen,
  Calendar,
  MapPin,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import {
  hardShadow,
  hardShadowSm,
  LpBadge,
  LpBlob,
  LpFinalCta,
  LpGridBg,
  LpPill,
  LpSectionDivider,
  LpStatsBand,
  SectionHeader,
} from "./shared";

const blogStats = [
  { value: String(BLOG_POSTS.length), label: "Guides planned", tint: "bg-lavender", icon: BookOpen },
  { value: "7", label: "Content pillars", tint: "bg-butter", icon: Sparkles },
  { value: "12", label: "Week launch plan", tint: "bg-sage-wash", icon: Calendar },
  { value: "₹0", label: "Always free", tint: "bg-coral-wash", icon: ShieldCheck },
];

const pillarIcons: Record<BlogPillarId | "all", React.ComponentType<{ className?: string }>> = {
  all: BookOpen,
  "for-parents": Search,
  comparison: Star,
  "exam-prep": BookOpen,
  "for-tutors": Users,
  "trust-safety": ShieldCheck,
  "career-mentoring": Sparkles,
  "local-guides": MapPin,
};

const pillarTintBg: Record<string, string> = {
  lavender: "bg-lavender",
  butter: "bg-butter",
  sage: "bg-sage-wash",
  coral: "bg-coral-wash",
};

function BlogHero() {
  return (
    <section className="relative overflow-hidden border-b border-hairline bg-butter">
      <LpGridBg className="opacity-30" />
      <LpBlob color="rgba(255,241,163,0.7)" size={320} className="-left-24 top-0" />
      <LpBlob color="rgba(255,154,77,0.15)" size={280} className="-right-20 bottom-0" />

      <div className="relative mx-auto max-w-[900px] px-4 py-10 text-center sm:px-6 sm:py-16 lg:py-24 lg:px-8">
        <LpBadge className="mx-auto">
          <BookOpen className="h-3.5 w-3.5 text-coral" />
          Guides & resources
        </LpBadge>

        <h1 className="mt-7 text-4xl font-bold leading-[1.06] tracking-tight text-ink sm:text-5xl lg:text-[56px]">
          Everything you need
          <br />
          to find or become
          <span className="mt-3 block text-[1.5rem] font-semibold leading-snug text-coral sm:text-[1.85rem]">
            a great tutor.
          </span>
        </h1>

        <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-muted sm:text-lg">
          {BLOG_POSTS.length} guides on finding tutors, comparing platforms, exam
          prep, tutor safety, and local Bengaluru listings — written for parents
          and faculty.
        </p>

        <div className="mx-auto mt-8 flex max-w-lg flex-wrap justify-center gap-2">
          <LpPill tint="butter">{BLOG_POSTS.length} articles</LpPill>
          <LpPill tint="sage">For parents & tutors</LpPill>
          <LpPill tint="lavender">Bengaluru local guides</LpPill>
        </div>

        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <Link href="/search">
            <Button size="lg" className="gap-2 shadow-[3px_3px_0_0_#1c1a17]">
              <Search className="h-4 w-4" />
              Find a teacher
            </Button>
          </Link>
          <Link href="/faculty/signup">
            <Button size="lg" variant="secondary" className="gap-2">
              <Users className="h-4 w-4" />
              List as faculty
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

function BlogPostCard({ post, index }: { post: BlogPost; index: number }) {
  const pillar = BLOG_PILLARS.find((p) => p.id === post.pillar)!;
  const bg = pillarTintBg[pillar.tint] ?? "bg-white";

  return (
    <Link
      href={`/blog/${post.slug}`}
      className={cn(
        "group relative flex h-full flex-col overflow-hidden rounded-2xl border-2 border-ink p-5 transition-all duration-200 sm:p-6",
        bg,
        hardShadowSm,
        "hover:-translate-y-1 hover:border-ink",
      )}
    >
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-[10px] font-bold uppercase tracking-wide text-coral">
          {pillar.shortLabel}
        </span>
        {post.publishWeek && (
          <span className="rounded-md border border-ink/15 bg-white/80 px-2 py-0.5 text-[10px] font-bold text-muted">
            Week {post.publishWeek}
          </span>
        )}
        {post.featured && (
          <span className="rounded-md border border-ink/15 bg-white/80 px-2 py-0.5 text-[10px] font-bold text-sage">
            Cornerstone
          </span>
        )}
      </div>

      <h3 className="mt-3 flex-1 text-base font-bold leading-snug text-ink group-hover:text-coral sm:text-lg">
        {post.title}
      </h3>

      <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted">
        {post.description}
      </p>

      <div className="mt-4 flex flex-wrap gap-2">
        <span className="rounded-full border border-ink/10 bg-white/70 px-2.5 py-0.5 text-[10px] font-bold text-ink">
          {INTENT_LABELS[post.intent]}
        </span>
        <span className="rounded-full border border-ink/10 bg-white/70 px-2.5 py-0.5 text-[10px] font-bold text-muted">
          {FUNNEL_LABELS[post.funnel]}
        </span>
      </div>

      <div className="mt-5 flex items-center justify-between border-t-2 border-ink/10 pt-4">
        <span className="text-xs font-medium text-muted">
          <span className="font-bold text-ink/60">{String(index).padStart(2, "0")}</span>
          {" · "}
          {post.keyword}
        </span>
        <ArrowRight className="h-4 w-4 shrink-0 text-muted transition-transform group-hover:translate-x-1 group-hover:text-coral" />
      </div>
    </Link>
  );
}

function PillarHubCards() {
  return (
    <section className="bg-white py-12 sm:py-20 lg:py-28">
      <div className="mx-auto max-w-[1120px] px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="7 content pillars"
          title="Browse by"
          accent="topic."
          description="Each pillar targets a different search intent — from finding a tutor to comparing platforms to local area guides."
        />
        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {BLOG_PILLARS.map((pillar) => {
            const count = postsByPillar(pillar.id).length;
            const Icon = pillarIcons[pillar.id];
            const bg = pillarTintBg[pillar.tint] ?? "bg-white";
            return (
              <Link
                key={pillar.id}
                href={`/blog/category/${pillar.id}`}
                className={cn(
                  "group flex flex-col rounded-2xl border-2 border-ink p-5 transition-all duration-200",
                  bg,
                  hardShadowSm,
                  "hover:-translate-y-1",
                )}
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl border-2 border-ink bg-white">
                    <Icon className="h-4 w-4 text-ink" />
                  </span>
                  <span className="rounded-md bg-white/80 px-2 py-0.5 text-[10px] font-bold text-muted">
                    {count} posts
                  </span>
                </div>
                <h3 className="mt-4 text-sm font-bold text-ink group-hover:text-coral">
                  {pillar.label}
                </h3>
                <p className="mt-1.5 flex-1 text-xs leading-relaxed text-muted">
                  {pillar.description}
                </p>
                <span className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-coral">
                  View all
                  <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function LaunchCalendar() {
  const scheduled = scheduledPosts();

  return (
    <section className="bg-cream-band py-12 sm:py-20 lg:py-28">
      <div className="mx-auto max-w-[900px] px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="12-week plan"
          title="Publishing"
          accent="calendar."
          description="Cornerstone and bottom-funnel content launches first — then top-of-funnel guides and local volume."
        />
        <div className="mt-12 space-y-3">
          {scheduled.map((post) => {
            const pillar = BLOG_PILLARS.find((p) => p.id === post.pillar)!;
            return (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className={cn(
                  "group flex items-start gap-4 rounded-xl border-2 border-ink/10 bg-white p-4 transition-all duration-200 sm:p-5",
                  hardShadowSm,
                  "hover:border-ink hover:-translate-y-0.5",
                )}
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border-2 border-ink bg-coral text-sm font-bold text-white shadow-[2px_2px_0_0_#1c1a17]">
                  W{post.publishWeek}
                </span>
                <div className="min-w-0 flex-1">
                  <span className="text-[10px] font-bold uppercase tracking-wide text-coral">
                    {pillar.shortLabel}
                  </span>
                  <p className="mt-0.5 font-bold text-ink group-hover:text-coral">
                    {post.title}
                  </p>
                  <p className="mt-1 text-xs text-muted">{post.cta}</p>
                </div>
                <ArrowRight className="mt-2 h-4 w-4 shrink-0 text-muted transition-transform group-hover:translate-x-1 group-hover:text-coral" />
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function BlogLanding() {
  const [pillar, setPillar] = useState<BlogPillarId | "all">("all");
  const filtered = postsByPillar(pillar);

  return (
    <main>
      <BlogHero />
      <LpStatsBand stats={blogStats} />

      <section className="py-12 sm:py-20 lg:py-28">
        <div className="mx-auto max-w-[1120px] px-4 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow={`${BLOG_POSTS.length} guides`}
            title="All articles"
            accent="& topics."
            description="Filter by content pillar or browse the full list. Every guide links to Mentr search, signup, or local tutor pages."
          />

          <div className="mt-12 flex flex-wrap justify-center gap-2">
            <button
              type="button"
              onClick={() => setPillar("all")}
              className={cn(
                "inline-flex items-center gap-2 rounded-xl border-2 px-4 py-2.5 text-sm font-bold transition-all duration-200",
                pillar === "all"
                  ? cn("border-ink bg-coral text-white -translate-y-0.5", hardShadowSm)
                  : "border-ink/15 bg-white text-ink hover:border-ink/35 hover:bg-cream",
              )}
            >
              <BookOpen className="h-4 w-4" />
              All
              <span
                className={cn(
                  "rounded-md px-1.5 py-0.5 text-[10px] font-bold",
                  pillar === "all" ? "bg-white/20 text-white" : "bg-cream text-muted",
                )}
              >
                {BLOG_POSTS.length}
              </span>
            </button>
            {BLOG_PILLARS.map((cat) => {
              const Icon = pillarIcons[cat.id];
              const count = postsByPillar(cat.id).length;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setPillar(cat.id)}
                  className={cn(
                    "inline-flex items-center gap-2 rounded-xl border-2 px-4 py-2.5 text-sm font-bold transition-all duration-200",
                    pillar === cat.id
                      ? cn("border-ink bg-coral text-white -translate-y-0.5", hardShadowSm)
                      : "border-ink/15 bg-white text-ink hover:border-ink/35 hover:bg-cream",
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {cat.shortLabel}
                  <span
                    className={cn(
                      "rounded-md px-1.5 py-0.5 text-[10px] font-bold",
                      pillar === cat.id ? "bg-white/20 text-white" : "bg-cream text-muted",
                    )}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          <p className="mt-6 text-center text-sm text-muted">
            Showing <strong className="text-ink">{filtered.length}</strong>{" "}
            {filtered.length === 1 ? "article" : "articles"}
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((post, i) => (
              <BlogPostCard key={post.slug} post={post} index={i + 1} />
            ))}
          </div>
        </div>
      </section>

      <LpSectionDivider className="bg-white" bandClass="bg-cream" />
      <PillarHubCards />
      <LaunchCalendar />

      <LpFinalCta
        eyebrow="Ready to get started?"
        title="Find a teacher or list your profile — both free."
        description="Browse verified tutors in Bengaluru and online, or create a faculty profile and pitch on parent requirements. No coins, no commission."
        primaryLabel="Find a teacher — free"
        primaryHref="/search"
        secondaryLabel="List as faculty"
        secondaryHref="/faculty/signup"
        perks={["Free forever", "Verified tutors", "Direct WhatsApp", "No commission"]}
      />
    </main>
  );
}
