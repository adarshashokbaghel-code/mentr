import { User, type IUser } from "../models/User";
import type { IcLookingFor, IcMode } from "../models/InstantConnectRequest";
import { rerankInstantConnectWithAi } from "./instant-connect-ai";

/** Tunable later — V1 eligibility gate for Instant Connect matching pool. */
export function isEligibleForInstantConnect(user: IUser): boolean {
  if (user.role !== "faculty") return false;
  if (!user.emailVerified || !user.profileCompleted) return false;
  if (!user.profile) return false;
  // Default true when unset
  if (user.profile.acceptingStudents === false) return false;
  return true;
}

export type MatchInput = {
  subject: string;
  classLevel: string;
  mode: IcMode;
  location?: string;
  budgetMin?: number;
  budgetMax?: number;
  lookingFor?: IcLookingFor;
  board?: string;
  /** Optional free-text notes — triggers AI re-rank when OpenAI key is set */
  message?: string;
};

export type MatchedTutorCard = {
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
  /** Short AI reason when matchedBy === "ai" */
  matchReason?: string | null;
};

export type FindMatchesResult = {
  matches: MatchedTutorCard[];
  matchedBy: "rules" | "ai";
};

function norm(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

function subjectScore(tutorSubjects: string[], want: string): number {
  const w = norm(want);
  if (!w) return 0;
  for (const s of tutorSubjects) {
    const t = norm(s);
    if (t === w) return 1;
    if (t.includes(w) || w.includes(t)) return 0.75;
  }
  // Coding / CS soft aliases
  const aliases: Record<string, string[]> = {
    coding: ["computer science", "python", "web development", "dsa", "programming"],
    "computer science": ["coding", "python", "dsa", "web development"],
    python: ["coding", "computer science", "programming"],
    mathematics: ["maths", "math"],
    maths: ["mathematics", "math"],
  };
  for (const s of tutorSubjects) {
    const t = norm(s);
    const related = aliases[w] || [];
    if (related.some((a) => t.includes(a) || a.includes(t))) return 0.5;
  }
  return 0;
}

function classScore(tutorLevels: string[], want: string): number {
  const w = norm(want);
  if (!w) return 0.3;
  for (const l of tutorLevels) {
    const t = norm(l);
    if (t === w) return 1;
    if (t.includes(w) || w.includes(t)) return 0.8;
  }
  // Map Class 10 → Class 9–10 etc.
  const num = w.match(/\d+/)?.[0];
  if (num) {
    for (const l of tutorLevels) {
      const t = norm(l);
      if (t.includes(num)) return 0.7;
      if (num >= "1" && num <= "5" && (t.includes("1") || t.includes("5") || t.includes("primary")))
        return 0.5;
      if (num >= "6" && num <= "8" && t.includes("6")) return 0.5;
      if (num >= "9" && num <= "10" && (t.includes("9") || t.includes("10"))) return 0.6;
      if (num >= "11" && num <= "12" && (t.includes("11") || t.includes("12"))) return 0.6;
    }
  }
  if (w.includes("college") && tutorLevels.some((l) => /college|ug|pg/i.test(l)))
    return 0.7;
  if (w.includes("professional") && tutorLevels.some((l) => /professional|working/i.test(l)))
    return 0.7;
  return 0.15;
}

function budgetScore(rate: number | undefined, min?: number, max?: number): number {
  if (rate == null || Number.isNaN(rate)) return 0.4;
  if (min == null && max == null) return 0.5;
  const lo = min ?? 0;
  const hi = max ?? Number.POSITIVE_INFINITY;
  if (rate >= lo && rate <= hi) return 1;
  if (rate < lo) {
    const gap = lo - rate;
    return Math.max(0, 1 - gap / Math.max(lo, 500));
  }
  const gap = rate - (max ?? rate);
  return Math.max(0, 1 - gap / Math.max(max ?? 1000, 500));
}

function modeScore(
  modes: string[],
  want: IcMode,
  tutorCity: string,
  location?: string,
): number {
  const hasOnline = modes.includes("online");
  const hasOffline =
    modes.includes("student_home") || modes.includes("tutor_home");

  if (want === "online") return hasOnline ? 1 : 0.1;
  if (want === "offline") {
    if (!hasOffline) return 0.1;
    if (location && tutorCity) {
      const loc = norm(location);
      const city = norm(tutorCity);
      if (city && (loc.includes(city) || city.includes(loc.split(" ")[0] || "")))
        return 1;
      return 0.55;
    }
    return 0.7;
  }
  // either
  if (hasOnline || hasOffline) return 0.9;
  return 0.2;
}

function availabilityScore(user: IUser): number {
  const slots = user.profile?.availability || [];
  if (slots.length === 0) return 0.3;
  const open = slots.filter((s) => !s.booked).length;
  if (open === 0) return 0.2;
  return Math.min(1, 0.5 + open * 0.1);
}

function profileQualityScore(user: IUser): number {
  let s = 0.4;
  if (user.profileImageUrl) s += 0.2;
  if ((user.profile?.bio || "").length > 40) s += 0.15;
  if ((user.profile?.experienceYears || 0) >= 2) s += 0.15;
  if ((user.profile?.certifications || []).length > 0) s += 0.1;
  return Math.min(1, s);
}

/** Weights: Subject 35 · Class 20 · Budget 15 · Mode/location 15 · Availability 10 · Profile 5 */
export function scoreTutor(user: IUser, input: MatchInput): number {
  const p = user.profile!;
  const subject = subjectScore(p.subjects || [], input.subject) * 0.35;
  const klass = classScore(p.levels || [], input.classLevel) * 0.2;
  const budget = budgetScore(p.hourlyRate, input.budgetMin, input.budgetMax) * 0.15;
  const mode =
    modeScore(p.teachingModes || [], input.mode, p.city || "", input.location) *
    0.15;
  const avail = availabilityScore(user) * 0.1;
  const quality = profileQualityScore(user) * 0.05;
  return subject + klass + budget + mode + avail + quality;
}

export function toMatchCard(user: IUser, score: number): MatchedTutorCard {
  const p = user.profile!;
  return {
    id: user._id.toString(),
    name: p.name,
    designation: p.designation || "Mentor",
    subjects: p.subjects || [],
    levels: p.levels || [],
    teachingModes: p.teachingModes || [],
    city: p.city || "",
    area: p.area || "",
    hourlyRate: p.hourlyRate ?? null,
    profileImageUrl: user.profileImageUrl || null,
    score: Math.round(score * 1000) / 1000,
    responseHint: "Usually responds within 12 hours",
    matchReason: null,
  };
}

const MIN_SCORE = 0.22;
const CANDIDATE_POOL = 24;

export async function findTopMatches(
  input: MatchInput,
  limit = 3,
): Promise<FindMatchesResult> {
  const faculty = await User.find({
    role: "faculty",
    emailVerified: true,
    profileCompleted: true,
  }).limit(400);

  const scored: { user: IUser; score: number }[] = [];
  for (const u of faculty) {
    if (!isEligibleForInstantConnect(u)) continue;
    const score = scoreTutor(u, input);
    if (score < MIN_SCORE) continue;
    // Require some subject signal
    if (subjectScore(u.profile?.subjects || [], input.subject) < 0.4) continue;
    scored.push({ user: u, score });
  }

  scored.sort((a, b) => b.score - a.score);
  const pool = scored
    .slice(0, Math.max(limit, CANDIDATE_POOL))
    .map(({ user, score }) => toMatchCard(user, score));

  const notes = (input.message || "").trim();
  if (notes && pool.length > 0) {
    const ai = await rerankInstantConnectWithAi(input, pool, limit);
    if (ai && ai.orderedIds.length > 0) {
      const byId = new Map(pool.map((c) => [c.id, c]));
      const matches = ai.orderedIds
        .map((id) => {
          const card = byId.get(id);
          if (!card) return null;
          return {
            ...card,
            matchReason: ai.reasons[id] || null,
          };
        })
        .filter(Boolean) as MatchedTutorCard[];
      if (matches.length > 0) {
        return { matches, matchedBy: "ai" };
      }
    }
  }

  return {
    matches: pool.slice(0, limit),
    matchedBy: "rules",
  };
}
