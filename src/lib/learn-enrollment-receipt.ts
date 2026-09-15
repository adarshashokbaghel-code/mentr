/**
 * Colorful PDF 1.4 enrollment receipt (Helvetica) — no external deps.
 */

type PdfOp = string;

function esc(text: string): string {
  return text
    .replace(/\\/g, "\\\\")
    .replace(/\(/g, "\\(")
    .replace(/\)/g, "\\)")
    .replace(/[^\x20-\x7E]/g, "?");
}

/** 0–1 RGB helpers for brand colors */
const C = {
  ink: [0.11, 0.141, 0.204] as const,
  coral: [1, 0.416, 0.102] as const,
  teal: [0.051, 0.58, 0.533] as const,
  cream: [0.996, 0.973, 0.937] as const,
  softTeal: [0.902, 0.969, 0.957] as const,
  softCoral: [1, 0.929, 0.878] as const,
  muted: [0.4, 0.42, 0.45] as const,
  white: [1, 1, 1] as const,
  line: [0.91, 0.886, 0.847] as const,
};

class SimplePdf {
  private ops: PdfOp[] = [];

  fill(rgb: readonly [number, number, number]) {
    this.ops.push(`${rgb[0]} ${rgb[1]} ${rgb[2]} rg`);
  }

  strokeColor(rgb: readonly [number, number, number]) {
    this.ops.push(`${rgb[0]} ${rgb[1]} ${rgb[2]} RG`);
  }

  text(
    x: number,
    y: number,
    str: string,
    opts: {
      size?: number;
      bold?: boolean;
      color?: readonly [number, number, number];
    } = {},
  ) {
    const size = opts.size ?? 11;
    const font = opts.bold ? "F2" : "F1";
    const color = opts.color ?? C.ink;
    this.fill(color);
    this.ops.push(
      "BT",
      `/${font} ${size} Tf`,
      `1 0 0 1 ${x.toFixed(2)} ${y.toFixed(2)} Tm`,
      `(${esc(str)}) Tj`,
      "ET",
    );
  }

  line(
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    width = 0.8,
    color: readonly [number, number, number] = C.line,
  ) {
    this.strokeColor(color);
    this.ops.push(
      `${width} w`,
      `${x1.toFixed(2)} ${y1.toFixed(2)} m`,
      `${x2.toFixed(2)} ${y2.toFixed(2)} l`,
      "S",
    );
  }

  rect(
    x: number,
    y: number,
    w: number,
    h: number,
    opts: {
      fill?: readonly [number, number, number];
      stroke?: readonly [number, number, number];
      strokeWidth?: number;
    } = {},
  ) {
    if (opts.fill) {
      this.fill(opts.fill);
      this.ops.push(
        `${x.toFixed(2)} ${y.toFixed(2)} ${w.toFixed(2)} ${h.toFixed(2)} re`,
        "f",
      );
    }
    if (opts.stroke) {
      this.strokeColor(opts.stroke);
      this.ops.push(`${opts.strokeWidth ?? 0.8} w`);
      this.ops.push(
        `${x.toFixed(2)} ${y.toFixed(2)} ${w.toFixed(2)} ${h.toFixed(2)} re`,
        "S",
      );
    }
  }

