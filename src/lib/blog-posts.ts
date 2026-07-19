export type BlogPillarId =
  | "for-parents"
  | "comparison"
  | "exam-prep"
  | "for-tutors"
  | "trust-safety"
  | "career-mentoring"
  | "local-guides";

export type SearchIntent = "informational" | "commercial" | "transactional";
export type FunnelStage = "top" | "mid" | "bottom";

export type BlogPost = {
  slug: string;
  title: string;
  keyword: string;
  intent: SearchIntent;
  funnel: FunnelStage;
  pillar: BlogPillarId;
  description: string;
  /** Week in the 12-week publishing calendar (1–12), if scheduled */
  publishWeek?: number;
  /** Cornerstone posts linked from footer & homepage */
  featured?: boolean;
  /** Primary CTA label */
  cta: string;
  ctaHref: string;
};

export type BlogPillar = {
  id: BlogPillarId;
  label: string;
  shortLabel: string;
  description: string;
  tint: "sage" | "butter" | "coral" | "lavender";
};

export const BLOG_PILLARS: BlogPillar[] = [
  {
    id: "for-parents",
    label: "Find-a-Tutor Guides",
    shortLabel: "For parents",
    description:
      "Parent-facing guides on finding, vetting, and hiring the right home tutor.",
    tint: "lavender",
  },
  {
    id: "comparison",
    label: "Comparison & Alternatives",
    shortLabel: "Comparisons",
    description:
      "Bottom-funnel comparisons for parents and tutors evaluating platforms.",
    tint: "butter",
  },
  {
    id: "exam-prep",
    label: "Exam Prep Guides",
    shortLabel: "Exam prep",
    description:
      "JEE, NEET, and board-exam timelines, weightage, and mentor selection.",
    tint: "sage",
  },
  {
    id: "for-tutors",
    label: "Tutor-Side Guides",
    shortLabel: "For tutors",
    description:
      "How to become a tutor, price sessions, and get students without paying for leads.",
    tint: "coral",
  },
  {
    id: "trust-safety",
    label: "Trust & Safety",
    shortLabel: "Trust & safety",
    description:
      "Verification, safety checklists, and what every parent should confirm before day one.",
    tint: "sage",
  },
  {
    id: "career-mentoring",
    label: "Career & Skill Mentoring",
    shortLabel: "Career mentoring",
    description:
      "Beyond academics — career mentors, skill coaching, and mentorship vs tutoring.",
    tint: "lavender",
  },
  {
    id: "local-guides",
    label: "Local Landing Guides",
    shortLabel: "Local guides",
    description:
      "City and area-specific tutor guides for Bengaluru neighbourhoods.",
    tint: "butter",
  },
];

