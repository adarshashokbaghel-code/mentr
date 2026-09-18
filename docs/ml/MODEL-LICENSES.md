# Model licenses — Background Remover candidates

**Status:** Production candidate selected for Mode A (local browser).  
**Last reviewed:** 2026-09-19  
**Product:** Mentr Tools · Free Background Remover  
**Rule:** Do not ship a model until this row is marked **Production-ready** with legal sign-off.

### Production Mode A (shipped)

| Field | Value |
|-------|--------|
| Model | BiRefNet_lite (browser 512×512 ONNX) |
| Version | `studioludens/birefnet-lite-512` fp16 (~94 MB) |
| Repository | https://huggingface.co/studioludens/birefnet-lite-512 |
| Weights source | Derived from ZhengPeng7/BiRefNet_lite (MIT) |
| Code license | MIT (upstream + export) |
| Weights license | MIT |
| Commercial use allowed? | **Yes** under MIT |
| Redistribution allowed? | Yes (MIT) |
| Attribution required? | Retain MIT notices; cite BiRefNet paper |
| Production status | **Shipped — Mode A local** (`bg-pipeline-0.1`) |
| Notes | 512² inference then bilinear alpha upsample. WebGPU → WASM fallback. Not RMBG-2.0. HD / server Mode B not enabled. |

Licenses change. Re-verify before launch. Prefer primary sources (Hugging Face card, GitHub LICENSE, vendor commercial terms).

---

## Summary matrix

| Model | Code license | Weights license | Commercial self-host? | Browser-friendly? | Production status |
|-------|--------------|-----------------|----------------------|-------------------|-------------------|
| ZhengPeng7 / BiRefNet (official) | MIT | MIT (HF card) | **Likely yes** (verify checkpoint) | Possible via ONNX/ORT Web | **Primary candidate** |
| **studioludens / birefnet-lite-512** | MIT | MIT | **Yes** | **Yes (WebGPU/WASM)** | **Mode A shipped** |
| BRIA RMBG-2.0 | Source-available | **CC BY-NC 4.0 / BRIA terms** | **No** without BRIA commercial agreement | Heavy (server/API) | **Benchmark / API only** |
| U²-Net (Qin et al.) | Apache-2.0 | Apache-2.0 (author statement) | **Likely yes**; check training-set terms | Yes (ONNX) | **Strong local candidate** |
| IS-Net / DIS (`isnet-general-use`) | Apache-2.0 (code + metrics) | **Unclear / separately distributed** | **Do not assume** — open request #150 | Used by imgly stack | **Blocked pending clarification** |
| `@imgly/background-removal` | **AGPL-3.0** | Bundled ISNet ONNX via IMG.LY CDN | AGPL copyleft or commercial license from IMG.LY | **Yes (WebGPU/WASM)** | **Legal risk for MIT product** |
| rembg (CLI/lib) | MIT | **Per upstream model** | Depends on chosen model | Server/Python | Glue only — not a model |
| BRIA / fal / Replicate APIs | N/A (SaaS) | Commercial API terms | Yes (paid) | N/A (server) | **HD / fallback path** |

---

## Detailed entries

### 1. BiRefNet (ZhengPeng7) — official

| Field | Value |
|-------|--------|
| Model | BiRefNet (and task variants) |
| Version | Track HF / GitHub release tag at selection time |
| Repository | https://github.com/ZhengPeng7/BiRefNet |
| Weights source | https://huggingface.co/ZhengPeng7/BiRefNet |
| Code license | MIT |
| Weights license | MIT (Hugging Face `license: mit`) |
| Commercial use allowed? | **Yes**, under MIT (retain copyright notice) |
| Redistribution allowed? | Yes (MIT) |
| Attribution required? | Retain license + copyright; cite paper for academic honesty |
| Production status | **Candidate for self-hosted / converted ONNX** |
| Notes | Architecture also used by RMBG-2.0; **do not confuse** official MIT BiRefNet weights with BRIA’s fine-tuned RMBG-2.0 weights (NC). Prefer official ZhengPeng7 checkpoints for commercial self-host. ONNX export exists in upstream tutorials. Inference memory ~5.5G+ GPU for 1024² (author notes) — browser export must use quantized/smaller variants. |

---

### 2. BRIA RMBG-2.0

| Field | Value |
|-------|--------|
| Model | RMBG-2.0 |
| Version | 2.0 |
| Repository | https://github.com/Bria-AI/RMBG-2.0 |
| Weights source | https://huggingface.co/briaai/RMBG-2.0 |
| Code license | Source-available (see repo) |
| Weights license | **CC BY-NC 4.0** / BRIA Hugging Face model license agreement |
| Commercial use allowed? | **No** for self-hosted weights without commercial agreement |
| Redistribution allowed? | Restricted under NC / BRIA terms |
| Attribution required? | Yes under CC BY-NC |
| Production status | **Not for unpaid commercial self-host on mentr.in** |
| Notes | Soft alpha matte (8-bit grayscale) — excellent **quality benchmark** target. Commercial path: BRIA API / fal.ai / Replicate packages. Use only for evaluation under NC or under paid API. |

