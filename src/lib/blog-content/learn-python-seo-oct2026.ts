import type { ArticleContent } from "./types";

const COURSE = "/learnpython";
const COMPILER = "/openpythoncompiler";
const AUTHOR = "Mentr Editorial Team";
const DATE = "2026-10-08";

const POSTS = {
  best: "/blog/best-way-to-learn-python-free",
  beginners: "/blog/how-to-learn-python-for-beginners",
  school: "/blog/python-for-school-students-india",
  projects: "/blog/python-projects-for-beginners",
  hard: "/blog/is-python-hard-to-learn",
} as const;

function related(self: string) {
  const all = [
    { label: "Learn Python free", href: COURSE },
    { label: "Best way to learn Python free", href: POSTS.best },
    { label: "How to learn Python for beginners", href: POSTS.beginners },
    { label: "Python for school students in India", href: POSTS.school },
    { label: "Python projects for beginners", href: POSTS.projects },
    { label: "Is Python hard to learn?", href: POSTS.hard },
    { label: "Free online Python compiler", href: COMPILER },
  ];
  return all.filter((link) => link.href !== self);
}

export const LEARN_PYTHON_SEO_OCT2026: Record<string, ArticleContent> = {
  "best-way-to-learn-python-free": {
    slug: "best-way-to-learn-python-free",
    publishedAt: DATE,
    updatedAt: DATE,
    readTimeMinutes: 8,
    author: AUTHOR,
    intro:
      "The best way to learn Python free is a short course you can finish, with a place to run code in the browser and practice after every idea. A 60-hour video library and a blank editor both stall beginners. Mentr Learn Python is that shorter path: 10 lessons, 500+ practice questions and a free compiler, at ₹0 with no card.",
    sections: [
      {
        heading: "What “best” means for a first Python course",
        blocks: [
          {
            type: "paragraph",
            text: "A useful free Python course does four things. It starts from print(), not from classes and files. It lets you run code on the same day, including on a phone. It checks your answers so you know you understood the last idea. And it ends with a program you built, not a certificate you watched your way into.",
          },
          {
            type: "list",
            items: [
              "Price is ₹0, with no card and no “trial that becomes a bill”.",
              "Lessons are short enough to do after school.",
              "You type and run Python, you don’t only watch someone else type.",
              "The last lesson is a project, so you leave with a program.",
            ],
          },
        ],
      },
      {
        heading: "What you get on the free course",
        blocks: [
          {
            type: "paragraph",
            text: "Python Beginner is live at mentr.in/learnpython. Intermediate and Advanced are not open yet. Beginner is 10 lessons: Welcome to Python, Variables, Input and Calculations, Making Decisions with if, Thinking with Logic, Loops, Strings, Lists, Functions, and a Final Challenge.",
          },
          {
            type: "table",
            caption: "What the free beginner course includes",
            headers: ["Piece", "What you do"],
            rows: [
              ["Study", "Read the idea, then run the example on the page"],
              ["Examples", "Step through a program and edit it"],
              ["Practice", "Multiple choice, predict the output, fix a bug, fill a blank, order the lines, write code"],
              ["Compiler", "Run any Python in the browser, with input() typed in the console"],
              ["Final Challenge", "Build a real program. A quiz game is one of the projects"],
            ],
          },
          {
            type: "paragraph",
            text: "The practice bank is 500+ questions. A correct Run on a final project marks that project complete. You need one completed project for the certificate. Hints are free. Opening a full solution still lets you finish the project later.",
          },
          {
            type: "cta",
            title: "Start the free course",
            text: "10 lessons, from your first print() to a program you build. ₹0, no card.",
            label: "Learn Python free",
            href: COURSE,
          },
        ],
      },
      {
        heading: "A week that actually finishes",
        blocks: [
          {
            type: "list",
            ordered: true,
            items: [
              "Day 1: Lesson 1. Print a few lines and read them top to bottom.",
              "Day 2: Variables, then input and calculations. Your program asks a question.",
              "Day 3: if / elif / else, then and, or and not.",
              "Day 4: Loops. Repeat work without copying the same line.",
              "Day 5: Strings, lists and functions.",
              "Day 6: Final Challenge. Build one project and press Run until it passes.",
            ],
          },
          {
            type: "paragraph",
            text: "Ten minutes is enough on a school night. The course is self-paced. You can also open the free compiler any time you want to try a line that isn’t in the lesson.",
          },
        ],
      },
    ],
    faqs: [
      {
        question: "What is the best way to learn Python for free?",
        answer:
          "Use a short beginner course you can run in the browser, practise after each idea, and finish with one small program. Mentr Learn Python is free: 10 lessons, 500+ practice questions and a compiler, at mentr.in/learnpython.",
      },
      {
        question: "Is there a free Python course with no credit card?",
        answer: "Yes. The beginner course is ₹0 and does not ask for a card. Intermediate and Advanced are not open yet.",
      },
      {
        question: "Do I have to install Python?",
        answer: "No. Lessons and the compiler run in the browser. Install Python later if you need files, turtle, or packages from pip.",
      },
    ],
    relatedLinks: related(POSTS.best),
  },

  "how-to-learn-python-for-beginners": {
    slug: "how-to-learn-python-for-beginners",
    publishedAt: DATE,
    updatedAt: DATE,
    readTimeMinutes: 8,
    author: AUTHOR,
    intro:
      "Learn Python for beginners by writing one small idea, running it, and only then moving on. Start with print(), then names for values, then questions, decisions, repetition, text, lists and your own functions. That is the order of the free 10-lesson course at mentr.in/learnpython.",
    sections: [
      {
        heading: "The order that keeps beginners unstuck",
        blocks: [
          {
            type: "paragraph",
            text: "Skipping ahead is why people say Python is confusing. A loop is easy after you can print and name a value. A function is easy after you have written the same lines three times. Follow this order.",
          },
          {
            type: "table",
            caption: "Beginner path, lesson by lesson",
            headers: ["Lesson", "You can do this after it"],
            rows: [
              ["1. Welcome to Python", "print() a few lines, in order, with quotes around text"],
              ["2. Variables", "Store a name or a number and use it again"],
              ["3. Input and calculations", "Ask with input() and do arithmetic"],
              ["4. Making decisions with if", "Choose with if, elif and else"],
              ["5. Thinking with logic", "Combine tests with and, or and not"],
              ["6. Loops", "Repeat with for and while, including range()"],
              ["7. Strings", "Clean and change text"],
              ["8. Lists", "Keep many values and loop over them"],
              ["9. Functions", "Name a block of code and return a result"],
              ["10. Final Challenge", "Build a whole program from those pieces"],
            ],
          },
        ],
      },
      {
        heading: "How to study one lesson",
        blocks: [
          {
            type: "list",
            ordered: true,
            items: [
              "Read the study notes until the idea has a name you can say out loud.",
              "Run the example. If it asks for input(), type the answer in the console and press Enter.",
              "Predict the next snippet before you run it. A wrong guess is useful.",
              "Do the practice. Fix the bug questions on purpose: the error message is the lesson.",
              "Only then open the next lesson.",
            ],
          },
          {
            type: "paragraph",
            text: "A first program looks like this. Quotes make the words text. The two print lines run from top to bottom.",
          },
          { type: "code", code: "print(\"Hello\")\nname = \"Ada\"\nprint(name)" },
          {
            type: "cta",
            title: "Follow the 10 lessons",
            text: "Each lesson is study, examples and practice. The compiler is in the same course.",
            label: "Start as a beginner",
            href: COURSE,
          },
        ],
      },
      {
        heading: "Three habits that beat a long playlist",
        blocks: [
          {
            type: "list",
            items: [
              "Type the code. Watching a video of print() does not teach your fingers.",
              "Read the error. SyntaxError, NameError and IndentationError each point at a different mistake.",
              "Stop while it is still easy. Ten minutes on one idea sticks better than an hour of five ideas.",
            ],
          },
        ],
      },
    ],
    faqs: [
      {
        question: "How should a complete beginner learn Python?",
        answer:
          "Go in order: print, variables, input, if, logic, loops, strings, lists, functions, then one project. Run every example. The free course at mentr.in/learnpython is built in that order.",
      },
      {
        question: "What should my first Python program be?",
        answer: "A few print() lines. Then a program that stores your name in a variable and prints it.",
      },
      {
        question: "How many lessons are in the beginner course?",
        answer: "Ten. Nine teach one idea each. Lesson 10 is the Final Challenge, where you build a program.",
      },
    ],
    relatedLinks: related(POSTS.beginners),
  },

  "python-for-school-students-india": {
    slug: "python-for-school-students-india",
    publishedAt: DATE,
    updatedAt: DATE,
    readTimeMinutes: 7,
    author: AUTHOR,
    intro:
      "School students in India can learn Python free without a coaching-centre timetable. From Class 6 up, and for anyone meeting code for the first time, the beginner course at mentr.in/learnpython covers the ideas CBSE and state-board computer classes usually start with: print, variables, if, loops, strings, lists and functions. It is ₹0, with no card.",
    sections: [
      {
        heading: "Who this course is for",
        blocks: [
          {
            type: "paragraph",
            text: "It fits a Class 6, 7 or 8 student whose school has just put Python on the computer timetable, and a Class 11 or 12 student who needs the basics before the textbook jumps to files and libraries. It also fits a younger student who can read English instructions and type on a phone or a laptop. It is not the Class 3–5 block-coding course. That one lives at mentr.in/learn and does not ask children to type Python.",
          },
          {
            type: "list",
            items: [
              "Class 6 and up: start at lesson 1 even if school has already shown print().",
              "Class 11 and 12: use it to make if, loops and functions solid before the board chapters.",
              "Parents: the student signs in and works alone. You do not sit through a 60-hour batch.",
            ],
          },
        ],
      },
      {
        heading: "What lines up with a school syllabus",
        blocks: [
          {
            type: "table",
            caption: "School topic and the lesson that teaches it",
            headers: ["School topic", "Lesson"],
            rows: [
              ["print() and a first program", "1. Welcome to Python"],
              ["Variables and data types", "2. Variables"],
              ["input() and arithmetic", "3. Input and calculations"],
              ["if, elif, else", "4. Making decisions with if"],
              ["and, or, not", "5. Thinking with logic"],
              ["for, while, range()", "6. Loops"],
              ["Strings", "7. Strings"],
              ["Lists", "8. Lists"],
              ["Functions and return", "9. Functions"],
              ["A small project", "10. Final Challenge"],
            ],
          },
          {
            type: "paragraph",
            text: "Practice questions use the same shapes as school tests: predict the output, fill the blank, find the error, and write a short program. There are 500+ of them. The free compiler runs on a phone, which matters when the home laptop is in use.",
          },
          {
            type: "cta",
            title: "Open the school-friendly course",
            text: "Free for Class 6 and up. No card. Intermediate and Advanced are still coming.",
            label: "Learn Python free",
            href: COURSE,
          },
        ],
      },
      {
        heading: "A practical week around homework",
        blocks: [
          {
            type: "paragraph",
            text: "Do one lesson on the evening it matches the school chapter, not five lessons on Sunday. If the school test is on if statements, stop after lesson 4 and redo the practice. The final project can wait until functions feel ordinary.",
          },
        ],
      },
    ],
    faqs: [
      {
        question: "Can a Class 6 student learn Python free in India?",
        answer:
          "Yes. The beginner course at mentr.in/learnpython starts from print() and is written for Class 6 and up, and for any first-time coder. It is ₹0.",
      },
      {
        question: "Is this the same as the Class 3–5 coding course?",
        answer:
          "No. Class 3–5 uses Mentr Learn at mentr.in/learn, with short lessons and no typed Python. This course is typed Python for older students.",
      },
      {
        question: "Will it cover the Class 11 Python chapters?",
        answer:
          "It covers the beginner core those chapters assume: variables, input, if, loops, strings, lists and functions. Files, libraries and classes are in the later levels, which are not open yet.",
      },
    ],
    relatedLinks: related(POSTS.school),
  },

  "python-projects-for-beginners": {
    slug: "python-projects-for-beginners",
    publishedAt: DATE,
    updatedAt: DATE,
    readTimeMinutes: 7,
    author: AUTHOR,
    intro:
      "The best Python projects for beginners use only print, variables, input, if, loops, strings, lists and functions. A quiz, a calculator, a number guess, a report card and tic-tac-toe all fit that list. Lesson 10 of the free course at mentr.in/learnpython is a final challenge with those programs. You pick one, press Run, and a correct program is marked complete.",
    sections: [
      {
        heading: "Projects that match what you just learned",
        blocks: [
          {
            type: "table",
            caption: "Beginner projects and the ideas they use",
            headers: ["Project", "Ideas you need"],
            rows: [
              ["Calculator", "input(), if / elif, a while loop, a function that returns a number"],
              ["Guess the number", "int(input()), comparisons, a counter, a loop that stops"],
              ["Mini quiz", "a list of questions, .strip() and .lower(), a score"],
              ["Report card", "a list of students, append(), average, the top student"],
              ["Tic-tac-toe", "a list as a 3 by 3 board, turns, a winner check"],
            ],
          },
          {
            type: "paragraph",
            text: "Start with the quiz or the calculator. Both ask a question, make a decision and repeat until the person is done. That is the whole beginner course in one file.",
          },
        ],
      },
      {
        heading: "How a project gets marked",
        blocks: [
          {
            type: "paragraph",
            text: "You write the program in the project editor and press Run. When the program asks for input(), you type in the console and press Enter. If the program is correct, a completion card appears and the project counts. Hints never block that. If you opened the full solution earlier, a correct Run still marks it complete.",
          },
          {
            type: "list",
            items: [
              "One completed project is enough for the certificate.",
              "Each completed project adds 10 XP.",
              "You can run the code in the free compiler as well, at mentr.in/openpythoncompiler.",
            ],
          },
          {
            type: "paragraph",
            text: "A tiny piece of a quiz looks like this. A real quiz keeps the questions in a list and loops.",
          },
          {
            type: "code",
            code: "answer = input(\"Capital of France? \").strip().lower()\nif answer == \"paris\":\n    print(\"Correct\")\nelse:\n    print(\"Try again\")",
          },
          {
            type: "cta",
            title: "Build one project",
            text: "The Final Challenge is open from the first day. Finish the lessons first if the ideas are new.",
            label: "Go to the free course",
            href: COURSE,
          },
        ],
      },
      {
        heading: "Projects to leave for later",
        blocks: [
          {
            type: "paragraph",
            text: "A website, a Discord bot, or anything that needs files, APIs or extra libraries will fight you in week one. Finish one of the five beginner programs first. Intermediate and Advanced, where files and larger programs belong, are not open yet.",
          },
        ],
      },
    ],
    faqs: [
      {
        question: "What Python projects can a beginner build?",
        answer:
          "A calculator, a number-guessing game, a quiz, a small report card and tic-tac-toe. They use input, decisions, loops, lists and functions. They are the Final Challenge on mentr.in/learnpython.",
      },
      {
        question: "How is a project marked complete?",
        answer: "Press Run. If the program passes, it is marked complete, including after you have opened the full solution. One completed project counts toward the certificate.",
      },
      {
        question: "Do I need to install Python to build these?",
        answer: "No. The project editor and the free compiler both run in the browser.",
      },
    ],
    relatedLinks: related(POSTS.projects),
  },

  "is-python-hard-to-learn": {
    slug: "is-python-hard-to-learn",
    publishedAt: DATE,
    updatedAt: DATE,
    readTimeMinutes: 7,
    author: AUTHOR,
    intro:
      "Python is not hard to learn as a first language if you take it in small pieces and run each one. The hard part is a course that starts with classes, or a video you never type along with. A beginner can write a real program in about ten short lessons. That is the free course at mentr.in/learnpython: ₹0, no card, no experience required.",
    sections: [
      {
        heading: "What actually feels hard",
        blocks: [
          {
            type: "paragraph",
            text: "The language itself is small at the start. print(\"Hello\") is one line. What feels hard is usually one of these.",
          },
          {
            type: "list",
            items: [
              "Quotes, colons and indentation. The computer is literal. print(Hello) is an error. print(\"Hello\") works.",
              "Skipping. Loops feel impossible if variables are still fuzzy.",
              "Only watching. A one-hour lecture does less than ten minutes of typing.",
              "A huge first project. A quiz is enough. A social network is not.",
            ],
          },
        ],
      },
      {
        heading: "How long it takes",
        blocks: [
          {
            type: "paragraph",
            text: "With one lesson a day, the beginner course is about ten days of short sessions, or a quieter week if you do two lessons. You are not “job ready” after that. You can read a beginner program, change it, and build a quiz, a calculator or a guessing game. That is the right finish line for a first course.",
          },
          {
            type: "table",
            caption: "A honest timeline",
            headers: ["After", "You can"],
            rows: [
              ["Lesson 1", "Print lines in order"],
              ["Lesson 3", "Ask a question and do arithmetic"],
              ["Lesson 6", "Repeat work with a loop"],
              ["Lesson 9", "Put repeated code into a function"],
              ["Lesson 10", "Finish one small project and mark it complete"],
            ],
          },
          {
            type: "paragraph",
            text: "Errors are part of the time, not a sign you should stop. NameError means a name is misspelled or used too early. IndentationError means a line in a block does not line up. Both are normal in week one.",
          },
          {
            type: "cta",
            title: "Try the first lesson",
            text: "If print() makes sense, the rest of the course is the same size of idea, one at a time.",
            label: "Learn Python free",
            href: COURSE,
          },
        ],
      },
      {
        heading: "When it does get harder",
        blocks: [
          {
            type: "paragraph",
            text: "Files, classes, APIs and algorithms are real work. They are not lesson 2. Intermediate and Advanced on this course are still coming. Until they open, stay on Beginner and use the free compiler when you want to experiment outside a lesson.",
          },
        ],
      },
    ],
    faqs: [
      {
        question: "Is Python hard for beginners?",
        answer:
          "No, if you learn print, variables, input, decisions, loops, strings, lists and functions in that order and run the code. It feels hard when the course skips ahead or you only watch.",
      },
      {
        question: "How long does it take to learn Python basics?",
        answer:
          "About ten short lessons, one idea a day. After that you can build a small project such as a quiz or a calculator. A job or a large app takes longer.",
      },
      {
        question: "Can I learn Python with no experience?",
        answer: "Yes. The free beginner course assumes you have not written code before. It starts with what a program is, then print().",
      },
    ],
    relatedLinks: related(POSTS.hard),
  },
};
