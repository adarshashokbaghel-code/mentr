import { absoluteUrl, SITE_BRAND } from "@/lib/seo";

export const LEARN_PYTHON_PATH = "/learnpython";
export const LEARN_PYTHON_LMS_PATH = "/learnpython/lms";
export const LEARN_PYTHON_COMPILER_PATH = "/learnpython/lms/compiler";
export const LEARN_PYTHON_TUTOR_HREF = "/search?q=Python";

export type PythonTier = "beginner" | "intermediate" | "advanced";

export type PythonTrack = {
  tier: PythonTier;
  name: string;
  status: "live" | "soon";
  lessons: number | null;
  summary: string;
  covers: string[];
  outcome: string;
};

export const PYTHON_TRACKS: PythonTrack[] = [
  {
    tier: "beginner",
    name: "Python Beginner",
    status: "live",
    lessons: 10,
    summary:
      "From your first print() to a working quiz game. No coding background needed.",
    covers: [
      "print, variables and data types",
      "input and calculations",
      "if / elif / else and logic",
      "for and while loops",
      "strings, lists and functions",
    ],
    outcome: "Build a complete mini quiz game on your own",
  },
  {
    tier: "intermediate",
    name: "Python Intermediate",
    status: "soon",
    lessons: null,
    summary:
      "Write longer programs that hold real data, recover from errors and stay organised.",
    covers: [
      "dictionaries, tuples and sets",
      "reading and writing files",
      "handling errors with try / except",
      "modules and the standard library",
      "classes and objects, first steps",
    ],
    outcome: "Build small tools that save and load data",
  },
  {
    tier: "advanced",
    name: "Python Advanced",
    status: "soon",
    lessons: null,
    summary:
      "Think in algorithms, work with outside data and structure code like a developer.",
    covers: [
      "searching, sorting and complexity",
      "recursion",
      "working with APIs and JSON",
      "data with lists, dicts and libraries",
      "testing and structuring projects",
    ],
    outcome: "Ship a multi-file project you can show",
  },
];

export const PYTHON_OUTCOMES = [
  "Understand what programming is",
  "Write basic Python programs",
  "Store and change data with variables",
  "Take input from the user",
  "Make decisions with conditions",
  "Repeat work with loops",
  "Work with strings and lists",
  "Write your own functions",
  "Read an error message and fix it",
  "Combine all of it into a small project",
];

export const WHY_PYTHON: { title: string; text: string; code?: string }[] = [
  {
    title: "It’s easy to read",
    code: 'if score >= 50: print("Passed")',
    text: "reads almost like English. You spend your time thinking about the problem, not fighting with symbols.",
  },
  {
    title: "It’s taught in school",
    text: "CBSE Computer Science and Informatics Practices in Class 11 and 12 use Python. Learning it now gives you a head start.",
  },
  {
    title: "It’s used for real work",
    text: "Websites, apps, games, data analysis and AI tools are all built with Python. It’s not a toy language.",
  },
  {
    title: "It makes other languages easier",
    text: "Loops, lists and functions work the same way in Java, C++ and JavaScript. Learn them once in Python and the next language is much easier.",
  },
];

export const PYTHON_LESSON_LOOP = [
  { step: "Learn", text: "A new idea, explained with an everyday example." },
  { step: "Understand", text: "Read a short piece of code and guess what it will do." },
  { step: "Guided example", text: "Build a small program step by step, with help." },
  { step: "Practice", text: "Quick questions with instant feedback: predict, fix and write code." },
  { step: "Mini challenge", text: "Write a small program on your own to finish the lesson." },
];

export type PythonLesson = {
  number: number;
  title: string;
  subtitle: string;
  /** The everyday idea the lesson opens with. */
  hook: string;
  concepts: string[];
  /** Read-and-predict check from the Understand step. */
  predict?: { code: string; question: string; answer: string };
  build: string;
  code: string;
  practice: string[];
  /** The mistake most first-timers make here. */
  watchOut: string;
  challenge: string;
  canDo: string;
  requirements?: string[];
};

