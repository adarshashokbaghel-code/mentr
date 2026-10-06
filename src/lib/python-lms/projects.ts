import type { PythonRunResult } from "@/lib/python-runner";

export type PyProjectTest = {
  name: string;
  /** Lines fed to input(), in order. */
  inputs: string[];
  /** Returns what is wrong, or null when the run passes. */
  check: (r: PythonRunResult) => string | null;
};

export type PyProject = {
  id: string;
  number: number;
  title: string;
  tagline: string;
  level: "medium" | "hard";
  minutes: number;
  /** Ideas from the lessons this project uses. */
  concepts: string[];
  brief: string;
  requirements: string[];
  /** A sample run. Lines starting with "> " are what the player types. */
  sample: string;
  starter: string;
  /** Structure the code itself must have, checked before the tests run. */
  codeRules: { test: (code: string) => boolean; message: string }[];
  hints: string[];
  solution: string;
  tests: PyProjectTest[];
};

const outLines = (r: PythonRunResult) => r.stdout.split("\n").map((l) => l.trim().toLowerCase());
const count = (r: PythonRunResult, text: string) => outLines(r).filter((l) => l.includes(text.toLowerCase())).length;
const has = (r: PythonRunResult, text: string) => count(r, text) > 0;

/** Every expected line must appear in the output, in this order. */
function inOrder(r: PythonRunResult, expected: string[]): string | null {
  const lines = outLines(r);
  let from = 0;
  for (const want of expected) {
    const at = lines.findIndex((l, i) => i >= from && l.includes(want.toLowerCase()));
    if (at === -1) return `Expected a line with “${want}”${from > 0 ? " after the lines before it" : ""}.`;
    from = at + 1;
  }
  return null;
}

/** The program must run to the end without asking for more input than the test gives. */
function finished(r: PythonRunResult): string | null {
  if (r.ok) return null;
  if (r.error?.startsWith("EOFError")) return "Your program asked for more input than this test types. Check that it stops when it should.";
  return `Your program stopped with an error: ${r.error ?? "unknown error"}`;
}

const uses = (re: RegExp) => (code: string) => re.test(code);
const defines = (name: string) => uses(new RegExp(`def\\s+${name}\\s*\\(`));

