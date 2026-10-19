import type { PythonLmsLesson } from "@/lib/python-lms/types";

export const INT_LESSON_02: PythonLmsLesson = {
  slug: "int-02",
  number: 2,
  title: "Dictionaries & counting",
  subtitle: "Maps, tallies, and grouping records",
  minutes: 95,
  course: "intermediate",
  goals: [
    "Choose a dictionary when you need lookup or counting by a key",
    "Create and update dicts without KeyError on missing keys",
    "Use .get(key, default) and the counting idiom in production code",
    "Iterate .items() to build readable tally reports",
    "Group rows (lists of records) into buckets in one pass",
    "Write table-driven tests for counting and grouping functions",
    "Explain hashable keys and common dict bugs in code review",
  ],
  canDo:
    "Ship ticket LOG-201: word-frequency from a token list and LOG-202: HTTP status tallies — pure functions, matrix tests, sorted summary output.",

  notes: [
    {
      id: "why-dicts",
      part: "Chapter 1 · The right data structure",
      title: "Lists answer order; dicts answer “which one?”",
      blocks: [
        {
          type: "lead",
          text: "Lesson 1 was **decisions and specs**. Lesson 2 is **data in memory**: how teams count events, group users, and look up settings in O(1) average time.",
        },
        {
          type: "p",
          text: "If you only need a sequence (first, second, third), use a **list**. If you need **“how many errors for status 404?”** or **“phone number for user ada”**, use a **dict** (dictionary / map / hash map).",
        },
        {
          type: "compare",
          left: {
            label: "List scan (slow habit)",
            code: `names = ["ada", "bob", "ada"]
# how many "ada"? loop entire list`,
            output: "O(n) every question",
            tone: "bad",
          },
          right: {
            label: "Dict tally (job habit)",
            code: `counts = {}
# one pass, then counts["ada"]`,
            output: "O(1) lookup after tally",
            tone: "good",
          },
        },
        {
          type: "check",
          id: "c-why",
          question: "You need “count of each product SKU sold today.” Best core structure?",
          options: ["List of all sales in order", "Dict SKU → count", "Single float variable", "Set of SKUs only"],
          answer: 1,
          explain: "You need both **which SKU** and **how many** — a map from SKU to count.",
        },
      ],
    },
    {
      id: "dict-table-model",
      part: "Chapter 1 · The right data structure",
      title: "Think table: unique key → value",
      blocks: [
        {
          type: "p",
          text: "A dictionary is a **mutable** collection of **key → value** pairs. Keys are **unique** (like primary keys in a database row). Values can be anything: numbers, strings, lists, even other dicts.",
        },
        {
          type: "table",
          head: ["Key", "Value", "Real-world meaning"],
          rows: [
            ["404", "128", "HTTP 404 happened 128 times"],
            ["ada", "3", "Word ada appears 3 times"],
            ["IN", "5400", "Users from India"],
          ],
        },
        {
          type: "code",
          code: `counts = {"404": 128, "500": 4, "200": 9200}
print(counts["404"])
print(len(counts))`,
          live: true,
          output: "128\n3",
        },
        {
          type: "terms",
          items: [
            { term: "Key", meaning: "Lookup label — must be hashable (immutable-ish)." },
            { term: "Value", meaning: "Data stored for that key — any type." },
            { term: "Mapping", meaning: "Abstract idea — dict is Python’s main mapping type." },
          ],
        },
      ],
    },
    {
      id: "case-log201-spec",
      part: "Case study A · SpecPulse LOG-201",
      title: "Ticket: word frequency in a batch",
      blocks: [
        {
          type: "callout",
          tone: "exam",
          title: "LOG-201 · word_frequency(tokens)",
          text: "Input: list of strings (already lowercased, no punctuation). Output: dict mapping each distinct word to its count. Empty list → empty dict. Do not print inside the function — return the dict only.",
        },
        {
          type: "p",
          text: "Acceptance criteria (turn into tests before coding):",
        },
        {
          type: "table",
          head: ["ID", "Input tokens", "Expected dict"],
          rows: [
            ["L1", "[]", "{}"],
            ["L2", '["a"]', '{"a": 1}'],
            ["L3", '["a","b","a"]', '{"a": 2, "b": 1}'],
            ["L4", '["go","go","go"]', '{"go": 3}'],
          ],
        },
        {
          type: "p",
          text: "This ticket appears in **log analytics**, **search term reports**, and **quiz apps** — same pattern everywhere.",
        },
      ],
    },
    {
      id: "creating-dicts",
      part: "Chapter 2 · Syntax and access",
      title: "Creating dictionaries",
      blocks: [
        {
          type: "list",
          items: [
            "**Literal**: counts = {\"a\": 1, \"b\": 2}",
            "**Empty**: counts = {} or dict()",
            "**From pairs**: dict([(\"a\", 1), (\"b\", 2)]) — less common in jobs",
          ],
        },
        {
          type: "anatomy",
          code: '{"status": 404}',
          parts: [
            { token: '"status"', label: "Key — string in quotes" },
            { token: ":", label: "Separates key from value" },
            { token: "404", label: "Value — number here" },
          ],
        },
        {
          type: "check",
          id: "c-create",
          question: "Which creates an empty dict ready for counting?",
          options: ["counts = []", "counts = {}", "counts = ()", "counts = set()"],
          answer: 1,
          explain: "{} is the empty dictionary literal.",
        },
      ],
    },
    {
      id: "access-keyerror",
      part: "Chapter 2 · Syntax and access",
      title: "Reading keys: [] vs .get()",
      blocks: [
        {
          type: "p",
          text: "d[key] **requires** the key to exist — otherwise Python raises **KeyError** and your batch job crashes.",
        },
        {
          type: "code",
          code: `counts = {"a": 2}
print(counts["a"])   # 2
print(counts["z"])   # KeyError — key missing`,
          live: false,
        },
        {
          type: "p",
          text: "**d.get(key, default)** returns default when the key is missing — no exception. This is the professional default for **counting** and **optional settings**.",
        },
        {
          type: "code",
          code: `counts = {"a": 2}
print(counts.get("a", 0))   # 2
print(counts.get("z", 0))   # 0 — safe`,
          live: true,
        },
        {
          type: "callout",
          tone: "warn",
          title: "Production story",
          text: "A nightly report used counts[word] += 1 on the first sighting of a word. **KeyError at 02:00** — pager duty. Fix: counts[word] = counts.get(word, 0) + 1.",
        },
        {
          type: "check",
          id: "c-get",
          question: "counts is empty. Which line safely adds 1 for key \"x\"?",
          options: [
            "counts[\"x\"] += 1",
            "counts[\"x\"] = counts.get(\"x\", 0) + 1",
            "counts.get(\"x\") + 1",
            "del counts[\"x\"]",
          ],
          answer: 1,
          explain: "get supplies 0 when x is missing; then you store the new total.",
        },
      ],
    },
    {
      id: "counting-idiom",
      part: "Chapter 2 · Syntax and access",
      title: "The counting idiom (memorize this)",
      blocks: [
        {
          type: "p",
          text: "One pass over data, constant-time update per item:",
        },
        {
          type: "code",
          filename: "word_frequency.py",
          code: `def word_frequency(tokens):
    counts = {}
    for word in tokens:
        counts[word] = counts.get(word, 0) + 1
    return counts`,
          live: true,
        },
        {
          type: "flow",
          title: "First time seeing word ada",
          steps: [
            { kind: "process", text: "counts.get(\"ada\", 0) → 0" },
            { kind: "io", text: "Store counts[\"ada\"] = 1" },
            { kind: "process", text: "Second ada: get → 1, store 2" },
            { kind: "terminal", text: "Return counts when loop finishes" },
          ],
        },
        {
          type: "compare",
          left: {
            label: "Bug: += on missing key",
            code: "counts[w] += 1",
            output: "KeyError on first w",
            tone: "bad",
          },
          right: {
            label: "Fix: get then assign",
            code: "counts[w] = counts.get(w, 0) + 1",
            output: "Safe first sighting",
            tone: "good",
          },
        },
      ],
    },
    {
      id: "in-operator",
      part: "Chapter 2 · Syntax and access",
      title: "Membership: key in d",
      blocks: [
        {
          type: "p",
          text: "**key in d** returns True or False — use before risky reads or when branching on presence:",
        },
        {
          type: "code",
          code: `settings = {"theme": "dark", "lang": "en"}
if "theme" in settings:
    print(settings["theme"])`,
          live: true,
        },
        {
          type: "p",
          text: "For counting you rarely need **in** — .get() already handles absence. Use **in** when missing key means a **different code path** (e.g. default config).",
        },
      ],
    },
    {
      id: "items-loop",
      part: "Chapter 3 · Reports and iteration",
      title: "Looping with .items() for dashboards",
      blocks: [
        {
          type: "p",
          text: "After tallying, stakeholders want a **report**. Loop **for key, value in counts.items():** — the standard pattern:",
        },
        {
          type: "code",
          code: `counts = {"404": 128, "500": 4}
for code, n in counts.items():
    print(code, n)`,
          live: true,
        },
        {
          type: "p",
          text: "**.keys()** and **.values()** exist, but **.items()** is what you use in interviews and jobs when you need both.",
        },
        {
          type: "check",
          id: "c-items",
          question: "counts = {\"a\": 2, \"b\": 1}. How many times does print run in: for k, v in counts.items(): print(k, v)?",
          options: ["1", "2", "3", "0"],
          answer: 1,
          explain: "Two key-value pairs → two iterations.",
        },
      ],
    },
    {
      id: "sorted-report",
      part: "Chapter 3 · Reports and iteration",
      title: "Sorted reports (LOG-201 deliverable)",
      blocks: [
        {
          type: "p",
          text: "Product asked: print words **alphabetically** so diffing nightly logs is easy:",
        },
        {
          type: "code",
          code: `def format_word_report(counts):
    lines = []
    for word in sorted(counts.keys()):
        lines.append(f"{word}: {counts[word]}")
    return "\\n".join(lines)`,
        },
        {
          type: "p",
          text: "sorted(counts.keys()) returns a **list** — you still look up counts[word] inside the loop. Alternative: sorted(counts.items()) sorts by key by default.",
        },
        {
          type: "callout",
          tone: "tip",
          text: "Separate **pure tally** (word_frequency) from **presentation** (format_word_report) — same lesson-1 decomposition rule.",
        },
      ],
    },
    {
      id: "case-log202",
      part: "Case study B · SpecPulse LOG-202",
      title: "Ticket: HTTP status tallies",
      blocks: [
        {
          type: "callout",
          tone: "fact",
          title: "LOG-202 · status_tally(codes)",
          text: "Input: list of integer status codes from access logs (e.g. 200, 404, 500). Output: dict mapping each code seen to how many times it appeared. Same counting idiom — keys are ints.",
        },
        {
          type: "table",
          head: ["Input", "Output"],
          rows: [
            ["[200, 404, 200]", "{200: 2, 404: 1}"],
            ["[]", "{}"],
            ["[500, 500, 500]", "{500: 3}"],
          ],
        },
        {
          type: "code",
          code: `def status_tally(codes):
    tallies = {}
    for code in codes:
        tallies[code] = tallies.get(code, 0) + 1
    return tallies`,
          live: true,
        },
        {
          type: "p",
          text: "Keys are **integers** here — valid dict keys. Values are counts. Do not stringify codes unless the ticket says so.",
        },
      ],
    },
    {
      id: "grouping-records",
      part: "Chapter 4 · Grouping (next step up)",
      title: "From counts to buckets",
      blocks: [
        {
          type: "p",
          text: "Analytics often receives **rows** (list of dicts) and must **group** by a field:",
        },
        {
          type: "code",
          code: `rows = [
    {"city": "BLR", "user": "a1"},
    {"city": "DEL", "user": "b2"},
    {"city": "BLR", "user": "c3"},
]
by_city = {}
for row in rows:
    city = row["city"]
    if city not in by_city:
        by_city[city] = []
    by_city[city].append(row["user"])`,
        },
        {
          type: "p",
          text: "Result: BLR → two users, DEL → one. Pattern: **dict of lists**. Values start empty list, then append.",
        },
        {
          type: "code",
          code: `# idiomatic one-liner body (same logic):
by_city.setdefault(city, []).append(row["user"])`,
        },
        {
          type: "callout",
          tone: "exam",
          title: "Interview",
          text: "“Group a list of records by field X” → dict where values are lists (or counts if you only need size).",
        },
      ],
    },
    {
      id: "hashable-keys",
      part: "Chapter 4 · Grouping (next step up)",
      title: "What can be a key?",
      blocks: [
        {
          type: "table",
          head: ["Valid key", "Invalid key (why)"],
          rows: [
            ["str, int, float, bool", "list — mutable, unhashable"],
            ["tuple of immutables", "dict — mutable"],
            ["None", "set as key — rare but allowed"],
          ],
        },
        {
          type: "p",
          text: "If you need a **composite key** (city + date), use a **tuple**: (city, date) or a single string f\"{city}|{date}\".",
        },
        {
          type: "check",
          id: "c-hash",
          question: "Which cannot be a dict key?",
          options: ['"status"', "404", "[1, 2]", "(1, 2)"],
          answer: 2,
          explain: "Lists are mutable and not hashable.",
        },
      ],
    },
    {
      id: "stdlib-counter",
      part: "Chapter 4 · Grouping (next step up)",
      title: "stdlib Counter (know it exists)",
      blocks: [
        {
          type: "p",
          text: "Python’s **collections.Counter** wraps the same counting idea. Teams still want you to implement the idiom by hand in interviews:",
        },
        {
          type: "code",
          code: `from collections import Counter
counts = Counter(["a", "b", "a"])
print(dict(counts))  # {'a': 2, 'b': 1}`,
          live: false,
        },
        {
          type: "callout",
          tone: "tip",
          text: "In this course you implement **word_frequency** yourself. In production after review, Counter is acceptable if the team allows it.",
        },
      ],
    },
    {
      id: "testing-dicts",
      part: "Chapter 5 · Quality",
      title: "Testing dict outputs",
      blocks: [
        {
          type: "p",
          text: "Dict equality in Python is **order-independent** for == — perfect for tests:",
        },
        {
          type: "code",
          code: `got = word_frequency(["a", "b", "a"])
expected = {"a": 2, "b": 1}
assert got == expected, f"got {got}"`,
        },
        {
          type: "list",
          ordered: true,
          items: [
            "Call function with fixture input",
            "Compare entire dict to expected with ==",
            "On failure, print got vs expected (reviewer-friendly)",
            "Test empty input and single-key edge cases",
          ],
        },
      ],
    },
    {
      id: "review-dict-bugs",
      part: "Chapter 5 · Quality",
      title: "Code review: dict anti-patterns",
      blocks: [
        {
          type: "table",
          head: ["Comment", "Fix"],
          rows: [
            ["KeyError on first count", "Use .get(key, 0) + 1"],
            ["Mutating dict while looping keys", "Loop over list(d.keys()) copy"],
            ["Using float as money key", "Use int paise or Decimal per ticket"],
            ["Returning None instead of {}", "Empty input → empty dict"],
          ],
        },
        {
          type: "check",
          id: "c-review",
          question: "word_frequency([]) should return?",
          options: ["None", "{}", "0", "KeyError"],
          answer: 1,
          explain: "LOG-201: empty list → empty dict, not None.",
        },
      ],
    },
    {
      id: "capstone-bridge",
      part: "Chapter 5 · Quality",
      title: "Capstone + what lesson 3 previews",
      blocks: [
        {
          type: "p",
          text: "Complete **LOG-201** and **LOG-202** in Examples and Practice. Lesson 3 (**Sets & fast lookup**) adds **membership** and deduplication when you only care **if** you’ve seen something, not how many times.",
        },
        {
          type: "flashcards",
          cards: [
            { q: "Counting idiom?", a: "counts[k] = counts.get(k, 0) + 1" },
            { q: "Safe read?", a: "d.get(k, default) — no KeyError" },
            { q: "Report loop?", a: "for k, v in d.items(): ..." },
            { q: "Test dicts?", a: "assert got == expected" },
          ],
        },
        {
          type: "callout",
          tone: "exam",
          title: "Deliverables",
          text: "Pass word_frequency and status_tally matrices in Examples. Practice includes grouping and a full LOG-201 write challenge.",
        },
      ],
    },
  ],

  examples: [
    {
      type: "trace",
      id: "ex-get-trace",
      title: "Trace: .get on empty dict",
      intro: "First token in LOG-201 — watch default 0 appear.",
      code: `counts = {}
word = "ada"
counts[word] = counts.get(word, 0) + 1
print(counts)`,
      steps: [
        {
          line: 4,
          output: "{'ada': 1}\n",
          note: "get returned 0; assignment stored 1 under ada.",
        },
      ],
    },
    {
      type: "trace",
      id: "ex-loop-trace",
      title: "Trace: full LOG-201 loop",
      intro: "Tokens a, b, a — final dict step by step.",
      code: `def word_frequency(tokens):
    counts = {}
    for word in tokens:
        counts[word] = counts.get(word, 0) + 1
    return counts

print(word_frequency(["a", "b", "a"]))`,
      steps: [
        { line: 8, output: "{'a': 2, 'b': 1}\n", note: "After loop: a seen twice, b once." },
      ],
    },
    {
      type: "trace",
      id: "ex-items-trace",
      title: "Trace: status report lines",
      intro: "Turn tallies into human-readable lines.",
      code: `t = {200: 2, 404: 1}
for code, n in sorted(t.items()):
    print(code, n)`,
      steps: [
        { line: 4, output: "404 1\n200 2\n", note: "Sorted by code: 404 before 200." },
      ],
    },
    {
      type: "playground",
      id: "ex-log201",
      title: "Deliverable · LOG-201 word_frequency",
      intro: "Implement word_frequency(tokens). Run all matrix rows — compare dicts with ==.",
      starter: `def word_frequency(tokens):
    counts = {}
    for word in tokens:
        counts[word] = counts.get(word, 0) + 1
    return counts

TESTS = [
    ([], {}),
    (["a"], {"a": 1}),
    (["a", "b", "a"], {"a": 2, "b": 1}),
    (["go", "go", "go"], {"go": 3}),
]

for tokens, expected in TESTS:
    got = word_frequency(tokens)
    print(tokens, "OK" if got == expected else f"FAIL got {got}")`,
      tryThis: [
        "Break .get once — see which row FAILs",
        "Add [\"x\",\"y\",\"x\"] test row in the loop",
      ],
      goal: {
        text: "All LOG-201 tests print OK",
        check: (r) => {
          if (!r.ok || r.error) return false;
          const out = r.stdout ?? "";
          return out.split("\n").filter((l) => l.trim()).every((l) => l.includes("OK")) && !out.includes("FAIL");
        },
        success: "LOG-201 ready for PR — dict tally correct.",
      },
    },
    {
      type: "playground",
      id: "ex-log202",
      title: "Deliverable · LOG-202 status_tally",
      intro: "Integer keys — same idiom, different domain.",
      starter: `def status_tally(codes):
    tallies = {}
    for code in codes:
        tallies[code] = tallies.get(code, 0) + 1
    return tallies

TESTS = [
    ([200, 404, 200], {200: 2, 404: 1}),
    ([], {}),
    ([500, 500, 500], {500: 3}),
]

for codes, expected in TESTS:
    got = status_tally(codes)
    print(codes, "OK" if got == expected else f"FAIL got {got}")`,
      tryThis: ["Use 201 and 201 and 404 as input"],
      goal: {
        text: "All LOG-202 tests OK",
        check: (r) => {
          if (!r.ok || r.error) return false;
          const out = r.stdout ?? "";
          return !out.includes("FAIL") && (out.match(/OK/g)?.length ?? 0) >= 3;
        },
        success: "Status tallies match spec.",
      },
    },
    {
      type: "playground",
      id: "ex-group-city",
      title: "Extension · Group users by city",
      intro: "Build dict city → list of user ids from rows.",
      starter: `def users_by_city(rows):
    by_city = {}
    for row in rows:
        city = row["city"]
        user = row["user"]
        if city not in by_city:
            by_city[city] = []
        by_city[city].append(user)
    return by_city

rows = [
    {"city": "BLR", "user": "u1"},
    {"city": "DEL", "user": "u2"},
    {"city": "BLR", "user": "u3"},
]
got = users_by_city(rows)
expected = {"BLR": ["u1", "u3"], "DEL": ["u2"]}
print("OK" if got == expected else f"FAIL {got}")`,
      tryThis: ["Add a third city row", "Use .get with list default pattern"],
      goal: {
        text: "Grouping OK",
        check: (r) => {
          if (!r.ok || r.error) return false;
          return (r.stdout ?? "").includes("OK");
        },
        success: "You grouped records — real analytics shape.",
      },
    },
  ],

  practice: [
    {
      id: "q1",
      type: "mcq",
      skill: "Concept",
      level: "easy",
      prompt: "What does counts.get(\"x\", 0) return if \"x\" is not in counts?",
      options: ["KeyError", "0", "None", "False"],
      answer: 1,
      explain: "Second argument is the default when the key is missing.",
    },
    {
      id: "q2",
      type: "mcq",
      skill: "Counting",
      level: "easy",
      prompt: "After: for w in [\"a\",\"a\"]: counts[w] = counts.get(w,0)+1 — what is counts[\"a\"]?",
      options: ["0", "1", "2", "KeyError"],
      answer: 2,
      explain: "Incremented twice → 2.",
    },
    {
      id: "q3",
      type: "mcq",
      skill: "Keys",
      level: "medium",
      prompt: "Which is a valid dict key?",
      options: ["[1,2]", "{1:2}", "(1, 2)", "[[1]]"],
      answer: 2,
      explain: "Tuples of hashable items work; lists do not.",
    },
    {
      id: "q4",
      type: "fill",
      skill: "Idiom",
      level: "medium",
      prompt: "Complete the counting line.",
      code: `counts[word] = counts.___(word, 0) + 1`,
      answers: ["get"],
      mode: "code",
      explain: ".get supplies 0 on first sighting.",
    },
    {
      id: "q5",
      type: "order",
      skill: "Workflow",
      level: "easy",
      prompt: "Order steps to ship LOG-201.",
      lines: [
        "Compare dict to expected in tests",
        "Read ticket acceptance criteria",
        "Implement word_frequency with .get idiom",
        "Run matrix on empty and sample tokens",
      ],
      explain: "Spec → implement → test → assert.",
    },
    {
      id: "q6",
      type: "write",
      skill: "LOG-201",
      level: "medium",
      prompt: "Implement word_frequency(tokens) — return dict of counts.",
      starter: `def word_frequency(tokens):
    pass

print(word_frequency(["a", "b", "a"]) == {"a": 2, "b": 1})`,
      hint: "Empty dict, loop tokens, .get(word, 0) + 1",
      solution: `def word_frequency(tokens):
    counts = {}
    for word in tokens:
        counts[word] = counts.get(word, 0) + 1
    return counts`,
      check: (r) => {
        if (!r.ok) return r.error || "Error";
        const out = r.stdout ?? "";
        if (!out.includes("True")) return "Should print True";
        return null;
      },
    },
    {
      id: "q7",
      type: "write",
      skill: "LOG-202",
      level: "medium",
      prompt: "Implement status_tally(codes) for integer HTTP codes.",
      starter: `def status_tally(codes):
    pass

print(status_tally([200, 404, 200]) == {200: 2, 404: 1})`,
      hint: "Same pattern as words — keys are ints.",
      solution: `def status_tally(codes):
    tallies = {}
    for code in codes:
        tallies[code] = tallies.get(code, 0) + 1
    return tallies`,
      check: (r) => {
        if (!r.ok) return r.error || "Error";
        if (!(r.stdout ?? "").includes("True")) return "Expected True";
        return null;
      },
    },
    {
      id: "q8",
      type: "mcq",
      skill: "Iteration",
      level: "easy",
      prompt: "To print both key and value while looping, use:",
      options: ["for k in counts:", "for v in counts.values():", "for k, v in counts.items():", "for counts in k:"],
      answer: 2,
      explain: ".items() yields (key, value) pairs.",
    },
    {
      id: "q9",
      type: "write",
      skill: "Grouping",
      level: "hard",
      prompt: "Count how many times each vowel appears in text (only a,e,i,o,u lowercase).",
      starter: `def vowel_counts(text):
    vowels = "aeiou"
    counts = {}
    for ch in text:
        if ch in vowels:
            counts[ch] = counts.get(ch, 0) + 1
    return counts

# should print True
print(vowel_counts("hello") == {"e": 1, "o": 1})`,
      hint: "Filter with if ch in vowels, then counting idiom.",
      solution: `def vowel_counts(text):
    vowels = "aeiou"
    counts = {}
    for ch in text:
        if ch in vowels:
            counts[ch] = counts.get(ch, 0) + 1
    return counts`,
      challenge: true,
      check: (r) => {
        if (!r.ok) return r.error || "Error";
        if (!(r.stdout ?? "").includes("True")) return "Fix vowel_counts logic";
        return null;
      },
    },
    {
      id: "q10",
      type: "mcq",
      skill: "Testing",
      level: "medium",
      prompt: "word_frequency([\"a\"]) returns {\"a\": 1}. Best assertion?",
      options: [
        "assert len(counts) == 1",
        "assert counts == {\"a\": 1}",
        "assert counts[\"a\"] > 0 only",
        "print counts",
      ],
      answer: 1,
      explain: "Full dict equality catches wrong extra keys or counts.",
    },
  ],
};
