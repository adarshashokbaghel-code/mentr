import type { ToolDef } from "@/lib/tools-catalog";

export type ToolFaq = { question: string; answer: string };

/** Extra AdSense / SEO body copy per tool (genuine, non-thin). */
export type ToolPageCopy = {
  /** Additional H2 sections with paragraphs */
  sections: { heading: string; paragraphs: string[] }[];
  tips: string[];
  extraFaqs: ToolFaq[];
};

const COMMON_FAQS: ToolFaq[] = [
  {
    question: "Do I need a Mentr account to use this tool?",
    answer:
      "No. Every Mentr Tool works without login. Accounts are optional if you later want to find a tutor, enroll in Learn, or list as faculty.",
  },
  {
    question: "Are Mentr Tools really free?",
    answer:
      "Yes. Tools are free forever with no coins, premium packs, or upload limits set by us. Your device memory is the only practical limit.",
  },
  {
    question: "Does Mentr store my files?",
    answer:
      "No. Processing runs in your browser. We do not upload homework PDFs, photos, or essay text to Mentr servers for these tools.",
  },
  {
    question: "Will this page show ads?",
    answer:
      "Public tool and guide pages may show Google AdSense ads. Ads do not change how the tool works or which tutors appear in search.",
  },
];

const COPY: Record<string, ToolPageCopy> = {
  "pdf-merge": {
    sections: [
      {
        heading: "Why tutors and parents merge PDFs every week",
        paragraphs: [
          "A typical tuition week produces scattered files: a worksheet PDF from the tutor, a notes export from school, and phone scans of homework. Sending four attachments on WhatsApp creates confusion — parents miss a page, students open the wrong file in class, and print shops charge for sorting. One merged PDF is a single source of truth for the session.",
          "Merging also helps before board exams. Revision packs across chapters become one printable booklet. Tutors who teach multiple siblings can keep each child’s pack separate by merging only that week’s materials, then compressing if WhatsApp rejects the size.",
        ],
      },
      {
        heading: "Private merge vs uploading to random sites",
        paragraphs: [
          "Many “free merge PDF” sites ask you to upload documents to a remote server. For school work, report cards, and answer keys, that is an unnecessary risk. Mentr Merge PDF uses browser-side libraries so bytes never leave your device. You still get a downloadable combined file — without creating an account.",
          "If the merged file is still large, open Compress PDF next. If you only needed a few pages from a big scan, use Split PDF first, then merge the pieces you care about.",
        ],
      },
    ],
    tips: [
      "Order files before merging — first file becomes the first pages.",
      "Name the download something clear (e.g. Class7-Maths-Week12.pdf).",
      "Compress after merge if WhatsApp or a portal rejects the size.",
      "Keep originals until the parent or student confirms receipt.",
    ],
    extraFaqs: [
      {
        question: "What order do pages appear in after merge?",
        answer:
          "Pages follow the order of files in the list, top to bottom. Use the arrows to reorder before you click Merge & download.",
      },
      {
        question: "Can I merge password-protected PDFs?",
        answer:
          "Encrypted PDFs may fail to load. Remove the password in a trusted PDF reader first, then merge — still on your device.",
      },
    ],
  },
  "pdf-split": {
    sections: [
      {
        heading: "Send only the pages that matter tonight",
        paragraphs: [
          "Long textbook scans and full question banks overwhelm students. Splitting lets you extract pages 1–3 for tonight’s homework or export every page as its own file for WhatsApp. Parents appreciate one clear attachment instead of “see pages 12–15 of the big PDF.”",
          "Tutors also split answer keys from question papers so students cannot peek during practice — then merge keys later for marking.",
        ],
      },
      {
        heading: "Ranges vs every page",
        paragraphs: [
          "Use ranges (for example 1-3,5,8-9) when you know the pages. Use every-page mode when each sheet should travel alone — useful for classroom distribution or one problem per chat message.",
        ],
      },
    ],
    tips: [
      "Check the page count before entering ranges.",
      "Multiple parts download as a ZIP when you split into several files.",
      "Re-merge later if you need the pack together again.",
    ],
    extraFaqs: [
      {
        question: "What does a range like 1-3,5 mean?",
        answer:
          "It means pages 1, 2, 3 and page 5 (1-based numbering). Invalid pages are skipped.",
      },
    ],
  },
  "pdf-compress": {
    sections: [
      {
        heading: "WhatsApp size limits and school portals",
        paragraphs: [
          "Indian tutors live on WhatsApp. Large phone scans and image-heavy notes often fail to send. Compressing a PDF for WhatsApp is one of the highest-intent jobs on this hub — and it should not require uploading exam papers to an unknown cloud.",
          "Light mode repacks the file. Strong mode scales pages slightly for a bigger size drop. Always open the result once before sharing with parents.",
        ],
      },
      {
        heading: "Quality vs size — a practical rule",
        paragraphs: [
          "Keep originals for printing answer scripts. Use Strong only for chat sharing. If readability suffers, split into smaller ranges instead of crushing one giant file.",
        ],
      },
    ],
    tips: [
      "Try Light first; escalate to Strong only if needed.",
      "Convert camera photos with Images to PDF, then compress once.",
      "Avoid recompressing the same file many times.",
    ],
    extraFaqs: [
      {
        question: "Will Strong mode ruin print quality?",
        answer:
          "It can look softer when printed large. Use Strong for WhatsApp; keep the original for high-quality printouts.",
      },
    ],
  },
  "images-to-pdf": {
    sections: [
      {
        heading: "Homework photos into one tidy PDF",
        paragraphs: [
          "Parents photograph notebooks under tube lights. Tutors ask for “one PDF please.” Images to PDF turns JPG, PNG, or WebP shots into a single file you can reorder, then compress for WhatsApp.",
          "Shoot one page per photo, keep the phone parallel to the paper, and check the order before creating the PDF. That alone cuts most “missing page” messages.",
        ],
      },
    ],
    tips: [
      "Good light beats any compression trick.",
      "Reorder with arrows before creating the PDF.",
      "Compress afterward if the file is still heavy.",
    ],
    extraFaqs: [
      {
        question: "Do you support HEIC from iPhones?",
        answer:
          "Convert HEIC to JPG in Photos first, then drop the JPG here. JPG, PNG, and WebP work directly.",
      },
    ],
  },
  "pdf-organize": {
    sections: [
      {
        heading: "Fix messy scans before class",
        paragraphs: [
          "Phone scanners shuffle pages. Blank sheets sneak in. Answer keys land before questions. Organize PDF lets you reorder and delete pages, then download a clean file parents can print without sorting by hand.",
        ],
      },
    ],
    tips: [
      "Delete blanks before printing to save paper.",
      "Put questions first, keys last for practice packs.",
      "Merge related organized files into one weekly pack.",
    ],
    extraFaqs: [
      {
        question: "Does delete remove pages from my original file?",
        answer:
          "Only from the new PDF you download. The original file on your device stays unchanged.",
      },
    ],
  },
  "pdf-extract-text": {
    sections: [
      {
        heading: "Turn typed PDFs into editable notes",
        paragraphs: [
          "When a worksheet already has a text layer, extraction is faster than retyping. Paste into Docs to build quizzes, feedback notes, or study summaries. Image-only scans need OCR first — this tool is not a camera scanner.",
        ],
      },
    ],
    tips: [
      "Test by selecting text in a normal PDF reader first.",
      "Copy page by page if a huge file feels slow on an old phone.",
      "Use Word Counter after pasting to check essay limits.",
    ],
    extraFaqs: [
      {
        question: "Why is the output empty?",
        answer:
          "The PDF is likely a photo of paper with no text layer. Run OCR elsewhere, or retake notes as a typed document.",
      },
    ],
  },
  "worksheet-generator": {
    sections: [
      {
        heading: "Lined paper without a design suite",
        paragraphs: [
          "Class 1–8 handwriting practice still needs ruled sheets. Tutors should not need Canva to print Friday’s English warm-up. Title the sheet, pick lined or boxes, download A4 PDF, and print at home or a neighbourhood shop.",
          "Pair worksheets with Name tags on day one of a new batch, and with Study timetable when you set holiday homework.",
        ],
      },
    ],
    tips: [
      "Use a clear title with class and date.",
      "Boxes work well for short maths working.",
      "Print two-sided to save paper for older students.",
    ],
    extraFaqs: [
      {
        question: "Is the paper A4?",
        answer: "Yes. Sheets export as A4 PDF ready for standard printers in India.",
      },
    ],
  },
  "name-tags": {
    sections: [
      {
        heading: "First-day labels that take one minute",
        paragraphs: [
          "Paste the class list, pick 4/6/8 tags per page, download, print, cut. Camps and tuition batches feel calmer when every desk has a name — and you did not hand-letter twenty cards the night before.",
        ],
      },
    ],
    tips: [
      "One name per line in the box.",
      "Laminate if the batch lasts a full term.",
      "Keep a spare sheet for late joiners.",
    ],
    extraFaqs: [
      {
        question: "Are student names uploaded?",
        answer:
          "No. Names stay in your browser until you download the PDF. We do not store class lists.",
      },
    ],
  },
  "word-counter": {
    sections: [
      {
        heading: "Essay limits without pasting into a random AI box",
        paragraphs: [
          "School essays, blog drafts, and tutor feedback notes all need a word count. Paste here for live words, characters, sentences, and reading time at about 200 wpm. Nothing is saved when you close the tab.",
        ],
      },
    ],
    tips: [
      "Check the limit before the final polish pass.",
      "Reading time helps plan oral presentations.",
      "Clear sensitive text when you finish.",
    ],
    extraFaqs: [
      {
        question: "How is reading time estimated?",
        answer:
          "We use about 200 words per minute — a common silent-reading estimate for students.",
      },
    ],
  },
  "study-timetable": {
    sections: [
      {
        heading: "A wall-ready week beats a messy notebook",
        paragraphs: [
          "Before boards or competitive exams, students need a plan they will actually see. Fill Morning / Afternoon / Evening for Mon–Sun, download landscape A4, and stick it on the wall. Tutors can fill it live with the student and share on WhatsApp.",
          "Keep hard subjects in high-energy slots. Leave buffer for rest. Review every Sunday — then adjust next week’s grid.",
        ],
      },
    ],
    tips: [
      "Name the week (e.g. Board revision — Week 3).",
      "Do not pack every cell — empty space prevents burnout.",
      "Pair with Word Counter for writing homework blocks.",
    ],
    extraFaqs: [
      {
        question: "Can I edit the PDF after download?",
        answer:
          "Treat the PDF as a print snapshot. To change the plan, edit the grid on this page and download again.",
      },
    ],
  },
  "background-remover": {
    sections: [
      {
        heading: "Why a free forever cutout tool matters in 2026",
        paragraphs: [
          "remove.bg announced that its standalone website will shut down on 1 December 2026 as background removal moves into Canva. Many tutors and parents still need a simple upload → transparent PNG flow without joining a full design platform or paying per credit.",
          "Mentr’s answer is an on-device background remover: BiRefNet_lite (MIT), soft alpha matting, browser cache for the ~94 MB model, and no watermark. Quality is produced by continuous transparency and edge cleanup — not by uploading your photo to our GPU.",
        ],
      },
      {
        heading: "What “quality” means here",
        paragraphs: [
          "We publish engineering-verified facts: MIT-licensed model, 512×512 inference with soft alpha upsampling, WebGPU with WASM fallback, private Worker pipeline, and free PNG download. We do not invent “20% better than brand X” scores without a documented same-image study.",
          "For portraits, products, and classroom graphics, inspect the before/after slider at zoom. Hair and fur benefit from soft alpha; glass and motion blur remain hard cases for every automatic remover — including ours.",
        ],
      },
    ],
    tips: [
      "Prefer a clear subject–background contrast for best edges.",
      "First visit downloads the model once; later runs reuse cache.",
      "Download PNG, then open Images → PDF if you need a print pack.",
      "Read /technical/bgremover for the full architecture write-up.",
    ],
    extraFaqs: [
      {
        question: "Is this related to remove.bg or Canva?",
        answer:
          "No. We cite remove.bg’s public Canva migration announcement for context only. Mentr’s pipeline is an independent MIT BiRefNet_lite browser implementation.",
      },
      {
        question: "Will it stay free?",
        answer:
          "Yes for this on-device Mode A path — that is why inference runs in your browser instead of a metered GPU API.",
      },
    ],
  },
};

export function getToolPageCopy(slug: string): ToolPageCopy {
  return (
    COPY[slug] ?? {
      sections: [],
      tips: [],
      extraFaqs: [],
    }
  );
}

/** All FAQs for UI + FAQPage JSON-LD (tool + extra + common). */
export function getAllToolFaqs(tool: ToolDef): ToolFaq[] {
  const copy = getToolPageCopy(tool.slug);
  const seen = new Set<string>();
  const out: ToolFaq[] = [];
  for (const f of [...tool.faqs, ...copy.extraFaqs, ...COMMON_FAQS]) {
    const key = f.question.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(f);
  }
  return out;
}
