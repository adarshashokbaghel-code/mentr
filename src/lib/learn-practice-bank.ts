import type { LearnTrackId } from "@/lib/learn-curriculum";
import { LEARN_TRACKS } from "@/lib/learn-curriculum";

export type PracticeQuestionType = "mcq" | "true_false";

export type PracticeQuestion = {
  id: string;
  trackId: LearnTrackId;
  moduleId: string;
  type: PracticeQuestionType;
  prompt: string;
  options: string[];
  correctIndex: number;
  explanation: string;
};

/** ~200 practice questions — equal across CS / AI / Math syllabus. */
export const PRACTICE_QUESTIONS: PracticeQuestion[] = [
  {
    "id": "PA-CS-001",
    "trackId": "cs",
    "moduleId": "A1",
    "type": "mcq",
    "prompt": "In What Is a Computer?, what is an important idea?",
    "options": [
      "A computer is a machine that takes input, processes it, and shows output",
      "Waiting forever without doing anything",
      "A toaster that only heats bread",
      "Turning the device off forever"
    ],
    "correctIndex": 0,
    "explanation": "From A1: A computer is a machine that takes input, processes it, and shows output"
  },
  {
    "id": "PA-CS-002",
    "trackId": "cs",
    "moduleId": "A1",
    "type": "true_false",
    "prompt": "A computer is a machine that takes input, processes it, and shows output.",
    "options": [
      "True",
      "False"
    ],
    "correctIndex": 0,
    "explanation": "Yes — that matches What Is a Computer?."
  },
  {
    "id": "PA-CS-003",
    "trackId": "cs",
    "moduleId": "A1",
    "type": "mcq",
    "prompt": "After learning What Is a Computer?, what should you be able to do?",
    "options": [
      "Name the three jobs of a computer: input, process, output",
      "Waiting forever without doing anything",
      "A toaster that only heats bread",
      "Turning the device off forever"
    ],
    "correctIndex": 0,
    "explanation": "A goal of A1 is: Name the three jobs of a computer: input, process, output"
  },
  {
    "id": "PA-CS-004",
    "trackId": "cs",
    "moduleId": "A2",
    "type": "mcq",
    "prompt": "In How Computers Understand Us, what is an important idea?",
    "options": [
      "Computers only understand on and off — like a light switch",
      "A bicycle bell that rings once",
      "Magic that needs no steps",
      "Turning the device off forever"
    ],
    "correctIndex": 0,
    "explanation": "From A2: Computers only understand on and off — like a light switch"
  },
  {
    "id": "PA-CS-005",
    "trackId": "cs",
    "moduleId": "A2",
    "type": "true_false",
    "prompt": "Computers only understand on and off — like a light switch.",
    "options": [
      "True",
      "False"
    ],
    "correctIndex": 0,
    "explanation": "Yes — that matches How Computers Understand Us."
  },
  {
    "id": "PA-CS-006",
    "trackId": "cs",
    "moduleId": "A2",
    "type": "mcq",
    "prompt": "After learning How Computers Understand Us, what should you be able to do?",
    "options": [
      "Explain binary as on/off lights",
      "A bicycle bell that rings once",
      "Magic that needs no steps",
      "Turning the device off forever"
    ],
    "correctIndex": 0,
    "explanation": "A goal of A2 is: Explain binary as on/off lights"
  },
  {
    "id": "PA-CS-007",
    "trackId": "cs",
    "moduleId": "A3",
    "type": "mcq",
    "prompt": "In Input & Output Devices, what is an important idea?",
    "options": [
      "Input devices send information in: keyboard, mouse, mic, camera",
      "Waiting forever without doing anything",
      "A toaster that only heats bread",
      "Turning the device off forever"
    ],
    "correctIndex": 0,
    "explanation": "From A3: Input devices send information in: keyboard, mouse, mic, camera"
  },
  {
    "id": "PA-CS-008",
    "trackId": "cs",
    "moduleId": "A3",
    "type": "true_false",
    "prompt": "Input devices send information in: keyboard, mouse, mic, camera.",
    "options": [
      "True",
      "False"
    ],
    "correctIndex": 0,
    "explanation": "Yes — that matches Input & Output Devices."
  },
  {
    "id": "PA-CS-009",
    "trackId": "cs",
    "moduleId": "A3",
    "type": "mcq",
    "prompt": "After learning Input & Output Devices, what should you be able to do?",
    "options": [
      "Sort common devices into input or output",
      "A bicycle bell that rings once",
      "Magic that needs no steps",
      "Turning the device off forever"
    ],
    "correctIndex": 0,
    "explanation": "A goal of A3 is: Sort common devices into input or output"
  },
  {
    "id": "PA-CS-010",
    "trackId": "cs",
    "moduleId": "A4",
    "type": "mcq",
    "prompt": "In How Websites Talk to Each Other, what is an important idea?",
    "options": [
      "The internet is many computers asking and answering",
      "Waiting forever without doing anything",
      "A toaster that only heats bread",
      "Turning the device off forever"
    ],
    "correctIndex": 0,
    "explanation": "From A4: The internet is many computers asking and answering"
  },
  {
    "id": "PA-CS-011",
    "trackId": "cs",
    "moduleId": "A4",
    "type": "true_false",
    "prompt": "The internet is many computers asking and answering.",
    "options": [
      "True",
      "False"
    ],
    "correctIndex": 0,
    "explanation": "Yes — that matches How Websites Talk to Each Other."
  },
  {
    "id": "PA-CS-012",
    "trackId": "cs",
    "moduleId": "A4",
    "type": "mcq",
    "prompt": "After learning How Websites Talk to Each Other, what should you be able to do?",
    "options": [
      "Describe the internet as a network, not a single box",
      "A bicycle bell that rings once",
      "Magic that needs no steps",
      "Turning the device off forever"
    ],
    "correctIndex": 0,
    "explanation": "A goal of A4 is: Describe the internet as a network, not a single box"
  },
  {
    "id": "PA-CS-013",
    "trackId": "cs",
    "moduleId": "A5",
    "type": "mcq",
    "prompt": "In Being Safe Online, what is an important idea?",
    "options": [
      "Never share full name + school + home together with strangers",
      "A bicycle bell that rings once",
      "Magic that needs no steps",
      "Turning the device off forever"
    ],
    "correctIndex": 0,
    "explanation": "From A5: Never share full name + school + home together with strangers"
  },
  {
    "id": "PA-CS-014",
    "trackId": "cs",
    "moduleId": "A5",
    "type": "true_false",
    "prompt": "Never share full name + school + home together with strangers.",
    "options": [
      "True",
      "False"
    ],
    "correctIndex": 0,
    "explanation": "Yes — that matches Being Safe Online."
  },
  {
    "id": "PA-CS-015",
    "trackId": "cs",
    "moduleId": "A5",
    "type": "mcq",
    "prompt": "After learning Being Safe Online, what should you be able to do?",
    "options": [
      "List three things never to post publicly",
      "A bicycle bell that rings once",
      "Magic that needs no steps",
      "Turning the device off forever"
    ],
    "correctIndex": 0,
    "explanation": "A goal of A5 is: List three things never to post publicly"
  },
  {
    "id": "PA-CS-016",
    "trackId": "cs",
    "moduleId": "A6",
    "type": "mcq",
    "prompt": "In What Is an Algorithm?, what is an important idea?",
    "options": [
      "An algorithm is a clear list of steps — like a recipe or getting ready for school",
      "Waiting forever without doing anything",
      "A toaster that only heats bread",
      "Turning the device off forever"
    ],
    "correctIndex": 0,
    "explanation": "From A6: An algorithm is a clear list of steps — like a recipe or getting ready for school"
  },
  {
    "id": "PA-CS-017",
    "trackId": "cs",
    "moduleId": "A6",
    "type": "true_false",
    "prompt": "An algorithm is a clear list of steps — like a recipe or getting ready for school.",
    "options": [
      "True",
      "False"
    ],
    "correctIndex": 0,
    "explanation": "Yes — that matches What Is an Algorithm?."
  },
  {
    "id": "PA-CS-018",
    "trackId": "cs",
    "moduleId": "A6",
    "type": "mcq",
    "prompt": "After learning What Is an Algorithm?, what should you be able to do?",
    "options": [
      "Write a 4–6 step algorithm for a daily task",
      "A bicycle bell that rings once",
      "Magic that needs no steps",
      "Turning the device off forever"
    ],
    "correctIndex": 0,
    "explanation": "A goal of A6 is: Write a 4–6 step algorithm for a daily task"
  },
  {
    "id": "PA-CS-019",
    "trackId": "cs",
    "moduleId": "A7",
    "type": "mcq",
    "prompt": "In Sequencing, what is an important idea?",
    "options": [
      "Order matters: socks before shoes, unlock before open",
      "Only drawing pictures forever",
      "Throwing the device away",
      "Turning the device off forever"
    ],
    "correctIndex": 0,
    "explanation": "From A7: Order matters: socks before shoes, unlock before open"
  },
  {
    "id": "PA-CS-020",
    "trackId": "cs",
    "moduleId": "A7",
    "type": "true_false",
    "prompt": "Order matters: socks before shoes, unlock before open.",
    "options": [
      "True",
      "False"
    ],
    "correctIndex": 0,
    "explanation": "Yes — that matches Sequencing."
  },
  {
    "id": "PA-CS-021",
    "trackId": "cs",
    "moduleId": "A7",
    "type": "mcq",
    "prompt": "After learning Sequencing, what should you be able to do?",
    "options": [
      "Reorder a scrambled everyday algorithm",
      "Only drawing pictures forever",
      "Throwing the device away",
      "Turning the device off forever"
    ],
    "correctIndex": 0,
    "explanation": "A goal of A7 is: Reorder a scrambled everyday algorithm"
  },
  {
    "id": "PA-CS-022",
    "trackId": "cs",
    "moduleId": "A8",
    "type": "mcq",
    "prompt": "In Loops — Doing It Again and Again, what is an important idea?",
    "options": [
      "A loop means ‘do this again’ — clap 5 times, not clap clap clap clap clap written out",
      "A bicycle bell that rings once",
      "Magic that needs no steps",
      "Turning the device off forever"
    ],
    "correctIndex": 0,
    "explanation": "From A8: A loop means ‘do this again’ — clap 5 times, not clap clap clap clap clap written out"
  },
  {
    "id": "PA-CS-023",
    "trackId": "cs",
    "moduleId": "A8",
    "type": "true_false",
    "prompt": "A loop means ‘do this again’ — clap 5 times, not clap clap clap clap clap written out.",
    "options": [
      "True",
      "False"
    ],
    "correctIndex": 0,
    "explanation": "Yes — that matches Loops — Doing It Again and Again."
  },
  {
    "id": "PA-CS-024",
    "trackId": "cs",
    "moduleId": "A8",
    "type": "mcq",
    "prompt": "After learning Loops — Doing It Again and Again, what should you be able to do?",
    "options": [
      "Replace a repeated list with a ‘repeat N times’ loop",
      "A bicycle bell that rings once",
      "Magic that needs no steps",
      "Turning the device off forever"
    ],
    "correctIndex": 0,
    "explanation": "A goal of A8 is: Replace a repeated list with a ‘repeat N times’ loop"
  },
  {
    "id": "PA-CS-025",
    "trackId": "cs",
    "moduleId": "A9",
    "type": "mcq",
    "prompt": "In If This, Then That, what is an important idea?",
    "options": [
      "If this, then that: if it rains, take an umbrella",
      "A bicycle bell that rings once",
      "Magic that needs no steps",
      "Turning the device off forever"
    ],
    "correctIndex": 0,
    "explanation": "From A9: If this, then that: if it rains, take an umbrella"
  },
  {
    "id": "PA-CS-026",
    "trackId": "cs",
    "moduleId": "A9",
    "type": "true_false",
    "prompt": "If this, then that: if it rains, take an umbrella.",
    "options": [
      "True",
      "False"
    ],
    "correctIndex": 0,
    "explanation": "Yes — that matches If This, Then That."
  },
  {
    "id": "PA-CS-027",
    "trackId": "cs",
    "moduleId": "A9",
    "type": "mcq",
    "prompt": "After learning If This, Then That, what should you be able to do?",
    "options": [
      "Write an if/then rule for a simple story",
      "A bicycle bell that rings once",
      "Magic that needs no steps",
      "Turning the device off forever"
    ],
    "correctIndex": 0,
    "explanation": "A goal of A9 is: Write an if/then rule for a simple story"
  },
  {
    "id": "PA-CS-028",
    "trackId": "cs",
    "moduleId": "A10",
    "type": "mcq",
    "prompt": "In Debugging — Finding the Mistake, what is an important idea?",
    "options": [
      "A bug is a mistake in the steps, not a ‘naughty’ computer",
      "Waiting forever without doing anything",
      "A toaster that only heats bread",
      "Turning the device off forever"
    ],
    "correctIndex": 0,
    "explanation": "From A10: A bug is a mistake in the steps, not a ‘naughty’ computer"
  },
  {
    "id": "PA-CS-029",
    "trackId": "cs",
    "moduleId": "A10",
    "type": "true_false",
    "prompt": "A bug is a mistake in the steps, not a ‘naughty’ computer.",
    "options": [
      "True",
      "False"
    ],
    "correctIndex": 0,
    "explanation": "Yes — that matches Debugging — Finding the Mistake."
  },
  {
    "id": "PA-CS-030",
    "trackId": "cs",
    "moduleId": "A10",
    "type": "mcq",
    "prompt": "After learning Debugging — Finding the Mistake, what should you be able to do?",
    "options": [
      "Find one wrong or missing step in a short algorithm",
      "Waiting forever without doing anything",
      "A toaster that only heats bread",
      "Turning the device off forever"
    ],
    "correctIndex": 0,
    "explanation": "A goal of A10 is: Find one wrong or missing step in a short algorithm"
  },
  {
    "id": "PA-CS-031",
    "trackId": "cs",
    "moduleId": "A11",
    "type": "mcq",
    "prompt": "In Meet Block Coding, what is an important idea?",
    "options": [
      "Block coding: snap puzzle pieces instead of typing",
      "Only drawing pictures forever",
      "Throwing the device away",
      "Turning the device off forever"
    ],
    "correctIndex": 0,
    "explanation": "From A11: Block coding: snap puzzle pieces instead of typing"
  },
  {
    "id": "PA-CS-032",
    "trackId": "cs",
    "moduleId": "A11",
    "type": "true_false",
    "prompt": "Block coding: snap puzzle pieces instead of typing.",
    "options": [
      "True",
      "False"
    ],
    "correctIndex": 0,
    "explanation": "Yes — that matches Meet Block Coding."
  },
  {
    "id": "PA-CS-033",
    "trackId": "cs",
    "moduleId": "A11",
    "type": "mcq",
    "prompt": "After learning Meet Block Coding, what should you be able to do?",
    "options": [
      "Name block coding as visual, not typing-first",
      "Waiting forever without doing anything",
      "A toaster that only heats bread",
      "Turning the device off forever"
    ],
    "correctIndex": 0,
    "explanation": "A goal of A11 is: Name block coding as visual, not typing-first"
  },
  {
    "id": "PA-CS-034",
    "trackId": "cs",
    "moduleId": "A12",
    "type": "mcq",
    "prompt": "In Making a Character Move, what is an important idea?",
    "options": [
      "Event (when flag clicked) + motion (move, turn)",
      "Only drawing pictures forever",
      "Throwing the device away",
      "Turning the device off forever"
    ],
    "correctIndex": 0,
    "explanation": "From A12: Event (when flag clicked) + motion (move, turn)"
  },
  {
    "id": "PA-CS-035",
    "trackId": "cs",
    "moduleId": "A12",
    "type": "true_false",
    "prompt": "Event (when flag clicked) + motion (move, turn).",
    "options": [
      "True",
      "False"
    ],
    "correctIndex": 0,
    "explanation": "Yes — that matches Making a Character Move."
  },
  {
    "id": "PA-CS-036",
    "trackId": "cs",
    "moduleId": "A12",
    "type": "mcq",
    "prompt": "After learning Making a Character Move, what should you be able to do?",
    "options": [
      "Sequence start + move + turn for a short path",
      "Waiting forever without doing anything",
      "A toaster that only heats bread",
      "Turning the device off forever"
    ],
    "correctIndex": 0,
    "explanation": "A goal of A12 is: Sequence start + move + turn for a short path"
  },
  {
    "id": "PA-CS-037",
    "trackId": "cs",
    "moduleId": "A13",
    "type": "mcq",
    "prompt": "In Variables — Boxes That Store Things, what is an important idea?",
    "options": [
      "A variable is a named box that holds a number or word (score, lives, name)",
      "Only drawing pictures forever",
      "Throwing the device away",
      "Turning the device off forever"
    ],
    "correctIndex": 0,
    "explanation": "From A13: A variable is a named box that holds a number or word (score, lives, name)"
  },
  {
    "id": "PA-CS-038",
    "trackId": "cs",
    "moduleId": "A13",
    "type": "true_false",
    "prompt": "A variable is a named box that holds a number or word (score, lives, name).",
    "options": [
      "True",
      "False"
    ],
    "correctIndex": 0,
    "explanation": "Yes — that matches Variables — Boxes That Store Things."
  },
  {
    "id": "PA-CS-039",
    "trackId": "cs",
    "moduleId": "A13",
    "type": "mcq",
    "prompt": "After learning Variables — Boxes That Store Things, what should you be able to do?",
    "options": [
      "Give a real example of a variable in a game",
      "A bicycle bell that rings once",
      "Magic that needs no steps",
      "Turning the device off forever"
    ],
    "correctIndex": 0,
    "explanation": "A goal of A13 is: Give a real example of a variable in a game"
  },
  {
    "id": "PA-CS-040",
    "trackId": "cs",
    "moduleId": "A14",
    "type": "mcq",
    "prompt": "In Making Choices in Code, what is an important idea?",
    "options": [
      "If/else in blocks: if touching wall, bounce; else keep walking",
      "Only drawing pictures forever",
      "Throwing the device away",
      "Turning the device off forever"
    ],
    "correctIndex": 0,
    "explanation": "From A14: If/else in blocks: if touching wall, bounce; else keep walking"
  },
  {
    "id": "PA-CS-041",
    "trackId": "cs",
    "moduleId": "A14",
    "type": "true_false",
    "prompt": "If/else in blocks: if touching wall, bounce; else keep walking.",
    "options": [
      "True",
      "False"
    ],
    "correctIndex": 0,
    "explanation": "Yes — that matches Making Choices in Code."
  },
  {
    "id": "PA-CS-042",
    "trackId": "cs",
    "moduleId": "A14",
    "type": "mcq",
    "prompt": "After learning Making Choices in Code, what should you be able to do?",
    "options": [
      "Read a simple if-block and say what the character does",
      "Waiting forever without doing anything",
      "A toaster that only heats bread",
      "Turning the device off forever"
    ],
    "correctIndex": 0,
    "explanation": "A goal of A14 is: Read a simple if-block and say what the character does"
  },
  {
    "id": "PA-CS-043",
    "trackId": "cs",
    "moduleId": "A15",
    "type": "mcq",
    "prompt": "In My First Mini Program, what is an important idea?",
    "options": [
      "Guided mini-project: a 5–8 block animation or joke",
      "Only drawing pictures forever",
      "Throwing the device away",
      "Turning the device off forever"
    ],
    "correctIndex": 0,
    "explanation": "From A15: Guided mini-project: a 5–8 block animation or joke"
  },
  {
    "id": "PA-CS-044",
    "trackId": "cs",
    "moduleId": "A15",
    "type": "true_false",
    "prompt": "Guided mini-project: a 5–8 block animation or joke.",
    "options": [
      "True",
      "False"
    ],
    "correctIndex": 0,
    "explanation": "Yes — that matches My First Mini Program."
  },
  {
    "id": "PA-CS-045",
    "trackId": "cs",
    "moduleId": "A15",
    "type": "mcq",
    "prompt": "After learning My First Mini Program, what should you be able to do?",
    "options": [
      "Finish a tiny block program with help",
      "A bicycle bell that rings once",
      "Magic that needs no steps",
      "Turning the device off forever"
    ],
    "correctIndex": 0,
    "explanation": "A goal of A15 is: Finish a tiny block program with help"
  },
  {
    "id": "PA-CS-046",
    "trackId": "cs",
    "moduleId": "A16",
    "type": "mcq",
    "prompt": "In Jobs That Use Computers, what is an important idea?",
    "options": [
      "People who make games, apps, animations, and robots all use computers",
      "Waiting forever without doing anything",
      "A toaster that only heats bread",
      "Turning the device off forever"
    ],
    "correctIndex": 0,
    "explanation": "From A16: People who make games, apps, animations, and robots all use computers"
  },
  {
    "id": "PA-CS-047",
    "trackId": "cs",
    "moduleId": "A16",
    "type": "true_false",
    "prompt": "People who make games, apps, animations, and robots all use computers.",
    "options": [
      "True",
      "False"
    ],
    "correctIndex": 0,
    "explanation": "Yes — that matches Jobs That Use Computers."
  },
  {
    "id": "PA-CS-048",
    "trackId": "cs",
    "moduleId": "A16",
    "type": "mcq",
    "prompt": "After learning Jobs That Use Computers, what should you be able to do?",
    "options": [
      "Name two computer-using jobs",
      "A bicycle bell that rings once",
      "Magic that needs no steps",
      "Turning the device off forever"
    ],
    "correctIndex": 0,
    "explanation": "A goal of A16 is: Name two computer-using jobs"
  },
  {
    "id": "PA-CS-049",
    "trackId": "cs",
    "moduleId": "A17",
    "type": "mcq",
    "prompt": "In How Apps We Use Actually Work, what is an important idea?",
    "options": [
      "A maps app: you type a place (input), it finds a path (process), it draws the route (ou…",
      "A bicycle bell that rings once",
      "Magic that needs no steps",
      "Turning the device off forever"
    ],
    "correctIndex": 0,
    "explanation": "From A17: A maps app: you type a place (input), it finds a path (process), it draws the route (output)"
  },
  {
    "id": "PA-CS-050",
    "trackId": "cs",
    "moduleId": "A17",
    "type": "true_false",
    "prompt": "A maps app: you type a place (input), it finds a path (process), it draws the route (output).",
    "options": [
      "True",
      "False"
    ],
    "correctIndex": 0,
    "explanation": "Yes — that matches How Apps We Use Actually Work."
  },
  {
    "id": "PA-CS-051",
    "trackId": "cs",
    "moduleId": "A17",
    "type": "mcq",
    "prompt": "After learning How Apps We Use Actually Work, what should you be able to do?",
    "options": [
      "Map a favourite app to input–process–output",
      "A bicycle bell that rings once",
      "Magic that needs no steps",
      "Turning the device off forever"
    ],
    "correctIndex": 0,
    "explanation": "A goal of A17 is: Map a favourite app to input–process–output"
  },
  {
    "id": "PA-CS-052",
    "trackId": "cs",
    "moduleId": "A18",
    "type": "mcq",
    "prompt": "In Robots & Automation, what is an important idea?",
    "options": [
      "A robot follows algorithms — it doesn’t ‘feel’",
      "A bicycle bell that rings once",
      "Magic that needs no steps",
      "Turning the device off forever"
    ],
    "correctIndex": 0,
    "explanation": "From A18: A robot follows algorithms — it doesn’t ‘feel’"
  },
  {
    "id": "PA-CS-053",
    "trackId": "cs",
    "moduleId": "A18",
    "type": "true_false",
    "prompt": "A robot follows algorithms — it doesn’t ‘feel’.",
    "options": [
      "True",
      "False"
    ],
    "correctIndex": 0,
    "explanation": "Yes — that matches Robots & Automation."
  },
  {
    "id": "PA-CS-054",
    "trackId": "cs",
    "moduleId": "A18",
    "type": "mcq",
    "prompt": "After learning Robots & Automation, what should you be able to do?",
    "options": [
      "Give one thing a robot can do well and one it cannot (yet)",
      "A bicycle bell that rings once",
      "Magic that needs no steps",
      "Turning the device off forever"
    ],
    "correctIndex": 0,
    "explanation": "A goal of A18 is: Give one thing a robot can do well and one it cannot (yet)"
  },
  {
    "id": "PA-CS-055",
    "trackId": "cs",
    "moduleId": "A19",
    "type": "mcq",
    "prompt": "In Data — What Computers Remember, what is an important idea?",
    "options": [
      "Data is facts the computer stores: names, scores, photos",
      "Only drawing pictures forever",
      "Throwing the device away",
      "Turning the device off forever"
    ],
    "correctIndex": 0,
    "explanation": "From A19: Data is facts the computer stores: names, scores, photos"
  },
  {
    "id": "PA-CS-056",
    "trackId": "cs",
    "moduleId": "A19",
    "type": "true_false",
    "prompt": "Data is facts the computer stores: names, scores, photos.",
    "options": [
      "True",
      "False"
    ],
    "correctIndex": 0,
    "explanation": "Yes — that matches Data — What Computers Remember."
  },
  {
    "id": "PA-CS-057",
    "trackId": "cs",
    "moduleId": "A19",
    "type": "mcq",
    "prompt": "After learning Data — What Computers Remember, what should you be able to do?",
    "options": [
      "Give two examples of data a school computer might store",
      "A bicycle bell that rings once",
      "Magic that needs no steps",
      "Turning the device off forever"
    ],
    "correctIndex": 0,
    "explanation": "A goal of A19 is: Give two examples of data a school computer might store"
  },
  {
    "id": "PA-CS-058",
    "trackId": "cs",
    "moduleId": "A20",
    "type": "mcq",
    "prompt": "In Capstone: Design Your Dream App, what is an important idea?",
    "options": [
      "Capstone: invent an app that helps a Class 3–5 child",
      "A bicycle bell that rings once",
      "Magic that needs no steps",
      "Turning the device off forever"
    ],
    "correctIndex": 0,
    "explanation": "From A20: Capstone: invent an app that helps a Class 3–5 child"
  },
  {
    "id": "PA-CS-059",
    "trackId": "cs",
    "moduleId": "A20",
    "type": "true_false",
    "prompt": "Capstone: invent an app that helps a Class 3–5 child.",
    "options": [
      "True",
      "False"
    ],
    "correctIndex": 0,
    "explanation": "Yes — that matches Capstone: Design Your Dream App."
  },
  {
    "id": "PA-CS-060",
    "trackId": "cs",
    "moduleId": "A20",
    "type": "mcq",
    "prompt": "After learning Capstone: Design Your Dream App, what should you be able to do?",
    "options": [
      "Describe an app idea with user, input, and output",
      "A bicycle bell that rings once",
      "Magic that needs no steps",
      "Turning the device off forever"
    ],
    "correctIndex": 0,
    "explanation": "A goal of A20 is: Describe an app idea with user, input, and output"
  },
  {
    "id": "PA-CS-061",
    "trackId": "cs",
    "moduleId": "A1",
    "type": "true_false",
    "prompt": "Computers never use ideas from “A1” at all.",
    "options": [
      "True",
      "False"
    ],
    "correctIndex": 1,
    "explanation": "False — A1 ideas matter in this track."
  },
  {
    "id": "PA-CS-062",
    "trackId": "cs",
    "moduleId": "A2",
    "type": "mcq",
    "prompt": "Which sentence fits How Computers Understand Us best?",
    "options": [
      "On = 1, off = 0; a group of switches can count and spell",
      "Only drawing pictures forever",
      "Throwing the device away",
      "Turning the device off forever"
    ],
    "correctIndex": 0,
    "explanation": "Practice focus: Match 0/1 to off/on; read a 3-switch pattern"
  },
  {
    "id": "PA-CS-063",
    "trackId": "cs",
    "moduleId": "A3",
    "type": "mcq",
    "prompt": "Which sentence fits Input & Output Devices best?",
    "options": [
      "Output devices send information out: screen, speaker, printer",
      "A bicycle bell that rings once",
      "Magic that needs no steps",
      "Turning the device off forever"
    ],
    "correctIndex": 0,
    "explanation": "Practice focus: Match device → job; drag keyboard/mouse/screen/speaker into the right box"
  },
  {
    "id": "PA-CS-064",
    "trackId": "cs",
    "moduleId": "A4",
    "type": "true_false",
    "prompt": "Computers never use ideas from “A4” at all.",
    "options": [
      "True",
      "False"
    ],
    "correctIndex": 1,
    "explanation": "False — A4 ideas matter in this track."
  },
  {
    "id": "PA-CS-065",
    "trackId": "cs",
    "moduleId": "A5",
    "type": "mcq",
    "prompt": "Which sentence fits Being Safe Online best?",
    "options": [
      "Passwords are secrets — even from friends",
      "Only drawing pictures forever",
      "Throwing the device away",
      "Turning the device off forever"
    ],
    "correctIndex": 0,
    "explanation": "Practice focus: Safe vs unsafe posts; pick a strong vs weak password pair (no real passwords)"
  },
  {
    "id": "PA-CS-066",
    "trackId": "cs",
    "moduleId": "A6",
    "type": "mcq",
    "prompt": "Which sentence fits What Is an Algorithm? best?",
    "options": [
      "Steps must be in an order a machine (or a friend) can follow",
      "Waiting forever without doing anything",
      "A toaster that only heats bread",
      "Turning the device off forever"
    ],
    "correctIndex": 0,
    "explanation": "Practice focus: Put sandwich / brush-teeth steps in order; find the missing step"
  },
  {
    "id": "PA-CS-067",
    "trackId": "cs",
    "moduleId": "A7",
    "type": "true_false",
    "prompt": "Computers never use ideas from “A7” at all.",
    "options": [
      "True",
      "False"
    ],
    "correctIndex": 1,
    "explanation": "False — A7 ideas matter in this track."
  },
  {
    "id": "PA-AI-001",
    "trackId": "ai",
    "moduleId": "B1",
    "type": "mcq",
    "prompt": "In Meet AI — Magic or Math?, what is an important idea?",
    "options": [
      "AI is not magic — it finds patterns in lots of examples",
      "A rock that never learns",
      "A broken calculator stuck on zero",
      "Turning the device off forever"
    ],
    "correctIndex": 0,
    "explanation": "From B1: AI is not magic — it finds patterns in lots of examples"
  },
  {
    "id": "PA-AI-002",
    "trackId": "ai",
    "moduleId": "B1",
    "type": "true_false",
    "prompt": "AI is not magic — it finds patterns in lots of examples.",
    "options": [
      "True",
      "False"
    ],
    "correctIndex": 0,
    "explanation": "Yes — that matches Meet AI — Magic or Math?."
  },
  {
    "id": "PA-AI-003",
    "trackId": "ai",
    "moduleId": "B1",
    "type": "mcq",
    "prompt": "After learning Meet AI — Magic or Math?, what should you be able to do?",
    "options": [
      "Say AI uses patterns, not spells",
      "Ignoring every example you give it",
      "Magic with no patterns",
      "Turning the device off forever"
    ],
    "correctIndex": 0,
    "explanation": "A goal of B1 is: Say AI uses patterns, not spells"
  },
  {
    "id": "PA-AI-004",
    "trackId": "ai",
    "moduleId": "B2",
    "type": "mcq",
    "prompt": "In Smart vs. Simple, what is an important idea?",
    "options": [
      "Simple programs follow fixed rules: if button pressed, play sound",
      "Ignoring every example you give it",
      "Magic with no patterns",
      "Turning the device off forever"
    ],
    "correctIndex": 0,
    "explanation": "From B2: Simple programs follow fixed rules: if button pressed, play sound"
  },
  {
    "id": "PA-AI-005",
    "trackId": "ai",
    "moduleId": "B2",
    "type": "true_false",
    "prompt": "Simple programs follow fixed rules: if button pressed, play sound.",
    "options": [
      "True",
      "False"
    ],
    "correctIndex": 0,
    "explanation": "Yes — that matches Smart vs. Simple."
  },
  {
    "id": "PA-AI-006",
    "trackId": "ai",
    "moduleId": "B2",
    "type": "mcq",
    "prompt": "After learning Smart vs. Simple, what should you be able to do?",
    "options": [
      "Sort ‘fixed rule’ vs ‘learns from examples’",
      "A rock that never learns",
      "A broken calculator stuck on zero",
      "Turning the device off forever"
    ],
    "correctIndex": 0,
    "explanation": "A goal of B2 is: Sort ‘fixed rule’ vs ‘learns from examples’"
  },
  {
    "id": "PA-AI-007",
    "trackId": "ai",
    "moduleId": "B3",
    "type": "mcq",
    "prompt": "In Where AI Hides in Daily Life, what is an important idea?",
    "options": [
      "AI at home: voice helpers, photo search, video suggestions, maps traffic",
      "Only paper and pencils",
      "AI is always perfect and never wrong",
      "Turning the device off forever"
    ],
    "correctIndex": 0,
    "explanation": "From B3: AI at home: voice helpers, photo search, video suggestions, maps traffic"
  },
  {
    "id": "PA-AI-008",
    "trackId": "ai",
    "moduleId": "B3",
    "type": "true_false",
    "prompt": "AI at home: voice helpers, photo search, video suggestions, maps traffic.",
    "options": [
      "True",
      "False"
    ],
    "correctIndex": 0,
    "explanation": "Yes — that matches Where AI Hides in Daily Life."
  },
  {
    "id": "PA-AI-009",
    "trackId": "ai",
    "moduleId": "B3",
    "type": "mcq",
    "prompt": "After learning Where AI Hides in Daily Life, what should you be able to do?",
    "options": [
      "Point to two everyday AI helpers",
      "Ignoring every example you give it",
      "Magic with no patterns",
      "Turning the device off forever"
    ],
    "correctIndex": 0,
    "explanation": "A goal of B3 is: Point to two everyday AI helpers"
  },
  {
    "id": "PA-AI-010",
    "trackId": "ai",
    "moduleId": "B4",
    "type": "mcq",
    "prompt": "In AI Can Be Wrong Too, what is an important idea?",
    "options": [
      "AI can be wrong: a dog photo labelled as a muffin",
      "A rock that never learns",
      "A broken calculator stuck on zero",
      "Turning the device off forever"
    ],
    "correctIndex": 0,
    "explanation": "From B4: AI can be wrong: a dog photo labelled as a muffin"
  },
  {
    "id": "PA-AI-011",
    "trackId": "ai",
    "moduleId": "B4",
    "type": "true_false",
    "prompt": "AI can be wrong: a dog photo labelled as a muffin.",
    "options": [
      "True",
      "False"
    ],
    "correctIndex": 0,
    "explanation": "Yes — that matches AI Can Be Wrong Too."
  },
  {
    "id": "PA-AI-012",
    "trackId": "ai",
    "moduleId": "B4",
    "type": "mcq",
    "prompt": "After learning AI Can Be Wrong Too, what should you be able to do?",
    "options": [
      "Give one way AI can make a mistake",
      "A rock that never learns",
      "A broken calculator stuck on zero",
      "Turning the device off forever"
    ],
    "correctIndex": 0,
    "explanation": "A goal of B4 is: Give one way AI can make a mistake"
  },
  {
    "id": "PA-AI-013",
    "trackId": "ai",
    "moduleId": "B5",
    "type": "mcq",
    "prompt": "In AI Helpers Around the World, what is an important idea?",
    "options": [
      "Translation, maps, and captions help people across languages",
      "Only paper and pencils",
      "AI is always perfect and never wrong",
      "Turning the device off forever"
    ],
    "correctIndex": 0,
    "explanation": "From B5: Translation, maps, and captions help people across languages"
  },
  {
    "id": "PA-AI-014",
    "trackId": "ai",
    "moduleId": "B5",
    "type": "true_false",
    "prompt": "Translation, maps, and captions help people across languages.",
    "options": [
      "True",
      "False"
    ],
    "correctIndex": 0,
    "explanation": "Yes — that matches AI Helpers Around the World."
  },
  {
    "id": "PA-AI-015",
    "trackId": "ai",
    "moduleId": "B5",
    "type": "mcq",
    "prompt": "After learning AI Helpers Around the World, what should you be able to do?",
    "options": [
      "Name one AI helper used for language or travel",
      "A rock that never learns",
      "A broken calculator stuck on zero",
      "Turning the device off forever"
    ],
    "correctIndex": 0,
    "explanation": "A goal of B5 is: Name one AI helper used for language or travel"
  },
  {
    "id": "PA-AI-016",
    "trackId": "ai",
    "moduleId": "B6",
    "type": "mcq",
    "prompt": "In Teaching a Computer Like Teaching a Puppy, what is an important idea?",
    "options": [
      "We teach AI like a puppy: many examples, praise for right, more practice",
      "Only paper and pencils",
      "AI is always perfect and never wrong",
      "Turning the device off forever"
    ],
    "correctIndex": 0,
    "explanation": "From B6: We teach AI like a puppy: many examples, praise for right, more practice"
  },
  {
    "id": "PA-AI-017",
    "trackId": "ai",
    "moduleId": "B6",
    "type": "true_false",
    "prompt": "We teach AI like a puppy: many examples, praise for right, more practice.",
    "options": [
      "True",
      "False"
    ],
    "correctIndex": 0,
    "explanation": "Yes — that matches Teaching a Computer Like Teaching a Puppy."
  },
  {
    "id": "PA-AI-018",
    "trackId": "ai",
    "moduleId": "B6",
    "type": "mcq",
    "prompt": "After learning Teaching a Computer Like Teaching a Puppy, what should you be able to do?",
    "options": [
      "Explain training as ‘lots of examples’",
      "Ignoring every example you give it",
      "Magic with no patterns",
      "Turning the device off forever"
    ],
    "correctIndex": 0,
    "explanation": "A goal of B6 is: Explain training as ‘lots of examples’"
  },
  {
    "id": "PA-AI-019",
    "trackId": "ai",
    "moduleId": "B7",
    "type": "mcq",
    "prompt": "In Patterns Everywhere, what is an important idea?",
    "options": [
      "Patterns: same colour, same shape, same beat",
      "Ignoring every example you give it",
      "Magic with no patterns",
      "Turning the device off forever"
    ],
    "correctIndex": 0,
    "explanation": "From B7: Patterns: same colour, same shape, same beat"
  },
  {
    "id": "PA-AI-020",
    "trackId": "ai",
    "moduleId": "B7",
    "type": "true_false",
    "prompt": "Patterns: same colour, same shape, same beat.",
    "options": [
      "True",
      "False"
    ],
    "correctIndex": 0,
    "explanation": "Yes — that matches Patterns Everywhere."
  },
  {
    "id": "PA-AI-021",
    "trackId": "ai",
    "moduleId": "B7",
    "type": "mcq",
    "prompt": "After learning Patterns Everywhere, what should you be able to do?",
    "options": [
      "Find a pattern in a short sequence",
      "A rock that never learns",
      "A broken calculator stuck on zero",
      "Turning the device off forever"
    ],
    "correctIndex": 0,
    "explanation": "A goal of B7 is: Find a pattern in a short sequence"
  },
  {
    "id": "PA-AI-022",
    "trackId": "ai",
    "moduleId": "B8",
    "type": "mcq",
    "prompt": "In Show and Tell — Learning From Examples, what is an important idea?",
    "options": [
      "A label is a name we stick on an example: this is ‘apple’",
      "Only paper and pencils",
      "AI is always perfect and never wrong",
      "Turning the device off forever"
    ],
    "correctIndex": 0,
    "explanation": "From B8: A label is a name we stick on an example: this is ‘apple’"
  },
  {
    "id": "PA-AI-023",
    "trackId": "ai",
    "moduleId": "B8",
    "type": "true_false",
    "prompt": "A label is a name we stick on an example: this is ‘apple’.",
    "options": [
      "True",
      "False"
    ],
    "correctIndex": 0,
    "explanation": "Yes — that matches Show and Tell — Learning From Examples."
  },
  {
    "id": "PA-AI-024",
    "trackId": "ai",
    "moduleId": "B8",
    "type": "mcq",
    "prompt": "After learning Show and Tell — Learning From Examples, what should you be able to do?",
    "options": [
      "Explain what a label is",
      "Ignoring every example you give it",
      "Magic with no patterns",
      "Turning the device off forever"
    ],
    "correctIndex": 0,
    "explanation": "A goal of B8 is: Explain what a label is"
  },
  {
    "id": "PA-AI-025",
    "trackId": "ai",
    "moduleId": "B9",
    "type": "mcq",
    "prompt": "In Data — The Food AI Eats, what is an important idea?",
    "options": [
      "Data is the food AI eats: pictures, words, sounds",
      "A rock that never learns",
      "A broken calculator stuck on zero",
      "Turning the device off forever"
    ],
    "correctIndex": 0,
    "explanation": "From B9: Data is the food AI eats: pictures, words, sounds"
  },
  {
    "id": "PA-AI-026",
    "trackId": "ai",
    "moduleId": "B9",
    "type": "true_false",
    "prompt": "Data is the food AI eats: pictures, words, sounds.",
    "options": [
      "True",
      "False"
    ],
    "correctIndex": 0,
    "explanation": "Yes — that matches Data — The Food AI Eats."
  },
  {
    "id": "PA-AI-027",
    "trackId": "ai",
    "moduleId": "B9",
    "type": "mcq",
    "prompt": "After learning Data — The Food AI Eats, what should you be able to do?",
    "options": [
      "Give two kinds of data AI might use",
      "Ignoring every example you give it",
      "Magic with no patterns",
      "Turning the device off forever"
    ],
    "correctIndex": 0,
    "explanation": "A goal of B9 is: Give two kinds of data AI might use"
  },
  {
    "id": "PA-AI-028",
    "trackId": "ai",
    "moduleId": "B10",
    "type": "mcq",
    "prompt": "In Practice Makes Perfect, what is an important idea?",
    "options": [
      "Practice improves guesses — first tries are wobbly",
      "Ignoring every example you give it",
      "Magic with no patterns",
      "Turning the device off forever"
    ],
    "correctIndex": 0,
    "explanation": "From B10: Practice improves guesses — first tries are wobbly"
  },
  {
    "id": "PA-AI-029",
    "trackId": "ai",
    "moduleId": "B10",
    "type": "true_false",
    "prompt": "Practice improves guesses — first tries are wobbly.",
    "options": [
      "True",
      "False"
    ],
    "correctIndex": 0,
    "explanation": "Yes — that matches Practice Makes Perfect."
  },
  {
    "id": "PA-AI-030",
    "trackId": "ai",
    "moduleId": "B10",
    "type": "mcq",
    "prompt": "After learning Practice Makes Perfect, what should you be able to do?",
    "options": [
      "Say why we test with new examples",
      "Only paper and pencils",
      "AI is always perfect and never wrong",
      "Turning the device off forever"
    ],
    "correctIndex": 0,
    "explanation": "A goal of B10 is: Say why we test with new examples"
  },
  {
    "id": "PA-AI-031",
    "trackId": "ai",
    "moduleId": "B11",
    "type": "mcq",
    "prompt": "In Can Computers See?, what is an important idea?",
    "options": [
      "Seeing for a computer = matching patterns in pixels, not ‘eyeballs’",
      "A rock that never learns",
      "A broken calculator stuck on zero",
      "Turning the device off forever"
    ],
    "correctIndex": 0,
    "explanation": "From B11: Seeing for a computer = matching patterns in pixels, not ‘eyeballs’"
  },
  {
    "id": "PA-AI-032",
    "trackId": "ai",
    "moduleId": "B11",
    "type": "true_false",
    "prompt": "Seeing for a computer = matching patterns in pixels, not ‘eyeballs’.",
    "options": [
      "True",
      "False"
    ],
    "correctIndex": 0,
    "explanation": "Yes — that matches Can Computers See?."
  },
  {
    "id": "PA-AI-033",
    "trackId": "ai",
    "moduleId": "B11",
    "type": "mcq",
    "prompt": "After learning Can Computers See?, what should you be able to do?",
    "options": [
      "Describe computer vision as pattern-matching in pictures",
      "Ignoring every example you give it",
      "Magic with no patterns",
      "Turning the device off forever"
    ],
    "correctIndex": 0,
    "explanation": "A goal of B11 is: Describe computer vision as pattern-matching in pictures"
  },
  {
    "id": "PA-AI-034",
    "trackId": "ai",
    "moduleId": "B12",
    "type": "mcq",
    "prompt": "In Can Computers Listen?, what is an important idea?",
    "options": [
      "Listening = turning sound into words, then matching patterns",
      "Only paper and pencils",
      "AI is always perfect and never wrong",
      "Turning the device off forever"
    ],
    "correctIndex": 0,
    "explanation": "From B12: Listening = turning sound into words, then matching patterns"
  },
  {
    "id": "PA-AI-035",
    "trackId": "ai",
    "moduleId": "B12",
    "type": "true_false",
    "prompt": "Listening = turning sound into words, then matching patterns.",
    "options": [
      "True",
      "False"
    ],
    "correctIndex": 0,
    "explanation": "Yes — that matches Can Computers Listen?."
  },
  {
    "id": "PA-AI-036",
    "trackId": "ai",
    "moduleId": "B12",
    "type": "mcq",
    "prompt": "After learning Can Computers Listen?, what should you be able to do?",
    "options": [
      "Explain voice assistants at kid level",
      "A rock that never learns",
      "A broken calculator stuck on zero",
      "Turning the device off forever"
    ],
    "correctIndex": 0,
    "explanation": "A goal of B12 is: Explain voice assistants at kid level"
  },
  {
    "id": "PA-AI-037",
    "trackId": "ai",
    "moduleId": "B13",
    "type": "mcq",
    "prompt": "In Chatting With Computers, what is an important idea?",
    "options": [
      "A chatbot picks a reply from patterns in your words",
      "Only paper and pencils",
      "AI is always perfect and never wrong",
      "Turning the device off forever"
    ],
    "correctIndex": 0,
    "explanation": "From B13: A chatbot picks a reply from patterns in your words"
  },
  {
    "id": "PA-AI-038",
    "trackId": "ai",
    "moduleId": "B13",
    "type": "true_false",
    "prompt": "A chatbot picks a reply from patterns in your words.",
    "options": [
      "True",
      "False"
    ],
    "correctIndex": 0,
    "explanation": "Yes — that matches Chatting With Computers."
  },
  {
    "id": "PA-AI-039",
    "trackId": "ai",
    "moduleId": "B13",
    "type": "mcq",
    "prompt": "After learning Chatting With Computers, what should you be able to do?",
    "options": [
      "Say a chatbot predicts replies; it doesn’t have feelings",
      "Ignoring every example you give it",
      "Magic with no patterns",
      "Turning the device off forever"
    ],
    "correctIndex": 0,
    "explanation": "A goal of B13 is: Say a chatbot predicts replies; it doesn’t have feelings"
  },
  {
    "id": "PA-AI-040",
    "trackId": "ai",
    "moduleId": "B14",
    "type": "mcq",
    "prompt": "In Faces, Filters, and Fun, what is an important idea?",
    "options": [
      "Filters find a face, then stick ears or glasses on points",
      "Only paper and pencils",
      "AI is always perfect and never wrong",
      "Turning the device off forever"
    ],
    "correctIndex": 0,
    "explanation": "From B14: Filters find a face, then stick ears or glasses on points"
  },
  {
    "id": "PA-AI-041",
    "trackId": "ai",
    "moduleId": "B14",
    "type": "true_false",
    "prompt": "Filters find a face, then stick ears or glasses on points.",
    "options": [
      "True",
      "False"
    ],
    "correctIndex": 0,
    "explanation": "Yes — that matches Faces, Filters, and Fun."
  },
  {
    "id": "PA-AI-042",
    "trackId": "ai",
    "moduleId": "B14",
    "type": "mcq",
    "prompt": "After learning Faces, Filters, and Fun, what should you be able to do?",
    "options": [
      "Describe a filter as ‘find face + draw on top’",
      "A rock that never learns",
      "A broken calculator stuck on zero",
      "Turning the device off forever"
    ],
    "correctIndex": 0,
    "explanation": "A goal of B14 is: Describe a filter as ‘find face + draw on top’"
  },
  {
    "id": "PA-AI-043",
    "trackId": "ai",
    "moduleId": "B15",
    "type": "mcq",
    "prompt": "In AI in Games, what is an important idea?",
    "options": [
      "Game characters follow rules: if player is near, chase; else patrol",
      "A rock that never learns",
      "A broken calculator stuck on zero",
      "Turning the device off forever"
    ],
    "correctIndex": 0,
    "explanation": "From B15: Game characters follow rules: if player is near, chase; else patrol"
  },
  {
    "id": "PA-AI-044",
    "trackId": "ai",
    "moduleId": "B15",
    "type": "true_false",
    "prompt": "Game characters follow rules: if player is near, chase; else patrol.",
    "options": [
      "True",
      "False"
    ],
    "correctIndex": 0,
    "explanation": "Yes — that matches AI in Games."
  },
  {
    "id": "PA-AI-045",
    "trackId": "ai",
    "moduleId": "B15",
    "type": "mcq",
    "prompt": "After learning AI in Games, what should you be able to do?",
    "options": [
      "Write two if/then rules for a game character",
      "Ignoring every example you give it",
      "Magic with no patterns",
      "Turning the device off forever"
    ],
    "correctIndex": 0,
    "explanation": "A goal of B15 is: Write two if/then rules for a game character"
  },
  {
    "id": "PA-AI-046",
    "trackId": "ai",
    "moduleId": "B16",
    "type": "mcq",
    "prompt": "In Is AI Fair?, what is an important idea?",
    "options": [
      "If AI only sees one kind of example, it treats others unfairly",
      "Ignoring every example you give it",
      "Magic with no patterns",
      "Turning the device off forever"
    ],
    "correctIndex": 0,
    "explanation": "From B16: If AI only sees one kind of example, it treats others unfairly"
  },
  {
    "id": "PA-AI-047",
    "trackId": "ai",
    "moduleId": "B16",
    "type": "true_false",
    "prompt": "If AI only sees one kind of example, it treats others unfairly.",
    "options": [
      "True",
      "False"
    ],
    "correctIndex": 0,
    "explanation": "Yes — that matches Is AI Fair?."
  },
  {
    "id": "PA-AI-048",
    "trackId": "ai",
    "moduleId": "B16",
    "type": "mcq",
    "prompt": "After learning Is AI Fair?, what should you be able to do?",
    "options": [
      "Explain unfair AI as ‘not enough kinds of examples’",
      "Only paper and pencils",
      "AI is always perfect and never wrong",
      "Turning the device off forever"
    ],
    "correctIndex": 0,
    "explanation": "A goal of B16 is: Explain unfair AI as ‘not enough kinds of examples’"
  },
  {
    "id": "PA-AI-049",
    "trackId": "ai",
    "moduleId": "B17",
    "type": "mcq",
    "prompt": "In AI and Privacy, what is an important idea?",
    "options": [
      "Privacy: AI doesn’t need your full life story to help with homework",
      "A rock that never learns",
      "A broken calculator stuck on zero",
      "Turning the device off forever"
    ],
    "correctIndex": 0,
    "explanation": "From B17: Privacy: AI doesn’t need your full life story to help with homework"
  },
  {
    "id": "PA-AI-050",
    "trackId": "ai",
    "moduleId": "B17",
    "type": "true_false",
    "prompt": "Privacy: AI doesn’t need your full life story to help with homework.",
    "options": [
      "True",
      "False"
    ],
    "correctIndex": 0,
    "explanation": "Yes — that matches AI and Privacy."
  },
  {
    "id": "PA-AI-051",
    "trackId": "ai",
    "moduleId": "B17",
    "type": "mcq",
    "prompt": "After learning AI and Privacy, what should you be able to do?",
    "options": [
      "Name two pieces of information to keep private",
      "A rock that never learns",
      "A broken calculator stuck on zero",
      "Turning the device off forever"
    ],
    "correctIndex": 0,
    "explanation": "A goal of B17 is: Name two pieces of information to keep private"
  },
  {
    "id": "PA-AI-052",
    "trackId": "ai",
    "moduleId": "B18",
    "type": "mcq",
    "prompt": "In Real or AI-Made?, what is an important idea?",
    "options": [
      "Some pictures and voices can be made by AI",
      "Only paper and pencils",
      "AI is always perfect and never wrong",
      "Turning the device off forever"
    ],
    "correctIndex": 0,
    "explanation": "From B18: Some pictures and voices can be made by AI"
  },
  {
    "id": "PA-AI-053",
    "trackId": "ai",
    "moduleId": "B18",
    "type": "true_false",
    "prompt": "Some pictures and voices can be made by AI.",
    "options": [
      "True",
      "False"
    ],
    "correctIndex": 0,
    "explanation": "Yes — that matches Real or AI-Made?."
  },
  {
    "id": "PA-AI-054",
    "trackId": "ai",
    "moduleId": "B18",
    "type": "mcq",
    "prompt": "After learning Real or AI-Made?, what should you be able to do?",
    "options": [
      "Pause before believing a surprising picture",
      "A rock that never learns",
      "A broken calculator stuck on zero",
      "Turning the device off forever"
    ],
    "correctIndex": 0,
    "explanation": "A goal of B18 is: Pause before believing a surprising picture"
  },
  {
    "id": "PA-AI-055",
    "trackId": "ai",
    "moduleId": "B19",
    "type": "mcq",
    "prompt": "In AI Helping Doctors, Scientists, Artists, what is an important idea?",
    "options": [
      "AI helping: spotting plants, reading for people who can’t see well, finding routes",
      "A rock that never learns",
      "A broken calculator stuck on zero",
      "Turning the device off forever"
    ],
    "correctIndex": 0,
    "explanation": "From B19: AI helping: spotting plants, reading for people who can’t see well, finding routes"
  },
  {
    "id": "PA-AI-056",
    "trackId": "ai",
    "moduleId": "B19",
    "type": "true_false",
    "prompt": "AI helping: spotting plants, reading for people who can’t see well, finding routes.",
    "options": [
      "True",
      "False"
    ],
    "correctIndex": 0,
    "explanation": "Yes — that matches AI Helping Doctors, Scientists, Artists."
  },
  {
    "id": "PA-AI-057",
    "trackId": "ai",
    "moduleId": "B19",
    "type": "mcq",
    "prompt": "After learning AI Helping Doctors, Scientists, Artists, what should you be able to do?",
    "options": [
      "Name two helpful uses of AI",
      "Only paper and pencils",
      "AI is always perfect and never wrong",
      "Turning the device off forever"
    ],
    "correctIndex": 0,
    "explanation": "A goal of B19 is: Name two helpful uses of AI"
  },
  {
    "id": "PA-AI-058",
    "trackId": "ai",
    "moduleId": "B20",
    "type": "mcq",
    "prompt": "In Capstone: Imagine Your Own AI Helper, what is an important idea?",
    "options": [
      "Capstone: invent an AI helper for school or home",
      "Only paper and pencils",
      "AI is always perfect and never wrong",
      "Turning the device off forever"
    ],
    "correctIndex": 0,
    "explanation": "From B20: Capstone: invent an AI helper for school or home"
  },
  {
    "id": "PA-AI-059",
    "trackId": "ai",
    "moduleId": "B20",
    "type": "true_false",
    "prompt": "Capstone: invent an AI helper for school or home.",
    "options": [
      "True",
      "False"
    ],
    "correctIndex": 0,
    "explanation": "Yes — that matches Capstone: Imagine Your Own AI Helper."
  },
  {
    "id": "PA-AI-060",
    "trackId": "ai",
    "moduleId": "B20",
    "type": "mcq",
    "prompt": "After learning Capstone: Imagine Your Own AI Helper, what should you be able to do?",
    "options": [
      "Design a helper with user + job + one privacy rule",
      "Ignoring every example you give it",
      "Magic with no patterns",
      "Turning the device off forever"
    ],
    "correctIndex": 0,
    "explanation": "A goal of B20 is: Design a helper with user + job + one privacy rule"
  },
  {
    "id": "PA-AI-061",
    "trackId": "ai",
    "moduleId": "B1",
    "type": "true_false",
    "prompt": "Computers never use ideas from “B1” at all.",
    "options": [
      "True",
      "False"
    ],
    "correctIndex": 1,
    "explanation": "False — B1 ideas matter in this track."
  },
  {
    "id": "PA-AI-062",
    "trackId": "ai",
    "moduleId": "B2",
    "type": "mcq",
    "prompt": "Which sentence fits Smart vs. Simple best?",
    "options": [
      "AI programs change what they do after more examples",
      "Only paper and pencils",
      "AI is always perfect and never wrong",
      "Turning the device off forever"
    ],
    "correctIndex": 0,
    "explanation": "Practice focus: Sort 10 tools: alarm clock, spellcheck, voice assistant, torch"
  },
  {
    "id": "PA-AI-063",
    "trackId": "ai",
    "moduleId": "B3",
    "type": "mcq",
    "prompt": "Which sentence fits Where AI Hides in Daily Life best?",
    "options": [
      "Not everything smart-looking is AI (a blinking toy)",
      "Only paper and pencils",
      "AI is always perfect and never wrong",
      "Turning the device off forever"
    ],
    "correctIndex": 0,
    "explanation": "Practice focus: Spot AI in 10 scene cards (kitchen, car, class, phone)"
  },
  {
    "id": "PA-AI-064",
    "trackId": "ai",
    "moduleId": "B4",
    "type": "true_false",
    "prompt": "Computers never use ideas from “B4” at all.",
    "options": [
      "True",
      "False"
    ],
    "correctIndex": 1,
    "explanation": "False — B4 ideas matter in this track."
  },
  {
    "id": "PA-AI-065",
    "trackId": "ai",
    "moduleId": "B5",
    "type": "mcq",
    "prompt": "Which sentence fits AI Helpers Around the World best?",
    "options": [
      "AI helpers exist in many countries — same idea, local languages",
      "Only paper and pencils",
      "AI is always perfect and never wrong",
      "Turning the device off forever"
    ],
    "correctIndex": 0,
    "explanation": "Practice focus: Match helper → job (translate, navigate, caption)"
  },
  {
    "id": "PA-AI-066",
    "trackId": "ai",
    "moduleId": "B6",
    "type": "mcq",
    "prompt": "Which sentence fits Teaching a Computer Like Teaching a Puppy best?",
    "options": [
      "Training = showing labelled examples",
      "Only paper and pencils",
      "AI is always perfect and never wrong",
      "Turning the device off forever"
    ],
    "correctIndex": 0,
    "explanation": "Practice focus: Choose better training sets (many cats vs one cat); order train → test"
  },
  {
    "id": "PA-AI-067",
    "trackId": "ai",
    "moduleId": "B7",
    "type": "true_false",
    "prompt": "Computers never use ideas from “B7” at all.",
    "options": [
      "True",
      "False"
    ],
    "correctIndex": 1,
    "explanation": "False — B7 ideas matter in this track."
  },
  {
    "id": "PA-MATH-001",
    "trackId": "math",
    "moduleId": "C1",
    "type": "mcq",
    "prompt": "In Counting the Computer Way, what is an important idea?",
    "options": [
      "Count the computer way: 0 and 1 only (link to CS A2)",
      "Mixing shapes into spaghetti",
      "Pretending patterns do not exist",
      "Turning the device off forever"
    ],
    "correctIndex": 0,
    "explanation": "From C1: Count the computer way: 0 and 1 only (link to CS A2)"
  },
  {
    "id": "PA-MATH-002",
    "trackId": "math",
    "moduleId": "C1",
    "type": "true_false",
    "prompt": "Count the computer way: 0 and 1 only (link to CS A2).",
    "options": [
      "True",
      "False"
    ],
    "correctIndex": 0,
    "explanation": "Yes — that matches Counting the Computer Way."
  },
  {
    "id": "PA-MATH-003",
    "trackId": "math",
    "moduleId": "C1",
    "type": "mcq",
    "prompt": "After learning Counting the Computer Way, what should you be able to do?",
    "options": [
      "Count 0–5 using on/off lights",
      "Closing your eyes and hopping",
      "Guessing with no plan at all",
      "Turning the device off forever"
    ],
    "correctIndex": 0,
    "explanation": "A goal of C1 is: Count 0–5 using on/off lights"
  },
  {
    "id": "PA-MATH-004",
    "trackId": "math",
    "moduleId": "C2",
    "type": "mcq",
    "prompt": "In Odd, Even, and Patterns, what is an important idea?",
    "options": [
      "Odd and even; clap patterns",
      "Erasing all the numbers",
      "Counting backwards forever by accident",
      "Turning the device off forever"
    ],
    "correctIndex": 0,
    "explanation": "From C2: Odd and even; clap patterns"
  },
  {
    "id": "PA-MATH-005",
    "trackId": "math",
    "moduleId": "C2",
    "type": "true_false",
    "prompt": "Odd and even; clap patterns.",
    "options": [
      "True",
      "False"
    ],
    "correctIndex": 0,
    "explanation": "Yes — that matches Odd, Even, and Patterns."
  },
  {
    "id": "PA-MATH-006",
    "trackId": "math",
    "moduleId": "C2",
    "type": "mcq",
    "prompt": "After learning Odd, Even, and Patterns, what should you be able to do?",
    "options": [
      "Sort numbers to 20 into odd/even",
      "Closing your eyes and hopping",
      "Guessing with no plan at all",
      "Turning the device off forever"
    ],
    "correctIndex": 0,
    "explanation": "A goal of C2 is: Sort numbers to 20 into odd/even"
  },
  {
    "id": "PA-MATH-007",
    "trackId": "math",
    "moduleId": "C3",
    "type": "mcq",
    "prompt": "In Place Value Power-Up, what is an important idea?",
    "options": [
      "Ones, tens, hundreds — why 23 is different from 32",
      "Closing your eyes and hopping",
      "Guessing with no plan at all",
      "Turning the device off forever"
    ],
    "correctIndex": 0,
    "explanation": "From C3: Ones, tens, hundreds — why 23 is different from 32"
  },
  {
    "id": "PA-MATH-008",
    "trackId": "math",
    "moduleId": "C3",
    "type": "true_false",
    "prompt": "Ones, tens, hundreds — why 23 is different from 32.",
    "options": [
      "True",
      "False"
    ],
    "correctIndex": 0,
    "explanation": "Yes — that matches Place Value Power-Up."
  },
  {
    "id": "PA-MATH-009",
    "trackId": "math",
    "moduleId": "C3",
    "type": "mcq",
    "prompt": "After learning Place Value Power-Up, what should you be able to do?",
    "options": [
      "Say the value of a digit in a 2- or 3-digit number",
      "Closing your eyes and hopping",
      "Guessing with no plan at all",
      "Turning the device off forever"
    ],
    "correctIndex": 0,
    "explanation": "A goal of C3 is: Say the value of a digit in a 2- or 3-digit number"
  },
  {
    "id": "PA-MATH-010",
    "trackId": "math",
    "moduleId": "C4",
    "type": "mcq",
    "prompt": "In Skip Counting & Sequences, what is an important idea?",
    "options": [
      "Skip counting by 2, 5, 10 — the beat of a loop",
      "Mixing shapes into spaghetti",
      "Pretending patterns do not exist",
      "Turning the device off forever"
    ],
    "correctIndex": 0,
    "explanation": "From C4: Skip counting by 2, 5, 10 — the beat of a loop"
  },
  {
    "id": "PA-MATH-011",
    "trackId": "math",
    "moduleId": "C4",
    "type": "true_false",
    "prompt": "Skip counting by 2, 5, 10 — the beat of a loop.",
    "options": [
      "True",
      "False"
    ],
    "correctIndex": 0,
    "explanation": "Yes — that matches Skip Counting & Sequences."
  },
  {
    "id": "PA-MATH-012",
    "trackId": "math",
    "moduleId": "C4",
    "type": "mcq",
    "prompt": "After learning Skip Counting & Sequences, what should you be able to do?",
    "options": [
      "Skip-count by 2, 5, or 10 up to 50",
      "Mixing shapes into spaghetti",
      "Pretending patterns do not exist",
      "Turning the device off forever"
    ],
    "correctIndex": 0,
    "explanation": "A goal of C4 is: Skip-count by 2, 5, or 10 up to 50"
  },
  {
    "id": "PA-MATH-013",
    "trackId": "math",
    "moduleId": "C5",
    "type": "mcq",
    "prompt": "In Number Patterns Playground, what is an important idea?",
    "options": [
      "Growing patterns: add 1 more each time (1, 2, 4 squares — keep it visual)",
      "Mixing shapes into spaghetti",
      "Pretending patterns do not exist",
      "Turning the device off forever"
    ],
    "correctIndex": 0,
    "explanation": "From C5: Growing patterns: add 1 more each time (1, 2, 4 squares — keep it visual)"
  },
  {
    "id": "PA-MATH-014",
    "trackId": "math",
    "moduleId": "C5",
    "type": "true_false",
    "prompt": "Growing patterns: add 1 more each time (1, 2, 4 squares — keep it visual).",
    "options": [
      "True",
      "False"
    ],
    "correctIndex": 0,
    "explanation": "Yes — that matches Number Patterns Playground."
  },
  {
    "id": "PA-MATH-015",
    "trackId": "math",
    "moduleId": "C5",
    "type": "mcq",
    "prompt": "After learning Number Patterns Playground, what should you be able to do?",
    "options": [
      "Draw or choose the next figure in a growing pattern",
      "Erasing all the numbers",
      "Counting backwards forever by accident",
      "Turning the device off forever"
    ],
    "correctIndex": 0,
    "explanation": "A goal of C5 is: Draw or choose the next figure in a growing pattern"
  },
  {
    "id": "PA-MATH-016",
    "trackId": "math",
    "moduleId": "C6",
    "type": "mcq",
    "prompt": "In True or False?, what is an important idea?",
    "options": [
      "A statement is true or false — not ‘maybe’ for this game",
      "Closing your eyes and hopping",
      "Guessing with no plan at all",
      "Turning the device off forever"
    ],
    "correctIndex": 0,
    "explanation": "From C6: A statement is true or false — not ‘maybe’ for this game"
  },
  {
    "id": "PA-MATH-017",
    "trackId": "math",
    "moduleId": "C6",
    "type": "true_false",
    "prompt": "A statement is true or false — not ‘maybe’ for this game.",
    "options": [
      "True",
      "False"
    ],
    "correctIndex": 0,
    "explanation": "Yes — that matches True or False?."
  },
  {
    "id": "PA-MATH-018",
    "trackId": "math",
    "moduleId": "C6",
    "type": "mcq",
    "prompt": "After learning True or False?, what should you be able to do?",
    "options": [
      "Mark simple statements true or false",
      "Erasing all the numbers",
      "Counting backwards forever by accident",
      "Turning the device off forever"
    ],
    "correctIndex": 0,
    "explanation": "A goal of C6 is: Mark simple statements true or false"
  },
  {
    "id": "PA-MATH-019",
    "trackId": "math",
    "moduleId": "C7",
    "type": "mcq",
    "prompt": "In AND, OR, NOT for Kids, what is an important idea?",
    "options": [
      "AND = both must be true (cake AND juice for the party)",
      "Erasing all the numbers",
      "Counting backwards forever by accident",
      "Turning the device off forever"
    ],
    "correctIndex": 0,
    "explanation": "From C7: AND = both must be true (cake AND juice for the party)"
  },
  {
    "id": "PA-MATH-020",
    "trackId": "math",
    "moduleId": "C7",
    "type": "true_false",
    "prompt": "AND = both must be true (cake AND juice for the party).",
    "options": [
      "True",
      "False"
    ],
    "correctIndex": 0,
    "explanation": "Yes — that matches AND, OR, NOT for Kids."
  },
  {
    "id": "PA-MATH-021",
    "trackId": "math",
    "moduleId": "C7",
    "type": "mcq",
    "prompt": "After learning AND, OR, NOT for Kids, what should you be able to do?",
    "options": [
      "Solve a kid AND/OR/NOT story",
      "Mixing shapes into spaghetti",
      "Pretending patterns do not exist",
      "Turning the device off forever"
    ],
    "correctIndex": 0,
    "explanation": "A goal of C7 is: Solve a kid AND/OR/NOT story"
  },
  {
    "id": "PA-MATH-022",
    "trackId": "math",
    "moduleId": "C8",
    "type": "mcq",
    "prompt": "In Sorting and Comparing, what is an important idea?",
    "options": [
      "Compare: greater than, less than, equal",
      "Erasing all the numbers",
      "Counting backwards forever by accident",
      "Turning the device off forever"
    ],
    "correctIndex": 0,
    "explanation": "From C8: Compare: greater than, less than, equal"
  },
  {
    "id": "PA-MATH-023",
    "trackId": "math",
    "moduleId": "C8",
    "type": "true_false",
    "prompt": "Compare: greater than, less than, equal.",
    "options": [
      "True",
      "False"
    ],
    "correctIndex": 0,
    "explanation": "Yes — that matches Sorting and Comparing."
  },
  {
    "id": "PA-MATH-024",
    "trackId": "math",
    "moduleId": "C8",
    "type": "mcq",
    "prompt": "After learning Sorting and Comparing, what should you be able to do?",
    "options": [
      "Compare two numbers up to 100 (Class 3) or 1000 (Class 4–5)",
      "Closing your eyes and hopping",
      "Guessing with no plan at all",
      "Turning the device off forever"
    ],
    "correctIndex": 0,
    "explanation": "A goal of C8 is: Compare two numbers up to 100 (Class 3) or 1000 (Class 4–5)"
  },
  {
    "id": "PA-MATH-025",
    "trackId": "math",
    "moduleId": "C9",
    "type": "mcq",
    "prompt": "In Sets — Things That Belong Together, what is an important idea?",
    "options": [
      "A set is a group that belongs together",
      "Closing your eyes and hopping",
      "Guessing with no plan at all",
      "Turning the device off forever"
    ],
    "correctIndex": 0,
    "explanation": "From C9: A set is a group that belongs together"
  },
  {
    "id": "PA-MATH-026",
    "trackId": "math",
    "moduleId": "C9",
    "type": "true_false",
    "prompt": "A set is a group that belongs together.",
    "options": [
      "True",
      "False"
    ],
    "correctIndex": 0,
    "explanation": "Yes — that matches Sets — Things That Belong Together."
  },
  {
    "id": "PA-MATH-027",
    "trackId": "math",
    "moduleId": "C9",
    "type": "mcq",
    "prompt": "After learning Sets — Things That Belong Together, what should you be able to do?",
    "options": [
      "Place items in a two-circle Venn",
      "Closing your eyes and hopping",
      "Guessing with no plan at all",
      "Turning the device off forever"
    ],
    "correctIndex": 0,
    "explanation": "A goal of C9 is: Place items in a two-circle Venn"
  },
  {
    "id": "PA-MATH-028",
    "trackId": "math",
    "moduleId": "C10",
    "type": "mcq",
    "prompt": "In Solving Puzzles Step by Step, what is an important idea?",
    "options": [
      "Logic puzzles: one clue at a time (who sits where)",
      "Closing your eyes and hopping",
      "Guessing with no plan at all",
      "Turning the device off forever"
    ],
    "correctIndex": 0,
    "explanation": "From C10: Logic puzzles: one clue at a time (who sits where)"
  },
  {
    "id": "PA-MATH-029",
    "trackId": "math",
    "moduleId": "C10",
    "type": "true_false",
    "prompt": "Logic puzzles: one clue at a time (who sits where).",
    "options": [
      "True",
      "False"
    ],
    "correctIndex": 0,
    "explanation": "Yes — that matches Solving Puzzles Step by Step."
  },
  {
    "id": "PA-MATH-030",
    "trackId": "math",
    "moduleId": "C10",
    "type": "mcq",
    "prompt": "After learning Solving Puzzles Step by Step, what should you be able to do?",
    "options": [
      "Solve a 3-clue logic grid with help",
      "Closing your eyes and hopping",
      "Guessing with no plan at all",
      "Turning the device off forever"
    ],
    "correctIndex": 0,
    "explanation": "A goal of C10 is: Solve a 3-clue logic grid with help"
  },
  {
    "id": "PA-MATH-031",
    "trackId": "math",
    "moduleId": "C11",
    "type": "mcq",
    "prompt": "In Shapes All Around, what is an important idea?",
    "options": [
      "2D shapes: sides, corners, square vs rectangle vs triangle vs circle",
      "Closing your eyes and hopping",
      "Guessing with no plan at all",
      "Turning the device off forever"
    ],
    "correctIndex": 0,
    "explanation": "From C11: 2D shapes: sides, corners, square vs rectangle vs triangle vs circle"
  },
  {
    "id": "PA-MATH-032",
    "trackId": "math",
    "moduleId": "C11",
    "type": "true_false",
    "prompt": "2D shapes: sides, corners, square vs rectangle vs triangle vs circle.",
    "options": [
      "True",
      "False"
    ],
    "correctIndex": 0,
    "explanation": "Yes — that matches Shapes All Around."
  },
  {
    "id": "PA-MATH-033",
    "trackId": "math",
    "moduleId": "C11",
    "type": "mcq",
    "prompt": "After learning Shapes All Around, what should you be able to do?",
    "options": [
      "Name and count sides of common 2D shapes",
      "Mixing shapes into spaghetti",
      "Pretending patterns do not exist",
      "Turning the device off forever"
    ],
    "correctIndex": 0,
    "explanation": "A goal of C11 is: Name and count sides of common 2D shapes"
  },
  {
    "id": "PA-MATH-034",
    "trackId": "math",
    "moduleId": "C12",
    "type": "mcq",
    "prompt": "In Grids and Coordinates, what is an important idea?",
    "options": [
      "A grid is rows and columns; a point has an address (2, 3)",
      "Erasing all the numbers",
      "Counting backwards forever by accident",
      "Turning the device off forever"
    ],
    "correctIndex": 0,
    "explanation": "From C12: A grid is rows and columns; a point has an address (2, 3)"
  },
  {
    "id": "PA-MATH-035",
    "trackId": "math",
    "moduleId": "C12",
    "type": "true_false",
    "prompt": "A grid is rows and columns; a point has an address (2, 3).",
    "options": [
      "True",
      "False"
    ],
    "correctIndex": 0,
    "explanation": "Yes — that matches Grids and Coordinates."
  },
  {
    "id": "PA-MATH-036",
    "trackId": "math",
    "moduleId": "C12",
    "type": "mcq",
    "prompt": "After learning Grids and Coordinates, what should you be able to do?",
    "options": [
      "Plot a point on a 5×5 grid",
      "Closing your eyes and hopping",
      "Guessing with no plan at all",
      "Turning the device off forever"
    ],
    "correctIndex": 0,
    "explanation": "A goal of C12 is: Plot a point on a 5×5 grid"
  },
  {
    "id": "PA-MATH-037",
    "trackId": "math",
    "moduleId": "C13",
    "type": "mcq",
    "prompt": "In Symmetry and Patterns, what is an important idea?",
    "options": [
      "Line symmetry: a fold that matches",
      "Mixing shapes into spaghetti",
      "Pretending patterns do not exist",
      "Turning the device off forever"
    ],
    "correctIndex": 0,
    "explanation": "From C13: Line symmetry: a fold that matches"
  },
  {
    "id": "PA-MATH-038",
    "trackId": "math",
    "moduleId": "C13",
    "type": "true_false",
    "prompt": "Line symmetry: a fold that matches.",
    "options": [
      "True",
      "False"
    ],
    "correctIndex": 0,
    "explanation": "Yes — that matches Symmetry and Patterns."
  },
  {
    "id": "PA-MATH-039",
    "trackId": "math",
    "moduleId": "C13",
    "type": "mcq",
    "prompt": "After learning Symmetry and Patterns, what should you be able to do?",
    "options": [
      "Find a line of symmetry on a simple shape",
      "Closing your eyes and hopping",
      "Guessing with no plan at all",
      "Turning the device off forever"
    ],
    "correctIndex": 0,
    "explanation": "A goal of C13 is: Find a line of symmetry on a simple shape"
  },
  {
    "id": "PA-MATH-040",
    "trackId": "math",
    "moduleId": "C14",
    "type": "mcq",
    "prompt": "In Angles and Turns, what is an important idea?",
    "options": [
      "A turn of 90° is a quarter turn — right or left",
      "Closing your eyes and hopping",
      "Guessing with no plan at all",
      "Turning the device off forever"
    ],
    "correctIndex": 0,
    "explanation": "From C14: A turn of 90° is a quarter turn — right or left"
  },
  {
    "id": "PA-MATH-041",
    "trackId": "math",
    "moduleId": "C14",
    "type": "true_false",
    "prompt": "A turn of 90° is a quarter turn — right or left.",
    "options": [
      "True",
      "False"
    ],
    "correctIndex": 0,
    "explanation": "Yes — that matches Angles and Turns."
  },
  {
    "id": "PA-MATH-042",
    "trackId": "math",
    "moduleId": "C14",
    "type": "mcq",
    "prompt": "After learning Angles and Turns, what should you be able to do?",
    "options": [
      "Face a new direction after 1–3 quarter turns",
      "Closing your eyes and hopping",
      "Guessing with no plan at all",
      "Turning the device off forever"
    ],
    "correctIndex": 0,
    "explanation": "A goal of C14 is: Face a new direction after 1–3 quarter turns"
  },
  {
    "id": "PA-MATH-043",
    "trackId": "math",
    "moduleId": "C15",
    "type": "mcq",
    "prompt": "In Draw With Math, what is an important idea?",
    "options": [
      "Draw with commands: forward, turn 90, repeat 4 → square",
      "Mixing shapes into spaghetti",
      "Pretending patterns do not exist",
      "Turning the device off forever"
    ],
    "correctIndex": 0,
    "explanation": "From C15: Draw with commands: forward, turn 90, repeat 4 → square"
  },
  {
    "id": "PA-MATH-044",
    "trackId": "math",
    "moduleId": "C15",
    "type": "true_false",
    "prompt": "Draw with commands: forward, turn 90, repeat 4 → square.",
    "options": [
      "True",
      "False"
    ],
    "correctIndex": 0,
    "explanation": "Yes — that matches Draw With Math."
  },
  {
    "id": "PA-MATH-045",
    "trackId": "math",
    "moduleId": "C15",
    "type": "mcq",
    "prompt": "After learning Draw With Math, what should you be able to do?",
    "options": [
      "Write commands for a square",
      "Erasing all the numbers",
      "Counting backwards forever by accident",
      "Turning the device off forever"
    ],
    "correctIndex": 0,
    "explanation": "A goal of C15 is: Write commands for a square"
  },
  {
    "id": "PA-MATH-046",
    "trackId": "math",
    "moduleId": "C16",
    "type": "mcq",
    "prompt": "In Estimation and Guess-Check-Improve, what is an important idea?",
    "options": [
      "Estimate first, then check — like debugging",
      "Mixing shapes into spaghetti",
      "Pretending patterns do not exist",
      "Turning the device off forever"
    ],
    "correctIndex": 0,
    "explanation": "From C16: Estimate first, then check — like debugging"
  },
  {
    "id": "PA-MATH-047",
    "trackId": "math",
    "moduleId": "C16",
    "type": "true_false",
    "prompt": "Estimate first, then check — like debugging.",
    "options": [
      "True",
      "False"
    ],
    "correctIndex": 0,
    "explanation": "Yes — that matches Estimation and Guess-Check-Improve."
  },
  {
    "id": "PA-MATH-048",
    "trackId": "math",
    "moduleId": "C16",
    "type": "mcq",
    "prompt": "After learning Estimation and Guess-Check-Improve, what should you be able to do?",
    "options": [
      "Give a sensible estimate for a pile or a length",
      "Closing your eyes and hopping",
      "Guessing with no plan at all",
      "Turning the device off forever"
    ],
    "correctIndex": 0,
    "explanation": "A goal of C16 is: Give a sensible estimate for a pile or a length"
  },
  {
    "id": "PA-MATH-049",
    "trackId": "math",
    "moduleId": "C17",
    "type": "mcq",
    "prompt": "In Probability — What Are the Chances?, what is an important idea?",
    "options": [
      "Chance words: certain, likely, unlikely, impossible",
      "Erasing all the numbers",
      "Counting backwards forever by accident",
      "Turning the device off forever"
    ],
    "correctIndex": 0,
    "explanation": "From C17: Chance words: certain, likely, unlikely, impossible"
  },
  {
    "id": "PA-MATH-050",
    "trackId": "math",
    "moduleId": "C17",
    "type": "true_false",
    "prompt": "Chance words: certain, likely, unlikely, impossible.",
    "options": [
      "True",
      "False"
    ],
    "correctIndex": 0,
    "explanation": "Yes — that matches Probability — What Are the Chances?."
  },
  {
    "id": "PA-MATH-051",
    "trackId": "math",
    "moduleId": "C17",
    "type": "mcq",
    "prompt": "After learning Probability — What Are the Chances?, what should you be able to do?",
    "options": [
      "Use a chance word correctly for a simple event",
      "Mixing shapes into spaghetti",
      "Pretending patterns do not exist",
      "Turning the device off forever"
    ],
    "correctIndex": 0,
    "explanation": "A goal of C17 is: Use a chance word correctly for a simple event"
  },
  {
    "id": "PA-MATH-052",
    "trackId": "math",
    "moduleId": "C18",
    "type": "mcq",
    "prompt": "In Working Backwards, what is an important idea?",
    "options": [
      "Work backwards: you have 12 sweets after getting 4, how many at the start?",
      "Closing your eyes and hopping",
      "Guessing with no plan at all",
      "Turning the device off forever"
    ],
    "correctIndex": 0,
    "explanation": "From C18: Work backwards: you have 12 sweets after getting 4, how many at the start?"
  },
  {
    "id": "PA-MATH-053",
    "trackId": "math",
    "moduleId": "C18",
    "type": "true_false",
    "prompt": "Work backwards: you have 12 sweets after getting 4, how many at the start?.",
    "options": [
      "True",
      "False"
    ],
    "correctIndex": 0,
    "explanation": "Yes — that matches Working Backwards."
  },
  {
    "id": "PA-MATH-054",
    "trackId": "math",
    "moduleId": "C18",
    "type": "mcq",
    "prompt": "After learning Working Backwards, what should you be able to do?",
    "options": [
      "Solve a one-step backwards word problem",
      "Erasing all the numbers",
      "Counting backwards forever by accident",
      "Turning the device off forever"
    ],
    "correctIndex": 0,
    "explanation": "A goal of C18 is: Solve a one-step backwards word problem"
  },
  {
    "id": "PA-MATH-055",
    "trackId": "math",
    "moduleId": "C19",
    "type": "mcq",
    "prompt": "In Breaking Big Problems Into Small Ones, what is an important idea?",
    "options": [
      "Big problems break into small jobs (decomposition)",
      "Closing your eyes and hopping",
      "Guessing with no plan at all",
      "Turning the device off forever"
    ],
    "correctIndex": 0,
    "explanation": "From C19: Big problems break into small jobs (decomposition)"
  },
  {
    "id": "PA-MATH-056",
    "trackId": "math",
    "moduleId": "C19",
    "type": "true_false",
    "prompt": "Big problems break into small jobs (decomposition).",
    "options": [
      "True",
      "False"
    ],
    "correctIndex": 0,
    "explanation": "Yes — that matches Breaking Big Problems Into Small Ones."
  },
  {
    "id": "PA-MATH-057",
    "trackId": "math",
    "moduleId": "C19",
    "type": "mcq",
    "prompt": "After learning Breaking Big Problems Into Small Ones, what should you be able to do?",
    "options": [
      "Split a messy task into 3–5 smaller tasks",
      "Closing your eyes and hopping",
      "Guessing with no plan at all",
      "Turning the device off forever"
    ],
    "correctIndex": 0,
    "explanation": "A goal of C19 is: Split a messy task into 3–5 smaller tasks"
  },
  {
    "id": "PA-MATH-058",
    "trackId": "math",
    "moduleId": "C20",
    "type": "mcq",
    "prompt": "In Capstone: Math Puzzle Challenge, what is an important idea?",
    "options": [
      "Capstone mix: one pattern, one Venn or sort, one grid point, one chance word",
      "Mixing shapes into spaghetti",
      "Pretending patterns do not exist",
      "Turning the device off forever"
    ],
    "correctIndex": 0,
    "explanation": "From C20: Capstone mix: one pattern, one Venn or sort, one grid point, one chance word"
  },
  {
    "id": "PA-MATH-059",
    "trackId": "math",
    "moduleId": "C20",
    "type": "true_false",
    "prompt": "Capstone mix: one pattern, one Venn or sort, one grid point, one chance word.",
    "options": [
      "True",
      "False"
    ],
    "correctIndex": 0,
    "explanation": "Yes — that matches Capstone: Math Puzzle Challenge."
  },
  {
    "id": "PA-MATH-060",
    "trackId": "math",
    "moduleId": "C20",
    "type": "mcq",
    "prompt": "After learning Capstone: Math Puzzle Challenge, what should you be able to do?",
    "options": [
      "Solve a mixed puzzle using at least two strategies from the year",
      "Mixing shapes into spaghetti",
      "Pretending patterns do not exist",
      "Turning the device off forever"
    ],
    "correctIndex": 0,
    "explanation": "A goal of C20 is: Solve a mixed puzzle using at least two strategies from the year"
  },
  {
    "id": "PA-MATH-061",
    "trackId": "math",
    "moduleId": "C1",
    "type": "true_false",
    "prompt": "Computers never use ideas from “C1” at all.",
    "options": [
      "True",
      "False"
    ],
    "correctIndex": 1,
    "explanation": "False — C1 ideas matter in this track."
  },
  {
    "id": "PA-MATH-062",
    "trackId": "math",
    "moduleId": "C2",
    "type": "mcq",
    "prompt": "Which sentence fits Odd, Even, and Patterns best?",
    "options": [
      "Patterns are how both maths and code repeat",
      "Mixing shapes into spaghetti",
      "Pretending patterns do not exist",
      "Turning the device off forever"
    ],
    "correctIndex": 0,
    "explanation": "Practice focus: Odd/even sort; next number in a pattern"
  },
  {
    "id": "PA-MATH-063",
    "trackId": "math",
    "moduleId": "C3",
    "type": "mcq",
    "prompt": "Which sentence fits Place Value Power-Up best?",
    "options": [
      "Contrast with binary: different ‘place’ ideas, same ‘position matters’",
      "Mixing shapes into spaghetti",
      "Pretending patterns do not exist",
      "Turning the device off forever"
    ],
    "correctIndex": 0,
    "explanation": "Practice focus: Expand 10 numbers; swap digits and say the new number"
  },
  {
    "id": "PA-MATH-064",
    "trackId": "math",
    "moduleId": "C4",
    "type": "true_false",
    "prompt": "Computers never use ideas from “C4” at all.",
    "options": [
      "True",
      "False"
    ],
    "correctIndex": 1,
    "explanation": "False — C4 ideas matter in this track."
  },
  {
    "id": "PA-MATH-065",
    "trackId": "math",
    "moduleId": "C5",
    "type": "mcq",
    "prompt": "Which sentence fits Number Patterns Playground best?",
    "options": [
      "Fibonacci-lite: 1, 1, 2, 3, 5 as a story of adding the last two — optional, light",
      "Erasing all the numbers",
      "Counting backwards forever by accident",
      "Turning the device off forever"
    ],
    "correctIndex": 0,
    "explanation": "Practice focus: Next picture / next number in 10 growing patterns"
  },
  {
    "id": "PA-MATH-066",
    "trackId": "math",
    "moduleId": "C6",
    "type": "mcq",
    "prompt": "Which sentence fits True or False? best?",
    "options": [
      "‘All birds can fly’ is false (penguins)",
      "Erasing all the numbers",
      "Counting backwards forever by accident",
      "Turning the device off forever"
    ],
    "correctIndex": 0,
    "explanation": "Practice focus: 10 true/false world and maths statements"
  }
];

