import type { PythonLmsLesson } from "@/lib/python-lms/types";

export const INT_LESSON_09: PythonLmsLesson = {
  slug: "int-09",
  number: 9,
  title: "Files & JSON data",
  subtitle: "JSON-901 — loads, dumps, settings dict",
  minutes: 94,
  course: "intermediate",
  goals: [
    "Parse JSON text with json.loads into Python dict/list",
    "Serialize with json.dumps — know double-quoted keys rule",
    "Use a settings dict pattern for config in small tools",
    "Handle json.JSONDecodeError at boundaries",
    "Ship JSON-901 parse_settings(raw) returning dict or None",
  ],
  canDo: "Load settings JSON safely and extract theme/font fields with tests.",

  notes: [
    {
      id: "bridge",
      part: "Chapter 1 · Wire format",
      title: "JSON is the lingua franca",
      blocks: [
        {
          type: "lead",
          text: "APIs and config files ship **JSON text**. Python maps it to **dict** and **list** — the same shapes you used in Lessons 2 and 4.",
        },
        {
          type: "code",
          code: `import json
raw = '{"theme": "dark", "font": 14}'
settings = json.loads(raw)
print(settings["theme"])`,
          live: true,
          output: "dark",
        },
      ],
    },
    {
      id: "json-rules",
      part: "Chapter 2 · Rules",
      title: "Valid JSON vs Python literals",
      blocks: [
        {
          type: "list",
          items: [
            "Keys must be **double-quoted** strings",
            "No trailing commas",
            "**true/false/null** lowercase in JSON — Python uses True/False/None after loads",
          ],
        },
        {
          type: "callout",
          tone: "warn",
          title: "Common fail",
          text: "Single-quoted keys are **invalid JSON** — json.loads fails.",
        },
      ],
    },
    {
      id: "case-json901",
      part: "Case study · JSON-901",
      title: "parse_settings(raw)",
      blocks: [
        {
          type: "callout",
          tone: "exam",
          title: "JSON-901 · parse_settings(raw)",
          text: "Input: string. On valid JSON object, return dict. On invalid JSON or non-object top-level, return None. Do not print.",
        },
        {
          type: "code",
          code: `import json

def parse_settings(raw):
    try:
        data = json.loads(raw)
    except json.JSONDecodeError:
        return None
    if not isinstance(data, dict):
        return None
    return data`,
          live: false,
        },
      ],
    },
    {
      id: "dumps",
      part: "Chapter 3 · Serialize",
      title: "json.dumps",
      blocks: [
        {
          type: "code",
          code: `import json
print(json.dumps({"a": 1}, sort_keys=True))`,
          live: true,
          output: '{"a": 1}',
        },
      ],
    },
    {
      id: "capstone",
      part: "Chapter 4 · Next",
      title: "Stdlib toolbox",
      blocks: [{ type: "p", text: "Lesson 10: **Counter**, **datetime** — reach for stdlib instead of reinventing." }],
    },
  ],

  examples: [
    {
      type: "playground",
      id: "ex-json901",
      title: "JSON-901 parse_settings",
      intro: "loads + dict check.",
      starter: `import json

def parse_settings(raw):
    try:
        data = json.loads(raw)
    except json.JSONDecodeError:
        return None
    if not isinstance(data, dict):
        return None
    return data

print("OK" if parse_settings('{"theme":"dark"}') == {"theme": "dark"} else "FAIL")
print("OK" if parse_settings("[1]") is None else "FAIL")
print("OK" if parse_settings("{bad") is None else "FAIL")`,
      tryThis: ["Add indent with dumps"],
      goal: {
        text: "3 OK",
        check: (r) => (r.stdout ?? "").split("OK").length >= 4,
        success: "JSON-901 passes.",
      },
    },
  ],

  practice: [
    {
      id: "q1",
      type: "mcq",
      skill: "JSON",
      level: "easy",
      prompt: "Which is valid JSON?",
      options: ["{'a': 1}", '{"a": 1}', "{a: 1}", "None"],
      answer: 1,
      explain: "Double quotes required.",
    },
    {
      id: "q2",
      type: "write",
      skill: "JSON-901",
      level: "medium",
      prompt: "parse_settings(raw) — dict or None.",
      starter: `import json
def parse_settings(raw):
    pass
print(parse_settings('{"x":1}') == {"x": 1})`,
      hint: "JSONDecodeError → None; isinstance dict",
      solution: `import json

def parse_settings(raw):
    try:
        data = json.loads(raw)
    except json.JSONDecodeError:
        return None
    if not isinstance(data, dict):
        return None
    return data`,
      check: (r) => ((r.stdout ?? "").includes("True") ? null : "Fix parse_settings"),
    },
    {
      id: "q3",
      type: "mcq",
      skill: "loads",
      level: "medium",
      prompt: "json.loads returns for '[1,2]'?",
      options: ["tuple", "list", "set", "string"],
      answer: 1,
      explain: "JSON arrays → Python list.",
    },
  ],
};
