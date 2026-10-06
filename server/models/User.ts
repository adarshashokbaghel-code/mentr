import mongoose, { Document, Schema, Types } from "mongoose";
import { deriveParentBoard, PARENT_BOARDS, type ParentBoard } from "../lib/parent-board";

export const WEEK_DAYS = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
] as const;
export type WeekDay = (typeof WEEK_DAYS)[number];

export const TEACHING_MODES = [
  "online",
  "student_home",
  "tutor_home",
] as const;
export type TeachingMode = (typeof TEACHING_MODES)[number];

export interface IAvailabilitySlot {
  day: WeekDay;
  /** 24h "HH:mm" */
  start: string;
  /** 24h "HH:mm" */
  end: string;
  /** Marked taken by the faculty after a WhatsApp booking */
  booked?: boolean;
}

export interface ISocialLinks {
  linkedin?: string;
  github?: string;
  website?: string;
  youtube?: string;
  instagram?: string;
}

export interface IFacultyProfile {
  name: string;
  designation: string;
  phoneNumber: string;
  bio: string;
  subjects: string[];
  // Extended profiling fields
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
  timezone: string;
  availability: IAvailabilitySlot[];
  // Optional extras
  gender?: "male" | "female" | "other";
  workplace?: string;
  certifications: string[];
  /** Awards, results, notable outcomes — e.g. "200+ students taught" */
  achievements: string[];
  /** Link to a short intro / demo class video (YouTube etc.) */
  introVideo?: string;
  socials?: ISocialLinks;
  // Legacy field kept optional for older records
  department?: string;
  /** When false, exclude from Instant Connect matching. Default true. */
  acceptingStudents?: boolean;
  /** Map pin latitude — from profile geocode or login IP */
  mapLat?: number;
  /** Map pin longitude — from profile geocode or login IP */
  mapLng?: number;
  /** How mapLat/mapLng were determined */
  mapLocationSource?: "profile" | "ip";
  /** area|city|country hash — re-geocode when profile location changes */
  mapLocationKey?: string;
}

export const USER_ROLES = ["faculty", "parent"] as const;
export type UserRole = (typeof USER_ROLES)[number];

/** Minimal profile for parents/students looking for tutors. */
export interface IParentProfile {
  name: string;
  phoneNumber: string;
  country: string;
  city: string;
  area?: string;
  /** Curriculum tag for the mentor parent list — IGCSE for overseas families */
  board?: ParentBoard;
  /** Up to 3 tutor IDs the parent saved from search — for compare & return visits */
  shortlistedTeacherIds?: string[];
  /** Hiring checklist — parent self-reported milestones */
  trialLoggedAt?: Date;
  firstSessionLoggedAt?: Date;
  /** Last daily pitch digest email — throttles to once per 24h */
  lastPitchDigestAt?: Date;
}

export type LearnTrackId = "class-3-5" | "class-6-8" | "class-9-12";

/** LMS progress — XP, streak, completion lists. */
export interface ILearnProgress {
  modulesCompleted: string[];
  /** Module ids where Watch stage was finished */
  videosWatched: string[];
  /** Module ids where quiz was completed (no retake) */
  quizzesCompleted: string[];
  /** Build Arena mission ids cleared */
  buildsCompleted: string[];
  /** Build missions cleared on first Run */
  buildsFirstTry: string[];
  currentModuleId: string | null;
  xp: number;
  streakDays: number;
  lastActivityAt: string | null;
  lastCheckInDay: string | null;
  streakBonusesClaimed: number[];
  weekKey: string | null;
  weekStartXp: number;
  weekStartVideos: number;
  weekStartPotdCorrect: number;
  potdCorrect: number;
  potdAttempted: number;
  practiceCorrect: number;
  practiceAttempted: number;
}

export interface ILearnPurchase {
  listPriceInr: number;
  subtotalInr: number;
  taxInr: number;
  discountInr: number;
  totalInr: number;
  currency: "INR";
  paymentMethod: "free" | "card" | "upi" | "other";
}

