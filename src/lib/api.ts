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
  options: RequestInit & { timeoutMs?: number } = {},
): Promise<T> {
  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("champs_token")
      : null;

  const { timeoutMs = 12_000, ...fetchOptions } = options;
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
  /** Instant Connect matching — default true when unset */
  acceptingStudents?: boolean;
  /** Public mentor headshot URL (Supabase) */
  profileImageUrl?: string;
  profileImagePath?: string;
}

export type UserRole = "faculty" | "parent";

export interface ParentProfile {
  name: string;
  phoneNumber: string;
  country: string;
  city: string;
  area?: string;
  shortlistedTeacherIds?: string[];
  trialLoggedAt?: string;
  firstSessionLoggedAt?: string;
}

export interface AuthUser {
  id: string;
  email: string;
  role: UserRole;
  emailVerified: boolean;
  profileCompleted: boolean;
  profile?: Partial<FacultyProfile>;
  parentProfile?: Partial<ParentProfile>;
  learn?: {
    starter?: {
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
    };
  };
  profileImageUrl?: string;
  profileImagePath?: string;
  premiumMentorStatus?: "none" | "pending" | "verified";
  premiumMentorPaymentSsUrl?: string;
  premiumMentorSubmittedAt?: string;
  premiumMentorVerifiedAt?: string;
  mentrPremium?: {
    type: "free" | "premium";
    firstRechargedAt?: string;
    lastPurchasedAt?: string;
    expiresAt?: string;
    currentPlanMonths?: number;
    lastReceiptNumber?: string;
  };
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
  sendOtp: (
    email: string,
    intent?: "login" | "signup",
    role?: UserRole,
    registrationSource?: string,
    acquisition?: { slug?: string; kind?: "blog" | "page" | "social" },
  ) =>
    request<SendOtpResponse>("/auth/send-otp", {
      method: "POST",
      body: JSON.stringify({
        email,
        intent,
        role,
        registrationSource,
        acquisitionSlug: acquisition?.slug,
        acquisitionKind: acquisition?.kind,
      }),
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

  saveShortlist: (teacherIds: string[]) =>
    request<{ user: AuthUser; teacherIds: string[]; message: string }>(
      "/profile/shortlist",
      {
        method: "PUT",
        body: JSON.stringify({ teacherIds }),
      },
    ),

  views: () => request<ProfileViewsResponse>("/profile/views"),

  /** Parent opened a tutor profile — records a view for the tutor dashboard. */
  recordView: (teacherId: string) =>
    request<Record<string, never>>(`/profile/views/${teacherId}`, {
      method: "POST",
    }),

  uploadImage: (imageBase64: string, mimeType?: string) =>
    request<{
      user: AuthUser;
      profileImageUrl: string;
      message: string;
    }>("/profile/image", {
      method: "PUT",
      body: JSON.stringify({ imageBase64, mimeType }),
      timeoutMs: 60_000,
    }),

  deleteImage: () =>
    request<{ user: AuthUser; message: string }>("/profile/image", {
      method: "DELETE",
    }),
};

/* ------------------------------ premium mentor (Razorpay) ------------------------------ */

export type PremiumPlanOption = {
  months: 2 | 3 | 4;
  label: string;
  listInr: number;
  payInr: number;
  discountPercent: number;
  discountInr: number;
  listUsd: number;
  payUsdApprox: number;
  badge: string | null;
  isDefault: boolean;
  perMonthInr: number;
};

export type PremiumPaymentRow = {
  id: string;
  receiptNumber: string;
  razorpayOrderId: string;
  razorpayPaymentId: string | null;
  status: "created" | "paid" | "failed";
  months: number;
  listInr: number;
  discountPercent: number;
  discountInr: number;
  amountInr: number;
  amountPaise: number;
  currency: string;
  usdPerMonth: number;
  listUsd: number;
  usdToInr: number;
  periodStart: string | null;
  periodEnd: string | null;
  method: string | null;
  createdAt: string | null;
  paidAt: string | null;
};

export type PremiumMentorState = {
  catalog: {
    usdPerMonth: number;
    inrPerMonth: number;
    usdToInr: number;
    currency: "INR";
    noGstAdded: boolean;
    plans: PremiumPlanOption[];
  };
  paymentsEnabled: boolean;
  mentrType: "free" | "premium";
  premiumActive: boolean;
  canPurchase: boolean;
  firstRechargedAt: string | null;
  lastPurchasedAt: string | null;
  expiresAt: string | null;
  currentPlanMonths: number | null;
  lastReceiptNumber: string | null;
  payments: PremiumPaymentRow[];
};

export const premiumMentorApi = {
  catalog: () =>
    request<
      PremiumMentorState["catalog"] & { paymentsEnabled: boolean }
    >("/premium-mentor/catalog"),

  me: () =>
    request<{ user: AuthUser; premium: PremiumMentorState }>(
      "/premium-mentor/me",
    ),

  createOrder: (months: 2 | 3 | 4) =>
    request<{
      orderId: string;
      amountPaise: number;
      amountInr: number;
      currency: string;
      months: number;
      listInr: number;
      discountPercent: number;
      discountInr: number;
      listUsd: number;
      receiptNumber: string;
      keyId: string;
      prefill: { email: string; name: string; contact: string };
    }>("/premium-mentor/order", {
      method: "POST",
      body: JSON.stringify({ months }),
      timeoutMs: 30_000,
    }),

  verify: (payload: {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
  }) =>
    request<{
      alreadyApplied: boolean;
      user: AuthUser;
      premium: PremiumMentorState;
      payment: PremiumPaymentRow;
    }>("/premium-mentor/verify", {
      method: "POST",
      body: JSON.stringify(payload),
      timeoutMs: 45_000,
    }),

  cancel: (orderId: string) =>
    request<{ ok: boolean }>("/premium-mentor/cancel", {
      method: "POST",
      body: JSON.stringify({ orderId }),
    }),

  parents: (opts?: { q?: string; posted?: boolean; limit?: number }) => {
    const params = new URLSearchParams();
    if (opts?.q) params.set("q", opts.q);
    if (opts?.posted) params.set("posted", "1");
    if (opts?.limit) params.set("limit", String(opts.limit));
    const qs = params.toString();
    return request<{
      parents: PremiumParentRow[];
      quota: PremiumRevealQuota;
      premiumActive: boolean;
      error?: string;
      code?: string;
      upgradeUrl?: string;
    }>(`/premium-mentor/parents${qs ? `?${qs}` : ""}`);
  },

  revealParent: (parentId: string) =>
    request<{
      alreadyRevealed: boolean;
      reveal: PremiumRevealRow;
      quota: PremiumRevealQuota;
      error?: string;
      code?: string;
    }>(`/premium-mentor/parents/${encodeURIComponent(parentId)}/reveal`, {
      method: "POST",
      body: JSON.stringify({}),
    }),

  reveals: () =>
    request<{
      reveals: PremiumRevealRow[];
      quota: PremiumRevealQuota;
      premiumActive: boolean;
    }>("/premium-mentor/reveals"),
};

export type PremiumRevealQuota = {
  dailyLimit: number;
  usedToday: number;
  remaining: number;
};

export type PremiumRevealRow = {
  id: string;
  parentId: string;
  parentName: string;
  parentPhone: string;
  parentEmail: string | null;
  parentCity: string | null;
  parentArea: string | null;
  hasPosted: boolean;
  openPostsAtReveal: number;
  revealedAt: string | null;
  whatsappUrl: string | null;
};

export type PremiumParentRow = {
  id: string;
  name: string;
  initials?: string;
  imageUrl?: string | null;
  city: string | null;
  area: string | null;
  country: string;
  hasPosted: boolean;
  openPosts: number;
  totalPosts: number;
  latestPost: {
    subject: string;
    classLevel: string;
    area: string | null;
    status: string;
    createdAt: string | null;
  } | null;
  joinedAt: string | null;
  lastLoginAt: string | null;
  contactRevealed: boolean;
  phone: string;
  email: string | null;
  whatsappUrl: string | null;
  revealedAt: string | null;
};

/* ------------------------------ connections ------------------------------ */

export type ConnectionStatus = "pending" | "accepted" | "declined";

/** A connection as the parent sees it */
export interface ParentConnection {
  id: string;
  teacherId: string;
  teacherName: string;
  teacherArea: string | null;
  /** Public profile photo URL when the tutor has one */
  teacherImageUrl: string | null;
  message: string;
  status: ConnectionStatus;
  /** "parent" = you asked; "teacher" + source distinguishes board vs profile outreach */
  requestedBy: "parent" | "teacher";
  /** parent = you sent; board = tutor answered your post; profile = tutor reached out after you viewed them */
  source: "parent" | "board" | "profile";
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

  /** Tutor reaches out to a parent who viewed their profile */
  outreach: (parentId: string, message: string) =>
    request<{
      outreach: {
        parentId: string;
        parentName: string;
        parentArea: string | null;
        message: string;
        status: ConnectionStatus;
        sentAt: string;
      };
      message: string;
    }>("/connections/outreach", {
      method: "POST",
      body: JSON.stringify({ parentId, message }),
    }),

};

/* ------------------------------ requirements ------------------------------ */

/** A tutor's pitch on one of the parent's posts */
export interface RequirementInterest {
  id: string;
  teacherId: string;
  teacherName: string;
  teacherArea: string | null;
  /** Public profile photo URL when the tutor has one */
  teacherImageUrl: string | null;
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
  shareToken: string;
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
      dailyLimit: number | null;
      usedToday: number;
      unlimitedPitches?: boolean;
    }>("/requirements/board"),

  expressInterest: (id: string, message: string) =>
    request<{
      message: string;
      usedToday: number;
      dailyLimit: number | null;
      unlimitedPitches?: boolean;
      alreadyConnected?: boolean;
    }>(`/requirements/${id}/interest`, {
      method: "POST",
      body: JSON.stringify({ message }),
    }),

  pitches: () => request<{ pitches: TutorPitch[] }>("/requirements/pitches"),
};

export type HiringStepId =
  | "browse"
  | "shortlist"
  | "trial"
  | "connect"
  | "firstSession";

export type HiringSteps = Record<HiringStepId, boolean>;

export interface RequirementPitchSummary {
  requirementId: string;
  subject: string;
  classLevel: string;
  area: string;
  pendingCount: number;
}

export interface HiringProgress {
  steps: HiringSteps;
  completedCount: number;
  totalSteps: number;
  pendingPitchCount: number;
  pitchSummaries: RequirementPitchSummary[];
}

export interface SharedRequirement {
  headline: string;
  subject: string;
  classLevel: string;
  city: string;
  area: string;
  modes: TeachingMode[];
  budgetMin: number | null;
  budgetMax: number | null;
  details: string;
  startTimeline: StartTimeline;
  interestCount: number;
  postedAt: string;
  expiresAt: string;
}

export const parentHiringApi = {
  progress: () => request<HiringProgress>("/parent/hiring-progress"),

  completeStep: (step: "trial" | "firstSession") =>
    request<{ user: AuthUser; progress: HiringProgress; message: string }>(
      `/parent/hiring-progress/${step}`,
      { method: "POST" },
    ),
};

export async function fetchSharedRequirement(
  token: string,
): Promise<SharedRequirement> {
  const res = await fetch(`/api/requirements/share/${encodeURIComponent(token)}`, {
    cache: "no-store",
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new ApiError(
      (data as { error?: string }).error || "Post not found",
      res.status,
    );
  }
  return data as SharedRequirement;
}

export type ParentNotificationType =
  | "connection_accepted"
  | "connection_declined"
  | "requirement_pitch"
  | "teacher_outreach"
  | "tutor_slots_open";

export interface ParentNotification {
  id: string;
  type: ParentNotificationType;
  title: string;
  body: string;
  href: string;
  meta: Record<string, unknown>;
  read: boolean;
  createdAt: string;
}

export interface NotificationsResponse {
  notifications: ParentNotification[];
  unreadCount: number;
}

export const notificationsApi = {
  list: () => request<NotificationsResponse>("/notifications"),

  markRead: (id: string) =>
    request<{ notification: ParentNotification; unreadCount: number }>(
      `/notifications/${id}/read`,
      { method: "POST" },
    ),

  markAllRead: () =>
    request<{ message: string; unreadCount: number }>(
      "/notifications/read-all",
      { method: "POST" },
    ),
};

export interface ProfileViewer {
  id: string;
  name: string;
  area: string | null;
  count: number;
  lastViewedAt: string;
  connectionStatus: ConnectionStatus | "none";
  connectionId: string | null;
  requestedBy: "parent" | "teacher" | null;
  /** Tutor can send a connect request with a message */
  canReachOut: boolean;
}

export interface ProfileViewsResponse {
  totalViewers: number;
  weekCount: number;
  views: ProfileViewer[];
}

/* ------------------------------ Snap & Grade ------------------------------ */

export type SnapGradeRubricStep = {
  id: string;
  label: string;
  marks: number;
  criteria: string;
};

export type SnapGradeQuestion = {
  id: string;
  board: string;
  classLevel: number;
  subject: string;
  chapterNumber: number;
  chapterName: string;
  exercise: string;
  questionNumber: string;
  questionText: string;
  maxMarks: number;
  rubric: SnapGradeRubricStep[];
  markingSchemeNotes: string;
  creditsCost: number;
};

export type SnapGradeStepAward = {
  stepId: string;
  label: string;
  marksPossible: number;
  marksAwarded: number;
  comment: string;
};

export type SnapGradeEvaluation = {
  id: string;
  marksAwarded: number;
  maxMarks: number;
  creditsDeducted: number;
  steps: SnapGradeStepAward[];
  overallFeedback: string;
  transcript?: string;
  originalTranscript?: string;
  transcriptEdited?: boolean;
  relevance?: string;
  imageUrl: string;
  createdAt: string;
};

export type SnapGradeTranscript = {
  transcript: string;
  relevance: string;
  notes: string;
  imageReadable: boolean;
  creditsCharged: number;
  question: SnapGradeQuestion;
};

export type SnapGradeHistoryItem = {
  id: string;
  gradedAt: string;
  board: string;
  classLevel: number;
  subject: string;
  chapterNumber: number;
  chapterName: string;
  exercise: string;
  questionNumber: string;
  questionText: string;
  marksAwarded: number;
  maxMarks: number;
  creditsDeducted: number;
  overallFeedback: string;
  transcript: string;
  relevance: string;
  steps: {
    stepId: string;
    label: string;
    marksPossible: number;
    marksAwarded: number;
    comment: string;
  }[];
};

export type SnapGradePricing = {
  freeCredits: number;
  minRecharge: number;
  maxRecharge?: number;
  creditPaise: number;
  paymentsEnabled: boolean;
};

export const snapGradeApi = {
  catalog: () =>
    request<{
      boards: string[];
      classes: number[];
      subjects: string[];
      chapters: {
        subject: string;
        chapterNumber: number;
        chapterName: string;
      }[];
      exercises: {
        subject: string;
        chapterNumber: number;
        exercise: string;
      }[];
      questions: SnapGradeQuestion[];
      pricing?: SnapGradePricing;
    }>("/snap-grade/catalog"),

  wallet: () =>
    request<{
      creditBalance: number;
      freeCreditsClaimed: boolean;
      freeCreditsGranted?: number;
      totalRecharged?: number;
      totalSpent?: number;
      pricing?: SnapGradePricing;
    }>("/snap-grade/wallet"),

  account: () =>
    request<{
      creditBalance: number;
      freeCreditsClaimed: boolean;
      freeCreditsGranted: number;
      totalRecharged: number;
      totalSpent: number;
      premiumUnlimited?: boolean;
      history: SnapGradeHistoryItem[];
      recharges: {
        orderId: string;
        paymentId: string | null;
        credits: number;
        amountPaise: number;
        status: string;
        createdAt: string;
        paidAt: string | null;
      }[];
      pricing: SnapGradePricing;
    }>("/snap-grade/account"),

  history: (opts?: { limit?: number; offset?: number }) => {
    const q = new URLSearchParams();
    if (opts?.limit) q.set("limit", String(opts.limit));
    if (opts?.offset) q.set("offset", String(opts.offset));
    const qs = q.toString();
    return request<{ total: number; items: SnapGradeHistoryItem[] }>(
      `/snap-grade/history${qs ? `?${qs}` : ""}`,
    );
  },

  createRechargeOrder: (credits: number) =>
    request<{
      orderId: string;
      amountPaise: number;
      currency: string;
      credits: number;
      keyId: string;
      creditBalance: number;
    }>("/snap-grade/recharge/order", {
      method: "POST",
      body: JSON.stringify({ credits }),
    }),

  verifyRecharge: (payload: {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
  }) =>
    request<{
      alreadyApplied: boolean;
      creditBalance: number;
      credits: number;
    }>("/snap-grade/recharge/verify", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  /** Free OCR — no credits. User reviews before grading. */
  transcribe: (payload: {
    questionId: string;
    imageBase64: string;
    mimeType?: string;
  }) =>
    request<SnapGradeTranscript>("/snap-grade/transcribe", {
      method: "POST",
      body: JSON.stringify(payload),
      timeoutMs: 70_000,
    }),

  evaluate: (payload: {
    questionId: string;
    imageBase64: string;
    mimeType?: string;
    confirmedTranscript: string;
    originalTranscript?: string;
    relevance?: string;
  }) =>
    request<{
      evaluation: SnapGradeEvaluation;
      question: SnapGradeQuestion;
      creditBalance: number;
      premiumUnlimited?: boolean;
    }>("/snap-grade/evaluate", {
      method: "POST",
      body: JSON.stringify(payload),
      timeoutMs: 70_000,
    }),
};

