# Model & architecture comparison — Background Remover

**Date:** 2026-09-19  
**Phase:** 1 — Research (no UI, no production inference)  
**Companion:** [MODEL-LICENSES.md](./MODEL-LICENSES.md)

---

## 1. What already exists in Mentr

| Area | Finding | Implication |
|------|---------|-------------|
| Tools hub | Catalog + client PDF/study tools; browser-only privacy messaging | BG remover should be a **new catalog slug** + lazy route; do not load ML on `/tools` |
| Image utils | Canvas crop in `profile-image-uploader`; JPEG canvas encode in `tools-pdf` | Reuse canvas decode/encode patterns; **no** shared ML layer yet |
| PDF stack | `pdf-lib`, `pdfjs-dist` | Irrelevant to segmentation; keep separate |
| Hosting | Vercel frontend + Express API | **No GPU** today → Local Mode A must be browser OR new GPU host for Mode B |
| Storage | Supabase for mentor avatars | Mode B needs **new** short-TTL bucket + cleanup job — do not reuse profile bucket casually |
| Auth | Tools must stay **no-signup** | Optional CTAs only after download |
| Analytics | `trackToolEvent` / gtag | Extend with BG events; **never** send image bytes/filenames |

---

## 2. Processing modes (recommended)

### Mode A — Private / local (default)

```text
Browser → Web Worker → ONNX Runtime Web (WebGPU → WASM)
  → alpha matte → postprocess → RGBA PNG → download
```

- Claim “processed on your device” **only** for this path.
- Lazy-load model on `/tools/background-remover` first use.
- Cap pixels / resize for inference; restore resolution for export.

### Mode B — HD / server (optional, later)

```text
Browser → secure upload → GPU worker → pipeline → signed result URL → delete TTL
```

- Clear UI: “HD temporarily sends the image to Mentr’s processors.”
- Prefer commercial API (BRIA/fal) **or** self-hosted MIT BiRefNet on GPU — decide after cost + license.
- Vercel serverless alone is a poor fit for large models.

---

## 3. Candidate pipelines (quality × license × deploy)

| Rank | Approach | Quality (expected) | License for mentr.in | Latency / size | Verdict |
|------|----------|--------------------|----------------------|----------------|---------|
| 1 | **Official BiRefNet_lite → browser ONNX 512** (`studioludens/birefnet-lite-512`) | High (best practical in-browser) | MIT | ~94 MB fp16; WebGPU/WASM | **Shipped Mode A** |
| 2 | **U²-Net / U²-NetP ONNX** in worker | Medium | Apache-2.0 (verify ONNX provenance) | Smaller, faster | Baseline + mobile fallback |
| 3 | **BRIA API / fal** for HD only | High (vendor) | Commercial ToS | Network | Mode B candidate |
| 4 | BRIA RMBG-2.0 self-host | Very high (benchmark) | **NC — blocked** | GPU | Eval only under NC |
| 5 | `@imgly/background-removal` | Good DX | **AGPL — blocked** for MIT SaaS | Easy WebGPU | Do not depend unless relicensed |

---

## 4. Why not ship IMG.LY package as Mentr core

Mentr’s product is MIT and closed-source as a hosted service. AGPL-3.0 would require offering corresponding source for the network service that incorporates the library. That is a product-level conflict. Build an independent adapter around ORT Web + MIT/Apache weights instead.

---

## 5. Pipeline stages (independent, testable)

Regardless of model:

1. Decode + validate (MIME + decode, size/pixels caps)
2. EXIF orientation normalize
3. Resize for inference (keep aspect)
4. Segmentation → **continuous alpha** (no hard threshold)
5. Edge refinement (ablation-tested)
6. Color decontamination (optional switch)
7. Postprocess (light cleanup only)
8. Compose RGBA at target resolution
9. Optional HD upscale **after** cutout (benchmark first)

---

## 6. Benchmark (must precede model freeze)

Per PRD — do **not** tune on the final holdout.

| Item | Minimum | Preferred |
|------|---------|-----------|
| Images | 200 | 500+ |
| Categories | ≥10 | 20 |
| Holdout | ≥100 | 300 |
| Metrics | IoU, Dice, MAE, SAD, Boundary F1 | + human 1–5 |
| Dataset rights | Only images Mentr may use | No scraped copyrighted stock in public gallery |

Scaffold next (Phase 2): `ml/benchmark/` runner + empty `docs/ml/BENCHMARK-METHODOLOGY.md` — **before** polished UI.

---

## 7. Smallest implementation plan (after this research)

### Phase 2 — Benchmark infrastructure (next)

1. Adapter interface (`BackgroundRemovalModel`)
2. Dataset layout + manifest (rights-cleared stub images only)
3. Metrics + `run` / `compare` scripts (Python or Node)
4. Report JSON schema (no fabricated numbers)

### Phase 3 — Model evaluation

1. Convert / obtain ONNX for BiRefNet (MIT) + U²-Net
2. Run on **dev/val** only
3. Score license + latency + category quality
4. Freeze candidate for holdout

### Phase 4 — Production pipeline

1. Postprocess modules with ablation flags
2. Web Worker + ORT Web
3. Config: `MAX_FILE_SIZE`, `MAX_PIXELS`, etc.

### Phase 5 — Frontend (only then)

1. `/tools/background-remover` upload / preview / download
2. Accurate Mode A privacy copy
3. Catalog card under Image Tools
4. Related: Images→PDF, Compress PDF (when image compressor exists)

### Phase 6–8 — HD, quality page, hardening

As in PRD; HD only after cutout quality gates pass.

---

## 8. Explicit non-goals (now)

- No polished BG remover UI in this phase
- No production model download in the Next app
- No claims vs remove.bg
- No AGPL dependency
- No self-hosted RMBG-2.0 without commercial license
- No DIS5K images in public benchmarks

---

## 9. Open decisions for stakeholders

1. **Budget for Mode B?** (BRIA/fal API vs own GPU)
2. **Accept BiRefNet download size** on first visit (~tens–hundreds of MB) vs always-server HD?
3. **Who owns benchmark image licensing?** (commissioned / CC0 / licensed stock)
4. **Legal review** of chosen ONNX checksum before launch

---

## 10. Recommendation

**Proceed to Phase 2 (benchmark + adapters) with:**

- **Eval / quality ceiling:** RMBG-2.0 under NC or paid API (not unpaid self-host)
- **Commercial local candidate:** Official **BiRefNet (MIT)** ONNX
- **Latency fallback:** **U²-NetP** ONNX
- **Do not** integrate `@imgly/background-removal` into production Mentr without a commercial IMG.LY license
