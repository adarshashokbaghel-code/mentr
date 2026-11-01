import type { PracticeItem, PracticeLevel, PracticeTest } from "@/lib/python-lms/practice-bank";

/**
 * Real-work drills for Python Intermediate.
 * Code tasks read input() so a hardcoded print fails the second case.
 */
export const INTERMEDIATE_PRACTICE_UNITS: { lesson: number; title: string }[] = [
  { lesson: 1, title: "Tickets and boundaries" },
  { lesson: 2, title: "Dictionaries and counting" },
  { lesson: 3, title: "Sets and duplicates" },
  { lesson: 4, title: "Parsing text rows" },
  { lesson: 5, title: "Tuples and records" },
  { lesson: 6, title: "Comprehensions" },
  { lesson: 7, title: "Functions at work" },
  { lesson: 8, title: "Errors that don't hide bugs" },
  { lesson: 9, title: "JSON data" },
  { lesson: 10, title: "Stdlib on real logs" },
  { lesson: 11, title: "Small classes" },
  { lesson: 12, title: "Tests before you ship" },
];

const UNIT = Object.fromEntries(
  INTERMEDIATE_PRACTICE_UNITS.map((u) => [u.lesson, `Intermediate ${String(u.lesson).padStart(2, "0")} · ${u.title}`]),
);

function item(partial: Omit<PracticeItem, "course" | "unit">): PracticeItem {
  return { ...partial, course: "intermediate", unit: UNIT[partial.lesson] };
}

function tf(lesson: number, level: PracticeLevel, prompt: string, answer: boolean, explain: string): PracticeItem {
  return item({ id: "", lesson, level, kind: "tf", prompt, answer, explain });
}

function mcq(
  lesson: number,
  level: PracticeLevel,
  prompt: string,
  options: string[],
  answerIndex: number,
  explain: string,
): PracticeItem {
  return item({ id: "", lesson, level, kind: "mcq", prompt, options, answerIndex, explain });
}

function code(
  lesson: number,
  level: PracticeLevel,
  prompt: string,
  starter: string,
  solution: string,
  tests: PracticeTest[],
  explain: string,
): PracticeItem {
  return item({ id: "", lesson, level, kind: "code", prompt, starter, solution, tests, explain });
}

const QUESTIONS: PracticeItem[] = [];

function push(q: PracticeItem) {
  QUESTIONS.push(q);
}

push(tf(1, "easy", "A ticket's acceptance criteria are the examples QA will actually run.", true, "If a row is not in the criteria, you have not agreed to support it."));
push(tf(1, "medium", "Using > 38 when the spec says fever starts at 38 still passes a reading of 38.0.", false, "38.0 is not greater than 38. The spec needs >= 38."));
push(
  mcq(1, "easy", "A clinic spec says: 38 or above is fever, 35 or below is too cold, everything else is normal. What is 38.0?", ["fever", "normal", "too cold", "error"], 0, "The boundary is included. 38.0 is fever."),
);
push(
  mcq(1, "hard", "Which row must be in the test matrix before you ship classify_temp?", ["38, 35, 36.6, and one value past each edge", "Only 37, because that is a typical body temperature", "A random float, once", "The function name"], 0, "Reviewers reject a ticket that was only tried on the happy path."),
);
push(
  code(
    1,
    "medium",
    "Read one Celsius value. Print fever if it is 38 or above, too cold if it is 35 or below, otherwise normal.",
    "# read one number from input\n",
    `c = float(input().strip())
if c >= 38:
    print("fever")
elif c <= 35:
    print("too cold")
else:
    print("normal")
`,
    [
      { label: "Exact fever line", stdin: "38\n", expected: "fever" },
      { label: "Exact cold line", stdin: "35\n", expected: "too cold" },
      { label: "Inside the band", stdin: "36.5\n", expected: "normal" },
    ],
    "Include both boundaries. > 38 marks a real 38.0 reading as normal.",
  ),
);

