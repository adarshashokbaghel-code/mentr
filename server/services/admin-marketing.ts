import { excludeDemoUsersFilter } from "../lib/demo-users";
import { parseAcquisitionFromUrl } from "../lib/marketing-attribution";
import { Connection } from "../models/Connection";
import { MarketingStat } from "../models/MarketingStat";
import { User } from "../models/User";
import {
  listMarketingLinks,
  type MarketingLinkDto,
} from "./marketing-links";

export type MarketingSignup = {
  id: string;
  email: string;
  name: string;
  role: string;
  createdAt: string;
  profileCompleted: boolean;
  connections: number;
  lastLoginAt?: string;
};

export type MarketingPageRow = {
  slug: string;
  kind: "blog" | "page" | "social";
  views: number;
  uniqueViews: number;
  redirects: number;
  uniqueRedirects: number;
  lastViewedAt?: string;
  lastRedirectAt?: string;
  signups: number;
  parentSignups: number;
  facultySignups: number;
  profilesCompleted: number;
  usersWithConnections: number;
  totalConnections: number;
  recentSignups: MarketingSignup[];
};

export type MarketingDayPoint = {
  date: string;
  blog: number;
  social: number;
  page: number;
  other: number;
  total: number;
};

export type MarketingSourceSlice = {
  key: string;
  label: string;
  kind: "blog" | "page" | "social" | "other";
  signups: number;
  parents: number;
  faculty: number;
  profilesCompleted: number;
  withConnections: number;
};

export type MarketingTrackedLink = MarketingLinkDto & {
  signups: number;
  parentSignups: number;
  facultySignups: number;
  profilesCompleted: number;
  usersWithConnections: number;
  totalConnections: number;
  recentSignups: MarketingSignup[];
};

export type MarketingOverview = {
  generatedAt: string;
  totals: {
    views: number;
    uniqueViews: number;
    redirects: number;
    uniqueRedirects: number;
    signups: number;
    parentSignups: number;
    facultySignups: number;
    pagesTracked: number;
    profilesCompleted: number;
    usersWithConnections: number;
  };
  rows: MarketingPageRow[];
  socials: MarketingPageRow[];
  links: MarketingTrackedLink[];
  timeseries: MarketingDayPoint[];
  sources: MarketingSourceSlice[];
};

function displayName(u: {
  role: string;
  profile?: { name?: string };
  parentProfile?: { name?: string };
  email: string;
}): string {
  if (u.role === "faculty") return u.profile?.name || u.email;
  return u.parentProfile?.name || u.email;
}

function dayKey(d: Date): string {
  return d.toISOString().slice(0, 10);
}

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

function emptyTracked(link: MarketingLinkDto): MarketingTrackedLink {
  return {
    ...link,
    signups: 0,
    parentSignups: 0,
    facultySignups: 0,
    profilesCompleted: 0,
    usersWithConnections: 0,
    totalConnections: 0,
    recentSignups: [],
  };
}

