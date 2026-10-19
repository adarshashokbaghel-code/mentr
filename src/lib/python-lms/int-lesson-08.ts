import type { PythonLmsLesson } from "@/lib/python-lms/types";

export const INT_LESSON_08: PythonLmsLesson = {
  slug: "int-08",
  number: 8,
  title: "Errors & reliability",
  subtitle: "ERR-801 — try/except that helps users",
  minutes: 93,
  course: "intermediate",
  goals: [
    "Use try/except/else/finally at a high level — catch expected failures only",
    "Prefer specific exceptions (ValueError) over bare except",
    "Re-raise or wrap errors with context messages",
    "Ship ERR-801 parse_int(text) with friendly failure",
    "Fail fast on programmer bugs, handle user input gracefully",
  ],
  canDo: "Deliver ERR-801: return int on valid text, None on bad input (v1) — no bare except: pass.",

  notes: [
    {
      id: "bridge",
      part: "Chapter 1 · Failure is normal",
      title: "Users type garbage",
      blocks: [
        {
          type: "lead",
          text: "Lesson 4 used **isdigit** guards. Production also uses **try/except** around **int()**, **json.loads**, and file IO — catch what you expect, let the rest crash in dev.",
        },
      ],
    },
    {
      id: "try-except",
      part: "Chapter 2 · Syntax",
      title: "try / except ValueError",
      blocks: [
        {
          type: "code",
          code: `def parse_int(text):
    try:
        return int(text.strip())
    except ValueError:
        return None

print(parse_int("42"))
print(parse_int("42x"))`,
          live: true,
          output: "42\nNone",
        },
        {
          type: "callout",
          tone: "warn",
          title: "Never bare except: pass",
          text: "Hides KeyboardInterrupt and bugs. Catch **ValueError** (or a tuple of expected types).",
        },
      ],
    },
    {
      id: "case-err801",
      part: "Case study · ERR-801",
      title: "parse_int contract",
      blocks: [
        {
          type: "callout",
          tone: "exam",
          title: "ERR-801 · parse_int(text)",
          text: "Return int for valid integer strings (strip whitespace). Return None if int conversion fails. Do not print.",
        },
        {
          type: "table",
          head: ["Input", "Output"],
          rows: [
            ['"  7 "', "7"],
            ['"0"', "0"],
            ['""', "None or fail per strip — empty → None"],
            ['"3.5"', "None"],
          ],
        },
      ],
    },
    {
      id: "raise",
      part: "Chapter 3 · raise",
      title: "Adding context",
      blocks: [
        {
          type: "code",
          code: `def parse_int_strict(text):
    try:
        return int(text.strip())
    except ValueError:
        raise ValueError(f"not an integer: {text!r}")`,
          live: false,
        },
        {
          type: "p",
          text: "Strict APIs **raise**; batch ingest often returns **None** and counts bad rows.",
        },
      ],
    },
    {
      id: "capstone",
      part: "Chapter 4 · Next",
      title: "JSON",
      blocks: [{ type: "p", text: "Lesson 9 applies the same mindset to **json.loads** failures." }],
    },
  ],

  examples: [
    {
      type: "playground",
      id: "ex-err801",
      title: "ERR-801 parse_int",
      intro: "Return None on bad input.",
      starter: `def parse_int(text):
    try:
        return int(text.strip())
    except ValueError:
        return None

TESTS = [("42", 42), ("  7 ", 7), ("x", None), ("3.5", None)]
for s, exp in TESTS:
    got = parse_int(s)
    print(s, "OK" if got == exp else f"FAIL {got}")`,
      tryThis: ['Empty string ""'],
      goal: {
        text: "All OK",
        check: (r) => !(r.stdout ?? "").includes("FAIL"),
        success: "ERR-801 done.",
      },
    },
  ],

  practice: [
    {
      id: "q1",
      type: "mcq",
      skill: "Except",
      level: "easy",
      prompt: "int('abc') raises?",
      options: ["KeyError", "ValueError", "TypeError always", "None"],
      answer: 1,
      explain: "Invalid literal for int().",
    },
    {
      id: "q2",
      type: "write",
      skill: "ERR-801",
      level: "medium",
      prompt: "parse_int(text) → int or None.",
      starter: `def parse_int(text):
    pass
print(parse_int("10") == 10 and parse_int("z") is None)`,
      hint: "try int(strip) except ValueError return None",
      solution: `def parse_int(text):
    try:
        return int(text.strip())
    except ValueError:
        return None`,
      check: (r) => ((r.stdout ?? "").includes("True") ? null : "Fix parse_int"),
    },
    {
      id: "q3",
      type: "mcq",
      skill: "Style",
      level: "medium",
      prompt: "Worst pattern in production?",
      options: ["except ValueError:", "except Exception as e: log; raise", "except: pass", "try/else"],
      answer: 2,
      explain: "Bare except pass hides everything.",
    },
  ],
};
