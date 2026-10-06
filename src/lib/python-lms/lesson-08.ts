import type { PythonLmsLesson } from "@/lib/python-lms/types";

export const LESSON_08: PythonLmsLesson = {
  slug: "lesson-8",
  number: 8,
  title: "Lists",
  subtitle: "Working with many values",
  minutes: 60,
  goals: [
    "Create a list and read items by index, starting from 0",
    "Change an item, and know a string cannot be changed that way",
    "Grow a list with append() and shrink it with remove()",
    "Use len() on a list, and avoid asking for an index past the end",
    "Loop through every item, and keep a total or a count while you do",
  ],
  canDo: "Create a list, change it, and loop through every item.",

  notes: [
    {
      id: "why",
      part: "Part 1 · What a list is",
      title: "Many values, one name",
      blocks: [
        {
          type: "lead",
          text: "A list holds many values, in order, under one name. You can add to it, take from it, and loop through all of it.",
        },
        {
          type: "p",
          text: "Three favourite games in three variables works. Thirty does not. You would need thirty names, and you could not loop through them. A list keeps them together.",
        },
        {
          type: "compare",
          left: {
            label: "One variable each",
            tone: "neutral",
            code: 'game1 = "Minecraft"\ngame2 = "Chess"\ngame3 = "Roblox"\nprint(game1)\nprint(game2)\nprint(game3)',
            output: "Minecraft\nChess\nRoblox",
          },
          right: {
            label: "One list",
            tone: "good",
            code: 'games = ["Minecraft", "Chess", "Roblox"]\nfor game in games:\n    print(game)',
            output: "Minecraft\nChess\nRoblox",
          },
        },
        {
          type: "p",
          text: "Add a fourth game to the list and the loop prints it too. Nothing else changes. With separate variables you would need a new name and a new print.",
        },
        {
          type: "check",
          id: "c-why",
          question: "Why use a list instead of game1, game2, game3?",
          options: [
            "Lists run faster than print",
            "One name holds all the values, in order, and a loop can visit each one",
            "Variables cannot hold text",
            "Lists can only hold three items",
          ],
          answer: 1,
          explain: "A list keeps related values together under one name, so you can grow it and loop through it.",
        },
      ],
    },
    {
      id: "create",
      part: "Part 1 · What a list is",
      title: "Square brackets and commas",
      blocks: [
        {
          type: "anatomy",
          code: 'games = ["Minecraft", "Chess", "Roblox"]',
          parts: [
            { token: "games", label: "The variable name for the whole list." },
            { token: "[", label: "Square bracket opens the list." },
            { token: '"Minecraft", "Chess", "Roblox"', label: "The **items**, separated by commas. Text items still need quotes." },
            { token: "]", label: "Square bracket closes the list." },
          ],
        },
        {
          type: "code",
          live: true,
          code: 'games = ["Minecraft", "Chess", "Roblox"]\nmarks = [70, 85, 90]\nempty = []\nprint(games)\nprint(marks)\nprint(empty)',
        },
        {
          type: "p",
          text: "Printing a whole list shows the brackets and commas. Text items show single quotes, even if you typed double quotes. Number items have no quotes. [] is an empty list, ready to be filled later.",
        },
        {
          type: "check",
          id: "c-create",
          question: "Which line makes a list of three numbers?",
          options: ["nums = (1, 2, 3", "nums = [1, 2, 3]", "nums = [1 2 3]", 'nums = "1, 2, 3"'],
          codeOptions: true,
          answer: 1,
          explain: "Square brackets, items separated by commas. The last option is one string, not a list.",
        },
      ],
    },
    {
      id: "index",
      part: "Part 1 · What a list is",
      title: "Indexing works like strings",
      blocks: [
        {
          type: "p",
          text: "Items are numbered from 0, exactly like characters in a string. games[0] is the first item. games[-1] is the last.",
        },
        {
          type: "table",
          head: ["Item", "Minecraft", "Chess", "Roblox"],
          rows: [
            ["Index", "0", "1", "2"],
            ["From the right", "-3", "-2", "-1"],
          ],
        },
        {
          type: "code",
          live: true,
          code: 'games = ["Minecraft", "Chess", "Roblox"]\nprint(games[0])\nprint(games[1])\nprint(games[-1])',
        },
        {
          type: "p",
          text: "One item comes back on its own, without brackets or quotes: games[1] prints Chess. An index on a string gives a character. An index on a list gives a whole item.",
        },
        {
          type: "check",
          id: "c-index",
          question: 'games = ["Minecraft", "Chess", "Roblox"]. What is games[2]?',
          options: ["Chess", "Roblox", "Minecraft", "IndexError"],
          answer: 1,
          explain: "0 is Minecraft, 1 is Chess, 2 is Roblox.",
        },
      ],
    },
    {
      id: "len",
      part: "Part 1 · What a list is",
      title: "len() counts items, not letters",
      blocks: [
        {
          type: "p",
          text: "len() on a list counts the items. len([\"Minecraft\", \"Chess\"]) is 2, even though Minecraft alone has 9 letters. An empty list has length 0.",
        },
        {
          type: "code",
          live: true,
          code: 'games = ["Minecraft", "Chess", "Roblox"]\nprint(len(games))\nprint(len(games[0]))\nprint(len([]))',
        },
        {
          type: "p",
          text: "len(games) is 3 items. len(games[0]) is the length of the string Minecraft, which is 9. The brackets decide what is being counted.",
        },
        {
          type: "check",
          id: "c-len",
          question: 'What is len(["cat", "dog"])?',
          options: ["6", "2", "3", "0"],
          answer: 1,
          explain: "Two items. len counts items, not the letters inside them.",
        },
      ],
    },
    {
      id: "past-end",
      part: "Part 1 · What a list is",
      title: "The last index is len minus 1",
      blocks: [
        {
          type: "p",
          text: "Same rule as strings. A 3-item list has indexes 0, 1 and 2. games[3] does not exist.",
        },
        {
          type: "compare",
          left: {
            label: "One past the end",
            tone: "bad",
            code: 'games = ["Minecraft", "Chess", "Roblox"]\nprint(games[3])',
            output: "IndexError: list index out of range",
          },
          right: {
            label: "The last item",
            tone: "good",
            code: 'games = ["Minecraft", "Chess", "Roblox"]\nprint(games[2])\nprint(games[-1])',
            output: "Roblox\nRoblox",
          },
        },
        {
          type: "callout",
          tone: "exam",
          text: "On a 3-item list, games[3] is an error. The last item is games[2], or games[-1]. When the list grows or shrinks, -1 still finds the last item.",
        },
        {
          type: "check",
          id: "c-past-end",
          question: "A list has 5 items. What is the index of the last one?",
          options: ["5", "4", "6", "-5"],
          answer: 1,
          explain: "Indexes run 0 to 4. The last index is len minus 1.",
        },
      ],
    },
    {
      id: "change",
      part: "Part 1 · What a list is",
      title: "Change an item in place",
      blocks: [
        {
          type: "p",
          text: "A list can be changed. Put an index on the left of = and that slot gets a new value. The other items stay where they are.",
        },
        {
          type: "code",
          live: true,
          code: 'games = ["Minecraft", "Chess", "Roblox"]\ngames[1] = "Football"\nprint(games)',
        },
        {
          type: "p",
          text: "Chess is replaced by Football at index 1. The list still has three items. Strings are different. They cannot be changed this way.",
        },
        {
          type: "compare",
          left: {
            label: "A string cannot change",
            tone: "bad",
            code: 'word = "cat"\nword[0] = "b"',
            output: "TypeError: 'str' object does not support item assignment",
          },
          right: {
            label: "Make a new string",
            tone: "good",
            code: 'word = "cat"\nword = "b" + word[1:]\nprint(word)',
            output: "bat",
          },
        },
        {
          type: "check",
          id: "c-change",
          question: 'nums = [1, 2, 3], then nums[0] = 9. What is nums?',
          options: ["[1, 2, 3]", "[9, 2, 3]", "[9, 1, 2, 3]", "[1, 2, 9]"],
          codeOptions: true,
          answer: 1,
          explain: "Index 0 is the first slot. Its value becomes 9. Nothing is added.",
        },
      ],
    },
    {
      id: "append",
      part: "Part 2 · Growing and shrinking",
      title: "append() adds one item to the end",
      blocks: [
        {
          type: "p",
          text: "append is a list method. It puts one new item at the end. The list itself changes, so you do not need = to keep the result.",
        },
        {
          type: "anatomy",
          code: 'games.append("Roblox")',
          parts: [
            { token: "games", label: "The list to grow." },
            { token: ".append", label: "The method. It always adds at the end." },
            { token: '("Roblox")', label: "The one item to add." },
          ],
        },
        {
          type: "code",
          live: true,
          code: 'games = ["Minecraft", "Chess"]\nprint(len(games))\ngames.append("Roblox")\nprint(games)\nprint(len(games))',
        },
        {
          type: "compare",
          left: {
            label: "Stored the wrong thing",
            tone: "bad",
            code: 'games = ["Chess"]\ngames = games.append("Roblox")\nprint(games)',
            output: "None",
          },
          right: {
            label: "Just call it",
            tone: "good",
            code: 'games = ["Chess"]\ngames.append("Roblox")\nprint(games)',
            output: "['Chess', 'Roblox']",
          },
        },
        {
          type: "callout",
          tone: "warn",
          text: "This is the opposite of string methods. upper() gives back a new string, so you store it. append() changes the list and gives back None. games = games.append(...) throws your list away.",
        },
        {
          type: "check",
          id: "c-append",
          question: 'games = ["Minecraft", "Chess"], then games.append("Roblox"). What is len(games)?',
          options: ["2", "3", "4", "None"],
          answer: 1,
          explain: "append adds one item. Two becomes three.",
        },
      ],
    },
    {
      id: "build",
      part: "Part 2 · Growing and shrinking",
      title: "Start empty, fill in a loop",
      blocks: [
        {
          type: "p",
          text: "A common shape: create an empty list before the loop, append on every pass, then use the full list after. It is the running total idea, but the list remembers every value, not just the sum.",
        },
        {
          type: "code",
          live: true,
          code: "tens = []\nfor i in range(1, 4):\n    tens.append(i * 10)\nprint(tens)",
        },
        {
          type: "table",
          head: ["Pass", "i", "Appended", "tens afterwards"],
          rows: [
            ["start", "—", "—", "[]"],
            ["1", "1", "10", "[10]"],
            ["2", "2", "20", "[10, 20]"],
            ["3", "3", "30", "[10, 20, 30]"],
          ],
        },
        {
          type: "p",
          text: "tens = [] must be outside the loop. Inside, it would be emptied at the start of every pass, and you would end with only [30].",
        },
        {
          type: "check",
          id: "c-build",
          question: "nums = [], then for i in range(3): nums.append(i). What is nums?",
          options: ["[1, 2, 3]", "[0, 1, 2]", "[3]", "[0, 1, 2, 3]"],
          codeOptions: true,
          answer: 1,
          explain: "range(3) visits 0, 1 and 2. Each one is appended in turn.",
        },
      ],
    },
    {
      id: "remove",
      part: "Part 2 · Growing and shrinking",
      title: "remove() takes out a value",
      blocks: [
        {
          type: "p",
          text: "remove is given the value to take out, not its index. It finds the first match, removes it, and the items after it move up one place.",
        },
        {
          type: "code",
          live: true,
          code: 'games = ["Minecraft", "Chess", "Roblox"]\ngames.remove("Chess")\nprint(games)\nprint(games[1])',
        },
        {
          type: "p",
          text: "After Chess is gone, Roblox moves from index 2 to index 1. If the value is in the list twice, only the first one is removed. [1, 2, 1] after remove(1) is [2, 1].",
        },
        {
          type: "compare",
          left: {
            label: "Value not there",
            tone: "bad",
            code: 'games = ["Minecraft", "Roblox"]\ngames.remove("Chess")',
            output: "ValueError: list.remove(x): x not in list",
          },
          right: {
            label: "Exact match",
            tone: "good",
            code: 'games = ["Minecraft", "Roblox"]\ngames.remove("Roblox")\nprint(games)',
            output: "['Minecraft']",
          },
        },
        {
          type: "check",
          id: "c-remove",
          question: "nums = [1, 2, 1], then nums.remove(1). What is nums?",
          options: ["[2]", "[2, 1]", "[1, 2]", "[1, 1]"],
          codeOptions: true,
          answer: 1,
          explain: "Only the first 1 is removed. The second 1 stays.",
        },
      ],
    },
    {
      id: "in",
      part: "Part 2 · Growing and shrinking",
      title: "Check with in before you remove",
      blocks: [
        {
          type: "p",
          text: "in asks whether a value is in the list. It gives True or False, so it fits straight into an if. Check first, and remove() cannot fail.",
        },
        {
          type: "code",
          live: true,
          inputs: ["Chess"],
          code: 'games = ["Minecraft", "Chess", "Roblox"]\nprint("Remove which game?")\nname = input()\nif name in games:\n    games.remove(name)\n    print("Removed", name)\nelse:\n    print(name, "is not on the list")\nprint(games)',
        },
        {
          type: "p",
          text: "Try Chess, then Football. Football is not in the list, so the else branch runs and nothing crashes. in is case-sensitive: chess with a small c is not the same item as Chess.",
        },
        {
          type: "check",
          id: "c-in",
          question: 'games = ["Minecraft", "Chess"]. What is "Roblox" in games?',
          options: ["True", "False", "IndexError", "Roblox"],
          answer: 1,
          explain: "Roblox is not one of the items, so in gives False.",
        },
      ],
    },
    {
      id: "loop",
      part: "Part 3 · Looping through a list",
      title: "for item in list",
      blocks: [
        {
          type: "lead",
          text: "for game in games visits every item in order. Each pass, game holds the next item. There is no index to manage.",
        },
        {
          type: "code",
          live: true,
          code: 'games = ["Minecraft", "Chess", "Roblox"]\nfor game in games:\n    print("I like", game)\nprint("That is", len(games), "games")',
        },
        {
          type: "table",
          head: ["Pass", "game holds", "Printed"],
          rows: [
            ["1", "Minecraft", "I like Minecraft"],
            ["2", "Chess", "I like Chess"],
            ["3", "Roblox", "I like Roblox"],
          ],
        },
        {
          type: "p",
          text: "The number of passes is the length of the list. Append a fourth game and the loop makes four passes, with no change to the loop. Pick a loop name that reads well: for game in games, for mark in marks.",
        },
        {
          type: "check",
          id: "c-loop",
          question: "A list has 4 items. How many passes does for item in the_list make?",
          options: ["3", "4", "5", "1"],
          answer: 1,
          explain: "One pass per item.",
        },
      ],
    },
    {
      id: "total",
      part: "Part 3 · Looping through a list",
      title: "Total and average",
      blocks: [
        {
          type: "p",
          text: "Add every mark into a total that lives outside the loop. After the loop, the average is the total divided by how many marks there are, which is len(marks).",
        },
        {
          type: "table",
          head: ["Pass", "mark", "total afterwards"],
          rows: [
            ["start", "—", "0"],
            ["1", "70", "70"],
            ["2", "85", "155"],
            ["3", "90", "245"],
          ],
        },
        {
          type: "code",
          live: true,
          code: "marks = [70, 85, 90]\ntotal = 0\nfor mark in marks:\n    total = total + mark\nprint(total)\nprint(total / len(marks))",
        },
        {
          type: "p",
          text: "245 divided by 3 is 81.66666666666667. / always gives a decimal. Use len(marks) instead of typing 3, so the average stays right when a mark is added.",
        },
        {
          type: "check",
          id: "c-total",
          question: "marks = [10, 20, 30]. After the total loop, what is total / len(marks)?",
          options: ["60", "20.0", "30", "3"],
          answer: 1,
          explain: "The total is 60. There are 3 marks. 60 / 3 is 20.0.",
        },
      ],
    },
    {
      id: "count",
      part: "Part 3 · Looping through a list",
      title: "Count the items that pass a test",
      blocks: [
        {
          type: "p",
          text: "Put an if inside the loop. Only the items that pass the test add 1 to the count. This is how you count passes, high scores or anything else.",
        },
        {
          type: "code",
          live: true,
          code: 'marks = [70, 85, 90, 45]\npassed = 0\nfor mark in marks:\n    if mark >= 80:\n        passed = passed + 1\nprint(passed, "marks are 80 or more")',
        },
        {
          type: "p",
          text: "85 and 90 pass the test. 70 and 45 do not. So passed ends at 2. The loop still visits all four marks. The if decides which ones count.",
        },
        {
          type: "check",
          id: "c-count",
          question: "nums = [3, 8, 1, 9]. How many are greater than 5?",
          options: ["1", "2", "3", "4"],
          answer: 1,
          explain: "8 and 9 are greater than 5. That is 2.",
        },
      ],
    },
    {
      id: "positions",
      part: "Part 3 · Looping through a list",
      title: "When you need the position too",
      blocks: [
        {
          type: "p",
          text: "for game in games gives the item but not its number. To get both, loop over range(len(games)). That visits 0, 1, 2, which are exactly the valid indexes.",
        },
        {
          type: "code",
          live: true,
          code: 'games = ["Minecraft", "Chess", "Roblox"]\nfor i in range(len(games)):\n    print(i + 1, games[i])',
        },
        {
          type: "p",
          text: "i is 0, 1 and 2, so games[i] is each item. i + 1 makes the printed numbers 1, 2, 3, which reads better for people. range(len(games)) never reaches 3, so there is no IndexError.",
        },
        {
          type: "check",
          id: "c-positions",
          question: "games has 3 items. Which numbers does range(len(games)) visit?",
          options: ["1, 2, 3", "0, 1, 2", "0, 1, 2, 3", "3"],
          answer: 1,
          explain: "len(games) is 3. range(3) is 0, 1, 2, the valid indexes.",
        },
      ],
    },
    {
      id: "project",
      part: "Part 3 · Looping through a list",
      title: "Favourite games, start to finish",
      blocks: [
        {
          type: "p",
          text: "The lesson project uses every step: create a list, add an item, remove an item, then print what is left with a loop.",
        },
        {
          type: "code",
          live: true,
          code: 'games = ["Minecraft", "Chess", "Roblox"]\ngames.append("Football")\ngames.remove("Chess")\n\nfor game in games:\n    print(game)',
        },
        {
          type: "list",
          ordered: true,
          items: [
            "Start: Minecraft, Chess, Roblox.",
            "append adds Football at the end: Minecraft, Chess, Roblox, Football.",
            "remove takes out Chess: Minecraft, Roblox, Football.",
            "The loop prints those three, in that order.",
          ],
        },
        {
          type: "check",
          id: "c-project",
          question: "In that program, what is the last line printed?",
          options: ["Roblox", "Football", "Chess", "Minecraft"],
          answer: 1,
          explain: "append always adds at the end, and nothing was added after Football.",
        },
      ],
    },
    {
      id: "terms",
      part: "Part 4 · Revise",
      title: "Key terms",
      blocks: [
        {
          type: "terms",
          items: [
            { term: "List", meaning: "Many values in order, in square brackets, under one name." },
            { term: "Item", meaning: "One value inside a list." },
            { term: "Index", meaning: "The position of an item. The first is 0, the last is len minus 1." },
            { term: "len()", meaning: "On a list, counts the items." },
            { term: "append()", meaning: "Adds one item to the end. Changes the list and gives back None." },
            { term: "remove()", meaning: "Takes out the first item equal to the given value." },
            { term: "in", meaning: "True if the value is one of the items." },
            { term: "Empty list", meaning: "[]. Length 0. Often filled with append in a loop." },
            { term: "IndexError", meaning: "The index is past the end of the list." },
            { term: "ValueError", meaning: "remove() was asked for a value that is not in the list." },
          ],
        },
      ],
    },
    {
      id: "exam",
      part: "Part 4 · Revise",
      title: "Exam corner",
      blocks: [
        {
          type: "lead",
          text: "Write the list out with index numbers under each item, then answer.",
        },
        {
          type: "flashcards",
          cards: [
            { q: 'games = ["A", "B", "C"]. What is games[0]?', a: "A. The first item is index 0." },
            { q: "What is the last index of a 3-item list?", a: "2. games[3] is IndexError." },
            { q: "What does games[-1] give?", a: "The last item, whatever the length." },
            { q: 'What is len(["cat", "dog"])?', a: "2. It counts items, not letters." },
            { q: "Where does append put the new item?", a: "At the end." },
            { q: "What does games = games.append(x) leave in games?", a: "None. append changes the list and gives back None." },
            { q: "nums = [1, 2, 1], then nums.remove(1). What is nums?", a: "[2, 1]. Only the first match is removed." },
            { q: "What happens if remove() cannot find the value?", a: "ValueError. Check with in first." },
            { q: 'word = "cat", then word[0] = "b". What happens?', a: "TypeError. Strings cannot be changed in place. Lists can." },
            { q: "How do you loop through every item?", a: "for item in the_list: then use item in the body." },
            { q: "What range gives the valid indexes of a list?", a: "range(len(the_list))." },
            { q: "How do you work out an average of a list of marks?", a: "Add them in a loop, then divide the total by len(marks)." },
          ],
        },
        {
          type: "check",
          id: "c-exam-order",
          question: 'nums = [5, 6], then nums.append(7), then nums.remove(5). What is nums?',
          options: ["[5, 6, 7]", "[6, 7]", "[7, 6]", "[5, 6]"],
          codeOptions: true,
          answer: 1,
          explain: "append makes [5, 6, 7]. remove(5) takes the 5 out, leaving [6, 7].",
        },
        {
          type: "check",
          id: "c-exam-error",
          question: "colours has 4 items. Which line is an IndexError?",
          options: ["colours[0]", "colours[3]", "colours[4]", "colours[-1]"],
          codeOptions: true,
          answer: 2,
          explain: "4 items means indexes 0 to 3. Index 4 is past the end.",
        },
      ],
    },
    {
      id: "recap",
      part: "Part 4 · Revise",
      title: "Chapter summary",
      blocks: [
        {
          type: "list",
          items: [
            "A list is values in square brackets, separated by commas, in order.",
            "Items are numbered from 0. The last is len minus 1, or -1.",
            "len() counts items. An empty list [] has length 0.",
            "list[i] = value changes one item. Strings cannot be changed this way.",
            "append() adds to the end. remove() takes out the first match. Neither needs =.",
            "Check with in before remove(), or a missing value is ValueError.",
            "for item in the_list visits every item. Keep totals and counts outside the loop.",
          ],
        },
        {
          type: "callout",
          tone: "fact",
          title: "Next up",
          text: "The Examples step through indexes, append and remove, a loop, and a total. Then you build your own list, finish Favourite Games, total some marks and fix an IndexError.",
        },
      ],
    },
  ],

  examples: [
    {
      type: "trace",
      id: "trace-index",
      title: "First, last, and how many",
      intro: "The same index rules as strings, but each index gives a whole item.",
      code: 'games = ["Minecraft", "Chess", "Roblox"]\nprint(games[0])\nprint(games[-1])\nprint(len(games))',
      steps: [
        { line: 1, note: "Three items, at indexes 0, 1 and 2." },
        { line: 2, output: "Minecraft", note: "Index 0 is the first item. It prints without quotes or brackets." },
        { line: 3, output: "Roblox", note: "-1 is the last item, the same as games[2]." },
        { line: 4, output: "3", note: "len counts items. 3 is a count, not an index. games[3] would be IndexError." },
      ],
    },
    {
      type: "trace",
      id: "trace-change",
      title: "Append, then remove",
      intro: "Watch the list grow by one, then shrink by one. The items after a removed one move up.",
      code: 'games = ["Minecraft", "Chess"]\ngames.append("Roblox")\nprint(games)\ngames.remove("Chess")\nprint(games)\nprint(games[1])',
      steps: [
        { line: 1, note: "Two items. Index 1 is Chess." },
        { line: 2, note: "append adds Roblox at the end. No = is needed. The list itself changed." },
        { line: 3, output: "['Minecraft', 'Chess', 'Roblox']", note: "Printing the whole list shows brackets, commas and single quotes." },
        { line: 4, note: "remove finds Chess by its value and takes it out." },
        { line: 5, output: "['Minecraft', 'Roblox']", note: "Two items again." },
        { line: 6, output: "Roblox", note: "Roblox moved up from index 2 to index 1 when Chess was removed." },
      ],
    },
    {
      type: "trace",
      id: "trace-loop",
      title: "One pass per item",
      intro: "The loop variable holds the next item on every pass.",
      code: 'games = ["Minecraft", "Chess", "Roblox"]\nfor game in games:\n    print("I like", game)',
      steps: [
        { line: 1, note: "Three items, so there will be three passes." },
        { line: 2, note: "Pass 1. game holds Minecraft." },
        { line: 3, output: "I like Minecraft", note: "The body uses the current item." },
        { line: 2, note: "Pass 2. game holds Chess." },
        { line: 3, output: "I like Chess", note: "Same print line, new item." },
        { line: 2, note: "Pass 3. game holds Roblox." },
        { line: 3, output: "I like Roblox", note: "There are no items left, so the loop ends." },
      ],
    },
    {
      type: "trace",
      id: "trace-total",
      title: "Total and average",
      intro: "total remembers between passes. mark changes every pass.",
      code: "marks = [70, 85, 90]\ntotal = 0\nfor mark in marks:\n    total = total + mark\nprint(total)\nprint(total / len(marks))",
      steps: [
        { line: 1, note: "Three marks." },
        { line: 2, note: "total starts at 0, before the loop." },
        { line: 3, note: "Pass 1. mark is 70." },
        { line: 4, note: "0 + 70. total is 70." },
        { line: 3, note: "Pass 2. mark is 85." },
        { line: 4, note: "70 + 85. total is 155." },
        { line: 3, note: "Pass 3. mark is 90." },
        { line: 4, note: "155 + 90. total is 245. No marks are left." },
        { line: 5, output: "245", note: "Printed once, after the loop." },
        { line: 6, output: "81.66666666666667", note: "245 / 3. / always gives a decimal. len(marks) supplied the 3." },
      ],
    },
    {
      type: "playground",
      id: "play-favourites",
      title: "Your own list",
      intro: "Make a list of at least three favourite foods. Print each one on its own line with a for loop.",
      starter: "# make a list of foods, then loop through it\n",
      tryThis: ["Square brackets, commas, quotes around each food", "for food in foods: print(food)", "Append one more food and run again"],
      goal: {
        text: "Create a list with at least three items and print them with a for loop.",
        check: (r, code) => {
          const lines = r.stdout.split("\n").filter((line) => line.trim() !== "");
          return r.ok && /\[[^\]]*,[^\]]*,[^\]]*\]/.test(code) && /\bfor\b.+\bin\b/.test(code) && lines.length >= 3;
        },
        success: "One list, one loop, one print line, every item shown.",
      },
    },
    {
      type: "playground",
      id: "play-games",
      title: "Favourite games",
      intro: "The lesson project. Add Football, remove Chess, then print every game with a loop.",
      starter: 'games = ["Minecraft", "Chess", "Roblox"]\n# add Football, remove Chess, print each game\n',
      tryThis: ['games.append("Football")', 'games.remove("Chess")', "for game in games: print(game)"],
      goal: {
        text: "Print Minecraft, Roblox and Football, in that order, using append, remove and a for loop.",
        check: (r, code) =>
          r.ok &&
          /\.append\s*\(/.test(code) &&
          /\.remove\s*\(/.test(code) &&
          /\bfor\b/.test(code) &&
          r.stdout.trim() === "Minecraft\nRoblox\nFootball",
        success: "append added at the end, remove took out Chess, and the loop printed what was left.",
      },
    },
    {
      type: "playground",
      id: "play-total",
      title: "Total and average of marks",
      intro: "Add up the marks in a loop. Print the total, then the average.",
      starter: "marks = [70, 85, 90, 55]\ntotal = 0\n# loop, add each mark, then print total and the average\n",
      tryThis: ["for mark in marks: total = total + mark", "print(total) after the loop", "print(total / len(marks))"],
      goal: {
        text: "Print 300 and then 75.0, using a for loop.",
        check: (r, code) => {
          const lines = r.stdout.split("\n").map((line) => line.trim());
          return r.ok && /\bfor\b/.test(code) && lines.includes("300") && lines.includes("75.0");
        },
        success: "300 divided by 4 marks is 75.0.",
      },
    },
    {
      type: "playground",
      id: "play-bugs",
      title: "Bug hunt: the last game",
      intro: "This should print the last game. It crashes. Read the error and fix the index.",
      starter: 'games = ["Minecraft", "Chess", "Roblox"]\nprint(games[3])',
      tryThis: ["Run it and read the error", "3 items means indexes 0, 1, 2", "Use 2, or -1"],
      goal: {
        text: "Print Roblox with no error.",
        check: (r) => r.ok && r.stdout.trim() === "Roblox",
        success: "The last index is len minus 1. -1 keeps working if the list grows.",
      },
    },
  ],

  practice: [
    {
      type: "mcq",
      id: "q-create",
      level: "easy",
      skill: "Creating a list",
      prompt: "Which line creates a list?",
      options: ['games = "Minecraft, Chess"', 'games = ["Minecraft", "Chess"]', "games = [Minecraft Chess]", 'games = ("Minecraft"'],
      codeOptions: true,
      answer: 1,
      explain: "Square brackets, items separated by commas, text items in quotes.",
    },
    {
      type: "mcq",
      id: "q-first",
      level: "easy",
      skill: "Index 0",
      prompt: "What is printed?",
      code: 'games = ["Minecraft", "Chess", "Roblox"]\nprint(games[0])',
      options: ["Chess", "Minecraft", "Roblox", "IndexError"],
      answer: 1,
      explain: "The first item is index 0.",
    },
    {
      type: "mcq",
      id: "q-past-end",
      level: "medium",
      skill: "IndexError",
      prompt: "What happens?",
      code: 'games = ["Minecraft", "Chess", "Roblox"]\nprint(games[3])',
      options: ["It prints Roblox", "It prints nothing", "IndexError", "It prints 3"],
      answer: 2,
      explain: "Three items have indexes 0, 1, 2. Index 3 does not exist.",
    },
    {
      type: "mcq",
      id: "q-len",
      level: "easy",
      skill: "len() on a list",
      prompt: 'What is len(["red", "green", "blue"])?',
      options: ["12", "3", "2", "1"],
      answer: 1,
      explain: "Three items. len counts items, not letters.",
    },
    {
      type: "mcq",
      id: "q-negative",
      level: "medium",
      skill: "The last item",
      prompt: 'games = ["Minecraft", "Chess", "Roblox"]. What is games[-1]?',
      options: ["Minecraft", "Chess", "Roblox", "IndexError"],
      answer: 2,
      explain: "-1 is always the last item.",
    },
    {
      type: "fill",
      id: "q-fill-append",
      level: "easy",
      skill: "append()",
      prompt: "Fill the method that adds Roblox to the end of the list.",
      code: 'games.___("Roblox")',
      answers: ["append"],
      mode: "code",
      placeholder: "append",
      explain: "append adds one item at the end.",
    },
    {
      type: "mcq",
      id: "q-append-len",
      level: "medium",
      skill: "Predict after append",
      prompt: "What gets printed?",
      code: 'games = ["Minecraft", "Chess"]\ngames.append("Roblox")\nprint(len(games))',
      options: ["2", "3", "4", "None"],
      answer: 1,
      explain: "append adds one item. Two becomes three.",
    },
    {
      type: "mcq",
      id: "q-remove-first",
      level: "medium",
      skill: "remove() takes the first match",
      prompt: "What is printed?",
      code: "nums = [1, 2, 1]\nnums.remove(1)\nprint(nums)",
      options: ["[2]", "[2, 1]", "[1, 2]", "[1, 2, 1]"],
      codeOptions: true,
      answer: 1,
      explain: "Only the first 1 is removed. The second one stays.",
    },
    {
      type: "mcq",
      id: "q-remove-missing",
      level: "hard",
      skill: "Removing a missing value",
      prompt: "What happens?",
      code: 'games = ["Minecraft", "Roblox"]\ngames.remove("Chess")',
      options: ["Nothing, the list is unchanged", "IndexError", "ValueError", "Roblox is removed"],
      answer: 2,
      explain: "remove cannot find Chess, so it raises ValueError. Check with in first.",
    },
    {
      type: "mcq",
      id: "q-change",
      level: "medium",
      skill: "Changing an item",
      prompt: "What is printed?",
      code: 'games = ["Minecraft", "Chess", "Roblox"]\ngames[1] = "Football"\nprint(games)',
      options: [
        "['Minecraft', 'Chess', 'Roblox']",
        "['Football', 'Chess', 'Roblox']",
        "['Minecraft', 'Football', 'Roblox']",
        "['Minecraft', 'Chess', 'Football']",
      ],
      codeOptions: true,
      answer: 2,
      explain: "Index 1 is the second slot, Chess. It becomes Football.",
    },
    {
      type: "mcq",
      id: "q-string-change",
      level: "hard",
      skill: "Strings vs lists",
      prompt: "What happens?",
      code: 'word = "cat"\nword[0] = "b"',
      options: ["word becomes bat", "word becomes bcat", "TypeError", "IndexError"],
      answer: 2,
      explain: "Strings cannot be changed in place. Lists can. word = \"b\" + word[1:] makes a new string.",
    },
    {
      type: "mcq",
      id: "q-append-none",
      level: "hard",
      skill: "append gives back None",
      prompt: "What is printed?",
      code: 'games = ["Chess"]\ngames = games.append("Roblox")\nprint(games)',
      options: ["['Chess', 'Roblox']", "['Roblox']", "None", "Roblox"],
      codeOptions: true,
      answer: 2,
      explain: "append changes the list and gives back None. Storing that None in games loses the list.",
    },
    {
      type: "fill",
      id: "q-fill-print-list",
      level: "medium",
      skill: "Printing a list",
      prompt: "Type exactly what this prints.",
      code: 'print(["a", "b"])',
      answers: ["['a', 'b']", "['a','b']"],
      mode: "text",
      explain: "A printed list shows brackets, commas, and single quotes around text items.",
    },
    {
      type: "mcq",
      id: "q-loop-lines",
      level: "easy",
      skill: "Looping through a list",
      prompt: "How many lines does this print?",
      code: 'for game in ["Minecraft", "Chess", "Roblox", "Football"]:\n    print(game)',
      options: ["3", "4", "5", "1"],
      answer: 1,
      explain: "One pass per item, four items.",
    },
    {
      type: "fill",
      id: "q-fill-total",
      level: "medium",
      skill: "Predict a total",
      prompt: "What number is printed?",
      code: "nums = [2, 4, 6]\ntotal = 0\nfor n in nums:\n    total = total + n\nprint(total)",
      answers: ["12"],
      mode: "text",
      explain: "0 + 2 + 4 + 6 is 12.",
    },
    {
      type: "mcq",
      id: "q-range-len",
      level: "medium",
      skill: "Valid indexes",
      prompt: "games has 3 items. Which numbers does range(len(games)) visit?",
      options: ["1, 2, 3", "0, 1, 2", "0, 1, 2, 3", "3"],
      answer: 1,
      explain: "len(games) is 3, and range(3) is 0, 1, 2. Exactly the valid indexes.",
    },
    {
      type: "order",
      id: "q-order-shopping",
      level: "medium",
      skill: "Order the list steps",
      prompt: "Put the lines in an order that starts a list, adds rice, removes bread, then prints every item.",
      lines: ['shopping = ["milk", "bread"]', 'shopping.append("rice")', 'shopping.remove("bread")', "for item in shopping:", "    print(item)"],
      code: true,
      explain: "The list must exist before it can change. The loop header comes before its indented print.",
    },
    {
      type: "mcq",
      id: "q-empty",
      level: "easy",
      skill: "Empty list",
      prompt: "What is len([])?",
      options: ["1", "0", "None", "IndexError"],
      answer: 1,
      explain: "An empty list has no items, so its length is 0.",
    },
    {
      type: "fill",
      id: "q-fill-in",
      level: "medium",
      skill: "Check with in",
      prompt: "Fill the keyword so the remove only happens when Chess is in the list.",
      code: 'if "Chess" ___ games:\n    games.remove("Chess")',
      answers: ["in"],
      mode: "code",
      placeholder: "in",
      explain: "in gives True when the value is one of the items.",
    },
    {
      type: "mcq",
      id: "q-count",
      level: "hard",
      skill: "Count with if",
      prompt: "What is printed?",
      code: "marks = [70, 85, 90, 45]\npassed = 0\nfor mark in marks:\n    if mark >= 80:\n        passed = passed + 1\nprint(passed)",
      options: ["4", "2", "3", "175"],
      answer: 1,
      explain: "Only 85 and 90 are 80 or more. passed goes up twice.",
    },
    {
      type: "write",
      id: "q-write-colours",
      level: "easy",
      skill: "Loop through a list",
      prompt:
        'Create the list colours = ["red", "green", "blue"]. Print each colour on its own line with a for loop.\n\nOutput must be:\nred\ngreen\nblue',
      starter: "",
      expected: "red\ngreen\nblue",
      check: (_r, code) => {
        if (!/\[/.test(code)) return "Make a list with square brackets.";
        if (!/\bfor\b/.test(code)) return "Use a for loop, not three prints.";
        return null;
      },
      hint: 'colours = ["red", "green", "blue"], then for colour in colours: print(colour).',
      solution: 'colours = ["red", "green", "blue"]\nfor colour in colours:\n    print(colour)',
    },
    {
      type: "write",
      id: "q-write-build",
      level: "medium",
      skill: "Fill a list in a loop",
      prompt:
        "Start with an empty list called fives. Use a for loop with range to append 5, 10 and 15. Print the list after the loop.\n\nOutput must be:\n[5, 10, 15]",
      starter: "fives = []\n",
      expected: "[5, 10, 15]",
      check: (_r, code) => {
        if (!/\.append\s*\(/.test(code)) return "Add the numbers with .append().";
        if (!/\bfor\b/.test(code) || !/range\s*\(/.test(code)) return "Use a for loop with range.";
        return null;
      },
      hint: "for i in range(1, 4): fives.append(i * 5), then print(fives) unindented.",
      solution: "fives = []\nfor i in range(1, 4):\n    fives.append(i * 5)\nprint(fives)",
    },
    {
      type: "write",
      id: "q-write-average",
      level: "medium",
      skill: "Total and average",
      prompt:
        "marks = [60, 70, 80] is in the starter. Add them up with a for loop. Print the total, then the average using len(marks).\n\nOutput must be:\n210\n70.0",
      starter: "marks = [60, 70, 80]\n",
      expected: "210\n70.0",
      check: (_r, code) => {
        if (!/\bfor\b/.test(code)) return "Add the marks with a for loop.";
        if (!/len\s*\(\s*marks\s*\)/.test(code)) return "Divide by len(marks), not a typed 3.";
        return null;
      },
      hint: "total = 0, for mark in marks: total = total + mark, then print(total) and print(total / len(marks)).",
      solution: "marks = [60, 70, 80]\ntotal = 0\nfor mark in marks:\n    total = total + mark\nprint(total)\nprint(total / len(marks))",
    },
    {
      type: "write",
      id: "q-write-games",
      level: "hard",
      skill: "Favourite games",
      prompt:
        'Start with games = ["Minecraft", "Chess", "Roblox"]. Add Football to the end, remove Chess, then print every game with a for loop.\n\nOutput must be:\nMinecraft\nRoblox\nFootball',
      starter: 'games = ["Minecraft", "Chess", "Roblox"]\n',
      expected: "Minecraft\nRoblox\nFootball",
      check: (_r, code) => {
        if (!/\.append\s*\(/.test(code)) return "Add Football with .append().";
        if (!/\.remove\s*\(/.test(code)) return "Take out Chess with .remove().";
        if (!/\bfor\b/.test(code)) return "Print the games with a for loop.";
        return null;
      },
      hint: 'games.append("Football"), games.remove("Chess"), then for game in games: print(game).',
      solution: 'games = ["Minecraft", "Chess", "Roblox"]\ngames.append("Football")\ngames.remove("Chess")\nfor game in games:\n    print(game)',
    },
    {
      type: "write",
      id: "q-challenge",
      level: "hard",
      skill: "Mini challenge",
      challenge: true,
      prompt:
        'Build a shopping list program.\n• Start with shopping = ["milk", "bread", "eggs"]\n• Print Add what? and read one item, then append it\n• Remove bread\n• Print every item with a dash in front, like - milk\n• Finally print Items: and the number of items\n\nThe checker types:\nrice\n\nOutput must be:\nAdd what?\n- milk\n- eggs\n- rice\nItems: 3',
      starter: 'shopping = ["milk", "bread", "eggs"]\n',
      inputs: ["rice"],
      expected: "Add what?\n- milk\n- eggs\n- rice\nItems: 3",
      check: (_r, code) => {
        if (!/\.append\s*\(/.test(code)) return "Add the typed item with .append().";
        if (!/\.remove\s*\(/.test(code)) return "Take out bread with .remove().";
        if (!/\bfor\b/.test(code)) return "Print the items with a for loop.";
        if (!/len\s*\(/.test(code)) return "Count the items with len().";
        return null;
      },
      hint: 'print("-", item) inside the loop. print("Items:", len(shopping)) after it.',
      solution:
        'shopping = ["milk", "bread", "eggs"]\nprint("Add what?")\nitem = input()\nshopping.append(item)\nshopping.remove("bread")\nfor thing in shopping:\n    print("-", thing)\nprint("Items:", len(shopping))',
    },
  ],
};
