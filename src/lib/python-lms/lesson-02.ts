import type { PythonLmsLesson } from "@/lib/python-lms/types";

export const LESSON_02: PythonLmsLesson = {
  slug: "lesson-2",
  number: 2,
  title: "Variables",
  subtitle: "Giving information a name",
  minutes: 40,
  goals: [
    "Create a variable with a name and a value",
    "Change a value, and explain that the right side is worked out first",
    "Tell when two names share a copied value and when they do not",
    "Choose a legal Python name and avoid keywords",
    "Store and recognise str, int, float and bool",
    "Use type() to check a value",
  ],
  canDo: "Store text, whole numbers, decimals and True/False under clear names, update them, and check each type with type().",

  notes: [
    {
      id: "label",
      part: "Part 1 · What a variable is",
      title: "A name for a value",
      blocks: [
        {
          type: "lead",
          text: "A variable is a name that stands for a value. You choose the name. Python remembers the value.",
        },
        {
          type: "p",
          text: "In a game you might care about a player’s name, their score and whether they are still playing. Writing those facts again and again is clumsy. A variable lets you write the fact once and use the name afterwards.",
        },
        {
          type: "p",
          text: "Think of a labelled box. **score = 100** sticks the label `score` on a box and puts **100** inside. Later, `print(score)` means “open the box labelled score and show what’s inside.”",
        },
        {
          type: "callout",
          tone: "fact",
          title: "Name and value",
          text: "The **name** is what you type in the program. The **value** is what Python stores. They are not the same thing. The name `score` is not the number 100 until you assign it.",
        },
        {
          type: "check",
          id: "c-what",
          question: "In score = 100, which word is the variable name?",
          options: ["score", "100", "=", "print"],
          answer: 0,
          explain: "`score` is the name. `100` is the value stored under that name. `=` does the storing.",
        },
      ],
    },
    {
      id: "assign",
      part: "Part 1 · What a variable is",
      title: "The assignment statement",
      blocks: [
        {
          type: "p",
          text: "The line that creates a variable is an **assignment**. It always has the same shape: a name, then `=`, then a value.",
        },
        {
          type: "anatomy",
          code: 'city = "Pune"',
          parts: [
            { token: "city", label: "The **name**. You invent it. Later lines use this word to mean the value." },
            { token: "=", label: "**Assign**. Read it as “becomes” or “store this”. It is not the equals sign from maths." },
            { token: '"Pune"', label: "The **value** being stored. Quotes mean this value is text." },
          ],
        },
        {
          type: "p",
          text: "Run this. Then imagine changing the city. The name stays `city`. Only the value changes.",
        },
        {
          type: "code",
          live: true,
          code: 'city = "Pune"\nprint(city)',
        },
        {
          type: "callout",
          tone: "warn",
          text: "In Python, `=` stores a value. Comparing two values uses `==`, which you will meet with `if`. Writing `city == \"Pune\"` does not create a variable.",
        },
        {
          type: "check",
          id: "c-equals",
          question: "What does the single = do in city = \"Pune\"?",
          options: ["It checks whether city is already Pune", "It stores Pune under the name city", "It prints Pune", "It deletes city"],
          answer: 1,
          explain: "One `=` is assignment. It stores the value on the right under the name on the left.",
        },
      ],
    },
    {
      id: "print-name",
      part: "Part 1 · What a variable is",
      title: "Printing the name or the value",
      blocks: [
        {
          type: "p",
          text: "Quotes decide what `print` shows. `print(\"name\")` shows the four letters n, a, m, e. `print(name)` looks up the variable and shows its value.",
        },
        {
          type: "compare",
          left: {
            label: "Prints the value",
            tone: "good",
            code: 'name = "Mia"\nprint(name)',
            output: "Mia",
          },
          right: {
            label: "Prints the word name",
            tone: "neutral",
            code: 'name = "Mia"\nprint("name")',
            output: "name",
          },
        },
        {
          type: "p",
          text: "Run both ideas together and read the two lines.",
        },
        {
          type: "code",
          live: true,
          code: 'name = "Mia"\nprint(name)\nprint("name")',
        },
        {
          type: "check",
          id: "c-quotes",
          question: 'name = "Mia". What does print("name") show?',
          options: ["Mia", "name", "\"Mia\"", "An error"],
          answer: 1,
          explain: "The quotes make `name` ordinary text. Python does not look up the variable.",
        },
      ],
    },
    {
      id: "reassign",
      part: "Part 2 · Changing a value",
      title: "A name keeps only the latest value",
      blocks: [
        {
          type: "p",
          text: "Assigning again to the same name **replaces** the old value. The name `score` does not remember 10 once you store 20.",
        },
        {
          type: "code",
          live: true,
          code: "score = 10\nscore = 20\nprint(score)",
        },
        {
          type: "callout",
          tone: "exam",
          text: "A variable holds one value at a time: the one from the most recent assignment. Older values are gone.",
        },
        {
          type: "check",
          id: "c-latest",
          question: "lives = 3, then lives = 2, then print(lives). What is printed?",
          options: ["3", "2", "32", "5"],
          answer: 1,
          explain: "The second assignment replaces 3 with 2. print shows the latest value.",
        },
      ],
    },
    {
      id: "rhs",
      part: "Part 2 · Changing a value",
      title: "The right side is worked out first",
      blocks: [
        {
          type: "p",
          text: "Python finishes the right-hand side before it stores anything. In `score = score + 5`, it looks up the old score, adds 5, and only then stores the result back into `score`.",
        },
        {
          type: "list",
          ordered: true,
          items: [
            "`score` currently holds 10.",
            "The right side `score + 5` becomes `10 + 5`, which is 15.",
            "15 is stored under the name `score`. The 10 is replaced.",
          ],
        },
        {
          type: "code",
          live: true,
          code: "score = 10\nscore = score + 5\nprint(score)",
        },
        {
          type: "p",
          text: "You can do this as many times as you like. Each line uses whatever value the name holds at that moment.",
        },
        {
          type: "check",
          id: "c-plus",
          question: "points = 4, then points = points + 3. What is points now?",
          options: ["4", "3", "7", "43"],
          answer: 2,
          explain: "The right side is 4 + 3. That 7 is stored back into points.",
        },
      ],
    },
    {
      id: "copy",
      part: "Part 2 · Changing a value",
      title: "A second name gets a copy",
      blocks: [
        {
          type: "p",
          text: "`b = a` copies the value that `a` holds **right then**. After that, `a` and `b` are separate. Changing `a` does not change `b`.",
        },
        {
          type: "code",
          live: true,
          code: "a = 10\nb = a\na = 1\nprint(a)\nprint(b)",
        },
        {
          type: "callout",
          tone: "tip",
          text: "Read the output as two facts. `a` was updated to 1. `b` still holds the 10 it was given on the second line.",
        },
        {
          type: "check",
          id: "c-copy",
          question: "x = 8, then y = x, then x = 3. What does print(y) show?",
          options: ["8", "3", "83", "An error"],
          answer: 0,
          explain: "`y = x` copied 8 into y. Changing x afterwards leaves y alone.",
        },
      ],
    },
    {
      id: "rules",
      part: "Part 3 · Legal names",
      title: "Rules for a variable name",
      blocks: [
        {
          type: "p",
          text: "Python will refuse to run a program if a name breaks these rules. The error appears before any of your prints.",
        },
        {
          type: "table",
          head: ["Rule", "Allowed", "Not allowed"],
          rows: [
            ["Start with a letter or _", "score, _temp", "2score, 7up"],
            ["Then use letters, digits or _", "player2, max_score", "player-score, player score"],
            ["No spaces", "player_score", "player score"],
            ["No symbols like - + .", "is_ready", "is-ready, my.name"],
          ],
        },
        {
          type: "p",
          text: "The usual style in Python is **snake_case**: lowercase words joined by underscores, as in `favourite_game`. Capitals are legal, but `FavouriteGame` is a different name from `favourite_game`.",
        },
        {
          type: "check",
          id: "c-name",
          question: "Which of these is a legal variable name?",
          options: ["2nd_score", "player score", "player-score", "player_score"],
          answer: 3,
          explain: "`player_score` starts with a letter and uses only letters and an underscore. The others start with a digit, contain a space, or contain a hyphen.",
        },
      ],
    },
    {
      id: "case-keywords",
      part: "Part 3 · Legal names",
      title: "Capitals and keywords",
      blocks: [
        {
          type: "p",
          text: "Python treats capitals as different letters. `Score`, `score` and `SCORE` are three different variables. Using the wrong one causes a **NameError**, because that exact name was never created.",
        },
        {
          type: "code",
          live: true,
          code: 'Score = "high"\nscore = "low"\nprint(Score)\nprint(score)',
        },
        {
          type: "p",
          text: "Some words already belong to Python. They are **keywords**. You cannot use them as names. The ones you will meet soon include `if`, `else`, `elif`, `for`, `while`, `and`, `or`, `not`, `True`, `False`, `in`, `def` and `return`.",
        },
        {
          type: "callout",
          tone: "warn",
          text: "`for = 3` is a syntax error. Call it `laps` or `count` instead. `True` and `False` are values, not names you invent.",
        },
        {
          type: "check",
          id: "c-keyword",
          question: "Which line is illegal?",
          code: 'for = 4',
          options: ["laps = 4", "for = 4", "count = 4", "n = 4"],
          codeOptions: true,
          answer: 1,
          explain: "`for` is a keyword. Python needs it for loops, so it cannot be a variable name.",
        },
      ],
    },
    {
      id: "four-types",
      part: "Part 4 · The four types",
      title: "Four kinds of value",
      blocks: [
        {
          type: "lead",
          text: "Every value in this lesson is one of four types: text, a whole number, a decimal, or yes/no.",
        },
        {
          type: "table",
          head: ["Type", "Python name", "Examples", "How you write it"],
          rows: [
            ["Text", "`str`", "Aarav, Pune, \"12\"", "Inside quotes"],
            ["Whole number", "`int`", "0, 12, -3, 100", "Digits, no quotes, no decimal point"],
            ["Decimal number", "`float`", "5.4, 0.5, 3.0", "A decimal point"],
            ["Yes or no", "`bool`", "True, False", "Capital T and F, no quotes"],
          ],
        },
        {
          type: "p",
          text: "The type matters because Python will not treat text and numbers as the same thing. `\"12\"` is the characters 1 and 2. `12` is the number twelve. They look similar and behave differently.",
        },
        {
          type: "check",
          id: "c-four",
          question: "Which value is a float?",
          options: ["5", '"5.4"', "5.4", "False"],
          codeOptions: true,
          answer: 2,
          explain: "A decimal point with no quotes makes a float. `5` is an int. `\"5.4\"` is text. `False` is a bool.",
        },
      ],
    },
    {
      id: "strings",
      part: "Part 4 · The four types",
      title: "Strings: text in quotes",
      blocks: [
        {
          type: "p",
          text: "A **string** (`str`) is text. You can use double quotes or single quotes. `\"Ada\"` and `'Ada'` are the same string. Pick one style and keep it.",
        },
        {
          type: "p",
          text: "The quotes are not part of the value. They tell Python where the text starts and ends. `print` shows the letters inside, not the quote marks.",
        },
        {
          type: "code",
          live: true,
          code: 'name = "Ada"\nschool = \'Mentr\'\nprint(name)\nprint(school)',
        },
        {
          type: "callout",
          tone: "tip",
          text: "An empty string `\"\"` is still a string. It is text with length 0, useful when you want a name that has not been filled in yet.",
        },
        {
          type: "check",
          id: "c-str",
          question: "Which assignment stores text?",
          options: ["city = Pune", 'city = "Pune"', "city = 12", "city = True"],
          codeOptions: true,
          answer: 1,
          explain: "Text needs quotes. `city = Pune` makes Python look for a variable called Pune, which does not exist.",
        },
      ],
    },
    {
      id: "numbers",
      part: "Part 4 · The four types",
      title: "Whole numbers and decimals",
      blocks: [
        {
          type: "p",
          text: "An **int** is a whole number: `0`, `12`, `100`, and also negatives such as `-3`. Do not put quotes around it. No decimal point.",
        },
        {
          type: "p",
          text: "A **float** is a number with a decimal point: `5.4`, `0.5`, `3.0`. The `.0` still makes it a float. `3` and `3.0` are equal as amounts, but they are different types.",
        },
        {
          type: "code",
          live: true,
          code: "age = 12\nheight = 5.4\nprint(age)\nprint(height)",
        },
        {
          type: "callout",
          tone: "exam",
          text: "In exams, `5` is an int and `5.0` is a float. Writing `\"5\"` makes it a string, even though the character is a digit.",
        },
        {
          type: "check",
          id: "c-int-float",
          question: "What is the type of 3.0?",
          options: ["str", "int", "float", "bool"],
          answer: 2,
          explain: "The decimal point makes 3.0 a float, even though the fraction is zero.",
        },
      ],
    },
    {
      id: "bools",
      part: "Part 4 · The four types",
      title: "True and False",
      blocks: [
        {
          type: "p",
          text: "A **bool** is a yes/no value. Python has exactly two of them: `True` and `False`. The capitals are required. There are no quotes.",
        },
        {
          type: "code",
          live: true,
          code: "is_student = True\nis_raining = False\nprint(is_student)\nprint(is_raining)",
        },
        {
          type: "compare",
          left: {
            label: "A real bool",
            tone: "good",
            code: "ok = True\nprint(ok)",
            output: "True",
          },
          right: {
            label: "Looks similar, fails",
            tone: "bad",
            code: "ok = true\nprint(ok)",
            output: "NameError: name 'true' is not defined",
          },
        },
        {
          type: "p",
          text: "`\"True\"` with quotes is a string of four letters, not the bool `True`. Use it only when you want the word itself.",
        },
        {
          type: "check",
          id: "c-bool",
          question: "Which line stores a bool?",
          options: ['ok = "True"', "ok = true", "ok = True", "ok = TRUE"],
          codeOptions: true,
          answer: 2,
          explain: "Only `True` with a capital T and no quotes is the bool. The others are text, a missing name, or the wrong capitals.",
        },
      ],
    },
    {
      id: "type-fn",
      part: "Part 4 · The four types",
      title: "Ask Python with type()",
      blocks: [
        {
          type: "p",
          text: "`type(value)` tells you the type. You can pass a variable or a value written directly. The reply looks like `<class 'int'>`. The word in quotes is the type name.",
        },
        {
          type: "code",
          live: true,
          code: 'print(type("12"))\nprint(type(12))\nprint(type(12.0))\nprint(type(True))',
        },
        {
          type: "table",
          head: ["You write", "type() reports"],
          rows: [
            ['"Ada" or ""', "<class 'str'>"],
            ["0 or 12 or -3", "<class 'int'>"],
            ["5.4 or 3.0", "<class 'float'>"],
            ["True or False", "<class 'bool'>"],
          ],
        },
        {
          type: "check",
          id: "c-type",
          question: 'What does print(type("5")) show?',
          options: ["<class 'int'>", "<class 'str'>", "<class 'float'>", "5"],
          codeOptions: true,
          answer: 1,
          explain: "The quotes make `\"5\"` text, so the type is str. Without quotes, `type(5)` would be int.",
        },
      ],
    },
    {
      id: "looks-like",
      part: "Part 4 · The four types",
      title: "Text that looks like a number",
      blocks: [
        {
          type: "p",
          text: "A common mix-up is storing a number you typed as text. `age = \"12\"` looks numeric, but it is a string. You cannot sensibly add 1 to it yet. The next lesson shows how `int()` converts that text into a real number.",
        },
        {
          type: "compare",
          left: {
            label: "Number",
            tone: "good",
            code: "age = 12\nprint(type(age))",
            output: "<class 'int'>",
          },
          right: {
            label: "Text of digits",
            tone: "neutral",
            code: 'age = "12"\nprint(type(age))',
            output: "<class 'str'>",
          },
        },
        {
          type: "code",
          live: true,
          code: 'age_text = "12"\nage = 12\nprint(type(age_text))\nprint(type(age))',
        },
        {
          type: "check",
          id: "c-digits",
          question: 'age = "12". What is the type of age?',
          options: ["int", "str", "float", "bool"],
          answer: 1,
          explain: "Quotes win. The characters look like digits, but the value is text.",
        },
      ],
    },
    {
      id: "errors",
      part: "Part 5 · Mistakes you will see",
      title: "NameError and SyntaxError",
      blocks: [
        {
          type: "p",
          text: "Two errors show up constantly while you are learning variables. Read the last line of the message. It names the problem.",
        },
        {
          type: "table",
          head: ["Error", "Usual cause", "Example"],
          rows: [
            ["SyntaxError", "The line is not legal Python", "player score = 10"],
            ["NameError", "You used a name that was never assigned", "print(score) before score = ..."],
          ],
        },
        {
          type: "compare",
          left: {
            label: "Created, then used",
            tone: "good",
            code: 'city = "Pune"\nprint(city)',
            output: "Pune",
          },
          right: {
            label: "Used before it exists",
            tone: "bad",
            code: "print(city)",
            output: "NameError: name 'city' is not defined",
          },
        },
        {
          type: "callout",
          tone: "tip",
          text: "If you see NameError, check three things: did you assign the name, is the spelling identical, and are the capitals identical?",
        },
        {
          type: "check",
          id: "c-error",
          question: "print(city) runs before any line creates city. Which error is that?",
          options: ["SyntaxError", "NameError", "TypeError", "No error, it prints nothing"],
          answer: 1,
          explain: "Python looks up `city`, finds no assignment, and raises NameError.",
        },
      ],
    },
    {
      id: "profile",
      part: "Part 5 · Mistakes you will see",
      title: "A player profile",
      blocks: [
        {
          type: "p",
          text: "A small profile uses all four types. Each fact has its own name. The prints at the end show the values, not the quote marks and not the type names.",
        },
        {
          type: "code",
          live: true,
          code: 'name = "Aarav"\nage = 12\nheight = 5.4\nis_student = True\nprint(name)\nprint(age)\nprint(height)\nprint(is_student)',
        },
        {
          type: "p",
          text: "Change a value and run it again. Set `age` to `age + 1` on a new line before the prints, and the printed age becomes 13. The other three names stay as they were.",
        },
        {
          type: "check",
          id: "c-profile",
          question: "In that profile, which variable is a bool?",
          options: ["name", "age", "height", "is_student"],
          answer: 3,
          explain: "`is_student` holds True. name is text, age is an int, height is a float.",
        },
      ],
    },
    {
      id: "terms",
      part: "Part 6 · Revise",
      title: "Key terms",
      blocks: [
        {
          type: "terms",
          items: [
            { term: "Variable", meaning: "A name that stands for a value." },
            { term: "Assignment", meaning: "A statement of the form name = value. It stores the value." },
            { term: "Value", meaning: "What is stored: text, a number, or True/False." },
            { term: "Reassignment", meaning: "Storing a new value under a name that already exists. The old value is replaced." },
            { term: "str", meaning: "A string. Text written in quotes." },
            { term: "int", meaning: "A whole number, with no decimal point and no quotes." },
            { term: "float", meaning: "A number written with a decimal point." },
            { term: "bool", meaning: "True or False, with capitals and no quotes." },
            { term: "type()", meaning: "A function that reports the type of a value." },
            { term: "Keyword", meaning: "A word Python reserves, such as for or if. It cannot be a variable name." },
          ],
        },
      ],
    },
    {
      id: "exam",
      part: "Part 6 · Revise",
      title: "Exam corner",
      blocks: [
        {
          type: "lead",
          text: "These are the questions this chapter is built to answer. Flip a card, then try the checks.",
        },
        {
          type: "flashcards",
          cards: [
            { q: "What is a variable?", a: "A name that stores a value." },
            { q: "What does = do?", a: "It assigns. The value on the right is stored under the name on the left." },
            { q: "What is printed by score = 10 then score = 20 then print(score)?", a: "20. Only the latest value remains." },
            { q: "What happens in b = a?", a: "The current value of a is copied into b. Later changes to a do not change b." },
            { q: "Why is 2score illegal?", a: "A name cannot start with a digit." },
            { q: "Why is player score illegal?", a: "A name cannot contain a space. Use player_score." },
            { q: "Name the four types and one example of each.", a: "str \"Hi\", int 12, float 5.4, bool True." },
            { q: "What is the type of \"12\"?", a: "str. The quotes make it text." },
            { q: "What is the type of 3.0?", a: "float. The decimal point decides it." },
            { q: "How do you write a bool?", a: "True or False. Capital first letter, no quotes." },
          ],
        },
        {
          type: "check",
          id: "c-exam-copy",
          question: "a = 5, then b = a, then a = a + 1, then print(b). What is printed?",
          options: ["5", "6", "1", "An error"],
          answer: 0,
          explain: "b copied 5. The next line changes only a, to 6. b stays 5.",
        },
        {
          type: "check",
          id: "c-exam-type",
          question: "Which call reports the type of height?",
          options: ["print(height.type)", "print(type(height))", "print(kind(height))", "print(typeof height)"],
          codeOptions: true,
          answer: 1,
          explain: "The function is type(), and you pass the value inside the brackets.",
        },
      ],
    },
    {
      id: "recap",
      part: "Part 6 · Revise",
      title: "Chapter summary",
      blocks: [
        {
          type: "list",
          items: [
            "A variable is a name for one value. `=` stores that value.",
            "Assigning again replaces the old value. The right side is calculated first.",
            "`b = a` copies the value at that moment. The two names are then separate.",
            "Names start with a letter or `_`, then letters, digits and `_`. No spaces, no hyphens, no keywords.",
            "Capitals matter. `Score` and `score` are different.",
            "str is quoted text, int is a whole number, float has a decimal point, bool is True or False.",
            "`type()` reports which of the four you have. `\"12\"` is str. `12` is int.",
          ],
        },
        {
          type: "callout",
          tone: "fact",
          title: "Next up",
          text: "The Examples step through reassignment and a copy, then you build a profile yourself. Practice checks names, types and small programs.",
        },
      ],
    },
  ],

  examples: [
    {
      type: "trace",
      id: "trace-score",
      title: "Watch a score change",
      intro: "Step through the lines. Notice that the first value does not survive the second assignment, and that the addition happens before the new value is stored.",
      code: "score = 10\nscore = score + 5\nprint(score)",
      steps: [
        { line: 1, note: "The name score is created and 10 is stored. Nothing is printed yet." },
        { line: 2, note: "The right side uses the current score: 10 + 5 is 15. Then 15 replaces 10. The name still exists; the value changed." },
        { line: 3, output: "15", note: "print looks up score and shows the latest value, 15." },
      ],
    },
    {
      type: "trace",
      id: "trace-copy",
      title: "Two names, one copied value",
      intro: "b takes a copy of a. After that, updating a leaves b alone. Watch which print shows which number.",
      code: "a = 10\nb = a\na = 1\nprint(a)\nprint(b)",
      steps: [
        { line: 1, note: "a holds 10." },
        { line: 2, note: "b is created and given the value a holds right now, which is 10. a and b are now separate names." },
        { line: 3, note: "a is changed to 1. b is not mentioned, so b still holds 10." },
        { line: 4, output: "1", note: "This print shows a." },
        { line: 5, output: "10", note: "This print shows b, the copied 10." },
      ],
    },
    {
      type: "playground",
      id: "play-profile",
      title: "Build a player profile",
      intro: "Run the starter, then replace the sample facts with your own. Keep one variable of each type.",
      starter: 'name = "Aarav"\nage = 12\nheight = 5.4\nis_student = True\nprint(name, age, height, is_student)',
      tryThis: [
        "Change the name, age and height to yours",
        "Add favourite_game as another string and print it",
        "Print type(age) on its own line and check it says int",
      ],
      goal: {
        text: "Use your own name (not Aarav), keep age as a whole number with no quotes, height as a decimal, and is_student as True or False.",
        check: (r, code) =>
          r.ok &&
          !code.includes("Aarav") &&
          /name\s*=\s*["']/.test(code) &&
          /^\s*age\s*=\s*-?\d+\s*(?:#.*)?$/m.test(code) &&
          /height\s*=\s*-?\d+\.\d+/.test(code) &&
          /\bis_student\s*=\s*(True|False)\b/.test(code),
        success: "Four types, four names, and the profile is yours.",
      },
    },
    {
      type: "playground",
      id: "play-update",
      title: "Update a score without retyping it",
      intro: "Start from 10 and add 5 using the old value. Do not replace the second line with score = 15. Make Python do the addition.",
      starter: "score = 10\n# add 5 using the current score\nprint(score)",
      tryThis: ["Write score = score + 5 before the print", "Run it and read 15", "Change + 5 to + 1 and run again"],
      goal: {
        text: "Print 15 by adding 5 to the current score.",
        check: (r, code) => r.ok && r.stdout.trim() === "15" && /score\s*=\s*score\s*\+\s*5/.test(code),
        success: "The right side used the old score. 10 + 5 was stored back into score.",
      },
    },
    {
      type: "playground",
      id: "play-types",
      title: "Check four types yourself",
      intro: "type() is how you settle an argument about what a value is. Run this, then add one more value of your own.",
      starter: 'print(type("12"))\nprint(type(12))\nprint(type(3.0))\nprint(type(False))',
      tryThis: ['Add print(type(""))', "Add print(type(0))", "Add print(type(True))"],
      goal: {
        text: "The first four lines must report str, int, float and bool, in that order. Extra lines after that are fine.",
        check: (r) => {
          const lines = r.stdout.trim().split("\n");
          return (
            r.ok &&
            lines[0] === "<class 'str'>" &&
            lines[1] === "<class 'int'>" &&
            lines[2] === "<class 'float'>" &&
            lines[3] === "<class 'bool'>"
          );
        },
        success: "Those four lines are the types this chapter is about.",
      },
    },
    {
      type: "playground",
      id: "play-bugs",
      title: "Bug hunt: a profile that will not run",
      intro: "Run it. Fix the error Python names, then run again. There are three separate mistakes.",
      starter: 'player name = "Aarav"\nage = "12"\nis_ready = true\nprint(player name)\nprint(type(age))\nprint(is_ready)',
      tryThis: [
        "Spaces are not allowed in a name. Use an underscore.",
        "age should be a whole number, not text, if type() is going to say int.",
        "The bool needs a capital T.",
      ],
      goal: {
        text: "Make it run. type(age) must report int, and is_ready must print True or False.",
        check: (r, code) =>
          r.ok &&
          r.stdout.includes("<class 'int'>") &&
          /True|False/.test(r.stdout) &&
          !/\btrue\b/.test(code) &&
          !/player name/.test(code),
        success: "Legal name, a real int, and a real bool. That is the whole chapter in one fix.",
      },
    },
  ],

  practice: [
    {
      type: "mcq",
      id: "q-what",
      level: "easy",
      skill: "What a variable is",
      prompt: "What is a variable?",
      options: ["A type of error", "A name that stores a value", "A comment", "The print() function"],
      answer: 1,
      explain: "A variable is a name attached to a value, so you can use that value again by writing the name.",
    },
    {
      type: "mcq",
      id: "q-assign",
      level: "easy",
      skill: "Assignment",
      prompt: "Which line stores the number 12 under the name age?",
      options: ["age == 12", 'age = "12"', "age = 12", "print(age = 12)"],
      codeOptions: true,
      answer: 2,
      explain: "One `=` assigns. No quotes, because 12 is a number. `==` compares and does not create the variable.",
    },
    {
      type: "fill",
      id: "q-fill-name",
      level: "easy",
      skill: "Create a string",
      prompt: "Fill the blank so name stores the text Ada.",
      code: 'name = "___"',
      answers: ["Ada"],
      mode: "code",
      placeholder: "Ada",
      explain: "The quotes are already there. Ada is the text stored in the variable.",
    },
    {
      type: "mcq",
      id: "q-legal",
      level: "easy",
      skill: "Naming rules",
      prompt: "Which name is legal?",
      options: ["2score", "player score", "player-score", "player_score"],
      codeOptions: true,
      answer: 3,
      explain: "It starts with a letter and uses only letters and an underscore. The others use a leading digit, a space, or a hyphen.",
    },
    {
      type: "mcq",
      id: "q-keyword",
      level: "medium",
      skill: "Keywords",
      prompt: "Which of these cannot be a variable name?",
      options: ["total", "for", "count", "laps"],
      answer: 1,
      explain: "`for` is a keyword. Python uses it to start a loop, so it is not available as a name.",
    },
    {
      type: "mcq",
      id: "q-case",
      level: "medium",
      skill: "Case sensitivity",
      prompt: "Score = 10 and then print(score). What happens?",
      options: ["It prints 10", "It prints Score", "NameError, because score was never assigned", "It prints 0"],
      answer: 2,
      explain: "`Score` and `score` are different names. The lowercase one was never created.",
    },
    {
      type: "mcq",
      id: "q-latest",
      level: "easy",
      skill: "Reassignment",
      prompt: "What does this print?",
      code: "score = 10\nscore = 20\nprint(score)",
      options: ["10", "20", "30", "1020"],
      answer: 1,
      explain: "The second assignment replaces 10. print shows the latest value.",
    },
    {
      type: "mcq",
      id: "q-plus",
      level: "medium",
      skill: "Right-hand side",
      prompt: "What does this print?",
      code: "points = 4\npoints = points + 3\nprint(points)",
      options: ["4", "3", "7", "43"],
      answer: 2,
      explain: "The right side is worked out first: 4 + 3 is 7, and 7 is stored back into points.",
    },
    {
      type: "mcq",
      id: "q-copy",
      level: "hard",
      skill: "Copying a value",
      prompt: "What does this print?",
      code: "a = 10\nb = a\na = 1\nprint(b)",
      options: ["10", "1", "11", "An error"],
      answer: 0,
      explain: "`b = a` copied 10. Changing a to 1 afterwards does not change b.",
    },
    {
      type: "order",
      id: "q-order",
      level: "medium",
      skill: "Order of lines",
      prompt: "Put the lines in an order that prints 15. The addition must use the old score.",
      lines: ["score = 10", "score = score + 5", "print(score)"],
      code: true,
      explain: "Create score first, then add 5 using that value, then print. Any other order either fails or prints the wrong number.",
    },
    {
      type: "mcq",
      id: "q-type-text",
      level: "easy",
      skill: "str vs int",
      prompt: 'What is the type of "12"?',
      options: ["int", "str", "float", "bool"],
      answer: 1,
      explain: "The quotes make it text, even though the characters are digits.",
    },
    {
      type: "mcq",
      id: "q-type-float",
      level: "medium",
      skill: "float",
      prompt: "What is the type of 3.0?",
      options: ["int", "float", "str", "bool"],
      answer: 1,
      explain: "A decimal point makes a float. 3.0 is not an int.",
    },
    {
      type: "mcq",
      id: "q-type-bool",
      level: "easy",
      skill: "bool",
      prompt: "Which value is a bool?",
      options: ['"True"', "true", "True", "TRUE"],
      codeOptions: true,
      answer: 2,
      explain: "True with a capital T and no quotes is one of the two bool values.",
    },
    {
      type: "fill",
      id: "q-fill-bool",
      level: "easy",
      skill: "Write a bool",
      prompt: "Fill the blank so is_student holds the bool for yes.",
      code: "is_student = ___",
      answers: ["True"],
      mode: "code",
      explain: "The bool is True. It has a capital T and no quotes.",
    },
    {
      type: "mcq",
      id: "q-type-call",
      level: "medium",
      skill: "type()",
      prompt: "Which line prints the type of score?",
      options: ["print(score.type)", "print(type(score))", "print(kind(score))", "type(print(score))"],
      codeOptions: true,
      answer: 1,
      explain: "Call type() and pass score. print shows the report, which looks like <class 'int'>.",
    },
    {
      type: "fill",
      id: "q-fill-output",
      level: "medium",
      skill: "Predict print",
      prompt: "What exactly is printed? Type the output, not the code.",
      code: 'city = "Pune"\nprint(city)',
      answers: ["Pune"],
      mode: "text",
      explain: "print(city) shows the value, without quote marks.",
    },
    {
      type: "mcq",
      id: "q-name-error",
      level: "hard",
      skill: "NameError",
      prompt: "This program has never assigned city. What happens at print(city)?",
      code: "print(city)",
      options: ["It prints a blank line", "It prints city", "NameError", "SyntaxError"],
      answer: 2,
      explain: "Using a name before any assignment raises NameError. The line is legal syntax, but the name does not exist.",
    },
    {
      type: "write",
      id: "q-write-name",
      level: "easy",
      skill: "Store and print text",
      prompt: "Create a variable called name holding Ada and print it. The output must be exactly:\nAda",
      starter: "",
      expected: "Ada",
      hint: 'name = "Ada" then print(name). Quotes around Ada, no quotes around the name in print.',
      solution: 'name = "Ada"\nprint(name)',
    },
    {
      type: "write",
      id: "q-write-update",
      level: "medium",
      skill: "Update using the old value",
      prompt: "Start lives at 3. Subtract 1 using the current value of lives. Print lives. The output must be:\n2",
      starter: "lives = 3\n",
      expected: "2",
      check: (_r, code) => (/lives\s*=\s*lives\s*-\s*1/.test(code) ? null : "Use the old value: lives = lives - 1."),
      hint: "After lives = 3, write lives = lives - 1 and then print(lives).",
      solution: "lives = 3\nlives = lives - 1\nprint(lives)",
    },
    {
      type: "write",
      id: "q-write-types",
      level: "hard",
      skill: "Four types in one program",
      prompt:
        "Create four variables and print each on its own line, in this order:\n• name as text Mia\n• age as the whole number 11\n• height as the decimal 4.5\n• is_student as the bool True\n\nOutput:\nMia\n11\n4.5\nTrue",
      starter: "",
      expected: "Mia\n11\n4.5\nTrue",
      check: (_r, code) => {
        if (!/name\s*=\s*["']Mia["']/.test(code)) return 'Store Mia in name with quotes.';
        if (!/age\s*=\s*11\b/.test(code)) return "Store 11 in age with no quotes.";
        if (!/height\s*=\s*4\.5\b/.test(code)) return "Store 4.5 in height so it is a float.";
        if (!/is_student\s*=\s*True\b/.test(code)) return "Store True in is_student, with a capital T and no quotes.";
        return null;
      },
      hint: "One assignment per line, then four print lines. True has a capital T.",
      solution: 'name = "Mia"\nage = 11\nheight = 4.5\nis_student = True\nprint(name)\nprint(age)\nprint(height)\nprint(is_student)',
    },
    {
      type: "write",
      id: "q-challenge",
      level: "hard",
      skill: "Mini challenge",
      challenge: true,
      prompt:
        "Build a one-player scorecard.\n• name is text (your choice, not empty)\n• score starts at 0 as a whole number\n• add 10 using score = score + 10\n• playing is True\n• print name, then score, then playing, on three lines\n\nThe last two lines of output must be:\n10\nTrue",
      starter: "name = \"\"\n",
      check: (r, code) => {
        const lines = r.stdout.split("\n").map((l) => l.trim()).filter((l) => l !== "");
        if (!/name\s*=\s*["'][^"']+["']/.test(code)) return 'Give name a non-empty string.';
        if (!/score\s*=\s*0\b/.test(code)) return "Start score at 0 with no quotes.";
        if (!/score\s*=\s*score\s*\+\s*10/.test(code)) return "Add 10 with score = score + 10.";
        if (!/playing\s*=\s*True\b/.test(code)) return "Set playing = True.";
        if (lines.length < 3) return "Print name, score and playing on three lines.";
        if (lines[lines.length - 2] !== "10" || lines[lines.length - 1] !== "True") return "The last two lines must be 10 then True.";
        return null;
      },
      hint: 'name = "Sam" then score = 0 then score = score + 10 then playing = True, then three prints.',
      solution: 'name = "Sam"\nscore = 0\nscore = score + 10\nplaying = True\nprint(name)\nprint(score)\nprint(playing)',
    },
  ],
};
