/** Mentr Tools catalog — public SEO tools (no login). */

export type ToolAudience = "teachers" | "students" | "pdf";

export type ToolAccent =
  | "coral"
  | "sage"
  | "butter"
  | "lavender"
  | "sky"
  | "ink";

export type ToolIcon =
  | "merge"
  | "split"
  | "compress"
  | "image"
  | "organize"
  | "text"
  | "tags"
  | "counter"
  | "timetable"
  | "cgpa"
  | "attendance"
  | "report"
  | "rubric"
  | "certificate"
  | "seating"
  | "percent"
  | "grade"
  | "countdown"
  | "timer";

export type ToolDef = {
  slug: string;
  title: string;
  shortTitle: string;
  description: string;
  intro: string;
  howTo: string[];
  useCases: string[];
  privacyNote: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  audience: ToolAudience[];
  icon: ToolIcon;
  accent: ToolAccent;
  popular?: boolean;
  /** When set, tool page links to /blog/[slug] */
  blogSlug?: string;
  faqs: { question: string; answer: string }[];
  /** Hide from “Popular” and default hub emphasis */
  deEmphasized?: boolean;
};

export const TOOLS_HUB = {
  path: "/tools",
  title: "Free Education Tools for Teachers, Tutors & Students | Mentr",
  description:
    "Free PDF tools for WhatsApp homework, CGPA to percentage, study timetable PDF, name tags & background remover — private, no signup. भारत में tutors और parents के लिए। Find a tutor after you finish.",
  keywords: [
    "free teacher tools",
    "cgpa calculator",
    "cgpa to percentage",
    "study timetable pdf",
    "merge pdf online free",
    "compress pdf for whatsapp",
    "images to pdf",
    "free pdf tools India",
    "पीडीएफ मर्ज",
    "सीजीपीए कैलकुलेटर",
    "Mentr tools",
  ],
} as const;

const privateBrowser =
  "Runs in your browser. We do not upload your inputs to Mentr servers for this tool.";

