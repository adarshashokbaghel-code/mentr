/**
 * Class notes content for Learn videos — derived from mentoring scripts
 * (not PPT decks). Simpler wording for Class 3–5.
 */

import { getLessonContent, getLessonMeta } from "./learn-content";

export type LessonNotesDefinition = {
  term: string;
  meaning: string;
};

export type LessonNotesPanel = {
  title: string;
  body: string[];
};

export type LessonNotesDoc = {
  moduleId: string;
  title: string;
  unitLabel: string;
  chapterLabel: string;
  level: string;
  filename: string;
  bigIdea: string;
  definitions: LessonNotesDefinition[];
  panels: LessonNotesPanel[];
  remember: string[];
  checkYourself: { q: string; a: string };
  dinoLine: string;
};

export const A1_LESSON_NOTES: LessonNotesDoc = {
  moduleId: "A1",
  title: "What Is a Computer?",
  unitLabel: "CS Unit 1 · How Computers Work",
  chapterLabel: "Chapter 1 of 5",
  level: "Easy",
  filename: "Mentr-Learn-A1-What-Is-a-Computer-Notes.pdf",
  bigIdea:
    "A computer is a special machine with three jobs: input, process, and output. If a machine does all three, we can call it a computer.",
  definitions: [
    {
      term: "Computer",
      meaning:
        "A machine that takes information in, works on it, and shows something out.",
    },
    {
      term: "Input",
      meaning: "Something goes into the machine — like typing words on a phone.",
    },
    {
      term: "Process",
      meaning:
        "The machine thinks or works on the information in the middle.",
    },
    {
      term: "Output",
      meaning:
        "Something comes out — an answer, a picture, a sound, or a message on a screen.",
    },
  ],
  panels: [
    {
      title: "Story 1 — Sending a message (computer)",
      body: [
        "You type a message to a friend. That is INPUT — words going in.",
        "The phone gets the message ready to send. That is PROCESS.",
        "Your friend sees it on their screen. That is OUTPUT.",
        "Phone, laptop, and tablet all do these three jobs. They are computers.",
      ],
    },
    {
      title: "Story 2 — Switching on a bulb (not a computer)",
      body: [
        "You press a switch and a bulb lights up. Useful!",
        "But the bulb is not taking many kinds of input or thinking about a message or a game.",
        "It mainly turns light on or off.",
        "A simple bulb or a toaster that only heats bread is not a computer.",
      ],
    },
    {
      title: "Quick game — computer or not?",
      body: [
        "Laptop — YES (computer).",
        "Phone — YES (computer).",
        "Tablet — YES (computer).",
        "Toaster — NO (only heats bread).",
        "Lamp — NO (not a computer).",
      ],
    },
  ],
  remember: [
    "Three jobs: Input -> Process -> Output.",
    "Phone, laptop, tablet = computers.",
    "Toaster, lamp, bicycle bell = not computers.",
    "Computers take input, process it, and show smarter output.",
  ],
  checkYourself: {
    q: "Which one is a computer: a laptop, a lamp, or a bicycle bell?",
    a: "Laptop — it takes input, processes, and shows output.",
  },
  dinoLine: "You learned Chapter 1. Brilliant work, champ!",
};

export const A2_LESSON_NOTES: LessonNotesDoc = {
  moduleId: "A2",
  title: "How Computers Understand Us",
  unitLabel: "CS Unit 1 · How Computers Work",
  chapterLabel: "Chapter 2 of 5",
  level: "Easy",
  filename: "Mentr-Learn-A2-How-Computers-Understand-Us-Notes.pdf",
  bigIdea:
    "Computers only understand two states — on and off — like a light switch. On is written as 1, off as 0. A row of 1s and 0s is called binary: the computer’s light-switch language.",
  definitions: [
    {
      term: "On / Off",
      meaning:
        "The only two states inside a computer — like a light switch that is up or down.",
    },
    {
      term: "1 and 0",
      meaning: "1 means ON. 0 means OFF. That is how we write the two states.",
    },
    {
      term: "Binary",
      meaning:
        "A pattern of ones and zeros. “Bi” means two — only two choices. It is the computer’s special language.",
    },
    {
      term: "Bit (tiny idea)",
      meaning:
        "One switch worth of information — a single 0 or 1. (You only need the idea for now.)",
    },
  ],
  panels: [
    {
      title: "The big secret",
      body: [
        "Computers do not speak Hindi or English inside.",
        "Everything is only ON or OFF.",
        "We write ON as 1 and OFF as 0.",
      ],
    },
    {
      title: "Three switches in a row",
      body: [
        "Imagine left, middle, and right light switches.",
        "Each switch is a 1 (on) or a 0 (off).",
        "Example: off, off, on → 0 0 1.",
        "Example: on, off, on → 1 0 1.",
      ],
    },
    {
      title: "Practice reading",
      body: [
        "0 0 1 → off, off, on.",
        "1 1 0 → on, on, off.",
        "1 0 1 → on, off, on.",
      ],
    },
    {
      title: "Why it matters",
      body: [
        "Photos, games, and messages become 0s and 1s inside the computer.",
        "Then the computer turns them back into pictures and sound for you.",
        "When you hear “binary,” think: light-switch language.",
      ],
    },
  ],
  remember: [
    "Only two states: on or off.",
    "ON = 1 · OFF = 0.",
    "Binary = a row of 1s and 0s (bi = two).",
    "101 on three lights means on, off, on.",
  ],
  checkYourself: {
    q: "If 1 means on, what does 101 mean on three lights?",
    a: "Left on, middle off, right on — on, off, on.",
  },
  dinoLine: "Chapter 2 done. Binary is light-switch language — excellent, champ!",
};