export const PYTHON_BEGINNER_LESSONS: PythonLesson[] = [
  {
    number: 1,
    title: "Welcome to Python",
    subtitle: "Giving instructions to a computer",
    hook: "A robot does nothing until it gets exact instructions, in the right order. Python is a way to write those instructions.",
    concepts: [
      "What programming is",
      "What Python is and where it’s used",
      "How a computer follows instructions",
      "print() and text (strings)",
      "Comments with #",
      "Order of execution",
    ],
    predict: {
      code: `print("A")
print("B")
print("C")`,
      question: "Which letter appears first?",
      answer: "A. Python runs a program from the top line down, one line at a time.",
    },
    build: "My Introduction",
    code: `# This is my first program
print("My name is Aarav")
print("I am 12 years old")
print("I love games")`,
    practice: [
      "Predict the output",
      "Choose the correct print()",
      "Find the missing line",
      "Rearrange instructions",
      "Multiple choice",
      "Write your own introduction",
    ],
    watchOut: "Text needs quotes. print(Hello) is an error; print(\"Hello\") works.",
    challenge: "Introduce yourself in at least four lines.",
    canDo: "Write and run a multi-line program and explain the order it runs in.",
  },
  {
    number: 2,
    title: "Variables",
    subtitle: "Giving information a name",
    hook: "A variable is a labelled box. In score = 100, score is the label on the box and 100 is what’s inside.",
    concepts: [
      "Creating a variable",
      "Naming rules",
      "Changing a value",
      "str, int, float, bool",
      "Checking with type()",
    ],
    predict: {
      code: `score = 10
score = 20
print(score)`,
      question: "What gets printed?",
      answer: "20. A variable holds only its latest value; the 10 is replaced.",
    },
    build: "Player Profile",
    code: `name = "Aarav"
age = 12
height = 5.4
is_student = True

print(name, age, height, is_student)`,
    practice: [
      "Spot the variable and the value",
      "Name the data type",
      "Predict output",
      "Fix invalid variable names",
      "Change variable values",
      "Multiple choice",
    ],
    watchOut: "Names can’t start with a number or contain spaces. player_score works; 2score and player score don’t.",
    challenge: "A game player profile with name, age, score and favourite game.",
    canDo: "Store text, whole numbers, decimals and True/False, and tell the four types apart.",
  },
  {
    number: 3,
    title: "Input & Calculations",
    subtitle: "Making programs interactive",
    hook: "Until now the program knew everything in advance. With input(), the person at the keyboard gets to answer.",
    concepts: [
      "input() and prompts",
      "Why input arrives as text",
      "Converting with int() and float()",
      "+  -  *  /",
      "% for remainders",
    ],
    predict: {
      code: `age = input("Age: ")
print(age + 1)`,
      question: "Why does this crash?",
      answer: "input() always returns text, and text can’t be added to a number. int(input(\"Age: \")) fixes it.",
    },
    build: "Simple Calculator",
    code: `num1 = int(input("First number: "))
num2 = int(input("Second number: "))

print(num1 + num2)
print(num1 - num2)
print(num1 * num2)`,
    practice: [
      "Predict calculations",
      "Choose the correct operator",
      "Convert input correctly",
      "Fix broken programs",
      "Complete calculator code",
      "Multiple choice",
    ],
    watchOut: "% gives the remainder, not a percentage. number % 2 == 0 means the number is even.",
    challenge: "A bill calculator: enter price and quantity, print the total.",
    canDo: "Ask for values, convert them, and calculate with all five operators.",
  },
  {
    number: 4,
    title: "Making Decisions with if",
    subtitle: "Programs that choose",
    hook: "If it’s raining, take an umbrella. Otherwise, don’t. Programs make decisions the same way, one condition at a time.",
    concepts: [
      "Why programs need decisions",
      "if and else",
      "elif for more than two paths",
      "==  !=  >  <  >=  <=",
      "Indentation marks the block",
    ],
    predict: {
      code: `score = 72

if score >= 90:
    print("Excellent")
elif score >= 70:
    print("Good")
else:
    print("Try again")`,
      question: "Which word is printed?",
      answer: "Good. Python checks from the top and stops at the first condition that is true.",
    },
    build: "Game Entry Checker",
    code: `age = int(input("Enter your age: "))

if age >= 10:
    print("You can play!")
else:
    print("You cannot play yet.")`,
    practice: [
      "Which branch runs?",
      "Complete the condition",
      "Find the wrong operator",
      "Predict output",
      "Multiple choice",
      "Turn a real rule into an if",
    ],
    watchOut: "= stores a value; == compares two values. Mixing them up is the most common bug in this lesson.",
    challenge: "A grade checker: marks in, grade out.",
    canDo: "Write if / elif / else using all six comparison operators.",
  },
  {
    number: 5,
    title: "Thinking with Logic",
    subtitle: "Combining conditions",
    hook: "You can enter the competition if you’re at least 10 and you scored at least 50. Both have to be true. This lesson is less new syntax, more thinking.",
    concepts: [
      "and, or, not",
      "True and False as values",
      "Combining comparisons",
      "Nested if, used sparingly",
    ],
    predict: {
      code: `A = True
B = False

print(A and B)
print(A or B)
print(not A)`,
      question: "What are the three results?",
      answer: "False, True, False. and needs both; or needs one; not flips the value.",
    },
    build: "Competition Eligibility",
    code: `age = int(input("Age: "))
score = int(input("Score: "))

if age >= 10 and score >= 50:
    print("Eligible")
else:
    print("Not eligible")`,
    practice: [
      "True or false challenges",
      "Choose and vs or",
      "Predict output",
      "Complete conditions",
      "Convert rules into code",
      "Debug logic errors",
    ],
    watchOut: "Nesting works, but two levels is usually the limit. A single and often reads more clearly.",
    challenge: "A game unlock: enough points and the right level opens the next stage.",
    canDo: "Combine conditions with and, or and not, and decide when nesting helps.",
  },
  {
    number: 6,
    title: "Loops",
    subtitle: "Making computers repeat work",
    hook: "Typing print(\"Hello\") five times is fine. Then someone asks for five hundred.",
    concepts: [
      "Why loops exist",
      "for and range()",
      "range(5) vs range(1, 6)",
      "The loop variable",
      "while loops",
      "Avoiding infinite loops",
    ],
    predict: {
      code: `for i in range(1, 4):
    print(i)`,
      question: "What gets printed?",
      answer: "1, 2, 3. range stops just before the end number.",
    },
    build: "Multiplication Table",
    code: `number = int(input("Enter a number: "))

for i in range(1, 11):
    print(number, "x", i, "=", number * i)`,
    practice: [
      "Predict loop output",
      "Count backwards",
      "Fill in missing loop code",
      "Make number patterns",
      "Find the infinite loop",
      "Multiple choice",
    ],
    watchOut: "A while loop needs something inside it to change, or it never stops.",
    challenge: "A countdown: 5, 4, 3, 2, 1, GO!",
    canDo: "Repeat work with for and range(), and write a while loop that ends.",
  },
  {
    number: 7,
    title: "Strings",
    subtitle: "Working with text",
    hook: "To Python, the word \"Python\" is six characters standing in a row, numbered from 0.",
    concepts: [
      "Indexing from 0",
      "len()",
      ".upper() and .lower()",
      ".strip()",
      ".replace()",
      "Joining text",
    ],
    predict: {
      code: `name = "Python"
print(name[0])
print(len(name))`,
      question: "What two values are printed?",
      answer: "P and 6. Counting starts at 0, but len() counts every character.",
    },
    build: "Username Generator",
    code: `first = input("First name: ")
last = input("Last name: ")
number = input("Favourite number: ")

username = first.lower() + last[0].lower() + number
print(username)`,
    practice: [
      "Predict string output",
      "Find the character at a position",
      "Work out the length",
      "Fix string operations",
      "Transform text",
      "Multiple choice",
    ],
    watchOut: "Index and length are different. The last letter of a 6-letter word is at index 5, not 6.",
    challenge: "A secret message transformer that changes a message in several steps.",
    canDo: "Read, measure and change text with indexing and string methods.",
  },
  {
    number: 8,
    title: "Lists",
    subtitle: "Working with many values",
    hook: "fruit1, fruit2 and fruit3 work for three fruits. A list keeps all of them under one name, in order.",
    concepts: [
      "Why lists exist",
      "Creating a list",
      "Indexing and changing items",
      "append() and remove()",
      "len() on a list",
      "Looping through a list",
    ],
    predict: {
      code: `games = ["Minecraft", "Chess"]
games.append("Roblox")
print(len(games))`,
      question: "What gets printed?",
      answer: "3. append() adds one item to the end.",
    },
    build: "Favourite Games",
    code: `games = ["Minecraft", "Chess", "Roblox"]
games.append("Football")
games.remove("Chess")

for game in games:
    print(game)`,
    practice: [
      "Identify indexes",
      "Predict output",
      "Add and remove items",
      "Fix list errors",
      "Loop through a list",
      "Put operations in order",
    ],
    watchOut: "On a 3-item list, games[3] is an error. The last item is games[2].",
    challenge: "A shopping list program: start with items, add one, remove one, print all.",
    canDo: "Create a list, change it, and loop through every item.",
  },
  {
    number: 9,
    title: "Functions",
    subtitle: "Creating your own commands",
    hook: "Writing the same lines again and again? Give them a name, then call the name.",
    concepts: [
      "Why functions exist",
      "def and calling",
      "Parameters and arguments",
      "return",
      "Reusing code",
    ],
    predict: {
      code: `def add(a, b):
    return a + b

print(add(5, 3))`,
      question: "What gets printed?",
      answer: "8. 5 and 3 go in, add() returns their sum.",
    },
    build: "Score Calculator",
    code: `def calculate_score(correct, total):
    return correct * 100 / total

result = calculate_score(8, 10)
print(result)`,
    practice: [
      "Label the parts of a function",
      "Call functions",
      "Fill in parameters",
      "Predict returned values",
      "Fix broken functions",
      "Write small functions",
    ],
    watchOut: "print() shows a value on screen. return hands it back so the rest of the program can use it.",
    challenge: "Write greet(), calculate_total() and check_score(), then use all three in one program.",
    canDo: "Write functions with parameters and return values, and reuse them.",
  },
  {
    number: 10,
    title: "Final Challenge",
    subtitle: "Build a mini quiz game",
    hook: "No video this time. A problem, a blank file, and five hints if you need them.",
    concepts: [
      "Variables and input",
      "Strings and conditions",
      "Loops and lists",
      "Functions",
      "Planning before coding",
    ],
    build: "Mini Quiz Game",
    code: `questions = ["What does print() do?", "Comparison symbol?"]
answers = ["display text", "=="]
score = 0

for i in range(len(questions)):
    reply = input(questions[i] + " ")
    if reply == answers[i]:
        score = score + 1`,
    practice: [],
    watchOut: "Get one question working first, then add the loop.",
    challenge: "Finish the game with your own questions and a final result message.",
    canDo: "Plan and build a complete program from a blank file.",
    requirements: [
      "Welcome the player",
      "Ask several questions",
      "Accept answers",
      "Check whether each answer is correct",
      "Keep a score",
      "Show the final score",
      "Give a result based on the score",
    ],
  },
];