---

### 3. U²-Net

| Field | Value |
|-------|--------|
| Model | U²-Net / U²-NetP |
| Version | Upstream release |
| Repository | https://github.com/xuebinqin/U-2-Net |
| Weights source | Upstream GDrive / rembg downloads |
| Code license | Apache-2.0 |
| Weights license | Apache-2.0 per author (Issue #208); **training datasets** may have separate terms |
| Commercial use allowed? | **Likely yes** for weights under Apache; confirm dataset/provenance for the exact ONNX file used |
| Redistribution allowed? | Yes under Apache-2.0 with NOTICE obligations |
| Attribution required? | Apache NOTICE + paper citation recommended |
| Production status | **Candidate for local browser/server ONNX** |
| Notes | Soft masks vary by checkpoint; quality typically below modern BiRefNet/RMBG on hard edges. Good baseline for regression and latency. rembg MIT covers **code only**, not weights. |

---

### 4. IS-Net / DIS (`isnet-general-use`)

| Field | Value |
|-------|--------|
| Model | IS-Net general-use |
| Version | DIS repo release (2022+) |
| Repository | https://github.com/xuebinqin/DIS |
| Weights source | Google Drive / Baidu (separate from LICENSE.md) |
| Code license | Apache-2.0 (**code and evaluation metric**) |
| Weights license | **Not clearly stated** for `isnet-general-use.pth` |
| Commercial use allowed? | **Unresolved** — commercial permission request open (DIS #150, Aug 2026) |
| Redistribution allowed? | Unclear for weights |
| Attribution required? | Cite ECCV 2022 paper if used |
| Production status | **Do not ship until written permission or clear weights license** |
| Notes | DIS5K dataset ToU is non-commercial — do **not** use DIS5K images in public Mentr benchmarks. imgly’s browser package ships ISNet ONNX under AGPL product terms. |

---

### 5. `@imgly/background-removal` (IMG.LY)

| Field | Value |
|-------|--------|
| Model | Package wrapping ISNet ONNX + ORT Web |
| Version | npm `@imgly/background-removal` (track current) |
| Repository | https://github.com/imgly/background-removal-js |
| Weights source | IMG.LY CDN / `@imgly/background-removal-data` |
| Code license | **AGPL-3.0** |
| Weights license | Distributed with package; commercial alternatives via IMG.LY sales |
| Commercial use allowed? | Only if Mentr complies with **AGPL** (source offer for network use) **or** obtains a proprietary license from IMG.LY |
| Redistribution allowed? | Under AGPL |
| Attribution required? | AGPL notices |
| Production status | **Incompatible with closed MIT SaaS unless relicensed** |
| Notes | Excellent DX (WebGPU/WASM). Mentr is MIT-licensed product on mentr.in — AGPL would force source disclosure of derivative network service. Prefer independent ONNX + ORT Web under Apache/MIT models instead of vendoring this package. |

---

### 6. rembg

| Field | Value |
|-------|--------|
| Model | N/A (orchestrator) |
| Repository | https://github.com/danielgatis/rembg |
| Code license | MIT |
| Weights license | Per model (U²-Net, IS-Net, etc.) |
| Commercial use allowed? | Code yes; models separately |
| Production status | Optional **offline benchmark runner** glue |
| Notes | Do not treat rembg’s MIT as clearing IS-Net weights. |

---

### 7. Commercial APIs (HD / server mode)

| Field | Value |
|-------|--------|
| Options | BRIA API, fal.ai `bria/background/remove`, Replicate `bria/remove-background`, others |
| License | Paid commercial ToS |
| Commercial use allowed? | Yes under vendor ToS |
| Production status | Candidate for **Mode B (HD)** only |
| Notes | Disclose to users that images leave the device. No permanent storage; TTL delete. Do not log image bytes. Cost & rate limits apply. |

---

## Upscaling (HD stage) — separate license review

HD enhancement must be licensed independently (e.g. Real-ESRGAN and variants). Track in this file before enabling HD 2×/4×. Do not advertise “creates real missing detail.”

| Model | Status |
|-------|--------|
| Real-ESRGAN family | **TODO before HD launch** — verify code + weights licenses for commercial use |

---

## Mentr product constraints (from repo)

- App: Next.js 16 on **Vercel** (`@vercel/analytics`); API Express + MongoDB.
- **No GPU workers** in current deploy; Vercel serverless `maxDuration` ~30s.
- Existing Tools: **browser-first** (`pdf-lib`, `pdfjs-dist`); privacy copy must match reality.
- Storage today: Supabase used for **mentor profile photos only** — not a general image ML pipeline.
- Product license: **MIT** — avoid AGPL dependencies in production path.

---

## Legal checklist before production

- [ ] Chosen weights license reviewed by human (not only this doc)
- [ ] Checkpoint hash recorded
- [ ] Attribution / NOTICE files wired
- [ ] AGPL packages excluded from default prod path
- [ ] NC-only models excluded from unpaid self-host
- [ ] Benchmark dataset rights documented separately
- [ ] Privacy copy matches Mode A vs Mode B
