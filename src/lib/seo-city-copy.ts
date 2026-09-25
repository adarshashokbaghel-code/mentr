/**
 * Unique-enough transactional copy for city × subject hub pages.
 * Keeps pages useful (not thin clones) without 500 spam variants.
 */

import type { SeoCitySlug } from "@/lib/seo-programmatic";

export type HubGuideSection = {
  heading: string;
  body: string;
};

export type CitySubjectGuide = {
  pricing: string;
  modes: string;
  verification: string;
  subjectFocus: string;
  sections: HubGuideSection[];
};

type CityMeta = {
  feeBand: string;
  boards: string;
  localNote: string;
  areasHint: string;
};

const CITY_META: Record<SeoCitySlug, CityMeta> = {
  bengaluru: {
    feeBand: "₹450–₹1,200/hr for school subjects; higher for JEE/NEET specialists",
    boards: "CBSE, ICSE, and Karnataka State Board",
    localNote:
      "Traffic shapes home visits — many families in Whitefield, HSR, Koramangala, and Indiranagar mix one home session with online doubt-clearing mid-week.",
    areasHint: "HSR, Koramangala, Indiranagar, Jayanagar, Whitefield, Electronic City",
  },
  hyderabad: {
    feeBand: "₹400–₹1,100/hr for boards; premium for IIT/NEET mentors",
    boards: "CBSE, ICSE, and Telangana State Board",
    localNote:
      "Gachibowli and Banjara Hills families often prefer online weekdays; weekend home visits for tests still work well.",
    areasHint: "Gachibowli, Banjara Hills, Madhapur, Secunderabad",
  },
  delhi: {
    feeBand: "₹500–₹1,400/hr across NCR; coaching-city rates run higher for Class 11–12",
    boards: "CBSE (dominant) plus some ICSE",
    localNote:
      "Delhi NCR parents often compare offline coaching with 1:1 tutors — a verified home or online mentor can fill gaps coaching batches miss.",
    areasHint: "South Delhi, Dwarka, Noida, Gurugram, Saket",
  },
  mumbai: {
    feeBand: "₹550–₹1,500/hr; travel time across suburbs can raise home-visit fees",
    boards: "CBSE, ICSE, and Maharashtra State Board (SSC/HSC)",
    localNote:
      "Andheri–Powai–Thane traffic makes online maths/science common on weekdays; home tutors still preferred for younger kids.",
    areasHint: "Andheri, Powai, Bandra, Thane, Navi Mumbai",
  },
  pune: {
    feeBand: "₹400–₹1,100/hr for school; competitive for Class 11–12 science",
    boards: "CBSE, ICSE, and Maharashtra State Board",
    localNote:
      "Baner, Kothrud, and Koregaon Park families often start online, then add home visits before boards.",
    areasHint: "Baner, Kothrud, Koregaon Park, Hinjewadi, PCMC",
  },
  chennai: {
    feeBand: "₹400–₹1,200/hr; strong demand for CBSE and State Board maths/science",
    boards: "CBSE, ICSE, and Tamil Nadu State Board",
    localNote:
      "Adyar, Anna Nagar, and OMR families use a mix of home tutors and online mentors — especially for Class 10–12.",
    areasHint: "Adyar, Anna Nagar, Velachery, OMR, T Nagar",
  },
  kolkata: {
    feeBand: "₹350–₹1,000/hr for school subjects; entrance mentors price higher",
    boards: "CBSE, ICSE, and West Bengal Board",
    localNote:
      "Salt Lake and South Kolkata parents often want patient board-focused tutors; online works well when schedules clash.",
    areasHint: "Salt Lake, Park Street, South Kolkata, Howrah",
  },
};

