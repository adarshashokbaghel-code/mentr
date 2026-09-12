/** Detailed Class 3–5 lesson plans: video + 10 practice + 1 progress check. */

export type LearnLevel = "Easy" | "Building" | "Stretch" | "Apply";

export type LearnModuleDetail = {
  level: LearnLevel;
  /** What the narrated video teaches */
  teach: string[];
  /** What the child can do after this lesson */
  outcomes: string[];
  /** Focus of the 10 Play Arena practice items */
  practice: string;
  /** Single progress-check / assessment item */
  checkpoint: string;
};

export const PRACTICE_PER_MODULE = 10;
export const CHECKS_PER_MODULE = 1;

export const MODULE_DETAILS: Record<string, LearnModuleDetail> = {
  A1: {
    level: "Easy",
    teach: [
      "A computer is a machine that takes input, processes it, and shows output",
      "Phone, laptop, and tablet are computers — a toaster is not",
      "Everyday story: sending a message vs switching on a bulb",
    ],
    outcomes: [
      "Name the three jobs of a computer: input, process, output",
      "Tell a computer from a simple electronic gadget",
    ],
    practice: "Pick computer vs not-a-computer; label input / process / output on simple pictures",
    checkpoint: "Which device is a computer: laptop, lamp, or bicycle bell? Why?",
  },
  A2: {
    level: "Easy",
    teach: [
      "Computers only understand on and off — like a light switch",
      "On = 1, off = 0; a group of switches can count and spell",
      "No need for long binary arithmetic — just the idea",
    ],
    outcomes: [
      "Explain binary as on/off lights",
      "Count a few dots of 1s and 0s (up to 5)",
    ],
    practice: "Match 0/1 to off/on; read a 3-switch pattern",
    checkpoint: "If 1 means on, what does 101 mean on three lights?",
  },
  A3: {
    level: "Easy",
    teach: [
      "Input devices send information in: keyboard, mouse, mic, camera",
      "Output devices send information out: screen, speaker, printer",
      "Some devices do both (touchscreen)",
    ],
    outcomes: [
      "Sort common devices into input or output",
      "Give one example of each from home or school",
    ],
    practice: "Match device → job; drag keyboard/mouse/screen/speaker into the right box",
    checkpoint: "Is a speaker input or output? Explain in one sentence.",
  },
  A4: {
    level: "Easy",
    teach: [
      "The internet is many computers asking and answering",
      "A website is like a shop with an address (URL)",
      "Wi-Fi and mobile data are just roads the questions travel on",
    ],
    outcomes: [
      "Describe the internet as a network, not a single box",
      "Know that every site has an address",
    ],
    practice: "Order the steps: type address → request → page appears",
    checkpoint: "What happens first when you open a website: the page appears, or your device asks for it?",
  },
  A5: {
    level: "Easy",
    teach: [
      "Never share full name + school + home together with strangers",
      "Passwords are secrets — even from friends",
      "Tell a trusted adult if a chat feels odd",
    ],
    outcomes: [
      "List three things never to post publicly",
      "Know who to tell if something online feels unsafe",
    ],
    practice: "Safe vs unsafe posts; pick a strong vs weak password pair (no real passwords)",
    checkpoint: "A new friend online asks for your home address. What should you do?",
  },
  A6: {
    level: "Building",
    teach: [
      "An algorithm is a clear list of steps — like a recipe or getting ready for school",
      "Steps must be in an order a machine (or a friend) can follow",
      "Good algorithms are short, clear, and complete",
    ],
    outcomes: [
      "Write a 4–6 step algorithm for a daily task",
      "Spot a missing step in a short recipe",
    ],
    practice: "Put sandwich / brush-teeth steps in order; find the missing step",
    checkpoint: "Write 4 steps to water a plant so a robot could follow them.",
  },
  A7: {
    level: "Building",
    teach: [
      "Order matters: socks before shoes, unlock before open",
      "Computers do exactly the next step — they don’t ‘guess’",
      "Scrambled steps make funny (or broken) results",
    ],
    outcomes: [
      "Reorder a scrambled everyday algorithm",
      "Predict what goes wrong if two steps swap",
    ],
    practice: "Unscramble 8 short sequences (getting dressed, making juice, opening a bag)",
    checkpoint: "If ‘pour milk’ comes before ‘open carton’, what happens?",
  },
  A8: {
    level: "Building",
    teach: [
      "A loop means ‘do this again’ — clap 5 times, not clap clap clap clap clap written out",
      "Repeat a fixed number of times, or until something is done",
      "Loops save time and keep instructions short",
    ],
    outcomes: [
      "Replace a repeated list with a ‘repeat N times’ loop",
      "Give one home example of a loop",
    ],
    practice: "Turn repeated lines into a loop; choose how many repeats",
    checkpoint: "Write a loop for ‘draw 4 sides of a square’.",
  },
  A9: {
    level: "Building",
    teach: [
      "If this, then that: if it rains, take an umbrella",
      "Else: otherwise do the other thing",
      "Stories first, then the same idea in a game character",
    ],
    outcomes: [
      "Write an if/then rule for a simple story",
      "Add an else option",
    ],
    practice: "Complete if/then/else cards (weather, traffic light, game lives)",
    checkpoint: "If the light is red, then ___. Else ___.",
  },
  A10: {
    level: "Building",
    teach: [
      "A bug is a mistake in the steps, not a ‘naughty’ computer",
      "Read the steps slowly; try one change at a time",
      "Celebrate finding the bug — that’s how programmers work",
    ],
    outcomes: [
      "Find one wrong or missing step in a short algorithm",
      "Suggest a fix",
    ],
    practice: "Spot-the-bug in 10 mini-instruction sets (wrong order, extra step, missing step)",
    checkpoint: "These steps make tea but skip boiling water. What’s the bug?",
  },
  A11: {
    level: "Stretch",
    teach: [
      "Block coding: snap puzzle pieces instead of typing",
      "A program is a stack of blocks the character follows",
      "Start / when-clicked is the first block",
    ],
    outcomes: [
      "Name block coding as visual, not typing-first",
      "Identify a start block vs a motion block",
    ],
    practice: "Match block type → job (start, move, wait, say)",
    checkpoint: "Why do we use blocks for Class 3–5 instead of typing code first?",
  },
  A12: {
    level: "Stretch",
    teach: [
      "Event (when flag clicked) + motion (move, turn)",
      "Small numbers first: move 10, turn 90",
      "Try, watch, change one block",
    ],
    outcomes: [
      "Sequence start + move + turn for a short path",
      "Change one number and predict the new path",
    ],
    practice: "Build 10 short paths on a grid (forward, turn, forward)",
    checkpoint: "To face the other way, how many 90° turns?",
  },
  A13: {
    level: "Stretch",
    teach: [
      "A variable is a named box that holds a number or word (score, lives, name)",
      "You can change what’s in the box",
      "Keep names short and clear: stars, not x1",
    ],
    outcomes: [
      "Give a real example of a variable in a game",
      "Say what happens when the score box adds 1",
    ],
    practice: "Pick the better variable name; say the new score after +1 / −1",
    checkpoint: "A game has 3 lives. The player hits a spike. What should the lives box become?",
  },
  A14: {
    level: "Stretch",
    teach: [
      "If/else in blocks: if touching wall, bounce; else keep walking",
      "Same logic as Unit 2 stories, now in code",
      "One condition at a time",
    ],
    outcomes: [
      "Read a simple if-block and say what the character does",
      "Choose the right condition for a given story",
    ],
    practice: "Match story → if-block; pick true/false for a condition",
    checkpoint: "If touching coin, then add 1 to score. What happens when the character misses the coin?",
  },
  A15: {
    level: "Stretch",
    teach: [
      "Guided mini-project: a 5–8 block animation or joke",
      "Plan on paper: start, 2 motions, 1 say-block",
      "Share one thing you changed after testing",
    ],
    outcomes: [
      "Finish a tiny block program with help",
      "Name one bug they fixed",
    ],
    practice: "Order the plan: idea → blocks → test → fix",
    checkpoint: "List the blocks you would use for ‘cat walks, then says hello’.",
  },
  A16: {
    level: "Apply",
    teach: [
      "People who make games, apps, animations, and robots all use computers",
      "You don’t have to be ‘a genius’ — you practise like sport",
      "One local/Indian example (maps, UPI, class tablet) if useful",
    ],
    outcomes: [
      "Name two computer-using jobs",
      "Connect one job to something they already learnt (algorithms or blocks)",
    ],
    practice: "Match job → what they build; true/false about ‘only adults code’",
    checkpoint: "Name one job that uses computers and one thing that person might tell a computer to do.",
  },
  A17: {
    level: "Apply",
    teach: [
      "A maps app: you type a place (input), it finds a path (process), it draws the route (output)",
      "Video apps recommend because they notice patterns (link to AI later)",
      "Keep it high-level — no servers lecture",
    ],
    outcomes: [
      "Map a favourite app to input–process–output",
      "Say one thing the app decides for you",
    ],
    practice: "Label IPO for maps, camera, and a quiz app",
    checkpoint: "For a maps app, what is the input and what is the output?",
  },
  A18: {
    level: "Apply",
    teach: [
      "A robot follows algorithms — it doesn’t ‘feel’",
      "Robots are great at repeat jobs; poor at brand-new messy ones without instructions",
      "Home robots vs factory arms vs space robots — same idea, different jobs",
    ],
    outcomes: [
      "Give one thing a robot can do well and one it cannot (yet)",
      "Link robots to algorithms and loops",
    ],
    practice: "Robot can / cannot cards; finish a 4-step robot algorithm",
    checkpoint: "Why can’t a vacuum robot invent a new game by itself?",
  },
  A19: {
    level: "Apply",
    teach: [
      "Data is facts the computer stores: names, scores, photos",
      "Organised lists are easier to find than a messy pile",
      "Some data is private (link to A5 safety)",
    ],
    outcomes: [
      "Give two examples of data a school computer might store",
      "Say why private data should stay private",
    ],
    practice: "Sort public vs private data; pick the tidier list",
    checkpoint: "Is your birthday public data or private? Who should you tell?",
  },
  A20: {
    level: "Apply",
    teach: [
      "Capstone: invent an app that helps a Class 3–5 child",
      "Draw 2 screens; write who it’s for, input, output",
      "Present in 1 minute — no coding required",
    ],
    outcomes: [
      "Describe an app idea with user, input, and output",
      "Use at least one idea from earlier units (safety, loop, or variable)",
    ],
    practice: "Score sample app ideas: clear user? clear IPO?",
    checkpoint: "Draw or list: app name, who uses it, one input, one output.",
  },

  B1: {
    level: "Easy",
    teach: [
      "AI is not magic — it finds patterns in lots of examples",
      "A calculator always does the same sum; AI guesses from what it has seen",
      "Kid examples: ‘this photo looks like a cat’ after seeing many cats",
    ],
    outcomes: [
      "Say AI uses patterns, not spells",
      "Give one difference between a calculator and AI",
    ],
    practice: "Magic vs pattern cards; calculator vs AI jobs",
    checkpoint: "Why is recommending a cartoon closer to AI than adding 7 + 2?",
  },
  B2: {
    level: "Easy",
    teach: [
      "Simple programs follow fixed rules: if button pressed, play sound",
      "AI programs change what they do after more examples",
      "Both are still written by people",
    ],
    outcomes: [
      "Sort ‘fixed rule’ vs ‘learns from examples’",
      "Know that people still design AI",
    ],
    practice: "Sort 10 tools: alarm clock, spellcheck, voice assistant, torch",
    checkpoint: "Is a torch ‘AI’? Why or why not?",
  },
  B3: {
    level: "Easy",
    teach: [
      "AI at home: voice helpers, photo search, video suggestions, maps traffic",
      "Not everything smart-looking is AI (a blinking toy)",
      "Hunt for AI in screenshots (no brand worship)",
    ],
    outcomes: [
      "Point to two everyday AI helpers",
      "Name one gadget that is not AI",
    ],
    practice: "Spot AI in 10 scene cards (kitchen, car, class, phone)",
    checkpoint: "Name one AI helper you have seen and what it tries to do.",
  },
  B4: {
    level: "Easy",
    teach: [
      "AI can be wrong: a dog photo labelled as a muffin",
      "Wrong answers happen when examples were few or messy",
      "Always check important facts with a person",
    ],
    outcomes: [
      "Give one way AI can make a mistake",
      "Know to ask a grown-up for important decisions",
    ],
    practice: "True/false about AI always being right; pick ‘check with a person’ situations",
    checkpoint: "AI says a plant is safe to eat. Should you eat it? Why?",
  },
  B5: {
    level: "Easy",
    teach: [
      "Translation, maps, and captions help people across languages",
      "AI helpers exist in many countries — same idea, local languages",
      "Helping is the goal — not replacing teachers or parents",
    ],
    outcomes: [
      "Name one AI helper used for language or travel",
      "Say AI is a helper, not a replacement for people",
    ],
    practice: "Match helper → job (translate, navigate, caption)",
    checkpoint: "How could translation AI help two children who speak different languages?",
  },
  B6: {
    level: "Building",
    teach: [
      "We teach AI like a puppy: many examples, praise for right, more practice",
      "Training = showing labelled examples",
      "One example is not enough",
    ],
    outcomes: [
      "Explain training as ‘lots of examples’",
      "Say why one photo is not enough to learn ‘cat’",
    ],
    practice: "Choose better training sets (many cats vs one cat); order train → test",
    checkpoint: "To teach ‘bus’, would you show 1 photo or 100? Why?",
  },
  B7: {
    level: "Building",
    teach: [
      "Patterns: same colour, same shape, same beat",
      "AI looks for patterns humans also notice — then does it on thousands of items",
      "Sorting game: shapes and colours (link to Math C2 / C8)",
    ],
    outcomes: [
      "Find a pattern in a short sequence",
      "Connect ‘pattern’ to how AI groups things",
    ],
    practice: "Continue 10 patterns; sort by colour then shape",
    checkpoint: "What pattern do you see: red, blue, red, blue, ___?",
  },
  B8: {
    level: "Building",
    teach: [
      "A label is a name we stick on an example: this is ‘apple’",
      "Wrong labels confuse the learner (human or AI)",
      "Show-and-tell game with picture cards",
    ],
    outcomes: [
      "Explain what a label is",
      "Say why a wrong label is a problem",
    ],
    practice: "Stick the right label; find the mislabelled card",
    checkpoint: "A banana is labelled ‘bus’. What might the AI get wrong later?",
  },
  B9: {
    level: "Building",
    teach: [
      "Data is the food AI eats: pictures, words, sounds",
      "More varied data (many kinds of dogs) works better than one kind",
      "Some data should not be collected (link to privacy later)",
    ],
    outcomes: [
      "Give two kinds of data AI might use",
      "Say why variety in data helps",
    ],
    practice: "Pick the more varied dataset; public vs private data",
    checkpoint: "To recognise ‘bird’, is 200 photos of only parrots enough? Why?",
  },
  B10: {
    level: "Building",
    teach: [
      "Practice improves guesses — first tries are wobbly",
      "Test with new examples the AI hasn’t seen",
      "Same as kids practising maths sums",
    ],
    outcomes: [
      "Say why we test with new examples",
      "Link practice to getting better, not ‘being born smart’",
    ],
    practice: "Order: train → try → fix labels → try again",
    checkpoint: "Why test a ‘cat finder’ on a new cat photo, not only the training photos?",
  },
  B11: {
    level: "Stretch",
    teach: [
      "Seeing for a computer = matching patterns in pixels, not ‘eyeballs’",
      "Object spotting: ball, bottle, book",
      "Lighting and angle can fool it",
    ],
    outcomes: [
      "Describe computer vision as pattern-matching in pictures",
      "Give one reason a picture might confuse it",
    ],
    practice: "Spot the object; pick which photo is harder (dark, tiny, partly hidden)",
    checkpoint: "Why might a computer miss a black cat on a black sofa?",
  },
  B12: {
    level: "Stretch",
    teach: [
      "Listening = turning sound into words, then matching patterns",
      "Noise, accents, and whispers make it harder",
      "Voice helpers still need a wake word and a clear ask",
    ],
    outcomes: [
      "Explain voice assistants at kid level",
      "Give one tip for being understood (speak clearly, quieter room)",
    ],
    practice: "Good vs poor voice commands; true/false about hearing",
    checkpoint: "Write one clear command you could say to a voice helper.",
  },
  B13: {
    level: "Stretch",
    teach: [
      "A chatbot picks a reply from patterns in your words",
      "It does not ‘know you’ like a friend",
      "Don’t share secrets in a chat with a bot",
    ],
    outcomes: [
      "Say a chatbot predicts replies; it doesn’t have feelings",
      "Know not to share private info with a bot",
    ],
    practice: "Safe vs unsafe things to type; pick the better next reply in a tiny tree",
    checkpoint: "Should you tell a chatbot your house keys hide under the mat? Why?",
  },
  B14: {
    level: "Stretch",
    teach: [
      "Filters find a face, then stick ears or glasses on points",
      "Fun, but the camera is still collecting a face picture",
      "Ask before posting someone else’s filtered face",
    ],
    outcomes: [
      "Describe a filter as ‘find face + draw on top’",
      "Name one courtesy/privacy rule for filters",
    ],
    practice: "Order the filter steps; courtesy true/false",
    checkpoint: "What does the filter need to find before it can add puppy ears?",
  },
  B15: {
    level: "Stretch",
    teach: [
      "Game characters follow rules: if player is near, chase; else patrol",
      "That’s simple AI — not a real person inside the game",
      "Mini design: write 2 rules for a maze guard",
    ],
    outcomes: [
      "Write two if/then rules for a game character",
      "Link game AI to algorithms from CS",
    ],
    practice: "Match character → rule; finish a patrol algorithm",
    checkpoint: "Write one rule for a coin that disappears when touched.",
  },
  B16: {
    level: "Apply",
    teach: [
      "If AI only sees one kind of example, it treats others unfairly",
      "Fairness = many kinds of faces, voices, and stories in the training",
      "Kid-safe: crayons of many colours, not ‘politics’",
    ],
    outcomes: [
      "Explain unfair AI as ‘not enough kinds of examples’",
      "Say more variety makes helpers fairer",
    ],
    practice: "Pick the fairer dataset; finish the sentence ‘AI needs ___ examples’",
    checkpoint: "A ‘hat finder’ only saw red hats. What happens with a blue hat?",
  },
  B17: {
    level: "Apply",
    teach: [
      "Privacy: AI doesn’t need your full life story to help with homework",
      "Location, photos of home, and real name are extra-careful",
      "Parents/settings can limit what is shared",
    ],
    outcomes: [
      "Name two pieces of information to keep private",
      "Know to ask a parent before sharing photos with an app",
    ],
    practice: "Share / don’t share cards; pick the safer setting",
    checkpoint: "An app asks for your live location to play a drawing game. What should you do?",
  },
  B18: {
    level: "Apply",
    teach: [
      "Some pictures and voices can be made by AI",
      "Look for odd hands, weird text, or ‘too perfect’ faces — then still ask a grown-up",
      "Not every strange photo is fake; not every real photo looks perfect",
    ],
    outcomes: [
      "Pause before believing a surprising picture",
      "Ask a trusted adult when unsure",
    ],
    practice: "Real-or-careful cards (kid-safe, no scary deepfakes)",
    checkpoint: "You see a photo of a flying school bus. What two things should you do?",
  },
  B19: {
    level: "Apply",
    teach: [
      "AI helping: spotting plants, reading for people who can’t see well, finding routes",
      "Doctors and scientists still decide — AI is a tool",
      "Artists can use AI as a brush, not a replacement for imagination",
    ],
    outcomes: [
      "Name two helpful uses of AI",
      "Say people stay in charge of important choices",
    ],
    practice: "Match helper → who it supports; people-in-charge true/false",
    checkpoint: "Should AI choose your medicine without a doctor? Why?",
  },
  B20: {
    level: "Apply",
    teach: [
      "Capstone: invent an AI helper for school or home",
      "Who it helps, what data it needs, what it must never collect",
      "Present in 1 minute",
    ],
    outcomes: [
      "Design a helper with user + job + one privacy rule",
      "Use vocabulary: pattern, example, data",
    ],
    practice: "Score sample helpers for clarity and privacy",
    checkpoint: "Name your helper, who it helps, and one thing it must not store.",
  },

  C1: {
    level: "Easy",
    teach: [
      "Count the computer way: 0 and 1 only (link to CS A2)",
      "Count to 5 with fingers as switches — no long binary homework",
      "Place of a 1 matters (like place value, preview C3)",
    ],
    outcomes: [
      "Count 0–5 using on/off lights",
      "Connect binary to computers",
    ],
    practice: "Read 3-light patterns; match 1–5 to a simple 0/1 card",
    checkpoint: "Show 3 as on-off lights (help allowed: 011).",
  },
  C2: {
    level: "Easy",
    teach: [
      "Odd and even; clap patterns",
      "Patterns are how both maths and code repeat",
      "Skip every other number",
    ],
    outcomes: [
      "Sort numbers to 20 into odd/even",
      "Continue a simple number pattern",
    ],
    practice: "Odd/even sort; next number in a pattern",
    checkpoint: "Is 14 odd or even? How do you know?",
  },
  C3: {
    level: "Easy",
    teach: [
      "Ones, tens, hundreds — why 23 is different from 32",
      "Contrast with binary: different ‘place’ ideas, same ‘position matters’",
      "Class 3–4 place value only — no decimals required",
    ],
    outcomes: [
      "Say the value of a digit in a 2- or 3-digit number",
      "Build a number from tens and ones",
    ],
    practice: "Expand 10 numbers; swap digits and say the new number",
    checkpoint: "In 47, what does the 4 stand for?",
  },
  C4: {
    level: "Easy",
    teach: [
      "Skip counting by 2, 5, 10 — the beat of a loop",
      "Sequences: 3, 6, 9, …",
      "Link: ‘repeat add 2’ is a loop (CS A8)",
    ],
    outcomes: [
      "Skip-count by 2, 5, or 10 up to 50",
      "Name the rule of a short sequence",
    ],
    practice: "Fill the next three terms; pick the skip-count rule",
    checkpoint: "What is the rule for 5, 10, 15, 20?",
  },
  C5: {
    level: "Easy",
    teach: [
      "Growing patterns: add 1 more each time (1, 2, 4 squares — keep it visual)",
      "Fibonacci-lite: 1, 1, 2, 3, 5 as a story of adding the last two — optional, light",
      "Draw the next picture in a pattern",
    ],
    outcomes: [
      "Draw or choose the next figure in a growing pattern",
      "Explain the rule in words",
    ],
    practice: "Next picture / next number in 10 growing patterns",
    checkpoint: "Squares: 1, then 3, then 6. How many in the next step if we add one more row?",
  },
  C6: {
    level: "Building",
    teach: [
      "A statement is true or false — not ‘maybe’ for this game",
      "‘All birds can fly’ is false (penguins)",
      "Prep for conditions in code",
    ],
    outcomes: [
      "Mark simple statements true or false",
      "Give one true and one false sentence about school",
    ],
    practice: "10 true/false world and maths statements",
    checkpoint: "True or false: every even number ends with 0, 2, 4, 6, or 8.",
  },
  C7: {
    level: "Building",
    teach: [
      "AND = both must be true (cake AND juice for the party)",
      "OR = at least one; NOT = the opposite",
      "Party-planning game — no circuit symbols required",
    ],
    outcomes: [
      "Solve a kid AND/OR/NOT story",
      "Link to if-both / if-either in games",
    ],
    practice: "Party rules: can they enter? AND/OR/NOT cards",
    checkpoint: "You need a hat AND a ticket. You have only a ticket. Can you enter?",
  },
  C8: {
    level: "Building",
    teach: [
      "Compare: greater than, less than, equal",
      "Sort a toy list by size or number",
      "Computers sort to find things faster",
    ],
    outcomes: [
      "Compare two numbers up to 100 (Class 3) or 1000 (Class 4–5)",
      "Put five items in order",
    ],
    practice: "Sort 10 short lists; pick < > =",
    checkpoint: "Put 19, 7, 42, 7 in order from smallest to biggest.",
  },
  C9: {
    level: "Building",
    teach: [
      "A set is a group that belongs together",
      "Venn: some things in both circles (red AND round)",
      "Fun themes: fruits, sports, school bags",
    ],
    outcomes: [
      "Place items in a two-circle Venn",
      "Give an item that belongs in both",
    ],
    practice: "Sort 10 items into set A, B, both, or neither",
    checkpoint: "Circles: ‘red things’ and ‘things you eat’. Where does an apple go?",
  },
  C10: {
    level: "Building",
    teach: [
      "Logic puzzles: one clue at a time (who sits where)",
      "Sudoku-lite 4×4 with shapes if numbers feel heavy",
      "Write the clues you used",
    ],
    outcomes: [
      "Solve a 3-clue logic grid with help",
      "Name the strategy: use one clue, then the next",
    ],
    practice: "Mini grids and ‘who owns the hat’ puzzles",
    checkpoint: "Ravi is not first. Meera is last. Who can be first? (3 children)",
  },
  C11: {
    level: "Stretch",
    teach: [
      "2D shapes: sides, corners, square vs rectangle vs triangle vs circle",
      "Shapes on screens are how pictures are built",
      "Count sides to name the shape",
    ],
    outcomes: [
      "Name and count sides of common 2D shapes",
      "Spot shapes in a classroom photo",
    ],
    practice: "Image-ID of 10 shapes; count vertices",
    checkpoint: "How many sides does a hexagon have?",
  },
  C12: {
    level: "Stretch",
    teach: [
      "A grid is rows and columns; a point has an address (2, 3)",
      "Across first, then up — battleship style, first quadrant only",
      "Link to pixels and CS graphics",
    ],
    outcomes: [
      "Plot a point on a 5×5 grid",
      "Read the address of a marked square",
    ],
    practice: "Plot and read 10 points; ‘hit or miss’ on a tiny grid",
    checkpoint: "Mark (4, 2) on a grid. Which number is across?",
  },
  C13: {
    level: "Stretch",
    teach: [
      "Line symmetry: a fold that matches",
      "Repeating patterns in rangoli, tiles, and game art",
      "Draw the missing half",
    ],
    outcomes: [
      "Find a line of symmetry on a simple shape",
      "Complete a repeating border pattern",
    ],
    practice: "Which pictures fold? Complete 6 patterns",
    checkpoint: "Does a heart have a line of symmetry? Draw or describe it.",
  },
  C14: {
    level: "Stretch",
    teach: [
      "A turn of 90° is a quarter turn — right or left",
      "Four quarter turns = all the way around",
      "Prep for turtle / block-coding turns (CS A12)",
    ],
    outcomes: [
      "Face a new direction after 1–3 quarter turns",
      "Say 90°, 180°, 360° in kid words (quarter, half, full)",
    ],
    practice: "Which way is the arrow after N turns?; match turn → picture",
    checkpoint: "You face north. Two quarter-turns right. Which way now?",
  },
  C15: {
    level: "Stretch",
    teach: [
      "Draw with commands: forward, turn 90, repeat 4 → square",
      "Same as a tiny program (link CS A8 + A12)",
      "Try a rectangle or a plus sign",
    ],
    outcomes: [
      "Write commands for a square",
      "Change one number to make a bigger square",
    ],
    practice: "Match command list → shape; fix a broken square script",
    checkpoint: "Write the commands to draw a square of 4 steps a side.",
  },
  C16: {
    level: "Apply",
    teach: [
      "Estimate first, then check — like debugging",
      "Guess-check-improve: try 20, too small, try 30",
      "No shame in a first guess",
    ],
    outcomes: [
      "Give a sensible estimate for a pile or a length",
      "Improve an estimate after one clue",
    ],
    practice: "Pick the best estimate; one-step improve",
    checkpoint: "About how many books on a shelf of 1 metre if each book is 2 cm thick? (estimate)",
  },
  C17: {
    level: "Apply",
    teach: [
      "Chance words: certain, likely, unlikely, impossible",
      "Dice and coins — fair vs unfair",
      "Link: AI ‘guesses’ what is likely from examples (AI B1/B10)",
    ],
    outcomes: [
      "Use a chance word correctly for a simple event",
      "Say a coin is about equally likely heads or tails",
    ],
    practice: "Label 10 events; fair/unfair spinner",
    checkpoint: "Is ‘rolling a 7 on a normal die’ impossible or unlikely? Why?",
  },
  C18: {
    level: "Apply",
    teach: [
      "Work backwards: you have 12 sweets after getting 4, how many at the start?",
      "Useful when the end is known (like undo in code)",
      "Draw the story, then reverse the arrows",
    ],
    outcomes: [
      "Solve a one-step backwards word problem",
      "Explain the reverse operation (add ↔ subtract)",
    ],
    practice: "10 ‘undo’ stories (give away / get more)",
    checkpoint: "Mina has 9 stickers after losing 3. How many did she start with?",
  },
  C19: {
    level: "Apply",
    teach: [
      "Big problems break into small jobs (decomposition)",
      "Pack a school bag: books, bottle, lunch — one list at a time",
      "Same idea as writing an algorithm in parts (CS A6)",
    ],
    outcomes: [
      "Split a messy task into 3–5 smaller tasks",
      "Order those tasks",
    ],
    practice: "Break 10 ‘big jobs’ (host a party, clean a room, make a comic)",
    checkpoint: "Break ‘make a birthday card’ into four small steps.",
  },
  C20: {
    level: "Apply",
    teach: [
      "Capstone mix: one pattern, one Venn or sort, one grid point, one chance word",
      "Show working; talk through one strategy",
      "Celebrate the whole Math-for-CS track",
    ],
    outcomes: [
      "Solve a mixed puzzle using at least two strategies from the year",
      "Tell a parent which maths idea helps computers",
    ],
    practice: "Short mixed set (pattern, compare, grid, true/false)",
    checkpoint: "Name two maths ideas from this track that help you understand computers or AI.",
  },
};

export function getModuleDetail(id: string): LearnModuleDetail | undefined {
  return MODULE_DETAILS[id];
}
