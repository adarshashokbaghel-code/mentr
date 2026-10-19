import type { PythonLesson } from "@/lib/learn-python";

/** Landing + LMS catalog for Python Intermediate (job / internship prep). */
export const PYTHON_INTERMEDIATE_LESSONS: PythonLesson[] = [
  {
    number: 1,
    title: "How developers solve problems",
    subtitle: "Tickets, acceptance tests, and code review",
    hook: "Ship like an intern: read the ticket, build a test matrix, then write pure functions that pass QA.",
    concepts: [
      "Ticket & acceptance criteria",
      "Test matrix before code",
      "Case study: VitalTrack VTL-142",
      "Boundary bugs (>= vs >)",
      "Table-driven self-tests",
      "Definition of done checklist",
    ],
    build: "VitalTrack temperature classifier + matrix",
    code: `def classify_temp(celsius):
    if celsius >= 38:
        return "fever"
    if celsius <= 35:
        return "too cold"
    return "normal"`,
    practice: [
      "SDLC & tickets",
      "Operators & boundaries",
      "Elif tier traps",
      "VTL-142 matrix capstone",
      "GRD-08 & letter grades",
      "11 quiz + code drills",
    ],
    watchOut: "Skipping the test matrix is why 38.0 and 35.0 silently ship wrong in reviews.",
    challenge: "Make all six VTL-142 acceptance rows print OK.",
    canDo: "Deliver ticket VTL-142: spec → matrix → classify_temp → green self-test run.",
  },
  {
    number: 2,
    title: "Dictionaries & counting",
    subtitle: "LOG-201 / LOG-202 — maps, tallies, grouping",
    hook: "Logs, SKUs, and status codes all need the same pro pattern: dict + .get + .items() + tests.",
    concepts: [
      "Key → value table model",
      "KeyError vs .get(default)",
      "Counting idiom",
      "Case study LOG-201 word_frequency",
      "Case study LOG-202 status_tally",
      "items() reports & sorted keys",
      "Group rows into dict of lists",
      "Hashable keys & dict tests",
    ],
    build: "word_frequency + status_tally + users_by_city",
    code: `counts[word] = counts.get(word, 0) + 1`,
    practice: [
      "Dict concepts & keys",
      "Counting idiom fill",
      "LOG-201 write",
      "LOG-202 write",
      "Vowel tally capstone",
      "10 quiz + code drills",
    ],
    watchOut: "counts[word] += 1 on first sighting raises KeyError — always .get(word, 0) + 1.",
    challenge: "Pass LOG-201 and LOG-202 matrices; optional group-by-city.",
    canDo: "Ship analytics tallies with dict equality tests and review-ready reports.",
  },
  {
    number: 3,
    title: "Sets & fast lookup",
    subtitle: "SET-301 / SET-302 — dupes, distinct ids, tag overlap",
    hook: "After dict tallies: guard pipelines with seen sets, sorted unique reports, and intersection for “what’s in both?”",
    concepts: [
      "Counts vs uniqueness (dict vs set)",
      "Case study SET-301 has_duplicate",
      "Empty set: set() not {}",
      "add / discard / remove",
      "Dedupe vs preserve-order dedupe",
      "Case study SET-302 unique_ids",
      "Union, intersection, difference",
      "Subset checks for permissions",
      "Hashable elements & testing sorted output",
    ],
    build: "has_duplicate + unique_ids + shared_tags",
    code: `if x in seen:
    return True
seen.add(x)`,
    practice: [
      "Set vs list membership",
      "SET-301 write",
      "SET-302 write",
      "Set algebra MCQ",
      "Preserve-order dedupe capstone",
      "11 quiz + code drills",
    ],
    watchOut: "{} is an empty dict — use set() for an empty set; never assert on print order of a bare set.",
    challenge: "Pass SET-301 and SET-302 matrices; optional SET-303 shared_tags.",
    canDo: "Ship duplicate detection, distinct id reports, and tag overlap with matrix tests.",
  },
  {
    number: 4,
    title: "Strings that parse data",
    subtitle: "STR-401 / STR-402 — CSV rows, summaries, batch splitlines",
    hook: "Wire format → strip → split → validate → dict — then sets and tallies from earlier lessons.",
    concepts: [
      "Ingest pipeline mental model",
      "Case study STR-401 parse_person_row",
      "strip / split / join",
      "List comp strip per field",
      "IndexError guards & return None",
      "replace for legacy delimiters",
      "Case study STR-402 f-string summary",
      "splitlines & STR-403 batch parse",
      "isdigit age validation & matrix tests",
    ],
    build: "parse_person_row + format_person_summary + parse_person_rows",
    code: `parts = [p.strip() for p in line.strip().split(",")]`,
    practice: [
      "strip & split MCQ",
      "STR-401 write",
      "STR-402 write",
      "splitlines & join",
      "STR-403 batch capstone",
      "11 quiz + code drills",
    ],
    watchOut: "Split before strip on the line; never parts[2] without len(parts) == 3 — one bad row should not kill the batch.",
    challenge: "Pass STR-401/402 matrices; optional STR-403 multi-line ingest.",
    canDo: "Parse and format simple comma rows with tests — no regex until the spec outgrows split.",
  },
  {
    number: 5,
    title: "Tuples & records",
    subtitle: "TPL-501 / TPL-502 — stats tuple & dict rows",
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
    subtitle: "CMP-601 / CMP-602 — list & dict comprehensions",
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
    subtitle: "FN-701 — line_total, purity, mutable defaults",
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
    subtitle: "ERR-801 — parse_int with ValueError",
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
    subtitle: "JSON-901 — loads, dumps, settings dict",
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
    subtitle: "STL-1001 — Counter & datetime awareness",
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
    subtitle: "CLS-1101 — Task model with methods",
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
    subtitle: "TST-1201 — tracebacks, assert_equal, ship checklist",
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