/** One Learn course enrollment (e.g. Mentr Starter). */
export interface ILearnEnrollment {
  courseId: string;
  courseName: string;
  tagline: string;
  track: LearnTrackId;
  status: "active" | "cancelled";
  enrolledAt: Date;
  receiptNumber: string;
  /** Lifetime access for free Class 3–5 launch cohort */
  expiry: "lifetime";
  purchase: ILearnPurchase;
  progress: ILearnProgress;
}

/** Separate Learn product object on the parent user document. */
export interface ILearnProfile {
  starter?: ILearnEnrollment;
}

/** Learn Python (/learnpython/lms) — created on the first signed-in visit, for any role. */
export interface ILearnPythonCounts {
  logins: number;
  practiceEasy: number;
  practiceMedium: number;
  practiceHard: number;
  videos: number;
  examples: number;
  lessonQuestions: number;
  quickChecks: number;
  projects: number;
}

/** Issued once, by the server, when every certificate rule is met. Public by id for verification. */
export interface ILearnPythonCertificate {
  id: string;
  issuedAt: Date;
  /** Name printed on the certificate, frozen at issue time. */
  name: string;
  course: string;
  stats: {
    xp: number;
    lessonsStudied: number;
    practiceSolved: number;
    examplesSolved: number;
    projectsCompleted: number;
    projects: string[];
  };
}

export interface ILearnPython {
  visited: boolean;
  firstVisitAt?: Date;
  lastVisitAt?: Date;
  xp: number;
  level: number;
  levelTitle?: string;
  band?: string;
  streakDays: number;
  bestStreak: number;
  lessonsCompleted: number;
  /** Lesson slugs open to the learner: lesson 1, then each lesson whose previous Study was finished. */
  unlockedLessons: string[];
  /** Learner's local calendar days with a visit, YYYY-MM-DD. */
  days: string[];
  videosWatched: string[];
  /** Award key (e.g. "bank:py001", "login:2026-10-06") → XP and when it was earned. */
  awards: Record<string, { xp: number; at: string }>;
  /** Lesson slug → PyLessonProgress. */
  lessons: Record<string, unknown>;
  /** Achievement id → ISO date unlocked. */
  achievements: Record<string, string>;
  /** Final Challenge project id → PyProjectProgress. */
  projects: Record<string, unknown>;
  projectsCompleted: number;
  certificate?: ILearnPythonCertificate;
  /** Set by Mentr staff to allow a claim without meeting the progress rules. */
  certificateUnlocked?: boolean;
  counts: ILearnPythonCounts;
}

export type PremiumMentorStatus = "none" | "pending" | "verified";

export type MentrAccountType = "free" | "premium";

export type PremiumPaymentStatus = "created" | "paid" | "failed";

export interface IPremiumMentorPayment {
  /** Client-facing receipt id */
  receiptNumber: string;
  razorpayOrderId: string;
  razorpayPaymentId?: string;
  status: PremiumPaymentStatus;
  months: number;
  listInr: number;
  discountPercent: number;
  discountInr: number;
  /** INR value — exact for INR orders; Razorpay settlement (or estimate) for USD. */
  amountInr: number;
  amountPaise: number;
  /** Charge currency of the Razorpay order. */
  currency: string;
  /** Charged amount in the smallest unit of `currency` (paise / cents). */
  amountMinor?: number;
  billingCountry?: string;
  usdPerMonth: number;
  listUsd: number;
  usdToInr: number;
  periodStart?: Date;
  periodEnd?: Date;
  method?: string;
  email?: string;
  createdAt: Date;
  paidAt?: Date;
  /** Mentor confirmed Terms/Privacy at checkout before Razorpay. */
  termsAcceptedAt?: Date;
  termsAcceptedVersion?: string;
  /** Sanitized Razorpay payment snapshot (no PAN/card). */
  razorpaySnapshot?: Record<string, unknown>;
  /** Coupon applied at checkout (INR only). amountInr is already net of it. */
  couponId?: Types.ObjectId;
  couponCode?: string;
  couponDiscountInr?: number;
}

