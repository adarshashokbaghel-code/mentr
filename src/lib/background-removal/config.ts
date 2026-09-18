/**
 * Configurable limits for the browser background-removal pipeline.
 * Keep values here — do not scatter magic numbers in UI components.
 */

export const BG_REMOVAL = {
  /** Max upload size (bytes) */
  MAX_FILE_SIZE: 25 * 1024 * 1024,
  /** Max decoded width */
  MAX_WIDTH: 8000,
  /** Max decoded height */
  MAX_HEIGHT: 8000,
  /** Max width × height (decompression bomb guard) */
  MAX_PIXELS: 40_000_000,
  /** Desktop longest side after orientation normalize */
  MAX_PROCESS_SIDE: 2560,
  /** Mobile longest side — less RAM, faster WASM */
  MAX_PROCESS_SIDE_MOBILE: 1280,
  /** Low-end desktop / tablet */
  MAX_PROCESS_SIDE_LOW: 1600,
  /** Accepted MIME types (also verified by decode) */
  ACCEPTED_MIME: ["image/jpeg", "image/png", "image/webp"] as const,
  /**
   * Same-origin folder under /public/models/ (populated by scripts/fetch-bg-models.mjs).
   * Not the Hugging Face repo id — that is HF_FALLBACK_ID only.
   */
  MODEL_ID: "birefnet-lite-512",
  /** Remote fallback if local /models is missing (dev without fetch) */
  HF_FALLBACK_ID: "studioludens/birefnet-lite-512",
  MODEL_NAME: "BiRefNet_lite",
  MODEL_VERSION: "512-fp16+refine",
  PIPELINE_VERSION: "bg-pipeline-0.3",
  LICENSE_TAG: "MIT",
  /** Always fp16 graph (~94 MB) — never pull 192 MB fp32 on mobile */
  DTYPE: "fp16" as const,
  LOCAL_MODEL_PATH: "/models/",
  ORT_WASM_PATH: "/ort/",
  LOAD_RETRIES: 3,
} as const;

export type AcceptedMime = (typeof BG_REMOVAL.ACCEPTED_MIME)[number];
