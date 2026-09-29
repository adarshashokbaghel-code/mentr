# A4 production notes

Built from detailed syllabus Module **A4 — How Websites Talk to Each Other**  
Unit: **CS · How Computers Work** · Chapter **4 of 5** · Easy

## Teaching covered (syllabus)
- The internet is many computers asking and answering  
- A website is like a shop with an address (URL)  
- Wi-Fi and mobile data are just roads the questions travel on  

## Mentoring flow
Welcome → bridge from A1–A3 → chapter card → say-with-me → "where does the cartoon come from?" hook → internet as a network (askers vs servers) → website = shop, URL = address (mentr.com parts) → roads (Wi-Fi router, mobile towers, roads only carry) → 5-step trip of a web page (type → request → find → send back → appears, < 1 second) → order-the-steps game → video streaming + buffering → practice check → recap → quiz bridge  

## Quality upgrades over A3
- 2× supersampled rendering (`"supersample": 2`) → smooth anti-aliased edges and text
- Synthesised sound effects per beat (`"sfx"`: pop / whoosh / chime / success / tick, `"sfxAt"` = when in the beat)
- Parallel frame rendering across CPU cores (much faster builds)
- New illustration kit: server rack, router + Wi-Fi, mobile tower, browser with typing URL, shop, house, envelope (request), web page, network map, stopwatch, buffering spinner, snail

## Watch
`/learn/app/lesson/A4`

## Notes
PDF notes via LMS "Notes" button (`A4_LESSON_NOTES`).

## Rebuild
```bash
.venv-video/bin/python scripts/learn-video/build.py videos/learn/a4-how-websites-talk
```

## Voice
`en-IN-NeerjaExpressiveNeural` at `-8%` rate.