export const A3_LESSON_NOTES: LessonNotesDoc = {
  moduleId: "A3",
  title: "Input & Output Devices",
  unitLabel: "CS Unit 1 · How Computers Work",
  chapterLabel: "Chapter 3 of 5",
  level: "Easy",
  filename: "Mentr-Learn-A3-Input-Output-Devices-Notes.pdf",
  bigIdea:
    "A computer needs doors. Input devices bring information IN to the computer. Output devices send information OUT to you. Some clever devices, like a touchscreen, do both.",
  definitions: [
    {
      term: "Device",
      meaning: "A machine you can touch that is joined to a computer — like a door in or out.",
    },
    {
      term: "Input device",
      meaning:
        "Takes something from you and sends it IN — keyboard, mouse, microphone, camera.",
    },
    {
      term: "Output device",
      meaning:
        "Gives something back OUT to you — screen, speaker, printer.",
    },
    {
      term: "Both",
      meaning:
        "A device that takes in AND gives out — like a touchscreen or a headset with a mic.",
    },
  ],
  panels: [
    {
      title: "Input devices (IN)",
      body: [
        "Keyboard → you type letters and numbers.",
        "Mouse → you point and click.",
        "Microphone → it listens to your voice.",
        "Camera → it takes pictures and video.",
      ],
    },
    {
      title: "Output devices (OUT)",
      body: [
        "Screen → shows words, pictures, videos.",
        "Speaker → plays sound and music.",
        "Printer → puts your work on paper.",
      ],
    },
    {
      title: "The super trick",
      body: [
        "Ask: does it TAKE from me, or GIVE to me?",
        "Takes from me → input.",
        "Gives to me → output.",
        "Microphone listens (input). Speaker talks (output).",
      ],
    },
    {
      title: "Real life: a video call",
      body: [
        "Your camera and mic take your face and voice in (input).",
        "The computers process it and send it across the internet.",
        "Nani’s screen and speaker show and play you (output).",
        "At home: TV remote = input, TV screen = output.",
      ],
    },
  ],
  remember: [
    "Input = comes IN. Output = goes OUT.",
    "Input: keyboard, mouse, microphone, camera.",
    "Output: screen, speaker, printer.",
    "Touchscreen = both input and output.",
  ],
  checkYourself: {
    q: "Is a speaker input or output? Explain in one sentence.",
    a: "Output — a speaker gives sound out to you.",
  },
  dinoLine: "Chapter 3 done. You know the doors of a computer — super work, champ!",
};

export const A4_LESSON_NOTES: LessonNotesDoc = {
  moduleId: "A4",
  title: "How Websites Talk to Each Other",
  unitLabel: "CS Unit 1 · How Computers Work",
  chapterLabel: "Chapter 4 of 5",
  level: "Easy",
  filename: "Mentr-Learn-A4-How-Websites-Talk-Notes.pdf",
  bigIdea:
    "The internet is not one big box — it is millions of computers joined together, asking and answering. A website is like a shop with an address (a URL). Wi-Fi and mobile data are the roads that carry the questions and answers.",
  definitions: [
    {
      term: "Internet",
      meaning: "Millions of computers all over the world, joined together, asking and answering.",
    },
    {
      term: "Server",
      meaning: "A computer that keeps websites and videos ready, and answers when someone asks.",
    },
    {
      term: "URL",
      meaning: "A website’s address — like mentr.com. You type it at the top of the screen.",
    },
    {
      term: "Request",
      meaning: "The message your device sends: “Please send me this page!”",
    },
  ],
  panels: [
    {
      title: "Askers and answerers",
      body: [
        "Askers: your tablet, phone, or laptop.",
        "Answerers: servers, far away, awake day and night.",
        "Internet = asking and answering, again and again.",
      ],
    },
    {
      title: "A website is like a shop",
      body: [
        "Your home has an address so people can find it.",
        "Every website has an address too — a URL.",
        "mentr.com → the name (which shop) + the ending (.com).",
      ],
    },
    {
      title: "The roads",
      body: [
        "Wi-Fi → a road from a small box called a router.",
        "Mobile data → a road through big towers.",
        "Roads only carry messages. They don’t make the website.",
      ],
    },
    {
      title: "The trip of a web page",
      body: [
        "1. You type the address.",
        "2. Your device asks (a request).",
        "3. The server finds the page.",
        "4. The server sends it back.",
        "5. The page appears — usually in less than a second!",
      ],
    },
  ],
  remember: [
    "Internet = many computers asking and answering.",
    "Website = shop · URL = its address.",
    "Wi-Fi and mobile data = roads.",
    "Type → ask → page appears.",
  ],
  checkYourself: {
    q: "When you open a website, what happens first: the page appears, or your device asks for it?",
    a: "Your device asks first. Then the server answers and the page appears.",
  },
  dinoLine: "Chapter 4 done. You know the secret trip of a website — superb, champ!",
};

