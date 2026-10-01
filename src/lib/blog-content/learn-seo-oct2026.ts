import type { ArticleContent } from "./types";

const LEARN = "/learn";
const START = "/learn/start";
const SYLLABUS = "/learn/syllabus";
const INDIA = "/learn/india";

function related(extra: { label: string; href: string }[] = []) {
  return [
    { label: "Mentr Learn hub", href: LEARN },
    { label: "Enroll free", href: START },
    { label: "Parent syllabus", href: SYLLABUS },
    { label: "Mentr Learn India", href: INDIA },
    ...extra,
  ];
}

export const LEARN_SEO_OCT2026: Record<string, ArticleContent> = {
  "free-coding-videos-class-3-4-5-india": {
    slug: "free-coding-videos-class-3-4-5-india",
    publishedAt: "2026-10-01",
    updatedAt: "2026-10-01",
    readTimeMinutes: 8,
    author: "Mentr Editorial Team",
    intro:
      "Parents searching for free coding videos for Class 3, 4 and 5 usually find either cartoons with no quiz, or paid apps that lock the next lesson. A useful video for this age is short, spoken in plain language, tied to one syllabus chapter, and followed by notes and a quiz. This guide explains what to look for, and how the narrated lessons on Mentr Learn map to that.",
    sections: [
      {
        heading: "What a Class 3–5 coding video should do",
        blocks: [
          {
            type: "paragraph",
            text: "At this age a child can follow a story, spot a pattern, and try one small task. They should not sit through a 40-minute lecture or type Python. A good lesson video does four things: names the chapter, teaches one idea with a home or school example, pauses so the child can answer, and ends by pointing at the quiz.",
          },
          {
            type: "list",
            items: [
              "One chapter, one idea — a computer’s input and output, or odd and even, not both.",
              "Spoken words a Class 3 can repeat back. Captions on screen for the same idea.",
              "A notes page the parent can download after the video.",
              "A short quiz that only asks what the video just taught.",
            ],
          },
        ],
      },
      {
        heading: "How Mentr Learn videos line up with the syllabus",
        blocks: [
          {
            type: "paragraph",
            text: "Mentr Learn (Mentr Starter) is a free Class 3–5 course on mentr.in/learn. The syllabus is 60 chapters: 20 Computer Science, 20 AI, and 20 Math for coding. Each published chapter has a narrated video, class notes, a 10-question quiz, and practice questions in the practice arena. The list price is ₹999. Parents pay ₹0. No card.",
          },
          {
            type: "table",
            caption: "What each track’s videos cover",
            headers: ["Track", "First idea", "Later idea"],
            rows: [
              ["CS Basics", "What a computer is", "Block coding and a dream-app capstone"],
              ["AI Basics", "AI is patterns, not magic", "Fairness, privacy, and an AI helper design"],
              ["Math for CS", "Counting with on/off lights", "Grids, chance, and a puzzle capstone"],
            ],
          },
          {
            type: "paragraph",
            text: "The videos use the same chapter titles as the parent syllabus. A6 is “What Is an Algorithm?” and treats a recipe as a list of steps. C2 is odd and even. B18 is “Real or AI-Made?”. You can read the full map before you enroll.",
          },
          {
            type: "cta",
            title: "See the chapter list first",
            text: "The syllabus page is the parent version of every video: what they watch and what they practise.",
            label: "Open the syllabus",
            href: SYLLABUS,
          },
        ],
      },
      {
        heading: "A simple way to use the videos at home",
        blocks: [
          {
            type: "list",
            ordered: true,
            items: [
              "Enroll with a parent email at mentr.in/learn/start.",
              "Open the learning app and play the next chapter. Let the video finish so it is marked done.",
              "Download the notes if you want a one-page recap for homework time.",
              "Do the chapter quiz once. Then try a few practice questions, or today’s Problem of the Day.",
            ],
          },
          {
            type: "paragraph",
            text: "Fifteen minutes is enough. The course is self-paced and lifetime for this free Class 3–5 track. It does not include typed Python, hardware internals, or contest coding. Those come later, if you want them.",
          },
          {
            type: "cta",
            title: "Start the first video free",
            text: "Chapter 1 is “What Is a Computer?”. Parent enroll, then the child watches.",
            label: "Enroll free",
            href: START,
          },
        ],
      },
      {
        heading: "Related guides",
        blocks: [
          {
            type: "paragraph",
            text: "If you want the product in one page, read What is Mentr Learn. For the daily question that sits beside the videos, read the Problem of the Day guide. For a yes/no list before you pick any course, use the Class 3–5 checklist.",
          },
        ],
      },
    ],
    faqs: [
      {
        question: "Are Mentr Learn coding videos free for Class 3, 4 and 5?",
        answer:
          "Yes. Mentr Learn on mentr.in/learn is ₹0 for the Class 3–5 track. A parent enrolls with email. There is no card.",
      },
      {
        question: "Do the videos match a written syllabus?",
        answer:
          "Yes. Each video is one chapter from the 60-chapter syllabus (CS, AI, and Math). The parent syllabus is at mentr.in/learn/syllabus.",
      },
      {
        question: "Is there a quiz after the video?",
        answer:
          "Yes. Every chapter has a 10-question quiz plus downloadable notes. Practice questions sit in a separate arena.",
      },
      {
        question: "Does my child need to type code?",
        answer:
          "No. Class 3–5 lessons use stories, block coding, and math ideas. Typed Python is not part of this track.",
      },
    ],
    relatedLinks: related([
      { label: "What is Mentr Learn?", href: "/blog/what-is-mentr-learn" },
      {
        label: "Problem of the Day for kids",
        href: "/blog/coding-problem-of-the-day-for-kids",
      },
      {
        label: "Course checklist for parents",
        href: "/blog/kids-coding-course-checklist-class-3-5",
      },
      {
        label: "Syllabus explained",
        href: "/blog/mentr-learn-class-3-5-syllabus-explained",
      },
    ]),
  },

  "coding-problem-of-the-day-for-kids": {
    slug: "coding-problem-of-the-day-for-kids",
    publishedAt: "2026-10-01",
    updatedAt: "2026-10-01",
    readTimeMinutes: 7,
    author: "Mentr Editorial Team",
    intro:
      "A coding problem of the day for kids is one short question, the same day for everyone, finished in a few minutes. It is not a contest and it is not a second homework worksheet. For Class 3–5, the point is a habit: show up, try, see the idea, come back tomorrow.",
    sections: [
      {
        heading: "What “problem of the day” means at this age",
        blocks: [
          {
            type: "paragraph",
            text: "Older students use a daily problem to train for olympiads. Class 3–5 need something smaller. One multiple-choice or true/false question, written in the same language as the lesson videos, with a calendar so the child can see the days they tried. Missing a day should not feel like failing a test.",
          },
          {
            type: "list",
            items: [
              "One question. Not a set of ten.",
              "Tied to an idea they can meet in the course, such as input and output, patterns, or “is this AI?”.",
              "A visible streak, so yesterday still matters.",
              "An explanation after the attempt, so a wrong answer still teaches.",
            ],
          },
        ],
      },
      {
        heading: "How POTD works on Mentr Learn",
        blocks: [
          {
            type: "paragraph",
            text: "Inside the Mentr Learn app, Problem of the Day (POTD) is the daily question next to the lesson path. Today’s item is on the home screen and in the calendar. A correct answer adds a small amount of XP. Practice on an older day does not pretend to be today’s streak. The learning path — video, notes, quiz — is separate, so a child can watch a chapter and still do the daily question.",
          },
          {
            type: "callout",
            title: "Not a leaderboard for eight-year-olds",
            text: "XP and a cohort board exist so effort is visible. The daily question is still one item. Parents can open the calendar and see which days were tried.",
          },
          {
            type: "cta",
            title: "Open today’s question",
            text: "Enroll free, then the POTD is on the learning home screen.",
            label: "Enroll and try POTD",
            href: START,
          },
        ],
      },
      {
        heading: "How it sits next to videos, notes, and practice",
        blocks: [
          {
            type: "table",
            caption: "Four different jobs — don’t mix them up",
            headers: ["Piece", "When", "Job"],
            rows: [
              ["Lesson video", "A new chapter", "Teach one syllabus idea"],
              ["Notes", "After the video", "One-page recap to download"],
              ["Chapter quiz", "Once per chapter", "Check that chapter. No retake"],
              ["POTD", "Once a day", "Keep the habit, any day’s idea"],
              ["Practice arena", "Extra reps", "Questions spread across all 60 chapters"],
            ],
          },
          {
            type: "paragraph",
            text: "If you only have five minutes, do the problem of the day. If you have fifteen, watch the next video and then the quiz. The syllabus page tells you what each chapter covers before you press play.",
          },
        ],
      },
    ],
    faqs: [
      {
        question: "Is the kids’ problem of the day a coding contest?",
        answer:
          "No. On Mentr Learn it is one short daily question for Class 3–5, with an explanation after the try. It is not an olympiad.",
      },
      {
        question: "Does POTD replace the chapter quiz?",
        answer:
          "No. The chapter quiz checks that lesson. POTD is the daily habit beside the path.",
      },
      {
        question: "Is it free?",
        answer:
          "Yes. POTD is inside Mentr Learn, which is ₹0 for the Class 3–5 track after a parent enrolls.",
      },
      {
        question: "Where do I start?",
        answer:
          "Go to https://mentr.in/learn/start, enroll, then open the learning app. Today’s problem is on the home screen.",
      },
    ],
    relatedLinks: related([
      {
        label: "Free coding videos for Class 3–5",
        href: "/blog/free-coding-videos-class-3-4-5-india",
      },
      {
        label: "15-minute daily habit",
        href: "/blog/15-minute-daily-coding-habit-kids",
      },
      {
        label: "Course checklist",
        href: "/blog/kids-coding-course-checklist-class-3-5",
      },
    ]),
  },

  "kids-coding-course-checklist-class-3-5": {
    slug: "kids-coding-course-checklist-class-3-5",
    publishedAt: "2026-10-01",
    updatedAt: "2026-10-01",
    readTimeMinutes: 8,
    author: "Mentr Editorial Team",
    intro:
      "A kids coding course for Class 3–5 should be checkable. You should be able to see the chapter list, play the video for that chapter, download notes, and find a quiz that matches the video. If any of those are missing, the course is a trailer, not a syllabus. Use this checklist before you pay — or before you spend a month on a free app that never unlocks chapter two.",
    sections: [
      {
        heading: "The five checks",
        blocks: [
          {
            type: "list",
            ordered: true,
            items: [
              "Syllabus: a written list of chapters a parent can read without logging in.",
              "Video: each chapter has its own lesson, with the same title as the syllabus.",
              "Notes: a short recap, not a second video.",
              "Quiz: questions that use the words the video just taught. One attempt is enough.",
              "Practice: extra questions across chapters, separate from the quiz, so a child can try again without resetting the chapter.",
            ],
          },
          {
            type: "paragraph",
            text: "Also check the age. Class 3–5 should not be asked to install a compiler, share a home address inside an AI chat, or grind contest problems. Block coding, stories, and math patterns are the right weight.",
          },
        ],
      },
      {
        heading: "How Mentr Learn scores on the checklist",
        blocks: [
          {
            type: "table",
            caption: "Checklist against Mentr Learn (Class 3–5, ₹0)",
            headers: ["Check", "Where", "What you get"],
            rows: [
              ["Syllabus", "mentr.in/learn/syllabus", "60 chapters: CS, AI, Math"],
              ["Video", "Learning app, each chapter", "Narrated lesson with the syllabus title"],
              ["Notes", "Notes button on the chapter", "Downloadable class notes"],
              ["Quiz", "After the video", "10 questions, one attempt"],
              ["Practice", "Practice arena", "200 questions across all chapters"],
              ["Daily habit", "POTD on the home screen", "One question a day"],
            ],
          },
          {
            type: "paragraph",
            text: "Price: list ₹999, charged ₹0, no card, parent email enroll, lifetime for this track. It is not a tutor marketplace. If you later want a person, that is a separate search on Mentr. Learn itself stays the self-paced course.",
          },
          {
            type: "cta",
            title: "Read the syllabus, then enroll",
            text: "Start with the parent page. Enroll only if the chapter list is what you wanted.",
            label: "Open the syllabus",
            href: SYLLABUS,
          },
        ],
      },
      {
        heading: "Questions worth asking any course",
        blocks: [
          {
            type: "list",
            items: [
              "Can I see chapter 7’s title before I create an account?",
              "If the video is finished, is the quiz about that video?",
              "Can I download notes for a parent who was not in the room?",
              "What is deliberately not included? (For Mentr Learn: no typed Python yet, no contest track.)",
              "Is “free” the first module only, or the Class 3–5 track?",
            ],
          },
          {
            type: "paragraph",
            text: "Mentr Learn’s answer to the last question is the whole Class 3–5 track at ₹0. The hub is https://mentr.in/learn. Enroll is https://mentr.in/learn/start. The India page is https://mentr.in/learn/india if you want the same course with local framing.",
          },
          {
            type: "cta",
            title: "Enroll when the checklist passes",
            text: "Parent email, then chapter 1. The child can start the same day.",
            label: "Enroll free",
            href: START,
          },
        ],
      },
    ],
    faqs: [
      {
        question: "What should a Class 3–5 coding course include?",
        answer:
          "A public syllabus, a video per chapter, notes, a quiz on that chapter, and extra practice. Mentr Learn includes those on the free Class 3–5 track.",
      },
      {
        question: "How many chapters are in Mentr Learn?",
        answer:
          "60. Twenty Computer Science, twenty AI, and twenty Math for coding. The list is at mentr.in/learn/syllabus.",
      },
      {
        question: "Are the quizzes retaken until the score is perfect?",
        answer:
          "No. Each chapter quiz is one attempt. Practice questions are the place to try similar ideas again.",
      },
      {
        question: "Where do I enroll?",
        answer:
          "https://mentr.in/learn/start — parent email, ₹0, then the learning app.",
      },
    ],
    relatedLinks: related([
      {
        label: "Free coding videos for Class 3–5",
        href: "/blog/free-coding-videos-class-3-4-5-india",
      },
      {
        label: "Problem of the Day",
        href: "/blog/coding-problem-of-the-day-for-kids",
      },
      { label: "What is Mentr Learn?", href: "/blog/what-is-mentr-learn" },
      {
        label: "Safe AI for kids",
        href: "/blog/safe-ai-for-kids-privacy-parents-guide",
      },
    ]),
  },
};
