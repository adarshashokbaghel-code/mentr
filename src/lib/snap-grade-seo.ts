/**
 * Stable facts for meta, schema, and landing copy — keep in sync.
 */
import { absoluteUrl, SITE_BRAND, SITE_NAME } from "@/lib/seo";

export const SNAP_GRADE_FACT_SHEET = {
  productName: "Snap & Grade",
  brandLine: "Snap & Grade by Mentr",
  tagline: "Practised the chapter. Still unsure about marks?",
  oneLiner:
    "Snap & Grade on mentr.in grades your Class 9–12 NCERT practice answers as per CBSE step marking — so you know your marks, how to write the answer, and stop losing marks on steps.",
  level: "CBSE Class 9–12",
  subjects: "Mathematics · Science · Physics · Chemistry · Biology · NCERT + board practice",
  board: "CBSE",
  path: "/snapandgrade",
  questionCount: "3500+",
  freeCredits: 100,
  creditsPerEval: 5,
  minTopUpInr: 1,
  latencyTargetSec: 8,
  notIncluded:
    "Custom photo questions (coming soon), mentor batch grading and WhatsApp parent reports.",
} as const;

export const SNAP_GRADE_KEYWORDS = [
  "Snap & Grade",
  "Snap and Grade",
  "mentr.in/snapandgrade",
  "Snap & Grade by Mentr",
  "CBSE Class 9 10 11 12 marking scheme",
  "CBSE step marking practice",
  "grade NCERT answers online",
  "how to write CBSE answers",
  "lose marks on steps CBSE",
  "Class 9 Maths NCERT marking",
  "Class 10 Maths NCERT photo grade",
  "Class 11 Maths NCERT answer check",
  "Class 12 Maths CBSE marking scheme",
  "Class 9 Science NCERT marking",
  "Class 10 Science CBSE step marks",
  "Class 11 Physics NCERT exercises",
  "Class 12 Physics CBSE step marks",
  "Class 11 Chemistry NCERT exercises",
  "Class 12 Chemistry CBSE step marks",
  "Class 11 Biology NCERT exercises",
  "Class 12 Biology CBSE step marks",
  "CBSE board exam practice marking",
  "CBSE PYQ marking scheme",
  "CBSE sample paper step marking",
  "photo homework marks CBSE",
  "ChatGPT vs CBSE marking scheme",
  "NCERT exercise answer check",
  "NCERT Class 9–12 PDF download",
  "exam writing practice CBSE",
];

