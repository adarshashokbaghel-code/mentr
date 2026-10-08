import type { ArticleContent } from "./types";

const COMPILER = "/openpythoncompiler";
const HOW = "/openpythoncompiler/how-it-works";
const COURSE = "/learnpython";

function related(extra: { label: string; href: string }[] = []) {
  return [
    { label: "Online Python compiler (free)", href: COMPILER },
    { label: "How we built the compiler", href: HOW },
    { label: "Learn Python free", href: COURSE },
    ...extra,
  ];
}

const AUTHOR = "Mentr Engineering";

export const COMPILER_SEO_OCT2026: Record<string, ArticleContent> = {
  "how-to-run-python-code-online": {
    slug: "how-to-run-python-code-online",
    publishedAt: "2026-10-07",
    updatedAt: "2026-10-07",
    readTimeMinutes: 6,
    author: AUTHOR,
    intro:
      "You don't need to install anything to start writing Python. A browser-based compiler gives you an editor, a Run button and an output window in one tab, on a laptop, a school computer or a phone. This guide walks through running your first program, using input(), reading errors and saving your work, using Mentr's free online Python compiler as the example. When you want lessons rather than only a place to run code, the free course is at mentr.in/learnpython.",
    sections: [
      {
        heading: "Step 1: Open a compiler and write one line",
        blocks: [
          {
            type: "paragraph",
            text: "Open mentr.in/openpythoncompiler. The left side (or the Code tab on a phone) is main.py, your program. Type a single line:",
          },
          { type: "code", code: "print(\"Hello, world!\")" },
          {
            type: "paragraph",
            text: "The first time you open the page, your browser downloads Python itself, about 6.3 MB. A progress bar shows while it loads. After that it comes from your browser's cache and starts almost instantly.",
          },
        ],
      },
      {
        heading: "Step 2: Press Run",
        blocks: [
          {
            type: "paragraph",
            text: "Click Run, or press Ctrl + Enter (⌘ + Enter on a Mac). Output appears on the right as your program prints it. On a phone, the compiler switches to the Output tab for you.",
          },
          {
            type: "callout",
            title: "Where does the code run?",
            text: "On your own device. The compiler is real CPython 3.14 compiled to WebAssembly, running in a background thread of your browser. Your code is not sent to a server.",
          },
        ],
      },
      {
        heading: "Step 3: Ask the user something with input()",
        blocks: [
          {
            type: "paragraph",
            text: "Try a program that asks a question:",
          },
          { type: "code", code: "name = input(\"What is your name? \")\nprint(\"Hi\", name)" },
          {
            type: "paragraph",
            text: "When you press Run, the prompt appears in the output with a blinking cursor right after it. Type your answer and press Enter, and the program carries on. On older browsers an Input box appears instead: write one answer per line before you press Run.",
          },
        ],
      },
      {
        heading: "Step 4: Read the error, then jump to the line",
        blocks: [
          {
            type: "paragraph",
            text: "Mistakes are normal. If you forget a colon or misspell a name, the output shows the error type, the line number and, for common mistakes, a plain-English hint. Click “Line N in main.py” to jump to the problem. The full traceback is one click away if you want it.",
          },
          {
            type: "table",
            caption: "Errors beginners see most",
            headers: ["Error", "What it usually means"],
            rows: [
              ["SyntaxError", "A typo in the shape of the code: a missing colon, bracket or quote"],
              ["IndentationError", "The spaces at the start of a line don't line up with the block"],
              ["NameError", "A variable or function name is misspelled or used before it is set"],
              ["TypeError", "Mixing types, such as adding a number to text"],
              ["ValueError", "Right type, wrong value, such as int(\"abc\")"],
            ],
          },
        ],
      },
      {
        heading: "Step 5: Save your work",
        blocks: [
          {
            type: "list",
            items: [
              "Your code autosaves in this browser as you type, so it is still there tomorrow.",
              "Press Download to keep a copy as main.py.",
              "Press Open (the upload icon) to load a .py file up to 200 KB.",
              "Use the Examples menu for ready programs: loops, if/elif, lists, a dice game and a star pattern.",
            ],
          },
          {
            type: "cta",
            title: "Try it now",
            text: "Free, no sign-up, and it works on your phone.",
            label: "Open the Python compiler",
            href: COMPILER,
          },
        ],
      },
      {
        heading: "When to install Python instead",
        blocks: [
          {
            type: "paragraph",
            text: "An online compiler is ideal for learning, homework and quick experiments. Install Python on a laptop when you need files on disk, windows and graphics (tkinter, turtle), long-running programs, or any package from pip. Browser compilers only load packages that have been built for WebAssembly.",
          },
        ],
      },
    ],
    faqs: [
      {
        question: "Can I run Python online without downloading anything?",
        answer: "You don't install anything. The browser downloads the Python runtime once (about 6.3 MB) and caches it, then runs your code in the page.",
      },
      {
        question: "Is it free to run Python online on Mentr?",
        answer: "Yes. The compiler is free with no sign-up. Because your code runs on your own device, there is no per-run server cost.",
      },
      {
        question: "Which Python version runs?",
        answer: "Python 3.14.2, the real CPython interpreter compiled to WebAssembly by the Pyodide project.",
      },
      {
        question: "Why did my program stop after 15 seconds?",
        answer: "Each run has a 15-second limit so an infinite loop can't freeze the page. Time spent waiting for your input() answer doesn't count.",
      },
    ],
    relatedLinks: related([{ label: "Python compiler with input()", href: "/blog/online-python-compiler-with-input" }]),
  },

  "online-python-compiler-with-input": {
    slug: "online-python-compiler-with-input",
    publishedAt: "2026-10-07",
    updatedAt: "2026-10-07",
    readTimeMinutes: 7,
    author: AUTHOR,
    intro:
      "Beginners' programs are full of input(): quizzes, calculators, number-guessing games. Yet input() is the feature online Python compilers most often get wrong. This article explains why it's hard, the two ways compilers handle it, and what to expect from each. The quizzes and games below are also the projects in the free course at mentr.in/learnpython.",
    sections: [
      {
        heading: "Why input() is hard in a browser",
        blocks: [
          {
            type: "paragraph",
            text: "In a terminal, input() pauses your program until you press Enter. A web page can't pause like that: JavaScript must never block, or the page freezes. So a compiler has to find another way for Python to wait for you.",
          },
        ],
      },
      {
        heading: "Way 1: type all answers before you run",
        blocks: [
          {
            type: "paragraph",
            text: "Many compilers give you an Input (stdin) box. You write every answer, one per line, then press Run. Each input() call reads the next line.",
          },
          {
            type: "list",
            items: [
              "Works everywhere, including older browsers.",
              "You must know all the answers in advance, so a guessing game that reacts to your guesses doesn't really work.",
              "Prompts and answers appear separately, which confuses beginners.",
            ],
          },
        ],
      },
      {
        heading: "Way 2: a real interactive console",
        blocks: [
          {
            type: "paragraph",
            text: "The better experience is a console where the prompt appears, you type the answer right after it, press Enter, and the program continues, exactly like a terminal.",
          },
          {
            type: "paragraph",
            text: "Mentr's compiler does this by running Python in a Web Worker (a background thread). When Python calls input(), the worker sleeps on a SharedArrayBuffer using Atomics.wait(). When you press Enter, the page writes your line into that shared memory and wakes the worker. Only the background thread waits, so the page stays responsive.",
          },
          {
            type: "callout",
            title: "The catch",
            text: "Browsers only allow SharedArrayBuffer on cross-origin isolated pages, which need two extra HTTP headers. Where that isn't available, Mentr's compiler falls back to Way 1 automatically.",
          },
        ],
      },
      {
        heading: "Try a program that needs real input()",
        blocks: [
          {
            type: "paragraph",
            text: "Paste this guessing game into the compiler. It only makes sense with an interactive console, because each answer depends on the last hint.",
          },
          {
            type: "code",
            code: "import random\nsecret = random.randint(1, 20)\nwhile True:\n    guess = int(input(\"Guess (1-20): \"))\n    if guess == secret:\n        print(\"Got it!\")\n        break\n    print(\"Higher\" if guess < secret else \"Lower\")",
          },
          {
            type: "list",
            items: [
              "Time spent waiting for your answer doesn't count toward the 15-second run limit.",
              "Press Ctrl + D on an empty answer to send end-of-input (EOFError), like a terminal.",
              "Answers you type are shown in green in the output so you can follow the conversation.",
            ],
          },
          {
            type: "cta",
            title: "Run the guessing game",
            text: "Real input() in your browser, free and with no sign-up.",
            label: "Open the compiler",
            href: COMPILER,
          },
        ],
      },
    ],
    faqs: [
      {
        question: "Why does input() give EOFError in some online compilers?",
        answer: "The compiler ran out of pre-typed input. In stdin-box compilers, each input() reads one line you entered before running; if there are fewer lines than input() calls, Python raises EOFError.",
      },
      {
        question: "Does Mentr's online Python compiler support input()?",
        answer: "Yes. On modern browsers you type answers straight into the output as the program runs. On older browsers it shows an Input box where you write one answer per line.",
      },
      {
        question: "Does waiting for input count toward the time limit?",
        answer: "No. The 15-second limit pauses while the program is waiting for you to type.",
      },
    ],
    relatedLinks: related([{ label: "How to run Python code online", href: "/blog/how-to-run-python-code-online" }]),
  },

  "python-compiler-for-mobile": {
    slug: "python-compiler-for-mobile",
    publishedAt: "2026-10-07",
    updatedAt: "2026-10-07",
    readTimeMinutes: 6,
    author: AUTHOR,
    intro:
      "Plenty of students first meet Python on a phone. You don't need an app for that: a browser-based compiler runs Python in Chrome on Android or Safari on iPhone. Here is what works, what doesn't, and how to make typing code on a small screen less painful. The same phone can open the free beginner course at mentr.in/learnpython.",
    sections: [
      {
        heading: "Do you need an app?",
        blocks: [
          {
            type: "paragraph",
            text: "No. Mentr's online Python compiler runs real CPython 3.14 inside the mobile browser using WebAssembly. Open mentr.in/openpythoncompiler, wait for the one-time download (about 6.3 MB) and press Run. Later visits load from cache.",
          },
          {
            type: "callout",
            title: "Data tip",
            text: "Open the compiler once on Wi-Fi. After the first load, Python comes from your browser cache instead of mobile data.",
          },
        ],
      },
      {
        heading: "How the phone layout works",
        blocks: [
          {
            type: "list",
            items: [
              "Three tabs, Code, Input and Output, instead of a cramped side-by-side view.",
              "A big Run button in a bottom bar, within thumb reach and clear of the iPhone home indicator.",
              "Pressing Run switches to Output; tapping an error's line number jumps back to Code with the line marked.",
              "16 px text in the editor so iOS doesn't zoom in when you tap to type.",
              "input() prompts show a text field right after the question, and the keyboard's Enter key sends your answer.",
            ],
          },
        ],
      },
      {
        heading: "Tips for typing Python on a phone",
        blocks: [
          {
            type: "list",
            items: [
              "Let the editor indent for you: after a line ending in a colon, pressing Enter adds four spaces.",
              "Start from the Examples menu and edit, rather than typing every line from scratch.",
              "Turn the phone sideways for long lines.",
              "Quotes: some phone keyboards insert curly “smart” quotes. If you see a SyntaxError on a print line, retype the quotes or turn off smart punctuation.",
            ],
          },
        ],
      },
      {
        heading: "What doesn't work on mobile (or anywhere in a browser)",
        blocks: [
          {
            type: "list",
            items: [
              "tkinter and turtle need a desktop window, so they aren't available in any browser compiler.",
              "pip install isn't available; only packages built for Pyodide load (numpy, pandas, scipy and a few hundred others do).",
              "Very old phones and browsers may not support WebAssembly well.",
            ],
          },
          {
            type: "cta",
            title: "Open it on your phone",
            text: "Bookmark it or add it to your home screen for one-tap practice.",
            label: "Open the Python compiler",
            href: COMPILER,
          },
        ],
      },
    ],
    faqs: [
      {
        question: "Can I run Python on an iPhone without an app?",
        answer: "Yes. Open Mentr's online Python compiler in Safari. Python runs in the browser via WebAssembly; nothing is installed.",
      },
      {
        question: "Does the Python compiler work on Android?",
        answer: "Yes, in Chrome and other modern Android browsers, with a phone layout of Code, Input and Output tabs.",
      },
      {
        question: "How much data does it use?",
        answer: "About 6.3 MB on the first visit to download Python. After that it loads from your browser's cache.",
      },
    ],
    relatedLinks: related([{ label: "Best free online Python compiler for beginners", href: "/blog/best-free-online-python-compiler-for-beginners" }]),
  },

  "best-free-online-python-compiler-for-beginners": {
    slug: "best-free-online-python-compiler-for-beginners",
    publishedAt: "2026-10-07",
    updatedAt: "2026-10-07",
    readTimeMinutes: 8,
    author: AUTHOR,
    intro:
      "Searching “online Python compiler” gives you dozens of options that look the same. They are actually built in very different ways, and that decides how fast they are, whether input() works, whether you need an account, and where your code goes. This checklist helps a beginner pick, and is honest about where our own compiler fits. If you want the lessons that go with it, start at the free course on mentr.in/learnpython.",
    sections: [
      {
        heading: "The four kinds of “online Python”",
        blocks: [
          {
            type: "table",
            caption: "How the main types compare",
            headers: ["Type", "Where code runs", "Good for", "Trade-off"],
            rows: [
              ["Browser-based compiler", "On your device (WebAssembly)", "Learning, practice, phones", "First load downloads Python; only WebAssembly-built packages"],
              ["Server-based compiler", "On the provider's server", "Quick runs, wider library choice", "Every run is a network round trip; your code is sent to a server"],
              ["Notebook (e.g. Google Colab)", "Cloud machine", "Data science, charts, GPUs", "Needs a Google account; heavier for beginners"],
              ["Cloud IDE / local IDE", "Cloud workspace or your laptop", "Bigger projects, files, pip", "Account or installation; more setup"],
            ],
          },
        ],
      },
      {
        heading: "A beginner's checklist",
        blocks: [
          {
            type: "list",
            ordered: true,
            items: [
              "No sign-up. You should be able to type and run within seconds.",
              "input() that works interactively, not only through a pre-filled box.",
              "Readable errors: the line number, and ideally a hint for common mistakes.",
              "Works on a phone, with a layout designed for it rather than a shrunken desktop.",
              "A recent Python 3 version, so tutorials and f-strings work as written.",
              "Your work is saved, at least in the browser, and you can download the .py file.",
              "Protection from infinite loops: a Stop button and a time limit.",
              "Clear about limits, such as which libraries you can import.",
            ],
          },
        ],
      },
      {
        heading: "How Mentr's compiler scores on that checklist",
        blocks: [
          {
            type: "table",
            caption: "Mentr online Python compiler",
            headers: ["Checklist item", "Mentr"],
            rows: [
              ["No sign-up", "Yes"],
              ["Interactive input()", "Yes on modern browsers; Input box fallback on older ones"],
              ["Readable errors", "Trimmed traceback, clickable line, plain-English hints"],
              ["Phone layout", "Code / Input / Output tabs, bottom Run bar"],
              ["Python version", "3.14.2 (CPython via Pyodide)"],
              ["Saving", "Autosave in this browser, download main.py, open .py up to 200 KB"],
              ["Loop protection", "Stop button, 15-second limit, 200,000-character output cap"],
              ["Libraries", "357 Pyodide packages incl. numpy, pandas; no pip, tkinter or turtle"],
            ],
          },
          {
            type: "paragraph",
            text: "Where it is not the best choice: data science with charts (plots aren't displayed yet; a notebook is better), anything needing pip packages, and multi-file projects. For those, use a notebook or install Python.",
          },
          {
            type: "cta",
            title: "See for yourself",
            text: "Runs in your browser in seconds. Free, no account.",
            label: "Try Mentr's Python compiler",
            href: COMPILER,
          },
        ],
      },
    ],
    faqs: [
      {
        question: "What is the best free online Python compiler for beginners?",
        answer: "One that needs no sign-up, supports interactive input(), explains errors clearly and works on a phone. A browser-based compiler such as Mentr's ticks those boxes; a notebook like Colab is better for data science.",
      },
      {
        question: "Is a browser-based Python compiler as good as installed Python?",
        answer: "For learning, yes: it runs the same CPython interpreter. It can't open desktop windows, use pip, or run for long periods, so install Python for bigger projects.",
      },
      {
        question: "Is my code private in an online compiler?",
        answer: "In a browser-based compiler the code runs on your device and isn't sent to a server. In a server-based compiler it is uploaded to run.",
      },
    ],
    relatedLinks: related([{ label: "Python compiler for mobile", href: "/blog/python-compiler-for-mobile" }]),
  },

  "is-python-compiled-or-interpreted": {
    slug: "is-python-compiled-or-interpreted",
    publishedAt: "2026-10-07",
    updatedAt: "2026-10-07",
    readTimeMinutes: 6,
    author: AUTHOR,
    intro:
      "It's one of the most common Python interview and exam questions, and the honest answer is “both”. The standard Python, CPython, first compiles your code to bytecode and then interprets that bytecode. Here's what that means in plain terms, and how to see it for yourself. Beginners who want the lessons first can start free at mentr.in/learnpython.",
    sections: [
      {
        heading: "The short answer",
        blocks: [
          {
            type: "list",
            ordered: true,
            items: [
              "Compile: CPython reads your .py source and compiles it into bytecode, a compact set of instructions for a virtual machine.",
              "Interpret: CPython's interpreter loop runs those bytecode instructions one by one.",
            ],
          },
          {
            type: "paragraph",
            text: "So Python is usually called an interpreted language, because there is no separate step that turns your program into a machine-code .exe. Under the hood there is still a compiler; it just runs automatically every time.",
          },
        ],
      },
      {
        heading: "See the bytecode yourself",
        blocks: [
          {
            type: "paragraph",
            text: "Python ships with the dis module, which shows the bytecode for any function. Paste this into an online Python compiler and press Run:",
          },
          { type: "code", code: "import dis\n\ndef add(a, b):\n    return a + b\n\ndis.dis(add)" },
          {
            type: "paragraph",
            text: "You'll see instructions such as LOAD_FAST and RETURN_VALUE: that's what the interpreter actually executes. When you import a module, CPython also caches its bytecode in a __pycache__ folder as .pyc files so it doesn't recompile it next time.",
          },
        ],
      },
      {
        heading: "Compiled vs interpreted, side by side",
        blocks: [
          {
            type: "table",
            caption: "C vs Python (CPython)",
            headers: ["", "C (typical)", "Python (CPython)"],
            rows: [
              ["Output of compiling", "Machine code for one CPU", "Bytecode for the Python virtual machine"],
              ["When it compiles", "Once, before you run", "Automatically, each time (with .pyc caching)"],
              ["What runs it", "The CPU directly", "CPython's interpreter loop"],
              ["Portability", "Rebuild per platform", "Same source runs anywhere Python runs"],
            ],
          },
          {
            type: "paragraph",
            text: "Other implementations differ: PyPy adds a just-in-time (JIT) compiler that turns hot code into machine code, and recent CPython versions include an experimental JIT that is off by default.",
          },
        ],
      },
      {
        heading: "So why is it called an “online Python compiler”?",
        blocks: [
          {
            type: "paragraph",
            text: "Because that's what people search for. Technically, an online Python compiler is an online Python interpreter. Mentr's runs the standard CPython 3.14 interpreter, itself compiled to WebAssembly so it can run inside your browser. That's a neat twist: a C program (CPython) compiled to WebAssembly, interpreting bytecode compiled from your Python.",
          },
          {
            type: "cta",
            title: "Run dis in your browser",
            text: "Try the example above in Mentr's free online Python compiler.",
            label: "Open the compiler",
            href: COMPILER,
          },
        ],
      },
    ],
    faqs: [
      {
        question: "Is Python a compiled or an interpreted language?",
        answer: "Both. CPython compiles source code to bytecode, then interprets the bytecode. It is usually called interpreted because there is no separate build step that produces machine code.",
      },
      {
        question: "What is a .pyc file?",
        answer: "A cached bytecode file. When a module is imported, CPython saves its compiled bytecode in __pycache__ so later imports skip recompiling.",
      },
      {
        question: "Does Python have a JIT compiler?",
        answer: "PyPy does. Recent CPython versions also include an experimental JIT, which is off by default.",
      },
    ],
    relatedLinks: related([{ label: "How to run Python code online", href: "/blog/how-to-run-python-code-online" }]),
  },
};
