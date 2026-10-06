export type CompilerTemplate = { id: string; label: string; code: string; stdin?: string };

export const COMPILER_TEMPLATES: CompilerTemplate[] = [
  {
    id: "hello",
    label: "Hello, world",
    code: '# Write Python here and press Run (Ctrl/⌘ + Enter)\nprint("Hello, world!")\nprint("2 + 3 =", 2 + 3)\n',
  },
  {
    id: "input",
    label: "Reading input()",
    code: 'name = input("What is your name? ")\nage = int(input("How old are you? "))\nprint(f"Hi {name}! Next year you will be {age + 1}.")\n',
    stdin: "Aarav\n12\n",
  },
  {
    id: "loop",
    label: "Times table loop",
    code: 'n = 7\nfor i in range(1, 11):\n    print(f"{n} x {i:>2} = {n * i}")\n',
  },
  {
    id: "if",
    label: "Grade with if / elif",
    code: 'marks = 82\n\nif marks >= 90:\n    grade = "A+"\nelif marks >= 75:\n    grade = "A"\nelif marks >= 60:\n    grade = "B"\nelse:\n    grade = "C"\n\nprint("Marks:", marks, "Grade:", grade)\n',
  },
  {
    id: "list",
    label: "Lists and functions",
    code: 'def average(numbers):\n    return sum(numbers) / len(numbers)\n\nscores = [78, 92, 85, 64, 99]\nprint("Scores:", scores)\nprint("Highest:", max(scores))\nprint("Average:", round(average(scores), 1))\n',
  },
  {
    id: "random",
    label: "Dice game (random)",
    code: 'import random\n\nrolls = [random.randint(1, 6) for _ in range(5)]\nprint("You rolled:", rolls)\nprint("Total:", sum(rolls))\nif 6 in rolls:\n    print("Lucky six!")\n',
  },
  {
    id: "pattern",
    label: "Star pattern",
    code: 'rows = 5\nfor i in range(1, rows + 1):\n    print(" " * (rows - i) + "*" * (2 * i - 1))\n',
  },
];

export const DEFAULT_TEMPLATE = COMPILER_TEMPLATES[0];
