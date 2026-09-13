/**
 * Supabase credentials for mentor profile image storage.
 * SERVER-ONLY — never import this from `src/` or any client bundle.
 * Service role bypasses RLS; keep it off the browser.
 */

export const SUPABASE_PROJECT_REF = "mxozthpttmuyusnrmhog";

export const SUPABASE_URL = `https://${SUPABASE_PROJECT_REF}.supabase.co`;

/** Browser / anon JWT (legacy) */
export const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im14b3p0aHB0dG11eXVzbnJtaG9nIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODkyNzkwNjMsImV4cCI6MjEwNDg1NTA2M30.Zme0b4VcYwS7PwyzlpeyuRLQb6bk_L0leXSaamaNylI";

/** New-style publishable key */
export const SUPABASE_PUBLISHABLE_KEY =
  "sb_publishable_8bgoLSQxQcUDPGc6qrmsZA_-5Bm7zBR";

/** Service role — storage admin (bucket create / upload / delete). Server only. */
export const SUPABASE_SERVICE_ROLE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im14b3p0aHB0dG11eXVzbnJtaG9nIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4OTI3OTA2MywiZXhwIjoyMTA0ODU1MDYzfQ.2bebsE1Tt2vtLVEcDMktyKY-yeJqwCvJuI-3pyg3YY8";

/** Public bucket for mentor headshots */
export const MENTOR_PROFILE_BUCKET = "mentrs_profile";