export const BLOG_POSTS: BlogPost[] = [
  // ── Pillar 1: Find-a-Tutor Guides ──────────────────────────────
  {
    slug: "how-to-find-a-good-home-tutor",
    title: "How to Find a Good Home Tutor in India: 10 Questions to Ask Before Hiring",
    keyword: "how to find a good home tutor",
    intent: "informational",
    funnel: "top",
    pillar: "for-parents",
    description:
      "A parent's checklist — 10 questions to ask before hiring a home tutor, plus red flags and what verified means on Mentr.",
    publishWeek: 1,
    featured: true,
    cta: "Search verified tutors",
    ctaHref: "/search",
  },
  {
    slug: "home-tutor-vs-online-tutor",
    title: "Home Tutor vs Online Tutor: Which Is Better for Your Child in 2026?",
    keyword: "home tutor vs online tutor",
    intent: "informational",
    funnel: "top",
    pillar: "for-parents",
    description:
      "Compare in-person and online tutoring — flexibility, focus, cost, and when each format works best for your child.",
    cta: "Browse tutors near you",
    ctaHref: "/search",
  },
  {
    slug: "home-tutor-cost-bengaluru",
    title: "How Much Does a Home Tutor Cost in Bengaluru? (2026 Fee Guide by Subject & Class)",
    keyword: "home tutor fees bengaluru",
    intent: "commercial",
    funnel: "mid",
    pillar: "for-parents",
    description:
      "City-wise fee benchmarks for maths, science, JEE/NEET, and board exams — what parents actually pay in Bengaluru.",
    publishWeek: 2,
    featured: true,
    cta: "Post your requirement",
    ctaHref: "/parent/signup",
  },
  {
    slug: "tutor-red-flags",
    title: "Red Flags to Watch for When Hiring a Tutor for Your Child",
    keyword: "tutor red flags",
    intent: "informational",
    funnel: "top",
    pillar: "for-parents",
    description:
      "Warning signs that a tutor may not be right for your child — and how Mentr's verification catches common issues.",
    publishWeek: 7,
    cta: "Find verified tutors",
    ctaHref: "/search",
  },
  {
    slug: "one-on-one-vs-group-tuition",
    title: "One-on-One Tuition vs Group Tuition: Pros, Cons & What Works Best",
    keyword: "one on one vs group tuition",
    intent: "informational",
    funnel: "top",
    pillar: "for-parents",
    description:
      "When private tuition beats group classes — and how to decide based on your child's learning style and goals.",
    publishWeek: 10,
    cta: "Search tutors",
    ctaHref: "/search",
  },
  {
    slug: "signs-child-needs-tutor",
    title: "Signs Your Child Needs Extra Academic Help (and What to Do Next)",
    keyword: "signs child needs a tutor",
    intent: "informational",
    funnel: "top",
    pillar: "for-parents",
    description:
      "Academic warning signs parents often miss — and a step-by-step plan to find the right help early.",
    cta: "Post a requirement",
    ctaHref: "/parent/signup",
  },
  {
    slug: "first-tutoring-session-tips",
    title: "How to Prepare Your Child for Their First Tutoring Session",
    keyword: "first tutoring session tips",
    intent: "informational",
    funnel: "top",
    pillar: "for-parents",
    description:
      "Set expectations, pack the right materials, and make the first session productive for parent, child, and tutor.",
    cta: "Find a tutor",
    ctaHref: "/search",
  },
  {
    slug: "free-vs-paid-tutor-platforms-india",
    title: "Free vs Paid Tutor-Finding Platforms in India: What's the Real Difference?",
    keyword: "free tutor finder india",
    intent: "commercial",
    funnel: "mid",
    pillar: "for-parents",
    description:
      "What free platforms like Mentr actually offer vs paid marketplaces — and where hidden costs show up.",
    cta: "Try Mentr free",
    ctaHref: "/search",
  },
  {
    slug: "how-to-post-tutor-requirement",
    title: "How to Write a Tutoring Requirement Parents Actually Get Pitched On",
    keyword: "how to post a tutor requirement",
    intent: "transactional",
    funnel: "bottom",
    pillar: "for-parents",
    description:
      "Write a requirement that gets quality pitches — subject, schedule, budget, and location tips that tutors respond to.",
    cta: "Post your requirement",
    ctaHref: "/parent/signup",
  },
  {
    slug: "how-to-verify-tutor-credentials",
    title: "A Parent's Complete Guide to Verifying a Tutor's Credentials",
    keyword: "how to verify a tutor india",
    intent: "informational",
    funnel: "top",
    pillar: "for-parents",
    description:
      "ID checks, qualification proof, references, and trial sessions — a practical verification checklist for parents.",
    cta: "Browse verified tutors",
    ctaHref: "/search",
  },

  // ── Pillar 2: Comparison / Alternative Pages ─────────────────────
  {
    slug: "mentr-vs-urbanpro",
    title: "Mentr vs UrbanPro: Which Is Better for Finding a Tutor in 2026?",
    keyword: "mentr vs urbanpro",
    intent: "commercial",
    funnel: "bottom",
    pillar: "comparison",
    description:
      "Fees, reach, verification, and lead costs — an honest side-by-side for parents and tutors choosing a platform.",
    publishWeek: 3,
    featured: true,
    cta: "Search tutors free",
    ctaHref: "/search",
  },
  {
    slug: "mentr-vs-superprof",
    title: "Mentr vs Superprof: Fees, Reach & How They Compare",
    keyword: "mentr vs superprof",
    intent: "commercial",
    funnel: "bottom",
    pillar: "comparison",
    description:
      "How Mentr and Superprof differ on pricing, tutor reach, and who pays — for parents and faculty.",
    cta: "List your profile free",
    ctaHref: "/faculty/signup",
  },
  {
    slug: "best-free-tutor-platforms-india",
    title: "Best Free Platforms to Find a Tutor or Mentor in India (2026 List)",
    keyword: "best free tutor finder platform india",
    intent: "commercial",
    funnel: "bottom",
    pillar: "comparison",
    description:
      "The top free tutor-finding platforms in India ranked — features, reach, and what each one costs tutors.",
    publishWeek: 12,
    cta: "Find a teacher",
    ctaHref: "/search",
  },
  {
    slug: "tuition-agency-commission-india",
    title: "Why Tutoring Agencies Charge 15–30% Commission — and How to Avoid It",
    keyword: "tuition agency commission india",
    intent: "commercial",
    funnel: "mid",
    pillar: "comparison",
    description:
      "How agency commissions work, what parents and tutors actually pay, and free alternatives to middlemen.",
    cta: "Connect directly",
    ctaHref: "/search",
  },
  {
    slug: "urbanpro-alternatives",
    title: "UrbanPro Alternatives: 5 Platforms Worth Trying in 2026",
    keyword: "urbanpro alternative",
    intent: "commercial",
    funnel: "bottom",
    pillar: "comparison",
    description:
      "Five tutor platforms worth comparing to UrbanPro — including free options with no lead fees.",
    cta: "Try Mentr",
    ctaHref: "/search",
  },
  {
    slug: "how-tutoring-platforms-make-money",
    title: "Coins, Leads & Commissions: How Tutoring Platforms Really Make Money",
    keyword: "how do tutoring platforms make money",
    intent: "informational",
    funnel: "mid",
    pillar: "comparison",
    description:
      "The business model behind tutoring marketplaces — coins, lead packs, subscriptions, and agency cuts explained.",
    cta: "Join Mentr free",
    ctaHref: "/faculty/signup",
  },

  // ── Pillar 3: Exam Prep Guides ─────────────────────────────────
  {
    slug: "jee-main-2027-preparation-timeline",
    title: "JEE Main 2027 Preparation Timeline: Month-by-Month Study Plan",
    keyword: "jee main 2027 preparation timeline",
    intent: "informational",
    funnel: "top",
    pillar: "exam-prep",
    description:
      "A month-by-month JEE Main 2027 prep roadmap — syllabus coverage, mock tests, and when to bring in a mentor.",
    publishWeek: 6,
    cta: "Find a JEE mentor",
    ctaHref: "/exam-prep/jee-coaching-bengaluru",
  },
  {
    slug: "neet-biology-weightage",
    title: "NEET Biology Chapter-Wise Weightage (2026 Updated)",
    keyword: "neet biology weightage chapter wise",
    intent: "informational",
    funnel: "top",
    pillar: "exam-prep",
    description:
      "Updated NEET Biology chapter weightage — which units carry the most marks and how to prioritise revision.",
    cta: "Find NEET tutors",
    ctaHref: "/exam-prep/neet-coaching-bengaluru",
  },
  {
    slug: "how-to-choose-jee-neet-mentor",
    title: "How to Choose the Right JEE/NEET Mentor: A Parent's Checklist",
    keyword: "how to choose jee mentor",
    intent: "commercial",
    funnel: "mid",
    pillar: "exam-prep",
    description:
      "What to look for in a JEE or NEET mentor — track record, teaching style, batch size, and fee transparency.",
    cta: "Post your requirement",
    ctaHref: "/parent/signup",
  },
  {
    slug: "cbse-class-10-study-plan",
    title: "CBSE Class 10 Board Exam: Last 60-Day Study Plan",
    keyword: "cbse class 10 study plan",
    intent: "informational",
    funnel: "top",
    pillar: "exam-prep",
    description:
      "A structured 60-day CBSE Class 10 revision plan — subject rotation, mock papers, and when to get a tutor.",
    cta: "Find board exam tutors",
    ctaHref: "/search",
  },
  {
    slug: "board-exams-vs-competitive-exams",
    title: "Board Exams vs Competitive Exams: How to Balance Both in Class 11–12",
    keyword: "board exams vs jee neet balance",
    intent: "informational",
    funnel: "top",
    pillar: "exam-prep",
    description:
      "Balancing CBSE boards with JEE or NEET prep — weekly schedules, mentor roles, and common mistakes.",
    cta: "Find a mentor",
    ctaHref: "/search",
  },
  {
    slug: "online-vs-local-jee-neet-coaching",
    title: "Online JEE/NEET Coaching vs Local Mentor: What Actually Works?",
    keyword: "online vs local jee neet coaching",
    intent: "commercial",
    funnel: "mid",
    pillar: "exam-prep",
    description:
      "Online coaching vs a local JEE/NEET mentor — cost, accountability, doubt-solving, and hybrid approaches.",
    cta: "Search JEE mentors",
    ctaHref: "/exam-prep/jee-coaching-bengaluru",
  },

  // ── Pillar 4: Tutor-Side Guides ──────────────────────────────────
  {
    slug: "how-to-become-a-home-tutor-india",
    title: "How to Become a Home Tutor in India: A Step-by-Step Guide",
    keyword: "how to become a home tutor india",
    intent: "informational",
    funnel: "top",
    pillar: "for-tutors",
    description:
      "From qualifications to your first student — a practical guide to starting as a home tutor in India.",
    publishWeek: 4,
    featured: true,
    cta: "Create free profile",
    ctaHref: "/faculty/signup",
  },
  {
    slug: "how-to-price-tutoring-sessions",
    title: "How to Price Your Tutoring Sessions (City-Wise Benchmarks for 2026)",
    keyword: "how to price tutoring sessions india",
    intent: "informational",
    funnel: "mid",
    pillar: "for-tutors",
    description:
      "What tutors charge in Bengaluru, Mumbai, Delhi and beyond — by subject, class, and experience level.",
    cta: "List on Mentr",
    ctaHref: "/faculty/signup",
  },
  {
    slug: "get-tutoring-students-free",
    title: "5 Free Ways to Get More Tutoring Students Without Paying for Leads",
    keyword: "get tutoring students free",
    intent: "informational",
    funnel: "mid",
    pillar: "for-tutors",
    description:
      "Five proven ways to find students without buying leads — profiles, requirements board, referrals, and more.",
    publishWeek: 8,
    cta: "Join Mentr free",
    ctaHref: "/faculty/signup",
  },
  {
    slug: "freelance-tutor-vs-coaching-institute",
    title: "Freelance Tutor vs Coaching Institute Employee: Which Pays Better?",
    keyword: "freelance tutor vs coaching institute",
    intent: "informational",
    funnel: "top",
    pillar: "for-tutors",
    description:
      "Income, flexibility, and career growth — comparing freelance tutoring with coaching institute roles.",
    cta: "Start freelancing",
    ctaHref: "/faculty/signup",
  },
  {
    slug: "how-to-write-tutor-profile",
    title: "How to Write a Tutor Profile That Actually Gets Chosen",
    keyword: "how to write tutor profile",
    intent: "transactional",
    funnel: "bottom",
    pillar: "for-tutors",
    description:
      "Profile photo, bio, subjects, availability, and proof — what makes parents pick your listing.",
    cta: "Create your profile",
    ctaHref: "/faculty/signup",
  },
  {
    slug: "tutoring-platform-lead-fees",
    title: "Why You Shouldn't Have to Pay for Every Lead as a Tutor",
    keyword: "tutoring platform lead fees",
    intent: "commercial",
    funnel: "mid",
    pillar: "for-tutors",
    description:
      "How lead fees and coin systems hurt tutors — and platforms that let you keep 100% of your fees.",
    cta: "List free on Mentr",
    ctaHref: "/faculty/signup",
  },

  // ── Pillar 5: Trust & Safety ─────────────────────────────────────
  {
    slug: "how-mentr-verifies-tutors",
    title: "How Mentr Verifies Every Tutor Before They Go Live",
    keyword: "mentr tutor verification",
    intent: "informational",
    funnel: "bottom",
    pillar: "trust-safety",
    description:
      "Our verification process step by step — identity checks, the Verified badge, and what parents can trust.",
    publishWeek: 11,
    cta: "Browse verified tutors",
    ctaHref: "/search",
  },
  {
    slug: "tutor-safety-checklist-parents",
    title: "Tutor Safety Checklist: What Every Parent Should Confirm Before Day 1",
    keyword: "tutor safety checklist for parents",
    intent: "informational",
    funnel: "top",
    pillar: "trust-safety",
    description:
      "A pre-session safety checklist — ID verification, references, first-meeting tips, and ongoing checks.",
    cta: "Find safe tutors",
    ctaHref: "/search",
  },
  {
    slug: "online-tutoring-safety-kids",
    title: "Online Tutoring Safety: Protecting Your Child in Virtual Sessions",
    keyword: "online tutoring safety for kids",
    intent: "informational",
    funnel: "top",
    pillar: "trust-safety",
    description:
      "Screen sharing, camera policies, session recording, and red flags — keeping kids safe in online tutoring.",
    cta: "Search online tutors",
    ctaHref: "/search",
  },

  // ── Pillar 6: Career & Skill Mentoring ───────────────────────────
  {
    slug: "how-to-find-career-mentor-free",
    title: "How to Find a Career Mentor for Free (Without LinkedIn Cold DMs)",
    keyword: "how to find a career mentor free",
    intent: "informational",
    funnel: "top",
    pillar: "career-mentoring",
    description:
      "Practical ways to find a career mentor — alumni networks, communities, and free platforms that work.",
    cta: "Find mentors",
    ctaHref: "/search",
  },
  {
    slug: "mentorship-vs-coaching-vs-tutoring",
    title: "Mentorship vs Coaching vs Tutoring: What's the Actual Difference?",
    keyword: "mentorship vs coaching vs tutoring",
    intent: "informational",
    funnel: "top",
    pillar: "career-mentoring",
    description:
      "Clear definitions and when you need a mentor, coach, or tutor — for students and working professionals.",
    cta: "Explore Mentr",
    ctaHref: "/search",
  },
  {
    slug: "find-skill-mentor-online-india",
    title: "Skill Coaching for Adults: Where to Find Verified Mentors Online",
    keyword: "find skill mentor online india",
    intent: "commercial",
    funnel: "mid",
    pillar: "career-mentoring",
    description:
      "Where adults find skill coaches and career mentors online in India — coding, design, business, and more.",
    cta: "Search mentors",
    ctaHref: "/search",
  },

  // ── Pillar 7: Local Landing Guides ───────────────────────────────
  {
    slug: "maths-tutor-koramangala",
    title: "Best Maths Tutors in Koramangala, Bengaluru (2026 Guide)",
    keyword: "maths tutor koramangala",
    intent: "commercial",
    funnel: "bottom",
    pillar: "local-guides",
    description:
      "Top maths tutors in Koramangala — fees, class coverage, and how to book a verified tutor nearby.",
    publishWeek: 5,
    cta: "Search Koramangala tutors",
    ctaHref: "/areas/koramangala-tutors",
  },
  {
    slug: "physics-tutor-indiranagar",
    title: "Best Physics Tutors in Indiranagar, Bengaluru",
    keyword: "physics tutor indiranagar",
    intent: "commercial",
    funnel: "bottom",
    pillar: "local-guides",
    description:
      "Physics tutors in Indiranagar for CBSE, ICSE, and JEE — local fees and how to connect directly.",
    publishWeek: 9,
    cta: "Browse Indiranagar tutors",
    ctaHref: "/search/bengaluru",
  },
  {
    slug: "jee-coaching-hsr-layout",
    title: "JEE Coaching & Mentors in HSR Layout, Bengaluru",
    keyword: "jee coaching hsr layout",
    intent: "commercial",
    funnel: "bottom",
    pillar: "local-guides",
    description:
      "JEE mentors and coaching options in HSR Layout — one-on-one vs group, fees, and verified listings.",
    cta: "Find JEE mentors",
    ctaHref: "/exam-prep/jee-coaching-bengaluru",
  },
  {
    slug: "neet-biology-tutor-jayanagar",
    title: "NEET Biology Tutors in Jayanagar, Bengaluru",
    keyword: "neet biology tutor jayanagar",
    intent: "commercial",
    funnel: "bottom",
    pillar: "local-guides",
    description:
      "NEET Biology specialists in Jayanagar — chapter coverage, mock test support, and local fee ranges.",
    cta: "Find NEET tutors",
    ctaHref: "/exam-prep/neet-coaching-bengaluru",
  },
  {
    slug: "home-tutor-whitefield",
    title: "Home Tutors in Whitefield: Subjects, Fees & How to Book",
    keyword: "home tutor whitefield",
    intent: "commercial",
    funnel: "bottom",
    pillar: "local-guides",
    description:
      "Home tutors across subjects in Whitefield — typical fees, areas served, and how to post a requirement.",
    cta: "Search Whitefield tutors",
    ctaHref: "/search/bengaluru",
  },

  // ── Global SEO: mentor search worldwide ────────────────────────────
  {
    slug: "find-online-tutor-near-me",
    title: "How to Find an Online Tutor Near Me (Any City, Any Country)",
    keyword: "online tutor near me",
    intent: "commercial",
    funnel: "mid",
    pillar: "for-parents",
    featured: true,
    description:
      "Search tactics for 'online tutor near me' — local time zones, verified profiles, and free platforms that work in India, UAE, UK, and beyond.",
    cta: "Search tutors near you",
    ctaHref: "/search",
  },
  {
    slug: "how-to-find-verified-tutor-online",
    title: "How to Find a Verified Tutor Online (What to Check Before You Book)",
    keyword: "verified tutor online",
    intent: "commercial",
    funnel: "mid",
    pillar: "trust-safety",
    featured: true,
    description:
      "What 'verified tutor' actually means — ID checks, qualification proof, trial sessions, and red flags when hiring online.",
    cta: "Browse verified tutors",
    ctaHref: "/search",
  },
  {
    slug: "find-programming-mentor-worldwide",
    title: "How to Find a Programming Mentor Worldwide (Free & Paid Options)",
    keyword: "programming mentor worldwide",
    intent: "commercial",
    funnel: "mid",
    pillar: "career-mentoring",
    featured: true,
    description:
      "Find coding mentors across time zones — DSA, web dev, data science, and career guidance without cold LinkedIn spam.",
    cta: "Find coding mentors",
    ctaHref: "/search",
  },
  {
    slug: "find-tutor-online-uae",
    title: "Find a Tutor Online in the UAE: CBSE, IGCSE, Arabic & More",
    keyword: "online tutor UAE",
    intent: "commercial",
    funnel: "bottom",
    pillar: "local-guides",
    featured: true,
    description:
      "UAE parents' guide to online tutors — Dubai, Abu Dhabi, Sharjah, curriculum fit, fees in AED, and verified mentors on Mentr.",
    cta: "Search UAE tutors",
    ctaHref: "/search",
  },
  {
    slug: "find-mentor-online-any-country",
    title: "Find a Mentor Online in Any Country: Global Search That Actually Works",
    keyword: "find mentor online worldwide",
    intent: "commercial",
    funnel: "mid",
    pillar: "career-mentoring",
    featured: true,
    description:
      "Cross-border mentor search for students and professionals — filters, verification, and how to hire tutors in India, UAE, UK, US, and more.",
    cta: "Search mentors globally",
    ctaHref: "/search",
  },

  // ── SEO cluster: exact-match keywords ─────────────────────────────
  {
    slug: "find-online-tutors-verified-free",
    title: "Find Online Tutors Verified — Free Search on Mentr",
    keyword: "find online tutors verified",
    intent: "commercial",
    funnel: "bottom",
    pillar: "trust-safety",
    featured: true,
    description:
      "How to find online tutors verified with ID and credential checks — free connect, no lead fees on Mentr.",
    cta: "Find verified tutors",
    ctaHref: "/find-verified-online-tutors",
  },
  {
    slug: "find-tutors-online-free-india",
    title: "Find Tutors Online Free in India — Verified CBSE & JEE",
    keyword: "find tutors online India",
    intent: "commercial",
    funnel: "mid",
    pillar: "for-parents",
    description:
      "Find tutors online in India without lead fees — CBSE, ICSE, JEE, NEET mentors on Mentr.",
    cta: "Find online tutors India",
    ctaHref: "/find-online-tutors/india",
  },
  {
    slug: "find-mentors-near-me-online",
    title: "Find Mentors Near Me Online — Career & Coding Free",
    keyword: "find mentors near me",
    intent: "commercial",
    funnel: "mid",
    pillar: "career-mentoring",
    featured: true,
    description:
      "Find mentors near me — local or online mentors for career, coding, and skills on Mentr.",
    cta: "Find mentors near me",
    ctaHref: "/find-mentors-near-me",
  },
  {
    slug: "online-tutor-jobs-from-home",
    title: "Online Tutor Jobs From Home — List Free on Mentr",
    keyword: "online tutor jobs from home",
    intent: "commercial",
    funnel: "bottom",
    pillar: "for-tutors",
    description:
      "Find online tutor jobs from home — free listing, no lead fees, keep 100% of fees on Mentr.",
    cta: "Get tutor jobs",
    ctaHref: "/online-tutor-jobs",
  },
  {
    slug: "find-maths-tutor-online-verified",
    title: "Find a Maths Tutor Online Verified — CBSE to JEE",
    keyword: "find maths tutor online verified",
    intent: "commercial",
    funnel: "bottom",
    pillar: "for-parents",
    description:
      "Find a verified maths tutor online for CBSE, ICSE, and JEE — free connect on Mentr.",
    cta: "Find maths tutors",
    ctaHref: "/find-verified-online-tutors",
  },
  {
    slug: "find-coding-mentor-online",
    title: "Find a Coding Mentor Online — Python, Web & DSA",
    keyword: "find coding mentor online",
    intent: "commercial",
    funnel: "mid",
    pillar: "career-mentoring",
    description:
      "Find a coding mentor online for DSA, web development, and career switching — verified on Mentr.",
    cta: "Find coding mentors",
    ctaHref: "/find-mentors/programming",
  },
  {
    slug: "verified-online-tutors-uae-cbse",
    title: "Verified Online Tutors UAE for CBSE & IGCSE",
    keyword: "verified online tutors UAE",
    intent: "commercial",
    funnel: "bottom",
    pillar: "local-guides",
    description:
      "Find verified online tutors in UAE for CBSE, IGCSE, and IB — Dubai, Abu Dhabi, Sharjah.",
    cta: "Find UAE tutors",
    ctaHref: "/find-online-tutors/uae",
  },
  {
    slug: "find-english-tutor-online-india",
    title: "Find an English Tutor Online in India — Verified",
    keyword: "find english tutor online India",
    intent: "commercial",
    funnel: "mid",
    pillar: "for-parents",
    description:
      "Find English tutors online in India — spoken English, board exams, IELTS foundation.",
    cta: "Find English tutors",
    ctaHref: "/find-online-tutors/india",
  },
  {
    slug: "how-to-find-tutor-online-safely",
    title: "How to Find a Tutor Online Safely — Parent Checklist",
    keyword: "how to find tutor online safely",
    intent: "informational",
    funnel: "top",
    pillar: "trust-safety",
    description:
      "Safety checklist for finding tutors online — verification, trials, and red flags before you book.",
    cta: "Find verified tutors",
    ctaHref: "/find-verified-online-tutors",
  },
  {
    slug: "become-online-tutor-get-students",
    title: "Become an Online Tutor & Get Students — Free on Mentr",
    keyword: "become online tutor get students",
    intent: "transactional",
    funnel: "bottom",
    pillar: "for-tutors",
    description:
      "Become an online tutor and get students without paying for leads — free profile on Mentr.",
    cta: "List free",
    ctaHref: "/online-tutor-jobs",
  },
];

export function getPillar(id: BlogPillarId): BlogPillar {
  const pillar = BLOG_PILLARS.find((p) => p.id === id);
  if (!pillar) throw new Error(`Unknown pillar: ${id}`);
  return pillar;
}

export function postsByPillar(pillar: BlogPillarId | "all"): BlogPost[] {
  if (pillar === "all") return BLOG_POSTS;
  return BLOG_POSTS.filter((p) => p.pillar === pillar);
}

export function getBlogPost(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((p) => p.slug === slug);
}

export function featuredPosts(): BlogPost[] {
  return BLOG_POSTS.filter((p) => p.featured);
}

export function scheduledPosts(): BlogPost[] {
  return BLOG_POSTS.filter((p) => p.publishWeek).sort(
    (a, b) => (a.publishWeek ?? 0) - (b.publishWeek ?? 0),
  );
}

export const FUNNEL_LABELS: Record<FunnelStage, string> = {
  top: "Awareness",
  mid: "Consideration",
  bottom: "Decision",
};

export const INTENT_LABELS: Record<SearchIntent, string> = {
  informational: "Guide",
  commercial: "Comparison",
  transactional: "How-to",
};
