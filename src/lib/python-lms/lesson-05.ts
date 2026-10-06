import type { PythonLmsLesson } from "@/lib/python-lms/types";

export const LESSON_05: PythonLmsLesson = {
  slug: "lesson-5",
  number: 5,
  title: "Thinking with Logic",
  subtitle: "Combining conditions",
  minutes: 60,
  goals: [
    "Read a comparison as the bool True or False",
    "Combine tests with and, or and not",
    "Translate a rule in English into the matching operator",
    "Put the guard first so a later test is safe to run",
    "Use a nested if when each failure needs its own message",
  ],
  canDo: "Combine conditions with and, or and not, and decide when nesting helps.",

  notes: [
    {
      id: "already-bool",
      part: "Part 1 · True and False",
      title: "A comparison is already a bool",
      blocks: [
        {
          type: "lead",
          text: "Last chapter, if used a comparison and then moved on. The comparison itself has a value. That value is True or False.",
        },
        {
          type: "p",
          text: "age >= 10 is not a command. It is an expression, the same kind of thing as 2 + 3. Python works it out and gets a bool. You can print it, store it, and pass it to if.",
        },
        {
          type: "code",
          live: true,
          inputs: ["12"],
          code: 'print("Age?")\nage = int(input())\nprint(age >= 10)\nold_enough = age >= 10\nprint(old_enough)',
        },
        {
          type: "p",
          text: "With 12, both prints are True. old_enough is a variable holding a bool, the same type as is_student from the variables chapter. Change the keyboard answer to 8 and both prints become False. The variable did not change the rule. It remembered the answer.",
        },
        {
          type: "check",
          id: "c-expr",
          question: "What is the value of 8 >= 10?",
          options: ["8", "10", "True", "False"],
          answer: 3,
          explain: "The comparison is worked out. 8 is not at least 10, so the value is the bool False.",
        },
      ],
    },
    {
      id: "and",
      part: "Part 1 · True and False",
      title: "and needs both",
      blocks: [
        {
          type: "p",
          text: "and joins two tests. The result is True only when the left test and the right test are both True. One False is enough to make the whole thing False.",
        },
        {
          type: "table",
          head: ["Left", "Right", "Left and Right"],
          rows: [
            ["True", "True", "True"],
            ["True", "False", "False"],
            ["False", "True", "False"],
            ["False", "False", "False"],
          ],
        },
        {
          type: "p",
          text: "Read it as “both”. A player is eligible when they are at least 10 and they scored at least 50. Age 12 with score 40 fails, because the score test is false. Age 9 with score 80 fails, because the age test is false.",
        },
        {
          type: "code",
          live: true,
          code: "print(True and True)\nprint(True and False)\nprint(False and True)\nprint(False and False)",
        },
        {
          type: "check",
          id: "c-and",
          question: "age >= 10 is true and score >= 50 is false. What is the and?",
          options: ["True", "False", "An error", "50"],
          answer: 1,
          explain: "and is True only when both sides are True. A false score test makes the whole condition False.",
        },
      ],
    },
    {
      id: "or",
      part: "Part 1 · True and False",
      title: "or needs one",
      blocks: [
        {
          type: "p",
          text: "or is True when at least one side is True. It is False only when both sides are False. In English this is “either”, including the case where both happen to be true.",
        },
        {
          type: "table",
          head: ["Left", "Right", "Left or Right"],
          rows: [
            ["True", "True", "True"],
            ["True", "False", "True"],
            ["False", "True", "True"],
            ["False", "False", "False"],
          ],
        },
        {
          type: "p",
          text: "A weekend is Saturday or Sunday. One of those days is enough. A Wednesday makes both tests false, so the or is false. If someone asks “Saturday or Sunday?” and the answer is Saturday, you do not also need it to be Sunday.",
        },
        {
          type: "code",
          live: true,
          code: "print(True or False)\nprint(False or True)\nprint(False or False)\nprint(True or True)",
        },
        {
          type: "check",
          id: "c-or",
          question: "The day is Saturday. day == \"Saturday\" is true and day == \"Sunday\" is false. What is the or?",
          options: ["True", "False", "Saturday", "An error"],
          answer: 0,
          explain: "or is true as soon as one side is true. Saturday is enough.",
        },
      ],
    },
    {
      id: "not",
      part: "Part 1 · True and False",
      title: "not flips the bool",
      blocks: [
        {
          type: "p",
          text: "not takes one bool and returns the other one. not True is False. not False is True. It does not combine two tests. It reverses the one in front of it.",
        },
        {
          type: "code",
          live: true,
          code: "raining = False\nprint(raining)\nprint(not raining)\nprint(not True)\nprint(not False)",
        },
        {
          type: "p",
          text: "“Go out if it is not raining” is if not raining. When raining is False, not raining is True, so the body runs. You could write if raining == False. not raining says the same thing and is the usual form.",
        },
        {
          type: "callout",
          tone: "tip",
          text: "not sits in front of a whole test. not score >= 50 means the score test failed. The comparison is worked out first, then not flips it.",
        },
        {
          type: "check",
          id: "c-not",
          question: "raining is False. What is not raining?",
          options: ["False", "True", "raining", "An error"],
          answer: 1,
          explain: "not flips False into True. The if body of if not raining would run.",
        },
      ],
    },
    {
      id: "three",
      part: "Part 1 · True and False",
      title: "The three results, side by side",
      blocks: [
        {
          type: "p",
          text: "This is the program to be able to do in your head. A is True. B is False. Predict each print, then run it.",
        },
        {
          type: "code",
          live: true,
          code: "A = True\nB = False\nprint(A and B)\nprint(A or B)\nprint(not A)",
        },
        {
          type: "list",
          ordered: true,
          items: [
            "A and B is False, because B is false and and needs both.",
            "A or B is True, because A is true and or needs only one.",
            "not A is False, because A was true and not flips it.",
          ],
        },
        {
          type: "check",
          id: "c-three",
          question: "A is True and B is False. What do A and B, A or B, and not A print, in that order?",
          options: ["True, True, True", "False, True, False", "False, False, True", "True, False, True"],
          answer: 1,
          explain: "and fails on B. or succeeds on A. not flips A from True to False.",
        },
      ],
    },
    {
      id: "both-tests",
      part: "Part 2 · Joining real tests",
      title: "and between two comparisons",
      blocks: [
        {
          type: "p",
          text: "The useful form is not True and False written by hand. It is two comparisons with and between them. Each comparison becomes a bool, then and combines those bools.",
        },
        {
          type: "anatomy",
          code: "if age >= 10 and score >= 50:",
          parts: [
            { token: "age >= 10", label: "First comparison. True when the player is 10 or older." },
            { token: "and", label: "Both comparisons must be true. This is a keyword." },
            { token: "score >= 50", label: "Second comparison. True when the score is 50 or more." },
          ],
        },
        {
          type: "code",
          live: true,
          inputs: ["12", "40"],
          code: 'print("Age?")\nage = int(input())\nprint("Score?")\nscore = int(input())\nif age >= 10 and score >= 50:\n    print("Eligible")\nelse:\n    print("Not eligible")',
        },
        {
          type: "p",
          text: "12 and 40 print Not eligible. The age passes and the score does not, so and fails. Change the score to 50 and run again. Both tests pass, so Eligible prints. 50 is included because the test is >=.",
        },
        {
          type: "check",
          id: "c-eligible",
          question: "Age is 9 and score is 80. Does age >= 10 and score >= 50 succeed?",
          options: ["Yes, the score is high enough", "No, the age test fails", "Yes, or would be the wrong word", "It raises TypeError"],
          answer: 1,
          explain: "and requires every part. A high score does not repair an age that is under 10.",
        },
      ],
    },
    {
      id: "english",
      part: "Part 2 · Joining real tests",
      title: "From a sentence to an operator",
      blocks: [
        {
          type: "p",
          text: "The English tells you the operator before you touch the keyboard. Write the sentence, underline the joining word, then pick the operator.",
        },
        {
          type: "table",
          head: ["The rule says", "Operator", "Shape"],
          rows: [
            ["Both, and", "and", "test and test"],
            ["Either, or, at least one", "or", "test or test"],
            ["Not, isn’t, unless it is", "not", "not test"],
            ["A band, from … up to …", "and", "low <= n and n <= high"],
          ],
        },
        {
          type: "p",
          text: "“At least 10 and under 18” is a band. The age has to pass a floor and a ceiling. That is age >= 10 and age < 18. The variable is written twice. Each side of and is a full comparison.",
        },
        {
          type: "code",
          live: true,
          inputs: ["16"],
          code: 'print("Age?")\nage = int(input())\nif age >= 10 and age < 18:\n    print("Teen ticket")\nelse:\n    print("Other ticket")',
        },
        {
          type: "check",
          id: "c-english",
          question: "The rule is “Saturday or Sunday”. Which operator joins the two day tests?",
          options: ["and", "or", "not", ">="],
          answer: 1,
          explain: "One of the two days is enough. That is or. and would demand a day that is both Saturday and Sunday.",
        },
      ],
    },
    {
      id: "sunday",
      part: "Part 2 · Joining real tests",
      title: "Each side of or needs a comparison",
      blocks: [
        {
          type: "p",
          text: "The usual mistake is to write the variable only once. day == \"Saturday\" or \"Sunday\" looks like English. It is not two comparisons. The right side is the bare string Sunday.",
        },
        {
          type: "compare",
          left: {
            label: "Always takes the if",
            tone: "bad",
            code: 'day = "Monday"\nif day == "Saturday" or "Sunday":\n    print("Weekend")',
            output: "Weekend",
          },
          right: {
            label: "Two real comparisons",
            tone: "good",
            code: 'day = "Monday"\nif day == "Saturday" or day == "Sunday":\n    print("Weekend")\nelse:\n    print("Weekday")',
            output: "Weekday",
          },
        },
        {
          type: "p",
          text: "A non-empty string counts as true when if asks for a bool. Sunday is non-empty, so the broken or is true for every day, including Monday. The body always runs. The fix repeats the comparison: day == \"Sunday\".",
        },
        {
          type: "code",
          live: true,
          inputs: ["Monday"],
          code: 'print("Day?")\nday = input()\nif day == "Saturday" or "Sunday":\n    print("Weekend")\nelse:\n    print("Weekday")',
        },
        {
          type: "p",
          text: "Monday still prints Weekend. That is the bug, and there is no error message. Change the condition so Sunday is compared with day, then run Monday again. It should print Weekday. Saturday should still print Weekend.",
        },
        {
          type: "check",
          id: "c-sunday",
          question: 'day is Monday. What does day == "Saturday" or "Sunday" do inside if?',
          options: [
            "It is false, so else runs",
            "It is true, because the string Sunday counts as true",
            "SyntaxError",
            "It prints Sunday and then stops",
          ],
          answer: 1,
          explain: "The right side is not a comparison. A non-empty string is treated as true, so the if body runs for every day.",
        },
      ],
    },
    {
      id: "range",
      part: "Part 2 · Joining real tests",
      title: "A number inside a band",
      blocks: [
        {
          type: "p",
          text: "A mark is valid when it is from 0 through 100, including both ends. That is two tests: score >= 0 and score <= 100. Below 0 fails. Above 100 fails. 0 and 100 pass.",
        },
        {
          type: "p",
          text: "Python also lets you chain the comparisons: 0 <= score <= 100. It means the same pair of tests. Both styles are correct. The chain is shorter. The and form makes each test obvious, which helps while you are learning.",
        },
        {
          type: "compare",
          left: {
            label: "Two tests with and",
            tone: "good",
            code: "if score >= 0 and score <= 100:",
            output: "Valid when both tests pass.",
          },
          right: {
            label: "The same band, chained",
            tone: "good",
            code: "if 0 <= score <= 100:",
            output: "Same band, including 0 and 100.",
          },
        },
        {
          type: "callout",
          tone: "warn",
          text: "age >= 10 and < 18 is a syntax error. The right side of and has to be a full comparison. Write age < 18, or chain it as 10 <= age < 18.",
        },
        {
          type: "check",
          id: "c-band",
          question: "Which condition is a valid mark from 0 to 100, including both ends?",
          options: [
            "score > 0 and score < 100",
            "score >= 0 and score <= 100",
            "score >= 0 or score <= 100",
            "score >= 0 and < 100",
          ],
          codeOptions: true,
          answer: 1,
          explain: "Both ends are included, so the operators are >= and <=, joined by and. or would be true for almost every number.",
        },
      ],
    },
    {
      id: "precedence",
      part: "Part 2 · Joining real tests",
      title: "and is worked out before or",
      blocks: [
        {
          type: "p",
          text: "When a line mixes and and or, and happens first. It is the same idea as multiplication happening before addition. not happens before either of them, and comparisons happen before not.",
        },
        {
          type: "list",
          ordered: true,
          items: [
            "Comparisons first: >=, ==, and the rest.",
            "Then not.",
            "Then and.",
            "Then or.",
          ],
        },
        {
          type: "code",
          live: true,
          code: "print(True or False and False)\nprint((True or False) and False)",
        },
        {
          type: "p",
          text: "True or False and False is True or (False and False). The and makes False, then True or False is True. The brackets in the second line force the or first, and (True or False) and False is False. Same words, different grouping, different result.",
        },
        {
          type: "callout",
          tone: "exam",
          text: "If you are unsure, add brackets. (age >= 10 and score >= 50) or guest == \"yes\" is readable. A long line without brackets is where this chapter’s marks are lost.",
        },
        {
          type: "check",
          id: "c-prec",
          question: "What is True or False and False?",
          options: ["True", "False", "An error", "None"],
          answer: 0,
          explain: "and runs first: False and False is False. True or False is True.",
        },
      ],
    },
    {
      id: "negate",
      part: "Part 2 · Joining real tests",
      title: "The opposite of a both-test",
      blocks: [
        {
          type: "p",
          text: "not (age >= 10 and score >= 50) is true when the player is not eligible. That happens when the age fails or the score fails. One failure is enough to ruin an and, so the opposite of and is or.",
        },
        {
          type: "code",
          live: true,
          code: "age = 12\nscore = 40\nprint(not (age >= 10 and score >= 50))\nprint(age < 10 or score < 50)",
        },
        {
          type: "p",
          text: "Both lines print True. 12 passes the age test. 40 fails the score test. The and fails, so not of that and is true. The second line says the same fact directly: under 10, or under 50.",
        },
        {
          type: "callout",
          tone: "fact",
          title: "The pair to remember",
          text: "The opposite of “both” is “at least one part failed”, which is or. The opposite of “either” is “both parts failed”, which is and. Brackets around the original test keep the not attached to the whole thing.",
        },
        {
          type: "check",
          id: "c-negate",
          question: "Which condition is true for the same players as not (age >= 10 and score >= 50)?",
          options: [
            "age < 10 and score < 50",
            "age < 10 or score < 50",
            "age >= 10 or score >= 50",
            "not age >= 10 and score >= 50",
          ],
          codeOptions: true,
          answer: 1,
          explain: "Failing a both-test means at least one part failed. That is age < 10 or score < 50.",
        },
      ],
    },
    {
      id: "and-message",
      part: "Part 3 · and, or a nested if",
      title: "and is enough for one message",
      blocks: [
        {
          type: "p",
          text: "If eligible and not eligible are the only two things you need to say, write one if with and, and an else. The reader sees the whole rule on one line.",
        },
        {
          type: "code",
          live: true,
          inputs: ["11", "50"],
          code: 'print("Age?")\nage = int(input())\nprint("Score?")\nscore = int(input())\nif age >= 10 and score >= 50:\n    print("Eligible")\nelse:\n    print("Not eligible")',
        },
        {
          type: "p",
          text: "11 and 50 pass both tests. The else does not say whether the age or the score was the problem, because this program does not need to. That missing detail is the reason to nest, and it is the only reason.",
        },
        {
          type: "check",
          id: "c-one-message",
          question: "You only need to print Eligible or Not eligible. What should you write?",
          options: [
            "A nested if, so each number has its own print",
            "One if whose condition uses and",
            "Two separate programs",
            "or, so either test is enough",
          ],
          answer: 1,
          explain: "One outcome for success and one for failure fits on a single and. Nesting would repeat the same failure message twice.",
        },
      ],
    },
    {
      id: "nested",
      part: "Part 3 · and, or a nested if",
      title: "Nest when the reason changes",
      blocks: [
        {
          type: "p",
          text: "Sometimes the failure message depends on which test failed. “Too young” and “Score too low” are different facts. A single else cannot say both. An if inside the first if can.",
        },
        {
          type: "code",
          live: true,
          inputs: ["12", "40"],
          code: 'print("Age?")\nage = int(input())\nprint("Score?")\nscore = int(input())\nif age >= 10:\n    if score >= 50:\n        print("Eligible")\n    else:\n        print("Score too low")\nelse:\n    print("Too young")',
        },
        {
          type: "p",
          text: "12 gets past the outer if. 40 fails the inner if, so Score too low prints. The outer else does not run. Change the age to 8 and the score is never tested: Too young prints, even if the score was 90. The second question is only asked after the first answer is yes.",
        },
        {
          type: "callout",
          tone: "exam",
          text: "The inner if is indented once more than the outer if. Its body is indented again. else lines up with the if it belongs to. An else under the inner if is not the else of the outer if.",
        },
        {
          type: "check",
          id: "c-nested",
          question: "In that program, age is 8 and score is 90. What prints?",
          options: ["Eligible", "Score too low", "Too young", "Too young and Score too low"],
          answer: 2,
          explain: "The outer test fails, so the whole inner if is skipped. The score is never looked at.",
        },
      ],
    },
    {
      id: "two-levels",
      part: "Part 3 · and, or a nested if",
      title: "Stop at two levels",
      blocks: [
        {
          type: "p",
          text: "An if inside an if is readable. An if inside that, inside another, stops being readable. If you are about to indent a third time, the rule can usually be rewritten with and or or, or split into a stored bool with a clear name.",
        },
        {
          type: "p",
          text: "old_enough = age >= 10 and passed = score >= 50 turn the tests into names. if old_enough and passed: then reads like the sentence. The nesting disappears, and the bools are still there if you later want a separate message.",
        },
        {
          type: "code",
          live: true,
          inputs: ["14", "62"],
          code: 'print("Age?")\nage = int(input())\nprint("Score?")\nscore = int(input())\nold_enough = age >= 10\npassed = score >= 50\nif old_enough and passed:\n    print("Eligible")\nelse:\n    print("Not eligible")',
        },
        {
          type: "check",
          id: "c-depth",
          question: "You need a third if inside two that are already nested. What is the better first move?",
          options: [
            "Indent it. Depth is free.",
            "Rewrite the rule with and, or, or a named bool",
            "Delete the outer else",
            "Change and into or",
          ],
          answer: 1,
          explain: "Two levels is the usual limit. A named bool or a single and keeps the same rule visible.",
        },
      ],
    },
    {
      id: "guard",
      part: "Part 3 · and, or a nested if",
      title: "Put the safe test first",
      blocks: [
        {
          type: "p",
          text: "and stops early. If the left side is false, Python does not work out the right side. That is useful when the right side would crash for some values.",
        },
        {
          type: "p",
          text: "10 / n crashes when n is 0. The test n != 0 and 10 / n > 2 checks the zero first. When n is 0, the and is already false, so the division never runs. Swap the two tests and the division runs first, which raises ZeroDivisionError.",
        },
        {
          type: "compare",
          left: {
            label: "Guard first",
            tone: "good",
            code: "n = 0\nif n != 0 and 10 / n > 2:\n    print(\"big\")\nelse:\n    print(\"safe\")",
            output: "safe",
          },
          right: {
            label: "Division first",
            tone: "bad",
            code: "n = 0\nif 10 / n > 2 and n != 0:\n    print(\"big\")",
            output: "ZeroDivisionError: division by zero",
          },
        },
        {
          type: "code",
          live: true,
          code: 'n = 0\nif n != 0 and 10 / n > 2:\n    print("big")\nelse:\n    print("safe")',
        },
        {
          type: "check",
          id: "c-guard",
          question: "n is 0. Which condition prints safe instead of crashing?",
          options: [
            "if 10 / n > 2 and n != 0:",
            "if n != 0 and 10 / n > 2:",
            "if 10 / n > 2 or n != 0:",
            "if n == 0 and 10 / n > 2:",
          ],
          codeOptions: true,
          answer: 1,
          explain: "n != 0 is false, so and never evaluates 10 / n. The other way around divides by zero first.",
        },
      ],
    },
    {
      id: "zero",
      part: "Part 3 · and, or a nested if",
      title: "Do not use a number as the test",
      blocks: [
        {
          type: "p",
          text: "if score: looks short. Python treats 0 as false and every other number as true. A score of 0 is a real score, and this test throws it into the false branch. An empty string is also treated as false, which is why the bare word Sunday was treated as true: it is not empty.",
        },
        {
          type: "compare",
          left: {
            label: "Zero falls through",
            tone: "bad",
            code: "score = 0\nif score:\n    print(\"Has a score\")\nelse:\n    print(\"Missing\")",
            output: "Missing",
          },
          right: {
            label: "Say what you mean",
            tone: "good",
            code: "score = 0\nif score >= 0:\n    print(\"Has a score\")\nelse:\n    print(\"Missing\")",
            output: "Has a score",
          },
        },
        {
          type: "callout",
          tone: "warn",
          text: "Write the comparison. if score >= 0, if score == 0, if word == \"Sunday\". Save the bare if for a bool you already named, such as if old_enough: or if not raining:.",
        },
        {
          type: "check",
          id: "c-zero",
          question: "score is 0. What does if score: do?",
          options: [
            "The body runs, because 0 is a number",
            "The body is skipped, because 0 counts as false",
            "SyntaxError",
            "It prints 0",
          ],
          answer: 1,
          explain: "0 is treated as false. A real score of zero needs an explicit comparison such as score >= 0.",
        },
      ],
    },
    {
      id: "unlock",
      part: "Part 4 · Two complete rules",
      title: "A stage unlock",
      blocks: [
        {
          type: "p",
          text: "The next stage opens when the points are at least 100 and the level is at least 3. Both gates, one message for success, one for failure. That is and, not a nest.",
        },
        {
          type: "code",
          live: true,
          inputs: ["120", "3"],
          code: 'print("Points?")\npoints = int(input())\nprint("Level?")\nlevel = int(input())\nif points >= 100 and level >= 3:\n    print("Stage unlocked")\nelse:\n    print("Locked")',
        },
        {
          type: "p",
          text: "120 and 3 unlock. 120 and 2 stay locked, because the level fails. 90 and 5 stay locked, because the points fail. Try those three pairs. A rule with and is proved by the success case and by each single failure.",
        },
        {
          type: "check",
          id: "c-unlock",
          question: "points are 120 and level is 2. What does points >= 100 and level >= 3 decide?",
          options: ["Stage unlocked", "Locked", "TypeError", "Only the points message"],
          answer: 1,
          explain: "The points pass and the level does not. and fails, so the stage stays locked.",
        },
      ],
    },
    {
      id: "why-nest-build",
      part: "Part 4 · Two complete rules",
      title: "Say which gate failed",
      blocks: [
        {
          type: "p",
          text: "The same two gates can explain themselves. Check the level first. Only a high enough level gets as far as the points. Each else names the gate that failed.",
        },
        {
          type: "code",
          live: true,
          inputs: ["2", "150"],
          code: 'print("Level?")\nlevel = int(input())\nprint("Points?")\npoints = int(input())\nif level >= 3:\n    if points >= 100:\n        print("Stage unlocked")\n    else:\n        print("Not enough points")\nelse:\n    print("Level too low")',
        },
        {
          type: "p",
          text: "Level 2 never looks at the 150 points. Level too low prints. Level 4 with 80 points gets inside and prints Not enough points. Level 4 with 100 points prints Stage unlocked. Three inputs, three messages, and the inner test does not exist for a level that already failed.",
        },
        {
          type: "check",
          id: "c-which",
          question: "Using that nested program, level is 4 and points are 80. What prints?",
          options: ["Stage unlocked", "Not enough points", "Level too low", "Locked"],
          answer: 1,
          explain: "4 >= 3, so the inner test runs. 80 >= 100 is false, so the inner else prints Not enough points.",
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
            { term: "Bool", meaning: "A value that is True or False. A comparison produces one." },
            { term: "and", meaning: "True only when both sides are true. One false side makes it false." },
            { term: "or", meaning: "True when at least one side is true. False only when both are false." },
            { term: "not", meaning: "Flips one bool. not True is False. not False is True." },
            { term: "Chain", meaning: "0 <= score <= 100. Two comparisons written together. Same meaning as an and." },
            { term: "Nested if", meaning: "An if inside another if. Use it when each failure needs a different message." },
            { term: "Guard", meaning: "A safe test written first, so a later test that could crash is skipped." },
            { term: "Truthiness", meaning: "if treating 0 and \"\" as false, and other numbers and non-empty strings as true. Prefer a real comparison." },
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
          text: "Say the answer, then flip the card. Eligible means age >= 10 and score >= 50 unless a card says otherwise.",
        },
        {
          type: "flashcards",
          cards: [
            { q: "What does a comparison produce?", a: "True or False." },
            { q: "When is A and B true?", a: "Only when both are true." },
            { q: "When is A or B false?", a: "Only when both are false." },
            { q: "A is True, B is False. What are A and B, A or B, and not A?", a: "False, True, False." },
            { q: "Age 12, score 40. Eligible?", a: "No. The score test fails, so and is false." },
            { q: "Age 9, score 90. Eligible?", a: "No. The age test fails." },
            { q: 'What is wrong with day == "Saturday" or "Sunday"?', a: "The right side is a non-empty string, so the test is true for every day. Repeat the comparison." },
            { q: "How do you write “from 0 to 100, including both”?", a: "score >= 0 and score <= 100, or 0 <= score <= 100." },
            { q: "What is True or False and False?", a: "True. and happens first." },
            { q: "What is the opposite of age >= 10 and score >= 50?", a: "age < 10 or score < 50." },
            { q: "When do you nest an if instead of using and?", a: "When each failed test needs a different message." },
            { q: "Why is n != 0 written before 10 / n > 2?", a: "and skips the division when n is 0, so it does not raise ZeroDivisionError." },
          ],
        },
        {
          type: "check",
          id: "c-exam-or",
          question: "A is False and B is False. What is A or B?",
          options: ["True", "False", "None", "An error"],
          answer: 1,
          explain: "or is false only when both sides are false.",
        },
        {
          type: "check",
          id: "c-exam-both",
          question: "Age is 10 and score is 50. Does age >= 10 and score >= 50 succeed?",
          options: ["No, the boundary is excluded", "Yes, both tests include the equal value", "Only the age test", "TypeError"],
          answer: 1,
          explain: "Both operators are >=, so 10 and 50 pass. and is true.",
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
            "A comparison is a bool. You can print it or store it before you hand it to if.",
            "and is both. or is at least one. not flips the one test in front of it.",
            "Each side of and and or should be a full comparison. day == \"Saturday\" or \"Sunday\" is true for every day.",
            "A band is two tests, or one chain: 0 <= score <= 100. and is worked out before or. Brackets remove the doubt.",
            "The opposite of a both-test is an or of the failures.",
            "Use and when one failure message is enough. Nest one level when the message depends on which test failed. Put a guard before a test that could crash.",
          ],
        },
        {
          type: "callout",
          tone: "fact",
          title: "Next up",
          text: "The Examples step through and, or, not, a failed eligibility check, a nested reason, and the Sunday bug. Then you build the competition rule, the weekend test, and the stage unlock. Practice asks you to choose the operator and to write the programs.",
        },
      ],
    },
  ],

  examples: [
    {
      type: "trace",
      id: "trace-bools",
      title: "and, or, and not",
      intro: "A is true. B is false. Predict the three prints, then step.",
      code: "A = True\nB = False\nprint(A and B)\nprint(A or B)\nprint(not A)",
      steps: [
        { line: 1, note: "A holds the bool True." },
        { line: 2, note: "B holds the bool False." },
        { line: 3, output: "False", note: "and needs both. B is false, so the result is False." },
        { line: 4, output: "True", note: "or needs one. A is true, so the result is True." },
        { line: 5, output: "False", note: "not flips True into False." },
      ],
    },
    {
      type: "trace",
      id: "trace-eligible",
      title: "One failed test ruins and",
      intro: "Age 12 would be old enough on its own. The score is 40. Watch and reject the pair.",
      code: 'age = 12\nscore = 40\nif age >= 10 and score >= 50:\n    print("Eligible")\nelse:\n    print("Not eligible")',
      steps: [
        { line: 1, note: "age holds 12." },
        { line: 2, note: "score holds 40." },
        { line: 3, note: "12 >= 10 is true. 40 >= 50 is false. true and false is false, so the body is skipped." },
        { line: 4, note: "Eligible does not print." },
        { line: 5, note: "else runs because the and was false." },
        { line: 6, output: "Not eligible", note: "The program does not say which test failed. It only has one failure message." },
      ],
    },
    {
      type: "trace",
      id: "trace-nested",
      title: "The inner else names the score",
      intro: "Same numbers, nested. The outer test passes, so the reason comes from inside.",
      code: 'age = 12\nscore = 40\nif age >= 10:\n    if score >= 50:\n        print("Eligible")\n    else:\n        print("Score too low")\nelse:\n    print("Too young")',
      steps: [
        { line: 1, note: "age holds 12." },
        { line: 2, note: "score holds 40." },
        { line: 3, note: "12 >= 10 is true. Python enters the outer body and will skip the outer else." },
        { line: 4, note: "40 >= 50 is false. The inner body is skipped." },
        { line: 5, note: "Eligible does not print." },
        { line: 6, note: "This else belongs to the inner if." },
        { line: 7, output: "Score too low", note: "The score is the test that failed." },
        { line: 8, note: "The outer else is skipped, because the age test passed." },
        { line: 9, note: "Too young does not print." },
      ],
    },
    {
      type: "trace",
      id: "trace-sunday",
      title: "Monday is treated as a weekend",
      intro: "There is no error. The condition is still true. Step through and see why.",
      code: 'day = "Monday"\nif day == "Saturday" or "Sunday":\n    print("Weekend")\nelse:\n    print("Weekday")',
      steps: [
        { line: 1, note: "day holds Monday." },
        { line: 2, note: "Monday == Saturday is false. The right side of or is the string Sunday, not a comparison. A non-empty string counts as true, so the or is true." },
        { line: 3, output: "Weekend", note: "The body runs. Monday was never really tested against Sunday." },
        { line: 4, note: "else is skipped." },
        { line: 5, note: "Weekday does not print." },
      ],
    },
    {
      type: "playground",
      id: "play-eligible",
      title: "Competition eligibility",
      intro: "Eligible means at least 10 years old and a score of at least 50. One else message is enough. Leave the keyboard answers as 12 and 50.",
      starter: 'print("Age?")\nage = int(input())\nprint("Score?")\nscore = int(input())\n',
      inputs: "12\n50",
      tryThis: [
        "Join the two comparisons with and",
        "Print Eligible or Not eligible",
        "Try score 49, then set it back to 50",
      ],
      goal: {
        text: "With answers 12 and 50, print Eligible. Use and, >= 10, and >= 50.",
        check: (r, code) =>
          r.ok &&
          /\band\b/.test(code) &&
          />=\s*10/.test(code) &&
          />=\s*50/.test(code) &&
          r.stdout.split("\n").some((line) => line.trim() === "Eligible") &&
          !r.stdout.includes("Not eligible"),
        success: "Both boundaries passed, so and is true.",
      },
    },
    {
      type: "playground",
      id: "play-weekend",
      title: "Saturday or Sunday",
      intro: "Print Weekend only for those two words. Monday must print Weekday. Each side of or needs its own comparison.",
      starter: 'print("Day?")\nday = input()\n',
      inputs: "Monday",
      tryThis: [
        'Write day == "Saturday" or day == "Sunday"',
        "Add an else that prints Weekday",
        "Try Saturday, then set the answer back to Monday",
      ],
      goal: {
        text: "With the answer Monday, print Weekday. Use or and two == comparisons.",
        check: (r, code) =>
          r.ok &&
          /\bor\b/.test(code) &&
          (code.match(/==/g) ?? []).length >= 2 &&
          !/or\s+["']Sunday["']/.test(code) &&
          r.stdout.split("\n").some((line) => line.trim() === "Weekday") &&
          !r.stdout.includes("Weekend"),
        success: "Monday matched neither day, so else ran.",
      },
    },
    {
      type: "playground",
      id: "play-unlock",
      title: "Points and level",
      intro: "The stage unlocks at 100 points or more and level 3 or more. Otherwise print Locked. Leave the answers as 90 and 4.",
      starter: 'print("Points?")\npoints = int(input())\nprint("Level?")\nlevel = int(input())\n',
      inputs: "90\n4",
      tryThis: [
        "Use and for the two gates",
        "Print Stage unlocked or Locked",
        "The points answer is 90, so this pair should stay locked",
      ],
      goal: {
        text: "With answers 90 and 4, print Locked. The condition must use and, >= 100, and >= 3.",
        check: (r, code) =>
          r.ok &&
          /\band\b/.test(code) &&
          />=\s*100/.test(code) &&
          />=\s*3/.test(code) &&
          r.stdout.split("\n").some((line) => line.trim() === "Locked") &&
          !r.stdout.includes("Stage unlocked"),
        success: "Level 4 was enough. 90 points were not, so and kept the stage locked.",
      },
    },
    {
      type: "playground",
      id: "play-bugs",
      title: "Bug hunt: a weekend test and a broken band",
      intro: "The file fails before it runs. Fix the syntax, then fix the weekend test. Keyboard answers stay Monday and 16.",
      starter:
        'print("Day?")\nday = input()\nif day == "Saturday" or "Sunday":\n    print("Weekend")\nelse:\n    print("Weekday")\nprint("Age?")\nage = int(input())\nif age >= 10 and < 18:\n    print("Teen")\nelse:\n    print("Other")',
      inputs: "Monday\n16",
      tryThis: [
        "and < 18 is not a comparison. Write age < 18, or chain 10 <= age < 18.",
        'or "Sunday" is not a comparison either. Compare day with Sunday.',
        "Monday should print Weekday. 16 should print Teen.",
      ],
      goal: {
        text: "Make it run. Monday prints Weekday, 16 prints Teen, Sunday is a real comparison, and the age band has two complete tests.",
        check: (r, code) => {
          const lines = r.stdout.split("\n").map((line) => line.trim());
          const band = /age\s*>=\s*10\s+and\s+age\s*<\s*18/.test(code) || /10\s*<=\s*age\s*<\s*18/.test(code);
          return (
            r.ok &&
            band &&
            (code.match(/==/g) ?? []).length >= 2 &&
            !/or\s+["']Sunday["']/.test(code) &&
            lines.includes("Weekday") &&
            lines.includes("Teen") &&
            !lines.includes("Weekend")
          );
        },
        success: "Both sides of or are comparisons, and the age band is a real pair of tests.",
      },
    },
  ],

  practice: [
    {
      type: "mcq",
      id: "q-cmp",
      level: "easy",
      skill: "A comparison is a bool",
      prompt: "What is the value of 8 >= 10?",
      options: ["8", "10", "True", "False"],
      answer: 3,
      explain: "A comparison produces a bool. 8 is not at least 10, so the value is False.",
    },
    {
      type: "mcq",
      id: "q-and-tt",
      level: "easy",
      skill: "and",
      prompt: "When is A and B true?",
      options: ["When A is true", "When B is true", "When both are true", "When either is true"],
      answer: 2,
      explain: "and needs every side. One false side makes the result false.",
    },
    {
      type: "mcq",
      id: "q-or-tt",
      level: "easy",
      skill: "or",
      prompt: "When is A or B false?",
      options: ["When A is false", "When B is false", "When both are false", "When both are true"],
      answer: 2,
      explain: "or fails only when there is no true side left.",
    },
    {
      type: "mcq",
      id: "q-three",
      level: "medium",
      skill: "Predict three bools",
      prompt: "A is True and B is False. What do A and B, A or B, and not A print?",
      options: ["False, True, False", "True, True, False", "False, False, True", "True, False, True"],
      answer: 0,
      explain: "and fails on B. or succeeds on A. not flips A to False.",
    },
    {
      type: "mcq",
      id: "q-not",
      level: "easy",
      skill: "not",
      prompt: "raining is False. What is not raining?",
      options: ["False", "True", "raining", "None"],
      answer: 1,
      explain: "not flips the bool. False becomes True.",
    },
    {
      type: "mcq",
      id: "q-age-fail",
      level: "medium",
      skill: "and with comparisons",
      prompt: "Age is 9 and score is 80. What is age >= 10 and score >= 50?",
      options: ["True", "False", "80", "TypeError"],
      answer: 1,
      explain: "The score passes. The age does not. and is false.",
    },
    {
      type: "mcq",
      id: "q-score-fail",
      level: "medium",
      skill: "and with comparisons",
      prompt: "Age is 12 and score is 40. What does the eligibility if print, if else says Not eligible?",
      options: ["Eligible", "Not eligible", "Both", "Nothing"],
      answer: 1,
      explain: "12 passes and 40 fails. The and is false, so else runs.",
    },
    {
      type: "mcq",
      id: "q-boundary",
      level: "medium",
      skill: "Boundaries inside and",
      prompt: "Age is 10 and score is 50. Does age >= 10 and score >= 50 succeed?",
      options: ["No", "Yes", "Only the age test", "TypeError"],
      answer: 1,
      explain: "Both tests use >=, so the equal values pass, and and is true.",
    },
    {
      type: "fill",
      id: "q-fill-and",
      level: "easy",
      skill: "Choose and",
      prompt: "Fill the keyword that means both tests must pass.",
      code: "if age >= 10 ___ score >= 50:",
      answers: ["and"],
      mode: "code",
      placeholder: "and",
      explain: "Both the age and the score are required. That keyword is and.",
    },
    {
      type: "fill",
      id: "q-fill-or",
      level: "easy",
      skill: "Choose or",
      prompt: "Fill the keyword that means either day is enough.",
      code: 'if day == "Saturday" ___ day == "Sunday":',
      answers: ["or"],
      mode: "code",
      placeholder: "or",
      explain: "One of the two days is enough, so the tests are joined with or.",
    },
    {
      type: "mcq",
      id: "q-sunday",
      level: "hard",
      skill: "A bare string in or",
      prompt: 'day is Monday. What does if day == "Saturday" or "Sunday" do?',
      options: [
        "It takes else, because Monday is neither day",
        "It takes the if, because the string Sunday counts as true",
        "SyntaxError",
        "It prints Sunday as the output",
      ],
      answer: 1,
      explain: "The right side is not a comparison. A non-empty string counts as true, so the body runs for every day.",
    },
    {
      type: "mcq",
      id: "q-band",
      level: "medium",
      skill: "A numeric band",
      prompt: "Which condition accepts a mark from 0 to 100, including 0 and 100?",
      options: [
        "score > 0 and score < 100",
        "score >= 0 and score <= 100",
        "score >= 0 or score <= 100",
        "score >= 0 and < 100",
      ],
      codeOptions: true,
      answer: 1,
      explain: "Include both ends with >= and <=, and join them with and. The last option is a syntax error.",
    },
    {
      type: "mcq",
      id: "q-or-wide",
      level: "hard",
      skill: "or is wider than and",
      prompt: "Which scores make score >= 0 or score <= 100 true?",
      options: [
        "Only scores from 0 to 100",
        "Almost every score, because a number that fails one test still passes the other",
        "No scores",
        "Only 0 and 100",
      ],
      answer: 1,
      explain: "A score of -5 still satisfies <= 100. A score of 500 still satisfies >= 0. or does not build a band. and does.",
    },
    {
      type: "mcq",
      id: "q-prec",
      level: "hard",
      skill: "and before or",
      prompt: "What is True or False and False?",
      options: ["True", "False", "None", "An error"],
      answer: 0,
      explain: "and happens first. False and False is False, then True or False is True.",
    },
    {
      type: "mcq",
      id: "q-brackets",
      level: "hard",
      skill: "Brackets",
      prompt: "What is (True or False) and False?",
      options: ["True", "False", "The same as True or False and False", "An error"],
      answer: 1,
      explain: "The brackets do the or first, which is True. True and False is False.",
    },
    {
      type: "mcq",
      id: "q-opposite",
      level: "hard",
      skill: "Opposite of and",
      prompt: "Which condition matches not (age >= 10 and score >= 50)?",
      options: [
        "age < 10 and score < 50",
        "age < 10 or score < 50",
        "age >= 10 or score >= 50",
        "not age >= 10 and not score >= 50",
      ],
      codeOptions: true,
      answer: 1,
      explain: "Failing a both-test means at least one part failed. That joining word is or.",
    },
    {
      type: "mcq",
      id: "q-nest-when",
      level: "medium",
      skill: "When to nest",
      prompt: "You must print Too young or Score too low, depending on which test failed. What fits?",
      options: [
        "One if with and, and one else",
        "A nested if, with an else on each test",
        "or, so either message can print",
        "not around the whole condition",
      ],
      answer: 1,
      explain: "The message depends on which gate failed. Each if needs its own else. and can only share one failure message.",
    },
    {
      type: "mcq",
      id: "q-nested-out",
      level: "hard",
      skill: "Read a nested if",
      prompt: "Outer test age >= 10, inner test score >= 50. Age is 8 and score is 90. The outer else prints Too young. What prints?",
      options: ["Eligible", "Score too low", "Too young", "Too young and Score too low"],
      answer: 2,
      explain: "The outer test fails, so the inner if never runs. The score is not examined.",
    },
    {
      type: "mcq",
      id: "q-guard",
      level: "hard",
      skill: "Guard first",
      prompt: "n is 0. Which condition avoids ZeroDivisionError?",
      options: [
        "if 10 / n > 2 and n != 0:",
        "if n != 0 and 10 / n > 2:",
        "if 10 / n > 2 or n != 0:",
        "if n == 0 and 10 / n > 2:",
      ],
      codeOptions: true,
      answer: 1,
      explain: "The left side n != 0 is false, so and does not evaluate the division.",
    },
    {
      type: "mcq",
      id: "q-zero",
      level: "medium",
      skill: "A bare number as a test",
      prompt: "score is 0. What does if score: do?",
      options: [
        "The body runs",
        "The body is skipped, because 0 counts as false",
        "SyntaxError",
        "It prints 0",
      ],
      answer: 1,
      explain: "0 is treated as false. Write score >= 0 or score == 0 if zero is a real score.",
    },
    {
      type: "order",
      id: "q-order-and",
      level: "medium",
      skill: "Order an and rule",
      prompt: "Put the lines in an order that prints Eligible only when both tests pass.",
      lines: [
        'print("Age?")',
        "age = int(input())",
        'print("Score?")',
        "score = int(input())",
        "if age >= 10 and score >= 50:",
        '    print("Eligible")',
        "else:",
        '    print("Not eligible")',
      ],
      code: true,
      explain: "Read both numbers before the test. The if header, with and, comes before its print. else lines up with if.",
    },
    {
      type: "order",
      id: "q-order-nest",
      level: "hard",
      skill: "Order a nested if",
      prompt: "Put the higher gate outside, so a low level never checks the points.",
      lines: [
        "if level >= 3:",
        "    if points >= 100:",
        '        print("Stage unlocked")',
        "    else:",
        '        print("Not enough points")',
        "else:",
        '    print("Level too low")',
      ],
      code: true,
      explain: "The level test is the outer if. The points test is indented inside it. Each else lines up with its own if.",
    },
    {
      type: "fill",
      id: "q-fill-out",
      level: "medium",
      skill: "Predict and",
      prompt: "What word is printed? Type that word only.",
      code: "age = 12\nscore = 40\nif age >= 10 and score >= 50:\n    print(\"Eligible\")\nelse:\n    print(\"Not\")",
      answers: ["Not"],
      mode: "text",
      explain: "The score test is false, so and is false and else prints Not.",
    },
    {
      type: "write",
      id: "q-write-eligible",
      level: "easy",
      skill: "and",
      prompt:
        "Print Age? and read a whole number. Print Score? and read a whole number. If the age is at least 10 and the score is at least 50, print Eligible. Otherwise print Not eligible.\n\nThe checker types:\n12\n60\n\nOutput must be:\nAge?\nScore?\nEligible",
      starter: 'print("Age?")\n',
      inputs: ["12", "60"],
      expected: "Age?\nScore?\nEligible",
      check: (_r, code) => {
        if (!/\band\b/.test(code)) return "Join the two tests with and.";
        if (!/>=\s*10/.test(code) || !/>=\s*50/.test(code)) return "Use age >= 10 and score >= 50.";
        return null;
      },
      hint: "if age >= 10 and score >= 50: print Eligible, else print Not eligible.",
      solution:
        'print("Age?")\nage = int(input())\nprint("Score?")\nscore = int(input())\nif age >= 10 and score >= 50:\n    print("Eligible")\nelse:\n    print("Not eligible")',
    },
    {
      type: "write",
      id: "q-write-weekend",
      level: "medium",
      skill: "or",
      prompt:
        "Print Day? and read a word. If it is Saturday or Sunday, print Weekend. Otherwise print Weekday. Compare the word twice.\n\nThe checker types:\nSunday\n\nOutput must be:\nDay?\nWeekend",
      starter: 'print("Day?")\n',
      inputs: ["Sunday"],
      expected: "Day?\nWeekend",
      check: (_r, code) => {
        if (!/\bor\b/.test(code)) return "Either day is enough, so join the tests with or.";
        if ((code.match(/==/g) ?? []).length < 2) return 'Write day == "Saturday" or day == "Sunday".';
        if (/or\s+["']Sunday["']/.test(code)) return "Sunday needs a comparison. Repeat day == on that side.";
        return null;
      },
      hint: 'if day == "Saturday" or day == "Sunday":',
      solution:
        'print("Day?")\nday = input()\nif day == "Saturday" or day == "Sunday":\n    print("Weekend")\nelse:\n    print("Weekday")',
    },
    {
      type: "write",
      id: "q-write-band",
      level: "medium",
      skill: "A band",
      prompt:
        "Print Mark? and read a whole number. If it is from 0 to 100, including both ends, print Valid. Otherwise print Invalid.\n\nThe checker types:\n105\n\nOutput must be:\nMark?\nInvalid",
      starter: "",
      inputs: ["105"],
      expected: "Mark?\nInvalid",
      check: (_r, code) => {
        const band = /(?:>=\s*0|0\s*<=)/.test(code) && /<=\s*100/.test(code);
        if (!band) return "Include both ends: score >= 0 and score <= 100.";
        if (!/else\s*:/.test(code)) return "Add an else that prints Invalid.";
        return null;
      },
      hint: "if score >= 0 and score <= 100: print Valid, else print Invalid. 105 fails the ceiling.",
      solution:
        'print("Mark?")\nscore = int(input())\nif score >= 0 and score <= 100:\n    print("Valid")\nelse:\n    print("Invalid")',
    },
    {
      type: "write",
      id: "q-write-not",
      level: "hard",
      skill: "not",
      prompt:
        "Print Raining? and read a word. Store whether that word is exactly yes. If it is not raining, print Go out. Otherwise print Stay in.\n\nThe checker types:\nno\n\nOutput must be:\nRaining?\nGo out",
      starter: 'print("Raining?")\n',
      inputs: ["no"],
      expected: "Raining?\nGo out",
      check: (_r, code) => {
        if (!/\bnot\b/.test(code)) return "Flip the bool with not.";
        if (!/==/.test(code)) return 'Decide raining with answer == "yes".';
        return null;
      },
      hint: 'raining = answer == "yes" then if not raining: print Go out, else print Stay in.',
      solution:
        'print("Raining?")\nanswer = input()\nraining = answer == "yes"\nif not raining:\n    print("Go out")\nelse:\n    print("Stay in")',
    },
    {
      type: "write",
      id: "q-challenge",
      level: "hard",
      skill: "Mini challenge",
      challenge: true,
      prompt:
        "Unlock a stage.\n• Print Points? and read a whole number\n• Print Level? and read a whole number\n• 100 points or more, and level 3 or more, prints Stage unlocked\n• otherwise print Locked\n\nThe checker types:\n150\n3\n\nOutput must be:\nPoints?\nLevel?\nStage unlocked",
      starter: 'print("Points?")\n',
      inputs: ["150", "3"],
      expected: "Points?\nLevel?\nStage unlocked",
      check: (_r, code) => {
        if (!/\band\b/.test(code)) return "Both gates are required, so use and.";
        if (!/>=\s*100/.test(code) || !/>=\s*3/.test(code)) return "Use points >= 100 and level >= 3.";
        if (!/else\s*:/.test(code)) return "Add an else that prints Locked.";
        return null;
      },
      hint: "if points >= 100 and level >= 3: print Stage unlocked, else print Locked.",
      solution:
        'print("Points?")\npoints = int(input())\nprint("Level?")\nlevel = int(input())\nif points >= 100 and level >= 3:\n    print("Stage unlocked")\nelse:\n    print("Locked")',
    },
  ],
};