export const SNAP_GRADE_FAQS = [
  {
    question: "What is Snap & Grade?",
    answer:
      "Snap & Grade is Mentr’s CBSE practice tool. You pick a Class 9–12 NCERT question, photograph the answer you already wrote, and get step marks the way a board examiner awards them — plus short tips on how to write it next time.",
  },
  {
    question: "Who is it for?",
    answer:
      "Students in Class 9–12 who have practised the chapter but still don’t know what they would score. Parents who want a clear mark sheet, not a vague “looks correct”.",
  },
  {
    question: "Which classes, subjects and papers are covered?",
    answer:
      "CBSE Class 9–12. NCERT Maths, Science, and Class 11–12 Physics, Chemistry and Biology question banks are live. Board papers, PYQs and sample papers for Class 10–12 sit in the same practice flow — pick a question, snap your work, get full step marking.",
  },
  {
    question: "How is this different from ChatGPT or other AI?",
    answer:
      "ChatGPT guesses from whatever marking scheme you upload. Snap & Grade already has a CBSE-style key on every question — formula, working, units, final answer. You don’t hunt a PDF. You pick the question and see marks the way CBSE splits them.",
  },
  {
    question: "Why do students lose marks even after practising?",
    answer:
      "About 3 in 10 students lose marks because they don’t know how to write the answer — missing a step, units, or the statement the examiner wants. Snap & Grade shows which step was cut and how to write it in the exam.",
  },
  {
    question: "How do credits work?",
    answer:
      "New accounts get 100 free credits once. A full step-marked check uses about 5 credits. After that, recharge from ₹1 (₹1 = 1 credit) via Razorpay. Credits stay on your account.",
  },
  {
    question: "Do you store my solution photo?",
    answer:
      "No. History saves the question, your marks, the text we graded, and tips — not the photo. Sign-in is only so your wallet and history stay on your account.",
  },
  {
    question: "Can I download NCERT chapter PDFs?",
    answer:
      "Yes. On the same page you can open Class 9–12 Maths, Class 9–10 Science, and Class 11–12 Physics, Chemistry and Biology chapter PDFs in the on-site reader — study, practise, then grade.",
  },
  {
    question: "Where do I start?",
    answer:
      "Go to mentr.in/snapandgrade/grade, log in as a parent or student, pick class → subject → chapter → question, snap a clear photo, confirm the text, and see step marks.",
  },
  {
    question: "Is Snap & Grade free?",
    answer:
      "Yes to start. You get 100 free credits once. That is about 20 full grades. After that you pay from ₹1. ₹1 = 1 credit. A full grade uses about 5 credits.",
  },
  {
    question: "Do I need a tutor for this?",
    answer:
      "No. Snap & Grade is for self-practice. You write the answer at home, snap it, and see marks. You can still hire a tutor on Mentr if you want extra help.",
  },
  {
    question: "Does it work on a phone?",
    answer:
      "Yes. Open mentr.in/snapandgrade on your phone browser. Take a photo of the notebook page with the camera. No app to install.",
  },
  {
    question: "What if my photo is blurry?",
    answer:
      "Take it again in good light, on a flat page, with all working in the frame. You can also edit the digital text before we grade — credits go only after you confirm.",
  },
  {
    question: "Is this the official CBSE mark sheet?",
    answer:
      "No. It is practice marking in the CBSE style — step by step, like a board key. It helps you write better. It is not your board result.",
  },
] as const;

export const SNAP_GRADE_TESTIMONIALS = [
  {
    quote:
      "I used to lose 2 marks on units even when the sum was right. Now I see the cut before the test.",
    name: "Ananya Sharma",
    detail: "Class 10 · Maths · Jaipur",
  },
  {
    quote:
      "My son practises every night. I finally see which step he skipped — not just a tick or a cross.",
    name: "Meera Patel",
    detail: "Parent · Class 9 · Ahmedabad",
  },
  {
    quote:
      "ChatGPT said my derivation was fine. Snap & Grade showed the missing statement. That is the board mark.",
    name: "Rohan Iyer",
    detail: "Class 12 · Physics · Chennai",
  },
  {
    quote:
      "Sample paper + photo of my working. Same place. I stopped guessing my score before pre-boards.",
    name: "Fatima Khan",
    detail: "Class 10 · Science · Hyderabad",
  },
  {
    quote:
      "I practise sets at night and grade in the morning. The missing reason line is always the one I skip when I am tired.",
    name: "Arjun Reddy",
    detail: "Class 11 · Maths · Hyderabad",
  },
  {
    quote:
      "We do not wait for the tutor to mark homework. She snaps the page, we see the steps, then we ask better questions in class.",
    name: "Kavya Nair",
    detail: "Parent · Class 12 · Kochi",
  },
] as const;

export const SNAP_GRADE_GUIDES = [
  {
    slug: "what-is-snap-and-grade",
    title: "What is Snap & Grade?",
    blurb: "The CBSE photo grader, in plain English.",
  },
  {
    slug: "how-to-write-cbse-answers-to-keep-step-marks",
    title: "How to write CBSE answers so you keep step marks",
    blurb: "Formula, working, units, last line — on the page.",
  },
  {
    slug: "chatgpt-vs-cbse-marking-scheme",
    title: "ChatGPT vs a CBSE marking scheme",
    blurb: "Why uploading a PDF is not the same as board steps.",
  },
  {
    slug: "why-students-lose-marks-on-steps-cbse",
    title: "Why students lose marks on steps",
    blurb: "The quiet leak after you already know the method.",
  },
  {
    slug: "grade-ncert-answers-from-a-photo",
    title: "Grade NCERT answers from a photo",
    blurb: "Pick the question. Snap the notebook. See the split.",
  },
] as const;

