import type { ArticleContent } from "./types";

const LEARN = "/learn";
const LEARN_START = "/learn/start";
const LEARN_SYLLABUS = "/learn/syllabus";
const LEARN_INDIA = "/learn/india";
const LEARN_UAE = "/learn/uae";

function related(extra: { label: string; href: string }[] = []) {
  return [
    { label: "Mentr Learn hub", href: LEARN },
    { label: "Enroll free", href: LEARN_START },
    { label: "Parent syllabus", href: LEARN_SYLLABUS },
    ...extra,
  ];
}

function cityOnlineArticle(opts: {
  slug: string;
  city: string;
  regionNote: string;
  publishedAt?: string;
  hubHref?: string;
  hubLabel?: string;
}): ArticleContent {
  const { slug, city, regionNote, hubHref = LEARN_INDIA, hubLabel = "Mentr Learn India" } =
    opts;
  return {
    slug,
    publishedAt: opts.publishedAt ?? "2026-09-13",
    updatedAt: "2026-09-13",
    readTimeMinutes: 7,
    author: "Mentr Editorial Team",
    intro: `Parents in ${city} searching for coding for kids often mean after-school centres, weekend camps, or expensive app subscriptions. For Class 3–5, an online free foundation is usually the smarter first step: short narrated lessons at home, no traffic, and a syllabus you can finish. ${regionNote} Mentr Learn (Mentr Starter) gives 60 modules of CS, AI, and Math for coding at ₹0 — Watch → Quiz → Play — with parent enroll only.`,
    sections: [
      {
        heading: `Why ${city} families start online for Class 3–5`,
        blocks: [
          {
            type: "paragraph",
            text: `Commutes, packed calendars, and uneven school ICT periods make a daily 15-minute online habit more realistic than a thrice-weekly centre for many ${city} households. Online also works when one parent travels or when grandparents supervise homework. The goal at this age is computational thinking and safe digital habits — not a certificate race.`,
          },
          {
            type: "list",
            items: [
              "No centre fees or kit pressure for the free track",
              "English narrated lessons fit mixed reading levels at Class 3",
              "Parent-gated enroll; child opens the learning app after",
              "Same curriculum as nationwide / worldwide Learn — local search intent only changes framing",
            ],
          },
        ],
      },
      {
        heading: "What your child actually studies",
        blocks: [
          {
            type: "paragraph",
            text: "Computer Science basics (input/output, algorithms, block coding), AI literacy (patterns, mistakes, privacy), and Math for CS (patterns, logic, grids, turns). Not Python typing yet. Full map on the parent syllabus.",
          },
          {
            type: "callout",
            title: "Local + free",
            text: `${city} parents can enroll today at /learn/start. Prefer India-framed copy? Use ${hubLabel}. Prefer UAE framing? Use /learn/uae — the modules are the same.`,
          },
        ],
      },
      {
        heading: "When to add a live tutor later",
        blocks: [
          {
            type: "paragraph",
            text: `If school projects need live help or your child wants weekly human coaching, search verified tutors on Mentr after the free foundation — marketplace connects stay zero-fee for parents. Learn itself does not require a tutor.`,
          },
        ],
      },
    ],
    faqs: [
      {
        question: `Is Mentr Learn only for ${city}?`,
        answer:
          "No. It is an online Class 3–5 course. City pages help parents find it; the syllabus is the same everywhere.",
      },
      {
        question: "Do we need a laptop?",
        answer:
          "A phone, tablet, or laptop with a browser works after parent enroll.",
      },
      {
        question: "Is it really free?",
        answer:
          "Yes for the Class 3–5 track: ₹999 → ₹0, no credit card, lifetime access for this free path.",
      },
    ],
    relatedLinks: related([
      { label: hubLabel, href: hubHref },
      {
        label: "Free coding course for kids India",
        href: "/blog/free-coding-course-for-kids-india",
      },
    ]),
  };
}

