export const PARENT_BOARDS = ["CBSE", "IGCSE"] as const;
export type ParentBoard = (typeof PARENT_BOARDS)[number];

/** Longest prefix wins, so list 3-digit codes before the 1–2 digit ones they start with. */
const DIAL_CODE_COUNTRIES: Array<[string, string]> = [
  ["971", "United Arab Emirates"],
  ["974", "Qatar"],
  ["966", "Saudi Arabia"],
  ["968", "Oman"],
  ["973", "Bahrain"],
  ["965", "Kuwait"],
  ["977", "Nepal"],
  ["880", "Bangladesh"],
  ["852", "Hong Kong"],
  ["353", "Ireland"],
  ["44", "United Kingdom"],
  ["46", "Sweden"],
  ["47", "Norway"],
  ["45", "Denmark"],
  ["49", "Germany"],
  ["33", "France"],
  ["31", "Netherlands"],
  ["41", "Switzerland"],
  ["61", "Australia"],
  ["64", "New Zealand"],
  ["65", "Singapore"],
  ["60", "Malaysia"],
  ["27", "South Africa"],
  ["81", "Japan"],
  ["1", "United States / Canada"],
];

function isIndia(country: string | null | undefined) {
  const c = String(country || "").trim().toLowerCase();
  return !c || c === "india" || c === "in" || c === "bharat";
}

/** Country implied by an international (+XX) phone number, or null for Indian / unknown numbers. */
export function overseasCountryFromPhone(phone: string | null | undefined): string | null {
  const raw = String(phone || "").replace(/[\s()-]/g, "");
  const digits = raw.startsWith("+")
    ? raw.slice(1)
    : raw.startsWith("00")
      ? raw.slice(2)
      : null;
  if (!digits || !/^\d{7,15}$/.test(digits) || digits.startsWith("91")) return null;
  const hit = DIAL_CODE_COUNTRIES.find(([code]) => digits.startsWith(code));
  return hit ? hit[1] : "Overseas";
}

export function deriveParentBoard(profile: {
  phoneNumber?: string | null;
  country?: string | null;
}): { board: ParentBoard; overseas: boolean; country: string } {
  const phoneCountry = overseasCountryFromPhone(profile.phoneNumber);
  const country = isIndia(profile.country)
    ? phoneCountry || "India"
    : String(profile.country).trim();
  const overseas = !isIndia(country);
  return { board: overseas ? "IGCSE" : "CBSE", overseas, country };
}

export function parseParentBoard(raw: unknown): ParentBoard | null {
  const v = String(raw ?? "").trim().toUpperCase();
  return (PARENT_BOARDS as readonly string[]).includes(v) ? (v as ParentBoard) : null;
}
