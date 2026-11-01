/**
 * Server-side live faculty for SEO hub pages.
 * Hubs must never depend on the empty static TEACHERS catalog.
 */

import type { Teacher } from "@/lib/teachers";
import { searchTeachers } from "@/lib/teachers";
import type { SeoCitySlug } from "@/lib/seo-programmatic";
import { SEO_CITIES } from "@/lib/seo-programmatic";

/** Loose aliases so freeform faculty subjects still match SEO hubs */
const SUBJECT_ALIASES: Record<string, string[]> = {
  history: ["history", "social science", "social studies", "sst", "civics", "humanities"],
  mathematics: ["mathematics", "maths", "math", "algebra", "calculus"],
  "computer science": ["computer science", "cs", "informatics"],
  coding: ["coding", "programming", "python", "java", "web development"],
  english: ["english", "spoken english", "ielts", "communication"],
  biology: ["biology", "botany", "zoology", "life science"],
  economics: ["economics", "commerce", "business studies"],
  accountancy: ["accountancy", "accounts", "accounting", "commerce"],
  geography: ["geography", "social science", "social studies"],
};

function normalize(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

export function subjectMatchesTeacher(subject: string, teacher: Teacher): boolean {
  const target = normalize(subject);
  const aliases = SUBJECT_ALIASES[target] ?? [target];
  const hay = normalize(
    [
      ...teacher.subjects,
      teacher.subjectLine,
      teacher.bio.slice(0, 280),
      teacher.levels,
      teacher.designation,
    ].join(" "),
  );
  return aliases.some((a) => hay.includes(a));
}

/** Names and neighbourhoods that belong to one city page, not every city page. */
const CITY_PLACE_ALIASES: Record<SeoCitySlug, string[]> = {
  bengaluru: [
    "bengaluru",
    "bangalore",
    "bengalooru",
    "koramangala",
    "indiranagar",
    "hsr layout",
    "jayanagar",
    "whitefield",
    "malleshwaram",
    "electronic city",
  ],
  hyderabad: [
    "hyderabad",
    "secunderabad",
    "cyberabad",
    "gachibowli",
    "banjara hills",
    "madhapur",
    "kondapur",
    "kukatpally",
  ],
  delhi: [
    "delhi",
    "new delhi",
    "noida",
    "gurugram",
    "gurgaon",
    "dwarka",
    "saket",
    "rohini",
    "pitampura",
  ],
  mumbai: ["mumbai", "bombay", "navi mumbai", "thane", "andheri", "powai", "bandra"],
  pune: ["pune", "pimpri", "chinchwad", "baner", "kothrud", "hinjewadi", "wakad"],
  chennai: ["chennai", "madras", "adyar", "anna nagar", "velachery", "t nagar"],
  kolkata: ["kolkata", "calcutta", "salt lake", "howrah"],
};

function mentionsPlace(hay: string, place: string): boolean {
  return ` ${hay} `.includes(` ${place} `);
}

function cityMatchesTeacher(citySlug: SeoCitySlug, teacher: Teacher): boolean {
  const hay = normalize(`${teacher.area} ${teacher.locality}`);
  return (CITY_PLACE_ALIASES[citySlug] ?? []).some((place) =>
    mentionsPlace(hay, normalize(place)),
  );
}

function toTeacher(raw: Record<string, unknown>): Teacher {
  return {
    ...(raw as unknown as Teacher),
    lat: typeof raw.lat === "number" ? raw.lat : NaN,
    lng: typeof raw.lng === "number" ? raw.lng : NaN,
  };
}

/** Load completed public faculty profiles (cached ~60s in Express layer). */
export async function loadSeoTeachers(): Promise<Teacher[]> {
  try {
    const { loadPublicTeachers } = await import("../../server/public-teacher");
    const rows = await loadPublicTeachers();
    return rows.map(toTeacher);
  } catch (err) {
    console.error("seo live teachers:", err);
    return [];
  }
}

export async function liveTeachersForSubject(subject: string): Promise<Teacher[]> {
  const all = await loadSeoTeachers();
  const matched = all.filter((t) => subjectMatchesTeacher(subject, t));
  return searchTeachers({
    teachers: matched.length > 0 ? matched : all,
    sort: "newest",
  }).slice(0, 40);
}

export async function liveTeachersForCity(citySlug: SeoCitySlug): Promise<Teacher[]> {
  const city = SEO_CITIES.find((c) => c.slug === citySlug);
  if (!city) return [];
  const all = await loadSeoTeachers();
  const inCity = all.filter((t) => cityMatchesTeacher(citySlug, t));
  return searchTeachers({
    teachers: inCity,
    sort: "newest",
  }).slice(0, 12);
}

export async function liveTeachersForCitySubject(
  citySlug: SeoCitySlug,
  subject: string,
): Promise<Teacher[]> {
  const city = SEO_CITIES.find((c) => c.slug === citySlug);
  if (!city) return [];
  const all = await loadSeoTeachers();
  const bySubject = all.filter((t) => subjectMatchesTeacher(subject, t));
  const byCity = bySubject.filter((t) => cityMatchesTeacher(citySlug, t));
  return searchTeachers({
    teachers: byCity,
    sort: "newest",
  }).slice(0, 12);
}

export {
  formatHourlyRate,
  modeLabels,
} from "@/lib/teachers";

