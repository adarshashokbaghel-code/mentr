import { haversineKm } from "@/lib/geo";

/** Matches the backend TEACHING_MODES enum */
export type TeachingMode = "online" | "student_home" | "tutor_home";

/** How a teacher delivers classes — used by the search Mode filter */
export type ModeFilter = "all" | "online" | "inperson" | "both";

export interface Teacher {
  id: string;
  name: string;
  initials: string;
  imageUrl: string;
  subjects: string[];
  subjectLine: string;
  experienceYears: number;
  rating: number;
  reviewCount: number;
  openSlots: number;
  designation: string;
  /** Full display e.g. "Koramangala, Bengaluru" */
  area: string;
  /** Locality key for filters / map */
  locality: string;
  lat: number;
  lng: number;
  bio: string;
  levels: string;
  /** Delivery modes offered (online / student's home / tutor's home) */
  modes: TeachingMode[];
  /** Languages the teacher speaks */
  languages: string[];
  /** Credibility extras — present on live profiles */
  qualification?: string;
  workplace?: string;
  certifications?: string[];
  achievements?: string[];
  introVideo?: string;
  hourlyRate?: number | null;
  socials?: {
    linkedin?: string;
    github?: string;
    website?: string;
    youtube?: string;
    instagram?: string;
  };
  slots: { label: string; available: boolean }[];
  /** IANA zone the raw availability is written in (live profiles) */
  timezone?: string;
  /** Tutor's preferred display format for times */
  timeFormat?: "12h" | "24h";
  /** Raw weekly slots — lets the UI convert to the viewer's time zone */
  availability?: {
    day:
      | "monday"
      | "tuesday"
      | "wednesday"
      | "thursday"
      | "friday"
      | "saturday"
      | "sunday";
    start: string;
    end: string;
    booked?: boolean;
  }[];
  /** wa.me-ready number — null until the viewer's connection is accepted */
  phone: string | null;
  /** This viewer's connection state with the teacher (live profiles) */
  connectionStatus?: "none" | "pending" | "accepted" | "declined";
  verified: boolean;
  /** Active Mentr Premium mentor */
  premium?: boolean;
  /** tutor | mentor */
  kind: "tutor" | "mentor";
  /** True for real faculty loaded from the database */
  live?: boolean;
  /** ISO join date from the database (newest-first lists) */
  createdAt?: string | null;
}

export const SUBJECTS = [
  "Mathematics",
  "Physics",
  "Chemistry",
  "English",
  "Computer Science",
  "Coding",
  "Biology",
  "History",
  "Geography",
  "Accountancy",
  "Exam Prep",
  "Career Mentoring",
  "Economics",
  "Music",
  "Sports Coaching",
];

export const LOCALITIES = [
  "Koramangala",
  "Indiranagar",
  "HSR Layout",
  "Jayanagar",
  "Whitefield",
  "Malleshwaram",
] as const;

export type Locality = (typeof LOCALITIES)[number];

