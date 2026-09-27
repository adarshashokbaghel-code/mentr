/**
 * GA4 funnel events: sign_up → profile_complete → begin_checkout → purchase.
 * Never send PII (email, phone, name) in event params.
 */

type GtagFn = (...args: unknown[]) => void;

declare global {
  interface Window {
    gtag?: GtagFn;
    dataLayer?: unknown[];
  }
}

const ONCE_PREFIX = "mentr_ga_once:";

function gtagSafe(...args: unknown[]) {
  if (typeof window === "undefined") return;
  try {
    if (typeof window.gtag === "function") {
      window.gtag(...args);
      return;
    }
    // gtag.js not loaded yet — install the standard stub; gtag.js replays dataLayer.
    window.dataLayer = window.dataLayer || [];
    window.gtag = function gtag() {
      // eslint-disable-next-line prefer-rest-params
      window.dataLayer!.push(arguments);
    };
    window.gtag(...args);
  } catch {
    /* ignore */
  }
}

/** Fire at most once per browser for a given key (survives reloads / retries). */
function once(key: string): boolean {
  try {
    const k = ONCE_PREFIX + key;
    if (localStorage.getItem(k)) return false;
    localStorage.setItem(k, "1");
  } catch {
    /* storage blocked — still send */
  }
  return true;
}

export type AnalyticsUserType = "mentor" | "parent";

export function toUserType(role: string | undefined | null): AnalyticsUserType {
  return role === "parent" ? "parent" : "mentor";
}

export function trackSignUp(opts: { userId: string; role: string }) {
  if (!once(`sign_up:${opts.userId}`)) return;
  gtagSafe("event", "sign_up", {
    method: "otp",
    user_type: toUserType(opts.role),
  });
}

export function trackProfileComplete(opts: { userId: string; role: string }) {
  if (!once(`profile_complete:${opts.userId}`)) return;
  gtagSafe("event", "profile_complete", {
    user_type: toUserType(opts.role),
  });
}

type PremiumItem = { months: number; value: number; currency: string };

function premiumItems({ months, value, currency }: PremiumItem) {
  return [
    {
      item_id: `premium_${months}m`,
      item_name: `Premium Mentor — ${months} months`,
      item_category: "premium_mentor",
      price: value,
      quantity: 1,
      currency,
    },
  ];
}

export function trackBeginCheckout(opts: PremiumItem & { orderId: string }) {
  if (!once(`begin_checkout:${opts.orderId}`)) return;
  gtagSafe("event", "begin_checkout", {
    currency: opts.currency,
    value: opts.value,
    items: premiumItems(opts),
  });
}

/** Call only after the backend has verified the Razorpay payment. */
export function trackPurchase(
  opts: PremiumItem & { transactionId: string },
) {
  if (!opts.transactionId || !once(`purchase:${opts.transactionId}`)) return;
  gtagSafe("event", "purchase", {
    transaction_id: opts.transactionId,
    currency: opts.currency,
    value: opts.value,
    items: premiumItems(opts),
  });
}
