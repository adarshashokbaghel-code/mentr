import { excludeDemoUsersFilter } from "../lib/demo-users";
import {
  LEARN_TRACK_META,
  type LearnTrackId,
  MENTR_STARTER,
} from "../lib/learn-course";
import { User } from "../models/User";

function daysAgo(n: number): Date {
  return new Date(Date.now() - n * 24 * 60 * 60 * 1000);
}

function dayKey(d: Date): string {
  return d.toISOString().slice(0, 10);
}

export async function getAdminLearnTrack(track: LearnTrackId) {
  const meta = LEARN_TRACK_META[track];
  if (!meta) {
    throw Object.assign(new Error("Unknown Learn track"), { status: 400 });
  }

  if (!meta.unlocked) {
    return {
      track,
      label: meta.label,
      unlocked: false as const,
      course: null,
      totals: {
        enrolled: 0,
        newLast7Days: 0,
        newLast30Days: 0,
      },
      trend: [] as { date: string; count: number }[],
      enrollments: [] as never[],
    };
  }

  const d7 = daysAgo(7);
  const d30 = daysAgo(30);
  const trendStart = daysAgo(29);

  const filter = {
    ...excludeDemoUsersFilter,
    role: "parent" as const,
    "learn.starter.track": track,
    "learn.starter.status": "active",
  };

  const users = await User.find(filter)
    .select(
      "email parentProfile.name learn.starter createdAt lastLoginAt registrationSource acquisitionSlug",
    )
    .sort({ "learn.starter.enrolledAt": -1 })
    .limit(1000)
    .lean();

  const enrollments = users.map((u) => {
    const s = u.learn!.starter!;
    return {
      userId: String(u._id),
      email: u.email,
      name: u.parentProfile?.name?.trim() || "—",
      courseId: s.courseId,
      courseName: s.courseName,
      tagline: s.tagline,
      track: s.track,
      receiptNumber: s.receiptNumber,
      enrolledAt: s.enrolledAt.toISOString(),
      expiry: s.expiry,
      purchase: {
        listPriceInr: s.purchase.listPriceInr,
        subtotalInr: s.purchase.subtotalInr,
        taxInr: s.purchase.taxInr,
        discountInr: s.purchase.discountInr,
        totalInr: s.purchase.totalInr,
        currency: s.purchase.currency,
        paymentMethod: s.purchase.paymentMethod,
      },
      totalInr: s.purchase.totalInr,
      paymentMethod: s.purchase.paymentMethod,
      registrationSource: u.registrationSource,
      acquisitionSlug: u.acquisitionSlug,
      lastLoginAt: u.lastLoginAt?.toISOString(),
      progress: {
        modulesCompleted: s.progress?.modulesCompleted?.length ?? 0,
        xp: s.progress?.xp ?? 0,
        streakDays: s.progress?.streakDays ?? 0,
        currentModuleId: s.progress?.currentModuleId ?? null,
      },
    };
  });

  const enrolled = enrollments.length;
  const newLast7Days = enrollments.filter(
    (e) => new Date(e.enrolledAt) >= d7,
  ).length;
  const newLast30Days = enrollments.filter(
    (e) => new Date(e.enrolledAt) >= d30,
  ).length;

  const byDay = new Map<string, number>();
  for (let i = 0; i < 30; i++) {
    const d = daysAgo(29 - i);
    byDay.set(dayKey(d), 0);
  }
  for (const e of enrollments) {
    const key = dayKey(new Date(e.enrolledAt));
    if (byDay.has(key)) byDay.set(key, (byDay.get(key) || 0) + 1);
  }
  // Include enrollments older than window only for totals; trend is last 30 days
  void trendStart;

  return {
    track,
    label: meta.label,
    unlocked: true as const,
    course: {
      courseId: MENTR_STARTER.courseId,
      courseName: MENTR_STARTER.courseName,
      tagline: MENTR_STARTER.tagline,
      modules: MENTR_STARTER.modules,
      listPriceInr: MENTR_STARTER.listPriceInr,
    },
    totals: {
      enrolled,
      newLast7Days,
      newLast30Days,
    },
    trend: Array.from(byDay.entries()).map(([date, count]) => ({ date, count })),
    enrollments,
  };
}