export async function getAdminMarketing(): Promise<MarketingOverview> {
  const since = new Date();
  since.setUTCDate(since.getUTCDate() - 29);
  since.setUTCHours(0, 0, 0, 0);

  const [aggregates, users, storedLinks] = await Promise.all([
    MarketingStat.aggregate<{
      _id: {
        slug: string;
        kind: "blog" | "page" | "social";
        event: "view" | "redirect";
      };
      total: number;
      unique: number;
      lastAt: Date;
    }>([
      {
        $group: {
          _id: { slug: "$slug", kind: "$kind", event: "$event" },
          total: { $sum: "$count" },
          unique: { $sum: 1 },
          lastAt: { $max: "$lastAt" },
        },
      },
    ]),
    User.find({
      ...excludeDemoUsersFilter,
      $or: [
        { acquisitionSlug: { $exists: true, $nin: [null, ""] } },
        { registrationSource: { $exists: true, $nin: [null, ""] } },
      ],
    })
      .select(
        "email role createdAt registrationSource acquisitionSlug acquisitionKind profileCompleted profile.name parentProfile.name lastLoginAt",
      )
      .sort({ createdAt: -1 })
      .lean(),
    listMarketingLinks(),
  ]);

  const linkBySlug = new Map(storedLinks.map((l) => [l.slug, l]));
  const trackedLinks = new Map<string, MarketingTrackedLink>(
    storedLinks.map((l) => [l.slug, emptyTracked(l)]),
  );

  const userIds = users.map((u) => u._id);
  const connectionCounts = new Map<string, number>();
  if (userIds.length > 0) {
    const [asParent, asTeacher] = await Promise.all([
      Connection.aggregate<{ _id: unknown; total: number }>([
        { $match: { parent: { $in: userIds } } },
        { $group: { _id: "$parent", total: { $sum: 1 } } },
      ]),
      Connection.aggregate<{ _id: unknown; total: number }>([
        { $match: { teacher: { $in: userIds } } },
        { $group: { _id: "$teacher", total: { $sum: 1 } } },
      ]),
    ]);
    for (const row of asParent) {
      connectionCounts.set(String(row._id), row.total);
    }
    for (const row of asTeacher) {
      connectionCounts.set(
        String(row._id),
        (connectionCounts.get(String(row._id)) ?? 0) + row.total,
      );
    }
  }

  const rows = new Map<string, MarketingPageRow>();

  function rowKey(slug: string, kind: "blog" | "page" | "social") {
    return `${kind}:${slug}`;
  }

  function ensure(
    slug: string,
    kind: "blog" | "page" | "social",
  ): MarketingPageRow {
    const key = rowKey(slug, kind);
    const existing = rows.get(key);
    if (existing) return existing;
    const created = emptyRow(slug, kind);
    rows.set(key, created);
    return created;
  }

  for (const channel of ["instagram", "linkedin"] as const) {
    ensure(channel, "social");
  }

  for (const item of aggregates) {
    const { slug, kind, event } = item._id;
    if (!slug || (kind !== "blog" && kind !== "page" && kind !== "social")) {
      continue;
    }
    const row = ensure(slug, kind);
    if (event === "view") {
      row.views = item.total;
      row.uniqueViews = item.unique;
      row.lastViewedAt = item.lastAt?.toISOString();
    } else {
      row.redirects = item.total;
      row.uniqueRedirects = item.unique;
      row.lastRedirectAt = item.lastAt?.toISOString();
    }
  }

  const dayMap = new Map<string, MarketingDayPoint>();
  for (let i = 0; i < 30; i++) {
    const d = new Date(since);
    d.setUTCDate(since.getUTCDate() + i);
    const key = dayKey(d);
    dayMap.set(key, {
      date: key,
      blog: 0,
      social: 0,
      page: 0,
      other: 0,
      total: 0,
    });
  }

  const sourceMap = new Map<string, MarketingSourceSlice>();

  function bumpSource(
    key: string,
    label: string,
    kind: MarketingSourceSlice["kind"],
    user: (typeof users)[number],
    connections: number,
  ) {
    const existing = sourceMap.get(key) ?? {
      key,
      label,
      kind,
      signups: 0,
      parents: 0,
      faculty: 0,
      profilesCompleted: 0,
      withConnections: 0,
    };
    existing.signups += 1;
    if (user.role === "parent") existing.parents += 1;
    else existing.faculty += 1;
    if (user.profileCompleted) existing.profilesCompleted += 1;
    if (connections > 0) existing.withConnections += 1;
    sourceMap.set(key, existing);
  }

  function applySignup(
    target: {
      signups: number;
      parentSignups: number;
      facultySignups: number;
      profilesCompleted: number;
      usersWithConnections: number;
      totalConnections: number;
      recentSignups: MarketingSignup[];
    },
    user: (typeof users)[number],
    connections: number,
  ) {
    target.signups += 1;
    if (user.role === "parent") target.parentSignups += 1;
    else target.facultySignups += 1;
    if (user.profileCompleted) target.profilesCompleted += 1;
    if (connections > 0) target.usersWithConnections += 1;
    target.totalConnections += connections;
    if (target.recentSignups.length < 20) {
      target.recentSignups.push({
        id: String(user._id),
        email: user.email,
        name: displayName(user),
        role: user.role,
        createdAt: user.createdAt.toISOString(),
        profileCompleted: Boolean(user.profileCompleted),
        connections,
        lastLoginAt: user.lastLoginAt?.toISOString(),
      });
    }
  }

  for (const user of users) {
    const fromField =
      user.acquisitionSlug &&
      (user.acquisitionKind === "blog" ||
        user.acquisitionKind === "page" ||
        user.acquisitionKind === "social")
        ? {
            slug: user.acquisitionSlug as string,
            kind: user.acquisitionKind as "blog" | "page" | "social",
          }
        : parseAcquisitionFromUrl(user.registrationSource);

    const connections = connectionCounts.get(String(user._id)) ?? 0;
    const createdKey = dayKey(new Date(user.createdAt));
    const day = dayMap.get(createdKey);

    if (
      fromField.slug &&
      (fromField.kind === "blog" ||
        fromField.kind === "page" ||
        fromField.kind === "social")
    ) {
      const row = ensure(fromField.slug, fromField.kind);
      applySignup(row, user, connections);

      const stored = linkBySlug.get(fromField.slug);
      if (fromField.kind === "social" && stored) {
        const linkStats = trackedLinks.get(fromField.slug);
        if (linkStats) applySignup(linkStats, user, connections);
        if (fromField.slug !== stored.channel) {
          applySignup(ensure(stored.channel, "social"), user, connections);
        }
      }

      if (day) {
        day[fromField.kind] += 1;
        day.total += 1;
      }

      const label =
        fromField.kind === "social"
          ? stored
            ? `${stored.channel === "linkedin" ? "LinkedIn" : "Instagram"} · ${stored.label}`
            : fromField.slug === "linkedin"
              ? "LinkedIn"
              : fromField.slug === "instagram"
                ? "Instagram"
                : `Social · ${fromField.slug}`
          : fromField.kind === "blog"
            ? `Blog · ${fromField.slug}`
            : `Page · ${fromField.slug}`;
      bumpSource(
        `${fromField.kind}:${fromField.slug}`,
        label,
        fromField.kind,
        user,
        connections,
      );
    } else {
      if (day) {
        day.other += 1;
        day.total += 1;
      }
      bumpSource("other", "Other / direct", "other", user, connections);
    }
  }

  const list = [...rows.values()]
    .filter((r) => r.kind !== "social")
    .sort((a, b) => {
      if (b.signups !== a.signups) return b.signups - a.signups;
      if (b.redirects !== a.redirects) return b.redirects - a.redirects;
      return b.views - a.views;
    });

  const socials = ["instagram", "linkedin"].map(
    (slug) => rows.get(rowKey(slug, "social")) ?? emptyRow(slug, "social"),
  );

  const allForTotals = [...list, ...socials];
  const totals = allForTotals.reduce(
    (acc, row) => {
      acc.views += row.views;
      acc.uniqueViews += row.uniqueViews;
      acc.redirects += row.redirects;
      acc.uniqueRedirects += row.uniqueRedirects;
      acc.signups += row.signups;
      acc.parentSignups += row.parentSignups;
      acc.facultySignups += row.facultySignups;
      acc.profilesCompleted += row.profilesCompleted;
      acc.usersWithConnections += row.usersWithConnections;
      return acc;
    },
    {
      views: 0,
      uniqueViews: 0,
      redirects: 0,
      uniqueRedirects: 0,
      signups: 0,
      parentSignups: 0,
      facultySignups: 0,
      pagesTracked: list.length + socials.length + storedLinks.length,
      profilesCompleted: 0,
      usersWithConnections: 0,
    },
  );

  const sources = [...sourceMap.values()].sort(
    (a, b) => b.signups - a.signups,
  );

  const links = [...trackedLinks.values()].sort(
    (a, b) =>
      b.signups - a.signups ||
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );

  return {
    generatedAt: new Date().toISOString(),
    totals,
    rows: list,
    socials,
    links,
    timeseries: [...dayMap.values()],
    sources,
  };
}
