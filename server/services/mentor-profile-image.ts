import { randomUUID } from "crypto";
import {
  ensureMentorProfileBucket,
  getSupabaseAdmin,
  publicObjectUrl,
} from "../lib/supabase";
import { MENTOR_PROFILE_BUCKET } from "../lib/supabase-secrets";

const ALLOWED_MIME = new Set(["image/jpeg", "image/png", "image/webp"]);
const MAX_BYTES = 2 * 1024 * 1024;

const EXT_BY_MIME: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

export type MentorImageUploadResult = {
  profileImageUrl: string;
  profileImagePath: string;
};

function parseDataUrl(input: string): { mime: string; buffer: Buffer } | null {
  const trimmed = input.trim();
  const match = /^data:(image\/(?:jpeg|png|webp));base64,([A-Za-z0-9+/=\s]+)$/i.exec(
    trimmed,
  );
  if (match) {
    const mime = match[1]!.toLowerCase();
    const buffer = Buffer.from(match[2]!.replace(/\s/g, ""), "base64");
    return { mime, buffer };
  }
  // Raw base64 + separate mime handled by caller
  return null;
}

export function decodeMentorImagePayload(opts: {
  imageBase64: string;
  mimeType?: string;
}): { mime: string; buffer: Buffer } | { error: string } {
  const raw = String(opts.imageBase64 || "").trim();
  if (!raw) return { error: "Image data is required" };

  const fromDataUrl = parseDataUrl(raw);
  if (fromDataUrl) {
    if (!ALLOWED_MIME.has(fromDataUrl.mime)) {
      return { error: "Only JPEG, PNG, or WebP images are allowed" };
    }
    if (fromDataUrl.buffer.length === 0) return { error: "Image is empty" };
    if (fromDataUrl.buffer.length > MAX_BYTES) {
      return { error: "Image must be under 2 MB" };
    }
    return fromDataUrl;
  }

  const mime = String(opts.mimeType || "image/jpeg").toLowerCase().trim();
  if (!ALLOWED_MIME.has(mime)) {
    return { error: "Only JPEG, PNG, or WebP images are allowed" };
  }

  try {
    const buffer = Buffer.from(raw.replace(/^base64,/i, ""), "base64");
    if (buffer.length === 0) return { error: "Image is empty" };
    if (buffer.length > MAX_BYTES) return { error: "Image must be under 2 MB" };
    return { mime, buffer };
  } catch {
    return { error: "Invalid image data" };
  }
}

async function deleteStoragePath(path: string | undefined | null): Promise<void> {
  if (!path) return;
  const supabase = getSupabaseAdmin();
  const { error } = await supabase.storage
    .from(MENTOR_PROFILE_BUCKET)
    .remove([path]);
  if (error) {
    console.warn(`mentor image delete failed (${path}):`, error.message);
  }
}

/**
 * Upload a new mentor headshot. Deletes any previous object for this user
 * so the bucket never keeps duplicates.
 */
export async function replaceMentorProfileImage(
  userId: string,
  previousPath: string | undefined | null,
  payload: { imageBase64: string; mimeType?: string },
): Promise<MentorImageUploadResult | { error: string }> {
  const decoded = decodeMentorImagePayload(payload);
  if ("error" in decoded) return decoded;

  await ensureMentorProfileBucket();

  const ext = EXT_BY_MIME[decoded.mime] || "jpg";
  const nextPath = `${userId}/profile-${randomUUID()}.${ext}`;
  const supabase = getSupabaseAdmin();

  const { error: uploadError } = await supabase.storage
    .from(MENTOR_PROFILE_BUCKET)
    .upload(nextPath, decoded.buffer, {
      contentType: decoded.mime,
      upsert: false,
      cacheControl: "86400",
    });

  if (uploadError) {
    return { error: `Upload failed: ${uploadError.message}` };
  }

  // Delete old after successful upload (ignore failures)
  if (previousPath && previousPath !== nextPath) {
    await deleteStoragePath(previousPath);
  }

  return {
    profileImagePath: nextPath,
    profileImageUrl: publicObjectUrl(nextPath),
  };
}

export async function removeMentorProfileImage(
  previousPath: string | undefined | null,
): Promise<void> {
  await ensureMentorProfileBucket();
  await deleteStoragePath(previousPath);
}
