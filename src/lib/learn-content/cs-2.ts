import type { LessonContentBank } from "./types";

export const CS_CONTENT_2: LessonContentBank = {
  A13: {
    notes: {
      bigIdea:
        "A variable is a box with a name on it. It holds one thing — like a number or a word — and you can change what’s inside while your game runs.",
      definitions: [
        {
          term: "Variable",
          meaning: "A named box that stores a value, like score, lives, or your player’s name.",
        },
        {
          term: "Value",
          meaning: "What is inside the box right now — for example 5, or “Riya”.",
        },
        {
          term: "Set block",
          meaning: "A block like “set score to 0” that puts a new value in the box.",
        },
        {
          term: "Change block",
          meaning: "A block like “change score by 1” that adds to (or takes away from) the value.",
        },
      ],
      panels: [
        {
          title: "A box with a label",
          body: [
            "Think of your tiffin box with your name stuck on it.",
            "The label tells you whose it is; inside is today’s lunch.",
            "A variable is the same: a name outside, a value inside.",
          ],
        },
        {
          title: "Variables in a game",
          body: [
            "score — how many points you have (starts at 0).",
            "lives — how many chances are left (like 3).",
            "name — the player’s nickname, a word instead of a number.",
          ],
        },
        {
          title: "Changing the box",
          body: [
            "Score is 5. “change score by 1” → score becomes 6.",
            "Lives are 3. Hit a spike → “change lives by −1” → lives become 2.",
            "“set score to 0” at the start makes every game begin fresh.",
          ],
        },
        {
          title: "Good names, bad names",
          body: [
            "Good: stars, lives, score. You know what they store!",
            "Bad: x1, box, abc. Nobody can tell what is inside.",
            "Keep names short and clear, like a label on a school bag.",
          ],
        },
      ],
      remember: [
        "A variable is a named box that holds a value.",
        "You can change what’s in the box.",
        "Add 1 → the number goes up by 1. Take 1 → down by 1.",
        "Use short, clear names: stars, not x1.",
      ],
      checkYourself: {
        q: "A game has 3 lives. The player hits a spike. What should the lives box become?",
        a: "2. Hitting the spike takes away 1 life, so 3 − 1 = 2.",
      },
      dinoLine: "Chapter 3 done. You can store and change values in variable boxes — super work, champ!",
    },
    quiz: [
      {
        difficulty: "easy",
        type: "mcq",
        prompt: "In coding, a variable is like…",
        options: [
          "A named box that holds a value",
          "A button on the keyboard",
          "A picture of a cat",
          "A wire inside the computer",
        ],
        correctIndex: 0,
        explanation: "A variable is a box with a name, and it stores a value inside.",
      },
      {
        difficulty: "easy",
        type: "mcq",
        prompt: "Which of these could be a variable in a game?",
        options: ["The screen glass", "Score", "The mouse cable", "The charger"],
        correctIndex: 1,
        explanation: "Score is a value the game stores and changes — so it’s a variable.",
      },
      {
        difficulty: "easy",
        type: "true_false",
        prompt: "You can change what’s inside a variable box while the game runs.",
        options: ["True", "False"],
        correctIndex: 0,
        explanation: "That’s the whole point — the value in the box can change.",
      },
      {
        difficulty: "easy",
        type: "mcq",
        prompt: "The score box shows 5. The player gets 1 more point. What is the score now?",
        options: ["4", "5", "15", "6"],
        correctIndex: 3,
        explanation: "Adding 1 to 5 makes 6.",
      },
      {
        difficulty: "medium",
        type: "mcq",
        prompt: "Which is the best name for a box that counts stars collected?",
        options: ["x1", "box", "stars", "abc"],
        correctIndex: 2,
        explanation: "“stars” is short and clear — anyone can tell what it stores.",
      },
      {
        difficulty: "medium",
        type: "mcq",
        prompt: "The lives box shows 3. Which block would make it 2?",
        options: ["change lives by −1", "set lives to 10", "change lives by 1", "say lives"],
        correctIndex: 0,
        explanation: "Changing lives by −1 takes one away: 3 − 1 = 2.",
      },
      {
        difficulty: "medium",
        type: "mcq",
        prompt: "Why are clear names better than names like x1?",
        options: [
          "They make the game run faster",
          "You and your friends can tell what the box stores",
          "The computer can only read long words",
          "They change the colour of the block",
        ],
        correctIndex: 1,
        explanation: "Clear names help people understand what each box is for.",
      },
      {
        difficulty: "medium",
        type: "true_false",
        prompt: "A variable can only hold numbers, never words.",
        options: ["True", "False"],
        correctIndex: 1,
        explanation: "A variable can hold a word too, like a player’s name.",
      },
      {
        difficulty: "hard",
        type: "mcq",
        prompt:
          "A game starts with “set score to 0”. The player collects 3 coins (each does “change score by 1”), then hits a bug that does “change score by −1”. What is the score?",
        options: ["3", "4", "2", "1"],
        correctIndex: 2,
        explanation: "0 + 1 + 1 + 1 = 3, then 3 − 1 = 2.",
      },
      {
        difficulty: "hard",
        type: "mcq",
        prompt: "Riya’s lives box starts at 3. She hits a spike two times. What should lives show?",
        options: ["3", "2", "5", "1"],
        correctIndex: 3,
        explanation: "Each spike takes 1 life: 3 − 1 − 1 = 1.",
      },
    ],
  },

  A14: {
    notes: {
      bigIdea:
        "Code can make choices, just like you do. An “if … then … else” block checks one condition: if it’s true, do one thing; if not, do something else.",
      definitions: [
        {
          term: "Condition",
          meaning: "A question with a yes/no answer, like “touching wall?”",
        },
        {
          term: "If block",
          meaning: "A block that runs the blocks inside it only when the condition is true.",
        },
        {
          term: "Else",
          meaning: "The part that runs when the condition is false — the “otherwise”.",
        },
        {
          term: "True / False",
          meaning: "The two answers a condition can have. True means yes; false means no.",
        },
      ],
      panels: [
        {
          title: "Same thinking as Unit 2",
          body: [
            "Remember: “If it is raining, take an umbrella.”",
            "“Else wear a cap” is what you do when it’s not raining.",
            "Now we build the same idea with coding blocks.",
          ],
        },
        {
          title: "Reading an if/else block",
          body: [
            "“if touching wall then bounce, else move 10 steps”.",
            "Touching wall? True → the character bounces.",
            "Not touching? False → it keeps walking.",
          ],
        },
        {
          title: "Match the story to a block",
          body: [
            "Story: “When the ball hits the goal, the crowd cheers.”",
            "Block: “if touching goal then play cheer sound”.",
            "Story: “If the cat touches the coin, score goes up” → “if touching coin then change score by 1”.",
          ],
        },
        {
          title: "One condition at a time",
          body: [
            "Check just one question in each if-block.",
            "If the condition is false and there is no else, nothing happens.",
            "Missed the coin? The score stays the same.",
          ],
        },
      ],
      remember: [
        "If the condition is true, the inside blocks run.",
        "Else runs when the condition is false.",
        "Check one condition at a time.",
        "No else + false condition = nothing happens.",
      ],
      checkYourself: {
        q: "If touching coin, then add 1 to score. What happens when the character misses the coin?",
        a: "Nothing changes. The condition is false, so the score stays the same.",
      },
      dinoLine: "Chapter 4 done. You can make your code choose with if and else — super work, champ!",
    },
    quiz: [
      {
        difficulty: "easy",
        type: "mcq",
        prompt: "An if-block in code helps the computer…",
        options: ["Make a choice", "Draw a picture", "Turn off the screen", "Print a page"],
        correctIndex: 0,
        explanation: "An if-block checks a condition and chooses what to do.",
      },
      {
        difficulty: "easy",
        type: "true_false",
        prompt: "An “if … then” block runs its inside blocks only when the condition is true.",
        options: ["True", "False"],
        correctIndex: 0,
        explanation: "True condition → the inside blocks run. False → they are skipped.",
      },
      {
        difficulty: "easy",
        type: "mcq",
        prompt: "In “if touching wall then bounce”, what is the condition?",
        options: ["bounce", "touching wall", "the character", "then"],
        correctIndex: 1,
        explanation: "The condition is the yes/no question: touching wall?",
      },
      {
        difficulty: "easy",
        type: "mcq",
        prompt: "“If it is raining, take an umbrella; else wear a cap.” Which part is the else?",
        options: ["It is raining", "Take an umbrella", "Wear a cap", "If"],
        correctIndex: 2,
        explanation: "Else is what you do when it’s not raining — wear a cap.",
      },
      {
        difficulty: "medium",
        type: "mcq",
        prompt:
          "Block: “if touching wall then bounce, else move 10 steps”. The cat is NOT touching the wall. What does it do?",
        options: ["Bounces", "Stops forever", "Says hello", "Moves 10 steps"],
        correctIndex: 3,
        explanation: "The condition is false, so the else part runs: move 10 steps.",
      },
      {
        difficulty: "medium",
        type: "mcq",
        prompt: "Story: “When the ball touches the goal, the crowd cheers.” Which block fits?",
        options: [
          "if touching goal then play cheer sound",
          "if touching goal then hide",
          "repeat 10 times move 10 steps",
          "set score to 0",
        ],
        correctIndex: 0,
        explanation: "The condition is touching goal, and the action is the cheer.",
      },
      {
        difficulty: "medium",
        type: "true_false",
        prompt: "When you are starting out, it’s best to check lots of conditions in one if-block.",
        options: ["True", "False"],
        correctIndex: 1,
        explanation: "Keep it simple — check one condition at a time.",
      },
      {
        difficulty: "medium",
        type: "mcq",
        prompt: "Making choices in code uses the same thinking as…",
        options: [
          "Colouring a drawing",
          "The if-then stories from Unit 2",
          "Charging a tablet",
          "Typing very fast",
        ],
        correctIndex: 1,
        explanation: "If/else blocks are the Unit 2 “if this, then that” stories, now in code.",
      },
      {
        difficulty: "hard",
        type: "mcq",
        prompt:
          "Block: “if touching star then change score by 1”. Score is 4. The character jumps over the star without touching it. What is the score?",
        options: ["5", "0", "4", "3"],
        correctIndex: 2,
        explanation: "It never touched the star, so the condition was false and score stays 4.",
      },
      {
        difficulty: "hard",
        type: "mcq",
        prompt: "A dog in a game should bark only when it touches the cat. Which block is right?",
        options: [
          "if touching edge then say “Woof!”",
          "if score is 0 then say “Woof!”",
          "forever say “Woof!”",
          "if touching cat then say “Woof!”",
        ],
        correctIndex: 3,
        explanation: "The condition must be about the cat — touching cat.",
      },
    ],
  },

  A15: {
    notes: {
      bigIdea:
        "Today you build your own tiny program — a 5 to 8 block animation or joke. Real coders follow four steps: idea → blocks → test → fix.",
      definitions: [
        {
          term: "Plan",
          meaning: "Writing or drawing your idea on paper before you start snapping blocks.",
        },
        {
          term: "Test",
          meaning: "Running your program to see if it does what you wanted.",
        },
        {
          term: "Bug",
          meaning: "A mistake that makes the program do something you didn’t plan.",
        },
        {
          term: "Fix (debug)",
          meaning: "Finding the bug and changing the blocks so it works.",
        },
      ],
      panels: [
        {
          title: "Step 1 · Pick an idea",
          body: [
            "Keep it tiny: “Cat walks, then says hello.”",
            "Or a joke: “Dino walks in and says, ‘Why did the bat go to school?’”",
            "One character and one short story is enough.",
          ],
        },
        {
          title: "Step 2 · Plan on paper",
          body: [
            "Start: “when green flag clicked”.",
            "Two motions: “move 10 steps”, “move 10 steps”.",
            "One say-block: “say Hello! for 2 seconds”.",
          ],
        },
        {
          title: "Step 3 · Build and test",
          body: [
            "Snap the blocks together in the same order as your plan.",
            "Click the green flag and watch closely.",
            "Did it do what you planned? If not, you found a bug!",
          ],
        },
        {
          title: "Step 4 · Fix and share",
          body: [
            "Bug: cat says hello before walking? Move the say-block below the move blocks.",
            "Bug: cat walks off screen? Add “if touching edge then bounce”.",
            "Share one thing you changed after testing — that’s what real coders do.",
          ],
        },
      ],
      remember: [
        "Idea → blocks → test → fix.",
        "Plan: a start block, 2 motions, 1 say-block.",
        "Bugs are normal — every coder finds them.",
        "Share one thing you changed after testing.",
      ],
      checkYourself: {
        q: "List the blocks you would use for ‘cat walks, then says hello’.",
        a: "“when green flag clicked” → “move 10 steps” → “move 10 steps” → “say Hello!”.",
      },
      dinoLine: "Chapter 5 done and Unit 3 complete. You built, tested, and fixed your first program — super work, champ!",
    },
    quiz: [
      {
        difficulty: "easy",
        type: "mcq",
        prompt: "What is the first step in building a mini program?",
        options: ["Test it", "Fix bugs", "Pick an idea", "Share it"],
        correctIndex: 2,
        explanation: "You start with an idea, then plan and build.",
      },
      {
        difficulty: "easy",
        type: "mcq",
        prompt: "Which block usually starts a program?",
        options: ["when green flag clicked", "move 10 steps", "say Hello!", "wait 1 second"],
        correctIndex: 0,
        explanation: "“when green flag clicked” tells the program when to begin.",
      },
      {
        difficulty: "easy",
        type: "true_false",
        prompt: "A bug is a mistake that makes a program do something you didn’t plan.",
        options: ["True", "False"],
        correctIndex: 0,
        explanation: "Yes — a bug is a mistake in the program.",
      },
      {
        difficulty: "easy",
        type: "mcq",
        prompt: "Why do we plan on paper before using blocks?",
        options: [
          "Paper makes the computer faster",
          "So we know which blocks we need and in what order",
          "So we never have to test",
          "Because blocks only work with paper",
        ],
        correctIndex: 1,
        explanation: "A plan shows you the blocks and their order before you build.",
      },
      {
        difficulty: "medium",
        type: "mcq",
        prompt: "The plan order is idea → blocks → test → ___. What comes next?",
        options: ["Idea", "Blocks", "Delete", "Fix"],
        correctIndex: 3,
        explanation: "After testing, you fix any bugs you found.",
      },
      {
        difficulty: "medium",
        type: "mcq",
        prompt: "Which block list makes ‘cat walks, then says hello’?",
        options: [
          "say Hello! → when green flag clicked → move 10 steps",
          "when green flag clicked → say Hello!",
          "when green flag clicked → move 10 steps → say Hello!",
          "move 10 steps → move 10 steps",
        ],
        correctIndex: 2,
        explanation: "Start block first, then the walk, then the hello.",
      },
      {
        difficulty: "medium",
        type: "true_false",
        prompt: "If your program doesn’t work the first time, it means you are bad at coding.",
        options: ["True", "False"],
        correctIndex: 1,
        explanation: "Every coder finds bugs — testing and fixing is part of the job.",
      },
      {
        difficulty: "medium",
        type: "mcq",
        prompt: "Your cat says hello before walking, but you wanted it to walk first. What is the best fix?",
        options: [
          "Delete the whole program",
          "Move the say-block below the move blocks",
          "Add three more say-blocks",
          "Change the cat’s colour",
        ],
        correctIndex: 1,
        explanation: "The order was wrong, so moving the say-block fixes it.",
      },
      {
        difficulty: "hard",
        type: "mcq",
        prompt: "Arjun’s cat walks off the edge of the screen and disappears. Which block could fix this bug?",
        options: ["say Hello!", "set score to 0", "hide", "if touching edge then bounce"],
        correctIndex: 3,
        explanation: "Bouncing at the edge keeps the cat on the screen.",
      },
      {
        difficulty: "hard",
        type: "mcq",
        prompt: "Which is a good plan for a tiny mini program?",
        options: [
          "50 blocks and 10 characters",
          "Random blocks with no plan",
          "A start block, 2 motion blocks, and 1 say-block",
          "Only a say-block, with no start block",
        ],
        correctIndex: 2,
        explanation: "Small and clear: start, two motions, one say-block.",
      },
    ],
  },

  A16: {
    notes: {
      bigIdea:
        "Lots of people use computers in their jobs — they make games, apps, cartoons, and robots. You don’t need to be a genius; you get better with practice, just like cricket.",
      definitions: [
        {
          term: "Game developer",
          meaning: "A person who builds video games — the levels, the characters, and the rules.",
        },
        {
          term: "App developer",
          meaning: "A person who builds apps for phones and tablets, like maps or UPI payment apps.",
        },
        {
          term: "Animator",
          meaning: "A person who uses computers to make cartoons and moving pictures.",
        },
        {
          term: "Robotics engineer",
          meaning: "A person who builds robots and writes the steps that tell them what to do.",
        },
      ],
      panels: [
        {
          title: "Jobs that use computers",
          body: [
            "Game developers build games you play on a tablet.",
            "App developers made the maps app and the UPI app your parents use.",
            "Animators make cartoons; robotics engineers build robots.",
          ],
        },
        {
          title: "What they tell computers",
          body: [
            "Game developer: “if touching coin then change score by 1”.",
            "Animator: “move the character a little, again and again”.",
            "Robotics engineer: “pick up box, turn, put down box”.",
          ],
        },
        {
          title: "You already know their tools",
          body: [
            "Algorithms — step-by-step instructions (Unit 2).",
            "Blocks, variables and if-blocks (Unit 3).",
            "Real developers use these same ideas every day!",
          ],
        },
        {
          title: "Practise like sport",
          body: [
            "Nobody is born knowing how to code.",
            "Like batting in cricket, you get better with practice.",
            "Kids can code too — you just did!",
          ],
        },
      ],
      remember: [
        "Games, apps, cartoons and robots are made by people using computers.",
        "Developers use algorithms and blocks — like you!",
        "You don’t need to be a genius; practise a little, often.",
        "Kids can learn to code, not only adults.",
      ],
      checkYourself: {
        q: "Name one job that uses computers and one thing that person might tell a computer to do.",
        a: "A game developer might tell the computer: “if the player touches a coin, add 1 to the score.”",
      },
      dinoLine: "Chapter 1 done. You met game devs, app devs, animators and robot builders — super work, champ!",
    },
    quiz: [
      {
        difficulty: "easy",
        type: "mcq",
        prompt: "Which person uses a computer to build video games?",
        options: ["Game developer", "Bus conductor", "Potter at a wheel", "Swimming coach"],
        correctIndex: 0,
        explanation: "Game developers build games using computers.",
      },
      {
        difficulty: "easy",
        type: "mcq",
        prompt: "An app developer builds…",
        options: ["Bridges", "Apps for phones and tablets", "Cricket bats", "School buildings"],
        correctIndex: 1,
        explanation: "App developers make apps, like maps or payment apps.",
      },
      {
        difficulty: "easy",
        type: "true_false",
        prompt: "Only adults can learn to code.",
        options: ["True", "False"],
        correctIndex: 1,
        explanation: "Kids can code too — you’ve been doing it in this course!",
      },
      {
        difficulty: "easy",
        type: "mcq",
        prompt: "An animator uses computers to…",
        options: ["Fix car tyres", "Cook food", "Make cartoons and moving pictures", "Sweep floors"],
        correctIndex: 2,
        explanation: "Animators make cartoons and moving pictures on computers.",
      },
      {
        difficulty: "medium",
        type: "mcq",
        prompt: "Robotics engineers tell robots what to do using…",
        options: ["Magic words", "Shouting loudly", "Paint", "Algorithms — step-by-step instructions"],
        correctIndex: 3,
        explanation: "Robots follow algorithms written by people.",
      },
      {
        difficulty: "medium",
        type: "mcq",
        prompt: "How do people get good at coding?",
        options: [
          "They are born geniuses",
          "They practise a little, often — like cricket",
          "They only watch others code",
          "They never make mistakes",
        ],
        correctIndex: 1,
        explanation: "Coding is like sport — practice makes you better.",
      },
      {
        difficulty: "medium",
        type: "mcq",
        prompt: "Who built the maps and UPI apps your family uses?",
        options: ["App developers and engineers", "Doctors", "Actors", "Shopkeepers"],
        correctIndex: 0,
        explanation: "App developers and engineers build the apps we use every day.",
      },
      {
        difficulty: "medium",
        type: "mcq",
        prompt: "A game developer uses “if touching coin then change score by 1”. Which ideas from earlier lessons does it use?",
        options: ["Typing speed", "Printers and cables", "An if-block and a variable", "Passwords"],
        correctIndex: 2,
        explanation: "It’s an if-block (a choice) changing a variable (the score).",
      },
      {
        difficulty: "hard",
        type: "mcq",
        prompt: "Which pair matches a job to something that person might tell a computer?",
        options: [
          "Animator → “move the character a little each frame”",
          "Game developer → “bake a cake in the oven”",
          "Robotics engineer → “water the garden by hand”",
          "App developer → “paint the classroom wall”",
        ],
        correctIndex: 0,
        explanation: "Animators tell computers how to move characters to make cartoons.",
      },
      {
        difficulty: "hard",
        type: "mcq",
        prompt: "Meera loves drawing and making up stories. Which computer job might suit her best?",
        options: ["Server repair", "Animator", "Keyboard maker", "Factory robot mechanic"],
        correctIndex: 1,
        explanation: "Animators use drawing and stories to make cartoons on computers.",
      },
    ],
  },

  A17: {
    notes: {
      bigIdea:
        "Every app follows input → process → output. You give it something, it works on it, and it shows you a result. Some apps also notice patterns and decide things for you.",
      definitions: [
        {
          term: "Input",
          meaning: "What you give the app — typing a place, tapping a button, taking a photo.",
        },
        {
          term: "Process",
          meaning: "The work the app does inside, like finding the best path.",
        },
        {
          term: "Output",
          meaning: "What the app shows or says back — a route, a photo, a green tick.",
        },
        {
          term: "Pattern",
          meaning: "Something that happens again and again, like you always watching cricket videos.",
        },
      ],
      panels: [
        {
          title: "A maps app",
          body: [
            "Input: you type “India Gate” or “school”.",
            "Process: the app finds a good path through the roads.",
            "Output: it draws the route and says “turn left in 200 metres”.",
          ],
        },
        {
          title: "A video app",
          body: [
            "You watch lots of cricket videos.",
            "The app notices the pattern.",
            "It decides to show you more cricket next — we’ll learn more when we study AI.",
          ],
        },
        {
          title: "Camera and quiz apps",
          body: [
            "Camera: press the button (input) → app saves the picture (process) → photo on screen (output).",
            "Quiz: tap an answer (input) → app checks it (process) → green tick (output).",
            "Try it with your favourite app!",
          ],
        },
        {
          title: "Apps decide things for you",
          body: [
            "Maps decides which road it thinks is best.",
            "Video apps decide what to show next.",
            "You can still choose — apps only suggest.",
          ],
        },
      ],
      remember: [
        "Input → process → output.",
        "Maps: place in → path found → route out.",
        "Video apps suggest by noticing patterns.",
        "Apps decide some things for you, like the next video.",
      ],
      checkYourself: {
        q: "For a maps app, what is the input and what is the output?",
        a: "Input: the place you type in. Output: the route drawn on the map (and the directions).",
      },
      dinoLine: "Chapter 2 done. You can spot input, process and output in apps — super work, champ!",
    },
    quiz: [
      {
        difficulty: "easy",
        type: "mcq",
        prompt: "In a maps app, typing “India Gate” is the…",
        options: ["Output", "Input", "Process", "Battery"],
        correctIndex: 1,
        explanation: "What you type in is the input.",
      },
      {
        difficulty: "easy",
        type: "mcq",
        prompt: "The route line drawn on the map is the…",
        options: ["Input", "Password", "Output", "Keyboard"],
        correctIndex: 2,
        explanation: "What the app shows you back is the output.",
      },
      {
        difficulty: "easy",
        type: "true_false",
        prompt: "Finding the best path is the process step in a maps app.",
        options: ["True", "False"],
        correctIndex: 0,
        explanation: "The app works out the path inside — that’s the process.",
      },
      {
        difficulty: "easy",
        type: "mcq",
        prompt: "Which three steps does every app follow?",
        options: [
          "Start, pause, stop",
          "Idea, picture, colour",
          "Charge, open, close",
          "Input, process, output",
        ],
        correctIndex: 3,
        explanation: "Apps take input, process it, and give output.",
      },
      {
        difficulty: "medium",
        type: "mcq",
        prompt: "A video app shows you more cricket videos after you watch lots of cricket. Why?",
        options: [
          "It notices a pattern in what you watch",
          "It reads your mind",
          "Your friend told it",
          "It picks totally at random",
        ],
        correctIndex: 0,
        explanation: "The app notices what you watch again and again — a pattern.",
      },
      {
        difficulty: "medium",
        type: "mcq",
        prompt: "In a camera app, what is the output?",
        options: ["Pressing the button", "The photo on the screen", "The lens", "Your finger"],
        correctIndex: 1,
        explanation: "The photo you see is what the app gives back — the output.",
      },
      {
        difficulty: "medium",
        type: "mcq",
        prompt: "In a quiz app, you tap an answer, the app checks it, and shows a green tick. What is the process?",
        options: [
          "Tapping the answer",
          "Showing the green tick",
          "Checking if the answer is right",
          "The tablet screen",
        ],
        correctIndex: 2,
        explanation: "Checking the answer is the work done inside — the process.",
      },
      {
        difficulty: "medium",
        type: "true_false",
        prompt: "Apps never decide anything for you.",
        options: ["True", "False"],
        correctIndex: 1,
        explanation: "Apps do decide some things, like which road or which video to suggest.",
      },
      {
        difficulty: "hard",
        type: "mcq",
        prompt:
          "You ask a maps app for the way from school to the park. It says “Turn left in 200 metres.” That spoken direction is the…",
        options: ["Input", "Process", "Name of the school", "Output"],
        correctIndex: 3,
        explanation: "The app is telling you a result, so it’s output.",
      },
      {
        difficulty: "hard",
        type: "mcq",
        prompt: "Which is one thing a video app decides for you?",
        options: [
          "How loudly you laugh",
          "Which videos to suggest next",
          "What your tablet is made of",
          "Your real name",
        ],
        correctIndex: 1,
        explanation: "Video apps choose what to suggest next based on patterns.",
      },
    ],
  },

  A18: {
    notes: {
      bigIdea:
        "A robot is a machine that follows algorithms — step-by-step instructions written by people. It doesn’t feel or think like you. Robots are great at repeat jobs, but poor at brand-new messy ones without instructions.",
      definitions: [
        {
          term: "Robot",
          meaning: "A machine that does jobs by following instructions written by people.",
        },
        {
          term: "Automation",
          meaning: "Letting a machine do a job by itself, again and again, without a person doing each step.",
        },
        {
          term: "Algorithm",
          meaning: "Step-by-step instructions — the robot’s recipe.",
        },
        {
          term: "Loop",
          meaning: "Repeating the same steps again and again — robots love loops!",
        },
      ],
      panels: [
        {
          title: "Robots follow steps",
          body: [
            "A robot reads its algorithm, one step at a time.",
            "It doesn’t feel happy, sad, or bored.",
            "No instructions? It doesn’t know what to do.",
          ],
        },
        {
          title: "Great at repeat jobs",
          body: [
            "A vacuum robot cleans the floor row by row — a loop.",
            "A factory arm fixes the same part on every car, all day.",
            "It never gets tired of doing the same thing.",
          ],
        },
        {
          title: "Poor at brand-new, messy jobs",
          body: [
            "Juice spilled? A robot waiter just keeps following its steps.",
            "It can’t invent a new game by itself — nobody gave it steps for that.",
            "People are better at new ideas and feelings.",
          ],
        },
        {
          title: "Same idea, different jobs",
          body: [
            "Home robot: vacuum cleaner that sweeps your room.",
            "Factory arm: builds cars or packs boxes.",
            "Space robot: a rover driving on Mars taking photos.",
          ],
        },
      ],
      remember: [
        "Robots follow algorithms — they don’t feel.",
        "Great at repeat jobs (loops!).",
        "Poor at brand-new, messy jobs without instructions.",
        "Home, factory, space robots — same idea, different jobs.",
      ],
      checkYourself: {
        q: "Why can’t a vacuum robot invent a new game by itself?",
        a: "It only follows the steps people gave it. It has no instructions for making a new game, and it can’t think up new ideas.",
      },
      dinoLine: "Chapter 3 done. You know what robots can and can’t do — super work, champ!",
    },
    quiz: [
      {
        difficulty: "easy",
        type: "mcq",
        prompt: "A robot does its job by following…",
        options: [
          "Its feelings",
          "Algorithms — step-by-step instructions",
          "Its dreams",
          "Whatever it wants that day",
        ],
        correctIndex: 1,
        explanation: "Robots follow algorithms written by people.",
      },
      {
        difficulty: "easy",
        type: "true_false",
        prompt: "A robot feels happy when it finishes a job.",
        options: ["True", "False"],
        correctIndex: 1,
        explanation: "Robots don’t have feelings — they just follow steps.",
      },
      {
        difficulty: "easy",
        type: "mcq",
        prompt: "Which job is a robot great at?",
        options: [
          "Inventing a brand-new game",
          "Comforting a sad friend",
          "Choosing a birthday gift by itself",
          "Doing the same task again and again",
        ],
        correctIndex: 3,
        explanation: "Robots are great at repeat jobs and never get tired.",
      },
      {
        difficulty: "easy",
        type: "mcq",
        prompt: "A robot arm that builds cars is an example of a…",
        options: ["Space robot", "Home robot", "Factory robot", "Toy car"],
        correctIndex: 2,
        explanation: "Robot arms in factories build cars and pack boxes.",
      },
      {
        difficulty: "medium",
        type: "true_false",
        prompt: "Robots are good at messy, brand-new jobs even without any instructions.",
        options: ["True", "False"],
        correctIndex: 1,
        explanation: "Without instructions, a robot doesn’t know what to do in a new situation.",
      },
      {
        difficulty: "medium",
        type: "mcq",
        prompt: "A vacuum robot cleans a room row by row, again and again. Which coding idea is this most like?",
        options: ["A loop", "A password", "A URL", "A printer"],
        correctIndex: 0,
        explanation: "Repeating the same steps again and again is a loop.",
      },
      {
        difficulty: "medium",
        type: "mcq",
        prompt: "A robot that drives on Mars and takes photos is a…",
        options: ["Home robot", "Space robot", "Factory arm", "Kitchen robot"],
        correctIndex: 1,
        explanation: "Rovers on Mars are space robots.",
      },
      {
        difficulty: "medium",
        type: "mcq",
        prompt: "What is the same about home robots, factory arms, and space robots?",
        options: [
          "They all live in space",
          "They all can cook dinner",
          "They all have feelings",
          "They all follow instructions written by people",
        ],
        correctIndex: 3,
        explanation: "Different jobs, same idea: they all follow algorithms.",
      },
      {
        difficulty: "hard",
        type: "mcq",
        prompt:
          "A robot waiter’s steps are: go to table, give plate, come back. A child spills juice. What will the robot most likely do?",
        options: [
          "Clean it up without being told",
          "Keep following its steps, because spills aren’t in its instructions",
          "Get angry at the child",
          "Call the child’s parents",
        ],
        correctIndex: 1,
        explanation: "A robot only does what its algorithm says — a spill is a new, messy job.",
      },
      {
        difficulty: "hard",
        type: "mcq",
        prompt: "Finish the robot’s algorithm to water a plant: 1. Pick up can. 2. Walk to plant. 3. ___ 4. Walk back.",
        options: ["Dance", "Take a photo", "Tip the can to pour water", "Switch off"],
        correctIndex: 2,
        explanation: "To water the plant, the robot must pour water before walking back.",
      },
    ],
  },

  A19: {
    notes: {
      bigIdea:
        "Data is the facts a computer remembers — names, scores, photos. Computers keep data in very tidy lists so things are easy to find. Some data is private and must stay private.",
      definitions: [
        {
          term: "Data",
          meaning: "Facts a computer stores, like names, marks, scores, and photos.",
        },
        {
          term: "Organised list",
          meaning: "Data kept in a neat order, like names in ABC order with marks beside them.",
        },
        {
          term: "Public data",
          meaning: "Facts that are OK to share, like your favourite colour or cricket team.",
        },
        {
          term: "Private data",
          meaning: "Facts only you and trusted adults should know, like your address, phone number, or birthday.",
        },
      ],
      panels: [
        {
          title: "What is data?",
          body: [
            "Your name, your class, your marks — all data.",
            "A game remembers your score and your nickname.",
            "A photo on a tablet is data too.",
          ],
        },
        {
          title: "What a school computer stores",
          body: [
            "Students’ names and roll numbers.",
            "Marks in each test.",
            "Parents’ phone numbers — this one is private!",
          ],
        },
        {
          title: "Tidy list vs messy pile",
          body: [
            "Messy: marks written on loose slips stuffed in your school bag.",
            "Tidy: a register with names in ABC order and marks beside them.",
            "Computers keep data tidy so they can find it in a flash.",
          ],
        },
        {
          title: "Keep private data private",
          body: [
            "Private: home address, phone number, birthday, passwords.",
            "Strangers could use it to find you or trick you (remember A5!).",
            "Only share it with trusted adults — like mum, dad, or your teacher.",
          ],
        },
      ],
      remember: [
        "Data is facts the computer stores: names, scores, photos.",
        "Tidy lists are easier to search than a messy pile.",
        "Private data stays private.",
        "Share private data only with trusted adults.",
      ],
      checkYourself: {
        q: "Is your birthday public data or private? Who should you tell?",
        a: "Private. Only tell people you trust, like your family or teacher — never strangers online.",
      },
      dinoLine: "Chapter 4 done. You know what data is and how to keep it safe — super work, champ!",
    },
    quiz: [
      {
        difficulty: "easy",
        type: "mcq",
        prompt: "Data means…",
        options: [
          "Facts a computer stores, like names and scores",
          "Only the colour of the screen",
          "The wires inside a computer",
          "A kind of video game",
        ],
        correctIndex: 0,
        explanation: "Data is the facts a computer remembers.",
      },
      {
        difficulty: "easy",
        type: "mcq",
        prompt: "Which is data a school computer might store?",
        options: [
          "The taste of your tiffin",
          "Students’ names and marks",
          "How the wind feels today",
          "The smell of the canteen",
        ],
        correctIndex: 1,
        explanation: "Schools store facts like names and marks.",
      },
      {
        difficulty: "easy",
        type: "true_false",
        prompt: "A photo saved on a tablet is data too.",
        options: ["True", "False"],
        correctIndex: 0,
        explanation: "Photos are data — the computer stores them.",
      },
      {
        difficulty: "easy",
        type: "mcq",
        prompt: "Why is a tidy list better than a messy pile?",
        options: [
          "It looks more colourful",
          "It uses no electricity",
          "It hides the data",
          "You can find things quickly",
        ],
        correctIndex: 3,
        explanation: "Organised data is much faster to search.",
      },
      {
        difficulty: "medium",
        type: "mcq",
        prompt: "Which of these is private data?",
        options: [
          "Your favourite colour",
          "Your favourite cricket team",
          "Your home address",
          "A cartoon you like",
        ],
        correctIndex: 2,
        explanation: "Your home address could lead a stranger to your door — keep it private.",
      },
      {
        difficulty: "medium",
        type: "mcq",
        prompt: "Which list makes it easiest to find a friend’s score?",
        options: [
          "Names in ABC order with scores beside them",
          "Scores scribbled anywhere on the page",
          "A pile of mixed-up paper slips",
          "Names with no scores",
        ],
        correctIndex: 0,
        explanation: "A tidy, ordered list makes finding things quick.",
      },
      {
        difficulty: "medium",
        type: "true_false",
        prompt: "It’s fine to post your phone number online because it is just a number.",
        options: ["True", "False"],
        correctIndex: 1,
        explanation: "Your phone number is private data — never post it online.",
      },
      {
        difficulty: "medium",
        type: "mcq",
        prompt: "Why should private data stay private?",
        options: [
          "It makes the internet slow",
          "Strangers could use it to find you or trick you",
          "Computers can’t store it",
          "It is too long to type",
        ],
        correctIndex: 1,
        explanation: "Private data in the wrong hands can be used to find or trick you.",
      },
      {
        difficulty: "hard",
        type: "mcq",
        prompt: "A game pop-up asks for your birthday and school name to “win a prize”. What should you do?",
        options: [
          "Type it quickly to win",
          "Give only the school name",
          "Don’t share it, and tell a trusted adult",
          "Ask a friend to type it for you",
        ],
        correctIndex: 2,
        explanation: "Birthday and school are private — don’t share, and tell a grown-up.",
      },
      {
        difficulty: "hard",
        type: "mcq",
        prompt: "A class computer stores students’ names, marks, and parents’ phone numbers. Which should NOT go on a public class web page?",
        options: [
          "The class name",
          "The date of sports day",
          "The number of students in the class",
          "Parents’ phone numbers",
        ],
        correctIndex: 3,
        explanation: "Phone numbers are private data and must stay private.",
      },
    ],
  },

  A20: {
    notes: {
      bigIdea:
        "Now you are the app designer! Invent an app that helps a Class 3–5 child, draw two screens, and present it in one minute. No coding needed — just a clear idea: who it’s for, the input, and the output.",
      definitions: [
        {
          term: "User",
          meaning: "The person who will use your app — for this project, a Class 3–5 child.",
        },
        {
          term: "Screen",
          meaning: "One page of your app, like the start page or the result page.",
        },
        {
          term: "Input and output",
          meaning: "What the user gives the app, and what the app shows back.",
        },
        {
          term: "Pitch",
          meaning: "A short talk (about 1 minute) where you present your app idea.",
        },
      ],
      panels: [
        {
          title: "Step 1 · Find a problem",
          body: [
            "Think of something hard or boring for kids your age.",
            "Forgetting homework? Packing the school bag? Learning spellings?",
            "Give your app a fun name, like “Bag Buddy” or “Spell Star”.",
          ],
        },
        {
          title: "Step 2 · Write the plan",
          body: [
            "Who uses it: “Class 4 kids who forget their books.”",
            "Input: the child taps tomorrow’s subjects.",
            "Output: a checklist of books to pack in the school bag.",
          ],
        },
        {
          title: "Step 3 · Draw 2 screens",
          body: [
            "Screen 1: where the user gives the input (buttons, a box to type).",
            "Screen 2: where the app shows the output (list, stars, a message).",
            "Add one earlier idea: a variable (stars score), a loop (daily reminder), or a safety rule (no home address asked).",
          ],
        },
        {
          title: "Step 4 · Present in 1 minute",
          body: [
            "Say the name, who it’s for, the input, and the output.",
            "Show your two screens.",
            "End with one reason it helps kids. Take a bow!",
          ],
        },
      ],
      remember: [
        "Your app helps a Class 3–5 child.",
        "Plan: name, user, input, output.",
        "Draw 2 screens — no coding needed.",
        "Present in 1 minute, using one idea from earlier units.",
      ],
      checkYourself: {
        q: "Draw or list: app name, who uses it, one input, one output.",
        a: "Example: “Spell Star” — for Class 3 kids. Input: the child types a spelling word. Output: a star if it’s spelt right.",
      },
      dinoLine: "Capstone done — you finished the whole Computer Science track! From how computers work to designing your own app — super work, champ!",
    },
    quiz: [
      {
        difficulty: "easy",
        type: "mcq",
        prompt: "In the capstone, your app should help…",
        options: ["A space rocket", "A child in Class 3–5", "A big factory", "A car engine"],
        correctIndex: 1,
        explanation: "The capstone app is made to help kids your age.",
      },
      {
        difficulty: "easy",
        type: "mcq",
        prompt: "How many screens should you draw for your app?",
        options: ["2", "10", "0", "50"],
        correctIndex: 0,
        explanation: "Two screens: one for the input and one for the output.",
      },
      {
        difficulty: "easy",
        type: "true_false",
        prompt: "You must write real code to finish this capstone.",
        options: ["True", "False"],
        correctIndex: 1,
        explanation: "No coding needed — you draw and describe your idea.",
      },
      {
        difficulty: "easy",
        type: "mcq",
        prompt: "How long should your app presentation be?",
        options: ["10 minutes", "One hour", "About 1 minute", "A whole day"],
        correctIndex: 2,
        explanation: "A short, clear 1-minute pitch is the goal.",
      },
      {
        difficulty: "medium",
        type: "mcq",
        prompt: "App idea: “Tiffin Timer” reminds kids to eat lunch at school. Who is the user?",
        options: ["The tiffin box", "The clock", "The app’s colour", "A school child"],
        correctIndex: 3,
        explanation: "The user is the person using the app — a school child.",
      },
      {
        difficulty: "medium",
        type: "mcq",
        prompt: "In a spelling app, the child types a word. That is the…",
        options: ["Output", "Input", "User", "App name"],
        correctIndex: 1,
        explanation: "What the user gives the app is the input.",
      },
      {
        difficulty: "medium",
        type: "mcq",
        prompt: "Which idea from earlier units makes your app safer for kids?",
        options: [
          "Never ask the user for their home address",
          "Show everyone’s passwords",
          "Post the user’s school name online",
          "Ask kids to chat with strangers",
        ],
        correctIndex: 0,
        explanation: "Keeping private info private is the safety rule from Unit 1.",
      },
      {
        difficulty: "medium",
        type: "mcq",
        prompt: "Your app counts how many glasses of water you drink each day. The counter is an example of a…",
        options: ["URL", "Red flag", "Variable", "Printer"],
        correctIndex: 2,
        explanation: "A counter that changes is a variable — a box holding a number.",
      },
      {
        difficulty: "hard",
        type: "mcq",
        prompt: "Which app idea is the clearest?",
        options: [
          "“A cool app that does stuff.”",
          "“An app for everyone that does everything.”",
          "“A game. Not sure who plays it yet.”",
          "“Spell Star: for Class 3 kids. Input: a word they type. Output: a star if it’s right.”",
        ],
        correctIndex: 3,
        explanation: "It clearly says the user, the input, and the output.",
      },
      {
        difficulty: "hard",
        type: "mcq",
        prompt: "Riya’s app “Bus Buddy” lets her type her stop name, then shows when the school bus will arrive. What is the output?",
        options: [
          "Riya typing her stop name",
          "The bus arrival time shown on the screen",
          "Riya herself",
          "The bus driver",
        ],
        correctIndex: 1,
        explanation: "The arrival time is what the app shows back — the output.",
      },
    ],
  },
};
