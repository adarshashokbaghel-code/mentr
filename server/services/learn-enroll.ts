import {
  emptyLearnProgress,
  makeReceiptNumber,
  MENTR_STARTER,
} from "../lib/learn-course";
import { User, type ILearnEnrollment, type IUser } from "../models/User";

export function serializeLearnEnrollment(enroll: ILearnEnrollment) {
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
    progress: enroll.progress ?? emptyLearnProgress(),
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
