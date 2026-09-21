import type { ArticleContent } from "./types";

const AUTHOR = "Mentr Editorial Team";
const UPDATED = "2026-09-21";

export const SNAP_GRADE_ARTICLES: Record<string, ArticleContent> = {
  "what-is-snap-and-grade": {
    slug: "what-is-snap-and-grade",
    publishedAt: "2026-09-21",
    updatedAt: UPDATED,
    readTimeMinutes: 8,
    author: AUTHOR,
    intro:
      "Snap & Grade is a CBSE Class 9–12 practice tool on mentr.in. You pick an NCERT or board-style question, photograph the answer you already wrote in your notebook, and get step marks the way a board key splits them — plus a short tip on how to write it next time. It is a paid feature with 100 free credits to start. This page explains what it is, what it is not, and who it is for.",
    sections: [
      {
        heading: "What Snap & Grade actually does",
        blocks: [
          {
            type: "paragraph",
            text: "Most students finish a chapter and still do not know what they would score. A parent sees a tick in the notebook. A tutor marks it days later. The board examiner, meanwhile, awards marks by step — formula, working, units, last line. Snap & Grade sits in that gap. You practise on paper, like the exam. Then you photograph that page. The tool grades against a CBSE-style key that is already on the question.",
          },
          {
            type: "list",
            items: [
              "Live banks: Class 9–12 Maths, Class 9–10 Science, Class 11–12 Physics, Chemistry and Biology — 3500+ questions, with board papers, PYQs and sample papers in the same flow.",
              "Output: marks by step, the line that was cut, and a writing tip for the next attempt.",
              "Credits: 100 free once on a new account. Then recharge from ₹1 (₹1 = 1 credit). A full grade uses about 5 credits.",
            ],
          },
          {
            type: "callout",
            title: "It is not your board result",
            text: "Snap & Grade is practice marking in the CBSE style. It helps you write better. It is not the official CBSE mark sheet.",
          },
        ],
      },
      {
        heading: "What it is not",
        blocks: [
          {
            type: "paragraph",
            text: "People search for homework checkers, ChatGPT prompts, and tutor apps. Snap & Grade is none of those. You cannot type a random question from a coaching booklet (custom photo questions are coming later). It does not replace a teacher. It does not store your solution photo — history keeps the question, marks, the text we graded, and tips.",
          },
          {
            type: "list",
            items: [
              "Not a tutor marketplace session — though you can still hire a tutor on Mentr if you want extra help.",
              "Not ChatGPT with an uploaded marking-scheme PDF. The key is already on the question.",
              "Not an app to install. Open mentr.in/snapandgrade on your phone browser.",
            ],
          },
        ],
      },
      {
        heading: "How to use it in three steps",
        blocks: [
          {
            type: "list",
            ordered: true,
            items: [
              "Go to mentr.in/snapandgrade/grade and log in as a parent or student.",
              "Pick class → subject → chapter → the exact question you practised.",
              "Take a clear photo of the notebook page, confirm the text, and see step marks.",
            ],
          },
          {
            type: "paragraph",
            text: "Credits are not charged until you confirm. If the photo is blurry, take it again in good light, on a flat page, with all working in the frame. You can edit the digital text before we grade.",
          },
        ],
      },
      {
        heading: "Who should try it this week",
        blocks: [
          {
            type: "paragraph",
            text: "Class 9–12 students who have practised the chapter but still guess their marks. Parents who want a clear split, not “looks correct”. Students who lose marks on units, reasons, or the last line even when the method is right.",
          },
          {
            type: "callout",
            title: "Start free, then pay only if it helps",
            text: "100 free credits is about 20 full grades. That is enough to see if CBSE-style feedback changes how you write. After that, top up from ₹1 via Razorpay.",
          },
        ],
      },
    ],
    faqs: [
      {
        question: "Is Snap & Grade free?",
        answer:
          "Yes to start. You get 100 free credits once. After that you pay from ₹1. ₹1 = 1 credit. A full grade uses about 5 credits.",
      },
      {
        question: "Do I need a tutor for this?",
        answer:
          "No. It is for self-practice. You can still hire a tutor on Mentr if you want extra help.",
      },
      {
        question: "Which classes are covered?",
        answer:
          "CBSE Class 9–12. Maths, Science, and Class 11–12 Physics, Chemistry and Biology question banks are live.",
      },
    ],
    relatedLinks: [
      {
        label: "Open Snap & Grade",
        href: "/snapandgrade",
      },
      {
        label: "Grade a practice answer",
        href: "/snapandgrade/grade",
      },
      {
        label: "How to write CBSE answers",
        href: "/blog/how-to-write-cbse-answers-to-keep-step-marks",
      },
      {
        label: "ChatGPT vs CBSE marking scheme",
        href: "/blog/chatgpt-vs-cbse-marking-scheme",
      },
    ],
  },

  "how-to-write-cbse-answers-to-keep-step-marks": {
    slug: "how-to-write-cbse-answers-to-keep-step-marks",
    publishedAt: "2026-09-21",
    updatedAt: UPDATED,
    readTimeMinutes: 9,
    author: AUTHOR,
    intro:
      "CBSE does not mark only the final number. It marks the path. About 3 in 10 students lose marks because they do not know how to write the answer — missing a formula line, a unit, a reason, or the last statement — even when they know the idea. This guide is the writing habit Snap & Grade is built to train: practise on paper, then see which step a board-style key would keep.",
    sections: [
      {
        heading: "What a step-marked answer looks like",
        blocks: [
          {
            type: "paragraph",
            text: "On a 3-mark Maths numerical, a typical split is: write the formula, substitute the values, give the answer with unit. Get the number right and skip the unit — you can still lose a mark. In Science, “give reason” questions often split fact and reason. Write only the keyword and the reason mark is gone.",
          },
          {
            type: "list",
            items: [
              "Maths: formula → substitution → working → boxed answer with unit.",
              "Science: definition or fact, then the reason in a full sentence.",
              "Physics: formula, substitution with units, and the statement in a derivation that the scheme names.",
            ],
          },
        ],
      },
      {
        heading: "A simple writing checklist before you close the notebook",
        blocks: [
          {
            type: "list",
            ordered: true,
            items: [
              "Did I write the formula or the definition, not only the number?",
              "Did I show the working, not only the last line?",
              "Did I put the unit (or the reason) where the scheme expects it?",
              "Would an examiner find each mark without guessing what I meant?",
            ],
          },
          {
            type: "callout",
            title: "Practise the same way you will write in the hall",
            text: "Typing into ChatGPT trains a different muscle. Boards are handwritten. Snap & Grade grades a photo of that handwriting so the habit stays on paper.",
          },
        ],
      },
      {
        heading: "How Snap & Grade fits this habit",
        blocks: [
          {
            type: "paragraph",
            text: "Pick the NCERT or sample-paper question you just solved. Photograph the page. Confirm the text. You get marks by step and a short tip on the line you missed. History saves the question, marks, and text — not the photo — so you can reopen last week’s leak before a test.",
          },
          {
            type: "paragraph",
            text: "Class 9 is the right time to lock this habit. Class 10 and 12 boards will not teach it on result day.",
          },
        ],
      },
    ],
    faqs: [
      {
        question: "Can I still lose marks if the final answer is correct?",
        answer:
          "Yes. CBSE-style keys often give separate marks for formula, working, units, and the last line. A right number with a missing step can still be cut.",
      },
      {
        question: "Should I write in full sentences for Science?",
        answer:
          "For reason and definition questions, yes. One-word answers often miss the reason mark even when the fact is right.",
      },
      {
        question: "Where do I practise this on Mentr?",
        answer:
          "Open mentr.in/snapandgrade/grade, pick the question, snap your notebook, and read the writing tip on the step that was cut.",
      },
    ],
    relatedLinks: [
      {
        label: "What is Snap & Grade?",
        href: "/blog/what-is-snap-and-grade",
      },
      {
        label: "Why students lose marks on steps",
        href: "/blog/why-students-lose-marks-on-steps-cbse",
      },
      {
        label: "Class 10 Maths marking",
        href: "/snapandgrade/class-10-maths",
      },
      {
        label: "Grade a practice answer",
        href: "/snapandgrade/grade",
      },
    ],
  },

  "chatgpt-vs-cbse-marking-scheme": {
    slug: "chatgpt-vs-cbse-marking-scheme",
    publishedAt: "2026-09-21",
    updatedAt: UPDATED,
    readTimeMinutes: 8,
    author: AUTHOR,
    intro:
      "Students now photograph a question, paste it into ChatGPT, and ask “how many marks?” That can explain a method. It is a weak substitute for a CBSE marking scheme. ChatGPT guesses steps from whatever PDF you uploaded — or from no PDF at all. A board key is a split: this mark for the formula, this mark for the reason, this mark for the unit. Snap & Grade keeps that split on the question so you do not hunt a scheme the night before the paper.",
    sections: [
      {
        heading: "What ChatGPT is good at — and where it slips",
        blocks: [
          {
            type: "paragraph",
            text: "Generic AI is useful for a second explanation of a concept. It is not a substitute for the examiner’s split. If you do not attach a marking scheme, the model invents a reasonable-looking paragraph. If you do attach one, it still may merge steps, skip units, or praise a derivation that missed the named statement.",
          },
          {
            type: "list",
            items: [
              "Marking scheme: you find a PDF and hope the AI follows it.",
              "What you get back: a paragraph that “looks right”, not marks by step.",
              "History: lost in a chat thread.",
              "Question bank: whatever you typed that day.",
            ],
          },
        ],
      },
      {
        heading: "What Snap & Grade does instead",
        blocks: [
          {
            type: "paragraph",
            text: "Every live question already has a CBSE-style key. You pick the item you practised. You photograph your working. You see formula, working, units, and the final line scored separately — plus a tip written for your attempt. NCERT, PYQ and sample-paper items sit in one bank so you are not mixing a random internet question with a board split.",
          },
          {
            type: "callout",
            title: "Do not upload a marking scheme to chat",
            text: "If the key is already on the question, you spend the minute on your handwriting — which is what the hall will mark.",
          },
        ],
      },
      {
        heading: "When you might still use both",
        blocks: [
          {
            type: "paragraph",
            text: "Use a general AI to re-explain a concept you did not understand in class. Use Snap & Grade when you already wrote the answer and need to know which step would survive a board-style key. They solve different jobs. Mixing them as if they were the same tool is how students feel confident and still drop marks.",
          },
        ],
      },
    ],
    faqs: [
      {
        question: "Can ChatGPT mark like CBSE if I upload the scheme?",
        answer:
          "Sometimes it follows the PDF. Often it summarises. Snap & Grade does not ask you to find that PDF — the split is already on the question.",
      },
      {
        question: "Is Snap & Grade official CBSE?",
        answer:
          "No. It is practice marking in the CBSE style. It is not your board result.",
      },
      {
        question: "Where do I try the comparison myself?",
        answer:
          "Grade one notebook page at mentr.in/snapandgrade/grade, then compare that split with whatever a chat tool said about the same sum.",
      },
    ],
    relatedLinks: [
      {
        label: "CBSE marking scheme practice",
        href: "/snapandgrade/cbse-marking-scheme",
      },
      {
        label: "What is Snap & Grade?",
        href: "/blog/what-is-snap-and-grade",
      },
      {
        label: "Open Snap & Grade",
        href: "/snapandgrade",
      },
      {
        label: "Grade a practice answer",
        href: "/snapandgrade/grade",
      },
    ],
  },

  "why-students-lose-marks-on-steps-cbse": {
    slug: "why-students-lose-marks-on-steps-cbse",
    publishedAt: "2026-09-21",
    updatedAt: UPDATED,
    readTimeMinutes: 8,
    author: AUTHOR,
    intro:
      "You solved it at home. In the paper, a step, a unit, or the last line is missing — and the examiner cuts it. Parents see a full notebook and assume the child “knows it”. Teachers see the method and skip the writing. Boards do not. This is the quiet mark leak Snap & Grade is built for: students who practised the chapter but still do not know how to write the answer.",
    sections: [
      {
        heading: "The leak is usually not the idea",
        blocks: [
          {
            type: "paragraph",
            text: "Class 9 Maths starts to split marks on reasons and constructions. Class 10 Science rewards a complete reason, not a one-word fact. Class 11–12 Physics derivations lose marks when a named statement is skipped. Students who “know the method” still drop 2 marks on units, or the formula line, or the boxed answer.",
          },
          {
            type: "list",
            items: [
              "Skipping the formula because it felt obvious.",
              "Right number, no unit.",
              "Fact without the reason in Science.",
              "Derivation that jumps to the last line.",
            ],
          },
        ],
      },
      {
        heading: "Why waiting for the tutor is too late",
        blocks: [
          {
            type: "paragraph",
            text: "A weekly tutor can correct a chapter. They cannot sit on every practice page the night you wrote it. Pre-board papers come back after the habit is already set. Snap & Grade lets you photograph today’s page and see the cut tonight — so tomorrow’s attempt keeps that mark.",
          },
          {
            type: "callout",
            title: "Parents: ask which step was cut",
            text: "“Did you finish the chapter?” is a weak question. “Which step lost the mark?” is the one that changes writing. A step mark sheet makes that conversation short.",
          },
        ],
      },
      {
        heading: "What to do this week",
        blocks: [
          {
            type: "list",
            ordered: true,
            items: [
              "Pick one chapter you already practised — not a new one.",
              "Write two answers on paper, exam style.",
              "Grade them at mentr.in/snapandgrade/grade with the 100 free credits.",
              "Rewrite only the line the tip names. Grade once more.",
            ],
          },
        ],
      },
    ],
    faqs: [
      {
        question: "Is this only for weak students?",
        answer:
          "No. High scorers also leak marks on units and statements. The leak is writing, not intelligence.",
      },
      {
        question: "Does this replace a tutor?",
        answer:
          "No. It marks the page you wrote. A tutor still helps when the idea itself is stuck.",
      },
      {
        question: "Will this work on a phone?",
        answer:
          "Yes. Open the site in the browser, take a photo of the notebook, confirm the text. No app to install.",
      },
    ],
    relatedLinks: [
      {
        label: "How to write CBSE answers",
        href: "/blog/how-to-write-cbse-answers-to-keep-step-marks",
      },
      {
        label: "Grade NCERT answers from a photo",
        href: "/blog/grade-ncert-answers-from-a-photo",
      },
      {
        label: "Class 10 Science marking",
        href: "/snapandgrade/class-10-science",
      },
      {
        label: "Open Snap & Grade",
        href: "/snapandgrade",
      },
    ],
  },

  "grade-ncert-answers-from-a-photo": {
    slug: "grade-ncert-answers-from-a-photo",
    publishedAt: "2026-09-21",
    updatedAt: UPDATED,
    readTimeMinutes: 7,
    author: AUTHOR,
    intro:
      "You already solved the NCERT exercise in the notebook. The next step is not to retype the sum into a chat box. Photograph that page, confirm the text, and see marks the CBSE way. Snap & Grade on mentr.in is built for that loop: study the chapter PDF, practise the question, grade the handwriting. Class 9–12 Maths, Science, and Class 11–12 Physics, Chemistry and Biology — 3500+ questions on the same site.",
    sections: [
      {
        heading: "Why a photo of your notebook beats typing",
        blocks: [
          {
            type: "paragraph",
            text: "Boards are handwritten. If you only type answers, you never practise layout, units on the line, or the reason sentence. A photo keeps the exam muscle. Snap & Grade reads that page (you can edit the digital text if a line is misread) and scores it against the key already on the question.",
          },
          {
            type: "list",
            items: [
              "Take the photo in good light, page flat, all working in the frame.",
              "Confirm or edit the text before you grade — credits go only after confirm.",
              "History stores question, marks, text, and tips — not the photo.",
            ],
          },
        ],
      },
      {
        heading: "NCERT PDFs and questions in one place",
        blocks: [
          {
            type: "paragraph",
            text: "On the Snap & Grade hub you can open Class 9–12 Maths, Class 9–10 Science, and Class 11–12 Physics, Chemistry and Biology chapter PDFs in the on-site reader. Study, practise, then grade. You do not need a second website for the PDF and a third for “check my answer”.",
          },
          {
            type: "callout",
            title: "100 free credits once",
            text: "New accounts get 100 free credits — about 20 full grades. After that, recharge from ₹1 (₹1 = 1 credit) via Razorpay.",
          },
        ],
      },
      {
        heading: "Start with one chapter tonight",
        blocks: [
          {
            type: "list",
            ordered: true,
            items: [
              "Open mentr.in/snapandgrade and pick your class page if you want subject copy first.",
              "Go to Grade now. Choose the exact NCERT question you wrote.",
              "Snap. Confirm. Read the step that was cut. Write that line again tomorrow.",
            ],
          },
        ],
      },
    ],
    faqs: [
      {
        question: "Can I grade any homework photo?",
        answer:
          "Today you pick a question from the bank we loaded (NCERT + board-style). Custom photo questions are coming later.",
      },
      {
        question: "Do you store my photo?",
        answer:
          "No. History saves the question, marks, the text we graded, and tips — not the photo.",
      },
      {
        question: "Which photo page should I open?",
        answer:
          "The hub is mentr.in/snapandgrade. Direct grader: mentr.in/snapandgrade/grade. Class landings such as /snapandgrade/class-10-maths explain the same tool for that paper.",
      },
    ],
    relatedLinks: [
      {
        label: "NCERT photo grade landing",
        href: "/snapandgrade/ncert-photo-grade",
      },
      {
        label: "What is Snap & Grade?",
        href: "/blog/what-is-snap-and-grade",
      },
      {
        label: "Chapter PDFs on the hub",
        href: "/snapandgrade#ncert-maths-pdfs",
      },
      {
        label: "Grade a practice answer",
        href: "/snapandgrade/grade",
      },
    ],
  },
};
