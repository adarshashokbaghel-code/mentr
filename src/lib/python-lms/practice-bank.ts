export type PracticeKind = "tf" | "mcq" | "code";
export type PracticeLevel = "easy" | "medium" | "hard";

export type PracticeTest = {
  label: string;
  stdin?: string;
  expected: string;
};

export type PracticeItem = {
  id: string;
  lesson: number;
  unit: string;
  level: PracticeLevel;
  kind: PracticeKind;
  prompt: string;
  explain: string;
  answer?: boolean;
  options?: string[];
  answerIndex?: number;
  starter?: string;
  solution?: string;
  tests?: PracticeTest[];
};

export const PRACTICE_UNITS: { lesson: number; title: string }[] = [
  { lesson: 1, title: "Welcome to Python" },
  { lesson: 2, title: "Variables" },
  { lesson: 3, title: "Input & Calculations" },
  { lesson: 4, title: "Making Decisions with if" },
  { lesson: 5, title: "Thinking with Logic" },
  { lesson: 6, title: "Loops" },
  { lesson: 7, title: "Strings" },
  { lesson: 8, title: "Lists" },
  { lesson: 9, title: "Functions" },
  { lesson: 10, title: "Final Challenge" },
];

const UNIT: Record<number, string> = Object.fromEntries(
  PRACTICE_UNITS.map((u) => [u.lesson, `Lesson ${String(u.lesson).padStart(2, "0")} · ${u.title}`]),
);

type Draft = Omit<PracticeItem, "id" | "unit">;

let seq = 0;

function add(draft: Draft): PracticeItem {
  seq += 1;
  return {
    id: `py${String(seq).padStart(3, "0")}`,
    unit: UNIT[draft.lesson],
    ...draft,
  };
}

function tf(lesson: number, level: PracticeLevel, prompt: string, answer: boolean, explain: string): PracticeItem {
  return add({ lesson, level, kind: "tf", prompt, answer, explain });
}

function choices(correct: string, pool: string[]): [string, string, string] {
  const picked: string[] = [];
  for (const item of pool) {
    if (item !== correct && !picked.includes(item)) picked.push(item);
    if (picked.length === 3) break;
  }
  return picked as [string, string, string];
}

function mcq(
  lesson: number,
  level: PracticeLevel,
  prompt: string,
  correct: string,
  wrongs: [string, string, string],
  explain: string,
): PracticeItem {
  const raw = [correct, ...wrongs];
  const rot = prompt.length % 4;
  const options = [0, 1, 2, 3].map((i) => raw[(i + rot) % 4]);
  return add({
    lesson,
    level,
    kind: "mcq",
    prompt,
    options,
    answerIndex: (4 - rot) % 4,
    explain,
  });
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
  return add({ lesson, level, kind: "code", prompt, starter, solution, tests, explain });
}

function levels(i: number): PracticeLevel {
  if (i % 5 < 2) return "easy";
  if (i % 5 < 4) return "medium";
  return "hard";
}

function lesson1(): PracticeItem[] {
  const out: PracticeItem[] = [];
  const facts: [string, boolean, string, PracticeLevel][] = [
    ["A program is a set of instructions for a computer.", true, "Programming is writing those instructions.", "easy"],
    ["print() shows text on the screen.", true, "It does not send anything to a paper printer.", "easy"],
    ["Text inside print() needs quotes.", true, 'print("Hi") works. print(Hi) is a name, not text.', "easy"],
    ["Python runs a program from the top line downward.", true, "Each line runs in order, unless you change the flow later.", "easy"],
    ["A line that starts with # is a comment and is not run.", true, "Comments are notes for people.", "easy"],
    ["Numbers inside print() must be in quotes.", false, "print(7) prints 7. Quotes are for text.", "easy"],
    ["Hardware means the programs on a computer.", false, "Hardware is the physical parts. Programs are software.", "medium"],
    ["The default sep in print() is a comma.", false, "sep is a single space unless you change it.", "medium"],
    ["An empty print() still ends the line, so it can make a blank line.", true, "print() with nothing inside prints a blank line.", "medium"],
    ["A flowchart diamond is used for a yes/no decision.", true, "Start and stop use ovals. Decisions use diamonds.", "medium"],
    ["Pseudocode is real Python and the computer can run it.", false, "Pseudocode is a plan in plain English. It is not executed.", "medium"],
    ["An algorithm should finish after a fixed number of steps.", true, "That property is called finiteness.", "medium"],
    ["A compiler translates the whole program before it runs.", true, "An interpreter instead runs the program line by line.", "hard"],
    ["IPO stands for Input, Process, Output.", true, "Almost every program takes data in, works on it, and shows a result.", "hard"],
    ["A parallelogram in a flowchart means Start or Stop.", false, "Start and Stop are ovals. A parallelogram is input or output.", "hard"],
    ["print(\"A\", \"B\", sep=\"-\") prints A-B.", true, "sep replaces the space between values.", "hard"],
    ["print(\"Hi\", end=\"\") moves to the next line immediately.", false, "end=\"\" stays on the same line. The default end is a new line.", "hard"],
    ["In script mode, 2 + 3 is shown automatically.", false, "In a file you need print(2 + 3) to see 5.", "hard"],
  ];
  for (const [prompt, answer, explain, level] of facts) out.push(tf(1, level, prompt, answer, explain));

  for (const word of ["Hello", "Python", "Welcome", "Good morning", "Mentr", "Class 6", "Start", "Hi"]) {
    out.push(
      mcq(1, "easy", `What does print("${word}") show?`, word, ["A paper printout", "Nothing", "An error"], "print() displays the text inside the quotes."),
    );
  }
  const pairs: [string, string, string][] = [
    ["Hi", "there", "Hi there"],
    ["Good", "day", "Good day"],
    ["Red", "blue", "Red blue"],
    ["10", "20", "10 20"],
    ["Cat", "dog", "Cat dog"],
    ["A", "B", "A B"],
  ];
  for (const [a, b, shown] of pairs) {
    out.push(
      mcq(
        1,
        "medium",
        `What does print("${a}", "${b}") show?`,
        shown,
        [`${a}${b}`, `${a}, ${b}`, "An error"],
        "Two values in one print() are joined with a space.",
      ),
    );
  }
  out.push(
    mcq(1, "medium", "What is the default value of sep?", "A space", ["A comma", "A new line", "Nothing at all"], "sep is the gap between values. It starts as one space."),
    mcq(1, "medium", "What is the default value of end?", "A new line", ["A space", "A full stop", "Nothing"], "After printing, Python moves to the next line."),
    mcq(1, "hard", "Which shape is Start and Stop on a flowchart?", "Oval", ["Diamond", "Rectangle", "Parallelogram"], "Terminal steps use an oval."),
    mcq(1, "hard", "Which shape is used for Print Sum?", "Parallelogram", ["Oval", "Rectangle", "Diamond"], "Showing a result is output, drawn as a parallelogram."),
    mcq(1, "hard", "Which line actually runs?\n\n# print(\"skip\")\nprint(\"go\")", "go", ["skip", "skip then go", "Nothing"], "The # line is a comment. Only print(\"go\") runs."),
    mcq(1, "hard", "print(\"A\", \"B\", sep=\"-\", end=\"!\") shows:", "A-B!", ["A B!", "A-B", "A, B!"], "sep sits between the values. end is added after them."),
  );

  out.push(
    code(1, "easy", "Print exactly Hello and nothing else.", "# Print Hello\n", 'print("Hello")', [{ label: "Output", expected: "Hello" }], "One print() with the word in quotes."),
    code(1, "easy", "Print the number 42. Do not put quotes around it.", "# Print 42\n", "print(42)", [{ label: "Output", expected: "42" }], "Numbers do not need quotes."),
    code(1, "easy", "Print two lines: first Hi, then Python.", "", 'print("Hi")\nprint("Python")', [{ label: "Output", expected: "Hi\nPython" }], "Each print() ends on its own line."),
    code(1, "easy", "Print Good and morning on one line with a space between them. Use one print().", "", 'print("Good", "morning")', [{ label: "Output", expected: "Good morning" }], "Commas inside print() insert the default space."),
    code(1, "medium", "Print red-blue using sep.", "", 'print("red", "blue", sep="-")', [{ label: "Output", expected: "red-blue" }], "sep=\"-\" replaces the space."),
    code(1, "medium", "Print Cat then a space then Dog, and do not move to a new line after Cat. Then print Dog with a second print(). The screen should show: Cat Dog", "", 'print("Cat", end=" ")\nprint("Dog")', [{ label: "Output", expected: "Cat Dog" }], "end=\" \" stays on the same line and adds a space."),
    code(1, "medium", "Print Hello, then a blank line, then World.", "", 'print("Hello")\nprint()\nprint("World")', [{ label: "Output", expected: "Hello\n\nWorld" }], "An empty print() is a blank line."),
    code(1, "hard", "Using only one print(), show these three lines:\nSun\nMoon\nStar", "", 'print("Sun\\nMoon\\nStar")', [{ label: "Output", expected: "Sun\nMoon\nStar" }], "\\n inside one string starts a new line."),
    code(1, "hard", "Print A|B|C with one print() and sep.", "", 'print("A", "B", "C", sep="|")', [{ label: "Output", expected: "A|B|C" }], "sep is placed between each value."),
    code(1, "hard", "Print Yes! with no space before the exclamation mark. Use end.", "", 'print("Yes", end="!")', [{ label: "Output", expected: "Yes!" }], "end replaces the new line, so ! sticks to Yes."),
  );
  return out;
}

