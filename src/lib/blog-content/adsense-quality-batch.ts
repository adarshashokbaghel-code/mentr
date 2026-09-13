import type { ArticleContent } from "./types";

/**
 * Full replacements for the Jul-19 thin template posts.
 * Those ~150-word near-duplicates hurt AdSense content-quality review.
 */
export const ADSENSE_QUALITY_BATCH: Record<string, ArticleContent> = {
  "find-tutors-online-free-india": {
    slug: "find-tutors-online-free-india",
    publishedAt: "2026-07-19",
    updatedAt: "2026-09-13",
    readTimeMinutes: 11,
    author: "Mentr Editorial Team",
    intro:
      "Indian parents searching for tutors online usually hit the same wall: platforms that hide contacts behind coins, agencies that take a cut, or WhatsApp groups that flood with unverified replies. Free search is possible — but only if you know which platforms charge whom, what verification actually means, and how to run a safe trial before you commit. This guide walks through how to find tutors online in India for CBSE, ICSE, State boards, JEE, and NEET without paying lead fees, and how Mentr fits that workflow.",
    sections: [
      {
        heading: "What “free tutor search” should mean in India",
        blocks: [
          {
            type: "paragraph",
            text: "Free should mean you can browse profiles, compare subjects and boards, and start a conversation without buying a contact pack. Session fees still belong to the tutor — that is fair. What parents should not pay for is the right to see a phone number or unlock a message. Many Indian marketplaces reverse that: tutors buy leads, parents pay for contacts, or both, which raises the price of tuition before the first class starts.",
          },
          {
            type: "list",
            items: [
              "Browse without login walls where possible — compare three profiles before you sign up",
              "Prefer ID-checked listings over anonymous group replies",
              "Confirm board (CBSE / ICSE / State) and class before messaging",
              "Keep session fees between you and the tutor — no platform commission",
            ],
          },
        ],
      },
      {
        heading: "CBSE, ICSE, and competitive exam tutors — filter first",
        blocks: [
          {
            type: "paragraph",
            text: "A Class 10 CBSE Maths tutor is not interchangeable with an ICSE English mentor or a JEE Physics specialist. Write your need in one line: board, class, subject, mode (online or home), and weekly hours. Use that line when you search and again in your connect note. Parents who skip board matching waste trials on tutors who teach the wrong textbook pattern.",
          },
          {
            type: "paragraph",
            text: "For JEE and NEET, ask whether the tutor follows current syllabus weightage, sets timed mocks, and reviews error logs — not only “covers chapters.” Foundation students (Class 8–10) need concept pace; droppers need exam simulation. Say which you are hiring for.",
          },
        ],
      },
      {
        heading: "How to hire on Mentr without lead fees",
        blocks: [
          {
            type: "list",
            ordered: true,
            items: [
              "Open Find online tutors (India) or Search and filter by subject and online mode",
              "Shortlist 3–5 verified profiles — check experience, slots, and bio for your board",
              "Sign in as a parent and send a connect request with class, board, and timing",
              "Wait for acceptance — WhatsApp unlocks only then, which cuts spam for both sides",
              "Book a paid trial (one or two sessions) before a monthly package",
            ],
          },
          {
            type: "callout",
            title: "Alternative: post a requirement",
            text: "If you know the need but not the person, post subject, class, area or online preference, and budget. Tutors pitch; you stay anonymous until you accept. Still ₹0 platform fee.",
          },
        ],
      },
      {
        heading: "Fees you should expect in 2026",
        blocks: [
          {
            type: "paragraph",
            text: "Online school-subject sessions in India commonly range from ₹400–₹900 per hour for Classes 6–10, and ₹800–₹1,800+ for Class 11–12 or competitive prep, depending on city of the tutor, experience, and demand. Mentr does not set prices — you negotiate directly. Confirm currency (INR), cancellation window, and whether materials or mock tests are included.",
          },
          {
            type: "paragraph",
            text: "Avoid large advances for “full year packages” before a trial. Pay for the trial first, then decide. If a tutor refuses any trial and demands a big prepaid block, treat that as a red flag.",
          },
        ],
      },
      {
        heading: "Safety checklist before day one",
        blocks: [
          {
            type: "list",
            items: [
              "Verified badge on the profile — still ask for a quick credential talk on the trial",
              "First sessions with a parent nearby for younger students; camera on for online",
              "No private chats that bypass the agreed schedule without your knowledge",
              "Keep payment records (UPI / bank) with the tutor’s real name",
            ],
          },
        ],
      },
    ],
    faqs: [
      {
        question: "Can I find tutors online in India without paying the platform?",
        answer:
          "Yes. On Mentr, search, connect requests, and requirement posts are free. You only pay the tutor for sessions you agree to.",
      },
      {
        question: "Is online tuition as effective as home tuition?",
        answer:
          "For focused subjects and older students, yes — if the desk setup is quiet and the tutor uses a shared whiteboard or clear camera. Younger students often do better with hybrid or home visits.",
      },
      {
        question: "How do I know a tutor is verified?",
        answer:
          "Mentr’s Verified badge means identity and credential review cleared. Always still run a teaching trial to judge fit.",
      },
      {
        question: "Where should I start searching?",
        answer:
          "Use Find online tutors for India, filter your subject, then send connect requests to two or three shortlisted profiles the same day.",
      },
    ],
    relatedLinks: [
      { label: "Find online tutors in India", href: "/find-online-tutors/india" },
      { label: "Verified online tutors", href: "/find-verified-online-tutors/india" },
      { label: "How Mentr verifies tutors", href: "/blog/how-mentr-verifies-tutors" },
      { label: "Browse tutors", href: "/search" },
    ],
  },

  "find-maths-tutor-online-verified": {
    slug: "find-maths-tutor-online-verified",
    publishedAt: "2026-07-19",
    updatedAt: "2026-09-13",
    readTimeMinutes: 12,
    author: "Mentr Editorial Team",
    intro:
      "Maths is the subject parents search for most when hiring online tutors — from Class 6 fractions to Class 12 calculus and JEE problem sets. A verified maths tutor online should match your board, explain concepts without skipping steps, and show how they handle homework and tests. This guide covers what to check, typical fees, and how to hire on Mentr without lead fees.",
    sections: [
      {
        heading: "Match the tutor to the maths your child actually needs",
        blocks: [
          {
            type: "paragraph",
            text: "“Maths tutor” is too vague. Class 8 NCERT needs different pacing than ICSE Class 10 or JEE Main algebra. Write: board, class, weak chapters, and goal (school marks, board exam, or entrance). Share that in the first message so tutors can self-select.",
          },
          {
            type: "list",
            items: [
              "School maths (Classes 6–10): NCERT / ICSE textbook fidelity and weekly practice",
              "Board Class 11–12: derivations, application problems, and exam timing",
              "JEE / olympiad track: problem selection, timed mocks, and error analysis",
              "Remedial: number sense and word problems before rushing ahead",
            ],
          },
        ],
      },
      {
        heading: "What “verified” should cover for maths tutors",
        blocks: [
          {
            type: "paragraph",
            text: "Platform verification usually means identity and basic credential checks — not a guarantee of teaching skill. On the trial, ask the tutor to solve one problem from your child’s last test and explain it as if teaching a confused student. Watch whether they jump to the answer or rebuild the concept.",
          },
          {
            type: "callout",
            title: "Trial session test",
            text: "Bring one recent wrong answer. A strong maths tutor diagnoses the misconception in under ten minutes and leaves a short practice set — not only a lecture.",
          },
        ],
      },
      {
        heading: "Hiring a verified maths tutor on Mentr",
        blocks: [
          {
            type: "list",
            ordered: true,
            items: [
              "Filter Search or Find verified online tutors for Mathematics",
              "Read bios for board keywords (CBSE, ICSE, JEE) and years of experience",
              "Check open slots against your weekday evenings or weekend block",
              "Send a connect request naming class, board, and two weak topics",
              "After WhatsApp unlocks, book a paid trial before a monthly plan",
            ],
          },
          {
            type: "paragraph",
            text: "Online maths works best with a shared digital whiteboard or clear notebook camera. Ask which tool the tutor uses (Google Meet + whiteboard, Zoom annotate, or tablet). Confirm your child’s device can share the screen for homework review.",
          },
        ],
      },
      {
        heading: "Fee ranges and packaging",
        blocks: [
          {
            type: "paragraph",
            text: "In 2026, online maths in India often runs ₹500–₹1,000/hour for middle school, ₹800–₹1,500 for Classes 9–10, and ₹1,000–₹2,000+ for Class 11–12 or JEE-oriented mentors. Packages of 8–12 sessions are common; insist on a written cancel policy. Mentr never takes a cut — you pay the tutor directly.",
          },
        ],
      },
      {
        heading: "Red flags specific to maths hiring",
        blocks: [
          {
            type: "list",
            items: [
              "Promises of “rank guarantee” without a diagnostic test",
              "Refuses to look at school notebooks or recent papers",
              "Only assigns YouTube links instead of live working",
              "Demands full-year payment before any trial class",
            ],
          },
        ],
      },
    ],
    faqs: [
      {
        question: "How do I find a verified maths tutor online?",
        answer:
          "Use a platform that reviews ID and credentials, then run a teaching trial. On Mentr, filter for Mathematics, send a free connect request, and trial after WhatsApp unlocks.",
      },
      {
        question: "Should I hire a school teacher or a JEE mentor for Class 9?",
        answer:
          "Most Class 9 students need school-aligned teaching first. Bring in JEE-style mentors only if foundations are strong and the goal is clearly competitive prep.",
      },
      {
        question: "Is Mentr free to search for maths tutors?",
        answer:
          "Yes. Browse and connect for ₹0. Session fees are arranged with the tutor.",
      },
    ],
    relatedLinks: [
      { label: "Find verified online tutors", href: "/find-verified-online-tutors" },
      { label: "Maths tutors in Bengaluru", href: "/subjects/mathematics-tutors-bengaluru" },
      { label: "How to choose a good home tutor", href: "/blog/how-to-find-a-good-home-tutor" },
      { label: "Browse tutors", href: "/search" },
    ],
  },

  "find-english-tutor-online-india": {
    slug: "find-english-tutor-online-india",
    publishedAt: "2026-07-19",
    updatedAt: "2026-09-13",
    readTimeMinutes: 11,
    author: "Mentr Editorial Team",
    intro:
      "Online English tutors in India cover three very different jobs: spoken fluency, school literature and grammar (CBSE/ICSE), and exam writing (boards, IELTS foundation, or competitive English). Hiring the wrong type wastes months. This guide helps parents and students match the need, verify the tutor, and connect free on Mentr.",
    sections: [
      {
        heading: "Pick the English track before you search",
        blocks: [
          {
            type: "list",
            items: [
              "Spoken English / confidence: conversation drills, pronunciation, daily topics",
              "School English: grammar, comprehension, literature answers, essay structure",
              "Exam writing: timed answers, formats, and marking-scheme awareness",
              "Early IELTS / interview English: for older teens preparing abroad or placements",
            ],
          },
          {
            type: "paragraph",
            text: "Tell the tutor which track you need in the first message. A literature specialist may not run spoken drills; a spoken-English coach may not know ICSE poetry marking.",
          },
        ],
      },
      {
        heading: "What good online English sessions look like",
        blocks: [
          {
            type: "paragraph",
            text: "Strong sessions mix talk time with written correction. For school English, the tutor should mark a paragraph live and explain why a sentence scores or loses marks. For spoken English, the student should speak more than half the session — not listen to a monologue.",
          },
          {
            type: "callout",
            title: "Ask on the trial",
            text: "“Can you mark one of my child’s recent answers and rewrite one paragraph with me watching?” That single exercise reveals teaching style faster than any bio.",
          },
        ],
      },
      {
        heading: "How to find English tutors on Mentr",
        blocks: [
          {
            type: "list",
            ordered: true,
            items: [
              "Open Find online tutors (India) and filter for English",
              "Read profiles for board mentions, languages taught, and mode",
              "Send a connect request with class, board, and whether you need spoken or school English",
              "After acceptance, schedule a trial with a real homework sample ready",
            ],
          },
          {
            type: "paragraph",
            text: "Mentr keeps WhatsApp private until the tutor accepts, which reduces spam. Session fees stay between you and the tutor — no platform commission.",
          },
        ],
      },
      {
        heading: "Fees and frequency",
        blocks: [
          {
            type: "paragraph",
            text: "Online English in India often ranges ₹400–₹1,200 per hour depending on level and goals. Twice weekly works for school improvement; daily short sessions suit spoken fluency. Agree on homework between classes — English improves with writing volume, not only live talk.",
          },
        ],
      },
      {
        heading: "CBSE vs ICSE English — why board matching matters",
        blocks: [
          {
            type: "paragraph",
            text: "ICSE literature and language papers reward detailed textual reference and richer vocabulary; CBSE emphasises NCERT alignment and structured long answers. A tutor who only coaches spoken English may help confidence but miss board marking schemes. Ask which textbooks and sample papers they used last term, and whether they mark answers against the board’s expected format.",
          },
          {
            type: "paragraph",
            text: "For competitive or interview English later, layer spoken drills after school foundations are stable. Mixing too many goals in one hour usually dilutes progress — decide the primary outcome for the next eight weeks.",
          },
        ],
      },
    ],
    faqs: [
      {
        question: "Can I find English tutors online free to contact?",
        answer:
          "On Mentr, yes — search and connect requests are free. You pay only for sessions you book with the tutor.",
      },
      {
        question: "Home tutor or online for English?",
        answer:
          "Online works well for spoken drills and writing feedback. Younger children who struggle with attention may still prefer an in-person tutor for the first months.",
      },
      {
        question: "Should I hire a native speaker?",
        answer:
          "Clarity and teaching skill matter more than accent for school English. For spoken confidence, many Indian tutors with strong communication skills work excellently.",
      },
    ],
    relatedLinks: [
      { label: "Find online tutors in India", href: "/find-online-tutors/india" },
      { label: "English tutors Bengaluru", href: "/subjects/english-tutors-bengaluru" },
      { label: "Tutor safety checklist", href: "/blog/tutor-safety-checklist-parents" },
      { label: "Browse tutors", href: "/search" },
    ],
  },

  "find-online-tutors-verified-free": {
    slug: "find-online-tutors-verified-free",
    publishedAt: "2026-07-19",
    updatedAt: "2026-09-13",
    readTimeMinutes: 12,
    author: "Mentr Editorial Team",
    intro:
      "Searching for “verified online tutors” should not dump you into coin wallets and paid contact unlocks. Verification is a safety signal — ID and credential review — while free connect means you can message without buying a lead. Here is how those two ideas work together on Mentr, and what you should still check yourself.",
    sections: [
      {
        heading: "Verification vs teaching quality",
        blocks: [
          {
            type: "paragraph",
            text: "A Verified badge means the platform reviewed identity and submitted credentials before the profile went live. It does not certify that the tutor is the best teacher for your child. Treat verification as the floor: you still run a trial, check board fit, and watch how the tutor handles a real doubt.",
          },
          {
            type: "list",
            items: [
              "Identity check — reduces fake names and recycled photos",
              "Credential review — degrees, teaching claims, or experience notes",
              "Your trial — the only reliable test of teaching fit",
              "Ongoing judgment — cancel politely if sessions stop helping",
            ],
          },
        ],
      },
      {
        heading: "Why free connect matters",
        blocks: [
          {
            type: "paragraph",
            text: "When tutors pay per lead, they chase volume. When parents pay to unlock numbers, comparison shopping dies. Free connect on Mentr lets you shortlist calmly: send a request, wait for acceptance, then move to WhatsApp. Numbers stay hidden until both sides agree — which cuts spam.",
          },
          {
            type: "callout",
            title: "₹0 platform fee",
            text: "Mentr does not charge coins, lead packs, or commission on tuition. Session fees are private between parent and tutor.",
          },
        ],
      },
      {
        heading: "Step-by-step: hire a verified online tutor",
        blocks: [
          {
            type: "list",
            ordered: true,
            items: [
              "Open Find verified online tutors and filter subject + online mode",
              "Open 3–5 profiles — note experience, slots, and board language in the bio",
              "Send connect requests with class, board, city/time zone, and goal",
              "Accept or wait for tutor acceptance — then schedule a trial on WhatsApp",
              "Pay only for sessions you agree to; skip large advances pre-trial",
            ],
          },
        ],
      },
      {
        heading: "Online setup that makes verified tutors more effective",
        blocks: [
          {
            type: "paragraph",
            text: "Verification cannot fix a bad desk. Use a quiet space, stable Wi-Fi, and a device that can show notebooks clearly. Agree on camera norms for kids, and keep a parent nearby for the first few sessions. Ask the tutor how they share worksheets and track homework between classes.",
          },
        ],
      },
    ],
    faqs: [
      {
        question: "Are verified tutors free to contact on Mentr?",
        answer:
          "Yes. Search and connect requests are free. WhatsApp unlocks after the tutor accepts.",
      },
      {
        question: "What does Mentr verify?",
        answer:
          "Identity and credential materials submitted at listing time. Teaching fit is still judged in a trial session.",
      },
      {
        question: "Can I hire verified tutors outside my city?",
        answer:
          "Yes — filter for online mode. Availability shows in your time zone for cross-city and cross-country sessions.",
      },
    ],
    relatedLinks: [
      { label: "Find verified online tutors", href: "/find-verified-online-tutors" },
      { label: "How Mentr verifies tutors", href: "/blog/how-mentr-verifies-tutors" },
      { label: "Find tutors online safely", href: "/blog/how-to-find-tutor-online-safely" },
      { label: "Find online tutors", href: "/find-online-tutors" },
    ],
  },

  "how-to-find-tutor-online-safely": {
    slug: "how-to-find-tutor-online-safely",
    publishedAt: "2026-07-19",
    updatedAt: "2026-09-13",
    readTimeMinutes: 12,
    author: "Mentr Editorial Team",
    intro:
      "Online tutoring is convenient — and it removes the in-person cues parents rely on. Safety is mostly process: verified platforms, video trials, clear payment rules, and session boundaries. Use this checklist before day one, whether you hire for maths, English, or exam prep.",
    sections: [
      {
        heading: "Start on platforms that hide numbers until acceptance",
        blocks: [
          {
            type: "paragraph",
            text: "Open Facebook groups and raw classifieds expose phone numbers immediately. Prefer systems where contact unlocks only after mutual acceptance. On Mentr, parents send a connect request; WhatsApp appears only when the tutor accepts. That single design choice blocks most spam.",
          },
          {
            type: "list",
            items: [
              "Avoid sharing home address on first message",
              "Do not pay large advances to personal accounts you cannot verify",
              "Keep early chats on record (platform + WhatsApp) for accountability",
              "For minors, a parent should join the first video session",
            ],
          },
        ],
      },
      {
        heading: "Video trial rules that protect kids",
        blocks: [
          {
            type: "paragraph",
            text: "Agree before session one: camera on for teaching time, no recording without consent, and sessions in a shared family space when possible. If a tutor asks to move to an unrecorded private app for “extra classes” and payment outside any trail, pause and reassess.",
          },
          {
            type: "callout",
            title: "Parent presence",
            text: "For Class 3–8, stay within earshot for the first two weeks. For older students, a check-in at the start and end of each session is enough.",
          },
        ],
      },
      {
        heading: "Credential and reference checks",
        blocks: [
          {
            type: "paragraph",
            text: "Ask for a short story of recent students (board, improvement, without private details). On trial, request one marked sample or a live explanation of a recent school question. Verified badges help, but teaching proof lives in the session.",
          },
          {
            type: "list",
            ordered: true,
            items: [
              "Shortlist verified profiles on Mentr",
              "Send connect notes that state age group and subject clearly",
              "Run a paid trial with a real homework problem",
              "Confirm fees, cancel policy, and tools in writing on WhatsApp",
              "Start with a small package (4–8 sessions) before longer commitments",
            ],
          },
        ],
      },
      {
        heading: "Payment safety",
        blocks: [
          {
            type: "paragraph",
            text: "Pay via UPI or bank transfer to a name that matches the tutor’s identity. Avoid gift cards and crypto. Never share OTPs. If someone claiming to be “Mentr support” asks for money or passwords, it is a scam — Mentr does not charge parents to connect.",
          },
        ],
      },
    ],
    faqs: [
      {
        question: "Is it safe to hire tutors online for children?",
        answer:
          "Yes, with boundaries: verified profiles, parent-joined early sessions, camera norms, and no large prepayments. Use a platform that delays WhatsApp until acceptance.",
      },
      {
        question: "What is the biggest online tutoring red flag?",
        answer:
          "Pressure for large advances before any trial, or requests to move entirely off-platform into secrecy while still demanding payment.",
      },
      {
        question: "Does Mentr charge for safety features?",
        answer:
          "No. Verification, search, and connect are free. Session fees are between you and the tutor.",
      },
    ],
    relatedLinks: [
      { label: "Tutor safety checklist", href: "/blog/tutor-safety-checklist-parents" },
      { label: "Online tutoring safety for kids", href: "/blog/online-tutoring-safety-kids" },
      { label: "Find verified online tutors", href: "/find-verified-online-tutors" },
      { label: "How Mentr verifies tutors", href: "/blog/how-mentr-verifies-tutors" },
    ],
  },

  "find-mentors-near-me-online": {
    slug: "find-mentors-near-me-online",
    publishedAt: "2026-07-19",
    updatedAt: "2026-09-13",
    readTimeMinutes: 11,
    author: "Mentr Editorial Team",
    intro:
      "“Mentors near me” can mean a career coach in your city — or an online mentor in your time zone who has already walked the path you want. Local helps for in-person accountability; online unlocks specialists you will never meet on your street. This guide shows how to decide, what to ask, and how to connect free on Mentr.",
    sections: [
      {
        heading: "Mentor vs tutor — clarify the job",
        blocks: [
          {
            type: "paragraph",
            text: "Tutors teach a syllabus. Mentors help with decisions, portfolios, interview stories, and long-term skill paths — coding careers, design, entrepreneurship, or stream choice after Class 10. If you need marks in Chemistry this term, hire a tutor. If you need someone to review your GitHub and internship plan, hire a mentor.",
          },
          {
            type: "list",
            items: [
              "Local mentor: coffee chats, campus familiarity, city job market",
              "Online mentor: niche expertise, flexible hours, cross-city experience",
              "Hybrid: monthly in-person + weekly video works well for many professionals",
            ],
          },
        ],
      },
      {
        heading: "How to search mentors near you (or online)",
        blocks: [
          {
            type: "list",
            ordered: true,
            items: [
              "Write a one-paragraph goal: role you want, timeline, and what feedback you need",
              "Open Find mentors near me or filter Search by mentor / skill subjects",
              "Shortlist people whose bios match your stack or industry — not only nearby pin codes",
              "Send a connect request with your goal paragraph attached",
              "Book a paid intro session; agree on cadence (biweekly is common)",
            ],
          },
          {
            type: "callout",
            title: "Free to connect",
            text: "Mentr does not charge lead fees for mentors or parents/students. WhatsApp unlocks after acceptance.",
          },
        ],
      },
      {
        heading: "Questions that separate real mentors from vague coaches",
        blocks: [
          {
            type: "list",
            items: [
              "What decisions did you help someone make in the last six months?",
              "Will you review my actual work (resume, code, portfolio) live?",
              "How do you measure progress after four sessions?",
              "What is out of scope (e.g. doing the assignment for me)?",
            ],
          },
        ],
      },
      {
        heading: "Fees and expectations",
        blocks: [
          {
            type: "paragraph",
            text: "Skill and career mentoring rates vary widely — from modest hourly fees for early-career mentors to premium rates for specialised industry coaches. Agree on preparation: you send materials 24 hours ahead. Mentoring fails when sessions become unstructured venting without artifacts to review.",
          },
        ],
      },
    ],
    faqs: [
      {
        question: "Can I find mentors near me for free on Mentr?",
        answer:
          "Search and connect are free. Mentoring session fees are arranged directly with the mentor.",
      },
      {
        question: "Should I only hire mentors in my city?",
        answer:
          "Only if you need in-person meetings. For coding, design, and career advice, online mentors in your time zone are often a better skill match.",
      },
      {
        question: "How is a mentor different from a tutor on Mentr?",
        answer:
          "Filter by subject and read the profile. Mentors emphasise careers and skills; tutors emphasise school and exam syllabi. Many profiles are clear about which they offer.",
      },
    ],
    relatedLinks: [
      { label: "Find mentors near me", href: "/find-mentors-near-me" },
      { label: "Programming mentors", href: "/find-mentors/programming" },
      { label: "Find a career mentor free", href: "/blog/how-to-find-career-mentor-free" },
      { label: "Browse mentors", href: "/search?kind=mentor" },
    ],
  },

  "find-coding-mentor-online": {
    slug: "find-coding-mentor-online",
    publishedAt: "2026-07-19",
    updatedAt: "2026-09-13",
    readTimeMinutes: 12,
    author: "Mentr Editorial Team",
    intro:
      "A coding mentor online is not another YouTube playlist. Good mentors review your code, force clearer problem decomposition, and map a path through DSA, web projects, or career switching. Here is how to find one, what to prepare, and how to hire without paying platform lead fees.",
    sections: [
      {
        heading: "Decide what kind of coding help you need",
        blocks: [
          {
            type: "list",
            items: [
              "School / Class 11–12 Computer Science — syllabus and board practicals",
              "DSA + interviews — patterns, timed practice, mock interviews",
              "Web / app projects — architecture, code review, shipping a portfolio",
              "Career switch — learning plan, project selection, resume storytelling",
            ],
          },
          {
            type: "paragraph",
            text: "State your stack (Python, Java, JavaScript, etc.) and goal in the first message. Mentors waste sessions rediscovering that you actually need SQL interviews, not React tutorials.",
          },
        ],
      },
      {
        heading: "What to send before the first paid session",
        blocks: [
          {
            type: "paragraph",
            text: "Share a GitHub link or a zipped mini-project, one failing problem, and your weekly time budget. Mentors who refuse to look at your code and only sell a fixed curriculum may be running a batch product — fine for some learners, wrong if you need personal review.",
          },
          {
            type: "callout",
            title: "Trial agenda (45–60 min)",
            text: "10 minutes goals, 30 minutes live code review or problem, 10 minutes plan for the next four weeks.",
          },
        ],
      },
      {
        heading: "Hiring on Mentr",
        blocks: [
          {
            type: "list",
            ordered: true,
            items: [
              "Open Find mentors → programming, or Search for Coding",
              "Read bios for DSA, web, or career keywords that match your need",
              "Send a connect request with stack, goal, and time zone",
              "After WhatsApp unlocks, share GitHub and book a trial",
              "Agree on tools (Meet, Replit, CodeSandbox) and homework cadence",
            ],
          },
          {
            type: "paragraph",
            text: "Mentr is free to list and free to connect. Mentors keep 100% of session fees — which attracts practitioners who refuse coin-based lead marketplaces.",
          },
        ],
      },
      {
        heading: "Fees and progress tracking",
        blocks: [
          {
            type: "paragraph",
            text: "Online coding mentorship in India often ranges from mid hundreds to a few thousand rupees per hour depending on experience. Track progress with artifacts: merged PRs, solved pattern sheets, or mock interview scores — not vibes. Re-evaluate after four sessions.",
          },
        ],
      },
    ],
    faqs: [
      {
        question: "How do I find a coding mentor online for free contact?",
        answer:
          "Use Mentr’s programming mentor pages, send a free connect request, and move to WhatsApp after acceptance.",
      },
      {
        question: "Tutor or mentor for DSA?",
        answer:
          "If you need syllabus teaching, start with a tutor. If you need interview strategy and code review, hire a mentor. Some profiles offer both — ask in the trial.",
      },
      {
        question: "Do I need to be advanced before hiring a mentor?",
        answer:
          "No. Beginners benefit from a learning plan. Bring honesty about your level so the mentor does not skip fundamentals.",
      },
    ],
    relatedLinks: [
      { label: "Programming mentors", href: "/find-mentors/programming" },
      { label: "Find programming mentor worldwide", href: "/blog/find-programming-mentor-worldwide" },
      { label: "Find mentors near me", href: "/find-mentors-near-me" },
      { label: "Online tutor jobs", href: "/online-tutor-jobs" },
    ],
  },

  "verified-online-tutors-uae-cbse": {
    slug: "verified-online-tutors-uae-cbse",
    publishedAt: "2026-07-19",
    updatedAt: "2026-09-13",
    readTimeMinutes: 11,
    author: "Mentr Editorial Team",
    intro:
      "UAE families often need CBSE or IGCSE tutors who can teach online across time zones — especially when a specialist subject teacher is not available in the same neighbourhood of Dubai, Abu Dhabi, or Sharjah. This guide covers how to hire verified online tutors for UAE students, what to confirm on fees in AED, and how Mentr’s free connect flow works.",
    sections: [
      {
        heading: "CBSE and IGCSE needs in the UAE",
        blocks: [
          {
            type: "paragraph",
            text: "Many UAE students follow Indian CBSE schools or British-curriculum IGCSE tracks. Tutors must know the right exam board — not only the subject name. Say “CBSE Class 10 Maths” or “IGCSE Physics” in your first message. For Arabic or Islamic studies, seek local specialists; for STEM and English, online tutors in India or the UAE both appear in search.",
          },
          {
            type: "list",
            items: [
              "Confirm curriculum: CBSE, IGCSE, IB, or MoE",
              "Align session times to Gulf evenings / weekend blocks",
              "Ask whether the tutor has taught UAE-based students before",
              "Agree on AED vs INR pricing up front to avoid confusion",
            ],
          },
        ],
      },
      {
        heading: "Hiring verified tutors for Dubai, Abu Dhabi, and Sharjah",
        blocks: [
          {
            type: "list",
            ordered: true,
            items: [
              "Open Mentr’s UAE online tutor pages or Find verified online tutors",
              "Filter subject and online mode; read bios for CBSE/IGCSE mentions",
              "Send a connect request with city, curriculum, and preferred UTC offset",
              "After acceptance, run a video trial with a recent school paper",
              "Start with a short package before term-long commitments",
            ],
          },
          {
            type: "callout",
            title: "Time zones",
            text: "Mentr shows availability in your local time so Gulf evenings map cleanly to tutor slots elsewhere.",
          },
        ],
      },
      {
        heading: "Fees, trials, and safety",
        blocks: [
          {
            type: "paragraph",
            text: "Online rates for UAE students vary by curriculum and tutor location. Confirm currency, cancellation rules, and whether mock tests are included. Keep a parent present for younger students’ first sessions. Prefer verified profiles and never pay large advances before a trial.",
          },
          {
            type: "paragraph",
            text: "Mentr charges ₹0 to search and connect. Session fees stay between family and tutor — no lead marketplace markup.",
          },
        ],
      },
      {
        heading: "Dubai, Abu Dhabi, and Sharjah — practical notes",
        blocks: [
          {
            type: "paragraph",
            text: "After-school evenings in the Gulf often collide with late work hours for parents. Book a recurring slot and keep a backup weekday in case of travel. If your child attends a CBSE school affiliated with Indian boards, share the school’s exam calendar with the tutor in week one so revision peaks align with unit tests.",
          },
          {
            type: "paragraph",
            text: "For IGCSE, ask whether the tutor has recent papers for your exam board variant. For mixed households (CBSE sibling + IGCSE sibling), hire separately — one tutor rarely masters both marking styles at once.",
          },
        ],
      },
    ],
    faqs: [
      {
        question: "Can UAE parents find CBSE tutors online on Mentr?",
        answer:
          "Yes. Search online tutors, mention CBSE in your connect note, and trial after WhatsApp unlocks.",
      },
      {
        question: "Do tutors need to live in the UAE?",
        answer:
          "Not for online subjects. Local presence helps for in-person needs; online specialists can teach from India or elsewhere in your time window.",
      },
      {
        question: "Is contacting tutors free?",
        answer:
          "Yes on Mentr. You pay only for sessions you book with the tutor.",
      },
    ],
    relatedLinks: [
      { label: "Online tutors UAE", href: "/find-online-tutors/uae" },
      { label: "Find tutor online in UAE guide", href: "/blog/find-tutor-online-uae" },
      { label: "Verified online tutors", href: "/find-verified-online-tutors" },
      { label: "Browse tutors", href: "/search" },
    ],
  },

  "online-tutor-jobs-from-home": {
    slug: "online-tutor-jobs-from-home",
    publishedAt: "2026-07-19",
    updatedAt: "2026-09-13",
    readTimeMinutes: 12,
    author: "Mentr Editorial Team",
    intro:
      "Online tutor jobs from home let educators set hours, skip commute, and teach students across cities — if you can get discovered without buying leads. This guide covers how to list, get verified, win connect requests, and pitch on parent requirements on Mentr while keeping 100% of your fees.",
    sections: [
      {
        heading: "What “online tutor jobs from home” usually means in India",
        blocks: [
          {
            type: "paragraph",
            text: "Some roles are salaried positions with edtech companies. Others are freelance listings where parents hire you directly. Freelance fits teachers who already know their subjects and want control over pricing. Salaried roles trade control for a fixed brand pipeline. Mentr focuses on the freelance path: free listing, verified profile, direct WhatsApp after you accept.",
          },
          {
            type: "list",
            items: [
              "No commute — teach from a quiet home setup with good lighting and audio",
              "You set hourly rates and package sizes",
              "Parents find you via search or you pitch on the requirements board",
              "No coin wallet required to receive interest",
            ],
          },
        ],
      },
      {
        heading: "Setup that wins parent trust on video",
        blocks: [
          {
            type: "paragraph",
            text: "Parents judge professionalism in the first minute: clear camera, neutral background, and a plan for the trial. Use a digital whiteboard or document camera for maths and science. Keep a PDF of sample worksheets ready. Mention boards you teach (CBSE, ICSE, State) in your bio so search filters work.",
          },
        ],
      },
      {
        heading: "How to get started on Mentr",
        blocks: [
          {
            type: "list",
            ordered: true,
            items: [
              "Create a faculty account and complete your profile (subjects, bio, photo, modes)",
              "Submit verification materials and wait for the Verified badge",
              "Toggle open weekly slots so parents see you are accepting students",
              "Respond to connect requests within 24 hours — speed wins",
              "Pitch daily on matching requirements with a specific note (class + approach)",
            ],
          },
          {
            type: "callout",
            title: "Keep 100%",
            text: "Mentr does not take commission on tuition. Optional profile boosts may exist later — contact stays free.",
          },
        ],
      },
      {
        heading: "Pricing and boundaries for home-based online work",
        blocks: [
          {
            type: "paragraph",
            text: "Research city benchmarks for your subject and class, then price for online delivery. Write a cancel policy (e.g. 12-hour notice). Block personal time so evenings do not sprawl. Treat online tutoring like a practice: track active students, trial conversion, and subjects that fill fastest.",
          },
        ],
      },
    ],
    faqs: [
      {
        question: "Are online tutor jobs on Mentr paid positions?",
        answer:
          "Mentr is not an employer. You freelance: parents hire you directly and you keep the fees.",
      },
      {
        question: "Do I pay for leads?",
        answer:
          "No. Listing and receiving connect requests is free. Pitching on the board is free within fair-use limits.",
      },
      {
        question: "Can I teach students outside my city?",
        answer:
          "Yes — enable online mode. Availability converts to each parent’s time zone.",
      },
    ],
    relatedLinks: [
      { label: "Online tutor jobs", href: "/online-tutor-jobs" },
      { label: "For faculty", href: "/for-faculty" },
      { label: "Get students without paying for leads", href: "/blog/get-tutoring-students-free" },
      { label: "Faculty signup", href: "/faculty/signup" },
    ],
  },

  "become-online-tutor-get-students": {
    slug: "become-online-tutor-get-students",
    publishedAt: "2026-07-19",
    updatedAt: "2026-09-13",
    readTimeMinutes: 12,
    author: "Mentr Editorial Team",
    intro:
      "Becoming an online tutor is easy; getting students consistently is the hard part. Visibility without lead fees, a clear profile, fast replies, and a simple trial offer beat buying coins. Here is a practical path on Mentr from empty calendar to recurring sessions.",
    sections: [
      {
        heading: "Positioning: who you help in one sentence",
        blocks: [
          {
            type: "paragraph",
            text: "Parents skim. “IIT mentor for Class 11–12 CBSE Physics — concept-first, weekly mocks” beats “Passionate teacher for all subjects.” Pick a primary niche for the first three months. You can widen later once reviews and referrals arrive.",
          },
          {
            type: "list",
            items: [
              "Subject + class band + board in the first bio line",
              "One proof point (years taught, exam focus, or sample result pattern)",
              "Modes: online only, or online + home in named areas",
              "Languages you can teach in",
            ],
          },
        ],
      },
      {
        heading: "Profile and verification",
        blocks: [
          {
            type: "paragraph",
            text: "Use a real photo, a calm background, and a bio that answers parent fears: board fit, how trials work, and how you assign homework. Complete Mentr verification so the badge shows. Incomplete profiles rarely convert.",
          },
          {
            type: "callout",
            title: "Reply speed",
            text: "Parents often message two tutors the same evening. A same-day accept plus a clear trial slot usually wins.",
          },
        ],
      },
      {
        heading: "Two student pipelines on Mentr",
        blocks: [
          {
            type: "list",
            ordered: true,
            items: [
              "Inbound: keep slots open — parents find you in search and send connect requests",
              "Outbound: browse the requirements board and pitch with a specific fit note",
              "After WhatsApp unlocks, propose a paid trial within 48 hours",
              "Convert trials with a simple 8-session plan and clear outcomes",
              "Ask satisfied parents for referrals — still free acquisition",
            ],
          },
        ],
      },
      {
        heading: "What not to do",
        blocks: [
          {
            type: "list",
            items: [
              "Buy expensive lead packs before your profile and trial offer are solid",
              "Accept every student outside your niche — quality drops and reviews suffer",
              "Ghost slow-paying chats; set payment norms politely on session one",
              "Underprice forever — raise rates as your calendar fills",
            ],
          },
          {
            type: "paragraph",
            text: "Mentr stays free to list and free to contact. You keep session fees. That is the structural advantage versus coin marketplaces — use it by being responsive and specific, not by spamming generic pitches.",
          },
        ],
      },
      {
        heading: "A simple first-month plan",
        blocks: [
          {
            type: "paragraph",
            text: "Week 1: finish verification and publish a niche bio with three open slots. Week 2: send five tailored board pitches per day and reply to every connect within a day. Week 3: run at least two paid trials and collect one short parent testimonial you can quote (with permission). Week 4: raise or hold rates based on fill rate, and drop subjects that never convert.",
          },
          {
            type: "paragraph",
            text: "Consistency beats burst activity. Parents searching on weeknights reward tutors who look active — updated slots and recent profile edits signal that you are accepting students now.",
          },
        ],
      },
    ],
    faqs: [
      {
        question: "How do I become an online tutor and get students on Mentr?",
        answer:
          "Sign up as faculty, verify, write a niche bio, open slots, reply fast to connects, and pitch on matching requirements.",
      },
      {
        question: "Is listing free?",
        answer:
          "Yes. No lead fees. Optional future boosts do not gate contact.",
      },
      {
        question: "How long before I get students?",
        answer:
          "It varies by subject demand and reply speed. Complete profiles with open slots and daily board pitches see interest fastest.",
      },
    ],
    relatedLinks: [
      { label: "Faculty signup", href: "/faculty/signup" },
      { label: "How to write a tutor profile", href: "/blog/how-to-write-tutor-profile" },
      { label: "Online tutor jobs", href: "/online-tutor-jobs" },
      { label: "Pricing your sessions", href: "/blog/how-to-price-tutoring-sessions" },
    ],
  },
};
