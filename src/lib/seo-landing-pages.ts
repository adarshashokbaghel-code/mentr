/** SEO money-page configs — exact-match commercial landing pages. */

export type LandingGeo = "global" | "india" | "uae";

export type LandingFaq = { question: string; answer: string };

export type LandingSection = {
  heading: string;
  paragraphs: string[];
  bullets?: string[];
};

export type LandingPageConfig = {
  id: string;
  /** Base path without geo suffix, e.g. /find-online-tutors */
  basePath: string;
  geo: LandingGeo;
  title: string;
  metaDescription: string;
  keywords: string[];
  h1: string;
  eyebrow: string;
  intro: string;
  sections: LandingSection[];
  faqs: LandingFaq[];
  primaryCta: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
  relatedLinks: { label: string; href: string }[];
};

function geoPath(basePath: string, geo: LandingGeo): string {
  return geo === "global" ? basePath : `${basePath}/${geo}`;
}

const GLOBAL_ONLINE_SECTIONS: LandingSection[] = [
  {
    heading: "Why parents search for online tutors",
    paragraphs: [
      "Online tutoring removes commute time, opens a wider pool of subject experts, and fits families who move between cities or countries. Whether you need CBSE Maths for a child in Dubai, IGCSE Physics in London, or coding mentorship from India — the right tutor is often one video call away.",
      "Mentr lists verified tutors and mentors who teach online worldwide. Search by subject, read profiles with credentials and availability, and send a free connect request. WhatsApp unlocks only after the tutor accepts — no agency markup, no lead fees.",
    ],
  },
  {
    heading: "How to find online tutors on Mentr",
    paragraphs: ["Follow this flow to hire faster and avoid unverified WhatsApp forwards:"],
    bullets: [
      "Search by subject — Maths, Physics, English, Coding, exam prep, career mentoring",
      "Filter for verified profiles with ID and qualification checks",
      "Send a connect request with your class, board, and preferred timings",
      "Book a trial session before committing to a monthly package",
      "Arrange fees and schedule directly — Mentr takes zero commission",
    ],
  },
  {
    heading: "Subjects and levels covered online",
    paragraphs: [
      "Tutors on Mentr teach school subjects (CBSE, ICSE, IGCSE, IB), competitive exam prep (JEE, NEET), spoken English, and skill mentoring (programming, design, career guidance). Mention your curriculum and time zone in your first message so tutors can confirm fit.",
    ],
  },
];

const INDIA_ONLINE_SECTIONS: LandingSection[] = [
  {
    heading: "Find online tutors in India",
    paragraphs: [
      "Families in Bengaluru, Mumbai, Delhi, Hyderabad, and tier-2 cities use Mentr to find verified online tutors for CBSE, ICSE, and state boards — plus JEE, NEET, and coding mentorship. Sessions run over video in IST-friendly slots; many tutors also offer home visits in Bengaluru.",
    ],
    bullets: [
      "Typical fees: ₹500–₹1,500/hr school subjects; ₹1,000–₹2,500/hr JEE/NEET",
      "Browse Bengaluru area hubs: Koramangala, Indiranagar, Whitefield, HSR Layout",
      "Post a requirement and let verified tutors pitch you — free on Mentr",
    ],
  },
  {
    heading: "Online vs home tuition in India",
    paragraphs: [
      "Many Indian families mix formats — weekly home visits for tests and online doubt-clearing on weekdays. Mentr profiles show teaching mode (online, at your home, tutor's place) so you can filter before connecting.",
    ],
  },
];

const UAE_ONLINE_SECTIONS: LandingSection[] = [
  {
    heading: "Find online tutors in the UAE",
    paragraphs: [
      "Parents in Dubai, Abu Dhabi, Sharjah, and Ajman search for CBSE, IGCSE, and IB tutors who teach online in Gulf Standard Time evenings. Mentr connects you with verified tutors — many based in India with daily UAE student schedules.",
    ],
    bullets: [
      "Typical fees: AED 80–200/hr school subjects; AED 150–350/hr competitive prep",
      "Mention your emirate, school, and board in your connect message",
      "Trial one session before block booking — verify video quality and teaching style",
    ],
  },
  {
    heading: "Curricula UAE families search for",
    paragraphs: [
      "CBSE and ICSE dominate Indian curriculum schools in the Gulf. IGCSE and IB require tutors who explicitly list those boards. Competitive exam prep (JEE/NEET) while enrolled in UAE schools is common — search exam prep and maths/physics tutors with online mode.",
    ],
  },
];

