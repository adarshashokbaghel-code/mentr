import type { PythonLmsLesson } from "@/lib/python-lms/types";

export const INT_LESSON_12: PythonLmsLesson = {
  slug: "int-12",
  number: 12,
  title: "Debug, test, ship",
  subtitle: "TST-1201 — tracebacks, assert, ship checklist",
  minutes: 95,
  course: "intermediate",
  goals: [
    "Read a traceback bottom-up to the line you wrote",
    "Use assert for invariants in scripts — know -O strips them",
    "Write tiny test functions and table-driven asserts",
    "Apply a ship checklist: spec, tests, no debug print in lib code",
    "Ship TST-1201 assert_equal helper used in a mini test table",
  ],
  canDo: "Debug from traceback, lock behaviour with assert_equal(got, expected), and explain ship checklist to a reviewer.",

  notes: [
    {
      id: "bridge",
      part: "Chapter 1 · Finish the arc",
      title: "From ticket to shipped",
      blocks: [
        {
          type: "lead",
          text: "Lessons 1–11 built **spec → code → data structures**. Lesson 12 is how you **prove** it works and **fix** it when red.",
        },
        {
          type: "list",
          ordered: true,
          items: [
            "Read ticket acceptance table",
            "Implement pure function",
            "Matrix print OK / use assert_equal",
            "Remove scratch prints; open PR",
          ],
        },
      ],
    },
    {
      id: "traceback",
      part: "Chapter 2 · Tracebacks",
      title: "Read from the bottom",
      blocks: [
        {
          type: "p",
          text: "Last line: **exception type and message**. Lines above: **your file and line number**. Start at the bottom, then jump to **your** frame — not library internals first.",
        },
        {
          type: "callout",
          tone: "tip",
          title: "NameError vs AttributeError",
          text: "NameError: variable not defined. AttributeError: object lacks method/field — often typo or None where you expected a dict.",
        },
      ],
    },
    {
      id: "assert",
      part: "Chapter 3 · assert",
      title: "assert_equal pattern",
      blocks: [
        {
          type: "code",
          code: `def assert_equal(got, expected):
    assert got == expected, f"{got!r} != {expected!r}"

assert_equal(2 + 2, 4)
print("OK")`,
          live: true,
          output: "OK",
        },
        {
          type: "callout",
          tone: "warn",
          title: "python -O",
          text: "Optimised mode removes asserts — libraries use **pytest**; scripts and LMS drills use asserts for learning.",
        },
      ],
    },
    {
      id: "case-tst1201",
      part: "Case study · TST-1201",
      title: "Mini test runner",
      blocks: [
        {
          type: "code",
          code: `def assert_equal(got, expected):
    assert got == expected, f"{got!r} != {expected!r}"

def run_has_duplicate_tests():
    def has_duplicate(values):
        seen = set()
        for x in values:
            if x in seen:
                return True
            seen.add(x)
        return False
    assert_equal(has_duplicate([]), False)
    assert_equal(has_duplicate([1, 1]), True)

run_has_duplicate_tests()
print("ALL OK")`,
          live: true,
          output: "ALL OK",
        },
      ],
    },
    {
      id: "ship-checklist",
      part: "Chapter 4 · Ship",
      title: "Definition of done (intermediate course)",
      blocks: [
        {
          type: "table",
          head: ["Check", "Why"],
          rows: [
            ["Matrix tests green", "Regression safety"],
            ["No input mutation", "Callers trust you"],
            ["Edge empty/None", "Production uploads break"],
            ["Readable names", "Next intern maintains it"],
          ],
        },
      ],
    },
    {
      id: "capstone",
      part: "Chapter 5 · Portfolio",
      title: "Intermediate capstone preview",
      blocks: [
        {
          type: "p",
          text: "Combine **JSON settings**, **Task class**, **parse row**, and **tests** in the **JSON expense tracker** capstone — portfolio narrative for internships.",
        },
      ],
    },
  ],

  examples: [
    {
      type: "playground",
      id: "ex-tst1201",
      title: "TST-1201 assert_equal table",
      intro: "Run asserts for stats tuple.",
      starter: `def assert_equal(got, expected):
    assert got == expected, f"{got!r} != {expected!r}"

def stats(values):
    if not values:
        return (0, 0, 0.0)
    c = len(values)
    t = sum(values)
    return (c, t, t / c)

assert_equal(stats([]), (0, 0, 0.0))
assert_equal(stats([1, 2, 3]), (3, 6, 2.0))
print("ALL OK")`,
      tryThis: ["Break stats — see AssertionError"],
      goal: {
        text: "ALL OK",
        check: (r) => (r.stdout ?? "").includes("ALL OK"),
        success: "Test helper works.",
      },
    },
  ],

  practice: [
    {
      id: "q1",
      type: "mcq",
      skill: "Traceback",
      level: "easy",
      prompt: "First place to look in traceback?",
      options: ["Top line always", "Bottom exception line then your frame", "Middle only", "Ignore"],
      answer: 1,
      explain: "Bottom shows what failed.",
    },
    {
      id: "q2",
      type: "write",
      skill: "TST-1201",
      level: "medium",
      prompt: "Implement assert_equal(got, expected) with message on failure.",
      starter: `def assert_equal(got, expected):
    pass

try:
    assert_equal(1, 2)
except AssertionError:
    print("raised")
else:
    print("no raise")
assert_equal(2, 2)
print("OK")`,
      hint: "assert got == expected, f-string message",
      solution: `def assert_equal(got, expected):
    assert got == expected, f"{got!r} != {expected!r}"`,
      check: (r) => {
        const out = r.stdout ?? "";
        if (!out.includes("raised") || !out.includes("OK")) return "Need raised then OK";
        return null;
      },
    },
    {
      id: "q3",
      type: "order",
      skill: "Ship",
      level: "easy",
      prompt: "Order debug session.",
      lines: [
        "Reproduce with smallest input",
        "Read traceback bottom",
        "Fix line; re-run matrix",
        "Add assert for regression",
      ],
      explain: "Reproduce → diagnose → fix → lock.",
    },
    {
      id: "q4",
      type: "mcq",
      skill: "assert",
      level: "medium",
      prompt: "assert in production library vs pytest?",
      options: ["assert only always", "pytest/unittest for libs; assert ok in scripts", "never test", "print only"],
      answer: 1,
      explain: "-O drops assert.",
    },
  ],
};
