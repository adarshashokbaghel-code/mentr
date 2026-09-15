import type { ArticleContent } from "./types";

const LEARN = "/learn";
const LEARN_START = "/learn/start";
const LEARN_SYLLABUS = "/learn/syllabus";
const LEARN_INDIA = "/learn/india";

function relatedLearn(extra: { label: string; href: string }[] = []) {
  return [
    { label: "Mentr Learn — Class 3–5", href: LEARN },
    { label: "Enroll free (Mentr Starter)", href: LEARN_START },
    { label: "Full parent syllabus", href: LEARN_SYLLABUS },
    ...extra,
  ];
}

export const KIDS_LEARN_ARTICLES: Record<string, ArticleContent> = {
  "free-computer-science-class-3-5-kids-india": {
    slug: "free-computer-science-class-3-5-kids-india",
    publishedAt: "2026-09-13",
    updatedAt: "2026-09-13",
    readTimeMinutes: 9,
    author: "Mentr Editorial Team",
    intro:
      "Parents in India searching for computer science for Class 3–5 often face a false choice: expensive app subscriptions, or waiting until middle school for “real coding.” Neither is ideal. Class 3–5 is the right window for concrete CS basics — how computers take input, follow steps, and stay safe online — before anyone types Python. This guide explains what free CS for kids should include, what to skip, and how Mentr Learn’s free Class 3–5 path covers it in about 15 minutes a day.",
    sections: [
      {
        heading: "What “computer science for Class 3–5” should mean",
        blocks: [
          {
            type: "paragraph",
            text: "At primary level, computer science is not operating systems, hardware soldering, or competitive coding. It is literacy: telling a computer from a simple gadget, naming input–process–output on a phone or laptop at home, writing short everyday algorithms (like a recipe), and using sequence, loops, and if/then in visual blocks. Kids who finish a solid Class 3–5 foundation can explain an app idea — who it is for, one input, one output — in about a minute.",
          },
          {
            type: "list",
            items: [
              "Computer vs gadget; binary as lights (not bit maths drills)",
              "Input and output devices; how websites answer requests (kid level)",
              "Passwords and sharing — privacy habits early",
              "Algorithms, order, loops, if/then, finding mistakes",
              "Block coding: motion, score/lives boxes, tiny programs",
            ],
          },
          {
            type: "callout",
            title: "Answer in one line",
            text: "Free CS for Class 3–5 kids in India should teach thinking like a computer — not typing a programming language yet.",
          },
        ],
      },
      {
        heading: "Why India parents look for free options first",
        blocks: [
          {
            type: "paragraph",
            text: "CBSE and many state syllabi introduce computers unevenly. Some schools have a weekly ICT period; others barely touch the lab until Class 6. Parents in Bengaluru, Hyderabad, Delhi, Mumbai, and smaller cities still want kids ready for a digital world — without another ₹5,000–₹20,000 annual app fee. A free, structured path also works for families abroad who follow an Indian board calendar and need English narrated lessons.",
          },
          {
            type: "paragraph",
            text: "Mentr Learn (Mentr Starter) is built for that gap: 20 CS modules across 4 units, plus AI and Math tracks (60 total), all at ₹0 for Class 3–5. Lessons follow Watch → Quiz → Play, with boss challenges every five modules. No credit card. Parent enrolls once; the child starts Module A1 the same day.",
          },
        ],
      },
      {
        heading: "What not to buy yet (and what Mentr Learn excludes on purpose)",
        blocks: [
          {
            type: "paragraph",
            text: "Skip courses that push typed Python, HTML, or “build a website in a week” for an eight-year-old. Skip hardware kits as the main product if your child has not practised sequence and debugging on screen. Competitive coding and typing-speed drills belong later. Mentr Learn explicitly does not include typed languages, hardware insides, advanced networks, or fear-based content — so parents know the boundary before enrolling.",
          },
          {
            type: "list",
            items: [
              "Not in this course: Python, HTML typing, OS internals",
              "Not the goal: contest rankings or coding camps as a substitute for sleep",
              "Good next step later: a live tutor on Mentr when school coding starts",
            ],
          },
        ],
      },
      {
        heading: "How to start this week",
        blocks: [
          {
            type: "paragraph",
            text: "Open the Class 3–5 course page, enroll with a parent email (OTP), and start Unit 1 — How computers work. Download the parent syllabus PDF if you want unit goals in one document. Families in India can also use the India Learn hub for local framing; the curriculum is the same worldwide.",
          },
        ],
      },
    ],
    faqs: [
      {
        question: "Is Mentr Learn really free for Class 3–5?",
        answer:
          "Yes. The full 60-module path (CS, AI, Math) is ₹0 forever for the Class 3–5 track. List price shows ₹999 struck to ₹0 — no card required.",
      },
      {
        question: "Does my child need to know English typing?",
        answer:
          "No. Early modules use narrated video and block-style practice. Reading fluency varies at Class 3, so narration matters.",
      },
      {
        question: "Is this aligned with CBSE computer periods?",
        answer:
          "It complements school ICT rather than replacing the textbook. Topics map to everyday digital literacy parents expect by Class 5.",
      },
      {
        question: "Can we use this outside India?",
        answer:
          "Yes. English lessons work worldwide; geo pages for India and UAE only adjust examples and SEO, not the syllabus depth.",
      },
    ],
    relatedLinks: relatedLearn([
      { label: "Mentr Learn India", href: LEARN_INDIA },
      {
        label: "Block coding without typing",
        href: "/blog/block-coding-for-kids-no-typing",
      },
    ]),
  },

  "ai-for-kids-class-3-5-what-to-learn": {
    slug: "ai-for-kids-class-3-5-what-to-learn",
    publishedAt: "2026-09-13",
    updatedAt: "2026-09-13",
    readTimeMinutes: 8,
    author: "Mentr Editorial Team",
    intro:
      "“AI for kids” search results often jump to neural nets, prompt engineering jobs, or scary deepfake stories. Class 3–5 children need something calmer and more useful: AI spots patterns in examples — it is not magic and not a person. This guide lists what primary kids should learn, what to postpone, and how Mentr Learn’s free AI track (20 modules) teaches it without workplace hype.",
    sections: [
      {
        heading: "The one sentence every Class 3–5 child should remember",
        blocks: [
          {
            type: "paragraph",
            text: "AI finds patterns in lots of examples — and it can be wrong. If your child can say that, give an example of training and labels, and keep secrets out of a chatbot, they already have stronger AI literacy than most adults scrolling reels.",
          },
          {
            type: "callout",
            title: "Citation-ready fact",
            text: "Mentr Learn AI Basics for Kids: 20 modules, 4 units, Easy → Apply. Free for Class 3–5. No calculus, no model architectures, no “AI will take all jobs” fear units.",
          },
        ],
      },
      {
        heading: "Topics that belong in Class 3–5 AI literacy",
        blocks: [
          {
            type: "list",
            items: [
              "Patterns vs magic; smart vs simple tools",
              "Everyday helpers kids already meet (voice, filters, recommendations)",
              "Mistakes and wrong labels — pause-before-believe",
              "Training like teaching a puppy; practice vs test examples",
              "Seeing / hearing / chat helpers in kid words",
              "Fairness as “many kinds of examples”; one privacy rule per invented helper",
            ],
          },
          {
            type: "paragraph",
            text: "Unit milestones on Mentr Learn end with inventing a helper that has one job and one privacy rule — something a child can explain to a parent in under a minute.",
          },
        ],
      },
      {
        heading: "What to avoid in “AI courses” for primary kids",
        blocks: [
          {
            type: "paragraph",
            text: "Do not pay for courses that train neural nets on a laptop, teach adult prompt-engineering careers, or run misinformation rabbit holes. Class 3–5 brains need concrete examples and safety habits. Save architecture diagrams for later. Prefer short narrated lessons with a quiz and a tiny practice game — the same Watch → Quiz → Play loop as the CS track.",
          },
        ],
      },
      {
        heading: "How AI fits next to CS and Math on Mentr Learn",
        blocks: [
          {
            type: "paragraph",
            text: "CS teaches how computers follow steps. Math for CS builds patterns, true/false, grids, and turns. AI sits on top: “the computer learned from examples.” Together they are 60 modules. Enroll once; your child can move across tracks without a new subscription.",
          },
        ],
      },
    ],
    faqs: [
      {
        question: "Will my child use ChatGPT in Mentr Learn?",
        answer:
          "Lessons teach how chat helpers work and how to keep secrets out — they do not require an external chatbot account to complete modules.",
      },
      {
        question: "Is AI content scary for Class 3?",
        answer:
          "No. The track avoids horror deepfake stories and job-fear narratives. Focus is patterns, mistakes, and privacy.",
      },
      {
        question: "How long is the AI track?",
        answer:
          "20 modules across 4 units — roughly the same daily habit as CS and Math (about 15 minutes).",
      },
    ],
    relatedLinks: relatedLearn([
      {
        label: "Safe AI privacy guide",
        href: "/blog/safe-ai-for-kids-privacy-parents-guide",
      },
      {
        label: "Free CS for Class 3–5 India",
        href: "/blog/free-computer-science-class-3-5-kids-india",
      },
    ]),
  },

  "block-coding-for-kids-no-typing": {
    slug: "block-coding-for-kids-no-typing",
    publishedAt: "2026-09-13",
    updatedAt: "2026-09-13",
    readTimeMinutes: 8,
    author: "Mentr Editorial Team",
    intro:
      "Block coding lets Class 3–5 kids snap instructions — move, repeat, if — without typing syntax. Parents comparing Scratch, paid kids apps, and school ICT labs often ask: is block coding “real” coding? Yes — it is the right first language of logic. Here is what to practise, how Mentr Learn teaches it inside the free CS track, and when to move toward typed languages later.",
    sections: [
      {
        heading: "Why blocks beat typing for Class 3–5",
        blocks: [
          {
            type: "paragraph",
            text: "Typing speed and English spelling still vary widely at ages 8–11. Syntax errors punish kids for motor skills, not thinking. Blocks keep the cognitive load on sequence, loops, and conditions — the same ideas professional programmers use. A child who finishes a 5–8 block mini program with a little help has real debugging experience.",
          },
          {
            type: "list",
            items: [
              "Read start, move, and if blocks on screen",
              "Change a number in a score or lives box (variables as boxes)",
              "Order commands a robot — or a younger sibling — could follow",
              "Find and fix one mistake in a short list of steps",
            ],
          },
        ],
      },
      {
        heading: "Scratch, Tynker, and free foundation courses",
        blocks: [
          {
            type: "paragraph",
            text: "Scratch is an excellent creative playground and pairs well with school projects. Tynker and similar products often bundle paid paths, certificates, and long curricula. Mentr Learn is not trying to replace Scratch’s open creativity — it offers a guided Class 3–5 foundation (Watch → Quiz → Play → Boss) so parents get a clear finish line: 20 CS modules including a block-coding unit, at ₹0.",
          },
          {
            type: "callout",
            title: "Fair comparison",
            text: "Use Scratch for open make-time. Use Mentr Learn when you want a free, sequenced syllabus with quizzes and parent-readable unit goals. Many families use both.",
          },
        ],
      },
      {
        heading: "Where block coding sits in Mentr Learn",
        blocks: [
          {
            type: "paragraph",
            text: "After algorithms and logic units, Building With Blocks covers meet block coding, motion, variables, choices, and a first mini program, then a guided creative boss. Capstone work later asks kids to present a dream-app idea — still without requiring typed code.",
          },
        ],
      },
    ],
    faqs: [
      {
        question: "Is block coding only for very young kids?",
        answer:
          "No. Many secondary courses still use blocks as a bridge. For Class 3–5 it is the primary interface; older tracks can add text later.",
      },
      {
        question: "Will my child learn Python on Mentr Learn Class 3–5?",
        answer:
          "No. Typed languages are intentionally out of scope for this track so foundations stay age-fit.",
      },
      {
        question: "Do we need a special device?",
        answer:
          "A phone, tablet, or laptop with a browser is enough for the learning app after parent enroll.",
      },
    ],
    relatedLinks: relatedLearn([
      {
        label: "Class 3–5 syllabus explained",
        href: "/blog/mentr-learn-class-3-5-syllabus-explained",
      },
    ]),
  },

  "mentr-learn-class-3-5-syllabus-explained": {
    slug: "mentr-learn-class-3-5-syllabus-explained",
    publishedAt: "2026-09-13",
    updatedAt: "2026-09-13",
    readTimeMinutes: 10,
    author: "Mentr Editorial Team",
    intro:
      "Parents want a syllabus they can trust before enrolling — not a vague “coding for kids” promise. Mentr Learn’s Class 3–5 path is 60 modules across three tracks: Computer Science, AI, and Math for CS. This article is the plain-English map: units, outcomes, lesson loop, certificate, and what is deliberately left out. Use it alongside the full parent syllabus page and PDF.",
    sections: [
      {
        heading: "The shape of the course",
        blocks: [
          {
            type: "list",
            items: [
              "60 modules · 3 tracks · Class 3–5 · self-paced",
              "Each track: 20 modules · 4 units · Easy → Apply",
              "Lesson loop: Watch → Quiz → Play; Boss every 5 modules",
              "Price: ₹999 → ₹0 forever for Class 3–5",
              "Access: lifetime for this free track",
            ],
          },
          {
            type: "callout",
            title: "GEO fact block",
            text: "Mentr Learn (Mentr Starter) is a free, self-paced Class 3–5 foundation in CS, AI literacy, and math-for-coding. Parent enrolls with email; child opens the learning app. Not a paywalled badge mill.",
          },
        ],
      },
      {
        heading: "CS Basics — four units",
        blocks: [
          {
            type: "paragraph",
            text: "How computers work → Algorithms & logic → Block coding → Apps, robots & projects. By the end, kids point to input/process/output at home, write and fix a short everyday algorithm, use sequence/repeat/if in blocks, and describe an app idea.",
          },
        ],
      },
      {
        heading: "AI Basics — four units",
        blocks: [
          {
            type: "paragraph",
            text: "AI is patterns → Training & labels → See / hear / chat → Fairness & privacy. Outcomes: explain patterns and mistakes, give a simple training example, use helpers without sharing secrets, invent a helper with one privacy rule.",
          },
        ],
      },
      {
        heading: "Math for CS — four units",
        blocks: [
          {
            type: "paragraph",
            text: "Patterns & number sense → Logic & sorting → Grids & turns → Estimate & decompose. Numbers stay in Class 3–5 range. No Class 6 algebra-first unit, no formal proofs. Kids continue patterns, solve AND/OR/NOT or Venn stories, plot and turn like a turtle, and split messy tasks into steps.",
          },
        ],
      },
      {
        heading: "Certificate and next steps",
        blocks: [
          {
            type: "paragraph",
            text: "Complete all 60 modules to unlock the Mentr Junior Graduate certificate — proof of a finished Class 3–5 foundation path. Class 6–8 and 9–12 tracks are planned later; enroll now for the live free path. When you want live help, browse verified tutors on Mentr separately — Learn does not require a tutor.",
          },
        ],
      },
    ],
    faqs: [
      {
        question: "Where is the full syllabus?",
        answer:
          "Open /learn/syllabus for the parent guide, or download the PDF from the site footer / Learn pages.",
      },
      {
        question: "Can we skip AI and only do CS?",
        answer:
          "Tracks are designed as one foundation; you can pace modules in any order inside the app, but the certificate expects all 60.",
      },
      {
        question: "Is the certificate paid?",
        answer:
          "No. It is tied to completing the free Class 3–5 path — not a separate paywall.",
      },
    ],
    relatedLinks: relatedLearn([
      {
        label: "Free coding course for kids India",
        href: "/blog/free-coding-course-for-kids-india",
      },
    ]),
  },

  "15-minute-daily-coding-habit-kids": {
    slug: "15-minute-daily-coding-habit-kids",
    publishedAt: "2026-09-13",
    updatedAt: "2026-09-13",
    readTimeMinutes: 7,
    author: "Mentr Editorial Team",
    intro:
      "The best coding habit for Class 3–5 is short and boring in the best way: about 15 minutes a day, same seat, same loop. Long weekend “coding marathons” burn out primary kids. Mentr Learn is built around Watch → Quiz → Play so a daily slot fits between homework and dinner — with streaks and XP that do not punish a missed day the way harsh leaderboards do.",
    sections: [
      {
        heading: "A simple daily ritual",
        blocks: [
          {
            type: "list",
            ordered: true,
            items: [
              "Pick a fixed window (after snack, before screens-for-fun).",
              "One narrated lesson (Watch).",
              "Quick check questions (Quiz).",
              "One practice game or challenge (Play).",
              "Stop on time — even if they want “one more.”",
            ],
          },
          {
            type: "paragraph",
            text: "Boss challenges unlock every five modules. Treat them like a Friday treat, not nightly overtime. Parent reports and unit goals on the syllabus help you ask one good question: “What did the computer do with the input today?”",
          },
        ],
      },
      {
        heading: "Streaks without pressure",
        blocks: [
          {
            type: "paragraph",
            text: "Mentr Learn uses streaks and XP to keep a habit, with leaderboards parent opt-in and off by default for younger kids. If your child misses a day, restart gently — the goal is identity (“I practice thinking like a computer”), not a perfect calendar.",
          },
          {
            type: "callout",
            title: "Parent tip",
            text: "Sit nearby for Module A1 once. After that, most kids can run the loop alone while you cook — check the quiz result together.",
          },
        ],
      },
      {
        heading: "How long to finish 60 modules",
        blocks: [
          {
            type: "paragraph",
            text: "At one module per weekday, a track of 20 modules is about a month; all three tracks take a school term with weekends off. Faster is fine; slower is fine. Free lifetime access means the habit can pause for exams or travel.",
          },
        ],
      },
    ],
    faqs: [
      {
        question: "What if we only have weekends?",
        answer:
          "Do two or three modules on Saturday morning. Consistency weekly still beats irregular binge sessions.",
      },
      {
        question: "Should siblings share one account?",
        answer:
          "Prefer one parent enroll and clear turns, or separate progress later when multi-profile lands — for now, schedule turns so XP stays meaningful.",
      },
    ],
    relatedLinks: relatedLearn([
      {
        label: "Should kids learn coding in primary?",
        href: "/blog/should-kids-learn-coding-in-primary-school",
      },
    ]),
  },

  "should-kids-learn-coding-in-primary-school": {
    slug: "should-kids-learn-coding-in-primary-school",
    publishedAt: "2026-09-13",
    updatedAt: "2026-09-13",
    readTimeMinutes: 8,
    author: "Mentr Editorial Team",
    intro:
      "Should kids learn coding in primary school? Short answer: yes to computational thinking and digital safety; no to forcing typed languages or career panic. This parent guide separates hype from a healthy Class 3–5 start — useful whether you are in India, the UAE, or elsewhere — and points to a free path when you decide to begin.",
    sections: [
      {
        heading: "When coding helps primary kids",
        blocks: [
          {
            type: "paragraph",
            text: "Coding-as-thinking helps when it builds patience with mistakes, clear steps, and curiosity about how apps work. It helps when lessons respect attention spans and reading levels. It helps when privacy and “AI can be wrong” arrive before kids paste family chats into tools.",
          },
          {
            type: "list",
            items: [
              "Yes: algorithms as recipes, blocks, patterns, safe online habits",
              "Yes: short daily practice tied to play",
              "No: ranking anxiety, unpaid “certificates,” or Python syntax wars at age 8",
            ],
          },
        ],
      },
      {
        heading: "When to wait or go slower",
        blocks: [
          {
            type: "paragraph",
            text: "If your child is overwhelmed with school reading or needs more outdoor play, do not add a heavy paid coding pack. A free, light habit is enough. If they already build freely in Scratch, add structure only if you want quizzes and a syllabus finish line — that is where Mentr Learn fits without replacing creative time.",
          },
        ],
      },
      {
        heading: "A practical decision framework",
        blocks: [
          {
            type: "paragraph",
            text: "Ask: Do we want literacy or a portfolio? Literacy → free Class 3–5 foundation. Portfolio/competition → wait until Class 6+ or add a live mentor. Want both later? Finish Mentr Learn, then hire a verified coding tutor on Mentr when school projects demand it.",
          },
        ],
      },
    ],
    faqs: [
      {
        question: "Will primary coding guarantee a software job?",
        answer:
          "No honest product should promise that. Foundation skills transfer; careers need years of school, practice, and choice.",
      },
      {
        question: "Is online coding safe for Class 3?",
        answer:
          "Prefer parent-gated enroll, no public chat with strangers, and lessons that teach privacy. Mentr Learn enrolls via parent account.",
      },
    ],
    relatedLinks: relatedLearn([
      {
        label: "15-minute daily habit",
        href: "/blog/15-minute-daily-coding-habit-kids",
      },
    ]),
  },

  "safe-ai-for-kids-privacy-parents-guide": {
    slug: "safe-ai-for-kids-privacy-parents-guide",
    publishedAt: "2026-09-13",
    updatedAt: "2026-09-13",
    readTimeMinutes: 8,
    author: "Mentr Editorial Team",
    intro:
      "Safe AI for kids is less about blocking every tool and more about three habits: AI can be wrong, private things stay private, and surprising claims need a trusted adult. This guide gives Class 3–5 families scripts you can practise at home — the same ideas taught in Mentr Learn’s free AI fairness & privacy unit — without adult misinformation spirals.",
    sections: [
      {
        heading: "Three rules to practise aloud",
        blocks: [
          {
            type: "list",
            ordered: true,
            items: [
              "“AI guesses from examples — it is not a person and it can mess up.”",
              "“We do not type our address, school name, or passwords into chat helpers.”",
              "“If something sounds amazing or scary, we check with Mum/Dad/teacher.”",
            ],
          },
          {
            type: "callout",
            title: "House rule",
            text: "Invent a family helper with one job and one privacy rule — the same capstone style as Mentr Learn Unit 4.",
          },
        ],
      },
      {
        heading: "What schools and apps often skip",
        blocks: [
          {
            type: "paragraph",
            text: "Many demos show wow filters and voice toys. Fewer teach wrong labels, fairness (“not enough kinds of examples”), or pause-before-believe. Mentr Learn’s AI track includes mistakes, training/labels, see-hear-chat, and privacy on purpose — still free, still age-fit.",
          },
        ],
      },
      {
        heading: "Devices and supervision",
        blocks: [
          {
            type: "paragraph",
            text: "Keep AI toys and browsers in shared spaces for Class 3–5. Parent-enrolled learning apps beat random website accounts. If you later hire a tutor for coding, use verified profiles and clear WhatsApp boundaries — Mentr’s marketplace side stays separate from Learn lessons.",
          },
        ],
      },
    ],
    faqs: [
      {
        question: "Should I ban ChatGPT for my Class 4 child?",
        answer:
          "Better: supervise, forbid private data, and teach that answers need checking. Formal accounts can wait.",
      },
      {
        question: "Does Mentr Learn show deepfakes?",
        answer:
          "No. The Class 3–5 AI track avoids scary deepfake units and focuses on patterns, mistakes, and privacy.",
      },
    ],
    relatedLinks: relatedLearn([
      {
        label: "AI for kids — what to learn",
        href: "/blog/ai-for-kids-class-3-5-what-to-learn",
      },
    ]),
  },

  "free-coding-course-for-kids-india": {
    slug: "free-coding-course-for-kids-india",
    publishedAt: "2026-09-13",
    updatedAt: "2026-09-13",
    readTimeMinutes: 9,
    author: "Mentr Editorial Team",
    intro:
      "Searching “free coding course for kids India” usually surfaces freemium apps, YouTube playlists, or paid trials that expire. Here is a clear checklist of what “free” should mean, how Mentr Learn compares to common paid kids coding products (including the WhiteHat Jr–era promise culture and tools like Tynker), and how to enroll in the ₹0 Class 3–5 path today.",
    sections: [
      {
        heading: "What “free” should include",
        blocks: [
          {
            type: "list",
            items: [
              "Full curriculum access — not three locked modules",
              "No credit card for the free tier",
              "Parent-readable syllabus and outcomes",
              "Age fit for Class 3–5 (not a dumped Class 8 syllabus)",
              "Clear upsell boundary (tutors optional, not forced)",
            ],
          },
          {
            type: "paragraph",
            text: "Mentr Learn meets that bar: 60 modules, ₹999 → ₹0, lifetime for Class 3–5, enroll with parent OTP, open the learning app. Certificate on completion is part of the free path — not a separate paywall.",
          },
        ],
      },
      {
        heading: "Paid kids coding vs free foundation (fair notes)",
        blocks: [
          {
            type: "paragraph",
            text: "Scratch is free and creative — less of a guided “finish this syllabus” product. Tynker and similar platforms often mix free samples with subscriptions. The WhiteHat Jr era taught Indian parents to distrust huge outcome promises; any course that guarantees jobs for primary kids fails the honesty test. Mentr Learn positions itself as a foundation: CS, AI literacy, math-for-coding — then optional human tutors on Mentr if you want live help later.",
          },
          {
            type: "callout",
            title: "Bottom line",
            text: "If you need a free, structured Class 3–5 course in India with quizzes and a syllabus PDF, start at /learn/start. If you need open-ended making, keep Scratch too.",
          },
        ],
      },
      {
        heading: "How to enroll in five minutes",
        blocks: [
          {
            type: "list",
            ordered: true,
            items: [
              "Go to Mentr Learn course preview (/learn/start).",
              "Tap Enroll for free — parent email + OTP.",
              "Download the enrollment receipt if you want a record (₹0 paid).",
              "Open the learning app and start Module A1.",
            ],
          },
          {
            type: "paragraph",
            text: "Already enrolled? The button turns into Explore course. Tutors logged in as faculty will be asked to switch to a parent account — Learn is for parents opening the app for their child.",
          },
        ],
      },
    ],
    faqs: [
      {
        question: "Is there a catch to ₹0?",
        answer:
          "Mentr is free for parents on tutoring connects; Learn is free for Class 3–5 content. Optional paid tutoring is separate and never required to finish modules.",
      },
      {
        question: "Do you take a commission on tutors?",
        answer:
          "Mentr’s marketplace is zero-fee for parents and faculty for connects — Learn enrollment does not change that.",
      },
      {
        question: "UAE or overseas — can we enroll?",
        answer:
          "Yes. Use the same course; /learn/uae frames copy for UAE parents. Curriculum is English Class 3–5.",
      },
    ],
    relatedLinks: relatedLearn([
      {
        label: "Syllabus explained",
        href: "/blog/mentr-learn-class-3-5-syllabus-explained",
      },
      { label: "Mentr Learn India", href: LEARN_INDIA },
    ]),
  },
};
