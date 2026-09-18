# Background removal benchmark (Mentr)

**Goal:** Measure quality before publishing claims — no fabricated numbers.

## What you can do this week (practical)

### A) In-app Quality Lab (fastest)

1. Open `/tools/background-remover`
2. Expand **Quality Lab**
3. Upload a photo → get a cutout
4. Upload a **ground-truth mask** (grayscale PNG or transparent PNG)
5. Read MAE / IoU / Dice on that image

Repeat for ~20–50 images you own. Log scores in a spreadsheet.

### B) Human review (required for publish)

For each image score 1–5 on:

| Criterion | 1 | 5 |
|-----------|---|---|
| Foreground complete | Missing subject | Full subject |
| Edge quality | Jagged / wrong | Clean |
| Hair / fur | Chopped | Preserved |
| Halo | Strong color spill | None |
| Overall usable | No | Yes |

Average ≥ **3.5** on a mixed set of ≥20 images is a reasonable soft launch bar.

### C) Side-by-side (manual, not for marketing claims)

Same photo → Mentr vs remove.bg / PhotoRoom / Canva.

**Do not** publish “better than X” unless you use the same images, same rules, and document the method.

## Rights-cleared dataset (required for public scores)

Put only images Mentr may use:

```text
ml/benchmark/dataset/
  images/     # original RGB
  masks/      # ground-truth alpha (grayscale or RGBA)
  metadata/   # optional *.json
  manifest.json
```

Sources that are usually OK:

- Photos you shoot yourself
- Explicitly licensed stock (check commercial + derivative rights)
- CC0 / public domain with attribution if required

**Avoid** for public gallery / published numbers:

- Random scraped web images
- DIS5K in a **public** gallery (dataset terms are restrictive — see MODEL-LICENSES.md)

## Academic / website benchmarks (optional)

| Resource | Use for | Note |
|----------|---------|------|
| [alphamatting.com](https://alphamatting.com/) | Classic matting SAD/MSE | Needs **trimaps** — not the same as auto BG remove |
| AIM-500 / PPM-100 / P3M | Portrait / automatic matting papers | Good for research; check licenses before public reuse |
| Your own 50–200 images | Product launch | **Best** for Mentr claims |

## Publish bar (before `/quality` shows numbers)

- [ ] ≥ 20 rights-cleared images (prefer 50+)
- [ ] ≥ 5 categories (people, hair, product, animal, complex BG, …)
- [ ] Automated MAE + IoU + Dice logged
- [ ] Human review on the same set
- [ ] Model id + pipeline version recorded (`BiRefNet_lite` / `bg-pipeline-0.1`)
- [ ] Failure cases noted honestly
- [ ] Report file under `docs/ml/reports/` (never overwrite)

Until then, the public quality page explains **methodology only** — no fake scores.

## Report template

Save as `docs/ml/reports/quality-report-v0.1.json` after a real run:

```json
{
  "benchmarkVersion": "BR-0.1",
  "pipeline": "bg-pipeline-0.1",
  "model": "studioludens/birefnet-lite-512",
  "date": "2026-09-19",
  "nImages": 0,
  "overall": { "mae": null, "iou": null, "dice": null },
  "humanOverallAvg": null,
  "notes": "Fill after first scored set."
}
```