export type SnapGradeCluster = {
  slug: string;
  classLevel?: number;
  subject?: string;
  title: string;
  metaDescription: string;
  h1: string;
  h1Accent: string;
  eyebrow: string;
  intro: string;
  what: string;
  benefit: string;
  keywords: string[];
};

/** Intent landings — unique H1 + intro; shared product facts. */
export const SNAP_GRADE_CLUSTERS: SnapGradeCluster[] = [
  {
    slug: "class-9-maths",
    classLevel: 9,
    subject: "Mathematics",
    title: "Class 9 Maths NCERT — CBSE step marking | Snap & Grade",
    metaDescription:
      "Grade Class 9 Maths NCERT answers from a photo. CBSE-style step marks and writing tips. 100 free credits on Mentr Snap & Grade.",
    h1: "Class 9 Maths NCERT",
    h1Accent: "marked like CBSE.",
    eyebrow: "Snap & Grade · Class 9",
    intro:
      "Class 9 Maths is where step marking starts to matter — number systems, polynomials, lines, triangles. If you skip a reason or a formula line, the mark goes. Snap & Grade lets you photograph the sum you already wrote and see which step a CBSE-style key would keep.",
    what: "Pick the exact NCERT exercise question, snap your notebook, and get marks by step — not a vague “correct”.",
    benefit:
      "Fix writing habits in Class 9 so Class 10 boards do not surprise you.",
    keywords: [
      "Class 9 Maths NCERT marking",
      "Class 9 Maths photo grade",
      "CBSE Class 9 step marking",
    ],
  },
  {
    slug: "class-9-science",
    classLevel: 9,
    subject: "Science",
    title: "Class 9 Science NCERT — CBSE step marking | Snap & Grade",
    metaDescription:
      "Check Class 9 Science NCERT answers from a photo. See step marks for reasons, units, and definitions — CBSE style on Mentr.",
    h1: "Class 9 Science NCERT",
    h1Accent: "reasons, not one-word answers.",
    eyebrow: "Snap & Grade · Class 9",
    intro:
      "Class 9 Science answers lose marks when the reason is missing — even if the fact is right. Snap & Grade grades your written page against a CBSE-style key so you learn the sentence the examiner wants, not only the keyword.",
    what: "Photograph your Science exercise answer. See which line earned the mark.",
    benefit:
      "Practise definitions and reasons the way short-answer papers actually award them.",
    keywords: [
      "Class 9 Science NCERT marking",
      "Class 9 Science answer check",
      "CBSE Class 9 Science steps",
    ],
  },
  {
    slug: "class-10-maths",
    classLevel: 10,
    subject: "Mathematics",
    title: "Class 10 Maths board practice — CBSE marking | Snap & Grade",
    metaDescription:
      "Class 10 Maths NCERT and board-style practice. Photo your working, get CBSE step marks. Free credits to start on Mentr Snap & Grade.",
    h1: "Class 10 Maths",
    h1Accent: "know the marks before boards.",
    eyebrow: "Snap & Grade · Class 10",
    intro:
      "Class 10 Maths boards split marks on formula, substitution, and the last line. Students who “know the method” still drop marks on units and statements. Snap & Grade grades the page you wrote in your notebook — NCERT, sample paper, or PYQ-style items — against that split.",
    what: "Same flow as the exam: write on paper, then see a step mark sheet.",
    benefit:
      "Walk into boards knowing how you lose marks — and how to write so you don’t.",
    keywords: [
      "Class 10 Maths CBSE marking scheme",
      "Class 10 Maths NCERT photo grade",
      "board exam Maths step marks",
    ],
  },
  {
    slug: "class-10-science",
    classLevel: 10,
    subject: "Science",
    title: "Class 10 Science board practice — CBSE marking | Snap & Grade",
    metaDescription:
      "Grade Class 10 Science written answers from a photo. CBSE-style steps for reasons, diagrams notes, and values. Start free on Mentr.",
    h1: "Class 10 Science",
    h1Accent: "write the reason, keep the mark.",
    eyebrow: "Snap & Grade · Class 10",
    intro:
      "Class 10 Science papers reward a complete reason, not a one-word fact. Snap & Grade checks your handwritten answer against a CBSE-style key so you see if the explanation was enough — before the board does.",
    what: "Snap the Science answer you practised. See step marks and a short writing tip.",
    benefit:
      "Stop losing easy marks on “give reason” and numericals with units.",
    keywords: [
      "Class 10 Science CBSE marking",
      "Class 10 Science NCERT answers",
      "board Science step marking",
    ],
  },
  {
    slug: "class-11-maths",
    classLevel: 11,
    subject: "Mathematics",
    title: "Class 11 Maths NCERT — CBSE step marking | Snap & Grade",
    metaDescription:
      "Class 11 Maths NCERT photo grading. Sets, relations, calculus beginnings — CBSE-style step marks and writing tips on Mentr Snap & Grade.",
    h1: "Class 11 Maths NCERT",
    h1Accent: "steps that survive Class 12.",
    eyebrow: "Snap & Grade · Class 11",
    intro:
      "Class 11 Maths looks long. Marks still sit on the working, not only the final value. Snap & Grade lets you photograph a Sets, Relations, or Trigonometry answer and see the CBSE-style split — so JEE-prep students do not skip board writing.",
    what: "Pick the NCERT question, snap your copy, get marks by step.",
    benefit:
      "Keep board writing sharp while you also practise for JEE.",
    keywords: [
      "Class 11 Maths NCERT marking",
      "Class 11 Maths step marks",
      "CBSE Class 11 Maths practice",
    ],
  },
  {
    slug: "class-11-physics",
    classLevel: 11,
    subject: "Physics",
    title: "Class 11 Physics NCERT — CBSE step marking | Snap & Grade",
    metaDescription:
      "Grade Class 11 Physics NCERT numericals and derivations from a photo. Formula, working, units — CBSE-style on Mentr Snap & Grade.",
    h1: "Class 11 Physics",
    h1Accent: "derivations marked step by step.",
    eyebrow: "Snap & Grade · Class 11",
    intro:
      "Class 11 Physics numericals lose marks on formula, substitution, and units. Derivations lose marks when a statement is skipped. Snap & Grade grades the page you wrote — so you practise like the paper, not like a calculator.",
    what: "Photograph your Physics working. See which line a CBSE-style key would award.",
    benefit:
      "Build the habit of writing units and reasons before Class 12 boards.",
    keywords: [
      "Class 11 Physics NCERT marking",
      "Class 11 Physics numericals steps",
      "CBSE Physics derivation marks",
    ],
  },
  {
    slug: "class-12-maths",
    classLevel: 12,
    subject: "Mathematics",
    title: "Class 12 Maths board practice — CBSE marking | Snap & Grade",
    metaDescription:
      "Class 12 Maths NCERT and board-style photo grading. Calculus and more — CBSE step marks. 100 free credits on Mentr Snap & Grade.",
    h1: "Class 12 Maths",
    h1Accent: "calculus, written for boards.",
    eyebrow: "Snap & Grade · Class 12",
    intro:
      "Class 12 Maths boards still mark steps. A correct integral with a missing substitution line can drop marks. Snap & Grade grades your notebook page against a CBSE-style key so pre-board practice is honest.",
    what: "NCERT, sample paper, PYQ-style items — snap and see the split.",
    benefit:
      "Know your marks on the working, not after the result day.",
    keywords: [
      "Class 12 Maths CBSE marking scheme",
      "Class 12 Maths NCERT photo grade",
      "board Maths step marking",
    ],
  },
  {
    slug: "class-12-physics",
    classLevel: 12,
    subject: "Physics",
    title: "Class 12 Physics board practice — CBSE marking | Snap & Grade",
    metaDescription:
      "Class 12 Physics derivations and numericals from a photo. CBSE-style step marks and writing tips. Start free on Mentr Snap & Grade.",
    h1: "Class 12 Physics",
    h1Accent: "the derivation on the page.",
    eyebrow: "Snap & Grade · Class 12",
    intro:
      "Class 12 Physics papers give marks for the derivation path, not only the formula. Snap & Grade checks the handwritten working you already did — so you see the missing statement before the board examiner does.",
    what: "Snap your numerical or derivation. Get step marks and a short tip.",
    benefit:
      "Practise board writing and JEE speed without mixing them up.",
    keywords: [
      "Class 12 Physics CBSE marking",
      "Class 12 Physics derivation marks",
      "board Physics step marking",
    ],
  },
  {
    slug: "cbse-marking-scheme",
    title: "CBSE marking scheme practice — photo your answer | Snap & Grade",
    metaDescription:
      "Practise CBSE step marking without hunting a PDF. Pick the question, photo your notebook, see formula–working–answer marks on Mentr Snap & Grade.",
    h1: "CBSE marking scheme",
    h1Accent: "on your own handwriting.",
    eyebrow: "Snap & Grade · Boards",
    intro:
      "Most students search “CBSE marking scheme” and get a PDF they never match to their own page. Snap & Grade already has a CBSE-style key on the question. You photograph the answer you wrote. You see the same kind of split a board key uses — formula, working, units, final line.",
    what: "No uploading a marking-scheme photo to ChatGPT. The key sits on the question.",
    benefit:
      "Learn how CBSE awards marks by practising on your real working.",
    keywords: [
      "CBSE marking scheme practice",
      "CBSE step marking online",
      "how CBSE awards marks",
    ],
  },
  {
    slug: "ncert-photo-grade",
    title: "Grade NCERT answers from a photo — CBSE steps | Snap & Grade",
    metaDescription:
      "Photo your NCERT Maths, Science, or Physics answer. Get CBSE-style step marks and writing tips. Class 9–12. Free credits on Mentr.",
    h1: "Photo your NCERT answer.",
    h1Accent: "Get step marks.",
    eyebrow: "Snap & Grade · NCERT",
    intro:
      "You already solved the NCERT exercise in the notebook. Snap & Grade is the next step: photograph that page, confirm the text, and see marks the CBSE way. Class 9–12 Maths, Science, and Class 11–12 Physics — 2000+ questions, chapter PDFs on the same site.",
    what: "Pick the NCERT question we loaded. Snap. Confirm. Grade.",
    benefit:
      "Study, practise, and grade in one place — without retyping the sum.",
    keywords: [
      "grade NCERT answers photo",
      "NCERT exercise answer check",
      "photo homework marks CBSE",
    ],
  },
];

