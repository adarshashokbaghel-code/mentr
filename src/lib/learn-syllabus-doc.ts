import { LEARN_TRACKS, type LearnTrack, type LearnUnit } from "@/lib/learn-curriculum";
import {
  CHECKS_PER_MODULE,
  getModuleDetail,
  MODULE_DETAILS,
  PRACTICE_PER_MODULE,
  type LearnModuleDetail,
} from "@/lib/learn-module-details";

export const SYLLABUS_PDF_FILENAME = "Mentr-Learn-Class-3-5-Syllabus.pdf";
export const SYLLABUS_DOWNLOAD_HREF = "/learn/syllabus/download";
export const SYLLABUS_VIEW_HREF = "/learn/syllabus";

export const SYLLABUS_TITLE = "What’s included for your Class 3–5 child";
export const SYLLABUS_SUBTITLE =
  "A parent guide to the free CS, AI, and Math path — 20 lessons in each subject, 60 in total";

export const PARENT_GUIDE = {
  eyebrow: "For parents",
  lead:
    "This page is for you, not for a teacher or a tutor. It shows what Mentr Learn actually provides — so you know what your child watches, practises, and can show you at the end of each lesson.",
  provided: [
    {
      title: "A short video",
      body: "They listen. Every lesson is narrated, so Class 3 kids don’t need to read a textbook.",
    },
    {
      title: "10 practice questions",
      body: "The same idea, as a small game or quiz — so it sticks.",
    },
    {
      title: "1 check you can see",
      body: "One question that marks the lesson done. That’s how you know they finished it.",
    },
    {
      title: "A boss every 5 lessons",
      body: "A bigger game or mini-project that wraps the unit — then they move on.",
    },
  ],
} as const;

/** Parent-facing overview of the year. */
export const SYLLABUS_PREAMBLE = {
  audience:
    "For your child in Class 3, 4, or 5 (about ages 8–11). Class 3 kids may still be learning to read, so every video is narrated — they listen, they don’t have to read a textbook. Class 5 kids still get new ideas in later units. We don’t jump to Class 6 algebra or typed code.",
  lessonModel:
    "Each lesson is the same simple loop for your child: a short narrated video, 10 practice questions on that idea, then 1 check question so you can see the lesson is done. After every 5 lessons, a Boss Challenge (a small game or project) wraps up the unit.",
  pacing:
    "Videos start around 3 minutes and grow to about 6 minutes. A typical sitting is 12–18 minutes. You can do one subject a day or mix. CS Unit 1 and Math Unit 1 are meant to sit in the same week (lights/binary and patterns).",
  progression:
    "Each subject has 4 units of 5 lessons: Easy → Building → Stretch → Apply. The first five stay concrete and spoken. The middle ten add rules, grids, and block ideas. The last five use the same ideas on apps, fairness, and a capstone your child can explain to you.",
} as const;

export const SUBJECT_SCOPE = [
  {
    id: "cs" as const,
    howMuch:
      "Your child learns how a computer takes input, follows steps, and stays safe online — then snaps visual blocks (no typing). By the end they can write a short everyday algorithm, use a loop and an if/then, and finish a tiny block program. They will not type Python, learn an operating system, or wire hardware.",
    include:
      "Computer vs gadget, binary as lights, input and output, how websites answer, passwords and sharing, algorithms, order, loops, if/then, finding mistakes, block coding, motion, score/lives boxes, jobs that use computers, how a favourite app works, robots, data, and a dream-app idea they can show you.",
    exclude:
      "Typed languages (Python, HTML), hardware insides, advanced networks, competitive coding, or typing-speed drills.",
    outcomes: [
      "point to input, process, and output on a real device at home",
      "write and fix a short everyday algorithm (like a recipe)",
      "use sequence, repeat, and if/then in blocks",
      "describe an app idea: who it’s for, one input, one output",
    ],
  },
  {
    id: "ai" as const,
    howMuch:
      "Your child learns that AI spots patterns in examples — it is not magic and not a person. They practise spotting AI at home, noticing when it can be wrong, and keeping private things private. They will not train neural nets, do workplace prompt-writing, or sit through scary deepfake stories.",
    include:
      "Patterns vs magic, smart vs simple tools, everyday helpers, mistakes, training like a puppy, labels, data, practice and test, seeing / hearing / chat, filters, game rules, fairness as “many kinds of examples”, privacy, pause-before-believe, helpful uses, and inventing a helper with one privacy rule.",
    exclude:
      "Calculus, model architectures, career prompt-engineering, adult misinformation rabbit holes, or “AI will take all jobs” fear.",
    outcomes: [
      "tell you AI finds patterns in examples — and can be wrong",
      "give a simple example of training, labels, and a new test",
      "use a voice or chat helper without sharing secrets",
      "invent a helper with one job and one privacy rule",
    ],
  },
  {
    id: "math" as const,
    howMuch:
      "Your child practises the thinking computers reuse: patterns, true/false, sorting, grids, turns, estimates, chance words, and breaking a job into parts. Numbers stay in the Class 3–5 range (up to 100 / 1000). There is no Class 6 algebra, formal proofs, or a fraction-first unit.",
    include:
      "Binary count to 5, odd/even, place value, skip-count, growing patterns, true/false, AND / OR / NOT stories, compare and sort, Venn, clue puzzles, 2D shapes, first-quadrant grids, symmetry, 90° turns, draw-a-square commands, estimate, likely/unlikely, work backwards, and a mixed puzzle capstone.",
    exclude:
      "Algebra, negative numbers as a unit, formal probability formulae, compass constructions, or long-division drills as the point of the course.",
    outcomes: [
      "continue a pattern and tell you the rule",
      "solve a kid AND / OR / NOT or Venn story",
      "plot a point and turn 90° like a coding turtle",
      "split a messy task into smaller ordered steps",
    ],
  },
] as const;

