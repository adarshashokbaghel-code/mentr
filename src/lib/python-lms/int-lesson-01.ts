import type { PythonLmsLesson } from "@/lib/python-lms/types";

export const INT_LESSON_01: PythonLmsLesson = {
  slug: "int-01",
  number: 1,
  title: "How developers solve problems",
  subtitle: "Specs, examples, edge cases, then code",
  minutes: 35,
  course: "intermediate",
  goals: [
    "Turn a short spec into steps before coding",
    "List examples and edge cases",
    "Write tiny test inputs on paper",
    "Split work into functions",
    "Use run → traceback → fix",
  ],
  canDo: "Take a one-paragraph spec and produce steps, edge cases and a working function with tests.",

  notes: [
    {
      id: "spec-first",
      part: "Part 1 · Job-ready workflow",
      title: "Read the spec twice",
      blocks: [
        {
          type: "lead",
          text: "In internships and interviews, you get a **problem statement**, not a syntax quiz. Your first job is to understand what “done” means.",
        },
        {
          type: "list",
          ordered: true,
          items: [
            "Read the spec — underline inputs, outputs and rules.",
            "Write **two normal examples** by hand.",
            "Write **two edge cases** (empty, zero, huge, wrong type).",
            "Only then open the editor.",
          ],
        },
        {
          type: "callout",
          tone: "exam",
          title: "Interview tip",
          text: "Say your examples out loud before coding. Reviewers hire people who de-risk work, not people who type fastest.",
        },
      ],
    },
    {
      id: "edge-cases",
      part: "Part 1 · Job-ready workflow",
      title: "Edge cases beat happy path",
      blocks: [
        {
          type: "p",
          text: "Happy path is what the user expects on a good day. **Edge cases** are the inputs that break naive code.",
        },
        {
          type: "table",
          head: ["Feature", "Happy path", "Edge case"],
          rows: [
            ["Age checker", "age = 25", "age = -1 or age = 200"],
            ["Average score", "scores = [80, 90]", "scores = [] (empty list)"],
            ["Login", "valid password", "empty password"],
          ],
        },
        {
          type: "check",
          id: "c-edge",
          question: "Which is the best edge case to test for a function that divides two numbers?",
          options: ["a = 1, b = 1", "a = 100, b = 2", "b = 0", "a = 0, b = 5"],
          answer: 2,
          explain: "Division by zero must be handled or rejected — that's the classic edge case.",
        },
      ],
    },
    {
      id: "functions-small",
      part: "Part 2 · Structure",
      title: "One function, one job",
      blocks: [
        {
          type: "p",
          text: "Split the program into **functions** with clear names. If a function needs a paragraph to explain, it's doing too much.",
        },
        {
          type: "code",
          code: `def classify_temp(celsius):
    """Return 'fever', 'normal' or 'too cold' for body temp in °C."""
    if celsius >= 38:
        return "fever"
    if celsius <= 35:
        return "too cold"
    return "normal"`,
          live: true,
        },
        {
          type: "callout",
          tone: "tip",
          text: "Docstrings are one line in small scripts — they tell the next developer (often you in two weeks) what the function promises.",
        },
      ],
    },
    {
      id: "debug-loop",
      part: "Part 2 · Structure",
      title: "The debug loop",
      blocks: [
        {
          type: "flow",
          title: "When something fails",
          steps: [
            { kind: "terminal", text: "Run the program" },
            { kind: "process", text: "Read the traceback from the bottom line up" },
            { kind: "decision", text: "Is it your logic or a typo?" },
            { kind: "io", text: "Fix one thing, run again" },
          ],
        },
        {
          type: "check",
          id: "c-trace",
          question: "On a traceback, which line do you read first to find *your* bug?",
          options: ["The very first line", "The last line in your file", "The bottom-most line mentioning your .py file", "The middle line"],
          answer: 2,
          explain: "Start at the bottom — the last frame in *your* code is usually where the fix belongs.",
        },
      ],
    },
  ],

  examples: [
    {
      type: "trace",
      id: "ex-classify",
      title: "Trace classify_temp",
      intro: "Three readings — watch how only one branch runs each time.",
      code: `def classify_temp(c):
    if c >= 38:
        return "fever"
    if c <= 35:
        return "too cold"
    return "normal"

print(classify_temp(36.8))
print(classify_temp(39))
print(classify_temp(34))`,
      steps: [
        { line: 8, output: "normal\n", note: "36.8 is between 35 and 38." },
        { line: 9, output: "fever\n", note: "39 triggers the first branch." },
        { line: 10, output: "too cold\n", note: "34 is below 35." },
      ],
    },
    {
      type: "playground",
      id: "ex-play-temp",
      title: "Add a test table",
      intro: "Loop over test cases — this is how junior devs verify work before submitting.",
      starter: `def classify_temp(c):
    if c >= 38:
        return "fever"
    if c <= 35:
        return "too cold"
    return "normal"

tests = [(36.8, "normal"), (39, "fever"), (34, "too cold")]
for temp, expected in tests:
    got = classify_temp(temp)
    print(temp, "->", got, "OK" if got == expected else "FAIL")`,
      tryThis: ["Add (38, 'fever') as a boundary test", "Print only failures"],
      goal: {
        text: "Every test line ends with OK",
        check: (r) => r.ok && !r.error && (r.stdout?.includes("OK") ?? false) && !(r.stdout?.includes("FAIL") ?? false),
        success: "All three tests passed — that's shippable thinking.",
      },
    },
  ],

  practice: [
    {
      id: "q1",
      type: "mcq",
      skill: "Planning",
      level: "easy",
      prompt: "Before coding, you should list…",
      options: ["Only variable names", "Examples and edge cases", "Every Python keyword", "Your résumé bullets"],
      answer: 2,
      explain: "Examples and edge cases de-risk the spec.",
    },
    {
      id: "q2",
      type: "mcq",
      skill: "Functions",
      level: "easy",
      prompt: "What does classify_temp(37) return with the lesson's rules?",
      code: `def classify_temp(c):
    if c >= 38: return "fever"
    if c <= 35: return "too cold"
    return "normal"`,
      options: ["fever", "normal", "too cold", "Error"],
      answer: 1,
      explain: "37 is between 35 and 38.",
    },
    {
      id: "q3",
      type: "order",
      skill: "Workflow",
      level: "medium",
      prompt: "Put the job-ready workflow in order.",
      lines: ["Write edge cases", "Read the spec", "Run and fix", "Code the function"],
      explain: "Spec → cases → code → run/fix.",
    },
    {
      id: "q4",
      type: "write",
      skill: "Functions",
      level: "medium",
      prompt: "Complete the function so scores >= 40 return 'pass', else 'fail'.",
      starter: `def grade(score):
    # your code here
    pass

print(grade(40))
print(grade(39))`,
      hint: "Use if / else and return strings.",
      solution: `def grade(score):
    if score >= 40:
        return "pass"
    return "fail"`,
      check: (r) => {
        if (!r.ok) return r.error || "Program error";
        const out = (r.stdout ?? "").trim();
        if (!out.includes("pass") || !out.includes("fail")) return "Print pass and fail for 40 and 39";
        return null;
      },
    },
  ],
};
