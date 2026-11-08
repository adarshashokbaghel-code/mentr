# Production notes

## Scope
- Desktop only: **1920×1080**, **30 FPS**, **900 frames**, H.264 + AAC
- Indian English VO: `en-IN-PrabhatNeural` (edge-tts), lightly time-stretched to ~29.9s
- Music: original low sine/pink-noise bed (not a commercial track)

## Product truth used
- Intermediate = 12 lessons from `src/lib/learn-python-intermediate.ts`
- Screenshots from live https://mentr.in/learnpython and local LMS (`localhost:3000`) with Intermediate unlocked
- Compiler output is a real Pyodide run (`Counter.most_common`)
- Did **not** advertise Advanced as available or invent Intermediate Final Challenge UI

## Reproduce
```bash
cd video
npm install
npm run render:preview   # preview encode
npm run render           # final launch encode
```

## QA account
Local capture used a disposable `video-qa-l2@mentr.local` parent account. Email is cropped/obscured in framing where possible; do not ship credentials.

## Contact sheet
After render, generate storyboard strip:
```bash
ffmpeg -y -i output/mentr-python-level-2-launch.mp4 -vf "fps=1/5,scale=320:-1,tile=6x1" output/storyboard.png
```
