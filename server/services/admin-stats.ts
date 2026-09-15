import { excludeDemoUsersFilter } from "../lib/demo-users";
import { parseAcquisitionFromUrl } from "../lib/marketing-attribution";
import { Connection } from "../models/Connection";
import { OtpSession } from "../models/OtpSession";
import { ProfileView } from "../models/ProfileView";
import { Requirement } from "../models/Requirement";
import { User } from "../models/User";

function daysAgo(n: number): Date {
  return new Date(Date.now() - n * 24 * 60 * 60 * 1000);
}

function dayKey(d: Date): string {
  return d.toISOString().slice(0, 10);
}

function sourceLabel(
  kind: string,
  slug: string,
  registrationSource?: string,
): string {
  if (kind === "blog" && slug) return `Blog · ${slug}`;
  if (kind === "social" && slug) {
    if (slug === "instagram" || slug === "linkedin") {
      return slug === "linkedin" ? "LinkedIn" : "Instagram";
    }
    return `Social · ${slug}`;
  }
  if (kind === "page" && slug) return `Page · ${slug}`;
  if (kind === "referral") return "Referral";
  if (registrationSource) {
    try {
      const host = new URL(registrationSource).hostname.replace(/^www\./, "");
      return host ? `Link · ${host}` : "Direct / unknown";
    } catch {
      return "Direct / unknown";
    }
  }
  return "Direct / unknown";
}

export type AdminStats = {
  generatedAt: string;
  users: {
    total: number;
    parents: number;
    faculty: number;
    verified: number;
    facultyLive: number;
    parentsComplete: number;
    newLast7Days: number;
    activeLast30Days: number;
  };
  registrations: {
    timeseries: {
      date: string;
      total: number;
      parents: number;
      faculty: number;
    }[];
    bySource: {
      key: string;
      label: string;
      kind: string;
      slug: string;
      total: number;
      parents: number;
      faculty: number;
    }[];
  };
  connections: {
    total: number;
    pending: number;
    accepted: number;
    declined: number;
    parentInitiated: number;
    teacherInitiated: number;
    acceptanceRate: number;
  };
  requirements: {
    total: number;
    open: number;
    closed: number;
    expired: number;
    totalInterests: number;
    avgInterestsPerPost: number;
    topSubjects: { subject: string; count: number }[];
  };
  engagement: {
    profileViews: number;
    teachersViewed: number;
    otpSessions24h: number;
  };
  supply: {
    facultyByCity: { city: string; count: number }[];
    topSubjects: { subject: string; count: number }[];
  };
};