export const PYTHON_FINAL_HINTS = [
  "Where will you store the player’s score?",
  "How can you repeat the questions?",
  "How do you check whether an answer is correct?",
  "Could a list hold your questions?",
  "Could a function keep the code organised?",
];

export const PYTHON_ASSESSMENT = [
  { part: "A", name: "Understand", detail: "10 multiple-choice questions" },
  { part: "B", name: "Predict", detail: "5 “what does this print?” questions" },
  { part: "C", name: "Debug", detail: "5 broken programs to fix" },
  { part: "D", name: "Think", detail: "5 plain-English steps to turn into Python" },
  { part: "E", name: "Code", detail: "Print 1 to 10 · Find the largest of three · Number guessing game" },
];

/** "The usual way" vs this course, for the positioning section. */
export const PYTHON_OLD_VS_NEW: { old: string; now: string }[] = [
  { old: "A 60-hour video course you half-watch at 2× speed", now: "About 8 hours of short lessons where you do something every minute" },
  { old: "₹3,000 to ₹50,000 for a paid program or class", now: "₹0. No trial, no card, nothing locked" },
  { old: "Long documentation written for working engineers", now: "Plain English and school-level examples, one idea at a time" },
  { old: "Install Python and set up an editor before line one", now: "Code runs in your browser, even on a phone" },
  { old: "Nobody checks your work until the exam", now: "Every answer is checked instantly, with a hint when you're wrong" },
];

