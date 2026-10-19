/** Placement into Python Intermediate — ~15 min, pass at 70%. */

export const PLACEMENT_PASS_RATIO = 0.7;

export type PlacementQuestion =
  | {
      id: string;
      type: "mcq";
      prompt: string;
      code?: string;
      options: string[];
      answer: number;
      explain: string;
    }
  | {
      id: string;
      type: "predict";
      prompt: string;
      code: string;
      options: string[];
      answer: number;
      explain: string;
    };

export const PLACEMENT_QUESTIONS: PlacementQuestion[] = [
  {
    id: "p1",
    type: "mcq",
    prompt: "What does this print?",
    code: 'print("Hi", "there", sep="-")',
    options: ['Hi-there', 'Hi there', 'Hi,there', 'Error'],
    answer: 0,
    explain: "sep='-' joins the parts with a hyphen.",
  },
  {
    id: "p2",
    type: "predict",
    prompt: "What is printed?",
    code: `x = 3\nx = x + 2\nprint(x)`,
    options: ["3", "5", "32", "Error"],
    answer: 1,
    explain: "x becomes 5 after the assignment.",
  },
  {
    id: "p3",
    type: "mcq",
    prompt: "Which condition is True when score is exactly 50?",
    options: ["score > 50", "score >= 50", "score <= 49", "score != 50"],
    answer: 1,
    explain: ">= includes 50.",
  },
  {
    id: "p4",
    type: "predict",
    prompt: "How many times does Hello print?",
    code: `for i in range(3):\n    print("Hello")`,
    options: ["1", "2", "3", "0"],
    answer: 2,
    explain: "range(3) runs 0,1,2 — three iterations.",
  },
  {
    id: "p5",
    type: "mcq",
    prompt: "What is games[-1] when games = ['a','b','c']?",
    options: ["'a'", "'b'", "'c'", "Error"],
    answer: 2,
    explain: "-1 is the last item.",
  },
  {
    id: "p6",
    type: "predict",
    prompt: "What gets printed?",
    code: `def double(n):\n    return n * 2\nprint(double(4))`,
    options: ["4", "8", "double(4)", "Error"],
    answer: 1,
    explain: "double(4) returns 8.",
  },
  {
    id: "p7",
    type: "mcq",
    prompt: "Why does this crash?",
    code: 'age = input("Age: ")\nprint(age + 1)',
    options: [
      "input is too slow",
      "can't add str and int",
      "print needs two arguments",
      "Age is undefined",
    ],
    answer: 1,
    explain: "input() returns a string — convert with int() first.",
  },
  {
    id: "p8",
    type: "mcq",
    prompt: "Which loop runs while n is positive?",
    options: [
      "for n in 5:",
      "while n > 0:",
      "if n > 0:",
      "loop n > 0",
    ],
    answer: 1,
    explain: "while repeats until the condition is false.",
  },
  {
    id: "p9",
    type: "predict",
    prompt: "Output?",
    code: `s = "code"\nprint(s.upper())`,
    options: ["code", "CODE", "Code", "Error"],
    answer: 1,
    explain: "upper() returns uppercase.",
  },
  {
    id: "p10",
    type: "mcq",
    prompt: "Best way to add an item to a list nums?",
    options: ["nums.add(x)", "nums.append(x)", "nums.push(x)", "append(nums, x)"],
    answer: 1,
    explain: "Lists use .append().",
  },
  {
    id: "p11",
    type: "predict",
    prompt: "What prints?",
    code: `total = 0\nfor n in [1, 2, 3]:\n    total += n\nprint(total)`,
    options: ["0", "6", "123", "Error"],
    answer: 1,
    explain: "1+2+3 = 6.",
  },
  {
    id: "p12",
    type: "mcq",
    prompt: "A function should mainly…",
    options: [
      "print everything it computes",
      "do one job and return a result when useful",
      "use global variables for speed",
      "avoid parameters",
    ],
    answer: 1,
    explain: "Small, focused functions are easier to test and reuse.",
  },
];

export function scorePlacement(answers: Record<string, number>): {
  score: number;
  total: number;
  passed: boolean;
  byId: Record<string, boolean>;
} {
  const total = PLACEMENT_QUESTIONS.length;
  let score = 0;
  const byId: Record<string, boolean> = {};
  for (const q of PLACEMENT_QUESTIONS) {
    const ok = answers[q.id] === q.answer;
    byId[q.id] = ok;
    if (ok) score += 1;
  }
  return { score, total, passed: score / total >= PLACEMENT_PASS_RATIO, byId };
}
