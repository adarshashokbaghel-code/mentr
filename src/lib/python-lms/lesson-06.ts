import type { PythonLmsLesson } from "@/lib/python-lms/types";

export const LESSON_06: PythonLmsLesson = {
  slug: "lesson-6",
  number: 6,
  title: "Loops",
  subtitle: "Making computers repeat work",
  minutes: 60,
  goals: [
    "Explain one pass through a loop: the body runs, then it runs again",
    "Use range(stop) and range(start, stop), and know the stop number is not included",
    "Count forwards, backwards, and in steps",
    "Keep a running total outside the loop",
    "Write a while loop that changes something, so it can end",
  ],
  canDo: "Repeat work with for and range(), and write a while loop that ends.",

  notes: [
    {
      id: "why",
      part: "Part 1 · What a loop is",
      title: "Do not copy the same line",
      blocks: [
        {
          type: "lead",
          text: "A loop runs a block of lines again and again. You write the lines once. Python repeats them.",
        },
        {
          type: "p",
          text: "Printing Hello three times by copying print is fine. Printing it five hundred times by copying is not. The instruction is the same. Only the number of repeats changes. A loop is that instruction, plus a count.",
        },
        {
          type: "compare",
          left: {
            label: "Copied three times",
            tone: "neutral",
            code: 'print("Hello")\nprint("Hello")\nprint("Hello")',
            output: "Hello\nHello\nHello",
          },
          right: {
            label: "One line, three passes",
            tone: "good",
            code: 'for i in range(3):\n    print("Hello")',
            output: "Hello\nHello\nHello",
          },
        },
        {
          type: "p",
          text: "One trip through the body is a pass. range(3) makes three passes. The print runs on every pass. Change 3 to 500 and you get five hundred Hellos without copying anything.",
        },
        {
          type: "check",
          id: "c-why",
          question: "What is one pass?",
          options: [
            "The whole program",
            "One trip through the loop body",
            "The number written in range",
            "A line that runs after the loop",
          ],
          answer: 1,
          explain: "The body is the indented lines. Each time Python runs those lines, that is one pass.",
        },
      ],
    },
    {
      id: "anatomy",
      part: "Part 1 · What a loop is",
      title: "The shape of for",
      blocks: [
        {
          type: "p",
          text: "for looks a lot like if. There is a header, a colon, and an indented body. The header says which values to visit.",
        },
        {
          type: "anatomy",
          code: "for i in range(3):",
          parts: [
            { token: "for", label: "Starts the loop. It is a keyword." },
            { token: "i", label: "The **loop variable**. Each pass, it holds the next value. The name i is common. count or n is fine too." },
            { token: "in range(3)", label: "Where the values come from. range(3) gives 0, then 1, then 2." },
            { token: ":", label: "The colon. The body starts on the next indented lines." },
          ],
        },
        {
          type: "p",
          text: "The body is indented four spaces, same as an if body. A line that lines up with for is not in the loop. It runs once, after the passes are finished.",
        },
        {
          type: "check",
          id: "c-header",
          question: "Which header repeats the body three times?",
          options: ["for i in range(3)", "for i in range(3):", "for i range(3):", "range(3) for i:"],
          codeOptions: true,
          answer: 1,
          explain: "for, then the variable, then in, then range(...), then a colon.",
        },
      ],
    },
    {
      id: "passes",
      part: "Part 1 · What a loop is",
      title: "Same lines, new value",
      blocks: [
        {
          type: "p",
          text: "range(1, 4) gives 1, then 2, then 3. It stops before 4. The body is only the print. Walk the three passes before you run it.",
        },
        {
          type: "table",
          head: ["Pass", "i becomes", "The body prints"],
          rows: [
            ["1", "1", "1"],
            ["2", "2", "2"],
            ["3", "3", "3"],
            ["Stop", "4 is not given", "Nothing further"],
          ],
        },
        {
          type: "code",
          live: true,
          code: "for i in range(1, 4):\n    print(i)",
        },
        {
          type: "p",
          text: "The print line exists once in the program and runs three times. i is not always 1. It is updated at the start of each pass, then the body uses whatever it is now.",
        },
        {
          type: "check",
          id: "c-passes",
          question: "What does for i in range(1, 4): print(i) print?",
          options: ["1 2 3 4", "1 2 3", "0 1 2 3", "4"],
          answer: 1,
          explain: "The values are 1, 2 and 3. 4 is the stop, so it is not visited.",
        },
      ],
    },
    {
      id: "not-the-list",
      part: "Part 1 · What a loop is",
      title: "print(range(...)) does not list the numbers",
      blocks: [
        {
          type: "p",
          text: "range(5) is a recipe for the numbers, not the numbers printed out. Printing the recipe shows range(0, 5). The for loop is what follows the recipe, one number at a time.",
        },
        {
          type: "code",
          live: true,
          code: "print(range(5))\nfor i in range(5):\n    print(i)",
        },
        {
          type: "p",
          text: "The first line is the recipe. The loop then prints 0, 1, 2, 3 and 4 on their own lines. If you wanted the numbers, you needed the loop.",
        },
        {
          type: "check",
          id: "c-recipe",
          question: "What does print(range(5)) show?",
          options: ["0 1 2 3 4", "1 2 3 4 5", "range(0, 5)", "Five blank lines"],
          answer: 2,
          explain: "That print shows the range object. The for loop is what visits 0, 1, 2, 3 and 4.",
        },
      ],
    },
    {
      id: "from-zero",
      part: "Part 2 · range",
      title: "range(stop) starts at 0",
      blocks: [
        {
          type: "lead",
          text: "One number inside range means “start at 0, and stop before this number.”",
        },
        {
          type: "table",
          head: ["Call", "Values visited", "How many passes"],
          rows: [
            ["range(0)", "none", "0"],
            ["range(1)", "0", "1"],
            ["range(3)", "0, 1, 2", "3"],
            ["range(5)", "0, 1, 2, 3, 4", "5"],
          ],
        },
        {
          type: "p",
          text: "range(5) is five passes, and the numbers are 0 through 4. People expect 1 through 5. The start is 0 because counting from zero is the usual form when you only care how many times, not what the number is called. Hello does not use i. The five passes are the point, so range(5) fits.",
        },
        {
          type: "code",
          live: true,
          code: 'for i in range(5):\n    print("Hello", i)',
        },
        {
          type: "check",
          id: "c-zero",
          question: "Which numbers does range(5) visit?",
          options: ["1, 2, 3, 4, 5", "0, 1, 2, 3, 4", "0, 1, 2, 3, 4, 5", "5, 4, 3, 2, 1"],
          answer: 1,
          explain: "It starts at 0 and stops before 5. That is five numbers: 0, 1, 2, 3, 4.",
        },
      ],
    },
    {
      id: "start-stop",
      part: "Part 2 · range",
      title: "Start here, stop before there",
      blocks: [
        {
          type: "p",
          text: "Two numbers mean start, then stop. The start is included. The stop is not. range(1, 4) is 1, 2, 3. The 4 tells Python where to halt.",
        },
        {
          type: "p",
          text: "Say it as “from the start, up to but not including the stop.” If you can say that sentence about a call, you can predict the loop.",
        },
        {
          type: "code",
          live: true,
          code: "print(\"range(1, 4)\")\nfor i in range(1, 4):\n    print(i)\nprint(\"range(2, 6)\")\nfor i in range(2, 6):\n    print(i)",
        },
        {
          type: "p",
          text: "range(2, 6) prints 2, 3, 4, 5. Four numbers. 6 is absent. The number of passes is stop minus start: 6 - 2 is 4, and 4 - 1 is 3.",
        },
        {
          type: "check",
          id: "c-stop",
          question: "What is the last number printed by for i in range(2, 6): print(i)?",
          options: ["2", "5", "6", "4"],
          answer: 1,
          explain: "2 is included. 6 is not. The last visit is 5.",
        },
      ],
    },
    {
      id: "want-ten",
      part: "Part 2 · range",
      title: "Want 1 to 10? Stop at 11",
      blocks: [
        {
          type: "p",
          text: "This is the mistake the chapter is built around. You want the numbers 1 through 10. The stop is the first number you do not want. You do not want 11, so the call is range(1, 11).",
        },
        {
          type: "compare",
          left: {
            label: "Stops early",
            tone: "bad",
            code: "for i in range(1, 10):\n    print(i)",
            output: "1\n2\n3\n4\n5\n6\n7\n8\n9",
          },
          right: {
            label: "Includes 10",
            tone: "good",
            code: "for i in range(1, 11):\n    print(i)",
            output: "1\n2\n3\n4\n5\n6\n7\n8\n9\n10",
          },
        },
        {
          type: "callout",
          tone: "exam",
          text: "Write down the last number you want, then add 1. That sum is the stop. Last wanted is 10, stop is 11. Last wanted is 5, stop is 6. range(1, 6) is 1, 2, 3, 4, 5.",
        },
        {
          type: "check",
          id: "c-eleven",
          question: "You want i to be 1, 2, 3, 4, 5. Which call is that?",
          options: ["range(5)", "range(1, 5)", "range(1, 6)", "range(0, 5)"],
          codeOptions: true,
          answer: 2,
          explain: "Start at 1. The last wanted number is 5, so the stop is 6.",
        },
      ],
    },
    {
      id: "step",
      part: "Part 2 · range",
      title: "Step, including backwards",
      blocks: [
        {
          type: "p",
          text: "A third number is the step: how much to add after each pass. range(1, 10, 2) starts at 1, adds 2, and stops before 10. The values are 1, 3, 5, 7, 9.",
        },
        {
          type: "p",
          text: "A negative step counts down. range(5, 0, -1) starts at 5, subtracts 1, and stops before 0. The values are 5, 4, 3, 2, 1. Zero is the stop, so it is not printed. The step has to point toward the stop. range(5, 0) with no step tries to count up and never gets moving, so the body runs zero times.",
        },
        {
          type: "code",
          live: true,
          code: "print(\"odds\")\nfor i in range(1, 10, 2):\n    print(i)\nprint(\"down\")\nfor i in range(5, 0, -1):\n    print(i)",
        },
        {
          type: "check",
          id: "c-down",
          question: "What does range(5, 0, -1) visit?",
          options: ["5, 4, 3, 2, 1, 0", "5, 4, 3, 2, 1", "0, 1, 2, 3, 4", "Nothing"],
          answer: 1,
          explain: "Start at 5, step -1, stop before 0. The last visit is 1.",
        },
      ],
    },
    {
      id: "after",
      part: "Part 3 · The body and what follows",
      title: "Inside every pass, after once",
      blocks: [
        {
          type: "p",
          text: "Indentation decides the timing. Indented lines run on every pass. The next line that lines up with for runs once, after the last pass.",
        },
        {
          type: "code",
          live: true,
          code: 'for i in range(1, 4):\n    print("pass", i)\nprint("done")',
        },
        {
          type: "p",
          text: "You should see pass 1, pass 2, pass 3, then done once. If done is indented, it prints three times, once per pass. If the print of i is not indented, Python raises IndentationError, the same way an if body does.",
        },
        {
          type: "p",
          text: "After this loop finishes, i still holds 3, the last value it was given. The loop did not delete it. A later line can read i. Do not count on a value that was never produced: after range(1, 4), i is 3, not 4.",
        },
        {
          type: "check",
          id: "c-after",
          question: "print(\"done\") lines up with for, after the loop. How many times does it run?",
          options: ["Once, after the passes", "Once per pass", "Never", "Before the first pass"],
          answer: 0,
          explain: "It is not in the body, so the loop does not repeat it. It runs when the passes are over.",
        },
      ],
    },
    {
      id: "table",
      part: "Part 3 · The body and what follows",
      title: "A times table",
      blocks: [
        {
          type: "p",
          text: "The number stays still. i walks from 1 to 10. Each pass multiplies them. For the 4 times table the first pass is 4 x 1 = 4 and the last pass is 4 x 10 = 40.",
        },
        {
          type: "table",
          head: ["Pass", "i", "4 * i", "Printed"],
          rows: [
            ["1", "1", "4", "4 x 1 = 4"],
            ["2", "2", "8", "4 x 2 = 8"],
            ["…", "…", "…", "…"],
            ["10", "10", "40", "4 x 10 = 40"],
          ],
        },
        {
          type: "p",
          text: "i has to reach 10, so the stop is 11. range(1, 10) would end at 9 and the line 4 x 10 = 40 would be missing. There would be no error. The table would simply be short.",
        },
        {
          type: "code",
          live: true,
          inputs: ["4"],
          code: 'print("Number?")\nnumber = int(input())\nfor i in range(1, 11):\n    print(number, "x", i, "=", number * i)',
        },
        {
          type: "p",
          text: "Change 4 to 6 and run again. The loop is the same. Only the number being multiplied changed. That is the reason to read it with input() instead of writing a new program for each table.",
        },
        {
          type: "check",
          id: "c-table",
          question: "The 4 times table should include 4 x 10 = 40. Which range is right?",
          options: ["range(10)", "range(1, 10)", "range(1, 11)", "range(1, 10, 2)"],
          codeOptions: true,
          answer: 2,
          explain: "Start at 1 so there is no x 0 line. Stop at 11 so 10 is included.",
        },
      ],
    },
    {
      id: "total",
      part: "Part 3 · The body and what follows",
      title: "A total that survives the passes",
      blocks: [
        {
          type: "p",
          text: "i changes every pass, so it cannot remember the sum. The total lives outside the loop. Start it at 0. Each pass adds the current i onto it. After the loop, print it once.",
        },
        {
          type: "table",
          head: ["Pass", "i", "total before", "total after total = total + i"],
          rows: [
            ["start", "—", "0", "0"],
            ["1", "1", "0", "1"],
            ["2", "2", "1", "3"],
            ["3", "3", "3", "6"],
          ],
        },
        {
          type: "p",
          text: "That table is range(1, 4): 1 + 2 + 3 = 6. The same pattern through 5 is range(1, 6), and the total is 15. The print of total is after the loop. Printed inside, you would see 1, then 3, then 6, the total so far on every pass.",
        },
        {
          type: "code",
          live: true,
          code: "total = 0\nfor i in range(1, 6):\n    total = total + i\nprint(total)",
        },
        {
          type: "callout",
          tone: "warn",
          text: "Create total before the loop. total = total + i on the first pass needs a total that already exists. Creating it inside the loop would reset it to 0 on every pass.",
        },
        {
          type: "check",
          id: "c-total",
          question: "total starts at 0. The loop is range(1, 4), and each pass does total = total + i. What is printed after the loop?",
          options: ["3", "4", "6", "10"],
          answer: 2,
          explain: "The visits are 1, 2 and 3. 0 + 1 + 2 + 3 is 6. 4 is not visited.",
        },
      ],
    },
    {
      id: "while-shape",
      part: "Part 4 · while",
      title: "Repeat while a test is true",
      blocks: [
        {
          type: "lead",
          text: "for is for a recipe you already have, such as range. while is for “keep going as long as this is still true.”",
        },
        {
          type: "flow",
          title: "One while loop",
          steps: [
            { kind: "process", text: "Set the starting value, before the loop" },
            { kind: "decision", text: "Is the condition true?" },
            { kind: "process", text: "Yes: run the body" },
            { kind: "process", text: "The body changes the value" },
            { kind: "terminal", text: "No: skip the body and continue underneath" },
          ],
        },
        {
          type: "p",
          text: "The condition is checked at the start of every pass, including the first. If it is already false, the body never runs. If it is true, the body runs, then Python goes back and checks again.",
        },
        {
          type: "anatomy",
          code: "while n > 0:",
          parts: [
            { token: "while", label: "Starts this kind of loop. It is a keyword." },
            { token: "n > 0", label: "The condition, same kind you write in if. True means “do another pass”." },
            { token: ":", label: "The colon. The body is indented underneath." },
          ],
        },
        {
          type: "check",
          id: "c-while",
          question: "When does a while body run?",
          options: [
            "Once, always",
            "While the condition is true, and again after each pass",
            "Until the condition becomes true",
            "Only when the condition is false",
          ],
          answer: 1,
          explain: "Python checks the condition, runs the body if it is true, then checks again. A false check ends the loop.",
        },
      ],
    },
    {
      id: "countdown-table",
      part: "Part 4 · while",
      title: "A countdown, pass by pass",
      blocks: [
        {
          type: "p",
          text: "n starts at 3. The test is n > 0. Each pass prints n, then subtracts 1. When n becomes 0, the test fails and GO! prints once underneath.",
        },
        {
          type: "table",
          head: ["Check n > 0", "Body", "n afterwards"],
          rows: [
            ["3 > 0, true", "print 3", "2"],
            ["2 > 0, true", "print 2", "1"],
            ["1 > 0, true", "print 1", "0"],
            ["0 > 0, false", "skipped", "0"],
          ],
        },
        {
          type: "code",
          live: true,
          code: 'n = 3\nwhile n > 0:\n    print(n)\n    n = n - 1\nprint("GO!")',
        },
        {
          type: "p",
          text: "The subtract is inside the body, so it happens every pass. n = n - 1 is the same update you used with score = score + 5. The short spelling n -= 1 means the same thing. Either one is correct.",
        },
        {
          type: "check",
          id: "c-count-3",
          question: "n starts at 3 and the loop is while n > 0, printing n and then subtracting 1. What prints before GO!?",
          options: ["3 2 1 0", "3 2 1", "1 2 3", "3"],
          answer: 1,
          explain: "3, 2 and 1 pass the test. After printing 1, n becomes 0, the test fails, and 0 is not printed.",
        },
      ],
    },
    {
      id: "must-change",
      part: "Part 4 · while",
      title: "Something in the body must change",
      blocks: [
        {
          type: "p",
          text: "for moves to the next range value by itself. while does not. If the body never changes n, then n > 0 stays true forever. The loop never reaches the line underneath.",
        },
        {
          type: "compare",
          left: {
            label: "n never changes",
            tone: "bad",
            code: "n = 3\nwhile n > 0:\n    print(n)\nprint(\"GO!\")",
            output: "3 is printed again and again. GO! never runs.",
          },
          right: {
            label: "n gets smaller",
            tone: "good",
            code: "n = 3\nwhile n > 0:\n    print(n)\n    n = n - 1\nprint(\"GO!\")",
            output: "3\n2\n1\nGO!",
          },
        },
        {
          type: "callout",
          tone: "warn",
          text: "A loop that never ends is stopped for you after a few seconds, with a message that it ran too long. The fix is not to wait. The fix is a line inside the body that moves the condition toward false.",
        },
        {
          type: "check",
          id: "c-forever",
          question: "n = 3 and the body only prints n. The test is while n > 0. What happens?",
          options: [
            "It prints 3 once, then GO!",
            "It prints 3, 2, 1",
            "It keeps printing 3, because n stays 3",
            "SyntaxError",
          ],
          answer: 2,
          explain: "Nothing in the body changes n. 3 > 0 stays true, so the pass repeats.",
        },
      ],
    },
    {
      id: "which",
      part: "Part 4 · while",
      title: "for or while",
      blocks: [
        {
          type: "p",
          text: "Use for and range when you know the values before you start: three Hellos, the numbers 1 to 10, a countdown from 5 to 1. The recipe is the header. You do not update i yourself.",
        },
        {
          type: "p",
          text: "Use while when the stop depends on a test you update: “while we still have lives”, “while the guess is wrong”. You must change something in the body, or the test never becomes false.",
        },
        {
          type: "table",
          head: ["Job", "Fit"],
          rows: [
            ["Print Hello 5 times", "for i in range(5)"],
            ["Numbers 1 through 10", "for i in range(1, 11)"],
            ["5, 4, 3, 2, 1", "for i in range(5, 0, -1), or a while that subtracts"],
            ["Keep going until a value changes", "while, and update that value in the body"],
          ],
        },
        {
          type: "p",
          text: "Both of these countdowns print the same lines. The for version cannot forget the step, because the step is in the header. The while version is closer to the sentence “while n is still positive”.",
        },
        {
          type: "code",
          live: true,
          code: 'for i in range(5, 0, -1):\n    print(i)\nprint("GO!")',
        },
        {
          type: "check",
          id: "c-which",
          question: "You know you want exactly the numbers 1 through 10. Which fits?",
          options: [
            "while, and hope it stops",
            "for i in range(1, 11)",
            "for i in range(10)",
            "for i in range(1, 10)",
          ],
          codeOptions: true,
          answer: 1,
          explain: "The values are known. Start at 1, stop before 11. range(10) starts at 0. range(1, 10) stops at 9.",
        },
      ],
    },
    {
      id: "countdown-full",
      part: "Part 4 · while",
      title: "5, 4, 3, 2, 1, GO!",
      blocks: [
        {
          type: "p",
          text: "Start n at 5. While it is still above 0, print it and subtract 1. After the loop, print GO! unindented, so it appears once.",
        },
        {
          type: "code",
          live: true,
          code: 'n = 5\nwhile n > 0:\n    print(n)\n    n = n - 1\nprint("GO!")',
        },
        {
          type: "list",
          ordered: true,
          items: [
            "5, 4, 3, 2 and 1 each pass the test and get printed.",
            "After 1 is printed, n becomes 0.",
            "0 > 0 is false, so the body stops.",
            "GO! is outside, so it runs once.",
          ],
        },
        {
          type: "p",
          text: "If GO! is indented, it prints on every pass, between the numbers. If the subtract is missing, the program never arrives at GO!. Both of those are logic, not a new kind of error name.",
        },
        {
          type: "check",
          id: "c-go",
          question: "In that countdown, why is GO! not indented?",
          options: [
            "So it prints once, after 1",
            "So it prints on every pass",
            "Indentation does not matter in while",
            "So the loop never checks n > 0",
          ],
          answer: 0,
          explain: "A line that lines up with while runs after the loop ends. That is the one GO!.",
        },
      ],
    },
    {
      id: "terms",
      part: "Part 5 · Revise",
      title: "Key terms",
      blocks: [
        {
          type: "terms",
          items: [
            { term: "Loop", meaning: "A block that runs again and again." },
            { term: "Pass", meaning: "One trip through the body." },
            { term: "Body", meaning: "The indented lines. They run on every pass." },
            { term: "for", meaning: "Visits each value from a range, then stops." },
            { term: "Loop variable", meaning: "The name in the header, often i. It holds the current value." },
            { term: "range(stop)", meaning: "0, 1, 2, … stopping before stop. range(5) is 0, 1, 2, 3, 4." },
            { term: "range(start, stop)", meaning: "From start, up to but not including stop." },
            { term: "Step", meaning: "The third number. range(5, 0, -1) counts down to 1." },
            { term: "while", meaning: "Repeats while a condition is true. The body must change that condition." },
            { term: "Infinite loop", meaning: "A loop whose test never becomes false. It has to be stopped from outside." },
          ],
        },
      ],
    },
    {
      id: "exam",
      part: "Part 5 · Revise",
      title: "Exam corner",
      blocks: [
        {
          type: "lead",
          text: "Say the numbers out loud, including the one that is missing, then flip the card.",
        },
        {
          type: "flashcards",
          cards: [
            { q: "What is one pass?", a: "One run of the indented body." },
            { q: "What does range(5) visit?", a: "0, 1, 2, 3, 4. Five numbers, starting at 0, stopping before 5." },
            { q: "What does range(1, 4) visit?", a: "1, 2, 3. 4 is the stop, so it is not included." },
            { q: "How do you visit 1 through 10?", a: "range(1, 11). The stop is one past the last number you want." },
            { q: "What does range(1, 10) miss if you wanted a full times table?", a: "The line for 10. It stops at 9." },
            { q: "What does range(5, 0, -1) visit?", a: "5, 4, 3, 2, 1. It stops before 0." },
            { q: "What does print(range(5)) show?", a: "range(0, 5). The for loop is what prints each number." },
            { q: "Where do you create a running total?", a: "Before the loop, usually at 0. Add to it inside. Print it after." },
            { q: "What is 0 + 1 + 2 + 3 if those are the values of range(1, 4)?", a: "6." },
            { q: "When does the line under a loop run?", a: "Once, after the last pass, if it is not indented." },
            { q: "What must a while body do?", a: "Change something that the condition depends on, or the loop never ends." },
            { q: "n starts at 3, while n > 0, print n, then n = n - 1. What prints?", a: "3, 2, 1. Then the test fails. 0 is not printed." },
          ],
        },
        {
          type: "check",
          id: "c-exam-range",
          question: "How many passes does for i in range(1, 11) make?",
          options: ["10", "11", "9", "1"],
          answer: 0,
          explain: "The values are 1 through 10. That is 11 - 1 = 10 passes.",
        },
        {
          type: "check",
          id: "c-exam-while",
          question: "Which countdown ends?",
          options: [
            "n = 5 then while n > 0: print(n)",
            "n = 5 then while n > 0: print(n) and n = n - 1",
            "n = 5 then while n > 0: n = n + 1",
            "while True: print(n)",
          ],
          answer: 1,
          explain: "Subtracting 1 moves n toward 0, so the test eventually fails. Adding 1 moves it the wrong way. A body that only prints never changes n.",
        },
      ],
    },
    {
      id: "recap",
      part: "Part 5 · Revise",
      title: "Chapter summary",
      blocks: [
        {
          type: "list",
          items: [
            "A loop runs an indented body once per pass. The line after the loop runs once.",
            "range(5) is 0, 1, 2, 3, 4. range(1, 4) is 1, 2, 3. The stop number is not included.",
            "To include 10, stop at 11. range(1, 11) is 1 through 10.",
            "A third number is the step. range(5, 0, -1) is 5, 4, 3, 2, 1.",
            "A running total is created before the loop and updated inside it.",
            "while repeats while a test is true. The body must change that test, or the loop does not end.",
          ],
        },
        {
          type: "callout",
          tone: "fact",
          title: "Next up",
          text: "The Examples step through three passes, a running total, and a countdown. Then you print Hello a set number of times, count to 5, build a times table, and finish 5, 4, 3, 2, 1, GO!",
        },
      ],
    },
  ],

  examples: [
    {
      type: "trace",
      id: "trace-three",
      title: "Three passes, then stop",
      intro: "range(1, 4) never produces 4. Watch i change, and watch the same print run again.",
      code: "for i in range(1, 4):\n    print(i)",
      steps: [
        { line: 1, note: "Pass 1 starts. i becomes 1. 4 is only the stop." },
        { line: 2, output: "1", note: "The body prints the current i." },
        { line: 1, note: "Pass 2 starts. i becomes 2. The header runs the update. You do not write i = i + 1." },
        { line: 2, output: "2", note: "Same print line. New value." },
        { line: 1, note: "Pass 3 starts. i becomes 3." },
        { line: 2, output: "3", note: "Third pass." },
        { line: 1, note: "The next value would be 4, which is the stop, so there is no fourth pass. The loop ends with i still holding 3." },
      ],
    },
    {
      type: "trace",
      id: "trace-zero",
      title: "range(3) includes 0 and skips 3",
      intro: "Three passes again, but the values are 0, 1 and 2. Say them before you step.",
      code: "for i in range(3):\n    print(i)",
      steps: [
        { line: 1, note: "One number means start at 0 and stop before 3." },
        { line: 2, output: "0", note: "First pass. i is 0." },
        { line: 1, note: "i becomes 1." },
        { line: 2, output: "1", note: "Second pass." },
        { line: 1, note: "i becomes 2." },
        { line: 2, output: "2", note: "Third pass. 3 is not a value. The loop had three passes because 3 - 0 is 3." },
      ],
    },
    {
      type: "trace",
      id: "trace-total",
      title: "1 + 2 + 3, kept outside the loop",
      intro: "total remembers. i does not. Follow the total column.",
      code: "total = 0\nfor i in range(1, 4):\n    total = total + i\nprint(total)",
      steps: [
        { line: 1, note: "total is created before any pass. It holds 0." },
        { line: 2, note: "Pass 1. i becomes 1." },
        { line: 3, note: "0 + 1 is stored back into total. total is now 1." },
        { line: 2, note: "Pass 2. i becomes 2." },
        { line: 3, note: "1 + 2 is 3. total is now 3." },
        { line: 2, note: "Pass 3. i becomes 3." },
        { line: 3, note: "3 + 3 is 6. total is now 6. The next i would be 4, so the loop stops." },
        { line: 4, output: "6", note: "This print is not indented, so it runs once. 1 + 2 + 3 is 6." },
      ],
    },
    {
      type: "trace",
      id: "trace-while",
      title: "while checks, then the body updates",
      intro: "n starts at 3. Each pass prints it and then makes it smaller. GO! is waiting outside.",
      code: 'n = 3\nwhile n > 0:\n    print(n)\n    n = n - 1\nprint("GO!")',
      steps: [
        { line: 1, note: "n holds 3, before the loop." },
        { line: 2, note: "Check: 3 > 0 is true. Enter the body." },
        { line: 3, output: "3", note: "Print the current n." },
        { line: 4, note: "n becomes 2. This is the line that lets the loop end later." },
        { line: 2, note: "Check again: 2 > 0 is true." },
        { line: 3, output: "2", note: "Second pass." },
        { line: 4, note: "n becomes 1." },
        { line: 2, note: "Check: 1 > 0 is true." },
        { line: 3, output: "1", note: "Third pass." },
        { line: 4, note: "n becomes 0." },
        { line: 2, note: "Check: 0 > 0 is false. The body is skipped. 0 is not printed." },
        { line: 5, output: "GO!", note: "The line under the loop runs once." },
      ],
    },
    {
      type: "playground",
      id: "play-hello",
      title: "Hello, four times",
      intro: "One print, four passes. You do not need the value of i. You need the count.",
      starter: "# print Hello four times\n",
      tryThis: ["Use for and range(4)", "Indent the print", "Change 4 to 2, run, then put 4 back"],
      goal: {
        text: "Print Hello on exactly four lines, using for and range.",
        check: (r, code) => {
          const hellos = r.stdout.split("\n").filter((line) => line.trim() === "Hello");
          return r.ok && /\bfor\b/.test(code) && /range\s*\(/.test(code) && hellos.length === 4;
        },
        success: "One print line. Four passes.",
      },
    },
    {
      type: "playground",
      id: "play-count",
      title: "Count from 1 through 5",
      intro: "The last number you want is 5. The stop has to be the next number after that.",
      starter: "# print 1, 2, 3, 4 and 5, each on its own line\n",
      tryThis: ["Start the range at 1", "Stop at 6, not at 5", "Run it and count the lines"],
      goal: {
        text: "The output must be exactly 1, 2, 3, 4, 5. Use for and range.",
        check: (r, code) =>
          r.ok &&
          /\bfor\b/.test(code) &&
          /range\s*\(/.test(code) &&
          r.stdout.trim() === "1\n2\n3\n4\n5",
        success: "range(1, 6) includes 5 and stops before 6.",
      },
    },
    {
      type: "playground",
      id: "play-table",
      title: "The times table through 10",
      intro: "Read a number, then print x 1 through x 10. Leave the keyboard answer as 6 so the last line can be checked.",
      starter: 'print("Number?")\nnumber = int(input())\n# 6 x 1 = 6 through 6 x 10 = 60\n',
      inputs: "6",
      tryThis: ["Loop i from 1 through 10", "Print number, x, i, and the product", "The stop that includes 10 is 11"],
      goal: {
        text: "With answer 6, include the lines 6 x 1 = 6 and 6 x 10 = 60, and do not print a 0 row or an 11 row.",
        check: (r, code) => {
          const lines = r.stdout.split("\n").map((line) => line.trim());
          return (
            r.ok &&
            /\bfor\b/.test(code) &&
            /range\s*\(/.test(code) &&
            lines.includes("6 x 1 = 6") &&
            lines.includes("6 x 10 = 60") &&
            !lines.includes("6 x 0 = 0") &&
            !lines.includes("6 x 11 = 66")
          );
        },
        success: "Ten rows. The stop was 11, so 10 was included and 11 was not.",
      },
    },
    {
      type: "playground",
      id: "play-bugs",
      title: "Bug hunt: the table stops at 9",
      intro: "It runs. The last row is wrong. You want 1 through 10 for the number 3. Do not start a row at 0.",
      starter: 'print("Number?")\nnumber = int(input())\nfor i in range(1, 10):\n    print(number, "x", i, "=", number * i)',
      inputs: "3",
      tryThis: [
        "Run it and look at the last line",
        "10 is missing because the stop is 10",
        "Change the stop so 10 is visited and 11 is not",
      ],
      goal: {
        text: "Keep the answer as 3. The output must include 3 x 10 = 30 and 3 x 1 = 3, and must not include 3 x 11 = 33.",
        check: (r, code) => {
          const lines = r.stdout.split("\n").map((line) => line.trim());
          return (
            r.ok &&
            /range\s*\(\s*1\s*,\s*11\s*\)/.test(code) &&
            lines.includes("3 x 1 = 3") &&
            lines.includes("3 x 10 = 30") &&
            !lines.includes("3 x 11 = 33")
          );
        },
        success: "The last wanted number is 10, so the stop is 11.",
      },
    },
  ],

  practice: [
    {
      type: "mcq",
      id: "q-pass",
      level: "easy",
      skill: "What a pass is",
      prompt: "What is one pass through a loop?",
      options: ["The header only", "One run of the indented body", "The line after the loop", "The stop number"],
      answer: 1,
      explain: "The body is the indented lines. Each time they run, that is one pass.",
    },
    {
      type: "mcq",
      id: "q-range5",
      level: "easy",
      skill: "range(stop)",
      prompt: "Which numbers does range(5) visit?",
      options: ["1, 2, 3, 4, 5", "0, 1, 2, 3, 4", "0, 1, 2, 3, 4, 5", "5"],
      answer: 1,
      explain: "A single number starts at 0 and stops before that number. Five passes: 0 through 4.",
    },
    {
      type: "mcq",
      id: "q-range14",
      level: "easy",
      skill: "Stop is excluded",
      prompt: "What does for i in range(1, 4): print(i) print?",
      options: ["1, 2, 3, 4", "1, 2, 3", "0, 1, 2, 3", "4"],
      answer: 1,
      explain: "1 is included. 4 is the stop, so the visits are 1, 2 and 3.",
    },
    {
      type: "mcq",
      id: "q-how-many",
      level: "medium",
      skill: "Count the passes",
      prompt: "How many passes does range(1, 11) make?",
      options: ["11", "10", "9", "1"],
      answer: 1,
      explain: "The values are 1 through 10. 11 - 1 is 10 passes.",
    },
    {
      type: "fill",
      id: "q-fill-stop",
      level: "easy",
      skill: "Choose the stop",
      prompt: "Fill the stop so the loop prints 1, 2 and 3.",
      code: "for i in range(1, ___):",
      answers: ["4"],
      mode: "code",
      placeholder: "4",
      explain: "The last wanted number is 3, so the stop is 4.",
    },
    {
      type: "fill",
      id: "q-fill-in",
      level: "easy",
      skill: "The for header",
      prompt: "Fill the missing keyword.",
      code: "for i ___ range(3):",
      answers: ["in"],
      mode: "code",
      placeholder: "in",
      explain: "The header is for, the variable, in, then range.",
    },
    {
      type: "mcq",
      id: "q-ten",
      level: "medium",
      skill: "Include the last number",
      prompt: "You want 1 through 10. Which call is that?",
      options: ["range(10)", "range(1, 10)", "range(1, 11)", "range(0, 10)"],
      codeOptions: true,
      answer: 2,
      explain: "Start at 1. Stop one past 10, which is 11. range(1, 10) ends at 9.",
    },
    {
      type: "mcq",
      id: "q-print-range",
      level: "medium",
      skill: "Printing a range",
      prompt: "What does print(range(5)) show?",
      options: ["0 1 2 3 4", "1 2 3 4 5", "range(0, 5)", "5"],
      answer: 2,
      explain: "Printing the range shows the recipe. A for loop is what visits each number.",
    },
    {
      type: "mcq",
      id: "q-down",
      level: "medium",
      skill: "Counting down",
      prompt: "What does range(5, 0, -1) visit?",
      options: ["5, 4, 3, 2, 1, 0", "5, 4, 3, 2, 1", "1, 2, 3, 4, 5", "Nothing"],
      answer: 1,
      explain: "Start at 5, subtract 1, stop before 0. The last value is 1.",
    },
    {
      type: "mcq",
      id: "q-step",
      level: "hard",
      skill: "A step of 2",
      prompt: "What does range(1, 10, 2) visit?",
      options: ["1, 2, 3, 4, 5, 6, 7, 8, 9", "1, 3, 5, 7, 9", "2, 4, 6, 8, 10", "1, 3, 5, 7, 9, 11"],
      answer: 1,
      explain: "Start at 1, add 2 each time, stop before 10. 9 is in. 10 and 11 are not.",
    },
    {
      type: "mcq",
      id: "q-up-empty",
      level: "hard",
      skill: "Step must head toward the stop",
      prompt: "How many passes does range(5, 0) make, with no third number?",
      options: ["5", "6", "0", "1"],
      answer: 2,
      explain: "The default step is +1, which walks away from a stop of 0. The body never runs.",
    },
    {
      type: "mcq",
      id: "q-after",
      level: "easy",
      skill: "After the loop",
      prompt: "A print lines up with for, below the loop. When does it run?",
      options: ["Once per pass", "Once, after the last pass", "Before the loop", "Never"],
      answer: 1,
      explain: "It is not indented, so it is not in the body. It runs when the passes are finished.",
    },
    {
      type: "mcq",
      id: "q-last-i",
      level: "medium",
      skill: "The variable after the loop",
      prompt: "After for i in range(1, 4) finishes, what does i hold?",
      options: ["1", "3", "4", "It no longer exists"],
      answer: 1,
      explain: "The last value produced was 3. The stop, 4, was never stored in i.",
    },
    {
      type: "mcq",
      id: "q-sum",
      level: "medium",
      skill: "A running total",
      prompt: "total starts at 0. Each pass of range(1, 4) does total = total + i. What is total afterwards?",
      options: ["3", "4", "6", "10"],
      answer: 2,
      explain: "The values are 1, 2 and 3. Their sum is 6.",
    },
    {
      type: "mcq",
      id: "q-reset",
      level: "hard",
      skill: "Where the total is created",
      prompt: "total = 0 is indented inside the loop, above total = total + i. What goes wrong?",
      options: [
        "Nothing",
        "The total is reset at the start of every pass",
        "SyntaxError",
        "The loop never starts",
      ],
      answer: 1,
      explain: "Creating total inside the loop throws away the previous pass. Create it once, before the for.",
    },
    {
      type: "mcq",
      id: "q-while-when",
      level: "easy",
      skill: "while",
      prompt: "When does a while body run?",
      options: [
        "Once",
        "Whenever the condition is true, then the condition is checked again",
        "Only when the condition is false",
        "A fixed five times",
      ],
      answer: 1,
      explain: "The condition is checked before every pass. A false result ends the loop.",
    },
    {
      type: "mcq",
      id: "q-forever",
      level: "medium",
      skill: "A loop that cannot end",
      prompt: "n = 3 and the body of while n > 0 only prints n. What happens?",
      options: [
        "It prints 3, 2, 1",
        "It prints 3 once",
        "It keeps printing 3, because n never changes",
        "SyntaxError",
      ],
      answer: 2,
      explain: "while does not change n for you. 3 > 0 stays true.",
    },
    {
      type: "mcq",
      id: "q-which",
      level: "medium",
      skill: "for or while",
      prompt: "You want exactly the numbers 1 through 10. Which header fits?",
      options: ["while i > 10:", "for i in range(10):", "for i in range(1, 11):", "for i in range(1, 10):"],
      codeOptions: true,
      answer: 2,
      explain: "The values are known in advance. Start at 1 and stop before 11.",
    },
    {
      type: "fill",
      id: "q-fill-down",
      level: "medium",
      skill: "Predict a countdown",
      prompt: "What numbers print, from top to bottom? Type them on one line with spaces.",
      code: "n = 3\nwhile n > 0:\n    print(n)\n    n = n - 1",
      answers: ["3 2 1", "3, 2, 1"],
      mode: "text",
      explain: "3, 2 and 1 are printed. Then n is 0, the test fails, and 0 is not printed.",
    },
    {
      type: "order",
      id: "q-order-for",
      level: "medium",
      skill: "Order a for loop",
      prompt: "Put the lines in an order that prints 1, 2, 3 and then the word done once.",
      lines: ["for i in range(1, 4):", "    print(i)", 'print("done")'],
      code: true,
      explain: "The header comes first, then the indented print, then the unindented done so it runs after the three passes.",
    },
    {
      type: "order",
      id: "q-order-while",
      level: "hard",
      skill: "Order a while loop",
      prompt: "Put the lines in an order that prints 3, 2, 1 and then GO! once.",
      lines: ["n = 3", "while n > 0:", "    print(n)", "    n = n - 1", 'print("GO!")'],
      code: true,
      explain: "Set n first. The while header comes before the body. Subtract inside the body. GO! stays outside so it runs once.",
    },
    {
      type: "mcq",
      id: "q-table-last",
      level: "hard",
      skill: "The last row of a table",
      prompt: "number is 4 and the loop is range(1, 10). What is the last line?",
      options: ["4 x 10 = 40", "4 x 9 = 36", "4 x 1 = 4", "4 x 11 = 44"],
      answer: 1,
      explain: "range(1, 10) stops before 10. The last i is 9, so the last line is 4 x 9 = 36.",
    },
    {
      type: "write",
      id: "q-write-hello",
      level: "easy",
      skill: "Repeat a print",
      prompt: "Using for and range, print Hello exactly three times, once per line.\n\nOutput must be:\nHello\nHello\nHello",
      starter: "",
      expected: "Hello\nHello\nHello",
      check: (_r, code) => {
        if (!/\bfor\b/.test(code) || !/range\s*\(/.test(code)) return "Use for and range, not three copied prints.";
        return null;
      },
      hint: 'for i in range(3): then print("Hello"), indented.',
      solution: 'for i in range(3):\n    print("Hello")',
    },
    {
      type: "write",
      id: "q-write-count",
      level: "easy",
      skill: "1 through 5",
      prompt: "Print the numbers 1 through 5, each on its own line. Include 5. Do not include 0 or 6.\n\nOutput must be:\n1\n2\n3\n4\n5",
      starter: "",
      expected: "1\n2\n3\n4\n5",
      check: (_r, code) => {
        if (!/\bfor\b/.test(code) || !/range\s*\(/.test(code)) return "Use for and range.";
        return null;
      },
      hint: "for i in range(1, 6): print(i). The stop is 6 so that 5 is included.",
      solution: "for i in range(1, 6):\n    print(i)",
    },
    {
      type: "write",
      id: "q-write-sum",
      level: "medium",
      skill: "A running total",
      prompt:
        "Add the numbers 1 through 5. Create total before the loop, add i on each pass, and print total once after the loop.\n\nOutput must be:\n15",
      starter: "total = 0\n",
      expected: "15",
      check: (_r, code) => {
        if (!/\bfor\b/.test(code) || !/range\s*\(/.test(code)) return "Use a for loop over the numbers.";
        if (!/total\s*=\s*total\s*\+|total\s*\+=/.test(code)) return "Update the total inside the loop: total = total + i.";
        return null;
      },
      hint: "for i in range(1, 6): total = total + i, then print(total) unindented.",
      solution: "total = 0\nfor i in range(1, 6):\n    total = total + i\nprint(total)",
    },
    {
      type: "write",
      id: "q-write-table",
      level: "hard",
      skill: "Times table",
      prompt:
        "Print Number? and read a whole number. Print its 1 to 10 times table. Each line looks like 4 x 1 = 4, with spaces around x and =.\n\nThe checker types:\n4\n\nThe output must include 4 x 1 = 4 and end with 4 x 10 = 40:\nNumber?\n4 x 1 = 4\n4 x 2 = 8\n4 x 3 = 12\n4 x 4 = 16\n4 x 5 = 20\n4 x 6 = 24\n4 x 7 = 28\n4 x 8 = 32\n4 x 9 = 36\n4 x 10 = 40",
      starter: 'print("Number?")\n',
      inputs: ["4"],
      expected:
        "Number?\n4 x 1 = 4\n4 x 2 = 8\n4 x 3 = 12\n4 x 4 = 16\n4 x 5 = 20\n4 x 6 = 24\n4 x 7 = 28\n4 x 8 = 32\n4 x 9 = 36\n4 x 10 = 40",
      check: (_r, code) => {
        if (!/\bfor\b/.test(code) || !/range\s*\(/.test(code)) return "Use for and range.";
        if (!/range\s*\(\s*1\s*,\s*11\s*\)/.test(code)) return "Visit 1 through 10 with range(1, 11).";
        return null;
      },
      hint: 'for i in range(1, 11): print(number, "x", i, "=", number * i)',
      solution:
        'print("Number?")\nnumber = int(input())\nfor i in range(1, 11):\n    print(number, "x", i, "=", number * i)',
    },
    {
      type: "write",
      id: "q-challenge",
      level: "hard",
      skill: "Mini challenge",
      challenge: true,
      prompt:
        "Print a countdown with while.\n• Start n at 5\n• While n is still above 0, print n and then subtract 1\n• After the loop, print GO!\n\nOutput must be:\n5\n4\n3\n2\n1\nGO!",
      starter: "n = 5\n",
      expected: "5\n4\n3\n2\n1\nGO!",
      check: (_r, code) => {
        if (!/\bwhile\b/.test(code)) return "Use while, not only a for loop.";
        if (!/n\s*=\s*n\s*-\s*1|n\s*-=\s*1/.test(code)) return "Inside the body, make n smaller: n = n - 1.";
        return null;
      },
      hint: 'while n > 0: print(n), then n = n - 1. print("GO!") lines up with while.',
      solution: 'n = 5\nwhile n > 0:\n    print(n)\n    n = n - 1\nprint("GO!")',
    },
  ],
};
