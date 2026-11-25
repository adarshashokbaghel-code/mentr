import type { ArticleContent } from "./types";

const COMPILER = "/openpythoncompiler";
const HOW = "/openpythoncompiler/how-it-works";
const COURSE = "/learnpython";

function related(extra: { label: string; href: string }[] = []) {
  return [
    { label: "Online Python compiler (free IDE)", href: COMPILER },
    { label: "How the browser Python IDE works", href: HOW },
    { label: "Learn Python free", href: COURSE },
    ...extra,
  ];
}

const AUTHOR = "Mentr Engineering";
const PUBLISHED = "2026-11-25";

export const COMPILER_SEO_NOV2026: Record<string, ArticleContent> = {
  "online-python-ide": {
    slug: "online-python-ide",
    publishedAt: PUBLISHED,
    updatedAt: PUBLISHED,
    readTimeMinutes: 8,
    author: AUTHOR,
    intro:
      "An online Python IDE is more than a Run button. Students searching for an online Python IDE want an editor that feels serious, folders for real imports, a way to share work, and code that runs without installing Python. This guide explains what that stack looks like in 2026, and how Mentr’s free browser IDE covers it.",
    sections: [
      {
        heading: "Compiler vs IDE — what people actually mean",
        blocks: [
          {
            type: "image",
            src: "/blog/blog-online-python-ide.jpg",
            alt: "Online Python IDE with folder tree, code editor, and output panel",
            caption: "A browser Python IDE: explorer + Monaco editor + Run/output — not just a single textarea.",
          },
          {
            type: "paragraph",
            text: "Search engines still rank “online Python compiler” highest, but the intent behind “online Python IDE” is clearer: multi-file projects, find/replace, share, download. A playground that only has one box labelled main.py is a compiler UI. An IDE adds structure.",
          },
          {
            type: "table",
            caption: "Compiler UI vs online Python IDE",
            headers: ["Need", "Basic compiler", "Online IDE"],
            rows: [
              ["Editor", "Textarea", "Monaco / VS Code–class editing"],
              ["Files", "One buffer", "Folders, rename, move"],
              ["Imports", "Single file", "from package.module import …"],
              ["Share", "Copy-paste", "Permalink /c/…"],
              ["Portable project", "Download one .py", "Zip import/export"],
            ],
          },
        ],
      },
      {
        heading: "What to look for in a free online Python IDE",
        blocks: [
          {
            type: "list",
            ordered: true,
            items: [
              "Real CPython in the browser (not a toy subset) so errors match school/college exams.",
              "Interactive input() that pauses like a terminal.",
              "Folders and package-style imports for Class 11–12 and early college work.",
              "Share link so a teacher can open the exact snapshot.",
              "Works on phone tabs as well as laptop split panes.",
              "No forced sign-up for the first Run.",
            ],
          },
          {
            type: "callout",
            title: "Privacy note",
            text: "In a browser-based IDE, Run executes on the student’s device. Share links store a snapshot you choose to publish — they are not a live sync of every keystroke.",
          },
        ],
      },
      {
        heading: "How Mentr’s online Python IDE is put together",
        blocks: [
          {
            type: "paragraph",
            text: "Mentr runs CPython 3.14 via Pyodide (WebAssembly) inside a Web Worker. The UI is Monaco plus a file explorer. Pressing Run mounts the workspace into an in-memory filesystem so imports resolve. Examples, zip IO, and Share sit on top of that engine.",
          },
          {
            type: "cta",
            title: "Try the IDE in one click",
            text: "Open the free online Python IDE — Examples → Folders + imports is the fastest demo.",
            label: "Open online Python IDE",
            href: COMPILER,
          },
        ],
      },
      {
        heading: "Five-minute classroom walkthrough",
        blocks: [
          {
            type: "list",
            ordered: true,
            items: [
              "Open the IDE and pick Examples → Folders + imports.",
              "Run. Show greetings/ and maths/ in the explorer.",
              "Rename a module and fix the import if needed.",
              "Share the link; open it in an incognito window (read-only).",
              "Fork, then Export zip for the student’s pen drive.",
            ],
          },
          {
            type: "paragraph",
            text: "For the engineering deep dive — Workers, SharedArrayBuffer, share API — use the how-it-works article linked below. It has a simple session brief and a full technical path.",
          },
        ],
      },
    ],
    faqs: [
      {
        question: "Is an online Python IDE the same as an online Python compiler?",
        answer:
          "People use both phrases. Technically a compiler/interpreter runs code; an IDE adds editor quality, files, and project tools. Mentr’s product is an online Python IDE built on a browser CPython runtime.",
      },
      {
        question: "Do I need to install Python?",
        answer: "No. The first visit downloads the WebAssembly runtime once; later visits use the browser cache.",
      },
      {
        question: "Can I use folders and imports?",
        answer: "Yes. Create folders and files, then import across packages. Zip import/export is supported for whole projects.",
      },
    ],
    relatedLinks: related([
      { label: "Share Python code online", href: "/blog/share-python-code-online" },
      { label: "Python in the browser (WebAssembly)", href: "/blog/python-in-browser-webassembly" },
    ]),
  },

  "share-python-code-online": {
    slug: "share-python-code-online",
    publishedAt: PUBLISHED,
    updatedAt: PUBLISHED,
    readTimeMinutes: 7,
    author: AUTHOR,
    intro:
      "Emailing main.py fails in class. WhatsApp strips formatting. Screenshots hide bugs. The search “share Python code online” is students and teachers looking for a link that opens the same program, runnable, without GitHub. Here is a clean pattern that works on school Wi‑Fi.",
    sections: [
      {
        heading: "Why copy-paste breaks homework review",
        blocks: [
          {
            type: "image",
            src: "/blog/blog-share-python-code.jpg",
            alt: "Share Python code online with a short browser link between two devices",
            caption: "A share link carries the snapshot — editor, folders, and stdin — to another browser.",
          },
          {
            type: "list",
            items: [
              "Indentation dies in chat apps.",
              "Teachers cannot Run the student’s exact version.",
              "Multi-file projects do not fit in one message.",
              "Drive links still require the reviewer to install or re-upload.",
            ],
          },
        ],
      },
      {
        heading: "What a good share link must include",
        blocks: [
          {
            type: "table",
            caption: "Minimum payload for sharing Python online",
            headers: ["Piece", "Why"],
            rows: [
              ["Active file content", "What they were editing"],
              ["Full workspace (optional)", "Packages and imports"],
              ["stdin sample", "So input() demos replay"],
              ["Short URL", "Easy to read aloud in class"],
              ["Read-only + fork", "Prevent accidental edits; allow practice"],
            ],
          },
          {
            type: "paragraph",
            text: "Mentr’s Share button posts a snapshot to /api/python-compiler/share and returns /c/<id>. Opening the link loads the online Python IDE in read-only mode. Fork unlocks editing on the viewer’s device.",
          },
        ],
      },
      {
        heading: "How to share from Mentr in 20 seconds",
        blocks: [
          {
            type: "list",
            ordered: true,
            items: [
              "Open the online Python compiler and finish your program (folders included).",
              "Click Share — the link is copied.",
              "Paste into Classroom, WhatsApp, or email.",
              "Recipient opens /c/…, presses Run, then Fork if they need to change it.",
            ],
          },
          {
            type: "cta",
            title: "Create a share link now",
            text: "Write a tiny program, hit Share, and open the link in another tab to see read-only + Fork.",
            label: "Open compiler and Share",
            href: COMPILER,
          },
        ],
      },
      {
        heading: "Share vs GitHub vs Colab for school",
        blocks: [
          {
            type: "paragraph",
            text: "GitHub is right for portfolios. Colab is right for notebooks and GPUs. For Class 8–12 homework and lab viva prep, a one-click share into a browser IDE wins on friction: no account required for the viewer to Run.",
          },
          {
            type: "callout",
            title: "Safety",
            text: "Only share what you intend to publish. Treat the link like a document you emailed — anyone with it can open the snapshot.",
          },
        ],
      },
    ],
    faqs: [
      {
        question: "How do I share Python code online without GitHub?",
        answer:
          "Use a browser IDE that creates a snapshot link. In Mentr, click Share to copy a /c/… URL that opens the same code (and folders) in another browser.",
      },
      {
        question: "Can the other person edit my code?",
        answer: "Shared links open read-only. They can Fork to edit a copy on their device without changing your snapshot.",
      },
      {
        question: "Does sharing upload my code to run on a server?",
        answer:
          "The snapshot is stored so the link can reload. Running still happens in the viewer’s browser via WebAssembly, not as remote code execution on a shared container farm.",
      },
    ],
    relatedLinks: related([
      { label: "Online Python IDE guide", href: "/blog/online-python-ide" },
      { label: "Online Python compiler with input()", href: "/blog/online-python-compiler-with-input" },
    ]),
  },

  "python-in-browser-webassembly": {
    slug: "python-in-browser-webassembly",
    publishedAt: PUBLISHED,
    updatedAt: PUBLISHED,
    readTimeMinutes: 9,
    author: AUTHOR,
    intro:
      "“Python in the browser” sounds like marketing until you see WebAssembly. This article is the GEO-friendly technical explainer for builders and advanced students: how CPython becomes a .wasm binary, why a Web Worker matters, and how an online Python compiler stays free at classroom scale.",
    sections: [
      {
        heading: "The short architecture",
        blocks: [
          {
            type: "image",
            src: "/blog/blog-python-in-browser.jpg",
            alt: "Diagram of Python running in the browser with WebAssembly and a Web Worker",
            caption: "Ship CPython once as WebAssembly, run it in a Worker, keep the UI thread free.",
          },
          {
            type: "list",
            ordered: true,
            items: [
              "Compile CPython to WebAssembly (Pyodide).",
              "Load it in a Web Worker so infinite loops don’t freeze the tab.",
              "Bridge stdout/stderr/stdin to the page.",
              "Optionally mount a virtual filesystem for multi-file imports.",
            ],
          },
          {
            type: "paragraph",
            text: "Mentr self-hosts Pyodide 314.0.7 (CPython 3.14.2) under /pyodide/v314.0.7/ with immutable caching, and falls back to jsDelivr if needed.",
          },
        ],
      },
      {
        heading: "Why this beats a container per Run click",
        blocks: [
          {
            type: "table",
            caption: "Server sandbox vs browser WASM",
            headers: ["", "Server containers", "Browser Pyodide"],
            rows: [
              ["Who pays for CPU", "You, per click", "Student’s device"],
              ["Latency", "Network RTT", "In-process after first load"],
              ["input()", "Request/response chat", "SharedArrayBuffer pause"],
              ["Abuse surface", "RCE sandboxing job", "WASM sandbox in the browser"],
            ],
          },
          {
            type: "callout",
            title: "Session line",
            text: "“We don’t run strangers’ homework on our servers. We ship the interpreter once.”",
          },
        ],
      },
      {
        heading: "input() and SharedArrayBuffer",
        blocks: [
          {
            type: "paragraph",
            text: "Python expects blocking stdin. Browsers are async. The worker blocks on Atomics.wait against a SharedArrayBuffer while the page writes the typed line and notifies. That requires cross-origin isolation headers on the compiler routes.",
          },
          {
            type: "cta",
            title: "Read the full build notes",
            text: "Simple demo script + technical deep dive, including Monaco, folders, and share API.",
            label: "Open how it works",
            href: HOW,
          },
        ],
      },
      {
        heading: "Limits you should mention on stage",
        blocks: [
          {
            type: "list",
            items: [
              "First visit downloads ~6.3 MB gzipped.",
              "No tkinter/turtle windows.",
              "Only packages built for Pyodide/WASM.",
              "15 s run cap in the public compiler.",
            ],
          },
          {
            type: "cta",
            title: "See it running",
            text: "Open the free compiler and press Run on the Folders + imports example.",
            label: "Open Python compiler",
            href: COMPILER,
          },
        ],
      },
    ],
    faqs: [
      {
        question: "What is Pyodide?",
        answer: "An open-source port of CPython to WebAssembly, so real Python runs inside a browser tab.",
      },
      {
        question: "Is browser Python slower than installed Python?",
        answer: "Startup has a one-time download. Short student programs feel instant afterward. Heavy numeric jobs still belong on a laptop install or Colab.",
      },
      {
        question: "Can I build my own online Python compiler this way?",
        answer:
          "Yes: Worker + Pyodide + UI is the core. Mentr’s how-it-works page documents the production details we use in class demos.",
      },
    ],
    relatedLinks: related([
      { label: "Online Python IDE", href: "/blog/online-python-ide" },
      { label: "Is Python compiled or interpreted?", href: "/blog/is-python-compiled-or-interpreted" },
    ]),
  },

  "online-python-compiler-for-students-india": {
    slug: "online-python-compiler-for-students-india",
    publishedAt: PUBLISHED,
    updatedAt: PUBLISHED,
    readTimeMinutes: 8,
    author: AUTHOR,
    intro:
      "Parents and students in India search for an online Python compiler that works on a phone, survives patchy Wi‑Fi after the first load, needs no credit card, and matches what CBSE / state-board labs expect from CPython. This GEO guide is written for that intent — Bengaluru, Delhi NCR, Mumbai, Hyderabad, and every Tier-2 school lab with Chromebooks.",
    sections: [
      {
        heading: "What Indian school searches usually want",
        blocks: [
          {
            type: "image",
            src: "/blog/blog-python-compiler-students-india.jpg",
            alt: "Students in India using an online Python compiler on phone and laptop",
            caption: "Same compiler on phone tabs and laptop split view — common in Indian school and coaching setups.",
          },
          {
            type: "list",
            items: [
              "No install on shared school PCs.",
              "Works on Android Chrome for tuitions at home.",
              "input() for the Class 11–12 practical-style programs.",
              "Clear errors before the viva.",
              "A link to show the teacher (share) instead of a pendrive.",
            ],
          },
        ],
      },
      {
        heading: "Checklist for an online Python compiler for students",
        blocks: [
          {
            type: "table",
            caption: "Student checklist (India)",
            headers: ["Check", "Why it matters"],
            rows: [
              ["Free, no sign-up to Run", "Labs and borrowed phones"],
              ["CPython version shown", "Matches textbook examples"],
              ["Mobile tabs", "Homework on the commute"],
              ["Folders + imports", "Projects beyond one file"],
              ["Share link", "Submit without WhatsApp indent bugs"],
              ["Offline-ish after cache", "Second open works on weak Wi‑Fi"],
            ],
          },
          {
            type: "paragraph",
            text: "Mentr’s compiler ticks those boxes and pairs with a free Learn Python path if the student needs lessons, not only a Run button.",
          },
        ],
      },
      {
        heading: "Suggested practice flow for board practicals",
        blocks: [
          {
            type: "list",
            ordered: true,
            items: [
              "Type the program in the online compiler (or Import a .py from the lab).",
              "Run with sample input() answers.",
              "Use Visualize if a loop is confusing.",
              "Share the link with the teacher or Export zip for the record file.",
            ],
          },
          {
            type: "cta",
            title: "Open the free student compiler",
            text: "No app store. No card. Works in Chrome on Android and on lab desktops.",
            label: "Start coding Python online",
            href: COMPILER,
          },
        ],
      },
      {
        heading: "When to install Python anyway",
        blocks: [
          {
            type: "paragraph",
            text: "Install desktop Python for tkinter GUIs, long data jobs, or pip packages outside the Pyodide set. For everyday Class 9–12 practice and coaching homework, the browser IDE is enough.",
          },
          {
            type: "cta",
            title: "Prefer guided lessons?",
            text: "Short free Python course with the same browser runtime underneath.",
            label: "Learn Python free",
            href: COURSE,
          },
        ],
      },
    ],
    faqs: [
      {
        question: "What is the best free online Python compiler for students in India?",
        answer:
          "One that runs real CPython in the browser, supports input(), works on phones, and needs no paid account. Mentr’s online Python compiler is built for that school and coaching use case.",
      },
      {
        question: "Can I use it offline?",
        answer:
          "After the first visit caches the runtime, many reloads work with weak connectivity. Fully offline first installs still need a download.",
      },
      {
        question: "Is this allowed for CBSE practical practice?",
        answer:
          "It is a practice environment using standard CPython behaviour. Always follow your school’s exam rules for the official practical exam day.",
      },
    ],
    relatedLinks: related([
      { label: "Python compiler for mobile", href: "/blog/python-compiler-for-mobile" },
      { label: "Best free online Python compiler for beginners", href: "/blog/best-free-online-python-compiler-for-beginners" },
    ]),
  },

  "online-python-compiler-with-numpy": {
    slug: "online-python-compiler-with-numpy",
    publishedAt: PUBLISHED,
    updatedAt: PUBLISHED,
    readTimeMinutes: 6,
    author: AUTHOR,
    intro:
      "Many “free online Python compilers” fail the moment you type import numpy. Students searching online Python compiler with numpy want arrays without Anaconda. Here is how browser compilers load scientific packages, and how to try it safely.",
    sections: [
      {
        heading: "Why numpy is the deal-breaker keyword",
        blocks: [
          {
            type: "paragraph",
            text: "School projects, polytechnic labs, and first-year engineering all hit numpy early. If the compiler only has the standard library, students bounce to Colab — even when they only needed five lines.",
          },
          {
            type: "code",
            code: "import numpy as np\n\na = np.array([1, 2, 3, 4])\nprint(a.mean(), a.std())",
          },
        ],
      },
      {
        heading: "How browser compilers install numpy",
        blocks: [
          {
            type: "paragraph",
            text: "Pyodide-based compilers detect imports and fetch WASM-built wheels (often from a CDN) on first use, then cache them. That is not the same as pip on your laptop — only packages built for the Pyodide distribution work.",
          },
          {
            type: "callout",
            title: "Mentr behaviour",
            text: "On Run, the worker calls loadPackagesFromImports. Status shows package prep. Hundreds of packages including numpy, pandas, scipy, and sympy are available.",
          },
          {
            type: "cta",
            title: "Run numpy in your browser",
            text: "Paste the snippet above into the free compiler and press Run. First numpy fetch is cached afterward.",
            label: "Open Python compiler",
            href: COMPILER,
          },
        ],
      },
      {
        heading: "When Colab is still better",
        blocks: [
          {
            type: "list",
            items: [
              "GPU / long training loops",
              "Huge CSVs that should not live in a browser tab",
              "Packages not built for Pyodide",
            ],
          },
          {
            type: "paragraph",
            text: "For homework-sized numpy, a browser IDE is faster to open and easier to Share with a teacher.",
          },
        ],
      },
    ],
    faqs: [
      {
        question: "Does the online Python compiler support numpy?",
        answer: "Mentr’s does. Import numpy and Run — the package downloads once into the browser cache.",
      },
      {
        question: "Can I pip install anything?",
        answer: "No. Only packages available in the Pyodide build. Unsupported imports raise ModuleNotFoundError with an explanation.",
      },
    ],
    relatedLinks: related([
      { label: "Online Python IDE", href: "/blog/online-python-ide" },
      { label: "How Python runs in the browser", href: "/blog/python-in-browser-webassembly" },
    ]),
  },

  "multi-file-python-online": {
    slug: "multi-file-python-online",
    publishedAt: PUBLISHED,
    updatedAt: PUBLISHED,
    readTimeMinutes: 7,
    author: AUTHOR,
    intro:
      "Single-file demos teach syntax. Multi-file Python online teaches packages — the skill viva and internships actually need. If you searched for folders, modules, or “import from another file online”, this walkthrough is for you.",
    sections: [
      {
        heading: "The first multi-file program",
        blocks: [
          {
            type: "paragraph",
            text: "Create a greetings folder with hello.py, a maths folder with score.py, and a main.py that imports both. In Mentr, Examples → Folders + imports builds that layout for you.",
          },
          {
            type: "code",
            code: "from greetings.hello import hello\nfrom maths.score import average\n\nprint(hello(\"Aarav\"))\nprint(\"Average\", average([18, 20, 16]))",
          },
          {
            type: "cta",
            title: "Load the folders example",
            text: "One click seeds the workspace. Press Run, then rename or move a file to see the explorer tools.",
            label: "Open compiler",
            href: COMPILER,
          },
        ],
      },
      {
        heading: "Zip import/export for labs",
        blocks: [
          {
            type: "paragraph",
            text: "Export zip downloads the workspace. Import zip rebuilds folders in the browser. That is the pendrive workflow without USB drivers on locked school images.",
          },
          {
            type: "list",
            items: [
              "Rename and Move keep imports honest — update paths when you relocate modules.",
              "Share sends the whole snapshot, not just main.py.",
              "__init__.py files mark packages the way CPython expects.",
            ],
          },
        ],
      },
      {
        heading: "Teaching tip",
        blocks: [
          {
            type: "callout",
            title: "Session line",
            text: "“A compiler becomes an IDE when files, share, and editor quality exist.”",
          },
          {
            type: "cta",
            title: "Architecture for your talk",
            text: "Simple demo script + technical Worker/FS notes on one page.",
            label: "How it works",
            href: HOW,
          },
        ],
      },
    ],
    faqs: [
      {
        question: "Can I import from another file in an online Python compiler?",
        answer:
          "Yes if the IDE mounts multiple files into the runtime. Mentr’s explorer + Run path supports package-style imports across folders.",
      },
      {
        question: "Do I need __init__.py?",
        answer: "For regular packages in this workspace model, empty __init__.py files are included in the demo layout so imports behave like desktop CPython.",
      },
    ],
    relatedLinks: related([
      { label: "Online Python IDE", href: "/blog/online-python-ide" },
      { label: "Share Python code online", href: "/blog/share-python-code-online" },
    ]),
  },
};
