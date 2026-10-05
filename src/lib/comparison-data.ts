export const COMPARISON_UPDATED_AT = "2026-09-29";

export type CellTone = "good" | "mixed" | "bad";
export type ComparisonCell = { tone: CellTone; text: string };

export type ComparisonPlatform = {
  id: string;
  name: string;
  /** One-line description of what the business actually is */
  kind: string;
};

export const COMPARISON_PLATFORMS: ComparisonPlatform[] = [
  { id: "mentr", name: "Mentr", kind: "Free tutor connector" },
  { id: "urbanpro", name: "UrbanPro", kind: "Tutor directory, paid leads" },
  { id: "superprof", name: "Superprof", kind: "Global tutor marketplace" },
  { id: "vedantu", name: "Vedantu", kind: "Online coaching company" },
  { id: "sulekha", name: "Sulekha", kind: "Local services leads" },
  { id: "justdial", name: "Justdial", kind: "Local business listings" },
  { id: "agency", name: "Tuition agencies", kind: "Offline placement bureau" },
];

export type ComparisonRow = {
  label: string;
  hint?: string;
  cells: Record<string, ComparisonCell>;
};

export const COMPARISON_ROWS: ComparisonRow[] = [
  {
    label: "Cost for parents",
    cells: {
      mentr: { tone: "good", text: "Free" },
      urbanpro: { tone: "good", text: "Free to post" },
      superprof: { tone: "mixed", text: "Paid pass to message tutors" },
      vedantu: { tone: "bad", text: "Course fees, paid upfront" },
      sulekha: { tone: "good", text: "Free to enquire" },
      justdial: { tone: "good", text: "Free to search" },
      agency: { tone: "bad", text: "Placement fee is often built in" },
    },
  },
  {
    label: "Cost for tutors",
    cells: {
      mentr: { tone: "good", text: "Free plan. Optional ₹449/mo Premium" },
      urbanpro: { tone: "bad", text: "Pays to unlock and respond to leads" },
      superprof: { tone: "good", text: "Free to list" },
      vedantu: { tone: "mixed", text: "Employed or contracted teachers" },
      sulekha: { tone: "bad", text: "Pays for each lead" },
      justdial: { tone: "bad", text: "Paid listings rank higher" },
      agency: { tone: "bad", text: "Gives up a month's fee or a monthly cut" },
    },
  },
  {
    label: "Commission on monthly fees",
    cells: {
      mentr: { tone: "good", text: "None" },
      urbanpro: { tone: "good", text: "None" },
      superprof: { tone: "good", text: "None" },
      vedantu: { tone: "mixed", text: "Platform sets the price" },
      sulekha: { tone: "good", text: "None" },
      justdial: { tone: "good", text: "None" },
      agency: { tone: "bad", text: "Often 10–30% or a month's fee" },
    },
  },
  {
    label: "You choose the exact tutor",
    cells: {
      mentr: { tone: "good", text: "Yes, from full profiles" },
      urbanpro: { tone: "good", text: "Yes" },
      superprof: { tone: "good", text: "Yes" },
      vedantu: { tone: "bad", text: "Teacher is assigned" },
      sulekha: { tone: "mixed", text: "Whoever calls back first" },
      justdial: { tone: "mixed", text: "Mostly agencies and centres" },
      agency: { tone: "bad", text: "Agency picks for you" },
    },
  },
  {
    label: "Your number stays private",
    hint: "Until you choose to share it",
    cells: {
      mentr: { tone: "good", text: "Yes. WhatsApp opens only after the tutor accepts" },
      urbanpro: { tone: "mixed", text: "Shared with tutors who unlock the lead" },
      superprof: { tone: "good", text: "In-platform messaging first" },
      vedantu: { tone: "mixed", text: "Sales team follow-up calls" },
      sulekha: { tone: "bad", text: "Shared with several providers" },
      justdial: { tone: "bad", text: "Enquiries go to many listings" },
      agency: { tone: "mixed", text: "Held by the agency" },
    },
  },
  {
    label: "Home tuition and online",
    cells: {
      mentr: { tone: "good", text: "Both" },
      urbanpro: { tone: "good", text: "Both" },
      superprof: { tone: "good", text: "Both" },
      vedantu: { tone: "mixed", text: "Mostly online classes" },
      sulekha: { tone: "good", text: "Both" },
      justdial: { tone: "good", text: "Both" },
      agency: { tone: "mixed", text: "Mostly home tuition" },
    },
  },
  {
    label: "Parents can post a requirement",
    cells: {
      mentr: { tone: "good", text: "Yes, tutors pitch to you" },
      urbanpro: { tone: "good", text: "Yes" },
      superprof: { tone: "mixed", text: "You search and message" },
      vedantu: { tone: "bad", text: "No, you pick a course" },
      sulekha: { tone: "good", text: "Yes, shared as a lead" },
      justdial: { tone: "mixed", text: "Enquiry form" },
      agency: { tone: "good", text: "Yes, by phone" },
    },
  },
  {
    label: "Speed to first conversation",
    cells: {
      mentr: { tone: "good", text: "Minutes with Instant Connect" },
      urbanpro: { tone: "mixed", text: "Hours to days" },
      superprof: { tone: "mixed", text: "Depends on tutor reply" },
      vedantu: { tone: "good", text: "Fast sales callback" },
      sulekha: { tone: "good", text: "Fast, but many calls" },
      justdial: { tone: "good", text: "Fast, but many calls" },
      agency: { tone: "mixed", text: "1–3 days" },
    },
  },
  {
    label: "Extra free tools for students",
    cells: {
      mentr: { tone: "good", text: "Snap & Grade CBSE marking, free Learn course" },
      urbanpro: { tone: "bad", text: "None" },
      superprof: { tone: "bad", text: "None" },
      vedantu: { tone: "mixed", text: "Free videos, paid courses" },
      sulekha: { tone: "bad", text: "None" },
      justdial: { tone: "bad", text: "None" },
      agency: { tone: "bad", text: "None" },
    },
  },
  {
    label: "Size of tutor network",
    cells: {
      mentr: { tone: "mixed", text: "Growing. Strongest in Bengaluru and online" },
      urbanpro: { tone: "good", text: "Very large across India" },
      superprof: { tone: "good", text: "Large, global" },
      vedantu: { tone: "mixed", text: "In-house faculty" },
      sulekha: { tone: "good", text: "Large in metros" },
      justdial: { tone: "good", text: "Very large" },
      agency: { tone: "mixed", text: "One neighbourhood's list" },
    },
  },
];

