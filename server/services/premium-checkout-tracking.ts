import {
  PREMIUM_CHECKOUT_EVENTS,
  PremiumCheckoutEvent,
  type PremiumCheckoutEventType,
} from "../models/PremiumCheckoutEvent";
import { User } from "../models/User";

export function parseCheckoutEvent(raw: unknown): PremiumCheckoutEventType | null {
  const v = String(raw || "");
  return (PREMIUM_CHECKOUT_EVENTS as readonly string[]).includes(v)
    ? (v as PremiumCheckoutEventType)
    : null;
}

/** Best-effort — never throws, so tracking can't break checkout. */
export async function recordPremiumCheckoutEvent(opts: {
  userId: string;
  event: PremiumCheckoutEventType;
  months?: number;
  currency?: string;
  orderId?: string;
  source?: string;
}) {
  try {
    const user = await User.findById(opts.userId)
      .select("role email profile.name profile.phoneNumber")
      .lean<{
        role?: string;
        email?: string;
        profile?: { name?: string; phoneNumber?: string };
      }>();
    if (!user) return;
    const months = Number(opts.months);
    await PremiumCheckoutEvent.create({
      user: opts.userId,
      event: opts.event,
      role: user.role || "unknown",
      name: user.profile?.name || undefined,
      email: user.email || undefined,
      phone: user.profile?.phoneNumber || undefined,
      months: Number.isFinite(months) && months >= 1 && months <= 12 ? months : undefined,
      currency: opts.currency ? String(opts.currency).slice(0, 8) : undefined,
      orderId: opts.orderId ? String(opts.orderId).slice(0, 64) : undefined,
      source: opts.source ? String(opts.source).slice(0, 200) : undefined,
    });
  } catch (err) {
    console.error("[premium-checkout] track failed:", err);
  }
}

const STAGE_RANK: Record<PremiumCheckoutEventType, number> = {
  opened: 1,
  dismissed: 2,
  pay_clicked: 3,
  failed: 4,
  paid: 5,
};

/** One row per user: furthest stage reached, last activity, open count. */
export async function listPremiumCheckoutLeads(opts: { days: number }) {
  const since = new Date(Date.now() - opts.days * 24 * 60 * 60 * 1000);
  const events = await PremiumCheckoutEvent.find({ createdAt: { $gte: since } })
    .sort({ createdAt: 1 })
    .lean<
      Array<{
        user: { toString(): string };
        event: PremiumCheckoutEventType;
        role: string;
        name?: string;
        email?: string;
        phone?: string;
        months?: number;
        currency?: string;
        source?: string;
        createdAt: Date;
      }>
    >();

  type Lead = {
    userId: string;
    name: string | null;
    email: string | null;
    phone: string | null;
    role: string;
    opens: number;
    payClicks: number;
    furthestStage: PremiumCheckoutEventType;
    lastEvent: PremiumCheckoutEventType;
    firstSeenAt: string;
    lastSeenAt: string;
    lastMonths: number | null;
    lastCurrency: string | null;
    lastSource: string | null;
    paid: boolean;
  };

  const byUser = new Map<string, Lead>();
  for (const e of events) {
    const id = e.user.toString();
    const at = e.createdAt.toISOString();
    const lead =
      byUser.get(id) ??
      ({
        userId: id,
        name: null,
        email: null,
        phone: null,
        role: e.role,
        opens: 0,
        payClicks: 0,
        furthestStage: e.event,
        lastEvent: e.event,
        firstSeenAt: at,
        lastSeenAt: at,
        lastMonths: null,
        lastCurrency: null,
        lastSource: null,
        paid: false,
      } satisfies Lead);
    lead.name = e.name || lead.name;
    lead.email = e.email || lead.email;
    lead.phone = e.phone || lead.phone;
    lead.role = e.role || lead.role;
    if (e.event === "opened") lead.opens += 1;
    if (e.event === "pay_clicked") lead.payClicks += 1;
    if (e.event === "paid") lead.paid = true;
    if (STAGE_RANK[e.event] > STAGE_RANK[lead.furthestStage]) {
      lead.furthestStage = e.event;
    }
    lead.lastEvent = e.event;
    lead.lastSeenAt = at;
    if (e.months) lead.lastMonths = e.months;
    if (e.currency) lead.lastCurrency = e.currency;
    if (e.source) lead.lastSource = e.source;
    byUser.set(id, lead);
  }

  // Latest contact details from the profile (phone may be added after the event).
  const ids = [...byUser.keys()];
  if (ids.length) {
    const users = await User.find({ _id: { $in: ids } })
      .select("email profile.name profile.phoneNumber")
      .lean<
        Array<{
          _id: { toString(): string };
          email?: string;
          profile?: { name?: string; phoneNumber?: string };
        }>
      >();
    for (const u of users) {
      const lead = byUser.get(u._id.toString());
      if (!lead) continue;
      lead.name = u.profile?.name || lead.name;
      lead.email = u.email || lead.email;
      lead.phone = u.profile?.phoneNumber || lead.phone;
    }
  }

  const leads = [...byUser.values()].sort((a, b) =>
    b.lastSeenAt.localeCompare(a.lastSeenAt),
  );
  return {
    leads,
    stats: {
      users: leads.length,
      opened: leads.filter((l) => l.opens > 0).length,
      payClicked: leads.filter((l) => l.payClicks > 0).length,
      paid: leads.filter((l) => l.paid).length,
      abandoned: leads.filter((l) => !l.paid).length,
    },
  };
}
