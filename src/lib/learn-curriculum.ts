/** Mentr Learn — Class 3–5 launch cohort curriculum (static marketing + future app data). */

export type LearnQuizType =
  | "MCQ"
  | "True/False"
  | "Match pairs"
  | "Sequence/order"
  | "Image-ID"
  | "Project"
  | "Boss";

export type LearnModule = {
  id: string;
  title: string;
  concept: string;
  quizType: LearnQuizType;
};

export type LearnUnit = {
  id: string;
  title: string;
  description: string;
  modules: LearnModule[];
  bossChallenge: string;
  /** Video length in minutes for modules in this unit (within track) */
  videoMinutes: number;
};

export type LearnTrackId = "cs" | "ai" | "math";

export type LearnTrack = {
  id: LearnTrackId;
  label: string;
  shortLabel: string;
  tagline: string;
  letter: string;
  letterBg: string;
  panelBg: string;
  crossLink?: string;
  units: LearnUnit[];
};

export const LEARN_SIGNUP_HREF = "/parent/signup?next=/learn";

export const VIDEO_LENGTH_BY_UNIT_INDEX = [3, 4, 5, 6] as const;

export const SAMPLE_MODULE_ID = "A1";

const csUnits: LearnUnit[] = [
  {
    id: "cs-u1",
    title: "How Computers Work",
    description: "Input, output, binary, internet, and staying safe online.",
    videoMinutes: 3,
    bossChallenge: "Build-a-Computer — drag parts to make a working computer",
    modules: [
      { id: "A1", title: "What Is a Computer?", concept: "Input, output, processing — computer vs just electronics", quizType: "MCQ" },
      { id: "A2", title: "How Computers Understand Us", concept: "Binary as on/off light switches (simplified)", quizType: "True/False" },
      { id: "A3", title: "Input & Output Devices", concept: "Keyboard, mouse, screen, speaker — match device to job", quizType: "Match pairs" },
      { id: "A4", title: "How Websites Talk to Each Other", concept: "Internet as a network of askers and answerers", quizType: "MCQ" },
      { id: "A5", title: "Being Safe Online", concept: "Passwords, stranger-danger online, what never to share", quizType: "MCQ" },
    ],
  },
  {
    id: "cs-u2",
    title: "Thinking Like a Computer",
    description: "Algorithms, sequencing, loops, conditions, and debugging.",
    videoMinutes: 4,
    bossChallenge: "Robot Maze Navigator — sequence commands through a maze",
    modules: [
      { id: "A6", title: "What Is an Algorithm?", concept: "Step-by-step instructions — recipe analogy", quizType: "Sequence/order" },
      { id: "A7", title: "Sequencing", concept: "Order matters — rearrange scrambled steps", quizType: "Sequence/order" },
      { id: "A8", title: "Loops — Doing It Again and Again", concept: "Repeat blocks via everyday loop examples", quizType: "MCQ" },
      { id: "A9", title: "If This, Then That", concept: "Conditions and branching via simple stories", quizType: "MCQ" },
      { id: "A10", title: "Debugging — Finding the Mistake", concept: "Spot-the-bug in scrambled instructions", quizType: "Image-ID" },
    ],
  },
  {
    id: "cs-u3",
    title: "Building With Blocks",
    description: "Visual block coding, motion, variables, and first programs.",
    videoMinutes: 5,
    bossChallenge: "Code-a-Story — guided creative build using the unit",
    modules: [
      { id: "A11", title: "Meet Block Coding", concept: "Visual block-based coding, no typing required", quizType: "MCQ" },
      { id: "A12", title: "Making a Character Move", concept: "Event + motion blocks", quizType: "Sequence/order" },
      { id: "A13", title: "Variables — Boxes That Store Things", concept: "Labeled boxes holding a value", quizType: "MCQ" },
      { id: "A14", title: "Making Choices in Code", concept: "If/else in visual block form", quizType: "MCQ" },
      { id: "A15", title: "My First Mini Program", concept: "Guided build of a tiny animation or story", quizType: "Project" },
    ],
  },
  {
    id: "cs-u4",
    title: "Computers in Our World",
    description: "Careers, apps, robots, data, and a capstone app design.",
    videoMinutes: 6,
    bossChallenge: "Capstone: Design Your Dream App — draw and present an app idea",
    modules: [
      { id: "A16", title: "Jobs That Use Computers", concept: "Game dev, app dev, robotics, animation", quizType: "MCQ" },
      { id: "A17", title: "How Apps We Use Actually Work", concept: "High-level look at maps or video apps", quizType: "MCQ" },
      { id: "A18", title: "Robots & Automation", concept: "What robots can and can't do", quizType: "True/False" },
      { id: "A19", title: "Data — What Computers Remember", concept: "Data storage as a very organized list", quizType: "MCQ" },
      { id: "A20", title: "Capstone: Design Your Dream App", concept: "Draw and describe an app idea, present it", quizType: "Project" },
    ],
  },
];

