/**
 * Background-removal model adapter contract.
 * Browser production path: worker.ts + studioludens/birefnet-lite-512 (MIT).
 * Do not load models from the Tools hub route — only /tools/background-remover.
 */

export type ImageInput = {
  /** Decoded RGBA bitmap width/height */
  width: number;
  height: number;
  /** Length = width * height * 4 */
  rgba: Uint8ClampedArray;
};

/** Continuous alpha matte in [0, 1], length = width * height */
export type AlphaMask = {
  width: number;
  height: number;
  alpha: Float32Array;
};

export type ModelInfo = {
  name: string;
  version: string;
  /** License short tag e.g. "MIT", "Apache-2.0", "CC-BY-NC-4.0" */
  licenseTag: string;
  /** Where inference runs */
  runtime: "browser" | "server" | "api";
};

export interface BackgroundRemovalModel {
  readonly info: ModelInfo;
  initialize(): Promise<void>;
  process(image: ImageInput): Promise<AlphaMask>;
  dispose(): Promise<void>;
}