function hashSeed(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

/** Slight offset so tutors in the same locality don't stack on one pin. */
export function jitterCoordsForId(
  lat: number,
  lng: number,
  id: string,
): { lat: number; lng: number } {
  const h = hashSeed(id);
  const angle = (h % 360) * (Math.PI / 180);
  const r = 0.002 + (h % 80) / 40000;
  return {
    lat: lat + r * Math.cos(angle),
    lng: lng + r * Math.sin(angle),
  };
}

/** Resolve map coordinates — uses API lat/lng only (geocoded server-side). */
export function resolveTeacherCoords(
  teacher: {
    id: string;
    lat: number | null;
    lng: number | null;
  },
): { lat: number; lng: number } | null {
  if (
    teacher.lat != null &&
    teacher.lng != null &&
    Number.isFinite(teacher.lat) &&
    Number.isFinite(teacher.lng)
  ) {
    return jitterCoordsForId(teacher.lat, teacher.lng, teacher.id);
  }
  return null;
}

export const FILTER_LANGUAGES = [
  "English",
  "Hindi",
  "Kannada",
  "Tamil",
  "Telugu",
] as const;

/** Min-experience steps offered in the search filter (years) */
export const EXPERIENCE_STEPS = [0, 3, 5, 10] as const;

function matchesMode(teacher: Teacher, mode: ModeFilter): boolean {
  if (mode === "all") return true;
  const modes = teacher.modes || [];
  // Live profiles created before modes existed shouldn't vanish from results
  if (modes.length === 0) return true;
  const online = modes.includes("online");
  const inPerson =
    modes.includes("student_home") || modes.includes("tutor_home");
  if (mode === "online") return online;
  if (mode === "inperson") return inPerson;
  return online && inPerson;
}

/** Live faculty only — no static demo tutors/mentors. */
export const TEACHERS: Teacher[] = [];


export function modeLabels(teacher: Pick<Teacher, "modes">): string[] {
  const modes = teacher.modes || [];
  const labels: string[] = [];
  if (modes.includes("online")) labels.push("Online");
  if (modes.includes("student_home") || modes.includes("tutor_home")) {
    labels.push("Home");
  }
  if (labels.length === 0) labels.push("Flexible");
  return labels;
}

export function formatHourlyRate(rate?: number | null): string | null {
  if (rate == null || !Number.isFinite(rate) || rate <= 0) return null;
  return `₹${Math.round(rate)}/hr`;
}

export type SearchSort =
  | "relevance"
  | "newest"
  | "open"
  | "experience"
  | "rating"
  | "distance";

function joinedAtMs(t: Pick<Teacher, "createdAt">): number {
  if (!t.createdAt) return 0;
  const ms = Date.parse(t.createdAt);
  return Number.isFinite(ms) ? ms : 0;
}

function hasProfilePhoto(t: Pick<Teacher, "imageUrl">): boolean {
  return Boolean(t.imageUrl?.trim());
}

/** Photo profiles first, then newest join date. */
function comparePhotoThenNewest(a: Teacher, b: Teacher): number {
  const photoA = hasProfilePhoto(a) ? 1 : 0;
  const photoB = hasProfilePhoto(b) ? 1 : 0;
  if (photoA !== photoB) return photoB - photoA;
  return joinedAtMs(b) - joinedAtMs(a);
}

export function getTeacher(id: string): Teacher | undefined {
  return TEACHERS.find((t) => t.id === id);
}

type ApiTeacher = Omit<Teacher, "lat" | "lng"> & {
  lat: number | null;
  lng: number | null;
};

function fromApiTeacher(t: ApiTeacher): Teacher {
  return {
    ...t,
    lat: t.lat ?? NaN,
    lng: t.lng ?? NaN,
  };
}

export type FetchTeachersResult = {
  teachers: Teacher[];
  /** API unreachable or errored — do not show demo placeholder data */
  failed: boolean;
};

const PUBLIC_TEACHERS_CACHE_KEY = "mentr_public_teachers_v3";
const PUBLIC_TEACHERS_TTL_MS = 5 * 60 * 1000;

type PublicTeachersCache = {
  teachers: Teacher[];
  at: number;
};

let publicTeachersMemory: PublicTeachersCache | null = null;
let publicTeachersInflight: Promise<{
  teachers: Teacher[];
  failed: boolean;
}> | null = null;

function readPublicTeachersSession(): Teacher[] | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(PUBLIC_TEACHERS_CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { teachers?: ApiTeacher[]; at?: number };
    if (
      !parsed.at ||
      Date.now() - parsed.at > PUBLIC_TEACHERS_TTL_MS ||
      !Array.isArray(parsed.teachers)
    ) {
      return null;
    }
    return parsed.teachers.map(fromApiTeacher);
  } catch {
    return null;
  }
}

function writePublicTeachersSession(teachers: ApiTeacher[]) {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(
      PUBLIC_TEACHERS_CACHE_KEY,
      JSON.stringify({ teachers, at: Date.now() }),
    );
  } catch {
    /* quota / private mode */
  }
}

function cachedLiveTeachers(): Teacher[] | null {
  if (
    publicTeachersMemory &&
    Date.now() - publicTeachersMemory.at < PUBLIC_TEACHERS_TTL_MS
  ) {
    return publicTeachersMemory.teachers;
  }
  const fromSession = readPublicTeachersSession();
  if (fromSession) {
    publicTeachersMemory = { teachers: fromSession, at: Date.now() };
    return fromSession;
  }
  return null;
}

