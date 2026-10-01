# A6 production notes

Built from detailed syllabus Module **A6 — What Is an Algorithm?**  
Unit: **CS · Thinking Like a Computer** · Chapter **1 of 5** · Building

## Teaching covered (syllabus)
- An algorithm is a clear list of steps — like a recipe or getting ready for school
- Steps must be in an order a machine (or a friend) can follow
- Good algorithms are short, clear, and complete

## Mentoring flow
Welcome back → Unit 1 recap → Unit 2 intro → chapter card → "big word" reassurance → Robo story (asks for water, freezes, why?, needs steps, 4 steps, succeeds) → definition (name, meaning, three parts) → chai recipe (ask, 4 steps, recipe = algorithm, wrong order) → morning routine (5 steps → ready for school) → robots can't guess ("help the plant" vs "pour one cup of water on the soil") → short / clear / complete → missing-step detective game (glass of water) → sandwich ordering game → checkpoint (4 steps to water a plant, matches notes + quiz) → recap (4 cards) → chapter done → quiz bridge

## Pace
A5 (~151 wpm) felt a little fast; A4 (~108 wpm) felt slow. A6 sits between:
- Voice `+4%` rate, `+1Hz` pitch → ~135 wpm overall
- `beatGap` 0.34s between sentences (A5: 0.12s) and 1.8–2.5s think-time after each question
- Conversational script: story-led, asks the child questions, explains *why* each idea matters instead of listing facts
- 0.26s crossfades (A5: 0.18s) for a calmer flow

Total runtime ~6.5 min.

## New illustration kit
Robo the robot (idle / blank / confused / happy, wave, hold), glass + water filter, chai pot on stove, cup, tea leaves, milk + sugar, toothbrush, shower, uniform, school bag, tiffin, plant (droopy → healthy → flower), watering can, footprints, bread / jam / sandwich, music notes, magnifier, speech bubbles, numbered step cards with missing-step state.

## Watch
`/learn/app/lesson/A6`

## Notes + quiz
Notes PDF and 10-question quiz come from `src/lib/learn-content/cs-1.ts` (`A6`).

## Rebuild
```bash
.venv-video/bin/python scripts/learn-video/preview.py videos/learn/a6-what-is-an-algorithm   # contact sheet
.venv-video/bin/python scripts/learn-video/build.py videos/learn/a6-what-is-an-algorithm
```

## Voice
`en-IN-NeerjaExpressiveNeural` at `+4%` rate, `+1Hz` pitch.
