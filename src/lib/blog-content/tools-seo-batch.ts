import type { ArticleContent } from "./types";

/** Tool-keyword SEO posts that link into /tools (Sep 2026 growth). */
export const TOOLS_SEO_BATCH: Record<string, ArticleContent> = {
  "merge-pdf-online-free": {
    slug: "merge-pdf-online-free",
    publishedAt: "2026-09-19",
    updatedAt: "2026-09-19",
    readTimeMinutes: 6,
    author: "Mentr Editorial Team",
    intro:
      "Tutors and parents merge PDFs every week — homework packets, notes, worksheets, report cards. Most “free” merge sites upload your files to a server. This guide shows a private, browser-only way to combine PDFs, when merging helps teaching, and how to do it on Mentr Tools without signup.",
    sections: [
      {
        heading: "Why merge PDF for tuition and school",
        blocks: [
          {
            type: "paragraph",
            text: "One file is easier to send on WhatsApp, upload to a school portal, or print for a session. Common cases: combining chapter worksheets into a weekly pack, joining scanned homework photos after converting them to PDF, or packaging revision notes before a test.",
          },
          {
            type: "list",
            items: [
              "Weekly homework pack for Class 3–10",
              "Board revision notes across chapters",
              "Tutor session handouts in one download",
              "Parent sharing report + homework together",
            ],
          },
        ],
      },
      {
        heading: "How to merge PDF online free (private)",
        blocks: [
          {
            type: "list",
            ordered: true,
            items: [
              "Open Mentr Merge PDF — no account needed.",
              "Drop two or more PDF files (order them with the arrows).",
              "Click Merge & download. Processing stays in your browser.",
              "Share the single PDF on WhatsApp or print it.",
            ],
          },
          {
            type: "callout",
            title: "Privacy tip",
            text: "If a tool asks you to upload files to “the cloud” for merging, skip it for student documents. Mentr Tools run merge, split, and compress on your device.",
          },
        ],
      },
      {
        heading: "After you merge — next steps on Mentr",
        blocks: [
          {
            type: "paragraph",
            text: "Tools stay free forever. When you need human help, find a verified tutor on Mentr search, or enroll Class 3–5 kids in free Mentr Learn (CS, AI & Math).",
          },
          {
            type: "list",
            items: [
              "Need doubt help? Browse tutors near you or online.",
              "Teaching Class 3–5? Point parents to free Learn.",
              "Also try: Compress PDF for WhatsApp size limits.",
            ],
          },
        ],
      },
    ],
    faqs: [
      {
        question: "Is merge PDF online free on Mentr?",
        answer:
          "Yes. No signup and no paywall. Files are processed in your browser.",
      },
      {
        question: "Do you store my PDFs?",
        answer:
          "No. Merge runs locally. We do not upload or keep your documents.",
      },
      {
        question: "How many PDFs can I combine?",
        answer:
          "As many as your device can handle. Order them before downloading.",
      },
    ],
    relatedLinks: [
      { label: "Merge PDF tool", href: "/tools/pdf-merge" },
      { label: "Compress PDF tool", href: "/tools/pdf-compress" },
      { label: "All free tools", href: "/tools" },
      { label: "Find a tutor", href: "/search" },
    ],
  },

  "compress-pdf-for-whatsapp": {
    slug: "compress-pdf-for-whatsapp",
    publishedAt: "2026-09-19",
    updatedAt: "2026-09-19",
    readTimeMinutes: 5,
    author: "Mentr Editorial Team",
    intro:
      "WhatsApp rejects large homework PDFs — a daily pain for tutors and parents in India. Compressing a PDF for WhatsApp should not mean uploading exam papers to a random website. Here is how to shrink files in the browser, what “light” vs “strong” compression means, and the free Mentr tool that does it privately.",
    sections: [
      {
        heading: "Why WhatsApp needs a smaller PDF",
        blocks: [
          {
            type: "paragraph",
            text: "Phone scans and multi-page notes balloon past WhatsApp limits. Tutors then split files awkwardly or ask parents to download from Drive. A compressed PDF shares in one tap and still prints clearly for class.",
          },
          {
            type: "list",
            items: [
              "Homework photos converted to PDF",
              "Scanned worksheets from a phone",
              "Long revision packs before boards",
              "Report cards and circulars from school",
            ],
          },
        ],
      },
      {
        heading: "Compress PDF free for WhatsApp (steps)",
        blocks: [
          {
            type: "list",
            ordered: true,
            items: [
              "Open Mentr Compress PDF.",
              "Choose your file. Pick Light first; use Strong if it is still too big.",
              "Download the smaller PDF and send on WhatsApp.",
              "If needed, also try Split PDF to send only the pages that matter.",
            ],
          },
          {
            type: "callout",
            title: "Private by design",
            text: "Compression rebuilds the PDF in your browser. Student work never hits Mentr servers.",
          },
        ],
      },
      {
        heading: "Quality vs size — practical advice",
        blocks: [
          {
            type: "paragraph",
            text: "Light mode cleans metadata and repacks streams. Strong mode scales pages slightly for a bigger size drop — fine for WhatsApp reading; reprint originals if you need full fidelity for exams.",
          },
          {
            type: "paragraph",
            text: "Pair with Images to PDF when parents send camera shots — convert, then compress once.",
          },
        ],
      },
    ],
    faqs: [
      {
        question: "Will compression ruin print quality?",
        answer:
          "Light mode usually looks the same. Strong mode is for sharing; keep the original for high-quality printouts.",
      },
      {
        question: "Is this free in India?",
        answer:
          "Yes. Mentr Tools are free worldwide, including India, with no signup.",
      },
    ],
    relatedLinks: [
      { label: "Compress PDF tool", href: "/tools/pdf-compress" },
      { label: "Images to PDF", href: "/tools/images-to-pdf" },
      { label: "Split PDF", href: "/tools/pdf-split" },
      { label: "Free Learn for Class 3–5", href: "/learn" },
    ],
  },

  "worksheet-generator-india": {
    slug: "worksheet-generator-india",
    publishedAt: "2026-09-19",
    updatedAt: "2026-09-26",
    readTimeMinutes: 6,
    author: "Mentr Editorial Team",
    intro:
      "Indian tutors and parents still need simple printables for the first day of a batch and for weekly planning — not a full Canva account. This guide covers free Mentr classroom helpers (name tags, study timetables, private PDF tools) and how they fit Class 1–8 homework routines.",
    sections: [
      {
        heading: "What classroom printables should do",
        blocks: [
          {
            type: "paragraph",
            text: "For first-day batches and weekly planning, you want A4 PDFs you can print at a local shop or at home — without login walls. Name tags calm a new group; a wall timetable keeps revision visible; PDF merge/compress keep WhatsApp homework packs tidy.",
          },
          {
            type: "list",
            items: [
              "Desk name tags for new tuition batches",
              "Weekly study timetable for board revision",
              "Merged homework packs for WhatsApp",
              "Compressed PDFs that fit school portals",
            ],
          },
        ],
      },
      {
        heading: "Make free classroom PDFs on Mentr",
        blocks: [
          {
            type: "list",
            ordered: true,
            items: [
              "Open Mentr Tools (no signup).",
              "Use Name tags for the class list, or Study timetable for the week.",
              "For photo homework, convert Images to PDF, then Merge or Compress as needed.",
              "Download and print or share on WhatsApp.",
            ],
          },
          {
            type: "callout",
            title: "Classroom extras",
            text: "Need desk labels? Use the free name-tag printable. For weekly planning, try the study timetable PDF.",
          },
        ],
      },
      {
        heading: "Pair printables with tutoring",
        blocks: [
          {
            type: "paragraph",
            text: "Printables help practice; progress still needs feedback. Parents who want a verified home or online tutor can search free on Mentr. Class 3–5 families can also enroll in free Mentr Learn for CS and math-for-coding.",
          },
        ],
      },
    ],
    faqs: [
      {
        question: "Are Mentr classroom tools free in India?",
        answer:
          "Yes. Download printable PDFs with no signup on Mentr Tools.",
      },
      {
        question: "Is there still a lined worksheet generator?",
        answer:
          "That tool is retired while we rebuild it. Use name tags, study timetable, and PDF helpers on /tools in the meantime.",
      },
    ],
    relatedLinks: [
      { label: "All free tools", href: "/tools" },
      { label: "Name tags printable", href: "/tools/name-tags" },
      { label: "Study timetable PDF", href: "/tools/study-timetable" },
      { label: "Search tutors", href: "/search" },
    ],
  },

  "study-timetable-pdf-students": {
    slug: "study-timetable-pdf-students",
    publishedAt: "2026-09-19",
    updatedAt: "2026-09-19",
    readTimeMinutes: 6,
    author: "Mentr Editorial Team",
    intro:
      "Students ask for a weekly study plan they can stick on the wall. A study timetable PDF beats a messy notebook page — especially before boards or competitive exams. Learn how to build a simple Mon–Sun plan, export it as PDF, and keep it realistic.",
    sections: [
      {
        heading: "Build a weekly study timetable that sticks",
        blocks: [
          {
            type: "paragraph",
            text: "Overpacked schedules fail by Wednesday. Start with school hours, then add 2–3 focus blocks: morning revision, afternoon homework, evening weak-chapter work. Leave buffer for rest and sports.",
          },
          {
            type: "list",
            items: [
              "Put hardest subjects when energy is highest",
              "Keep one light evening for hobbies",
              "Mark test dates in the title or a free cell",
              "Review the plan every Sunday with a parent or tutor",
            ],
          },
        ],
      },
      {
        heading: "Download a free study timetable PDF",
        blocks: [
          {
            type: "list",
            ordered: true,
            items: [
              "Open Mentr Study Timetable.",
              "Name the week (e.g. “Board revision — Week 3”).",
              "Fill Morning / Afternoon / Evening cells for each day.",
              "Download the landscape A4 PDF and print it.",
            ],
          },
          {
            type: "callout",
            title: "Word count for essays",
            text: "Writing homework? Use the free word counter & reading-time tool before you submit.",
          },
        ],
      },
      {
        heading: "When a timetable is not enough",
        blocks: [
          {
            type: "paragraph",
            text: "If a subject stays stuck for two weeks, bring in a tutor. Search verified mentors on Mentr for free. Younger kids (Class 3–5) can combine a simple timetable with free Mentr Learn modules.",
          },
        ],
      },
    ],
    faqs: [
      {
        question: "Is the timetable tool free?",
        answer:
          "Yes. Create and download a weekly study plan PDF with no login.",
      },
      {
        question: "Can tutors fill this with students?",
        answer:
          "Yes — build it in a session, download, and share on WhatsApp.",
      },
    ],
    relatedLinks: [
      { label: "Study timetable tool", href: "/tools/study-timetable" },
      { label: "Word counter", href: "/tools/word-counter" },
      { label: "CBSE Class 10 study plan", href: "/blog/cbse-class-10-study-plan" },
      { label: "Find a tutor", href: "/search" },
    ],
  },

  "images-to-pdf-homework": {
    slug: "images-to-pdf-homework",
    publishedAt: "2026-09-19",
    updatedAt: "2026-09-19",
    readTimeMinutes: 5,
    author: "Mentr Editorial Team",
    intro:
      "Parents photograph homework page by page — then tutors ask for “one PDF please.” Converting JPG or PNG images to PDF should be free, private, and reorderable. This guide covers the homework photo workflow and the Mentr Images → PDF tool.",
    sections: [
      {
        heading: "Homework photos → one PDF",
        blocks: [
          {
            type: "paragraph",
            text: "Camera rolls fill with blurry last pages and out-of-order shots. Convert images to PDF, reorder, then compress if WhatsApp complains. Keep originals until the tutor confirms receipt.",
          },
          {
            type: "list",
            ordered: true,
            items: [
              "Open Images to PDF on Mentr Tools.",
              "Add JPG/PNG/WebP pages and reorder with arrows.",
              "Create PDF, then optionally Compress PDF for WhatsApp.",
              "Send one file instead of a gallery dump.",
            ],
          },
        ],
      },
      {
        heading: "Tips for clearer scans",
        blocks: [
          {
            type: "list",
            items: [
              "Shoot in good light; avoid shadows over the page",
              "Hold the phone parallel to the paper",
              "One page per photo when possible",
              "Use Strong compress only after you check readability",
            ],
          },
          {
            type: "callout",
            title: "Need teaching help?",
            text: "After the PDF is sent, find a verified tutor on Mentr if doubts keep piling up — free to search and connect.",
          },
        ],
      },
    ],
    faqs: [
      {
        question: "Which image formats work?",
        answer: "JPG, JPEG, PNG, and WebP.",
      },
      {
        question: "Do files upload to Mentr?",
        answer:
          "No. Conversion runs in your browser. Nothing is stored on our servers.",
      },
    ],
    relatedLinks: [
      { label: "Images to PDF tool", href: "/tools/images-to-pdf" },
      { label: "Compress PDF", href: "/tools/pdf-compress" },
      { label: "Merge PDF", href: "/tools/pdf-merge" },
      { label: "All tools", href: "/tools" },
    ],
  },

  "split-pdf-online-free": {
    slug: "split-pdf-online-free",
    publishedAt: "2026-09-19",
    updatedAt: "2026-09-19",
    readTimeMinutes: 6,
    author: "Mentr Editorial Team",
    intro:
      "Long PDFs are hard to share on WhatsApp and harder for kids to focus on. Splitting a PDF into page ranges — or one file per page — helps tutors send only tonight’s worksheet and helps parents avoid downloading a 40-page scan. This guide shows a private, free way to split PDFs in the browser with Mentr Tools.",
    sections: [
      {
        heading: "When splitting a PDF helps tuition",
        blocks: [
          {
            type: "paragraph",
            text: "Teachers often receive a full chapter scan when they only need pages 4–7. Parents get a school circular glued to last month’s homework. Splitting keeps the conversation clear: one page, one ask.",
          },
          {
            type: "list",
            items: [
              "Extract one chapter from a book scan",
              "Send a single worksheet page on WhatsApp",
              "Separate answer keys from question papers",
              "Share only the pages a child must revise tonight",
            ],
          },
        ],
      },
      {
        heading: "How to split PDF online free (private)",
        blocks: [
          {
            type: "list",
            ordered: true,
            items: [
              "Open Mentr Split PDF — no account needed.",
              "Upload the PDF and confirm the page count.",
              "Enter ranges like 1-3,5 or choose every page.",
              "Download one PDF or a ZIP of pages — processing stays on your device.",
            ],
          },
          {
            type: "callout",
            title: "After you split",
            text: "Need the pieces back together later? Use Merge PDF. Too large for WhatsApp? Compress PDF next.",
          },
        ],
      },
      {
        heading: "Redirect the next step to real help",
        blocks: [
          {
            type: "paragraph",
            text: "File tools solve logistics. Learning still needs a person. When doubts pile up, search verified tutors on Mentr or enroll Class 3–5 kids in free Mentr Learn — soft CTAs, never a gate on the splitter.",
          },
        ],
      },
    ],
    faqs: [
      {
        question: "Is split PDF free on Mentr?",
        answer: "Yes. No signup and no upload to our servers.",
      },
      {
        question: "Can I extract non-contiguous pages?",
        answer: "Yes. Use commas and ranges, e.g. 1-2,5,8-9.",
      },
    ],
    relatedLinks: [
      { label: "Split PDF tool", href: "/tools/pdf-split" },
      { label: "Merge PDF", href: "/tools/pdf-merge" },
      { label: "Compress PDF", href: "/tools/pdf-compress" },
      { label: "Find a tutor", href: "/search" },
    ],
  },

  "organize-pdf-pages-free": {
    slug: "organize-pdf-pages-free",
    publishedAt: "2026-09-19",
    updatedAt: "2026-09-19",
    readTimeMinutes: 5,
    author: "Mentr Editorial Team",
    intro:
      "Phone scans arrive upside-down in order: page 3 first, blank pages in the middle, answer key before the questions. Organizing PDF pages — reorder and delete — is a weekly chore for tutors. Here is how to clean a PDF privately in the browser.",
    sections: [
      {
        heading: "Why page order matters",
        blocks: [
          {
            type: "paragraph",
            text: "Students follow worksheets in sequence. Parents print packs at a local shop. Out-of-order pages waste class time and paper. A one-minute reorder before you send saves a session of confusion.",
          },
          {
            type: "list",
            ordered: true,
            items: [
              "Open Organize PDF on Mentr Tools.",
              "Move pages up or down; delete blanks.",
              "Download the clean PDF.",
              "Merge or compress if you still need a smaller shareable file.",
            ],
          },
        ],
      },
      {
        heading: "Privacy for school documents",
        blocks: [
          {
            type: "callout",
            title: "No cloud required",
            text: "Page edits run locally. Report cards and answer keys never hit Mentr servers.",
          },
          {
            type: "paragraph",
            text: "When the file is ready and the child still needs teaching help, find a verified tutor on Mentr — free to search.",
          },
        ],
      },
    ],
    faqs: [
      {
        question: "Can I delete pages permanently from the download?",
        answer:
          "Yes. Deleted pages are omitted from the new PDF you download. Your original file on disk is unchanged.",
      },
    ],
    relatedLinks: [
      { label: "Organize PDF tool", href: "/tools/pdf-organize" },
      { label: "Split PDF", href: "/tools/pdf-split" },
      { label: "Images to PDF", href: "/tools/images-to-pdf" },
      { label: "All tools", href: "/tools" },
    ],
  },

  "extract-text-from-pdf-free": {
    slug: "extract-text-from-pdf-free",
    publishedAt: "2026-09-19",
    updatedAt: "2026-09-19",
    readTimeMinutes: 6,
    author: "Mentr Editorial Team",
    intro:
      "Tutors rebuild quizzes from typed worksheets. Students paste notes into Docs. Extracting text from a PDF should not require uploading the file to a third-party OCR farm when the PDF already contains selectable text. This guide covers Mentr’s browser extract tool and when you still need OCR.",
    sections: [
      {
        heading: "Text-based PDF vs scanned photos",
        blocks: [
          {
            type: "paragraph",
            text: "If you can select and copy text inside a PDF reader, extraction will work well. If every page is a photograph of paper, you need OCR first — this tool is not a scanner replacement.",
          },
          {
            type: "list",
            items: [
              "Build quizzes from typed worksheets",
              "Paste lesson notes into a study doc",
              "Reuse paragraphs for homework feedback",
              "Search long notes after copying",
            ],
          },
        ],
      },
      {
        heading: "How to extract text free",
        blocks: [
          {
            type: "list",
            ordered: true,
            items: [
              "Open Extract text from PDF on Mentr Tools.",
              "Choose a typed PDF.",
              "Copy all text when extraction finishes.",
              "Paste into Docs, Notion, or your quiz builder.",
            ],
          },
          {
            type: "callout",
            title: "Next step on Mentr",
            text: "Need someone to explain the chapter you just extracted? Search verified tutors free — or start Mentr Learn for Class 3–5.",
          },
        ],
      },
    ],
    faqs: [
      {
        question: "Does extract text upload my PDF?",
        answer: "No. Extraction runs in your browser only.",
      },
      {
        question: "Why is my scan empty?",
        answer:
          "Image-only scans have no text layer. Use a dedicated OCR app, then come back if you need other PDF tools.",
      },
    ],
    relatedLinks: [
      { label: "Extract text tool", href: "/tools/pdf-extract-text" },
      { label: "Word counter", href: "/tools/word-counter" },
      { label: "Find a tutor", href: "/search" },
      { label: "All tools", href: "/tools" },
    ],
  },

  "name-tag-generator-classroom": {
    slug: "name-tag-generator-classroom",
    publishedAt: "2026-09-19",
    updatedAt: "2026-09-19",
    readTimeMinutes: 5,
    author: "Mentr Editorial Team",
    intro:
      "First day of a tuition batch, summer camp, or workshop goes smoother when every desk has a name. A free name-tag generator that exports printable A4 sheets saves tutors from hand-lettering twenty cards. Here is how to make desk labels with Mentr Tools.",
    sections: [
      {
        heading: "Classroom and camp use cases",
        blocks: [
          {
            type: "list",
            items: [
              "New tuition batch introductions",
              "Summer camp desk labels",
              "Workshop seating",
              "Parent-teacher meeting name cards",
            ],
          },
          {
            type: "list",
            ordered: true,
            items: [
              "Open Name tags on Mentr Tools.",
              "Paste names, one per line.",
              "Choose 4, 6, or 8 tags per page.",
              "Download, print, and cut — laminate for a full term if you like.",
            ],
          },
        ],
      },
      {
        heading: "Pair printables with teaching",
        blocks: [
          {
            type: "paragraph",
            text: "Labels help the room; progress still needs feedback. List free as a tutor on Mentr, or point parents to verified search and free Learn for Class 3–5.",
          },
        ],
      },
    ],
    faqs: [
      {
        question: "Is the name tag generator free?",
        answer: "Yes. No signup required.",
      },
      {
        question: "Are names stored?",
        answer:
          "Names stay in your browser tab until you download the PDF. We do not save class lists.",
      },
    ],
    relatedLinks: [
      { label: "Name tags tool", href: "/tools/name-tags" },
      { label: "Study timetable", href: "/tools/study-timetable" },
      { label: "Create tutor profile", href: "/faculty/signup" },
      { label: "All tools", href: "/tools" },
    ],
  },

  "word-counter-reading-time-students": {
    slug: "word-counter-reading-time-students",
    publishedAt: "2026-09-19",
    updatedAt: "2026-09-19",
    readTimeMinutes: 5,
    author: "Mentr Editorial Team",
    intro:
      "School essays have word limits. Blog drafts need a reading-time gut check. A free word counter with character count and ≈200 wpm reading time helps students and tutors without pasting homework into a random AI box. Mentr’s counter stays in your tab.",
    sections: [
      {
        heading: "What the counter shows",
        blocks: [
          {
            type: "list",
            items: [
              "Words and characters (with and without spaces)",
              "Sentence count for structure checks",
              "Reading time at about 200 words per minute",
              "Nothing saved — clear the tab when you are done",
            ],
          },
          {
            type: "paragraph",
            text: "Paste your draft, check the limit, then revise. For weekly planning around writing homework, pair this with the study timetable PDF tool.",
          },
        ],
      },
      {
        heading: "When counting is not enough",
        blocks: [
          {
            type: "callout",
            title: "Get feedback from a tutor",
            text: "Word count does not fix weak arguments. Search a verified English or subject tutor on Mentr when you need line-by-line help.",
          },
        ],
      },
    ],
    faqs: [
      {
        question: "Is the word counter free?",
        answer: "Yes. No login and no text storage.",
      },
      {
        question: "How is reading time calculated?",
        answer:
          "We use about 200 words per minute — a common silent-reading estimate for students.",
      },
    ],
    relatedLinks: [
      { label: "Word counter tool", href: "/tools/word-counter" },
      { label: "Study timetable", href: "/tools/study-timetable" },
      { label: "Find a tutor", href: "/search" },
      { label: "All tools", href: "/tools" },
    ],
  },
};