export type CompetitorDeepDive = {
  id: string;
  name: string;
  headline: string;
  howItWorks: string;
  strengths: string[];
  drawbacks: string[];
  mentrDifference: string;
  bestFor: string;
  readMore?: { label: string; href: string };
};

export const COMPETITOR_DEEP_DIVES: CompetitorDeepDive[] = [
  {
    id: "urbanpro",
    name: "UrbanPro",
    headline: "Mentr vs UrbanPro",
    howItWorks:
      "UrbanPro is India's best-known tutor directory. Parents post a requirement or browse profiles for free. Tutors usually pay, through coins or paid memberships, to unlock an enquiry and reply to it.",
    strengths: [
      "Huge number of listings across Indian cities",
      "Covers school subjects, hobbies, languages and professional skills",
      "Reviews on many older profiles",
    ],
    drawbacks: [
      "Tutors pay to reply, so they pick which enquiries to answer. Parents often get fewer replies than expected",
      "Tutors who spend on leads may make up the cost through higher fees",
      "Your contact details reach every tutor who unlocks your enquiry",
    ],
    mentrDifference:
      "On Mentr, tutors can reply to parent requests without buying leads, so replies come from people who want the student, not people who already paid for the lead. Your WhatsApp number is shared only after you and the tutor both agree to connect.",
    bestFor:
      "Parents in a city where Mentr has few tutors in their subject yet, or anyone looking for a niche skill.",
    readMore: { label: "Full Mentr vs UrbanPro breakdown", href: "/blog/mentr-vs-urbanpro" },
  },
  {
    id: "superprof",
    name: "Superprof",
    headline: "Mentr vs Superprof",
    howItWorks:
      "Superprof is an international tutor marketplace. Tutors list for free and many offer a free first lesson. Students usually need a paid Student Pass subscription to message tutors.",
    strengths: [
      "Polished profiles with photos, rates and teaching style",
      "Strong for music, languages, art and fitness",
      "Tutors from many countries for online lessons",
    ],
    drawbacks: [
      "Parents pay a subscription before they can talk to anyone",
      "Less focus on Indian boards (CBSE, ICSE, state boards) and exams like JEE and NEET",
      "The subscription can renew automatically if you forget to cancel",
    ],
    mentrDifference:
      "Mentr is free for parents from search to first chat, and it's built around Indian school boards, classes and localities. You never pay just to say hello.",
    bestFor: "Adults and hobby learners who want international tutors for skills.",
    readMore: { label: "Mentr vs Superprof in detail", href: "/blog/mentr-vs-superprof" },
  },
  {
    id: "vedantu",
    name: "Vedantu",
    headline: "Mentr vs Vedantu",
    howItWorks:
      "Vedantu is an edtech company that runs its own live online classes and courses, mainly for school students and JEE/NEET aspirants. You buy a course or programme. The company assigns the teachers and the schedule.",
    strengths: [
      "Structured syllabus, recorded lectures and regular tests",
      "Well known brand with strong exam-prep content",
      "Lots of free videos on YouTube",
    ],
    drawbacks: [
      "Course fees are paid upfront and are much higher than a single tutor's monthly fee",
      "Group classes. A shy or struggling child can get lost",
      "You can't choose or meet a home tutor in your area",
    ],
    mentrDifference:
      "Mentr connects you with an individual tutor you choose, for home or online one-on-one classes. You pay the tutor directly, month by month, and can stop any time. Many families pair free Vedantu videos with a Mentr tutor for doubts and practice.",
    bestFor: "Self-motivated students who do well in a structured group programme.",
    readMore: { label: "Vedantu alternatives for one-on-one help", href: "/blog/vedantu-alternatives-india" },
  },
  {
    id: "sulekha",
    name: "Sulekha",
    headline: "Mentr vs Sulekha",
    howItWorks:
      "Sulekha is a local services marketplace. It handles home tuition the same way it handles packers and movers or AC repair: you submit a requirement, and it's passed as a paid lead to several tutors and agencies who call you.",
    strengths: [
      "Quick responses in big cities",
      "Covers many subjects and hobby classes",
      "Simple enquiry form",
    ],
    drawbacks: [
      "Your number goes to several providers at once, so expect many calls",
      "A lot of the callers are agencies, not individual tutors",
      "Little detail on a tutor's teaching approach before they call",
    ],
    mentrDifference:
      "On Mentr you read full tutor profiles first, then decide who to talk to. Nobody gets your number until you accept a connection, and you won't be flooded with calls.",
    bestFor: "Parents who want calls fast and don't mind fielding several.",
    readMore: { label: "Sulekha tutor alternatives", href: "/blog/sulekha-tutor-alternatives" },
  },
  {
    id: "justdial",
    name: "Justdial",
    headline: "Mentr vs Justdial",
    howItWorks:
      "Justdial is a local business search engine. Searching for “home tutors near me” mostly shows coaching centres and tuition bureaus that pay for their listing. Sending an enquiry usually shares your number with several of them.",
    strengths: [
      "Covers almost every pin code",
      "Useful for finding coaching centres with a physical address",
      "Ratings on established businesses",
    ],
    drawbacks: [
      "Paid listings rank higher, which isn't always the same as better teaching",
      "Few individual tutor profiles with subjects and teaching style",
      "Enquiries can lead to calls for a long time afterwards",
    ],
    mentrDifference:
      "Mentr lists individual tutors with subjects, classes, boards, rates and availability, not businesses. Your number isn't passed on to vendors.",
    bestFor: "Parents looking specifically for a coaching centre near home.",
    readMore: { label: "Justdial tutor alternatives", href: "/blog/justdial-tutor-alternatives" },
  },
  {
    id: "agency",
    name: "Local tuition agencies",
    headline: "Mentr vs tuition agencies",
    howItWorks:
      "Neighbourhood tuition bureaus match a tutor to your child by phone. In return they commonly keep the first month's fee or a monthly cut of 10–30%, which is often built into what you pay.",
    strengths: [
      "Handle everything if you're short on time",
      "Will usually send a replacement tutor",
      "Good local knowledge in older neighbourhoods",
    ],
    drawbacks: [
      "The commission comes out of the tutor's pay or is added to your fee",
      "You rarely see other options or the tutor's full background",
      "Tutors who lose part of their pay may leave for better-paid students",
    ],
    mentrDifference:
      "Mentr takes no commission. The whole fee you agree goes to the tutor, which usually means a better-paid, longer-staying tutor at the same or lower cost to you.",
    bestFor: "Families who want a fully managed placement and accept the extra cost.",
    readMore: { label: "What agencies really charge", href: "/blog/tuition-agency-commission-india" },
  },
];