export function snapGradeClusterPath(slug: string): string {
  return `${SNAP_GRADE_FACT_SHEET.path}/${slug}`;
}

export function snapGradeHowToJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "How to grade a CBSE practice answer with Snap & Grade",
    description: SNAP_GRADE_FACT_SHEET.oneLiner,
    totalTime: "PT3M",
    step: [
      {
        "@type": "HowToStep",
        name: "Pick the question",
        text: "Choose class, subject, chapter, and the exact NCERT or board-style question. The CBSE-style marking key is already on it.",
      },
      {
        "@type": "HowToStep",
        name: "Snap your notebook",
        text: "Photograph the handwritten solution. Confirm or edit the digital text. Credits are not charged until you confirm.",
      },
      {
        "@type": "HowToStep",
        name: "See step marks",
        text: "Get marks for formula, working, units, and the final line, plus a short tip on how to write it in the exam.",
      },
    ],
  };
}

export function snapGradeWebPageJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: `${SNAP_GRADE_FACT_SHEET.brandLine} — CBSE Class 9–12 marking practice`,
    description: SNAP_GRADE_FACT_SHEET.oneLiner,
    url: absoluteUrl(SNAP_GRADE_FACT_SHEET.path),
    isPartOf: {
      "@type": "WebSite",
      name: SITE_BRAND,
      url: absoluteUrl("/"),
    },
    about: {
      "@type": "Thing",
      name: SITE_NAME,
    },
  };
}

export function snapGradeSoftwareJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: SNAP_GRADE_FACT_SHEET.productName,
    applicationCategory: "EducationalApplication",
    operatingSystem: "Web",
    url: absoluteUrl(SNAP_GRADE_FACT_SHEET.path),
    description: SNAP_GRADE_FACT_SHEET.oneLiner,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "INR",
      description: `${SNAP_GRADE_FACT_SHEET.freeCredits} free credits on signup; recharge from ₹${SNAP_GRADE_FACT_SHEET.minTopUpInr} (₹1 = 1 credit)`,
    },
  };
}