/** Learning-science ideas the lesson design is built on. */
export const PYTHON_METHOD: { title: string; text: string }[] = [
  { title: "Predict, then run", text: "You guess what code will do before you see it. Wrong guesses are where the learning happens." },
  { title: "Worked examples first", text: "You watch a program get built line by line, then build one yourself. Beginners learn faster this way than from a blank page." },
  { title: "Quick checks, often", text: "A question after every idea, not one big test at the end. Recalling something is what makes it stick." },
  { title: "Small wins, every day", text: "XP for every right answer, badges and a daily streak keep you coming back for ten minutes a day." },
];

/** "What you get" cards. `stat` is the big headline number or word. */
export const PYTHON_OFFER: { stat: string; title: string; text: string }[] = [
  { stat: "500+", title: "Practice questions", text: "Multiple choice, predict the output, fix the bug, fill the blank, put lines in order and write your own code. All checked instantly." },
  { stat: "Free", title: "Python compiler", text: "Write and run any Python program in your browser. Type input() answers right in the console, like a real terminal. Nothing to install." },
  { stat: "10", title: "Lessons with notes", text: "Short slide notes for every lesson, with diagrams, tables, exam tips and flashcards. Read them again any time before a test." },
  { stat: "Live", title: "Runnable examples", text: "Step through code line by line and see each variable change. Then edit the example and run it yourself." },
  { stat: "1", title: "Final project", text: "Build a complete quiz game on your own, with hints one at a time if you get stuck." },
  { stat: "50", title: "Levels, badges, streak", text: "Earn XP for every right answer, climb 50 levels, unlock 10 badges and keep a daily streak." },
];

