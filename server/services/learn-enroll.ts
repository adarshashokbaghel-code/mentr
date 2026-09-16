import {
  emptyLearnProgress,
  makeReceiptNumber,
  MENTR_STARTER,
} from "../lib/learn-course";
import { User, type ILearnEnrollment, type IUser } from "../models/User";

export function serializeLearnEnrollment(enroll: ILearnEnrollment) {
  const p = enroll.progress || emptyLearnProgress();
  return {
    courseId: enroll.courseId,
    courseName: enroll.courseName,
    tagline: enroll.tagline,
    track: enroll.track,
    status: enroll.status,
    enrolledAt: enroll.enrolledAt.toISOString(),
    receiptNumber: enroll.receiptNumber,
    expiry: enroll.expiry,
    purchase: {
      listPriceInr: enroll.purchase.listPriceInr,
      subtotalInr: enroll.purchase.subtotalInr,
      taxInr: enroll.purchase.taxInr,
      discountInr: enroll.purchase.discountInr,
      totalInr: enroll.purchase.totalInr,
      currency: enroll.purchase.currency,
      paymentMethod: enroll.purchase.paymentMethod,
    },
    progress: {
      modulesCompleted: p.modulesCompleted ?? [],
      videosWatched: p.videosWatched ?? [],
      quizzesCompleted: p.quizzesCompleted ?? [],
      buildsCompleted: p.buildsCompleted ?? [],
      buildsFirstTry: p.buildsFirstTry ?? [],
      currentModuleId: p.currentModuleId ?? "A1",
      xp: p.xp ?? 0,
      streakDays: p.streakDays ?? 0,
      lastActivityAt: p.lastActivityAt ?? null,
      lastCheckInDay: p.lastCheckInDay ?? null,
      streakBonusesClaimed: p.streakBonusesClaimed ?? [],
      weekKey: p.weekKey ?? null,
      weekStartXp: p.weekStartXp ?? 0,
      weekStartVideos: p.weekStartVideos ?? 0,
      weekStartPotdCorrect: p.weekStartPotdCorrect ?? 0,
      potdCorrect: p.potdCorrect ?? 0,
      potdAttempted: p.potdAttempted ?? 0,
      practiceCorrect: p.practiceCorrect ?? 0,
      practiceAttempted: p.practiceAttempted ?? 0,
    },
  };
}

export async function enrollParentInStarter(userId: string): Promise<{
  enrollment: ReturnType<typeof serializeLearnEnrollment>;
  created: boolean;
  user: IUser;
}> {
  const user = await User.findById(userId);
  if (!user) {
    throw Object.assign(new Error("User not found"), { status: 404 });
  }
  if (user.role !== "parent") {
    throw Object.assign(new Error("Only parent accounts can enroll in Mentr Learn"), {
      status: 403,
    });
  }

  if (user.learn?.starter) {
    return {
      enrollment: serializeLearnEnrollment(user.learn.starter),
      created: false,
      user,
    };
  }

  const now = new Date();
  const enrollment: ILearnEnrollment = {
    courseId: MENTR_STARTER.courseId,
    courseName: MENTR_STARTER.courseName,
    tagline: MENTR_STARTER.tagline,
    track: MENTR_STARTER.track,
    status: "active",
    enrolledAt: now,
    receiptNumber: makeReceiptNumber(userId, now),
    expiry: "lifetime",
    purchase: {
      listPriceInr: MENTR_STARTER.listPriceInr,
      subtotalInr: 0,
      taxInr: 0,
      discountInr: MENTR_STARTER.listPriceInr,
      totalInr: 0,
      currency: "INR",
      paymentMethod: "free",
    },
    progress: emptyLearnProgress(),
  };

  const existing =
    user.learn &&
    typeof (user.learn as { toObject?: () => Record<string, unknown> })
      .toObject === "function"
      ? (
          user.learn as { toObject: () => Record<string, unknown> }
        ).toObject()
      : { ...(user.learn || {}) };

  user.learn = {
    ...existing,
    starter: enrollment,
  } as typeof user.learn;
  user.markModified("learn");
  await user.save();

  return {
    enrollment: serializeLearnEnrollment(enrollment),
    created: true,
    user,
  };
}

export async function getParentStarterEnrollment(userId: string) {
  const user = await User.findById(userId);
  if (!user) {
    throw Object.assign(new Error("User not found"), { status: 404 });
  }
  if (user.role !== "parent") {
    throw Object.assign(new Error("Only parent accounts have Learn enrollments"), {
      status: 403,
    });
  }
  if (!user.learn?.starter) return null;
  return serializeLearnEnrollment(user.learn.starter);
}

/** Load parent user + mutate starter progress, then save once. */
export async function withStarterProgress(
  userId: string,
  mutator: (progress: ReturnType<typeof import("../lib/learn-progress-helpers").ensureProgressShape>) => void | Promise<void>,
) {
  const { ensureProgressShape } = await import("../lib/learn-progress-helpers");
  const user = await User.findById(userId);
  if (!user) {
    throw Object.assign(new Error("User not found"), { status: 404 });
  }
  if (!user.learn?.starter) {
    throw Object.assign(new Error("Enroll in Mentr Learn first"), {
      status: 403,
    });
  }
  const progress = ensureProgressShape(user.learn.starter.progress);
  await mutator(progress);
  user.learn.starter.progress = progress;
  user.markModified("learn");
  await user.save();
  return {
    user,
    enrollment: serializeLearnEnrollment(user.learn.starter),
    progress,
  };
}
