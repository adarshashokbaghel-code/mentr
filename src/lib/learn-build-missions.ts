/**
 * Mentr Learn — Build Arena missions (guided Blockly projects).
 * Easy → moderate. Core B1–B10 + Maze Pack B11–B15.
 */

export type BuildDifficulty = "easy" | "medium" | "moderate";

export type BuildMissionKind = "sequence" | "maze" | "story";

export type BuildStageKind = "stack" | "path" | "maze" | "story";

export type BuildStepDef = {
  id: string;
  label: string;
  /** Short emoji / glyph for stage chips */
  glyph: string;
  color: string;
};

export type BuildDir = 0 | 1 | 2 | 3; // E S W N

export type BuildMazeConfig = {
  width: number;
  height: number;
  start: { x: number; y: number; dir: BuildDir };
  goal: { x: number; y: number };
  /** Wall cells as "x,y" */
  walls: string[];
  /** Optional deco cells */
  marks?: { x: number; y: number; glyph: string }[];
};

export type BuildMission = {
  id: string;
  number: number;
  title: string;
  blurb: string;
  concept: string;
  syllabusHook: string;
  difficulty: BuildDifficulty;
  kind: BuildMissionKind;
  stage: BuildStageKind;
  minutes: string;
  xp: number;
  firstTryBonus: number;
  playable: boolean;
  /** Card cover art under /public */
  coverSrc: string;
  /** Longer mission brief shown in the task panel */
  description: string;
  /** Simple how-to steps (no full solution spoiler) */
  taskSteps: string[];
  coachIntro: string;
  successMsg: string;
  emptyMsg: string;
  hints: [string, string, string];
  /** Ordered solution step ids (primary) */
  solution: string[];
  /** Alternate accepted sequences */
  altSolutions?: string[][];
  steps: BuildStepDef[];
  distractors?: BuildStepDef[];
  /** Preload a broken program (debug missions) */
  starterOrder?: string[];
  maze?: BuildMazeConfig;
  stackTitle?: string;
  stackEmpty?: string;
  /** Optional pack tag for hub filters */
  pack?: "core" | "maze";
};

