import type { ArticleContent } from "./types";

function cityCostArticle(opts: {
  slug: string;
  city: string;
  stateHint: string;
  ranges: { band: string; fee: string }[];
  searchHref: string;
  notes: string[];
}): ArticleContent {
  const { slug, city, stateHint, ranges, searchHref, notes } = opts;
  return {
    slug,
    publishedAt: "2026-09-16",
    updatedAt: "2026-09-16",
    readTimeMinutes: 7,
    author: "Mentr Editorial Team",
    intro: `Parents in ${city} ask the same first question before hiring: how much does a home tutor cost in 2026? Fees vary by class, subject, board, and whether you want home visits or online sessions. This guide gives practical ${city} ranges (${stateHint}) so you can budget — then find verified tutors on Mentr without agency commissions.`,
    sections: [
      {
        heading: `Home tutor fees in ${city} (2026)`,
        blocks: [
          {
            type: "paragraph",
            text: `These are typical one-on-one rates parents report in ${city}. Group tuition and online-only sessions are often 15–25% lower. Competitive exam mentors (JEE/NEET) sit at the top of each band.`,
          },
          {
            type: "list",
            items: ranges.map((r) => `${r.band}: ${r.fee}`),
          },
          {
            type: "callout",
            title: "Skip the agency markup",
            text: `Local bureaus in ${city} often add one month’s fee or 15–30% ongoing commission. On Mentr you compare verified profiles and pay the tutor directly — ₹0 platform fee.`,
          },
        ],
      },
      {
        heading: `What drives price in ${city}`,
        blocks: [
          {
            type: "list",
            items: notes,
          },
          {
            type: "paragraph",
            text: `Ask for board experience (CBSE / ICSE / state), travel radius, and a trial session before locking a monthly package. Write your weak chapters and preferred days in the requirement so pitches stay relevant.`,
          },
        ],
      },
      {
        heading: `How to hire a tutor in ${city} on Mentr`,
        blocks: [
          {
            type: "list",
            ordered: true,
            items: [
              `Open search for ${city} and filter by subject + class.`,
              "Shortlist 2–3 verified tutors in your fee band.",
              "Post a requirement or message — connect on WhatsApp after they accept.",
              "Book a trial, then agree fees and schedule directly.",
            ],
          },
          {
            type: "paragraph",
            text: `Start here: ${searchHref.replace(/^\//, "mentr.in/")} — free for parents, free for tutors to list.`,
          },
        ],
      },
    ],
    faqs: [
      {
        question: `How much is a Class 10 home tutor in ${city}?`,
        answer: `Most families pay in the mid band of this guide for Class 9–10 board prep. Exact rates depend on subject, board, and home vs online. Compare verified profiles on Mentr before you commit.`,
      },
      {
        question: `Is online cheaper than home tuition in ${city}?`,
        answer:
          "Often yes — typically 15–25% less when travel is removed. Many tutors offer a hybrid: weekly online drills plus occasional home visits before exams.",
      },
      {
        question: "Do I pay Mentr a commission?",
        answer:
          "No. Mentr does not take a cut of tuition fees. Parents and tutors connect directly after verification.",
      },
    ],
    relatedLinks: [
      { label: "Home tutor cost Bengaluru", href: "/blog/home-tutor-cost-bengaluru" },
      { label: "Best free tutor platforms India", href: "/blog/best-free-tutor-platforms-india" },
      { label: "UrbanPro alternatives", href: "/blog/urbanpro-alternatives" },
      { label: `Search tutors in ${city}`, href: searchHref },
    ],
  };
}

