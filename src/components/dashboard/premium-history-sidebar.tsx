"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import type { PremiumPaymentRow } from "@/lib/api";
import { cn } from "@/lib/utils";
import { Download, Receipt, X } from "lucide-react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

function formatInr(n: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);
}

function formatDate(iso: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatDay(iso: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function ReceiptCard({
  payment,
  mentorName,
  mentorEmail,
}: {
  payment: PremiumPaymentRow;
  mentorName: string;
  mentorEmail: string;
}) {
  return (
    <article className="overflow-hidden rounded-xl border border-hairline bg-white shadow-sm print:shadow-none">
      <div className="flex items-start justify-between gap-3 border-b border-hairline bg-gradient-to-r from-ink to-[#1a3d32] px-4 py-4 text-white">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-butter">
            Mentr · Premium
          </p>
          <h3 className="mt-1 text-base font-bold">Payment receipt</h3>
          <p className="mt-0.5 font-mono text-[11px] text-white/70">
            {payment.receiptNumber}
          </p>
        </div>
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-butter text-ink">
          <Receipt className="h-4 w-4" />
        </span>
      </div>

      <div className="space-y-3 px-4 py-4 text-sm">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wide text-muted">
              Billed to
            </p>
            <p className="mt-0.5 font-semibold text-ink">{mentorName}</p>
            <p className="truncate text-xs text-muted">{mentorEmail}</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-bold uppercase tracking-wide text-muted">
              Paid on
            </p>
            <p className="mt-0.5 font-semibold text-ink">
              {formatDay(payment.paidAt)}
            </p>
            <p className="text-xs capitalize text-muted">
              {payment.method || "Razorpay"}
            </p>
          </div>
        </div>

        <Separator className="bg-hairline" />

        <div className="space-y-1.5">
          <div className="flex justify-between gap-2">
            <span className="text-muted">
              Premium Mentor · {payment.months} months
            </span>
            <span className="font-medium text-ink">
              {formatInr(payment.listInr)}
            </span>
          </div>
          {payment.discountInr > 0 ? (
            <div className="flex justify-between gap-2 text-sage">
              <span>Discount ({payment.discountPercent}%)</span>
              <span>−{formatInr(payment.discountInr)}</span>
            </div>
          ) : null}
          <div className="flex justify-between gap-2 border-t border-dashed border-hairline pt-2">
            <span className="font-bold text-ink">Amount paid</span>
            <span className="text-base font-bold text-ink">
              {formatInr(payment.amountInr)}
            </span>
          </div>
          <p className="text-[11px] text-muted">
            List ${payment.listUsd} USD · FX ≈ ₹{payment.usdToInr}/$ · No GST
            collected on this charge
          </p>
        </div>

        <div className="rounded-lg bg-cream/80 px-3 py-2.5 text-xs text-muted">
          <p>
            <span className="font-semibold text-ink">Coverage: </span>
            {formatDay(payment.periodStart)} → {formatDay(payment.periodEnd)}
          </p>
          <p className="mt-1 text-[11px] leading-snug">
            Covers Premium Mentor plan access for this period (features as listed
            at purchase).
          </p>
          <p className="mt-1 break-all">
            <span className="font-semibold text-ink">Payment ID: </span>
            {payment.razorpayPaymentId || "—"}
          </p>
          <p className="mt-0.5 break-all">
            <span className="font-semibold text-ink">Order ID: </span>
            {payment.razorpayOrderId}
          </p>
        </div>

        <p className="text-[10px] leading-relaxed text-muted">
          Payment confirmation only — not a GST tax invoice. Processed via
          Razorpay on an individual merchant account. Subject to Mentr Terms of
          service and Privacy policy (mentr.in/terms · mentr.in/privacy).
          hello@mentr.in
        </p>
      </div>
    </article>
  );
}

export function PremiumHistorySidebar({
  open,
  onClose,
  payments,
  mentorName,
  mentorEmail,
}: {
  open: boolean;
  onClose: () => void;
  payments: PremiumPaymentRow[];
  mentorName: string;
  mentorEmail: string;
}) {
  const [selected, setSelected] = useState<PremiumPaymentRow | null>(null);

  useEffect(() => {
    if (!open) {
      setSelected(null);
      return;
    }
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (selected) setSelected(null);
        else onClose();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose, selected]);

  useEffect(() => {
    if (open && payments.length && !selected) {
      setSelected(payments[0] || null);
    }
  }, [open, payments, selected]);

  if (!open || typeof document === "undefined") return null;

  return createPortal(
    <div className="fixed inset-0 z-[180] flex justify-end">
      <button
        type="button"
        className="absolute inset-0 bg-ink/40 backdrop-blur-[2px]"
        aria-label="Close history"
        onClick={onClose}
      />
      <aside
        className={cn(
          "relative z-10 flex h-full w-full max-w-md flex-col bg-cream shadow-2xl",
          "animate-in slide-in-from-right duration-200",
        )}
        role="dialog"
        aria-modal="true"
        aria-label="Premium payment history"
      >
        <header className="flex items-center justify-between gap-3 border-b border-hairline bg-white px-4 py-3.5">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wide text-muted">
              Premium
            </p>
            <h2 className="text-base font-bold text-ink">Payment history</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-muted transition hover:bg-cream hover:text-ink"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </header>

        <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto p-4">
          {payments.length === 0 ? (
            <p className="rounded-xl border border-dashed border-hairline bg-white px-4 py-10 text-center text-sm text-muted">
              No successful payments yet.
            </p>
          ) : (
            <>
              <ul className="space-y-2">
                {payments.map((p) => (
                  <li key={p.id}>
                    <button
                      type="button"
                      onClick={() => setSelected(p)}
                      className={cn(
                        "flex w-full items-center justify-between gap-3 rounded-xl border bg-white px-3 py-3 text-left transition",
                        selected?.id === p.id
                          ? "border-sage/50 ring-2 ring-sage/20"
                          : "border-hairline hover:border-ink/20",
                      )}
                    >
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-ink">
                          {p.months} months · {formatInr(p.amountInr)}
                        </p>
                        <p className="text-xs text-muted">
                          {formatDate(p.paidAt)}
                        </p>
                      </div>
                      <span className="shrink-0 rounded-md bg-sage-wash px-1.5 py-0.5 text-[10px] font-bold uppercase text-sage">
                        Paid
                      </span>
                    </button>
                  </li>
                ))}
              </ul>

              {selected ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold uppercase tracking-wide text-muted">
                      Receipt
                    </p>
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      onClick={() => window.print()}
                    >
                      <Download className="h-3.5 w-3.5" />
                      Print / save
                    </Button>
                  </div>
                  <div className="print:fixed print:inset-0 print:z-[999] print:bg-white print:p-6">
                    <ReceiptCard
                      payment={selected}
                      mentorName={mentorName}
                      mentorEmail={mentorEmail}
                    />
                  </div>
                </div>
              ) : null}
            </>
          )}
        </div>
      </aside>
    </div>,
    document.body,
  );
}