function lesson2(): PracticeItem[] {
  const out: PracticeItem[] = [];
  const facts: [string, boolean, string, PracticeLevel][] = [
    ["A variable is a name for a value.", true, "score = 10 stores 10 under the name score.", "easy"],
    ["score = 10 and then score = 20 leaves score holding 10.", false, "The new value replaces the old one. score is 20.", "easy"],
    ["True and False are the bool type.", true, "bool means a yes/no value.", "easy"],
    ["A variable name can start with a number.", false, "2score is invalid. score2 is fine.", "easy"],
    ["A variable name can contain a space.", false, "Use player_score, not player score.", "easy"],
    ['"12" and 12 are the same type.', false, '"12" is text (str). 12 is a whole number (int).', "easy"],
    ["type() tells you the type of a value.", true, "type(3) is int. type(3.0) is float.", "medium"],
    ["3 and 3.0 have the same type.", false, "3 is int. 3.0 is float.", "medium"],
    ["Python names are case-sensitive. Score and score are different.", true, "Capital letters matter in names.", "medium"],
    ["You can store text, whole numbers, decimals and True/False.", true, "Those are str, int, float and bool.", "medium"],
    ["x = x + 1 uses the old value of x to make a new one.", true, "The right side is worked out first, then stored.", "medium"],
    ["A variable must be created before you print it.", true, "Printing an unknown name causes a NameError.", "medium"],
    ["int can hold 5.4.", false, "5.4 is a float. int is a whole number.", "hard"],
    ["name, Name and NAME are three different variables.", true, "Python treats capitals as different letters.", "hard"],
    ["player-score is a valid variable name.", false, "A hyphen is subtraction. Use player_score.", "hard"],
    ["Assigning a new type to a name is allowed. x = 1 then x = \"hi\" is legal.", true, "A name can later point at a different type.", "hard"],
    ["bool(0) is True.", false, "0 is treated as False. Any other number is True.", "hard"],
    ["An empty string \"\" is still type str.", true, "It is text with length 0.", "hard"],
  ];
  for (const row of facts) out.push(tf(2, row[3], row[0], row[1], row[2]));

  const typed: [string, string][] = [
    ['"Aarav"', "str"],
    ["12", "int"],
    ["5.4", "float"],
    ["True", "bool"],
    ["False", "bool"],
    ['"12"', "str"],
    ["0", "int"],
    ["0.0", "float"],
    ['""', "str"],
    ["100", "int"],
  ];
  const typeOpts = ["str", "int", "float", "bool"] as const;
  for (const [shown, kind] of typed) {
    const wrongs = typeOpts.filter((t) => t !== kind) as unknown as [string, string, string];
    out.push(mcq(2, shown.includes(".") || shown === "True" || shown === "False" ? "medium" : "easy", `What is the type of ${shown}?`, kind, wrongs, `${shown} is a ${kind}.`));
  }
  const names: [string, string, string][] = [
    ["score2", "valid", "It starts with a letter."],
    ["2score", "invalid", "Names cannot start with a number."],
    ["player_score", "valid", "Underscores are allowed."],
    ["player score", "invalid", "Spaces are not allowed in a name."],
    ["for", "invalid", "for is a Python keyword."],
    ["Score", "valid", "Capitals are allowed, and Score is not the same as score."],
  ];
  for (const [name, verdict, why] of names) {
    out.push(
      mcq(
        2,
        "medium",
        `Is ${name} a valid variable name?`,
        verdict,
        verdict === "valid" ? ["invalid", "only inside a function", "only for numbers"] : ["valid", "only if you add quotes", "only for text"],
        why,
      ),
    );
  }
  out.push(
    mcq(2, "hard", "x = 4\nx = x + 3\nprint(x)\n\nWhat is printed?", "7", ["4", "43", "Error"], "4 + 3 is stored back into x."),
    mcq(2, "hard", "a = 10\nb = a\na = 2\nprint(b)\n\nWhat is printed?", "10", ["2", "12", "Error"], "b keeps the value it was given. Changing a later does not change b."),
    mcq(2, "hard", "Which line checks the type of score?", "print(type(score))", ["print(score.type)", "print(kind(score))", "print(typeof score)"], "The function is type()."),
    mcq(2, "easy", "Which value is a float?", "4.0", ["4", '"4.0"', "False"], "A decimal point makes it a float."),
    mcq(2, "easy", "After name = \"Mia\", what does print(name) show?", "Mia", ['"Mia"', "name", "Error"], "Printing a variable shows its value, not the quotes."),
    mcq(2, "medium", "Which assignment stores text?", 'city = "Pune"', ["city = Pune", "city = 12", "city = True"], "Text needs quotes."),
  );

  out.push(
    code(2, "easy", "Create name holding Ada and print it.", "name = \"\"\n", 'name = "Ada"\nprint(name)', [{ label: "Output", expected: "Ada" }], "Store the text, then print the name."),
    code(2, "easy", "Create score holding 10 and print it.", "", "score = 10\nprint(score)", [{ label: "Output", expected: "10" }], "A whole number does not need quotes."),
    code(2, "easy", "Set lives to 3, then change it to 2, then print lives.", "", "lives = 3\nlives = 2\nprint(lives)", [{ label: "Output", expected: "2" }], "The second assignment replaces the first."),
    code(2, "easy", "Print the type name of 5. You can write print(type(5)). The output should be <class 'int'>.", "", "print(type(5))", [{ label: "Output", expected: "<class 'int'>" }], "type(5) reports int."),
    code(2, "medium", "Start points at 8. Add 2 using points = points + 2. Print points.", "", "points = 8\npoints = points + 2\nprint(points)", [{ label: "Output", expected: "10" }], "The right side uses the old value."),
    code(2, "medium", "Set ok to True and print it.", "", "ok = True\nprint(ok)", [{ label: "Output", expected: "True" }], "True and False have capitals and no quotes."),
    code(2, "medium", "Set price to 2.5 and print it.", "", "price = 2.5\nprint(price)", [{ label: "Output", expected: "2.5" }], "Decimals are floats."),
    code(2, "hard", "Set a to 10 and b to a. Then set a to 1. Print a and b on one line with a space.", "", "a = 10\nb = a\na = 1\nprint(a, b)", [{ label: "Output", expected: "1 10" }], "b still holds 10."),
    code(2, "hard", "Print the types of \"5\" and 5 on two lines. They must be <class 'str'> then <class 'int'>.", "", 'print(type("5"))\nprint(type(5))', [{ label: "Output", expected: "<class 'str'>\n<class 'int'>" }], "Quotes make text even when the characters are digits."),
    code(2, "hard", "Set word to hi, then change word to HI, then print word.", "", 'word = "hi"\nword = "HI"\nprint(word)', [{ label: "Output", expected: "HI" }], "The latest text replaces the earlier text."),
  );
  return out;
}

function lesson3(): PracticeItem[] {
  const out: PracticeItem[] = [];
  const facts: [string, boolean, string, PracticeLevel][] = [
    ["input() always gives you text, even if the person types digits.", true, "int(input()) turns that text into a number.", "easy"],
    ["int(\"7\") is the number 7.", true, "int() converts numeric text into an int.", "easy"],
    ["You can add text from input() straight to a number.", false, '"7" + 1 is an error. Convert with int() first.', "easy"],
    ["% gives the remainder.", true, "7 % 2 is 1. It is not a percentage.", "easy"],
    ["/ always gives a whole number.", false, "7 / 2 is 3.5. Use // if you want to drop the fraction.", "easy"],
    ["float(\"3.5\") is 3.5.", true, "float() is for decimals.", "easy"],
    ["n % 2 == 0 means n is even.", true, "An even number has remainder 0 when divided by 2.", "medium"],
    ["// is floor division.", true, "7 // 2 is 3.", "medium"],
    ["input() can take a prompt string.", true, "input(\"Age: \") shows Age: and waits.", "medium"],
    ["2 ** 3 is 6.", false, "** is power. 2 ** 3 is 8.", "medium"],
    ["The order of * and + follows maths: multiplication first.", true, "2 + 3 * 4 is 14, not 20.", "medium"],
    ["int(3.9) is 4.", false, "int() cuts off the fraction. int(3.9) is 3.", "medium"],
    ["Parentheses change the order: (2 + 3) * 4 is 20.", true, "The bracket is worked out first.", "hard"],
    ["int(\"3.5\") works and gives 3.", false, "int() cannot read a decimal string. Use float() or int(float(\"3.5\")).", "hard"],
    ["A negative remainder is never produced by % with positive numbers.", true, "10 % 3 is 1.", "hard"],
    ["input() without pressing enter still returns a value immediately.", false, "The program waits until Enter.", "hard"],
  ];
  for (const row of facts) out.push(tf(3, row[3], row[0], row[1], row[2]));

  const sums: [number, string, number, string][] = [
    [12, "+", 8, "20"],
    [20, "-", 6, "14"],
    [6, "*", 7, "42"],
    [8, "/", 2, "4.0"],
    [7, "%", 2, "1"],
    [7, "//", 2, "3"],
    [2, "**", 4, "16"],
    [15, "%", 4, "3"],
    [9, "//", 4, "2"],
    [5, "*", 0, "0"],
    [100, "-", 1, "99"],
    [3, "**", 3, "27"],
  ];
  for (const [a, op, b, ans] of sums) {
    const level: PracticeLevel = op === "**" || op === "//" || op === "%" ? "medium" : "easy";
    out.push(
      mcq(
        3,
        level,
        `What is ${a} ${op} ${b}?`,
        ans,
        choices(ans, ["0", "1", "2", "4", "5", "6", "8", "9", "10", "12", "16", "24", "42", "99", "Error"]),
        `${a} ${op} ${b} is ${ans}.`,
      ),
    );
  }
  out.push(
    mcq(3, "medium", "What is 2 + 3 * 4?", "14", ["20", "24", "9"], "Multiplication happens before addition."),
    mcq(3, "hard", "What is (2 + 3) * 4?", "20", ["14", "24", "9"], "Brackets run first."),
    mcq(3, "hard", "age = input() and the user types 11. What is the type of age?", "str", ["int", "float", "bool"], "input() always returns text."),
    mcq(3, "easy", "Which call turns the text \"9\" into a number?", 'int("9")', ['number("9")', 'int["9"]', '"9".int()'], "int() converts numeric text."),
    mcq(3, "medium", "What is int(3.9)?", "3", ["4", "3.9", "Error"], "int() drops the fraction. It does not round."),
    mcq(3, "hard", "What is 10 % 3?", "1", ["3", "0", "3.33"], "10 = 3 * 3 + 1, so the remainder is 1."),
  );

  // The filter above can produce wrong option counts. Rebuild those 12 MCQs cleanly below if needed.
  return out.concat(lesson3Codes());
}

function lesson3Codes(): PracticeItem[] {
  return [
    code(3, "easy", "Read one whole number and print it doubled.", "n = int(input())\n", "n = int(input())\nprint(n * 2)", [
      { label: "4", stdin: "4", expected: "8" },
      { label: "7", stdin: "7", expected: "14" },
    ], "Multiply the number by 2."),
    code(3, "easy", "Read two whole numbers and print their sum.", "a = int(input())\nb = int(input())\n", "a = int(input())\nb = int(input())\nprint(a + b)", [
      { label: "2 and 3", stdin: "2\n3", expected: "5" },
      { label: "10 and 5", stdin: "10\n5", expected: "15" },
    ], "int() on each line, then add."),
    code(3, "easy", "Read a whole number and print its remainder when divided by 2.", "n = int(input())\n", "n = int(input())\nprint(n % 2)", [
      { label: "Even", stdin: "8", expected: "0" },
      { label: "Odd", stdin: "9", expected: "1" },
    ], "% 2 is 0 for even numbers."),
    code(3, "easy", "Read a price and print the same price. Keep it as a decimal.", "price = float(input())\n", "price = float(input())\nprint(price)", [
      { label: "2.5", stdin: "2.5", expected: "2.5" },
      { label: "10", stdin: "10", expected: "10.0" },
    ], "float() keeps decimals. A whole input still prints with .0."),
    code(3, "medium", "Read two whole numbers and print a - b, then a * b, on two lines.", "", "a = int(input())\nb = int(input())\nprint(a - b)\nprint(a * b)", [
      { label: "9 and 4", stdin: "9\n4", expected: "5\n36" },
      { label: "3 and 3", stdin: "3\n3", expected: "0\n9" },
    ], "Subtraction on the first line, multiplication on the second."),
    code(3, "medium", "Read a whole number of minutes and print how many whole hours fit, using //.", "", "m = int(input())\nprint(m // 60)", [
      { label: "130", stdin: "130", expected: "2" },
      { label: "59", stdin: "59", expected: "0" },
    ], "// drops the fraction."),
    code(3, "medium", "Read a whole number and print it to the power of 2.", "", "n = int(input())\nprint(n ** 2)", [
      { label: "5", stdin: "5", expected: "25" },
      { label: "1", stdin: "1", expected: "1" },
    ], "** 2 squares the number."),
    code(3, "hard", "Read price and quantity as whole numbers. Print the total.", "", "price = int(input())\nqty = int(input())\nprint(price * qty)", [
      { label: "20 x 3", stdin: "20\n3", expected: "60" },
      { label: "15 x 2", stdin: "15\n2", expected: "30" },
    ], "Total is price times quantity."),
    code(3, "hard", "Read a whole number and print whether the remainder with 3 is 0, as the number 0 or another remainder.", "", "n = int(input())\nprint(n % 3)", [
      { label: "9", stdin: "9", expected: "0" },
      { label: "10", stdin: "10", expected: "1" },
    ], "% 3 is the leftover after dividing by 3."),
    code(3, "hard", "Read two decimals and print their sum.", "", "a = float(input())\nb = float(input())\nprint(a + b)", [
      { label: "1.5 and 2.5", stdin: "1.5\n2.5", expected: "4.0" },
      { label: "2 and 2.5", stdin: "2\n2.5", expected: "4.5" },
    ], "float() keeps the decimal, then + adds the two numbers."),
  ];
}