function onlineTutorsConfig(geo: LandingGeo): LandingPageConfig {
  const path = geoPath("/find-online-tutors", geo);
  const geoTitles: Record<LandingGeo, { h1: string; title: string; desc: string }> = {
    global: {
      h1: "Find Online Tutors — Verified & Free to Connect",
      title: "Find Online Tutors — Verified, Free Worldwide",
      desc: "Find online tutors verified on Mentr — search by subject, connect free worldwide. CBSE, IGCSE, JEE, coding & more. No lead fees.",
    },
    india: {
      h1: "Find Online Tutors in India — Verified CBSE, ICSE & JEE",
      title: "Find Online Tutors in India — Verified & Free",
      desc: "Find tutors online in India — verified profiles for CBSE, ICSE, JEE, NEET across Bengaluru, Mumbai, Delhi. Free connect on Mentr.",
    },
    uae: {
      h1: "Find Online Tutors in the UAE — CBSE, IGCSE & IB",
      title: "Find Online Tutors UAE — Verified & Free",
      desc: "Find online tutors in Dubai, Abu Dhabi & UAE — verified CBSE, IGCSE, IB tutors. Free connect, no agency fees on Mentr.",
    },
  };
  const t = geoTitles[geo];
  const sections =
    geo === "india"
      ? INDIA_ONLINE_SECTIONS
      : geo === "uae"
        ? UAE_ONLINE_SECTIONS
        : GLOBAL_ONLINE_SECTIONS;

  return {
    id: `find-online-tutors-${geo}`,
    basePath: "/find-online-tutors",
    geo,
    title: t.title,
    metaDescription: t.desc,
    keywords: [
      "find online tutors",
      "find tutors online",
      geo === "india" ? "online tutors India" : "",
      geo === "uae" ? "online tutor UAE" : "",
      "verified online tutors",
      "free tutor platform",
    ].filter(Boolean),
    h1: t.h1,
    eyebrow: geo === "global" ? "Worldwide" : geo === "india" ? "India" : "UAE",
    intro:
      geo === "global"
        ? "Search verified online tutors for any subject — local or across time zones. Mentr is 100% free for parents: no lead fees, no commission. Send a connect request and chat on WhatsApp once the tutor accepts."
        : geo === "india"
          ? "Indian families use Mentr to find verified online tutors for every board and exam — without paying UrbanPro-style lead fees. Browse profiles, post a requirement, or connect directly."
          : "UAE parents find verified online tutors for CBSE, IGCSE, and IB on Mentr — free to search and connect. Mention your emirate and schedule in your first message.",
    sections,
    faqs: [
      {
        question: "Is Mentr free to find online tutors?",
        answer:
          "Yes. Parents search, send connect requests, and post requirements for free. Mentr never charges parents or takes commission from session fees.",
      },
      {
        question: "Are online tutors on Mentr verified?",
        answer:
          "Verified tutors pass ID and credential checks and display a Verified badge. Always run a trial session before long-term booking.",
      },
      {
        question: "Can I find tutors online in my time zone?",
        answer:
          "Yes. Profiles show availability slots and time zones. Mention your local evenings and weekends when you send a connect request.",
      },
      {
        question: "How do I contact a tutor after finding them online?",
        answer:
          "Send a connect request with a short message. The tutor reviews it and accepts or declines. Their WhatsApp number unlocks for you only after acceptance.",
      },
      {
        question: geo === "uae" ? "Can I hire an India-based tutor for UAE curriculum?" : "Do online tutors offer home visits too?",
        answer:
          geo === "uae"
            ? "Yes — many Indian tutors teach CBSE and IGCSE to UAE families daily in GST-friendly slots. Confirm board alignment in your trial session."
            : "Many Bengaluru tutors list both online and home-visit modes. Filter profiles by teaching mode before connecting.",
      },
    ],
    primaryCta: {
      label: geo === "india" ? "Search Bengaluru tutors" : "Find tutors free",
      href: geo === "india" ? "/search/bengaluru" : "/parent/signup",
    },
    secondaryCta: {
      label: "Find verified online tutors",
      href: geoPath("/find-verified-online-tutors", geo),
    },
    relatedLinks: [
      { label: "Verified online tutors", href: geoPath("/find-verified-online-tutors", geo) },
      { label: "Find mentors near me", href: geoPath("/find-mentors-near-me", geo) },
      { label: "How to find tutor online", href: "/blog/find-online-tutor-near-me" },
      ...(geo === "uae"
        ? [{ label: "UAE tutor guide", href: "/blog/find-tutor-online-uae" }]
        : []),
    ],
  };
}

