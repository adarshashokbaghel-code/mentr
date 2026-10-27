import type { PythonLmsLesson } from "@/lib/python-lms/types";

export const INT_LESSON_03: PythonLmsLesson = {
  slug: "int-03",
  number: 3,
  title: "Sets & fast lookup",
  subtitle: "SET-301 / SET-302 — uniqueness, membership, and set algebra",
  minutes: 98,
  course: "intermediate",
  goals: [
    "Pick a set when the question is uniqueness or “have I seen this?” — not counting",
    "Use membership (x in s) and add/discard with correct semantics in loops",
    "Implement has_duplicate and dedupe patterns that pass table-driven tests",
    "Apply union, intersection, and difference to compare two collections of IDs",
    "Explain average O(1) lookup vs scanning a list — in interview language",
    "Test set results without relying on print order (sorted, ==, subset checks)",
    "Spot hashability and mutable-element bugs before code review",
  ],
  canDo:
    "Ship SET-301 has_duplicate(ids) and SET-302 unique_ids(rows) — pure functions, matrix tests, and a tags-overlap helper using set intersection.",

  notes: [
    {
      id: "bridge-lesson2",
      part: "Chapter 1 · After dicts",
      title: "Counts vs uniqueness — two different questions",
      blocks: [
        {
          type: "lead",
          text: "Lesson 2 answered **“how many?”** with dict tallies. Lesson 3 answers **“is this new?”**, **“any duplicate?”**, and **“what do both lists share?”** — that is the **set**.",
        },
        {
          type: "table",
          head: ["Question", "Best tool", "Why"],
          rows: [
            ["How many 404s today?", "dict code → count", "You need frequencies"],
            ["Did we already process this request id?", "set of seen ids", "Only yes/no per id"],
            ["Any email twice in this upload?", "set while scanning", "Stop at second sighting"],
            ["Tags on both product A and B?", "set intersection", "Shared members only"],
          ],
        },
        {
          type: "check",
          id: "c-bridge",
          question: "Ticket: return True if any value appears twice in a list (order does not matter). Core structure?",
          options: [
            "Dict value → count, then scan for count > 1",
            "Set while iterating — return True on second add attempt",
            "Sort the list and compare neighbors only",
            "List.append and hope",
          ],
          answer: 1,
          explain: "All three of dict, set, and sort can work — but **set + early exit** is the clearest job pattern for interviews and logs.",
        },
      ],
    },
    {
      id: "set-mental-model",
      part: "Chapter 1 · After dicts",
      title: "A set is a bag of unique, hashable items",
      blocks: [
        {
          type: "p",
          text: "A **set** stores **at most one copy** of each element. There are **no keys** and **no order guarantee** (do not build UX on print order). Membership **x in s** is the superpower — average **O(1)** time vs **O(n)** for a list scan.",
        },
        {
          type: "compare",
          left: {
            label: "List membership (fine for tiny data)",
            code: `allowed = ["IN", "US", "UK"]
"IN" in allowed  # scans left to right`,
            output: "O(n) per check",
            tone: "neutral",
          },
          right: {
            label: "Set membership (scale habit)",
            code: `allowed = {"IN", "US", "UK"}
"IN" in allowed  # hash lookup`,
            output: "O(1) average per check",
            tone: "good",
          },
        },
        {
          type: "terms",
          items: [
            { term: "Unique", meaning: "Adding the same item again does nothing — still one copy." },
            { term: "Hashable", meaning: "Element must be immutable enough to hash — str, int, tuple of hashables; not list or dict." },
            { term: "Mutable set", meaning: "Built-in set — you can add and remove." },
            { term: "frozenset", meaning: "Immutable set — usable as dict key or nested in another set." },
          ],
        },
      ],
    },
    {
      id: "case-set301",
      part: "Case study A · SpecPulse SET-301",
      title: "Ticket: has_duplicate(values)",
      blocks: [
        {
          type: "callout",
          tone: "exam",
          title: "SET-301 · has_duplicate(values)",
          text: "Input: list of hashable values (ints, strings, etc.). Output: True if **any** value appears at least twice, else False. Empty list → False. Single element → False. Do not mutate the input list. Pure function — no print inside.",
        },
        {
          type: "table",
          head: ["ID", "Input", "Expected"],
          rows: [
            ["S1", "[]", "False"],
            ["S2", "[1]", "False"],
            ["S3", "[1, 2, 3]", "False"],
            ["S4", "[1, 2, 1]", "True"],
            ["S5", '["a", "b", "a"]', "True"],
            ["S6", "[3, 3, 3]", "True"],
          ],
        },
        {
          type: "p",
          text: "This ticket shows up in **CSV importers**, **device id pipelines**, and **leetcode-style screens** — same spec, same set loop.",
        },
        {
          type: "flow",
          title: "Algorithm (set + early exit)",
          steps: [
            { kind: "terminal", text: "seen = empty set" },
            { kind: "process", text: "For each x in values" },
            { kind: "decision", text: "If x already in seen → return True" },
            { kind: "process", text: "Else seen.add(x)" },
            { kind: "terminal", text: "Return False after loop" },
          ],
        },
      ],
    },
    {
      id: "creating-sets",
      part: "Chapter 2 · Syntax",
      title: "Creating and displaying sets",
      blocks: [
        {
          type: "list",
          items: [
            "**Literal**: tags = {\"python\", \"api\", \"logs\"} — curly braces, comma-separated",
            "**Empty set**: tags = set() — **not** {} (that is an empty dict)",
            "**From iterable**: set([1, 2, 2, 3]) → {1, 2, 3} — dedupes on construction",
            "**Set comprehension**: {x for x in nums if x > 0} — like list comp, curly result",
          ],
        },
        {
          type: "code",
          code: `tags = {"python", "api"}
print(len(tags))
print("python" in tags)

empty = set()
print(len(empty))`,
          live: true,
          output: "2\nTrue\n0",
        },
        {
          type: "callout",
          tone: "warn",
          title: "Empty {} trap",
          text: "x = {} creates a **dict**. For an empty set you must write **set()** or **set([])**.",
        },
        {
          type: "check",
          id: "c-empty",
          question: "Which creates an empty set?",
          options: ["{}", "set()", "[]", "dict()"],
          answer: 1,
          explain: "{} is empty dict; set() is empty set.",
        },
      ],
    },
    {
      id: "add-discard",
      part: "Chapter 2 · Syntax",
      title: "add, discard, remove — know the difference",
      blocks: [
        {
          type: "table",
          head: ["Method", "If item present", "If item missing"],
          rows: [
            ["s.add(x)", "No change (still one x)", "Inserts x"],
            ["s.discard(x)", "Removes x", "No error — safe default"],
            ["s.remove(x)", "Removes x", "KeyError — like dict[key]"],
          ],
        },
        {
          type: "code",
          code: `seen = set()
seen.add("a")
seen.add("a")
print(seen)
seen.discard("z")
print(len(seen))`,
          live: true,
          output: "{'a'}\n1",
        },
        {
          type: "p",
          text: "In **SET-301**, use **if x in seen** before add, or add then check size — the **in** check is clearer in reviews.",
        },
      ],
    },
    {
      id: "implement-set301",
      part: "Case study A · SpecPulse SET-301",
      title: "Reference solution and review notes",
      blocks: [
        {
          type: "code",
          code: `def has_duplicate(values):
    seen = set()
    for x in values:
        if x in seen:
            return True
        seen.add(x)
    return False`,
          live: true,
        },
        {
          type: "p",
          text: "**Alternative (dict counts):** count with .get and return any(v > 1 for v in counts.values()) — correct but heavier when you only need a boolean.",
        },
        {
          type: "compare",
          left: {
            label: "Bug: forget early return",
            code: `for x in values:
    if x in seen:
        found = True
    seen.add(x)
return found  # wrong if never set`,
            output: "Uninitialized found",
            tone: "bad",
          },
          right: {
            label: "Clear contract",
            code: `if x in seen:
    return True
seen.add(x)`,
            output: "Reader sees exit immediately",
            tone: "good",
          },
        },
      ],
    },
    {
      id: "dedupe-patterns",
      part: "Chapter 3 · Deduping",
      title: "Dedupe a list — order vs uniqueness",
      blocks: [
        {
          type: "p",
          text: "**set(lst)** gives unique items but **loses first-seen order** (and may reorder). For **stable dedupe** (keep first occurrence), use the **seen set + new list** pattern from data cleaning tickets.",
        },
        {
          type: "code",
          code: `def unique_preserve_order(items):
    seen = set()
    out = []
    for x in items:
        if x not in seen:
            seen.add(x)
            out.append(x)
    return out

print(unique_preserve_order([3, 1, 3, 2, 1]))`,
          live: true,
          output: "[3, 1, 2]",
        },
        {
          type: "code",
          code: `# order not guaranteed — fine for "how many distinct?"
ids = [10, 10, 20]
print(len(set(ids)))`,
          live: true,
          output: "2",
        },
        {
          type: "check",
          id: "c-dedupe",
          question: "You must keep first-seen order when removing duplicates. Best approach?",
          options: [
            "list(set(items))",
            "seen set + append to new list when x not in seen",
            "Sort items first",
            "Use a dict counting all items",
          ],
          answer: 1,
          explain: "set() dedupes but does not preserve order; the seen+out loop does.",
        },
      ],
    },
    {
      id: "case-set302",
      part: "Case study B · SpecPulse SET-302",
      title: "Ticket: unique_ids(event_rows)",
      blocks: [
        {
          type: "callout",
          tone: "exam",
          title: "SET-302 · unique_ids(rows)",
          text: "Input: list of dict rows, each with key \"user_id\" (string). Output: **sorted list** of distinct user_id values (ascending string order). Empty input → []. Do not modify rows.",
        },
        {
          type: "table",
          head: ["ID", "Rows (abbrev)", "Expected"],
          rows: [
            ["U1", "[]", "[]"],
            ["U2", '[{"user_id":"b"}]', '["b"]'],
            ["U3", "two rows same id b,b", '["b"]'],
            ["U4", "b then a", '["a","b"]'],
          ],
        },
        {
          type: "code",
          code: `def unique_ids(rows):
    ids = set()
    for row in rows:
        ids.add(row["user_id"])
    return sorted(ids)

rows = [{"user_id": "b"}, {"user_id": "a"}, {"user_id": "b"}]
print(unique_ids(rows))`,
          live: true,
          output: "['a', 'b']",
        },
        {
          type: "p",
          text: "**sorted(set(...))** is the standard way to make set results **testable** when the spec demands deterministic output.",
        },
      ],
    },
    {
      id: "set-algebra",
      part: "Chapter 4 · Comparing collections",
      title: "Union, intersection, difference",
      blocks: [
        {
          type: "p",
          text: "Treat sets like **Venn diagrams** for IDs, tags, or permissions. Python supports **operators** and **named methods** — both appear in codebases.",
        },
        {
          type: "table",
          head: ["Meaning", "Operator", "Method (s and t)"],
          rows: [
            ["All in either", "s | t", "s.union(t)"],
            ["In both", "s & t", "s.intersection(t)"],
            ["In s not in t", "s - t", "s.difference(t)"],
            ["In exactly one", "s ^ t", "s.symmetric_difference(t)"],
          ],
        },
        {
          type: "code",
          code: `a = {"python", "sql", "git"}
b = {"python", "docker", "git"}
print(sorted(a & b))
print(sorted(a - b))`,
          live: true,
          output: "['git', 'python']\n['sql']",
        },
        {
          type: "callout",
          tone: "tip",
          title: "SET-303 · shared_tags(a, b)",
          text: "Given two lists of tag strings, return **sorted** list of tags present in **both**. Implementation sketch: return sorted(set(a) & set(b)). Lists may contain duplicates — sets normalize that.",
        },
      ],
    },
    {
      id: "subset-superset",
      part: "Chapter 4 · Comparing collections",
      title: "Subset checks (permissions and validation)",
      blocks: [
        {
          type: "p",
          text: "**required.issubset(have)** answers “does this user have every required scope?” **have.issuperset(required)** is the same relationship reversed.",
        },
        {
          type: "code",
          code: `required = {"read", "write"}
granted = {"read", "write", "admin"}
print(required.issubset(granted))
print(required <= granted)
print({"delete"}.issubset(granted))`,
          live: true,
          output: "True\nTrue\nFalse",
        },
        {
          type: "check",
          id: "c-subset",
          question: "allowed = {\"GET\", \"POST\"}. request_methods = {\"GET\"}. Which is True?",
          options: [
            "request_methods.issuperset(allowed)",
            "request_methods.issubset(allowed)",
            "allowed & request_methods == allowed",
            "Both B and C",
          ],
          answer: 3,
          explain: "GET is contained in allowed; intersection equals the smaller set.",
        },
      ],
    },
    {
      id: "set-vs-dict-keys",
      part: "Chapter 5 · Relationships",
      title: "set(d) and when dict is enough",
      blocks: [
        {
          type: "p",
          text: "**set(some_dict)** returns the **keys** as a set. If you only need “which keys exist,” iterating **d** or **d.keys()** is enough — building a set copies keys for set algebra.",
        },
        {
          type: "code",
          code: `counts = {"404": 10, "500": 2}
codes_with_errors = set(counts)
print(codes_with_errors)
print("404" in counts)`,
          live: true,
        },
        {
          type: "p",
          text: "Lesson 2 **counts**; lesson 3 **membership among keys** without caring about values — e.g. “did we see this status code at all?” → **code in counts** (no set required).",
        },
      ],
    },
    {
      id: "hashable-elements",
      part: "Chapter 5 · Relationships",
      title: "Only hashable items inside a set",
      blocks: [
        {
          type: "p",
          text: "Same rule as dict keys: **lists and dicts cannot be set elements**. Use **tuple** of stable fields if you need a composite key in a set.",
        },
        {
          type: "code",
          code: `# valid
pairs = {(1, "a"), (2, "b")}
print(len(pairs))

# invalid — TypeError: unhashable type: 'list'
# bad = {[1, 2]}`,
          live: false,
        },
        {
          type: "check",
          id: "c-hash",
          question: "Which can be an element of a set?",
          options: ["[1, 2]", '{"a": 1}', "(1, 2)", "[[1]]"],
          answer: 2,
          explain: "Tuples of hashables are fine; list and dict are not.",
        },
      ],
    },
    {
      id: "unordered-output",
      part: "Chapter 6 · Production habits",
      title: "Unordered — tests and logs",
      blocks: [
        {
          type: "callout",
          tone: "warn",
          title: "Do not snapshot print(set) in golden files",
          text: "Two runs may print the same set in different orders. Assert with **==** on sets (order ignored) or **sorted(s)** when the API returns a list.",
        },
        {
          type: "code",
          code: `def test_unique():
    got = set([1, 2, 1])
    assert got == {1, 2}
    assert sorted(got) == [1, 2]`,
          live: false,
        },
        {
          type: "p",
          text: "For **SET-302**, the spec explicitly wants a **sorted list** — that is a product decision, not Python’s default set iteration order.",
        },
      ],
    },
    {
      id: "testing-sets",
      part: "Chapter 6 · Production habits",
      title: "Table-driven tests for set lessons",
      blocks: [
        {
          type: "code",
          code: `def has_duplicate(values):
    seen = set()
    for x in values:
        if x in seen:
            return True
        seen.add(x)
    return False

TESTS = [
    ([], False),
    ([1, 2, 1], True),
    ([1, 2, 3], False),
]

for values, expected in TESTS:
    got = has_duplicate(values)
    print(values, "OK" if got == expected else f"FAIL {got}")`,
          live: true,
        },
        {
          type: "list",
          ordered: true,
          items: [
            "Copy acceptance table from ticket → TESTS tuples",
            "Implement pure function — no input mutation",
            "Boolean and set equality use == directly",
            "List output with order → compare to sorted expected",
          ],
        },
      ],
    },
    {
      id: "review-set-bugs",
      part: "Chapter 7 · Code review",
      title: "Common set mistakes in PRs",
      blocks: [
        {
          type: "table",
          head: ["Smell", "Fix"],
          rows: [
            ["if x in my_list inside hot loop", "Promote my_list to set once"],
            ["Used {} for empty set", "set()"],
            ["Assumed set iteration order in UI", "Sort for display"],
            ["Added list to set", "Tuple or id string instead"],
            ["Mutated input list while deduping", "Build new list; leave input alone"],
          ],
        },
        {
          type: "check",
          id: "c-review",
          question: "PR uses seen = [] and if x in seen: ... seen.append(x). Review comment?",
          options: [
            "LGTM — lists support in",
            "Use set for seen — membership will not scale",
            "Must use dict not set",
            "Replace with sort only",
          ],
          answer: 1,
          explain: "Correct logic, wrong structure for large streams — set is the idiomatic seen structure.",
        },
      ],
    },
    {
      id: "capstone-bridge",
      part: "Chapter 7 · Code review",
      title: "What you ship today · preview Lesson 4",
      blocks: [
        {
          type: "p",
          text: "After SET-301/302 you can **guard pipelines** (dupes), **report distinct users**, and **compare tag sets**. Next lesson: **strings** — split, strip, join — because ids and tags almost always arrive as text first.",
        },
        {
          type: "flashcards",
          cards: [
            { q: "Empty set literal?", a: "set() — not {}" },
            { q: "has_duplicate core loop?", a: "if x in seen: return True; seen.add(x)" },
            { q: "Tags in both lists?", a: "sorted(set(a) & set(b))" },
            { q: "Safe remove if maybe missing?", a: "discard (not remove)" },
          ],
        },
      ],
    },
  ],

  examples: [
    {
      type: "trace",
      id: "ex-membership-trace",
      title: "Trace: membership cost story",
      intro: "Same answer, different structures — know what you are measuring.",
      code: `ALLOWED_LIST = ["IN", "US", "UK"] * 100
ALLOWED_SET = set(ALLOWED_LIST)

def in_list(code):
    return code in ALLOWED_LIST

def in_set(code):
    return code in ALLOWED_SET

print(in_list("UK"), in_set("UK"))`,
      steps: [
        {
          line: 10,
          output: "True True\n",
          note: "Both return True — set wins when ALLOWED grows and checks repeat in a loop.",
        },
      ],
    },
    {
      type: "trace",
      id: "ex-dup-trace",
      title: "Trace: SET-301 on [2, 1, 2]",
      intro: "Second 2 triggers True before loop ends.",
      code: `def has_duplicate(values):
    seen = set()
    for x in values:
        if x in seen:
            return True
        seen.add(x)
    return False

print(has_duplicate([2, 1, 2]))`,
      steps: [
        { line: 9, output: "True\n", note: "After 2 and 1 in seen, second 2 hits if x in seen." },
      ],
    },
    {
      type: "trace",
      id: "ex-intersection-trace",
      title: "Trace: shared tags",
      intro: "Lists with dupes → sets → intersection → sorted list.",
      code: `def shared_tags(a, b):
    return sorted(set(a) & set(b))

print(shared_tags(["py", "api", "py"], ["api", "sql"]))`,
      steps: [
        { line: 4, output: "['api']\n", note: "Only api in both; duplicates removed by set()." },
      ],
    },
    {
      type: "playground",
      id: "ex-set301",
      title: "Deliverable · SET-301 has_duplicate",
      intro: "Implement has_duplicate(values). Run matrix — all rows must print OK.",
      starter: `def has_duplicate(values):
    seen = set()
    for x in values:
        if x in seen:
            return True
        seen.add(x)
    return False

TESTS = [
    ([], False),
    ([1], False),
    ([1, 2, 3], False),
    ([1, 2, 1], True),
    (["a", "b", "a"], True),
]

for values, expected in TESTS:
    got = has_duplicate(values)
    print(values, "OK" if got == expected else f"FAIL got {got}")`,
      tryThis: ["Return True on first duplicate only — do not continue scanning unnecessarily", "Add [0, 0] row"],
      goal: {
        text: "All SET-301 tests print OK",
        check: (r) => {
          if (!r.ok || r.error) return false;
          const out = r.stdout ?? "";
          return !out.includes("FAIL") && (out.match(/OK/g)?.length ?? 0) >= 5;
        },
        success: "SET-301 ready — duplicate detection passes QA matrix.",
      },
    },
    {
      type: "playground",
      id: "ex-set302",
      title: "Deliverable · SET-302 unique_ids",
      intro: "Collect user_id into a set, return sorted list.",
      starter: `def unique_ids(rows):
    ids = set()
    for row in rows:
        ids.add(row["user_id"])
    return sorted(ids)

TESTS = [
    ([], []),
    ([{"user_id": "b"}], ["b"]),
    ([{"user_id": "b"}, {"user_id": "b"}], ["b"]),
    ([{"user_id": "b"}, {"user_id": "a"}], ["a", "b"]),
]

for rows, expected in TESTS:
    got = unique_ids(rows)
    print("OK" if got == expected else f"FAIL got {got}")`,
      tryThis: ["Add row with user_id aa and a — sort order?", "Break sorted() — see FAIL"],
      goal: {
        text: "All SET-302 tests OK",
        check: (r) => {
          if (!r.ok || r.error) return false;
          const out = r.stdout ?? "";
          return !out.includes("FAIL") && (out.match(/OK/g)?.length ?? 0) >= 4;
        },
        success: "Distinct ids with deterministic sorted output.",
      },
    },
    {
      type: "playground",
      id: "ex-set303",
      title: "Extension · SET-303 shared_tags",
      intro: "Return sorted intersection of two tag lists.",
      starter: `def shared_tags(a, b):
    return sorted(set(a) & set(b))

TESTS = [
    (["a", "b"], ["b", "c"], ["b"]),
    ([], ["x"], []),
    (["x", "x"], ["x"], ["x"]),
]

for a, b, expected in TESTS:
    got = shared_tags(a, b)
    print("OK" if got == expected else f"FAIL got {got}")`,
      tryThis: ["Try a= ['py','go'], b=['go','rs']", "Use | instead of & — watch tests fail"],
      goal: {
        text: "SET-303 shared_tags OK",
        check: (r) => {
          if (!r.ok || r.error) return false;
          return (r.stdout ?? "").includes("OK") && !(r.stdout ?? "").includes("FAIL");
        },
        success: "Set algebra wired for tag overlap reports.",
      },
    },
  ],

  practice: [
    {
      id: "q1",
      type: "mcq",
      skill: "Concept",
      level: "easy",
      prompt: "What does set([1, 2, 2, 3]) evaluate to?",
      options: ["[1, 2, 3]", "{1, 2, 3}", "{1, 2, 2, 3}", "Error always"],
      answer: 1,
      explain: "Constructor dedupes — one copy of each value.",
    },
    {
      id: "q2",
      type: "mcq",
      skill: "Syntax",
      level: "easy",
      prompt: "Which creates an empty set assigned to s?",
      options: ["s = {}", "s = set()", "s = []", "s = {}"],
      answer: 1,
      explain: "{} is a dict; set() is empty set.",
    },
    {
      id: "q3",
      type: "mcq",
      skill: "Membership",
      level: "medium",
      prompt: "After: seen = set(); seen.add(1); seen.add(1) — len(seen) is?",
      options: ["0", "1", "2", "Error"],
      answer: 1,
      explain: "Second add is a no-op — still one element.",
    },
    {
      id: "q4",
      type: "fill",
      skill: "SET-301",
      level: "medium",
      prompt: "Complete the duplicate check line inside the loop.",
      code: `if x in ___:
    return True
seen.add(x)`,
      answers: ["seen"],
      mode: "code",
      explain: "Membership in seen means we already encountered x.",
    },
    {
      id: "q5",
      type: "order",
      skill: "Workflow",
      level: "easy",
      prompt: "Order steps to ship SET-301.",
      lines: [
        "Run boolean matrix on sample lists",
        "Read acceptance table on ticket",
        "Implement has_duplicate with seen set",
        "Open PR with pure function only",
      ],
      explain: "Spec → implement → test → review — same SDLC as LOG-201.",
    },
    {
      id: "q6",
      type: "write",
      skill: "SET-301",
      level: "medium",
      prompt: "Implement has_duplicate(values) — True if any value appears twice.",
      starter: `def has_duplicate(values):
    pass

print(has_duplicate([1, 2, 1]) == True)
print(has_duplicate([1, 2, 3]) == False)`,
      hint: "seen = set(), if x in seen return True, else add",
      solution: `def has_duplicate(values):
    seen = set()
    for x in values:
        if x in seen:
            return True
        seen.add(x)
    return False`,
      check: (r) => {
        if (!r.ok) return r.error || "Error";
        const out = r.stdout ?? "";
        if (!out.includes("True")) return "First line should print True";
        if (!out.trim().endsWith("False") && !out.includes("\nFalse")) return "Second line should print False";
        return null;
      },
    },
    {
      id: "q7",
      type: "write",
      skill: "SET-302",
      level: "medium",
      prompt: "Implement unique_ids(rows) — sorted distinct user_id strings.",
      starter: `def unique_ids(rows):
    pass

rows = [{"user_id": "b"}, {"user_id": "a"}, {"user_id": "b"}]
print(unique_ids(rows) == ["a", "b"])`,
      hint: "set of ids, then sorted(...)",
      solution: `def unique_ids(rows):
    ids = set()
    for row in rows:
        ids.add(row["user_id"])
    return sorted(ids)`,
      check: (r) => {
        if (!r.ok) return r.error || "Error";
        if (!(r.stdout ?? "").includes("True")) return "Expected True";
        return null;
      },
    },
    {
      id: "q8",
      type: "mcq",
      skill: "Algebra",
      level: "medium",
      prompt: "a = {1, 2}, b = {2, 3}. What is a & b?",
      options: ["{1, 2, 3}", "{2}", "{1, 3}", "{1, 2, 2, 3}"],
      answer: 1,
      explain: "& is intersection — only 2 is in both.",
    },
    {
      id: "q9",
      type: "write",
      skill: "Dedupe",
      level: "hard",
      prompt: "Implement unique_preserve_order(items) — first occurrence kept, no duplicates later.",
      starter: `def unique_preserve_order(items):
    pass

print(unique_preserve_order([3, 1, 3, 2, 1]) == [3, 1, 2])`,
      hint: "seen set + out list; append only when x not in seen",
      solution: `def unique_preserve_order(items):
    seen = set()
    out = []
    for x in items:
        if x not in seen:
            seen.add(x)
            out.append(x)
    return out`,
      challenge: true,
      check: (r) => {
        if (!r.ok) return r.error || "Error";
        if (!(r.stdout ?? "").includes("True")) return "Fix unique_preserve_order";
        return null;
      },
    },
    {
      id: "q10",
      type: "mcq",
      skill: "discard vs remove",
      level: "easy",
      prompt: "s = {1}. Which line will NOT raise if 2 is not in s?",
      options: ["s.remove(2)", "s.discard(2)", "del s[2]", "s.pop(2)"],
      answer: 1,
      explain: "discard ignores missing elements; remove raises KeyError.",
    },
    {
      id: "q11",
      type: "mcq",
      skill: "Testing",
      level: "medium",
      prompt: "unique_ids returns a list. Best assertion against [\"a\", \"b\"]?",
      options: [
        "assert len(got) == 2 only",
        "assert got == [\"a\", \"b\"]",
        "assert \"a\" in got",
        "print(got[0])",
      ],
      answer: 1,
      explain: "Full list equality checks order and extras — matches SET-302 spec.",
    },
  ],
};