export const TOOLS: ToolDef[] = [
  // ── Student / classroom helpers ────────────────────────────────
  {
    slug: "cgpa-calculator",
    title: "CGPA Calculator",
    shortTitle: "CGPA",
    description:
      "Convert CGPA to approximate percentage (×9.5, ×10, or custom) — free for CBSE / college forms in India.",
    intro:
      "Enter your CGPA on a 0–10 scale and choose a conversion method. Many Indian schools cite ×9.5; some universities use ×10 or a custom rule. Results are informational only — always confirm with your board, school, or university before using on applications.",
    howTo: [
      "Enter CGPA (0–10 scale).",
      "Choose ×9.5, ×10, or a custom multiplier.",
      "Read the approximate percentage and the caveat.",
    ],
    useCases: [
      "College / scholarship form estimates",
      "Parent–teacher percentage discussions",
      "Comparing CBSE-style vs university scales",
    ],
    privacyNote: "Calculation runs entirely in your browser.",
    metaTitle: "CGPA to Percentage Calculator Free (India) | Mentr",
    metaDescription:
      "Free CGPA to percentage calculator for India — ×9.5, ×10 or custom. सीजीपीए से प्रतिशत. Confirm with your school. No signup.",
    keywords: [
      "cgpa calculator",
      "cgpa to percentage",
      "cgpa to percentage calculator",
      "cgpa to percentage cbse",
      "सीजीपीए कैलकुलेटर",
      "सीजीपीए से प्रतिशत",
      "cgpa ko percentage",
      "10 point cgpa to percentage",
    ],
    audience: ["students"],
    icon: "cgpa",
    accent: "lavender",
    popular: true,
    faqs: [
      {
        question: "Is ×9.5 official for everyone in India?",
        answer:
          "No. Some CBSE contexts cite ×9.5, but boards and universities publish different rules. Use custom multiplier when your marksheet or circular specifies one.",
      },
      {
        question: "क्या यह प्रतिशत आधिकारिक है?",
        answer:
          "नहीं — यह अनुमान है। अपने स्कूल / बोर्ड / यूनिवर्सिटी के नियम से जाँचें।",
      },
    ],
  },
  {
    slug: "study-timetable",
    title: "Study Timetable Generator",
    shortTitle: "Timetable",
    description:
      "Build a weekly study plan and download a printable A4 PDF for boards or tuition.",
    intro:
      "Fill Morning / Afternoon / Evening cells for Mon–Sun, then download a landscape A4 PDF for the wall or WhatsApp. Ideal for CBSE / ICSE board revision and tutor–student shared plans.",
    howTo: [
      "Name the week.",
      "Fill subject slots.",
      "Download the timetable PDF.",
    ],
    useCases: [
      "CBSE / ICSE board revision weeks",
      "Tutor + student shared plans on WhatsApp",
      "Holiday homework structure",
    ],
    privacyNote: privateBrowser,
    metaTitle: "Free Study Timetable PDF Generator India | Mentr",
    metaDescription:
      "Make a free weekly study timetable PDF for Class 6–12 and boards. पढ़ाई का टाइमटेबल PDF. Print or WhatsApp — no signup.",
    keywords: [
      "study timetable pdf",
      "weekly study plan",
      "timetable generator",
      "board exam timetable",
      "पढ़ाई का टाइमटेबल",
      "study timetable for class 10",
      "NEET study schedule pdf",
    ],
    audience: ["students", "teachers"],
    icon: "timetable",
    accent: "lavender",
    popular: true,
    blogSlug: "study-timetable-pdf-students",
    faqs: [
      {
        question: "Can tutors fill this with students?",
        answer: "Yes — build it in a session and share the PDF on WhatsApp.",
      },
    ],
  },

  // ── PDF tools ──────────────────────────────────────────────────
  {
    slug: "pdf-merge",
    title: "Merge PDF",
    shortTitle: "Merge PDF",
    description:
      "Combine homework PDFs into one file for WhatsApp or printing — private, in your browser.",
    intro:
      "Merge homework packs, notes and worksheets into one file for WhatsApp or the neighbourhood print shop. Processing stays on your device — no upload to random merge sites.",
    howTo: [
      "Drop two or more PDFs.",
      "Reorder with arrows.",
      "Merge & download.",
    ],
    useCases: [
      "Weekly homework packs for parents",
      "Board revision booklets",
      "Tuition session handouts",
    ],
    privacyNote:
      "Merging runs in your browser. Files are not uploaded to Mentr servers.",
    metaTitle: "Merge PDF Online Free — WhatsApp Homework | Mentr",
    metaDescription:
      "Merge PDF free online in your browser for school & tuition. पीडीएफ मर्ज करें — no signup, files stay on your device.",
    keywords: [
      "merge pdf online free",
      "combine pdf",
      "merge pdf for teachers",
      "merge homework pdf whatsapp",
      "पीडीएफ मर्ज",
      "pdf merge karo",
      "merge pdf India free",
    ],
    audience: ["pdf", "teachers", "students"],
    icon: "merge",
    accent: "coral",
    popular: true,
    blogSlug: "merge-pdf-online-free",
    faqs: [
      {
        question: "Do you upload my PDFs?",
        answer: "No. Merging runs in your browser.",
      },
    ],
  },
  {
    slug: "pdf-compress",
    title: "Compress PDF",
    shortTitle: "Compress PDF",
    description:
      "Shrink PDF size for WhatsApp (≈16 MB limit), email, or school portals — private.",
    intro:
      "Compress homework PDFs in the browser so WhatsApp and school portals accept them — without uploading exam papers to a random site.",
    howTo: [
      "Choose a PDF.",
      "Pick Light or Strong.",
      "Download and check readability.",
    ],
    useCases: [
      "WhatsApp homework sharing",
      "School / college portal uploads",
      "Email attachments under size caps",
    ],
    privacyNote:
      "Compression runs in your browser. Files are not uploaded to Mentr servers.",
    metaTitle: "Compress PDF for WhatsApp Free India | Mentr",
    metaDescription:
      "Compress PDF free for WhatsApp and school portals — no upload. पीडीएफ कंप्रेस. Light or Strong mode. No signup.",
    keywords: [
      "compress pdf for whatsapp",
      "reduce pdf size online free",
      "compress pdf India",
      "whatsapp pdf size limit",
      "पीडीएफ कंप्रेस",
      "pdf size kam kare",
    ],
    audience: ["pdf", "teachers", "students"],
    icon: "compress",
    accent: "butter",
    popular: true,
    blogSlug: "compress-pdf-for-whatsapp",
    faqs: [
      {
        question: "Will quality drop?",
        answer:
          "Strong mode scales pages slightly. Keep originals for high-quality print.",
      },
    ],
  },
  {
    slug: "background-remover",
    title: "Free Background Remover",
    shortTitle: "Background remover",
    description:
      "Remove image backgrounds and download a transparent PNG — free forever, no watermark, no signup.",
    intro:
      "Upload a photo, remove the background on your device, preview the transparent result, and download a PNG. Free forever with no watermark and no mandatory signup. Processing is private: your image never leaves this browser. Built as a dedicated utility while remove.bg’s standalone site moves into Canva (shutdown announced for 1 December 2026).",
    howTo: [
      "Upload a JPG, PNG, or WEBP image.",
      "Wait while the model prepares (first visit loads ~94 MB from Mentr, then cached).",
      "Compare original vs transparent result.",
      "Download the PNG, or start over with another image.",
    ],
    useCases: [
      "Product photos for worksheets",
      "Student / ID-style cutouts",
      "Classroom slides and posters",
      "Homework images without cluttered backgrounds",
    ],
    privacyNote:
      "Private processing on your device. The model loads from Mentr’s CDN into your browser cache — your image never uploads.",
    metaTitle: "Free Background Remover Online — No Watermark | Mentr",
    metaDescription:
      "Remove image background free — transparent PNG, no watermark, no signup. बैकग्राउंड हटाएँ. Runs privately in your browser.",
    keywords: [
      "free background remover",
      "background remover",
      "remove background online free",
      "transparent PNG",
      "no watermark background remover",
      "बैकग्राउंड रिमूवर",
      "photo background hataye",
      "ID photo background remove",
    ],
    audience: ["pdf", "teachers", "students"],
    icon: "image",
    accent: "lavender",
    popular: true,
    faqs: [
      {
        question: "Does my image leave my device?",
        answer:
          "No. Standard mode runs entirely in your browser. We do not upload your photo to Mentr servers.",
      },
      {
        question: "Why is the first run slow?",
        answer:
          "The background-removal model (~94 MB) loads once from Mentr and is cached in your browser. Later runs skip that download. Phones use a lighter path (smaller canvas, no second pass).",
      },
      {
        question: "Is there a watermark?",
        answer: "No. Downloads are transparent PNGs without a Mentr watermark.",
      },
      {
        question: "Which model do you use?",
        answer:
          "BiRefNet_lite (MIT), browser-optimized 512×512 ONNX. Soft alpha matte with light edge cleanup. Full architecture: /technical/bgremover.",
      },
      {
        question: "Is it free forever?",
        answer:
          "Yes for on-device processing — no watermark and no mandatory signup. That is why we run inference in your browser instead of a paid GPU API.",
      },
    ],
  },
  {
    slug: "images-to-pdf",
    title: "Images to PDF",
    shortTitle: "Images → PDF",
    description:
      "Turn JPG / PNG homework notebook photos into one PDF for WhatsApp.",
    intro:
      "Convert camera shots of homework into one reorderable PDF, then compress if WhatsApp complains. Built for parents and tutors in India.",
    howTo: ["Add images", "Reorder", "Create PDF"],
    useCases: ["Homework notebook photos", "Whiteboard / board shots"],
    privacyNote:
      "Conversion runs in your browser. Photos are not uploaded to Mentr.",
    metaTitle: "Images to PDF Free — Homework Photos | Mentr",
    metaDescription:
      "Convert JPG/PNG homework photos to one PDF free. फोटो से पीडीएफ. Private, reorder pages — then WhatsApp. No signup.",
    keywords: [
      "images to pdf",
      "jpg to pdf",
      "homework photos pdf",
      "photo to pdf whatsapp",
      "फोटो से पीडीएफ",
      "notebook scan to pdf",
    ],
    audience: ["pdf", "teachers", "students"],
    icon: "image",
    accent: "lavender",
    popular: true,
    blogSlug: "images-to-pdf-homework",
    faqs: [
      {
        question: "Which formats work?",
        answer: "JPG, JPEG, PNG, and WebP.",
      },
    ],
  },
  {
    slug: "pdf-organize",
    title: "Organize PDF pages",
    shortTitle: "Organize PDF",
    description: "Reorder or delete pages, then download a clean PDF for class.",
    intro:
      "Fix out-of-order phone scans and remove blank pages before sharing with parents or the print shop.",
    howTo: ["Upload PDF", "Reorder or delete", "Download"],
    useCases: ["Phone homework scans", "Clean tuition worksheets"],
    privacyNote: "Page edits stay local. We do not store your PDF.",
    metaTitle: "Reorder & Delete PDF Pages Free | Mentr Tools",
    metaDescription:
      "Reorder or delete PDF pages free in your browser. स्कैन पेज ठीक करें — no signup, private for school files.",
    keywords: [
      "reorder pdf pages",
      "delete pdf pages",
      "organize pdf",
      "fix scan page order",
      "पीडीएफ पेज ठीक करें",
    ],
    audience: ["pdf", "teachers"],
    icon: "organize",
    accent: "sky",
    blogSlug: "organize-pdf-pages-free",
    faqs: [
      {
        question: "Does delete change my original file?",
        answer: "Only the new download. Your original stays unchanged.",
      },
    ],
  },
  {
    slug: "pdf-extract-text",
    title: "Extract text from PDF",
    shortTitle: "Extract text",
    description: "Copy text out of a typed PDF for notes, quizzes, or Docs.",
    intro:
      "Pull selectable text from typed PDFs (notes, worksheets with a text layer). Scanned image-only files need OCR elsewhere first.",
    howTo: ["Choose a text PDF", "Extract", "Copy text"],
    useCases: ["Quiz building from notes", "Study summaries in Docs"],
    privacyNote: "Extraction never uploads the PDF.",
    metaTitle: "Extract Text from PDF Free | Mentr Tools",
    metaDescription:
      "Extract text from PDF free in your browser. पीडीएफ से टेक्स्ट कॉपी — no upload, no signup.",
    keywords: [
      "extract text from pdf",
      "pdf to text free",
      "copy text from pdf",
      "पीडीएफ से टेक्स्ट",
    ],
    audience: ["pdf", "teachers", "students"],
    icon: "text",
    accent: "ink",
    blogSlug: "extract-text-from-pdf-free",
    faqs: [
      {
        question: "Does it work on scans?",
        answer: "Best on text-based PDFs. Image scans need OCR first.",
      },
    ],
  },
  {
    slug: "pdf-split",
    title: "Split PDF",
    shortTitle: "Split PDF",
    description: "Extract page ranges or split every page into separate PDFs.",
    intro:
      "Split long scans into the pages you need tonight for WhatsApp — one chapter or one worksheet at a time.",
    howTo: ["Choose PDF", "Enter ranges or every page", "Download"],
    useCases: ["Extract one chapter", "Send one page on WhatsApp"],
    privacyNote: "Split runs locally.",
    metaTitle: "Split PDF Online Free | Mentr Tools",
    metaDescription:
      "Split a PDF into pages or ranges free. पीडीएफ स्प्लिट — private, browser-only, no signup.",
    keywords: [
      "split pdf online free",
      "extract pdf pages",
      "split pdf whatsapp",
      "पीडीएफ स्प्लिट",
    ],
    audience: ["pdf"],
    icon: "split",
    accent: "sage",
    blogSlug: "split-pdf-online-free",
    faqs: [
      {
        question: "Can I extract specific pages?",
        answer: "Yes — e.g. 1-3,5.",
      },
    ],
  },

  // ── Classroom printables ───────────────────────────────────────
  {
    slug: "name-tags",
    title: "Name tags & seating labels",
    shortTitle: "Name tags",
    description:
      "Printable name tags and desk labels for tuition batches and camps.",
    intro:
      "Paste the class list, choose tags per A4 page, download PDF, print and cut. Calm first-day batches without hand-lettering cards.",
    howTo: ["Paste names", "Choose tags per page", "Download PDF"],
    useCases: ["New tuition batch day", "Summer camps"],
    privacyNote: "Names stay in your browser tab.",
    metaTitle: "Free Name Tag Generator PDF for Class | Mentr",
    metaDescription:
      "Create printable classroom name tags as PDF. ट्यूशन नेम टैग — free for tutors and camps, no signup.",
    keywords: [
      "name tag generator",
      "classroom name tags",
      "tuition name tags printable",
      "नेम टैग पीडीएफ",
    ],
    audience: ["teachers"],
    icon: "tags",
    accent: "butter",
    blogSlug: "name-tag-generator-classroom",
    faqs: [
      {
        question: "How many tags per page?",
        answer: "4, 6, or 8 on A4.",
      },
    ],
  },
  {
    slug: "word-counter",
    title: "Word counter & reading time",
    shortTitle: "Word counter",
    description:
      "Count words, characters, and estimate reading time for school essays.",
    intro:
      "Paste text for live word, character, sentence, and reading-time stats (~200 wpm). Useful for CBSE essay limits — text stays in your tab.",
    howTo: ["Paste text", "Read live stats"],
    useCases: ["CBSE / board essay word limits", "Tutor feedback drafts"],
    privacyNote: "Text stays in your browser tab.",
    metaTitle: "Free Word Counter for Essays & Reading Time | Mentr",
    metaDescription:
      "Free word counter with reading time for school essays. शब्द गिनती — text stays in your browser, no signup.",
    keywords: [
      "word counter",
      "reading time calculator",
      "essay word counter",
      "CBSE essay word limit",
      "शब्द गिनती",
    ],
    audience: ["students", "teachers"],
    icon: "counter",
    accent: "sage",
    blogSlug: "word-counter-reading-time-students",
    faqs: [
      {
        question: "Is text saved?",
        answer: "No.",
      },
    ],
  },
];

