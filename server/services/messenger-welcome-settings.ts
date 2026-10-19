import {
  DEFAULT_MESSENGER_WELCOME,
  SiteSettings,
  type IMessengerWelcomeSettings,
} from "../models/SiteSettings";

function normalize(raw: Partial<IMessengerWelcomeSettings> | undefined | null): IMessengerWelcomeSettings {
  const base = { ...DEFAULT_MESSENGER_WELCOME };
  if (!raw) return base;
  return {
    autoWelcomeMentor:
      typeof raw.autoWelcomeMentor === "boolean"
        ? raw.autoWelcomeMentor
        : base.autoWelcomeMentor,
    autoWelcomeParent:
      typeof raw.autoWelcomeParent === "boolean"
        ? raw.autoWelcomeParent
        : base.autoWelcomeParent,
    mentorIntro: typeof raw.mentorIntro === "string" ? raw.mentorIntro.trim() : "",
    parentIntro: typeof raw.parentIntro === "string" ? raw.parentIntro.trim() : "",
    mentorSubject: typeof raw.mentorSubject === "string" ? raw.mentorSubject.trim() : "",
    parentSubject: typeof raw.parentSubject === "string" ? raw.parentSubject.trim() : "",
    mentorWelcomeCouponCode:
      typeof raw.mentorWelcomeCouponCode === "string"
        ? raw.mentorWelcomeCouponCode.trim().toUpperCase()
        : "",
  };
}

export async function getMessengerWelcomeSettings(): Promise<IMessengerWelcomeSettings> {
  const doc = await SiteSettings.findOne({ key: "main" }).lean();
  return normalize(doc?.messengerWelcome as Partial<IMessengerWelcomeSettings> | undefined);
}

export async function saveMessengerWelcomeSettings(
  patch: Partial<IMessengerWelcomeSettings>,
): Promise<IMessengerWelcomeSettings> {
  const current = await getMessengerWelcomeSettings();
  const next = normalize({ ...current, ...patch });
  await SiteSettings.findOneAndUpdate(
    { key: "main" },
    { $set: { messengerWelcome: next } },
    { upsert: true },
  );
  return next;
}

export function applyWelcomePlaceholders(text: string, name: string) {
  return text.replace(/\{\{\s*name\s*\}\}/gi, name);
}

export const DEFAULT_MENTOR_WELCOME_INTRO =
  "Thank you for joining Mentr by Paprly. Your mentor profile stays free forever — parents can find you in search with no listing fees. Finish your profile so you appear in results.";

export const DEFAULT_PARENT_WELCOME_INTRO =
  "Welcome to Mentr by Paprly. Find verified tutors for your child — online or nearby — with no platform fees and no hidden charges.";

async function couponMailVars(code: string) {
  const trimmed = code.trim();
  if (trimmed.length < 3) return undefined;
  const { quoteCouponForBroadcast } = await import("./coupons");
  const quoted = await quoteCouponForBroadcast(trimmed);
  if (!quoted.ok) return undefined;
  const quote = quoted.quote;
  return {
    code: quote.code,
    offInr: quote.discountInr,
    sameOff: quote.sameOff,
    validUntilLabel: quote.validUntilLabel,
    perUserLimit: quote.perUserLimit,
    lines: quote.lines,
  };
}

/** Merge admin welcome copy (+ optional coupon) into messenger template vars. */
export async function welcomeExtrasForRole(
  role: "faculty" | "parent",
  name: string,
  opts?: { couponCode?: string; useStoredMentorCoupon?: boolean },
) {
  const settings = await getMessengerWelcomeSettings();
  const introRaw =
    role === "parent"
      ? settings.parentIntro || DEFAULT_PARENT_WELCOME_INTRO
      : settings.mentorIntro || DEFAULT_MENTOR_WELCOME_INTRO;
  const subjectRaw =
    role === "parent" ? settings.parentSubject : settings.mentorSubject;

  let couponCode = opts?.couponCode?.trim() || "";
  if (
    role === "faculty" &&
    !couponCode &&
    opts?.useStoredMentorCoupon !== false &&
    settings.mentorWelcomeCouponCode
  ) {
    couponCode = settings.mentorWelcomeCouponCode;
  }

  const coupon = couponCode ? await couponMailVars(couponCode) : undefined;

  return {
    welcomeIntro: applyWelcomePlaceholders(introRaw, name),
    welcomeSubjectOverride: subjectRaw
      ? applyWelcomePlaceholders(subjectRaw, name)
      : undefined,
    ...(coupon ? { coupon } : {}),
  };
}
