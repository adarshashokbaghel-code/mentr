import { BG_REMOVAL, type AcceptedMime } from "@/lib/background-removal/config";

export class ImageValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ImageValidationError";
  }
}

function sniffMime(bytes: Uint8Array): AcceptedMime | null {
  if (bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) {
    return "image/jpeg";
  }
  if (
    bytes.length >= 8 &&
    bytes[0] === 0x89 &&
    bytes[1] === 0x50 &&
    bytes[2] === 0x4e &&
    bytes[3] === 0x47
  ) {
    return "image/png";
  }
  // RIFF....WEBP
  if (
    bytes.length >= 12 &&
    bytes[0] === 0x52 &&
    bytes[1] === 0x49 &&
    bytes[2] === 0x46 &&
    bytes[3] === 0x46 &&
    bytes[8] === 0x57 &&
    bytes[9] === 0x45 &&
    bytes[10] === 0x42 &&
    bytes[11] === 0x50
  ) {
    return "image/webp";
  }
  return null;
}

export type ValidatedImage = {
  file: File;
  mime: AcceptedMime;
  width: number;
  height: number;
  /** Orientation-normalized, optionally downscaled working blob (PNG) */
  processBlob: Blob;
  processWidth: number;
  processHeight: number;
  /** Object URL for original preview (caller must revoke) */
  previewUrl: string;
};

/**
 * Validate MIME via magic bytes + decode, normalize EXIF orientation,
 * and downscale oversized images for safe browser processing.
 */
export async function validateAndNormalizeImage(
  file: File,
): Promise<ValidatedImage> {
  if (file.size <= 0) {
    throw new ImageValidationError("Empty file.");
  }
  if (file.size > BG_REMOVAL.MAX_FILE_SIZE) {
    throw new ImageValidationError(
      `File is too large (max ${Math.round(BG_REMOVAL.MAX_FILE_SIZE / (1024 * 1024))} MB).`,
    );
  }

  const buf = new Uint8Array(await file.arrayBuffer());
  const sniffed = sniffMime(buf);
  if (!sniffed) {
    throw new ImageValidationError(
      "Unsupported or corrupted image. Use JPG, PNG, or WEBP.",
    );
  }

  let bitmap: ImageBitmap;
  try {
    bitmap = await createImageBitmap(new Blob([buf], { type: sniffed }), {
      imageOrientation: "from-image",
    });
  } catch {
    throw new ImageValidationError("Could not decode this image.");
  }

  const width = bitmap.width;
  const height = bitmap.height;
  if (width < 2 || height < 2) {
    bitmap.close();
    throw new ImageValidationError("Image is too small.");
  }
  if (width > BG_REMOVAL.MAX_WIDTH || height > BG_REMOVAL.MAX_HEIGHT) {
    bitmap.close();
    throw new ImageValidationError(
      `Image dimensions exceed ${BG_REMOVAL.MAX_WIDTH}×${BG_REMOVAL.MAX_HEIGHT}.`,
    );
  }
  if (width * height > BG_REMOVAL.MAX_PIXELS) {
    bitmap.close();
    throw new ImageValidationError("Image has too many pixels.");
  }

  const scale = Math.min(
    1,
    BG_REMOVAL.MAX_PROCESS_SIDE / Math.max(width, height),
  );
  const processWidth = Math.max(1, Math.round(width * scale));
  const processHeight = Math.max(1, Math.round(height * scale));

  const canvas = document.createElement("canvas");
  canvas.width = processWidth;
  canvas.height = processHeight;
  const ctx = canvas.getContext("2d", { alpha: true });
  if (!ctx) {
    bitmap.close();
    throw new ImageValidationError("Canvas unavailable.");
  }
  ctx.drawImage(bitmap, 0, 0, processWidth, processHeight);
  bitmap.close();

  const processBlob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (b) => (b ? resolve(b) : reject(new Error("encode failed"))),
      "image/png",
    );
  });

  const previewUrl = URL.createObjectURL(file);

  return {
    file,
    mime: sniffed,
    width,
    height,
    processBlob,
    processWidth,
    processHeight,
    previewUrl,
  };
}

export function resolutionBucket(w: number, h: number): string {
  const side = Math.max(w, h);
  if (side <= 512) return "512";
  if (side <= 1024) return "1024";
  if (side <= 1920) return "1920";
  if (side <= 2048) return "2048";
  return "4k+";
}
