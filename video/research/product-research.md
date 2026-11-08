# Product research — Mentr Learn Python Level 2 (Intermediate)

**Date:** 2026-11-05  
**Sources of truth:** local repo `/Users/adarshsinghj/Desktop/champs`, live site https://mentr.in/learnpython  
**Video scope:** desktop 1920×1080 only

---

## Verified Level 2 features

- **Track name:** Python Intermediate (marketed as Level 2 / Intermediate)
- **12 lessons** with Study → Examples → Practice loop
- **In-browser Pyodide compiler** (CPython → WASM)
- **Unlock:** placement quiz (70%+) **or** Beginner Lesson 9 Study done
- **Intermediate practice bank** (additional drills)
- **Intermediate certificate** (`MPI-…`) after all 12 Study lessons + ~30% of Intermediate questions
- Shared profile layer: XP, levels, badges, streak (feeds both tracks)
- **Advanced** track exists in marketing as *coming soon* only

---

## Actual Intermediate curriculum (do not invent topics)

1. How developers solve problems  
2. Dictionaries & counting  
3. Sets & fast lookup  
4. Strings that parse data  
5. Tuples & records  
6. Comprehensions & clarity  
7. Functions in depth  
8. Errors & reliability  
9. Files & JSON data  
10. Stdlib for real work  
11. Classes & objects  
12. Debug, test, ship  

**Marketing capstone copy:** “JSON expense tracker” — present on landing/home as outcome framing. There is **no** Intermediate Final Challenge workspace like Beginner Lesson 10. Prefer “job-ready projects / portfolio tool” language carefully; do not show a fake project runner.

---

## Strongest selling points (verified)

1. Next step after beginner syntax — job / internship oriented Intermediate  
2. Same hands-on loop: Learn → Understand → Guided → Practice → Mini challenge  
3. Real browser Python compiler — write, run, see output  
4. Specs, edge cases, dicts, parsing, JSON, OOP, shipping mindset  
5. Instant practice feedback (MCQ, predict, fix, write code)  
6. Free forever / no card  
7. Intermediate unlock via short test or Beginner Functions  
8. Certificate + verify link when Intermediate requirements are met  

---

## Best UI screens to capture (desktop)

| Priority | Surface | URL |
|----------|---------|-----|
| High | Marketing hero | `/learnpython` |
| High | Intermediate path card | `/learnpython` (paths section) |
| High | Intermediate LMS home | `/learnpython/lms/intermediate` |
| High | Lesson Study (int-01 or int-02) | `/learnpython/lms/int-01?stage=notes` |
| High | Practice / write code | `?stage=practice` |
| High | Compiler run + output | `/learnpython/lms/compiler` |
| Medium | Examples playground | `?stage=examples` |
| Medium | Profile / progress | `/learnpython/lms/profile` |
| Optional | Certificate tab | profile `?tab=certificate` |

---

## Best interactive moments

1. Cursor typing → `print("Hello, World!")` morph into Intermediate environment  
2. Curriculum topic cascade (verified 12 titles)  
3. Opening Intermediate lesson Study deck  
4. Typing / editing code in playground or compiler  
5. Press Run → real output  
6. Correct / practice feedback chip  
7. Progress / Intermediate badge gold theme  

---

## Brand

| Token | Value |
|-------|--------|
| Font | Plus Jakarta Sans |
| Ink | `#1a231c` |
| Coral CTA | `#ff9a4d` |
| Sage (Beginner) | `#2f9e6e` |
| Intermediate accent | `#e0a83a` / `#ffd96a` |
| Intermediate hero | dark gold/brown gradient |
| Marketing hero | deep charcoal / forest |

Video direction: dark cinematic opening, gold Intermediate accent, coral CTA only where brand CTAs appear — stay aligned with Mentr, not a new neon brand.

---

## Must NOT advertise

- Python Advanced as available  
- Intermediate Final Challenge project workspace (expense tracker is marketing copy only)  
- Fake certificates, fake XP numbers, invented syllabus topics  
- Beginner-only features as Level 2 exclusive (e.g. quiz-game Final Challenge)  
- Stale blog claims that Intermediate is “not open yet”  

---

## Live site vs local

| Area | Status |
|------|--------|
| Landing Intermediate live messaging | Matches product |
| 12-lesson Intermediate syllabus on landing | Matches `learn-python-intermediate.ts` |
| Some SEO blog posts | Stale (“Intermediate not open”) — ignore for this film |
| Capstone expense tracker | Marketed; no Intermediate project runner in LMS |

---

## Local run notes

```bash
npm run dev   # Next :3000 + API :5000
npx tsx scripts/unlock-python-intermediate.ts <email>
```

LMS requires signed-in `parent` or `faculty`. OTP is logged to API console: `[otp] … code for email: ######`.