export interface IMentrPremium {
  type: MentrAccountType;
  /** When mentor picked Free or completed Premium during / after onboarding */
  planChosenAt?: Date;
  firstRechargedAt?: Date;
  lastPurchasedAt?: Date;
  expiresAt?: Date;
  currentPlanMonths?: number;
  lastReceiptNumber?: string;
  lastRazorpayPaymentId?: string;
}

export interface IUser extends Document {
  email: string;
  role: UserRole;
  emailVerified: boolean;
  profileCompleted: boolean;
  profile?: IFacultyProfile;
  parentProfile?: IParentProfile;
  /** Mentr Learn enrollments + progress (parents only). */
  learn?: ILearnProfile;
  learnPython?: ILearnPython;
  /** Unique invite link generated when admin sends welcome email — used for referrals. */
  referralUrl?: string;
  /** Full signup URL the user arrived from (e.g. a referrer's link). */
  registrationSource?: string;
  /** Blog/page slug that last-touched this signup (utm_campaign or /blog/{slug}). */
  acquisitionSlug?: string;
  acquisitionKind?: "blog" | "page" | "referral" | "social";
  /** Public Supabase URL for mentor headshot */
  profileImageUrl?: string;
  /** Storage object path inside `mentrs_profile` (for replace/delete) */
  profileImagePath?: string;
  /**
   * Legacy SS-verify fields (admin QR flow). Prefer `mentrPremium` + Razorpay.
   * Kept for backwards compatibility with pending SS submissions.
   */
  premiumMentorStatus?: PremiumMentorStatus;
  premiumMentorPaymentSsUrl?: string;
  premiumMentorPaymentSsPath?: string;
  premiumMentorSubmittedAt?: Date;
  premiumMentorVerifiedAt?: Date;
  /** Active Premium subscription state (Razorpay). */
  mentrPremium?: IMentrPremium;
  /** Payment history (newest last; capped in service). */
  premiumPayments?: IPremiumMentorPayment[];
  /**
   * Extra parent-contact reveals beyond the daily premium quota.
   * Consumed when a reveal is made after the daily limit is already used.
   */
  parentRevealBonusCredits?: number;
  /** Set once premium mentors were emailed about this parent joining. */
  premiumMentorsNotifiedAt?: Date;
  lastLoginAt?: Date;
  /** IP geolocation captured at login — used until profile address is geocoded */
  loginMapLat?: number;
  loginMapLng?: number;
  loginMapCapturedAt?: Date;
  /** When the user accepted Terms + Privacy at signup. */
  legalAcceptedAt?: Date;
  /** Version string from src/lib/legal.ts at acceptance time. */
  legalAcceptedVersion?: string;
  createdAt: Date;
  updatedAt: Date;
}

const availabilitySlotSchema = new Schema<IAvailabilitySlot>(
  {
    day: { type: String, enum: WEEK_DAYS, required: true },
    start: { type: String, required: true, trim: true },
    end: { type: String, required: true, trim: true },
    booked: { type: Boolean, default: false },
  },
  { _id: false },
);

const socialLinksSchema = new Schema<ISocialLinks>(
  {
    linkedin: { type: String, trim: true },
    github: { type: String, trim: true },
    website: { type: String, trim: true },
    youtube: { type: String, trim: true },
    instagram: { type: String, trim: true },
  },
  { _id: false },
);

const facultyProfileSchema = new Schema<IFacultyProfile>(
  {
    name: { type: String, required: true, trim: true },
    designation: { type: String, required: true, trim: true },
    phoneNumber: { type: String, required: true, trim: true },
    bio: { type: String, default: "", trim: true },
    subjects: { type: [String], default: [] },
    country: { type: String, default: "India", trim: true },
    city: { type: String, default: "", trim: true },
    area: { type: String, default: "", trim: true },
    levels: { type: [String], default: [] },
    languages: { type: [String], default: [] },
    qualification: { type: String, default: "", trim: true },
    experienceYears: { type: Number, default: 0, min: 0, max: 60 },
    teachingModes: {
      type: [String],
      enum: TEACHING_MODES,
      default: [],
    },
    hourlyRate: { type: Number, min: 0 },
    timeFormat: { type: String, enum: ["12h", "24h"], default: "12h" },
    timezone: { type: String, default: "Asia/Kolkata", trim: true },
    availability: { type: [availabilitySlotSchema], default: [] },
    gender: { type: String, enum: ["male", "female", "other"] },
    workplace: { type: String, trim: true },
    certifications: { type: [String], default: [] },
    achievements: { type: [String], default: [] },
    introVideo: { type: String, trim: true },
    socials: { type: socialLinksSchema },
    department: { type: String, trim: true },
    acceptingStudents: { type: Boolean, default: true },
    mapLat: { type: Number },
    mapLng: { type: Number },
    mapLocationSource: { type: String, enum: ["profile", "ip"] },
    mapLocationKey: { type: String, trim: true },
  },
  { _id: false },
);