export const A5_LESSON_NOTES: LessonNotesDoc = {
  moduleId: "A5",
  title: "Being Safe Online",
  unitLabel: "CS Unit 1 · How Computers Work",
  chapterLabel: "Chapter 5 of 5",
  level: "Easy",
  filename: "Mentr-Learn-A5-Being-Safe-Online-Notes.pdf",
  bigIdea:
    "Online, anyone can pretend to be anyone. Three rules keep you safe: private info stays private, passwords are secret (even from friends), and if a chat feels odd — stop, don’t reply, and tell a trusted adult.",
  definitions: [
    {
      term: "Private info",
      meaning: "Your full name, school, home address, and phone number. Together they are a map to your door.",
    },
    {
      term: "Password",
      meaning: "A secret key that locks your games and accounts. Only you and your parents know it.",
    },
    {
      term: "Red flag",
      meaning: "A warning sign in a chat — like asking for photos, where you live, or saying “don’t tell your parents”.",
    },
    {
      term: "Trusted adult",
      meaning: "A grown-up who keeps you safe: mum or dad, your teacher, or your nani and nana.",
    },
  ],
  panels: [
    {
      title: "Rule 1 · Private info stays private",
      body: [
        "Never post: full name, school, home address, phone number.",
        "One piece looks small — together they lead a stranger to your door.",
        "OK to share: favourite colour, a game nickname, your drawing.",
      ],
    },
    {
      title: "Safe or unsafe?",
      body: [
        "“I love mango ice cream!” → Safe.",
        "“I’m Riya from Green Park School, I live on Rose Street” → Unsafe.",
        "A photo of your drawing → Safe (no school badge or house number in it).",
      ],
    },
    {
      title: "Rule 2 · Passwords are secret",
      body: [
        "Keep it secret from everyone — even your best friend.",
        "Weak: 1234, or your own name. Easy to guess!",
        "Strong: long and mixed — words, numbers, symbols. Make your own.",
      ],
    },
    {
      title: "Rule 3 · Odd chat? Tell a trusted adult",
      body: [
        "Red flags: asks for photos, asks where you live, says “don’t tell”.",
        "1. Stop.  2. Don’t reply.  3. Tell a grown-up you trust.",
        "You are never in trouble for telling. Telling is brave!",
      ],
    },
  ],
  remember: [
    "Private info stays private.",
    "Passwords are secret, even from friends.",
    "Odd chat → stop, don’t reply, tell a trusted adult.",
    "Never post: full name, school, home address.",
  ],
  checkYourself: {
    q: "A new friend online asks for your home address. What should you do?",
    a: "Don’t share it. Tell a trusted adult (like mum, dad, or your teacher) right away.",
  },
  dinoLine: "Chapter 5 done and Unit 1 complete — you’re a safe online champ!",
};

const NOTES_BY_MODULE: Record<string, LessonNotesDoc> = {
  A1: A1_LESSON_NOTES,
  A2: A2_LESSON_NOTES,
  A3: A3_LESSON_NOTES,
  A4: A4_LESSON_NOTES,
  A5: A5_LESSON_NOTES,
};

function notesFromBank(moduleId: string): LessonNotesDoc | null {
  const notes = getLessonContent(moduleId)?.notes;
  const meta = getLessonMeta(moduleId);
  if (!notes || !meta) return null;
  const titleSlug = meta.title
    .replace(/[^A-Za-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return {
    moduleId: meta.moduleId,
    title: meta.title,
    unitLabel: meta.unitLabel,
    chapterLabel: meta.chapterLabel,
    level: meta.level,
    filename: `Mentr-Learn-${meta.moduleId}-${titleSlug}-Notes.pdf`,
    ...notes,
  };
}

export function getLessonNotes(moduleId: string): LessonNotesDoc | null {
  return NOTES_BY_MODULE[moduleId] ?? notesFromBank(moduleId);
}

export function hasLessonNotes(moduleId: string): boolean {
  return moduleId in NOTES_BY_MODULE || Boolean(getLessonContent(moduleId)?.notes);
}
