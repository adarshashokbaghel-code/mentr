import { excludeDemoUsersFilter } from "../lib/demo-users";
import {
  LEARN_TRACK_META,
  type LearnTrackId,
  MENTR_STARTER,
} from "../lib/learn-course";
import { LearnPotdAttempt } from "../models/LearnPotdAttempt";
import { LearnPracticeAttempt } from "../models/LearnPracticeAttempt";
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

  const filter = {
    ...excludeDemoUsersFilter,
    role: "parent" as const,
    "learn.starter.track": track,
    "learn.starter.status": "active",
  };

  const users = await User.find(filter)
    .select(
      "email parentProfile.name parentProfile.phoneNumber parentProfile.city learn.starter createdAt lastLoginAt registrationSource acquisitionSlug",
    )
    .sort({ "learn.starter.enrolledAt": -1 })
    .limit(1000)
    .lean();

  const enrollments = users.map((u) => {
    const s = u.learn!.starter!;
    const p = s.progress;
    return {
      userId: String(u._id),
      email: u.email,
      name: u.parentProfile?.name?.trim() || "—",
      phone: u.parentProfile?.phoneNumber || "",
      city: u.parentProfile?.city || "",
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
        modulesCompleted: p?.modulesCompleted?.length ?? 0,
        videosWatched: p?.videosWatched?.length ?? 0,
        quizzesCompleted: p?.quizzesCompleted?.length ?? 0,
        buildsCompleted: p?.buildsCompleted?.length ?? 0,
        potdCorrect: p?.potdCorrect ?? 0,
        potdAttempted: p?.potdAttempted ?? 0,
        practiceCorrect: p?.practiceCorrect ?? 0,
        practiceAttempted: p?.practiceAttempted ?? 0,
        xp: p?.xp ?? 0,
        streakDays: p?.streakDays ?? 0,
        currentModuleId: p?.currentModuleId ?? null,
        lastActivityAt: p?.lastActivityAt ?? null,
        lastCheckInDay: p?.lastCheckInDay ?? null,
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

/** Full enrollment + progress detail for one parent. */
export async function getAdminLearnEnrollmentDetail(
  track: LearnTrackId,
  userId: string,
) {
  const meta = LEARN_TRACK_META[track];
  if (!meta?.unlocked) {
    throw Object.assign(new Error("Track not available"), { status: 404 });
  }

  const user = await User.findOne({
    ...excludeDemoUsersFilter,
    _id: userId,
    role: "parent",
    "learn.starter.track": track,
    "learn.starter.status": "active",
  })
    .select(
      "email parentProfile learn.starter lastLoginAt registrationSource acquisitionSlug createdAt",
    )
    .lean();

  if (!user?.learn?.starter) {
    throw Object.assign(new Error("Enrollment not found"), { status: 404 });
  }

  const s = user.learn.starter;
  const p = s.progress;

  const [potdRows, practiceCount] = await Promise.all([
    LearnPotdAttempt.find({ user: userId })
      .select("dateKey correct potdId attemptedAt")
      .sort({ dateKey: -1 })
      .limit(60)
      .lean(),
    LearnPracticeAttempt.countDocuments({ user: userId }),
  ]);

  return {
    userId: String(user._id),
    email: user.email,
    name: user.parentProfile?.name?.trim() || "—",
    phone: user.parentProfile?.phoneNumber || "",
    city: user.parentProfile?.city || "",
    country: user.parentProfile?.country || "",
    lastLoginAt: user.lastLoginAt?.toISOString() ?? null,
    registrationSource: user.registrationSource,
    acquisitionSlug: user.acquisitionSlug,
    enrolledAt: s.enrolledAt.toISOString(),
    receiptNumber: s.receiptNumber,
    courseName: s.courseName,
    purchase: s.purchase,
    progress: {
      xp: p?.xp ?? 0,
      streakDays: p?.streakDays ?? 0,
      currentModuleId: p?.currentModuleId ?? null,
      lastActivityAt: p?.lastActivityAt ?? null,
      lastCheckInDay: p?.lastCheckInDay ?? null,
      modulesCompleted: p?.modulesCompleted ?? [],
      videosWatched: p?.videosWatched ?? [],
      quizzesCompleted: p?.quizzesCompleted ?? [],
      buildsCompleted: p?.buildsCompleted ?? [],
      buildsFirstTry: p?.buildsFirstTry ?? [],
      potdCorrect: p?.potdCorrect ?? 0,
      potdAttempted: p?.potdAttempted ?? 0,
      practiceCorrect: p?.practiceCorrect ?? 0,
      practiceAttempted: p?.practiceAttempted ?? practiceCount,
      streakBonusesClaimed: p?.streakBonusesClaimed ?? [],
    },
    recentPotd: potdRows.map((r) => ({
      dateKey: r.dateKey,
      correct: r.correct,
      potdId: r.potdId,
      attemptedAt: r.attemptedAt.toISOString(),
    })),
  };
}