const parentProfileSchema = new Schema<IParentProfile>(
  {
    name: { type: String, required: true, trim: true },
    phoneNumber: { type: String, required: true, trim: true },
    country: { type: String, default: "India", trim: true },
    city: { type: String, required: true, trim: true },
    area: { type: String, trim: true },
    board: { type: String, enum: PARENT_BOARDS },
    shortlistedTeacherIds: {
      type: [String],
      default: undefined,
      validate: {
        validator: (v: string[]) => !v || v.length <= 3,
        message: "Shortlist cannot exceed 3 tutors",
      },
    },
    trialLoggedAt: { type: Date },
    firstSessionLoggedAt: { type: Date },
    lastPitchDigestAt: { type: Date },
  },
  { _id: false },
);

// Profile saves replace the whole subdocument, so a missing board means "re-derive".
parentProfileSchema.pre("validate", function () {
  if (this.board && !this.isModified("phoneNumber") && !this.isModified("country")) {
    return;
  }
  const derived = deriveParentBoard(this);
  this.board = derived.board;
  this.country = derived.country;
});

const learnProgressSchema = new Schema<ILearnProgress>(
  {
    modulesCompleted: { type: [String], default: [] },
    videosWatched: { type: [String], default: [] },
    quizzesCompleted: { type: [String], default: [] },
    buildsCompleted: { type: [String], default: [] },
    buildsFirstTry: { type: [String], default: [] },
    currentModuleId: { type: String, default: "A1" },
    xp: { type: Number, default: 0, min: 0 },
    streakDays: { type: Number, default: 0, min: 0 },
    lastActivityAt: { type: String, default: null },
    lastCheckInDay: { type: String, default: null },
    streakBonusesClaimed: { type: [Number], default: [] },
    weekKey: { type: String, default: null },
    weekStartXp: { type: Number, default: 0, min: 0 },
    weekStartVideos: { type: Number, default: 0, min: 0 },
    weekStartPotdCorrect: { type: Number, default: 0, min: 0 },
    potdCorrect: { type: Number, default: 0, min: 0 },
    potdAttempted: { type: Number, default: 0, min: 0 },
    practiceCorrect: { type: Number, default: 0, min: 0 },
    practiceAttempted: { type: Number, default: 0, min: 0 },
  },
  { _id: false },
);

const learnPurchaseSchema = new Schema<ILearnPurchase>(
  {
    listPriceInr: { type: Number, default: 0, min: 0 },
    subtotalInr: { type: Number, default: 0, min: 0 },
    taxInr: { type: Number, default: 0, min: 0 },
    discountInr: { type: Number, default: 0, min: 0 },
    totalInr: { type: Number, default: 0, min: 0 },
    currency: { type: String, enum: ["INR"], default: "INR" },
    paymentMethod: {
      type: String,
      enum: ["free", "card", "upi", "other"],
      default: "free",
    },
  },
  { _id: false },
);

const learnEnrollmentSchema = new Schema<ILearnEnrollment>(
  {
    courseId: { type: String, required: true, trim: true },
    courseName: { type: String, required: true, trim: true },
    tagline: { type: String, default: "", trim: true },
    track: {
      type: String,
      enum: ["class-3-5", "class-6-8", "class-9-12"],
      required: true,
    },
    status: { type: String, enum: ["active", "cancelled"], default: "active" },
    enrolledAt: { type: Date, required: true },
    receiptNumber: { type: String, required: true, trim: true },
    expiry: { type: String, enum: ["lifetime"], default: "lifetime" },
    purchase: { type: learnPurchaseSchema, required: true },
    progress: { type: learnProgressSchema, default: () => ({}) },
  },
  { _id: false },
);

