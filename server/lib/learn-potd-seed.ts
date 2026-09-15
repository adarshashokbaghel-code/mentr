/**
 * 70 Problem-of-the-Day items mapped across CS / AI / Math modules.
 * dayIndex 0..69 → daily rotation, then repeats.
 */
import type { ILearnPotd } from "../models/LearnPotd";

type PotdSeed = Pick<
  ILearnPotd,
  | "potdId"
  | "dayIndex"
  | "moduleId"
  | "trackId"
  | "title"
  | "prompt"
  | "options"
  | "correctIndex"
  | "explanation"
  | "difficulty"
>;

const CS = [
  { id: "A1", title: "What Is a Computer?" },
  { id: "A2", title: "How Computers Understand Us" },
  { id: "A3", title: "Input & Output Devices" },
  { id: "A4", title: "How Websites Talk" },
  { id: "A5", title: "Being Safe Online" },
  { id: "A6", title: "What Is an Algorithm?" },
  { id: "A7", title: "Sequencing" },
  { id: "A8", title: "Loops" },
  { id: "A9", title: "If This, Then That" },
  { id: "A10", title: "Debugging" },
  { id: "A11", title: "Block Coding" },
  { id: "A12", title: "Making a Character Move" },
  { id: "A13", title: "Variables" },
  { id: "A14", title: "Choices in Code" },
  { id: "A15", title: "Mini Program" },
  { id: "A16", title: "Jobs That Use Computers" },
  { id: "A17", title: "How Apps Work" },
  { id: "A18", title: "Robots & Automation" },
  { id: "A19", title: "Data" },
  { id: "A20", title: "Dream App" },
] as const;

const AI = [
  { id: "B1", title: "Meet AI" },
  { id: "B2", title: "Smart vs Simple" },
  { id: "B3", title: "AI in Daily Life" },
  { id: "B4", title: "AI Can Be Wrong" },
  { id: "B5", title: "AI Helpers" },
  { id: "B6", title: "Teaching Like a Puppy" },
  { id: "B7", title: "Patterns" },
  { id: "B8", title: "Examples & Labels" },
  { id: "B9", title: "Data for AI" },
  { id: "B10", title: "Practice Makes Perfect" },
  { id: "B11", title: "Can Computers See?" },
  { id: "B12", title: "Can Computers Listen?" },
  { id: "B13", title: "Chatting With Computers" },
  { id: "B14", title: "Faces & Filters" },
  { id: "B15", title: "AI in Games" },
  { id: "B16", title: "Is AI Fair?" },
  { id: "B17", title: "AI and Privacy" },
  { id: "B18", title: "Real or AI-Made?" },
  { id: "B19", title: "AI Helping People" },
  { id: "B20", title: "Imagine an AI Helper" },
] as const;

const MATH = [
  { id: "C1", title: "Counting the Computer Way" },
  { id: "C2", title: "Odd, Even, Patterns" },
  { id: "C3", title: "Place Value" },
  { id: "C4", title: "Skip Counting" },
  { id: "C5", title: "Number Patterns" },
  { id: "C6", title: "True or False" },
  { id: "C7", title: "AND, OR, NOT" },
  { id: "C8", title: "Sorting" },
  { id: "C9", title: "Sets" },
  { id: "C10", title: "Logic Puzzles" },
  { id: "C11", title: "Shapes" },
  { id: "C12", title: "Grids" },
  { id: "C13", title: "Symmetry" },
  { id: "C14", title: "Angles and Turns" },
  { id: "C15", title: "Draw With Math" },
  { id: "C16", title: "Estimation" },
  { id: "C17", title: "Probability" },
  { id: "C18", title: "Working Backwards" },
  { id: "C19", title: "Break Big Problems" },
  { id: "C20", title: "Math Puzzle Capstone" },
] as const;

