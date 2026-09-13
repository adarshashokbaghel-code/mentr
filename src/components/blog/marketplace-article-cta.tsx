import { TrackedLink } from "@/components/marketing/tracked-link";
import { Button } from "@/components/ui/button";
import type { BlogPost } from "@/lib/blog-posts";
import {
  marketplaceLinksForPost,
  showMarketplaceCta,
} from "@/lib/blog-marketplace-cta";
import { LEARN_PUBLIC } from "@/lib/learn-flags";

export function MarketplaceArticleCta({ post }: { post: BlogPost }) {
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
          60 modules, Watch → Quiz → Play, ₹999 → ₹0. Parent email only — then
          open the learning app for your child.
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
