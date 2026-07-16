/**
 * Time-zone helpers for cross-country tutoring.
 *
 * Tutors save weekly slots in their own local wall time plus an IANA
 * time zone (e.g. "Asia/Kolkata"). Parents anywhere in the world can then
 * view those slots either in the tutor's time or converted to their own.
 */

export type WeekDay =
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday"
  | "sunday";

export const WEEK_DAY_ORDER: WeekDay[] = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];

export const DAY_SHORT: Record<WeekDay, string> = {
  monday: "Mon",
  tuesday: "Tue",
  wednesday: "Wed",
  thursday: "Thu",
  friday: "Fri",
  saturday: "Sat",
  sunday: "Sun",
};

export interface WeeklySlot {
  day: WeekDay;
  /** 24h "HH:mm" */
  start: string;
  /** 24h "HH:mm" */
  end: string;
  booked?: boolean;
}

/** A slot after conversion — start and end can land on different days. */
export interface ConvertedSlot {
  startDay: WeekDay;
  start: string;
  endDay: WeekDay;
  end: string;
  booked?: boolean;
}

export const DEFAULT_TIMEZONE = "Asia/Kolkata";

/** Friendly abbreviations for zones common on the platform. */
const TZ_ABBREVIATIONS: Record<string, string> = {
  "Asia/Kolkata": "IST",
  "Asia/Dubai": "GST",
  "Asia/Singapore": "SGT",
  "Asia/Tokyo": "JST",
  "Asia/Hong_Kong": "HKT",
  "Asia/Riyadh": "AST",
  "Asia/Karachi": "PKT",
  "Asia/Dhaka": "BST",
  "Asia/Kathmandu": "NPT",
  "Australia/Sydney": "AEST",
  "Australia/Perth": "AWST",
  "Europe/London": "UK",
  "Europe/Paris": "CET",
  "Europe/Berlin": "CET",
  "America/New_York": "ET",
  "America/Chicago": "CT",
  "America/Denver": "MT",
  "America/Los_Angeles": "PT",
  "America/Toronto": "ET",
  "America/Vancouver": "PT",
  UTC: "UTC",
};

/** Zones offered in the tutor's time-zone picker. */
export const COMMON_TIMEZONES: { id: string; label: string }[] = [
  { id: "Asia/Kolkata", label: "India — IST" },
  { id: "Asia/Dubai", label: "UAE — Gulf Time" },
  { id: "Asia/Riyadh", label: "Saudi Arabia — AST" },
  { id: "Asia/Karachi", label: "Pakistan — PKT" },
  { id: "Asia/Dhaka", label: "Bangladesh — BST" },
  { id: "Asia/Kathmandu", label: "Nepal — NPT" },
  { id: "Asia/Singapore", label: "Singapore — SGT" },
  { id: "Asia/Hong_Kong", label: "Hong Kong — HKT" },
  { id: "Asia/Tokyo", label: "Japan — JST" },
  { id: "Australia/Perth", label: "Australia (Perth) — AWST" },
  { id: "Australia/Sydney", label: "Australia (Sydney) — AEST" },
  { id: "Europe/London", label: "United Kingdom" },
  { id: "Europe/Paris", label: "France / Central Europe" },
  { id: "Europe/Berlin", label: "Germany / Central Europe" },
  { id: "America/New_York", label: "US East — New York" },
  { id: "America/Chicago", label: "US Central — Chicago" },
  { id: "America/Denver", label: "US Mountain — Denver" },
  { id: "America/Los_Angeles", label: "US West — Los Angeles" },
  { id: "America/Toronto", label: "Canada East — Toronto" },
  { id: "America/Vancouver", label: "Canada West — Vancouver" },
  { id: "UTC", label: "UTC" },
];

export function isValidTimezone(tz: string): boolean {
  if (!tz) return false;
  try {
    new Intl.DateTimeFormat("en-US", { timeZone: tz });
    return true;
  } catch {
    return false;
  }
}

/** Browser's IANA zone, e.g. "Asia/Kolkata". */
export function detectTimezone(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || DEFAULT_TIMEZONE;
  } catch {
    return DEFAULT_TIMEZONE;
  }
}