export const KIDS_LEARN_WAVE2_ARTICLES: Record<string, ArticleContent> = {
  "coding-for-kids-bengaluru-online": cityOnlineArticle({
    slug: "coding-for-kids-bengaluru-online",
    city: "Bengaluru",
    regionNote:
      "Tech-city parents often overbuy advanced camps before kids can explain a loop.",
    hubHref: LEARN_INDIA,
  }),
  "coding-for-kids-hyderabad-online": cityOnlineArticle({
    slug: "coding-for-kids-hyderabad-online",
    city: "Hyderabad",
    regionNote:
      "Between school homework and traffic, a home-based free path beats another paid weekend batch for many families.",
  }),
  "coding-for-kids-delhi-online": cityOnlineArticle({
    slug: "coding-for-kids-delhi-online",
    city: "Delhi NCR",
    regionNote:
      "NCR winters, heat, and long school days make a short online habit easier to keep than a distant coding centre.",
  }),
  "coding-for-kids-mumbai-online": cityOnlineArticle({
    slug: "coding-for-kids-mumbai-online",
    city: "Mumbai",
    regionNote:
      "Local trains and packed evenings favour fifteen focused minutes at home over another paid class.",
  }),
  "pune-coding-for-kids-class-3-5-online": cityOnlineArticle({
    slug: "pune-coding-for-kids-class-3-5-online",
    city: "Pune",
    regionNote:
      "Pune’s school calendars and coaching culture still leave room for a light free CS/AI habit at Class 3–5.",
  }),

  "coding-for-kids-dubai-uae-online": {
    slug: "coding-for-kids-dubai-uae-online",
    publishedAt: "2026-09-13",
    updatedAt: "2026-09-13",
    readTimeMinutes: 8,
    author: "Mentr Editorial Team",
    intro:
      "UAE parents in Dubai, Abu Dhabi, and Sharjah often want English coding and AI literacy for Class 3–5 without locking into a multi-year paid academy. Mentr Learn is built for that: a free online Class 3–5 path (CS, AI, Math for coding), narrated lessons, and a parent enroll flow that works across Gulf time zones. This guide covers what you get, how it relates to later IGCSE computing, and how to start.",
    sections: [
      {
        heading: "Online-first for UAE households",
        blocks: [
          {
            type: "paragraph",
            text: "Many families already juggle British, IB, Indian, or MoE curricula. Adding a heavy paid coding product on top can wait. A free foundation teaches logic, block coding habits, and AI privacy rules in English — useful wherever you school.",
          },
          {
            type: "list",
            items: [
              "English Class 3–5 modules, ~15 minutes a day",
              "No requirement for a home tutor to finish Learn",
              "UAE hub copy at /learn/uae; enroll at /learn/start",
              "Same 60-module depth as India — geo pages only adjust framing",
            ],
          },
        ],
      },
      {
        heading: "IGCSE later — what this does and does not do",
        blocks: [
          {
            type: "paragraph",
            text: "Mentr Learn Class 3–5 is not an IGCSE Computer Science course. It builds foundations — algorithms as steps, patterns, safe tech use — that help before formal computing in later years. Older cohorts are on the roadmap.",
          },
          {
            type: "callout",
            title: "Citation fact",
            text: "Mentr Learn UAE: free Class 3–5 CS + AI + Math online. Parent enroll. ₹0. Lifetime for the free track.",
          },
        ],
      },
      {
        heading: "Start this week",
        blocks: [
          {
            type: "paragraph",
            text: "Open the UAE Learn hub, review the syllabus, enroll with parent email, and start Module A1. Download the enrollment receipt if you want a ₹0 record for family files.",
          },
        ],
      },
    ],
    faqs: [
      {
        question: "Is payment in AED?",
        answer:
          "The Class 3–5 track is free (INR 0 / no charge). There is nothing to convert for enroll.",
      },
      {
        question: "Can expat Indian-board kids use it?",
        answer:
          "Yes. Content is English Class 3–5 and works alongside CBSE/ICSE calendars too.",
      },
    ],
    relatedLinks: related([
      { label: "Mentr Learn UAE", href: LEARN_UAE },
      {
        label: "Safe AI for kids",
        href: "/blog/safe-ai-for-kids-privacy-parents-guide",
      },
    ]),
  },

  "cbse-class-3-5-computer-basics-mentr-learn": {
    slug: "cbse-class-3-5-computer-basics-mentr-learn",
    publishedAt: "2026-09-13",
    updatedAt: "2026-09-13",
    readTimeMinutes: 9,
    author: "Mentr Editorial Team",
    intro:
      "CBSE schools introduce computers unevenly in middle primary. Parents want a map: what “computer basics” for Class 3–5 should cover, and how a free course like Mentr Learn complements — not replaces — the school textbook. This article lines up everyday CBSE-style ICT themes with Mentr Learn’s CS, AI, and Math tracks.",
    sections: [
      {
        heading: "School ICT vs a structured home path",
        blocks: [
          {
            type: "paragraph",
            text: "School periods may cover parts of a computer, Paint-like tools, or internet awareness once a week. They rarely deliver a full Watch → Quiz → Play loop with unit bosses and a 60-module finish line. Mentr Learn fills that gap at home while staying age-fit: no Class 8 dumping into Class 3.",
          },
        ],
      },
      {
        heading: "Topic map (plain English)",
        blocks: [
          {
            type: "list",
            items: [
              "Computer vs gadget, input/output → CS Unit 1",
              "Steps, order, loops, if/then → CS Unit 2–3 (algorithms + blocks)",
              "Safe passwords / sharing → CS safety + AI privacy units",
              "Patterns, true/false, sorting, grids → Math for CS",
              "Smart helpers & mistakes → AI Basics",
            ],
          },
          {
            type: "callout",
            title: "Not a clone of any board PDF",
            text: "Mentr Learn is board-friendly, not a verbatim CBSE chapter list. Use it to deepen literacy; keep school homework first.",
          },
        ],
      },
      {
        heading: "How parents can use both",
        blocks: [
          {
            type: "paragraph",
            text: "After a school computer period, ask one Mentr-aligned question: “What was the input and what was the output?” On weekends, run one free module. Download the parent syllabus PDF for unit goals you can tick.",
          },
        ],
      },
    ],
    faqs: [
      {
        question: "Will this match my child’s exact CBSE book?",
        answer:
          "Not page-for-page. It complements computer awareness themes with stronger logic and AI literacy.",
      },
      {
        question: "ICSE or state board — still useful?",
        answer:
          "Yes. Foundations are shared across boards at Class 3–5.",
      },
    ],
    relatedLinks: related([
      { label: "Mentr Learn India", href: LEARN_INDIA },
      {
        label: "Syllabus explained",
        href: "/blog/mentr-learn-class-3-5-syllabus-explained",
      },
    ]),
  },

  "math-for-coding-class-3-5-kids": {
    slug: "math-for-coding-class-3-5-kids",
    publishedAt: "2026-09-13",
    updatedAt: "2026-09-13",
    readTimeMinutes: 8,
    author: "Mentr Editorial Team",
    intro:
      "“Math for coding” at Class 3–5 is not algebra bootcamp. It is the thinking computers reuse: patterns, true/false, sorting, grids, turns, estimates, and breaking jobs into steps — with numbers still in primary range. Mentr Learn’s free Math for CS track (20 modules) teaches exactly that so coding later feels natural.",
    sections: [
      {
        heading: "What belongs in math-for-CS (primary)",
        blocks: [
          {
            type: "list",
            items: [
              "Binary lights / odd-even / place value / skip-count",
              "Growing patterns and naming the rule",
              "AND / OR / NOT stories and Venn",
              "2D shapes, first-quadrant grids, 90° turns",
              "Estimate, likely/unlikely, work backwards, decompose tasks",
            ],
          },
          {
            type: "paragraph",
            text: "Out of scope on purpose: Class 6 algebra-first units, formal proofs, probability formulae, and long-division as the point of the course.",
          },
        ],
      },
      {
        heading: "How it links to CS and AI tracks",
        blocks: [
          {
            type: "paragraph",
            text: "CS uses sequence and loops; Math makes patterns and grids concrete; AI uses “examples and labels.” Together they are the 60-module foundation. Kids can pace Math modules on alternate days if school maths homework is heavy.",
          },
        ],
      },
      {
        heading: "Start the Math track free",
        blocks: [
          {
            type: "paragraph",
            text: "Enroll once in Mentr Starter — all three tracks unlock. Use the syllabus page for unit milestones you can check at home.",
          },
        ],
      },
    ],
    faqs: [
      {
        question: "Will this replace school maths tuition?",
        answer:
          "No. It supports coding-ready thinking. Keep school maths as primary academics.",
      },
      {
        question: "Does my child need to finish Math before CS?",
        answer:
          "No. Tracks can be paced in any order inside the learning app.",
      },
    ],
    relatedLinks: related([
      {
        label: "Block coding guide",
        href: "/blog/block-coding-for-kids-no-typing",
      },
    ]),
  },

  "scratch-vs-mentr-learn": {
    slug: "scratch-vs-mentr-learn",
    publishedAt: "2026-09-13",
    updatedAt: "2026-09-13",
    readTimeMinutes: 8,
    author: "Mentr Editorial Team",
    intro:
      "Scratch vs Mentr Learn is not a bitter rivalry — they solve different jobs. Scratch is an open creative studio. Mentr Learn is a free guided Class 3–5 syllabus with quizzes, bosses, and a clear finish line. Here is an honest side-by-side so parents pick the right mix.",
    sections: [
      {
        heading: "Quick comparison",
        blocks: [
          {
            type: "list",
            items: [
              "Scratch: free MIT project; open-ended making; huge community",
              "Mentr Learn: free Class 3–5 path; Watch → Quiz → Play; CS+AI+Math; parent enroll",
              "Scratch strength: creative expression and remix culture",
              "Mentr Learn strength: sequenced outcomes parents can read in a syllabus PDF",
            ],
          },
          {
            type: "callout",
            title: "Best practice",
            text: "Use Mentr Learn for the daily guided habit. Use Scratch for weekend “make a game” time. They reinforce the same block-logic muscles.",
          },
        ],
      },
      {
        heading: "When Scratch alone is enough",
        blocks: [
          {
            type: "paragraph",
            text: "If your child already thrives on open projects and you do not need quizzes or a 60-module certificate path, Scratch may be all you want this year. Add Mentr Learn when you want AI literacy, math-for-CS, and a structured CS spine without paying.",
          },
        ],
      },
      {
        heading: "When Mentr Learn is the better first buy (it’s free)",
        blocks: [
          {
            type: "paragraph",
            text: "If you searched for a course, syllabus, or “finish something,” start at /learn/start. You still can open Scratch anytime — Mentr Learn does not lock creative tools out.",
          },
        ],
      },
    ],
    faqs: [
      {
        question: "Does Mentr Learn include Scratch?",
        answer:
          "Lessons teach block-coding ideas inside Mentr’s loop. Scratch remains a separate free tool you can use alongside.",
      },
      {
        question: "Which is better for Class 3?",
        answer:
          "Many Class 3 kids do well with guided narrated lessons first, then Scratch projects. Try both if time allows.",
      },
    ],
    relatedLinks: related([
      {
        label: "Block coding without typing",
        href: "/blog/block-coding-for-kids-no-typing",
      },
      {
        label: "Tynker vs free Mentr Learn",
        href: "/blog/tynker-vs-free-mentr-learn",
      },
    ]),
  },

  "tynker-vs-free-mentr-learn": {
    slug: "tynker-vs-free-mentr-learn",
    publishedAt: "2026-09-13",
    updatedAt: "2026-09-13",
    readTimeMinutes: 8,
    author: "Mentr Editorial Team",
    intro:
      "Tynker vs a free course is the question parents ask after hitting a paywall on kids coding apps. Tynker can be a strong product for families who want a broad paid catalogue. Mentr Learn is intentionally narrower and free: Class 3–5 CS, AI, and Math for coding, full 60-module access at ₹0. Compare on price, depth, and honesty — not hype.",
    sections: [
      {
        heading: "What to compare on any kids coding app",
        blocks: [
          {
            type: "list",
            ordered: true,
            items: [
              "Is the free tier a full path or a teaser?",
              "Is the age band clear (Class 3–5 vs mixed 5–15 dump)?",
              "Can a parent read unit outcomes before paying?",
              "Are certificates paywalled?",
              "Is live tutoring bundled or optional elsewhere?",
            ],
          },
        ],
      },
      {
        heading: "Where Mentr Learn stands",
        blocks: [
          {
            type: "paragraph",
            text: "Full Class 3–5 access is free. Syllabus is public. Certificate comes from completing modules, not an extra fee. Upsell, if any, is optional human tutors on Mentr’s zero-fee marketplace — not required to finish Learn.",
          },
          {
            type: "callout",
            title: "Fair note",
            text: "Paid platforms may offer more game skins, Minecraft-style packs, or longer age ladders. Pay for those if you want them — not because free foundations are “fake.”",
          },
        ],
      },
      {
        heading: "Decision rule",
        blocks: [
          {
            type: "paragraph",
            text: "Need a free finishable Class 3–5 foundation this term? Enroll in Mentr Learn. Already happy paying for a large commercial catalogue? Keep it — and still use Mentr’s AI privacy and Math-for-CS modules if they fill gaps.",
          },
        ],
      },
    ],
    faqs: [
      {
        question: "Is Mentr Learn a Tynker clone?",
        answer:
          "No. It is a guided Class 3–5 curriculum product from Mentr by Paprly, focused on CS + AI + Math literacy.",
      },
      {
        question: "Will you add paid Learn tiers later?",
        answer:
          "Older class tracks are planned; the Class 3–5 free promise for this foundation path stays the product story for enroll today.",
      },
    ],
    relatedLinks: related([
      {
        label: "Paid apps vs free foundation",
        href: "/blog/paid-kids-coding-apps-vs-free-foundation",
      },
      {
        label: "Scratch vs Mentr Learn",
        href: "/blog/scratch-vs-mentr-learn",
      },
    ]),
  },

  "paid-kids-coding-apps-vs-free-foundation": {
    slug: "paid-kids-coding-apps-vs-free-foundation",
    publishedAt: "2026-09-13",
    updatedAt: "2026-09-13",
    readTimeMinutes: 9,
    author: "Mentr Editorial Team",
    intro:
      "After the WhiteHat Jr era, Indian parents are rightly sceptical of huge outcome promises for young kids. Paid kids coding apps are not automatically bad — but “free trial → annual fee” and “guaranteed future jobs for Class 4” should make you pause. This guide separates a healthy paid purchase from a free Class 3–5 foundation like Mentr Learn.",
    sections: [
      {
        heading: "Lessons from the hype cycle",
        blocks: [
          {
            type: "paragraph",
            text: "Aggressive sales, inflated career claims, and pressure demos hurt trust across the category. Any product — paid or free — that promises software jobs for primary children fails a basic honesty test. Look for age-fit syllabi, clear exclusions, and parent-readable outcomes instead.",
          },
        ],
      },
      {
        heading: "When paying still makes sense",
        blocks: [
          {
            type: "list",
            items: [
              "You want live small-group cohorts with a named teacher",
              "You want specialty packs (robotics kits, game engines) as extras",
              "Your child finished a free foundation and wants more challenge",
            ],
          },
          {
            type: "paragraph",
            text: "Even then, keep receipts, trial periods, and cancellation terms in writing.",
          },
        ],
      },
      {
        heading: "When a free foundation is the right first move",
        blocks: [
          {
            type: "paragraph",
            text: "If you need CS + AI literacy + math-for-coding for Class 3–5 without a card on file, start with Mentr Learn: 60 modules, ₹0, lifetime for this track, syllabus PDF, enroll with parent OTP. Add paid tools later with clearer eyes.",
          },
          {
            type: "callout",
            title: "Bottom line",
            text: "Free foundation first. Paid extras second. Career promises never.",
          },
        ],
      },
    ],
    faqs: [
      {
        question: "Are you attacking WhiteHat Jr specifically?",
        answer:
          "We reference the era as a caution on marketing claims. Judge every product — including ours — on syllabus clarity and honesty.",
      },
      {
        question: "Is free lower quality?",
        answer:
          "Free can be excellent or thin. Check modules, assessments, and what is excluded. Mentr Learn publishes unit goals for that reason.",
      },
    ],
    relatedLinks: related([
      {
        label: "Free coding course kids India",
        href: "/blog/free-coding-course-for-kids-india",
      },
      {
        label: "Tynker vs free Mentr Learn",
        href: "/blog/tynker-vs-free-mentr-learn",
      },
    ]),
  },
};
