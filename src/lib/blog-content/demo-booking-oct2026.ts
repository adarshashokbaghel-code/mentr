import type { ArticleContent } from "./types";

const SEARCH = "/search";
const SIGNUP = "/parent/signup";

export const DEMO_BOOKING_OCT2026: Record<string, ArticleContent> = {
  "book-a-demo-class-with-a-tutor-india": {
    slug: "book-a-demo-class-with-a-tutor-india",
    publishedAt: "2026-10-06",
    updatedAt: "2026-10-06",
    readTimeMinutes: 9,
    author: "Mentr Editorial Team",
    intro:
      "To book a demo class with a tutor in India, pick a verified profile, send the subject, class, board, and a time that works, and wait for that tutor to confirm. On Mentr the form is for an online demo. The tutor sees your name and phone as soon as you send it, and you can follow Waiting, Accepted, or Declined on your parent dashboard. You do not pay Mentr to book, and you do not agree a monthly fee until you have actually spoken.",
    sections: [
      {
        heading: "What parents usually mean by a demo class",
        blocks: [
          {
            type: "paragraph",
            text: "A demo is one short class so you and your child can see if this person can teach this subject. It is not a package, not a registration, and not a promise to continue. Most useful demos last 30 to 45 minutes and stay on one chapter your child is stuck on, instead of a speech about the tutor’s experience.",
          },
          {
            type: "paragraph",
            text: "Parents search for this after a unit test, a PTM, or a Sunday-night WhatsApp thread where three neighbours have forwarded numbers and nobody has said the fee. Booking a demo is the calm version of that: one tutor, one time, one topic.",
          },
          {
            type: "callout",
            title: "Online demo",
            text: "The Book a demo form on Mentr is for an online session. If you later want classes at home, say so in the note and sort the place with the tutor after they reply. Do not treat the form as a home-visit booking.",
          },
        ],
      },
      {
        heading: "Have these five things ready before you tap the button",
        blocks: [
          {
            type: "list",
            ordered: true,
            items: [
              "Subject — the one that is actually weak, not “all subjects”.",
              "Class — Class 8 is not the same job as Class 11.",
              "Board — CBSE, ICSE, a state board, IGCSE, or IB. Say it. Tutors plan the hour differently.",
              "A real time — a slot when your child is home and not in school or coaching.",
              "One sentence on the gap — “quadrilaterals, she freezes on proofs” is more useful than “needs improvement”.",
            ],
          },
          {
            type: "paragraph",
            text: "If you only know the school’s complaint and not the chapter, open the last answer sheet for two minutes before you book. A tutor who receives “Class 9 Physics, motion graphs, Thursday 6 pm” can prepare. A tutor who receives “tuition needed” cannot.",
          },
        ],
      },
      {
        heading: "How to book the demo on Mentr",
        blocks: [
          {
            type: "list",
            ordered: true,
            items: [
              "Search for the subject and class. You can browse without an account.",
              "Open a tutor who teaches that level. Check the board, the languages, and the indicative hourly rate on the card.",
              "Tap Book a demo. If you are not logged in as a parent, create a free parent account and come back to the same profile.",
              "Fill subject, class, board, date, and time. Add a note if you want them to cover a specific chapter.",
              "Read the line that says your phone number will be visible to this tutor, then send.",
            ],
          },
          {
            type: "paragraph",
            text: "That last line is deliberate. The tutor needs a number to confirm the slot. It goes to that tutor only, at the moment you send the form. It is not posted on a public board, and it is not sold as a lead.",
          },
          {
            type: "cta",
            title: "Book a demo with a tutor near you or online",
            text: "Search verified tutors by subject and class. The demo form takes a few minutes. Mentr does not charge a booking fee.",
            label: "Find a tutor",
            href: SEARCH,
          },
        ],
      },
      {
        heading: "What the tutor receives, so you are not guessing",
        blocks: [
          {
            type: "paragraph",
            text: "The tutor gets an email with your name, phone, subject, class, the time you picked, and your note. The same request appears in their Mentr inbox labelled Demo request. They can accept, decline, or reply with a note, and they can message you on WhatsApp to fix the exact link and timing.",
          },
          {
            type: "paragraph",
            text: "You do not need to chase them on a second app to “register interest”. If they accept, your dashboard moves from Waiting to Accepted. If they decline, it says Declined and you book someone else. A silence is still Waiting — give it a day, then book a second tutor rather than sending the same request five times.",
          },
          {
            type: "table",
            caption: "Three ways to reach a tutor on Mentr",
            headers: ["What you do", "Best when", "What the tutor gets"],
            rows: [
              [
                "Book a demo",
                "You have a tutor in mind and want one online class",
                "Your name, phone, subject, class, and time, immediately",
              ],
              [
                "Connect",
                "You want to chat first and unlock their WhatsApp after they accept",
                "Your message. Their number stays hidden until they accept",
              ],
              [
                "Post a requirement",
                "You would rather tutors come to you",
                "A pitch on your post. You accept the one you want",
              ],
            ],
          },
        ],
      },
      {
        heading: "How to spend the demo so it is not small talk",
        blocks: [
          {
            type: "list",
            items: [
              "Ask them to teach one chapter, not to introduce their whole career.",
              "Let your child answer. If only you talk, you have learnt nothing about the fit.",
              "Watch whether they notice a wrong step and correct it, or just move on.",
              "Ask what the next four classes would cover if you continue.",
              "Ask the fee for the regular slot, the duration, and whether it is online or at home. The rate on the profile is indicative.",
            ],
          },
          {
            type: "paragraph",
            text: "A good sign is a child who asks a question without being prompted. A weak sign is a tutor who spends twenty minutes on their results and five minutes on the chapter. You can walk away after one demo. That is the point of booking it.",
          },
          {
            type: "paragraph",
            text: "There is a separate checklist for judging the class itself: what to watch, what to ask your child afterwards, and when to stop. Use that after the hour, not instead of booking it.",
          },
        ],
      },
      {
        heading: "Money, in one paragraph",
        blocks: [
          {
            type: "paragraph",
            text: "Mentr does not take a commission on the demo or on later classes. You and the tutor agree the fee. Pay the tutor directly. If someone asks you to pay a “registration” or “demo charge” to Mentr, that is not how this works — close the chat and book through the site.",
          },
          {
            type: "cta",
            title: "Create a free parent account, then book",
            text: "You can browse first. You need a parent login to send the demo, because the tutor has to know who is booking.",
            label: "Parent signup",
            href: SIGNUP,
          },
        ],
      },
    ],
    faqs: [
      {
        question: "How do I book a demo class with a tutor online?",
        answer:
          "Search for a tutor on Mentr, open their profile, and tap Book a demo. Enter the subject, class, board, date, and time, plus a note if you want. The tutor receives your name and phone and can confirm the online session.",
      },
      {
        question: "Is booking a tutor demo free?",
        answer:
          "Yes. Mentr does not charge parents to book a demo or to connect. Any class fee is between you and the tutor, agreed after you talk.",
      },
      {
        question: "Will the tutor see my phone number if I book a demo?",
        answer:
          "Yes. The form tells you this before you send. That tutor sees your number immediately so they can confirm the slot. It is not shown to every tutor on the site.",
      },
      {
        question: "Can I book a home demo through the same form?",
        answer:
          "The form books an online demo. Mention in the note if you want later classes at home, and arrange that with the tutor after they reply.",
      },
      {
        question: "What if the tutor does not reply?",
        answer:
          "The request stays as Waiting on your dashboard. If a day passes with no reply, book a demo with another tutor who teaches the same class. You can also post a requirement so several tutors pitch you.",
      },
      {
        question: "How is Book a demo different from Connect?",
        answer:
          "Book a demo asks for a specific online class and shares your number with that tutor at once. Connect sends a message and unlocks the tutor’s WhatsApp only after they accept.",
      },
    ],
    relatedLinks: [
      { label: "Search tutors and book a demo", href: SEARCH },
      { label: "Create a free parent account", href: SIGNUP },
      {
        label: "Book a mentor for the first session",
        href: "/blog/book-a-mentor-for-your-child",
      },
      {
        label: "How to judge a trial class",
        href: "/blog/how-parents-evaluate-tutor-trial-session",
      },
      {
        label: "Post a requirement instead",
        href: "/blog/how-to-post-tutor-requirement",
      },
    ],
  },

  "book-a-mentor-for-your-child": {
    slug: "book-a-mentor-for-your-child",
    publishedAt: "2026-10-06",
    updatedAt: "2026-10-06",
    readTimeMinutes: 9,
    author: "Mentr Editorial Team",
    intro:
      "To book a mentor for your child, decide whether you need someone to teach one subject or someone to steady the whole term, then book one online demo with a clear chapter and a clear time. A mentor is not a more expensive word for a tutor. Use it when your child needs a plan, not only a solved exercise. On Mentr you book that first session from the mentor’s profile. They get your number and the note you wrote, and you track the reply under Demos.",
    sections: [
      {
        heading: "Tutor or mentor: pick the word that matches the problem",
        blocks: [
          {
            type: "paragraph",
            text: "Hire a subject tutor when the hole is specific. Class 7 fractions. Class 10 carbon compounds. Class 12 integration. Hire a mentor when the child understands pieces and still cannot hold a week together: homework piles up, the wrong chapters get revised, or the board year has started and nobody has a calendar.",
          },
          {
            type: "list",
            items: [
              "Subject tutor — one syllabus, regular practice, a fee per hour.",
              "Mentor — the same teaching, plus a short plan: what to finish this fortnight, what to leave, and how you will know it worked.",
              "Neither — if the drop is sleep, a new school, or a fight at home. A class will not fix that in week one.",
            ],
          },
          {
            type: "paragraph",
            text: "Plenty of good teachers do both. The mistake is booking “a mentor for all subjects” when the child is failing one chapter of chemistry. Name the subject in the form. You can widen the brief after the first session if the person is right.",
          },
        ],
      },
      {
        heading: "When families in Class 8 to 12 actually book",
        blocks: [
          {
            type: "paragraph",
            text: "The messages that work are boring and specific. “Class 10 CBSE maths, triangles, she scores in school tests and blanks in the exam.” “Class 11 physics, first monthly was 28, he has not opened units and dimensions.” “Class 12 biology, NEET is the goal, school practicals are also pending.”",
          },
          {
            type: "paragraph",
            text: "The messages that waste the hour are “overall development”, “needs motivation”, and “boards are coming”. A mentor can help with those, but only after they have seen the child attempt one question. Put the chapter in the note. Motivation shows up when the question starts making sense.",
          },
          {
            type: "callout",
            title: "Write this in the note",
            text: "Class and board, the chapter, what already failed (test marks or “left three questions”), and whether you want online classes after the demo or are open to home tuition later.",
          },
        ],
      },
      {
        heading: "Book the first session the same way you book a tutor demo",
        blocks: [
          {
            type: "paragraph",
            text: "Search, open a profile that lists the class and the board, and tap Book a demo. The session is online. You will be told that your phone number is shared with this mentor when you send the form. They get an email and an inbox request with your subject, time, and note. You see Waiting until they accept or decline.",
          },
          {
            type: "list",
            ordered: true,
            items: [
              "Match the level on the profile. A Class 6 maths teacher is not automatically a Class 12 mentor.",
              "Read the indicative hourly rate before you book, so the demo is not the first time anyone mentions money.",
              "Pick a time your child can attend. A demo you sit through alone tells you about manners, not teaching.",
              "Book one person first. A second demo is reasonable if the first was polite and useless. Five demos in a weekend exhausts the child.",
            ],
          },
          {
            type: "cta",
            title: "Find a mentor and book the first online session",
            text: "Filter by subject and class. Send the demo with the chapter in the note. No booking fee.",
            label: "Search mentors",
            href: SEARCH,
          },
        ],
      },
      {
        heading: "Ten minutes at the start of the demo that are worth more than the introduction",
        blocks: [
          {
            type: "paragraph",
            text: "Ask these, then stop talking and let your child work.",
          },
          {
            type: "list",
            items: [
              "“Here is the chapter. Can you teach the part they got wrong, not the whole unit?”",
              "“What would the next three classes look like if we continue?”",
              "“How will we know in two weeks that this is working — a school test, a worksheet, or both?”",
              "“What is the fee, the length of the class, and is it online or at home after this demo?”",
              "“Which board have you taught this class for in the last year?”",
            ],
          },
          {
            type: "paragraph",
            text: "Skip the biography unless they offer a one-line version. You can read qualifications on the profile. You cannot read, from a profile, whether your child will ask a doubt out loud. That only shows up in the hour.",
          },
        ],
      },
      {
        heading: "After the session: continue, or book someone else",
        blocks: [
          {
            type: "paragraph",
            text: "The same evening, ask your child one question: “Can you explain the bit you got wrong, without looking?” If they can, in their own words, the mentor taught. If they say “sir was nice”, you still do not know. Nice is not a syllabus.",
          },
          {
            type: "list",
            items: [
              "Continue if the child attempted questions and the plan for the next fortnight is written down, even roughly.",
              "Book another demo if the hour was a monologue, the board was wrong, or the fee only appeared at the end and does not match what you can pay.",
              "Post a requirement if you are no longer sure who to pick. Tutors pitch you. You accept one. Your number stays private until you do.",
            ],
          },
          {
            type: "paragraph",
            text: "Agree the regular slot and the fee on WhatsApp with the mentor, not in a comment thread. Mentr does not sit in the middle of that payment. If the dashboard still says Waiting a day later, assume they are busy and book the next person.",
          },
          {
            type: "cta",
            title: "Not sure who to book? Let mentors pitch you",
            text: "Post the subject, class, and area. Read the pitches in your dashboard and accept the one that names the chapter, not only their years of experience.",
            label: "Create a parent account",
            href: SIGNUP,
          },
        ],
      },
    ],
    faqs: [
      {
        question: "How do I book a mentor for my child?",
        answer:
          "Search mentors who teach your child’s class and board, open a profile, and book an online demo. Add the subject, a time, and a note with the chapter that is weak. The mentor receives your phone number and can confirm.",
      },
      {
        question: "What is the difference between a tutor and a mentor?",
        answer:
          "A tutor usually covers one subject and the school syllabus. A mentor does that and also sets a short plan: what to study next, what to drop, and how you will check progress. Many people do both. Name the subject either way.",
      },
      {
        question: "What should I write when I book the first session?",
        answer:
          "Class, board, the chapter, and what went wrong — a test score or a topic they cannot start. Add whether you want online classes afterwards or are open to home tuition later.",
      },
      {
        question: "Does the mentor get my number when I book?",
        answer:
          "Yes. Booking a demo shares your number with that mentor so they can confirm the time. It is not shared with every mentor on the site. If you post a requirement instead, your number stays private until you accept a pitch.",
      },
      {
        question: "How many demo sessions should I book?",
        answer:
          "Start with one. Book a second only if the first did not teach the chapter or the fee and board did not match. Several demos in one weekend tire the child and teach you less.",
      },
      {
        question: "Who do I pay for the classes?",
        answer:
          "You pay the mentor directly, at the fee you both agree. Mentr does not charge a commission on the demo or on later classes.",
      },
    ],
    relatedLinks: [
      { label: "Search mentors", href: SEARCH },
      { label: "Parent signup", href: SIGNUP },
      {
        label: "How to book a demo class",
        href: "/blog/book-a-demo-class-with-a-tutor-india",
      },
      {
        label: "How to judge the trial",
        href: "/blog/how-parents-evaluate-tutor-trial-session",
      },
      {
        label: "Choosing a Class 10 tutor",
        href: "/blog/how-to-choose-a-tutor-for-class-10",
      },
      {
        label: "Signs your child needs a tutor",
        href: "/blog/signs-child-needs-tutor",
      },
    ],
  },
};
