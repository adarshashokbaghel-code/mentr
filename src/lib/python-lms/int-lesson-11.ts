import type { PythonLmsLesson } from "@/lib/python-lms/types";

export const INT_LESSON_11: PythonLmsLesson = {
  slug: "int-11",
  number: 11,
  title: "Classes & objects",
  subtitle: "CLS-1101 — one Task model, methods, __str__",
  minutes: 96,
  course: "intermediate",
  goals: [
    "Define a class with __init__ and instance attributes",
    "Call methods with self — know why self is first parameter",
    "Implement __str__ for readable debug output",
    "Choose class vs dict when behaviour attaches to data",
    "Ship CLS-1101 Task with mark_done() and is_complete()",
  ],
  canDo: "Model a todo Task in one class — no inheritance — and pass method tests.",

  notes: [
    {
      id: "bridge",
      part: "Chapter 1 · When dict is not enough",
      title: "Data + behaviour together",
      blocks: [
        {
          type: "lead",
          text: "Dict rows worked for ingest. When **operations** belong with **state** (mark done, summarize), a **class** keeps invariants in one place.",
        },
        {
          type: "code",
          code: `class Task:
    def __init__(self, title, done=False):
        self.title = title
        self.done = done

    def mark_done(self):
        self.done = True

t = Task("Ship CLS-1101")
t.mark_done()
print(t.done)`,
          live: true,
          output: "True",
        },
      ],
    },
    {
      id: "self",
      part: "Chapter 2 · self",
      title: "Methods receive self",
      blocks: [
        {
          type: "p",
          text: "**def mark_done(self):** — Python passes the instance as **self**. Forgetting **self** in the definition causes **TypeError** at call time.",
        },
        {
          type: "check",
          id: "c-self",
          question: "task.mark_done() passes how many args to mark_done?",
          options: ["0 besides self", "2 always", "title only", "self is global"],
          answer: 0,
          explain: "Instance method gets self automatically.",
        },
      ],
    },
    {
      id: "case-cls1101",
      part: "Case study · CLS-1101",
      title: "Task spec",
      blocks: [
        {
          type: "callout",
          tone: "exam",
          title: "CLS-1101 · Task",
          text: "__init__(title, done=False). mark_done() sets done True. is_complete() returns done. __str__ returns title + \" [done]\" or title + \" [open]\".",
        },
        {
          type: "code",
          code: `class Task:
    def __init__(self, title, done=False):
        self.title = title
        self.done = done

    def mark_done(self):
        self.done = True

    def is_complete(self):
        return self.done

    def __str__(self):
        status = "done" if self.done else "open"
        return f"{self.title} [{status}]"`,
          live: false,
        },
      ],
    },
    {
      id: "capstone",
      part: "Chapter 3 · Next",
      title: "Ship with tests",
      blocks: [{ type: "p", text: "Lesson 12: **assert** helpers and reading tracebacks when Task tests fail." }],
    },
  ],

  examples: [
    {
      type: "playground",
      id: "ex-cls1101",
      title: "CLS-1101 Task",
      intro: "Implement Task methods.",
      starter: `class Task:
    def __init__(self, title, done=False):
        self.title = title
        self.done = done

    def mark_done(self):
        self.done = True

    def is_complete(self):
        return self.done

    def __str__(self):
        status = "done" if self.done else "open"
        return f"{self.title} [{status}]"

t = Task("x")
print("OK" if not t.is_complete() else "FAIL")
t.mark_done()
print("OK" if t.is_complete() and str(t) == "x [done]" else "FAIL")`,
      tryThis: ["Start done=True"],
      goal: {
        text: "2 OK",
        check: (r) => (r.stdout ?? "").split("OK").length >= 3,
        success: "Task model works.",
      },
    },
  ],

  practice: [
    {
      id: "q1",
      type: "mcq",
      skill: "OOP",
      level: "easy",
      prompt: "__init__ purpose?",
      options: ["Destroy object", "Initialize new instance", "Import json", "Static only"],
      answer: 1,
      explain: "Constructor hook.",
    },
    {
      id: "q2",
      type: "fill",
      skill: "Method",
      level: "medium",
      prompt: "First parameter of instance method.",
      code: `def mark_done(___):
    self.done = True`,
      answers: ["self"],
      mode: "code",
      explain: "Convention for instance.",
    },
    {
      id: "q3",
      type: "mcq",
      skill: "str",
      level: "medium",
      prompt: "print(task) uses which method?",
      options: ["__repr__ only always", "__str__ if defined", "len", "dict"],
      answer: 1,
      explain: "str() calls __str__.",
    },
  ],
};