function verifiedOnlineTutorsConfig(geo: LandingGeo): LandingPageConfig {
  const t: Record<LandingGeo, { h1: string; title: string; desc: string }> = {
    global: {
      h1: "Find Verified Online Tutors — ID-Checked Profiles",
      title: "Find Verified Online Tutors — Free on Mentr",
      desc: "Find online tutors verified with ID and credential checks. Browse trusted profiles worldwide — free connect, no lead fees on Mentr.",
    },
    india: {
      h1: "Find Verified Online Tutors in India",
      title: "Verified Online Tutors India — Free Search",
      desc: "Find verified online tutors in India — ID-checked profiles for CBSE, ICSE, JEE, NEET. Free to connect on Mentr.",
    },
    uae: {
      h1: "Find Verified Online Tutors in the UAE",
      title: "Verified Online Tutors UAE — Free Search",
      desc: "Find verified online tutors in UAE — credential-checked profiles for CBSE, IGCSE, IB. Free connect on Mentr.",
    },
  };
  const copy = t[geo];
  return {
    id: `find-verified-online-tutors-${geo}`,
    basePath: "/find-verified-online-tutors",
    geo,
    title: copy.title,
    metaDescription: copy.desc,
    keywords: [
      "find online tutors verified",
      "verified tutor online",
      "verified online tutors",
      geo === "india" ? "verified tutor India" : "",
      geo === "uae" ? "verified tutor UAE" : "",
    ].filter(Boolean),
    h1: copy.h1,
    eyebrow: "Trust & verification",
    intro:
      "Every parent wants a verified tutor online — not a WhatsApp forward with fake credentials. Mentr checks government ID and qualifications before issuing the Verified badge. Search profiles, send a connect request with your requirements, and unlock WhatsApp only after the tutor accepts.",
    sections: [
      {
        heading: "What verified means on Mentr",
        paragraphs: [
          "Verification confirms identity and documented qualifications — not teaching quality. Tutors submit ID, credentials aligned to listed subjects, and pass a consistency review. Profiles without verification are not published.",
        ],
        bullets: [
          "Government ID matched to profile name",
          "Qualification documents reviewed for listed subjects",
          "Verified badge visible on public profile",
          "You should still run a trial session before long-term hire",
        ],
      },
      {
        heading: "How to find online tutors verified on Mentr",
        paragraphs: [
          "Use Mentr search or browse subject hubs. Look for the Verified badge, read the bio and subjects, check availability in your time zone, and send a connect request explaining your child's class and board.",
        ],
      },
      {
        heading: "Safety tips for verified online tutoring",
        paragraphs: [
          "Keep early sessions on video with a parent nearby for children. Use platform connect requests before moving to personal channels. Never pay large advances to unverified contacts outside Mentr.",
        ],
      },
    ],
    faqs: [
      {
        question: "What does the Mentr Verified badge guarantee?",
        answer:
          "It confirms ID and credential review — not that the tutor is the best fit for your child. Always assess teaching style in a trial session.",
      },
      {
        question: "Can I find verified online tutors for free?",
        answer:
          "Yes. Searching and connecting on Mentr is free for parents. Tutors are not charged per lead.",
      },
      {
        question: "How is this different from UrbanPro verification?",
        answer:
          "Mentr is free to list and connect — no coins or per-lead fees. Verification is a gate to go live, not a paid badge.",
      },
      {
        question: "Are verified tutors available outside India?",
        answer:
          "Yes. Mentr supports worldwide online search. Many verified tutors teach UAE, UK, and US families over video.",
      },
    ],
    primaryCta: { label: "Browse verified tutors", href: "/search/bengaluru" },
    secondaryCta: { label: "How Mentr verifies tutors", href: "/blog/how-mentr-verifies-tutors" },
    relatedLinks: [
      { label: "Find online tutors", href: geoPath("/find-online-tutors", geo) },
      { label: "Tutor safety checklist", href: "/blog/tutor-safety-checklist-parents" },
      { label: "Verification guide", href: "/blog/how-to-find-verified-tutor-online" },
    ],
  };
}

