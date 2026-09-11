export type ParentNeedMode = "online" | "home";

export type ParentNeed = {
  subject: string;
  level: string;
  city: string;
  mode: ParentNeedMode;
};

const KEY = "mentr_parent_need";

export const PARENT_NEED_SUBJECTS = [
  "Mathematics",
  "Physics",
  "Chemistry",
  "Biology",
  "English",
  "Coding",
  "Exam Prep",
  "Career Mentoring",
] as const;

export const PARENT_NEED_LEVELS = [
  "Class 6–8",
  "Class 9–10",
  "Class 11–12",
  "JEE",
  "NEET",
  "Spoken English",
  "Other",
] as const;

/** Cities that already show up in Analytics — plus online. */
export const PARENT_NEED_CITIES = [
  "Bengaluru",
  "Hyderabad",
  "Delhi",
  "Chennai",
  "Mumbai",
  "Pune",
  "Kolkata",
  "Online / any city",
] as const;

export function saveParentNeed(need: ParentNeed) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(KEY, JSON.stringify(need));
  } catch {
    /* ignore */
  }
}

export function getParentNeed(): ParentNeed | undefined {
  if (typeof window === "undefined") return undefined;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return undefined;
    const parsed = JSON.parse(raw) as ParentNeed;
    if (!parsed?.subject || !parsed.city) return undefined;
    return parsed;
  } catch {
    return undefined;
  }
}

export function parentNeedSearchHref(need: ParentNeed): string {
  const params = new URLSearchParams();
  if (need.subject) params.set("subject", need.subject);
  if (need.city && need.city !== "Online / any city") {
    params.set("q", need.city);
  }
  params.set("mode", need.mode === "home" ? "inperson" : "online");
  return `/search?${params.toString()}`;
}

export function parentNeedConnectMessage(
  need: ParentNeed,
  teacherFirstName?: string,
): string {
  const who = teacherFirstName ? `${teacherFirstName}, ` : "";
  const place =
    need.mode === "online"
      ? "online"
      : need.city === "Online / any city"
        ? "at home"
        : `in ${need.city}`;
  return `${who}looking for ${need.subject} help (${need.level}) ${place}. Are you available to start a trial?`.slice(
    0,
    500,
  );
}

export function parentNeedSignupHref(need: ParentNeed): string {
  const next = `/parent/dashboard`;
  return `/parent/signup?next=${encodeURIComponent(next)}&need=1`;
}