async function loadLivePublicTeachers(): Promise<{
  teachers: Teacher[];
  failed: boolean;
}> {
  const cached = cachedLiveTeachers();
  if (cached) return { teachers: cached, failed: false };

  if (!publicTeachersInflight) {
    publicTeachersInflight = (async () => {
      try {
        const res = await fetch("/api/teachers/public");
        if (!res.ok) return { teachers: [], failed: true };
        const data = (await res.json()) as { teachers: ApiTeacher[] };
        const live = (data.teachers || []).map(fromApiTeacher);
        publicTeachersMemory = { teachers: live, at: Date.now() };
        writePublicTeachersSession(data.teachers || []);
        return { teachers: live, failed: false };
      } catch {
        return { teachers: [], failed: true };
      } finally {
        publicTeachersInflight = null;
      }
    })();
  }

  return publicTeachersInflight;
}

/** Real faculty with completed profiles — public browse (no login). */
export async function fetchPublicTeachers(_opts?: {
  /** @deprecated No demo profiles remain; always live-only */
  liveOnly?: boolean;
}): Promise<FetchTeachersResult> {
  const { teachers: live, failed } = await loadLivePublicTeachers();
  if (failed) return { teachers: [], failed: true };
  return { teachers: live, failed: false };
}

/** Active Mentr Premium mentors for /premiummentors (public, no phones). */
export async function fetchPremiumTeachers(): Promise<FetchTeachersResult> {
  try {
    const res = await fetch("/api/teachers/premium", { cache: "no-store" });
    if (!res.ok) return { teachers: [], failed: true };
    const data = (await res.json()) as { teachers: ApiTeacher[] };
    const live = (data.teachers || []).map(fromApiTeacher);
    return { teachers: live, failed: false };
  } catch {
    return { teachers: [], failed: true };
  }
}

/** Real faculty with completed profiles, straight from the database. */
export async function fetchLiveTeachers(): Promise<FetchTeachersResult> {
  try {
    const res = await fetch("/api/teachers", { cache: "no-store" });
    if (!res.ok) return { teachers: [], failed: true };
    const data = (await res.json()) as { teachers: ApiTeacher[] };
    const live = (data.teachers || []).map(fromApiTeacher);
    return { teachers: live, failed: false };
  } catch {
    return { teachers: [], failed: true };
  }
}