const learnProfileSchema = new Schema<ILearnProfile>(
  {
    starter: { type: learnEnrollmentSchema, required: false },
  },
  { _id: false },
);

const learnPythonCountsSchema = new Schema<ILearnPythonCounts>(
  {
    logins: { type: Number, default: 0, min: 0 },
    practiceEasy: { type: Number, default: 0, min: 0 },
    practiceMedium: { type: Number, default: 0, min: 0 },
    practiceHard: { type: Number, default: 0, min: 0 },
    videos: { type: Number, default: 0, min: 0 },
    examples: { type: Number, default: 0, min: 0 },
    lessonQuestions: { type: Number, default: 0, min: 0 },
    quickChecks: { type: Number, default: 0, min: 0 },
    projects: { type: Number, default: 0, min: 0 },
  },
  { _id: false },
);

const learnPythonCertificateSchema = new Schema<ILearnPythonCertificate>(
  {
    id: { type: String, required: true, trim: true },
    issuedAt: { type: Date, required: true },
    name: { type: String, required: true, trim: true },
    course: { type: String, required: true, trim: true },
    stats: { type: Schema.Types.Mixed, default: () => ({}) },
  },
  { _id: false },
);

const learnPythonSchema = new Schema<ILearnPython>(
  {
    visited: { type: Boolean, default: false },
    firstVisitAt: { type: Date },
    lastVisitAt: { type: Date },
    xp: { type: Number, default: 0, min: 0 },
    level: { type: Number, default: 1, min: 1 },
    levelTitle: { type: String, trim: true },
    band: { type: String, trim: true },
    streakDays: { type: Number, default: 0, min: 0 },
    bestStreak: { type: Number, default: 0, min: 0 },
    lessonsCompleted: { type: Number, default: 0, min: 0 },
    unlockedLessons: { type: [String], default: [] },
    days: { type: [String], default: [] },
    videosWatched: { type: [String], default: [] },
    awards: { type: Schema.Types.Mixed, default: () => ({}) },
    lessons: { type: Schema.Types.Mixed, default: () => ({}) },
    achievements: { type: Schema.Types.Mixed, default: () => ({}) },
    projects: { type: Schema.Types.Mixed, default: () => ({}) },
    projectsCompleted: { type: Number, default: 0, min: 0 },
    certificate: { type: learnPythonCertificateSchema, required: false },
    certificateUnlocked: { type: Boolean, required: false },
    counts: { type: learnPythonCountsSchema, default: () => ({}) },
  },
  { _id: false, minimize: false },
);

const premiumMentorPaymentSchema = new Schema<IPremiumMentorPayment>(
  {
    receiptNumber: { type: String, required: true, trim: true },
    razorpayOrderId: { type: String, required: true, trim: true, index: true },
    razorpayPaymentId: { type: String, trim: true, index: true },
    status: {
      type: String,
      enum: ["created", "paid", "failed"],
      default: "created",
    },
    months: { type: Number, required: true, min: 1, max: 12 },
    listInr: { type: Number, required: true, min: 0 },
    discountPercent: { type: Number, default: 0, min: 0, max: 90 },
    discountInr: { type: Number, default: 0, min: 0 },
    amountInr: { type: Number, required: true, min: 1 },
    amountPaise: { type: Number, required: true, min: 100 },
    currency: { type: String, enum: ["INR", "USD"], default: "INR" },
    amountMinor: { type: Number, min: 1 },
    billingCountry: { type: String, trim: true, uppercase: true, maxlength: 2 },
    usdPerMonth: { type: Number, default: 5 },
    listUsd: { type: Number, default: 0 },
    usdToInr: { type: Number, default: 89.8 },
    periodStart: { type: Date },
    periodEnd: { type: Date },
    method: { type: String, trim: true },
    email: { type: String, trim: true },
    createdAt: { type: Date, default: Date.now },
    paidAt: { type: Date },
    termsAcceptedAt: { type: Date },
    termsAcceptedVersion: { type: String, trim: true },
    razorpaySnapshot: { type: Schema.Types.Mixed },
    couponId: { type: Schema.Types.ObjectId, ref: "Coupon" },
    couponCode: { type: String, trim: true, uppercase: true },
    couponDiscountInr: { type: Number, min: 0 },
  },
  { _id: true },
);

