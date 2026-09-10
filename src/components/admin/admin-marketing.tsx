"use client";

import {
  AdminSection,
  AdminStatCard,
} from "@/components/admin/admin-ui";
import {
  fetchAdminMarketing,
  type MarketingOverview,
  type MarketingPageRow,
} from "@/lib/admin-api";
import {
  BLOG_PILLARS,
  BLOG_POSTS,
  FUNNEL_LABELS,
  getPillar,
  type BlogPillarId,
} from "@/lib/blog-posts";
import {
  blogFacultySignupUrl,
  blogParentSignupUrl,
  blogShareUrl,
  MARKETING_PAGES,
  pageShareUrl,
  withBlogUtm,
  withPageUtm,
} from "@/lib/marketing-utm";
import { SITE_URL } from "@/lib/seo";
import { cn } from "@/lib/utils";
import {
  Check,
  ChevronDown,
  Copy,
  Download,
  Loader2,
  Search,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";

type BlogRow = MarketingPageRow & {
  title: string;
  path: string;
  pillar?: BlogPillarId;
  pillarLabel?: string;
  funnel?: string;
  ctaHref?: string;
  ctaLabel?: string;
};

function emptyRow(slug: string, kind: "blog" | "page"): MarketingPageRow {
  return {
    slug,
    kind,
    views: 0,
    uniqueViews: 0,
    redirects: 0,
    uniqueRedirects: 0,
    signups: 0,
    parentSignups: 0,
    facultySignups: 0,
    recentSignups: [],
  };
}

function formatDate(iso?: string) {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function pct(part: number, whole: number) {
  if (!whole) return "—";
  return `${Math.round((part / whole) * 1000) / 10}%`;
}

function CopyField({ label, value }: { label: string; value: string }) {
  const [copied, setCopied] = useState(false);

  return (
    <div className="min-w-0">
      <p className="text-[10px] font-semibold uppercase tracking-wider text-muted">
        {label}
      </p>
      <div className="mt-1 flex items-center gap-1.5">
        <code className="min-w-0 flex-1 truncate rounded-md bg-cream px-2 py-1 text-[11px] text-ink">
          {value}
        </code>
        <button
          type="button"
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-hairline bg-white text-muted hover:text-ink"
          onClick={async () => {
            await navigator.clipboard.writeText(value);
            setCopied(true);
            window.setTimeout(() => setCopied(false), 1400);
          }}
          aria-label={`Copy ${label}`}
        >
          {copied ? <Check className="h-3.5 w-3.5 text-sage" /> : <Copy className="h-3.5 w-3.5" />}
        </button>
      </div>
    </div>
  );
}

function utmBundle(row: BlogRow) {
  if (row.kind === "blog") {
    return {
      share: blogShareUrl(row.slug),
      parent: blogParentSignupUrl(row.slug),
      faculty: blogFacultySignupUrl(row.slug),
      cta: row.ctaHref
        ? `${SITE_URL}${withBlogUtm(row.ctaHref, row.slug, "cta")}`
        : blogParentSignupUrl(row.slug),
    };
  }
  return {
    share: pageShareUrl(row.path, row.slug),
    parent: withPageUtm(`${SITE_URL}/parent/signup`, row.slug, "signup"),
    faculty: withPageUtm(`${SITE_URL}/faculty/signup`, row.slug, "signup"),
    cta: withPageUtm(`${SITE_URL}${row.path}`, row.slug, "cta"),
  };
}

export function AdminMarketing({ adminKey }: { adminKey: string }) {
  const [data, setData] = useState<MarketingOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [pillar, setPillar] = useState<"all" | BlogPillarId>("all");
  const [sort, setSort] = useState<"views" | "redirects" | "signups" | "title">("views");
  const [openSlug, setOpenSlug] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setData(await fetchAdminMarketing(adminKey));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  }, [adminKey]);

  useEffect(() => {
    void load();
  }, [load]);

  const statsByKey = useMemo(() => {
    const map = new Map<string, MarketingPageRow>();
    for (const row of data?.rows ?? []) {
      map.set(`${row.kind}:${row.slug}`, row);
    }
    return map;
  }, [data]);

  const blogRows = useMemo<BlogRow[]>(() => {
    return BLOG_POSTS.map((post) => {
      const stats = statsByKey.get(`blog:${post.slug}`) ?? emptyRow(post.slug, "blog");
      const pillarMeta = getPillar(post.pillar);
      return {
        ...stats,
        slug: post.slug,
        kind: "blog",
        title: post.title,
        path: `/blog/${post.slug}`,
        pillar: post.pillar,
        pillarLabel: pillarMeta.shortLabel,
        funnel: FUNNEL_LABELS[post.funnel],
        ctaHref: post.ctaHref,
        ctaLabel: post.cta,
      };
    });
  }, [statsByKey]);

  const pageRows = useMemo<BlogRow[]>(() => {
    const known = new Set<string>(MARKETING_PAGES.map((p) => p.slug));
    const catalog: BlogRow[] = MARKETING_PAGES.map((page) => {
      const stats = statsByKey.get(`page:${page.slug}`) ?? emptyRow(page.slug, "page");
      return {
        ...stats,
        slug: page.slug,
        kind: "page",
        title: page.title,
        path: page.path,
      };
    });

    for (const row of data?.rows ?? []) {
      if (row.kind !== "page" || known.has(row.slug)) continue;
      catalog.push({
        ...row,
        title: row.slug,
        path: `/${row.slug}`,
      });
    }
    return catalog;
  }, [data, statsByKey]);

  const filteredBlogs = useMemo(() => {
    const q = query.trim().toLowerCase();
    return blogRows
      .filter((row) => {
        if (pillar !== "all" && row.pillar !== pillar) return false;
        if (!q) return true;
        return (
          row.title.toLowerCase().includes(q) ||
          row.slug.includes(q) ||
          (row.pillarLabel ?? "").toLowerCase().includes(q)
        );
      })
      .sort((a, b) => {
        if (sort === "title") return a.title.localeCompare(b.title);
        return b[sort] - a[sort];
      });
  }, [blogRows, pillar, query, sort]);

  const blogTotals = useMemo(() => {
    return blogRows.reduce(
      (acc, row) => {
        acc.views += row.views;
        acc.uniqueViews += row.uniqueViews;
        acc.redirects += row.redirects;
        acc.signups += row.signups;
        acc.parents += row.parentSignups;
        acc.faculty += row.facultySignups;
        return acc;
      },
      { views: 0, uniqueViews: 0, redirects: 0, signups: 0, parents: 0, faculty: 0 },
    );
  }, [blogRows]);

  function downloadCsv() {
    const header = [
      "kind",
      "slug",
      "title",
      "pillar",
      "path",
      "views",
      "unique_views",
      "redirects",
      "unique_redirects",
      "signups",
      "parent_signups",
      "faculty_signups",
      "share_utm",
      "parent_signup_utm",
      "faculty_signup_utm",
      "cta_utm",
    ];
    const lines = [header.join(",")];
    for (const row of [...blogRows, ...pageRows]) {
      const utm = utmBundle(row);
      const cells = [
        row.kind,
        row.slug,
        row.title,
        row.pillarLabel ?? "",
        row.path,
        row.views,
        row.uniqueViews,
        row.redirects,
        row.uniqueRedirects,
        row.signups,
        row.parentSignups,
        row.facultySignups,
        utm.share,
        utm.parent,
        utm.faculty,
        utm.cta,
      ].map((cell) => `"${String(cell).replaceAll('"', '""')}"`);
      lines.push(cells.join(","));
    }
    const blob = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "mentr-marketing-utm.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <AdminSection
      id="marketing"
      title="Marketing strategy"
      description="Blog-wise views, CTA redirects, signups, and slug UTM links — new posts inherit this automatically"
    >
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <AdminStatCard label="Blog views" value={blogTotals.views} sub={`${blogTotals.uniqueViews} unique`} accent="coral" />
        <AdminStatCard label="Redirects from blogs" value={blogTotals.redirects} sub="CTA / marketplace clicks" />
        <AdminStatCard
          label="Signups from blogs"
          value={blogTotals.signups}
          sub={`${blogTotals.parents} parents · ${blogTotals.faculty} tutors`}
          accent="sage"
        />
        <AdminStatCard
          label="View → signup"
          value={pct(blogTotals.signups, blogTotals.views)}
          sub={`${pct(blogTotals.redirects, blogTotals.views)} clicked through`}
          accent="butter"
        />
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <label className="relative min-w-[200px] flex-1">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search title or slug"
            className="h-10 w-full rounded-lg border border-hairline bg-white pl-8 pr-3 text-xs text-ink outline-none focus:border-ink"
          />
        </label>
        <select
          value={pillar}
          onChange={(e) => setPillar(e.target.value as "all" | BlogPillarId)}
          className="h-10 rounded-lg border border-hairline bg-white px-2 text-xs text-ink"
        >
          <option value="all">All pillars</option>
          {BLOG_PILLARS.map((p) => (
            <option key={p.id} value={p.id}>
              {p.shortLabel}
            </option>
          ))}
        </select>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as typeof sort)}
          className="h-10 rounded-lg border border-hairline bg-white px-2 text-xs text-ink"
        >
          <option value="views">Sort: views</option>
          <option value="redirects">Sort: redirects</option>
          <option value="signups">Sort: signups</option>
          <option value="title">Sort: title</option>
        </select>
        <button
          type="button"
          onClick={downloadCsv}
          className="inline-flex h-10 items-center gap-1.5 rounded-lg border border-hairline bg-white px-3 text-xs font-semibold text-ink hover:bg-cream"
        >
          <Download className="h-3.5 w-3.5" />
          Export UTM CSV
        </button>
      </div>

      {loading && !data && (
        <p className="mt-4 flex items-center gap-2 border border-hairline bg-white px-3 py-6 text-xs text-muted">
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
          Loading marketing stats…
        </p>
      )}

      {error && (
        <p className="mt-4 border border-hairline bg-butter/40 px-3 py-3 text-xs text-ink">
          {error} — UTM links below still work. Stats will fill in once tracking is reachable.
        </p>
      )}

      <div className="mt-4 border border-hairline bg-white">
        <div className="border-b border-hairline px-3 py-2">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-muted">
            Blogs · {filteredBlogs.length} of {BLOG_POSTS.length}
          </p>
          <p className="mt-0.5 text-[11px] text-muted">
            Expand a row for UTM links, funnel, and who signed up from that slug
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[980px] border-collapse text-left text-xs">
            <thead>
              <tr className="border-b border-hairline bg-cream-band/60 text-[10px] font-semibold uppercase tracking-wider text-muted">
                <th className="px-3 py-2">Blog</th>
                <th className="px-3 py-2">Pillar</th>
                <th className="px-3 py-2">Views</th>
                <th className="px-3 py-2">Redirects</th>
                <th className="px-3 py-2">Signups</th>
                <th className="px-3 py-2">Conv.</th>
                <th className="px-3 py-2">UTM</th>
              </tr>
            </thead>
            <tbody>
              {filteredBlogs.map((row) => {
                const open = openSlug === row.slug;
                const utm = utmBundle(row);
                return (
                  <MarketingDetailRows
                    key={row.slug}
                    row={row}
                    open={open}
                    utm={utm}
                    onToggle={() => setOpenSlug(open ? null : row.slug)}
                  />
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-4 border border-hairline bg-white">
        <div className="border-b border-hairline px-3 py-2">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-muted">
            Landing pages · {pageRows.length}
          </p>
          <p className="mt-0.5 text-[11px] text-muted">
            Same tracking as blogs. New landing pages that mount page tracking appear here automatically.
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[820px] border-collapse text-left text-xs">
            <thead>
              <tr className="border-b border-hairline bg-cream-band/60 text-[10px] font-semibold uppercase tracking-wider text-muted">
                <th className="px-3 py-2">Page</th>
                <th className="px-3 py-2">Views</th>
                <th className="px-3 py-2">Redirects</th>
                <th className="px-3 py-2">Signups</th>
                <th className="px-3 py-2">UTM</th>
              </tr>
            </thead>
            <tbody>
              {pageRows.map((row) => {
                const key = `page:${row.slug}`;
                const open = openSlug === key;
                const utm = utmBundle(row);
                return (
                  <MarketingDetailRows
                    key={key}
                    row={row}
                    open={open}
                    utm={utm}
                    onToggle={() => setOpenSlug(open ? null : key)}
                  />
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </AdminSection>
  );
}

function MarketingDetailRows({
  row,
  open,
  utm,
  onToggle,
}: {
  row: BlogRow;
  open: boolean;
  utm: ReturnType<typeof utmBundle>;
  onToggle: () => void;
}) {
  return (
    <>
      <tr className="border-b border-hairline/70 hover:bg-cream/50">
        <td className="px-3 py-2">
          <button type="button" onClick={onToggle} className="flex max-w-[420px] items-start gap-1.5 text-left">
            <ChevronDown
              className={cn("mt-0.5 h-3.5 w-3.5 shrink-0 text-muted transition", open && "rotate-180")}
            />
            <span>
              <span className="block font-medium text-ink">{row.title}</span>
              <span className="block text-[10px] text-muted">{row.path}</span>
            </span>
          </button>
        </td>
        {row.kind === "blog" && (
          <td className="px-3 py-2 text-muted">
            {row.pillarLabel}
            {row.funnel ? <span className="block text-[10px]">{row.funnel}</span> : null}
          </td>
        )}
        <td className="px-3 py-2 tabular-nums text-ink">
          {row.views}
          <span className="block text-[10px] text-muted">{row.uniqueViews} unique</span>
        </td>
        <td className="px-3 py-2 tabular-nums text-ink">
          {row.redirects}
          <span className="block text-[10px] text-muted">{row.uniqueRedirects} unique</span>
        </td>
        <td className="px-3 py-2 tabular-nums font-medium text-ink">
          {row.signups}
          <span className="block text-[10px] text-muted">
            {row.parentSignups}P · {row.facultySignups}T
          </span>
        </td>
        {row.kind === "blog" && (
          <td className="px-3 py-2 tabular-nums text-muted">{pct(row.signups, row.views)}</td>
        )}
        <td className="px-3 py-2">
          <button
            type="button"
            onClick={async () => {
              await navigator.clipboard.writeText(utm.share);
            }}
            className="text-[11px] font-semibold text-coral hover:underline"
          >
            Copy share link
          </button>
        </td>
      </tr>
      {open && (
        <tr className="border-b border-hairline bg-cream/70">
          <td colSpan={row.kind === "blog" ? 7 : 5} className="px-4 py-4">
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-lg border border-hairline bg-white px-3 py-2">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-muted">Funnel</p>
                <p className="mt-1 text-xs text-ink">
                  {row.views} views → {row.redirects} redirects → {row.signups} signups
                </p>
                <p className="mt-1 text-[11px] text-muted">
                  Click-through {pct(row.redirects, row.views)} · signup {pct(row.signups, row.redirects || row.views)}
                </p>
                <p className="mt-1 text-[11px] text-muted">
                  Last view {formatDate(row.lastViewedAt)} · last redirect {formatDate(row.lastRedirectAt)}
                </p>
              </div>
              <div className="rounded-lg border border-hairline bg-white px-3 py-2 sm:col-span-2">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-muted">
                  Slug UTM links
                </p>
                <div className="mt-2 grid gap-2 lg:grid-cols-2">
                  <CopyField label="Share / campaign URL" value={utm.share} />
                  <CopyField label="Parent signup" value={utm.parent} />
                  <CopyField label="Tutor signup" value={utm.faculty} />
                  <CopyField label={row.ctaLabel ? `CTA · ${row.ctaLabel}` : "Primary CTA"} value={utm.cta} />
                </div>
              </div>
            </div>

            <div className="mt-3 rounded-lg border border-hairline bg-white px-3 py-2">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-muted">
                Signups from this {row.kind} · {row.signups}
              </p>
              {row.recentSignups.length === 0 ? (
                <p className="mt-2 text-[11px] text-muted">No attributed signups yet</p>
              ) : (
                <ul className="mt-2 divide-y divide-hairline">
                  {row.recentSignups.map((user) => (
                    <li key={user.id} className="flex flex-wrap items-center justify-between gap-2 py-1.5">
                      <span>
                        <span className="font-medium text-ink">{user.name}</span>
                        <span className="ml-2 text-[11px] text-muted">{user.email}</span>
                      </span>
                      <span className="text-[11px] text-muted">
                        {user.role} · {formatDate(user.createdAt)}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </td>
        </tr>
      )}
    </>
  );
}
