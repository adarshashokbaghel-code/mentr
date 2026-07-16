export type FaqItem = {
  question: string;
  answer: string;
  category: "general" | "parents" | "faculty" | "fees" | "safety";
};

/** Shared between the landing FAQ section, the /faq page, and its JSON-LD. */
export const FAQS: FaqItem[] = [
  {
    category: "general",
    question: "Is Mentr really 100% free?",
    answer:
      "Yes — completely free for both sides, forever. Parents search, view profiles, and connect at no cost. Tutors and mentors list, receive requests, and pitch on requirements without coins, lead packs, subscriptions, or commission. There is no paid unlock anywhere on Mentr.",
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
      "Listing and contact are free — ₹0 platform fee, no cut from sessions. Later, teachers who want to appear first can optionally boost their profile, but contact stays free.",
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
