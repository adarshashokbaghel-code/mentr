/**
 * Demo personas for seed data and marketing testimonials.
 * Seeded into MongoDB via `npm run seed:demo`.
 */

export type DemoParent = {
  email: string;
  name: string;
  phoneNumber: string;
  city: string;
  area: string;
  initials: string;
};

export type DemoMentor = {
  email: string;
  name: string;
  designation: "Coach" | "Trainer";
  phoneNumber: string;
  bio: string;
  subjects: string[];
  city: string;
  area: string;
  levels: string[];
  languages: string[];
  qualification: string;
  experienceYears: number;
  teachingModes: ("online" | "student_home" | "tutor_home")[];
  gender: "male" | "female";
  workplace: string;
  certifications: string[];
  achievements: string[];
  availability: {
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
  }[];
  initials: string;
  subjectLine: string;
};

export type DemoRequirement = {
  parentEmail: string;
  subject: string;
  classLevel: string;
  area: string;
  modes: ("online" | "student_home" | "tutor_home")[];
  budgetMin: number;
  budgetMax: number;
  details: string;
  startTimeline: "immediately" | "within_week" | "within_month" | "flexible";
  interestCount: number;
  postedHoursAgo: number;
};

export const DEMO_SEED_PHONE = "9559878565";

export const DEMO_PARENTS: DemoParent[] = [
  {
    email: "demo-parent-lakshmi@mentr.local",
    name: "Lakshmi Venkatesh",
    phoneNumber: "9845012341",
    city: "Bengaluru",
    area: "Jayanagar",
    initials: "LV",
  },
  {
    email: "demo-parent-rajesh@mentr.local",
    name: "Rajesh Nair",
    phoneNumber: "9876543210",
    city: "Bengaluru",
    area: "Koramangala",
    initials: "RN",
  },
  {
    email: "demo-parent-deepa@mentr.local",
    name: "Deepa Reddy",
    phoneNumber: "9988776655",
    city: "Bengaluru",
    area: "HSR Layout",
    initials: "DR",
  },
  {
    email: "demo-parent-arun@mentr.local",
    name: "Arun Menon",
    phoneNumber: "9123456780",
    city: "Bengaluru",
    area: "Indiranagar",
    initials: "AM",
  },
  {
    email: "demo-parent-kavitha@mentr.local",
    name: "Kavitha Iyer",
    phoneNumber: "9445566778",
    city: "Bengaluru",
    area: "Whitefield",
    initials: "KI",
  },
  {
    email: "demo-parent-farhan@mentr.local",
    name: "Mohammed Farhan",
    phoneNumber: "9112233445",
    city: "Bengaluru",
    area: "Malleshwaram",
    initials: "MF",
  },
];

export const DEMO_MENTORS: DemoMentor[] = [
  {
    email: "demo-mentor-suresh@mentr.local",
    name: "Dr. Suresh Pillai",
    designation: "Coach",
    phoneNumber: DEMO_SEED_PHONE,
    bio: "I help Class 11–12 students and young graduates choose the right career path — engineering, medicine, design, or entrepreneurship. Sessions focus on clarity, not pressure. Parents join the first call so everyone is aligned.",
    subjects: ["Career Guidance", "Exam Prep"],
    city: "Bengaluru",
    area: "Koramangala",
    levels: ["Class 11–12", "College"],
    languages: ["English", "Hindi", "Malayalam"],
    qualification: "Ph.D. Education · IIM Bangalore executive programme",
    experienceYears: 14,
    teachingModes: ["online", "student_home"],
    gender: "male",
    workplace: "Former HR director at Infosys; independent career coach since 2018",
    certifications: [
      "Certified Career Coach (NCDA)",
      "JEE & NEET counselling specialist",
    ],
    achievements: [
      "400+ students placed in IIT, NIT, and top medical colleges",
      "Regular speaker at Bengaluru school career fairs",
    ],
    availability: [
      { day: "tuesday", start: "17:00", end: "19:00" },
      { day: "saturday", start: "10:00", end: "12:00" },
      { day: "sunday", start: "16:00", end: "18:00" },
    ],
    initials: "SP",
    subjectLine: "Career Guidance & Exam Prep",
  },
  {
    email: "demo-mentor-neha@mentr.local",
    name: "Neha Banerjee",
    designation: "Trainer",
    phoneNumber: DEMO_SEED_PHONE,
    bio: "Spoken English, interview prep, and presentation skills for teens and college students. I work with shy learners — building confidence through practice conversations, not grammar drills. Most of my students are CBSE Class 9–12 or first-year undergrads.",
    subjects: ["English", "Career Mentoring"],
    city: "Bengaluru",
    area: "Indiranagar",
    levels: ["Class 9–10", "Class 11–12", "College"],
    languages: ["English", "Hindi", "Bengali"],
    qualification: "M.A. English Literature · British Council TEFL",
    experienceYears: 9,
    teachingModes: ["online", "tutor_home"],
    gender: "female",
    workplace: "Freelance communication trainer; former corporate L&D at Wipro",
    certifications: ["British Council TEFL", "Soft-skills facilitator ( Dale Carnegie )"],
    achievements: [
      "Helped 120+ students improve board English scores by 15+ marks",
      "Campus placement interview prep for 3 engineering colleges",
    ],
    availability: [
      { day: "monday", start: "18:00", end: "20:00" },
      { day: "wednesday", start: "18:00", end: "20:00" },
      { day: "friday", start: "17:00", end: "19:00" },
    ],
    initials: "NB",
    subjectLine: "English & Communication",
  },
  {
    email: "demo-mentor-vikram@mentr.local",
    name: "Prof. Vikram Deshmukh",
    designation: "Coach",
    phoneNumber: DEMO_SEED_PHONE,
    bio: "Mathematics and Physics mentorship for JEE Main and board exams. I don't run a coaching factory — max 8 active students so each one gets weekly problem-solving reviews. Strong on mechanics, calculus, and exam temperament.",
    subjects: ["Mathematics", "Physics", "Exam Prep"],
    city: "Bengaluru",
    area: "Jayanagar",
    levels: ["Class 11–12", "JEE / NEET"],
    languages: ["English", "Hindi", "Marathi"],
    qualification: "M.Tech IIT Madras · B.Ed",
    experienceYears: 11,
    teachingModes: ["online", "student_home"],
    gender: "male",
    workplace: "Independent JEE mentor; previously faculty at BASE Educational Services",
    certifications: ["IIT Madras alumnus mentor network", "Advanced Physics Olympiad trainer"],
    achievements: [
      "32 JEE Main ranks under 10,000 in the last five years",
      "Authored practice problem sets used by two Bengaluru coaching centres",
    ],
    availability: [
      { day: "tuesday", start: "16:00", end: "18:00" },
      { day: "thursday", start: "16:00", end: "18:00" },
      { day: "saturday", start: "14:00", end: "17:00" },
    ],
    initials: "VD",
    subjectLine: "Mathematics & Physics · JEE",
  },
];

