import type { PythonLmsLesson } from "@/lib/python-lms/types";

export const INT_LESSON_05: PythonLmsLesson = {
  slug: "int-05",
  number: 5,
  title: "Tuples & records",
  subtitle: "TPL-501 / TPL-502 — fixed rows, unpack, return many values",
  minutes: 92,
  course: "intermediate",
  goals: [
    "Use tuples for fixed-shape rows that should not grow like lists",
    "Pack and unpack values — including swap and multiple return values",
    "Return (count, sum, avg) from stats without a class yet",
    "Choose tuple vs list vs dict for a given ticket spec",
    "Explain immutability and why t[0] = 1 fails",
    "Wire tuple rows from STR-401 dicts when APIs want ordered columns",
  ],
  canDo: "Ship TPL-501 stats(values) and TPL-502 person_tuple(row_dict) — matrix-tested tuples and clean unpacking.",

  notes: [
    {
      id: "bridge-int04",
      part: "Chapter 1 · Rows in memory",
      title: "Dict vs tuple — both describe a person row",
      blocks: [
        {
          type: "lead",
          text: "Lesson 4 parsed **dict** rows with named keys. Tuples store **ordered fields** — great for **returning multiple values**, **coordinates**, and **immutable snapshots** before you model a class.",
        },
        {
          type: "compare",
          left: {
            label: "Dict row (Lesson 4)",
            code: `{"name": "ada", "age": 30, "city": "BLR"}`,
            output: "Keys explicit in code",
            tone: "good",
          },
          right: {
            label: "Tuple row",
            code: `("ada", 30, "BLR")`,
            output: "Position 0,1,2 — document order",
            tone: "neutral",
          },
        },
        {
          type: "check",
          id: "c-bridge",
          question: "Function must return min and max without a dict. Best return type?",
          options: ["Two separate globals", "Tuple (lo, hi)", "List you mutate", "Set of two ints"],
          answer: 1,
          explain: "Tuple packs two results; caller unpacks lo, hi = min_max(nums).",
        },
      ],
    },
    {
      id: "tuple-syntax",
      part: "Chapter 1 · Rows in memory",
      title: "Creating tuples",
      blocks: [
        {
          type: "list",
          items: [
            "**Literal**: point = (3, 4) — commas create the tuple",
            "**One item**: (42,) — trailing comma required",
            "**Parentheses alone**: (42) is an int — use (42,) for a 1-tuple",
            "**Empty**: () or tuple()",
            "**From iterable**: tuple([1, 2])",
          ],
        },
        {
          type: "code",
          code: `one = (42,)
not_tuple = (42)
print(type(one), type(not_tuple))`,
          live: true,
          output: "<class 'tuple'> <class 'int'>",
        },
      ],
    },
    {
      id: "immutability",
      part: "Chapter 2 · Immutability",
      title: "Why tuples do not grow or assign",
      blocks: [
        {
          type: "p",
          text: "Tuples are **immutable**: no .append, no t[i] = new_value. That makes them **hashable** (when all elements are hashable) — usable as **dict keys** or **set members**.",
        },
        {
          type: "callout",
          tone: "warn",
          title: "Interview line",
          text: "Use a **list** when the collection changes size; use a **tuple** when the **shape is fixed** and you want to prevent accidental mutation.",
        },
        {
          type: "check",
          id: "c-immut",
          question: "t = (1, 2); t[0] = 9 — what happens?",
          options: ["t becomes (9, 2)", "TypeError", "Silently ignored", "Creates a list"],
          answer: 1,
          explain: "Tuple assignment to index is forbidden.",
        },
      ],
    },
    {
      id: "case-tpl501",
      part: "Case study A · TPL-501",
      title: "Ticket: stats(values)",
      blocks: [
        {
          type: "callout",
          tone: "exam",
          title: "TPL-501 · stats(values)",
          text: "Input: list of numbers (non-empty for this ticket). Output: tuple (count, total, average) where average is total / count (float). Empty list → return (0, 0, 0.0). Pure function.",
        },
        {
          type: "code",
          code: `def stats(values):
    if not values:
        return (0, 0, 0.0)
    count = len(values)
    total = sum(values)
    return (count, total, total / count)

print(stats([10, 20, 30]))`,
          live: true,
          output: "(3, 60, 20.0)",
        },
      ],
    },
    {
      id: "unpacking",
      part: "Chapter 3 · Unpacking",
      title: "Unpacking and starred rest",
      blocks: [
        {
          type: "code",
          code: `count, total, avg = stats([1, 2, 3])
print(count, avg)

first, *rest = [1, 2, 3, 4]
print(first, rest)`,
          live: true,
          output: "3 2.0\n1 [2, 3, 4]",
        },
        {
          type: "p",
          text: "**a, b = b, a** swaps with tuple packing — no temp variable.",
        },
      ],
    },
    {
      id: "case-tpl502",
      part: "Case study B · TPL-502",
      title: "Ticket: person_tuple(d)",
      blocks: [
        {
          type: "callout",
          tone: "exam",
          title: "TPL-502 · person_tuple(d)",
          text: "Input: dict with keys name, age, city (STR-401 shape). Output: tuple (name, age, city) in that order. Assume d is valid.",
        },
        {
          type: "code",
          code: `def person_tuple(d):
    return (d["name"], d["age"], d["city"])

row = {"name": "ada", "age": 30, "city": "BLR"}
print(person_tuple(row))`,
          live: true,
          output: "('ada', 30, 'BLR')",
        },
      ],
    },
    {
      id: "tuple-vs-list",
      part: "Chapter 4 · Choices",
      title: "When tuple beats list",
      blocks: [
        {
          type: "table",
          head: ["Need", "Pick"],
          rows: [
            ["Homogeneous log of events", "list"],
            ["RGB triple, lat/lon pair", "tuple"],
            ["Return two numbers from fn", "tuple"],
            ["JSON with named fields", "dict"],
          ],
        },
        {
          type: "check",
          id: "c-pick",
          question: "Store (year, month, day) that must never change in place?",
          options: ["list", "tuple", "set", "dict only"],
          answer: 1,
          explain: "Fixed triple — tuple signals immutability.",
        },
      ],
    },
    {
      id: "testing-tuples",
      part: "Chapter 5 · Tests",
      title: "Assert tuple equality",
      blocks: [
        {
          type: "code",
          code: `assert stats([1, 2]) == (2, 3, 1.5)
assert stats([]) == (0, 0, 0.0)
print("OK")`,
          live: true,
          output: "OK",
        },
      ],
    },
    {
      id: "capstone",
      part: "Chapter 5 · Tests",
      title: "Preview · comprehensions",
      blocks: [
        {
          type: "p",
          text: "Next lesson: build lists and dicts in one expression — **comprehensions** — while keeping tuple returns for stats().",
        },
      ],
    },
  ],

  examples: [
    {
      type: "trace",
      id: "ex-stats",
      title: "Trace: stats on three values",
      intro: "Pack count, sum, average.",
      code: `def stats(values):
    if not values:
        return (0, 0, 0.0)
    c = len(values)
    t = sum(values)
    return (c, t, t / c)

c, t, a = stats([2, 4, 6])
print(c, a)`,
      steps: [{ line: 8, output: "3 4.0\n", note: "Unpack after tuple return." }],
    },
    {
      type: "playground",
      id: "ex-tpl501",
      title: "Deliverable · TPL-501 stats",
      intro: "Implement stats(values).",
      starter: `def stats(values):
    if not values:
        return (0, 0, 0.0)
    count = len(values)
    total = sum(values)
    return (count, total, total / count)

TESTS = [
    ([], (0, 0, 0.0)),
    ([5], (1, 5, 5.0)),
    ([1, 2, 3], (3, 6, 2.0)),
]
for vals, exp in TESTS:
    got = stats(vals)
    print("OK" if got == exp else f"FAIL {got}")`,
      tryThis: ["Add [10, 20] row"],
      goal: {
        text: "All OK",
        check: (r) => !r.ok || r.error ? false : !(r.stdout ?? "").includes("FAIL"),
        success: "TPL-501 passes.",
      },
    },
    {
      type: "playground",
      id: "ex-tpl502",
      title: "Deliverable · TPL-502 person_tuple",
      intro: "Dict to tuple row.",
      starter: `def person_tuple(d):
    return (d["name"], d["age"], d["city"])

d = {"name": "x", "age": 1, "city": "Y"}
print("OK" if person_tuple(d) == ("x", 1, "Y") else "FAIL")`,
      tryThis: ["Wrong key order in return — tests fail"],
      goal: {
        text: "OK",
        check: (r) => (r.stdout ?? "").includes("OK"),
        success: "Tuple row order matches spec.",
      },
    },
  ],

  practice: [
    {
      id: "q1",
      type: "mcq",
      skill: "Syntax",
      level: "easy",
      prompt: "Which is a one-element tuple?",
      options: ["(1)", "(1,)", "[1]", "tuple[1]"],
      answer: 1,
      explain: "Trailing comma makes a tuple.",
    },
    {
      id: "q2",
      type: "mcq",
      skill: "Immutability",
      level: "easy",
      prompt: "t = (1, 2). Which is allowed?",
      options: ["t.append(3)", "t[0] = 0", "len(t)", "t.sort()"],
      answer: 2,
      explain: "Read-only operations only.",
    },
    {
      id: "q3",
      type: "write",
      skill: "TPL-501",
      level: "medium",
      prompt: "Implement stats(values) returning (count, total, average).",
      starter: `def stats(values):
    pass
print(stats([1, 2, 3]) == (3, 6, 2.0))`,
      hint: "Empty → (0,0,0.0); else len, sum, sum/len",
      solution: `def stats(values):
    if not values:
        return (0, 0, 0.0)
    count = len(values)
    total = sum(values)
    return (count, total, total / count)`,
      check: (r) => ((r.stdout ?? "").includes("True") ? null : "Expected True"),
    },
    {
      id: "q4",
      type: "fill",
      skill: "Unpack",
      level: "easy",
      prompt: "Complete unpack from stats.",
      code: `count, total, avg = ___(values)`,
      answers: ["stats"],
      mode: "code",
      explain: "Function name on the right side.",
    },
    {
      id: "q5",
      type: "mcq",
      skill: "Design",
      level: "medium",
      prompt: "min_max(nums) returns two ints. Best return?",
      options: ["Global variables", "Tuple of two values", "Print only", "List of length 99"],
      answer: 1,
      explain: "Caller unpacks lo, hi = min_max(nums).",
    },
    {
      id: "q6",
      type: "write",
      skill: "TPL-502",
      level: "medium",
      prompt: "person_tuple(d) → (name, age, city).",
      starter: `def person_tuple(d):
    pass
print(person_tuple({"name":"a","age":2,"city":"Z"}) == ("a", 2, "Z"))`,
      hint: "Return tuple of three lookups",
      solution: `def person_tuple(d):
    return (d["name"], d["age"], d["city"])`,
      check: (r) => ((r.stdout ?? "").includes("True") ? null : "Fix person_tuple"),
    },
    {
      id: "q7",
      type: "order",
      skill: "Workflow",
      level: "easy",
      prompt: "Ship TPL-501.",
      lines: ["Read tuple spec on ticket", "Handle empty list edge", "Return (count, sum, avg)", "Assert with =="],
      explain: "Spec → edges → implement → test.",
    },
    {
      id: "q8",
      type: "mcq",
      skill: "Swap",
      level: "medium",
      prompt: "Swap a and b in one line?",
      options: ["a, b = b, a", "swap(a,b)", "a = b", "tuple.swap"],
      answer: 0,
      explain: "Tuple unpack swap idiom.",
    },
  ],
};
