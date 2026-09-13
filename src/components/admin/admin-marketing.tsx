"use client";

import { AdminPassDialog } from "@/components/admin/admin-pass-dialog";
import {
  AdminBarList,
  AdminSection,
  AdminStatCard,
  AdminTrendChart,
} from "@/components/admin/admin-ui";
import {
  createAdminMarketingLink,
  deleteAdminMarketingLink,
  fetchAdminMarketing,
  type MarketingOverview,
  type MarketingPageRow,
  type MarketingSignup,
  type MarketingTrackedLink,
} from "@/lib/admin-api";
import { BLOG_POSTS, getPillar } from "@/lib/blog-posts";
import {
  blogFacultySignupUrl,
  blogParentSignupUrl,
  blogShareUrl,
  SOCIAL_CHANNELS,
  socialLinkBundle,
  type SocialChannelId,
  withBlogUtm,
} from "@/lib/marketing-utm";
import { SITE_URL } from "@/lib/seo";
import { cn } from "@/lib/utils";
import {
  Check,
  Copy,
  Loader2,
  Plus,
  Share2,
  Trash2,
  Users,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";

type TabId = "blogs" | "socials" | "graphs";

const LINK_PATH_OPTIONS = [
  { value: "/", label: "Home" },
  { value: "/parents", label: "Parents landing" },
  { value: "/for-faculty", label: "Faculty landing" },
  { value: "/blog", label: "Blog index" },
  { value: "/search", label: "Search tutors" },
  { value: "/parent/signup", label: "Parent signup" },
  { value: "/faculty/signup", label: "Tutor signup" },
  { value: "/learn", label: "Mentr Learn" },
] as const;

function emptyRow(
  slug: string,
  kind: "blog" | "page" | "social",
): MarketingPageRow {
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
    profilesCompleted: 0,
    usersWithConnections: 0,
    totalConnections: 0,
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
          {copied ? (
            <Check className="h-3.5 w-3.5 text-sage" />
          ) : (
            <Copy className="h-3.5 w-3.5" />
          )}
        </button>
      </div>
    </div>
  );
}

function SignupList({ users }: { users: MarketingSignup[] }) {
  if (users.length === 0) {
    return (
      <p className="mt-2 text-[11px] text-muted">
        No attributed signups yet — share a UTM link and wait for registrations.
      </p>
    );
  }

  return (
    <ul className="mt-2 divide-y divide-hairline">
      {users.map((user) => (
        <li
          key={user.id}
          className="flex flex-wrap items-center justify-between gap-2 py-1.5"
        >
          <span>
            <span className="font-medium text-ink">{user.name}</span>
            <span className="ml-2 text-[11px] text-muted">{user.email}</span>
          </span>
          <span className="text-[11px] text-muted">
            {user.role}
            {user.profileCompleted ? " · profile done" : " · incomplete"}
            {user.connections > 0 ? ` · ${user.connections} conn` : ""}
            {" · "}
            {formatDate(user.createdAt)}
          </span>
        </li>
      ))}
    </ul>
  );
}

function BehaviorCards({ row }: { row: MarketingPageRow }) {
  return (
    <div className="mt-3 grid gap-2 sm:grid-cols-4">
      <div className="rounded-lg border border-hairline bg-white px-3 py-2">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-muted">
          Signups
        </p>
        <p className="mt-1 text-lg font-bold tabular-nums text-ink">
          {row.signups}
        </p>
        <p className="text-[11px] text-muted">
          {row.parentSignups} parents · {row.facultySignups} tutors
        </p>
      </div>
      <div className="rounded-lg border border-hairline bg-white px-3 py-2">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-muted">
          Profiles completed
        </p>
        <p className="mt-1 text-lg font-bold tabular-nums text-ink">
          {row.profilesCompleted}
        </p>
        <p className="text-[11px] text-muted">
          {pct(row.profilesCompleted, row.signups)} of signups
        </p>
      </div>
      <div className="rounded-lg border border-hairline bg-white px-3 py-2">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-muted">
          Active connectors
        </p>
        <p className="mt-1 text-lg font-bold tabular-nums text-ink">
          {row.usersWithConnections}
        </p>
        <p className="text-[11px] text-muted">
          {row.totalConnections} total connection rows
        </p>
      </div>
      <div className="rounded-lg border border-hairline bg-white px-3 py-2">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-muted">
          Signup → connect
        </p>
        <p className="mt-1 text-lg font-bold tabular-nums text-ink">
          {pct(row.usersWithConnections, row.signups)}
        </p>
        <p className="text-[11px] text-muted">Behaviour conversion</p>
      </div>
    </div>
  );
}