export const COST_SCENARIO = {
  monthlyFee: 6000,
  months: 10,
  rows: [
    {
      id: "mentr",
      name: "Mentr",
      platformCost: 0,
      note: "No placement fee, no commission. The full ₹60,000 goes to the tutor.",
    },
    {
      id: "agency-month",
      name: "Agency (first month's fee)",
      platformCost: 6000,
      note: "One month's fee kept as a placement charge.",
    },
    {
      id: "agency-cut",
      name: "Agency (20% monthly cut)",
      platformCost: 12000,
      note: "₹1,200 a month taken from the fee for 10 months.",
    },
    {
      id: "superprof",
      name: "Superprof Student Pass",
      platformCost: null,
      note: "A subscription just to message tutors. Check current pricing.",
    },
    {
      id: "lead-sites",
      name: "Paid-lead sites (UrbanPro, Sulekha)",
      platformCost: null,
      note: "Free for you, but tutors' lead spending can show up in their fees.",
    },
  ],
} as const;

export const COMPARISON_FAQS = [
  {
    question: "Which is the best tutor platform in India in 2026?",
    answer:
      "For most parents looking for a school tutor (CBSE, ICSE or a state board) at home or online, Mentr is the best starting point. It's free for parents, tutors don't pay per lead, there's no commission, and your number stays private until you accept a tutor. UrbanPro has more listings nationally, and Vedantu suits students who want a structured group course.",
  },
  {
    question: "Is Mentr really free for parents?",
    answer:
      "Yes. Searching, shortlisting, posting a requirement, booking a demo, and accepting a pitch are all free. You agree fees directly with the tutor and Mentr takes no cut.",
  },
  {
    question: "How does Mentr make money if parents don't pay?",
    answer:
      "Tutors can list, receive requests and teach for free. Some choose an optional Premium plan (about ₹449 a month) for unlimited pitches, featured placement and extra parent contact unlocks. That's the business. No commission, no selling parent leads.",
  },
  {
    question: "Is Mentr better than UrbanPro?",
    answer:
      "Mentr is better if you want replies from tutors who didn't pay to contact you, your number kept private, and no lead costs pushing up fees. UrbanPro is better if you need the biggest possible directory or a very niche subject in a city where Mentr is still growing. Many parents post on both.",
  },
  {
    question: "Mentr or Vedantu: which should I choose for my child?",
    answer:
      "Choose Vedantu if your child is self-driven and does well in live group classes with a fixed syllabus. Choose a Mentr tutor if your child needs one-on-one attention, has specific gaps, is shy in class, or you'd rather pay monthly than a big course fee upfront.",
  },
  {
    question: "Why do I get so many calls after using Sulekha or Justdial?",
    answer:
      "Both work on a lead model. Your enquiry goes to several paying tutors, agencies and coaching centres, and each of them calls you. On Mentr, tutors see your requirement without your number, and contact opens only after you accept.",
  },
  {
    question: "Are tutors on Mentr verified?",
    answer:
      "Tutors verify their email and complete a detailed profile with subjects, classes, boards, experience and availability. Profiles that pass Mentr's review get a Verified badge. As with any platform, always take a trial class and check references before committing.",
  },
  {
    question: "Does Mentr work outside Bengaluru?",
    answer:
      "Yes. Online tutoring works anywhere in India and for families abroad, including IGCSE students. Home tuition coverage is strongest in Bengaluru and growing in other cities. If there are few tutors near you, post a requirement and let tutors come to you.",
  },
];

export const COMPARISON_RELATED = [
  { label: "UrbanPro alternatives (2026)", href: "/blog/urbanpro-alternatives" },
  { label: "Sulekha tutor alternatives", href: "/blog/sulekha-tutor-alternatives" },
  { label: "Vedantu alternatives for one-on-one tuition", href: "/blog/vedantu-alternatives-india" },
  { label: "MyPrivateTutor alternatives", href: "/blog/myprivatetutor-alternatives-india" },
  { label: "TeacherOn alternatives", href: "/blog/teacheron-alternatives" },
  { label: "Best free tutor platforms in India", href: "/blog/best-free-tutor-platforms-india" },
  { label: "How tutoring platforms make money", href: "/blog/how-tutoring-platforms-make-money" },
];
