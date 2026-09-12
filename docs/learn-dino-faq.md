# Mentr Learn · Dino guide FAQ (reference)

> **Source of truth for code:** `src/lib/learn-dino-faq.ts`  
> Update **both** this doc and that file when you add/change a feature.  
> Chatbot uses **static Q&A only** — no AI API.

## How the chat works

1. Parent opens the corner dino → **Talk to Dino**.
2. First node: **What is Learn by Mentr?** (`what-is-learn`).
3. User taps a question chip (no text input).
4. Dino shows the fixed answer + up to **6 next questions** + optional CTA button.
5. Repeat. **Explore Learn** / signup CTAs close or deep-link as coded.

## Nodes (keep IDs stable)

| ID | Question | CTA |
|----|----------|-----|
| `what-is-learn` | What is Learn by Mentr? | Start free → `/parent/signup?next=/learn` |
| `how-it-works` | How does one lesson work? | — |
| `who-is-it-for` | Who is it for? | — |
| `is-it-free` | Is it really free? | Create free account |
| `how-to-start` | How do we start? | Parent signup |
| `what-is-mentr` | What is Mentr? | Explore Mentr → `/` |
| `tracks` | What will my child learn? | See syllabus → `/learn#curriculum` |
| `how-long` | How long each day? | — |
| `parent-email` | How do parents stay updated? | — |
| `need-tutor` | Do we need a tutor too? | Find tutors → `/search` |
| `find-tutor` | How do I find a tutor on Mentr? | Browse tutors |
| `syllabus` | Can I see the full syllabus? | Open syllabus → `/learn/syllabus` |
| `leaderboard` | Is there a leaderboard? | — |
| `older-classes` | What about Class 6+? | Join free |

## Product facts to keep accurate

- **Audience:** Class 3–5 (~ages 8–11).
- **Content:** 60 modules (20 CS + 20 AI + 20 Math). Free for launch cohort.
- **Lesson loop:** Watch → 10 practice → play; Boss every few modules; ~15 min/day.
- **Parents:** Weekly email (modules, streak, what’s next). Account = parent signup + child profile.
- **Leaderboard:** Opt-in, cohort, first name + avatar; off by default.
- **Money:** Learn free; tutors optional/paid separately. No selling lesson data as the model.
- **Mentr:** Tutors/mentors marketplace + Learn.

## When you ship a new feature

1. Add a node in `learn-dino-faq.ts` (id, question, answer, `next[]`, optional `cta` / `action`).
2. Wire `next` from related existing nodes (max 6 shown).
3. Mirror the row in this markdown table.
4. Keep answers short, plain English, parent-facing.

## Out of scope

- Free-text chat, LLM, embeddings.
- WhatsApp parent reports (email only).
- Claiming celebrities endorse Mentr.
