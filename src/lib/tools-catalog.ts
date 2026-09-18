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
  | "worksheet"
  | "tags"
  | "counter"
  | "timetable"
  | "paper"
  | "key"
  | "lesson"
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
    "Create worksheets, question papers, study plans and classroom PDFs — free, private and without signup. Built for teachers, tutors, parents and students.",
  keywords: [
    "free teacher tools",
    "question paper generator",
    "worksheet generator",
    "cgpa calculator",
    "study timetable",
    "free pdf tools",
    "Mentr tools",
  ],
} as const;

const privateBrowser =
  "Runs in your browser. We do not upload your inputs to Mentr servers for this tool.";

export const TOOLS: ToolDef[] = [
  // ── Teacher / tutor (Phase 1+) ─────────────────────────────────
  {
    slug: "question-paper-generator",
    title: "Question Paper Generator",
    shortTitle: "Question paper",
    description:
      "Build printable sample question papers by class, subject, marks and types.",
    intro:
      "Teachers and tutors often need a quick practice paper for class tests. This generator creates a printable sample paper from your class, subject, topic and question types. Items are algorithmic practice samples — not official board questions.",
    howTo: [
      "Enter class, subject, board label, topic and marks.",
      "Choose question types and count.",
      "Generate a preview, then download PDF.",
      "Open Answer Key Generator to export keys from the same draft.",
    ],
    useCases: [
      "Weekly class tests",
      "Tuition batch practice papers",
      "Holiday homework packs",
      "Revision before unit tests",
    ],
    privacyNote: privateBrowser,
    metaTitle: "Free Question Paper Generator for Teachers | Mentr",
    metaDescription:
      "Create printable sample question papers for teachers and tutors. Choose class, subject, marks, difficulty and question types. Free, no signup.",
    keywords: [
      "question paper generator",
      "free question paper generator",
      "CBSE practice paper generator",
      "teacher test generator",
    ],
    audience: ["teachers"],
    icon: "paper",
    accent: "coral",
    popular: true,
    faqs: [
      {
        question: "Are these official CBSE questions?",
        answer:
          "No. Board is a label only. Questions are algorithmic practice samples for classroom use — verify against your textbook.",
      },
      {
        question: "Can I generate an answer key?",
        answer:
          "Yes. After generating a paper, open Answer Key Generator — answers load from your draft when available.",
      },
    ],
  },
  {
    slug: "worksheet-generator",
    title: "Worksheet Generator",
    shortTitle: "Worksheets",
    description:
      "Generate printable practice worksheets with MCQ, fill-ups, short and long answers.",
    intro:
      "Build a class worksheet with student name/date lines, numbered questions and downloadable PDF. Choose question types and regenerate for a new set. Sample items are practice-oriented, not board-official.",
    howTo: [
      "Set class, subject, topic and difficulty.",
      "Pick question types and count.",
      "Generate, preview, then download or print.",
      "Regenerate for a fresh set with the same settings.",
    ],
    useCases: [
      "Class warm-ups",
      "Homework sheets",
      "Remedial practice",
      "Holiday packs",
    ],
    privacyNote: privateBrowser,
    metaTitle: "Free Worksheet Generator for Teachers | Mentr",
    metaDescription:
      "Create printable worksheets with multiple choice, fill in the blanks, short and long answers. Free for tutors and teachers — no signup.",
    keywords: [
      "worksheet generator",
      "free worksheet generator",
      "teacher worksheet india",
      "printable worksheet PDF",
    ],
    audience: ["teachers", "students"],
    icon: "worksheet",
    accent: "coral",
    popular: true,
    blogSlug: "worksheet-generator-india",
    faqs: [
      {
        question: "Can I print the worksheet?",
        answer: "Yes. Use Print or Download PDF for A4 printing.",
      },
      {
        question: "Is lined paper still available?",
        answer:
          "This upgraded tool focuses on question worksheets. For blank lined paper, use a simple print from your word processor or request it via feedback.",
      },
    ],
  },
  {
    slug: "answer-key-generator",
    title: "Answer Key Generator",
    shortTitle: "Answer key",
    description:
      "Build a printable answer key from a Mentr paper draft or enter answers manually.",
    intro:
      "Export keys for your sample paper or paste answers line by line. Add marks and short marking notes, then download a clean PDF for marking.",
    howTo: [
      "Generate a question paper first (optional) so answers preload.",
      "Or paste answers manually, one per line.",
      "Download the answer key PDF.",
    ],
    useCases: [
      "Marking class tests",
      "Sharing keys after practice",
      "Tutor self-check sheets",
    ],
    privacyNote: privateBrowser,
    metaTitle: "Free Answer Key Generator | Mentr Tools",
    metaDescription:
      "Create printable answer keys for practice papers. Load from a Mentr question paper or enter answers manually. Free, no signup.",
    keywords: ["answer key generator", "test answer key PDF", "marking scheme PDF"],
    audience: ["teachers"],
    icon: "key",
    accent: "sage",
    faqs: [
      {
        question: "Where do preloaded answers come from?",
        answer:
          "From the last question paper you generated in this browser (session storage). Nothing is sent to Mentr servers.",
      },
    ],
  },
  {
    slug: "lesson-plan-generator",
    title: "Lesson Plan Generator",
    shortTitle: "Lesson plan",
    description:
      "Structure a class lesson: objectives, activities, assessment and homework.",
    intro:
      "Fill class, topic, duration and objectives to generate a clear lesson plan outline you can print or download as PDF for your session notes.",
    howTo: [
      "Enter class, subject, topic and duration.",
      "Add learning objectives and teaching method.",
      "Generate preview, then download PDF.",
    ],
    useCases: [
      "Daily tuition planning",
      "School observation lessons",
      "Substitute teacher notes",
    ],
    privacyNote: privateBrowser,
    metaTitle: "Free Lesson Plan Generator for Teachers | Mentr",
    metaDescription:
      "Create printable lesson plans with objectives, teaching activities, assessment and homework. Free for tutors — no signup.",
    keywords: ["lesson plan generator", "free lesson plan template", "tutor lesson plan"],
    audience: ["teachers"],
    icon: "lesson",
    accent: "butter",
    faqs: [
      {
        question: "Can I edit after download?",
        answer:
          "The PDF is a snapshot. Change inputs and download again for a new version.",
      },
    ],
  },
  {
    slug: "cgpa-calculator",
    title: "CGPA Calculator",
    shortTitle: "CGPA",
    description:
      "Convert CGPA to an approximate percentage with clear institution caveats.",
    intro:
      "Enter your CGPA and choose a conversion method. Formulas differ by institution — results are informational only. Always confirm with your school or university.",
    howTo: [
      "Enter CGPA (0–10 scale).",
      "Choose ×9.5, ×10, or a custom multiplier.",
      "Read the approximate percentage and the caveat.",
    ],
    useCases: [
      "Application form estimates",
      "Parent discussions",
      "Comparing reported scales",
    ],
    privacyNote: "Calculation runs entirely in your browser.",
    metaTitle: "CGPA to Percentage Calculator | Mentr Tools",
    metaDescription:
      "Convert CGPA to percentage with selectable formulas. Clear note that conversion depends on your institution. Free, no signup.",
    keywords: [
      "cgpa calculator",
      "cgpa to percentage",
      "cgpa to percentage calculator",
    ],
    audience: ["students"],
    icon: "cgpa",
    accent: "lavender",
    popular: true,
    faqs: [
      {
        question: "Is ×9.5 official for everyone?",
        answer:
          "No. Some boards and universities publish different rules. Use custom multiplier when your institution specifies one.",
      },
    ],
  },
  {
    slug: "study-timetable",
    title: "Study Timetable Generator",
    shortTitle: "Timetable",
    description:
      "Build a weekly study plan and download it as a printable PDF.",
    intro:
      "Fill Morning / Afternoon / Evening cells for Mon–Sun, then download a landscape A4 PDF for the wall or WhatsApp.",
    howTo: [
      "Name the week.",
      "Fill subject slots.",
      "Download the timetable PDF.",
    ],
    useCases: [
      "Board revision weeks",
      "Tutor + student shared plans",
      "Holiday structure",
    ],
    privacyNote: privateBrowser,
    metaTitle: "Free Study Timetable PDF Generator | Mentr Tools",
    metaDescription:
      "Make a free weekly study timetable PDF for students. Plan subjects and download for printing.",
    keywords: ["study timetable pdf", "weekly study plan", "timetable generator"],
    audience: ["students", "teachers"],
    icon: "timetable",
    accent: "lavender",
    popular: true,
    blogSlug: "study-timetable-pdf-students",
    faqs: [
      {
        question: "Can tutors fill this with students?",
        answer: "Yes — build it in a session and share the PDF.",
      },
    ],
  },

  // ── PDF tools ──────────────────────────────────────────────────
  {
    slug: "pdf-merge",
    title: "Merge PDF",
    shortTitle: "Merge PDF",
    description: "Combine multiple PDF files into one — private, in your browser.",
    intro:
      "Merge homework packs, notes and worksheets into one file for WhatsApp or printing. Processing stays on your device.",
    howTo: [
      "Drop two or more PDFs.",
      "Reorder with arrows.",
      "Merge & download.",
    ],
    useCases: ["Weekly homework packs", "Revision booklets", "Session handouts"],
    privacyNote:
      "Merging runs in your browser. Files are not uploaded to Mentr servers.",
    metaTitle: "Merge PDF Online Free | Mentr Tools",
    metaDescription:
      "Merge PDF files free online in your browser. No signup. Files stay on your device.",
    keywords: ["merge pdf online free", "combine pdf", "merge pdf for teachers"],
    audience: ["pdf", "teachers", "students"],
    icon: "merge",
    accent: "coral",
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
    description: "Shrink PDF size for WhatsApp, email, or school portals.",
    intro:
      "Compress homework PDFs in the browser so WhatsApp and portals accept them — without uploading exam papers to a random site.",
    howTo: [
      "Choose a PDF.",
      "Pick Light or Strong.",
      "Download and check readability.",
    ],
    useCases: ["WhatsApp sharing", "Portal uploads", "Email attachments"],
    privacyNote:
      "Compression runs in your browser. Files are not uploaded to Mentr servers.",
    metaTitle: "Compress PDF Online Free for WhatsApp | Mentr Tools",
    metaDescription:
      "Compress PDF free for WhatsApp and email in your browser — no upload, no signup.",
    keywords: ["compress pdf for whatsapp", "reduce pdf size online free"],
    audience: ["pdf", "teachers", "students"],
    icon: "compress",
    accent: "butter",
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
      "Remove image backgrounds automatically and download a clean transparent PNG — 100% free forever, no watermark, no signup.",
    intro:
      "Upload a photo, remove the background on your device, preview the transparent result, and download a PNG. Free forever with no watermark and no mandatory signup. Processing is private: your image never leaves this browser. Built as a dedicated utility while remove.bg’s standalone site moves into Canva (shutdown announced for 1 December 2026).",
    howTo: [
      "Upload a JPG, PNG, or WEBP image.",
      "Wait while the model prepares (first visit downloads ~94 MB, then cached).",
      "Compare original vs transparent result.",
      "Download the PNG, or start over with another image.",
    ],
    useCases: [
      "Product photos for worksheets",
      "Profile / ID-style cutouts",
      "Classroom slides and posters",
      "Homework images without cluttered backgrounds",
    ],
    privacyNote:
      "Private processing on your device. The model downloads from Hugging Face into your browser cache — Mentr does not upload your image.",
    metaTitle:
      "Free Background Remover — Remove Image Backgrounds | Mentr",
    metaDescription:
      "Remove image backgrounds for free and download transparent PNGs. No signup or watermark. Runs privately in your browser.",
    keywords: [
      "free background remover",
      "background remover",
      "remove background online free",
      "transparent PNG",
      "no watermark background remover",
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
          "The background-removal model (~94 MB) downloads once and is cached locally. Later runs skip that download.",
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
    description: "Turn JPG or PNG homework photos into a single PDF.",
    intro:
      "Convert camera shots to one reorderable PDF, then compress if WhatsApp complains.",
    howTo: ["Add images", "Reorder", "Create PDF"],
    useCases: ["Homework photos", "Whiteboard shots"],
    privacyNote:
      "Conversion runs in your browser. Photos are not uploaded to Mentr.",
    metaTitle: "Images to PDF Free | Mentr Tools",
    metaDescription:
      "Convert images to PDF free in your browser. Private, no signup.",
    keywords: ["images to pdf", "jpg to pdf", "homework photos pdf"],
    audience: ["pdf", "teachers", "students"],
    icon: "image",
    accent: "lavender",
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
    description: "Reorder or delete pages, then download a clean PDF.",
    intro:
      "Fix out-of-order scans and remove blank pages before sharing with parents.",
    howTo: ["Upload PDF", "Reorder or delete", "Download"],
    useCases: ["Phone scans", "Clean worksheets"],
    privacyNote: "Page edits stay local. We do not store your PDF.",
    metaTitle: "Reorder & Delete PDF Pages Free | Mentr Tools",
    metaDescription:
      "Reorder or delete PDF pages free online in your browser — no signup.",
    keywords: ["reorder pdf pages", "delete pdf pages", "organize pdf"],
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
    description: "Copy text out of a PDF for notes, quizzes, or editing.",
    intro:
      "Pull selectable text from typed PDFs. Scanned image-only files need OCR elsewhere.",
    howTo: ["Choose a text PDF", "Extract", "Copy text"],
    useCases: ["Quiz building", "Study notes"],
    privacyNote: "Extraction never uploads the PDF.",
    metaTitle: "Extract Text from PDF Free | Mentr Tools",
    metaDescription:
      "Extract text from PDF free in your browser. No upload, no signup.",
    keywords: ["extract text from pdf", "pdf to text free"],
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
      "Split long scans into the pages you need tonight. Kept for compatibility — not featured as a primary tool.",
    howTo: ["Choose PDF", "Enter ranges or every page", "Download"],
    useCases: ["Extract chapters", "WhatsApp one page"],
    privacyNote: "Split runs locally.",
    metaTitle: "Split PDF Online Free | Mentr Tools",
    metaDescription:
      "Split a PDF into pages or ranges. Free, private, browser-only.",
    keywords: ["split pdf online free", "extract pdf pages"],
    audience: ["pdf"],
    icon: "split",
    accent: "sage",
    deEmphasized: true,
    blogSlug: "split-pdf-online-free",
    faqs: [
      {
        question: "Can I extract specific pages?",
        answer: "Yes — e.g. 1-3,5.",
      },
    ],
  },

  // ── Kept, de-emphasized ────────────────────────────────────────
  {
    slug: "name-tags",
    title: "Name tags & seating labels",
    shortTitle: "Name tags",
    description: "Printable name tags and desk labels for classrooms and camps.",
    intro:
      "Simple desk labels. For a full classroom layout, a seating chart tool is planned next.",
    howTo: ["Paste names", "Choose tags per page", "Download PDF"],
    useCases: ["New batch day", "Camps"],
    privacyNote: "Names stay in your browser tab.",
    metaTitle: "Free Name Tag Generator PDF | Mentr Tools",
    metaDescription:
      "Create printable name tags as PDF. Free for tutors and camps.",
    keywords: ["name tag generator", "classroom name tags"],
    audience: ["teachers"],
    icon: "tags",
    accent: "butter",
    deEmphasized: true,
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
      "Count words, characters, and estimate reading time for essays.",
    intro:
      "Paste text for live word and reading-time stats. Kept available; not featured as a primary education tool.",
    howTo: ["Paste text", "Read live stats"],
    useCases: ["Essay limits", "Blog drafts"],
    privacyNote: "Text stays in your browser tab.",
    metaTitle: "Free Word Counter & Reading Time | Mentr Tools",
    metaDescription:
      "Free word counter with reading time. Text stays in your browser.",
    keywords: ["word counter", "reading time calculator"],
    audience: ["students", "teachers"],
    icon: "counter",
    accent: "sage",
    deEmphasized: true,
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