export type CompareTone = "yes" | "some" | "no";

/** Columns of the comparison table; Mentr is always first. */
export const PYTHON_COMPARE_COLUMNS = [
  "Mentr Learn Python",
  "YouTube video courses",
  "Paid video courses",
  "Coding classes",
  "Docs & tutorial sites",
];

export const PYTHON_COMPARE_ROWS: { label: string; cells: { text: string; tone: CompareTone }[] }[] = [
  {
    label: "Price",
    cells: [
      { text: "₹0, everything included", tone: "yes" },
      { text: "Free, with ads", tone: "yes" },
      { text: "Paid course fee", tone: "no" },
      { text: "High fee, often monthly", tone: "no" },
      { text: "Free", tone: "yes" },
    ],
  },
  {
    label: "Time to learn the basics",
    cells: [
      { text: "About 8 hours, hands-on", tone: "yes" },
      { text: "10–60 hours of video", tone: "no" },
      { text: "20–60+ hours of video", tone: "no" },
      { text: "Months of fixed classes", tone: "no" },
      { text: "No clear path", tone: "some" },
    ],
  },
  {
    label: "How you learn",
    cells: [
      { text: "You do: predict, fix and write code", tone: "yes" },
      { text: "You watch", tone: "no" },
      { text: "You watch and copy", tone: "some" },
      { text: "Group pace, set by the class", tone: "some" },
      { text: "You read long pages", tone: "no" },
    ],
  },
  {
    label: "Practice with instant feedback",
    cells: [
      { text: "500+ questions, checked instantly", tone: "yes" },
      { text: "None", tone: "no" },
      { text: "A few quizzes", tone: "some" },
      { text: "Homework, checked later", tone: "some" },
      { text: "Rarely", tone: "no" },
    ],
  },
  {
    label: "Write and run code",
    cells: [
      { text: "Built-in compiler, nothing to install", tone: "yes" },
      { text: "Install Python yourself", tone: "no" },
      { text: "Usually install yourself", tone: "some" },
      { text: "On the class computer", tone: "some" },
      { text: "Some have a try-it box", tone: "some" },
    ],
  },
  {
    label: "Works on a phone",
    cells: [
      { text: "Yes, including the compiler", tone: "yes" },
      { text: "Watch only", tone: "some" },
      { text: "Watch only", tone: "some" },
      { text: "No", tone: "no" },
      { text: "Reading only", tone: "some" },
    ],
  },
  {
    label: "When you're stuck",
    cells: [
      { text: "Hints, error line highlighted, plain-English fix", tone: "yes" },
      { text: "Scroll the comments", tone: "no" },
      { text: "Post in a Q&A forum", tone: "some" },
      { text: "Wait for the next class", tone: "some" },
      { text: "Search on your own", tone: "no" },
    ],
  },
  {
    label: "Made for school students",
    cells: [
      { text: "Yes, Class 6+ and CBSE-friendly", tone: "yes" },
      { text: "Mixed", tone: "some" },
      { text: "Mostly for adults", tone: "some" },
      { text: "Depends on the class", tone: "some" },
      { text: "Written for developers", tone: "no" },
    ],
  },
  {
    label: "Progress you can see",
    cells: [
      { text: "XP, 50 levels, badges, streak", tone: "yes" },
      { text: "None", tone: "no" },
      { text: "Progress bar, certificate", tone: "some" },
      { text: "Teacher feedback", tone: "some" },
      { text: "None", tone: "no" },
    ],
  },
];

