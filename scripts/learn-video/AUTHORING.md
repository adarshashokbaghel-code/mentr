# Authoring a Learn lesson video

Every lesson is two files. Nothing else needs to change; `build.py` picks them up.

| File | What it holds |
| --- | --- |
| `videos/learn/<id>-<slug>/scenes.json` | Script: scenes → beats (voice line, caption, focus, sfx) |
| `scripts/learn-video/lessons/<id>.py` | Visuals: `render(draw, brand, visual, focus, progress, w, h) -> bool` |

`<id>` is lower-case (`a7`, `b12`, `c3`); `<slug>` comes from `getLessonMeta` (e.g. `a7-sequencing`).
All visuals in a lesson are named `<id>-<name>` (e.g. `a7-hook`) so they route to that lesson's file.

Reference lesson: **A6** — `videos/learn/a6-what-is-an-algorithm/scenes.json` and `render_a6` in `build.py`.
Copy its settings block exactly (voice, `voiceRate: "+4%"`, `voicePitch: "+1Hz"`, `beatGap: 0.34`,
`fadeSec: 0.26`, `crf`, `supersample: 2`, `brand`, …). Change only `id`, `title`, `chapterLabel`,
`unitLabel` (short form, e.g. `"AI · How Machines Learn"`), `slug`, `track` (`cs` / `ai` / `math`), and `scenes`.

## What the script must cover

Source of truth for each lesson, all keyed by the module id:

- `src/lib/learn-content/*.ts` — notes (big idea, key words, panels, remember, check-yourself) and the
  10 quiz questions. Every idea the quiz asks about must be taught clearly in the video.
- `src/lib/learn-module-details.ts` — topics, outcomes, checkpoint.

Shape (≈10–12 scenes, 6–7 minutes, **800–950 spoken words**):

1. **open** — warm hello, one line linking back to the previous chapter, today's unit + chapter, a curiosity hook.
2. **hook story** — a small relatable situation (Indian kid context: home, school, chai, cricket, auto, tiffin…)
   that creates the question the lesson answers. Leave a thinking pause.
3. **define** — the core idea in one simple sentence, then unpack it slowly.
4. **3–5 teaching scenes** — each one idea with a concrete everyday example; show, then explain why.
5. **1–2 interactive scenes** — "find the mistake", "what comes next?", "sort these": ask, pause 2s, reveal.
6. **checkpoint** — the module checkpoint as a practice task ("pause and try on paper"), then one model answer.
7. **recap** — 4 short remember lines, "Chapter k done!", then "Tap Finish, and try the quiz."

## Voice: humanized, not read aloud

- Talk *to* one child ("champ"), like a kind older sibling. Contractions, small reactions ("Hmm.", "Oh no!", "Yum.").
- Short sentences. One idea per sentence. Commas where a person would breathe.
- Ask, then wait: put `"pause": 1.8`–`2.5` on beats that ask the child to think; `0.4–0.6` after a dramatic line.
- Explain *why*, not just *what*. Revisit the story character later ("Remember Robo?").
- Never use symbols or abbreviations in `vo` (write "Unit two", "equals", "and", "percent"); arrows and
  `·` are fine in captions only.
- No jargon without a kid-sized meaning right after it.

## Beats

```json
{ "vo": "spoken line", "caption": "≤ 52 chars, a summary not a transcript", "focus": "name",
  "sfx": "pop|chime|whoosh|tick|success|buzz", "sfxAt": 0.0-1.0, "pause": 0.0 }
```

`focus` picks what the visual shows for that beat; `progress` runs 0→1 across the beat, so animate with it
(stagger items in as the voice lists them; reveal answers early in the answer beat). Use sfx sparingly — about one beat in two.

## Visual rules (1920×1080)

