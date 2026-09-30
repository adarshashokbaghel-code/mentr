import type { LessonContentBank } from "./types";

export const AI_CONTENT_1: LessonContentBank = {
  B1: {
    notes: {
      bigIdea:
        "AI is not magic and it is not alive. It is maths that finds patterns in lots of examples, and then makes a good guess — which can sometimes be wrong.",
      definitions: [
        {
          term: "AI",
          meaning: "Short for Artificial Intelligence. A computer program that learns patterns from examples and makes guesses.",
        },
        {
          term: "Pattern",
          meaning: "Something that repeats or looks alike again and again — like whiskers and pointy ears on cats.",
        },
        {
          term: "Example",
          meaning: "One sample the computer learns from, like one photo of a cat.",
        },
        {
          term: "Guess",
          meaning: "AI’s best answer based on what it has seen before. Good guesses are often right, but not always.",
        },
      ],
      panels: [
        {
          title: "Magic or maths?",
          body: [
            "AI looks clever, but there are no spells inside.",
            "It is a program written by people, using maths.",
            "It is not alive — it does not think or feel like you.",
          ],
        },
        {
          title: "How AI spots a cat",
          body: [
            "AI is shown thousands of cat photos.",
            "It notices the pattern: whiskers, fur, pointy ears.",
            "New photo? It guesses, “This looks like a cat!”",
          ],
        },
        {
          title: "Calculator vs AI",
          body: [
            "Calculator: 7 + 2 is always 9. Same rule, same answer.",
            "AI: guesses from what it has seen before.",
            "So AI can be wrong — a calculator following its rule is not.",
          ],
        },
        {
          title: "AI you already know",
          body: [
            "YouTube suggests a cartoon because you watched similar ones.",
            "It saw a pattern in what you like — not magic!",
            "A voice assistant guesses the words you said from many voices it heard.",
          ],
        },
      ],
      remember: [
        "AI is maths, not magic.",
        "AI finds patterns in lots of examples.",
        "A calculator follows a fixed rule; AI guesses.",
        "AI is not alive, and it can be wrong.",
      ],
      checkYourself: {
        q: "Why is recommending a cartoon closer to AI than adding 7 + 2?",
        a: "Adding 7 + 2 follows one fixed rule and always gives 9. Recommending a cartoon means guessing from patterns in what you watched before — that is what AI does.",
      },
      dinoLine: "Chapter 1 done. AI is patterns, not magic — super work, champ!",
    },
    quiz: [
      {
        difficulty: "easy",
        type: "mcq",
        prompt: "What does AI use to make its guesses?",
        options: ["Magic spells", "Patterns found in lots of examples", "Lucky numbers", "Its own feelings"],
        correctIndex: 1,
        explanation: "AI learns patterns from many examples — no magic involved.",
      },
      {
        difficulty: "easy",
        type: "true_false",
        prompt: "AI is a living thing that thinks and feels like a person.",
        options: ["True", "False"],
        correctIndex: 1,
        explanation: "AI is a computer program made by people — it is not alive.",
      },
      {
        difficulty: "easy",
        type: "mcq",
        prompt: "What does “AI” stand for?",
        options: ["Artificial Intelligence", "Automatic Internet", "Amazing Ideas", "Animal Information"],
        correctIndex: 0,
        explanation: "AI is short for Artificial Intelligence.",
      },
      {
        difficulty: "easy",
        type: "mcq",
        prompt: "You type 7 + 2 into a calculator. What happens every single time?",
        options: ["It guesses a different answer", "It asks the internet", "It shows 9", "It learns a new rule"],
        correctIndex: 2,
        explanation: "A calculator follows a fixed rule, so 7 + 2 is always 9.",
      },
      {
        difficulty: "medium",
        type: "mcq",
        prompt: "How can AI learn to say “this photo looks like a cat”?",
        options: [
          "Someone types one secret word",
          "It is born knowing cats",
          "It asks the cat",
          "It sees many cat photos and learns their pattern",
        ],
        correctIndex: 3,
        explanation: "After seeing many cats, AI learns what cats usually look like.",
      },
      {
        difficulty: "medium",
        type: "mcq",
        prompt: "Which of these is most like AI?",
        options: [
          "A ruler measuring a line",
          "YouTube suggesting a cartoon you might like",
          "A calculator adding 5 + 5",
          "A light switch turning on a bulb",
        ],
        correctIndex: 1,
        explanation: "Suggestions come from patterns in what you watched — that is AI.",
      },
      {
        difficulty: "medium",
        type: "true_false",
        prompt: "Because AI makes guesses, it can sometimes be wrong.",
        options: ["True", "False"],
        correctIndex: 0,
        explanation: "Guesses are not always right, so AI can make mistakes.",
      },
      {
        difficulty: "medium",
        type: "mcq",
        prompt: "What is a pattern?",
        options: [
          "Something that looks alike or repeats again and again",
          "A password for your tablet",
          "A kind of computer screen",
          "A spell that makes computers work",
        ],
        correctIndex: 0,
        explanation: "A pattern is something that repeats — like whiskers on every cat.",
      },
      {
        difficulty: "hard",
        type: "mcq",
        prompt: "Riya says, “AI works by magic!” What is the best reply?",
        options: [
          "“Yes, AI has a tiny wizard inside.”",
          "“No, AI is alive and very clever.”",
          "“No, AI uses maths to find patterns in examples.”",
          "“Yes, but only on phones.”",
        ],
        correctIndex: 2,
        explanation: "AI is pattern-finding maths, written by people.",
      },
      {
        difficulty: "hard",
        type: "mcq",
        prompt: "What is one big difference between a calculator and AI?",
        options: [
          "A calculator needs electricity and AI does not",
          "AI is always right and a calculator is not",
          "A calculator is alive and AI is not",
          "A calculator follows a fixed rule; AI guesses from what it has seen",
        ],
        correctIndex: 3,
        explanation: "Fixed rule vs learned guess is the key difference.",
      },
    ],
  },

  B2: {
    notes: {
      bigIdea:
        "Simple programs follow fixed rules and do the same thing every time. AI programs change what they do after seeing more examples. Both are still made by people.",
      definitions: [
        {
          term: "Fixed rule",
          meaning: "An instruction that never changes: “If the button is pressed, play a sound.”",
        },
        {
          term: "Simple program",
          meaning: "A program that only follows fixed rules — like an alarm clock or a torch switch.",
        },
        {
          term: "Learns from examples",
          meaning: "Gets better at a job after seeing more samples, like a voice assistant hearing many voices.",
        },
        {
          term: "Designer",
          meaning: "The person who writes and plans a program. Every AI has human designers.",
        },
      ],
      panels: [
        {
          title: "Simple = fixed rules",
          body: [
            "Alarm clock: at 6:30, ring. Every day, same thing.",
            "Torch: switch on → light on. Switch off → light off.",
            "It never learns anything new.",
          ],
        },
        {
          title: "Smart = learns from examples",
          body: [
            "A voice assistant hears millions of voices.",
            "Over time, it gets better at understanding different accents.",
            "Spellcheck learns common words and suggests fixes.",
          ],
        },
        {
          title: "Sort it!",
          body: [
            "Fixed rule: torch, alarm clock, calculator, doorbell.",
            "Learns from examples: voice assistant, video suggestions, photo search.",
            "Ask: does it change after more examples? If yes, it may be AI.",
          ],
        },
        {
          title: "People are still in charge",
          body: [
            "Both simple programs and AI are written by people.",
            "People choose the examples AI learns from.",
            "AI does not build itself out of nothing.",
          ],
        },
      ],
      remember: [
        "Simple programs follow fixed rules.",
        "AI changes after seeing more examples.",
        "A torch is not AI — it just follows a switch.",
        "People design both simple programs and AI.",
      ],
      checkYourself: {
        q: "Is a torch ‘AI’? Why or why not?",
        a: "No. A torch follows one fixed rule — switch on, light on. It never learns from examples or changes what it does.",
      },
      dinoLine: "Chapter 2 done. You can tell fixed rules from learning — super work, champ!",
    },
    quiz: [
      {
        difficulty: "easy",
        type: "mcq",
        prompt: "An alarm clock rings at 6:30 every morning. What kind of program is this?",
        options: ["AI that learns", "A fixed-rule program", "A living robot", "A video suggestion tool"],
        correctIndex: 1,
        explanation: "It follows the same fixed rule every day.",
      },
      {
        difficulty: "easy",
        type: "true_false",
        prompt: "A torch is AI because it lights up when you press the switch.",
        options: ["True", "False"],
        correctIndex: 1,
        explanation: "A torch only follows a fixed rule; it never learns.",
      },
      {
        difficulty: "easy",
        type: "mcq",
        prompt: "Who writes and designs AI programs?",
        options: ["The AI builds itself from nothing", "Animals", "People", "Nobody — AI just appears"],
        correctIndex: 2,
        explanation: "People design both simple programs and AI.",
      },
      {
        difficulty: "easy",
        type: "mcq",
        prompt: "Which of these learns from examples?",
        options: ["A voice assistant", "A doorbell", "A torch", "A ceiling fan switch"],
        correctIndex: 0,
        explanation: "Voice assistants learn from hearing many voices.",
      },
      {
        difficulty: "medium",
        type: "mcq",
        prompt: "“If the button is pressed, play a sound.” What is this?",
        options: ["An example", "A guess", "A pattern AI found", "A fixed rule"],
        correctIndex: 3,
        explanation: "It always does the same thing — that is a fixed rule.",
      },
      {
        difficulty: "medium",
        type: "mcq",
        prompt: "What can an AI program do that a simple program cannot?",
        options: [
          "Run on electricity",
          "Change what it does after seeing more examples",
          "Be switched on and off",
          "Show things on a screen",
        ],
        correctIndex: 1,
        explanation: "Learning from more examples is what makes it AI.",
      },
      {
        difficulty: "medium",
        type: "mcq",
        prompt: "Which pair is sorted correctly?",
        options: [
          "Torch → learns from examples; spellcheck → fixed rule",
          "Doorbell → learns from examples; alarm clock → learns from examples",
          "Alarm clock → fixed rule; voice assistant → learns from examples",
          "Calculator → learns from examples; torch → learns from examples",
        ],
        correctIndex: 2,
        explanation: "Alarm clocks follow rules; voice assistants learn from voices.",
      },
      {
        difficulty: "medium",
        type: "true_false",
        prompt: "Both simple programs and AI programs are made by people.",
        options: ["True", "False"],
        correctIndex: 0,
        explanation: "People write and design both kinds.",
      },
      {
        difficulty: "hard",
        type: "mcq",
        prompt: "Spellcheck suggests “because” when you type “becuase”. Why is it closer to AI than a torch?",
        options: [
          "It learned common words from many examples of writing",
          "It is brighter than a torch",
          "It uses batteries",
          "It is alive and reads your mind",
        ],
        correctIndex: 0,
        explanation: "It learned patterns from lots of written words.",
      },
      {
        difficulty: "hard",
        type: "mcq",
        prompt: "Aarav wants to know if a gadget is AI. Which question helps most?",
        options: [
          "“Does it have a screen?”",
          "“Is it expensive?”",
          "“Is it made of plastic?”",
          "“Does it change what it does after more examples?”",
        ],
        correctIndex: 3,
        explanation: "Learning from examples is the sign of AI.",
      },
    ],
  },

  B3: {
    notes: {
      bigIdea:
        "AI hides in many everyday helpers — voice assistants, photo search, video suggestions, and map traffic. But not everything that looks smart is AI: a blinking toy just follows fixed rules.",
      definitions: [
        {
          term: "Voice assistant",
          meaning: "A helper you talk to. It guesses your words and tries to answer, like “What’s the weather?”",
        },
        {
          term: "Recommendation",
          meaning: "A suggestion made from patterns in what you liked before — like the next video to watch.",
        },
        {
          term: "Photo search",
          meaning: "Typing “dog” and the phone finds your dog photos, because AI learned what dogs look like.",
        },
        {
          term: "Not AI",
          meaning: "A gadget that only follows fixed rules, like a blinking toy or a torch.",
        },
      ],
      panels: [
        {
          title: "AI at home",
          body: [
            "Voice helper: “Play my favourite song!” It guesses your words.",
            "Photo search: type “beach” and the phone finds beach photos.",
            "Video app: “You might like…” comes from what you watched.",
          ],
        },
        {
          title: "AI on the road and in apps",
          body: [
            "Google Maps shows red roads where traffic is slow.",
            "It learns from many phones moving on the roads.",
            "Photo filters find your face so bunny ears sit in the right place.",
          ],
        },
        {
          title: "Looks smart, but not AI",
          body: [
            "A blinking toy car flashes the same lights every time.",
            "A doorbell rings when pressed — a fixed rule.",
            "Ask: does it learn from examples? If not, it’s not AI.",
          ],
        },
        {
          title: "Be an AI detective",
          body: [
            "Look at a screen: is it guessing or suggesting something?",
            "Guessing from patterns → probably AI.",
            "Same thing every time → probably a simple program.",
          ],
        },
      ],
      remember: [
        "Voice helpers, photo search, video suggestions, map traffic use AI.",
        "AI tries to guess or suggest from patterns.",
        "A blinking toy is not AI.",
        "Detective question: does it learn from examples?",
      ],
      checkYourself: {
        q: "Name one AI helper you have seen and what it tries to do.",
        a: "Example: a voice assistant tries to understand what you say and answer. Or Google Maps tries to show which roads have heavy traffic.",
      },
      dinoLine: "Chapter 3 done. You can spot AI hiding in daily life — super work, champ!",
    },
    quiz: [
      {
        difficulty: "easy",
        type: "mcq",
        prompt: "Which of these is an everyday AI helper?",
        options: ["A wooden spoon", "A school bag", "A voice assistant", "A pencil"],
        correctIndex: 2,
        explanation: "Voice assistants use AI to guess what you said.",
      },
      {
        difficulty: "easy",
        type: "mcq",
        prompt: "A video app shows “You might like…”. What is this called?",
        options: ["A recommendation", "A password", "A fixed rule", "A battery"],
        correctIndex: 0,
        explanation: "It recommends videos from patterns in what you watched.",
      },
      {
        difficulty: "easy",
        type: "true_false",
        prompt: "A toy car that blinks the same lights every time is AI.",
        options: ["True", "False"],
        correctIndex: 1,
        explanation: "It follows a fixed rule and never learns, so it is not AI.",
      },
      {
        difficulty: "easy",
        type: "mcq",
        prompt: "Which of these is NOT AI?",
        options: ["Photo search on a phone", "Map traffic colours", "Video suggestions", "A doorbell"],
        correctIndex: 3,
        explanation: "A doorbell just rings when pressed — a fixed rule.",
      },
      {
        difficulty: "medium",
        type: "mcq",
        prompt: "Google Maps shows a road in red. What is the AI trying to tell you?",
        options: [
          "The road is painted red",
          "Traffic is slow on that road",
          "The road is closed forever",
          "It is raining on that road",
        ],
        correctIndex: 1,
        explanation: "Red usually means slow traffic, learned from many phones moving.",
      },
      {
        difficulty: "medium",
        type: "mcq",
        prompt: "You type “dog” in your phone’s photos and it finds your dog pictures. How?",
        options: [
          "Your dog told the phone",
          "Someone named every photo by hand",
          "AI learned what dogs look like from many examples",
          "The phone guessed randomly",
        ],
        correctIndex: 2,
        explanation: "Photo search uses patterns learned from many dog photos.",
      },
      {
        difficulty: "medium",
        type: "mcq",
        prompt: "A photo filter puts bunny ears exactly on your head. What is AI doing?",
        options: [
          "Finding the pattern of a face in the picture",
          "Drawing ears on every photo in the same spot",
          "Asking you where your head is",
          "Nothing — it’s magic",
        ],
        correctIndex: 0,
        explanation: "The filter finds your face using patterns, then places the ears.",
      },
      {
        difficulty: "medium",
        type: "true_false",
        prompt: "AI helpers usually try to guess or suggest something from patterns.",
        options: ["True", "False"],
        correctIndex: 0,
        explanation: "Guessing and suggesting from patterns is what AI helpers do.",
      },
      {
        difficulty: "hard",
        type: "mcq",
        prompt: "Kabir sees a kitchen with a torch, a fridge light, a voice speaker, and a clock. Which one uses AI?",
        options: ["The torch", "The fridge light", "The clock", "The voice speaker"],
        correctIndex: 3,
        explanation: "The voice speaker guesses your words; the rest follow fixed rules.",
      },
      {
        difficulty: "hard",
        type: "mcq",
        prompt: "What is the best way to decide if a gadget in a picture uses AI?",
        options: [
          "Check if it is new and shiny",
          "Check if it learns or guesses from examples",
          "Check if it has lights",
          "Check if it makes a sound",
        ],
        correctIndex: 1,
        explanation: "Shiny or noisy doesn’t mean AI — learning from examples does.",
      },
    ],
  },

  B4: {
    notes: {
      bigIdea:
        "AI can be wrong. It makes mistakes when its examples were too few or messy. For anything important — health, safety, food — always check with a trusted grown-up.",
      definitions: [
        {
          term: "Mistake",
          meaning: "A wrong answer. AI can make mistakes, just like people.",
        },
        {
          term: "Few examples",
          meaning: "When AI has seen only a little. It hasn’t learned the pattern well yet.",
        },
        {
          term: "Messy examples",
          meaning: "Blurry photos or wrong names in what AI learned from. They confuse it.",
        },
        {
          term: "Double-check",
          meaning: "Asking a trusted person to make sure an answer is right before you act on it.",
        },
      ],
      panels: [
        {
          title: "Dog or muffin?",
          body: [
            "A brown dog with dark eyes can look like a muffin with raisins!",
            "AI once labelled a dog photo as a muffin.",
            "It saw a similar pattern — but got it wrong.",
          ],
        },
        {
          title: "Why AI gets it wrong",
          body: [
            "It saw too few examples to learn well.",
            "Its examples were messy — blurry or wrongly named.",
            "Something new it has never seen can fool it.",
          ],
        },
        {
          title: "Everyday oops moments",
          body: [
            "A voice assistant hears “play Baby Shark” as “play baby car”.",
            "A map app suggests a road that is closed today.",
            "A translation app picks a funny wrong word.",
          ],
        },
        {
          title: "Check with a person",
          body: [
            "Is it about health, safety, or food? Ask a grown-up.",
            "Never eat, touch, or go somewhere just because an app said so.",
            "AI is a helper, not the boss of big decisions.",
          ],
        },
      ],
      remember: [
        "AI can be wrong.",
        "Few or messy examples cause mistakes.",
        "Important facts? Check with a person.",
        "AI helps — grown-ups decide big things.",
      ],
      checkYourself: {
        q: "AI says a plant is safe to eat. Should you eat it? Why?",
        a: "No. AI can be wrong, and eating the wrong plant could make you sick. Always ask a trusted grown-up first.",
      },
      dinoLine: "Chapter 4 done. You know AI can be wrong and when to ask a grown-up — super work, champ!",
    },
    quiz: [
      {
        difficulty: "easy",
        type: "true_false",
        prompt: "AI is always right.",
        options: ["True", "False"],
        correctIndex: 1,
        explanation: "AI makes guesses, and guesses can be wrong.",
      },
      {
        difficulty: "easy",
        type: "mcq",
        prompt: "An AI labelled a dog photo as a muffin. What does this show?",
        options: ["AI can make mistakes", "Dogs are muffins", "The photo was magic", "AI is never wrong"],
        correctIndex: 0,
        explanation: "AI saw a similar pattern but guessed wrong.",
      },
      {
        difficulty: "easy",
        type: "true_false",
        prompt: "For important things like health, you should check an AI answer with a trusted grown-up.",
        options: ["True", "False"],
        correctIndex: 0,
        explanation: "Grown-ups help make sure important answers are right.",
      },
      {
        difficulty: "easy",
        type: "mcq",
        prompt: "Who should you ask when an app gives advice about something important?",
        options: ["Another app", "Nobody", "A random person online", "A trusted grown-up"],
        correctIndex: 3,
        explanation: "A trusted grown-up can double-check important advice.",
      },
      {
        difficulty: "medium",
        type: "mcq",
        prompt: "Why might AI make a mistake?",
        options: [
          "It is feeling tired",
          "It saw too few or messy examples",
          "It wants to trick you",
          "It is angry with you",
        ],
        correctIndex: 1,
        explanation: "Few or messy examples mean AI didn’t learn the pattern well.",
      },
      {
        difficulty: "medium",
        type: "true_false",
        prompt: "Blurry photos and wrong names in the examples can confuse AI.",
        options: ["True", "False"],
        correctIndex: 0,
        explanation: "Messy examples make it harder for AI to learn the right pattern.",
      },
      {
        difficulty: "medium",
        type: "mcq",
        prompt: "You say “play Baby Shark” and the voice assistant plays something else. What happened?",
        options: [
          "The assistant is broken forever",
          "The song was deleted from the world",
          "The assistant guessed your words wrongly",
          "The assistant doesn’t like you",
        ],
        correctIndex: 2,
        explanation: "Voice assistants guess words, and sometimes the guess is wrong.",
      },
      {
        difficulty: "medium",
        type: "mcq",
        prompt: "Which situation most needs a grown-up to check the AI answer?",
        options: [
          "An app suggests a song to listen to",
          "A filter adds cat ears to your photo",
          "An app picks a colour for your drawing",
          "An app says a medicine is fine to take",
        ],
        correctIndex: 3,
        explanation: "Medicine is about health, so a grown-up must check.",
      },
      {
        difficulty: "hard",
        type: "mcq",
        prompt: "An AI says a wild mushroom is safe to eat. What should you do?",
        options: [
          "Don’t eat it — ask a trusted grown-up, because AI can be wrong",
          "Eat it, because AI said so",
          "Ask the AI again and eat it if it says yes twice",
          "Eat just a small bite to test",
        ],
        correctIndex: 0,
        explanation: "AI can be wrong, and a wrong answer about food could make you sick.",
      },
      {
        difficulty: "hard",
        type: "mcq",
        prompt: "An AI learned “cat” from only 3 blurry photos. What will probably happen?",
        options: [
          "It will be perfect at spotting cats",
          "It will make more mistakes spotting cats",
          "It will refuse to look at cats",
          "It will turn the photos clear",
        ],
        correctIndex: 1,
        explanation: "Few and messy examples lead to more mistakes.",
      },
    ],
  },

  B5: {
    notes: {
      bigIdea:
        "AI helpers around the world translate languages, guide travellers with maps, and write captions on videos. Same idea everywhere, in local languages. Their job is to help people — not to replace teachers or parents.",
      definitions: [
        {
          term: "Translation",
          meaning: "Changing words from one language to another, like Hindi to Tamil or English to Bengali.",
        },
        {
          term: "Navigation",
          meaning: "Finding the way from one place to another, like Google Maps guiding a car.",
        },
        {
          term: "Captions",
          meaning: "Words shown on a video so you can read what people are saying.",
        },
        {
          term: "Helper",
          meaning: "Something that makes a job easier. AI helpers help people; they don’t replace them.",
        },
      ],
      panels: [
        {
          title: "Translate: talk across languages",
          body: [
            "Meera speaks Tamil. Arjun speaks Hindi.",
            "A translation app turns Meera’s words into Hindi for Arjun.",
            "Now they can plan a game together!",
          ],
        },
        {
          title: "Navigate: find the way",
          body: [
            "Map apps show the route to nani’s house.",
            "They warn about traffic jams ahead.",
            "They can speak directions: “Turn left in 200 metres.”",
          ],
        },
        {
          title: "Caption: read what is said",
          body: [
            "Captions show words at the bottom of a video.",
            "They help people who cannot hear well.",
            "They help when the room is noisy, too.",
          ],
        },
        {
          title: "Helpers, not replacements",
          body: [
            "AI helpers exist in India, Japan, Brazil, Kenya — everywhere.",
            "Same idea, different local languages.",
            "Teachers and parents still guide you. AI just helps.",
          ],
        },
      ],
      remember: [
        "Translation AI helps people who speak different languages.",
        "Map AI helps people find their way.",
        "Captions help people read what is said.",
        "AI is a helper, not a replacement for people.",
      ],
      checkYourself: {
        q: "How could translation AI help two children who speak different languages?",
        a: "It can turn one child’s words into the other child’s language, so they can understand each other, talk, and play together.",
      },
      dinoLine: "Chapter 5 done and Unit 1 complete. You know AI helpers around the world — super work, champ!",
    },
    quiz: [
      {
        difficulty: "easy",
        type: "mcq",
        prompt: "Which AI helper changes words from one language to another?",
        options: ["A map app", "A translation app", "A calculator", "A torch"],
        correctIndex: 1,
        explanation: "Translation apps change words between languages.",
      },
      {
        difficulty: "easy",
        type: "mcq",
        prompt: "Which AI helper shows you the way to nani’s house?",
        options: ["A photo filter", "A doorbell", "A map app", "A spellcheck"],
        correctIndex: 2,
        explanation: "Map apps help with navigation — finding the way.",
      },
      {
        difficulty: "easy",
        type: "mcq",
        prompt: "What are captions?",
        options: [
          "Words shown on a video so you can read what is said",
          "Hats worn by ship captains",
          "Secret passwords",
          "Pictures of maps",
        ],
        correctIndex: 0,
        explanation: "Captions show spoken words as text on a video.",
      },
      {
        difficulty: "easy",
        type: "true_false",
        prompt: "AI helpers are meant to replace teachers and parents.",
        options: ["True", "False"],
        correctIndex: 1,
        explanation: "AI helpers help people — they don’t replace them.",
      },
      {
        difficulty: "medium",
        type: "mcq",
        prompt: "Meera speaks Tamil and Arjun speaks Hindi. How can AI help them?",
        options: [
          "A map app can show them a road",
          "A photo filter can add stickers",
          "A calculator can add their ages",
          "A translation app can turn Meera’s words into Hindi",
        ],
        correctIndex: 3,
        explanation: "Translation lets them understand each other.",
      },
      {
        difficulty: "medium",
        type: "mcq",
        prompt: "Who do captions help the most?",
        options: [
          "People who cannot hear well",
          "People who don’t have a phone",
          "People who are sleeping",
          "People who cannot see colours",
        ],
        correctIndex: 0,
        explanation: "Captions let people read what they cannot hear.",
      },
      {
        difficulty: "medium",
        type: "true_false",
        prompt: "AI helpers are used in many countries, in their own local languages.",
        options: ["True", "False"],
        correctIndex: 0,
        explanation: "Same idea everywhere, but in local languages.",
      },
      {
        difficulty: "medium",
        type: "mcq",
        prompt: "Match the job: “Turn left in 200 metres.” Which helper says this?",
        options: ["Translation app", "Caption tool", "Map app", "Spellcheck"],
        correctIndex: 2,
        explanation: "Map apps speak directions to guide you.",
      },
      {
        difficulty: "hard",
        type: "mcq",
        prompt: "Which sentence about AI helpers is correct?",
        options: [
          "AI helpers only work in one country",
          "AI helpers help people, while teachers and parents still guide us",
          "AI helpers will soon replace all teachers",
          "AI helpers never make mistakes",
        ],
        correctIndex: 1,
        explanation: "AI is a helper; people still guide and decide.",
      },
      {
        difficulty: "hard",
        type: "mcq",
        prompt: "A family visits a new city and wants to read a sign in another language and then find their hotel. Which two helpers fit best?",
        options: [
          "Captions and a calculator",
          "A photo filter and a doorbell",
          "Spellcheck and a torch",
          "Translation and a map app",
        ],
        correctIndex: 3,
        explanation: "Translation reads the sign; the map app finds the hotel.",
      },
    ],
  },

  B6: {
    notes: {
      bigIdea:
        "We teach a computer like we teach a puppy: show many examples, say “yes” when it’s right, and let it practise more. This is called training — and one example is never enough.",
      definitions: [
        {
          term: "Training",
          meaning: "Teaching AI by showing it lots of labelled examples.",
        },
        {
          term: "Labelled example",
          meaning: "An example with its name stuck on, like a photo marked “cat”.",
        },
        {
          term: "Practice",
          meaning: "Trying again and again to get better — for puppies, kids, and AI.",
        },
        {
          term: "Test",
          meaning: "Checking if the AI learned, by giving it something to guess.",
        },
      ],
      panels: [
        {
          title: "Teaching a puppy",
          body: [
            "You say “sit” and gently show the puppy what to do.",
            "When it sits, you say “Good dog!” and give a treat.",
            "After many tries, it sits every time you say it.",
          ],
        },
        {
          title: "Teaching a computer",
          body: [
            "Show many photos labelled “cat”.",
            "When it guesses right, tell it “yes”. When wrong, tell it “no”.",
            "With more practice, its guesses get better.",
          ],
        },
        {
          title: "Why one photo isn’t enough",
          body: [
            "One orange cat photo? AI might think all cats are orange.",
            "Cats can be black, white, striped, big, or tiny.",
            "Many photos help AI learn what all cats share.",
          ],
        },
        {
          title: "Train, then test",
          body: [
            "Step 1: Train — show lots of labelled examples.",
            "Step 2: Test — give a new photo and see its guess.",
            "Wrong? Show more examples and try again.",
          ],
        },
      ],
      remember: [
        "Training means showing lots of examples.",
        "Labelled examples have their names on them.",
        "One example is not enough.",
        "First train, then test.",
      ],
      checkYourself: {
        q: "To teach ‘bus’, would you show 1 photo or 100? Why?",
        a: "100 photos. Buses come in many colours, sizes, and angles. With many examples, AI learns what all buses share — not just one bus.",
      },
      dinoLine: "Chapter 1 done. You know how training works — super work, champ!",
    },
    quiz: [
      {
        difficulty: "easy",
        type: "mcq",
        prompt: "What is training in AI?",
        options: [
          "Taking the computer on a train ride",
          "Showing AI lots of labelled examples",
          "Switching the computer on",
          "Charging the battery",
        ],
        correctIndex: 1,
        explanation: "Training means teaching AI with many labelled examples.",
      },
      {
        difficulty: "easy",
        type: "true_false",
        prompt: "One photo is enough to teach AI what a cat looks like.",
        options: ["True", "False"],
        correctIndex: 1,
        explanation: "AI needs many examples to learn what all cats share.",
      },
      {
        difficulty: "easy",
        type: "mcq",
        prompt: "How do we teach a puppy to sit?",
        options: [
          "Tell it once and never again",
          "Shout at it",
          "Show it many times and praise it when it’s right",
          "Give it a book to read",
        ],
        correctIndex: 2,
        explanation: "Many tries and praise help the puppy learn — just like AI.",
      },
      {
        difficulty: "easy",
        type: "mcq",
        prompt: "A photo with the name “cat” stuck on it is called a…",
        options: ["Labelled example", "Password", "Fixed rule", "Caption"],
        correctIndex: 0,
        explanation: "It is an example with its label — the name — attached.",
      },
      {
        difficulty: "medium",
        type: "mcq",
        prompt: "Which training set would teach AI “cat” best?",
        options: [
          "1 photo of an orange cat",
          "5 photos of the same cat",
          "100 photos of dogs",
          "100 photos of many different cats",
        ],
        correctIndex: 3,
        explanation: "Many different cats show AI what all cats have in common.",
      },
      {
        difficulty: "medium",
        type: "mcq",
        prompt: "AI saw only one orange cat photo. What mistake might it make?",
        options: [
          "Think all cats are orange",
          "Think cats can fly",
          "Stop working forever",
          "Learn every animal perfectly",
        ],
        correctIndex: 0,
        explanation: "With one example, it might think orange is part of being a cat.",
      },
      {
        difficulty: "medium",
        type: "mcq",
        prompt: "What is the correct order?",
        options: ["Test → train", "Test → test", "Train → test", "Neither — AI just knows"],
        correctIndex: 2,
        explanation: "First we train with examples, then we test what it learned.",
      },
      {
        difficulty: "medium",
        type: "true_false",
        prompt: "Telling AI “yes” when it’s right is like praising a puppy.",
        options: ["True", "False"],
        correctIndex: 0,
        explanation: "Both learn from feedback on right and wrong tries.",
      },
      {
        difficulty: "hard",
        type: "mcq",
        prompt: "To teach AI what a “bus” is, which is the best plan?",
        options: [
          "Show 1 red bus photo",
          "Describe a bus in one sentence",
          "Show 100 photos of cars",
          "Show 100 labelled bus photos of different colours and sizes",
        ],
        correctIndex: 3,
        explanation: "Many varied, labelled bus photos teach the real pattern.",
      },
      {
        difficulty: "hard",
        type: "mcq",
        prompt: "AI guesses wrong in a test. What should happen next?",
        options: [
          "Give up on the AI",
          "Train it with more examples and test again",
          "Hide the wrong answer",
          "Tell it the answer is always “cat”",
        ],
        correctIndex: 1,
        explanation: "More training and practice help AI get better, like a puppy.",
      },
    ],
  },

  B7: {
    notes: {
      bigIdea:
        "A pattern is something that repeats — the same colour, shape, or beat. You notice patterns all the time. AI looks for the same kinds of patterns, but it can check thousands of things very fast.",
      definitions: [
        {
          term: "Pattern",
          meaning: "Something that repeats in a way you can predict, like red, blue, red, blue.",
        },
        {
          term: "Sequence",
          meaning: "Things in a row, one after another, like ● ▲ ● ▲.",
        },
        {
          term: "Sort",
          meaning: "Putting things into groups that are alike — by colour, shape, or size.",
        },
        {
          term: "Group",
          meaning: "A set of things that share something, like all the round shapes.",
        },
      ],
      panels: [
        {
          title: "Patterns around you",
          body: [
            "Colours: red, blue, red, blue — what comes next? Red!",
            "Shapes: circle, square, circle, square.",
            "Beats: clap, clap, stamp — clap, clap, stamp.",
          ],
        },
        {
          title: "Sorting game",
          body: [
            "Sort by colour: all red together, all blue together.",
            "Now sort again by shape: circles here, triangles there.",
            "Same things, different groups — you chose the pattern!",
          ],
        },
        {
          title: "AI sorts too",
          body: [
            "A mango farm can use AI to sort ripe and unripe mangoes.",
            "It looks for patterns: yellow colour, round shape, no spots.",
            "It can sort thousands of mangoes faster than any person.",
          ],
        },
        {
          title: "You and AI find patterns",
          body: [
            "You notice patterns with your eyes and ears.",
            "AI notices patterns in numbers, pictures, and sounds.",
            "Same idea — AI just does it on lots and lots of things.",
          ],
        },
      ],
      remember: [
        "A pattern repeats: same colour, shape, or beat.",
        "Sorting means grouping things that are alike.",
        "AI finds patterns people also notice.",
        "AI can do it on thousands of things, fast.",
      ],
      checkYourself: {
        q: "What pattern do you see: red, blue, red, blue, ___?",
        a: "The colours take turns: red, then blue. So the next one is red.",
      },
      dinoLine: "Chapter 2 done. You can spot patterns like AI does — super work, champ!",
    },
    quiz: [
      {
        difficulty: "easy",
        type: "mcq",
        prompt: "What comes next? red, blue, red, blue, ___",
        options: ["Green", "Blue", "Red", "Yellow"],
        correctIndex: 2,
        explanation: "The colours take turns, so red comes next.",
      },
      {
        difficulty: "easy",
        type: "mcq",
        prompt: "What is a pattern?",
        options: [
          "Something that repeats in a way you can predict",
          "A random mess",
          "A kind of computer",
          "A secret password",
        ],
        correctIndex: 0,
        explanation: "Patterns repeat, so you can guess what comes next.",
      },
      {
        difficulty: "easy",
        type: "mcq",
        prompt: "What comes next? circle, square, circle, square, ___",
        options: ["Triangle", "Square", "Star", "Circle"],
        correctIndex: 3,
        explanation: "Circle and square take turns, so circle is next.",
      },
      {
        difficulty: "easy",
        type: "true_false",
        prompt: "Sorting means putting things that are alike into groups.",
        options: ["True", "False"],
        correctIndex: 0,
        explanation: "Sorting groups things by colour, shape, or size.",
      },
      {
        difficulty: "medium",
        type: "mcq",
        prompt: "What comes next? clap, clap, stamp, clap, clap, ___",
        options: ["Clap", "Stamp", "Jump", "Snap"],
        correctIndex: 1,
        explanation: "The beat is clap, clap, stamp — so stamp is next.",
      },
      {
        difficulty: "medium",
        type: "mcq",
        prompt: "You have red circles, red squares, blue circles, and blue squares. You sort by shape. Which is one group?",
        options: [
          "All the red things",
          "All the blue things",
          "Red circles and blue squares",
          "All the circles",
        ],
        correctIndex: 3,
        explanation: "Sorting by shape puts all circles together, whatever the colour.",
      },
      {
        difficulty: "medium",
        type: "mcq",
        prompt: "A mango farm uses AI to find ripe mangoes. What pattern might it look for?",
        options: [
          "Yellow colour and no spots",
          "The mango’s name",
          "How loud the mango is",
          "The day the mango was sold",
        ],
        correctIndex: 0,
        explanation: "Colour and spots are patterns that show ripeness.",
      },
      {
        difficulty: "medium",
        type: "true_false",
        prompt: "AI looks for the same kinds of patterns that people also notice.",
        options: ["True", "False"],
        correctIndex: 0,
        explanation: "AI finds patterns like colour and shape, just like we do.",
      },
      {
        difficulty: "hard",
        type: "mcq",
        prompt: "What is one way AI is different from you at finding patterns?",
        options: [
          "AI can’t find any patterns",
          "AI finds patterns by magic",
          "AI can check thousands of items very fast",
          "AI only finds patterns in music",
        ],
        correctIndex: 2,
        explanation: "AI finds patterns like we do, but on huge numbers of things, quickly.",
      },
      {
        difficulty: "hard",
        type: "mcq",
        prompt: "What comes next? ● ● ▲ ● ● ▲ ● ● ___",
        options: ["●", "▲", "■", "★"],
        correctIndex: 1,
        explanation: "The pattern is two circles then a triangle, so ▲ is next.",
      },
    ],
  },

  B8: {
    notes: {
      bigIdea:
        "A label is a name we stick on an example — “this is an apple”. AI learns from labelled examples, so the labels must be right. A wrong label confuses the learner, whether it is a person or AI.",
      definitions: [
        {
          term: "Label",
          meaning: "A name stuck on an example, like writing “apple” under an apple picture.",
        },
        {
          term: "Labelled data",
          meaning: "Lots of examples that each have the right name on them.",
        },
        {
          term: "Mislabelled",
          meaning: "Has the wrong name, like a banana picture labelled “bus”.",
        },
        {
          term: "Show and tell",
          meaning: "Showing a picture and saying its name — how we teach labels.",
        },
      ],
      panels: [
        {
          title: "What is a label?",
          body: [
            "Show a picture of an apple and say, “This is an apple.”",
            "The word “apple” is the label.",
            "AI learns: pictures like this = apple.",
          ],
        },
        {
          title: "Show-and-tell game",
          body: [
            "Card 1: mango → label “mango”.",
            "Card 2: auto-rickshaw → label “auto”.",
            "Card 3: parrot → label “bird”. Each card gets the right name.",
          ],
        },
        {
          title: "Oops — wrong label!",
          body: [
            "A banana card is labelled “bus”.",
            "AI learns: yellow, curved things are buses!",
            "Later it may call a real banana a bus — or miss a real bus.",
          ],
        },
        {
          title: "Be a label checker",
          body: [
            "Look at each card: does the name match the picture?",
            "Find the mislabelled one and fix it.",
            "Right labels help people and AI learn right.",
          ],
        },
      ],
      remember: [
        "A label is the name on an example.",
        "AI learns from labelled examples.",
        "Wrong labels teach wrong things.",
        "Check labels before teaching.",
      ],
      checkYourself: {
        q: "A banana is labelled ‘bus’. What might the AI get wrong later?",
        a: "It might call a real banana a “bus”, or get confused when it sees a real bus. It learned the wrong name for the picture.",
      },
      dinoLine: "Chapter 3 done. You know why labels must be right — super work, champ!",
    },
    quiz: [
      {
        difficulty: "easy",
        type: "mcq",
        prompt: "What is a label?",
        options: [
          "A name stuck on an example",
          "A kind of sticker game only",
          "A computer’s battery",
          "A fixed rule",
        ],
        correctIndex: 0,
        explanation: "A label is the name we give an example, like “apple”.",
      },
      {
        difficulty: "easy",
        type: "mcq",
        prompt: "Which label is right for a picture of a mango?",
        options: ["Bus", "Parrot", "Mango", "Pencil"],
        correctIndex: 2,
        explanation: "The label should match what is in the picture.",
      },
      {
        difficulty: "easy",
        type: "true_false",
        prompt: "Wrong labels can confuse AI.",
        options: ["True", "False"],
        correctIndex: 0,
        explanation: "AI learns whatever the labels say, even if they are wrong.",
      },
      {
        difficulty: "easy",
        type: "mcq",
        prompt: "A picture of a banana labelled “bus” is…",
        options: ["Correctly labelled", "Mislabelled", "Not a picture", "A fixed rule"],
        correctIndex: 1,
        explanation: "The name doesn’t match the picture, so it is mislabelled.",
      },
      {
        difficulty: "medium",
        type: "mcq",
        prompt: "Which card is mislabelled?",
        options: [
          "Parrot → “bird”",
          "Apple → “apple”",
          "Auto-rickshaw → “auto”",
          "Cat → “dog”",
        ],
        correctIndex: 3,
        explanation: "A cat is not a dog, so that label is wrong.",
      },
      {
        difficulty: "medium",
        type: "mcq",
        prompt: "Why do we put labels on training examples?",
        options: [
          "To make the pictures colourful",
          "So AI knows what each example is",
          "To make the computer faster",
          "So nobody can see the pictures",
        ],
        correctIndex: 1,
        explanation: "Labels tell the learner the right name for each example.",
      },
      {
        difficulty: "medium",
        type: "true_false",
        prompt: "A wrong label only confuses AI, never a person.",
        options: ["True", "False"],
        correctIndex: 1,
        explanation: "Wrong labels confuse any learner — people and AI.",
      },
      {
        difficulty: "medium",
        type: "mcq",
        prompt: "In show and tell, you hold up a picture of a parrot. What should you say?",
        options: ["“This is a bird.”", "“This is a bus.”", "“This is a mango.”", "“This is a chair.”"],
        correctIndex: 0,
        explanation: "Saying the right name gives the picture the right label.",
      },
      {
        difficulty: "hard",
        type: "mcq",
        prompt: "AI learned from many banana pictures labelled “bus”. What might it do later?",
        options: [
          "Spot bananas perfectly",
          "Refuse to look at yellow things",
          "Call a real banana a “bus”",
          "Fix the labels by itself",
        ],
        correctIndex: 2,
        explanation: "It learned the wrong name, so it repeats the mistake.",
      },
      {
        difficulty: "hard",
        type: "mcq",
        prompt: "Before training AI with 100 picture cards, what is the smartest thing to do?",
        options: [
          "Remove all the labels",
          "Add more wrong labels for fun",
          "Use only one card",
          "Check that every label matches its picture",
        ],
        correctIndex: 3,
        explanation: "Right labels help AI learn the right patterns.",
      },
    ],
  },

  B9: {
    notes: {
      bigIdea:
        "Data is the food AI eats — pictures, words, and sounds. Like you need different healthy foods, AI learns better from varied data, not just one kind. And some data, like private information, should not be collected at all.",
      definitions: [
        {
          term: "Data",
          meaning: "Information AI learns from: pictures, words, sounds, and numbers.",
        },
        {
          term: "Dataset",
          meaning: "A big collection of data, like 1,000 dog photos.",
        },
        {
          term: "Variety",
          meaning: "Many different kinds — big dogs, small dogs, brown dogs, spotty dogs.",
        },
        {
          term: "Private data",
          meaning: "Information about a person that should stay safe, like their home address or face photos.",
        },
      ],
      panels: [
        {
          title: "Data is AI’s food",
          body: [
            "Pictures: photos of cats, mangoes, buses.",
            "Words: stories, messages, questions.",
            "Sounds: voices, songs, dogs barking.",
          ],
        },
        {
          title: "Eat a variety!",
          body: [
            "You don’t eat only rice every day — you need dal, sabzi, fruit.",
            "AI also needs many kinds of examples.",
            "Many kinds of dogs teach “dog” better than one kind.",
          ],
        },
        {
          title: "Only one kind? Trouble!",
          body: [
            "AI saw 200 photos of only parrots.",
            "Now it sees a crow. It may say, “Not a bird!”",
            "Parrots, crows, sparrows, peacocks — variety helps.",
          ],
        },
        {
          title: "Some data stays private",
          body: [
            "Public: pictures of trees, animals, famous buildings.",
            "Private: your address, phone number, family photos.",
            "Private data should not be collected without permission.",
          ],
        },
      ],
      remember: [
        "Data is the food AI eats.",
        "Pictures, words, and sounds are data.",
        "Varied data teaches AI better.",
        "Some data should stay private.",
      ],
      checkYourself: {
        q: "To recognise ‘bird’, is 200 photos of only parrots enough? Why?",
        a: "No. AI might think only parrots are birds. It needs many kinds — crows, sparrows, peacocks, pigeons — to learn what all birds share.",
      },
      dinoLine: "Chapter 4 done. You know data is AI’s food and variety matters — super work, champ!",
    },
    quiz: [
      {
        difficulty: "easy",
        type: "mcq",
        prompt: "What is data for AI?",
        options: [
          "Information like pictures, words, and sounds",
          "Real food like rice and dal",
          "The screen of a computer",
          "A kind of battery",
        ],
        correctIndex: 0,
        explanation: "Data is the information AI learns from.",
      },
      {
        difficulty: "easy",
        type: "mcq",
        prompt: "Which of these is a kind of data AI might use?",
        options: ["A glass of water", "A pair of shoes", "Photos of dogs", "A chair"],
        correctIndex: 2,
        explanation: "Photos are data; AI can learn from them.",
      },
      {
        difficulty: "easy",
        type: "true_false",
        prompt: "Sounds, like voices, can be data for AI.",
        options: ["True", "False"],
        correctIndex: 0,
        explanation: "Voice assistants learn from lots of voice sounds.",
      },
      {
        difficulty: "easy",
        type: "mcq",
        prompt: "A big collection of data, like 1,000 dog photos, is called a…",
        options: ["Password", "Dataset", "Caption", "Torch"],
        correctIndex: 1,
        explanation: "A dataset is a big collection of data.",
      },
      {
        difficulty: "medium",
        type: "mcq",
        prompt: "Which dataset would teach AI “dog” best?",
        options: [
          "500 photos of only brown puppies",
          "500 photos of cats",
          "1 photo of a dog",
          "500 photos of big, small, brown, white, and spotty dogs",
        ],
        correctIndex: 3,
        explanation: "More variety teaches what all dogs share.",
      },
      {
        difficulty: "medium",
        type: "mcq",
        prompt: "AI learned “bird” from only parrot photos. It sees a crow. What might happen?",
        options: [
          "It may say the crow is not a bird",
          "It will know every bird perfectly",
          "It will turn the crow green",
          "It will ask the crow its name",
        ],
        correctIndex: 0,
        explanation: "Without variety, AI may think only parrots are birds.",
      },
      {
        difficulty: "medium",
        type: "mcq",
        prompt: "Which of these is private data that should not be collected?",
        options: ["A photo of a tree", "A picture of the Taj Mahal", "Your home address", "A drawing of a cat"],
        correctIndex: 2,
        explanation: "Your address is private and should stay safe.",
      },
      {
        difficulty: "medium",
        type: "true_false",
        prompt: "Just like kids need different healthy foods, AI learns better from varied data.",
        options: ["True", "False"],
        correctIndex: 0,
        explanation: "Variety helps AI learn the real pattern.",
      },
      {
        difficulty: "hard",
        type: "mcq",
        prompt: "Why is “200 photos of only parrots” not enough to learn “bird”?",
        options: [
          "200 is too many photos",
          "Birds come in many kinds, and AI saw only one",
          "Parrots are not birds",
          "AI can’t look at photos",
        ],
        correctIndex: 1,
        explanation: "AI needs many kinds of birds to learn what all birds share.",
      },
      {
        difficulty: "hard",
        type: "mcq",
        prompt: "An app wants to collect everyone’s family photos to train AI, without asking. Is that okay?",
        options: [
          "Yes, AI needs all the data it can get",
          "Yes, if the photos are nice",
          "Yes, family photos are public",
          "No, private data should not be collected without permission",
        ],
        correctIndex: 3,
        explanation: "Some data is private and needs permission — or shouldn’t be collected.",
      },
    ],
  },

  B10: {
    notes: {
      bigIdea:
        "AI gets better with practice, just like you do with maths sums. Its first tries are wobbly. We test it on new examples it has never seen, to check it really learned — not just remembered.",
      definitions: [
        {
          term: "Practice",
          meaning: "Trying again and again to get better. AI practises with more examples.",
        },
        {
          term: "Test",
          meaning: "Checking what AI learned by giving it new examples.",
        },
        {
          term: "New example",
          meaning: "Something the AI has never seen during training, like a fresh cat photo.",
        },
        {
          term: "Improve",
          meaning: "To get better over time, step by step.",
        },
      ],
      panels: [
        {
          title: "First tries are wobbly",
          body: [
            "Riding a cycle? You wobble at first.",
            "AI’s first guesses are wobbly too — many are wrong.",
            "With more examples and practice, it gets steadier.",
          ],
        },
        {
          title: "Just like maths sums",
          body: [
            "Your first sums may have mistakes.",
            "You practise, fix mistakes, and get faster and better.",
            "Nobody is born knowing sums — not you, not AI!",
          ],
        },
        {
          title: "Test with something new",
          body: [
            "If a test uses the same photos from training, AI may just remember them.",
            "A new cat photo shows if it really learned “cat”.",
            "Like a class test with new sums, not the ones you practised.",
          ],
        },
        {
          title: "The improve loop",
          body: [
            "1. Train with examples.  2. Try a guess.",
            "3. Fix wrong labels or add examples.  4. Try again.",
            "Each loop, the AI gets a little better.",
          ],
        },
      ],
      remember: [
        "Practice makes AI better.",
        "First tries are wobbly — that’s okay.",
        "Test with new examples, not the old ones.",
        "Train → try → fix → try again.",
      ],
      checkYourself: {
        q: "Why test a ‘cat finder’ on a new cat photo, not only the training photos?",
        a: "Because the AI may just remember the training photos. A new photo shows if it really learned what cats look like.",
      },
      dinoLine: "Chapter 5 done and Unit 2 complete. You know practice makes AI better — super work, champ!",
    },
    quiz: [
      {
        difficulty: "easy",
        type: "mcq",
        prompt: "How does AI get better at a job?",
        options: [
          "It is born smart",
          "By sleeping more",
          "By practising with more examples",
          "By getting a new colour",
        ],
        correctIndex: 2,
        explanation: "Practice with more examples improves AI’s guesses.",
      },
      {
        difficulty: "easy",
        type: "true_false",
        prompt: "AI’s first guesses are usually perfect.",
        options: ["True", "False"],
        correctIndex: 1,
        explanation: "First tries are wobbly; practice makes them better.",
      },
      {
        difficulty: "easy",
        type: "mcq",
        prompt: "AI practising is most like…",
        options: [
          "A kid practising maths sums",
          "A torch switching on",
          "A doorbell ringing",
          "A clock ticking",
        ],
        correctIndex: 0,
        explanation: "Both get better by practising and fixing mistakes.",
      },
      {
        difficulty: "easy",
        type: "mcq",
        prompt: "What is a “new example”?",
        options: [
          "A photo AI saw many times in training",
          "A broken computer",
          "A wrong label",
          "Something the AI has never seen before",
        ],
        correctIndex: 3,
        explanation: "New examples were not part of the training.",
      },
      {
        difficulty: "medium",
        type: "mcq",
        prompt: "Why do we test AI with new examples?",
        options: [
          "To make it slower",
          "To check it really learned, not just remembered",
          "Because old examples are deleted",
          "To make it forget everything",
        ],
        correctIndex: 1,
        explanation: "New examples show if AI learned the real pattern.",
      },
      {
        difficulty: "medium",
        type: "mcq",
        prompt: "What is the right order to improve AI?",
        options: [
          "Try → stop → give up",
          "Fix labels → never try",
          "Train → try → fix labels → try again",
          "Try again → train → never test",
        ],
        correctIndex: 2,
        explanation: "Train, try, fix, and try again — each loop helps.",
      },
      {
        difficulty: "medium",
        type: "true_false",
        prompt: "AI gets better through practice, not by being “born smart”.",
        options: ["True", "False"],
        correctIndex: 0,
        explanation: "Like kids, AI improves step by step with practice.",
      },
      {
        difficulty: "medium",
        type: "mcq",
        prompt: "A cat finder makes mistakes in a test. What is a good next step?",
        options: [
          "Throw it away",
          "Test it only on photos it already knows",
          "Tell everyone it’s perfect",
          "Fix wrong labels and add more cat examples",
        ],
        correctIndex: 3,
        explanation: "Fixing labels and adding examples helps it improve.",
      },
      {
        difficulty: "hard",
        type: "mcq",
        prompt: "A cat finder gets every training photo right but fails on new cat photos. What does this tell you?",
        options: [
          "It remembered the training photos but didn’t really learn “cat”",
          "It has learned cats perfectly",
          "The new photos are not cats",
          "It needs fewer examples",
        ],
        correctIndex: 0,
        explanation: "Passing only old photos means it memorised them.",
      },
      {
        difficulty: "hard",
        type: "mcq",
        prompt: "Your teacher gives new sums in the test, not the practice ones. Why is this like testing AI?",
        options: [
          "Because new sums are always easier",
          "Both check real learning with things not seen before",
          "Because teachers don’t like old sums",
          "Both are about computers",
        ],
        correctIndex: 1,
        explanation: "New questions show whether you — or AI — really learned.",
      },
    ],
  },
};