export async function getAdminStats(): Promise<AdminStats> {
  const now = new Date();
  const d7 = daysAgo(7);
  const d30 = daysAgo(30);
  const d1 = daysAgo(1);

  const since = new Date();
  since.setUTCDate(since.getUTCDate() - 29);
  since.setUTCHours(0, 0, 0, 0);

  const [
    total,
    parents,
    faculty,
    verified,
    facultyLive,
    parentsComplete,
    newLast7Days,
    activeLast30Days,
    connTotal,
    connPending,
    connAccepted,
    connDeclined,
    connParentInit,
    connTeacherInit,
    reqTotal,
    reqOpen,
    reqClosed,
    reqExpired,
    profileViews,
    teachersViewed,
    otp24h,
    interestAgg,
    reqSubjects,
    facultyCities,
    facultySubjects,
    recentUsers,
  ] = await Promise.all([
    User.countDocuments(excludeDemoUsersFilter),
    User.countDocuments({ ...excludeDemoUsersFilter, role: "parent" }),
    User.countDocuments({ ...excludeDemoUsersFilter, role: "faculty" }),
    User.countDocuments({ ...excludeDemoUsersFilter, emailVerified: true }),
    User.countDocuments({
      ...excludeDemoUsersFilter,
      role: "faculty",
      profileCompleted: true,
      "profile.name": { $exists: true, $ne: "" },
    }),
    User.countDocuments({
      ...excludeDemoUsersFilter,
      role: "parent",
      profileCompleted: true,
    }),
    User.countDocuments({ ...excludeDemoUsersFilter, createdAt: { $gte: d7 } }),
    User.countDocuments({
      ...excludeDemoUsersFilter,
      lastLoginAt: { $gte: d30 },
    }),
    Connection.countDocuments(),
    Connection.countDocuments({ status: "pending" }),
    Connection.countDocuments({ status: "accepted" }),
    Connection.countDocuments({ status: "declined" }),
    Connection.countDocuments({ requestedBy: "parent" }),
    Connection.countDocuments({ requestedBy: "teacher" }),
    Requirement.countDocuments(),
    Requirement.countDocuments({ status: "open", expiresAt: { $gt: now } }),
    Requirement.countDocuments({ status: "closed" }),
    Requirement.countDocuments({
      status: "open",
      expiresAt: { $lte: now },
    }),
    ProfileView.aggregate<{ total: number }>([
      { $group: { _id: null, total: { $sum: "$count" } } },
    ]),
    ProfileView.countDocuments(),
    OtpSession.countDocuments({ createdAt: { $gte: d1 } }),
    Requirement.aggregate<{ total: number }>([
      { $group: { _id: null, total: { $sum: "$interestCount" } } },
    ]),
    Requirement.aggregate<{ _id: string; count: number }>([
      { $group: { _id: "$subject", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
    ]),
    User.aggregate<{ _id: string; count: number }>([
      {
        $match: {
          ...excludeDemoUsersFilter,
          role: "faculty",
          profileCompleted: true,
          "profile.city": { $exists: true, $ne: "" },
        },
      },
      { $group: { _id: "$profile.city", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 6 },
    ]),
    User.aggregate<{ _id: string; count: number }>([
      {
        $match: {
          ...excludeDemoUsersFilter,
          role: "faculty",
          "profile.subjects.0": { $exists: true },
        },
      },
      { $unwind: "$profile.subjects" },
      { $group: { _id: "$profile.subjects", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 6 },
    ]),
    User.find({
      ...excludeDemoUsersFilter,
      createdAt: { $gte: since },
    })
      .select(
        "role createdAt registrationSource acquisitionSlug acquisitionKind",
      )
      .lean(),
  ]);

  const dayMap = new Map<
    string,
    { date: string; total: number; parents: number; faculty: number }
  >();
  for (let i = 0; i < 30; i++) {
    const d = new Date(since);
    d.setUTCDate(since.getUTCDate() + i);
    const key = dayKey(d);
    dayMap.set(key, { date: key, total: 0, parents: 0, faculty: 0 });
  }

  const sourceMap = new Map<
    string,
    {
      key: string;
      label: string;
      kind: string;
      slug: string;
      total: number;
      parents: number;
      faculty: number;
    }
  >();

  for (const user of recentUsers) {
    const key = dayKey(new Date(user.createdAt));
    const day = dayMap.get(key);
    if (day) {
      day.total += 1;
      if (user.role === "parent") day.parents += 1;
      else day.faculty += 1;
    }

    const parsed =
      user.acquisitionSlug &&
      (user.acquisitionKind === "blog" ||
        user.acquisitionKind === "page" ||
        user.acquisitionKind === "social" ||
        user.acquisitionKind === "referral")
        ? {
            slug: user.acquisitionSlug as string,
            kind: user.acquisitionKind as string,
          }
        : parseAcquisitionFromUrl(user.registrationSource);

    const kind = parsed.kind || "direct";
    const slug = parsed.slug || "";
    const sourceKey = `${kind}:${slug || "none"}`;
    const existing = sourceMap.get(sourceKey) ?? {
      key: sourceKey,
      label: sourceLabel(kind, slug, user.registrationSource),
      kind,
      slug,
      total: 0,
      parents: 0,
      faculty: 0,
    };
    existing.total += 1;
    if (user.role === "parent") existing.parents += 1;
    else existing.faculty += 1;
    sourceMap.set(sourceKey, existing);
  }

  const totalInterests = interestAgg[0]?.total ?? 0;
  const decided = connAccepted + connDeclined;

  return {
    generatedAt: now.toISOString(),
    users: {
      total,
      parents,
      faculty,
      verified,
      facultyLive,
      parentsComplete,
      newLast7Days,
      activeLast30Days,
    },
    registrations: {
      timeseries: [...dayMap.values()],
      bySource: [...sourceMap.values()].sort((a, b) => b.total - a.total),
    },
    connections: {
      total: connTotal,
      pending: connPending,
      accepted: connAccepted,
      declined: connDeclined,
      parentInitiated: connParentInit,
      teacherInitiated: connTeacherInit,
      acceptanceRate:
        decided > 0 ? Math.round((connAccepted / decided) * 100) : 0,
    },
    requirements: {
      total: reqTotal,
      open: reqOpen,
      closed: reqClosed,
      expired: reqExpired,
      totalInterests,
      avgInterestsPerPost:
        reqTotal > 0 ? Math.round((totalInterests / reqTotal) * 10) / 10 : 0,
      topSubjects: reqSubjects.map((s) => ({
        subject: s._id,
        count: s.count,
      })),
    },
    engagement: {
      profileViews: profileViews[0]?.total ?? 0,
      teachersViewed,
      otpSessions24h: otp24h,
    },
    supply: {
      facultyByCity: facultyCities.map((c) => ({
        city: c._id,
        count: c.count,
      })),
      topSubjects: facultySubjects.map((s) => ({
        subject: s._id,
        count: s.count,
      })),
    },
  };
}
