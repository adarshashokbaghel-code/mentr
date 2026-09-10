import { excludeDemoUsersFilter } from "../lib/demo-users";
import { parseAcquisitionFromUrl } from "../lib/marketing-attribution";
import { MarketingStat } from "../models/MarketingStat";
import { User } from "../models/User";

export type MarketingSignup = {
  id: string;
  email: string;
  name: string;
  role: string;
  createdAt: string;
};

export type MarketingPageRow = {
  slug: string;
  kind: "blog" | "page";
  views: number;
  uniqueViews: number;
  redirects: number;
  uniqueRedirects: number;
  lastViewedAt?: string;
  lastRedirectAt?: string;
  signups: number;
  parentSignups: number;
  facultySignups: number;
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
  };
  rows: MarketingPageRow[];
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

export async function getAdminMarketing(): Promise<MarketingOverview> {
  const [aggregates, users] = await Promise.all([
    MarketingStat.aggregate<{
      _id: { slug: string; kind: "blog" | "page"; event: "view" | "redirect" };
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
        "email role createdAt registrationSource acquisitionSlug acquisitionKind profile.name parentProfile.name",
      )
      .sort({ createdAt: -1 })
      .lean(),
  ]);

  const rows = new Map<string, MarketingPageRow>();

  function rowKey(slug: string, kind: "blog" | "page") {
    return `${kind}:${slug}`;
  }

  function ensure(slug: string, kind: "blog" | "page"): MarketingPageRow {
    const key = rowKey(slug, kind);
    const existing = rows.get(key);
    if (existing) return existing;
    const created: MarketingPageRow = {
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
    rows.set(key, created);
    return created;
  }

  for (const item of aggregates) {
    const { slug, kind, event } = item._id;
    if (!slug || (kind !== "blog" && kind !== "page")) continue;
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

  for (const user of users) {
    const fromField =
      user.acquisitionSlug &&
      (user.acquisitionKind === "blog" || user.acquisitionKind === "page")
        ? { slug: user.acquisitionSlug as string, kind: user.acquisitionKind }
        : parseAcquisitionFromUrl(user.registrationSource);

    if (!fromField.slug || (fromField.kind !== "blog" && fromField.kind !== "page")) {
      continue;
    }

    const row = ensure(fromField.slug, fromField.kind);
    row.signups += 1;
    if (user.role === "parent") row.parentSignups += 1;
    else row.facultySignups += 1;
    if (row.recentSignups.length < 12) {
      row.recentSignups.push({
        id: String(user._id),
        email: user.email,
        name: displayName(user),
        role: user.role,
        createdAt: user.createdAt.toISOString(),
      });
    }
  }

  const list = [...rows.values()].sort((a, b) => {
    if (b.signups !== a.signups) return b.signups - a.signups;
    if (b.redirects !== a.redirects) return b.redirects - a.redirects;
    return b.views - a.views;
  });

  const totals = list.reduce(
    (acc, row) => {
      acc.views += row.views;
      acc.uniqueViews += row.uniqueViews;
      acc.redirects += row.redirects;
      acc.uniqueRedirects += row.uniqueRedirects;
      acc.signups += row.signups;
      acc.parentSignups += row.parentSignups;
      acc.facultySignups += row.facultySignups;
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
      pagesTracked: list.length,
    },
  );

  return {
    generatedAt: new Date().toISOString(),
    totals,
    rows: list,
  };
}
