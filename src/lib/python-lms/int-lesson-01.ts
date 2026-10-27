import type { PythonLmsLesson } from "@/lib/python-lms/types";

export const INT_LESSON_01: PythonLmsLesson = {
  slug: "int-01",
  number: 1,
  title: "How developers solve problems",
  subtitle: "From ticket to tested code — specs, cases, and reviews",
  minutes: 90,
  course: "intermediate",
  goals: [
    "Read a work ticket and extract inputs, outputs, and rules",
    "Translate English requirements into boolean conditions and return values",
    "Choose >= vs > and <= vs < at boundaries without off-by-one bugs",
    "Write acceptance criteria and a test matrix before coding",
    "Structure decisions with if / elif / else and early return",
    "Decompose tickets into pure functions plus a test runner",
    "Run table-driven self-tests the way reviewers expect",
    "Read tracebacks and fix logic vs typo failures",
    "Document assumptions in docstrings and PR checklists",
    "Apply the same workflow to a second ticket (grading / tiers)",
  ],
  canDo:
    "Given a one-page spec, produce acceptance criteria, a test table, a working Python function, and a short self-review note — the same artifact bundle junior devs submit on real tickets.",

  notes: [
    {
      id: "intermediate-mindset",
      part: "Chapter 1 · Professional baseline",
      title: "Intermediate is not “harder syntax”",
      blocks: [
        {
          type: "lead",
          text: "Beginner Python teaches **what the language does**. Intermediate teaches **how professionals turn vague requests into software other people can rely on**.",
        },
        {
          type: "p",
          text: "In internships and first jobs you rarely hear “write a for-loop.” You hear: *“Users say the fever alert is wrong on the dashboard — fix it by Friday.”* Your job is to translate that into **clear behaviour**, **tests**, and **code**.",
        },
        {
          type: "compare",
          left: {
            label: "Beginner habit",
            code: `# open editor\n# start typing\n# hope it works`,
            output: "Works on your laptop once.",
            tone: "bad",
          },
          right: {
            label: "Intermediate habit",
            code: `# read ticket\n# list examples + edge cases\n# write tests\n# then implement`,
            output: "Reviewable, repeatable, shippable.",
            tone: "good",
          },
        },
        {
          type: "callout",
          tone: "fact",
          title: "What you will build today",
          text: "A **temperature classification module** from a realistic product ticket — plus the **test table** and **review checklist** you would attach in Jira or GitHub.",
        },
      ],
    },
    {
      id: "ticket-anatomy",
      part: "Chapter 1 · Professional baseline",
      title: "Anatomy of a work ticket",
      blocks: [
        {
          type: "p",
          text: "Tickets (Jira, Linear, GitHub Issues) usually contain the same fields. Learn to scan them in this order:",
        },
        {
          type: "table",
          head: ["Field", "What to extract", "Example"],
          rows: [
            ["Summary", "One-line feature or bug", "Classify body temperature readings"],
            ["Description", "Rules in plain English", "Return fever / normal / too cold"],
            ["Acceptance criteria", "Testable bullets", "38°C → fever"],
            ["Out of scope", "What NOT to build", "No UI, no database"],
            ["Definition of done", "Proof required", "Unit tests pass, docstring added"],
          ],
        },
        {
          type: "check",
          id: "c-ticket",
          question: "Which part of a ticket should you turn into automated checks first?",
          options: [
            "The assignee’s name",
            "Acceptance criteria",
            "The sprint velocity chart",
            "The company logo",
          ],
          answer: 1,
          explain: "Acceptance criteria are written to be **tested**. They become your test matrix.",
        },
      ],
    },
    {
      id: "sdlc-context",
      part: "Chapter 1 · Professional baseline",
      title: "Where your code lives in the SDLC",
      blocks: [
        {
          type: "p",
          text: "**SDLC** (software development life cycle) is the path from idea to users. As a junior dev you touch the middle — but you should know the whole line:",
        },
        {
          type: "flow",
          title: "Typical product flow",
          steps: [
            { kind: "io", text: "Product writes spec + acceptance criteria" },
            { kind: "process", text: "Engineering estimates, breaks into tickets" },
            { kind: "terminal", text: "You implement + self-test locally" },
            { kind: "process", text: "Pull request → code review → CI runs tests" },
            { kind: "io", text: "QA verifies matrix → release to users" },
          ],
        },
        {
          type: "p",
          text: "This lesson trains steps **spec → matrix → implement → self-test** because that is what blocks or unblocks your PR in review.",
        },
        {
          type: "table",
          head: ["Role", "What they care about"],
          rows: [
            ["Product", "Correct rules, no scope creep"],
            ["QA", "Every acceptance row passes"],
            ["Senior dev", "Readable, testable, no hidden side effects"],
            ["You", "Clear proof the ticket is done"],
          ],
        },
      ],
    },
    {
      id: "english-to-logic",
      part: "Chapter 2 · Logic from requirements",
      title: "Turn English rules into Python conditions",
      blocks: [
        {
          type: "p",
          text: "Specs use words like **at least**, **at most**, **under**, **on or above**. Map them to operators before typing:",
        },
        {
          type: "table",
          head: ["Spec phrase", "Python", "Example"],
          rows: [
            ["at least 38", "celsius >= 38", "38.0 qualifies"],
            ["greater than 38", "celsius > 38", "38.0 does NOT qualify"],
            ["at most 35", "celsius <= 35", "35.0 qualifies"],
            ["below 35", "celsius < 35", "35.0 does NOT qualify"],
            ["between 35 and 38 exclusive", "35 < c < 38", "Endpoints excluded"],
          ],
        },
        {
          type: "callout",
          tone: "warn",
          title: "VTL-142 uses inclusive bounds",
          text: "“≥ 38” and “≤ 35” mean **38.0 is fever** and **35.0 is too cold**. PMs will test those exact numbers.",
        },
        {
          type: "check",
          id: "c-english",
          question: "Spec says “score must be 40 or higher to pass.” Which test is correct?",
          options: ["score > 40", "score >= 40", "score == 40", "score <= 40"],
          answer: 1,
          explain: "**Or higher** includes 40 → use >= 40.",
        },
      ],
    },
    {
      id: "operators-reference",
      part: "Chapter 2 · Logic from requirements",
      title: "Comparison operators (refresher)",
      blocks: [
        {
          type: "p",
          text: "Intermediate work still uses beginner operators — but **boundary choice** is what interviews and QA test:",
        },
        {
          type: "table",
          head: ["Operator", "Meaning", "True example"],
          rows: [
            ["==", "equal", "3 == 3"],
            ["!=", "not equal", "3 != 4"],
            [">", "greater", "5 > 2"],
            ["<", "less", "2 < 5"],
            [">=", "greater or equal", "5 >= 5"],
            ["<=", "less or equal", "4 <= 4"],
          ],
        },
        {
          type: "code",
          code: `a = 38
print(a > 38)   # False — 38 is not *greater* than 38
print(a >= 38)  # True  — 38 counts as "at least 38"`,
          live: true,
        },
        {
          type: "check",
          id: "c-op",
          question: "Which expression is True when celsius is exactly 35.0?",
          options: ["celsius < 35", "celsius <= 35", "celsius > 35", "celsius == 36"],
          answer: 1,
          explain: "Only <= 35 includes 35.0.",
        },
      ],
    },
    {
      id: "if-anatomy",
      part: "Chapter 2 · Logic from requirements",
      title: "Anatomy of the VTL-142 decision chain",
      blocks: [
        {
          type: "p",
          text: "Two separate `if` statements with **return** act like **if / elif / else** because only one return runs:",
        },
        {
          type: "anatomy",
          code: "if celsius >= 38:",
          parts: [
            { token: "if", label: "Start decision — evaluate condition first." },
            { token: "celsius >= 38", label: "Boolean expression — True or False only." },
            { token: ":", label: "Colon + indented body required." },
          ],
        },
        {
          type: "code",
          code: `def classify_temp(celsius):
    if celsius >= 38:
        return "fever"
    if celsius <= 35:
        return "too cold"
    return "normal"  # only reached if neither branch matched`,
          live: true,
        },
        {
          type: "p",
          text: "Equivalent **elif** form (same behaviour for this spec):",
        },
        {
          type: "code",
          code: `def classify_temp(celsius):
    if celsius >= 38:
        return "fever"
    elif celsius <= 35:
        return "too cold"
    else:
        return "normal"`,
        },
        {
          type: "callout",
          tone: "tip",
          text: "Early **return** keeps nesting flat — reviewers prefer this over deep pyramids.",
        },
      ],
    },
    {
      id: "elif-order-trap",
      part: "Chapter 2 · Logic from requirements",
      title: "Case study C · Wrong branch order (ELIF-01)",
      blocks: [
        {
          type: "p",
          text: "Shipping tiers ticket **ELIF-01**: free under ₹500, ₹49 fee up to ₹2000, ₹99 above. A dev wrote:",
        },
        {
          type: "code",
          code: `def shipping_fee(amount):
    if amount < 500:
        return 0
    if amount < 2000:   # catches EVERYTHING under 2000, including 100
        return 49
    return 99`,
          live: true,
        },
        {
          type: "p",
          text: "That code is actually **correct** here because ranges don’t overlap. The trap appears when ranges **do** overlap — use **elif** so only the **first true** branch runs:",
        },
        {
          type: "compare",
          left: {
            label: "Overlapping ifs (bug)",
            code: `if score >= 90: grade = "A"
if score >= 80: grade = "B"  # overwrites A!`,
            output: "score 95 → B (wrong)",
            tone: "bad",
          },
          right: {
            label: "elif chain (fixed)",
            code: `if score >= 90: grade = "A"
elif score >= 80: grade = "B"`,
            output: "score 95 → A",
            tone: "good",
          },
        },
        {
          type: "check",
          id: "c-elif",
          question: "score is 95. Why does the two-if version return B?",
          options: [
            "Python skips the first if",
            "Both conditions run; the second assignment wins",
            "95 is not >= 90",
            "Strings cannot be assigned twice",
          ],
          answer: 1,
          explain: "Both `if` bodies can run in sequence — the last assignment wins. Use elif for tiers.",
        },
      ],
    },
    {
      id: "case-study-spec",
      part: "Case study A · VitalTrack dashboard",
      title: "Product spec (as written by a PM)",
      blocks: [
        {
          type: "p",
          text: "**VitalTrack** is a clinic dashboard. Nurses paste a Celsius reading; the backend must label it for colour-coding. You receive this spec:",
        },
        {
          type: "callout",
          tone: "exam",
          title: "Ticket VTL-142 · Classify temperature",
          text: "Implement `classify_temp(celsius: float) -> str`. Return exactly one of: `\"fever\"`, `\"normal\"`, `\"too cold\"`. Rules: **fever** if celsius ≥ 38.0. **too cold** if celsius ≤ 35.0. Otherwise **normal**. Do not round inputs. Invalid types are out of scope (caller guarantees float).",
        },
        {
          type: "list",
          ordered: true,
          items: [
            "Underline **inputs** (one float) and **outputs** (one of three strings).",
            "Mark **boundaries**: 38.0 and 35.0 are inclusive on the fever / cold side.",
            "List **examples** PM already implied: 36.8 → normal, 39 → fever, 34 → too cold.",
            "Add **edge cases** PM forgot: exactly 38.0, exactly 35.0, negative (if ever possible).",
          ],
        },
        {
          type: "table",
          head: ["Input (°C)", "Expected label", "Why it matters"],
          rows: [
            ["36.8", "normal", "Typical reading"],
            ["39.0", "fever", "Clear fever"],
            ["34.0", "too cold", "Hypothermia band"],
            ["38.0", "fever", "Boundary — inclusive ≥ 38"],
            ["35.0", "too cold", "Boundary — inclusive ≤ 35"],
            ["35.1", "normal", "Just above cold threshold"],
          ],
        },
        {
          type: "p",
          text: "**User story (for context):** Nurse Priya pastes 37.2 → dashboard shows green “normal”. Paste 38.0 → red “fever” banner. Paste 34.8 → blue “too cold”. Your function is the **single source of truth** for those colours.",
        },
        {
          type: "flow",
          title: "Priya’s shift (what you are really building)",
          steps: [
            { kind: "io", text: "Thermometer → number in °C" },
            { kind: "process", text: "API calls classify_temp(c)" },
            { kind: "decision", text: "Label selects UI colour + alert sound" },
            { kind: "terminal", text: "Wrong label → wrong clinical urgency (bug)" },
          ],
        },
      ],
    },
    {
      id: "acceptance-matrix",
      part: "Chapter 2 · Test before code",
      title: "Acceptance matrix (your contract with QA)",
      blocks: [
        {
          type: "p",
          text: "Before implementation, copy acceptance criteria into a **test matrix**. QA will literally tick these rows:",
        },
        {
          type: "code",
          filename: "test_plan.md",
          code: `| ID  | Input | Expected     |
|-----|-------|--------------|
| T1  | 36.8  | normal       |
| T2  | 39    | fever        |
| T3  | 34    | too cold     |
| T4  | 38    | fever        |
| T5  | 35    | too cold     |
| T6  | 35.1  | normal       |`,
          shell: false,
        },
        {
          type: "p",
          text: "In Python you will automate this with a list of `(input, expected)` pairs and a loop — the same pattern used in pytest parametrize and CI pipelines.",
        },
        {
          type: "check",
          id: "c-matrix",
          question: "Why include boundary rows T4 and T5 when T2 and T3 already feel similar?",
          options: [
            "To slow down development",
            "Because ≥ and ≤ bugs only show on exact boundaries",
            "Because Python requires six tests",
            "To increase line count",
          ],
          answer: 1,
          explain: "Off-by-one on **38.0** or **35.0** is a classic review comment. Boundaries deserve their own rows.",
        },
      ],
    },
    {
      id: "case-study-bug",
      part: "Case study B · QA regression report",
      title: "When “it works on my machine” fails review",
      blocks: [
        {
          type: "p",
          text: "A junior dev shipped this version. It passes the happy path but fails QA:",
        },
        {
          type: "code",
          code: `def classify_temp(c):
    if c > 38:      # bug: should be >=
        return "fever"
    if c < 35:      # bug: should be <=
        return "too cold"
    return "normal"`,
          live: true,
        },
        {
          type: "table",
          head: ["Test", "Expected", "Actual with buggy code"],
          rows: [
            ["38.0", "fever", "normal — silent failure"],
            ["35.0", "too cold", "normal — silent failure"],
          ],
        },
        {
          type: "callout",
          tone: "warn",
          title: "Lesson",
          text: "Without a **written test matrix**, boundary bugs reach users. The intermediate skill is making failures **visible before merge**.",
        },
        {
          type: "code",
          code: `def classify_temp(celsius):
    """Return 'fever', 'normal', or 'too cold' for body temp in °C (VTL-142)."""
    if celsius >= 38:
        return "fever"
    if celsius <= 35:
        return "too cold"
    return "normal"`,
          live: true,
        },
        {
          type: "p",
          text: "Walkthrough **one row** (T4: input 38): Python enters `classify_temp(38)`, evaluates `38 >= 38` → True, returns `\"fever\"` immediately — the `<= 35` test never runs. That short-circuit is why order matters when you use **elif** for overlapping rules.",
        },
      ],
    },
    {
      id: "case-study-grd",
      part: "Case study D · Exam board GRD-08",
      title: "Second ticket — same workflow, new spec",
      blocks: [
        {
          type: "callout",
          tone: "fact",
          title: "Ticket GRD-08 · Pass / fail",
          text: "`grade(score)` returns `\"pass\"` if score >= 40 else `\"fail\"`. Integers only. Used by report generator — must stay pure.",
        },
        {
          type: "table",
          head: ["ID", "Input", "Expected"],
          rows: [
            ["G1", "40", "pass (boundary)"],
            ["G2", "39", "fail"],
            ["G3", "100", "pass"],
            ["G4", "0", "fail"],
          ],
        },
        {
          type: "code",
          code: `def grade(score):
    """GRD-08: pass if score >= 40 else fail."""
    if score >= 40:
        return "pass"
    return "fail"`,
          live: true,
        },
        {
          type: "p",
          text: "Notice the **same skeleton** as VTL-142: one threshold, two outcomes, matrix before merge. Senior devs reuse patterns, not rewrite from scratch.",
        },
      ],
    },
    {
      id: "decomposition",
      part: "Chapter 3 · Structure",
      title: "One function, one responsibility",
      blocks: [
        {
          type: "p",
          text: "For VTL-142, one function is enough. On larger tickets you split work:",
        },
        {
          type: "table",
          head: ["Function", "Responsibility"],
          rows: [
            ["parse_reading(raw)", "Turn string from device into float or error"],
            ["classify_temp(c)", "Pure logic — no print, no input()"],
            ["format_alert(label)", "Human-readable message for UI"],
            ["run_self_tests()", "Loop matrix; return pass/fail count"],
          ],
        },
        {
          type: "terms",
          items: [
            { term: "Pure function", meaning: "Same input → same output; no hidden I/O." },
            { term: "Regression", meaning: "Old behaviour breaks after a new change." },
            { term: "Happy path", meaning: "Typical input the PM demoed." },
            { term: "Edge case", meaning: "Boundary or unusual input that breaks naive code." },
          ],
        },
      ],
    },
    {
      id: "table-driven-tests",
      part: "Chapter 3 · Structure",
      title: "Table-driven self-tests (industry pattern)",
      blocks: [
        {
          type: "p",
          text: "Teams run this locally before opening a pull request. No framework required yet — just honesty:",
        },
        {
          type: "code",
          filename: "vitaltrack_temp.py",
          code: `def classify_temp(celsius):
    if celsius >= 38:
        return "fever"
    if celsius <= 35:
        return "too cold"
    return "normal"

TESTS = [
    (36.8, "normal"),
    (39, "fever"),
    (34, "too cold"),
    (38, "fever"),
    (35, "too cold"),
    (35.1, "normal"),
]

def run_tests():
    failed = 0
    for temp, expected in TESTS:
        got = classify_temp(temp)
        ok = got == expected
        print(f"T {temp} -> {got} {'OK' if ok else 'FAIL expected ' + expected}")
        if not ok:
            failed += 1
    return failed

if __name__ == "__main__":
    exit(run_tests())`,
          live: true,
        },
        {
          type: "callout",
          tone: "tip",
          text: "Printing **OK/FAIL** per row is how you learn before pytest. In review, reviewers ask: *“What happens if I run your self-test?”*",
        },
      ],
    },
    {
      id: "module-main",
      part: "Chapter 3 · Structure",
      title: 'Files, imports, and if __name__ == "__main__"',
      blocks: [
        {
          type: "p",
          text: "Real modules separate **library code** (importable functions) from **script code** (run when file executed directly):",
        },
        {
          type: "code",
          filename: "vitaltrack_temp.py",
          code: `def classify_temp(celsius):
    ...

def run_tests():
    ...

if __name__ == "__main__":
    failed = run_tests()
    raise SystemExit(failed)`,
        },
        {
          type: "p",
          text: "Reviewers run `python vitaltrack_temp.py` — exit code **0** means green matrix. Non-zero means “do not merge.”",
        },
        {
          type: "list",
          items: [
            "**Import** — other files can from vitaltrack_temp import classify_temp without running tests.",
            "**__main__** — tests run only when you execute this file as the program entry.",
          ],
        },
      ],
    },
    {
      id: "docstrings-comments",
      part: "Chapter 3 · Structure",
      title: "Document what the ticket promised",
      blocks: [
        {
          type: "p",
          text: "Comments explain **why**. Docstrings summarize **what** the function guarantees (contract):",
        },
        {
          type: "code",
          code: `def classify_temp(celsius: float) -> str:
    """VTL-142 body-temperature label.

    Args:
        celsius: Reading in degrees Celsius (caller validates type).

    Returns:
        One of "fever", "normal", "too cold".
    """
    ...`,
        },
        {
          type: "callout",
          tone: "exam",
          text: "In interviews: “How do you know you built the right thing?” → point to **acceptance matrix + docstring quoting the spec**.",
        },
      ],
    },
    {
      id: "debug-professional",
      part: "Chapter 4 · Debug like a teammate",
      title: "Tracebacks are documentation",
      blocks: [
        {
          type: "flow",
          title: "When a test fails or Python crashes",
          steps: [
            { kind: "terminal", text: "Run the file — read the last frame in *your* module" },
            { kind: "process", text: "Compare actual vs expected on the failing matrix row" },
            { kind: "decision", text: "Logic bug (>= vs >) or typo (string mismatch)?" },
            { kind: "io", text: "Fix one issue; re-run full matrix — no partial retests" },
          ],
        },
        {
          type: "check",
          id: "c-trace",
          question: "Test T4 fails: input 38 returns 'normal'. What is the most likely fix?",
          options: [
            "Change 38 to 37 in the test",
            "Use >= instead of > in the fever branch",
            "Delete the test",
            "Add more print statements only",
          ],
          answer: 1,
          explain: "38.0 must map to fever per spec — the comparison operator was wrong.",
        },
      ],
    },
    {
      id: "traceback-lab",
      part: "Chapter 4 · Debug like a teammate",
      title: "Read a traceback like a senior dev",
      blocks: [
        {
          type: "p",
          text: "When code **crashes** (not just wrong output), Python prints a **traceback**. Read from the **bottom** — last line in *your* file is the immediate cause:",
        },
        {
          type: "code",
          shell: true,
          code: `Traceback (most recent call last):
  File "vitaltrack_temp.py", line 24, in <module>
    run_tests()
  File "vitaltrack_temp.py", line 19, in run_tests
    got = classify_temp(temp)
  File "vitaltrack_temp.py", line 8, in classify_temp
    if celsius >= "38":
       ^^^^^^^^^^^^^^^^
TypeError: '>=' not supported between instances of 'float' and 'str'`,
        },
        {
          type: "p",
          text: "Here the bug is **type error** — compared float to string because someone edited the threshold wrong. Logic failures (wrong label) **don’t** traceback; your matrix catches them with FAIL.",
        },
        {
          type: "table",
          head: ["Failure kind", "Symptom", "Tool"],
          rows: [
            ["Logic bug", "FAIL in matrix", "Compare expected vs got"],
            ["TypeError", "Traceback", "Fix types / operands"],
            ["IndentationError", "Won’t run", "Fix spaces under if"],
            ["Return typo", "FAIL string mismatch", "Match spec spelling exactly"],
          ],
        },
      ],
    },
    {
      id: "code-review-sim",
      part: "Chapter 5 · Ship it",
      title: "Code review simulation",
      blocks: [
        {
          type: "p",
          text: "Fake PR comments on VTL-142 — how you respond:",
        },
        {
          type: "table",
          head: ["Reviewer comment", "Professional response"],
          rows: [
            ["“38 fails in QA”", "Fixed >= 38; added T4 to matrix."],
            ["“Why print in classify?”", "Moved prints to run_tests(); classify is pure."],
            ["“Where is the spec?”", "Docstring cites VTL-142 thresholds."],
            ["“Missing test for 35.0”", "Added T5 boundary row."],
          ],
        },
        {
          type: "compare",
          left: {
            label: "Weak PR description",
            code: "fixed bug",
            output: "Reviewer must guess scope",
            tone: "bad",
          },
          right: {
            label: "Strong PR description",
            code: "VTL-142: classify_temp\n- Matrix T1–T6\n- exit 0",
            output: "Reviewer runs one command",
            tone: "good",
          },
        },
      ],
    },
    {
      id: "anti-patterns",
      part: "Chapter 5 · Ship it",
      title: "Anti-patterns that fail internships",
      blocks: [
        {
          type: "list",
          ordered: false,
          items: [
            "**Magic numbers** without comment tying to spec (38, 35 must reference ticket).",
            "**Copy-paste** tests without a table — rows get out of sync with criteria.",
            "**Silent fixes** — changing the test to match wrong code instead of fixing code.",
            "**Scope creep** — adding UI, database, or input() when ticket says pure function.",
            "**No proof** — “works for me” without pasted matrix output in PR.",
          ],
        },
        {
          type: "check",
          id: "c-anti",
          question: "QA fails T5 (35.0). Worst response?",
          options: [
            "Fix <= comparison and re-run matrix",
            "Change T5 expected value to normal",
            "Add comment citing VTL-142",
            "Post matrix screenshot in PR",
          ],
          answer: 1,
          explain: "Never weaken tests to match wrong code — that ships the bug to patients/users.",
        },
      ],
    },
    {
      id: "future-scope",
      part: "Chapter 5 · Ship it",
      title: "Out of scope vs next ticket",
      blocks: [
        {
          type: "p",
          text: "VTL-142 says invalid types are **out of scope**. Professionals still note follow-ups:",
        },
        {
          type: "list",
          items: [
            "**VTL-143** (future): reject negative readings with ValueError.",
            "**VTL-144** (future): accept optional sensor calibration offset.",
            "**VTL-145** (future): log labels for audit trail.",
          ],
        },
        {
          type: "callout",
          tone: "tip",
          text: "In standup: “142 done with matrix; suggest 143 for negative temps.” That shows product thinking.",
        },
      ],
    },
    {
      id: "review-checklist",
      part: "Chapter 5 · Ship it",
      title: "Definition of done (self-review)",
      blocks: [
        {
          type: "p",
          text: "Before you mark VTL-142 complete, attach this checklist in your PR description or internship log:",
        },
        {
          type: "list",
          ordered: true,
          items: [
            "Spec rules quoted in docstring or comment",
            "Test matrix covers all acceptance criteria + boundaries",
            "run_tests() exits 0 (zero failures)",
            "No stray print in classify_temp (logic stays pure)",
            "One sentence: *What I would add next* (e.g. validate negative temps)",
          ],
        },
        {
          type: "flashcards",
          cards: [
            { q: "What is acceptance criteria?", a: "Testable bullets that define done for a ticket." },
            { q: "Why test boundaries?", a: "Off-by-one on >= / <= is the most common logic bug." },
            { q: "What is a pure function?", a: "Output depends only on inputs; no side effects." },
            { q: "Definition of done?", a: "Matrix green, docstring cites spec, exit code 0." },
            { q: ">= vs > at 38?", a: ">= includes 38.0; > excludes it." },
            { q: "Why elif for grades?", a: "Stops lower tiers from overwriting higher ones." },
          ],
        },
        {
          type: "table",
          head: ["Interview prompt", "Strong answer shape"],
          rows: [
            ["How do you approach a new ticket?", "Read AC → matrix → pure fn → self-test"],
            ["Find the bug without running code", "Walk boundaries 38.0 and 35.0"],
            ["What is regression?", "Old tests fail after your change"],
          ],
        },
        {
          type: "callout",
          tone: "exam",
          title: "Capstone for this lesson",
          text: "In **Examples**, you will implement the matrix and make every row print **OK**. That single artifact proves you learned the workflow — not just the if-statements.",
        },
      ],
    },
  ],

  examples: [
    {
      type: "trace",
      id: "ex-boundary",
      title: "Trace: why 38.0 is fever",
      intro: "Step through the corrected function for a boundary input PMs always ask about.",
      code: `def classify_temp(celsius):
    if celsius >= 38:
        return "fever"
    if celsius <= 35:
        return "too cold"
    return "normal"

print(classify_temp(38.0))`,
      steps: [
        {
          line: 7,
          output: "fever\n",
          note: "38.0 satisfies celsius >= 38 — fever branch runs; later branches are skipped.",
        },
      ],
    },
    {
      type: "trace",
      id: "ex-regression",
      title: "Trace: buggy vs fixed at 35.0",
      intro: "See how `<` instead of `<=` mis-labels a hypothermia boundary.",
      code: `def buggy(c):
    if c > 38:
        return "fever"
    if c < 35:
        return "too cold"
    return "normal"

print("buggy(35):", buggy(35))`,
      steps: [
        {
          line: 9,
          output: "buggy(35): normal\n",
          note: "35 is not < 35, so both conditions fail — wrong label. Spec requires too cold.",
        },
      ],
    },
    {
      type: "trace",
      id: "ex-three-readings",
      title: "Trace: three nurse readings in one run",
      intro: "Follow each call — three separate invocations, three labels.",
      code: `def classify_temp(celsius):
    if celsius >= 38:
        return "fever"
    if celsius <= 35:
        return "too cold"
    return "normal"

for reading in [36.8, 39, 34]:
    print(reading, classify_temp(reading))`,
      steps: [
        { line: 10, output: "36.8 normal\n", note: "First loop: neither threshold — normal." },
        { line: 10, output: "39 fever\n", note: "Second: >= 38 fires." },
        { line: 10, output: "34 too cold\n", note: "Third: <= 35 fires." },
      ],
    },
    {
      type: "trace",
      id: "ex-grade-tier",
      title: "Trace: elif grade tiers",
      intro: "See why elif stops after the first matching band.",
      code: `def letter(score):
    if score >= 90:
        return "A"
    elif score >= 80:
        return "B"
    elif score >= 70:
        return "C"
    return "F"

print(letter(95))
print(letter(82))`,
      steps: [
        { line: 11, output: "A\n", note: "95 >= 90 — first branch only." },
        { line: 12, output: "B\n", note: "82 fails 90 but passes 80." },
      ],
    },
    {
      type: "playground",
      id: "ex-vtl142",
      title: "Case study deliverable · VTL-142",
      intro: "Implement classify_temp and run the full acceptance matrix. Every line must end with OK.",
      starter: `def classify_temp(celsius):
    """VTL-142: fever if >= 38, too cold if <= 35, else normal."""
    if celsius >= 38:
        return "fever"
    if celsius <= 35:
        return "too cold"
    return "normal"

TESTS = [
    (36.8, "normal"),
    (39, "fever"),
    (34, "too cold"),
    (38, "fever"),
    (35, "too cold"),
    (35.1, "normal"),
]

for temp, expected in TESTS:
    got = classify_temp(temp)
    status = "OK" if got == expected else f"FAIL want {expected}"
    print(f"{temp} -> {got} {status}")`,
      tryThis: [
        "Break the >= on purpose once — watch which row prints FAIL",
        "Add docstring text from the ticket",
        "Add a seventh test (37.9 → normal) and run again",
      ],
      goal: {
        text: "All six acceptance rows print OK",
        check: (r) => {
          if (!r.ok || r.error) return false;
          const out = r.stdout ?? "";
          const lines = out.trim().split("\n").filter(Boolean);
          if (lines.length < 6) return false;
          return lines.every((line) => line.includes("OK")) && !out.includes("FAIL");
        },
        success: "Matrix green — this is what you would demo in standup.",
      },
    },
    {
      type: "playground",
      id: "ex-grade-extension",
      title: "Extension · Grading ticket GRD-08",
      intro: "Same workflow, new ticket: pass if score ≥ 40. Write tests first, then logic.",
      starter: `def grade(score):
    """GRD-08: return 'pass' if score >= 40 else 'fail'."""
    # implement

TESTS = [(40, "pass"), (39, "fail"), (100, "pass"), (0, "fail")]

for s, expected in TESTS:
    got = grade(s)
    print(s, got, "OK" if got == expected else "FAIL")`,
      tryThis: ["Use >= for the pass boundary", "Keep grade pure — no print inside it"],
      goal: {
        text: "All four GRD-08 tests print OK",
        check: (r) => {
          if (!r.ok || r.error) return false;
          const out = r.stdout ?? "";
          return out.includes("OK") && !out.includes("FAIL") && out.split("\n").filter((l) => l.trim()).length >= 4;
        },
        success: "You reused the ticket → matrix → function pattern on a second spec.",
      },
    },
    {
      type: "playground",
      id: "ex-letter-grade",
      title: "Practice · Letter grades (elif chain)",
      intro: "Implement letter(score): A≥90, B≥80, C≥70, else F. Run the tests.",
      starter: `def letter(score):
    # use if / elif / else
    pass

TESTS = [(95, "A"), (82, "B"), (71, "C"), (60, "F"), (90, "A")]
for s, exp in TESTS:
    g = letter(s)
    print(s, g, "OK" if g == exp else "FAIL")`,
      tryThis: ["Check boundary 90 → A", "Use elif so 95 stays A not B"],
      goal: {
        text: "All five letter tests OK",
        check: (r) => {
          if (!r.ok || r.error) return false;
          const out = r.stdout ?? "";
          return !out.includes("FAIL") && out.split("\n").filter((l) => l.includes("OK")).length >= 5;
        },
        success: "Elif ordering correct — same skill as shipping tier tickets.",
      },
    },
  ],

  practice: [
    {
      id: "q1",
      type: "mcq",
      skill: "Tickets",
      level: "easy",
      prompt: "In ticket VTL-142, which value must return \"fever\"?",
      options: ["37.9", "38.0", "35.0", "35.1"],
      answer: 1,
      explain: "Spec: fever when celsius ≥ 38.0 — 38.0 is inclusive.",
    },
    {
      id: "q2",
      type: "mcq",
      skill: "QA",
      level: "medium",
      prompt: "QA reports 35.0 shows \"normal\" after a deploy. Which change most likely caused it?",
      options: [
        "Changed >= 38 to > 38 only",
        "Changed <= 35 to < 35 only",
        "Either B or a missing <= 35 branch",
        "Added a docstring",
      ],
      answer: 2,
      explain: "35.0 must hit the cold branch; `< 35` or dropping the branch both fail T5.",
    },
    {
      id: "q3",
      type: "order",
      skill: "Workflow",
      level: "medium",
      prompt: "Order the intermediate workflow for a new ticket.",
      lines: [
        "Run automated matrix / self-tests",
        "Read acceptance criteria",
        "Implement pure functions",
        "Write test matrix from criteria",
      ],
      explain: "Read → matrix → code → run tests.",
    },
    {
      id: "q4",
      type: "fill",
      skill: "Functions",
      level: "medium",
      prompt: "Complete the fever check per VTL-142 (≥ 38).",
      code: `def classify_temp(celsius):
    if celsius ___ 38:
        return "fever"`,
      answers: [">="],
      mode: "code",
      explain: "Inclusive boundary at 38.0 °C.",
    },
    {
      id: "q5",
      type: "write",
      skill: "Implementation",
      level: "medium",
      prompt: "Implement grade(score): 'pass' if score >= 40, else 'fail'. Match the four tests in the starter.",
      starter: `def grade(score):
    pass

for s, exp in [(40, "pass"), (39, "fail"), (100, "pass"), (0, "fail")]:
    g = grade(s)
    print(s, g, "OK" if g == exp else "FAIL")`,
      hint: "One if/return or if/else; compare with >= 40.",
      solution: `def grade(score):
    if score >= 40:
        return "pass"
    return "fail"`,
      check: (r) => {
        if (!r.ok) return r.error || "Runtime error";
        const out = r.stdout ?? "";
        if (out.includes("FAIL")) return "Some tests failed — check >= 40";
        if (!out.includes("pass") || !out.includes("fail")) return "Expected pass and fail labels";
        return null;
      },
    },
    {
      id: "q6",
      type: "write",
      skill: "Case study",
      level: "hard",
      prompt: "Complete classify_temp for VTL-142 and run the six-row matrix (all OK).",
      starter: `def classify_temp(celsius):
    pass

TESTS = [(36.8, "normal"), (39, "fever"), (34, "too cold"), (38, "fever"), (35, "too cold"), (35.1, "normal")]
for temp, expected in TESTS:
    got = classify_temp(temp)
    print(temp, got, "OK" if got == expected else "FAIL")`,
      hint: "Two thresholds: >= 38 fever, <= 35 cold, else normal.",
      solution: `def classify_temp(celsius):
    if celsius >= 38:
        return "fever"
    if celsius <= 35:
        return "too cold"
    return "normal"`,
      challenge: true,
      check: (r) => {
        if (!r.ok) return r.error || "Runtime error";
        const out = r.stdout ?? "";
        if (out.includes("FAIL")) return "Fix logic until every row prints OK";
        const rows = out.trim().split("\n").filter(Boolean);
        if (rows.length < 6) return "Run all six matrix rows";
        return null;
      },
    },
    {
      id: "q7",
      type: "mcq",
      skill: "Operators",
      level: "easy",
      prompt: "Which condition is True for celsius = 37.0?",
      options: ["c >= 38", "c <= 35", "c > 35 and c < 38", "c == 38"],
      answer: 2,
      explain: "37 is strictly between the fever and cold thresholds.",
    },
    {
      id: "q8",
      type: "mcq",
      skill: "Elif",
      level: "medium",
      prompt: "score = 90. What grade with: if >=90 A; elif >=80 B; else F?",
      options: ["B", "A", "F", "Error"],
      answer: 1,
      explain: "First true branch wins — 90 >= 90 → A.",
    },
    {
      id: "q9",
      type: "fill",
      skill: "Cold band",
      level: "easy",
      prompt: "Complete the too-cold check for VTL-142 (≤ 35).",
      code: `if celsius ___ 35:
    return "too cold"`,
      answers: ["<="],
      mode: "code",
      explain: "Inclusive bound at 35.0 °C.",
    },
    {
      id: "q10",
      type: "mcq",
      skill: "Process",
      level: "easy",
      prompt: "What should you attach to a PR to prove VTL-142 is done?",
      options: [
        "Screenshot of your IDE theme",
        "Matrix output with all OK + exit code 0",
        "Only the function without tests",
        "A meme",
      ],
      answer: 1,
      explain: "Reviewers want reproducible proof — test output.",
    },
    {
      id: "q11",
      type: "write",
      skill: "Elif",
      level: "hard",
      prompt: "letter(score): A if >=90, B if >=80, C if >=70, else F. All five tests must OK.",
      starter: `def letter(score):
    pass

for s, exp in [(95, "A"), (82, "B"), (71, "C"), (60, "F"), (90, "A")]:
    g = letter(s)
    print(s, g, "OK" if g == exp else "FAIL")`,
      hint: "if / elif / elif / else chain — highest band first.",
      solution: `def letter(score):
    if score >= 90:
        return "A"
    elif score >= 80:
        return "B"
    elif score >= 70:
        return "C"
    return "F"`,
      challenge: true,
      check: (r) => {
        if (!r.ok) return r.error || "Error";
        const out = r.stdout ?? "";
        if (out.includes("FAIL")) return "Fix the elif chain until every row is OK";
        if ((out.match(/OK/g)?.length ?? 0) < 5) return "All five letter tests must print OK";
        return null;
      },
    },
  ],
};