export const PY_PROJECTS: PyProject[] = [
  {
    id: "calculator",
    number: 1,
    title: "Calculator",
    tagline: "A menu-driven calculator that keeps going until you quit.",
    level: "medium",
    minutes: 40,
    concepts: ["input() and float()", "if / elif / else", "while loop", "in with a list", "Functions with return"],
    brief:
      "Build a calculator that asks for an operation, then two numbers, and prints the answer. It keeps asking until the person types q. Division by zero must not crash it.",
    requirements: [
      "Write a function calculate(a, op, b) that returns the answer for +, -, * and /",
      "Repeat with a while loop until the person types q, then print Goodbye!",
      "For an operation that is not + - * / or q, print Unknown operation and ask again, without asking for numbers",
      "Read both numbers with float(input())",
      "Print the answer as Result: followed by the value, e.g. Result: 5.0",
      "If the operation is / and the second number is 0, print Cannot divide by zero instead",
    ],
    sample:
      "Simple Calculator\nChoose + - * / or q to quit\n> *\nFirst number?\n> 4\nSecond number?\n> 2.5\nResult: 10.0\nChoose + - * / or q to quit\n> /\nFirst number?\n> 7\nSecond number?\n> 0\nCannot divide by zero\nChoose + - * / or q to quit\n> q\nGoodbye!",
    starter:
      '# Calculator\n# 1. Write calculate(a, op, b) and return the answer\n# 2. Loop until the person types q\n\nprint("Simple Calculator")\n',
    codeRules: [
      { test: defines("calculate"), message: "Write a function called calculate(a, op, b)." },
      { test: uses(/\breturn\b/), message: "calculate should return the answer, not print it." },
      { test: uses(/\bwhile\b/), message: "Use a while loop so the calculator keeps going until q." },
      { test: uses(/float\s*\(/), message: "Read the numbers with float(input()) so decimals work." },
    ],
    hints: [
      "Plan first: a loop that asks for an operation. Inside it, three cases: q, a real operation, or anything else.",
      "Keep the loop going with a True/False variable: running = True, then while running:. Set running = False when the person types q.",
      'Check the operation with if op == "q": … elif op in ["+", "-", "*", "/"]: … else: print("Unknown operation"). The numbers are only read in the middle branch.',
      "calculate needs one if per symbol, each with its own return. The last one can be return a / b.",
      'Before you call calculate, test the danger case: if op == "/" and b == 0: print("Cannot divide by zero"), else print("Result:", calculate(a, op, b)).',
    ],
    solution: `def calculate(a, op, b):
    if op == "+":
        return a + b
    if op == "-":
        return a - b
    if op == "*":
        return a * b
    return a / b

print("Simple Calculator")
running = True
while running:
    print("Choose + - * / or q to quit")
    op = input().strip()
    if op == "q":
        print("Goodbye!")
        running = False
    elif op in ["+", "-", "*", "/"]:
        print("First number?")
        a = float(input())
        print("Second number?")
        b = float(input())
        if op == "/" and b == 0:
            print("Cannot divide by zero")
        else:
            print("Result:", calculate(a, op, b))
    else:
        print("Unknown operation")`,
    tests: [
      {
        name: "2 + 3, then quit",
        inputs: ["+", "2", "3", "q"],
        check: (r) => finished(r) ?? inOrder(r, ["Result: 5.0", "Goodbye!"]),
      },
      {
        name: "7 / 0 does not crash, then 4 * 2.5",
        inputs: ["/", "7", "0", "*", "4", "2.5", "q"],
        check: (r) => finished(r) ?? inOrder(r, ["Cannot divide by zero", "Result: 10.0", "Goodbye!"]),
      },
      {
        name: "Unknown operation, then 10 - 4",
        inputs: ["%", "-", "10", "4", "q"],
        check: (r) => finished(r) ?? inOrder(r, ["Unknown operation", "Result: 6.0", "Goodbye!"]),
      },
    ],
  },
  {
    id: "guess-number",
    number: 2,
    title: "Guess the Number",
    tagline: "Two players: one hides a number, the other has five guesses.",
    level: "medium",
    minutes: 35,
    concepts: ["int(input())", "Comparisons", "while with two conditions", "Counters", "Functions with return"],
    brief:
      "Player 1 types a secret number. Player 2 gets five guesses. After each guess the program says Too low or Too high, until the guess is right or the guesses run out.",
    requirements: [
      "Read the secret number first, with int(input())",
      "Write check_guess(guess, secret) that returns Too low, Too high or Correct",
      "Allow at most 5 guesses, and stop asking as soon as the guess is right",
      "For a wrong guess, print Too low or Too high",
      "For the right guess, print Correct! Guesses used: and the number of guesses",
      "After 5 wrong guesses, print Out of guesses! The number was and the secret",
    ],
    sample:
      "Player 1, type the secret number:\n> 7\nPlayer 2, you have 5 guesses.\nGuess?\n> 3\nToo low\nGuess?\n> 9\nToo high\nGuess?\n> 7\nCorrect! Guesses used: 3",
    starter:
      '# Guess the Number\n# 1. Write check_guess(guess, secret)\n# 2. Read the secret, then loop for at most 5 guesses\n\nprint("Player 1, type the secret number:")\n',
    codeRules: [
      { test: defines("check_guess"), message: "Write a function called check_guess(guess, secret)." },
      { test: uses(/\breturn\b/), message: "check_guess should return its answer." },
      { test: uses(/\bwhile\b|\bfor\b/), message: "Use a loop for the guesses." },
      { test: uses(/int\s*\(/), message: "Turn the typed numbers into whole numbers with int()." },
    ],
    hints: [
      "You need three variables before the loop: the secret, a counter for guesses used (starts at 0), and found = False.",
      "Loop while both are still true: while tries < 5 and not found:.",
      "Inside the loop: read a guess, add 1 to tries, then call check_guess and keep what it returns.",
      'check_guess compares in order: if guess < secret: return "Too low". Then if guess > secret: return "Too high". Otherwise return "Correct".',
      'After the loop ends, if not found: print("Out of guesses! The number was", secret).',
    ],
    solution: `def check_guess(guess, secret):
    if guess < secret:
        return "Too low"
    if guess > secret:
        return "Too high"
    return "Correct"

print("Player 1, type the secret number:")
secret = int(input())
print("Player 2, you have 5 guesses.")
tries = 0
found = False
while tries < 5 and not found:
    print("Guess?")
    guess = int(input())
    tries = tries + 1
    result = check_guess(guess, secret)
    if result == "Correct":
        print("Correct! Guesses used:", tries)
        found = True
    else:
        print(result)
if not found:
    print("Out of guesses! The number was", secret)`,
    tests: [
      {
        name: "Secret 7: guesses 3, 9, 7",
        inputs: ["7", "3", "9", "7"],
        check: (r) => finished(r) ?? inOrder(r, ["Too low", "Too high", "Correct! Guesses used: 3"]),
      },
      {
        name: "Secret 4: right first time",
        inputs: ["4", "4"],
        check: (r) =>
          finished(r) ??
          inOrder(r, ["Correct! Guesses used: 1"]) ??
          (has(r, "Out of guesses") ? "The guess was right, so Out of guesses should not appear." : null),
      },
      {
        name: "Secret 50: five low guesses",
        inputs: ["50", "10", "20", "30", "40", "45"],
        check: (r) =>
          finished(r) ??
          (count(r, "Too low") !== 5 ? `Expected Too low five times, got ${count(r, "Too low")}.` : null) ??
          inOrder(r, ["Out of guesses! The number was 50"]),
      },
    ],
  },
  {
    id: "quiz-game",
    number: 3,
    title: "Mini Quiz Game",
    tagline: "Questions from a list, forgiving answers, a score and a verdict.",
    level: "medium",
    minutes: 40,
    concepts: ["Lists", "for with range(len())", ".strip() and .lower()", "Counters", "if / elif / else", "Functions"],
    brief:
      "Ask the questions stored in a list, accept answers even with extra spaces or capitals, keep score, and finish with a message that depends on how well the player did.",
    requirements: [
      "Keep the questions and answers lists from the starter",
      "Welcome the player first",
      "Write check_answer(reply, answer) that returns True when reply matches after .strip().lower()",
      "Ask every question with a loop, and print Correct! or Wrong, the answer was and the right answer",
      "Print the score as Score: 2/3 (score, slash, number of questions)",
      "Then print Perfect score! if all are right, Well done! if at least half are right, otherwise Keep practising!",
    ],
    sample:
      'Welcome to the Python Quiz!\nWhat keyword defines a function?\n> def\nCorrect!\nWhat does len("cat") give?\n> 3\nCorrect!\nWhich symbol checks if two values are equal?\n> =\nWrong, the answer was ==\nScore: 2/3\nWell done!',
    starter:
      'questions = ["What keyword defines a function?", "What does len(\\"cat\\") give?", "Which symbol checks if two values are equal?"]\nanswers = ["def", "3", "=="]\n\n# 1. Write check_answer(reply, answer)\n# 2. Welcome the player, loop through the questions, keep score\n',
    codeRules: [
      { test: defines("check_answer"), message: "Write a function called check_answer(reply, answer)." },
      { test: uses(/\bfor\b|\bwhile\b/), message: "Ask the questions with a loop, not one by one." },
      { test: uses(/\.strip\s*\(/) , message: "Use .strip() so extra spaces don't make a right answer wrong." },
      { test: uses(/\.lower\s*\(/), message: "Use .lower() so DEF and def both count." },
    ],
    hints: [
      "Start with score = 0 before the loop. Loop over positions: for i in range(len(questions)):.",
      "Inside the loop, print questions[i], read the reply, then compare it with answers[i].",
      "check_answer can be one line: return reply.strip().lower() == answer.",
      'Build the score line with str(): print("Score: " + str(score) + "/" + str(len(questions))).',
      "For the verdict, test the best case first: if score == len(questions), then elif score >= len(questions) / 2, then else.",
    ],
    solution: `questions = ["What keyword defines a function?", "What does len(\\"cat\\") give?", "Which symbol checks if two values are equal?"]
answers = ["def", "3", "=="]

def check_answer(reply, answer):
    return reply.strip().lower() == answer

print("Welcome to the Python Quiz!")
score = 0
for i in range(len(questions)):
    print(questions[i])
    reply = input()
    if check_answer(reply, answers[i]):
        print("Correct!")
        score = score + 1
    else:
        print("Wrong, the answer was", answers[i])
print("Score: " + str(score) + "/" + str(len(questions)))
if score == len(questions):
    print("Perfect score!")
elif score >= len(questions) / 2:
    print("Well done!")
else:
    print("Keep practising!")`,
    tests: [
      {
        name: "All three right",
        inputs: ["def", "3", "=="],
        check: (r) =>
          finished(r) ??
          (count(r, "Correct!") !== 3 ? `Expected Correct! three times, got ${count(r, "Correct!")}.` : null) ??
          inOrder(r, ["Score: 3/3", "Perfect score!"]),
      },
      {
        name: "Two right, one wrong",
        inputs: ["def", "3", "="],
        check: (r) => finished(r) ?? inOrder(r, ["Wrong, the answer was ==", "Score: 2/3", "Well done!"]),
      },
      {
        name: "Messy spaces and capitals still count",
        inputs: ["  DEF ", "4", "="],
        check: (r) =>
          finished(r) ??
          (count(r, "Correct!") !== 1 ? "  DEF  should count as right after .strip().lower()." : null) ??
          inOrder(r, ["Score: 1/3", "Keep practising!"]),
      },
    ],
  },
  {
    id: "report-card",
    number: 4,
    title: "Report Card",
    tagline: "Read a class of students, grade each one, find the average and the top student.",
    level: "hard",
    minutes: 45,
    concepts: ["Lists and append()", "for and range()", "Functions with return", "if / elif", "Running totals", "Joining text with str()"],
    brief:
      "Ask how many students there are, read each name and mark into lists, then print a report: every student with their grade, the class average, and the top student.",
    requirements: [
      "Read how many students, then each student's name and mark (a whole number)",
      "Store names and marks in two lists with append()",
      "Write grade(mark) returning A for 90+, B for 75+, C for 50+, otherwise F",
      "Write average(marks) that adds the marks with a loop and returns total divided by len(marks)",
      "Print one line per student like Mia: 92 (A)",
      "Print Class average: and the average, then Top student: and the name with the highest mark",
    ],
    sample:
      "How many students?\n> 2\nName of student 1\n> Zoe\nMark for Zoe\n> 75\nName of student 2\n> Raj\nMark for Raj\n> 90\n--- Report Card ---\nZoe: 75 (B)\nRaj: 90 (A)\nClass average: 82.5\nTop student: Raj",
    starter:
      '# Report Card\n# 1. Write grade(mark) and average(marks)\n# 2. Read the students into two lists\n# 3. Print the report\n\nnames = []\nmarks = []\nprint("How many students?")\n',
    codeRules: [
      { test: defines("grade"), message: "Write a function called grade(mark)." },
      { test: defines("average"), message: "Write a function called average(marks)." },
      { test: uses(/\.append\s*\(/), message: "Store each name and mark with .append()." },
      { test: uses(/\bfor\b/), message: "Use for loops to read the students and print the report." },
    ],
    hints: [
      "Reading: count = int(input()), then for i in range(count): read a name and a mark and append each to its list.",
      'grade uses returns from the top down: if mark >= 90: return "A", then 75, then 50, then return "F" at the end.',
      "average is the running total from Lesson 6 inside a function: total = 0, loop, then return total / len(marks) after the loop.",
      'One report line: print(names[i] + ": " + str(marks[i]) + " (" + grade(marks[i]) + ")"). The mark needs str() because it is a number.',
      "For the top student keep best = 0 (an index). In the report loop, if marks[i] > marks[best]: best = i. Print names[best] at the end.",
    ],
    solution: `def grade(mark):
    if mark >= 90:
        return "A"
    if mark >= 75:
        return "B"
    if mark >= 50:
        return "C"
    return "F"

def average(marks):
    total = 0
    for mark in marks:
        total = total + mark
    return total / len(marks)

names = []
marks = []
print("How many students?")
count = int(input())
for i in range(count):
    print("Name of student", i + 1)
    names.append(input().strip())
    print("Mark for", names[i])
    marks.append(int(input()))

print("--- Report Card ---")
best = 0
for i in range(len(names)):
    print(names[i] + ": " + str(marks[i]) + " (" + grade(marks[i]) + ")")
    if marks[i] > marks[best]:
        best = i
print("Class average:", average(marks))
print("Top student:", names[best])`,
    tests: [
      {
        name: "Three students",
        inputs: ["3", "Mia", "92", "Sam", "67", "Ali", "48"],
        check: (r) =>
          finished(r) ?? inOrder(r, ["Mia: 92 (A)", "Sam: 67 (C)", "Ali: 48 (F)", "Class average: 69.0", "Top student: Mia"]),
      },
      {
        name: "Top student is not the first",
        inputs: ["2", "Zoe", "75", "Raj", "90"],
        check: (r) => finished(r) ?? inOrder(r, ["Zoe: 75 (B)", "Raj: 90 (A)", "Class average: 82.5", "Top student: Raj"]),
      },
      {
        name: "Every grade boundary",
        inputs: ["4", "Ann", "90", "Ben", "75", "Cal", "50", "Dev", "49"],
        check: (r) =>
          finished(r) ?? inOrder(r, ["Ann: 90 (A)", "Ben: 75 (B)", "Cal: 50 (C)", "Dev: 49 (F)", "Class average: 66.0"]),
      },
    ],
  },
  {
    id: "tic-tac-toe",
    number: 5,
    title: "Tic Tac Toe",
    tagline: "Two players, a 3 x 3 board in a list, and a winner check.",
    level: "hard",
    minutes: 60,
    concepts: ["A list as a board", "Indexing and changing items", "while loop", "and / or logic", "Functions with return", "Taking turns"],
    brief:
      "Two players take turns placing X and O on a 3 x 3 board stored in a list of 9 squares. The game rejects bad moves, announces a winner as soon as there is one, or calls a draw when the board is full.",
    requirements: [
      "Store the board as a list of 9 items, one per square. Squares are numbered 1 to 9 for the players",
      "X goes first, then the players take turns",
      "Read each move with int(input()). If it is not 1 to 9, or the square is taken, print Try again and let the same player choose again",
      "Write check_winner(board, player) that returns True if that player has three in a row (3 rows, 3 columns, 2 diagonals)",
      "When a player wins, print X wins! or O wins! and stop the game",
      "If all 9 squares fill with no winner, print It's a draw! and stop",
    ],
    sample:
      "Tic Tac Toe\n1 | 2 | 3\n4 | 5 | 6\n7 | 8 | 9\nPlayer X, choose a square 1-9:\n> 5\n1 | 2 | 3\n4 | X | 6\n7 | 8 | 9\nPlayer O, choose a square 1-9:\n> 1\nO | 2 | 3\n4 | X | 6\n7 | 8 | 9\nPlayer X, choose a square 1-9:\n> 2\nO | X | 3\n4 | X | 6\n7 | 8 | 9\nPlayer O, choose a square 1-9:\n> 3\nO | X | O\n4 | X | 6\n7 | 8 | 9\nPlayer X, choose a square 1-9:\n> 8\nO | X | O\n4 | X | 6\n7 | X | 9\nX wins!",
    starter: `# Tic Tac Toe
# The board is a list of 9 squares. " " means empty.
board = [" ", " ", " ", " ", " ", " ", " ", " ", " "]

def cell(board, i):
    if board[i] == " ":
        return str(i + 1)
    return board[i]

def show_board(board):
    print(cell(board, 0) + " | " + cell(board, 1) + " | " + cell(board, 2))
    print(cell(board, 3) + " | " + cell(board, 4) + " | " + cell(board, 5))
    print(cell(board, 6) + " | " + cell(board, 7) + " | " + cell(board, 8))

# 1. Write check_winner(board, player)
# 2. Loop: show the board, read a move, check it, place it, check for a win or a draw, switch player

print("Tic Tac Toe")
`,
    codeRules: [
      { test: defines("check_winner"), message: "Write a function called check_winner(board, player)." },
      { test: uses(/\bwhile\b/), message: "Use a while loop for the turns." },
      { test: uses(/board\s*\[[^\]]+\]\s*=[^=]/), message: "Place a move by changing an item in the board list." },
      { test: uses(/int\s*\(/), message: "Read the square number with int(input())." },
    ],
    hints: [
      "Before the loop: player = \"X\", moves = 0, game_over = False. Loop while not game_over:.",
      "The player types 1 to 9, but list indexes are 0 to 8. Square choice lives at board[choice - 1].",
      'A move is bad if choice < 1 or choice > 9 or board[choice - 1] != " ". Print Try again and do not switch player.',
      "A small helper makes check_winner short: three(board, a, b, c, player) returns board[a] == player and board[b] == player and board[c] == player. Then check_winner returns three(...) or three(...) for all 8 lines: 0,1,2  3,4,5  6,7,8  0,3,6  1,4,7  2,5,8  0,4,8  2,4,6.",
      'After placing a move: if check_winner(board, player) print the win and set game_over = True. elif moves == 9 it is a draw. Otherwise switch: if player == "X": player = "O" else: player = "X".',
    ],
    solution: `board = [" ", " ", " ", " ", " ", " ", " ", " ", " "]

def cell(board, i):
    if board[i] == " ":
        return str(i + 1)
    return board[i]

def show_board(board):
    print(cell(board, 0) + " | " + cell(board, 1) + " | " + cell(board, 2))
    print(cell(board, 3) + " | " + cell(board, 4) + " | " + cell(board, 5))
    print(cell(board, 6) + " | " + cell(board, 7) + " | " + cell(board, 8))

def three(board, a, b, c, player):
    return board[a] == player and board[b] == player and board[c] == player

def check_winner(board, player):
    return (three(board, 0, 1, 2, player) or three(board, 3, 4, 5, player) or three(board, 6, 7, 8, player)
            or three(board, 0, 3, 6, player) or three(board, 1, 4, 7, player) or three(board, 2, 5, 8, player)
            or three(board, 0, 4, 8, player) or three(board, 2, 4, 6, player))

print("Tic Tac Toe")
player = "X"
moves = 0
game_over = False
while not game_over:
    show_board(board)
    print("Player " + player + ", choose a square 1-9:")
    choice = int(input())
    if choice < 1 or choice > 9 or board[choice - 1] != " ":
        print("Try again")
    else:
        board[choice - 1] = player
        moves = moves + 1
        if check_winner(board, player):
            show_board(board)
            print(player + " wins!")
            game_over = True
        elif moves == 9:
            show_board(board)
            print("It's a draw!")
            game_over = True
        elif player == "X":
            player = "O"
        else:
            player = "X"`,
    tests: [
      {
        name: "X wins across the top row",
        inputs: ["1", "4", "2", "5", "3"],
        check: (r) => finished(r) ?? inOrder(r, ["X wins"]),
      },
      {
        name: "O wins on a diagonal",
        inputs: ["1", "3", "2", "5", "9", "7"],
        check: (r) => finished(r) ?? inOrder(r, ["O wins"]) ?? (has(r, "X wins") ? "X did not win this game." : null),
      },
      {
        name: "A full board is a draw",
        inputs: ["1", "2", "3", "5", "4", "6", "8", "7", "9"],
        check: (r) =>
          finished(r) ?? inOrder(r, ["draw"]) ?? (has(r, " wins") ? "Nobody has three in a row in this game." : null),
      },
      {
        name: "Taken and out-of-range squares are rejected",
        inputs: ["5", "5", "0", "1", "2", "3", "8"],
        check: (r) =>
          finished(r) ??
          (count(r, "Try again") !== 2 ? `Expected Try again twice (square 5 taken, then 0), got ${count(r, "Try again")}.` : null) ??
          inOrder(r, ["X wins"]),
      },
    ],
  },
];

export function getPyProject(id: string): PyProject | null {
  return PY_PROJECTS.find((p) => p.id === id) ?? null;
}