const mentrPremiumSchema = new Schema<IMentrPremium>(
  {
    type: { type: String, enum: ["free", "premium"], default: "free" },
    planChosenAt: { type: Date },
    firstRechargedAt: { type: Date },
    lastPurchasedAt: { type: Date },
    expiresAt: { type: Date },
    currentPlanMonths: { type: Number, min: 1, max: 12 },
    lastReceiptNumber: { type: String, trim: true },
    lastRazorpayPaymentId: { type: String, trim: true },
  },
  { _id: false },
);

const userSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    role: { type: String, enum: USER_ROLES, default: "faculty" },
    emailVerified: { type: Boolean, default: false },
    profileCompleted: { type: Boolean, default: false },
    profile: { type: facultyProfileSchema, required: false },
    parentProfile: { type: parentProfileSchema, required: false },
    learn: { type: learnProfileSchema, required: false },
    learnPython: { type: learnPythonSchema, required: false },
    referralUrl: { type: String, trim: true },
    registrationSource: { type: String, trim: true },
    acquisitionSlug: { type: String, trim: true, lowercase: true },
    acquisitionKind: {
      type: String,
      enum: ["blog", "page", "referral", "social"],
    },
    profileImageUrl: { type: String, trim: true },
    profileImagePath: { type: String, trim: true },
    premiumMentorStatus: {
      type: String,
      enum: ["none", "pending", "verified"],
      default: "none",
    },
    premiumMentorPaymentSsUrl: { type: String, trim: true },
    premiumMentorPaymentSsPath: { type: String, trim: true },
    premiumMentorSubmittedAt: { type: Date },
    premiumMentorVerifiedAt: { type: Date },
    mentrPremium: { type: mentrPremiumSchema, required: false },
    premiumPayments: { type: [premiumMentorPaymentSchema], default: [] },
    parentRevealBonusCredits: { type: Number, min: 0, default: 0 },
    premiumMentorsNotifiedAt: { type: Date },
    lastLoginAt: { type: Date },
    loginMapLat: { type: Number },
    loginMapLng: { type: Number },
    loginMapCapturedAt: { type: Date },
    legalAcceptedAt: { type: Date },
    legalAcceptedVersion: { type: String, trim: true },
  },
  { timestamps: true },
);

userSchema.index({ premiumMentorStatus: 1, premiumMentorSubmittedAt: -1 });
userSchema.index({ "mentrPremium.type": 1, "mentrPremium.expiresAt": 1 });
userSchema.index({ "premiumPayments.razorpayOrderId": 1 });
userSchema.index({ "premiumPayments.razorpayPaymentId": 1 }, { sparse: true });
userSchema.index({ "profile.subjects": 1 });
userSchema.index({ "profile.city": 1 });
userSchema.index({ referralUrl: 1 }, { sparse: true });
userSchema.index({ registrationSource: 1 }, { sparse: true });
userSchema.index({ acquisitionSlug: 1 }, { sparse: true });
userSchema.index({ "learn.starter.enrolledAt": -1 }, { sparse: true });
userSchema.index({ "learn.starter.track": 1 }, { sparse: true });
userSchema.index({ "learnPython.lastVisitAt": -1 }, { sparse: true });
userSchema.index({ "learnPython.xp": -1 }, { sparse: true });
userSchema.index({ "learnPython.certificate.id": 1 }, { unique: true, sparse: true });
userSchema.index(
  { "learn.starter.status": 1, "learn.starter.progress.xp": -1 },
  { sparse: true },
);

export const User =
  mongoose.models.User || mongoose.model<IUser>("User", userSchema);
