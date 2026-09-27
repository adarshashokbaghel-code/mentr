import type { Request } from "express";
import { config } from "../config";
import {
  PREMIUM_CURRENCIES,
  type PremiumCurrency,
} from "./premium-mentor-plans";

/** ISO country from edge headers (Vercel / Cloudflare). Null in local dev. */
export function countryFromRequest(req: Request): string | null {
  const raw =
    req.headers["x-vercel-ip-country"] ||
    req.headers["cf-ipcountry"] ||
    req.headers["x-country-code"];
  const v = String(Array.isArray(raw) ? raw[0] : raw || "")
    .trim()
    .toUpperCase();
  return /^[A-Z]{2}$/.test(v) && v !== "XX" && v !== "T1" ? v : null;
}

export function isInternationalBillingEnabled(): boolean {
  return config.razorpay.internationalEnabled;
}

export function parsePremiumCurrency(raw: unknown): PremiumCurrency | null {
  const v = String(raw || "").trim().toUpperCase();
  return (PREMIUM_CURRENCIES as string[]).includes(v)
    ? (v as PremiumCurrency)
    : null;
}

/**
 * Server decides the charge currency. Both prices are fixed server-side, so a
 * client override only picks which fixed price applies — never the amount.
 */
export function resolvePremiumCurrency(opts: {
  country: string | null;
  requested?: PremiumCurrency | null;
}): PremiumCurrency {
  if (!isInternationalBillingEnabled()) return "INR";
  if (opts.requested) return opts.requested;
  if (opts.country && opts.country !== "IN") return "USD";
  return "INR";
}

const EURO_COUNTRIES = [
  "AT", "BE", "CY", "DE", "EE", "ES", "FI", "FR", "GR", "HR", "IE", "IT",
  "LT", "LU", "LV", "MT", "NL", "PT", "SI", "SK",
];

const COUNTRY_CURRENCY: Record<string, string> = {
  US: "USD", GB: "GBP", CA: "CAD", AU: "AUD", NZ: "NZD", SG: "SGD",
  AE: "AED", SA: "SAR", QA: "QAR", KW: "KWD", OM: "OMR", BH: "BHD",
  MY: "MYR", ID: "IDR", TH: "THB", PH: "PHP", VN: "VND", JP: "JPY",
  KR: "KRW", CN: "CNY", HK: "HKD", TW: "TWD", NP: "NPR", LK: "LKR",
  BD: "BDT", PK: "PKR", ZA: "ZAR", NG: "NGN", KE: "KES", EG: "EGP",
  CH: "CHF", SE: "SEK", NO: "NOK", DK: "DKK", PL: "PLN", CZ: "CZK",
  HU: "HUF", RO: "RON", TR: "TRY", IL: "ILS", BR: "BRL", MX: "MXN",
  AR: "ARS", CL: "CLP", CO: "COP", PE: "PEN", RU: "RUB", UA: "UAH",
  ...Object.fromEntries(EURO_COUNTRIES.map((c) => [c, "EUR"])),
};

export function localCurrencyForCountry(country: string | null): string | null {
  if (!country) return null;
  return COUNTRY_CURRENCY[country] || null;
}

const FX_TTL_MS = 12 * 60 * 60 * 1000;
const FX_TIMEOUT_MS = 3000;
let fxCache: { at: number; rates: Record<string, number> } | null = null;
let fxInflight: Promise<Record<string, number> | null> | null = null;

/** USD-based rates for display estimates only — never used to compute a charge. */
async function fetchUsdRates(): Promise<Record<string, number> | null> {
  if (fxCache && Date.now() - fxCache.at < FX_TTL_MS) return fxCache.rates;
  if (!fxInflight) {
    fxInflight = (async () => {
      try {
        const ctrl = new AbortController();
        const timer = setTimeout(() => ctrl.abort(), FX_TIMEOUT_MS);
        const res = await fetch("https://open.er-api.com/v6/latest/USD", {
          signal: ctrl.signal,
        });
        clearTimeout(timer);
        if (!res.ok) return fxCache?.rates ?? null;
        const data = (await res.json()) as {
          result?: string;
          rates?: Record<string, number>;
        };
        if (data.result !== "success" || !data.rates) {
          return fxCache?.rates ?? null;
        }
        fxCache = { at: Date.now(), rates: data.rates };
        return data.rates;
      } catch {
        return fxCache?.rates ?? null;
      } finally {
        fxInflight = null;
      }
    })();
  }
  return fxInflight;
}

export type PremiumBillingContext = {
  country: string | null;
  currency: PremiumCurrency;
  internationalEnabled: boolean;
  availableCurrencies: PremiumCurrency[];
  /** Approximate local-currency estimate for USD prices (display only). */
  local: { currency: string; usdRate: number } | null;
};

export async function buildPremiumBillingContext(
  req: Request,
): Promise<PremiumBillingContext> {
  const country = countryFromRequest(req);
  const internationalEnabled = isInternationalBillingEnabled();
  const currency = resolvePremiumCurrency({ country });
  let local: PremiumBillingContext["local"] = null;

  const localCurrency = localCurrencyForCountry(country);
  if (internationalEnabled && localCurrency && localCurrency !== "USD") {
    const rates = await fetchUsdRates();
    const rate = rates?.[localCurrency];
    if (rate && Number.isFinite(rate) && rate > 0) {
      local = { currency: localCurrency, usdRate: rate };
    }
  }

  return {
    country,
    currency,
    internationalEnabled,
    availableCurrencies: internationalEnabled ? ["INR", "USD"] : ["INR"],
    local,
  };
}
