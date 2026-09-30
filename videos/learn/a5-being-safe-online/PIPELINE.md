# A5 production notes

Built from detailed syllabus Module **A5 — Being Safe Online**  
Unit: **CS · How Computers Work** · Chapter **5 of 5** · Easy

## Teaching covered (syllabus)
- Never share full name + school + home together with strangers  
- Passwords are secrets — even from friends  
- Tell a trusted adult if a chat feels odd  

## Mentoring flow
Welcome → bridge from A1–A4 → chapter card → 3-shield preview → "who is really typing?" hook → Rule 1 private info (4 items → map to your door → OK-to-share vs keep-private) → safe/unsafe post game (3 posts, sorted into bins) → Rule 2 passwords (key + lock, secret from friends, weak vs strong meter, make-your-own tip) → stronger-password game → Rule 3 trusted adult (red flags, Stop / Don't reply / Tell, who to tell, telling is brave) → practice check (home address A/B/C) → recap (3 rules + never-post 3) → Unit 1 complete → quiz bridge  

## Pace and quality upgrades over A4
Class 3–5 found the slow, pause-heavy delivery boring, so A5 is tuned for energy:
- Voice `+12%` rate (A4: `-8%`) and `+2Hz` pitch → ~151 wpm overall vs ~108 wpm in A4
- `trimSilence`: TTS lead/tail silence removed per beat; `beatGap` 0.12s (was 0.22s)
- Think-time pauses capped at ~1s (A4 used up to 2.6s); no drawn-out "say… it… slowly" lines
- `voicePolish`: high-pass, presence EQ, gentle compression, loudness normalised to −16 LUFS (A4: −20.5)
- 30 fps (was 24), shorter 0.18s crossfades, x264 `slow` + CRF 16 + `tune animation`
- New `buzz` sound effect for unsafe/wrong answers
- New illustration kit: shield, padlock, key, chat phone with red-flag bubbles, people (kid, friend, mum, dad, teacher, nani, mystery), school, name tag, map pin, stop sign, social post card, password field + strength meter

Total runtime ~3.5 min (A4 was ~6 min).

## Watch
`/learn/app/lesson/A5`

## Notes
PDF notes via LMS "Notes" button (`A5_LESSON_NOTES`).

## Rebuild
```bash
.venv-video/bin/python scripts/learn-video/preview.py videos/learn/a5-being-safe-online   # contact sheet
.venv-video/bin/python scripts/learn-video/build.py videos/learn/a5-being-safe-online
```

## Voice
`en-IN-NeerjaExpressiveNeural` at `+12%` rate, `+2Hz` pitch.
