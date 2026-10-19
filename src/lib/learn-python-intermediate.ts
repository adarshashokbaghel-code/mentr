import type { PythonLesson } from "@/lib/learn-python";

/** Landing + LMS catalog for Python Intermediate (job / internship prep). */
export const PYTHON_INTERMEDIATE_LESSONS: PythonLesson[] = [
  {
    number: 1,
    title: "How developers solve problems",
    subtitle: "Specs, examples, edge cases, then code",
    hook: "Jobs don’t ask you to memorise syntax — they ask you to turn a messy request into working software.",
    concepts: [
      "Read a spec before typing",
      "Examples and edge cases",
      "Test cases on paper",
      "Break work into functions",
      "Run → read error → fix",
    ],
    build: "Temperature checker",
    code: `def classify(temp_c):
    if temp_c >= 38:
        return "fever"
    if temp_c <= 35:
        return "too cold"
    return "normal"`,
    practice: ["Spot the edge case", "Order the steps", "Predict output", "Fix the bug", "Write a test list"],
    watchOut: "Happy-path code only is the #1 reason beginner scripts fail in reviews.",
    challenge: "Given three temperatures, print the classification for each.",
    canDo: "Turn a short spec into steps, edge cases and a small function before coding.",
  },
  {
    number: 2,
    title: "Dictionaries & counting",
    subtitle: "Maps, tallies and grouping",
    hook: "When you need “how many of each?” or “look up by name”, lists alone are the wrong tool.",
    concepts: ["dict keys and values", "get and in", "counting with dict", "grouping records", "iterating items"],
    build: "Word frequency",
    code: `counts = {}
for word in ["a", "b", "a", "c", "a"]:
    counts[word] = counts.get(word, 0) + 1`,
    practice: ["Predict dict output", "Fix KeyError", "Count letters", "MCQ on .get", "Write a tally"],
    watchOut: "counts[word] += 1 crashes if the key is missing — use .get(word, 0) + 1.",
    challenge: "Count how many times each vowel appears in a sentence.",
    canDo: "Use a dictionary to count and group data in one pass.",
  },
  {
    number: 3,
    title: "Sets & fast lookup",
    subtitle: "Unique items and membership",
    hook: "Interviews love “have we seen this before?” — sets answer in O(1) average time.",
    concepts: ["set literals", "add and discard", "union / intersection", "dedupe a list", "membership tests"],
    build: "Duplicate detector",
    code: `seen = set()
for x in data:
    if x in seen:
        print("dup", x)
    seen.add(x)`,
    practice: ["Set vs list", "Predict output", "Dedupe", "Fix the bug", "Two-sum style MCQ"],
    watchOut: "Sets are unordered — don’t rely on printing order in production code.",
    challenge: "Return True if any value appears twice in a list.",
    canDo: "Choose sets when uniqueness or fast lookup matters.",
  },
  {
    number: 4,
    title: "Strings that parse data",
    subtitle: "split, join, strip, validate",
    hook: "CSV rows, log lines and API text all arrive as strings — parsing is a daily job skill.",
    concepts: ["split and join", "strip and replace", "f-strings for reports", "validate simple input", "splitlines"],
    build: "Line parser",
    code: `line = "  ada,42,eng\\n"
parts = [p.strip() for p in line.strip().split(",")]`,
    practice: ["Predict split", "Fix IndexError", "Join words", "Format a report", "Parse a row"],
    watchOut: "Always strip() user input before you split or compare.",
    challenge: "Parse name,age,city lines and print a one-line summary per person.",
    canDo: "Parse and format string data without regex for simple cases.",
  },
  {
    number: 5,
    title: "Tuples & records",
    subtitle: "Fixed-shape rows without a class yet",
    hook: "Sometimes you need a row of values that shouldn’t change — tuples and named patterns help.",
    concepts: ["tuple packing", "unpacking", "return multiple values", "immutable rows", "when not to use lists"],
    build: "Coordinate pair",
    code: `def min_max(nums):
    return min(nums), max(nums)

lo, hi = min_max([3, 1, 4])`,
    practice: ["Unpacking", "Predict output", "Return tuple", "Fix swap bug", "Choose tuple vs list"],
    watchOut: "t[0] = 1 fails — tuples are immutable.",
    challenge: "Write stats(values) returning (count, sum, average).",
    canDo: "Return and unpack multiple values cleanly.",
  },
  {
    number: 6,
    title: "Comprehensions & clarity",
    subtitle: "Readable one-liners vs review-friendly code",
    hook: "List comprehensions are fast to write — interviews also ask when they hurt readability.",
    concepts: ["list comp syntax", "dict comp", "filter with if", "refactor loops", "naming for clarity"],
    build: "Clean filter",
    code: `scores = [40, 88, 72, 91]
passed = [s for s in scores if s >= 50]`,
    practice: ["Rewrite as comp", "Rewrite as loop", "Predict comp", "Fix syntax", "Readability MCQ"],
    watchOut: "Nested comprehensions over 2 levels — prefer a loop in real teams.",
    challenge: "Build a dict of word → length for words longer than 3 characters.",
    canDo: "Use comprehensions when they make intent obvious.",
  },
  {
    number: 7,
    title: "Functions in depth",
    subtitle: "Scope, defaults and side effects",
    hook: "Reviewers care whether your function is pure, what it mutates, and what it returns.",
    concepts: ["local vs global", "default arguments", "pure functions", "docstrings", "splitting modules mentally"],
    build: "Invoice lines",
    code: `def line_total(qty, price, tax_rate=0.18):
    return qty * price * (1 + tax_rate)`,
    practice: ["Scope predict", "Default arg bug", "Add docstring", "Refactor", "Side effect MCQ"],
    watchOut: "Mutable defaults like def f(x=[]): — classic interview trap.",
    challenge: "Split a script into three functions with no global variables.",
    canDo: "Design functions with clear inputs, outputs and no hidden mutation.",
  },
  {
    number: 8,
    title: "Errors & reliability",
    subtitle: "try/except that helps users",
    hook: "Production code fails — handling errors without hiding bugs is a junior dev expectation.",
    concepts: ["try/except/else/finally", "specific exceptions", "raise with message", "fail fast", "logging mindset"],
    build: "Safe int parser",
    code: `def parse_int(text):
    try:
        return int(text.strip())
    except ValueError:
        raise ValueError(f"not an integer: {text!r}")`,
    practice: ["Pick exception", "Fix bare except", "Predict flow", "Write handler", "User message"],
    watchOut: "except: pass hides bugs — catch the exception you expect.",
    challenge: "Read age from input; retry once on bad input, then quit politely.",
    canDo: "Handle expected errors and re-raise with context.",
  },
  {
    number: 9,
    title: "Files & JSON data",
    subtitle: "Load, save and config patterns",
    hook: "Most small tools read JSON or CSV-shaped data — even in the browser we simulate files.",
    concepts: ["json.loads / dumps", "reading structured text", "config dict pattern", "schema in comments", "pretty print"],
    build: "Settings loader",
    code: `import json
raw = '{"theme": "dark", "font": 14}'
settings = json.loads(raw)`,
    practice: ["JSON predict", "Fix invalid JSON", "Build dict", "Serialize", "Schema MCQ"],
    watchOut: "JSON keys must be double-quoted strings.",
    challenge: "Parse a JSON list of tasks and print titles only.",
    canDo: "Load and save structured data with json.",
  },
  {
    number: 10,
    title: "Stdlib for real work",
    subtitle: "datetime, collections, pathlib ideas",
    hook: "You’re not expected to memorise everything — you are expected to know what exists.",
    concepts: ["datetime basics", "Counter", "defaultdict", "path strings", "reading docs"],
    build: "Log summary",
    code: `from collections import Counter
levels = Counter(["INFO", "ERR", "INFO", "ERR", "ERR"])
print(levels.most_common(1))`,
    practice: ["Counter predict", "Pick tool", "datetime format", "Fix import", "Docs MCQ"],
    watchOut: "Import only what you need — from x import * fails reviews.",
    challenge: "Count HTTP status codes from a list of strings.",
    canDo: "Reach for the right stdlib tool instead of reinventing.",
  },
  {
    number: 11,
    title: "Classes & objects",
    subtitle: "One clear class, no inheritance maze",
    hook: "Model one thing well — a Task, Expense, or Candidate — with methods that make sense.",
    concepts: ["class and __init__", "methods vs functions", "__str__", "attributes", "when OOP helps"],
    build: "Task model",
    code: `class Task:
    def __init__(self, title, done=False):
        self.title = title
        self.done = done`,
    practice: ["Fill class body", "Call methods", "Predict output", "Fix self bug", "Design MCQ"],
    watchOut: "Forgot self in method definition — TypeError at call time.",
    challenge: "Add mark_done() and summary() to Task.",
    canDo: "Define a small class and use it in a script.",
  },
  {
    number: 12,
    title: "Debug, test, ship",
    subtitle: "assert, tests and reading tracebacks",
    hook: "Shipping means someone else can run your code and trust it.",
    concepts: ["read traceback bottom-up", "assert for invariants", "simple test functions", "manual test table", "ship checklist"],
    build: "Test helper",
    code: `def assert_equal(got, expected):
    assert got == expected, f"{got!r} != {expected!r}"`,
    practice: ["Traceback order", "Write assert", "Fix failing test", "Checklist", "Ship MCQ"],
    watchOut: "assert is stripped with python -O — use real tests for production libs.",
    challenge: "Add three asserts for a function you wrote earlier.",
    canDo: "Debug from a traceback and lock behaviour with simple tests.",
  },
];

export const PYTHON_INTERMEDIATE_CAPSTONE = {
  title: "JSON expense tracker",
  summary: "CLI-style tool: add expenses, list, filter by category, export JSON — portfolio-ready.",
};
