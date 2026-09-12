/** Sourced leader quotes for Mentr Learn — not endorsements of Mentr. */

export type LearnTrackTag = "cs" | "ai" | "math";

export type LeaderQuote = {
  id: string;
  name: string;
  handle: string;
  role: string;
  date: string;
  quote: string;
  sourceLabel: string;
  sourceHref: string;
  image: string;
  tracks: LearnTrackTag[];
};

export const LEADER_THREAD_IMAGE = "/learn/leaders/pavel-elon-thread.jpeg";

export const PAVEL_MATH_QUOTE: LeaderQuote = {
  id: "pavel-math",
  name: "Pavel Durov",
  handle: "@durov",
  role: "Founder, Telegram",
  date: "11 Jul 2025",
  quote:
    "If you’re a student choosing what to focus on, pick MATH. It will teach you to relentlessly rely on your own brain, think logically, break down problems, and solve them step by step in the right order. That’s the core skill you’ll need to build companies and manage projects.",
  sourceLabel: "Financial Express",
  sourceHref:
    "https://www.financialexpress.com/life/technology-telegram-ceo-pavel-durov-shares-best-subject-for-students-to-become-future-ready-elon-musk-offers-a-different-view-3916018/",
  image: "/learn/leaders/pavel-durov.jpg",
  tracks: ["math"],
};

export const ELON_PHYSICS_QUOTE: LeaderQuote = {
  id: "elon-physics",
  name: "Elon Musk",
  handle: "@elonmusk",
  role: "Tesla · SpaceX",
  date: "11 Jul 2025",
  quote: "Physics (with math).",
  sourceLabel: "India Today",
  sourceHref:
    "https://www.indiatoday.in/technology/news/story/telegram-ceo-shares-best-subject-for-students-who-want-to-build-companies-elon-musk-has-a-different-opinion-2755315-2025-07-14",
  image: "/learn/leaders/elon-musk.jpg",
  tracks: ["math"],
};

export const PAVEL_CS_FOLLOWUP: LeaderQuote = {
  id: "pavel-cs",
  name: "Pavel Durov",
  handle: "@durov",
  role: "Founder, Telegram",
  date: "11 Jul 2025",
  quote:
    "If you’re already strong in math, it’s worth exploring physics and computer science — both are excellent ways to apply math in the real world, sharpen your logical and critical thinking + solve important problems.",
  sourceLabel: "Indian Express",
  sourceHref:
    "https://indianexpress.com/article/trending/trending-globally/elegram-ceo-pavel-durov-math-vs-physics-future-skills-elon-musk-10131715/",
  image: "/learn/leaders/pavel-durov.jpg",
  tracks: ["math", "cs"],
};

export const SUPPORT_QUOTES: LeaderQuote[] = [
  {
    id: "jensen-physics-ai",
    name: "Jensen Huang",
    handle: "NVIDIA",
    role: "CEO, NVIDIA",
    date: "18 Jul 2025",
    quote:
      "The next wave requires us to understand things like the laws of physics, friction, inertia, cause and effect.",
    sourceLabel: "CNBC",
    sourceHref:
      "https://www.cnbc.com/2025/07/18/nvidia-ceo-jensen-huang-study-field-computer-science-software-gpu-alexnet-generative-physical-ai-university.html",
    image: "/learn/leaders/jensen-huang.jpg",
    tracks: ["ai", "math"],
  },
  {
    id: "jobs-think",
    name: "Steve Jobs",
    handle: "Apple",
    role: "Co-founder, Apple",
    date: "Code.org",
    quote:
      "Everybody in this country should learn how to program a computer… because it teaches you how to think.",
    sourceLabel: "CNN / Code.org",
    sourceHref: "https://www.cnn.com/2013/02/27/tech/innovation/code-video-gates-zuckerberg",
    image: "/learn/leaders/steve-jobs.jpg",
    tracks: ["cs"],
  },
  {
    id: "gates-13",
    name: "Bill Gates",
    handle: "Microsoft",
    role: "Co-founder, Microsoft",
    date: "Code.org",
    quote: "I was 13 when I first got access to a computer. I wrote a program to play tic-tac-toe.",
    sourceLabel: "CNN / Code.org",
    sourceHref: "https://www.cnn.com/2013/02/27/tech/innovation/code-video-gates-zuckerberg",
    image: "/learn/leaders/bill-gates.jpg",
    tracks: ["cs"],
  },
];

export const LEADER_FACTS = [
  {
    id: "coding-india",
    value: "1%",
    label: "of Indians say they can code",
    detail: "NSSO household survey of 1M+ people.",
    sourceLabel: "Data for India",
    sourceHref: "https://www.dataforindia.com/ict-skills/",
  },
  {
    id: "coding-youth",
    value: "2.4%",
    label: "of ages 15–29 can write code",
    detail: "The generation already in school and college.",
    sourceLabel: "NSSO / Data for India",
    sourceHref: "https://www.dataforindia.com/ict-skills/",
  },
  {
    id: "computers",
    value: "2 in 10",
    label: "Indian adults can use a computer",
    detail: "Eight in ten use a phone. Coding needs more than that.",
    sourceLabel: "Data for India",
    sourceHref: "https://www.dataforindia.com/ict-skills/",
  },
  {
    id: "nep",
    value: "NEP 2020",
    label: "asks for computational thinking",
    detail: "Puzzles and games — the same loop as Play Arena.",
    sourceLabel: "NEP 2020",
    sourceHref: "https://www.education.gov.in/sites/upload_files/mhrd/files/NEP_Final_English_0.pdf",
  },
  {
    id: "durov-reach",
    value: "1M+",
    label: "views on Durov’s MATH post",
    detail: "The July 2025 thread Elon replied to.",
    sourceLabel: "Financial Express",
    sourceHref:
      "https://www.financialexpress.com/life/technology-telegram-ceo-pavel-durov-shares-best-subject-for-students-to-become-future-ready-elon-musk-offers-a-different-view-3916018/",
  },
  {
    id: "modules",
    value: "60",
    label: "modules across CS, AI & Math",
    detail: "About 15 minutes a day. Narrated for Class 3–5.",
    sourceLabel: "Mentr Learn",
    sourceHref: "#curriculum",
  },
] as const;
