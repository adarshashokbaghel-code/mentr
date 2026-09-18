# Benchmark methodology — Background Remover

**Status:** Runnable Quality Lab in-app; public scores pending first scored set.  
**Benchmark version:** `BR-0.1` (stub) → `BR-1.0` after ≥50 holdout-ready images.

## Principles

1. Development / validation / **frozen holdout** — never tune on holdout.
2. Only images Mentr has rights to evaluate (and display, if public).
3. Report metrics + human review + model/pipeline version + date.
4. No fabricated scores on `/tools/background-remover/quality`.

## How to test quality (now)

### 1. In-app Quality Lab

`/tools/background-remover` → process image → **Quality Lab** → upload ground-truth mask → MAE / IoU / Dice.

### 2. Human review sheet

Score 1–5: completeness, edges, hair/fur, halo, overall. Soft launch bar: average ≥ 3.5 on ≥20 mixed images.

### 3. Optional academic sets

- [alphamatting.com](https://alphamatting.com/) — trimap matting (different task)
- AIM-500 / PPM-100 / P3M — research portrait matting (check licenses)

Prefer a **Mentr-owned** set for product claims.

## Metrics

| Metric | Better | Notes |
|--------|--------|-------|
| MAE | Lower | Soft alpha vs GT |
| MSE | Lower | Penalizes large errors |
| SAD | Lower | Size-dependent; also report normalized |
| IoU | Higher | Threshold 0.5 |
| Dice | Higher | Threshold 0.5 |
| Human 1–5 | Higher | Required for launch narrative |

## Dataset layout

See `ml/benchmark/README.md` and `ml/benchmark/dataset/`.

## Publishing scores

1. Score ≥20 (prefer 50+) rights-cleared images in Quality Lab or batch script.
2. Run human review on the same set.
3. Write `docs/ml/reports/quality-report-v0.2.json` (never overwrite older reports).
4. Fill real numbers — the quality page reads the latest report.

## Version under test

- Model: `studioludens/birefnet-lite-512` (MIT BiRefNet_lite)
- Pipeline: `bg-pipeline-0.1`
- Runtime: WebGPU → WASM, on-device
