import { TrackedLink } from "@/components/marketing/tracked-link";
import { Button } from "@/components/ui/button";
import type { BlogPost } from "@/lib/blog-posts";
import {
  marketplaceLinksForPost,
  showMarketplaceCta,
} from "@/lib/blog-marketplace-cta";

export function MarketplaceArticleCta({ post }: { post: BlogPost }) {
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
        Can't find exactly what you need? Post your requirement and let verified
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
