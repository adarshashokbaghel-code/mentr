import { randomUUID } from "crypto";
import {
  ensureMentorProfileBucket,
  getSupabaseAdmin,
  publicObjectUrl,
} from "../lib/supabase";
import { MENTOR_PROFILE_BUCKET } from "../lib/supabase-secrets";
import { decodeMentorImagePayload } from "./mentor-profile-image";

/**
 * Upload a premium-mentor payment screenshot.
 * Reuses the mentrs_profile bucket under premium-ss/{userId}/…
 */
export async function uploadPremiumPaymentScreenshot(
  userId: string,
  previousPath: string | undefined | null,
  payload: { imageBase64: string; mimeType?: string },
): Promise<{ url: string; path: string } | { error: string }> {
  const decoded = decodeMentorImagePayload({
    ...payload,
    maxBytes: 8 * 1024 * 1024,
  });
  if ("error" in decoded) return decoded;

  await ensureMentorProfileBucket();

  const ext =
    decoded.mime === "image/png"
      ? "png"
      : decoded.mime === "image/webp"
        ? "webp"
        : "jpg";
  const nextPath = `premium-ss/${userId}/pay-${randomUUID()}.${ext}`;
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

  if (previousPath && previousPath !== nextPath) {
    const { error } = await supabase.storage
      .from(MENTOR_PROFILE_BUCKET)
      .remove([previousPath]);
    if (error) {
      console.warn("premium ss delete failed:", error.message);
    }
  }

  return {
    path: nextPath,
    url: publicObjectUrl(nextPath),
  };
}
