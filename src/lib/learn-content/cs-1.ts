import type { LessonContentBank } from "./types";

export const CS_CONTENT_1: LessonContentBank = {
  A5: {
    quiz: [
      {
        difficulty: "easy",
        type: "mcq",
        prompt: "Which of these is private info you should never post online?",
        options: ["Your favourite colour", "Your home address", "Your game nickname", "A drawing of a cat"],
        correctIndex: 1,
        explanation: "Your home address is private — it can lead a stranger to your door.",
      },
      {
        difficulty: "easy",
        type: "true_false",
        prompt: "Your password is a secret, even from your best friend.",
        options: ["True", "False"],
        correctIndex: 0,
        explanation: "Passwords are secret keys — only you and your parents should know them.",
      },
      {
        difficulty: "easy",
        type: "mcq",
        prompt: "Online, can you always see who is really typing to you?",
        options: [
          "Yes, always",
          "Only if they tell you their age",
          "No — anyone can pretend to be anyone",
          "Only in games",
        ],
        correctIndex: 2,
        explanation: "Online, a “kid” could really be a grown-up stranger.",
      },
      {
        difficulty: "easy",
        type: "mcq",
        prompt: "Who is a trusted adult you can tell if a chat feels odd?",
        options: [
          "A new friend you met in a game",
          "A stranger in a chat",
          "Someone who says “don’t tell your parents”",
          "Your mum, dad, or teacher",
        ],
        correctIndex: 3,
        explanation: "Trusted adults are grown-ups who keep you safe, like mum, dad, or your teacher.",
      },
      {
        difficulty: "medium",
        type: "mcq",
        prompt: "Which post is SAFE to share?",
        options: [
          "“I love mango ice cream!”",
          "“I’m Riya from Green Park School.”",
          "“I live on Rose Street, house 12.”",
          "“Here is my phone number.”",
        ],
        correctIndex: 0,
        explanation: "Everybody can know you love mango ice cream — it isn’t private info.",
      },
      {
        difficulty: "medium",
        type: "mcq",
        prompt: "Which password is the strongest?",
        options: ["1234", "Your own name", "abc123", "BlueKiteRuns42"],
        correctIndex: 3,
        explanation: "It is long and mixed up with words and numbers, so it is hard to guess.",
      },
      {
        difficulty: "medium",
        type: "true_false",
        prompt: "If you tell a grown-up about an odd chat, you will get in trouble.",
        options: ["True", "False"],
        correctIndex: 1,
        explanation: "You are never in trouble for telling — telling is brave!",
      },
      {
        difficulty: "medium",
        type: "mcq",
        prompt: "Which of these is a red flag in a chat?",
        options: [
          "Someone says “Good game!”",
          "Someone asks where you live",
          "Someone likes the same cartoon",
          "Someone is on your team",
        ],
        correctIndex: 1,
        explanation: "Asking where you live is a warning sign — stop, don’t reply, and tell an adult.",
      },
      {
        difficulty: "hard",
        type: "mcq",
        prompt: "Your drawing photo shows your school badge in the corner. What should you do before posting?",
        options: [
          "Post it — drawings are always safe",
          "Hide the badge, or don’t post that photo",
          "Add your house number too",
          "Send it to a stranger first",
        ],
        correctIndex: 1,
        explanation: "A drawing is safe, but a school badge gives away private info.",
      },
      {
        difficulty: "hard",
        type: "mcq",
        prompt: "A new friend online asks for your home address. What should you do?",
        options: [
          "Tell them your address",
          "Tell them only your street",
          "Don’t share it, and tell a trusted adult",
          "Tell them your school instead",
        ],
        correctIndex: 2,
        explanation: "Never share your address — tell a grown-up you trust right away.",
      },
    ],
  },

  A6: {
    notes: {
      bigIdea:
        "An algorithm is a clear list of steps to do a job — just like a recipe for chai or your morning routine before school. The steps must be in an order that a friend, or a machine, can follow. Good algorithms are short, clear, and complete.",
      definitions: [
        {
          term: "Algorithm",
          meaning: "A clear list of steps, in order, to get a job done.",
        },
        {
          term: "Step",
          meaning: "One small thing to do, like “pour water into the glass”.",
        },
        {
          term: "Recipe",
          meaning: "An algorithm for cooking — steps that turn ingredients into food.",
        },
        {
          term: "Missing step",
          meaning: "A step someone forgot. Without it, the job goes wrong.",
        },
      ],
      panels: [
        {
          title: "A recipe is an algorithm",
          body: [
            "Making chai: boil water, add tea leaves, add milk and sugar, pour into a cup.",
            "Each line is one step.",
            "Follow the steps in order, and you get chai!",
          ],
        },
        {
          title: "Getting ready for school",
          body: [
            "1. Brush your teeth.  2. Take a bath.  3. Wear your uniform.",
            "4. Pack your school bag.  5. Take your tiffin.",
            "That’s an algorithm you follow every morning!",
          ],
        },
        {
          title: "Steps a robot can follow",
          body: [
            "A robot does exactly what you say — it can’t guess.",
            "“Help the plant” is not clear. “Pour one cup of water on the soil” is clear.",
            "Clear steps in the right order = a robot that gets it right.",
          ],
        },
        {
          title: "Short, clear, complete",
          body: [
            "Short: no extra steps you don’t need.",
            "Clear: every step says exactly what to do.",
            "Complete: no missing steps. Take a glass → ??? → drink. Missing: pour the water!",
          ],
        },
      ],
      remember: [
        "Algorithm = clear steps, in order.",
        "A recipe is an algorithm.",
        "Robots follow exactly — they can’t guess.",
        "Good algorithms: short, clear, complete.",
      ],
      checkYourself: {
        q: "Write 4 steps to water a plant so a robot could follow them.",
        a: "1. Pick up the watering can.  2. Fill it with water.  3. Walk to the plant.  4. Pour the water on the soil.",
      },
      dinoLine: "Chapter 1 done. You can write steps even a robot can follow — super work, champ!",
    },
    quiz: [
      {
        difficulty: "easy",
        type: "mcq",
        prompt: "What is an algorithm?",
        options: [
          "A kind of computer",
          "A game on a tablet",
          "A clear list of steps to do a job",
          "A secret password",
        ],
        correctIndex: 2,
        explanation: "An algorithm is a list of steps, in order, to get a job done.",
      },
      {
        difficulty: "easy",
        type: "true_false",
        prompt: "A recipe for making chai is a kind of algorithm.",
        options: ["True", "False"],
        correctIndex: 0,
        explanation: "A recipe is a list of steps in order — that’s an algorithm!",
      },
      {
        difficulty: "easy",
        type: "mcq",
        prompt: "Which of these is an algorithm?",
        options: [
          "A red pencil",
          "The steps for getting ready for school",
          "A cricket bat",
          "A sunny day",
        ],
        correctIndex: 1,
        explanation: "Getting ready for school is a list of steps you follow in order.",
      },
      {
        difficulty: "easy",
        type: "mcq",
        prompt: "A good algorithm is…",
        options: [
          "Long and confusing",
          "Missing some steps",
          "Full of guesses",
          "Short, clear, and complete",
        ],
        correctIndex: 3,
        explanation: "Good algorithms are short, clear, and have no missing steps.",
      },
      {
        difficulty: "medium",
        type: "mcq",
        prompt: "Steps: 1. Take a glass.  2. ___  3. Drink the water. What is the missing step?",
        options: [
          "Pour water into the glass",
          "Pack your school bag",
          "Switch off the fan",
          "Close your book",
        ],
        correctIndex: 0,
        explanation: "You can’t drink water until you pour it into the glass.",
      },
      {
        difficulty: "medium",
        type: "mcq",
        prompt: "Why must steps be very clear for a robot?",
        options: [
          "Robots like long words",
          "Robots can guess what you mean",
          "Robots do exactly what you say",
          "Robots skip the hard steps",
        ],
        correctIndex: 2,
        explanation: "A robot can’t guess — it follows each step exactly as written.",
      },
      {
        difficulty: "medium",
        type: "true_false",
        prompt: "If a step is missing, a robot will guess it and fill it in.",
        options: ["True", "False"],
        correctIndex: 1,
        explanation: "Robots can’t guess, so every step must be written down.",
      },
      {
        difficulty: "medium",
        type: "mcq",
        prompt: "Which step is the clearest for a robot?",
        options: [
          "Do the plant thing",
          "Make the plant nice",
          "Help the plant",
          "Pour one cup of water on the soil",
        ],
        correctIndex: 3,
        explanation: "It says exactly what to do and how much — no guessing needed.",
      },
      {
        difficulty: "hard",
        type: "mcq",
        prompt: "Put the plant steps in order: A) Pour water on the soil  B) Fill the can with water  C) Carry the can to the plant",
        options: ["A → B → C", "B → C → A", "C → A → B", "A → C → B"],
        correctIndex: 1,
        explanation: "Fill the can, carry it to the plant, then pour the water.",
      },
      {
        difficulty: "hard",
        type: "mcq",
        prompt: "Steps: 1. Pick up your brush.  2. Put toothpaste on it.  3. Rinse your mouth. Which step is missing?",
        options: ["Tie your shoes", "Eat your tiffin", "Brush your teeth", "Open the fridge"],
        correctIndex: 2,
        explanation: "You must brush your teeth before you rinse — that step was forgotten.",
      },
    ],
  },

  A7: {
    notes: {
      bigIdea:
        "Sequencing means putting steps in the right order. Order matters: socks go on before shoes, and you unlock a door before you open it. Computers do exactly the next step — they don’t guess — so scrambled steps give funny or broken results.",
      definitions: [
        {
          term: "Sequence",
          meaning: "Steps arranged in a set order, one after another.",
        },
        {
          term: "Sequencing",
          meaning: "Putting steps in the right order so the job works.",
        },
        {
          term: "Scrambled",
          meaning: "Mixed up — the steps are in the wrong order.",
        },
        {
          term: "Swap",
          meaning: "When two steps change places with each other.",
        },
      ],
      panels: [
        {
          title: "Order matters",
          body: [
            "Socks first, then shoes.",
            "Unlock the door first, then open it.",
            "Open your tiffin box first, then eat!",
          ],
        },
        {
          title: "Computers don’t guess",
          body: [
            "A computer does exactly the next step on the list.",
            "It won’t fix the order for you.",
            "If the steps are wrong, the result is wrong.",
          ],
        },
        {
          title: "Scrambled = funny or broken",
          body: [
            "Shoes before socks → socks end up on top of your shoes!",
            "Drink the juice before squeezing the lemon → nothing to drink.",
            "Pour milk before opening the carton → no milk comes out.",
          ],
        },
        {
          title: "Unscramble it!",
          body: [
            "Mixed up: take out tiffin, close zip, open zip.",
            "Ask: what must happen first? What comes last?",
            "Fixed: open zip → take out tiffin → close zip.",
          ],
        },
      ],
      remember: [
        "Sequencing = the right order.",
        "Socks before shoes, unlock before open.",
        "Computers do the next step — no guessing.",
        "Swap two steps and things can break.",
      ],
      checkYourself: {
        q: "If ‘pour milk’ comes before ‘open carton’, what happens?",
        a: "No milk comes out, because the carton is still closed. Open the carton first, then pour.",
      },
      dinoLine: "Chapter 2 done. You know that order matters — super work, champ!",
    },
    quiz: [
      {
        difficulty: "easy",
        type: "mcq",
        prompt: "What does “sequencing” mean?",
        options: [
          "Putting steps in the right order",
          "Making steps longer",
          "Deleting all the steps",
          "Drawing a picture",
        ],
        correctIndex: 0,
        explanation: "Sequencing is about the order of the steps.",
      },
      {
        difficulty: "easy",
        type: "mcq",
        prompt: "Getting dressed: which comes FIRST?",
        options: ["Put on shoes", "Tie your laces", "Walk to the bus", "Put on socks"],
        correctIndex: 3,
        explanation: "Socks go on before shoes — order matters!",
      },
      {
        difficulty: "easy",
        type: "true_false",
        prompt: "Computers do exactly the next step — they don’t guess.",
        options: ["True", "False"],
        correctIndex: 0,
        explanation: "A computer follows the list in order, just as it is written.",
      },
      {
        difficulty: "easy",
        type: "mcq",
        prompt: "Before you can open a locked door, you must…",
        options: ["Close it", "Unlock it", "Paint it", "Sweep the floor"],
        correctIndex: 1,
        explanation: "Unlock first, then open.",
      },
      {
        difficulty: "medium",
        type: "mcq",
        prompt: "If ‘pour milk’ comes before ‘open carton’, what happens?",
        options: [
          "The milk pours perfectly",
          "The milk turns into juice",
          "No milk comes out — the carton is still closed",
          "The fridge opens by itself",
        ],
        correctIndex: 2,
        explanation: "You can’t pour from a closed carton — open it first.",
      },
      {
        difficulty: "medium",
        type: "mcq",
        prompt: "Lemon juice steps: 1. Drink the juice  2. Squeeze lemon into water  3. Add sugar and stir. Which step is in the wrong place?",
        options: [
          "Squeeze lemon into water",
          "Drink the juice",
          "Add sugar and stir",
          "None — the order is right",
        ],
        correctIndex: 1,
        explanation: "Drinking should be the last step, after the juice is made.",
      },
      {
        difficulty: "medium",
        type: "true_false",
        prompt: "The order of steps doesn’t matter, as long as all the steps are there.",
        options: ["True", "False"],
        correctIndex: 1,
        explanation: "Even with every step there, the wrong order can break the job.",
      },
      {
        difficulty: "medium",
        type: "mcq",
        prompt: "What happens if you swap ‘put on socks’ and ‘put on shoes’?",
        options: [
          "You get dressed faster",
          "Nothing changes",
          "Your shoes change colour",
          "Your socks end up on top of your shoes",
        ],
        correctIndex: 3,
        explanation: "Swapping those two steps gives a funny, wrong result.",
      },
      {
        difficulty: "hard",
        type: "mcq",
        prompt: "Put in order: A) Take out tiffin  B) Open the zip  C) Close the zip",
        options: ["B → A → C", "A → B → C", "C → A → B", "A → C → B"],
        correctIndex: 0,
        explanation: "Open the zip, take out the tiffin, then close the zip.",
      },
      {
        difficulty: "hard",
        type: "mcq",
        prompt: "A robot gets: 1. Brush teeth  2. Put paste on brush  3. Pick up brush. What is the best fix?",
        options: [
          "Add more brushing steps",
          "Remove the paste step",
          "Pick up brush → put paste on brush → brush teeth",
          "Do the same steps faster",
        ],
        correctIndex: 2,
        explanation: "The steps were reversed — flip them into the right order.",
      },
    ],
  },

  A8: {
    notes: {
      bigIdea:
        "A loop means “do this again”. Instead of writing “clap, clap, clap, clap, clap”, you say “clap 5 times”. Loops can repeat a fixed number of times, or until something is done — and they keep instructions short.",
      definitions: [
        {
          term: "Loop",
          meaning: "An instruction to do the same steps again and again.",
        },
        {
          term: "Repeat N times",
          meaning: "Do the steps a set number of times — like “repeat 5 times: clap”.",
        },
        {
          term: "Repeat until",
          meaning: "Keep doing the steps until something is done — like “stir until the sugar melts”.",
        },
        {
          term: "Repeat",
          meaning: "To do something one more time, and again.",
        },
      ],
      panels: [
        {
          title: "Say it once, do it many times",
          body: [
            "Long way: clap, clap, clap, clap, clap.",
            "Loop way: repeat 5 times: clap.",
            "Same claps, much shorter!",
          ],
        },
        {
          title: "Two kinds of loops",
          body: [
            "Fixed number: a bowler bowls 6 balls in an over → repeat 6 times.",
            "Until done: stir the chai until the sugar melts.",
            "Both mean “do it again”.",
          ],
        },
        {
          title: "Loops at home",
          body: [
            "Brushing each tooth until all are clean.",
            "Skipping rope 20 times.",
            "Folding clothes until the pile is finished.",
          ],
        },
        {
          title: "Draw a square with a loop",
          body: [
            "A square has 4 sides and 4 corners.",
            "Without a loop: draw, turn, draw, turn, draw, turn, draw, turn.",
            "With a loop: repeat 4 times: draw a side, turn.",
          ],
        },
      ],
      remember: [
        "Loop = do it again.",
        "Repeat N times, or repeat until done.",
        "Loops keep steps short and save time.",
        "Square: repeat 4 times: draw a side, turn.",
      ],
      checkYourself: {
        q: "Write a loop for ‘draw 4 sides of a square’.",
        a: "Repeat 4 times: draw one side, then turn at the corner.",
      },
      dinoLine: "Chapter 3 done. You can make steps repeat with a loop — super work, champ!",
    },
    quiz: [
      {
        difficulty: "easy",
        type: "mcq",
        prompt: "What does a loop mean?",
        options: ["Stop forever", "Do this again", "Delete a step", "Skip to the end"],
        correctIndex: 1,
        explanation: "A loop tells you to do the same steps again.",
      },
      {
        difficulty: "easy",
        type: "true_false",
        prompt: "“Clap 5 times” is shorter than writing “clap” five times.",
        options: ["True", "False"],
        correctIndex: 0,
        explanation: "That’s the magic of a loop — same claps, fewer words.",
      },
      {
        difficulty: "easy",
        type: "mcq",
        prompt: "Which of these is a loop at home?",
        options: [
          "Opening the fridge once",
          "Switching on the TV once",
          "Reading one word",
          "Stirring chai round and round until the sugar melts",
        ],
        correctIndex: 3,
        explanation: "You keep stirring again and again until it’s done — that’s a loop.",
      },
      {
        difficulty: "easy",
        type: "mcq",
        prompt: "Why are loops helpful?",
        options: [
          "They make instructions longer",
          "They make the computer slower",
          "They keep instructions short and save time",
          "They hide the steps",
        ],
        correctIndex: 2,
        explanation: "Loops say “do it again” instead of writing the same line many times.",
      },
      {
        difficulty: "medium",
        type: "mcq",
        prompt: "Which loop means “jump, jump, jump, jump, jump”?",
        options: [
          "Repeat 5 times: jump",
          "Repeat 3 times: jump",
          "Jump once",
          "Repeat 10 times: jump",
        ],
        correctIndex: 0,
        explanation: "There are 5 jumps, so repeat 5 times.",
      },
      {
        difficulty: "medium",
        type: "mcq",
        prompt: "A loop can repeat a fixed number of times, or…",
        options: [
          "only on Sundays",
          "never at all",
          "until something is done",
          "only backwards",
        ],
        correctIndex: 2,
        explanation: "Some loops stop when a job is finished, like “until the pile is folded”.",
      },
      {
        difficulty: "medium",
        type: "true_false",
        prompt: "A loop must always repeat exactly 10 times.",
        options: ["True", "False"],
        correctIndex: 1,
        explanation: "You choose how many times — 2, 5, 20 — or until something is done.",
      },
      {
        difficulty: "medium",
        type: "mcq",
        prompt: "“Brush each tooth until all teeth are clean.” When does this loop stop?",
        options: [
          "When the brush is new",
          "After exactly 10 brushes",
          "When the tap is on",
          "When all the teeth are clean",
        ],
        correctIndex: 3,
        explanation: "It’s a “repeat until” loop — it stops when the job is done.",
      },
      {
        difficulty: "hard",
        type: "mcq",
        prompt: "Which loop draws a square?",
        options: [
          "Repeat 2 times: draw a side, turn",
          "Repeat 4 times: draw a side, turn",
          "Draw a side once",
          "Repeat 4 times: turn",
        ],
        correctIndex: 1,
        explanation: "A square has 4 sides, so draw a side and turn — 4 times.",
      },
      {
        difficulty: "hard",
        type: "mcq",
        prompt: "In cricket, a bowler bowls 6 balls in one over. Which loop fits?",
        options: [
          "Repeat 6 times: bowl one ball",
          "Repeat 6 times: hit a six",
          "Bowl one ball, then stop",
          "Repeat 1 time: bowl 6 overs",
        ],
        correctIndex: 0,
        explanation: "One over = the same action, bowling a ball, repeated 6 times.",
      },
    ],
  },

  A9: {
    notes: {
      bigIdea:
        "“If this, then that” is a rule that checks something before acting: if it rains, then take an umbrella. “Else” means otherwise — do the other thing. Stories use these rules, and so do game characters.",
      definitions: [
        {
          term: "Condition",
          meaning: "The thing you check — like “Is it raining?” It is either true or not true.",
        },
        {
          term: "If … then",
          meaning: "If the condition is true, then do this action.",
        },
        {
          term: "Else",
          meaning: "Otherwise — what to do when the condition is not true.",
        },
        {
          term: "Branch",
          meaning: "A fork in the road: the steps go one way or the other.",
        },
      ],
      panels: [
        {
          title: "If it rains…",
          body: [
            "If it rains, then take an umbrella.",
            "Else, leave the umbrella at home.",
            "The condition is “it rains”. You check it first.",
          ],
        },
        {
          title: "At the traffic light",
          body: [
            "The auto-rickshaw driver checks the light.",
            "If the light is red, then stop.",
            "Else, go carefully.",
          ],
        },
        {
          title: "In a story",
          body: [
            "If Aarav is hungry, then he eats his tiffin.",
            "If homework is done, then play cricket.",
            "Else, finish homework first!",
          ],
        },
        {
          title: "In a game",
          body: [
            "If lives = 0, then “Game over”.",
            "Else, keep playing.",
            "The character checks the rule again and again.",
          ],
        },
      ],
      remember: [
        "If = check a condition.",
        "Then = what to do if it’s true.",
        "Else = what to do if it’s not.",
        "Red light → stop. Else → go.",
      ],
      checkYourself: {
        q: "If the light is red, then ___. Else ___.",
        a: "If the light is red, then stop. Else, go (carefully).",
      },
      dinoLine: "Chapter 4 done. You can make choices with if, then and else — super work, champ!",
    },
    quiz: [
      {
        difficulty: "easy",
        type: "mcq",
        prompt: "“If it rains, then take an umbrella.” What is the condition?",
        options: ["Take an umbrella", "The umbrella", "It rains", "Go to school"],
        correctIndex: 2,
        explanation: "The condition is the thing you check — “it rains”.",
      },
      {
        difficulty: "easy",
        type: "true_false",
        prompt: "“Else” means “otherwise, do the other thing”.",
        options: ["True", "False"],
        correctIndex: 0,
        explanation: "Else is what happens when the condition is not true.",
      },
      {
        difficulty: "easy",
        type: "mcq",
        prompt: "At a traffic light: if the light is red, then…",
        options: ["Go fast", "Stop", "Honk loudly", "Turn around"],
        correctIndex: 1,
        explanation: "Red means stop.",
      },
      {
        difficulty: "easy",
        type: "mcq",
        prompt: "Which of these is an if/then rule?",
        options: [
          "I like mangoes",
          "The sky is blue",
          "Chai is hot",
          "If I’m hungry, then I eat my tiffin",
        ],
        correctIndex: 3,
        explanation: "It checks something (hungry?) and then says what to do.",
      },
      {
        difficulty: "medium",
        type: "mcq",
        prompt: "“If it is raining, take an umbrella. Else, ___.”",
        options: [
          "Take an umbrella",
          "Stand in the rain",
          "Buy a new school bag",
          "Leave the umbrella at home",
        ],
        correctIndex: 3,
        explanation: "When it’s not raining, you don’t need the umbrella.",
      },
      {
        difficulty: "medium",
        type: "mcq",
        prompt: "Game rule: “If lives = 0, then game over. Else, keep playing.” Your character has 2 lives. What happens?",
        options: ["Keep playing", "Game over", "Lives become 10", "The screen switches off"],
        correctIndex: 0,
        explanation: "Lives are not 0, so the else part runs — keep playing.",
      },
      {
        difficulty: "medium",
        type: "true_false",
        prompt: "The “then” part happens even when the condition is not true.",
        options: ["True", "False"],
        correctIndex: 1,
        explanation: "The “then” part only happens when the condition is true.",
      },
      {
        difficulty: "medium",
        type: "mcq",
        prompt: "“If the bell rings, then go to class.” The bell rings. What do you do?",
        options: ["Stay in the playground", "Go home", "Go to class", "Eat lunch"],
        correctIndex: 2,
        explanation: "The condition is true, so you do the “then” part.",
      },
      {
        difficulty: "hard",
        type: "mcq",
        prompt: "“If the light is red, then stop. Else, go.” The light is green. What should you do?",
        options: ["Stop", "Go", "Wait forever", "Turn back"],
        correctIndex: 1,
        explanation: "Green is not red, so the else part runs — go.",
      },
      {
        difficulty: "hard",
        type: "mcq",
        prompt: "“If homework is done, then play cricket. Else, ___.” Which is the best else?",
        options: [
          "Play cricket",
          "Watch TV all night",
          "Throw your bag",
          "Finish your homework first",
        ],
        correctIndex: 3,
        explanation: "If homework isn’t done, the sensible other choice is to finish it.",
      },
    ],
  },

  A10: {
    notes: {
      bigIdea:
        "A bug is a mistake in the steps — not a naughty computer. Debugging means finding and fixing that mistake. Read the steps slowly, try one change at a time, and celebrate when you find the bug — that’s how real programmers work!",
      definitions: [
        {
          term: "Bug",
          meaning: "A mistake in the steps that makes the job go wrong.",
        },
        {
          term: "Debugging",
          meaning: "Finding the bug and fixing it.",
        },
        {
          term: "Missing step",
          meaning: "A step that was forgotten, like “boil the water”.",
        },
        {
          term: "Extra step",
          meaning: "A step that doesn’t belong and should be removed.",
        },
        {
          term: "Wrong order",
          meaning: "The right steps, but in a mixed-up order.",
        },
      ],
      panels: [
        {
          title: "Bugs are mistakes, not monsters",
          body: [
            "The computer did exactly what the steps said.",
            "If the result is wrong, a step is wrong.",
            "So we fix the steps — no one is naughty!",
          ],
        },
        {
          title: "Three kinds of bugs",
          body: [
            "Missing step: making tea but forgetting to boil the water.",
            "Wrong order: shoes before socks.",
            "Extra step: “dance on the bed” in the tooth-brushing steps!",
          ],
        },
        {
          title: "How to hunt a bug",
          body: [
            "1. Read the steps slowly, one by one.",
            "2. Find the step that goes wrong.",
            "3. Change one thing, then test again.",
          ],
        },
        {
          title: "Celebrate the find!",
          body: [
            "Every programmer finds bugs — every single day.",
            "Found one? That means you’re getting better.",
            "Fix it, test it, and cheer: “Bug squashed!”",
          ],
        },
      ],
      remember: [
        "Bug = a mistake in the steps.",
        "Debugging = find it and fix it.",
        "Missing, extra, or wrong order.",
        "Change one thing at a time, then test.",
      ],
      checkYourself: {
        q: "These steps make tea but skip boiling water. What’s the bug?",
        a: "A missing step. Add “boil the water” before adding the tea leaves.",
      },
      dinoLine: "Chapter 5 done and Unit 2 complete. You can find and fix bugs — super work, champ!",
    },
    quiz: [
      {
        difficulty: "easy",
        type: "mcq",
        prompt: "What is a bug in a set of steps?",
        options: [
          "A naughty computer",
          "A mistake in the steps",
          "A real insect inside the tablet",
          "A new game",
        ],
        correctIndex: 1,
        explanation: "A bug is a mistake in the steps, not a naughty computer.",
      },
      {
        difficulty: "easy",
        type: "true_false",
        prompt: "Finding a bug is something to celebrate.",
        options: ["True", "False"],
        correctIndex: 0,
        explanation: "Finding bugs is how programmers make things work!",
      },
      {
        difficulty: "easy",
        type: "mcq",
        prompt: "What does debugging mean?",
        options: [
          "Adding more mistakes",
          "Switching off the computer",
          "Shouting at the screen",
          "Finding and fixing mistakes in the steps",
        ],
        correctIndex: 3,
        explanation: "Debugging = find the bug, then fix it.",
      },
      {
        difficulty: "easy",
        type: "mcq",
        prompt: "What is the best way to find a bug?",
        options: [
          "Change everything at once",
          "Guess quickly",
          "Read the steps slowly and change one thing at a time",
          "Give up",
        ],
        correctIndex: 2,
        explanation: "Going slowly, one change at a time, helps you spot the mistake.",
      },
      {
        difficulty: "medium",
        type: "mcq",
        prompt: "Tea steps: add tea leaves to water, add milk and sugar, pour into a cup. The water was never boiled. What’s the bug?",
        options: [
          "Too much sugar",
          "The cup is the wrong colour",
          "A missing step: boil the water",
          "An extra step: add tea leaves",
        ],
        correctIndex: 2,
        explanation: "Boiling the water was forgotten — that’s a missing step.",
      },
      {
        difficulty: "medium",
        type: "true_false",
        prompt: "When the steps don’t work, it means the computer is being naughty.",
        options: ["True", "False"],
        correctIndex: 1,
        explanation: "The computer follows the steps exactly — the mistake is in the steps.",
      },
      {
        difficulty: "medium",
        type: "mcq",
        prompt: "Steps: 1. Wear shoes  2. Wear socks  3. Go outside. What kind of bug is this?",
        options: ["Wrong order", "Missing step", "Extra step", "No bug"],
        correctIndex: 0,
        explanation: "Socks should come before shoes — the order is wrong.",
      },
      {
        difficulty: "medium",
        type: "mcq",
        prompt: "Steps: pick up brush, put paste on it, dance on the bed, brush teeth. What’s the bug?",
        options: [
          "A missing step",
          "Wrong order",
          "No bug",
          "An extra step — “dance on the bed” doesn’t belong",
        ],
        correctIndex: 3,
        explanation: "Dancing on the bed has nothing to do with brushing — remove it.",
      },
      {
        difficulty: "hard",
        type: "mcq",
        prompt: "Robot steps: 1. Open the bag  2. Put books in  3. Put tiffin in  4. Walk to school. Everything falls out on the way! Best fix?",
        options: [
          "Add “Close the bag” before “Walk to school”",
          "Remove “Put books in”",
          "Walk faster",
          "Put the tiffin in twice",
        ],
        correctIndex: 0,
        explanation: "The bag was never closed — adding that missing step fixes it.",
      },
      {
        difficulty: "hard",
        type: "mcq",
        prompt: "Why is it smart to change only one thing at a time, then test?",
        options: [
          "It makes the steps longer",
          "You can tell which change fixed the bug",
          "Computers allow only one change a day",
          "It hides the bug",
        ],
        correctIndex: 1,
        explanation: "One change at a time shows you exactly what worked.",
      },
    ],
  },

  A11: {
    notes: {
      bigIdea:
        "Block coding lets you give a computer instructions by snapping puzzle-like blocks together — no typing needed. A program is a stack of blocks that a character follows from top to bottom. The start block, like “when green flag clicked”, always goes first.",
      definitions: [
        {
          term: "Block coding",
          meaning: "Making programs by snapping picture blocks together, like puzzle pieces.",
        },
        {
          term: "Program",
          meaning: "A stack of blocks the character follows, top to bottom.",
        },
        {
          term: "Start block",
          meaning: "The first block that starts the program, like “when green flag clicked”.",
        },
        {
          term: "Motion block",
          meaning: "A block that moves or turns the character, like “move 10 steps”.",
        },
        {
          term: "Character",
          meaning: "The little figure on the screen that follows your blocks.",
        },
      ],
      panels: [
        {
          title: "Snap, don’t type",
          body: [
            "Each block is like a LEGO or puzzle piece.",
            "Drag it, drop it, and it snaps into place.",
            "No spelling mistakes, no long words to type!",
          ],
        },
        {
          title: "A program is a stack",
          body: [
            "Blocks stack from top to bottom.",
            "The character does the top block first, then the next.",
            "Just like steps in an algorithm!",
          ],
        },
        {
          title: "Meet the blocks",
          body: [
            "Start: “when green flag clicked” — begins the program.",
            "Move: “move 10 steps” — walks the character.",
            "Wait: “wait 1 seconds”.  Say: “say Hello!” — shows a speech bubble.",
          ],
        },
        {
          title: "Why blocks first?",
          body: [
            "You can see every instruction as a picture.",
            "You focus on ideas, not on typing.",
            "Later, the same ideas work in typed code too.",
          ],
        },
      ],
      remember: [
        "Block coding = snap blocks, no typing.",
        "Program = a stack of blocks.",
        "Start block goes on top.",
        "Start, move, wait, say — each block has a job.",
      ],
      checkYourself: {
        q: "Why do we use blocks for Class 3–5 instead of typing code first?",
        a: "Blocks are easy to see and snap together, with no typing or spelling mistakes — so you can focus on the idea of the program.",
      },
      dinoLine: "Chapter 1 done. You’ve met block coding and its blocks — super work, champ!",
    },
    quiz: [
      {
        difficulty: "easy",
        type: "mcq",
        prompt: "What is block coding?",
        options: [
          "Typing long words on a keyboard",
          "Building a wall with real bricks",
          "Snapping puzzle-like blocks together to give instructions",
          "Colouring with crayons",
        ],
        correctIndex: 2,
        explanation: "In block coding you snap blocks together instead of typing.",
      },
      {
        difficulty: "easy",
        type: "true_false",
        prompt: "In block coding, you don’t need to type code first.",
        options: ["True", "False"],
        correctIndex: 0,
        explanation: "You drag and snap blocks — no typing needed.",
      },
      {
        difficulty: "easy",
        type: "mcq",
        prompt: "In block coding, a program is…",
        options: [
          "Just one block",
          "A stack of blocks the character follows",
          "The computer screen",
          "A picture of a cat",
        ],
        correctIndex: 1,
        explanation: "A program is a stack of blocks, followed from top to bottom.",
      },
      {
        difficulty: "easy",
        type: "mcq",
        prompt: "Which block usually goes FIRST, at the top?",
        options: ["“move 10 steps”", "“say Hello!”", "“wait 1 seconds”", "“when green flag clicked”"],
        correctIndex: 3,
        explanation: "The start block begins the program, so it goes on top.",
      },
      {
        difficulty: "medium",
        type: "mcq",
        prompt: "Which of these is a motion block?",
        options: ["“move 10 steps”", "“when green flag clicked”", "“say Hello!”", "“wait 1 seconds”"],
        correctIndex: 0,
        explanation: "Motion blocks move or turn the character.",
      },
      {
        difficulty: "medium",
        type: "mcq",
        prompt: "What does the “say Hello!” block do?",
        options: [
          "Moves the character forward",
          "Starts the program",
          "Makes the character wait",
          "Shows a speech bubble saying Hello!",
        ],
        correctIndex: 3,
        explanation: "Say blocks make the character talk in a speech bubble.",
      },
      {
        difficulty: "medium",
        type: "true_false",
        prompt: "A motion block like “move 10 steps” is the same as a start block.",
        options: ["True", "False"],
        correctIndex: 1,
        explanation: "A start block begins the program; a motion block moves the character.",
      },
      {
        difficulty: "medium",
        type: "mcq",
        prompt: "What is the job of the “wait 1 seconds” block?",
        options: [
          "Moves the character",
          "Starts the program",
          "Pauses before the next block",
          "Changes the character’s colour",
        ],
        correctIndex: 2,
        explanation: "Wait blocks pause for a moment, then the next block runs.",
      },
      {
        difficulty: "hard",
        type: "mcq",
        prompt: "Why do Class 3–5 kids use blocks before typing code?",
        options: [
          "Blocks are only for babies",
          "No typing or spelling mistakes, so you can focus on ideas",
          "Blocks work without a computer",
          "Typing is not allowed at school",
        ],
        correctIndex: 1,
        explanation: "Blocks let you see and snap instructions, so you think about the idea, not the typing.",
      },
      {
        difficulty: "hard",
        type: "mcq",
        prompt: "A stack has “move 10 steps” and “say Hi!”, but nothing happens when you click the green flag. What’s missing?",
        options: [
          "A start block like “when green flag clicked” on top",
          "More motion blocks",
          "A bigger screen",
          "A second character",
        ],
        correctIndex: 0,
        explanation: "Without a start block on top, the program doesn’t know when to begin.",
      },
    ],
  },

  A12: {
    notes: {
      bigIdea:
        "To make a character move, start with an event block — “when green flag clicked” — then add motion blocks like “move 10 steps” and “turn 90 degrees”. Use small numbers first. Try it, watch what happens, and change one block at a time.",
      definitions: [
        {
          term: "Event block",
          meaning: "A block that starts things when something happens, like “when green flag clicked”.",
        },
        {
          term: "Motion block",
          meaning: "A block that moves or turns the character.",
        },
        {
          term: "Steps",
          meaning: "How far the character moves. “move 20 steps” goes twice as far as “move 10 steps”.",
        },
        {
          term: "Turn 90 degrees",
          meaning: "A quarter turn — like turning a corner at the end of your street.",
        },
      ],
      panels: [
        {
          title: "Event + motion",
          body: [
            "Top: “when green flag clicked” — the event.",
            "Below: “move 10 steps” and “turn 90 degrees” — the motion.",
            "Click the flag, and the character follows the stack.",
          ],
        },
        {
          title: "Small numbers first",
          body: [
            "Start with “move 10 steps” and “turn 90 degrees”.",
            "Big numbers can zoom the character off the screen!",
            "Small steps are easier to check.",
          ],
        },
        {
          title: "Turning around",
          body: [
            "One 90° turn = a quarter turn, like a corner.",
            "Two 90° turns = facing the other way.",
            "Four 90° turns = back where you started facing.",
          ],
        },
        {
          title: "Try, watch, change one block",
          body: [
            "Try: click the green flag.",
            "Watch: where did the character really go?",
            "Change one block or number, then try again. “move 10” → “move 20” goes twice as far.",
          ],
        },
      ],
      remember: [
        "Event on top: “when green flag clicked”.",
        "Motion: “move 10 steps”, “turn 90 degrees”.",
        "Two 90° turns = face the other way.",
        "Try, watch, change one block.",
      ],
      checkYourself: {
        q: "To face the other way, how many 90° turns?",
        a: "Two. Each 90° turn is a quarter turn, so two of them make a half turn.",
      },
      dinoLine: "Chapter 2 done. You can make a character move and turn — super work, champ!",
    },
    quiz: [
      {
        difficulty: "easy",
        type: "mcq",
        prompt: "Which block is the event that starts the program?",
        options: ["“move 10 steps”", "“when green flag clicked”", "“turn 90 degrees”", "“wait 1 seconds”"],
        correctIndex: 1,
        explanation: "“When green flag clicked” is the event that starts everything.",
      },
      {
        difficulty: "easy",
        type: "true_false",
        prompt: "“move 10 steps” is a motion block.",
        options: ["True", "False"],
        correctIndex: 0,
        explanation: "It moves the character, so it is a motion block.",
      },
      {
        difficulty: "easy",
        type: "mcq",
        prompt: "What does “turn 90 degrees” do?",
        options: [
          "Moves the character far forward",
          "Makes the character jump",
          "Makes the character disappear",
          "Turns the character a quarter turn, like a corner",
        ],
        correctIndex: 3,
        explanation: "90 degrees is a quarter turn — like turning a corner.",
      },
      {
        difficulty: "easy",
        type: "mcq",
        prompt: "When you first try moving a character, which numbers are best?",
        options: [
          "Very big ones, like move 1000",
          "No numbers at all",
          "Small ones, like move 10 and turn 90",
          "Only zero",
        ],
        correctIndex: 2,
        explanation: "Small numbers are easier to watch and check.",
      },
      {
        difficulty: "medium",
        type: "mcq",
        prompt: "Which stack is in the right order for a short path?",
        options: [
          "when green flag clicked → move 10 steps → turn 90 degrees → move 10 steps",
          "move 10 steps → when green flag clicked → turn 90 degrees",
          "turn 90 degrees → move 10 steps → when green flag clicked",
          "move 10 steps → turn 90 degrees → when green flag clicked",
        ],
        correctIndex: 0,
        explanation: "The event block goes on top, then the motion blocks follow.",
      },
      {
        difficulty: "medium",
        type: "mcq",
        prompt: "You change “move 10 steps” to “move 20 steps”. What will happen?",
        options: [
          "The character moves half as far",
          "The character turns around",
          "The character moves twice as far",
          "The character doesn’t move",
        ],
        correctIndex: 2,
        explanation: "20 is double 10, so the character goes twice as far.",
      },
      {
        difficulty: "medium",
        type: "true_false",
        prompt: "When a path goes wrong, it’s best to change lots of blocks at once.",
        options: ["True", "False"],
        correctIndex: 1,
        explanation: "Change one block at a time so you can see what each change does.",
      },
      {
        difficulty: "medium",
        type: "mcq",
        prompt: "In “try, watch, change one block”, why do we watch?",
        options: [
          "To take a rest",
          "To make the program faster",
          "To add more colours",
          "To see where the character really went before changing anything",
        ],
        correctIndex: 3,
        explanation: "Watching shows you what happened, so you know what to change.",
      },
      {
        difficulty: "hard",
        type: "mcq",
        prompt: "To make the character face the other way, how many 90° turns do you need?",
        options: ["1", "4", "2", "3"],
        correctIndex: 2,
        explanation: "Two quarter turns make a half turn — now it faces the other way.",
      },
      {
        difficulty: "hard",
        type: "mcq",
        prompt: "Stack: when green flag clicked → move 10 steps → turn 90 degrees → move 10 steps. You want it to go straight instead. Which block should you remove?",
        options: [
          "“when green flag clicked”",
          "“turn 90 degrees”",
          "The first “move 10 steps”",
          "The second “move 10 steps”",
        ],
        correctIndex: 1,
        explanation: "Without the turn, both moves go the same way — straight ahead.",
      },
    ],
  },
};
