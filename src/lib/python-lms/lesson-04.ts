import type { PythonLmsLesson } from "@/lib/python-lms/types";

export const LESSON_04: PythonLmsLesson = {
  slug: "lesson-4",
  number: 4,
  title: "Making Decisions with if",
  subtitle: "Programs that choose",
  minutes: 60,
  goals: [
    "Write an if and an else, with the body indented",
    "Choose the right comparison: ==  !=  >  <  >=  <=",
    "Use elif when there are more than two paths",
    "Put the tests in an order so the first true one is the one you want",
    "Tell = from ==, and read TypeError when a string is compared with a number",
  ],
  canDo: "Write if / elif / else using all six comparison operators.",

  notes: [
    {
      id: "why",
      part: "Part 1 · A program that chooses",
      title: "Same program, two paths",
      blocks: [
        {
          type: "lead",
          text: "Until now every line ran. A decision lets some lines run only when a condition is true, and other lines run when it is not.",
        },
        {
          type: "p",
          text: "A game that always prints “You can play!” is wrong for a seven-year-old if the rule is “10 or older”. The rule has to be in the program. if is how you write it.",
        },
        {
          type: "flow",
          title: "One decision",
          steps: [
            { kind: "process", text: "Work out the condition. It is either True or False" },
            { kind: "decision", text: "Is it True?" },
            { kind: "process", text: "Yes: run the indented lines under if" },
            { kind: "process", text: "No: skip them. Run the else lines if there is an else" },
            { kind: "terminal", text: "Continue with the next line that is not indented" },
          ],
        },
        {
          type: "check",
          id: "c-why",
          question: "What is the job of if?",
          options: [
            "Repeat a line many times",
            "Run some lines only when a condition is true",
            "Convert text into a number",
            "Ask the keyboard for input",
          ],
          answer: 1,
          explain: "if chooses. The indented lines run only when the condition is true. The other lines are skipped.",
        },
      ],
    },
    {
      id: "anatomy",
      part: "Part 1 · A program that chooses",
      title: "The shape of an if",
      blocks: [
        {
          type: "p",
          text: "An if has a condition, a colon, and a body. The body is the lines that belong to that decision. They are indented.",
        },
        {
          type: "anatomy",
          code: "if age >= 10:",
          parts: [
            { token: "if", label: "Starts the decision. It is a keyword, so it cannot be a variable name." },
            { token: "age >= 10", label: "The **condition**. Python works this out first. The result is True or False." },
            { token: ":", label: "The **colon** is required. It means “the body starts on the next lines”." },
          ],
        },
        {
          type: "code",
          code: 'if age >= 10:\n    print("You can play!")',
        },
        {
          type: "p",
          text: "The print is indented four spaces. Those four spaces are the block. Python uses them to know that this print belongs to the if, and that a later line with no indent does not.",
        },
        {
          type: "check",
          id: "c-colon",
          question: "Which line is a legal start to a decision?",
          options: ["if age >= 10", "if age >= 10:", "if: age >= 10", "age >= 10 if:"],
          codeOptions: true,
          answer: 1,
          explain: "The condition comes after if, and the line must end with a colon.",
        },
      ],
    },
    {
      id: "yes-path",
      part: "Part 1 · A program that chooses",
      title: "The true path",
      blocks: [
        {
          type: "p",
          text: "Run this with age 12. 12 >= 10 is True, so the indented print runs. Change the keyboard answer to 9 and run again. 9 >= 10 is False, so that print is skipped and the program ends with no second line.",
        },
        {
          type: "code",
          live: true,
          inputs: ["12"],
          code: 'print("Age?")\nage = int(input())\nif age >= 10:\n    print("You can play!")\nprint("Done")',
        },
        {
          type: "p",
          text: "Done is not indented, so it is not inside the if. It runs whether the condition was true or false. That is how you tell a line that always happens from a line that only happens inside the decision.",
        },
        {
          type: "check",
          id: "c-done",
          question: "In that program, age is 9. What is printed?",
          options: ["You can play! then Done", "Done", "Nothing", "An error"],
          answer: 1,
          explain: "9 >= 10 is False, so the indented print is skipped. Done is outside the if, so it still runs.",
        },
      ],
    },
    {
      id: "else",
      part: "Part 1 · A program that chooses",
      title: "else is the other path",
      blocks: [
        {
          type: "p",
          text: "else runs when the if condition is false. It lines up with if, not with the body. It has a colon and its own indented body. It does not have a condition of its own.",
        },
        {
          type: "code",
          live: true,
          inputs: ["8"],
          code: 'print("Age?")\nage = int(input())\nif age >= 10:\n    print("You can play!")\nelse:\n    print("You cannot play yet.")',
        },
        {
          type: "p",
          text: "With 8, the if is false, so only the else print runs. Change the keyboard answer to 10. 10 >= 10 is true, so the if print runs and the else print does not. One of the two messages appears. Never both.",
        },
        {
          type: "callout",
          tone: "exam",
          text: "if and else are partners. Exactly one of them runs. There is no third possibility unless you add elif.",
        },
        {
          type: "check",
          id: "c-else",
          question: "age is 10 and the test is age >= 10. Which message prints?",
          options: ["You can play!", "You cannot play yet.", "Both messages", "Neither message"],
          answer: 0,
          explain: ">= means “greater than or equal”. 10 is included, so the if body runs and else is skipped.",
        },
      ],
    },
    {
      id: "indent",
      part: "Part 1 · A program that chooses",
      title: "Indentation is part of the program",
      blocks: [
        {
          type: "p",
          text: "In Python the spaces at the start of a line change what the program means. The usual indent is four spaces. Every line in the same block starts at the same column.",
        },
        {
          type: "compare",
          left: {
            label: "The body is indented",
            tone: "good",
            code: 'if age >= 10:\n    print("You can play!")\n    print("Have fun")',
            output: "Both prints belong to the if.",
          },
          right: {
            label: "The body was not indented",
            tone: "bad",
            code: "if 1 == 1:\nprint(\"hi\")",
            output: "IndentationError: expected an indented block",
          },
        },
        {
          type: "p",
          text: "else lines up with if. The print under else is indented again. A line placed between the if body and else, at the same column as if, breaks the pair. Python then reports a syntax error on else, because else has nothing left to attach to.",
        },
        {
          type: "code",
          live: true,
          code: 'if 1 == 1:\nprint("hi")',
        },
        {
          type: "check",
          id: "c-indent",
          question: "Where does the body of an if start?",
          options: [
            "On the same line, after the colon",
            "On the next lines, indented further than if",
            "On the next line, in the same column as if",
            "Anywhere, as long as there is a colon",
          ],
          answer: 1,
          explain: "The colon ends the header. The body is the following lines that are indented.",
        },
      ],
    },
    {
      id: "two-lines",
      part: "Part 1 · A program that chooses",
      title: "A block can hold more than one line",
      blocks: [
        {
          type: "p",
          text: "Every indented line under the if runs when the condition is true, from top to bottom. When the condition is false, the whole block is skipped.",
        },
        {
          type: "code",
          live: true,
          inputs: ["12"],
          code: 'print("Age?")\nage = int(input())\nif age >= 10:\n    print("You can play!")\n    print("Have fun")\nelse:\n    print("You cannot play yet.")\n    print("See you later")\nprint("Done")',
        },
        {
          type: "p",
          text: "With 12 you should see You can play!, Have fun, and Done. See you later belongs to else, so it stays hidden. With 8 you should see the two else lines and Done, and not the if lines.",
        },
        {
          type: "check",
          id: "c-block",
          question: "age is 12. Which lines run?",
          options: [
            "Only You can play!",
            "You can play!, Have fun, and Done",
            "All five prints",
            "Have fun and See you later",
          ],
          answer: 1,
          explain: "The whole if block runs, the whole else block is skipped, and Done is outside so it runs.",
        },
      ],
    },
    {
      id: "six",
      part: "Part 2 · Comparisons",
      title: "Six ways to compare",
      blocks: [
        {
          type: "lead",
          text: "A condition is a comparison. It produces True or False, and if uses that result. These six operators are the whole set for this chapter.",
        },
        {
          type: "table",
          head: ["You mean", "Operator", "Example", "Result"],
          rows: [
            ["Exactly equal", "==", "10 == 10", "True"],
            ["Not equal", "!=", "10 != 8", "True"],
            ["Greater than", ">", "10 > 10", "False"],
            ["Less than", "<", "8 < 10", "True"],
            ["Greater than or equal", ">=", "10 >= 10", "True"],
            ["Less than or equal", "<=", "10 <= 9", "False"],
          ],
        },
        {
          type: "code",
          live: true,
          code: "print(10 == 10)\nprint(10 != 8)\nprint(10 > 10)\nprint(8 < 10)\nprint(10 >= 10)\nprint(10 <= 9)",
        },
        {
          type: "p",
          text: "Read the operator in English before you write it. “At least 10” includes 10, so it is >=. “More than 10” does not include 10, so it is >. “Under 10” is <. “10 or under” is <=. “Exactly 10” is ==. “Anything except 10” is !=.",
        },
        {
          type: "check",
          id: "c-at-least",
          question: "The rule is “at least 10”. Which condition matches?",
          options: ["age > 10", "age >= 10", "age < 10", "age = 10"],
          codeOptions: true,
          answer: 1,
          explain: "At least 10 means 10 is allowed. That is >=. A plain > would reject a player who is exactly 10.",
        },
      ],
    },
    {
      id: "boundary",
      part: "Part 2 · Comparisons",
      title: "The equal value is the boundary",
      blocks: [
        {
          type: "p",
          text: "Most wrong answers in this chapter are off by one at the boundary. 90 is excellent if the rule is “90 or more”. 90 is not excellent if the rule is “more than 90”.",
        },
        {
          type: "compare",
          left: {
            label: "90 is included",
            tone: "good",
            code: "score = 90\nif score >= 90:\n    print(\"Excellent\")\nelse:\n    print(\"Not excellent\")",
            output: "Excellent",
          },
          right: {
            label: "90 is not included",
            tone: "neutral",
            code: "score = 90\nif score > 90:\n    print(\"Excellent\")\nelse:\n    print(\"Not excellent\")",
            output: "Not excellent",
          },
        },
        {
          type: "code",
          live: true,
          inputs: ["90"],
          code: 'print("Score?")\nscore = int(input())\nif score >= 90:\n    print("Excellent")\nelse:\n    print("Not excellent")',
        },
        {
          type: "p",
          text: "Leave the answer at 90 and you get Excellent. Change it to 89 and you get Not excellent. The operator did not change. The boundary did the work.",
        },
        {
          type: "check",
          id: "c-boundary",
          question: "score is 90 and the test is score > 90. What happens?",
          options: ["The if body runs", "The else body runs", "Both run", "TypeError"],
          answer: 1,
          explain: "90 > 90 is False. The equal value fails a strict > test, so else runs.",
        },
      ],
    },
    {
      id: "assign-vs-eq",
      part: "Part 2 · Comparisons",
      title: "= stores, == compares",
      blocks: [
        {
          type: "p",
          text: "One equals sign stores a value. Two equals signs ask whether two values are the same. A condition needs the question, so it needs ==.",
        },
        {
          type: "compare",
          left: {
            label: "Stores 10",
            tone: "neutral",
            code: "score = 10",
            output: "No output. score now holds 10.",
          },
          right: {
            label: "Asks a question",
            tone: "good",
            code: "print(score == 10)",
            output: "True",
          },
        },
        {
          type: "p",
          text: "Writing if score = 10: is a syntax error. Python refuses the line before the program runs. The message is SyntaxError: invalid syntax. The fix is if score == 10:.",
        },
        {
          type: "code",
          live: true,
          code: "score = 10\nif score = 10:\n    print(\"yes\")",
        },
        {
          type: "callout",
          tone: "warn",
          text: ">= and <= and != already contain an equals sign as part of the operator. Do not add a second one. The legal operators are ==, !=, >, <, >= and <=.",
        },
        {
          type: "check",
          id: "c-eq",
          question: "Which condition asks whether score is exactly 10?",
          options: ["if score = 10:", "if score == 10:", "if score === 10:", "if score != 10:"],
          codeOptions: true,
          answer: 1,
          explain: "== compares. A single = tries to assign, which is illegal in a condition. Python has no ===.",
        },
      ],
    },
    {
      id: "types",
      part: "Part 2 · Comparisons",
      title: "Both sides need a matching type",
      blocks: [
        {
          type: "p",
          text: "12 == \"12\" is False. One side is an int and the other is a string. == does not convert for you, and it does not crash. It simply says they are not the same value.",
        },
        {
          type: "p",
          text: "Order comparisons are stricter. \"12\" >= 10 raises TypeError, because Python will not decide whether text is greater than a number. This happens when you forget int() around input() and then compare the text with 10.",
        },
        {
          type: "code",
          live: true,
          inputs: ["12"],
          code: 'print("Age?")\nage = input()\nif age >= 10:\n    print("You can play!")',
        },
        {
          type: "p",
          text: "That program crashes on purpose. age is the string \"12\". Change age = input() to age = int(input()) and run again. The comparison can then decide.",
        },
        {
          type: "check",
          id: "c-types",
          question: 'age = input() and the person types 12. What does age >= 10 do?',
          options: ["True, because 12 is more than 10", "False, quietly", "TypeError", "It stores 12 into age"],
          answer: 2,
          explain: "age is text. Comparing text with >= against an int raises TypeError. Convert with int() first.",
        },
      ],
    },
    {
      id: "not-equal",
      part: "Part 2 · Comparisons",
      title: "Exactly, or anything else",
      blocks: [
        {
          type: "p",
          text: "== is for an exact match: a password, a menu choice, a word. != is the opposite. It is true when the two values differ.",
        },
        {
          type: "code",
          live: true,
          inputs: ["open"],
          code: 'print("Password?")\nword = input()\nif word == "open":\n    print("Welcome")\nelse:\n    print("Try again")',
        },
        {
          type: "p",
          text: "open matches, so Welcome prints. Change the keyboard answer to Open with a capital O. == is exact, including capitals, so else runs and you get Try again. open and Open are different strings.",
        },
        {
          type: "callout",
          tone: "tip",
          text: "A password check is == against the secret word, plus an else for every other answer. You do not need a separate test for each wrong word.",
        },
        {
          type: "check",
          id: "c-exact",
          question: 'word is Open. What is word == "open"?',
          options: ["True", "False", "TypeError", "Welcome"],
          answer: 1,
          explain: "Capitals count. Open and open are not equal, so the comparison is False and else would run.",
        },
      ],
    },
    {
      id: "elif",
      part: "Part 3 · More than two paths",
      title: "elif adds another test",
      blocks: [
        {
          type: "lead",
          text: "Two paths need if and else. Three or more paths need elif between them. elif means “else, if the next condition is true”.",
        },
        {
          type: "p",
          text: "A score scale has three outcomes. Excellent is 90 or more. Good is 70 or more, once Excellent has been ruled out. Everything lower is Try again.",
        },
        {
          type: "code",
          live: true,
          inputs: ["72"],
          code: 'print("Score?")\nscore = int(input())\nif score >= 90:\n    print("Excellent")\nelif score >= 70:\n    print("Good")\nelse:\n    print("Try again")',
        },
        {
          type: "p",
          text: "72 fails the first test and passes the second, so Good prints. Try 95: the first test passes, so Excellent prints and the elif is not even looked at. Try 40: both tests fail, so else prints Try again.",
        },
        {
          type: "check",
          id: "c-elif-72",
          question: "Using that scale, what is printed for 72?",
          options: ["Excellent", "Good", "Try again", "Good and Try again"],
          answer: 1,
          explain: "72 >= 90 is false. 72 >= 70 is true. Python takes that elif and skips else.",
        },
      ],
    },
    {
      id: "first-true",
      part: "Part 3 · More than two paths",
      title: "The first true test wins",
      blocks: [
        {
          type: "p",
          text: "Python checks if, then each elif, from the top. It runs the body of the first true condition and then jumps past the rest of the chain. Later tests do not get a turn.",
        },
        {
          type: "list",
          ordered: true,
          items: [
            "Look at if. If it is true, run its body and stop.",
            "Otherwise look at the next elif. Same rule.",
            "If every test was false, run else.",
          ],
        },
        {
          type: "p",
          text: "This is why 95 does not also print Good. 95 >= 70 is true, but that line is never reached, because 95 >= 90 already succeeded.",
        },
        {
          type: "callout",
          tone: "exam",
          text: "One chain prints one result. If a program prints two labels for one score, the tests were written as separate if statements, or the prints were left outside the blocks.",
        },
        {
          type: "check",
          id: "c-first",
          question: "score is 95 in that Excellent / Good / Try again chain. What is printed?",
          options: ["Excellent", "Good", "Excellent and Good", "Try again"],
          answer: 0,
          explain: "The first test, score >= 90, is true. Python runs that body and does not continue to elif.",
        },
      ],
    },
    {
      id: "order",
      part: "Part 3 · More than two paths",
      title: "The order of the tests matters",
      blocks: [
        {
          type: "p",
          text: "If the wide test is written first, it swallows the special cases. “50 or more” is true for 95, so a Pass test placed above Excellent will claim every high score.",
        },
        {
          type: "compare",
          left: {
            label: "Wide test first",
            tone: "bad",
            code: "score = 95\nif score >= 50:\n    print(\"Pass\")\nelif score >= 90:\n    print(\"Excellent\")",
            output: "Pass",
          },
          right: {
            label: "Strict test first",
            tone: "good",
            code: "score = 95\nif score >= 90:\n    print(\"Excellent\")\nelif score >= 50:\n    print(\"Pass\")",
            output: "Excellent",
          },
        },
        {
          type: "p",
          text: "Put the narrowest, highest bar first. Then the next band. else holds whatever is left. For this scale that means >= 90, then >= 70, then else.",
        },
        {
          type: "code",
          live: true,
          inputs: ["95"],
          code: 'print("Score?")\nscore = int(input())\nif score >= 50:\n    print("Pass")\nelif score >= 90:\n    print("Excellent")\nelse:\n    print("Fail")',
        },
        {
          type: "p",
          text: "95 prints Pass. The Excellent line is correct English and dead code: the first test already succeeded. Move >= 90 above >= 50 and run again. The same 95 should print Excellent.",
        },
        {
          type: "check",
          id: "c-order",
          question: "The first test is score >= 50 and the next is score >= 90. Score is 95. What prints?",
          options: ["Excellent", "Pass", "Fail", "Excellent and Pass"],
          answer: 1,
          explain: "95 >= 50 is true, so the first body runs. The later Excellent test is skipped.",
        },
      ],
    },
    {
      id: "always",
      part: "Part 3 · More than two paths",
      title: "Lines outside the chain always run",
      blocks: [
        {
          type: "p",
          text: "A line that lines up with if is not part of any branch. It runs after the decision, every time. That is useful for a closing message, and it is a bug if you meant the message to be inside one grade.",
        },
        {
          type: "code",
          live: true,
          inputs: ["40"],
          code: 'print("Score?")\nscore = int(input())\nif score >= 90:\n    print("Excellent")\nelif score >= 70:\n    print("Good")\nelse:\n    print("Try again")\nprint("Marked")',
        },
        {
          type: "p",
          text: "40 prints Try again and then Marked. 95 prints Excellent and then Marked. Marked is not a fourth grade. It is the next step after the choice.",
        },
        {
          type: "check",
          id: "c-always",
          question: "print(\"Marked\") lines up with if, after the chain. When does it run?",
          options: [
            "Only when the score is 90 or more",
            "Only in the else branch",
            "After the chain, for every score",
            "Never, because a chain already printed",
          ],
          answer: 2,
          explain: "It is not indented under any branch, so the decision does not control it.",
        },
      ],
    },
    {
      id: "entry",
      part: "Part 4 · Two complete programs",
      title: "Game entry",
      blocks: [
        {
          type: "p",
          text: "The entry rule is one comparison and two messages. Read the age as an int, test “at least 10”, and give else the refusal. There is no third message.",
        },
        {
          type: "list",
          ordered: true,
          items: [
            "Ask, then convert with int(). A string cannot be compared with >= 10.",
            "if age >= 10: print the welcome.",
            "else: print the refusal.",
            "Do not indent a later line unless it belongs to one of those two bodies.",
          ],
        },
        {
          type: "code",
          live: true,
          inputs: ["10"],
          code: 'print("Age?")\nage = int(input())\nif age >= 10:\n    print("You can play!")\nelse:\n    print("You cannot play yet.")',
        },
        {
          type: "p",
          text: "10 is the boundary, and >= includes it, so the welcome prints. 9 takes the else. Check both in the keyboard box before you leave the slide.",
        },
        {
          type: "check",
          id: "c-entry",
          question: "Which condition lets a 10-year-old play and refuses a 9-year-old?",
          options: ["age > 10", "age >= 10", "age == 10", "age != 9"],
          codeOptions: true,
          answer: 1,
          explain: ">= 10 is true for 10, 11, 12, and so on. It is false for 9. == 10 would refuse an 11-year-old.",
        },
      ],
    },
    {
      id: "grades",
      part: "Part 4 · Two complete programs",
      title: "A grade from a mark",
      blocks: [
        {
          type: "p",
          text: "Four outcomes need if, two elif lines, and else. Write the highest bar first.",
        },
        {
          type: "table",
          head: ["Mark", "Grade", "Test, in this order"],
          rows: [
            ["90 to 100", "Excellent", "if marks >= 90"],
            ["75 to 89", "Merit", "elif marks >= 75"],
            ["50 to 74", "Pass", "elif marks >= 50"],
            ["0 to 49", "Fail", "else"],
          ],
        },
        {
          type: "code",
          live: true,
          inputs: ["76"],
          code: 'print("Marks?")\nmarks = int(input())\nif marks >= 90:\n    print("Excellent")\nelif marks >= 75:\n    print("Merit")\nelif marks >= 50:\n    print("Pass")\nelse:\n    print("Fail")',
        },
        {
          type: "p",
          text: "76 fails >= 90 and passes >= 75, so Merit prints. The Pass test is also true for 76, and it does not run. Try 90, 50, and 49. You should see Excellent, Pass, and Fail. 90 and 50 are included because each test uses >=.",
        },
        {
          type: "check",
          id: "c-merit",
          question: "Using that table, what grade is 76?",
          options: ["Excellent", "Merit", "Pass", "Fail"],
          answer: 1,
          explain: "76 is not 90 or more. It is 75 or more, and that is the first true test, so the grade is Merit.",
        },
      ],
    },
    {
      id: "bugs",
      part: "Part 4 · Two complete programs",
      title: "Three errors worth recognising",
      blocks: [
        {
          type: "table",
          head: ["What you see", "Usual cause", "Fix"],
          rows: [
            ["SyntaxError on the if line", "A single = in the condition", "Use ==, or >= / <= / !="],
            ["IndentationError", "The body is not indented, or the indent changes halfway", "Four spaces for every line in the block"],
            ["TypeError on >=", "input() was left as text", "Wrap it in int() or float()"],
            ["The wrong label, no error", "A wide test is above a stricter one", "Put the highest bar first"],
          ],
        },
        {
          type: "p",
          text: "The last row is the expensive one. The program runs. The output is simply the wrong grade. After a crash is fixed, read one sample from each band: a 95, a 72, and a 40. One sample that works does not prove the order.",
        },
        {
          type: "callout",
          tone: "fact",
          title: "Next chapter",
          text: "This chapter is one comparison per test. Joining two tests in one line, with and or or, is the next chapter. So is putting one if inside another.",
        },
        {
          type: "check",
          id: "c-bug-kind",
          question: "The program runs and gives 95 the grade Pass. The Pass test is written above the Excellent test. What kind of problem is that?",
          options: [
            "SyntaxError",
            "The tests are in the wrong order",
            "IndentationError",
            "input() returned a float",
          ],
          answer: 1,
          explain: "There is no crash. The first true test is the wide one, so the stricter test never runs.",
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
            { term: "Condition", meaning: "An expression that is True or False. if decides from it." },
            { term: "if", meaning: "Runs its indented body when the condition is true." },
            { term: "else", meaning: "Runs its body when the if, and every elif, was false. No condition of its own." },
            { term: "elif", meaning: "Another test, checked only when every test above it was false." },
            { term: "Block", meaning: "The indented lines that belong to if, elif, or else." },
            { term: "Colon", meaning: "Required at the end of the if, elif, and else lines." },
            { term: "==", meaning: "Equal. Compares two values. One = stores a value and is illegal in a condition." },
            { term: "!=", meaning: "Not equal." },
            { term: ">= and <=", meaning: "Include the equal value. > and < do not." },
            { term: "Chain", meaning: "if, elif, elif, else. The first true body runs. The rest are skipped." },
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
          text: "Say the answer, then flip the card. The scale in these cards is Excellent from 90, Good from 70, otherwise Try again, unless a card says otherwise.",
        },
        {
          type: "flashcards",
          cards: [
            { q: "What does a condition produce?", a: "True or False." },
            { q: "Which lines belong to an if?", a: "The indented lines after the colon." },
            { q: "When does else run?", a: "When the if condition, and every elif, is false." },
            { q: "Score 72. Excellent / Good / Try again. What prints?", a: "Good. 72 fails >= 90 and passes >= 70." },
            { q: "Score 95. What prints, and why not Good as well?", a: "Excellent. The first true test wins and the rest of the chain is skipped." },
            { q: "Score 90 with score > 90. Does the if body run?", a: "No. 90 > 90 is false. >= would include 90." },
            { q: "How do you write “at least 10”?", a: "age >= 10" },
            { q: "How do you write “exactly open”?", a: 'word == "open"' },
            { q: "What is wrong with if score = 10:?", a: "A single = stores a value. The condition needs ==. The line is a SyntaxError." },
            { q: 'What is 12 == "12"?', a: "False. An int and a string are not equal." },
            { q: 'What does "12" >= 10 raise?', a: "TypeError. Convert the input with int() before comparing." },
            { q: "Why must >= 90 be written above >= 50?", a: "Otherwise every score of 50 or more takes the first branch, including 95." },
          ],
        },
        {
          type: "check",
          id: "c-exam-90",
          question: "Score is 90. Tests in order: >= 90 Excellent, >= 70 Good, else Try again. What prints?",
          options: ["Excellent", "Good", "Try again", "Excellent and Good"],
          answer: 0,
          explain: "90 >= 90 is true, so the first body runs. Good is never tested.",
        },
        {
          type: "check",
          id: "c-exam-eq",
          question: "Which line compares score with 10?",
          options: ["score = 10", "if score = 10:", "if score == 10:", "if score >= "],
          codeOptions: true,
          answer: 2,
          explain: "== asks the question. The first line stores 10. The second is a syntax error. The fourth is incomplete.",
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
            "if runs its indented body only when the condition is true. else runs when it is not. One of the two runs.",
            "The body is indented, usually four spaces. The header ends with a colon. else lines up with if.",
            "== compares. = stores. >= and <= include the equal value. > and < do not.",
            "elif adds another test. The first true test in the chain wins, so put the highest bar first.",
            "A line that lines up with if is outside the decision and always runs.",
            "Convert input() before comparing it with a number. \"12\" >= 10 is a TypeError. 12 == \"12\" is False.",
          ],
        },
        {
          type: "callout",
          tone: "fact",
          title: "Next up",
          text: "The Examples step through a true branch, a false branch, and a chain in the wrong order. Then you build the entry check, a password check, and a grade scale. Practice asks you to pick the operator and to write the programs.",
        },
      ],
    },
  ],

  examples: [
    {
      type: "trace",
      id: "trace-play",
      title: "Age 12 takes the if",
      intro: "Step through. The else lines are real code, and they do not run.",
      code: 'print("Age?")\nage = int(input())\nif age >= 10:\n    print("You can play!")\nelse:\n    print("You cannot play yet.")',
      steps: [
        { line: 1, output: "Age?", note: "The question is printed. No decision yet." },
        { line: 2, note: "The person types 12. int() stores the number 12." },
        { line: 3, note: "12 >= 10 is True. Python enters this body and will skip else." },
        { line: 4, output: "You can play!", note: "This print is indented under if, so it runs." },
        { line: 5, note: "else is not entered. Its body is skipped." },
        { line: 6, note: "This print belongs to else. It does not run." },
      ],
    },
    {
      type: "trace",
      id: "trace-refuse",
      title: "Age 8 takes the else",
      intro: "Same program, other answer. Watch the if body get skipped.",
      code: 'age = 8\nif age >= 10:\n    print("You can play!")\nelse:\n    print("You cannot play yet.")',
      steps: [
        { line: 1, note: "age holds 8." },
        { line: 2, note: "8 >= 10 is False. The if body is skipped." },
        { line: 3, note: "This print is inside the if. It does not run." },
        { line: 4, note: "else runs because the if condition was false." },
        { line: 5, output: "You cannot play yet.", note: "Only this message is printed." },
      ],
    },
    {
      type: "trace",
      id: "trace-chain",
      title: "72 stops at the second test",
      intro: "Say which test fails and which one succeeds before you step.",
      code: 'score = 72\nif score >= 90:\n    print("Excellent")\nelif score >= 70:\n    print("Good")\nelse:\n    print("Try again")',
      steps: [
        { line: 1, note: "score holds 72." },
        { line: 2, note: "72 >= 90 is False. This body is skipped." },
        { line: 3, note: "Excellent is not printed." },
        { line: 4, note: "72 >= 70 is True. This is the first true test, so its body runs and the chain stops." },
        { line: 5, output: "Good", note: "Good is printed." },
        { line: 6, note: "else is not reached." },
        { line: 7, note: "Try again is not printed." },
      ],
    },
    {
      type: "trace",
      id: "trace-order",
      title: "95 is caught by a wide test",
      intro: "The Excellent test is in the program. It never runs, because an earlier test is already true.",
      code: 'score = 95\nif score >= 50:\n    print("Pass")\nelif score >= 90:\n    print("Excellent")\nelse:\n    print("Fail")',
      steps: [
        { line: 1, note: "score holds 95." },
        { line: 2, note: "95 >= 50 is True. Python takes this branch and will not look further." },
        { line: 3, output: "Pass", note: "Pass prints. This is the bug: 95 is being treated as an ordinary pass." },
        { line: 4, note: "This elif is skipped even though 95 >= 90 is true." },
        { line: 5, note: "Excellent is never printed." },
        { line: 6, note: "else is skipped too." },
        { line: 7, note: "Fail is not printed. The program finishes after Pass." },
      ],
    },
    {
      type: "playground",
      id: "play-entry",
      title: "Finish the entry check",
      intro: "Ask for an age, allow 10 and older, and refuse everyone younger. Leave the keyboard answer as 10 so the boundary is the one being tested.",
      starter: 'print("Age?")\nage = int(input())\n# print You can play! or You cannot play yet.\n',
      inputs: "10",
      tryThis: [
        "Use if age >= 10 and an else",
        "Run it for 10, then try 9, then put 10 back",
        "Indent both prints",
      ],
      goal: {
        text: "With keyboard answer 10, print You can play!. The program must use >= and an else.",
        check: (r, code) =>
          r.ok &&
          /if\s+/.test(code) &&
          /else\s*:/.test(code) &&
          />=\s*10/.test(code) &&
          r.stdout.split("\n").some((line) => line.trim() === "You can play!"),
        success: "10 is included by >=, so the welcome prints and the refusal waits in else.",
      },
    },
    {
      type: "playground",
      id: "play-password",
      title: "An exact password",
      intro: "Welcome only when the typed word is exactly open. Every other word, including Open, should print Try again.",
      starter: 'print("Password?")\nword = input()\n# Welcome, or Try again\n',
      inputs: "open",
      tryThis: ['Compare with == "open"', "Add an else", "Try Open with a capital O, then set the answer back to open"],
      goal: {
        text: "With keyboard answer open, print Welcome. Use == and an else.",
        check: (r, code) =>
          r.ok &&
          /==/.test(code) &&
          /else\s*:/.test(code) &&
          r.stdout.split("\n").some((line) => line.trim() === "Welcome") &&
          !r.stdout.includes("Try again"),
        success: "open matched exactly, so only the if body ran.",
      },
    },
    {
      type: "playground",
      id: "play-grade",
      title: "Excellent, Good, Try again",
      intro: "90 or more is Excellent. 70 or more is Good. Anything lower is Try again. Put the higher bar first. Leave the keyboard answer as 72.",
      starter: 'print("Score?")\nscore = int(input())\n',
      inputs: "72",
      tryThis: ["Write if, elif, and else", "Test >= 90 before >= 70", "Try 95 and 40, then set the answer back to 72"],
      goal: {
        text: "With keyboard answer 72, print Good and nothing else from the scale. >= 90 must appear before >= 70, and the program must use elif.",
        check: (r, code) => {
          const lines = r.stdout.split("\n").map((line) => line.trim());
          const at90 = code.search(/>=\s*90/);
          const at70 = code.search(/>=\s*70/);
          return (
            r.ok &&
            /elif\s+/.test(code) &&
            at90 !== -1 &&
            at70 !== -1 &&
            at90 < at70 &&
            lines.includes("Good") &&
            !lines.includes("Excellent") &&
            !lines.includes("Try again")
          );
        },
        success: "72 missed Excellent and hit Good. The higher test was written first, so a 95 would not fall through.",
      },
    },
    {
      type: "playground",
      id: "play-bugs",
      title: "Bug hunt: a grade scale that will not behave",
      intro: "Run it and fix what Python reports. Then fix the scale. Keyboard answer stays 72. You want Good for 72, and the 90 test has to be able to win for a higher score.",
      starter: 'print("Score?")\nscore = int(input())\nif score = 70:\nprint("Good")\nelif score >= 90:\n    print("Excellent")\nelse:\n    print("Try again")',
      inputs: "72",
      tryThis: [
        "A single = in if is a SyntaxError. A condition needs a comparison.",
        "The Good print has to be indented.",
        "72 should be Good, and >= 90 has to be tested before the Good band.",
      ],
      goal: {
        text: "Make it run. For answer 72, print Good. Use elif, test >= 90 before >= 70, and do not assign inside the condition.",
        check: (r, code) => {
          const lines = r.stdout.split("\n").map((line) => line.trim());
          const at90 = code.search(/>=\s*90/);
          const at70 = code.search(/>=\s*70/);
          const assigns = code.split("\n").some((line) => {
            const t = line.trim();
            if (!t.startsWith("if ") && !t.startsWith("elif ")) return false;
            return t.replace(/!=|<=|>=|==/g, "").includes("=");
          });
          return (
            r.ok &&
            !assigns &&
            /elif\s+/.test(code) &&
            at90 !== -1 &&
            at70 !== -1 &&
            at90 < at70 &&
            lines.includes("Good") &&
            !lines.includes("Excellent")
          );
        },
        success: "The condition compares, the body is indented, and 72 lands on Good without blocking Excellent.",
      },
    },
  ],

  practice: [
    {
      type: "mcq",
      id: "q-job",
      level: "easy",
      skill: "What if does",
      prompt: "What does if do?",
      options: [
        "It repeats the next line",
        "It runs the indented body only when the condition is true",
        "It converts input to an int",
        "It stores the condition in a variable",
      ],
      answer: 1,
      explain: "if is a decision. The body runs when the condition is true and is skipped when it is false.",
    },
    {
      type: "mcq",
      id: "q-colon",
      level: "easy",
      skill: "The header",
      prompt: "Which header is legal?",
      options: ["if age >= 10", "if age >= 10:", "if: age >= 10", "age if >= 10:"],
      codeOptions: true,
      answer: 1,
      explain: "The condition sits between if and the colon. The colon is required.",
    },
    {
      type: "mcq",
      id: "q-else-when",
      level: "easy",
      skill: "else",
      prompt: "When does an else body run?",
      options: [
        "When the if condition is true",
        "When the if condition is false",
        "Always, after the if body",
        "Only when the score is 0",
      ],
      answer: 1,
      explain: "else is the other path. It runs when the if condition is false, and it is skipped when the if body runs.",
    },
    {
      type: "mcq",
      id: "q-both",
      level: "medium",
      skill: "One path",
      prompt: "An if / else pair prints one message in each body. How many of those messages can one run print?",
      options: ["Both", "Exactly one", "Neither, if the number is 10", "As many as there are prints outside"],
      answer: 1,
      explain: "The condition is either true or false. One body runs and the other is skipped.",
    },
    {
      type: "mcq",
      id: "q-at-least",
      level: "easy",
      skill: "Choosing >=",
      prompt: "The rule is “at least 10”. Which condition is it?",
      options: ["age > 10", "age >= 10", "age < 10", "age == 10"],
      codeOptions: true,
      answer: 1,
      explain: "At least 10 includes 10. That is >=.",
    },
    {
      type: "mcq",
      id: "q-boundary",
      level: "medium",
      skill: "The equal boundary",
      prompt: "score is 90 and the test is score > 90. Which body runs?",
      options: ["The if body", "The else body", "Both", "Neither, it raises TypeError"],
      answer: 1,
      explain: "90 > 90 is false. A strict > rejects the equal value, so else runs.",
    },
    {
      type: "fill",
      id: "q-fill-ge",
      level: "easy",
      skill: "Write >=",
      prompt: "Fill the operator for “90 or more”.",
      code: "if score ___ 90:",
      answers: [">="],
      mode: "code",
      placeholder: ">=",
      explain: "90 or more includes 90, so the operator is >=.",
    },
    {
      type: "fill",
      id: "q-fill-eq",
      level: "easy",
      skill: "Write ==",
      prompt: "Fill the operator for an exact match.",
      code: 'if word ___ "open":',
      answers: ["=="],
      mode: "code",
      placeholder: "==",
      explain: "== compares the two values. A single = would try to store and is a syntax error here.",
    },
    {
      type: "mcq",
      id: "q-assign",
      level: "medium",
      skill: "= versus ==",
      prompt: "What is wrong with if score = 10:?",
      options: [
        "Nothing, it checks equality",
        "It stores 10 and is a SyntaxError in a condition",
        "It checks whether score is at least 10",
        "It runs both branches",
      ],
      answer: 1,
      explain: "One = assigns. A condition needs a comparison such as ==.",
    },
    {
      type: "mcq",
      id: "q-str-eq",
      level: "medium",
      skill: "int and str",
      prompt: 'What is 12 == "12"?',
      options: ["True", "False", "TypeError", "12"],
      codeOptions: true,
      answer: 1,
      explain: "One side is an int and the other is a string. == does not convert them, so the result is False.",
    },
    {
      type: "mcq",
      id: "q-str-cmp",
      level: "hard",
      skill: "Compare text with a number",
      prompt: 'age = input() and the person types 12. What does age >= 10 do?',
      options: ["True", "False", "TypeError", "It prints You can play!"],
      answer: 2,
      explain: "age is the string \"12\". Ordering a string against an int raises TypeError. int(input()) fixes it.",
    },
    {
      type: "mcq",
      id: "q-case",
      level: "medium",
      skill: "Exact strings",
      prompt: 'word is Open. What is word == "open"?',
      options: ["True", "False", "TypeError", "None"],
      answer: 1,
      explain: "Capitals are part of the text. Open and open are not equal.",
    },
    {
      type: "mcq",
      id: "q-72",
      level: "medium",
      skill: "Read a chain",
      prompt: "Tests in order: >= 90 Excellent, >= 70 Good, else Try again. What does 72 print?",
      options: ["Excellent", "Good", "Try again", "Good and Try again"],
      answer: 1,
      explain: "72 fails the first test and passes the second. else does not run.",
    },
    {
      type: "mcq",
      id: "q-95",
      level: "medium",
      skill: "First true test",
      prompt: "Same chain. What does 95 print?",
      options: ["Excellent", "Good", "Excellent and Good", "Try again"],
      answer: 0,
      explain: "95 >= 90 is the first true test. Python runs that body and skips the rest.",
    },
    {
      type: "mcq",
      id: "q-40",
      level: "easy",
      skill: "else in a chain",
      prompt: "Same chain. What does 40 print?",
      options: ["Excellent", "Good", "Try again", "Nothing"],
      answer: 2,
      explain: "40 fails both tests, so else runs.",
    },
    {
      type: "mcq",
      id: "q-wide",
      level: "hard",
      skill: "Order of tests",
      prompt: "The first test is score >= 50 printing Pass. The next is score >= 90 printing Excellent. Score is 95. What prints?",
      options: ["Excellent", "Pass", "Fail", "Excellent and Pass"],
      answer: 1,
      explain: "95 >= 50 is already true, so the first body runs and the Excellent test is skipped.",
    },
    {
      type: "mcq",
      id: "q-outside",
      level: "medium",
      skill: "Lines outside the chain",
      prompt: "print(\"Marked\") is indented the same as if, after the whole chain. When does it run?",
      options: [
        "Only for Excellent",
        "Only for else",
        "After the decision, for every score",
        "Only when no branch printed",
      ],
      answer: 2,
      explain: "It is not inside a body, so the condition does not control it.",
    },
    {
      type: "mcq",
      id: "q-merit",
      level: "hard",
      skill: "Four-level scale",
      prompt: "Tests in order: >= 90 Excellent, >= 75 Merit, >= 50 Pass, else Fail. What is 76?",
      options: ["Excellent", "Merit", "Pass", "Fail"],
      answer: 1,
      explain: "76 fails >= 90 and passes >= 75. That is the first true test, so later tests are skipped.",
    },
    {
      type: "mcq",
      id: "q-indent-err",
      level: "medium",
      skill: "IndentationError",
      prompt: "The line after if age >= 10: is print(...) with no indent. What error is that?",
      options: ["TypeError", "IndentationError", "NameError", "No error, the print always runs"],
      answer: 1,
      explain: "The colon promises a body. A body that is not indented raises IndentationError.",
    },
    {
      type: "order",
      id: "q-order-entry",
      level: "medium",
      skill: "Order an if / else",
      prompt: "Put the lines in an order that allows age 10 and refuses a younger player.",
      lines: [
        'print("Age?")',
        "age = int(input())",
        "if age >= 10:",
        '    print("You can play!")',
        "else:",
        '    print("You cannot play yet.")',
      ],
      code: true,
      explain: "Read and convert first. The if header comes before its indented print. else lines up with if, and its print is indented.",
    },
    {
      type: "order",
      id: "q-order-grade",
      level: "hard",
      skill: "Order a chain",
      prompt: "Put the higher bar first so 95 is Excellent and 72 is Good.",
      lines: [
        "if score >= 90:",
        '    print("Excellent")',
        "elif score >= 70:",
        '    print("Good")',
        "else:",
        '    print("Try again")',
      ],
      code: true,
      explain: ">= 90 has to be the first test. If >= 70 came first, 95 would print Good and Excellent would never run.",
    },
    {
      type: "fill",
      id: "q-fill-out",
      level: "medium",
      skill: "Predict one word",
      prompt: "What word is printed? Type that word only.",
      code: "score = 90\nif score >= 90:\n    print(\"Excellent\")\nelse:\n    print(\"Good\")",
      answers: ["Excellent"],
      mode: "text",
      explain: "90 >= 90 is true, so the if body prints Excellent and else is skipped.",
    },
    {
      type: "mcq",
      id: "q-ne",
      level: "easy",
      skill: "!=",
      prompt: "Which condition is true when answer is anything other than yes?",
      options: ['answer = "yes"', 'answer == "yes"', 'answer != "yes"', 'answer >= "yes"'],
      codeOptions: true,
      answer: 2,
      explain: "!= is “not equal”. It is true for every value except the one you name.",
    },
    {
      type: "write",
      id: "q-write-entry",
      level: "easy",
      skill: "if and else",
      prompt:
        "Print Age? and read a whole number. If the age is at least 10, print You can play! Otherwise print You cannot play yet.\n\nThe checker types:\n12\n\nOutput must be:\nAge?\nYou can play!",
      starter: 'print("Age?")\n',
      inputs: ["12"],
      expected: "Age?\nYou can play!",
      check: (_r, code) => {
        if (!/else\s*:/.test(code)) return "Add an else for the younger players.";
        if (!/>=\s*10/.test(code)) return "At least 10 is written age >= 10.";
        return null;
      },
      hint: "age = int(input()) then if age >= 10: and else:.",
      solution: 'print("Age?")\nage = int(input())\nif age >= 10:\n    print("You can play!")\nelse:\n    print("You cannot play yet.")',
    },
    {
      type: "write",
      id: "q-write-password",
      level: "medium",
      skill: "Exact match",
      prompt:
        "Print Password? and read a word. If it is exactly open, print Welcome. Otherwise print Try again.\n\nThe checker types:\nopen\n\nOutput must be:\nPassword?\nWelcome",
      starter: 'print("Password?")\n',
      inputs: ["open"],
      expected: "Password?\nWelcome",
      check: (_r, code) => {
        if (!/==/.test(code)) return 'Use == to test the word against "open".';
        if (!/else\s*:/.test(code)) return "Add an else that prints Try again.";
        return null;
      },
      hint: 'word = input() then if word == "open": print Welcome, else print Try again.',
      solution: 'print("Password?")\nword = input()\nif word == "open":\n    print("Welcome")\nelse:\n    print("Try again")',
    },
    {
      type: "write",
      id: "q-write-freeze",
      level: "medium",
      skill: "Less than",
      prompt:
        "Print Temperature? and read a whole number. If it is under 0, print Freezing. Otherwise print Not freezing.\n\nThe checker types:\n-1\n\nOutput must be:\nTemperature?\nFreezing",
      starter: "",
      inputs: ["-1"],
      expected: "Temperature?\nFreezing",
      check: (_r, code) => {
        if (!/<\s*0/.test(code)) return "Under 0 is written t < 0.";
        if (!/else\s*:/.test(code)) return "Add an else for zero and above.";
        return null;
      },
      hint: "t = int(input()) then if t < 0: print Freezing, else print Not freezing.",
      solution: 'print("Temperature?")\nt = int(input())\nif t < 0:\n    print("Freezing")\nelse:\n    print("Not freezing")',
    },
    {
      type: "write",
      id: "q-write-grade",
      level: "hard",
      skill: "elif",
      prompt:
        "Print Score? and read a whole number.\n• 90 or more prints Excellent\n• 70 or more prints Good\n• otherwise Try again\n\nPut the higher test first.\n\nThe checker types:\n72\n\nOutput must be:\nScore?\nGood",
      starter: 'print("Score?")\n',
      inputs: ["72"],
      expected: "Score?\nGood",
      check: (_r, code) => {
        const at90 = code.search(/>=\s*90/);
        const at70 = code.search(/>=\s*70/);
        if (!/elif\s+/.test(code)) return "Use elif for the second test.";
        if (at90 === -1 || at70 === -1 || at90 > at70) return "Test >= 90 before >= 70, or a 95 would be marked Good.";
        return null;
      },
      hint: "if score >= 90, elif score >= 70, else. 72 fails the first and passes the second.",
      solution:
        'print("Score?")\nscore = int(input())\nif score >= 90:\n    print("Excellent")\nelif score >= 70:\n    print("Good")\nelse:\n    print("Try again")',
    },
    {
      type: "write",
      id: "q-challenge",
      level: "hard",
      skill: "Mini challenge",
      challenge: true,
      prompt:
        "Build a grade checker.\n• Print Marks? and read a whole number\n• 90 or more: Excellent\n• 75 or more: Merit\n• 50 or more: Pass\n• otherwise: Fail\n\nThe checker types:\n76\n\nOutput must be:\nMarks?\nMerit",
      starter: 'print("Marks?")\n',
      inputs: ["76"],
      expected: "Marks?\nMerit",
      check: (_r, code) => {
        const at90 = code.search(/>=\s*90/);
        const at75 = code.search(/>=\s*75/);
        const at50 = code.search(/>=\s*50/);
        const elifs = code.match(/elif\s+/g);
        if (!elifs || elifs.length < 2) return "Use two elif lines between if and else.";
        if (at90 === -1 || at75 === -1 || at50 === -1 || !(at90 < at75 && at75 < at50))
          return "Write the tests in order: >= 90, then >= 75, then >= 50.";
        return null;
      },
      hint: "if marks >= 90, elif marks >= 75, elif marks >= 50, else. 76 lands on Merit.",
      solution:
        'print("Marks?")\nmarks = int(input())\nif marks >= 90:\n    print("Excellent")\nelif marks >= 75:\n    print("Merit")\nelif marks >= 50:\n    print("Pass")\nelse:\n    print("Fail")',
    },
  ],
};