export const DEMO_REQUIREMENTS: DemoRequirement[] = [
  {
    parentEmail: "demo-parent-lakshmi@mentr.local",
    subject: "Mathematics",
    classLevel: "Class 6–8",
    area: "Jayanagar",
    modes: ["student_home", "online"],
    budgetMin: 450,
    budgetMax: 650,
    details:
      "My son is in Class 7 (CBSE) and keeps losing marks in algebra word problems. Need a patient tutor who can visit twice a week — evenings after 6 PM work best. We live near 4th Block Jayanagar.",
    startTimeline: "immediately",
    interestCount: 2,
    postedHoursAgo: 3,
  },
  {
    parentEmail: "demo-parent-rajesh@mentr.local",
    subject: "Physics",
    classLevel: "Class 11–12",
    area: "Koramangala",
    modes: ["online"],
    budgetMin: 700,
    budgetMax: 900,
    details:
      "Daughter in Class 11, targeting JEE 2027. Mechanics and rotational motion are weak areas. Prefer online classes on weekdays after 5:30 PM. Someone who sets weekly tests would be ideal.",
    startTimeline: "within_week",
    interestCount: 1,
    postedHoursAgo: 8,
  },
  {
    parentEmail: "demo-parent-deepa@mentr.local",
    subject: "English",
    classLevel: "Class 9–10",
    area: "HSR Layout",
    modes: ["student_home"],
    budgetMin: 500,
    budgetMax: 700,
    details:
      "Class 10 board prep — writing sections and literature answers need work. Looking for a tutor who can come home near HSR Sector 2, twice a week. My daughter is introverted; needs encouragement, not harsh correction.",
    startTimeline: "flexible",
    interestCount: 3,
    postedHoursAgo: 14,
  },
  {
    parentEmail: "demo-parent-arun@mentr.local",
    subject: "Coding",
    classLevel: "Class 6–8",
    area: "Indiranagar",
    modes: ["online", "tutor_home"],
    budgetMin: 600,
    budgetMax: 800,
    details:
      "12-year-old finished Scratch on his own and wants to learn Python. Project-based sessions preferred — build small games or apps, not long lectures. Online is fine; open to Indiranagar tutor's place on Saturday mornings.",
    startTimeline: "within_month",
    interestCount: 0,
    postedHoursAgo: 22,
  },
];

/** Fallback when a testimonial has no DB match — prefer hiding the label over showing this. */
export const PLACEHOLDER_USER = "Unknown user";
export const PLACEHOLDER_INITIAL = "U";

export function testimonialName(name?: string | null): string {
  const trimmed = name?.trim();
  return trimmed || "";
}

