import type { PythonLmsLesson } from "@/lib/python-lms/types";

export const INT_LESSON_07: PythonLmsLesson = {
  slug: "int-07",
  number: 7,
  title: "Functions in depth",
  subtitle: "FN-701 — scope, defaults, purity, docstrings",
  minutes: 95,
  course: "intermediate",
  goals: [
    "Explain local vs global scope and why globals in features fail review",
    "Use default parameters safely — never mutable defaults",
    "Write pure functions: same inputs → same outputs, no hidden mutation",
    "Add a one-line docstring reviewers expect on public helpers",
    "Ship FN-701 line_total(qty, price, tax_rate=0.18)",
  ],
  canDo: "Implement FN-701 with default tax, document it, and pass matrix tests without touching globals.",

  notes: [
    {
      id: "bridge",
      part: "Chapter 1 · Functions as contracts",
      title: "Tickets become functions",
      blocks: [
        {
          type: "lead",
          text: "Every LOG/STR/TPL ticket is a **function contract**: inputs, output, no surprise side effects. Lesson 7 is how senior reviewers **read** your functions.",
        },
      ],
    },
    {
      id: "scope",
      part: "Chapter 2 · Scope",
      title: "Local names vs global",
      blocks: [
        {
          type: "code",
          code: `total = 0
def add_one(x):
    total = x + 1
    return total

print(add_one(5), total)`,
          live: true,
          output: "6 0",
        },
        {
          type: "p",
          text: "Assignment inside a function creates a **local** total unless you use **global** (avoid global for feature logic).",
        },
      ],
    },
    {
      id: "defaults",
      part: "Chapter 3 · Defaults",
      title: "Default arguments",
      blocks: [
        {
          type: "code",
          code: `def line_total(qty, price, tax_rate=0.18):
    return qty * price * (1 + tax_rate)

print(line_total(2, 100))
print(line_total(2, 100, 0.0))`,
          live: true,
          output: "236.0\n200.0",
        },
        {
          type: "callout",
          tone: "warn",
          title: "Mutable default trap",
          text: "Never def f(items=[]): — shared list across calls. Use def f(items=None): items = items or [].",
        },
      ],
    },
    {
      id: "case-fn701",
      part: "Case study · FN-701",
      title: "line_total spec",
      blocks: [
        {
          type: "callout",
          tone: "exam",
          title: "FN-701 · line_total(qty, price, tax_rate=0.18)",
          text: "Return qty * price * (1 + tax_rate). All numbers are floats or ints — use normal arithmetic. Pure function.",
        },
        {
          type: "check",
          id: "c-pure",
          question: "Pure function means?",
          options: [
            "Uses print",
            "Same args → same return; no mutate external state",
            "Must be one line",
            "Cannot call other functions",
          ],
          answer: 1,
          explain: "Testable and predictable.",
        },
      ],
    },
    {
      id: "docstrings",
      part: "Chapter 4 · Documentation",
      title: "Docstrings",
      blocks: [
        {
          type: "code",
          code: `def line_total(qty, price, tax_rate=0.18):
    """Return line total including tax."""
    return qty * price * (1 + tax_rate)`,
          live: false,
        },
      ],
    },
    {
      id: "capstone",
      part: "Chapter 5 · Next",
      title: "Errors",
      blocks: [{ type: "p", text: "Lesson 8: **try/except** when users supply bad text — still keep core math pure." }],
    },
  ],

  examples: [
    {
      type: "playground",
      id: "ex-fn701",
      title: "FN-701 line_total",
      intro: "Default tax 18%.",
      starter: `def line_total(qty, price, tax_rate=0.18):
    return qty * price * (1 + tax_rate)

print("OK" if line_total(1, 100) == 118.0 else "FAIL")
print("OK" if line_total(2, 50, 0) == 100.0 else "FAIL")`,
      tryThis: ["tax_rate 0.5"],
      goal: {
        text: "Both OK",
        check: (r) => (r.stdout ?? "").split("OK").length >= 3,
        success: "FN-701 passes.",
      },
    },
  ],

  practice: [
    {
      id: "q1",
      type: "mcq",
      skill: "Defaults",
      level: "easy",
      prompt: "def f(x=1): — calling f() passes x as?",
      options: ["Error", "1", "None", "0"],
      answer: 1,
      explain: "Default used when arg omitted.",
    },
    {
      id: "q2",
      type: "write",
      skill: "FN-701",
      level: "medium",
      prompt: "line_total(qty, price, tax_rate=0.18)",
      starter: `def line_total(qty, price, tax_rate=0.18):
    pass
print(line_total(10, 10) == 118.0)`,
      hint: "qty * price * (1 + tax_rate)",
      solution: `def line_total(qty, price, tax_rate=0.18):
    return qty * price * (1 + tax_rate)`,
      check: (r) => ((r.stdout ?? "").includes("True") ? null : "Expected True"),
    },
    {
      id: "q3",
      type: "mcq",
      skill: "Trap",
      level: "hard",
      prompt: "Classic bug: def add(item, bucket=[]): bucket.append(item); return bucket — problem?",
      options: ["Syntax error", "Same list reused across calls", "Too slow", "Needs global"],
      answer: 1,
      explain: "Mutable default is shared state.",
    },
  ],
};
