import type { PythonLmsLesson } from "@/lib/python-lms/types";

export const INT_LESSON_10: PythonLmsLesson = {
  slug: "int-10",
  number: 10,
  title: "Stdlib for real work",
  subtitle: "STL-1001 — Counter, defaultdict mindset",
  minutes: 90,
  course: "intermediate",
  goals: [
    "Use collections.Counter for frequency summaries",
    "Know defaultdict exists for grouping — compare to Lesson 2 dict .get",
    "Read datetime basics for timestamps in logs",
    "Pick stdlib tool vs hand-rolled loop in code review",
    "Ship STL-1001 top_status(codes) using Counter",
  ],
  canDo: "Summarize HTTP status lists with Counter and return the most common code.",

  notes: [
    {
      id: "bridge",
      part: "Chapter 1 · Do not reinvent",
      title: "Lesson 2 counting → Counter",
      blocks: [
        {
          type: "lead",
          text: "You built tallies with **.get**. **Counter** is the stdlib tally for hashable items — less boilerplate, **most_common** built in.",
        },
        {
          type: "code",
          code: `from collections import Counter
codes = [200, 404, 200, 404, 404]
c = Counter(codes)
print(c.most_common(1))`,
          live: true,
          output: "[(404, 3)]",
        },
      ],
    },
    {
      id: "case-stl1001",
      part: "Case study · STL-1001",
      title: "top_status(codes)",
      blocks: [
        {
          type: "callout",
          tone: "exam",
          title: "STL-1001 · top_status(codes)",
          text: "Input: list of int status codes (may be empty). Output: int code that appears most often. Ties: return the **smallest** code among tied winners. Empty → None.",
        },
        {
          type: "code",
          code: `from collections import Counter

def top_status(codes):
    if not codes:
        return None
    counts = Counter(codes)
    best = max(counts, key=lambda c: (counts[c], -c))
    return best`,
          live: false,
        },
        {
          type: "p",
          text: "Simpler tie rule alternative: sort **counts.most_common()** and apply spec — document in tests.",
        },
      ],
    },
    {
      id: "defaultdict",
      part: "Chapter 2 · defaultdict",
      title: "Grouping without if not in",
      blocks: [
        {
          type: "p",
          text: "**defaultdict(list)** auto-creates empty list on missing key — same grouping pattern as **users_by_city** in Lesson 2.",
        },
      ],
    },
    {
      id: "datetime",
      part: "Chapter 3 · datetime",
      title: "Timestamps (awareness)",
      blocks: [
        {
          type: "code",
          code: `from datetime import datetime
now = datetime.now()
print(now.year, now.strftime("%Y-%m-%d"))`,
          live: true,
        },
        {
          type: "p",
          text: "Jobs: store UTC in DB, format for display. You will look up **strftime** codes — not memorize all.",
        },
      ],
    },
    {
      id: "capstone",
      part: "Chapter 4 · Next",
      title: "Classes",
      blocks: [{ type: "p", text: "Lesson 11: model **Task** with **class** when dict rows feel loose." }],
    },
  ],

  examples: [
    {
      type: "playground",
      id: "ex-stl1001",
      title: "STL-1001 top_status",
      intro: "Counter + tie rule.",
      starter: `from collections import Counter

def top_status(codes):
    if not codes:
        return None
    counts = Counter(codes)
    return max(counts, key=lambda c: (counts[c], -c))

print("OK" if top_status([200, 404, 404]) == 404 else "FAIL")
print("OK" if top_status([200, 200, 404, 404]) == 200 else "FAIL")
print("OK" if top_status([]) is None else "FAIL")`,
      tryThis: ["All 500s"],
      goal: {
        text: "3 OK",
        check: (r) => (r.stdout ?? "").split("OK").length >= 4,
        success: "STL-1001 passes.",
      },
    },
  ],

  practice: [
    {
      id: "q1",
      type: "mcq",
      skill: "Counter",
      level: "easy",
      prompt: "Counter([\"a\",\"a\",\"b\"])[\"a\"] is?",
      options: ["1", "2", "Error", "0"],
      answer: 1,
      explain: "Two a's.",
    },
    {
      id: "q2",
      type: "write",
      skill: "STL-1001",
      level: "hard",
      prompt: "top_status(codes) — most common, tie → smallest code.",
      starter: `from collections import Counter
def top_status(codes):
    pass
print(top_status([1,1,2]) == 1)`,
      hint: "Counter + max with key",
      solution: `from collections import Counter

def top_status(codes):
    if not codes:
        return None
    counts = Counter(codes)
    return max(counts, key=lambda c: (counts[c], -c))`,
      check: (r) => ((r.stdout ?? "").includes("True") ? null : "Fix top_status"),
    },
    {
      id: "q3",
      type: "mcq",
      skill: "Imports",
      level: "easy",
      prompt: "Review-friendly import?",
      options: ["from collections import Counter", "from collections import *", "import *", "no import"],
      answer: 0,
      explain: "Explicit import names.",
    },
  ],
};