export const BUILD_MISSIONS: BuildMission[] = [
  {
    id: "B1",
    number: 1,
    title: "Sandwich Algorithm",
    blurb: "Stack the sandwich in the right order — algorithms are just recipes!",
    concept: "Sequence",
    syllabusHook: "A6 · What Is an Algorithm?",
    difficulty: "easy",
    kind: "sequence",
    stage: "stack",
    minutes: "3–5 min",
    xp: 3,
    firstTryBonus: 3,
    playable: true,
    coverSrc: "/learn/build/b1-sandwich.png",
    description:
      "An algorithm is a recipe: do steps in the right order. Stack sandwich pieces on the plate — skip the trick blocks.",
    taskSteps: [
      "Drag sandwich pieces from the toolbox onto your stack",
      "Build from the bottom up — like making a real sandwich",
      "Skip anything that is not a sandwich ingredient",
      "Press Run when your stack looks ready"
    ],
    coachIntro:
      "Hey! An algorithm is a recipe. Drag the steps in the right order to build my sandwich!",
    successMsg: "Sandwich complete! Nice sequencing!",
    emptyMsg: "Your plate is empty! Drag steps from the toolbox and stack them.",
    hints: [
      "Start from the bottom — what holds everything up?",
      "Bottom bread → veggies → cheese → top bread.",
      "Order: bottom bread, lettuce, tomato, cheese, top bread.",
    ],
    solution: [
      "bread_bottom",
      "lettuce",
      "tomato",
      "cheese",
      "bread_top",
    ],
    steps: [
      { id: "bread_bottom", label: "Bottom bread", glyph: "🍞", color: "#f5c542" },
      { id: "lettuce", label: "Add lettuce", glyph: "🥬", color: "#4ade80" },
      { id: "tomato", label: "Add tomato", glyph: "🍅", color: "#f87171" },
      { id: "cheese", label: "Add cheese", glyph: "🧀", color: "#fbbf24" },
      { id: "bread_top", label: "Top bread", glyph: "🍞", color: "#eab308" },
    ],
    distractors: [
      { id: "cookie", label: "Add a cookie", glyph: "🍪", color: "#c4a574" },
      { id: "wash", label: "Wash the plate", glyph: "🧼", color: "#94a3b8" },
    ],
    stackTitle: "Plate",
    stackEmpty: "Empty plate",
  },
  {
    id: "B2",
    number: 2,
    title: "Dino Path",
    blurb: "Help Dino walk three tiles to the star. Order matters!",
    concept: "Sequencing",
    syllabusHook: "A7 · Sequencing",
    difficulty: "easy",
    kind: "sequence",
    stage: "path",
    minutes: "5 min",
    xp: 3,
    firstTryBonus: 3,
    playable: true,
    coverSrc: "/learn/build/b2-dino-path.png",
    description:
      "Sequencing means order matters. Stack Forward three times so Dino walks to the star. Extra turns will send Dino the wrong way.",
    taskSteps: [
      "Look at the path from Dino to the star",
      "Add Forward blocks to walk along the tiles",
      "Avoid extra turns you do not need",
      "Press Run to see if Dino reaches the star"
    ],
    coachIntro: "Move me to the star — one step at a time!",
    successMsg: "I reached the star! Sequencing win!",
    emptyMsg: "No moves yet — drag Forward blocks into a stack.",
    hints: [
      "Look at the path left to right.",
      "I need three forward moves.",
      "Use Forward three times in a row.",
    ],
    solution: ["forward", "forward", "forward"],
    steps: [
      { id: "forward", label: "Forward", glyph: "➡️", color: "#ff6a1a" },
      { id: "left", label: "Turn left", glyph: "↩️", color: "#4f46e5" },
      { id: "right", label: "Turn right", glyph: "↪️", color: "#0d9488" },
    ],
    maze: {
      width: 4,
      height: 1,
      start: { x: 0, y: 0, dir: 0 },
      goal: { x: 3, y: 0 },
      walls: [],
      marks: [{ x: 3, y: 0, glyph: "⭐" }],
    },
  },
  {
    id: "B3",
    number: 3,
    title: "Build-a-Computer",
    blurb: "Drag parts together to make a working computer.",
    concept: "Systems",
    syllabusHook: "CS Unit 1 boss",
    difficulty: "easy",
    kind: "sequence",
    stage: "stack",
    minutes: "5–8 min",
    xp: 4,
    firstTryBonus: 3,
    playable: true,
    coverSrc: "/learn/build/b3-computer.png",
    description:
      "A computer needs parts in a sensible order: power, CPU (brain), memory, then screen. Skip banana and speaker-only — those are distractors.",
    taskSteps: [
      "Drag computer parts from the toolbox",
      "Put them together in an order that makes sense",
      "Think: power → brain → memory → screen",
      "Press Run when the computer looks complete"
    ],
    coachIntro: "A computer needs power, a brain, memory, and a screen!",
    successMsg: "Booted up! Your computer works!",
    emptyMsg: "No parts yet — drag computer parts into a stack.",
    hints: [
      "Start with power.",
      "Then the brain (CPU), then memory.",
      "Order: power → CPU → memory → screen.",
    ],
    solution: ["power", "cpu", "memory", "screen"],
    steps: [
      { id: "power", label: "Power", glyph: "🔌", color: "#fbbf24" },
      { id: "cpu", label: "CPU brain", glyph: "🧠", color: "#a78bfa" },
      { id: "memory", label: "Memory", glyph: "💾", color: "#38bdf8" },
      { id: "screen", label: "Screen", glyph: "🖥️", color: "#94a3b8" },
    ],
    distractors: [
      { id: "banana", label: "Banana", glyph: "🍌", color: "#fde047" },
      { id: "speaker_only", label: "Only speaker", glyph: "🔊", color: "#fb7185" },
    ],
    stackTitle: "Chassis",
    stackEmpty: "Empty case",
  },
  {
    id: "B4",
    number: 4,
    title: "Robot Maze Lite",
    blurb: "Sequence moves to guide the robot through a tiny maze.",
    concept: "Sequence + obstacles",
    syllabusHook: "CS Unit 2 boss",
    difficulty: "easy",
    kind: "maze",
    stage: "maze",
    minutes: "8 min",
    xp: 4,
    firstTryBonus: 3,
    playable: true,
    coverSrc: "/learn/build/b4-maze.png",
    description:
      "Plan before you run. Turn and move so the robot reaches the flag without walking into walls. Watch the maze grid on the right.",
    taskSteps: [
      "Study the maze — walls block the way",
      "Use Forward and turns to plan a safe path",
      "Keep the robot away from walls",
      "Press Run to reach the goal"
    ],
    coachIntro: "Walls hurt! Plan your path before you run.",
    successMsg: "Maze cleared — great planning!",
    emptyMsg: "No moves yet — stack turns and forwards.",
    hints: [
      "Don't walk into walls.",
      "Go along the top, then turn down.",
      "Forward → Forward → Right → Forward → Forward",
    ],
    solution: ["forward", "forward", "right", "forward", "forward"],
    steps: [
      { id: "forward", label: "Forward", glyph: "⬆️", color: "#ff6a1a" },
      { id: "left", label: "Turn left", glyph: "↩️", color: "#4f46e5" },
      { id: "right", label: "Turn right", glyph: "↪️", color: "#0d9488" },
    ],
    maze: {
      width: 3,
      height: 3,
      start: { x: 0, y: 0, dir: 0 },
      goal: { x: 2, y: 2 },
      walls: ["0,1"],
      marks: [{ x: 2, y: 2, glyph: "🏁" }],
    },
  },
  {
    id: "B5",
    number: 5,
    title: "Loop Garden",
    blurb: "Water every flower — loops beat copy-paste!",
    concept: "Loops",
    syllabusHook: "A8 · Loops",
    difficulty: "medium",
    kind: "maze",
    stage: "path",
    minutes: "8–10 min",
    xp: 5,
    firstTryBonus: 3,
    playable: true,
    coverSrc: "/learn/build/b5-loop-garden.png",
    description:
      "Loops repeat work. Water all four flowers with Repeat 4 × water, or water four times. Either solution counts.",
    taskSteps: [
      "Every flower needs water",
      "Use a loop (or repeat) instead of copying the same block",
      "Water each flower in order along the path",
      "Press Run when all flowers can get water"
    ],
    coachIntro: "Four flowers need water. Use the repeat block — or water four times!",
    successMsg: "Garden watered! Loops are power!",
    emptyMsg: "Nothing watered yet — drag Water or Repeat.",
    hints: [
      "A loop does the same thing again.",
      "You can water four times… or use Repeat 4×.",
      "Best: one Repeat 4 × water block.",
    ],
    solution: ["repeat4_water"],
    altSolutions: [["water", "water", "water", "water"]],
    steps: [
      { id: "repeat4_water", label: "Repeat 4 × water", glyph: "🔁", color: "#0d9488" },
      { id: "water", label: "Water once", glyph: "💧", color: "#38bdf8" },
    ],
    maze: {
      width: 4,
      height: 1,
      start: { x: 0, y: 0, dir: 0 },
      goal: { x: 3, y: 0 },
      walls: [],
      marks: [
        { x: 0, y: 0, glyph: "🌸" },
        { x: 1, y: 0, glyph: "🌼" },
        { x: 2, y: 0, glyph: "🌷" },
        { x: 3, y: 0, glyph: "🌻" },
      ],
    },
  },
  {
    id: "B6",
    number: 6,
    title: "If This, Then That",
    blurb: "Open treasure — or avoid the trap with a condition.",
    concept: "Conditions",
    syllabusHook: "A9 · If This, Then That",
    difficulty: "medium",
    kind: "maze",
    stage: "story",
    minutes: "10 min",
    xp: 5,
    firstTryBonus: 3,
    playable: true,
    coverSrc: "/learn/build/b6-conditions.png",
    description:
      "Conditions choose a path. Use the if-gold block so the right action happens for treasure vs trap.",
    taskSteps: [
      "Watch for treasure and traps on the path",
      "Use a condition: if this, then that",
      "Take good things, avoid bad ones",
      "Press Run to test your choices"
    ],
    coachIntro: "If you see gold, take it. If you see a trap, jump!",
    successMsg: "Smart choice — conditions unlocked!",
    emptyMsg: "No plan yet — drag the if / else block.",
    hints: [
      "Use an if block.",
      "Check for treasure first.",
      "Drop: If gold → take, else → jump",
    ],
    solution: ["if_gold_take_else_jump"],
    steps: [
      {
        id: "if_gold_take_else_jump",
        label: "If gold → take / else jump",
        glyph: "❓",
        color: "#f59e0b",
      },
    ],
    distractors: [
      { id: "always_take", label: "Always take", glyph: "✋", color: "#f87171" },
      { id: "always_jump", label: "Always jump", glyph: "🦘", color: "#38bdf8" },
    ],
  },
  {
    id: "B7",
    number: 7,
    title: "Debug the Dino",
    blurb: "Dino's program is broken — find and fix the bug!",
    concept: "Debugging",
    syllabusHook: "A10 · Debugging",
    difficulty: "medium",
    kind: "sequence",
    stage: "path",
    minutes: "8–10 min",
    xp: 5,
    firstTryBonus: 3,
    playable: true,
    coverSrc: "/learn/build/b7-debug.png",
    description:
      "Debugging means finding the mistake. A broken program is already loaded — remove the extra turn so only Forward × 3 remains.",
    taskSteps: [
      "Dino’s program already has a bug",
      "Read the blocks carefully",
      "Delete or fix the extra wrong move",
      "Press Run when the path looks correct"
    ],
    coachIntro: "Something's wrong in my code. Delete the extra turn!",
    successMsg: "Bug squashed! You're a debugger!",
    emptyMsg: "Program cleared — rebuild: Forward × 3.",
    hints: [
      "One step is wrong.",
      "Remove the extra turn.",
      "Should be Forward, Forward, Forward only.",
    ],
    solution: ["forward", "forward", "forward"],
    starterOrder: ["forward", "left", "forward", "forward"],
    steps: [
      { id: "forward", label: "Forward", glyph: "➡️", color: "#ff6a1a" },
      { id: "left", label: "Turn left", glyph: "↩️", color: "#4f46e5" },
    ],
    maze: {
      width: 4,
      height: 1,
      start: { x: 0, y: 0, dir: 0 },
      goal: { x: 3, y: 0 },
      walls: [],
      marks: [{ x: 3, y: 0, glyph: "⭐" }],
    },
  },
  {
    id: "B8",
    number: 8,
    title: "Move & Speak",
    blurb: "Make Dino walk on stage and say hello!",
    concept: "Events + motion",
    syllabusHook: "A12 · Making a Character Move",
    difficulty: "medium",
    kind: "story",
    stage: "story",
    minutes: "12 min",
    xp: 6,
    firstTryBonus: 3,
    playable: true,
    coverSrc: "/learn/build/b8-speak.png",
    description:
      "Events start stories. Stack: when flag clicked → move → say Hello. That runs Dino’s mini scene.",
    taskSteps: [
      "Start with the green-flag / start event",
      "Add a move, then a speak / say block",
      "Keep the order: first move, then talk",
      "Press Run to watch Dino on stage"
    ],
    coachIntro: "When the green flag clicks, I should move and talk!",
    successMsg: "Hello world — Dino said it!",
    emptyMsg: "Start with the green flag, then move and say.",
    hints: [
      "Start with when flag clicked.",
      "Then move, then say.",
      "Flag → move 10 → say Hi",
    ],
    solution: ["when_flag", "move", "say"],
    steps: [
      { id: "when_flag", label: "When flag clicked", glyph: "🚩", color: "#22c55e" },
      { id: "move", label: "Move 10 steps", glyph: "🚶", color: "#ff6a1a" },
      { id: "say", label: "Say Hello!", glyph: "💬", color: "#38bdf8" },
    ],
  },
  {
    id: "B9",
    number: 9,
    title: "Score Box",
    blurb: "Use a variable to count coins Dino collects.",
    concept: "Variables",
    syllabusHook: "A13 · Variables",
    difficulty: "moderate",
    kind: "story",
    stage: "story",
    minutes: "12–15 min",
    xp: 6,
    firstTryBonus: 3,
    playable: true,
    coverSrc: "/learn/build/b9-score.png",
    description:
      "Variables remember numbers. Set score to 0, then Score +1 twice so the score becomes 2.",
    taskSteps: [
      "Make a score box (variable) for coins",
      "Collect coins and add to the score",
      "Show the score going up",
      "Press Run to check the count"
    ],
    coachIntro: "Variables are boxes that remember numbers — like my coin score!",
    successMsg: "Score = 2! Variables remembered it!",
    emptyMsg: "Set score to 0, then add +1 twice.",
    hints: [
      "Make a score variable.",
      "Set it to 0 first.",
      "Then change by 1 for each coin (twice).",
    ],
    solution: ["set_score_0", "change_score_1", "change_score_1"],
    steps: [
      { id: "set_score_0", label: "Set score to 0", glyph: "📦", color: "#a78bfa" },
      { id: "change_score_1", label: "Score +1", glyph: "➕", color: "#22c55e" },
    ],
    distractors: [
      { id: "set_score_99", label: "Set score to 99", glyph: "💥", color: "#f87171" },
    ],
  },
  {
    id: "B10",
    number: 10,
    title: "Code-a-Story",
    blurb: "Build a tiny animation story with motion, say, and a choice.",
    concept: "Mini program",
    syllabusHook: "A15 · My First Mini Program",
    difficulty: "moderate",
    kind: "story",
    stage: "story",
    minutes: "15–20 min",
    xp: 8,
    firstTryBonus: 3,
    playable: true,
    coverSrc: "/learn/build/b10-story.png",
    description:
      "Capstone story: flag → move → say → if/else ending. Build the full mini program in one stack.",
    taskSteps: [
      "Build a tiny story with a few blocks",
      "Include motion, a say, and a choice",
      "Keep it short — beginning, middle, end",
      "Press Run to play your story"
    ],
    coachIntro: "Your longest build yet — tell a tiny story with blocks!",
    successMsg: "Story complete — Core pack cleared! Maze Pack unlocked next.",
    emptyMsg: "Flag → move → say → if/else ending.",
    hints: [
      "Start with the green flag.",
      "Move, say, then choose a path.",
      "Flag → move → say → if/else ending",
    ],
    solution: ["when_flag", "move", "say", "if_else"],
    steps: [
      { id: "when_flag", label: "When flag clicked", glyph: "🚩", color: "#22c55e" },
      { id: "move", label: "Move", glyph: "🚶", color: "#ff6a1a" },
      { id: "say", label: "Say line", glyph: "💬", color: "#38bdf8" },
      { id: "if_else", label: "If / else ending", glyph: "🔀", color: "#f59e0b" },
    ],
    pack: "core",
  },

  // ——— Maze Pack (Blockly Games / Code Quest inspired) ———
  {
    id: "B11",
    number: 11,
    title: "Maze · Straight Shot",
    blurb: "Walk a straight hallway to the flag — Forward four times.",
    concept: "Sequence",
    syllabusHook: "Maze Pack · Level 1",
    difficulty: "easy",
    kind: "maze",
    stage: "maze",
    minutes: "3–5 min",
    xp: 3,
    firstTryBonus: 3,
    playable: true,
    coverSrc: "/learn/build/b4-maze.png",
    pack: "maze",
    description:
      "Maze Pack intro: Dino faces the flag down a clear hallway. Stack Forward four times. No turns needed.",
    taskSteps: [
      "Walk straight toward the flag",
      "Use Forward blocks for each step",
      "No turns needed on this one",
      "Press Run to finish"
    ],
    coachIntro: "Easy start! Just walk straight to the flag.",
    successMsg: "Straight shot cleared!",
    emptyMsg: "Add Forward blocks until you reach the flag.",
    hints: [
      "Count the empty tiles to the flag.",
      "You need four Forward moves.",
      "Forward → Forward → Forward → Forward",
    ],
    solution: ["forward", "forward", "forward", "forward"],
    altSolutions: [["repeat4_forward"]],
    steps: [
      { id: "forward", label: "Forward", glyph: "⬆️", color: "#ff6a1a" },
      { id: "repeat4_forward", label: "Repeat 4 × Forward", glyph: "🔁", color: "#0d9488" },
      { id: "left", label: "Turn left", glyph: "↩️", color: "#4f46e5" },
      { id: "right", label: "Turn right", glyph: "↪️", color: "#0d9488" },
    ],
    maze: {
      width: 5,
      height: 1,
      start: { x: 0, y: 0, dir: 0 },
      goal: { x: 4, y: 0 },
      walls: [],
      marks: [{ x: 4, y: 0, glyph: "🏁" }],
    },
  },
  {
    id: "B12",
    number: 12,
    title: "Maze · The Corner",
    blurb: "Go across, turn, then go down — walls block the shortcut.",
    concept: "Turns",
    syllabusHook: "Maze Pack · Level 2",
    difficulty: "easy",
    kind: "maze",
    stage: "maze",
    minutes: "5–7 min",
    xp: 4,
    firstTryBonus: 3,
    playable: true,
    coverSrc: "/learn/build/b4-maze.png",
    pack: "maze",
    description:
      "Reach the flag around a wall. Walk east twice, turn right, then walk south twice.",
    taskSteps: [
      "A wall is in the way",
      "Forward, then turn the corner",
      "Keep going until you reach the flag",
      "Press Run to test your path"
    ],
    coachIntro: "There's a wall in the way — turn the corner!",
    successMsg: "Corner cleared — nice turning!",
    emptyMsg: "Plan Forward and Turn blocks before you Run.",
    hints: [
      "Go along the top first.",
      "After two Forwards, turn right.",
      "Forward ×2 → Right → Forward ×2",
    ],
    solution: ["forward", "forward", "right", "forward", "forward"],
    altSolutions: [
      ["repeat2_forward", "right", "repeat2_forward"],
      ["forward", "forward", "right", "repeat2_forward"],
      ["repeat2_forward", "right", "forward", "forward"],
    ],
    steps: [
      { id: "forward", label: "Forward", glyph: "⬆️", color: "#ff6a1a" },
      { id: "left", label: "Turn left", glyph: "↩️", color: "#4f46e5" },
      { id: "right", label: "Turn right", glyph: "↪️", color: "#0d9488" },
      { id: "repeat2_forward", label: "Repeat 2 × Forward", glyph: "🔁", color: "#0d9488" },
    ],
    maze: {
      width: 3,
      height: 3,
      start: { x: 0, y: 0, dir: 0 },
      goal: { x: 2, y: 2 },
      walls: ["0,1", "0,2"],
      marks: [{ x: 2, y: 2, glyph: "🏁" }],
    },
  },
  {
    id: "B13",
    number: 13,
    title: "Maze · Zigzag",
    blurb: "Weave past walls with a mix of turns and forwards.",
    concept: "Planning",
    syllabusHook: "Maze Pack · Level 3",
    difficulty: "medium",
    kind: "maze",
    stage: "maze",
    minutes: "7–9 min",
    xp: 5,
    firstTryBonus: 3,
    playable: true,
    coverSrc: "/learn/build/b4-maze.png",
    pack: "maze",
    description:
      "Walls force a zigzag. Trace the open path with your finger, then code it with Forward and turns.",
    taskSteps: [
      "Zigzag around the walls",
      "Mix Forward with left/right turns",
      "Plan before you run",
      "Press Run to reach the goal"
    ],
    coachIntro: "Zigzag time — don't walk into walls!",
    successMsg: "Zigzag mastered!",
    emptyMsg: "Empty program — stack moves that follow the open path.",
    hints: [
      "Start with one Forward, then turn right.",
      "Go down two tiles, then turn left.",
      "F → R → F → F → L → F → F",
    ],
    solution: [
      "forward",
      "right",
      "forward",
      "forward",
      "left",
      "forward",
      "forward",
    ],
    altSolutions: [
      ["forward", "right", "repeat2_forward", "left", "repeat2_forward"],
      ["forward", "right", "forward", "forward", "left", "repeat2_forward"],
    ],
    steps: [
      { id: "forward", label: "Forward", glyph: "⬆️", color: "#ff6a1a" },
      { id: "left", label: "Turn left", glyph: "↩️", color: "#4f46e5" },
      { id: "right", label: "Turn right", glyph: "↪️", color: "#0d9488" },
      { id: "repeat2_forward", label: "Repeat 2 × Forward", glyph: "🔁", color: "#0d9488" },
    ],
    maze: {
      width: 4,
      height: 3,
      start: { x: 0, y: 0, dir: 0 },
      goal: { x: 3, y: 2 },
      walls: ["2,0", "0,1", "2,1"],
      marks: [{ x: 3, y: 2, glyph: "🏁" }],
    },
  },
  {
    id: "B14",
    number: 14,
    title: "Maze · Loop Lane",
    blurb: "Use Repeat to walk a long hallway, then turn to the flag.",
    concept: "Loops",
    syllabusHook: "Maze Pack · Level 4 · A8",
    difficulty: "medium",
    kind: "maze",
    stage: "maze",
    minutes: "8–10 min",
    xp: 5,
    firstTryBonus: 3,
    playable: true,
    coverSrc: "/learn/build/b4-maze.png",
    pack: "maze",
    description:
      "A long top hallway then a drop to the flag. Prefer Repeat 3 × Forward instead of three separate Forwards.",
    taskSteps: [
      "A long hallway needs many steps",
      "Use a loop instead of stacking the same block",
      "Aim for the flag at the end",
      "Press Run when the loop looks right"
    ],
    coachIntro: "Long hallway? Loops beat copy-paste!",
    successMsg: "Loop lane cleared — efficient coding!",
    emptyMsg: "Try Repeat 3 × Forward, then turn toward the flag.",
    hints: [
      "The top row needs three Forwards.",
      "Then turn right and walk down twice.",
      "Repeat 3× Forward → Right → Forward → Forward",
    ],
    solution: ["repeat3_forward", "right", "forward", "forward"],
    altSolutions: [
      ["forward", "forward", "forward", "right", "forward", "forward"],
      ["repeat3_forward", "right", "repeat2_forward"],
      ["forward", "forward", "forward", "right", "repeat2_forward"],
    ],
    steps: [
      { id: "forward", label: "Forward", glyph: "⬆️", color: "#ff6a1a" },
      { id: "left", label: "Turn left", glyph: "↩️", color: "#4f46e5" },
      { id: "right", label: "Turn right", glyph: "↪️", color: "#0d9488" },
      { id: "repeat2_forward", label: "Repeat 2 × Forward", glyph: "🔁", color: "#0d9488" },
      { id: "repeat3_forward", label: "Repeat 3 × Forward", glyph: "🔁", color: "#14b8a6" },
    ],
    maze: {
      width: 4,
      height: 3,
      start: { x: 0, y: 0, dir: 0 },
      goal: { x: 3, y: 2 },
      walls: ["0,1", "1,1", "2,1"],
      marks: [{ x: 3, y: 2, glyph: "🏁" }],
    },
  },
  {
    id: "B15",
    number: 15,
    title: "Maze · Flag Master",
    blurb: "The hardest maze in the pack — plan every turn.",
    concept: "Maze mastery",
    syllabusHook: "Maze Pack · Boss",
    difficulty: "moderate",
    kind: "maze",
    stage: "maze",
    minutes: "10–12 min",
    xp: 6,
    firstTryBonus: 3,
    playable: true,
    coverSrc: "/learn/build/b4-maze.png",
    pack: "maze",
    description:
      "Boss maze: several walls, one open route. Trace it, then code Forward and turns. Loops help where you walk straight twice.",
    taskSteps: [
      "This maze has many walls",
      "Plan a careful path with turns",
      "Try a short route first, then fix mistakes",
      "Press Run to clear the boss maze"
    ],
    coachIntro: "Boss maze! Plan carefully — walls everywhere.",
    successMsg: "Maze Pack complete — you're a Flag Master!",
    emptyMsg: "This one's longer — sketch the path first.",
    hints: [
      "Start: Forward, then turn right into the open column.",
      "You'll need left and right turns more than once.",
      "One path: F → R → F → F → L → F → R → F → F → L → F → F",
    ],
    solution: [
      "forward",
      "right",
      "forward",
      "forward",
      "left",
      "forward",
      "right",
      "forward",
      "forward",
      "left",
      "forward",
      "forward",
    ],
    altSolutions: [
      [
        "forward",
        "right",
        "repeat2_forward",
        "left",
        "forward",
        "right",
        "repeat2_forward",
        "left",
        "repeat2_forward",
      ],
    ],
    steps: [
      { id: "forward", label: "Forward", glyph: "⬆️", color: "#ff6a1a" },
      { id: "left", label: "Turn left", glyph: "↩️", color: "#4f46e5" },
      { id: "right", label: "Turn right", glyph: "↪️", color: "#0d9488" },
      { id: "repeat2_forward", label: "Repeat 2 × Forward", glyph: "🔁", color: "#0d9488" },
    ],
    maze: {
      width: 5,
      height: 5,
      start: { x: 0, y: 0, dir: 0 },
      goal: { x: 4, y: 4 },
      walls: ["3,0", "0,1", "2,1", "4,2", "0,3", "1,3", "3,3"],
      marks: [{ x: 4, y: 4, glyph: "🏁" }],
    },
  },
];