function lesson4(): PracticeItem[] {
  const out: PracticeItem[] = [];
  const facts: [string, boolean, string, PracticeLevel][] = [
    ["if runs its block only when the condition is true.", true, "A false condition skips that block.", "easy"],
    ["else runs when the if condition is false.", true, "else is the other path.", "easy"],
    ["= and == do the same job.", false, "= stores a value. == compares two values.", "easy"],
    ["Lines inside an if must be indented.", true, "The indent shows which lines belong to the if.", "easy"],
    ["elif means else if.", true, "Use it for more than two paths.", "easy"],
    ["Python checks every elif even after one was true.", false, "It stops at the first true condition.", "medium"],
    [">= means greater than or equal.", true, "90 >= 90 is true.", "medium"],
    ["!= means not equal.", true, "3 != 4 is true.", "medium"],
    ["A condition must be in quotes.", false, "score >= 50 is a comparison, not text.", "medium"],
    ["You can have if and else without elif.", true, "elif is only for extra paths.", "medium"],
    ["Indentation of 4 spaces is the usual Python style.", true, "The lines in one block must line up.", "hard"],
    ["if score = 10: is valid syntax.", false, "Comparisons use ==. A single = cannot sit in a condition.", "hard"],
    ["An if can exist with no else.", true, "If the condition is false, the program just continues.", "hard"],
    ["elif can come before if.", false, "The chain starts with if.", "hard"],
  ];
  for (const row of facts) out.push(tf(4, row[3], row[0], row[1], row[2]));

  const grades: [number, string][] = [
    [95, "Excellent"],
    [90, "Excellent"],
    [80, "Good"],
    [70, "Good"],
    [69, "Try again"],
    [40, "Try again"],
    [0, "Try again"],
    [100, "Excellent"],
  ];
  for (const [score, word] of grades) {
    out.push(
      mcq(
        4,
        score === 70 || score === 90 || score === 69 ? "medium" : "easy",
        `score = ${score}\nif score >= 90:\n    print("Excellent")\nelif score >= 70:\n    print("Good")\nelse:\n    print("Try again")\n\nWhat is printed?`,
        word,
        ["Excellent", "Good", "Try again"].filter((w) => w !== word).concat(["Nothing"]) as [string, string, string],
        `${score} matches ${word}. Python stops at the first true test.`,
      ),
    );
  }
  out.push(
    mcq(4, "easy", "Which symbol compares two values?", "==", ["=", "=>", "eq"], "= stores. == compares."),
    mcq(4, "medium", "age = 10\nif age > 10:\n    print(\"A\")\nelse:\n    print(\"B\")\n\nWhat is printed?", "B", ["A", "A and B", "Nothing"], "10 is not greater than 10, so else runs."),
    mcq(4, "medium", "Which chain is in a legal order?", "if, elif, else", ["else, if, elif", "elif, if, else", "if, else, elif"], "else ends the chain. elif sits in the middle."),
    mcq(4, "hard", "marks = 50\nif marks >= 50:\n    print(\"Pass\")\nif marks < 80:\n    print(\"Room to grow\")\n\nWhat is printed?", "Pass then Room to grow", ["Pass", "Room to grow", "Nothing"], "These are two separate ifs, so both can run."),
    mcq(4, "hard", "What does 8 != 8 mean?", "False", ["True", "8", "Error"], "8 is equal to 8, so not-equal is false."),
    mcq(4, "easy", "A block under if is marked by:", "Indentation", ["Curly braces {}", "The word begin", "A semicolon"], "Python uses indenting instead of braces."),
    mcq(4, "medium", "n = 3\nif n % 2 == 0:\n    print(\"even\")\nelse:\n    print(\"odd\")\n\nWhat is printed?", "odd", ["even", "3", "Error"], "3 % 2 is 1, not 0."),
    mcq(4, "hard", "Which condition is true when score is exactly 40?", "score == 40", ["score = 40", "score >= 50", "score != 40"], "== checks an exact match."),
  );

  out.push(
    code(4, "easy", "Read an age. If it is 18 or more, print Adult. Otherwise print Child.", "", "age = int(input())\nif age >= 18:\n    print(\"Adult\")\nelse:\n    print(\"Child\")", [
      { label: "18", stdin: "18", expected: "Adult" },
      { label: "17", stdin: "17", expected: "Child" },
    ], ">= 18 includes 18."),
    code(4, "easy", "Read a whole number. Print even if it divides by 2, otherwise odd.", "", "n = int(input())\nif n % 2 == 0:\n    print(\"even\")\nelse:\n    print(\"odd\")", [
      { label: "4", stdin: "4", expected: "even" },
      { label: "5", stdin: "5", expected: "odd" },
    ], "% 2 == 0 is the even test."),
    code(4, "easy", "Read a mark. Print Pass when it is 50 or more, otherwise Fail.", "", "m = int(input())\nif m >= 50:\n    print(\"Pass\")\nelse:\n    print(\"Fail\")", [
      { label: "50", stdin: "50", expected: "Pass" },
      { label: "49", stdin: "49", expected: "Fail" },
    ], "50 is a pass."),
    code(4, "medium", "Read a score. Print A for 90+, B for 75+, otherwise C.", "", "s = int(input())\nif s >= 90:\n    print(\"A\")\nelif s >= 75:\n    print(\"B\")\nelse:\n    print(\"C\")", [
      { label: "90", stdin: "90", expected: "A" },
      { label: "75", stdin: "75", expected: "B" },
      { label: "74", stdin: "74", expected: "C" },
    ], "Check the higher grade first."),
    code(4, "medium", "Read a number. Print positive, zero, or negative.", "", "n = int(input())\nif n > 0:\n    print(\"positive\")\nelif n == 0:\n    print(\"zero\")\nelse:\n    print(\"negative\")", [
      { label: "3", stdin: "3", expected: "positive" },
      { label: "0", stdin: "0", expected: "zero" },
      { label: "-2", stdin: "-2", expected: "negative" },
    ], "Three paths need if, elif and else."),
    code(4, "medium", "Read two numbers. Print Bigger if the first is larger, otherwise print Not bigger.", "", "a = int(input())\nb = int(input())\nif a > b:\n    print(\"Bigger\")\nelse:\n    print(\"Not bigger\")", [
      { label: "5 then 2", stdin: "5\n2", expected: "Bigger" },
      { label: "2 then 2", stdin: "2\n2", expected: "Not bigger" },
    ], "Equal is not bigger, so else runs."),
    code(4, "hard", "Read a mark from 0 to 100. Print Excellent, Good, or Try again using 90 and 70 as the cuts.", "", "s = int(input())\nif s >= 90:\n    print(\"Excellent\")\nelif s >= 70:\n    print(\"Good\")\nelse:\n    print(\"Try again\")", [
      { label: "91", stdin: "91", expected: "Excellent" },
      { label: "70", stdin: "70", expected: "Good" },
      { label: "10", stdin: "10", expected: "Try again" },
    ], "Stop at the first true condition."),
    code(4, "hard", "Read a year. Print leap if it divides by 4, otherwise common. Ignore the century rule.", "", "y = int(input())\nif y % 4 == 0:\n    print(\"leap\")\nelse:\n    print(\"common\")", [
      { label: "2024", stdin: "2024", expected: "leap" },
      { label: "2023", stdin: "2023", expected: "common" },
    ], "A simple leap test is year % 4 == 0."),
    code(4, "hard", "Read a password as text. If it is exactly secret, print Welcome. Otherwise print No.", "", "word = input()\nif word == \"secret\":\n    print(\"Welcome\")\nelse:\n    print(\"No\")", [
      { label: "Right", stdin: "secret", expected: "Welcome" },
      { label: "Wrong", stdin: "Secret", expected: "No" },
    ], "Text comparison is case-sensitive."),
    code(4, "easy", "Read a temperature. Print Hot if it is above 30, otherwise Ok.", "", "t = int(input())\nif t > 30:\n    print(\"Hot\")\nelse:\n    print(\"Ok\")", [
      { label: "31", stdin: "31", expected: "Hot" },
      { label: "30", stdin: "30", expected: "Ok" },
    ], "Above 30 uses >, so 30 itself is Ok."),
  );
  return out;
}

