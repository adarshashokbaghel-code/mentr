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
  /** tutor | mentor */
  kind: "tutor" | "mentor";
  /** True for real faculty loaded from the database */
  live?: boolean;
}

export const SUBJECTS = [
  "Mathematics",
  "Physics",
  "Chemistry",
  "English",
  "Computer Science",
  "Coding",
  "Biology",
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

/** Languages offered in the search Language filter */
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

export const TEACHERS: Teacher[] = [
  {
    id: "aris-smith",
    name: "Dr. Aris Smith",
    initials: "AS",
    imageUrl:
      "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=640&q=80",
    subjects: ["Mathematics", "Physics", "Exam Prep"],
    subjectLine: "Mathematics & Physics",
    experienceYears: 12,
    rating: 4.9,
    reviewCount: 48,
    openSlots: 3,
    designation: "Senior Mentor",
    area: "Koramangala, Bengaluru",
    locality: "Koramangala",
    lat: 12.9352,
    lng: 77.6245,
    bio: "I help Class 8–12 students build strong foundations in Maths and Physics — board exams and entrance prep. Sessions are flexible; we decide timing together.",
    levels: "Class 8–12 · Exam prep",
    modes: ["online", "student_home"],
    languages: ["English", "Hindi"],
    slots: [
      { label: "Mon 4–6 PM", available: true },
      { label: "Wed 5–7 PM", available: false },
      { label: "Sat 10–12", available: true },
      { label: "Sun 3–5 PM", available: true },
    ],
    phone: "919876543210",
    verified: true,
    kind: "mentor",
  },
  {
    id: "meera-kapoor",
    name: "Prof. Meera Kapoor",
    initials: "MK",
    imageUrl:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=640&q=80",
    subjects: ["English", "Career Mentoring"],
    subjectLine: "English & Creative Writing",
    experienceYears: 8,
    rating: 4.8,
    reviewCount: 36,
    openSlots: 1,
    designation: "Associate Faculty",
    area: "Indiranagar, Bengaluru",
    locality: "Indiranagar",
    lat: 12.9784,
    lng: 77.6408,
    bio: "Spoken English, writing, and career guidance for teens. Warm sessions focused on confidence and clarity.",
    levels: "Class 6–12 · Spoken English",
    modes: ["online"],
    languages: ["English"],
    slots: [
      { label: "Tue 6–8 PM", available: true },
      { label: "Thu 6–8 PM", available: false },
    ],
    phone: "919812345678",
    verified: true,
    kind: "mentor",
  },
  {
    id: "rajesh-verma",
    name: "Rajesh Verma",
    initials: "RV",
    imageUrl:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=640&q=80",
    subjects: ["Computer Science", "Coding"],
    subjectLine: "Computer Science & Coding",
    experienceYears: 6,
    rating: 4.6,
    reviewCount: 22,
    openSlots: 0,
    designation: "Industry Mentor",
    area: "HSR Layout, Bengaluru",
    locality: "HSR Layout",
    lat: 12.9116,
    lng: 77.6473,
    bio: "Python, web basics, and school CS for beginners. Fully booked this week — openings soon.",
    levels: "Class 9–12 · Beginners",
    modes: ["online", "tutor_home"],
    languages: ["English", "Hindi"],
    slots: [
      { label: "Mon 7–9 PM", available: false },
      { label: "Sat 11–1", available: false },
    ],
    phone: "919900112233",
    verified: false,
    kind: "tutor",
  },
  {
    id: "anita-desai",
    name: "Anita Desai",
    initials: "AD",
    imageUrl:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=640&q=80",
    subjects: ["Chemistry", "Exam Prep"],
    subjectLine: "Chemistry · Board & JEE",
    experienceYears: 10,
    rating: 4.9,
    reviewCount: 41,
    openSlots: 2,
    designation: "Faculty",
    area: "Jayanagar, Bengaluru",
    locality: "Jayanagar",
    lat: 12.9308,
    lng: 77.5838,
    bio: "Organic and physical chemistry for Class 11–12. Concept-first, then practice papers.",
    levels: "Class 11–12 · JEE / Boards",
    modes: ["student_home", "tutor_home"],
    languages: ["English", "Hindi"],
    slots: [
      { label: "Fri 5–7 PM", available: true },
      { label: "Sun 10–12", available: true },
    ],
    phone: "919955667788",
    verified: true,
    kind: "tutor",
  },
  {
    id: "vikram-singh",
    name: "Vikram Singh",
    initials: "VS",
    imageUrl:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=640&q=80",
    subjects: ["Mathematics", "Exam Prep"],
    subjectLine: "Mathematics · Class 10",
    experienceYears: 15,
    rating: 4.7,
    reviewCount: 63,
    openSlots: 4,
    designation: "Tutor",
    area: "Whitefield, Bengaluru",
    locality: "Whitefield",
    lat: 12.9698,
    lng: 77.75,
    bio: "Patient Class 10 Maths tutor. Algebra, geometry, and board-style problems.",
    levels: "Class 9–10",
    modes: ["student_home"],
    languages: ["English", "Kannada"],
    slots: [
      { label: "Mon–Fri 4–5 PM", available: true },
      { label: "Sat 9–11", available: true },
    ],
    phone: "919933221100",
    verified: true,
    kind: "tutor",
  },
  {
    id: "priya-nair",
    name: "Priya Nair",
    initials: "PN",
    imageUrl:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=640&q=80",
    subjects: ["Biology", "Exam Prep"],
    subjectLine: "Biology · NEET foundation",
    experienceYears: 7,
    rating: 4.8,
    reviewCount: 29,
    openSlots: 2,
    designation: "Mentor",
    area: "Malleshwaram, Bengaluru",
    locality: "Malleshwaram",
    lat: 13.0035,
    lng: 77.5645,
    bio: "NEET foundation and school Biology. Clear diagrams, weekly tests, and doubt clearing.",
    levels: "Class 11–12 · NEET",
    modes: ["online"],
    languages: ["English", "Tamil"],
    slots: [
      { label: "Wed 6–8 PM", available: true },
      { label: "Sat 4–6 PM", available: true },
    ],
    phone: "919944556677",
    verified: true,
    kind: "mentor",
  },
  {
    id: "kabir-menon",
    name: "Kabir Menon",
    initials: "KM",
    imageUrl:
      "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=640&q=80",
    subjects: ["Physics", "Exam Prep"],
    subjectLine: "Physics · JEE mains",
    experienceYears: 9,
    rating: 4.7,
    reviewCount: 33,
    openSlots: 2,
    designation: "Tutor",
    area: "HSR Layout, Bengaluru",
    locality: "HSR Layout",
    lat: 12.9141,
    lng: 77.642,
    bio: "JEE and board Physics with problem drills. Weekend intensives available.",
    levels: "Class 11–12 · JEE",
    modes: ["online", "student_home"],
    languages: ["English", "Hindi"],
    slots: [
      { label: "Sat 2–4 PM", available: true },
      { label: "Sun 5–7 PM", available: true },
    ],
    phone: "919911223344",
    verified: true,
    kind: "tutor",
  },
  {
    id: "sara-joseph",
    name: "Sara Joseph",
    initials: "SJ",
    imageUrl:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=640&q=80",
    subjects: ["English", "Music"],
    subjectLine: "English & Music basics",
    experienceYears: 5,
    rating: 4.9,
    reviewCount: 19,
    openSlots: 3,
    designation: "Mentor",
    area: "Indiranagar, Bengaluru",
    locality: "Indiranagar",
    lat: 12.9718,
    lng: 77.6412,
    bio: "Reading fluency, school English, and beginner piano for younger kids.",
    levels: "Class 3–8",
    modes: ["student_home"],
    languages: ["English", "Kannada", "Hindi"],
    slots: [
      { label: "Mon 5–6 PM", available: true },
      { label: "Thu 5–6 PM", available: true },
      { label: "Sat 11–12", available: true },
    ],
    phone: "919922334455",
    verified: true,
    kind: "mentor",
  },
  {
    id: "arjun-rao",
    name: "Arjun Rao",
    initials: "AR",
    imageUrl:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=640&q=80",
    subjects: ["Coding", "Computer Science"],
    subjectLine: "Coding for beginners",
    experienceYears: 4,
    rating: 4.5,
    reviewCount: 14,
    openSlots: 5,
    designation: "Tutor",
    area: "Whitefield, Bengaluru",
    locality: "Whitefield",
    lat: 12.972,
    lng: 77.748,
    bio: "Scratch to Python for school kids. Project-based sessions, no lectures.",
    levels: "Class 6–10",
    modes: ["tutor_home"],
    languages: ["English", "Telugu"],
    slots: [
      { label: "Tue 6–7 PM", available: true },
      { label: "Fri 6–7 PM", available: true },
      { label: "Sun 10–12", available: true },
    ],
    phone: "919933445566",
    verified: false,
    kind: "tutor",
  },
  {
    id: "neha-iyer",
    name: "Neha Iyer",
    initials: "NI",
    imageUrl:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=640&q=80",
    subjects: ["Economics", "Exam Prep"],
    subjectLine: "Economics · Class 12",
    experienceYears: 11,
    rating: 4.8,
    reviewCount: 27,
    openSlots: 1,
    designation: "Faculty",
    area: "Jayanagar, Bengaluru",
    locality: "Jayanagar",
    lat: 12.928,
    lng: 77.586,
    bio: "Macro/micro for CBSE and ISC. Case studies and board answer writing.",
    levels: "Class 11–12",
    modes: ["online"],
    languages: ["English", "Hindi"],
    slots: [
      { label: "Wed 4–6 PM", available: true },
      { label: "Sat 3–5 PM", available: false },
    ],
    phone: "919944556688",
    verified: true,
    kind: "tutor",
  },
];

export type SearchSort =
  | "relevance"
  | "open"
  | "experience"
  | "rating"
  | "distance";

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

/** Real faculty with completed profiles, straight from the database. */
export async function fetchLiveTeachers(): Promise<Teacher[]> {
  try {
    const res = await fetch("/api/teachers", { cache: "no-store" });
    if (!res.ok) return [];
    const data = (await res.json()) as { teachers: ApiTeacher[] };
    return (data.teachers || []).map(fromApiTeacher);
  } catch {
    return [];
  }
}

export function searchTeachers(opts: {
  subject?: string;
  locality?: string;
  onlyOpen?: boolean;
  onlyVerified?: boolean;
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
  /** Base list to search; defaults to demo teachers */
  teachers?: Teacher[];
}): (Teacher & { distanceKm?: number })[] {
  let list: (Teacher & { distanceKm?: number })[] = [
    ...(opts.teachers ?? TEACHERS),
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
      // Teachers without coordinates (new live profiles) stay in the list
      list = list.filter(
        (t) => t.distanceKm == null || t.distanceKm <= opts.radiusKm!,
      );
    }
  }

  const sort = opts.sort || "relevance";
  if (sort === "distance" && hasGeo) {
    return list.sort(
      (a, b) => (a.distanceKm ?? Infinity) - (b.distanceKm ?? Infinity),
    );
  }
  if (sort === "experience") {
    return list.sort((a, b) => b.experienceYears - a.experienceYears);
  }
  if (sort === "open") {
    return list.sort((a, b) => b.openSlots - a.openSlots);
  }
  if (sort === "rating") {
    return list.sort(
      (a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount,
    );
  }
  // relevance: if geo available, prefer nearer; else open/rating
  if (hasGeo) {
    return list.sort((a, b) => {
      if (a.openSlots === 0 && b.openSlots > 0) return 1;
      if (b.openSlots === 0 && a.openSlots > 0) return -1;
      return (a.distanceKm ?? Infinity) - (b.distanceKm ?? Infinity);
    });
  }
  return list.sort((a, b) => {
    if (a.openSlots === 0 && b.openSlots > 0) return 1;
    if (b.openSlots === 0 && a.openSlots > 0) return -1;
    if (a.rating !== b.rating) return b.rating - a.rating;
    if (a.verified !== b.verified) return a.verified ? -1 : 1;
    return b.experienceYears - a.experienceYears;
  });
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
