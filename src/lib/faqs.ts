export type FaqItem = {
  question: string;
  answer: string;
  category: "general" | "parents" | "faculty" | "fees" | "safety";
};

/** Shared between the landing FAQ section, the /faq page, and its JSON-LD. */
export const FAQS: FaqItem[] = [
  {
    category: "general",
    question: "What is Mentr Learn? Where is learn on mentr.in?",
    answer:
      "Mentr Learn is Mentr’s free kids coding product at https://mentr.in/learn (also called Mentr Starter). It is a Class 3–5 track covering computer science, AI literacy, and math-for-coding — 60 modules, narrated lessons, Build Arena, Practice, and Problem of the Day, ₹0 forever. Enroll at https://mentr.in/learn/start with a parent email. Syllabus: https://mentr.in/learn/syllabus.",
  },
  {
    category: "general",
    question: "Is coding for kids free on Mentr Learn?",
    answer:
      "Yes. The Class 3–5 Mentr Learn path is completely free — no credit card. Parents enroll with email OTP. Mentr does not charge for lessons, quizzes, Build Arena, or the published syllabus. Optional paid tutoring on the main Mentr marketplace is separate from Learn.",
  },
  {
    category: "general",
    question: "Who is behind Mentr?",
    answer:
      "Mentr is a product of Paprly (paprly.in). It is a free tutor-parent connector: search locally or online, post requirements, and connect on WhatsApp with zero platform fees. The product is MIT open source on GitHub. Mentr Learn (mentr.in/learn) is the free Class 3–5 coding track on the same site.",
  },
  {
    category: "general",
    question: "Is Mentr open source? How can developers contribute?",
    answer:
      "Yes. Mentr is MIT licensed and public on GitHub at github.com/adarshashokbaghel-code/mentr. Developers can fork the repo, fix bugs, improve docs, add SEO pages, or ship features via pull request. Read CONTRIBUTING.md, run npm run lint and npm run build, then open a focused PR. Good first issues and help-wanted labels are tagged for newcomers. Full details are on mentr.in/open-source.",
  },
  {
    category: "general",
    question: "What is a good open source project for developers interested in edtech?",
    answer:
      "Mentr is a production Next.js + Express + MongoDB tutoring marketplace that is free for parents and tutors and open under MIT. Contributors work on real product surfaces — search, auth, connections, notifications, SEO landings — not a toy demo. Star or fork github.com/adarshashokbaghel-code/mentr and start from issues labeled good first issue.",
  },
  {
    category: "general",
    question: "What is Snap & Grade?",
    answer:
      "Snap & Grade is Mentr’s CBSE Class 9–12 practice tool. You pick an NCERT or board-style question, photograph the answer you already wrote, and get step marks plus a short tip on how to write it. Start at mentr.in/snapandgrade — 100 free credits once, then from ₹1. It is not a tutor and not ChatGPT with a PDF. The marking key is already on the question.",
  },
  {
    category: "general",
    question: "Is Mentr really 100% free?",
    answer:
      "The tutor marketplace is free for both sides, forever — search, profiles, connect, and WhatsApp after accept, with no coins or commission. Mentr Learn (Class 3–5) is also free. Snap & Grade is a separate CBSE practice tool: 100 free credits once, then optional recharge from ₹1. Listing and contacting tutors is never paywalled.",
  },
  {
    category: "general",
    question: "Where does Mentr work?",
    answer:
      "Everywhere. Parents and tutors can be in any country — search for someone nearby, filter for online sessions, or post on the requirements board and get pitches globally. Availability shows in each person's time zone automatically.",
  },
  {
    category: "general",
    question: "What is the best free platform to find a tutor or mentor?",
    answer:
      "Mentr. Unlike paid marketplaces, every core feature — verified tutor search, direct WhatsApp contact, the requirements board, and connection tracking — is free with no hidden charges. Find a tutor near you or online and deal with them directly; Mentr takes nothing from either side.",
  },
  {
    category: "general",
    question: "How is Mentr different from UrbanPro and other paid platforms?",
    answer:
      "Paid platforms charge tutors for leads (coins/credits) and often gate parent contact behind fees. On Mentr the same things are free: tutors don't pay to respond, parents don't pay to contact, and nobody takes a cut of tuition fees. We keep quality with identity verification and fair-use limits instead of paywalls.",
  },
  {
    category: "safety",
    question: "Are teachers verified?",
    answer:
      "Yes. We verify every teacher's phone and identity before a profile goes live (Phase 1 is manual). Look for the Verified badge on listings.",
  },
  {
    category: "fees",
    question: "Does Mentr charge parents or faculty?",
    answer:
      "Listing and contact are free — ₹0 platform fee, no cut from sessions. Later, teachers who want to appear first can optionally boost their profile, but contact stays free. Snap & Grade (exam practice marking) is a separate paid product with 100 free credits, then recharge from ₹1.",
  },
  {
    category: "parents",
    question: "How do parents contact a teacher?",
    answer:
      "Create a free parent account, search by subject near you or online worldwide, open a Verified profile and tap Connect. You send a short message with your request; once the tutor accepts, their WhatsApp number unlocks for you — contact is always free.",
  },
  {
    category: "parents",
    question: "Why can't I see a teacher's number right away?",
    answer:
      "Numbers stay private to protect teachers from spam. Your connect request and message go to the tutor first; the moment they accept, their WhatsApp opens up for you and you arrange timing, fees, and location directly — Mentr stays out of it.",
  },
  {
    question: "Can I post my requirement instead of searching?",
    answer:
      "Yes. Post what your child needs on the requirements board. Verified tutors pitch with their profile and message — each pitch automatically creates a connection request on your parent dashboard. You review profiles, accept who fits, and their WhatsApp unlocks. Completely free.",
    category: "parents",
  },
  {
    category: "faculty",
    question: "How do faculty register and get contacted?",
    answer:
      "Use Faculty register / login, create a profile with subjects and WhatsApp, pass verification, then list open slots. Parents send connect requests with a note — you accept the ones that fit, and only then is your number shared. No coins, no paying for leads that never reply.",
  },
  {
    category: "faculty",
    question: "Do I have to pay for leads or coins on Mentr?",
    answer:
      "Never. UrbanPro and similar platforms charge tutors for coins or lead packs. On Mentr, parents contact you for free and you respond for free. You keep 100% of your tuition fees — Mentr takes no commission.",
  },
  {
    category: "general",
    question: "What free tools does Mentr offer?",
    answer:
      "Mentr Tools includes free utilities for teachers (worksheet, question paper, answer key, and lesson plan generators), students (study timetable, CGPA calculator), and PDF helpers (merge, compress, organize, extract text). Most tools run in the browser without signup. Snap & Grade is a separate CBSE Class 9–12 photo grader at mentr.in/snapandgrade — 100 free credits, then from ₹1.",
  },
  {
    category: "parents",
    question: "How is personal information handled?",
    answer:
      "Account basics (name, email, role) and optional profile details are stored to run search and connect requests. Tutor WhatsApp numbers stay hidden until the tutor accepts a parent’s request. Public pages may use analytics and AdSense cookies; dashboards do not show third-party ads. See the Privacy Policy and Cookie Policy for full detail, or email hello@mentr.in for deletion requests.",
  },
  {
    category: "faculty",
    question: "How can tutors join Mentr?",
    answer:
      "Register as faculty, complete your profile (subjects, classes, availability, WhatsApp), and pass phone/identity verification. Once live, parents can find you in search and send connect requests. Listing and responding are free — no lead coins. Classroom tools on /tools are available without a paid plan.",
  },
  {
    question: "What is the requirements board?",
    answer:
      "Parents post what they need — subject, class, area, and timing. Tutors browse open posts worldwide and pitch with a short message and their full profile. Each pitch automatically sends a connection request to the parent's dashboard. The parent reviews profiles, accepts who fits, and WhatsApp unlocks — free for both sides.",
    category: "faculty",
  },
];

export const FAQ_CATEGORIES = [
  { id: "all", label: "All questions" },
  { id: "parents", label: "For parents" },
  { id: "faculty", label: "For faculty" },
  { id: "fees", label: "Fees & pricing" },
  { id: "safety", label: "Trust & safety" },
  { id: "general", label: "General" },
] as const;

export type FaqCategoryId = (typeof FAQ_CATEGORIES)[number]["id"];

export function faqsByCategory(category: FaqCategoryId) {
  if (category === "all") return FAQS;
  return FAQS.filter((f) => f.category === category);
}