export const UNIT_GOALS: Record<string, string[]> = {
  "cs-u1": [
    "tell a computer from a simple gadget (toaster, lamp)",
    "name input, process, and output on something at home",
    "keep passwords and home details private",
  ],
  "cs-u2": [
    "write steps a robot — or a younger sibling — could follow",
    "use order, repeat, and if/then in everyday stories",
    "find and fix one mistake in a short list of steps",
  ],
  "cs-u3": [
    "read start, move, and if blocks on screen",
    "change a number in a score or lives box",
    "finish a tiny 5–8 block program with a little help",
  ],
  "cs-u4": [
    "map a favourite app to input → process → output",
    "tell you what robots can and cannot do",
    "present a dream-app idea to you in about a minute",
  ],
  "ai-u1": [
    "tell you AI is patterns, not magic",
    "spot two everyday AI helpers and one thing that is not AI",
    "check surprising claims with you or another trusted adult",
  ],
  "ai-u2": [
    "explain training as lots of labelled examples (like teaching a puppy)",
    "say why mixed examples and a new test matter",
    "find a pattern and a wrong label on a picture card",
  ],
  "ai-u3": [
    "describe seeing, hearing, and chat in kid words",
    "write a clear voice command and two simple game rules",
    "keep secrets out of a chatbot",
  ],
  "ai-u4": [
    "connect unfair AI to “not enough kinds of examples”",
    "name two private things not to share with an app",
    "invent a helper with one privacy rule",
  ],
  "math-u1": [
    "read a 0/1 light pattern up to 5",
    "use odd/even, place value, and skip-count",
    "name the rule of a growing pattern",
  ],
  "math-u2": [
    "mark simple statements true or false",
    "solve AND / OR / NOT and Venn stories",
    "sort, compare, and use one clue at a time",
  ],
  "math-u3": [
    "name 2D shapes and plot a point on a first-quadrant grid",
    "find a line of symmetry and a quarter turn",
    "write commands that draw a square",
  ],
  "math-u4": [
    "estimate, then improve after a clue",
    "use chance words (likely / unlikely) and work backwards",
    "break a big job into small ordered steps",
  ],
};

export type SyllabusModule = {
  id: string;
  title: string;
  concept: string;
  quizType: string;
  videoMinutes: number;
  detail: LearnModuleDetail;
};

export type SyllabusUnit = {
  unit: LearnUnit;
  goals: string[];
  modules: SyllabusModule[];
};

export type SyllabusTrack = {
  track: LearnTrack;
  scope: (typeof SUBJECT_SCOPE)[number];
  units: SyllabusUnit[];
};

function assertCompleteSyllabus() {
  const missing: string[] = [];
  for (const track of LEARN_TRACKS) {
    for (const unit of track.units) {
      for (const mod of unit.modules) {
        if (!MODULE_DETAILS[mod.id]) missing.push(mod.id);
      }
    }
  }
  if (missing.length) {
    throw new Error(`Syllabus details missing for: ${missing.join(", ")}`);
  }
}

assertCompleteSyllabus();

export function getSyllabusTracks(): SyllabusTrack[] {
  return LEARN_TRACKS.map((track) => {
    const scope = SUBJECT_SCOPE.find((s) => s.id === track.id);
    if (!scope) throw new Error(`No subject scope for ${track.id}`);
    return {
      track,
      scope,
      units: track.units.map((unit) => ({
        unit,
        goals: UNIT_GOALS[unit.id] ?? [],
        modules: unit.modules.map((mod) => {
          const detail = getModuleDetail(mod.id);
          if (!detail) throw new Error(`Missing detail ${mod.id}`);
          return {
            id: mod.id,
            title: mod.title,
            concept: mod.concept,
            quizType: mod.quizType,
            videoMinutes: unit.videoMinutes,
            detail,
          };
        }),
      })),
    };
  });
}

export const SYLLABUS_COUNTS = {
  modules: 60,
  subjects: 3,
  lessonsPerSubject: 20,
  practicePerLesson: PRACTICE_PER_MODULE,
  checksPerLesson: CHECKS_PER_MODULE,
  practiceTotal: 60 * PRACTICE_PER_MODULE,
  checksTotal: 60 * CHECKS_PER_MODULE,
  bosses: 12,
} as const;