- Content lives in **y ≈ 220–880**. The top bar is above, the caption bar starts at y≈900, and scene dots sit top-right (x > 1500, y < 160).
- Every (visual, focus) in the script must return `True` — `preview.py` reports any that don't.
- No text over text: decorative stars/sparkles go in empty space (`stars_at` in A6 shows the pattern).
- Large, bold, readable: titles 72–90px, labels 30–40px, nothing under 26px.
- Draw real illustrations with the kit, not just text cards. Each scene should look different from the last.
- Use the brand colours (`hex_rgb(brand[...])`) plus kit constants (`GOLD`, `DANGER`, `BOTH_COLOR`, `BOT`, `LEAF`, …).

### Kit (all in `build.py`; use via `import build as K`)

- Layout/text: `shadow_card`, `pill`, `text_at`, `wrap_text`, `load_font(size, bold)`, `draw_bubble`,
  `rounded_rect`, `draw_arrow`, `draw_dashed`, `draw_curve`, `qbez`.
- Motion: `clamp01`, `stagger(progress, i, step, speed)`, `ease_out_cubic`, `ease_in_out`, `lerp`.
- Marks: `draw_check`, `draw_cross`, `draw_star`, `draw_heart`, `draw_shield`, `draw_padlock`, `draw_key`,
  `draw_red_flag`, `draw_stop_sign`, `draw_meter`, `draw_magnifier`, `draw_notes`, `sound_waves`.
- Characters: `draw_mascot` (Mentr dino), `draw_robot(mood, wave, hold)`, `draw_person(kind)`, `draw_face`.
- Things: `draw_device(kind)` (laptop, keyboard, mouse, printer, speaker, mic, camera, … — see its `kind ==` branches), `draw_browser`,
  `draw_server`, `draw_router`, `draw_tower`, `draw_house`, `draw_school`, `draw_shop`, `draw_envelope`,
  `draw_page`, `draw_stopwatch`, `draw_spinner`, `draw_chat`, `draw_post`, `draw_field`, `draw_map_pin`,
  `draw_glass`, `draw_filter`, `draw_pot`, `draw_cup`, `draw_steam`, `draw_leaves`, `draw_milk`,
  `draw_toothbrush`, `draw_shower`, `draw_shirt`, `draw_bag`, `draw_tiffin`, `draw_plant`, `draw_can`,
  `draw_feet`, `draw_bread`, `a6_icon(kind)`.

Read a helper's source before using it to learn its anchor point and size at `s=1`. New illustrations
go in your lesson file as local helpers (draw with `draw.rectangle/rounded_rectangle/ellipse/polygon/line/arc/pieslice/text`).

Lesson file skeleton:

```python
"""A7 · Sequencing — visuals."""
import math
import build as K


def render(draw, brand, visual, focus, progress, w, h) -> bool:
    ink = K.hex_rgb(brand["ink"])
    coral = K.hex_rgb(brand["coral"])
    cx = w / 2
    appear = K.ease_out_cubic(min(1.0, progress * 3.0))
    lift = int((1 - appear) * 40)

    if visual == "a7-welcome":
        if focus == "hello":
            ...
            return True
    return False
```

## Check your work (no network needed)

```bash
.venv-video/bin/python scripts/learn-video/preview.py videos/learn/a7-sequencing        # progress 0.8
.venv-video/bin/python scripts/learn-video/preview.py videos/learn/a7-sequencing 0.15   # entry state
```

Open the contact sheet and check every frame: nothing clipped, overlapping, or under the caption bar,
and the visual matches what the voice says. The output also reports word count, estimated minutes, and any
PROBLEM lines (both must be clean). Delete `_preview*.png` when done.

## Build

```bash
.venv-video/bin/python scripts/learn-video/build_all.py A          # every CS lesson not yet built
.venv-video/bin/python scripts/learn-video/build_all.py A7 A8      # specific lessons
```

The build needs network (Edge TTS). It publishes to `public/learn/lessons/<ID>.{mp4,vtt,transcript.json}` and
records the duration in `src/lib/learn-video-manifest.json`, which unlocks the video on the site.
