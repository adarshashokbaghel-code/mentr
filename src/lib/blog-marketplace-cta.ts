import type { BlogPost } from "@/lib/blog-posts";
import { slugify } from "@/lib/seo-hubs";
import {
  SUBJECT_CLASS_PAGES,
  classSubjectPath,
  citySubjectPath,
} from "@/lib/seo-programmatic";
import { SUBJECTS } from "@/lib/teachers";

export type MarketplaceLink = { label: string; href: string };

const CLASS_PATTERN =
  /class\s*(6|7|8|9|10|11|12)|cbse\s*class\s*(6|7|8|9|10|11|12)/i;

function detectSubject(text: string): string | undefined {
  const lower = text.toLowerCase();
  return SUBJECTS.find((s) => lower.includes(s.toLowerCase()));
}

function detectClass(text: string): string | undefined {
  const m = text.match(CLASS_PATTERN);
  if (!m) return undefined;
  return m[1] ?? m[2];
}

/** Commercial funnel links derived from article topic — feeds the marketplace. */
export function marketplaceLinksForPost(post: BlogPost): MarketplaceLink[] {
  if (post.intent === "informational" && post.funnel === "top") return [];

  const hay = `${post.slug} ${post.title} ${post.keyword}`.toLowerCase();
  const links: MarketplaceLink[] = [];
  const subject = detectSubject(hay);
  const cls = detectClass(hay);

  if (subject && cls) {
    const combo = SUBJECT_CLASS_PAGES.find(
      (p) =>
        p.subject.toLowerCase() === subject.toLowerCase() && p.level === cls,
    );
    if (combo) {
      links.push({
        label: `Find ${subject} tutors for Class ${cls}`,
        href: classSubjectPath(combo.level, combo.subject),
      });
    }
  }

  if (subject && !links.some((l) => l.href.includes("class"))) {
    links.push({
      label: `Find ${subject} tutors`,
      href: `/subjects/${slugify(subject)}-tutors-bengaluru`,
    });
  }

  if (hay.includes("cbse")) {
    links.push({ label: "CBSE tutors", href: "/boards/cbse-tutors" });
  }
  if (hay.includes("icse")) {
    links.push({ label: "ICSE tutors", href: "/boards/icse-tutors" });
  }
  if (hay.includes("igcse")) {
    links.push({ label: "IGCSE tutors", href: "/boards/igcse-tutors" });
  }

  if (hay.includes("bengaluru") || hay.includes("bangalore")) {
    if (subject) {
      links.push({
        label: `${subject} tutors in Bengaluru`,
        href: citySubjectPath("bengaluru", subject),
      });
    } else {
      links.push({ label: "Tutors in Bengaluru", href: "/tutors/bengaluru" });
    }
  }

  if (
    hay.includes("near me") ||
    hay.includes("home tutor") ||
    hay.includes("find tutor")
  ) {
    links.push({
      label: "Find tutors near you",
      href: "/find-tutors-near-me",
    });
  }

  links.push({
    label: "Post your requirement",
    href: "/parent/signup?next=/parent/dashboard",
  });

  const seen = new Set<string>();
  return links.filter((l) => {
    if (seen.has(l.href)) return false;
    seen.add(l.href);
    return true;
  });
}

export function showMarketplaceCta(post: BlogPost): boolean {
  return (
    post.intent === "commercial" ||
    post.intent === "transactional" ||
    post.funnel === "bottom" ||
    post.funnel === "mid"
  );
}
