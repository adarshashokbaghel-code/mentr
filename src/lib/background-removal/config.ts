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
  /** Longest side after orientation normalize (more pixels → better refine crop) */
  MAX_PROCESS_SIDE: 2560,
  /** Accepted MIME types (also verified by decode) */
  ACCEPTED_MIME: ["image/jpeg", "image/png", "image/webp"] as const,
  /** Model id — MIT BiRefNet_lite browser export @ 512² */
  MODEL_ID: "studioludens/birefnet-lite-512",
  MODEL_NAME: "BiRefNet_lite",
  MODEL_VERSION: "512-fp16+refine",
  PIPELINE_VERSION: "bg-pipeline-0.2",
  LICENSE_TAG: "MIT",
} as const;

export type AcceptedMime = (typeof BG_REMOVAL.ACCEPTED_MIME)[number];
