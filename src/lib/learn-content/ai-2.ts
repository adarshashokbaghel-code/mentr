import type { LessonContentBank } from "./types";

/** AI Basics for Kids — Units 3–4 (B11–B20). */
export const AI_CONTENT_2: LessonContentBank = {
  B11: {
    notes: {
      bigIdea:
        "Computers don’t have eyeballs. When a computer “sees”, it looks at tiny coloured dots in a picture and matches patterns it learned from many examples. Dark light, odd angles, or hidden parts can fool it.",
      definitions: [
        {
          term: "Pixel",
          meaning: "One tiny coloured dot. Thousands of pixels together make a picture on a screen.",
        },
        {
          term: "Computer vision",
          meaning: "When a computer finds things in pictures by matching patterns in the pixels.",
        },
        {
          term: "Object spotting",
          meaning: "Finding and naming things in a photo — like a ball, a bottle, or a book.",
        },
        {
          term: "Pattern",
          meaning: "Shapes, colours, and edges that show up again and again — like the round shape of every ball.",
        },
      ],
      panels: [
        {
          title: "How a computer “sees”",
          body: [
            "A photo is just thousands of tiny coloured dots called pixels.",
            "The computer checks the dots for shapes, edges, and colours.",
            "It matches them to patterns it learned from many example photos.",
          ],
        },
        {
          title: "Object spotting",
          body: [
            "Round + bouncy-looking shape → maybe a ball.",
            "Tall shape with a cap on top → maybe a bottle.",
            "Flat box with pages → maybe a book.",
          ],
        },
        {
          title: "Seeing all around you",
          body: [
            "Face unlock on a phone matches the pattern of your face.",
            "Photo apps can group all your pictures of dogs or the beach.",
            "Some apps can name a flower from one photo.",
          ],
        },
        {
          title: "What fools it?",
          body: [
            "Dark light: a black cat on a black sofa is hard to spot.",
            "Odd angle or tiny size: a ball seen from far away looks like a dot.",
            "Partly hidden: half a bottle behind a bag may be missed. Computers can be wrong!",
          ],
        },
      ],
      remember: [
        "Computers see pixels, not things.",
        "Seeing = matching patterns in pictures.",
        "It learns patterns from many examples.",
        "Dark, tiny, or hidden things can fool it.",
      ],
      checkYourself: {
        q: "Why might a computer miss a black cat on a black sofa?",
        a: "The cat and the sofa are the same dark colour, so the computer can’t find the edges and shape of the cat in the pixels.",
      },
      dinoLine: "Chapter 1 done. You know how computers “see” with patterns — super work, champ!",
    },
    quiz: [
      {
        difficulty: "easy",
        type: "mcq",
        prompt: "When a computer “sees” a photo, what is it really doing?",
        options: [
          "Looking with tiny eyeballs",
          "Matching patterns in the picture’s pixels",
          "Asking a person hidden inside the screen",
          "Guessing by magic",
        ],
        correctIndex: 1,
        explanation: "Computers match patterns of shapes and colours in the pixels.",
      },
      {
        difficulty: "easy",
        type: "mcq",
        prompt: "A picture on a screen is made of thousands of tiny coloured dots called…",
        options: ["Pixels", "Wires", "Buttons", "Apps"],
        correctIndex: 0,
        explanation: "Pixels are the tiny dots that make up every picture on a screen.",
      },
      {
        difficulty: "easy",
        type: "true_false",
        prompt: "Face unlock on a phone is an example of a computer “seeing”.",
        options: ["True", "False"],
        correctIndex: 0,
        explanation: "Face unlock matches the pattern of your face — that’s computer vision.",
      },
      {
        difficulty: "easy",
        type: "mcq",
        prompt: "Which of these is an object-spotting job?",
        options: [
          "Making a song louder",
          "Charging a phone",
          "Finding the ball, bottle, and book in a photo",
          "Typing a message",
        ],
        correctIndex: 2,
        explanation: "Object spotting means finding and naming things in a picture.",
      },
      {
        difficulty: "medium",
        type: "mcq",
        prompt: "Which photo would be HARDEST for a computer to spot a cat in?",
        options: [
          "A bright photo of a cat on green grass",
          "A big, clear photo of a cat’s face",
          "A cat sitting on a white rug in daylight",
          "A tiny cat far away in a dark room",
        ],
        correctIndex: 3,
        explanation: "Tiny and dark makes the cat’s shape very hard to find.",
      },
      {
        difficulty: "medium",
        type: "mcq",
        prompt: "How does a computer learn what a bottle looks like?",
        options: [
          "By drinking from one",
          "By seeing lots of example photos of bottles",
          "By being switched off and on",
          "By guessing the colour blue",
        ],
        correctIndex: 1,
        explanation: "Many examples teach it the bottle pattern.",
      },
      {
        difficulty: "medium",
        type: "true_false",
        prompt: "When a computer spots something in a photo, it is always right.",
        options: ["True", "False"],
        correctIndex: 1,
        explanation: "Computers can be wrong — light, angle, and hidden parts can fool them.",
      },
      {
        difficulty: "medium",
        type: "mcq",
        prompt: "Which TWO things can fool a computer’s “eyes”?",
        options: [
          "Loud music and fast Wi-Fi",
          "A new charger and a big screen",
          "Bad lighting and a strange angle",
          "Your name and your age",
        ],
        correctIndex: 2,
        explanation: "Poor light and odd angles change how the pixels look.",
      },
      {
        difficulty: "hard",
        type: "mcq",
        prompt: "Why might a computer miss a black cat on a black sofa?",
        options: [
          "Cats can’t be photographed",
          "The cat and sofa are the same colour, so the cat’s shape is hard to find",
          "The computer only learns about dogs",
          "The sofa is too soft",
        ],
        correctIndex: 1,
        explanation: "Same colours hide the edges that make the cat’s shape.",
      },
      {
        difficulty: "hard",
        type: "mcq",
        prompt: "A photo shows only half a ball peeking out from behind a box. What might happen?",
        options: [
          "It is easier to spot than a whole ball",
          "Hidden parts don’t matter to a computer",
          "The computer needs to hear the ball first",
          "The computer may miss it, because part of the ball is hidden",
        ],
        correctIndex: 3,
        explanation: "With part of the shape hidden, the pattern may not match.",
      },
    ],
  },

  B12: {
    notes: {
      bigIdea:
        "When a computer “listens”, it turns the sound of your voice into words, then matches those words to patterns it learned. Noise and whispers make it harder — so use the wake word and ask clearly.",
      definitions: [
        {
          term: "Speech recognition",
          meaning: "When a computer turns spoken sounds into written words.",
        },
        {
          term: "Voice assistant",
          meaning: "A helper on a phone or smart speaker that listens and answers — like asking it to play a song.",
        },
        {
          term: "Wake word",
          meaning: "A special word or name that tells the helper, “Start listening now.”",
        },
        {
          term: "Clear command",
          meaning: "A short, exact ask — like “Set a timer for 10 minutes.”",
        },
      ],
      panels: [
        {
          title: "How a computer listens",
          body: [
            "1. It hears the sound of your voice.",
            "2. It turns the sound into words.",
            "3. It matches the words to patterns to work out what you want.",
          ],
        },
        {
          title: "Voice helpers around you",
          body: [
            "Smart speakers at home that play songs or tell the weather.",
            "Phone helpers that set alarms or call nani.",
            "Voice typing that writes your words on the screen.",
          ],
        },
        {
          title: "What makes it harder?",
          body: [
            "Noise: a loud TV, a mixer, or a busy market.",
            "Whispers or mumbling: the sound is too soft or unclear.",
            "Different accents: it may need more examples to learn them. It can make mistakes!",
          ],
        },
        {
          title: "Good vs poor commands",
          body: [
            "Poor: “Umm… do that thing.” Too unclear.",
            "Good: “Hey helper, set a timer for 10 minutes.” Wake word + clear ask.",
            "Tip: speak clearly, in a quieter room, one ask at a time.",
          ],
        },
      ],
      remember: [
        "Listening = sound → words → patterns.",
        "Say the wake word first.",
        "Speak clearly in a quiet room.",
        "Noise and whispers make it harder.",
      ],
      checkYourself: {
        q: "Write one clear command you could say to a voice helper.",
        a: "Example: “Hey helper, what’s the weather in Delhi today?” — wake word first, then one short, clear ask.",
      },
      dinoLine: "Chapter 2 done. You know how computers listen and how to ask clearly — super work, champ!",
    },
    quiz: [
      {
        difficulty: "easy",
        type: "mcq",
        prompt: "When a voice helper “listens”, what does it do first?",
        options: [
          "Turns the sound of your voice into words",
          "Reads your mind",
          "Takes a photo of you",
          "Calls your friend",
        ],
        correctIndex: 0,
        explanation: "First sound becomes words, then it matches patterns.",
      },
      {
        difficulty: "easy",
        type: "mcq",
        prompt: "Which of these is a voice assistant?",
        options: [
          "A calculator",
          "A pencil box",
          "A smart speaker that answers when you say its wake word",
          "A printer",
        ],
        correctIndex: 2,
        explanation: "A smart speaker listens for its wake word and answers.",
      },
      {
        difficulty: "easy",
        type: "true_false",
        prompt: "A wake word tells a voice helper to start listening.",
        options: ["True", "False"],
        correctIndex: 0,
        explanation: "The wake word is like saying, “Hey, listen now!”",
      },
      {
        difficulty: "easy",
        type: "mcq",
        prompt: "Where is it easiest for a voice helper to understand you?",
        options: [
          "In a busy market",
          "In a quiet room",
          "Next to a loud pressure cooker",
          "Beside a blaring TV",
        ],
        correctIndex: 1,
        explanation: "Less noise means your words are easier to hear.",
      },
      {
        difficulty: "medium",
        type: "mcq",
        prompt: "Which is the clearest voice command?",
        options: [
          "“Umm… do that thing.”",
          "“Do the stuff from yesterday.”",
          "“Timer… no wait… maybe…”",
          "“Hey helper, set a timer for 10 minutes.”",
        ],
        correctIndex: 3,
        explanation: "Wake word plus one short, exact ask is clearest.",
      },
      {
        difficulty: "medium",
        type: "true_false",
        prompt: "Whispering makes it easier for a voice helper to understand you.",
        options: ["True", "False"],
        correctIndex: 1,
        explanation: "Whispers are too soft — speak clearly instead.",
      },
      {
        difficulty: "medium",
        type: "mcq",
        prompt: "Why might a voice helper mix up your words?",
        options: [
          "It is feeling tired today",
          "It is angry with you",
          "Noise, whispers, or talking too fast make the sound unclear",
          "It can only hear grown-ups",
        ],
        correctIndex: 2,
        explanation: "Unclear sound is hard to turn into the right words.",
      },
      {
        difficulty: "medium",
        type: "mcq",
        prompt: "After turning sound into words, how does a voice helper work out what you want?",
        options: [
          "It asks a person hidden inside",
          "It matches the words to patterns it learned from many examples",
          "It flips a coin",
          "It waits for you to type",
        ],
        correctIndex: 1,
        explanation: "It uses patterns learned from lots of examples.",
      },
      {
        difficulty: "hard",
        type: "mcq",
        prompt: "Riya softly says “Hey helper… weather?” while the mixer is running. What is the BEST fix?",
        options: [
          "Say it faster with the mixer still on",
          "Clap instead of talking",
          "Say only “weather” even more softly",
          "Wait for the mixer to stop, then say clearly: “Hey helper, what’s the weather today?”",
        ],
        correctIndex: 3,
        explanation: "A quieter room and a clear, full ask help it understand.",
      },
      {
        difficulty: "hard",
        type: "mcq",
        prompt: "Aarav clearly says “Play music” in a quiet room, but nothing happens. What did he most likely forget?",
        options: ["The wake word", "To whisper", "To turn off the lights", "To say his home address"],
        correctIndex: 0,
        explanation: "Without the wake word, the helper doesn’t know to start listening.",
      },
    ],
  },

  B13: {
    notes: {
      bigIdea:
        "A chatbot picks its reply by spotting patterns in your words and predicting what to say next. It sounds friendly, but it does not know you or have feelings — so never share secrets or private info with it.",
      definitions: [
        {
          term: "Chatbot",
          meaning: "A computer program that chats with you by typing replies.",
        },
        {
          term: "Predict",
          meaning: "To make a smart guess about what comes next, using patterns.",
        },
        {
          term: "Chat tree",
          meaning: "A map of choices: if the user says this, reply with that.",
        },
        {
          term: "Private info",
          meaning: "Things only you and your family should know — address, passwords, phone number, where keys are kept.",
        },
      ],
      panels: [
        {
          title: "How a chatbot picks a reply",
          body: [
            "You type: “What do pandas eat?”",
            "It spots key words like “pandas” and “eat”.",
            "It predicts a reply from patterns: “Pandas mostly eat bamboo!”",
          ],
        },
        {
          title: "A tiny chat tree",
          body: [
            "User: “I feel bored.” → Bot: “Want a fun animal fact?”",
            "User: “Yes!” → Bot: “An octopus has three hearts!”",
            "User: “No.” → Bot: “How about a riddle instead?”",
          ],
        },
        {
          title: "Not a real friend",
          body: [
            "A chatbot has no feelings — it only predicts words.",
            "It may say “I’m your friend!” but it doesn’t know you.",
            "It can be wrong, so check big facts with a grown-up or a book.",
          ],
        },
        {
          title: "Safe or unsafe to type?",
          body: [
            "Safe: “Tell me a story about a dragon.” “What is 12 × 3?”",
            "Unsafe: your address, school name, passwords, or where the house keys hide.",
            "What you type may be saved. Ask a grown-up before using a chat app.",
          ],
        },
      ],
      remember: [
        "Chatbots predict replies from patterns.",
        "Chatbots have no feelings.",
        "They can give wrong answers.",
        "Never share secrets or private info.",
      ],
      checkYourself: {
        q: "Should you tell a chatbot your house keys hide under the mat? Why?",
        a: "No. That is private info. A chatbot isn’t a friend, and what you type can be saved or seen by others.",
      },
      dinoLine: "Chapter 3 done. You know how chatbots pick replies and what to keep private — super work, champ!",
    },
    quiz: [
      {
        difficulty: "easy",
        type: "mcq",
        prompt: "What is a chatbot?",
        options: [
          "A computer program that chats by picking replies",
          "A real person typing very fast",
          "A robot pet",
          "A game controller",
        ],
        correctIndex: 0,
        explanation: "A chatbot is a program that types replies to you.",
      },
      {
        difficulty: "easy",
        type: "mcq",
        prompt: "How does a chatbot choose what to say?",
        options: [
          "It remembers you like a best friend",
          "It picks a reply from patterns in your words",
          "It feels happy or sad first",
          "It asks your teacher",
        ],
        correctIndex: 1,
        explanation: "It spots patterns in your words and predicts a reply.",
      },
      {
        difficulty: "easy",
        type: "true_false",
        prompt: "A chatbot has real feelings, just like a friend.",
        options: ["True", "False"],
        correctIndex: 1,
        explanation: "Chatbots only predict words — they have no feelings.",
      },
      {
        difficulty: "easy",
        type: "mcq",
        prompt: "Which is SAFE to type to a chatbot?",
        options: [
          "Your home address",
          "Your password",
          "“What do pandas eat?”",
          "Where your house keys are hidden",
        ],
        correctIndex: 2,
        explanation: "A general question shares nothing private.",
      },
      {
        difficulty: "medium",
        type: "mcq",
        prompt: "A chatbot types “I’m your best friend!” What is true?",
        options: [
          "It truly knows you and loves you",
          "It can come and visit your house",
          "It will keep your secrets safe forever",
          "It is just predicting friendly-sounding words",
        ],
        correctIndex: 3,
        explanation: "It sounds friendly, but it’s only predicting words.",
      },
      {
        difficulty: "medium",
        type: "mcq",
        prompt: "In a chat tree, the user types “I feel bored.” Which is the BETTER next reply?",
        options: [
          "“Want to hear a fun animal fact?”",
          "“The capital of France is Paris.”",
          "“Please type your phone number.”",
          "“Goodbye.”",
        ],
        correctIndex: 0,
        explanation: "It matches what the user said and stays safe.",
      },
      {
        difficulty: "medium",
        type: "true_false",
        prompt: "It’s okay to tell a chatbot your secrets because it is only a computer.",
        options: ["True", "False"],
        correctIndex: 1,
        explanation: "What you type may be saved — keep secrets offline.",
      },
      {
        difficulty: "medium",
        type: "mcq",
        prompt: "Which one should you NEVER type into a chatbot?",
        options: [
          "A question about planets",
          "A riddle",
          "Your school name and home address",
          "A request for a dragon story",
        ],
        correctIndex: 2,
        explanation: "School name and address are private info.",
      },
      {
        difficulty: "hard",
        type: "mcq",
        prompt: "Should you tell a chatbot your house keys hide under the mat?",
        options: [
          "No — it’s private, and what you type can be saved and seen by others",
          "Yes, chatbots forget everything instantly",
          "Yes, if the chatbot is polite",
          "No, because chatbots can’t read words",
        ],
        correctIndex: 0,
        explanation: "Chats can be saved, so keep home secrets private.",
      },
      {
        difficulty: "hard",
        type: "mcq",
        prompt: "Why can a chatbot sometimes give a wrong answer?",
        options: [
          "It is lying on purpose to trick you",
          "It is sleepy after a long day",
          "It wants you to fail your test",
          "It predicts from patterns, and patterns can be wrong",
        ],
        correctIndex: 3,
        explanation: "Predictions are guesses — sometimes they miss.",
      },
    ],
  },

  B14: {
    notes: {
      bigIdea:
        "A face filter first finds your face, then marks points like your eyes, nose, and the top of your head. Then it draws puppy ears or glasses on those points. It’s fun — but the camera is still taking a face picture, so ask before posting anyone’s photo.",
      definitions: [
        {
          term: "AR filter",
          meaning: "A camera effect that adds fun things, like ears or glasses, on top of the real picture.",
        },
        {
          term: "Face points",
          meaning: "Spots the filter marks on your face — corners of eyes, tip of nose, mouth, top of head.",
        },
        {
          term: "Face picture",
          meaning: "A photo of someone’s face. It is personal, even with a funny filter on it.",
        },
        {
          term: "Asking first",
          meaning: "Checking with a person before you post or share their photo.",
        },
      ],
      panels: [
        {
          title: "Filter steps",
          body: [
            "1. Find the face in the camera picture.",
            "2. Mark face points: eyes, nose, mouth, top of head.",
            "3. Draw on top — ears on the head points, glasses on the eye points.",
          ],
        },
        {
          title: "Why the ears follow you",
          body: [
            "The filter finds your face points again and again, many times a second.",
            "When you turn your head, the points move — so the ears move too.",
            "Cover half your face or stand in the dark, and it may lose the points.",
          ],
        },
        {
          title: "Filters you know",
          body: [
            "Puppy ears and a tongue on a video call.",
            "Funny glasses or a crown on a birthday photo.",
            "Beauty filters that change skin — remember, that’s not how faces really look.",
          ],
        },
        {
          title: "Filter manners and privacy",
          body: [
            "Fun, but the camera is still collecting a picture of your face.",
            "Ask before posting someone else’s filtered face — even your cousin’s.",
            "Ask a grown-up before trying a new filter app.",
          ],
        },
      ],
      remember: [
        "Filter = find face + draw on top.",
        "It needs face points first.",
        "The camera still takes your face picture.",
        "Ask before posting someone’s photo.",
      ],
      checkYourself: {
        q: "What does the filter need to find before it can add puppy ears?",
        a: "It needs to find your face and mark its points — like the top of your head — so it knows where to place the ears.",
      },
      dinoLine: "Chapter 4 done. You know how filters find faces and the manners that go with them — super work, champ!",
    },
    quiz: [
      {
        difficulty: "easy",
        type: "mcq",
        prompt: "What does a photo filter need to find FIRST?",
        options: ["Your face", "Your password", "Your school bag", "The Wi-Fi"],
        correctIndex: 0,
        explanation: "No face found means nowhere to put the ears.",
      },
      {
        difficulty: "easy",
        type: "mcq",
        prompt: "Where does a filter place puppy ears?",
        options: [
          "On the floor",
          "On points at the top of your head",
          "Inside your messages",
          "Anywhere at random",
        ],
        correctIndex: 1,
        explanation: "It sticks the ears on the head points it marked.",
      },
      {
        difficulty: "easy",
        type: "true_false",
        prompt: "When you use a filter, the camera is still taking a picture of your face.",
        options: ["True", "False"],
        correctIndex: 0,
        explanation: "The filter sits on top of a real face picture.",
      },
      {
        difficulty: "easy",
        type: "mcq",
        prompt: "Which sentence describes a filter best?",
        options: [
          "Magic paint on your real face",
          "A tiny artist hiding inside the phone",
          "Find the face, then draw on top",
          "A brand-new camera lens",
        ],
        correctIndex: 2,
        explanation: "Filters find the face, then draw fun things on it.",
      },
      {
        difficulty: "medium",
        type: "mcq",
        prompt: "Put the filter steps in order: A) Draw glasses on the eye points  B) Find the face  C) Mark points like eyes and nose",
        options: ["A → B → C", "C → A → B", "B → A → C", "B → C → A"],
        correctIndex: 3,
        explanation: "Find the face, mark the points, then draw on top.",
      },
      {
        difficulty: "medium",
        type: "true_false",
        prompt: "It’s fine to post a friend’s filtered photo without asking, because the filter hides who they are.",
        options: ["True", "False"],
        correctIndex: 1,
        explanation: "It’s still their face — always ask first.",
      },
      {
        difficulty: "medium",
        type: "mcq",
        prompt: "Why do the puppy ears move when you turn your head?",
        options: [
          "The ears are glued to the screen",
          "The filter keeps finding your face points again and again",
          "The phone is shaking",
          "Someone is moving them by hand",
        ],
        correctIndex: 1,
        explanation: "It re-finds your face points many times a second.",
      },
      {
        difficulty: "medium",
        type: "mcq",
        prompt: "Which is a good filter manners rule?",
        options: [
          "Post any photo you like of anyone",
          "Use filters to make fun of people",
          "Ask before posting someone else’s filtered face",
          "Share photos with your house number in the background",
        ],
        correctIndex: 2,
        explanation: "Asking first respects the other person’s privacy.",
      },
      {
        difficulty: "hard",
        type: "mcq",
        prompt: "A filter puts glasses on Meera’s forehead instead of her eyes. What is the most likely reason?",
        options: [
          "Meera is wearing the wrong clothes",
          "Filters only work on birthdays",
          "The phone is too new",
          "The filter marked her eye points in the wrong place, maybe because of poor light",
        ],
        correctIndex: 3,
        explanation: "Wrong points mean the glasses land in the wrong spot.",
      },
      {
        difficulty: "hard",
        type: "mcq",
        prompt: "Kabir’s little sister covers half her face with her hand. Why might the bunny filter stop working?",
        options: [
          "The phone’s volume is too low",
          "It can’t find enough face points to place the ears",
          "The filter only works on grown-ups",
          "Filters only work outdoors",
        ],
        correctIndex: 1,
        explanation: "Hidden face points leave the filter lost.",
      },
    ],
  },

  B15: {
    notes: {
      bigIdea:
        "Game characters that you don’t control follow simple rules, like “If the player is near, chase. Else, patrol.” That is simple AI — a set of if/then steps, not a real person inside the game. In this project, you’ll write your own rules for a game character.",
      definitions: [
        {
          term: "NPC",
          meaning: "Non-player character — a game character the computer controls, like a guard or a ghost.",
        },
        {
          term: "If/then rule",
          meaning: "An instruction: if something happens, then do this. Example: if touched, then disappear.",
        },
        {
          term: "Patrol",
          meaning: "Walking back and forth along a path, watching.",
        },
        {
          term: "Chase",
          meaning: "Moving towards the player to catch them.",
        },
        {
          term: "Algorithm",
          meaning: "Step-by-step instructions a computer follows. Game rules are algorithms!",
        },
      ],
      panels: [
        {
          title: "How game characters “think”",
          body: [
            "A maze guard checks: is the player near?",
            "If yes → chase. If no (else) → patrol.",
            "It checks again and again, very fast — so it seems smart.",
          ],
        },
        {
          title: "Not a real person",
          body: [
            "No one is hiding inside the game moving the guard.",
            "The guard has no feelings — it just follows its rules.",
            "These rules are algorithms, just like the steps you learned in CS.",
          ],
        },
        {
          title: "Rule examples",
          body: [
            "Coin: if the player touches it, then disappear and add 1 point.",
            "Door: if the player has the key, then open.",
            "Ghost: if the player eats a power berry, then run away.",
          ],
        },
        {
          title: "Your project: design a maze guard",
          body: [
            "Step 1: Draw a tiny maze and pick a character — a guard, a robot, or a tiger.",
            "Step 2: Write 2 rules. Rule 1: “If player is near, then ___.” Rule 2: “Else, ___.”",
            "Step 3: Test it with a friend — act out the guard. Does the rule work? Fix it and try again!",
          ],
        },
      ],
      remember: [
        "Game characters follow if/then rules.",
        "“If near, chase. Else, patrol.”",
        "No real person is inside the game.",
        "Game rules are algorithms.",
      ],
      checkYourself: {
        q: "Write one rule for a coin that disappears when touched.",
        a: "“If the player touches the coin, then the coin disappears (and the score goes up by 1).”",
      },
      dinoLine: "Chapter 5 done and Unit 3 complete. You can write rules for game characters — super work, champ!",
    },
    quiz: [
      {
        difficulty: "easy",
        type: "mcq",
        prompt: "What is an NPC in a game?",
        options: [
          "The player holding the controller",
          "A character the computer controls, not a player",
          "The game’s music",
          "The game screen",
        ],
        correctIndex: 1,
        explanation: "NPCs are characters the game controls with rules.",
      },
      {
        difficulty: "easy",
        type: "mcq",
        prompt: "A maze guard has the rule “If the player is near, chase.” What happens when the player comes close?",
        options: [
          "The guard chases",
          "The guard falls asleep",
          "The guard disappears",
          "The guard turns into a coin",
        ],
        correctIndex: 0,
        explanation: "The rule says: player near → chase.",
      },
      {
        difficulty: "easy",
        type: "true_false",
        prompt: "A real person is hiding inside the game, moving every character.",
        options: ["True", "False"],
        correctIndex: 1,
        explanation: "Characters follow rules — no one is hiding inside.",
      },
      {
        difficulty: "easy",
        type: "mcq",
        prompt: "Which is a good rule for a coin in a game?",
        options: [
          "The coin keeps your password",
          "The coin sends messages to your friends",
          "The coin switches off the tablet",
          "If the player touches the coin, it disappears and adds 1 point",
        ],
        correctIndex: 3,
        explanation: "It’s a clear if/then rule about the game.",
      },
      {
        difficulty: "medium",
        type: "mcq",
        prompt: "What does “patrol” mean for a game guard?",
        options: [
          "Jump off the screen",
          "Chase the player forever",
          "Walk back and forth along a path",
          "Stand still and sleep",
        ],
        correctIndex: 2,
        explanation: "Patrolling means walking a path and watching.",
      },
      {
        difficulty: "medium",
        type: "mcq",
        prompt: "Game-character rules are most like which idea from computer science?",
        options: [
          "Pixels",
          "Algorithms — step-by-step instructions",
          "Wi-Fi",
          "Passwords",
        ],
        correctIndex: 1,
        explanation: "Rules for characters are algorithms the computer follows.",
      },
      {
        difficulty: "medium",
        type: "true_false",
        prompt: "An if/then rule tells a character what to do when something happens.",
        options: ["True", "False"],
        correctIndex: 0,
        explanation: "If this happens, then do that — that’s the rule.",
      },
      {
        difficulty: "medium",
        type: "mcq",
        prompt: "Finish the guard’s rules: “If the player is near, chase. Else, ___.”",
        options: ["Delete the game", "Win the game", "Chase even harder", "Patrol"],
        correctIndex: 3,
        explanation: "When the player is not near, the guard patrols.",
      },
      {
        difficulty: "hard",
        type: "mcq",
        prompt: "Why does a game guard seem “smart”?",
        options: [
          "It has feelings about the player",
          "It is alive inside the game",
          "It follows clear rules very quickly",
          "It reads the player’s mind",
        ],
        correctIndex: 2,
        explanation: "Fast, clear rules make it look clever — it isn’t alive.",
      },
      {
        difficulty: "hard",
        type: "mcq",
        prompt: "Which pair of rules would make the BEST maze guard?",
        options: [
          "If player near, chase; else patrol",
          "If player near, sleep; else sleep",
          "Always stand still, no matter what",
          "If player near, give them a coin; else dance",
        ],
        correctIndex: 0,
        explanation: "It reacts to the player and keeps watch otherwise.",
      },
    ],
  },

  B16: {
    notes: {
      bigIdea:
        "AI learns from examples. If it only sees one kind of example, it can treat other kinds unfairly. To be fair, AI needs many kinds of faces, voices, and stories in its training — like a crayon box with many colours.",
      definitions: [
        {
          term: "Fair",
          meaning: "Working well for everyone, not just some people.",
        },
        {
          term: "Unfair AI (bias)",
          meaning: "When AI works worse for some things or people because it didn’t see enough kinds of examples.",
        },
        {
          term: "Variety",
          meaning: "Many different kinds — big and small, many colours, many voices.",
        },
        {
          term: "Training examples",
          meaning: "The pictures, sounds, or words AI learns from.",
        },
      ],
      panels: [
        {
          title: "Why AI can be unfair",
          body: [
            "AI only knows what its examples show it.",
            "Only one kind of example → it gets confused by other kinds.",
            "It isn’t being mean — it just didn’t learn enough.",
          ],
        },
        {
          title: "The hat finder",
          body: [
            "A “hat finder” saw only red hats while learning.",
            "Show it a blue hat → it may say “not a hat”!",
            "Fix: add blue, green, striped, and woolly hats to its examples.",
          ],
        },
        {
          title: "Real-life examples",
          body: [
            "A voice helper that learned only grown-up voices may not understand kids.",
            "Face unlock that learned only a few kinds of faces may miss others.",
            "A doctor’s helper needs X-rays from many kinds of people.",
          ],
        },
        {
          title: "Making AI fairer",
          body: [
            "Think of a crayon box: many colours make a better picture.",
            "Many kinds of faces, voices, and stories make a fairer AI.",
            "People must check and test that it works for everyone.",
          ],
        },
      ],
      remember: [
        "AI learns only from its examples.",
        "One kind of example → unfair AI.",
        "AI needs many kinds of examples.",
        "More variety makes helpers fairer.",
      ],
      checkYourself: {
        q: "A “hat finder” only saw red hats. What happens with a blue hat?",
        a: "It may not know it’s a hat, because it never saw blue ones. It needs many kinds of hats in its examples to be fair.",
      },
      dinoLine: "Chapter 1 done. You know AI needs many kinds of examples to be fair — super work, champ!",
    },
    quiz: [
      {
        difficulty: "easy",
        type: "mcq",
        prompt: "Why can an AI helper be unfair?",
        options: [
          "It saw only one kind of example",
          "It is mean on purpose",
          "It is too old",
          "It needs a nap",
        ],
        correctIndex: 0,
        explanation: "Too few kinds of examples make AI unfair.",
      },
      {
        difficulty: "easy",
        type: "mcq",
        prompt: "Finish the sentence: “AI needs ___ examples.”",
        options: ["only red", "many kinds of", "zero", "just one"],
        correctIndex: 1,
        explanation: "Many kinds of examples help AI work for everyone.",
      },
      {
        difficulty: "easy",
        type: "true_false",
        prompt: "More variety in the examples helps make an AI helper fairer.",
        options: ["True", "False"],
        correctIndex: 0,
        explanation: "Variety teaches AI about all kinds of things and people.",
      },
      {
        difficulty: "easy",
        type: "mcq",
        prompt: "Which crayon box is most like a FAIR set of AI examples?",
        options: [
          "Only one red crayon",
          "Ten red crayons",
          "Crayons of many colours",
          "An empty box",
        ],
        correctIndex: 2,
        explanation: "Many colours = many kinds of examples.",
      },
      {
        difficulty: "medium",
        type: "mcq",
        prompt: "Which set of photos is FAIRER for teaching a “dog finder”?",
        options: [
          "100 photos of only white puppies",
          "One photo of one dog",
          "Photos of cats only",
          "Photos of big, small, spotted, brown, and black dogs",
        ],
        correctIndex: 3,
        explanation: "Many kinds of dogs help it find every dog.",
      },
      {
        difficulty: "medium",
        type: "mcq",
        prompt: "A voice helper learned only from grown-up voices. What might happen?",
        options: [
          "It may not understand children well",
          "It understands children best",
          "It stops working for everyone",
          "It only speaks in songs",
        ],
        correctIndex: 0,
        explanation: "It never learned kids’ voices, so it may struggle.",
      },
      {
        difficulty: "medium",
        type: "true_false",
        prompt: "An AI helper is automatically fair to everyone, even if it saw only one kind of example.",
        options: ["True", "False"],
        correctIndex: 1,
        explanation: "AI is only as fair as the examples it learns from.",
      },
      {
        difficulty: "medium",
        type: "mcq",
        prompt: "A face unlock app learned mostly from one kind of face. What should its makers do?",
        options: [
          "Use even fewer photos",
          "Remove the camera",
          "Add many kinds of faces to its examples",
          "Let only one person use phones",
        ],
        correctIndex: 2,
        explanation: "More kinds of faces make face unlock fairer.",
      },
      {
        difficulty: "hard",
        type: "mcq",
        prompt: "A “hat finder” only saw red hats. What happens when it sees a blue hat?",
        options: [
          "It paints the hat red",
          "It may say “not a hat”, because it never saw blue ones",
          "It finds it even faster",
          "It instantly learns blue hats by itself",
        ],
        correctIndex: 1,
        explanation: "It only knows the pattern of red hats.",
      },
      {
        difficulty: "hard",
        type: "mcq",
        prompt: "Which is the BEST way to explain unfair AI?",
        options: [
          "The AI is angry at some people",
          "Computers don’t like certain colours",
          "The screen is too small",
          "It didn’t get enough kinds of examples",
        ],
        correctIndex: 3,
        explanation: "Unfair AI usually means not enough variety in its examples.",
      },
    ],
  },

  B17: {
    notes: {
      bigIdea:
        "Privacy means keeping some things about you safe and to yourself. An AI app doesn’t need your whole life story to help with homework. Your real name, location, and photos of home need extra care — ask a grown-up first.",
      definitions: [
        {
          term: "Privacy",
          meaning: "Keeping your personal things safe and only sharing them with people you trust.",
        },
        {
          term: "Personal info",
          meaning: "Things about you — full name, school, address, phone number, photos of you or your home.",
        },
        {
          term: "Live location",
          meaning: "Where you are right now, shown on a map. Very private!",
        },
        {
          term: "Settings",
          meaning: "Switches in an app or phone that choose what the app can see and share.",
        },
      ],
      panels: [
        {
          title: "AI doesn’t need everything",
          body: [
            "A homework helper needs your question, not your address.",
            "“Explain how plants make food” → perfect, nothing private.",
            "What you type or upload can be saved by the app.",
          ],
        },
        {
          title: "Extra-careful info",
          body: [
            "Your real full name and your school.",
            "Your live location and home address.",
            "Photos of your home, house number, or school badge.",
          ],
        },
        {
          title: "Share or don’t share?",
          body: [
            "Share: your question, a nickname, your favourite animal.",
            "Don’t share: address, phone number, passwords, family photos.",
            "Not sure? Stop and ask a grown-up first.",
          ],
        },
        {
          title: "Settings and grown-ups",
          body: [
            "Parents can use settings to limit what apps can see.",
            "Location: Off is safer for most kids’ games.",
            "A drawing game asking for your location? Say no and tell a grown-up.",
          ],
        },
      ],
      remember: [
        "AI doesn’t need your life story.",
        "Keep name, location, home photos private.",
        "Ask a parent before sharing photos.",
        "Settings can limit what’s shared.",
      ],
      checkYourself: {
        q: "An app asks for your live location to play a drawing game. What should you do?",
        a: "Don’t allow it. A drawing game doesn’t need to know where you are. Ask a parent or grown-up to check the settings.",
      },
      dinoLine: "Chapter 2 done. You know what to keep private from AI apps — super work, champ!",
    },
    quiz: [
      {
        difficulty: "easy",
        type: "true_false",
        prompt: "An AI homework helper needs your full life story to help with maths.",
        options: ["True", "False"],
        correctIndex: 1,
        explanation: "It only needs your question — nothing personal.",
      },
      {
        difficulty: "easy",
        type: "mcq",
        prompt: "Which of these is private info to keep safe?",
        options: [
          "Your real full name and home address",
          "Your favourite colour",
          "Your favourite fruit",
          "A drawing of a tree",
        ],
        correctIndex: 0,
        explanation: "Name plus address can lead someone to your home.",
      },
      {
        difficulty: "easy",
        type: "true_false",
        prompt: "You should ask a parent before sharing photos with an app.",
        options: ["True", "False"],
        correctIndex: 0,
        explanation: "Photos can show private things — a grown-up can help check.",
      },
      {
        difficulty: "easy",
        type: "mcq",
        prompt: "Which is okay to type into a homework helper?",
        options: [
          "Your home address",
          "A photo of your house number",
          "“Explain how plants make food.”",
          "Your parent’s phone number",
        ],
        correctIndex: 2,
        explanation: "A school question shares nothing private.",
      },
      {
        difficulty: "medium",
        type: "mcq",
        prompt: "An app asks for your live location to play a drawing game. What should you do?",
        options: [
          "Say yes quickly so the game starts",
          "Share your home address too",
          "Share your friend’s location instead",
          "Say no and ask a grown-up — a drawing game doesn’t need it",
        ],
        correctIndex: 3,
        explanation: "Drawing doesn’t need your location, so keep it private.",
      },
      {
        difficulty: "medium",
        type: "true_false",
        prompt: "Parents and app settings can limit what an app is allowed to see and share.",
        options: ["True", "False"],
        correctIndex: 0,
        explanation: "Settings are switches that control sharing.",
      },
      {
        difficulty: "medium",
        type: "mcq",
        prompt: "Why should you be extra careful with a photo of your home?",
        options: [
          "It could show where you live",
          "Photos use too many colours",
          "Homes are boring",
          "The app might make it blurry",
        ],
        correctIndex: 0,
        explanation: "House numbers and streets can give away your address.",
      },
      {
        difficulty: "medium",
        type: "mcq",
        prompt: "Which setting is SAFER for a kids’ game?",
        options: [
          "Location: Always on",
          "Location: Off",
          "Share my contacts: Yes",
          "Show my real name to everyone: Yes",
        ],
        correctIndex: 1,
        explanation: "Turning location off keeps where you are private.",
      },
      {
        difficulty: "hard",
        type: "true_false",
        prompt: "If an app is fun and friendly, it’s safe to tell it your school name and where you live.",
        options: ["True", "False"],
        correctIndex: 1,
        explanation: "Friendly doesn’t mean safe — keep that info private.",
      },
      {
        difficulty: "hard",
        type: "mcq",
        prompt: "Which TWO pieces of info should you keep private?",
        options: [
          "Favourite colour and favourite game",
          "Favourite animal and favourite song",
          "Home address and live location",
          "Your drawing and your game nickname",
        ],
        correctIndex: 2,
        explanation: "Address and location show where to find you.",
      },
    ],
  },

  B18: {
    notes: {
      bigIdea:
        "Some pictures and voices are made by AI, and they can look very real. Look for clues like odd hands, jumbled writing, or “too perfect” faces — then pause and ask a grown-up. Not every strange photo is fake, and not every real photo looks perfect.",
      definitions: [
        {
          term: "AI-made image",
          meaning: "A picture made by a computer from patterns, not taken with a camera.",
        },
        {
          term: "Clue",
          meaning: "A small sign that helps you think — like six fingers on a hand.",
        },
        {
          term: "Pause",
          meaning: "Stop and think before you believe or share something.",
        },
        {
          term: "Trusted adult",
          meaning: "A grown-up who helps keep you safe — mum, dad, a teacher, or your nani.",
        },
      ],
      panels: [
        {
          title: "AI can make pictures",
          body: [
            "AI learned from millions of photos, so it can make new ones.",
            "Some look real, even though they never happened.",
            "AI can copy voices too — a voice message may not be real.",
          ],
        },
        {
          title: "Clues to look for",
          body: [
            "Odd hands: six fingers, or fingers melting together.",
            "Weird text: shop signs with jumbled letters.",
            "“Too perfect” faces: shiny, plastic-looking skin with no marks at all.",
          ],
        },
        {
          title: "Careful — clues aren’t proof",
          body: [
            "Not every strange photo is fake — real life can be surprising!",
            "Not every real photo looks perfect — real ones can be blurry or dark.",
            "AI pictures keep getting better, so clues can miss.",
          ],
        },
        {
          title: "What to do",
          body: [
            "See a flying school bus? First, pause — don’t believe it yet.",
            "Second, ask a trusted adult to help check.",
            "Don’t share it until you know it’s real.",
          ],
        },
      ],
      remember: [
        "AI can make real-looking pictures.",
        "Check hands, text, and faces.",
        "Pause before believing or sharing.",
        "Still unsure? Ask a trusted adult.",
      ],
      checkYourself: {
        q: "You see a photo of a flying school bus. What two things should you do?",
        a: "1. Pause and don’t believe it straight away. 2. Ask a trusted adult to help check if it’s real.",
      },
      dinoLine: "Chapter 3 done. You know how to pause and check surprising pictures — super work, champ!",
    },
    quiz: [
      {
        difficulty: "easy",
        type: "mcq",
        prompt: "Can AI make pictures that look real?",
        options: [
          "Yes, some can look very real",
          "No, never",
          "Only black-and-white ones",
          "Only on old TVs",
        ],
        correctIndex: 0,
        explanation: "AI-made pictures can look just like photos.",
      },
      {
        difficulty: "easy",
        type: "mcq",
        prompt: "Which is a clue that a picture might be AI-made?",
        options: [
          "A blue sky",
          "A hand with six fingers",
          "A smiling person",
          "A dog in a park",
        ],
        correctIndex: 1,
        explanation: "AI often gets hands wrong.",
      },
      {
        difficulty: "easy",
        type: "true_false",
        prompt: "Every strange-looking photo is fake.",
        options: ["True", "False"],
        correctIndex: 1,
        explanation: "Real life can be surprising too — so check, don’t guess.",
      },
      {
        difficulty: "easy",
        type: "mcq",
        prompt: "You see a surprising picture online. What should you do FIRST?",
        options: [
          "Share it with everyone",
          "Believe it right away",
          "Forward it to your class group",
          "Pause before believing it",
        ],
        correctIndex: 3,
        explanation: "Pausing gives you time to think and check.",
      },
      {
        difficulty: "medium",
        type: "mcq",
        prompt: "Which writing clue might mean a picture is AI-made?",
        options: [
          "Shop sign letters that are jumbled and make no sense",
          "A clear, readable shop name",
          "A neat school poster",
          "Clear numbers on a clock",
        ],
        correctIndex: 0,
        explanation: "AI often makes messy, nonsense writing.",
      },
      {
        difficulty: "medium",
        type: "true_false",
        prompt: "Real photos always look perfect.",
        options: ["True", "False"],
        correctIndex: 1,
        explanation: "Real photos can be blurry, dark, or messy.",
      },
      {
        difficulty: "medium",
        type: "mcq",
        prompt: "Why should you still ask a grown-up, even after checking the clues?",
        options: [
          "Grown-ups made all the pictures",
          "Clues are always perfect",
          "Clues can miss — AI pictures keep getting better",
          "Asking is against the rules",
        ],
        correctIndex: 2,
        explanation: "Clues help, but they aren’t proof.",
      },
      {
        difficulty: "medium",
        type: "mcq",
        prompt: "A face in a picture looks “too perfect” — shiny, plastic skin with no marks at all. What does that tell you?",
        options: [
          "It is definitely real",
          "It’s a clue to be careful — it might be AI-made",
          "It is definitely fake",
          "The camera is broken",
        ],
        correctIndex: 1,
        explanation: "It’s a clue, not proof — so be careful and check.",
      },
      {
        difficulty: "hard",
        type: "mcq",
        prompt: "You see a photo of a flying school bus. What two things should you do?",
        options: [
          "Share it fast and add a funny caption",
          "Believe it and tell your class it’s true",
          "Search for more buses and skip asking anyone",
          "Pause before believing it, and ask a trusted adult",
        ],
        correctIndex: 3,
        explanation: "Pause, then ask a grown-up to help check.",
      },
      {
        difficulty: "hard",
        type: "mcq",
        prompt: "Your friend shows a blurry, dark photo from a real cricket match. Which is true?",
        options: [
          "It must be AI-made because it’s blurry",
          "A real photo can look imperfect — blurry doesn’t mean fake",
          "All blurry photos are fake",
          "Only perfect photos are real",
        ],
        correctIndex: 1,
        explanation: "Real photos aren’t always perfect.",
      },
    ],
  },

  B19: {
    notes: {
      bigIdea:
        "AI can be a great helper — spotting plants, reading aloud for people who can’t see well, finding routes, and helping doctors, scientists, and artists. But AI is a tool. People stay in charge of important choices.",
      definitions: [
        {
          term: "Tool",
          meaning: "Something that helps people do a job — like a pencil, a map, or an AI app.",
        },
        {
          term: "Read-aloud helper",
          meaning: "An app that reads words out loud for people who can’t see well.",
        },
        {
          term: "X-ray",
          meaning: "A special photo that shows the bones inside your body.",
        },
        {
          term: "People in charge",
          meaning: "Humans make the final, important choices — AI only helps.",
        },
      ],
      panels: [
        {
          title: "Everyday AI helpers",
          body: [
            "Plant spotter: take a photo of a leaf, and the app names the plant.",
            "Read-aloud: reads a page out loud for someone who can’t see well.",
            "Maps: finds a good route to nani’s house and warns about traffic.",
          ],
        },
        {
          title: "Helping doctors and scientists",
          body: [
            "AI can look at X-rays and point out spots for the doctor to check.",
            "Scientists use AI to count animals in thousands of forest camera photos.",
            "AI can help spot weather patterns, like a coming storm.",
          ],
        },
        {
          title: "Helping artists",
          body: [
            "An artist can use AI like a new brush to try ideas.",
            "The ideas and imagination still come from the artist.",
            "Copying someone else’s work isn’t fair — even with AI.",
          ],
        },
        {
          title: "People stay in charge",
          body: [
            "AI can make mistakes, so people must check its work.",
            "A doctor decides your medicine — not an app alone.",
            "Think of AI as a helper on the team, not the boss.",
          ],
        },
      ],
      remember: [
        "AI helps spot, read, and find routes.",
        "AI helps doctors, scientists, and artists.",
        "AI is a tool, not the boss.",
        "People make the important choices.",
      ],
      checkYourself: {
        q: "Should AI choose your medicine without a doctor? Why?",
        a: "No. AI can make mistakes. It can help, but a doctor must check and decide — people stay in charge of important choices.",
      },
      dinoLine: "Chapter 4 done. You know how AI helps people — and that people stay in charge — super work, champ!",
    },
    quiz: [
      {
        difficulty: "easy",
        type: "mcq",
        prompt: "Which of these is a helpful use of AI?",
        options: [
          "An app that names a plant from a photo",
          "A pencil sharpener",
          "A paper notebook",
          "A plain wall clock",
        ],
        correctIndex: 0,
        explanation: "Plant-spotting apps use AI to match leaf patterns.",
      },
      {
        difficulty: "easy",
        type: "mcq",
        prompt: "An app that reads a page out loud helps most a person who…",
        options: ["is very tall", "cannot see well", "likes cricket", "has a new school bag"],
        correctIndex: 1,
        explanation: "Read-aloud helpers support people who can’t see well.",
      },
      {
        difficulty: "easy",
        type: "true_false",
        prompt: "AI can help doctors look at X-rays, but the doctor still decides.",
        options: ["True", "False"],
        correctIndex: 0,
        explanation: "AI points things out; the doctor makes the choice.",
      },
      {
        difficulty: "easy",
        type: "mcq",
        prompt: "A maps app shows the quickest way to nani’s house. What is the AI doing?",
        options: [
          "Cooking food",
          "Choosing your clothes",
          "Finding a good route",
          "Painting the car",
        ],
        correctIndex: 2,
        explanation: "Maps use AI to find routes and spot traffic.",
      },
      {
        difficulty: "medium",
        type: "mcq",
        prompt: "Who should make the final choice about your medicine?",
        options: ["An AI app alone", "A chatbot", "A search result", "A doctor"],
        correctIndex: 3,
        explanation: "Doctors decide — AI is only a helper.",
      },
      {
        difficulty: "medium",
        type: "mcq",
        prompt: "How can an artist use AI in a good way?",
        options: [
          "As a new brush to try ideas, while their imagination leads",
          "To stop imagining completely",
          "To copy a friend’s drawing and call it their own",
          "To never draw again",
        ],
        correctIndex: 0,
        explanation: "AI is a brush — the artist’s ideas still lead.",
      },
      {
        difficulty: "medium",
        type: "true_false",
        prompt: "Once scientists use AI, they don’t need to check its work.",
        options: ["True", "False"],
        correctIndex: 1,
        explanation: "AI can be wrong, so people always check.",
      },
      {
        difficulty: "medium",
        type: "mcq",
        prompt: "Scientists use AI to count animals in thousands of forest camera photos. Why is this helpful?",
        options: [
          "AI loves animals",
          "AI can look through many photos quickly and spot patterns",
          "AI makes new animals",
          "The photos take themselves",
        ],
        correctIndex: 1,
        explanation: "AI is fast at spotting patterns across lots of photos.",
      },
      {
        difficulty: "hard",
        type: "mcq",
        prompt: "Should AI choose your medicine without a doctor?",
        options: [
          "Yes, because AI is never wrong",
          "Yes, if the app looks nice",
          "No — AI can make mistakes, so a doctor must check and decide",
          "No, because AI can’t read",
        ],
        correctIndex: 2,
        explanation: "Important choices need a person in charge.",
      },
      {
        difficulty: "hard",
        type: "mcq",
        prompt: "Which sentence BEST describes AI in hospitals, labs, and art rooms?",
        options: [
          "AI replaces all the people",
          "AI is magic",
          "AI is alive and has its own ideas",
          "AI is a helpful tool; people make the important choices",
        ],
        correctIndex: 3,
        explanation: "AI helps, but people stay in charge.",
      },
    ],
  },

  B20: {
    notes: {
      bigIdea:
        "Now it’s your turn to invent! Design an AI helper for school or home. Decide who it helps, what job it does, what data (examples) it learns from, and one thing it must never collect. Then present it in 1 minute.",
      definitions: [
        {
          term: "User",
          meaning: "The person your helper is for — like Class 4 kids or your grandparents.",
        },
        {
          term: "Job",
          meaning: "The one task your helper does well — like reminding you to water plants.",
        },
        {
          term: "Data",
          meaning: "The examples your helper learns from — pictures, sounds, or words.",
        },
        {
          term: "Pattern",
          meaning: "Something that repeats, which AI learns to spot from many examples.",
        },
        {
          term: "Privacy rule",
          meaning: "A promise about what your helper will never collect or store.",
        },
      ],
      panels: [
        {
          title: "Step 1 · Who and what job?",
          body: [
            "Pick a real problem at school or home.",
            "Choose your user: “It helps ___.”",
            "Give it one job: “It helps them ___.” Then give it a fun name!",
          ],
        },
        {
          title: "Step 2 · What data does it need?",
          body: [
            "List the examples it learns from — like photos of dry and healthy leaves.",
            "Say the pattern it spots: “It learns that droopy, brown leaves need water.”",
            "Remember: many kinds of examples make it fairer.",
          ],
        },
        {
          title: "Step 3 · One privacy rule",
          body: [
            "Only collect what the job needs — nothing extra.",
            "Write: “It must never store ___” (faces, home address, live location).",
            "Add: people stay in charge of big choices.",
          ],
        },
        {
          title: "Step 4 · Present in 1 minute",
          body: [
            "Example: “Meet Tiffin Buddy! It helps Class 4 kids pick a healthy snack.”",
            "“It learns from pictures of snacks. It never stores anyone’s face.”",
            "Speak slowly, show a drawing, and smile — you’re an AI designer!",
          ],
        },
      ],
      remember: [
        "Helper = user + job + privacy rule.",
        "It learns patterns from examples (data).",
        "Collect only what the job needs.",
        "Present clearly in 1 minute.",
      ],
      checkYourself: {
        q: "Name your helper, who it helps, and one thing it must not store.",
        a: "Example: “Plant Pal helps my family water plants on time. It learns from leaf photos. It must never store photos of people.”",
      },
      dinoLine: "Chapter 5 done and the whole AI track complete! You can spot patterns, stay safe, and design your own AI helper — you’re an AI champ!",
    },
    quiz: [
      {
        difficulty: "easy",
        type: "mcq",
        prompt: "When you design an AI helper, what should you decide first?",
        options: [
          "Who it helps and what job it does",
          "Its favourite colour",
          "How loud it is",
          "How much it costs",
        ],
        correctIndex: 0,
        explanation: "User and job come first — everything else builds on them.",
      },
      {
        difficulty: "easy",
        type: "mcq",
        prompt: "What does an AI helper learn from?",
        options: [
          "Only its name",
          "Examples and data",
          "The colour of its box",
          "Nothing — it already knows everything",
        ],
        correctIndex: 1,
        explanation: "AI learns patterns from examples (data).",
      },
      {
        difficulty: "easy",
        type: "true_false",
        prompt: "A good AI helper design includes one thing it must never collect.",
        options: ["True", "False"],
        correctIndex: 0,
        explanation: "A privacy rule keeps users safe.",
      },
      {
        difficulty: "easy",
        type: "mcq",
        prompt: "How long should your helper presentation be?",
        options: ["One second", "One hour", "About 1 minute", "A whole school day"],
        correctIndex: 2,
        explanation: "Short and clear — about 1 minute.",
      },
      {
        difficulty: "medium",
        type: "mcq",
        prompt: "Which is a good privacy rule for a homework helper?",
        options: [
          "It must save photos of your house",
          "It must share your name with everyone",
          "It must track your location all the time",
          "It must never store your home address",
        ],
        correctIndex: 3,
        explanation: "A homework helper doesn’t need your address.",
      },
      {
        difficulty: "medium",
        type: "mcq",
        prompt: "A plant-watering helper learns from many photos of dry and healthy leaves. Those photos are its…",
        options: ["Examples (data)", "Passwords", "Wake words", "Filters"],
        correctIndex: 0,
        explanation: "The photos are the examples it learns patterns from.",
      },
      {
        difficulty: "medium",
        type: "true_false",
        prompt: "Your AI helper should collect as much personal information as it can, just in case.",
        options: ["True", "False"],
        correctIndex: 1,
        explanation: "Collect only what the job needs — nothing extra.",
      },
      {
        difficulty: "medium",
        type: "mcq",
        prompt: "In AI words, what is a “pattern”?",
        options: [
          "A secret password",
          "Something that repeats, which AI learns to spot from examples",
          "A kind of game controller",
          "A type of screen",
        ],
        correctIndex: 1,
        explanation: "AI spots patterns that repeat across many examples.",
      },
      {
        difficulty: "hard",
        type: "mcq",
        prompt: "Which helper plan is the clearest AND safest?",
        options: [
          "“A helper.”",
          "“It does everything for everyone and saves all data.”",
          "“Tiffin Buddy helps Class 4 kids pick healthy snacks. It learns from snack pictures. It never stores faces.”",
          "“A helper that knows where all my friends live.”",
        ],
        correctIndex: 2,
        explanation: "It has a user, a job, data, and a privacy rule.",
      },
      {
        difficulty: "hard",
        type: "mcq",
        prompt: "A helper will help kids practise spellings. Which data does it NOT need?",
        options: [
          "A list of spelling words",
          "The child’s home address",
          "Examples of common spelling mistakes",
          "Which words the child got right or wrong",
        ],
        correctIndex: 1,
        explanation: "Spelling practice doesn’t need an address — keep it private.",
      },
    ],
  },
};