push(tf(2, "easy", "counts[word] += 1 raises KeyError the first time that word appears.", true, "The key is missing. Use counts.get(word, 0) + 1."));
push(tf(2, "medium", "Dict keys must be unique. A second write to the same key keeps both values.", false, "The new value replaces the old one."));
push(
  mcq(2, "medium", "A log line is counted with counts[word] = counts.get(word, 0) + 1. Why the 0?", ["So the first sighting starts at 1 instead of crashing", "So missing words are deleted", "So the dict stays sorted", "So values become strings"], 0, ".get(word, 0) is 0 when the word is new, then you add 1."),
);
push(
  code(
    2,
    "medium",
    "Line 1 is the word to count. Line 2 is a sentence. Print how many times that word appears. Match case.",
    "# two lines from input\n",
    `target = input().strip()
words = input().split()
counts = {}
for word in words:
    counts[word] = counts.get(word, 0) + 1
print(counts.get(target, 0))
`,
    [
      { label: "Three errors", stdin: "error\nok error ok error error\n", expected: "3" },
      { label: "Word never appears", stdin: "info\nok ok ok\n", expected: "0" },
    ],
    "Build the tally with .get, then read the target. A missing key is 0, not a crash.",
  ),
);

push(tf(3, "easy", "{} creates an empty set.", false, "{} is an empty dict. An empty set is set()."));
push(tf(3, "medium", "A set is the right tool when you care whether a value has been seen, not how many times.", true, "Sets answer membership. Dicts answer counts."));
push(
  mcq(3, "hard", "ids = ['a', 'b', 'a']. Which report is safe to assert in a test?", ["sorted(set(ids)) == ['a', 'b']", "set(ids) == {'b', 'a'} without sorting", "print(set(ids)) and compare the text", "ids[0] after converting to a set"], 0, "Set order is not part of the contract. Sort before you compare."),
);
push(
  code(
    3,
    "medium",
    "Read one line of ids separated by spaces. Print how many distinct ids there are.",
    "# one line of ids\n",
    `ids = input().split()
print(len(set(ids)))
`,
    [
      { label: "Repeats collapse", stdin: "a b a c\n", expected: "3" },
      { label: "All the same", stdin: "x x x\n", expected: "1" },
    ],
    "len(set(...)) is the distinct count. A list length would count the duplicates."),
);

push(tf(4, "easy", "You should strip each CSV field, not only the whole line.", true, '"Ada, 12 " still has a space on the age until each part is stripped.'));
push(tf(4, "medium", "parts[2] is safe on every row of a file.", false, "A short row raises IndexError. Check len(parts) first."));
push(
  mcq(4, "medium", 'line = "Ada, 12". What is the age after a correct parse?', ["12", " 12", "Ada", "Ada, 12"], 0, "Split on the comma, then strip each field. The age is the second field."),
);
push(
  code(
    4,
    "medium",
    "Read one comma-separated row of name, age. Print the name. If the row does not have exactly two fields, print bad.",
    "# one csv row\n",
    `parts = [p.strip() for p in input().strip().split(",")]
if len(parts) != 2 or not parts[0]:
    print("bad")
else:
    print(parts[0])
`,
    [
      { label: "Spaces around the comma", stdin: "Ada, 12\n", expected: "Ada" },
      { label: "Missing age", stdin: "Ada\n", expected: "bad" },
    ],
    "Split, strip each field, then refuse a row that is not name and age.",
  ),
);

push(tf(5, "easy", "A tuple can be used to return count, total, and average together.", true, "return count, total, average packs one record the caller unpacks."));
push(tf(5, "hard", "point[0] = 1 works when point is a tuple.", false, "Tuples do not allow item assignment. That line raises TypeError."));
push(
  mcq(5, "medium", "lo, hi = min(nums), max(nums). What does the caller receive?", ["Two names for the two ends of the record", "A list that can be appended to", "Only the minimum", "A dict with keys lo and hi"], 0, "Unpacking a tuple gives each position a name."),
);
push(
  code(
    5,
    "medium",
    "Read one line of integers. Print the minimum, a space, then the maximum.",
    "# one line of integers\n",
    `nums = [int(x) for x in input().split()]
lo, hi = min(nums), max(nums)
print(lo, hi)
`,
    [
      { label: "Unsorted input", stdin: "3 1 4\n", expected: "1 4" },
      { label: "Single value", stdin: "9\n", expected: "9 9" },
    ],
    "Pack the two ends with min and max, then print them in that order.",
  ),
);