function lesson5(): PracticeItem[] {
  const out: PracticeItem[] = [];
  const facts: [string, boolean, string, PracticeLevel][] = [
    ["and is true only when both sides are true.", true, "True and False is False.", "easy"],
    ["or is true when at least one side is true.", true, "True or False is True.", "easy"],
    ["not True is False.", true, "not flips the value.", "easy"],
    ["True and False is True.", false, "and needs both.", "easy"],
    ["False or False is False.", true, "or needs at least one True.", "easy"],
    ["not False is True.", true, "Flipping False gives True.", "medium"],
    ["You can join two comparisons with and.", true, "age >= 10 and score >= 50 is one condition.", "medium"],
    ["Nested if is the only way to need two facts.", false, "A single and is often clearer.", "medium"],
    ["True or False and False is True.", true, "and runs before or, so this is True or False, which is True.", "hard"],
    ["not (True and False) is True.", true, "True and False is False, and not False is True.", "hard"],
    ["A condition with or is false only when both sides are false.", true, "That is the meaning of or.", "medium"],
    ["5 > 3 and 5 > 9 is True.", false, "The second comparison is false, so and is false.", "hard"],
    ["not not True is True.", true, "Two flips bring you back.", "medium"],
    ["False and anything on the right still needs to be true for and to pass.", true, "If the left of and is False, the whole and is False.", "hard"],
  ];
  for (const row of facts) out.push(tf(5, row[3], row[0], row[1], row[2]));

  const bits: [boolean, boolean][] = [
    [true, true],
    [true, false],
    [false, true],
    [false, false],
  ];
  for (const [a, b] of bits) {
    out.push(
      mcq(5, "easy", `What is ${a ? "True" : "False"} and ${b ? "True" : "False"}?`, a && b ? "True" : "False", a && b ? ["False", "None", "Error"] : ["True", "None", "Error"], "and is true only when both sides are true."),
      mcq(5, "medium", `What is ${a ? "True" : "False"} or ${b ? "True" : "False"}?`, a || b ? "True" : "False", a || b ? ["False", "None", "Error"] : ["True", "None", "Error"], "or is true when either side is true."),
    );
  }
  out.push(
    mcq(5, "easy", "What is not True?", "False", ["True", "None", "Error"], "not flips True to False."),
    mcq(5, "medium", "age = 12 and score = 40. Is age >= 10 and score >= 50 true?", "No", ["Yes", "Only the age part", "Error"], "40 is below 50, so and fails."),
    mcq(5, "hard", "What is True or False and False?", "True", ["False", "None", "Error"], "and happens first: False and False is False, then True or False is True."),
    mcq(5, "hard", "Which condition matches: at least 10 years old OR a score of at least 80?", "age >= 10 or score >= 80", ["age >= 10 and score >= 80", "age > 10 or score > 80", "not age >= 10"], "OR means either fact is enough."),
    mcq(5, "medium", "What is not (False or False)?", "True", ["False", "None", "Error"], "False or False is False. not False is True."),
    mcq(5, "easy", "Which word flips a condition?", "not", ["and", "or", "elif"], "not True is False."),
  );

  out.push(
    code(5, "easy", "Read age and score. Print Eligible when age is at least 10 AND score is at least 50. Otherwise print No.", "", "age = int(input())\nscore = int(input())\nif age >= 10 and score >= 50:\n    print(\"Eligible\")\nelse:\n    print(\"No\")", [
      { label: "Both ok", stdin: "12\n50", expected: "Eligible" },
      { label: "Low score", stdin: "12\n40", expected: "No" },
    ], "and needs both tests."),
    code(5, "easy", "Read a whole number. Print yes if it is below 0 OR above 100. Otherwise print no.", "", "n = int(input())\nif n < 0 or n > 100:\n    print(\"yes\")\nelse:\n    print(\"no\")", [
      { label: "150", stdin: "150", expected: "yes" },
      { label: "40", stdin: "40", expected: "no" },
    ], "or is true if either side is true."),
    code(5, "medium", "Read text. Print empty if it is \"\", otherwise full. Use == \"\".", "", "word = input()\nif word == \"\":\n    print(\"empty\")\nelse:\n    print(\"full\")", [
      { label: "Blank line", stdin: "\n", expected: "empty" },
      { label: "Hi", stdin: "Hi", expected: "full" },
    ], "An empty line is an empty string."),
    code(5, "medium", "Read two numbers. Print both if the first is smaller AND the second is even. Otherwise print no.", "", "a = int(input())\nb = int(input())\nif a < b and b % 2 == 0:\n    print(\"both\")\nelse:\n    print(\"no\")", [
      { label: "2 and 4", stdin: "2\n4", expected: "both" },
      { label: "2 and 5", stdin: "2\n5", expected: "no" },
    ], "Even means remainder 0."),
    code(5, "medium", "Read a mark. Print retake if it is below 40. Use not (mark >= 40).", "", "mark = int(input())\nif not (mark >= 40):\n    print(\"retake\")\nelse:\n    print(\"ok\")", [
      { label: "39", stdin: "39", expected: "retake" },
      { label: "40", stdin: "40", expected: "ok" },
    ], "not flips the comparison."),
    code(5, "hard", "Read age. Print ticket if age is under 12 OR 60 or over. Otherwise print full.", "", "age = int(input())\nif age < 12 or age >= 60:\n    print(\"ticket\")\nelse:\n    print(\"full\")", [
      { label: "10", stdin: "10", expected: "ticket" },
      { label: "30", stdin: "30", expected: "full" },
      { label: "60", stdin: "60", expected: "ticket" },
    ], "Either age group gets a ticket."),
    code(5, "hard", "Read two whole numbers. Print inside if the first is between them exclusively? Wait: print yes when n is from 1 to 10 inclusive.", "", "n = int(input())\nif n >= 1 and n <= 10:\n    print(\"yes\")\nelse:\n    print(\"no\")", [
      { label: "1", stdin: "1", expected: "yes" },
      { label: "11", stdin: "11", expected: "no" },
    ], "Both ends are included with >= and <=."),
    code(5, "hard", "Read a letter stored as text. Print vowel if it is a, e, or i. Otherwise print other. Only those three.", "", "ch = input()\nif ch == \"a\" or ch == \"e\" or ch == \"i\":\n    print(\"vowel\")\nelse:\n    print(\"other\")", [
      { label: "e", stdin: "e", expected: "vowel" },
      { label: "b", stdin: "b", expected: "other" },
    ], "Chain or for several exact matches."),
    code(5, "easy", "Read a whole number. Print stop if it is 0. Use not n if you like, or == 0.", "", "n = int(input())\nif n == 0:\n    print(\"stop\")\nelse:\n    print(\"go\")", [
      { label: "0", stdin: "0", expected: "stop" },
      { label: "2", stdin: "2", expected: "go" },
    ], "Zero is the stop value."),
    code(5, "medium", "Read sunny as yes or no, and warm as yes or no. Print out only when both are yes.", "", "sunny = input()\nwarm = input()\nif sunny == \"yes\" and warm == \"yes\":\n    print(\"out\")\nelse:\n    print(\"in\")", [
      { label: "Both", stdin: "yes\nyes", expected: "out" },
      { label: "One", stdin: "yes\nno", expected: "in" },
    ], "and requires both answers to be yes."),
  );
  return out;
}

function lesson6(): PracticeItem[] {
  const out: PracticeItem[] = [];
  const facts: [string, boolean, string, PracticeLevel][] = [
    ["A for loop repeats a block.", true, "The block runs once per item.", "easy"],
    ["range(5) includes 5.", false, "range(5) is 0, 1, 2, 3, 4.", "easy"],
    ["range(1, 4) is 1, 2, 3.", true, "It stops just before the end.", "easy"],
    ["The loop variable takes each value in turn.", true, "for i in range(3) sets i to 0, then 1, then 2.", "easy"],
    ["A while loop can run forever if its condition never becomes false.", true, "Something inside must change.", "easy"],
    ["range(1, 6) prints five numbers if you print each one.", true, "1, 2, 3, 4, 5.", "medium"],
    ["range(2, 9, 2) is the even numbers 2, 4, 6, 8.", true, "The third value is the step.", "medium"],
    ["for i in range(3): print(i) prints 1 2 3.", false, "It prints 0, 1 and 2.", "medium"],
    ["You can count down with a negative step.", true, "range(3, 0, -1) is 3, 2, 1.", "medium"],
    ["while True: with no break never ends.", true, "That is an infinite loop.", "hard"],
    ["The name i is required. No other loop name works.", false, "for n in range(3) is fine.", "medium"],
    ["range(0) produces no numbers.", true, "The start is already at the stop.", "hard"],
    ["A loop body that is not indented is a syntax error.", true, "The body must be indented.", "easy"],
    ["break leaves the loop early.", true, "The lines after the loop then run.", "hard"],
  ];
  for (const row of facts) out.push(tf(6, row[3], row[0], row[1], row[2]));

  const ranges: [string, string, PracticeLevel][] = [
    ["range(3)", "0 1 2", "easy"],
    ["range(1, 4)", "1 2 3", "easy"],
    ["range(5)", "0 1 2 3 4", "easy"],
    ["range(2, 6)", "2 3 4 5", "medium"],
    ["range(0, 7, 3)", "0 3 6", "medium"],
    ["range(4, 0, -1)", "4 3 2 1", "hard"],
    ["range(1, 1)", "(nothing)", "hard"],
    ["range(8, 2, -2)", "8 6 4", "hard"],
  ];
  for (const [call, shown, level] of ranges) {
    out.push(
      mcq(
        6,
        level,
        `Which numbers does ${call} produce, in order?`,
        shown,
        choices(shown, ["0 1 2", "1 2 3", "0 1 2 3 4", "1 2 3 4 5", "2 4 6 8", "4 3 2 1", "(nothing)", "Error"]),
        `${call} produces ${shown}. It stops before the end number.`,
      ),
    );
  }
  out.push(
    mcq(6, "easy", "Why do we use loops?", "To repeat work without copying lines", ["To store one value", "To define a function", "To end a program"], "A loop runs a block many times."),
    mcq(6, "medium", "What must change inside a while loop?", "Something that can make the condition false", ["The file name", "The print spelling", "Nothing"], "Otherwise it never stops."),
    mcq(6, "hard", "How many times does for i in range(2, 11, 2) run?", "5", ["11", "9", "4"], "2, 4, 6, 8, 10 is five values."),
    mcq(6, "medium", "Which loop prints 1 then 2 then 3?", "for i in range(1, 4): print(i)", ["for i in range(3): print(i)", "for i in range(1, 3): print(i)", "for i in range(4): print(i)"], "range(1, 4) stops before 4."),
    mcq(6, "easy", "range(1, 6) is used for a times table up to:", "5", ["6", "1", "4"], "The end value is not included."),
    mcq(6, "hard", "n = 3\nwhile n > 0:\n    n = n - 1\nprint(n)\n\nWhat is printed?", "0", ["3", "1", "Nothing"], "The loop ends when n is no longer greater than 0, then print runs."),
  );

  out.push(
    code(6, "easy", "Print the numbers 1, 2 and 3 on separate lines using a for loop.", "", "for i in range(1, 4):\n    print(i)", [{ label: "Output", expected: "1\n2\n3" }], "range(1, 4) stops before 4."),
    code(6, "easy", "Print Hello five times, each on its own line.", "", "for i in range(5):\n    print(\"Hello\")", [{ label: "Output", expected: "Hello\nHello\nHello\nHello\nHello" }], "range(5) runs the body 5 times."),
    code(6, "easy", "Read n and print that many stars, one per line. n will be 1 to 4.", "", "n = int(input())\nfor i in range(n):\n    print(\"*\")", [
      { label: "3", stdin: "3", expected: "*\n*\n*" },
      { label: "1", stdin: "1", expected: "*" },
    ], "The range length is n."),
    code(6, "medium", "Print the even numbers 2, 4, 6, 8 on separate lines.", "", "for i in range(2, 9, 2):\n    print(i)", [{ label: "Output", expected: "2\n4\n6\n8" }], "Step 2 walks through the evens."),
    code(6, "medium", "Read n and print the total of 1 + 2 + ... + n.", "", "n = int(input())\ntotal = 0\nfor i in range(1, n + 1):\n    total = total + i\nprint(total)", [
      { label: "3", stdin: "3", expected: "6" },
      { label: "5", stdin: "5", expected: "15" },
    ], "Add each i into total. The end of range is n + 1."),
    code(6, "medium", "Print a countdown 3, 2, 1 on separate lines.", "", "for i in range(3, 0, -1):\n    print(i)", [{ label: "Output", expected: "3\n2\n1" }], "A negative step counts down and stops before 0."),
    code(6, "hard", "Read n and print its times table from 1 to 4, like 2 x 1 = 2.", "", "n = int(input())\nfor i in range(1, 5):\n    print(n, \"x\", i, \"=\", n * i)", [
      { label: "2", stdin: "2", expected: "2 x 1 = 2\n2 x 2 = 4\n2 x 3 = 6\n2 x 4 = 8" },
    ], "The sentence is built inside the loop."),
    code(6, "hard", "Use a while loop to print 1 then 2. Start at 1 and stop after 2.", "", "n = 1\nwhile n <= 2:\n    print(n)\n    n = n + 1", [{ label: "Output", expected: "1\n2" }], "Increase n or the loop never ends."),
    code(6, "hard", "Read n and print that many copies of Go on one line separated by spaces. No extra space at the end is required, but a normal print of values is fine if you build them one per line instead. Print one Go per line.", "", "n = int(input())\nfor i in range(n):\n    print(\"Go\")", [
      { label: "2", stdin: "2", expected: "Go\nGo" },
      { label: "4", stdin: "4", expected: "Go\nGo\nGo\nGo" },
    ], "One print per trip around the loop."),
    code(6, "medium", "Print the numbers 0, 1, 2, 3 on separate lines.", "", "for i in range(4):\n    print(i)", [{ label: "Output", expected: "0\n1\n2\n3" }], "range(4) starts at 0."),
  );
  return out;
}

