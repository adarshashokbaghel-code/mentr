"use client";

import { useAuth } from "@/components/auth/auth-provider";
import { profileApi } from "@/lib/api";
import { homeFor } from "@/lib/auth-routes";
import { cn } from "@/lib/utils";
import { MentrBrand } from "@/components/ui/mentr-brand";
import { Loader2, MapPin, Phone, User } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

const field =
  "mt-1.5 h-11 w-full rounded-md border border-[#e5e2dc] bg-white px-3 text-[15px] text-ink outline-none placeholder:text-[#a39e96] focus:border-ink";

function ParentProfilingContent() {
  const { user, loading, setUser } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || undefined;

  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [country, setCountry] = useState("India");
  const [city, setCity] = useState("Bengaluru");
  const [area, setArea] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [prefilled, setPrefilled] = useState(false);

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.replace(next ? `/parent?next=${encodeURIComponent(next)}` : "/parent");
      return;
    }
    if (user.role !== "parent") {
      router.replace(homeFor(user));
      return;
    }
    if (!prefilled && user.parentProfile) {
      setName(user.parentProfile.name ?? "");
      setPhoneNumber(user.parentProfile.phoneNumber ?? "");
      setCountry(user.parentProfile.country || "India");
      setCity(user.parentProfile.city || "Bengaluru");
      setArea(user.parentProfile.area ?? "");
      setPrefilled(true);
    }
  }, [loading, user, router, next, prefilled]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      const { user: updated } = await profileApi.saveParent({
        name: name.trim(),
        phoneNumber: phoneNumber.trim(),
        country: country.trim(),
        city: city.trim(),
        area: area.trim() || undefined,
      });
      setUser(updated);
      router.replace(next || "/search");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setSaving(false);
    }
  }

  if (loading || !user || user.role !== "parent") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-cream text-sm text-muted">
        Loading…
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-cream">
      <header className="flex items-center justify-between px-5 py-4 sm:px-8">
        <MentrBrand href="/" logoClassName="h-6" />
        <span className="rounded-md bg-sage-wash px-2.5 py-1 text-xs font-semibold text-sage">
          Parent account
        </span>
      </header>

      <main className="flex flex-1 items-center justify-center px-4 pb-14 pt-4 sm:px-6">
        <div className="w-full max-w-[440px]">
          <div className="mb-6">
            <h1 className="text-[26px] font-bold tracking-tight text-ink sm:text-[28px]">
              Almost there
            </h1>
            <p className="mt-1.5 text-sm text-muted">
              A few basics so tutors know who&apos;s reaching out. Takes under a
              minute.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="rounded-lg border border-hairline bg-white p-5 sm:p-6"
          >
            <div className="space-y-4">
              <label className="block">
                <span className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-ink">
                  <User className="h-3.5 w-3.5 text-muted" />
                  Full name
                </span>
                <input
                  type="text"
                  required
                  autoFocus
                  autoComplete="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  className={field}
                />
              </label>

              <label className="block">
                <span className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-ink">
                  <Phone className="h-3.5 w-3.5 text-muted" />
                  WhatsApp number
                </span>
                <input
                  type="tel"
                  required
                  autoComplete="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="+91 98XXXXXXXX"
                  className={field}
                />
                <span className="mt-1 block text-xs text-muted">
                  Used only when you contact a tutor — never shown publicly.
                </span>
              </label>

              <div className="grid grid-cols-2 gap-3">
                <label className="block">
                  <span className="text-[13px] font-semibold text-ink">
                    Country
                  </span>
                  <input
                    type="text"
                    required
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className={field}
                  />
                </label>
                <label className="block">
                  <span className="text-[13px] font-semibold text-ink">
                    City
                  </span>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className={field}
                  />
                </label>
              </div>

              <label className="block">
                <span className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-ink">
                  <MapPin className="h-3.5 w-3.5 text-muted" />
                  Area / locality{" "}
                  <span className="font-normal text-muted">(optional)</span>
                </span>
                <input
                  type="text"
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  placeholder="e.g. HSR Layout"
                  className={field}
                />
              </label>
            </div>

            {error && (
              <p className="mt-4 text-sm font-medium text-coral-dark">{error}</p>
            )}

            <button
              type="submit"
              disabled={saving}
              className={cn(
                "mt-5 flex h-11 w-full items-center justify-center gap-2 rounded-md bg-coral text-[15px] font-semibold text-white transition hover:bg-coral-dark disabled:opacity-60",
              )}
            >
              {saving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Save & find teachers"
              )}
            </button>
          </form>

          <p className="mt-4 text-center text-xs text-muted">
            Free forever for parents. Tutors keep 100% of what you pay them.
          </p>
        </div>
      </main>
    </div>
  );
}

export default function ParentProfilingPage() {
  return (
    <Suspense fallback={null}>
      <ParentProfilingContent />
    </Suspense>
  );
}
