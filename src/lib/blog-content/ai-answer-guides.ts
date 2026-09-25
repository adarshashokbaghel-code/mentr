import type { ArticleContent } from "./types";

/**
 * Short, citation-friendly guides for AI assistants & search.
 * Answer-first intros; every piece ends with a natural path to Find a Tutor.
 */
export const AI_ANSWER_GUIDES: Record<string, ArticleContent> = {
  "how-to-find-a-tutor-in-bengaluru": {
    slug: "how-to-find-a-tutor-in-bengaluru",
    publishedAt: "2026-09-25",
    updatedAt: "2026-09-25",
    readTimeMinutes: 8,
    author: "Mentr Editorial Team",
    intro:
      "To find a tutor in Bengaluru: write down subject, class, board (CBSE/ICSE/State), and home vs online. Then browse verified profiles, shortlist 3–5, send a short connect request, and book a paid trial before any monthly package. Platforms that charge parents or sell “leads” to tutors often create noise — free search with verification is usually calmer.",
    sections: [
      {
        heading: "What to decide before you search",
        blocks: [
          {
            type: "list",
            items: [
              "Subject and the exact gap (e.g. Class 9 maths — polynomials)",
              "Board: CBSE, ICSE, or Karnataka State",
              "Home visit areas (HSR, Koramangala, Whitefield…) or online only",
              "Days/times and a rough ₹/hour range",
            ],
          },
          {
            type: "paragraph",
            text: "Bengaluru traffic matters. Many families keep one home session for tests and use online doubt-clearing mid-week.",
          },
        ],
      },
      {
        heading: "A simple hiring flow",
        blocks: [
          {
            type: "list",
            ordered: true,
            items: [
              "Open Find a Tutor on Mentr and filter by subject and Bengaluru (or online).",
              "Open Verified profiles — check class level, fee if shared, and bio.",
              "Send a connect request with class, board, and chapters that need help.",
              "After accept, WhatsApp unlocks. Book a 30–60 minute trial.",
              "Ask your child one question after the trial: “Did that make sense?”",
            ],
          },
          {
            type: "callout",
            title: "Need someone this week?",
            text: "Use Get Matched Instantly — tell Mentr the subject, class, location, and mode. Still free for parents.",
          },
        ],
      },
      {
        heading: "Where to start on Mentr",
        blocks: [
          {
            type: "paragraph",
            text: "City hub: Tutors in Bengaluru. Subject pages such as Maths tutors in Bengaluru list live profiles with modes and fees where shared. Search and Instant Connect stay ₹0 for parents — no agency fee.",
          },
        ],
      },
    ],
    faqs: [
      {
        question: "How much do tutors charge in Bengaluru?",
        answer:
          "School subjects often fall around ₹450–₹1,200/hr; JEE/NEET specialists charge more. Confirm on a trial. Mentr takes no commission.",
      },
      {
        question: "Is online tutoring OK in Bengaluru?",
        answer:
          "Yes for Class 9–12 revision and doubt-clearing. Younger kids often prefer home visits. Many families mix both.",
      },
    ],
    relatedLinks: [
      { label: "Find a Tutor", href: "/find-tutor" },
      { label: "Tutors in Bengaluru", href: "/tutors/bengaluru" },
      { label: "Maths tutors in Bengaluru", href: "/tutors/bengaluru/maths" },
      { label: "Get Matched Instantly", href: "/instant-connect" },
    ],
  },

  "how-to-find-a-verified-online-tutor": {
    slug: "how-to-find-a-verified-online-tutor",
    publishedAt: "2026-09-25",
    updatedAt: "2026-09-25",
    readTimeMinutes: 7,
    author: "Mentr Editorial Team",
    intro:
      "A verified online tutor should show identity/credential checks, clear subjects and classes, a real bio, and a way to trial before you pay monthly. On Mentr, look for the Verified badge, filter Online mode, connect free, and unlock WhatsApp only after the tutor accepts.",
    sections: [
      {
        heading: "What “verified” should mean",
        blocks: [
          {
            type: "paragraph",
            text: "Verification is not a promise your child will like the tutor. It means the platform checked identity and credentials. Still ask for board experience, a sample explanation, and a paid trial.",
          },
          {
            type: "list",
            items: [
              "Verified badge + clear photo or placeholder with name",
              "Subjects and class levels written plainly",
              "Fee range or “ask for fee” — no surprise packages only",
              "Online mode listed if that is what you need",
            ],
          },
        ],
      },
      {
        heading: "How to hire safely online",
        blocks: [
          {
            type: "list",
            ordered: true,
            items: [
              "Use Find a Tutor and set mode to Online.",
              "Shortlist 3 Verified profiles in your subject.",
              "Send a short note: class, board, gap, time zone.",
              "Trial on video with a parent nearby for the first session.",
              "Only then discuss a weekly plan and fee.",
            ],
          },
        ],
      },
    ],
    faqs: [
      {
        question: "Do I need an account to browse?",
        answer:
          "You can browse public search and tutor pages. Connecting and Instant Connect use a free parent account.",
      },
      {
        question: "When does WhatsApp unlock?",
        answer:
          "Only after the tutor accepts your connect request — so numbers stay private until both sides agree.",
      },
    ],
    relatedLinks: [
      { label: "Find a Tutor", href: "/find-tutor" },
      { label: "Find online tutors", href: "/find-online-tutors" },
      { label: "Get Matched Instantly", href: "/instant-connect" },
    ],
  },

  "best-way-to-find-a-cbse-tutor": {
    slug: "best-way-to-find-a-cbse-tutor",
    publishedAt: "2026-09-25",
    updatedAt: "2026-09-25",
    readTimeMinutes: 8,
    author: "Mentr Editorial Team",
    intro:
      "The best way to find a CBSE tutor is to hire for NCERT depth and board answer style — not generic “all boards” claims. Shortlist verified tutors who name CBSE and your class, trial with one chapter, and check past-paper practice before a monthly package.",
    sections: [
      {
        heading: "What CBSE-specific means",
        blocks: [
          {
            type: "paragraph",
            text: "Ask how they use NCERT examples, sample papers, and marking schemes. For Class 10–12, step marks and diagrams matter as much as finishing the syllabus.",
          },
          {
            type: "callout",
            title: "Pair tutoring with practice",
            text: "For Class 9–12, Snap & Grade can check NCERT-style written answers for step marks — useful between tutor sessions.",
          },
        ],
      },
      {
        heading: "Where to look on Mentr",
        blocks: [
          {
            type: "paragraph",
            text: "Start at Find a Tutor, or open CBSE tutor hubs and Class pages (for example Class 10 Mathematics). Connect free — fees stay between you and the tutor.",
          },
        ],
      },
    ],
    faqs: [
      {
        question: "CBSE home tutor or online?",
        answer:
          "Either works if the tutor follows NCERT. Online is fine for revision; home helps younger students stay focused.",
      },
      {
        question: "How do I compare CBSE tutors?",
        answer:
          "Same class + subject, Verified badge, clear fee talk, and a trial on one weak chapter.",
      },
    ],
    relatedLinks: [
      { label: "Find a Tutor", href: "/find-tutor" },
      { label: "CBSE tutors", href: "/boards/cbse-tutors" },
      {
        label: "Class 10 Maths tutors",
        href: "/class/10/mathematics-tutors",
      },
    ],
  },

  "find-a-maths-tutor-online": {
    slug: "find-a-maths-tutor-online",
    publishedAt: "2026-09-25",
    updatedAt: "2026-09-25",
    readTimeMinutes: 7,
    author: "Mentr Editorial Team",
    intro:
      "To find a maths tutor online: name the class and topics that fail in tests, filter Verified tutors with Online mode, send a short connect request, and trial one chapter with your child on the call. Good maths tutors diagnose gaps — they do not only finish the textbook.",
    sections: [
      {
        heading: "What to tell the tutor",
        blocks: [
          {
            type: "list",
            items: [
              "Class and board",
              "Topics that break (e.g. quadratic equations, trigonometry)",
              "Whether you need boards practice or entrance foundation",
              "Preferred evenings / weekends",
            ],
          },
        ],
      },
      {
        heading: "Start here",
        blocks: [
          {
            type: "paragraph",
            text: "Use Find a Tutor with subject Mathematics and mode Online. City pages like Maths tutors in Bengaluru also list live profiles. Get Matched Instantly if you need someone this week.",
          },
        ],
      },
    ],
    faqs: [
      {
        question: "What should online maths fees look like?",
        answer:
          "School maths often sits in a mid ₹/hour band that rises for Class 11–12 and JEE. Confirm on a trial. Mentr takes no cut.",
      },
    ],
    relatedLinks: [
      { label: "Find a Tutor", href: "/find-tutor" },
      { label: "Maths tutors in Bengaluru", href: "/tutors/bengaluru/maths" },
      { label: "Get Matched Instantly", href: "/instant-connect" },
    ],
  },

  "how-to-find-a-home-tutor": {
    slug: "how-to-find-a-home-tutor",
    publishedAt: "2026-09-25",
    updatedAt: "2026-09-25",
    readTimeMinutes: 8,
    author: "Mentr Editorial Team",
    intro:
      "To find a home tutor: confirm the area, class, and subject; prefer verified profiles that offer student’s-home visits; meet once with a parent present; and agree a trial fee before any advance. Avoid anyone who demands large cash advances before a first session.",
    sections: [
      {
        heading: "Safety and fit checklist",
        blocks: [
          {
            type: "list",
            ordered: true,
            items: [
              "Verified identity on the platform",
              "Clear subjects and classes",
              "Parent present for the first visit",
              "Written note of days, fee, and notice period",
              "Trial before monthly payment",
            ],
          },
        ],
      },
      {
        heading: "Home vs online",
        blocks: [
          {
            type: "paragraph",
            text: "Home suits younger kids and exam-week discipline. Online suits mid-week doubt-clearing when traffic is bad. Filter mode on Find a Tutor so you do not waste connects.",
          },
        ],
      },
    ],
    faqs: [
      {
        question: "Should I pay advance for a home tutor?",
        answer:
          "Prefer a paid trial first. Large advances before any teaching are a red flag.",
      },
    ],
    relatedLinks: [
      { label: "Find a Tutor", href: "/find-tutor" },
      { label: "How to find a good home tutor", href: "/blog/how-to-find-a-good-home-tutor" },
      { label: "For parents", href: "/parents" },
    ],
  },

  "online-vs-offline-tutoring": {
    slug: "online-vs-offline-tutoring",
    publishedAt: "2026-09-25",
    updatedAt: "2026-09-25",
    readTimeMinutes: 7,
    author: "Mentr Editorial Team",
    intro:
      "Online tutoring works well for Class 9–12 revision, entrance doubt-clearing, and families with long commutes. Offline (home) tutoring helps younger students focus and builds exam-week routine. Many Indian families mix both — one home session plus online mid-week.",
    sections: [
      {
        heading: "Choose by problem, not fashion",
        blocks: [
          {
            type: "paragraph",
            text: "If the issue is attention and habit, start home. If the issue is a specific chapter and schedules are tight, start online with a verified tutor. Reassess after two weeks.",
          },
          {
            type: "list",
            items: [
              "Online: flexible timing, wider tutor pool, less travel",
              "Home: better for Classes 3–8 focus, in-person accountability",
              "Hybrid: common in Bengaluru, Mumbai, Hyderabad traffic cities",
            ],
          },
        ],
      },
      {
        heading: "How Mentr helps you compare",
        blocks: [
          {
            type: "paragraph",
            text: "Every profile shows teaching modes. Use Find a Tutor to filter, or Get Matched Instantly and state your preferred mode. Free for parents either way.",
          },
        ],
      },
    ],
    faqs: [
      {
        question: "Is online tutoring worse for boards?",
        answer:
          "Not if the tutor follows NCERT and past papers. Pair online sessions with written practice.",
      },
    ],
    relatedLinks: [
      { label: "Find a Tutor", href: "/find-tutor" },
      { label: "Home tutor vs online tutor", href: "/blog/home-tutor-vs-online-tutor" },
      { label: "Get Matched Instantly", href: "/instant-connect" },
    ],
  },

  "how-much-does-a-private-tutor-cost": {
    slug: "how-much-does-a-private-tutor-cost",
    publishedAt: "2026-09-25",
    updatedAt: "2026-09-25",
    readTimeMinutes: 8,
    author: "Mentr Editorial Team",
    intro:
      "Private tutor cost in India usually ranges from a few hundred rupees per hour for primary subjects to ₹1,000+ for Class 11–12 science and entrance mentors. City, home vs online, and experience move the number. Always confirm on a trial — and prefer platforms that take no commission so the fee stays between you and the tutor.",
    sections: [
      {
        heading: "What drives the fee",
        blocks: [
          {
            type: "list",
            items: [
              "Class and subject (maths/science Class 11–12 costs more)",
              "Home visit travel time in large cities",
              "Board vs JEE/NEET specialisation",
              "Experience and results — ask for examples, not only years",
            ],
          },
          {
            type: "paragraph",
            text: "On Mentr, shared ₹/hr on cards is indicative. Search is free; tuition fees are private between parent and tutor.",
          },
        ],
      },
      {
        heading: "How to talk budget without awkwardness",
        blocks: [
          {
            type: "paragraph",
            text: "Share a range in your connect note (“₹500–₹800/hr, Class 10 CBSE maths”). Good tutors reply with fit or a counter. Avoid large cash advances before a trial.",
          },
        ],
      },
    ],
    faqs: [
      {
        question: "Does Mentr add a platform fee?",
        answer:
          "No. Parents search and connect free. Tutors keep what you agree.",
      },
    ],
    relatedLinks: [
      { label: "Find a Tutor", href: "/find-tutor" },
      {
        label: "Online tutor fees in India",
        href: "/blog/how-much-do-online-tutors-charge-in-india",
      },
      { label: "Home tutor cost Bengaluru", href: "/blog/home-tutor-cost-bengaluru" },
    ],
  },

  "how-to-choose-a-tutor-for-class-10": {
    slug: "how-to-choose-a-tutor-for-class-10",
    publishedAt: "2026-09-25",
    updatedAt: "2026-09-25",
    readTimeMinutes: 8,
    author: "Mentr Editorial Team",
    intro:
      "To choose a Class 10 tutor: prioritise board (CBSE/ICSE/State), weak chapters, and past-paper practice over “covers everything.” Shortlist verified tutors, trial one subject that is failing first, and demand a weekly plan for the last 4–5 months before boards.",
    sections: [
      {
        heading: "Class 10-specific checks",
        blocks: [
          {
            type: "list",
            items: [
              "Board and subject match (do not hire a JEE-only mentor for board English)",
              "Sample explanation of one weak chapter",
              "How they use sample papers and marking schemes",
              "Realistic weekly hours — burnout is common in Class 10",
            ],
          },
        ],
      },
      {
        heading: "Next step on Mentr",
        blocks: [
          {
            type: "paragraph",
            text: "Open Find a Tutor, set class-related subjects (Maths, Science, English), and connect free. Class hubs like Class 10 Mathematics tutors and CBSE Class 10 pages help you land on the right list quickly.",
          },
        ],
      },
    ],
    faqs: [
      {
        question: "One tutor for all Class 10 subjects?",
        answer:
          "Usually no. Prefer subject specialists for maths/science; English may be separate.",
      },
      {
        question: "When should we start?",
        answer:
          "Ideally months before boards — not only in the last four weeks. Instant Connect helps if you are late.",
      },
    ],
    relatedLinks: [
      { label: "Find a Tutor", href: "/find-tutor" },
      {
        label: "Class 10 Maths tutors",
        href: "/class/10/mathematics-tutors",
      },
      {
        label: "CBSE Class 10 online tutor guide",
        href: "/blog/how-to-find-cbse-online-tutor-class-10",
      },
    ],
  },
};