function lesson7(): PracticeItem[] {
  const out: PracticeItem[] = [];
  const facts: [string, boolean, string, PracticeLevel][] = [
    ["The first character of a string is at index 0.", true, '"Python"[0] is P.', "easy"],
    ["len(\"Python\") is 6.", true, "len counts every character.", "easy"],
    ["The last index of a 6-letter word is 6.", false, "The last index is 5.", "easy"],
    [".upper() returns a new uppercase string.", true, "It does not change the original unless you store it back.", "easy"],
    [".lower() makes letters lowercase.", true, '"Py".lower() is py.', "easy"],
    [".strip() removes spaces at both ends.", true, '" hi ".strip() is hi.', "medium"],
    ["You can join strings with +.", true, '"cat" + "s" is cats.', "easy"],
    ["\"hi\"[2] is i.", false, "Indexes are 0 and 1 only. Index 2 is an error.", "medium"],
    [".replace(\"a\", \"b\") swaps every a for b in the result.", true, '"aba".replace("a", "b") is bbb.', "medium"],
    ["Strings and lists both start counting at 0.", true, "The first item is index 0.", "medium"],
    ["len(\"\") is 1.", false, "An empty string has length 0.", "hard"],
    ["s[0] = \"A\" changes the first letter of a string.", false, "Strings cannot be changed in place. Build a new one.", "hard"],
    ["\"A\" + \"B\" is AB.", true, "+ joins text.", "easy"],
    ["Spaces count toward len().", true, 'len("a b") is 3.', "hard"],
  ];
  for (const row of facts) out.push(tf(7, row[3], row[0], row[1], row[2]));

  const words = ["Python", "Code", "Hi", "Mentr", "Loop", "Ada"];
  for (const word of words) {
    out.push(
      mcq(7, "easy", `What is "${word}"[0]?`, word[0], [word[1] ?? word[0], String(word.length), "Error"], "Index 0 is the first character."),
      mcq(7, word.length > 4 ? "medium" : "easy", `What is len("${word}")?`, String(word.length), [String(word.length - 1), String(word.length + 1), "0"], "len counts every character, starting from 1, not from 0."),
    );
  }
  out.push(
    mcq(7, "medium", 'What is "Hello".upper()?', "HELLO", ["Hello", "hello", "Error"], "upper() capitalises every letter."),
    mcq(7, "medium", 'What is "  py  ".strip()?', "py", ["  py", "py  ", "PY"], "strip() removes spaces at both ends."),
    mcq(7, "hard", 'What is "cat".replace("a", "u")?', "cut", ["cat", "cutt", "uat"], "The a is replaced by u."),
    mcq(7, "hard", 'What is "ab" + "cd"?', "abcd", ["ab cd", "ab+cd", "Error"], "+ joins strings with nothing extra in between."),
  );

  out.push(
    code(7, "easy", "Read one word and print its first character.", "", "word = input()\nprint(word[0])", [
      { label: "Python", stdin: "Python", expected: "P" },
      { label: "Ada", stdin: "Ada", expected: "A" },
    ], "Index 0 is the first letter."),
    code(7, "easy", "Read one word and print its length.", "", "word = input()\nprint(len(word))", [
      { label: "Hi", stdin: "Hi", expected: "2" },
      { label: "Code", stdin: "Code", expected: "4" },
    ], "len() counts characters."),
    code(7, "easy", "Read one word and print it in uppercase.", "", "word = input()\nprint(word.upper())", [
      { label: "py", stdin: "py", expected: "PY" },
      { label: "Ada", stdin: "Ada", expected: "ADA" },
    ], "Call .upper() on the text."),
    code(7, "medium", "Read one word and print it in lowercase.", "", "word = input()\nprint(word.lower())", [
      { label: "PY", stdin: "PY", expected: "py" },
      { label: "Go", stdin: "Go", expected: "go" },
    ], ".lower() makes small letters."),
    code(7, "medium", "Read a line that may have spaces at the ends. Print it stripped.", "", "word = input()\nprint(word.strip())", [
      { label: "Spaces", stdin: "  hi  ", expected: "hi" },
    ], "strip() removes only the outer spaces."),
    code(7, "medium", "Read a word and print its last character. Use index len(word) - 1.", "", "word = input()\nprint(word[len(word) - 1])", [
      { label: "cat", stdin: "cat", expected: "t" },
      { label: "A", stdin: "A", expected: "A" },
    ], "The last index is one less than the length."),
    code(7, "hard", "Read a word and replace every a with @, then print it.", "", "word = input()\nprint(word.replace(\"a\", \"@\"))", [
      { label: "cat", stdin: "cat", expected: "c@t" },
      { label: "ada", stdin: "ada", expected: "@d@" },
    ], "replace returns a new string."),
    code(7, "hard", "Read a first name and a last name. Print them joined with no space.", "", "first = input()\nlast = input()\nprint(first + last)", [
      { label: "Ada Lovelace", stdin: "Ada\nLovelace", expected: "AdaLovelace" },
    ], "+ joins text."),
    code(7, "hard", "Read a word. Print first, length, and uppercase on three lines.", "", "word = input()\nprint(word[0])\nprint(len(word))\nprint(word.upper())", [
      { label: "py", stdin: "py", expected: "p\n2\nPY" },
    ], "Three facts, three prints."),
    code(7, "medium", "Read text and print yes if its length is greater than 3, otherwise no.", "", "word = input()\nif len(word) > 3:\n    print(\"yes\")\nelse:\n    print(\"no\")", [
      { label: "Code", stdin: "Code", expected: "yes" },
      { label: "Hi", stdin: "Hi", expected: "no" },
    ], "len() gives a number you can compare."),
  );
  return out;
}

function lesson8(): PracticeItem[] {
  const out: PracticeItem[] = [];
  const facts: [string, boolean, string, PracticeLevel][] = [
    ["A list keeps several values in order under one name.", true, "games = [\"Chess\", \"Go\"] is a list of two strings.", "easy"],
    ["The first item is at index 0.", true, "games[0] is the first game.", "easy"],
    ["append() adds an item at the end.", true, "The length grows by one.", "easy"],
    ["On a 3-item list, index 3 is the last item.", false, "The last index is 2. Index 3 is an error.", "easy"],
    ["remove() deletes the first matching value.", true, "It removes by value, not by index.", "medium"],
    ["len() works on lists.", true, "len([1, 2, 2]) is 3.", "easy"],
    ["You can change games[0] to a new value.", true, "Lists can be updated in place.", "medium"],
    ["for item in games: visits every item.", true, "You do not need the index for a simple walk.", "medium"],
    ["[] is a list with one empty item.", false, "[] is an empty list. Its length is 0.", "medium"],
    ["append() returns the new list and you must store it.", false, "append() changes the list itself. Just call it.", "hard"],
    ["A list can hold numbers and text together.", true, "[1, \"two\"] is allowed.", "hard"],
    ["games[-1] is the last item.", true, "Negative indexes count from the end.", "hard"],
    ["Two lists with the same items are stored as one shared box if you write b = a.", true, "b = a shares the list. b = a.copy() makes another.", "hard"],
    ["remove() on a missing value is fine and does nothing.", false, "It raises ValueError.", "hard"],
  ];
  for (const row of facts) out.push(tf(8, row[3], row[0], row[1], row[2]));

  out.push(
    mcq(8, "easy", 'games = ["Chess", "Go"]\nWhat is games[0]?', "Chess", ["Go", "0", "Error"], "Index 0 is the first item."),
    mcq(8, "easy", 'games = ["Chess", "Go"]\ngames.append("Uno")\nWhat is len(games)?', "3", ["2", "4", "Uno"], "append adds one item."),
    mcq(8, "medium", 'nums = [4, 8, 1]\nWhat is nums[-1]?', "1", ["4", "8", "Error"], "-1 means the last item."),
    mcq(8, "medium", 'pets = ["cat", "dog", "cat"]\npets.remove("cat")\nWhat is left first?', "dog", ["cat", "an empty list", "Error"], "remove deletes the first match only. dog is now first."),
    mcq(8, "hard", "nums = [1, 2, 3]\nnums[1] = 9\nWhat is nums?", "[1, 9, 3]", ["[9, 2, 3]", "[1, 2, 9]", "Error"], "Index 1 is the second item."),
    mcq(8, "easy", "Which creates an empty list?", "[]", ["[None]", '["empty"]', '""'], "[] has length 0."),
    mcq(8, "medium", "Which walks every name?", "for name in names:", ["for name of names:", "foreach names as name:", "loop names:"], "Python uses for item in list."),
    mcq(8, "hard", "a = [1, 2]\nb = a\nb.append(3)\nWhat is len(a)?", "3", ["2", "1", "Error"], "b and a are the same list."),
    mcq(8, "medium", 'What is len(["a", "b", "c", "d"])?', "4", ["3", "5", "0"], "There are four items."),
    mcq(8, "hard", "Which index is illegal for [10, 20, 30]?", "3", ["0", "2", "-1"], "Valid indexes are 0, 1, 2 and -1."),
    mcq(8, "easy", "append goes:", "At the end", ["At the start", "In the middle only", "It sorts the list"], "The new item is last."),
    mcq(8, "medium", 'marks = [10, 20]\nprint(marks[0] + marks[1]) shows', "30", ["1020", "10", "Error"], "The items are numbers, so + adds them."),
  );

  out.push(
    code(8, "easy", "Start with games = [\"Chess\"]. Append Go. Print the length.", "", "games = [\"Chess\"]\ngames.append(\"Go\")\nprint(len(games))", [{ label: "Length", expected: "2" }], "append then len."),
    code(8, "easy", "Print the first item of [\"red\", \"blue\"].", "", "colors = [\"red\", \"blue\"]\nprint(colors[0])", [{ label: "Output", expected: "red" }], "Index 0."),
    code(8, "easy", "Print every item of [\"A\", \"B\", \"C\"] on its own line.", "", "letters = [\"A\", \"B\", \"C\"]\nfor letter in letters:\n    print(letter)", [{ label: "Output", expected: "A\nB\nC" }], "A for loop visits each item."),
    code(8, "medium", "Read one word, append it to [\"milk\"], and print the length.", "", "bag = [\"milk\"]\nbag.append(input())\nprint(len(bag))", [
      { label: "bread", stdin: "bread", expected: "2" },
    ], "The typed word becomes the second item."),
    code(8, "medium", "nums = [4, 1, 7]. Print the last item using index -1.", "", "nums = [4, 1, 7]\nprint(nums[-1])", [{ label: "Output", expected: "7" }], "-1 is the end."),
    code(8, "medium", "pets = [\"cat\", \"dog\"]. Remove cat and print what remains, one per line.", "", "pets = [\"cat\", \"dog\"]\npets.remove(\"cat\")\nfor pet in pets:\n    print(pet)", [{ label: "Output", expected: "dog" }], "remove deletes by value."),
    code(8, "hard", "Read three whole numbers into a list and print their sum.", "", "nums = [int(input()), int(input()), int(input())]\nprint(nums[0] + nums[1] + nums[2])", [
      { label: "1 2 3", stdin: "1\n2\n3", expected: "6" },
      { label: "4 0 1", stdin: "4\n0\n1", expected: "5" },
    ], "Add the three indexes."),
    code(8, "hard", "Change index 0 of [1, 2, 3] to 9 and print the first item.", "", "nums = [1, 2, 3]\nnums[0] = 9\nprint(nums[0])", [{ label: "Output", expected: "9" }], "Lists can be updated."),
    code(8, "hard", "Print how many items are in [\"a\", \"a\", \"b\"] after removing one a.", "", "items = [\"a\", \"a\", \"b\"]\nitems.remove(\"a\")\nprint(len(items))", [{ label: "Output", expected: "2" }], "Only the first a is removed."),
    code(8, "medium", "Print the second item of [\"one\", \"two\", \"three\"].", "", "words = [\"one\", \"two\", \"three\"]\nprint(words[1])", [{ label: "Output", expected: "two" }], "The second item is index 1."),
  );
  return out;
}