push(tf(6, "easy", "A list comprehension can filter and build a list in one expression.", true, "[w for w in words if len(w) > 3] keeps only the long words."));
push(tf(6, "hard", "A team should prefer a nested comprehension whenever it is shorter.", false, "Two levels of nesting are usually harder to review than a plain loop."));
push(
  mcq(
    6,
    "medium",
    "Which comprehension keeps scores of 50 or more?",
    ["[s for s in scores if s >= 50]", "s for s in scores if s >= 50", "{s for s in scores}", "scores.filter(s >= 50)"],
    0,
    "Square brackets build a list. The if clause is the filter.",
  ),
);
push(
  code(
    6,
    "medium",
    "Read one line of words. Print the words longer than 3 letters, separated by spaces, in the same order. Print a blank line if none qualify.",
    "# one line of words\n",
    `words = input().split()
print(" ".join(w for w in words if len(w) > 3))
`,
    [
      { label: "Mixed lengths", stdin: "cat python go data\n", expected: "python data" },
      { label: "Nothing long enough", stdin: "a be cat\n", expected: "" },
    ],
    "The filter belongs in the comprehension. join puts the survivors back on one line.",
  ),
);

push(tf(7, "medium", "def add(item, bag=[]): shares one list across later calls.", true, "The default list is created once. Later calls see items from earlier calls."));
push(tf(7, "easy", "A pure function's result depends only on its arguments.", true, "No globals and no edits to a list the caller still holds."));
push(
  mcq(7, "hard", "Which signature avoids the shared-default bug?", ["def add(item, bag=None):", "def add(item, bag=[]):", "def add(item=bag):", "def add(bag=[], item):"], 0, "Use None, then create a new list inside the function."),
);
push(
  code(
    7,
    "medium",
    "Read qty and price (rupees) on one line. Print the total with 18% tax, two decimal places. Example: 2 100 prints 236.00.",
    "# qty and price\n",
    `qty, price = input().split()
total = int(qty) * float(price) * 1.18
print(f"{total:.2f}")
`,
    [
      { label: "Two units at 100", stdin: "2 100\n", expected: "236.00" },
      { label: "One unit at 10", stdin: "1 10\n", expected: "11.80" },
    ],
    "Do the money math in one function's worth of code, and format to paise with .2f.",
  ),
);

push(tf(8, "easy", "except: pass is a good way to keep a parser running.", false, "A bare except hides bugs you did not expect, including typos."));
push(tf(8, "medium", "Catch ValueError when int() is given text that is not a whole number.", true, "int('no') raises ValueError. Catch that type, not every exception."));
push(
  mcq(8, "hard", "parse_int(' 12 ') should return 12. parse_int('no') should fail with a message that includes the original text. Which pattern matches?", ["strip, then int, and raise ValueError with the original text on failure", "except: return 0", "int(text) with no strip and no handler", "catch Exception and print the traceback to the user"], 0, "Handle the exception you expect, and keep the bad input in the message."),
);
push(
  code(
    8,
    "medium",
    "Read one line. If it is a whole number after stripping spaces, print that number. Otherwise print bad. Do not crash.",
    "# one line\n",
    `text = input()
try:
    print(int(text.strip()))
except ValueError:
    print("bad")
`,
    [
      { label: "Spaces around a number", stdin: " 12 \n", expected: "12" },
      { label: "Not a number", stdin: "no\n", expected: "bad" },
    ],
    "Catch ValueError only. A bare except would also swallow a bug in the function.",
  ),
);

push(tf(9, "easy", "JSON object keys must be in double quotes.", true, "{'theme': 'dark'} is Python, not JSON. JSON wants \"theme\"."));
push(tf(9, "medium", "json.loads returns a dict or list you can index. It does not print the file.", true, "You still choose which fields to print."));
push(
  mcq(9, "medium", 'raw = \'{"font": 14}\'. What is json.loads(raw)["font"]?', ["14", '"14"', "font", "An error, because JSON cannot hold numbers"], 0, "JSON numbers become int or float."),
);
push(
  code(
    9,
    "hard",
    "Read one JSON list of tasks. Each task has a title. Print each title on its own line, in order.",
    "import json\n",
    `import json
tasks = json.loads(input())
for task in tasks:
    print(task["title"])
`,
    [
      { label: "Two tasks", stdin: '[{"title": "Pay"}, {"title": "File"}]\n', expected: "Pay\nFile" },
      { label: "One task", stdin: '[{"title": "Ship"}]\n', expected: "Ship" },
    ],
    "loads turns the text into a list of dicts. Print the title field, not the whole object.",
  ),
);

