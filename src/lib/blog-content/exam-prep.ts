import type { ArticleContent } from "./types";

export const EXAM_PREP_ARTICLES: Record<string, ArticleContent> = {
  "jee-main-2027-preparation-timeline": {
    slug: "jee-main-2027-preparation-timeline",
    publishedAt: "2026-01-15",
    updatedAt: "2026-06-10",
    readTimeMinutes: 14,
    author: "Mentr Editorial Team",
    intro:
      "JEE Main 2027 will likely run in two sessions — January and April — with the first attempt roughly 12 months away if you are in Class 12 right now. That sounds like plenty of time until you account for board pre-boards, school exams, and the fact that JEE tests application speed, not just syllabus completion. This month-by-month timeline is built for CBSE and state-board students targeting a 95+ percentile in Session 1 (January 2027) while keeping boards manageable. Adjust the start month if you are in Class 11: treat everything before June 2026 as foundation work and begin this calendar from July 2026 instead.",
    sections: [
      {
        heading: "Know the 2027 exam calendar before you plan",
        blocks: [
          {
            type: "paragraph",
            text: "NTA typically announces JEE Main dates in the second half of the preceding year. Based on recent cycles, expect Session 1 in the last week of January 2027 and Session 2 in April 2027. JEE Advanced follows only for students who clear the Main cutoff and is usually held in late May or early June. Your preparation timeline should therefore peak twice — once before January and again before April if you want a second shot at improving your percentile.",
          },
          {
            type: "list",
            items: [
              "January 2027 (Session 1): Best for students who finish the Class 12 syllabus by November 2026 and want an early rank for counselling and college shortlisting.",
              "April 2027 (Session 2): Useful if Session 1 felt rushed, or if you want one more attempt after board exams without losing a year.",
              "Board exams (Feb–Mar 2027): CBSE Class 12 boards overlap with JEE prep — plan overlap weeks, do not pretend they are separate worlds.",
            ],
          },
          {
            type: "callout",
            title: "Percentile vs rank",
            text: "JEE Main reports a percentile, not a fixed rank. A 99 percentile in a high-registration shift can still mean a rank in the low thousands. Build your timeline around mock-test percentiles and chapter-wise accuracy, not guesswork from last year's cutoffs alone.",
          },
        ],
      },
      {
        heading: "January–March 2026: Finish Class 11 backlog and start Class 12 strong",
        blocks: [
          {
            type: "paragraph",
            text: "If you are entering Class 12 in April 2026, use the first quarter to close Class 11 gaps. Mechanics, organic chemistry nomenclature, and coordinate geometry from Class 11 appear repeatedly in JEE Main papers. Students who rush into Class 12 without fixing Class 11 usually plateau around the 85–90 percentile band.",
          },
          {
            type: "list",
            ordered: true,
            items: [
              "Week 1–4: Audit Class 11 — list weak chapters in Physics (rotation, thermodynamics), Chemistry (equilibrium, GOC), and Maths (limits, probability).",
              "Week 5–8: Complete one revision cycle of Class 11 with NCERT + one standard problem book (HC Verma for Physics, MS Chauhan or similar for Organic, Cengage or RD Sharma sections for Maths).",
              "Week 9–12: Begin Class 12 syllabus in school parallel — Electrostatics, Solutions, and Calculus should start alongside school, not after it.",
            ],
          },
        ],
      },
      {
        heading: "April–August 2026: Syllabus coverage at 70% intensity",
        blocks: [
          {
            type: "paragraph",
            text: "This is the longest stretch of new learning. Aim to finish 80% of the Class 12 JEE syllabus by August 2026, leaving September onwards for consolidation. Study 4–5 focused hours on weekdays and 6–7 hours on weekends if you are not in a full residential programme. Quality beats quantity: one timed 25-question mixed drill is worth more than three hours of passive video watching.",
          },
          {
            type: "list",
            items: [
              "Physics: Prioritise Electrostatics, Current Electricity, EMI, Optics, and Modern Physics — together they often account for 40%+ of the paper.",
              "Chemistry: Split time 40% Physical, 35% Organic, 25% Inorganic. NCERT Inorganic is non-negotiable for Main; underline every line in chapters 7–9.",
              "Mathematics: Calculus, Vectors, and 3D Geometry carry heavy weightage. Do not neglect Matrices and Determinants — they are quick scoring chapters if practised.",
            ],
          },
          {
            type: "callout",
            title: "When to bring in a mentor",
            text: "If you are stuck on the same chapter for more than two weeks, or your mock scores are flat despite self-study, bring in a JEE mentor for targeted doubt-solving — not full dependency. A good mentor diagnoses whether the problem is concept, speed, or exam temperament.",
          },
        ],
      },
      {
        heading: "September–November 2026: Revision cycle one and mock tests",
        blocks: [
          {
            type: "paragraph",
            text: "Shift from learning to retrieval. Every week should include at least two full-length JEE Main mock tests (3 hours, CBT format if possible) and one day dedicated purely to error analysis. Maintain an error log: question type, silly mistake vs concept gap, time spent. Patterns in the log tell you what to revise next week.",
          },
          {
            type: "list",
            ordered: true,
            items: [
              "September: First full syllabus revision — chapter-wise tests, 30 questions per subject per week.",
              "October: Two mocks per week; start alternating Physics-heavy and Maths-heavy days to build stamina.",
              "November: Increase to three mocks every two weeks; target 95%+ accuracy in NCERT-level questions before chasing Advanced-level problems.",
            ],
          },
        ],
      },
      {
        heading: "December 2026–January 2027: Peak prep and Session 1",
        blocks: [
          {
            type: "paragraph",
            text: "December is for consolidation, not new topics. Stop opening new chapters after the first week of December unless they are high-yield and quick (e.g., semiconductors, biomolecules). Sleep 7 hours, eat on schedule, and reduce mock frequency in the final 5 days before Session 1 — light revision and formula sheets only.",
          },
          {
            type: "list",
            items: [
              "15–31 Dec 2026: Formula revision, previous-year Main papers (2023–2025), one mock every three days.",
              "1–15 Jan 2027: Exam temperament — simulate exam slot timing, minimise screen distractions, review error log only.",
              "After Session 1: Take 3–4 days off, then analyse the paper honestly. If attempting Session 2, repeat the mock-heavy cycle in February–March 2027.",
            ],
          },
          {
            type: "callout",
            title: "Boards in the middle",
            text: "CBSE Class 12 board exams typically fall in February–March 2027. From January onward, allocate 90 minutes daily to board-style writing practice (especially Chemistry and Physics derivations). Scoring well in boards keeps backup options open and reinforces theory for JEE.",
          },
        ],
      },
    ],
    faqs: [
      {
        question: "When should I start preparing for JEE Main 2027?",
        answer:
          "Ideally at the start of Class 11, but a structured Class 12 timeline starting January 2026 can still yield a strong Session 1 result if Class 11 fundamentals are solid. If Class 11 has major gaps, prioritise fixing those in the first quarter of 2026 before accelerating Class 12 coverage.",
      },
      {
        question: "Is one year enough for JEE Main 2027?",
        answer:
          "Yes, for Main — many students crack a 97+ percentile with one focused Class 12 year. JEE Advanced typically needs deeper preparation, often with a drop year or strong Class 11 foundation. Be honest about which exam you are optimising for.",
      },
      {
        question: "How many mock tests should I take before Session 1?",
        answer:
          "Aim for 25–35 full-length mocks between September 2026 and January 2027, plus 50+ chapter-wise tests. Quality of review matters more than count — never take a mock without analysing every wrong answer within 24 hours.",
      },
      {
        question: "Should I skip boards to focus on JEE?",
        answer:
          "No. Board exams share substantial syllabus with JEE Main, and a poor board percentage can limit admission options. Integrate board writing practice into your weekly schedule from November 2026 onward rather than treating them as separate exams.",
      },
      {
        question: "What percentile should I target in Session 1 vs Session 2?",
        answer:
          "Target your best possible score in Session 1 — NTA considers the best of the two sessions for ranking purposes in many counselling processes. Session 2 is a safety net for improvement, not an excuse to under-prepare for Session 1.",
      },
    ],
    relatedLinks: [
      {
        label: "Board exams vs competitive exams",
        href: "/blog/board-exams-vs-competitive-exams",
      },
      {
        label: "How to choose a JEE/NEET mentor",
        href: "/blog/how-to-choose-jee-neet-mentor",
      },
      {
        label: "Online vs local JEE/NEET coaching",
        href: "/blog/online-vs-local-jee-neet-coaching",
      },
      {
        label: "Find JEE mentors in Bengaluru",
        href: "/exam-prep/jee-coaching-bengaluru",
      },
    ],
  },

  "neet-biology-weightage": {
    slug: "neet-biology-weightage",
    publishedAt: "2026-02-01",
    updatedAt: "2026-06-10",
    readTimeMinutes: 12,
    author: "Mentr Editorial Team",
    intro:
      "Biology carries 360 out of 720 marks in NEET — exactly half the paper — yet many students split study time equally across Physics, Chemistry, and Biology. That is a strategic mistake. NTA sets 90 Biology questions (45 Botany, 45 Zoology) from the NCERT Class 11 and 12 syllabus, and year after year, certain units appear more frequently than others. This guide maps chapter-wise weightage using trends from NEET 2021–2025 papers, with a practical revision order for students appearing in NEET 2026 or 2027.",
    sections: [
      {
        heading: "How NEET Biology marks are distributed",
        blocks: [
          {
            type: "paragraph",
            text: "NEET Biology is split evenly between Botany (Class 11 + 12) and Zoology (Class 11 + 12). Each question carries +4 for a correct answer and −1 for a wrong one, with no marks for unattempted questions. Because Biology has the highest question count, it also offers the highest scope for positive marking — and the highest risk from overconfident guessing.",
          },
          {
            type: "list",
            items: [
              "Total Biology questions: 90 (45 Botany + 45 Zoology)",
              "Syllabus source: NCERT Biology textbooks — lines, diagrams, and exemplar concepts",
              "Typical difficulty: 60% direct NCERT recall, 30% application, 10% tricky or multi-statement",
            ],
          },
          {
            type: "callout",
            title: "NCERT is the source text",
            text: "Coaching modules and reference books help for clarity, but NEET Biology questions are overwhelmingly framed from NCERT wording. Students who annotate NCERT and revise it 8–10 times outperform those who read five reference books once.",
          },
        ],
      },
      {
        heading: "Class 11 Biology: high-weightage chapters",
        blocks: [
          {
            type: "paragraph",
            text: "Class 11 units build the conceptual base for half the paper. Plant Physiology, Human Physiology, and Cell Biology appear almost every year with multiple questions each.",
          },
          {
            type: "list",
            items: [
              "Human Physiology (Unit 5): Highest-yield Class 11 unit — expect 8–12 questions combined across years. Focus on cardiac cycle, nephron, neural control, and endocrine glands.",
              "Plant Physiology (Unit 4): Photosynthesis, respiration, and plant growth regulators are frequent. Know C3/C4/CAM pathways and experiment-based questions.",
              "Cell Structure and Function (Unit 3): Cell organelles, cell cycle, and mitosis/meiosis — often tested as diagram or assertion-reason format.",
              "Structural Organisation in Animals (Unit 2): Animal tissues and morphology — lower volume but quick marks if NCERT tables are memorised.",
              "Diversity in Living World & Plant Kingdom (Units 1): Classification and plant families — 2–4 questions typical; do not skip Fabaceae/Solanaceae/Liliaceae examples.",
            ],
          },
        ],
      },
      {
        heading: "Class 12 Biology: high-weightage chapters",
        blocks: [
          {
            type: "paragraph",
            text: "Class 12 Genetics, Biotechnology, and Ecology together can account for 20+ questions in a single paper. These chapters reward consistent NCERT reading more than any coaching shortcut.",
          },
          {
            type: "list",
            items: [
              "Genetics and Evolution (Unit 7): Mendelian genetics, linkage, molecular basis of inheritance, and Hardy-Weinberg — among the most repeated topics. Practice pedigree and dihybrid cross problems.",
              "Biology and Human Welfare (Unit 8): Microbes in household products, sewage treatment, biofertilisers — often 3–5 direct questions.",
              "Biotechnology (Unit 9): Tools of recombinant DNA, PCR, biopiracy — expect 4–6 questions; know process flowcharts.",
              "Ecology and Environment (Unit 10): Population ecology, biodiversity, pollution — growing weightage in recent papers; link to current environmental issues.",
              "Reproduction (Unit 6): Human reproduction, reproductive health, flowering plants — 5–8 questions typical; embryology diagrams are common.",
            ],
          },
        ],
      },
      {
        heading: "Suggested revision priority order for 2026",
        blocks: [
          {
            type: "paragraph",
            text: "If you have limited time before NEET 2026, revise in this order to maximise marks per hour invested. Adjust if your mock tests show a different weakness profile.",
          },
          {
            type: "list",
            ordered: true,
            items: [
              "Tier 1 (must-master): Human Physiology, Genetics, Ecology, Plant Physiology, Biotechnology",
              "Tier 2 (high return): Reproduction, Cell Biology, Biology in Human Welfare",
              "Tier 3 (complete but lighter): Plant Kingdom, Animal Kingdom, Morphology, Biomolecules",
              "Daily habit: 50 NCERT-based MCQs + 30 minutes of diagram revision (heart, nephron, flower, DNA structure)",
            ],
          },
          {
            type: "callout",
            title: "Botany vs Zoology balance",
            text: "Weak Botany is the silent rank-killer — many Zoology-heavy students neglect plant chapters and lose 15–20 marks. Split daily Biology time 50/50 between Botany and Zoology until both sides score 80%+ in chapter tests.",
          },
        ],
      },
      {
        heading: "How to use weightage data without over-optimising",
        blocks: [
          {
            type: "paragraph",
            text: "Weightage trends guide revision priority; they do not mean you can skip low-frequency chapters entirely. NTA has occasionally pulled questions from seemingly minor topics (e.g., mineral nutrition, animal husbandry). Use weightage to sequence your time, not to delete syllabus.",
          },
          {
            type: "list",
            items: [
              "Track your own accuracy by chapter in mock tests — personal weak chapters matter more than national averages.",
              "Revise NCERT summary boxes, figure captions, and end-of-chapter exercises — questions are often lifted from these.",
              "Pair Biology revision with daily Chemistry Organic/Inorganic reading to maintain 720-mark balance.",
              "If stuck on Physiology or Genetics, a NEET Biology mentor who drills NCERT line-by-line is worth the investment.",
            ],
          },
        ],
      },
    ],
    faqs: [
      {
        question: "Which NEET Biology chapter has the highest weightage?",
        answer:
          "Human Physiology (Class 11) and Genetics and Evolution (Class 12) consistently rank among the highest-yield chapters, often contributing 10–15 questions combined in recent papers. Ecology and Biotechnology have also grown in frequency since 2022.",
      },
      {
        question: "Is NCERT enough for NEET Biology?",
        answer:
          "Yes for 85–90% of questions. Use NCERT as the primary text and coaching material only to clarify difficult concepts or for extra practice questions. Every NEET topper revision cycle centres on repeated NCERT reading.",
      },
      {
        question: "How many Biology questions come from Class 11 vs Class 12?",
        answer:
          "Roughly 45 each from Class 11 and Class 12 Botany/Zoology combined, though the exact split varies by paper. Do not gamble on one class — both are equally represented.",
      },
      {
        question: "Should I attempt all 90 Biology questions in NEET?",
        answer:
          "Attempt every question you have read in NCERT and are 80%+ confident about. Blind guessing costs −1 per wrong answer. Most 650+ scorers attempt 80–85 Biology questions with high accuracy rather than all 90 with guesswork.",
      },
      {
        question: "How do I improve Biology score in the last 60 days?",
        answer:
          "Stop learning new reference material. Run two NCERT full reads, one chapter-wise mock per day, and maintain a diagram notebook. Focus on Tier 1 chapters listed above and analyse every mock within the same day.",
      },
    ],
    relatedLinks: [
      {
        label: "JEE Main 2027 preparation timeline",
        href: "/blog/jee-main-2027-preparation-timeline",
      },
      {
        label: "How to choose a JEE/NEET mentor",
        href: "/blog/how-to-choose-jee-neet-mentor",
      },
      {
        label: "Board exams vs competitive exams",
        href: "/blog/board-exams-vs-competitive-exams",
      },
      {
        label: "Find NEET tutors in Bengaluru",
        href: "/exam-prep/neet-foundation-bengaluru",
      },
    ],
  },

  "how-to-choose-jee-neet-mentor": {
    slug: "how-to-choose-jee-neet-mentor",
    publishedAt: "2026-02-10",
    updatedAt: "2026-06-10",
    readTimeMinutes: 11,
    author: "Mentr Editorial Team",
    intro:
      "A JEE or NEET mentor is not the same as a school teacher who covers the textbook once. The right mentor diagnoses gaps from mock tests, enforces a weekly schedule, solves doubts within hours (not days), and tells you when to stop studying a chapter. The wrong one burns months with unstructured problem-solving and vague promises about ranks. This checklist helps parents and students in India evaluate mentors before committing fees — whether you are hiring a local home tutor, a hybrid coach, or someone you found through a platform.",
    sections: [
      {
        heading: "Define what you actually need before you search",
        blocks: [
          {
            type: "paragraph",
            text: "Parents often search for 'JEE coaching' when the student needs something narrower: Organic Chemistry doubt-solving, Physics numerical speed, or weekly accountability. Write down the top three problems — low mock scores, incomplete syllabus, no revision system — and hire for those outcomes.",
          },
          {
            type: "list",
            items: [
              "Subject-specific mentor: One strong teacher for Physics or Biology, 2–3 sessions per week.",
              "Full-track mentor: Oversees all three subjects, sets weekly targets, reviews mock analysis.",
              "Crash-course mentor: Last 60–90 days before exam — revision and test strategy only.",
            ],
          },
        ],
      },
      {
        heading: "Verify track record with evidence, not testimonials alone",
        blocks: [
          {
            type: "paragraph",
            text: "Ask for recent results relevant to your exam and level. A mentor strong in JEE Advanced may be overkill for Main-only prep. Look for students with similar starting scores — improvement from 60 percentile to 95 is harder to achieve than polishing a 97 to 99.",
          },
          {
            type: "list",
            ordered: true,
            items: [
              "Request anonymised mock score trends from 2–3 past students (before/after over 3–6 months).",
              "Ask which exam they optimise for — Main, Advanced, NEET, or boards alongside.",
              "Check if they teach current NTA pattern (NTA has shifted toward NCERT-aligned, assertion-reason, and numerical-heavy formats since 2021).",
              "Confirm batch size: one-on-one or max 3–4 students per session for doubt-heavy subjects.",
            ],
          },
          {
            type: "callout",
            title: "Red flag",
            text: "Guaranteed rank promises, refusal to share any student outcomes, or pressure to pay a full year upfront before a trial week. Reputable mentors offer a paid trial session or short-term contract.",
          },
        ],
      },
      {
        heading: "Evaluate teaching style in a trial session",
        blocks: [
          {
            type: "paragraph",
            text: "One 60–90 minute paid trial reveals more than ten WhatsApp conversations. Send the mentor two questions the student recently got wrong in a mock — watch whether they diagnose the root cause (concept vs careless error vs time management) or simply solve the problem on the board without involving the student.",
          },
          {
            type: "list",
            items: [
              "Do they assign homework with deadlines and follow up?",
              "Do they use structured material (weekly plan, error log template) or improvise every class?",
              "Can they explain the same concept two different ways if the student does not understand?",
              "For NEET: do they stress NCERT line recall, or only coaching modules?",
              "For JEE: do they balance Main speed with Advanced depth, or confuse the two?",
            ],
          },
        ],
      },
      {
        heading: "Fee structure, transparency, and fit",
        blocks: [
          {
            type: "paragraph",
            text: "In metro cities like Bengaluru, Mumbai, and Delhi, JEE/NEET mentors charge anywhere from ₹800 to ₹3,000+ per hour for one-on-one sessions in 2026, depending on experience and results. Group mentoring costs less but reduces doubt-solving time. Agree in writing on session frequency, cancellation policy, and whether fees cover test analysis or only teaching hours.",
          },
          {
            type: "list",
            items: [
              "Prefer monthly contracts initially — convert to quarterly only after 4–6 weeks of visible progress.",
              "Clarify who sets the syllabus pace: mentor should align with school/board schedule, not fight it.",
              "Hybrid is valid: online for concept videos, local mentor for weekly tests and accountability.",
              "Student comfort matters — a famous mentor the student fears will not work long-term.",
            ],
          },
        ],
      },
      {
        heading: "When to switch mentors (and when to stay)",
        blocks: [
          {
            type: "paragraph",
            text: "Give a new mentor 6–8 weeks before judging. Switch if mock scores flatline despite homework compliance, doubts pile up between sessions, or the mentor regularly cancels. Stay if weekly error logs shrink, attendance is consistent, and the student can articulate what they learned — even if rank jumps are not immediate.",
          },
          {
            type: "callout",
            title: "Parent's role",
            text: "Check in monthly, not daily. Ask the student to explain one concept they learned that week. Micromanaging every session destroys trust between student and mentor.",
          },
        ],
      },
    ],
    faqs: [
      {
        question: "Should I hire separate mentors for each JEE subject?",
        answer:
          "Often yes — especially if one subject is significantly weaker. A full-track coordinator plus subject specialists works well for serious aspirants. One generalist mentor for all three JEE subjects is fine only if they demonstrate equal strength across Physics, Chemistry, and Maths with mock data.",
      },
      {
        question: "Is a Kota faculty mentor better than a local tutor?",
        answer:
          "Not automatically. Kota faculty understand exam patterns but may teach large-batch style ill-suited to one student. A strong local mentor who gives personalised mock analysis can outperform a big-name coach with no individual attention.",
      },
      {
        question: "How many hours per week should a mentor teach?",
        answer:
          "For JEE/NEET alongside school, 6–10 hours of mentored time per week (including test review) is typical. More than 15 hours of coached classes plus self-study often leads to burnout without proportional gains.",
      },
      {
        question: "What questions should I ask before paying?",
        answer:
          "Ask about recent student outcomes, weekly deliverables, mock test review process, batch size, fee refund policy, and whether they cover boards alongside competitive exams. Request one paid trial before long-term commitment.",
      },
      {
        question: "Can a Class 12 school teacher double as a JEE/NEET mentor?",
        answer:
          "Sometimes for boards and basics, but competitive exam mentoring requires familiarity with NTA question patterns, timed test strategy, and multi-year syllabus integration. Verify they have coached entrance exam students recently, not only board batches.",
      },
    ],
    relatedLinks: [
      {
        label: "Online vs local JEE/NEET coaching",
        href: "/blog/online-vs-local-jee-neet-coaching",
      },
      {
        label: "JEE Main 2027 preparation timeline",
        href: "/blog/jee-main-2027-preparation-timeline",
      },
      {
        label: "NEET Biology weightage guide",
        href: "/blog/neet-biology-weightage",
      },
      {
        label: "Post your tutor requirement",
        href: "/parent/signup",
      },
    ],
  },

  "cbse-class-10-study-plan": {
    slug: "cbse-class-10-study-plan",
    publishedAt: "2026-01-20",
    updatedAt: "2026-06-10",
    readTimeMinutes: 13,
    author: "Mentr Editorial Team",
    intro:
      "CBSE Class 10 board exams in 2026 are expected in February–March, which means your last 60 days should shift from learning new topics to retrieval, writing practice, and full-length sample papers. This plan assumes you have attended school regularly and completed the syllabus at least once. If you are starting late, compress Tier 1 subjects (Maths, Science) and use NCERT exemplar for selective chapters rather than trying to cover everything at equal depth.",
    sections: [
      {
        heading: "Days 60–45: Audit and block scheduling",
        blocks: [
          {
            type: "paragraph",
            text: "Begin with a honest syllabus audit. Download the CBSE Class 10 2025–26 sample question papers and mark chapters you have never revised. Build a six-day study week: three core subjects (Maths, Science, Social Science) rotate as primaries, with English and Hindi slotted as lighter daily reading.",
          },
          {
            type: "list",
            ordered: true,
            items: [
              "Day 1–3: List weak chapters per subject using school pre-board results or chapter tests.",
              "Day 4–5: Collect NCERT, previous-year papers (2023–2025), and CBSE sample paper 2025–26.",
              "Day 6–7: Create a 45-day calendar with one full-length subject test every weekend.",
            ],
          },
          {
            type: "callout",
            title: "Marking scheme awareness",
            text: "CBSE awards step marks in Maths and Science. Practice writing complete solutions — a correct method with a calculation error can still earn partial credit. Silly omission of units in Physics costs marks every year.",
          },
        ],
      },
      {
        heading: "Days 44–30: Subject-wise deep revision",
        blocks: [
          {
            type: "paragraph",
            text: "Spend two weeks cycling through high-weightage units. For CBSE Class 10 Maths, prioritise Algebra, Trigonometry, and Statistics — together they dominate Section C and D. In Science, Physics numericals (Electricity, Light), Chemistry (Acids-Bases, Carbon compounds), and Biology (Life processes, Heredity) need equal attention.",
          },
          {
            type: "list",
            items: [
              "Mathematics: 90 minutes daily — 30 min concept revision, 60 min mixed problems from NCERT + exemplar.",
              "Science: Alternate Physics-Chemistry-Biology days; draw labelled diagrams from NCERT (heart, eye, electrolysis).",
              "Social Science: Map work and date-based events — use mnemonics; attempt 3-mark and 5-mark writing weekly.",
              "English/Hindi: One literature chapter + one writing format (letter, analytical paragraph) per week.",
            ],
          },
        ],
      },
      {
        heading: "Days 29–15: Sample papers and writing speed",
        blocks: [
          {
            type: "paragraph",
            text: "Transition to exam conditions. CBSE papers are as much about speed and presentation as knowledge. Time yourself strictly: Maths and Science papers are 3 hours; Social Science 3 hours with map work included.",
          },
          {
            type: "list",
            ordered: true,
            items: [
              "Week 1: One full paper each for Maths, Science, and Social Science under timed conditions.",
              "Week 2: Repeat weakest paper; add English/Hindi full papers on alternate days.",
              "Daily: 45 minutes formula and definition drill (Science + Maths) — flashcards or self-quizzing.",
              "Review every paper same day — colour-code errors as concept, careless, or time pressure.",
            ],
          },
        ],
      },
      {
        heading: "Days 14–1: Light revision and exam temperament",
        blocks: [
          {
            type: "paragraph",
            text: "The final fortnight is not for new topics. Revise NCERT summary points, CBSE sample paper solutions, and your error notebook. Reduce study hours slightly in the last 3 days — sleep and calm matter more than one extra chapter.",
          },
          {
            type: "list",
            items: [
              "Maintain school exam slot timing — if Maths is forenoon, practise Maths at 10 AM.",
              "Pack admit card, stationery, and watch the night before; CBSE does not allow borrowing in hall.",
              "Board exams are sequential — do not let one disappointing paper affect the next. Parents: avoid post-paper analysis until all exams finish.",
            ],
          },
          {
            type: "callout",
            title: "When to get a tutor in the last 60 days",
            text: "Hire subject help if one paper is consistently below 60% in mocks — a Class 10 Maths or Science tutor for twice-weekly doubt sessions can lift 10–15 marks. Avoid starting entirely new coaching programmes this late.",
          },
        ],
      },
      {
        heading: "Weekly template you can reuse",
        blocks: [
          {
            type: "paragraph",
            text: "Use this Monday–Saturday template during Days 44–15. Sunday is for one full sample paper and rest.",
          },
          {
            type: "list",
            items: [
              "Monday: Maths focus + 30 min Science formulas",
              "Tuesday: Science (Physics/Chem) + Social map practice",
              "Wednesday: Maths + Biology diagrams",
              "Thursday: Social Science long answers + English writing",
              "Friday: Mixed weak-chapter drill across subjects",
              "Saturday: Half-length timed test (90 min) + review",
            ],
          },
        ],
      },
    ],
    faqs: [
      {
        question: "Is NCERT enough for CBSE Class 10 boards 2026?",
        answer:
          "Yes for most subjects — CBSE papers are NCERT-aligned. Supplement Maths and Science with NCERT Exemplar and previous-year papers for 90%+ scores. Reference books help only for extra practice, not as replacements.",
      },
      {
        question: "How many hours should a Class 10 student study in the last 60 days?",
        answer:
          "6–8 focused hours on weekdays and 7–9 on weekends is sufficient for most students who have completed the syllabus once. Quality and timed writing practice matter more than 12-hour marathon days.",
      },
      {
        question: "Which Class 10 subject should I prioritise?",
        answer:
          "Prioritise Maths and Science if you aim for the Science stream in Class 11. Social Science and languages still need scheduled time — they are often rank-deciders for overall percentage.",
      },
      {
        question: "Should I join a new tuition class two months before boards?",
        answer:
          "Only for targeted doubt-solving in one weak subject. Starting a full multi-subject coaching batch now wastes time on orientation. Prefer a verified home tutor for 2–3 sessions per week in the lagging subject.",
      },
      {
        question: "How do pre-board exams fit into this plan?",
        answer:
          "Treat pre-boards as diagnostic mocks, not final verdicts. Analyse results in the first week of the 60-day window and adjust the chapter priority list. Many students improve 8–12% between pre-boards and final boards with structured revision.",
      },
    ],
    relatedLinks: [
      {
        label: "Board exams vs competitive exams",
        href: "/blog/board-exams-vs-competitive-exams",
      },
      {
        label: "Class 10 board exam tutors in Bengaluru",
        href: "/exam-prep/class-10-board-exam-tutors-bengaluru",
      },
      {
        label: "How to choose a JEE/NEET mentor",
        href: "/blog/how-to-choose-jee-neet-mentor",
      },
      {
        label: "Search board exam tutors",
        href: "/search?subject=Exam%20Prep",
      },
    ],
  },

  "board-exams-vs-competitive-exams": {
    slug: "board-exams-vs-competitive-exams",
    publishedAt: "2026-03-01",
    updatedAt: "2026-06-10",
    readTimeMinutes: 12,
    author: "Mentr Editorial Team",
    intro:
      "Class 11 and 12 students in India are often told to choose: boards or JEE/NEET. That framing creates unnecessary panic. CBSE board exams and competitive entrance tests share 60–70% of the same syllabus — the difference is exam format, speed, and depth. Students who treat boards as foundation revision for JEE Main or NEET typically score better in both than students who abandon boards for 'coaching-only' preparation. This guide explains how to balance both in 2026 without burning out.",
    sections: [
      {
        heading: "What boards and competitive exams actually test",
        blocks: [
          {
            type: "paragraph",
            text: "CBSE board exams reward structured written answers, labelled diagrams, and step-wise derivations. JEE Main and NEET reward fast MCQ accuracy under time pressure. JEE Advanced adds multi-concept problems requiring deeper insight. The same Physics chapter on Current Electricity appears in all — but boards ask for Kirchhoff's law derivation while JEE asks which graph represents power vs current in 45 seconds.",
          },
          {
            type: "list",
            items: [
              "Boards: Long-form, moderate difficulty, NCERT-centric, internal assessment (practicals/projects) counts.",
              "JEE Main / NEET: MCQ-only, negative marking, broader question mixing, no partial marks.",
              "Overlap: NCERT Class 11–12 is the base text for NEET entirely and for ~70% of JEE Main Chemistry and Biology-adjacent topics.",
            ],
          },
        ],
      },
      {
        heading: "The integrated weekly schedule (Class 12, 2026)",
        blocks: [
          {
            type: "paragraph",
            text: "Assume 6 productive study days. School attendance stays non-negotiable — coaching substitutes cannot replace school lab records and pre-board grading.",
          },
          {
            type: "list",
            items: [
              "Weekdays (2.5–3 hours after school): 60 min competitive exam practice (MCQs), 90 min board-style revision or homework, 30 min weak-subject drill.",
              "Saturday: One competitive mock (3 hours) OR two subject-wise board papers — alternate weekly.",
              "Sunday: Error analysis, NCERT re-read, lighter language subject work.",
              "Daily non-negotiable: 30 min NCERT Biology/Chemistry reading for NEET aspirants; formula sheet for JEE aspirants.",
            ],
          },
          {
            type: "callout",
            title: "The 80/20 split by season",
            text: "Until November 2026: 70% competitive prep, 30% board writing practice. December–February 2027: shift to 50/50 as boards approach. After boards: return to 80% competitive until NEET (May 2027) or JEE Session 2 (April 2027).",
          },
        ],
      },
      {
        heading: "Subject-specific balancing tactics",
        blocks: [
          {
            type: "paragraph",
            text: "Integration beats duplication. Study each chapter once at board depth, then layer MCQ speed on top — do not maintain two separate notes for the same topic unless your coaching insists.",
          },
          {
            type: "list",
            items: [
              "Physics: Write one derivation per topic for boards; solve 20 MCQs on the same topic for JEE/NEET the next day.",
              "Chemistry: NCERT Inorganic serves both exams identically — one thorough read covers boards and NEET.",
              "Maths (JEE): Board exams include simpler application problems — practising Main-level questions usually covers board difficulty.",
              "Biology (NEET): Board diagrams and NEET figure-based MCQs come from the same NCERT pages — annotate once.",
            ],
          },
        ],
      },
      {
        heading: "Common mistakes that hurt both exams",
        blocks: [
          {
            type: "paragraph",
            text: "These patterns show up every year in counselling forums and parent WhatsApp groups. Avoid them early.",
          },
          {
            type: "list",
            ordered: true,
            items: [
              "Skipping board practicals and internal marks to save time — they are free percentage points.",
              "Using only coaching modules and never opening NCERT — hurts NEET directly, hurts JEE Chemistry significantly.",
              "Ignoring English and optional subjects until March — overall board percentage still matters for many college cutoffs and scholarships.",
              "Taking competitive mocks without reviewing — creates false confidence and repeated errors.",
              "Changing coaching institutes mid-year — syllabus restart costs 6–8 weeks.",
            ],
          },
        ],
      },
      {
        heading: "Role of mentors in dual preparation",
        blocks: [
          {
            type: "paragraph",
            text: "A mentor who understands both board marking schemes and NTA patterns is more valuable than two disconnected teachers. Look for someone who assigns board-style written tests monthly alongside MCQ mocks, and who adjusts pace when school pre-boards approach.",
          },
          {
            type: "callout",
            title: "When boards should take priority",
            text: "If pre-board scores are below 65% in any core subject, redirect 2 weeks of focused board prep before returning to competitive intensity. A failed board compartment exam costs more time than a missed mock.",
          },
        ],
      },
    ],
    faqs: [
      {
        question: "Can I ignore boards if I am aiming for IIT or AIIMS?",
        answer:
          "No. Many admission processes still consider board marks for eligibility or tie-breaking. Strong boards also keep state counselling and backup college options open if competitive ranks fall short.",
      },
      {
        question: "Does CBSE board percentage matter for JEE counselling?",
        answer:
          "For JoSAA IIT counselling, board marks are not in the rank formula, but you must pass Class 12 with required subjects. Some NITs, IIITs, and state colleges use board scores in separate quotas. NEET state counselling often includes board performance in eligibility rules.",
      },
      {
        question: "How many hours daily for boards + NEET together?",
        answer:
          "Serious dual prep in Class 12 typically needs 6–8 focused hours beyond school in peak months. Quality sleep and one half-day off per week prevent the burnout that causes both board and NEET scores to drop.",
      },
      {
        question: "Should I drop a year if boards and JEE both went poorly?",
        answer:
          "A structured drop year with weekly mocks and a single accountable mentor works for many students — but only if the drop year has a written plan, not open-ended repetition of coaching videos. Fix the diagnosis (concept vs temperament) before repeating.",
      },
      {
        question: "Is state board easier to balance with JEE than CBSE?",
        answer:
          "State boards vary — some have lighter syllabi that free time for JEE, but university eligibility and question style differ. CBSE students benefit from direct NCERT overlap with NEET and significant JEE Main alignment. Balance depends on your school’s exam schedule, not board name alone.",
      },
    ],
    relatedLinks: [
      {
        label: "JEE Main 2027 preparation timeline",
        href: "/blog/jee-main-2027-preparation-timeline",
      },
      {
        label: "CBSE Class 10 study plan",
        href: "/blog/cbse-class-10-study-plan",
      },
      {
        label: "NEET Biology weightage",
        href: "/blog/neet-biology-weightage",
      },
      {
        label: "Class 12 board exam tutors",
        href: "/exam-prep/class-12-board-exam-tutors-bengaluru",
      },
    ],
  },

  "online-vs-local-jee-neet-coaching": {
    slug: "online-vs-local-jee-neet-coaching",
    publishedAt: "2026-03-15",
    updatedAt: "2026-06-10",
    readTimeMinutes: 11,
    author: "Mentr Editorial Team",
    intro:
      "After 2020, online JEE and NEET coaching became mainstream — but 'online' now means everything from free YouTube playlists to ₹1.5 lakh live cohort programmes. Local mentoring still means home tutors, neighbourhood coaching centres, and hybrid models where a Bengaluru-based Physics teacher meets twice weekly while Chemistry stays online. Neither format wins on every dimension. This comparison helps Indian families decide based on learning style, budget, and accountability needs in 2026.",
    sections: [
      {
        heading: "What online coaching does well",
        blocks: [
          {
            type: "paragraph",
            text: "Online platforms excel at scale: star faculty, recorded lectures you can replay, and national-level mock test series with percentile analytics. For self-motivated students in Tier 2 and Tier 3 cities with limited local faculty, online access to Kota- or Hyderabad-style content can be transformative.",
          },
          {
            type: "list",
            items: [
              "Access to top faculty regardless of city — useful for Physics and Organic Chemistry in particular.",
              "Recorded content for revision — pause, rewind, speed up during second and third passes.",
              "Structured test series with all-India ranks — benchmark against a large peer pool.",
              "Lower travel time — 2 hours saved daily can go to self-study if the student is disciplined.",
            ],
          },
          {
            type: "callout",
            title: "Hidden cost of online",
            text: "Low completion rates. Industry data consistently shows most students finish less than 40% of purchased course content. Online works when there is external accountability — a parent, mentor, or study group checking weekly progress.",
          },
        ],
      },
      {
        heading: "What local mentoring does well",
        blocks: [
          {
            type: "paragraph",
            text: "A local JEE or NEET mentor — especially one-on-one or in a group of three — provides real-time doubt clearing, physical presence for accountability, and flexibility to align with your school's test schedule. In cities like Bengaluru, Hyderabad, and Pune, strong local tutors often coach a handful of students with documented percentile improvements.",
          },
          {
            type: "list",
            items: [
              "Instant doubt-solving — no waiting for forum replies or next week's live session.",
              "Custom pacing — skip chapters you have mastered, double down on weak areas.",
              "Board exam integration — local tutors usually know your school's pre-board calendar.",
              "Lower distraction risk — no notifications, no switching between five apps mid-lecture.",
            ],
          },
        ],
      },
      {
        heading: "Cost comparison in 2026 (indicative)",
        blocks: [
          {
            type: "paragraph",
            text: "Prices vary widely by city and brand. These ranges reflect what families typically pay for Class 11–12 preparation in metro cities.",
          },
          {
            type: "list",
            items: [
              "National online cohort (live + test series): ₹80,000–₹1,80,000 per year",
              "Online test series only: ₹5,000–₹15,000 per year",
              "Local coaching centre (group batch): ₹40,000–₹1,20,000 per year",
              "Local home tutor (one-on-one, 3 sessions/week): ₹60,000–₹1,50,000 per year depending on hours and subject expertise",
              "Hybrid (online lectures + local mentor for tests): ₹70,000–₹1,40,000 combined",
            ],
          },
          {
            type: "callout",
            title: "Fee ≠ outcome",
            text: "The most expensive online programme underperforms a ₹40,000 local mentor if the student never watches lectures. Match format to temperament, not marketing hoardings.",
          },
        ],
      },
      {
        heading: "The hybrid model most families underuse",
        blocks: [
          {
            type: "paragraph",
            text: "High-performing students in 2025–26 increasingly combine free or low-cost online concept videos with a local mentor for weekly mock analysis and accountability. The mentor does not re-teach every chapter — they review tests, assign corrections, and enforce schedules.",
          },
          {
            type: "list",
            ordered: true,
            items: [
              "Online: Concept videos for new chapters (Physics rotation, Organic mechanisms).",
              "Local mentor: 2 sessions/week — mock review, doubt-solving, parent progress update.",
              "Self-study: NCERT + daily MCQs between sessions — non-negotiable.",
              "Monthly: One parent-student-mentor check-in on mock percentile trend.",
            ],
          },
        ],
      },
      {
        heading: "Decision checklist: which format fits your student?",
        blocks: [
          {
            type: "paragraph",
            text: "Answer honestly — self-awareness beats brand names.",
          },
          {
            type: "list",
            items: [
              "Choose online-first if: highly self-motivated, no strong local faculty, comfortable with screens, needs national test benchmarking.",
              "Choose local-first if: easily distracted online, needs daily accountability, weak in one subject requiring hand-holding, boards and school sync matter.",
              "Choose hybrid if: good discipline but gaps in 1–2 subjects, budget allows modest local fees atop free/low-cost online content.",
              "Avoid full-time residential coaching unless: family can support the cost and emotional toll, and the student thrives away from home.",
            ],
          },
        ],
      },
    ],
    faqs: [
      {
        question: "Is online coaching enough for NEET without a local tutor?",
        answer:
          "It can be, if the student completes NCERT revision cycles independently and joins a rigorous online test series. Most NEET students below 600 marks benefit from a local Biology or Chemistry mentor for weekly NCERT-based quizzing — even 2 hours per week helps.",
      },
      {
        question: "Do IIT toppers only use offline coaching?",
        answer:
          "No. Recent years include toppers from online-only and hybrid paths. Top ranks correlate more with daily problem-solving volume and mock analysis quality than with online vs offline label.",
      },
      {
        question: "How do I verify a local JEE/NEET tutor?",
        answer:
          "Ask for recent mock score improvements, take a paid trial session, and check references from parents in your neighbourhood. Platforms like Mentr let you compare verified tutors locally and connect without lead fees.",
      },
      {
        question: "Can I switch from online to local mid-year?",
        answer:
          "Yes, but allow 2–3 weeks to transition materials and align syllabus pace. Switch when online completion rate is below 50% after 8 weeks despite effort — that usually signals an accountability problem, not an intelligence problem.",
      },
      {
        question: "What about YouTube free content vs paid coaching?",
        answer:
          "YouTube is excellent for concept clarity from channels like Physics Wallah, Unacademy free modules, or subject specialists — but it lacks structured progression and test accountability. Use YouTube to supplement, not replace, a syllabus plan and mock schedule.",
      },
    ],
    relatedLinks: [
      {
        label: "How to choose a JEE/NEET mentor",
        href: "/blog/how-to-choose-jee-neet-mentor",
      },
      {
        label: "JEE Main 2027 preparation timeline",
        href: "/blog/jee-main-2027-preparation-timeline",
      },
      {
        label: "Find JEE mentors in Bengaluru",
        href: "/exam-prep/jee-coaching-bengaluru",
      },
      {
        label: "Search exam-prep tutors",
        href: "/search?subject=Exam%20Prep",
      },
    ],
  },
};