function lesson9(): PracticeItem[] {
  const out: PracticeItem[] = [];
  const facts: [string, boolean, string, PracticeLevel][] = [
    ["def starts a function.", true, "def greet(): creates the command greet.", "easy"],
    ["A function runs as soon as you define it.", false, "It runs when you call it.", "easy"],
    ["Parameters are the names in the definition.", true, "def add(a, b) has parameters a and b.", "easy"],
    ["Arguments are the values you pass in the call.", true, "add(2, 3) passes 2 and 3.", "easy"],
    ["return sends a value back to the caller.", true, "The caller can store or print it.", "easy"],
    ["print() and return do the same thing.", false, "print shows a value. return hands it back.", "medium"],
    ["A function can be called more than once.", true, "That is why we write them.", "easy"],
    ["Indentation marks the body of a function.", true, "The body sits under def.", "medium"],
    ["A function must return something.", false, "A function can just print, or do nothing.", "medium"],
    ["You can call one function from another.", true, "Functions are building blocks.", "medium"],
    ["return a + b also prints a + b automatically.", false, "return does not print. You print the result yourself.", "hard"],
    ["The names inside a function can match names outside.", true, "The parameter is its own name while the function runs.", "hard"],
    ["Forgetting the colon after def is a syntax error.", true, "def greet() needs the colon.", "medium"],
    ["A function with two parameters can be called with one argument.", false, "You must pass the number of values it expects, unless it has defaults.", "hard"],
  ];
  for (const row of facts) out.push(tf(9, row[3], row[0], row[1], row[2]));

  out.push(
    mcq(9, "easy", "Which keyword defines a function?", "def", ["func", "function", "define"], "Python uses def."),
    mcq(9, "easy", "When does the body of a function run?", "When you call the function", ["When Python reads def", "At the end of the file only", "Never"], "def only saves the function."),
    mcq(9, "medium", "def add(a, b):\n    return a + b\nprint(add(2, 5))\n\nWhat is printed?", "7", ["2", "5", "Nothing"], "2 and 5 are added and the result is printed."),
    mcq(9, "medium", "What is a parameter?", "A name in the function definition", ["The print output", "A type of loop", "A comment"], "a and b in def add(a, b) are parameters."),
    mcq(9, "hard", "def f():\n    return 3\nprint(f() + 1)\n\nWhat is printed?", "4", ["3", "31", "Error"], "The returned 3 is used in the addition."),
    mcq(9, "hard", "def hi():\n    print(\"Hi\")\n\nHow many times is Hi printed if you never call hi?", "0", ["1", "2", "Error"], "Defining a function does not run it."),
    mcq(9, "medium", "Which call matches def area(w, h)?", "area(3, 4)", ["area(3)", "area()", "area 3, 4"], "Two parameters need two arguments."),
    mcq(9, "easy", "return is used to:", "Hand a value back", ["End the whole program always", "Start a loop", "Write a comment"], "The caller receives the returned value."),
    mcq(9, "hard", "def double(n):\n    print(n * 2)\nx = double(4)\nprint(x)\n\nWhat is the last line?", "None", ["8", "4", "Error"], "There is no return, so the function gives back None. 8 was only printed."),
    mcq(9, "medium", "Which line is a valid header?", "def greet(name):", ["def greet(name)", "function greet(name):", "def greet: name"], "def, the name, parameters, then a colon."),
    mcq(9, "easy", "Calling greet() after def greet(): is:", "How you run it", ["How you delete it", "A comment", "Illegal"], "Parentheses call the function."),
    mcq(9, "hard", "def add(a, b=1):\n    return a + b\nWhat is add(5)?", "6", ["5", "1", "Error"], "b has a default of 1."),
  );

  out.push(
    code(9, "easy", "Write double(n) that returns n * 2. Print double of the input number.", "", "def double(n):\n    return n * 2\nprint(double(int(input())))", [
      { label: "4", stdin: "4", expected: "8" },
      { label: "0", stdin: "0", expected: "0" },
    ], "return the product. print the call."),
    code(9, "easy", "Write greet() that prints Hello. Call it once.", "", "def greet():\n    print(\"Hello\")\ngreet()", [{ label: "Output", expected: "Hello" }], "Call the function after defining it."),
    code(9, "easy", "Write add(a, b) that returns the sum. Print add of the two input numbers.", "", "def add(a, b):\n    return a + b\nprint(add(int(input()), int(input())))", [
      { label: "2 3", stdin: "2\n3", expected: "5" },
    ], "Two parameters, one return."),
    code(9, "medium", "Write is_even(n) that returns True or False. Print the result for the input.", "", "def is_even(n):\n    return n % 2 == 0\nprint(is_even(int(input())))", [
      { label: "4", stdin: "4", expected: "True" },
      { label: "5", stdin: "5", expected: "False" },
    ], "Return the comparison itself."),
    code(9, "medium", "Write full_name(first, last) that returns the two names with a space. Print it.", "", "def full_name(first, last):\n    return first + \" \" + last\nprint(full_name(input(), input()))", [
      { label: "Ada Lovelace", stdin: "Ada\nLovelace", expected: "Ada Lovelace" },
    ], "Join with a space in the middle."),
    code(9, "medium", "Write biggest(a, b) that returns the larger number. Print it.", "", "def biggest(a, b):\n    if a > b:\n        return a\n    return b\nprint(biggest(int(input()), int(input())))", [
      { label: "3 9", stdin: "3\n9", expected: "9" },
      { label: "8 2", stdin: "8\n2", expected: "8" },
    ], "Return as soon as you know the answer."),
    code(9, "hard", "Write repeat(word, n) that prints the word n times, one per line. n is the input after the word.", "", "def repeat(word, n):\n    for i in range(n):\n        print(word)\nrepeat(input(), int(input()))", [
      { label: "Go 2", stdin: "Go\n2", expected: "Go\nGo" },
    ], "The loop belongs inside the function."),
    code(9, "hard", "Write clamp(n) that returns 0 if n is below 0, 10 if n is above 10, otherwise n. Print it.", "", "def clamp(n):\n    if n < 0:\n        return 0\n    if n > 10:\n        return 10\n    return n\nprint(clamp(int(input())))", [
      { label: "-3", stdin: "-3", expected: "0" },
      { label: "4", stdin: "4", expected: "4" },
      { label: "15", stdin: "15", expected: "10" },
    ], "Three returns cover the three ranges."),
    code(9, "hard", "Write score(correct, total) that returns correct * 100 // total. Print it for two inputs.", "", "def score(correct, total):\n    return correct * 100 // total\nprint(score(int(input()), int(input())))", [
      { label: "8 of 10", stdin: "8\n10", expected: "80" },
      { label: "1 of 2", stdin: "1\n2", expected: "50" },
    ], "// keeps the result a whole number."),
    code(9, "medium", "Write label(n) that returns even or odd. Print it.", "", "def label(n):\n    if n % 2 == 0:\n        return \"even\"\n    return \"odd\"\nprint(label(int(input())))", [
      { label: "6", stdin: "6", expected: "even" },
      { label: "7", stdin: "7", expected: "odd" },
    ], "Return text, then print the call."),
  );
  return out;
}