const SUBJECT_FOCUS: Record<string, string> = {
  Mathematics:
    "Look for tutors who diagnose concept gaps (fractions, algebra, calculus) instead of only finishing the textbook. Ask about weekly tests and board-pattern practice.",
  Physics:
    "Strong Physics tutors use diagrams, numericals, and past papers. For Class 11–12, confirm they cover theory + numericals — not just formula lists.",
  Chemistry:
    "Organic and physical chemistry need structured revision. Ask how they handle NCERT examples, numericals, and board marking style.",
  English:
    "For school English, prioritise writing practice and comprehension — not only grammar worksheets. Spoken English goals need a different weekly plan.",
  Coding:
    "Decide if you want school CS, Scratch/Python foundations, or project-based mentoring. Ages 8–14 need patience more than “advanced” claims.",
  Biology:
    "NEET and board Biology need diagrams and regular recall tests. Confirm whether the tutor follows NCERT line-by-line.",
  "Computer Science":
    "Ask which language and board practicals they cover (Python/Java). A trial on a small program beats a long bio.",
  History:
    "Good History tutors teach timelines and answer structure for boards — not only memorisation dumps.",
  Geography:
    "Map work and case-based questions matter for boards. Ask for a sample explanation of one chapter.",
  Economics:
    "Micro/macro clarity and past-year paper practice matter more than note-sharing alone.",
  Accountancy:
    "Partnership and company accounts need worked examples. Prefer tutors who set weekly ledger practice.",
};

function subjectBlurb(subject: string): string {
  return (
    SUBJECT_FOCUS[subject] ||
    `Compare ${subject} profiles for class level, board experience, and teaching mode before you connect.`
  );
}

export function citySubjectGuide(
  citySlug: SeoCitySlug,
  subject: string,
  cityName: string,
  local: boolean,
): CitySubjectGuide {
  const meta = CITY_META[citySlug];
  const focus = subjectBlurb(subject);

  return {
    pricing: local
      ? `In ${cityName}, ${subject.toLowerCase()} tutors typically charge ${meta.feeBand}. Shared ₹/hr on profiles is indicative — confirm board, hours, and home vs online on WhatsApp after connect. Mentr takes no commission.`
      : `${subject} tutors serving ${cityName} families usually quote ${meta.feeBand} for online sessions. Home visits (where offered) may add travel. Fees stay between you and the tutor — Mentr is ₹0 for parents.`,
    modes: local
      ? `Filter for Online, student's home, or tutor's home. ${meta.localNote}`
      : `Most ${cityName} listings emphasise online ${subject.toLowerCase()} sessions that fit your time zone. Where home visits exist, profiles show the mode clearly so you can choose before connecting.`,
    verification:
      "Verified tutors on Mentr complete identity and credential checks. Look for the Verified badge, a clear bio, subjects/classes taught, and open slots. WhatsApp unlocks only after the tutor accepts your connect request — numbers stay private until both sides agree.",
    subjectFocus: focus,
    sections: [
      {
        heading: `Finding a ${subject} tutor in ${cityName}`,
        body: local
          ? `Parents searching “${subject.toLowerCase()} tutor in ${cityName}” usually care about ${meta.boards}, after-school timing, and whether the tutor can come to ${meta.areasHint} — or teach online when traffic is bad. On Mentr you browse verified profiles for free, then send a short connect request describing class, board, and the chapters that need help.`
          : `${cityName} families often need an Indian-curriculum ${subject} tutor online — ${meta.boards}. Start on Mentr’s free parent search, shortlist 3–5 verified profiles, and ask about trial sessions before any monthly package.`,
      },
      {
        heading: "Online vs home tuition",
        body: `Online works well for doubt-clearing and Class 9–12 revision when schedules are tight. Home visits help younger kids and exam-week discipline. Many ${cityName} families mix both. Pick a mode on each profile — then use Find a Tutor or Get Matched Instantly if you need someone this week.`,
      },
      {
        heading: "What to check before you hire",
        body: `${focus} Also confirm weekly hours, fee for a trial, and how they report progress to parents. If nothing fits, post a requirement or use Instant Connect — still free for parents, with no agency fee.`,
      },
    ],
  };
}

export function cityGuide(citySlug: SeoCitySlug, cityName: string, local: boolean) {
  const meta = CITY_META[citySlug];
  return {
    pricing: `Typical private tutor fees in ${cityName}: ${meta.feeBand}. Always confirm on a trial. Mentr never takes a cut.`,
    modes: local
      ? meta.localNote
      : `Online tutors who work with ${cityName} families are listed first; home options appear when tutors offer visits.`,
    verification:
      "Every connect stays private until accept. Verified badges mean ID/credential checks — not a guarantee of chemistry with your child, so always trial.",
    sections: [
      {
        heading: `How to find a tutor in ${cityName}`,
        body: `Write down subject, class, board (${meta.boards}), and home vs online. Browse verified tutors on Mentr, compare fees and open slots, then connect free — or get matched instantly if you are short on time.`,
      },
    ] as HubGuideSection[],
  };
}