export function searchTeachers(opts: {
  subject?: string;
  locality?: string;
  onlyOpen?: boolean;
  onlyVerified?: boolean;
  /** regular = non-premium (default), premium = premium only, all = no filter */
  mentorTier?: "regular" | "premium" | "all";
  kind?: "tutor" | "mentor" | "all";
  /** Delivery mode: online / in person / offers both */
  mode?: ModeFilter;
  /** Language the teacher must speak */
  language?: string;
  /** Minimum years of experience */
  minExp?: number;
  query?: string;
  sort?: SearchSort;
  /** User latitude for distance match */
  nearLat?: number;
  /** User longitude for distance match */
  nearLng?: number;
  /** Max distance in km (requires nearLat/nearLng) */
  radiusKm?: number;
  /** Base list to search; defaults to empty (pass live results from fetch*) */
  teachers?: Teacher[];
}): (Teacher & { distanceKm?: number })[] {
  let list: (Teacher & { distanceKm?: number })[] = [
    ...(opts.teachers ?? []),
  ];

  if (opts.subject) {
    list = list.filter((t) =>
      t.subjects.some((s) => s.toLowerCase() === opts.subject!.toLowerCase()),
    );
  }
  if (opts.locality) {
    list = list.filter(
      (t) => t.locality.toLowerCase() === opts.locality!.toLowerCase(),
    );
  }
  if (opts.query?.trim()) {
    const q = opts.query.trim().toLowerCase();
    list = list.filter(
      (t) =>
        t.name.toLowerCase().includes(q) ||
        t.subjectLine.toLowerCase().includes(q) ||
        t.subjects.some((s) => s.toLowerCase().includes(q)) ||
        t.area.toLowerCase().includes(q) ||
        t.locality.toLowerCase().includes(q) ||
        t.levels.toLowerCase().includes(q) ||
        (t.languages || []).some((l) => l.toLowerCase().includes(q)),
    );
  }
  if (opts.onlyOpen) {
    list = list.filter((t) => t.openSlots > 0);
  }
  if (opts.onlyVerified) {
    list = list.filter((t) => t.verified);
  }
  if (opts.mentorTier === "premium") {
    list = list.filter((t) => Boolean(t.premium));
  } else if (opts.mentorTier === "regular" || !opts.mentorTier) {
    // Default: regular catalog (non-premium). Pass "all" to disable.
    if (opts.mentorTier === "regular") {
      list = list.filter((t) => !t.premium);
    }
  }
  if (opts.kind && opts.kind !== "all") {
    list = list.filter((t) => t.kind === opts.kind);
  }
  if (opts.mode && opts.mode !== "all") {
    list = list.filter((t) => matchesMode(t, opts.mode!));
  }
  if (opts.language) {
    const lang = opts.language.toLowerCase();
    list = list.filter((t) =>
      (t.languages || []).some((l) => l.toLowerCase() === lang),
    );
  }
  if (opts.minExp && opts.minExp > 0) {
    list = list.filter((t) => t.experienceYears >= opts.minExp!);
  }

  const hasGeo =
    typeof opts.nearLat === "number" &&
    typeof opts.nearLng === "number" &&
    Number.isFinite(opts.nearLat) &&
    Number.isFinite(opts.nearLng);

  if (hasGeo) {
    const user = { lat: opts.nearLat!, lng: opts.nearLng! };
    list = list.map((t) =>
      Number.isFinite(t.lat) && Number.isFinite(t.lng)
        ? { ...t, distanceKm: haversineKm(user, { lat: t.lat, lng: t.lng }) }
        : t,
    );

    if (typeof opts.radiusKm === "number" && opts.radiusKm > 0) {
      const withinRadius = list.filter((t) => {
        if (t.distanceKm == null) return true;
        const modes = t.modes || [];
        const onlineOnly =
          modes.length > 0 &&
          modes.every((m) => m === "online");
        if (onlineOnly) return true;
        return t.distanceKm <= opts.radiusKm!;
      });
      // Soft radius: if nothing nearby, still show all (sorted by distance)
      list = withinRadius.length > 0 ? withinRadius : list;
    }
  }

  const sort = opts.sort || "relevance";
  if (sort === "distance" && hasGeo) {
    return list.sort((a, b) => {
      const byDist =
        (a.distanceKm ?? Infinity) - (b.distanceKm ?? Infinity);
      if (byDist !== 0) return byDist;
      return comparePhotoThenNewest(a, b);
    });
  }
  if (sort === "experience") {
    return list.sort((a, b) => {
      const byExp = b.experienceYears - a.experienceYears;
      if (byExp !== 0) return byExp;
      return comparePhotoThenNewest(a, b);
    });
  }
  if (sort === "open") {
    return list.sort((a, b) => {
      const byOpen = b.openSlots - a.openSlots;
      if (byOpen !== 0) return byOpen;
      return comparePhotoThenNewest(a, b);
    });
  }
  if (sort === "rating") {
    return list.sort((a, b) => {
      const byRating =
        b.rating - a.rating || b.reviewCount - a.reviewCount;
      if (byRating !== 0) return byRating;
      return comparePhotoThenNewest(a, b);
    });
  }
  if (sort === "newest") {
    return list.sort(comparePhotoThenNewest);
  }
  // relevance: photo first, then newest; with geo prefer nearer within that
  if (hasGeo) {
    return list.sort((a, b) => {
      const photoCmp = comparePhotoThenNewest(a, b);
      // Keep photo priority even with location
      const photoA = hasProfilePhoto(a) ? 1 : 0;
      const photoB = hasProfilePhoto(b) ? 1 : 0;
      if (photoA !== photoB) return photoB - photoA;
      return (a.distanceKm ?? Infinity) - (b.distanceKm ?? Infinity) || photoCmp;
    });
  }
  return list.sort(comparePhotoThenNewest);
}

/** Only meaningful once `phone` is available (accepted connection / demo). */
export function whatsappLink(
  teacher: Pick<Teacher, "name" | "subjectLine" | "phone">,
  subjectHint?: string,
): string {
  const subject = subjectHint || teacher.subjectLine;
  const text = `Hi ${teacher.name}, I found you on Mentr for ${subject} — are you available on weekends?`;
  return `https://wa.me/${teacher.phone ?? ""}?text=${encodeURIComponent(text)}`;
}