/** SEO growth batch — non-brand discovery + city cost cluster (Sep 2026). */
export const SEO_GROWTH_SEP2026: Record<string, ArticleContent> = {
  "find-mentor-online-india": {
    slug: "find-mentor-online-india",
    publishedAt: "2026-09-16",
    updatedAt: "2026-09-16",
    readTimeMinutes: 8,
    author: "Mentr Editorial Team",
    intro:
      "Looking for a mentor online in India — for coding, career, boards, or entrance prep — usually means scrolling paid directories, agency middlemen, or vague “coach” listings. This guide shows how to find a mentor online in India who is verified, contactable without lead fees, and matched to your goal on Mentr.",
    sections: [
      {
        heading: "What “find a mentor online in India” should mean",
        blocks: [
          {
            type: "paragraph",
            text: "A useful online mentor is not a motivational speaker with a Zoom link. You want someone who has done the work you want next — DSA interviews, Class 12 boards, startup pitching, design portfolios — and can give weekly feedback. India has deep talent in every metro and in remote cities; the bottleneck is discovery without coins or commission.",
          },
          {
            type: "list",
            items: [
              "Clear goal: exam, skill, or career decision",
              "Verified identity and subject fit",
              "Direct chat after connect — no unlock fees",
              "Online-first sessions with optional local meetups",
            ],
          },
        ],
      },
      {
        heading: "How to search on Mentr (step by step)",
        blocks: [
          {
            type: "list",
            ordered: true,
            items: [
              "Open Find mentors / Search and filter kind = mentor (or subject hubs like programming).",
              "Filter India / online — many mentors teach nationwide on video.",
              "Read verification badge, subjects, and fee range.",
              "Send a short brief: your goal, timeline, and weekly hours.",
              "Connect on WhatsApp once they accept — agree trial and fees directly.",
            ],
          },
          {
            type: "callout",
            title: "Free for both sides",
            text: "Parents and learners do not buy lead packs. Mentors list free and keep 100% of session fees. That is why response quality stays higher than coin-gated directories.",
          },
        ],
      },
      {
        heading: "Mentor types Indian learners hire most",
        blocks: [
          {
            type: "list",
            items: [
              "Coding / DSA mentors for internships and product roles",
              "JEE / NEET subject mentors for weak chapters",
              "Board tutors (CBSE / ICSE) who teach online across cities",
              "Career mentors for Class 11–12 stream and college choices",
            ],
          },
          {
            type: "paragraph",
            text: "If you only need syllabus teaching, hire a tutor. If you need interview drills, portfolio review, or long-term skill plans, hire a mentor. Many Mentr profiles offer both — ask in the first message.",
          },
        ],
      },
      {
        heading: "Avoid these online-mentor traps",
        blocks: [
          {
            type: "list",
            items: [
              "Platforms that charge you to message every mentor",
              "Guaranteed-rank or guaranteed-job claims",
              "No verification and no trial session",
              "Opaque agency fees on top of mentor rates",
            ],
          },
        ],
      },
    ],
    faqs: [
      {
        question: "How do I find a mentor online for me in India?",
        answer:
          "Use a free verified directory like Mentr: filter mentors by subject, choose online mode, send a clear goal brief, and book a short trial before a monthly plan.",
      },
      {
        question: "Is online mentoring effective vs local?",
        answer:
          "For coding, languages, and exam problem-solving, online works well if you have a fixed weekly slot and shared homework. Prefer local only when you need in-person lab or very young learners.",
      },
      {
        question: "How much do online mentors charge in India?",
        answer:
          "Skill and career mentors often charge ₹800–₹2,500/hour; school subject mentors align with city tuition bands. Always confirm before the trial.",
      },
    ],
    relatedLinks: [
      { label: "Find mentors near me", href: "/find-mentors-near-me" },
      { label: "Find mentors worldwide", href: "/blog/find-mentor-online-any-country" },
      { label: "Best free tutor platforms India", href: "/blog/best-free-tutor-platforms-india" },
      { label: "Browse mentors on Mentr", href: "/search" },
    ],
  },

  "teacheron-alternatives": {
    slug: "teacheron-alternatives",
    publishedAt: "2026-09-16",
    updatedAt: "2026-09-16",
    readTimeMinutes: 7,
    author: "Mentr Editorial Team",
    intro:
      "TeacherOn is a popular place to post tuition jobs and browse tutors — but parents and tutors often look for TeacherOn alternatives when responses are thin, fees feel unclear, or they want verified India-first profiles without lead friction. Here are platforms worth trying in 2026, with Mentr as the free direct-connect option.",
    sections: [
      {
        heading: "Why people search TeacherOn alternatives",
        blocks: [
          {
            type: "paragraph",
            text: "TeacherOn’s strength is job posts and a large catalogue. Gaps appear when you want verified local tutors, a requirements board without paywalls, or zero commission on ongoing sessions. Alternatives matter for CBSE/ICSE families and tutors tired of competing only on the lowest bid.",
          },
        ],
      },
      {
        heading: "1. Mentr — best free TeacherOn alternative in India",
        blocks: [
          {
            type: "list",
            items: [
              "Verified tutors and mentors",
              "Requirements board — tutors pitch free",
              "No coins, no lead packs, no session commission",
              "WhatsApp after connect",
              "Strong for school + entrance + skills",
            ],
          },
          {
            type: "paragraph",
            text: "Post the same need on TeacherOn and Mentr for 48 hours and compare pitch quality. Most parents keep the verified, responsive shortlist.",
          },
        ],
      },
      {
        heading: "2–4. Other options",
        blocks: [
          {
            type: "list",
            items: [
              "UrbanPro — largest directory; coin unlocks for tutors",
              "Superprof — global skills focus; early-lesson commission",
              "Local agencies — fast matching; 15–30% ongoing cut",
            ],
          },
          {
            type: "callout",
            title: "Tutor tip",
            text: "If you are listing as faculty, start on Mentr (/for-faculty) so every pitch is free. Use TeacherOn as a secondary job board if you want volume.",
          },
        ],
      },
    ],
    faqs: [
      {
        question: "Is Mentr free like TeacherOn postings?",
        answer:
          "Parents post and search free. Tutors list and pitch free. Mentr does not sell coin packs to unlock contacts.",
      },
      {
        question: "Can I use TeacherOn and Mentr together?",
        answer:
          "Yes. Many tutors dual-list. Parents often get faster verified replies on Mentr for school subjects in Indian metros.",
      },
    ],
    relatedLinks: [
      { label: "UrbanPro alternatives", href: "/blog/urbanpro-alternatives" },
      { label: "Best free tutor platforms", href: "/blog/best-free-tutor-platforms-india" },
      { label: "Become a tutor free", href: "/for-faculty" },
      { label: "Search tutors", href: "/search" },
    ],
  },

  "justdial-tutor-alternatives": {
    slug: "justdial-tutor-alternatives",
    publishedAt: "2026-09-16",
    updatedAt: "2026-09-16",
    readTimeMinutes: 6,
    author: "Mentr Editorial Team",
    intro:
      "Justdial still surfaces “home tutors near me” in many Indian cities — but listings can be outdated, unverified, or routed through agencies. If you want Justdial tutor alternatives with clearer verification and free connect, start here.",
    sections: [
      {
        heading: "Limits of directory apps for tutoring",
        blocks: [
          {
            type: "paragraph",
            text: "General directories optimise for phone calls, not board fit, trial sessions, or credential checks. Parents often call five numbers and still cannot compare fees or Class 10 CBSE experience side by side.",
          },
        ],
      },
      {
        heading: "Better alternatives in 2026",
        blocks: [
          {
            type: "list",
            items: [
              "Mentr — verified tutors, filters by subject/class, free WhatsApp connect",
              "UrbanPro — large catalogue; tutors may pay coins to reply",
              "School / society referrals — trusted but slow to scale",
              "TeacherOn — job-post style; compare with Mentr for verified pitches",
            ],
          },
          {
            type: "callout",
            title: "Fast path",
            text: "Post one requirement on Mentr with class, board, locality, and budget. Compare pitches in a day instead of cold-calling directory numbers.",
          },
        ],
      },
    ],
    faqs: [
      {
        question: "Is Justdial good for finding home tutors?",
        answer:
          "It can surface local numbers quickly, but verification and subject depth vary. Use a tutor-specific platform when board exams or entrance prep matter.",
      },
      {
        question: "What is the best free Justdial alternative for tutors?",
        answer:
          "Mentr lets tutors list free and pitch on parent requirements without buying leads.",
      },
    ],
    relatedLinks: [
      { label: "UrbanPro alternatives", href: "/blog/urbanpro-alternatives" },
      { label: "TeacherOn alternatives", href: "/blog/teacheron-alternatives" },
      { label: "Find tutors near me", href: "/find-tutors-near-me" },
      { label: "Post a requirement", href: "/parent/signup" },
    ],
  },

  "home-tutor-cost-delhi": cityCostArticle({
    slug: "home-tutor-cost-delhi",
    city: "Delhi NCR",
    stateHint: "Delhi, Noida, Gurgaon, Ghaziabad",
    searchHref: "/search",
    ranges: [
      { band: "Classes 1–5", fee: "₹500–₹800/hour" },
      { band: "Classes 6–8", fee: "₹650–₹1,000/hour" },
      { band: "Classes 9–10 boards", fee: "₹900–₹1,400/hour" },
      { band: "Class 11–12 / JEE–NEET", fee: "₹1,200–₹2,200/hour" },
    ],
    notes: [
      "South Delhi and Gurgaon tend to sit at the higher end of each band",
      "Online tutors serving NCR often undercut home-visit rates",
      "Competitive mentors with coaching experience command premiums",
    ],
  }),

  "home-tutor-cost-mumbai": cityCostArticle({
    slug: "home-tutor-cost-mumbai",
    city: "Mumbai",
    stateHint: "city + western suburbs",
    searchHref: "/search",
    ranges: [
      { band: "Classes 1–5", fee: "₹550–₹900/hour" },
      { band: "Classes 6–8", fee: "₹700–₹1,100/hour" },
      { band: "Classes 9–10 boards", fee: "₹1,000–₹1,600/hour" },
      { band: "Class 11–12 / entrance", fee: "₹1,300–₹2,400/hour" },
    ],
    notes: [
      "Travel time across suburbs raises home-visit premiums",
      "Many families hybrid: online weekday + home weekend",
      "ICSE demand is strong in several Mumbai pockets",
    ],
  }),

  "home-tutor-cost-hyderabad": cityCostArticle({
    slug: "home-tutor-cost-hyderabad",
    city: "Hyderabad",
    stateHint: "and nearby IT corridors",
    searchHref: "/search",
    ranges: [
      { band: "Classes 1–5", fee: "₹400–₹700/hour" },
      { band: "Classes 6–8", fee: "₹550–₹900/hour" },
      { band: "Classes 9–10 boards", fee: "₹800–₹1,200/hour" },
      { band: "Class 11–12 / JEE–NEET", fee: "₹1,000–₹2,000/hour" },
    ],
    notes: [
      "Gachibowli / Hitech City families often prefer evening online slots",
      "State board + CBSE both common — specify board in your post",
      "IIT/NEET mentors cluster near coaching hubs but teach city-wide online",
    ],
  }),

  "home-tutor-cost-pune": cityCostArticle({
    slug: "home-tutor-cost-pune",
    city: "Pune",
    stateHint: "and PCMC",
    searchHref: "/search",
    ranges: [
      { band: "Classes 1–5", fee: "₹400–₹750/hour" },
      { band: "Classes 6–8", fee: "₹550–₹950/hour" },
      { band: "Classes 9–10 boards", fee: "₹800–₹1,300/hour" },
      { band: "Class 11–12 / entrance", fee: "₹1,000–₹2,000/hour" },
    ],
    notes: [
      "Baner–Balewadi and Kothrud sit slightly above average bands",
      "Strong CBSE and state-board mix — list board in the requirement",
      "Online tutors from Pune often serve pan-Maharashtra students",
    ],
  }),

  "how-to-login-mentr": {
    slug: "how-to-login-mentr",
    publishedAt: "2026-09-16",
    updatedAt: "2026-09-16",
    readTimeMinutes: 3,
    author: "Mentr Editorial Team",
    intro:
      "Searching for Mentr login? Use the right door: parents and tutors have separate accounts. This short guide links you to parent login, tutor/faculty login, and free signup — plus what to do if OTP does not arrive.",
    sections: [
      {
        heading: "Pick your role",
        blocks: [
          {
            type: "list",
            items: [
              "Parent / student family → Parent login or Parent signup",
              "Tutor or mentor → Faculty login or Faculty signup",
              "Mentr Learn (Class 3–5) → Enroll free with parent email on /learn/start",
            ],
          },
          {
            type: "callout",
            title: "Bookmark these",
            text: "Parent: /parent · Tutor: /faculty · Role chooser: /login · Learn enroll: /learn/start",
          },
        ],
      },
      {
        heading: "OTP tips",
        blocks: [
          {
            type: "paragraph",
            text: "Mentr uses email OTP. Check spam, wait 60 seconds before resend, and make sure you are on the same role you registered with. Faculty accounts cannot open the parent Learn enrollment flow without continuing as a parent.",
          },
        ],
      },
    ],
    faqs: [
      {
        question: "Where is Mentr login?",
        answer:
          "Go to mentr.in/login and choose Parent or Tutor. Or open /parent and /faculty directly.",
      },
      {
        question: "Is there a Mentr app login?",
        answer:
          "Use the website login on mobile browser for now — same parent and faculty OTP flows.",
      },
    ],
    relatedLinks: [
      { label: "Login chooser", href: "/login" },
      { label: "Parent login", href: "/parent" },
      { label: "Tutor login", href: "/faculty" },
      { label: "Enroll Mentr Learn", href: "/learn/start" },
    ],
  },
};