push(tf(10, "easy", "Counter is the stdlib tool for tallying a list of codes.", true, "collections.Counter does the .get(key, 0) + 1 loop for you."));
push(tf(10, "hard", "from module import * is what reviewers want in application code.", false, "Import the name you use. A star import hides where a name came from."));
push(
  mcq(10, "medium", "levels = Counter(['INFO', 'ERR', 'INFO']). What is levels.most_common(1)?", ["[('INFO', 2)]", "['INFO']", "{'INFO': 2}", "2"], 0, "most_common returns (value, count) pairs, most frequent first."),
);
push(
  code(
    10,
    "medium",
    "Read one line of HTTP status codes. Print the most common code, a space, and how many times it appears.",
    "from collections import Counter\n",
    `from collections import Counter
code, count = Counter(input().split()).most_common(1)[0]
print(code, count)
`,
    [
      { label: "200 leads", stdin: "200 404 200 500 200\n", expected: "200 3" },
      { label: "404 leads", stdin: "404 404 200\n", expected: "404 2" },
    ],
    "Counter plus most_common(1) is the log summary. Don't rewrite the tally by hand.",
  ),
);

push(tf(11, "easy", "A method's first parameter is self, the object the method was called on.", true, "Forgetting self causes TypeError when the method is called."));
push(tf(11, "medium", "task.done = True from outside the class is the only way to finish a task.", false, "A mark_done method keeps that change in one place."));
push(
  mcq(11, "medium", "class Task: def mark_done(self): ... then task = Task('Ship'); task.mark_done(). What is self inside mark_done?", ["The task object", "The string Ship", "The class Task", "None"], 0, "Calling task.mark_done() passes task in as self."),
);
push(
  code(
    11,
    "hard",
    "Read a task title. Create a Task, mark it done, and print the title, a space, and True.",
    "# title from input\n",
    `class Task:
    def __init__(self, title):
        self.title = title
        self.done = False

    def mark_done(self):
        self.done = True

task = Task(input().strip())
task.mark_done()
print(task.title, task.done)
`,
    [
      { label: "Ship", stdin: "Ship\n", expected: "Ship True" },
      { label: "File tax", stdin: "File tax\n", expected: "File tax True" },
    ],
    "Keep the title and done flag on the instance. mark_done changes done. The print is the report.",
  ),
);

push(tf(12, "easy", "Read a traceback from the bottom: the last line is the error, the lines above are who called whom.", true, "The bottom names the exception. Walk up to your file."));
push(tf(12, "hard", "assert is enough to protect a library that ships to customers.", false, "Python -O removes asserts. A shipped check should be a real test or an explicit raise."));
push(
  mcq(12, "medium", "A function returns 4 and the test expected 5. What should the test print?", ["FAIL, with both values", "Nothing, so the run looks green", "The source of the function", "OK, because it returned a number"], 0, "A quiet pass is only honest when the values match. Show both sides on failure."),
);
push(
  code(
    12,
    "easy",
    "Read two tokens, got and expected. Print OK if they are equal, otherwise FAIL.",
    "# got expected\n",
    `got, expected = input().split()
print("OK" if got == expected else "FAIL")
`,
    [
      { label: "Match", stdin: "3 3\n", expected: "OK" },
      { label: "Mismatch", stdin: "3 4\n", expected: "FAIL" },
    ],
    "Compare the two values and make the result obvious. A test that never prints FAIL will not catch a regression.",
  ),
);

export const INTERMEDIATE_PRACTICE_BANK: PracticeItem[] = QUESTIONS.map((q, i) => ({
  ...q,
  id: `pi${String(i + 1).padStart(3, "0")}`,
}));