const aiUnits: LearnUnit[] = [
  {
    id: "ai-u1",
    title: "What Is AI?",
    description: "Demystify AI, spot it in daily life, and learn its limits.",
    videoMinutes: 3,
    bossChallenge: "Spot the AI — scavenger hunt in everyday app screenshots",
    modules: [
      { id: "B1", title: "Meet AI — Magic or Math?", concept: "AI as pattern-based math, not magic", quizType: "MCQ" },
      { id: "B2", title: "Smart vs. Simple", concept: "How AI differs from a calculator or normal app", quizType: "MCQ" },
      { id: "B3", title: "Where AI Hides in Daily Life", concept: "Voice assistants, recommendations, photo filters", quizType: "Image-ID" },
      { id: "B4", title: "AI Can Be Wrong Too", concept: "Limitations in age-appropriate terms", quizType: "True/False" },
      { id: "B5", title: "AI Helpers Around the World", concept: "Translation, maps, everyday AI helpers", quizType: "MCQ" },
    ],
  },
  {
    id: "ai-u2",
    title: "How Machines Learn",
    description: "Training by example, patterns, data, and practice.",
    videoMinutes: 4,
    bossChallenge: "Train-a-Bot — feed examples and watch it improve",
    modules: [
      { id: "B6", title: "Teaching a Computer Like Teaching a Puppy", concept: "Training-by-example analogy", quizType: "MCQ" },
      { id: "B7", title: "Patterns Everywhere", concept: "Pattern recognition via sorting shapes and colors", quizType: "Match pairs" },
      { id: "B8", title: "Show and Tell — Learning From Examples", concept: "Labeled data via a sorting game", quizType: "Image-ID" },
      { id: "B9", title: "Data — The Food AI Eats", concept: "What data means for AI, simplified", quizType: "MCQ" },
      { id: "B10", title: "Practice Makes Perfect", concept: "AI improves with more examples", quizType: "MCQ" },
    ],
  },
  {
    id: "ai-u3",
    title: "AI That Sees, Hears, and Talks",
    description: "Vision, speech, chatbots, filters, and game AI.",
    videoMinutes: 5,
    bossChallenge: "Build a Simple Chatbot Flow — drag-and-drop conversation tree",
    modules: [
      { id: "B11", title: "Can Computers See?", concept: "Image recognition via object-spotting", quizType: "Image-ID" },
      { id: "B12", title: "Can Computers Listen?", concept: "Speech recognition and voice assistants", quizType: "MCQ" },
      { id: "B13", title: "Chatting With Computers", concept: "How chatbots decide what to say", quizType: "MCQ" },
      { id: "B14", title: "Faces, Filters, and Fun", concept: "How AR filters map facial features", quizType: "MCQ" },
      { id: "B15", title: "AI in Games", concept: "Simple game-character AI (NPC behavior)", quizType: "Project" },
    ],
  },
  {
    id: "ai-u4",
    title: "Being Smart and Safe With AI",
    description: "Fairness, privacy, real vs AI-made, and capstone helper design.",
    videoMinutes: 6,
    bossChallenge: "Capstone: Imagine Your Own AI Helper — design and present",
    modules: [
      { id: "B16", title: "Is AI Fair?", concept: "Bias — AI needs many kinds of examples", quizType: "MCQ" },
      { id: "B17", title: "AI and Privacy", concept: "Why AI shouldn't know everything about you", quizType: "True/False" },
      { id: "B18", title: "Real or AI-Made?", concept: "Critical thinking about AI-generated images", quizType: "Image-ID" },
      { id: "B19", title: "AI Helping Doctors, Scientists, Artists", concept: "Positive real-world AI use cases", quizType: "MCQ" },
      { id: "B20", title: "Capstone: Imagine Your Own AI Helper", concept: "Design and present an imagined AI helper", quizType: "Project" },
    ],
  },
];

