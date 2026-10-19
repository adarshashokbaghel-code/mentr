import type { PythonLmsLesson } from "@/lib/python-lms/types";

export const INT_LESSON_04: PythonLmsLesson = {
  slug: "int-04",
  number: 4,
  title: "Strings that parse data",
  subtitle: "STR-401 / STR-402 — split, strip, join, and safe row parsing",
  minutes: 100,
  course: "intermediate",
  goals: [
    "Treat strings as the wire format — normalize with strip before split or compare",
    "Split CSV-style rows and guard IndexError when columns are missing",
    "Join tokens into reports with str.join and readable f-strings",
    "Implement pure parse functions that return structured data (dict or tuple fields)",
    "Validate simple fields (non-empty, digits-only age) without regex for v1",
    "Process multi-line blobs with splitlines and skip blank lines",
    "Write matrix tests for messy whitespace and edge rows",
  ],
  canDo:
    "Ship STR-401 parse_person_row(line) and STR-402 format_person_summary(row) — matrix-tested parsing and one-line report strings for ingest pipelines.",

  notes: [
    {
      id: "bridge-lesson3",
      part: "Chapter 1 · Text first",
      title: "APIs and uploads arrive as text",
      blocks: [
        {
          type: "lead",
          text: "Lessons 2–3 worked on **lists, dicts, and sets** already in memory. In jobs, that data usually starts as **one string per row** — CSV export, log tail, webhook body. Lesson 4 is **parse → validate → structure**.",
        },
        {
          type: "flow",
          title: "Ingest pipeline (simplified)",
          steps: [
            { kind: "io", text: "Read line or file chunk (str)" },
            { kind: "process", text: "strip() whitespace, split on delimiter" },
            { kind: "decision", text: "Enough columns? types OK?" },
            { kind: "process", text: "Build dict / call downstream (set, dict tally)" },
            { kind: "terminal", text: "Return or append to batch list" },
          ],
        },
        {
          type: "check",
          id: "c-bridge",
          question: "User paste: \"  ada,42,BLR  \\n\". First professional step before split(\",\")?",
          options: ["split immediately", "strip() outer whitespace", "replace all spaces", "convert to set"],
          answer: 1,
          explain: "Leading/trailing spaces break comparisons and sometimes produce empty-looking fields — strip the line first.",
        },
      ],
    },
    {
      id: "str-immutable",
      part: "Chapter 1 · Text first",
      title: "Strings are sequences — and immutable",
      blocks: [
        {
          type: "p",
          text: "A **str** is an ordered sequence of characters. Methods like **strip**, **split**, **replace** return **new** strings; the original is unchanged. Indexing **s[0]** works; **s[0] = \"x\"** does not.",
        },
        {
          type: "terms",
          items: [
            { term: "Delimiter", meaning: "Character(s) that separate fields — comma for CSV-like rows." },
            { term: "Token", meaning: "One piece after splitting — may still need .strip() per field." },
            { term: "Normalized", meaning: "Cleaned form used for logic — often stripped and maybe lowercased." },
          ],
        },
        {
          type: "code",
          code: `raw = "  hello  "
clean = raw.strip()
print(repr(raw), repr(clean))`,
          live: true,
          output: "'  hello  ' 'hello'",
        },
      ],
    },
    {
      id: "case-str401",
      part: "Case study A · SpecPulse STR-401",
      title: "Ticket: parse_person_row(line)",
      blocks: [
        {
          type: "callout",
          tone: "exam",
          title: "STR-401 · parse_person_row(line)",
          text: "Input: single line string \"name,age,city\" (three comma-separated fields). Whitespace around fields is allowed. Output: dict with keys name (str), age (int), city (str). If after strip the line is empty, return None. If split does not yield exactly 3 fields, return None. Do not print inside the function.",
        },
        {
          type: "table",
          head: ["ID", "Input line", "Expected"],
          rows: [
            ["P1", '"" (empty)', "None"],
            ["P2", '"ada,30,BLR"', '{name: ada, age: 30, city: BLR}'],
            ["P3", '"  ada , 30 , BLR  "', "same as P2 after strip fields"],
            ["P4", '"ada,30"', "None — only 2 fields"],
            ["P5", '"ada,30,BLR,extra"', "None — too many fields"],
          ],
        },
        {
          type: "p",
          text: "Returning **None** for bad rows lets a batch job **skip** or **count errors** without try/except on every line.",
        },
      ],
    },
    {
      id: "strip-family",
      part: "Chapter 2 · Cleaning",
      title: "strip, lstrip, rstrip",
      blocks: [
        {
          type: "list",
          items: [
            "**strip()** — remove leading and trailing whitespace (space, tab, newline)",
            "**lstrip()** / **rstrip()** — one side only",
            "**strip(chars)** — optional custom characters to trim (less common in CSV work)",
          ],
        },
        {
          type: "compare",
          left: {
            label: "Bug: compare without strip",
            code: `if city == "BLR":
    ...  # "BLR " fails`,
            output: "Silent mismatch",
            tone: "bad",
          },
          right: {
            label: "Normalize once",
            code: `city = parts[2].strip()
if city == "BLR":`,
            output: "Stable equality",
            tone: "good",
          },
        },
        {
          type: "check",
          id: "c-strip",
          question: "line = \"\\n ada,1,x \\n\". Best prep before split?",
          options: ["line.lower()", "line.strip()", "line.replace(\",\",\"\")", "list(line)"],
          answer: 1,
          explain: "Remove outer newlines/spaces so split sees ada,1,x.",
        },
      ],
    },
    {
      id: "split-join",
      part: "Chapter 2 · Cleaning",
      title: "split and join — two sides of one coin",
      blocks: [
        {
          type: "p",
          text: "**split(sep)** breaks a string into a **list** of substrings. **sep.join(list)** concatenates with **sep between** items — not before the first or after the last.",
        },
        {
          type: "code",
          code: `line = "ada,42,eng"
parts = line.split(",")
print(parts)
print("-".join(["2026", "03", "19"]))`,
          live: true,
          output: "['ada', '42', 'eng']\n2026-03-19",
        },
        {
          type: "p",
          text: "**split(\",\", maxsplit=2)** limits splits — useful when the last field may contain commas (preview only; full CSV needs smarter rules or a library).",
        },
        {
          type: "code",
          code: `note = "a,b,c,d"
print(note.split(",", 2))`,
          live: true,
          output: "['a', 'b', 'c,d']",
        },
      ],
    },
    {
      id: "implement-str401",
      part: "Case study A · SpecPulse STR-401",
      title: "Reference solution",
      blocks: [
        {
          type: "code",
          code: `def parse_person_row(line):
    text = line.strip()
    if not text:
        return None
    parts = [p.strip() for p in text.split(",")]
    if len(parts) != 3:
        return None
    name, age_s, city = parts
    if not age_s.isdigit():
        return None
    return {"name": name, "age": int(age_s), "city": city}`,
          live: true,
        },
        {
          type: "callout",
          tone: "tip",
          title: "List comprehension strip",
          text: "**[p.strip() for p in text.split(\",\")]** is the standard one-liner to clean every column after split.",
        },
        {
          type: "p",
          text: "**int(age_s)** after **isdigit()** avoids ValueError on garbage — STR-401 v1 treats non-digit age as invalid row (None).",
        },
      ],
    },
    {
      id: "indexerror-guard",
      part: "Chapter 3 · Defensive parsing",
      title: "Avoid IndexError — check length first",
      blocks: [
        {
          type: "p",
          text: "**parts[2]** crashes when **len(parts) < 3**. In production parsers, **never** assume the upload is well-formed.",
        },
        {
          type: "compare",
          left: {
            label: "Fragile",
            code: `parts = line.split(",")
city = parts[2]  # IndexError`,
            output: "Batch job dies on row 2",
            tone: "bad",
          },
          right: {
            label: "Spec-driven",
            code: `if len(parts) != 3:
    return None`,
            output: "Skip bad row, log count",
            tone: "good",
          },
        },
        {
          type: "check",
          id: "c-len",
          question: "parts = \"a,b\".split(\",\") — safe way to read parts[2]?",
          options: [
            "Always use parts[2]",
            "if len(parts) >= 3: use parts[2] else handle",
            "try/except only, no len check",
            "parts[2] or None",
          ],
          answer: 1,
          explain: "Index 2 needs at least 3 elements; len check matches STR-401 contract.",
        },
      ],
    },
    {
      id: "replace-when",
      part: "Chapter 3 · Defensive parsing",
      title: "replace — when split is not enough",
      blocks: [
        {
          type: "p",
          text: "**replace(old, new)** swaps substrings globally. Use for **fixed patterns** (bad quotes, legacy separators) — not as a full CSV parser.",
        },
        {
          type: "code",
          code: `legacy = "ada|30|BLR"
csv_like = legacy.replace("|", ",")
print(csv_like.split(","))`,
          live: true,
          output: "['ada', '30', 'BLR']",
        },
        {
          type: "callout",
          tone: "warn",
          title: "Scope boundary",
          text: "Nested commas, JSON in cells, and escaped quotes need **csv module** or pandas — interview v1 is **simple split + strip** with explicit specs.",
        },
      ],
    },
    {
      id: "case-str402",
      part: "Case study B · SpecPulse STR-402",
      title: "Ticket: format_person_summary(row)",
      blocks: [
        {
          type: "callout",
          tone: "exam",
          title: "STR-402 · format_person_summary(row)",
          text: "Input: dict from STR-401 with name, age, city. Output: single string exactly: **{name} ({age}) — {city}** using an f-string. Example: ada (30) — BLR. Assume row is valid — caller checked not None.",
        },
        {
          type: "code",
          code: `def format_person_summary(row):
    return f"{row['name']} ({row['age']}) — {row['city']}"

row = {"name": "ada", "age": 30, "city": "BLR"}
print(format_person_summary(row))`,
          live: true,
          output: "ada (30) — BLR",
        },
        {
          type: "p",
          text: "**f-strings** embed expressions in **{...}** — preferred for readable reports over **\"%s\" % x** or **.format** in new code.",
        },
      ],
    },
    {
      id: "fstring-basics",
      part: "Chapter 4 · Reporting",
      title: "f-strings and join for batch output",
      blocks: [
        {
          type: "code",
          code: `rows = [
    {"name": "ada", "age": 30, "city": "BLR"},
    {"name": "bob", "age": 22, "city": "DEL"},
]
lines = [format_person_summary(r) for r in rows]
report = "\\n".join(lines)
print(report)`,
          live: true,
          output: "ada (30) — BLR\nbob (22) — DEL",
        },
        {
          type: "p",
          text: "**\"\\n\".join(lines)** builds a multi-line blob for email body or stdout — same pattern as log exporters.",
        },
        {
          type: "check",
          id: "c-join",
          question: "Which builds \"a|b|c\" from list [\"a\",\"b\",\"c\"]?",
          options: ['"|".join(["a","b","c"])', 'join("|", ["a","b","c"])', '["a","b","c"].join("|")', '"a"+"|"+"b" only'],
          answer: 0,
          explain: "Separator.join(iterable) — method on the separator string.",
        },
      ],
    },
    {
      id: "splitlines",
      part: "Chapter 4 · Reporting",
      title: "splitlines — many rows in one string",
      blocks: [
        {
          type: "p",
          text: "**text.splitlines()** splits on line breaks (handles **\\n**, **\\r\\n**). Loop rows for STR-401 on each non-empty line.",
        },
        {
          type: "code",
          code: `blob = "ada,1,BLR\\nbob,2,DEL\\n\\n"
people = []
for line in blob.splitlines():
    row = parse_person_row(line)
    if row is not None:
        people.append(row)
print(len(people))`,
          live: false,
        },
        {
          type: "p",
          text: "Skip **None** — blank lines and malformed rows do not enter **people**.",
        },
      ],
    },
    {
      id: "validation-simple",
      part: "Chapter 5 · Validation",
      title: "Simple validators (no regex v1)",
      blocks: [
        {
          type: "table",
          head: ["Check", "Typical code", "When"],
          rows: [
            ["Non-empty name", "if not name: return None", "After strip"],
            ["Age digits", "age_s.isdigit()", "Before int()"],
            ["City length", "len(city) >= 2", "Optional product rule"],
            ["Allowed city set", "city in ALLOWED", "Set from lesson 3"],
          ],
        },
        {
          type: "code",
          code: `def is_valid_age_field(age_s):
    return age_s.isdigit() and 0 <= int(age_s) <= 120

print(is_valid_age_field("30"))
print(is_valid_age_field("30.5"))`,
          live: true,
          output: "True\nFalse",
        },
        {
          type: "check",
          id: "c-digit",
          question: "age_s = \"07\". isdigit() is True. int(age_s) is?",
          options: ["7", '"07"', "Error", "0.7"],
          answer: 0,
          explain: "int strips leading-zero semantics — value 7.",
        },
      ],
    },
    {
      id: "case-str403",
      part: "Case study C · SpecPulse STR-403",
      title: "Ticket: parse_person_rows(blob)",
      blocks: [
        {
          type: "callout",
          tone: "exam",
          title: "STR-403 · parse_person_rows(blob)",
          text: "Input: multi-line string. Each non-empty line parsed with STR-401 rules. Output: list of dicts in **line order** — skip invalid lines (do not insert placeholders). Empty blob → [].",
        },
        {
          type: "code",
          code: `def parse_person_rows(blob):
    out = []
    for line in blob.splitlines():
        row = parse_person_row(line)
        if row is not None:
            out.append(row)
    return out`,
          live: false,
        },
      ],
    },
    {
      id: "testing-parse",
      part: "Chapter 6 · Tests",
      title: "Matrix tests for parsers",
      blocks: [
        {
          type: "code",
          code: `def parse_person_row(line):
    text = line.strip()
    if not text:
        return None
    parts = [p.strip() for p in text.split(",")]
    if len(parts) != 3:
        return None
    name, age_s, city = parts
    if not age_s.isdigit():
        return None
    return {"name": name, "age": int(age_s), "city": city}

TESTS = [
    ("", None),
    ("ada,30,BLR", {"name": "ada", "age": 30, "city": "BLR"}),
    ("ada,30", None),
]

for line, expected in TESTS:
    got = parse_person_row(line)
    print(repr(line), "OK" if got == expected else f"FAIL {got}")`,
          live: true,
        },
        {
          type: "list",
          ordered: true,
          items: [
            "Include whitespace row in matrix",
            "Include too-few and too-many columns",
            "Compare dict with ==",
            "Compare None with is / ==",
          ],
        },
      ],
    },
    {
      id: "review-parse-bugs",
      part: "Chapter 6 · Tests",
      title: "Code review: string parsing smells",
      blocks: [
        {
          type: "table",
          head: ["Smell", "Fix"],
          rows: [
            ["Split before strip", "line.strip() first"],
            ["Forgot strip on each part", "List comp strip"],
            ["int(parts[1]) without check", "isdigit or try/except + None"],
            ["Used split() on \"a,,b\"", "Decide if empty fields allowed — spec"],
            ["Regex for simple CSV v1", "split + strip until spec grows"],
          ],
        },
        {
          type: "check",
          id: "c-review",
          question: "PR parses with parts = line.split(\",\") and city = parts[2]. Your comment?",
          options: [
            "Add len(parts) == 3 guard per spec",
            "Use set instead",
            "Remove strip — faster",
            "Always raise on bad row",
          ],
          answer: 0,
          explain: "Length guard matches defensive ingest; raising kills whole batch on one bad line unless spec says so.",
        },
      ],
    },
    {
      id: "capstone-bridge",
      part: "Chapter 7 · Next steps",
      title: "Parse today · tuples tomorrow",
      blocks: [
        {
          type: "p",
          text: "You can **ingest rows**, **summarize for email**, and **batch splitlines**. Lesson 5 introduces **tuples** — fixed-shape rows returned as **(name, age, city)** before you reach dataclasses.",
        },
        {
          type: "flashcards",
          cards: [
            { q: "Before split on a line?", a: "strip() outer whitespace" },
            { q: "STR-401 wrong column count?", a: "return None" },
            { q: "Join list with commas?", a: "\",\".join(items) — no trailing comma" },
            { q: "Multi-line blob to rows?", a: "for line in blob.splitlines()" },
          ],
        },
      ],
    },
  ],

  examples: [
    {
      type: "trace",
      id: "ex-strip-split-trace",
      title: "Trace: messy row to parts",
      intro: "Outer strip, split, inner strip per field.",
      code: `line = "  ada , 30 , BLR  "
text = line.strip()
parts = [p.strip() for p in text.split(",")]
print(parts)`,
      steps: [
        { line: 4, output: "['ada', '30', 'BLR']\n", note: "Three clean tokens ready for int(c) on age." },
      ],
    },
    {
      type: "trace",
      id: "ex-bad-row-trace",
      title: "Trace: short row returns None",
      intro: "Two fields — len != 3.",
      code: `def parse_person_row(line):
    text = line.strip()
    if not text:
        return None
    parts = [p.strip() for p in text.split(",")]
    if len(parts) != 3:
        return None
    name, age_s, city = parts
    if not age_s.isdigit():
        return None
    return {"name": name, "age": int(age_s), "city": city}

print(parse_person_row("ada,30"))
print(parse_person_row("ada,30,BLR"))`,
      steps: [
        { line: 13, output: "None\n{'name': 'ada', 'age': 30, 'city': 'BLR'}\n", note: "First line fails length check; second passes." },
      ],
    },
    {
      type: "trace",
      id: "ex-fstring-trace",
      title: "Trace: STR-402 summary line",
      intro: "Dict in → one formatted line out.",
      code: `def format_person_summary(row):
    return f"{row['name']} ({row['age']}) — {row['city']}"

print(format_person_summary({"name": "bob", "age": 22, "city": "DEL"}))`,
      steps: [
        { line: 4, output: "bob (22) — DEL\n", note: "Em dash in spec — copy exactly in tests." },
      ],
    },
    {
      type: "playground",
      id: "ex-str401",
      title: "Deliverable · STR-401 parse_person_row",
      intro: "Implement parse_person_row. All matrix rows must print OK.",
      starter: `def parse_person_row(line):
    text = line.strip()
    if not text:
        return None
    parts = [p.strip() for p in text.split(",")]
    if len(parts) != 3:
        return None
    name, age_s, city = parts
    if not age_s.isdigit():
        return None
    return {"name": name, "age": int(age_s), "city": city}

TESTS = [
    ("", None),
    ("ada,30,BLR", {"name": "ada", "age": 30, "city": "BLR"}),
    ("  ada , 30 , BLR  ", {"name": "ada", "age": 30, "city": "BLR"}),
    ("ada,30", None),
    ("ada,30,BLR,x", None),
    ("ada,xx,BLR", None),
]

for line, expected in TESTS:
    got = parse_person_row(line)
    print("OK" if got == expected else f"FAIL line={line!r} got={got}")`,
      tryThis: ["Break isdigit check — see ada,xx,BLR FAIL", "Add row with age 007"],
      goal: {
        text: "All STR-401 tests OK",
        check: (r) => {
          if (!r.ok || r.error) return false;
          const out = r.stdout ?? "";
          return !out.includes("FAIL") && (out.match(/OK/g)?.length ?? 0) >= 6;
        },
        success: "STR-401 parser passes ingest QA matrix.",
      },
    },
    {
      type: "playground",
      id: "ex-str402",
      title: "Deliverable · STR-402 format_person_summary",
      intro: "f-string summary exactly as spec.",
      starter: `def format_person_summary(row):
    return f"{row['name']} ({row['age']}) — {row['city']}"

TESTS = [
    ({"name": "ada", "age": 30, "city": "BLR"}, "ada (30) — BLR"),
    ({"name": "x", "age": 1, "city": "Y"}, "x (1) — Y"),
]

for row, expected in TESTS:
    got = format_person_summary(row)
    print("OK" if got == expected else f"FAIL got={got!r}")`,
      tryThis: ["Wrong dash character — tests fail", "Add space before em dash — tests fail"],
      goal: {
        text: "STR-402 format OK",
        check: (r) => {
          if (!r.ok || r.error) return false;
          const out = r.stdout ?? "";
          return !out.includes("FAIL") && (out.match(/OK/g)?.length ?? 0) >= 2;
        },
        success: "Report lines match product copy spec.",
      },
    },
    {
      type: "playground",
      id: "ex-str403",
      title: "Extension · STR-403 parse_person_rows",
      intro: "splitlines + parse_person_row; skip bad lines.",
      starter: `def parse_person_row(line):
    text = line.strip()
    if not text:
        return None
    parts = [p.strip() for p in text.split(",")]
    if len(parts) != 3:
        return None
    name, age_s, city = parts
    if not age_s.isdigit():
        return None
    return {"name": name, "age": int(age_s), "city": city}

def parse_person_rows(blob):
    out = []
    for line in blob.splitlines():
        row = parse_person_row(line)
        if row is not None:
            out.append(row)
    return out

blob = "ada,30,BLR\\nbad,row\\nbob,22,DEL\\n"
got = parse_person_rows(blob)
expected = [
    {"name": "ada", "age": 30, "city": "BLR"},
    {"name": "bob", "age": 22, "city": "DEL"},
]
print("OK" if got == expected else f"FAIL {got}")`,
      tryThis: ["Empty line between rows — still OK?", "Trailing newline only — len?"],
      goal: {
        text: "STR-403 batch OK",
        check: (r) => {
          if (!r.ok || r.error) return false;
          return (r.stdout ?? "").includes("OK");
        },
        success: "Multi-line ingest skips garbage, preserves order.",
      },
    },
  ],

  practice: [
    {
      id: "q1",
      type: "mcq",
      skill: "strip",
      level: "easy",
      prompt: "\"  hi  \".strip() equals?",
      options: ['"  hi  "', '"hi"', '"hi  "', "Error"],
      answer: 1,
      explain: "strip removes leading and trailing whitespace.",
    },
    {
      id: "q2",
      type: "mcq",
      skill: "split",
      level: "easy",
      prompt: '"a,b,c".split(",") produces?',
      options: ['("a","b","c")', '["a","b","c"]', '{"a","b","c"}', "3 strings not in a list"],
      answer: 1,
      explain: "split always returns a list of strings.",
    },
    {
      id: "q3",
      type: "mcq",
      skill: "join",
      level: "easy",
      prompt: "Which is valid join syntax?",
      options: ['join(",", ["a","b"])', '",".join(["a","b"])', '["a","b"].join(",")', 'split(",").join'],
      answer: 1,
      explain: "Call join on the separator string.",
    },
    {
      id: "q4",
      type: "fill",
      skill: "STR-401",
      level: "medium",
      prompt: "Complete the field-cleaning comprehension.",
      code: `parts = [p.___() for p in text.split(",")]`,
      answers: ["strip"],
      mode: "code",
      explain: "Each token may have spaces from the upload.",
    },
    {
      id: "q5",
      type: "order",
      skill: "Workflow",
      level: "easy",
      prompt: "Order STR-401 ingest steps.",
      lines: [
        "Return dict or None",
        "strip line; bail if empty",
        "split on comma; strip parts; check len == 3",
        "Validate age with isdigit; int(age)",
      ],
      explain: "Normalize → structure → validate → return.",
    },
    {
      id: "q6",
      type: "write",
      skill: "STR-401",
      level: "medium",
      prompt: "Implement parse_person_row(line) per STR-401 spec.",
      starter: `def parse_person_row(line):
    pass

print(parse_person_row("ada,30,BLR") == {"name": "ada", "age": 30, "city": "BLR"})
print(parse_person_row("ada,30") is None)`,
      hint: "strip, len 3, isdigit on age",
      solution: `def parse_person_row(line):
    text = line.strip()
    if not text:
        return None
    parts = [p.strip() for p in text.split(",")]
    if len(parts) != 3:
        return None
    name, age_s, city = parts
    if not age_s.isdigit():
        return None
    return {"name": name, "age": int(age_s), "city": city}`,
      check: (r) => {
        if (!r.ok) return r.error || "Error";
        const out = r.stdout ?? "";
        if (!out.includes("True")) return "First assertion should be True";
        if (!out.includes("None") && !out.includes("True")) return "Second should confirm None";
        const lines = out.trim().split("\n");
        if (lines.length < 2 || !lines[1].includes("True")) return "Second line should print True (is None)";
        return null;
      },
    },
    {
      id: "q7",
      type: "write",
      skill: "STR-402",
      level: "medium",
      prompt: "Implement format_person_summary(row) with f-string.",
      starter: `def format_person_summary(row):
    pass

print(format_person_summary({"name": "ada", "age": 30, "city": "BLR"}) == "ada (30) — BLR")`,
      hint: "f\"{name} ({age}) — {city}\" with row keys",
      solution: `def format_person_summary(row):
    return f"{row['name']} ({row['age']}) — {row['city']}"`,
      check: (r) => {
        if (!r.ok) return r.error || "Error";
        if (!(r.stdout ?? "").includes("True")) return "Expected True";
        return null;
      },
    },
    {
      id: "q8",
      type: "mcq",
      skill: "splitlines",
      level: "medium",
      prompt: '"a\\nb".splitlines() is?',
      options: ['["a","b"]', '["a\\nb"]', "2 chars", "Error"],
      answer: 0,
      explain: "Breaks on line separator into list of lines.",
    },
    {
      id: "q9",
      type: "write",
      skill: "STR-403",
      level: "hard",
      prompt: "Implement parse_person_rows(blob) using parse_person_row (copy parser into editor if needed).",
      starter: `def parse_person_row(line):
    text = line.strip()
    if not text:
        return None
    parts = [p.strip() for p in text.split(",")]
    if len(parts) != 3:
        return None
    name, age_s, city = parts
    if not age_s.isdigit():
        return None
    return {"name": name, "age": int(age_s), "city": city}

def parse_person_rows(blob):
    pass

blob = "a,1,X\\nz,9,Y"
print(parse_person_rows(blob) == [{"name": "a", "age": 1, "city": "X"}, {"name": "z", "age": 9, "city": "Y"}])`,
      hint: "splitlines loop; append when row is not None",
      solution: `def parse_person_rows(blob):
    out = []
    for line in blob.splitlines():
        row = parse_person_row(line)
        if row is not None:
            out.append(row)
    return out`,
      challenge: true,
      check: (r) => {
        if (!r.ok) return r.error || "Error";
        if (!(r.stdout ?? "").includes("True")) return "Fix parse_person_rows";
        return null;
      },
    },
    {
      id: "q10",
      type: "mcq",
      skill: "Validation",
      level: "medium",
      prompt: "Which returns False for age_s = \"12.5\"?",
      options: ["age_s.isdigit()", "int(age_s)", "len(age_s) > 0", "age_s.strip()"],
      answer: 0,
      explain: "isdigit is False for decimal point; int would raise.",
    },
    {
      id: "q11",
      type: "mcq",
      skill: "Defensive",
      level: "medium",
      prompt: "Best STR-401 behavior for line \" , , \" after strip and split?",
      options: [
        "Return dict with empty strings",
        "Return None — wrong field count or invalid age",
        "Raise ValueError",
        "Skip strip",
      ],
      answer: 1,
      explain: "Three empty parts might pass len==3 but isdigit fails on empty age — None.",
    },
  ],
};