function mentorsNearMeConfig(geo: LandingGeo): LandingPageConfig {
  const t: Record<LandingGeo, { h1: string; title: string; desc: string }> = {
    global: {
      h1: "Find Mentors Near Me — Local & Online, Free",
      title: "Find Mentors Near Me — Free on Mentr",
      desc: "Find mentors near me online or locally — career coaching, coding, skills & exam prep. Verified profiles, free connect worldwide.",
    },
    india: {
      h1: "Find Mentors Near Me in India",
      title: "Find Mentors Near Me India — Free Search",
      desc: "Find mentors near me in India — career, coding, JEE/NEET mentors in Bengaluru and online. Free verified search on Mentr.",
    },
    uae: {
      h1: "Find Mentors Near Me in the UAE",
      title: "Find Mentors Near Me UAE — Free Search",
      desc: "Find mentors near me in UAE — career, coding, and academic mentors online. Verified profiles, free connect on Mentr.",
    },
  };
  const copy = t[geo];
  return {
    id: `find-mentors-near-me-${geo}`,
    basePath: "/find-mentors-near-me",
    geo,
    title: copy.title,
    metaDescription: copy.desc,
    keywords: [
      "find mentors near me",
      "mentor near me",
      "find mentor online",
      geo === "india" ? "mentor India" : "",
      geo === "uae" ? "mentor UAE" : "",
    ].filter(Boolean),
    h1: copy.h1,
    eyebrow: "Career & skills",
    intro:
      "Whether you need a career mentor, coding coach, or exam-prep guide — 'near me' today means local OR online in your time zone. Mentr lists verified mentors you can connect with for free. Send a message, get accepted, then chat on WhatsApp.",
    sections: [
      {
        heading: "Mentor vs tutor — what you are searching for",
        paragraphs: [
          "Tutors cover syllabus and exams. Mentors guide careers, skills, and long-term decisions — coding portfolios, interview prep, entrepreneurship, or choosing a stream. Mentr lists both; filter by subject and read profiles carefully.",
        ],
      },
      {
        heading: "How to find mentors near me on Mentr",
        paragraphs: ["Search and connect in four steps:"],
        bullets: [
          "Search career mentoring, coding, or your subject area",
          "Open verified profiles — check experience and languages",
          "Send a connect request with a specific question or goal",
          "Book a trial conversation before committing monthly",
        ],
      },
      {
        heading: "Online mentors vs local mentors",
        paragraphs: [
          "Local mentors suit in-person career conversations; online mentors expand your pool globally. For programming, design, and interview prep, online mentors often deliver better specialist matches regardless of city.",
        ],
      },
    ],
    faqs: [
      {
        question: "Is finding mentors on Mentr free?",
        answer: "Yes for parents and students. Search, connect, and post requirements are free.",
      },
      {
        question: "Can I find coding mentors near me?",
        answer:
          "Yes. Search coding or computer science mentors with online mode — many teach students worldwide from India.",
      },
      {
        question: "What should I write in a mentor connect request?",
        answer:
          "State your goal in one paragraph — e.g. 'Class 12 student targeting JEE, need maths mentor for problem speed' or 'Switching to product design, need portfolio review'.",
      },
    ],
    primaryCta: { label: "Find mentors free", href: "/parent/signup" },
    secondaryCta: { label: "Programming mentors worldwide", href: "/blog/find-programming-mentor-worldwide" },
    relatedLinks: [
      { label: "Find online tutors", href: geoPath("/find-online-tutors", geo) },
      { label: "Career mentor guide", href: "/blog/how-to-find-career-mentor-free" },
      { label: "Programming mentors", href: "/find-mentors/programming" },
    ],
  };
}

