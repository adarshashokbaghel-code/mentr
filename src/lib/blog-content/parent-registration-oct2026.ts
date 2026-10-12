import type { ArticleContent } from "./types";

/**
 * Parent registration batch (Oct 2026). Each post targets a need parents actually posted
 * on Mentr (IB PYP, Kannada, Hindi) where no tutor-listing page exists yet, and sends
 * readers to sign-up with the requirement form pre-filled for that subject.
 */
export const PARENT_REGISTRATION_OCT2026: Record<string, ArticleContent> = {
  "ib-pyp-tutor": {
    slug: "ib-pyp-tutor",
    publishedAt: "2026-10-12",
    updatedAt: "2026-10-12",
    readTimeMinutes: 9,
    author: "Mentr Editorial Team",
    intro:
      "An IB PYP tutor is different from a regular tuition teacher. The Primary Years Programme has no fixed textbook and few written tests, so a good PYP tutor doesn't drill chapters. They help your child research, ask better questions, explain their thinking out loud and keep up with the maths and English the school expects alongside the Units of Inquiry. Most PYP children don't need tuition at all. It's worth it when your child has just moved from CBSE or ICSE, is preparing for the PYP Exhibition, or keeps losing confidence in maths or writing. Expect ₹700–₹1,500 an hour in Indian metros for someone who genuinely knows the IB.",
    sections: [
      {
        heading: "What the PYP actually asks of your child",
        blocks: [
          {
            type: "paragraph",
            text: "Parents who studied in CBSE or state-board schools often find the PYP confusing. There's no syllabus book to revise from and the report card talks about “approaches to learning” rather than marks. Here's what is really going on in the classroom.",
          },
          {
            type: "table",
            caption: "PYP terms parents hear, in plain words",
            headers: ["Term", "What it means at home"],
            rows: [
              ["Unit of Inquiry (UOI)", "A 5–7 week topic, such as water, migration or how markets work. Your child researches, discusses and presents rather than memorising."],
              ["Transdisciplinary themes", "Six big themes (for example “Sharing the planet” and “How the world works”) that every unit sits under. Science, social studies and art are mixed inside them."],
              ["Central idea and lines of inquiry", "The one-sentence idea the unit explores, and the 3–4 questions the class investigates. Ask to see these; they tell you exactly what the unit is about."],
              ["Learner profile", "Ten qualities the IB wants children to build, such as inquirer, communicator and risk-taker. Teachers comment on these."],
              ["PYP Exhibition", "A long group project in the final PYP year (usually Grade 5) where children choose a real-world issue, research it and present it to the school community."],
              ["Assessment", "Mostly portfolios, observations and presentations. Some schools add unit tests in maths and language."],
            ],
          },
          {
            type: "callout",
            title: "The question to ask the class teacher",
            text: "“What is the central idea of the current unit, and which skill is my child finding hardest?” The answer tells you whether your child needs help with the unit itself, with maths or language, or simply with organising their work.",
          },
        ],
      },
      {
        heading: "Does your child need a PYP tutor?",
        blocks: [
          {
            type: "table",
            caption: "When a PYP tutor helps, and when it doesn't",
            headers: ["Situation", "Tutor useful?", "What kind of help"],
            rows: [
              ["Just moved from CBSE/ICSE to an IB school", "Often yes, for one term", "Research habits, presenting, open-ended writing"],
              ["Struggling with maths concepts the class “discovered”", "Yes", "A maths tutor who can teach the concept directly, then link it back to the unit"],
              ["English writing feels thin or very short", "Yes", "Reading widely, planning paragraphs, explaining reasons"],
              ["Preparing for the Grade 5 Exhibition", "Sometimes", "A mentor who asks questions, never one who does the project"],
              ["Doing fine but you want them “ahead”", "Usually no", "Reading for fun and free play help more at this age"],
            ],
          },
          {
            type: "paragraph",
            text: "The most common mistake is hiring a tutor who treats the PYP like CBSE: notes, question banks and memorised answers. Your child then learns two different ways of working and gets confused in both. A PYP tutor should leave your child better at finding answers, not holding more of them.",
          },
        ],
      },
      {
        heading: "What to look for in an IB PYP tutor",
        blocks: [
          {
            type: "list",
            items: [
              "Has taught in an IB school, or has tutored PYP children before. Ask which units they've worked on.",
              "Asks to see the unit planner, central idea or recent work before the first session.",
              "Teaches through questions (“What do you notice? How could we find out?”) instead of giving notes.",
              "Is strong in maths and English separately. Most real gaps at this age are there, not in the unit topic.",
              "Refuses to make your child's Exhibition project or presentation for them. That's a red flag if they offer.",
              "Sends you a short note after each week: what they worked on and what to watch at home.",
            ],
          },
          {
            type: "paragraph",
            text: "In the demo session, give the tutor a real piece of your child's work and watch what they do with it. A good PYP tutor will ask your child to explain it first, then pick one thing to improve. A tutor who starts by correcting everything is a poor fit for this programme.",
          },
        ],
      },
      {
        heading: "How much does an IB PYP tutor cost in India?",
        blocks: [
          {
            type: "table",
            caption: "Typical IB PYP tutor fees (2026)",
            headers: ["Type", "Per hour", "Notes"],
            rows: [
              ["Experienced IB teacher, home tuition (metros)", "₹1,000–₹1,500", "Bengaluru, Gurugram, Mumbai, Pune"],
              ["Tutor with PYP experience, online", "₹700–₹1,200", "Wider choice; works well from Grade 3"],
              ["Subject tutor (maths or English) for an IB child", "₹500–₹900", "Often enough if the gap is in one subject"],
            ],
          },
          {
            type: "paragraph",
            text: "For comparison, a recent IB request posted on Mentr by a Gurugram parent, for a Grade 4 Unit of Inquiry tutor at home, offered ₹800–₹1,000 an hour. One or two sessions a week for a term is usually enough to close a specific gap.",
          },
        ],
      },
      {
        heading: "Find an IB PYP tutor on Mentr",
        blocks: [
          {
            type: "paragraph",
            text: "IB tutors are scarce, so searching listings alone can take weeks. It's usually faster to describe what you need and let tutors who know the PYP come to you.",
          },
          {
            type: "list",
            ordered: true,
            items: [
              "Create a free parent account. It takes about a minute with your email.",
              "Post your requirement: pick Science (or Mathematics or English if the gap is there), the class, and home or online. In the details, write “IB PYP”, the grade and the current unit.",
              "Verified tutors who know the IB send you a pitch. Your name and number stay hidden on the board.",
              "Book a demo with one or two of them, then connect on WhatsApp once you accept.",
            ],
          },
          {
            type: "cta",
            title: "Post your IB PYP requirement",
            text: "Free for parents. Tutors pitch to you, you choose who to talk to, and there's no agency fee or commission.",
            label: "Post a requirement free",
            href: "/parent/signup?next=%2Fparent%2Fdashboard%3Fpost%3DScience",
          },
        ],
      },
    ],
    faqs: [
      {
        question: "What does an IB PYP tutor do?",
        answer:
          "An IB PYP tutor helps a primary-years child with the skills the programme expects: researching a Unit of Inquiry, explaining their thinking, writing and presenting, plus any gaps in maths and English. A good PYP tutor teaches through questions rather than notes and never does project work for the child.",
      },
      {
        question: "Does my child need tuition in the IB PYP?",
        answer:
          "Most PYP children don't. Tuition helps when a child has just switched from CBSE or ICSE, has a clear gap in maths or English writing, or needs guidance (not ready-made answers) for the Grade 5 Exhibition.",
      },
      {
        question: "How much does an IB PYP tutor charge in India?",
        answer:
          "In 2026, experienced IB tutors in Indian metros typically charge about ₹1,000–₹1,500 an hour for home tuition and ₹700–₹1,200 online. A maths or English tutor for an IB child often costs ₹500–₹900 an hour.",
      },
      {
        question: "Can a CBSE tutor teach an IB PYP student?",
        answer:
          "For maths and English skills, often yes, if they adapt to the school's approach. For Units of Inquiry and the Exhibition, a tutor with IB experience is much better, because the work is open-ended research and presentation, not chapter revision.",
      },
      {
        question: "What is a Unit of Inquiry in the PYP?",
        answer:
          "A Unit of Inquiry is a multi-week topic organised around a central idea and a few lines of inquiry, under one of six transdisciplinary themes. Children investigate it through research, discussion and projects instead of a textbook chapter.",
      },
    ],
    relatedLinks: [
      { label: "ICSE vs CBSE: choosing a tutor", href: "/blog/icse-vs-cbse-tutor-guide-parents" },
      { label: "Tuition for Class 1–5", href: "/blog/tuition-for-class-1-to-5" },
      { label: "How to post a tutor requirement", href: "/blog/how-to-post-tutor-requirement" },
      { label: "How parents evaluate a trial session", href: "/blog/how-parents-evaluate-tutor-trial-session" },
      { label: "Create a free parent account", href: "/parent/signup" },
    ],
  },

  "kannada-tuition-for-kids-bengaluru": {
    slug: "kannada-tuition-for-kids-bengaluru",
    publishedAt: "2026-10-12",
    updatedAt: "2026-10-12",
    readTimeMinutes: 8,
    author: "Mentr Editorial Team",
    intro:
      "If your family moved to Bengaluru from another state, your child will almost certainly study Kannada at school, including in CBSE and ICSE schools, because Karnataka's Kannada Language Learning Act requires it to be taught. For a child who doesn't hear Kannada at home, that usually means struggling with the script, reading aloud and memorised answers. A Kannada tutor who works with non-Kannada children fixes this faster than worksheets: two short sessions a week, focused on the script, everyday vocabulary and the school textbook, typically at ₹300–₹600 an hour. Here's what to expect by class, what good Kannada tuition looks like, and how to find a tutor.",
    sections: [
      {
        heading: "Why your child is learning Kannada at a CBSE or ICSE school",
        blocks: [
          {
            type: "paragraph",
            text: "Under the Kannada Language Learning Act, 2015, schools in Karnataka teach Kannada as a compulsory language across boards, generally from Class 1 to Class 10. In many CBSE and ICSE schools it's the second or third language, and the level is set for children who don't speak it at home. How many periods a week, which textbook and how much it counts in exams varies from school to school, so ask your school for the language syllabus at the start of the year.",
          },
          {
            type: "callout",
            title: "Good to know",
            text: "Children who start in Class 1–3 usually pick up Kannada quite easily. The hard cases are children who join a Bengaluru school in Class 5 or later and are expected to read and write at the class level straight away. That's where a tutor helps most.",
          },
        ],
      },
      {
        heading: "Where non-Kannada children usually get stuck",
        blocks: [
          {
            type: "table",
            caption: "Common Kannada problems and what fixes them",
            headers: ["Problem", "What it looks like", "What a tutor should do"],
            rows: [
              ["Script (ಅಕ್ಷರಮಾಲೆ)", "Mixes up similar letters; can't read ottakshara (conjunct letters)", "Teach letters in families with daily 10-minute reading, not copying pages"],
              ["Reading aloud", "Reads letter by letter, no idea what it means", "Short sentences with pictures; read, then retell in English"],
              ["Vocabulary", "Knows words in the book, nothing else", "Everyday words: family, food, numbers, directions, shop talk"],
              ["Exam answers", "Memorises answers without understanding", "Teach the meaning first, then how to write a short answer"],
              ["Confidence", "Avoids speaking because classmates are fluent", "Speaking games and simple role-play, a little every session"],
            ],
          },
        ],
      },
      {
        heading: "What Kannada tuition should look like by class",
        blocks: [
          {
            type: "table",
            caption: "Realistic goals for Kannada tuition",
            headers: ["Class", "Focus", "Sessions"],
            rows: [
              ["Class 1–3", "Letters, simple words, rhymes, listening", "2 × 30–40 min a week"],
              ["Class 4–5", "Fluent reading, short sentences, basic grammar", "2 × 45 min a week"],
              ["Class 6–8", "Textbook lessons, grammar, letter and essay writing", "2 × 45–60 min a week"],
              ["Class 9–10", "Board-exam pattern, model answers, grammar practice", "2–3 × 60 min a week before exams"],
            ],
          },
          {
            type: "paragraph",
            text: "A child who joins in Class 6 or later and is starting from zero can usually reach the class textbook level in about one school term with steady practice. Promising that in a month isn't realistic, and a tutor who does is overselling.",
          },
        ],
      },
      {
        heading: "Online or home tuition for Kannada?",
        blocks: [
          {
            type: "paragraph",
            text: "Online Kannada tuition works well from Class 3 upwards, especially with a tutor who shares the textbook page on screen and asks your child to write in a notebook and show it. For Class 1–2, a home tutor is easier because so much of the early work is letter formation. Both are common in Bengaluru. Online also means you can choose a tutor across the city rather than only in your area.",
          },
          {
            type: "list",
            items: [
              "Ask whether the tutor has taught children from non-Kannada families before",
              "Ask them to explain how they'd teach the script, not just the textbook",
              "Share your child's school textbook and the last test paper before the demo",
              "Expect a short weekly update: letters mastered, lesson covered, what to practise",
            ],
          },
        ],
      },
      {
        heading: "How much does Kannada tuition cost in Bengaluru?",
        blocks: [
          {
            type: "table",
            caption: "Typical Kannada tuition fees in Bengaluru (2026)",
            headers: ["Type", "Per hour", "Per month (2 sessions a week)"],
            rows: [
              ["Online, Class 1–5", "₹300–₹450", "₹2,500–₹3,600"],
              ["Home tuition, Class 1–5", "₹400–₹600", "₹3,200–₹4,800"],
              ["Class 6–10, board-exam focus", "₹450–₹700", "₹3,600–₹5,600"],
            ],
          },
        ],
      },
      {
        heading: "Find a Kannada tutor on Mentr",
        blocks: [
          {
            type: "paragraph",
            text: "Bengaluru is where most parents on Mentr post their needs. Post a Kannada requirement and tutors who teach non-Kannada children send you a pitch, so you don't have to chase listings.",
          },
          {
            type: "list",
            ordered: true,
            items: [
              "Create a free parent account with your email.",
              "Post your requirement: Kannada, your child's class, your area (or online) and a budget. Mention that Kannada isn't spoken at home.",
              "Read the pitches and book a demo with one or two tutors.",
              "Connect on WhatsApp after you accept. Your number stays private until then.",
            ],
          },
          {
            type: "cta",
            title: "Post a Kannada tuition requirement",
            text: "Free for parents in Bengaluru and online. Verified tutors pitch to you, with no agency fee or commission.",
            label: "Find a Kannada tutor",
            href: "/parent/signup?next=%2Fparent%2Fdashboard%3Fpost%3DKannada",
          },
        ],
      },
    ],
    faqs: [
      {
        question: "Is Kannada compulsory in CBSE schools in Bengaluru?",
        answer:
          "Yes. Under the Kannada Language Learning Act, 2015, schools in Karnataka, including CBSE and ICSE schools, teach Kannada as a compulsory language, generally from Class 1 to Class 10. The level, number of periods and weight in exams differ by school, so check your school's language syllabus.",
      },
      {
        question: "How can my child learn Kannada if we don't speak it at home?",
        answer:
          "Start with the script and everyday vocabulary rather than the textbook, practise reading aloud for 10 minutes a day, and use a tutor who has taught children from non-Kannada families. Two short sessions a week are usually enough.",
      },
      {
        question: "What is the fee for Kannada tuition in Bangalore?",
        answer:
          "In 2026, Kannada tuition in Bengaluru typically costs about ₹300–₹450 an hour online and ₹400–₹600 an hour at home for Class 1–5, and ₹450–₹700 an hour for Class 6–10 board-exam preparation.",
      },
      {
        question: "Can Kannada be learned online?",
        answer:
          "Yes, from about Class 3 onwards. A good online tutor shares the textbook on screen, checks written work through the camera, and keeps sessions to 30–45 minutes. For Class 1–2, home tuition is usually easier because of letter formation.",
      },
      {
        question: "How long does it take a child to learn Kannada for school?",
        answer:
          "A child joining a Bengaluru school in Class 6 or later from zero can usually reach their class textbook level in about one term with steady practice. Younger children often pick it up faster.",
      },
    ],
    relatedLinks: [
      { label: "How to find a tutor in Bengaluru", href: "/blog/how-to-find-a-tutor-in-bengaluru" },
      { label: "Home tutor cost in Bengaluru", href: "/blog/home-tutor-cost-bengaluru" },
      { label: "Hindi tutor online for kids", href: "/blog/hindi-tutor-online-for-kids" },
      { label: "Home tutor vs online tutor", href: "/blog/home-tutor-vs-online-tutor" },
      { label: "Create a free parent account", href: "/parent/signup" },
    ],
  },

  "hindi-tutor-online-for-kids": {
    slug: "hindi-tutor-online-for-kids",
    publishedAt: "2026-10-12",
    updatedAt: "2026-10-12",
    readTimeMinutes: 8,
    author: "Mentr Editorial Team",
    intro:
      "A good online Hindi tutor for kids does one of three jobs, and you should know which one you need before you hire: getting a child through the CBSE or ICSE Hindi syllabus (grammar, comprehension and writing), helping a child from a non-Hindi-speaking home read and speak with confidence, or keeping Hindi alive for children growing up abroad. Online works very well for Hindi from about age 7. Expect ₹300–₹700 an hour from tutors in India, and two or three 45-minute sessions a week.",
    sections: [
      {
        heading: "Which kind of Hindi help does your child need?",
        blocks: [
          {
            type: "table",
            caption: "Three common reasons parents look for a Hindi tutor",
            headers: ["Your situation", "What the tutor should focus on", "Look for"],
            rows: [
              ["CBSE/ICSE student losing marks in Hindi", "Grammar (vyakaran), unseen passages, letter and essay formats, the exam pattern", "A school teacher or tutor who knows your board's current paper"],
              ["Family doesn't speak Hindi at home (for example in Bengaluru, Chennai or Hyderabad)", "Reading Devanagari fluently, vocabulary, speaking without fear", "Patience with beginners, lots of reading aloud"],
              ["Living abroad (UK, US, UAE, Canada)", "Conversation, reading simple stories, connecting with family", "Flexible timings across time zones, playful style"],
            ],
          },
          {
            type: "paragraph",
            text: "Mixing these up is the most common reason Hindi tuition fails. A child in London who needs to chat with grandparents doesn't need CBSE grammar drills, and a Class 9 student facing boards doesn't need storytelling games.",
          },
        ],
      },
      {
        heading: "CBSE Hindi: Course A or Course B?",
        blocks: [
          {
            type: "paragraph",
            text: "In Class 9 and 10, CBSE offers Hindi Course A and Hindi Course B. Course B is designed to be simpler and is common for students who don't use Hindi much at home. Check which course your child's school follows before hiring, because the textbooks and question papers are different, and a tutor should know the exact one.",
          },
          {
            type: "list",
            items: [
              "Grammar is the fastest place to gain marks; it follows rules and rewards practice",
              "Unseen passages need daily reading, even five minutes of a Hindi newspaper or story",
              "Letters, notices and essays have fixed formats. Learn the format once and use it every time",
              "Ask the tutor to work from CBSE sample papers in the last two months before exams",
            ],
          },
          {
            type: "callout",
            title: "Ask in the demo",
            text: "“Which course does this textbook belong to, and what's the marking scheme for the grammar section?” A tutor who answers clearly knows the current paper.",
          },
        ],
      },
      {
        heading: "Hindi for children growing up abroad",
        blocks: [
          {
            type: "paragraph",
            text: "For NRI families, the goal is usually confidence, not exams. Children abroad often understand Hindi but answer in English. The fix is lots of speaking in low-pressure settings: describing their day, retelling a cartoon, playing word games, and reading short illustrated stories in Devanagari.",
          },
          {
            type: "list",
            items: [
              "Pick a time that works in both time zones. UAE is only 1.5 hours behind India, so Indian evening slots work; for the UK and US, weekend mornings are usually easiest",
              "Keep sessions to 30–40 minutes for under-10s",
              "Ask the tutor to speak only Hindi for most of the session, switching to English only when stuck",
              "Involve grandparents: a weekly video call where the child uses what they learned",
            ],
          },
        ],
      },
      {
        heading: "How much does an online Hindi tutor cost?",
        blocks: [
          {
            type: "table",
            caption: "Typical online Hindi tutor fees (2026)",
            headers: ["Type", "Per hour (India)", "Notes"],
            rows: [
              ["Primary classes, reading and speaking", "₹300–₹500", "Two 30–45 min sessions a week"],
              ["CBSE/ICSE Class 6–10 syllabus", "₹400–₹700", "Grammar, writing, board pattern"],
              ["NRI children (tutor in India)", "₹500–₹1,000", "Often charged per 45-minute session; evening/weekend slots"],
            ],
          },
          {
            type: "paragraph",
            text: "Hindi requests posted on Mentr this year have listed budgets from about ₹500 to ₹1,500 an hour, depending on the level and how specialised the help is.",
          },
        ],
      },
      {
        heading: "How to check a Hindi tutor before you pay",
        blocks: [
          {
            type: "list",
            items: [
              "Ask them to read a passage from your child's textbook aloud. Clear pronunciation matters more than degrees",
              "Ask how they'll measure progress after a month (pages read fluently, marks in grammar, speaking time)",
              "Watch how much your child speaks in the demo. A good tutor gets the child talking",
              "Prefer tutors whose profile and identity are verified, and who give you a weekly update",
            ],
          },
        ],
      },
      {
        heading: "Find a Hindi tutor on Mentr",
        blocks: [
          {
            type: "list",
            ordered: true,
            items: [
              "Create a free parent account with your email.",
              "Post your requirement: Hindi, your child's class, online, and your time zone or preferred timings. Say which of the three goals above you need.",
              "Verified tutors send you a pitch. Your contact details stay private on the board.",
              "Book a demo, then connect on WhatsApp once you accept a tutor.",
            ],
          },
          {
            type: "cta",
            title: "Post a Hindi tutor requirement",
            text: "Free for parents in India and abroad. Tutors pitch to you, you choose, and there's no agency fee or commission.",
            label: "Find a Hindi tutor",
            href: "/parent/signup?next=%2Fparent%2Fdashboard%3Fpost%3DHindi",
          },
        ],
      },
    ],
    faqs: [
      {
        question: "Is online Hindi tuition good for kids?",
        answer:
          "Yes, from about age 7. Hindi is mostly reading, speaking and writing practice, which works well on video if sessions are short (30–45 minutes), the tutor checks written work on camera, and the child does a little reading every day.",
      },
      {
        question: "How much does a Hindi tutor charge per hour?",
        answer:
          "In 2026, online Hindi tutors in India typically charge about ₹300–₹500 an hour for primary children and ₹400–₹700 for CBSE or ICSE Class 6–10. Tutors teaching NRI children often charge ₹500–₹1,000 per session.",
      },
      {
        question: "What is the difference between CBSE Hindi Course A and Course B?",
        answer:
          "Both are offered in Class 9 and 10. Course B is designed to be simpler and is often chosen by students who use less Hindi at home. They have different textbooks and question papers, so a tutor should know which one your child's school follows.",
      },
      {
        question: "How can NRI kids learn Hindi?",
        answer:
          "Through regular, low-pressure speaking with a tutor who uses mostly Hindi, short illustrated stories in Devanagari, and real use with family such as weekly calls with grandparents. Two short online sessions a week at a time that fits both time zones work well.",
      },
      {
        question: "How do I improve my child's Hindi grammar for exams?",
        answer:
          "Practise grammar topics one at a time from the board's sample papers, read a short Hindi passage daily for comprehension, and learn fixed formats for letters and essays. A tutor who knows the current marking scheme can speed this up.",
      },
    ],
    relatedLinks: [
      { label: "Online Indian tutors for NRI kids", href: "/blog/online-indian-tutor-for-nri-kids" },
      { label: "Kannada tuition for kids in Bengaluru", href: "/blog/kannada-tuition-for-kids-bengaluru" },
      { label: "How much do online tutors charge in India?", href: "/blog/how-much-do-online-tutors-charge-in-india" },
      { label: "How to find a verified online tutor", href: "/blog/how-to-find-a-verified-online-tutor" },
      { label: "Create a free parent account", href: "/parent/signup" },
    ],
  },
};
