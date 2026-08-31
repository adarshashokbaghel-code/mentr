/** Secret URL slug — panel at /admintestingistrueonlyman134hsydsudy4 (no login). */
export const ADMIN_PANEL_KEY = "admintestingistrueonlyman134hsydsudy4";

export function isValidAdminKey(provided: string): boolean {
  if (!provided) return false;
  const envKey = process.env.ADMIN_SECRET_KEY || "";
  if (envKey && provided === envKey) return true;
  return provided === ADMIN_PANEL_KEY;
}
