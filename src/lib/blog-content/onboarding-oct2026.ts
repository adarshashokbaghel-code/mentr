import type { ArticleContent } from "./types";

/**
 * Onboarding batch (Oct 2026). Tutor side follows the formats that convert best in our
 * marketing stats (competitor alternatives, getting students); parent side targets gaps
 * with commercial intent (NRI families, primary-class tuition).
 */
export const ONBOARDING_OCT2026: Record<string, ArticleContent> = {
  "how-to-advertise-home-tuition": {
    slug: "how-to-advertise-home-tuition",
    publishedAt: "2026-10-11",
    updatedAt: "2026-10-11",
    readTimeMinutes: 10,
    author: "Mentr Editorial Team",
    intro:
      "The best way to advertise home tuition in 2026 is to combine three things: a strong free online profile parents can find on Google, a short local message that tells people exactly what you teach and where, and word of mouth from the first two or three students you teach really well. Paying for leads or posters comes last, if at all. Below are 12 ideas that actually bring students, what each one costs, and a simple 14-day plan you can start today, whether you're a full-time teacher or a college student teaching in the evenings.",
    sections: [
      {
        heading: "First, decide what you're advertising",
        blocks: [
          {
            type: "paragraph",
            text: "Most tuition ads fail before anyone reads them, because they say “All subjects, all classes, home and online.” A parent looking for a Class 9 CBSE Maths tutor in Kondapur skims straight past that. They stop at “CBSE Class 8–10 Maths, home tuition in Kondapur and Gachibowli, weekday evenings.”",
          },
          {
            type: "paragraph",
            text: "Before you post anything, write one line with five parts: board, classes, subject, area (or “online”), and timing. Use that exact line everywhere: your profile headline, WhatsApp status, society group message and pamphlet. Being specific feels like you'll get fewer enquiries. In practice you get more, because the right parents recognise themselves.",
          },
          {
            type: "callout",
            title: "Your one-line pitch",
            text: "[Board] [Classes] [Subject] — [home tuition in area / online] — [days and time]. Example: “ICSE Class 6–8 Science — home tuition in Andheri West — Mon to Fri, 5–8 pm.”",
          },
        ],
      },
      {
        heading: "12 ways to advertise home tuition (free first)",
        blocks: [
          {
            type: "table",
            caption: "Tuition advertising ideas compared by cost and effort",
            headers: ["Idea", "Cost", "Effort", "Best for"],
            rows: [
              ["Free profile on a tutor platform", "₹0", "1 hour once", "Being found on Google and in search"],
              ["Reply to parent requirements", "₹0", "15 min a day", "Getting your first students fast"],
              ["Apartment / society WhatsApp groups", "₹0", "Low", "Home tuition in your own area"],
              ["Your WhatsApp status and contacts", "₹0", "Low", "First 1–2 students via people you know"],
              ["School gate and parent groups (with permission)", "₹0", "Medium", "Primary and middle school"],
              ["Google Business Profile", "₹0", "1 hour once", "“Tuition near me” searches"],
              ["A free demo class", "1 hour of your time", "Medium", "Turning enquiries into students"],
              ["Referral offer for current parents", "One free class", "Low", "Growing after month one"],
              ["Short teaching clips on Instagram / YouTube", "₹0", "High", "Building trust over months"],
              ["Notice board and pamphlets", "₹300–₹1,500", "Medium", "Dense residential areas"],
              ["Local newspaper inserts", "₹2,000+", "Low", "Older neighbourhoods; mixed results"],
              ["Paid lead or coin platforms", "Varies per lead", "Low", "Volume, if your budget allows"],
            ],
          },
          {
            type: "paragraph",
            text: "Notice the pattern: the cheapest channels are also the ones parents trust most, because they come with a real name, a real profile or a real recommendation. Paid leads are not useless, but when several tutors buy the same lead, you're competing on speed and price from the first call.",
          },
        ],
      },
      {
        heading: "1. Build one profile parents can find and trust",
        blocks: [
          {
            type: "paragraph",
            text: "When a parent hears your name from a neighbour, the next thing they do is look you up. If nothing comes up, you've lost some trust before you've spoken. A free, verified profile on a tutor platform gives them something to check: your subjects, boards, classes, experience, area and fees.",
          },
          {
            type: "list",
            items: [
              "A clear photo of your face, not a logo or a group picture",
              "Your one-line pitch as the headline",
              "Two or three sentences on how you teach, for example “I start every chapter with the NCERT examples, then exam-pattern questions”",
              "Exact areas you travel to, or “online” with your time zone",
              "A fee range, even a rough one. Parents skip profiles with no price signal.",
            ],
          },
          {
            type: "cta",
            title: "List your tuition free on Mentr",
            text: "Create a verified tutor profile in about five minutes. No coins, no lead packs, no commission on your sessions. Parents book a demo and contact you on WhatsApp after you accept.",
            label: "Create my free tutor profile",
            href: "/faculty/signup",
          },
        ],
      },
      {
        heading: "2. Answer parents who are already looking",
        blocks: [
          {
            type: "paragraph",
            text: "Advertising means waiting for someone to notice you. Replying to a requirement means reaching a parent who has already decided to hire this week. That's why it's the fastest way to your first student.",
          },
          {
            type: "paragraph",
            text: "On Mentr's requirements board, parents post what they need (class, board, subject, area, mode), and tutors send a short pitch. On the free plan you can pitch three requirements a day, which is enough if you pick the ones that genuinely match you.",
          },
          {
            type: "list",
            ordered: true,
            items: [
              "Open the board once in the morning and once in the evening; new posts get the most replies in the first few hours.",
              "Only pitch where your board, class and area match. A 30% match wastes one of your three pitches.",
              "Mention the child's actual need: “For Class 7 fractions and decimals, I'd start with a 30-minute diagnostic in the demo.”",
              "Give your availability in the same message so the parent doesn't have to ask.",
            ],
          },
        ],
      },
      {
        heading: "3. Use local WhatsApp groups without being spammy",
        blocks: [
          {
            type: "paragraph",
            text: "Society and neighbourhood groups work extremely well for home tuition because distance matters so much to parents. They also punish spam quickly. Post once, keep it short and useful, and never repeat it daily.",
          },
          {
            type: "code",
            code: "Hi everyone, I'm Priya from Tower C 🙂\nI teach CBSE Class 6–10 Maths at home, weekday evenings (5–8 pm).\nM.Sc. Maths, 4 years of teaching. First class is a free demo.\nMy profile with details: mentr.in/teachers/your-profile-id\nHappy to answer any questions on DM.",
          },
          {
            type: "paragraph",
            text: "The link to a profile does a lot of work here. It turns “someone posted in the group” into “a verified teacher with a full profile,” and parents can share it with their spouse before they message you.",
          },
        ],
      },
      {
        heading: "4. Make the demo class your best advertisement",
        blocks: [
          {
            type: "paragraph",
            text: "Most tutors lose students at the demo, not at the advert. A good demo is not a mini-lecture. It shows the parent that you understood their child in 45 minutes.",
          },
          {
            type: "list",
            items: [
              "Ask for the last test paper or notebook before the demo",
              "Spend the first 10 minutes finding one specific gap",
              "Fix that gap in front of the parent, then give two practice questions",
              "End with a plan in one sentence: “Twice a week, starting with fractions, test on the 15th.”",
            ],
          },
          {
            type: "callout",
            title: "Why this works",
            text: "Parents don't buy hours of tuition. They buy confidence that marks will improve. A demo that names a problem and a plan sells far better than one that covers a whole chapter.",
          },
        ],
      },
      {
        heading: "5. Turn your first three students into ten",
        blocks: [
          {
            type: "paragraph",
            text: "Word of mouth is still the biggest source of home tuition in India, but it doesn't happen by itself. After the first month, send each parent a short progress note: what improved, what's next. Then ask simply: “If you know anyone who needs help with Maths, I have two evening slots open.”",
          },
          {
            type: "paragraph",
            text: "A small referral offer, such as one free class for the referring family, works well, but the progress note is what makes parents comfortable recommending you.",
          },
        ],
      },
      {
        heading: "A 14-day plan to get your first students",
        blocks: [
          {
            type: "table",
            caption: "Two-week plan for a new home tutor",
            headers: ["Days", "What to do"],
            rows: [
              ["Day 1", "Write your one-line pitch. Create your free verified profile with photo, subjects, areas and fee range."],
              ["Days 2–3", "Post once in two or three local WhatsApp groups with your profile link. Update your WhatsApp status."],
              ["Days 2–14", "Check the requirements board twice a day; send up to three well-matched pitches daily."],
              ["Day 4", "Create a free Google Business Profile with your area and timings."],
              ["Days 5–14", "Run every demo with the diagnose → fix → plan structure."],
              ["Day 14", "Review: which channel brought enquiries? Do more of that, and drop what didn't work."],
            ],
          },
        ],
      },
      {
        heading: "Mistakes that quietly kill tuition enquiries",
        blocks: [
          {
            type: "list",
            items: [
              "Listing every subject and class. It reads as “not really an expert in any.”",
              "No fee range at all. Many parents won't message to ask.",
              "Replying hours late. The first good reply usually wins.",
              "Asking for advance fees before a demo. It worries first-time parents.",
              "Copy-pasting the same pitch to every requirement",
            ],
          },
        ],
      },
    ],
    faqs: [
      {
        question: "What is the best way to advertise home tuition for free?",
        answer:
          "Create a free, verified profile on a tutor platform so parents can find and check you, reply to parent requirements that match your subject and area, and post once in local society WhatsApp groups with a link to your profile. These three cost nothing and bring the most trusted enquiries.",
      },
      {
        question: "How do I get my first tuition student quickly?",
        answer:
          "Reply to parents who have already posted a requirement instead of waiting for people to find your advert. On Mentr's requirements board you can pitch free, up to three requirements a day on the free plan. Pick close matches and mention the child's specific need in your message.",
      },
      {
        question: "What should I write in a home tuition advertisement?",
        answer:
          "Board, classes, subject, area (or online) and timing in one line, followed by your qualification, years of experience and whether the first class is a free demo. Add a link to your profile so parents can see more without calling.",
      },
      {
        question: "Do pamphlets still work for home tuition?",
        answer:
          "They can in dense residential areas, but they're slower and cost money. Add a QR code to your online profile so people can check you before calling. Online profiles and local WhatsApp groups usually bring enquiries faster.",
      },
      {
        question: "Should I pay for tuition leads?",
        answer:
          "It's optional. Paid leads are often shared with several tutors, so you compete on speed and price. Start with free channels; if you later want more reach, compare the cost per lead with how many leads actually became students.",
      },
    ],
    relatedLinks: [
      { label: "List your tuition free", href: "/faculty/signup" },
      { label: "Home tuition jobs near me", href: "/blog/home-tuition-jobs-near-me" },
      { label: "How to write a tutor profile", href: "/blog/how-to-write-tutor-profile" },
      { label: "How to price tutoring sessions", href: "/blog/how-to-price-tutoring-sessions" },
      { label: "UrbanPro alternatives for tutors", href: "/blog/urbanpro-alternatives" },
    ],
  },

  "home-tuition-jobs-near-me": {
    slug: "home-tuition-jobs-near-me",
    publishedAt: "2026-10-11",
    updatedAt: "2026-10-11",
    readTimeMinutes: 9,
    author: "Mentr Editorial Team",
    intro:
      "To find home tuition jobs near you in 2026, list yourself free on a tutor platform where parents post requirements, reply to the ones in your area within a few hours, and tell your own neighbourhood that you teach. You don't need to register with an agency that keeps a share of your fees. This guide covers where real home tuition jobs come from, what they pay by class, how college students can start part-time, and what to check before you accept one.",
    sections: [
      {
        heading: "Where home tuition jobs actually come from",
        blocks: [
          {
            type: "paragraph",
            text: "Behind every “tuition job” is a parent who wants help for one child, usually urgently, because a test went badly or the board year is starting. Those parents find tutors in four places, and you want to be visible in all of them.",
          },
          {
            type: "table",
            caption: "Sources of home tuition jobs compared",
            headers: ["Source", "What it costs you", "Speed", "Watch out for"],
            rows: [
              ["Free tutor platforms with a requirements board", "₹0", "Fast", "Reply quickly; good posts fill within a day"],
              ["Word of mouth and society groups", "₹0", "Medium", "Needs your first few students first"],
              ["Tuition agencies / bureaus", "Often a month's fee or 15–30% ongoing", "Fast", "Registration fees, and you rarely own the relationship"],
              ["Paid lead / coin platforms", "Per lead", "Fast", "The same lead often goes to several tutors"],
            ],
          },
        ],
      },
      {
        heading: "How to find home tuition jobs near you, step by step",
        blocks: [
          {
            type: "list",
            ordered: true,
            items: [
              "Create a free tutor profile with your exact areas, for example “Kothrud, Karve Nagar, Warje”, not just “Pune”.",
              "Add boards and classes you're genuinely strong in. Parents filter by these first.",
              "Check the requirements board twice a day and reply to matches in your area.",
              "Keep your phone and WhatsApp ready; most parents decide within 24–48 hours.",
              "Offer one demo class, then agree fees, days and a start date in writing on WhatsApp.",
            ],
          },
          {
            type: "cta",
            title: "See parent requirements near you",
            text: "Mentr is free for tutors: list your profile, see requirements from parents and pitch for free. No coins and no commission on your sessions.",
            label: "Find tuition jobs on Mentr",
            href: "/online-tutor-jobs",
          },
        ],
      },
      {
        heading: "How much do home tuition jobs pay in 2026?",
        blocks: [
          {
            type: "paragraph",
            text: "Fees vary by city, area, board and your experience, but these hourly ranges for one-on-one home tuition are a fair starting point in Indian metros. Tier-2 cities are usually 20–40% lower.",
          },
          {
            type: "table",
            caption: "Typical home tuition fees per hour in Indian metros (2026)",
            headers: ["Level", "Typical range per hour", "Notes"],
            rows: [
              ["Classes 1–5", "₹400–₹700", "Homework help, reading, basic maths"],
              ["Classes 6–8", "₹500–₹850", "Maths and Science most in demand"],
              ["Classes 9–10 (board)", "₹800–₹1,200", "CBSE/ICSE board focus pays more"],
              ["Classes 11–12", "₹1,000–₹1,800", "Physics, Chemistry, Maths, Accounts"],
              ["JEE / NEET", "₹1,200–₹2,500+", "Depends heavily on results and reputation"],
            ],
          },
          {
            type: "paragraph",
            text: "Monthly packages are common: for example, 8 or 12 sessions a month paid at the start of the month. Agree on what happens when a class is cancelled by either side before you begin.",
          },
        ],
      },
      {
        heading: "Part-time home tuition for college students",
        blocks: [
          {
            type: "paragraph",
            text: "Home tuition is one of the best part-time jobs for college students: flexible evening hours, good pay per hour, and real teaching experience you can put on your CV. Parents are happy to hire college students for Classes 1–8, especially engineering, science and commerce students who scored well in their own boards.",
          },
          {
            type: "list",
            items: [
              "Mention your own board marks in the subject, for example “95 in CBSE Class 12 Maths”",
              "Start with classes two or more years below your comfort level",
              "Keep to two or three students in exam months so your own studies don't suffer",
              "Online tuition removes travel time, which helps on busy college days",
            ],
          },
          {
            type: "callout",
            title: "Teaching beyond school subjects",
            text: "If you're strong in coding, spoken English or a skill like music, you can also list as a mentor. Mentr has tutors and mentors on the same platform, for school subjects and skills.",
          },
        ],
      },
      {
        heading: "Before you accept a home tuition job: a safety and money checklist",
        blocks: [
          {
            type: "list",
            items: [
              "Confirm class, board, subject, address and timings in writing on WhatsApp",
              "Agree the fee, the payment date and the cancellation rule before the first paid class",
              "For the first visit, tell someone where you're going",
              "Never pay a “registration fee” to a stranger who promises you students",
              "Prefer platforms where parent contact is shared only after both sides agree",
            ],
          },
        ],
      },
      {
        heading: "Why tutors are moving away from paid leads",
        blocks: [
          {
            type: "paragraph",
            text: "Paying per lead made sense when there was no other way to reach parents. Today it often means paying to compete: the same requirement is sold to several tutors, and the parent picks the cheapest or fastest reply. Many tutors now list on free platforms first and use paid options only if they need extra volume.",
          },
          {
            type: "paragraph",
            text: "On Mentr, listing, receiving demo requests and pitching are free. There's an optional Premium plan for tutors who want unlimited pitches and featured placement, but you never pay a commission on what parents pay you.",
          },
        ],
      },
    ],
    faqs: [
      {
        question: "How can I find home tuition jobs near me?",
        answer:
          "List yourself free on a tutor platform with a requirements board, add the exact areas you can travel to, and reply quickly to parents who post in those areas. Also tell your own society and neighbourhood groups that you teach, with a link to your profile.",
      },
      {
        question: "Are there home tuition jobs without paying a registration fee?",
        answer:
          "Yes. On Mentr, tutors list, see parent requirements and pitch free. Be cautious of anyone asking for an upfront registration fee in exchange for promised students.",
      },
      {
        question: "Can college students do home tuition jobs?",
        answer:
          "Yes. Parents regularly hire college students for Classes 1–8, and for Classes 9–10 when the student has strong board marks in the subject. Evening timings and online tuition make it easy to fit around college.",
      },
      {
        question: "How much should I charge for home tuition?",
        answer:
          "In Indian metros in 2026, one-on-one home tuition commonly ranges from about ₹400–₹700 per hour for Classes 1–5 to ₹800–₹1,200 for board classes, and more for Class 11–12 and entrance prep. Adjust for your city, area and experience.",
      },
      {
        question: "Is online tuition better than home tuition for tutors?",
        answer:
          "Online saves travel time and lets you teach students in other cities and countries. Home tuition often pays slightly more for younger classes and is easier to win locally. Many tutors do both.",
      },
    ],
    relatedLinks: [
      { label: "Find tuition jobs on Mentr", href: "/online-tutor-jobs" },
      { label: "How to advertise home tuition", href: "/blog/how-to-advertise-home-tuition" },
      { label: "Online tutor jobs from home", href: "/blog/online-tutor-jobs-from-home" },
      { label: "How to become a home tutor in India", href: "/blog/how-to-become-a-home-tutor-india" },
      { label: "Tuition agency commission explained", href: "/blog/tuition-agency-commission-india" },
    ],
  },

  "online-indian-tutor-for-nri-kids": {
    slug: "online-indian-tutor-for-nri-kids",
    publishedAt: "2026-10-11",
    updatedAt: "2026-10-11",
    readTimeMinutes: 9,
    author: "Mentr Editorial Team",
    intro:
      "If you live in the UK, US, Canada, Australia or the Gulf and want an Indian tutor for your child, an online tutor based in India is often the best fit: they know CBSE and ICSE well, can teach Hindi or another Indian language, and usually cost far less than local tutoring. The keys are matching the right board or curriculum, agreeing a time that works across time zones, and checking the tutor properly before you pay. This guide walks through all three.",
    sections: [
      {
        heading: "Why NRI families look for Indian tutors online",
        blocks: [
          {
            type: "list",
            items: [
              "Children in CBSE schools abroad (common in the UAE, Saudi Arabia, Qatar and Kuwait) need tutors who know the exact NCERT pattern",
              "Families planning to move back to India want their child to stay on track with the Indian syllabus",
              "Parents want their children to read and speak Hindi, Tamil, Telugu, Malayalam, Gujarati or another home language",
              "Maths taught the Indian way, with more practice and earlier topics, alongside the local school",
              "Local tutoring in London, New York or Toronto can cost several times more per hour",
            ],
          },
        ],
      },
      {
        heading: "Match the curriculum first, then the tutor",
        blocks: [
          {
            type: "paragraph",
            text: "“Maths tutor” is not enough. A tutor who is excellent for CBSE Class 8 may not know what a Year 9 GCSE student in the UK needs. Write down your child's exact curriculum before you search.",
          },
          {
            type: "table",
            caption: "What to ask for, by your child's curriculum",
            headers: ["Your child follows", "Ask for", "Good to confirm"],
            rows: [
              ["CBSE school abroad (UAE, Gulf, others)", "CBSE tutor for that class and subject", "Uses NCERT books and CBSE sample papers"],
              ["ICSE / ISC", "ICSE specialist", "Familiar with Selina / Frank textbooks"],
              ["UK national curriculum, GCSE, A-level", "Tutor with GCSE or A-level experience", "Knows the exam board (AQA, Edexcel, OCR)"],
              ["US Common Core, SAT", "Tutor who has taught US students", "Comfortable with US terms and grade levels"],
              ["IB / IGCSE", "IB or IGCSE experience", "Knows internal assessments and grading"],
              ["Indian language for heritage learners", "Language tutor for children", "Teaches reading and writing, not just conversation"],
            ],
          },
        ],
      },
      {
        heading: "Making time zones work",
        blocks: [
          {
            type: "paragraph",
            text: "Time zones sound like the hardest part, but they're usually the easiest to solve. Many tutors in India teach early mornings and late evenings precisely because of overseas students.",
          },
          {
            type: "table",
            caption: "Example session times that work for India-based tutors",
            headers: ["Where you live", "Your child's time", "Tutor's time (IST)"],
            rows: [
              ["UAE / Gulf", "5:00 pm", "6:30–7:30 pm"],
              ["UK (BST)", "5:00 pm", "9:30 pm"],
              ["UK (weekend morning)", "10:00 am Saturday", "2:30 pm Saturday"],
              ["US East Coast (EDT)", "7:30 am before school, or weekends", "5:00 pm"],
              ["Canada / US weekends", "9:00 am Saturday", "6:30–9:30 pm Saturday"],
              ["Australia (AEST)", "4:30 pm", "12:00 noon"],
            ],
          },
          {
            type: "callout",
            title: "Check daylight saving",
            text: "The UK, Europe, the US, Canada and most of Australia change their clocks twice a year; India doesn't. Agree session times in IST, and confirm the new local time whenever the clocks change.",
          },
        ],
      },
      {
        heading: "How much does an online Indian tutor cost?",
        blocks: [
          {
            type: "paragraph",
            text: "Tutors set their own fees, and international rates are usually agreed directly. As a rough guide, many India-based tutors charge international families somewhere between what they charge in India and local rates abroad. For school subjects that is often roughly US$10–25 an hour, and more for specialist board-exam or competitive-exam teaching. Agree the currency, the payment method and the cancellation rule in writing before the first paid class.",
          },
        ],
      },
      {
        heading: "How to check an online tutor before you pay",
        blocks: [
          {
            type: "list",
            ordered: true,
            items: [
              "Read the full profile: subjects, boards, classes, experience and teaching style",
              "Prefer platforms that verify identity before a profile goes live",
              "Book a demo class and stay in the room, or in earshot, for it",
              "Ask how they'll share progress: weekly notes, test scores or a short call",
              "Keep the first paid commitment small, for example 4–8 classes, before a longer package",
            ],
          },
          {
            type: "paragraph",
            text: "On Mentr, you can browse verified tutor profiles without logging in, book a demo, and contact the tutor on WhatsApp once they accept. Your number isn't shown to tutors you haven't chosen.",
          },
          {
            type: "cta",
            title: "Find a verified online tutor from India",
            text: "Free for parents worldwide. Search by subject, class and board, book a demo, and connect on WhatsApp after the tutor accepts. No agency fee, no commission.",
            label: "Find a tutor",
            href: "/find-tutor",
          },
        ],
      },
      {
        heading: "Making online classes work for younger children",
        blocks: [
          {
            type: "list",
            items: [
              "Laptop or tablet rather than a phone, with a headset if there's background noise",
              "A quiet table with notebook and pencil; the tutor should ask to see written work",
              "30–45 minute sessions for under-10s, 60 minutes for older children",
              "Two sessions a week usually beats one long one",
              "A shared document or notebook photo for homework between classes",
            ],
          },
          {
            type: "paragraph",
            text: "For children in Class 3–5, Mentr Learn adds free short coding, AI and maths lessons that need no typing. It's a useful extra between tutoring sessions, wherever you live.",
          },
        ],
      },
    ],
    faqs: [
      {
        question: "Can I hire an Indian tutor online for my child in the UK or US?",
        answer:
          "Yes. Many India-based tutors teach students abroad online, often in early-morning or late-evening IST slots that match UK, US and Canadian after-school hours or weekends. Match the tutor to your child's curriculum, such as CBSE, GCSE or US Common Core, and book a demo first.",
      },
      {
        question: "How do I find a CBSE tutor online for my child in the UAE?",
        answer:
          "Search for a CBSE tutor for your child's class and subject, confirm they use NCERT books and CBSE sample papers, and book a demo. The UAE is only 1.5 hours behind India, so normal evening slots work well. On Mentr, searching and booking a demo are free.",
      },
      {
        question: "How much does an online tutor from India cost for NRI families?",
        answer:
          "Tutors set their own fees. For school subjects, many charge international families roughly US$10–25 per hour, with specialist and exam-prep teaching costing more. Agree currency, payment method and cancellation rules in writing.",
      },
      {
        question: "Can an online tutor teach my child Hindi or another Indian language?",
        answer:
          "Yes. Look for tutors who teach children specifically and who cover reading and writing as well as speaking. Ask how they'll keep a younger child engaged online: songs, stories and short writing tasks work better than long grammar lessons.",
      },
      {
        question: "Is it safe for my child to take online classes with a tutor from India?",
        answer:
          "Choose a verified profile, book a demo, stay nearby during early sessions, and use platforms where contact details are shared only after both sides agree. Keep sessions in a shared space at home rather than a bedroom.",
      },
    ],
    relatedLinks: [
      { label: "Find a verified tutor", href: "/find-tutor" },
      { label: "Verified CBSE tutors in the UAE", href: "/blog/verified-online-tutors-uae-cbse" },
      { label: "Find a mentor in any country", href: "/blog/find-mentor-online-any-country" },
      { label: "Online tutoring safety for kids", href: "/blog/online-tutoring-safety-kids" },
      { label: "How parents evaluate a trial session", href: "/blog/how-parents-evaluate-tutor-trial-session" },
    ],
  },

  "tuition-for-class-1-to-5": {
    slug: "tuition-for-class-1-to-5",
    publishedAt: "2026-10-11",
    updatedAt: "2026-10-11",
    readTimeMinutes: 9,
    author: "Mentr Editorial Team",
    intro:
      "Most children in Class 1–5 don't need daily tuition. What they need is help with one specific gap, usually reading, handwriting, times tables or homework habits, for a few months, from someone patient. Tuition makes sense when that gap isn't closing at home. If you do hire, a home tutor or online tutor for primary classes typically costs ₹400–₹700 an hour in Indian metros, and two or three short sessions a week is plenty. Here's how to decide, what to look for and how to avoid paying for tuition your child doesn't need.",
    sections: [
      {
        heading: "Does your child actually need tuition in Class 1–5?",
        blocks: [
          {
            type: "paragraph",
            text: "At this age, a single bad test isn't a reason to hire a tutor. A pattern is. Watch for a few weeks and see whether the same problem keeps showing up.",
          },
          {
            type: "table",
            caption: "Signs tuition may help, and what to try first",
            headers: ["What you notice", "Try first at home", "Consider a tutor if"],
            rows: [
              ["Reads slowly or avoids reading", "10 minutes of reading aloud together daily", "No progress after 6–8 weeks"],
              ["Makes the same maths mistakes", "Practise one concept with real objects or money", "They still can't explain how they got an answer"],
              ["Homework takes hours and ends in tears", "Fixed time, short breaks, no phone nearby", "Every evening is a fight and you're both exhausted"],
              ["Teacher raises the same concern twice", "Ask for one specific thing to practise", "The gap is growing term to term"],
              ["Both parents work late", "A homework routine with a grandparent or sibling", "No adult is available for homework most days"],
            ],
          },
          {
            type: "callout",
            title: "A good rule of thumb",
            text: "Hire tuition for a goal, not for “all subjects.” “Read Class 3 English fluently by March” or “know times tables up to 12” gives the tutor, the child and you a finish line.",
          },
        ],
      },
      {
        heading: "Home tutor or online tutor for primary classes?",
        blocks: [
          {
            type: "table",
            caption: "Home vs online tuition for Class 1–5",
            headers: ["", "Home tutor", "Online tutor"],
            rows: [
              ["Best for", "Class 1–3, handwriting, very young children", "Class 3–5, reading, maths practice, languages"],
              ["Attention span", "Easier to keep a 6-year-old focused in person", "Works well in 30–45 minute sessions"],
              ["Choice of tutors", "Limited to your area", "Much wider; you can pick the best fit"],
              ["Cost", "Usually a little higher, with travel", "Often a little lower"],
              ["Parent involvement", "Tutor comes to you", "An adult nearby helps, especially at first"],
            ],
          },
          {
            type: "paragraph",
            text: "For Class 1–2, a home tutor is usually easier because so much of the work is writing and hands-on practice. From Class 3 onwards, online works well for many children, as long as sessions are short and the tutor asks to see written work.",
          },
        ],
      },
      {
        heading: "How much does tuition for Class 1–5 cost in 2026?",
        blocks: [
          {
            type: "table",
            caption: "Typical primary tuition fees (2026)",
            headers: ["Type", "Metro cities", "Tier-2 cities"],
            rows: [
              ["One-on-one home tuition, per hour", "₹400–₹700", "₹250–₹500"],
              ["One-on-one online tuition, per hour", "₹350–₹650", "₹250–₹450"],
              ["Monthly, 3 sessions a week (home)", "₹4,500–₹8,000", "₹3,000–₹5,500"],
              ["Small group (3–5 children)", "₹1,500–₹3,500 per child per month", "₹1,000–₹2,500 per child per month"],
            ],
          },
          {
            type: "paragraph",
            text: "Agencies sometimes add a fee on top of the tutor's rate. When you connect directly with the tutor, you pay only what you agree with them.",
          },
        ],
      },
      {
        heading: "What makes a good primary-class tutor",
        blocks: [
          {
            type: "paragraph",
            text: "A brilliant Class 12 Physics teacher isn't automatically good with an 8-year-old. For primary classes, patience and method matter more than degrees.",
          },
          {
            type: "list",
            items: [
              "Has taught this age group before and enjoys it",
              "Knows your board's textbook: CBSE (NCERT), ICSE or your state board",
              "Uses objects, drawings and games for maths, not just worksheets",
              "Listens to your child read aloud, rather than only reading to them",
              "Gives you a two-line update after each week",
              "Keeps homework short; primary children need play time too",
            ],
          },
          {
            type: "paragraph",
            text: "In the demo class, watch how the tutor reacts when your child gets something wrong. Calm, curious questions (“How did you get that?”) are a very good sign. Impatience in the first session rarely improves later.",
          },
        ],
      },
      {
        heading: "How to find a tutor for Class 1–5 on Mentr",
        blocks: [
          {
            type: "list",
            ordered: true,
            items: [
              "Search by class, subject and area, or choose online",
              "Read profiles: experience with young children, board, fees and timings",
              "Book a free demo with one or two tutors",
              "Connect on WhatsApp after the tutor accepts. Your number stays private until then.",
              "Start with a month and a clear goal, then review",
            ],
          },
          {
            type: "cta",
            title: "Find a primary-class tutor near you",
            text: "Browse verified tutors for Class 1–5 free, at home or online. Book a demo, and connect on WhatsApp after the tutor accepts. No agency fee, no commission.",
            label: "Find a tutor",
            href: "/find-tutor",
          },
        ],
      },
      {
        heading: "A free extra for Class 3–5",
        blocks: [
          {
            type: "paragraph",
            text: "Not every gap needs paid tuition. For Class 3–5, Mentr Learn offers free, short lessons in coding, AI and maths, with narrated videos and block coding that needs no typing. It's a good way to build logical thinking alongside school, and it costs nothing.",
          },
          {
            type: "cta",
            title: "Try Mentr Learn for Class 3–5",
            text: "Free coding, AI and maths for primary-school children. Parent email only, no card.",
            label: "Start Mentr Learn",
            href: "/learn",
          },
        ],
      },
    ],
    faqs: [
      {
        question: "Is tuition necessary for Class 1 to 5?",
        answer:
          "Usually not every day. Tuition helps when a specific gap, such as reading, handwriting, maths facts or homework habits, isn't improving at home after a few weeks. Hire for a clear goal and review after one or two months.",
      },
      {
        question: "What is the fee for home tuition for Class 1–5?",
        answer:
          "In Indian metro cities in 2026, one-on-one home tuition for primary classes typically costs about ₹400–₹700 per hour, or ₹4,500–₹8,000 a month for three sessions a week. Tier-2 cities are usually lower.",
      },
      {
        question: "Is online tuition good for primary school children?",
        answer:
          "From Class 3 onwards, often yes, if sessions are short (30–45 minutes), an adult is nearby at first, and the tutor checks written work. For Class 1–2, home tuition is usually easier because of handwriting and attention span.",
      },
      {
        question: "How many days a week should a Class 3 child have tuition?",
        answer:
          "Two or three short sessions a week is enough for most children. Daily tuition at this age often leaves no time for play, reading for fun and rest, which matter just as much for learning.",
      },
      {
        question: "How do I choose a tutor for my child in primary school?",
        answer:
          "Look for experience with young children, knowledge of your board's textbook, and a patient, hands-on teaching style. Book a demo and watch how the tutor responds when your child makes a mistake.",
      },
    ],
    relatedLinks: [
      { label: "Find a tutor", href: "/find-tutor" },
      { label: "Signs your child needs a tutor", href: "/blog/signs-child-needs-tutor" },
      { label: "Home tutor vs online tutor", href: "/blog/home-tutor-vs-online-tutor" },
      { label: "How much does a private tutor cost?", href: "/blog/how-much-does-a-private-tutor-cost" },
      { label: "Mentr Learn for Class 3–5", href: "/learn" },
    ],
  },
};
