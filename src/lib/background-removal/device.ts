/**
 * Device heuristics for Background Remover (main thread + mirrored in worker).
 */

export type BgDeviceProfile = {
  mobile: boolean;
  lowEnd: boolean;
  /** Prefer WASM; WebGPU on many phones creates flaky "Failed to create pipeline" */
  preferWasm: boolean;
  /** Skip crop-and-refine second pass */
  skipRefine: boolean;
  /** Longest side for working canvas */
  maxProcessSide: number;
};

export function detectBgDeviceProfile(
  nav: Pick<Navigator, "userAgent" | "hardwareConcurrency"> & {
    deviceMemory?: number;
    maxTouchPoints?: number;
  } = typeof navigator !== "undefined"
    ? navigator
    : { userAgent: "", hardwareConcurrency: 4 },
): BgDeviceProfile {
  const ua = nav.userAgent || "";
  const mobile =
    /Android|iPhone|iPad|iPod|Mobile|webOS|BlackBerry|IEMobile|Opera Mini/i.test(
      ua,
    ) || (typeof nav.maxTouchPoints === "number" && nav.maxTouchPoints > 1 && /Mac/.test(ua));

  const mem = nav.deviceMemory; // GiB, Chrome only
  const cores = nav.hardwareConcurrency || 4;
  const lowEnd =
    mobile || (typeof mem === "number" && mem <= 4) || cores <= 4;

  return {
    mobile,
    lowEnd,
    preferWasm: mobile || (typeof mem === "number" && mem <= 4),
    skipRefine: mobile || (typeof mem === "number" && mem <= 4),
    maxProcessSide: mobile ? 1280 : lowEnd ? 1600 : 2560,
  };
}

/** Map ORT / transformers errors to short user-facing copy. */
export function friendlyBgError(raw: string): string {
  const m = raw.toLowerCase();
  if (
    m.includes("failed to create") ||
    m.includes("create pipeline") ||
    m.includes("inference session") ||
    m.includes("session")
  ) {
    return "Couldn't finish setup on this device. Tap retry — we'll use a lighter path.";
  }
  if (
    m.includes("network") ||
    m.includes("fetch") ||
    m.includes("load") ||
    m.includes("download") ||
    m.includes("failed to fetch")
  ) {
    return "Download interrupted (slow network). Keep this tab open and tap retry.";
  }
  if (m.includes("memory") || m.includes("oom") || m.includes("out of memory")) {
    return "This phone is low on memory. Try a smaller photo or close other apps.";
  }
  if (m.includes("cancelled") || m.includes("abort")) {
    return "Cancelled.";
  }
  return raw.length > 120 ? "Something went wrong. Please try again." : raw;
}