function lesson10(): PracticeItem[] {
  const out: PracticeItem[] = [];
  const facts: [string, boolean, string, PracticeLevel][] = [
    ["A quiz game can store the score in a variable.", true, "Start at 0 and add 1 for each correct answer.", "easy"],
    ["A list is a good place to keep several questions.", true, "One name holds every question, in order.", "easy"],
    ["You should write the whole game before testing any of it.", false, "Get one question working, then add the loop.", "easy"],
    ["input() is how the player answers.", true, "Compare that text with the correct answer.", "easy"],
    ["A function can hold the welcome message.", true, "Naming the steps keeps the game readable.", "medium"],
    ["== is the right way to check an exact answer.", true, "Remember that capitals must match too.", "easy"],
    ["A for loop can ask every question in a list.", true, "The same check runs once per question.", "medium"],
    ["The final message can depend on the score with if.", true, "High scores and low scores can print different lines.", "medium"],
    ["len(questions) tells you how many questions you have.", true, "Useful for the final score line.", "medium"],
    ["return is required in every quiz program.", false, "A small game can work with print and variables only.", "hard"],
    ["You can keep questions and answers in two lists of the same length.", true, "Index i lines up a question with its answer.", "hard"],
    ["Planning the steps in English first is a waste of time.", false, "A short plan makes the code easier to write.", "easy"],
    ["strip() can forgive extra spaces in an answer.", true, "reply.strip() removes spaces the player typed by accident.", "hard"],
    ["A score should usually start at 1.", false, "Start at 0 so wrong answers do not invent a point.", "medium"],
  ];
  for (const row of facts) out.push(tf(10, row[3], row[0], row[1], row[2]));

  out.push(
    mcq(10, "easy", "Where should a quiz score start?", "0", ["1", "10", "The number of questions"], "Add 1 only when an answer is right."),
    mcq(10, "easy", "Which comparison checks an exact answer?", 'reply == "yes"', ['reply = "yes"', 'reply != "yes" always', "reply + yes"], "== compares. = stores."),
    mcq(10, "medium", "Two lists, questions and answers, line up when:", "They use the same index", ["They are the same word", "They are both empty", "They are printed first"], "questions[i] matches answers[i]."),
    mcq(10, "medium", "A good first step for the final project is:", "Make one question work", ["Write 100 questions", "Add colours", "Skip testing"], "Then wrap that working question in a loop."),
    mcq(10, "hard", "score / len(questions) * 100 is a percent when:", "You use the final score and the number of questions", ["You use only the last answer", "You never update score", "len is 0"], "Do not divide by zero. A quiz should have at least one question."),
    mcq(10, "hard", "Why call reply.strip() before comparing?", "To ignore extra spaces", ["To translate the answer", "To delete the question", "To add a point"], "Players often add a stray space."),
    mcq(10, "easy", "Which tool asks the player to type?", "input()", ["print()", "len()", "range()"], "input() waits for an answer."),
    mcq(10, "medium", "if score == len(questions): is a way to detect:", "A perfect score", ["The first question", "An empty name", "A syntax error"], "Every question was answered correctly."),
    mcq(10, "easy", "print(\"Welcome\") belongs at:", "The start", ["Inside every wrong answer only", "After the program has ended", "Inside a comment"], "Greet the player before the questions."),
    mcq(10, "hard", "Which structure repeats the questions?", "A for loop over the list", ["A single if", "One variable", "A comment"], "The loop visits each question."),
    mcq(10, "medium", "A result message like Great or Try again is chosen with:", "if / else on the score", ["A comment", "sep", "type()"], "The score decides the branch."),
    mcq(10, "hard", "def ask(question, answer): is useful because:", "The same steps can check every question", ["Python requires every program to have ask", "It deletes the score", "It stops loops"], "Functions keep repeated steps in one place."),
  );

  out.push(
    code(10, "easy", "Read a name and print Welcome followed by a space and the name.", "", "name = input()\nprint(\"Welcome\", name)", [
      { label: "Ada", stdin: "Ada", expected: "Welcome Ada" },
    ], "A quiz starts with a greeting."),
    code(10, "easy", "Read an answer. If it is yes, print 1, otherwise print 0.", "", "reply = input()\nif reply == \"yes\":\n    print(1)\nelse:\n    print(0)", [
      { label: "yes", stdin: "yes", expected: "1" },
      { label: "no", stdin: "no", expected: "0" },
    ], "This is one question's score."),
    code(10, "medium", "Start score at 0. Read two answers. Add 1 for each that is exactly a. Print the score.", "", "score = 0\nif input() == \"a\":\n    score = score + 1\nif input() == \"a\":\n    score = score + 1\nprint(score)", [
      { label: "Both", stdin: "a\na", expected: "2" },
      { label: "One", stdin: "a\nb", expected: "1" },
    ], "Two separate checks share one score."),
    code(10, "medium", "questions has 2 items. Print how many questions, using len.", "", "questions = [\"Q1\", \"Q2\"]\nprint(len(questions))", [{ label: "Count", expected: "2" }], "len tells you the length of the quiz."),
    code(10, "medium", "Read a score and a total. If they are equal, print Perfect, otherwise Done.", "", "score = int(input())\ntotal = int(input())\nif score == total:\n    print(\"Perfect\")\nelse:\n    print(\"Done\")", [
      { label: "Perfect", stdin: "3\n3", expected: "Perfect" },
      { label: "Not", stdin: "1\n3", expected: "Done" },
    ], "A full score matches the number of questions."),
    code(10, "hard", "Read one answer and strip spaces. Print ok if it is cat.", "", "reply = input().strip()\nif reply == \"cat\":\n    print(\"ok\")\nelse:\n    print(\"no\")", [
      { label: "Spaces", stdin: "  cat  ", expected: "ok" },
      { label: "Wrong", stdin: "dog", expected: "no" },
    ], "strip() forgives extra spaces."),
    code(10, "hard", "Write ask(question) that prints the question and returns the reply. Use it once and print the reply.", "", "def ask(question):\n    print(question)\n    return input()\nprint(ask(\"Ready\"))", [
      { label: "Go", stdin: "Go", expected: "Ready\nGo" },
    ], "Print the prompt, return what the player types, then print that return value."),
    code(10, "hard", "Walk the list [\"a\", \"b\"] and print each item with its index starting at 0, like 0 a.", "", "items = [\"a\", \"b\"]\nfor i in range(len(items)):\n    print(i, items[i])", [{ label: "Output", expected: "0 a\n1 b" }], "range(len(...)) gives the indexes."),
    code(10, "medium", "Read a score. Print Great if it is 2 or more, otherwise Try again.", "", "score = int(input())\nif score >= 2:\n    print(\"Great\")\nelse:\n    print(\"Try again\")", [
      { label: "2", stdin: "2", expected: "Great" },
      { label: "1", stdin: "1", expected: "Try again" },
    ], "The final line of a quiz depends on the score."),
    code(10, "hard", "Add the numbers in [2, 5, 3] with a loop and print the total.", "", "nums = [2, 5, 3]\ntotal = 0\nfor n in nums:\n    total = total + n\nprint(total)", [{ label: "Sum", expected: "10" }], "A running total works for scores too."),
  );
  return out;
}

