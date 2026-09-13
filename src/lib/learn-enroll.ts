import { LEARN_APP_HREF } from "@/lib/learn-curriculum";
import {
  downloadEnrollmentReceipt,
  type EnrollmentReceiptData,
} from "@/lib/learn-enrollment-receipt";

export const LEARN_COURSE_NAME = "Mentr Starter";
export const LEARN_COURSE_TAGLINE = "Class 3–5 · Computer Science, AI & Math";
export const LEARN_TRACK_LABEL = "Class 3–5 track";
export const LEARN_COURSE_MODULES = 60;
export { LEARN_APP_HREF };
export const LEARN_ENROLL_STORAGE_KEY = "mentr_learn_enrolled_v1";

export type LearnEnrollmentDto = {
  courseId: string;
  courseName: string;
  tagline: string;
  track: string;
  status: string;
  enrolledAt: string;
  receiptNumber: string;
  expiry: string;
  purchase: {
    listPriceInr: number;
    subtotalInr: number;
    taxInr: number;
    discountInr: number;
    totalInr: number;
    currency: string;
    paymentMethod: string;
  };
  progress: {
    modulesCompleted: string[];
    currentModuleId: string | null;
    xp: number;
    streakDays: number;
    lastActivityAt: string | null;
  };
};

export type LearnEnrollResponse = {
  enrollment: LearnEnrollmentDto;
  created: boolean;
  message: string;
};

async function learnRequest<T>(
  path: string,
  options?: RequestInit,
): Promise<T> {
  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("champs_token")
      : null;
  const res = await fetch(`/api${path}`, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options?.headers || {}),
    },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(
      (data as { error?: string }).error || "Request failed",
    );
  }
  return data as T;
}

export function readLearnEnrollmentLocal(): LearnEnrollmentDto | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(LEARN_ENROLL_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as LearnEnrollmentDto;
  } catch {
    return null;
  }
}

export function saveLearnEnrollmentLocal(enrollment: LearnEnrollmentDto) {
  localStorage.setItem(LEARN_ENROLL_STORAGE_KEY, JSON.stringify(enrollment));
}

export async function fetchLearnEnrollment(): Promise<LearnEnrollmentDto | null> {
  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("champs_token")
      : null;
  if (!token) return null;
  try {
    const data = await learnRequest<{ enrollment: LearnEnrollmentDto | null }>(
      "/learn/enrollment",
    );
    if (data.enrollment) saveLearnEnrollmentLocal(data.enrollment);
    return data.enrollment;
  } catch {
    return null;
  }
}

export async function enrollInMentrStarter(): Promise<LearnEnrollResponse> {
  const data = await learnRequest<LearnEnrollResponse>("/learn/enroll", {
    method: "POST",
    body: "{}",
  });
  saveLearnEnrollmentLocal(data.enrollment);
  return data;
}

/** Redirect target when LMS is opened without auth / enrollment. */
export const LEARN_START_ENROLL_HREF = "/learn/start?enroll=1";

export function receiptDataFromEnrollment(
  enrollment: LearnEnrollmentDto,
  opts: { name: string; email: string; userId: string },
): EnrollmentReceiptData {
  return {
    receiptNumber: enrollment.receiptNumber,
    courseName: enrollment.courseName,
    courseTagline: enrollment.tagline || LEARN_COURSE_TAGLINE,
    trackLabel: LEARN_TRACK_LABEL,
    modules: LEARN_COURSE_MODULES,
    purchaserName: opts.name,
    purchaserEmail: opts.email,
    userId: opts.userId,
    purchasedAt: enrollment.enrolledAt,
    listPriceInr: enrollment.purchase.listPriceInr,
    subtotalInr: enrollment.purchase.subtotalInr,
    taxInr: enrollment.purchase.taxInr,
    discountInr: enrollment.purchase.discountInr,
    totalInr: enrollment.purchase.totalInr,
    currency: enrollment.purchase.currency,
    paymentMethod: enrollment.purchase.paymentMethod,
    expiry: enrollment.expiry,
  };
}

export function downloadReceiptForEnrollment(
  enrollment: LearnEnrollmentDto,
  opts: { name: string; email: string; userId: string },
) {
  downloadEnrollmentReceipt(receiptDataFromEnrollment(enrollment, opts));
}