export function testimonialInitial(name?: string | null): string {
  const trimmed = name?.trim();
  if (!trimmed) return PLACEHOLDER_INITIAL;
  const parts = trimmed.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return parts[0].slice(0, 2).toUpperCase();
}

export type TestimonialItem = {
  quote: string;
  role: string;
  tint: string;
  /** Optional — when set, avatar + label use the real DB name */
  name?: string;
  /** Match a parent in the DB by area, e.g. "Jayanagar" */
  parentArea?: string;
  /** Match a faculty member in the DB by email */
  facultyEmail?: string;
};

export const HOME_TESTIMONIALS: TestimonialItem[] = [
  {
    quote:
      "Posted our Class 7 maths requirement and got two pitches the same evening. Connected on WhatsApp after the tutor accepted — no agent in between.",
    role: "Parent · Jayanagar",
    tint: "bg-lavender",
    parentArea: "Jayanagar",
  },
  {
    quote:
      "Listed as a career coach and parents started reaching out within days. I keep every rupee — the dashboard for open slots is all I need.",
    role: "Faculty · Career guidance",
    tint: "bg-butter",
    facultyEmail: "demo-mentor-suresh@mentr.local",
  },
  {
    quote:
      "As a JEE mentor I don't want a platform taking a cut. Mentr lists me, serious parents send connect requests, and we move to WhatsApp once I accept.",
    role: "Mentor · Exam prep",
    tint: "bg-sage-wash",
    facultyEmail: "demo-mentor-vikram@mentr.local",
  },
];

export const PARENT_LP_TESTIMONIALS: TestimonialItem[] = [
  {
    quote:
      "Found a Class 10 English tutor in one evening. Sent a connect request, they accepted, and we started the same week on WhatsApp. Zero fees.",
    role: "Parent · HSR Layout",
    tint: "bg-lavender",
    parentArea: "HSR Layout",
  },
  {
    quote:
      "Posted our requirement for physics prep. Two tutors pitched within a day. Picked one, connected, and arranged fees directly.",
    role: "Parent · Koramangala",
    tint: "bg-butter",
    parentArea: "Koramangala",
  },
  {
    quote:
      "I was tired of lead platforms gating contact. Mentr let me search, read profiles, and send a connect request myself. Completely free.",
    role: "Parent · Whitefield",
    tint: "bg-sage-wash",
    parentArea: "Whitefield",
  },
];

export const FACULTY_LP_TESTIMONIALS: TestimonialItem[] = [
  {
    quote:
      "I was spending on lead coins elsewhere for parents who never replied. On Mentr I listed free and started getting connect requests within a week. I keep every rupee.",
    role: "Faculty · JEE prep",
    tint: "bg-cream-band",
    facultyEmail: "demo-mentor-vikram@mentr.local",
  },
  {
    quote:
      "The requirements board lets parents post what they need and I pitch. If they accept, we're connected — no agency taking a share of my fees.",
    role: "Faculty · English",
    tint: "bg-lavender",
    facultyEmail: "demo-mentor-neha@mentr.local",
  },
  {
    quote:
      "Simple dashboard, toggle slots after WhatsApp bookings, and only serious parents reach out through connect requests.",
    role: "Faculty · Career guidance",
    tint: "bg-sage-wash",
    facultyEmail: "demo-mentor-suresh@mentr.local",
  },
];

export const PARENT_AUTH_TESTIMONIALS: TestimonialItem[] = [
  {
    quote:
      "Found a physics tutor nearby and sent a connect request the same evening. Once they accepted, we arranged classes on WhatsApp.",
    role: "Parent · Koramangala",
    tint: "bg-lavender",
    parentArea: "Koramangala",
  },
  {
    quote:
      "No middlemen, no lead fees baked into the rate. We talk directly and agree on everything.",
    role: "Parent · Indiranagar",
    tint: "bg-butter",
    parentArea: "Indiranagar",
  },
  {
    quote:
      "The open-slots view is honest. If someone is booked, I just pick the next tutor nearby.",
    role: "Parent · HSR Layout",
    tint: "bg-sage-wash",
    parentArea: "HSR Layout",
  },
];

export const FACULTY_AUTH_TESTIMONIALS: TestimonialItem[] = [
  {
    quote:
      "Listed my slots in a few minutes. Parents reach out after I accept their request — I keep what I earn.",
    role: "Faculty · Career guidance",
    tint: "bg-cream-band",
    facultyEmail: "demo-mentor-suresh@mentr.local",
  },
  {
    quote:
      "I left platforms that charged for leads. Here parents find me and we connect on WhatsApp directly.",
    role: "Faculty · English",
    tint: "bg-lavender",
    facultyEmail: "demo-mentor-neha@mentr.local",
  },
  {
    quote:
      "Dashboard is basic in a good way — open or taken. That's all I need.",
    role: "Faculty · Exam prep",
    tint: "bg-butter",
    facultyEmail: "demo-mentor-vikram@mentr.local",
  },
];