export const ONLINE_TUTOR_JOBS_PAGE: LandingPageConfig = {
  id: "online-tutor-jobs",
  basePath: "/online-tutor-jobs",
  geo: "global",
  title: "Online Tutor Jobs — List Free, Keep 100%",
  metaDescription:
    "Find online tutor jobs on Mentr — list free, receive parent connect requests, pitch on the requirements board. No lead fees, keep 100% of fees.",
  keywords: [
    "online tutor jobs",
    "find online tutor job",
    "tutor jobs from home",
    "online teaching jobs",
    "tuition teacher registration free",
  ],
  h1: "Online Tutor Jobs — List Free on Mentr",
  eyebrow: "For tutors & mentors",
  intro:
    "Looking for online tutor jobs without paying for leads? Mentr lets you list free, get verified, receive parent connect requests, and pitch on the requirements board — you keep 100% of what you charge. No coins, no commission, ever.",
  sections: [
    {
      heading: "How online tutor jobs work on Mentr",
      paragraphs: [
        "Create a faculty profile with subjects, availability, and teaching modes (online, home visit). After verification, parents find you via search and SEO pages. They send connect requests with a message; you accept to share WhatsApp. You can also pitch on parent requirements posted to the board.",
      ],
      bullets: [
        "Free listing — no signup fee or monthly subscription",
        "Verified badge after ID and credential review",
        "Parents send connect requests — you review before sharing WhatsApp",
        "Requirements board — pitch on posts matching your subjects",
        "Profile views dashboard — see which parents viewed your listing",
      ],
    },
    {
      heading: "Who should list for online tutor jobs",
      paragraphs: [
        "School subject tutors (CBSE, ICSE, IGCSE), JEE/NEET mentors, coding instructors, spoken English coaches, and career mentors — anywhere in the world with stable internet. Bengaluru tutors can list home + online modes; global tutors can focus on online-only.",
      ],
    },
    {
      heading: "Mentr vs paid tutoring platforms",
      paragraphs: [
        "UrbanPro and similar platforms charge tutors per lead via credits. Mentr is free because parents and tutors deal directly — we do not take a cut of session fees. Your profile competes on quality, verification, and responsiveness, not on who paid for visibility.",
      ],
    },
  ],
  faqs: [
    {
      question: "Are online tutor jobs on Mentr really free?",
      answer: "Yes. Listing, receiving requests, and pitching on the board are free. Mentr takes no commission.",
    },
    {
      question: "How do I get students as an online tutor?",
      answer:
        "Complete your verified profile, keep availability updated, respond to connect requests quickly, and pitch on relevant parent requirements daily.",
    },
    {
      question: "Do I need to pay for leads?",
      answer: "No. Mentr never sells leads to tutors.",
    },
    {
      question: "Can I teach students outside India?",
      answer: "Yes. Set online mode and list languages and curricula you teach — UAE, UK, and US families search Mentr too.",
    },
  ],
  primaryCta: { label: "Create free tutor profile", href: "/faculty/signup" },
  secondaryCta: { label: "How to get tutoring students", href: "/blog/get-tutoring-students-free" },
  relatedLinks: [
    { label: "For faculty overview", href: "/for-faculty" },
    { label: "Become a home tutor", href: "/blog/how-to-become-a-home-tutor-india" },
    { label: "Write a great profile", href: "/blog/how-to-write-tutor-profile" },
  ],
};

export const MONEY_LANDING_PAGES: LandingPageConfig[] = [
  onlineTutorsConfig("global"),
  onlineTutorsConfig("india"),
  onlineTutorsConfig("uae"),
  verifiedOnlineTutorsConfig("global"),
  verifiedOnlineTutorsConfig("india"),
  verifiedOnlineTutorsConfig("uae"),
  mentorsNearMeConfig("global"),
  mentorsNearMeConfig("india"),
  mentorsNearMeConfig("uae"),
  ONLINE_TUTOR_JOBS_PAGE,
];

export function landingPagePath(config: LandingPageConfig): string {
  return geoPath(config.basePath, config.geo);
}

export function getLandingPage(
  basePath: string,
  geo: LandingGeo = "global",
): LandingPageConfig | undefined {
  return MONEY_LANDING_PAGES.find(
    (p) => p.basePath === basePath && p.geo === geo,
  );
}

export function landingPagesForBase(basePath: string): LandingPageConfig[] {
  return MONEY_LANDING_PAGES.filter((p) => p.basePath === basePath);
}
