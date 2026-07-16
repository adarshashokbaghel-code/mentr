export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public data?: Record<string, unknown>,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

async function request<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("champs_token")
      : null;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 12_000);

  try {
    const res = await fetch(`/api${path}`, {
      ...options,
      signal: controller.signal,
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
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

export type WeekDay =
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday"
  | "sunday";

export type TeachingMode = "online" | "student_home" | "tutor_home";

export interface AvailabilitySlot {
  day: WeekDay;
  /** 24h "HH:mm" */
  start: string;
  /** 24h "HH:mm" */
  end: string;
  /** Marked taken after a WhatsApp booking */
  booked?: boolean;
}

export interface SocialLinks {
  linkedin?: string;
  github?: string;
  website?: string;
  youtube?: string;
  instagram?: string;
}

export interface FacultyProfile {
  name: string;
  designation: string;
  phoneNumber: string;
  bio: string;
  subjects: string[];
  country: string;
  city: string;
  area: string;
  levels: string[];
  languages: string[];
  qualification: string;
  experienceYears: number;
  teachingModes: TeachingMode[];
  hourlyRate?: number;
  timeFormat: "12h" | "24h";
  /** IANA zone the availability slots are written in, e.g. "Asia/Kolkata" */
  timezone?: string;
  availability: AvailabilitySlot[];
  gender?: "male" | "female" | "other";
  workplace?: string;
  certifications?: string[];
  achievements?: string[];
  introVideo?: string;
  socials?: SocialLinks;
  department?: string;
}

export type UserRole = "faculty" | "parent";

export interface ParentProfile {
  name: string;
  phoneNumber: string;
  country: string;
  city: string;
  area?: string;
}

export interface AuthUser {
  id: string;
  email: string;
  role: UserRole;
  emailVerified: boolean;
  profileCompleted: boolean;
  profile?: Partial<FacultyProfile>;
  parentProfile?: Partial<ParentProfile>;
  lastLoginAt?: string;
  createdAt: string;
}

export interface SendOtpResponse {
  sessionId: string;
  isNewUser: boolean;
  purpose: "login" | "signup";
  message: string;
  expiresIn: number;
  retryAfter?: number;
}

export interface VerifyOtpResponse {
  token: string;
  user: AuthUser;
  profileCompleted: boolean;
  message: string;
}

export function saveToken(token: string) {
  localStorage.setItem("champs_token", token);
}

export function clearToken() {
  localStorage.removeItem("champs_token");
}

export const authApi = {
  sendOtp: (email: string, intent?: "login" | "signup", role?: UserRole) =>
    request<SendOtpResponse>("/auth/send-otp", {
      method: "POST",
      body: JSON.stringify({ email, intent, role }),
    }),

  // Role is bound to the OTP session server-side at send time,
  // so verify only needs the email + session + code.
  verifyOtp: (payload: { email: string; sessionId: string; code: string }) =>
    request<VerifyOtpResponse>("/auth/verify-otp", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  me: () => request<{ user: AuthUser }>("/auth/me"),

  logout: () =>
    request<{ message: string }>("/auth/logout", { method: "POST" }).finally(
      clearToken,
    ),
};

export const profileApi = {
  get: () =>
    request<{ profile: Partial<FacultyProfile> | null; profileCompleted: boolean }>(
      "/profile",
    ),

  save: (profile: FacultyProfile) =>
    request<{ user: AuthUser; message: string }>("/profile", {
      method: "PUT",
      body: JSON.stringify(profile),
    }),

  updateAvailability: (availability: AvailabilitySlot[]) =>
    request<{ user: AuthUser; message: string }>("/profile/availability", {
      method: "PATCH",
      body: JSON.stringify({ availability }),
    }),

  saveParent: (profile: ParentProfile) =>
    request<{ user: AuthUser; message: string }>("/profile/parent", {
      method: "PUT",
      body: JSON.stringify(profile),
    }),

  views: () => request<ProfileViewsResponse>("/profile/views"),
};

/* ------------------------------ connections ------------------------------ */

export type ConnectionStatus = "pending" | "accepted" | "declined";

/** A connection as the parent sees it */
export interface ParentConnection {
  id: string;
  teacherId: string;
  teacherName: string;
  teacherArea: string | null;
  message: string;
  status: ConnectionStatus;
  /** "parent" = you asked the tutor; "teacher" = tutor answered your post */
  requestedBy: "parent" | "teacher";
  /** wa.me-ready number — only present once accepted */
  phone: string | null;
  sentAt: string;
  respondedAt: string | null;
}

/** A request as the teacher sees it */
export interface ConnectionRequest {
  id: string;
  parentName: string;
  parentArea: string | null;
  message: string;
  status: ConnectionStatus;
  sentAt: string;
  respondedAt: string | null;
}

export const connectionsApi = {
  send: (teacherId: string, message: string) =>
    request<{ connection: ParentConnection; message: string }>("/connections", {
      method: "POST",
      body: JSON.stringify({ teacherId, message }),
    }),

  mine: () =>
    request<{ connections: ParentConnection[] }>("/connections/mine"),

  requests: () =>
    request<{ pendingCount: number; requests: ConnectionRequest[] }>(
      "/connections/requests",
    ),

  respond: (id: string, action: "accept" | "decline") =>
    request<{ request: ConnectionRequest; message: string }>(
      `/connections/${id}/respond`,
      { method: "POST", body: JSON.stringify({ action }) },
    ),

  /** Parent accepting/declining a tutor's pitch from the requirements board */
  respondAsParent: (id: string, action: "accept" | "decline") =>
    request<{ connection: ParentConnection; message: string }>(
      `/connections/${id}/respond`,
      { method: "POST", body: JSON.stringify({ action }) },
    ),
};

/* ------------------------------ requirements ------------------------------ */

/** A tutor's pitch on one of the parent's posts */
export interface RequirementInterest {
  id: string;
  teacherId: string;
  teacherName: string;
  teacherArea: string | null;
  message: string;
  status: ConnectionStatus;
  /** Tutor's wa.me-ready number — unlocked once the parent accepts */
  phone: string | null;
  sentAt: string;
  respondedAt: string | null;
}

export type StartTimeline =
  | "immediately"
  | "within_week"
  | "within_month"
  | "flexible";

/** A post as its parent owner sees it */
export interface MyRequirement {
  id: string;
  subject: string;
  classLevel: string;
  city: string;
  area: string;
  modes: TeachingMode[];
  budgetMin: number | null;
  budgetMax: number | null;
  details: string;
  startTimeline: StartTimeline;
  status: "open" | "closed";
  interestCount: number;
  postedAt: string;
  expiresAt: string;
  interests: RequirementInterest[];
}

/** An anonymized post as tutors see it on the board */
export interface BoardRequirement {
  id: string;
  subject: string;
  classLevel: string;
  city: string;
  area: string;
  modes: TeachingMode[];
  budgetMin: number | null;
  budgetMax: number | null;
  details: string;
  startTimeline: StartTimeline;
  status: "open" | "closed";
  interestCount: number;
  postedAt: string;
  expiresAt: string;
  myInterestStatus: ConnectionStatus | null;
}

export interface NewRequirement {
  subject: string;
  classLevel: string;
  area: string;
  modes: TeachingMode[];
  budgetMin?: number | "";
  budgetMax?: number | "";
  details: string;
  startTimeline: StartTimeline;
}

/** A pitch the tutor sent from the board, as the tutor sees it */
export interface TutorPitch {
  id: string;
  status: ConnectionStatus;
  message: string;
  sentAt: string;
  respondedAt: string | null;
  /** Only revealed once the parent accepts */
  parentName: string | null;
  /** Parent's wa.me-ready number — acceptance is mutual consent */
  parentPhone: string | null;
  parentArea: string | null;
  requirement: {
    subject: string;
    classLevel: string;
    area: string;
    city: string;
    startTimeline: StartTimeline;
    open: boolean;
  } | null;
}

export const requirementsApi = {
  post: (payload: NewRequirement) =>
    request<{ requirement: MyRequirement; message: string }>("/requirements", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  mine: () =>
    request<{ requirements: MyRequirement[] }>("/requirements/mine"),

  close: (id: string) =>
    request<{ requirement: MyRequirement; message: string }>(
      `/requirements/${id}/close`,
      { method: "POST" },
    ),

  board: () =>
    request<{
      requirements: BoardRequirement[];
      dailyLimit: number;
      usedToday: number;
    }>("/requirements/board"),

  expressInterest: (id: string, message: string) =>
    request<{
      message: string;
      usedToday: number;
      dailyLimit: number;
      alreadyConnected?: boolean;
    }>(`/requirements/${id}/interest`, {
      method: "POST",
      body: JSON.stringify({ message }),
    }),

  pitches: () => request<{ pitches: TutorPitch[] }>("/requirements/pitches"),
};

export interface ProfileViewer {
  id: string;
  name: string;
  area: string | null;
  count: number;
  lastViewedAt: string;
}

export interface ProfileViewsResponse {
  totalViewers: number;
  weekCount: number;
  views: ProfileViewer[];
}