export const PRACTICE_BANK_TOTAL = PRACTICE_QUESTIONS.length;

export function getPracticeQuestionById(id: string) {
  return PRACTICE_QUESTIONS.find((q) => q.id === id) ?? null;
}

export function getPracticeQuestions(opts?: {
  trackId?: LearnTrackId | "all";
  type?: PracticeQuestionType | "all";
  moduleId?: string;
}) {
  return PRACTICE_QUESTIONS.filter((q) => {
    if (opts?.trackId && opts.trackId !== "all" && q.trackId !== opts.trackId) {
      return false;
    }
    if (opts?.type && opts.type !== "all" && q.type !== opts.type) {
      return false;
    }
    if (opts?.moduleId && q.moduleId !== opts.moduleId) return false;
    return true;
  });
}

export function practiceTrackCounts() {
  const counts: Record<LearnTrackId, number> = { cs: 0, ai: 0, math: 0 };
  for (const q of PRACTICE_QUESTIONS) counts[q.trackId] += 1;
  return counts;
}

export function practiceModuleMeta(moduleId: string) {
  for (const track of LEARN_TRACKS) {
    for (const unit of track.units) {
      const mod = unit.modules.find((m) => m.id === moduleId);
      if (mod) {
        return {
          trackId: track.id,
          trackLabel: track.shortLabel,
          unitTitle: unit.title,
          moduleTitle: mod.title,
          concept: mod.concept,
        };
      }
    }
  }
  return null;
}