function buildForModule(
  dayIndex: number,
  trackId: "cs" | "ai" | "math",
  mod: { id: string; title: string },
  variant: number,
): PotdSeed {
  const difficulty =
    variant % 3 === 0 ? "easy" : variant % 3 === 1 ? "medium" : "hard";

  const banks: Record<string, PotdSeed> = {
    cs0: {
      potdId: `potd-${String(dayIndex + 1).padStart(3, "0")}`,
      dayIndex,
      moduleId: mod.id,
      trackId,
      title: `POTD · ${mod.title}`,
      prompt: `From ${mod.title}: which order is correct for a computer?`,
      options: [
        "Input → Process → Output",
        "Output → Input → Process",
        "Only Output",
        "Only Input",
      ],
      correctIndex: 0,
      explanation: "Computers take input, process it, then show output.",
      difficulty,
    },
    cs1: {
      potdId: `potd-${String(dayIndex + 1).padStart(3, "0")}`,
      dayIndex,
      moduleId: mod.id,
      trackId,
      title: `POTD · ${mod.title}`,
      prompt: `Thinking about ${mod.title} — what should you do if steps look wrong?`,
      options: [
        "Debug — find and fix the mistake",
        "Throw the computer",
        "Skip forever",
        "Only shout louder",
      ],
      correctIndex: 0,
      explanation: "Debugging means finding and fixing mistakes in steps.",
      difficulty,
    },
    ai0: {
      potdId: `potd-${String(dayIndex + 1).padStart(3, "0")}`,
      dayIndex,
      moduleId: mod.id,
      trackId,
      title: `POTD · ${mod.title}`,
      prompt: `About ${mod.title}: AI mainly learns by…`,
      options: [
        "Finding patterns in examples",
        "Magic spells",
        "Eating sandwiches",
        "Sleeping only",
      ],
      correctIndex: 0,
      explanation: "AI finds patterns in examples — it is not magic.",
      difficulty,
    },
    ai1: {
      potdId: `potd-${String(dayIndex + 1).padStart(3, "0")}`,
      dayIndex,
      moduleId: mod.id,
      trackId,
      title: `POTD · ${mod.title}`,
      prompt: `From ${mod.title}: should you share your home address with a chat helper?`,
      options: [
        "No — keep private things private",
        "Yes — always share everything",
        "Only on Mondays",
        "Yes, if the helper asks nicely",
      ],
      correctIndex: 0,
      explanation: "Privacy matters — never share secrets with AI helpers.",
      difficulty,
    },
    math0: {
      potdId: `potd-${String(dayIndex + 1).padStart(3, "0")}`,
      dayIndex,
      moduleId: mod.id,
      trackId,
      title: `POTD · ${mod.title}`,
      prompt: `Linked to ${mod.title}: what helps computers and kids solve hard work?`,
      options: [
        "Break the big problem into small steps",
        "Guess randomly forever",
        "Ignore the problem",
        "Only use one huge step",
      ],
      correctIndex: 0,
      explanation: "Decomposition — small steps — is how we (and computers) solve hard jobs.",
      difficulty,
    },
    math1: {
      potdId: `potd-${String(dayIndex + 1).padStart(3, "0")}`,
      dayIndex,
      moduleId: mod.id,
      trackId,
      title: `POTD · ${mod.title}`,
      prompt: `From ${mod.title}: patterns help us…`,
      options: [
        "Predict what comes next",
        "Forget numbers",
        "Delete math forever",
        "Only draw circles",
      ],
      correctIndex: 0,
      explanation: "Patterns let us continue a sequence and think like a computer.",
      difficulty,
    },
  };

  if (trackId === "cs") return variant % 2 === 0 ? banks.cs0! : banks.cs1!;
  if (trackId === "ai") return variant % 2 === 0 ? banks.ai0! : banks.ai1!;
  return variant % 2 === 0 ? banks.math0! : banks.math1!;
}

/** Build exactly 70 POTDs: 24 CS + 23 AI + 23 Math across modules. */
export function buildPotdSeedBank(): PotdSeed[] {
  const out: PotdSeed[] = [];
  let day = 0;

  // 24 CS (cycle A1–A20 + A1–A4)
  for (let i = 0; i < 24; i++) {
    const mod = CS[i % CS.length]!;
    out.push(buildForModule(day, "cs", mod, i));
    day += 1;
  }
  // 23 AI
  for (let i = 0; i < 23; i++) {
    const mod = AI[i % AI.length]!;
    out.push(buildForModule(day, "ai", mod, i));
    day += 1;
  }
  // 23 Math
  for (let i = 0; i < 23; i++) {
    const mod = MATH[i % MATH.length]!;
    out.push(buildForModule(day, "math", mod, i));
    day += 1;
  }

  if (out.length !== 70) {
    throw new Error(`Expected 70 POTDs, got ${out.length}`);
  }
  return out;
}