  build(pageWidth = 595.28, pageHeight = 841.89): Blob {
    const content = `${this.ops.join("\n")}\n`;
    const contentLen = new TextEncoder().encode(content).length;
    const objects = [
      "<< /Type /Catalog /Pages 2 0 R >>",
      "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
      `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${pageWidth} ${pageHeight}] /Resources << /Font << /F1 4 0 R /F2 5 0 R >> >> /Contents 6 0 R >>`,
      "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
      "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>",
      `<< /Length ${contentLen} >>\nstream\n${content}endstream`,
    ];

    const encoder = new TextEncoder();
    let pdf = "%PDF-1.4\n";
    const offsets: number[] = [0];
    for (let i = 0; i < objects.length; i++) {
      offsets.push(encoder.encode(pdf).length);
      pdf += `${i + 1} 0 obj\n${objects[i]}\nendobj\n`;
    }
    const xrefAt = encoder.encode(pdf).length;
    pdf += `xref\n0 ${objects.length + 1}\n`;
    pdf += "0000000000 65535 f \n";
    for (let i = 1; i <= objects.length; i++) {
      pdf += `${String(offsets[i]).padStart(10, "0")} 00000 n \n`;
    }
    pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\n`;
    pdf += `startxref\n${xrefAt}\n%%EOF\n`;
    return new Blob([pdf], { type: "application/pdf" });
  }
}

export type EnrollmentReceiptData = {
  receiptNumber: string;
  courseName: string;
  courseTagline: string;
  trackLabel: string;
  modules: number;
  purchaserName: string;
  purchaserEmail: string;
  userId: string;
  purchasedAt: string | Date;
  listPriceInr: number;
  subtotalInr: number;
  taxInr: number;
  discountInr: number;
  totalInr: number;
  currency: string;
  paymentMethod: string;
  expiry: string;
};

function inr(n: number): string {
  return `INR ${n.toFixed(2)}`;
}

function formatWhen(iso: string | Date): string {
  const d = typeof iso === "string" ? new Date(iso) : iso;
  return d.toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZoneName: "short",
  });
}

const VALUE_X = 300;

function row(
  pdf: SimplePdf,
  left: number,
  y: number,
  label: string,
  value: string,
  valueColor: readonly [number, number, number] = C.ink,
) {
  pdf.text(left, y, label, { size: 10, color: C.muted });
  const v = value.length > 48 ? `${value.slice(0, 45)}...` : value;
  pdf.text(VALUE_X, y, v, { size: 10, bold: true, color: valueColor });
}

function labelPayment(method: string): string {
  if (method === "free") return "Free (no charge)";
  return method;
}

export function buildEnrollmentReceiptPdf(data: EnrollmentReceiptData): Blob {
  const pdf = new SimplePdf();
  const W = 595.28;
  const margin = 44;
  const right = W - margin;
  const contentW = right - margin;

  // Full-bleed cream page tint strip at top
  pdf.rect(0, 0, W, 841.89, { fill: C.cream });

  // Coral header bar
  pdf.rect(0, 790, W, 52, { fill: C.coral });
  pdf.text(margin, 818, "MENTR", { size: 16, bold: true, color: C.white });
  pdf.text(margin + 62, 818, "by Paprly", {
    size: 10,
    color: [1, 0.92, 0.86],
  });
  pdf.text(right - 118, 818, "ENROLLMENT RECEIPT", {
    size: 9,
    bold: true,
    color: C.white,
  });

  // Teal accent ribbon
  pdf.rect(0, 778, W, 12, { fill: C.teal });

  let y = 752;
  pdf.text(margin, y, data.receiptNumber, {
    size: 11,
    bold: true,
    color: C.ink,
  });
  pdf.text(right - 110, y, "Paid: INR 0.00", {
    size: 10,
    bold: true,
    color: C.teal,
  });
  y -= 22;

  // Course card
  pdf.rect(margin, y - 58, contentW, 70, { fill: C.softCoral });
  pdf.rect(margin, y - 58, 5, 70, { fill: C.coral });
  pdf.text(margin + 16, y - 8, data.courseName, {
    size: 18,
    bold: true,
    color: C.ink,
  });
  pdf.text(margin + 16, y - 26, data.courseTagline, {
    size: 10,
    color: C.muted,
  });
  pdf.text(
    margin + 16,
    y - 42,
    `${data.trackLabel}  ·  ${data.modules} modules  ·  Self-paced`,
    { size: 9, color: C.muted },
  );
  y -= 82;

  // Purchaser
  pdf.text(margin, y, "PURCHASER", { size: 9, bold: true, color: C.coral });
  y -= 16;
  row(pdf, margin, y, "Email", data.purchaserEmail);
  y -= 15;
  row(pdf, margin, y, "Account ID", data.userId);
  y -= 15;
  row(pdf, margin, y, "Purchased at", formatWhen(data.purchasedAt));
  y -= 22;
  pdf.line(margin, y, right, y, 1, C.coral);
  y -= 24;

  // Pricing — simple: ₹999 → ₹0
  pdf.text(margin, y, "PRICING", { size: 9, bold: true, color: C.coral });
  y -= 18;
  row(pdf, margin, y, "Course price", inr(data.listPriceInr || 999), C.muted);
  y -= 15;
  row(pdf, margin, y, "Tax (GST)", inr(data.taxInr || 0), C.muted);
  y -= 15;
  row(pdf, margin, y, "Other fees", inr(0), C.muted);
  y -= 18;

  // Amount paid highlight
  pdf.rect(margin, y - 28, contentW, 40, { fill: C.softTeal });
  pdf.rect(margin, y - 28, 5, 40, { fill: C.teal });
  pdf.text(margin + 16, y - 4, "Amount paid", {
    size: 12,
    bold: true,
    color: C.ink,
  });
  pdf.text(VALUE_X, y - 4, inr(data.totalInr), {
    size: 14,
    bold: true,
    color: C.teal,
  });
  pdf.text(margin + 16, y - 18, "Was INR 999.00  ·  now free", {
    size: 9,
    color: C.muted,
  });
  y -= 52;

  // Access
  pdf.text(margin, y, "ACCESS", { size: 9, bold: true, color: C.coral });
  y -= 16;
  row(pdf, margin, y, "Payment method", labelPayment(data.paymentMethod));
  y -= 15;
  row(
    pdf,
    margin,
    y,
    "Expiry / access",
    data.expiry === "lifetime" ? "Lifetime" : data.expiry,
    C.teal,
  );
  y -= 15;
  row(pdf, margin, y, "Currency", data.currency || "INR");
  y -= 15;
  row(pdf, margin, y, "Status", "Active enrollment", C.teal);
  y -= 28;

  pdf.rect(margin, y - 52, contentW, 64, {
    fill: C.white,
    stroke: C.teal,
    strokeWidth: 1.2,
  });
  pdf.text(margin + 14, y - 10, "Notes", {
    size: 9,
    bold: true,
    color: C.teal,
  });
  pdf.text(
    margin + 14,
    y - 26,
    "Confirms free enrollment in Mentr Starter (Class 3-5).",
    { size: 9, color: C.muted },
  );
  pdf.text(
    margin + 14,
    y - 40,
    "Lifetime access. This is a receipt, not a tax invoice.",
    { size: 9, color: C.muted },
  );

  y -= 88;
  pdf.line(margin, y, right, y, 0.6, C.line);
  y -= 16;
  pdf.text(
    margin,
    y,
    "Mentr is a Paprly product. Parents find teachers. Faculty get found. Free.",
    { size: 8, color: C.muted },
  );

  return pdf.build();
}

export function downloadEnrollmentReceipt(data: EnrollmentReceiptData) {
  const blob = buildEnrollmentReceiptPdf(data);
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `mentr-starter-receipt-${data.receiptNumber}.pdf`;
  a.click();
  URL.revokeObjectURL(url);
}

/** Staggered downloads for admin bulk export (browser-safe). */
export async function downloadEnrollmentReceipts(
  items: EnrollmentReceiptData[],
  delayMs = 350,
) {
  for (const item of items) {
    downloadEnrollmentReceipt(item);
    await new Promise((r) => setTimeout(r, delayMs));
  }
}
