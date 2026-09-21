import { TrackedLink } from "@/components/marketing/tracked-link";
import { Button } from "@/components/ui/button";
import type { BlogPost } from "@/lib/blog-posts";
import {
  marketplaceLinksForPost,
  showMarketplaceCta,
} from "@/lib/blog-marketplace-cta";
import { LEARN_PUBLIC } from "@/lib/learn-flags";

export function MarketplaceArticleCta({ post }: { post: BlogPost }) {
  const isSnapGrade =
    post.ctaHref.startsWith("/snapandgrade") ||
    post.slug.includes("snap-and-grade") ||
    post.slug.includes("cbse-marking") ||
    post.slug.includes("ncert-answers-from-a-photo") ||
    post.slug.includes("lose-marks-on-steps");

  if (isSnapGrade) {
    return (
      <aside className="mt-10 rounded-xl border-2 border-coral/30 bg-coral/5 p-5 sm:p-6">
        <p className="text-sm font-bold uppercase tracking-wide text-coral">
          Snap &amp; Grade
        </p>
        <h2 className="mt-2 text-lg font-bold text-ink sm:text-xl">
          Photograph your notebook. See CBSE step marks.
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-muted sm:text-[15px]">
          Class 9–12 Maths, Science, and Physics. 100 free credits once. Then
          from ₹1. Not ChatGPT — the marking key is already on the question.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <TrackedLink
            href={post.ctaHref || "/snapandgrade/grade"}
            slug={post.slug}
            kind="blog"
            content="snap-grade-cta"
          >
            <Button size="sm">{post.cta || "Try Snap & Grade"}</Button>
          </TrackedLink>
          <TrackedLink
            href="/snapandgrade"
            slug={post.slug}
            kind="blog"
            content="snap-grade-hub"
          >
            <Button size="sm" variant="secondary">
              What it is
            </Button>
          </TrackedLink>
          <TrackedLink
            href="/blog/what-is-snap-and-grade"
            slug={post.slug}
            kind="blog"
            content="snap-grade-guide"
          >
            <Button size="sm" variant="secondary">
              Full guide
            </Button>
          </TrackedLink>
        </div>
      </aside>
    );
  }

  if (LEARN_PUBLIC && post.pillar === "kids-learn") {
    return (
      <aside className="mt-10 rounded-xl border-2 border-sage/40 bg-sage-wash p-5 sm:p-6">
        <p className="text-sm font-bold uppercase tracking-wide text-sage">
          Mentr Learn
        </p>
        <h2 className="mt-2 text-lg font-bold text-ink sm:text-xl">
          Free Class 3–5 CS, AI &amp; Math — enroll in minutes
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-muted sm:text-[15px]">
          60-module syllabus, Build Arena, Practice & POTD, ₹999 → ₹0. Parent
          email only — then open the learning app for your child.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <TrackedLink
            href={post.ctaHref || "/learn/start"}
            slug={post.slug}
            kind="blog"
            content="learn-enroll"
          >
            <Button size="sm">{post.cta || "Enroll free"}</Button>
          </TrackedLink>
          <TrackedLink
            href="/learn/syllabus"
            slug={post.slug}
            kind="blog"
            content="learn-syllabus"
          >
            <Button size="sm" variant="secondary">
              View syllabus
            </Button>
          </TrackedLink>
          <TrackedLink
            href="/learn"
            slug={post.slug}
            kind="blog"
            content="learn-hub"
          >
            <Button size="sm" variant="secondary">
              Mentr Learn hub
            </Button>
          </TrackedLink>
        </div>
      </aside>
    );
  }

  if (!showMarketplaceCta(post)) return null;

  const links = marketplaceLinksForPost(post);
  const isInstantConnect = post.slug.includes("instant-connect");

  if (isInstantConnect) {
    const icPrimary =
      links.find((l) => l.href === "/parents") ||
      links.find((l) => l.href.includes("instant-connect"));
    const icSecondary = links
      .filter((l) => l !== icPrimary)
      .slice(0, 3);

    return (
      <aside className="mt-10 rounded-xl border-2 border-ic-blue/35 bg-ic-blue-wash p-5 sm:p-6">
        <p className="text-sm font-bold uppercase tracking-wide text-ic-blue">
          Instant Connect
        </p>
        <h2 className="mt-2 text-lg font-bold text-ink sm:text-xl">
          Match verified mentors in minutes — free for parents
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-muted sm:text-[15px]">
          Answer a few questions, optionally add notes for smarter matching,
          and let up to three verified tutors call you while your request is
          active. Close anytime from your dashboard.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {icPrimary ? (
            <TrackedLink
              href={icPrimary.href}
              slug={post.slug}
              kind="blog"
              content="instant-connect-cta"
            >
              <Button size="sm">{post.cta || icPrimary.label}</Button>
            </TrackedLink>
          ) : null}
          {icSecondary.map((link) => (
            <TrackedLink
              key={link.href}
              href={link.href}
              slug={post.slug}
              kind="blog"
              content="instant-connect-secondary"
            >
              <Button size="sm" variant="secondary">
                {link.label}
              </Button>
            </TrackedLink>
          ))}
        </div>
      </aside>
    );
  }

  const primary = links.find((l) => l.href.includes("/parent/signup"));
  const secondary = links.filter((l) => l !== primary).slice(0, 3);

  return (
    <aside className="mt-10 rounded-xl border-2 border-coral/30 bg-coral/5 p-5 sm:p-6">
      <p className="text-sm font-bold uppercase tracking-wide text-coral">
        Need a tutor?
      </p>
      <h2 className="mt-2 text-lg font-bold text-ink sm:text-xl">
        Turn this guide into action on Mentr
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-muted sm:text-[15px]">
        Can&apos;t find exactly what you need? Post your requirement and let verified
        tutors come to you — free for parents. Or browse profiles and connect
        directly.
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        {primary && (
          <TrackedLink
            href={primary.href}
            slug={post.slug}
            kind="blog"
            content="marketplace-signup"
          >
            <Button size="sm">{primary.label}</Button>
          </TrackedLink>
        )}
        {secondary.map((link) => (
          <TrackedLink
            key={link.href}
            href={link.href}
            slug={post.slug}
            kind="blog"
            content="marketplace"
          >
            <Button size="sm" variant="secondary">
              {link.label}
            </Button>
          </TrackedLink>
        ))}
      </div>
    </aside>
  );
}