function topUp(lesson: number): PracticeItem[] {
  if (lesson === 1) {
    return [
      mcq(1, "medium", 'What does print("A\\nB") show?', "A on one line, B on the next", ["A\\nB as typed", "AB", "An error"], "\\n inside a string starts a new line."),
      mcq(1, "hard", 'Which part of this line runs?\n\nprint("go")  # print("stop")', "go", ["stop", "go then stop", "Nothing"], "Everything after # on that line is a comment."),
    ];
  }
  if (lesson === 3) {
    return [
      tf(3, "easy", "9 % 9 is 0.", true, "9 divides 9 exactly, so there is no remainder."),
      tf(3, "medium", 'int("08") is an error in Python 3.', false, "Python 3 reads that text as the number 8."),
      tf(3, "hard", "0.5 + 0.5 prints as 1.0.", true, "Both values are floats, so the sum stays a float."),
      mcq(3, "easy", "What is 100 // 30?", "3", ["3.33", "4", "30"], "Floor division drops the fraction. 30 fits into 100 three times."),
      mcq(3, "medium", "What does print(float(4)) show?", "4.0", ["4", "float", "Error"], "float(4) is the decimal 4.0."),
      mcq(3, "hard", "What is 10 - 2 * 3?", "4", ["24", "16", "8"], "Multiplication happens first: 10 - 6 is 4."),
    ];
  }
  if (lesson === 4) {
    return [
      tf(4, "easy", "The words else if are valid Python.", false, "Python spells that idea elif."),
      tf(4, "easy", "A colon is required at the end of an if line.", true, "if score >= 50: needs the colon before the block."),
      tf(4, "medium", "You can put an if inside an else block.", true, "That is a nested decision."),
      tf(4, "medium", "if n: runs its block when n is 0.", false, "0 counts as false, so the block is skipped."),
      tf(4, "hard", "A chain can contain more than one elif.", true, "Check the most specific case first, then the next."),
      mcq(4, "easy", 'n = 5\nif n > 0:\n    print("yes")\nelse:\n    print("no")\n\nWhat is printed?', "yes", ["no", "5", "Nothing"], "5 is greater than 0."),
      mcq(4, "medium", 'n = 0\nif n > 0:\n    print("yes")\nelse:\n    print("no")\n\nWhat is printed?', "no", ["yes", "0", "Nothing"], "0 is not greater than 0."),
      mcq(4, "medium", 'mark = 60\nif mark >= 80:\n    print("A")\nelif mark >= 60:\n    print("B")\nelse:\n    print("C")\n\nWhat is printed?', "B", ["A", "C", "A and B"], "60 fails the first test and passes the second."),
      mcq(4, "hard", "Which line is a syntax error?", 'if x == 1 print(x)', ["if x == 1:", "else:", "elif x == 2:"], "The condition line needs a colon."),
      mcq(4, "hard", 'temp = -1\nif temp >= 0:\n    print("nonneg")\nelse:\n    print("neg")\n\nWhat is printed?', "neg", ["nonneg", "-1", "Nothing"], "A negative number fails >= 0."),
    ];
  }
  if (lesson === 5) {
    const rows: [string, string, PracticeLevel, string][] = [
      ["5 > 2 and 3 > 1", "True", "easy", "Both comparisons are true."],
      ["5 > 2 and 3 > 9", "False", "easy", "The second comparison is false, so and fails."],
      ["1 == 1 or 2 == 3", "True", "easy", "The first side is enough for or."],
      ["0 == 0 and 1 == 2", "False", "easy", "and fails because 1 is not 2."],
      ["1 == 2 or 3 == 4", "False", "medium", "Both sides are false."],
      ["not (4 > 10)", "True", "medium", "4 > 10 is false, and not flips it."],
      ["8 >= 8 and 8 <= 8", "True", "medium", "8 is equal to 8 on both sides."],
      ['"hi" != "Hi"', "True", "medium", "Capitals count. hi and Hi are different."],
      ["10 != 10 or 1 == 1", "True", "hard", "The first side is false, but the second side saves the or."],
      ["False or not False", "True", "hard", "not False is True."],
      ["3 > 1 and not (2 == 2)", "False", "hard", "not (2 == 2) is false, so and fails."],
      ['"a" == "a" and "a" == "A"', "False", "hard", "The second comparison fails because of the capital A."],
    ];
    return rows.map(([expr, ans, level, why]) =>
      mcq(5, level, `What is ${expr}?`, ans, choices(ans, ["True", "False", "None", "Error"]), why),
    );
  }
  if (lesson === 6) {
    const ranges: [string, string, PracticeLevel][] = [
      ["range(6)", "0 1 2 3 4 5", "easy"],
      ["range(2, 5)", "2 3 4", "easy"],
      ["range(10, 12)", "10 11", "easy"],
      ["range(1, 8, 2)", "1 3 5 7", "medium"],
      ["range(1, 10, 3)", "1 4 7", "medium"],
      ["range(0, 0)", "(nothing)", "medium"],
      ["range(5, 0, -1)", "5 4 3 2 1", "hard"],
      ["range(6, 1, -2)", "6 4 2", "hard"],
    ];
    return [
      ...ranges.map(([call, shown, level]) =>
        mcq(
          6,
          level,
          `Which numbers does ${call} produce?`,
          shown,
          choices(shown, ["0 1 2 3 4 5", "2 3 4", "1 3 5 7", "1 4 7", "10 11", "5 4 3 2 1", "6 4 2", "(nothing)"]),
          `${call} produces ${shown}.`,
        ),
      ),
      tf(6, "easy", "A loop body can contain an if.", true, "You can decide inside each trip around the loop."),
      tf(6, "medium", "range(1, 5, 1) produces the same numbers as range(1, 5).", true, "The step defaults to 1."),
      tf(6, "medium", "A while loop checks its condition before every trip, including the first.", true, "If the condition starts false, the body never runs."),
      tf(6, "hard", "A running total inside a loop should usually start at 0.", true, "Then each trip adds the next number."),
    ];
  }
  if (lesson === 7) {
    const rows: [string, string, PracticeLevel, string][] = [
      ['"pizza"[1]', "i", "easy", "Index 1 is the second character."],
      ['len("a b")', "3", "easy", "The space counts, so the length is 3."],
      ['"Hello".lower()', "hello", "easy", "lower() makes every letter small."],
      ['len("Hi!")', "3", "easy", "The ! counts as a character."],
      ['"pizza"[-1]', "a", "medium", "Index -1 is the last character."],
      ['"ab".replace("b", "B")', "aB", "medium", "Only the b changes."],
      ['"  ok".strip()', "ok", "medium", "strip() removes the spaces at the front."],
      ['"x" * 3', "xxx", "medium", "Multiplying a string repeats it."],
      ['"code"[2]', "d", "hard", "c is 0, o is 1, d is 2."],
      ['"ab"[0] + "ab"[1]', "ab", "hard", "The two characters are joined back together."],
    ];
    return rows.map(([expr, ans, level, why]) =>
      mcq(7, level, `What is ${expr}?`, ans, choices(ans, ["i", "a", "p", "z", "3", "2", "hello", "HELLO", "aB", "ok", "xxx", "d", "ab", "Error"]), why),
    );
  }
  if (lesson === 8) {
    return [
      tf(8, "easy", "A list is written with square brackets.", true, '[1, 2, 3] is a list. (1, 2, 3) is a tuple.'),
      tf(8, "medium", "append() puts the new item at the start.", false, "append() adds at the end."),
      tf(8, "hard", "del games[0] removes the first item.", true, "del removes by index. remove() removes by value."),
      tf(8, "hard", "A for loop over a list gives you the index, not the item.", false, "for item in games: gives you each item. Use range(len(games)) if you need indexes."),
      mcq(8, "easy", "nums = [10, 20, 30]\nWhat is nums[2]?", "30", ["10", "20", "Error"], "Index 2 is the third item."),
      mcq(8, "easy", "What is len([])?", "0", ["1", "None", "Error"], "An empty list has no items."),
      mcq(8, "easy", 'letters = ["a"]\nWhat is letters[0]?', "a", ["0", '["a"]', "Error"], "The only item is at index 0."),
      mcq(8, "medium", "bag = [\"pen\"]\nbag.append(\"book\")\nbag.append(\"cup\")\nWhat is len(bag)?", "3", ["1", "2", "4"], "The list started with one item and gained two."),
      mcq(8, "medium", "What is [5, 5][0] + [5, 5][1]?", "10", ["55", "5", "Error"], "Both items are numbers, so they add."),
      mcq(8, "medium", 'colors = ["red", "blue", "green"]\nWhat is colors[-2]?', "blue", ["red", "green", "Error"], "-1 is green. -2 is the one before it."),
      mcq(8, "hard", 'items = ["a", "b", "a"]\nitems.remove("a")\nWhat is len(items)?', "2", ["1", "3", "0"], "Only the first a is removed."),
      mcq(8, "hard", "nums = [1, 2]\nnums[0] = nums[1]\nWhat is nums[0]?", "2", ["1", "0", "Error"], "The first slot now holds the second value."),
      mcq(8, "hard", "Which call adds 7 at the end of nums?", "nums.append(7)", ["nums.add(7)", "append(nums, 7)", "nums = append(7)"], "append is a method on the list."),
      mcq(8, "medium", 'What is len(["one", "two"])?', "2", ["1", "3", "5"], "There are two items, whatever their length as words."),
    ];
  }
  if (lesson === 9) {
    return [
      tf(9, "easy", "Parentheses are how you call a function.", true, "greet() calls it. greet without parentheses does not."),
      tf(9, "medium", "A returned value is shown on screen by itself.", false, "You still print it, or use it in another calculation."),
      tf(9, "hard", "A function can call itself.", true, "That is recursion. Beginners rarely need it, but it is allowed."),
      tf(9, "hard", "Code after a return in the same block still runs.", false, "return leaves the function immediately."),
      mcq(9, "easy", "def shout():\n    return \"HEY\"\nprint(shout())\n\nWhat is printed?", "HEY", ["shout", "None", "Nothing"], "The call returns HEY and print shows it."),
      mcq(9, "easy", "How many arguments does add(1, 2, 3) pass?", "3", ["1", "2", "6"], "There are three values inside the call."),
      mcq(9, "medium", "def minus(a, b):\n    return a - b\nprint(minus(9, 4))\n\nWhat is printed?", "5", ["13", "94", "None"], "9 - 4 is 5."),
      mcq(9, "medium", "def box(x):\n    return x\nprint(box(\"pen\"))\n\nWhat is printed?", "pen", ["x", "box", "None"], "The function returns whatever it was given."),
      mcq(9, "medium", "def both(a, b):\n    print(a)\n    return b\nx = both(\"A\", \"B\")\nprint(x)\n\nWhat are the two lines?", "A then B", ["B then A", "A then None", "B then None"], "print runs first. The returned B is printed second."),
      mcq(9, "hard", "def f(n):\n    if n < 0:\n        return 0\n    return n\nprint(f(-2))\n\nWhat is printed?", "0", ["-2", "2", "None"], "The first return catches negative numbers."),
      mcq(9, "hard", "def last():\n    return 1\n    return 2\nprint(last())\n\nWhat is printed?", "1", ["2", "1 then 2", "Error"], "The function leaves at the first return."),
      mcq(9, "hard", "def area(w, h=2):\n    return w * h\nprint(area(3))\n\nWhat is printed?", "6", ["3", "2", "Error"], "h uses its default, so 3 * 2 is 6."),
      mcq(9, "medium", "Which name is the argument in greet(\"Mia\")?", "Mia", ["greet", "def", "print"], "Mia is the value passed into the call."),
      mcq(9, "easy", "def ping():\n    print(\"ping\")\nping()\nping()\n\nHow many times is ping printed?", "2", ["1", "0", "Error"], "Each call runs the body once."),
    ];
  }
  if (lesson === 10) {
    return [
      tf(10, "easy", "A quiz should tell the player the result at the end.", true, "Print the score, and a short message that depends on it."),
      tf(10, "medium", "Questions and answers can live in two lists with matching indexes.", true, "answers[i] belongs with questions[i]."),
      tf(10, "hard", "Lowercasing both the reply and the correct answer makes the check ignore capitals.", true, 'reply.lower() == "yes" accepts Yes and YES.'),
      tf(10, "hard", "You need a new variable for every question's score.", false, "One score variable can be increased inside the loop."),
      mcq(10, "easy", "score = 0\nscore = score + 1\nscore = score + 1\nprint(score)\n\nWhat is printed?", "2", ["0", "1", "3"], "The score grew by 1 twice."),
      mcq(10, "easy", 'reply = " Yes ".strip()\nWhat is reply?', "Yes", [" Yes ", "yes", "Error"], "strip() removes the outer spaces and leaves the capital Y."),
      mcq(10, "medium", "questions = [\"Q1\", \"Q2\", \"Q3\"]\nanswers = [\"a\", \"b\", \"c\"]\nWhat lines up with questions[1]?", "b", ["a", "c", "Q2"], "The same index picks the matching answer."),
      mcq(10, "medium", "A player scores 4 out of 5. Which message fits an if score == total test?", "Not perfect", ["Perfect", "Error", "0"], "4 is not equal to 5, so the perfect branch is skipped."),
      mcq(10, "medium", "Which plan is the clearest order?", "Welcome, then questions, then the score", ["Score, then welcome, then questions", "Questions with no stored score", "Only comments"], "Greet, play, then report."),
      mcq(10, "hard", "for i in range(len(questions)):\n    print(questions[i])\n\nThis loop is useful because:", "i can also read answers[i]", ["range deletes the list", "len prints the score", "i is always the answer text"], "The shared index lines up the two lists."),
      mcq(10, "hard", 'reply = "YES"\nprint(reply.lower() == "yes")\n\nWhat is printed?', "True", ["False", "YES", "yes"], "lower() makes YES into yes before the comparison."),
      mcq(10, "hard", "score = 3\ntotal = 4\nprint(score * 100 // total)\n\nWhat is printed?", "75", ["0.75", "100", "34"], "3 / 4 is 75 percent, and // keeps it whole."),
      mcq(10, "medium", "Which bug forgets a correct answer that has an extra space?", 'Comparing reply == "cat" when the player typed "cat "', ["Using strip()", "Using a list", "Printing the score"], "strip() before the comparison avoids that miss."),
      mcq(10, "easy", "The final project mixes skills from:", "Every earlier lesson", ["Only print()", "Only functions", "Only lists"], "Input, if, loops, strings, lists and functions can all appear."),
    ];
  }
  return [];
}

function balance(items: PracticeItem[], lesson: number): PracticeItem[] {
  const all = items.concat(topUp(lesson));
  if (all.length !== 50) {
    const kinds = { tf: 0, mcq: 0, code: 0 };
    for (const q of all) kinds[q.kind] += 1;
    throw new Error(`Lesson ${lesson} has ${all.length} questions (${JSON.stringify(kinds)}), expected 50`);
  }
  return all;
}

export function buildPracticeBank(): PracticeItem[] {
  seq = 0;
  return [
    ...balance(lesson1(), 1),
    ...balance(lesson2(), 2),
    ...balance(lesson3(), 3),
    ...balance(lesson4(), 4),
    ...balance(lesson5(), 5),
    ...balance(lesson6(), 6),
    ...balance(lesson7(), 7),
    ...balance(lesson8(), 8),
    ...balance(lesson9(), 9),
    ...balance(lesson10(), 10),
  ];
}

export const PRACTICE_BANK = buildPracticeBank();