export function getBuildMission(id: string): BuildMission | undefined {
  return BUILD_MISSIONS.find(
    (m) => m.id.toUpperCase() === id.trim().toUpperCase(),
  );
}

export function getNextBuildMission(currentId: string): BuildMission | null {
  const cur = getBuildMission(currentId);
  if (!cur) return null;
  return (
    BUILD_MISSIONS.find(
      (m) => m.playable && m.number === cur.number + 1,
    ) ?? null
  );
}

export function buildMissionPalette(mission: BuildMission): BuildStepDef[] {
  return [...mission.steps, ...(mission.distractors ?? [])];
}

export function arraysEqual(a: string[], b: string[]): boolean {
  if (a.length !== b.length) return false;
  return a.every((v, i) => v === b[i]);
}

export function matchesBuildSolution(
  order: string[],
  mission: BuildMission,
): boolean {
  if (arraysEqual(order, mission.solution)) return true;
  return (mission.altSolutions ?? []).some((alt) => arraysEqual(order, alt));
}

/** Expand special loop tokens for path / maze animation + simulation. */
export function expandBuildOrder(order: string[]): string[] {
  const out: string[] = [];
  for (const id of order) {
    if (id === "repeat4_water") {
      out.push("water", "water", "water", "water");
    } else if (id === "repeat2_forward") {
      out.push("forward", "forward");
    } else if (id === "repeat3_forward") {
      out.push("forward", "forward", "forward");
    } else if (id === "repeat4_forward") {
      out.push("forward", "forward", "forward", "forward");
    } else {
      out.push(id);
    }
  }
  return out;
}

