import type { ArticleContent } from "./types";

/** Seasonal parent-acquisition guides — half-yearly results & CBSE 2027 board changes. */
export const PARENT_ACQUISITION_SEP2026: Record<string, ArticleContent> = {
  "half-yearly-exam-low-marks-what-parents-should-do": {
    slug: "half-yearly-exam-low-marks-what-parents-should-do",
    publishedAt: "2026-09-27",
    updatedAt: "2026-09-27",
    readTimeMinutes: 8,
    author: "Mentr Editorial Team",
    intro:
      "Half-yearly (mid-term) exams run through September and into October in most CBSE and state-board schools, and results usually reach parents by the end of October. If your child's marks came in lower than expected, the next four weeks matter more than the report card itself. This guide gives a calm, practical plan: what to say at home, how to read the answer sheets, when tuition genuinely helps — and how to find the right tutor quickly without paying agency commission.",
    sections: [
      {
        heading: "First 48 hours: what to say (and what to avoid)",
        blocks: [
          {
            type: "paragraph",
            text: "A half-yearly result is a mid-year checkpoint, not a verdict. Children read a parent's reaction more than the marks. Before discussing studies, make it clear the result does not change how you see them — then agree to look at the details together in a day or two.",
          },
          {
            type: "list",
            items: [
              "Say: “I know this isn't what you wanted. We'll work out what to fix together.”",
              "Say: “Show me which questions felt hardest.”",
              "Avoid comparisons with cousins, classmates, or siblings.",
              "Avoid “we spend so much on your studies” — it adds shame, not direction.",
              "Keep sleep, meals, and play time normal this week.",
            ],
          },
          {
            type: "callout",
            title: "When to get extra support for your child",
            text: "If low mood, sleep or appetite changes, or school refusal last more than two weeks, speak to the class teacher or school counsellor early. Wellbeing comes before marks.",
          },
        ],
      },
      {
        heading: "Diagnose before you react: read the answer sheets",
        blocks: [
          {
            type: "paragraph",
            text: "Most schools share checked answer sheets at the PTM or on request. Sit with your child for 30 minutes and sort every lost mark into one of four buckets. The fix is different for each — and “study more hours” is rarely the right one.",
          },
          {
            type: "list",
            ordered: true,
            items: [
              "Concept gaps — the child did not understand the chapter (needs re-teaching).",
              "Careless errors — calculation slips, misread questions (needs practice + checking habit).",
              "Presentation / steps — right idea, but steps or keywords missing (needs answer-writing practice).",
              "Time management — questions left unattempted (needs timed practice papers).",
            ],
          },
          {
            type: "paragraph",
            text: "Write the top three weak chapters per subject on one page. That single page becomes the brief you give a tutor, a teacher, or your own revision plan.",
          },
        ],
      },
      {
        heading: "Does your child actually need a tutor?",
        blocks: [
          {
            type: "paragraph",
            text: "Tuition is not automatic. It helps most when the problem is concept gaps or lack of personal attention in a large class. It helps least when the real issue is sleep, screen time, or exam anxiety.",
          },
          {
            type: "list",
            items: [
              "Yes, likely: the same subject is weak across two or more tests; homework takes very long; your child says “I don't understand what the teacher explains”.",
              "Maybe: marks dropped in one subject after a new, harder chapter — try 2–3 weeks of focused self-study plus school doubt sessions first.",
              "Probably not: marks fell across every subject at once — check sleep, stress, and routine before adding classes.",
            ],
          },
          {
            type: "callout",
            title: "Class 9–12 families",
            text: "Pre-board and final exams follow soon after half-yearlies. For Class 10 and 12, a gap found in October is still very fixable — a gap found in January is much harder.",
          },
        ],
      },
      {
        heading: "A 4-week recovery plan after half-yearly results",
        blocks: [
          {
            type: "list",
            ordered: true,
            items: [
              "Week 1 — Diagnose: finish the answer-sheet review and list weak chapters. Meet the subject teacher if possible.",
              "Week 2 — Fix basics: re-learn the two weakest chapters from NCERT or the school textbook before moving to harder questions.",
              "Week 3 — Practise: do chapter-wise questions daily; check every answer against the marking scheme.",
              "Week 4 — Test: one timed paper per weak subject at home. Compare with the half-yearly result.",
            ],
          },
          {
            type: "paragraph",
            text: "Keep it small: one focused hour a day beats a panicked six-hour weekend. A printed weekly plan on the wall helps — you can make one free with the Mentr study timetable tool.",
          },
        ],
      },
      {
        heading: "How to choose the right tutor after a poor result",
        blocks: [
          {
            type: "paragraph",
            text: "After a disappointing result, parents often hire the first tutor a neighbour suggests. Spend one evening doing it properly — it saves months.",
          },
          {
            type: "list",
            items: [
              "Match the board (CBSE / ICSE / state) and the exact class — not just the subject.",
              "Share your one-page weak-chapter list and ask how they would cover it in four weeks.",
              "Prefer one-on-one for concept gaps; small groups are fine for practice.",
              "Book a trial session and watch whether your child asks questions freely.",
              "Check verification and reviews before sharing your address or phone.",
              "Agree on a simple progress check — one short test every two weeks.",
            ],
          },
          {
            type: "callout",
            title: "Find a tutor on Mentr — free, no commission",
            text: "Search verified home and online tutors by subject, class, and board, or post your requirement and let tutors come to you. Parents pay nothing to connect, and WhatsApp unlocks only after both sides accept.",
          },
        ],
      },
    ],
    faqs: [
      {
        question: "When do half-yearly exam results come out?",
        answer:
          "Schools set their own timetable, but most CBSE schools hold half-yearly exams through September and October, with results and PTMs generally by the end of October.",
      },
      {
        question: "Should I start tuition immediately after low half-yearly marks?",
        answer:
          "Not before a quick diagnosis. Review the answer sheets first. If the same subject shows concept gaps, starting a tutor within two to three weeks is sensible — especially for Class 9–12 with pre-boards ahead.",
      },
      {
        question: "Is one-on-one tuition better than coaching after poor marks?",
        answer:
          "For concept gaps and confidence, one-on-one is usually more effective because the tutor can go back to basics at your child's pace. Group coaching suits students who mainly need practice and a schedule.",
      },
      {
        question: "How do I find a verified tutor quickly?",
        answer:
          "On Mentr you can browse verified tutors without login, filter by subject, class, and board, and send a free connect request. You can also post a requirement so interested tutors pitch to you.",
      },
      {
        question: "My child studies hard but still scores low. Why?",
        answer:
          "Common reasons are passive study (re-reading instead of practising), missing steps in answers, weak basics from earlier classes, or exam anxiety. The answer-sheet review usually shows which one it is.",
      },
    ],
    relatedLinks: [
      { label: "Find a verified tutor", href: "/search" },
      { label: "Post your tutor requirement", href: "/blog/how-to-post-tutor-requirement" },
      { label: "Signs your child needs a tutor", href: "/blog/signs-child-needs-tutor" },
      { label: "How to evaluate a tutor trial session", href: "/blog/how-parents-evaluate-tutor-trial-session" },
      { label: "Free study timetable PDF", href: "/tools/study-timetable" },
    ],
  },

  "cbse-class-10-two-board-exams-2027-parents-guide": {
    slug: "cbse-class-10-two-board-exams-2027-parents-guide",
    publishedAt: "2026-09-27",
    updatedAt: "2026-09-27",
    readTimeMinutes: 9,
    author: "Mentr Editorial Team",
    intro:
      "From 2026, CBSE runs two Class 10 board examinations in the same academic year. For the 2027 cycle, the main exam is expected from mid-February and the optional second exam in May. Many parents are still unsure what is compulsory, what the second exam is for, and how to plan the year. This guide explains the rules in plain language, what they mean for your child's preparation — and when getting a tutor actually makes sense.",
    sections: [
      {
        heading: "The two exams at a glance",
        blocks: [
          {
            type: "list",
            items: [
              "First (main) board exam — compulsory for every Class 10 student. Expected to begin mid-February 2027; results expected around April.",
              "Second board exam — optional, expected in May 2027; results expected around June.",
              "Same syllabus for both exams — there is no reduced syllabus for the second attempt.",
              "Internal assessment is done only once, before the main exam, and counts for both.",
            ],
          },
          {
            type: "callout",
            title: "Date sheet status (as of 27 September 2026)",
            text: "CBSE has not yet released the official 2027 date sheet. Last year the tentative schedule came out on 24 September and the final one on 30 October. Always confirm dates on cbse.gov.in — not forwarded WhatsApp images.",
          },
        ],
      },
      {
        heading: "Who can take the second exam — and for what",
        blocks: [
          {
            type: "list",
            items: [
              "Passed students can improve their performance in up to three subjects from Science, Mathematics, Social Science, and languages.",
              "Students with a Compartment result in the first exam can appear in the second exam under the compartment category.",
              "A student who did not appear in three or more subjects in the first exam cannot take the second exam and is placed in the “Essential Repeat” category.",
              "Additional or stand-alone subjects are not allowed after passing Class 10.",
            ],
          },
          {
            type: "paragraph",
            text: "Source: CBSE notification on two board examinations in Class X (25 June 2025). Rules can be updated, so re-check the circular for your child's session.",
          },
        ],
      },
      {
        heading: "What this changes for parents",
        blocks: [
          {
            type: "paragraph",
            text: "The second exam lowers the pressure of a single high-stakes day — but it is not a reason to prepare less for February. Treat it as a safety net, not a plan.",
          },
          {
            type: "list",
            items: [
              "February still matters most: it is compulsory, and internal marks are fixed before it.",
              "Internal assessment carries more weight than students think — projects, practicals, and periodic tests are not repeated.",
              "The gap between the April results and the May exam is short. Improving a weak subject in a few weeks is hard unless the groundwork was done earlier.",
              "Plan for all subjects in February; decide on the second exam only after results.",
            ],
          },
        ],
      },
      {
        heading: "A month-by-month plan for the 2027 cycle",
        blocks: [
          {
            type: "list",
            ordered: true,
            items: [
              "October: review half-yearly answer sheets, list weak chapters, finish the remaining syllabus.",
              "November: complete the syllabus; start chapter-wise practice from CBSE sample papers (cbseacademic.nic.in).",
              "December: pre-board preparation; submit projects and practical files on time.",
              "January: full-length timed papers; practise answer presentation and step marking.",
              "February–March: main board exams — rest well, avoid last-minute new topics.",
              "April: results — decide calmly whether the second exam is worth it, and for which subjects (up to three).",
              "May: second exam, focused only on the chosen subjects.",
            ],
          },
        ],
      },
      {
        heading: "When a tutor genuinely helps for Class 10",
        blocks: [
          {
            type: "paragraph",
            text: "Most Class 10 students do not need tuition in every subject. A tutor adds the most value in two windows: October–December to close concept gaps before pre-boards, and April–May if your child takes the second exam in a specific subject.",
          },
          {
            type: "list",
            items: [
              "Maths and Science are the most common subjects where one-on-one help changes results.",
              "Look for a tutor who knows the CBSE marking scheme and teaches step-wise answer writing.",
              "For the second exam, pick a short, targeted plan — three to five weeks on one or two subjects.",
              "Ask for a trial and a clear plan against your child's weak-chapter list.",
            ],
          },
          {
            type: "callout",
            title: "Find a CBSE Class 10 tutor on Mentr",
            text: "Browse verified CBSE tutors (home or online) by subject and area, compare profiles, and connect free. Short on time? Use Instant Connect to get matched quickly.",
          },
        ],
      },
    ],
    faqs: [
      {
        question: "Is the second CBSE Class 10 board exam compulsory?",
        answer:
          "No. Only the first (main) exam is compulsory. The second exam in May is optional — for improving performance in up to three subjects, or for students with a compartment result.",
      },
      {
        question: "In which subjects can my child take the second exam?",
        answer:
          "Up to three subjects from Science, Mathematics, Social Science, and languages, as per the CBSE notification. Check the latest circular for your session.",
      },
      {
        question: "Are internal assessment marks repeated in the second exam?",
        answer:
          "No. Internal assessment is conducted once before the main exam and is used for both attempts. Only the theory paper is taken again.",
      },
      {
        question: "When will the CBSE 2027 date sheet be released?",
        answer:
          "As of 27 September 2026 it has not been released. Based on last year, a tentative schedule may appear in late September or October, with the final date sheet by October–November. Confirm on cbse.gov.in.",
      },
      {
        question: "Should my child prepare less for February because there is a second exam?",
        answer:
          "No. February is compulsory and the gap before May is short. Aim to do your best in February and treat the second exam as a safety net.",
      },
    ],
    relatedLinks: [
      { label: "Find CBSE Class 10 tutors", href: "/search" },
      { label: "How to choose a tutor for Class 10", href: "/blog/how-to-choose-a-tutor-for-class-10" },
      { label: "CBSE Class 10: last 60-day study plan", href: "/blog/cbse-class-10-study-plan" },
      { label: "Write CBSE answers that keep step marks", href: "/blog/how-to-write-cbse-answers-to-keep-step-marks" },
      { label: "Instant Connect — find a tutor fast", href: "/instant-connect" },
    ],
  },
};
