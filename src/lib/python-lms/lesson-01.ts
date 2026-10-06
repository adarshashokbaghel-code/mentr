import type { PythonLmsLesson } from "@/lib/python-lms/types";

const nonEmptyLines = (s: string) => s.split("\n").filter((l) => l.trim() !== "");
const printCount = (code: string) => (code.match(/\bprint\s*\(/g) ?? []).length;

export const LESSON_01: PythonLmsLesson = {
  slug: "lesson-1",
  number: 1,
  title: "Welcome to Python",
  subtitle: "Programs, algorithms and your first lines of code",
  minutes: 45,
  goals: [
    "Explain what a program, an algorithm and a flowchart are",
    "Tell a compiler from an interpreter",
    "Run Python in interactive mode and script mode",
    "Print text and numbers with print(), sep and end",
    "Use escape sequences like \\n and \\t",
    "Write comments and predict the order code runs in",
    "Name the three types of errors and fix them",
  ],
  canDo: "Write a multi-line Python program, format its output with sep, end and escape sequences, and find and fix errors in it.",

  notes: [
    // ── Part 1 · Computers and programs ──────────────────────────────
    {
      id: "programming",
      part: "Part 1 · Computers and programs",
      title: "What is programming?",
      blocks: [
        {
          type: "lead",
          text: "A computer is fast, but it can’t think for itself. It does exactly what it’s told, one instruction at a time.",
        },
        {
          type: "p",
          text: "A **program** is a set of instructions that tells a computer what to do. Writing those instructions is called **programming** (or **coding**), and the instructions themselves are called **code**.",
        },
        {
          type: "p",
          text: "The physical parts of a computer (keyboard, screen, processor) are **hardware**. Programs are **software**. Hardware does nothing useful until software tells it what to do.",
        },
        {
          type: "callout",
          tone: "tip",
          text: "Every app on your phone, every game and every website is a program. Some are millions of lines long, but each line is a simple instruction like the ones you’ll write today.",
        },
      ],
    },
    {
      id: "ipo",
      part: "Part 1 · Computers and programs",
      title: "Input → Process → Output",
      blocks: [
        {
          type: "p",
          text: "Almost every program follows the same three steps, called the **IPO cycle**:",
        },
        {
          type: "list",
          items: [
            "**Input**: data goes in (you type, tap or click).",
            "**Process**: the computer works on the data (calculates, compares, sorts).",
            "**Output**: the result comes out (on screen, through speakers, on paper).",
          ],
        },
        {
          type: "table",
          head: ["Program", "Input", "Process", "Output"],
          rows: [
            ["Calculator", "12 and 8, and +", "Adds the numbers", "20"],
            ["ATM", "Card, PIN, amount", "Checks PIN and balance", "Cash and a receipt"],
            ["Maps app", "Where you want to go", "Finds the shortest route", "Directions on screen"],
          ],
        },
        {
          type: "check",
          id: "c-ipo",
          question: "In a calculator, pressing the **=** button and seeing the answer on screen is which step?",
          options: ["Input", "Process", "Output", "Storage"],
          answer: 2,
          explain: "The answer appearing on screen is the **output**. Typing the numbers is input; the adding is the process.",
        },
      ],
    },
    {
      id: "algorithm",
      part: "Part 1 · Computers and programs",
      title: "Algorithms: steps before code",
      blocks: [
        {
          type: "p",
          text: "Before writing code, programmers plan the steps. A step-by-step method for solving a problem is called an **algorithm**.",
        },
        {
          type: "p",
          text: "Here’s an algorithm for making a cup of tea:",
        },
        {
          type: "list",
          ordered: true,
          items: ["Start", "Boil water", "Put a tea bag in a cup", "Pour the hot water into the cup", "Wait 3 minutes, then remove the tea bag", "Add milk and sugar if you like", "Stop"],
        },
        {
          type: "p",
          text: "A good algorithm has these properties:",
        },
        {
          type: "table",
          head: ["Property", "Meaning"],
          rows: [
            ["Input", "It takes zero or more inputs."],
            ["Output", "It produces at least one result."],
            ["Definiteness", "Every step is clear, with only one meaning."],
            ["Finiteness", "It ends after a fixed number of steps."],
            ["Effectiveness", "Every step can actually be carried out."],
          ],
        },
        {
          type: "callout",
          tone: "exam",
          text: "“Define an algorithm and write two of its properties” is a common 2-mark question. Learn the five properties above.",
        },
      ],
    },
    {
      id: "flowchart",
      part: "Part 1 · Computers and programs",
      title: "Flowcharts: algorithms as pictures",
      blocks: [
        {
          type: "p",
          text: "A **flowchart** draws an algorithm using standard shapes joined by arrows. Each shape has a fixed meaning:",
        },
        {
          type: "table",
          head: ["Shape", "Name", "Used for"],
          rows: [
            ["Oval", "Terminal", "Start and Stop"],
            ["Parallelogram", "Input / Output", "Reading data or showing a result"],
            ["Rectangle", "Process", "A calculation or action, like Sum = A + B"],
            ["Diamond", "Decision", "A yes/no question, like Is A > B?"],
            ["Arrow", "Flow line", "The direction the steps go in"],
          ],
        },
        {
          type: "flow",
          title: "Flowchart: add two numbers",
          steps: [
            { kind: "terminal", text: "Start" },
            { kind: "io", text: "Read A and B" },
            { kind: "process", text: "Sum = A + B" },
            { kind: "io", text: "Print Sum" },
            { kind: "terminal", text: "Stop" },
          ],
        },
        {
          type: "check",
          id: "c-flow",
          question: "Which flowchart shape is used for **Print Sum**?",
          options: ["Oval", "Rectangle", "Parallelogram", "Diamond"],
          answer: 2,
          explain: "Showing a result is **output**, and input/output steps use a **parallelogram**.",
        },
      ],
    },
    {
      id: "pseudocode",
      part: "Part 1 · Computers and programs",
      title: "Pseudocode: plan in plain English",
      blocks: [
        {
          type: "p",
          text: "**Pseudocode** writes an algorithm in short, code-like English. It isn’t a real programming language, so no computer can run it, but it makes the plan clear before you code.",
        },
        {
          type: "code",
          filename: "pseudocode",
          code: "START\nREAD A, B\nSUM = A + B\nPRINT SUM\nSTOP",
        },
        {
          type: "p",
          text: "Later in this course you’ll turn plans like this straight into Python. Pseudocode → Python is a skill schools test often.",
        },
        {
          type: "table",
          head: ["", "Algorithm", "Flowchart", "Pseudocode"],
          rows: [
            ["Form", "Numbered steps", "Shapes and arrows", "Code-like English"],
            ["Best for", "Thinking it through", "Seeing the flow", "Getting ready to code"],
          ],
        },
      ],
    },

    // ── Part 2 · Programming languages ───────────────────────────────
    {
      id: "languages",
      part: "Part 2 · Programming languages",
      title: "Machine language to Python",
      blocks: [
        {
          type: "p",
          text: "Inside, a computer understands only **binary**: 0s and 1s. Instructions written in binary are called **machine language**. Writing them by hand is slow and very error-prone, so people invented easier languages.",
        },
        {
          type: "table",
          head: ["Level", "Looks like", "Easy for people?"],
          rows: [
            ["Machine language (low-level)", "`10110000 01100001`", "Very hard"],
            ["Assembly language (low-level)", "`MOV AL, 61h`", "Hard"],
            ["High-level language", "`print(\"Hello\")`", "Easy: close to English"],
          ],
        },
        {
          type: "p",
          text: "**Python** is a high-level language, like Java, C++ and JavaScript. High-level code has to be translated into machine language before the computer can run it.",
        },
      ],
    },
    {
      id: "translators",
      part: "Part 2 · Programming languages",
      title: "Compiler vs interpreter",
      blocks: [
        {
          type: "p",
          text: "A **translator** converts code into machine language. There are three kinds: an **assembler** (for assembly language), a **compiler** and an **interpreter**.",
        },
        {
          type: "table",
          head: ["", "Compiler", "Interpreter"],
          rows: [
            ["Translates", "The whole program at once", "One line at a time"],
            ["Errors", "Listed after the whole program is checked", "Stops at the first error"],
            ["Speed of running", "Faster", "Slower"],
            ["Extra file", "Makes a separate executable file", "No separate file"],
            ["Examples", "C, C++", "Python, JavaScript"],
          ],
        },
        {
          type: "p",
          text: "Python uses an **interpreter**, so it’s called an **interpreted language**. That’s why, when your code has a mistake on line 5, lines 1 to 4 still run first.",
        },
        {
          type: "callout",
          tone: "fact",
          title: "Going deeper",
          text: "Python actually turns your code into an in-between form called **bytecode** first, then runs it step by step. For school, “Python is interpreted” is the answer they expect.",
        },
        {
          type: "check",
          id: "c-translator",
          question: "Which translator stops at the **first** error it finds?",
          options: ["Compiler", "Interpreter", "Assembler", "None of them"],
          answer: 1,
          explain: "An **interpreter** runs line by line, so it stops as soon as it reaches a line with an error.",
        },
      ],
    },
    {
      id: "python",
      part: "Part 2 · Programming languages",
      title: "Meet Python",
      blocks: [
        {
          type: "p",
          text: "Python was created by **Guido van Rossum** in the Netherlands and first released in **1991**. It’s named after the comedy show *Monty Python’s Flying Circus*, not the snake. Today everyone uses **Python 3**.",
        },
        {
          type: "p",
          text: "**Features of Python** (a favourite exam question):",
        },
        {
          type: "list",
          items: [
            "**Easy to read and learn**: the code looks close to English.",
            "**Free and open source**: anyone can download and use it.",
            "**Interpreted**: runs line by line, so errors are easy to find.",
            "**High-level**: you don’t worry about memory or hardware details.",
            "**Portable**: the same code runs on Windows, macOS and Linux.",
            "**Huge library**: thousands of ready-made tools for maths, data, games and AI.",
            "**Case-sensitive**: `print` and `Print` are different words.",
          ],
        },
        {
          type: "p",
          text: "It’s used by YouTube, Instagram, Netflix and NASA, and it’s the main language for data science and AI. CBSE Computer Science and Informatics Practices use Python in Class 11 and 12.",
        },
      ],
    },
    {
      id: "modes",
      part: "Part 2 · Programming languages",
      title: "Two ways to run Python",
      blocks: [
        {
          type: "p",
          text: "On a computer, Python usually comes with **IDLE** (Integrated Development and Learning Environment). You can use Python in two modes:",
        },
        {
          type: "p",
          text: "**1. Interactive mode** (the Python shell). You type one line at the `>>>` prompt and see the result immediately. Great for quick tests.",
        },
        {
          type: "code",
          shell: true,
          code: '>>> 2 + 3\n5\n>>> print("Hi")\nHi',
        },
        {
          type: "p",
          text: "**2. Script mode.** You write a whole program in a file ending in **.py**, save it, then run all of it. This is how real programs are written, and it’s what the editor in this course uses.",
        },
        {
          type: "table",
          head: ["", "Interactive mode", "Script mode"],
          rows: [
            ["How", "Type at the >>> prompt", "Write a .py file, then run it"],
            ["Runs", "One line at a time", "The whole program"],
            ["Saved?", "No, it’s lost when you close it", "Yes, in the file"],
            ["Shows `2 + 3` without print?", "Yes, shows 5", "No, nothing appears"],
          ],
        },
        {
          type: "callout",
          tone: "warn",
          text: "In script mode, you must use `print()` to see anything. A line like `2 + 3` is calculated but never shown.",
        },
      ],
    },

    // ── Part 3 · Output with print() ─────────────────────────────────
    {
      id: "print",
      part: "Part 3 · Output with print()",
      title: "print() shows something on screen",
      blocks: [
        {
          type: "p",
          text: "Your first instruction is `print()`. Whatever you put inside the brackets appears on the screen.",
        },
        { type: "code", code: 'print("Hello, world!")', output: "Hello, world!" },
        {
          type: "anatomy",
          code: 'print("Hello, world!")',
          parts: [
            { token: "print", label: "a **function**: a named instruction that does a job" },
            { token: "( )", label: "brackets hold what you give the function" },
            { token: '"Hello, world!"', label: "the **argument**: the value being printed" },
          ],
        },
        {
          type: "p",
          text: "One complete instruction is called a **statement**. The rules for writing statements correctly are called **syntax**, just like grammar in English.",
        },
      ],
    },
    {
      id: "strings",
      part: "Part 3 · Output with print()",
      title: "Strings: text goes inside quotes",
      blocks: [
        {
          type: "p",
          text: "Text in Python is called a **string**. A string always sits inside quotes, so Python knows exactly where the text starts and ends. Single `'Hi'` and double `\"Hi\"` quotes both work, as long as both ends match.",
        },
        {
          type: "compare",
          left: { label: "Works", code: 'print("Hello")', output: "Hello", tone: "good" },
          right: { label: "Error", code: "print(Hello)", output: "NameError: name 'Hello' is not defined", tone: "bad" },
        },
        {
          type: "p",
          text: "**Quotes inside a string**: use the other kind of quote on the outside.",
        },
        {
          type: "code",
          code: `print("It's my turn")\nprint('She said "well done"')`,
          output: `It's my turn\nShe said "well done"`,
        },
        {
          type: "check",
          id: "c-quotes",
          question: "Which line prints **Don’t stop** without an error?",
          options: ["print('Don't stop')", 'print("Don\'t stop")', "print(Don't stop)", 'print("Don\'t stop\')'],
          codeOptions: true,
          answer: 1,
          explain: "The text contains a single quote, so wrap it in **double** quotes. Option A ends the string early at the apostrophe.",
        },
      ],
    },
    {
      id: "numbers",
      part: "Part 3 · Output with print()",
      title: "Numbers and quick maths",
      blocks: [
        {
          type: "p",
          text: "Numbers don’t need quotes, and Python works out any maths before printing.",
        },
        {
          type: "code",
          code: "print(7)\nprint(12 + 8)\nprint(10 - 4)\nprint(6 * 3)\nprint(10 / 2)",
          output: "7\n20\n6\n18\n5.0",
        },
        {
          type: "callout",
          tone: "tip",
          text: "`*` means multiply. `/` always gives a decimal answer, which is why `10 / 2` prints `5.0`. You’ll learn all the operators in Lesson 3.",
        },
        {
          type: "compare",
          left: { label: "A sum", code: "print(2 + 3)", output: "5", tone: "neutral" },
          right: { label: "Just text", code: 'print("2 + 3")', output: "2 + 3", tone: "neutral" },
        },
        {
          type: "check",
          id: "c-numbers",
          question: "What does this print?",
          code: 'print("5 * 2")',
          options: ["10", "5 * 2", "52", "An error"],
          answer: 1,
          explain: "It’s inside quotes, so it’s text. Python prints it exactly as written.",
        },
      ],
    },
    {
      id: "sep",
      part: "Part 3 · Output with print()",
      title: "Several values and sep",
      blocks: [
        {
          type: "p",
          text: "Give `print()` several values separated by commas and it prints them on one line, with a **space** between each.",
        },
        { type: "code", code: 'print("Name:", "Aarav")\nprint("Age:", 12, "years")', output: "Name: Aarav\nAge: 12 years" },
        {
          type: "p",
          text: "The space comes from a setting called **sep** (separator). You can change it:",
        },
        {
          type: "code",
          code: 'print("06", "10", "2026", sep="-")\nprint("a", "b", "c", sep="")\nprint("Mon", "Tue", "Wed", sep=" | ")',
          output: "06-10-2026\nabc\nMon | Tue | Wed",
        },
        {
          type: "check",
          id: "c-sep",
          question: "What does this print?",
          code: 'print("Hi", "Ravi", sep="*")',
          options: ["Hi Ravi", "Hi*Ravi", "Hi *Ravi", "*Hi*Ravi*"],
          codeOptions: true,
          answer: 1,
          explain: "sep goes **between** the values only, never before the first or after the last.",
        },
      ],
    },
    {
      id: "end",
      part: "Part 3 · Output with print()",
      title: "end: stay on the same line",
      blocks: [
        {
          type: "p",
          text: "After printing, `print()` moves to a new line. That’s because of another setting, **end**, which is a new line by default. Change it to keep printing on the same line.",
        },
        {
          type: "code",
          code: 'print("Loading", end="")\nprint("...", end=" ")\nprint("done!")\nprint("Next line")',
          output: "Loading... done!\nNext line",
        },
        {
          type: "p",
          text: "An empty `print()` prints nothing but still ends the line, so it’s a quick way to add a **blank line**.",
        },
        {
          type: "callout",
          tone: "exam",
          text: "Remember the defaults: **sep is a space** and **end is a new line**. Output questions with sep and end come up often.",
        },
        {
          type: "check",
          id: "c-end",
          question: "What is the output?",
          code: 'print("Hi", end="!")\nprint("Bye")',
          options: ["Hi\nBye", "Hi!\nBye", "Hi!Bye", "Hi! Bye"],
          codeOptions: true,
          answer: 2,
          explain: "end replaces the new line with `!`, so **Bye** carries on straight after it.",
        },
      ],
    },
    {
      id: "escape",
      part: "Part 3 · Output with print()",
      title: "Escape sequences",
      blocks: [
        {
          type: "p",
          text: "A backslash `\\` inside a string starts an **escape sequence**: a special character you can’t easily type.",
        },
        {
          type: "table",
          head: ["Escape", "Meaning", "Example", "Output"],
          rows: [
            ["`\\n`", "New line", '`print("A\\nB")`', "A, then B on the next line"],
            ["`\\t`", "Tab (a wide space)", '`print("Name:\\tAarav")`', "Name:    Aarav"],
            ["`\\\\`", "A backslash", '`print("C:\\\\files")`', "C:\\files"],
            ['`\\"`', "A double quote", '`print("Say \\"hi\\"")`', 'Say "hi"'],
            ["`\\'`", "A single quote", "`print('It\\'s')`", "It's"],
          ],
        },
        {
          type: "code",
          code: String.raw`print("Roll No:\t12\nName:\tAarav\nClass:\t6")`,
          output: "Roll No:\t12\nName:\tAarav\nClass:\t6",
        },
        {
          type: "check",
          id: "c-escape",
          question: "How many lines does this print?",
          code: String.raw`print("one\ntwo\nthree")`,
          options: ["1", "2", "3", "An error"],
          answer: 2,
          explain: "Each `\\n` starts a new line, so the text is split into **three** lines.",
        },
      ],
    },
    {
      id: "triple",
      part: "Part 3 · Output with print()",
      title: "Multi-line strings with triple quotes",
      blocks: [
        {
          type: "p",
          text: "Three quotes in a row (`\"\"\"` or `'''`) make a string that can go over several lines. Python keeps the line breaks exactly as you type them.",
        },
        {
          type: "code",
          code: 'print("""Roses are red,\nViolets are blue,\nPython is easy,\nAnd so are you.""")',
          output: "Roses are red,\nViolets are blue,\nPython is easy,\nAnd so are you.",
        },
        {
          type: "p",
          text: "This is handy for poems, menus and simple text pictures:",
        },
        {
          type: "code",
          code: 'print("""+----------------+\n|  SCHOOL MENU   |\n|  1. Maths      |\n|  2. Science    |\n+----------------+""")',
          output: "+----------------+\n|  SCHOOL MENU   |\n|  1. Maths      |\n|  2. Science    |\n+----------------+",
        },
      ],
    },

    // ── Part 4 · How a program runs ─────────────────────────────────
    {
      id: "order",
      part: "Part 4 · How a program runs",
      title: "Top to bottom, one line at a time",
      blocks: [
        {
          type: "p",
          text: "Python starts at line 1 and works down, finishing each line before moving to the next. This is the **order of execution** (also called **sequence**).",
        },
        {
          type: "compare",
          left: {
            label: "Sensible order",
            code: 'print("Wake up")\nprint("Brush teeth")\nprint("Go to school")',
            output: "Wake up\nBrush teeth\nGo to school",
            tone: "good",
          },
          right: {
            label: "Same lines, swapped",
            code: 'print("Go to school")\nprint("Wake up")\nprint("Brush teeth")',
            output: "Go to school\nWake up\nBrush teeth",
            tone: "neutral",
          },
        },
        {
          type: "p",
          text: "Python doesn’t know what makes sense. It just follows the order you give it, so the order of your lines **is** the order of your output.",
        },
        {
          type: "check",
          id: "c-order",
          question: "You want the output **Ready**, then **Go**. The program prints Go first. What’s the fix?",
          options: ["Add quotes", "Swap the two lines", "Use Print instead", "Add a comment"],
          answer: 1,
          explain: "Output order follows line order, so **swap the lines**.",
        },
      ],
    },
    {
      id: "comments",
      part: "Part 4 · How a program runs",
      title: "Comments: notes for humans",
      blocks: [
        {
          type: "p",
          text: "A **comment** is a note in your code that Python ignores. Comments explain what the code does, for other people and for future you.",
        },
        {
          type: "list",
          items: [
            "**Single-line comment**: starts with `#`. Everything after it on that line is ignored.",
            "**Inline comment**: a `#` at the end of a line of code.",
            "**Multi-line notes**: start each line with `#`. (A triple-quoted string on its own is also used for long notes, called a docstring. You’ll meet those with functions.)",
          ],
        },
        {
          type: "code",
          code: '# Program: school timetable\n# Author: Aarav, Class 6\nprint("Maths at 9")  # first period\n# print("This line is switched off")\nprint("Science at 10")',
          output: "Maths at 9\nScience at 10",
        },
        {
          type: "callout",
          tone: "tip",
          text: "Putting `#` in front of a line to switch it off is called **commenting out**. Programmers do it all the time while testing.",
        },
        {
          type: "check",
          id: "c-comment",
          question: "What does this print?",
          code: 'print("# not a comment")',
          options: ["Nothing", "# not a comment", "not a comment", "An error"],
          answer: 1,
          explain: "The `#` is **inside quotes**, so it’s just part of the text, not a comment.",
        },
      ],
    },

    // ── Part 5 · Errors and debugging ───────────────────────────────
    {
      id: "error-types",
      part: "Part 5 · Errors and debugging",
      title: "The three types of errors",
      blocks: [
        {
          type: "p",
          text: "A mistake in a program is called a **bug**, and finding and fixing it is called **debugging**. Errors come in three types:",
        },
        {
          type: "table",
          head: ["Type", "What it means", "Example"],
          rows: [
            ["Syntax error", "The code breaks Python’s grammar rules, so nothing runs.", '`print("Hi)` (missing quote)'],
            ["Runtime error", "The code is written correctly but fails while running.", "`print(10 / 0)` (can’t divide by zero)"],
            ["Logical error", "The program runs, but gives the wrong answer.", "Average of 4 and 6: `print(4 + 6 / 2)` gives 7.0, not 5"],
          ],
        },
        {
          type: "p",
          text: "Logical errors are the trickiest, because Python shows no message. In the example, Python divides before adding. Brackets fix it: `print((4 + 6) / 2)` gives `5.0`.",
        },
        {
          type: "callout",
          tone: "exam",
          text: "“Name the types of errors with an example of each” is very common. Use the three examples above.",
        },
      ],
    },
    {
      id: "reading-errors",
      part: "Part 5 · Errors and debugging",
      title: "Reading an error message",
      blocks: [
        {
          type: "p",
          text: "When Python finds an error it shows a message called a **traceback**. Read it from the **bottom up**: the last line says what went wrong, and the line above it shows where.",
        },
        {
          type: "code",
          filename: "traceback",
          code: 'File "main.py", line 2\n    print("Hello)\n          ^\nSyntaxError: unterminated string literal',
        },
        {
          type: "p",
          text: "**Mistakes almost every beginner makes:**",
        },
        {
          type: "table",
          head: ["Mistake", "Error you’ll see"],
          rows: [
            ['Missing quote: `print("Hi)`', "SyntaxError: unterminated string literal"],
            ['Missing bracket: `print("Hi"`', "SyntaxError: '(' was never closed"],
            ['Capital letter: `Print("Hi")`', "NameError: name 'Print' is not defined"],
            ["No quotes on text: `print(Hi)`", "NameError: name 'Hi' is not defined"],
            ['Random spaces before line 2: `print("A")` then `  print("B")`', "IndentationError: unexpected indent"],
            ["Curly quotes copied from a document: `print(“Hi”)`", "SyntaxError: invalid character"],
          ],
        },
        {
          type: "check",
          id: "c-error",
          question: "Which type of error is `print(10 / 0)`?",
          options: ["Syntax error", "Runtime error", "Logical error", "Not an error"],
          answer: 1,
          explain: "The line is written correctly, but dividing by zero fails **while running**. That makes it a **runtime error** (ZeroDivisionError).",
        },
      ],
    },

    // ── Part 6 · Revise ─────────────────────────────────────────────
    {
      id: "terms",
      part: "Part 6 · Revise",
      title: "Key terms",
      blocks: [
        {
          type: "terms",
          items: [
            { term: "Program", meaning: "A set of instructions that tells a computer what to do." },
            { term: "Algorithm", meaning: "A step-by-step method for solving a problem." },
            { term: "Flowchart", meaning: "A diagram of an algorithm using standard shapes and arrows." },
            { term: "Pseudocode", meaning: "An algorithm written in short, code-like English." },
            { term: "Interpreter", meaning: "Translates and runs code one line at a time. Python uses one." },
            { term: "Compiler", meaning: "Translates the whole program at once before it runs." },
            { term: "Syntax", meaning: "The rules for writing code correctly." },
            { term: "Statement", meaning: "One complete instruction, like `print(\"Hi\")`." },
            { term: "Function", meaning: "A named instruction that does a job, like `print()`." },
            { term: "Argument", meaning: "A value given to a function inside its brackets." },
            { term: "String", meaning: "Text inside quotes." },
            { term: "Comment", meaning: "A note starting with `#` that Python ignores." },
            { term: "Escape sequence", meaning: "A backslash code like `\\n` for a special character." },
            { term: "Bug / debugging", meaning: "A mistake in code / finding and fixing it." },
          ],
        },
      ],
    },
    {
      id: "exam",
      part: "Part 6 · Revise",
      title: "Exam corner: important questions",
      blocks: [
        {
          type: "p",
          text: "These are the questions schools ask most from this chapter. Say your answer first, then tap to check it.",
        },
        {
          type: "flashcards",
          cards: [
            { q: "What is a program?", a: "A set of instructions given to a computer to perform a task." },
            {
              q: "Define an algorithm. Write any two properties.",
              a: "An algorithm is a step-by-step method to solve a problem. Properties: **finiteness** (it ends after a fixed number of steps) and **definiteness** (each step is clear). Others: input, output, effectiveness.",
            },
            {
              q: "Differentiate between a compiler and an interpreter.",
              a: "A **compiler** translates the whole program at once and lists all errors after checking it; the program then runs faster. An **interpreter** translates line by line and stops at the first error. Python uses an interpreter.",
            },
            { q: "Why is Python called an interpreted language?", a: "Because Python code is translated and run one line at a time by an interpreter, not compiled into a separate file first." },
            {
              q: "Write any four features of Python.",
              a: "Easy to learn and read; free and open source; interpreted; portable (platform independent); large standard library; case-sensitive.",
            },
            {
              q: "Differentiate between interactive mode and script mode.",
              a: "**Interactive mode** runs one statement at a time at the `>>>` prompt and nothing is saved. **Script mode** runs a whole program saved in a `.py` file.",
            },
            { q: "What is a comment? How do you write one in Python?", a: "A note that Python ignores, used to explain code. Write it after a `#` symbol." },
            { q: 'Write the output: `print("Hi", "Ravi", sep="*")`', a: "`Hi*Ravi`" },
            { q: "What are the default values of sep and end in print()?", a: "sep is a single **space**; end is a **new line** (`\\n`)." },
            {
              q: "Name the three types of errors with an example of each.",
              a: '**Syntax error**: `print("Hi)`. **Runtime error**: `print(10 / 0)`. **Logical error**: `print(4 + 6 / 2)` to find an average (gives 7.0 instead of 5).',
            },
            { q: "What is the extension of a Python file?", a: "`.py`" },
            { q: "Who developed Python, and when was it first released?", a: "Guido van Rossum; first released in 1991." },
          ],
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
            "A **program** is a set of instructions. Plan it first as an **algorithm**, **flowchart** or **pseudocode**.",
            "Python is a **high-level, interpreted** language created by Guido van Rossum (1991).",
            "Run Python in **interactive mode** (`>>>`) or **script mode** (`.py` files).",
            "`print()` shows output. Text needs quotes; numbers don’t.",
            "**sep** sets what goes between values (default: space). **end** sets what comes after (default: new line).",
            "Escape sequences: `\\n` new line, `\\t` tab, `\\\\` backslash, `\\\"` quote.",
            "Code runs **top to bottom**. Lines starting with `#` are **comments**.",
            "Errors are **syntax**, **runtime** or **logical**. Read tracebacks from the bottom up.",
          ],
        },
        {
          type: "callout",
          tone: "fact",
          title: "Next up",
          text: "Watch these ideas run, then try them yourself in the Examples.",
        },
      ],
    },
  ],

  examples: [
    {
      type: "trace",
      id: "trace-morning",
      title: "Watch Python run a program",
      intro: "Step through this program one line at a time. The highlighted line is the one Python is running right now.",
      code: '# My school morning\nprint("Good morning!")\nprint("Time for school.")\nprint()\nprint("Lunch at", 1, "pm")',
      steps: [
        { line: 1, note: "Line 1 starts with #, so it’s a comment. Python skips it and nothing is printed." },
        { line: 2, output: "Good morning!", note: "print() shows the text inside the quotes, then moves to a new line." },
        { line: 3, output: "Time for school.", note: "The next print() starts on the new line." },
        { line: 4, output: "", note: "An empty print() prints nothing, but still ends the line. That makes a blank line." },
        {
          line: 5,
          output: "Lunch at 1 pm",
          note: "Three values separated by commas. sep is a space by default, so Python joins them with spaces. 1 is a number, so no quotes.",
        },
      ],
    },
    {
      type: "playground",
      id: "play-hello",
      title: "Make Python say your name",
      intro: "This is real Python running in your browser. Press Run, then change the code and run it again.",
      starter: 'print("Hello, I am Aarav")\nprint("I am learning Python")',
      tryThis: [
        "Replace Aarav with your own name",
        "Add a third line with your favourite food",
        "Add a comment at the top saying what the program does",
      ],
      goal: {
        text: "Change the name to yours.",
        check: (r, code) => r.ok && !code.includes("Aarav") && code.includes("print"),
        success: "Nice. That program is now yours.",
      },
    },
    {
      type: "playground",
      id: "play-maths",
      title: "Text or maths?",
      intro: "Run this and compare the lines of output. Quotes make text; no quotes means Python does the maths.",
      starter: 'print(12 + 8)\nprint("12 + 8")\nprint("Total:", 12 + 8)\nprint(10 / 2)',
      tryThis: ["Change the numbers and run it again", "Try `*` to multiply", "Notice that `/` always gives a decimal"],
      goal: {
        text: "Print the answer to 25 × 4 with a label, like Answer: 100.",
        check: (r, code) => r.ok && code.includes("*") && /\b100\b/.test(r.stdout) && /[A-Za-z]/.test(r.stdout),
        success: "That’s it: a label as text, and the maths without quotes.",
      },
    },
    {
      type: "trace",
      id: "trace-end",
      title: "How end keeps output on one line",
      intro: "Watch where each piece of output lands. Normally print() ends the line; here end changes that.",
      code: 'print("Ready", end=" ")\nprint("Set", end=" ")\nprint("Go!")\nprint("Race over")',
      steps: [
        { line: 1, output: "Ready ", inline: true, note: "end=\" \" prints a space instead of a new line, so the cursor stays on this line." },
        { line: 2, output: "Set ", inline: true, note: "Set lands right after Ready, on the same line. Again it ends with a space." },
        { line: 3, output: "Go!", note: "No end given, so the default new line is used. The line is finished." },
        { line: 4, output: "Race over", note: "This print starts on a fresh line." },
      ],
    },
    {
      type: "playground",
      id: "play-sep",
      title: "Format a date with sep",
      intro: "sep changes what goes between values. Run it, then make your own.",
      starter: 'print("06", "10", "2026")\nprint("06", "10", "2026", sep="/")',
      tryThis: ['Try sep="" and sep=" | "', 'Add end="!!" to the first line and see what happens'],
      goal: {
        text: "Print today’s date like 06-10-2026 using sep.",
        check: (r, code) => r.ok && /sep\s*=/.test(code) && /^\d{1,2}-\d{1,2}-\d{4}$/m.test(r.stdout),
        success: "Perfect. One print(), three values, joined with a dash.",
      },
    },
    {
      type: "playground",
      id: "play-escape",
      title: "Make a report card with escape sequences",
      intro: "\\n starts a new line and \\t adds a tab. One print() can make a whole neat table.",
      starter: String.raw`print("Subject\tMarks\nMaths\t92\nScience\t88")`,
      tryThis: ["Add another subject on a new line", String.raw`Try \\ to print a backslash`, String.raw`Print a quote with \"`],
      goal: {
        text: "Print at least four lines using only one print().",
        check: (r, code) => r.ok && printCount(code) === 1 && nonEmptyLines(r.stdout).length >= 4,
        success: "One statement, four lines. That’s the power of \\n.",
      },
    },
    {
      type: "playground",
      id: "play-bugs",
      title: "Bug hunt: three bugs, one program",
      intro: "This program has three different mistakes. Run it, fix the error Python shows, then run again. Repeat until it works.",
      starter: 'Print("Welcome to the quiz")\nprint("Question 1: What is 2 + 2?"\nprint("Answer: 4)',
      tryThis: ["Python is case-sensitive", "Every ( needs a )", "Every opening quote needs a closing quote"],
      goal: {
        text: "Make the program run with no errors.",
        check: (r) => r.ok && r.stdout.includes("Welcome") && r.stdout.includes("Answer: 4"),
        success: "All three bugs fixed. You just debugged a program.",
      },
      achievement: "bug-hunter",
    },
  ],

  practice: [
    {
      type: "mcq",
      id: "q-print",
      level: "easy",
      skill: "Understand print()",
      prompt: "What does print() do?",
      options: ["Sends the page to a printer", "Shows something on the screen", "Saves your code", "Deletes a line"],
      answer: 1,
      explain: "print() displays whatever is inside its brackets on the screen. It has nothing to do with paper printers.",
    },
    {
      type: "mcq",
      id: "q-correct-print",
      level: "easy",
      skill: "Syntax",
      prompt: "Which line prints the word Hello?",
      options: ["print(Hello)", 'Print("Hello")', 'print("Hello")', 'print "Hello"'],
      codeOptions: true,
      answer: 2,
      explain: "Text needs quotes, print is all lowercase, and the text goes inside brackets.",
    },
    {
      type: "fill",
      id: "q-fill-print",
      level: "easy",
      skill: "Complete the code",
      prompt: "Fill in the blank so this shows Good morning on screen.",
      code: '___("Good morning")',
      answers: ["print"],
      mode: "code",
      explain: "`print` is the function that shows output.",
    },
    {
      type: "mcq",
      id: "q-predict-order",
      level: "easy",
      skill: "Predict the output",
      prompt: "What will this program print?",
      code: 'print("A")\nprint("B")\nprint("C")',
      options: ["A\nB\nC", "C\nB\nA", "ABC", "A B C"],
      codeOptions: true,
      answer: 0,
      explain: "Python runs from top to bottom, and each print() ends with a new line.",
    },
    {
      type: "mcq",
      id: "q-predict-quotes",
      level: "easy",
      skill: "Text vs numbers",
      prompt: "What does this line print?",
      code: 'print("4 + 4")',
      options: ["8", "4 + 4", "44", "An error"],
      codeOptions: true,
      answer: 1,
      explain: "The sum is inside quotes, so it’s text. Python prints it exactly as written.",
    },
    {
      type: "mcq",
      id: "q-interpreter",
      level: "easy",
      skill: "Translators",
      prompt: "Python translates code one line at a time. What is this kind of translator called?",
      options: ["Compiler", "Assembler", "Interpreter", "Editor"],
      answer: 2,
      explain: "An **interpreter** translates and runs one line at a time. That’s why Python is called an interpreted language.",
    },
    {
      type: "mcq",
      id: "q-flowchart",
      level: "easy",
      skill: "Flowcharts",
      prompt: "In a flowchart, which shape is used for Start and Stop?",
      options: ["Rectangle", "Oval", "Diamond", "Parallelogram"],
      answer: 1,
      explain: "Start and Stop are **terminals**, drawn as ovals. Rectangles are for processes, diamonds for decisions and parallelograms for input/output.",
    },
    {
      type: "order",
      id: "q-order-algorithm",
      level: "easy",
      skill: "Algorithm (pseudocode)",
      prompt: "Put this algorithm for adding two numbers in the right order.",
      lines: ["START", "READ A, B", "SUM = A + B", "PRINT SUM", "STOP"],
      code: true,
      explain: "Start, take the input, process it, show the output, stop. That’s the Input → Process → Output cycle.",
    },
    {
      type: "mcq",
      id: "q-script-mode",
      level: "medium",
      skill: "Interactive vs script mode",
      prompt: "A file main.py contains only this line. What appears when you run it in script mode?",
      code: "5 + 3",
      options: ["8", "5 + 3", "Nothing", "An error"],
      answer: 2,
      explain: "Python calculates 8, but in **script mode** nothing is shown without print(). In interactive mode, `>>> 5 + 3` would show 8.",
    },
    {
      type: "fill",
      id: "q-fill-sep",
      level: "medium",
      skill: "Use sep",
      prompt: "Fill in the blank so the output is:\nHi-there",
      code: 'print("Hi", "there", sep=___)',
      answers: ['"-"', "'-'"],
      mode: "code",
      placeholder: '"?"',
      explain: 'sep is a string, so it needs quotes: `sep="-"`.',
    },
    {
      type: "mcq",
      id: "q-sep-empty",
      level: "medium",
      skill: "Predict sep",
      prompt: "What is the output?",
      code: 'print("a", "b", "c", sep="")',
      options: ["a b c", "abc", "a,b,c", "a\nb\nc"],
      codeOptions: true,
      answer: 1,
      explain: 'An empty separator `""` means nothing goes between the values.',
    },
    {
      type: "mcq",
      id: "q-end",
      level: "medium",
      skill: "Predict end",
      prompt: "What is the output?",
      code: 'print("Hi", end="!")\nprint("Bye")',
      options: ["Hi\nBye", "Hi!\nBye", "Hi!Bye", "Hi Bye!"],
      codeOptions: true,
      answer: 2,
      explain: "end replaces the usual new line with `!`, so Bye continues right after it.",
    },
    {
      type: "order",
      id: "q-order-end",
      level: "medium",
      skill: "Rearrange code",
      prompt: "Arrange the code so the output is exactly:\nReady Set Go!\nDone",
      lines: ['print("Ready", end=" ")', 'print("Set", end=" ")', 'print("Go!")', 'print("Done")'],
      code: true,
      explain: "The two lines with end=\" \" keep the output on one line. print(\"Go!\") ends the line, so Done starts a new one.",
    },
    {
      type: "fill",
      id: "q-fill-output",
      level: "medium",
      skill: "Type the output",
      prompt: 'Type the exact output of:\nprint("Tea", "Coffee", sep=" & ")',
      answers: ["Tea & Coffee"],
      mode: "text",
      placeholder: "Type the output",
      explain: 'The separator " & " goes between the two values: Tea & Coffee.',
    },
    {
      type: "mcq",
      id: "q-escape",
      level: "medium",
      skill: "Escape sequences",
      prompt: "Which line prints Good and Night on two separate lines?",
      options: [String.raw`print("Good\tNight")`, String.raw`print("Good\nNight")`, 'print("Good", "Night")', String.raw`print("Good/nNight")`],
      codeOptions: true,
      answer: 1,
      explain: "`\\n` is the new-line escape sequence. `\\t` is a tab, and `/n` with a forward slash is just ordinary text.",
    },
    {
      type: "mcq",
      id: "q-comment",
      level: "medium",
      skill: "Comments",
      prompt: "Which line will Python skip?",
      code: '# Say hello\nprint("Hello")\nprint("# not a comment")',
      options: ["Line 1", "Line 2", "Line 3", "None of them"],
      answer: 0,
      explain: "Line 1 starts with #, so it’s a comment. On line 3 the # is inside quotes, so it’s just text.",
    },
    {
      type: "mcq",
      id: "q-error-name",
      level: "medium",
      skill: "Read an error",
      prompt: "What happens when you run this?",
      code: 'Print("Hi")',
      options: ["It prints Hi", 'It prints Print("Hi")', "NameError", "Nothing happens"],
      answer: 2,
      explain: "Python is case-sensitive. It knows print, not Print, so it reports a NameError.",
    },
    {
      type: "mcq",
      id: "q-error-type",
      level: "medium",
      skill: "Types of errors",
      prompt: "This should print the average of 4 and 6, which is 5. It prints 7.0 instead. What type of error is this?",
      code: "print(4 + 6 / 2)",
      options: ["Syntax error", "Runtime error", "Logical error", "No error"],
      answer: 2,
      explain: "The program runs without a message but gives the wrong answer. That’s a **logical error**. Python divides 6 / 2 before adding.",
    },
    {
      type: "write",
      id: "q-fix",
      level: "medium",
      skill: "Fix the bugs",
      prompt: "This line has two bugs. Fix it so it prints:\nHello, Python!",
      starter: 'Print("Hello, Python!)',
      expected: "Hello, Python!",
      hint: "Check the capital letter at the start, and look at where the string ends.",
      solution: 'print("Hello, Python!")',
    },
    {
      type: "write",
      id: "q-missing",
      level: "medium",
      skill: "Find the missing line",
      prompt: "Add the missing line so the output is:\nRoses are red\nViolets are blue\nPython is fun",
      starter: 'print("Roses are red")\n# add the missing line here\nprint("Python is fun")',
      expected: "Roses are red\nViolets are blue\nPython is fun",
      hint: "Replace the comment with a print() for “Violets are blue”.",
      solution: 'print("Roses are red")\nprint("Violets are blue")\nprint("Python is fun")',
    },
    {
      type: "write",
      id: "q-one-print",
      level: "hard",
      skill: "Escape sequences",
      prompt: "Using only ONE print() statement, produce exactly:\nRoll No: 12\nName: Aarav\nClass: 6",
      starter: "",
      expected: "Roll No: 12\nName: Aarav\nClass: 6",
      check: (_r, code) => (printCount(code) === 1 ? null : "Use exactly one print() statement. Put \\n between the lines."),
      hint: 'Put all three lines in one string, separated by \\n: print("Roll No: 12\\nName: ...")',
      solution: String.raw`print("Roll No: 12\nName: Aarav\nClass: 6")`,
    },
    {
      type: "write",
      id: "q-logic",
      level: "hard",
      skill: "Fix a logical error",
      prompt: "This program should print the average of 4 and 6. Fix the logical error so the output is:\nAverage: 5.0",
      starter: 'print("Average:", 4 + 6 / 2)',
      expected: "Average: 5.0",
      hint: "Python divides before it adds. Use brackets so the adding happens first.",
      solution: 'print("Average:", (4 + 6) / 2)',
    },
    {
      type: "write",
      id: "q-challenge",
      level: "hard",
      skill: "Mini challenge",
      challenge: true,
      prompt:
        "Write a program that introduces you.\n• Start with a comment saying what the program does\n• Print at least four lines\n• Include your age as a number (no quotes)\n• Use sep or end at least once",
      starter: "# ",
      check: (r, code) => {
        if (!code.split("\n").some((l) => l.trim().startsWith("#"))) return "Start with a comment line that begins with #.";
        if (nonEmptyLines(r.stdout).length < 4) return "Your program should print at least four lines.";
        if (!/print\([^)]*\b\d+\b/.test(code)) return 'Print your age as a number, for example print("Age:", 12).';
        if (!/\b(sep|end)\s*=/.test(code)) return 'Use sep= or end= at least once, for example print("Hobbies", "Chess", "Cricket", sep=", ").';
        return null;
      },
      hint: 'One print() per line. For your age: print("Age:", 12). For sep: print("I like", "chess", "cricket", sep=" | ").',
      solution:
        '# A program that introduces me\nprint("Hi, my name is Aarav")\nprint("Age:", 12)\nprint("I like", "football", "chess", sep=" | ")\nprint("I am learning Python", end="!\\n")',
    },
  ],
};
