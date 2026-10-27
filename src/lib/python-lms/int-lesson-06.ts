import type { PythonLmsLesson } from "@/lib/python-lms/types";

export const INT_LESSON_06: PythonLmsLesson = {
  slug: "int-06",
  number: 6,
  title: "Comprehensions & clarity",
  subtitle: "CMP-601 / CMP-602 — list & dict comps with readable intent",
  minutes: 90,
  course: "intermediate",
  goals: [
    "Read and write list comprehensions with optional if filters",
    "Build dict comprehensions for key → value maps in one pass",
    "Refactor a loop to a comp when intent stays obvious — and back when it does not",
    "Avoid nested comps beyond two levels in review-friendly code",
    "Ship CMP-601 passing_scores and CMP-602 word_lengths",
  ],
  canDo: "Deliver CMP-601/CMP-602 with matrix tests — comps where clear, loops where clearer.",

  notes: [
    {
      id: "bridge",
      part: "Chapter 1 · Express intent",
      title: "Loops you already know → one-line builders",
      blocks: [
        {
          type: "lead",
          text: "You have tallied with loops and dicts. **Comprehensions** are syntactic sugar for **building a new list or dict** from an iterable — same logic, less boilerplate when the team can read it.",
        },
        {
          type: "compare",
          left: {
            label: "Loop",
            code: `passed = []
for s in scores:
    if s >= 50:
        passed.append(s)`,
            output: "Explicit steps",
            tone: "neutral",
          },
          right: {
            label: "List comp",
            code: `passed = [s for s in scores if s >= 50]`,
            output: "Same result",
            tone: "good",
          },
        },
      ],
    },
    {
      id: "list-comp",
      part: "Chapter 2 · List comprehensions",
      title: "Syntax: [expr for item in iterable if cond]",
      blocks: [
        {
          type: "code",
          code: `scores = [40, 88, 72, 91]
passed = [s for s in scores if s >= 50]
print(passed)`,
          live: true,
          output: "[88, 72, 91]",
        },
        {
          type: "check",
          id: "c-list",
          question: "[x * 2 for x in [1, 2, 3]] equals?",
          options: ["[1, 2, 3]", "[2, 4, 6]", "[1, 4, 9]", "Error"],
          answer: 1,
          explain: "expr is x * 2 for each x.",
        },
      ],
    },
    {
      id: "case-cmp601",
      part: "Case study A · CMP-601",
      title: "Ticket: passing_scores(scores, cutoff)",
      blocks: [
        {
          type: "callout",
          tone: "exam",
          title: "CMP-601 · passing_scores(scores, cutoff)",
          text: "Return list of scores >= cutoff, preserving order. Empty input → []. Pure function.",
        },
        {
          type: "code",
          code: `def passing_scores(scores, cutoff):
    return [s for s in scores if s >= cutoff]

print(passing_scores([40, 88, 72], 50))`,
          live: true,
          output: "[88, 72]",
        },
      ],
    },
    {
      id: "dict-comp",
      part: "Chapter 3 · Dict comprehensions",
      title: "Syntax: {key_expr: val_expr for ...}",
      blocks: [
        {
          type: "code",
          code: `words = ["ada", "bob", "ada"]
unique = {w: len(w) for w in words}
print(unique)`,
          live: true,
          output: "{'ada': 3, 'bob': 3}",
        },
        {
          type: "p",
          text: "Later keys overwrite earlier — last wins for duplicates. For counts use Lesson 2 .get idiom or Counter (Lesson 10).",
        },
      ],
    },
    {
      id: "case-cmp602",
      part: "Case study B · CMP-602",
      title: "Ticket: word_lengths(words, min_len)",
      blocks: [
        {
          type: "callout",
          tone: "exam",
          title: "CMP-602 · word_lengths(words, min_len)",
          text: "Return dict mapping each word to len(word) for words where len(word) > min_len (strictly greater). Order of keys in dict does not matter for tests — compare dicts with ==.",
        },
        {
          type: "code",
          code: `def word_lengths(words, min_len):
    return {w: len(w) for w in words if len(w) > min_len}

print(word_lengths(["a", "ada", "bob"], 2))`,
          live: true,
          output: "{'ada': 3, 'bob': 3}",
        },
      ],
    },
    {
      id: "readability",
      part: "Chapter 4 · Review culture",
      title: "When not to comp",
      blocks: [
        {
          type: "callout",
          tone: "warn",
          title: "Team rule of thumb",
          text: "If the comp needs **two nested fors** or **multiple side effects**, use a **for loop** with comments. Interviews want you to know both.",
        },
        {
          type: "check",
          id: "c-read",
          question: "Nested comp over 3 levels for reporting. Reviewer likely says?",
          options: ["Ship it", "Refactor to loops/functions", "Use global", "Add regex"],
          answer: 1,
          explain: "Clarity beats cleverness in shared codebases.",
        },
      ],
    },
    {
      id: "capstone",
      part: "Chapter 5 · Next",
      title: "Functions in depth",
      blocks: [
        {
          type: "p",
          text: "Lesson 7: **scope, defaults, pure functions** — comps build data; functions **package behaviour** for tickets.",
        },
      ],
    },
  ],

  examples: [
    {
      type: "playground",
      id: "ex-cmp601",
      title: "CMP-601 passing_scores",
      intro: "List comp with cutoff.",
      starter: `def passing_scores(scores, cutoff):
    return [s for s in scores if s >= cutoff]

print("OK" if passing_scores([40, 88], 50) == [88] else "FAIL")`,
      tryThis: ["cutoff 40 includes all"],
      goal: { text: "OK", check: (r) => (r.stdout ?? "").includes("OK"), success: "CMP-601 done." },
    },
    {
      type: "playground",
      id: "ex-cmp602",
      title: "CMP-602 word_lengths",
      intro: "Dict comp with filter.",
      starter: `def word_lengths(words, min_len):
    return {w: len(w) for w in words if len(w) > min_len}

print("OK" if word_lengths(["a","ada"], 2) == {"ada": 3} else "FAIL")`,
      tryThis: ["min_len 3 → empty dict"],
      goal: { text: "OK", check: (r) => (r.stdout ?? "").includes("OK"), success: "CMP-602 done." },
    },
  ],

  practice: [
    {
      id: "q1",
      type: "mcq",
      skill: "List comp",
      level: "easy",
      prompt: "[x for x in range(3)] equals?",
      options: ["[0, 1, 2]", "[1, 2, 3]", "range(3)", "[3]"],
      answer: 0,
      explain: "range(3) yields 0,1,2.",
    },
    {
      id: "q2",
      type: "write",
      skill: "CMP-601",
      level: "medium",
      prompt: "passing_scores(scores, cutoff) — list comp.",
      starter: `def passing_scores(scores, cutoff):
    pass
print(passing_scores([50, 49], 50) == [50])`,
      hint: "[s for s in scores if s >= cutoff]",
      solution: `def passing_scores(scores, cutoff):
    return [s for s in scores if s >= cutoff]`,
      check: (r) => ((r.stdout ?? "").includes("True") ? null : "Expected True"),
    },
    {
      id: "q3",
      type: "write",
      skill: "CMP-602",
      level: "medium",
      prompt: "word_lengths(words, min_len) — dict comp, len(w) > min_len.",
      starter: `def word_lengths(words, min_len):
    pass
print(word_lengths(["hi","hey"], 2) == {"hey": 3})`,
      hint: "Filter with if len(w) > min_len",
      solution: `def word_lengths(words, min_len):
    return {w: len(w) for w in words if len(w) > min_len}`,
      check: (r) => ((r.stdout ?? "").includes("True") ? null : "Fix word_lengths"),
    },
    {
      id: "q4",
      type: "fill",
      skill: "Syntax",
      level: "easy",
      prompt: "Complete list comp.",
      code: `evens = [x for x in nums if x ___ 2 == 0]`,
      answers: ["%"],
      mode: "code",
      explain: "Modulo test for even.",
    },
    {
      id: "q5",
      type: "mcq",
      skill: "Readability",
      level: "medium",
      prompt: "Best when logic has side effects per row?",
      options: ["List comp", "for loop", "Dict comp only", "set comp"],
      answer: 1,
      explain: "Comps should not hide I/O or mutation.",
    },
  ],
};