const DX = [1, 0, -1, 0];
const DY = [0, 1, 0, -1];

export function simulateMaze(
  maze: BuildMazeConfig,
  order: string[],
): {
  ok: boolean;
  trail: { x: number; y: number; dir: BuildDir }[];
  hitWall: boolean;
} {
  let x = maze.start.x;
  let y = maze.start.y;
  let dir = maze.start.dir;
  const trail: { x: number; y: number; dir: BuildDir }[] = [{ x, y, dir }];
  const wall = new Set(maze.walls);

  for (const cmd of order) {
    if (cmd === "left") {
      dir = ((dir + 3) % 4) as BuildDir;
      trail.push({ x, y, dir });
      continue;
    }
    if (cmd === "right") {
      dir = ((dir + 1) % 4) as BuildDir;
      trail.push({ x, y, dir });
      continue;
    }
    if (cmd === "forward") {
      const nx = x + DX[dir];
      const ny = y + DY[dir];
      if (
        nx < 0 ||
        ny < 0 ||
        nx >= maze.width ||
        ny >= maze.height ||
        wall.has(`${nx},${ny}`)
      ) {
        return { ok: false, trail, hitWall: true };
      }
      x = nx;
      y = ny;
      trail.push({ x, y, dir });
      continue;
    }
    // non-move tokens (water etc.) — stay put but record beat
    trail.push({ x, y, dir });
  }

  const ok = x === maze.goal.x && y === maze.goal.y;
  return { ok, trail, hitWall: false };
}
