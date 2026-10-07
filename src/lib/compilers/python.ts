import { COMPILER_TEMPLATES } from "@/components/learn-python/compiler/templates";
import { LEARN_PYTHON_PATH } from "@/lib/learn-python";
import { COMPILER_PATHS, howItWorksPath } from "./paths";
import type { CompilerDef } from "./types";

const example = (id: string) => {
  const t = COMPILER_TEMPLATES.find((x) => x.id === id);
  if (!t) throw new Error(`Unknown compiler template: ${id}`);
  return { title: t.label, code: t.code.trimEnd() };
};

export const PYTHON_COMPILER: CompilerDef = {
  id: "python",
  language: "Python",
  path: COMPILER_PATHS.python,
  howItWorksPath: howItWorksPath("python"),
  name: "Online Python compiler",
  runtime: { version: "3.14.2", engine: "Pyodide 314.0.7 (CPython compiled to WebAssembly)", download: "≈ 6.3 MB" },

  seo: {
    title: "Online Python Compiler — Free, Runs in Browser | Mentr",
    description:
      "Free online Python compiler by Mentr. Write and run Python 3.14 in your browser with real input(), clear errors and numpy. No sign-up, works on mobile.",
    primaryKeyword: "online python compiler",
    secondaryKeywords: [
      "python compiler",
      "python online compiler",
      "python compiler online",
      "run python online",
      "python interpreter online",
      "online python ide",
      "python editor online",
      "python 3 online compiler",
      "free python compiler",
      "mentr python compiler",
    ],
    longTailKeywords: [
      "online python compiler with input",
      "python compiler for mobile",
      "python compiler for android",
      "run python code in browser",
      "python compiler no sign up",
      "online python compiler for students",
      "python playground online",
      "python compiler with numpy",
    ],
    howItWorksTitle: "How We Built a Python Compiler That Runs in Your Browser",
    howItWorksDescription:
      "The full architecture of Mentr's online Python compiler: Pyodide (CPython on WebAssembly), Web Workers, interactive input() with SharedArrayBuffer, safety limits, and one layout for phone and desktop.",
    howItWorksKeywords: [
      "how online python compiler works",
      "browser based python compiler",
      "pyodide architecture",
      "python webassembly",
      "pyodide input sharedarraybuffer",
      "web worker python",
      "build an online compiler",
    ],
    howItWorksPublished: "2026-10-07",
    howItWorksUpdated: "2026-10-07",
  },

  landing: {
    heading: "A free online Python compiler that runs on your own device",
    intro: [
      "Mentr's online Python compiler runs real Python 3.14 inside your browser. Your code never goes to a server: Python is downloaded once, then every program runs on your phone or laptop. That makes it fast, private, and free for everyone.",
      "It is built for students and beginners. input() works like a real terminal, errors point to the exact line in plain English, and the layout switches to tabs on a phone so you can practise anywhere.",
    ],
    facts: [
      ["Python 3.14.2", "real CPython, not a lookalike"],
      ["0 servers", "run your code; it stays on your device"],
      ["≈ 6.3 MB", "one-time download, then cached"],
      ["₹0", "free, no sign-up, no install"],
    ],
    features: [
      { title: "Real input()", text: "When your program asks a question, type the answer right in the output and press Enter, just like a terminal." },
      { title: "Errors in plain English", text: "Tracebacks are trimmed to your code, the line is highlighted, and common mistakes come with a hint." },
      { title: "Works on phones", text: "Code, Input and Output tabs, a thumb-reach Run button, and no zoom-in when you type on iPhone or Android." },
      { title: "numpy, pandas and more", text: "Import a package and it loads automatically. 357 packages are available, including numpy, pandas, scipy and sympy." },
      { title: "Autosave", text: "Your code is saved in this browser as you type. Come back later and it is still there." },
      { title: "Open and download .py files", text: "Load a .py file (up to 200 KB) from your computer, or download your program as main.py." },
      { title: "Safe by default", text: "A Stop button, a 15-second limit and an output cap mean an infinite loop can't freeze the page." },
      { title: "A friendly editor", text: "Syntax colours, Tab for 4 spaces, auto-indent after a colon, and Ctrl/⌘ + Enter to run." },
    ],
    howTo: [
      { name: "Write your code", text: "Type Python in the main.py editor, or pick one of the ready examples from the Examples menu." },
      { name: "Press Run", text: "Click Run, or press Ctrl + Enter (⌘ + Enter on Mac). The first run downloads Python once; later runs start instantly." },
      { name: "Answer input()", text: "If your program calls input(), type your answer where the cursor blinks in the output and press Enter." },
      { name: "Fix errors", text: "If something breaks, read the hint and click the line number to jump straight to the mistake." },
      { name: "Save your work", text: "Your code autosaves in the browser. Use Download to keep a copy as main.py." },
    ],
    sections: [
      {
        id: "mobile",
        kicker: "Phone & tablet",
        heading: "A Python compiler for mobile that actually fits the screen",
        paragraphs: [
          "Most online compilers squeeze a desktop layout onto a phone. Here the same compiler switches to three tabs: Code, Input and Output. Pressing Run jumps to the output, and tapping an error line takes you back to the code.",
          "It runs in Chrome on Android and Safari on iPhone and iPad, with nothing to install. Text is 16 px on phones so the browser doesn't zoom in when you type.",
        ],
      },
      {
        id: "input",
        kicker: "input()",
        heading: "An online Python compiler with input() that feels like a terminal",
        paragraphs: [
          "Many browser compilers make you type every answer into a box before you press Run. On modern browsers this compiler pauses your program at input() and waits for you to type, so quizzes, games and calculators work the way they do on a laptop.",
          "On older browsers that can't pause, an Input box appears instead: write one answer per line, in order, and they are fed to input() as your program runs.",
        ],
      },
      {
        id: "compiler-or-interpreter",
        kicker: "Good to know",
        heading: "Is it a Python compiler or an interpreter?",
        paragraphs: [
          "Both, in a way. CPython first compiles your code into bytecode, then its interpreter runs that bytecode. \"Online Python compiler\" is simply the name most people search for. What runs here is the standard CPython 3.14 interpreter, compiled to WebAssembly so the browser can run it.",
        ],
      },
    ],
    examples: [example("input"), example("loop"), example("list")],
    limits: [
      "Windows and graphics libraries such as tkinter and turtle don't work in a browser.",
      "matplotlib imports, but plots are not displayed yet.",
      "Only packages built for Pyodide can be imported; pip install isn't available.",
      "Each run stops after 15 seconds.",
      "Code is saved in this browser only, so it won't follow you to another device.",
    ],
    learnCta: {
      title: "New to Python? Learn it free, then practise here",
      text: "Mentr's free Python course has short lessons, runnable examples, practice questions, five projects and a certificate.",
      label: "Start the free Python course",
      href: LEARN_PYTHON_PATH,
    },
  },

  faqs: [
    {
      question: "Is this online Python compiler free?",
      answer: "Yes. It is completely free, with no sign-up and nothing to install. Because your code runs on your own device, there is no server cost per run.",
    },
    {
      question: "Which Python version does it use?",
      answer: "Python 3.14.2. It is the real CPython interpreter, compiled to WebAssembly by the Pyodide project (version 314.0.7), so the language and standard library behave like Python on a laptop.",
    },
    {
      question: "Does it support input()?",
      answer: "Yes. On modern browsers your program pauses at input() and you type the answer straight into the output, then press Enter. On older browsers an Input box appears where you write one answer per line before running.",
    },
    {
      question: "Is my code sent to a server?",
      answer: "No. The page downloads the Python runtime once and your program runs entirely inside your browser. Your code is saved only in this browser's local storage. Packages such as numpy are downloaded from a CDN the first time you import them; the download doesn't include your code.",
    },
    {
      question: "Can I use it on my phone?",
      answer: "Yes. It works in Chrome on Android and Safari on iPhone and iPad. On small screens it switches to Code, Input and Output tabs with a Run button near your thumb. The first visit downloads about 6.3 MB; after that it loads from cache.",
    },
    {
      question: "Can I use numpy, pandas or other libraries?",
      answer: "Yes, for packages built for Pyodide. 357 are available, including numpy, pandas, scipy and sympy, and they load automatically when you import them. pip install, tkinter and turtle are not available, and matplotlib plots are not displayed yet.",
    },
    {
      question: "Why did my program stop after 15 seconds?",
      answer: "Each run has a 15-second limit so an accidental infinite loop can't freeze your browser. Time spent waiting for you to type an input() answer doesn't count. You can also press Stop at any time.",
    },
    {
      question: "Will my code be saved?",
      answer: "Yes, in this browser. It autosaves as you type and is still there when you come back. To keep a copy or move it to another device, use Download to save main.py.",
    },
    {
      question: "How does a Python compiler run inside a browser?",
      answer: "Python itself is compiled to WebAssembly, a fast format every modern browser can run. Your program runs in a background Web Worker so the page stays smooth. We explain the full architecture, step by step, in our engineering write-up.",
    },
  ],

  blogSlugs: [
    "how-to-run-python-code-online",
    "online-python-compiler-with-input",
    "python-compiler-for-mobile",
    "best-free-online-python-compiler-for-beginners",
    "is-python-compiled-or-interpreted",
  ],
};
