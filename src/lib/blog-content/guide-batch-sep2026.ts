import type { ArticleContent } from "./types";

/** Second batch of strong parent, student, and exam-prep guides (Sep 2026). */
export const GUIDE_BATCH_SEP2026: Record<string, ArticleContent> = {
  "browse-tutors-without-login-parent-guide": {
    slug: "browse-tutors-without-login-parent-guide",
    publishedAt: "2026-09-01",
    updatedAt: "2026-09-07",
    readTimeMinutes: 9,
    author: "Mentr Editorial Team",
    intro:
      "You should not need to create an account just to see who teaches maths in Koramangala or whether a Physics tutor has open slots this week. Most tutoring platforms hide profiles behind sign-up walls or charge tutors for every parent message — which pushes fees up and makes comparison harder. On Mentr, parents can browse the full tutor list on /search without logging in. When you find someone worth talking to, sign in once to connect on WhatsApp. This guide explains what you can see as a guest, what unlocks after sign-in, and how to compare tutors efficiently before the first message.",
    sections: [
      {
        heading: "What you can do without signing in",
        blocks: [
          {
            type: "paragraph",
            text: "The Mentr search page shows verified tutors and mentors across Bengaluru (and online profiles for India and UAE). As a guest, you can filter by subject — Mathematics, Physics, Chemistry, English, Coding, Biology, Exam Prep — narrow by locality, sort by relevance or experience, switch between grid and map view, and read each card's bio snippet, experience years, rating, open slots, and area. You do not need a parent account to scroll the list or use filters.",
          },
          {
            type: "list",
            items: [
              "Browse tutor cards with photo, subjects, locality, and availability badges",
              "Filter by subject, area, teaching mode (online / home), and verified status",
              "Use map view to see tutor locations (share location optional for distance sort)",
              "Read public SEO profile pages at /teachers/[id] where indexed",
            ],
          },
          {
            type: "callout",
            title: "Why we open browse to everyone",
            text: "Mentr is free and open source. Hiding tutors behind a login wall helps platforms sell lead credits — not parents. Letting you browse first means you compare three or four profiles calmly before creating an account.",
          },
        ],
      },
      {
        heading: "What happens when you click a tutor card",
        blocks: [
          {
            type: "paragraph",
            text: "Clicking a tutor card, the View button, or Connect as a guest opens the sign-in chooser — parent or tutor. Choose parent, complete quick login, and you return to the profile or connect flow. WhatsApp numbers stay hidden until the tutor accepts your connect request, which protects both sides from spam.",
          },
          {
            type: "list",
            ordered: true,
            items: [
              "Shortlist 3–5 tutors while browsing as a guest",
              "Click one profile — sign in as parent when prompted",
              "Send a connect request with class, board, and preferred timing",
              "WhatsApp unlocks after the tutor accepts (usually 24–48 hours)",
              "Book a paid trial session before monthly commitment",
            ],
          },
        ],
      },
      {
        heading: "How to compare tutors before you connect",
        blocks: [
          {
            type: "paragraph",
            text: "Use the same checklist whether you browse logged out or logged in. Match subject line to your exact need — 'Class 10 CBSE Maths' beats a generic 'all subjects' listing. Check verified badge, years of experience with your board, open slots that fit your schedule, and whether modes include online if you need it. Read the bio for teaching style hints: exam-focused, concept-first, homework help, or competitive prep.",
          },
          {
            type: "list",
            items: [
              "Verified badge — identity and credential review completed",
              "Open slots — green badge means they are accepting students now",
              "Review count — new tutors are not bad, but ask for references on trial",
              "Locality vs online — filter mode if you need home visits in HSR or Whitefield",
              "Intro video — when available, watch 60 seconds before connecting",
            ],
          },
        ],
      },
      {
        heading: "Alternative: post a requirement instead of searching",
        blocks: [
          {
            type: "paragraph",
            text: "If you know what you need but not who fits, post a requirement after sign-in — subject, class, area, budget range, online or offline. Tutors pitch with their profiles; you compare on your dashboard and accept the best match. Your name stays private on the public board until acceptance.",
          },
        ],
      },
    ],
    faqs: [
      {
        question: "Can parents browse tutors on Mentr without creating an account?",
        answer:
          "Yes. The /search page lists tutors for guests. Sign in only when you want to view full profile actions, send a connect request, or post a requirement.",
      },
      {
        question: "Is browsing tutors on Mentr free?",
        answer:
          "Yes. Mentr charges ₹0 to browse, search, connect, and post requirements. Session fees are arranged directly with the tutor.",
      },
      {
        question: "Why do I need to sign in to connect on WhatsApp?",
        answer:
          "Sign-in confirms you are a parent (not spam) and lets tutors accept or decline before sharing contact details. WhatsApp unlocks only after mutual acceptance.",
      },
      {
        question: "Can I browse online tutors outside Bengaluru?",
        answer:
          "Yes. Filter for online mode or use Find online tutors in India for CBSE, ICSE, JEE, and NEET mentors across India and UAE.",
      },
    ],
    relatedLinks: [
      { label: "Browse tutors now", href: "/search" },
      { label: "How to find a good home tutor", href: "/blog/how-to-find-a-good-home-tutor" },
      { label: "First tutoring session tips", href: "/blog/first-tutoring-session-tips" },
      { label: "Mentr is open source", href: "/open-source" },
    ],
  },

  "how-to-choose-cbse-class-6-8-tutor": {
    slug: "how-to-choose-cbse-class-6-8-tutor",
    publishedAt: "2026-09-02",
    updatedAt: "2026-09-07",
    readTimeMinutes: 10,
    author: "Mentr Editorial Team",
    intro:
      "Class 6 to 8 is where maths stops being arithmetic and science becomes conceptual — fractions, algebra introduction, Physics forces, and structured writing in English. The wrong tutor teaches shortcuts that break in Class 9; the right one builds habits that carry through boards and JEE foundation. This guide helps Indian parents choose a CBSE tutor for middle school: what to prioritise, what fees look like in 2026, and how to run a trial that tells you the truth in two sessions.",
    sections: [
      {
        heading: "Middle school needs differ from exam-crash tutoring",
        blocks: [
          {
            type: "paragraph",
            text: "Class 6–8 tutors should focus on understanding NCERT line by line, daily practice discipline, and curiosity — not JEE rank promises. A tutor who jumps to RD Sharma in Class 6 often skips the visual and word-problem fluency NCERT expects. Ask how they align with your child's school textbook and whether they coordinate with school test dates.",
          },
          {
            type: "list",
            items: [
              "Maths: fractions, ratios, introductory algebra, geometry basics",
              "Science: Physics concepts (force, light), Biology classification, Chemistry elements",
              "English: grammar, comprehension, paragraph writing — not only literature summaries",
              "Social Science: map work and structured answers — often neglected until Class 10",
            ],
          },
        ],
      },
      {
        heading: "Home tutor vs online for Class 6–8",
        blocks: [
          {
            type: "paragraph",
            text: "Younger students often focus better with someone physically present — especially for maths working and science diagrams. Online works when the student is disciplined, has a quiet desk, and you need a specialist (Olympiad maths, coding) not available locally. Hybrid — online twice a week plus monthly in-person review — suits many Bengaluru families.",
          },
          {
            type: "callout",
            title: "Session length",
            text: "45–60 minutes is enough for most Class 6–8 students. Longer sessions without breaks reduce retention. Confirm the tutor adjusts pace when attention drops.",
          },
        ],
      },
      {
        heading: "Fee benchmarks in Bengaluru (2026)",
        blocks: [
          {
            type: "list",
            items: [
              "Single subject, home visit, 3 sessions/week: ₹6,000–₹10,000/month",
              "Two subjects (Maths + Science): ₹8,000–₹14,000/month",
              "Online only, single subject: ₹4,000–₹8,000/month",
              "Group of 3–4 students at tutor's home: ₹3,000–₹5,000/month per child",
            ],
          },
          {
            type: "paragraph",
            text: "Fees vary by area (Indiranagar and Koramangala often sit at the high end), tutor qualification, and whether they travel to your home. Mentr does not set fees — compare profiles and negotiate directly after a trial.",
          },
        ],
      },
      {
        heading: "Questions to ask before hiring",
        blocks: [
          {
            type: "list",
            ordered: true,
            items: [
              "Which CBSE chapters will you cover in the first month?",
              "Do you use only NCERT or add reference books — which ones?",
              "How do you handle school homework vs extra practice?",
              "Will you update parents weekly or only before exams?",
              "What is your policy if my child misses a session?",
              "Can we do two paid trial sessions before monthly booking?",
            ],
          },
        ],
      },
    ],
    faqs: [
      {
        question: "At what age should I hire a tutor for CBSE?",
        answer:
          "Hire when school feedback or report cards show consistent gaps — often Class 6–7 for maths foundation or Class 8 before board-style exams intensify. Do not wait until Class 10 if algebra basics are shaky in Class 8.",
      },
      {
        question: "Should Class 7 students prepare for JEE already?",
        answer:
          "Build strong NCERT maths and science habits first. Olympiad or foundation courses are optional if the child enjoys them — forced early JEE prep often burns out middle schoolers.",
      },
      {
        question: "How many subjects should one tutor cover?",
        answer:
          "One tutor can cover Maths + Science if qualified. English and Social Science often need a separate language-focused tutor for writing quality.",
      },
    ],
    relatedLinks: [
      { label: "Browse CBSE tutors", href: "/search?subject=Mathematics" },
      { label: "Signs your child needs a tutor", href: "/blog/signs-child-needs-tutor" },
      { label: "Home tutor cost Bengaluru", href: "/blog/home-tutor-cost-bengaluru" },
      { label: "Evaluate a trial session", href: "/blog/how-parents-evaluate-tutor-trial-session" },
    ],
  },

  "icse-vs-cbse-tutor-guide-parents": {
    slug: "icse-vs-cbse-tutor-guide-parents",
    publishedAt: "2026-09-03",
    updatedAt: "2026-09-07",
    readTimeMinutes: 9,
    author: "Mentr Editorial Team",
    intro:
      "ICSE and CBSE use different textbooks, exam styles, and depth expectations — especially in English, Social Science, and Class 10 board papers. Hiring a CBSE tutor for an ICSE student (or vice versa) wastes months: the wrong question formats, missing chapters, and literature lists do not overlap enough. This guide explains what parents should match when hiring, where boards converge in Class 11–12, and how to search Mentr for board-specific tutors.",
    sections: [
      {
        heading: "Where ICSE and CBSE tutoring diverges",
        blocks: [
          {
            type: "paragraph",
            text: "ICSE English demands more literature analysis, composition, and grammar depth. CBSE English is structured around NCERT textbooks with predictable section patterns. ICSE Science splits Physics, Chemistry, Biology early with detailed theory; CBSE integrates until Class 10 then splits in Class 11. Social Science in ICSE often requires longer descriptive answers with map and project work CBSE tutors may not know.",
          },
          {
            type: "list",
            items: [
              "Always match tutor to exact board and class — not just subject name",
              "ICSE Class 10 needs tutors who know council paper patterns and prescribed texts",
              "CBSE Class 10 tutors should anchor on NCERT exemplar and previous year papers",
              "Class 11–12: PCM tutors often teach both boards for JEE-aligned content",
            ],
          },
        ],
      },
      {
        heading: "When a cross-board tutor works",
        blocks: [
          {
            type: "paragraph",
            text: "Maths and Physics concepts overlap heavily after Class 8 — a strong JEE foundation tutor can help ICSE and CBSE students if they review the student's textbook first. Coding, spoken English, and competitive exam prep (JEE/NEET) are largely board-agnostic. Do not use board-agnostic tutors for ICSE English literature or CBSE Social Science board writing without proof they know the syllabus.",
          },
        ],
      },
      {
        heading: "How to verify board expertise on a profile",
        blocks: [
          {
            type: "list",
            ordered: true,
            items: [
              "Profile lists your board explicitly in subjects or levels",
              "Trial session uses your child's textbook, not a generic worksheet",
              "Tutor names chapters that exist in your syllabus — ask one at random",
              "References from parents with same board and class",
            ],
          },
          {
            type: "callout",
            title: "Red flag",
            text: "Tutors who say 'I teach all boards all classes' without naming textbooks or showing past student board results rarely deliver focused ICSE or CBSE prep.",
          },
        ],
      },
    ],
    faqs: [
      {
        question: "Can a CBSE tutor teach ICSE Class 10?",
        answer:
          "Only for subjects with heavy overlap (Maths, Physics) and only if they study the ICSE syllabus first. English, History, and Geography need ICSE-experienced tutors.",
      },
      {
        question: "Is ICSE harder than CBSE for tutoring?",
        answer:
          "ICSE often requires more writing volume and literature depth per subject. Tutors may charge slightly higher fees for ICSE English and Humanities.",
      },
      {
        question: "Does Mentr list ICSE tutors?",
        answer:
          "Yes. Search by subject and read profiles for ICSE in levels or bio. Post a requirement specifying ICSE board to receive matching pitches.",
      },
    ],
    relatedLinks: [
      { label: "Search tutors", href: "/search" },
      { label: "CBSE Class 10 study plan", href: "/blog/cbse-class-10-study-plan" },
      { label: "How to verify tutor credentials", href: "/blog/how-to-verify-tutor-credentials" },
      { label: "Home tutor vs online tutor", href: "/blog/home-tutor-vs-online-tutor" },
    ],
  },

  "how-parents-evaluate-tutor-trial-session": {
    slug: "how-parents-evaluate-tutor-trial-session",
    publishedAt: "2026-09-04",
    updatedAt: "2026-09-07",
    readTimeMinutes: 8,
    author: "Mentr Editorial Team",
    intro:
      "A trial tutoring session is the cheapest insurance you buy before committing ₹8,000–₹15,000 per month. Yet many parents treat it as a formality — they chat for ten minutes, feel polite, and sign up. This checklist helps you evaluate a trial objectively: what to observe while the tutor teaches, questions to ask your child afterward, and when to walk away without guilt.",
    sections: [
      {
        heading: "Before the trial: set it up to fail or pass fairly",
        blocks: [
          {
            type: "list",
            items: [
              "Pay for one or two sessions — free trials often attract tutors who oversell",
              "Use a real weak chapter, not revision the child already knows",
              "Sit within earshot (younger children) or review immediately after (teens)",
              "Tell the tutor you are evaluating fit — honest tutors respect this",
            ],
          },
        ],
      },
      {
        heading: "During the session: what to watch",
        blocks: [
          {
            type: "list",
            items: [
              "Does the tutor ask what the child already tried before explaining?",
              "Are explanations in simple language or jargon-heavy?",
              "Does the child get to attempt problems, or only watch demos?",
              "Is pace adjusted when the child hesitates?",
              "Phone distractions, tardiness, or rushing — note all three",
            ],
          },
          {
            type: "callout",
            title: "The five-minute rule",
            text: "If the child looks lost after five minutes and the tutor does not notice or simplify, that pattern rarely fixes itself in month two.",
          },
        ],
      },
      {
        heading: "After the session: ask your child these four questions",
        blocks: [
          {
            type: "list",
            ordered: true,
            items: [
              "Could you explain one thing they taught you back to me?",
              "Did you feel comfortable asking when confused?",
              "Was it too fast, too slow, or about right?",
              "Do you want another session with this person?",
            ],
          },
          {
            type: "paragraph",
            text: "Weight the child's willingness to continue heavily — forced tutoring fails even with qualified teachers. Combine their feedback with your observation on punctuality, preparation, and communication style.",
          },
        ],
      },
      {
        heading: "When to hire, wait, or walk away",
        blocks: [
          {
            type: "list",
            items: [
              "Hire: child understands better, tutor listens, clear plan for next four weeks",
              "Second trial: decent but unsure — book one more on a different chapter",
              "Walk away: no syllabus alignment, dismissive of questions, pressure to pay upfront for six months",
            ],
          },
        ],
      },
    ],
    faqs: [
      {
        question: "How many trial sessions should parents do?",
        answer:
          "Compare at least two tutors with one paid trial each before monthly booking. Three trials total is normal for important exams.",
      },
      {
        question: "Should parents stay in the room during trials?",
        answer:
          "For Class 8 and below, stay nearby. For older teens, give privacy but debrief immediately after.",
      },
      {
        question: "What if the tutor offers only package deals?",
        answer:
          "Insist on per-session payment until after a successful trial block. Long packages before fit is confirmed are a red flag.",
      },
    ],
    relatedLinks: [
      { label: "First tutoring session tips", href: "/blog/first-tutoring-session-tips" },
      { label: "Tutor red flags", href: "/blog/tutor-red-flags" },
      { label: "Browse tutors", href: "/search" },
      { label: "Safety checklist", href: "/blog/tutor-safety-checklist-parents" },
    ],
  },

  "neet-2027-study-plan-students": {
    slug: "neet-2027-study-plan-students",
    publishedAt: "2026-09-05",
    updatedAt: "2026-09-07",
    readTimeMinutes: 12,
    author: "Mentr Editorial Team",
    intro:
      "NEET 2027 is likely in May 2027. If you are in Class 12 CBSE or state board starting September 2026, you have roughly eight months to align boards, NCERT Biology, and mock test discipline. This month-by-month plan prioritises Biology (50% of the paper), keeps Physics numericals daily, and tells you when a NEET mentor earns their fee versus self-study with NCERT alone.",
    sections: [
      {
        heading: "September–October 2026: NCERT first pass",
        blocks: [
          {
            type: "paragraph",
            text: "Finish one complete NCERT reading cycle for Biology Class 11 and 12 — every line, every diagram label. Chemistry: Physical and Organic basics from NCERT. Physics: Mechanics and Modern Physics chapters linked to NEET past papers. Do not chase coaching modules until NCERT is done once.",
          },
          {
            type: "list",
            items: [
              "Biology: 2 hours daily — read + self-quiz same day",
              "Chemistry: 1.5 hours — NCERT examples + intext questions",
              "Physics: 1.5 hours — concept + 15 numericals daily",
              "Sunday: 50 MCQ mixed mock, untimed, open-book allowed first month",
            ],
          },
        ],
      },
      {
        heading: "November 2026–January 2027: boards + NEET overlap",
        blocks: [
          {
            type: "paragraph",
            text: "Pre-boards intensify. Protect board marks — they matter for eligibility and confidence. Shift evening slots to NEET MCQs after school homework. Add one full Biology NCERT revision cycle with chapter-end tests.",
          },
          {
            type: "callout",
            title: "When to hire a NEET Biology tutor",
            text: "If NCERT self-quizzing scores stay below 70% after six weeks, hire a mentor for weekly NCERT-based testing — not full re-teaching. Two hours per week of accountable quizzing beats twenty hours of passive lectures.",
          },
        ],
      },
      {
        heading: "February–March 2027: mock test season",
        blocks: [
          {
            type: "list",
            ordered: true,
            items: [
              "Two full-length mocks per week — strict timing",
              "48-hour error log: every wrong MCQ tagged concept vs silly vs time",
              "Biology: plant physiology, genetics, ecology — high-yield chapters twice",
              "Reduce new chapter starts — revision only last 21 days before NEET",
            ],
          },
        ],
      },
      {
        heading: "April–May 2027: taper and sleep",
        blocks: [
          {
            type: "paragraph",
            text: "Light mocks, heavy error notebook, normal sleep schedule. Avoid starting new coaching batches in April. A NEET mentor's job in this phase is mock analysis and anxiety management — not new content dumps.",
          },
        ],
      },
    ],
    faqs: [
      {
        question: "Is NCERT enough for NEET 2027?",
        answer:
          "NCERT is necessary and often sufficient for 550–600+ if mastered deeply. Most students need timed mock practice and error analysis — a mentor helps with accountability.",
      },
      {
        question: "How many hours should Class 12 NEET aspirants study daily?",
        answer:
          "6–8 focused hours outside school is typical from November onward. Quality beats 12 distracted hours with phone access.",
      },
      {
        question: "Can I prepare for NEET while in CBSE Class 12?",
        answer:
          "Yes — syllabus overlap is high. Align weekly plan so board practicals and pre-boards get fixed slots, not leftover time.",
      },
    ],
    relatedLinks: [
      { label: "NEET Biology weightage", href: "/blog/neet-biology-weightage" },
      { label: "Choose a JEE/NEET mentor", href: "/blog/how-to-choose-jee-neet-mentor" },
      { label: "Find NEET tutors", href: "/search?subject=Biology" },
      { label: "NEET coaching Bengaluru", href: "/exam-prep/neet-foundation-bengaluru" },
    ],
  },

  "jee-dropper-guide-2027": {
    slug: "jee-dropper-guide-2027",
    publishedAt: "2026-09-06",
    updatedAt: "2026-09-07",
    readTimeMinutes: 11,
    author: "Mentr Editorial Team",
    intro:
      "A drop year for JEE Main and Advanced works when it is a diagnosed reset — not a default after a disappointing rank. Repeaters who jump into the same coaching schedule without fixing mock analysis habits often score within 10 percentile points of the first attempt. This guide covers the dropper decision, a realistic 2026–27 calendar starting September, when one-on-one mentoring beats batch coaching, and emotional guardrails families ignore until burnout hits.",
    sections: [
      {
        heading: "Should you drop — honest criteria",
        blocks: [
          {
            type: "list",
            items: [
              "Drop if: mock trend was upward, one subject dragged rank, you can commit 6+ focused hours daily",
              "Reconsider if: mocks flat for six months, motivation was external only, mental health fragile",
              "Never drop without a written weekly plan — open-ended 'I will try again' fails",
            ],
          },
        ],
      },
      {
        heading: "September 2026–February 2027: fix diagnosis",
        blocks: [
          {
            type: "paragraph",
            text: "Month one is audit month. Pull every mock from the last attempt. Tag errors: concept gap, calculation, time management, panic guessing. Subject-wise, list chapters never completed vs completed but weak. Only then choose materials — do not rebuy the same coaching package by default.",
          },
          {
            type: "list",
            ordered: true,
            items: [
              "Weeks 1–4: error audit + NCERT gaps for weakest subject",
              "Weeks 5–12: one subject intensive block (often Maths or Physics)",
              "Weekly: 2 full mocks with 48-hour analysis before new chapters",
              "One mentor session weekly for mock review — not daily passive lectures",
            ],
          },
        ],
      },
      {
        heading: "March–April 2027: JEE Main peak",
        blocks: [
          {
            type: "paragraph",
            text: "Shift to paper-wise strategy: Main requires speed and breadth; Advanced requires depth in fewer topics. Dropper students often over-prepare Advanced topics before securing Main confidence — fix Main percentile first if Session 1 is weak.",
          },
        ],
      },
      {
        heading: "Mentor vs batch for droppers",
        blocks: [
          {
            type: "callout",
            title: "Dropper sweet spot",
            text: "Hybrid: free or low-cost recorded content for new concepts + one local or online mentor for weekly mock analysis and schedule enforcement. Full batch repetition without personalised error tracking wastes a drop year.",
          },
        ],
      },
    ],
    faqs: [
      {
        question: "Is a drop year worth it for JEE?",
        answer:
          "Worth it when mock analysis improves measurably within eight weeks of structured prep. Not worth it when the plan is 'same coaching, hope for luck.'",
      },
      {
        question: "How many JEE droppers get into IIT?",
        answer:
          "A meaningful share of IIT seats go to repeaters — but selection correlates with daily problem count and mock review quality, not drop label alone.",
      },
      {
        question: "Should droppers join a new coaching institute?",
        answer:
          "Only if the previous institute lacked test analysis. Otherwise change the accountability layer (mentor) before changing the entire brand.",
      },
    ],
    relatedLinks: [
      { label: "JEE Main 2027 timeline", href: "/blog/jee-main-2027-preparation-timeline" },
      { label: "Online vs local JEE coaching", href: "/blog/online-vs-local-jee-neet-coaching" },
      { label: "Find JEE mentors", href: "/search?subject=Exam%20Prep" },
      { label: "JEE coaching Bengaluru", href: "/exam-prep/jee-coaching-bengaluru" },
    ],
  },

  "when-to-hire-physics-tutor-class-11-12": {
    slug: "when-to-hire-physics-tutor-class-11-12",
    publishedAt: "2026-09-06",
    updatedAt: "2026-09-07",
    readTimeMinutes: 9,
    author: "Mentr Editorial Team",
    intro:
      "Class 11 Physics is where many CBSE and ICSE students first hit a wall — vectors, calculus-flavoured kinematics, and Thermodynamics abstractions. Class 12 adds Optics and Modern Physics with board exam writing discipline plus JEE-style numericals. Not every student needs a year-long tutor; some need six weeks on Mechanics only. This guide helps parents decide timing, format (online vs home), and how to spot a Physics tutor who teaches thinking, not formula sheets.",
    sections: [
      {
        heading: "Signs your child needs a Physics tutor now",
        blocks: [
          {
            type: "list",
            items: [
              "Cannot set up free-body diagrams without prompting",
              "Gets numerical answer wrong despite 'knowing the formula'",
              "School test scores below 55% for two consecutive units",
              "JEE/NEET aspirant skipping Physics mocks due to fear",
              "Board exam in 4 months and derivations never practiced",
            ],
          },
        ],
      },
      {
        heading: "What a strong Class 11–12 Physics tutor does",
        blocks: [
          {
            type: "paragraph",
            text: "They start from units and dimensional analysis, force students to draw before calculate, and link NCERT derivations to exam questions. They assign daily numericals — 8 to 12 per session minimum for JEE track — and review mistakes first next class. They do not read the textbook aloud for an hour.",
          },
          {
            type: "list",
            items: [
              "NCERT Examples and Exercises done on board with student attempt first",
              "Previous 5 years CBSE board questions for Class 12 units",
              "For JEE: HC Verma or equivalent problem sets in phased blocks",
              "Weekly mini-test of 30 minutes — parent gets score trend",
            ],
          },
        ],
      },
      {
        heading: "Timing: hire by month",
        blocks: [
          {
            type: "list",
            items: [
              "Class 11 July–August: after first unit test if Mechanics weak",
              "Class 12 September: before Optics and EMI pile up",
              "Drop year: immediately — Physics gap compounds weekly",
              "Board-only student: January is late; start November for derivations",
            ],
          },
        ],
      },
    ],
    faqs: [
      {
        question: "How much does a Physics tutor cost in Bengaluru for Class 12?",
        answer:
          "₹500–₹900 per hour for home tuition; ₹400–₹700 online. JEE-specialist tutors charge at the high end.",
      },
      {
        question: "Can one tutor cover Physics for boards and JEE?",
        answer:
          "Yes, if they allocate separate problem sets — board writing practice plus JEE numericals. Confirm in trial session.",
      },
      {
        question: "Online or home for Physics tutoring?",
        answer:
          "Online works with a tablet for diagrams. Home helps distracted Class 11 students. Try one format for three weeks before switching.",
      },
    ],
    relatedLinks: [
      { label: "Physics tutors Bengaluru", href: "/areas/indiranagar/physics-tutor" },
      { label: "JEE Main 2027 timeline", href: "/blog/jee-main-2027-preparation-timeline" },
      { label: "Browse Physics tutors", href: "/search?subject=Physics" },
      { label: "Choose JEE/NEET mentor", href: "/blog/how-to-choose-jee-neet-mentor" },
    ],
  },

  "online-tutoring-setup-guide-students-india": {
    slug: "online-tutoring-setup-guide-students-india",
    publishedAt: "2026-09-07",
    updatedAt: "2026-09-07",
    readTimeMinutes: 8,
    author: "Mentr Editorial Team",
    intro:
      "Bad Wi-Fi, a messy desk, and notifications on — three reasons online tutoring fails before the tutor says hello. Students in India can get more from online sessions than classroom coaching when the setup is right. This practical guide covers device, internet, apps, camera angle, note-taking, and house rules that make Google Meet or Zoom sessions feel as focused as a desk at a tuition centre.",
    sections: [
      {
        heading: "Minimum tech setup (2026)",
        blocks: [
          {
            type: "list",
            items: [
              "Laptop or tablet with stylus for maths/science — phone-only is last resort",
              "Stable broadband: 10 Mbps up/down minimum; ethernet beats Wi-Fi for exams season",
              "Headphones with mic — cuts echo and family noise",
              "Google Meet or Zoom installed; test link 5 minutes early",
              "Phone on silent in another room — not face-down on desk",
            ],
          },
        ],
      },
      {
        heading: "Physical setup matters",
        blocks: [
          {
            type: "paragraph",
            text: "Face a window or light source — tutors need to see your face when you are stuck. Keep textbook, notebook, and pen ready before join. Use a plain wall background if possible. For maths, a small whiteboard or paper taped to wall lets you hold up working to camera.",
          },
          {
            type: "callout",
            title: "Parent role",
            text: "One knock-free hour. Younger students: parent sets up tech then leaves. Teens: parent checks in after, not during.",
          },
        ],
      },
      {
        heading: "Session habits that online tutors love",
        blocks: [
          {
            type: "list",
            ordered: true,
            items: [
              "Send weak chapter list or photos of school questions before session",
              "Attempt problems while tutor watches — do not hide confusion",
              "Screenshot key explanations into a running Google Doc or notebook",
              "End with 2-minute recap: what to practice before next class",
            ],
          },
        ],
      },
      {
        heading: "When online is not working",
        blocks: [
          {
            type: "paragraph",
            text: "Switch format if: three sessions in a row with connectivity drops, student hides off-camera, or tutor only lectures without seeing student work. Try hybrid — fortnightly in-person review with weekly online — or change tutor before blaming 'online doesn't work for my child.'",
          },
        ],
      },
    ],
    faqs: [
      {
        question: "Is mobile data enough for online tutoring?",
        answer:
          "4G can work for audio + screen share but breaks on rainy days or peak hours. Fixed broadband is worth it for Class 10+ regular sessions.",
      },
      {
        question: "Which app do Mentr tutors use?",
        answer:
          "Most use Google Meet or Zoom — agreed on WhatsApp after connect. Mentr does not force proprietary video software.",
      },
      {
        question: "Can students share screens safely?",
        answer:
          "Share only the app window with homework — not full desktop with notifications. Parents should review privacy settings for minors.",
      },
    ],
    relatedLinks: [
      { label: "Prepare for tutor sessions", href: "/blog/how-students-prepare-for-tutor-sessions" },
      { label: "Online tutoring safety", href: "/blog/online-tutoring-safety-kids" },
      { label: "Find online tutors India", href: "/find-online-tutors/india" },
      { label: "Browse tutors", href: "/search" },
    ],
  },
};