export function getToolBySlug(slug: string): ToolDef | undefined {
  return TOOLS.find((t) => t.slug === slug);
}

export function relatedTools(slug: string, limit = 4): ToolDef[] {
  const current = getToolBySlug(slug);
  const pool = TOOLS.filter((t) => t.slug !== slug && !t.deEmphasized);
  if (!current) return pool.slice(0, limit);
  return pool
    .sort((a, b) => {
      const score = (t: ToolDef) =>
        t.audience.filter((x) => current.audience.includes(x)).length;
      return score(b) - score(a);
    })
    .slice(0, limit);
}

export function toolsByAudience(audience: ToolAudience): ToolDef[] {
  return TOOLS.filter((t) => t.audience.includes(audience));
}

export function popularTools(): ToolDef[] {
  return TOOLS.filter((t) => t.popular && !t.deEmphasized);
}

export function searchTools(query: string): ToolDef[] {
  const q = query.trim().toLowerCase();
  if (!q) return TOOLS;
  return TOOLS.filter((t) => {
    const hay = [
      t.title,
      t.shortTitle,
      t.description,
      t.intro,
      ...t.keywords,
      ...t.useCases,
      ...t.audience,
    ]
      .join(" ")
      .toLowerCase();
    return hay.includes(q) || q.split(/\s+/).every((w) => hay.includes(w));
  });
}

/** Cover image path for OG / Twitter (absolute via absoluteUrl in pages). */
export function toolOgImagePath(slug: string): string {
  return `/images/tools/${slug}.webp`;
}