const mathUnits: LearnUnit[] = [
  {
    id: "math-u1",
    title: "Numbers Computers Love",
    description: "Binary, patterns, place value, and sequences.",
    videoMinutes: 3,
    bossChallenge: "Binary Code Breaker — decode on/off lights",
    modules: [
      { id: "C1", title: "Counting the Computer Way", concept: "Binary via light switches, count to 5 in binary", quizType: "MCQ" },
      { id: "C2", title: "Odd, Even, and Patterns", concept: "Foundation for algorithmic thinking", quizType: "MCQ" },
      { id: "C3", title: "Place Value Power-Up", concept: "Base-10 before contrasting with binary", quizType: "MCQ" },
      { id: "C4", title: "Skip Counting & Sequences", concept: "Patterns as prep for loops in CS track", quizType: "Sequence/order" },
      { id: "C5", title: "Number Patterns Playground", concept: "Simple growing sequences (Fibonacci-lite)", quizType: "MCQ" },
    ],
  },
  {
    id: "math-u2",
    title: "Logic & Reasoning",
    description: "True/false, AND/OR/NOT, sorting, sets, and puzzles.",
    videoMinutes: 4,
    bossChallenge: "Logic Gate Playground — combine gates to solve a puzzle",
    modules: [
      { id: "C6", title: "True or False?", concept: "Basic logic statements", quizType: "True/False" },
      { id: "C7", title: "AND, OR, NOT for Kids", concept: "Logic gates via a party-planning game", quizType: "MCQ" },
      { id: "C8", title: "Sorting and Comparing", concept: "Greater/less-than, sorting a toy collection", quizType: "Sequence/order" },
      { id: "C9", title: "Sets — Things That Belong Together", concept: "Venn diagrams via fun themes", quizType: "Match pairs" },
      { id: "C10", title: "Solving Puzzles Step by Step", concept: "Simple logic puzzles (Sudoku-lite)", quizType: "MCQ" },
    ],
  },
  {
    id: "math-u3",
    title: "Shapes, Grids & Coordinates",
    description: "2D shapes, grids, symmetry, angles, and drawing with math.",
    videoMinutes: 5,
    bossChallenge: "Pixel Art Coordinates — plot points to reveal a picture",
    modules: [
      { id: "C11", title: "Shapes All Around", concept: "2D shape review for graphics thinking", quizType: "Image-ID" },
      { id: "C12", title: "Grids and Coordinates", concept: "x/y basics via a battleship-style game", quizType: "MCQ" },
      { id: "C13", title: "Symmetry and Patterns", concept: "Foundation for design and graphics", quizType: "Image-ID" },
      { id: "C14", title: "Angles and Turns", concept: "Turn right 90° — prep for turtle graphics", quizType: "MCQ" },
      { id: "C15", title: "Draw With Math", concept: "Mini turtle-graphics-style drawing", quizType: "Project" },
    ],
  },
  {
    id: "math-u4",
    title: "Thinking Like a Problem Solver",
    description: "Estimation, probability, decomposition, and capstone puzzles.",
    videoMinutes: 6,
    bossChallenge: "Capstone: Math Puzzle Challenge — mixed puzzle capstone",
    modules: [
      { id: "C16", title: "Estimation and Guess-Check-Improve", concept: "Strategy that mirrors debugging", quizType: "MCQ" },
      { id: "C17", title: "Probability — What Are the Chances?", concept: "Dice and coins — links to how AI guesses", quizType: "MCQ" },
      { id: "C18", title: "Working Backwards", concept: "Reverse problem-solving strategy", quizType: "MCQ" },
      { id: "C19", title: "Breaking Big Problems Into Small Ones", concept: "Decomposition — link to algorithms", quizType: "Sequence/order" },
      { id: "C20", title: "Capstone: Math Puzzle Challenge", concept: "Mixed puzzle capstone for the whole track", quizType: "Project" },
    ],
  },
];

export const LEARN_TRACKS: LearnTrack[] = [
  {
    id: "cs",
    label: "CS Basics for Kids",
    shortLabel: "CS Basics",
    tagline: "How computers & code think",
    letter: "C",
    letterBg: "bg-coral",
    panelBg: "bg-coral-wash",
    crossLink: "Unit 1 CS + Unit 1 Math reinforce binary and patterns in the same week.",
    units: csUnits,
  },
  {
    id: "ai",
    label: "AI Basics for Kids",
    shortLabel: "AI Basics",
    tagline: "Patterns, not magic",
    letter: "A",
    letterBg: "bg-lavender",
    panelBg: "bg-lavender",
    crossLink: "AI Unit 2 pairs with Math probability in Unit 4 later in the cohort.",
    units: aiUnits,
  },
  {
    id: "math",
    label: "Math for CS",
    shortLabel: "Math for CS",
    tagline: "Numbers computers love",
    letter: "M",
    letterBg: "bg-sage",
    panelBg: "bg-sage-wash",
    crossLink: "Math coordinates (Unit 3) line up with CS graphics and block coding.",
    units: mathUnits,
  },
];

export const LEARN_MODULE_COUNT = LEARN_TRACKS.reduce(
  (n, t) => n + t.units.reduce((u, unit) => u + unit.modules.length, 0),
  0,
);

export function getModuleById(id: string): LearnModule | undefined {
  for (const track of LEARN_TRACKS) {
    for (const unit of track.units) {
      const mod = unit.modules.find((m) => m.id === id);
      if (mod) return mod;
    }
  }
  return undefined;
}

export function getTrackForModule(id: string): LearnTrack | undefined {
  return LEARN_TRACKS.find((t) =>
    t.units.some((u) => u.modules.some((m) => m.id === id)),
  );
}

export const SAMPLE_MODULE = getModuleById(SAMPLE_MODULE_ID)!;

export const SAMPLE_MCQ = {
  question: "Which of these is an INPUT device?",
  options: ["Keyboard", "Monitor", "Speaker", "Printer paper"],
  correct: 0,
  explanation: "A keyboard sends information INTO the computer. Monitors and speakers show or play output.",
};