export const LEARN_PYTHON_FAQS = [
  {
    question: "Can I learn Python for free?",
    answer:
      "Yes. Python Beginner on Mentr Learn is a full 10-lesson Python course that costs ₹0. There’s no trial, no card and nothing locked behind a payment.",
  },
  {
    question: "Is Python good for beginners?",
    answer:
      "Yes. Python is the most popular first programming language because the code is short and easy to read. A first program is one line: print(\"Hello\").",
  },
  {
    question: "Is Python hard to learn?",
    answer:
      "The basics are not hard. Python Beginner teaches one idea per lesson, starts with everyday examples, and gives you practice after every new concept. If you can follow a recipe, you can follow a Python program.",
  },
  {
    question: "What age should a child start learning Python?",
    answer:
      "Class 6 (around age 11) is a good time to start typed Python. For younger children in Class 3–5, Mentr Learn offers free coding, AI and maths lessons that don’t need typing.",
  },
  {
    question: "How long does it take to learn Python basics?",
    answer:
      "Python Beginner is 10 lessons and fully self-paced. At one or two lessons a week, you’d finish the basics in about one to two months, including the final project.",
  },
  {
    question: "Do I need a long 60-hour Python course?",
    answer:
      "No. To learn the basics you need practice, not hours of video. Python Beginner is about 8 hours of short lessons where you predict, fix and write code yourself, with 500+ questions that are checked instantly.",
  },
  {
    question: "Is there a free online Python compiler?",
    answer:
      "Yes. Every learner gets a free Python compiler that runs in the browser, on laptops and phones. Write any program, press Run, and type answers to input() right in the output console. Nothing to install.",
  },
  {
    question: "Do I need any coding experience?",
    answer:
      "No. Lesson 1 starts from zero: what programming is and how to show text on screen with print(). Each lesson builds on the one before.",
  },
  {
    question: "What will I be able to do after Python Beginner?",
    answer:
      "Write small programs on your own — a calculator, a grade checker, a times table, a shopping list — and a complete quiz game that uses variables, input, if/else, loops, lists and functions together.",
  },
  {
    question: "What is Python used for?",
    answer:
      "Websites and apps, games, automating boring tasks, data analysis, science research, and artificial intelligence and machine learning. Many of the AI tools people use today are built with Python.",
  },
  {
    question: "When will Python Intermediate and Advanced open?",
    answer:
      "Python Beginner is open now. Python Intermediate and Python Advanced are being built and will open on this page. Finishing Beginner is the right way to prepare for both.",
  },
  {
    question: "How is this different from Mentr Learn for Class 3–5?",
    answer:
      "Mentr Learn for Class 3–5 teaches computer science, AI and maths with narrated videos and block coding — no typing. Learn Python is real typed Python from the first lesson, for older students and beginners of any age.",
  },
  {
    question: "Can I get a Python tutor too?",
    answer:
      "Yes. Search Python tutors on Mentr and book a free online demo from any tutor’s profile. The course stays free whether or not you hire a tutor.",
  },
];

export const LEARN_PYTHON_KEYWORDS = [
  "learn Python free",
  "learn Python online free",
  "free Python course",
  "Python for beginners",
  "Python course for beginners",
  "Python course for kids",
  "Python for school students",
  "Python for Class 6",
  "is Python hard to learn",
  "Python basics course",
  "Python course with projects",
  "Mentr Learn Python",
];

export function learnPythonCourseJsonLd(description: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Course",
    name: "Python Beginner — Mentr Learn",
    description,
    url: absoluteUrl(LEARN_PYTHON_PATH),
    provider: {
      "@type": "Organization",
      name: SITE_BRAND,
      url: absoluteUrl("/"),
    },
    educationalLevel: "Beginner",
    inLanguage: "en",
    isAccessibleForFree: true,
    teaches: PYTHON_OUTCOMES,
    numberOfCredits: PYTHON_BEGINNER_LESSONS.length,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "INR",
      availability: "https://schema.org/InStock",
      category: "Free",
      url: absoluteUrl(LEARN_PYTHON_PATH),
    },
    hasCourseInstance: {
      "@type": "CourseInstance",
      courseMode: "online",
      name: "Python Beginner — self-paced",
    },
    syllabusSections: PYTHON_BEGINNER_LESSONS.map((lesson) => ({
      "@type": "Syllabus",
      name: `Lesson ${lesson.number}: ${lesson.title}`,
      description: `${lesson.subtitle}. ${lesson.concepts.join(", ")}.`,
    })),
  };
}