/** Offset of a zone from UTC in minutes, for a given instant. */
export function tzOffsetMinutes(tz: string, date: Date = new Date()): number {
  const fmt = new Intl.DateTimeFormat("en-US", {
    timeZone: tz,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
  const parts: Record<string, string> = {};
  for (const p of fmt.formatToParts(date)) parts[p.type] = p.value;
  const asUtc = Date.UTC(
    Number(parts.year),
    Number(parts.month) - 1,
    Number(parts.day),
    Number(parts.hour) % 24,
    Number(parts.minute),
    Number(parts.second),
  );
  return Math.round((asUtc - date.getTime()) / 60000);
}

/** "UTC+5:30" / "UTC-8" style offset label. */
export function utcOffsetLabel(tz: string, date: Date = new Date()): string {
  const mins = tzOffsetMinutes(tz, date);
  if (mins === 0) return "UTC";
  const sign = mins > 0 ? "+" : "-";
  const abs = Math.abs(mins);
  const h = Math.floor(abs / 60);
  const m = abs % 60;
  return `UTC${sign}${h}${m ? `:${String(m).padStart(2, "0")}` : ""}`;
}

/** Short human name: "IST", "PT", else falls back to the Intl short name. */
export function tzAbbreviation(tz: string): string {
  if (TZ_ABBREVIATIONS[tz]) return TZ_ABBREVIATIONS[tz];
  try {
    const parts = new Intl.DateTimeFormat("en-US", {
      timeZone: tz,
      timeZoneName: "short",
    }).formatToParts(new Date());
    return parts.find((p) => p.type === "timeZoneName")?.value || tz;
  } catch {
    return tz;
  }
}

/** e.g. "IST (UTC+5:30)" — used next to slot chips and toggles. */
export function tzDisplayLabel(tz: string): string {
  const abbr = tzAbbreviation(tz);
  const offset = utcOffsetLabel(tz);
  return abbr === offset ? offset : `${abbr} (${offset})`;
}

function toMinutes(t: string): number {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
}

function fromMinutes(total: number): string {
  const h = Math.floor(total / 60);
  const m = total % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

const WEEK_MINUTES = 7 * 24 * 60;

/**
 * Converts a weekly recurring slot from one zone's wall time to another's.
 * Offsets are taken at "now", so DST-observing zones show current-season times.
 */
export function convertSlot(
  slot: WeeklySlot,
  fromTz: string,
  toTz: string,
): ConvertedSlot {
  const delta =
    tzOffsetMinutes(toTz) - tzOffsetMinutes(fromTz); // minutes to add
  const dayIdx = WEEK_DAY_ORDER.indexOf(slot.day);

  const convert = (time: string): { day: WeekDay; time: string } => {
    let total = dayIdx * 1440 + toMinutes(time) + delta;
    total = ((total % WEEK_MINUTES) + WEEK_MINUTES) % WEEK_MINUTES;
    return {
      day: WEEK_DAY_ORDER[Math.floor(total / 1440)],
      time: fromMinutes(total % 1440),
    };
  };

  const start = convert(slot.start);
  const end = convert(slot.end);
  return {
    startDay: start.day,
    start: start.time,
    endDay: end.day,
    end: end.time,
    booked: slot.booked,
  };
}

export function formatTime(t: string, fmt: "12h" | "24h" = "12h"): string {
  if (fmt === "24h") return t;
  const [h, m] = t.split(":").map(Number);
  const suffix = h >= 12 ? "PM" : "AM";
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  return m === 0
    ? `${hour12} ${suffix}`
    : `${hour12}:${String(m).padStart(2, "0")} ${suffix}`;
}

/** "Mon 4–6 PM" or, when it crosses midnight, "Mon 11 PM – Tue 1 AM". */
export function convertedSlotLabel(
  slot: ConvertedSlot,
  fmt: "12h" | "24h" = "12h",
): string {
  const start = formatTime(slot.start, fmt);
  const end = formatTime(slot.end, fmt);
  if (slot.startDay === slot.endDay) {
    return `${DAY_SHORT[slot.startDay]} ${start} – ${end}`;
  }
  return `${DAY_SHORT[slot.startDay]} ${start} – ${DAY_SHORT[slot.endDay]} ${end}`;
}
