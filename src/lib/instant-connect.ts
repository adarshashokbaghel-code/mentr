import { ApiError } from "@/lib/api";

async function request<T>(
  path: string,
  options: RequestInit & { timeoutMs?: number } = {},
): Promise<T> {
  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("champs_token")
      : null;

  const { timeoutMs = 20_000, ...fetchOptions } = options;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(`/api${path}`, {
      ...fetchOptions,
      signal: controller.signal,
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...fetchOptions.headers,
      },
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new ApiError(
        (data as { error?: string }).error || "Request failed",
        res.status,
        data as Record<string, unknown>,
      );
    }
    return data as T;
  } catch (err) {
    if (err instanceof ApiError) throw err;
    if (err instanceof DOMException && err.name === "AbortError") {
      throw new ApiError("Request timed out", 408);
    }
    throw err;
  } finally {
    clearTimeout(timeout);
  }
}

export const IC_LOOKING_FOR = [
  { value: "tutor", label: "Tutor" },
  { value: "mentor", label: "Mentor" },
  { value: "either", label: "Either" },
] as const;

export const IC_CLASS_LEVELS = [
  "Class 3",
  "Class 5",
  "Class 8",
  "Class 10",
  "Class 12",
  "College",
  "Working Professional",
  "Other",
] as const;

export const IC_SUBJECTS = [
  "Mathematics",
  "Physics",
  "Chemistry",
  "Biology",
  "English",
  "Computer Science",
  "Coding",
  "Python",
  "Web Development",
  "DSA",
  "AI/ML",
  "Career Guidance",
  "Science",
  "Exam Prep",
  "Other",
] as const;

export const IC_BOARDS = [
  "CBSE",
  "ICSE",
  "State Board",
  "IB",
  "IGCSE",
  "Other",
  "Not Applicable",
] as const;

export const IC_MODES = [
  { value: "online", label: "Online" },
  { value: "offline", label: "Offline" },
  { value: "either", label: "Either" },
] as const;

export const IC_BUDGET_PRESETS = [
  { label: "₹0–500/hour", min: 0, max: 500 },
  { label: "₹500–1000/hour", min: 500, max: 1000 },
  { label: "₹1000–2000/hour", min: 1000, max: 2000 },
  { label: "₹2000+/hour", min: 2000, max: 100000 },
  { label: "Flexible", min: null, max: null },
] as const;

export const IC_PREFERRED_TIMES = [
  "Morning",
  "Afternoon",
  "Evening",
  "Night",
  "Flexible",
] as const;

export type IcFormPayload = {
  lookingFor: string;
  classLevel: string;
  subject: string;
  board: string;
  mode: string;
  location?: string;
  budgetMin?: number | null;
  budgetMax?: number | null;
  preferredTime?: string;
  message?: string;
};

export type IcMatchedTutor = {
  id: string;
  name: string;
  designation: string;
  subjects: string[];
  levels: string[];
  teachingModes: string[];
  city: string;
  area: string;
  hourlyRate: number | null;
  profileImageUrl: string | null;
  score: number;
  responseHint: string;
  matchReason?: string | null;
};

export type IcParentRequest = {
  id: string;
  lookingFor: string;
  classLevel: string;
  subject: string;
  board: string;
  mode: string;
  location: string | null;
  budgetMin: number | null;
  budgetMax: number | null;
  preferredTime: string | null;
  message: string | null;
  matchedCount: number;
  selectedCount: number;
  status: "active" | "closed" | "expired";
  createdAt: string;
  expiresAt: string;
  closedAt: string | null;
  closedBy: string | null;
  closeOutcome: "dismissed" | "mentor_found" | null;
  hiredTutorIds: string[];
  closeNotes: string | null;
};

export type IcTutorRequest = {
  id: string;
  classLevel: string;
  subject: string;
  board: string;
  mode: string;
  location: string | null;
  budgetMin: number | null;
  budgetMax: number | null;
  preferredTime: string | null;
  message: string | null;
  status: "active" | "closed" | "expired";
  createdAt: string;
  expiresAt: string;
  closedAt: string | null;
  parentContact: { available: true; phone: string } | { available: false };
};

export type IcAdminMentor = {
  id: string;
  name: string;
  email: string;
  subjects?: string[];
};

export type IcClosePayload = {
  outcome: "dismissed" | "mentor_found";
  hiredTutorIds?: string[];
  notes?: string;
};

export const instantConnectApi = {
  match: (form: IcFormPayload) =>
    request<{
      matches: IcMatchedTutor[];
      matchedBy: "rules" | "ai";
      noMatch: boolean;
      form: IcFormPayload;
    }>("/instant-connect/match", {
      method: "POST",
      body: JSON.stringify(form),
      timeoutMs: 35_000,
    }),

  create: (
    form: IcFormPayload & {
      matchedTutorIds: string[];
      selectedTutorIds: string[];
      consentSharedPhone: boolean;
    },
  ) =>
    request<{ request: IcParentRequest }>("/instant-connect", {
      method: "POST",
      body: JSON.stringify(form),
    }),

  mine: () =>
    request<{ requests: IcParentRequest[] }>("/instant-connect/mine"),

  get: (id: string) =>
    request<{
      request: IcParentRequest;
      mentors: {
        id: string;
        name: string;
        subjects: string[];
        hourlyRate: number | null;
        profileImageUrl: string | null;
      }[];
    }>(`/instant-connect/${id}`),

  close: (id: string, payload: IcClosePayload = { outcome: "dismissed" }) =>
    request<{ request: IcParentRequest }>(`/instant-connect/${id}/close`, {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  tutorMine: () =>
    request<{ requests: IcTutorRequest[] }>("/instant-connect/tutor/mine"),

  setAccepting: (acceptingStudents: boolean) =>
    request<{ acceptingStudents: boolean }>("/instant-connect/tutor/accepting", {
      method: "PATCH",
      body: JSON.stringify({ acceptingStudents }),
    }),

  adminSummary: (adminKey: string) =>
    request<{
      metrics: {
        total: number;
        active: number;
        closed: number;
        expired: number;
        mentorFound: number;
        noMatch: number;
        with1: number;
        with2: number;
        with3: number;
        avgCloseHours: number | null;
      };
      requests: {
        id: string;
        parentName: string;
        parentEmail: string;
        subject: string;
        classLevel: string;
        board: string;
        mode: string;
        lookingFor: string;
        mentorsNotified: IcAdminMentor[];
        mentorsHired: IcAdminMentor[];
        status: string;
        closeOutcome: "dismissed" | "mentor_found" | null;
        closeNotes: string | null;
        closedBy: string | null;
        createdAt: string;
        expiresAt: string;
        closedAt: string | null;
      }[];
    }>("/instant-connect/admin/summary", {
      headers: { "x-admin-key": adminKey },
    }),
};

export function trackIcEvent(name: string, meta?: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  try {
    window.dispatchEvent(
      new CustomEvent("mentr:analytics", { detail: { name, ...meta } }),
    );
    // Soft log for funnel debugging in V1
    console.info("[ic]", name, meta || {});
  } catch {
    /* ignore */
  }
}

export function formatIcBudget(
  min: number | null | undefined,
  max: number | null | undefined,
): string {
  if (min == null && max == null) return "Flexible";
  if (min != null && max != null) return `₹${min}–₹${max}/hour`;
  if (min != null) return `₹${min}+/hour`;
  return `Up to ₹${max}/hour`;
}
