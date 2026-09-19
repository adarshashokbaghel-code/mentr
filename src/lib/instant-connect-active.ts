/** Client events + brief post-submit flag for Instant Connect dock. */

export const IC_ACTIVE_CHANGED = "mentr:ic-active-changed";

/** How long the dock shows “Track request” after a successful send. */
export const IC_TRACK_FLASH_MS = 12_000;

const SENT_AT_KEY = "mentr_ic_sent_at";

export function readIcSentAt(): number | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(SENT_AT_KEY);
    if (!raw) return null;
    const n = Number(raw);
    return Number.isFinite(n) ? n : null;
  } catch {
    return null;
  }
}

export function writeIcSentAt(ts: number | null) {
  if (typeof window === "undefined") return;
  try {
    if (ts == null) sessionStorage.removeItem(SENT_AT_KEY);
    else sessionStorage.setItem(SENT_AT_KEY, String(ts));
  } catch {
    /* ignore */
  }
}

/** Remaining ms to show Track request (0 if expired / never sent). */
export function icTrackFlashRemaining(now = Date.now()): number {
  const sentAt = readIcSentAt();
  if (sentAt == null) return 0;
  const left = IC_TRACK_FLASH_MS - (now - sentAt);
  return left > 0 ? left : 0;
}

export function notifyIcActiveChanged(active: boolean) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent(IC_ACTIVE_CHANGED, { detail: { active } }),
  );
}

/** Call after a parent successfully creates an Instant Connect request. */
export function notifyIcRequestSent() {
  writeIcSentAt(Date.now());
  notifyIcActiveChanged(true);
}

/** Clear the brief track flash (e.g. after TTL). */
export function clearIcTrackFlash() {
  writeIcSentAt(null);
  notifyIcActiveChanged(false);
}