function SignupTrendChart({
  points,
}: {
  points: MarketingOverview["timeseries"];
}) {
  return (
    <div className="rounded-xl border border-hairline bg-white p-4">
      <p className="text-[10px] font-semibold uppercase tracking-wider text-muted">
        Signups · last 30 days
      </p>
      <div className="mt-4">
        <AdminTrendChart
          height={160}
          emptyLabel="No attributed signups in the last 30 days"
          points={points.map((p) => ({
            key: p.date,
            total: p.total,
            title: `${p.date}: ${p.total} (blog ${p.blog}, social ${p.social}, page ${p.page}, other ${p.other})`,
            segments: [
              { value: p.blog, className: "bg-coral" },
              { value: p.social, className: "bg-sage" },
              { value: p.page, className: "bg-butter" },
              { value: p.other, className: "bg-ink/25" },
            ],
          }))}
          legend={[
            { label: "Blog", className: "bg-coral" },
            { label: "Social", className: "bg-sage" },
            { label: "Page", className: "bg-butter" },
            { label: "Other", className: "bg-ink/25" },
          ]}
        />
      </div>
    </div>
  );
}

export function AdminMarketing({ adminKey }: { adminKey: string }) {
  const [data, setData] = useState<MarketingOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tab, setTab] = useState<TabId>("blogs");
  const [blogSlug, setBlogSlug] = useState(BLOG_POSTS[0]?.slug ?? "");
  const [socialId, setSocialId] = useState<SocialChannelId>("instagram");
  const [linkLabel, setLinkLabel] = useState("");
  const [linkPath, setLinkPath] = useState("/");
  const [linkNote, setLinkNote] = useState("");
  const [linkBusy, setLinkBusy] = useState(false);
  const [linkError, setLinkError] = useState<string | null>(null);
  const [openLinkId, setOpenLinkId] = useState<string | null>(null);
  const [passGate, setPassGate] = useState<
    | null
    | { kind: "create" }
    | { kind: "delete"; link: MarketingTrackedLink }
  >(null);
  const [passError, setPassError] = useState<string | null>(null);

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
    for (const row of data?.socials ?? []) {
      map.set(`${row.kind}:${row.slug}`, row);
    }
    return map;
  }, [data]);

  const channelLinks = useMemo(
    () => (data?.links ?? []).filter((l) => l.channel === socialId),
    [data, socialId],
  );

  const selectedPost = useMemo(
    () => BLOG_POSTS.find((p) => p.slug === blogSlug) ?? BLOG_POSTS[0],
    [blogSlug],
  );

  const selectedBlogStats = useMemo(() => {
    if (!selectedPost) return emptyRow("", "blog");
    return (
      statsByKey.get(`blog:${selectedPost.slug}`) ??
      emptyRow(selectedPost.slug, "blog")
    );
  }, [selectedPost, statsByKey]);

  const selectedSocialStats = useMemo(() => {
    return (
      statsByKey.get(`social:${socialId}`) ?? emptyRow(socialId, "social")
    );
  }, [socialId, statsByKey]);

  const socialLinks = useMemo(() => socialLinkBundle(socialId), [socialId]);

  const blogLinks = useMemo(() => {
    if (!selectedPost) {
      return { share: "", parent: "", faculty: "", cta: "" };
    }
    return {
      share: blogShareUrl(selectedPost.slug),
      parent: blogParentSignupUrl(selectedPost.slug),
      faculty: blogFacultySignupUrl(selectedPost.slug),
      cta: selectedPost.ctaHref
        ? `${SITE_URL}${withBlogUtm(selectedPost.ctaHref, selectedPost.slug, "cta")}`
        : blogParentSignupUrl(selectedPost.slug),
    };
  }, [selectedPost]);

  const topSources = useMemo(
    () =>
      (data?.sources ?? []).slice(0, 12).map((s) => ({
        label: s.label,
        value: s.signups,
      })),
    [data],
  );

  async function runCreateLink(adminPass: string) {
    setLinkBusy(true);
    setPassError(null);
    setLinkError(null);
    try {
      await createAdminMarketingLink(adminKey, {
        channel: socialId,
        label: linkLabel,
        path: linkPath,
        note: linkNote || undefined,
        adminPass,
      });
      setLinkLabel("");
      setLinkNote("");
      setLinkPath("/");
      setPassGate(null);
      await load();
    } catch (e) {
      setPassError(e instanceof Error ? e.message : "Failed to create link");
    } finally {
      setLinkBusy(false);
    }
  }

  async function runDeleteLink(
    link: MarketingTrackedLink,
    adminPass: string,
  ) {
    setLinkBusy(true);
    setPassError(null);
    setLinkError(null);
    try {
      await deleteAdminMarketingLink(adminKey, link.id, adminPass);
      if (openLinkId === link.id) setOpenLinkId(null);
      setPassGate(null);
      await load();
    } catch (e) {
      setPassError(e instanceof Error ? e.message : "Failed to delete link");
    } finally {
      setLinkBusy(false);
    }
  }

  function handleCreateLink() {
    if (!linkLabel.trim()) {
      setLinkError("Label is required");
      return;
    }
    setPassError(null);
    setPassGate({ kind: "create" });
  }

  function handleDeleteLink(link: MarketingTrackedLink) {
    setPassError(null);
    setPassGate({ kind: "delete", link });
  }

  const tabs: { id: TabId; label: string }[] = [
    { id: "blogs", label: "Blogs" },
    { id: "socials", label: "Socials" },
    { id: "graphs", label: "Graphs" },
  ];

  return (
    <AdminSection
      id="marketing"
      title="Marketing · UTM tracking"
      description="Copy UTM links for blogs and socials. Metrics focus on signups and post-signup behaviour — not vanity clicks."
    >
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <AdminStatCard
          label="Attributed signups"
          value={data?.totals.signups ?? 0}
          sub={`${data?.totals.parentSignups ?? 0} parents · ${data?.totals.facultySignups ?? 0} tutors`}
          accent="sage"
        />
        <AdminStatCard
          label="Profiles completed"
          value={data?.totals.profilesCompleted ?? 0}
          sub={pct(
            data?.totals.profilesCompleted ?? 0,
            data?.totals.signups ?? 0,
          )}
          accent="coral"
        />
        <AdminStatCard
          label="Users with connections"
          value={data?.totals.usersWithConnections ?? 0}
          sub="Sent or received a connect/pitch"
          accent="butter"
        />
        <AdminStatCard
          label="Sources tracked"
          value={data?.sources.length ?? 0}
          sub={`${data?.socials?.reduce((n, s) => n + s.signups, 0) ?? 0} from social`}
        />
      </div>

      <div className="mt-4 flex flex-wrap gap-1 rounded-lg border border-hairline bg-white p-1">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={cn(
              "rounded-md px-3 py-2 text-xs font-semibold transition",
              tab === t.id
                ? "bg-ink text-white"
                : "text-muted hover:bg-cream hover:text-ink",
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {loading && !data && (
        <p className="mt-4 flex items-center gap-2 border border-hairline bg-white px-3 py-6 text-xs text-muted">
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
          Loading marketing stats…
        </p>
      )}

      {error && (
        <p className="mt-4 border border-hairline bg-butter/40 px-3 py-3 text-xs text-ink">
          {error} — UTM links below still work. Stats fill in once the API is
          reachable.
        </p>
      )}

      {tab === "blogs" && selectedPost && (
        <div className="mt-4 space-y-4">
          <label className="block">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-muted">
              Select blog
            </span>
            <select
              value={selectedPost.slug}
              onChange={(e) => setBlogSlug(e.target.value)}
              className="mt-1 h-11 w-full rounded-lg border border-hairline bg-white px-3 text-sm text-ink outline-none focus:border-ink"
            >
              {BLOG_POSTS.map((post) => (
                <option key={post.slug} value={post.slug}>
                  {post.title}
                </option>
              ))}
            </select>
          </label>

          <div className="rounded-xl border border-hairline bg-white p-4">
            <p className="text-sm font-bold text-ink">{selectedPost.title}</p>
            <p className="mt-0.5 text-[11px] text-muted">
              /blog/{selectedPost.slug} · {getPillar(selectedPost.pillar).shortLabel}
            </p>

            <BehaviorCards row={selectedBlogStats} />

            <div className="mt-4">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-muted">
                UTM links for this blog
              </p>
              <div className="mt-2 grid gap-2 lg:grid-cols-2">
                <CopyField label="Share / campaign URL" value={blogLinks.share} />
                <CopyField label="Parent signup" value={blogLinks.parent} />
                <CopyField label="Tutor signup" value={blogLinks.faculty} />
                <CopyField
                  label={
                    selectedPost.cta
                      ? `CTA · ${selectedPost.cta}`
                      : "Primary CTA"
                  }
                  value={blogLinks.cta}
                />
              </div>
            </div>

            <div className="mt-4 rounded-lg border border-hairline bg-cream/60 px-3 py-2">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-muted">
                Signups from this blog · {selectedBlogStats.signups}
              </p>
              <SignupList users={selectedBlogStats.recentSignups} />
            </div>
          </div>
        </div>
      )}

      {tab === "socials" && (
        <div className="mt-4 space-y-4">
          <div className="flex flex-wrap gap-2">
            {SOCIAL_CHANNELS.map((channel) => {
              const active = socialId === channel.id;
              return (
                <button
                  key={channel.id}
                  type="button"
                  onClick={() => setSocialId(channel.id)}
                  className={cn(
                    "inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-xs font-semibold transition",
                    active
                      ? "border-ink bg-ink text-white"
                      : "border-hairline bg-white text-ink hover:bg-cream",
                  )}
                >
                  <Share2 className="h-3.5 w-3.5" />
                  {channel.label}
                </button>
              );
            })}
          </div>

          <div className="rounded-xl border border-hairline bg-white p-4">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-cream">
                <Share2 className="h-5 w-5 text-ink" />
              </div>
              <div>
                <p className="text-sm font-bold text-ink">
                  {SOCIAL_CHANNELS.find((c) => c.id === socialId)?.label}
                </p>
                <p className="mt-0.5 text-[11px] text-muted">
                  {
                    SOCIAL_CHANNELS.find((c) => c.id === socialId)
                      ?.description
                  }
                </p>
              </div>
            </div>

            <BehaviorCards row={selectedSocialStats} />

            <div className="mt-4">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-muted">
                Channel defaults · {socialId === "instagram" ? "Instagram" : "LinkedIn"}
              </p>
              <p className="mt-1 text-[11px] text-muted">
                Generic bio / page links. For a specific post or reel, create a
                tracked link below.
              </p>
              <div className="mt-2 grid gap-2 lg:grid-cols-2">
                <CopyField label="Home / bio link" value={socialLinks.home} />
                <CopyField label="Parents landing" value={socialLinks.parents} />
                <CopyField label="Faculty landing" value={socialLinks.faculty} />
                <CopyField label="Blog index" value={socialLinks.blog} />
                <CopyField
                  label="Parent signup"
                  value={socialLinks.parentSignup}
                />
                <CopyField
                  label="Tutor signup"
                  value={socialLinks.facultySignup}
                />
              </div>
            </div>

            <div className="mt-5 rounded-xl border border-hairline bg-cream/50 p-4">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-muted">
                Create tracked post link
              </p>
              <p className="mt-1 text-[11px] text-muted">
                One link per post / story / reel. Signups and behaviour attribute
                to that exact link.
              </p>
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                <label className="block sm:col-span-2">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-muted">
                    Post name
                  </span>
                  <input
                    value={linkLabel}
                    onChange={(e) => setLinkLabel(e.target.value)}
                    placeholder="e.g. Hiring reel Mar 12"
                    className="mt-1 h-10 w-full rounded-lg border border-hairline bg-white px-3 text-sm text-ink outline-none focus:border-ink"
                  />
                </label>
                <label className="block">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-muted">
                    Lands on
                  </span>
                  <select
                    value={linkPath}
                    onChange={(e) => setLinkPath(e.target.value)}
                    className="mt-1 h-10 w-full rounded-lg border border-hairline bg-white px-2 text-sm text-ink"
                  >
                    {LINK_PATH_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label} ({opt.value})
                      </option>
                    ))}
                  </select>
                </label>
                <label className="block">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-muted">
                    Note (optional)
                  </span>
                  <input
                    value={linkNote}
                    onChange={(e) => setLinkNote(e.target.value)}
                    placeholder="Internal note"
                    className="mt-1 h-10 w-full rounded-lg border border-hairline bg-white px-3 text-sm text-ink outline-none focus:border-ink"
                  />
                </label>
              </div>
              {linkError && (
                <p className="mt-2 text-[11px] text-coral">{linkError}</p>
              )}
              <button
                type="button"
                disabled={linkBusy || linkLabel.trim().length < 2}
                onClick={() => void handleCreateLink()}
                className="mt-3 inline-flex h-10 items-center gap-1.5 rounded-lg bg-ink px-3 text-xs font-semibold text-white disabled:opacity-50"
              >
                {linkBusy ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Plus className="h-3.5 w-3.5" />
                )}
                Create & store link
              </button>
            </div>

            <div className="mt-4">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-muted">
                Stored {socialId} links · {channelLinks.length}
              </p>
              {channelLinks.length === 0 ? (
                <p className="mt-2 text-[11px] text-muted">
                  No post links yet. Create one for each Instagram/LinkedIn post
                  you want to measure.
                </p>
              ) : (
                <ul className="mt-2 space-y-2">
                  {channelLinks.map((link) => {
                    const open = openLinkId === link.id;
                    return (
                      <li
                        key={link.id}
                        className="rounded-lg border border-hairline bg-white"
                      >
                        <div className="flex flex-wrap items-start justify-between gap-2 px-3 py-2.5">
                          <button
                            type="button"
                            className="min-w-0 flex-1 text-left"
                            onClick={() =>
                              setOpenLinkId(open ? null : link.id)
                            }
                          >
                            <span className="block text-xs font-semibold text-ink">
                              {link.label}
                            </span>
                            <span className="mt-0.5 block text-[11px] text-muted">
                              {link.path} · {link.signups} signups ·{" "}
                              {link.profilesCompleted} profiles ·{" "}
                              {link.usersWithConnections} connected
                            </span>
                          </button>
                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              className="inline-flex h-8 items-center gap-1 rounded-md border border-hairline px-2 text-[11px] font-semibold text-coral hover:bg-cream"
                              onClick={async () => {
                                await navigator.clipboard.writeText(link.url);
                              }}
                            >
                              <Copy className="h-3 w-3" />
                              Copy
                            </button>
                            <button
                              type="button"
                              className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-hairline text-muted hover:text-coral"
                              onClick={() => void handleDeleteLink(link)}
                              aria-label={`Delete ${link.label}`}
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>
                        {open && (
                          <div className="border-t border-hairline bg-cream/40 px-3 py-3">
                            <CopyField label="Tracked URL" value={link.url} />
                            {link.note ? (
                              <p className="mt-2 text-[11px] text-muted">
                                Note: {link.note}
                              </p>
                            ) : null}
                            <p className="mt-2 text-[10px] text-muted">
                              Campaign · {link.slug} · created{" "}
                              {formatDate(link.createdAt)}
                            </p>
                            <BehaviorCards
                              row={{
                                ...emptyRow(link.slug, "social"),
                                signups: link.signups,
                                parentSignups: link.parentSignups,
                                facultySignups: link.facultySignups,
                                profilesCompleted: link.profilesCompleted,
                                usersWithConnections: link.usersWithConnections,
                                totalConnections: link.totalConnections,
                                recentSignups: link.recentSignups,
                              }}
                            />
                            <div className="mt-3 rounded-lg border border-hairline bg-white px-3 py-2">
                              <p className="text-[10px] font-semibold uppercase tracking-wider text-muted">
                                Signups from this post · {link.signups}
                              </p>
                              <SignupList users={link.recentSignups} />
                            </div>
                          </div>
                        )}
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>

            <div className="mt-4 rounded-lg border border-hairline bg-cream/60 px-3 py-2">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-muted">
                All {socialId} signups (channel + posts) ·{" "}
                {selectedSocialStats.signups}
              </p>
              <SignupList users={selectedSocialStats.recentSignups} />
            </div>
          </div>
        </div>
      )}

      {tab === "graphs" && (
        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          <div className="lg:col-span-2">
            <SignupTrendChart points={data?.timeseries ?? []} />
          </div>

          <div className="rounded-xl border border-hairline bg-white p-4">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-muted">
              Traffic by source · signups
            </p>
            <div className="mt-3">
              <AdminBarList items={topSources} emptyLabel="No attributed signups yet" />
            </div>
          </div>

          <div className="rounded-xl border border-hairline bg-white p-4">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-muted">
              Behaviour by source
            </p>
            <ul className="mt-3 space-y-2">
              {(data?.sources ?? []).slice(0, 10).map((s) => (
                <li
                  key={s.key}
                  className="rounded-lg border border-hairline bg-cream/50 px-3 py-2"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="truncate text-xs font-medium text-ink">
                      {s.label}
                    </span>
                    <span className="shrink-0 text-[11px] tabular-nums text-muted">
                      {s.signups} signups
                    </span>
                  </div>
                  <p className="mt-1 flex flex-wrap items-center gap-2 text-[11px] text-muted">
                    <span>
                      {s.parents}P · {s.faculty}T
                    </span>
                    <span>·</span>
                    <span>{s.profilesCompleted} profiles done</span>
                    <span>·</span>
                    <span className="inline-flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      {s.withConnections} connected
                    </span>
                  </p>
                </li>
              ))}
              {(data?.sources?.length ?? 0) === 0 && (
                <p className="text-xs text-muted">No source behaviour yet</p>
              )}
            </ul>
          </div>
        </div>
      )}

      <AdminPassDialog
        open={!!passGate}
        title={
          passGate?.kind === "delete"
            ? "Delete tracked link?"
            : "Create tracked link?"
        }
        description={
          passGate?.kind === "delete"
            ? `Delete “${passGate.link.label}”. Enter ADMIN_PASS to confirm.`
            : `Create a tracked ${socialId} link. Enter ADMIN_PASS to confirm.`
        }
        confirmLabel={passGate?.kind === "delete" ? "Delete link" : "Create link"}
        busy={linkBusy}
        error={passError}
        onConfirm={(pass) => {
          if (passGate?.kind === "delete") {
            void runDeleteLink(passGate.link, pass);
          } else {
            void runCreateLink(pass);
          }
        }}
        onClose={() => {
          if (!linkBusy) {
            setPassGate(null);
            setPassError(null);
          }
        }}
      />
    </AdminSection>
  );
}
