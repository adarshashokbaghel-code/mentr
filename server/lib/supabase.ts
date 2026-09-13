import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import {
  MENTOR_PROFILE_BUCKET,
  SUPABASE_SERVICE_ROLE_KEY,
  SUPABASE_URL,
} from "./supabase-secrets";

let adminClient: SupabaseClient | null = null;
let bucketReady: Promise<void> | null = null;

/** Service-role client — storage CRUD only. Never expose to the browser. */
export function getSupabaseAdmin(): SupabaseClient {
  if (!adminClient) {
    adminClient = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }
  return adminClient;
}

/**
 * Creates `mentrs_profile` if missing (idempotent).
 * Public read so listing cards can load images without signed URLs.
 */
export async function ensureMentorProfileBucket(): Promise<void> {
  if (!bucketReady) {
    bucketReady = (async () => {
      const supabase = getSupabaseAdmin();
      const { data: buckets, error: listError } =
        await supabase.storage.listBuckets();
      if (listError) {
        throw new Error(`Failed to list storage buckets: ${listError.message}`);
      }

      const exists = buckets?.some((b) => b.name === MENTOR_PROFILE_BUCKET);
      if (exists) return;

      const { error: createError } = await supabase.storage.createBucket(
        MENTOR_PROFILE_BUCKET,
        {
          public: true,
          fileSizeLimit: 2 * 1024 * 1024,
          allowedMimeTypes: ["image/jpeg", "image/png", "image/webp"],
        },
      );

      // Concurrent create races → treat "already exists" as success
      if (
        createError &&
        !/already exists|duplicate|resource already/i.test(createError.message)
      ) {
        throw new Error(
          `Failed to create bucket ${MENTOR_PROFILE_BUCKET}: ${createError.message}`,
        );
      }
    })().catch((err) => {
      bucketReady = null;
      throw err;
    });
  }
  return bucketReady;
}

export function publicObjectUrl(path: string): string {
  const { data } = getSupabaseAdmin()
    .storage.from(MENTOR_PROFILE_BUCKET)
    .getPublicUrl(path);
  return data.publicUrl;
}
